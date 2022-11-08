interface LocaleLanguageInterface {
  [key: string]: string;
}

type LocalesTuple = ['enGB', 'zhCN', 'deDE'];

type LocalesUnion = LocalesTuple[number];

declare module 'ant-design-vue/lib/locale-provider/en_GB' {
  const enGB: LocaleLanguageInterface;

  export default enGB;
}

declare module 'ant-design-vue/lib/locale-provider/zh_CN' {
  const zhCN: LocaleLanguageInterface;

  export default zhCN;
}

declare module 'ant-design-vue/lib/locale-provider/de_DE' {
  const deDE: LocaleLanguageInterface;

  export default deDE;
}
