from aws_cdk import (
    aws_cloudwatch as aws_cw,
    core,
)

class CloudWatchAlarm(core.Stack):
    def __init__(self, app: core.App, id: str, props, **kwargs) -> None:
        super().__init__(app, id, **kwargs)

        cpu_alarm = aws_cw.Alarm(self, "cpu-alarm",
            metric = aws_cw.Metric(
                namespace = "ContainerInsights",
                metric_name = "node_cpu_utilization",
                statistic = "Average",
                period = core.Duration.seconds(30),
                dimensions = dict(
                    ClusterName = f"{props['eks'].cluster_name}"
                )
            ),
            comparison_operator = aws_cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
            threshold = 60,
            evaluation_periods = 1,
            datapoints_to_alarm = 1
        )

        disk_alarm = aws_cw.Alarm(self, "disk-alarm",
            metric = aws_cw.Metric(
                namespace = "ContainerInsights",
                metric_name = "node_filesystem_utilization",
                statistic = "p90",
                period = core.Duration.seconds(30),
                dimensions = dict(
                    ClusterName = f"{props['eks'].cluster_name}"
                )
            ),
            comparison_operator = aws_cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
            threshold = 60,
            evaluation_periods = 1,
            datapoints_to_alarm = 1
        )

        svc_health_alarm = aws_cw.Alarm(self, "svc-health-alarm",
            metric = aws_cw.Metric(
                namespace = "ContainerInsights",
                metric_name = "service_number_of_running_pods",
                statistic = "Average",
                period = core.Duration.seconds(10),
                dimensions = dict(
                    Namespace = 'sockshop',
                    Service = 'front-end',
                    ClusterName = f"{props['eks'].cluster_name}"
                )
            ),
            comparison_operator = aws_cw.ComparisonOperator.LESS_THAN_THRESHOLD,
            threshold = 1,
            evaluation_periods = 1,
            datapoints_to_alarm = 1
        )

        self.output_props = props.copy()
        self.output_props['cpu_alarm'] = cpu_alarm
        self.output_props['disk_alarm'] = disk_alarm
        self.output_props['svc_health_alarm'] = svc_health_alarm

    # pass objects to another stack
    @property
    def outputs(self):
        return self.output_props
