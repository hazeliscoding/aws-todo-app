import { PostConfirmationConfirmSignUpTriggerEvent } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const environment = process.env.ENV || 'dev';

const client = new DynamoDBClient({
  region: 'us-east-1',
});

exports.handler = async (event: PostConfirmationConfirmSignUpTriggerEvent) => {
  const date = new Date();
  const isoDate = date.toISOString();

  const params = {
    TableName: `TodoApp-${environment}-Users`,
    Item: marshall({
      UserID: event.request.userAttributes.sub,
      Email: event.request.userAttributes.email,
      Name: event.request.userAttributes.name,
      CreateAt: isoDate,
      __typename: 'User',
    }),
  };

  try {
    await client.send(new PutItemCommand(params));
  } catch (e) {
    console.error(e);
  }

  return event;
};
