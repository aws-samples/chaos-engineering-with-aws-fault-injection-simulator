from aws_cdk import (
    aws_ssm as aws_ssm,
    core,
)
import os
import yaml

class DiskStressDocument(core.Stack):
    def __init__(self, app: core.App, id: str, props, **kwargs) -> None:
        super().__init__(app, id, **kwargs)

        with open('disk-stress.yaml', 'r') as f:
            doc_content = yaml.safe_load(f)

        aws_ssm.CfnDocument(self, "fis-disk-stress",
            name = 'FIS-Run-Disk-Stress',
            content = doc_content,
            document_format = 'YAML',
            document_type = 'Command'
        )

        self.output_props = props.copy()

    # pass objects to another stack
    @property
    def outputs(self):
        return self.output_props
