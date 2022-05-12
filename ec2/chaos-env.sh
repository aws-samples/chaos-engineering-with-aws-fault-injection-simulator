#!/bin/bash
set -e

SCRIPT_DIR_NAME=`dirname "$0"`
WORK_DIR_PATH=`cd ${SCRIPT_DIR_NAME}; pwd -P`

CDK_OUTPUT_DIR=${WORK_DIR_PATH}/chaos-stack/cdk.out
CDK_OUTPUT_FILE_CHAOS_BASE_STACK=${CDK_OUTPUT_DIR}/chaos-base-stack-output.json
CDK_OUTPUT_FILE_CHAOS_ALL_STACK=${CDK_OUTPUT_DIR}/chaos-all-stack-output.json
