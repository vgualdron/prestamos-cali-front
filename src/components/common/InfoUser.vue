<template>
  <div
    v-if="show"
    class="floating-box"
    :class="{ minimized: isMinimized }"
    :style="{ top: posY + 'px', left: posX + 'px', width: boxWidth + 'px', height: boxHeight + 'px' }"
    @mousedown="initDrag"
    @touchstart="initDrag"
  >
    <q-card class="glowing-border">
      <q-card-section class="header" @mousedown.stop="initDrag" @touchstart.stop="initDrag">
        <div class="title">Direcciones</div>
        <div class="buttons">
          <q-btn dense flat icon="zoom_in_map" @click="toggleMinimize" v-if="!isMinimized" />
          <q-btn dense flat icon="zoom_out_map" @click="toggleMinimize" v-else />
        </div>
      </q-card-section>
      <q-card-section v-show="!isMinimized">
        <q-markup-table class="markup-table" separator="cell" dense>
          <tbody>
            <!-- <tr>
              <td>Días trabajados</td>
              <td><b>{{ info.days }}</b></td>
            </tr> -->
            <tr>
              <td>Direcciones requeridas</td>
              <td><b>30</b></td>
            </tr>
            <tr>
              <td>Direcciones válidas</td>
              <td><b>{{ info.amountAddress }}</b></td>
            </tr>
            <tr>
              <td>Descuento</td>
              <td><b>{{ formatPrice((info.price * 30) - total) }}</b></td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import userTypes from '../../store/modules/user/types';

export default {
  name: 'InfoUser',
  data() {
    return {
      show: true,
      isMinimized: false,
      posX: 100,
      posY: 100,
      boxWidth: 250,
      boxHeight: 200,
      prevWidth: 250,
      prevHeight: 200,
      dragging: false,
      offsetX: 0,
      offsetY: 0,
      polling: null,
    };
  },
  async mounted() {
    this.pollData();
    await this.getInfo();
  },
  computed: {
    ...mapState(userTypes.PATH, ['info', 'responseMessages', 'status']),
    discount() {
      let total = 0;
      const r = this.info.days * this.info.amountDiary - this.info.amountAddress;
      if (r > 0) {
        total = this.info.price * r;
      }
      return total;
    },
    total() {
      let total = 0;
      total = this.info.price * this.info.amountAddress;
      return total;
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(userTypes.PATH, { getInfo: userTypes.actions.GET_INFO }),
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
    async pollData() {
      this.polling = setInterval(async () => {
        await this.getInfo();
      }, 300000);
    },
    toggleMinimize() {
      if (this.isMinimized) {
        this.boxWidth = this.prevWidth;
        this.boxHeight = this.prevHeight;
      } else {
        this.prevWidth = this.boxWidth;
        this.prevHeight = this.boxHeight;
        this.boxWidth = 120;
        this.boxHeight = 40;
      }
      this.isMinimized = !this.isMinimized;
    },
    initDrag(event) {
      if (this.isMinimized) return;

      this.dragging = true;
      let clientX = 0;
      let clientY = 0;

      if (event.type === 'touchstart') {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      this.offsetX = clientX - this.posX;
      this.offsetY = clientY - this.posY;

      document.body.style.userSelect = 'none'; // Evita seleccionar texto mientras se arrastra
      document.addEventListener('mousemove', this.move);
      document.addEventListener('mouseup', this.stopDrag);
      document.addEventListener('touchmove', this.move, { passive: false });
      document.addEventListener('touchend', this.stopDrag);
    },
    move(event) {
      if (!this.dragging || this.isMinimized) return;

      let clientX = 0;
      let clientY = 0;
      if (event.type === 'touchmove') {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
        event.preventDefault();
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      this.posX = clientX - this.offsetX;
      this.posY = clientY - this.offsetY;
    },
    stopDrag() {
      this.dragging = false;
      document.body.style.userSelect = ''; // Restaura la selección de texto
      document.removeEventListener('mousemove', this.move);
      document.removeEventListener('mouseup', this.stopDrag);
      document.removeEventListener('touchmove', this.move);
      document.removeEventListener('touchend', this.stopDrag);
    },
  },
};
</script>

<style scoped>
.floating-box {
  position: absolute;
  z-index: 1000;
  cursor: grab;
  transition: all 0.2s ease-in-out;
  user-select: none; /* Evita la selección de texto */
}
.floating-box.minimized {
  overflow: hidden;
  cursor: default;
}
.glowing-border {
  border: 5px solid #00ff00;
  box-shadow: 0 0 15px #00ff00;
}
.markup-table {
  display: block;
  border: solid 1px black;
  width: 100%;
  font-size: 8px;
}
.markup-table td {
  border: solid 1px black;
}
.q-card__section--vert {
  padding: 0px !important;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #222;
  color: white;
  padding: 5px;
  cursor: grab; /* Muestra el ícono de mover en la cabecera */
}
.title {
  font-weight: bold;
  margin-left: 10px;
}
.buttons {
  display: flex;
  gap: 0px;
  font-weight: 100;
  margin-right: 5px;
}
</style>
