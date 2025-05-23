// AWS Cognito configuration for Amplify v6

// Import environment variables
const region = import.meta.env.VITE_AWS_REGION;
const userPoolId = import.meta.env.VITE_AWS_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID;
// Validate required environment variables
if (!region || !userPoolId || !userPoolClientId) {
  console.error(
    "Missing required AWS Cognito configuration in environment variables."
  );
}

export const awsConfig = {
  Auth: {
    Cognito: {
      region: region,
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId,
      loginWith: {
        email: true,
      },
    },
  },
};
