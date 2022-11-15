# application/build
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
      location  = "https://github.com/Young-ook/terraform-aws-fis.git"
      buildspec = "examples/redis/redispy/buildspec.yml"
      version   = "main"
    }
    environment = {
      image           = "aws/codebuild/standard:4.0"
      privileged_mode = true
      environment_variables = {
        APP_SRC = join("/", ["examples/redis/redispy"])
        ECR_URI = module.ecr.url
      }
    }
  }
  log = {
    cloudwatch_logs = {
      group_name = module.logs["codebuild"].log_group.name
    }
  }
}

# application/repo
module "ecr" {
  source       = "Young-ook/eks/aws//modules/ecr"
  version      = "1.7.5"
  namespace    = var.name
  name         = "redispy"
  scan_on_push = false
}

# application/manifest
resource "local_file" "redispy" {
  depends_on = [module.ecr]
  content = templatefile(join("/", [path.cwd, "templates", "redispy.tpl"]),
    {
      ecr_url        = module.ecr.url
      redis_endpoint = aws_elasticache_replication_group.redis.configuration_endpoint_address
      redis_password = random_password.password.result
    }
  )
  filename        = join("/", [path.cwd, "redispy", "redispy.yaml"])
  file_permission = "0600"
}
