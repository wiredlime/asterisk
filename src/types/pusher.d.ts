// This file is used for realtime communication
interface IncomingFriendRequest {
  senderId: string;
  senderImage: string | null | undefined;
  senderEmail: string | null | undefined;
  senderName: string | null | undefined;
}
