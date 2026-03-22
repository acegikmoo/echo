"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";

import { Button } from "../ui/button";
import Image from "next/image";
import { ChevronDown, ChevronLeft, SunMoonIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { api } from "@/trpc/react";

export const ProjectHeader = ({ projectId }: { projectId: string }) => {
  const [project] = api.projects.getOne.useSuspenseQuery({ id: projectId });

  const { setTheme, theme } = useTheme();
  return (
    <header className="flex items-center justify-between border-b p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="pl-2 transition-opacity hover:bg-transparent hover:opacity-75 focus-visible:ring-0"
          >
            <Image src="/logo.svg" alt="logo" width={18} height={18} />
            <span className="text-sm font-medium">{project.name}</span>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem asChild>
            <Link href="/">
              <ChevronLeft />
              <span>Go to dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <SunMoonIcon className="text-muted-foreground size-4" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="light">
                    <span>Light</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <span>Dark</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <span>System</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
