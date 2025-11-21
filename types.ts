
export interface UploadedImage {
  file: File;
  previewUrl: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
}

export interface AvatarConfig {
  // Format
  model: string;
  plan: string;
  aspectRatio: string;
  
  // Person
  gender: string;
  age: string;
  ethnicity: string;
  skinTone: string;
  bodyType: string; // New
  
  // Face Features
  faceShape: string;
  eyeShape: string;
  eyeColor: string;
  noseShape: string;
  lipShape: string;
  facialFeatures: string; // New (freckles, etc)
  
  // Hair
  hairLength: string;
  hairColor: string;
  hairTexture: string;
  facialHair: string;
  
  // Style & Attire (New)
  clothing: string;
  accessories: string;
  artStyle: string;

  // Expression
  expression: string;

  // Background (New)
  backgroundMode: 'prompt' | 'upload' | 'random';
  backgroundPrompt: string;
}

export interface GeneratedAvatar {
  id: string;
  url: string;
  prompt: string;
  type: 'original' | 'modification';
  label: string; // e.g., "Front view", "Smile", "Left profile"
}
