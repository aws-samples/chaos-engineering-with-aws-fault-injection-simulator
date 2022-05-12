#!/bin/bash
set -e

SCRIPT_DIR_NAME=`dirname "$0"`
WORK_DIR_PATH=`cd ${SCRIPT_DIR_NAME}; pwd -P`

. ${WORK_DIR_PATH}/chaos-env.sh

cd ${WORK_DIR_PATH}/chaos-stack && cdk deploy --all --require-approval never --outputs-file ${CDK_OUTPUT_FILE_CHAOS_ALL_STACK}

exit 0;