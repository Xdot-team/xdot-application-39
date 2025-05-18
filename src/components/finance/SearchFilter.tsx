
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, Download } from "lucide-react";
import { useState } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface SearchFilterProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onFilterApply?: (filters: Record<string, any>) => void;
  filterOptions?: {
    status?: FilterOption[];
    dateRange?: boolean;
    other?: FilterOption[];
  };
  showExport?: boolean;
  onExport?: () => void;
}

export function SearchFilter({
  placeholder = "Search...",
  value,
  onChange,
  onFilterApply,
  filterOptions,
  showExport = false,
  onExport,
}: SearchFilterProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    status: [],
  });
  
  const [dateRange, setDateRange] = useState<{from?: string; to?: string}>({});
  
  const handleFilterSelect = (type: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[type] || [];
      return {
        ...prev,
        [type]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value]
      };
    });
  };
  
  const handleApplyFilters = () => {
    if (onFilterApply) {
      onFilterApply({
        ...selectedFilters,
        dateRange
      });
    }
  };

  return (
    <div className="mb-4 flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-8"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {filterOptions && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              {filterOptions.status && (
                <div className="space-y-2">
                  <h4 className="font-medium">Filter by Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.status.map((option) => (
                      <Badge 
                        key={option.value}
                        variant={selectedFilters.status?.includes(option.value) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleFilterSelect('status', option.value)}
                      >
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {filterOptions.dateRange && (
                <div className="space-y-2">
                  <h4 className="font-medium">Date Range</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1">
                      <label htmlFor="from" className="text-xs">From</label>
                      <Input 
                        id="from" 
                        type="date" 
                        value={dateRange.from || ''} 
                        onChange={(e) => setDateRange(prev => ({...prev, from: e.target.value}))}
                      />
                    </div>
                    <div className="grid gap-1">
                      <label htmlFor="to" className="text-xs">To</label>
                      <Input 
                        id="to" 
                        type="date" 
                        value={dateRange.to || ''}
                        onChange={(e) => setDateRange(prev => ({...prev, to: e.target.value}))}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {filterOptions.other && (
                <div className="space-y-2">
                  <h4 className="font-medium">Other Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.other.map((option) => (
                      <Badge 
                        key={option.value}
                        variant={selectedFilters.other?.includes(option.value) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleFilterSelect('other', option.value)}
                      >
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <Button className="w-full" onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {showExport && (
        <Button variant="outline" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      )}
    </div>
  );
}
