import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RadioComponent, RadioOption } from './radio.component';

describe('RadioComponent', () => {
  let component: RadioComponent;
  let fixture: ComponentFixture<RadioComponent>;

  const mockOptions: RadioOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RadioComponent);
    component = fixture.componentInstance;
    component.options = mockOptions;
    component.name = 'test-radio';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all options', () => {
    const compiled = fixture.nativeElement;
    const radioInputs = compiled.querySelectorAll('input[type="radio"]');
    expect(radioInputs).toHaveLength(3);
  });

  it('should display correct labels', () => {
    const compiled = fixture.nativeElement;
    const labels = compiled.querySelectorAll('.radio-label');
    expect(labels[0].textContent.trim()).toBe('Option 1');
    expect(labels[1].textContent.trim()).toBe('Option 2');
    expect(labels[2].textContent.trim()).toBe('Option 3');
  });

  it('should set correct values on radio inputs', () => {
    const compiled = fixture.nativeElement;
    const radioInputs = compiled.querySelectorAll('input[type="radio"]');
    
    expect(radioInputs[0].value).toBe('option1');
    expect(radioInputs[1].value).toBe('option2');
    expect(radioInputs[2].value).toBe('option3');
  });

  it('should set correct name attribute', () => {
    const compiled = fixture.nativeElement;
    const radioInputs = compiled.querySelectorAll('input[type="radio"]');
    
    radioInputs.forEach(input => {
      expect(input.name).toBe('test-radio');
    });
  });

  it('should check correct option when value is set', () => {
    component.writeValue('option2');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const radioInputs = compiled.querySelectorAll('input[type="radio"]');
    
    expect(radioInputs[0].checked).toBe(false);
    expect(radioInputs[1].checked).toBe(true);
    expect(radioInputs[2].checked).toBe(false);
  });

  it('should emit valueChange when option is selected', () => {
    jest.spyOn(component.valueChange, 'emit');
    
    component.onRadioChange('option2');
    
    expect(component.valueChange.emit).toHaveBeenCalledWith('option2');
  });

  it('should update internal value when option is selected', () => {
    component.onRadioChange('option2');
    
    expect(component.value).toBe('option2');
  });

  it('should call onChange when option is selected', () => {
    const onChangeSpy = jest.fn();
    component.registerOnChange(onChangeSpy);
    
    component.onRadioChange('option2');
    
    expect(onChangeSpy).toHaveBeenCalledWith('option2');
  });

  it('should not emit or update when disabled', () => {
    component.disabled = true;
    jest.spyOn(component.valueChange, 'emit');
    
    component.onRadioChange('option2');
    
    expect(component.valueChange.emit).not.toHaveBeenCalled();
    expect(component.value).toBe(null);
  });

  it('should disable all inputs when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const radioInputs = compiled.querySelectorAll('input[type="radio"]');
    
    radioInputs.forEach(input => {
      expect(input.disabled).toBe(true);
    });
  });

  it('should add disabled class when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const radioGroup = compiled.querySelector('.radio-group');
    
    expect(radioGroup.classList.contains('disabled')).toBe(true);
  });

  it('should check if option is checked correctly', () => {
    component.value = 'option2';
    
    expect(component.isChecked(mockOptions[0])).toBe(false);
    expect(component.isChecked(mockOptions[1])).toBe(true);
    expect(component.isChecked(mockOptions[2])).toBe(false);
  });

  it('should handle ControlValueAccessor writeValue', () => {
    component.writeValue('option3');
    
    expect(component.value).toBe('option3');
  });

  it('should handle ControlValueAccessor setDisabledState', () => {
    component.setDisabledState(true);
    
    expect(component.disabled).toBe(true);
  });

  it('should handle ControlValueAccessor registerOnTouched', () => {
    const onTouchedSpy = jest.fn();
    component.registerOnTouched(onTouchedSpy);
    
    // This should not throw an error
    expect(() => component.registerOnTouched(onTouchedSpy)).not.toThrow();
  });
});
