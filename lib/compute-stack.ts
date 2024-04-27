import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import path = require('path');

interface ComputeStackProps extends cdk.StackProps {
  stage: string;
  usersTable: Table;
}

export class ComputeStack extends cdk.Stack {
  public readonly addUserToTableFunc: NodejsFunction;

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    this.addUserToTableFunc = this.addUserToUsersTable(props);
  }

  addUserToUsersTable(props: ComputeStackProps) {
    const func = new NodejsFunction(this, 'addUserFunc', {
      functionName: `addUserFunc-${props.stage}`,
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: path.join(
        __dirname,
        '../functions/AddUserPostConfirmation/index.ts'
      ),
    });

    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:PutItem'],
        resources: [props.usersTable.tableArn],
      })
    );

    return func;
  }
}
