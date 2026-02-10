export const CODE_SNIPPETS = {
  c: [
    {
      id: "c-001",
      code: '#include <stdio.h>\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}',
      difficulty: "easy",
      description: "Hello World in C",
    },
    {
      id: "c-002",
      code: "int sum = 0;\nfor(int i = 0; i < 10; i++) {\n    sum += i;\n}",
      difficulty: "easy",
      description: "For loop in C",
    },
    {
      id: "c-003",
      code: "int factorial(int n) {\n    if(n <= 1) return 1;\n    return n * factorial(n - 1);\n}",
      difficulty: "medium",
      description: "Recursive factorial",
    },
  ],
  cpp: [
    {
      id: "cpp-001",
      code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}',
      difficulty: "easy",
      description: "Hello World in C++",
    },
  ],
  csharp: [
    {
      id: "cs-001",
      code: 'using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello World");\n    }\n}',
      difficulty: "easy",
      description: "Hello World in C#",
    },
  ],
};

// Get random snippet from a language
export function getRandomSnippet(language = "c") {
  const snippets = CODE_SNIPPETS[language] || CODE_SNIPPETS.c;
  return snippets[Math.floor(Math.random() * snippets.length)];
}

// Get all available languages
export function getAllLanguages() {
  return Object.keys(CODE_SNIPPETS);
}

// Get snippet by difficulty
export function getSnippetByDifficulty(language, difficulty) {
  const snippets = CODE_SNIPPETS[language] || CODE_SNIPPETS.c;
  const filtered = snippets.filter((s) => s.difficulty === difficulty);
  return (
    filtered[Math.floor(Math.random() * filtered.length)] ||
    getRandomSnippet(language)
  );
}
