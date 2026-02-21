"use client";

import type { User } from "@supabase/supabase-js";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/contexts/sheet-context";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import HeaderInfo from "./header-info";
import HeaderSheet from "./header-sheet";
import HeaderUser from "./header-user";
import HeaderNav from "./header-nav";

interface HeaderRightProps {
  user: User | null;
}

export default function HeaderRight({ user }: HeaderRightProps) {
  const { isOpen, setIsOpen } = useSheet();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="mr-2 w-10 h-10 rounded-full">
            <Coffee />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <HeaderSheet user={user} />
          <HeaderUser userId={user?.id} />
          <HeaderNav user={user} />
          <HeaderInfo />
        </SheetContent>
      </Sheet>
    </>
  );
}
