import { ref } from "vue";
import { useFileDownloader } from "./useDownloadFile";
import { useUtils } from "./useUtils";
import type { PdfFileData } from "~/types/book";

export function usePdfReader() {
  const pdfData = ref<PdfFileData | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

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
        try {
          decodedPassword = decryptJWT<{ id: string; exp: number; iat: number }>(
            password
          ).id;
        } catch (e) {
          console.error("Failed to decode PDF password JWT:", e);
        }
      }

      if (typeof source === "string") {
        const downloaded = await downloadFile(source, false);
        if (!downloaded) throw new Error("Failed to download remote PDF file");
        
        if (downloaded.mimeType.includes("text/html") || downloaded.name.endsWith(".html")) {
          throw new Error("The server returned an HTML page instead of a PDF file. This usually happens due to an expired link, authentication error, or a 404 page.");
        }

        fileName = downloaded.name;
        fileSize = downloaded.size;
        arrayBuffer = await downloaded.blob.arrayBuffer();
      } else {
        fileName = source.name;
        fileSize = source.size;
        arrayBuffer = await source.arrayBuffer();
      }

      const result: PdfFileData = {
        name: fileName,
        size: fileSize,
        totalPages: 0, // Will be set by the viewer component once loaded
        data: new Uint8Array(arrayBuffer),
        password: decodedPassword
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

  return {
    pdfData,
    loading,
    error,
    readPdf,
  };
}
