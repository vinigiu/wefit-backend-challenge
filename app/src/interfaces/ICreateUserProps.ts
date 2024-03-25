import { PersonType } from "@prisma/client";

export interface ICreateUserProps {
    type: PersonType;
    cnpj?: string;
    cpf: string;
    name: string;
    celPhone: string;
    telPhone: string;
    email: string;
    cep: string;
    streetName: string;
    streetNumber: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
}
