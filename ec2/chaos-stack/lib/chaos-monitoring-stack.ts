import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as asg from "@aws-cdk/aws-autoscaling";
import * as cw from "@aws-cdk/aws-cloudwatch";
import * as iam from '@aws-cdk/aws-iam';

interface ChaosMonitoringStackProps extends cdk.StackProps {
  vpc: ec2.Vpc,
  productCompositeAlb: elbv2.ApplicationLoadBalancer,
  productCompositeAsg: asg.AutoScalingGroup,
  productCompositeListenerTarget: elbv2.ApplicationTargetGroup
  eurekaAsg: asg.AutoScalingGroup,
  productAsg: asg.AutoScalingGroup,
  recommendationAsg: asg.AutoScalingGroup,
  reviewAsg: asg.AutoScalingGroup,
}

export class ChaosMonitoringStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ChaosMonitoringStackProps) {
    super(scope, id, props);

    const chaosMonitoringDashboard = new cw.Dashboard(this, 'chaosMonitoringDashboard', {dashboardName: 'chaosMonitoringDashboard', start: '-PT15M'});
    
    const loadbalancerDimensions = {'LoadBalancer': props.productCompositeAlb.loadBalancerFullName, 'TargetGroup': props.productCompositeListenerTarget.targetGroupFullName};
    chaosMonitoringDashboard.addWidgets(
        this.createAsgWidget('Loadbalancer Count', 
          [
            this.createMetric('AWS/ApplicationELB', 'RequestCount', 'sum', loadbalancerDimensions),
            this.createMetric('AWS/ApplicationELB', 'RequestCountPerTarget', 'sum', loadbalancerDimensions),
            this.createMetric('AWS/ApplicationELB', 'HTTPCode_Target_2XX_Count', 'sum', loadbalancerDimensions),
            this.createMetric('AWS/ApplicationELB', 'HTTPCode_Target_3XX_Count', 'sum', loadbalancerDimensions),
          ]
        ),

        this.createAsgWidget('Loadbalancer Error Count',
          [
            this.createMetric('AWS/ApplicationELB', 'HTTPCode_ELB_4XX_Count', 'sum', {'LoadBalancer': props.productCompositeAlb.loadBalancerFullName}),
            this.createMetric('AWS/ApplicationELB', 'HTTPCode_ELB_5XX_Count', 'sum', {'LoadBalancer': props.productCompositeAlb.loadBalancerFullName}),
            this.createMetric('AWS/ApplicationELB', 'HTTPCode_Target_4XX_Count', 'sum', loadbalancerDimensions),
            this.createMetric('AWS/ApplicationELB', 'HTTPCode_Target_5XX_Count', 'sum', loadbalancerDimensions),
            
          ]
        ),
        
        this.createAsgWidget('LoadBalancer TargetResponseTime', 
          [
            this.createMetric('AWS/ApplicationELB', 'TargetResponseTime', 'avg', loadbalancerDimensions),
            this.createMetric('AWS/ApplicationELB', 'TargetResponseTime', 'p99', loadbalancerDimensions),
            this.createMetric('AWS/ApplicationELB', 'TargetResponseTime', 'p95', loadbalancerDimensions),
            this.createMetric('AWS/ApplicationELB', 'TargetResponseTime', 'p90', loadbalancerDimensions),
          ]
        ),
        
        this.createAsgWidget('CPUUtilization',
          [
            this.createMetric('AWS/EC2', 'CPUUtilization', 'avg', {'AutoScalingGroupName': props.productCompositeAsg.autoScalingGroupName}),
            this.createMetric('AWS/EC2', 'CPUUtilization', 'avg', {'AutoScalingGroupName': props.productAsg.autoScalingGroupName}),
            this.createMetric('AWS/EC2', 'CPUUtilization', 'avg', {'AutoScalingGroupName': props.reviewAsg.autoScalingGroupName}),
            this.createMetric('AWS/EC2', 'CPUUtilization', 'avg', {'AutoScalingGroupName': props.recommendationAsg.autoScalingGroupName}),
          ]
        ),
        
        this.createAsgWidget('CPUCreditBalance',
          [
            this.createMetric('AWS/EC2', 'CPUCreditBalance', 'avg', {'AutoScalingGroupName': props.productCompositeAsg.autoScalingGroupName}),
            this.createMetric('AWS/EC2', 'CPUCreditBalance', 'avg', {'AutoScalingGroupName': props.productAsg.autoScalingGroupName}),
            this.createMetric('AWS/EC2', 'CPUCreditBalance', 'avg', {'AutoScalingGroupName': props.reviewAsg.autoScalingGroupName}),
            this.createMetric('AWS/EC2', 'CPUCreditBalance', 'avg', {'AutoScalingGroupName': props.recommendationAsg.autoScalingGroupName}),
          ]
        ),
        
        this.createAsgWidget('CPUCreditUsage',
          [
            this.createMetric('AWS/EC2', 'CPUCreditUsage', 'avg', {'AutoScalingGroupName': props.productCompositeAsg.autoScalingGroupName}),
            this.createMetric('AWS/EC2', 'CPUCreditUsage', 'avg', {'AutoScalingGroupName': props.productAsg.autoScalingGroupName}),
            this.createMetric('AWS/EC2', 'CPUCreditUsage', 'avg', {'AutoScalingGroupName': props.reviewAsg.autoScalingGroupName}),
            this.createMetric('AWS/EC2', 'CPUCreditUsage', 'avg', {'AutoScalingGroupName': props.recommendationAsg.autoScalingGroupName}),
          ]
        ),
    );
  }

  createMetric(namespace: string, metricName: string, statistic: string, dimensions: cw.DimensionHash) : cw.Metric {
    return new cw.Metric({
      namespace: namespace,
      metricName: metricName,
      statistic: statistic,
      dimensions: dimensions,
      period: cdk.Duration.seconds(1),
    });
  }

  createAsgWidget(title: string, metrics: cw.Metric[] ) : cw.GraphWidget {
    return new cw.GraphWidget({
      title: title,
      width: 12,
      left: metrics
    })
  }
}
