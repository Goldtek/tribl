import Storage from '../libs/storage';
import { VerifyOTPIT } from '../graphql/types';
import { refreshToken } from '../network/query';
import { crashlytics } from '../firebase/config';
import { addMinutes, fromUnixTime } from 'date-fns';
import { decodeToken } from './decodeToken';

const checkRefreshToken = async (credentials: VerifyOTPIT) => {
  const payload = decodeToken(credentials.id_token);
  const tokenExpiryTime = fromUnixTime(payload?.exp);
  const tokenExpiryMinute = addMinutes(new Date(), 30);
  const expiryHour = tokenExpiryTime.getTime() <= tokenExpiryMinute.getTime();

  if (!expiryHour) return;

  try {
    const { data } = await refreshToken(credentials.refresh_token);
    await Storage.setUserCredentials(data?.refreshToken);
    return data;
  } catch (error) {
    crashlytics.recordError(new Error(`[GraphQL error]: Message: ${error}`));
  }
};

export default checkRefreshToken;
