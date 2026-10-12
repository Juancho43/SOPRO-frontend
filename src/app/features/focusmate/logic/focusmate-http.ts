import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { AuthHelper } from '../../login/logic/auth-helper';
import { FocusmateSession } from './focumateSession';

@Injectable({
  providedIn: 'root',
})
export class FocusmateHTTP {
  private http = inject(HttpClient);

  private helper = inject(AuthHelper);
  private token = computed(()=>this.helper.getToken())
  futureSessions() {
   const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token()!}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<FocusmateSession[]>(`${environment.apiUrl}/focusmate/sessions/future`,{headers});
  }
  
}
