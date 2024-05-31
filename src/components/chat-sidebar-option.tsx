"use client";
import { MessageCircleMore } from "lucide-react";
import Link from "next/link";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChatContext } from "@/contexts/chat-provider";

function ChatSidebarOption() {
  const { unseenMessages } = useContext(ChatContext);
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessageCount, setUnseenMessageCount] = useState(
    unseenMessages.length
  );

  const detail = useMemo(() => {
    const shouldNotNotify = pathname?.includes("/dashboard/chat");
    if (!shouldNotNotify) {
      if (unseenMessageCount > 0) {
        return (
          <div className="rounded-full font-medium text-xs w-5 h-5 flex justify-center items-center bg-primary bg-gay text-primary-foreground gay:text-primary">
            {unseenMessageCount}
          </div>
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, unseenMessageCount, router]);

  useEffect(() => {
    setUnseenMessageCount(unseenMessages.length);
  }, [unseenMessages]);

  return (
    <Link
      href="/dashboard/chat"
      onClick={() => setUnseenMessageCount(0)}
      className="w-full flex items-center justify-between text-sm leading-6"
    >
      <div className="w-full flex gap-5 justify-center @[10rem]/sidebar:justify-start @[10rem]/sidebar:items-center">
        <MessageCircleMore className="h-5 w-5 shrink-0 text-secondary-foreground" />
        <span className="truncate font-medium text-secondary-foreground hidden @[10rem]/sidebar:block">
          Messages
        </span>
      </div>
      {detail}
    </Link>
  );
}

export default ChatSidebarOption;
