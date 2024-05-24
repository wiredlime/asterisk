"use client";

import Link from "next/link";
import SignOutButton from "./sign-out-btn";
import NextAvatar from "./ui/next-avatar";
import { Icons } from "./icons";
import FriendRequestSidebarOption from "./friend-request-sidebar-option";
import { SidebarOption } from "@/types/typings";
import { Session } from "next-auth";
import { UserInfoBox } from "./user-info-box";
import { Asterisk, Earth, LampDesk, Send } from "lucide-react";
import ChatListSidebar from "./chat-list-sidebar";

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Messages",
    href: "/dashboard/chat",
    Icon: "MessageCircleMore",
  },
  {
    id: 2,
    name: "All friends",
    href: "/dashboard/friends",
    Icon: "UserPlus",
  },
];

export interface SideMenuProps {
  session: Session | null;
  unseenRequestCount: User[];
}
export const SideMenu = ({ session, unseenRequestCount }: SideMenuProps) => {
  return (
    <div className="bg-accent/20 h-full flex flex-col justify-between">
      <div className="h-20 border-b p-4 bg-primary flex items-center justify-center">
        <Link href="/dashboard" className="flex gap-2">
          <Send className="h-10 text-primary-foreground" />
          <Asterisk className="h-10 text-primary-foreground" />
        </Link>
      </div>
      <div className="grow px-4 py-2">
        <div className="">
          <ul role="list" className="list-none">
            {sidebarOptions.map((option) => {
              const Icon = Icons[option.Icon];
              return (
                <li key={option.id} className="p-2">
                  <Link
                    href={option.href}
                    className=" text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md text-sm leading-6"
                  >
                    <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                      <Icon className="h-4 w-4" />
                    </span>

                    <span className="truncate">{option.name}</span>
                  </Link>
                </li>
              );
            })}
            <li className="p-2">
              <FriendRequestSidebarOption
                sessionId={session?.user.id || ""}
                initialUnseenRequestCount={unseenRequestCount.length}
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between p-4">
        <UserInfoBox
          image={session?.user.image || ""}
          name={session?.user.name || ""}
          email={session?.user.email || ""}
        />
        <SignOutButton size="sm" />
      </div>
    </div>
  );
};
