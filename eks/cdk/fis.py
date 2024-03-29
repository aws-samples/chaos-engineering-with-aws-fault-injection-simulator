from aws_cdk import (
    aws_eks as aws_eks,
    aws_fis as aws_fis,
    aws_iam as aws_iam,
    Stack, App
)
import os, json

class FIS(Stack):
    def __init__(self, app: App, id: str, props, **kwargs) -> None:
        super().__init__(app, id, **kwargs)

        # copy properties
        self.output_props = props.copy()

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
            role_arn = props['fis_role'].role_arn,
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
            role_arn = props['fis_role'].role_arn,
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
            role_arn = props['fis_role'].role_arn,
            targets = {'eks-nodes': disk_stress_target},
            actions = {'eks-disk-stress': disk_stress_action},
            stop_conditions = [aws_fis.CfnExperimentTemplate.ExperimentTemplateStopConditionProperty(
                source = "aws:cloudwatch:alarm",
                value = f"{props['disk_alarm'].alarm_arn}"
            )],
            tags = {'Name': 'Disk stress on EKS nodes'}
        )

        # chaos-mesh pod-kill
        aws_fis.CfnExperimentTemplate(
            self, "eks-chaos-mesh-disrupt-pod",
            description = "Disrupt pod",
            role_arn = props['fis_role'].role_arn,
            targets = {'eks-cluster': aws_fis.CfnExperimentTemplate.ExperimentTemplateTargetProperty(
                resource_type = "aws:eks:cluster",
                resource_arns = [f"{props['eks'].cluster_arn}"],
                selection_mode = "ALL"
            )},
            actions = {'eks-kill-pod': aws_fis.CfnExperimentTemplate.ExperimentTemplateActionProperty(
                action_id = "aws:eks:inject-kubernetes-custom-resource",
                parameters = dict(
                    kubernetesApiVersion = "chaos-mesh.org/v1alpha1",
                    kubernetesKind = "PodChaos",
                    kubernetesNamespace = "chaos-mesh",
                    kubernetesSpec = json.dumps({
                        "action": "pod-kill",
                        "mode": "one",
                        "selector": {
                            "namespaces": ["sockshop"],
                            "labelSelectors": {"name": "carts"},
                        },
                        "gracePeriod": 0
                    }),
                    maxDuration = "PT5M"
                ),
                targets = {'Cluster': 'eks-cluster'}
            )},
            stop_conditions = [aws_fis.CfnExperimentTemplate.ExperimentTemplateStopConditionProperty(
                source = "aws:cloudwatch:alarm",
                value = f"{props['cpu_alarm'].alarm_arn}"
            )],
            tags = {'Name': 'Terminate Pods'}
        )

        # chaos-mesh pod-cpu
        aws_fis.CfnExperimentTemplate(
            self, "eks-chaos-mesh-stress-pod-cpu",
            description = "Stress pod cpu",
            role_arn = props['fis_role'].role_arn,
            targets = {'eks-cluster': aws_fis.CfnExperimentTemplate.ExperimentTemplateTargetProperty(
                resource_type = "aws:eks:cluster",
                resource_arns = [f"{props['eks'].cluster_arn}"],
                selection_mode = "ALL"
            )},
            actions = {'eks-pod-cpu': aws_fis.CfnExperimentTemplate.ExperimentTemplateActionProperty(
                action_id = "aws:eks:inject-kubernetes-custom-resource",
                parameters = dict(
                    kubernetesApiVersion = "chaos-mesh.org/v1alpha1",
                    kubernetesKind = "StressChaos",
                    kubernetesNamespace = "chaos-mesh",
                    kubernetesSpec = json.dumps({
                        "duration": "1m",
                        "mode": "all",
                        "selector": {
                            "namespaces": ["sockshop"],
                            "labelSelectors": {"name": "carts"},
                        },
                        "stressors": {
                            "cpu": {
                                "workers": 1,
                                "load": 80
                            }
                        }
                    }),
                    maxDuration = "PT5M"
                ),
                targets = {'Cluster': 'eks-cluster'}
            )},
            stop_conditions = [aws_fis.CfnExperimentTemplate.ExperimentTemplateStopConditionProperty(
                source = "aws:cloudwatch:alarm",
                value = f"{props['cpu_alarm'].alarm_arn}"
            )],
            tags = {'Name': 'CPU stress on EKS pods'}
        )

    # pass objects to another stack
    @property
    def outputs(self):
        return self.output_props
