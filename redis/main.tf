terraform {
  required_version = "~> 1.0"
}

provider "aws" {
  region = var.aws_region
}

# network/vpc
module "vpc" {
  source  = "Young-ook/vpc/aws"
  version = "1.0.2"
  name    = var.name
  tags    = var.tags
  vpc_config = var.use_default_vpc ? null : {
    cidr        = var.cidr
    azs         = var.azs
    subnet_type = "private"
    single_ngw  = true
  }
}

locals {
  redis_port = 6379
}

# security/firewall
resource "aws_security_group" "redis" {
  name   = join("-", [var.name, "redis"])
  tags   = merge(local.default-tags, var.tags)
  vpc_id = module.vpc.vpc.id

  ingress {
    from_port   = local.redis_port
    to_port     = local.redis_port
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc.cidr_block]
  }
}

# security/password
resource "random_password" "password" {
  length           = 16
  special          = true
  override_special = "%*()_=+[]{}<>?"
}

# application/redis
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = var.name
  description                = "Cluster mode enabled ElastiCache for Redis"
  engine                     = "redis"
  engine_version             = "6.x"
  port                       = local.redis_port
  security_group_ids         = [aws_security_group.redis.id]
  node_type                  = "cache.t2.micro"
  parameter_group_name       = "default.redis6.x.cluster.on"
  num_node_groups            = 3
  replicas_per_node_group    = 2
  automatic_failover_enabled = true
  multi_az_enabled           = true
  transit_encryption_enabled = true
  auth_token                 = random_password.password.result
  log_delivery_configuration {
    destination      = module.logs["redis"].log_group.name
    destination_type = "cloudwatch-logs"
    log_format       = "text"
    log_type         = "slow-log"
  }
}

# application/eks
module "eks" {
  source             = "Young-ook/eks/aws"
  version            = "1.7.10"
  name               = var.name
  tags               = var.tags
  subnets            = values(module.vpc.subnets[var.use_default_vpc ? "public" : "private"])
  kubernetes_version = "1.21"
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
    host                   = module.eks.helmconfig.host
    token                  = module.eks.helmconfig.token
    cluster_ca_certificate = base64decode(module.eks.helmconfig.ca)
  }
}

module "container-insights" {
  source       = "Young-ook/eks/aws//modules/container-insights"
  version      = "1.7.5"
  features     = { enable_metrics = true }
  cluster_name = module.eks.cluster.name
  oidc         = module.eks.oidc
}
