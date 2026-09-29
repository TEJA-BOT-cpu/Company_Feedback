"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
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

  deleteCompanyLocation,
  deleteCompanyOwnership,
  deleteCompanyFinancial,
  deleteCompanyPerson,
  deleteCompanySocialLink,
} from "@/services/companyApi";

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

const API_URL = "http://localhost:8082/api/companies";

type RoleForm = {
  role: JobRole;
  compensation: Compensation | null;
  eligibility: EligibilityCriteria | null;
  branches: EligibleBranch[];
  rounds: SelectionRound[];
  locations: JobLocation[];
  internships: InternshipDetails[];
  vacancy: RoleVacancy | null;
  skills: RoleSkills | null;
  applicationRequirements: RoleApplicationRequirement | null;
  bond: RoleBond | null;
};

type EventForm = {
  event: CampusHiringEvent;
  roles: RoleForm[];
  documents: HiringDocument[];
  timeline: HiringTimeline[];
  sources: DataSource[];
};

function emptyRole(companyEvent: CampusHiringEvent): RoleForm {
  return {
    role: {
      id: 0,
      hiringEvent: companyEvent,
      roleName: "",
      description: "",
      employmentType: "",
      workMode: "",
      department: "",
      responsibilities: "",
      notes: "",
      createdAt: "",
      updatedAt: "",
    } as JobRole,
    compensation: null,
    eligibility: null,
    branches: [],
    rounds: [],
    locations: [],
    internships: [],
    vacancy: null,
    skills: null,
    applicationRequirements: null,
    bond: null,
  };
}

async function requestJson<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown
): Promise<T | null> {
  const response = await fetch(url, {
    method,
    headers:
      body !== undefined
        ? { "Content-Type": "application/json" }
        : undefined,
    body:
      body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      text || `Request failed: ${response.status}`
    );
  }

  if (!text.trim()) {
    return null;
  }

  const contentType =
    response.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return null;
  }

  return JSON.parse(text) as T;
}

async function getList<T>(url: string): Promise<T[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  return response.json();
}

async function getOptionalList<T>(url: string): Promise<T[]> {
  try {
    return await getList<T>(url);
  } catch {
    return [];
  }
}

async function getOptional<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

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

  const [company, setCompany] = useState<Company | null>(null);

  const [locations, setLocations] = useState<CompanyLocation[]>([]);
  const [ownership, setOwnership] = useState<CompanyOwnership[]>([]);
  const [financials, setFinancials] = useState<CompanyFinancial[]>([]);
  const [people, setPeople] = useState<CompanyPerson[]>([]);
  const [socialLinks, setSocialLinks] =
    useState<CompanySocialLink[]>([]);

  const [hiringEvents, setHiringEvents] = useState<EventForm[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD COMPANY
  // ==========================================================

  useEffect(() => {
    async function loadCompany() {
      try {
        setLoading(true);
        setError("");

        // ======================================================
        // NO AUTHENTICATION
        // ======================================================

        const [
          companyData,
          locationData,
          ownershipData,
          financialData,
          peopleData,
          socialData,
          eventData,
        ] = await Promise.all([
          getCompanyById(companyId),
          getCompanyLocations(companyId),
          getCompanyOwnership(companyId),
          getCompanyFinancials(companyId),
          getCompanyPeople(companyId),
          getCompanySocialLinks(companyId),
          getList<CampusHiringEvent>(
            `${API_URL}/${companyId}/hiring-events`
          ),
        ]);

        const loadedEvents = await Promise.all(
          eventData.map(async (event) => {
            const [roles, documents, timeline, sources] =
              await Promise.all([
                getOptionalList<JobRole>(
                  `${API_URL}/${companyId}/hiring-events/${event.id}/roles`
                ),
                getOptionalList<HiringDocument>(
                  `${API_URL}/${companyId}/hiring-events/${event.id}/documents`
                ),
                getOptionalList<HiringTimeline>(
                  `${API_URL}/${companyId}/hiring-events/${event.id}/timeline`
                ),
                getOptionalList<DataSource>(
                  `${API_URL}/${companyId}/hiring-events/${event.id}/sources`
                ),
              ]);

            const roleForms = await Promise.all(
              roles.map(async (role) => {
                const roleBase =
                  `${API_URL}/${companyId}/hiring-events/${event.id}/roles/${role.id}`;

                const [
                  compensation,
                  eligibility,
                  branches,
                  rounds,
                  locations,
                  internships,
                  vacancy,
                  skills,
                  applicationRequirements,
                  bond,
                ] = await Promise.all([
                  getOptional<Compensation>(`${roleBase}/compensation`),
                  getOptional<EligibilityCriteria>(`${roleBase}/eligibility`),
                  getOptionalList<EligibleBranch>(`${roleBase}/eligible-branches`),
                  getOptionalList<SelectionRound>(`${roleBase}/selection-rounds`),
                  getOptionalList<JobLocation>(`${roleBase}/locations`),
                  getOptionalList<InternshipDetails>(`${roleBase}/internships`),
                  getOptional<RoleVacancy>(`${roleBase}/vacancy`),
                  getOptional<RoleSkills>(`${roleBase}/skills`),
                  getOptional<RoleApplicationRequirement>(
                    `${roleBase}/application-requirements`
                  ),
                  getOptional<RoleBond>(`${roleBase}/bond`),
                ]);

                return {
                  role,
                  compensation,
                  eligibility,
                  branches,
                  rounds,
                  locations,
                  internships,
                  vacancy,
                  skills,
                  applicationRequirements,
                  bond,
                };
              })
            );

            return {
              event,
              roles: roleForms,
              documents,
              timeline,
              sources,
            };
          })
        );

        setCompany(companyData);
        setLocations(locationData);
        setOwnership(ownershipData);
        setFinancials(financialData);
        setPeople(peopleData);
        setSocialLinks(socialData);
        setHiringEvents(loadedEvents);
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
  }, [companyId]);

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
      if (location.id > 0) {
        await deleteCompanyLocation(
          companyId,
          location.id
        );
      }

      setLocations((current) =>
        current.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error(
        "Failed to delete location:",
        error
      );

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
      console.error(
        "Failed to delete ownership:",
        error
      );

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
        await deleteCompanyFinancial(
          companyId,
          financial.id
        );
      }

      setFinancials((current) =>
        current.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error(
        "Failed to delete financial:",
        error
      );

      setError(
        "Failed to delete financial information"
      );
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
        await deleteCompanyPerson(
          companyId,
          person.id
        );
      }

      setPeople((current) =>
        current.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error(
        "Failed to delete person:",
        error
      );

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
        await deleteCompanySocialLink(
          companyId,
          socialLink.id
        );
      }

      setSocialLinks((current) =>
        current.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error(
        "Failed to delete social link:",
        error
      );

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
  // CAMPUS HIRING FUNCTIONS
  // ==========================================================

  function addHiringEvent() {
    const event = {
      id: 0,
      company: company as Company,
      academicYear: "",
      driveName: "",
      driveType: "",
      recruitmentType: "",
      status: "",
      registrationStart: null,
      registrationEnd: null,
      prePlacementTalkDate: null,
      driveDate: null,
      resultDate: null,
      joiningDate: null,
      totalVacancies: null,
      totalSelected: null,
      campusLocation: "",
      applicationMethod: "",
      officialNotificationUrl: "",
      notes: "",
    } as CampusHiringEvent;

    setHiringEvents((current) => [
      ...current,
      { event, roles: [], documents: [], timeline: [], sources: [] },
    ]);
  }

  async function removeHiringEvent(index: number) {
    const item = hiringEvents[index];

    try {
      if (item.event.id > 0) {
        await requestJson(
          `${API_URL}/${companyId}/hiring-events/${item.event.id}`,
          "DELETE"
        );
      }

      setHiringEvents((current) =>
        current.filter((_, i) => i !== index)
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete hiring event.");
    }
  }

  function updateHiringEvent(
    index: number,
    field: keyof CampusHiringEvent,
    value: string | number | null
  ) {
    setHiringEvents((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              event: {
                ...item.event,
                [field]: value,
              },
            }
          : item
      )
    );
  }

  function addRole(eventIndex: number) {
    setHiringEvents((current) =>
      current.map((item, i) =>
        i === eventIndex
          ? {
              ...item,
              roles: [...item.roles, emptyRole(item.event)],
            }
          : item
      )
    );
  }

  async function removeRole(eventIndex: number, roleIndex: number) {
    const item = hiringEvents[eventIndex];
    const roleItem = item.roles[roleIndex];

    try {
      if (roleItem.role.id > 0) {
        await requestJson(
          `${API_URL}/${companyId}/hiring-events/${item.event.id}/roles/${roleItem.role.id}`,
          "DELETE"
        );
      }

      setHiringEvents((current) =>
        current.map((eventItem, i) =>
          i === eventIndex
            ? {
                ...eventItem,
                roles: eventItem.roles.filter(
                  (_, ri) => ri !== roleIndex
                ),
              }
            : eventItem
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete job role.");
    }
  }

  function updateRole(
    eventIndex: number,
    roleIndex: number,
    field: keyof JobRole,
    value: string | number | boolean | null
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
                      role: {
                        ...roleItem.role,
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
  value: string | number | boolean | null
) {
  setHiringEvents((current) =>
    current.map((eventItem, ei) =>
      ei === eventIndex
        ? {
            ...eventItem,
            roles: eventItem.roles.map((roleItem, ri) => {
              if (ri !== roleIndex) return roleItem;

              const currentChild =
                roleItem[child] || ({} as any);

              return {
                ...roleItem,
                [child]: {
                  ...currentChild,
                  [field]: value,
                },
              };
            }),
          }
        : eventItem
    )
  );
}

  function updateInternshipField(
    eventIndex: number,
    roleIndex: number,
    internshipIndex: number,
    field: keyof InternshipDetails,
    value: string | number | boolean | null
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
                      internships: roleItem.internships.map((internship, ii) =>
                        ii === internshipIndex
                          ? { ...internship, [field]: value }
                          : internship
                      ),
                    }
                  : roleItem
              ),
            }
          : eventItem
      )
    );
  }

  function addInternship(eventIndex: number, roleIndex: number) {
    setHiringEvents((current) =>
      current.map((eventItem, ei) =>
        ei === eventIndex
          ? {
              ...eventItem,
              roles: eventItem.roles.map((roleItem, ri) =>
                ri === roleIndex
                  ? {
                      ...roleItem,
                      internships: [
                        ...roleItem.internships,
                        {
                          id: 0,
                          jobRole: roleItem.role,
                          internshipNumber: roleItem.internships.length + 1,
                          internshipRequired: false,
                          durationMonths: null,
                          stipend: null,
                          stipendPeriod: "",
                          ppoOffered: false,
                          ppoCriteria: "",
                          internshipLocation: "",
                          workMode: "",
                          description: "",
                          notes: "",
                          createdAt: "",
                          updatedAt: "",
                        } as InternshipDetails,
                      ],
                    }
                  : roleItem
              ),
            }
          : eventItem
      )
    );
  }

  async function removeInternship(
    eventIndex: number,
    roleIndex: number,
    internshipIndex: number
  ) {
    const roleItem = hiringEvents[eventIndex].roles[roleIndex];
    const internship = roleItem.internships[internshipIndex];

    try {
      if (internship.id > 0) {
        await requestJson(
          `${API_URL}/${companyId}/hiring-events/${hiringEvents[eventIndex].event.id}/roles/${roleItem.role.id}/internships/${internship.id}`,
          "DELETE"
        );
      }

      setHiringEvents((current) =>
        current.map((eventItem, ei) =>
          ei === eventIndex
            ? {
                ...eventItem,
                roles: eventItem.roles.map((currentRole, ri) =>
                  ri === roleIndex
                    ? {
                        ...currentRole,
                        internships: currentRole.internships.filter(
                          (_, ii) => ii !== internshipIndex
                        ),
                      }
                    : currentRole
                ),
              }
            : eventItem
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete internship.");
    }
  }

  async function removeRoleChild(
    eventIndex: number,
    roleIndex: number,
    child: "compensation" | "eligibility" | "vacancy" | "skills" | "applicationRequirements" | "bond"
  ) {
    const roleItem = hiringEvents[eventIndex].roles[roleIndex];
    const childValue = roleItem[child];

    if (!childValue) return;

    const paths = {
      compensation: "compensation",
      eligibility: "eligibility",
      vacancy: "vacancy",
      skills: "skills",
      applicationRequirements: "application-requirements",
      bond: "bond",
    } as const;

    try {
      if (childValue.id > 0) {
        await requestJson(
          `${API_URL}/${companyId}/hiring-events/${hiringEvents[eventIndex].event.id}/roles/${roleItem.role.id}/${paths[child]}`,
          "DELETE"
        );
      }

      setHiringEvents((current) =>
        current.map((eventItem, ei) =>
          ei === eventIndex
            ? {
                ...eventItem,
                roles: eventItem.roles.map((currentRole, ri) =>
                  ri === roleIndex
                    ? { ...currentRole, [child]: null }
                    : currentRole
                ),
              }
            : eventItem
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete role detail.");
    }
  }

  function addRoleListItem(
    eventIndex: number,
    roleIndex: number,
    child: "branches" | "rounds" | "locations"
  ) {
    setHiringEvents((current) =>
      current.map((eventItem, ei) =>
        ei === eventIndex
          ? {
              ...eventItem,
              roles: eventItem.roles.map((roleItem, ri) => {
                if (ri !== roleIndex) return roleItem;

                if (child === "branches") {
                  return {
                    ...roleItem,
                    branches: [
                      ...roleItem.branches,
                      {
                        id: 0,
                        jobRole: roleItem.role,
                        branchName: "",
                        branchCode: "",
                        notes: "",
                      } as EligibleBranch,
                    ],
                  };
                }

                if (child === "rounds") {
                  return {
                    ...roleItem,
                    rounds: [
                      ...roleItem.rounds,
                      {
                        id: 0,
                        jobRole: roleItem.role,
                        roundNumber: roleItem.rounds.length + 1,
                        roundName: "",
                        roundType: "",
                        description: "",
                        durationMinutes: null,
                        eliminationRound: false,
                        eligibilityToNextRound: "",
                        notes: "",
                      } as SelectionRound,
                    ],
                  };
                }

                return {
                  ...roleItem,
                  locations: [
                    ...roleItem.locations,
                    {
                      id: 0,
                      jobRole: roleItem.role,
                      locationName: "",
                      city: "",
                      state: "",
                      country: "",
                      workMode: "",
                      address: "",
                      notes: "",
                    } as JobLocation,
                  ],
                };
              }),
            }
          : eventItem
      )
    );
  }

  function updateRoleListItem(
    eventIndex: number,
    roleIndex: number,
    child: "branches" | "rounds" | "locations",
    itemIndex: number,
    field: string,
    value: string | number | boolean | null
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
                      [child]: roleItem[child].map(
                        (item, ii) =>
                          ii === itemIndex
                            ? { ...item, [field]: value }
                            : item
                      ),
                    }
                  : roleItem
              ),
            }
          : eventItem
      )
    );
  }

  async function removeRoleListItem(
    eventIndex: number,
    roleIndex: number,
    child: "branches" | "rounds" | "locations",
    itemIndex: number
  ) {
    const item = hiringEvents[eventIndex].roles[roleIndex][child][itemIndex] as
      | EligibleBranch
      | SelectionRound
      | JobLocation;

    try {
      if (item.id > 0) {
        const role = hiringEvents[eventIndex].roles[roleIndex].role;
        const path =
          child === "branches"
            ? "eligible-branches"
            : child === "rounds"
              ? "selection-rounds"
              : "locations";

        await requestJson(
          `${API_URL}/${companyId}/hiring-events/${hiringEvents[eventIndex].event.id}/roles/${role.id}/${path}/${item.id}`,
          "DELETE"
        );
      }

      setHiringEvents((current) =>
        current.map((eventItem, ei) =>
          ei === eventIndex
            ? {
                ...eventItem,
                roles: eventItem.roles.map((roleItem, ri) =>
                  ri === roleIndex
                    ? {
                        ...roleItem,
                        [child]: roleItem[child].filter(
                          (_, ii) => ii !== itemIndex
                        ),
                      }
                    : roleItem
                ),
              }
            : eventItem
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete role detail.");
    }
  }

  function addEventListItem(
    eventIndex: number,
    child: "documents" | "timeline" | "sources"
  ) {
    setHiringEvents((current) =>
      current.map((item, i) => {
        if (i !== eventIndex) return item;

        if (child === "documents") {
          return {
            ...item,
            documents: [
              ...item.documents,
              {
                id: 0,
                hiringEvent: item.event,
                documentName: "",
                documentType: "",
                documentUrl: "",
                documentDescription: "",
                official: false,
                documentDate: null,
              } as HiringDocument,
            ],
          };
        }

        if (child === "timeline") {
          return {
            ...item,
            timeline: [
              ...item.timeline,
              {
                id: 0,
                hiringEvent: item.event,
                sequenceNumber: item.timeline.length + 1,
                stageName: "",
                stageType: "",
                stageDate: null,
                startTime: null,
                endTime: null,
                description: "",
                status: "",
                notes: "",
              } as HiringTimeline,
            ],
          };
        }

        return {
          ...item,
          sources: [
            ...item.sources,
            {
              id: 0,
              hiringEvent: item.event,
              sourceName: "",
              sourceType: "",
              sourceUrl: "",
              sourceDescription: "",
              sourceDate: null,
              official: false,
              verified: false,
              notes: "",
              createdAt: "",
              updatedAt: "",
            } as DataSource,
          ],
        };
      })
    );
  }

  function updateEventListItem(
    eventIndex: number,
    child: "documents" | "timeline" | "sources",
    itemIndex: number,
    field: string,
    value: string | number | boolean | null
  ) {
    setHiringEvents((current) =>
      current.map((item, i) =>
        i === eventIndex
          ? {
              ...item,
              [child]: item[child].map(
                (childItem, ci) =>
                  ci === itemIndex
                    ? { ...childItem, [field]: value }
                    : childItem
              ),
            }
          : item
      )
    );
  }

  async function removeEventListItem(
    eventIndex: number,
    child: "documents" | "timeline" | "sources",
    itemIndex: number
  ) {
    const item = hiringEvents[eventIndex][child][itemIndex] as
      | HiringDocument
      | HiringTimeline
      | DataSource;

    try {
      if (item.id > 0) {
        const path =
          child === "documents"
            ? "documents"
            : child === "timeline"
              ? "timeline"
              : "sources";

        await requestJson(
          `${API_URL}/${companyId}/hiring-events/${hiringEvents[eventIndex].event.id}/${path}/${item.id}`,
          "DELETE"
        );
      }

      setHiringEvents((current) =>
        current.map((eventItem, ei) =>
          ei === eventIndex
            ? {
                ...eventItem,
                [child]: eventItem[child].filter(
                  (_, ci) => ci !== itemIndex
                ),
              }
            : eventItem
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete hiring detail.");
    }
  }

function toLocalDateTime(value: string | null | undefined) {
  if (!value) return null;

  if (value.length === 10) {
    return `${value}T00:00:00`;
  }

  return value;
}

function toDateTimeLocalInput(value: string | null | undefined) {
  if (!value) return "";

  return String(value).slice(0, 16);
}

async function saveRoleChildren(
  event: EventForm,
  roleItem: RoleForm,
  roleId: number
) {
  const roleBase =
    `${API_URL}/${companyId}/hiring-events/${event.event.id}/roles/${roleId}`;

  // ==========================================
  // COMPENSATION
  // Backend:
  // POST /compensation
  // PUT  /compensation
  // ==========================================

  if (roleItem.compensation) {
    const payload = { ...roleItem.compensation };

    delete (payload as any).id;
    delete (payload as any).jobRole;
    delete (payload as any).role;
    delete (payload as any).hiringEvent;

    if (roleItem.compensation.id > 0) {
      await requestJson(
        `${roleBase}/compensation`,
        "PUT",
        payload
      );
    } else {
      await requestJson(
        `${roleBase}/compensation`,
        "POST",
        payload
      );
    }
  }


  // ==========================================
  // ELIGIBILITY
  // ==========================================

  if (roleItem.eligibility) {
    const payload = { ...roleItem.eligibility };

    delete (payload as any).id;
    delete (payload as any).jobRole;
    delete (payload as any).role;
    delete (payload as any).hiringEvent;

    if (roleItem.eligibility.id > 0) {
      await requestJson(
        `${roleBase}/eligibility`,
        "PUT",
        payload
      );
    } else {
      await requestJson(
        `${roleBase}/eligibility`,
        "POST",
        payload
      );
    }
  }


  // ==========================================
  // INTERNSHIP
  // Backend uses /internships
  // ==========================================

  for (const internship of roleItem.internships) {
    const payload = { ...internship };

    delete (payload as any).id;
    delete (payload as any).jobRole;
    delete (payload as any).role;
    delete (payload as any).hiringEvent;

    if (internship.id > 0) {
      await requestJson(
        `${roleBase}/internships/${internship.id}`,
        "PUT",
        payload
      );
    } else {
      await requestJson(
        `${roleBase}/internships`,
        "POST",
        payload
      );
    }
  }


  // ==========================================
  // VACANCY
  // ==========================================

  if (roleItem.vacancy) {
    const payload = { ...roleItem.vacancy };

    delete (payload as any).id;
    delete (payload as any).jobRole;
    delete (payload as any).role;
    delete (payload as any).hiringEvent;

    if (roleItem.vacancy.id > 0) {
      await requestJson(
        `${roleBase}/vacancy`,
        "PUT",
        payload
      );
    } else {
      await requestJson(
        `${roleBase}/vacancy`,
        "POST",
        payload
      );
    }
  }


  // ==========================================
  // SKILLS
  // ==========================================

  if (roleItem.skills) {
    const payload = { ...roleItem.skills };

    delete (payload as any).id;
    delete (payload as any).jobRole;
    delete (payload as any).role;
    delete (payload as any).hiringEvent;

    if (roleItem.skills.id > 0) {
      await requestJson(
        `${roleBase}/skills`,
        "PUT",
        payload
      );
    } else {
      await requestJson(
        `${roleBase}/skills`,
        "POST",
        payload
      );
    }
  }


  // ==========================================
  // APPLICATION REQUIREMENTS
  // ==========================================

  if (roleItem.applicationRequirements) {
    const payload = {
      ...roleItem.applicationRequirements,
    };

    delete (payload as any).id;
    delete (payload as any).jobRole;
    delete (payload as any).role;
    delete (payload as any).hiringEvent;

    if (roleItem.applicationRequirements.id > 0) {
      await requestJson(
        `${roleBase}/application-requirements`,
        "PUT",
        payload
      );
    } else {
      await requestJson(
        `${roleBase}/application-requirements`,
        "POST",
        payload
      );
    }
  }


  // ==========================================
  // BOND
  // ==========================================

  if (roleItem.bond) {
    const payload = { ...roleItem.bond };

    delete (payload as any).id;
    delete (payload as any).jobRole;
    delete (payload as any).role;
    delete (payload as any).hiringEvent;

    if (roleItem.bond.id > 0) {
      await requestJson(
        `${roleBase}/bond`,
        "PUT",
        payload
      );
    } else {
      await requestJson(
        `${roleBase}/bond`,
        "POST",
        payload
      );
    }
  }


  // ==========================================
  // LIST CHILDREN
  // ==========================================

  const saveList = async (
    path: string,
    values: Array<any>
  ) => {
    for (const value of values) {
      const payload = { ...value };

      delete payload.id;
      delete payload.jobRole;
      delete payload.role;
      delete payload.hiringEvent;

      if (value.id && value.id > 0) {
        await requestJson(
          `${roleBase}/${path}/${value.id}`,
          "PUT",
          payload
        );
      } else {
        await requestJson(
          `${roleBase}/${path}`,
          "POST",
          payload
        );
      }
    }
  };

  await saveList(
    "eligible-branches",
    roleItem.branches
  );

  await saveList(
    "selection-rounds",
    roleItem.rounds
  );

  await saveList(
    "locations",
    roleItem.locations
  );
}
async function saveEventChildren(eventItem: EventForm) {
  const eventBase =
    `${API_URL}/${companyId}/hiring-events/${eventItem.event.id}`;

  for (const document of eventItem.documents) {
    const payload = { ...document };

    delete (payload as any).id;
    delete (payload as any).hiringEvent;

    payload.documentDate =
      toLocalDateTime(payload.documentDate);

    if (document.id > 0) {
      await requestJson(
        `${eventBase}/documents/${document.id}`,
        "PUT",
        payload
      );
    } else {
      await requestJson(
        `${eventBase}/documents`,
        "POST",
        payload
      );
    }
  }

  for (const timeline of eventItem.timeline) {
    const payload = { ...timeline };

    delete (payload as any).id;
    delete (payload as any).hiringEvent;

    payload.stageDate =
      toLocalDateTime(payload.stageDate);

    if (timeline.id > 0) {
      await requestJson(
        `${eventBase}/timeline/${timeline.id}`,
        "PUT",
        payload
      );
    } else {
      await requestJson(
        `${eventBase}/timeline`,
        "POST",
        payload
      );
    }
  }

  for (const source of eventItem.sources) {
    const payload = { ...source };

    delete (payload as any).id;
    delete (payload as any).hiringEvent;

    payload.sourceDate =
      toLocalDateTime(payload.sourceDate);

    if (source.id > 0) {
      await requestJson(
        `${eventBase}/sources/${source.id}`,
        "PUT",
        payload
      );
    } else {
      await requestJson(
        `${eventBase}/sources`,
        "POST",
        payload
      );
    }
  }
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
        if (!location.id) {
          const response = await fetch(
            `http://localhost:8082/api/companies/${companyId}/locations`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                address: location.address || null,
                city: location.city || null,
                state: location.state || null,
                country: location.country || null,
                postalCode:
                  location.postalCode || null,
                locationType:
                  location.locationType || null,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              "Failed to create location"
            );
          }
        } else {
          await updateCompanyLocation(
            companyId,
            location.id,
            {
              address: location.address,
              city: location.city,
              state: location.state,
              country: location.country,
              postalCode: location.postalCode,
              locationType: location.locationType,
            }
          );
        }
      }

      // ======================================================
      // 3. UPDATE OWNERSHIP
      // ======================================================

      for (const owner of ownership) {
        if (!owner.id) {
          const response = await fetch(
            `http://localhost:8082/api/companies/${companyId}/ownership`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ownerName: owner.ownerName,
                ownerType: owner.ownerType || null,
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

          if (!response.ok) {
            throw new Error(
              "Failed to create ownership record"
            );
          }
        } else {
          await updateCompanyOwnership(
            companyId,
            owner.id,
            {
              ownerName: owner.ownerName,
              ownerType: owner.ownerType,
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
          const response = await fetch(
            `http://localhost:8082/api/companies/${companyId}/financial`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                financialYear:
                  financial.financialYear,

                revenue:
                  financial.revenue !== null &&
                  financial.revenue !== undefined
                    ? Number(financial.revenue)
                    : null,

                profit:
                  financial.profit !== null &&
                  financial.profit !== undefined
                    ? Number(financial.profit)
                    : null,

                marketCap:
                  financial.marketCap !== null &&
                  financial.marketCap !== undefined
                    ? Number(financial.marketCap)
                    : null,

                currency:
                  financial.currency || null,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              "Failed to create financial record"
            );
          }
        } else {
          await updateCompanyFinancial(
            companyId,
            financial.id,
            {
              financialYear:
                financial.financialYear,
              revenue: financial.revenue,
              profit: financial.profit,
              marketCap: financial.marketCap,
              currency: financial.currency,
            }
          );
        }
      }

      // ======================================================
      // 5. UPDATE PEOPLE
      // ======================================================

      for (const person of people) {
        if (!person.id) {
          const response = await fetch(
            `http://localhost:8082/api/companies/${companyId}/persons`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: person.name,
                role: person.role || null,
                bio: person.bio || null,
                linkedinUrl:
                  person.linkedinUrl || null,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              "Failed to create person"
            );
          }
        } else {
          await updateCompanyPerson(
            companyId,
            person.id,
            {
              name: person.name,
              role: person.role,
              bio: person.bio,
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
          const response = await fetch(
            `http://localhost:8082/api/companies/${companyId}/social-links`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                platform:
                  social.platform || null,
                url: social.url,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              "Failed to create social link"
            );
          }
        } else {
          await updateCompanySocialLink(
            companyId,
            social.id,
            {
              platform: social.platform,
              url: social.url,
            }
          );
        }
      }

      // ======================================================
      // 7. UPDATE CAMPUS HIRING
      // ======================================================

      for (const eventItem of hiringEvents) {
        const eventPayload = { ...eventItem.event };
        delete (eventPayload as any).id;
        delete (eventPayload as any).company;

        eventPayload.registrationStart = toLocalDateTime(eventPayload.registrationStart);
        eventPayload.registrationEnd = toLocalDateTime(eventPayload.registrationEnd);
        eventPayload.prePlacementTalkDate = toLocalDateTime(eventPayload.prePlacementTalkDate);
        eventPayload.driveDate = toLocalDateTime(eventPayload.driveDate);
        eventPayload.resultDate = toLocalDateTime(eventPayload.resultDate);
        eventPayload.joiningDate = toLocalDateTime(eventPayload.joiningDate);

        let eventId = eventItem.event.id;

        if (eventId > 0) {
          await requestJson(
            `${API_URL}/${companyId}/hiring-events/${eventId}`,
            "PUT",
            eventPayload
          );
        } else {
          const created = await requestJson<CampusHiringEvent>(
            `${API_URL}/${companyId}/hiring-events`,
            "POST",
            eventPayload
          );

          if (!created?.id) {
            throw new Error("Failed to create hiring event.");
          }

          eventId = created.id;

          setHiringEvents((current) =>
            current.map((currentEvent) =>
              currentEvent === eventItem
                ? {
                    ...currentEvent,
                    event: {
                      ...currentEvent.event,
                      id: eventId,
                    },
                  }
                : currentEvent
            )
          );
        }

        const savedEvent = {
          ...eventItem,
          event: {
            ...eventItem.event,
            id: eventId,
          },
        };

        for (const roleItem of savedEvent.roles) {
          const rolePayload = { ...roleItem.role };
          delete (rolePayload as any).id;
          delete (rolePayload as any).hiringEvent;

          let roleId = roleItem.role.id;

          if (roleId > 0) {
            await requestJson(
              `${API_URL}/${companyId}/hiring-events/${eventId}/roles/${roleId}`,
              "PUT",
              rolePayload
            );
          } else {
            const createdRole = await requestJson<JobRole>(
              `${API_URL}/${companyId}/hiring-events/${eventId}/roles`,
              "POST",
              rolePayload
            );

            if (!createdRole?.id) {
              throw new Error(
                `Failed to create role "${roleItem.role.roleName || "Unnamed role"}".`
              );
            }

            roleId = createdRole.id;
          }

          const roleForSave = {
            ...roleItem,
            role: {
              ...roleItem.role,
              id: roleId,
            },
          };

          await saveRoleChildren(savedEvent, roleForSave, roleId);
        }

        await saveEventChildren(savedEvent);
      }

      // ======================================================
      // DONE
      // ======================================================

      alert("Company updated successfully.");

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
        setError("Failed to update company.");
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

  // ==========================================================
  // COMPANY NOT FOUND
  // ==========================================================

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

      {/* NAVBAR */}

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

      {/* HEADING */}

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

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-10"
        >

          {/* COMPANY INFORMATION */}

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

          {/* LOCATIONS */}

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

          {/* OWNERSHIP */}

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

          {/* FINANCIALS */}

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

          {/* PEOPLE */}

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

          {/* SOCIAL LINKS */}

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


          {/* CAMPUS HIRING */}

          <section className="neo mt-8 rounded-3xl p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold">
                  Campus Hiring
                </h3>
                <p className="mt-2 opacity-60">
                  Update hiring events separately from their job roles.
                </p>
              </div>

              <button
                type="button"
                onClick={addHiringEvent}
                className="neo-button rounded-2xl px-5 py-3"
              >
                + Add Hiring Event
              </button>
            </div>

            <div className="mt-8 space-y-8">
              {hiringEvents.map((eventItem, eventIndex) => (
                <div
                  key={eventItem.event.id || `event-${eventIndex}`}
                  className="neo-inset rounded-3xl p-6"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold">
                        Hiring Event {eventIndex + 1}
                      </h4>
                      {eventItem.event.id > 0 && (
                        <p className="mt-1 text-sm opacity-50">
                          Event ID: {eventItem.event.id}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeHiringEvent(eventIndex)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    {([
                      ["academicYear", "Academic Year"],
                      ["driveName", "Drive Name"],
                      ["driveType", "Drive Type"],
                      ["recruitmentType", "Recruitment Type"],
                      ["status", "Status"],
                      ["registrationStart", "Registration Start"],
                      ["registrationEnd", "Registration End"],
                      ["prePlacementTalkDate", "Pre-Placement Talk"],
                      ["driveDate", "Drive Date"],
                      ["resultDate", "Result Date"],
                      ["joiningDate", "Joining Date"],
                      ["campusLocation", "Campus Location"],
                      ["applicationMethod", "Application Method"],
                      ["officialNotificationUrl", "Official Notification URL"],
                    ] as const).map(([field, label]) => (
                      <div key={field}>
                        <label className="mb-2 block font-semibold">
                          {label}
                        </label>
                        <input
                          type={
                            field.includes("Date") ||
                            field.includes("registration") ||
                            field === "joiningDate"
                              ? "datetime-local"
                              : "text"
                          }
                          value={
                            field === "registrationStart" ||
                            field === "registrationEnd" ||
                            field === "prePlacementTalkDate" ||
                            field === "driveDate" ||
                            field === "resultDate" ||
                            field === "joiningDate"
                              ? toDateTimeLocalInput(
                                  (eventItem.event as any)[field]
                                )
                              : (((eventItem.event as any)[field] || "") as string)
                          }
                          onChange={(e) =>
                            updateHiringEvent(
                              eventIndex,
                              field as keyof CampusHiringEvent,
                              e.target.value
                            )
                          }
                          className="neo w-full rounded-2xl px-5 py-4 outline-none"
                        />
                      </div>
                    ))}

                    <div>
                      <label className="mb-2 block font-semibold">
                        Total Vacancies
                      </label>
                      <input
                        type="number"
                        value={eventItem.event.totalVacancies ?? ""}
                        onChange={(e) =>
                          updateHiringEvent(
                            eventIndex,
                            "totalVacancies",
                            e.target.value
                              ? Number(e.target.value)
                              : null
                          )
                        }
                        className="neo w-full rounded-2xl px-5 py-4 outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold">
                        Total Selected
                      </label>
                      <input
                        type="number"
                        value={eventItem.event.totalSelected ?? ""}
                        onChange={(e) =>
                          updateHiringEvent(
                            eventIndex,
                            "totalSelected",
                            e.target.value
                              ? Number(e.target.value)
                              : null
                          )
                        }
                        className="neo w-full rounded-2xl px-5 py-4 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block font-semibold">
                        Notes
                      </label>
                      <textarea
                        value={eventItem.event.notes || ""}
                        onChange={(e) =>
                          updateHiringEvent(
                            eventIndex,
                            "notes",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="neo w-full rounded-2xl px-5 py-4 outline-none"
                      />
                    </div>
                  </div>

                  {/* JOB ROLES */}

                  <div className="mt-10 border-t border-current/10 pt-8">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xl font-bold">
                        Job Roles
                      </h5>
                      <button
                        type="button"
                        onClick={() => addRole(eventIndex)}
                        className="neo-button rounded-2xl px-4 py-2"
                      >
                        + Add Role
                      </button>
                    </div>

                    <div className="mt-6 space-y-8">
                      {eventItem.roles.map((roleItem, roleIndex) => (
                        <div
                          key={
                            roleItem.role.id ||
                            `role-${eventIndex}-${roleIndex}`
                          }
                          className="neo rounded-3xl p-6"
                        >
                          <div className="mb-6 flex justify-between">
                            <h6 className="font-bold">
                              Role {roleIndex + 1}
                            </h6>
                            <button
                              type="button"
                              onClick={() =>
                                removeRole(eventIndex, roleIndex)
                              }
                              className="text-red-500"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid gap-5 md:grid-cols-2">
                            {([
                              ["roleName", "Role Name"],
                              ["employmentType", "Employment Type"],
                              ["workMode", "Work Mode"],
                              ["department", "Department"],
                            ] as const).map(([field, label]) => (
                              <div key={field}>
                                <label className="mb-2 block font-semibold">
                                  {label}
                                </label>
                                <input
                                  value={
                                    ((roleItem.role as any)[field] || "") as string
                                  }
                                  onChange={(e) =>
                                    updateRole(
                                      eventIndex,
                                      roleIndex,
                                      field as keyof JobRole,
                                      e.target.value
                                    )
                                  }
                                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                                />
                              </div>
                            ))}

                            <div className="md:col-span-2">
                              <label className="mb-2 block font-semibold">
                                Description
                              </label>
                              <textarea
                                value={roleItem.role.description || ""}
                                onChange={(e) =>
                                  updateRole(
                                    eventIndex,
                                    roleIndex,
                                    "description",
                                    e.target.value
                                  )
                                }
                                rows={3}
                                className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="mb-2 block font-semibold">
                                Responsibilities
                              </label>
                              <textarea
                                value={roleItem.role.responsibilities || ""}
                                onChange={(e) =>
                                  updateRole(
                                    eventIndex,
                                    roleIndex,
                                    "responsibilities",
                                    e.target.value
                                  )
                                }
                                rows={4}
                                className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="mb-2 block font-semibold">
                                Notes
                              </label>
                              <textarea
                                value={roleItem.role.notes || ""}
                                onChange={(e) =>
                                  updateRole(
                                    eventIndex,
                                    roleIndex,
                                    "notes",
                                    e.target.value
                                  )
                                }
                                rows={3}
                                className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                              />
                            </div>
                          </div>

                          {/* COMPENSATION */}

                          <div className="mt-8 border-t border-current/10 pt-8">
                            <div className="flex items-center justify-between"><h6 className="font-bold">Compensation</h6>{roleItem.compensation && <button type="button" onClick={() => removeRoleChild(eventIndex, roleIndex, "compensation")} className="text-red-500">Remove</button>}</div>
                            <div className="mt-5 grid gap-5 md:grid-cols-3">
                              {([
                                ["ctc", "CTC"],
                                ["fixedPay", "Fixed Pay"],
                                ["variablePay", "Variable Pay"],
                                ["joiningBonus", "Joining Bonus"],
                                ["retentionBonus", "Retention Bonus"],
                                ["internshipStipend", "Internship Stipend"],
                              ] as const).map(([field, label]) => (
                                <div key={field}>
                                  <label className="mb-2 block font-semibold">
                                    {label}
                                  </label>
                                  <input
                                    type="number"
                                    value={
                                      roleItem.compensation?.[field] ?? ""
                                    }
                                    onChange={(e) =>
                                      updateRoleChild(
                                        eventIndex,
                                        roleIndex,
                                        "compensation",
                                        field,
                                        e.target.value
                                          ? Number(e.target.value)
                                          : null
                                      )
                                    }
                                    className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                                  />
                                </div>
                              ))}

                              <div>
                                <label className="mb-2 block font-semibold">
                                  Salary Period
                                </label>
                                <input
                                  value={roleItem.compensation?.salaryPeriod || ""}
                                  onChange={(e) =>
                                    updateRoleChild(
                                      eventIndex,
                                      roleIndex,
                                      "compensation",
                                      "salaryPeriod",
                                      e.target.value
                                    )
                                  }
                                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block font-semibold">
                                  Currency
                                </label>
                                <input
                                  value={roleItem.compensation?.currency || ""}
                                  onChange={(e) =>
                                    updateRoleChild(
                                      eventIndex,
                                      roleIndex,
                                      "compensation",
                                      "currency",
                                      e.target.value
                                    )
                                  }
                                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* ELIGIBILITY */}

                          <div className="mt-8 border-t border-current/10 pt-8">
                            <div className="flex items-center justify-between"><h6 className="font-bold">Eligibility</h6>{roleItem.eligibility && <button type="button" onClick={() => removeRoleChild(eventIndex, roleIndex, "eligibility")} className="text-red-500">Remove</button>}</div>
                            <div className="mt-5 grid gap-5 md:grid-cols-3">
                              {([
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
                              ] as const).map(([field, label]) => (
                                <div key={field}>
                                  <label className="mb-2 block font-semibold">
                                    {label}
                                  </label>
                                  {field === "activeBacklogsAllowed" ||
                                  field === "gapAllowed" ? (
                                    <label className="flex items-center gap-3 pt-3">
                                      <input
                                        type="checkbox"
                                        checked={Boolean(
                                          roleItem.eligibility?.[field]
                                        )}
                                        onChange={(e) =>
                                          updateRoleChild(
                                            eventIndex,
                                            roleIndex,
                                            "eligibility",
                                            field,
                                            e.target.checked
                                          )
                                        }
                                      />
                                      <span>Allowed</span>
                                    </label>
                                  ) : (
                                    <input
                                      type="number"
                                      value={
                                        roleItem.eligibility?.[field] ?? ""
                                      }
                                      onChange={(e) =>
                                        updateRoleChild(
                                          eventIndex,
                                          roleIndex,
                                          "eligibility",
                                          field,
                                          e.target.value
                                            ? Number(e.target.value)
                                            : null
                                        )
                                      }
                                      className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                                    />
                                  )}
                                </div>
                              ))}

                              <div className="md:col-span-3">
                                <label className="mb-2 block font-semibold">
                                  Education Requirement
                                </label>
                                <textarea
                                  value={
                                    roleItem.eligibility?.educationRequirement ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateRoleChild(
                                      eventIndex,
                                      roleIndex,
                                      "eligibility",
                                      "educationRequirement",
                                      e.target.value
                                    )
                                  }
                                  rows={2}
                                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                                />
                              </div>

                              <div className="md:col-span-3">
                                <label className="mb-2 block font-semibold">
                                  Additional Requirements
                                </label>
                                <textarea
                                  value={
                                    roleItem.eligibility?.additionalRequirements ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateRoleChild(
                                      eventIndex,
                                      roleIndex,
                                      "eligibility",
                                      "additionalRequirements",
                                      e.target.value
                                    )
                                  }
                                  rows={2}
                                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* BRANCHES */}

                          <div className="mt-8 border-t border-current/10 pt-8">
                            <div className="flex items-center justify-between">
                              <h6 className="font-bold">Eligible Branches</h6>
                              <button
                                type="button"
                                onClick={() =>
                                  addRoleListItem(
                                    eventIndex,
                                    roleIndex,
                                    "branches"
                                  )
                                }
                                className="neo-button rounded-xl px-4 py-2"
                              >
                                + Add Branch
                              </button>
                            </div>

                            <div className="mt-4 space-y-4">
                              {roleItem.branches.map((branch, branchIndex) => (
                                <div
                                  key={branch.id || `branch-${branchIndex}`}
                                  className="grid gap-4 md:grid-cols-3"
                                >
                                  <input
                                    placeholder="Branch Name"
                                    value={branch.branchName || ""}
                                    onChange={(e) =>
                                      updateRoleListItem(
                                        eventIndex,
                                        roleIndex,
                                        "branches",
                                        branchIndex,
                                        "branchName",
                                        e.target.value
                                      )
                                    }
                                    className="neo-inset rounded-2xl px-4 py-3 outline-none"
                                  />
                                  <input
                                    placeholder="Branch Code"
                                    value={branch.branchCode || ""}
                                    onChange={(e) =>
                                      updateRoleListItem(
                                        eventIndex,
                                        roleIndex,
                                        "branches",
                                        branchIndex,
                                        "branchCode",
                                        e.target.value
                                      )
                                    }
                                    className="neo-inset rounded-2xl px-4 py-3 outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeRoleListItem(
                                        eventIndex,
                                        roleIndex,
                                        "branches",
                                        branchIndex
                                      )
                                    }
                                    className="text-left text-red-500"
                                  >
                                    Remove Branch
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* SELECTION ROUNDS */}

                          <div className="mt-8 border-t border-current/10 pt-8">
                            <div className="flex items-center justify-between">
                              <h6 className="font-bold">Selection Rounds</h6>
                              <button
                                type="button"
                                onClick={() =>
                                  addRoleListItem(
                                    eventIndex,
                                    roleIndex,
                                    "rounds"
                                  )
                                }
                                className="neo-button rounded-xl px-4 py-2"
                              >
                                + Add Round
                              </button>
                            </div>

                            <div className="mt-4 space-y-4">
                              {roleItem.rounds.map((round, roundIndex) => (
                                <div
                                  key={round.id || `round-${roundIndex}`}
                                  className="neo-inset rounded-2xl p-4"
                                >
                                  <div className="grid gap-4 md:grid-cols-4">
                                    <input
                                      type="number"
                                      placeholder="Round #"
                                      value={round.roundNumber ?? ""}
                                      onChange={(e) =>
                                        updateRoleListItem(
                                          eventIndex,
                                          roleIndex,
                                          "rounds",
                                          roundIndex,
                                          "roundNumber",
                                          e.target.value
                                            ? Number(e.target.value)
                                            : null
                                        )
                                      }
                                      className="neo rounded-2xl px-4 py-3 outline-none"
                                    />
                                    <input
                                      placeholder="Round Name"
                                      value={round.roundName || ""}
                                      onChange={(e) =>
                                        updateRoleListItem(
                                          eventIndex,
                                          roleIndex,
                                          "rounds",
                                          roundIndex,
                                          "roundName",
                                          e.target.value
                                        )
                                      }
                                      className="neo rounded-2xl px-4 py-3 outline-none"
                                    />
                                    <input
                                      placeholder="Round Type"
                                      value={round.roundType || ""}
                                      onChange={(e) =>
                                        updateRoleListItem(
                                          eventIndex,
                                          roleIndex,
                                          "rounds",
                                          roundIndex,
                                          "roundType",
                                          e.target.value
                                        )
                                      }
                                      className="neo rounded-2xl px-4 py-3 outline-none"
                                    />
                                    <input
                                      type="number"
                                      placeholder="Duration (min)"
                                      value={round.durationMinutes ?? ""}
                                      onChange={(e) =>
                                        updateRoleListItem(
                                          eventIndex,
                                          roleIndex,
                                          "rounds",
                                          roundIndex,
                                          "durationMinutes",
                                          e.target.value
                                            ? Number(e.target.value)
                                            : null
                                        )
                                      }
                                      className="neo rounded-2xl px-4 py-3 outline-none"
                                    />
                                  </div>
                                  <div className="mt-4 flex justify-between">
                                    <input
                                      placeholder="Eligibility to Next Round"
                                      value={
                                        round.eligibilityToNextRound || ""
                                      }
                                      onChange={(e) =>
                                        updateRoleListItem(
                                          eventIndex,
                                          roleIndex,
                                          "rounds",
                                          roundIndex,
                                          "eligibilityToNextRound",
                                          e.target.value
                                        )
                                      }
                                      className="neo rounded-2xl px-4 py-3 outline-none md:w-2/3"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeRoleListItem(
                                          eventIndex,
                                          roleIndex,
                                          "rounds",
                                          roundIndex
                                        )
                                      }
                                      className="text-red-500"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* LOCATIONS */}

                          <div className="mt-8 border-t border-current/10 pt-8">
                            <div className="flex items-center justify-between">
                              <h6 className="font-bold">Job Locations</h6>
                              <button
                                type="button"
                                onClick={() =>
                                  addRoleListItem(
                                    eventIndex,
                                    roleIndex,
                                    "locations"
                                  )
                                }
                                className="neo-button rounded-xl px-4 py-2"
                              >
                                + Add Location
                              </button>
                            </div>

                            <div className="mt-4 space-y-4">
                              {roleItem.locations.map((location, locationIndex) => (
                                <div
                                  key={location.id || `job-location-${locationIndex}`}
                                  className="neo-inset rounded-2xl p-4"
                                >
                                  <div className="grid gap-4 md:grid-cols-3">
                                    {([
                                      ["locationName", "Location Name"],
                                      ["city", "City"],
                                      ["state", "State"],
                                      ["country", "Country"],
                                      ["workMode", "Work Mode"],
                                      ["address", "Address"],
                                    ] as const).map(([field, label]) => (
                                      <input
                                        key={field}
                                        placeholder={label}
                                        value={
                                          ((location as any)[field] || "") as string
                                        }
                                        onChange={(e) =>
                                          updateRoleListItem(
                                            eventIndex,
                                            roleIndex,
                                            "locations",
                                            locationIndex,
                                            field,
                                            e.target.value
                                          )
                                        }
                                        className="neo rounded-2xl px-4 py-3 outline-none"
                                      />
                                    ))}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeRoleListItem(
                                        eventIndex,
                                        roleIndex,
                                        "locations",
                                        locationIndex
                                      )
                                    }
                                    className="mt-3 text-red-500"
                                  >
                                    Remove Location
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* VACANCY / INTERNSHIP / SKILLS / APPLICATION / BOND */}

                          <div className="mt-8 border-t border-current/10 pt-8">
                            <div className="grid gap-8 md:grid-cols-2">
                              <div>
                                <div className="flex items-center justify-between"><h6 className="font-bold">Role Vacancy</h6>{roleItem.vacancy && <button type="button" onClick={() => removeRoleChild(eventIndex, roleIndex, "vacancy")} className="text-red-500">Remove</button>}</div>
                                <label className="mb-2 mt-4 block font-semibold">
                                  Vacancy Count
                                </label>
                                <input
                                  type="number"
                                  value={roleItem.vacancy?.vacancyCount ?? ""}
                                  onChange={(e) =>
                                    updateRoleChild(
                                      eventIndex,
                                      roleIndex,
                                      "vacancy",
                                      "vacancyCount",
                                      e.target.value
                                        ? Number(e.target.value)
                                        : null
                                    )
                                  }
                                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                                />
                                <label className="mb-2 mt-4 block font-semibold">
                                  Selected Count
                                </label>
                                <input
                                  type="number"
                                  value={roleItem.vacancy?.selectedCount ?? ""}
                                  onChange={(e) =>
                                    updateRoleChild(
                                      eventIndex,
                                      roleIndex,
                                      "vacancy",
                                      "selectedCount",
                                      e.target.value
                                        ? Number(e.target.value)
                                        : null
                                    )
                                  }
                                  className="neo-inset w-full rounded-2xl px-5 py-4 outline-none"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between">
                                  <h6 className="font-bold">Internships</h6>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      addInternship(eventIndex, roleIndex)
                                    }
                                    className="neo-button rounded-xl px-3 py-2 text-sm"
                                  >
                                    + Add Internship
                                  </button>
                                </div>

                                <div className="mt-4 space-y-4">
                                  {roleItem.internships.map((internship, internshipIndex) => (
                                    <div
                                      key={internship.id || `internship-${internshipIndex}`}
                                      className="neo-inset rounded-2xl p-4"
                                    >
                                      <div className="mb-4 flex items-center justify-between">
                                        <span className="font-semibold">
                                          Internship {internshipIndex + 1}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeInternship(
                                              eventIndex,
                                              roleIndex,
                                              internshipIndex
                                            )
                                          }
                                          className="text-red-500"
                                        >
                                          Remove
                                        </button>
                                      </div>

                                      <div className="grid gap-4 md:grid-cols-2">
                                        <input
                                          type="number"
                                          placeholder="Internship Number"
                                          value={internship.internshipNumber ?? ""}
                                          onChange={(e) =>
                                            updateInternshipField(
                                              eventIndex,
                                              roleIndex,
                                              internshipIndex,
                                              "internshipNumber",
                                              e.target.value
                                                ? Number(e.target.value)
                                                : 0
                                            )
                                          }
                                          className="neo rounded-2xl px-4 py-3 outline-none"
                                        />
                                        <input
                                          type="number"
                                          placeholder="Duration (Months)"
                                          value={internship.durationMonths ?? ""}
                                          onChange={(e) =>
                                            updateInternshipField(
                                              eventIndex,
                                              roleIndex,
                                              internshipIndex,
                                              "durationMonths",
                                              e.target.value
                                                ? Number(e.target.value)
                                                : null
                                            )
                                          }
                                          className="neo rounded-2xl px-4 py-3 outline-none"
                                        />
                                        <input
                                          type="number"
                                          placeholder="Stipend"
                                          value={internship.stipend ?? ""}
                                          onChange={(e) =>
                                            updateInternshipField(
                                              eventIndex,
                                              roleIndex,
                                              internshipIndex,
                                              "stipend",
                                              e.target.value
                                                ? Number(e.target.value)
                                                : null
                                            )
                                          }
                                          className="neo rounded-2xl px-4 py-3 outline-none"
                                        />
                                        <input
                                          placeholder="Stipend Period"
                                          value={internship.stipendPeriod || ""}
                                          onChange={(e) =>
                                            updateInternshipField(
                                              eventIndex,
                                              roleIndex,
                                              internshipIndex,
                                              "stipendPeriod",
                                              e.target.value
                                            )
                                          }
                                          className="neo rounded-2xl px-4 py-3 outline-none"
                                        />
                                        <input
                                          placeholder="Internship Location"
                                          value={internship.internshipLocation || ""}
                                          onChange={(e) =>
                                            updateInternshipField(
                                              eventIndex,
                                              roleIndex,
                                              internshipIndex,
                                              "internshipLocation",
                                              e.target.value
                                            )
                                          }
                                          className="neo rounded-2xl px-4 py-3 outline-none"
                                        />
                                        <input
                                          placeholder="Work Mode"
                                          value={internship.workMode || ""}
                                          onChange={(e) =>
                                            updateInternshipField(
                                              eventIndex,
                                              roleIndex,
                                              internshipIndex,
                                              "workMode",
                                              e.target.value
                                            )
                                          }
                                          className="neo rounded-2xl px-4 py-3 outline-none"
                                        />
                                      </div>

                                      <div className="mt-4 flex flex-wrap gap-6">
                                        <label className="flex items-center gap-3">
                                          <input
                                            type="checkbox"
                                            checked={Boolean(internship.internshipRequired)}
                                            onChange={(e) =>
                                              updateInternshipField(
                                                eventIndex,
                                                roleIndex,
                                                internshipIndex,
                                                "internshipRequired",
                                                e.target.checked
                                              )
                                            }
                                          />
                                          Internship Required
                                        </label>
                                        <label className="flex items-center gap-3">
                                          <input
                                            type="checkbox"
                                            checked={Boolean(internship.ppoOffered)}
                                            onChange={(e) =>
                                              updateInternshipField(
                                                eventIndex,
                                                roleIndex,
                                                internshipIndex,
                                                "ppoOffered",
                                                e.target.checked
                                              )
                                            }
                                          />
                                          PPO Offered
                                        </label>
                                      </div>

                                      <input
                                        placeholder="PPO Criteria"
                                        value={internship.ppoCriteria || ""}
                                        onChange={(e) =>
                                          updateInternshipField(
                                            eventIndex,
                                            roleIndex,
                                            internshipIndex,
                                            "ppoCriteria",
                                            e.target.value
                                          )
                                        }
                                        className="neo mt-4 w-full rounded-2xl px-4 py-3 outline-none"
                                      />

                                      <textarea
                                        placeholder="Description"
                                        value={internship.description || ""}
                                        onChange={(e) =>
                                          updateInternshipField(
                                            eventIndex,
                                            roleIndex,
                                            internshipIndex,
                                            "description",
                                            e.target.value
                                          )
                                        }
                                        rows={2}
                                        className="neo mt-4 w-full rounded-2xl px-4 py-3 outline-none"
                                      />

                                      <textarea
                                        placeholder="Notes"
                                        value={internship.notes || ""}
                                        onChange={(e) =>
                                          updateInternshipField(
                                            eventIndex,
                                            roleIndex,
                                            internshipIndex,
                                            "notes",
                                            e.target.value
                                          )
                                        }
                                        rows={2}
                                        className="neo mt-4 w-full rounded-2xl px-4 py-3 outline-none"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between"><h6 className="font-bold">Skills</h6>{roleItem.skills && <button type="button" onClick={() => removeRoleChild(eventIndex, roleIndex, "skills")} className="text-red-500">Remove</button>}</div>
                                {([
                                  ["technicalSkills", "Technical Skills"],
                                  ["programmingLanguages", "Programming Languages"],
                                  ["frameworks", "Frameworks"],
                                  ["tools", "Tools"],
                                  ["databases", "Databases"],
                                  ["softSkills", "Soft Skills"],
                                  ["otherRequirements", "Other Requirements"],
                                ] as const).map(([field, label]) => (
                                  <textarea
                                    key={field}
                                    placeholder={label}
                                    value={
                                      ((roleItem.skills as any)?.[field] || "") as string
                                    }
                                    onChange={(e) =>
                                      updateRoleChild(
                                        eventIndex,
                                        roleIndex,
                                        "skills",
                                        field,
                                        e.target.value
                                      )
                                    }
                                    rows={2}
                                    className="neo-inset mt-3 w-full rounded-2xl px-4 py-3 outline-none"
                                  />
                                ))}
                              </div>

                              <div>
                                <div className="flex items-center justify-between"><h6 className="font-bold">Application Requirements</h6>{roleItem.applicationRequirements && <button type="button" onClick={() => removeRoleChild(eventIndex, roleIndex, "applicationRequirements")} className="text-red-500">Remove</button>}</div>
                                {([
                                  ["resumeRequired", "Resume Required"],
                                  ["coverLetterRequired", "Cover Letter Required"],
                                  ["portfolioRequired", "Portfolio Required"],
                                  ["certificatesRequired", "Certificates Required"],
                                  ["transcriptRequired", "Transcript Required"],
                                  ["photoRequired", "Photo Required"],
                                ] as const).map(([field, label]) => (
                                  <label key={field} className="mt-3 flex items-center gap-3">
                                    <input
                                      type="checkbox"
                                      checked={
                                        Boolean(
                                          (roleItem.applicationRequirements as any)?.[field]
                                        )
                                      }
                                      onChange={(e) =>
                                        updateRoleChild(
                                          eventIndex,
                                          roleIndex,
                                          "applicationRequirements",
                                          field,
                                          e.target.checked
                                        )
                                      }
                                    />
                                    {label}
                                  </label>
                                ))}
                                <textarea
                                  placeholder="Other Documents"
                                  value={
                                    roleItem.applicationRequirements?.otherDocuments ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateRoleChild(
                                      eventIndex,
                                      roleIndex,
                                      "applicationRequirements",
                                      "otherDocuments",
                                      e.target.value
                                    )
                                  }
                                  rows={3}
                                  className="neo-inset mt-4 w-full rounded-2xl px-4 py-3 outline-none"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <div className="flex items-center justify-between"><h6 className="font-bold">Role Bond</h6>{roleItem.bond && <button type="button" onClick={() => removeRoleChild(eventIndex, roleIndex, "bond")} className="text-red-500">Remove</button>}</div>
                                <label className="mt-4 flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={roleItem.bond?.bondRequired || false}
                                    onChange={(e) =>
                                      updateRoleChild(
                                        eventIndex,
                                        roleIndex,
                                        "bond",
                                        "bondRequired",
                                        e.target.checked
                                      )
                                    }
                                  />
                                  Bond Required
                                </label>
                                <div className="mt-4 grid gap-4 md:grid-cols-3">
                                  <input
                                    type="number"
                                    placeholder="Duration (Months)"
                                    value={
                                      roleItem.bond?.bondDurationMonths ?? ""
                                    }
                                    onChange={(e) =>
                                      updateRoleChild(
                                        eventIndex,
                                        roleIndex,
                                        "bond",
                                        "bondDurationMonths",
                                        e.target.value
                                          ? Number(e.target.value)
                                          : null
                                      )
                                    }
                                    className="neo-inset rounded-2xl px-4 py-3 outline-none"
                                  />
                                  <input
                                    type="number"
                                    placeholder="Bond Amount"
                                    value={roleItem.bond?.bondAmount ?? ""}
                                    onChange={(e) =>
                                      updateRoleChild(
                                        eventIndex,
                                        roleIndex,
                                        "bond",
                                        "bondAmount",
                                        e.target.value
                                          ? Number(e.target.value)
                                          : null
                                      )
                                    }
                                    className="neo-inset rounded-2xl px-4 py-3 outline-none"
                                  />
                                  <input
                                    placeholder="Start Condition"
                                    value={
                                      roleItem.bond?.bondStartCondition || ""
                                    }
                                    onChange={(e) =>
                                      updateRoleChild(
                                        eventIndex,
                                        roleIndex,
                                        "bond",
                                        "bondStartCondition",
                                        e.target.value
                                      )
                                    }
                                    className="neo-inset rounded-2xl px-4 py-3 outline-none"
                                  />
                                </div>
                                <textarea
                                  placeholder="Bond Details"
                                  value={roleItem.bond?.bondDetails || ""}
                                  onChange={(e) =>
                                    updateRoleChild(
                                      eventIndex,
                                      roleIndex,
                                      "bond",
                                      "bondDetails",
                                      e.target.value
                                    )
                                  }
                                  rows={3}
                                  className="neo-inset mt-4 w-full rounded-2xl px-4 py-3 outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* EVENT DOCUMENTS */}

                  <div className="mt-10 border-t border-current/10 pt-8">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xl font-bold">Hiring Documents</h5>
                      <button
                        type="button"
                        onClick={() =>
                          addEventListItem(eventIndex, "documents")
                        }
                        className="neo-button rounded-xl px-4 py-2"
                      >
                        + Add Document
                      </button>
                    </div>

                    <div className="mt-5 space-y-4">
                      {eventItem.documents.map((document, documentIndex) => (
                        <div
                          key={document.id || `document-${documentIndex}`}
                          className="neo-inset rounded-2xl p-4"
                        >
                          <div className="grid gap-4 md:grid-cols-2">
                            <input
                              placeholder="Document Name"
                              value={document.documentName || ""}
                              onChange={(e) =>
                                updateEventListItem(
                                  eventIndex,
                                  "documents",
                                  documentIndex,
                                  "documentName",
                                  e.target.value
                                )
                              }
                              className="neo rounded-2xl px-4 py-3 outline-none"
                            />
                            <input
                              placeholder="Document Type"
                              value={document.documentType || ""}
                              onChange={(e) =>
                                updateEventListItem(
                                  eventIndex,
                                  "documents",
                                  documentIndex,
                                  "documentType",
                                  e.target.value
                                )
                              }
                              className="neo rounded-2xl px-4 py-3 outline-none"
                            />
                            <input
                              placeholder="Document URL"
                              value={document.documentUrl || ""}
                              onChange={(e) =>
                                updateEventListItem(
                                  eventIndex,
                                  "documents",
                                  documentIndex,
                                  "documentUrl",
                                  e.target.value
                                )
                              }
                              className="neo rounded-2xl px-4 py-3 outline-none"
                            />
                            <input
                              type="date"
                              value={
                                document.documentDate
                                  ? String(document.documentDate).slice(0, 10)
                                  : ""
                              }
                              onChange={(e) =>
                                updateEventListItem(
                                  eventIndex,
                                  "documents",
                                  documentIndex,
                                  "documentDate",
                                  e.target.value || null
                                )
                              }
                              className="neo rounded-2xl px-4 py-3 outline-none"
                            />
                          </div>
                          <textarea
                            placeholder="Description"
                            value={document.documentDescription || ""}
                            onChange={(e) =>
                              updateEventListItem(
                                eventIndex,
                                "documents",
                                documentIndex,
                                "documentDescription",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="neo mt-4 w-full rounded-2xl px-4 py-3 outline-none"
                          />
                          <div className="mt-3 flex items-center justify-between">
                            <label className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={document.official || false}
                                onChange={(e) =>
                                  updateEventListItem(
                                    eventIndex,
                                    "documents",
                                    documentIndex,
                                    "official",
                                    e.target.checked
                                  )
                                }
                              />
                              Official
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                removeEventListItem(
                                  eventIndex,
                                  "documents",
                                  documentIndex
                                )
                              }
                              className="text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TIMELINE */}

                  <div className="mt-10 border-t border-current/10 pt-8">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xl font-bold">Hiring Timeline</h5>
                      <button
                        type="button"
                        onClick={() =>
                          addEventListItem(eventIndex, "timeline")
                        }
                        className="neo-button rounded-xl px-4 py-2"
                      >
                        + Add Stage
                      </button>
                    </div>

                    <div className="mt-5 space-y-4">
                      {eventItem.timeline.map((stage, stageIndex) => (
                        <div
                          key={stage.id || `timeline-${stageIndex}`}
                          className="neo-inset rounded-2xl p-4"
                        >
                          <div className="grid gap-4 md:grid-cols-3">
                            <input
                              type="number"
                              placeholder="Sequence"
                              value={stage.sequenceNumber ?? ""}
                              onChange={(e) =>
                                updateEventListItem(
                                  eventIndex,
                                  "timeline",
                                  stageIndex,
                                  "sequenceNumber",
                                  e.target.value
                                    ? Number(e.target.value)
                                    : null
                                )
                              }
                              className="neo rounded-2xl px-4 py-3 outline-none"
                            />
                            <input
                              placeholder="Stage Name"
                              value={stage.stageName || ""}
                              onChange={(e) =>
                                updateEventListItem(
                                  eventIndex,
                                  "timeline",
                                  stageIndex,
                                  "stageName",
                                  e.target.value
                                )
                              }
                              className="neo rounded-2xl px-4 py-3 outline-none"
                            />
                            <input
                              placeholder="Stage Type"
                              value={stage.stageType || ""}
                              onChange={(e) =>
                                updateEventListItem(
                                  eventIndex,
                                  "timeline",
                                  stageIndex,
                                  "stageType",
                                  e.target.value
                                )
                              }
                              className="neo rounded-2xl px-4 py-3 outline-none"
                            />
                            <input
                              type="date"
                              value={
                                stage.stageDate
                                  ? String(stage.stageDate).slice(0, 10)
                                  : ""
                              }
                              onChange={(e) =>
                                updateEventListItem(
                                  eventIndex,
                                  "timeline",
                                  stageIndex,
                                  "stageDate",
                                  e.target.value || null
                                )
                              }
                              className="neo rounded-2xl px-4 py-3 outline-none"
                            />
                            <input
                              placeholder="Status"
                              value={stage.status || ""}
                              onChange={(e) =>
                                updateEventListItem(
                                  eventIndex,
                                  "timeline",
                                  stageIndex,
                                  "status",
                                  e.target.value
                                )
                              }
                              className="neo rounded-2xl px-4 py-3 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeEventListItem(
                                  eventIndex,
                                  "timeline",
                                  stageIndex
                                )
                              }
                              className="text-left text-red-500"
                            >
                              Remove Stage
                            </button>
                          </div>
                          <textarea
                            placeholder="Description"
                            value={stage.description || ""}
                            onChange={(e) =>
                              updateEventListItem(
                                eventIndex,
                                "timeline",
                                stageIndex,
                                "description",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="neo mt-4 w-full rounded-2xl px-4 py-3 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DATA SOURCES */}

                  <div className="mt-10 border-t border-current/10 pt-8">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xl font-bold">Data Sources</h5>
                      <button
                        type="button"
                        onClick={() =>
                          addEventListItem(eventIndex, "sources")
                        }
                        className="neo-button rounded-xl px-4 py-2"
                      >
                        + Add Source
                      </button>
                    </div>

                    <div className="mt-5 space-y-4">
                      {eventItem.sources.map((source, sourceIndex) => (
                        <div
                          key={source.id || `source-${sourceIndex}`}
                          className="neo-inset rounded-2xl p-4"
                        >
                          <div className="grid gap-4 md:grid-cols-2">
                            <input
                              placeholder="Source Name"
                              value={source.sourceName || ""}
                              onChange={(e) =>
                                updateEventListItem(
                                  eventIndex,
                                  "sources",
                                  sourceIndex,
                                  "sourceName",
                                  e.target.value
                                )
                              }
                              className="neo rounded-2xl px-4 py-3 outline-none"
                            />
                            <input
                              placeholder="Source Type"
                              value={source.sourceType || ""}
                              onChange={(e) =>
                                updateEventListItem(
                                  eventIndex,
                                  "sources",
                                  sourceIndex,
                                  "sourceType",
                                  e.target.value
                                )
                              }
                              className="neo rounded-2xl px-4 py-3 outline-none"
                            />
                            <input
                              placeholder="Source URL"
                              value={source.sourceUrl || ""}
                              onChange={(e) =>
                                updateEventListItem(
                                  eventIndex,
                                  "sources",
                                  sourceIndex,
                                  "sourceUrl",
                                  e.target.value
                                )
                              }
                              className="neo rounded-2xl px-4 py-3 outline-none"
                            />
                            <input
                              type="date"
                              value={
                                source.sourceDate
                                  ? String(source.sourceDate).slice(0, 10)
                                  : ""
                              }
                              onChange={(e) =>
                                updateEventListItem(
                                  eventIndex,
                                  "sources",
                                  sourceIndex,
                                  "sourceDate",
                                  e.target.value || null
                                )
                              }
                              className="neo rounded-2xl px-4 py-3 outline-none"
                            />
                          </div>
                          <div className="mt-4 flex flex-wrap gap-6">
                            <label className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={source.official || false}
                                onChange={(e) =>
                                  updateEventListItem(
                                    eventIndex,
                                    "sources",
                                    sourceIndex,
                                    "official",
                                    e.target.checked
                                  )
                                }
                              />
                              Official
                            </label>
                            <label className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={source.verified || false}
                                onChange={(e) =>
                                  updateEventListItem(
                                    eventIndex,
                                    "sources",
                                    sourceIndex,
                                    "verified",
                                    e.target.checked
                                  )
                                }
                              />
                              Verified
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                removeEventListItem(
                                  eventIndex,
                                  "sources",
                                  sourceIndex
                                )
                              }
                              className="text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SAVE BUTTONS */}

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