import * as cognito from '@aws-sdk/client-cognito-identity-provider';
import { Chance } from 'chance';
import * as dotenv from 'dotenv';
dotenv.config();

const chance = new Chance();

const cognitoClient = new cognito.CognitoIdentityProviderClient({
  region: 'us-east-1',
});

export const a_random_user = () => {
  const firstName = chance.first({ nationality: 'en' });
  const lastName = chance.first({ nationality: 'en' });
  const name = `${firstName} ${lastName}`;
  const password = chance.string({ length: 10 });
  const email = `${firstName}-${lastName}@e2eusers.com`;

  return { name, password, email };
};

export const an_authenticated_user = async (): Promise<any> => {
  const { name, password, email } = a_random_user();

  const userPoolId = process.env.ID_USER_POOL;
  const clientId = process.env.CLIENT_USER_POOL_ID;
  const username = email;
  console.log(` [${email}] --> signing up...`);
  const command = new cognito.SignUpCommand({
    ClientId: clientId,
    Username: username,
    Password: password,
    UserAttributes: [{ Name: 'name', Value: name }],
  });
  const signupResponse = await cognitoClient.send(command);
  const userSub = signupResponse.UserSub;
  const adminCommand: cognito.AdminGetUserCommandInput = {
    Username: userSub as string,
    UserPoolId: userPoolId as string,
  };

  await cognitoClient.send(new cognito.AdminConfirmSignUpCommand(adminCommand));
  console.log(`[${email}] --> confirmed signup!`);

  const authRequest: cognito.InitiateAuthCommandInput = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
    ClientId: process.env.CLIENT_USER_POOL_ID as string,
  };

  const authResponse = await cognitoClient.send(
    new cognito.InitiateAuthCommand(authRequest)
  );

  console.log(`[${email}] --> authenticated and signed in!`);

  return {
    email,
    password,
    username: userSub as string,
    idToken: authResponse.AuthenticationResult?.IdToken as string,
    accessToken: authResponse.AuthenticationResult?.AccessToken as string,
  };
};
