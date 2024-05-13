import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { AppSyncResolverEvent } from 'aws-lambda';
import { ulid } from 'ulid';

const client = new DynamoDBClient({ region: 'us-east-1' });
const tableName = 'TodoApp-Todos';

export const handler = async (event: AppSyncResolverEvent<any>) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const { UserID, title } = event.arguments.input;
  const TodoID = ulid();
  const params: PutItemCommandInput = {
    TableName: tableName,
    Item: marshall({
      UserID,
      TodoID,
      title: title,
      completed: false,
    }),
  };

  try {
    await client.send(new PutItemCommand(params));
    return {
      UserID,
      TodoID,
      title,
      completed: false,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
