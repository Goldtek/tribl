import { axiosInstance } from '../config';
import { RefreshTokenInterface } from '../graphql/types';
import { REFRESH_TOKEN } from '../graphql/server/mutations';

export function refreshToken(refreshToken: string) {
  return axiosInstance.post<RefreshTokenInterface>('/', {
    query: `${REFRESH_TOKEN}`,
    variables: { payload: { refreshToken } }
  });
}
