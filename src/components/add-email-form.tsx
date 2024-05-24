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

const formSchema = z.object({
  email: z.string().email("This is not a valid email."),
});

type AddEmailFormProps = {
  onNext?: ({ email }: { email: string }) => void;
};
export function AddEmailForm({ onNext }: AddEmailFormProps) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Pass email outward to the sign-up-stepper
    onNext?.({ email: values.email });
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
                <Input placeholder="yours@gmail.com" {...field} />
              </FormControl>
              <FormMessage className="text-muted-foreground" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="sm">
          Continue
        </Button>
      </form>
    </Form>
  );
}
