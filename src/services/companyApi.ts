import type {
  Company,
  CompanyLocation,
  CompanyOwnership,
  CompanyFinancial,
  CompanyPerson,
  CompanySocialLink,
} from "@/types/company";

const API_URL = "http://localhost:8082/api/companies";

/*
 * Type for the authenticated fetch function
 *
 * This comes from:
 * useAuthenticatedFetch()
 *
 * It automatically adds:
 *
 * Authorization: Bearer <Clerk JWT>
 */
type AuthenticatedFetch = (
  url: string,
  options?: RequestInit
) => Promise<Response>;


/* =========================================================
   COMPANIES
   ========================================================= */

// Get all companies
// PUBLIC
export async function getCompanies(): Promise<Company[]> {

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }

  return response.json();
}


// Get company by ID
// PUBLIC
export async function getCompanyById(
  id: number
): Promise<Company> {

  const response = await fetch(
    `${API_URL}/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch company");
  }

  return response.json();
}


// Create company
// ADMIN ONLY
export async function createCompany(
  company: Partial<Company>,
  authenticatedFetch: AuthenticatedFetch
): Promise<Company> {

  const response = await authenticatedFetch(
    API_URL,
    {
      method: "POST",
      body: JSON.stringify(company),
    }
  );

  const responseText = await response.text();

  console.log(
    "CREATE COMPANY STATUS:",
    response.status
  );

  if (!response.ok) {
    throw new Error(
      `Failed to create company (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update company
// ADMIN ONLY
export async function updateCompany(
  id: number,
  company: Partial<Company>,
  authenticatedFetch: AuthenticatedFetch
): Promise<Company> {

  const response = await authenticatedFetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(company),
    }
  );

  const responseText = await response.text();

  console.log(
    "UPDATE COMPANY STATUS:",
    response.status
  );

  if (!response.ok) {
    throw new Error(
      `Failed to update company (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete company
// ADMIN ONLY
export async function deleteCompany(
  id: number,
  authenticatedFetch: AuthenticatedFetch
): Promise<void> {

  const response = await authenticatedFetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {

    const responseText =
      await response.text();

    throw new Error(
      `Failed to delete company (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   LOCATIONS
   ========================================================= */

// Get locations
// PUBLIC
export async function getCompanyLocations(
  companyId: number
): Promise<CompanyLocation[]> {

  const response = await fetch(
    `${API_URL}/${companyId}/locations`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch locations"
    );
  }

  return response.json();
}


// Create location
// ADMIN ONLY
export async function createCompanyLocation(
  companyId: number,
  location: Partial<CompanyLocation>,
  authenticatedFetch: AuthenticatedFetch
): Promise<CompanyLocation> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/locations`,
    {
      method: "POST",
      body: JSON.stringify(location),
    }
  );

  const responseText =
    await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create location (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update location
// ADMIN ONLY
export async function updateCompanyLocation(
  companyId: number,
  id: number,
  location: Partial<CompanyLocation>,
  authenticatedFetch: AuthenticatedFetch
): Promise<CompanyLocation> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/locations/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(location),
    }
  );

  const responseText =
    await response.text();

  console.log(
    "UPDATE LOCATION STATUS:",
    response.status
  );

  if (!response.ok) {
    throw new Error(
      `Failed to update location (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete location
// ADMIN ONLY
export async function deleteCompanyLocation(
  companyId: number,
  id: number,
  authenticatedFetch: AuthenticatedFetch
): Promise<void> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/locations/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {

    const responseText =
      await response.text();

    throw new Error(
      `Failed to delete location (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   OWNERSHIP
   ========================================================= */

// Get ownership
// PUBLIC
export async function getCompanyOwnership(
  companyId: number
): Promise<CompanyOwnership[]> {

  const response = await fetch(
    `${API_URL}/${companyId}/ownership`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch ownership"
    );
  }

  return response.json();
}


// Create ownership
// ADMIN ONLY
export async function createCompanyOwnership(
  companyId: number,
  ownership: Partial<CompanyOwnership>,
  authenticatedFetch: AuthenticatedFetch
): Promise<CompanyOwnership> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/ownership`,
    {
      method: "POST",
      body: JSON.stringify(ownership),
    }
  );

  const responseText =
    await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create ownership (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update ownership
// ADMIN ONLY
export async function updateCompanyOwnership(
  companyId: number,
  id: number,
  ownership: Partial<CompanyOwnership>,
  authenticatedFetch: AuthenticatedFetch
): Promise<CompanyOwnership> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/ownership/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(ownership),
    }
  );

  const responseText =
    await response.text();

  console.log(
    "UPDATE OWNERSHIP STATUS:",
    response.status
  );

  if (!response.ok) {
    throw new Error(
      `Failed to update ownership (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete ownership
// ADMIN ONLY
export async function deleteCompanyOwnership(
  companyId: number,
  id: number,
  authenticatedFetch: AuthenticatedFetch
): Promise<void> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/ownership/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {

    const responseText =
      await response.text();

    throw new Error(
      `Failed to delete ownership (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   FINANCIAL
   ========================================================= */

// Get financial records
// PUBLIC
export async function getCompanyFinancials(
  companyId: number
): Promise<CompanyFinancial[]> {

  const response = await fetch(
    `${API_URL}/${companyId}/financial`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch financial information"
    );
  }

  return response.json();
}


// Create financial
// ADMIN ONLY
export async function createCompanyFinancial(
  companyId: number,
  financial: Partial<CompanyFinancial>,
  authenticatedFetch: AuthenticatedFetch
): Promise<CompanyFinancial> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/financial`,
    {
      method: "POST",
      body: JSON.stringify(financial),
    }
  );

  const responseText =
    await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create financial information (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update financial
// ADMIN ONLY
export async function updateCompanyFinancial(
  companyId: number,
  id: number,
  financial: Partial<CompanyFinancial>,
  authenticatedFetch: AuthenticatedFetch
): Promise<CompanyFinancial> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/financial/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(financial),
    }
  );

  const responseText =
    await response.text();

  console.log(
    "UPDATE FINANCIAL STATUS:",
    response.status
  );

  if (!response.ok) {
    throw new Error(
      `Failed to update financial information (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete financial
// ADMIN ONLY
export async function deleteCompanyFinancial(
  companyId: number,
  id: number,
  authenticatedFetch: AuthenticatedFetch
): Promise<void> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/financial/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {

    const responseText =
      await response.text();

    throw new Error(
      `Failed to delete financial information (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   PERSONS
   ========================================================= */

// Get people
// PUBLIC
export async function getCompanyPeople(
  companyId: number
): Promise<CompanyPerson[]> {

  const response = await fetch(
    `${API_URL}/${companyId}/persons`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch company people"
    );
  }

  return response.json();
}


// Create person
// ADMIN ONLY
export async function createCompanyPerson(
  companyId: number,
  person: Partial<CompanyPerson>,
  authenticatedFetch: AuthenticatedFetch
): Promise<CompanyPerson> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/persons`,
    {
      method: "POST",
      body: JSON.stringify(person),
    }
  );

  const responseText =
    await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create person (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update person
// ADMIN ONLY
export async function updateCompanyPerson(
  companyId: number,
  id: number,
  person: Partial<CompanyPerson>,
  authenticatedFetch: AuthenticatedFetch
): Promise<CompanyPerson> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/persons/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(person),
    }
  );

  const responseText =
    await response.text();

  console.log(
    "UPDATE PERSON STATUS:",
    response.status
  );

  if (!response.ok) {
    throw new Error(
      `Failed to update person (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete person
// ADMIN ONLY
export async function deleteCompanyPerson(
  companyId: number,
  id: number,
  authenticatedFetch: AuthenticatedFetch
): Promise<void> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/persons/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {

    const responseText =
      await response.text();

    throw new Error(
      `Failed to delete person (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   SOCIAL LINKS
   ========================================================= */

// Get social links
// PUBLIC
export async function getCompanySocialLinks(
  companyId: number
): Promise<CompanySocialLink[]> {

  const response = await fetch(
    `${API_URL}/${companyId}/social-links`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch social links"
    );
  }

  return response.json();
}


// Create social link
// ADMIN ONLY
export async function createCompanySocialLink(
  companyId: number,
  socialLink: Partial<CompanySocialLink>,
  authenticatedFetch: AuthenticatedFetch
): Promise<CompanySocialLink> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/social-links`,
    {
      method: "POST",
      body: JSON.stringify(socialLink),
    }
  );

  const responseText =
    await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create social link (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update social link
// ADMIN ONLY
export async function updateCompanySocialLink(
  companyId: number,
  id: number,
  socialLink: Partial<CompanySocialLink>,
  authenticatedFetch: AuthenticatedFetch
): Promise<CompanySocialLink> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/social-links/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(socialLink),
    }
  );

  const responseText =
    await response.text();

  console.log(
    "UPDATE SOCIAL LINK STATUS:",
    response.status
  );

  if (!response.ok) {
    throw new Error(
      `Failed to update social link (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete social link
// ADMIN ONLY
export async function deleteCompanySocialLink(
  companyId: number,
  id: number,
  authenticatedFetch: AuthenticatedFetch
): Promise<void> {

  const response = await authenticatedFetch(
    `${API_URL}/${companyId}/social-links/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {

    const responseText =
      await response.text();

    throw new Error(
      `Failed to delete social link (${response.status}): ${responseText}`
    );
  }
}