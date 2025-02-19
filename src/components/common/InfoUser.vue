<template>
  <div
    v-if="show"
    class="floating-box"
    :style="{ top: posY + 'px', left: posX + 'px' }"
    @mousedown="initDrag"
  >
    <q-card class="glowing-border">
      <q-card-section>
        <q-markup-table
          class="markup-table"
          separator="cell"
          dense
          >
            <tbody>
              <tr class="">
                <td>
                  Dias trabajados
                </td>
                <td>
                  <b> {{ info.days }}</b>
                </td>
              </tr>
              <tr class="">
                <td>
                  Direcciones requeridas
                </td>
                <td>
                  <b>{{ info.days * info.amountDiary }}</b>
                </td>
              </tr>
              <tr class="">
                <td>
                  Direcciones validas
                </td>
                <td>
                  <b>{{ info.days * info.amountAddress }}</b>
                </td>
              </tr>
              <tr class="">
                <td>
                  Descuento
                </td>
                <td>
                  <b>{{ formatPrice(discount) }}</b>
                </td>
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
      posX: 100,
      posY: 100,
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
    ...mapState(userTypes.PATH, [
      'info',
      'responseMessages',
      'status',
    ]),
    discount() {
      let total = 0;
      const r = (this.info.days * this.info.amountDiary) - this.info.amountAddress;
      if (r > 0) {
        total = this.info.price * r;
      }
      return total;
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(userTypes.PATH, {
      getInfo: userTypes.actions.GET_INFO,
    }),
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
    initDrag(event) {
      this.dragging = true;
      this.offsetX = event.clientX - this.posX;
      this.offsetY = event.clientY - this.posY;
      document.addEventListener('mousemove', this.move);
      document.addEventListener('mouseup', this.stopDrag);
    },
    move(event) {
      if (this.dragging) {
        this.posX = event.clientX - this.offsetX;
        this.posY = event.clientY - this.offsetY;
      }
    },
    stopDrag() {
      this.dragging = false;
      document.removeEventListener('mousemove', this.move);
      document.removeEventListener('mouseup', this.stopDrag);
    },
  },
};
</script>

<style scoped>
.floating-box {
  position: absolute;
  z-index: 1000;
  cursor: grab;
}
.glowing-border {
  border: 5px solid #00ff00;
  box-shadow: 0 0 15px #00ff00;
}
.markup-table {
  display: block;
  border: solid 1px black;
  width: 100%;
}
.markup-table td {
  border: solid 1px black;
}
.q-card__section--vert {
  padding: 0px !important;
}
</style>
