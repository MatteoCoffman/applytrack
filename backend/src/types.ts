export type ApplicationStatus =
  | "saved"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "saved",
  "applied",
  "interview",
  "offer",
  "rejected",
];

export type Application = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedAt?: string;
  jobUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateApplicationInput = {
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedAt?: string;
  jobUrl?: string;
  notes?: string;
};

export type UpdateApplicationInput = Partial<CreateApplicationInput>;

export type DynamoApplicationItem = Application & {
  PK: string;
  SK: string;
};
