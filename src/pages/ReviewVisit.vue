<template>
  <q-page class="">
    <ReviewVisit :id="newId"/>
  </q-page>
</template>

<script>
import ReviewVisit from 'components/visit/ReviewVisit.vue';
import { showNotifications } from '../helpers/showNotifications';

export default {
  components: {
    ReviewVisit,
  },
  data() {
    return {
      newId: null,
    };
  },
  name: 'PageReviewVisit',
  async mounted() {
    const { id } = this.$route.params;
    this.newId = id;
  },
  computed: {
  },
  methods: {
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
