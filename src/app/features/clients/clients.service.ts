import { Injectable, signal, computed } from '@angular/core';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Client, CreateClientRequest, UpdateClientRequest } from './client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  // Signals for reactive state management
  private clientsSignal = signal<Client[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  clients = computed(() => this.clientsSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());

  // BehaviorSubjects for filtering and searching
  private searchTermSubject = new BehaviorSubject<string>('');
  private activeFilterSubject = new BehaviorSubject<boolean | null>(null);

  // Signals for search and filter
  searchTermSignal = signal<string>('');
  activeFilterSignal = signal<boolean | null>(null);

  // Computed filtered clients
  filteredClients = computed(() => {
    const clients = this.clientsSignal();
    const searchTerm = this.searchTermSignal().toLowerCase();
    const activeFilter = this.activeFilterSignal();

    return clients.filter(client => {
      const matchesSearch = !searchTerm || 
        client.firstName.toLowerCase().includes(searchTerm) ||
        client.lastName.toLowerCase().includes(searchTerm);
      
      const matchesFilter = activeFilter === null || client.isActive === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  });

  constructor(private apiService: ApiService) {}

  // Load all clients
  loadClients(): Observable<Client[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.apiService.getClients().pipe(
      tap({
        next: (clients: Client[]) => {
          this.clientsSignal.set(clients);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set('Failed to load clients');
          this.loadingSignal.set(false);
          console.error('Error loading clients:', error);
        }
      })
    );
  }

  // Create new client
  createClient(clientData: CreateClientRequest): Observable<Client> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.apiService.createClient(clientData).pipe(
      tap({
        next: (newClient: Client) => {
          this.clientsSignal.update(clients => [...clients, newClient]);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set('Failed to create client');
          this.loadingSignal.set(false);
          console.error('Error creating client:', error);
        }
      })
    );
  }

  // Update existing client
  updateClient(id: string, clientData: UpdateClientRequest): Observable<Client> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.apiService.updateClient(id, clientData).pipe(
      tap({
        next: (updatedClient: Client) => {
          this.clientsSignal.update(clients => 
            clients.map(client => client.id === id ? updatedClient : client)
          );
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set('Failed to update client');
          this.loadingSignal.set(false);
          console.error('Error updating client:', error);
        }
      })
    );
  }

  // Delete client
  deleteClient(id: string): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.apiService.deleteClient(id).pipe(
      tap({
        next: () => {
          this.clientsSignal.update(clients => clients.filter(client => client.id !== id));
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set('Failed to delete client');
          this.loadingSignal.set(false);
          console.error('Error deleting client:', error);
        }
      })
    );
  }

  // Search functionality
  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
    this.searchTermSubject.next(term);
  }

  // Filter functionality
  setActiveFilter(isActive: boolean | null): void {
    this.activeFilterSignal.set(isActive);
    this.activeFilterSubject.next(isActive);
  }
}
