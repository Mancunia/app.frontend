import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";

export const usePdfPages = async (
  pdfUrl: string,
  password?: string
): Promise<HTMLCanvasElement[]> => {
  const pages: HTMLCanvasElement[] = [];

  // Set worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  // Load PDF with password
  const loadingTask = pdfjsLib.getDocument({
    url: pdfUrl,
    password, // Optional
  });

  // Handle password prompt (optional: can be a callback for interactive handling)
  loadingTask.onPassword = (callback, reason) => {
    if (reason === pdfjsLib.PasswordResponses.NEED_PASSWORD) {
      throw new Error('Password is required')
    } else if (reason === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD) {
      throw new Error("Incorrect password.");
    }

    // Prompt or reuse provided password
    if (password) {
      callback(password);
    } else {
      throw new Error("Password required but not provided.");
    }
  };

  let pdf: PDFDocumentProxy;

  try {
    pdf = await loadingTask.promise;
  } catch (error) {
    console.error("Error loading PDF:", error);
    throw error;
  }

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    pages.push(canvas);
  }

  return pages;
};
