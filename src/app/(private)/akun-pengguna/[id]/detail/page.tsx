import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Ban, Edit, List } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { USER_ROLE } from "@/modules/user/user.schema";
import { UserActions } from "../../_components/user-actions";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Meta({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-lg bg-muted/40 p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="truncate text-sm font-medium">{children}</span>
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const heads = await headers();

  const [session, user] = await Promise.all([
    auth.api.getSession({ headers: heads }),
    auth.api.getUser({ query: { id }, headers: heads }).catch(() => null),
  ]);

  if (!user || user.role !== USER_ROLE) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold">Profil Pengguna</h1>
        <p className="text-sm text-muted-foreground">
          Informasi akun {user.name}.
        </p>
      </div>

      <Card className="gap-0 overflow-hidden py-0">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-muted to-muted sm:h-28" />
        <CardContent className="flex flex-col gap-5 p-4 sm:p-6">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Avatar
                size="lg"
                className="size-16 shrink-0 ring-4 ring-background sm:size-20"
              >
                <AvatarFallback className="text-lg">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="truncate text-lg font-semibold">{user.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {user.banned ? (
                    <Badge variant="destructive">Diblokir</Badge>
                  ) : (
                    <Badge variant="secondary">Aktif</Badge>
                  )}
                  {user.emailVerified && (
                    <Badge variant="outline">Terverifikasi</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/akun-pengguna" />}
                nativeButton={false}
              >
                <List />
                <span className="hidden sm:block">List</span>
              </Button>
              <Button
                size="sm"
                render={<Link href={`/akun-pengguna/${user.id}/edit`} />}
                nativeButton={false}
              >
                <Edit />
                <span className="hidden sm:block">Edit</span>
              </Button>
              <UserActions
                userId={user.id}
                userName={user.name}
                banned={user.banned ?? false}
                locked={user.id === session?.user.id}
              />
            </div>
          </div>

          {user.banned && user.banReason && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <Ban className="mt-0.5 size-4 shrink-0 text-destructive" />
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-destructive">
                  Alasan blokir
                </span>
                <span className="text-muted-foreground">{user.banReason}</span>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Meta label="Email">{user.email}</Meta>
            <Meta label="Verifikasi email">
              {user.emailVerified ? "Terverifikasi" : "—"}
            </Meta>
            <Meta label="Bergabung">
              {new Date(user.createdAt).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Meta>
            <Meta label="Terakhir diubah">
              {new Date(user.updatedAt).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Meta>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
