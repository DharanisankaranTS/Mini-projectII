import { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Upload, AlertTriangle, FileJson, FileSpreadsheet, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type ImportType = "donors" | "recipients";

// Schema for form validation
const importFormSchema = z.object({
  importType: z.enum(["donors", "recipients"]),
  fileFormat: z.enum(["json", "csv"]),
  overwrite: z.boolean().default(false)
});

type ImportFormValues = z.infer<typeof importFormSchema>;

interface ImportDialogProps {
  onImportSuccess?: () => void;
}

export function ImportDialog({ onImportSuccess }: ImportDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<any[] | null>(null);
  const [previewData, setPreviewData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<ImportFormValues>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      importType: "donors",
      fileFormat: "json",
      overwrite: false
    }
  });

  const resetImport = () => {
    setFile(null);
    setImportData(null);
    setPreviewData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Read file contents
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const fileFormat = form.getValues("fileFormat");
        
        if (fileFormat === "json") {
          // Parse JSON data
          const parsedData = JSON.parse(content);
          setImportData(Array.isArray(parsedData) ? parsedData : [parsedData]);
          setPreviewData(JSON.stringify(parsedData, null, 2).substring(0, 500) + (content.length > 500 ? "..." : ""));
        } else {
          // Parse CSV data
          const lines = content.split('\n');
          if (lines.length < 2) {
            throw new Error("CSV file must contain at least header row and one data row");
          }
          
          const headers = lines[0].split(',');
          const jsonData = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue; // Skip empty lines
            
            const values = lines[i].split(',');
            const entry: Record<string, any> = {};
            
            for (let j = 0; j < headers.length; j++) {
              let value = values[j]?.trim() || "";
              
              // Try to parse values that look like objects/arrays
              if (value.startsWith('{') || value.startsWith('[')) {
                try {
                  value = JSON.parse(value);
                } catch (e) {
                  // Keep as string if not valid JSON
                }
              }
              
              entry[headers[j].trim()] = value;
            }
            
            jsonData.push(entry);
          }
          
          setImportData(jsonData);
          setPreviewData(content.substring(0, 500) + (content.length > 500 ? "..." : ""));
        }
      } catch (error) {
        console.error("Error parsing file:", error);
        toast({
          title: "Invalid file format",
          description: "Please ensure your file matches the selected format and is properly formatted.",
          variant: "destructive"
        });
        resetImport();
      }
    };
    
    reader.readAsText(selectedFile);
  };

  const handleImport = async (values: ImportFormValues) => {
    if (!importData || importData.length === 0) {
      toast({
        title: "No data to import",
        description: "Please upload a valid file first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send data to backend for import
      const endpoint = values.importType === "donors" 
        ? "/api/donors/import" 
        : "/api/recipients/import";
      
      const response = await apiRequest("POST", endpoint, {
        data: importData,
        overwrite: values.overwrite
      });
      
      toast({
        title: "Import successful",
        description: `Successfully imported ${response.importedCount || importData.length} ${values.importType}.`,
      });
      
      if (onImportSuccess) {
        onImportSuccess();
      }
      
      setOpen(false);
      resetImport();
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: "There was an error importing your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        resetImport();
      }
      setOpen(newOpen);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Import donor or recipient data from external sources.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleImport)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="importType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What type of data are you importing?</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      resetImport();
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="donors">Donor Records</SelectItem>
                      <SelectItem value="recipients">Recipient Records</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose which type of data you want to import
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="fileFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File format</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      resetImport();
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="json" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <FileJson className="h-4 w-4" />
                          <span>JSON Format</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="csv" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4" />
                          <span>CSV Format</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the format of the file you're uploading
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file-upload">Upload file</Label>
              <Input 
                id="file-upload" 
                type="file" 
                ref={fileInputRef}
                accept={form.getValues("fileFormat") === "json" ? ".json" : ".csv"}
                onChange={handleFileChange}
              />
            </div>
            
            {previewData && (
              <div className="mt-4">
                <Label>Data Preview:</Label>
                <pre className="mt-1 max-h-32 overflow-auto rounded-md bg-slate-950 p-4 text-xs text-slate-50">
                  {previewData}
                </pre>
              </div>
            )}
            
            {file && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Importing will add these records to your database. Ensure the data is properly formatted.
                </AlertDescription>
              </Alert>
            )}
            
            <FormField
              control={form.control}
              name="overwrite"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="space-y-1 leading-none">
                        <FormLabel>Update existing records</FormLabel>
                        <FormDescription>
                          If enabled, existing records with the same email or wallet address will be updated.
                        </FormDescription>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!file || isSubmitting} 
                className="gap-1"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    <span>Importing...</span>
                  </div>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Import Data
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}