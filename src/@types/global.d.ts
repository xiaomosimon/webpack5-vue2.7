interface EnvConfig {
  sourcemap?: boolean;
  NODE_ENV: string;
  RUN_ENV: string;
  report?: boolean;
  open?: boolean;
  host?: string;
  port?: string;
  watch?: string;
}

declare const webpackDefineEnvConfig: EnvConfig;
