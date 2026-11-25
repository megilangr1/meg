import type { Metadata } from "next";
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

import { ProjectForm } from "../_components/project-form";

export const metadata: Metadata = {
  title: "Tambah Project",
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold">Tambah Project</h1>
        <p className="text-sm text-muted-foreground">
          Isi data dasar dulu — galeri dan banner diatur setelah project dibuat.
        </p>
      </div>
      <Card className="gap-0">
        <CardHeader className="border-b">
          <CardTitle>Formulir Project</CardTitle>
          <CardDescription>Slug dibuat otomatis dari judul bila kosong</CardDescription>

          <CardAction>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/projects" />}
              nativeButton={false}
            >
              <List data-icon="inline-start" />
              <span className="hidden sm:block">List Project</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <ProjectForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
