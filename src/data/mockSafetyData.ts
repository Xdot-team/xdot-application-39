
import { SafetyIncident, Hazard, SafetyTraining, SafetyCompliance } from "@/types/safety";

export const mockSafetyIncidents: SafetyIncident[] = [
  {
    id: "inc-001",
    title: "Scaffold Collapse",
    description: "Partial collapse of scaffold on the east side of building A. No injuries reported, but equipment was damaged.",
    date: "2024-04-15T10:30:00Z",
    location: "Building A, East Wing, 3rd Floor",
    projectId: "proj-001",
    projectName: "Georgia Highway Expansion - Atlanta",
    reportedBy: "Michael Johnson",
    severity: "medium",
    status: "investigating",
    assignedTo: "Sarah Wilson",
    photos: ["/scaffold1.jpg", "/scaffold2.jpg"],
    witnesses: ["John Smith", "Lisa Rodriguez"],
    actions: [
      {
        id: "action-001",
        description: "Inspect all scaffolding on site",
        assignedTo: "Thomas Brown",
        dueDate: "2024-04-17",
        status: "completed",
        completedDate: "2024-04-16"
      },
      {
        id: "action-002",
        description: "Replace damaged equipment",
        assignedTo: "Carlos Diaz",
        dueDate: "2024-04-20",
        status: "in-progress"
      }
    ],
    followUpDate: "2024-04-22",
    oshaReportable: false
  },
  {
    id: "inc-002",
    title: "Chemical Spill",
    description: "Small spill of concrete sealer in storage area. Contained with spill kit, approximately 1 gallon.",
    date: "2024-04-10T14:15:00Z",
    location: "Material Storage Area B",
    projectId: "proj-002",
    projectName: "Georgia Bridge Rehabilitation - Savannah",
    reportedBy: "Emma Clarke",
    severity: "low",
    status: "resolved",
    photos: ["/spill1.jpg"],
    actions: [
      {
        id: "action-003",
        description: "Clean up spill area",
        assignedTo: "David Wilson",
        dueDate: "2024-04-10",
        status: "completed",
        completedDate: "2024-04-10"
      }
    ],
    resolutionNotes: "Area cleaned according to safety protocol. Containers secured properly to prevent future spills.",
    oshaReportable: false
  },
  {
    id: "inc-003",
    title: "Worker Fall",
    description: "Worker fell from height of 8 feet while working on roof installation. Suffered broken ankle and minor cuts.",
    date: "2024-03-28T09:45:00Z",
    location: "Building C, Roof",
    projectId: "proj-003",
    projectName: "Georgia School Construction - Athens",
    reportedBy: "Robert Taylor",
    severity: "high",
    status: "closed",
    assignedTo: "Margaret Chen",
    photos: [],
    witnesses: ["Kevin Barnes", "Patricia Lopez"],
    actions: [
      {
        id: "action-004",
        description: "Transport worker to hospital",
        status: "completed",
        completedDate: "2024-03-28"
      },
      {
        id: "action-005",
        description: "Investigate cause of fall",
        assignedTo: "Safety Officer",
        dueDate: "2024-03-30",
        status: "completed",
        completedDate: "2024-03-29"
      },
      {
        id: "action-006",
        description: "Review and update fall protection protocols",
        assignedTo: "Safety Manager",
        dueDate: "2024-04-05",
        status: "completed",
        completedDate: "2024-04-04"
      }
    ],
    resolutionNotes: "Worker received medical treatment. Investigation found improper harness use. All workers received refresher training on fall protection.",
    oshaReportable: true
  },
  {
    id: "inc-004",
    title: "Electrical Shock",
    description: "Worker received minor electrical shock while using power tool. No serious injury, but worker sent for medical evaluation.",
    date: "2024-04-05T13:20:00Z",
    location: "Electrical Room, Building B",
    projectId: "proj-004",
    projectName: "Georgia Office Complex - Columbus",
    reportedBy: "Steven Wright",
    severity: "medium",
    status: "closed",
    photos: ["/electrical1.jpg"],
    witnesses: ["Linda Martinez"],
    actions: [
      {
        id: "action-007",
        description: "Medical evaluation of affected worker",
        status: "completed",
        completedDate: "2024-04-05"
      },
      {
        id: "action-008",
        description: "Inspect all power tools on site",
        assignedTo: "Electrical Supervisor",
        dueDate: "2024-04-07",
        status: "completed",
        completedDate: "2024-04-06"
      }
    ],
    resolutionNotes: "Worker cleared by medical. Faulty tool was removed from service and replaced.",
    oshaReportable: false
  },
  {
    id: "inc-005",
    title: "Heat Exhaustion",
    description: "Two workers showing signs of heat exhaustion during afternoon work shift. Both given fluids and rest in shaded area.",
    date: "2024-04-20T15:45:00Z",
    location: "Outdoor Site, South Section",
    projectId: "proj-005",
    projectName: "Georgia Highway Maintenance - Macon",
    reportedBy: "James Wilson",
    severity: "medium",
    status: "closed",
    actions: [
      {
        id: "action-009",
        description: "Provide immediate first aid to affected workers",
        status: "completed",
        completedDate: "2024-04-20"
      },
      {
        id: "action-010",
        description: "Review heat safety protocols",
        assignedTo: "Site Supervisor",
        dueDate: "2024-04-22",
        status: "completed",
        completedDate: "2024-04-21"
      }
    ],
    resolutionNotes: "Workers recovered after rest. Additional water stations added to site. Work schedule adjusted to avoid peak heat hours.",
    oshaReportable: false
  }
];

export const mockHazards: Hazard[] = [
  {
    id: "haz-001",
    type: "structural",
    description: "Cracked support beam in the northeast corner of Building A, first floor.",
    location: "Building A, Northeast Corner, 1st Floor",
    projectId: "proj-001",
    projectName: "Georgia Highway Expansion - Atlanta",
    reportedBy: "Thomas Brown",
    reportedDate: "2024-04-18T08:15:00Z",
    severity: "high",
    status: "active",
    photos: ["/beam1.jpg", "/beam2.jpg"],
  },
  {
    id: "haz-002",
    type: "electrical",
    description: "Exposed wiring near water source in basement utility room.",
    location: "Building B, Basement, Utility Room",
    projectId: "proj-002",
    projectName: "Georgia Bridge Rehabilitation - Savannah",
    reportedBy: "Lisa Rodriguez",
    reportedDate: "2024-04-16T13:45:00Z",
    severity: "high",
    status: "mitigated",
    photos: ["/wiring1.jpg"],
    mitigationSteps: "Temporary shielding installed and water source redirected. Permanent fix scheduled.",
    mitigatedBy: "Carlos Diaz",
    mitigatedDate: "2024-04-17T09:30:00Z",
  },
  {
    id: "haz-003",
    type: "fall",
    description: "Missing guardrail on 2nd floor balcony.",
    location: "Building C, 2nd Floor, West Balcony",
    projectId: "proj-003",
    projectName: "Georgia School Construction - Athens",
    reportedBy: "Emma Clarke",
    reportedDate: "2024-04-14T11:20:00Z",
    severity: "medium",
    status: "resolved",
    photos: ["/rail1.jpg"],
    mitigationSteps: "Temporary barrier installed immediately. Permanent guardrail installed following day.",
    mitigatedBy: "Maintenance Team",
    mitigatedDate: "2024-04-15T16:00:00Z",
  }
];

export const mockSafetyTrainings: SafetyTraining[] = [
  {
    id: "train-001",
    title: "Fall Protection Training",
    description: "Comprehensive training on proper use of fall protection equipment and hazard recognition.",
    requiredFor: ["Roofers", "Scaffold Workers", "Steel Workers", "Supervisors"],
    frequency: "annually",
    duration: 240,
    materials: ["Fall protection handbook", "Safety harness manual"],
    certificationProduced: true
  },
  {
    id: "train-002",
    title: "First Aid & CPR",
    description: "Basic first aid and CPR training for emergency response on construction sites.",
    requiredFor: ["Site Supervisors", "Safety Officers", "Crew Leaders"],
    frequency: "biannually",
    duration: 480,
    certificationProduced: true
  },
  {
    id: "train-003",
    title: "Hazard Communication (HAZCOM)",
    description: "Training on chemical hazards, labeling, and safety data sheets.",
    requiredFor: ["All Workers"],
    frequency: "annually",
    duration: 120,
    materials: ["HAZCOM manual", "SDS examples"],
    certificationProduced: false
  },
  {
    id: "train-004",
    title: "Confined Space Entry",
    description: "Procedures for safe entry and work in confined spaces.",
    requiredFor: ["Maintenance Workers", "Utility Workers", "Supervisors"],
    frequency: "annually",
    duration: 360,
    certificationProduced: true
  }
];

export const mockSafetyCompliance: SafetyCompliance[] = [
  {
    id: "comp-001",
    standard: "OSHA 1926 Subpart M - Fall Protection",
    description: "Requirements for fall protection in construction workplaces.",
    applicableTo: ["All Height Work"],
    checklistItems: [
      {
        id: "comp-001-item-1",
        description: "Fall protection provided at heights of 6 feet or more",
        required: true,
        status: "compliant",
        lastChecked: "2024-04-15"
      },
      {
        id: "comp-001-item-2",
        description: "Guardrail systems meet height and strength requirements",
        required: true,
        status: "compliant",
        lastChecked: "2024-04-15"
      },
      {
        id: "comp-001-item-3",
        description: "Personal fall arrest systems inspected before each use",
        required: true,
        status: "non-compliant",
        lastChecked: "2024-04-15",
        notes: "Some workers not performing inspections consistently"
      },
      {
        id: "comp-001-item-4",
        description: "Warning line systems used on low-slope roofs",
        required: false,
        status: "not-applicable",
        notes: "No current work on low-slope roofs"
      }
    ],
    nextReviewDate: "2024-10-15"
  },
  {
    id: "comp-002",
    standard: "OSHA 1926 Subpart C - General Safety and Health",
    description: "General requirements for safety and health provisions.",
    applicableTo: ["All Construction Sites"],
    checklistItems: [
      {
        id: "comp-002-item-1",
        description: "Accident prevention responsibilities assigned",
        required: true,
        status: "compliant",
        lastChecked: "2024-04-10"
      },
      {
        id: "comp-002-item-2",
        description: "Safety training provided to employees",
        required: true,
        status: "compliant",
        lastChecked: "2024-04-10"
      },
      {
        id: "comp-002-item-3",
        description: "First aid supplies readily available",
        required: true,
        status: "compliant",
        lastChecked: "2024-04-10"
      }
    ],
    nextReviewDate: "2024-10-10"
  }
];
