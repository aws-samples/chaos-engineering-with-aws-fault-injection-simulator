---
title: "Check the actual result"
chapter: false
weight: 30
---

### Check the actual result

Now let's take a look at the chaosMonitoringDashboard in Amazon CloudWatch. When the recommendation service experiences a network delay, you can see that the product-composite service that calls it also suffers a delay.
![image](/images/20_ec2/experiment01_08.png)

As the delay continues, the system goes out of the steady state and a CloudWatch alarm occurs. 
![image](/images/20_ec2/experiment01_09.png)

The attack stops because of a CloudWatch alarm set to Stop conditions in FIS.
![image](/images/20_ec2/experiment01_10.png)

As the attack stops, the service returns to normal.
Despite the short delay, you can see that it has affected the system for quite a long time. 
![image](/images/20_ec2/experiment01_11.png)
