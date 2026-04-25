"use client";

import { Upload, FileText, X } from "lucide-react";
import { useRef, useState, useCallback } from "react";

interface ResumeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ResumeInput({ value, onChange }: ResumeInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const text = await file.text();
      onChange(text);
      setFileName(file.name);
    } else if (file.type === "application/pdf") {
      // For PDF, we'll just show a message
      onChange(`[PDF uploaded: ${file.name}]\n\nNote: For best results, please paste the text content of your resume directly. PDF parsing coming soon!`);
      setFileName(file.name);
    } else {
      onChange(`[File uploaded: ${file.name}]\n\nPlease paste your resume text directly for the best roasting experience.`);
      setFileName(file.name);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const clearFile = () => {
    setFileName(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* File upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`brutal-border p-6 text-center cursor-pointer transition-all brutal-shadow-hover ${
          isDragging ? "bg-secondary scale-105" : "bg-muted"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden"
        />
        <Upload className="h-8 w-8 mx-auto mb-2" />
        <p className="font-bold">DROP YOUR RESUME HERE</p>
        <p className="text-sm text-muted-foreground">or click to upload (.txt, .pdf)</p>
      </div>

      {/* File indicator */}
      {fileName && (
        <div className="flex items-center justify-between bg-secondary p-3 brutal-border">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="font-medium">{fileName}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearFile();
            }}
            className="p-1 hover:bg-destructive rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="text-center font-bold text-muted-foreground">OR PASTE IT</div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="paste your resume here bestie... we won't judge (actually we will, that's the whole point)"
        className="w-full h-48 p-4 brutal-border brutal-shadow-sm bg-background resize-none focus:outline-none focus:ring-4 focus:ring-primary font-mono text-sm"
      />

      {/* Character count */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{value.length} characters</span>
        <span>{value.length < 100 ? "need more content to roast fr" : "looking roastable"}</span>
      </div>
    </div>
  );
}
