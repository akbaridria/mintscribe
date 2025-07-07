"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Twitter, Github, Linkedin } from "lucide-react";
import type { User } from "@/types";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .optional(),
  bio: z
    .string()
    .max(500, {
      message: "Bio must not exceed 500 characters.",
    })
    .optional(),
  socialLinks: z
    .object({
      twitter: z
        .string()
        .url({ message: "Must be a valid URL." })
        .optional()
        .or(z.literal("")),
      github: z
        .string()
        .url({ message: "Must be a valid URL." })
        .optional()
        .or(z.literal("")),
      linkedin: z
        .string()
        .url({ message: "Must be a valid URL." })
        .optional()
        .or(z.literal("")),
    })
    .optional(),
});

interface EditProfileFormProps {
  user?: User;
  onSave: (user: Partial<User>) => void;
  onCancel: () => void;
}

export function EditProfileForm({
  user,
  onSave,
  onCancel,
}: EditProfileFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      socialLinks: {
        twitter: user?.socialLinks?.twitter || "",
        github: user?.socialLinks?.github || "",
        linkedin: user?.socialLinks?.linkedin || "",
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    const updatedUser: Partial<User> = {
      ...user,
      ...values,
      socialLinks: values.socialLinks
        ? {
            twitter: values.socialLinks.twitter ?? "",
            github: values.socialLinks.github ?? "",
            linkedin: values.socialLinks.linkedin ?? "",
          }
        : {
            twitter: "",
            github: "",
            linkedin: "",
          },
    };
    onSave(updatedUser);
  }

  const bioLength = form.watch("bio")?.length || 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{bioLength}/500 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Social Links</FormLabel>
            <div className="grid grid-cols-1 gap-3">
              <FormField
                control={form.control}
                name="socialLinks.twitter"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <Twitter className="w-5 h-5" />
                      <FormControl>
                        <Input
                          placeholder="https://x.com/yourusername"
                          className="flex-1"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="socialLinks.github"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <Github className="w-5 h-5" />
                      <FormControl>
                        <Input
                          placeholder="https://github.com/yourusername"
                          className="flex-1"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="socialLinks.linkedin"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5" />
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/yourusername"
                          className="flex-1"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <Button type="submit">
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
