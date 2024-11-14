<template>
  <div class="contenedor">
    <!-- Zona de imágenes arrastrables -->
    <q-card class="imagenes-disponibles">
      <q-card-section>
        <div>Imágenes para arrastrar:</div>
        <div class="imagenes">
          <img
            v-for="(imagen, index) in imagenes"
            :key="index"
            :src="imagen.src"
            :alt="`Imagen ${index + 1}`"
            draggable="true"
            @dragstart="iniciarArrastre(index)"
            class="imagen-draggable"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Zona para soltar las imágenes -->
    <q-card
      class="dropzone"
      @dragover.prevent
      @drop="soltarImagen"
    >
      <q-card-section>
        <div>ZONA PARA SOLTAR LAS IMÁGENES AQUÍ</div>
        <div class="imagenes-colocadas">
          <img
            v-for="(imagen, index) in imagenesSoltadas"
            :key="index"
            :src="imagen.src"
            :alt="`Imagen soltada ${index + 1}`"
            @click="removerImagen(index)"
            class="imagen-soltar"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imagenes: [
        { src: 'https://micomercio.com.co/stikers/1.jpg' },
        { src: 'https://micomercio.com.co/stikers/2.jpg' },
        { src: 'https://micomercio.com.co/stikers/3.jpg' },
        { src: 'https://micomercio.com.co/stikers/4.jpg' },
        { src: 'https://micomercio.com.co/stikers/5.jpg' },
        { src: 'https://micomercio.com.co/stikers/6.jpg' },
        { src: 'https://micomercio.com.co/stikers/7.jpg' },
        { src: 'https://micomercio.com.co/stikers/8.jpg' },
        { src: 'https://micomercio.com.co/stikers/9.jpg' },
      ],
      imagenesSoltadas: [],
      imagenEnArrastre: null,
    };
  },
  methods: {
    iniciarArrastre(index) {
      // Guarda la imagen en arrastre
      this.imagenEnArrastre = this.imagenes[index];
    },
    soltarImagen() {
      if (this.imagenEnArrastre) {
        // Agrega la imagen en arrastre a la lista de imágenes soltadas
        this.imagenesSoltadas.push(this.imagenEnArrastre);
        // Limpia la imagen en arrastre
        this.imagenEnArrastre = null;
      }
    },
    removerImagen(index) {
      this.imagenesSoltadas.splice(index, 1); // Remueve la imagen de la lista
    },
  },
};
</script>

<style scoped>
.contenedor {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.imagenes-disponibles {
  width: 200px;
}

.imagenes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.imagen-draggable {
  height: 100px;
  cursor: grab;
}

.dropzone {
  width: 300px;
  height: 200px;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
}

.imagenes-colocadas {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.imagen-soltar {
  height: 100px;
}
</style>
