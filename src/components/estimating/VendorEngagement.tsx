
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Mail, Phone, Users } from "lucide-react";
import { toast } from "sonner";
import { VendorBid } from '@/types/estimates';

// Mock data
const mockBids: VendorBid[] = [
  {
    id: "bid-001",
    estimateId: "EST-10001",
    vendorId: "V-001",
    vendorName: "Georgia Paving Co.",
    bidAmount: 228750,
    status: "pending",
    submissionDate: "2025-04-15",
    expirationDate: "2025-05-15",
    notes: "Includes all materials and labor for asphalt paving work"
  },
  {
    id: "bid-002",
    estimateId: "EST-10001",
    vendorId: "V-002",
    vendorName: "Atlanta Equipment Rental",
    bidAmount: 43750,
    status: "accepted",
    submissionDate: "2025-04-12",
    expirationDate: "2025-05-12",
    notes: "Equipment rental for 30 days including operator"
  },
  {
    id: "bid-003",
    estimateId: "EST-10001",
    vendorId: "V-003",
    vendorName: "Southeast Traffic Control",
    bidAmount: 52000,
    status: "rejected",
    submissionDate: "2025-04-10",
    expirationDate: "2025-05-10",
    notes: "Full traffic control services for duration of project"
  }
];

const VendorEngagement = () => {
  const [bids, setBids] = useState<VendorBid[]>(mockBids);
  const [activeTab, setActiveTab] = useState("activeBids");
  const [selectedBid, setSelectedBid] = useState<VendorBid | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleStatusChange = (bidId: string, newStatus: VendorBid['status']) => {
    setBids(bids.map(bid => 
      bid.id === bidId ? {...bid, status: newStatus} : bid
    ));
    toast.success(`Bid status updated to ${newStatus}`);
  };
  
  const handleViewBid = (bid: VendorBid) => {
    setSelectedBid(bid);
    setIsDialogOpen(true);
  };
  
  const getStatusBadge = (status: VendorBid['status']) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Vendor Engagement</h2>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Create Bid Package
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="activeBids">Active Bids</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activeBids" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Bids</CardTitle>
              <CardDescription>Manage and track vendor submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="text-right">Bid Amount</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bids.length ? (
                    bids.map(bid => (
                      <TableRow key={bid.id}>
                        <TableCell>{bid.vendorName}</TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(bid.bidAmount)}
                        </TableCell>
                        <TableCell>{new Date(bid.submissionDate).toLocaleDateString()}</TableCell>
                        <TableCell>{bid.expirationDate ? new Date(bid.expirationDate).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{getStatusBadge(bid.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewBid(bid)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">No bids available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Bid Comparison</CardTitle>
              <CardDescription>Compare bids by category and price</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center space-y-4">
                <div className="text-sm text-muted-foreground">
                  Select multiple bids above to generate a side-by-side comparison
                </div>
                <Button variant="outline">Generate Comparison</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Directory</CardTitle>
              <CardDescription>Manage vendors for bid solicitation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Add Vendor
                </Button>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Georgia Paving Co.</TableCell>
                      <TableCell>Paving, Concrete, Roadwork</TableCell>
                      <TableCell>John Smith, 404-555-1234</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Atlanta Equipment Rental</TableCell>
                      <TableCell>Equipment, Tools</TableCell>
                      <TableCell>Sarah Johnson, 770-555-6789</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Southeast Traffic Control</TableCell>
                      <TableCell>Traffic Control, Safety</TableCell>
                      <TableCell>Robert Lee, 678-555-2468</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="communications">
          <Card>
            <CardHeader>
              <CardTitle>Communication Log</CardTitle>
              <CardDescription>Track all vendor communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end mb-4">
                  <Button>
                    <Mail className="mr-2 h-4 w-4" />
                    Log Communication
                  </Button>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Summary</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Apr 18, 2025</TableCell>
                        <TableCell>Georgia Paving Co.</TableCell>
                        <TableCell>John Smith</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Requested clarification on asphalt specifications</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Apr 16, 2025</TableCell>
                        <TableCell>Atlanta Equipment Rental</TableCell>
                        <TableCell>Sarah Johnson</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Discussed equipment availability for project dates</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Apr 15, 2025</TableCell>
                        <TableCell>Southeast Traffic Control</TableCell>
                        <TableCell>Robert Lee</TableCell>
                        <TableCell>Meeting</TableCell>
                        <TableCell>Reviewed traffic control plan for I-85 lane closures</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Bid Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedBid && (
            <>
              <DialogHeader>
                <DialogTitle>Bid Details - {selectedBid.vendorName}</DialogTitle>
                <DialogDescription>
                  Submitted on {new Date(selectedBid.submissionDate).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Bid Amount</Label>
                    <div className="text-lg font-bold">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedBid.bidAmount)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div>{getStatusBadge(selectedBid.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Submission Date</Label>
                    <div>{new Date(selectedBid.submissionDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Expiration Date</Label>
                    <div>
                      {selectedBid.expirationDate 
                        ? new Date(selectedBid.expirationDate).toLocaleDateString() 
                        : 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <div className="mt-1 p-2 border rounded-md bg-gray-50">{selectedBid.notes}</div>
                </div>
                
                {/* Placeholder for bid items - would be populated in real app */}
                <div>
                  <Label className="text-sm font-medium">Bid Items</Label>
                  <div className="mt-1 border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                            No itemized details provided
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleStatusChange(selectedBid.id, 'rejected')}
                    disabled={selectedBid.status === 'rejected'}
                  >
                    Reject Bid
                  </Button>
                  <Button 
                    onClick={() => handleStatusChange(selectedBid.id, 'accepted')}
                    disabled={selectedBid.status === 'accepted'}
                  >
                    Accept Bid
                  </Button>
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorEngagement;
