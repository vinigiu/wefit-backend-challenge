import { PrismaClient } from "@prisma/client";
import { PersonType } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import AppError from "../libs/errors/AppError";
import SanitizeAndValidate from "../utils/SanitizeAndValidate";

const prismaClient = new PrismaClient();
const sanitizeAndValidate = new SanitizeAndValidate();

export default class CheckAndValidations {
  public checkMandatoryData(req: Request, res: Response, next: NextFunction): void {
    const bodyData = req.body;

    if (!bodyData.type)
      throw new AppError('Type of person is needed.', 400);

    if (bodyData.type == 'JURIDICAL' && !bodyData.cnpj)
      throw new AppError('CNPJ is needed for Juridical type of person.', 400);

    if (!bodyData.cpf) throw new AppError('CPF is needed.', 400);

    if (!bodyData.name) throw new AppError('Name is needed.', 400);

    if (!bodyData.celPhone) throw new AppError('Cel Phone is needed.', 400);

    if (!bodyData.telPhone)
      throw new AppError('Tel Phone is needed.', 400);

    if (!bodyData.email)
      throw new AppError('E-mail is needed.', 400);

    if (!bodyData.cep) throw new AppError('CEP is needed.', 400);

    if (!bodyData.streetName)
      throw new AppError('Street Name is needed.', 400);

    if (!bodyData.streetNumber)
      throw new AppError('Address number is needed.', 400);

    if (!bodyData.neighborhood)
      throw new AppError('Neighborhood is needed.', 400);

    if (!bodyData.city)
      throw new AppError('City is needed.', 400);

    if (!bodyData.state)
      throw new AppError('State is needed.', 400);

    next();
  }

  public async validateData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bodyData = req.body;

      // Valida se e-mail é único e se está em formato válido
      const userEmailAlreadyRegistered = await prismaClient.user.findUnique({
        where: {
          email: bodyData.email,
        },
      });

      if (userEmailAlreadyRegistered)
        throw new AppError('This e-mail is already registered.', 400);

      if (!sanitizeAndValidate.validateEmail(bodyData.email))
        throw new AppError('Invalid e-mail.', 400);

      // Valida se tipo de pessoa é um dos previstos.
      if (!(bodyData.type in PersonType))
        throw new AppError('Invalid person type.', 400);

      // Valida CNPJ se Pessoa Jurídica
      if (bodyData.type === 'JURIDICAL') {
        const cnpjAreadyRegistered = await prismaClient.user.findUnique({
          where: {
            cnpj: bodyData.cnpj,
          },
        });

        if (cnpjAreadyRegistered)
          throw new AppError('This CNPJ is already registered.', 400);

        if (!sanitizeAndValidate.validateCNPJ(bodyData.cnpj))
          throw new AppError('Invalid CNPJ', 400);
      }

      // Valida CPF se Pessoa Física
      if (bodyData.type === 'PHYSICAL') {
        const cpfAlreadyRegisteredOnPhysicalType =
          await prismaClient.user.findFirst({
            where: {
              type: 'PHYSICAL',
              cpf: bodyData.cpf,
            },
          });

        if (cpfAlreadyRegisteredOnPhysicalType)
          throw new AppError('This CPF is already in use.', 400);

        if (!sanitizeAndValidate.validateCPF(bodyData.cpf))
          throw new AppError('Invalid CPF.', 400);
      }

      // Valida CEP
      if (!sanitizeAndValidate.validateCEP(bodyData.cep))
        throw new AppError('Invalid CEP.', 400);

      // Valida se sigla do estado é uma sigla dos estados brasileiros.
      if (!sanitizeAndValidate.validateState(bodyData.state))
        throw new AppError('Invalid state.', 400);

      next();
    } catch (error) {
        console.log(error);
      next(error);
    }
  }
}
