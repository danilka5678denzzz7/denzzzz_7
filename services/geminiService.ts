
import { GoogleGenAI } from "@google/genai";

// Helper to convert File to Base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateCompositeImage = async (
  personFile: File,
  backgroundFile: File
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const personBase64 = await fileToBase64(personFile);
    const backgroundBase64 = await fileToBase64(backgroundFile);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: "Create a photorealistic composite image. I have provided two images. The FIRST image contains a person (the subject). The SECOND image contains the background environment. Your task is to generate a new image where the person from the first image is placed naturally into the scene of the second image. Maintain the person's facial features, clothing, and general pose, but adapt the lighting, shadows, and perspective to realisticly match the new background environment. Do not crop the person's head."
          },
          {
            inlineData: {
              mimeType: personFile.type,
              data: personBase64,
            },
          },
          {
            inlineData: {
              mimeType: backgroundFile.type,
              data: backgroundBase64,
            },
          },
        ],
      },
    });

    // Iterate through parts to find the image
    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
    }
    
    throw new Error("Не удалось сгенерировать изображение. Модель не вернула данные.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateAvatar = async (
  prompt: string, 
  aspectRatio: string,
  referenceImageBase64?: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const parts: any[] = [{ text: prompt }];

    if (referenceImageBase64) {
      // If a background image is provided, we pass it as a reference
      // and instruct the model in the prompt to use it.
      parts.push({
        inlineData: {
          mimeType: 'image/png', // Assuming png for base64 simplicity, model is flexible
          data: referenceImageBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any 
        }
      }
    });

    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Avatar Generation Error:", error);
    throw error;
  }
};

export const modifyAvatar = async (
  baseImageBase64: string, 
  modificationPrompt: string,
  aspectRatio: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // We remove the data URI prefix if it exists
    const cleanBase64 = baseImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Modify the attached image accurately based on this instruction: ${modificationPrompt}. Maintain the character's identity, facial features, and style perfectly. Only change the specific attribute requested (expression, angle, or pose). Photorealistic, high quality.`
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanBase64
            }
          }
        ]
      },
      config: {
        imageConfig: {
           aspectRatio: aspectRatio as any
        }
      }
    });

    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
    }
    throw new Error("No modified image generated");

  } catch (error) {
    console.error("Avatar Modification Error:", error);
    throw error;
  }
}

export const generateProfessionalImage = async (
  prompt: string,
  aspectRatio: string,
  isIconMode: boolean
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Use standard Flash model for general generation
    const model = 'gemini-2.5-flash-image';

    let finalPrompt = prompt;
    if (isIconMode) {
      finalPrompt = `${prompt}. Generate this as a high-quality vector icon, flat design, isolated on a pure white background, no shadow, clean edges, professional icon style.`;
    }

    const config: any = {
      imageConfig: {
        aspectRatio: aspectRatio as any
      }
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: finalPrompt }]
      },
      config: config
    });

    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Professional Image Generation Error:", error);
    throw error;
  }
};

export const remixImage = async (
  baseImageBase64: string,
  remixPrompt: string,
  aspectRatio: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const cleanBase64 = baseImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Flash is good for image-to-image editing
      contents: {
        parts: [
          {
            text: `Edit the image based on this instruction: ${remixPrompt}. Be creative but respect the original composition unless asked to change it.`
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanBase64
            }
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any
        }
      }
    });

    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
    }
    throw new Error("No remix generated");
  } catch (error) {
    console.error("Remix Error:", error);
    throw error;
  }
}

export const expandImage = async (
  imageFile: File,
  targetAspectRatio: string,
  prompt: string = ""
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = await fileToBase64(imageFile);
    const model = 'gemini-2.5-flash-image';

    const systemPrompt = `
      Reframing and Outpainting Task:
      1. Take the input image and place it intelligently within a new canvas of aspect ratio ${targetAspectRatio}.
      2. Expand the scene (outpaint) to fill the new dimensions naturally. 
      3. Maintain the original subject, lighting, style, and high quality.
      4. Make the transition between the original and new areas seamless and realistic.
      ${prompt ? `Additional Context/Instructions: ${prompt}` : ''}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: systemPrompt },
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Data
            }
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: targetAspectRatio as any
        }
      }
    });

    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
    }
    throw new Error("No expanded image generated");
  } catch (error) {
    console.error("Expand Image Error:", error);
    throw error;
  }
};
