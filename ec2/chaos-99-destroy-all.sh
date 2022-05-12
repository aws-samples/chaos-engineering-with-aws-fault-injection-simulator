#!/bin/bash
set -e

SCRIPT_DIR_NAME=`dirname "$0"`
WORK_DIR_PATH=`cd ${SCRIPT_DIR_NAME}; pwd -P`

. ${WORK_DIR_PATH}/chaos-env.sh

CHAOS_BUCKET_NAME=`cat ${CDK_OUTPUT_FILE_CHAOS_BASE_STACK} | jq -r '.ChaosBaseStack.chaosBucketName'`
if [ -z "${CHAOS_BUCKET_NAME}" ]; then
  echo "Bucket name is empty."
  exit 1
fi

echo "Deleting files in the bucket. '${CHAOS_BUCKET_NAME}'"
aws s3 rm s3://${CHAOS_BUCKET_NAME}/ --recursive

cd ${WORK_DIR_PATH}/chaos-stack && cdk destroy --all -f

exit 0;