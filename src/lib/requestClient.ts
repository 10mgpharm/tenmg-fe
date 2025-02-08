import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import config from './config';

const apiBaseUrl = `${config.apiBaseUrl}/api/v1`;

interface RequestOptions extends AxiosRequestConfig {
  token?: string;
}

const getHeaders = (queryParamToken?: string, contentType?: string) => {
  const auth = Cookies.get('auth') ? JSON.parse(Cookies.get('auth') as string) : {};
  const { token, user } = auth;
  const headers: Record<string, string> = {};

  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  // headers['Content-Type'] = 'application/json';

  if (token || queryParamToken) {
    const authToken = queryParamToken ? queryParamToken : token;
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (user) {
    headers['User'] = `${user.firstName} ${user.lastName}`;
  }

  return headers;
};

const requestClient = (options: RequestOptions = {}) => {
  const headers = getHeaders(options?.token, options?.headers?.['Content-Type']);
  const opts: RequestOptions = Object.assign({}, options, { headers });

  const axiosInstance = axios.create({
    baseURL: `${apiBaseUrl}`,
    timeout: 120000,
    ...opts,
  });

  return axiosInstance;
};

export default requestClient;
