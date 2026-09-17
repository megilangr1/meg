"use client";

import { useRouter } from "next/navigation";
import { Edit, Eye, Users, X } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  USER_DEFAULT_LIMIT,
  USER_DEFAULT_SORT,
  USER_SORT_OPTIONS,
  type UserSortKey,
} from "@/modules/user/user.schema";
import { UserActions } from "./user-actions";
import { UserFilterDialog } from "./user-filter-dialog";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  createdAt: string;
};

type UserTableProps = {
  users: UserRow[];
  total: number;
  page: number;
  limit: number;
  q: string;
  searchField: "email" | "name";
  sort: UserSortKey;
  currentUserId: string;
};

function pushParams(
  router: ReturnType<typeof useRouter>,
  patch: Record<string, string | null | undefined>,
) {
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(patch)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  router.push(`/akun-pengguna?${params.toString()}`);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const ACTION_HIT =
  "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export function UserTable({
  users,
  total,
  page,
  limit,
  q,
  searchField,
  sort,
  currentUserId,
}: UserTableProps) {
  const router = useRouter();
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const sortLabel =
    USER_SORT_OPTIONS.find((option) => option.value === sort)?.label ?? sort;
  const activeCount =
    (q ? 1 : 0) +
    (sort !== USER_DEFAULT_SORT ? 1 : 0) +
    (limit !== USER_DEFAULT_LIMIT ? 1 : 0);

  function resetAll() {
    pushParams(router, {
      q: null,
      searchField: null,
      limit: null,
      sort: null,
      page: "1",
    });
  }

  const pageNumbers = ((): (number | "ellipsis")[] => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "ellipsis", totalPages];
    if (page >= totalPages - 2)
      return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages];
  })();

  function goTo(newPage: number) {
    pushParams(router, { page: String(Math.min(Math.max(1, newPage), totalPages)) });
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 border-b bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {activeCount === 0 ? (
            <p className="text-xs text-muted-foreground">
              Semua data · {total} pengguna
            </p>
          ) : (
            <>
              {q && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  &ldquo;{q}&rdquo; · {searchField === "name" ? "Nama" : "Email"}
                  <button
                    type="button"
                    aria-label="Hapus filter pencarian"
                    onClick={() =>
                      pushParams(router, { q: null, searchField: null, page: "1" })
                    }
                    className="inline-flex size-5 items-center justify-center rounded-full hover:bg-muted-foreground/20"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              {sort !== USER_DEFAULT_SORT && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  {sortLabel}
                  <button
                    type="button"
                    aria-label="Hapus filter urutan"
                    onClick={() => pushParams(router, { sort: null, page: "1" })}
                    className="inline-flex size-5 items-center justify-center rounded-full hover:bg-muted-foreground/20"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              {limit !== USER_DEFAULT_LIMIT && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  {limit} / hal
                  <button
                    type="button"
                    aria-label="Hapus filter jumlah"
                    onClick={() => pushParams(router, { limit: null, page: "1" })}
                    className="inline-flex size-5 items-center justify-center rounded-full hover:bg-muted-foreground/20"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={resetAll}>
              Reset
            </Button>
          )}
          <UserFilterDialog
            q={q}
            searchField={searchField}
            limit={limit}
            sort={sort}
            activeCount={activeCount}
            onApply={(patch) => pushParams(router, patch)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Pengguna</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Dibuat</TableHead>
            <TableHead className="w-32 text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className="px-4 py-12 text-center">
                <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-muted">
                    <Users className="size-5 text-muted-foreground" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">
                      {activeCount > 0 ? "Tidak ada hasil" : "Belum ada pengguna"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activeCount > 0
                        ? "Coba ubah atau reset filter."
                        : "Tambah akun role user pertama."}
                    </p>
                  </div>
                  {activeCount > 0 ? (
                    <Button variant="outline" size="sm" onClick={resetAll}>
                      Reset filter
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link href="/akun-pengguna/create" />}
                      nativeButton={false}
                    >
                      Tambah pengguna
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar size="sm" className="shrink-0">
                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell className="hidden text-muted-foreground lg:table-cell">
                {user.createdAt}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Tooltip>
                    <TooltipTrigger
                      render={<Link href={`/akun-pengguna/${user.id}/detail`} />}
                      className={ACTION_HIT}
                    >
                      <Eye className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent>Detail Data</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={<Link href={`/akun-pengguna/${user.id}/edit`} />}
                      className={ACTION_HIT}
                    >
                      <Edit className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent>Edit Data</TooltipContent>
                  </Tooltip>
                  <UserActions
                    userId={user.id}
                    userName={user.name}
                    banned={user.banned ?? false}
                    locked={user.id === currentUserId}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Menampilkan {start}–{end} dari {total} pengguna
        </p>
        <Pagination className="mx-0 w-auto sm:mx-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text="Sblm"
                onClick={(e) => {
                  e.preventDefault();
                  goTo(page - 1);
                }}
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {pageNumbers.map((item, index) => (
              <PaginationItem key={`${item}-${index}`}>
                {item === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={item === page}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(item);
                    }}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                text="Lanjut"
                onClick={(e) => {
                  e.preventDefault();
                  goTo(page + 1);
                }}
                aria-disabled={page >= totalPages}
                className={
                  page >= totalPages ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
