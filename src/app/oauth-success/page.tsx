"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch(
          "http://localhost:8082/api/auth/me",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        console.log(
          "OAuth /api/auth/me status:",
          response.status
        );

        if (!response.ok) {

          const errorText =
            await response.text();

          console.error(
            "Backend response:",
            errorText
          );

          throw new Error(
            `Unable to get user (${response.status})`
          );
        }

        const user = await response.json();

        console.log(
          "OAuth logged in user:",
          user
        );

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        /*
         * This is only a frontend flag.
         *
         * It must NOT be used as a Basic
         * authentication credential.
         */
        localStorage.setItem(
          "auth",
          "true"
        );

        if (user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }

      } catch (error) {

        console.error(
          "OAuth login failed:",
          error
        );

        localStorage.removeItem("auth");
        localStorage.removeItem("user");

        router.push("/login");
      }
    }

    getUser();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">

      <div className="neo rounded-3xl p-10 text-center">

        <p className="text-lg font-semibold">
          Completing login...
        </p>

        <p className="mt-2 opacity-60">
          Please wait.
        </p>

      </div>

    </main>
  );
}