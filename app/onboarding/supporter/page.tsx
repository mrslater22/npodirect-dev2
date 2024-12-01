"use client";

// ... (keep existing imports)

export default function SupporterOnboarding() {
  // ... (keep existing state and form setup)

  async function onSubmit(data: SupporterProfileForm) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profiles/supporter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create profile");

      await update({ roles: [...(session?.user.roles || []), "SUPPORTER"] });
      
      toast({
        title: "Profile Created",
        description: "Your supporter profile has been set up successfully!",
      });
      
      // Redirect to nonprofit onboarding
      router.push("/onboarding/nonprofit");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // ... (keep existing JSX)
}