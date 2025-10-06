import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render checkbox input', () => {
    const compiled = fixture.nativeElement;
    const checkboxInput = compiled.querySelector('input[type="checkbox"]');
    expect(checkboxInput).toBeTruthy();
  });

  it('should display label when provided', () => {
    component.label = 'Test Checkbox';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const labelText = compiled.querySelector('.checkbox-text');
    expect(labelText.textContent.trim()).toBe('Test Checkbox');
  });

  it('should set correct id', () => {
    component.id = 'test-checkbox';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const checkboxInput = compiled.querySelector('input[type="checkbox"]');
    expect(checkboxInput.id).toBe('test-checkbox');
  });

  it('should be checked when value is true', () => {
    component.writeValue(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const checkboxInput = compiled.querySelector('input[type="checkbox"]');
    expect(checkboxInput.checked).toBe(true);
  });

  it('should be unchecked when value is false', () => {
    component.writeValue(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const checkboxInput = compiled.querySelector('input[type="checkbox"]');
    expect(checkboxInput.checked).toBe(false);
  });

  it('should emit valueChange when checkbox is clicked', () => {
    jest.spyOn(component.valueChange, 'emit');
    
    component.onInputChange({ target: { checked: true } } as any);
    
    expect(component.valueChange.emit).toHaveBeenCalledWith(true);
  });

  it('should update internal value when checkbox is clicked', () => {
    component.onInputChange({ target: { checked: true } } as any);
    
    expect(component.value).toBe(true);
  });

  it('should call onChange when checkbox is clicked', () => {
    const onChangeSpy = jest.fn();
    component.registerOnChange(onChangeSpy);
    
    component.onInputChange({ target: { checked: true } } as any);
    
    expect(onChangeSpy).toHaveBeenCalledWith(true);
  });

  it('should be disabled when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const checkboxInput = compiled.querySelector('input[type="checkbox"]');
    expect(checkboxInput.disabled).toBe(true);
  });

  it('should add disabled class when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const checkboxContainer = compiled.querySelector('.checkbox-container');
    expect(checkboxContainer.classList.contains('disabled')).toBe(true);
  });

  it('should be required when required is true', () => {
    component.required = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const checkboxInput = compiled.querySelector('input[type="checkbox"]');
    expect(checkboxInput.required).toBe(true);
  });

  it('should handle ControlValueAccessor writeValue', () => {
    component.writeValue(true);
    
    expect(component.value).toBe(true);
  });

  it('should handle ControlValueAccessor setDisabledState', () => {
    component.setDisabledState(true);
    
    expect(component.disabled).toBe(true);
  });

  it('should handle ControlValueAccessor registerOnTouched', () => {
    const onTouchedSpy = jest.fn();
    component.registerOnTouched(onTouchedSpy);
    
    component.onInputBlur();
    
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should emit blur event', () => {
    jest.spyOn(component.blur, 'emit');
    
    component.onInputBlur();
    
    expect(component.blur.emit).toHaveBeenCalled();
  });

  it('should emit focus event', () => {
    jest.spyOn(component.focus, 'emit');
    
    component.onInputFocus();
    
    expect(component.focus.emit).toHaveBeenCalled();
  });

  it('should set focused state on focus', () => {
    component.onInputFocus();
    
    expect(component.isFocused).toBe(true);
  });

  it('should clear focused state on blur', () => {
    component.isFocused = true;
    component.onInputBlur();
    
    expect(component.isFocused).toBe(false);
  });
});
