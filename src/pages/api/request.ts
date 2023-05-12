import { deleteAuthCookies, getAccessToken, getRefreshToken, setAuthCookies } from '@store/auth';
import { ENV } from '@utils/env';
import TokenManager, { injectBearer } from 'brainless-token-manager';
import { extend } from 'umi-request';

const REQ_TIMEOUT = 25 * 1000;
export const isDev = ENV.NODE_ENV === 'development';
export const PREFIX_API = ENV.APP_API_URL;

const request = extend({
  prefix: PREFIX_API,
  timeout: REQ_TIMEOUT,
  headers: {},
  errorHandler: (error) => {
    // account blocked
    if (
      getAccessToken() &&
      error?.data?.status_code === 406 &&
      error?.data?.errors?.[0] === 'User is not active'
    ) {
      deleteAuthCookies();
      window.location.href = '/login';
      return;
    }

    throw error?.data || error?.response;
  },
});

const tokenManager = new TokenManager({
  getAccessToken: async () => {
    const token = getAccessToken();
    return `${token}`;
  },
  getRefreshToken: async () => {
    const refreshToken = getRefreshToken();

    return `${refreshToken}`;
  },
  onInvalidRefreshToken: () => {
    // Logout, redirect to login
    deleteAuthCookies();
  },
  executeRefreshToken: async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return {
        token: '',
        refresh_token: '',
      };
    }

    const r = await request.post('/auth/refresh-token', {
      data: {
        refreshToken: refreshToken,
      },
    });

    return {
      token: r?.accessToken,
      refresh_token: r?.refreshToken,
    };
  },
  onRefreshTokenSuccess: ({ token, refresh_token }) => {
    if (token && refresh_token) {
      setAuthCookies({
        token: `${token}`,
        refreshToken: refresh_token || '',
      });
    }
  },
});
const privateRequest = async (request: any, suffixUrl: string, configs?: any) => {
  const token: string = configs?.token
    ? configs?.token
    : ((await tokenManager.getToken()) as string);
  return request(suffixUrl, injectBearer(token, configs));
};

const API_PATH = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: 'auth/logout',
  GET_POSTS: '/posts',
};

export { API_PATH, privateRequest, request };
