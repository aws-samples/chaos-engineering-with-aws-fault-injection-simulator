---
title: "AWS CDK"
weight: 30
chapter: false
draft: false
---

## NODE.JS

AWS CDK는 Node.js (>= 10.13.0, except for versions 13.0.0 - 13.6.0)를 사용합니다. 장기간 기원 버전(14.x at this writing)을 사용하시길 권장합니다.

* Node.js를 설치하는 방법은 [node.js](https://nodejs.org/ko/) 공식 웹사이트를 방문하여 안내를 따르는 것입니다.
    * __Windows__: 만약 여러 분이 오래 된 버전의 Node.js을 설치하였다면, .msi 설치파일을 실행하기 위하여 관리자 권한을 요구할 수 있습니다.
* 여러 분이 이미 Node.js 설치하였다면, 다음 명령을 이용해서 AWS CDK와 호환되는 버전인지 점검할 수 있습니다:

    ```
    node --version
    ```

    출력 결과가 10.13.0 보다 크거나 같아야 합니다:

    ```
    v10.3.0
    ```

## AWS CDK

다음, AWS CDK 도구를 설치합니다. 이 도구는 명령줄 유틸리티이며, 여러 분이 CDK 어플리케이션을 관리하도록 해 줄 것입니다.

터미널을 열고 다음의 명령을 입력하세요:
```
npm install -g aws-cdk
```

* Windows: 관리자 권한으르 요구 할 것입니다.
* POSIX: 몇몇 시스템에서는 `sudo` 권한으로 실행해야 할 수 있습니다.

설치 완료하였다면, 다음과 같이 버전을 확인할 수 있습니다:

```
cdk --version
1.21.1 (build 842cc5f)
```
