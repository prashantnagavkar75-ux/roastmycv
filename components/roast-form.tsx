"use client";

import { useState, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FileUpload } from "./file-upload";
import { ToneSelector, type RoastTone } from "./tone-selector";
import { RoastOutput } from "./roast-output";
import { RoastScore } from "./roast-score";
import { Confetti } from "./confetti";
import { Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function RoastForm() {
  const [resumeText, setResumeText] = useState("");
  const [selectedTone, setSelectedTone] = useState<RoastTone>("savage");
  const [inputMethod, setInputMethod] = useState<"paste" | "upload">("paste");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/roast",
        body: { tone: selectedTone },
      }),
    [selectedTone]
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Extract text from assistant messages
  const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop();
  const roastContent = lastAssistantMessage?.parts
    ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("") || "";

  const handleSubmit = useCallback(async () => {
    if (!resumeText.trim()) {
      toast.error("Paste or upload your resume first!");
      return;
    }

    if (resumeText.trim().length < 50) {
      toast.error("Resume seems too short. Add more content!");
      return;
    }

    sendMessage({ text: resumeText }, { body: { tone: selectedTone } });
  }, [resumeText, sendMessage, selectedTone]);

  const handleReset = useCallback(() => {
    setResumeText("");
    setMessages([]);
  }, [setMessages]);

  const handleTextExtracted = useCallback((text: string) => {
    setResumeText(text);
    if (text) {
      toast.success("Resume parsed successfully!");
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Input Method Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setInputMethod("paste")}
          className={cn(
            "px-4 py-2 font-bold text-sm border-2 transition-all",
            inputMethod === "paste"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          PASTE TEXT
        </button>
        <button
          type="button"
          onClick={() => setInputMethod("upload")}
          className={cn(
            "px-4 py-2 font-bold text-sm border-2 transition-all",
            inputMethod === "upload"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          UPLOAD FILE
        </button>
      </div>

      {/* Resume Input */}
      <div className="space-y-2">
        <label className="bg-accent text-accent-foreground px-3 py-1 font-bold text-sm inline-block">
          YOUR RESUME
        </label>
        {inputMethod === "paste" ? (
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume here... We promise to only judge you a little bit."
            className="w-full h-48 p-4 bg-card border-2 border-border focus:border-primary outline-none resize-none font-mono text-sm placeholder:text-muted-foreground"
            disabled={isLoading}
          />
        ) : (
          <FileUpload
            onTextExtracted={handleTextExtracted}
            disabled={isLoading}
          />
        )}
        {resumeText && (
          <p className="text-xs text-muted-foreground">
            {resumeText.length} characters loaded
          </p>
        )}
      </div>

      {/* Tone Selector */}
      <div className="space-y-2">
        <label className="bg-secondary text-secondary-foreground px-3 py-1 font-bold text-sm inline-block">
          DAMAGE LEVEL
        </label>
        <ToneSelector
          selected={selectedTone}
          onSelect={setSelectedTone}
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || !resumeText.trim()}
        className={cn(
          "w-full py-4 font-bold text-lg border-2 transition-all flex items-center justify-center gap-3",
          isLoading
            ? "bg-muted border-muted text-muted-foreground cursor-not-allowed"
            : "bg-primary border-primary text-primary-foreground hover:bg-primary/90 pulse-glow glitch"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            ROASTING IN PROGRESS...
          </>
        ) : (
          <>
            <Zap className="w-6 h-6" />
            ROAST MY CV
          </>
        )}
      </button>

      {/* Output */}
      {(roastContent || isLoading) && (
        <>
          <RoastOutput
            content={roastContent}
            isStreaming={isLoading}
            onReset={handleReset}
          />
          <RoastScore 
            content={roastContent} 
            isVisible={!isLoading && roastContent.length > 100} 
          />
        </>
      )}

      {/* Confetti when roast is complete */}
      <Confetti active={!isLoading && roastContent.length > 100} type="cry" />
    </div>
  );
}
