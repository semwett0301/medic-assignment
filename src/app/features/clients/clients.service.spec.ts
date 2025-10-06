import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientsService } from './clients.service';
import { ApiService } from '../../core/services/api.service';
import { Client, CreateClientRequest, UpdateClientRequest } from './client.model';

describe('ClientsService', () => {
  let service: ClientsService;
  let httpMock: HttpTestingController;

  const mockClients: Client[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      birthdate: '1990-01-01',
      isActive: true
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      birthdate: '1985-05-15',
      isActive: false
    },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      birthdate: '1992-12-10',
      isActive: true
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientsService, ApiService]
    });
    service = TestBed.inject(ClientsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Initial State', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have empty initial state', () => {
      expect(service.clients()).toEqual([]);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBe(null);
      expect(service.filteredClients()).toEqual([]);
      expect(service.searchTermSignal()).toBe('');
      expect(service.activeFilterSignal()).toBe(null);
    });
  });

  describe('loadClients', () => {
    it('should load clients successfully', () => {
      service.loadClients().subscribe();

      const req = httpMock.expectOne('http://localhost:3000/clients');
      expect(req.request.method).toBe('GET');
      req.flush(mockClients);

      expect(service.clients()).toEqual(mockClients);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBe(null);
    });

    it('should handle load clients error', () => {
      service.loadClients().subscribe();

      const req = httpMock.expectOne('http://localhost:3000/clients');
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(service.clients()).toEqual([]);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBe('Failed to load clients');
    });
  });

  describe('createClient', () => {
    it('should create client successfully', () => {
      const newClient: CreateClientRequest = {
        firstName: 'Alice',
        lastName: 'Brown',
        birthdate: '1988-03-20',
        isActive: true
      };

      const createdClient: Client = {
        id: '4',
        ...newClient
      };

      service.createClient(newClient).subscribe();

      const req = httpMock.expectOne('http://localhost:3000/clients');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newClient);
      req.flush(createdClient);

      expect(service.clients()).toContain(createdClient);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBe(null);
    });

    it('should handle create client error', () => {
      const newClient: CreateClientRequest = {
        firstName: 'Alice',
        lastName: 'Brown',
        birthdate: '1988-03-20',
        isActive: true
      };

      service.createClient(newClient).subscribe();

      const req = httpMock.expectOne('http://localhost:3000/clients');
      req.flush('Error', { status: 400, statusText: 'Bad Request' });

      expect(service.clients()).toEqual([]);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBe('Failed to create client');
    });
  });

  describe('updateClient', () => {
    beforeEach(() => {
      service['clientsSignal'].set(mockClients);
    });

    it('should update client successfully', () => {
      const updateData: UpdateClientRequest = {
        firstName: 'John Updated',
        lastName: 'Doe',
        birthdate: '1990-01-01',
        isActive: false
      };

      const updatedClient: Client = {
        id: '1',
        ...updateData
      };

      service.updateClient('1', updateData).subscribe();

      const req = httpMock.expectOne('http://localhost:3000/clients/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedClient);

      const updatedClients = service.clients();
      const updatedClientInList = updatedClients.find(c => c.id === '1');
      expect(updatedClientInList).toEqual(updatedClient);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBe(null);
    });

    it('should handle update client error', () => {
      const updateData: UpdateClientRequest = {
        firstName: 'John Updated',
        lastName: 'Doe',
        birthdate: '1990-01-01',
        isActive: false
      };

      service.updateClient('1', updateData).subscribe();

      const req = httpMock.expectOne('http://localhost:3000/clients/1');
      req.flush('Error', { status: 404, statusText: 'Not Found' });

      expect(service.clients()).toEqual(mockClients);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBe('Failed to update client');
    });
  });

  describe('deleteClient', () => {
    beforeEach(() => {
      service['clientsSignal'].set(mockClients);
    });

    it('should delete client successfully', () => {
      service.deleteClient('1').subscribe();

      const req = httpMock.expectOne('http://localhost:3000/clients/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      const remainingClients = service.clients();
      expect(remainingClients).not.toContain(mockClients[0]);
      expect(remainingClients).toHaveLength(2);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBe(null);
    });

    it('should handle delete client error', () => {
      service.deleteClient('1').subscribe();

      const req = httpMock.expectOne('http://localhost:3000/clients/1');
      req.flush('Error', { status: 404, statusText: 'Not Found' });

      expect(service.clients()).toEqual(mockClients);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBe('Failed to delete client');
    });
  });

  describe('Search and Filter', () => {
    beforeEach(() => {
      service['clientsSignal'].set(mockClients);
    });

    it('should filter clients by search term', () => {
      service.setSearchTerm('John');
      expect(service.filteredClients()).toEqual([mockClients[0], mockClients[2]]);
    });

    it('should filter clients by active status', () => {
      service.setActiveFilter(true);
      expect(service.filteredClients()).toEqual([mockClients[0], mockClients[2]]);
    });

    it('should filter clients by inactive status', () => {
      service.setActiveFilter(false);
      expect(service.filteredClients()).toEqual([mockClients[1]]);
    });

    it('should show all clients when no filter applied', () => {
      service.setActiveFilter(null);
      expect(service.filteredClients()).toEqual(mockClients);
    });

    it('should combine search and filter', () => {
      service.setSearchTerm('John');
      service.setActiveFilter(true);
      expect(service.filteredClients()).toEqual([mockClients[0], mockClients[2]]);
    });

    it('should return empty array when no matches', () => {
      service.setSearchTerm('NonExistent');
      expect(service.filteredClients()).toEqual([]);
    });

    it('should be case insensitive', () => {
      service.setSearchTerm('jane');
      expect(service.filteredClients()).toEqual([mockClients[1]]);
    });
  });
});
