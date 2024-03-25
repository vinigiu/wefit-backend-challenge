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
      throw new AppError("Necessário definir o tipo de pessoa.", 400);

    if (bodyData.type == "JURIDICAL" && !bodyData.cnpj)
      throw new AppError("Necessário informar o CNPJ de Pessoa Jurídica.", 400);

    if (!bodyData.cpf) throw new AppError("Necessário informar o CPF.", 400);

    if (!bodyData.name) throw new AppError("Necessário informar o nome.", 400);

    if (!bodyData.celPhone)
      throw new AppError(
        "Necessário informar o número do telefone celular.",
        400
      );

    if (!bodyData.telPhone)
      throw new AppError("Necessário informar o número do telefone fixo.", 400);

    if (!bodyData.email)
      throw new AppError("Necessário informar o e-mail.", 400);

    if (!bodyData.cep) throw new AppError("Necessário informar o cep.", 400);

    if (!bodyData.streetName)
      throw new AppError("Necessário informar o nome da rua no endereço.", 400);

    if (!bodyData.streetNumber)
      throw new AppError("Necessário informar o número no endereço.", 400);

    if (!bodyData.neighborhood)
      throw new AppError("Necessário informar o bairro no endereço.", 400);

    if (!bodyData.city)
      throw new AppError("Necessário informar a cidade de endereço.", 400);

    if (!bodyData.state)
      throw new AppError("Necessário informar o estado de endereço.", 400);

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
        throw new AppError("E-mail já cadastrado.", 400);

      if (!sanitizeAndValidate.validateEmail(bodyData.email))
        throw new AppError("E-mail inválido", 400);

      // Valida se tipo de pessoa é um dos previstos.
      if (!(bodyData.type in PersonType))
        throw new AppError("Tipo de Pessoa inválido", 400);

      // Valida CNPJ se Pessoa Jurídica
      if (bodyData.type === "JURIDICAL") {
        const cnpjAreadyRegistered = await prismaClient.user.findUnique({
          where: {
            cnpj: bodyData.cnpj,
          },
        });

        if (cnpjAreadyRegistered)
          throw new AppError("CNPJ já cadastrado.", 400);

        if (!sanitizeAndValidate.validateCNPJ(bodyData.cnpj))
          throw new AppError("CNPJ inválido", 400);
      }

      // Valida CPF se Pessoa Física
      if (bodyData.type === "PHYSICAL") {
        const cpfAlreadyRegisteredOnPhysicalType =
          await prismaClient.user.findFirst({
            where: {
              type: "PHYSICAL",
              cpf: bodyData.cpf,
            },
          });

        if (cpfAlreadyRegisteredOnPhysicalType)
          throw new AppError("CPF já cadastrado para Pessoa Física.", 400);

        if (!sanitizeAndValidate.validateCPF(bodyData.cpf))
          throw new AppError("CPF inválido", 400);
      }

      // Valida CEP
      if (!sanitizeAndValidate.validateCEP(bodyData.cep))
        throw new AppError("CEP inválido", 400);

      // Valida se sigla do estado é uma sigla dos estados brasileiros.
      if (!sanitizeAndValidate.validateState(bodyData.state))
        throw new AppError("Estado inválido", 400);

      next();
    } catch (error) {
        console.log(error);
      next(error);
    }
  }
}
