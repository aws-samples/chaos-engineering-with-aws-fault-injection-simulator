---
title: "Deploy Application"
chapter: false
weight: 40
---

## Deploy Application

For this lab, we picked up the Sock Shop application. Sock Shop is a microservices architecture sample application that Weaveworks initially developed. They made it open source (Apache-2.0) so it can be used by other organizations for learning and demonstration purposes.

Create the namespace and deploy application.
```sh
cd ~/environment/chaos-engineering-with-aws-fault-injection-simulator/eks/
kubectl apply -f kubernetes/manifest/sockshop-demo.yaml
```

Verify that the pod came up fine (ensure nothing else is running on port 8079):
```sh
kubectl -n sockshop get pods -l name=front-end
```

The output will be something like this:
```sh
NAME                         READY   STATUS    RESTARTS   AGE
front-end-7b8bcd59cb-wd527   1/1     Running   0          9s
```

### Local Workspace
In your local workspace, connect through a proxy to access your application's endpoint.

```sh
kubectl -n sockshop port-forward svc/front-end 8080:80
```
Open http://localhost:8080 on your web browser. This shows the Sock Shop main page.

### Cloud9
In your Cloud9 IDE, run the application.

```sh
kubectl -n sockshop port-forward svc/front-end 8080:80
```
Click Preview and Preview Running Application. This opens up a preview tab and shows the Sock Shop main page.

![sockshop-preview](/images/30_eks/weaveworks-sockshop-frontend.png)

## Congratulations!

:tada: You’ve deployed the sample application on your cluster.
