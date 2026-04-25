"use client";

import { Copy, Share2, Download, RotateCcw } from "lucide-react";
import { useState } from "react";
import confetti from "canvas-confetti";

interface RoastResultProps {
  content: string;
  isStreaming: boolean;
  onRoastAgain: () => void;
}

export function RoastResult({ content, isStreaming, onRoastAgain }: RoastResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "My Resume Roast",
        text: content,
        url: window.location.href,
      });
    } else {
      handleCopy();
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-resume-roast.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#facc15", "#ec4899", "#06b6d4"],
    });
  };

  // Format the content with better styling
  const formatContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Headers (lines with all caps or numbered sections)
      if (line.match(/^[A-Z\s\d\.\-:]+$/) && line.length > 3 && line.length < 50) {
        return (
          <h3 key={i} className="font-bold text-lg mt-4 mb-2 text-accent">
            {line}
          </h3>
        );
      }
      // Numbered items
      if (line.match(/^\d+\./)) {
        return (
          <p key={i} className="ml-4 my-1">
            {line}
          </p>
        );
      }
      // Bullet points
      if (line.match(/^[-•*]/)) {
        return (
          <p key={i} className="ml-4 my-1">
            {line}
          </p>
        );
      }
      // Empty lines
      if (line.trim() === "") {
        return <br key={i} />;
      }
      // Regular text
      return (
        <p key={i} className="my-1">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="brutal-border brutal-shadow bg-background">
      {/* Header */}
      <div className="bg-destructive p-3 border-b-4 border-foreground flex items-center justify-between">
        <span className="font-bold text-lg">THE ROAST HAS BEEN SERVED</span>
        {isStreaming && (
          <span className="animate-pulse font-mono text-sm">generating...</span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 min-h-[200px] font-sans leading-relaxed">
        {formatContent(content)}
        {isStreaming && <span className="animate-pulse">|</span>}
      </div>

      {/* Actions */}
      {!isStreaming && content && (
        <div className="border-t-4 border-foreground p-4 flex flex-wrap gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-secondary brutal-border brutal-shadow-sm brutal-shadow-hover font-bold"
          >
            <Copy className="h-4 w-4" />
            {copied ? "COPIED!" : "COPY"}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-primary brutal-border brutal-shadow-sm brutal-shadow-hover font-bold"
          >
            <Share2 className="h-4 w-4" />
            SHARE
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-muted brutal-border brutal-shadow-sm brutal-shadow-hover font-bold"
          >
            <Download className="h-4 w-4" />
            DOWNLOAD
          </button>
          <button
            onClick={() => {
              triggerConfetti();
              onRoastAgain();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground brutal-border brutal-shadow-sm brutal-shadow-hover font-bold ml-auto"
          >
            <RotateCcw className="h-4 w-4" />
            ROAST AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
