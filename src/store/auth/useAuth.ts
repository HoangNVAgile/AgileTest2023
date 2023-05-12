import { API_PATH, PREFIX_API } from '@api/request';
import { useRequest } from 'ahooks';
import request from 'umi-request';

import { deleteAuthCookies, getAccessToken, setAuthCookies } from '.';

export interface IAuth {
  loading?: boolean;
  token: string | null;
  refreshToken?: string | null;
  expiredTime?: number;
  isRegister?: boolean;
}

export const useAuth = () => {
  const requestLogout = useRequest(
    async (token: any) => {
      return request.post(`${PREFIX_API}${API_PATH.AUTH_LOGOUT}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    {
      manual: true,
    },
  );

  const onLogout = async () => {
    try {
      const token = getAccessToken();
      requestLogout.run(token);
      deleteAuthCookies();
      // onResetProfile();
      // await router.replace(ROUTE_PATH.Auth);
    } catch (error) {
      console.log('Logout error', error);
    }
  };

  const onLogin = (data: IAuth) => {
    try {
      setAuthCookies({
        token: `${data.token}`,
        refreshToken: data.refreshToken || '',
        expiredTime: data.expiredTime,
      });
    } catch (error) {
      console.log(error);
    }
  };


  return {
    isLogin: !!getAccessToken(),
    onLogin,
    onLogout,
  };
};
