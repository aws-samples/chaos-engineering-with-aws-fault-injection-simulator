---
title: "3. Starting Chaos Engineering"
chapter: false
weight: 13
---

To specifically address the uncertainty of distributed systems at scale, Chaos Engineering can be thought of as the facilitation of experiments to uncover systemic weaknesses. These experiments follow four steps:

- Start by defining ‘steady state’ as some measurable output of a system that indicates normal behavior.
- Hypothesize that this steady state will continue in both the control group and the experimental group.
- Introduce variables that reflect real world events like servers that crash, hard drives that malfunction, network connections that are severed, etc.
- Try to disprove the hypothesis by looking for a difference in steady state between the control group and the experimental group.


#### Build a Hypothesize about Steady State
Focus on the measurable output of a system, rather than internal attributes of the system. It defines the steady state of a system by measuring the results in a short period. The overall system’s throughput, error rates, latency percentiles, etc. could all be metrics of interest representing steady state behavior. By focusing on systemic behavior patterns during experiments, Chaos verifies that the system does work, rather than trying to validate how it works.

#### Vary Real-World Events
Chaos variables reflect real-world events. Prioritize events either by potential impact or estimated frequency. Consider events that correspond to hardware failures like servers dying, software failures like malformed responses, and non-failure events like a spike traffic or a scaling event. Any event capable of disrupting steady state is a potential variable in a Chaos experiment.

#### Run Experiments in Production
Systems behave differently depending on environment and traffic patterns. Since the behavior of utilization can change at any time, sampling real traffic is the only way to reliably capture the request path. To guarantee both authenticity of the way in which the system is exercised and relevance to the current deployed system, Chaos strongly prefers to experiment directly on production traffic.

#### Automate Experiments to Run Continuously
Running experiments manually is time-intensive and ultimately unsustainable. Automate experiments and run them continuously. Chaos Engineering builds automation into each system to drive both orchestration and analysis.

#### Minimize Blast Radius
Experimenting in production can cause unnecessary customer pain. There must be an allowance for some short-term negative impact, it is the responsibility and obligation of the Chaos Engineer to minimized and contained the problems from experiments. (Translator's note: When continusous experimentation conducted in production environment not cause errors by users, the customers will not be attected even abnormal situations occur.)
