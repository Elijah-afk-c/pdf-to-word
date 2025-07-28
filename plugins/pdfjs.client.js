import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.js' // Use the raw JS file

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export default (_, inject) => {
  inject('pdfjs', pdfjsLib)
}
