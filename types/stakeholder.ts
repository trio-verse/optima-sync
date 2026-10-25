export interface Stakeholder {
  id: number;
  client_id: number;
  name: string;
  phone: string ;
  role : string;
}
 
export type StakeholderRequest = Omit<Stakeholder, 'id'>;
