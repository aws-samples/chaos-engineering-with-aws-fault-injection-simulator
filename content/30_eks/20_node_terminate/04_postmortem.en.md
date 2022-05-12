---
title: "4. Postmortem - Learning from Failure"
chapter: false
weight: 14
---

## Discussion

+ What did you expected?
+ What happend?

Then access the microservices application again. What happened? Perhaps a node shutdown by a fault injection experiment will cause the application to crash. This is because the first deployment of the application did not consider high availability.

## Architecture Improvements

Cluster Autoscaler is a tool that automatically adjusts the size of the Kubernetes cluster when one of the following conditions is true:

+ there are pods that failed to run in the cluster due to insufficient resources.
+ there are nodes in the cluster that have been underutilized for an extended period of time and their pods can be placed on other existing nodes.

Cluster Autoscaler provides integration with Auto Scaling groups. Cluster Autoscaler will attempt to determine the CPU, memory, and GPU resources provided by an EC2 Auto Scaling Group based on the instance type specified in its Launch Configuration or Launch Template. Click [here](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/aws) for more information.

Watch the logs to verify cluster autoscaler is installed properly. If everything looks good, without error log, we are now ready to scale our cluster.
```sh
kubectl -n kube-system logs -l app.kubernetes.io/name=aws-cluster-autoscaler
```

Scale out pods for high availability.
```sh
cd ~/environment/fisworkshop/eks/
kubectl apply -f kubernetes/manifest/sockshop-demo-ha.yaml
```

And wait util all pods/containers are running:
```sh
kubectl -n sockshop get pods -w
```
Enter `CTRL+C` to exit watch mode

## Rerun Experiment

Back to the AWS FIS service page and select `Terminate EKS nodes` and start the experiment using **Actions** button. AWS FIS shuts down EKS nodes again. On the EC2 service page, you will see the instances being terminated. And you can see that new instances are created right after the EKS nodes are shut down.

```sh
kubectl get nodes -w
```
```sh
NAME                                            STATUS   ROLES    AGE     VERSION
ip-10-1-1-183.ap-northeast-2.compute.internal    Ready    <none>   56m     v1.20.4-eks-6b7464
ip-10-1-1-193.ap-northeast-2.compute.internal    Ready    <none>   4m12s   v1.20.4-eks-6b7464
ip-10-1-17-157.ap-northeast-2.compute.internal   Ready    <none>   55m     v1.20.4-eks-6b7464
ip-10-1-9-211.ap-northeast-2.compute.internal    Ready    <none>   11m     v1.20.4-eks-6b7464
ip-10-1-21-107.ap-northeast-2.compute.internal   Ready    <none>   10m40s   v1.20.4-eks-6b7464
ip-10-1-21-107.ap-northeast-2.compute.internal   NotReady   <none>   10m40s   v1.20.4-eks-6b7464
ip-10-1-21-107.ap-northeast-2.compute.internal   NotReady   <none>   10m40s   v1.20.4-eks-6b7464
```

However, your application is highly available, unlike the first experiment. Back to the application front-end website running on your EKS cluster. And check the application is working even though some EKS nodes are shut down.

## Conclustion

Chaos engineering is NOT about breaking thingsrandomly without a purpose, chaos engineering isabout breaking things in a controlled environment andthrough well-planned experiments in order to build confidence in your application to withstand turbulent conditions.
