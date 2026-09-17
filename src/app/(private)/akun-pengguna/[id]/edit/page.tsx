import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { USER_ROLE } from "@/modules/user/user.schema";
import { UserForm } from "../../_components/user-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let user = null;
  try {
    user = await auth.api.getUser({ query: { id }, headers: await headers() });
  } catch {
    notFound();
  }

  if (!user || user.role !== USER_ROLE) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold">Edit Pengguna</h1>
        <p className="text-sm text-muted-foreground">
          Perbarui nama, email, atau password {user.name}.
        </p>
      </div>
      <Card className="gap-0">
        <CardHeader className="border-b">
          <CardTitle>Formulir Pengguna</CardTitle>
          <CardDescription>Perubahan tersimpan setelah tombol ditekan</CardDescription>

          <CardAction className="flex flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/akun-pengguna" />}
              nativeButton={false}
            >
              <List />
              <span className="hidden sm:block">List Pengguna</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <UserForm
            mode="edit"
            userId={user.id}
            defaultValues={{ name: user.name, email: user.email }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
