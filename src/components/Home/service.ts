import { API_PATH, request, privateRequest } from '@api/request';
import { useRequest } from 'ahooks';

interface IOptionsRequest {
  onSuccess?: (r: any) => void;
  onError?: (e: any) => void;
}

export const useLogin = (options?: IOptionsRequest) => {
  return useRequest(
    async () => {
      return request.post(API_PATH.AUTH_LOGIN, {
        data: {
          username: 'admin',
        },
      });
    },
    {
      manual: true,
      ...options,
    },
  );
};

// GET LIST POSTS
const serviceGetPosts = async (page?: number) => {
  const params = {
    page: page || 1,
  };
  return await privateRequest(request.get, API_PATH.GET_POSTS, { params });
};

export const useGetPosts = () => {
  const { data, loading, run } = useRequest(
    async (page?: number) => {
      return await serviceGetPosts(page);
    },
    {
      cacheKey: 'list-posts',
    },
  );

  return {
    dataPosts: data,
    run,
    loading,
  };
};
