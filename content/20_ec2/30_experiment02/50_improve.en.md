---
title: "Improvement & Verification"
chapter: false
weight: 50
---

### Apply improvement
To improve the time-consuming process of EC2 initialization, let's apply the Warm Pool provided by AutoScaling. 

First, go to the EC2 service in the console, select Auto Scaling Groups from the left menu, and click the **ChaosProductCompositeStack-productCompositeAsgXXXX** item. 
![image](/images/20_ec2/experiment02_13.png)

Select the **Instance management** tab and click the **Create warm pool** button at the bottom. 
![image](/images/20_ec2/experiment02_14.png)

Enter `2` in **Minimum warm pool size** and click the **Create** button. 
![image](/images/20_ec2/experiment02_15.png)

After waiting for a while, you can see that the instance has been added to the Warm pool instances area. 
![image](/images/20_ec2/experiment02_16.png)

And if you go to the Activity tab, you can see the process of adding a new instance. 

It took approximately 5 minutes for the instance to be created in the warm pool. 
![image](/images/20_ec2/experiment02_18.png)

Now go to EC2 Service in the console and select Instances from the left menu. You can see 2 instances in Stopped state are added as shown below. 
![image](/images/20_ec2/experiment02_19.png)

Warm Pool reduces the instance's scaling time and optimizes cost by performing the time-consuming initialization phase of the instance in advance and then managing the instance in the stopped state. 

### Check for improvement through experiment iteration
return to the **failure injection** step and start the experiment again.

The experiment started and the instance through the warm pool took about 1 minute and 30 seconds to scale as shown below. 
![image](/images/20_ec2/experiment02_20.png)

The scaling happened much faster. According to the dynamic scaling policy below, this part includes a warm-up time of 60 seconds, so in reality the new instance is ready within 30 seconds. 
![image](/images/20_ec2/experiment02_21.png)

### Postmortem - Learning from Failure 
Chaos engineering is not just about destroying systems.

It is a process of preparing in advance through various experiments, discovering the limitations of our system, and continuously improving it.

Through this, even if a failure occurs, you can respond more systematically without panic. 