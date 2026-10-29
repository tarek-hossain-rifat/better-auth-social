import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { Resend } from "resend";
import type { User } from "better-auth";

const resend = new Resend(process.env.RESEND_API_KEY);

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL as string);
const db = client.db("rifat-db-test");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async (
      { user, url }: { user: User; url: string },
      request?: Request,
    ) => {
      const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset your password",
        html: `
        <h1>Reset your password</h1>
        <p>Click the link below to reset your password.</p>
        <a href="${url}">Reset Password</a>
      `,
      });
      if (error) {
        console.error("Resend password reset email error:", error);
      } else {
        console.log("Password reset email accepted by Resend:", data);
      }
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }, request) => {
      void resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your email address",
        html: `<h1>Verify your email address</h1>
        <br />
        Click <a href="${url}">here</a> to verify your email.
        `,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour in seconds
  },

  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET as string,
    },
    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET as string,
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
});
