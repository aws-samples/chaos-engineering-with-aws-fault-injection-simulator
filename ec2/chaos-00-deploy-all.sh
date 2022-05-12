#!/bin/bash
set -e

SCRIPT_DIR_NAME=`dirname "$0"`
WORK_DIR_PATH=`cd ${SCRIPT_DIR_NAME}; pwd -P`

${WORK_DIR_PATH}/chaos-01-deploy-cdk-base-stack.sh \
&& ${WORK_DIR_PATH}/chaos-02-build-services.sh \
&& ${WORK_DIR_PATH}/chaos-03-deploy-cdk-chaos-stack.sh