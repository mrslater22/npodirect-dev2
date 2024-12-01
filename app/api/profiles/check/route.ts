import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check all profiles for the user
    const [supporterProfile, nonprofitProfile, sponsorProfile] = await Promise.all([
      supabase
        .from("supporter_profiles")
        .select("id")
        .eq("user_id", session.user.id)
        .single(),
      supabase
        .from("nonprofit_profiles")
        .select("id")
        .eq("user_id", session.user.id)
        .single(),
      supabase
        .from("sponsor_profiles")
        .select("id")
        .eq("user_id", session.user.id)
        .single(),
    ]);

    return NextResponse.json({
      profiles: {
        supporter: !supporterProfile.error,
        nonprofit: !nonprofitProfile.error,
        sponsor: !sponsorProfile.error,
      },
    });
  } catch (error) {
    console.error("Profile check error:", error);
    return NextResponse.json(
      { error: "Failed to check profiles" },
      { status: 500 }
    );
  }
}