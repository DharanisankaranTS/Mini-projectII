import { useState } from "react";
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
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Check, Download, FileJson, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ExportFormat = "json" | "csv";
type ExportType = "donors" | "recipients" | "matches" | "all";

interface ExportFormValues {
  exportType: ExportType;
  exportFormat: ExportFormat;
}

interface ExportDialogProps {
  donors?: any[];
  recipients?: any[];
  matches?: any[];
}

export function ExportDialog({ donors = [], recipients = [], matches = [] }: ExportDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const form = useForm<ExportFormValues>({
    defaultValues: {
      exportType: "all",
      exportFormat: "json"
    }
  });

  const handleExport = (values: ExportFormValues) => {
    let dataToExport;
    let fileName;

    // Determine which data to export
    switch(values.exportType) {
      case "donors":
        dataToExport = donors;
        fileName = "organ-donors";
        break;
      case "recipients":
        dataToExport = recipients;
        fileName = "organ-recipients";
        break;
      case "matches":
        dataToExport = matches;
        fileName = "organ-matches";
        break;
      case "all":
      default:
        dataToExport = {
          donors,
          recipients,
          matches
        };
        fileName = "organ-chain-all-data";
        break;
    }

    // Generate the file based on selected format
    let fileContent;
    let fileType;

    if (values.exportFormat === "json") {
      fileContent = JSON.stringify(dataToExport, null, 2);
      fileType = "application/json";
      fileName += ".json";
    } else {
      // Convert to CSV
      const csvRows = [];
      
      // Get headers for CSV (based on first item's keys)
      if (Array.isArray(dataToExport) && dataToExport.length > 0) {
        const headers = Object.keys(dataToExport[0]);
        csvRows.push(headers.join(","));
        
        // Add data rows
        for (const row of dataToExport) {
          const values = headers.map(header => {
            const val = row[header];
            return typeof val === 'object' ? JSON.stringify(val) : val;
          });
          csvRows.push(values.join(","));
        }
      } else if (typeof dataToExport === 'object') {
        // Handle the 'all' case differently
        Object.entries(dataToExport).forEach(([key, value]) => {
          csvRows.push(`## ${key} ##`);
          if (Array.isArray(value) && value.length > 0) {
            const headers = Object.keys(value[0]);
            csvRows.push(headers.join(","));
            
            for (const row of value) {
              const rowValues = headers.map(header => {
                const val = row[header];
                return typeof val === 'object' ? JSON.stringify(val) : val;
              });
              csvRows.push(rowValues.join(","));
            }
            csvRows.push(""); // Add empty row between sections
          }
        });
      }
      
      fileContent = csvRows.join("\n");
      fileType = "text/csv";
      fileName += ".csv";
    }

    // Create and download the file
    const blob = new Blob([fileContent], { type: fileType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);

    // Show success message
    toast({
      title: "Export successful",
      description: `Data has been exported as ${fileName}`,
      duration: 3000,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Export organ donation data for reporting or backup purposes.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleExport)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="exportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What data do you want to export?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data to export" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="donors">Donors only</SelectItem>
                      <SelectItem value="recipients">Recipients only</SelectItem>
                      <SelectItem value="matches">Matches only</SelectItem>
                      <SelectItem value="all">All data</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose which dataset you want to export
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="exportFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Export format</FormLabel>
                  <Select
                    onValueChange={field.onChange}
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
                    JSON is better for preserving data structure.
                    CSV is better for opening in spreadsheet software.
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="gap-1">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}