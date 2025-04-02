import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ManufacturerService {
  private apiUrl = `${environment.apiUrl}/manufacturers`;

  constructor(private http: HttpClient) {}

  getManufacturers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}