export type AppMediaUploaderValueType = string | ArrayBuffer | File;

export interface AppMediaUploaderPropsType {
  value?: AppMediaUploaderValueType;
  placeholder?: string;
  height?: string | number;
  loading?: boolean;
}
