"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";

const ONBOARDING_STEPS = [
  { path: "/onboarding/supporter", label: "Supporter Profile" },
  { path: "/onboarding/nonprofit", label: "Nonprofit Profile" },
  { path: "/onboarding/sponsor", label: "Business Profile" },
  { path: "/onboarding/complete", label: "Complete" },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    // Calculate progress based on current step
    const currentStepIndex = ONBOARDING_STEPS.findIndex(step => step.path === pathname);
    if (currentStepIndex >= 0) {
      setProgress(((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100);
    }
  }, [session, pathname, router]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Progress value={progress} className="h-1" />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {ONBOARDING_STEPS.map((step, index) => {
              const isCurrent = step.path === pathname;
              const isComplete = ONBOARDING_STEPS.findIndex(s => s.path === pathname) > index;
              return (
                <div key={step.path} className="flex items-center">
                  {index > 0 && (
                    <div
                      className={`h-px w-8 mx-2 ${
                        isComplete ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : isComplete
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      isCurrent
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}