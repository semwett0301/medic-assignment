import { TestBed } from '@angular/core/testing';
import { ClientsService } from './clients.service';
import { ApiService } from '../../core/services/api.service';
import { Client, CreateClientRequest, UpdateClientRequest } from './client.model';
import { of, throwError } from 'rxjs';

describe('ClientsService', () => {
  let service: ClientsService;
  let apiServiceMock: jest.Mocked<ApiService>;

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
    apiServiceMock = {
      getClients: jest.fn(),
      createClient: jest.fn(),
      updateClient: jest.fn(),
      deleteClient: jest.fn()
    } as unknown as jest.Mocked<ApiService>;

    TestBed.configureTestingModule({
      providers: [
        ClientsService,
        { provide: ApiService, useValue: apiServiceMock }
      ]
    });
    service = TestBed.inject(ClientsService);
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
      apiServiceMock.getClients.mockReturnValue(of(mockClients));

      service.loadClients().subscribe();

      expect(apiServiceMock.getClients).toHaveBeenCalled();
      expect(service.clients()).toEqual(mockClients);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBe(null);
    });

    it('should handle load clients error', () => {
      apiServiceMock.getClients.mockReturnValue(throwError(() => new Error('Server Error')));

      service.loadClients().subscribe({
        error: () => {}
      });

      expect(apiServiceMock.getClients).toHaveBeenCalled();
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

      apiServiceMock.createClient.mockReturnValue(of(createdClient));

      service.createClient(newClient).subscribe();

      expect(apiServiceMock.createClient).toHaveBeenCalledWith(newClient);
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

      apiServiceMock.createClient.mockReturnValue(throwError(() => new Error('Bad Request')));

      service.createClient(newClient).subscribe({
        error: () => {}
      });

      expect(apiServiceMock.createClient).toHaveBeenCalledWith(newClient);
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

      apiServiceMock.updateClient.mockReturnValue(of(updatedClient));

      service.updateClient('1', updateData).subscribe();

      expect(apiServiceMock.updateClient).toHaveBeenCalledWith('1', updateData);
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

      apiServiceMock.updateClient.mockReturnValue(throwError(() => new Error('Not Found')));

      service.updateClient('1', updateData).subscribe({
        error: () => {}
      });

      expect(apiServiceMock.updateClient).toHaveBeenCalledWith('1', updateData);
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
      apiServiceMock.deleteClient.mockReturnValue(of(void 0));

      service.deleteClient('1').subscribe();

      expect(apiServiceMock.deleteClient).toHaveBeenCalledWith('1');
      const remainingClients = service.clients();
      expect(remainingClients).not.toContain(mockClients[0]);
      expect(remainingClients).toHaveLength(2);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBe(null);
    });

    it('should handle delete client error', () => {
      apiServiceMock.deleteClient.mockReturnValue(throwError(() => new Error('Not Found')));

      service.deleteClient('1').subscribe({
        error: () => {}
      });

      expect(apiServiceMock.deleteClient).toHaveBeenCalledWith('1');
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
