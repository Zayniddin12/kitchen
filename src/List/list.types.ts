export interface ListItemType {
  id: number;
  name: string;
}

export type ListType = ListItemType[];

export interface ListParamsType {
  id: number;
  parent_url: string;
  url: string;
}