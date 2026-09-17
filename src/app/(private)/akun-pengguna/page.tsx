import { headers } from "next/headers";
import Link from "next/link";
import { Plus } from "lucide-react";
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
import {
  USER_DEFAULT_LIMIT,
  USER_DEFAULT_SORT,
  USER_LIMIT_OPTIONS,
  USER_ROLE,
  USER_SORT_MAP,
  type UserSortKey,
  userSearchFieldSchema,
} from "@/modules/user/user.schema";
import { UserTable } from "./_components/user-table";

type ListSearchParams = {
  q?: string;
  searchField?: string;
  page?: string;
  limit?: string;
  sort?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const params = await searchParams;
  const heads = await headers();

  const q = (params.q ?? "").trim();
  const searchField = userSearchFieldSchema.safeParse(params.searchField).success
    ? (params.searchField as "email" | "name")
    : "email";
  const parsedLimit = Number(params.limit);
  const limit = (
    USER_LIMIT_OPTIONS as readonly number[]
  ).includes(parsedLimit)
    ? parsedLimit
    : USER_DEFAULT_LIMIT;
  const parsedPage = Number(params.page);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const sort: UserSortKey =
    params.sort === "oldest" ||
    params.sort === "name-asc" ||
    params.sort === "name-desc"
      ? params.sort
      : USER_DEFAULT_SORT;
  const { sortBy, sortDirection } = USER_SORT_MAP[sort];

  const [session, result] = await Promise.all([
    auth.api.getSession({ headers: heads }),
    auth.api.listUsers({
      query: {
        searchValue: q || undefined,
        searchField,
        searchOperator: "contains",
        limit,
        offset: (page - 1) * limit,
        sortBy,
        sortDirection,
        filterField: "role",
        filterValue: USER_ROLE,
        filterOperator: "eq",
      },
      headers: heads,
    }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold">Akun Pengguna</h1>
        <p className="text-sm text-muted-foreground">
          Kelola akun role user — tambah, ubah, blokir, atau hapus.
        </p>
      </div>
      <Card className="gap-0">
        <CardHeader className="border-b">
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>
            {result.total} akun terdaftar
          </CardDescription>

          <CardAction className="flex flex-row gap-2">
            <Button
              size="sm"
              render={<Link href="/akun-pengguna/create" />}
              nativeButton={false}
            >
              <Plus />
              <span className="hidden sm:block">Tambah Pengguna</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <UserTable
            users={result.users.map((user) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              emailVerified: user.emailVerified,
              role: user.role,
              banned: user.banned,
              banReason: user.banReason,
              createdAt: new Date(user.createdAt).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            }))}
            total={result.total}
            page={page}
            limit={limit}
            q={q}
            searchField={searchField}
            sort={sort}
            currentUserId={session?.user.id ?? ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
