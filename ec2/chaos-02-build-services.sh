#!/bin/bash
set -e

SCRIPT_DIR_NAME=`dirname "$0"`
WORK_DIR_PATH=`cd ${SCRIPT_DIR_NAME}; pwd -P`

. ${WORK_DIR_PATH}/chaos-env.sh

cd ${WORK_DIR_PATH}/eureka && ./mvnw -DskipTests=true clean package
cd ${WORK_DIR_PATH}/product && ./mvnw -DskipTests=true clean package
cd ${WORK_DIR_PATH}/product-composite && ./mvnw -DskipTests=true clean package
cd ${WORK_DIR_PATH}/review && ./mvnw -DskipTests=true clean package
cd ${WORK_DIR_PATH}/recommendation && ./mvnw -DskipTests=true clean package

CHAOS_BUCKET_NAME=`cat ${CDK_OUTPUT_FILE_CHAOS_BASE_STACK} | jq -r '.ChaosBaseStack.chaosBucketName'`

aws s3 cp ${WORK_DIR_PATH}/eureka/target/eureka.jar s3://${CHAOS_BUCKET_NAME}/
aws s3 cp ${WORK_DIR_PATH}/product/target/product.jar s3://${CHAOS_BUCKET_NAME}/
aws s3 cp ${WORK_DIR_PATH}/product-composite/target/product-composite.jar s3://${CHAOS_BUCKET_NAME}/
aws s3 cp ${WORK_DIR_PATH}/review/target/review.jar s3://${CHAOS_BUCKET_NAME}/
aws s3 cp ${WORK_DIR_PATH}/recommendation/target/recommendation.jar s3://${CHAOS_BUCKET_NAME}/

exit 0;