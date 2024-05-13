import * as cdk from 'aws-cdk-lib';
import * as awsAppSync from 'aws-cdk-lib/aws-appsync';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';

interface AppsyncStackProps extends cdk.StackProps {
  stage: string;
  userPool: UserPool;
  createTodoFunc: NodejsFunction;
}

export class AppsyncStack extends cdk.Stack {
  public readonly api: awsAppSync.IGraphqlApi;

  constructor(scope: Construct, id: string, props: AppsyncStackProps) {
    super(scope, id, props);

    this.api = this.createAppSyncApi(props);
  }

  createAppSyncApi(props: AppsyncStackProps) {
    const api = new awsAppSync.GraphqlApi(this, 'TodoAppsyncApi', {
      name: `TodoAppsyncApi-${props.stage}`,
      definition: awsAppSync.Definition.fromFile(
        path.join(__dirname, '../graphql/schema.graphql')
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: awsAppSync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: props.userPool,
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: awsAppSync.AuthorizationType.IAM,
          },
        ],
      },
      logConfig: {
        fieldLogLevel: awsAppSync.FieldLogLevel.ALL,
      },
    });

    new cdk.CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl,
    });

    return api;
  }

  createTodoResolver(
    scope: Construct,
    props: AppsyncStackProps,
    api: awsAppSync.IGraphqlApi
  ) {
    const createTodoResolver = api
      .addLambdaDataSource('CreateTodoDataSource', props.createTodoFunc)
      .createResolver('CreateTodoMutation', {
        typeName: 'Mutation',
        fieldName: 'createTodo',
      });
  }
}
