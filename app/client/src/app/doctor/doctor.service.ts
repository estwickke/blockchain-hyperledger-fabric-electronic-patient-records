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
    //console.log(transferImageData.imageID);
    console.log(transferImageData.imageName);
    console.log(transferImageData.ownerHosp);
    console.log(transferImageData.transferredBy);
    console.log(transferImageData.file);

    
    return this.http.post(this.doctorURL + '/transfer', transferImageData);
  }
  
  public fetchAllTransferredImagesHosp1(): Observable<any> {
    
    return this.http.get(this.doctorURL + '/allTransferredImagesHosp1');
  }

  public fetchAllTransferredImagesHosp2(): Observable<any> {
    
    return this.http.get(this.doctorURL + '/allTransferredImagesHosp2');
  }

  public fetchAllTransferredImagesHosp3(): Observable<any> {
    
    return this.http.get(this.doctorURL + '/allTransferredImagesHosp3');
  }

  public getRecentTransactionID(): Observable<any> {
    
    return this.http.get(this.doctorURL + '/transactionID');
  }

  

  
}