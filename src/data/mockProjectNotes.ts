
import { ProjectNote, ScopeWIP } from "@/types/projects";

// Generate 10 mock project notes for demonstration
export const mockProjectNotes: ProjectNote[] = [
  {
    id: "note-001",
    projectId: "1",
    title: "Initial site assessment",
    content: "Conducted initial site assessment. Ground conditions appear suitable for the planned foundation work. No major issues identified.",
    author: "John Doe",
    timestamp: "2023-08-15T09:30:00Z",
    tags: ["update", "site"]
  },
  {
    id: "note-002",
    projectId: "1",
    title: "Permit delay",
    content: "County permit approval delayed by 2 weeks. Need to adjust schedule accordingly. Waiting on environmental review completion.",
    author: "Sarah Johnson",
    timestamp: "2023-08-18T14:15:00Z",
    tags: ["issue", "schedule", "permit"]
  },
  {
    id: "note-003",
    projectId: "1",
    title: "Subcontractor meeting",
    content: "Met with electrical subcontractor to discuss timeline and requirements. They will submit updated quote by Friday.",
    author: "Michael Chen",
    timestamp: "2023-08-22T11:00:00Z",
    tags: ["meeting", "subcontractor"]
  },
  {
    id: "note-004",
    projectId: "1",
    title: "Material delivery scheduled",
    content: "Primary materials delivery scheduled for Sept 5th. Site needs to be prepared by Sept 3rd. Coordinating with logistics team.",
    author: "John Doe",
    timestamp: "2023-08-25T16:45:00Z",
    tags: ["logistics", "update"]
  },
  {
    id: "note-005",
    projectId: "1",
    title: "Budget adjustment needed",
    content: "Due to increased material costs, we need to review the budget allocation for Phase 2. Preparing analysis for PM review.",
    author: "Emily Rodriguez",
    timestamp: "2023-08-30T10:20:00Z",
    tags: ["budget", "issue"]
  },
  {
    id: "note-006",
    projectId: "2",
    title: "Safety inspection passed",
    content: "Monthly safety inspection passed with no violations. Special mention of good practices in equipment storage.",
    author: "David Kim",
    timestamp: "2023-09-02T09:00:00Z",
    tags: ["safety", "update"]
  },
  {
    id: "note-007",
    projectId: "2",
    title: "Design change request",
    content: "Client requested modifications to the southern entrance design. Awaiting formal change order. Initial estimate suggests 3-day impact.",
    author: "Sarah Johnson",
    timestamp: "2023-09-05T15:30:00Z",
    tags: ["client", "design", "change"]
  },
  {
    id: "note-008",
    projectId: "2",
    title: "Weather delay",
    content: "Heavy rainfall caused 1-day delay in foundation work. Site conditions being monitored, may resume tomorrow if drainage improves.",
    author: "Michael Chen",
    timestamp: "2023-09-08T08:45:00Z",
    tags: ["weather", "delay", "issue"]
  },
  {
    id: "note-009",
    projectId: "3",
    title: "Quality assurance review",
    content: "QA team completed review of Phase 1 deliverables. All items passed inspection with minor recommendations for documentation improvements.",
    author: "Emily Rodriguez",
    timestamp: "2023-09-12T13:15:00Z",
    tags: ["quality", "update"]
  },
  {
    id: "note-010",
    projectId: "3",
    title: "Community feedback session",
    content: "Held public information session with local residents. Overall positive reception with concerns about construction hours addressed.",
    author: "John Doe",
    timestamp: "2023-09-15T17:00:00Z",
    tags: ["community", "meeting"]
  }
];

// Generate 10 mock scope WIP items for demonstration
export const mockScopeWIP: ScopeWIP[] = [
  {
    id: "swip-001",
    projectId: "1",
    taskId: "task-001",
    scopeDescription: "Site preparation and clearing",
    progressPercentage: 100,
    status: "completed",
    startDate: "2023-08-10T08:00:00Z",
    estimatedEndDate: "2023-08-15T17:00:00Z",
    actualEndDate: "2023-08-14T16:30:00Z",
    assignedTo: ["Field Team A", "Heavy Equipment Crew"],
    notes: "Completed ahead of schedule with no issues",
    lastUpdated: "2023-08-14T16:30:00Z"
  },
  {
    id: "swip-002",
    projectId: "1",
    taskId: "task-002",
    scopeDescription: "Foundation excavation and reinforcement",
    progressPercentage: 75,
    status: "in_progress",
    startDate: "2023-08-16T08:00:00Z",
    estimatedEndDate: "2023-08-25T17:00:00Z",
    assignedTo: ["Foundation Crew", "Engineering Team"],
    notes: "Currently on schedule despite brief weather delay",
    lastUpdated: "2023-08-20T15:45:00Z"
  },
  {
    id: "swip-003",
    projectId: "1",
    taskId: "task-003",
    scopeDescription: "Utility line installation",
    progressPercentage: 30,
    status: "in_progress",
    startDate: "2023-08-18T08:00:00Z",
    estimatedEndDate: "2023-08-28T17:00:00Z",
    assignedTo: ["Plumbing Team", "Electrical Team"],
    notes: "Encountered unexpected rock formation, assessing impact",
    lastUpdated: "2023-08-21T14:20:00Z"
  },
  {
    id: "swip-004",
    projectId: "1",
    taskId: "task-004",
    scopeDescription: "Concrete slab pouring",
    progressPercentage: 0,
    status: "not_started",
    startDate: "2023-08-26T08:00:00Z",
    estimatedEndDate: "2023-08-30T17:00:00Z",
    assignedTo: ["Concrete Team", "Quality Control"],
    lastUpdated: "2023-08-10T09:00:00Z"
  },
  {
    id: "swip-005",
    projectId: "1",
    taskId: "task-005",
    scopeDescription: "Structural framing",
    progressPercentage: 0,
    status: "not_started",
    startDate: "2023-09-01T08:00:00Z",
    estimatedEndDate: "2023-09-15T17:00:00Z",
    assignedTo: ["Framing Crew", "Safety Team"],
    lastUpdated: "2023-08-10T09:00:00Z"
  },
  {
    id: "swip-006",
    projectId: "2",
    taskId: "task-001",
    scopeDescription: "Asphalt removal and recycling",
    progressPercentage: 100,
    status: "completed",
    startDate: "2023-08-05T08:00:00Z",
    estimatedEndDate: "2023-08-12T17:00:00Z",
    actualEndDate: "2023-08-11T15:00:00Z",
    assignedTo: ["Demolition Team", "Recycling Crew"],
    notes: "Completed as scheduled, 95% of materials recycled",
    lastUpdated: "2023-08-11T15:00:00Z"
  },
  {
    id: "swip-007",
    projectId: "2",
    taskId: "task-002",
    scopeDescription: "Grading and soil compaction",
    progressPercentage: 85,
    status: "in_progress",
    startDate: "2023-08-13T08:00:00Z",
    estimatedEndDate: "2023-08-20T17:00:00Z",
    assignedTo: ["Earthworks Team"],
    notes: "Compaction tests showing excellent results",
    lastUpdated: "2023-08-18T16:30:00Z"
  },
  {
    id: "swip-008",
    projectId: "3",
    taskId: "task-001",
    scopeDescription: "Drainage system installation",
    progressPercentage: 50,
    status: "in_progress",
    startDate: "2023-08-15T08:00:00Z",
    estimatedEndDate: "2023-08-25T17:00:00Z",
    assignedTo: ["Drainage Specialists", "Equipment Operators"],
    notes: "Making good progress despite challenging soil conditions",
    lastUpdated: "2023-08-20T14:15:00Z"
  },
  {
    id: "swip-009",
    projectId: "3",
    taskId: "task-002",
    scopeDescription: "Retaining wall construction",
    progressPercentage: 20,
    status: "in_progress",
    startDate: "2023-08-18T08:00:00Z",
    estimatedEndDate: "2023-09-05T17:00:00Z",
    assignedTo: ["Masonry Team", "Engineering Support"],
    notes: "Materials delivery delayed by 2 days, adjusting schedule",
    lastUpdated: "2023-08-22T10:45:00Z"
  },
  {
    id: "swip-010",
    projectId: "3",
    taskId: "task-003",
    scopeDescription: "Guard rail installation",
    progressPercentage: 0,
    status: "on_hold",
    startDate: "2023-09-06T08:00:00Z",
    estimatedEndDate: "2023-09-15T17:00:00Z",
    assignedTo: ["Safety Infrastructure Team"],
    notes: "On hold pending completion of retaining wall",
    lastUpdated: "2023-08-10T09:00:00Z"
  }
];
