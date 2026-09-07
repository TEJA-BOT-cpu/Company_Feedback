"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <SignUp
        routing="path"
        path="/signup"
        signInUrl="/login"
      />
    </main>
  );
}