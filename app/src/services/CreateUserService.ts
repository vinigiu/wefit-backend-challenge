import { PrismaClient } from "@prisma/client";
import { ICreateUserProps } from "../interfaces/ICreateUserProps";
import { CreateUserReturnType } from "../interfaces/types/CreateUserReturnType";
import AppError from "../libs/errors/AppError";
import SanitizeAndValidate from "../utils/SanitizeAndValidate";

const prismaClient = new PrismaClient();
const sanitizeAndValidate = new SanitizeAndValidate();
export default class CreateUserService {
  public async execute({ ...userBody }: ICreateUserProps): Promise<CreateUserReturnType> {
    const userData = {
      cnpj: userBody.cnpj,
      type: userBody.type,
      name: userBody.name,
      cpf: userBody.cpf,
      celPhone: sanitizeAndValidate.sanitizePhoneNumber(userBody.celPhone),
      telPhone: sanitizeAndValidate.sanitizePhoneNumber(userBody.telPhone),
      email: userBody.email,
    };

    const userAddressData = {
      cep: userBody.cep,
      streetName: userBody.streetName,
      streetNumber: userBody.streetNumber,
      complement: userBody.complement,
      neighborhood: userBody.neighborhood,
      city: userBody.city,
      state: userBody.state,
    };

    let userExists;

    if (userBody.type === 'PHYSICAL') {
      userExists = await prismaClient.user.findFirst({
        where: {
          cpf: userBody.cpf,
        },
      });
    }

    if (userBody.type === 'JURIDICAL') {
      userExists = await prismaClient.user.findFirst({
        where: {
          cpf: userBody.cnpj,
        },
      });
    }

    if (userExists) {
      throw new AppError('User is already registered.', 400)
    }

    const createdUser = await prismaClient.user.create({
      data: {
        ...userData,
      },
    });

    if (!createdUser) {
      throw new AppError('Error on user registration. User not registered.', 400);
    }

    const createUserAddress = await prismaClient.userAddress.create({
      data: {
        ...userAddressData,
        userId: createdUser.id,
      },
    });

    if (!createUserAddress) {
      throw new AppError(
        'Error on user address registration. User address not registered.',
        400
      );
    }

    return { createdUser, createUserAddress };
  }
}
