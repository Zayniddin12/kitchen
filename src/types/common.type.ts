export interface TableColumnType {
  prop: string;
  label: string;
  sortable?: boolean;
  width?: number | string;
  align?: "left" | "center" | "right";

  [key: string]: any;
}