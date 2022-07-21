---
title: "Install kubectl"
chapter: false
weight: 10
---

The Kubernetes command-line tool, kubectl, allows you to run commands against Kubernetes clusters. You can use kubectl to deploy applications, inspect and manage cluster resources, and view logs.

At the terminal command prompt, enter the following two commands:

```sh
curl -o /tmp/kubectl https://s3.us-west-2.amazonaws.com/amazon-eks/1.22.6/2022-03-09/bin/linux/amd64/kubectl
chmod +x /tmp/kubectl
sudo mv /tmp/kubectl /usr/local/bin/kubectl
```
This will install kubectl in your Cloud9 environment. To test to make sure the command is installed properly, execute the command:

```sh
kubectl version --client
```
You should see the kubectl version message.