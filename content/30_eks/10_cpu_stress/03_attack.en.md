---
title: "3. Fault Injection Experiment"
chapter: false
weight: 13
---

# Perform the Experiment

Now that we've defined our experiment and gathered observations, let's run the experiment. Start by opening the [Gremlin](https://app.gremlin.com) tab in your browser. On the left navigation bar, click **Attacks**, followed by **New Attack.**

![gremlin-ui-new-attack](/images/30_eks/gremlin-create-new-attack.png)

Under **"What do you want to attack?"**, select **Infrastructure**, then **Hosts**. You can either select each host individually, or click **Target all hosts** to select all three of your hosts.

![gremlin-ui-select-hosts](/images/30_eks/gremlin-select-hosts.png)

Expand **Choose a Gremlin** and select **Resource**, then **CPU**. Change **Length** to `360`, change **CPU Capacity** to `80` and select **"All Cores"** from the dropdown.

![gremlin-ui-cpu-attack](/images/30_eks/gremlin-cpu-attack.png)

Now, click **Unleash Gremlin** to start the attack.

{{% notice tip %}}
If you want to stop the attack at any time, click either the **Halt** or **Halt All Attacks** button in the top-right corner.
{{% /notice %}}

🎉 Congrats, you've unleashed your first attack! In the next page, we will talk about observing the chaos engineering experiment we just unleashed.