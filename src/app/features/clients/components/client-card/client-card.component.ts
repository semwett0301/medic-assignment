import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { CheckboxComponent } from '../../../../shared/ui/checkbox/checkbox.component';
import { Client } from '../../client.model';

@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    CheckboxComponent
  ],
  templateUrl: './client-card.component.html',
  styleUrl: './client-card.component.scss'
})
export class ClientCardComponent {
  @Input() client!: Client;
  @Input() isEditing: boolean = false;
  @Input() editForm!: FormGroup;
  @Input() loading: boolean = false;
  @Input() getFieldError!: (fieldName: string) => string;
  @Input() formatDate!: (dateString: string) => string;
  @Input() calculateAge!: (birthdate: string) => number;

  @Output() startEdit = new EventEmitter<Client>();
  @Output() saveEdit = new EventEmitter<string>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() deleteClient = new EventEmitter<string>();

  get maxDate(): string {
    // Set max date to yesterday to prevent future dates
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  onStartEdit(): void {
    this.startEdit.emit(this.client);
  }

  onSaveEdit(): void {
    this.saveEdit.emit(this.client.id);
  }

  onCancelEdit(): void {
    this.cancelEdit.emit();
  }

  onDeleteClient(): void {
    this.deleteClient.emit(this.client.id);
  }
}
