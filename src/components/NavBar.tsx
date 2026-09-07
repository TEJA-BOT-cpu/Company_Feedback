"use client";

import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="neo mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-8 py-5">
      
      <h1 className="text-2xl font-bold">
        ComCon
      </h1>

      <div className="flex items-center gap-4">

        <SignedOut>
          <button
            onClick={() => router.push("/login")}
            className="neo-button rounded-2xl px-5 py-3"
          >
            Sign In
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="neo-button rounded-2xl px-5 py-3"
          >
            Sign Up
          </button>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>

      </div>
    </nav>
  );
}