<template>
  <q-page class="">
    <StepperVisit :id="newId"/>
  </q-page>
</template>

<script>
import StepperVisit from 'components/visit/StepperVisit.vue';

export default {
  components: {
    StepperVisit,
  },
  data() {
    return {
      newId: null,
    };
  },
  name: 'PageVisit',
  async mounted() {
    const { id } = this.$route.params;
    this.newId = id;
  },
  computed: {
  },
  methods: {
  },
};
</script>
