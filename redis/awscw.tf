### monitoring/alarm
resource "aws_cloudwatch_metric_alarm" "cpu" {
  alarm_name                = join("-", [var.name, "cpu", "alarm"])
  alarm_description         = "This metric monitors ec2 cpu utilization"
  tags                      = merge(local.default-tags, var.tags)
  metric_name               = "node_cpu_utilization"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  datapoints_to_alarm       = 1
  evaluation_periods        = 1
  namespace                 = "ContainerInsights"
  period                    = 30
  threshold                 = 60
  statistic                 = "Average"
  insufficient_data_actions = []
  dimensions = {
    ClusterName = module.eks.cluster.name
  }
}

# application/logs
module "logs" {
  source  = "Young-ook/lambda/aws//modules/logs"
  version = "0.2.1"
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
    {
      type = "redis"
      log_group = {
        namespace      = "/aws/elasticache"
        retension_days = 3
      }
    },
  ] : l.type => l }
  name      = join("-", [var.name, each.key])
  log_group = each.value.log_group
}
