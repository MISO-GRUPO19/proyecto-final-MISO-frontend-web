import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoalsService {
  constructor(private http: HttpClient) {}

  createGoal(data: any) {
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
    };
    return this.http.post(`${environment.apiUrl}/orders/goals`, data, { headers });
  }

  getSellers() {
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
    };
    return this.http.get<any[]>(`${environment.apiUrl}/users/sellers`, { headers });
  }

  getProducts() {
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
    };
    return this.http.get<any[]>(`${environment.apiUrl}/products`, { headers });
  }
}
