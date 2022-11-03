import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

  //추가1
    const fn = new lambda.Function(this, 'LambdaFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/')
    });

  //Agent Layer 추가됨
    const agentArn = 'arn:aws:lambda:ap-northeast-1:800880067056:layer:CloudOne-ApplicationSecurity-nodejs14_x:1';
    const agentLayer = lambda.LayerVersion.fromLayerVersionArn(this, 'TrendMicroAgent', agentArn);
    fn.addLayers(agentLayer)
    
  // fn에 환경변수 추가
    fn.addEnvironment('AWS_LAMBDA_EXEC_WRAPPER', '/opt/trend_app_protect');
    fn.addEnvironment('TREND_AP_HELLO_URL', 'https://agents.jp-1.application.cloudone.trendmicro.com/');
    fn.addEnvironment('TREND_AP_KEY', 'bedb1571-f5c6-4bd2-890e-08d76fb36a05');
    fn.addEnvironment('TREND_AP_SECRET', 'b0f77243-40f1-4e0c-a0d9-83e85766081d');
    
  }
}
