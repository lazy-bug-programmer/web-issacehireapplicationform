export interface Form {
  $id?: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  requirement: boolean; // have local bank
  ref_code_id: string;
  submitted_at: Date;
  status: FormStatus;
}

export enum FormStatus {
  SUBMITTED = 0,
  APPROVED = 1,
  REJECTED = 2,
}
