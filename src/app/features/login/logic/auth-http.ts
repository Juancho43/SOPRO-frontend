import { Injectable,inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AuthHTTP {
  private http = inject(HttpClient)
  

  loginWithGoogle(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${environment.apiUrl}/login/google`, {}, { headers });
  }
}
