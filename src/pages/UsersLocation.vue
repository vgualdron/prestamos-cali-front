<template>
  <q-page class="">
    <table-users-location />
  </q-page>
</template>

<script>
import TableUsersLocation from 'components/user/TableUsersLocation.vue';

export default {
  components: { TableUsersLocation },
  data() {
    return {
    };
  },
  name: 'PageUsersLocation',
};
</script>
