"use client";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

type ProvidersProps = {
  children: ReactNode;
};

const ToastProvider = ({ children }: ProvidersProps) => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </>
  );
};

export default ToastProvider;
