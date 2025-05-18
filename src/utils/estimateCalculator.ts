
import { EstimateItem } from '@/types/estimates';

/**
 * Calculates the result of a formula in the context of estimate items
 * 
 * @param formula String representation of the formula
 * @param items Array of estimate items that can be referenced in the formula
 * @returns The calculated value
 */
export function calculateFormula(formula: string, items: EstimateItem[]): number {
  // Handle empty formula
  if (!formula) return 0;
  
  // Simple formula evaluation (quantity * unit_price)
  if (formula === 'quantity * unit_price') {
    return 0; // This would be replaced by the actual calculation
  }
  
  // Replace references to other items
  // Example: [item-1.quantity] * [item-2.unitPrice]
  const itemReferenceRegex = /\[([^\]]+)\]/g;
  
  let processedFormula = formula.replace(itemReferenceRegex, (match, reference) => {
    const [itemId, property] = reference.split('.');
    const referencedItem = items.find(item => item.id === itemId);
    
    if (!referencedItem) {
      throw new Error(`Referenced item ${itemId} not found`);
    }
    
    if (!(property in referencedItem)) {
      throw new Error(`Property ${property} not found in item ${itemId}`);
    }
    
    return (referencedItem as any)[property].toString();
  });
  
  // Remove any spaces for evaluation
  processedFormula = processedFormula.replace(/\s/g, '');
  
  // Very simple formula evaluation - for demonstration purposes only
  // In a real app, you would use a proper formula parser like mathjs
  try {
    // Using Function constructor to evaluate math expressions
    // This is typically not recommended for security reasons
    // In production, use a proper math expression parser
    const result = new Function(`return ${processedFormula}`)();
    
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Formula did not evaluate to a valid number');
    }
    
    return result;
  } catch (error) {
    console.error('Formula evaluation error:', error);
    throw new Error('Invalid formula');
  }
}
