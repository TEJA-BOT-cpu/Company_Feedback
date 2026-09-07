"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LocationForm = {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  locationType: string;
};

type OwnershipForm = {
  ownerName: string;
  ownerType: string;
  ownershipPercentage: string;
};

type FinancialForm = {
  financialYear: string;
  revenue: string;
  profit: string;
  marketCap: string;
  currency: string;
};

type PersonForm = {
  name: string;
  role: string;
  bio: string;
  linkedinUrl: string;
};

type SocialLinkForm = {
  platform: string;
  url: string;
};

const emptyLocation: LocationForm = {
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  locationType: "",
};

const emptyOwnership: OwnershipForm = {
  ownerName: "",
  ownerType: "",
  ownershipPercentage: "",
};

const emptyFinancial: FinancialForm = {
  financialYear: "",
  revenue: "",
  profit: "",
  marketCap: "",
  currency: "",
};

const emptyPerson: PersonForm = {
  name: "",
  role: "",
  bio: "",
  linkedinUrl: "",
};

const emptySocialLink: SocialLinkForm = {
  platform: "",
  url: "",
};

export default function CreateCompanyPage() {
  const router = useRouter();

  // -----------------------------
  // Basic Company Information
  // -----------------------------

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [website, setWebsite] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // -----------------------------
  // Related Information
  // -----------------------------

  const [locations, setLocations] = useState<LocationForm[]>([]);
  const [ownership, setOwnership] = useState<OwnershipForm[]>([]);
  const [financials, setFinancials] = useState<FinancialForm[]>([]);
  const [people, setPeople] = useState<PersonForm[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkForm[]>([]);

  // -----------------------------
  // UI State
  // -----------------------------

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOCATION FUNCTIONS
  // =========================================================

  function addLocation() {
    setLocations((current) => [
      ...current,
      { ...emptyLocation },
    ]);
  }

  function removeLocation(index: number) {
    setLocations((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function updateLocation(
    index: number,
    field: keyof LocationForm,
    value: string
  ) {
    setLocations((current) =>
      current.map((location, i) =>
        i === index
          ? { ...location, [field]: value }
          : location
      )
    );
  }

  // =========================================================
  // OWNERSHIP FUNCTIONS
  // =========================================================

  function addOwnership() {
    setOwnership((current) => [
      ...current,
      { ...emptyOwnership },
    ]);
  }

  function removeOwnership(index: number) {
    setOwnership((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function updateOwnership(
    index: number,
    field: keyof OwnershipForm,
    value: string
  ) {
    setOwnership((current) =>
      current.map((owner, i) =>
        i === index
          ? { ...owner, [field]: value }
          : owner
      )
    );
  }

  // =========================================================
  // FINANCIAL FUNCTIONS
  // =========================================================

  function addFinancial() {
    setFinancials((current) => [
      ...current,
      { ...emptyFinancial },
    ]);
  }

  function removeFinancial(index: number) {
    setFinancials((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function updateFinancial(
    index: number,
    field: keyof FinancialForm,
    value: string
  ) {
    setFinancials((current) =>
      current.map((financial, i) =>
        i === index
          ? { ...financial, [field]: value }
          : financial
      )
    );
  }

  // =========================================================
  // PEOPLE FUNCTIONS
  // =========================================================

  function addPerson() {
    setPeople((current) => [
      ...current,
      { ...emptyPerson },
    ]);
  }

  function removePerson(index: number) {
    setPeople((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function updatePerson(
    index: number,
    field: keyof PersonForm,
    value: string
  ) {
    setPeople((current) =>
      current.map((person, i) =>
        i === index
          ? { ...person, [field]: value }
          : person
      )
    );
  }

  // =========================================================
  // SOCIAL LINK FUNCTIONS
  // =========================================================

  function addSocialLink() {
    setSocialLinks((current) => [
      ...current,
      { ...emptySocialLink },
    ]);
  }

  function removeSocialLink(index: number) {
    setSocialLinks((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function updateSocialLink(
    index: number,
    field: keyof SocialLinkForm,
    value: string
  ) {
    setSocialLinks((current) =>
      current.map((social, i) =>
        i === index
          ? { ...social, [field]: value }
          : social
      )
    );
  }

  // =========================================================
  // CREATE COMPANY
  // =========================================================

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const storedUser = localStorage.getItem("user");
      const auth = localStorage.getItem("auth");

      if (!storedUser || !auth) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(storedUser);

      if (user.role !== "ADMIN") {
        router.push("/");
        return;
      }

      // -----------------------------------------------------
      // 1. CREATE COMPANY
      // -----------------------------------------------------

      const companyResponse = await fetch(
        "http://localhost:8082/api/companies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            name,
            description: description || null,
            industry: industry || null,
            companyType: companyType || null,
            foundedYear: foundedYear
              ? Number(foundedYear)
              : null,
            employeeCount: employeeCount
              ? Number(employeeCount)
              : null,
            website: website || null,
            headquarters: headquarters || null,
            logoUrl: logoUrl || null,
          }),
        }
      );

      if (!companyResponse.ok) {
        throw new Error(
          `Failed to create company (${companyResponse.status})`
        );
      }

      const createdCompany = await companyResponse.json();

      const companyId = createdCompany.id;

      if (!companyId) {
        throw new Error(
          "Company was created but no company ID was returned."
        );
      }

      // -----------------------------------------------------
      // 2. CREATE LOCATIONS
      // -----------------------------------------------------

      for (const location of locations) {
        await fetch(
          `http://localhost:8082/api/companies/${companyId}/locations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${auth}`,
            },
            body: JSON.stringify({
              address: location.address || null,
              city: location.city || null,
              state: location.state || null,
              country: location.country || null,
              postalCode: location.postalCode || null,
              locationType: location.locationType || null,
            }),
          }
        );
      }

      // -----------------------------------------------------
      // 3. CREATE OWNERSHIP
      // -----------------------------------------------------

      for (const owner of ownership) {
        await fetch(
          `http://localhost:8082/api/companies/${companyId}/ownership`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${auth}`,
            },
            body: JSON.stringify({
              ownerName: owner.ownerName,
              ownerType: owner.ownerType || null,
              ownershipPercentage:
                owner.ownershipPercentage
                  ? Number(owner.ownershipPercentage)
                  : null,
            }),
          }
        );
      }

      // -----------------------------------------------------
      // 4. CREATE FINANCIALS
      // -----------------------------------------------------

      for (const financial of financials) {
        await fetch(
          `http://localhost:8082/api/companies/${companyId}/financial`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${auth}`,
            },
            body: JSON.stringify({
              financialYear: financial.financialYear,
              revenue: financial.revenue
                ? Number(financial.revenue)
                : null,
              profit: financial.profit
                ? Number(financial.profit)
                : null,
              marketCap: financial.marketCap
                ? Number(financial.marketCap)
                : null,
              currency: financial.currency || null,
            }),
          }
        );
      }

      // -----------------------------------------------------
      // 5. CREATE PEOPLE
      // -----------------------------------------------------

      for (const person of people) {
        await fetch(
          `http://localhost:8082/api/companies/${companyId}/persons`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${auth}`,
            },
            body: JSON.stringify({
              name: person.name,
              role: person.role || null,
              bio: person.bio || null,
              linkedinUrl: person.linkedinUrl || null,
            }),
          }
        );
      }

      // -----------------------------------------------------
      // 6. CREATE SOCIAL LINKS
      // -----------------------------------------------------

      for (const social of socialLinks) {
        await fetch(
          `http://localhost:8082/api/companies/${companyId}/social-links`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${auth}`,
            },
            body: JSON.stringify({
              platform: social.platform || null,
              url: social.url,
            }),
          }
        );
      }

      // -----------------------------------------------------
      // DONE
      // -----------------------------------------------------

      router.push("/admin");

    } catch (error) {
      console.error("Create company error:", error);

      if (error instanceof TypeError) {
        setError(
          "Unable to connect to the backend."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to create company.");
      }
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-h-screen px-6 py-8">

      {/* Navbar */}
      <nav className="neo mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-8 py-5">

        <button
          onClick={() => router.push("/admin")}
          className="text-2xl font-bold"
        >
          ComCon
        </button>

        <button
          onClick={() => router.push("/admin")}
          className="neo-button rounded-2xl px-5 py-3"
        >
          Back to Admin
        </button>

      </nav>


      {/* Heading */}
      <section className="mx-auto mt-16 max-w-5xl">

        <h2 className="text-5xl font-bold tracking-tight">
          Create Company
        </h2>

        <p className="mt-4 text-lg opacity-70">
          Add complete company information to ComCon.
        </p>

      </section>


      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 max-w-5xl"
      >

        {/* =================================================
            BASIC INFORMATION
        ================================================= */}

        <section className="neo rounded-3xl p-10">

          <h3 className="text-2xl font-bold">
            1. Basic Information
          </h3>

          <p className="mt-2 opacity-60">
            General information about the company.
          </p>


          <div className="mt-8">

            <label className="mb-2 block font-semibold">
              Company Name *
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter company name"
              className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
            />

          </div>


          <div className="mt-6">

            <label className="mb-2 block font-semibold">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe the company"
              rows={5}
              className="neo-inset w-full resize-none rounded-2xl px-5 py-4 outline-none"
            />

          </div>


          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-semibold">
                Industry
              </label>

              <input
                type="text"
                value={industry}
                onChange={(e) =>
                  setIndustry(e.target.value)
                }
                placeholder="Technology"
                className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
              />

            </div>


            <div>

              <label className="mb-2 block font-semibold">
                Company Type
              </label>

              <input
                type="text"
                value={companyType}
                onChange={(e) =>
                  setCompanyType(e.target.value)
                }
                placeholder="Private / Public"
                className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
              />

            </div>

          </div>


          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-semibold">
                Founded Year
              </label>

              <input
                type="number"
                value={foundedYear}
                onChange={(e) =>
                  setFoundedYear(e.target.value)
                }
                placeholder="2020"
                className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
              />

            </div>


            <div>

              <label className="mb-2 block font-semibold">
                Employee Count
              </label>

              <input
                type="number"
                value={employeeCount}
                onChange={(e) =>
                  setEmployeeCount(e.target.value)
                }
                placeholder="500"
                className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
              />

            </div>

          </div>


          <div className="mt-6">

            <label className="mb-2 block font-semibold">
              Website
            </label>

            <input
              type="url"
              value={website}
              onChange={(e) =>
                setWebsite(e.target.value)
              }
              placeholder="https://example.com"
              className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
            />

          </div>


          <div className="mt-6">

            <label className="mb-2 block font-semibold">
              Headquarters
            </label>

            <input
              type="text"
              value={headquarters}
              onChange={(e) =>
                setHeadquarters(e.target.value)
              }
              placeholder="Hyderabad, India"
              className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
            />

          </div>


          <div className="mt-6">

            <label className="mb-2 block font-semibold">
              Logo URL
            </label>

            <input
              type="url"
              value={logoUrl}
              onChange={(e) =>
                setLogoUrl(e.target.value)
              }
              placeholder="https://example.com/logo.png"
              className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
            />

          </div>

        </section>


        {/* =================================================
            LOCATIONS
        ================================================= */}

        <section className="neo mt-8 rounded-3xl p-10">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-2xl font-bold">
                2. Locations
              </h3>

              <p className="mt-2 opacity-60">
                Add company offices, headquarters and branches.
              </p>

            </div>

            <button
              type="button"
              onClick={addLocation}
              className="neo-button rounded-2xl px-5 py-3 font-semibold"
            >
              + Add Location
            </button>

          </div>


          <div className="mt-8 space-y-6">

            {locations.map((location, index) => (

              <div
                key={index}
                className="neo-inset rounded-3xl p-6"
              >

                <div className="flex items-center justify-between">

                  <h4 className="text-lg font-bold">
                    Location {index + 1}
                  </h4>

                  <button
                    type="button"
                    onClick={() =>
                      removeLocation(index)
                    }
                    className="neo-button rounded-xl px-4 py-2 text-sm"
                  >
                    Remove
                  </button>

                </div>


                <div className="mt-5">

                  <input
                    type="text"
                    placeholder="Address"
                    value={location.address}
                    onChange={(e) =>
                      updateLocation(
                        index,
                        "address",
                        e.target.value
                      )
                    }
                    className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                  />

                </div>


                <div className="mt-4 grid gap-4 md:grid-cols-2">

                  <input
                    type="text"
                    placeholder="City"
                    value={location.city}
                    onChange={(e) =>
                      updateLocation(
                        index,
                        "city",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="State"
                    value={location.state}
                    onChange={(e) =>
                      updateLocation(
                        index,
                        "state",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Country"
                    value={location.country}
                    onChange={(e) =>
                      updateLocation(
                        index,
                        "country",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={location.postalCode}
                    onChange={(e) =>
                      updateLocation(
                        index,
                        "postalCode",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                </div>


                <input
                  type="text"
                  placeholder="Location Type (Headquarters, Branch, Office)"
                  value={location.locationType}
                  onChange={(e) =>
                    updateLocation(
                      index,
                      "locationType",
                      e.target.value
                    )
                  }
                  className="neo-inset mt-4 w-full rounded-2xl px-5 py-4 outline-none"
                />

              </div>

            ))}

          </div>

        </section>


        {/* =================================================
            OWNERSHIP
        ================================================= */}

        <section className="neo mt-8 rounded-3xl p-10">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-2xl font-bold">
                3. Ownership
              </h3>

              <p className="mt-2 opacity-60">
                Add owners and their ownership percentages.
              </p>

            </div>

            <button
              type="button"
              onClick={addOwnership}
              className="neo-button rounded-2xl px-5 py-3 font-semibold"
            >
              + Add Owner
            </button>

          </div>


          <div className="mt-8 space-y-6">

            {ownership.map((owner, index) => (

              <div
                key={index}
                className="neo-inset rounded-3xl p-6"
              >

                <div className="flex items-center justify-between">

                  <h4 className="text-lg font-bold">
                    Owner {index + 1}
                  </h4>

                  <button
                    type="button"
                    onClick={() =>
                      removeOwnership(index)
                    }
                    className="neo-button rounded-xl px-4 py-2 text-sm"
                  >
                    Remove
                  </button>

                </div>


                <div className="mt-5 grid gap-4 md:grid-cols-3">

                  <input
                    type="text"
                    placeholder="Owner Name"
                    value={owner.ownerName}
                    onChange={(e) =>
                      updateOwnership(
                        index,
                        "ownerName",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Owner Type"
                    value={owner.ownerType}
                    onChange={(e) =>
                      updateOwnership(
                        index,
                        "ownerType",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ownership %"
                    value={owner.ownershipPercentage}
                    onChange={(e) =>
                      updateOwnership(
                        index,
                        "ownershipPercentage",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* =================================================
            FINANCIALS
        ================================================= */}

        <section className="neo mt-8 rounded-3xl p-10">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-2xl font-bold">
                4. Financials
              </h3>

              <p className="mt-2 opacity-60">
                Add financial information for different years.
              </p>

            </div>

            <button
              type="button"
              onClick={addFinancial}
              className="neo-button rounded-2xl px-5 py-3 font-semibold"
            >
              + Add Financial Year
            </button>

          </div>


          <div className="mt-8 space-y-6">

            {financials.map((financial, index) => (

              <div
                key={index}
                className="neo-inset rounded-3xl p-6"
              >

                <div className="flex items-center justify-between">

                  <h4 className="text-lg font-bold">
                    Financial Year {index + 1}
                  </h4>

                  <button
                    type="button"
                    onClick={() =>
                      removeFinancial(index)
                    }
                    className="neo-button rounded-xl px-4 py-2 text-sm"
                  >
                    Remove
                  </button>

                </div>


                <div className="mt-5 grid gap-4 md:grid-cols-2">

                  <input
                    type="text"
                    placeholder="Financial Year (e.g. 2025)"
                    value={financial.financialYear}
                    onChange={(e) =>
                      updateFinancial(
                        index,
                        "financialYear",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Currency (e.g. INR, USD)"
                    value={financial.currency}
                    onChange={(e) =>
                      updateFinancial(
                        index,
                        "currency",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Revenue"
                    value={financial.revenue}
                    onChange={(e) =>
                      updateFinancial(
                        index,
                        "revenue",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Profit"
                    value={financial.profit}
                    onChange={(e) =>
                      updateFinancial(
                        index,
                        "profit",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Market Cap / Valuation"
                    value={financial.marketCap}
                    onChange={(e) =>
                      updateFinancial(
                        index,
                        "marketCap",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none md:col-span-2"
                  />

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* =================================================
            PEOPLE
        ================================================= */}

        <section className="neo mt-8 rounded-3xl p-10">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-2xl font-bold">
                5. People
              </h3>

              <p className="mt-2 opacity-60">
                Add executives, founders and important people.
              </p>

            </div>

            <button
              type="button"
              onClick={addPerson}
              className="neo-button rounded-2xl px-5 py-3 font-semibold"
            >
              + Add Person
            </button>

          </div>


          <div className="mt-8 space-y-6">

            {people.map((person, index) => (

              <div
                key={index}
                className="neo-inset rounded-3xl p-6"
              >

                <div className="flex items-center justify-between">

                  <h4 className="text-lg font-bold">
                    Person {index + 1}
                  </h4>

                  <button
                    type="button"
                    onClick={() =>
                      removePerson(index)
                    }
                    className="neo-button rounded-xl px-4 py-2 text-sm"
                  >
                    Remove
                  </button>

                </div>


                <div className="mt-5 grid gap-4 md:grid-cols-2">

                  <input
                    type="text"
                    placeholder="Name"
                    value={person.name}
                    onChange={(e) =>
                      updatePerson(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Role"
                    value={person.role}
                    onChange={(e) =>
                      updatePerson(
                        index,
                        "role",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                  <textarea
                    placeholder="Biography"
                    value={person.bio}
                    onChange={(e) =>
                      updatePerson(
                        index,
                        "bio",
                        e.target.value
                      )
                    }
                    rows={4}
                    className="neo-inset resize-none rounded-2xl px-5 py-4 outline-none md:col-span-2"
                  />

                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={person.linkedinUrl}
                    onChange={(e) =>
                      updatePerson(
                        index,
                        "linkedinUrl",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none md:col-span-2"
                  />

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* =================================================
            SOCIAL LINKS
        ================================================= */}

        <section className="neo mt-8 rounded-3xl p-10">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-2xl font-bold">
                6. Social Links
              </h3>

              <p className="mt-2 opacity-60">
                Add the company's social media profiles.
              </p>

            </div>

            <button
              type="button"
              onClick={addSocialLink}
              className="neo-button rounded-2xl px-5 py-3 font-semibold"
            >
              + Add Social Link
            </button>

          </div>


          <div className="mt-8 space-y-6">

            {socialLinks.map((social, index) => (

              <div
                key={index}
                className="neo-inset rounded-3xl p-6"
              >

                <div className="flex items-center justify-between">

                  <h4 className="text-lg font-bold">
                    Social Link {index + 1}
                  </h4>

                  <button
                    type="button"
                    onClick={() =>
                      removeSocialLink(index)
                    }
                    className="neo-button rounded-xl px-4 py-2 text-sm"
                  >
                    Remove
                  </button>

                </div>


                <div className="mt-5 grid gap-4 md:grid-cols-2">

                  <input
                    type="text"
                    placeholder="Platform (LinkedIn, X, YouTube...)"
                    value={social.platform}
                    onChange={(e) =>
                      updateSocialLink(
                        index,
                        "platform",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                  <input
                    type="url"
                    placeholder="https://..."
                    value={social.url}
                    onChange={(e) =>
                      updateSocialLink(
                        index,
                        "url",
                        e.target.value
                      )
                    }
                    className="neo-inset rounded-2xl px-5 py-4 outline-none"
                  />

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* =================================================
            ERROR + SUBMIT
        ================================================= */}

        {error && (

          <div className="neo mt-8 rounded-3xl p-6 text-center text-red-500">
            {error}
          </div>

        )}


        <div className="neo mt-8 rounded-3xl p-8">

          <div className="flex flex-col gap-4 sm:flex-row">

            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="neo-button flex-1 rounded-2xl px-6 py-4 font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="neo-button flex-1 rounded-2xl px-6 py-4 font-semibold"
            >
              {loading
                ? "Creating Company..."
                : "Create Company"}
            </button>

          </div>

        </div>

      </form>

    </main>
  );
}