<template>
  <div>
    <div id="map" :style="{ height: '400px', width: '100%' }"></div>
    <!-- <button @click="send">Enviar Push</button> -->
    <button @click="openInGoogleMaps">Abrir en Google Maps</button>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapActions } from 'vuex';
import notificationTypes from '../../store/modules/notification/types';
import userTypes from '../../store/modules/user/types';

export default {
  name: 'MapCurrentPosition',
  props: {
  },
  mounted() {
    this.getLocation();
    this.pollData();
  },
  data() {
    return {
      location: null, // Para almacenar la ubicación actual
      error: null, // Para manejar errores
      polling: null,
      map: null,
    };
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(notificationTypes.PATH, {
      sendNotification: notificationTypes.actions.SEND_NOTIFICATION,
    }),
    ...mapActions(userTypes.PATH, {
      updateLocation: userTypes.actions.UPDATE_LOCATION,
    }),
    async pollData() {
      this.polling = setInterval(async () => {
        this.getLocation();
      }, 180000);
    },
    async getLocation() {
      let error = '';
      try {
        if (!navigator.geolocation) {
          error = 'Geolocation is not supported by this browser.';
          return;
        }

        // Configuración de opciones para mejor precisión
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        };

        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });

        this.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        this.updateLocation({ latitude: this.location.latitude, longitude: this.location.longitude });
        this.initMap(this.location.latitude, this.location.longitude);

        console.log('Ubicación obtenida con precisión de:', position.coords.accuracy, 'metros');
      } catch (err) {
        this.$q.loading.hide();
        // Manejo detallado de errores
        switch (err.code) {
          case err.PERMISSION_DENIED:
            error = 'Permiso de geolocalización denegado.';
            break;
          case err.POSITION_UNAVAILABLE:
            error = 'Ubicación no disponible.';
            break;
          case err.TIMEOUT:
            error = 'Tiempo de espera agotado.';
            break;
          default:
            error = 'Error desconocido al obtener ubicación.';
            break;
        }
        this.$q.notify({
          type: 'negative',
          message: error,
        });
        console.error('Error al obtener ubicación:', err);
      }
    },
    initMap(lat, lon) {
      if (this.map) {
        this.map.remove();
      }
      this.map = L.map('map').setView([lat, lon], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      L.marker([lat, lon]).addTo(this.map).bindPopup('Ubicación Actual').openPopup();
    },
    openInGoogleMaps() {
      if (this.location) {
        const { lat, lon } = this.location;
        // Crear la URL para abrir en Google Maps
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
        // Abrir la URL en una nueva pestaña o ventana del navegador
        window.open(googleMapsUrl, '_blank');
      } else {
        this.error = 'Location not available. Please allow location access.';
      }
    },
    async send() {
      const data = {
        app_id: `${process.env.APP_ID_ONE_SIGNAL}`,
        headings: { en: 'Titulo' },
        contents: { en: 'Contenido' },
        include_player_ids: ['aeabce5d-08d0-4fcd-8f2a-863b1db96257'],
        url: 'https://www.linkedin.com/feed/',
      };
      await this.sendNotification(data);
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
