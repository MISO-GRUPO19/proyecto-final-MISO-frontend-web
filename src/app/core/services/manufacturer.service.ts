import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ManufacturerService {
  private apiUrl = `${environment.apiUrl}/manufacturers`;

  constructor(private http: HttpClient) {}

  getManufacturers(): Observable<any[]> {
    const token = sessionStorage.getItem('access_token'); // o el nombre que uses
  
    const headers = {
      Authorization: `Bearer ${token}`
    };
  
    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}