import { PatientTypeInterface } from "./IPatienttype";
import { GenderInterface } from "./IGender";
import { PatientRightInterface } from "./IPatientRight";
export interface PatientInterface {
  ID: number;
  HN: string;
  Pid: string;
  FirstName: string;
  LastName: string;
  Birthdate: Date;
  Age: number;
  DateAdmit: Date;
  Symptom: string;
  GenderID: number;
  Gender: GenderInterface;
  PatientTypeID: number;
  PatientType: PatientTypeInterface;
  PatientRightID: number;
  PatientRight: PatientRightInterface;
}
