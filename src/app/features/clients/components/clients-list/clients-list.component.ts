import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/ui';
import { CardComponent } from '../../../../shared/ui';
import { ClientCardComponent } from '../client-card/client-card.component';
import { Client } from '../../client.model';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    ClientCardComponent
  ],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss'
})
export class ClientsListComponent {
  @Input() clients: Client[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() editingClientId: string | null = null;
  @Input() editForm!: FormGroup;
  @Input() getEditFieldError!: (fieldName: string) => string;
  @Input() trackByClientId!: (index: number, client: Client) => string;
  @Input() formatDate!: (dateString: string) => string;
  @Input() calculateAge!: (birthdate: string) => number;

  @Output() startEdit = new EventEmitter<Client>();
  @Output() saveEdit = new EventEmitter<string>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() deleteClient = new EventEmitter<string>();
  @Output() retry = new EventEmitter<void>();

  onStartEdit(client: Client): void {
    this.startEdit.emit(client);
  }

  onSaveEdit(clientId: string): void {
    this.saveEdit.emit(clientId);
  }

  onCancelEdit(): void {
    this.cancelEdit.emit();
  }

  onDeleteClient(clientId: string): void {
    this.deleteClient.emit(clientId);
  }

  onRetry(): void {
    this.retry.emit();
  }
}
