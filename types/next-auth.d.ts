import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    roles?: string[];
  }
  
  interface Session {
    user: User & {
      id: string;
      roles?: string[];
    };
  }
}