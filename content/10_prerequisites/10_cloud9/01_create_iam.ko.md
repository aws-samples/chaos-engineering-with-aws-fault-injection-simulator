---
title: "1. IAM 역할 생성"
chapter: false
weight: 11
---

AWS Cloud9에서 실습에 필요한 권한을 확보 하기 위한 **IAM Role**을 생성합니다.
 
AWS 콘솔에서 **IAM** Service 콘솔로 이동합니다.
![image](/images/10_prequisites/iam_01.png)

IAM 콘솔에서 **Roles메뉴**로 이동하고 **Create role** 버튼을 클릭합니다.
![image](/images/10_prequisites/iam_02.png)

Create role 페이지의 **Choose a use case** 영역에서 **EC2**를 선택하고 하단의 **Next:Permissions** 버튼을 클릭합니다.
![image](/images/10_prequisites/iam_03.png)

Create Role 페이지의 **Attach permissions policies**에서 아래와 같이 **AdministratorAccess** 를 선택하고 하단의 **Next:Tags** 버튼을 클릭합니다.
![image](/images/10_prequisites/iam_04.png)

별도 변경없이 하단의 **Next:Review** 버튼을 클릭합니다.

Create Role 페이지의 **Review**에서 **Role name**을 `ChaosEngineeringWorkshop-Admin` 로 입력하고 **Create role** 버튼을 클릭하여 Role을 생성합니다.
![image](/images/10_prequisites/iam_05.png)

정상적으로 Role의 생성이 완료되면 아래와 같은 메시지를 확인할 수 있습니다.
![image](/images/10_prequisites/iam_06.png)
