/**
 * Utilidades de validación reutilizables
 * Sigue el principio de Single Responsibility: cada validador tiene una sola responsabilidad
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valida que un campo de texto no esté vacío
 */
export function validateRequired(value: string | undefined | null, fieldName: string): ValidationResult {
  if (!value || !value.trim()) {
    return {
      isValid: false,
      error: `${fieldName} es obligatorio`,
    };
  }
  return { isValid: true };
}

/**
 * Valida que un número sea positivo
 */
export function validatePositiveNumber(value: number | undefined | null, fieldName: string): ValidationResult {
  if (value === undefined || value === null || isNaN(value)) {
    return {
      isValid: false,
      error: `${fieldName} debe ser un número válido`,
    };
  }
  if (value < 0) {
    return {
      isValid: false,
      error: `${fieldName} debe ser mayor o igual a 0`,
    };
  }
  return { isValid: true };
}

/**
 * Valida que un número esté en un rango específico
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  if (value < min || value > max) {
    return {
      isValid: false,
      error: `${fieldName} debe estar entre ${min} y ${max}`,
    };
  }
  return { isValid: true };
}

/**
 * Valida múltiples campos
 */
export function validateFields(
  validations: ValidationResult[]
): ValidationResult {
  for (const validation of validations) {
    if (!validation.isValid) {
      return validation;
    }
  }
  return { isValid: true };
}

