from aws_cdk import App
from ssm import DiskStressDocument
from cw import CloudWatchAlarm
from eks import EKS
from fis import FIS

props = {'namespace': 'fisworkshop'}
app = App()

ssm = DiskStressDocument(app, f"{props['namespace']}-ssm", props)
eks = EKS(app, f"{props['namespace']}-eks", props)
alarm = CloudWatchAlarm(app, f"{props['namespace']}-cw", eks.outputs)
fis = FIS(app, f"{props['namespace']}-fis", alarm.outputs)

app.synth()
