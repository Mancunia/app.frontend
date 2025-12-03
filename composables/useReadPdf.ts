import { ref, onUnmounted } from "vue";
import * as pdfjsLib from "pdfjs-dist";
import type {
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/types/src/display/api";
import { useFileDownloader } from "~/composables/useDownloadFile";
import type { PdfFileData, PdfPageData } from "~/types/book";
import { jwtDecode } from "jwt-decode";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export function usePdfReader() {
  const pdfData = ref<PdfFileData | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  let pdfDoc: PDFDocumentProxy | null = null;

  const { downloadFile } = useFileDownloader();
  const { decryptJWT } = useUtils();

  async function readPdf(
    source: File | string,
    password?: string
  ): Promise<PdfFileData | null> {
    try {
      loading.value = true;
      error.value = null;
      pdfData.value = null;

      let arrayBuffer: ArrayBuffer;
      let fileName: string;
      let fileSize = 0;
      let decodedPassword = "";
      if (password) {
        decodedPassword = decryptJWT<{id:string,exp:number,iat:number}>(password).id;
      }

      if (typeof source === "string") {
        const downloaded = await downloadFile(source, false);
        if (!downloaded) throw new Error("Failed to download remote PDF file");
        fileName = downloaded.name;
        fileSize = downloaded.size;
        arrayBuffer = await downloaded.blob.arrayBuffer();
      } else {
        fileName = source.name;
        fileSize = source.size;
        arrayBuffer = await source.arrayBuffer();
      }

      pdfDoc = await pdfjsLib.getDocument({
        data: arrayBuffer,
        password: decodedPassword,
      }).promise;

      const totalPages = pdfDoc.numPages;
      const pages: PdfPageData[] = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page: PDFPageProxy = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const textItems = textContent.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
        pages.push({ pageNumber: pageNum, textContent: textItems });
      }

      const result: PdfFileData = {
        name: fileName,
        size: fileSize,
        totalPages,
        pages,
      };

      pdfData.value = result;
      return result;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Failed to read PDF file";
      error.value = message;
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  onUnmounted(() => {
    if (pdfDoc) pdfDoc.destroy();
  });

  return {
    pdfData,
    loading,
    error,
    readPdf,
  };
}
