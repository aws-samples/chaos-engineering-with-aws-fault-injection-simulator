import * as cdk from '@aws-cdk/core';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from "@aws-cdk/aws-iam";
import * as asg from "@aws-cdk/aws-autoscaling";
import * as fis from "@aws-cdk/aws-fis";
import * as cw from "@aws-cdk/aws-cloudwatch";

interface ChaosFisStackProps extends cdk.StackProps {
    productCompositeAlb: elbv2.ApplicationLoadBalancer,
    productCompositeListenerTarget: elbv2.ApplicationTargetGroup
}

export class ChaosFisStack extends cdk.Stack {
  public readonly reviewAsg: asg.AutoScalingGroup;

  constructor(scope: cdk.Construct, id: string, props: ChaosFisStackProps) {
    super(scope, id, props);

    const fisRole = new iam.Role(this, "fisRole", {
          assumedBy: new iam.ServicePrincipal("fis.amazonaws.com"),
          managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
          ]
        }
    );
    const stopConditions = [
      { source: 'aws:cloudwatch:alarm', value: this.createTargetResponseAlarm(props.productCompositeAlb.loadBalancerFullName, props.productCompositeListenerTarget.targetGroupFullName).alarmArn },
      { source: 'aws:cloudwatch:alarm', value: this.createErrorRateAlarm(props.productCompositeAlb.loadBalancerFullName, props.productCompositeListenerTarget.targetGroupFullName).alarmArn },
    ];
    
    this.createFisTemplateForCPUAttack(fisRole, stopConditions, 'productComposite', { Name: 'ChaosProductCompositeStack/productCompositeAsg' });
    //this.createFisTemplateForCPUAttack(fisRole, stopConditions, 'product', { Name: 'ChaosProductStack/productAsg' });
    this.createFisTemplateForInstanceTerminate(fisRole, stopConditions, 'review', { Name: 'ChaosReviewStack/reviewAsg' });
    this.createFisTemplateForNetwork(fisRole, stopConditions, 'recommendation', { Name: 'ChaosRecommendationStack/recommendationAsg' });
  }

  createTargetResponseAlarm(albName: string, targetGroupName: string) : cw.Alarm {
    const chaosSteadyStateAlarm = new cw.Alarm(this, 'chaosTargetResponseAlarm', {
        alarmName: 'chaosTargetResponseAlarm',
        metric: new cw.Metric({
            metricName: 'TargetResponseTime',
            namespace: 'AWS/ApplicationELB',
            dimensions: {
                'LoadBalancer': albName,
                'TargetGroup': targetGroupName
            },
            statistic: 'p90',
        }).with( {
            period: cdk.Duration.seconds(60)
        }),
        threshold: 1,
        evaluationPeriods: 1,
        treatMissingData: cw.TreatMissingData.MISSING,
        comparisonOperator: cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        datapointsToAlarm: 1,
    });

    return chaosSteadyStateAlarm;
  }
  
  createMetric(namespace: string, metricName: string, statistic: string, dimensions: cw.DimensionHash, period: cdk.Duration) : cw.Metric {
    return new cw.Metric({
      namespace: namespace,
      metricName: metricName,
      statistic: statistic,
      dimensions: dimensions,
      period: period,
    });
  }
  
  createErrorRateAlarm(albName: string, targetGroupName: string) : cw.Alarm {
    const chaosSteadyStateAlarm = new cw.Alarm(this, 'chaosErrorRateAlarm', {
        alarmName: 'chaosErrorRateAlarm',
        metric: new cw.MathExpression({
          expression: '1000*(errors1+errors2)/requests',
          usingMetrics: {
            requests: this.createMetric('AWS/ApplicationELB', 'RequestCount', 'sum', {'LoadBalancer': albName, 'TargetGroup': targetGroupName}, cdk.Duration.seconds(60)),
            errors1: this.createMetric('AWS/ApplicationELB', 'HTTPCode_ELB_5XX_Count', 'sum', {'LoadBalancer': albName}, cdk.Duration.seconds(60)),
            errors2: this.createMetric('AWS/ApplicationELB', 'HTTPCode_ELB_4XX_Count', 'sum', {'LoadBalancer': albName}, cdk.Duration.seconds(60)),
          }
        }).with( {
            period: cdk.Duration.seconds(60)
        }),
        threshold: 5,
        evaluationPeriods: 1,
        treatMissingData: cw.TreatMissingData.MISSING,
        comparisonOperator: cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        datapointsToAlarm: 1,
    });

    return chaosSteadyStateAlarm;
  }

  createFisTemplateForCPUAttack(fisRole: iam.Role, stopConditions: {source: string, value: string}[], service: string, resourceTags: {[key: string]: (string)}) : void {
      const cpuAttackAction: fis.CfnExperimentTemplate.ExperimentTemplateActionProperty = {
          actionId: 'aws:ssm:send-command',
          parameters: {
              documentArn: "arn:aws:ssm:" + process.env.CDK_DEFAULT_REGION + "::document/AWSFIS-Run-CPU-Stress",
              documentParameters: "{\"DurationSeconds\":\"300\", \"InstallDependencies\":\"True\"}",
              duration: 'PT5M',
          },
          targets: { Instances: 'targetInstances' },
      };

      const cpuAttackTarget: fis.CfnExperimentTemplate.ExperimentTemplateTargetProperty = {
          resourceType: 'aws:ec2:instance',
          resourceTags: resourceTags,
          selectionMode: 'ALL',
          filters: [
              {
                  path:'State.Name',
                  values: [ 'running' ]
              }
          ]
      };

      const cpuAttackTemplate = new fis.CfnExperimentTemplate(this, service + 'CpuAttackTemplate', {
          description: 'CPU Attack - '+ service,
          roleArn: fisRole.roleArn,
          stopConditions: stopConditions,
          tags: {'Name': 'CPU Attack Template - ' + service},
          actions: {
              'CPU-Attack-Action' : cpuAttackAction
          },
          targets: {
              'targetInstances': cpuAttackTarget
          }
      });
  };

  createFisTemplateForInstanceTerminate(fisRole: iam.Role, stopConditions: {source: string, value: string}[], service: string, resourceTags: {[key: string]: (string)}) : void {
      const terminateAttackAction: fis.CfnExperimentTemplate.ExperimentTemplateActionProperty = {
          actionId: 'aws:ec2:terminate-instances',
          parameters: {
          },
          targets: { Instances: 'targetInstances' }
      };

      const terminateAttackTarget: fis.CfnExperimentTemplate.ExperimentTemplateTargetProperty = {
          resourceType: 'aws:ec2:instance',
          resourceTags: resourceTags,
          selectionMode: 'COUNT(1)',
          filters: [
              {
                  path:'State.Name',
                  values: [ 'running' ]
              }
          ]
      };

      const terminateAttackTemplate = new fis.CfnExperimentTemplate(this, service + 'TerminateAttackTemplate', {
          description: 'Terminate Attack - '+ service,
          roleArn: fisRole.roleArn,
          stopConditions: stopConditions,
          tags: {'Name': 'Terminate Attack Template - ' + service},
          actions: {
              'Terminate-Attack-Action' : terminateAttackAction
          },
          targets: {
              'targetInstances': terminateAttackTarget
          }
      });
  };

  createFisTemplateForNetwork(fisRole: iam.Role, stopConditions: {source: string, value: string}[], service: string, resourceTags: {[key: string]: (string)}) : void {
      const networkAttackAction: fis.CfnExperimentTemplate.ExperimentTemplateActionProperty = {
          actionId: 'aws:ssm:send-command',
          parameters: {
              documentArn: "arn:aws:ssm:" + process.env.CDK_DEFAULT_REGION + "::document/AWSFIS-Run-Network-Latency",
              documentParameters: "{\"DelayMilliseconds\": \"3000\", \"Interface\": \"eth0\", \"DurationSeconds\":\"300\", \"InstallDependencies\":\"True\"}",
              duration: 'PT5M',
          },
          targets: { Instances: 'targetInstances' }
      };

      const networkAttackTarget: fis.CfnExperimentTemplate.ExperimentTemplateTargetProperty = {
          resourceType: 'aws:ec2:instance',
          resourceTags: resourceTags,
          selectionMode: 'COUNT(1)',
          filters: [
              {
                  path:'State.Name',
                  values: [ 'running' ]
              }
          ]
      };

      const networkAttackTemplate = new fis.CfnExperimentTemplate(this,service + 'NetworkAttackTemplate', {
          description: 'Network Attack - ' + service,
          roleArn: fisRole.roleArn,
          stopConditions: stopConditions,
          tags: {'Name': 'Network Attack Template - ' + service},
          actions: {
              'Network-Attack-Action' : networkAttackAction
          },
          targets: {
              'targetInstances': networkAttackTarget
          }
      });
  };
}
