"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:8082/api/companies";

// ============================================================
// FORM TYPES
// ============================================================

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

type CompensationForm = {
  ctc: string;
  fixedPay: string;
  variablePay: string;
  joiningBonus: string;
  retentionBonus: string;
  internshipStipend: string;
  salaryPeriod: string;
  currency: string;
  notes: string;
};

type EligibilityForm = {
  minimumCgpa: string;
  minimumPercentage: string;
  maximumBacklogs: string;
  activeBacklogsAllowed: string;
  gapAllowed: string;
  maximumGapYears: string;
  graduationYearFrom: string;
  graduationYearTo: string;
  minimumAge: string;
  maximumAge: string;
  educationRequirement: string;
  additionalRequirements: string;
  notes: string;
};

type EligibleBranchForm = {
  branchName: string;
  branchCode: string;
  notes: string;
};

type SelectionRoundForm = {
  roundNumber: string;
  roundName: string;
  roundType: string;
  description: string;
  durationMinutes: string;
  eliminationRound: string;
  eligibilityToNextRound: string;
  notes: string;
};

type JobLocationForm = {
  locationName: string;
  city: string;
  state: string;
  country: string;
  workMode: string;
  address: string;
  notes: string;
};

type InternshipForm = {
  internshipNumber: string;
  internshipRequired: string;
  durationMonths: string;
  stipend: string;
  stipendPeriod: string;
  ppoOffered: string;
  ppoCriteria: string;
  internshipLocation: string;
  workMode: string;
  description: string;
  notes: string;
};

type RoleVacancyForm = {
  vacancyCount: string;
  selectedCount: string;
  notes: string;
};

type RoleSkillsForm = {
  technicalSkills: string;
  programmingLanguages: string;
  frameworks: string;
  tools: string;
  databases: string;
  softSkills: string;
  otherRequirements: string;
  notes: string;
};

type ApplicationRequirementForm = {
  resumeRequired: string;
  coverLetterRequired: string;
  portfolioRequired: string;
  certificatesRequired: string;
  transcriptRequired: string;
  photoRequired: string;
  otherDocuments: string;
  applicationInstructions: string;
  notes: string;
};

type RoleBondForm = {
  bondRequired: string;
  bondDurationMonths: string;
  bondAmount: string;
  bondStartCondition: string;
  bondTerminationCondition: string;
  bondDocumentRequired: string;
  bondDetails: string;
  notes: string;
};

type JobRoleForm = {
  roleName: string;
  description: string;
  employmentType: string;
  workMode: string;
  department: string;
  responsibilities: string;
  notes: string;
  compensation: CompensationForm;
  eligibility: EligibilityForm;
  eligibleBranches: EligibleBranchForm[];
  selectionRounds: SelectionRoundForm[];
  jobLocations: JobLocationForm[];
  internships: InternshipForm[];
  vacancy: RoleVacancyForm;
  skills: RoleSkillsForm;
  applicationRequirements: ApplicationRequirementForm;
  bond: RoleBondForm;
};

type HiringDocumentForm = {
  documentName: string;
  documentType: string;
  documentUrl: string;
  documentDescription: string;
  official: string;
  documentDate: string;
};

type HiringTimelineForm = {
  sequenceNumber: string;
  stageName: string;
  stageType: string;
  stageDate: string;
  startTime: string;
  endTime: string;
  description: string;
  status: string;
  notes: string;
};

type DataSourceForm = {
  sourceName: string;
  sourceType: string;
  sourceUrl: string;
  sourceDescription: string;
  sourceDate: string;
  official: string;
  verified: string;
  notes: string;
};

type HiringEventForm = {
  academicYear: string;
  driveName: string;
  driveType: string;
  recruitmentType: string;
  status: string;
  registrationStart: string;
  registrationEnd: string;
  prePlacementTalkDate: string;
  driveDate: string;
  resultDate: string;
  joiningDate: string;
  totalVacancies: string;
  totalSelected: string;
  campusLocation: string;
  applicationMethod: string;
  officialNotificationUrl: string;
  notes: string;
  roles: JobRoleForm[];
  documents: HiringDocumentForm[];
  timeline: HiringTimelineForm[];
  sources: DataSourceForm[];
};

// ============================================================
// EMPTY VALUES
// ============================================================

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

const emptyCompensation: CompensationForm = {
  ctc: "",
  fixedPay: "",
  variablePay: "",
  joiningBonus: "",
  retentionBonus: "",
  internshipStipend: "",
  salaryPeriod: "",
  currency: "",
  notes: "",
};

const emptyEligibility: EligibilityForm = {
  minimumCgpa: "",
  minimumPercentage: "",
  maximumBacklogs: "",
  activeBacklogsAllowed: "",
  gapAllowed: "",
  maximumGapYears: "",
  graduationYearFrom: "",
  graduationYearTo: "",
  minimumAge: "",
  maximumAge: "",
  educationRequirement: "",
  additionalRequirements: "",
  notes: "",
};

const emptyBranch: EligibleBranchForm = {
  branchName: "",
  branchCode: "",
  notes: "",
};

const emptyRound: SelectionRoundForm = {
  roundNumber: "",
  roundName: "",
  roundType: "",
  description: "",
  durationMinutes: "",
  eliminationRound: "",
  eligibilityToNextRound: "",
  notes: "",
};

const emptyJobLocation: JobLocationForm = {
  locationName: "",
  city: "",
  state: "",
  country: "",
  workMode: "",
  address: "",
  notes: "",
};

const emptyInternship: InternshipForm = {
  internshipNumber: "",
  internshipRequired: "",
  durationMonths: "",
  stipend: "",
  stipendPeriod: "",
  ppoOffered: "",
  ppoCriteria: "",
  internshipLocation: "",
  workMode: "",
  description: "",
  notes: "",
};

const emptyVacancy: RoleVacancyForm = {
  vacancyCount: "",
  selectedCount: "",
  notes: "",
};

const emptySkills: RoleSkillsForm = {
  technicalSkills: "",
  programmingLanguages: "",
  frameworks: "",
  tools: "",
  databases: "",
  softSkills: "",
  otherRequirements: "",
  notes: "",
};

const emptyApplicationRequirements: ApplicationRequirementForm = {
  resumeRequired: "",
  coverLetterRequired: "",
  portfolioRequired: "",
  certificatesRequired: "",
  transcriptRequired: "",
  photoRequired: "",
  otherDocuments: "",
  applicationInstructions: "",
  notes: "",
};

const emptyBond: RoleBondForm = {
  bondRequired: "",
  bondDurationMonths: "",
  bondAmount: "",
  bondStartCondition: "",
  bondTerminationCondition: "",
  bondDocumentRequired: "",
  bondDetails: "",
  notes: "",
};

const emptyRole = (): JobRoleForm => ({
  roleName: "",
  description: "",
  employmentType: "",
  workMode: "",
  department: "",
  responsibilities: "",
  notes: "",
  compensation: { ...emptyCompensation },
  eligibility: { ...emptyEligibility },
  eligibleBranches: [],
  selectionRounds: [],
  jobLocations: [],
  internships: [],
  vacancy: { ...emptyVacancy },
  skills: { ...emptySkills },
  applicationRequirements: { ...emptyApplicationRequirements },
  bond: { ...emptyBond },
});

const emptyDocument = (): HiringDocumentForm => ({
  documentName: "",
  documentType: "",
  documentUrl: "",
  documentDescription: "",
  official: "",
  documentDate: "",
});

const emptyTimeline = (): HiringTimelineForm => ({
  sequenceNumber: "",
  stageName: "",
  stageType: "",
  stageDate: "",
  startTime: "",
  endTime: "",
  description: "",
  status: "",
  notes: "",
});

const emptySource = (): DataSourceForm => ({
  sourceName: "",
  sourceType: "",
  sourceUrl: "",
  sourceDescription: "",
  sourceDate: "",
  official: "",
  verified: "",
  notes: "",
});

const emptyHiringEvent = (): HiringEventForm => ({
  academicYear: "",
  driveName: "",
  driveType: "",
  recruitmentType: "",
  status: "",
  registrationStart: "",
  registrationEnd: "",
  prePlacementTalkDate: "",
  driveDate: "",
  resultDate: "",
  joiningDate: "",
  totalVacancies: "",
  totalSelected: "",
  campusLocation: "",
  applicationMethod: "",
  officialNotificationUrl: "",
  notes: "",
  roles: [],
  documents: [],
  timeline: [],
  sources: [],
});

// ============================================================
// HELPERS
// ============================================================

function nullableNumber(value: string): number | null {
  return value.trim() === "" ? null : Number(value);
}

function nullableBoolean(value: string): boolean | null {
  if (value === "") return null;
  return value === "true";
}

function localDateTime(value: string): string | null {
  if (!value) return null;
  return value.length === 10 ? `${value}T00:00:00` : value;
}

async function requestJson(
  url: string,
  method: "POST",
  body: unknown
) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Request failed (${response.status}): ${text}`
    );
  }

  return text ? JSON.parse(text) : null;
}

// ============================================================
// PAGE
// ============================================================

export default function CreateCompanyPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [website, setWebsite] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [locations, setLocations] = useState<LocationForm[]>([]);
  const [ownership, setOwnership] = useState<OwnershipForm[]>([]);
  const [financials, setFinancials] = useState<FinancialForm[]>([]);
  const [people, setPeople] = useState<PersonForm[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkForm[]>([]);
  const [hiringEvents, setHiringEvents] = useState<HiringEventForm[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================
  // GENERIC UPDATE HELPERS
  // ==========================================================

  function updateEvent<K extends keyof HiringEventForm>(
    eventIndex: number,
    field: K,
    value: HiringEventForm[K]
  ) {
    setHiringEvents((current) =>
      current.map((item, index) =>
        index === eventIndex
          ? { ...item, [field]: value }
          : item
      )
    );
  }

  function updateRole<K extends keyof JobRoleForm>(
    eventIndex: number,
    roleIndex: number,
    field: K,
    value: JobRoleForm[K]
  ) {
    setHiringEvents((current) =>
      current.map((eventItem, ei) =>
        ei === eventIndex
          ? {
              ...eventItem,
              roles: eventItem.roles.map((roleItem, ri) =>
                ri === roleIndex
                  ? { ...roleItem, [field]: value }
                  : roleItem
              ),
            }
          : eventItem
      )
    );
  }

  function updateRoleChild(
    eventIndex: number,
    roleIndex: number,
    child:
      | "compensation"
      | "eligibility"
      | "vacancy"
      | "skills"
      | "applicationRequirements"
      | "bond",
    field: string,
    value: string
  ) {
    setHiringEvents((current) =>
      current.map((eventItem, ei) =>
        ei === eventIndex
          ? {
              ...eventItem,
              roles: eventItem.roles.map((roleItem, ri) =>
                ri === roleIndex
                  ? {
                      ...roleItem,
                      [child]: {
                        ...(roleItem[child] || {}),
                        [field]: value,
                      },
                    }
                  : roleItem
              ),
            }
          : eventItem
      )
    );
  }

  function updateInternshipField(
    eventIndex: number,
    roleIndex: number,
    internshipIndex: number,
    field: keyof InternshipForm,
    value: string
  ) {
    setHiringEvents((current) =>
      current.map((eventItem, ei) =>
        ei === eventIndex
          ? {
              ...eventItem,
              roles: eventItem.roles.map((roleItem, ri) =>
                ri === roleIndex
                  ? {
                      ...roleItem,
                      internships: roleItem.internships.map(
                        (internshipItem, ii) =>
                          ii === internshipIndex
                            ? {
                                ...internshipItem,
                                [field]: value,
                              }
                            : internshipItem
                      ),
                    }
                  : roleItem
              ),
            }
          : eventItem
      )
    );
  }

  // ==========================================================
  // ADD / REMOVE
  // ==========================================================

  function addHiringEvent() {
    setHiringEvents((current) => [
      ...current,
      emptyHiringEvent(),
    ]);
  }

  function removeHiringEvent(index: number) {
    setHiringEvents((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function addRole(eventIndex: number) {
    setHiringEvents((current) =>
      current.map((eventItem, ei) =>
        ei === eventIndex
          ? {
              ...eventItem,
              roles: [...eventItem.roles, emptyRole()],
            }
          : eventItem
      )
    );
  }

  function removeRole(eventIndex: number, roleIndex: number) {
    setHiringEvents((current) =>
      current.map((eventItem, ei) =>
        ei === eventIndex
          ? {
              ...eventItem,
              roles: eventItem.roles.filter(
                (_, ri) => ri !== roleIndex
              ),
            }
          : eventItem
      )
    );
  }

  function addBranch(eventIndex: number, roleIndex: number) {
    const role = hiringEvents[eventIndex]?.roles[roleIndex];
    if (!role) return;
    updateRole(
      eventIndex,
      roleIndex,
      "eligibleBranches",
      [...role.eligibleBranches, { ...emptyBranch }]
    );
  }

  function removeBranch(eventIndex: number, roleIndex: number, index: number) {
    const role = hiringEvents[eventIndex]?.roles[roleIndex];
    if (!role) return;
    updateRole(
      eventIndex,
      roleIndex,
      "eligibleBranches",
      role.eligibleBranches.filter((_, i) => i !== index)
    );
  }

  function updateBranch(
    eventIndex: number,
    roleIndex: number,
    index: number,
    field: keyof EligibleBranchForm,
    value: string
  ) {
    const role = hiringEvents[eventIndex]?.roles[roleIndex];
    if (!role) return;
    updateRole(
      eventIndex,
      roleIndex,
      "eligibleBranches",
      role.eligibleBranches.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addRound(eventIndex: number, roleIndex: number) {
    const role = hiringEvents[eventIndex]?.roles[roleIndex];
    if (!role) return;
    updateRole(
      eventIndex,
      roleIndex,
      "selectionRounds",
      [...role.selectionRounds, { ...emptyRound }]
    );
  }

  function removeRound(eventIndex: number, roleIndex: number, index: number) {
    const role = hiringEvents[eventIndex]?.roles[roleIndex];
    if (!role) return;
    updateRole(
      eventIndex,
      roleIndex,
      "selectionRounds",
      role.selectionRounds.filter((_, i) => i !== index)
    );
  }

  function updateRound(
    eventIndex: number,
    roleIndex: number,
    index: number,
    field: keyof SelectionRoundForm,
    value: string
  ) {
    const role = hiringEvents[eventIndex]?.roles[roleIndex];
    if (!role) return;
    updateRole(
      eventIndex,
      roleIndex,
      "selectionRounds",
      role.selectionRounds.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addJobLocation(eventIndex: number, roleIndex: number) {
    const role = hiringEvents[eventIndex]?.roles[roleIndex];
    if (!role) return;
    updateRole(
      eventIndex,
      roleIndex,
      "jobLocations",
      [...role.jobLocations, { ...emptyJobLocation }]
    );
  }

  function removeJobLocation(eventIndex: number, roleIndex: number, index: number) {
    const role = hiringEvents[eventIndex]?.roles[roleIndex];
    if (!role) return;
    updateRole(
      eventIndex,
      roleIndex,
      "jobLocations",
      role.jobLocations.filter((_, i) => i !== index)
    );
  }

  function updateJobLocation(
    eventIndex: number,
    roleIndex: number,
    index: number,
    field: keyof JobLocationForm,
    value: string
  ) {
    const role = hiringEvents[eventIndex]?.roles[roleIndex];
    if (!role) return;
    updateRole(
      eventIndex,
      roleIndex,
      "jobLocations",
      role.jobLocations.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addInternship(eventIndex: number, roleIndex: number) {
    const role = hiringEvents[eventIndex]?.roles[roleIndex];
    if (!role) return;
    updateRole(
      eventIndex,
      roleIndex,
      "internships",
      [...role.internships, { ...emptyInternship }]
    );
  }

  function removeInternship(eventIndex: number, roleIndex: number, index: number) {
    const role = hiringEvents[eventIndex]?.roles[roleIndex];
    if (!role) return;
    updateRole(
      eventIndex,
      roleIndex,
      "internships",
      role.internships.filter((_, i) => i !== index)
    );
  }

  function addDocument(eventIndex: number) {
    const item = hiringEvents[eventIndex];
    if (!item) return;
    updateEvent(eventIndex, "documents", [
      ...item.documents,
      emptyDocument(),
    ]);
  }

  function removeDocument(eventIndex: number, index: number) {
    const item = hiringEvents[eventIndex];
    if (!item) return;
    updateEvent(
      eventIndex,
      "documents",
      item.documents.filter((_, i) => i !== index)
    );
  }

  function addTimeline(eventIndex: number) {
    const item = hiringEvents[eventIndex];
    if (!item) return;
    updateEvent(eventIndex, "timeline", [
      ...item.timeline,
      emptyTimeline(),
    ]);
  }

  function removeTimeline(eventIndex: number, index: number) {
    const item = hiringEvents[eventIndex];
    if (!item) return;
    updateEvent(
      eventIndex,
      "timeline",
      item.timeline.filter((_, i) => i !== index)
    );
  }

  function addSource(eventIndex: number) {
    const item = hiringEvents[eventIndex];
    if (!item) return;
    updateEvent(eventIndex, "sources", [
      ...item.sources,
      emptySource(),
    ]);
  }

  function removeSource(eventIndex: number, index: number) {
    const item = hiringEvents[eventIndex];
    if (!item) return;
    updateEvent(
      eventIndex,
      "sources",
      item.sources.filter((_, i) => i !== index)
    );
  }

  // ==========================================================
  // SUBMIT
  // ==========================================================

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const createdCompany = await requestJson(
        API_URL,
        "POST",
        {
          name,
          description: description || null,
          industry: industry || null,
          companyType: companyType || null,
          foundedYear: nullableNumber(foundedYear),
          employeeCount: nullableNumber(employeeCount),
          website: website || null,
          headquarters: headquarters || null,
          logoUrl: logoUrl || null,
        }
      );

      const companyId = createdCompany?.id;

      if (!companyId) {
        throw new Error(
          "Company was created but no company ID was returned."
        );
      }

      // --------------------------------------------------------
      // COMPANY CHILD DATA
      // --------------------------------------------------------

      for (const location of locations) {
        await requestJson(
          `${API_URL}/${companyId}/locations`,
          "POST",
          {
            address: location.address || null,
            city: location.city || null,
            state: location.state || null,
            country: location.country || null,
            postalCode: location.postalCode || null,
            locationType: location.locationType || null,
          }
        );
      }

      for (const owner of ownership) {
        await requestJson(
          `${API_URL}/${companyId}/ownership`,
          "POST",
          {
            ownerName: owner.ownerName || null,
            ownerType: owner.ownerType || null,
            ownershipPercentage: nullableNumber(
              owner.ownershipPercentage
            ),
          }
        );
      }

      for (const financial of financials) {
        await requestJson(
          `${API_URL}/${companyId}/financial`,
          "POST",
          {
            financialYear: financial.financialYear || null,
            revenue: nullableNumber(financial.revenue),
            profit: nullableNumber(financial.profit),
            marketCap: nullableNumber(financial.marketCap),
            currency: financial.currency || null,
          }
        );
      }

      for (const person of people) {
        await requestJson(
          `${API_URL}/${companyId}/persons`,
          "POST",
          {
            name: person.name || null,
            role: person.role || null,
            bio: person.bio || null,
            linkedinUrl: person.linkedinUrl || null,
          }
        );
      }

      for (const social of socialLinks) {
        await requestJson(
          `${API_URL}/${companyId}/social-links`,
          "POST",
          {
            platform: social.platform || null,
            url: social.url || null,
          }
        );
      }

      // --------------------------------------------------------
      // HIRING EVENTS
      // --------------------------------------------------------

      for (const hiringEvent of hiringEvents) {
        const createdEvent = await requestJson(
          `${API_URL}/${companyId}/hiring-events`,
          "POST",
          {
            academicYear: hiringEvent.academicYear,
            driveName: hiringEvent.driveName || null,
            driveType: hiringEvent.driveType || null,
            recruitmentType: hiringEvent.recruitmentType || null,
            status: hiringEvent.status || null,
            registrationStart: localDateTime(
              hiringEvent.registrationStart
            ),
            registrationEnd: localDateTime(
              hiringEvent.registrationEnd
            ),
            prePlacementTalkDate: localDateTime(
              hiringEvent.prePlacementTalkDate
            ),
            driveDate: localDateTime(
              hiringEvent.driveDate
            ),
            resultDate: localDateTime(
              hiringEvent.resultDate
            ),
            joiningDate: localDateTime(
              hiringEvent.joiningDate
            ),
            totalVacancies: nullableNumber(
              hiringEvent.totalVacancies
            ),
            totalSelected: nullableNumber(
              hiringEvent.totalSelected
            ),
            campusLocation: hiringEvent.campusLocation || null,
            applicationMethod: hiringEvent.applicationMethod || null,
            officialNotificationUrl:
              hiringEvent.officialNotificationUrl || null,
            notes: hiringEvent.notes || null,
          }
        );

        const eventId = createdEvent?.id;

        if (!eventId) {
          throw new Error(
            "Hiring event was created but no event ID was returned."
          );
        }

        // ------------------------------------------------------
        // ROLES
        // ------------------------------------------------------

        for (const role of hiringEvent.roles) {
          const createdRole = await requestJson(
            `${API_URL}/${companyId}/hiring-events/${eventId}/roles`,
            "POST",
            {
              roleName: role.roleName,
              description: role.description || null,
              employmentType: role.employmentType || null,
              workMode: role.workMode || null,
              department: role.department || null,
              responsibilities: role.responsibilities || null,
              notes: role.notes || null,
            }
          );

          const roleId = createdRole?.id;

          if (!roleId) {
            throw new Error(
              `Role '${role.roleName || "Unnamed role"}' was created but no role ID was returned.`
            );
          }

          const roleBase =
            `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}`;

          // One-to-one role children
          await requestJson(
            `${roleBase}/compensation`,
            "POST",
            {
              ctc: nullableNumber(role.compensation.ctc),
              fixedPay: nullableNumber(role.compensation.fixedPay),
              variablePay: nullableNumber(role.compensation.variablePay),
              joiningBonus: nullableNumber(role.compensation.joiningBonus),
              retentionBonus: nullableNumber(role.compensation.retentionBonus),
              internshipStipend: nullableNumber(
                role.compensation.internshipStipend
              ),
              salaryPeriod: role.compensation.salaryPeriod || null,
              currency: role.compensation.currency || null,
              notes: role.compensation.notes || null,
            }
          );

          await requestJson(
            `${roleBase}/eligibility`,
            "POST",
            {
              minimumCgpa: nullableNumber(role.eligibility.minimumCgpa),
              minimumPercentage: nullableNumber(
                role.eligibility.minimumPercentage
              ),
              maximumBacklogs: nullableNumber(
                role.eligibility.maximumBacklogs
              ),
              activeBacklogsAllowed: nullableBoolean(
                role.eligibility.activeBacklogsAllowed
              ),
              gapAllowed: nullableBoolean(
                role.eligibility.gapAllowed
              ),
              maximumGapYears: nullableNumber(
                role.eligibility.maximumGapYears
              ),
              graduationYearFrom: nullableNumber(
                role.eligibility.graduationYearFrom
              ),
              graduationYearTo: nullableNumber(
                role.eligibility.graduationYearTo
              ),
              minimumAge: nullableNumber(role.eligibility.minimumAge),
              maximumAge: nullableNumber(role.eligibility.maximumAge),
              educationRequirement:
                role.eligibility.educationRequirement || null,
              additionalRequirements:
                role.eligibility.additionalRequirements || null,
              notes: role.eligibility.notes || null,
            }
          );

          await requestJson(
            `${roleBase}/vacancy`,
            "POST",
            {
              vacancyCount: nullableNumber(role.vacancy.vacancyCount),
              selectedCount: nullableNumber(role.vacancy.selectedCount),
              notes: role.vacancy.notes || null,
            }
          );

          await requestJson(
            `${roleBase}/skills`,
            "POST",
            {
              ...role.skills,
              technicalSkills: role.skills.technicalSkills || null,
              programmingLanguages:
                role.skills.programmingLanguages || null,
              frameworks: role.skills.frameworks || null,
              tools: role.skills.tools || null,
              databases: role.skills.databases || null,
              softSkills: role.skills.softSkills || null,
              otherRequirements:
                role.skills.otherRequirements || null,
              notes: role.skills.notes || null,
            }
          );

          await requestJson(
            `${roleBase}/application-requirements`,
            "POST",
            {
              resumeRequired: nullableBoolean(
                role.applicationRequirements.resumeRequired
              ),
              coverLetterRequired: nullableBoolean(
                role.applicationRequirements.coverLetterRequired
              ),
              portfolioRequired: nullableBoolean(
                role.applicationRequirements.portfolioRequired
              ),
              certificatesRequired: nullableBoolean(
                role.applicationRequirements.certificatesRequired
              ),
              transcriptRequired: nullableBoolean(
                role.applicationRequirements.transcriptRequired
              ),
              photoRequired: nullableBoolean(
                role.applicationRequirements.photoRequired
              ),
              otherDocuments:
                role.applicationRequirements.otherDocuments || null,
              applicationInstructions:
                role.applicationRequirements.applicationInstructions || null,
              notes: role.applicationRequirements.notes || null,
            }
          );

          await requestJson(
            `${roleBase}/bond`,
            "POST",
            {
              bondRequired: nullableBoolean(role.bond.bondRequired),
              bondDurationMonths: nullableNumber(
                role.bond.bondDurationMonths
              ),
              bondAmount: nullableNumber(role.bond.bondAmount),
              bondStartCondition:
                role.bond.bondStartCondition || null,
              bondTerminationCondition:
                role.bond.bondTerminationCondition || null,
              bondDocumentRequired: nullableBoolean(
                role.bond.bondDocumentRequired
              ),
              bondDetails: role.bond.bondDetails || null,
              notes: role.bond.notes || null,
            }
          );

          // One-to-many role children
          for (const branch of role.eligibleBranches) {
            await requestJson(
              `${roleBase}/eligible-branches`,
              "POST",
              {
                branchName: branch.branchName || null,
                branchCode: branch.branchCode || null,
                notes: branch.notes || null,
              }
            );
          }

          for (const round of role.selectionRounds) {
            await requestJson(
              `${roleBase}/selection-rounds`,
              "POST",
              {
                roundNumber: nullableNumber(round.roundNumber),
                roundName: round.roundName || null,
                roundType: round.roundType || null,
                description: round.description || null,
                durationMinutes: nullableNumber(
                  round.durationMinutes
                ),
                eliminationRound: nullableBoolean(
                  round.eliminationRound
                ),
                eligibilityToNextRound:
                  round.eligibilityToNextRound || null,
                notes: round.notes || null,
              }
            );
          }

          for (const location of role.jobLocations) {
            await requestJson(
              `${roleBase}/locations`,
              "POST",
              {
                locationName: location.locationName || null,
                city: location.city || null,
                state: location.state || null,
                country: location.country || null,
                workMode: location.workMode || null,
                address: location.address || null,
                notes: location.notes || null,
              }
            );
          }

          for (const internship of role.internships) {
            await requestJson(
              `${roleBase}/internships`,
              "POST",
              {
                internshipNumber: nullableNumber(
                  internship.internshipNumber
                ),
                internshipRequired: nullableBoolean(
                  internship.internshipRequired
                ),
                durationMonths: nullableNumber(
                  internship.durationMonths
                ),
                stipend: nullableNumber(internship.stipend),
                stipendPeriod: internship.stipendPeriod || null,
                ppoOffered: nullableBoolean(internship.ppoOffered),
                ppoCriteria: internship.ppoCriteria || null,
                internshipLocation:
                  internship.internshipLocation || null,
                workMode: internship.workMode || null,
                description: internship.description || null,
                notes: internship.notes || null,
              }
            );
          }
        }

        // ------------------------------------------------------
        // EVENT DOCUMENTS
        // ------------------------------------------------------

        for (const document of hiringEvent.documents) {
          await requestJson(
            `${API_URL}/${companyId}/hiring-events/${eventId}/documents`,
            "POST",
            {
              documentName: document.documentName || null,
              documentType: document.documentType || null,
              documentUrl: document.documentUrl || null,
              documentDescription:
                document.documentDescription || null,
              official: nullableBoolean(document.official),
              documentDate: localDateTime(document.documentDate),
            }
          );
        }

        // ------------------------------------------------------
        // EVENT TIMELINE
        // ------------------------------------------------------

        for (const timeline of hiringEvent.timeline) {
          await requestJson(
            `${API_URL}/${companyId}/hiring-events/${eventId}/timeline`,
            "POST",
            {
              sequenceNumber: nullableNumber(
                timeline.sequenceNumber
              ),
              stageName: timeline.stageName || null,
              stageType: timeline.stageType || null,
              stageDate: localDateTime(timeline.stageDate),
              startTime: timeline.startTime || null,
              endTime: timeline.endTime || null,
              description: timeline.description || null,
              status: timeline.status || null,
              notes: timeline.notes || null,
            }
          );
        }

        // ------------------------------------------------------
        // EVENT SOURCES
        // Correct backend path: /sources
        // ------------------------------------------------------

        for (const source of hiringEvent.sources) {
          await requestJson(
            `${API_URL}/${companyId}/hiring-events/${eventId}/sources`,
            "POST",
            {
              sourceName: source.sourceName || null,
              sourceType: source.sourceType || null,
              sourceUrl: source.sourceUrl || null,
              sourceDescription: source.sourceDescription || null,
              sourceDate: localDateTime(source.sourceDate),
              official: nullableBoolean(source.official),
              verified: nullableBoolean(source.verified),
              notes: source.notes || null,
            }
          );
        }
      }

      router.push("/admin");
    } catch (err) {
      console.error("Create company error:", err);

      if (err instanceof TypeError) {
        setError("Unable to connect to the backend.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to create company.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // UI HELPERS
  // ============================================================

  const inputClass =
    "neo-inset w-full rounded-2xl px-5 py-4 outline-none";

  const buttonClass =
    "neo-button rounded-2xl px-5 py-3 font-semibold";

  return (
    <main className="min-h-screen px-6 py-8">
      <nav className="neo mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-8 py-5">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="text-2xl font-bold"
        >
          ComCon
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin")}
          className={buttonClass}
        >
          Back to Admin
        </button>
      </nav>

      <section className="mx-auto mt-16 max-w-6xl">
        <h2 className="text-5xl font-bold tracking-tight">
          Create Company
        </h2>
        <p className="mt-4 text-lg opacity-70">
          Add complete company information and campus hiring data to ComCon.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 max-w-6xl"
      >
        {/* ====================================================
            1. BASIC INFORMATION
        ==================================================== */}
        <section className="neo rounded-3xl p-10">
          <h3 className="text-2xl font-bold">1. Basic Information</h3>
          <p className="mt-2 opacity-60">General company information.</p>

          <div className="mt-8">
            <label className="mb-2 block font-semibold">Company Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter company name"
              className={inputClass}
            />
          </div>

          <div className="mt-6">
            <label className="mb-2 block font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Describe the company"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Industry"
              className={inputClass}
            />
            <input
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              placeholder="Company Type"
              className={inputClass}
            />
            <input
              type="number"
              value={foundedYear}
              onChange={(e) => setFoundedYear(e.target.value)}
              placeholder="Founded Year"
              className={inputClass}
            />
            <input
              type="number"
              value={employeeCount}
              onChange={(e) => setEmployeeCount(e.target.value)}
              placeholder="Employee Count"
              className={inputClass}
            />
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Website"
              className={inputClass}
            />
            <input
              value={headquarters}
              onChange={(e) => setHeadquarters(e.target.value)}
              placeholder="Headquarters"
              className={inputClass}
            />
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="Logo URL"
              className={`${inputClass} md:col-span-2`}
            />
          </div>
        </section>

        {/* ====================================================
            2. LOCATIONS
        ==================================================== */}
        <section className="neo mt-8 rounded-3xl p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">2. Locations</h3>
              <p className="mt-2 opacity-60">Company offices and locations.</p>
            </div>
            <button
              type="button"
              className={buttonClass}
              onClick={() => setLocations((c) => [...c, { ...emptyLocation }])}
            >
              + Add Location
            </button>
          </div>

          <div className="mt-8 space-y-6">
            {locations.map((location, index) => (
              <div key={index} className="neo-inset rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold">Location {index + 1}</h4>
                  <button
                    type="button"
                    className="neo-button rounded-xl px-4 py-2 text-sm"
                    onClick={() =>
                      setLocations((c) => c.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {(
                    [
                      ["address", "Address"],
                      ["city", "City"],
                      ["state", "State"],
                      ["country", "Country"],
                      ["postalCode", "Postal Code"],
                      ["locationType", "Location Type"],
                    ] as const
                  ).map(([field, placeholder]) => (
                    <input
                      key={field}
                      value={location[field]}
                      onChange={(e) =>
                        setLocations((current) =>
                          current.map((item, i) =>
                            i === index
                              ? { ...item, [field]: e.target.value }
                              : item
                          )
                        )
                      }
                      placeholder={placeholder}
                      className={inputClass}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            3. OWNERSHIP
        ==================================================== */}
        <section className="neo mt-8 rounded-3xl p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">3. Ownership</h3>
              <p className="mt-2 opacity-60">Owners and ownership percentages.</p>
            </div>
            <button
              type="button"
              className={buttonClass}
              onClick={() => setOwnership((c) => [...c, { ...emptyOwnership }])}
            >
              + Add Owner
            </button>
          </div>

          <div className="mt-8 space-y-6">
            {ownership.map((owner, index) => (
              <div key={index} className="neo-inset rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold">Owner {index + 1}</h4>
                  <button
                    type="button"
                    className="neo-button rounded-xl px-4 py-2 text-sm"
                    onClick={() =>
                      setOwnership((c) => c.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <input
                    value={owner.ownerName}
                    onChange={(e) =>
                      setOwnership((c) =>
                        c.map((item, i) =>
                          i === index
                            ? { ...item, ownerName: e.target.value }
                            : item
                        )
                      )
                    }
                    placeholder="Owner Name"
                    className={inputClass}
                  />
                  <input
                    value={owner.ownerType}
                    onChange={(e) =>
                      setOwnership((c) =>
                        c.map((item, i) =>
                          i === index
                            ? { ...item, ownerType: e.target.value }
                            : item
                        )
                      )
                    }
                    placeholder="Owner Type"
                    className={inputClass}
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={owner.ownershipPercentage}
                    onChange={(e) =>
                      setOwnership((c) =>
                        c.map((item, i) =>
                          i === index
                            ? {
                                ...item,
                                ownershipPercentage: e.target.value,
                              }
                            : item
                        )
                      )
                    }
                    placeholder="Ownership %"
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            4. FINANCIALS
        ==================================================== */}
        <section className="neo mt-8 rounded-3xl p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">4. Financials</h3>
              <p className="mt-2 opacity-60">Financial information by year.</p>
            </div>
            <button
              type="button"
              className={buttonClass}
              onClick={() => setFinancials((c) => [...c, { ...emptyFinancial }])}
            >
              + Add Financial Year
            </button>
          </div>

          <div className="mt-8 space-y-6">
            {financials.map((financial, index) => (
              <div key={index} className="neo-inset rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold">Financial Year {index + 1}</h4>
                  <button
                    type="button"
                    className="neo-button rounded-xl px-4 py-2 text-sm"
                    onClick={() =>
                      setFinancials((c) => c.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {(
                    [
                      ["financialYear", "Financial Year"],
                      ["currency", "Currency"],
                      ["revenue", "Revenue"],
                      ["profit", "Profit"],
                      ["marketCap", "Market Cap"],
                    ] as const
                  ).map(([field, placeholder]) => (
                    <input
                      key={field}
                      type={field === "financialYear" || field === "currency" ? "text" : "number"}
                      value={financial[field]}
                      onChange={(e) =>
                        setFinancials((current) =>
                          current.map((item, i) =>
                            i === index
                              ? { ...item, [field]: e.target.value }
                              : item
                          )
                        )
                      }
                      placeholder={placeholder}
                      className={`${inputClass} ${field === "marketCap" ? "md:col-span-2" : ""}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            5. PEOPLE
        ==================================================== */}
        <section className="neo mt-8 rounded-3xl p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">5. People</h3>
              <p className="mt-2 opacity-60">Executives, founders and important people.</p>
            </div>
            <button
              type="button"
              className={buttonClass}
              onClick={() => setPeople((c) => [...c, { ...emptyPerson }])}
            >
              + Add Person
            </button>
          </div>

          <div className="mt-8 space-y-6">
            {people.map((person, index) => (
              <div key={index} className="neo-inset rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold">Person {index + 1}</h4>
                  <button
                    type="button"
                    className="neo-button rounded-xl px-4 py-2 text-sm"
                    onClick={() =>
                      setPeople((c) => c.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <input
                    value={person.name}
                    onChange={(e) =>
                      setPeople((c) =>
                        c.map((item, i) =>
                          i === index ? { ...item, name: e.target.value } : item
                        )
                      )
                    }
                    placeholder="Name"
                    className={inputClass}
                  />
                  <input
                    value={person.role}
                    onChange={(e) =>
                      setPeople((c) =>
                        c.map((item, i) =>
                          i === index ? { ...item, role: e.target.value } : item
                        )
                      )
                    }
                    placeholder="Role"
                    className={inputClass}
                  />
                  <textarea
                    value={person.bio}
                    onChange={(e) =>
                      setPeople((c) =>
                        c.map((item, i) =>
                          i === index ? { ...item, bio: e.target.value } : item
                        )
                      )
                    }
                    rows={4}
                    placeholder="Biography"
                    className={`${inputClass} resize-none md:col-span-2`}
                  />
                  <input
                    type="url"
                    value={person.linkedinUrl}
                    onChange={(e) =>
                      setPeople((c) =>
                        c.map((item, i) =>
                          i === index
                            ? { ...item, linkedinUrl: e.target.value }
                            : item
                        )
                      )
                    }
                    placeholder="LinkedIn URL"
                    className={`${inputClass} md:col-span-2`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            6. SOCIAL LINKS
        ==================================================== */}
        <section className="neo mt-8 rounded-3xl p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">6. Social Links</h3>
              <p className="mt-2 opacity-60">Company social profiles.</p>
            </div>
            <button
              type="button"
              className={buttonClass}
              onClick={() => setSocialLinks((c) => [...c, { ...emptySocialLink }])}
            >
              + Add Social Link
            </button>
          </div>

          <div className="mt-8 space-y-6">
            {socialLinks.map((social, index) => (
              <div key={index} className="neo-inset rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold">Social Link {index + 1}</h4>
                  <button
                    type="button"
                    className="neo-button rounded-xl px-4 py-2 text-sm"
                    onClick={() =>
                      setSocialLinks((c) => c.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <input
                    value={social.platform}
                    onChange={(e) =>
                      setSocialLinks((c) =>
                        c.map((item, i) =>
                          i === index
                            ? { ...item, platform: e.target.value }
                            : item
                        )
                      )
                    }
                    placeholder="Platform"
                    className={inputClass}
                  />
                  <input
                    type="url"
                    value={social.url}
                    onChange={(e) =>
                      setSocialLinks((c) =>
                        c.map((item, i) =>
                          i === index ? { ...item, url: e.target.value } : item
                        )
                      )
                    }
                    placeholder="URL"
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            7. CAMPUS HIRING EVENTS
        ==================================================== */}
        <section className="neo mt-8 rounded-3xl p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">7. Campus Hiring Events</h3>
              <p className="mt-2 opacity-60">
                Each event can have its own roles, documents, timeline and sources.
              </p>
            </div>
            <button
              type="button"
              className={buttonClass}
              onClick={addHiringEvent}
            >
              + Add Hiring Event
            </button>
          </div>
        </section>

        {hiringEvents.map((hiringEvent, eventIndex) => (
          <section
            key={eventIndex}
            className="neo mt-8 rounded-3xl p-10"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold">
                  Hiring Event {eventIndex + 1}
                </h3>
                <p className="mt-2 opacity-60">
                  Event-level recruitment information.
                </p>
              </div>
              <button
                type="button"
                className="neo-button rounded-xl px-4 py-2"
                onClick={() => removeHiringEvent(eventIndex)}
              >
                Remove Event
              </button>
            </div>

            {/* EVENT */}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <input
                required
                value={hiringEvent.academicYear}
                onChange={(e) =>
                  updateEvent(eventIndex, "academicYear", e.target.value)
                }
                placeholder="Academic Year (e.g. 2025-26)"
                className={inputClass}
              />
              <input
                value={hiringEvent.driveName}
                onChange={(e) => updateEvent(eventIndex, "driveName", e.target.value)}
                placeholder="Drive Name"
                className={inputClass}
              />
              <input
                value={hiringEvent.driveType}
                onChange={(e) => updateEvent(eventIndex, "driveType", e.target.value)}
                placeholder="Drive Type"
                className={inputClass}
              />
              <input
                value={hiringEvent.recruitmentType}
                onChange={(e) => updateEvent(eventIndex, "recruitmentType", e.target.value)}
                placeholder="Recruitment Type"
                className={inputClass}
              />
              <input
                value={hiringEvent.status}
                onChange={(e) => updateEvent(eventIndex, "status", e.target.value)}
                placeholder="Status"
                className={inputClass}
              />
              <input
                value={hiringEvent.campusLocation}
                onChange={(e) => updateEvent(eventIndex, "campusLocation", e.target.value)}
                placeholder="Campus Location"
                className={inputClass}
              />
              <input
                value={hiringEvent.applicationMethod}
                onChange={(e) => updateEvent(eventIndex, "applicationMethod", e.target.value)}
                placeholder="Application Method"
                className={inputClass}
              />
              <input
                type="url"
                value={hiringEvent.officialNotificationUrl}
                onChange={(e) => updateEvent(eventIndex, "officialNotificationUrl", e.target.value)}
                placeholder="Official Notification URL"
                className={inputClass}
              />

              {(
                [
                  ["registrationStart", "Registration Start"],
                  ["registrationEnd", "Registration End"],
                  ["prePlacementTalkDate", "Pre-Placement Talk"],
                  ["driveDate", "Drive Date"],
                  ["resultDate", "Result Date"],
                  ["joiningDate", "Joining Date"],
                ] as const
              ).map(([field, placeholder]) => (
                <div key={field}>
                  <label className="mb-2 block text-sm font-semibold opacity-70">
                    {placeholder}
                  </label>
                  <input
                    type="datetime-local"
                    value={hiringEvent[field]}
                    onChange={(e) =>
                      updateEvent(eventIndex, field, e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              ))}

              <input
                type="number"
                value={hiringEvent.totalVacancies}
                onChange={(e) => updateEvent(eventIndex, "totalVacancies", e.target.value)}
                placeholder="Total Vacancies"
                className={inputClass}
              />
              <input
                type="number"
                value={hiringEvent.totalSelected}
                onChange={(e) => updateEvent(eventIndex, "totalSelected", e.target.value)}
                placeholder="Total Selected"
                className={inputClass}
              />
              <textarea
                value={hiringEvent.notes}
                onChange={(e) => updateEvent(eventIndex, "notes", e.target.value)}
                placeholder="Event Notes"
                rows={4}
                className={`${inputClass} resize-none md:col-span-2`}
              />
            </div>

            {/* ROLES */}
            <div className="mt-10 border-t pt-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-bold">Roles</h4>
                  <p className="mt-1 opacity-60">
                    Roles are separate JobRole records linked to this event.
                  </p>
                </div>
                <button
                  type="button"
                  className={buttonClass}
                  onClick={() => addRole(eventIndex)}
                >
                  + Add Role
                </button>
              </div>

              <div className="mt-8 space-y-8">
                {hiringEvent.roles.map((role, roleIndex) => (
                  <div key={roleIndex} className="neo-inset rounded-3xl p-7">
                    <div className="flex items-center justify-between gap-4">
                      <h5 className="text-xl font-bold">
                        Role {roleIndex + 1}
                      </h5>
                      <button
                        type="button"
                        className="neo-button rounded-xl px-4 py-2 text-sm"
                        onClick={() => removeRole(eventIndex, roleIndex)}
                      >
                        Remove Role
                      </button>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {(
                        [
                          ["roleName", "Role Name"],
                          ["employmentType", "Employment Type"],
                          ["workMode", "Work Mode"],
                          ["department", "Department"],
                        ] as const
                      ).map(([field, placeholder]) => (
                        <input
                          key={field}
                          value={role[field]}
                          onChange={(e) =>
                            updateRole(eventIndex, roleIndex, field, e.target.value)
                          }
                          placeholder={placeholder}
                          className={inputClass}
                        />
                      ))}
                      <textarea
                        value={role.description}
                        onChange={(e) =>
                          updateRole(eventIndex, roleIndex, "description", e.target.value)
                        }
                        placeholder="Role Description"
                        rows={4}
                        className={`${inputClass} resize-none md:col-span-2`}
                      />
                      <textarea
                        value={role.responsibilities}
                        onChange={(e) =>
                          updateRole(eventIndex, roleIndex, "responsibilities", e.target.value)
                        }
                        placeholder="Responsibilities"
                        rows={4}
                        className={`${inputClass} resize-none md:col-span-2`}
                      />
                      <textarea
                        value={role.notes}
                        onChange={(e) =>
                          updateRole(eventIndex, roleIndex, "notes", e.target.value)
                        }
                        placeholder="Role Notes"
                        rows={3}
                        className={`${inputClass} resize-none md:col-span-2`}
                      />
                    </div>

                    {/* COMPENSATION */}
                    <div className="mt-8 border-t pt-8">
                      <h6 className="font-bold">Compensation</h6>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {(
                          [
                            ["ctc", "CTC"],
                            ["fixedPay", "Fixed Pay"],
                            ["variablePay", "Variable Pay"],
                            ["joiningBonus", "Joining Bonus"],
                            ["retentionBonus", "Retention Bonus"],
                            ["internshipStipend", "Internship Stipend"],
                            ["salaryPeriod", "Salary Period"],
                            ["currency", "Currency"],
                          ] as const
                        ).map(([field, placeholder]) => (
                          <input
                            key={field}
                            type={field === "currency" || field === "salaryPeriod" ? "text" : "number"}
                            step={field === "currency" || field === "salaryPeriod" ? undefined : "0.01"}
                            value={role.compensation[field]}
                            onChange={(e) =>
                              updateRoleChild(
                                eventIndex,
                                roleIndex,
                                "compensation",
                                field,
                                e.target.value
                              )
                            }
                            placeholder={placeholder}
                            className={inputClass}
                          />
                        ))}
                        <textarea
                          value={role.compensation.notes}
                          onChange={(e) =>
                            updateRoleChild(eventIndex, roleIndex, "compensation", "notes", e.target.value)
                          }
                          placeholder="Compensation Notes"
                          rows={3}
                          className={`${inputClass} resize-none md:col-span-2`}
                        />
                      </div>
                    </div>

                    {/* ELIGIBILITY */}
                    <div className="mt-8 border-t pt-8">
                      <h6 className="font-bold">Eligibility</h6>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {(
                          [
                            ["minimumCgpa", "Minimum CGPA"],
                            ["minimumPercentage", "Minimum Percentage"],
                            ["maximumBacklogs", "Maximum Backlogs"],
                            ["activeBacklogsAllowed", "Active Backlogs Allowed"],
                            ["gapAllowed", "Gap Allowed"],
                            ["maximumGapYears", "Maximum Gap Years"],
                            ["graduationYearFrom", "Graduation Year From"],
                            ["graduationYearTo", "Graduation Year To"],
                            ["minimumAge", "Minimum Age"],
                            ["maximumAge", "Maximum Age"],
                          ] as const
                        ).map(([field, placeholder]) => (
                          <input
                            key={field}
                            type={field === "activeBacklogsAllowed" || field === "gapAllowed" ? "text" : "number"}
                            value={role.eligibility[field]}
                            onChange={(e) =>
                              updateRoleChild(eventIndex, roleIndex, "eligibility", field, e.target.value)
                            }
                            placeholder={`${placeholder}${field === "activeBacklogsAllowed" || field === "gapAllowed" ? " (true/false)" : ""}`}
                            className={inputClass}
                          />
                        ))}
                        <textarea
                          value={role.eligibility.educationRequirement}
                          onChange={(e) =>
                            updateRoleChild(eventIndex, roleIndex, "eligibility", "educationRequirement", e.target.value)
                          }
                          placeholder="Education Requirement"
                          rows={3}
                          className={`${inputClass} resize-none md:col-span-2`}
                        />
                        <textarea
                          value={role.eligibility.additionalRequirements}
                          onChange={(e) =>
                            updateRoleChild(eventIndex, roleIndex, "eligibility", "additionalRequirements", e.target.value)
                          }
                          placeholder="Additional Requirements"
                          rows={3}
                          className={`${inputClass} resize-none md:col-span-2`}
                        />
                        <textarea
                          value={role.eligibility.notes}
                          onChange={(e) =>
                            updateRoleChild(eventIndex, roleIndex, "eligibility", "notes", e.target.value)
                          }
                          placeholder="Eligibility Notes"
                          rows={3}
                          className={`${inputClass} resize-none md:col-span-2`}
                        />
                      </div>
                    </div>

                    {/* BRANCHES */}
                    <div className="mt-8 border-t pt-8">
                      <div className="flex items-center justify-between gap-4">
                        <h6 className="font-bold">Eligible Branches</h6>
                        <button
                          type="button"
                          className="neo-button rounded-xl px-4 py-2 text-sm"
                          onClick={() => addBranch(eventIndex, roleIndex)}
                        >
                          + Add Branch
                        </button>
                      </div>
                      <div className="mt-4 space-y-4">
                        {role.eligibleBranches.map((branch, index) => (
                          <div key={index} className="neo-inset rounded-2xl p-4">
                            <div className="flex justify-between">
                              <span className="font-semibold">Branch {index + 1}</span>
                              <button
                                type="button"
                                className="text-sm underline"
                                onClick={() => removeBranch(eventIndex, roleIndex, index)}
                              >
                                Remove
                              </button>
                            </div>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              <input
                                value={branch.branchName}
                                onChange={(e) => updateBranch(eventIndex, roleIndex, index, "branchName", e.target.value)}
                                placeholder="Branch Name"
                                className={inputClass}
                              />
                              <input
                                value={branch.branchCode}
                                onChange={(e) => updateBranch(eventIndex, roleIndex, index, "branchCode", e.target.value)}
                                placeholder="Branch Code"
                                className={inputClass}
                              />
                              <input
                                value={branch.notes}
                                onChange={(e) => updateBranch(eventIndex, roleIndex, index, "notes", e.target.value)}
                                placeholder="Notes"
                                className={`${inputClass} md:col-span-2`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SELECTION ROUNDS */}
                    <div className="mt-8 border-t pt-8">
                      <div className="flex items-center justify-between gap-4">
                        <h6 className="font-bold">Selection Rounds</h6>
                        <button
                          type="button"
                          className="neo-button rounded-xl px-4 py-2 text-sm"
                          onClick={() => addRound(eventIndex, roleIndex)}
                        >
                          + Add Round
                        </button>
                      </div>
                      <div className="mt-4 space-y-4">
                        {role.selectionRounds.map((round, index) => (
                          <div key={index} className="neo-inset rounded-2xl p-4">
                            <div className="flex justify-between">
                              <span className="font-semibold">Round {index + 1}</span>
                              <button
                                type="button"
                                className="text-sm underline"
                                onClick={() => removeRound(eventIndex, roleIndex, index)}
                              >
                                Remove
                              </button>
                            </div>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              <input
                                type="number"
                                value={round.roundNumber}
                                onChange={(e) => updateRound(eventIndex, roleIndex, index, "roundNumber", e.target.value)}
                                placeholder="Round Number"
                                className={inputClass}
                              />
                              <input
                                value={round.roundName}
                                onChange={(e) => updateRound(eventIndex, roleIndex, index, "roundName", e.target.value)}
                                placeholder="Round Name"
                                className={inputClass}
                              />
                              <input
                                value={round.roundType}
                                onChange={(e) => updateRound(eventIndex, roleIndex, index, "roundType", e.target.value)}
                                placeholder="Round Type"
                                className={inputClass}
                              />
                              <input
                                type="number"
                                value={round.durationMinutes}
                                onChange={(e) => updateRound(eventIndex, roleIndex, index, "durationMinutes", e.target.value)}
                                placeholder="Duration (minutes)"
                                className={inputClass}
                              />
                              <input
                                value={round.eliminationRound}
                                onChange={(e) => updateRound(eventIndex, roleIndex, index, "eliminationRound", e.target.value)}
                                placeholder="Elimination Round (true/false)"
                                className={inputClass}
                              />
                              <input
                                value={round.eligibilityToNextRound}
                                onChange={(e) => updateRound(eventIndex, roleIndex, index, "eligibilityToNextRound", e.target.value)}
                                placeholder="Eligibility To Next Round"
                                className={inputClass}
                              />
                              <textarea
                                value={round.description}
                                onChange={(e) => updateRound(eventIndex, roleIndex, index, "description", e.target.value)}
                                placeholder="Description"
                                rows={3}
                                className={`${inputClass} resize-none md:col-span-2`}
                              />
                              <textarea
                                value={round.notes}
                                onChange={(e) => updateRound(eventIndex, roleIndex, index, "notes", e.target.value)}
                                placeholder="Notes"
                                rows={3}
                                className={`${inputClass} resize-none md:col-span-2`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* JOB LOCATIONS */}
                    <div className="mt-8 border-t pt-8">
                      <div className="flex items-center justify-between gap-4">
                        <h6 className="font-bold">Job Locations</h6>
                        <button
                          type="button"
                          className="neo-button rounded-xl px-4 py-2 text-sm"
                          onClick={() => addJobLocation(eventIndex, roleIndex)}
                        >
                          + Add Location
                        </button>
                      </div>
                      <div className="mt-4 space-y-4">
                        {role.jobLocations.map((location, index) => (
                          <div key={index} className="neo-inset rounded-2xl p-4">
                            <div className="flex justify-between">
                              <span className="font-semibold">Job Location {index + 1}</span>
                              <button
                                type="button"
                                className="text-sm underline"
                                onClick={() => removeJobLocation(eventIndex, roleIndex, index)}
                              >
                                Remove
                              </button>
                            </div>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              {(
                                [
                                  ["locationName", "Location Name"],
                                  ["city", "City"],
                                  ["state", "State"],
                                  ["country", "Country"],
                                  ["workMode", "Work Mode"],
                                  ["address", "Address"],
                                  ["notes", "Notes"],
                                ] as const
                              ).map(([field, placeholder]) => (
                                <input
                                  key={field}
                                  value={location[field]}
                                  onChange={(e) => updateJobLocation(eventIndex, roleIndex, index, field, e.target.value)}
                                  placeholder={placeholder}
                                  className={`${inputClass} ${field === "notes" ? "md:col-span-2" : ""}`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* INTERNSHIPS */}
                    <div className="mt-8 border-t pt-8">
                      <div className="flex items-center justify-between gap-4">
                        <h6 className="font-bold">Internships</h6>
                        <button
                          type="button"
                          className="neo-button rounded-xl px-4 py-2 text-sm"
                          onClick={() => addInternship(eventIndex, roleIndex)}
                        >
                          + Add Internship
                        </button>
                      </div>
                      <div className="mt-4 space-y-4">
                        {role.internships.map((internship, index) => (
                          <div key={index} className="neo-inset rounded-2xl p-4">
                            <div className="flex justify-between">
                              <span className="font-semibold">Internship {index + 1}</span>
                              <button
                                type="button"
                                className="text-sm underline"
                                onClick={() => removeInternship(eventIndex, roleIndex, index)}
                              >
                                Remove
                              </button>
                            </div>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              {(
                                [
                                  ["internshipNumber", "Internship Number", "number"],
                                  ["internshipRequired", "Internship Required (true/false)", "text"],
                                  ["durationMonths", "Duration (Months)", "number"],
                                  ["stipend", "Stipend", "number"],
                                  ["stipendPeriod", "Stipend Period", "text"],
                                  ["ppoOffered", "PPO Offered (true/false)", "text"],
                                  ["ppoCriteria", "PPO Criteria", "text"],
                                  ["internshipLocation", "Internship Location", "text"],
                                  ["workMode", "Work Mode", "text"],
                                ] as const
                              ).map(([field, placeholder, type]) => (
                                <input
                                  key={field}
                                  type={type}
                                  value={internship[field]}
                                  onChange={(e) => updateInternshipField(eventIndex, roleIndex, index, field, e.target.value)}
                                  placeholder={placeholder}
                                  className={inputClass}
                                />
                              ))}
                              <textarea
                                value={internship.description}
                                onChange={(e) => updateInternshipField(eventIndex, roleIndex, index, "description", e.target.value)}
                                placeholder="Internship Description"
                                rows={3}
                                className={`${inputClass} resize-none md:col-span-2`}
                              />
                              <textarea
                                value={internship.notes}
                                onChange={(e) => updateInternshipField(eventIndex, roleIndex, index, "notes", e.target.value)}
                                placeholder="Internship Notes"
                                rows={3}
                                className={`${inputClass} resize-none md:col-span-2`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* VACANCY */}
                    <div className="mt-8 border-t pt-8">
                      <h6 className="font-bold">Vacancy</h6>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <input
                          type="number"
                          value={role.vacancy.vacancyCount}
                          onChange={(e) => updateRoleChild(eventIndex, roleIndex, "vacancy", "vacancyCount", e.target.value)}
                          placeholder="Vacancy Count"
                          className={inputClass}
                        />
                        <input
                          type="number"
                          value={role.vacancy.selectedCount}
                          onChange={(e) => updateRoleChild(eventIndex, roleIndex, "vacancy", "selectedCount", e.target.value)}
                          placeholder="Selected Count"
                          className={inputClass}
                        />
                        <textarea
                          value={role.vacancy.notes}
                          onChange={(e) => updateRoleChild(eventIndex, roleIndex, "vacancy", "notes", e.target.value)}
                          placeholder="Vacancy Notes"
                          rows={3}
                          className={`${inputClass} resize-none md:col-span-2`}
                        />
                      </div>
                    </div>

                    {/* SKILLS */}
                    <div className="mt-8 border-t pt-8">
                      <h6 className="font-bold">Skills</h6>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {(
                          [
                            ["technicalSkills", "Technical Skills"],
                            ["programmingLanguages", "Programming Languages"],
                            ["frameworks", "Frameworks"],
                            ["tools", "Tools"],
                            ["databases", "Databases"],
                            ["softSkills", "Soft Skills"],
                            ["otherRequirements", "Other Requirements"],
                            ["notes", "Notes"],
                          ] as const
                        ).map(([field, placeholder]) => (
                          <textarea
                            key={field}
                            value={role.skills[field]}
                            onChange={(e) => updateRoleChild(eventIndex, roleIndex, "skills", field, e.target.value)}
                            placeholder={placeholder}
                            rows={3}
                            className={`${inputClass} resize-none`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* APPLICATION REQUIREMENTS */}
                    <div className="mt-8 border-t pt-8">
                      <h6 className="font-bold">Application Requirements</h6>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {(
                          [
                            ["resumeRequired", "Resume Required (true/false)"],
                            ["coverLetterRequired", "Cover Letter Required (true/false)"],
                            ["portfolioRequired", "Portfolio Required (true/false)"],
                            ["certificatesRequired", "Certificates Required (true/false)"],
                            ["transcriptRequired", "Transcript Required (true/false)"],
                            ["photoRequired", "Photo Required (true/false)"],
                            ["otherDocuments", "Other Documents"],
                          ] as const
                        ).map(([field, placeholder]) => (
                          <input
                            key={field}
                            value={role.applicationRequirements[field]}
                            onChange={(e) => updateRoleChild(eventIndex, roleIndex, "applicationRequirements", field, e.target.value)}
                            placeholder={placeholder}
                            className={inputClass}
                          />
                        ))}
                        <textarea
                          value={role.applicationRequirements.applicationInstructions}
                          onChange={(e) => updateRoleChild(eventIndex, roleIndex, "applicationRequirements", "applicationInstructions", e.target.value)}
                          placeholder="Application Instructions"
                          rows={3}
                          className={`${inputClass} resize-none md:col-span-2`}
                        />
                        <textarea
                          value={role.applicationRequirements.notes}
                          onChange={(e) => updateRoleChild(eventIndex, roleIndex, "applicationRequirements", "notes", e.target.value)}
                          placeholder="Notes"
                          rows={3}
                          className={`${inputClass} resize-none md:col-span-2`}
                        />
                      </div>
                    </div>

                    {/* BOND */}
                    <div className="mt-8 border-t pt-8">
                      <h6 className="font-bold">Bond</h6>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {(
                          [
                            ["bondRequired", "Bond Required (true/false)"],
                            ["bondDurationMonths", "Bond Duration (Months)"],
                            ["bondAmount", "Bond Amount"],
                            ["bondStartCondition", "Bond Start Condition"],
                            ["bondTerminationCondition", "Bond Termination Condition"],
                            ["bondDocumentRequired", "Bond Document Required (true/false)"],
                          ] as const
                        ).map(([field, placeholder]) => (
                          <input
                            key={field}
                            type={field === "bondDurationMonths" || field === "bondAmount" ? "number" : "text"}
                            value={role.bond[field]}
                            onChange={(e) => updateRoleChild(eventIndex, roleIndex, "bond", field, e.target.value)}
                            placeholder={placeholder}
                            className={inputClass}
                          />
                        ))}
                        <textarea
                          value={role.bond.bondDetails}
                          onChange={(e) => updateRoleChild(eventIndex, roleIndex, "bond", "bondDetails", e.target.value)}
                          placeholder="Bond Details"
                          rows={3}
                          className={`${inputClass} resize-none md:col-span-2`}
                        />
                        <textarea
                          value={role.bond.notes}
                          onChange={(e) => updateRoleChild(eventIndex, roleIndex, "bond", "notes", e.target.value)}
                          placeholder="Bond Notes"
                          rows={3}
                          className={`${inputClass} resize-none md:col-span-2`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DOCUMENTS */}
            <div className="mt-10 border-t pt-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-bold">Hiring Documents</h4>
                  <p className="mt-1 opacity-60">Documents belonging to this hiring event.</p>
                </div>
                <button
                  type="button"
                  className={buttonClass}
                  onClick={() => addDocument(eventIndex)}
                >
                  + Add Document
                </button>
              </div>

              <div className="mt-6 space-y-5">
                {hiringEvent.documents.map((document, index) => (
                  <div key={index} className="neo-inset rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Document {index + 1}</span>
                      <button
                        type="button"
                        className="text-sm underline"
                        onClick={() => removeDocument(eventIndex, index)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <input
                        value={document.documentName}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "documents",
                            hiringEvent.documents.map((item, i) =>
                              i === index
                                ? { ...item, documentName: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder="Document Name"
                        className={inputClass}
                      />
                      <input
                        value={document.documentType}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "documents",
                            hiringEvent.documents.map((item, i) =>
                              i === index
                                ? { ...item, documentType: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder="Document Type"
                        className={inputClass}
                      />
                      <input
                        type="url"
                        value={document.documentUrl}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "documents",
                            hiringEvent.documents.map((item, i) =>
                              i === index
                                ? { ...item, documentUrl: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder="Document URL"
                        className={`${inputClass} md:col-span-2`}
                      />
                      <input
                        value={document.official}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "documents",
                            hiringEvent.documents.map((item, i) =>
                              i === index
                                ? { ...item, official: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder="Official (true/false)"
                        className={inputClass}
                      />
                      <input
                        type="date"
                        value={document.documentDate}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "documents",
                            hiringEvent.documents.map((item, i) =>
                              i === index
                                ? { ...item, documentDate: e.target.value }
                                : item
                            )
                          )
                        }
                        className={inputClass}
                      />
                      <textarea
                        value={document.documentDescription}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "documents",
                            hiringEvent.documents.map((item, i) =>
                              i === index
                                ? { ...item, documentDescription: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder="Description"
                        rows={3}
                        className={`${inputClass} resize-none md:col-span-2`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TIMELINE */}
            <div className="mt-10 border-t pt-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-bold">Hiring Timeline</h4>
                  <p className="mt-1 opacity-60">Stages and dates for this event.</p>
                </div>
                <button
                  type="button"
                  className={buttonClass}
                  onClick={() => addTimeline(eventIndex)}
                >
                  + Add Timeline Stage
                </button>
              </div>

              <div className="mt-6 space-y-5">
                {hiringEvent.timeline.map((timeline, index) => (
                  <div key={index} className="neo-inset rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Stage {index + 1}</span>
                      <button
                        type="button"
                        className="text-sm underline"
                        onClick={() => removeTimeline(eventIndex, index)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {(
                        [
                          ["sequenceNumber", "Sequence Number", "number"],
                          ["stageName", "Stage Name", "text"],
                          ["stageType", "Stage Type", "text"],
                          ["status", "Status", "text"],
                        ] as const
                      ).map(([field, placeholder, type]) => (
                        <input
                          key={field}
                          type={type}
                          value={timeline[field]}
                          onChange={(e) =>
                            updateEvent(
                              eventIndex,
                              "timeline",
                              hiringEvent.timeline.map((item, i) =>
                                i === index
                                  ? { ...item, [field]: e.target.value }
                                  : item
                              )
                            )
                          }
                          placeholder={placeholder}
                          className={inputClass}
                        />
                      ))}
                      <input
                        type="date"
                        value={timeline.stageDate}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "timeline",
                            hiringEvent.timeline.map((item, i) =>
                              i === index
                                ? { ...item, stageDate: e.target.value }
                                : item
                            )
                          )
                        }
                        className={inputClass}
                      />
                      <input
                        type="time"
                        value={timeline.startTime}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "timeline",
                            hiringEvent.timeline.map((item, i) =>
                              i === index
                                ? { ...item, startTime: e.target.value }
                                : item
                            )
                          )
                        }
                        className={inputClass}
                      />
                      <input
                        type="time"
                        value={timeline.endTime}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "timeline",
                            hiringEvent.timeline.map((item, i) =>
                              i === index
                                ? { ...item, endTime: e.target.value }
                                : item
                            )
                          )
                        }
                        className={inputClass}
                      />
                      <textarea
                        value={timeline.description}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "timeline",
                            hiringEvent.timeline.map((item, i) =>
                              i === index
                                ? { ...item, description: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder="Description"
                        rows={3}
                        className={`${inputClass} resize-none md:col-span-2`}
                      />
                      <textarea
                        value={timeline.notes}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "timeline",
                            hiringEvent.timeline.map((item, i) =>
                              i === index
                                ? { ...item, notes: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder="Notes"
                        rows={3}
                        className={`${inputClass} resize-none md:col-span-2`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SOURCES */}
            <div className="mt-10 border-t pt-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-bold">Data Sources</h4>
                  <p className="mt-1 opacity-60">Sources supporting the event data.</p>
                </div>
                <button
                  type="button"
                  className={buttonClass}
                  onClick={() => addSource(eventIndex)}
                >
                  + Add Source
                </button>
              </div>

              <div className="mt-6 space-y-5">
                {hiringEvent.sources.map((source, index) => (
                  <div key={index} className="neo-inset rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Source {index + 1}</span>
                      <button
                        type="button"
                        className="text-sm underline"
                        onClick={() => removeSource(eventIndex, index)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {(
                        [
                          ["sourceName", "Source Name"],
                          ["sourceType", "Source Type"],
                          ["sourceUrl", "Source URL"],
                        ] as const
                      ).map(([field, placeholder]) => (
                        <input
                          key={field}
                          type={field === "sourceUrl" ? "url" : "text"}
                          value={source[field]}
                          onChange={(e) =>
                            updateEvent(
                              eventIndex,
                              "sources",
                              hiringEvent.sources.map((item, i) =>
                                i === index
                                  ? { ...item, [field]: e.target.value }
                                  : item
                              )
                            )
                          }
                          placeholder={placeholder}
                          className={`${inputClass} ${field === "sourceUrl" ? "md:col-span-2" : ""}`}
                        />
                      ))}
                      <input
                        type="date"
                        value={source.sourceDate}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "sources",
                            hiringEvent.sources.map((item, i) =>
                              i === index
                                ? { ...item, sourceDate: e.target.value }
                                : item
                            )
                          )
                        }
                        className={inputClass}
                      />
                      <input
                        value={source.official}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "sources",
                            hiringEvent.sources.map((item, i) =>
                              i === index
                                ? { ...item, official: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder="Official (true/false)"
                        className={inputClass}
                      />
                      <input
                        value={source.verified}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "sources",
                            hiringEvent.sources.map((item, i) =>
                              i === index
                                ? { ...item, verified: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder="Verified (true/false)"
                        className={inputClass}
                      />
                      <textarea
                        value={source.sourceDescription}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "sources",
                            hiringEvent.sources.map((item, i) =>
                              i === index
                                ? { ...item, sourceDescription: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder="Source Description"
                        rows={3}
                        className={`${inputClass} resize-none md:col-span-2`}
                      />
                      <textarea
                        value={source.notes}
                        onChange={(e) =>
                          updateEvent(
                            eventIndex,
                            "sources",
                            hiringEvent.sources.map((item, i) =>
                              i === index
                                ? { ...item, notes: e.target.value }
                                : item
                            )
                          )
                        }
                        placeholder="Notes"
                        rows={3}
                        className={`${inputClass} resize-none md:col-span-2`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

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
              className="neo-button flex-1 rounded-2xl px-6 py-4 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Company..." : "Create Company"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
