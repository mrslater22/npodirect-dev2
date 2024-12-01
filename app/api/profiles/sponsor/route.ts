import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/db";
import { z } from "zod";

const sponsorProfileSchema = z.object({
  logo: z.string().optional(),
  bannerImage: z.string().optional(),
  companyName: z.string().min(2),
  description: z.string().min(50),
  categories: z.array(z.string()).min(1),
  contact: z.object({
    email: z.string().email(),
    phone: z.string(),
    website: z.string().url().optional(),
  }),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const data = sponsorProfileSchema.parse(json);

    // Create sponsor profile
    const { error: profileError } = await supabase
      .from("sponsor_profiles")
      .insert({
        user_id: session.user.id,
        logo_url: data.logo,
        banner_url: data.bannerImage,
        company_name: data.companyName,
        description: data.description,
        categories: data.categories,
        contact_info: data.contact,
        address: data.address,
        location: data.location,
      });

    if (profileError) throw profileError;

    // Add sponsor role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({
        user_id: session.user.id,
        role: "SPONSOR",
      });

    if (roleError) throw roleError;

    return NextResponse.json(
      { message: "Business sponsor profile created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Failed to create business sponsor profile" },
      { status: 500 }
    );
  }
}