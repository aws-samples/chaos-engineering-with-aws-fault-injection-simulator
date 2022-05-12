---
title: "1. Create IAM Role"
chapter: false
weight: 11
---

We need to create **IAM Role** to allow AWS Cloud9 workspace to manage AWS resource for this workshop.

Move to **IAM** Service in the AWS Management Console.
![image](/images/10_prequisites/iam_01.png)

Next, move to the **Roles** menu in the AWS IAM console. And click **Create role** button.
![image](/images/10_prequisites/iam_02.png)

Select **EC2** on the 'Create role' page of **Choose a use case** menu, and choose **EC2**. Then click **Next:Permissions** button at the bottom of the screen.
![image](/images/10_prequisites/iam_03.png)

On the Create Role page, select **AdministratorAccess** from the **Attach Permissions Policy** list as follows: Then click the **Next:Tags** button at the bottom of the screen.
![image](/images/10_prequisites/iam_04.png)

Next, click the **Next:Review** button to go forward.

In the **Review** of the Create Role page, enter the **Role name** as `ChaosEngineeringWorkshop-Admin` and click the **Create role** button to create the Role.
![image](/images/10_prequisites/iam_05.png)

If the role creation is successfully completed, you will see the message below.
![image](/images/10_prequisites/iam_06.png)
