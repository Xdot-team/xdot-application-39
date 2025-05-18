
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  Sankey,
  Tooltip,
  Rectangle,
  Layer,
  Label
} from 'recharts';

interface SankeyNode {
  name: string;
  value?: number;
  uv?: number;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
  color?: string;
}

// Mock data for the Sankey diagram
const data = {
  nodes: [
    { name: 'Revenue', uv: 100 },                     // 0
    { name: 'Materials', uv: 25 },                    // 1
    { name: 'Labor', uv: 30 },                        // 2
    { name: 'Equipment', uv: 15 },                    // 3
    { name: 'Overhead', uv: 10 },                     // 4
    { name: 'Subcontractors', uv: 10 },               // 5
    { name: 'Project A', uv: 30 },                    // 6
    { name: 'Project B', uv: 25 },                    // 7
    { name: 'Project C', uv: 15 },                    // 8
    { name: 'Project D', uv: 10 },                    // 9
    { name: 'General Costs', uv: 10 },                // 10
    { name: 'Profit', uv: 10 }                        // 11
  ],
  links: [
    { source: 0, target: 6, value: 30, color: '#9b87f5' },  // Revenue to Project A
    { source: 0, target: 7, value: 25, color: '#9b87f5' },  // Revenue to Project B
    { source: 0, target: 8, value: 15, color: '#9b87f5' },  // Revenue to Project C
    { source: 0, target: 9, value: 10, color: '#9b87f5' },  // Revenue to Project D
    { source: 0, target: 10, value: 10, color: '#9b87f5' }, // Revenue to General Costs
    { source: 0, target: 11, value: 10, color: '#D946EF' }, // Revenue to Profit
    { source: 6, target: 1, value: 8, color: '#0EA5E9' },   // Project A to Materials
    { source: 6, target: 2, value: 10, color: '#0EA5E9' },  // Project A to Labor
    { source: 6, target: 3, value: 5, color: '#0EA5E9' },   // Project A to Equipment
    { source: 6, target: 5, value: 7, color: '#0EA5E9' },   // Project A to Subcontractors
    { source: 7, target: 1, value: 7, color: '#F97316' },   // Project B to Materials
    { source: 7, target: 2, value: 9, color: '#F97316' },   // Project B to Labor
    { source: 7, target: 3, value: 5, color: '#F97316' },   // Project B to Equipment
    { source: 7, target: 5, value: 4, color: '#F97316' },   // Project B to Subcontractors
    { source: 8, target: 1, value: 5, color: '#8B5CF6' },   // Project C to Materials
    { source: 8, target: 2, value: 6, color: '#8B5CF6' },   // Project C to Labor
    { source: 8, target: 3, value: 4, color: '#8B5CF6' },   // Project C to Equipment
    { source: 9, target: 1, value: 3, color: '#D946EF' },   // Project D to Materials
    { source: 9, target: 2, value: 5, color: '#D946EF' },   // Project D to Labor
    { source: 9, target: 3, value: 2, color: '#D946EF' },   // Project D to Equipment
    { source: 10, target: 4, value: 10, color: '#7E69AB' }, // General Costs to Overhead
  ]
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length && payload[0].payload.source) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-md text-xs">
        <p className="font-medium">{`${data.source.name} → ${data.target.name}`}</p>
        <p className="text-gray-600">{`$${data.value.toLocaleString()}k`}</p>
      </div>
    );
  }
  return null;
};

const CustomNode = (props: any) => {
  const { x, y, width, height, index, payload } = props;
  
  // Apply different colors based on node type
  let fill = '#9b87f5'; // Default color
  
  if (payload.name.includes('Project')) {
    fill = '#0EA5E9';
  } else if (payload.name === 'Materials' || payload.name === 'Labor' || payload.name === 'Equipment' || payload.name === 'Subcontractors') {
    fill = '#F97316';
  } else if (payload.name === 'Overhead') {
    fill = '#8B5CF6';
  } else if (payload.name === 'Profit') {
    fill = '#D946EF';
  }
  
  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        fillOpacity="0.9"
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-medium fill-white"
      >
        {payload.name}
      </text>
    </Layer>
  );
};

export function SankeyFlowDiagram() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Resource & Financial Flow</CardTitle>
        <CardDescription>Visualization of financial resources across projects and expense categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={data}
              node={<CustomNode />}
              link={{ stroke: '#ccc' }}
              margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
            >
              <Tooltip content={<CustomTooltip />} />
            </Sankey>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
