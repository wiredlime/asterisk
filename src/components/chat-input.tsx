"use client";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { Loader2, SendHorizonal, SmilePlus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type ChatInputProps = {
  chatPartner: User;
  chatId: string;
};

// 1. Make sure the textarea changes size corresponding to the text amount: npm i react-textarea-autosize
// 2. Handle keydown event, where chatter can do line breaks with shift + enter
export default function ChatInput({ chatPartner, chatId }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState<string>("");
  const [cursorPosition, setCursorPosition] = useState(0);

  const sendMessage = async () => {
    if (!input.length) return;
    setIsLoading(true);
    try {
      await axios.post(`/api/message/send`, { text: input, chatId });

      // reset and refocus after send message
      setInput("");
      textareaRef.current?.focus();
    } catch (error) {
      toast.error("Something went wrong.Please try again later.");
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.selectionEnd = cursorPosition;
    }
  }, [cursorPosition]);

  return (
    <div className="border-t p-4 mb-2 sm:mb-0 flex gap-4">
      <div className="grow overflow-hidden rounded-lg shadow ring-1 ring-inset ring-accent focus-within:ring-2 focus-within:ring-primary">
        <div className="flex flex-row p-2">
          <Popover>
            <PopoverTrigger className="px-4">
              <SmilePlus className="w-5 h-5 text-foreground" />
            </PopoverTrigger>
            <PopoverContent className="bg-transparent w-fit h-fit shadow-none border-none">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </PopoverContent>
          </Popover>

          <TextareaAutosize
            rows={1}
            value={input}
            ref={textareaRef}
            onChange={(e) => setInput(e.target.value)}
            className="block w-full resize-none border-0 bg-transparent text-primary placeholder:text-muted-foreground/50 focus:ring-0 focus-visible:outline-none sm:py-1.5 px-2 sm:text-sm sm:leading-6"
            placeholder={`Send a message to ${chatPartner.name}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <Button
            onClick={sendMessage}
            type="submit"
            variant="ghost"
            className="rounded-full hover:bg-accent/70 "
          >
            {isLoading ? (
              <Loader2 className="text-muted-foreground w-4 h-4 animate-spin" />
            ) : (
              <SendHorizonal className="text-foreground rounded-full " />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
