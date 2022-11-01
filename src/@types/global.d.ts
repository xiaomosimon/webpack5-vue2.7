interface EnvConfig {
  NODE_ENV: string;
  RUN_ENV: string;
  mode?: string;
  sourcemap?: boolean;
  report?: boolean;
  open?: boolean;
  host?: string;
  port?: string;
  watch?: string;
}

declare const webpackDefineEnvConfig: EnvConfig;
