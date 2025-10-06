import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-group">
      <label *ngIf="label" [for]="id" class="input-label">{{ label }}</label>
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        [required]="required"
        [min]="min"
        [max]="max"
        [class.error]="hasError"
        (input)="onInput($event)"
        (blur)="onBlur.emit($event)"
        (focus)="onFocus.emit($event)"
      />
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  `,
  styles: [`
    .input-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 16px;
    }

    .input-label {
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }

    input {
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s ease;
      
      width: 100%;
      
      margin: 0;
    }

    input:focus {
      outline: none;
      border-color: #006175;
      box-shadow: 0 0 0 2px rgba(0, 97, 117, 0.1);
    }

    input.error {
      border-color: #dc3545;
    }

    input:disabled {
      background-color: #f8f9fa;
      cursor: not-allowed;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
    }
  `]
})
export class InputComponent {
  @Input() id = '';
  @Input() type: 'text' | 'email' | 'password' | 'date' | 'checkbox' = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() errorMessage = '';
  @Input() min = '';
  @Input() max = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() onBlur = new EventEmitter<Event>();
  @Output() onFocus = new EventEmitter<Event>();

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
