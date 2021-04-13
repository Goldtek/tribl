import { axiosInstance } from '../config';
import { RefreshTokenInterface } from '../graphql/types';
import { REFRESH_TOKEN } from '../graphql/server/mutations';

export async function refreshToken(refreshToken: string) {
  return axiosInstance
    .post<{ data: RefreshTokenInterface }>('/', {
      query: `${REFRESH_TOKEN}`,
      variables: { payload: { refreshToken } }
    })
    .then(({ data }) => ({ ...data }));
}
