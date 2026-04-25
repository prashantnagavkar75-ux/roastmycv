"use client";

import { useState } from "react";
import { Copy, Check, Share2, Download, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RoastOutputProps {
  content: string;
  isStreaming: boolean;
  onReset: () => void;
}

export function RoastOutput({ content, isStreaming, onReset }: RoastOutputProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Roast copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareRoast = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "My Resume Got Roasted",
        text: content.slice(0, 200) + "...",
        url: window.location.href,
      });
    } else {
      copyToClipboard();
    }
  };

  const downloadRoast = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-resume-roast.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Roast downloaded!");
  };

  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')
      .replace(/__(.*?)__/g, '<em class="text-secondary">$1</em>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2 text-accent">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-primary">$1</h2>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n/g, "<br />");
  };

  return (
    <div className="border-2 border-primary bg-card relative overflow-hidden">
      <div className="bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between">
        <span className="font-bold text-sm tracking-wider">
          {isStreaming ? "GENERATING ROAST..." : "ROAST COMPLETE"}
        </span>
        <div className="flex items-center gap-2">
          {!isStreaming && (
            <>
              <button
                onClick={copyToClipboard}
                className="p-1.5 hover:bg-primary-foreground/20 transition-colors"
                title="Copy"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={shareRoast}
                className="p-1.5 hover:bg-primary-foreground/20 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={downloadRoast}
                className="p-1.5 hover:bg-primary-foreground/20 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onReset}
                className="p-1.5 hover:bg-primary-foreground/20 transition-colors"
                title="New Roast"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className={cn("p-6 min-h-[200px] scan-lines", isStreaming && "cursor-blink")}>
        <div
          className="prose prose-invert max-w-none text-sm leading-relaxed font-mono"
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
      </div>

      {isStreaming && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted overflow-hidden">
          <div className="h-full bg-primary animate-pulse" style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
}
