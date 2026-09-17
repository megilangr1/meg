import { toast } from "@/components/ui/toast";

export function doAlert(
  message: string = "",
  alertType: 0 | 1 | 2 | 3 | 4 = 0,
) {
  let type = "error";
  switch (alertType) {
    case 1:
      type = "success";
      break;

    case 2:
      type = "info";
      break;

    case 3:
      type = "warning";
      break;

    case 4:
      type = "loading";
      break;

    default:
      type = "error";
      break;
  }

  toast.add({
    type: type,
    description:
      message || "Terjadi Kesalahan, Silahkan Hubungi Administrator !",
    timeout: 2000,
  });
}
