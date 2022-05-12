---
title: "4. Tools for Chaos Engineering"
chapter: false
weight: 14
---

## AWS Fault Injection Simulator

[AWS Fault Injection Simulator](https://aws.amazon.com/en/fis/) is a fully managed service for running Chaos Engineering on AWS, which makes it easier to improve the performance, observability, and resiliency of your applications. can be improved.

AWS Fault Injection Simulator helps teams build trust in application behavior by simplifying the process of setting up and running experiments that inject faults across various AWS services.

AWS Fault Injection Simulator allows teams to quickly set up experiments using pre-built templates. Fault Injection Simulator gives your team the controls and guardrails they need to run experiments in production, such as automatically rolling back or stopping experiments when certain conditions are met.

With a few clicks from the console, teams can run complex scenarios where common distributed system failures occur in parallel or sequentially over time to create the real-world conditions needed to find hidden weaknesses. 

---

## Gremlin
[Gremlin](https://www.gremlin.com/) is a "failure-as-a-service" platform built to make the Internet more reliable. It turns failure into resilience by offering engineers a fully hosted solution to safely experiment on complex 
systems, in order to identify weaknesses before they impact customers and cause revenue loss.

You can use Gremlin on [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-tosyg6v5cyney).

Downtime is expensive, damages customer trust, and causes employee burnout. Gremlin allows you to pressure test your applications to find their weak spots and better understand your overall systems.

With Gremlin, you can run Chaos Engineering experiments against hosts, containers, functions, or Kubernetes primitives in AWS with 12 different attack modes, or "Gremlins." Test every layer of your stack, from your network, resources, operating system, and application. Precisely target a small portion of your infrastructure or request layer traffic to see how your application reacts, then expand the Blast Radius and magnitude to gain confidence in the reliability of your systems.

Perform GameDays or increase your resiliency with every build by adding Gremlin into your pipelines. With Gremlin you can reduce incidents, shorten time to resolution, ship code faster, and launch new applications with confidence.

---

## Litumus
[Litumus](https://litmuschaos.io/) is a toolset to do cloud-native chaos engineering. Litmus provides tools to orchestrate chaos on Kubernetes to help SREs find weaknesses in their deployments. SREs use Litmus to run chaos experiments initially in the staging environment and eventually in production to find bugs, vulnerabilities. Fixing the weaknesses leads to increased resilience of the system.

Litmus takes a cloud-native approach to create, manage and monitor chaos. Chaos is orchestrated using the following Kubernetes Custom Resource Definitions (CRDs):

* ChaosEngine: A resource to link a Kubernetes application or Kubernetes node to a ChaosExperiment. ChaosEngine is watched by Litmus' Chaos-Operator which then invokes Chaos-Experiments
* ChaosExperiment: A resource to group the configuration parameters of a chaos experiment. ChaosExperiment CRs are created by the operator when experiments are invoked by ChaosEngine.
* ChaosResult: A resource to hold the results of a chaos-experiment. The Chaos-exporter reads the results and exports the metrics into a configured Prometheus server.

Chaos experiments are hosted on [hub.litmuschaos.io](https://hub.litmuschaos.io). It is a central hub where the application developers or vendors share their chaos experiments so that their users can use them to increase the resilience of the applications in production.

[Litumus github](https://github.com/litmuschaos/litmus)
