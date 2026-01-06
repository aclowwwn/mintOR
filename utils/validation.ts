
import { ExerciseAnswer, ValidationResult } from '../types';

export const validateAnswer = (userInput: string, answer: ExerciseAnswer): ValidationResult => {
  if (!userInput.trim()) {
    return { isCorrect: false, feedback: "Please enter an answer." };
  }

  switch (answer.type) {
    case 'numeric': {
      const userValue = parseFloat(userInput);
      const expectedValue = typeof answer.value === 'number' ? answer.value : parseFloat(answer.value as string);

      if (isNaN(userValue)) {
        return { isCorrect: false, feedback: "Please enter a valid number." };
      }

      const tolerance = answer.tolerance || 0.0001;
      const isCorrect = Math.abs(userValue - expectedValue) <= tolerance;
      
      return {
        isCorrect,
        feedback: isCorrect ? "Correct!" : "Try again. Check your calculations.",
        normalizedUserInput: userValue.toString()
      };
    }

    case 'multiple_choice': {
      const isCorrect = userInput === answer.correctChoiceId;
      return {
        isCorrect,
        feedback: isCorrect ? "Correct!" : "That's not the right choice.",
        normalizedUserInput: userInput
      };
    }

    case 'string': {
      let userStr = userInput;
      let expectedStr = String(answer.value);

      if (answer.trim !== false) {
        userStr = userStr.trim();
        expectedStr = expectedStr.trim();
      }

      const isCorrect = answer.caseSensitive 
        ? userStr === expectedStr 
        : userStr.toLowerCase() === expectedStr.toLowerCase();

      return {
        isCorrect,
        feedback: isCorrect ? "Correct!" : "Incorrect string. Check spelling/case.",
        normalizedUserInput: userStr
      };
    }

    default:
      return { isCorrect: false, feedback: "Unknown validation type." };
  }
};
