// useQuery mutation calls

import { useMutation } from 'react-query';
import { axiosInstance } from '../config';

export function useSigninMutation() {
  return useMutation((payload: object) =>
    axiosInstance.post('login', { ...payload })
  );
}
