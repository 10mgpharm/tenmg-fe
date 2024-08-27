export interface EmailConfig {
    host: string | undefined;
    port: number | undefined;
    user: string | undefined;
    pass: string | undefined;
    from: string | undefined;
}

export interface IConfig {
    appEnv: 'dev' | 'staging' | 'prod' | 'sandbox';
    nodeEnv: 'dev' | 'prod' | 'test';
    email: EmailConfig;
}