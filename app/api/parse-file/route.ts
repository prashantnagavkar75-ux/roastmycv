import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    let text = "";

    if (fileName.endsWith(".txt")) {
      text = await file.text();
    } else if (fileName.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default;
      const buffer = Buffer.from(await file.arrayBuffer());
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } else if (fileName.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (fileName.endsWith(".doc")) {
      return NextResponse.json(
        {
          error:
            "Old .doc format not supported. Please convert to .docx or paste as text.",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Use PDF, DOCX, or TXT." },
        { status: 400 }
      );
    }

    // Clean up the text
    text = text
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!text || text.length < 20) {
      return NextResponse.json(
        { error: "Could not extract text from file. Try pasting instead." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text, length: text.length });
  } catch (error) {
    console.error("File parsing error:", error);
    return NextResponse.json(
      { error: "Failed to parse file. Try pasting your resume instead." },
      { status: 500 }
    );
  }
}
