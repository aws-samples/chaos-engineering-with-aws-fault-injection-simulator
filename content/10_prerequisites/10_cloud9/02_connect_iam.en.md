---
title: "2. Attach IAM Role"
chapter: false
weight: 12
---

### Create Cloud9 Environment

Move to the AWS Cloud9 service page.
![image](/images/10_prequisites/cloud9_01.png)

Click **Create environment** button to create a new Cloud9 environment.
![image](/images/10_prequisites/cloud9_02.png)

Enter `fisworkshop-cloud9-env` to **Name** input box and click **Next step** button.
![image](/images/10_prequisites/cloud9_03.png)

There is nothing to do in the **Configure settings** step. Leave everything as is and click the **Next step** button.

Click the **Create environment** button at the **Review** page.

After provisioning is complete, you will see the Integrated Development Environment (IDE) screen as shown below.
![image](/images/10_prequisites/cloud9_04.png)

---

### Attach IAM Role to Cloud9 instance

When you provision AWS Cloud9, AWS Cloud9 is configured with only limited permissions. We will attach the IAM role created in **2.1 Creating an IAM Role** to the AWS Cloud9 instance for this Lab.

When Cloud9 is running, you will see the terminal area at the bottom.
![image](/images/10_prequisites/cloud9_05.png)

Verify your credentials using `aws configure list` command in the AWS Cloud9 terminal
![image](/images/10_prequisites/cloud9_06.png)

You can see that the *Type* is **shared-credentials-file**. You can see that AWS managed temporary credential with limited permissions was created in `~/.aws/credentials` when AWS Cloud9 was provisioned.

Click the gear icon at the top right of the AWS Cloud9 console to enter the Preferences menu.
![image](/images/10_prequisites/cloud9_07.png)

**Disable** the **'AWS managed temporary credential’** option in the **AWS Settings** menu.
![image](/images/10_prequisites/cloud9_08.png)

Check your credentials using `aws configure list` command that you are using on the AWS Cloud9 workspace.
![image](/images/10_prequisites/cloud9_09.png)

Attach the IAM Role created in the previous step. Go to the EC2 service page.
**Instances -> Actions -> Security -> Modify IAM role**
![image](/images/10_prequisites/cloud9_10.png)

Select **ChaosEngineeringWorkshop-Admin** and Save.
![image](/images/10_prequisites/cloud9_11.png)

To verify the IAM Role is attached to AWS Cloud9 instance, rerun `aws configure list` command to show your credentials. You can see that the value of **Type** is **iam-role**.
![image](/images/10_prequisites/cloud9_12.png)

Next, install jq:
```bash
sudo yum install -y jq
```

Remove temporary credentials on your workspace.
```bash
rm -vf ${HOME}/.aws/credentials
```

Set the environment variables as follows.
```bash
echo "export AWS_DEFAULT_REGION=$(curl -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r .region)" >> ~/.bashrc
echo "export AWS_REGION=\$AWS_DEFAULT_REGION" >> ~/.bashrc
echo "export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)" >> ~/.bashrc
source ~/.bashrc
```

View again your aws credentials using `aws configure list` command.
![image](/images/10_prequisites/cloud9_13.png)

Workspace setup is complete!
