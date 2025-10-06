import { AbstractControl, FormControl } from '@angular/forms';
import { pastDateValidator, notFutureDateValidator, minimumAgeValidator } from './date.validator';

describe('Date Validators', () => {
  let control: AbstractControl;

  beforeEach(() => {
    control = new FormControl();
  });

  describe('pastDateValidator', () => {
    it('should return null for empty value', () => {
      control.setValue('');
      const validator = pastDateValidator();
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for past date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      control.setValue(yesterday.toISOString().split('T')[0]);
      
      const validator = pastDateValidator();
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return error for today', () => {
      const today = new Date();
      control.setValue(today.toISOString().split('T')[0]);
      
      const validator = pastDateValidator();
      const result = validator(control);
      expect(result).not.toBeNull();
      expect(result?.['pastDate']).toBeDefined();
      expect(result?.['pastDate'].message).toBe('Date of birth must be in the past');
    });

    it('should return error for future date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      control.setValue(tomorrow.toISOString().split('T')[0]);
      
      const validator = pastDateValidator();
      const result = validator(control);
      expect(result).not.toBeNull();
      expect(result?.['pastDate']).toBeDefined();
    });

    it('should return error for date more than 150 years ago', () => {
      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 151);
      control.setValue(oldDate.toISOString().split('T')[0]);
      
      const validator = pastDateValidator();
      const result = validator(control);
      expect(result).not.toBeNull();
      expect(result?.['pastDate']).toBeDefined();
      expect(result?.['pastDate'].message).toBe('Date of birth cannot be more than 150 years ago');
    });
  });

  describe('notFutureDateValidator', () => {
    it('should return null for empty value', () => {
      control.setValue('');
      const validator = notFutureDateValidator();
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for past date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      control.setValue(yesterday.toISOString().split('T')[0]);
      
      const validator = notFutureDateValidator();
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for today', () => {
      const today = new Date();
      control.setValue(today.toISOString().split('T')[0]);
      
      const validator = notFutureDateValidator();
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return error for future date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      control.setValue(tomorrow.toISOString().split('T')[0]);
      
      const validator = notFutureDateValidator();
      const result = validator(control);
      expect(result).not.toBeNull();
      expect(result?.['futureDate']).toBeDefined();
      expect(result?.['futureDate'].message).toBe('Date cannot be in the future');
    });
  });

  describe('minimumAgeValidator', () => {
    it('should return null for empty value', () => {
      control.setValue('');
      const validator = minimumAgeValidator(18);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for valid age', () => {
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 25);
      control.setValue(validDate.toISOString().split('T')[0]);
      
      const validator = minimumAgeValidator(18);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return error for age below minimum', () => {
      const youngDate = new Date();
      youngDate.setFullYear(youngDate.getFullYear() - 16);
      control.setValue(youngDate.toISOString().split('T')[0]);
      
      const validator = minimumAgeValidator(18);
      const result = validator(control);
      expect(result).not.toBeNull();
      expect(result?.['minimumAge']).toBeDefined();
      expect(result?.['minimumAge'].message).toBe('Must be at least 18 years old');
      expect(result?.['minimumAge'].actualAge).toBe(16);
      expect(result?.['minimumAge'].requiredAge).toBe(18);
    });

    it('should handle edge case for exact minimum age', () => {
      const exactDate = new Date();
      exactDate.setFullYear(exactDate.getFullYear() - 18);
      exactDate.setMonth(exactDate.getMonth() - 1); // Make sure it's definitely 18
      control.setValue(exactDate.toISOString().split('T')[0]);
      
      const validator = minimumAgeValidator(18);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should work with different minimum ages', () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 20);
      control.setValue(date.toISOString().split('T')[0]);
      
      const validator18 = minimumAgeValidator(18);
      const validator21 = minimumAgeValidator(21);
      
      expect(validator18(control)).toBeNull();
      expect(validator21(control)).not.toBeNull();
    });
  });
});
