# Webpack5 + Vue2.7 + TypeScript + Eslint 项目包



## 基本介绍



### 命令行参数

**基本操作**
```sh
-x 3 -n5 -ab --stats --beep=bool --name xxx foo bar -- local
# 等价于 { _: [ 'foo', 'bar', 'local' ], x: 3, n: 5, a: true, b: true, stats: true, beep: 'bool', name: 'xxx' }
```

**自动化部署配置尽量使用明确参数形式，如下**
```sh
# `-- env` 固定在末尾
# pnpm build value1 value2 -- env  等价于  {_:['value1', 'value2', 'env']}
pnpm build a b -- prod
```

**开发配置禁用明确参数形式，但可使用如下方式**
```sh
# --variable  等价于  {_:[], variable: true}
--a
# --variable=value  等价于  {_:[], variable: 'value'}
--b=1
# -variable value  等价于  {_:[], variable: '1'}
-c 1
# -variable  等价于  {_:[], variable: true}
-d
```



#### 可配置命令行参数

```sh
# 生产
pnpm build --watch

pnpm build --report # 等价于 pnpm analyzer

# 开发
pnpm start --host xxx

pnpm start --port 8888

pnpm start --open
```



### 第三方配置文件

- babel
  - babel.config.js  配置babel代码转化相关


- eslint
  - .eslintrc.js  配置Eslint代码校验
    - globals {Object}  配置全局变量
    - rules  配置规则
    - overrides  {Array} 配置单独文件或文件组的规则
      - files  {Array} 文件或文件组
      - rules  {Object} 规则
  - .eslintignore  配置忽略检测的文件及目录


- postcss
  - postcss.config.js  配置postcss规则


- TypeScript
  - tsconfig.json  配置TypeScript规则



### webpack配置文件

- config文件夹  webpack配置相关
- scripts文件夹  scripts指令对应配置文件
  - build.js  build指令，用于构建生产包，代码分析等
  - start.js  start指令，用于启用开发模式



### 代码提交

- README.commit.md  commit参考文件


- .husky文件夹
  - pre-commit 添加commit前指令

- package.jon 添加lint-staged配置，对commit前修改了的代码校验配置
  ```json
  {
    "lint-staged": {
      // 文件类型
      "*.{vue,js,ts,jsx,tsx}": [
        "pnpm lint"  // 指令
      ]
    }
  }
  ```



### Eslint规则

- vue官方[https://v2.cn.vuejs.org/v2/style-guide/]


- airbnb官方[https://github.com/airbnb/javascript]



## 配置难点参考

经过几天的阅读webpack5文章和文档，vue2.7发布到现在版本的修订，自己开始配置这个Webpack5 + Vue2.7 + TypeScript + Eslint的项目。
实现后成就感不错，实践中遇见问题抠键盘+抠脑壳，谷歌，stackoverflow，百度解决方案，然后尝试解决问题，最后fix，确实不容易呀~
废话不多说了，以下是项目配置中遇到的问题，供大家参考：



### 代码解析问题

#### vue2.7.x

相关修订链接：https://github.com/vuejs/vue/blob/main/CHANGELOG.md



##### vue文件的解析

依赖包使用`vue-loader@15.10.0`，因为现在2.7.13已经支持compositionAPI，不需要根据尤大大之前发布的博客说依赖下载`vue-demi`了。

###### webpack.config.js配置
```javascript
const { VueLoaderPlugin } = require('vue-loader');
module.exports = {
  rules: [
    {
      test: /\.vue$/,
      use: [
        {
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              preserveWhitespace: false, // 放弃标签间的空格
            },
          },
        },
      ],
    }
  ],
  plugins: [
    // vue文件解析
    new VueLoaderPlugin(),
  ]
}
```

vue-loader其实对vue文件进行了type分析，像template，script，style，像添加lang了进行了标记，最后生成对应的文件类型代码内容交给其他loader处理。



##### Style解析

这里不赘述什么css,sass/scss,MiniCssExtractPlugin这些简单的配置，这些都可以从vue-loader文档中获取，相关链接：https://vue-loader.vuejs.org/guide/pre-processors.html

这里get一下开发模式下按文档是使用`vue-style-loader`来替代`style-loader`。

**！！！不要完全相信文档，试了你就知道，不适用vue2.7！！！请继续使用`style-loader`，并下载最新版，不然你运行起来是白板！！！**

配置简单展示下：
###### webpack.config.js配置
```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  rules: [
    {
      test: /\.css$/,
      use: [
        // 开发和生产区分开，开发用style-loader内嵌样式，生产生成css文件
        isEnvProduction 
          ? {
              loader: MiniCssExtractPlugin.loader,
            }
          : {
              loader: 'style-loader',
            },
        {
          loader: 'css-loader',
          options: {
            sourceMap: isEnvProduction && shouldUseSourceMap,
            importLoaders: 2,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: isEnvProduction && shouldUseSourceMap,
          },
        },
      ],
    },
  ],
  isEnvProduction &&
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
    }),
}
```



##### JSX/TSX 😈，蓝瘦，🍄

经历过很多的尝试，想着会有概率使用jsx方式去写组件，那么概率会去引入vue文件下，script就会被加上`<script lang="ts" setup>`，记住这个原则！！！

因为没有记住这个原则，一直无法好好解析jsx/tsx，我试图这样写`<script lang="tsx" setup>`，我🍄，居然成功过一次展示后控制台还是会报错，**无法找到`h`**，别问我为什么，因为正常的渲染函数，是要使用`h`，即`createElement`去创建的，jsx/tsx解析转化js/ts不成功，就只有酸Q了，一直报错，浏览器白板人生！！！

回顾原则，我们记住vue文件解析script存在lang="ts"生成ts标识，交给`ts-loader`编译，检测到**jsx**就要让`babel-loader`去处理，检测**tsx**就要用`ts-loader`先处理，再用`babel-loader`处理，所以`babel-loader`就很重要了，那么babel相关的预处理器和插件也就很重要了。

###### 基本的babel依赖就不赘述了，罗列几个重要的，只要这样处理就莫问题：
1. 针对ts/tsx，要使用`@babel/preset-typescript`；
2. 针对jsx，要使用`@vue/babel-preset-jsx`和`@vue/babel-helper-vue-jsx-merge-props`，这个是用于vue2的，且支持compositionAPI的，下方为提供详细配置；
3. 针对jsx/tsx要使用`ts-loader`配置appendTsxSuffixTo和appendTsSuffixTo，不然也解析不了，不这样做，浏览器白板伺候。

###### babel.config.js配置
```javascript
module.exports = {
  presets: [
    [
      '@vue/babel-preset-jsx',
      {
        compositionAPI: true, // 支持compositionAPI，只有这样jsx才能在vue里使用
      },
    ], // 和@vue/babel-helper-vue-jsx-merge-props支持vue的jsx
    '@babel/preset-typescript',
  ]
};
```
###### webpack.config.js配置
```javascript
module.exports = {
  rules: [
    /* 处理js */
    {
      test: /\.m?jsx?$/,
      // 确保 JS 的转译应用到 node_modules 的 Vue 单文件组件
      exclude: (file) =>
        /node_modules/.test(file) && !/\.vue\.js/.test(file),
      use: [
        {
          loader: 'babel-loader',
          options: {
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            // set it to false -- your project may benefit from this if it transpiles thousands of files.
            cacheCompression: false,
          },
        },
      ].filter(Boolean),
    },
    /* 处理ts */
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            // 设置为“仅编译”，关闭类型检查
            transpileOnly: true,
            happyPackMode: isEnvProduction, // 配合fork-ts-checker-webpack-plugin使用做多线程
            appendTsSuffixTo: ['\\.vue$'], // ts
          },
        },
      ].filter(Boolean),
    },
    /* 处理tsx */
    {
      test: /\.tsx$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            // set it to false -- your project may benefit from this if it transpiles thousands of files.
            cacheCompression: false,
          },
        },
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            happyPackMode: isEnvProduction, // 配合fork-ts-checker-webpack-plugin使用做多线程
            appendTsxSuffixTo: ['\\.vue$'], // tsx
          },
        },
      ].filter(Boolean),
    },
  ]
}
```



#### vue-router 3.6.5

支持使用`import { useRoute, useRouter } from 'vue-router/composables'`等hooks，兼容 Vue2.7 CompositionAPI写法。

更多参考链接：https://github.com/vuejs/vue-router/blob/dev/CHANGELOG.md



#### vue-i18n 8.28.2

需要下载`vue-i18n-composable`包来兼容 Vue2.7 CompositionAPI写法。

```javascript
import { useI18n } from 'vue-i18n-composable';

const i18n = useI18n();

i18n.locale.value = 'en';
```

更多参考链接：https://github.com/intlify/vue-i18n-composable



#### pinia

##### pinia应用问题

###### 报错
```sh
fix: Error: 🍍: Store "counter" is built using the setup syntax and does not implement $reset().
```

###### 原因和解决
```typescript
// fixPiniaResetPlugin.ts
import cloneDeep from 'lodash.clonedeep'; // 可自行选择deep clone方式
import { PiniaPluginContext } from 'pinia';

export default ({ store }: PiniaPluginContext) => {
  const initialState = cloneDeep(store.$state);
  store.$reset = () => store.$patch(cloneDeep(initialState));
};


// main.ts
import { PiniaVuePlugin, createPinia } from 'pinia';
import fixPiniaResetPlugin from './plugins/fixPiniaResetPlugin';

const pinia = createPinia();
pinia.use(fixPiniaResetPlugin);
Vue.use(PiniaVuePlugin); // 解决pinia $reset问题

new Vue({
  render: (h) => h(App),
  pinia,
}).$mount('#app');
```



#### ant design vue 1.7.8

##### 按需引入方式

需要下载babel-plugin-import包来作用按需引入。

```javascript
// babel.config.js
module.exports = {
  plugins: [
    [
      'import', // babel-plugin-import antd 按需引入
      {
        libraryName: 'ant-design-vue',
        libraryDirectory: 'es',
        style: 'css',
      },
    ],
  ],
}
```

```typescript
// importAntdPlugin.ts
/**
 * 引入antd组件
 */
import { FormModel, Input, Button } from 'ant-design-vue';
import { PluginObject } from 'vue';

const importAntdPlugin: PluginObject<null> = {
  install(Vue) {
    Vue.use(FormModel);
    Vue.use(Input);
    Vue.use(Button);
  },
};
export default importAntdPlugin;


// main.ts
import importAntdPlugin from './plugins/importAntdPlugin';
import 'ant-design-vue/dist/antd.less';

Vue.use(importAntdPlugin); // ant导入组件
```

**如果报错less相关，那么请继续看less应用问题**



##### less应用问题

###### 报错

```sh
Syntax Error:

    position: absolute;
    top: 8px + @font-size-base * @line-height-base / 2 - @font-size-base / 2;
  ^
```

###### 原因和解决

less 在第 7 版本改变了原有的除法运算，所以无法识别。

下载 less-loader 的6.x.x版本，建议下载6的最后个版本；

参考原文链接：https://blog.csdn.net/Coder_xiaoxu/article/details/119082556



### 代码校验

no-undef lint 规则:

https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/linting/TROUBLESHOOTING.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors




#### 构建配置代码校验



#### 实际项目内代码校验



### 构建配置



#### 命令行传参



#### 打包配置



#### 开发配置



#### 打包后输出信息



### 代码提交



#### husky

已生成.husky/pre-commit文件，但需要初始化husky，所以需要执行以下指令：

```sh
npm pkg set scripts.prepare="husky install"
npm run prepare
npm pkg delete scripts.prepare
# 新增npm/pnpm/yarn指令
# npx husky add .husky/pre-commit 'npm newCommand'
```
