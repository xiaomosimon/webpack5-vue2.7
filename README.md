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