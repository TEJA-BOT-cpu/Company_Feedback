import Link from "next/link";
import { getCompanies } from "@/services/companyApi";
import type { Company } from "@/types/company";
import CompanySearch from "@/components/CompanySearch";
import Navbar from "@/components/NavBar";

export default async function Home() {
  let companies: Company[] = [];

  try {
    companies = await getCompanies();
  } catch (error) {
    console.error("Failed to fetch companies:", error);
  }

  return (
    <main className="min-h-screen px-6 py-8">

      {/* Navbar */}
      <Navbar/>


      {/* Hero */}
      <section className="mx-auto mt-16 max-w-5xl text-center">

        <h2 className="text-5xl font-bold tracking-tight">
          Discover Companies
        </h2>

        <p className="mt-5 text-lg opacity-70">
          Explore companies and make better career decisions.
        </p>

        {/* Search */}
        <CompanySearch companies={companies} />

      </section>


      {/* Company Section */}
      <section className="mx-auto mt-20 max-w-7xl">

        <div className="mb-8 flex items-center justify-between">

          <h3 className="text-3xl font-bold">
            Companies
          </h3>

          <button className="neo-button rounded-2xl px-6 py-3">
            View All
          </button>

        </div>


        {/* Companies from Backend */}
        {companies.length > 0 ? (

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {companies.map((company) => (

              <div
                key={company.id}
                className="neo rounded-3xl p-8"
              >

                {/* Company Logo / Initial */}
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl neo-inset">

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


                {/* Company Name */}
                <h4 className="text-xl font-bold">
                  {company.name}
                </h4>


                {/* Industry */}
                <p className="mt-2 opacity-60">
                  {company.industry || "Industry not available"}
                </p>


                {/* Headquarters */}
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

        ) : (

          /* No Companies */
          <div className="neo rounded-3xl p-10 text-center">

            <h4 className="text-xl font-bold">
              No companies found
            </h4>

            <p className="mt-3 opacity-60">
              Add companies through the backend and refresh the page.
            </p>

          </div>

        )}

      </section>

    </main>
  );
}