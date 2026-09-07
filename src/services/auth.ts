"use client";

import { useUser } from "@clerk/nextjs";

export function useLoggedInUser() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return {
      user: null,
      isLoaded: false,
      isSignedIn: false,
    };
  }

  if (!isSignedIn || !user) {
    return {
      user: null,
      isLoaded: true,
      isSignedIn: false,
    };
  }

  return {
    user,
    isLoaded: true,
    isSignedIn: true,
  };
}