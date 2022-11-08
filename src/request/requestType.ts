import { AxiosResponse } from 'axios';

export type FetchReturnPromise<T> = Promise<AxiosResponse<EndResponseData<T>>>;
