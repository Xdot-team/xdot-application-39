import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { 
  Camera, 
  Pen, 
  Square, 
  Circle, 
  Type, 
  Ruler, 
  AlertTriangle, 
  Save, 
  Trash2,
  Undo,
  Redo,
  Download,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface Annotation {
  id: string;
  type: 'markup' | 'measurement' | 'note' | 'issue';
  coordinates: { x: number; y: number };
  data: any;
  created_by: string;
  created_at: string;
}

interface PhotoAnnotationToolProps {
  photoId: string;
  photoUrl: string;
  onAnnotationsChange?: (annotations: Annotation[]) => void;
}

export function PhotoAnnotationTool({ photoId, photoUrl, onAnnotationsChange }: PhotoAnnotationToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Array<{x: number, y: number}>>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notePosition, setNotePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchAnnotations();
  }, [photoId]);

  useEffect(() => {
    drawCanvas();
  }, [annotations, zoom, pan]);

  const fetchAnnotations = async () => {
    try {
      const { data, error } = await supabase
        .from('photo_annotations')
        .select('*')
        .eq('photo_id', photoId)
        .order('created_at');

      if (error) throw error;
      const mappedAnnotations = (data || []).map(item => ({
        id: item.id,
        type: item.annotation_type as 'markup' | 'measurement' | 'note' | 'issue',
        coordinates: item.coordinates as { x: number; y: number },
        data: item.annotation_data,
        created_by: item.created_by,
        created_at: item.created_at
      }));
      setAnnotations(mappedAnnotations);
    } catch (error) {
      console.error('Error fetching annotations:', error);
    }
  };

  const saveAnnotation = async (annotation: Omit<Annotation, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('photo_annotations')
        .insert([{
          photo_id: photoId,
          annotation_type: annotation.type,
          coordinates: annotation.coordinates,
          annotation_data: annotation.data,
          created_by: annotation.created_by
        }])
        .select()
        .single();

      if (error) throw error;

      const newAnnotation: Annotation = {
        id: data.id,
        type: annotation.type,
        coordinates: annotation.coordinates,
        data: annotation.data,
        created_by: annotation.created_by,
        created_at: data.created_at
      };

      setAnnotations(prev => [...prev, newAnnotation]);
      onAnnotationsChange?.(annotations);
      
      toast({
        title: "Success",
        description: "Annotation saved successfully",
      });
    } catch (error) {
      console.error('Error saving annotation:', error);
      toast({
        title: "Error",
        description: "Failed to save annotation",
        variant: "destructive",
      });
    }
  };

  const deleteAnnotation = async (annotationId: string) => {
    try {
      const { error } = await supabase
        .from('photo_annotations')
        .delete()
        .eq('id', annotationId);

      if (error) throw error;

      setAnnotations(prev => prev.filter(a => a.id !== annotationId));
      onAnnotationsChange?.(annotations);
      
      toast({
        title: "Success",
        description: "Annotation deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting annotation:', error);
      toast({
        title: "Error",
        description: "Failed to delete annotation",
        variant: "destructive",
      });
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image with zoom and pan
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x, pan.y);
    ctx.drawImage(image, 0, 0, canvas.width / zoom, canvas.height / zoom);
    ctx.restore();

    // Draw annotations
    annotations.forEach(annotation => {
      drawAnnotation(ctx, annotation);
    });

    // Draw current path if drawing
    if (isDrawing && currentPath.length > 1) {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      currentPath.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  };

  const drawAnnotation = (ctx: CanvasRenderingContext2D, annotation: Annotation) => {
    const { x, y } = annotation.coordinates;

    switch (annotation.type) {
      case 'markup':
        if (annotation.data.path) {
          ctx.strokeStyle = annotation.data.color || '#ff0000';
          ctx.lineWidth = annotation.data.lineWidth || 2;
          ctx.beginPath();
          ctx.moveTo(annotation.data.path[0].x, annotation.data.path[0].y);
          annotation.data.path.forEach((point: {x: number, y: number}) => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        }
        break;

      case 'note':
        // Draw note icon
        ctx.fillStyle = '#ffeb3b';
        ctx.fillRect(x - 10, y - 10, 20, 20);
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText('?', x - 3, y + 3);
        break;

      case 'measurement':
        // Draw measurement line
        if (annotation.data.endPoint) {
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(annotation.data.endPoint.x, annotation.data.endPoint.y);
          ctx.stroke();
          
          // Draw measurement text
          const midX = (x + annotation.data.endPoint.x) / 2;
          const midY = (y + annotation.data.endPoint.y) / 2;
          ctx.fillStyle = '#000';
          ctx.font = '12px Arial';
          ctx.fillText(annotation.data.measurement || '0"', midX, midY);
        }
        break;

      case 'issue':
        // Draw issue marker
        ctx.fillStyle = '#f44336';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText('!', x - 3, y + 3);
        break;
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - pan.x;
    const y = (e.clientY - rect.top) / zoom - pan.y;

    switch (selectedTool) {
      case 'note':
        setNotePosition({ x, y });
        setIsNoteDialogOpen(true);
        break;

      case 'issue':
        saveAnnotation({
          type: 'issue',
          coordinates: { x, y },
          data: { severity: 'medium' },
          created_by: 'Current User' // Replace with actual user
        });
        break;

      case 'measurement':
        // Implement measurement tool logic
        break;
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === 'pen') {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom - pan.x;
      const y = (e.clientY - rect.top) / zoom - pan.y;
      
      setCurrentPath([{ x, y }]);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && selectedTool === 'pen') {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom - pan.x;
      const y = (e.clientY - rect.top) / zoom - pan.y;
      
      setCurrentPath(prev => [...prev, { x, y }]);
      drawCanvas();
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDrawing && selectedTool === 'pen' && currentPath.length > 1) {
      saveAnnotation({
        type: 'markup',
        coordinates: currentPath[0],
        data: { 
          path: currentPath,
          color: '#ff0000',
          lineWidth: 2
        },
        created_by: 'Current User' // Replace with actual user
      });
    }
    
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const saveNote = () => {
    if (noteText.trim()) {
      saveAnnotation({
        type: 'note',
        coordinates: notePosition,
        data: { text: noteText },
        created_by: 'Current User' // Replace with actual user
      });
      setNoteText('');
      setIsNoteDialogOpen(false);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));

  const exportAnnotatedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `annotated-photo-${photoId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photo Annotation Tool
          </CardTitle>
          <CardDescription>
            Annotate photos with markup, measurements, notes, and issue markers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedTool === 'pen' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTool('pen')}
            >
              <Pen className="h-4 w-4 mr-1" />
              Pen
            </Button>
            <Button
              variant={selectedTool === 'note' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTool('note')}
            >
              <Type className="h-4 w-4 mr-1" />
              Note
            </Button>
            <Button
              variant={selectedTool === 'measurement' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTool('measurement')}
            >
              <Ruler className="h-4 w-4 mr-1" />
              Measure
            </Button>
            <Button
              variant={selectedTool === 'issue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTool('issue')}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Issue
            </Button>
            
            <div className="border-l mx-2" />
            
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <div className="border-l mx-2" />
            
            <Button variant="outline" size="sm" onClick={exportAnnotatedImage}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            <span>•</span>
            <span>{annotations.length} annotations</span>
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <Card>
        <CardContent className="p-0">
          <div className="relative overflow-hidden" style={{ height: '600px' }}>
            <img
              ref={imageRef}
              src={photoUrl}
              alt="Photo for annotation"
              className="hidden"
              onLoad={drawCanvas}
            />
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="border cursor-crosshair"
              onClick={handleCanvasClick}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Annotations List */}
      <Card>
        <CardHeader>
          <CardTitle>Annotations ({annotations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {annotations.map((annotation) => (
              <div key={annotation.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {annotation.type === 'markup' && <Pen className="h-4 w-4" />}
                  {annotation.type === 'note' && <Type className="h-4 w-4" />}
                  {annotation.type === 'measurement' && <Ruler className="h-4 w-4" />}
                  {annotation.type === 'issue' && <AlertTriangle className="h-4 w-4" />}
                  
                  <div>
                    <div className="font-medium capitalize">{annotation.type}</div>
                    <div className="text-xs text-muted-foreground">
                      {annotation.type === 'note' && annotation.data.text}
                      {annotation.type === 'measurement' && annotation.data.measurement}
                      by {annotation.created_by}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAnnotation(annotation.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {annotations.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No annotations yet. Use the tools above to add annotations.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note-text">Note Text</Label>
              <Textarea
                id="note-text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter your note here..."
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveNote}>
                <Save className="h-4 w-4 mr-1" />
                Save Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}