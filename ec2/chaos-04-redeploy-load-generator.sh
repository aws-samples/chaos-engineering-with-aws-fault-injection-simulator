#!/bin/bash
set -e

SCRIPT_DIR_NAME=`dirname "$0"`
WORK_DIR_PATH=`cd ${SCRIPT_DIR_NAME}; pwd -P`

. ${WORK_DIR_PATH}/chaos-env.sh

CHAOS_BUCKET_NAME=`cat ${CDK_OUTPUT_FILE_CHAOS_BASE_STACK} | jq -r '.ChaosBaseStack.chaosBucketName'`
aws s3 cp ${WORK_DIR_PATH}/chaos-stack/files/jmeter-template.jmx s3://${CHAOS_BUCKET_NAME}/

aws ssm send-command \
	--targets '[{"Key":"tag:Name","Values":["ChaosLoadGeneratorStack/loadGeneratorAsg"]}]' \
	--document-name "AWS-RunShellScript" \
	--max-concurrency 1 \
	--parameters '{"commands":["#!/bin/bash","pkill -f java && sleep 5", "cd /root/jmeter && sudo sh start-jmeter.sh 1>/dev/null 2>&1 &"]}'
    #--output text

exit 0;