export interface BaseReferenceItem {
  id: number;
  name: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface City extends BaseReferenceItem {}
export interface Channel extends BaseReferenceItem {}
export interface Industry extends BaseReferenceItem {}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  created_at: string;
  updated_at: string;
}

export type CreateDTO<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'created_at' | 'updated_at'>;

export type CreateCityDTO = CreateDTO<City>;
export type CreateChannelDTO = CreateDTO<Channel>;
export type CreateIndustryDTO = CreateDTO<Industry>;
export type CreateProductDTO = CreateDTO<Product>;