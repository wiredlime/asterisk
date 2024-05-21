import MobileChatLayout from "@/components/mobile-chat-layout";
import { SideMenu } from "@/components/side-menu";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
// import { notFound } from "next/navigation";
import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout = async ({ children }: LayoutProps) => {
  // If current user is not verified, they cannot access to dashboard
  // const session = await getServerSession(authOptions);
  // if (!session) notFound();

  const session = await getServerSession(authOptions);
  const friends = await getFriendsByUserId(session?.user.id || "");

  const unseenRequestCount = (await fetchRedis(
    "smembers",
    `user:${session?.user.id}:incoming_friend_requests`
  )) as User[];

  return (
    <div className="w-full flex h-screen">
      <div className="md:hidden w-full">
        <MobileChatLayout
          friends={friends}
          session={session}
          unseenRequestCount={unseenRequestCount}
        />
        <div className="grow h-full pt-16">{children}</div>
      </div>
      <div className="hidden md:flex min-h-screen w-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="h-screen" defaultSize={20}>
            <SideMenu
              friends={friends}
              session={session}
              unseenRequestCount={unseenRequestCount}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel className="max-h-screen" defaultSize={80}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Layout;