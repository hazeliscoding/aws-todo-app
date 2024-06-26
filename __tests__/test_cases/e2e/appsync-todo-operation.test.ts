import * as given from '../../steps/given';
import * as then from '../../steps/then';
import * as when from '../../steps/when';

import { Chance } from 'chance';

const chance = new Chance();

describe('Graphql/Appsync Todo operations', () => {
  let user: any = null;

  beforeAll(async () => {
    user = await given.an_authenticated_user();
  });

  it('UserID and title Should be saved in Todos Table', async () => {
    const title = chance.string({ length: 10 });
    const todoData = {
      UserID: user.username,
      title: title,
    };
    const createTodoResponse = await when.user_creates_a_todo(user, todoData);
    const todoId = createTodoResponse.TodoID;
    console.log('TODO ID --->', todoId);
    const ddbUser = await then.todo_exists_in_TodosTable(user.username, todoId);

    expect(ddbUser.UserID).toMatch(todoData.UserID);
    expect(ddbUser.title).toMatch(todoData.title);
  });
});
