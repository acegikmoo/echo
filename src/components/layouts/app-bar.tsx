"use client";

import { useSession } from "@/server/better-auth/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { authClient } from "@/server/better-auth/client";
import { useRouter } from "next/navigation";

export const AppBar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <div className="p-4 bg-transparent fixed top-0 left-0 right-0 z-50 border-b">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={24} height={24} />
          <span className="font-semibold text-lg">Echo</span>
        </Link>

        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {session.user.email}
            </span>
            <Button variant="outline" size="sm" className="cursor-pointer" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/sign-up">
              <Button variant="outline" size="sm">Sign up</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="sm">Sign in</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
