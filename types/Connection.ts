import { Client } from "./crm";
import { Campaign } from "./marketing";
import { OrgMember, User } from "./organization";
import { Channel, Product } from "./reference";

export type Stage = "lead" | "contacted" | "missing_info" | "interested"| "not_interested" | "win" | "closed" ;


export type ConnectionStageFilter = Stage | "all";

export interface Connection {
  id: number;
  client : Client;
  product :Product;
  stage : Stage;
  channel? : Channel;
  assignee? : User;
  initiated_by?: string;
  campaign_id? : number;
  campaign_name?:string;
  deal_value?: number | null;
  created_at?: string;
  updated_at?:string;
}

export interface ConnectionRequest {
  client_id: number;
  product_id: number;
  stage: Stage;
  channel_id?: string;
  assignee_id?: string;
  initiated_by?: string;
  campaign_id?: string;
};

export type Order = "created_at" |"name"|"email"|"phone";

export interface ConnectionFilters {
  clientName?: string;
  stage?: ConnectionStageFilter;
  product_id?: string | number;
  page?: number;
  per_page?: number;
  order?: Order;
  sort?: "asc" | "desc";
}

export interface Activity{
  connection_id: number;
  content :string;
  id:number;
  created_at?: string;
  user :User;
}

export type ActivityRequest = Omit<Activity, 'id'>;