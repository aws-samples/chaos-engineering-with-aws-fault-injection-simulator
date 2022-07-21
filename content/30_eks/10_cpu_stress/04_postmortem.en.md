---
title: "Postmortem (Learning from Failure)"
chapter: false
weight: 14
---

# Discussion

+ What did you expected?
+ What happend?

While the attack is running, switch to Container Insights dashboard. If you don't see a CPU spike after a short time, try reducing the time period of the chart. While viewing the metrics, ask yourself:

+ Was your hypothesis correct?
+ Did you see a CPU increase?
+ Did autoscaling kick in? Do you see a new host?
+ If autoscaling didn't kick in, why not? Is your policy misconfigured? Do you have a policy set up in the first place?

We can see on the Container Insights' **CPU Utilization** graph that the CPU spike was seen, but the graph for **Number of Nodes** saw no increase.

![amazon-cloudwatch-container-insights-exp1-results](/images/30_eks/aws-cw-container-insights-exp1-results1.png)

![amazon-cloudwatch-container-insights-exp1-results](/images/30_eks/aws-cw-container-insights-exp1-results2.png)

Does this mean our experiment failed? Not at all! **By running this experiment, we found a potential failure mode before it had a chance to impact customers**. We now have an action item to reconfigure our autoscaling rules. We can then verify them by repeating this experiment.

# Architecture Improvements

You've made your application more resilient by setting up auto scaling. It should look something like this:

![aws-ec2-autoscaling-policies](/images/30_eks/aws-ec2-autoscaling-policies.png)

# Rerun Experiment

Let's head back to [Gremlin](app.gremlin.com), and configure a CPU attack on all of your hosts. Click on **Attacks** which can be found on the left navigation bar followed by **New Attack**.

![gremlin-ui-new-attack](/images/30_eks/gremlin-create-new-attack.png)

Under **What do you want to attack?**, select **Infrastructure**, then **Hosts**. Select your three hosts, or select **Target all hosts** to automatically target the cluster.

![gremlin-ui-select-hosts](/images/30_eks/gremlin-select-hosts.png)

Under **Choose a Gremlin**, select **Resource**, then **CPU**. Set the **Length** to `360` seconds, change **CPU Capacity** to `80`, and select **All Cores** from the dropdown. 

![gremlin-ui-cpu-attack](/images/30_eks/gremlin-cpu-attack.png)

Then, click **Unleash Gremlin**.

While the experiment is running, keep an eye on CloudWatch Container Insights. Are the metrics different than the first time you ran the experiment? Did CloudWatch detect the high usage and provision a new node? If so, did you get an email notification? If so, congratulations! you've successfully ran an experiment, used your observations to implement a fix, then verified that fix! In a later section, we'll show you how to automate experiments to ensure that your fix works continuously.

# Conclustion

Chaos engineering is NOT about breaking thingsrandomly without a purpose, chaos engineering isabout breaking things in a controlled environment andthrough well-planned experiments in order to build confidence in your application to withstand turbulent conditions.
