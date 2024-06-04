import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ChatProvider from "@/contexts/chat-provider";
import { fetchRedis } from "@/helpers/redis";
import { chatHrefConstructor, cn } from "@/lib/utils";
import { ActiveChat } from "@/components/chat-list";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { Message } from "@/lib/validations/message";
import ToastProvider from "@/contexts/toast-provider";
import ThemeProvider from "@/contexts/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asterisk",
  description: "Let's chitty chat chit with everyone",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  console.log(session);
  // const friends = await getFriendsByUserId(session?.user.id || "");

  // const friendsWithLastMessage: ActiveChat[] = await Promise.all(
  //   friends.map(async (friend) => {
  //     const [lastMessageRaw] = (await fetchRedis(
  //       "zrange",
  //       `chat:${chatHrefConstructor(
  //         session?.user.id || "",
  //         friend.id
  //       )}:messages`,
  //       -1,
  //       -1
  //     )) as string[];

  //     if (lastMessageRaw) {
  //       const lastMessage = JSON.parse(lastMessageRaw) as Message;
  //       return {
  //         ...friend,
  //         lastMessage,
  //       };
  //     } else {
  //       return { ...friend };
  //     }
  //   })
  // );

  // TODO: Get theme value from local storage
  return (
    <html lang="en" className={cn("dark")}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

// return (
//   <ThemeProvider>
//     <ToastProvider>
//       <ChatProvider
//         activeChats={friendsWithLastMessage}
//         sessionId={session?.user.id || ""}
//       >
//         {children}
//       </ChatProvider>
//     </ToastProvider>
//   </ThemeProvider>
// );
