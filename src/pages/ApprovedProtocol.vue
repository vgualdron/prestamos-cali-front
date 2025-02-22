<template>
  <q-page class="">
    <table-protocols />
  </q-page>
</template>

<script>
import TableProtocols from 'src/components/protocol/TableProtocols.vue';

export default {
  components: { TableProtocols },
  data() {
    return {
    };
  },
  name: 'PageApprovedProtocol',
};
</script>
