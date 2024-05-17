import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const Page = () => {
  const session = getServerSession(authOptions);

  return <div>dashboard</div>;
};

export default Page;
