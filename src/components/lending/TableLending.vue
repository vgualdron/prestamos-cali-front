<template>
  <div class="q-px-md">
    <q-btn
      round
      icon="refresh"
      class=""
      color="primary"
      title="Click para refrescar la tabla"
      @click="getLendings(listingSelected.value)">
    </q-btn>
    <q-btn
      icon="assignment_returned"
      class="q-ml-md"
      color="primary"
      title="Click para revisar la entrega"
      @click="showModalDelivery = true">
    </q-btn>
    <q-btn
      icon="add_location_alt"
      class="q-ml-md"
      color="primary"
      title="Click para registrar una dirección"
      @click="showModalAddNew = true">
    </q-btn>
    <div class="row q-mt-md">
      <div class="col-6 text-center">
        <q-select
          outlined
          dense
          :readonly="!validatedPermissions.showAll.status"
          v-model="listingSelected"
          :options="optionsListings"/>
      </div>
      <div class="col-6 text-center">
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
    <q-banner v-if="listing && listing.capture_delivery_file" dense class="bg-grey-3 q-mt-md">
      <template v-slot:avatar>
        <q-icon name="lock" color="primary" />
      </template>
      Ya se realizó la entrega del día
    </q-banner>
    <div v-else class="table-container">
      <q-table
        :grid="$q.screen.xs"
        :data="data"
        :columns="columns"
        row-key="id"
        :loading="isLoadingTable"
        :filter="filter"
        :pagination.sync="pagination"
        separator="cell"
        class="q-mt-md"
        :row-class="'bg-purple'"
        dense
        id="div-container-list">
        <template v-slot:body="props">
          <q-tr :props="props" @click="clickRow(props.row)">
            <q-td key="actions" :props="props">
              <q-btn-dropdown
                v-if="props.row.status === 'open'"
                class="q-px-none"
                :color="getBalance(props.row) <= 0 && allPaidsApproved(props.row) ? 'orange' : 'black'"
                :outline="getBalance(props.row) <= 0 && allPaidsApproved(props.row) ? false : true">
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    @click="openModal('normal', props.row)">
                    <q-item-section>
                      <q-item-label>Ver cartulina</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="getBalance(props.row) <= 0 && allPaidsApproved(props.row)"
                    clickable
                    v-close-popup
                    @click="openModal('renove', props.row)">
                    <q-item-section>
                      <q-item-label>Renovar préstamo</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="props.row.has_double_interest"
                    clickable
                    v-close-popup
                    @click="openModal('double', props.row)">
                    <q-item-section>
                      <q-item-label>Ver cartulina doble interes</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="openModal('history', props.row)">
                    <q-item-section>
                      <q-item-label>Ver Historial</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="isCloseable(props.row)"
                    clickable
                    v-close-popup
                    @click="openModal('close', props.row)">
                    <q-item-section>
                      <q-item-label>Cerrar préstamo</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="props.row.file_url_r"
                    clickable
                    v-close-popup
                    @click="openModal('previewR', props.row) && props.row.type === 'R'">
                    <q-item-section>
                      <q-item-label>Ver voucher de renovación</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="props.row.file_url_n && props.row.type === 'N'"
                    clickable
                    v-close-popup
                    @click="openModal('previewN', props.row)">
                    <q-item-section>
                      <q-item-label>Ver voucher</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="fetchFileRedSocial(props.row)">
                    <q-item-section>
                      <q-item-label>Foto red social</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="fetchAccountsNew(props.row.new_id)">
                    <q-item-section>
                      <q-item-label>Cuentas autorizadas</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-td>
            <q-td key="index" :props="props" :class="props.row.has_letter ? 'bg-yellow' : 'bg-white'">
              <div :class="props.row.file_pdf_url ? 'text-black' : 'text-red'">
                {{ props.row.index }}
              </div>
            </q-td>
            <q-td key="name" :props="props">
              <p :title="props.row.nameDebtor" class="q-my-auto">
                <q-badge
                  v-if="isNew(props.row)"
                  :color="props.row.type === 'N' ? 'green' : 'orange'">
                  {{ props.row.type }}
                </q-badge>
                {{ formatText(props.row.nameDebtor, 30) }}
              </p>
            </q-td>
            <q-td key="amount" :props="props">
              {{ formatPrice(valueWithInterest(props.row)) }}
            </q-td>
            <q-td key="double" :props="props">
              {{ props.row.has_double_interest ? formatPrice(valueWithDoubleInterest(props.row)) : 'x' }}
            </q-td>
            <q-td key="fee" :props="props">
              {{ formatPrice(feeWithInterest(props.row)) }}
            </q-td>
            <q-td key="period" :props="props">
              {{ getPeriod(props.row) }}
            </q-td>
            <q-td key="amountFees" :props="props">
              {{ props.row.amountFees }}
            </q-td>
            <q-td key="renovation" :props="props">
              <template v-if="hasPaymentToday(props.row, 'renovacion', 0)">
                <q-badge
                  v-if="props.row.status === 'renovated'"
                  color="green">
                  <b>
                    {{ formatPrice(getPaymentTodayRenovation(props.row).amount) }}
                  </b>
                </q-badge>
                <b v-else>
                  {{ formatPrice(getPaymentTodayRenovation(props.row).amount) }}
                </b>
              </template>
              <b
                v-else-if="getBalance(props.row) > props.row.amount"
                title="No puede aplicar pago para renovación, si no ha pagado almenos los intereses.">
                <q-icon name="block" color="red" />
              </b>
              <b
                v-else-if="!allPaidsApprovedToday(props.row)"
                title="No puede aplicar pago para renovación, hasta que no se apruebe el pago de nequi.">
                <q-icon name="block" color="red" />
              </b>
              <b
                v-else-if="getBalance(props.row) === 0"
                title="Ya pagó todo el préstamo">
                <q-icon name="block" color="red" />
              </b>
              <b v-else>
                <q-btn
                  color="primary"
                  label="$"
                  size="sm"
                  @click="addPaymentRenovation(props.row)"
                  :disable="isDiabledAdd"
                />
              </b>
            </q-td>
            <q-td key="collection" :props="props">
              <div v-if="hasPaymentToday(props.row, 'nequi', 0)">
                <div v-for="payment in getPaymentsTodaySecre(props.row)" :key="payment.id"
                  class="q-ma-xs">
                  <q-badge
                    :color="payment.id ? payment.classes : ''"
                    :title="payment.id ? payment.observation : ''">
                    <b>{{ formatPrice(payment.amount) }}</b>
                    <q-icon
                      v-if="payment.id && payment.observation"
                      name="comment"
                      size="14px"
                      class="q-ml-xs pointer-cursor"
                    />
                    <q-icon
                      v-if="payment.id && payment.classes !== 'green'"
                      name="close"
                      size="14px"
                      class="q-ml-xs pointer-cursor"
                      @click="deletePayment(payment)"
                    />
                  </q-badge>
                </div>
              </div>
              <b v-if="getBalance(props.row) === 0"
                title="Ya pagó todo el préstamo">
                <q-icon name="block" color="red" />
              </b>
              <b v-else-if="!hasPaymentToday(props.row, 'renovacion', 0) && formatDate(props.row.created_at) !== formatDate(new Date())">
                <q-btn
                  color="primary"
                  label="$"
                  size="sm"
                  @click="addPaymentNequi(props.row)"
                  :disable="isDiabledAdd"
                />
              </b>
            </q-td>
            <q-td key="repayment" :props="props">
              <div v-if="hasRepaymentToday(props.row)">
                <div v-for="payment in getRepaymentsToday(props.row)" :key="payment.id"
                  class="q-ma-xs">
                  <q-badge
                    :color="payment.id ? payment.classes : ''"
                    :title="payment.id ? payment.observation : ''">
                    <b>{{ formatPrice(payment.amount) }}</b>
                  </q-badge>
                </div>
              </div>
            </q-td>
            <q-td key="street" :props="props">
              <div v-if="hasPaymentToday(props.row, 'nequi', 1)">
                <div v-for="payment in getPaymentsTodayStreet(props.row)" :key="payment.id"
                  class="q-ma-xs">
                  <q-badge
                    :color="payment.id ? payment.classes : ''"
                    :title="payment.id ? payment.observation : ''">
                    <b>{{ formatPrice(payment.amount) }}</b>
                    <q-icon
                      v-if="payment.id && payment.observation"
                      name="comment"
                      size="14px"
                      class="q-ml-xs pointer-cursor"
                    />
                  </q-badge>
                </div>
              </div>
            </q-td>
            <q-td key="article" :props="props">
              <div v-if="hasPaymentToday(props.row, 'articulo', 1)">
                <div v-for="payment in getPaymentsTodayArticle(props.row)" :key="payment.id"
                  class="q-ma-xs">
                  <q-badge
                    :color="payment.id ? payment.classes : ''"
                    :title="payment.id ? payment.observation : ''">
                    <b>{{ formatPrice(payment.amount) }}</b>
                    <q-icon
                      v-if="payment.id && payment.observation"
                      name="comment"
                      size="14px"
                      class="q-ml-xs pointer-cursor"
                    />
                  </q-badge>
                </div>
              </div>
            </q-td>
            <q-td key="daysPassed" :props="props">
              {{ daysSinceGivenDate(props.row.firstDate) }}
            </q-td>
            <q-td key="firstDate" :class="rowClass(props.row)" :props="props">
              {{ formatDate(props.row.firstDate) }}
            </q-td>
            <q-td key="endDate" :props="props">
              {{ formatDate(props.row.endDate) }}
            </q-td>
            <q-td key="endPaymentDate" :props="props">
              {{ getLastPaymentDate(props.row) }}
            </q-td>
            <q-td key="amountFeesPaid" :props="props">
              {{ getAmountfeesPaid(props.row) }}
            </q-td>
            <q-td key="balance" :props="props">
              {{ formatPrice(getBalance(props.row)) }}
            </q-td>
            <q-td key="phone" :props="props">
              <q-btn-dropdown
                v-if="hasPhones(props.row)"
                color="black"
                size="12px"
                :auto-close="false"
                outline
                @click="fetchPhonesNew(props.row.new_id)"
              >
              <template v-slot:label>
                <div style="display: flex; flex-direction: column; align-items: center;">
                  <span>{{ processedPhones(props.row.phone)[0] }}</span>
                  <span v-if="processedPhones(props.row.phone)[1] !== null">
                    {{ processedPhones(props.row.phone)[1] }}
                  </span>
                </div>
              </template>
                <q-list>
                  <q-item v-close-popup v-if="newItem.family_reference_name">
                    <q-item-section>
                      <q-item-label>Ref 1: {{ newItem.family_reference_name }}</q-item-label>
                      <q-item-label caption>{{ newItem.family_reference_phone }} - {{ newItem.family_reference_relationship }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-close-popup v-if="newItem.family2_reference_name">
                    <q-item-section>
                      <q-item-label>Ref 2: {{ newItem.family2_reference_name }}</q-item-label>
                      <q-item-label caption>{{ newItem.family2_reference_phone }} - {{ newItem.family2_reference_relationship }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-close-popup v-if="newItem.guarantor_name">
                    <q-item-section>
                      <q-item-label>Fiador: {{ newItem.guarantor_name }}</q-item-label>
                      <q-item-label caption>{{ newItem.guarantor_phone }} - {{ newItem.guarantor_relationship }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <div v-else>
                {{ props.row.phone }}
              </div>
            </q-td>
          </q-tr>
        </template>
        <!-- Fila de totales en el bottom -->
        <template v-slot:bottom-row>
          <q-tr class="bg-blue-2 text-primary">
            <q-td colspan="2"></q-td>
            <q-td><strong>Total {{ totalUnitsCollection }} cobros</strong></q-td>
            <q-td><strong>{{ formatPrice(totalRenovated) }}</strong></q-td>
            <q-td colspan="4"></q-td>
            <q-td><strong>{{ formatPrice(totalRenovation) }}</strong></q-td>
            <q-td><strong>{{ formatPrice(totalSecre) }}</strong></q-td>
            <q-td><strong>{{ formatPrice(totalRepayment) }}</strong></q-td>
            <q-td><strong>{{ formatPrice(totalStreet) }}</strong></q-td>
            <q-td><strong>{{ formatPrice(totalArticle) }}</strong></q-td>
            <q-td colspan="5"><strong>{{ formatPrice(totalCollection) }}</strong></q-td>
            <q-td class="text-red-4"><strong>{{ formatPrice(totalCapital) }}</strong></q-td>
            <q-td></q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <modal-add-payment
      v-if="showModalPaymentNequi"
      v-model="showModalPaymentNequi"
      :valuePayment="valuePayment"
      :row="itemSelected"
      type="nequi"
      @updateTable="getLendings"/>
    <modal-add-payment
      v-if="showModalPaymentRenovation"
      v-model="showModalPaymentRenovation"
      :valuePayment="valuePayment"
      :row="itemSelected"
      type="renovacion"
      @updateTable="getLendings"/>
    <modal-card-board
      v-if="showModalCardBoard"
      v-model="showModalCardBoard"
      :showBtnDownload="true"
      :showBtnApplyDoubleInterest="getBalance(itemSelected) > itemSelected.amount"
      title="Cartulina actual"
      :lendings="[itemSelected]"
      @updateTable="getLendings"/>
    <modal-card-board
      v-if="showModalCardBoardDouble"
      v-model="showModalCardBoardDouble"
      :showBtnDownload="true"
      :showBtnApplyDoubleInterest="false"
      :hasDoubleInterest="true"
      title="Cartulina doble interés"
      :lendings="[itemSelected]"
      @updateTable="getLendings"/>
    <modal-card-board
      v-if="showModalHistory"
      v-model="showModalHistory"
      :showBtnDownload="true"
      :showBtnApplyDoubleInterest="false"
      :hasDoubleInterest="false"
      title="Historial"
      :lendings="history"/>
    <modal-renove
      v-if="showModalRenove"
      v-model="showModalRenove"
      :row="itemSelected"
      @renoveLending="renoveLending"
    />
    <modal-delivery
      v-if="showModalDelivery"
      v-model="showModalDelivery"
      :list="listingSelected"
      :totalAmount="totalCollection"
      @updateTable="getLendings"
    />
    <modal-preview-file
      v-if="showModalPreviewR"
      v-model="showModalPreviewR"
      :url="formatUrl(itemSelected.file_url_r)"
      :type="'image'"
      :showBtnCancel="false"
      :showBtnCopy="false"/>
    <modal-preview-file
      v-if="showModalPreviewN"
      v-model="showModalPreviewN"
      :url="formatUrl(itemSelected.file_url_n)"
      :type="'image'"
      :showBtnCancel="false"
      :showBtnCopy="false"/>
    <modal-preview-file
      v-if="showModalPreviewRedSocial"
      v-model="showModalPreviewRedSocial"
      :url="formatUrl(fileRedSocial)"
      :type="'image'"
      :showBtnCancel="false"
      :showBtnCopy="false"/>
    <modal-closed
      v-if="showModalClosed"
      v-model="showModalClosed"
      :row="itemSelected"
      @closedLending="closedLending"/>
    <modal-accounts
      v-if="showModalAccounts"
      v-model="showModalAccounts"
      :row="newItem"/>
    <form-news
      v-if="showModalAddNew"
      v-model="showModalAddNew"
      type="C"
      :obj="objNew"
      :userSend="listingSelected.userId"
      :showUserSend="false"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import domtoimage from 'dom-to-image';
import moment from 'moment';
import ModalAddPayment from 'components/payment/ModalAddPayment.vue';
import ModalCardBoard from 'components/lending/ModalCardBoard.vue';
import ModalPreviewFile from 'components/common/ModalPreviewFile.vue';
import FormNews from 'components/new/FormNews.vue';
import ModalRenove from './ModalRenove.vue';
import ModalDelivery from './ModalDelivery.vue';
import ModalClosed from './ModalClosed.vue';
import ModalAccounts from './ModalAccounts.vue';
import listingTypes from '../../store/modules/listing/types';
import lendingTypes from '../../store/modules/lending/types';
import paymentTypes from '../../store/modules/payment/types';
import userTypes from '../../store/modules/user/types';
import newTypes from '../../store/modules/new/types';
import fileTypes from '../../store/modules/file/types';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';
import { showNotifications } from '../../helpers/showNotifications';

export default {
  components: {
    ModalAddPayment,
    ModalCardBoard,
    ModalRenove,
    ModalPreviewFile,
    ModalDelivery,
    ModalClosed,
    ModalAccounts,
    FormNews,
  },
  data() {
    return {
      isLoadingTable: false,
      itemSelected: {},
      columns: [
        {
          name: 'actions',
          required: true,
          label: 'Acciones',
          align: 'center',
          style: 'width: 80px',
          headerStyle: 'height: 50px',
        },
        {
          name: 'index',
          required: true,
          label: '#',
          align: 'center',
          style: 'width: 50px',
          headerStyle: 'height: 50px',
        },
        {
          name: 'name',
          required: true,
          label: 'Nombre deudor',
          align: 'center',
          style: 'width: 250px',
          field: (row) => row.nameDebtor,
          format: (val) => `${val}`,
          sortable: false,
        },
        {
          name: 'amount',
          required: true,
          label: 'Valor',
          align: 'center',
          style: 'width: 100px',
          field: (row) => row,
          format: (val) => this.valueWithInterest(val),
          sortable: false,
        },
        {
          name: 'double',
          required: true,
          label: 'Doble int',
          align: 'center',
          style: 'width: 100px',
          field: (row) => row,
          format: (val) => this.valueWithDoubleInterest(val),
          sortable: false,
        },
        {
          name: 'fee',
          required: true,
          label: 'Couta',
          align: 'center',
          style: 'width: 100px',
          field: (row) => row,
          format: (val) => this.feeWithInterest(val),
          sortable: false,
        },
        {
          name: 'period',
          align: 'center',
          label: 'periodo',
          field: 'period',
          style: 'width: 80px',
          sortable: false,
        },
        {
          name: 'amountFees',
          align: 'center',
          label: '# cuotas',
          field: 'amountFees',
          style: 'width: 80px',
          sortable: false,
        },
        {
          name: 'renovation',
          required: true,
          label: 'Renovación',
          align: 'center',
          style: 'width: 100px',
          sortable: false,
        },
        {
          name: 'collection',
          required: true,
          label: 'Secre',
          align: 'center',
          style: 'width: 100px',
          sortable: false,
        },
        {
          name: 'repayment',
          required: true,
          label: 'Adel',
          align: 'center',
          style: 'width: 100px',
          sortable: false,
        },
        {
          name: 'street',
          required: true,
          label: 'Calle',
          align: 'center',
          style: 'width: 100px',
          sortable: false,
        },
        {
          name: 'article',
          required: true,
          label: 'Art',
          align: 'center',
          style: 'width: 100px',
          sortable: false,
        },
        {
          name: 'daysPassed',
          required: true,
          label: 'Dias',
          align: 'center',
          style: 'width: 50px',
          sortable: false,
        },
        {
          name: 'firstDate',
          required: true,
          label: 'Fecha inicio',
          align: 'center',
          style: 'width: 60px',
          field: (row) => row.firstDate,
          format: (val) => this.formatDate(val),
          sortable: false,
        },
        {
          name: 'endDate',
          required: true,
          label: 'Fecha fin',
          align: 'center',
          style: 'width: 60px',
          field: (row) => row.endDate,
          format: (val) => this.formatDate(val),
          sortable: false,
        },
        {
          name: 'endPaymentDate',
          required: true,
          label: 'Último pago',
          align: 'center',
          style: 'width: 60px',
          sortable: false,
        },
        {
          name: 'amountFeesPaid',
          required: true,
          label: '# C. dadas',
          align: 'center',
          style: 'width: 60px',
          sortable: false,
        },
        {
          name: 'balance',
          required: true,
          label: 'Saldo',
          align: 'center',
          style: 'width: 60px',
          sortable: false,
        },
        {
          name: 'phone',
          required: true,
          label: 'Teléfonos',
          align: 'center',
          style: 'width: 60px',
          field: (row) => row.phone,
          format: (val) => val,
          sortable: false,
        },
      ],
      pagination: {
        rowsPerPage: 0,
      },
      filter: '',
      isDiabledAdd: false,
      showModalPaymentNequi: false,
      showModalPaymentRenovation: false,
      listingSelected: null,
      valuePayment: 0,
      showModalCardBoard: false,
      showModalCardBoardDouble: false,
      showModalRenove: false,
      showModalHistory: false,
      polling: null,
      showModalPreviewR: false,
      showModalPreviewN: false,
      showModalDelivery: false,
      showModalClosed: false,
      showModalPreviewRedSocial: false,
      fileRedSocial: '',
      showModalAccounts: false,
      showModalAddNew: false,
      objNew: {},
      location: null,
    };
  },
  watch: {
    async listingSelected(val) {
      await this.getLendings(val.value);
    },
  },
  async mounted() {
    this.isLoadingTable = true;
    await this.getListings();
    if (this.listings && this.listings.length > 0) {
      this.listingSelected = { ...this.optionsListings[0] };
    }
    this.isLoadingTable = false;
    this.pollData();
  },
  computed: {
    ...mapState(lendingTypes.PATH, {
      lendings: 'lendings',
      history: 'history',
      lendingStatus: 'status',
      lendingResponseMessages: 'responseMessages',
    }),
    ...mapState(listingTypes.PATH, [
      'listing',
      'listings',
    ]),
    ...mapState(userTypes.PATH, {
      users: 'users',
      userStatus: 'status',
      userResponseMessages: 'responseMessages',
    }),
    ...mapState(newTypes.PATH, {
      newItem: 'new',
      newStatus: 'status',
      newResponseMessages: 'responseMessages',
    }),
    ...mapState(paymentTypes.PATH, {
      paymentItem: 'payment',
      paymentStatus: 'status',
      paymentResponseMessages: 'responseMessages',
    }),
    validatedPermissions() {
      const showAll = havePermission('list.allLendings');
      return {
        showAll: {
          title: showAll ? 'Ver todas las vistas' : 'No tiene permisos para ver todas las vistas',
          status: showAll,
        },
      };
    },
    optionsUsers() {
      return this.users.map(({ id, name }) => ({ label: name, value: id }));
    },
    optionsListings() {
      return this.listings.map(({
        id,
        name,
        user_collector,
        capture_delivery_file,
      }) => ({
        label: `${name} - ${user_collector.name}`,
        value: id,
        userId: user_collector.id,
        lock: capture_delivery_file,
      }));
    },
    data() {
      return this.lendings.map((row, index) => ({
        ...row,
        index: index + 1,
      }));
    },
    totalCapital() {
      let total = 0;
      this.lendings.forEach((lending) => {
        const balance = this.getBalance(lending);
        total += parseInt(balance, 10);
      });
      return total;
    },
    totalRenovated() {
      const lendings = this.getLendingsTodayRenovated();
      const total = lendings.reduce((result, lending) => (parseInt(result, 10) + parseInt(lending.amount, 10)), 0);
      return total;
    },
    totalSecre() {
      let total = 0;
      this.lendings.forEach((lending) => {
        const payments = this.getPaymentsTodaySecre(lending);
        const approved = payments.filter((payment) => payment.is_valid);
        if (approved && approved.length > 0) {
          const totalPayment = approved.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
          total += parseInt(totalPayment, 10);
        }
      });
      return total;
    },
    totalRepayment() {
      let total = 0;
      this.lendings.forEach((lending) => {
        const payments = this.getRepaymentsToday(lending);
        const approved = payments.filter((payment) => payment.is_valid);
        if (approved && approved.length > 0) {
          const totalPayment = approved.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
          total += parseInt(totalPayment, 10);
        }
      });
      return total;
    },
    totalStreet() {
      let total = 0;
      this.lendings.forEach((lending) => {
        const payments = this.getPaymentsTodayStreet(lending);
        const approved = payments.filter((payment) => payment.is_valid);
        if (approved && approved.length > 0) {
          const totalPayment = approved.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
          total += parseInt(totalPayment, 10);
        }
      });
      return total;
    },
    totalRenovation() {
      let total = 0;
      this.lendings.forEach((lending) => {
        const value = this.getPaymentTodayRenovation(lending);
        if (value) {
          total += parseInt(value.amount, 10);
        }
      });
      return total;
    },
    totalArticle() {
      let total = 0;
      this.lendings.forEach((lending) => {
        const payments = this.getPaymentsTodayArticle(lending);
        const approved = payments.filter((payment) => payment.is_valid);
        if (approved && approved.length > 0) {
          const totalPayment = approved.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
          total += parseInt(totalPayment, 10);
        }
      });
      return total;
    },
    totalCollection() {
      return parseInt(this.totalSecre, 10) + parseInt(this.totalRenovation, 10) + parseInt(this.totalArticle, 10) + parseInt(this.totalStreet, 10) + parseInt(this.totalRepayment, 10);
    },
    totalUnitsCollection() {
      let total = 0;
      this.lendings.forEach((lending) => {
        const payments = this.getPaymentsTodayCollection(lending);
        const approved = payments.filter((payment) => payment.is_valid);
        if (approved && approved.length > 0) {
          total += 1;
        }
      });
      return total;
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(lendingTypes.PATH, {
      fetchLendings: lendingTypes.actions.FETCH_LENDINGS,
      deleteLending: lendingTypes.actions.DELETE_LENDING,
      renovateLending: lendingTypes.actions.RENOVATE_LENDING,
      fetchHistory: lendingTypes.actions.FETCH_HISTORY,
    }),
    ...mapActions(listingTypes.PATH, {
      getListing: listingTypes.actions.GET_LISTING,
      fetchListings: listingTypes.actions.FETCH_LISTINGS,
      fetchMineListings: listingTypes.actions.FETCH_MINE_LISTINGS,
    }),
    ...mapActions(newTypes.PATH, {
      getNew: newTypes.actions.GET_NEW,
    }),
    ...mapActions(paymentTypes.PATH, {
      deletePaid: paymentTypes.actions.DELETE_PAYMENT,
    }),
    ...mapActions(fileTypes.PATH, {
      getFile: fileTypes.actions.GET_FILE,
      saveFile: fileTypes.actions.SAVE_FILE,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    processedPhones(str) {
      const parts = str.split('/');
      return parts.length === 2 ? parts : [parts[0], null];
    },
    async getLocation() {
      try {
        if (navigator.geolocation) {
          // Usamos una promesa para envolver el método getCurrentPosition
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          // Almacenamos la latitud y longitud
          this.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } else {
          this.error = 'Unable to retrieve location. Please allow access.';
        }
      } catch (err) {
        this.error = 'Geolocation is not supported by this browser.';
      }
    },
    async captureImage() {
      showLoading('Guardando ...', 'Por favor, espere', true);
      const element = document.getElementById('div-container-delivery');
      domtoimage.toPng(element).then(async (blob) => {
        this.sendImage(blob.split(',')[1]);
        this.$q.loading.hide();
      }).catch((error) => {
        console.log(error);
      });
    },
    async sendImage(file) {
      await this.getLocation();
      const {
        latitude,
        longitude,
      } = this.location;
      showLoading('Guardando ...', 'Por favor, espere', true);

      await this.saveFile({
        name: 'CAPTURE_ROUTE',
        storage: 'listings',
        modelName: 'listings',
        modelId: this.list.value,
        type: 'image',
        file,
        extension: 'png',
        status: 'aprobado',
        latitude,
        longitude,
        maintain: true,
      });
      this.$q.loading.hide();
      /* if (this.responseMessages && this.status) {
        this.showModal = false;
        this.$emit('savedFile', { name });
        await this.fetchFile();
      } */
      // this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
    },
    async fetchFileRedSocial(row) {
      showLoading('consultando archivo ...', 'Por favor, espere', true);
      const data = {
        name: 'FOTO_RED_SOCIAL',
        modelId: row.new_id,
        modelName: 'news',
      };

      const response = await this.getFile(data);

      this.$q.loading.hide();

      if (response.data) {
        const item = response.data;
        this.fileRedSocial = item.url;
        this.showModalPreviewRedSocial = true;
      } else {
        this.showNotification([{ text: 'No tiene foto de red social' }], false, 'top-right', 5000);
      }
    },
    formatUrl(url) {
      return `${process.env.URL_FILES}${url}`;
    },
    async getListings() {
      if (this.validatedPermissions.showAll.status) {
        await this.fetchListings();
      } else {
        await this.fetchMineListings();
      }
    },
    isCloseable(row) {
      const total = row.has_double_interest ? this.valueWithInterest(row) : this.valueWithInterest(row);
      let totalPayments = 0;
      if (row.payments && row.payments.length > 0) {
        const payments = row.payments.filter((payment) => payment.type === 'nequi' && payment.is_valid);
        totalPayments = payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
      }
      return (total === totalPayments);
    },
    isNew(row) {
      const date = new Date(row.created_at);
      const now = new Date();
      const maxLimit = new Date(date);
      maxLimit.setDate(date.getDate() + 3);
      return now <= maxLimit;
    },
    hasPhones(row) {
      return row.family_reference_phone || row.family2_reference_phone || row.guarantor_phone;
    },
    async pollData() {
      this.polling = setInterval(async () => {
        await this.getLendings(this.listingSelected.value);
      }, 60000);
    },
    rowClass(row) {
      let color = 'bg-white';
      const days = this.daysSinceGivenDate(row.firstDate);
      if (days > 25) {
        color = 'bg-red';
      } else if (days >= 19 && days <= 25) {
        color = 'bg-blue';
      } else if (days >= 13 && days <= 18) {
        color = 'bg-yellow';
      }
      return color;
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
    formatText(val, length) {
      let response = val;
      if (val.length > length) {
        response = `${val.substring(0, length)} ...`;
      }
      return response;
    },
    daysSinceGivenDate(givenDate) {
      // Asegúrate de que la fecha dada esté en formato Date
      givenDate = new Date(givenDate);
      // Obtén la fecha actual
      const today = new Date();
      // Establece la hora de ambos objetos en medianoche para evitar problemas con la hora
      today.setHours(0, 0, 0, 0);
      givenDate.setHours(0, 0, 0, 0);
      // Calcula la diferencia en milisegundos
      const differenceInMillis = today - givenDate;
      // Convierte la diferencia a días
      const millisecondsInADay = 24 * 60 * 60 * 1000;
      const daysPassed = Math.floor(differenceInMillis / millisecondsInADay);
      return daysPassed;
    },
    getPeriod(row) {
      moment.locale('es');
      const format = 'dddd';
      const { period, firstDate } = row;
      const date = moment(firstDate);
      const text = `${period !== 'diario' ? date.format(format) : 'diario'}`;
      return text;
    },
    getLastPaymentDate(row) {
      const format = 'DD/MM/YYYY';
      const { payments } = row;
      if (payments && payments.length > 0) {
        const lastPayment = payments[payments.length - 1];
        return moment(lastPayment.date).format(format);
      }
      return 'x';
    },
    valueWithInterest(row) {
      const val = row.amount + (row.amount * (row.percentage / 100));
      return (val);
    },
    valueWithDoubleInterest(row) {
      const dateDouble = new Date(row.doubleDate);
      const total = row.amount + (row.amount * ((row.percentage * 2) / 100));
      let totalPayments = 0;
      if (row.payments && row.payments.length > 0) {
        const payments = row.payments.filter((payment) => (payment.is_valid && new Date(payment.date) < dateDouble));
        totalPayments = payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
      }
      return (total - totalPayments);
    },
    feeWithInterest(row) {
      const val = row.amount + (row.amount * (row.percentage / 100));
      return (val / row.amountFees);
    },
    getAmountfeesPaid(row) {
      const valueFee = this.feeWithInterest(row);
      let totalPayments = 0;
      let valueAmuntFeesPaid = 0;
      if (row.payments && row.payments.length > 0) {
        const payments = row.payments.filter((payment) => payment.is_valid);
        totalPayments = payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
        valueAmuntFeesPaid = (parseInt(totalPayments, 10) / parseInt(valueFee, 10));
      }
      return Math.floor(valueAmuntFeesPaid);
    },
    getBalance(row) {
      const total = row.has_double_interest ? this.valueWithInterest(row) : this.valueWithInterest(row);
      let totalPayments = 0;
      if (row.payments && row.payments.length > 0) {
        const payments = row.payments.filter((payment) => payment.is_valid);
        totalPayments = payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
      }
      return (total - totalPayments);
    },
    hasPaymentToday(row, type, isStreet) {
      let has = false;
      const currentDate = moment().startOf('day');
      if (row.payments && row.payments.length > 0) {
        row.payments.forEach((payment) => {
          const datePayment = moment(payment.date).startOf('day');
          if (currentDate.isSame(datePayment, 'day') && payment.type === type && payment.is_street === isStreet && payment.observation !== 'adelanto') {
            has = true;
          }
        });
      }
      return has;
    },
    hasRepaymentToday(row) {
      let has = false;
      const currentDate = moment().startOf('day');
      if (row.payments && row.payments.length > 0) {
        row.payments.forEach((payment) => {
          const datePayment = moment(payment.date).startOf('day');
          if (currentDate.isSame(datePayment, 'day') && payment.observation === 'adelanto') {
            has = true;
          }
        });
      }
      return has;
    },
    allPaidsApprovedToday(row) {
      const payments = this.getPaymentsTodayCollection(row);
      const approved = payments.filter((payment) => payment.is_valid);
      return approved.length === payments.length;
    },
    allPaidsApproved(row) {
      const approved = row.payments.filter((payment) => payment.is_valid);
      return approved.length === row.payments.length;
    },
    getLendingsTodayRenovated() {
      const lendings = [];
      const currentDate = moment().startOf('day');
      this.lendings.forEach((lending) => {
        const dateLending = moment(lending.created_at).startOf('day');
        if (currentDate.isSame(dateLending, 'day') && lending.type === 'R') {
          lendings.push(lending);
        }
      });
      return lendings;
    },
    getPaymentsTodayCollection(row) {
      const pays = [];
      const currentDate = moment().startOf('day');
      if (row.payments && row.payments.length > 0) {
        row.payments.forEach((payment) => {
          const datePayment = moment(payment.date).startOf('day');
          if (currentDate.isSame(datePayment, 'day') && (payment.type === 'nequi' || payment.type === 'articulo')) {
            const pay = { ...payment };
            let classes = '';
            let observation = '';
            if (pay.is_valid) {
              classes = 'green';
              observation = pay.observation;
            } else if (pay.status === 'rechazado') {
              classes = 'red';
              observation = pay.observation;
            } else {
              classes = 'black';
            }
            pay.classes = classes;
            pay.observation = observation;
            pays.push(pay);
          }
        });
      }
      return pays;
    },
    getPaymentsTodaySecre(row) {
      const pays = [];
      const currentDate = moment().startOf('day');
      if (row.payments && row.payments.length > 0) {
        row.payments.forEach((payment) => {
          const datePayment = moment(payment.date).startOf('day');
          if (currentDate.isSame(datePayment, 'day') && payment.type === 'nequi' && !payment.is_street && payment.observation !== 'adelanto') {
            const pay = { ...payment };
            let classes = '';
            let observation = '';
            if (pay.is_valid) {
              classes = 'green';
              observation = pay.observation;
            } else if (pay.status === 'rechazado') {
              classes = 'red';
              observation = pay.observation;
            } else {
              classes = 'black';
            }
            pay.classes = classes;
            pay.observation = observation;
            pays.push(pay);
          }
        });
      }
      return pays;
    },
    getPaymentsTodayStreet(row) {
      const pays = [];
      const currentDate = moment().startOf('day');
      if (row.payments && row.payments.length > 0) {
        row.payments.forEach((payment) => {
          const datePayment = moment(payment.date).startOf('day');
          if (currentDate.isSame(datePayment, 'day') && payment.type === 'nequi' && payment.is_street) {
            const pay = { ...payment };
            let classes = '';
            let observation = '';
            if (pay.is_valid) {
              classes = 'green';
              observation = pay.observation;
            } else if (pay.status === 'rechazado') {
              classes = 'red';
              observation = pay.observation;
            } else {
              classes = 'black';
            }
            pay.classes = classes;
            pay.observation = observation;
            pays.push(pay);
          }
        });
      }
      return pays;
    },
    getPaymentsTodayArticle(row) {
      const pays = [];
      const currentDate = moment().startOf('day');
      if (row.payments && row.payments.length > 0) {
        row.payments.forEach((payment) => {
          const datePayment = moment(payment.date).startOf('day');
          if (currentDate.isSame(datePayment, 'day') && payment.type === 'articulo') {
            const pay = { ...payment };
            let classes = '';
            let observation = '';
            if (pay.is_valid) {
              classes = 'green';
              observation = pay.observation;
            } else if (pay.status === 'rechazado') {
              classes = 'red';
              observation = pay.observation;
            } else {
              classes = 'black';
            }
            pay.classes = classes;
            pay.observation = observation;
            pays.push(pay);
          }
        });
      }
      return pays;
    },
    getRepaymentsToday(row) {
      const pays = [];
      const currentDate = moment().startOf('day');
      if (row.payments && row.payments.length > 0) {
        row.payments.forEach((payment) => {
          const datePayment = moment(payment.date).startOf('day');
          if (currentDate.isSame(datePayment, 'day') && payment.observation === 'adelanto') {
            const pay = { ...payment };
            let classes = '';
            let observation = '';
            if (pay.is_valid) {
              classes = 'green';
              observation = pay.observation;
            } else if (pay.status === 'rechazado') {
              classes = 'red';
              observation = pay.observation;
            } else {
              classes = 'black';
            }
            pay.classes = classes;
            pay.observation = observation;
            pays.push(pay);
          }
        });
      }
      return pays;
    },
    getPaymentTodayRenovation(row) {
      let pay = null;
      const currentDate = moment().startOf('day');
      if (row.payments && row.payments.length > 0) {
        row.payments.forEach((payment) => {
          const datePayment = moment(payment.date).startOf('day');
          if (currentDate.isSame(datePayment, 'day') && payment.type === 'renovacion') {
            pay = payment;
          }
        });
      }
      return pay;
    },
    async fetchPhonesNew(id) {
      showLoading('consultando ...', 'Por favor, espere', true);
      await this.getNew(id);
      this.$q.loading.hide();
    },
    async fetchAccountsNew(id) {
      showLoading('consultando ...', 'Por favor, espere', true);
      await this.getNew(id);
      this.showModalAccounts = true;
      this.$q.loading.hide();
    },
    async getLendings(idList) {
      showLoading('consultando ...', 'Por favor, espere', true);
      await this.getListing(idList);
      await this.fetchLendings({
        idList,
      });
      this.$q.loading.hide();
    },
    async save(field, value) {
      this.isLoadingTable = true;
      this.itemSelected[field] = value.value ? value.value : value;
      await this.updateListing(this.itemSelected);
      this.isLoadingTable = false;
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    addPaymentNequi(row) {
      this.valuePayment = this.feeWithInterest(row);
      this.showModalPaymentNequi = true;
    },
    addPaymentRenovation(row) {
      this.valuePayment = this.getBalance(row);
      this.showModalPaymentRenovation = true;
    },
    async openModal(action, row) {
      if (action === 'normal') {
        this.showModalCardBoard = true;
      } else if (action === 'double') {
        this.showModalCardBoardDouble = true;
      } else if (action === 'renove') {
        this.showModalRenove = true;
      } else if (action === 'previewR') {
        this.showModalPreviewR = true;
      } else if (action === 'previewN') {
        this.showModalPreviewN = true;
      } else if (action === 'history') {
        showLoading('consultando ...', 'Por favor, espere', true);
        await this.fetchHistory(row.new_id);
        this.$q.loading.hide();
        this.showModalHistory = true;
      } else if (action === 'close') {
        this.showModalClosed = true;
      }
    },
    deletePayment(row) {
      this.$q.dialog({
        title: 'Eliminar',
        message: 'Está seguro que desea eliminar el pago?',
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative',
          text: 'adsa',
        },
        persistent: true,
      }).onOk(async () => {
        this.isLoadingTable = true;
        await this.deletePaid(row.id);
        await this.getLendings(this.listingSelected.value);
        this.isLoadingTable = false;
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    },
    async renoveLending(row) {
      showLoading('Renovando ...', 'Por favor, espere', true);
      await this.renovateLending({ ...row });
      await this.getLendings(this.listingSelected.value);
      this.$q.loading.hide();
    },
    async closedLending() {
      await this.getLendings(this.listingSelected.value);
    },
  },
};
</script>
<style scoped>
  .q-table--dense .q-table th:first-child, .q-table--dense .q-table td:first-child {
    padding-left: 4px;
  }
  .q-table--dense .q-table th, .q-table--dense .q-table td {
    padding: 4px 4px;
  }
  .pointer-cursor {
    cursor: pointer;
  }
  #div-container-list > div.q-table__middle.scroll {
    overflow: visible !important;
  }
</style>
