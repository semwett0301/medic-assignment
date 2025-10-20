import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() type: 'text' | 'email' | 'password' | 'date' | 'checkbox' = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() errorMessage = '';
  @Input() min = '';
  @Input() max = '';
  @Output() onBlur = new EventEmitter<Event>();
  @Output() onFocus = new EventEmitter<Event>();

  value = '';
  disabled = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlurEvent(event: Event): void {
    this.onTouched();
    this.onBlur.emit(event);
  }

  onFocusEvent(event: Event): void {
    this.onFocus.emit(event);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
