import { 
  SafetyIncident, 
  Hazard, 
  SafetyTraining, 
  SafetyCompliance, 
  Risk,
  JobSafetyAnalysisData,
  ToolboxMeetingData,
  JSATemplate,
  ToolboxMeetingTemplate
} from '@/types/safety';

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

// Mock data for Job Safety Analysis
export const mockJSATemplates: JSATemplate[] = [
  {
    id: "jsa-template-1",
    title: "Excavation Work Template",
    category: "Excavation",
    taskDescription: "Excavation and trenching operations",
    items: [
      {
        taskStep: "Site preparation and marking underground utilities",
        potentialHazards: ["Damaging underground utilities", "Slips, trips, and falls"],
        controlMeasures: ["Call 811 before digging", "Mark utilities with paint/flags", "Clear debris from work area"]
      },
      {
        taskStep: "Setting up protective systems",
        potentialHazards: ["Cave-ins", "Struck-by hazards", "Falls"],
        controlMeasures: ["Install trench boxes/shoring", "Keep spoil pile 2+ feet from edge", "Use barriers around perimeter"]
      },
      {
        taskStep: "Excavation operations",
        potentialHazards: ["Equipment strikes", "Dust exposure", "Noise exposure"],
        controlMeasures: ["Use spotters for equipment", "Water down area for dust control", "Wear hearing protection"]
      }
    ],
    requiredPPE: ["Hard hat", "Safety glasses", "High visibility vest", "Steel-toed boots"],
    requiredEquipment: ["Excavator", "Trench boxes", "Gas detector", "Access/egress ladder"],
    createdBy: "Safety Director",
    createdDate: "2025-03-15",
    lastUpdated: "2025-04-02"
  },
  {
    id: "jsa-template-2",
    title: "Asphalt Paving Template",
    category: "Paving",
    taskDescription: "Road paving operations with hot mix asphalt",
    items: [
      {
        taskStep: "Setting up work zone traffic control",
        potentialHazards: ["Vehicle strikes", "Worker-equipment collisions", "Public/worker confusion"],
        controlMeasures: ["Follow MUTCD guidelines", "Use proper signage and barriers", "Assign flaggers with proper training"]
      },
      {
        taskStep: "Asphalt placement operations",
        potentialHazards: ["Burns from hot asphalt", "Fume inhalation", "Equipment hazards"],
        controlMeasures: ["Wear proper PPE including gloves", "Work upwind when possible", "Maintain safe distance from equipment"]
      },
      {
        taskStep: "Compaction operations",
        potentialHazards: ["Equipment rollovers", "Noise exposure", "Vibration injury"],
        controlMeasures: ["Only operate on stable ground", "Wear hearing protection", "Take regular breaks from vibrating equipment"]
      }
    ],
    requiredPPE: ["Hard hat", "Safety glasses", "High visibility vest", "Heat-resistant gloves", "Steel-toed boots"],
    requiredEquipment: ["Paver", "Rollers", "Traffic control devices", "Water truck"],
    createdBy: "Safety Manager",
    createdDate: "2025-01-20",
    lastUpdated: "2025-04-10"
  },
  {
    id: "jsa-template-3",
    title: "Bridge Work Template",
    category: "Bridge Construction",
    taskDescription: "Working at heights on bridge structure",
    items: [
      {
        taskStep: "Setting up fall protection",
        potentialHazards: ["Falls from height", "Dropped objects", "Equipment failure"],
        controlMeasures: ["Install guardrails/safety nets", "Use personal fall arrest systems", "Secure tools with tethers"]
      },
      {
        taskStep: "Rebar installation",
        potentialHazards: ["Impalement", "Cuts and abrasions", "Manual handling injuries"],
        controlMeasures: ["Cap exposed rebar ends", "Wear cut-resistant gloves", "Use proper lifting techniques"]
      },
      {
        taskStep: "Concrete pouring",
        potentialHazards: ["Chemical burns", "Struck-by", "Structural collapse"],
        controlMeasures: ["Wear chemical-resistant PPE", "Maintain communication with pump operator", "Follow engineer's specifications"]
      }
    ],
    requiredPPE: ["Hard hat", "Safety glasses", "High visibility vest", "Fall protection harness", "Steel-toed boots"],
    requiredEquipment: ["Scaffolding", "Fall protection systems", "Concrete pump", "Crane"],
    createdBy: "Bridge Supervisor",
    createdDate: "2024-12-05",
    lastUpdated: "2025-03-28"
  }
];

export const mockJSAData: JobSafetyAnalysisData[] = [
  {
    id: "jsa-001",
    title: "I-85 Bridge Repair Excavation",
    projectId: "P-1001",
    projectName: "I-85 Bridge Repair",
    location: "I-85 North, Atlanta, GA",
    taskDescription: "Excavation for bridge pier repair",
    createdBy: "John Smith",
    createdDate: "2025-05-10",
    reviewedBy: "Mary Johnson",
    reviewDate: "2025-05-11",
    approvedBy: "Robert Davis",
    approvalDate: "2025-05-12",
    status: "in_progress",
    requiredPPE: ["Hard hat", "Safety glasses", "Hi-vis vest", "Steel-toed boots", "Hearing protection"],
    requiredEquipment: ["Excavator", "Trench boxes", "Gas detector", "Traffic cones"],
    items: [
      {
        id: "jsa-001-item-1",
        jsaId: "jsa-001",
        taskStep: "Site preparation and marking underground utilities",
        potentialHazards: ["Striking underground utilities", "Trips and falls"],
        controlMeasures: ["Call 811 before digging", "Mark all utilities", "Clear debris from work area"],
        responsible: "Team Lead",
        status: "completed",
        photos: ["utility-marking.jpg"]
      },
      {
        id: "jsa-001-item-2",
        jsaId: "jsa-001",
        taskStep: "Setting up traffic control",
        potentialHazards: ["Vehicle strikes", "Worker confusion"],
        controlMeasures: ["Follow MUTCD guidelines", "Use proper signage", "Morning safety briefing"],
        responsible: "Traffic Control Specialist",
        status: "completed",
        photos: ["traffic-setup.jpg"]
      },
      {
        id: "jsa-001-item-3",
        jsaId: "jsa-001",
        taskStep: "Excavation operations",
        potentialHazards: ["Cave-ins", "Equipment strikes", "Falls into excavation"],
        controlMeasures: ["Use trench boxes", "Assign spotters", "Install barriers around perimeter"],
        responsible: "Equipment Operator",
        status: "in_progress",
        photos: []
      }
    ],
    templateId: "jsa-template-1",
    isTemplate: false,
    lastUpdated: "2025-05-12",
    comments: "Need to be cautious of fiber optic line on north side."
  },
  {
    id: "jsa-002",
    title: "GA-400 Asphalt Paving Operation",
    projectId: "P-1002",
    projectName: "GA-400 Repaving",
    location: "GA-400 South, Alpharetta, GA",
    taskDescription: "Hot mix asphalt paving of highway shoulder",
    createdBy: "Emily Chen",
    createdDate: "2025-05-08",
    reviewedBy: "Thomas Wright",
    reviewDate: "2025-05-09",
    approvedBy: "Robert Davis",
    approvalDate: "2025-05-10",
    status: "approved",
    requiredPPE: ["Hard hat", "Safety glasses", "Hi-vis vest", "Steel-toed boots", "Heat-resistant gloves"],
    requiredEquipment: ["Paver", "Rollers", "Traffic control devices", "Water truck"],
    items: [
      {
        id: "jsa-002-item-1",
        jsaId: "jsa-002",
        taskStep: "Traffic control setup",
        potentialHazards: ["Vehicle strikes", "Worker-vehicle collisions"],
        controlMeasures: ["Use proper advance warning signs", "Set up tapers correctly", "Use trained flaggers"],
        responsible: "Traffic Control Lead",
        status: "not_started",
        photos: []
      },
      {
        id: "jsa-002-item-2",
        jsaId: "jsa-002",
        taskStep: "Asphalt placement",
        potentialHazards: ["Burns from hot asphalt", "Fume inhalation", "Equipment hazards"],
        controlMeasures: ["Wear proper PPE", "Work upwind when possible", "Maintain safe distance from equipment"],
        responsible: "Paving Foreman",
        status: "not_started",
        photos: []
      },
      {
        id: "jsa-002-item-3",
        jsaId: "jsa-002",
        taskStep: "Compaction operations",
        potentialHazards: ["Equipment rollovers", "Noise exposure", "Caught between equipment"],
        controlMeasures: ["Only operate on stable ground", "Wear hearing protection", "Maintain visual contact with operators"],
        responsible: "Roller Operator",
        status: "not_started",
        photos: []
      }
    ],
    templateId: "jsa-template-2",
    isTemplate: false,
    lastUpdated: "2025-05-10",
    comments: "Weather forecast shows potential for rain in afternoon. Monitor conditions."
  },
  {
    id: "jsa-003",
    title: "I-75 Bridge Deck Concrete Pour",
    projectId: "P-1003",
    projectName: "I-75 Resurfacing",
    location: "I-75 North, Marietta, GA",
    taskDescription: "Concrete pour for bridge deck repair",
    createdBy: "Michael Lee",
    createdDate: "2025-05-12",
    reviewedBy: "Sarah Parker",
    reviewDate: "2025-05-13",
    status: "submitted",
    requiredPPE: ["Hard hat", "Safety glasses", "Hi-vis vest", "Steel-toed boots", "Chemical-resistant gloves"],
    requiredEquipment: ["Concrete pump", "Vibrators", "Screed", "Curing equipment"],
    items: [
      {
        id: "jsa-003-item-1",
        jsaId: "jsa-003",
        taskStep: "Setting up fall protection",
        potentialHazards: ["Falls from height", "Dropped objects"],
        controlMeasures: ["Install guardrails", "Use personal fall arrest systems", "Secure tools with tethers"],
        responsible: "Safety Officer",
        status: "not_started",
        photos: []
      },
      {
        id: "jsa-003-item-2",
        jsaId: "jsa-003",
        taskStep: "Concrete pumping and placement",
        potentialHazards: ["Chemical burns from concrete", "Line ruptures", "Struck-by hazards"],
        controlMeasures: ["Wear chemical-resistant PPE", "Inspect hoses before use", "Clear communication with pump operator"],
        responsible: "Concrete Foreman",
        status: "not_started",
        photos: []
      },
      {
        id: "jsa-003-item-3",
        jsaId: "jsa-003",
        taskStep: "Concrete finishing and curing",
        potentialHazards: ["Silica dust exposure", "Repetitive motion injuries", "Heat stress"],
        controlMeasures: ["Use wet methods for dust control", "Rotate workers", "Provide shade and water"],
        responsible: "Finishing Lead",
        status: "not_started",
        photos: []
      }
    ],
    templateId: "jsa-template-3",
    isTemplate: false,
    lastUpdated: "2025-05-13"
  },
  {
    id: "jsa-004",
    title: "I-285 Guardrail Installation",
    projectId: "P-1004",
    projectName: "I-285 Bridge Project",
    location: "I-285 East, Dunwoody, GA",
    taskDescription: "Installing new guardrail sections along highway shoulder",
    createdBy: "David Wilson",
    createdDate: "2025-05-09",
    status: "draft",
    requiredPPE: ["Hard hat", "Safety glasses", "Hi-vis vest", "Steel-toed boots", "Cut-resistant gloves"],
    requiredEquipment: ["Post driver", "Truck-mounted attenuator", "Traffic cones", "Impact wrenches"],
    items: [
      {
        id: "jsa-004-item-1",
        jsaId: "jsa-004",
        taskStep: "Traffic control setup",
        potentialHazards: ["Vehicle strikes", "Worker-vehicle collisions"],
        controlMeasures: ["Use truck-mounted attenuator", "Set up advance warning signs", "Position buffer vehicle"],
        responsible: "Traffic Control Lead",
        status: "not_started",
        photos: []
      },
      {
        id: "jsa-004-item-2",
        jsaId: "jsa-004",
        taskStep: "Post installation",
        potentialHazards: ["Noise exposure", "Struck-by", "Underground utilities"],
        controlMeasures: ["Wear hearing protection", "Maintain clear area", "Verify utility marking"],
        responsible: "Post Driver Operator",
        status: "not_started",
        photos: []
      },
      {
        id: "jsa-004-item-3",
        jsaId: "jsa-004",
        taskStep: "Rail attachment",
        potentialHazards: ["Cuts from metal edges", "Pinch points", "Manual handling injuries"],
        controlMeasures: ["Use cut-resistant gloves", "Be aware of hand placement", "Use proper lifting techniques"],
        responsible: "Guardrail Crew Lead",
        status: "not_started",
        photos: []
      }
    ],
    isTemplate: false,
    lastUpdated: "2025-05-09"
  },
  {
    id: "jsa-005",
    title: "Utility Locating for Main Yard Expansion",
    projectId: "P-1005",
    projectName: "Main Yard Expansion",
    location: "Company Main Yard, Doraville, GA",
    taskDescription: "Locating underground utilities before excavation",
    createdBy: "Amanda Rodriguez",
    createdDate: "2025-05-11",
    status: "draft",
    requiredPPE: ["Hard hat", "Safety glasses", "Hi-vis vest", "Steel-toed boots"],
    requiredEquipment: ["Utility locator", "Ground marking paint", "Flags", "Probing tools"],
    items: [
      {
        id: "jsa-005-item-1",
        jsaId: "jsa-005",
        taskStep: "Review utility maps",
        potentialHazards: ["Missing utilities", "Outdated information"],
        controlMeasures: ["Cross-reference multiple sources", "Contact utility companies", "Document findings"],
        responsible: "Project Manager",
        status: "not_started",
        photos: []
      },
      {
        id: "jsa-005-item-2",
        jsaId: "jsa-005",
        taskStep: "Electronic utility locating",
        potentialHazards: ["Slips, trips, and falls", "Traffic in yard", "Equipment damage"],
        controlMeasures: ["Clear walking path", "Use spotter in traffic areas", "Properly store equipment"],
        responsible: "Utility Locator",
        status: "not_started",
        photos: []
      },
      {
        id: "jsa-005-item-3",
        jsaId: "jsa-005",
        taskStep: "Mark and document utilities",
        potentialHazards: ["Exposure to traffic", "Weather conditions", "Incorrect marking"],
        controlMeasures: ["Use hi-vis clothing", "Postpone in severe weather", "Double-check markings"],
        responsible: "Safety Coordinator",
        status: "not_started",
        photos: []
      }
    ],
    isTemplate: false,
    lastUpdated: "2025-05-11"
  }
];

// Mock data for Toolbox Meetings
export const mockToolboxMeetingTemplates: ToolboxMeetingTemplate[] = [
  {
    id: "tbm-template-1",
    title: "PPE Usage and Inspection",
    category: "Personal Protective Equipment",
    description: "Review proper use and inspection of personal protective equipment",
    topics: [
      "Types of PPE required on site",
      "Proper inspection before use",
      "Maintenance and replacement criteria",
      "Common misuses and hazards"
    ],
    safetyFocus: "Preventing injuries through proper PPE usage",
    suggestedDuration: 15,
    materials: ["PPE samples", "Inspection checklist", "Visual aids"],
    createdBy: "Safety Director",
    createdDate: "2025-01-10",
    lastUpdated: "2025-04-05"
  },
  {
    id: "tbm-template-2",
    title: "Heat Stress Prevention",
    category: "Environmental Hazards",
    description: "Preventing heat-related illnesses on the job site",
    topics: [
      "Signs and symptoms of heat stress",
      "Hydration requirements",
      "Work-rest cycles",
      "Emergency response for heat illness"
    ],
    safetyFocus: "Preventing heat stress and heat stroke",
    suggestedDuration: 20,
    materials: ["Heat index chart", "Hydration guidelines", "Handouts"],
    createdBy: "Safety Manager",
    createdDate: "2025-02-15",
    lastUpdated: "2025-04-12"
  },
  {
    id: "tbm-template-3",
    title: "Excavation Safety",
    category: "Excavation",
    description: "Safe practices for trenching and excavation work",
    topics: [
      "Soil classification and stability",
      "Protective systems requirements",
      "Access and egress",
      "Daily inspections"
    ],
    safetyFocus: "Preventing cave-ins and excavation hazards",
    suggestedDuration: 25,
    materials: ["Soil testing demonstration", "Protective system examples", "OSHA pocket guide"],
    createdBy: "Field Supervisor",
    createdDate: "2025-03-20",
    lastUpdated: "2025-04-18"
  }
];

export const mockToolboxMeetings: ToolboxMeetingData[] = [
  {
    id: "tbm-001",
    title: "Monday Safety Briefing - PPE Focus",
    projectId: "P-1001",
    projectName: "I-85 Bridge Repair",
    location: "I-85 North, Atlanta, GA - Job Trailer",
    date: "2025-05-13",
    startTime: "07:00",
    endTime: "07:20",
    conductor: "John Smith",
    topics: ["Hard hat inspection", "Fall protection check", "Proper glove selection"],
    safetyFocus: "Ensuring all PPE is properly inspected before use",
    status: "completed",
    attendees: [
      {
        id: "att-001-1",
        meetingId: "tbm-001",
        employeeId: "EMP-1234",
        employeeName: "Mark Johnson",
        role: "Equipment Operator",
        status: "present",
        signatureTimestamp: "2025-05-13T07:18:00",
        feedback: "Requested new hard hat due to crack found during inspection"
      },
      {
        id: "att-001-2",
        meetingId: "tbm-001",
        employeeId: "EMP-2345",
        employeeName: "Sarah Williams",
        role: "Laborer",
        status: "present",
        signatureTimestamp: "2025-05-13T07:18:30"
      },
      {
        id: "att-001-3",
        meetingId: "tbm-001",
        employeeId: "EMP-3456",
        employeeName: "Robert Davis",
        role: "Supervisor",
        status: "present",
        signatureTimestamp: "2025-05-13T07:19:00"
      },
      {
        id: "att-001-4",
        meetingId: "tbm-001",
        employeeId: "EMP-4567",
        employeeName: "Jennifer Lopez",
        role: "Safety Officer",
        status: "present",
        signatureTimestamp: "2025-05-13T07:19:15"
      }
    ],
    notes: "PPE inspection led to discovery of 3 damaged hard hats that were immediately replaced.",
    attachments: ["meeting-photos.jpg", "replacement-form.pdf"],
    createdBy: "John Smith",
    createdDate: "2025-05-10",
    lastUpdated: "2025-05-13",
    weatherConditions: "Clear, 65°F",
    questionsAsked: ["How often should hard hats be replaced?", "When should fall protection be taken out of service?"],
    followUpActions: [
      {
        id: "follow-001-1",
        description: "Order 5 new hard hats for inventory",
        assignedTo: "Jennifer Lopez",
        dueDate: "2025-05-15",
        status: "pending"
      },
      {
        id: "follow-001-2",
        description: "Schedule fall protection training refresher",
        assignedTo: "Robert Davis",
        dueDate: "2025-05-20",
        status: "in_progress"
      }
    ]
  },
  {
    id: "tbm-002",
    title: "Heat Stress Prevention Briefing",
    projectId: "P-1002",
    projectName: "GA-400 Repaving",
    location: "GA-400 South, Alpharetta, GA - Site Office",
    date: "2025-05-14",
    startTime: "06:45",
    endTime: "07:10",
    conductor: "Emily Chen",
    topics: ["Heat illness prevention", "Hydration requirements", "Rest schedules for hot weather"],
    safetyFocus: "Preparing for forecasted high temperatures this week",
    status: "completed",
    attendees: [
      {
        id: "att-002-1",
        meetingId: "tbm-002",
        employeeId: "EMP-5678",
        employeeName: "Michael Brown",
        role: "Paver Operator",
        status: "present",
        signatureTimestamp: "2025-05-14T07:08:00"
      },
      {
        id: "att-002-2",
        meetingId: "tbm-002",
        employeeId: "EMP-6789",
        employeeName: "David Wilson",
        role: "Roller Operator",
        status: "present",
        signatureTimestamp: "2025-05-14T07:08:15"
      },
      {
        id: "att-002-3",
        meetingId: "tbm-002",
        employeeId: "EMP-7890",
        employeeName: "Thomas Wright",
        role: "Foreman",
        status: "present",
        signatureTimestamp: "2025-05-14T07:08:30"
      },
      {
        id: "att-002-4",
        meetingId: "tbm-002",
        employeeId: "EMP-8901",
        employeeName: "Lisa Martinez",
        role: "Traffic Control",
        status: "present",
        signatureTimestamp: "2025-05-14T07:08:45"
      },
      {
        id: "att-002-5",
        meetingId: "tbm-002",
        employeeId: "EMP-9012",
        employeeName: "Kevin Taylor",
        role: "Laborer",
        status: "absent"
      }
    ],
    notes: "Distributed electrolyte packets to all workers. Implemented mandatory hourly water breaks.",
    attachments: ["heat-index-chart.pdf", "cooling-station-setup.jpg"],
    createdBy: "Emily Chen",
    createdDate: "2025-05-12",
    lastUpdated: "2025-05-14",
    weatherConditions: "Clear, forecast high of 95°F",
    questionsAsked: ["How much water should we drink per hour?", "What are early signs of heat exhaustion?"],
    followUpActions: [
      {
        id: "follow-002-1",
        description: "Set up additional cooling station at north end of project",
        assignedTo: "Thomas Wright",
        dueDate: "2025-05-15",
        status: "pending"
      },
      {
        id: "follow-002-2",
        description: "Check in with Kevin Taylor about absence",
        assignedTo: "Thomas Wright",
        dueDate: "2025-05-14",
        status: "pending"
      }
    ]
  },
  {
    id: "tbm-003",
    title: "Excavation Safety Meeting",
    projectId: "P-1003",
    projectName: "I-75 Resurfacing",
    location: "I-75 North, Marietta, GA - Project Office",
    date: "2025-05-15",
    startTime: "07:00",
    endTime: "07:30",
    conductor: "Michael Lee",
    topics: ["Trench box installation", "Soil classification", "Emergency evacuation procedures"],
    safetyFocus: "Safe excavation practices for utility work",
    status: "scheduled",
    attendees: [
      {
        id: "att-003-1",
        meetingId: "tbm-003",
        employeeId: "EMP-0123",
        employeeName: "Christopher Moore",
        role: "Excavator Operator",
        status: "pending"
      },
      {
        id: "att-003-2",
        meetingId: "tbm-003",
        employeeId: "EMP-1234",
        employeeName: "Mark Johnson",
        role: "Equipment Operator",
        status: "pending"
      },
      {
        id: "att-003-3",
        meetingId: "tbm-003",
        employeeId: "EMP-2345",
        employeeName: "Sarah Williams",
        role: "Laborer",
        status: "pending"
      },
      {
        id: "att-003-4",
        meetingId: "tbm-003",
        employeeId: "EMP-3456",
        employeeName: "Robert Davis",
        role: "Supervisor",
        status: "pending"
      }
    ],
    notes: "Will include soil testing demonstration",
    attachments: ["excavation-safety-handout.pdf"],
    createdBy: "Michael Lee",
    createdDate: "2025-05-13",
    lastUpdated: "2025-05-13",
    weatherConditions: "Forecast calls for possible rain"
  },
  {
    id: "tbm-004",
    title: "Traffic Control Safety Briefing",
    projectId: "P-1004",
    projectName: "I-285 Bridge Project",
    location: "I-285 East, Dunwoody, GA - Field Office",
    date: "2025-05-16",
    startTime: "06:30",
    endTime: "07:00",
    conductor: "David Wilson",
    topics: ["Proper flagging techniques", "Communication signals", "Escape routes", "Night work visibility"],
    safetyFocus: "Traffic control for night paving operations",
    status: "scheduled",
    attendees: [
      {
        id: "att-004-1",
        meetingId: "tbm-004",
        employeeId: "EMP-8901",
        employeeName: "Lisa Martinez",
        role: "Traffic Control",
        status: "pending"
      },
      {
        id: "att-004-2",
        meetingId: "tbm-004",
        employeeId: "EMP-9012",
        employeeName: "Kevin Taylor",
        role: "Laborer",
        status: "pending"
      },
      {
        id: "att-004-3",
        meetingId: "tbm-004",
        employeeId: "EMP-0123",
        employeeName: "Christopher Moore",
        role: "Equipment Operator",
        status: "pending"
      },
      {
        id: "att-004-4",
        meetingId: "tbm-004",
        employeeId: "EMP-2345",
        employeeName: "Sarah Williams",
        role: "Laborer",
        status: "pending"
      }
    ],
    notes: "Will review updated traffic control plan for night work",
    attachments: ["traffic-control-plan.pdf", "night-work-checklist.pdf"],
    createdBy: "David Wilson",
    createdDate: "2025-05-14",
    lastUpdated: "2025-05-14"
  },
  {
    id: "tbm-005",
    title: "Equipment Inspection Briefing",
    projectId: "P-1005",
    projectName: "Main Yard Expansion",
    location: "Company Main Yard, Doraville, GA - Shop Area",
    date: "2025-05-17",
    startTime: "07:15",
    endTime: "07:45",
    conductor: "Amanda Rodriguez",
    topics: ["Daily equipment inspections", "Documentation requirements", "Common defects", "Reporting procedures"],
    safetyFocus: "Proper equipment inspection to prevent accidents",
    status: "scheduled",
    attendees: [
      {
        id: "att-005-1",
        meetingId: "tbm-005",
        employeeId: "EMP-5678",
        employeeName: "Michael Brown",
        role: "Equipment Operator",
        status: "pending"
      },
      {
        id: "att-005-2",
        meetingId: "tbm-005",
        employeeId: "EMP-6789",
        employeeName: "David Wilson",
        role: "Equipment Operator",
        status: "pending"
      },
      {
        id: "att-005-3",
        meetingId: "tbm-005",
        employeeId: "EMP-0123",
        employeeName: "Christopher Moore",
        role: "Equipment Operator",
        status: "pending"
      },
      {
        id: "att-005-4",
        meetingId: "tbm-005",
        employeeId: "EMP-3456",
        employeeName: "Robert Davis",
        role: "Supervisor",
        status: "pending"
      },
      {
        id: "att-005-5",
        meetingId: "tbm-005",
        employeeId: "EMP-4567",
        employeeName: "Jennifer Lopez",
        role: "Safety Officer",
        status: "pending"
      }
    ],
    notes: "Will include hands-on inspection demonstration on excavator",
    attachments: ["equipment-checklist.pdf"],
    createdBy: "Amanda Rodriguez",
    createdDate: "2025-05-15",
    lastUpdated: "2025-05-15"
  }
];

export default {
  mockSafetyIncidents,
  mockHazards,
  mockSafetyTrainings,
  mockSafetyCompliances,
  mockRisks,
  mockJSATemplates,
  mockJSAData,
  mockToolboxMeetingTemplates,
  mockToolboxMeetings
};
