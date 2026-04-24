// Types for the custom invitation editor

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  isBold: boolean;
  isItalic: boolean;
  textAlign: "left" | "center" | "right";
  lineHeight: number;
  letterSpacing: number;
  textShadow?: string;
  textOutline?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TextElement {
  id: string;
  type: "text";
  content: string;
  position: Position;
  size: Size;
  style: TextStyle;
  zIndex: number;
}

export interface ImageElement {
  id: string;
  type: "image";
  src: string;
  position: Position;
  size: Size;
  opacity: number;
  zIndex: number;
}

export interface ShapeElement {
  id: string;
  type: "shape";
  shapeType: "heart" | "ring" | "flower" | "star" | "circle" | "diamond";
  position: Position;
  size: Size;
  color: string;
  opacity: number;
  zIndex: number;
}

export interface BorderElement {
  id: string;
  type: "border";
  borderStyle: string;
  color: string;
  thickness: number;
  cornerStyle: "square" | "rounded" | "ornate";
}

export type CanvasElement = TextElement | ImageElement | ShapeElement;

export interface CustomInvitationData {
  id: string;
  name: string;
  backgroundColor: string;
  backgroundImage?: string;
  backgroundOpacity: number;
  elements: CanvasElement[];
  border?: BorderElement;
  canvasSize: Size;
  createdAt: string;
  updatedAt: string;
}

export const defaultTextStyle: TextStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: 24,
  color: "#1a1a1a",
  isBold: false,
  isItalic: false,
  textAlign: "center",
  lineHeight: 1.4,
  letterSpacing: 0,
};

export const createDefaultCustomInvitation = (): CustomInvitationData => ({
  id: crypto.randomUUID(),
  name: "My Custom Invitation",
  backgroundColor: "#ffffff",
  backgroundOpacity: 1,
  elements: [
    {
      id: crypto.randomUUID(),
      type: "text",
      content: "You're Invited",
      position: { x: 50, y: 80 },
      size: { width: 300, height: 50 },
      style: { ...defaultTextStyle, fontSize: 14, letterSpacing: 4 },
      zIndex: 1,
    },
    {
      id: crypto.randomUUID(),
      type: "text",
      content: "John & Jane",
      position: { x: 50, y: 150 },
      size: { width: 300, height: 80 },
      style: { ...defaultTextStyle, fontSize: 42, isBold: true },
      zIndex: 2,
    },
    {
      id: crypto.randomUUID(),
      type: "text",
      content: "September 15, 2025 • 4:00 PM",
      position: { x: 50, y: 250 },
      size: { width: 300, height: 40 },
      style: { ...defaultTextStyle, fontSize: 16 },
      zIndex: 3,
    },
    {
      id: crypto.randomUUID(),
      type: "text",
      content: "The Grand Estate\n123 Wedding Lane, City",
      position: { x: 50, y: 320 },
      size: { width: 300, height: 60 },
      style: { ...defaultTextStyle, fontSize: 14, lineHeight: 1.6 },
      zIndex: 4,
    },
  ],
  canvasSize: { width: 400, height: 533 }, // 3:4 aspect ratio
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Available fonts for the editor
export const availableFonts = [
  { name: "Playfair Display", value: "'Playfair Display', serif" },
  { name: "Great Vibes", value: "'Great Vibes', cursive" },
  { name: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
  { name: "Lora", value: "'Lora', serif" },
  { name: "Montserrat", value: "'Montserrat', sans-serif" },
  { name: "Raleway", value: "'Raleway', sans-serif" },
  { name: "Dancing Script", value: "'Dancing Script', cursive" },
  { name: "Pinyon Script", value: "'Pinyon Script', cursive" },
  { name: "Cinzel", value: "'Cinzel', serif" },
  { name: "Josefin Sans", value: "'Josefin Sans', sans-serif" },
];

// Available shapes
export const availableShapes = [
  { id: "heart", name: "Heart", icon: "❤️" },
  { id: "ring", name: "Ring", icon: "💍" },
  { id: "flower", name: "Flower", icon: "🌸" },
  { id: "star", name: "Star", icon: "⭐" },
  { id: "circle", name: "Circle", icon: "⚪" },
  { id: "diamond", name: "Diamond", icon: "💎" },
];

// Available border styles
export const availableBorders = [
  { id: "none", name: "None" },
  { id: "simple", name: "Simple Line" },
  { id: "double", name: "Double Line" },
  { id: "ornate", name: "Ornate Frame" },
  { id: "floral", name: "Floral Border" },
  { id: "vintage", name: "Vintage Frame" },
];

// Color palette presets
export const colorPalettes = [
  { name: "Classic", colors: ["#1a1a1a", "#4a4a4a", "#8b7355", "#c4a77d", "#f5f0e8"] },
  { name: "Romantic", colors: ["#8b4557", "#c77d8e", "#f0b8c4", "#fce4ec", "#ffffff"] },
  { name: "Garden", colors: ["#2d5a27", "#5a8f53", "#8bc34a", "#c5e1a5", "#f1f8e9"] },
  { name: "Ocean", colors: ["#1a237e", "#3949ab", "#7986cb", "#c5cae9", "#e8eaf6"] },
  { name: "Sunset", colors: ["#bf360c", "#e64a19", "#ff8a65", "#ffccbc", "#fbe9e7"] },
  { name: "Elegant", colors: ["#212121", "#424242", "#9e9e9e", "#e0e0e0", "#fafafa"] },
];
