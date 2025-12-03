import { ref } from "vue";

interface DownloadResult {
  blob: Blob;
  name: string;
  mimeType: string;
  size: number;
}

export function useFileDownloader() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function downloadFile(
    fileUrl: string,
    triggerDownload = false,
    customName?: string
  ): Promise<DownloadResult | null> {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(fileUrl, { method: "GET" });
      if (!response.ok)
        throw new Error(`Failed to download file: ${response.statusText}`);

      const blob = await response.blob();
      const contentType =
        response.headers.get("Content-Type") ?? "application/octet-stream";
      const contentDisposition = response.headers.get("Content-Disposition");
      const inferredName =
        customName ??
        contentDisposition?.match(/filename="?(.+?)"?$/)?.[1] ??
        fileUrl.split("/").pop() ??
        "file";

      if (triggerDownload && process.client) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = inferredName;
        link.click();
        URL.revokeObjectURL(url);
      }

      return {
        blob,
        name: inferredName,
        mimeType: contentType,
        size: blob.size,
      };
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Failed to fetch file";
      error.value = message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  return { downloadFile, loading, error };
}
