import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <p>Hello World</p>
      <Link href={"/login"}>To Login</Link>
    </div>
  );
}
