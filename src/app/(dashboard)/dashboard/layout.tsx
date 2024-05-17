import ChatListSidebar from "@/components/chat-list-sidebar";
import FriendRequestSidebarOption from "@/components/friend-request-sidebar-option";
import { Icons } from "@/components/icons";
import SignOutButton from "@/components/sign-out-btn";
import NextAvatar from "@/components/ui/next-avatar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { SidebarOption } from "@/types/typings";
import { getServerSession } from "next-auth";
import Link from "next/link";
// import { notFound } from "next/navigation";
import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

const Layout = async ({ children }: LayoutProps) => {
  // If current user is not verified, they cannot access to dashboard
  // const session = await getServerSession(authOptions);
  // if (!session) notFound();
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen w-full">
      <ResizablePanel className="h-screen" defaultSize={20}>
        <SideMenu />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="max-h-screen" defaultSize={80}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

const SideMenu = async () => {
  const session = await getServerSession(authOptions);
  const friends = await getFriendsByUserId(session?.user.id || "");

  const unseenRequestCount = (await fetchRedis(
    "smembers",
    `user:${session?.user.id}:incoming_friend_requests`
  )) as User[];

  return (
    <div className="h-full flex flex-col justify-between p-4">
      <Link href="/dashboard" className="flex items-center gap-2">
        <Icons.Logo className="h-3 w-auto text-indigo-600" />{" "}
        <span className="text-xs text-muted-foreground">Dashboard</span>
      </Link>

      <div>
        <p className="text-xs text-muted-foreground">Your chats</p>

        <ChatListSidebar friends={friends} sessionId={session?.user.id || ""} />
      </div>

      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">Overview</p>
        <ul role="list" className="list-none">
          {sidebarOptions.map((option) => {
            const Icon = Icons[option.Icon];
            return (
              <li key={option.id}>
                <Link
                  href={option.href}
                  className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6"
                >
                  <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="truncate">{option.name}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <FriendRequestSidebarOption
              sessionId={session?.user.id || ""}
              initialUnseenRequestCount={unseenRequestCount.length}
            />
          </li>
        </ul>
      </div>
      <UserInfoBox
        image={session?.user.image || ""}
        name={session?.user.name || ""}
        email={session?.user.email || ""}
      />
    </div>
  );
};

type UserInfoBoxProps = {
  image: string;
  name: string;
  email?: string;
};

const UserInfoBox = ({ image, name, email }: UserInfoBoxProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-4">
        <NextAvatar src={image} alt="My profile image" size={9} />
        <div>
          <p className="truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </div>
      <SignOutButton size="sm" />
    </div>
  );
};
export default Layout;
