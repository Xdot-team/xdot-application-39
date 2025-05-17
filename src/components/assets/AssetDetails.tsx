
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, Edit, MapPin, Tool, Truck, User, Wrench } from 'lucide-react';
import { Vehicle, Tool as ToolType, Material } from '@/types/field';
import { Badge } from '@/components/ui/badge';

interface AssetDetailsProps {
  asset: Vehicle | ToolType | Material;
  onBack: () => void;
}

export const AssetDetails = ({ asset, onBack }: AssetDetailsProps) => {
  // Determine the asset type
  const isVehicle = 'make' in asset;
  const isTool = 'brand' in asset;
  const isMaterial = 'quantity' in asset && 'unit' in asset;

  // Common status colors
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'in-use': return 'bg-blue-500';
      case 'available': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const renderVehicleDetails = (vehicle: Vehicle) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Make:</span>
                  <span>{vehicle.make}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Model:</span>
                  <span>{vehicle.model}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Year:</span>
                  <span>{vehicle.year}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">VIN:</span>
                  <span>{vehicle.vin}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">License Plate:</span>
                  <span>{vehicle.licensePlate}</span>
                </div>
                {vehicle.mileage && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Mileage:</span>
                    <span>{vehicle.mileage.toLocaleString()} {vehicle.type === 'Excavator' || vehicle.type === 'Grader' || vehicle.type === 'Paver' ? 'hours' : 'miles'}</span>
                  </div>
                )}
                {vehicle.fuelLevel !== undefined && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Fuel Level:</span>
                    <div className="flex items-center">
                      <div className="w-24 h-3 bg-gray-200 rounded-full mr-2">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${vehicle.fuelLevel * 100}%` }}></div>
                      </div>
                      <span>{Math.round(vehicle.fuelLevel * 100)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status & Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Status:</span>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(vehicle.status)}`} />
                    <span className="capitalize">{vehicle.status.replace('-', ' ')}</span>
                  </div>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Current Project:</span>
                  <span>{vehicle.currentProject || 'None'}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Assigned To:</span>
                  <span>{vehicle.assignedTo || 'Unassigned'}</span>
                </div>
                {vehicle.currentLocation && (
                  <>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">GPS Location:</span>
                      <span>
                        {vehicle.currentLocation.lat.toFixed(5)}, {vehicle.currentLocation.lng.toFixed(5)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Last Update:</span>
                      <span>
                        {new Date(vehicle.currentLocation.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
              {vehicle.currentLocation && (
                <div className="mt-4 h-32 bg-blue-100 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-700" />
                    <p className="text-sm text-blue-700">Map view would show location here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Last Maintenance:</span>
                <span>{formatDate(vehicle.lastMaintenance)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Next Scheduled Maintenance:</span>
                <span className={`${new Date(vehicle.nextMaintenance || '') <= new Date('2025-06-01') ? 'text-amber-600 font-medium' : ''}`}>
                  {formatDate(vehicle.nextMaintenance)}
                </span>
              </div>
              <div className="space-y-2 mt-4">
                <p className="text-sm text-muted-foreground">Maintenance Records:</p>
                {vehicle.maintenanceHistory && vehicle.maintenanceHistory.length > 0 ? (
                  vehicle.maintenanceHistory.map((record, index) => (
                    <div key={index} className="text-sm border-l-2 border-blue-500 pl-3 py-2">
                      <p className="font-medium">{formatDate(record.date)}</p>
                      <p>{record.description}</p>
                      <p className="text-xs text-muted-foreground">Performed by: {record.performedBy} | Cost: ${record.cost.toFixed(2)}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic py-2">No detailed maintenance records available</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderToolDetails = (tool: ToolType) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Tool Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Type:</span>
              <span>{tool.type}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Brand:</span>
              <span>{tool.brand}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Model:</span>
              <span>{tool.model || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Serial Number:</span>
              <span>{tool.serialNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Status:</span>
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(tool.status)}`} />
                <span className="capitalize">{tool.status.replace('-', ' ')}</span>
              </div>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Current Location:</span>
              <span>{tool.currentLocation || 'Unknown'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Assigned To:</span>
              <span>{tool.assignedTo || 'Unassigned'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Last Maintenance:</span>
              <span>{formatDate(tool.lastMaintenance)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Next Maintenance:</span>
              <span>{formatDate(tool.nextMaintenance)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Checkout History</CardTitle>
        </CardHeader>
        <CardContent>
          {tool.checkoutHistory && tool.checkoutHistory.length > 0 ? (
            <div className="space-y-3">
              {tool.checkoutHistory.map((checkout, index) => (
                <div key={index} className="border-l-2 border-blue-500 pl-3 py-1">
                  <p className="font-medium text-sm">
                    {formatDate(checkout.checkedOutDate)}
                    {checkout.returnDate ? ` to ${formatDate(checkout.returnDate)}` : ' (not returned)'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Checked out by: {checkout.checkedOutBy}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Project: {checkout.projectId}
                  </p>
                  {checkout.notes && <p className="text-xs mt-1">{checkout.notes}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No checkout history available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderMaterialDetails = (material: Material) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Material Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Category:</span>
              <span>{material.category}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Quantity:</span>
              <span>{material.quantity} {material.unit}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Location:</span>
              <span>{material.location}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Minimum Stock Level:</span>
              <span>{material.minimumStock || 'Not specified'} {material.minimumStock ? material.unit : ''}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Stock Status:</span>
              <div className="flex items-center">
                {material.minimumStock && material.quantity <= material.minimumStock ? (
                  <>
                    <div className="h-2 w-2 rounded-full mr-2 bg-amber-500" />
                    <span>Low Stock</span>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 rounded-full mr-2 bg-green-500" />
                    <span>In Stock</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Supply Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Supplier:</span>
              <span>{material.supplier || 'Not specified'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Unit Cost:</span>
              <span>${material.cost?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Total Value:</span>
              <span>${material.cost ? (material.cost * material.quantity).toFixed(2) : 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Last Order Date:</span>
              <span>{formatDate(material.lastOrderDate)}</span>
            </div>
            {material.notes && (
              <div className="mt-4">
                <p className="text-sm font-medium">Notes:</p>
                <p className="text-sm text-muted-foreground">{material.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div>
            <h2 className="text-2xl font-bold">{asset.name}</h2>
            <p className="text-muted-foreground">
              {isVehicle ? (asset as Vehicle).make + ' ' + (asset as Vehicle).model : 
               isTool ? (asset as ToolType).brand + (asset as ToolType).model ? ' ' + (asset as ToolType).model : '' : 
               (asset as Material).category}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant={
            isVehicle || isTool ? 
              (asset as Vehicle | ToolType).status === 'in-use' ? 'default' :
              (asset as Vehicle | ToolType).status === 'available' ? 'success' :
              (asset as Vehicle | ToolType).status === 'maintenance' ? 'warning' :
              'destructive' 
            : 
            (asset as Material).minimumStock && (asset as Material).quantity <= (asset as Material).minimumStock ? 
              'warning' : 'success'
          }>
            {isVehicle || isTool ? 
              (asset as Vehicle | ToolType).status === 'in-use' ? 'In Use' :
              (asset as Vehicle | ToolType).status === 'available' ? 'Available' :
              (asset as Vehicle | ToolType).status === 'maintenance' ? 'Maintenance' :
              'Offline' 
            : 
            (asset as Material).minimumStock && (asset as Material).quantity <= (asset as Material).minimumStock ? 
              'Low Stock' : 'In Stock'
            }
          </Badge>

          <Button variant="outline" size="sm" className="ml-2">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {isVehicle && (
            <>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">Year: {(asset as Vehicle).year}</span>
              </div>
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">Type: {(asset as Vehicle).type}</span>
              </div>
            </>
          )}
          {isTool && (
            <>
              <div className="flex items-center">
                <Tool className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">Type: {(asset as ToolType).type}</span>
              </div>
            </>
          )}
          {isMaterial && (
            <>
              <div className="flex items-center">
                <span className="text-sm">{(asset as Material).quantity} {(asset as Material).unit}</span>
              </div>
            </>
          )}
          {((isVehicle && (asset as Vehicle).assignedTo) || (isTool && (asset as ToolType).assignedTo)) && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">
                Assigned to: {isVehicle ? (asset as Vehicle).assignedTo : (asset as ToolType).assignedTo}
              </span>
            </div>
          )}
          {isVehicle && (asset as Vehicle).lastMaintenance && (
            <div className="flex items-center">
              <Wrench className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">
                Last maintenance: {formatDate((asset as Vehicle).lastMaintenance)}
              </span>
            </div>
          )}
          {isTool && (asset as ToolType).lastMaintenance && (
            <div className="flex items-center">
              <Wrench className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">
                Last maintenance: {formatDate((asset as ToolType).lastMaintenance)}
              </span>
            </div>
          )}
        </div>
      </div>

      {isVehicle && renderVehicleDetails(asset as Vehicle)}
      {isTool && renderToolDetails(asset as ToolType)}
      {isMaterial && renderMaterialDetails(asset as Material)}

      <CardFooter className="justify-between pt-6 border-t mt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
      </CardFooter>
    </div>
  );
};
