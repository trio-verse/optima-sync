export type FilterOperator =
  | "in"
  | "not_in"
  | "="
  | "!="
  | ">"
  | ">="
  | "<"
  | "<="
  | "between";

export type FilterLogic = "and" | "or";

export interface FilterOperatorOption {
  value: FilterOperator;
  label: string;
}

export interface FilterLogicOption {
  value: FilterLogic;
  label: string;
}

export interface IFilter {
  field: string;
  operator: FilterOperator;
  value: unknown;
}