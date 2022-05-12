#!/bin/bash
set -e

SCRIPT_DIR_NAME=`dirname "$0"`
WORK_DIR_PATH=`cd ${SCRIPT_DIR_NAME}; pwd -P`

. ${WORK_DIR_PATH}/chaos-env.sh

CHAOS_PRODUCT_COMPOSITE_ALB_DNS_NAME=`cat ${CDK_OUTPUT_FILE_CHAOS_ALL_STACK} | jq -r '.ChaosProductCompositeStack.productCompositeAlbDnsName'`
echo "request to http://${CHAOS_PRODUCT_COMPOSITE_ALB_DNS_NAME}/product-composites/product-001"
curl http://${CHAOS_PRODUCT_COMPOSITE_ALB_DNS_NAME}/product-composites/product-001 | jq .

exit 0;