export type ClientType = 'company' | 'individual' | 'government' | 'charity' | 'agency';

export interface Client {
  id: number;
  name: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  address?: string;
  website?: string;
  notes?: string;
  city_id?: number;
  industry_id?: number;
  client_type: ClientType;
  organization_id?: string; 
}

export type CreateClientInput = Omit<Client, 'id'>;

export interface ClientFilters {
  city_id?:  number;
  industry_id?:  number;
  client_type?: ClientType;
  name ?: string;
  contact_info ?: string;
  page?: string | number;
  perPage?: string | number;
}