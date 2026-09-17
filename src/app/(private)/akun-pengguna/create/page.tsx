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
import { List } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="gap-0">
        <CardHeader className="border-b">
          <CardTitle>Akun Pengguna</CardTitle>
          <CardDescription>Formulir tambah data pengguna</CardDescription>

          <CardAction className="flex flex-row gap-2">
            <Button
              variant={"outline"}
              size={"sm"}
              render={<Link href={"/akun-pengguna"} />}
              nativeButton={false}
            >
              <List />

              <span className="hidden sm:block">List Pengguna</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">form-pengguna.tsx</CardContent>
        <CardFooter>
          <div className="w-full flex items-center justify-end text-xs font-mono">
            Create Pengguna
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
