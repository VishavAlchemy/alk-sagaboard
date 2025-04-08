'use client';
import localFont from "next/font/local";
import './globals.css'
import { useQuery } from "convex/react";
import { useMutation } from "convex/react";
import { ConvexReactClient } from "convex/react";
import { useEffect } from "react";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import { Geist_Sans } from "./components/fonts";




function UserSync() {
  const { user } = useUser();
  const storeUser = useMutation(api.users.store);
  const checkUser = useQuery(api.users.checkUser, { clerkId: user?.id ?? "" });

  useEffect(() => {
    if (!user || checkUser !== null) return;

    storeUser({
      name: user.fullName ?? "",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      clerkId: user.id,
      avatarUrl: user.imageUrl,
    });
  }, [user, storeUser, checkUser]);

  return null;
}
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${Geist_Sans.className} antialiased`}
      >
        <ClerkProvider>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
              <UserSync />
              <Navbar />
              {children}
          </ConvexProviderWithClerk>
        </ClerkProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
