#!/bin/bash
set -e

SCRIPT_DIR_NAME=`dirname "$0"`
WORK_DIR_PATH=`cd ${SCRIPT_DIR_NAME}; pwd -P`

. ${WORK_DIR_PATH}/chaos-env.sh

CHAOS_BUCKET_NAME=`cat ${CDK_OUTPUT_FILE_CHAOS_BASE_STACK} | jq -r '.ChaosBaseStack.chaosBucketName'`
cd ${WORK_DIR_PATH}/review && ./mvnw -DskipTests=true clean package
aws s3 cp ${WORK_DIR_PATH}/review/target/review.jar s3://${CHAOS_BUCKET_NAME}/

aws ssm send-command \
	--targets '[{"Key":"tag:Name","Values":["ChaosReviewStack/reviewAsg"]}]' \
	--document-name "AWS-RunShellScript" \
	--max-concurrency 1 \
	--parameters '{"commands":["#!/bin/bash","sudo systemctl stop app", "sleep 10", "sudo systemctl start app", "sleep 30"]}'
	#--output text

exit 0;