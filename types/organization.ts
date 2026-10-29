export type MemberRole = 'admin' | 'member' | 'owner';

export interface IOrganization {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  logo_url?: string;
  created_at: string;
  updated_at?: string;
}
export interface User{
  id: string;
  name: string;
  email: string;
}
export interface OrgMember {
  id: string;
  organization_id?: string;
  user: User;
  role: MemberRole;
}

export interface OrgMemberRequest {
  role: MemberRole;
  email: string;
};

export interface ICreateOrganizationPayload {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  logo?: File;
}

export interface IAddMemberPayload {
  organization_id?: string;
  email: string;
  role: MemberRole;
}