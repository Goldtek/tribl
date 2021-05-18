// @ts-ignore
import { VouchedSession } from '@vouched.id/vouched-react-native';
import ENVIRONMENT_VARIABLES from 'react-native-config';

const vouchedPublicKey = ENVIRONMENT_VARIABLES.VOUCHED_PUBLIC_KEY;
let session: any;

export const initSession = (apiKey = vouchedPublicKey) => {
  session = new VouchedSession(apiKey);
};

export const getSession = () => {
  if (!session) {
    throw 'Init Vouched session first.';
  }
  return session;
};
