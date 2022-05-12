---
title: "Check the actual result"
chapter: false
weight: 30
---

### Check the actual result

Now let's take a look at the chaosMonitoringDashboard in Amazon CloudWatch. When a CPU load occurs in the product-composite service, an intermittent delay occurs at the response time.
![image](/images/20_ec2/experiment02_08.png)

However, the system did not go out of the steady state, and the CloudWatch alarm did not occur. 
![image](/images/20_ec2/experiment02_09.png)

FIS experiments are also completed normally.
![image](/images/20_ec2/experiment02_10.png)

Now, let's see if the instance scaled normally and how long it took to scale the instance.
In the console, go to EC2 Service. Select the **Auto Scaling Groups** menu at the bottom left.
Then select the item with **ChaosProductCompositeStack-xxxx** from the list. 
![image](/images/20_ec2/experiment02_11.png)

Select the Activity tab and check the Activity history at the bottom. 
![image](/images/20_ec2/experiment02_12.png)

You can see that it took about 5 minutes to scale up to 4 instances. 

**For the rest of the lab, change Desired Capacity back to 2 as shown below.**
Click the **Edit** button in the Auto Scaling groups setting below. 
![image](/images/20_ec2/experiment02_12_1.png)

In the popup, change the **Desired capacity** value to `2` and click the **Update** button. 
![image](/images/20_ec2/experiment02_12_2.png)