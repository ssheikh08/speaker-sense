import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'https://cl4pbcurccdqrcr4sn4s5dxmmq0vzbvh.lambda-url.us-east-2.on.aws';

  constructor(private http: HttpClient) { }

  getSignedUrl(filename: string): Observable<any> {
    const url = `${this.apiUrl}/upload?filename=${filename}`;
    return this.http.post(url, {});
  }

  uploadFileToS3(signedUrl: string, file: File, contentType: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': contentType
    });
  
    return this.http.put(signedUrl, file, { headers });
  }
  processVideo(filename: string): Observable<any> {
    const url = `${this.apiUrl}/process?filename=${filename}`;
    return this.http.post(url, {});
  }
  
  downloadTranscriptFile(transcriptKey: string): Observable<any> {
    const url = `${this.apiUrl}/download-transcript?transcriptKey=${transcriptKey}`;
    return this.http.get(url, { responseType: 'text' });
  }
  
}
