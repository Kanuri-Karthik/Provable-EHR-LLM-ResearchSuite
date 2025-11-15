// FIX: Re-implemented all AI-related functions using the @google/genai SDK to restore application features.
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import type { ProvenanceResult } from '../types';
import { GEMINI_API_KEY } from '../config';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// FIX: Changed parameter type from `File` to `Blob` to make the function more versatile.
// This resolves an error in AudioTranscription.tsx where a Blob was passed.
export const fileToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

export const generateProvenanceSummary = async (ehrData: string): Promise<ProvenanceResult> => {
    const model = 'gemini-2.5-flash';
    const prompt = `Summarize the following EHR data. For each sentence in the summary, identify the exact text from the source that supports it.
    EHR Data:
    ${ehrData}
    
    Provide the output in the specified JSON format.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: {
                        type: Type.STRING,
                        description: 'A concise summary of the EHR data.'
                    },
                    provenance: {
                        type: Type.ARRAY,
                        description: 'An array of objects linking summary text to its source.',
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                text: {
                                    type: Type.STRING,
                                    description: 'A sentence or phrase from the summary.'
                                },
                                source: {
                                    type: Type.STRING,
                                    description: 'The corresponding source text from the EHR data.'
                                }
                            },
                            required: ['text', 'source']
                        }
                    }
                },
                required: ['summary', 'provenance']
            }
        }
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as ProvenanceResult;
    } catch (e) {
        console.error("Failed to parse Gemini response as JSON:", jsonText);
        throw new Error("The model returned an invalid JSON format.");
    }
};

export const deidentifyText = async (text: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const prompt = `De-identify the following text by replacing all Personally Identifiable Information (PII) such as names, dates of birth, phone numbers, addresses, and emails with placeholders like [NAME], [DOB], [PHONE], [ADDRESS], and [EMAIL].
    
    Original text:
    ${text}
    
    De-identified text:`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });

    return response.text;
};

export const generateMultimodalSummary = async (notes: string, vitals: string, imageBase64: string, imageMimeType: string): Promise<string> => {
    const model = 'gemini-2.5-pro';
    
    const textPart = {
        text: `Analyze the following patient data, including clinical notes, vital signs CSV, and a medical image, to generate a longitudinal insight summary.
        
        Clinical Notes:
        ${notes}
        
        Vitals (CSV):
        ${vitals}`
    };

    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: imageMimeType,
        }
    };

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [textPart, imagePart] }
    });

    return response.text;
};

export const checkMultilingualConsistency = async (note: string, language: string): Promise<{ score: number; translation: string; explanation: string }> => {
    const model = 'gemini-2.5-flash';
    const prompt = `The following clinical note is in ${language}.
    1. Translate it to English.
    2. Assess the faithfulness of the original note compared to a standard English clinical note. A standard note should be clear, concise, and contain key sections like subjective, objective, assessment, and plan.
    3. Provide a consistency score from 0 to 100, where 100 is perfectly faithful and consistent.
    4. Provide a brief explanation for the score.
    
    Original Note:
    ${note}`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    translation: {
                        type: Type.STRING,
                        description: "The English translation of the note."
                    },
                    score: {
                        type: Type.INTEGER,
                        description: "The consistency score from 0 to 100."
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "The explanation for the score."
                    }
                },
                required: ["translation", "score", "explanation"]
            }
        }
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse multilingual consistency response:", jsonText);
        throw new Error("The model returned an invalid JSON format for consistency check.");
    }
};

export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    const model = 'imagen-4.0-generate-001';

    const response = await ai.models.generateImages({
        model,
        prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio,
        }
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
};

export const groundedQuery = async (query: string): Promise<{ answer: string; sources: any[] }> => {
    const model = 'gemini-2.5-flash';
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: query,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const answer = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

    return { answer, sources };
};

export const analyzeVideo = async (frames: { data: string, mimeType: string }[], prompt: string): Promise<string> => {
    const model = 'gemini-2.5-pro';
    
    // FIX: Correctly construct the `parts` array with both text and image data.
    // This resolves a TypeScript error where the array was inferred to only contain one type.
    const parts = [
        { text: prompt },
        ...frames.map(frame => ({
            inlineData: {
                data: frame.data,
                mimeType: frame.mimeType
            }
        }))
    ];
    
    const response = await ai.models.generateContent({
        model,
        contents: { parts }
    });

    return response.text;
};

export const transcribeAudio = async (audioBase64: string, audioMimeType: string): Promise<string> => {
    const model = 'gemini-2.5-pro';

    const audioPart = {
        inlineData: {
            data: audioBase64,
            mimeType: audioMimeType
        }
    };
    
    const promptPart = {
        text: "Transcribe the following audio recording."
    };

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [promptPart, audioPart] }
    });

    return response.text;
};

export const generateSpeech = async (text: string): Promise<string> => {
    const model = 'gemini-2.5-flash-preview-tts';
    
    const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data received from API.");
    }
    return base64Audio;
};

export const transcribeAndTranslate = async (
    audioBase64: string,
    audioMimeType: string,
    targetLanguage: string
): Promise<{ originalTranscription: string; translatedText: string; }> => {
    const model = 'gemini-2.5-pro';

    const audioPart = { inlineData: { data: audioBase64, mimeType: audioMimeType } };
    const promptPart = {
        text: `1. First, provide a precise transcription of the following audio.
               2. Second, translate the transcription into ${targetLanguage}.`
    };

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [promptPart, audioPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    originalTranscription: {
                        type: Type.STRING,
                        description: "The verbatim transcription of the original audio."
                    },
                    translatedText: {
                        type: Type.STRING,
                        description: `The translation of the transcription into ${targetLanguage}.`
                    }
                },
                required: ["originalTranscription", "translatedText"]
            }
        }
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse transcription/translation response:", jsonText);
        throw new Error("The model returned an invalid JSON format for the translation.");
    }
};