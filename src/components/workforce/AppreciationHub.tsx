import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Plus, ThumbsUp, Heart, Award } from "lucide-react";
import { mockAppreciations } from "@/data/mockWorkforceData";
import { EmployeeAppreciation } from "@/types/workforce";
import { formatDate } from "@/lib/formatters";

export function AppreciationHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const [appreciations, setAppreciations] = useState<EmployeeAppreciation[]>(mockAppreciations);

  const filteredAppreciations = appreciations.filter(
    (appreciation) =>
      appreciation.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appreciation.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appreciation.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAppreciationIcon = (type: string) => {
    switch (type) {
      case "performance":
        return <Award className="h-5 w-5 text-amber-500" />;
      case "safety":
        return <Badge className="h-5 w-5 text-green-600" />;
      case "teamwork":
        return <Heart className="h-5 w-5 text-red-500" />;
      default:
        return <ThumbsUp className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAppreciationTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appreciations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Appreciation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppreciations.map((appreciation) => (
          <Card key={appreciation.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {appreciation.employeeName.split(" ").map(name => name[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{appreciation.employeeName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(appreciation.date)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getAppreciationIcon(appreciation.type)}
                  <span className="ml-1">{getAppreciationTypeLabel(appreciation.type)}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">"{appreciation.message}"</p>
            </CardContent>
            <CardFooter className="pt-2 text-xs text-muted-foreground flex justify-between items-center">
              <div>From: {appreciation.givenByName}</div>
              <div className="flex gap-2 items-center">
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
