from aws_cdk import (
    aws_events as aws_events,
    aws_iam as aws_iam,
    aws_lambda as aws_lambda,
    aws_events_targets as aws_events_targets,
    Stack, App, Duration
)

class LambdaCron(Stack):
    def __init__(self, app: App, id: str, props, **kwargs) -> None:
        super().__init__(app, id, **kwargs)

        fn_role = aws_iam.Role(self, "fn-cronjob", assumed_by = aws_iam.ServicePrincipal("lambda.amazonaws.com"))
        fn_role.add_to_policy(aws_iam.PolicyStatement(
            actions = ["fis:StartExperiment"],
            effect = aws_iam.Effect.ALLOW,
            resources = [
                "arn:aws:fis:*:*:experiment-template/*",
                "arn:aws:fis:*:*:experiment/*"
            ]
        ))

        with open("cronjob.py", encoding="utf8") as fp:
            handler_code = fp.read()

        fn = aws_lambda.Function(
            self, "cronjob",
            code = aws_lambda.InlineCode(handler_code),
            environment = { "EXPERIMENT_ID" : "change_me" },
            handler = "index.lambda_handler",
            timeout = Duration.seconds(300),
            runtime = aws_lambda.Runtime.PYTHON_3_7,
            role = fn_role
        )

        # Run every day at 6PM UTC
        # See https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html
        rule = aws_events.Rule(
            self, "schedule",
            schedule = aws_events.Schedule.cron(
                minute='0',
                hour='18',
                month='*',
                week_day='MON-FRI',
                year='*'),
        )
        rule.add_target(aws_events_targets.LambdaFunction(fn))

    # pass objects to another stack
    @property
    def outputs(self):
        return self.output_props
