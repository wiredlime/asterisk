interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Chat {
  id: string;
  message: Message[];
}

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
}
