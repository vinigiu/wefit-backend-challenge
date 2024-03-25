import { Request, Response } from "express";
import UserController from "../../controllers/UserController";
import CreateUserService from "../../services/CreateUserService";

jest.mock("../../services/CreateUserService", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("User Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let userController: UserController;
  let mockExecute: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {
        type: "PHYSICAL",
        name: "John Doe",
        cpf: "12345678900",
        celPhone: "11987560254",
        telPhone: "1139876543",
        email: "john.doe@gmail.com",
        cep: "01234-567",
        streetName: "Rua dos Bosques",
        streetNumber: "1234",
        complement: "ap23",
        neighborhood: "Barra Rasa",
        city: "São Paulo",
        state: "SP",
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    userController = new UserController();
    mockExecute = jest.fn();
    (
      CreateUserService as jest.MockedClass<typeof CreateUserService>
    ).mockImplementation(() => ({
      execute: mockExecute,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a user successfully", async () => {
      const expectedResult = {
        createdUser: {
          id: 1,
          type: "PHYSICAL",
          name: "John Doe",
          cpf: "12345678900",
          celPhone: "11987560254",
          telPhone: "1139876543",
          email: "john.doe@gmail.com",
        },
        createUserAddress: {
          id: 1,
          cep: "01234-567",
          streetName: "Rua dos Bosques",
          streetNumber: "1234",
          complement: "ap23",
          neighborhood: "Barra Rasa",
          city: "São Paulo",
          state: "SP",
        },
      };
      mockExecute.mockResolvedValueOnce(expectedResult);

      await userController.create(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockExecute).toHaveBeenCalledWith({
        type: "PHYSICAL",
        name: "John Doe",
        cpf: "12345678900",
        celPhone: "11987560254",
        telPhone: "1139876543",
        email: "john.doe@gmail.com",
        cep: "01234-567",
        streetName: "Rua dos Bosques",
        streetNumber: "1234",
        complement: "ap23",
        neighborhood: "Barra Rasa",
        city: "São Paulo",
        state: "SP",
      });
      expect(mockResponse!.status).toHaveBeenCalledWith(200);
      expect(mockResponse!.json).toHaveBeenCalledWith(expectedResult);
    });

    it('should handle errors', async () => {
        const errorMessage = 'Some error occurred';
        mockExecute.mockRejectedValueOnce(new Error(errorMessage));
      
        await userController.create(mockRequest as Request, mockResponse as Response);
      
        expect(mockResponse!.status).toHaveBeenCalledWith(400);
        expect(mockResponse!.json).toHaveBeenCalledWith(
          expect.objectContaining({ error: expect.any(Error) })
        );
      });
  });
});
