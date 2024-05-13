import * as cdk from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface DatabaseStackProps extends cdk.StackProps {
  stage: string;
}

export class DatabaseStack extends cdk.Stack {
  public readonly usersTable: Table;
  public readonly todosTable: Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.usersTable = new Table(this, 'UsersTable', {
      partitionKey: {
        name: 'UserID',
        type: AttributeType.STRING,
      },
      tableName: `Dev-TodoApp-Users`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.todosTable = new Table(this, 'Todos', {
      partitionKey: {
        name: 'UserID',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'TodoID',
        type: AttributeType.STRING,
      },
      tableName: `Dev-TodoApp-TodosTable`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.todosTable.addGlobalSecondaryIndex({
      indexName: 'getTodoId',
      partitionKey: {
        name: 'UserID',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'title',
        type: AttributeType.STRING,
      },
    });
  }
}
