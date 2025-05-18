
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TransactionType = 'income' | 'expense' | 'transfer';

interface TransactionTypeBadgeProps {
  type: TransactionType;
  className?: string;
}

export const getTransactionTypeColor = (type: TransactionType) => {
  switch (type) {
    case 'income': return 'bg-green-100 text-green-800';
    case 'expense': return 'bg-red-100 text-red-800';
    case 'transfer': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function TransactionTypeBadge({ type, className }: TransactionTypeBadgeProps) {
  return (
    <Badge 
      className={cn(getTransactionTypeColor(type), className)}
      variant="outline"
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
}
