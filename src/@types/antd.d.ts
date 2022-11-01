interface LocaleLanguageInterface {
  [key: string]: string;
}

declare module 'ant-design-vue/lib/locale-provider/zh_CN' {
  const ZH_CN: LocaleLanguageInterface;

  export default ZH_CN;
}


declare module 'ant-design-vue/lib/locale-provider/de_DE' {
  const DE_DE: LocaleLanguageInterface;

  export default DE_DE;
}
