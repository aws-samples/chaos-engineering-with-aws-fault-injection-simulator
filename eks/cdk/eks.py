from aws_cdk import (
    aws_ec2 as aws_ec2,
    aws_eks as aws_eks,
    aws_iam as aws_iam,
    core,
)
import yaml

class EKS(core.Stack):
    def __init__(self, app: core.App, id: str, props, **kwargs) -> None:
        super().__init__(app, id, **kwargs)

        vpc = aws_ec2.Vpc(self, "vpc", nat_gateways = 1)
        eks = aws_eks.Cluster(self, "eks",
            vpc = vpc,
            version = aws_eks.KubernetesVersion.V1_21,
            default_capacity = 0
        )

        mng = eks.add_nodegroup_capacity("mng",
            instance_types = [aws_ec2.InstanceType("t3.small")],
            desired_size = 3,
            min_size = 3,
            max_size = 9
        )

        mng.role.add_managed_policy(aws_iam.ManagedPolicy.from_aws_managed_policy_name("CloudWatchAgentServerPolicy"))
        mng.role.add_managed_policy(aws_iam.ManagedPolicy.from_aws_managed_policy_name("AmazonSSMManagedInstanceCore"))

        eks.add_helm_chart("aws-cloudwatch-metrics",
            chart = "aws-cloudwatch-metrics",
            release = "aws-cloudwatch-metrics",
            repository = "https://aws.github.io/eks-charts",
            namespace = "amazon-cloudwatch",
            values = {
                "clusterName": eks.cluster_name,
            }
        )

        eks.add_helm_chart("aws-for-fluent-bit",
            chart = "aws-for-fluent-bit",
            release = "aws-for-fluent-bit",
            repository = "https://aws.github.io/eks-charts",
            namespace = "kube-system",
            values = {
                "cloudWatch": {
                    "region": core.Stack.of(self).region,
                    "logGroupName": f"/aws/containerinsights/{eks.cluster_name}/application"
                }
            }
        )

        mng.role.add_to_policy(aws_iam.PolicyStatement(
            actions = [
                "autoscaling:DescribeAutoScalingGroups",
                "autoscaling:DescribeAutoScalingInstances",
                "autoscaling:DescribeLaunchConfigurations",
                "autoscaling:DescribeTags",
                "autoscaling:SetDesiredCapacity",
                "autoscaling:TerminateInstanceInAutoScalingGroup",
                "ec2:DescribeLaunchTemplateVersions"
            ],
            effect = aws_iam.Effect.ALLOW,
            resources = ["*"]
        ))

        eks.add_helm_chart("cluster-autoscaler",
            chart = "cluster-autoscaler",
            release = "aws-cluster-autoscaler",
            repository = "https://kubernetes.github.io/autoscaler",
            namespace = "kube-system",
            values = {
                "awsRegion": core.Stack.of(self).region,
                "autoDiscovery": {
                    "clusterName": eks.cluster_name,
                }
            }
        )

        eks.add_helm_chart("chaos-mesh",
            chart = "chaos-mesh",
            release = "chaos-mesh",
            version = "2.2.2",
            repository = "https://charts.chaos-mesh.org",
            namespace = "chaos-mesh",
            create_namespace = True
        )

        # fis role
        fis_role = aws_iam.Role(self, "fis-role", assumed_by = aws_iam.ServicePrincipal("fis.amazonaws.com"))
        fis_role.add_managed_policy(aws_iam.ManagedPolicy.from_aws_managed_policy_name("AdministratorAccess"))

        with open('../kubernetes/manifest/cm-manager.yaml', 'r') as f:
            cmm_manifest = yaml.safe_load(f)

        eks.add_manifest("cm-manager", cmm_manifest)
        f.close()

        # update aws-auth config map
        eks.aws_auth.add_role_mapping(fis_role, groups=["system:masters", "chaos-mesh-manager-role"])

        with open('../kubernetes/manifest/ssm-agent.yaml', 'r') as f:
            ssm_manifest = yaml.safe_load(f)

        eks.add_manifest("ssm-agent", ssm_manifest)
        f.close()

        self.output_props = props.copy()
        self.output_props['eks'] = eks
        self.output_props['ng'] = mng
        self.output_props['fis_role'] = fis_role

    # pass objects to another stack
    @property
    def outputs(self):
        return self.output_props
