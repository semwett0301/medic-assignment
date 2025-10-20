import {Component, computed, OnInit, signal, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClientsService} from './clients.service';
import {Client, CreateClientRequest, UpdateClientRequest} from './client.model';
import {ClientsFiltersComponent} from './components/clients-filters/clients-filters.component';
import {ClientsListComponent} from './components/clients-list/clients-list.component';
import {ClientFormComponent} from './components/client-form/client-form.component';
import {minimumAgeValidator, pastDateValidator} from '../../shared/validators';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    ClientsFiltersComponent,
    ClientsListComponent,
    ClientFormComponent
  ],
  templateUrl: './clients.page.html',
  styleUrl: './clients.page.scss'
})
export class ClientsPageComponent implements OnInit {
  // Signals for reactive state management
  private showCreateFormSignal = signal(false);
  private editingClientIdSignal = signal<string | null>(null);

  // Computed signals
  showCreateForm = computed(() => this.showCreateFormSignal());
  editingClientId = computed(() => this.editingClientIdSignal());

  // Service signals - will be initialized in constructor
  clients!: Signal<Client[]>;
  loading!: Signal<boolean>;
  error!: Signal<string | null>;
  filteredClients!: Signal<Client[]>;
  searchTerm!: Signal<string>;
  activeFilter!: Signal<boolean | null>;

  // Forms
  createForm: FormGroup;
  editForm: FormGroup;

  constructor(
    public clientsService: ClientsService,
    private fb: FormBuilder
  ) {
    // Initialize service signals
    this.clients = this.clientsService.clients;
    this.loading = this.clientsService.loading;
    this.error = this.clientsService.error;
    this.filteredClients = this.clientsService.filteredClients;
    this.searchTerm = this.clientsService.searchTermSignal;
    this.activeFilter = this.clientsService.activeFilterSignal;

    // Initialize create form with validation
    this.createForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthdate: ['', [Validators.required, pastDateValidator(), minimumAgeValidator(0)]],
      isActive: [true]
    });

    // Initialize edit form
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthdate: ['', [Validators.required, pastDateValidator(), minimumAgeValidator(0)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  // Client management methods
  loadClients(): void {
    this.clientsService.loadClients().subscribe();
  }

  createClient(): void {
    if (this.createForm.valid) {
      const clientData: CreateClientRequest = {
        firstName: this.createForm.value.firstName.trim(),
        lastName: this.createForm.value.lastName.trim(),
        birthdate: this.createForm.value.birthdate,
        isActive: this.createForm.value.isActive
      };

      this.clientsService.createClient(clientData).subscribe({
        next: () => {
          this.resetCreateForm();
          this.toggleCreateForm();
        },
        error: (error: any) => {
          console.error('Error creating client:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.createForm);
    }
  }

  startEdit(client: Client): void {
    this.editingClientIdSignal.set(client.id);
    this.editForm.patchValue({
      firstName: client.firstName,
      lastName: client.lastName,
      birthdate: client.birthdate.split('T')[0], // Convert to date input format
      isActive: client.isActive
    });
  }

  saveEdit(clientId: string): void {
    if (this.editForm.valid) {
      const clientData: UpdateClientRequest = {
        firstName: this.editForm.value.firstName.trim(),
        lastName: this.editForm.value.lastName.trim(),
        birthdate: this.editForm.value.birthdate,
        isActive: this.editForm.value.isActive
      };

      this.clientsService.updateClient(clientId, clientData).subscribe({
        next: () => {
          this.cancelEdit();
        },
        error: (error: any) => {
          console.error('Error updating client:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.editForm);
    }
  }

  cancelEdit(): void {
    this.editingClientIdSignal.set(null);
    this.editForm.reset();
  }

  deleteClient(clientId: string): void {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      this.clientsService.deleteClient(clientId).subscribe({
        error: (error: any) => {
          console.error('Error deleting client:', error);
        }
      });
    }
  }

  // Form management methods
  toggleCreateForm(): void {
    this.showCreateFormSignal.set(!this.showCreateFormSignal());
    if (!this.showCreateFormSignal()) {
      this.resetCreateForm();
    }
  }

  resetCreateForm(): void {
    this.createForm.reset({ isActive: true });
  }

  // Search and filter methods
  setSearchTerm(term: string): void {
    this.clientsService.setSearchTerm(term);
  }

  setActiveFilter(isActive: boolean | null): void {
    this.clientsService.setActiveFilter(isActive);
  }

  // Utility methods
  trackByClientId(index: number, client: Client): string {
    return client.id;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  calculateAge(birthdate: string): number {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  // Form validation methods
  getFieldError(fieldName: string): string {
    const field = this.createForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} must be at least 2 characters`;
      if (field.errors['pastDate']) return field.errors['pastDate'].message;
      if (field.errors['minimumAge']) return field.errors['minimumAge'].message;
    }
    return '';
  }

  getEditFieldError(fieldName: string): string {
    const field = this.editForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} must be at least 2 characters`;
      if (field.errors['pastDate']) return field.errors['pastDate'].message;
      if (field.errors['minimumAge']) return field.errors['minimumAge'].message;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      birthdate: 'Birth Date'
    };
    return labels[fieldName] || fieldName;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
