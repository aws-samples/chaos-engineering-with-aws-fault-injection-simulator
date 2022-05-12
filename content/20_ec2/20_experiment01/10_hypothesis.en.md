---
title: "Build Hypothesize"
chapter: false
weight: 10
---

### Build Hypothesize
Let's assume that the recommendation service can get intermittent delays when there is a lot of traffic.

At this time, there may be a delay of about 3 seconds, and the delay will be resolved when the traffic decreases after a certain period of time. 

### Define expected results
The demo application should not affect the end-user experience even if there is a delay in the recommendation service, or it should only affect a short time of less than 1 minute.