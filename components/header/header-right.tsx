"use client";

import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/contexts/context-sheet";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import HeaderInfo from "./header-info";
import HeaderSheet from "./header-sheet";
import HeaderUser from "./header-user";
import HeaderNav from "./header-nav";

interface HeaderRightProps {
  user: User | null;
  profile: Profile | null;
}

export default function HeaderRight({ user, profile }: HeaderRightProps) {
  const { isOpen, setIsOpen } = useSheet();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="mr-2 w-10 h-10 rounded-full dark:bg-black dark:border-white/20 dark:hover:bg-black dark:hover:border-white dark:text-white"
          >
            <Coffee />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <HeaderSheet user={user} />
          <HeaderUser profile={profile} />
          <HeaderNav user={user} />
          <HeaderInfo />
        </SheetContent>
      </Sheet>
    </>
  );
}
