"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="neo mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-8 py-5">
      
      <h1 className="text-2xl font-bold">
        ComCon
      </h1>

      <button
        onClick={() => router.push("/admin")}
        className="neo-button rounded-2xl px-5 py-3 font-semibold"
      >
        Admin
      </button>

    </nav>
  );
}