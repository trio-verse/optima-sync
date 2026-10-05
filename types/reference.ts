//types/reference.ts
export interface BaseReferenceItem {
  id: number;
  name: string;
  color: string;
}

export interface City extends BaseReferenceItem {}
export interface Channel extends BaseReferenceItem {}
export interface Industry extends BaseReferenceItem {}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
}

// Create
export type CreateDTO<T> = Omit<T, "id">;

export type CreateCityDTO = CreateDTO<City>;
export type CreateChannelDTO = CreateDTO<Channel>;
export type CreateIndustryDTO = CreateDTO<Industry>;
export type CreateProductDTO = CreateDTO<Product>;

