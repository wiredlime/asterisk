import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type Props = {};

export default function loading({}: Props) {
  return (
    <div className="bg-background h-screen w-full space-y-4 p-8">
      <Skeleton className="w-2/3 h-20" />
      <br />
      <br />
      <Skeleton className="w-1/3 h-10" />
      <Skeleton className="w-1/2 h-16" />
    </div>
  );
}
