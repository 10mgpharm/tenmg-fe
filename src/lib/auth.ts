import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import requestClient from "./requestClient";
import config from "./config";
import { ResponseDto, User } from "@/types";

export const authOptions: NextAuthOptions = {
  secret: config.nextAuthSecret,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1hour,
  },
  jwt: {
    maxAge: 60 * 60, // 1hour,
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          const response = await requestClient().post("/auth/signin", {
            email,
            password,
          });
          const { data, accessToken }: ResponseDto<User> = response.data;

          return {
            id: data.id,
            name: data.name,
            email: data.email,
            active: data.active,
            image: data?.avatar,
            emailVerifiedAt: data.emailVerifiedAt,
            token: accessToken.token,
            entityType: data.entityType,
            role: data.role,
            businessName: data.businessName,
            businessStatus: data.businessStatus,
            owner: data.owner,
            completeProfile: data.completeProfile,
            picture: data?.avatar,
          };
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error("An unknown error occurred");
          }
          const errorMessage =  error.response?.data?.message ?? "Authentication failed. Please try again.";

          throw new Error(errorMessage);
        }
      },
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
        if (!params.user?.email) return false;
        return true;
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
        } else {
          console.error(
            "Error checking if user exists",
            error
          );
        }
        return false;
      }
    },
    async jwt(params: any) {
      if (params?.trigger === "signIn") { 
        if (params.account?.provider === "google") {
          // check if user already exist and exchange token
          const response = await requestClient({
            token: params.account?.access_token,
          }).post(`/auth/google`, {
            email: params.profile.email,
            provider: params.account?.provider,
          });

          const { data: existingUser, accessToken }: ResponseDto<User> = response.data;

          params.user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            active: existingUser.active,
            image: existingUser?.avatar,
            emailVerifiedAt: existingUser.emailVerifiedAt,
            token: accessToken.token,
            entityType: existingUser.entityType,
            role: existingUser.role,
            businessName: existingUser.businessName,
            businessStatus: existingUser.businessStatus,
            owner: existingUser.owner,
            completeProfile: existingUser.completeProfile,
          };
        }
      }
      if (params.user) {
        params.token.id = params.user.id;
        params.token.name = params.user.name;
        params.token.email = params.user.email;
        params.token.active = params.user?.active;
        params.token.emailVerifiedAt = params.user?.emailVerifiedAt;

        params.token.entityType = params.user?.entityType;
        params.token.role = params.user?.role;
        params.token.businessName = params.user?.businessName;
        params.token.businessStatus = params.user?.businessStatus;

        params.token.owner = params.user?.owner;
        params.token.completeProfile = params.user?.completeProfile;

        params.token.token = params.user?.token;
        params.token.account = {
          providerAccountId: params.account?.providerAccountId,
          type: params.account?.type,
          provider: params.account?.provider,
        };
      }

      if (params?.trigger === "update") {
        params.token.completeProfile = params?.session.user?.completeProfile;
        params.token.emailVerifiedAt = params?.session.user?.emailVerifiedAt;
        params.token.name = params?.session.user?.name;
        params.token.email = params?.session.user?.email;
        params.token.businessStatus = params?.session.user?.businessStatus;
        params.token.businessName = params?.session.user?.businessName;
        params.token.picture = params?.session.user?.picture;
        params.token.entityType = params?.session.user?.entityType;
        params.token.role = params?.session.user?.role;
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
    newUser: `/auth/business-information`,
  },
};
