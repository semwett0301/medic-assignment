import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, CreateClientRequest, UpdateClientRequest } from '../../features/clients/client.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/clients`);
  }

  createClient(clientData: CreateClientRequest): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}/clients`, clientData);
  }

  updateClient(id: string, clientData: UpdateClientRequest): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/clients/${id}`, clientData);
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clients/${id}`);
  }
}
