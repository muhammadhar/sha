import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string) {
    //@ts-ignore
    return JSON.parse(localStorage.getItem(key));
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

}
