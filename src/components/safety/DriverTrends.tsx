import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DriverData, 
  DriverTrendData, 
  VehicleData, 
  TripData,
  ComplianceStatus,
  TrendDirection
} from "@/types/safety";
import { 
  Car, 
  Filter, 
  SortAsc, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Calendar,
  Users,
  Truck,
  BarChart as BarChartIcon,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDriverData, mockVehicleData, mockTripData, mockDriverTrends } from "@/data/mockSafetyData";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

export function DriverTrends() {
  const [drivers] = useState<DriverData[]>(mockDriverData as DriverData[]);
  const [driverTrends] = useState<DriverTrendData[]>(mockDriverTrends as DriverTrendData[]);
  const [vehicles] = useState<VehicleData[]>(mockVehicleData as VehicleData[]);
  const [trips] = useState<TripData[]>(mockTripData as TripData[]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("drivers");
  const [selectedDriver, setSelectedDriver] = useState<string>("all");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("month");
  const [sortBy, setSortBy] = useState<string>("safetyScore");

  const getComplianceStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case "compliant": return "bg-green-100 text-green-800";
      case "minor_issues": return "bg-amber-100 text-amber-800";
      case "major_issues": return "bg-orange-100 text-orange-800";
      case "non_compliant": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendDirectionColor = (direction: TrendDirection) => {
    switch (direction) {
      case "improving": return "bg-green-100 text-green-800";
      case "stable": return "bg-blue-100 text-blue-800";
      case "worsening": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const sortedDriverTrends = [...driverTrends].sort((a, b) => {
    if (sortBy === "safetyScore") return b.safetyScore - a.safetyScore;
    if (sortBy === "mileageDriven") return b.mileageDriven - a.mileageDriven;
    if (sortBy === "incidentRate") return a.incidentRate - b.incidentRate;
    if (sortBy === "riskLevel") {
      const riskOrder = { low: 1, medium: 2, high: 3 };
      return riskOrder[b.riskLevel as "low" | "medium" | "high"] - riskOrder[a.riskLevel as "low" | "medium" | "high"];
    }
    return 0;
  });

  const filteredDriverTrends = sortedDriverTrends.filter(trend => {
    const matchesSearch = trend.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDriver = selectedDriver === "all" || trend.driverId === selectedDriver;
    const matchesPeriod = selectedTimePeriod === "all" || trend.period === selectedTimePeriod;
    
    return matchesSearch && matchesDriver && matchesPeriod;
  });

  const filteredDrivers = drivers.filter(driver => {
    return driver.driverName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredTrips = trips.filter(trip => {
    return (
      trip.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Data for charts
  const safetyScoreData = driverTrends
    .filter(trend => trend.period === selectedTimePeriod || selectedTimePeriod === "all")
    .map(trend => ({
      name: trend.driverName,
      safetyScore: trend.safetyScore,
      mileage: trend.mileageDriven,
      incidentRate: trend.incidentRate * 1000, // Convert to incidents per 1000 miles for better visibility
    }))
    .sort((a, b) => b.safetyScore - a.safetyScore)
    .slice(0, 10);

  const eventTypesData = driverTrends
    .filter(trend => trend.period === selectedTimePeriod || selectedTimePeriod === "all")
    .reduce((acc, trend) => {
      acc[0].value += trend.harshBrakingEvents;
      acc[1].value += trend.harshAccelerationEvents;
      acc[2].value += trend.speedingEvents;
      acc[3].value += trend.distractionEvents;
      acc[4].value += trend.fatigueWarnings;
      return acc;
    }, [
      { name: "Harsh Braking", value: 0 },
      { name: "Harsh Acceleration", value: 0 },
      { name: "Speeding", value: 0 },
      { name: "Distraction", value: 0 },
      { name: "Fatigue", value: 0 }
    ]);

  const mileageByDriverData = driverTrends
    .filter(trend => trend.period === selectedTimePeriod || selectedTimePeriod === "all")
    .map(trend => ({
      name: trend.driverName,
      mileage: trend.mileageDriven
    }))
    .sort((a, b) => b.mileage - a.mileage)
    .slice(0, 10);

  const complianceStatusData = drivers.reduce((acc, driver) => {
    const statusIndex = acc.findIndex(item => item.name === driver.complianceStatus);
    if (statusIndex >= 0) {
      acc[statusIndex].value++;
    }
    return acc;
  }, [
    { name: "compliant", value: 0 },
    { name: "minor_issues", value: 0 },
    { name: "major_issues", value: 0 },
    { name: "non_compliant", value: 0 }
  ]);

  const pieColors = ["#10b981", "#f59e0b", "#f97316", "#ef4444"];

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-1/2">
          <Input
            placeholder="Search drivers, vehicles, or trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default">
            <Car className="h-4 w-4 mr-2" />
            Add Driver
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Driver Performance Summary */}
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Driver Performance Summary</CardTitle>
            <CardDescription>
              Overview of driver safety metrics and performance trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="text-3xl font-bold">{drivers.length}</div>
                  <div className="text-sm text-muted-foreground text-center">Total Drivers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {trips.reduce((total, trip) => total + trip.mileage, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">Total Miles</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="text-3xl font-bold text-amber-600">
                    {trips.filter(trip => trip.incidents && trip.incidents.length > 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">Trips with Incidents</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round(driverTrends.reduce((total, trend) => total + trend.safetyScore, 0) / driverTrends.length)}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">Avg. Safety Score</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Driver Risk Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complianceStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {complianceStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} drivers`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mileage by Driver */}
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Mileage by Driver</CardTitle>
            <CardDescription>
              Top drivers by total mileage driven in selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mileageByDriverData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={70} 
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} miles`, "Mileage"]} />
                  <Bar dataKey="mileage" name="Mileage" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Safety Score vs. Incident Rate</CardTitle>
          <CardDescription>
            Correlation between safety scores and incident rates per 1,000 miles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={safetyScoreData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={70} 
                />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="safetyScore" 
                  name="Safety Score" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="incidentRate" 
                  name="Incidents per 1,000 miles" 
                  stroke="#ef4444" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event Types Distribution</CardTitle>
          <CardDescription>
            Breakdown of different safety events across all drivers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={eventTypesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Events" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Driver Data</CardTitle>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safetyScore">Safety Score</SelectItem>
                  <SelectItem value="mileageDriven">Mileage</SelectItem>
                  <SelectItem value="incidentRate">Incident Rate</SelectItem>
                  <SelectItem value="riskLevel">Risk Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList>
                <TabsTrigger value="trends">Performance Trends</TabsTrigger>
                <TabsTrigger value="drivers">Driver Profiles</TabsTrigger>
                <TabsTrigger value="trips">Trip Data</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabsContent value="trends" className="mt-0">
            <div className="space-y-4">
              {filteredDriverTrends.length > 0 ? (
                filteredDriverTrends.map(trend => (
                  <Card key={trend.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            {trend.riskLevel === "high" && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            <h3 className="font-medium">{trend.driverName}</h3>
                            <span className="text-xs text-muted-foreground">
                              {trend.period === "week" ? "Weekly" :
                               trend.period === "month" ? "Monthly" :
                               trend.period === "quarter" ? "Quarterly" : "Yearly"}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div>
                              <span className="font-medium">Safety Score:</span>{" "}
                              <span className={`${trend.safetyScore > 80 ? 'text-green-600' : trend.safetyScore > 60 ? 'text-amber-600' : 'text-red-600'} font-bold`}>
                                {trend.safetyScore}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Mileage:</span>{" "}
                              {trend.mileageDriven.toLocaleString()} mi
                            </div>
                            <div>
                              <span className="font-medium">Incidents:</span>{" "}
                              {trend.incidentCount} ({(trend.incidentRate * 1000).toFixed(2)} per 1000 mi)
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(trend.startDate).toLocaleDateString()} - {new Date(trend.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 md:flex-col md:items-end">
                          <Badge className={getRiskLevelColor(trend.riskLevel)}>
                            {trend.riskLevel === "low" ? "Low Risk" : 
                             trend.riskLevel === "medium" ? "Medium Risk" : "High Risk"}
                          </Badge>
                          <Badge className={getTrendDirectionColor(trend.trendDirection)}>
                            {trend.trendDirection === "improving" ? (
                              <span className="flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" /> Improving
                              </span>
                            ) : trend.trendDirection === "stable" ? (
                              <span>Stable</span>
                            ) : (
                              <span className="flex items-center">
                                <TrendingDown className="h-3 w-3 mr-1" /> Worsening
                              </span>
                            )}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                          <div className="p-1.5 bg-gray-50 rounded">
                            <span className="font-medium block">Harsh Braking:</span> {trend.harshBrakingEvents}
                          </div>
                          <div className="p-1.5 bg-gray-50 rounded">
                            <span className="font-medium block">Harsh Accel:</span> {trend.harshAccelerationEvents}
                          </div>
                          <div className="p-1.5 bg-gray-50 rounded">
                            <span className="font-medium block">Speeding:</span> {trend.speedingEvents}
                          </div>
                          <div className="p-1.5 bg-gray-50 rounded">
                            <span className="font-medium block">Distraction:</span> {trend.distractionEvents}
                          </div>
                          <div className="p-1.5 bg-gray-50 rounded">
                            <span className="font-medium block">Fatigue:</span> {trend.fatigueWarnings}
                          </div>
                        </div>
                        
                        {trend.improvementSuggestions && trend.improvementSuggestions.length > 0 && (
                          <div className="mt-2 text-xs">
                            <span className="font-medium">Suggestions:</span>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {trend.improvementSuggestions.slice(0, 2).map((suggestion, i) => (
                                <li key={i}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="mt-3 flex flex-wrap justify-between gap-2">
                          <div></div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              Improvement Plan
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No driver trends match your search criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="drivers" className="mt-0">
            <div className="space-y-4">
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map(driver => (
                  <Card key={driver.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                        <div className="space-y-1 flex-1">
                          <h3 className="font-medium">{driver.driverName}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div>
                              <span className="font-medium">License:</span>{" "}
                              {driver.licenseNumber} (Class {driver.licenseClass})
                            </div>
                            <div>
                              <span className="font-medium">Expires:</span>{" "}
                              {new Date(driver.licenseExpiry).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-medium">Endorsements:</span>
                            <div className="flex gap-1">
                              {driver.endorsements.map((endorsement, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {endorsement}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <Badge className={getComplianceStatusColor(driver.complianceStatus)}>
                          {driver.complianceStatus.replace("_", " ")}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-border">
                        <h4 className="text-sm font-medium mb-2">Training Completed</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {driver.trainingCompleted.slice(0, 3).map(training => (
                            <div key={training.id} className="text-xs p-2 bg-gray-50 rounded">
                              <div className="font-medium">{training.name}</div>
                              <div className="text-muted-foreground">
                                Completed: {new Date(training.completionDate).toLocaleDateString()}
                              </div>
                              {training.expiryDate && (
                                <div className="text-muted-foreground">
                                  Expires: {new Date(training.expiryDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-3 flex flex-wrap justify-between gap-2">
                          <div className="text-xs text-muted-foreground">
                            Last reviewed: {new Date(driver.lastReviewDate).toLocaleDateString()}
                            {driver.reviewedBy && ` by ${driver.reviewedBy}`}
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit Data
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No drivers match your search criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trips" className="mt-0">
            <div className="space-y-4">
              {filteredTrips.length > 0 ? (
                filteredTrips.slice(0, 10).map(trip => (
                  <Card key={trip.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            {trip.incidents && trip.incidents.length > 0 && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            <h3 className="font-medium">{trip.driverName}</h3>
                            <span className="text-xs text-muted-foreground">
                              {new Date(trip.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {trip.startLocation} to {trip.endLocation}
                            </div>
                            <div>
                              <span className="font-medium">Distance:</span>{" "}
                              {trip.mileage.toLocaleString()} mi
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Purpose:</span> {trip.purpose}
                            {trip.projectName && ` (Project: ${trip.projectName})`}
                          </div>
                        </div>
                        
                        <div>
                          {trip.incidents && trip.incidents.length > 0 ? (
                            <Badge className="bg-red-100 text-red-800">
                              {trip.incidents.length} Incident{trip.incidents.length > 1 ? 's' : ''}
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">
                              No Incidents
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {trip.incidents && trip.incidents.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <h4 className="text-sm font-medium mb-2">Incidents</h4>
                          <div className="space-y-2">
                            {trip.incidents.map(incident => (
                              <div key={incident.id} className="text-xs p-2 bg-red-50 rounded border border-red-100">
                                <div className="font-medium">{incident.type.replace("_", " ")}</div>
                                <div>{incident.description}</div>
                                <div className="text-muted-foreground">
                                  Location: {incident.location}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 pt-3 border-t border-border flex justify-end">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No trips match your search criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
}
