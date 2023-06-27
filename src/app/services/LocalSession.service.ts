import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalSessionService {
  constructor() {}

  saveSession(key: string, data: any): void {
    const sessionData = JSON.stringify(data);
    sessionStorage.setItem(key, sessionData);
  }

  getSession(key: string): any {
    const sessionData = sessionStorage.getItem(key);
    return sessionData ? JSON.parse(sessionData) : null;
  }

  clearSession(key: string): void {
    sessionStorage.removeItem(key);
  }
}
