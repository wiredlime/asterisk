"use client";

import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Asterisk, Loader2, Send, SmilePlus } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { chatHrefConstructor } from "@/lib/utils";
import RecipientInput from "./recipient-input";
import { SuggestionDataItem } from "react-mentions";

type NewMessageFormProps = {
  defaultChatPartner?: User;
  sessionId: string;
  friends: User[];
  formTrigger?: ReactNode;
};

export default function NewMessageForm({
  defaultChatPartner,
  sessionId,
  friends,
  formTrigger,
}: NewMessageFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [input, setInput] = useState<string>("");
  const [cursorPosition, setCursorPosition] = useState(0);

  const [recipient, setRecipient] = useState<SuggestionDataItem | undefined>();

  const chatPartner = useMemo(() => {
    return friends.find((f) => f.email === recipient?.id);
  }, [friends, recipient?.id]);

  const chatId = useMemo(() => {
    if (chatPartner && chatPartner.id) {
      return chatHrefConstructor(sessionId, chatPartner.id);
    }
  }, [chatPartner, sessionId]);

  const sendMessage = async () => {
    if (!input.length) return;
    setIsLoading(true);
    try {
      await axios.post(`/api/message/send`, { text: input, chatId });
      // reset and refocus after send message
      setInput("");
      textareaRef.current?.focus();
      setIsSent(true);
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmojiClick = (emoji: EmojiClickData) => {
    const ref = textareaRef.current;

    if (ref) {
      ref?.focus();
      const start = input.substring(0, ref.selectionStart);
      const end = input.substring(ref.selectionStart);
      const text = start + emoji.emoji + end;
      setInput(text);
      setCursorPosition(start.length + 1);
    }
  };

  const friendAsMentionItem: SuggestionDataItem[] = useMemo(() => {
    return friends.map((friend) => ({
      id: friend.email || "",
      display: friend.name || "",
    }));
  }, [friends]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.selectionEnd = cursorPosition;
    }
  }, [cursorPosition]);

  if (isSent) {
    return (
      <Dialog defaultOpen onOpenChange={() => setIsSent(false)}>
        <DialogTrigger asChild>
          {formTrigger ? (
            formTrigger
          ) : (
            <Button className="grow gap-2" size="sm">
              <Send className="w-4 h-4" />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="py-20 bg-primary/90 ring-0 text-background max-w-xs grid place-items-center gap-5 border-none">
          <div className="flex flex-row justify-center">
            <Send className="w-5 h-5" />
            <Asterisk />
          </div>
          <DialogTitle>Message sent!</DialogTitle>
          <DialogDescription className="text-background">
            Thanks for making the move. Let&apos;s get in touch with more
            friends. <br />
            <a href={`/dashboard/chat/${chatId}`} className="text-xs underline">
              Or go to {chatPartner?.name} inbox
            </a>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {formTrigger ? (
          formTrigger
        ) : (
          <Button className="grow gap-2" size="sm">
            <Send className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm space-y-5 rounded-3xl">
        <DialogHeader className="flex flex-row items-center gap-5">
          <div>
            <DialogTitle>New message</DialogTitle>
            <DialogDescription>
              Spin up a message to your friend
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-5 w-full">
          <RecipientInput
            defaultRecipient={defaultChatPartner}
            recipient={recipient}
            setRecipient={setRecipient}
            friends={friendAsMentionItem}
          />
          <div className="grow relative h-40 overflow-hidden rounded-lg ring-1 ring-inset ring-accent focus-within:ring-2 focus-within:ring-accent">
            <TextareaAutosize
              rows={4}
              value={input}
              ref={textareaRef}
              onChange={(e) => setInput(e.target.value)}
              className="block w-full resize-none border-0 bg-transparent text-primary placeholder:text-muted-foreground/50 focus:ring-0 focus-visible:outline-none sm:py-2 px-4 sm:text-sm sm:leading-6"
              placeholder={`Send a message to ${
                chatPartner?.email || "your friend"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <div className="absolute bottom-4 left-0 px-4 h-5">
              <Popover>
                <PopoverTrigger>
                  <SmilePlus className="w-5 h-5" />
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  className="bg-transparent w-fit h-fit shadow-none border-none"
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={270}
                    height={380}
                    previewConfig={{
                      showPreview: false,
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <DialogFooter className="flex">
          <DialogClose asChild>
            <Button size="sm" variant="outline" onClick={() => setInput(" ")}>
              Cancel
            </Button>
          </DialogClose>

          <Button size="sm" onClick={sendMessage}>
            {isLoading ? (
              <Loader2 className="text-muted-foreground w-4 h-4 animate-spin" />
            ) : (
              "Send message"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
