import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import config from './config';

const apiBaseUrl = `${config.apiBaseUrl}/api/v1`;

interface RequestOptions extends AxiosRequestConfig {
  token?: string;
  'Public-Key'?: string;
  'Secret-Key'?: string;
}

const getHeaders = (queryParamToken?: string, contentType?: string) => {
  const auth = Cookies.get('auth') ? JSON.parse(Cookies.get('auth') as string) : {};
  const { token, user } = auth;
  const headers: Record<string, string> = {};

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

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
  let headers = getHeaders(options?.token, options?.headers?.['Content-Type']);

  if (Object.keys(options).includes('Public-Key')) {
    headers['Public-Key'] = options['Public-Key'];  
  }

  if (Object.keys(options).includes('Public-Key')) {
    headers['Secret-Key'] = options['Secret-Key'];
  }

  const opts: RequestOptions = Object.assign({}, options, { headers });

  const axiosInstance = axios.create({
    baseURL: `${apiBaseUrl}`,
    timeout: 120000,
    ...opts,
  });

  return axiosInstance;
};

export default requestClient;
