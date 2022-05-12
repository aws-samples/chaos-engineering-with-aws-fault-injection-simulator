---
title: "2. IAM 역할 연결"
chapter: false
weight: 12
---

### Cloud9 Environment 생성하기

Cloud9 서비스로 이동합니다.
![image](/images/10_prequisites/cloud9_01.png)

**Create environment** 버튼을 클릭하여 Cloud9 Environment 생성을 시작합니다.
![image](/images/10_prequisites/cloud9_02.png)

**Name**에 `fisworkshop-cloud9-env` 를 입력하고 **Next step** 버튼을 클릭합니다.
![image](/images/10_prequisites/cloud9_03.png)

**Configure settings** 에서는 변경사항 없이 기본값으로 설정하고 **Next step** 버튼을 클릭합니다.

**Review** 페이지에서 **Create environment** 버튼을 클릭합니다.

AWS Cloud9의 프로비저닝이 완료되면 다음과 같은 통합개발환경(IDE) 화면을 보실 수 있습니다.
![image](/images/10_prequisites/cloud9_04.png)

---

### Cloud9 인스턴스에 Role 연결하기

AWS Cloud9을 프로비저닝하면 AWS Cloud9은 제한된 권한만을 가지도록 구성됩니다. 우리는 Hands-on을 위해서 AWS Cloud9 인스턴스에 **2.1 IAM Role 생성하기** 생성하기 에서 생성한 IAM Role을 연결할 것입니다.

Cloud9이 실행되면 하단에 터미널영역이 보일 것입니다.
![image](/images/10_prequisites/cloud9_05.png)

`aws configure list` 명령을 사용하여 현재 AWS Cloud9 환경에서 사용중인 Credential 정보를 다음과 같이 확인 합니다.
![image](/images/10_prequisites/cloud9_06.png)

Type이 **shared-credentials-file** 인것을 확인 할 수 있습니다. AWS Cloud9 이 프로비저닝 될 때 제한된 권한을 갖는 AWS managed temporary credential이 `~/.aws/credentials` 에 생성된 것을 알 수 있습니다.

AWS Cloud9 콘솔 우측 상단의 톱니바퀴 아이콘을 눌러서 Preferences 메뉴로 들어 갑니다.
![image](/images/10_prequisites/cloud9_07.png)

**AWS Settings** 메뉴에서 **'AWS managed temporary credential’**을 **disable** 합니다.
![image](/images/10_prequisites/cloud9_08.png)

다시 `aws configure list` 명령을 사용하여 현재 AWS Cloud9 환경에서 사용중인 Credential 정보를 확인 하면 다음과 같습니다.
![image](/images/10_prequisites/cloud9_09.png)

이제 EC2 콘솔로 이동하여 AWS Cloud9 인스턴스에 미리 만들어 두었던 IAM Role을 연결합니다. **Instances -> Actions -> Security -> Modify IAM role**
![image](/images/10_prequisites/cloud9_10.png)

**ChaosEngineeringWorkshop-Admin** 을 선택하고 저장합니다.
![image](/images/10_prequisites/cloud9_11.png)

AWS Cloud9 에 ROLE이 연결된 것을 확인하기 위해 다시한번 `aws configure list` 명령을 사용하여 Credential 정보를 확인합니다. **Type**의 값이 **iam-role** 인 것을 확인할 수 있습니다.
![image](/images/10_prequisites/cloud9_12.png)

아래와 같이 jq를 설치합니다.
```bash
sudo yum install -y jq
```

임시 Credential이 남아있지 않도록 삭제를 합니다.
```bash
rm -vf ${HOME}/.aws/credentials
```

아래와 같이 환경변수를 설정합니다.
```bash
echo "export AWS_DEFAULT_REGION=$(curl -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r .region)" >> ~/.bashrc
echo "export AWS_REGION=\$AWS_DEFAULT_REGION" >> ~/.bashrc
echo "export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)" >> ~/.bashrc
source ~/.bashrc
```

다시 ```aws configure list``` 명령을 사용하여 Credential 정보를 확인합니다.
![image](/images/10_prequisites/cloud9_13.png)

이제 설정이 완료되었습니다.