terraform {
  required_version = "~> 1.0"
}

provider "aws" {
  region = var.aws_region
}

### network/vpc
module "vpc" {
  source  = "Young-ook/vpc/aws"
  version = "1.0.5"
  name    = join("-", [var.name, "vpc"])
  tags    = var.tags
  vpc_config = {
    cidr        = var.cidr
    azs         = var.azs
    single_ngw  = true
    subnet_type = "private"
  }
}

### application/kubernetes
module "eks" {
  source             = "Young-ook/eks/aws"
  version            = "2.0.0"
  name               = join("-", [var.name, "eks"])
  tags               = var.tags
  subnets            = values(module.vpc.subnets["private"])
  kubernetes_version = var.kubernetes_version
  enable_ssm         = true
  managed_node_groups = [
    {
      name          = "lamp"
      instance_type = "t3.medium"
    },
  ]
}

### database/aurora
module "rds" {
  source  = "Young-ook/aurora/aws"
  version = "2.2.0"
  name    = join("-", [var.name, "rds"])
  tags    = var.tags
  vpc     = module.vpc.vpc.id
  subnets = values(module.vpc.subnets["private"])
  cidrs   = [var.cidr]
  cluster = {
    engine            = "aurora-mysql"
    version           = var.aurora_version
    port              = "3306"
    user              = "myuser"
    password          = "supersecret"
    database          = "mydb"
    backup_retention  = "5"
    apply_immediately = "false"
    cluster_parameters = {
      character_set_server = "utf8"
      character_set_client = "utf8"
    }
  }
  instances = [
    {
      instance_type = "db.t3.medium"
    },
    {
      instance_type = "db.t3.medium"
    }
  ]
}

resource "time_sleep" "wait" {
  depends_on      = [module.vpc, module.rds]
  create_duration = "60s"
}

module "proxy" {
  depends_on = [time_sleep.wait]
  source     = "Young-ook/aurora/aws//modules/proxy"
  version    = "2.2.0"
  name       = join("-", [var.name, "rdsproxy"])
  tags       = var.tags
  subnets    = values(module.vpc.subnets["private"])
  proxy_config = {
    cluster_id = module.rds.cluster.id
  }
  auth_config = {
    user_name     = module.rds.user.name
    user_password = module.rds.user.password
  }
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
      buildspec = "rds/terraform/lamp/buildspec.yml"
      version   = "main"
    }
    environment = {
      image           = "aws/codebuild/standard:5.0"
      privileged_mode = true
      environment_variables = {
        AWS_REGION = var.aws_region
        APP_SRC    = join("/", ["rds/terraform/lamp"])
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
  name         = "lamp"
  scan_on_push = false
}

# application/manifest
resource "local_file" "lamp" {
  depends_on = [module.ecr]
  content = templatefile(join("/", [path.cwd, "templates", "lamp.tpl"]),
    {
      ecr_url    = module.ecr.url
      mysql_host = module.rds.endpoint.writer
      mysql_user = module.rds.user.name
      mysql_pw   = module.rds.user.password
      mysql_db   = module.rds.user.database
    }
  )
  filename        = join("/", [path.cwd, "lamp", "lamp.yaml"])
  file_permission = "0600"
}
