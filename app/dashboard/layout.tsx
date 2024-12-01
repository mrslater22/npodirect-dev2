import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/db";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  // Check if user has a supporter profile
  const { data: supporterProfile } = await supabase
    .from("supporter_profiles")
    .select("id")
    .eq("user_id", session.user.id)
    .single();

  // Redirect to supporter onboarding if no profile exists
  if (!supporterProfile) {
    redirect("/onboarding/supporter");
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}