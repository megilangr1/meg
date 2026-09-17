"use client";

import { Loader2, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LogoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      variant={"destructive"}
      className="w-full cursor-pointer"
      nativeButton={true}
      disabled={isLoading}
      onClick={async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/");
              },
            },
          });
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <LogOut />}
      Logout
    </Button>
  );
};

export default LogoutButton;
