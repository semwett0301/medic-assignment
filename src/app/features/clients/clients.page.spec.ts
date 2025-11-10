import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {ClientsPageComponent} from './clients.page';
import {ClientsService} from './clients.service';
import {Client, CreateClientRequest, UpdateClientRequest} from './client.model';

describe('ClientsPageComponent', () => {
    let component: ClientsPageComponent;
    let fixture: ComponentFixture<ClientsPageComponent>;
    let clientsService: jest.Mocked<ClientsService>;

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
        }
    ];

    beforeEach(async () => {
        const clientsServiceSpy = {
            loadClients: jest.fn(),
            createClient: jest.fn(),
            updateClient: jest.fn(),
            deleteClient: jest.fn(),
            setSearchTerm: jest.fn(),
            setActiveFilter: jest.fn(),
            clients: of(mockClients),
            loading: of(false),
            error: of(null),
            filteredClients: of(mockClients),
            searchTermSignal: of(''),
            activeFilterSignal: of(null)
        };

        await TestBed.configureTestingModule({
            imports: [ClientsPageComponent, ReactiveFormsModule],
            providers: [
                FormBuilder,
                {provide: ClientsService, useValue: clientsServiceSpy}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ClientsPageComponent);
        component = fixture.componentInstance;
        clientsService = TestBed.inject(ClientsService) as any;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize forms with correct validators', () => {
        expect(component.createForm.get('firstName')?.hasError('required')).toBe(true);
        expect(component.createForm.get('lastName')?.hasError('required')).toBe(true);
        expect(component.createForm.get('birthdate')?.hasError('required')).toBe(true);
        expect(component.createForm.get('isActive')?.value).toBe(true);
    });

    it('should call loadClients on init', () => {
        (clientsService.loadClients as jest.Mock).mockReturnValue(of(mockClients));

        component.ngOnInit();

        expect(clientsService.loadClients).toHaveBeenCalled();
    });

    describe('createClient', () => {
        it('should create client when form is valid', () => {
            const clientData: CreateClientRequest = {
                firstName: 'Alice',
                lastName: 'Brown',
                birthdate: '1988-03-20',
                isActive: true
            };

            component.createForm.patchValue(clientData);
            (clientsService.createClient as jest.Mock).mockReturnValue(of({id: '3', ...clientData}));

            component.createClient();

            expect(clientsService.createClient).toHaveBeenCalledWith(clientData);
        });

        it('should not create client when form is invalid', () => {
            component.createForm.patchValue({firstName: '', lastName: 'Brown'});
            component.createForm.markAllAsTouched();

            component.createClient();

            expect(clientsService.createClient).not.toHaveBeenCalled();
        });

        it('should reset form after successful creation', () => {
            const clientData: CreateClientRequest = {
                firstName: 'Alice',
                lastName: 'Brown',
                birthdate: '1988-03-20',
                isActive: true
            };

            component.createForm.patchValue(clientData);
            (clientsService.createClient as jest.Mock).mockReturnValue(of({id: '3', ...clientData}));

            component.createClient();

            expect(component.createForm.get('firstName')?.value).toBe(null);
            expect(component.createForm.get('lastName')?.value).toBe(null);
        });
    });

    describe('startEdit', () => {
        it('should set editing client id and patch edit form', () => {
            const client = mockClients[0];

            component.startEdit(client);

            expect(component.editingClientId()).toBe(client.id);
            expect(component.editForm.get('firstName')?.value).toBe(client.firstName);
            expect(component.editForm.get('lastName')?.value).toBe(client.lastName);
            expect(component.editForm.get('isActive')?.value).toBe(client.isActive);
        });
    });

    describe('saveEdit', () => {
        it('should update client when form is valid', () => {
            const clientId = '1';
            const updateData: UpdateClientRequest = {
                firstName: 'John Updated',
                lastName: 'Doe',
                birthdate: '1990-01-01',
                isActive: false
            };

            component.editForm.patchValue(updateData);
            (clientsService.updateClient as jest.Mock).mockReturnValue(of({id: clientId, ...updateData}));

            component.saveEdit(clientId);

            expect(clientsService.updateClient).toHaveBeenCalledWith(clientId, updateData);
        });

        it('should not update client when form is invalid', () => {
            component.editForm.patchValue({firstName: '', lastName: 'Doe'});
            component.editForm.markAllAsTouched();

            component.saveEdit('1');

            expect(clientsService.updateClient).not.toHaveBeenCalled();
        });
    });

    describe('cancelEdit', () => {
        it('should reset editing state', () => {
            component.startEdit(mockClients[0]);
            component.cancelEdit();

            expect(component.editingClientId()).toBeNull();
            expect(component.editForm.get('firstName')?.value).toBe(null);
        });
    });

    describe('deleteClient', () => {
        it('should delete client when confirmed', () => {
            jest.spyOn(window, 'confirm').mockReturnValue(true);
            (clientsService.deleteClient as jest.Mock).mockReturnValue(of(undefined));

            component.deleteClient('1');

            expect(clientsService.deleteClient).toHaveBeenCalledWith('1');
        });

        it('should not delete client when not confirmed', () => {
            jest.spyOn(window, 'confirm').mockReturnValue(false);

            component.deleteClient('1');

            expect(clientsService.deleteClient).not.toHaveBeenCalled();
        });
    });

    describe('toggleCreateForm', () => {
        it('should show form when hidden', () => {
            expect(component.showCreateForm()).toBe(false);

            component.toggleCreateForm();

            expect(component.showCreateForm()).toBe(true);
        });

        it('should hide form when shown', () => {
            component.toggleCreateForm();
            expect(component.showCreateForm()).toBe(true);

            component.toggleCreateForm();

            expect(component.showCreateForm()).toBe(false);
        });
    });

    describe('search and filter', () => {
        it('should set search term', () => {
            component.setSearchTerm('test');

            expect(clientsService.setSearchTerm).toHaveBeenCalledWith('test');
        });

        it('should set active filter', () => {
            component.setActiveFilter(true);

            expect(clientsService.setActiveFilter).toHaveBeenCalledWith(true);
        });
    });

    describe('utility methods', () => {
        it('should track by client id', () => {
            const result = component.trackByClientId(0, mockClients[0]);
            expect(result).toBe(mockClients[0].id);
        });

        it('should format date correctly', () => {
            const result = component.formatDate('1990-01-01');
            expect(result).toBe('1/1/1990');
        });

        it('should calculate age correctly', () => {
            const result = component.calculateAge('1990-01-01');
            expect(result).toBeGreaterThan(30);
        });
    });

    describe('form validation', () => {
        it('should return field error for required field', () => {
            component.createForm.get('firstName')?.markAsTouched();

            const error = component.getFieldError('firstName');

            expect(error).toBe('First Name is required');
        });

        it('should return field error for minlength', () => {
            component.createForm.patchValue({firstName: 'A'});
            component.createForm.get('firstName')?.markAsTouched();

            const error = component.getFieldError('firstName');

            expect(error).toBe('First Name must be at least 2 characters');
        });

        it('should return empty string for valid field', () => {
            component.createForm.patchValue({firstName: 'John'});

            const error = component.getFieldError('firstName');

            expect(error).toBe('');
        });
    });
});
