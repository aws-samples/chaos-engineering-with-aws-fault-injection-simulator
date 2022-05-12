---
title: "Deploy the applications"
chapter: false
weight: 10
---

## Download the repository and setup environment
* Run the following command in Cloud9 to download the repository.
```bash
cd ~/environment
git clone https://github.com/dns-msa/fisworkshop.git
```

* Cloud9's initial EBS capacity is 10G. For a smooth practice, increase the EBS capacity to 20G by running the following script. 
```bash
cd ~/environment/fisworkshop/ec2
./chaos-resize-ebs.sh
```

* Now run the following command to provision the environment for the lab.
```bash
cd ~/environment/fisworkshop/ec2
./chaos-00-deploy-all.sh
```
* It takes about 30 minutes or more for the environment to be created.