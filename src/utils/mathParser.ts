
/**
 * A simple math expression parser that safely evaluates mathematical expressions
 */

export const evaluateExpression = {
  isCalculation: (text: string): boolean => {
    // Check if the input looks like a calculation
    const calculationRegex = /[0-9]+\s*[\+\-\*\/\^\%\(\)]+/;
    return calculationRegex.test(text);
  },
  
  calculate: (expression: string): string => {
    // Remove all whitespace
    const cleanedExpression = expression.replace(/\s/g, '');
    
    // Validate: only allow numbers, operators and parentheses
    if (!/^[0-9\+\-\*\/\^\%\(\)\.\,]+$/.test(cleanedExpression)) {
      throw new Error("Invalid characters in expression");
    }
    
    try {
      // Use Function constructor instead of eval for better security
      // This is still not 100% secure but better than eval
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + cleanedExpression + ')')();
      
      // Format the result
      if (Number.isInteger(result)) {
        return result.toString();
      } else {
        // Format to a reasonable number of decimals (max 8)
        const formattedResult = parseFloat(result.toFixed(8)).toString();
        return formattedResult;
      }
    } catch (error) {
      throw new Error("Could not evaluate expression");
    }
  }
};
