#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database-stack';
import { ComputeStack } from '../lib/compute-stack';
import { AuthStack } from '../lib/auth-stack';
import { AppsyncStack } from '../lib/appsync-stack';

// Determine the environment from a command-line argument or environment variable
const environment = process.env.ENV || 'dev'; // Default to 'dev' if not specified

const app = new cdk.App();
const dbStack = new DatabaseStack(app, `TodoApp-${environment}-DatabaseStack`, {
  stage: environment,
});
const computeStack = new ComputeStack(
  app,
  `TodoApp-${environment}-ComputeStack`,
  {
    stage: environment,
    usersTable: dbStack.usersTable,
    todosTable: dbStack.todosTable,
  }
);
const authStack = new AuthStack(app, `TodoApp-${environment}-AuthStack`, {
  stage: environment,
  addUserPostConfirmation: computeStack.addUserToTableFunc,
});
const appsyncStack = new AppsyncStack(
  app,
  `TodoApp-${environment}-AppsyncStack`,
  {
    stage: environment,
    userPool: authStack.todoUserPool,
    createTodoFunc: computeStack.createTodoFunc
  }
);
