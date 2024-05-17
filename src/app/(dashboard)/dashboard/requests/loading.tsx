import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type Props = {};

export default function loading({}: Props) {
  return (
    <div className="w-full space-y-4 p-8">
      <Skeleton className="w-2/3 h-20" />
      <Skeleton className="w-1/3 h-10" />
      <br />
      <br />
      <div className="w-full flex gap-4 items-center">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-1/2 h-10" />
      </div>
      <br />

      <div className="w-full flex gap-4 items-center">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-1/2 h-10" />
      </div>
      <br />

      <div className="w-full flex gap-4 items-center">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-1/2 h-10" />
      </div>
    </div>
  );
}
