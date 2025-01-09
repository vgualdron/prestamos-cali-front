<template>
  <q-page class="">
    <div class="row q-mt-md">
      <div class="col-12 text-center">
        <table-lending />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import TableLending from 'components/lending/TableLending.vue';
import lendingTypes from '../store/modules/lending/types';
import { showNotifications } from '../helpers/showNotifications';
import { showLoading } from '../helpers/showLoading';

export default {
  components: { TableLending },
  data() {
    return {
    };
  },
  name: 'PageLending',
  async mounted() {
    showLoading('Cargando ...', 'Por favor, espere', true);
    this.$q.loading.hide();
  },
  watch: {
  },
  computed: {
    ...mapState(lendingTypes.PATH, {
      lendings: 'lendings',
    }),
  },
  methods: {
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
