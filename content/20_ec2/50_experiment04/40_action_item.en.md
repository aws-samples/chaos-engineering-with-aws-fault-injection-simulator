---
title: "Action Item"
chapter: false
weight: 40
---

### Create and Apply Action Item
Let's find out the cause. If you look at the CPU usage in the CloudWatch dashboard below, you can see that the CPU usage for each service does not increase even under heavy load. 

You can think of a bottleneck somewhere in the service. 
![image](/images/20_ec2/experiment04_04.png)

Let's take a look at the instance types of each service. Go to the EC2 service in the console and click the Instances menu on the left. 

Instance types except loadGenerator are t3.micro, which is a burstable performance instance type. 
![image](/images/20_ec2/experiment04_05.png)

Burstable performance instances are divided into Unlimited and Standard mode.

In the case of Standard mode, if there are no accumulated credits, instance will be throttled. Let's make sure there are no such instances. 

Then, click on one of **ChaosProductCompositeStack/productCompositeAsg** EC2 instances and look at the details as shown below. 
![image](/images/20_ec2/experiment04_06.png)

If you look at the bottom of the details, you will see a part called **Credit specification**, and it is marked as **unlimited** below. 
![image](/images/20_ec2/experiment04_07.png)

This time, click on one of **ChaosProductStack/productAsg** EC2 instances and look at the details. 

If you look at the bottom of the details, you will see a part called **Credit specification**, and it is marked as **standard** below. 
![image](/images/20_ec2/experiment04_08.png)

Let's take a look at the Monitoring tab for any remaining credits. Click the Monitoring tab and look at the **CPU credit usage**, **CPU credit balance** metrics at the bottom as shown below.

There are no remaining credits left. In this case, burstable performance instances will be throttled based on generation and type.
The t3.micro used in the demo application will be throttled at 10% CPU utilization. 

![image](/images/20_ec2/experiment04_09.png)
![image](/images/20_ec2/experiment04_10.png)

### Group Discussion

Write an improvement plan and expected results (Writing for 5 mins / Discussion for 10 mins)
