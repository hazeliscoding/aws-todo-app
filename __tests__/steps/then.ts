import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import * as dotenv from 'dotenv';
dotenv.config();

const ddbClient = new DynamoDBClient({
  region: 'us-east-1',
});

export const user_exists_in_UsersTable = async (
  userSub: string
): Promise<any> => {
  let item: unknown;
  console.log('Looking for User: ', userSub);
  const params = {
    TableName: 'TodoApp-Users',
    Key: {
      UserID: { S: userSub },
    },
  };
  try {
    const getItemResponse = await ddbClient.send(new GetItemCommand(params));
    if (getItemResponse.Item) {
      item = unmarshall(getItemResponse.Item);
    }
  } catch (e) {
    console.error(e);
  }

  console.log('Found Item -->', item);

  return item;
};

export const todo_exists_in_TodosTable = async (
  userId: string,
  todoId: string
): Promise<any> => {
  let Item: unknown;
  const params = {
    TableName: 'TodoApp-Todos',
    Key: {
      UserID: { S: userId },
      TodoID: { S: todoId },
    },
  };

  try {
    const response = await ddbClient.send(new GetItemCommand(params));
    if (response.Item) {
      Item = unmarshall(response.Item);
    }
  } catch (e) {
    console.error(e);
  }

  console.log('Found Item -->', Item);
  return Item;
};
