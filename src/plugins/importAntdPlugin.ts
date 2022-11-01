/**
 * 引入antd组件
 */

import { FormModel, Input, Button, Icon, Checkbox, Layout, Menu, Breadcrumb, Radio, Modal, Card, Space } from 'ant-design-vue';
import { PluginObject } from 'vue';

const importAntdPlugin: PluginObject<null> = {
  install(Vue) {
    Vue.use(FormModel);
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Icon);
    Vue.use(Checkbox);
    Vue.use(Layout);
    Vue.use(Menu);
    Vue.use(Breadcrumb);
    Vue.use(Radio);
    Vue.use(Modal);
    Vue.use(Card);
    Vue.use(Space);
  },
};
export default importAntdPlugin;
