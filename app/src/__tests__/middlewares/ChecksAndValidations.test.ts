import { Request, Response } from 'express';
import CheckAndValidations from '../../middlewares/ChecksAndValidations';
import AppError from '../../libs/errors/AppError';
import { PrismaClient } from '@prisma/client';
import SanitizeAndValidate from '../../utils/SanitizeAndValidate';

jest.mock('@prisma/client');
jest.mock('../../utils/SanitizeAndValidate');

describe('CheckAndValidations Middleware', () => {
  let checkAndValidations: CheckAndValidations;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNextFunction: jest.Mock;

  beforeEach(() => {
    checkAndValidations = new CheckAndValidations();
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNextFunction = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkMandatoryData', () => {
    it('should pass if all mandatory data is provided', () => {
      mockRequest.body = {
        type: 'PHYSICAL',
        cpf: '12345678900',
        name: 'John Doe',
        celPhone: '11987560254',
        telPhone: '1139876543',
        email: 'john.doe@gmail.com',
        cep: '01234-567',
        streetName: 'Rua dos Bosques',
        streetNumber: '1234',
        complement: 'ap23',
        neighborhood: 'Barra Rasa',
        city: 'São Paulo',
        state: 'SP',
      };

      checkAndValidations.checkMandatoryData(mockRequest as Request, mockResponse as Response, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });
  });

  describe('validateData', () => {
    it('should pass if all data is valid and unique', async () => {
      const prismaClientMock = {
        user: {
          findUnique: jest.fn().mockResolvedValueOnce(null),
          findFirst: jest.fn().mockResolvedValueOnce(null),
        },
      };

      const sanitizeAndValidateMock = {
        validateEmail: jest.fn().mockReturnValueOnce(true),
        validateCPF: jest.fn().mockReturnValueOnce(true),
        validateCEP: jest.fn().mockReturnValueOnce(true),
        validateState: jest.fn().mockReturnValueOnce(true),
      };

      (PrismaClient as any).user = prismaClientMock.user;
      (SanitizeAndValidate as any).mockReturnValueOnce(sanitizeAndValidateMock);

      mockRequest.body = {
        type: 'PHYSICAL',
        cpf: '12345678900',
        name: 'John Doe',
        celPhone: '11987560254',
        telPhone: '1139876543',
        email: 'john.doe@gmail.com',
        cep: '01234-567',
        streetName: 'Rua dos Bosques',
        streetNumber: '1234',
        neighborhood: 'Barra Rasa',
        city: 'São Paulo',
        state: 'SP',
      };

      await checkAndValidations.validateData(mockRequest as Request, mockResponse as Response, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });
  });
});