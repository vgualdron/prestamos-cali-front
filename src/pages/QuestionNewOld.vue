<template>
  <q-page class="">
    <table-question-nequi type="nuevo-antiguo"/>
  </q-page>
</template>

<script>
import TableQuestionNequi from 'src/components/question/TableQuestion.vue';

export default {
  components: { TableQuestionNequi },
  data() {
    return {
    };
  },
  name: 'PageQuestionNewOld',
  computed: {
  },
};
</script>
