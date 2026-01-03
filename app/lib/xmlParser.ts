import { XMLParser, XMLBuilder } from 'fast-xml-parser';

// Список всех массивов в dto
const ARRAY_TAGS = [
  'item', 'order', 'payment', 'shipment',
  'product', 'variant', 'category', 'image',
  'user', 'address', 'phone',
  'tag', 'attribute', 'option'
] as const;

export const parserConfig = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: true,
  parseAttributeValue: true,
  trimValues: true,
  isArray: (tagName: string) => {
    return ARRAY_TAGS.includes(tagName as any);
  },
  processEntities: false
} as const;

export const xmlParser = new XMLParser(parserConfig);
export const xmlBuilder = new XMLBuilder(parserConfig);
