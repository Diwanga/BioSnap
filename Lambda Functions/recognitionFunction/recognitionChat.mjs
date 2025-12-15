import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // From Lambda environment variable
});

export async function identifySpecies(imageUrl) {
  const prompt = `
Identify the plant or animal species shown in this image.

Return ONLY a valid, well-formatted JSON object with EXACTLY the following fields and NO extra text:

{
  "type": "",
  "commonName": "",
  "scientificName": "",
  "description": "",
  "confidence": 0.0
}

Field definitions:
- type: Must be either "plant" or "animal"
- commonName: The widely used common name of the species
- scientificName: The correct scientific (binomial) name
- description: A brief description (2-3 sentences) including key traits, natural habitat, and one interesting fact
- confidence: Your confidence level as a number between 0 and 1 (e.g., 0.95 for 95% confident)

STRICT RULES:
- Output MUST be valid JSON only.
- Do NOT include the word "json".
- Do NOT include explanations outside the JSON.
- Do NOT include markdown code blocks.
- Do NOT add any extra fields.
- If unsure, set confidence below 0.5 and provide best guess.
`;

  const response = await client.responses.create({
    model: "gpt-5-nano",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: prompt },
          { type: "input_image", image_url: imageUrl }
        ]
      }
    ]
  });

  const result = response.output_text;

  // Parse and return JSON
  return JSON.parse(result);
}