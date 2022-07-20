---
title: "2. Define Steady State"
chapter: false
weight: 12
---

## Define Steady State

Before we begin a failure experiment, we need to validate the user experience and revise the dashboard and metrics to understand that the systems are working under normal state, in other words, *steady state*.

Let's go ahead and explore our Sock Shop application.
Some things to try out:

+ Register and log in using the below credentials (These are very secure so please don't share them)
    - **Username:** `user`
    - **Password:** `password`
+ View various items
+ Add items to cart
+ Remove items from cart
+ Check out items

This is the steady state of our application that we want to compare our user experience as we start experiments.

![sockshop-preview](/images/30_eks/weaveworks-sockshop-frontend.png)

## Hypothesis

The experiment we’ll run is to verify and fine-tune our application availability when compute nodes are terminated accidentally. Our application is deployed as a container on the Kubernetes cluster, we assume that if some nodes are teminated, the Kubernetes control plane will reschedule the pods to the other healthy nodes.

We talked about following the scientific method when doing Chaos Engineering, starting with developing a hypothesis. To help with this, we’ve provided experiment chart (like the one below) to help design this experiment. Please take 5 minutes to write your experiment plan.

**Steady State Hypothesis Example**

+ Title: Services are all available and healthy
+ Type: What are your assumptions?
   - [ ] No Impact
   - [ ] Degraded Performance
   - [ ] Service Outage
   - [ ] Impproved Performance
+ Probes:
   - Type: CloudWatch Metric
   - Status: `service_number_of_running_pods` is greater than 0
+ Stop condition (Abort condition):
   - Type: CloudWatch Alarm
   - Status: `service_number_of_running_pods` is less than 1
+ Results:
   - What did you see?
+ Conclusions:
   - [ ] Everything is as expected
   - [ ] Detected something
   - [ ] Handleable error has occurred
   - [ ] Need to automate
   - [ ] Need to dig deeper
