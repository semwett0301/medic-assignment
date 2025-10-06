import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { CheckboxComponent } from '../../../../shared/ui/checkbox/checkbox.component';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    CardComponent,
    CheckboxComponent
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent {
  @Input() showForm: boolean = false;
  @Input() form!: FormGroup;
  @Input() loading: boolean = false;
  @Input() getFieldError!: (fieldName: string) => string;

  @Output() toggleForm = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<void>();
  @Output() resetForm = new EventEmitter<void>();

  get maxDate(): string {
    // Set max date to yesterday to prevent future dates
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  onToggleForm(): void {
    this.toggleForm.emit();
  }

  onSubmitForm(): void {
    this.submitForm.emit();
  }

  onResetForm(): void {
    this.resetForm.emit();
  }
}
