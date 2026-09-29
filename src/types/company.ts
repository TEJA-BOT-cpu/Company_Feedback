export interface Company {

  id: number;

  name: string;

  description: string | null;

  industry: string | null;

  companyType: string | null;

  foundedYear: number | null;

  employeeCount: number | null;

  website: string | null;

  headquarters: string | null;

  logoUrl: string | null;

  createdAt: string;

  updatedAt: string;

}


export interface CompanyLocation {

  id: number;

  company: Company;

  address: string | null;

  city: string | null;

  state: string | null;

  country: string | null;

  postalCode: string | null;

  locationType: string | null;

}


export interface CompanyOwnership {

  id: number;

  company: Company;

  ownerName: string;

  ownerType: string | null;

  ownershipPercentage: number | null;

}


export interface CompanyFinancial {

  id: number;

  company: Company;

  financialYear: string;

  revenue: number | null;

  profit: number | null;

  marketCap: number | null;

  currency: string | null;

}


export interface CompanyPerson {

  id: number;

  company: Company;

  name: string;

  role: string | null;

  bio: string | null;

  linkedinUrl: string | null;

}


export interface CompanySocialLink {

  id: number;

  company: Company;

  platform: string | null;

  url: string;

}


/* =========================================================
   CAMPUS HIRING EVENT
========================================================= */

export interface CampusHiringEvent {

  id: number;

  company: Company;

  academicYear: string;

  driveName: string | null;

  driveType: string | null;

  recruitmentType: string | null;

  status: string | null;

  registrationStart: string | null;

  registrationEnd: string | null;

  prePlacementTalkDate: string | null;

  driveDate: string | null;

  resultDate: string | null;

  joiningDate: string | null;

  totalVacancies: number | null;

  totalSelected: number | null;

  campusLocation: string | null;

  applicationMethod: string | null;

  officialNotificationUrl: string | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;

}


/* =========================================================
   JOB ROLE
========================================================= */

export interface JobRole {

  id: number;

  hiringEvent: CampusHiringEvent;

  roleName: string;

  description: string | null;

  employmentType: string | null;

  workMode: string | null;

  department: string | null;

  responsibilities: string | null;

  skills: string | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;

}


/* =========================================================
   COMPENSATION
========================================================= */

export interface Compensation {

  id: number;

  jobRole: JobRole;

  ctc: number | null;

  fixedPay: number | null;

  variablePay: number | null;

  joiningBonus: number | null;

  retentionBonus: number | null;

  internshipStipend: number | null;

  salaryPeriod: string | null;

  currency: string | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;

}


/* =========================================================
   ELIGIBILITY CRITERIA
========================================================= */

export interface EligibilityCriteria {

  id: number;

  jobRole: JobRole;

  minimumCgpa: number | null;

  minimumPercentage: number | null;

  maximumBacklogs: number | null;

  activeBacklogsAllowed: boolean | null;

  gapAllowed: boolean | null;

  maximumGapYears: number | null;

  graduationYearFrom: number | null;

  graduationYearTo: number | null;

  minimumAge: number | null;

  maximumAge: number | null;

  educationRequirement: string | null;

  additionalRequirements: string | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;

}


/* =========================================================
   ELIGIBLE BRANCH
========================================================= */

export interface EligibleBranch {

  id: number;

  jobRole: JobRole;

  branchName: string;

  branchCode: string | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;

}


/* =========================================================
   SELECTION ROUND
========================================================= */

export interface SelectionRound {

  id: number;

  jobRole: JobRole;

  roundNumber: number;

  roundName: string;

  roundType: string | null;

  description: string | null;

  durationMinutes: number | null;

  eliminationRound: boolean | null;

  eligibilityToNextRound: string | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;

}


/* =========================================================
   JOB LOCATION
========================================================= */

export interface JobLocation {

  id: number;

  jobRole: JobRole;

  locationName: string | null;

  city: string | null;

  state: string | null;

  country: string | null;

  workMode: string | null;

  address: string | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;

}


/* =========================================================
   INTERNSHIP DETAILS
========================================================= */

export interface InternshipDetails {

  id: number;

  jobRole: JobRole;

  internshipNumber: number;

  internshipRequired: boolean | null;

  durationMonths: number | null;

  stipend: number | null;

  stipendPeriod: string | null;

  ppoOffered: boolean | null;

  ppoCriteria: string | null;

  internshipLocation: string | null;

  workMode: string | null;

  description: string | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;

}


/* =========================================================
   HIRING DOCUMENT
========================================================= */

export interface HiringDocument {

  id: number;

  hiringEvent: CampusHiringEvent;

  documentName: string;

  documentType: string | null;

  documentUrl: string | null;

  documentDescription: string | null;

  official: boolean | null;

  documentDate: string | null;

  createdAt: string;

  updatedAt: string;

}


/* =========================================================
   HIRING TIMELINE
========================================================= */

export interface HiringTimeline {

  id: number;

  hiringEvent: CampusHiringEvent;

  sequenceNumber: number;

  stageName: string;

  stageType: string | null;

  stageDate: string | null;

  startTime: string | null;

  endTime: string | null;

  description: string | null;

  status: string | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;

}


/* =========================================================
   ROLE VACANCY
========================================================= */

export interface RoleVacancy {

  id: number;

  jobRole: JobRole;

  vacancyCount: number | null;

  selectedCount: number | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;

}


/* =========================================================
   ROLE SKILLS
========================================================= */

export interface RoleSkills {

  id: number;

  jobRole: JobRole;

  technicalSkills: string | null;

  programmingLanguages: string | null;

  frameworks: string | null;

  tools: string | null;

  databases: string | null;

  softSkills: string | null;

  otherRequirements: string | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;

}


/* =========================================================
   ROLE APPLICATION REQUIREMENTS
========================================================= */

export interface RoleApplicationRequirement {

  id: number;

  jobRole: JobRole;

  resumeRequired: boolean | null;

  coverLetterRequired: boolean | null;

  portfolioRequired: boolean | null;

  certificatesRequired: boolean | null;

  transcriptRequired: boolean | null;

  photoRequired: boolean | null;

  otherDocuments: string | null;

  applicationInstructions: string | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;

}


/* =========================================================
   ROLE BOND
========================================================= */

export interface RoleBond {

  id: number;

  jobRole: JobRole;

  bondRequired: boolean | null;

  bondDurationMonths: number | null;

  bondAmount: number | null;

  bondStartCondition: string | null;

  bondTerminationCondition: string | null;

  bondDocumentRequired: boolean | null;

  bondDetails: string | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;

}


/* =========================================================
   DATA SOURCE
========================================================= */

export interface DataSource {

  id: number;

  hiringEvent: CampusHiringEvent;

  sourceName: string;

  sourceType: string | null;

  sourceUrl: string | null;

  sourceDescription: string | null;

  sourceDate: string | null;

  official: boolean | null;

  verified: boolean | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;

}