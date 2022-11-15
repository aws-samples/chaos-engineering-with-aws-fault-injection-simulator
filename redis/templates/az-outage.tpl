{
    "description": "Run an AZ Outage fault injection on the specified availability zone",
    "targets": {
        "az": {
            "resourceType": "aws:ec2:subnet",
            "parameters": {
                "availabilityZoneIdentifier": "${az}",
                "vpc": "${vpc}"
            },
            "selectionMode": "ALL"
        }
    },
    "actions": {
        "AZOutage": {
            "actionId": "aws:network:disrupt-connectivity",
            "description": "Run an az network outage",
            "parameters": {
                "duration": "${duration}",
                "scope": "availability-zone"
            },
            "targets": {
                "Subnets": "az"
            }
        }
    },
    "stopConditions": [
        {
            "source": "aws:cloudwatch:alarm",
            "value": "${alarm}"
        }
    ],
    "roleArn": "${fis_role}",
    "logConfiguration": {
        "logSchemaVersion": 1,
        "cloudWatchLogsConfiguration": {
            "logGroupArn": "${logs}"
        }
    },
    "tags": {
        "Name": "AZOutage"
    }
}
