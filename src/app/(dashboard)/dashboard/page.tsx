import { Asterisk, Send } from "lucide-react";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="relative bg-background h-screen w-full grid place-items-center">
      <div
        className="absolute bottom-36 left-36 w-[40px] h-[40px] dark:blur-sm rounded-full"
        style={{
          background:
            "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)",
        }}
      ></div>
      <div
        className="absolute top-28 right-28 w-[160px] h-[160px] blur-sm rounded-full"
        style={{
          background:
            "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)",
        }}
      ></div>
      <div className="h-screen w-full grid place-items-center p-10">
        <h2 className="font-bold drop-shadow-lg animate-pulse text-foreground">
          Asterisk
        </h2>
      </div>
    </div>
  );
};

export default Page;
