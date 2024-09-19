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
    maxAge: 60 * 60 * 24, // 1hour,
  },
  jwt: {
    maxAge: 60 * 60 * 24, // 1hour,
  },
  providers: [
    CredentialsProvider({
      id: "signup",
      name: "Sign Up",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        passwordConfirmation: {
          label: "Password Confirmation",
          type: "password",
        },
        businessType: {
          label: "Business Type",
          type: "text",
        },
        termsAndConditions: {
          label: "Terms and Conditions",
          type: "boolean",
        },
      },
      async authorize(credentials) {
        try {
          const {
            name,
            email,
            password,
            passwordConfirmation,
            businessType,
            termsAndConditions,
          } = credentials;
          const response = await requestClient().post("/auth/signup", {
            name,
            email,
            password,
            passwordConfirmation,
            businessType,
            termsAndConditions,
          });
          const { data, accessToken }: ResponseDto<User> = response.data;

          return {
            id: data.id,
            name: data.name,
            email: data.email,
            active: data.active,
            image: null,
            emailVerifiedAt: data.emailVerifiedAt,
            token: accessToken.token,
            entityType: data.entityType,
            businessName: data.businessName,
            businessStatus: data.businessStatus,
            owner: data.owner,
            completeProfile: data.completeProfile,
          };
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error("An unknown error occurred during sign up");
          }
          return null;
        }
      },
    }),
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
            image: null,
            emailVerifiedAt: data.emailVerifiedAt,
            token: accessToken.token,
            entityType: data.entityType,
            businessName: data.businessName,
            businessStatus: data.businessStatus,
            owner: data.owner,
            completeProfile: data.completeProfile,
          };
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error("An unknown error occurred");
          }
          return null;
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

        if (
          params.account?.type === "oauth" &&
          params.account?.provider === "google"
        ) {
          const { email, email_verified } = params.profile;
          if (!email_verified) return false;

          // check if user already exist
          const response = await requestClient().get(
            `/auth/email?email=${email}`
          );
          const { data: existingUser }: ResponseDto<User> = response.data;

          if (!existingUser) {
            params.user.isNewUser = true;
            (params.user.token = params.account?.access_token),
              (params.user.account = {
                providerAccountId: params.account?.providerAccountId,
                type: params.account?.type,
                provider: params.account?.provider,
              });
          }

          return true;
        }

        params.user.isNewUser = false;
        params.user.account = {
          providerAccountId: params.account?.providerAccountId,
          type: params.account?.type,
          provider: params.account?.provider,
        };

        return true;
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(
            "Error checking if user exists or has an invite",
            error
          );
        }
        return false;
      }
    },
    async jwt(params: any) {
      if (params.user) {
        params.token.id = params.user.id;
        params.token.email = params.user.email;
        params.token.active = params.user?.active;
        params.token.emailVerifiedAt = params.user?.emailVerifiedAt;

        params.token.entityType = params.user?.entityType;
        params.token.businessName = params.user?.businessName;
        params.token.businessStatus = params.user?.businessStatus;

        params.token.owner = params.user?.owner;
        params.token.completeProfile = params.user?.completeProfile;

        params.token.token = params.user?.token;
        params.token.account = params.user?.account;
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
