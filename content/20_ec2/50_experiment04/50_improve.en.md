---
title: "Improvement & Verification"
chapter: false
weight: 50
---

### Apply improvement

So now let's change the credit specification setting for the ChaosProductStack/productAsg instance. 

Select one of **ChaosProductStack/productAsg** instances, click the **Actions** button, then click the **Instance settings > Change credit specification** button. 
![image](/images/20_ec2/experiment04_11.png)

Check the box under **Enable unlimited mode** and click the **Save** button. 
![image](/images/20_ec2/experiment04_12.png)

Repeat for the rest of **ChaosProductStack/productAsg** instances. 

Check again whether the change has been applied through the details of the instance. 
![image](/images/20_ec2/experiment04_13.png)

Now let's take a look at the CloudWatch dashboard again. You can see that the throughput increased and the response time decreased just by changing the Credit setting. 
![image](/images/20_ec2/experiment04_14.png)

### Check for improvement through experiment iteration
return to the **failure injection** step and start the experiment again.

Now, even when the load increases by 50%, the response time does not go out from the steaty state, and you can see that the throughput is increased to match the load.
![image](/images/20_ec2/experiment04_15.png)

There was no alarm, and the service is being processed stably. 
![image](/images/20_ec2/experiment04_16.png)

### Postmortem - Learning from Failure 

Since the demo application is a simple service, it may be possible to trace it by guessing or by looking up the log.

However, as services become more complex and there are complex relationships between services, it is very difficult to find the bottleneck.

Therefore, it is necessary to have visibility for the applications.

AWS provides a service called X-Ray, which allows you to get more visibility into your applications. 