import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
// @ts-ignore
import pkg from 'pdfjs-dist/package.json';

// Set the workerSrc property for pdfjs
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pkg.version}/pdf.worker.min.js`;

export async function getPdfThumbnail(file: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedarray = new Uint8Array(this.result as ArrayBuffer);
        const pdf = await getDocument({ data: typedarray }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context!, viewport }).promise;
        resolve(canvas.toDataURL('image/png'));
      };
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(file);
    } catch (err) {
      reject(err);
    }
  });
} 