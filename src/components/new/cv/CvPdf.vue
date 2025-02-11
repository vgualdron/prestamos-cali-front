<template>
  <div ref="pdfContainer" style="width: 100%; max-width: 800px; margin: auto;">
    <div>{{ novel.list_name }}</div>
    <div style="display: flex; justify-content: space-between; margin-top: 20px;">
      <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0">Siguiente</button>
    </div>
    <div>
      <canvas id="pdf-page" style="margin-bottom: 20px;" />
    </div>
  </div>
</template>
<script>
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/web/pdf_viewer.css';
import { mapState, mapActions } from 'vuex';
import fileTypes from '../../../store/modules/file/types';
import newTypes from '../../../store/modules/new/types';
import { showLoading } from '../../../helpers/showLoading';

export default {
  data() {
    return {
      item: null,
      urlFile: '',
      pdfDocument: null, // Almacena el documento PDF cargado
      totalPages: 0,
      currentPage: 1,
      scale: 1.2,
      viewportWidth: 0,
      currentRenderTask: null, // Controla la tarea de renderización actual
    };
  },
  props: {
    id: {},
    hidePages: {
      type: Array,
      default: () => [],
    },
  },
  async mounted() {
    await this.fetchFile();
    this.initResizeObserver();
    this.loadPage(this.currentPage);
  },
  computed: {
    ...mapState(newTypes.PATH, {
      novel: 'new',
    }),
  },
  methods: {
    ...mapActions(fileTypes.PATH, {
      getFile: fileTypes.actions.GET_FILE,
    }),
    ...mapActions(newTypes.PATH, {
      getNew: newTypes.actions.GET_NEW,
    }),
    async fetchFile() {
      showLoading('Consultando archivo ...', 'Por favor, espere', true);
      const response = await this.getFile({
        name: 'PDF_CV',
        modelName: 'news',
        modelId: this.id,
      });

      await this.getNew(this.id);
      this.$q.loading.hide();

      if (response.data) {
        this.item = response.data;
        this.urlFile = `${process.env.URL_FILES}${this.item.url}`;
        await this.loadPDFDocument(); // Carga el documento PDF una sola vez
      }
    },
    async loadPDFDocument() {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
      this.pdfDocument = await pdfjsLib.getDocument(this.urlFile).promise;
      const pageNumbers = Array.from({ length: this.pdfDocument.numPages }, (_, index) => index + 1);
      this.totalPages = pageNumbers.filter((p) => !this.hidePages.includes(p)).length;
    },
    async loadPage(pageNumber) {
      if (this.pdfDocument && !this.hidePages.includes(pageNumber)) {
        const page = await this.pdfDocument.getPage(pageNumber);

        // Verifica si la tarea de renderizado tiene el método cancel
        if (this.currentRenderTask && typeof this.currentRenderTask.cancel === 'function') {
          this.currentRenderTask.cancel();
        }

        this.currentRenderTask = this.renderPage(page);
      }
    },
    async renderPage(page) {
      const containerWidth = this.viewportWidth || this.$refs.pdfContainer.clientWidth;
      const viewport = page.getViewport({ scale: containerWidth / page.getViewport({ scale: 1 }).width });

      const canvas = document.getElementById('pdf-page');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      try {
        const renderTask = page.render(renderContext);
        await renderTask.promise;
        this.currentRenderTask = null; // Limpiamos la tarea actual después de completar
      } catch (error) {
        if (error.name !== 'RenderingCancelledException') {
          console.error('Error durante el renderizado de la página:', error);
        }
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
        this.loadPage(this.currentPage);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.loadPage(this.currentPage);
      }
    },
    initResizeObserver() {
      const resizeObserver = new ResizeObserver(() => {
        this.viewportWidth = this.$refs.pdfContainer.clientWidth;
        this.loadPage(this.currentPage); // Redibuja la página actual con el nuevo tamaño
      });
      resizeObserver.observe(this.$refs.pdfContainer);
    },
  },
};
</script>

<style scoped>
button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
