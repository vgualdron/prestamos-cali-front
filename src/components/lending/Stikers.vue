<template>
  <q-btn-dropdown
    class="glossy"
    color="primary"
    label="Stikers"
  >
    <div class="row no-wrap q-pa-md">
      <div class="column">
        <div v-for="(item, index) in items" :key="index" class="q-mb-md">
          <q-checkbox
            v-model="item.selected"
            :true-value="true"
            :false-value="false"
            :name="`checkbox-${item.id}`"
            @input="emitSelectedImages"
          >
            <template v-slot:default>
              <img
                :src="item.src"
                alt="checkbox image"
                style="height: 80px; cursor: pointer; margin-right: 10px;"
              />
            </template>
          </q-checkbox>
        </div>
      </div>
    </div>
  </q-btn-dropdown>
</template>
<script>
export default {
  data() {
    return {
      // Items con sus imágenes
      items: [
        {
          id: 1,
          name: 'Option 1',
          src: '/stikers/1.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 2,
          name: 'Option 2',
          src: '/stikers/2.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 3,
          name: 'Option 3',
          src: '/stikers/3.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 4,
          name: 'Option 4',
          src: '/stikers/4.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 5,
          name: 'Option 5',
          src: '/stikers/5.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 6,
          name: 'Option 6',
          src: '/stikers/6.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 7,
          name: 'Option 7',
          src: '/stikers/7.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 8,
          name: 'Option 8',
          src: '/stikers/8.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 9,
          name: 'Option 9',
          src: '/stikers/9.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 10,
          name: 'Option 10',
          src: '/stikers/10.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 11,
          name: 'Option 11',
          src: '/stikers/11.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 12,
          name: 'Option 12',
          src: '/stikers/12.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 13,
          name: 'Option 13',
          src: '/stikers/13.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 14,
          name: 'Option 14',
          src: '/stikers/14.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 15,
          name: 'Option 15',
          src: '/stikers/15.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 16,
          name: 'Option 16',
          src: '/stikers/16.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 17,
          name: 'Option 17',
          src: '/stikers/17.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 18,
          name: 'Option 18',
          src: '/stikers/18.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 19,
          name: 'Option 19',
          src: '/stikers/19.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 20,
          name: 'Option 20',
          src: '/stikers/20.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 21,
          name: 'Option 21',
          src: '/stikers/21.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 22,
          name: 'Option 2',
          src: '/stikers/22.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 23,
          name: 'Option 23',
          src: '/stikers/23.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 24,
          name: 'Option 24',
          src: '/stikers/24.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 25,
          name: 'Option 25',
          src: '/stikers/25.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
        {
          id: 26,
          name: 'Option 26',
          src: '/stikers/26.jpg',
          selected: false,
          top: 50,
          left: 50,
        },
      ],
    };
  },
  methods: {
    emitSelectedImages() {
      const array = this.items.filter((item) => item.selected);
      this.$emit('input', array);
    },
  },
};
</script>

<style scoped>
.q-checkbox {
  display: flex;
  align-items: center;
}
</style>
