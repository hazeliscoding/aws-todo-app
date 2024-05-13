#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database-stack';
import { ComputeStack } from '../lib/compute-stack';
import { AuthStack } from '../lib/auth-stack';
import { AppsyncStack } from '../lib/appsync-stack';

const app = new cdk.App();
const dbStack = new DatabaseStack(app, `TodoApp-Database`);
const computeStack = new ComputeStack(app, `TodoApp-Compute`, {
  usersTable: dbStack.usersTable,
  todosTable: dbStack.todosTable,
});
const authStack = new AuthStack(app, `TodoApp-Auth`, {
  addUserPostConfirmation: computeStack.addUserToTableFunc,
});
const appsyncStack = new AppsyncStack(app, `TodoApp-Appsync`, {
  userPool: authStack.todoUserPool,
  createTodoFunc: computeStack.createTodoFunc,
});
