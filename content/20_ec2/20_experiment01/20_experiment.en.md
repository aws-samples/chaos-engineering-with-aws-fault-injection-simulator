---
title: "Fault Injection Experiment"
chapter: false
weight: 20
---

### Fault Injection Experiment

For the experiment, we will inject network latency on one of EC2 instances for the recommendation service. 

First, go to the FIS Service in the AWS console and select the **Experiment templates** menu from the left menu. Select the pre-created **Network Attack Template** and click on the **Start experiment** menu in Actions. 
![image](/images/20_ec2/experiment01_01.png)

On the next screen, click the **Start experiment** button.
![image](/images/20_ec2/experiment01_02.png)

Check the warning text, type `start` and click the **Start experiment** button again.
![image](/images/20_ec2/experiment01_03.png)

Now the attack starts against the network of the instance for the recommendation service. 
![image](/images/20_ec2/experiment01_04.png)

You can see that Stop Conditions is set in Details.
![image](/images/20_ec2/experiment01_05.png)

This is the CloudWatch alarm that we saw when defining the steady state. By defining stop conditions like this, the experiment can be stopped when the system goes out of steady state.
This allows for safer experiments. 

At the Actions tab, you can see that the attack lasts 5 minutes and injects a delay of 3 seconds (3000 ms) into the network. 
![image](/images/20_ec2/experiment01_06.png)

At the Targets tab, you can see which EC2 is actually being attacked. 
![image](/images/20_ec2/experiment01_07.png)
