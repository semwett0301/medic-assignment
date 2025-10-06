import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' = 'default';
  @Input() indeterminate: boolean = false;

  @Output() valueChange = new EventEmitter<boolean>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  value: boolean = false;
  isFocused: boolean = false;

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.checked;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onInputBlur(): void {
    this.isFocused = false;
    this.onTouched();
    this.blur.emit();
  }

  onInputFocus(): void {
    this.isFocused = true;
    this.focus.emit();
  }

  onLabelClick(): void {
    if (!this.disabled) {
      this.value = !this.value;
      this.onChange(this.value);
      this.valueChange.emit(this.value);
    }
  }
}
