import { XMLBuilder, XMLParser } from "fast-xml-parser";

export interface ErrorMessage {
    message: string;
    violations: {
        violation: string[];
    };
    time: string;
}

export const isErrorMessage = (obj: any): boolean => {
    return (
        obj &&
        typeof obj.timestamp === "string" &&
        typeof obj.message === "string" &&
        obj.violations &&
        typeof obj.violations === "object"
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

const PARSER_CONFIG = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: true,
  processEntities: false,
  isArray: (name: string) => name === 'violation'
} as const;

const parser = new XMLParser(PARSER_CONFIG);
const builder = new XMLBuilder(PARSER_CONFIG);

export const parseErrorMessage = (xml: string): ErrorMessage => {
    const parsed = parser.parse(xml);
    const errorData = parsed.error;
    if (!errorData?.message || !errorData?.time) {
        throw new Error('Invalid error XML structure');
    }
    const violationValue = errorData.violations?.violation;
    let violationArray: string[];
    if (Array.isArray(violationValue)) {
        violationArray = violationValue;
    } else if (violationValue) {
        violationArray = [violationValue];
    } else {
        violationArray = [];
    }
    return {
        message: errorData.message,
        violations: { violation: violationArray },
        time: errorData.time
    };
};

export const serializeErrorMessage = (error: ErrorMessage): string => {
    const xmlData = {
        error: {
            message: error.message,
            violations: {
                violation: error.violations.violation
            },
            time: error.time
        }
    };
    return builder.build(xmlData);
}

export const createErrorMessage = (
    message: string,
    violations: string[],
    time: string
): ErrorMessage => {
    return {
        message,
        violations: { violation: violations },
        time: time
    };
};
