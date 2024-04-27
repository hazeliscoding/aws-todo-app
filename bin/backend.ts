#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database-stack';

// Determine the environment from a command-line argument or environment variable
const environment = process.env.ENV || 'dev'; // Default to 'dev' if not specified

const app = new cdk.App();
const dbStack = new DatabaseStack(app, `TodoApp-${environment}-DatabaseStack`, {
  stage: environment,
});
