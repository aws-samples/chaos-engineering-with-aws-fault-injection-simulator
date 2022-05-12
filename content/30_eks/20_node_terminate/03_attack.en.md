---
title: "3. Fault Injection Experiment"
chapter: false
weight: 13
---

## Start Experiment

Make sure that all your EKS node group instances are running. 
```sh
kubectl get nodes
```

Go to the AWS FIS service page and select `Terminate EKS nodes` from the list of experiment templates. Then use the on-screen **Actions** button to start the experiment. AWS FIS shuts down EKS nodes for up to 70% of currently running instances. In this experiment, this value is 40% and it is configured in the experiment template. You can edit this value in the target selection mode configuration if you want to change the number of EKS nodes to shut down. When the experiment started, you can see the terminated instances on the EC2 service page, and you will see the new instances will appear shortly after the EKS nodes are shut down.

![aws-fis-terminate-eks-nodes](/images/30_eks/aws-fis-terminate-eks-nodes.png)

![aws-fis-terminate-eks-nodes-action-complete](/images/30_eks/aws-fis-terminate-eks-nodes-action-complete.png)

## Result

You can see the nodes being shut down in the cluster:
```sh
kubectl get nodes -w
```
```sh
NAME                                            STATUS   ROLES    AGE     VERSION
ip-10-1-1-205.ap-northeast-2.compute.internal   Ready    <none>   21m     v1.20.4-eks-6b7464
ip-10-1-9-221.ap-northeast-2.compute.internal   Ready    <none>   4m40s   v1.20.4-eks-6b7464
ip-10-1-9-221.ap-northeast-2.compute.internal   NotReady   <none>   4m40s   v1.20.4-eks-6b7464
ip-10-1-9-221.ap-northeast-2.compute.internal   NotReady   <none>   4m40s   v1.20.4-eks-6b7464
```
Enter `CTRL+C` to exit watch mode

Perhaps the application is broken as you can see in the picture below.

![weaveworks-sockshop-container-restart](/images/30_eks/weaveworks-sockshop-container-restart.png)

![weaveworks-sockshop-frontend-broken](/images/30_eks/weaveworks-sockshop-frontend-broken.png)

![weaveworks-sockshop-catalogue-broken](/images/30_eks/weaveworks-sockshop-catalogue-broken.png)
