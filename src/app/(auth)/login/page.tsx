import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <p>Login Page</p>
      <Link href={"/dashboard"}>To Dashboard</Link>
    </div>
  );
}
