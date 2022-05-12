---
title: "Check the actual result"
chapter: false
weight: 30
---

### Check the actual result

Now, let's monitor through Dashboards created in Amazon CloudWatch. As the load increases, the product-composite service experiences a delay. 
![image](/images/20_ec2/experiment04_01.png)

As the delay continues, the system goes out of the steady state and a CloudWatch alarm occurs. 
![image](/images/20_ec2/experiment04_02.png)

Open the `~/environment/fisworkshop/ec2/chaos-stack/files/jmeter-template.jmx` file in cloud9 to restore the number of Jmeter threads. 

Change the value of `ThreadGroup.num_threads` in the file from 1500 to 1000 as shown below. 

Before change
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

After change
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

And run the command below, to apply the file and restart jmeter. 
```bash
cd ~/environment/fisworkshop/ec2/
./chaos-04-redeploy-load-generator.sh 
```

After waiting for 1 or 2 minutes, the load decreases and the service will be back to normal. 
![image](/images/20_ec2/experiment04_03.png)
