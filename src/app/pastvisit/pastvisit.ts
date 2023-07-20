export interface IChildVisit {
  id: string;
  childName: string;
  fatherName: string;
  motherName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  whatsappNumber: number;
  selectedSchool: string;
  earWax: string;
  vision: string;
  palmarPallor: string;
  hygiene: string;
  carries: string;
  scaling: string;
  gaps: string;
  chickenpox: string;
  hepatitisA: string;
  mmr: string;
  meningitis: string;
  typhoid: string;
  epiStatus: string;
  visits: IVisit[];
  lastFiveVisits: IVisit[];
}

export interface IVisit {
  date: string;
  weight: string;
  height: string;
  bmi: string;
  growthVelocity: string;
  muac: string;
}
