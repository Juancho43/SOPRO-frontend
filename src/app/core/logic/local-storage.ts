import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {
  readonly TOKEN_KEY = 'auth_token';
  readonly USER_KEY = 'user_id'
  saveValue(key: string, value: string): void {
    localStorage.setItem(key,value);
  }

  getValue(key: string): string | null {
    return localStorage.getItem(key);
  }

  deleteValue(key: string): void {
    localStorage.removeItem(key);
  }
}
