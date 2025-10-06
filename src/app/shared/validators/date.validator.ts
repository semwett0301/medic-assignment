import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator to ensure the date is in the past
 * @returns ValidatorFn that returns validation error if date is not in the past
 */
export function pastDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values, use required validator for that
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    
    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    // Check if the selected date is today or in the future
    if (selectedDate >= today) {
      return { pastDate: { 
        message: 'Date of birth must be in the past',
        actualDate: control.value,
        today: today.toISOString().split('T')[0]
      } };
    }

    // Check if the date is not too far in the past (e.g., more than 150 years ago)
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 150);
    
    if (selectedDate < minDate) {
      return { pastDate: { 
        message: 'Date of birth cannot be more than 150 years ago',
        actualDate: control.value,
        minDate: minDate.toISOString().split('T')[0]
      } };
    }

    return null;
  };
}

/**
 * Validator to ensure the date is not in the future
 * @returns ValidatorFn that returns validation error if date is in the future
 */
export function notFutureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    
    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return { futureDate: { 
        message: 'Date cannot be in the future',
        actualDate: control.value,
        today: today.toISOString().split('T')[0]
      } };
    }

    return null;
  };
}

/**
 * Validator to ensure the person is at least a certain age
 * @param minAge Minimum age in years
 * @returns ValidatorFn that returns validation error if age is below minimum
 */
export function minimumAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    
    let age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
      age--;
    }

    if (age < minAge) {
      return { minimumAge: { 
        message: `Must be at least ${minAge} years old`,
        actualAge: age,
        requiredAge: minAge,
        actualDate: control.value
      } };
    }

    return null;
  };
}
