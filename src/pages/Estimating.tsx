
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import QuickEstimate from '@/components/estimating/QuickEstimate';
import DetailedEstimate from '@/components/estimating/DetailedEstimate';
import CostAnalysis from '@/components/estimating/CostAnalysis';
import SpreadsheetView from '@/components/estimating/spreadsheet/SpreadsheetView';
import SiteVisits from '@/components/estimating/SiteVisits';
import VendorEngagement from '@/components/estimating/VendorEngagement';
import TakeoffAI from '@/components/estimating/TakeoffAI';
import Buyout from '@/components/estimating/Buyout';
import BidDocuments from '@/components/estimating/BidDocuments';
import MobileEstimating from '@/components/estimating/mobile/MobileEstimating';
import { useIsMobile } from '@/hooks/use-mobile';
import { EstimateItem } from '@/types/estimates';

function Estimating() {
  const [activeTab, setActiveTab] = useState('quick');
  const isMobile = useIsMobile();
  const [items, setItems] = useState<EstimateItem[]>([
    {
      id: 'item-1',
      description: 'Concrete Foundation',
      category: 'material',
      quantity: 100,
      unit: 'cubic yards',
      unitPrice: 150,
      totalPrice: 15000,
      formula: ''
    },
    {
      id: 'item-2',
      description: 'Steel Reinforcement',
      category: 'material',
      quantity: 2000,
      unit: 'lbs',
      unitPrice: 1.25,
      totalPrice: 2500,
      formula: ''
    }
  ]);
  const [errors, setErrors] = useState<{id: string, message: string}[]>([]);

  const handleItemUpdate = (updatedItem: EstimateItem) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === updatedItem.id);
      if (existingIndex >= 0) {
        // Update existing item
        const newItems = [...prevItems];
        newItems[existingIndex] = updatedItem;
        return newItems;
      } else {
        // Add new item
        return [...prevItems, updatedItem];
      }
    });
  };

  if (isMobile) {
    return <MobileEstimating />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <PageHeader 
          heading="Estimating"
          subheading="Create accurate project estimates and cost analysis"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 lg:w-full mb-4">
          <TabsTrigger value="quick">Quick Estimate</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Estimate</TabsTrigger>
          <TabsTrigger value="analysis">Cost Analysis</TabsTrigger>
          <TabsTrigger value="spreadsheet">Spreadsheet</TabsTrigger>
          <TabsTrigger value="visits">Site Visits</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Engagement</TabsTrigger>
          <TabsTrigger value="takeoff">Takeoff AI</TabsTrigger>
          <TabsTrigger value="buyout">Buyout</TabsTrigger>
          <TabsTrigger value="documents">Bid Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-4">
          <QuickEstimate />
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <DetailedEstimate />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <CostAnalysis />
        </TabsContent>

        <TabsContent value="spreadsheet" className="space-y-4">
          <SpreadsheetView 
            items={items}
            onItemUpdate={handleItemUpdate}
            errors={errors}
          />
        </TabsContent>

        <TabsContent value="visits" className="space-y-4">
          <SiteVisits />
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <VendorEngagement />
        </TabsContent>

        <TabsContent value="takeoff" className="space-y-4">
          <TakeoffAI />
        </TabsContent>

        <TabsContent value="buyout" className="space-y-4">
          <Buyout />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <BidDocuments />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Estimating;
