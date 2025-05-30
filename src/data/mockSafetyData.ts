
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
  ToolboxMeetingTemplate,
  JobSafetyAnalysisData,
  JSATemplate
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

// Add Georgia projects to the mock data
export const mockGeorgiaProjects = [
  { id: "GA-001", name: "Georgia DOT I-85 Expansion", location: "Atlanta, GA" },
  { id: "GA-002", name: "Savannah Port Access Road", location: "Savannah, GA" },
  { id: "GA-003", name: "Macon Bridge Rehabilitation", location: "Macon, GA" },
];

// Update Mock Risk Data to include Georgia projects and driver-related risks
export const mockRisks: Risk[] = [
  {
    id: "risk-001",
    title: "Potential trench collapse during excavation",
    description: "Soil conditions indicate potential for trench collapse during deep utility excavation phase.",
    category: "safety",
    probability: "high", 
    impact: "severe",
    riskScore: 16,
    status: "mitigating",
    dateIdentified: "2024-04-15",
    projectId: "GA-001",
    projectName: "Georgia DOT I-85 Expansion",
    identifiedBy: "John Smith",
    source: "jsa-analysis",
    mitigation: {
      id: "mit-001",
      riskId: "risk-001",
      strategy: "mitigate",
      description: "Implement trench shoring and daily inspections",
      actions: [],
      responsible: "Safety Manager",
      status: "active"
    },
    predictedTriggers: ["Heavy rainfall", "Vibration from nearby equipment"],
    affectedAreas: ["Underground utilities", "Foundation work"],
    lastUpdated: "2024-05-01",
    assignedTo: "Robert Johnson",
    isHighPriority: true,
    relatedJsaData: ["jsa-001", "jsa-003"]
  },
  {
    id: "risk-002",
    title: "Driver fatigue risk on night shifts",
    description: "Analysis of driver data shows increased risk of incidents during night shifts, particularly for long-haul deliveries to the southern work zones.",
    category: "driver",
    probability: "high", 
    impact: "significant",
    riskScore: 12,
    status: "analyzing",
    dateIdentified: "2024-05-10",
    projectId: "GA-001",
    projectName: "Georgia DOT I-85 Expansion",
    identifiedBy: "AI Risk System",
    source: "ai-prediction",
    predictedTriggers: ["Extended shifts", "Insufficient rest periods", "Poor lighting conditions"],
    affectedAreas: ["Equipment deliveries", "Material transport"],
    lastUpdated: "2024-05-12",
    isHighPriority: true,
    aiConfidence: 87,
    relatedDriverData: ["driver-003", "driver-007", "driver-009"]
  },
  {
    id: "risk-003",
    title: "Concrete delivery delays",
    description: "Potential delays in concrete delivery due to supplier capacity issues and traffic congestion on I-75.",
    category: "schedule",
    probability: "medium", 
    impact: "moderate",
    riskScore: 9,
    status: "monitoring",
    dateIdentified: "2024-04-10",
    projectId: "GA-001",
    projectName: "Georgia DOT I-85 Expansion",
    identifiedBy: "Project Manager",
    source: "manual-entry",
    lastUpdated: "2024-04-25",
    isHighPriority: false,
    relatedDriverData: ["driver-002"]
  },
  {
    id: "risk-004",
    title: "Equipment damage during transportation",
    description: "Heavy machinery being transported to Savannah site shows risk of damage due to road conditions and driver handling patterns.",
    category: "equipment",
    probability: "medium", 
    impact: "significant",
    riskScore: 12,
    status: "mitigating",
    dateIdentified: "2024-04-28",
    projectId: "GA-002",
    projectName: "Savannah Port Access Road",
    identifiedBy: "AI Risk System",
    source: "driver-data",
    lastUpdated: "2024-05-01",
    isHighPriority: false,
    relatedDriverData: ["driver-004", "driver-011"]
  },
  {
    id: "risk-005",
    title: "Hazardous material handling compliance",
    description: "Potential non-compliance with EPA regulations for handling and disposal of hazardous materials found during site clearing.",
    category: "regulatory",
    probability: "low", 
    impact: "severe",
    riskScore: 8,
    status: "analyzing",
    dateIdentified: "2024-04-05",
    projectId: "GA-002",
    projectName: "Savannah Port Access Road",
    identifiedBy: "Environmental Specialist",
    source: "compliance-issue",
    lastUpdated: "2024-04-20",
    isHighPriority: false
  },
  {
    id: "risk-006",
    title: "Driver distraction incidents increasing",
    description: "Analysis of recent driver data shows an increase in potential distraction events, especially on routes to Macon site.",
    category: "driver",
    probability: "high", 
    impact: "significant",
    riskScore: 12,
    status: "mitigating",
    dateIdentified: "2024-05-05",
    projectId: "GA-003",
    projectName: "Macon Bridge Rehabilitation",
    identifiedBy: "AI Risk System",
    source: "ai-prediction",
    lastUpdated: "2024-05-10",
    isHighPriority: true,
    aiConfidence: 76,
    relatedDriverData: ["driver-006", "driver-008"]
  },
  {
    id: "risk-007",
    title: "Budget overrun on concrete materials",
    description: "Price increases from suppliers indicating potential 15% budget overrun on concrete materials.",
    category: "budget",
    probability: "very-high", 
    impact: "moderate",
    riskScore: 12,
    status: "monitoring",
    dateIdentified: "2024-03-22",
    projectId: "GA-003",
    projectName: "Macon Bridge Rehabilitation",
    identifiedBy: "Cost Estimator",
    source: "manual-entry",
    lastUpdated: "2024-04-15",
    isHighPriority: false
  },
  {
    id: "risk-008",
    title: "Weather delays in June forecasted",
    description: "Weather forecasts indicate higher than normal rainfall in June which could impact schedules.",
    category: "schedule",
    probability: "medium", 
    impact: "moderate",
    riskScore: 9,
    status: "monitoring",
    dateIdentified: "2024-05-02",
    projectId: "GA-001",
    projectName: "Georgia DOT I-85 Expansion",
    identifiedBy: "Project Coordinator",
    source: "manual-entry",
    lastUpdated: "2024-05-02",
    isHighPriority: false
  },
  {
    id: "risk-009",
    title: "Speeding incidents on delivery routes",
    description: "Multiple speeding incidents detected on material delivery routes to I-85 Expansion project.",
    category: "safety",
    probability: "high", 
    impact: "significant",
    riskScore: 12,
    status: "analyzing",
    dateIdentified: "2024-05-08",
    projectId: "GA-001", 
    projectName: "Georgia DOT I-85 Expansion",
    identifiedBy: "Safety Officer",
    source: "driver-data",
    lastUpdated: "2024-05-11",
    isHighPriority: true,
    relatedDriverData: ["driver-001", "driver-005", "driver-010"]
  },
  {
    id: "risk-010",
    title: "Potential utility line strike",
    description: "Excavation near unmarked utility lines poses risk of line strike and service disruption.",
    category: "safety",
    probability: "medium", 
    impact: "severe",
    riskScore: 12,
    status: "mitigating",
    dateIdentified: "2024-04-15",
    projectId: "GA-002",
    projectName: "Savannah Port Access Road",
    identifiedBy: "Site Supervisor",
    source: "jsa-analysis",
    lastUpdated: "2024-05-01",
    assignedTo: "Thomas Lee",
    isHighPriority: true,
    relatedJsaData: ["jsa-002"]
  }
];

// Mock Driver Data
export const mockDriverData: DriverData[] = [
  {
    id: "driver-data-001",
    driverId: "driver-001",
    driverName: "James Wilson",
    employeeId: "EMP-1234",
    licenseNumber: "GA-DL-12345678",
    licenseClass: "CDL-A",
    licenseExpiry: "2025-06-30",
    endorsements: ["Tanker", "HazMat"],
    restrictions: [],
    trainingCompleted: [
      {
        id: "train-001",
        name: "Defensive Driving",
        completionDate: "2024-01-15",
        expiryDate: "2025-01-15"
      },
      {
        id: "train-002",
        name: "Hours of Service",
        completionDate: "2024-02-10",
        expiryDate: "2025-02-10"
      }
    ],
    complianceStatus: "minor_issues",
    complianceNotes: "Recent speeding events need to be addressed",
    lastReviewDate: "2024-04-28",
    reviewedBy: "Sarah Johnson"
  },
  {
    id: "driver-data-002",
    driverId: "driver-002",
    driverName: "Robert Martinez",
    employeeId: "EMP-2345",
    licenseNumber: "GA-DL-23456789",
    licenseClass: "CDL-B",
    licenseExpiry: "2026-03-15",
    endorsements: ["Passenger"],
    restrictions: [],
    trainingCompleted: [
      {
        id: "train-003",
        name: "Defensive Driving",
        completionDate: "2023-11-05",
        expiryDate: "2024-11-05"
      }
    ],
    complianceStatus: "compliant",
    lastReviewDate: "2024-04-15",
    reviewedBy: "Mark Thompson"
  },
  {
    id: "driver-data-003",
    driverId: "driver-003",
    driverName: "Michael Johnson",
    employeeId: "EMP-3456",
    licenseNumber: "GA-DL-34567890",
    licenseClass: "CDL-A",
    licenseExpiry: "2025-08-22",
    endorsements: ["Tanker", "HazMat", "Doubles/Triples"],
    restrictions: [],
    trainingCompleted: [
      {
        id: "train-004",
        name: "Defensive Driving",
        completionDate: "2024-02-20",
        expiryDate: "2025-02-20"
      },
      {
        id: "train-005",
        name: "Hours of Service",
        completionDate: "2024-03-10",
        expiryDate: "2025-03-10"
      },
      {
        id: "train-006",
        name: "Fatigue Management",
        completionDate: "2024-03-15",
        expiryDate: "2025-03-15"
      }
    ],
    complianceStatus: "major_issues",
    complianceNotes: "Recent fatigue violations detected",
    lastReviewDate: "2024-05-02",
    reviewedBy: "Sarah Johnson"
  }
];

// Mock Driver Trend Data
export const mockDriverTrends: DriverTrendData[] = [
  {
    id: "trend-001",
    driverId: "driver-001",
    driverName: "James Wilson",
    period: "month",
    startDate: "2024-04-01",
    endDate: "2024-04-30",
    mileageDriven: 2850,
    fuelUsed: 380,
    fuelEfficiency: 7.5,
    incidentCount: 2,
    incidentRate: 0.0007,
    harshBrakingEvents: 12,
    harshAccelerationEvents: 8,
    speedingEvents: 15,
    idlingTime: 230,
    distractionEvents: 5,
    fatigueWarnings: 0,
    safetyScore: 72,
    trendDirection: "worsening",
    riskLevel: "medium",
    improvementSuggestions: [
      "Attend refresher course on speed management",
      "Review and discuss speeding events with supervisor"
    ],
    lastUpdated: "2024-05-01"
  },
  {
    id: "trend-002",
    driverId: "driver-002",
    driverName: "Robert Martinez",
    period: "month",
    startDate: "2024-04-01",
    endDate: "2024-04-30",
    mileageDriven: 1950,
    fuelUsed: 210,
    fuelEfficiency: 9.3,
    incidentCount: 0,
    incidentRate: 0,
    harshBrakingEvents: 3,
    harshAccelerationEvents: 2,
    speedingEvents: 1,
    idlingTime: 120,
    distractionEvents: 1,
    fatigueWarnings: 0,
    safetyScore: 94,
    trendDirection: "improving",
    riskLevel: "low",
    improvementSuggestions: [],
    lastUpdated: "2024-05-01"
  },
  {
    id: "trend-003",
    driverId: "driver-003",
    driverName: "Michael Johnson",
    period: "month",
    startDate: "2024-04-01",
    endDate: "2024-04-30",
    mileageDriven: 3100,
    fuelUsed: 410,
    fuelEfficiency: 7.56,
    incidentCount: 1,
    incidentRate: 0.0003,
    harshBrakingEvents: 6,
    harshAccelerationEvents: 9,
    speedingEvents: 7,
    idlingTime: 320,
    distractionEvents: 8,
    fatigueWarnings: 4,
    safetyScore: 61,
    trendDirection: "worsening",
    riskLevel: "high",
    improvementSuggestions: [
      "Mandatory fatigue management training",
      "Review hours of service compliance",
      "Schedule for in-cab monitoring for two weeks"
    ],
    lastUpdated: "2024-05-01"
  }
];

// Mock Vehicle Data
export const mockVehicleData: VehicleData[] = [
  {
    id: "vehicle-001",
    vehicleId: "VEH-001",
    make: "Peterbilt",
    model: "579",
    year: 2022,
    type: "truck",
    licensePlate: "GA-TRUCK-1234",
    vin: "1XPBD99X1MD123456",
    department: "Equipment Transport",
    assignedTo: "driver-001",
    status: "active",
    lastMaintenanceDate: "2024-03-15",
    nextMaintenanceDate: "2024-06-15",
    mileage: 42500,
    fuelType: "diesel"
  },
  {
    id: "vehicle-002",
    vehicleId: "VEH-002",
    make: "Ford",
    model: "F-550",
    year: 2023,
    type: "truck",
    licensePlate: "GA-TRUCK-2345",
    vin: "1FDAF5GT9NEA12345",
    department: "Materials Delivery",
    assignedTo: "driver-002",
    status: "active",
    lastMaintenanceDate: "2024-04-10",
    nextMaintenanceDate: "2024-07-10",
    mileage: 28900,
    fuelType: "diesel"
  },
  {
    id: "vehicle-003",
    vehicleId: "VEH-003",
    make: "Kenworth",
    model: "T880",
    year: 2021,
    type: "truck",
    licensePlate: "GA-TRUCK-3456",
    vin: "1NKZXPEX5MJ123456",
    department: "Heavy Transport",
    assignedTo: "driver-003",
    status: "maintenance",
    lastMaintenanceDate: "2024-05-05",
    nextMaintenanceDate: "2024-08-05",
    mileage: 68300,
    fuelType: "diesel"
  }
];

// Mock Trip Data
export const mockTripData: TripData[] = [
  {
    id: "trip-001",
    driverId: "driver-001",
    driverName: "James Wilson",
    vehicleId: "VEH-001",
    date: "2024-04-25",
    startTime: "07:30",
    endTime: "16:45",
    startLocation: "Atlanta Yard",
    endLocation: "I-85 Expansion Site",
    mileage: 142,
    purpose: "Equipment delivery",
    projectId: "GA-001",
    projectName: "Georgia DOT I-85 Expansion",
    incidents: [
      {
        id: "incident-001",
        tripId: "trip-001",
        driverId: "driver-001",
        vehicleId: "VEH-001",
        timestamp: "2024-04-25T10:23:00",
        type: "near_miss",
        description: "Vehicle cut off truck on highway, driver performed emergency braking",
        location: "I-85 Northbound, mile marker 112",
        severity: "medium",
        reportedBy: "James Wilson",
        reportedDate: "2024-04-25",
        status: "investigating",
        photos: [],
        witnesses: [],
        followUpRequired: true,
        followUpNotes: "Review dashcam footage"
      }
    ],
    notes: "Heavy traffic caused delay on return trip"
  },
  {
    id: "trip-002",
    driverId: "driver-002",
    driverName: "Robert Martinez",
    vehicleId: "VEH-002",
    date: "2024-04-26",
    startTime: "06:15",
    endTime: "14:30",
    startLocation: "Atlanta Yard",
    endLocation: "Savannah Port Access Road Site",
    mileage: 248,
    purpose: "Concrete delivery",
    projectId: "GA-002",
    projectName: "Savannah Port Access Road",
    incidents: [],
    notes: "No issues, on-time delivery"
  },
  {
    id: "trip-003",
    driverId: "driver-003",
    driverName: "Michael Johnson",
    vehicleId: "VEH-003",
    date: "2024-04-27",
    startTime: "18:45",
    endTime: "23:50",
    startLocation: "Atlanta Yard",
    endLocation: "I-85 Expansion Site",
    mileage: 156,
    purpose: "Night shift equipment transport",
    projectId: "GA-001",
    projectName: "Georgia DOT I-85 Expansion",
    incidents: [
      {
        id: "incident-002",
        tripId: "trip-003",
        driverId: "driver-003",
        vehicleId: "VEH-003",
        timestamp: "2024-04-27T22:15:00",
        type: "violation",
        description: "Driver exceeded speed limit by 12 mph in construction zone",
        location: "I-85 Southbound, mile marker 97",
        severity: "medium",
        reportedBy: "Automated System",
        reportedDate: "2024-04-27",
        status: "reported",
        followUpRequired: true,
        followUpNotes: "Discuss with driver, possible fatigue factor"
      }
    ],
    notes: "Driver reported feeling tired during return trip"
  }
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

export const mockJSAData: JobSafetyAnalysisData[] = [
  {
    id: "1",
    title: "Site Excavation Safety Analysis",
    projectId: "P001",
    projectName: "Project Alpha",
    location: "Main Construction Site",
    taskDescription: "Excavation of foundation area using heavy equipment",
    createdBy: "John Doe",
    createdDate: "2023-02-10",
    lastUpdated: "2023-02-10",
    status: "approved",
    requiredPPE: ["Hard hat", "Safety glasses", "High visibility vest", "Steel-toed boots"],
    items: [
      {
        id: "1",
        jsaId: "1",
        taskStep: "Mark utilities before digging",
        potentialHazards: ["Striking underground utilities"],
        controlMeasures: ["Call 811 for utility marking", "Review utility maps"],
        responsible: "Site Supervisor",
        status: "not_started"
      },
      {
        id: "2",
        jsaId: "1",
        taskStep: "Operate excavator",
        potentialHazards: ["Equipment rollover", "Striking workers"],
        controlMeasures: ["Maintain 20ft clearance from workers", "Use spotter when needed"],
        responsible: "Equipment Operator",
        status: "not_started"
      }
    ],
    requiredEquipment: [],
    isTemplate: false
  },
  {
    id: "2",
    title: "Concrete Pour Safety Analysis",
    projectId: "P002",
    projectName: "Project Beta",
    location: "Foundation Area",
    taskDescription: "Pouring concrete foundation",
    createdBy: "Alice Johnson",
    createdDate: "2023-03-05",
    lastUpdated: "2023-03-05",
    status: "in_progress",
    requiredPPE: ["Hard hat", "Safety glasses", "Gloves", "Rubber boots"],
    items: [
      {
        id: "1",
        jsaId: "2",
        taskStep: "Setup concrete pump",
        potentialHazards: ["Pinch points", "High pressure lines"],
        controlMeasures: ["Inspect equipment before use", "Clear communication"],
        responsible: "Concrete Foreman",
        status: "in_progress"
      },
      {
        id: "2",
        jsaId: "2",
        taskStep: "Pour concrete",
        potentialHazards: ["Chemical burns from concrete", "Manual handling"],
        controlMeasures: ["Wear protective clothing", "Use proper lifting techniques"],
        responsible: "Crew Lead",
        status: "not_started"
      }
    ],
    requiredEquipment: [],
    isTemplate: false
  }
];

export const mockJSATemplates: JSATemplate[] = [
  {
    id: "1",
    title: "Excavation Work Template",
    category: "Earthwork",
    taskDescription: "Template for excavation activities",
    requiredPPE: ["Hard hat", "Safety glasses", "High visibility vest", "Steel-toed boots"],
    items: [
      {
        taskStep: "Utility identification",
        potentialHazards: ["Striking underground utilities"],
        controlMeasures: ["Call 811 before digging", "Review utility maps"],
        responsibleRole: "Site Supervisor"
      },
      {
        taskStep: "Soil inspection",
        potentialHazards: ["Cave-ins", "Unstable ground"],
        controlMeasures: ["Proper shoring", "Daily inspections"],
        responsibleRole: "Safety Officer"
      }
    ],
    createdBy: "System Admin",
    createdDate: "2023-01-05",
    lastUpdated: "2023-01-05",
    requiredEquipment: []
  },
  {
    id: "2",
    title: "Working at Heights Template",
    category: "Fall Protection",
    taskDescription: "Template for activities requiring work at elevation",
    requiredPPE: ["Hard hat", "Safety harness", "Lanyard", "Safety glasses"],
    items: [
      {
        taskStep: "Ladder setup",
        potentialHazards: ["Falls", "Ladder failure"],
        controlMeasures: ["Inspect ladder", "3-point contact", "Secure ladder"],
        responsibleRole: "Worker"
      },
      {
        taskStep: "Harness inspection",
        potentialHazards: ["Equipment failure", "Improper fit"],
        controlMeasures: ["Pre-use inspection", "Proper adjustment"],
        responsibleRole: "Worker"
      }
    ],
    createdBy: "System Admin",
    createdDate: "2023-01-10",
    lastUpdated: "2023-01-10",
    requiredEquipment: []
  }
];
