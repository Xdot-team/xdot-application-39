import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

export interface FormField {
  value: any;
  error: string | null;
  touched: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export function useFormValidation(initialValues: Record<string, any>, validationSchema: ValidationSchema) {
  const [formState, setFormState] = useState<FormState>(() => {
    const initialState: FormState = {};
    Object.keys(initialValues).forEach(key => {
      initialState[key] = {
        value: initialValues[key],
        error: null,
        touched: false
      };
    });
    return initialState;
  });

  const validateField = useCallback((fieldName: string, value: any): string | null => {
    const rules = validationSchema[fieldName];
    if (!rules) return null;

    // Required validation
    if (rules.required && (value === null || value === undefined || value === '')) {
      return `${fieldName} is required`;
    }

    // If field is empty and not required, skip other validations
    if (!rules.required && (value === null || value === undefined || value === '')) {
      return null;
    }

    // String validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `${fieldName} must be at least ${rules.minLength} characters`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `${fieldName} must be no more than ${rules.maxLength} characters`;
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        return `${fieldName} format is invalid`;
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return `${fieldName} must be at least ${rules.min}`;
      }
      if (rules.max !== undefined && value > rules.max) {
        return `${fieldName} must be no more than ${rules.max}`;
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return null;
  }, [validationSchema]);

  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        error: validateField(fieldName, value),
        touched: true
      }
    }));
  }, [validateField]);

  const setFieldTouched = useCallback((fieldName: string, touched = true) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        touched,
        error: touched ? validateField(fieldName, prev[fieldName].value) : null
      }
    }));
  }, [validateField]);

  const validateAll = useCallback((): boolean => {
    let isValid = true;
    const newFormState = { ...formState };

    Object.keys(newFormState).forEach(fieldName => {
      const error = validateField(fieldName, newFormState[fieldName].value);
      newFormState[fieldName] = {
        ...newFormState[fieldName],
        error,
        touched: true
      };
      if (error) isValid = false;
    });

    setFormState(newFormState);
    return isValid;
  }, [formState, validateField]);

  const resetForm = useCallback(() => {
    const resetState: FormState = {};
    Object.keys(initialValues).forEach(key => {
      resetState[key] = {
        value: initialValues[key],
        error: null,
        touched: false
      };
    });
    setFormState(resetState);
  }, [initialValues]);

  const getValues = useCallback(() => {
    const values: Record<string, any> = {};
    Object.keys(formState).forEach(key => {
      values[key] = formState[key].value;
    });
    return values;
  }, [formState]);

  const hasErrors = Object.values(formState).some(field => field.error !== null);
  const isTouched = Object.values(formState).some(field => field.touched);

  return {
    formState,
    setFieldValue,
    setFieldTouched,
    validateAll,
    resetForm,
    getValues,
    hasErrors,
    isTouched
  };
}

// Common validation rules
export const ValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: true
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]+$/,
    minLength: 10
  },
  required: {
    required: true
  },
  positiveNumber: {
    min: 0,
    required: true
  },
  currency: {
    min: 0,
    custom: (value: any) => {
      if (typeof value === 'string' && value.includes('.')) {
        const decimals = value.split('.')[1];
        if (decimals && decimals.length > 2) {
          return 'Currency can have at most 2 decimal places';
        }
      }
      return null;
    }
  }
};