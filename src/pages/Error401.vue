<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        401
      </div>

      <div class="text-h2" style="opacity:.4">
        Uups. No tienes permisos para ver la pagina...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/home"
        label="Ir a Inicio"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorNotFound',
};
</script>
