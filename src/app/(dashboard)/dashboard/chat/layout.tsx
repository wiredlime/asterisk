import ChatList from "@/components/chat-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { authOptions } from "@/lib/auth";

import { Search, SquarePen } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import React, { ReactNode, useMemo } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);
  const friends = await getFriendsByUserId(session?.user.id || "");

  return (
    <div className="h-full grid grid-cols-[4fr_8fr]">
      <div className="h-full border-r">
        <div className="border-b p-4 h-20 flex items-center justify-between">
          <Input
            placeholder="Search friends..."
            startAdornment={<Search className="w-4 h-4" />}
          />
          <Button variant="ghost" className="px-0 ml-4 h-0">
            <SquarePen className="w-5 h-5" />
          </Button>
        </div>
        <ChatList />
      </div>
      {children}
    </div>
  );
}
