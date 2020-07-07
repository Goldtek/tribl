//@ts-nocheck
const { TRIBL_SERVER_BASE_URI } = 'react-native-dotenv';

// FIX THIS TO USE ENVIRONMENT VARIABLES (APP SECRETES)
const TRIBL_SERVER_BASE_URI =
  Config.TRIBL_SERVER_BASE_URI ||
  'https://api.8base.com/ckbtmw54y000507lb1osb1qov';

const ENVIRONMENT_VARIABLES = { TRIBL_SERVER_BASE_URI };

export default ENVIRONMENT_VARIABLES;
