import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/db";
import { z } from "zod";

const supporterProfileSchema = z.object({
  avatar: z.string().optional(),
  location: z.object({
    city: z.string(),
    state: z.string(),
    country: z.string(),
  }),
  ageGroup: z.enum(["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]),
  interests: z.object({
    food: z.array(z.string()),
    shopping: z.array(z.string()),
    sports: z.array(z.string()),
    activities: z.array(z.string()),
    entertainment: z.array(z.string()),
    hobbies: z.array(z.string()),
  }),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const data = supporterProfileSchema.parse(json);

    // Create supporter profile
    const { error: profileError } = await supabase
      .from("supporter_profiles")
      .insert({
        user_id: session.user.id,
        location: data.location,
        age_group: data.ageGroup,
        interests: {
          food: data.interests.food,
          shopping: data.interests.shopping,
          sports: data.interests.sports,
          activities: data.interests.activities,
          entertainment: data.interests.entertainment,
          hobbies: data.interests.hobbies,
        },
      });

    if (profileError) throw profileError;

    // Add supporter role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({
        user_id: session.user.id,
        role: "SUPPORTER",
      });

    if (roleError) throw roleError;

    return NextResponse.json(
      { message: "Supporter profile created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Failed to create supporter profile" },
      { status: 500 }
    );
  }
}