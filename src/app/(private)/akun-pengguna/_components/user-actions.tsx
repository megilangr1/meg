"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, Loader2, Trash2, Undo2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { doAlert } from "@/helpers/client/client.helper";
import { authClient } from "@/lib/auth-client";
import {
  USER_NETWORK_ERROR_MESSAGE,
  getUserErrorMessage,
} from "@/modules/user/user.errors";

type PendingAction = "ban" | "unban" | "delete" | null;

const ACTION_HIT =
  "inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted";

const ACTION_TONE: Record<Exclude<PendingAction, null>, string> = {
  ban: "text-amber-600 hover:text-amber-700",
  unban: "text-teal-600 hover:text-teal-700",
  delete: "text-destructive hover:text-destructive",
};

type UserActionsProps = {
  userId: string;
  userName: string;
  banned: boolean;
  /** True bila baris = diri sendiri / role admin — semua aksi mutasi mati. */
  locked: boolean;
};

export function UserActions({
  userId,
  userName,
  banned,
  locked,
}: UserActionsProps) {
  const router = useRouter();
  const [action, setAction] = useState<PendingAction>(null);
  const [banReason, setBanReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function runAction() {
    if (!action) return;
    if (action === "ban" && !banReason.trim()) {
      doAlert("Alasan ban wajib diisi");
      return;
    }

    setIsLoading(true);
    try {
      const { error } =
        action === "ban"
          ? await authClient.admin.banUser({ userId, banReason: banReason.trim() })
          : action === "unban"
            ? await authClient.admin.unbanUser({ userId })
            : await authClient.admin.removeUser({ userId });

      if (error) {
        doAlert(getUserErrorMessage(error.code));
        return;
      }

      doAlert(
        action === "ban"
          ? `Pengguna ${userName} diblokir`
          : action === "unban"
            ? `Blokir ${userName} dibuka`
            : `Pengguna ${userName} dihapus`,
        1,
      );
      setAction(null);
      setBanReason("");
      router.refresh();
    } catch (err) {
      console.warn(err);
      doAlert(USER_NETWORK_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }

  if (locked) {
    return (
      <Tooltip>
        <TooltipTrigger className="inline-flex size-8 cursor-not-allowed items-center justify-center text-muted-foreground/50">
          <span className="text-xs">—</span>
        </TooltipTrigger>
        <TooltipContent>Tidak tersedia untuk akun ini</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <AlertDialog
      open={action !== null}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          setAction(null);
          setBanReason("");
        }
      }}
    >
      <div className="flex items-center justify-center gap-1">
        {banned ? (
          <Tooltip>
            <TooltipTrigger
              onClick={() => setAction("unban")}
              className={`${ACTION_HIT} ${ACTION_TONE.unban}`}
              aria-label={`Buka blokir ${userName}`}
            >
              <Undo2 className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Buka Blokir</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger
              onClick={() => setAction("ban")}
              className={`${ACTION_HIT} ${ACTION_TONE.ban}`}
              aria-label={`Blokir ${userName}`}
            >
              <Ban className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Blokir Permanen</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger
            onClick={() => setAction("delete")}
            className={`${ACTION_HIT} ${ACTION_TONE.delete}`}
            aria-label={`Hapus ${userName}`}
          >
            <Trash2 className="size-4" />
          </TooltipTrigger>
          <TooltipContent>Hapus Permanen</TooltipContent>
        </Tooltip>
      </div>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action === "ban"
              ? `Blokir ${userName}?`
              : action === "unban"
                ? `Buka blokir ${userName}?`
                : `Hapus ${userName}?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {action === "ban"
              ? "Blokir permanen, sesi aktif langsung dicabut. Data tetap tersimpan dan bisa dibuka lagi."
              : action === "unban"
                ? "Pengguna bisa login kembali."
                : "Hapus permanen dari database. Tidak bisa dibatalkan."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {action === "ban" && (
          <Input
            placeholder="Alasan blokir (wajib)"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            disabled={isLoading}
          />
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              runAction();
            }}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin" />}
            {action === "ban"
              ? "Blokir"
              : action === "unban"
                ? "Buka Blokir"
                : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
