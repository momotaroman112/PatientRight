import { EmployeeInterface } from './IEmployee';
import { RightTypeInterface } from './IRighttype';
import { HospitalInterface } from './IHospital';
import { PatientInterface } from './IPatient';
export interface PatientRightInterface{
    ID: number,
    Name: string,

    PatientID?: number,
    Patient: PatientInterface,

    RightTypeID?: number,
    RightType: RightTypeInterface,

    HospitalID?: number,
    Hospital: HospitalInterface,
    
    EmployeeID?: number,
    Employee: EmployeeInterface,
    
    Discount: number,

    Note: string,
}