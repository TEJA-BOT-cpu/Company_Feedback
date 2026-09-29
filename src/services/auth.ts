"use client";

export function useLoggedInUser() {
  return {
    user: null,
    isLoaded: true,
    isSignedIn: false,
  };
}