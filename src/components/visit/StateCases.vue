<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :nodes="formatData"
      node-key="label"
      class="markup-table q-mt-md"
      accordion
    >
      <template v-slot:header-root="prop">
        <div class="row items-center">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" class="q-mr-sm" style="width:50px;height:50px">
          <div>
            <b>{{ prop.node.label }}</b>
            <br>
            <q-badge :color="item.status === 'aprobado' ? 'green' : 'blue'">
              Estado: {{ item.status }}
            </q-badge>
            <br>
            <q-badge color="black">
              Fecha inicio: {{ formatDate(item.visit_start_date) }}
            </q-badge>
            <br>
            <q-badge :color="prop.node.completed > 2 ? 'green' : 'red'">
              PASOS COMPLETOS: {{ prop.node.completed }}
            </q-badge>
          </div>
        </div>
      </template>

      <template v-slot:header-generic="prop">
        <div class="row items-center" v-if="prop.node.check">
          <q-icon name="circle" color="green" size="12px" class="q-mr-sm" />
          <div class="text-weight-bold text-primary">
            {{ prop.node.label }}
            <q-icon name="check" color="green" />
          </div>
        </div>
        <div class="row items-center" v-else>
          <q-icon name="circle" color="red" size="12px" class="q-mr-sm" />
          <div class="text-black">
            {{ prop.node.label }}
          </div>
        </div>
      </template>

      <template v-slot:body-story="prop">
        <span class="text-weight-thin">The story is:</span> {{ prop.node.header }}
      </template>

      <template v-slot:body-toggle="prop">
        <p class="text-caption">{{ prop.node.caption }}</p>
      </template>
    </q-tree>
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import diaryTypes from '../../store/modules/diary/types';

export default {
  data() {
    return {
    };
  },
  props: [
    'item',
    'id',
  ],
  computed: {
    ...mapState(diaryTypes.PATH, [
      'responseMessages',
      'status',
      'statusCases',
    ]),
    formatData() {
      const data = {
        label: 'DETALLE DE LA VISITA',
        header: 'root',
        completed: 0,
        children: [],
      };
      const arrayA = [];
      Object.keys(this.statusCases).forEach((i) => {
        const arrayB = [];
        let check = true;
        let completed = 0;
        let total = 0;
        Object.keys(this.statusCases[i]).forEach((j) => {
          total += 1;
          if (this.statusCases[i][j] === false) {
            check = false;
          } else {
            completed += 1;
          }
          arrayB.push({
            label: j.replaceAll('_', ' '),
            header: 'generic',
            check: this.statusCases[i][j],
          });
        });
        arrayA.push({
          label: `${i} (${completed}/${total})`,
          header: 'generic',
          children: arrayB,
          check,
          completed,
          total,
        });
        if (check) {
          data.completed += 1;
        }
      });

      data.children = arrayA;
      return [data];
    },
    customize() {
      return [
        {
          label: 'Detalle de la visita',
          header: 'root',
          children: [
            {
              label: 'Good food',
              icon: 'restaurant_menu',
              header: 'generic',
              children: [
                {
                  label: 'Quality ingredients',
                  header: 'generic',
                  body: 'story',
                  story: 'Lorem ipsum dolor sit amet.',
                },
                {
                  label: 'Good recipe',
                  body: 'story',
                  story: 'A Congressman works with his equally conniving wife to exact revenge on the people who betrayed him.',
                },
              ],
            },
            {
              label: 'Good service',
              header: 'generic',
              body: 'toggle',
              caption: 'Why are we as consumers so captivated by stories of great customer service? Perhaps it is because...',
              children: [
                { label: 'Prompt attention' },
                { label: 'Professional waiter' },
              ],
            },
            {
              label: 'Pleasant surroundings',
              children: [
                { label: 'Happy atmosphere' },
                { label: 'Good table presentation', header: 'generic' },
                { label: 'Pleasing decor' },
              ],
            },
          ],
        },
      ];
    },
  },
  async mounted() {
    console.log(this.item);
    await this.getStatusCases({ id: this.id });
  },
  methods: {
    ...mapActions(diaryTypes.PATH, {
      getStatusCases: diaryTypes.actions.GET_STATUS_CASES,
    }),
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY hh:mm A');
    },
  },
};
</script>
<style scoped>
  p {
    display: block;
    max-width: 640px;
    margin: auto;
  }
  .table-container {
    text-align: center;
  }
  .markup-table {
    display: block;
    max-width: 640px;
    margin: auto;
    border: solid 1px black;
  }
</style>
