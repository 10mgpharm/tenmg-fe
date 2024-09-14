import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import requestClient from './requestClient';
import config from './config';
import { ResponseDto, User } from '@/types';

export const authOptions: NextAuthOptions = {
  secret: config.nextAuthSecret,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 1hour,
  },
  jwt: {
    maxAge: 60 * 60 * 24, // 1hour,
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials;
          const response = await requestClient().post('/auth/signin', { email, password });
          const { data, accessToken }: ResponseDto<User> = response.data;

          return {
            id: data.id,
            name: data.name,
            email: data.email,
            image: null,
            emailVerifiedAt: data.emailVerifiedAt,
            token: accessToken.token,
            entityType: data.entityType,
          };
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error('An unknown error occurred');
          }
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    signIn: async (params: any) => {
      try {
        if (!params.user?.email) {
          return false;
        }

        if (!params.user?.emailVerifiedAt) {
          console.log('redirecting....');
          return `/auth/verification?token=${params.user?.token}`;
        }

        return true;

      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('Error checking if user exists or has an invite', error);
        }
        return false;
      }
    },
    async jwt(params: any) {
      if (params.user) {
        params.token.id = params.user.id;
        params.token.email = params.user.email;
        params.token.entityType = params.user?.entityType;
        params.token.emailVerifiedAt = params.user?.emailVerifiedAt;
        params.token.token = params.user?.token;
      }
      return params.token;
    },
    async session(params: any) {
      params.session.user = { ...params.token };
      return params.session;
    },
  },
  pages: {
    signIn: `/auth/signin`,
    error: `/auth/signin`,
    verifyRequest: `/auth/verify-request`,
    signOut: `/auth/logout`,
  },
};
