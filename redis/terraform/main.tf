terraform {
  required_version = "~> 1.0"
}

provider "aws" {
  region = var.aws_region
}

# network/vpc
module "vpc" {
  source  = "Young-ook/vpc/aws"
  version = "1.0.5"
  name    = join("-", [var.name, "vpc"])
  tags    = var.tags
  vpc_config = var.use_default_vpc ? null : {
    cidr        = var.cidr
    azs         = var.azs
    subnet_type = "private"
    single_ngw  = true
  }
}

### cache/redis
module "redis" {
  depends_on = [module.vpc]
  source     = "Young-ook/aurora/aws//modules/redis"
  version    = "2.2.1"
  name       = join("-", [var.name, "redis"])
  tags       = merge(local.default-tags, var.tags)
  vpc        = module.vpc.vpc.id
  subnets    = values(module.vpc.subnets["private"])
  cidrs      = [var.cidr]
  cluster = {
    engine_version             = "6.x"
    port                       = "6379"
    node_type                  = "cache.t2.micro"
    num_node_groups            = 3
    replicas_per_node_group    = 2
    automatic_failover_enabled = true
    multi_az_enabled           = true
    transit_encryption_enabled = true
  }
}

### application/eks
module "eks" {
  source             = "Young-ook/eks/aws"
  version            = "2.0.6"
  name               = join("-", [var.name, "eks"])
  tags               = var.tags
  subnets            = values(module.vpc.subnets[var.use_default_vpc ? "public" : "private"])
  kubernetes_version = var.kubernetes_version
  enable_ssm         = true
  managed_node_groups = [
    {
      name          = "redispy"
      instance_type = "t3.medium"
    },
  ]
}

provider "helm" {
  kubernetes {
    host                   = module.eks.kubeauth.host
    token                  = module.eks.kubeauth.token
    cluster_ca_certificate = module.eks.kubeauth.ca
  }
}

module "ctl" {
  depends_on = [module.eks]
  source     = "Young-ook/eks/aws//modules/helm-addons"
  version    = "2.0.3"
  tags       = var.tags
  addons = [
    {
      repository     = "https://aws.github.io/eks-charts"
      name           = "aws-cloudwatch-metrics"
      chart_name     = "aws-cloudwatch-metrics"
      namespace      = "kube-system"
      serviceaccount = "aws-cloudwatch-metrics"
      values = {
        "clusterName" = module.eks.cluster.name
      }
      oidc        = module.eks.oidc
      policy_arns = ["arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"]
    },
    {
      repository     = "https://aws.github.io/eks-charts"
      name           = "aws-for-fluent-bit"
      chart_name     = "aws-for-fluent-bit"
      namespace      = "kube-system"
      serviceaccount = "aws-for-fluent-bit"
      values = {
        "cloudWatch.enabled"      = true
        "cloudWatch.region"       = var.aws_region
        "cloudWatch.logGroupName" = format("/aws/containerinsights/%s/application", module.eks.cluster.name)
        "firehose.enabled"        = false
        "kinesis.enabled"         = false
        "elasticsearch.enabled"   = false
      }
      oidc        = module.eks.oidc
      policy_arns = ["arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"]
    },
  ]
}

### application/build
module "ci" {
  source  = "Young-ook/spinnaker/aws//modules/codebuild"
  version = "2.3.2"
  name    = var.name
  tags    = var.tags
  policy_arns = [
    module.ecr.policy_arns["write"],
    module.ecr.policy_arns["read"]
  ]
  project = {
    source = {
      type      = "GITHUB"
      location  = "https://github.com/aws-samples/chaos-engineering-with-aws-fault-injection-simulator.git"
      buildspec = "redis/terraform/redispy/buildspec.yml"
      version   = "main"
    }
    environment = {
      image           = "aws/codebuild/standard:5.0"
      privileged_mode = true
      environment_variables = {
        AWS_REGION = var.aws_region
        APP_SRC    = join("/", ["redis/terraform/redispy"])
        ECR_URI    = module.ecr.url
      }
    }
  }
  log = {
    cloudwatch_logs = {
      group_name = module.logs["codebuild"].log_group.name
    }
  }
}

### application/repo
module "ecr" {
  source       = "Young-ook/eks/aws//modules/ecr"
  version      = "2.0.3"
  namespace    = var.name
  name         = "redispy"
  scan_on_push = false
}

### application/manifest
resource "local_file" "redispy" {
  depends_on = [module.ecr]
  content = templatefile(join("/", [path.cwd, "templates", "redispy.tpl"]),
    {
      ecr_url        = module.ecr.url
      redis_endpoint = module.redis.endpoint
      redis_password = module.redis.user.password
    }
  )
  filename        = join("/", [path.cwd, "redispy", "redispy.yaml"])
  file_permission = "0600"
}
