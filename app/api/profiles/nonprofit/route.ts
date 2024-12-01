import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/db";
import { z } from "zod";

const nonprofitProfileSchema = z.object({
  logo: z.string().optional(),
  bannerImage: z.string().optional(),
  organizationName: z.string().min(2),
  description: z.string().min(50),
  taxId: z.string().regex(/^\d{2}-\d{7}$/),
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
    const data = nonprofitProfileSchema.parse(json);

    // Check if Tax ID is unique
    const { data: existingNonprofit } = await supabase
      .from("nonprofit_profiles")
      .select("id")
      .eq("tax_id", data.taxId)
      .single();

    if (existingNonprofit) {
      return NextResponse.json(
        { error: "Tax ID already registered", code: "TAX_ID_EXISTS" },
        { status: 400 }
      );
    }

    // Create nonprofit profile
    const { error: profileError } = await supabase
      .from("nonprofit_profiles")
      .insert({
        user_id: session.user.id,
        logo_url: data.logo,
        banner_url: data.bannerImage,
        organization_name: data.organizationName,
        description: data.description,
        tax_id: data.taxId,
        categories: data.categories,
        contact_info: data.contact,
        address: data.address,
        location: data.location,
      });

    if (profileError) throw profileError;

    // Add nonprofit role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({
        user_id: session.user.id,
        role: "NONPROFIT",
      });

    if (roleError) throw roleError;

    return NextResponse.json(
      { message: "Nonprofit profile created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Failed to create nonprofit profile" },
      { status: 500 }
    );
  }
}