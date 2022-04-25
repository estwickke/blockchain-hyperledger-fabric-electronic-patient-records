import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) { }

  uploadOne(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    
      const req = new HttpRequest('POST', `${this.baseUrl}/uploadHosp1`, formData, {
        reportProgress: true,
        responseType: 'json'
      });
  
      return this.http.request(req);
    
  }

  uploadTwo(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    
      const req = new HttpRequest('POST', `${this.baseUrl}/uploadHosp2`, formData, {
        reportProgress: true,
        responseType: 'json'
      });
  
      return this.http.request(req);
    
  }

  uploadThree(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    
      const req = new HttpRequest('POST', `${this.baseUrl}/uploadHosp3`, formData, {
        reportProgress: true,
        responseType: 'json'
      });
  
      return this.http.request(req);
    
  }

  transferLedger(transferLedgerData: any): Observable<any> {
    const formData: FormData = new FormData();
    console.log(transferLedgerData.imageName);
    console.log(transferLedgerData.ownerHosp);
    console.log(transferLedgerData.currentDate);
    
    
    return this.http.post(this.baseUrl + '/doctors/transferLedger', transferLedgerData);
      
  }

  transfer(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    const hospitalId = 'hosp2'; //placeholder ??????????????
    
    formData.append('file', file);
    formData.append('imageName', file.name);
    formData.append('hospitalId', hospitalId);

    
    console.log(file);
    console.log(file.name);
    console.log(hospitalId);
    
    const req = new HttpRequest('POST', `${this.baseUrl}/doctors/transfer`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFilesOne(): Observable<any> {
    return this.http.get(`${this.baseUrl}/filesHosp1`);

  }

  getFilesTwo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/filesHosp2`);

}

  getFilesThree(): Observable<any> {
    return this.http.get(`${this.baseUrl}/filesHosp3`);

}

getTransferLedger(): Observable<any> {
  return this.http.get(`${this.baseUrl}/doctors/getTransferLedger`);
}

postTransferLedger(imageName: any): Observable<any> {
  console.log(imageName.imageName + '106060606');
  return this.http.post(`${this.baseUrl}/doctors/postTransferLedger`, imageName);

}

}