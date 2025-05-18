
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SankeyFlowDiagram } from "@/components/dashboard/SankeyFlowDiagram";

export function ProjectsTab() {
  // Mock data for recent projects
  const recentProjects = [
    { id: 1, name: "I-85 North Resurfacing", client: "Georgia DOT", status: "In Progress", dueDate: "2023-11-15" },
    { id: 2, name: "Highway 400 Bridge Repair", client: "Atlanta Public Works", status: "Planning", dueDate: "2023-12-10" },
    { id: 3, name: "Peachtree Street Extension", client: "City of Atlanta", status: "Completed", dueDate: "2023-10-05" },
    { id: 4, name: "GA-400 Expansion", client: "State Highway Authority", status: "In Progress", dueDate: "2023-12-20" },
    { id: 5, name: "I-75 Bridge Repair", client: "Georgia DOT", status: "Planning", dueDate: "2024-01-15" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Portfolio</CardTitle>
          <CardDescription>Overview of active construction projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Project Name</th>
                  <th className="text-left p-3 font-medium">Client</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project) => (
                  <tr key={project.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">{project.name}</td>
                    <td className="p-3">{project.client}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          project.status === "Completed" 
                            ? "bg-green-100 text-green-800" 
                            : project.status === "In Progress" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="p-3">{new Date(project.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Sankey Diagram for Resource & Financial Flow */}
      <SankeyFlowDiagram />
    </div>
  );
}
