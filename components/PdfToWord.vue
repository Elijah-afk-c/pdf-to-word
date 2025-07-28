<template>
  <v-container>
    <h2 class="mb-4 text-h5 font-weight-bold">📄 Convert PDF to Word</h2>

    <!-- File Upload -->
    <v-file-input
      label="Upload PDF"
      accept=".pdf"
      @change="handleFile"
      outlined
      dense
      prepend-icon="mdi-upload"
      clearable
      @click:clear="reset"
    />

    <!-- Convert Button -->
    <v-btn
      color="primary"
      class="mt-2"
      @click="convertToDocx"
      :disabled="!pdfText.length"
      depressed
    >
      📥 Download .docx
    </v-btn>

    <!-- Loading Spinner -->
    <v-row justify="center" v-if="loading" class="mt-6">
      <v-col cols="auto">
        <v-progress-circular indeterminate color="primary" size="50" />
        <div class="mt-2">Extracting text, please wait...</div>
      </v-col>
    </v-row>

    <!-- Page Preview -->
    <v-card class="mt-6 pa-4" v-if="!loading && pdfText.length" outlined>
      <h3 class="mb-2 text-h6 font-weight-medium">📝 Preview - Page {{ currentPage }}</h3>
      <div
        class="doc-preview"
        style="
          background: white;
          padding: 24px;
          font-family: 'Georgia', serif;
          font-size: 16px;
          color: black;
          max-height: 400px;
          overflow-y: auto;
          border: 1px solid #ccc;
        "
      >
        {{ pdfText[currentPage - 1] }}
      </div>
    </v-card>

    <!-- Pagination -->
    <v-pagination
      v-if="!loading && pdfText.length > 1"
      v-model="currentPage"
      :length="pdfText.length"
      class="mt-4"
      total-visible="5"
      color="primary"
    />
  </v-container>
</template>

<script>
import { Document, Packer, Paragraph, TextRun, AlignmentType, Footer, PageNumber } from 'docx'
import { saveAs } from 'file-saver'

export default {
  data() {
    return {
      pdfText: [],
      currentPage: 1,
      loading: false
    }
  },
  methods: {
    async handleFile(files) {
      const file = Array.isArray(files) ? files[0] : files
      if (!file) return

      this.reset()
      this.loading = true

      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result)
          const pdf = await this.$pdfjs.getDocument(typedArray).promise

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const pageText = textContent.items.map(item => item.str).join(' ')
            this.pdfText.push(pageText)
          }

          this.loading = false
          this.$toast?.success('Text extracted successfully!')
        } catch (err) {
          this.loading = false
          this.$toast?.error('Failed to parse PDF.')
          console.error(err)
        }
      }

      reader.readAsArrayBuffer(file)
    },

    async convertToDocx() {
      const paragraphs = []

      this.pdfText.forEach((text, index) => {
        // Add page title header
        paragraphs.push(
          new Paragraph({
            text: `Page ${index + 1}`,
            heading: 'Heading1',
            spacing: { after: 300 },
            alignment: AlignmentType.CENTER
          })
        )

        // Split into lines and create formatted paragraphs
        const lines = text.split('\n').filter(line => line.trim())
        lines.forEach(line => {
          const isBullet = /^[-•*]\s+/.test(line)

          const paragraph = new Paragraph({
            spacing: { after: 200, line: 360 }, // 1.5 spacing
            alignment: AlignmentType.JUSTIFIED,
            bullet: isBullet ? { level: 0 } : undefined,
            children: [
              new TextRun({
                text: line.replace(/^[-•*]\s+/, ''),
                font: 'Times New Roman',
                size: 24, // 12pt
                color: '000000'
              })
            ]
          })

          paragraphs.push(paragraph)
        })
      })

      // Footer with page numbers
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 720,     // 1 inch
                  bottom: 720,
                  left: 720,
                  right: 720
                }
              }
            },
            footers: {
              default: new Footer({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun('Page '),
                      PageNumber.CURRENT
                    ]
                  })
                ]
              })
            },
            children: paragraphs
          }
        ]
      })

      const blob = await Packer.toBlob(doc)
      saveAs(blob, 'converted.docx')
    },

    reset() {
      this.pdfText = []
      this.currentPage = 1
      this.loading = false
    }
  }
}
</script>

<style scoped>
.doc-preview::-webkit-scrollbar {
  width: 6px;
}
.doc-preview::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 3px;
}
</style>
