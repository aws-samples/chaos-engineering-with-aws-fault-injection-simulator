---
title: "Monitoring check"
chapter: false
weight: 20
---

### CloudWatch
Amazon CloudWatch will be used as a monitoring tool. To check the steady state, we will monitor the ALB TargetResponseTime metric of product-composite service.

Go to the CloudWatch service in the AWS console, select the Dashboards menu, and click the chaosMonitoringDashBoard created through the lab environment setup.
![image](/images/20_ec2/monitoring_01.png)

Check the metric information related to the product-composite service at the dashboard.
![image](/images/20_ec2/monitoring_02.png)

The **product-composite/TargetResponse/p90** metric shows a response time of around 0.2 ~ 0.4 seconds. 
![image](/images/20_ec2/monitoring_03.png)
