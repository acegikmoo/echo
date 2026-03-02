"use client";

import Image from "next/image";
import Link from "next/link";
import { authClient, useSession } from "@/server/better-auth/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const AppBar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

return (
  <div className="p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent">
    <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
      
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="logo" width={25} height={25} />
        <span className="font-semibold text-lg">Echo</span>
      </Link>

      {session ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {session.user.email}
          </span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link href="/signup">
            <Button variant="outline" size="sm">Sign Up</Button>
          </Link>
          <Link href="/signin">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </div>
      )}
    </div>
  </div>
)}

