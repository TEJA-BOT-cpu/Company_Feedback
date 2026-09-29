import type {
  Company,
  CompanyLocation,
  CompanyOwnership,
  CompanyFinancial,
  CompanyPerson,
  CompanySocialLink,
  CampusHiringEvent,
  JobRole,
  Compensation,
  EligibilityCriteria,
  EligibleBranch,
  SelectionRound,
  JobLocation,
  InternshipDetails,
  HiringDocument,
  HiringTimeline,
  RoleVacancy,
  RoleSkills,
  RoleApplicationRequirement,
  RoleBond,
  DataSource,
} from "@/types/company";

const API_URL = "http://localhost:8082/api/companies";

/* =========================================================
   COMPANIES
   ========================================================= */

// Get all companies
export async function getCompanies(): Promise<Company[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }

  return response.json();
}


// Get company by ID
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
export async function createCompany(
  company: Partial<Company>
): Promise<Company> {

  const response = await fetch(
    API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
export async function updateCompany(
  id: number,
  company: Partial<Company>
): Promise<Company> {

  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
export async function deleteCompany(
  id: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete company (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   LOCATIONS
   ========================================================= */

// Get locations
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
export async function createCompanyLocation(
  companyId: number,
  location: Partial<CompanyLocation>
): Promise<CompanyLocation> {

  const response = await fetch(
    `${API_URL}/${companyId}/locations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
export async function updateCompanyLocation(
  companyId: number,
  id: number,
  location: Partial<CompanyLocation>
): Promise<CompanyLocation> {

  const response = await fetch(
    `${API_URL}/${companyId}/locations/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
export async function deleteCompanyLocation(
  companyId: number,
  id: number
): Promise<void> {

  const response = await fetch(
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
export async function createCompanyOwnership(
  companyId: number,
  ownership: Partial<CompanyOwnership>
): Promise<CompanyOwnership> {

  const response = await fetch(
    `${API_URL}/${companyId}/ownership`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
export async function updateCompanyOwnership(
  companyId: number,
  id: number,
  ownership: Partial<CompanyOwnership>
): Promise<CompanyOwnership> {

  const response = await fetch(
    `${API_URL}/${companyId}/ownership/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
export async function deleteCompanyOwnership(
  companyId: number,
  id: number
): Promise<void> {

  const response = await fetch(
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
export async function createCompanyFinancial(
  companyId: number,
  financial: Partial<CompanyFinancial>
): Promise<CompanyFinancial> {

  const response = await fetch(
    `${API_URL}/${companyId}/financial`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
export async function updateCompanyFinancial(
  companyId: number,
  id: number,
  financial: Partial<CompanyFinancial>
): Promise<CompanyFinancial> {

  const response = await fetch(
    `${API_URL}/${companyId}/financial/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
export async function deleteCompanyFinancial(
  companyId: number,
  id: number
): Promise<void> {

  const response = await fetch(
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
export async function createCompanyPerson(
  companyId: number,
  person: Partial<CompanyPerson>
): Promise<CompanyPerson> {

  const response = await fetch(
    `${API_URL}/${companyId}/persons`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
export async function updateCompanyPerson(
  companyId: number,
  id: number,
  person: Partial<CompanyPerson>
): Promise<CompanyPerson> {

  const response = await fetch(
    `${API_URL}/${companyId}/persons/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
export async function deleteCompanyPerson(
  companyId: number,
  id: number
): Promise<void> {

  const response = await fetch(
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
export async function createCompanySocialLink(
  companyId: number,
  socialLink: Partial<CompanySocialLink>
): Promise<CompanySocialLink> {

  const response = await fetch(
    `${API_URL}/${companyId}/social-links`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
export async function updateCompanySocialLink(
  companyId: number,
  id: number,
  socialLink: Partial<CompanySocialLink>
): Promise<CompanySocialLink> {

  const response = await fetch(
    `${API_URL}/${companyId}/social-links/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
export async function deleteCompanySocialLink(
  companyId: number,
  id: number
): Promise<void> {

  const response = await fetch(
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
/* =========================================================
   CAMPUS HIRING EVENTS
   ========================================================= */

// Get hiring events for a company
export async function getHiringEvents(
  companyId: number
): Promise<CampusHiringEvent[]> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch hiring events");
  }

  return response.json();
}


// Get hiring event by ID
export async function getHiringEventById(
  companyId: number,
  eventId: number
): Promise<CampusHiringEvent> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch hiring event");
  }

  return response.json();
}


// Create hiring event
export async function createHiringEvent(
  companyId: number,
  hiringEvent: Partial<CampusHiringEvent>
): Promise<CampusHiringEvent> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hiringEvent),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create hiring event (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update hiring event
export async function updateHiringEvent(
  companyId: number,
  eventId: number,
  hiringEvent: Partial<CampusHiringEvent>
): Promise<CampusHiringEvent> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hiringEvent),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update hiring event (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete hiring event
export async function deleteHiringEvent(
  companyId: number,
  eventId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete hiring event (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   JOB ROLES
   ========================================================= */

// Get roles for a hiring event
export async function getJobRoles(
  companyId: number,
  eventId: number
): Promise<JobRole[]> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch job roles");
  }

  return response.json();
}


// Get role by ID
export async function getJobRoleById(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<JobRole> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch job role");
  }

  return response.json();
}


// Create role
export async function createJobRole(
  companyId: number,
  eventId: number,
  role: Partial<JobRole>
): Promise<JobRole> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(role),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create job role (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update role
export async function updateJobRole(
  companyId: number,
  eventId: number,
  roleId: number,
  role: Partial<JobRole>
): Promise<JobRole> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(role),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update job role (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete role
export async function deleteJobRole(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete job role (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   COMPENSATION
   ========================================================= */

// Get compensation
export async function getRoleCompensation(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<Compensation> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/compensation`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch compensation");
  }

  return response.json();
}


// Create compensation
export async function createRoleCompensation(
  companyId: number,
  eventId: number,
  roleId: number,
  compensation: Partial<Compensation>
): Promise<Compensation> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/compensation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(compensation),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create compensation (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update compensation
export async function updateRoleCompensation(
  companyId: number,
  eventId: number,
  roleId: number,
  compensation: Partial<Compensation>
): Promise<Compensation> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/compensation`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(compensation),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update compensation (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete compensation
export async function deleteRoleCompensation(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/compensation`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete compensation (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   ELIGIBILITY
   ========================================================= */

// Get eligibility criteria
export async function getRoleEligibility(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<EligibilityCriteria> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/eligibility`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch eligibility criteria");
  }

  return response.json();
}


// Create eligibility criteria
export async function createRoleEligibility(
  companyId: number,
  eventId: number,
  roleId: number,
  eligibility: Partial<EligibilityCriteria>
): Promise<EligibilityCriteria> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/eligibility`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eligibility),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create eligibility (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update eligibility criteria
export async function updateRoleEligibility(
  companyId: number,
  eventId: number,
  roleId: number,
  eligibility: Partial<EligibilityCriteria>
): Promise<EligibilityCriteria> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/eligibility`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eligibility),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update eligibility (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete eligibility criteria
export async function deleteRoleEligibility(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/eligibility`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete eligibility (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   ELIGIBLE BRANCHES
   ========================================================= */

// Get eligible branches
export async function getEligibleBranches(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<EligibleBranch[]> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/eligible-branches`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch eligible branches");
  }

  return response.json();
}


// Create eligible branch
export async function createEligibleBranch(
  companyId: number,
  eventId: number,
  roleId: number,
  branch: Partial<EligibleBranch>
): Promise<EligibleBranch> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/eligible-branches`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(branch),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create eligible branch (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update eligible branch
export async function updateEligibleBranch(
  companyId: number,
  eventId: number,
  roleId: number,
  branchId: number,
  branch: Partial<EligibleBranch>
): Promise<EligibleBranch> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/eligible-branches/${branchId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(branch),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update eligible branch (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete eligible branch
export async function deleteEligibleBranch(
  companyId: number,
  eventId: number,
  roleId: number,
  branchId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/eligible-branches/${branchId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete eligible branch (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   SELECTION ROUNDS
   ========================================================= */

// Get selection rounds
export async function getSelectionRounds(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<SelectionRound[]> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/selection-rounds`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch selection rounds");
  }

  return response.json();
}


// Create selection round
export async function createSelectionRound(
  companyId: number,
  eventId: number,
  roleId: number,
  round: Partial<SelectionRound>
): Promise<SelectionRound> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/selection-rounds`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(round),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create selection round (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update selection round
export async function updateSelectionRound(
  companyId: number,
  eventId: number,
  roleId: number,
  roundId: number,
  round: Partial<SelectionRound>
): Promise<SelectionRound> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/selection-rounds/${roundId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(round),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update selection round (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete selection round
export async function deleteSelectionRound(
  companyId: number,
  eventId: number,
  roleId: number,
  roundId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/selection-rounds/${roundId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete selection round (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   JOB LOCATIONS
   ========================================================= */

// Get job locations
export async function getJobLocations(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<JobLocation[]> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/locations`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch job locations");
  }

  return response.json();
}


// Create job location
export async function createJobLocation(
  companyId: number,
  eventId: number,
  roleId: number,
  location: Partial<JobLocation>
): Promise<JobLocation> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/locations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create job location (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update job location
export async function updateJobLocation(
  companyId: number,
  eventId: number,
  roleId: number,
  locationId: number,
  location: Partial<JobLocation>
): Promise<JobLocation> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/locations/${locationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update job location (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete job location
export async function deleteJobLocation(
  companyId: number,
  eventId: number,
  roleId: number,
  locationId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/locations/${locationId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete job location (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   INTERNSHIPS
   ========================================================= */

// Get internships
export async function getRoleInternships(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<InternshipDetails[]> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/internships`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch internships");
  }

  return response.json();
}


// Create internship
export async function createRoleInternship(
  companyId: number,
  eventId: number,
  roleId: number,
  internship: Partial<InternshipDetails>
): Promise<InternshipDetails> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/internships`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(internship),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create internship (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update internship
export async function updateRoleInternship(
  companyId: number,
  eventId: number,
  roleId: number,
  internshipId: number,
  internship: Partial<InternshipDetails>
): Promise<InternshipDetails> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/internships/${internshipId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(internship),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update internship (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete internship
export async function deleteRoleInternship(
  companyId: number,
  eventId: number,
  roleId: number,
  internshipId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/internships/${internshipId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete internship (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   HIRING DOCUMENTS
   ========================================================= */

// Get hiring documents
export async function getHiringDocuments(
  companyId: number,
  eventId: number
): Promise<HiringDocument[]> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/documents`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch hiring documents");
  }

  return response.json();
}


// Create hiring document
export async function createHiringDocument(
  companyId: number,
  eventId: number,
  document: Partial<HiringDocument>
): Promise<HiringDocument> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/documents`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(document),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create hiring document (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update hiring document
export async function updateHiringDocument(
  companyId: number,
  eventId: number,
  documentId: number,
  document: Partial<HiringDocument>
): Promise<HiringDocument> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/documents/${documentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(document),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update hiring document (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete hiring document
export async function deleteHiringDocument(
  companyId: number,
  eventId: number,
  documentId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/documents/${documentId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete hiring document (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   HIRING TIMELINE
   ========================================================= */

// Get hiring timeline
export async function getHiringTimeline(
  companyId: number,
  eventId: number
): Promise<HiringTimeline[]> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/timeline`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch hiring timeline");
  }

  return response.json();
}


// Create timeline stage
export async function createHiringTimeline(
  companyId: number,
  eventId: number,
  timeline: Partial<HiringTimeline>
): Promise<HiringTimeline> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/timeline`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timeline),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create timeline stage (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update timeline stage
export async function updateHiringTimeline(
  companyId: number,
  eventId: number,
  timelineId: number,
  timeline: Partial<HiringTimeline>
): Promise<HiringTimeline> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/timeline/${timelineId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timeline),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update timeline stage (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete timeline stage
export async function deleteHiringTimeline(
  companyId: number,
  eventId: number,
  timelineId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/timeline/${timelineId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete timeline stage (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   ROLE VACANCY
   ========================================================= */

// Get vacancy
export async function getRoleVacancy(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<RoleVacancy> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/vacancy`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch role vacancy");
  }

  return response.json();
}


// Create vacancy
export async function createRoleVacancy(
  companyId: number,
  eventId: number,
  roleId: number,
  vacancy: Partial<RoleVacancy>
): Promise<RoleVacancy> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/vacancy`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vacancy),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create role vacancy (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update vacancy
export async function updateRoleVacancy(
  companyId: number,
  eventId: number,
  roleId: number,
  vacancy: Partial<RoleVacancy>
): Promise<RoleVacancy> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/vacancy`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vacancy),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update role vacancy (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete vacancy
export async function deleteRoleVacancy(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/vacancy`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete role vacancy (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   ROLE SKILLS
   ========================================================= */

// Get skills
export async function getRoleSkills(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<RoleSkills> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/skills`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch role skills");
  }

  return response.json();
}


// Create skills
export async function createRoleSkills(
  companyId: number,
  eventId: number,
  roleId: number,
  skills: Partial<RoleSkills>
): Promise<RoleSkills> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/skills`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skills),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create role skills (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update skills
export async function updateRoleSkills(
  companyId: number,
  eventId: number,
  roleId: number,
  skills: Partial<RoleSkills>
): Promise<RoleSkills> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/skills`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skills),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update role skills (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete skills
export async function deleteRoleSkills(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/skills`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete role skills (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   ROLE APPLICATION REQUIREMENTS
   ========================================================= */

// Get application requirements
export async function getRoleApplicationRequirements(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<RoleApplicationRequirement> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/application-requirements`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch application requirements");
  }

  return response.json();
}


// Create application requirements
export async function createRoleApplicationRequirements(
  companyId: number,
  eventId: number,
  roleId: number,
  requirements: Partial<RoleApplicationRequirement>
): Promise<RoleApplicationRequirement> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/application-requirements`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requirements),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create application requirements (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update application requirements
export async function updateRoleApplicationRequirements(
  companyId: number,
  eventId: number,
  roleId: number,
  requirements: Partial<RoleApplicationRequirement>
): Promise<RoleApplicationRequirement> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/application-requirements`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requirements),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update application requirements (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete application requirements
export async function deleteRoleApplicationRequirements(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/application-requirements`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete application requirements (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   ROLE BOND
   ========================================================= */

// Get bond
export async function getRoleBond(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<RoleBond> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/bond`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch role bond");
  }

  return response.json();
}


// Create bond
export async function createRoleBond(
  companyId: number,
  eventId: number,
  roleId: number,
  bond: Partial<RoleBond>
): Promise<RoleBond> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/bond`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bond),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create role bond (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update bond
export async function updateRoleBond(
  companyId: number,
  eventId: number,
  roleId: number,
  bond: Partial<RoleBond>
): Promise<RoleBond> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/bond`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bond),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update role bond (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete bond
export async function deleteRoleBond(
  companyId: number,
  eventId: number,
  roleId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}/bond`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete role bond (${response.status}): ${responseText}`
    );
  }
}


/* =========================================================
   DATA SOURCES
   ========================================================= */

// Get data sources
export async function getDataSources(
  companyId: number,
  eventId: number
): Promise<DataSource[]> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/sources`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data sources");
  }

  return response.json();
}


// Create data source
export async function createDataSource(
  companyId: number,
  eventId: number,
  source: Partial<DataSource>
): Promise<DataSource> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/sources`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(source),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to create data source (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Update data source
export async function updateDataSource(
  companyId: number,
  eventId: number,
  sourceId: number,
  source: Partial<DataSource>
): Promise<DataSource> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/sources/${sourceId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(source),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to update data source (${response.status}): ${responseText}`
    );
  }

  return JSON.parse(responseText);
}


// Delete data source
export async function deleteDataSource(
  companyId: number,
  eventId: number,
  sourceId: number
): Promise<void> {

  const response = await fetch(
    `${API_URL}/${companyId}/hiring-events/${eventId}/sources/${sourceId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Failed to delete data source (${response.status}): ${responseText}`
    );
  }
}
