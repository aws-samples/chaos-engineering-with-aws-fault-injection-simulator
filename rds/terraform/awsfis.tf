### observability/alarm
module "alarm" {
  source  = "Young-ook/eventbridge/aws//modules/alarm"
  version = "0.0.12"
  for_each = { for a in [
    {
      name        = "cpu"
      description = "This metric monitors rds cpu utilization"
      alarm_metric = {
        comparison_operator = "GreaterThanOrEqualToThreshold"
        evaluation_periods  = 1
        datapoints_to_alarm = 1
        threshold           = 60
      }
      metric_query = [
        {
          id          = "rds_cpu_high"
          return_data = true
          metric = [
            {
              metric_name = "CPUUtilization"
              namespace   = "AWS/RDS"
              stat        = "Average"
              period      = 60
              dimensions  = { DBClusterIdentifier = module.rds.cluster.id }
            },
          ]
        },
      ]
    },
  ] : a.name => a }
  name         = join("-", [var.name, each.key, "alarm"])
  tags         = merge(local.default-tags, var.tags)
  description  = each.value.description
  alarm_metric = each.value.alarm_metric
  metric_query = each.value.metric_query
}

### observability/logs
module "logs" {
  source  = "Young-ook/eventbridge/aws//modules/logs"
  version = "0.0.12"
  for_each = { for l in [
    {
      type = "codebuild"
      log_group = {
        namespace      = "/aws/codebuild"
        retension_days = 5
      }
    },
    {
      type = "fis"
      log_group = {
        namespace      = "/aws/fis"
        retension_days = 3
      }
    },
  ] : l.type => l }
  name      = join("-", [var.name, each.key, "logs"])
  log_group = each.value.log_group
}

### experiment/fis
module "awsfis" {
  source  = "Young-ook/fis/aws"
  version = "2.0.0"
  name    = join("-", [var.name, "awsfis"])
  tags    = var.tags
  experiments = [
    {
      name        = "failover-rds"
      description = "Simulate stress on RDS clusters and instances"
      actions = {
        failover-rds = {
          description = "Failover Aurora cluster"
          action_id   = "aws:rds:failover-db-cluster"
          targets     = { Clusters = "rds-cluster" }
        }
      }
      targets = {
        rds-cluster = {
          resource_type  = "aws:rds:cluster"
          resource_arns  = [module.rds.cluster.arn]
          selection_mode = "ALL"
        }
      }
      stop_conditions = [
        {
          source = "aws:cloudwatch:alarm",
          value  = module.alarm["cpu"].alarm.arn
        }
      ]
      log_configuration = {
        log_schema_version = 1
        cloudwatch_logs_configuration = {
          log_group_arn = format("%s:*", module.logs["fis"].log_group.arn)
        }
      }
    },
    {
      name        = "reboot-rds"
      description = "Simulate stress on RDS clusters and instances"
      actions = {
        reboot-rds = {
          action_id  = "aws:rds:reboot-db-instances"
          parameters = { forceFailover = "false" }
          targets    = { DBInstances = "rds-instances" }
        }
      }
      targets = {
        rds-instances = {
          resource_type  = "aws:rds:db"
          resource_arns  = [module.rds.instances.0.arn]
          selection_mode = "ALL"
        }
      }
      stop_conditions = [
        {
          source = "aws:cloudwatch:alarm",
          value  = module.alarm["cpu"].alarm.arn
        }
      ]
      log_configuration = {
        log_schema_version = 1
        cloudwatch_logs_configuration = {
          log_group_arn = format("%s:*", module.logs["fis"].log_group.arn)
        }
      }
    },
  ]
}
