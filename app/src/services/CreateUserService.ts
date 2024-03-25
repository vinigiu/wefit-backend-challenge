import { PrismaClient } from "@prisma/client";
import { ICreateUserProps } from "../interfaces/ICreateUserProps";
import { CreateUserReturnType } from "../interfaces/types/CreateUserReturnType";
import AppError from "../libs/errors/AppError";
import SanitizeAndValidate from "../utils/SanitizeAndValidate";

const prismaClient = new PrismaClient();
const sanitizeAndValidate = new SanitizeAndValidate();
export default class CreateUserService {
  public async execute({
    cnpj,
    type,
    name,
    cpf,
    celPhone,
    telPhone,
    email,
    cep,
    streetName,
    streetNumber,
    complement,
    neighborhood,
    city,
    state,
  }: ICreateUserProps): Promise<CreateUserReturnType> {
    const userData = {
      cnpj,
      type,
      name,
      cpf,
      celPhone: sanitizeAndValidate.sanitizePhoneNumber(celPhone),
      telPhone: sanitizeAndValidate.sanitizePhoneNumber(telPhone),
      email,
    };

    const userAddressData = {
      cep,
      streetName,
      streetNumber,
      complement,
      neighborhood,
      city,
      state,
    };

    const createdUser = await prismaClient.user.create({
      data: {
        ...userData,
      },
    });

    if (!createdUser) {
      throw new AppError("Erro na criação de usuário. Usuário não criado", 400);
    }

    const createUserAddress = await prismaClient.userAddress.create({
      data: {
        ...userAddressData,
        userId: createdUser.id,
      },
    });

    if (!createUserAddress) {
      throw new AppError(
        "Erro na criação do endereço de usuário. endereço de usuário não criado.",
        400
      );
    }

    return { createdUser, createUserAddress };
  }
}
