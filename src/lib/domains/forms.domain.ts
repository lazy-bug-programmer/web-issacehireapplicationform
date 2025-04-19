export interface Form {
  $id?: string;
  name: string;
  email: string;
  ref_code_id: string;
  submitted_at: Date;
  status: FormStatus;
}

export enum FormStatus {
  SUBMITTED = 0,
  APPROVED = 1,
  REJECTED = 2,
}
