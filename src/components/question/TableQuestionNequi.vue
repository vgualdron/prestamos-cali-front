<template>
  <div class="q-px-md">
    <q-btn
      round
      icon="refresh"
      class="q-my-xs"
      color="primary"
      title="Click para refrescar la tabla"
      @click="getItems()">
    </q-btn>
    <div class="row q-mt-md">
      <div class="col-12 text-center">
        <q-input
          debounce="400"
          color="primary"
          v-model="filter"
          class="q-ml-xs"
          placeholder="Buscar"
          clearable
          dense
          outlined
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      :selected.sync="selected"
      :loading="isLoadingTable"
      :filter="filter"
      :pagination.sync="pagination"
      separator="cell"
      class="q-mt-md"
      dense>
      <template v-slot:body="props">
        <q-tr :props="props" @click="clickRow(props.row)">
          <q-td key="actions" :props="props">
            <q-btn
              icon="question_mark"
              color="primary"
              size="sm"
              class="col"
              title="Responder"
              @click="openModal(props.row)" />
          </q-td>
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="cv" :props="props">
            <q-btn
              icon="description"
              color="primary"
              size="sm"
              class="col q-ml-sm"
              @click="openModalCv(props.row)"
              outline/>
          </q-td>
          <q-td key="historial" :props="props">
            <q-btn
              icon="format_list_numbered"
              color="primary"
              size="sm"
              class="col q-ml-sm"
              @click="openModalHistory(props.row)"
              outline/>
          </q-td>
          <q-td key="created_at" :props="props">
            {{ formatDate(props.row.created_at) }}
          </q-td>
          <q-td key="observation" :props="props">
            {{
              props.row.type === 'renovacion'
              ? `El valor solicitado es: ${formatPrice(props.row.observation)}`
              : props.row.observation }}
          </q-td>
          <q-td key="type" :props="props">
            {{ props.row.type }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <cv
      v-model="showModalCv"
      v-if="showModalCv"
      :row="newSelected" />
    <modal-card-board
      v-if="showModalHistory"
      v-model="showModalHistory"
      :showBtnDownload="true"
      :showBtnApplyDoubleInterest="false"
      :hasDoubleInterest="false"
      :showStikers="false"
      title="Historial"
      :lendings="history"/>
    <modal-answer-nequi
      v-if="showModal"
      v-model="showModal"
      :row="itemSelected"
      @updateStatus="responseAnswer"/>
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
// import ModalExistReference from 'components/payment/ModalExistReference.vue';
import Cv from 'components/new/Cv.vue';
import ModalCardBoard from 'components/lending/ModalCardBoard.vue';
import ModalAnswerNequi from './ModalAnswerNequi.vue';
import questionTypes from '../../store/modules/question/types';
import lendingTypes from '../../store/modules/lending/types';
import newTypes from '../../store/modules/new/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      isLoadingTable: false,
      selected: [],
      itemSelected: {},
      columns: [
        {
          name: 'actions',
          required: true,
          label: 'Responder',
          align: 'center',
          style: 'width: 50px',
          headerStyle: 'height: 50px',
        },
        {
          name: 'id',
          align: 'center',
          label: 'ID',
          field: 'id',
          style: 'width: 100px',
          sortable: true,
        },
        {
          name: 'cv',
          align: 'center',
          label: 'Hoja de vida',
          field: 'cv',
          style: 'width: 100px',
          sortable: true,
        },
        {
          name: 'historial',
          align: 'center',
          label: 'Historial',
          field: 'historial',
          style: 'width: 100px',
          sortable: true,
        },
        {
          name: 'observation',
          required: true,
          label: 'Solicitud',
          align: 'center',
          style: 'width: 100px',
          field: (row) => row.observation,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'type',
          required: true,
          label: 'Tipo',
          align: 'center',
          style: 'width: 100px',
          field: (row) => row.type,
          format: (val) => `${val}`,
          sortable: true,
        },
      ],
      pagination: {
        rowsPerPage: 30,
      },
      filter: '',
      isDiabledAdd: false,
      showModal: false,
      showModalCv: false,
      showModalHistory: false,
      polling: null,
      newSelected: null,
    };
  },
  async mounted() {
    this.isLoadingTable = true;
    await this.getItems();
    this.pollData();
    this.isLoadingTable = false;
  },
  computed: {
    ...mapState(questionTypes.PATH, {
      question: 'question',
      questions: 'questions',
      questionStatus: 'status',
      questionResponseMessages: 'responseMessages',
    }),
    ...mapState(lendingTypes.PATH, {
      lending: 'lending',
      history: 'history',
      lendingStatus: 'status',
      lendingResponseMessages: 'responseMessages',
    }),
    ...mapState(newTypes.PATH, {
      new: 'new',
      newStatus: 'status',
      newResponseMessages: 'responseMessages',
    }),
    data() {
      return [...this.questions];
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(questionTypes.PATH, {
      fetchQuestions: questionTypes.actions.LIST_QUESTIONS,
      updateQuestion: questionTypes.actions.UPDATE_QUESTION,
      deleteQuestion: questionTypes.actions.DELETE_QUESTION,
    }),
    ...mapActions(lendingTypes.PATH, {
      getLending: lendingTypes.actions.GET_LENDING,
      fetchHistory: lendingTypes.actions.FETCH_HISTORY,
    }),
    ...mapActions(newTypes.PATH, {
      getNew: newTypes.actions.GET_NEW,
      getNewByPhone: newTypes.actions.GET_NEW_BY_PHONE,
      completeDataNew: newTypes.actions.COMPLETE_DATA_NEW,
    }),
    async pollData() {
      this.polling = setInterval(async () => {
        await this.getItems();
      }, 60000);
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY hh:mm A');
    },
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
    async responseAnswer(data) {
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.updateQuestion(data);

      if (data.type === 'cuenta' && data.status !== 'rechazado') {
        const obj = JSON.parse(data.json);
        await this.completeDataNew({
          id: data.model_id,
          ...obj,
        });
      }

      this.showNotification(this.questionResponseMessages, this.questionStatus, 'top-right', 5000);
      this.showModal = false;
      this.getItems();
      this.$q.loading.hide();
    },
    async getItems() {
      showLoading('consultando ...', 'Por favor, espere', true);
      await this.fetchQuestions({ status: 'pendiente', type: 'nuevo,renovacion,cuenta' });
      this.$q.loading.hide();
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    async openModalCv(row) {
      console.log(row);
      showLoading('consultando ...', 'Por favor, espere', true);
      if (row.type === 'nuevo') {
        await this.getNew(row.model_id);
        await this.getNewByPhone(this.new.phone);
        this.newSelected = { ...this.new };
      } else if (row.type === 'renovacion') {
        await this.getLending(row.model_id);
        await this.getNew(this.lending.new_id);
        this.newSelected = { ...this.new };
      } else if (row.type === 'cuenta') {
        await this.getNew(row.model_id);
        this.newSelected = { ...this.new };
      }
      this.$q.loading.hide();
      this.showModalCv = true;
    },
    async openModalHistory(row) {
      showLoading('consultando ...', 'Por favor, espere', true);
      if (row.type === 'nuevo') {
        await this.getNew(row.model_id);
        await this.getNewByPhone(this.new.phone);
        await this.fetchHistory(this.new.id);
      } else if (row.type === 'renovacion') {
        await this.getLending(row.model_id);
        await this.fetchHistory(this.lending.new_id);
      }
      this.showModalHistory = true;
      this.$q.loading.hide();
    },
    async openModal(row) {
      console.log(row);
      this.showModal = true;
    },
  },
  components: {
    Cv,
    ModalCardBoard,
    ModalAnswerNequi,
  },
};
</script>
