
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface SortableTableColumn<T> {
  key: string | keyof T;  // Modified to accept string or keyof T
  header: string;
  cell: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface SortableTableProps<T> {
  columns: SortableTableColumn<T>[];
  data: T[];
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
  emptyMessage?: string;
}

export function SortableTable<T>({ 
  columns, 
  data, 
  sortConfig, 
  onSort,
  emptyMessage = "No data available"
}: SortableTableProps<T>) {
  
  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-1 h-4 w-4" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="ml-1 h-4 w-4" />
      : <ArrowDown className="ml-1 h-4 w-4" />;
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.key.toString()}
                className={column.sortable ? "cursor-pointer" : ""}
                onClick={() => column.sortable && onSort(column.key.toString())}
              >
                <div className="flex items-center">
                  {column.header}
                  {column.sortable && getSortIcon(column.key.toString())}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={`${i}-${column.key.toString()}`}>
                    {column.cell(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
