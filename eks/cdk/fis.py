from aws_cdk import (
    aws_iam as aws_iam,
    aws_fis as aws_fis,
    core,
)
import os

class FIS(core.Stack):
    def __init__(self, app: core.App, id: str, props, **kwargs) -> None:
        super().__init__(app, id, **kwargs)

        # copy properties
        self.output_props = props.copy()

        # iam role
        role = aws_iam.Role(self, "fis-role", assumed_by = aws_iam.ServicePrincipal("fis.amazonaws.com"))
        role.add_managed_policy(aws_iam.ManagedPolicy.from_aws_managed_policy_name("AdministratorAccess"))

        # terminate eks nodes experiment
        terminate_nodes_target = aws_fis.CfnExperimentTemplate.ExperimentTemplateTargetProperty(
            resource_type = "aws:eks:nodegroup",
            resource_arns = [f"{props['ng'].nodegroup_arn}"],
            selection_mode = "ALL"
        )

        terminate_nodes_action = aws_fis.CfnExperimentTemplate.ExperimentTemplateActionProperty(
            action_id = "aws:eks:terminate-nodegroup-instances",
            parameters = dict(instanceTerminationPercentage = "40"),
            targets = {'Nodegroups': 'eks-nodes'}
        )

        aws_fis.CfnExperimentTemplate(
            self, "eks-terminate-nodes",
            description = "Terminate EKS nodes",
            role_arn = role.role_arn,
            targets = {'eks-nodes': terminate_nodes_target},
            actions = {'eks-terminate-nodes': terminate_nodes_action},
            stop_conditions = [
                aws_fis.CfnExperimentTemplate.ExperimentTemplateStopConditionProperty(
                    source = "aws:cloudwatch:alarm",
                    value = f"{props['cpu_alarm'].alarm_arn}"
                ),
                aws_fis.CfnExperimentTemplate.ExperimentTemplateStopConditionProperty(
                    source = "aws:cloudwatch:alarm",
                    value = f"{props['svc_health_alarm'].alarm_arn}"
                )
            ],
            tags = {'Name': 'Terminate EKS nodes'}
        )

        # cpu stress experiment
        cpu_stress_target = aws_fis.CfnExperimentTemplate.ExperimentTemplateTargetProperty(
            resource_type = "aws:ec2:instance",
            resource_tags = {'eks:cluster-name': f"{props['eks'].cluster_name}"},
            filters = [{'path': 'State.Name', 'values': ['running']}],
            selection_mode = "PERCENT(80)"
        )

        cpu_stress_action = aws_fis.CfnExperimentTemplate.ExperimentTemplateActionProperty(
            action_id = "aws:ssm:send-command",
            parameters = dict(
                duration = "PT10M",
                documentArn = "arn:aws:ssm:" + self.region + "::document/AWSFIS-Run-CPU-Stress",
                documentParameters = "{\"DurationSeconds\": \"600\", \"InstallDependencies\": \"True\", \"CPU\": \"0\"}"
            ),
            targets = {'Instances': 'eks-nodes'}
        )

        aws_fis.CfnExperimentTemplate(
            self, "eks-cpu-stress",
            description = "CPU stress on EKS nodes",
            role_arn = role.role_arn,
            targets = {'eks-nodes': cpu_stress_target},
            actions = {'eks-cpu-stress': cpu_stress_action},
            stop_conditions = [aws_fis.CfnExperimentTemplate.ExperimentTemplateStopConditionProperty(
                source = "aws:cloudwatch:alarm",
                value = f"{props['cpu_alarm'].alarm_arn}"
            )],
            tags = {'Name': 'CPU stress on EKS nodes'}
        )

        # disk stress experiment
        disk_stress_target = aws_fis.CfnExperimentTemplate.ExperimentTemplateTargetProperty(
            resource_type = "aws:ec2:instance",
            resource_tags = {'eks:cluster-name': f"{props['eks'].cluster_name}"},
            filters = [{'path': 'State.Name', 'values': ['running']}],
            selection_mode = "ALL"
        )

        disk_stress_action = aws_fis.CfnExperimentTemplate.ExperimentTemplateActionProperty(
            action_id = "aws:ssm:send-command",
            parameters = dict(
                duration = "PT10M",
                documentArn = "arn:aws:ssm:" + self.region + ":" + self.account + ":document/FIS-Run-Disk-Stress",
                documentParameters = "{\"DurationSeconds\": \"600\", \"InstallDependencies\": \"True\", \"Workers\": \"4\", \"Bytes\": \"4g\"}"
            ),
            targets = {'Instances': 'eks-nodes'}
        )

        aws_fis.CfnExperimentTemplate(
            self, "eks-disk-stress",
            description = "Disk stress on EKS nodes",
            role_arn = role.role_arn,
            targets = {'eks-nodes': disk_stress_target},
            actions = {'eks-disk-stress': disk_stress_action},
            stop_conditions = [aws_fis.CfnExperimentTemplate.ExperimentTemplateStopConditionProperty(
                source = "aws:cloudwatch:alarm",
                value = f"{props['disk_alarm'].alarm_arn}"
            )],
            tags = {'Name': 'Disk stress on EKS nodes'}
        )

    # pass objects to another stack
    @property
    def outputs(self):
        return self.output_props
