import Link from "next/link";
import {
  getCompanyById,
  getCompanyLocations,
  getCompanyOwnership,
  getCompanyFinancials,
  getCompanyPeople,
  getCompanySocialLinks,
} from "@/services/companyApi";

import type {
  Company,
  CompanyLocation,
  CompanyOwnership,
  CompanyFinancial,
  CompanyPerson,
  CompanySocialLink,
} from "@/types/company";

interface CompanyDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CompanyDetailsPage({
  params,
}: CompanyDetailsPageProps) {

  const { id } = await params;
  const companyId = Number(id);

  let company: Company | null = null;
  let locations: CompanyLocation[] = [];
  let ownership: CompanyOwnership[] = [];
  let financials: CompanyFinancial[] = [];
  let persons: CompanyPerson[] = [];
  let socialLinks: CompanySocialLink[] = [];

  try {
    company = await getCompanyById(companyId);

    locations = await getCompanyLocations(companyId);
    ownership = await getCompanyOwnership(companyId);
    financials = await getCompanyFinancials(companyId);
    persons = await getCompanyPeople(companyId);
    socialLinks = await getCompanySocialLinks(companyId);

  } catch (error) {
    console.error("Failed to load company details:", error);
  }

  if (!company) {
    return (
      <main className="min-h-screen px-6 py-8">

        <nav className="neo mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-8 py-5">

          <Link href="/" className="text-2xl font-bold">
            ComCon
          </Link>

          <Link
            href="/"
            className="neo-button rounded-2xl px-5 py-3"
          >
            Companies
          </Link>

        </nav>

        <div className="mx-auto mt-20 max-w-2xl">

          <div className="neo rounded-3xl p-10 text-center">

            <h2 className="text-3xl font-bold">
              Company Not Found
            </h2>

            <p className="mt-4 opacity-60">
              The requested company could not be found.
            </p>

            <Link
              href="/"
              className="neo-button mt-8 inline-block rounded-2xl px-6 py-3"
            >
              Back to Companies
            </Link>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-8">

      {/* Navbar */}
      <nav className="neo mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-8 py-5">

        <Link href="/" className="text-2xl font-bold">
          ComCon
        </Link>

        <div className="flex gap-4">

          <Link
            href="/"
            className="neo-button rounded-2xl px-5 py-3"
          >
            Companies
          </Link>

          <Link
            href="/about"
            className="neo-button rounded-2xl px-5 py-3"
          >
            About
          </Link>

        </div>

      </nav>


      {/* Back */}
      <div className="mx-auto mt-8 max-w-7xl">

        <Link
          href="/"
          className="inline-block opacity-60 hover:opacity-100"
        >
          ← Back to Companies
        </Link>

      </div>


      {/* Company Header */}
      <section className="mx-auto mt-10 max-w-7xl">

        <div className="neo rounded-3xl p-10">

          <div className="flex flex-col items-center gap-8 md:flex-row">

            {/* Logo */}
            <div className="neo-inset flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl">

              {company.logoUrl ? (

                <img
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  className="h-24 w-24 rounded-2xl object-contain"
                />

              ) : (

                <span className="text-5xl font-bold">
                  {company.name.charAt(0).toUpperCase()}
                </span>

              )}

            </div>


            {/* Company Title */}
            <div className="text-center md:text-left">

              <h2 className="text-4xl font-bold">
                {company.name}
              </h2>

              {company.industry && (
                <p className="mt-3 text-lg opacity-60">
                  {company.industry}
                </p>
              )}

              {company.headquarters && (
                <p className="mt-2 opacity-60">
                  📍 {company.headquarters}
                </p>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* Company Information */}
      <section className="mx-auto mt-10 max-w-7xl">

        <h3 className="mb-6 text-3xl font-bold">
          Company Information
        </h3>

        <div className="grid gap-8 md:grid-cols-2">

          {/* Description */}
          <div className="neo rounded-3xl p-8">

            <h4 className="text-xl font-bold">
              About the Company
            </h4>

            <p className="mt-4 leading-7 opacity-70">
              {company.description || "No description available."}
            </p>

          </div>


          {/* Details */}
          <div className="neo rounded-3xl p-8">

            <h4 className="text-xl font-bold">
              Details
            </h4>

            <div className="mt-5 space-y-4">

              <DetailItem
                label="Industry"
                value={company.industry}
              />

              <DetailItem
                label="Company Type"
                value={company.companyType}
              />

              <DetailItem
                label="Founded"
                value={
                  company.foundedYear
                    ? String(company.foundedYear)
                    : null
                }
              />

              <DetailItem
                label="Employees"
                value={
                  company.employeeCount
                    ? company.employeeCount.toLocaleString()
                    : null
                }
              />

              <DetailItem
                label="Headquarters"
                value={company.headquarters}
              />

              {company.website && (
                <div className="flex items-center justify-between gap-4">

                  <span className="opacity-60">
                    Website
                  </span>

                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline"
                  >
                    Visit Website
                  </a>

                </div>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* Locations */}
      <section className="mx-auto mt-12 max-w-7xl">

        <h3 className="mb-6 text-3xl font-bold">
          Locations
        </h3>

        {locations.length > 0 ? (

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {locations.map((location) => (

              <div
                key={location.id}
                className="neo rounded-3xl p-8"
              >

                <div className="neo-inset mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
                  📍
                </div>

                <h4 className="text-xl font-bold">
                  {location.locationType || "Location"}
                </h4>

                <p className="mt-4 opacity-70">
                  {location.address}
                </p>

                <p className="mt-2 opacity-60">
                  {location.city}
                  {location.state && `, ${location.state}`}
                </p>

                <p className="mt-1 opacity-60">
                  {location.country}
                  {location.postalCode &&
                    ` - ${location.postalCode}`}
                </p>

              </div>

            ))}

          </div>

        ) : (

          <EmptySection text="No location information available." />

        )}

      </section>


      {/* Financial Information */}
      <section className="mx-auto mt-12 max-w-7xl">

        <h3 className="mb-6 text-3xl font-bold">
          Financial Information
        </h3>

        {financials.length > 0 ? (

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {financials.map((financial) => (

              <div
                key={financial.id}
                className="neo rounded-3xl p-8"
              >

                <h4 className="text-xl font-bold">
                  {financial.financialYear}
                </h4>

                <div className="mt-6 space-y-5">

                  <FinancialItem
                    label="Revenue"
                    value={financial.revenue}
                    currency={financial.currency}
                  />

                  <FinancialItem
                    label="Profit"
                    value={financial.profit}
                    currency={financial.currency}
                  />

                  <FinancialItem
                    label="Market Cap"
                    value={financial.marketCap}
                    currency={financial.currency}
                  />

                </div>

              </div>

            ))}

          </div>

        ) : (

          <EmptySection text="No financial information available." />

        )}

      </section>


      {/* Ownership */}
      <section className="mx-auto mt-12 max-w-7xl">

        <h3 className="mb-6 text-3xl font-bold">
          Ownership
        </h3>

        {ownership.length > 0 ? (

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {ownership.map((owner) => (

              <div
                key={owner.id}
                className="neo rounded-3xl p-8"
              >

                <div className="neo-inset mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
                  👤
                </div>

                <h4 className="text-xl font-bold">
                  {owner.ownerName}
                </h4>

                {owner.ownerType && (
                  <p className="mt-2 opacity-60">
                    {owner.ownerType}
                  </p>
                )}

                {owner.ownershipPercentage !== null && (
                  <p className="mt-5 text-2xl font-bold">
                    {owner.ownershipPercentage}%
                  </p>
                )}

                <p className="mt-1 text-sm opacity-50">
                  Ownership
                </p>

              </div>

            ))}

          </div>

        ) : (

          <EmptySection text="No ownership information available." />

        )}

      </section>


      {/* People */}
      <section className="mx-auto mt-12 max-w-7xl">

        <h3 className="mb-6 text-3xl font-bold">
          People
        </h3>

        {persons.length > 0 ? (

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {persons.map((person) => (

              <div
                key={person.id}
                className="neo rounded-3xl p-8"
              >

                <div className="neo-inset mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
                  👤
                </div>

                <h4 className="text-xl font-bold">
                  {person.name}
                </h4>

                {person.role && (
                  <p className="mt-2 opacity-60">
                    {person.role}
                  </p>
                )}

                {person.bio && (
                  <p className="mt-4 leading-6 opacity-70">
                    {person.bio}
                  </p>
                )}

                {person.linkedinUrl && (
                  <a
                    href={person.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-button mt-6 inline-block rounded-2xl px-5 py-3"
                  >
                    LinkedIn
                  </a>
                )}

              </div>

            ))}

          </div>

        ) : (

          <EmptySection text="No people information available." />

        )}

      </section>


      {/* Social Links */}
      <section className="mx-auto mb-16 mt-12 max-w-7xl">

        <h3 className="mb-6 text-3xl font-bold">
          Social Links
        </h3>

        {socialLinks.length > 0 ? (

          <div className="flex flex-wrap gap-6">

            {socialLinks.map((social) => (

              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-button rounded-2xl px-6 py-4 font-semibold"
              >
                {social.platform || "Social Link"}
              </a>

            ))}

          </div>

        ) : (

          <EmptySection text="No social links available." />

        )}

      </section>

    </main>
  );
}


/* -------------------------------- */
/* Reusable Components               */
/* -------------------------------- */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="opacity-60">
        {label}
      </span>

      <span className="text-right font-semibold">
        {value || "Not available"}
      </span>

    </div>
  );
}


function FinancialItem({
  label,
  value,
  currency,
}: {
  label: string;
  value: number | null;
  currency: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="opacity-60">
        {label}
      </span>

      <span className="font-semibold">
        {value !== null
          ? `${currency || ""} ${value.toLocaleString()}`
          : "Not available"}
      </span>

    </div>
  );
}


function EmptySection({
  text,
}: {
  text: string;
}) {
  return (
    <div className="neo rounded-3xl p-8 text-center">

      <p className="opacity-60">
        {text}
      </p>

    </div>
  );
}