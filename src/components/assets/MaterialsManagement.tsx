import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Package, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const mockMaterials = [
  { id: "MAT-001", name: "Asphalt Mix Type B", category: "Asphalt", quantity: 250, unit: "tons", location: "North Yard", status: "in-stock" },
  { id: "MAT-002", name: "Crushed Stone #57", category: "Aggregate", quantity: 500, unit: "tons", location: "South Yard", status: "in-stock" },
  { id: "MAT-003", name: "Portland Cement", category: "Concrete", quantity: 80, unit: "pallets", location: "West Warehouse", status: "low-stock" },
  { id: "MAT-004", name: "Steel Rebar #4", category: "Steel", quantity: 5000, unit: "feet", location: "Main Warehouse", status: "in-stock" },
];

export function MaterialsManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock": return "success";
      case "low-stock": return "warning";
      case "out-of-stock": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-stock": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "low-stock": return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "out-of-stock": return <Clock className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Material
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">835</div>
            <p className="text-xs text-muted-foreground">Items in inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">672</div>
            <p className="text-xs text-muted-foreground">Available items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">23</div>
            <p className="text-xs text-muted-foreground">Need reorder</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-muted-foreground">Urgent reorder</p>
          </CardContent>
        </Card>
      </div>

      {/* Materials Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Materials Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{material.name}</p>
                      <p className="text-sm text-muted-foreground">{material.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>{material.category}</TableCell>
                  <TableCell>{material.quantity} {material.unit}</TableCell>
                  <TableCell>{material.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(material.status)}
                      <Badge variant={getStatusColor(material.status) as any}>
                        {material.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}