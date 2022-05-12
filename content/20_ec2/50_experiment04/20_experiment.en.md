---
title: "Fault Injection Experiment"
chapter: false
weight: 20
---

### Fault Injection Experiment

For the experiment, open the file `~/environment/fisworkshop/ec2/chaos-stack/files/jmeter-template.jmx` in cloud9 to increase the number of Jmeter threads that apply the load. 

Change the value of `ThreadGroup.num_threads` in the file from 1000 to 1500 as shown below. 

Before change
```xml
...
        <stringProp name="ThreadGroup.num_threads">1000</stringProp>
        <stringProp name="ThreadGroup.ramp_time">30</stringProp>
        <boolProp name="ThreadGroup.scheduler">false</boolProp>
        <stringProp name="ThreadGroup.duration">300</stringProp>
        <stringProp name="ThreadGroup.delay"></stringProp>
        <boolProp name="ThreadGroup.same_user_on_next_iteration">false</boolProp>
      </ThreadGroup>
...
```

After change
```xml
...
        <stringProp name="ThreadGroup.num_threads">1500</stringProp>
        <stringProp name="ThreadGroup.ramp_time">30</stringProp>
        <boolProp name="ThreadGroup.scheduler">false</boolProp>
        <stringProp name="ThreadGroup.duration">300</stringProp>
        <stringProp name="ThreadGroup.delay"></stringProp>
        <boolProp name="ThreadGroup.same_user_on_next_iteration">false</boolProp>
      </ThreadGroup>
...
```

And run the command below, to apply the file and restart jmeter. 
```bash
cd ~/environment/fisworkshop/ec2/
./chaos-04-redeploy-load-generator.sh 
```