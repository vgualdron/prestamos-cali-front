<template>
  <q-page class="">
    <table-task />
  </q-page>
</template>

<script>
import TableTask from 'src/components/task/TableTask.vue';

export default {
  components: { TableTask },
  data() {
    return {
    };
  },
  name: 'PageTask',
};
</script>
