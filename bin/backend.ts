#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database-stack';
import { ComputeStack } from '../lib/compute-stack';
import { AuthStack } from '../lib/auth-stack';
import { AppsyncStack } from '../lib/appsync-stack';

const app = new cdk.App();
const dbStack = new DatabaseStack(app, `Dev-TodoApp-DatabaseStack`);
const computeStack = new ComputeStack(app, `Dev-TodoApp-ComputeStack`, {
  usersTable: dbStack.usersTable,
  todosTable: dbStack.todosTable,
});
const authStack = new AuthStack(app, `Dev-TodoApp-AuthStack`, {
  addUserPostConfirmation: computeStack.addUserToTableFunc,
});
const appsyncStack = new AppsyncStack(app, `Dev-TodoApp-AppsyncStack`, {
  userPool: authStack.todoUserPool,
  createTodoFunc: computeStack.createTodoFunc,
});
