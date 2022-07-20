---
title: "1. Monitoring check"
chapter: false
weight: 11
---

Use [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) to collect, aggregate, and summarize metrics and logs from your containerized applications and microservices. Container Insights is available for Amazon Elastic Container Service (Amazon ECS), Amazon Elastic Kubernetes Service (Amazon EKS), and Kubernetes platforms on Amazon EC2. Amazon ECS support includes support for Fargate.

CloudWatch automatically collects metrics for many resources, such as CPU, memory, disk, and network. Container Insights also provides diagnostic information, such as container restart failures, to help you isolate issues and resolve them quickly. You can also set CloudWatch alarms on metrics that Container Insights collects.

Let's move to CloudWatch service page and click the Container Insights menu on the left navigation bar. Then revise the dashboard and metrics to understand that the systems are working under normal state.

![amazon-cloudwatch-container-insights-dashboard](/images/30_eks/aws-cw-container-insights-dashboard.png)

![amazon-cloudwatch-container-insights-mapview](/images/30_eks/aws-cw-container-insights-mapview.png)
