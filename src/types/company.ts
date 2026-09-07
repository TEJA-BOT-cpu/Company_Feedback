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