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

  public transactionRecord(): Object {
    class transactionRecord {
      date: any;
      time: any;
      hash: any;

      constructor(date,time,hash) {
        this.date = date;
        this.time = time
        this.hash = hash
      }
    
      record() {
        console.log({date},{time},{hash}) + '6969696969696';
      }
    
    }
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var date = new Date();
    var dateMonth = months[date.getMonth()] + ' ' +date.getDate();
    var time = date.getHours() +":"+date.getMinutes();
    var hash = "asdfeadfadf";
    const transaction = new transactionRecord(dateMonth,time,hash);
    
    transaction.record();
    console.log(transaction + '8188181881881881');
    return transaction;
  }

  

  
}