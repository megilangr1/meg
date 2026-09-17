import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import prisma from "./prisma";

export const auth = betterAuth({
  // Better Auth Database Config / Target
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),

  // Better Auth Method Activated
  emailAndPassword: {
    enabled: true,
  },

  // Activated Plugins (`nextCookies` wajib terakhir — docs `/docs/integrations/next`)
  plugins: [
    admin(), // Activate 'Admin' for Better Auth
    nextCookies(), // NextJS 16 Important Plugins
  ],
});
