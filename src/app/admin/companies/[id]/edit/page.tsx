"use client";



import {
  useEffect,
  useState,
  type SyntheticEvent,
} from "react";

import { useParams, useRouter } from "next/navigation";

import {
  getCompanyById,
  getCompanyLocations,
  getCompanyOwnership,
  getCompanyFinancials,
  getCompanyPeople,
  getCompanySocialLinks,
  updateCompany,
  updateCompanyLocation,
  updateCompanyOwnership,
  updateCompanyFinancial,
  updateCompanyPerson,
  updateCompanySocialLink,
} from "@/services/companyApi";

import type {
  Company,
  CompanyLocation,
  CompanyOwnership,
  CompanyFinancial,
  CompanyPerson,
  CompanySocialLink,
} from "@/types/company";

import {
  // existing imports...
  deleteCompanyLocation,
  deleteCompanyOwnership,
  deleteCompanyFinancial,
  deleteCompanyPerson,
  deleteCompanySocialLink,
} from "@/services/companyApi";


// ============================================================
// EMPTY FORM OBJECTS
// ============================================================

const emptyLocation: Partial<CompanyLocation> = {
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  locationType: "",
};

const emptyOwnership: Partial<CompanyOwnership> = {
  ownerName: "",
  ownerType: "",
  ownershipPercentage: null,
};

const emptyFinancial: Partial<CompanyFinancial> = {
  financialYear: "",
  revenue: null,
  profit: null,
  marketCap: null,
  currency: "",
};

const emptyPerson: Partial<CompanyPerson> = {
  name: "",
  role: "",
  bio: "",
  linkedinUrl: "",
};

const emptySocialLink: Partial<CompanySocialLink> = {
  platform: "",
  url: "",
};


// ============================================================
// PAGE
// ============================================================

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();

  const companyId = Number(params.id);


  // ==========================================================
  // STATE
  // ==========================================================

  const [company, setCompany] =
    useState<Company | null>(null);

  const [locations, setLocations] =
    useState<CompanyLocation[]>([]);

  const [ownership, setOwnership] =
    useState<CompanyOwnership[]>([]);

  const [financials, setFinancials] =
    useState<CompanyFinancial[]>([]);

  const [people, setPeople] =
    useState<CompanyPerson[]>([]);

  const [socialLinks, setSocialLinks] =
    useState<CompanySocialLink[]>([]);


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================================
  // LOAD COMPANY
  // ==========================================================

  useEffect(() => {

    async function loadCompany() {

      try {

        setLoading(true);
        setError("");

        const storedUser =
          localStorage.getItem("user");

        const auth =
          localStorage.getItem("auth");

        if (!storedUser || !auth) {
          router.push("/login");
          return;
        }

        const user =
          JSON.parse(storedUser);

        if (user.role !== "ADMIN") {
          router.push("/");
          return;
        }


        const [
          companyData,
          locationData,
          ownershipData,
          financialData,
          peopleData,
          socialData,
        ] = await Promise.all([
          getCompanyById(companyId),
          getCompanyLocations(companyId),
          getCompanyOwnership(companyId),
          getCompanyFinancials(companyId),
          getCompanyPeople(companyId),
          getCompanySocialLinks(companyId),
        ]);


        setCompany(companyData);
        setLocations(locationData);
        setOwnership(ownershipData);
        setFinancials(financialData);
        setPeople(peopleData);
        setSocialLinks(socialData);

      } catch (err) {

        console.error(err);

        setError(
          "Unable to load company information."
        );

      } finally {

        setLoading(false);

      }
    }


    if (
      companyId &&
      !Number.isNaN(companyId)
    ) {
      loadCompany();
    }

  }, [companyId, router]);


  // ==========================================================
  // COMPANY UPDATE
  // ==========================================================

  function updateCompanyField(
    field: keyof Company,
    value: string | number | null
  ) {

    if (!company) return;

    setCompany({
      ...company,
      [field]: value,
    });
  }


  // ==========================================================
  // LOCATION FUNCTIONS
  // ==========================================================

  function addLocation() {

    setLocations((current) => [
      ...current,
      {
        id: 0,
        company: company as Company,
        ...emptyLocation,
      } as CompanyLocation,
    ]);
  }


async function removeLocation(index: number) {
  const location = locations[index];

  try {
    // Existing database record
    if (location.id > 0) {
      await deleteCompanyLocation(
        companyId,
        location.id
      );
    }

    // Remove from UI
    setLocations((current) =>
      current.filter((_, i) => i !== index)
    );
  } catch (error) {
    console.error("Failed to delete location:", error);
    setError("Failed to delete location");
  }
}


  function updateLocation(
    index: number,
    field: keyof CompanyLocation,
    value: string
  ) {

    setLocations((current) =>
      current.map((location, i) =>
        i === index
          ? {
              ...location,
              [field]: value,
            }
          : location
      )
    );

  }


  // ==========================================================
  // OWNERSHIP FUNCTIONS
  // ==========================================================

  function addOwnership() {

    setOwnership((current) => [
      ...current,
      {
        id: 0,
        company: company as Company,
        ...emptyOwnership,
      } as CompanyOwnership,
    ]);

  }


    async function removeOwnership(index: number) {
    const owner = ownership[index];

    try {
        if (owner.id > 0) {
        await deleteCompanyOwnership(
            companyId,
            owner.id
        );
        }

        setOwnership((current) =>
        current.filter((_, i) => i !== index)
        );
    } catch (error) {
        console.error("Failed to delete ownership:", error);
        setError("Failed to delete ownership");
    }
    }


  function updateOwnership(
    index: number,
    field: keyof CompanyOwnership,
    value: string | number | null
  ) {

    setOwnership((current) =>
      current.map((owner, i) =>
        i === index
          ? {
              ...owner,
              [field]: value,
            }
          : owner
      )
    );

  }


  // ==========================================================
  // FINANCIAL FUNCTIONS
  // ==========================================================

  function addFinancial() {

    setFinancials((current) => [
      ...current,
      {
        id: 0,
        company: company as Company,
        ...emptyFinancial,
      } as CompanyFinancial,
    ]);

  }


    async function removeFinancial(index: number) {
    const financial = financials[index];

    try {
        if (financial.id > 0) {
        await deleteCompanyFinancial(companyId,financial.id);
        }

        setFinancials((current) =>
        current.filter((_, i) => i !== index)
        );
    } catch (error) {
        console.error("Failed to delete financial:", error);
        setError("Failed to delete financial information");
    }
    }


  function updateFinancialField(
    index: number,
    field: keyof CompanyFinancial,
    value: string | number | null
  ) {

    setFinancials((current) =>
      current.map((financial, i) =>
        i === index
          ? {
              ...financial,
              [field]: value,
            }
          : financial
      )
    );

  }


  // ==========================================================
  // PEOPLE FUNCTIONS
  // ==========================================================

  function addPerson() {

    setPeople((current) => [
      ...current,
      {
        id: 0,
        company: company as Company,
        ...emptyPerson,
      } as CompanyPerson,
    ]);

  }


    async function removePerson(index: number) {
    const person = people[index];

    try {
        if (person.id > 0) {
        await deleteCompanyPerson(companyId,person.id);
        }

        setPeople((current) =>
        current.filter((_, i) => i !== index)
        );
    } catch (error) {
        console.error("Failed to delete person:", error);
        setError("Failed to delete person");
    }
    }


  function updatePerson(
    index: number,
    field: keyof CompanyPerson,
    value: string
  ) {

    setPeople((current) =>
      current.map((person, i) =>
        i === index
          ? {
              ...person,
              [field]: value,
            }
          : person
      )
    );

  }


  // ==========================================================
  // SOCIAL LINK FUNCTIONS
  // ==========================================================

  function addSocialLink() {

    setSocialLinks((current) => [
      ...current,
      {
        id: 0,
        company: company as Company,
        ...emptySocialLink,
      } as CompanySocialLink,
    ]);

  }


    async function removeSocialLink(index: number) {
    const socialLink = socialLinks[index];

    try {
        if (socialLink.id > 0) {
        await deleteCompanySocialLink(companyId,socialLink.id);
        }

        setSocialLinks((current) =>
        current.filter((_, i) => i !== index)
        );
    } catch (error) {
        console.error("Failed to delete social link:", error);
        setError("Failed to delete social link");
    }
    }


  function updateSocialLink(
    index: number,
    field: keyof CompanySocialLink,
    value: string
  ) {

    setSocialLinks((current) =>
      current.map((social, i) =>
        i === index
          ? {
              ...social,
              [field]: value,
            }
          : social
      )
    );

  }


  // ==========================================================
  // SUBMIT
  // ==========================================================

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    if (!company) return;

    try {

      setSaving(true);
      setError("");


      const auth =
        localStorage.getItem("auth");

      const storedUser =
        localStorage.getItem("user");


      if (!auth || !storedUser) {
        router.push("/login");
        return;
      }


      const user =
        JSON.parse(storedUser);


      if (user.role !== "ADMIN") {
        router.push("/");
        return;
      }


      // ======================================================
      // 1. UPDATE COMPANY
      // ======================================================

      await updateCompany(
        companyId,
        {
          name: company.name,
          description: company.description,
          industry: company.industry,
          companyType: company.companyType,
          foundedYear: company.foundedYear,
          employeeCount: company.employeeCount,
          website: company.website,
          headquarters: company.headquarters,
          logoUrl: company.logoUrl,
        }
      );


      // ======================================================
      // 2. UPDATE LOCATIONS
      // ======================================================

      for (const location of locations) {

        // New location
        if (!location.id) {

          await fetch(
            `http://localhost:8082/api/companies/${companyId}/locations`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Basic ${auth}`,
              },
              body: JSON.stringify({
                address:
                  location.address || null,
                city:
                  location.city || null,
                state:
                  location.state || null,
                country:
                  location.country || null,
                postalCode:
                  location.postalCode || null,
                locationType:
                  location.locationType || null,
              }),
            }
          );

        } else {

          await updateCompanyLocation(
            companyId,
            location.id,
            {
              address:
                location.address,
              city:
                location.city,
              state:
                location.state,
              country:
                location.country,
              postalCode:
                location.postalCode,
              locationType:
                location.locationType,
            }
          );

        }
      }


      // ======================================================
      // 3. UPDATE OWNERSHIP
      // ======================================================

      for (const owner of ownership) {

        if (!owner.id) {

          await fetch(
            `http://localhost:8082/api/companies/${companyId}/ownership`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Basic ${auth}`,
              },
              body: JSON.stringify({
                ownerName:
                  owner.ownerName,
                ownerType:
                  owner.ownerType || null,
                ownershipPercentage:
                  owner.ownershipPercentage !== null &&
                  owner.ownershipPercentage !== undefined
                    ? Number(
                        owner.ownershipPercentage
                      )
                    : null,
              }),
            }
          );

        } else {

          await updateCompanyOwnership(
            companyId,
            owner.id,
            {
              ownerName:
                owner.ownerName,
              ownerType:
                owner.ownerType,
              ownershipPercentage:
                owner.ownershipPercentage,
            }
          );

        }
      }


      // ======================================================
      // 4. UPDATE FINANCIALS
      // ======================================================

      for (const financial of financials) {

        if (!financial.id) {

          await fetch(
            `http://localhost:8082/api/companies/${companyId}/financial`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Basic ${auth}`,
              },
              body: JSON.stringify({
                financialYear:
                  financial.financialYear,
                revenue:
                  financial.revenue !== null &&
                  financial.revenue !== undefined
                    ? Number(
                        financial.revenue
                      )
                    : null,
                profit:
                  financial.profit !== null &&
                  financial.profit !== undefined
                    ? Number(
                        financial.profit
                      )
                    : null,
                marketCap:
                  financial.marketCap !== null &&
                  financial.marketCap !== undefined
                    ? Number(
                        financial.marketCap
                      )
                    : null,
                currency:
                  financial.currency || null,
              }),
            }
          );

        } else {

          await updateCompanyFinancial(
            companyId,
            financial.id,
            {
              financialYear:
                financial.financialYear,
              revenue:
                financial.revenue,
              profit:
                financial.profit,
              marketCap:
                financial.marketCap,
              currency:
                financial.currency,
            }
          );

        }
      }


      // ======================================================
      // 5. UPDATE PEOPLE
      // ======================================================

      for (const person of people) {

        if (!person.id) {

          await fetch(
            `http://localhost:8082/api/companies/${companyId}/persons`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Basic ${auth}`,
              },
              body: JSON.stringify({
                name:
                  person.name,
                role:
                  person.role || null,
                bio:
                  person.bio || null,
                linkedinUrl:
                  person.linkedinUrl || null,
              }),
            }
          );

        } else {

          await updateCompanyPerson(
            companyId,
            person.id,
            {
              name:
                person.name,
              role:
                person.role,
              bio:
                person.bio,
              linkedinUrl:
                person.linkedinUrl,
            }
          );

        }
      }


      // ======================================================
      // 6. UPDATE SOCIAL LINKS
      // ======================================================

      for (const social of socialLinks) {

        if (!social.id) {

          await fetch(
            `http://localhost:8082/api/companies/${companyId}/social-links`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Basic ${auth}`,
              },
              body: JSON.stringify({
                platform:
                  social.platform || null,
                url:
                  social.url,
              }),
            }
          );

        } else {

          await updateCompanySocialLink(
            companyId,
            social.id,
            {
              platform:
                social.platform,
              url:
                social.url,
            }
          );

        }
      }


      // ======================================================
      // DONE
      // ======================================================

      alert(
        "Company updated successfully."
      );

      router.push("/admin");

      router.refresh();

    } catch (err) {

      console.error(
        "Update company error:",
        err
      );

      if (err instanceof Error) {

        setError(err.message);

      } else {

        setError(
          "Failed to update company."
        );

      }

    } finally {

      setSaving(false);

    }
  }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <main className="min-h-screen px-6 py-8">

        <div className="mx-auto max-w-5xl">

          <div className="neo rounded-3xl p-10 text-center">

            <p className="text-lg">
              Loading company...
            </p>

          </div>

        </div>

      </main>
    );

  }


  if (!company) {

    return (
      <main className="min-h-screen px-6 py-8">

        <div className="mx-auto max-w-5xl">

          <div className="neo rounded-3xl p-10 text-center">

            <h2 className="text-2xl font-bold">
              Company not found
            </h2>

            <button
              onClick={() =>
                router.push("/admin")
              }
              className="neo-button mt-6 rounded-2xl px-6 py-3"
            >
              Back to Admin
            </button>

          </div>

        </div>

      </main>
    );

  }


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <main className="min-h-screen px-6 py-8">

      {/* ====================================================
          NAVBAR
      ==================================================== */}

      <nav className="neo mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-8 py-5">

        <button
          onClick={() =>
            router.push("/admin")
          }
          className="text-2xl font-bold"
        >
          ComCon
        </button>

        <button
          onClick={() =>
            router.push("/admin")
          }
          className="neo-button rounded-2xl px-5 py-3"
        >
          Back to Admin
        </button>

      </nav>


      {/* ====================================================
          HEADING
      ==================================================== */}

      <section className="mx-auto mt-16 max-w-5xl">

        <h2 className="text-5xl font-bold tracking-tight">
          Update Company
        </h2>

        <p className="mt-4 text-lg opacity-70">
          Update complete company information.
        </p>


        {error && (
          <div className="mt-8 rounded-2xl p-5 text-red-500">
            {error}
          </div>
        )}


        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="mt-10"
        >


          {/* =================================================
              COMPANY INFORMATION
          ================================================= */}

          <section className="neo rounded-3xl p-8">

            <h3 className="text-2xl font-bold">
              Company Information
            </h3>

            <div className="mt-8 grid gap-6 md:grid-cols-2">


              {/* NAME */}

              <div className="md:col-span-2">

                <label className="mb-2 block font-semibold">
                  Company Name
                </label>

                <input
                  value={company.name}
                  onChange={(e) =>
                    updateCompanyField(
                      "name",
                      e.target.value
                    )
                  }
                  required
                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                />

              </div>


              {/* DESCRIPTION */}

              <div className="md:col-span-2">

                <label className="mb-2 block font-semibold">
                  Description
                </label>

                <textarea
                  value={
                    company.description || ""
                  }
                  onChange={(e) =>
                    updateCompanyField(
                      "description",
                      e.target.value
                    )
                  }
                  rows={4}
                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                />

              </div>


              {/* INDUSTRY */}

              <div>

                <label className="mb-2 block font-semibold">
                  Industry
                </label>

                <input
                  value={
                    company.industry || ""
                  }
                  onChange={(e) =>
                    updateCompanyField(
                      "industry",
                      e.target.value
                    )
                  }
                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                />

              </div>


              {/* COMPANY TYPE */}

              <div>

                <label className="mb-2 block font-semibold">
                  Company Type
                </label>

                <input
                  value={
                    company.companyType || ""
                  }
                  onChange={(e) =>
                    updateCompanyField(
                      "companyType",
                      e.target.value
                    )
                  }
                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                />

              </div>


              {/* FOUNDED YEAR */}

              <div>

                <label className="mb-2 block font-semibold">
                  Founded Year
                </label>

                <input
                  type="number"
                  value={
                    company.foundedYear ?? ""
                  }
                  onChange={(e) =>
                    updateCompanyField(
                      "foundedYear",
                      e.target.value
                        ? Number(e.target.value)
                        : null
                    )
                  }
                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                />

              </div>


              {/* EMPLOYEE COUNT */}

              <div>

                <label className="mb-2 block font-semibold">
                  Employee Count
                </label>

                <input
                  type="number"
                  value={
                    company.employeeCount ?? ""
                  }
                  onChange={(e) =>
                    updateCompanyField(
                      "employeeCount",
                      e.target.value
                        ? Number(e.target.value)
                        : null
                    )
                  }
                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                />

              </div>


              {/* WEBSITE */}

              <div>

                <label className="mb-2 block font-semibold">
                  Website
                </label>

                <input
                  value={
                    company.website || ""
                  }
                  onChange={(e) =>
                    updateCompanyField(
                      "website",
                      e.target.value
                    )
                  }
                  placeholder="https://example.com"
                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                />

              </div>


              {/* HEADQUARTERS */}

              <div>

                <label className="mb-2 block font-semibold">
                  Headquarters
                </label>

                <input
                  value={
                    company.headquarters || ""
                  }
                  onChange={(e) =>
                    updateCompanyField(
                      "headquarters",
                      e.target.value
                    )
                  }
                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                />

              </div>


              {/* LOGO URL */}

              <div className="md:col-span-2">

                <label className="mb-2 block font-semibold">
                  Logo URL
                </label>

                <input
                  value={
                    company.logoUrl || ""
                  }
                  onChange={(e) =>
                    updateCompanyField(
                      "logoUrl",
                      e.target.value
                    )
                  }
                  placeholder="https://example.com/logo.png"
                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                />

              </div>

            </div>

          </section>


          {/* =================================================
              LOCATIONS
          ================================================= */}

          <section className="neo mt-8 rounded-3xl p-8">

            <div className="flex items-center justify-between">

              <h3 className="text-2xl font-bold">
                Locations
              </h3>

              <button
                type="button"
                onClick={addLocation}
                className="neo-button rounded-2xl px-5 py-3"
              >
                + Add Location
              </button>

            </div>


            <div className="mt-8 space-y-6">

              {locations.map(
                (location, index) => (

                  <div
                    key={
                      location.id ||
                      `location-${index}`
                    }
                    className="neo-inset rounded-3xl p-6"
                  >

                    <div className="mb-6 flex items-center justify-between">

                      <h4 className="font-bold">
                        Location {index + 1}
                      </h4>

                      <button
                        type="button"
                        onClick={() =>
                          removeLocation(index)
                        }
                        className="text-red-500"
                      >
                        Remove
                      </button>

                    </div>


                    <div className="grid gap-5 md:grid-cols-2">


                      <div className="md:col-span-2">

                        <label className="mb-2 block font-semibold">
                          Address
                        </label>

                        <input
                          value={
                            location.address || ""
                          }
                          onChange={(e) =>
                            updateLocation(
                              index,
                              "address",
                              e.target.value
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div>

                        <label className="mb-2 block font-semibold">
                          City
                        </label>

                        <input
                          value={
                            location.city || ""
                          }
                          onChange={(e) =>
                            updateLocation(
                              index,
                              "city",
                              e.target.value
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div>

                        <label className="mb-2 block font-semibold">
                          State
                        </label>

                        <input
                          value={
                            location.state || ""
                          }
                          onChange={(e) =>
                            updateLocation(
                              index,
                              "state",
                              e.target.value
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div>

                        <label className="mb-2 block font-semibold">
                          Country
                        </label>

                        <input
                          value={
                            location.country || ""
                          }
                          onChange={(e) =>
                            updateLocation(
                              index,
                              "country",
                              e.target.value
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div>

                        <label className="mb-2 block font-semibold">
                          Postal Code
                        </label>

                        <input
                          value={
                            location.postalCode || ""
                          }
                          onChange={(e) =>
                            updateLocation(
                              index,
                              "postalCode",
                              e.target.value
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div className="md:col-span-2">

                        <label className="mb-2 block font-semibold">
                          Location Type
                        </label>

                        <input
                          value={
                            location.locationType || ""
                          }
                          onChange={(e) =>
                            updateLocation(
                              index,
                              "locationType",
                              e.target.value
                            )
                          }
                          placeholder="Headquarters, Office, Branch..."
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>


          {/* =================================================
              OWNERSHIP
          ================================================= */}

          <section className="neo mt-8 rounded-3xl p-8">

            <div className="flex items-center justify-between">

              <h3 className="text-2xl font-bold">
                Ownership
              </h3>

              <button
                type="button"
                onClick={addOwnership}
                className="neo-button rounded-2xl px-5 py-3"
              >
                + Add Owner
              </button>

            </div>


            <div className="mt-8 space-y-6">

              {ownership.map(
                (owner, index) => (

                  <div
                    key={
                      owner.id ||
                      `owner-${index}`
                    }
                    className="neo-inset rounded-3xl p-6"
                  >

                    <div className="mb-6 flex justify-between">

                      <h4 className="font-bold">
                        Owner {index + 1}
                      </h4>

                      <button
                        type="button"
                        onClick={() =>
                          removeOwnership(index)
                        }
                        className="text-red-500"
                      >
                        Remove
                      </button>

                    </div>


                    <div className="grid gap-5 md:grid-cols-3">

                      <div>

                        <label className="mb-2 block font-semibold">
                          Owner Name
                        </label>

                        <input
                          value={
                            owner.ownerName || ""
                          }
                          onChange={(e) =>
                            updateOwnership(
                              index,
                              "ownerName",
                              e.target.value
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div>

                        <label className="mb-2 block font-semibold">
                          Owner Type
                        </label>

                        <input
                          value={
                            owner.ownerType || ""
                          }
                          onChange={(e) =>
                            updateOwnership(
                              index,
                              "ownerType",
                              e.target.value
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div>

                        <label className="mb-2 block font-semibold">
                          Ownership %
                        </label>

                        <input
                          type="number"
                          step="0.01"
                          value={
                            owner.ownershipPercentage ?? ""
                          }
                          onChange={(e) =>
                            updateOwnership(
                              index,
                              "ownershipPercentage",
                              e.target.value
                                ? Number(
                                    e.target.value
                                  )
                                : null
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>


          {/* =================================================
              FINANCIALS
          ================================================= */}

          <section className="neo mt-8 rounded-3xl p-8">

            <div className="flex items-center justify-between">

              <h3 className="text-2xl font-bold">
                Financial Information
              </h3>

              <button
                type="button"
                onClick={addFinancial}
                className="neo-button rounded-2xl px-5 py-3"
              >
                + Add Financial Year
              </button>

            </div>


            <div className="mt-8 space-y-6">

              {financials.map(
                (financial, index) => (

                  <div
                    key={
                      financial.id ||
                      `financial-${index}`
                    }
                    className="neo-inset rounded-3xl p-6"
                  >

                    <div className="mb-6 flex justify-between">

                      <h4 className="font-bold">
                        Financial Record {index + 1}
                      </h4>

                      <button
                        type="button"
                        onClick={() =>
                          removeFinancial(index)
                        }
                        className="text-red-500"
                      >
                        Remove
                      </button>

                    </div>


                    <div className="grid gap-5 md:grid-cols-2">


                      <div>

                        <label className="mb-2 block font-semibold">
                          Financial Year
                        </label>

                        <input
                          value={
                            financial.financialYear || ""
                          }
                          onChange={(e) =>
                            updateFinancialField(
                              index,
                              "financialYear",
                              e.target.value
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div>

                        <label className="mb-2 block font-semibold">
                          Currency
                        </label>

                        <input
                          value={
                            financial.currency || ""
                          }
                          onChange={(e) =>
                            updateFinancialField(
                              index,
                              "currency",
                              e.target.value
                            )
                          }
                          placeholder="USD, INR..."
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div>

                        <label className="mb-2 block font-semibold">
                          Revenue
                        </label>

                        <input
                          type="number"
                          value={
                            financial.revenue ?? ""
                          }
                          onChange={(e) =>
                            updateFinancialField(
                              index,
                              "revenue",
                              e.target.value
                                ? Number(
                                    e.target.value
                                  )
                                : null
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div>

                        <label className="mb-2 block font-semibold">
                          Profit
                        </label>

                        <input
                          type="number"
                          value={
                            financial.profit ?? ""
                          }
                          onChange={(e) =>
                            updateFinancialField(
                              index,
                              "profit",
                              e.target.value
                                ? Number(
                                    e.target.value
                                  )
                                : null
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div className="md:col-span-2">

                        <label className="mb-2 block font-semibold">
                          Market Cap
                        </label>

                        <input
                          type="number"
                          value={
                            financial.marketCap ?? ""
                          }
                          onChange={(e) =>
                            updateFinancialField(
                              index,
                              "marketCap",
                              e.target.value
                                ? Number(
                                    e.target.value
                                  )
                                : null
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>


          {/* =================================================
              PEOPLE
          ================================================= */}

          <section className="neo mt-8 rounded-3xl p-8">

            <div className="flex items-center justify-between">

              <h3 className="text-2xl font-bold">
                People
              </h3>

              <button
                type="button"
                onClick={addPerson}
                className="neo-button rounded-2xl px-5 py-3"
              >
                + Add Person
              </button>

            </div>


            <div className="mt-8 space-y-6">

              {people.map(
                (person, index) => (

                  <div
                    key={
                      person.id ||
                      `person-${index}`
                    }
                    className="neo-inset rounded-3xl p-6"
                  >

                    <div className="mb-6 flex justify-between">

                      <h4 className="font-bold">
                        Person {index + 1}
                      </h4>

                      <button
                        type="button"
                        onClick={() =>
                          removePerson(index)
                        }
                        className="text-red-500"
                      >
                        Remove
                      </button>

                    </div>


                    <div className="grid gap-5 md:grid-cols-2">


                      <div>

                        <label className="mb-2 block font-semibold">
                          Name
                        </label>

                        <input
                          value={
                            person.name || ""
                          }
                          onChange={(e) =>
                            updatePerson(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div>

                        <label className="mb-2 block font-semibold">
                          Role
                        </label>

                        <input
                          value={
                            person.role || ""
                          }
                          onChange={(e) =>
                            updatePerson(
                              index,
                              "role",
                              e.target.value
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div className="md:col-span-2">

                        <label className="mb-2 block font-semibold">
                          Bio
                        </label>

                        <textarea
                          value={
                            person.bio || ""
                          }
                          onChange={(e) =>
                            updatePerson(
                              index,
                              "bio",
                              e.target.value
                            )
                          }
                          rows={4}
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div className="md:col-span-2">

                        <label className="mb-2 block font-semibold">
                          LinkedIn URL
                        </label>

                        <input
                          value={
                            person.linkedinUrl || ""
                          }
                          onChange={(e) =>
                            updatePerson(
                              index,
                              "linkedinUrl",
                              e.target.value
                            )
                          }
                          placeholder="https://linkedin.com/in/..."
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>


          {/* =================================================
              SOCIAL LINKS
          ================================================= */}

          <section className="neo mt-8 rounded-3xl p-8">

            <div className="flex items-center justify-between">

              <h3 className="text-2xl font-bold">
                Social Links
              </h3>

              <button
                type="button"
                onClick={addSocialLink}
                className="neo-button rounded-2xl px-5 py-3"
              >
                + Add Social Link
              </button>

            </div>


            <div className="mt-8 space-y-6">

              {socialLinks.map(
                (social, index) => (

                  <div
                    key={
                      social.id ||
                      `social-${index}`
                    }
                    className="neo-inset rounded-3xl p-6"
                  >

                    <div className="mb-6 flex justify-between">

                      <h4 className="font-bold">
                        Social Link {index + 1}
                      </h4>

                      <button
                        type="button"
                        onClick={() =>
                          removeSocialLink(index)
                        }
                        className="text-red-500"
                      >
                        Remove
                      </button>

                    </div>


                    <div className="grid gap-5 md:grid-cols-2">


                      <div>

                        <label className="mb-2 block font-semibold">
                          Platform
                        </label>

                        <input
                          value={
                            social.platform || ""
                          }
                          onChange={(e) =>
                            updateSocialLink(
                              index,
                              "platform",
                              e.target.value
                            )
                          }
                          placeholder="LinkedIn, X, Facebook..."
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>


                      <div>

                        <label className="mb-2 block font-semibold">
                          URL
                        </label>

                        <input
                          value={
                            social.url || ""
                          }
                          onChange={(e) =>
                            updateSocialLink(
                              index,
                              "url",
                              e.target.value
                            )
                          }
                          placeholder="https://..."
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>


          {/* =================================================
              SAVE
          ================================================= */}

          <div className="mt-10 flex justify-end gap-4">

            <button
              type="button"
              onClick={() =>
                router.push("/admin")
              }
              className="neo-button rounded-2xl px-8 py-4"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="neo-button rounded-2xl px-8 py-4 font-semibold"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>


        </form>

      </section>

    </main>
  );
}