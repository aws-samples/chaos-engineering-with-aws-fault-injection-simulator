#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ChaosBaseStack } from '../lib/chaos-base-stack';
import { ChaosEurekaStack } from '../lib/chaos-eureka-stack';
import { ChaosProductStack } from '../lib/chaos-product-stack';
import { ChaosReviewStack } from '../lib/chaos-review-stack';
import { ChaosRecommendationStack } from '../lib/chaos-recommendation-stack';
import { ChaosProductCompositeStack } from '../lib/chaos-product-composite-stack';
import { ChaosLoadGeneratorStack } from '../lib/chaos-load-generator-stack';
import {ChaosMonitoringStack} from "../lib/chaos-monitoring-stack";
import {ChaosFisStack} from "../lib/chaos-fis-stack";

const app = new cdk.App();
const chaosBaseStack = new ChaosBaseStack(app, 'ChaosBaseStack');
const chaosEurekaStack = new ChaosEurekaStack(app, 'ChaosEurekaStack', { vpc: chaosBaseStack.vpc, appSecurityGroup: chaosBaseStack.appSecurityGroup, chaosBucket: chaosBaseStack.chaosBucket });
const chaosProductStack = new ChaosProductStack(app, 'ChaosProductStack', { vpc: chaosBaseStack.vpc, appSecurityGroup: chaosBaseStack.appSecurityGroup, eurekaAlbDnsName: chaosEurekaStack.eurekaAlbDnsName, chaosBucket: chaosBaseStack.chaosBucket });
const chaosReviewStack = new ChaosReviewStack(app, 'ChaosReviewStack', { vpc: chaosBaseStack.vpc, appSecurityGroup: chaosBaseStack.appSecurityGroup, eurekaAlbDnsName: chaosEurekaStack.eurekaAlbDnsName, chaosBucket: chaosBaseStack.chaosBucket });
const chaosRecommendationStack = new ChaosRecommendationStack(app, 'ChaosRecommendationStack', { vpc: chaosBaseStack.vpc, appSecurityGroup: chaosBaseStack.appSecurityGroup, eurekaAlbDnsName: chaosEurekaStack.eurekaAlbDnsName, chaosBucket: chaosBaseStack.chaosBucket });
const chaosProductCompositeStack = new ChaosProductCompositeStack(app, 'ChaosProductCompositeStack', { vpc: chaosBaseStack.vpc, albSecurityGroup: chaosBaseStack.albSecurityGroup, appSecurityGroup: chaosBaseStack.appSecurityGroup, eurekaAlbDnsName: chaosEurekaStack.eurekaAlbDnsName, chaosBucket: chaosBaseStack.chaosBucket });
const chaosLoadGeneratorStack = new ChaosLoadGeneratorStack(app, 'ChaosLoadGeneratorStack', { productCompositeAlbDnsName: chaosProductCompositeStack.productCompositeAlb.loadBalancerDnsName, chaosBucket: chaosBaseStack.chaosBucket });
const chaosFisStack = new ChaosFisStack(app, 'ChaosFisStack', {
    productCompositeAlb: chaosProductCompositeStack.productCompositeAlb,
    productCompositeListenerTarget: chaosProductCompositeStack.productCompositeListenerTarget,
});

const chaosMonitoringStack = new ChaosMonitoringStack(app, 'ChaosMonitoringStack',{
    vpc: chaosBaseStack.vpc,
    eurekaAsg: chaosEurekaStack.eurekaAsg,
    productAsg: chaosProductStack.productAsg,
    reviewAsg: chaosReviewStack.reviewAsg,
    recommendationAsg: chaosRecommendationStack.recommendationAsg,
    productCompositeAsg: chaosProductCompositeStack.productCompositeAsg,
    productCompositeAlb: chaosProductCompositeStack.productCompositeAlb,
    productCompositeListenerTarget: chaosProductCompositeStack.productCompositeListenerTarget,
});
