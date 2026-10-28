import type { Metadata } from "next";
import Image from "next/image";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import LoginForm from "./_components/login-form";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center md:justify-between">
      <div className="relative hidden min-h-screen w-84 overflow-hidden md:flex lg:w-md xl:w-xl 2xl:w-4xl">
        <Image
          src="/image/login-banner.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1536px) 56rem, (min-width: 1280px) 36rem, (min-width: 1024px) 28rem, 21rem"
          className="object-cover brightness-40"
        />

        <div className="relative z-10 flex flex-col justify-end p-8 text-white">
          <h1 className="text-3xl font-bold">Welcome back.</h1>

          <p className="mt-2 text-white/80">
            Manage your projects and keep everything organized.
          </p>
        </div>
      </div>

      <div className="relative flex min-h-screen flex-1 flex-col items-center justify-center bg-muted p-6">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="flex w-full flex-col items-center justify-center sm:w-xs md:w-sm xl:w-md">
          <div className="relative size-28 md:size-40 xl:size-52">
            <Image
              src="/brand/logo-icon-clear.png"
              alt="MeGGi dev"
              fill
              sizes="(min-width: 1280px) 13rem, (min-width: 768px) 10rem, 7rem"
              className="object-cover dark:invert"
            />
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
