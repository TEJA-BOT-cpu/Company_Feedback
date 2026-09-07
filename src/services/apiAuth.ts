"use client";

import { useAuth } from "@clerk/nextjs";

export function useAuthenticatedFetch() {
  const { getToken, isSignedIn } = useAuth();

  async function authenticatedFetch(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {

    if (!isSignedIn) {
      throw new Error("Not authenticated");
    }

    const token = await getToken();

    if (!token) {
      throw new Error("Unable to get authentication token");
    }

    const headers = new Headers(options.headers);

    // Clerk authentication
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );

    if (
      options.body &&
      !headers.has("Content-Type")
    ) {
      headers.set(
        "Content-Type",
        "application/json"
      );
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }

  return authenticatedFetch;
}