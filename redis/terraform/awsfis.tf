### observability/alarm
module "alarm" {
  source  = "Young-ook/eventbridge/aws//modules/alarm"
  version = "0.0.12"
  for_each = { for a in [
    {
      name        = "cpu"
      description = "This metric monitors eks node cpu utilization"
      alarm_metric = {
        comparison_operator = "GreaterThanOrEqualToThreshold"
        evaluation_periods  = 1
        datapoints_to_alarm = 1
        threshold           = 60
      }
      metric_query = [
        {
          id          = "eks_cpu_high"
          return_data = true
          metric = [
            {
              metric_name = "node_cpu_utilization"
              namespace   = "ContainerInsights"
              stat        = "Average"
              period      = 30
              dimensions  = { ClusterName = module.eks.cluster.name }
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
  metric_query = try(each.value.metric_query, null)
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
    {
      type = "redis"
      log_group = {
        namespace      = "/aws/elasticache"
        retension_days = 3
      }
    },
  ] : l.type => l }
  name      = join("-", [var.name, each.key, "logs"])
  log_group = each.value.log_group
}

### drawing lots for choosing a subnet
module "random-az" {
  source  = "Young-ook/fis/aws//modules/roulette"
  version = "2.0.0"
  items   = var.azs
}

### network blackhole experiment script
data "aws_ssm_document" "network-blackhole" {
  name            = "AWSFIS-Run-Network-Packet-Loss"
  document_format = "YAML"
}

### experiment/fis
module "awsfis" {
  source  = "Young-ook/fis/aws"
  version = "2.0.0"
  name    = var.name
  tags    = var.tags
  experiments = [
    {
      name        = "az-outage"
      tags        = var.tags
      description = "Simulate an AZ outage"
      actions = {
        az-outage = {
          description = "Block all EC2 traffics from and to the subnets"
          action_id   = "aws:network:disrupt-connectivity"
          targets     = { Subnets = module.random-az.item }
          parameters = {
            duration = "PT5M"
            scope    = "availability-zone"
          }
        }
        ec2-blackhole = {
          description = "Drop all network packets from and to EC2 instances"
          action_id   = "aws:ssm:send-command"
          targets     = { Instances = "ec2-instances" }
          parameters = {
            duration           = "PT5M"
            documentArn        = data.aws_ssm_document.network-blackhole.arn
            documentParameters = "{\"DurationSeconds\":\"300\",\"LossPercent\":\"100\",\"InstallDependencies\":\"True\"}"
          }
        }
      }
      targets = {
        var.azs[module.random-az.index] = {
          resource_type = "aws:ec2:subnet"
          parameters = {
            availabilityZoneIdentifier = module.random-az.item
            vpc                        = module.vpc.vpc.id
          }
          selection_mode = "ALL"
        }
        ec2-instances = {
          resource_type  = "aws:ec2:instance"
          resource_tags  = { purpose = "fis_workshop" }
          selection_mode = "ALL"
          filters = [
            {
              path   = "Placement.AvailabilityZone"
              values = [module.random-az.item]
            },
            {
              path   = "State.Name"
              values = ["running"]
            }
          ],
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
