<template>
  <div>
    <div v-if="location" id="google-map-container" style="height: 500px; width: 100%; margin-top: 20px;">
      <!-- Insertar el iframe de Google Maps con la ubicación actual -->
      <iframe
        :src="googleMapUrl"
        width="100%"
        height="100%"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
      ></iframe>
    </div>
    <div v-if="error" class="q-banner bg-red text-white">{{ error }}</div>
    <button class="q-ma-md" @click="openInGoogleMaps">Abrir en Google Maps</button>
  </div>
</template>

<script>
export default {
  name: 'MapCurrentPosition',
  props: {
  },
  mounted() {
    this.getLocation();
  },
  data() {
    return {
      location: null, // Para almacenar la ubicación actual
      googleMapUrl: '', // La URL para el iframe de Google Maps
      error: null, // Para manejar errores
    };
  },
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Almacenamos la latitud y longitud
            this.location = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            };
            // Generamos la URL de Google Maps con la ubicación actual
            this.googleMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.27991287825!2d${this.location.lon}!3d${this.location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1ses-419!2sco!4v1634617472104`;
            this.error = null; // Limpiar cualquier error
          },
          (err) => {
            this.error = `Unable to retrieve location. Please allow access. ${err}`;
          },
        );
      } else {
        this.error = 'Geolocation is not supported by this browser.';
      }
    },
    openInGoogleMaps() {
      if (this.location) {
        const { lat, lon } = this.location;
        // Crear la URL para abrir en Google Maps
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
        console.log(googleMapsUrl);
        // Abrir la URL en una nueva pestaña o ventana del navegador
        window.open(googleMapsUrl, '_blank');
      } else {
        this.error = 'Location not available. Please allow location access.';
      }
    },
  },
};
</script>
<style scoped>
  #map {
    width: 300px;  /* Ancho pequeño */
    height: 300px; /* Alto pequeño */
  }
</style>
