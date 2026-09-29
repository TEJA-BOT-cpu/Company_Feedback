"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Company } from "@/types/company";

interface CompanySearchProps {
  companies: Company[];
}

interface RecentSearch {
  text: string;
  timestamp: number;
}

const MAX_RECENT_SEARCHES = 5;
const SEARCH_EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes

export default function CompanySearch({
  companies,
}: CompanySearchProps) {
  const [search, setSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  // Load recent searches
  useEffect(() => {
    const stored = localStorage.getItem("ccon_recent_searches");

    if (!stored) return;

    try {
      const searches: RecentSearch[] = JSON.parse(stored);

      const now = Date.now();

      // Remove searches older than 30 minutes
      const validSearches = searches.filter(
        (item) => now - item.timestamp < SEARCH_EXPIRY_TIME
      );

      setRecentSearches(validSearches);

      localStorage.setItem(
        "ccon_recent_searches",
        JSON.stringify(validSearches)
      );
    } catch {
      localStorage.removeItem("ccon_recent_searches");
    }
  }, []);

  const saveRecentSearch = (value: string) => {
    const searchText = value.trim();

    if (!searchText) return;

    const now = Date.now();

    // Remove duplicate searches
    const updatedSearches = recentSearches.filter(
      (item) => item.text.toLowerCase() !== searchText.toLowerCase()
    );

    // Add new search at the beginning
    const newSearches = [
      {
        text: searchText,
        timestamp: now,
      },
      ...updatedSearches,
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(newSearches);

    localStorage.setItem(
      "ccon_recent_searches",
      JSON.stringify(newSearches)
    );
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("ccon_recent_searches");
  };

  const removeRecentSearch = (text: string) => {
    const updatedSearches = recentSearches.filter(
      (item) => item.text !== text
    );

    setRecentSearches(updatedSearches);

    localStorage.setItem(
      "ccon_recent_searches",
      JSON.stringify(updatedSearches)
    );
  };

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
      <div className="relative mx-auto mt-10 max-w-3xl">
        <div className="neo-inset flex items-center rounded-3xl px-6 py-4">
          <span className="mr-4 text-xl">🔍</span>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onFocus={() => setShowRecent(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                saveRecentSearch(search);
                setShowRecent(false);
              }
            }}
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

        {/* Recent Searches */}
        {showRecent && !search && recentSearches.length > 0 && (
          <div className="neo absolute left-0 right-0 top-full z-20 mt-3 rounded-3xl p-4">
            <div className="mb-3 flex items-center justify-between px-2">
              <p className="text-sm font-semibold opacity-60">
                Recent searches
              </p>

              <button
                onClick={clearRecentSearches}
                className="text-xs opacity-50 transition hover:opacity-100"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-1">
              {recentSearches.map((item) => (
                <div
                  key={item.timestamp}
                  className="flex items-center justify-between rounded-2xl px-4 py-3 transition hover:bg-black/5"
                >
                  <button
                    onClick={() => {
                      setSearch(item.text);
                      setShowRecent(false);
                    }}
                    className="flex flex-1 items-center text-left"
                  >
                    <span className="mr-3 opacity-50">🕘</span>
                    <span>{item.text}</span>
                  </button>

                  <button
                    onClick={() => removeRecentSearch(item.text)}
                    className="ml-3 opacity-40 transition hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <p className="mt-3 px-2 text-xs opacity-40">
              Recent searches are kept for 30 minutes.
            </p>
          </div>
        )}
      </div>

      {/* Search Result Count */}
      {search && (
        <p className="mt-5 text-center text-sm opacity-60">
          {filteredCompanies.length}{" "}
          {filteredCompanies.length === 1 ? "company" : "companies"} found
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