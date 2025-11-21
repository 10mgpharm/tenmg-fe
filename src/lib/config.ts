import { IConfig } from "@/types";

const config: IConfig = {
    appEnv: process.env.NEXT_PUBLIC_APP_ENV as 'dev' | 'staging' | 'prod' | 'sandbox',
    nodeEnv: process.env.NODE_ENV as 'dev' | 'prod' | 'test',
    appName: process.env.NEXT_PUBLIC_APP_NAME ?? '10MG Health',
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? '',
    apiBaseUrl: 'https://staging-api.10mg.ai',
    apiDocUrl: process.env.NEXT_PUBLIC_API_DOC_URL ?? '',

    nextAuthSecret: process.env.NEXTAUTH_SECRET ?? '',

    fincraPublicKey: process.env.NEXT_PUBLIC_FINCRA_PUBKEY ?? '',
    fincraSdkUrl: process.env.NEXT_PUBLIC_FINCRA_SDK_URL ?? '',

    tenmg: {
        url: process.env.NEXT_PUBLIC_TENMG_URL ?? '',
        pkey: process.env.NEXT_PUBLIC_TENMG_PUBKEY ?? '',
        skey: process.env.TENMG_SECKEY ?? ''
    },

    tenmgDemo: {
        url: process.env.NEXT_PUBLIC_TENMG_URL_DEMO ?? '',
        pkey: process.env.NEXT_PUBLIC_TENMG_PUBKEY_DEMO ?? '',
        skey: process.env.TENMG_SECKEY_DEMO ?? ''
    },

    email: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT as string, 10),
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
        from: process.env.EMAIL_FROM,
    },
}

export default config;