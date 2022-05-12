import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as s3 from '@aws-cdk/aws-s3';
import {RemovalPolicy} from "@aws-cdk/core";

export class ChaosBaseStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly chaosBucket: s3.Bucket;
  public readonly albSecurityGroup: ec2.SecurityGroup;
  public readonly appSecurityGroup: ec2.SecurityGroup;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'VPC');
    const vpc = this.vpc;

    this.albSecurityGroup = new ec2.SecurityGroup(this, 'albSecurityGroup', {
      vpc,
      description: '',
      allowAllOutbound: true
    });

    this.appSecurityGroup = new ec2.SecurityGroup(this, 'appSecurityGroup', {
      vpc,
      description: '',
      allowAllOutbound: true
    });

    // internet -> alb
    this.albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow from internet');

    // alb -> was
    this.appSecurityGroup.addIngressRule(this.albSecurityGroup, ec2.Port.tcp(8080), 'Allow from ALB');

    this.chaosBucket = new s3.Bucket(this,'chaosBucket', {
      removalPolicy: RemovalPolicy.DESTROY
    });

    new cdk.CfnOutput(this, 'chaosBucketName', { value: this.chaosBucket.bucketName });
  }
}
