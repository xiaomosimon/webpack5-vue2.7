/**
 * fix: Error: 🍍: Store "counter" is built using the setup syntax and does not implement $reset().
 */

import cloneDeep from 'lodash.clonedeep';
import { PiniaPluginContext } from 'pinia';

export default ({ store }: PiniaPluginContext) => {
  const initialState = cloneDeep(store.$state);
  store.$reset = () => store.$patch(cloneDeep(initialState));
};
