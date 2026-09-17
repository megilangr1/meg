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
import { UserForm } from "../_components/user-form";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold">Tambah Pengguna</h1>
        <p className="text-sm text-muted-foreground">
          Buat akun role user baru dengan email dan password.
        </p>
      </div>
      <Card className="gap-0">
        <CardHeader className="border-b">
          <CardTitle>Formulir Pengguna</CardTitle>
          <CardDescription>Lengkapi nama, email, dan password</CardDescription>

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
          <UserForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
