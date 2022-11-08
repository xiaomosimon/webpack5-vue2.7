import axios, {
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
  AxiosResponse,
  AxiosError,
} from 'axios';
import router from '@/router';
import { useUserStore } from '@/store/user';
import { message } from 'ant-design-vue';
import apiWhiteList from './apiWhiteList';

export const isEnvDevelopment =
  webpackDefineEnvConfig.NODE_ENV === 'development';
const baseURL = isEnvDevelopment
  ? webpackDefineEnvConfig.mainProxyTarget || webpackDefineEnvConfig.baseURL
  : webpackDefineEnvConfig.baseURL;

export const $axios = axios.create({
  baseURL,
  timeout: webpackDefineEnvConfig.timeout,
});

let waitTokenRefreshQueues: Array<AxiosRequestConfig> = [];
// 刷新token处理
let fetchRefreshTokenInstance: Promise<AxiosResponse> | null;

/**
 * 处理刷新token，单例
 * @returns Promise成功或失败
 */
function handleRefreshToken() {
  if (fetchRefreshTokenInstance) {
    return fetchRefreshTokenInstance;
  }
  fetchRefreshTokenInstance = $axios
    .get<EndResponseData<string>>('/rest/refresh_token')
    .then((res) => {
      const userStore = useUserStore();
      if (res.data.code === 0 && res.data.content) {
        userStore.token = res.data.content;
        waitTokenRefreshQueues.forEach((config) => $axios.request(config));
        waitTokenRefreshQueues = [];
        return res;
      }
      message.error('token刷新失败，请重新登录');
      router.replace('/login');
      return Promise.reject(res);
    })
    .finally(() => {
      fetchRefreshTokenInstance = null;
    });
  return fetchRefreshTokenInstance;
}

// 添加请求拦截器
$axios.interceptors.request.use(
  (config) => {
    if (apiWhiteList.includes(config.url as string)) {
      return config;
    }

    const userStore = useUserStore();
    if (!userStore.token) {
      message.error('请先登录');
      router.replace('/login');
      return config;
    }

    (config.headers as RawAxiosRequestHeaders).authorization = userStore.token;

    return config;
  },
  (error) => {
    // eslint-disable-next-line
    if (isEnvDevelopment) console.error('request', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
$axios.interceptors.response.use(
  (response: AxiosResponse<EndResponseData<unknown>>) => {
    // 2xx 范围内的状态码
    if (response.data.code !== 0 && response.data.message) {
      message.error(response.data.message);
    }
    return response;
  },
  (error: AxiosError<EndResponseData<unknown>>) => {
    // 超出 2xx 范围的状态码
    // eslint-disable-next-line
    if (isEnvDevelopment) console.error('response', error);
    if (error.config?.url === '/rest/refresh_token') {
      // 刷新token失败
      // 释放等待队列
      waitTokenRefreshQueues = [];
      return Promise.reject(error);
    }
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      // token过期，刷新token
      // 存在则不进入队列，防止多次点击
      const errorConfig = error.config as AxiosRequestConfig;
      const foundItem = waitTokenRefreshQueues.find(
        (config) => config.url === errorConfig.url
      );
      if (!foundItem) waitTokenRefreshQueues.push(errorConfig);
      return handleRefreshToken();
    }
    message.error(
      error.response?.data.message ||
        error.message ||
        '请求服务器响应失败，请稍后重试'
    );
    return Promise.reject(error);
  }
);

/**
 * 取消请求使用方式，示例：
 */

// const controller = new AbortController();

// axios.get('/foo/bar', {
//    signal: controller.signal
// }).then(function(response) {
//    //...
// });
// // 取消请求
// controller.abort()
