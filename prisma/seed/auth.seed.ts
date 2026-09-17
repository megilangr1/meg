import { PrismaClient } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";

type UserPayload = {
  email: string;
  password: string;
  name: string;
  role: "admin" | "user";
};

const userData: UserPayload[] = [
  {
    email: "admin@main.com",
    password: "admin123",
    name: "MeGGi",
    role: "admin",
  },
  {
    email: "test@main.com",
    password: "test1234",
    name: "Test",
    role: "user",
  },
];

export async function seedUser(prisma: PrismaClient) {
  const check = await prisma.user.findMany();
  if (check.length > 0) return;

  for (const user of userData) {
    await auth.api.createUser({
      body: {
        ...user,
      },
    });
  }
  console.log("=== USER DATA SEEDED ===");

  return;
}
