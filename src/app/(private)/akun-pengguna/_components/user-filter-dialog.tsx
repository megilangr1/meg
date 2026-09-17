"use client";

import { useState } from "react";
import { ListFilter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  USER_DEFAULT_LIMIT,
  USER_DEFAULT_SORT,
  USER_LIMIT_OPTIONS,
  USER_SORT_OPTIONS,
  type UserSearchField,
  type UserSortKey,
} from "@/modules/user/user.schema";

type UserFilterDialogProps = {
  q: string;
  searchField: UserSearchField;
  limit: number;
  sort: UserSortKey;
  activeCount: number;
  onApply: (patch: Record<string, string | null>) => void;
};

export function UserFilterDialog({
  q,
  searchField,
  limit,
  sort,
  activeCount,
  onApply,
}: UserFilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [draftQ, setDraftQ] = useState(q);
  const [draftField, setDraftField] = useState<UserSearchField>(searchField);
  const [draftLimit, setDraftLimit] = useState(String(limit));
  const [draftSort, setDraftSort] = useState<UserSortKey>(sort);

  function syncFromProps() {
    setDraftQ(q);
    setDraftField(searchField);
    setDraftLimit(String(limit));
    setDraftSort(sort);
  }

  function apply() {
    const trimmed = draftQ.trim();
    onApply({
      q: trimmed || null,
      searchField: trimmed ? draftField : null,
      limit: draftLimit === String(USER_DEFAULT_LIMIT) ? null : draftLimit,
      sort: draftSort === USER_DEFAULT_SORT ? null : draftSort,
      page: "1",
    });
    setOpen(false);
  }

  function reset() {
    onApply({ q: null, searchField: null, limit: null, sort: null, page: "1" });
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) syncFromProps();
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <ListFilter data-icon="inline-start" />
            Filter
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5">
                {activeCount}
              </Badge>
            )}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Pengguna</DialogTitle>
          <DialogDescription>
            Atur pencarian, urutan, dan jumlah data per halaman.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <Field>
            <FieldLabel htmlFor="user-filter-q">Pencarian</FieldLabel>
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="user-filter-q"
                value={draftQ}
                onChange={(e) => setDraftQ(e.target.value)}
                placeholder="Nama atau email…"
                className="pl-9"
              />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="user-filter-field">Cari berdasar</FieldLabel>
              <Select
                value={draftField}
                onValueChange={(value: UserSearchField | null) => {
                  if (value) setDraftField(value);
                }}
              >
                <SelectTrigger id="user-filter-field">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="name">Nama</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="user-filter-sort">Urutan</FieldLabel>
              <Select
                value={draftSort}
                onValueChange={(value: UserSortKey | null) => {
                  if (value) setDraftSort(value);
                }}
              >
                <SelectTrigger id="user-filter-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="user-filter-limit">Data per halaman</FieldLabel>
            <Select
              value={draftLimit}
              onValueChange={(value: string | null) => {
                if (value) setDraftLimit(value);
              }}
            >
              <SelectTrigger id="user-filter-limit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USER_LIMIT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option} / halaman
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
          <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
          <Button onClick={apply}>Terapkan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
