"use client";

import Link from "next/link";
import SignOutButton from "./sign-out-btn";
import { Icons } from "./icons";
import FriendRequestSidebarOption from "./friend-request-sidebar-option";
import { SidebarOption } from "@/types/typings";
import { Session } from "next-auth";
import { Asterisk, Send } from "lucide-react";
import ChatSidebarOption from "./chat-sidebar-option";
import NextAvatar from "./ui/next-avatar";

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "All friends",
    href: "/dashboard/explore",
    Icon: "UserPlus",
  },
];

export interface SideMenuProps {
  session: Session | null;
  unseenRequestCount: User[];
}
export const SideMenu = ({ session, unseenRequestCount }: SideMenuProps) => {
  return (
    <div className="@container/sidebar w-full bg-accent/20 h-full flex flex-col justify-between">
      <div className="h-20 border-b p-4 bg-primary flex items-center justify-center">
        <Link href="/dashboard" className="flex">
          <Send className="w-5 h-5 text-primary-foreground" />
          <Asterisk className="w-5 h-5 text-primary-foreground" />
        </Link>
      </div>
      <div className="grow">
        <div className="h-full">
          <ul role="list" className="h-full list-none">
            {sidebarOptions.map((option) => {
              const Icon = Icons[option.Icon];
              return (
                <li
                  key={option.id}
                  className="border-b px-5 p-4 hover:bg-gray-50 flex justify-center @[10rem]/sidebar:block"
                >
                  <Link
                    href={option.href}
                    className="text-gray-700 hover:text-indigo-600 flex items-center group gap-5 rounded-md text-sm leading-6"
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="truncate font-medium hidden @[10rem]/sidebar:block">
                      {option.name}
                    </span>
                  </Link>
                </li>
              );
            })}
            <li className="border-b px-5 p-4 hover:bg-gray-50">
              <ChatSidebarOption />
            </li>
            <li className="border-b px-5 p-4 hover:bg-gray-50">
              <FriendRequestSidebarOption
                sessionId={session?.user.id || ""}
                initialUnseenRequestCount={unseenRequestCount.length}
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="@container/footer flex flex-col gap-5 @[10rem]/sidebar:flex-row @[10rem]/sidebar:items-center @[10rem]/sidebar:justify-between p-4">
        <div className="flex items-center gap-3">
          <NextAvatar
            src={session?.user.image || ""}
            alt="My profile image"
            size={10}
            className="shrink-0"
          />
          <div className="hidden @[10rem]/footer:block">
            <p className="truncate text-sm font-semibold">
              {session?.user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user.email}
            </p>
          </div>
        </div>
        <SignOutButton size="sm" variant="outline" className="w-fit" />
      </div>
    </div>
  );
};
