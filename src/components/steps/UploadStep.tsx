"use client";

import { useState, useRef } from 'react';
import { UploadCloud, FileCheck, LoaderCircle, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSheetToTasks } from '@/context/SheetToTasksContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { SheetData } from '@/lib/types';

const parseSpreadsheet = (file: File): Promise<SheetData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        if (!data) {
          throw new Error('Failed to read file data.');
        }
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as (string | number | boolean)[][];

        if (jsonData.length === 0) {
            reject(new Error('Spreadsheet is empty.'));
            return;
        }

        const headers = jsonData[0].map(header => String(header));
        const rows = jsonData.slice(1).map(row => row.map(cell => String(cell)));
        
        resolve({ headers, rows });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};


export default function UploadStep() {
  const { setStep, setSheetData, setFileName } = useSheetToTasks();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = async (file: File | null) => {
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file.name);
    setError(null);
    
    try {
      const data = await parseSpreadsheet(file);
      
      setSheetData(data);
      setFileName(file.name);
      
      setTimeout(() => {
          setIsUploading(false);
          toast({
            title: "File Ready",
            description: "We've processed your spreadsheet.",
            action: <FileCheck className="text-green-500" />
          });
          setTimeout(() => {
            setStep(2);
          }, 1000);
      }, 500)

    } catch (err) {
      setIsUploading(false);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to process file: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage,
      });
    }
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file || null);
    // Reset the input value to allow re-uploading the same file
    if(event.target) {
        event.target.value = '';
    }
  };

  const triggerFileSelect = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isUploading) return;
      const file = e.dataTransfer.files[0];
      handleFile(file);
  }

  const renderContent = () => {
    if (isUploading) {
      return (
        <>
          <LoaderCircle className="h-12 w-12 text-primary animate-spin" />
          <p className="mt-4 font-medium">Processing your file...</p>
          <p className="text-sm text-muted-foreground">{uploadedFile}</p>
        </>
      );
    }
    
    if (uploadedFile && !error) {
       return (
        <>
          <FileCheck className="h-12 w-12 text-green-500" />
          <p className="mt-4 font-medium">File ready!</p>
          <p className="text-sm text-muted-foreground">{uploadedFile}</p>
          <p className="text-sm text-muted-foreground mt-2 animate-pulse">Moving to next step...</p>
        </>
      );
    }

    return (
        <>
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-medium">Drag & drop your file here or click to upload</p>
          <p className="text-sm text-muted-foreground">Supports .xlsx, .xls, and .csv</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button onClick={(e) => { e.stopPropagation(); triggerFileSelect(); }} disabled={isUploading}>
              <FileUp className="mr-2" />
              Upload Spreadsheet
            </Button>
          </div>
        </>
    );
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Upload your spreadsheet</CardTitle>
        <CardDescription>Select a file from your computer to begin the conversion process.</CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-center transition-colors hover:border-primary/50 bg-card cursor-pointer"
          onClick={triggerFileSelect}
          onDragOver={e => { e.preventDefault(); }}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
            disabled={isUploading}
          />
          {renderContent()}
        </div>
        {error && (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
