## Webpack5 + Vue2.7 + TypeScript + Eslint 项目包

### 命令行参数

**基本操作**
```shell
-x 3 -n5 -ab --stats --beep=bool --name xxx foo bar -- local
# 等价于 { _: [ 'foo', 'bar', 'local' ], x: 3, n: 5, a: true, b: true, stats: true, beep: 'bool', name: 'xxx' }
```

**自动化部署配置尽量使用明确参数形式，如下**
```shell
# `-- env` 固定在末尾
# pnpm build value1 value2 -- env  等价于  {_:['value1', 'value2', 'env']}
pnpm build a b -- prod
```

**开发配置禁用明确参数形式，但可使用如下方式**
```shell
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
```shell
# 生产
pnpm build --watch

pnpm build --report # 等价于 pnpm analyzer

# 开发
pnpm start --host xxx

pnpm start --port 8888

pnpm start --open
```

### 第三方配置文件

- Babel
  - babel.config.js  配置babel代码转化相关


- Eslint
  - .eslintrc.js  配置Eslint代码校验
    - globals {Object}  配置全局变量
    - rules  配置规则
    - overrides  {Array} 配置单独文件或文件组的规则
      - files  {Array} 文件或文件组
      - rules  {Object} 规则
  - .eslintignore  配置忽略检测的文件及目录


- Postcss
  - postcss.config.js  配置postcss规则


- TypeScript
  - tsconfig.json  配置TypeScript规则


### webpack配置文件

- config文件夹  webpack配置相关
- scripts文件夹  scripts指令对应配置文件
  - build.js  build指令，用于构建生产包，代码分析等
  - start.js  start指令，用于启用开发模式