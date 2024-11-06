<template>
  <div>
    <div id="map" :style="{ height: '400px', width: '100%' }"></div>
    <button @click="openInGoogleMaps">Abrir en Google Maps</button>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
            this.initMap(this.location.lat, this.location.lon);
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
    initMap(lat, lon) {
      const map = L.map('map').setView([lat, lon], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      L.marker([lat, lon]).addTo(map).bindPopup('Ubicación Actual').openPopup();
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
