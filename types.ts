
export interface PassportData {
  passportNumber: string;
  surname: string;
  givenNames: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  nationality: string;
  dateOfBirth: string;
  sex: string;
  placeOfBirth: string;
  permanentAddress: string;
  dateOfIssue: string;
  dateOfExpiry: string;
  issuingAuthority: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactAddress: string;
  emergencyContactPhone: string;
}

export interface SavedPassport extends PassportData {
  id: string;
  timestamp: number;
}
