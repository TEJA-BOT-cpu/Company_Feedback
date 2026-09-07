"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  getCompanies,
  deleteCompany,
} from "@/services/companyApi";

import type { Company } from "@/types/company";

export default function AdminPage() {
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadCompanies() {
      try {
        // Check logged-in user
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          router.push("/login");
          return;
        }

        const user = JSON.parse(storedUser);

        // Only ADMIN can access this page
        if (user.role !== "ADMIN") {
          router.push("/");
          return;
        }

        // Get companies
        const data = await getCompanies();

        setCompanies(data);

      } catch (error) {
        console.error(error);
        setError("Unable to load companies.");
      } finally {
        setLoading(false);
      }
    }

    loadCompanies();
  }, [router]);


  // ==========================================
  // LOGOUT
  // ==========================================

  function handleLogout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");

    router.push("/login");
  }


  // ==========================================
  // DELETE COMPANY
  // ==========================================

  async function handleDeleteCompany(
    companyId: number,
    companyName: string
  ) {

    const confirmed = window.confirm(
      `Are you sure you want to delete "${companyName}"?\n\n` +
      "This will permanently delete:\n" +
      "• Company information\n" +
      "• Locations\n" +
      "• Ownership records\n" +
      "• Financial records\n" +
      "• Persons\n" +
      "• Social links\n\n" +
      "This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {

      setError("");
      setDeletingId(companyId);

      // Delete company from database
      // Backend also deletes all related data
      await deleteCompany(companyId);

      // Remove company from UI
      setCompanies((currentCompanies) =>
        currentCompanies.filter(
          (company) => company.id !== companyId
        )
      );

    } catch (error) {

      console.error(
        "Failed to delete company:",
        error
      );

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to delete company.");
      }

    } finally {

      setDeletingId(null);

    }
  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-8">

        <div className="neo mx-auto max-w-7xl rounded-3xl p-10 text-center">

          <p className="text-lg opacity-70">
            Loading admin dashboard...
          </p>

        </div>

      </main>
    );
  }


  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen px-6 py-8">

    {/* Navbar */}
  <nav className="neo mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-8 py-5">

    <Link
      href="/"
      className="text-2xl font-bold"
    >
      ComCon
    </Link>


    <div className="flex items-center gap-4">

      {/* Home */}
      <button
        onClick={() => router.push("/")}
        className="neo-button rounded-2xl px-5 py-3"
      >
        Home
      </button>

      {/* Admin */}
      <span className="rounded-2xl px-5 py-3 opacity-70">
        Admin
      </span>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="neo-button rounded-2xl px-5 py-3"
      >
        Logout
      </button>

    </div>

  </nav>


      {/* Heading */}
      <section className="mx-auto mt-16 max-w-7xl">

        <h2 className="text-5xl font-bold tracking-tight">
          Admin Dashboard
        </h2>

        <p className="mt-4 text-lg opacity-70">
          Manage companies and company information.
        </p>

      </section>


      {/* Companies section */}
      <section className="mx-auto mt-14 max-w-7xl">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h3 className="text-3xl font-bold">
              Companies
            </h3>

            <p className="mt-2 opacity-60">
              {companies.length} companies
            </p>

          </div>


          <button
            onClick={() =>
              router.push(
                "/admin/companies/create"
              )
            }
            className="neo-button rounded-2xl px-6 py-3 font-semibold"
          >
            + Create Company
          </button>

        </div>


        {/* Error */}
        {error && (
          <div className="neo rounded-3xl p-6 text-center text-red-500">
            {error}
          </div>
        )}


        {/* Companies */}
        {!error && companies.length > 0 && (

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {companies.map((company) => (

              <div
                key={company.id}
                className="neo rounded-3xl p-8"
              >

                {/* Logo */}
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl neo-inset">

                  {company.logoUrl ? (

                    <img
                      src={company.logoUrl}
                      alt={`${company.name} logo`}
                      className="h-14 w-14 rounded-xl object-contain"
                    />

                  ) : (

                    <span className="text-2xl font-bold">
                      {company.name.charAt(0)}
                    </span>

                  )}

                </div>


                {/* Company name */}
                <h4 className="text-xl font-bold">
                  {company.name}
                </h4>


                {/* Industry */}
                {company.industry && (
                  <p className="mt-2 opacity-60">
                    {company.industry}
                  </p>
                )}


                {/* Headquarters */}
                {company.headquarters && (
                  <p className="mt-1 opacity-60">
                    {company.headquarters}
                  </p>
                )}


                {/* Description */}
                {company.description && (
                  <p className="mt-4 line-clamp-3 text-sm opacity-60">
                    {company.description}
                  </p>
                )}


                {/* Buttons */}
                <div className="mt-7 flex gap-3">

                  {/* UPDATE */}
                  <button
                    onClick={() =>
                      router.push(
                        `/admin/companies/${company.id}/edit`
                      )
                    }
                    className="neo-button flex-1 rounded-2xl px-4 py-3 font-semibold"
                  >
                    Update
                  </button>


                  {/* DELETE */}
                  <button
                    onClick={() =>
                      handleDeleteCompany(
                        company.id,
                        company.name
                      )
                    }
                    disabled={
                      deletingId === company.id
                    }
                    className="neo-button flex-1 rounded-2xl px-4 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === company.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}


        {/* No companies */}
        {!error && companies.length === 0 && (

          <div className="neo rounded-3xl p-12 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl neo-inset">
              🏢
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              No Companies
            </h3>

            <p className="mt-3 opacity-60">
              Create your first company to get started.
            </p>

            <button
              onClick={() =>
                router.push(
                  "/admin/companies/create"
                )
              }
              className="neo-button mt-7 rounded-2xl px-6 py-3 font-semibold"
            >
              + Create Company
            </button>

          </div>

        )}

      </section>

    </main>
  );
}