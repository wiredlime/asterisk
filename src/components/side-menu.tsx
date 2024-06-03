"use client";

import Link from "next/link";
import SignOutButton from "./sign-out-btn";
import { Icons } from "./icons";
import FriendRequestSidebarOption from "./friend-request-sidebar-option";
import { SidebarOption } from "@/types/typings";
import { Session } from "next-auth";
import { Asterisk, Github, Linkedin, Send } from "lucide-react";
import ChatSidebarOption from "./chat-sidebar-option";
import NextAvatar from "./ui/next-avatar";
import ThemeSettingSidebarOption from "./theme-setting-sidebar-option";

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
    <div className="@container/sidebar dark:bg-background midnight:bg-background bg-accent/30 w-full h-full flex flex-col justify-between">
      <div className="h-20 border-b p-4 bg-primary dark:bg-background midnight:bg-background flex items-center justify-center">
        <Link href="/dashboard" className="flex">
          <Send className="w-5 h-5 text-primary-foreground midnight:text-muted-foreground dark:text-muted-foreground" />
          <Asterisk className="w-5 h-5 text-primary-foreground midnight:text-muted-foreground dark:text-muted-foreground" />
        </Link>
      </div>
      <div className="grow ">
        <div className="h-full">
          <ul role="list" className="h-full list-none">
            {sidebarOptions.map((option) => {
              const Icon = Icons[option.Icon];
              return (
                <li
                  key={option.id}
                  className="border-b p-4 px-5 hover:bg-accent flex justify-center @[10rem]/sidebar:block"
                >
                  <Link
                    href={option.href}
                    className="flex items-center group gap-5 rounded-md text-sm leading-6"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-secondary-foreground" />
                    <span className="truncate font-medium text-secondary-foreground hidden @[10rem]/sidebar:block">
                      {option.name}
                    </span>
                  </Link>
                </li>
              );
            })}
            <li className="border-b p-4 px-5 hover:bg-accent">
              <ChatSidebarOption />
            </li>
            <li className="border-b p-4 px-5 hover:bg-accent">
              <FriendRequestSidebarOption
                sessionId={session?.user.id || ""}
                initialUnseenRequestCount={unseenRequestCount.length}
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="border-border p-4 flex flex-col gap-3 @[10rem]:flex-row @[10rem]:items-center">
        <ThemeSettingSidebarOption />
        <a
          href="https://github.com/wiredlime"
          target="_blank"
          className="text-foreground px-2"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="https://www.linkedin.com/in/ally-nguyen-67a81520b/"
          target="_blank"
          className="text-foreground px-2"
        >
          <Linkedin className="w-5 h-5" />
        </a>
      </div>
      <div className="bg-secondary @container/footer flex flex-col gap-5 @[10rem]/sidebar:flex-row @[10rem]/sidebar:items-center @[10rem]/sidebar:justify-between p-4">
        <div className="flex items-center gap-3">
          <NextAvatar
            src={session?.user.image || ""}
            alt="My profile image"
            size={10}
            className="shrink-0"
          />
          <div className="hidden @[10rem]/footer:block">
            <p className="truncate text-sm font-semibold text-foreground">
              {session?.user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user.email}
            </p>
          </div>
        </div>
        <SignOutButton
          size="sm"
          variant="outline"
          className="w-fit text-foreground dark:bg-secondary dark:hover:bg-background"
        />
      </div>
    </div>
  );
};
