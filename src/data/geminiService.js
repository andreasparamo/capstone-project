import { genai } from "@google/genai";
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY; //gets the api key

let client = null;

function initializeGemini() {
  if (!GEMINI_API_KEY) {
    console.error("Gemini API unavailable for use!!!!!");
    return false;
  }
  if (!client) {
    client = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });
  }
  return true;
}

export async function generateCodeSnippets(language, difficulty = "medium") {
  if (!initializeGemini()) return null;

  const prompts = {
    c: `Generate a ${difficulty} difficulty C code snippet for a typing test. 
        Requirements:
        - Must be syntactically correct C code
        - Between 5-15 lines of code
        - Include common C patterns (loops, conditionals, functions, or pointers)
        - No comments or explanations, just pure code
        - Must be a complete, compilable snippet
        - Difficulty ${difficulty} means: easy=simple syntax, medium=moderate complexity, hard=advanced concepts
        
        Return ONLY the code, no markdown formatting, no explanations.`,

    cpp: `Generate a ${difficulty} difficulty C++ code snippet for a typing test.
        Requirements:
        - Must be syntactically correct C++ code
        - Between 5-15 lines of code
        - Use modern C++ features (STL, classes, templates for medium/hard)
        - No comments or explanations, just pure code
        - Must be a complete, compilable snippet
        - Difficulty ${difficulty} means: easy=simple syntax, medium=STL usage, hard=templates/smart pointers
        
        Return ONLY the code, no markdown formatting, no explanations.`,

    csharp: `Generate a ${difficulty} difficulty C# code snippet for a typing test.
        Requirements:
        - Must be syntactically correct C# code
        - Between 5-15 lines of code
        - Use common C# patterns (LINQ, properties, async for medium/hard)
        - No comments or explanations, just pure code
        - Must be a complete, compilable snippet
        - Difficulty ${difficulty} means: easy=simple syntax, medium=LINQ/properties, hard=async/generics
        
        Return ONLY the code, no markdown formatting, no explanations.`,
  };

  const prompt = prompts[language] || prompts.c; //default is C

  try {
    const result = await client.models.generateContent({
      model: "gemini-2.0-flash", //rate limitting issue so using the older model
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const generatedText = result.text;

    if (!generatedText) {
      throw new Error("No Content Generated!!!!!!");
    }

    let code = generatedText.trim();
    code = code
      .replace(/```[a-z]*\n/g, "")
      .replace(/```$/g, "")
      .trim();

    return {
      id: `${language}-${Date.now()}`, //creates an ID
      code: code, //clean code
      difficulty,
      description: `Generated ${language.toUpperCase()} snippet`,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error generating snippet with Gemini: ".error);
    return null;
  }
}

export async function generateMultipleSnippets(
  language,
  difficulty,
  count = 5,
) {
  const snippets = [];
  for (let i = 0; i < count; i++) {
    const snippet = await generateCodeSnippets(language, difficulty);
    if (snippet) {
      snippet.push(snippet);
      console.log(
        `Generated ${language} ${difficulty} snippet ${i + 1}/${count}`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 500)); //setting a timer to immitate users
  }
  return snippets;
}

// Test connection
export async function testGeminiConnection() {
  if (!initializeGemini()) {
    return { success: false, message: "API key not configured" };
  }

  try {
    const result = await client.generateContent({
      contents: [
        { role: "user", parts: [{ text: 'Say "Hello, Gemini is working!"' }] },
      ],
    });

    const text = result.response.text();

    return {
      success: true,
      message: "Gemini API connected successfully!",
      response: text,
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`,
    };
  }
}
