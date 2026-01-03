import { XMLBuilder, XMLParser } from "fast-xml-parser";

export interface ErrorMessage {
    message: string;
    violations: {
        violation: string[]
    },
    time: string;
}

export const isErrorMessage = (obj: any): obj is ErrorMessage => {
    return (
        obj &&
        typeof obj.timestamp === "string" &&
        typeof obj.message === "string" &&
        obj.violations &&
        typeof obj.violations === "object" &&
        Array.isArray(obj.violations)
    );
};

export const createMessageStringFromErrorMessage = (errorMessage: ErrorMessage): string => {
    const violations = errorMessage.violations;
    const stringWithFields = Object.entries(violations)
            .map(([nameField, description]) => `${nameField} - ${description}`)
            .join(", ");
    const message = `${stringWithFields}`;
    return message;
};

export class ErrorMessageProcessor {
  private static readonly parserConfig = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: true,
    isArray: (name: string) => name === 'violation'
  };
  private static readonly parser = new XMLParser(this.parserConfig);
  private static readonly builder = new XMLBuilder(this.parserConfig);

  static parse(xml: string): ErrorMessage {
    const parsed = this.parser.parse(xml);
    const errorData = parsed.error;

    // Простая валидация
    if (!errorData?.message || !errorData?.time) {
      throw new Error('Invalid error XML structure');
    }
    return {
      message: errorData.message,
      violations: {
        violation: Array.isArray(errorData.violations?.violation)
          ? errorData.violations.violation
          : errorData.violations?.violation
            ? [errorData.violations.violation]
            : []
      },
      time: errorData.time
    };
  }
  static serialize(error: ErrorMessage): string {
    const xmlData = {
      error: {
        message: error.message,
        violations: {
          violation: error.violations.violation
        },
        time: error.time
      }
    };
    return this.builder.build(xmlData);
  }
}
