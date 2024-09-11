import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import requestClient from './requestClient';

export const authOptions: NextAuthOptions = {
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
      async authorize(credentials, req) {
        try {
          const { email, password } = credentials;
          const response = await requestClient().post('/signin', { email, password });

          console.log({ response })

          return {
            id: 'string',
            name: 'string | null',
            email: 'string | null',
            image: 'string | null',
          }
        } catch (error) {
          console.error(error);
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
    session: async ({ session, token }: any) => {
      if (token) {
        session.user = { ...session.user, ...token.user };
        session.account = token.account;
      }

      return session;
    },
    signIn: async (params) => {
      if (!params.user?.email) {
        return false;
      }
      console.log('signIN ', { params })
      // TODO: implement get by email and confirm if user proceed to login
      // try {
      //   const response = await requestClient().get('/user/email', { email });
      //   const userInfo = await response.data;
      //   return !(condition-here);
      // } catch (error) {
      //   console.error('Error checking if user exists or has an invite', error);
      //   return false;
      // }
    },
  },
  pages: {
    signIn: `/auth/signin`,
    error: `/auth/signin`,
    verifyRequest: `/auth/verify-request`,
    signOut: `/auth/logout`,
  },
};
