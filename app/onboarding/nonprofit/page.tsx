"use client";

// ... (keep existing imports)

export default function NonprofitOnboarding() {
  // ... (keep existing state and form setup)

  async function onSubmit(data: NonprofitProfileForm) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profiles/nonprofit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create profile");

      await update({ roles: [...(session?.user.roles || []), "NONPROFIT"] });
      
      toast({
        title: "Profile Created",
        description: "Your nonprofit profile has been set up successfully!",
      });
      
      // Redirect to sponsor onboarding
      router.push("/onboarding/sponsor");
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

  return (
    <div className="max-w-2xl mx-auto">
      {/* ... (keep existing form JSX) ... */}
      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/onboarding/sponsor")}
        >
          Skip
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Profile..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}