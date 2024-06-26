"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("This is not a valid email."),
});

type AddEmailFormProps = {
  onNext?: ({ email }: { email: string }) => void;
};

export function AddEmailForm({ onNext }: AddEmailFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // validate if email exist
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/register/validate-email", {
        email: values.email,
      });
      await new Promise((resolve) => setTimeout(resolve, 200));
      setIsLoading(false);
      if (response.status !== 200) {
        form.setError("email", {
          message:
            "Invalid email, please register with a different email address",
        });
        return;
      }
      // Pass email outward to the sign-up-stepper
      onNext?.({ email: values.email });
    } catch (error) {
      form.setError("email", {
        message:
          "Invalid email, please register with a different email address",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="yours@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-muted-foreground" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="sm">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </Form>
  );
}
