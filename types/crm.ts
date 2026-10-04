export type ClientType = 'company' | 'individual' | 'government' | 'charity' | 'agency';

export interface ReferenceItem {
  id: string;
  name: string;
  color?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  website?: string;
  notes?: string;

  city_id?: string;
  industry_id?: string;

  city?: ReferenceItem;
  industry?: ReferenceItem;

  client_type: ClientType;
  organization_id?: string; 
  created_at?: string;
  updated_at?: string;
}

export type CreateClientInput = Omit<Client, 'id' | 'created_at' | 'updated_at'>;