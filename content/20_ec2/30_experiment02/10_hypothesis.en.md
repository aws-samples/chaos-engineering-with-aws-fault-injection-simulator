---
title: "Build Hypothesize"
chapter: false
weight: 10
---

### Build Hypothesize
Let's assume that the product-composite service is a CPU-intensive workload. So, when CPU usage increases, instance scaling must occur through AutoScaling for stability. 

### Define expected results
In the demo application, when the CPU usage of the EC2 instance for the product-composite service increases, AutoScaling creates an additional available instance within 3 minutes and should be able to process the request.
