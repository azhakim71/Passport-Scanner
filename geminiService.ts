
import { GoogleGenAI, Type } from "@google/genai";
import { PassportData } from "./types";

export const extractPassportInfo = async (base64Data: string, mimeType: string): Promise<PassportData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Extract all visible passport information. Pay special attention to:
            - Full Name (Given name + Surname)
            - Father's and Mother's names
            - Permanent Address
            - Emergency Contact details (Name, Relationship, Address, Phone)
            - Passport No, Dates of Birth/Issue/Expiry, and Place of Birth.
            Return valid JSON.`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          passportNumber: { type: Type.STRING },
          surname: { type: Type.STRING },
          givenNames: { type: Type.STRING },
          fullName: { type: Type.STRING },
          fatherName: { type: Type.STRING },
          motherName: { type: Type.STRING },
          nationality: { type: Type.STRING },
          dateOfBirth: { type: Type.STRING },
          sex: { type: Type.STRING },
          placeOfBirth: { type: Type.STRING },
          permanentAddress: { type: Type.STRING },
          dateOfIssue: { type: Type.STRING },
          dateOfExpiry: { type: Type.STRING },
          issuingAuthority: { type: Type.STRING },
          emergencyContactName: { type: Type.STRING },
          emergencyContactRelation: { type: Type.STRING },
          emergencyContactAddress: { type: Type.STRING },
          emergencyContactPhone: { type: Type.STRING },
        },
      },
    },
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data as PassportData;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Could not parse passport information");
  }
};
