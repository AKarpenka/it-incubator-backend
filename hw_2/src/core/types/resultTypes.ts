import { Statuses } from "./resultStasuses";

type ExtensionType = {
  field: string | null;
  message: string;
};

export type Result<T = null> = {
  status: Statuses;
  errorMessage?: string;
  extensions: ExtensionType[];
  data: T;
};
