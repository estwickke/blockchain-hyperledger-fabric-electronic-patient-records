export interface DoctorRecord {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

export class DoctorViewRecord {
  doctorId = '';
  firstName = '';
  lastName = '';
  speciality = '';
  role = '';

  constructor(readonly doctorRecord: DoctorRecord) {
    this.doctorId = doctorRecord.id;
    this.firstName = doctorRecord.firstName;
    this.lastName = doctorRecord.lastName;
    this.role = doctorRecord.role;
  }

  
}

export interface ImageRecord{
  imageName: string;
  file: string;
  transferredBy: string;
  ownerHosp: string;
}

export interface transactionRecord{
  date: string;
  transactionID: string;
}


export class ImageViewRecord{
  imageName= '';
  file= '';
  transferredBy= '';
  ownerHosp= '';

  constructor( imageRecord:  ImageRecord) {
    this.imageName= imageRecord.imageName;
    this.file= imageRecord.file;
    this.transferredBy= imageRecord.transferredBy;
    this.ownerHosp= imageRecord.ownerHosp;
  }
}

export interface LedgerRecord{
  date: string;
  ownerHosp: string;
  action: string;
}

export class LedgerViewRecord{
  date= '';
  ownerHosp= '';
  action= '';

  constructor( LedgerRecord:  LedgerRecord) {
    this.date= LedgerRecord.date;
    this.ownerHosp= LedgerRecord.ownerHosp;
    this.action= LedgerRecord.action;
  }
}

export class DisplayVal {
  keyName: string | number | boolean;
  displayName: string;

  constructor(key: string | number | boolean, value: string) {
    this.keyName = key;
    this.displayName = value;
  }
}