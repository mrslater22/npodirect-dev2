import { NextResponse } from "next/server";
import { createSupporter } from "@/lib/auth";
import { z } from "zod";

const baseSchema = {
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
};

const nonprofitSchema = z.object({
  ...baseSchema,
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  mission: z.string().min(10, "Mission statement must be at least 10 characters"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  role: z.literal("NONPROFIT"),
});

const supporterSchema = z.object({
  ...baseSchema,
  interests: z.string().min(10, "Please describe your interests"),
  role: z.literal("SUPPORTER"),
});

const sponsorSchema = z.object({
  ...baseSchema,
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  role: z.literal("SPONSOR"),
});

const registerSchema = z.discriminatedUnion("role", [
  nonprofitSchema,
  supporterSchema,
  sponsorSchema,
]);

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = registerSchema.parse(json);

    const supporter = await createSupporter(body);

    return NextResponse.json(
      { 
        message: "Registration successful",
        supporterId: supporter.id,
        role: supporter.role
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: "Validation failed", 
          errors: error.errors.map(e => ({
            path: e.path.join("."),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}