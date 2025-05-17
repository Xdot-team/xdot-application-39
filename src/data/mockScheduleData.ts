
import { addDays, addHours, addMonths, addWeeks, format, startOfDay, subDays } from 'date-fns';
import { ScheduleEvent, Meeting, ResourceAllocation } from '@/types/schedule';

// Helper function to create a date string
const createDateString = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss");

// Generate current date and common date references
const now = new Date();
const today = startOfDay(now);
const tomorrow = addDays(today, 1);
const nextWeek = addWeeks(today, 1);
const nextMonth = addMonths(today, 1);

// Mock schedule events
export const mockScheduleEvents: ScheduleEvent[] = [
  {
    id: "1",
    title: "I-85 North Expansion Kickoff",
    description: "Project kickoff meeting for the I-85 North Expansion project",
    startDate: createDateString(addHours(today, 9)),
    endDate: createDateString(addHours(today, 11)),
    allDay: false,
    location: "Main Office Conference Room",
    eventType: "project_milestone",
    category: "project",
    priority: "high",
    status: "scheduled",
    projectId: "1",
    projectName: "I-85 North Expansion",
    assignees: [
      { id: "1", name: "Thomas Rodriguez", type: "employee" },
      { id: "2", name: "Sarah Johnson", type: "employee" },
      { id: "3", name: "Michael Chen", type: "employee" }
    ],
    createdBy: "Thomas Rodriguez",
    createdAt: createDateString(subDays(today, 14)),
  },
  {
    id: "2",
    title: "Asphalt Paver Maintenance",
    description: "Scheduled maintenance for the Caterpillar AP1055F Asphalt Paver",
    startDate: createDateString(addHours(tomorrow, 8)),
    endDate: createDateString(addHours(tomorrow, 12)),
    allDay: false,
    location: "Equipment Yard",
    eventType: "equipment_maintenance",
    category: "equipment",
    priority: "medium",
    status: "scheduled",
    assignees: [
      { id: "4", name: "James Wilson", type: "employee" },
      { id: "101", name: "Caterpillar AP1055F", type: "equipment" }
    ],
    createdBy: "David Park",
    createdAt: createDateString(subDays(today, 5)),
    notes: "Regular 500-hour maintenance including oil change and filter replacement"
  },
  {
    id: "3",
    title: "Night Shift - Peachtree Road Resurfacing",
    description: "Night shift for asphalt laying operation",
    startDate: createDateString(addHours(addDays(today, 2), 20)),
    endDate: createDateString(addHours(addDays(today, 3), 4)),
    allDay: false,
    location: "Peachtree Road NE",
    eventType: "employee_shift",
    category: "labor",
    priority: "high",
    status: "scheduled",
    projectId: "3",
    projectName: "Peachtree Road Resurfacing",
    assignees: [
      { id: "5", name: "Robert Lee", type: "employee" },
      { id: "6", name: "Carlos Mendez", type: "employee" },
      { id: "7", name: "Anthony Jackson", type: "employee" },
      { id: "102", name: "Asphalt Paver", type: "equipment" },
      { id: "103", name: "Dump Truck #3", type: "equipment" },
      { id: "201", name: "Asphalt Mix", type: "material" }
    ],
    createdBy: "Michael Chen",
    createdAt: createDateString(subDays(today, 7)),
  },
  {
    id: "4",
    title: "OSHA Safety Training",
    description: "Mandatory safety training for all field personnel",
    startDate: createDateString(addHours(nextWeek, 13)),
    endDate: createDateString(addHours(nextWeek, 16)),
    allDay: false,
    location: "Training Center Room 2",
    eventType: "training_session",
    category: "training",
    priority: "high",
    status: "scheduled",
    assignees: [
      { id: "4", name: "James Wilson", type: "employee" },
      { id: "5", name: "Robert Lee", type: "employee" },
      { id: "6", name: "Carlos Mendez", type: "employee" },
      { id: "7", name: "Anthony Jackson", type: "employee" },
      { id: "8", name: "Lisa Thompson", type: "employee" }
    ],
    createdBy: "Sarah Johnson",
    createdAt: createDateString(subDays(today, 21)),
    notes: "Annual OSHA compliance training"
  },
  {
    id: "5",
    title: "Georgia DOT Inspection - Oak Ridge Bridge",
    description: "Inspection by GA DOT officials for the Oak Ridge Bridge Rehabilitation project",
    startDate: createDateString(addHours(addDays(today, 5), 10)),
    endDate: createDateString(addHours(addDays(today, 5), 12)),
    allDay: false,
    location: "Oak Ridge Bridge Site",
    eventType: "inspection",
    category: "inspection",
    priority: "high",
    status: "scheduled",
    projectId: "4",
    projectName: "Oak Ridge Bridge Rehabilitation",
    assignees: [
      { id: "2", name: "Amanda Williams", type: "employee" }
    ],
    createdBy: "Amanda Williams",
    createdAt: createDateString(subDays(today, 10)),
    notes: "Prepare all documentation and ensure site is inspection-ready"
  },
  {
    id: "6",
    title: "Concrete Pour - Riverside Parkway Extension",
    description: "Major concrete pour for foundation work",
    startDate: createDateString(addHours(addDays(today, 3), 7)),
    endDate: createDateString(addHours(addDays(today, 3), 15)),
    allDay: true,
    location: "Riverside Parkway Station 1+200",
    eventType: "project_milestone",
    category: "project",
    priority: "high",
    status: "scheduled",
    projectId: "5",
    projectName: "Riverside Parkway Extension",
    assignees: [
      { id: "1", name: "Thomas Rodriguez", type: "employee" },
      { id: "9", name: "Concrete Crew A", type: "employee" },
      { id: "104", name: "Concrete Mixer Truck #2", type: "equipment" },
      { id: "105", name: "Concrete Pump", type: "equipment" },
      { id: "202", name: "Ready-Mix Concrete", type: "material" }
    ],
    createdBy: "Thomas Rodriguez",
    createdAt: createDateString(subDays(today, 14)),
  },
  {
    id: "7",
    title: "Monthly Progress Meeting",
    description: "Review of all active projects and financial status",
    startDate: createDateString(addHours(addDays(today, 15), 9)),
    endDate: createDateString(addHours(addDays(today, 15), 12)),
    allDay: false,
    location: "Executive Conference Room",
    eventType: "meeting",
    category: "meeting",
    priority: "medium",
    status: "scheduled",
    assignees: [
      { id: "1", name: "Thomas Rodriguez", type: "employee" },
      { id: "2", name: "Sarah Johnson", type: "employee" },
      { id: "3", name: "Michael Chen", type: "employee" },
      { id: "10", name: "Emily Parker", type: "employee" },
      { id: "11", name: "John Martinez", type: "employee" }
    ],
    createdBy: "Emily Parker",
    createdAt: createDateString(subDays(today, 30)),
    recurring: {
      frequency: "monthly",
      interval: 1
    }
  },
  {
    id: "8",
    title: "SR-316 Interchange Design Review",
    description: "Final design review before construction begins",
    startDate: createDateString(addHours(nextMonth, 14)),
    endDate: createDateString(addHours(nextMonth, 17)),
    allDay: false,
    location: "Engineering Office",
    eventType: "project_milestone",
    category: "project",
    priority: "high",
    status: "scheduled",
    projectId: "2",
    projectName: "SR-316 Interchange Improvement",
    assignees: [
      { id: "2", name: "Sarah Johnson", type: "employee" },
      { id: "12", name: "Engineering Team", type: "employee" }
    ],
    createdBy: "Sarah Johnson",
    createdAt: createDateString(subDays(today, 45)),
  },
  {
    id: "9",
    title: "Crane Operator Certification",
    description: "Certification training for crane operators",
    startDate: createDateString(addHours(addDays(today, 10), 8)),
    endDate: createDateString(addHours(addDays(today, 12), 16)),
    allDay: true,
    location: "Training Facility",
    eventType: "training_session",
    category: "training",
    priority: "medium",
    status: "scheduled",
    assignees: [
      { id: "6", name: "Carlos Mendez", type: "employee" },
      { id: "13", name: "Derek Wilson", type: "employee" },
      { id: "14", name: "Frank Miller", type: "employee" }
    ],
    createdBy: "David Park",
    createdAt: createDateString(subDays(today, 60)),
  },
  {
    id: "10",
    title: "Excavator Fleet Rotation",
    description: "Rotate excavators between job sites for optimal usage",
    startDate: createDateString(addHours(addDays(today, 7), 6)),
    endDate: createDateString(addHours(addDays(today, 7), 18)),
    allDay: true,
    location: "Multiple Sites",
    eventType: "equipment_maintenance",
    category: "equipment",
    priority: "low",
    status: "scheduled",
    assignees: [
      { id: "4", name: "James Wilson", type: "employee" },
      { id: "106", name: "Excavator #1", type: "equipment" },
      { id: "107", name: "Excavator #2", type: "equipment" },
      { id: "108", name: "Excavator #3", type: "equipment" }
    ],
    createdBy: "David Park",
    createdAt: createDateString(subDays(today, 15)),
  }
];

// Mock meetings
export const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Weekly Project Coordination",
    description: "Coordination meeting for all active project managers",
    date: format(addDays(today, 1), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:30",
    location: "Main Conference Room",
    organizer: "Thomas Rodriguez",
    attendees: [
      { id: "1", name: "Thomas Rodriguez", confirmed: true },
      { id: "2", name: "Sarah Johnson", confirmed: true },
      { id: "3", name: "Michael Chen", confirmed: false },
      { id: "15", name: "Amanda Williams", confirmed: true }
    ],
    agenda: [
      "Review previous week's progress",
      "Discuss upcoming milestones",
      "Resource allocation issues",
      "Safety concerns"
    ],
    virtual: false
  },
  {
    id: "2",
    title: "Georgia DOT Quarterly Review",
    description: "Quarterly review meeting with Georgia DOT officials",
    date: format(addDays(today, 5), "yyyy-MM-dd"),
    startTime: "13:00",
    endTime: "15:00",
    location: "Georgia DOT Office, Atlanta",
    organizer: "Sarah Johnson",
    attendees: [
      { id: "1", name: "Thomas Rodriguez", confirmed: true },
      { id: "2", name: "Sarah Johnson", confirmed: true },
      { id: "16", name: "Mark Williams (GA DOT)", confirmed: true },
      { id: "17", name: "Patricia Jones (GA DOT)", confirmed: true }
    ],
    agenda: [
      "Project statuses",
      "Budget reviews",
      "Timeline adjustments",
      "Compliance updates"
    ],
    virtual: false,
    relatedProjectId: "1",
    relatedProjectName: "I-85 North Expansion",
    documents: [
      { id: "d1", name: "Q3 Progress Report", url: "#" },
      { id: "d2", name: "Project Timeline Updated", url: "#" }
    ]
  },
  {
    id: "3",
    title: "Safety Committee Meeting",
    description: "Monthly safety committee review and planning",
    date: format(addDays(today, 3), "yyyy-MM-dd"),
    startTime: "11:00",
    endTime: "12:00",
    location: "Virtual Meeting",
    organizer: "David Park",
    attendees: [
      { id: "3", name: "Michael Chen", confirmed: true },
      { id: "4", name: "James Wilson", confirmed: true },
      { id: "18", name: "Lisa Thompson", confirmed: true },
      { id: "19", name: "Robert Johnson", confirmed: false }
    ],
    agenda: [
      "Review of recent incidents",
      "Safety training schedule",
      "OSHA compliance updates",
      "New safety procedures"
    ],
    virtual: true,
    meetingLink: "https://meet.example.com/safety-committee"
  },
  {
    id: "4",
    title: "Budget Planning FY2025",
    description: "Initial planning meeting for next fiscal year budget",
    date: format(addDays(today, 14), "yyyy-MM-dd"),
    startTime: "14:00",
    endTime: "16:30",
    location: "Executive Board Room",
    organizer: "Emily Parker",
    attendees: [
      { id: "1", name: "Thomas Rodriguez", confirmed: true },
      { id: "20", name: "Emily Parker", confirmed: true },
      { id: "21", name: "John Martinez", confirmed: true },
      { id: "22", name: "Financial Team", confirmed: true }
    ],
    agenda: [
      "Review of current fiscal year",
      "Projected needs for FY2025",
      "Capital equipment purchases",
      "Training budget allocation"
    ],
    virtual: false,
    documents: [
      { id: "d3", name: "Current FY Financial Summary", url: "#" },
      { id: "d4", name: "Equipment Replacement Schedule", url: "#" }
    ]
  },
  {
    id: "5",
    title: "Environmental Compliance Review",
    description: "Quarterly environmental compliance review for all active projects",
    date: format(addDays(today, 7), "yyyy-MM-dd"),
    startTime: "10:00",
    endTime: "11:30",
    location: "Conference Room B",
    organizer: "Sarah Johnson",
    attendees: [
      { id: "2", name: "Sarah Johnson", confirmed: true },
      { id: "23", name: "Environmental Specialist", confirmed: true },
      { id: "24", name: "Project Representatives", confirmed: true }
    ],
    agenda: [
      "Environmental permit status",
      "Stormwater management compliance",
      "Waste disposal procedures",
      "Environmental incident reports"
    ],
    virtual: false
  }
];

// Mock resource allocations
export const mockResourceAllocations: ResourceAllocation[] = [
  {
    id: "1",
    resourceId: "101",
    resourceName: "Caterpillar AP1055F Asphalt Paver",
    resourceType: "equipment",
    projectId: "3",
    projectName: "Peachtree Road Resurfacing",
    startDate: format(addDays(today, 2), "yyyy-MM-dd"),
    endDate: format(addDays(today, 7), "yyyy-MM-dd"),
    hoursPerDay: 8,
    status: "scheduled"
  },
  {
    id: "2",
    resourceId: "5",
    resourceName: "Robert Lee",
    resourceType: "employee",
    projectId: "3",
    projectName: "Peachtree Road Resurfacing",
    startDate: format(today, "yyyy-MM-dd"),
    endDate: format(addDays(today, 14), "yyyy-MM-dd"),
    hoursPerDay: 10,
    status: "in_progress"
  },
  {
    id: "3",
    resourceId: "201",
    resourceName: "Asphalt Mix",
    resourceType: "material",
    projectId: "3",
    projectName: "Peachtree Road Resurfacing",
    startDate: format(addDays(today, 2), "yyyy-MM-dd"),
    endDate: format(addDays(today, 7), "yyyy-MM-dd"),
    quantity: 500, // tons
    status: "scheduled"
  },
  {
    id: "4",
    resourceId: "106",
    resourceName: "Excavator #1",
    resourceType: "equipment",
    projectId: "1",
    projectName: "I-85 North Expansion",
    startDate: format(addDays(today, -5), "yyyy-MM-dd"),
    endDate: format(addDays(today, 10), "yyyy-MM-dd"),
    hoursPerDay: 8,
    status: "in_progress"
  },
  {
    id: "5",
    resourceId: "9",
    resourceName: "Concrete Crew A",
    resourceType: "employee",
    projectId: "5",
    projectName: "Riverside Parkway Extension",
    startDate: format(addDays(today, 3), "yyyy-MM-dd"),
    endDate: format(addDays(today, 4), "yyyy-MM-dd"),
    hoursPerDay: 10,
    status: "scheduled"
  },
  {
    id: "6",
    resourceId: "202",
    resourceName: "Ready-Mix Concrete",
    resourceType: "material",
    projectId: "5",
    projectName: "Riverside Parkway Extension",
    startDate: format(addDays(today, 3), "yyyy-MM-dd"),
    endDate: format(addDays(today, 3), "yyyy-MM-dd"),
    quantity: 250, // cubic yards
    status: "scheduled"
  },
  {
    id: "7",
    resourceId: "2",
    resourceName: "Sarah Johnson",
    resourceType: "employee",
    projectId: "2",
    projectName: "SR-316 Interchange Improvement",
    startDate: format(addDays(today, -10), "yyyy-MM-dd"),
    endDate: format(addDays(today, 20), "yyyy-MM-dd"),
    hoursPerDay: 6,
    status: "in_progress",
    notes: "Part-time allocation, also working on I-85 project"
  },
  {
    id: "8",
    resourceId: "104",
    resourceName: "Concrete Mixer Truck #2",
    resourceType: "equipment",
    projectId: "5",
    projectName: "Riverside Parkway Extension",
    startDate: format(addDays(today, 3), "yyyy-MM-dd"),
    endDate: format(addDays(today, 3), "yyyy-MM-dd"),
    hoursPerDay: 10,
    status: "scheduled"
  }
];

// Helper function to convert schedule events to calendar-compatible format
export function getCalendarEvents() {
  return mockScheduleEvents.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(event.startDate),
    end: new Date(event.endDate),
    allDay: event.allDay,
    category: event.category,
    eventType: event.eventType,
    priority: event.priority,
    status: event.status,
    projectId: event.projectId,
    location: event.location
  }));
}

// Map event categories to colors
export function getCategoryColor(category: string): string {
  switch (category) {
    case 'project':
      return 'bg-blue-500 hover:bg-blue-600 text-white';
    case 'equipment':
      return 'bg-amber-500 hover:bg-amber-600 text-white';
    case 'labor':
      return 'bg-purple-500 hover:bg-purple-600 text-white';
    case 'training':
      return 'bg-green-500 hover:bg-green-600 text-white';
    case 'meeting':
      return 'bg-slate-500 hover:bg-slate-600 text-white';
    case 'inspection':
      return 'bg-red-500 hover:bg-red-600 text-white';
    default:
      return 'bg-gray-500 hover:bg-gray-600 text-white';
  }
}

// Map event types to icons
export function getEventTypeIcon(eventType: string): string {
  switch (eventType) {
    case 'project_milestone':
      return 'flag';
    case 'equipment_maintenance':
      return 'tool';
    case 'employee_shift':
      return 'user';
    case 'training_session':
      return 'school';
    case 'meeting':
      return 'users';
    case 'inspection':
      return 'clipboard-check';
    default:
      return 'calendar';
  }
}
