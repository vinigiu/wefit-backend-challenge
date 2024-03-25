import SanitizeAndValidate from '../../utils/SanitizeAndValidate';

describe('SanitizeAndValidate', () => {
  let sanitizeAndValidate: SanitizeAndValidate;

  beforeEach(() => {
    sanitizeAndValidate = new SanitizeAndValidate();
  });

  describe('sanitizePhoneNumber', () => {
    it('should sanitize phone number and return a cleaned number', () => {
      const cleanedNumber = sanitizeAndValidate.sanitizePhoneNumber('(123) 456-7890');
      expect(cleanedNumber).toBe('1234567890');
    });

    it('should throw AppError for invalid phone number', () => {
      expect(() => sanitizeAndValidate.sanitizePhoneNumber('invalid')).toThrowError('Número de telefone inválido');
    });
  });

  describe('validateCEP', () => {
    it('should return true for a valid CEP', () => {
      const result = sanitizeAndValidate.validateCEP('12345-678');
      expect(result).toBe(true);
    });

    it('should return false for an invalid CEP', () => {
      const result = sanitizeAndValidate.validateCEP('123456789');
      expect(result).toBe(false);
    });
  });

  describe('validateCNPJ', () => {
    it('should return true for a valid CNPJ', () => {
      const result = sanitizeAndValidate.validateCNPJ('31962853000138');
      expect(result).toBe(true);
    });

    it('should return false for an invalid CEP', () => {
      const result = sanitizeAndValidate.validateCEP('31.962.853.0001-3845');
      expect(result).toBe(false);
    });
  });

  describe('validateCPF', () => {
    it('should return true for a valid CPF', () => {
      const result = sanitizeAndValidate.validateCPF('41860860877');
      expect(result).toBe(true);
    });

    it('should return false for an invalid CPF', () => {
      const result = sanitizeAndValidate.validateCEP('00000000000');
      expect(result).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should return true for a valid e-mail', () => {
      const result = sanitizeAndValidate.validateEmail('contato@teste.com.br');
      expect(result).toBe(true);
    });

    it('should return false for an invalid e-mail', () => {
      const result = sanitizeAndValidate.validateCEP('contato@email');
      expect(result).toBe(false);
    });
  });

  describe('validateState', () => {
    it('should return true for a valid State', () => {
      const result = sanitizeAndValidate.validateState('SP');
      expect(result).toBe(true);
    });

    it('should return false for an invalid State', () => {
      const result = sanitizeAndValidate.validateCEP('XY');
      expect(result).toBe(false);
    });
  });
});