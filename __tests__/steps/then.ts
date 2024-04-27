import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import * as dotenv from 'dotenv';
dotenv.config();

const stage = process.env.ENV;
const ddbClient = new DynamoDBClient({
  region: 'us-east-1',
});

export const user_exists_in_UsersTable = async (
  userSub: string
): Promise<any> => {
  let item: unknown;
  console.log('Looking for User: ', userSub);
  const params = {
    TableName: `TodoApp-${stage}-Users`,
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
