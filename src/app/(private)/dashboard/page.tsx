import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <p>Dashboard</p>

      <Link href={"/"}>To Public Page</Link>
    </div>
  );
}
