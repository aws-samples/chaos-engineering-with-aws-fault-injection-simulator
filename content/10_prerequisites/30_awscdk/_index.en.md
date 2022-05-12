---
title: "AWS CDK"
weight: 30
chapter: false
draft: false
---

## NODE.JS

The AWS CDK uses Node.js (>= 10.13.0, except for versions 13.0.0 - 13.6.0). A version in active long-term support (14.x at this writing) is recommended.

* To install Node.js visit the [node.js](https://nodejs.org/en/) website.
    * __Windows__: if you have an old version of Node.js installed on your system, it may be required to run the .msi installation as Administrator.
* If you already have Node.js installed, verify that you have a compatible version:

    ```
    node --version
    ```

    Output should be >= 10.13.0:

    ```
    v10.3.0
    ```

## AWS CDK

Next, we’ll install the AWS CDK Toolkit. The toolkit is a command-line utility which allows you to work with CDK apps.

Open a terminal session and run the following command:
```
npm install -g aws-cdk
```

* Windows: you’ll need to run this as an Administrator
* POSIX: on some systems you may need to run this with `sudo`

You can check the toolkit version:

```
cdk --version
1.21.1 (build 842cc5f)
```
