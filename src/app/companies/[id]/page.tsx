import Link from "next/link";
import type { ReactNode } from "react";
import {
  getCompanyById,
  getCompanyLocations,
  getCompanyOwnership,
  getCompanyFinancials,
  getCompanyPeople,
  getCompanySocialLinks,
  getHiringEvents,
  getJobRoles,
  getRoleCompensation,
  getRoleEligibility,
  getEligibleBranches,
  getSelectionRounds,
  getJobLocations,
  getRoleInternships,
  getHiringDocuments,
  getHiringTimeline,
  getRoleVacancy,
  getRoleSkills,
  getRoleApplicationRequirements,
  getRoleBond,
  getDataSources,
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
  let hiringEvents: CampusHiringEvent[] = [];

  const roleData = new Map<
    number,
    {
      role: JobRole;
      compensation: Compensation | null;
      eligibility: EligibilityCriteria | null;
      branches: EligibleBranch[];
      selectionRounds: SelectionRound[];
      locations: JobLocation[];
      internships: InternshipDetails[];
      vacancy: RoleVacancy | null;
      skills: RoleSkills | null;
      applicationRequirements: RoleApplicationRequirement | null;
      bond: RoleBond | null;
    }
  >();

  const eventData = new Map<
    number,
    {
      documents: HiringDocument[];
      timeline: HiringTimeline[];
      sources: DataSource[];
    }
  >();

  try {
    company = await getCompanyById(companyId);

    locations = await getCompanyLocations(companyId);
    ownership = await getCompanyOwnership(companyId);
    financials = await getCompanyFinancials(companyId);
    persons = await getCompanyPeople(companyId);
    socialLinks = await getCompanySocialLinks(companyId);

    hiringEvents = await getHiringEvents(companyId);

    await Promise.all(
      hiringEvents.map(async (event) => {
        const [roles, documents, timeline, sources] =
          await Promise.all([
            getJobRoles(companyId, event.id),
            getHiringDocuments(companyId, event.id),
            getHiringTimeline(companyId, event.id),
            getOptionalList(
              () => getDataSources(companyId, event.id),
            ),
          ]);

        eventData.set(event.id, {
          documents,
          timeline,
          sources,
        });

        await Promise.all(
          roles.map(async (role) => {
            const [
              compensation,
              eligibility,
              branches,
              selectionRounds,
              roleLocations,
              internships,
              vacancy,
              skills,
              applicationRequirements,
              bond,
            ] = await Promise.all([
              getOptional(
                () => getRoleCompensation(
                  companyId,
                  event.id,
                  role.id
                )
              ),
              getOptional(
                () => getRoleEligibility(
                  companyId,
                  event.id,
                  role.id
                )
              ),
              getOptionalList(
                () => getEligibleBranches(
                  companyId,
                  event.id,
                  role.id
                )
              ),
              getOptionalList(
                () => getSelectionRounds(
                  companyId,
                  event.id,
                  role.id
                )
              ),
              getOptionalList(
                () => getJobLocations(
                  companyId,
                  event.id,
                  role.id
                )
              ),
              getOptionalList(
                () => getRoleInternships(
                  companyId,
                  event.id,
                  role.id
                )
              ),
              getOptional(
                () => getRoleVacancy(
                  companyId,
                  event.id,
                  role.id
                )
              ),
              getOptional(
                () => getRoleSkills(
                  companyId,
                  event.id,
                  role.id
                )
              ),
              getOptional(
                () => getRoleApplicationRequirements(
                  companyId,
                  event.id,
                  role.id
                )
              ),
              getOptional(
                () => getRoleBond(
                  companyId,
                  event.id,
                  role.id
                )
              ),
            ]);

            roleData.set(role.id, {
              role,
              compensation,
              eligibility,
              branches,
              selectionRounds,
              locations: roleLocations,
              internships,
              vacancy,
              skills,
              applicationRequirements,
              bond,
            });
          })
        );
      })
    );

  } catch (error) {
    console.error("Failed to load company details:", error);
  }

  const hiringChartData = hiringEvents
    .map((event) => ({
      year: event.academicYear,
      vacancies: event.totalVacancies ?? 0,
      selected: event.totalSelected ?? 0,
    }))
    .sort((a, b) => a.year.localeCompare(b.year));

  const financialChartData = financials
    .filter(
      (financial) =>
        financial.revenue !== null ||
        financial.profit !== null
    )
    .sort((a, b) =>
      a.financialYear.localeCompare(b.financialYear)
    );

  const roleCompensationChartData = hiringEvents
    .flatMap((event) => {
      const eventRoles = Array.from(roleData.values()).filter(
        (item) => item.role.hiringEvent?.id === event.id
      );

      return eventRoles
        .filter((item) => item.compensation?.ctc !== null && item.compensation?.ctc !== undefined)
        .map((item) => ({
          role:
            item.role.roleName.length > 24
              ? `${item.role.roleName.slice(0, 24)}…`
              : item.role.roleName,
          ctc: item.compensation?.ctc ?? 0,
          year: event.academicYear,
          currency: item.compensation?.currency || "",
        }));
    });

  const ownershipChartData = ownership
    .filter(
      (owner) =>
        owner.ownershipPercentage !== null &&
        owner.ownershipPercentage !== undefined
    )
    .map((owner) => ({
      name: owner.ownerName,
      value: owner.ownershipPercentage ?? 0,
    }));

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


      {/* Campus Hiring */}
      <section className="mx-auto mt-12 max-w-7xl">

        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">

          <div>
            <h3 className="text-3xl font-bold">
              Campus Hiring
            </h3>

            <p className="mt-2 opacity-60">
              Objective hiring information by academic year and role.
            </p>
          </div>

          {hiringEvents.length > 0 && (
            <span className="neo-inset rounded-2xl px-4 py-2 text-sm font-semibold">
              {hiringEvents.length} hiring event
              {hiringEvents.length === 1 ? "" : "s"}
            </span>
          )}

        </div>

        {hiringEvents.length > 0 ? (

          <div className="space-y-10">

            {hiringEvents.map((event) => {

              const eventInfo =
                eventData.get(event.id);

              const eventRoles =
                Array.from(roleData.values())
                  .filter(
                    (item) =>
                      item.role.hiringEvent?.id === event.id
                  );

              return (
                <div
                  key={event.id}
                  className="neo rounded-3xl p-8"
                >

                  {/* Event header */}
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h4 className="text-2xl font-bold">
                          {event.driveName ||
                            `Campus Hiring ${event.academicYear}`}
                        </h4>

                        <span className="neo-inset rounded-xl px-3 py-1 text-sm font-semibold">
                          {event.academicYear}
                        </span>

                        {event.status && (
                          <span className="rounded-xl border px-3 py-1 text-sm">
                            {event.status}
                          </span>
                        )}

                      </div>

                      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">

                        <HiringMeta
                          label="Drive Type"
                          value={event.driveType}
                        />

                        <HiringMeta
                          label="Recruitment Type"
                          value={event.recruitmentType}
                        />

                        <HiringMeta
                          label="Campus"
                          value={event.campusLocation}
                        />

                        <HiringMeta
                          label="Vacancies"
                          value={
                            event.totalVacancies !== null &&
                            event.totalVacancies !== undefined
                              ? String(event.totalVacancies)
                              : null
                          }
                        />

                        <HiringMeta
                          label="Selected"
                          value={
                            event.totalSelected !== null &&
                            event.totalSelected !== undefined
                              ? String(event.totalSelected)
                              : null
                          }
                        />

                        <HiringMeta
                          label="Application"
                          value={event.applicationMethod}
                        />

                      </div>

                    </div>

                    <div className="neo-inset rounded-2xl p-5 text-sm lg:min-w-56">

                      <p className="font-semibold">
                        Hiring Dates
                      </p>

                      <div className="mt-3 space-y-2 opacity-70">

                        <HiringDate
                          label="Registration"
                          value={formatDateRange(
                            event.registrationStart,
                            event.registrationEnd
                          )}
                        />

                        <HiringDate
                          label="Drive"
                          value={formatDate(event.driveDate)}
                        />

                        <HiringDate
                          label="Result"
                          value={formatDate(event.resultDate)}
                        />

                        <HiringDate
                          label="Joining"
                          value={formatDate(event.joiningDate)}
                        />

                      </div>

                    </div>

                  </div>

                  {event.notes && (
                    <div className="mt-6 rounded-2xl border p-5">

                      <p className="text-sm font-semibold">
                        Notes
                      </p>

                      <p className="mt-2 leading-6 opacity-70">
                        {event.notes}
                      </p>

                    </div>
                  )}

                  {/* Roles */}
                  <div className="mt-8">

                    <div className="mb-5 flex items-center justify-between">

                      <h5 className="text-xl font-bold">
                        Roles
                      </h5>

                      <span className="text-sm opacity-50">
                        {eventRoles.length} role
                        {eventRoles.length === 1 ? "" : "s"}
                      </span>

                    </div>

                    {eventRoles.length > 0 ? (

                      <div className="grid gap-6 lg:grid-cols-2">

                        {eventRoles.map((item) => {

                          const role =
                            item.role;

                          const compensation =
                            item.compensation;

                          const eligibility =
                            item.eligibility;

                          const vacancy =
                            item.vacancy;

                          return (
                            <div
                              key={role.id}
                              className="neo-inset rounded-3xl p-6"
                            >

                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                <div>

                                  <h6 className="text-xl font-bold">
                                    {role.roleName}
                                  </h6>

                                  {role.department && (
                                    <p className="mt-1 opacity-60">
                                      {role.department}
                                    </p>
                                  )}

                                </div>

                                {role.employmentType && (
                                  <span className="rounded-xl border px-3 py-1 text-sm">
                                    {role.employmentType}
                                  </span>
                                )}

                              </div>

                              {role.description && (
                                <p className="mt-4 leading-6 opacity-70">
                                  {role.description}
                                </p>
                              )}

                              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                                <RoleSummaryItem
                                  label="Work Mode"
                                  value={role.workMode}
                                />

                                <RoleSummaryItem
                                  label="Location Count"
                                  value={
                                    String(item.locations.length)
                                  }
                                />

                                <RoleSummaryItem
                                  label="Vacancies"
                                  value={
                                    vacancy?.vacancyCount !== null &&
                                    vacancy?.vacancyCount !== undefined
                                      ? String(vacancy.vacancyCount)
                                      : null
                                  }
                                />

                                <RoleSummaryItem
                                  label="Selected"
                                  value={
                                    vacancy?.selectedCount !== null &&
                                    vacancy?.selectedCount !== undefined
                                      ? String(vacancy.selectedCount)
                                      : null
                                  }
                                />

                              </div>

                              {/* Compensation */}
                              {compensation && (
                                <div className="mt-6 rounded-2xl border p-5">

                                  <p className="font-semibold">
                                    Compensation
                                  </p>

                                  <div className="mt-4 grid gap-4 sm:grid-cols-2">

                                    <RoleSummaryItem
                                      label="CTC"
                                      value={formatMoney(
                                        compensation.ctc,
                                        compensation.currency
                                      )}
                                    />

                                    <RoleSummaryItem
                                      label="Fixed Pay"
                                      value={formatMoney(
                                        compensation.fixedPay,
                                        compensation.currency
                                      )}
                                    />

                                    <RoleSummaryItem
                                      label="Variable Pay"
                                      value={formatMoney(
                                        compensation.variablePay,
                                        compensation.currency
                                      )}
                                    />

                                    <RoleSummaryItem
                                      label="Joining Bonus"
                                      value={formatMoney(
                                        compensation.joiningBonus,
                                        compensation.currency
                                      )}
                                    />

                                    <RoleSummaryItem
                                      label="Retention Bonus"
                                      value={formatMoney(
                                        compensation.retentionBonus,
                                        compensation.currency
                                      )}
                                    />

                                    <RoleSummaryItem
                                      label="Internship Stipend"
                                      value={formatMoney(
                                        compensation.internshipStipend,
                                        compensation.currency
                                      )}
                                    />

                                  </div>

                                </div>
                              )}

                              {/* Eligibility */}
                              {eligibility && (
                                <div className="mt-6 rounded-2xl border p-5">

                                  <p className="font-semibold">
                                    Eligibility
                                  </p>

                                  <div className="mt-4 grid gap-4 sm:grid-cols-2">

                                    <RoleSummaryItem
                                      label="Minimum CGPA"
                                      value={
                                        eligibility.minimumCgpa !== null &&
                                        eligibility.minimumCgpa !== undefined
                                          ? String(eligibility.minimumCgpa)
                                          : null
                                      }
                                    />

                                    <RoleSummaryItem
                                      label="Minimum Percentage"
                                      value={
                                        eligibility.minimumPercentage !== null &&
                                        eligibility.minimumPercentage !== undefined
                                          ? String(eligibility.minimumPercentage)
                                          : null
                                      }
                                    />

                                    <RoleSummaryItem
                                      label="Maximum Backlogs"
                                      value={
                                        eligibility.maximumBacklogs !== null &&
                                        eligibility.maximumBacklogs !== undefined
                                          ? String(eligibility.maximumBacklogs)
                                          : null
                                      }
                                    />

                                    <RoleSummaryItem
                                      label="Active Backlogs"
                                      value={
                                        eligibility.activeBacklogsAllowed === null ||
                                        eligibility.activeBacklogsAllowed === undefined
                                          ? null
                                          : eligibility.activeBacklogsAllowed
                                            ? "Allowed"
                                            : "Not allowed"
                                      }
                                    />

                                    <RoleSummaryItem
                                      label="Graduation From"
                                      value={
                                        eligibility.graduationYearFrom !== null &&
                                        eligibility.graduationYearFrom !== undefined
                                          ? String(eligibility.graduationYearFrom)
                                          : null
                                      }
                                    />

                                    <RoleSummaryItem
                                      label="Graduation To"
                                      value={
                                        eligibility.graduationYearTo !== null &&
                                        eligibility.graduationYearTo !== undefined
                                          ? String(eligibility.graduationYearTo)
                                          : null
                                      }
                                    />

                                  </div>

                                </div>
                              )}

                              {/* Eligible branches */}
                              {item.branches.length > 0 && (
                                <div className="mt-6">

                                  <p className="text-sm font-semibold">
                                    Eligible Branches
                                  </p>

                                  <div className="mt-3 flex flex-wrap gap-2">

                                    {item.branches.map((branch) => (
                                      <span
                                        key={branch.id}
                                        className="rounded-xl border px-3 py-2 text-sm"
                                      >
                                        {branch.branchName}
                                        {branch.branchCode
                                          ? ` (${branch.branchCode})`
                                          : ""}
                                      </span>
                                    ))}

                                  </div>

                                </div>
                              )}

                              {/* Skills */}
                              {item.skills && (
                                <div className="mt-6 rounded-2xl border p-5">

                                  <p className="font-semibold">
                                    Skills & Requirements
                                  </p>

                                  <div className="mt-4 space-y-3">

                                    <TextListItem
                                      label="Technical Skills"
                                      value={item.skills.technicalSkills}
                                    />

                                    <TextListItem
                                      label="Programming Languages"
                                      value={item.skills.programmingLanguages}
                                    />

                                    <TextListItem
                                      label="Frameworks"
                                      value={item.skills.frameworks}
                                    />

                                    <TextListItem
                                      label="Tools"
                                      value={item.skills.tools}
                                    />

                                    <TextListItem
                                      label="Databases"
                                      value={item.skills.databases}
                                    />

                                    <TextListItem
                                      label="Soft Skills"
                                      value={item.skills.softSkills}
                                    />

                                    <TextListItem
                                      label="Other Requirements"
                                      value={item.skills.otherRequirements}
                                    />

                                  </div>

                                </div>
                              )}

                              {/* Selection rounds */}
                              {item.selectionRounds.length > 0 && (
                                <div className="mt-6">

                                  <p className="font-semibold">
                                    Selection Process
                                  </p>

                                  <div className="mt-4 space-y-3">

                                    {item.selectionRounds.map((round) => (
                                      <div
                                        key={round.id}
                                        className="rounded-2xl border p-4"
                                      >

                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                          <p className="font-semibold">
                                            {round.roundNumber}.
                                            {" "}
                                            {round.roundName}
                                          </p>

                                          {round.roundType && (
                                            <span className="text-sm opacity-50">
                                              {round.roundType}
                                            </span>
                                          )}

                                        </div>

                                        {round.description && (
                                          <p className="mt-2 text-sm leading-6 opacity-70">
                                            {round.description}
                                          </p>
                                        )}

                                      </div>
                                    ))}

                                  </div>

                                </div>
                              )}

                              {/* Locations */}
                              {item.locations.length > 0 && (
                                <div className="mt-6">

                                  <p className="font-semibold">
                                    Job Locations
                                  </p>

                                  <div className="mt-3 flex flex-wrap gap-2">

                                    {item.locations.map((location) => (
                                      <span
                                        key={location.id}
                                        className="rounded-xl border px-3 py-2 text-sm"
                                      >
                                        {location.locationName}
                                      </span>
                                    ))}

                                  </div>

                                </div>
                              )}

                              {/* Internship */}
                              {item.internships.length > 0 && (
                                <div className="mt-6 rounded-2xl border p-5">

                                  <p className="font-semibold">
                                    Internship
                                  </p>

                                  <div className="mt-4 space-y-3">

                                    {item.internships.map((internship) => (
                                      <div
                                        key={internship.id}
                                        className="text-sm"
                                      >

                                        <p className="font-semibold">
                                          Internship {internship.internshipNumber}
                                        </p>

                                        <div className="mt-2 grid gap-2 sm:grid-cols-2">

                                          <RoleSummaryItem
                                            label="Required"
                                            value={
                                              internship.internshipRequired === null ||
                                              internship.internshipRequired === undefined
                                                ? null
                                                : internship.internshipRequired
                                                  ? "Yes"
                                                  : "No"
                                            }
                                          />

                                          <RoleSummaryItem
                                            label="Duration"
                                            value={
                                              internship.durationMonths !== null &&
                                              internship.durationMonths !== undefined
                                                ? `${internship.durationMonths} months`
                                                : null
                                            }
                                          />

                                          <RoleSummaryItem
                                            label="Stipend"
                                            value={formatMoney(
                                              internship.stipend,
                                              internship.stipendPeriod
                                            )}
                                          />

                                          <RoleSummaryItem
                                            label="PPO"
                                            value={
                                              internship.ppoOffered === null ||
                                              internship.ppoOffered === undefined
                                                ? null
                                                : internship.ppoOffered
                                                  ? "Offered"
                                                  : "Not offered"
                                            }
                                          />

                                        </div>

                                      </div>
                                    ))}

                                  </div>

                                </div>
                              )}

                              {/* Bond */}
                              {item.bond && (
                                <div className="mt-6 rounded-2xl border p-5">

                                  <p className="font-semibold">
                                    Bond
                                  </p>

                                  <div className="mt-4 grid gap-4 sm:grid-cols-2">

                                    <RoleSummaryItem
                                      label="Required"
                                      value={
                                        item.bond.bondRequired === null ||
                                        item.bond.bondRequired === undefined
                                          ? null
                                          : item.bond.bondRequired
                                            ? "Yes"
                                            : "No"
                                      }
                                    />

                                    <RoleSummaryItem
                                      label="Duration"
                                      value={
                                        item.bond.bondDurationMonths !== null &&
                                        item.bond.bondDurationMonths !== undefined
                                          ? `${item.bond.bondDurationMonths} months`
                                          : null
                                      }
                                    />

                                    <RoleSummaryItem
                                      label="Amount"
                                      value={formatMoney(
                                        item.bond.bondAmount,
                                        compensation?.currency || null
                                      )}
                                    />

                                  </div>

                                  {item.bond.bondDetails && (
                                    <p className="mt-4 text-sm leading-6 opacity-70">
                                      {item.bond.bondDetails}
                                    </p>
                                  )}

                                </div>
                              )}

                              {/* Application requirements */}
                              {item.applicationRequirements && (
                                <div className="mt-6 rounded-2xl border p-5">

                                  <p className="font-semibold">
                                    Application Requirements
                                  </p>

                                  <div className="mt-4 flex flex-wrap gap-2">

                                    {item.applicationRequirements.resumeRequired && (
                                      <RequirementTag text="Resume" />
                                    )}

                                    {item.applicationRequirements.coverLetterRequired && (
                                      <RequirementTag text="Cover Letter" />
                                    )}

                                    {item.applicationRequirements.portfolioRequired && (
                                      <RequirementTag text="Portfolio" />
                                    )}

                                    {item.applicationRequirements.certificatesRequired && (
                                      <RequirementTag text="Certificates" />
                                    )}

                                    {item.applicationRequirements.transcriptRequired && (
                                      <RequirementTag text="Transcript" />
                                    )}

                                    {item.applicationRequirements.photoRequired && (
                                      <RequirementTag text="Photo" />
                                    )}

                                  </div>

                                  {item.applicationRequirements.applicationInstructions && (
                                    <p className="mt-4 text-sm leading-6 opacity-70">
                                      {item.applicationRequirements.applicationInstructions}
                                    </p>
                                  )}

                                </div>
                              )}

                              {role.responsibilities && (
                                <div className="mt-6">

                                  <p className="text-sm font-semibold">
                                    Responsibilities
                                  </p>

                                  <p className="mt-2 text-sm leading-6 opacity-70">
                                    {role.responsibilities}
                                  </p>

                                </div>
                              )}

                            </div>
                          );
                        })}

                      </div>

                    ) : (

                      <div className="rounded-2xl border p-6 text-center">
                        <p className="opacity-60">
                          No role information available for this hiring event.
                        </p>
                      </div>

                    )}

                  </div>

                  {/* Event timeline */}
                  {eventInfo && eventInfo.timeline.length > 0 && (
                    <div className="mt-8">

                      <h5 className="text-xl font-bold">
                        Hiring Timeline
                      </h5>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">

                        {eventInfo.timeline.map((stage) => (
                          <div
                            key={stage.id}
                            className="rounded-2xl border p-5"
                          >

                            <div className="flex items-start justify-between gap-4">

                              <div>

                                <p className="font-semibold">
                                  {stage.sequenceNumber}.
                                  {" "}
                                  {stage.stageName}
                                </p>

                                {stage.stageType && (
                                  <p className="mt-1 text-sm opacity-50">
                                    {stage.stageType}
                                  </p>
                                )}

                              </div>

                              {stage.status && (
                                <span className="text-sm font-semibold">
                                  {stage.status}
                                </span>
                              )}

                            </div>

                            <p className="mt-3 text-sm opacity-60">
                              {formatDate(stage.stageDate)}
                            </p>

                            {stage.description && (
                              <p className="mt-3 text-sm leading-6 opacity-70">
                                {stage.description}
                              </p>
                            )}

                          </div>
                        ))}

                      </div>

                    </div>
                  )}

                  {/* Documents and sources */}
                  {eventInfo &&
                    (eventInfo.documents.length > 0 ||
                      eventInfo.sources.length > 0) && (
                      <div className="mt-8 grid gap-6 md:grid-cols-2">

                        {eventInfo.documents.length > 0 && (
                          <div className="rounded-2xl border p-5">

                            <h5 className="font-semibold">
                              Hiring Documents
                            </h5>

                            <div className="mt-4 space-y-3">

                              {eventInfo.documents.map((document) => (
                                <div key={document.id}>

                                  {document.documentUrl ? (
                                    <a
                                      href={document.documentUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-semibold underline"
                                    >
                                      {document.documentName}
                                    </a>
                                  ) : (
                                    <p className="font-semibold">
                                      {document.documentName}
                                    </p>
                                  )}

                                  {document.documentType && (
                                    <p className="mt-1 text-sm opacity-50">
                                      {document.documentType}
                                    </p>
                                  )}

                                </div>
                              ))}

                            </div>

                          </div>
                        )}

                        {eventInfo.sources.length > 0 && (
                          <div className="rounded-2xl border p-5">

                            <h5 className="font-semibold">
                              Data Sources
                            </h5>

                            <div className="mt-4 space-y-3">

                              {eventInfo.sources.map((source) => (
                                <div key={source.id}>

                                  {source.sourceUrl ? (
                                    <a
                                      href={source.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-semibold underline"
                                    >
                                      {source.sourceName}
                                    </a>
                                  ) : (
                                    <p className="font-semibold">
                                      {source.sourceName}
                                    </p>
                                  )}

                                  <div className="mt-1 flex flex-wrap gap-2 text-sm opacity-50">

                                    {source.sourceType && (
                                      <span>
                                        {source.sourceType}
                                      </span>
                                    )}

                                    {source.official && (
                                      <span>
                                        Official
                                      </span>
                                    )}

                                    {source.verified && (
                                      <span>
                                        Verified
                                      </span>
                                    )}

                                  </div>

                                </div>
                              ))}

                            </div>

                          </div>
                        )}

                      </div>
                    )}

                  {event.officialNotificationUrl && (
                    <div className="mt-6">

                      <a
                        href={event.officialNotificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neo-button inline-block rounded-2xl px-5 py-3 font-semibold"
                      >
                        Official Hiring Notification
                      </a>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

        ) : (

          <EmptySection text="No campus hiring information available." />

        )}

      </section>


      {/* Data Visualizations */}
      {(hiringChartData.length > 0 ||
        financialChartData.length > 0 ||
        roleCompensationChartData.length > 0 ||
        ownershipChartData.length > 0) && (
        <section className="mx-auto mt-12 max-w-7xl">

          <div className="mb-6">
            <h3 className="text-3xl font-bold">
              Data Overview
            </h3>

            <p className="mt-2 opacity-60">
              Visual summary of the objective company and campus hiring data.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">

            {hiringChartData.length > 0 && (
              <ChartCard
                title="Campus Hiring Volume"
                description="Vacancies and selected candidates reported for each academic year."
              >
                <HiringVolumeChart data={hiringChartData} />
              </ChartCard>
            )}

            {financialChartData.length > 0 && (
              <ChartCard
                title="Financial Trend"
                description="Revenue and profit across the available financial years."
              >
                <FinancialTrendChart data={financialChartData} />
              </ChartCard>
            )}

            {roleCompensationChartData.length > 0 && (
              <ChartCard
                title="CTC by Campus Role"
                description="Reported CTC for roles where compensation data is available."
              >
                <RoleCompensationChart data={roleCompensationChartData} />
              </ChartCard>
            )}

            {ownershipChartData.length > 0 && (
              <ChartCard
                title="Ownership Mix"
                description="Reported ownership percentages for the company."
              >
                <OwnershipPieChart data={ownershipChartData} />
              </ChartCard>
            )}

          </div>

        </section>
      )}


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

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="neo rounded-3xl p-7">

      <h4 className="text-xl font-bold">
        {title}
      </h4>

      <p className="mt-2 text-sm opacity-60">
        {description}
      </p>

      <div className="mt-6">
        {children}
      </div>

    </div>
  );
}


function HiringVolumeChart({
  data,
}: {
  data: {
    year: string;
    vacancies: number;
    selected: number;
  }[];
}) {
  const maxValue = Math.max(
    1,
    ...data.flatMap((item) => [
      item.vacancies,
      item.selected,
    ])
  );

  return (
    <div className="space-y-5">

      {data.map((item) => (
        <div key={item.year}>

          <div className="mb-2 flex items-center justify-between text-sm">

            <span className="font-semibold">
              {item.year}
            </span>

            <span className="opacity-60">
              {item.selected} selected / {item.vacancies} vacancies
            </span>

          </div>

          <div className="space-y-2">

            <ChartBar
              label="Vacancies"
              value={item.vacancies}
              maxValue={maxValue}
            />

            <ChartBar
              label="Selected"
              value={item.selected}
              maxValue={maxValue}
            />

          </div>

        </div>
      ))}

      <ChartLegend
        items={[
          "Vacancies",
          "Selected",
        ]}
      />

    </div>
  );
}


function FinancialTrendChart({
  data,
}: {
  data: CompanyFinancial[];
}) {
  const width = 620;
  const height = 260;
  const padding = 42;

  const values = data.flatMap((item) => [
    item.revenue ?? 0,
    item.profit ?? 0,
  ]);

  const maxValue = Math.max(1, ...values);

  const getX = (index: number) =>
    data.length === 1
      ? width / 2
      : padding +
        (index * (width - padding * 2)) /
          (data.length - 1);

  const getY = (value: number) =>
    height -
    padding -
    (value / maxValue) *
      (height - padding * 2);

  const revenuePoints = data
    .map(
      (item, index) =>
        `${getX(index)},${getY(item.revenue ?? 0)}`
    )
    .join(" ");

  const profitPoints = data
    .map(
      (item, index) =>
        `${getX(index)},${getY(item.profit ?? 0)}`
    )
    .join(" ");

  return (
    <div className="overflow-x-auto">

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto min-w-[560px] w-full"
        role="img"
        aria-label="Financial trend chart"
      >

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y =
            height -
            padding -
            ratio * (height - padding * 2);

          return (
            <line
              key={ratio}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.12"
            />
          );
        })}

        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={revenuePoints}
        />

        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="8 8"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={profitPoints}
        />

        {data.map((item, index) => (
          <g key={item.id}>

            <circle
              cx={getX(index)}
              cy={getY(item.revenue ?? 0)}
              r="5"
              fill="currentColor"
            />

            <circle
              cx={getX(index)}
              cy={getY(item.profit ?? 0)}
              r="5"
              fill="currentColor"
              fillOpacity="0.45"
            />

            <text
              x={getX(index)}
              y={height - 12}
              textAnchor="middle"
              fontSize="12"
              fill="currentColor"
              opacity="0.6"
            >
              {item.financialYear}
            </text>

          </g>
        ))}

      </svg>

      <ChartLegend
        items={[
          "Revenue",
          "Profit",
        ]}
      />

    </div>
  );
}


function RoleCompensationChart({
  data,
}: {
  data: {
    role: string;
    ctc: number;
    year: string;
    currency: string;
  }[];
}) {
  const maxValue = Math.max(
    1,
    ...data.map((item) => item.ctc)
  );

  return (
    <div className="space-y-4">

      {data.map((item) => (
        <div key={`${item.year}-${item.role}`}>

          <div className="mb-2 flex items-center justify-between gap-4 text-sm">

            <span className="font-semibold">
              {item.role}
            </span>

            <span className="shrink-0 opacity-60">
              {formatMoney(item.ctc, item.currency)}
            </span>

          </div>

          <div className="h-4 overflow-hidden rounded-full bg-current/10">

            <div
              className="h-full rounded-full bg-current"
              style={{
                width: `${Math.max(
                  2,
                  (item.ctc / maxValue) * 100
                )}%`,
              }}
            />

          </div>

          <p className="mt-1 text-xs opacity-40">
            {item.year}
          </p>

        </div>
      ))}

    </div>
  );
}


function OwnershipPieChart({
  data,
}: {
  data: {
    name: string;
    value: number;
  }[];
}) {
  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const radius = 82;
  const center = 100;
  const circumference =
    2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-7 md:flex-row">

      <div className="shrink-0">

        <svg
          viewBox="0 0 200 200"
          className="h-52 w-52"
          role="img"
          aria-label="Ownership mix pie chart"
        >

          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="32"
          />

          {data.map((item) => {

            const percentage =
              total > 0
                ? item.value / total
                : 0;

            const dash =
              percentage * circumference;

            const currentOffset =
              offset;

            offset += dash;

            return (
              <circle
                key={item.name}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="32"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-currentOffset}
                transform={`rotate(-90 ${center} ${center})`}
                strokeLinecap="butt"
              />
            );
          })}

          <circle
            cx={center}
            cy={center}
            r="54"
            fill="currentColor"
            fillOpacity="0.04"
          />

          <text
            x="100"
            y="96"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fill="currentColor"
          >
            {data.length}
          </text>

          <text
            x="100"
            y="116"
            textAnchor="middle"
            fontSize="11"
            fill="currentColor"
            opacity="0.6"
          >
            owners
          </text>

        </svg>

      </div>

      <div className="w-full space-y-3">

        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-4"
          >

            <span className="text-sm font-semibold">
              {item.name}
            </span>

            <span className="text-sm opacity-60">
              {item.value}%
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}


function ChartBar({
  label,
  value,
  maxValue,
}: {
  label: string;
  value: number;
  maxValue: number;
}) {
  return (
    <div className="flex items-center gap-3">

      <span className="w-20 shrink-0 text-xs opacity-50">
        {label}
      </span>

      <div className="h-3 flex-1 overflow-hidden rounded-full bg-current/10">

        <div
          className="h-full rounded-full bg-current"
          style={{
            width: `${Math.max(
              value > 0 ? 2 : 0,
              (value / maxValue) * 100
            )}%`,
          }}
        />

      </div>

      <span className="w-16 text-right text-xs font-semibold">
        {value.toLocaleString()}
      </span>

    </div>
  );
}


function ChartLegend({
  items,
}: {
  items: string[];
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-4 text-xs opacity-60">

      {items.map((item, index) => (
        <span
          key={item}
          className="flex items-center gap-2"
        >

          <span
            className={`h-2.5 w-2.5 rounded-full ${
              index === 0
                ? "bg-current"
                : "border-2 border-current opacity-50"
            }`}
          />

          {item}

        </span>
      ))}

    </div>
  );
}


async function getOptional<T>(
  request: () => Promise<T>
): Promise<T | null> {
  try {
    return await request();
  } catch {
    return null;
  }
}


async function getOptionalList<T>(
  request: () => Promise<T[]>
): Promise<T[]> {
  try {
    return await request();
  } catch {
    return [];
  }
}


function formatDate(
  value: string | null | undefined
): string {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleDateString();
}


function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined
): string {
  if (!start && !end) {
    return "Not available";
  }

  if (start && end) {
    return `${formatDate(start)} - ${formatDate(end)}`;
  }

  return formatDate(start || end);
}


function formatMoney(
  value: number | null | undefined,
  currency: string | null | undefined
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return `${currency || ""} ${value.toLocaleString()}`.trim();
}


function HiringMeta({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide opacity-40">
        {label}
      </p>

      <p className="mt-1 font-semibold">
        {value || "Not available"}
      </p>
    </div>
  );
}


function HiringDate({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="text-right font-semibold">
        {value}
      </span>
    </div>
  );
}


function RoleSummaryItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide opacity-40">
        {label}
      </p>

      <p className="mt-1 font-semibold">
        {value || "Not available"}
      </p>
    </div>
  );
}


function TextListItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <p className="text-sm font-semibold">
        {label}
      </p>

      <p className="mt-1 text-sm leading-6 opacity-70">
        {value}
      </p>
    </div>
  );
}


function RequirementTag({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-xl border px-3 py-2 text-sm">
      {text}
    </span>
  );
}


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