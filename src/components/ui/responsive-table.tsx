import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, item: T) => ReactNode;
  className?: string;
  mobileRender?: (item: T) => ReactNode;
  priority?: 'high' | 'medium' | 'low'; // For column hiding on smaller screens
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
  mobileCardClassName?: string;
  emptyMessage?: string;
}

export function ResponsiveTable<T>({
  data,
  columns,
  onRowClick,
  className,
  mobileCardClassName,
  emptyMessage = "No data available"
}: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  const getValue = (item: T, key: keyof T | string) => {
    if (typeof key === 'string' && key.includes('.')) {
      return key.split('.').reduce((obj: any, k) => obj?.[k], item);
    }
    return item[key as keyof T];
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  if (isMobile) {
    // Mobile card view
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <Card 
            key={index} 
            className={cn(
              "cursor-pointer hover:shadow-md transition-shadow",
              mobileCardClassName,
              onRowClick && "hover:bg-muted/50"
            )}
            onClick={() => onRowClick?.(item)}
          >
            <CardContent className="p-4">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="mb-2 last:mb-0">
                  {column.mobileRender ? (
                    column.mobileRender(item)
                  ) : (
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-muted-foreground">
                        {column.title}:
                      </span>
                      <span className="text-sm ml-2 text-right">
                        {column.render ? 
                          column.render(getValue(item, column.key), item) : 
                          String(getValue(item, column.key) || '-')
                        }
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop table view
  const visibleColumns = columns.filter(col => 
    col.priority === 'high' || 
    (col.priority === 'medium' && window.innerWidth >= 768) ||
    (col.priority === 'low' && window.innerWidth >= 1024) ||
    !col.priority
  );

  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full text-sm", className)}>
        <thead>
          <tr className="border-b">
            {visibleColumns.map((column, index) => (
              <th 
                key={index} 
                className={cn(
                  "text-left p-3 font-medium",
                  column.className
                )}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr 
              key={index} 
              className={cn(
                "border-b hover:bg-muted/50 transition-colors",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick?.(item)}
            >
              {visibleColumns.map((column, colIndex) => (
                <td 
                  key={colIndex} 
                  className={cn("p-3", column.className)}
                >
                  {column.render ? 
                    column.render(getValue(item, column.key), item) : 
                    String(getValue(item, column.key) || '-')
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}