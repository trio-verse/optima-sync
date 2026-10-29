import { Connection } from "./Connection";

export interface WinRate{
    percent:number;
    total:number;
    winCount:number;
    wonRevenue:number;
}
export interface StatItem{
    label:string;
    count:number;
}
export interface StatProduct{
    label:string;
    count:number;
    connectionsCount:number;
    price:number;
}
export interface SalesStats{
    client_count:number;
    connections_count:number;
    product_count:number;
    cities_count:number;
    industry_count:number;
    top_products:StatProduct[];
    win_rate:WinRate;
    connections_by_stage:StatItem[];
    clients_by_city:StatItem[];
    clients_by_industry:StatItem[];
    recentConnections:Connection[];
}