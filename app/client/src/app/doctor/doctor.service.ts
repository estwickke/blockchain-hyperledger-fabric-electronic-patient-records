import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
//import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';


import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private doctorURL = 'http://localhost:3001/doctors';

  constructor(private http: HttpClient) { }

  public createDoctor(data: any): Observable<any> {
    return this.http.post(this.doctorURL + '/register', data);
  }

  public getDoctorsByHospitalId(hospitalId: number): Observable<any> {
    return this.http.get(this.doctorURL + `/${hospitalId}/_all`);
  }

  public getDoctorByHospitalId(hospitalId: string, docId: any): Observable<any> {
    return this.http.get(this.doctorURL + `/${hospitalId}/${docId}`);
  }

  public transfer(transferImageData: any): Observable<any> {
    console.log(transferImageData);
    console.log(transferImageData.imageName);
    console.log(transferImageData.ownerHosp);
    console.log(transferImageData.transferredBy);
    console.log(transferImageData.file);

    
    return this.http.post(this.doctorURL + '/transfer', transferImageData);
  }
  
  public fetchAllTransferredImages(): Observable<any> {
    return this.http.get(this.doctorURL + '/allTransferredImages');
  }

  

  
}