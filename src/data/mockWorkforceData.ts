import { 
  EmployeeProfile, 
  Onboarding, 
  TimeCard,
  EmployeeAppreciation,
  Subcontractor,
  EmployeeHealth
} from "@/types/workforce";

// Mock Employee Profiles
export const mockEmployees: EmployeeProfile[] = [
  {
    id: "emp-001",
    employeeId: "E10001",
    firstName: "John",
    lastName: "Daniels",
    email: "john.daniels@xdotcontractor.com",
    phone: "404-555-1234",
    role: "project_manager",
    department: "Operations",
    hireDate: "2022-03-15",
    status: "active",
    payRate: 42.50,
    certifications: [
      {
        id: "cert-001",
        type: "Project Management",
        issuedDate: "2021-02-10",
        expiryDate: "2024-02-10",
        issuingAuthority: "PMI",
        verified: true
      },
      {
        id: "cert-002",
        type: "OSHA",
        issuedDate: "2022-01-15",
        expiryDate: "2024-01-15",
        issuingAuthority: "OSHA",
        verified: true
      }
    ],
    skills: ["Project Planning", "Team Leadership", "Budgeting", "Scheduling"],
    currentProject: "proj-001",
    supervisorId: "emp-023"
  },
  {
    id: "emp-002",
    employeeId: "E10002",
    firstName: "Sarah",
    lastName: "Martinez",
    email: "sarah.martinez@xdotcontractor.com",
    phone: "404-555-2345",
    role: "safety_officer",
    department: "Safety",
    hireDate: "2021-06-10",
    status: "active",
    payRate: 38.75,
    certifications: [
      {
        id: "cert-003",
        type: "OSHA",
        issuedDate: "2020-05-20",
        expiryDate: "2023-05-20",
        issuingAuthority: "OSHA",
        verified: true
      },
      {
        id: "cert-004",
        type: "First Aid",
        issuedDate: "2022-03-11",
        expiryDate: "2024-03-11",
        issuingAuthority: "Red Cross",
        verified: true
      },
      {
        id: "cert-005",
        type: "CPR",
        issuedDate: "2022-03-11",
        expiryDate: "2024-03-11",
        issuingAuthority: "Red Cross",
        verified: true
      }
    ],
    skills: ["Safety Inspections", "Risk Assessment", "Training", "Compliance"],
    supervisorId: "emp-023"
  },
  {
    id: "emp-003",
    employeeId: "E10003",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@xdotcontractor.com",
    phone: "404-555-3456",
    role: "foreman",
    department: "Field Operations",
    hireDate: "2020-11-05",
    status: "active",
    payRate: 35.25,
    certifications: [
      {
        id: "cert-006",
        type: "OSHA",
        issuedDate: "2019-12-10",
        expiryDate: "2022-12-10",
        issuingAuthority: "OSHA",
        verified: true
      },
      {
        id: "cert-007",
        type: "Scaffold",
        issuedDate: "2021-04-22",
        expiryDate: "2024-04-22",
        issuingAuthority: "SAIA",
        verified: true
      }
    ],
    skills: ["Crew Management", "Blueprint Reading", "Equipment Operation"],
    currentProject: "proj-001",
    supervisorId: "emp-001"
  },
  {
    id: "emp-004",
    employeeId: "E10004",
    firstName: "Lisa",
    lastName: "Washington",
    email: "lisa.washington@xdotcontractor.com",
    phone: "404-555-4567",
    role: "hr_specialist",
    department: "Human Resources",
    hireDate: "2021-01-15",
    status: "active",
    payRate: 37.50,
    certifications: [
      {
        id: "cert-008",
        type: "SHRM-CP",
        issuedDate: "2020-02-15",
        expiryDate: "2023-02-15",
        issuingAuthority: "SHRM",
        verified: true
      }
    ],
    skills: ["Recruitment", "Employee Relations", "Benefits Administration", "Onboarding"],
    supervisorId: "emp-023"
  },
  {
    id: "emp-005",
    employeeId: "E10005",
    firstName: "Robert",
    lastName: "Chen",
    email: "robert.chen@xdotcontractor.com",
    phone: "404-555-5678",
    role: "estimator",
    department: "Estimating",
    hireDate: "2021-08-20",
    status: "active",
    payRate: 39.25,
    certifications: [
      {
        id: "cert-009",
        type: "CPE",
        issuedDate: "2019-10-25",
        expiryDate: "2022-10-25",
        issuingAuthority: "ASPE",
        verified: true
      }
    ],
    skills: ["Cost Analysis", "Blueprint Reading", "Material Takeoff", "Bidding"],
    supervisorId: "emp-023"
  },
  {
    id: "emp-006",
    employeeId: "E10006",
    firstName: "James",
    lastName: "Smith",
    email: "james.smith@xdotcontractor.com",
    phone: "404-555-6789",
    role: "operator",
    department: "Field Operations",
    hireDate: "2022-02-10",
    status: "active",
    payRate: 32.75,
    certifications: [
      {
        id: "cert-010",
        type: "CDL",
        issuedDate: "2021-01-05",
        expiryDate: "2025-01-05",
        issuingAuthority: "GA DDS",
        verified: true
      },
      {
        id: "cert-011",
        type: "Crane Operation",
        issuedDate: "2021-11-15",
        expiryDate: "2024-11-15",
        issuingAuthority: "NCCCO",
        verified: true
      }
    ],
    skills: ["Heavy Equipment", "Excavation", "Grading", "Site Preparation"],
    currentProject: "proj-002",
    supervisorId: "emp-003"
  },
  {
    id: "emp-007",
    employeeId: "E10007",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@xdotcontractor.com",
    phone: "404-555-7890",
    role: "accountant",
    department: "Finance",
    hireDate: "2021-04-05",
    status: "active",
    payRate: 36.50,
    certifications: [
      {
        id: "cert-012",
        type: "CPA",
        issuedDate: "2019-05-20",
        expiryDate: "2023-05-20",
        issuingAuthority: "AICPA",
        verified: true
      }
    ],
    skills: ["Financial Reporting", "Cost Accounting", "Payroll", "Budgeting"],
    supervisorId: "emp-023"
  }
];

// Mock Time Cards
export const mockTimeCards: TimeCard[] = [
  {
    id: "tc-001",
    employeeId: "emp-001",
    employeeName: "John Daniels",
    date: "2023-05-15",
    projectId: "proj-001",
    projectName: "Atlanta Highway Expansion",
    hoursWorked: 8,
    overtimeHours: 0,
    tasks: [
      {
        taskId: "task-001",
        description: "Site inspection",
        hours: 3
      },
      {
        taskId: "task-002",
        description: "Team coordination",
        hours: 5
      }
    ],
    status: "approved",
    submittedAt: "2023-05-15T17:30:00",
    approvedBy: "emp-023",
    approvedAt: "2023-05-16T09:15:00"
  },
  {
    id: "tc-002",
    employeeId: "emp-003",
    employeeName: "Michael Johnson",
    date: "2023-05-15",
    projectId: "proj-001",
    projectName: "Atlanta Highway Expansion",
    hoursWorked: 8,
    overtimeHours: 2,
    tasks: [
      {
        taskId: "task-003",
        description: "Excavation supervision",
        hours: 8
      },
      {
        taskId: "task-004",
        description: "Safety briefing",
        hours: 2
      }
    ],
    status: "submitted",
    submittedAt: "2023-05-15T18:45:00"
  },
  {
    id: "tc-003",
    employeeId: "emp-006",
    employeeName: "James Smith",
    date: "2023-05-15",
    projectId: "proj-002",
    projectName: "Marietta Bridge Repair",
    hoursWorked: 7.5,
    overtimeHours: 0,
    tasks: [
      {
        taskId: "task-005",
        description: "Equipment operation",
        hours: 6
      },
      {
        taskId: "task-006",
        description: "Equipment maintenance",
        hours: 1.5
      }
    ],
    status: "approved",
    submittedAt: "2023-05-15T16:30:00",
    approvedBy: "emp-003",
    approvedAt: "2023-05-16T08:30:00"
  },
  {
    id: "tc-004",
    employeeId: "emp-002",
    employeeName: "Sarah Martinez",
    date: "2023-05-16",
    hoursWorked: 8,
    overtimeHours: 0,
    tasks: [
      {
        taskId: "task-007",
        description: "Safety inspections",
        hours: 5
      },
      {
        taskId: "task-008",
        description: "Training session",
        hours: 3
      }
    ],
    status: "draft"
  },
  {
    id: "tc-005",
    employeeId: "emp-005",
    employeeName: "Robert Chen",
    date: "2023-05-15",
    projectId: "proj-003",
    projectName: "Decatur Office Complex",
    hoursWorked: 8,
    overtimeHours: 1,
    tasks: [
      {
        taskId: "task-009",
        description: "Cost estimation",
        hours: 6
      },
      {
        taskId: "task-010",
        description: "Vendor meetings",
        hours: 3
      }
    ],
    status: "submitted",
    submittedAt: "2023-05-15T18:15:00"
  }
];

// Mock Onboardings
export const mockOnboardings: Onboarding[] = [
  {
    id: "onb-001",
    employeeId: "E10008",
    status: "documents_submitted",
    startDate: "2023-05-01",
    documents: [
      {
        id: "doc-001",
        name: "I-9 Form",
        status: "submitted",
        url: "https://example.com/docs/i9-e10008.pdf",
        submittedDate: "2023-05-02"
      },
      {
        id: "doc-002",
        name: "W-4 Form",
        status: "submitted",
        url: "https://example.com/docs/w4-e10008.pdf",
        submittedDate: "2023-05-02"
      },
      {
        id: "doc-003",
        name: "Direct Deposit Form",
        status: "pending"
      },
      {
        id: "doc-004",
        name: "Emergency Contact Form",
        status: "approved",
        url: "https://example.com/docs/emergency-e10008.pdf",
        submittedDate: "2023-05-02"
      }
    ],
    trainingCompleted: [],
    notes: "All tax forms received, waiting on direct deposit information."
  },
  {
    id: "onb-002",
    employeeId: "E10009",
    status: "background_check",
    startDate: "2023-04-15",
    documents: [
      {
        id: "doc-005",
        name: "I-9 Form",
        status: "approved",
        url: "https://example.com/docs/i9-e10009.pdf",
        submittedDate: "2023-04-16"
      },
      {
        id: "doc-006",
        name: "W-4 Form",
        status: "approved",
        url: "https://example.com/docs/w4-e10009.pdf",
        submittedDate: "2023-04-16"
      },
      {
        id: "doc-007",
        name: "Direct Deposit Form",
        status: "approved",
        url: "https://example.com/docs/dd-e10009.pdf",
        submittedDate: "2023-04-16"
      },
      {
        id: "doc-008",
        name: "Background Check Authorization",
        status: "approved",
        url: "https://example.com/docs/bg-e10009.pdf",
        submittedDate: "2023-04-16"
      }
    ],
    trainingCompleted: [],
    notes: "Background check initiated on 2023-04-17, waiting for results."
  },
  {
    id: "onb-003",
    employeeId: "E10010",
    status: "training",
    startDate: "2023-03-20",
    documents: [
      {
        id: "doc-009",
        name: "I-9 Form",
        status: "approved",
        url: "https://example.com/docs/i9-e10010.pdf",
        submittedDate: "2023-03-21"
      },
      {
        id: "doc-010",
        name: "W-4 Form",
        status: "approved",
        url: "https://example.com/docs/w4-e10010.pdf",
        submittedDate: "2023-03-21"
      },
      {
        id: "doc-011",
        name: "Direct Deposit Form",
        status: "approved",
        url: "https://example.com/docs/dd-e10010.pdf",
        submittedDate: "2023-03-21"
      },
      {
        id: "doc-012",
        name: "Employee Handbook Acknowledgement",
        status: "approved",
        url: "https://example.com/docs/handbook-e10010.pdf",
        submittedDate: "2023-03-22"
      }
    ],
    trainingCompleted: [
      {
        id: "train-001",
        name: "Company Orientation",
        date: "2023-03-27",
        instructor: "Lisa Washington"
      },
      {
        id: "train-002",
        name: "Safety Basics",
        date: "2023-03-28",
        instructor: "Sarah Martinez"
      }
    ],
    notes: "Scheduled for equipment training on 2023-05-22."
  },
  {
    id: "onb-004",
    employeeId: "E10011",
    status: "completed",
    startDate: "2023-02-01",
    completedDate: "2023-02-28",
    documents: [
      {
        id: "doc-013",
        name: "I-9 Form",
        status: "approved",
        url: "https://example.com/docs/i9-e10011.pdf",
        submittedDate: "2023-02-02"
      },
      {
        id: "doc-014",
        name: "W-4 Form",
        status: "approved",
        url: "https://example.com/docs/w4-e10011.pdf",
        submittedDate: "2023-02-02"
      },
      {
        id: "doc-015",
        name: "Direct Deposit Form",
        status: "approved",
        url: "https://example.com/docs/dd-e10011.pdf",
        submittedDate: "2023-02-03"
      },
      {
        id: "doc-016",
        name: "Employee Handbook Acknowledgement",
        status: "approved",
        url: "https://example.com/docs/handbook-e10011.pdf",
        submittedDate: "2023-02-03"
      }
    ],
    trainingCompleted: [
      {
        id: "train-003",
        name: "Company Orientation",
        date: "2023-02-06",
        instructor: "Lisa Washington"
      },
      {
        id: "train-004",
        name: "Safety Basics",
        date: "2023-02-07",
        instructor: "Sarah Martinez"
      },
      {
        id: "train-005",
        name: "Equipment Operation",
        date: "2023-02-15",
        instructor: "Michael Johnson"
      },
      {
        id: "train-006",
        name: "Job Site Protocols",
        date: "2023-02-21",
        instructor: "John Daniels"
      }
    ],
    notes: "Successfully completed all onboarding requirements."
  }
];

// Mock Employee Appreciations
export const mockAppreciations: EmployeeAppreciation[] = [
  {
    id: "app-001",
    employeeId: "emp-003",
    employeeName: "Michael Johnson",
    message: "Exceptional leadership in managing the site excavation ahead of schedule despite challenging weather conditions.",
    givenBy: "emp-001",
    givenByName: "John Daniels",
    date: "2023-05-10",
    type: "performance",
    public: true,
    reactions: [
      {
        userId: "emp-002",
        reaction: "celebrate"
      },
      {
        userId: "emp-006",
        reaction: "like"
      },
      {
        userId: "emp-023",
        reaction: "celebrate"
      }
    ]
  },
  {
    id: "app-002",
    employeeId: "emp-002",
    employeeName: "Sarah Martinez",
    message: "Implemented new safety protocols that reduced site incidents by 30% this quarter. Great job promoting a safety-first culture!",
    givenBy: "emp-023",
    givenByName: "Thomas Wilson",
    date: "2023-05-05",
    type: "safety",
    public: true,
    reactions: [
      {
        userId: "emp-001",
        reaction: "like"
      },
      {
        userId: "emp-004",
        reaction: "celebrate"
      }
    ]
  },
  {
    id: "app-003",
    employeeId: "emp-006",
    employeeName: "James Smith",
    message: "Consistently demonstrates excellent equipment operation skills and always maintains his machinery in top condition.",
    givenBy: "emp-003",
    givenByName: "Michael Johnson",
    date: "2023-05-08",
    type: "performance",
    public: true,
    reactions: [
      {
        userId: "emp-001",
        reaction: "like"
      }
    ]
  },
  {
    id: "app-004",
    employeeId: "emp-005",
    employeeName: "Robert Chen",
    message: "Developed a new estimation template that has improved our bidding accuracy by 15%. This innovation is helping us win more contracts!",
    givenBy: "emp-023",
    givenByName: "Thomas Wilson",
    date: "2023-04-28",
    type: "innovation",
    public: true,
    reactions: [
      {
        userId: "emp-001",
        reaction: "celebrate"
      },
      {
        userId: "emp-007",
        reaction: "thank"
      }
    ]
  },
  {
    id: "app-005",
    employeeId: "emp-004",
    employeeName: "Lisa Washington",
    message: "Successfully coordinated our annual safety training event with 100% employee participation. Your organizational skills made this possible!",
    givenBy: "emp-023",
    givenByName: "Thomas Wilson",
    date: "2023-05-02",
    type: "teamwork",
    public: true,
    reactions: [
      {
        userId: "emp-002",
        reaction: "like"
      },
      {
        userId: "emp-001",
        reaction: "celebrate"
      }
    ]
  }
];

// Mock Subcontractors
export const mockSubcontractors: Subcontractor[] = [
  {
    id: "sub-001",
    companyName: "Atlanta Electrical Solutions",
    contactName: "David Park",
    email: "david@atlantaelectrical.com",
    phone: "404-555-8901",
    specialties: ["Electrical", "Lighting", "Power Systems"],
    contractStart: "2023-01-15",
    insuranceExpiry: "2023-12-31",
    rate: {
      amount: 85,
      unit: "hourly"
    },
    currentProjects: [
      {
        projectId: "proj-001",
        projectName: "Atlanta Highway Expansion",
        role: "Electrical Contractor"
      },
      {
        projectId: "proj-003",
        projectName: "Decatur Office Complex",
        role: "Electrical Contractor"
      }
    ],
    documents: [
      {
        id: "sub-doc-001",
        name: "Insurance Certificate",
        url: "https://example.com/docs/insurance-sub001.pdf",
        uploadDate: "2023-01-10"
      },
      {
        id: "sub-doc-002",
        name: "Master Agreement",
        url: "https://example.com/docs/agreement-sub001.pdf",
        uploadDate: "2023-01-10"
      },
      {
        id: "sub-doc-003",
        name: "Electrical License",
        url: "https://example.com/docs/license-sub001.pdf",
        uploadDate: "2023-01-10",
        expiryDate: "2025-06-30"
      }
    ],
    performance: {
      rating: 4.8,
      completedProjects: 7,
      notes: "Exceptional quality work, very reliable."
    }
  },
  {
    id: "sub-002",
    companyName: "Georgia Concrete Professionals",
    contactName: "Marcus Johnson",
    email: "marcus@gaconcrete.com",
    phone: "404-555-9012",
    specialties: ["Concrete Pouring", "Foundation Work", "Concrete Finishing"],
    contractStart: "2022-11-01",
    contractEnd: "2023-10-31",
    insuranceExpiry: "2023-11-30",
    rate: {
      amount: 5500,
      unit: "project"
    },
    currentProjects: [
      {
        projectId: "proj-002",
        projectName: "Marietta Bridge Repair",
        role: "Concrete Specialist"
      }
    ],
    documents: [
      {
        id: "sub-doc-004",
        name: "Insurance Certificate",
        url: "https://example.com/docs/insurance-sub002.pdf",
        uploadDate: "2022-10-25"
      },
      {
        id: "sub-doc-005",
        name: "Contract Agreement",
        url: "https://example.com/docs/agreement-sub002.pdf",
        uploadDate: "2022-10-25"
      }
    ],
    performance: {
      rating: 4.5,
      completedProjects: 5,
      notes: "High quality work but occasionally misses deadlines."
    }
  },
  {
    id: "sub-003",
    companyName: "Southern HVAC Specialists",
    contactName: "Jennifer Williams",
    email: "jennifer@southernhvac.com",
    phone: "404-555-0123",
    specialties: ["HVAC Installation", "Ventilation", "Climate Control"],
    contractStart: "2023-02-01",
    insuranceExpiry: "2024-01-31",
    rate: {
      amount: 75,
      unit: "hourly"
    },
    currentProjects: [
      {
        projectId: "proj-003",
        projectName: "Decatur Office Complex",
        role: "HVAC Contractor"
      }
    ],
    documents: [
      {
        id: "sub-doc-006",
        name: "Insurance Certificate",
        url: "https://example.com/docs/insurance-sub003.pdf",
        uploadDate: "2023-01-25"
      },
      {
        id: "sub-doc-007",
        name: "Service Agreement",
        url: "https://example.com/docs/agreement-sub003.pdf",
        uploadDate: "2023-01-25"
      },
      {
        id: "sub-doc-008",
        name: "HVAC Certification",
        url: "https://example.com/docs/certification-sub003.pdf",
        uploadDate: "2023-01-25",
        expiryDate: "2026-03-15"
      }
    ],
    performance: {
      rating: 5,
      completedProjects: 3,
      notes: "Excellent quality and always on schedule."
    }
  }
];

// Mock Employee Health Records
export const mockHealthRecords: EmployeeHealth[] = [
  {
    id: "health-001",
    employeeId: "emp-001",
    employeeName: "John Daniels",
    recordDate: "2023-04-15",
    recordType: "routine_check",
    healthStatus: "fit_for_duty",
    medicalNotes: "Annual health assessment completed. All vitals within normal range.",
    recordedBy: "emp-004", // Lisa Washington (HR)
    confidential: true,
    wellnessPrograms: [
      {
        programId: "wp-001",
        programName: "Stress Management Workshop",
        startDate: "2023-05-01",
        endDate: "2023-05-30",
        status: "completed",
        notes: "Completed all sessions with positive feedback"
      }
    ]
  },
  {
    id: "health-002",
    employeeId: "emp-003",
    employeeName: "Michael Johnson",
    recordDate: "2023-03-22",
    recordType: "injury_assessment",
    healthStatus: "restricted_duty",
    medicalNotes: "Minor back strain from lifting materials. No serious injuries detected on examination.",
    restrictions: "No heavy lifting (>20lbs) for 2 weeks. Limited bending and twisting.",
    followUpDate: "2023-04-05",
    clearanceDate: "2023-04-05",
    recordedBy: "emp-004", // Lisa Washington (HR)
    confidential: true,
    attachments: [
      {
        id: "att-001",
        name: "Doctor's Note - Michael Johnson",
        url: "https://example.com/docs/medical-mj-032223.pdf",
        uploadDate: "2023-03-22"
      }
    ]
  },
  {
    id: "health-003",
    employeeId: "emp-006",
    employeeName: "James Smith",
    recordDate: "2023-05-10",
    recordType: "return_to_work",
    healthStatus: "fit_for_duty",
    medicalNotes: "Returning after recovery from flu. All symptoms resolved. Cleared for full duty.",
    recordedBy: "emp-004", // Lisa Washington (HR)
    confidential: true
  },
  {
    id: "health-004",
    employeeId: "emp-002",
    employeeName: "Sarah Martinez",
    recordDate: "2023-02-18",
    recordType: "wellness_program",
    healthStatus: "fit_for_duty",
    medicalNotes: "Enrolled in company wellness initiative. Initial health metrics recorded for baseline.",
    recordedBy: "emp-004", // Lisa Washington (HR)
    confidential: false,
    wellnessPrograms: [
      {
        programId: "wp-002",
        programName: "Fatigue Management Program",
        startDate: "2023-02-20",
        status: "active",
        notes: "Participating in weekly monitoring and education sessions"
      },
      {
        programId: "wp-003",
        programName: "Ergonomic Assessment",
        startDate: "2023-03-01",
        endDate: "2023-03-01",
        status: "completed",
        notes: "Workstation adjustments recommended and implemented"
      }
    ]
  },
  {
    id: "health-005",
    employeeId: "emp-005",
    employeeName: "Robert Chen",
    recordDate: "2023-04-30",
    recordType: "routine_check",
    healthStatus: "pending_evaluation",
    medicalNotes: "Annual health check performed. Awaiting lab results for final clearance.",
    followUpDate: "2023-05-07",
    recordedBy: "emp-004", // Lisa Washington (HR)
    confidential: true
  }
];
