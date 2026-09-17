import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="gap-0">
        <CardHeader className="border-b">
          <CardTitle>Akun Pengguna</CardTitle>
          <CardDescription>Tabel daftar pengguna pada aplikasi</CardDescription>

          <CardAction className="flex flex-row gap-2">
            <Button
              variant={"outline"}
              size={"sm"}
              render={<Link href={"/akun-pengguna/create"} />}
              nativeButton={false}
            >
              <Plus />

              <span className="hidden sm:block">Tambah</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="w-36 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-3">
                    <Tooltip>
                      <TooltipTrigger>
                        <Link href={`/akun-pengguna/${"123"}/detail`}>
                          <Eye className="size-4.5 shrink-0 text-teal-500" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Detail Data</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <Link href={`/akun-pengguna/${"123"}/edit`}>
                          <Edit className="size-4.5 shrink-0 text-amber-600" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Edit Data</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <Link href={`/akun-pengguna/${"123"}/edit`}>
                          <Trash2 className="size-4.5 shrink-0 text-red-500" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Edit Data</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="w-full flex items-center justify-end text-xs font-mono">
            List Pengguna
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
