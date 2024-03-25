import AppError from "../libs/errors/AppError";

export default class SanitizeAndValidate {
  public sanitizePhoneNumber(value: string): string {
    const cleanedNumber = value.replace(/[^\d]/g, "");

    if (cleanedNumber.length === 10 || cleanedNumber.length === 11) {
      return cleanedNumber;
    } else {
      throw new AppError("Número de telefone inválido", 400);
    }
  }

  public validateCEP(value: string): boolean {
    const cleanedCEP = value.replace(/[^\d]/g, "");

    // Verifica se o CEP possui exatamente 8 dígitos
    return /^\d{8}$/.test(cleanedCEP);
  }

  public validateCNPJ(value: string): boolean {
    const regexCNPJ = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/;

    const digitsOnly = /^\d{14}$/.test(value);

    const validFormat = regexCNPJ.test(value);

    const isValid = digitsOnly || validFormat;

    if (!isValid) return false;

    return true;
  }

  public validateCPF(value: string): boolean {
    const regexCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    const digitsOnly = /^\d{11}$/.test(value);

    if (
      value.length < 11 ||
      value.length > 14 ||
      value == "000.000.000-00" ||
      value == "111.111.111-11" ||
      value == "222.222.222-22" ||
      value == "333.333.333-33" ||
      value == "444.444.444-44" ||
      value == "555.555.555-55" ||
      value == "666.666.666-66" ||
      value == "777.777.777-77" ||
      value == "888.888.888-88" ||
      value == "999.999.999-99"
    ) {
      return false;
    }

    const validFormat = regexCPF.test(value);

    const isValid = digitsOnly || validFormat;

    if (!isValid) return false;

    return true;
  }

  public validateEmail(value: string): boolean {
    const regexEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
    return regexEmail.test(value);
  }

  public validateState(value: string): boolean {
    switch (value) {
      case "AC":
        return true;
      case "AL":
        return true;
      case "AP":
        return true;
      case "AM":
        return true;
      case "BA":
        return true;
      case "CE":
        return true;
      case "DF":
        return true;
      case "ES":
        return true;
      case "GO":
        return true;
      case "MA":
        return true;
      case "MT":
        return true;
      case "MS":
        return true;
      case "MG":
        return true;
      case "PA":
        return true;
      case "PB":
        return true;
      case "PR":
        return true;
      case "PE":
        return true;
      case "PI":
        return true;
      case "RJ":
        return true;
      case "RN":
        return true;
      case "RS":
        return true;
      case "RO":
        return true;
      case "RR":
        return true;
      case "SC":
        return true;
      case "SP":
        return true;
      case "SE":
        return true;
      case "TO":
        return true;
      default:
        return false;
    }
  }
}
