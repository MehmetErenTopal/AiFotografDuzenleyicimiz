// Global Window arayüzünü aistudio özellikleri ile genişlet
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

export interface GeneratedImagePart {
  inlineData?: {
    data: string;
    mimeType: string;
  };
  text?: string;
}

export type ImageSize = '1K' | '2K' | '4K';