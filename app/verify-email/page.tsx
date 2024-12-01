"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Check your email
          </h1>
          <p className="text-muted-foreground">
            We sent a verification link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in the email to verify your account. If you don't see it, check your spam folder.
          </p>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Resend verification email
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              asChild
            >
              <Link href="/login">Back to login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}