"use client";

import { useState } from "react";
import Link from "next/link";
import type { Company } from "@/types/company";

interface CompanySearchProps {
  companies: Company[];
}

export default function CompanySearch({
  companies,
}: CompanySearchProps) {
  const [search, setSearch] = useState("");

  const filteredCompanies = companies.filter((company) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      company.name?.toLowerCase().includes(searchText) ||
      company.industry?.toLowerCase().includes(searchText) ||
      company.companyType?.toLowerCase().includes(searchText) ||
      company.headquarters?.toLowerCase().includes(searchText) ||
      company.description?.toLowerCase().includes(searchText)
    );
  });

  return (
    <>
      {/* Search */}
      <div className="neo-inset mx-auto mt-10 flex max-w-3xl items-center rounded-3xl px-6 py-4">

        <span className="mr-4 text-xl">
          🔍
        </span>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search companies..."
          className="w-full bg-transparent text-lg outline-none"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="ml-4 opacity-50 transition hover:opacity-100"
          >
            ✕
          </button>
        )}

      </div>


      {/* Search Result Count */}
      {search && (
        <p className="mt-5 text-center text-sm opacity-60">
          {filteredCompanies.length}{" "}
          {filteredCompanies.length === 1
            ? "company"
            : "companies"}{" "}
          found
        </p>
      )}


      {/* Companies */}
      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {filteredCompanies.map((company) => (

          <div
            key={company.id}
            className="neo rounded-3xl p-8"
          >

            {/* Logo */}
            <div className="neo-inset mb-6 flex h-20 w-20 items-center justify-center rounded-2xl">

              {company.logoUrl ? (

                <img
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  className="h-14 w-14 rounded-xl object-contain"
                />

              ) : (

                <span className="text-2xl font-bold">
                  {company.name.charAt(0).toUpperCase()}
                </span>

              )}

            </div>


            {/* Name */}
            <h4 className="text-xl font-bold">
              {company.name}
            </h4>


            {/* Industry */}
            <p className="mt-2 opacity-60">
              {company.industry || "Industry not available"}
            </p>


            {/* Location */}
            <p className="mt-1 opacity-60">
              {company.headquarters || "Location not available"}
            </p>


            {/* Description */}
            {company.description && (
              <p className="mt-4 line-clamp-2 text-sm opacity-60">
                {company.description}
              </p>
            )}


            {/* View Company */}
            <Link
              href={`/companies/${company.id}`}
              className="neo-button mt-6 inline-block rounded-2xl px-5 py-3"
            >
              View Company
            </Link>

          </div>

        ))}

      </div>


      {/* No Results */}
      {search && filteredCompanies.length === 0 && (
        <div className="neo mx-auto mt-10 max-w-2xl rounded-3xl p-10 text-center">

          <div className="neo-inset mx-auto flex h-20 w-20 items-center justify-center rounded-2xl text-2xl">
            🔍
          </div>

          <h3 className="mt-6 text-xl font-bold">
            No companies found
          </h3>

          <p className="mt-3 opacity-60">
            Try searching with a different company name,
            industry, or location.
          </p>

        </div>
      )}
    </>
  );
}