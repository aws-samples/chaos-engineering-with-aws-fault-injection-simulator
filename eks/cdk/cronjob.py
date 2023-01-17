import os
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

fis = boto3.client('fis')

EXPID = os.environ['EXPERIMENT_ID']

def lambda_handler(event, context):
    # Trigger fault injection experiment
    res = fis.start_experiment(experimentTemplateId=EXPID)
