"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onTextExtracted: (text: string) => void;
  disabled?: boolean;
}

export function FileUpload({ onTextExtracted, disabled }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/parse-file", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to parse file");
        }

        onTextExtracted(data.text);
        setFile(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process file");
        setFile(null);
      } finally {
        setIsProcessing(false);
      }
    },
    [onTextExtracted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        processFile(droppedFile);
      }
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        processFile(selectedFile);
      }
    },
    [processFile]
  );

  const clearFile = useCallback(() => {
    setFile(null);
    setError(null);
    onTextExtracted("");
  }, [onTextExtracted]);

  return (
    <div
      className={cn(
        "relative border-2 border-dashed transition-all duration-200",
        isDragging
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary/50",
        disabled && "opacity-50 pointer-events-none"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {file ? (
        <div className="p-4 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            <div>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-1 hover:bg-muted rounded transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-8 cursor-pointer">
          {isProcessing ? (
            <>
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
              <p className="text-sm font-medium">Processing file...</p>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium mb-1">
                Drop your resume here or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, DOCX, or TXT (max 5MB)
              </p>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
        </label>
      )}
      {error && (
        <div className="px-4 pb-4">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
