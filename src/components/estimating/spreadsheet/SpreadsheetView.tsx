
import { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EstimateItem, EstimateItemCategory } from '@/types/estimates';
import { calculateFormula } from '@/utils/estimateCalculator';
import { Copy, Trash, Plus } from 'lucide-react';

interface SpreadsheetViewProps {
  items: EstimateItem[];
  onItemUpdate: (updatedItem: EstimateItem) => void;
  errors: {id: string, message: string}[];
}

const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  items,
  onItemUpdate,
  errors
}) => {
  const [activeCell, setActiveCell] = useState<{rowId: string, column: string} | null>(null);
  const [editValue, setEditValue] = useState<string | number>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLButtonElement>(null);

  // Column definitions for our spreadsheet
  const columns = [
    { id: 'description', name: 'Description', editable: true, type: 'text' },
    { id: 'category', name: 'Category', editable: true, type: 'select' },
    { id: 'quantity', name: 'Quantity', editable: true, type: 'number' },
    { id: 'unit', name: 'Unit', editable: true, type: 'text' },
    { id: 'unitPrice', name: 'Unit Price ($)', editable: true, type: 'number' },
    { id: 'formula', name: 'Formula', editable: true, type: 'text' },
    { id: 'totalPrice', name: 'Total', editable: false, type: 'currency' },
    { id: 'actions', name: 'Actions', editable: false, type: 'actions' }
  ];

  useEffect(() => {
    // Focus input when cell becomes active
    if (activeCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeCell]);

  const handleCellClick = (rowId: string, column: string, value: any) => {
    if (columns.find(col => col.id === column)?.editable) {
      setActiveCell({ rowId, column });
      setEditValue(value);
    }
  };

  const handleCellKeyDown = (e: React.KeyboardEvent) => {
    if (!activeCell) return;

    if (e.key === 'Enter' || e.key === 'Tab') {
      // Save the cell value
      saveCell();
      
      // Determine next focus cell
      const columnIndex = columns.findIndex(col => col.id === activeCell.column);
      const rowIndex = items.findIndex(item => item.id === activeCell.rowId);
      
      if (e.key === 'Enter') {
        // Move down
        if (rowIndex < items.length - 1) {
          const nextRow = items[rowIndex + 1];
          setActiveCell({ rowId: nextRow.id, column: activeCell.column });
          const value = (nextRow as any)[activeCell.column];
          setEditValue(value !== undefined ? value : '');
        } else {
          setActiveCell(null);
        }
      } else if (e.key === 'Tab') {
        e.preventDefault(); // Prevent tab from changing focus
        
        // Move right
        if (columnIndex < columns.length - 2) { // -2 because last column is actions
          let nextCol = columns[columnIndex + 1];
          // Skip columns that are not editable
          while (nextCol && !nextCol.editable) {
            nextCol = columns[columns.indexOf(nextCol) + 1];
          }
          
          if (nextCol) {
            setActiveCell({ rowId: activeCell.rowId, column: nextCol.id });
            const value = (items.find(item => item.id === activeCell.rowId) as any)[nextCol.id];
            setEditValue(value !== undefined ? value : '');
          } else {
            setActiveCell(null);
          }
        } else {
          // Move to first column of next row
          if (rowIndex < items.length - 1) {
            const nextRow = items[rowIndex + 1];
            const firstEditableCol = columns.find(col => col.editable);
            if (firstEditableCol) {
              setActiveCell({ rowId: nextRow.id, column: firstEditableCol.id });
              const value = (nextRow as any)[firstEditableCol.id];
              setEditValue(value !== undefined ? value : '');
            }
          } else {
            setActiveCell(null);
          }
        }
      }
    } else if (e.key === 'Escape') {
      // Cancel editing
      setActiveCell(null);
    }
  };

  const saveCell = () => {
    if (!activeCell) return;

    const item = items.find(item => item.id === activeCell.rowId);
    if (!item) return;

    let newValue: any = editValue;
    
    // Convert string to number for numeric fields
    if (columns.find(col => col.id === activeCell.column)?.type === 'number') {
      newValue = parseFloat(editValue.toString());
      if (isNaN(newValue)) {
        toast.error("Please enter a valid number");
        return;
      }
    }

    // Update the item
    const updatedItem = { ...item, [activeCell.column]: newValue };
    
    // Calculate total price if quantity or unit price changed
    if (activeCell.column === 'quantity' || activeCell.column === 'unitPrice') {
      updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
    }

    // If formula changed, try to evaluate it
    if (activeCell.column === 'formula' && updatedItem.formula) {
      try {
        const result = calculateFormula(updatedItem.formula, items);
        if (typeof result === 'number') {
          updatedItem.totalPrice = result;
        }
      } catch (err) {
        // Formula error will be caught by error checker
      }
    }

    onItemUpdate(updatedItem);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleSelectChange = (value: string) => {
    setEditValue(value);
    
    if (activeCell) {
      const item = items.find(item => item.id === activeCell.rowId);
      if (item) {
        const updatedItem = { ...item, [activeCell.column]: value };
        onItemUpdate(updatedItem);
        setActiveCell(null);
      }
    }
  };

  const duplicateRow = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    if (item) {
      const newItem = {
        ...item,
        id: `item-${Date.now()}`
      };
      onItemUpdate(newItem); // This will add the new item
      toast.success("Row duplicated");
    }
  };

  const getErrorsForCell = (itemId: string, column: string) => {
    return errors.filter(error => 
      error.id === itemId && 
      ((column === 'quantity' && error.message.includes('quantity')) ||
       (column === 'unitPrice' && error.message.includes('unit price')) ||
       (column === 'description' && error.message.includes('Description')) ||
       (column === 'formula' && error.message.includes('Formula')))
    );
  };

  return (
    <div className="spreadsheet-view">
      <Table>
        <TableHeader className="sticky top-0 bg-muted z-10">
          <TableRow>
            {columns.map(column => (
              <TableHead key={column.id} className={
                column.id === 'totalPrice' ? "text-right" : 
                column.id === 'quantity' || column.id === 'unitPrice' ? "text-right" : ""
              }>
                {column.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id} className="group">
              {columns.map(column => {
                const cellErrors = getErrorsForCell(item.id, column.id);
                const isEditing = activeCell?.rowId === item.id && activeCell?.column === column.id;
                const value = (item as any)[column.id];

                return (
                  <TableCell 
                    key={`${item.id}-${column.id}`}
                    className={cn(
                      "group-hover:bg-muted/50 relative",
                      isEditing && "p-0 align-middle",
                      column.id === 'totalPrice' && "text-right font-medium",
                      column.id === 'quantity' || column.id === 'unitPrice' ? "text-right" : "",
                      cellErrors.length > 0 && "bg-yellow-50"
                    )}
                    onClick={() => handleCellClick(item.id, column.id, value)}
                  >
                    {isEditing ? (
                      column.type === 'select' ? (
                        <div className="p-0">
                          <Select
                            value={editValue.toString()}
                            onValueChange={handleSelectChange}
                          >
                            <SelectTrigger ref={selectRef} className="border-0 h-full rounded-none focus:ring-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="material">Material</SelectItem>
                              <SelectItem value="labor">Labor</SelectItem>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="subcontractor">Subcontractor</SelectItem>
                              <SelectItem value="overhead">Overhead</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <Input
                          ref={inputRef}
                          className="border-0 h-full rounded-none focus:ring-0"
                          value={editValue}
                          onChange={handleInputChange}
                          onKeyDown={handleCellKeyDown}
                          onBlur={saveCell}
                          type={column.type === 'number' ? 'number' : 'text'}
                          step={column.type === 'number' ? '0.01' : undefined}
                        />
                      )
                    ) : column.id === 'actions' ? (
                      <div className="flex items-center justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => duplicateRow(item.id)}
                          className="h-7 w-7 p-0"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : column.id === 'totalPrice' ? (
                      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
                    ) : column.id === 'category' ? (
                      <span className="capitalize">{value}</span>
                    ) : (
                      value || ''
                    )}
                    
                    {!isEditing && cellErrors.length > 0 && (
                      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-yellow-500 text-xs">
                        ⚠️
                      </div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
          
          {/* Add new row button */}
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full h-8 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add New Row
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default SpreadsheetView;
