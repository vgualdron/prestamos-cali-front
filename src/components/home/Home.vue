<template>
  <div class="q-pa-md" justify-center items-center>
    <div class="justify-center q-mt-sm">
      Bienvenidos ...
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {};
  },
  props: [],
  computed: {
  },
  components: {
  },
  mounted() {
    this.validateLogin();
  },
  methods: {
    validateLogin() {
      if (!localStorage.getItem('tokenMC')) {
        this.$router.push('/');
      }
    },
  },
};
</script>
