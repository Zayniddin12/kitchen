export type AppMediaUploaderValueType = string | ArrayBuffer;

export interface AppMediaUploaderPropsType {
  value?: AppMediaUploaderValueType;
  placeholder?: string;
  height?: string | number;
  loading?: boolean;
}