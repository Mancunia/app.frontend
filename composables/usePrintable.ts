type PrintOptions = {
    title?: string;
    onCompleted?: () => void;
    strategy?: "internal" | "external";
};

export const usePrintable = () => {
    const print = (printPageRef: HTMLElement, options?: PrintOptions) => {
        // const printMarkup = (printPageRef?.current as HTMLElement).innerHTML;

        const printMarkup = printPageRef;
        const originalDocumentTitle = document.title;

        if (options?.strategy === "internal") {
            const printContents = `<div class="print-container">${printMarkup}</div>`;

            document.title = options?.title || originalDocumentTitle;
            document.body.classList.add("printing");
            document.body.insertAdjacentHTML("beforeend", printContents);

            window.setTimeout(() => {
                // we wait a bit for browser to repaint then print
                window.print();

                document.title = originalDocumentTitle;
                const printContainer =
                    document.querySelector(".print-container");

                if (printContainer) {
                    document.body.removeChild(printContainer);
                }

                document.body.classList.remove("printing");
            }, 1000);

            return;
        }

        const styleSheets = document
            .querySelectorAll('link[rel="stylesheet"], style')
            .entries();
        // Get all stylesheets HTML
        const stylesHtml = Array.from(styleSheets).reduce(
            (styles, [, node]) => styles + node.outerHTML,
            ""
        );

        const printContents = `<!DOCTYPE html>
          <html>
            <head>${stylesHtml}</head>
            <body>
              <div>${printMarkup}</div>
            </body>
          </html>`;

        if (!printMarkup) throw new Error("No markup to print");

        // Open the print window
        const WinPrint = window.open(
            "",
            "",
            "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
        );

        if (WinPrint) {
            // write print content to window
            WinPrint.document.write(printContents);
            WinPrint.document.close(); // finishes writing to a document

            WinPrint.document.title = options?.title || originalDocumentTitle;
            WinPrint.focus();

            WinPrint.onload = () => {
                if (WinPrint.document.readyState === "complete") {
                    // wait for document to finish loading
                    WinPrint.print();
                }
            };

            WinPrint.onafterprint = () => {
                options?.onCompleted?.();
                WinPrint?.close();
            };
        }
    };

    return { print };
};
