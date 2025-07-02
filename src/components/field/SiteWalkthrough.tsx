
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Camera, Route, Upload, Save, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useProjects } from '@/hooks/useProjects';

interface SiteVisit {
  id?: string;
  project_id: string;
  site_id?: string;
  visit_date: string;
  inspector_name: string;
  inspector_id?: string;
  purpose: string;
  weather_conditions?: string;
  temperature?: number;
  wind_speed?: number;
  visibility?: string;
  findings?: string;
  recommendations?: string;
  safety_observations?: string;
  environmental_notes?: string;
  photos?: string[];
  attachments?: string[];
  gps_location?: unknown;
  duration_minutes?: number;
  attendees?: string[];
  status?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  created_at?: string;
  updated_at?: string;
}

export function SiteWalkthrough() {
  const { data: projects = [] } = useProjects();
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);
  const [currentVisit, setCurrentVisit] = useState<SiteVisit | null>(null);
  const [recentVisits, setRecentVisits] = useState<SiteVisit[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    purpose: 'pre_construction',
    inspector_name: '',
    weather_conditions: '',
    temperature: '',
    findings: '',
    follow_up_required: false,
    follow_up_date: ''
  });

  // Fetch recent site visits
  useEffect(() => {
    fetchRecentVisits();
  }, []);

  const fetchRecentVisits = async () => {
    try {
      const { data, error } = await supabase
        .from('site_visits')
        .select('*')
        .order('visit_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentVisits((data || []) as SiteVisit[]);
    } catch (error) {
      console.error('Error fetching site visits:', error);
    }
  };

  const startWalkthrough = async () => {
    if (!formData.project_id || !formData.inspector_name) {
      toast.error('Please select a project and enter inspector name');
      return;
    }

    setLoading(true);
    try {
      // Get current location
      let gpsLocation = null;
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000
            });
          });
          gpsLocation = `POINT(${position.coords.longitude} ${position.coords.latitude})`;
        } catch (geoError) {
          console.warn('Could not get location:', geoError);
        }
      }

      const visitData: SiteVisit = {
        project_id: formData.project_id,
        visit_date: new Date().toISOString(),
        purpose: formData.purpose,
        inspector_name: formData.inspector_name,
        weather_conditions: formData.weather_conditions || undefined,
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        findings: '',
        gps_location: gpsLocation,
        follow_up_required: false,
        status: 'in_progress'
      };

      const { data, error } = await supabase
        .from('site_visits')
        .insert([visitData])
        .select()
        .single();

      if (error) throw error;

      setCurrentVisit(data as SiteVisit);
      setIsWalkthroughActive(true);
      toast.success('Site walkthrough started successfully');
    } catch (error) {
      console.error('Error starting walkthrough:', error);
      toast.error('Failed to start walkthrough');
    } finally {
      setLoading(false);
    }
  };

  const completeWalkthrough = async () => {
    if (!currentVisit) return;

    setLoading(true);
    try {
      const endTime = new Date();
      const startTime = new Date(currentVisit.visit_date);
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

      const { error } = await supabase
        .from('site_visits')
        .update({
          findings: formData.findings,
          duration_minutes: durationMinutes,
          follow_up_required: formData.follow_up_required,
          follow_up_date: formData.follow_up_required ? formData.follow_up_date : null,
          status: 'completed'
        })
        .eq('id', currentVisit.id);

      if (error) throw error;

      setIsWalkthroughActive(false);
      setCurrentVisit(null);
      setFormData({
        project_id: '',
        purpose: 'pre_construction',
        inspector_name: '',
        weather_conditions: '',
        temperature: '',
        findings: '',
        follow_up_required: false,
        follow_up_date: ''
      });
      fetchRecentVisits();
      toast.success('Site walkthrough completed successfully');
    } catch (error) {
      console.error('Error completing walkthrough:', error);
      toast.error('Failed to complete walkthrough');
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    if (!currentVisit) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentVisit.id}_${Date.now()}.${fileExt}`;
      const filePath = `site-visits/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-documents')
        .getPublicUrl(filePath);

      // Save photo record
      await supabase.from('field_photos').insert([{
        project_id: currentVisit.project_id,
        site_id: currentVisit.site_id,
        file_name: fileName,
        file_url: publicUrl,
        file_size: file.size,
        photographer: currentVisit.inspector_name,
        related_table: 'site_visits',
        related_id: currentVisit.id,
        is_progress_photo: true,
        caption: 'Site walkthrough photo'
      }]);

      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    }
  };

  if (isWalkthroughActive && currentVisit) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Active Walkthrough
              </CardTitle>
              <CardDescription>
                Recording site conditions for {projects.find(p => p.id === currentVisit.project_id)?.name}
              </CardDescription>
            </div>
            <Badge variant="default" className="animate-pulse">Live</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 p-4 border rounded-lg bg-primary/5">
            <div className="space-y-2">
              <Label htmlFor="findings">Site Observations & Findings *</Label>
              <Textarea
                id="findings"
                value={formData.findings}
                onChange={(e) => setFormData(prev => ({ ...prev, findings: e.target.value }))}
                placeholder="Document site conditions, progress, issues, and any notable observations..."
                className="min-h-32"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Weather Conditions</Label>
                <Select
                  value={formData.weather_conditions}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, weather_conditions: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clear">Clear/Sunny</SelectItem>
                    <SelectItem value="partly_cloudy">Partly Cloudy</SelectItem>
                    <SelectItem value="overcast">Overcast</SelectItem>
                    <SelectItem value="light_rain">Light Rain</SelectItem>
                    <SelectItem value="heavy_rain">Heavy Rain</SelectItem>
                    <SelectItem value="snow">Snow</SelectItem>
                    <SelectItem value="windy">Windy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                  placeholder="Enter temperature"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Photo Documentation</Label>
              <div className="flex flex-col items-center p-6 text-center border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors">
                <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">Add Progress Photos</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Document current site conditions and work progress
                </p>
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photos
                    </span>
                  </Button>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        Array.from(e.target.files).forEach(uploadPhoto);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="follow_up_required"
                  checked={formData.follow_up_required}
                  onChange={(e) => setFormData(prev => ({ ...prev, follow_up_required: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="follow_up_required">Follow-up visit required</Label>
              </div>
              {formData.follow_up_required && (
                <div className="space-y-2">
                  <Label htmlFor="follow_up_date">Follow-up Date</Label>
                  <Input
                    id="follow_up_date"
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, follow_up_date: e.target.value }))}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsWalkthroughActive(false);
                setCurrentVisit(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={completeWalkthrough} disabled={loading || !formData.findings}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Walkthrough
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Site Walkthrough</CardTitle>
            <CardDescription>Document site conditions and take detailed measurements</CardDescription>
          </div>
          <Button onClick={startWalkthrough} disabled={loading}>
            <MapPin className="mr-2 h-4 w-4" />
            Start Walkthrough
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-center p-4 bg-muted rounded-md">
                <div className="text-center">
                  <Route className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <p className="font-medium">Walkthrough Route Tracking</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Record your path through the project site with GPS coordinates
                  </p>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="project">Project *</Label>
                  <Select
                    value={formData.project_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, project_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project..." />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Select
                    value={formData.purpose}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre_construction">Pre-construction</SelectItem>
                      <SelectItem value="progress_inspection">Progress Inspection</SelectItem>
                      <SelectItem value="quality_check">Quality Check</SelectItem>
                      <SelectItem value="safety_inspection">Safety Inspection</SelectItem>
                      <SelectItem value="final_walkthrough">Final Walkthrough</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspector_name">Inspector/Visitor *</Label>
                  <Input
                    id="inspector_name"
                    value={formData.inspector_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, inspector_name: e.target.value }))}
                    placeholder="Enter inspector name..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weather">Weather Conditions</Label>
                  <Select
                    value={formData.weather_conditions}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, weather_conditions: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select weather..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clear">Clear/Sunny</SelectItem>
                      <SelectItem value="partly_cloudy">Partly Cloudy</SelectItem>
                      <SelectItem value="overcast">Overcast</SelectItem>
                      <SelectItem value="light_rain">Light Rain</SelectItem>
                      <SelectItem value="heavy_rain">Heavy Rain</SelectItem>
                      <SelectItem value="snow">Snow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-between">
          <p className="text-sm text-muted-foreground">
            Site walkthroughs help with accurate estimating and pre-construction planning
          </p>
        </CardFooter>
      </Card>

      {/* Recent Site Visits */}
      {recentVisits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Site Visits</CardTitle>
            <CardDescription>View recent walkthrough history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentVisits.slice(0, 5).map((visit) => (
                <div key={visit.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {projects.find(p => p.id === visit.project_id)?.name || 'Unknown Project'}
                      </p>
                      <Badge variant={visit.status === 'completed' ? 'default' : 'secondary'}>
                        {visit.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {visit.inspector_name} • {new Date(visit.visit_date).toLocaleDateString()}
                      {visit.duration_minutes && ` • ${visit.duration_minutes} min`}
                    </div>
                    {visit.findings && (
                      <p className="text-sm mt-2 line-clamp-2">{visit.findings}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {visit.follow_up_required && (
                      <Badge variant="outline" className="text-xs">Follow-up</Badge>
                    )}
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
