
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChangeOrderLineItem } from '@/types/projects';
import { toast } from 'sonner';
import { CalendarIcon, Save, Send, Plus, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Input as InputFile } from "@/components/ui/input";

interface ChangeOrderFormProps {
  projectId: string;
  onComplete: () => void;
}

const formSchema = z.object({
  changeOrderNumber: z.string().min(1, "Change order number is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  requestDate: z.date(),
  reason: z.string().min(1, "Reason is required"),
  justification: z.string().optional(),
  lineItems: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.number().positive("Quantity must be positive"),
      unitPrice: z.number(),
      costCode: z.string().optional(),
    })
  ).min(1, "At least one line item is required"),
});

type FormValues = z.infer<typeof formSchema>;

const ChangeOrderForm = ({ projectId, onComplete }: ChangeOrderFormProps) => {
  const isMobile = useIsMobile();
  const [lineItems, setLineItems] = useState<ChangeOrderLineItem[]>([
    { 
      id: '1',
      changeOrderId: '',
      description: 'Additional drainage system',
      quantity: 1,
      unitPrice: 15000,
      total: 15000,
      costCode: '02-5000'
    }
  ]);
  const [files, setFiles] = useState<File[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      changeOrderNumber: 'CO-12',
      title: 'Drainage system modification',
      description: 'Additional drainage system required after site assessment revealed groundwater issues.',
      requestDate: new Date(),
      reason: 'Unforeseen site condition',
      justification: 'The original design did not account for the high groundwater table discovered during excavation.',
      lineItems: lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        costCode: item.costCode || ''
      }))
    }
  });

  const totalCost = lineItems.reduce((sum, item) => sum + item.total, 0);
  
  function updateLineItem(index: number, key: keyof ChangeOrderLineItem, value: any) {
    const updatedItems = [...lineItems];
    
    if (key === 'quantity' || key === 'unitPrice') {
      const numValue = parseFloat(value) || 0;
      updatedItems[index] = { 
        ...updatedItems[index], 
        [key]: numValue,
        total: key === 'quantity' 
          ? numValue * updatedItems[index].unitPrice 
          : updatedItems[index].quantity * numValue
      };
    } else {
      updatedItems[index] = { ...updatedItems[index], [key]: value };
    }
    
    setLineItems(updatedItems);
    
    // Update form values
    const formLineItems = updatedItems.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      costCode: item.costCode || ''
    }));
    
    form.setValue('lineItems', formLineItems);
  }

  function addLineItem() {
    const newItem: ChangeOrderLineItem = {
      id: `new-${lineItems.length}`,
      changeOrderId: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    const updatedItems = [...lineItems, newItem];
    setLineItems(updatedItems);
    
    // Update form values
    const formLineItems = updatedItems.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      costCode: item.costCode || ''
    }));
    
    form.setValue('lineItems', formLineItems);
  }

  function removeLineItem(index: number) {
    const updatedItems = lineItems.filter((_, i) => i !== index);
    setLineItems(updatedItems);
    
    // Update form values
    const formLineItems = updatedItems.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      costCode: item.costCode || ''
    }));
    
    form.setValue('lineItems', formLineItems);
  }
  
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
    }
  }
  
  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

  function onSubmit(data: FormValues, saveAsDraft: boolean = false) {
    // Add calculated values
    const formData = {
      ...data,
      projectId,
      costImpact: totalCost,
      timeImpact: 14, // Example value
      status: saveAsDraft ? 'draft' : 'submitted',
      submittedDate: saveAsDraft ? undefined : new Date().toISOString(),
      submittedBy: saveAsDraft ? undefined : 'User ID/Name',
      attachments: files.map(file => file.name),
      lineItems: lineItems
    };
    
    console.log(formData);
    
    toast.success(
      saveAsDraft ? 'Change order saved as draft' : 'Change order submitted successfully',
      { description: `${data.changeOrderNumber}: ${data.title}` }
    );
    onComplete();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))}>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="changeOrderNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CO Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requestDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "MMM d, yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the change order in detail" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="justification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Justification</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide justification for this change" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attachments and Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Attachments</h4>
                  
                  <div className="space-y-2">
                    <InputFile 
                      type="file" 
                      multiple 
                      onChange={handleFileChange} 
                      className="w-full"
                    />
                    
                    {files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                            <span className="text-sm truncate max-w-[80%]">{file.name}</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => removeFile(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Impact Summary</h4>
                  
                  <div className="bg-muted p-4 rounded">
                    <div className="grid grid-cols-2 gap-y-2">
                      <span className="text-muted-foreground">Cost Impact:</span>
                      <span className="font-medium text-right">${totalCost.toLocaleString()}</span>
                      
                      <span className="text-muted-foreground">Schedule Impact:</span>
                      <span className="font-medium text-right">14 days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Change Order Items</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-right">Quantity</th>
                    <th className="px-4 py-2 text-right">Unit Price</th>
                    <th className="px-4 py-2 text-right">Total</th>
                    <th className="px-4 py-2 text-left">Cost Code</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">
                        <Input 
                          value={item.description} 
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                          className="w-full text-right"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input 
                          type="number" 
                          value={item.unitPrice} 
                          onChange={(e) => updateLineItem(index, 'unitPrice', e.target.value)}
                          className="w-full text-right"
                        />
                      </td>
                      <td className="px-4 py-2 text-right font-medium">${item.total.toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <Input 
                          value={item.costCode || ''} 
                          onChange={(e) => updateLineItem(index, 'costCode', e.target.value)}
                          className="w-full"
                          placeholder="Optional"
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeLineItem(index)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  
                  <tr className="bg-muted">
                    <td colSpan={3} className="px-4 py-2 font-medium">Total</td>
                    <td className="px-4 py-2 text-right font-medium">${totalCost.toLocaleString()}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Button type="button" variant="outline" onClick={addLineItem}>
                <Plus className="h-4 w-4 mr-1" /> Add Line Item
              </Button>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onComplete()}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => form.handleSubmit((data) => onSubmit(data, true))()}
            >
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button type="submit">
              <Send className="mr-2 h-4 w-4" />
              Submit for Approval
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ChangeOrderForm;
