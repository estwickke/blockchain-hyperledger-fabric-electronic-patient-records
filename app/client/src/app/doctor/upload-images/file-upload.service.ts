import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
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

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}