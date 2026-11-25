"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ellipsis, Eye, EyeOff, FileText, Pencil, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { doAlert } from "@/helpers/client/client.helper";
import { PROJECT_NETWORK_ERROR_MESSAGE } from "@/modules/project/project.errors";

import { deleteProject, setProjectStatus } from "../actions";

type ProjectActionsProps = {
  projectId: string;
  title: string;
  published: boolean;
};

export function ProjectActions({
  projectId,
  title,
  published,
}: ProjectActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function toggleStatus() {
    startTransition(async () => {
      try {
        const result = await setProjectStatus(
          projectId,
          published ? "draft" : "published",
        );
        if (!result.ok) {
          doAlert(result.message);
          return;
        }
        doAlert(published ? "Project jadi draft" : "Project diterbitkan", 1);
        router.refresh();
      } catch {
        doAlert(PROJECT_NETWORK_ERROR_MESSAGE);
      }
    });
  }

  function remove() {
    startTransition(async () => {
      try {
        const result = await deleteProject(projectId);
        if (!result.ok) {
          doAlert(result.message);
          return;
        }
        doAlert(`Project ${title} dihapus`, 1);
        setConfirmOpen(false);
        router.refresh();
      } catch {
        doAlert(PROJECT_NETWORK_ERROR_MESSAGE);
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Aksi untuk ${title}`}
              disabled={isPending}
            />
          }
        >
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/projects/${projectId}`)}>
            <FileText data-icon="inline-start" />
            Detail & aset
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/projects/${projectId}/edit`)}>
            <Pencil data-icon="inline-start" />
            Edit info
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleStatus}>
            {published ? <EyeOff data-icon="inline-start" /> : <Eye data-icon="inline-start" />}
            {published ? "Jadikan draft" : "Terbitkan"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 data-icon="inline-start" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus project {title}?</AlertDialogTitle>
            <AlertDialogDescription>
              Baris project, galeri, dan info ikut terhapus. File di disk tidak
              dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={remove} disabled={isPending}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
