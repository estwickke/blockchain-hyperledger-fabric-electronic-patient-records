import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) { }

  upload(file: File, transferredBy: string | Blob): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    console.log(transferredBy + '19191991');
    if(transferredBy == 'hosp1'){
      const req = new HttpRequest('POST', `${this.baseUrl}/uploadHosp1`, formData, {
        reportProgress: true,
        responseType: 'json'
      });
  
      return this.http.request(req);
    }
    else if(transferredBy == 'hosp2'){
      const req = new HttpRequest('POST', `${this.baseUrl}/uploadHosp2`, formData, {
        reportProgress: true,
        responseType: 'json'
      });
  
      return this.http.request(req);
    }
    else if(transferredBy == 'hosp3'){
      const req = new HttpRequest('POST', `${this.baseUrl}/uploadHosp3`, formData, {
        reportProgress: true,
        responseType: 'json'
      });
  
      return this.http.request(req);
    }
  }

  transfer(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    const hospitalId = 'hosp2';
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

  getFiles(transferredBy: string | Blob): Observable<any> {
    if(transferredBy == 'hosp1'){
  
      return this.http.get(`${this.baseUrl}/filesHosp1`);

    }
    else if(transferredBy == 'hosp2'){
      
  
      return this.http.get(`${this.baseUrl}/filesHosp2`);

    }
    else if(transferredBy == 'hosp3'){
      
  
      return this.http.get(`${this.baseUrl}/filesHosp3`);
    }
  }
}