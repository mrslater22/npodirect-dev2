"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Building2, Briefcase, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

export default function OnboardingComplete() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profiles, setProfiles] = useState<{
    supporter: boolean;
    nonprofit: boolean;
    sponsor: boolean;
  }>({
    supporter: false,
    nonprofit: false,
    sponsor: false,
  });

  useEffect(() => {
    // Trigger confetti animation on load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Check user's profiles
    const checkProfiles = async () => {
      const response = await fetch("/api/profiles/check");
      const data = await response.json();
      setProfiles(data.profiles);
    };

    checkProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            🎉 Congratulations!
          </h1>
          <p className="text-xl text-muted-foreground">
            Your profile has been successfully created. Welcome to our community!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profiles.supporter && (
            <Card className="relative overflow-hidden">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary" />
                  Supporter Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Discover and support causes you care about
                </p>
                <Button
                  className="w-full"
                  onClick={() => router.push("/dashboard/supporter")}
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {profiles.nonprofit && (
            <Card className="relative overflow-hidden">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  Nonprofit Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage your campaigns and connect with supporters
                </p>
                <Button
                  className="w-full"
                  onClick={() => router.push("/dashboard/nonprofit")}
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {profiles.sponsor && (
            <Card className="relative overflow-hidden">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                  Business Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage your sponsorships and partnerships
                </p>
                <Button
                  className="w-full"
                  onClick={() => router.push("/dashboard/sponsor")}
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Additional Profile Options */}
          {!profiles.nonprofit && (
            <Card className="relative overflow-hidden border-dashed">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-6 w-6" />
                  Add Nonprofit Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Create a profile for your nonprofit organization
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/onboarding/nonprofit")}
                >
                  Create Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {!profiles.sponsor && (
            <Card className="relative overflow-hidden border-dashed">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-6 w-6" />
                  Add Business Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Create a profile for your business
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/onboarding/sponsor")}
                >
                  Create Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}