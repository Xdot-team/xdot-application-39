
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AIABillingLineItem } from '@/types/projects';
import { toast } from 'sonner';
import { CalendarIcon, Save, Send } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface AIABillingFormProps {
  projectId: string;
  onComplete: () => void;
}

const formSchema = z.object({
  formType: z.enum(['G702', 'G703']),
  applicationNumber: z.number().int().positive(),
  billingPeriodStart: z.date(),
  billingPeriodEnd: z.date(),
  originalContractSum: z.number().nonnegative(),
  changeOrdersSum: z.number(),
  retainagePercentage: z.number().min(0).max(100),
  notes: z.string().optional(),
  lineItems: z.array(
    z.object({
      description: z.string().min(1),
      scheduledValue: z.number().nonnegative(),
      workCompletedPrevious: z.number().nonnegative(),
      workCompletedCurrent: z.number().nonnegative(),
      materialsPresently: z.number().nonnegative(),
    })
  )
});

type FormValues = z.infer<typeof formSchema>;

const AIABillingForm = ({ projectId, onComplete }: AIABillingFormProps) => {
  const isMobile = useIsMobile();
  const [lineItems, setLineItems] = useState<Partial<AIABillingLineItem>[]>([
    { 
      description: 'General Conditions', 
      scheduledValue: 50000,
      workCompletedPrevious: 25000,
      workCompletedCurrent: 10000,
      materialsPresently: 0
    },
    { 
      description: 'Site Preparation', 
      scheduledValue: 120000,
      workCompletedPrevious: 120000,
      workCompletedCurrent: 0,
      materialsPresently: 0
    },
    { 
      description: 'Paving & Asphalt', 
      scheduledValue: 340000,
      workCompletedPrevious: 102000,
      workCompletedCurrent: 68000,
      materialsPresently: 20000
    }
  ]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formType: 'G702',
      applicationNumber: 4,
      billingPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      billingPeriodEnd: new Date(),
      originalContractSum: 750000,
      changeOrdersSum: 35000,
      retainagePercentage: 5,
      notes: '',
      lineItems: lineItems as any[]
    }
  });

  const totalScheduledValue = lineItems.reduce((sum, item) => sum + (item.scheduledValue || 0), 0);
  const totalPreviousWork = lineItems.reduce((sum, item) => sum + (item.workCompletedPrevious || 0), 0);
  const totalCurrentWork = lineItems.reduce((sum, item) => sum + (item.workCompletedCurrent || 0), 0);
  const totalMaterials = lineItems.reduce((sum, item) => sum + (item.materialsPresently || 0), 0);
  const totalCompletedStored = totalPreviousWork + totalCurrentWork + totalMaterials;
  
  // Calculate percentages and other derived values
  const contractSum = form.watch('originalContractSum');
  const changeOrdersSum = form.watch('changeOrdersSum');
  const contractSumToDate = contractSum + changeOrdersSum;
  const percentComplete = contractSum > 0 ? Math.round((totalCompletedStored / contractSumToDate) * 100) : 0;
  const retainagePercentage = form.watch('retainagePercentage');
  const retainageAmount = (retainagePercentage / 100) * totalCompletedStored;
  const totalEarnedLessRetainage = totalCompletedStored - retainageAmount;
  const previousCertificates = totalPreviousWork - (totalPreviousWork * (retainagePercentage / 100));
  const currentPaymentDue = totalEarnedLessRetainage - previousCertificates;
  const balanceToFinish = contractSumToDate - totalCompletedStored;

  function updateLineItem(index: number, key: keyof AIABillingLineItem, value: any) {
    const updatedItems = [...lineItems];
    updatedItems[index] = { ...updatedItems[index], [key]: parseFloat(value) || 0 };
    setLineItems(updatedItems);
    form.setValue('lineItems', updatedItems as any[]);
  }

  function addLineItem() {
    const newItem: Partial<AIABillingLineItem> = { 
      description: '', 
      scheduledValue: 0,
      workCompletedPrevious: 0,
      workCompletedCurrent: 0,
      materialsPresently: 0
    };
    setLineItems([...lineItems, newItem]);
    form.setValue('lineItems', [...lineItems, newItem] as any[]);
  }

  function removeLineItem(index: number) {
    const updatedItems = lineItems.filter((_, i) => i !== index);
    setLineItems(updatedItems);
    form.setValue('lineItems', updatedItems as any[]);
  }

  function onSubmit(data: FormValues, saveAsDraft: boolean = false) {
    // Add calculated values
    const formData = {
      ...data,
      projectId,
      contractSumToDate,
      totalCompletedStored,
      retainageAmount,
      totalEarnedLessRetainage,
      previousCertificates,
      currentPaymentDue,
      balanceToFinish,
      status: saveAsDraft ? 'draft' : 'submitted',
      submissionDate: new Date().toISOString(),
    };
    
    console.log(formData);
    
    toast.success(
      saveAsDraft ? 'Pay application saved as draft' : 'Pay application submitted successfully',
      { description: `Application #${data.applicationNumber}` }
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
                <CardTitle>Pay Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="formType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select form type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="G702">G702</SelectItem>
                            <SelectItem value="G703">G703</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="applicationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application #</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billingPeriodStart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Period Start</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="billingPeriodEnd"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Period End</FormLabel>
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="originalContractSum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Contract Sum</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="changeOrdersSum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Net Change Orders</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="retainagePercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retainage %</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter any additional notes" 
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
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <span className="text-muted-foreground">Contract Sum:</span>
                    <span className="text-right">${contractSum.toLocaleString()}</span>
                    
                    <span className="text-muted-foreground">Net Change Orders:</span>
                    <span className="text-right">${changeOrdersSum.toLocaleString()}</span>
                    
                    <span className="font-medium">Contract Sum to Date:</span>
                    <span className="text-right font-medium">${contractSumToDate.toLocaleString()}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <span className="text-muted-foreground">Total Completed & Stored:</span>
                    <span className="text-right">${totalCompletedStored.toLocaleString()}</span>
                    
                    <span className="text-muted-foreground">Percent Complete:</span>
                    <span className="text-right">{percentComplete}%</span>
                    
                    <span className="text-muted-foreground">Retainage ({retainagePercentage}%):</span>
                    <span className="text-right">${retainageAmount.toLocaleString()}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <span className="text-muted-foreground">Total Earned Less Retainage:</span>
                    <span className="text-right">${totalEarnedLessRetainage.toLocaleString()}</span>
                    
                    <span className="text-muted-foreground">Less Previous Certificates:</span>
                    <span className="text-right">${previousCertificates.toLocaleString()}</span>
                    
                    <span className="font-medium text-base">Current Payment Due:</span>
                    <span className="text-right font-medium text-base">${currentPaymentDue.toLocaleString()}</span>
                    
                    <span className="text-muted-foreground">Balance to Finish:</span>
                    <span className="text-right">${balanceToFinish.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Schedule of Values</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-right">Scheduled Value</th>
                    <th className="px-4 py-2 text-right">Work Completed Previous</th>
                    <th className="px-4 py-2 text-right">Work Completed Current</th>
                    <th className="px-4 py-2 text-right">Materials Stored</th>
                    <th className="px-4 py-2 text-right">Total Complete</th>
                    <th className="px-4 py-2 text-right">% Complete</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, index) => {
                    const totalItem = (item.workCompletedPrevious || 0) + 
                                      (item.workCompletedCurrent || 0) + 
                                      (item.materialsPresently || 0);
                    const percentItem = item.scheduledValue 
                      ? Math.round((totalItem / item.scheduledValue) * 100) 
                      : 0;
                    
                    return (
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
                            value={item.scheduledValue} 
                            onChange={(e) => updateLineItem(index, 'scheduledValue', e.target.value)}
                            className="w-full text-right"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <Input 
                            type="number" 
                            value={item.workCompletedPrevious} 
                            onChange={(e) => updateLineItem(index, 'workCompletedPrevious', e.target.value)}
                            className="w-full text-right"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <Input 
                            type="number" 
                            value={item.workCompletedCurrent} 
                            onChange={(e) => updateLineItem(index, 'workCompletedCurrent', e.target.value)}
                            className="w-full text-right"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <Input 
                            type="number" 
                            value={item.materialsPresently} 
                            onChange={(e) => updateLineItem(index, 'materialsPresently', e.target.value)}
                            className="w-full text-right"
                          />
                        </td>
                        <td className="px-4 py-2 text-right">${totalItem.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">{percentItem}%</td>
                        <td className="px-4 py-2 text-right">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeLineItem(index)}
                            className="text-destructive"
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  
                  <tr className="bg-muted">
                    <td className="px-4 py-2 font-medium">Totals</td>
                    <td className="px-4 py-2 text-right font-medium">${totalScheduledValue.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-medium">${totalPreviousWork.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-medium">${totalCurrentWork.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-medium">${totalMaterials.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-medium">${totalCompletedStored.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-medium">{percentComplete}%</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Button type="button" variant="outline" onClick={addLineItem}>
                + Add Line Item
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

export default AIABillingForm;
