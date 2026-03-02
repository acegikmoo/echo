"use client";

import { authClient} from "@/server/better-auth/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return <Button variant="outline" size="sm" onClick={handleSignOut}>
    Sign Out
  </Button>
}
