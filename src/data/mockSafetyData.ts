import { 
  SafetyIncident, 
  Hazard, 
  SafetyTraining, 
  SafetyCompliance, 
  Risk,
  DriverData,
  VehicleData,
  TripData,
  DriverTrendData,
  ToolboxMeetingData,
  ToolboxMeetingTemplate
} from "@/types/safety";

export const mockSafetyIncidents: SafetyIncident[] = [
  {
    id: "1",
    title: "Slip and Fall Incident",
    description: "An employee slipped on a wet floor and fell.",
    date: "2023-01-15",
    location: "Warehouse",
    reportedBy: "John Doe",
    severity: "medium",
    status: "reported",
    oshaReportable: true,
  },
  {
    id: "2",
    title: "Forklift Collision",
    description: "A forklift collided with a stationary object.",
    date: "2023-02-10",
    location: "Loading Dock",
    reportedBy: "Jane Smith",
    severity: "high",
    status: "investigating",
    oshaReportable: true,
  },
];

export const mockHazards: Hazard[] = [
  {
    id: "1",
    type: "fall",
    description: "Potential slip hazard due to wet floors.",
    location: "Warehouse",
    reportedBy: "John Doe",
    reportedDate: "2023-01-10",
    severity: "medium",
    status: "active",
  },
  {
    id: "2",
    type: "chemical",
    description: "Chemical spill in the storage area.",
    location: "Chemical Storage",
    reportedBy: "Jane Smith",
    reportedDate: "2023-02-05",
    severity: "high",
    status: "mitigated",
  },
];

export const mockSafetyTrainings: SafetyTraining[] = [
  {
    id: "1",
    title: "Forklift Safety Training",
    description: "Training for safe operation of forklifts.",
    requiredFor: ["Warehouse Staff"],
    frequency: "annually",
    duration: 120,
    certificationProduced: true,
  },
  {
    id: "2",
    title: "Hazardous Materials Handling",
    description: "Training on handling hazardous materials safely.",
    requiredFor: ["Chemical Handlers"],
    frequency: "biannually",
    duration: 90,
    certificationProduced: true,
  },
];

export const mockSafetyCompliances: SafetyCompliance[] = [
  {
    id: "1",
    standard: "OSHA 1910.178",
    description: "Standards for powered industrial trucks.",
    applicableTo: ["Warehouse Staff"],
    checklistItems: [
      {
        id: "1",
        description: "Forklift operators must be trained.",
        required: true,
        status: "compliant",
      },
      {
        id: "2",
        description: "Forklifts must be inspected daily.",
        required: true,
        status: "non-compliant",
      },
    ],
    nextReviewDate: "2023-12-01",
  },
  {
    id: "2",
    standard: "OSHA 1910.1200",
    description: "Hazard Communication Standard.",
    applicableTo: ["Chemical Handlers"],
    checklistItems: [
      {
        id: "1",
        description: "Safety Data Sheets must be available.",
        required: true,
        status: "compliant",
      },
      {
        id: "2",
        description: "Employees must be trained on hazards.",
        required: true,
        status: "compliant",
      },
    ],
    nextReviewDate: "2024-01-15",
  },
];

export const mockRisks: Risk[] = [
  {
    id: "1",
    title: "Forklift Operation Risk",
    description: "Risk of accidents during forklift operation.",
    category: "safety",
    probability: "high",
    impact: "significant",
    riskScore: 15,
    status: "identified",
    dateIdentified: "2023-01-10",
    reportedBy: "John Doe",
    source: "manual-entry",
    isHighPriority: true,
  },
  {
    id: "2",
    title: "Chemical Exposure Risk",
    description: "Risk of exposure to hazardous chemicals.",
    category: "safety",
    probability: "medium",
    impact: "moderate",
    riskScore: 10,
    status: "analyzing",
    dateIdentified: "2023-02-01",
    reportedBy: "Jane Smith",
    source: "ai-prediction",
    isHighPriority: false,
  },
];

export const mockDriverRisks: Risk[] = [
  {
    id: "1",
    title: "Speeding Risk",
    description: "Risk of drivers exceeding speed limits.",
    category: "driver",
    probability: "high",
    impact: "significant",
    riskScore: 18,
    status: "identified",
    dateIdentified: "2023-01-20",
    reportedBy: "John Doe",
    source: "driver-data",
    isHighPriority: true,
  },
];

export const mockDriverData: DriverData[] = [
  {
    id: "1",
    driverId: "D001",
    driverName: "Alice Johnson",
    employeeId: "E001",
    licenseNumber: "L123456",
    licenseClass: "Class A",
    licenseExpiry: "2024-05-01",
    endorsements: ["Hazmat"],
    restrictions: [],
    trainingCompleted: [
      {
        id: "T001",
        name: "Forklift Safety Training",
        completionDate: "2023-01-15",
        expiryDate: "2024-01-15",
      },
    ],
    complianceStatus: "compliant",
    lastReviewDate: "2023-01-10",
  },
];

export const mockVehicleData: VehicleData[] = [
  {
    id: "1",
    vehicleId: "V001",
    make: "Ford",
    model: "F-150",
    year: 2020,
    type: "truck",
    licensePlate: "ABC123",
    vin: "1FTRX18W3YNA12345",
    department: "Logistics",
    assignedTo: "D001",
    status: "active",
    lastMaintenanceDate: "2023-01-01",
    nextMaintenanceDate: "2023-07-01",
    mileage: 15000,
    fuelType: "Gasoline",
  },
];

export const mockTripData: TripData[] = [
  {
    id: "1",
    driverId: "D001",
    driverName: "Alice Johnson",
    vehicleId: "V001",
    date: "2023-01-20",
    startTime: "08:00",
    endTime: "10:00",
    startLocation: "Warehouse",
    endLocation: "Client Site",
    mileage: 50,
    purpose: "Delivery",
  },
];

export const mockDriverTrends: DriverTrendData[] = [
  {
    id: "1",
    driverId: "D001",
    driverName: "Alice Johnson",
    period: "month",
    startDate: "2023-01-01",
    endDate: "2023-01-31",
    mileageDriven: 1500,
    fuelUsed: 100,
    fuelEfficiency: 15,
    incidentCount: 1,
    incidentRate: 0.67,
    harshBrakingEvents: 5,
    harshAccelerationEvents: 3,
    speedingEvents: 2,
    idlingTime: 30,
    distractionEvents: 1,
    fatigueWarnings: 0,
    safetyScore: 85,
    trendDirection: "improving",
    riskLevel: "medium",
    lastUpdated: "2023-01-31",
  },
];

export const mockToolboxMeetingData: ToolboxMeetingData[] = [
  {
    id: "1",
    title: "Weekly Safety Meeting",
    projectId: "P001",
    projectName: "Project Alpha",
    location: "Conference Room A",
    date: "2023-02-15",
    startTime: "10:00",
    endTime: "11:00",
    conductor: "John Doe",
    topics: ["Safety Procedures", "Emergency Protocols"],
    safetyFocus: "General Safety",
    status: "scheduled",
    attendees: [],
    createdBy: "Jane Smith",
    createdDate: "2023-01-01",
    lastUpdated: "2023-01-01",
  },
];

export const mockToolboxMeetingTemplates: ToolboxMeetingTemplate[] = [
  {
    id: "1",
    title: "Monthly Safety Review",
    category: "Safety",
    description: "Template for monthly safety review meetings.",
    topics: ["Incident Reports", "Safety Training Updates"],
    safetyFocus: "Safety Compliance",
    suggestedDuration: 60,
    materials: ["Safety Manual", "Incident Report Forms"],
    createdBy: "Jane Smith",
    createdDate: "2023-01-01",
    lastUpdated: "2023-01-01",
  },
];
