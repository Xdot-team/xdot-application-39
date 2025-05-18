
import { Project, AIABilling, ExpandedChangeOrder } from "@/types/projects";

// Function to generate random projects for the demo
export function generateMockProjects(): Project[] {
  const projects: Project[] = [
    {
      id: "1",
      name: "I-85 North Expansion",
      projectId: "GA-DOT-2025-001",
      description: "Widening of I-85 from 4 to 6 lanes between exits 129 and 137",
      status: "active",
      location: "Gwinnett County, GA",
      contractValue: 24500000,
      startDate: "2025-01-15",
      endDate: "2026-07-30",
      clientName: "Georgia Department of Transportation",
      projectManager: "Thomas Rodriguez",
      completedTasks: 45,
      totalTasks: 120,
      rfiCount: 12,
      delayDays: 0,
    },
    {
      id: "2",
      name: "SR-316 Interchange Improvement",
      projectId: "GA-DOT-2025-008",
      description: "Construction of new interchange at SR-316 and Harbins Road",
      status: "upcoming",
      location: "Dacula, GA",
      contractValue: 18750000,
      startDate: "2025-09-01",
      endDate: "2026-12-15",
      clientName: "Georgia Department of Transportation",
      projectManager: "Sarah Johnson",
      completedTasks: 0,
      totalTasks: 95,
      rfiCount: 0,
      delayDays: 0,
    },
    {
      id: "3",
      name: "Peachtree Road Resurfacing",
      projectId: "ATL-DOT-2024-045",
      description: "Complete resurfacing of 3.2 miles of Peachtree Rd NE",
      status: "completed",
      location: "Atlanta, GA",
      contractValue: 4250000,
      startDate: "2024-03-15",
      endDate: "2024-08-20",
      clientName: "City of Atlanta",
      projectManager: "Michael Chen",
      completedTasks: 72,
      totalTasks: 72,
      rfiCount: 8,
      delayDays: 5,
    },
    {
      id: "4",
      name: "Oak Ridge Bridge Rehabilitation",
      projectId: "GA-DOT-2024-032",
      description: "Structural repairs and deck replacement for Oak Ridge Bridge",
      status: "active",
      location: "Cherokee County, GA",
      contractValue: 7820000,
      startDate: "2024-06-10",
      endDate: "2025-04-30",
      clientName: "Georgia Department of Transportation",
      projectManager: "Amanda Williams",
      completedTasks: 28,
      totalTasks: 65,
      rfiCount: 9,
      delayDays: 3,
    },
    {
      id: "5",
      name: "Riverside Parkway Extension",
      projectId: "COB-2024-012",
      description: "Construction of 1.8 mile extension of Riverside Parkway",
      status: "active",
      location: "Cobb County, GA",
      contractValue: 12450000,
      startDate: "2024-04-22",
      endDate: "2025-06-15",
      clientName: "Cobb County DOT",
      projectManager: "Thomas Rodriguez",
      completedTasks: 35,
      totalTasks: 88,
      rfiCount: 7,
      delayDays: 0,
    },
    {
      id: "6",
      name: "Hartsfield-Jackson Taxiway Repair",
      projectId: "ATL-AIR-2024-007",
      description: "Reconstruction of Taxiway E at Hartsfield-Jackson Airport",
      status: "completed",
      location: "Atlanta, GA",
      contractValue: 9650000,
      startDate: "2024-01-10",
      endDate: "2024-05-28",
      clientName: "Atlanta Airport Authority",
      projectManager: "David Park",
      completedTasks: 54,
      totalTasks: 54,
      rfiCount: 5,
      delayDays: 0,
    },
  ];
  
  return projects;
}

// Mock AIA Billings
export const mockAIABillings: AIABilling[] = [
  {
    id: "aia1",
    projectId: "1", // I-85 North Expansion
    formType: "G702",
    applicationNumber: 1,
    billingPeriodStart: "2025-01-15",
    billingPeriodEnd: "2025-02-28",
    submissionDate: "2025-03-05",
    approvalDate: "2025-03-12",
    approvedBy: "John Doe",
    status: "approved",
    originalContractSum: 24500000,
    changeOrdersSum: 0,
    contractSumToDate: 24500000,
    totalCompletedStored: 2450000, // 10%
    retainagePercentage: 5,
    retainageAmount: 122500,
    totalEarnedLessRetainage: 2327500,
    previousCertificates: 0,
    currentPaymentDue: 2327500,
    balanceToFinish: 22050000,
    lineItems: [],
    notes: "Initial site work and mobilization."
  },
  {
    id: "aia2",
    projectId: "1", // I-85 North Expansion
    formType: "G702",
    applicationNumber: 2,
    billingPeriodStart: "2025-03-01",
    billingPeriodEnd: "2025-03-31",
    submissionDate: "2025-04-05",
    approvalDate: "2025-04-10",
    approvedBy: "John Doe",
    status: "approved",
    originalContractSum: 24500000,
    changeOrdersSum: 0,
    contractSumToDate: 24500000,
    totalCompletedStored: 4900000, // 20%
    retainagePercentage: 5,
    retainageAmount: 245000,
    totalEarnedLessRetainage: 4655000,
    previousCertificates: 2327500,
    currentPaymentDue: 2327500,
    balanceToFinish: 19600000,
    lineItems: [],
    notes: "Excavation and foundation work."
  },
  {
    id: "aia3",
    projectId: "1", // I-85 North Expansion
    formType: "G702",
    applicationNumber: 3,
    billingPeriodStart: "2025-04-01",
    billingPeriodEnd: "2025-04-30",
    submissionDate: "2025-05-05",
    approvalDate: "2025-05-12",
    approvedBy: "John Doe",
    status: "approved",
    originalContractSum: 24500000,
    changeOrdersSum: 350000,
    contractSumToDate: 24850000,
    totalCompletedStored: 8697500, // 35%
    retainagePercentage: 5,
    retainageAmount: 434875,
    totalEarnedLessRetainage: 8262625,
    previousCertificates: 4655000,
    currentPaymentDue: 3607625,
    balanceToFinish: 16152500,
    lineItems: [],
    notes: "Drainage systems and base pavement work."
  },
  {
    id: "aia4",
    projectId: "4", // Oak Ridge Bridge Rehabilitation
    formType: "G702",
    applicationNumber: 1,
    billingPeriodStart: "2024-06-10",
    billingPeriodEnd: "2024-07-31",
    submissionDate: "2024-08-05",
    approvalDate: "2024-08-12",
    approvedBy: "Michael Smith",
    status: "approved",
    originalContractSum: 7820000,
    changeOrdersSum: 0,
    contractSumToDate: 7820000,
    totalCompletedStored: 1173000, // 15%
    retainagePercentage: 5,
    retainageAmount: 58650,
    totalEarnedLessRetainage: 1114350,
    previousCertificates: 0,
    currentPaymentDue: 1114350,
    balanceToFinish: 6647000,
    lineItems: [],
    notes: "Initial bridge assessment and site preparation."
  },
  {
    id: "aia5",
    projectId: "4", // Oak Ridge Bridge Rehabilitation
    formType: "G702",
    applicationNumber: 2,
    billingPeriodStart: "2024-08-01",
    billingPeriodEnd: "2024-09-30",
    submissionDate: "2024-10-05",
    status: "submitted",
    originalContractSum: 7820000,
    changeOrdersSum: 125000,
    contractSumToDate: 7945000,
    totalCompletedStored: 2781750, // 35%
    retainagePercentage: 5,
    retainageAmount: 139087.5,
    totalEarnedLessRetainage: 2642662.5,
    previousCertificates: 1114350,
    currentPaymentDue: 1528312.5,
    balanceToFinish: 5163250,
    lineItems: [],
    notes: "Structural repair work and deck removal."
  }
];

// Mock Change Orders
export const mockChangeOrders: ExpandedChangeOrder[] = [
  {
    id: "co1",
    projectId: "1", // I-85 North Expansion
    changeOrderNumber: "CO-001",
    title: "Additional Drainage System",
    description: "Installation of additional drainage system at mile marker 132 due to unexpected ground water issues.",
    status: "approved",
    costImpact: 350000,
    timeImpact: 14, // days
    requestDate: "2025-03-15",
    submittedDate: "2025-03-18",
    submittedBy: "Thomas Rodriguez",
    approvalDate: "2025-03-25",
    approvedBy: "GDOT Engineering",
    reason: "Unforeseen Site Condition",
    justification: "Ground water levels were higher than indicated in the geotechnical report, requiring additional drainage infrastructure.",
    auditTrail: [],
    lineItems: [
      {
        id: "coli1",
        changeOrderId: "co1",
        description: "Additional drainage pipes (36\" diameter)",
        quantity: 450,
        unitPrice: 285,
        total: 128250,
        costCode: "02-4000"
      },
      {
        id: "coli2",
        changeOrderId: "co1",
        description: "Catch basins",
        quantity: 6,
        unitPrice: 8500,
        total: 51000,
        costCode: "02-4000"
      },
      {
        id: "coli3",
        changeOrderId: "co1",
        description: "Excavation and backfill",
        quantity: 1,
        unitPrice: 170750,
        total: 170750,
        costCode: "02-3000"
      }
    ]
  },
  {
    id: "co2",
    projectId: "1", // I-85 North Expansion
    changeOrderNumber: "CO-002",
    title: "Modified Sound Barrier Design",
    description: "Change in sound barrier design to accommodate existing utilities that were not shown on original plans.",
    status: "pending_approval",
    costImpact: 275000,
    timeImpact: 0, // No schedule impact
    requestDate: "2025-04-20",
    submittedDate: "2025-04-25",
    submittedBy: "Thomas Rodriguez",
    reason: "Design Modification",
    justification: "Existing fiber optic lines discovered during excavation require a modified foundation design for the sound barriers.",
    auditTrail: [],
    lineItems: [
      {
        id: "coli4",
        changeOrderId: "co2",
        description: "Engineering redesign",
        quantity: 1,
        unitPrice: 45000,
        total: 45000,
        costCode: "01-3000"
      },
      {
        id: "coli5",
        changeOrderId: "co2",
        description: "Modified barrier foundations",
        quantity: 28,
        unitPrice: 8000,
        total: 224000,
        costCode: "03-3000"
      },
      {
        id: "coli6",
        changeOrderId: "co2",
        description: "Utility protection measures",
        quantity: 1,
        unitPrice: 6000,
        total: 6000,
        costCode: "02-2000"
      }
    ]
  },
  {
    id: "co3",
    projectId: "4", // Oak Ridge Bridge Rehabilitation
    changeOrderNumber: "CO-001",
    title: "Expanded Deck Replacement",
    description: "Additional deck deterioration discovered after removal of wearing surface requires 30% more deck replacement than originally scoped.",
    status: "approved",
    costImpact: 125000,
    timeImpact: 21, // days
    requestDate: "2024-07-25",
    submittedDate: "2024-07-30",
    submittedBy: "Amanda Williams",
    approvalDate: "2024-08-10",
    approvedBy: "GDOT Engineering",
    reason: "Unforeseen Condition",
    justification: "After removing the wearing surface, significant additional concrete deterioration was discovered that wasn't visible during initial inspections.",
    auditTrail: [],
    lineItems: [
      {
        id: "coli7",
        changeOrderId: "co3",
        description: "Additional concrete deck demolition",
        quantity: 1250,
        unitPrice: 18,
        total: 22500,
        costCode: "02-4100"
      },
      {
        id: "coli8",
        changeOrderId: "co3",
        description: "Additional deck concrete and reinforcing",
        quantity: 1250,
        unitPrice: 65,
        total: 81250,
        costCode: "03-3000"
      },
      {
        id: "coli9",
        changeOrderId: "co3",
        description: "Additional traffic control",
        quantity: 21,
        unitPrice: 1000,
        total: 21000,
        costCode: "01-5000"
      }
    ]
  },
  {
    id: "co4",
    projectId: "5", // Riverside Parkway Extension
    changeOrderNumber: "CO-001",
    title: "Wetland Mitigation Measures",
    description: "Additional environmental mitigation measures required for wetland area not identified in original environmental assessment.",
    status: "draft",
    costImpact: 185000,
    timeImpact: 30, // days
    requestDate: "2024-05-15",
    reason: "Regulatory Requirement",
    justification: "State EPA required additional wetland mitigation measures after discovering a small wetland area during construction.",
    auditTrail: [],
    lineItems: [
      {
        id: "coli10",
        changeOrderId: "co4",
        description: "Environmental consultant fees",
        quantity: 1,
        unitPrice: 35000,
        total: 35000,
        costCode: "01-3100"
      },
      {
        id: "coli11",
        changeOrderId: "co4",
        description: "Wetland mitigation construction",
        quantity: 1,
        unitPrice: 150000,
        total: 150000,
        costCode: "02-9000"
      }
    ]
  }
];
