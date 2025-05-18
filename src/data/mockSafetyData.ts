
import { SafetyIncident, Hazard, SafetyTraining, SafetyCompliance, Risk } from "@/types/safety";

// Mock Incidents
export const mockSafetyIncidents: SafetyIncident[] = [
  {
    id: "incident-001",
    title: "Worker fall from ladder",
    description: "A worker fell from a ladder while working on the second floor. Minor injuries sustained. Worker was wearing safety harness incorrectly.",
    date: "2025-05-10",
    location: "Building A, 2nd Floor",
    projectId: "p-001",
    projectName: "I-85 North Resurfacing",
    reportedBy: "John Doe",
    severity: "medium",
    status: "investigating",
    assignedTo: "Sarah Johnson",
    witnesses: ["Michael Smith", "Amy Lee"],
    actions: [
      {
        id: "action-001",
        description: "Review proper harness use with all workers",
        assignedTo: "Sarah Johnson",
        dueDate: "2025-05-20",
        status: "pending"
      },
      {
        id: "action-002",
        description: "Replace damaged ladder",
        assignedTo: "Equipment Manager",
        dueDate: "2025-05-15",
        status: "completed",
        completedDate: "2025-05-12"
      }
    ],
    oshaReportable: false
  },
  {
    id: "incident-002",
    title: "Equipment collision",
    description: "Backhoe collided with concrete barrier while operating in low visibility conditions due to rain.",
    date: "2025-05-08",
    location: "South perimeter",
    projectId: "p-002",
    projectName: "Highway 101 Bridge Expansion",
    reportedBy: "Robert Chen",
    severity: "high",
    status: "resolved",
    assignedTo: "Mike Wilson",
    photos: ["photo1.jpg", "photo2.jpg"],
    witnesses: ["Teresa Brown"],
    actions: [
      {
        id: "action-003",
        description: "Implement updated protocol for operations in low visibility",
        assignedTo: "Mike Wilson",
        dueDate: "2025-05-15",
        status: "completed",
        completedDate: "2025-05-14"
      }
    ],
    resolutionNotes: "Equipment repaired and new visibility protocols implemented",
    oshaReportable: true
  },
  {
    id: "incident-003",
    title: "Chemical spill",
    description: "Small chemical spill occurred when transferring solvents between containers. Area was contained and cleaned according to procedures.",
    date: "2025-05-12",
    location: "Storage area",
    projectId: "p-003",
    projectName: "Peachtree St Extension",
    reportedBy: "Lisa Wong",
    severity: "low",
    status: "closed",
    followUpDate: "2025-05-14",
    resolutionNotes: "Clean-up completed and verified. No environmental impact.",
    oshaReportable: false
  },
  {
    id: "incident-004",
    title: "Heat exhaustion",
    description: "Worker experienced heat exhaustion during afternoon shift. Medical attention provided on-site.",
    date: "2025-05-14",
    location: "Southeast section",
    projectId: "p-001",
    projectName: "I-85 North Resurfacing",
    reportedBy: "Marcus Johnson",
    severity: "medium",
    status: "reported",
    oshaReportable: false
  },
  {
    id: "incident-005",
    title: "Near miss with crane load",
    description: "Unsecured load on crane nearly fell while being transported. No injuries or damage occurred.",
    date: "2025-05-15",
    location: "North tower",
    projectId: "p-002",
    projectName: "Highway 101 Bridge Expansion",
    reportedBy: "Emily Parker",
    severity: "high",
    status: "investigating",
    assignedTo: "Mike Wilson",
    actions: [
      {
        id: "action-004",
        description: "Review load securing procedures with all crane operators",
        assignedTo: "Safety Officer",
        dueDate: "2025-05-18",
        status: "in-progress"
      }
    ],
    oshaReportable: true
  }
];

// Mock Hazards
export const mockHazards: Hazard[] = [
  {
    id: "hazard-001",
    type: "fall",
    description: "Unguarded edge on the third floor of Building B",
    location: "Building B, 3rd Floor",
    projectId: "p-001",
    projectName: "I-85 North Resurfacing",
    reportedBy: "John Smith",
    reportedDate: "2025-05-08",
    severity: "high",
    status: "active",
    photos: ["edge1.jpg", "edge2.jpg"]
  },
  {
    id: "hazard-002",
    type: "electrical",
    description: "Exposed wiring near water source",
    location: "Equipment room, Building A",
    projectId: "p-002",
    projectName: "Highway 101 Bridge Expansion",
    reportedBy: "Maria Garcia",
    reportedDate: "2025-05-10",
    severity: "high",
    status: "mitigated",
    mitigationSteps: "Wiring was covered and water source relocated",
    mitigatedBy: "Electrical Team",
    mitigatedDate: "2025-05-11"
  },
  {
    id: "hazard-003",
    type: "equipment",
    description: "Damaged hydraulic hose on excavator",
    location: "East excavation site",
    projectId: "p-003",
    projectName: "Peachtree St Extension",
    reportedBy: "David Johnson",
    reportedDate: "2025-05-12",
    severity: "medium",
    status: "resolved",
    mitigationSteps: "Hose was replaced and equipment inspected",
    mitigatedBy: "Maintenance Team",
    mitigatedDate: "2025-05-12"
  }
];

// Mock Risk data
export const mockRisks: Risk[] = [
  {
    id: "risk-001",
    title: "Equipment shortage for Peachtree project",
    description: "Analysis indicates potential equipment shortage for the Peachtree Street Extension project due to concurrent demands from the Highway 101 project.",
    category: "equipment",
    probability: "high",
    impact: "significant",
    riskScore: 16,
    status: "identified",
    dateIdentified: "2025-05-10",
    projectId: "p-003",
    projectName: "Peachtree St Extension",
    identifiedBy: "AI Risk System",
    source: "ai-prediction",
    predictedTriggers: [
      "Schedule overlap with Highway 101 project",
      "Limited excavator availability in fleet",
      "Maintenance schedule conflicts"
    ],
    affectedAreas: ["Excavation", "Foundation work"],
    lastUpdated: "2025-05-11",
    isHighPriority: true
  },
  {
    id: "risk-002",
    title: "Labor shortage - skilled concrete workers",
    description: "Potential shortage of skilled concrete workers during weeks 8-10 of the Highway 101 Bridge project due to regional demand and competing projects.",
    category: "resource",
    probability: "medium",
    impact: "severe",
    riskScore: 12,
    status: "analyzing",
    dateIdentified: "2025-05-08",
    projectId: "p-002",
    projectName: "Highway 101 Bridge Expansion",
    identifiedBy: "AI Risk System",
    source: "ai-prediction",
    predictedTriggers: [
      "Three major concrete pours scheduled in region during same period",
      "Historical pattern of resource constraints in Q2",
      "Training program completion delays"
    ],
    affectedAreas: ["Concrete foundation", "Support columns"],
    lastUpdated: "2025-05-12",
    isHighPriority: true
  },
  {
    id: "risk-003",
    title: "Cost overrun on asphalt materials",
    description: "Predicted 15% increase in asphalt costs due to oil price fluctuations and supply chain disruptions affecting the I-85 Resurfacing project.",
    category: "budget",
    probability: "very-high",
    impact: "moderate",
    riskScore: 12,
    status: "mitigating",
    dateIdentified: "2025-05-01",
    projectId: "p-001",
    projectName: "I-85 North Resurfacing",
    identifiedBy: "AI Risk System",
    source: "ai-prediction",
    predictedTriggers: [
      "Oil price increases in last 30 days",
      "Primary supplier reporting logistics issues",
      "Regional shortage patterns"
    ],
    affectedAreas: ["Material procurement", "Project budget"],
    lastUpdated: "2025-05-14",
    mitigation: {
      id: "mit-001",
      riskId: "risk-003",
      strategy: "mitigate",
      description: "Secure forward contracts for asphalt at current prices and explore alternative suppliers.",
      actions: [
        {
          id: "mit-action-001",
          description: "Negotiate forward contracts with current supplier",
          assignedTo: "Procurement Manager",
          dueDate: "2025-05-20",
          status: "in-progress"
        },
        {
          id: "mit-action-002",
          description: "Source alternative suppliers within 100mi radius",
          assignedTo: "Procurement Team",
          dueDate: "2025-05-25",
          status: "pending"
        }
      ],
      responsible: "Procurement Manager",
      estimatedCost: 5000,
      status: "active"
    },
    isHighPriority: false
  },
  {
    id: "risk-004",
    title: "Weather delays for concrete work",
    description: "High probability of weather delays affecting concrete pouring schedule on Highway 101 Bridge project based on weather forecasts.",
    category: "schedule",
    probability: "high",
    impact: "moderate",
    riskScore: 9,
    status: "mitigating",
    dateIdentified: "2025-05-09",
    projectId: "p-002",
    projectName: "Highway 101 Bridge Expansion",
    identifiedBy: "AI Risk System",
    source: "ai-prediction",
    predictedTriggers: [
      "Weather forecast showing 70% chance of rain during critical days",
      "Historical weather patterns for region",
      "Seasonal precipitation data"
    ],
    affectedAreas: ["Concrete pouring", "Critical path schedule"],
    lastUpdated: "2025-05-13",
    isHighPriority: false
  },
  {
    id: "risk-005",
    title: "Compactor maintenance failure risk",
    description: "Predictive maintenance analysis indicates high probability of compactor failure during critical resurfacing phase of I-85 project.",
    category: "equipment",
    probability: "high",
    impact: "significant",
    riskScore: 16,
    status: "mitigating",
    dateIdentified: "2025-05-07",
    projectId: "p-001",
    projectName: "I-85 North Resurfacing",
    identifiedBy: "AI Risk System",
    source: "ai-prediction",
    predictedTriggers: [
      "Maintenance logs show warning indicators",
      "Equipment has exceeded 85% of expected service interval",
      "Sensor data indicates potential hydraulic system issues"
    ],
    affectedAreas: ["Resurfacing operations", "Schedule critical path"],
    lastUpdated: "2025-05-12",
    isHighPriority: true
  },
  {
    id: "risk-006",
    title: "Permit approval delays",
    description: "Historical analysis of similar permit applications suggests potential delays in environmental permit approval for Peachtree extension.",
    category: "regulatory",
    probability: "medium",
    impact: "severe",
    riskScore: 12,
    status: "monitoring",
    dateIdentified: "2025-05-03",
    projectId: "p-003",
    projectName: "Peachtree St Extension",
    identifiedBy: "AI Risk System",
    source: "ai-prediction",
    predictedTriggers: [
      "Similar permits in region averaging 45+ days for approval",
      "Environmental agency staffing shortages reported",
      "Complexity of watershed impact assessment"
    ],
    affectedAreas: ["Project initiation", "Schedule dependency"],
    lastUpdated: "2025-05-12",
    isHighPriority: false
  },
  {
    id: "risk-007",
    title: "Subcontractor financial instability",
    description: "Financial analysis indicates potential financial instability with key electrical subcontractor on Highway 101 Bridge project.",
    category: "resource",
    probability: "medium",
    impact: "significant",
    riskScore: 9,
    status: "analyzing",
    dateIdentified: "2025-05-10",
    projectId: "p-002",
    projectName: "Highway 101 Bridge Expansion",
    identifiedBy: "AI Risk System",
    source: "ai-prediction",
    predictedTriggers: [
      "Payment delay patterns in last 3 projects",
      "Industry financial stress indicators",
      "Staff turnover at subcontractor"
    ],
    affectedAreas: ["Electrical systems", "Project handover"],
    lastUpdated: "2025-05-14",
    isHighPriority: false
  },
  {
    id: "risk-008",
    title: "Safety incident risk - excavation",
    description: "Pattern analysis of similar projects indicates elevated risk of safety incidents during deep excavation phase of Peachtree project.",
    category: "safety",
    probability: "medium",
    impact: "severe",
    riskScore: 12,
    status: "identified",
    dateIdentified: "2025-05-11",
    projectId: "p-003",
    projectName: "Peachtree St Extension",
    identifiedBy: "AI Risk System",
    source: "ai-prediction",
    predictedTriggers: [
      "Soil condition similarity to previous incident sites",
      "Increased complexity of excavation depth",
      "New crew members with limited deep excavation experience"
    ],
    affectedAreas: ["Worker safety", "Project timeline"],
    lastUpdated: "2025-05-13",
    isHighPriority: true
  },
  {
    id: "risk-009",
    title: "Quality issues with concrete supplier",
    description: "Quality control data suggests potential quality issues with concrete batches from supplier for Highway 101 project.",
    category: "other",
    probability: "low",
    impact: "severe",
    riskScore: 6,
    status: "monitoring",
    dateIdentified: "2025-05-08",
    projectId: "p-002",
    projectName: "Highway 101 Bridge Expansion",
    identifiedBy: "AI Risk System",
    source: "ai-prediction",
    predictedTriggers: [
      "Recent quality control samples showing 5% below strength requirement",
      "Supplier changed aggregate source recently",
      "Similar issues reported on other regional projects"
    ],
    affectedAreas: ["Structural integrity", "Quality assurance"],
    lastUpdated: "2025-05-12",
    isHighPriority: false
  },
  {
    id: "risk-010",
    title: "Traffic management plan inadequacy",
    description: "Traffic analysis suggests the current traffic management plan may be inadequate for peak periods during I-85 resurfacing.",
    category: "safety",
    probability: "high",
    impact: "moderate",
    riskScore: 9,
    status: "analyzing",
    dateIdentified: "2025-05-10",
    projectId: "p-001",
    projectName: "I-85 North Resurfacing",
    identifiedBy: "AI Risk System",
    source: "ai-prediction",
    predictedTriggers: [
      "Recent traffic count data exceeds plan estimates by 17%",
      "Concurrent events in area during construction period",
      "Historical accident data at similar lane reduction setups"
    ],
    affectedAreas: ["Public safety", "Worker safety", "Project reputation"],
    lastUpdated: "2025-05-13",
    isHighPriority: false
  }
];

export const mockSafetyTrainings: SafetyTraining[] = [
  {
    id: "training-001",
    title: "Fall Protection Training",
    description: "Comprehensive training on proper use of fall protection equipment and hazard recognition.",
    requiredFor: ["field_worker", "project_manager"],
    frequency: "annually",
    duration: 240,
    materials: ["fall_protection_manual.pdf", "harness_inspection_checklist.pdf"],
    certificationProduced: true
  },
  {
    id: "training-002",
    title: "Hazard Communication",
    description: "Training on chemical hazards, labels, safety data sheets, and protective measures.",
    requiredFor: ["field_worker", "project_manager", "hr"],
    frequency: "biannually",
    duration: 120,
    materials: ["hazcom_slides.pdf", "sds_guide.pdf"],
    certificationProduced: true
  },
  {
    id: "training-003",
    title: "Emergency Response",
    description: "Procedures for emergency situations including evacuation, first aid, and reporting.",
    requiredFor: ["field_worker", "project_manager", "hr", "accountant", "admin"],
    frequency: "annually",
    duration: 90,
    materials: ["emergency_procedures.pdf"],
    certificationProduced: false
  }
];

export const mockSafetyCompliances: SafetyCompliance[] = [
  {
    id: "compliance-001",
    standard: "OSHA 1926.501",
    description: "Fall protection requirements for construction",
    applicableTo: ["field_worker", "project_manager"],
    checklistItems: [
      {
        id: "item-001",
        description: "Workers using fall protection when working at heights of 6 feet or more",
        required: true,
        status: "compliant",
        lastChecked: "2025-05-01",
        notes: "All workers observed using proper harnesses"
      },
      {
        id: "item-002",
        description: "Guardrails installed on all open sides and edges",
        required: true,
        status: "non-compliant",
        lastChecked: "2025-05-01",
        notes: "Missing guardrail on north side of Building A, 3rd floor"
      }
    ],
    nextReviewDate: "2025-06-01",
    lastReviewDate: "2025-05-01",
    reviewedBy: "Sarah Johnson",
    documentationRequired: ["inspection_report.pdf"]
  },
  {
    id: "compliance-002",
    standard: "OSHA 1926.1153",
    description: "Respirable crystalline silica standard for construction",
    applicableTo: ["field_worker"],
    checklistItems: [
      {
        id: "item-003",
        description: "Engineering controls used to reduce dust exposure",
        required: true,
        status: "compliant",
        lastChecked: "2025-04-15",
        notes: "Wet methods and vacuum systems in place"
      },
      {
        id: "item-004",
        description: "Respiratory protection provided when engineering controls not sufficient",
        required: true,
        status: "compliant",
        lastChecked: "2025-04-15"
      },
      {
        id: "item-005",
        description: "Air monitoring conducted according to schedule",
        required: true,
        status: "non-compliant",
        lastChecked: "2025-04-15",
        notes: "Last monitoring performed more than 30 days ago"
      }
    ],
    nextReviewDate: "2025-05-15",
    lastReviewDate: "2025-04-15",
    reviewedBy: "Mike Wilson"
  }
];
