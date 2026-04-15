export interface InvitationTemplate {
  id: string;
  name: string;
  description: string;
  category: "elegant" | "rustic" | "modern" | "floral" | "minimalist" | "vintage" | "tropical" | "romantic";
  thumbnail: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  layout: "centered" | "left" | "split";
}

export interface FieldStyle {
  fontSize: number;
  fontFamily: string;
  textColor: string;
  isBold: boolean;
  verticalOffset: number;
}

export type FieldName = "title" | "names" | "message" | "date" | "time" | "venue" | "rsvpDate";

export interface FieldStyles {
  title: FieldStyle;
  names: FieldStyle;
  message: FieldStyle;
  date: FieldStyle;
  time: FieldStyle;
  venue: FieldStyle;
  rsvpDate: FieldStyle;
}

export const defaultFieldStyle: FieldStyle = {
  fontSize: 16,
  fontFamily: "inherit",
  textColor: "#000000",
  isBold: false,
  verticalOffset: 0,
};

export const createDefaultStyles = (): FieldStyles => ({
  title: { ...defaultFieldStyle, fontSize: 12, textColor: "inherit" },
  names: { ...defaultFieldStyle, fontSize: 32, isBold: true },
  message: { ...defaultFieldStyle, fontSize: 14 },
  date: { ...defaultFieldStyle, fontSize: 18, isBold: true },
  time: { ...defaultFieldStyle, fontSize: 14 },
  venue: { ...defaultFieldStyle, fontSize: 14 },
  rsvpDate: { ...defaultFieldStyle, fontSize: 12 },
});

export interface InvitationData {
  templateId: string;
  title: string;
  names: string;
  date: string;
  time: string;
  venue: string;
  rsvpDate: string;
  message: string;
  styles?: FieldStyles;
  globalFontFamily?: string;
}

export const templateCategories = [
  { id: "all", name: "All Templates" },
  { id: "elegant", name: "Elegant" },
  { id: "rustic", name: "Rustic" },
  { id: "modern", name: "Modern" },
  { id: "floral", name: "Floral" },
  { id: "minimalist", name: "Minimalist" },
  { id: "vintage", name: "Vintage" },
  { id: "tropical", name: "Tropical" },
  { id: "romantic", name: "Romantic" },
];
