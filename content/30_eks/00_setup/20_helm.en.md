---
title: "Install helm"
chapter: false
weight: 20
---

[Helm](https://helm.sh/) describes itself as a 'package manager for kubernetes' and can be used to deploy resources to Kubernetes.

You package your application as a **chart** which can contain templated files (usually Kubernetes resources) and default configuration **values** too use when rendering the template. Charts are reusable and values can be overridden for specific environments.

{{% notice tip %}}
We are using Helm v3 in the workshops. So there is no `tiller`. If you are using your own environment and not the workshops **Cloud9** environment and you have Helm v2 the commands should work ok.
{{% /notice %}}

At the terminal command prompt, enter the following command to download Helm. We then want to extract helm, make it executable and copy to a location in the path:

```sh
curl -o /tmp/helm.tar.gz -L https://get.helm.sh/helm-v3.6.0-linux-amd64.tar.gz
tar xvfz /tmp/helm.tar.gz -C /tmp
chmod +x /tmp/linux-amd64/helm
sudo mv /tmp/linux-amd64/helm /usr/local/bin/helm
```

This will install `helm` in your **Cloud9** environment. To test to make sure the command is installed properly, execute the command:

```bash
helm version
```

You should see the `helm` version message.
