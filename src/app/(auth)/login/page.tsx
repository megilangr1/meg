import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center md:justify-between">
      <div className="hidden md:flex md:w-84 lg:w-md xl:w-xl 2xl:w-4xl min-h-screen relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-40"
          style={{
            backgroundImage: 'url("/image/login-banner.jpg")',
          }}
        ></div>

        <div className="relative z-10 flex flex-col justify-end p-8 text-white">
          <h1 className="text-3xl font-bold">Welcome back.</h1>

          <p className="mt-2 text-white/80">
            Manage your projects and keep everything organized.
          </p>
        </div>
      </div>

      <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-muted p-6">
        <div className="relative size-40 xl:size-60">
          <Image
            src="/brand/logo-icon-clear.png"
            alt="MeGGi dev"
            fill
            sizes="auto"
            className="object-cover dark:invert"
          />
        </div>

        <Link href={"/dashboard"}>To Dashboard</Link>
      </div>
    </main>
  );
}
