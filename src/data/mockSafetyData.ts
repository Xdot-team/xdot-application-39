// Mock safety incidents
export const mockSafetyIncidents = [
  {
    id: "inc-1",
    title: "Slip and Fall Incident",
    description: "A worker slipped on a wet floor in the warehouse.",
    date: "2025-05-01",
    location: "Warehouse",
    projectId: "GA-DOT-2025-01",
    projectName: "Warehouse Renovation",
    reportedBy: "John Doe",
    severity: "medium",
    status: "reported",
    assignedTo: "Safety Officer",
    photos: [],
    witnesses: ["Jane Smith"],
    actions: [],
    relatedDocuments: [],
    followUpDate: "2025-05-05",
    resolutionNotes: "Floor was cleaned and warning signs were placed.",
    oshaReportable: true,
  },
  {
    id: "inc-2",
    title: "Electrical Shock Incident",
    description: "An employee received a minor electrical shock while using a power tool.",
    date: "2025-05-02",
    location: "Construction Site",
    projectId: "GA-DOT-2025-02",
    projectName: "Bridge Construction",
    reportedBy: "Alice Johnson",
    severity: "high",
    status: "investigating",
    assignedTo: "Safety Officer",
    photos: [],
    witnesses: ["Bob Brown"],
    actions: [],
    relatedDocuments: [],
    followUpDate: "2025-05-06",
    resolutionNotes: "Power tool was inspected and repaired.",
    oshaReportable: true,
  },
];

// Mock hazards
export const mockHazards = [
  {
    id: "haz-1",
    type: "fall",
    description: "Unsecured ladder in the storage area.",
    location: "Storage Room",
    projectId: "GA-DOT-2025-01",
    projectName: "Warehouse Renovation",
    reportedBy: "John Doe",
    reportedDate: "2025-05-01",
    severity: "medium",
    status: "active",
    photos: [],
    mitigationSteps: "Ladder secured and inspected.",
    mitigatedBy: "Safety Officer",
    mitigatedDate: "2025-05-02",
  },
  {
    id: "haz-2",
    type: "chemical",
    description: "Spill of hazardous material in the lab.",
    location: "Laboratory",
    projectId: "GA-DOT-2025-03",
    projectName: "Chemical Testing",
    reportedBy: "Alice Johnson",
    reportedDate: "2025-05-02",
    severity: "high",
    status: "resolved",
    photos: [],
    mitigationSteps: "Spill cleaned and area secured.",
    mitigatedBy: "Hazmat Team",
    mitigatedDate: "2025-05-02",
  },
];

// Mock safety trainings
export const mockSafetyTrainings = [
  {
    id: "train-1",
    title: "Forklift Safety Training",
    description: "Training for safe operation of forklifts.",
    requiredFor: ["forklift_operator"],
    frequency: "annually",
    duration: 120,
    materials: ["Forklift Safety Manual"],
    certificationProduced: true,
  },
  {
    id: "train-2",
    title: "First Aid Training",
    description: "Basic first aid training for all employees.",
    requiredFor: ["all"],
    frequency: "biannually",
    duration: 90,
    materials: ["First Aid Kit", "Training Manual"],
    certificationProduced: true,
  },
];

// Mock safety compliance
export const mockSafetyCompliances = [
  {
    id: "comp-1",
    standard: "OSHA 1910",
    description: "General Industry Standards.",
    applicableTo: ["all"],
    checklistItems: [
      {
        id: "item-1",
        description: "Ensure all employees have PPE.",
        required: true,
        status: "compliant",
        lastChecked: "2025-04-30",
        notes: "",
      },
      {
        id: "item-2",
        description: "Conduct fire drills quarterly.",
        required: true,
        status: "non-compliant",
        lastChecked: "2025-01-15",
        notes: "Last drill conducted in December 2024.",
      },
    ],
    nextReviewDate: "2025-06-01",
    lastReviewDate: "2025-04-30",
    reviewedBy: "Safety Officer",
    documentationRequired: ["PPE Inventory", "Fire Drill Records"],
  },
];

// Mock risks
export const mockRisks = [
  {
    id: "risk-1",
    title: "High Noise Levels in Workshop",
    description: "Noise levels exceed OSHA limits, posing hearing risks.",
    category: "safety",
    probability: "high",
    impact: "significant",
    riskScore: 15,
    status: "identified",
    dateIdentified: "2025-05-01",
    projectId: "GA-DOT-2025-01",
    projectName: "Warehouse Renovation",
    identifiedBy: "Safety Officer",
    source: "manual-entry",
    predictedTriggers: [],
    affectedAreas: ["Worker Safety"],
    relatedIncidents: [],
    relatedDocuments: [],
    lastUpdated: "2025-05-01",
    assignedTo: "Safety Officer",
    isHighPriority: true,
  },
  {
    id: "risk-2",
    title: "Inadequate Fall Protection",
    description: "Lack of proper fall protection measures on site.",
    category: "safety",
    probability: "medium",
    impact: "high",
    riskScore: 10,
    status: "analyzing",
    dateIdentified: "2025-05-02",
    projectId: "GA-DOT-2025-02",
    projectName: "Bridge Construction",
    identifiedBy: "Safety Officer",
    source: "manual-entry",
    predictedTriggers: [],
    affectedAreas: ["Worker Safety"],
    relatedIncidents: [],
    relatedDocuments: [],
    lastUpdated: "2025-05-02",
    assignedTo: "Safety Officer",
    isHighPriority: false,
  },
];

// Mock driver risks
export const mockDriverRisks = [
  {
    id: "driver-risk-1",
    title: "Driver Fatigue Risk for Long-Haul Operators",
    description: "AI analysis of driver data indicates elevated fatigue risk patterns for operators on routes exceeding 6 hours, particularly during afternoon shifts (2pm-6pm).",
    category: "driver",
    probability: "high",
    impact: "severe",
    riskScore: 16,
    status: "identified",
    dateIdentified: "2025-05-10T10:30:00",
    identifiedBy: "AI System",
    source: "ai-prediction",
    predictedTriggers: [
      "Extended driving periods exceeding 6 hours",
      "Afternoon shifts between 2pm and 6pm",
      "Limited rest breaks detected in tracking data",
      "Previous fatigue-related near misses reported"
    ],
    affectedAreas: ["Driver Safety", "Vehicle Operations", "Scheduling"],
    relatedDriverData: ["driver-trend-1", "driver-trend-2"],
    relatedIncidents: ["inc-234", "inc-189"],
    lastUpdated: "2025-05-11T09:15:00",
    assignedTo: "Sarah Johnson",
    isHighPriority: true,
    aiConfidence: 89
  },
  {
    id: "driver-risk-2",
    title: "Speeding Pattern Identified in Atlanta Region",
    description: "Analysis of telematics data shows a recurring pattern of excess speed violations in the Atlanta metropolitan area, primarily during morning rush hour (7am-9am).",
    category: "driver",
    probability: "medium",
    impact: "significant",
    riskScore: 9,
    status: "analyzing",
    dateIdentified: "2025-05-08T14:45:00",
    projectId: "GA-DOT-2025-11",
    projectName: "I-75 Expansion Project",
    identifiedBy: "Fleet Management System",
    source: "driver-data",
    predictedTriggers: [
      "Construction zone congestion leading to time pressure",
      "Inconsistent speed limit signage in work zones",
      "Scheduling pressure for material deliveries"
    ],
    affectedAreas: ["Driver Safety", "Public Safety", "Regulatory Compliance"],
    relatedDriverData: ["driver-trend-3", "driver-trend-4", "driver-trend-5"],
    lastUpdated: "2025-05-09T11:20:00",
    assignedTo: "Marcus Washington",
    isHighPriority: false,
    aiConfidence: 76
  },
  {
    id: "driver-risk-3",
    title: "Vehicle Maintenance Compliance Risk",
    description: "30% of fleet vehicles are approaching maintenance deadlines within the same 2-week period, creating potential for multiple vehicles being unavailable simultaneously.",
    category: "driver",
    probability: "high",
    impact: "moderate",
    riskScore: 12,
    status: "mitigating",
    dateIdentified: "2025-05-05T09:15:00",
    identifiedBy: "Maintenance System",
    source: "driver-data",
    predictedTriggers: [
      "Clustered maintenance schedule",
      "Limited replacement vehicles available",
      "Multiple projects requiring transportation simultaneously"
    ],
    affectedAreas: ["Fleet Operations", "Project Scheduling", "Material Delivery"],
    relatedDriverData: ["driver-trend-6"],
    lastUpdated: "2025-05-07T16:40:00",
    assignedTo: "Carlos Rodriguez",
    isHighPriority: true
  },
  {
    id: "driver-risk-4",
    title: "Distracted Driving Risk from Mobile Devices",
    description: "AI pattern recognition has identified increased mobile device usage during driving, particularly among drivers under 30 years old and primarily on interstate highways.",
    category: "driver",
    probability: "high",
    impact: "severe",
    riskScore: 16,
    status: "analyzing",
    dateIdentified: "2025-05-12T13:20:00",
    identifiedBy: "AI System",
    source: "ai-prediction",
    predictedTriggers: [
      "Lengthy periods of driving on monotonous routes",
      "Job coordination requiring communication while en route",
      "Lack of hands-free technology in older vehicles"
    ],
    affectedAreas: ["Driver Safety", "Public Safety", "Insurance Compliance"],
    relatedDriverData: ["driver-trend-7", "driver-trend-8"],
    relatedIncidents: ["inc-212"],
    lastUpdated: "2025-05-12T15:45:00",
    assignedTo: "Tanya Richards",
    isHighPriority: true,
    aiConfidence: 92
  },
  {
    id: "jsa-risk-1",
    title: "Excavation Safety Risk Identified from JSA Pattern",
    description: "AI analysis of recent Job Safety Analyses identified inconsistent shoring practices across multiple excavation sites, creating potential for trench collapse incidents.",
    category: "safety",
    probability: "medium",
    impact: "severe",
    riskScore: 12,
    status: "mitigating",
    dateIdentified: "2025-05-11T11:10:00",
    projectId: "GA-DOT-2025-08",
    projectName: "Savannah Highway Drainage Project",
    identifiedBy: "AI System",
    source: "jsa-analysis",
    predictedTriggers: [
      "Different teams using varying fall protection standards",
      "Recent turnover in safety supervisors",
      "Rushing to complete excavation tasks quickly"
    ],
    affectedAreas: ["Worker Safety", "Project Timeline", "OSHA Compliance"],
    relatedJsaData: ["jsa-105", "jsa-107", "jsa-112"],
    lastUpdated: "2025-05-12T09:30:00",
    assignedTo: "Devon Taylor",
    isHighPriority: true,
    aiConfidence: 88
  },
  {
    id: "jsa-risk-2",
    title: "Work at Heights Procedure Gap",
    description: "AI comparative analysis of JSA documents identified inconsistencies in fall protection procedures between different teams working at heights above 10 feet.",
    category: "safety",
    probability: "medium",
    impact: "significant",
    riskScore: 9,
    status: "identified",
    dateIdentified: "2025-05-09T14:30:00",
    projectId: "GA-DOT-2025-12",
    projectName: "Bridge Rehabilitation Project",
    identifiedBy: "JSA Audit System",
    source: "jsa-analysis",
    predictedTriggers: [
      "Different teams using varying fall protection standards",
      "Recent turnover in safety supervisors",
      "Rushing to complete elevated work before weather changes"
    ],
    affectedAreas: ["Worker Safety", "Training Protocols", "Regulatory Compliance"],
    relatedJsaData: ["jsa-098", "jsa-103", "jsa-109"],
    lastUpdated: "2025-05-10T08:15:00",
    assignedTo: "Michael Chen",
    isHighPriority: false,
    aiConfidence: 73
  }
];

// Mock driver data
export const mockDriverData = [
  {
    id: "driver-1",
    driverId: "D-10045",
    driverName: "Thomas Johnson",
    employeeId: "EMP-1289",
    licenseNumber: "GA-9182736454",
    licenseClass: "A",
    licenseExpiry: "2026-07-15",
    endorsements: ["Hazmat", "Tanker"],
    restrictions: [],
    trainingCompleted: [
      {
        id: "tr-1045",
        name: "Defensive Driving",
        completionDate: "2024-11-10",
        expiryDate: "2025-11-10"
      },
      {
        id: "tr-1067",
        name: "Hazardous Materials Handling",
        completionDate: "2024-09-22",
        expiryDate: "2025-09-22"
      }
    ],
    complianceStatus: "compliant",
    lastReviewDate: "2025-04-15",
    reviewedBy: "Sarah Johnson"
  },
  {
    id: "driver-2",
    driverId: "D-10078",
    driverName: "Maria Rodriguez",
    employeeId: "EMP-1342",
    licenseNumber: "GA-8273645198",
    licenseClass: "B",
    licenseExpiry: "2027-03-22",
    endorsements: ["Passenger"],
    restrictions: [],
    trainingCompleted: [
      {
        id: "tr-1023",
        name: "Defensive Driving",
        completionDate: "2024-12-05",
        expiryDate: "2025-12-05"
      },
      {
        id: "tr-1089",
        name: "First Aid",
        completionDate: "2025-01-18",
        expiryDate: "2027-01-18"
      }
    ],
    complianceStatus: "compliant",
    lastReviewDate: "2025-03-28",
    reviewedBy: "Marcus Washington"
  },
  {
    id: "driver-3",
    driverId: "D-10112",
    driverName: "James Wilson",
    employeeId: "EMP-1405",
    licenseNumber: "GA-7364519082",
    licenseClass: "A",
    licenseExpiry: "2025-11-30",
    endorsements: ["Doubles/Triples", "Tanker"],
    restrictions: ["Corrective Lenses"],
    trainingCompleted: [
      {
        id: "tr-1056",
        name: "Defensive Driving",
        completionDate: "2024-08-14",
        expiryDate: "2025-08-14"
      },
      {
        id: "tr-1078",
        name: "Load Securement",
        completionDate: "2025-02-09",
        expiryDate: "2026-02-09"
      }
    ],
    complianceStatus: "minor_issues",
    complianceNotes: "Medical certificate expires in 30 days",
    lastReviewDate: "2025-04-05",
    reviewedBy: "Tanya Richards"
  },
  {
    id: "driver-4",
    driverId: "D-10156",
    driverName: "Robert Lee",
    employeeId: "EMP-1487",
    licenseNumber: "GA-6451908273",
    licenseClass: "A",
    licenseExpiry: "2026-05-17",
    endorsements: ["Hazmat", "Tanker"],
    restrictions: [],
    trainingCompleted: [
      {
        id: "tr-1067",
        name: "Defensive Driving",
        completionDate: "2025-01-20",
        expiryDate: "2026-01-20"
      },
      {
        id: "tr-1092",
        name: "Hazardous Materials Handling",
        completionDate: "2025-02-15",
        expiryDate: "2026-02-15"
      },
      {
        id: "tr-1102",
        name: "Emergency Response",
        completionDate: "2024-11-08",
        expiryDate: "2025-11-08"
      }
    ],
    complianceStatus: "compliant",
    lastReviewDate: "2025-04-22",
    reviewedBy: "Sarah Johnson"
  },
  {
    id: "driver-5",
    driverId: "D-10183",
    driverName: "Lisa Thompson",
    employeeId: "EMP-1512",
    licenseNumber: "GA-5190827364",
    licenseClass: "B",
    licenseExpiry: "2027-01-08",
    endorsements: ["Passenger"],
    restrictions: [],
    trainingCompleted: [
      {
        id: "tr-1034",
        name: "Defensive Driving",
        completionDate: "2024-09-30",
        expiryDate: "2025-09-30"
      }
    ],
    complianceStatus: "minor_issues",
    complianceNotes: "Missing recent drug test documentation",
    lastReviewDate: "2025-03-15",
    reviewedBy: "Marcus Washington"
  },
  {
    id: "driver-6",
    driverId: "D-10205",
    driverName: "Michael Davis",
    employeeId: "EMP-1563",
    licenseNumber: "GA-4519082736",
    licenseClass: "A",
    licenseExpiry: "2026-09-12",
    endorsements: ["Doubles/Triples", "Tanker", "Hazmat"],
    restrictions: [],
    trainingCompleted: [
      {
        id: "tr-1078",
        name: "Defensive Driving",
        completionDate: "2024-10-15",
        expiryDate: "2025-10-15"
      },
      {
        id: "tr-1085",
        name: "Hazardous Materials Handling",
        completionDate: "2024-10-28",
        expiryDate: "2025-10-28"
      },
      {
        id: "tr-1096",
        name: "Winter Driving",
        completionDate: "2024-12-03",
        expiryDate: "2025-12-03"
      }
    ],
    complianceStatus: "major_issues",
    complianceNotes: "Previous citation for HOS violation, requires follow-up",
    lastReviewDate: "2025-04-18",
    reviewedBy: "Carlos Rodriguez"
  },
  {
    id: "driver-7",
    driverId: "D-10228",
    driverName: "Jennifer Martinez",
    employeeId: "EMP-1608",
    licenseNumber: "GA-3645190827",
    licenseClass: "B",
    licenseExpiry: "2027-04-25",
    endorsements: ["Passenger"],
    restrictions: [],
    trainingCompleted: [
      {
        id: "tr-1045",
        name: "Defensive Driving",
        completionDate: "2025-02-14",
        expiryDate: "2026-02-14"
      }
    ],
    complianceStatus: "compliant",
    lastReviewDate: "2025-04-01",
    reviewedBy: "Tanya Richards"
  },
  {
    id: "driver-8",
    driverId: "D-10274",
    driverName: "David Garcia",
    employeeId: "EMP-1672",
    licenseNumber: "GA-2736451908",
    licenseClass: "A",
    licenseExpiry: "2026-08-03",
    endorsements: ["Tanker"],
    restrictions: [],
    trainingCompleted: [
      {
        id: "tr-1067",
        name: "Defensive Driving",
        completionDate: "2024-12-18",
        expiryDate: "2025-12-18"
      },
      {
        id: "tr-1078",
        name: "Hazardous Materials Handling",
        completionDate: "2024-12-20",
        expiryDate: "2025-12-20"
      },
      {
        id: "tr-1102",
        name: "First Aid",
        completionDate: "2025-03-05",
        expiryDate: "2027-03-05"
      }
    ],
    complianceStatus: "compliant",
    lastReviewDate: "2025-04-25",
    reviewedBy: "Marcus Washington"
  },
  {
    id: "driver-9",
    driverId: "D-10297",
    driverName: "William Brown",
    employeeId: "EMP-1709",
    licenseNumber: "GA-1827364519",
    licenseClass: "A",
    licenseExpiry: "2027-02-19",
    endorsements: ["Hazmat", "Tanker", "Doubles/Triples"],
    restrictions: ["Corrective Lenses"],
    trainingCompleted: [
      {
        id: "tr-1067",
        name: "Defensive Driving",
        completionDate: "2024-12-18",
        expiryDate: "2025-12-18"
      },
      {
        id: "tr-1078",
        name: "Hazardous Materials Handling",
        completionDate: "2024-12-20",
        expiryDate: "2025-12-20"
      },
      {
        id: "tr-1102",
        name: "First Aid",
        completionDate: "2025-03-05",
        expiryDate: "2027-03-05"
      }
    ],
    complianceStatus: "compliant",
    lastReviewDate: "2025-04-25",
    reviewedBy: "Marcus Washington"
  },
  {
    id: "driver-10",
    driverId: "D-10316",
    driverName: "Elizabeth Taylor",
    employeeId: "EMP-1746",
    licenseNumber: "GA-0918273645",
    licenseClass: "B",
    licenseExpiry: "2026-06-07",
    endorsements: ["Passenger"],
    restrictions: [],
    trainingCompleted: [
      {
        id: "tr-1023",
        name: "Defensive Driving",
        completionDate: "2025-01-10",
        expiryDate: "2026-01-10"
      },
      {
        id: "tr-1096",
        name: "First Aid",
        completionDate: "2025-01-28",
        expiryDate: "2027-01-28"
      }
    ],
    complianceStatus: "compliant",
    lastReviewDate: "2025-04-08",
    reviewedBy: "Tanya Richards"
  }
];

// Mock vehicle data
export const mockVehicleData = [
  {
    id: "vehicle-1",
    vehicleId: "V-5001",
    make: "Freightliner",
    model: "Cascadia",
    year: 2023,
    type: "truck",
    licensePlate: "GA-TRK-4512",
    vin: "1FUJGHDV1DLBP8365",
    department: "Logistics",
    assignedTo: "D-10045",
    status: "active",
    lastMaintenanceDate: "2025-03-15",
    nextMaintenanceDate: "2025-06-15",
    mileage: 42650,
    fuelType: "diesel"
  },
  {
    id: "vehicle-2",
    vehicleId: "V-5023",
    make: "Peterbilt",
    model: "579",
    year: 2024,
    type: "truck",
    licensePlate: "GA-TRK-7823",
    vin: "1NPXL7EX8PD834517",
    department: "Logistics",
    assignedTo: "D-10078",
    status: "active",
    lastMaintenanceDate: "2025-04-02",
    nextMaintenanceDate: "2025-07-02",
    mileage: 28370,
    fuelType: "diesel"
  },
  {
    id: "vehicle-3",
    vehicleId: "V-5045",
    make: "Kenworth",
    model: "T680",
    year: 2022,
    type: "truck",
    licensePlate: "GA-TRK-3401",
    vin: "1XKZD49X8MJ721834",
    department: "Materials",
    assignedTo: "D-10112",
    status: "maintenance",
    lastMaintenanceDate: "2025-05-01",
    nextMaintenanceDate: "2025-08-01",
    mileage: 59840,
    fuelType: "diesel"
  },
  {
    id: "vehicle-4",
    vehicleId: "V-5067",
    make: "Ford",
    model: "F-550",
    year: 2023,
    type: "truck",
    licensePlate: "GA-TRK-8976",
    vin: "1FDUF5HT7NEA12675",
    department: "Site Preparation",
    assignedTo: "D-10156",
    status: "active",
    lastMaintenanceDate: "2025-02-18",
    nextMaintenanceDate: "2025-05-18",
    mileage: 36720,
    fuelType: "diesel"
  },
  {
    id: "vehicle-5",
    vehicleId: "V-5089",
    make: "Chevrolet",
    model: "Express",
    year: 2024,
    type: "van",
    licensePlate: "GA-VAN-5287",
    vin: "1GAZGPFF8P1241589",
    department: "Crew Transport",
    assignedTo: "D-10183",
    status: "active",
    lastMaintenanceDate: "2025-03-28",
    nextMaintenanceDate: "2025-06-28",
    mileage: 21450,
    fuelType: "gasoline"
  },
  {
    id: "vehicle-6",
    vehicleId: "V-5112",
    make: "Volvo",
    model: "VNL",
    year: 2023,
    type: "truck",
    licensePlate: "GA-TRK-6734",
    vin: "4V4NC9EH9PN212874",
    department: "Logistics",
    assignedTo: "D-10205",
    status: "repair",
    lastMaintenanceDate: "2025-01-12",
    nextMaintenanceDate: "2025-05-12",
    mileage: 48290,
    fuelType: "diesel"
  },
  {
    id: "vehicle-7",
    vehicleId: "V-5134",
    make: "Ford",
    model: "Transit",
    year: 2024,
    type: "van",
    licensePlate: "GA-VAN-3912",
    vin: "1FTVS34L84HB13678",
    department: "Crew Transport",
    assignedTo: "D-10228",
    status: "active",
    lastMaintenanceDate: "2025-04-10",
    nextMaintenanceDate: "2025-07-10",
    mileage: 18760,
    fuelType: "gasoline"
  },
  {
    id: "vehicle-8",
    vehicleId: "V-5156",
    make: "Mack",
    model: "Anthem",
    year: 2022,
    type: "truck",
    licensePlate: "GA-TRK-1845",
    vin: "1M2GR3GC6NM067913",
    department: "Materials",
    assignedTo: "D-10274",
    status: "out_of_service",
    lastMaintenanceDate: "2025-02-25",
    nextMaintenanceDate: "2025-05-25",
    mileage: 72340,
    fuelType: "diesel"
  }
];

// Mock trip data
export const mockTripData = [
  {
    id: "trip-1",
    driverId: "D-10045",
    driverName: "Thomas Johnson",
    vehicleId: "V-5001",
    date: "2025-04-28",
    startTime: "07:30:00",
    endTime: "11:45:00",
    startLocation: "Atlanta Depot",
    endLocation: "Savannah Construction Site",
    mileage: 248,
    purpose: "Material Delivery",
    projectId: "GA-DOT-2025-08",
    projectName: "Savannah Highway Drainage Project",
    notes: "On-time delivery of culvert pipes"
  },
  {
    id: "trip-2",
    driverId: "D-10078",
    driverName: "Maria Rodriguez",
    vehicleId: "V-5023",
    date: "2025-04-28",
    startTime: "06:15:00",
    endTime: "14:30:00",
    startLocation: "Atlanta Depot",
    endLocation: "Macon Project Site",
    mileage: 340,
    purpose: "Crew Transport",
    projectId: "GA-DOT-2025-09",
    projectName: "Macon Bridge Repair Project",
    notes: "Transported 8 workers, returned with 6"
  },
  {
    id: "trip-3",
    driverId: "D-10112",
    driverName: "James Wilson",
    vehicleId: "V-5045",
    date: "2025-04-29",
    startTime: "05:45:00",
    endTime: "16:20:00",
    startLocation: "Atlanta Depot",
    endLocation: "Columbus Work Zone",
    mileage: 410,
    purpose: "Equipment Transport",
    projectId: "GA-DOT-2025-10",
    projectName: "Columbus Highway Expansion",
    incidents: [
      {
        id: "inc-trip-1",
        tripId: "trip-3",
        driverId: "D-10112",
        vehicleId: "V-5045",
        timestamp: "2025-04-29T08:23:00",
        type: "near_miss",
        description: "Near miss with civilian vehicle cutting into lane",
        location: "I-85 S Mile Marker 47",
        severity: "medium",
        reportedBy: "James Wilson",
        reportedDate: "2025-04-29T16:45:00",
        status: "resolved",
        followUpRequired: false
      }
    ],
    notes: "Delivered excavator and accessories"
  },
  {
    id: "trip-4",
    driverId: "D-10156",
    driverName: "Robert Lee",
    vehicleId: "V-5067",
    date: "2025-04-30",
    startTime: "08:00:00",
    endTime: "12:30:00",
    startLocation: "Atlanta Depot",
    endLocation: "Alpharetta Work Zone",
    mileage: 112,
    purpose: "Material Delivery",
    projectId: "GA-DOT-2025-11",
    projectName: "I-75 Expansion Project",
    notes: "Delivered rebar and concrete forms"
  },
  {
    id: "trip-5",
    driverId: "D-10183",
    driverName: "Lisa Thompson",
    vehicleId: "V-5089",
    date: "2025-04-30",
    startTime: "06:30:00",
    endTime: "17:45:00",
    startLocation: "Atlanta Depot",
    endLocation: "Multiple Work Sites",
    mileage: 287,
    purpose: "Crew Transport",
    notes: "Transported workers to 3 different sites throughout the day"
  },
  {
    id: "trip-6",
    driverId: "D-10205",
    driverName: "Michael Davis",
    vehicleId: "V-5112",
    date: "2025-05-01",
    startTime: "07:15:00",
    endTime: "18:30:00",
    startLocation: "Atlanta Depot",
    endLocation: "Augusta Project Site",
    mileage: 332,
    purpose: "Hazardous Material Transport",
    projectId: "GA-DOT-2025-12",
    projectName: "Bridge Rehabilitation Project",
    incidents: [
      {
        id: "inc-trip-2",
        tripId: "trip-6",
        driverId: "D-10205",
        vehicleId: "V-5112",
        timestamp: "2025-05-01T12:37:00",
        type: "violation",
        description: "Speeding in construction zone (58 in 45 zone)",
        location: "I-20 E Mile Marker 167",
        severity: "medium",
        reportedBy: "Automated System",
        reportedDate: "2025-05-01T12:38:00",
        status: "investigating",
        relatedSafetyIncidentId: "inc-212",
        followUpRequired: true,
        followUpNotes: "Driver coaching required"
      }
    ],
    notes: "Delivered chemicals for concrete treatment"
  },
  {
    id: "trip-7",
    driverId: "D-10228",
    driverName: "Jennifer Martinez",
    vehicleId: "V-5134",
    date: "2025-05-02",
    startTime: "05:30:00",
    endTime: "14:15:00",
    startLocation: "Atlanta Depot",
    endLocation: "Multiple Work Sites",
    mileage: 197,
    purpose: "Crew Transport",
    notes: "Morning crew transport to multiple sites"
  },
  {
    id: "trip-8",
    driverId: "D-10045",
    driverName: "Thomas Johnson",
    vehicleId: "V-5001",
    date: "2025-05-03",
    startTime: "08:30:00",
    endTime: "15:45:00",
    startLocation: "Atlanta Depot",
    endLocation: "Savannah Construction Site",
    mileage: 248,
    purpose: "Material Delivery",
    projectId: "GA-DOT-2025-08",
    projectName: "Savannah Highway Drainage Project",
    incidents: [
      {
        id: "inc-trip-3",
        tripId: "trip-8",
        driverId: "D-10045",
        vehicleId: "V-5001",
        timestamp: "2025-05-03T11:15:00",
        type: "damage",
        description: "Minor damage to truck fender from road debris",
        location: "I-16 E Mile Marker 98",
        severity: "low",
        reportedBy: "Thomas Johnson",
        reportedDate: "2025-05-03T16:00:00",
        status: "resolved",
        photos: ["damage-photo-1.jpg"],
        followUpRequired: false
      }
    ],
    notes: "Second delivery of drainage materials"
  }
];

// Mock driver trend data
export const mockDriverTrends = [
  {
    id: "driver-trend-1",
    driverId: "D-10045",
    driverName: "Thomas Johnson",
    period: "month",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    mileageDriven: 3245,
    fuelUsed: 380,
    fuelEfficiency: 8.5,
    incidentCount: 1,
    incidentRate: 0.0003,
    harshBrakingEvents: 5,
    harshAccelerationEvents: 3,
    speedingEvents: 2,
    idlingTime: 87,
    distractionEvents: 4,
    fatigueWarnings: 1,
    safetyScore: 86,
    trendDirection: "stable",
    riskLevel: "low",
    improvementSuggestions: [
      "Reduce idle time between deliveries",
      "Take additional breaks on long-haul trips"
    ],
    lastUpdated: "2025-05-01"
  },
  {
    id: "driver-trend-2",
    driverId: "D-10078",
    driverName: "Maria Rodriguez",
    period: "month",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    mileageDriven: 2870,
    fuelUsed: 328,
    fuelEfficiency: 8.8,
    incidentCount: 0,
    incidentRate: 0,
    harshBrakingEvents: 2,
    harshAccelerationEvents: 1,
    speedingEvents: 0,
    idlingTime: 65,
    distractionEvents: 1,
    fatigueWarnings: 0,
    safetyScore: 94,
    trendDirection: "improving",
    riskLevel: "low",
    lastUpdated: "2025-05-01"
  },
  {
    id: "driver-trend-3",
    driverId: "D-10112",
    driverName: "James Wilson",
    period: "month",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    mileageDriven: 3850,
    fuelUsed: 462,
    fuelEfficiency: 8.3,
    incidentCount: 1,
    incidentRate: 0.00026,
    harshBrakingEvents: 8,
    harshAccelerationEvents: 6,
    speedingEvents: 4,
    idlingTime: 112,
    distractionEvents: 7,
    fatigueWarnings: 3,
    safetyScore: 72,
    trendDirection: "worsening",
    riskLevel: "medium",
    improvementSuggestions: [
      "Increase following distance to reduce harsh braking events",
      "Attend refresher course on distracted driving prevention",
      "Take additional breaks to manage fatigue on long routes"
    ],
    lastUpdated: "2025-05-01"
  },
  {
    id: "driver-trend-4",
    driverId: "D-10156",
    driverName: "Robert Lee",
    period: "month",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    mileageDriven: 2235,
    fuelUsed: 268,
    fuelEfficiency: 8.3,
    incidentCount: 0,
    incidentRate: 0,
    harshBrakingEvents: 3,
    harshAccelerationEvents: 2,
    speedingEvents: 1,
    idlingTime: 76,
    distractionEvents: 2,
    fatigueWarnings: 0,
    safetyScore: 89,
    trendDirection: "improving",
    riskLevel: "low",
    lastUpdated: "2025-05-01"
  },
  {
    id: "driver-trend-5",
    driverId: "D-10183",
    driverName: "Lisa Thompson",
    period: "month",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    mileageDriven: 3120,
    fuelUsed: 312,
    fuelEfficiency: 10,
    incidentCount: 0,
    incidentRate: 0,
    harshBrakingEvents: 4,
    harshAccelerationEvents: 2,
    speedingEvents: 1,
    idlingTime: 58,
    distractionEvents: 3,
    fatigueWarnings: 1,
    safetyScore: 88,
    trendDirection: "stable",
    riskLevel: "low",
    lastUpdated: "2025-05-01"
  },
  {
    id: "driver-trend-6",
    driverId: "D-10205",
    driverName: "Michael Davis",
    period: "month",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    mileageDriven: 4120,
    fuelUsed: 515,
    fuelEfficiency: 8,
    incidentCount: 3,
    incidentRate: 0.00073,
    harshBrakingEvents: 12,
    harshAccelerationEvents: 9,
    speedingEvents: 7,
    idlingTime: 135,
    distractionEvents: 11,
    fatigueWarnings: 5,
    safetyScore: 61,
    trendDirection: "worsening",
    riskLevel: "high",
    improvementSuggestions: [
      "Mandatory attendance at advanced defensive driving course",
      "Implement graduated speed restrictions",
      "Schedule shorter routes to manage fatigue",
      "Weekly coaching sessions with safety manager"
    ],
    lastUpdated: "2025-05-01"
  },
  {
    id: "driver-trend-7",
    driverId: "D-10228",
    driverName: "Jennifer Martinez",
    period: "month",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    mileageDriven: 2760,
    fuelUsed: 276,
    fuelEfficiency: 10,
    incidentCount: 0,
    incidentRate: 0,
    harshBrakingEvents: 3,
    harshAccelerationEvents: 1,
    speedingEvents: 0,
    idlingTime: 52,
    distractionEvents: 2,
    fatigueWarnings: 0,
    safetyScore: 92,
    trendDirection: "stable",
    riskLevel: "low",
    lastUpdated: "2025-05-01"
  },
  {
    id: "driver-trend-8",
    driverId: "D-10274",
    driverName: "David Garcia",
    period: "month",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    mileageDriven: 3780,
    fuelUsed: 454,
    fuelEfficiency: 8.3,
    incidentCount: 2,
    incidentRate: 0.00053,
    harshBrakingEvents: 9,
    harshAccelerationEvents: 7,
    speedingEvents: 6,
    idlingTime: 98,
    distractionEvents: 8,
    fatigueWarnings: 4,
    safetyScore: 68,
    trendDirection: "worsening",
    riskLevel: "high",
    improvementSuggestions: [
      "Review and retrain on company driving policies",
      "Install driver fatigue monitoring system",
      "Implement temporary reduction in route length",
      "Schedule bi-weekly check-ins with safety officer"
    ],
    lastUpdated: "2025-05-01"
  }
];

// Update the main export to include the new mock data
export {
  mockSafetyIncidents,
  mockHazards,
  mockSafetyTrainings,
  mockSafetyCompliances,
  mockRisks,
  mockJSATemplates,
  mockJSAData,
  mockToolboxMeetingTemplates,
  mockToolboxMeetingData,
  mockDriverData,
  mockVehicleData,
  mockTripData,
  mockDriverTrends,
  mockDriverRisks
};

// Update mockRisks to include the driver risks
mockRisks = [...mockRisks, ...mockDriverRisks];
