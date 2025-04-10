<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row q-mt-xs">
        <q-btn
          label="Nuevo"
          color="primary"
          :loading="loading"
          :disable="loading"
          class="q-ma-md"
          @click="openNewModal"
        />
      </div>
      <q-card>
        <q-card-section>
          <q-table
            :data="items"
            :columns="columns"
            row-key="id"
            flat
            bordered
            :loading="loading"
            separator="cell"
            :pagination="{
              rowsPerPage: 0,
            }"
          >
            <template v-slot:body-cell-city_id="props">
              <q-td :props="props">
                <upload-pdf
                  :config="{
                    name: 'PDF_CV',
                    storage: 'news',
                    modelName: 'news',
                    modelId: props.row.id
                  }"
                />
              </q-td>
            </template>
            <template v-slot:body-cell-listing_id="props">
              <q-td :props="props">
                <q-badge color="blue">
                  {{ props.row.listing_name }}
                </q-badge><br>
                <q-btn
                  icon="assignment_returned"
                  class="q-ml-md"
                  color="primary"
                  title="Click para revisar la cartulina"
                  @click="openModal(props.row)">
                </q-btn>
                <q-btn
                  round
                  icon="check"
                  class="q-ml-md"
                  color="green"
                  title="Click para aprobar al nuevo"
                  @click="completeNew(props.row)">
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
        <q-separator />
        <modal-card-board
          v-if="showModalHistory"
          v-model="showModalHistory"
          :showBtnApplyDoubleInterest="false"
          :hasDoubleInterest="false"
          :showStikers="false"
          :showBtnDownload="false"
          title="Historial"
          :lendings="history"/>
      </q-card>
      <!-- MODAL DE CARGA DE NEW -->
      <q-dialog
        v-model="showDialog"
        persistent
        @hide="hideModal"
        full-width
        full-height
      >
        <q-card style="width: 500px; max-width: 80vw;">
          <q-card-section class="row items-center q-pa-none">
            <q-space />
            <q-btn
              icon="close"
              flat
              round
              dense
              v-close-popup
            />
          </q-card-section>
          <q-separator />
          <q-card-section
            class="scroll"
          >
            <q-form
              @submit="saveNew"
              class="q-gutter-md"
            >
              <div class="row q-mt-xs">
                <b>Prestamo</b>
              </div>
              <div class="row q-mt-xs">
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.city_id"
                    :dense="dense"
                    outlined
                    input-debounce="0"
                    label="Ciudad *"
                    :options="zones"
                    option-label="name"
                    option-value="id"
                    :rules="[(val) => (!!val) || '']"
                    @input="inputCity"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                  >
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    label="Ruta *"
                    outlined
                    emit-value
                    map-options
                    :dense="dense"
                    @input="inputList"
                    option-value="id"
                    option-label="name"
                    :rules="[(val) => (!!val) || '']"
                    v-model="item.listing_id"
                    :options="optionsListings"/>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.date_lending"
                    type="date"
                    label="Fecha prestamo*"
                    lazy-rules
                    :rules="[(val) => (!!val) || '']"
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.amount_lending"
                    label="Cantidad prestada *"
                    lazy-rules
                    type="number"
                    :rules="[(val) => (!!val) || '']"
                    hide-bottom-space
                    :hint="formattedPrice(item.amount_lending)"
                    autocomplete="off"
                    :dense="dense"
                    step="1000"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.amount_payment"
                    label="Cantidad abonada *"
                    lazy-rules
                    type="number"
                    :rules="[(val) => (!!val) || '' || val < 0]"
                    hide-bottom-space
                    :hint="formattedPrice(item.amount_payment)"
                    autocomplete="off"
                    :dense="dense"
                    min="0"
                  />
                </div>
              </div>
              <q-separator />
              <div class="row q-mt-xs">
                <b>Cliente</b>
              </div>
              <div class="row q-mt-xs">
                <div class="col-3 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.name"
                    label="Nombre *"
                    lazy-rules
                    :rules="[(val) => (!!val) || '']"
                    hide-bottom-space
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.document_number"
                    label="Num. doc. *"
                    lazy-rules
                    type="number"
                    :rules="[(val) => (!!val) || '']"
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.phone"
                    label="Teléfono *"
                    lazy-rules
                    :rules="[(val) => (!!val) || '']"
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    label="Periodo *"
                    outlined
                    emit-value
                    map-options
                    :dense="dense"
                    option-value="value"
                    option-label="label"
                    v-model="item.period"
                    :options="[{
                      label: 'Diario',
                      value: 'diario',
                    },
                    {
                      label: 'Semanal',
                      value: 'semanal',
                    },
                    {
                      label: 'Quincenal',
                      value: 'quincenal',
                    }]"/>
                </div>
                <div class="col-1 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.quantity"
                    label="Prestamo *"
                    lazy-rules
                    type="number"
                    :rules="[(val) => (!!val) || '']"
                    hide-bottom-space
                    :hint="formattedPrice(item.quantity)"
                    autocomplete="off"
                    :dense="dense"
                    step="1000"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.created_at"
                    label="Fecha de registro *"
                    type="date"
                    lazy-rules
                    :rules="[(val) => (!!val) || '']"
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.lent_by"
                    :dense="dense"
                    outlined
                    input-debounce="0"
                    label="Prestó *"
                    :options="optionsUsers1"
                    option-label="name"
                    option-value="id"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                  >
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.approved_by"
                    :dense="dense"
                    outlined
                    input-debounce="0"
                    label="Autorizó *"
                    :options="optionsUsers2"
                    option-label="name"
                    option-value="id"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                  >
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.address"
                    label="Dirección casa *"
                    lazy-rules
                    :rules="[(val) => (!!val) || '']"
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.sector"
                    outlined
                    input-debounce="0"
                    label="Sector *"
                    option-label="name"
                    option-value="id"
                    :options="yards"
                    @input="changeSector"
                    lazy-rules
                    :rules="[(val) => (!!val) || '']"
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                    :dense="dense"
                  >
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.district"
                    use-input
                    outlined
                    input-debounce="0"
                    label="Barrio *"
                    :options="optionsDistricts"
                    @filter="filterDistricts"
                    option-label="name"
                    option-value="id"
                    :rules="[(val) => (!!val) || '']"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                    :dense="dense"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay coincidencias
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    label="Tipo casa *"
                    outlined
                    emit-value
                    map-options
                    :dense="dense"
                    option-value="value"
                    option-label="label"
                    v-model="item.type_house"
                    :options="[{
                      label: 'Propia',
                      value: 'propia',
                    },
                    {
                      label: 'Arrendada',
                      value: 'arrendada',
                    },
                    {
                      label: 'Familiar',
                      value: 'familiar',
                    }]"/>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.occupation"
                    label="Ocupación*"
                    lazy-rules
                    :rules="[(val) => (!!val) || '']"
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    label="Tipo empleo *"
                    outlined
                    emit-value
                    map-options
                    :dense="dense"
                    option-value="value"
                    option-label="label"
                    v-model="item.type_work"
                    :options="[
                      {
                        label: 'empleado',
                        value: 'empleado'
                      },
                      {
                        label: 'propietario',
                        value: 'propietario'
                      },
                    ]"/>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.address_work"
                    label="Dirección trabajo"
                    lazy-rules
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.address_work_sector"
                    outlined
                    input-debounce="0"
                    label="Sector"
                    option-label="name"
                    option-value="id"
                    :options="yards"
                    @input="changeSector"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                    :dense="dense"
                  >
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.address_work_district"
                    use-input
                    outlined
                    input-debounce="0"
                    label="Barrio"
                    :options="optionsDistrictsWork"
                    @filter="filterDistricts"
                    option-label="name"
                    option-value="id"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                    :dense="dense"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay coincidencias
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.has_letter"
                    use-input
                    outlined
                    input-debounce="0"
                    label="Tiene letra *"
                    :options="[{
                      label: 'SI',
                      value: 1,
                    },
                    {
                      label: 'NO',
                      value: 0,
                    }]"
                    option-label="label"
                    option-value="value"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                    :dense="dense"
                    :disable="true"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay coincidencias
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
              <q-separator />
              <div class="row q-mt-xs">
                <b>Fiador</b>
              </div>
              <div class="row q-mt-xs">
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.guarantor_name"
                    label="Nombre"
                    lazy-rules
                    hide-bottom-space
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.guarantor_document_number"
                    label="Num. doc."
                    lazy-rules
                    type="number"
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.guarantor_phone"
                    label="Teléfono"
                    lazy-rules
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.guarantor_occupation"
                    label="Ocupación"
                    lazy-rules
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.guarantor_address"
                    label="Dirección"
                    lazy-rules
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.guarantor_sector"
                    outlined
                    input-debounce="0"
                    label="Sector"
                    option-label="name"
                    option-value="id"
                    :options="yards"
                    @input="changeSector"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                    :dense="dense"
                  >
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.guarantor_district"
                    use-input
                    outlined
                    input-debounce="0"
                    label="Barrio"
                    :options="optionsDistrictsGuarantor"
                    @filter="filterDistricts"
                    option-label="name"
                    option-value="id"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                    :dense="dense"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay coincidencias
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.guarantor_relationship"
                    label="Parentesco"
                    lazy-rules
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
              </div>
              <q-separator />
              <div class="row q-mt-xs">
                <b>Ref 1</b>
              </div>
              <div class="row q-mt-xs">
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.family_reference_name"
                    label="Nombre"
                    lazy-rules
                    hide-bottom-space
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.family_reference_phone"
                    label="Teléfono"
                    lazy-rules
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.family_reference_address"
                    label="Dirección"
                    lazy-rules
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.family_reference_sector"
                    outlined
                    input-debounce="0"
                    label="Sector"
                    option-label="name"
                    option-value="id"
                    :options="yards"
                    @input="changeSector"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                    :dense="dense"
                  >
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.family_reference_district"
                    use-input
                    outlined
                    input-debounce="0"
                    label="Barrio"
                    :options="optionsDistrictsRef1"
                    @filter="filterDistricts"
                    option-label="name"
                    option-value="id"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                    :dense="dense"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay coincidencias
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.family_reference_relationship"
                    label="Parentesco"
                    lazy-rules
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
              </div>
              <q-separator />
              <div class="row q-mt-xs">
                <b>Ref 2</b>
              </div>
              <div class="row q-mt-xs">
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.family2_reference_name"
                    label="Nombre"
                    lazy-rules
                    hide-bottom-space
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.family2_reference_phone"
                    label="Teléfono"
                    lazy-rules
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.family2_reference_address"
                    label="Dirección"
                    lazy-rules
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.family2_reference_sector"
                    outlined
                    input-debounce="0"
                    label="Sector"
                    option-label="name"
                    option-value="id"
                    :options="yards"
                    @input="changeSector"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                    :dense="dense"
                  >
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.family2_reference_district"
                    use-input
                    outlined
                    input-debounce="0"
                    label="Barrio"
                    :options="optionsDistrictsRef2"
                    @filter="filterDistricts"
                    option-label="name"
                    option-value="id"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                    :dense="dense"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay coincidencias
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.family2_reference_relationship"
                    label="Parentesco"
                    lazy-rules
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
              </div>
              <q-separator />
              <div class="row q-mt-xs">
                <b>Cuenta</b>
              </div>
              <div class="row q-mt-xs">
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.account_type"
                    use-input
                    outlined
                    input-debounce="0"
                    label="Tipo cuenta principal*"
                    :options="[{
                      label: 'Nequi',
                      value: 'nequi',
                    },
                    {
                      label: 'Bancolombia',
                      value: 'bancolombia',
                    },
                    {
                      label: 'ahorro a la mano',
                      value: 'ahorro a la mano',
                    },
                    {
                      label: 'daviplata',
                      value: 'daviplata',
                    }]"
                    option-label="label"
                    option-value="value"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                    :dense="dense"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay coincidencias
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.account_number"
                    label="Numero cuenta principal *"
                    :rules="[(val) => (!!val) || '']"
                    lazy-rules
                    hide-bottom-space
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.account_type_third"
                    use-input
                    outlined
                    input-debounce="0"
                    label="Tipo cuenta tercero"
                    :options="[{
                      label: 'Nequi',
                      value: 'nequi',
                    },
                    {
                      label: 'Bancolombia',
                      value: 'bancolombia',
                    },
                    {
                      label: 'ahorro a la mano',
                      value: 'ahorro a la mano',
                    },
                    {
                      label: 'daviplata',
                      value: 'daviplata',
                    }]"
                    option-label="label"
                    option-value="value"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                    :dense="dense"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay coincidencias
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.account_number_third"
                    label="Numero cuenta tercero"
                    lazy-rules
                    hide-bottom-space
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.account_name_third"
                    label="Nombre cuenta tercero"
                    lazy-rules
                    hide-bottom-space
                    :dense="dense"
                  />
                </div>
                <div class="col-2 q-pa-xs">
                  <q-select
                    v-model="item.account_active"
                    use-input
                    outlined
                    input-debounce="0"
                    label="Cual es la cuenta activa *"
                    :options="[{
                      label: 'Principal',
                      value: 'principal',
                    },
                    {
                      label: 'Tercero',
                      value: 'tercero',
                    }]"
                    option-label="label"
                    option-value="value"
                    lazy-rules
                    hide-bottom-space
                    map-options
                    emit-value
                    autocomplete="off"
                    :dense="dense"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay coincidencias
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
              <q-separator />
              <div class="row q-mt-xs">
                <div class="col-6 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.extra_reference"
                    label="Referencia extra "
                    lazy-rules
                    hide-bottom-space
                    :dense="dense"
                  />
                </div>
                <div class="col-6 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.observation"
                    label="Observación "
                    lazy-rules
                    hide-bottom-space
                    :dense="dense"
                  />
                </div>
              </div>
              <q-separator />
              <div class="row full-width justify-end">
                <div class="col-6">
                  <q-btn label="cancelar"
                    type="reset"
                    color="primary"
                    outline class="col"
                    v-close-popup
                    @click="showDialog = false"
                  />
                  <q-btn
                    label="Aceptar"
                    type="submit"
                    color="primary"
                    class="col q-ml-sm"
                    :loading="loading"
                  />
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>
<script>
import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import UploadPdf from 'components/common/UploadPdf.vue';
import ModalCardBoard from 'components/lending/ModalCardBoard.vue';
import listingTypes from '../store/modules/listing/types';
import zoneTypes from '../store/modules/zone/types';
import userTypes from '../store/modules/user/types';
import yardTypes from '../store/modules/yard/types';
import districtTypes from '../store/modules/district/types';
import lendingTypes from '../store/modules/lending/types';
import newTypes from '../store/modules/new/types';
import { showLoading } from '../helpers/showLoading';
import { removeAccents } from '../helpers/removeAccents';

export default {
  components: {
    UploadPdf,
    ModalCardBoard,
  },
  data() {
    return {
      showModalHistory: false,
      dense: true,
      loading: false,
      items: [],
      columns: [],
      optionsListings: [],
      optionsDistricts: [],
      optionsDistrictsWork: [],
      optionsDistrictsGuarantor: [],
      optionsDistrictsRef1: [],
      optionsDistrictsRef2: [],
      optionsUsers1: [],
      optionsUsers2: [],
      item: {},
      showDialog: false,
      user: {
        city_id: 3,
        listing_id: 1,
        name: '',
        document_number: '',
        phone: '',
        period: 'semanal',
        quantity: 300000,
        created_at: '2024-12-01',
        lent_by: 73,
        approved_by: 52,
        address: '',
        sector: null,
        district: null,
        type_house: 'arreandada',
        occupation: '',
        type_work: 'empleado',
        date_lending: '2024-12-01',
        amount_lending: 300000,
        amount_payment: 0,
        status: 'migracion',
        attempts: 1,
        type_cv: 'pdf',
        site_visit: 'casa',
        user_send: null,
        address_work: '',
        address_work_sector: null,
        address_work_district: null,
        guarantor_document_number: null,
        guarantor_name: '',
        guarantor_occupation: '',
        guarantor_phone: '',
        guarantor_relationship: '',
        guarantor_sector: null,
        guarantor_district: null,
        guarantor_address: '',
        family_reference_name: '',
        family_reference_phone: '',
        family_reference_relationship: '',
        family_reference_address: '',
        family_reference_sector: null,
        family_reference_district: null,
        family2_reference_name: '',
        family2_reference_phone: '',
        family2_reference_relationship: '',
        family2_reference_address: '',
        family2_reference_sector: null,
        family2_reference_district: null,
        account_type: 'nequi',
        account_number: '',
        account_type_third: '',
        account_number_third: '',
        account_name_third: '',
        account_active: 'principal',
        observation: '',
        has_letter: 0,
        extra_reference: '',
      },
    };
  },
  watch: {
    'item.city_id': function (newValue) {
      this.changeCity(newValue);
    },
    'item.amount_lending': function (val) {
      this.item.quantity = val;
    },
    'item.date_lending': function (val) {
      this.item.created_at = val;
    },
    'item.phone': function (val) {
      this.item.account_number = val;
    },
    districts(val) {
      this.optionsDistricts = [...val.filter((district) => district.sector === this.item.sector)];
      this.optionsDistrictsWork = [...val.filter((district) => district.sector === this.item.address_work_sector)];
      this.optionsDistrictsGuarantor = [...val.filter((district) => district.sector === this.item.guarantor_sector)];
      this.optionsDistrictsRef1 = [...val.filter((district) => district.sector === this.item.family_reference_sector)];
      this.optionsDistrictsRef2 = [...val.filter((district) => district.sector === this.item.family2_reference_sector)];
    },
    listings(val) {
      this.optionsListings = [...val.filter((district) => district.city_id === this.item.city_id)];
    },
  },
  computed: {
    ...mapState(listingTypes.PATH, [
      'listings',
    ]),
    ...mapState(zoneTypes.PATH, {
      zones: 'zones',
    }),
    ...mapState(userTypes.PATH, {
      users: 'users',
    }),
    ...mapState(yardTypes.PATH, {
      yards: 'yards',
    }),
    ...mapState(districtTypes.PATH, {
      districts: 'districts',
    }),
    ...mapState(lendingTypes.PATH, {
      lendings: 'lendings',
      history: 'history',
    }),
  },
  async mounted() {
    showLoading('Cargando ...', 'Por favor, espere', true);
    this.clearItem();
    await this.listZones();
    await this.fetchListings();
    await this.getNews();
    await this.listUsersByNameRole({
      roleName: 'Asesor migra',
      status: 1,
      city: 0,
    });
    this.optionsUsers1 = [...this.users];
    await this.listUsersByNameRole({
      roleName: 'Revisor de datos visita migra',
      status: 1,
      city: 0,
    });
    this.optionsUsers2 = [...this.users];
    if (this.items.length) {
      this.columns = Object.keys(this.user).map((key) => ({
        name: key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        align: 'center',
        field: key,
        sortable: true,
      }));
    }
    this.$q.loading.hide();
  },
  methods: {
    ...mapActions(listingTypes.PATH, {
      fetchListings: listingTypes.actions.FETCH_LISTINGS,
    }),
    ...mapActions(zoneTypes.PATH, {
      listZones: zoneTypes.actions.LIST_ZONES,
    }),
    ...mapActions(userTypes.PATH, {
      listUsers: userTypes.actions.LIST_USERS,
      listUsersByNameRole: userTypes.actions.LIST_USERS_BY_NAME_ROLE,
    }),
    ...mapActions(yardTypes.PATH, {
      listYardsByZone: yardTypes.actions.LIST_YARDS_BY_ZONE,
    }),
    ...mapActions(districtTypes.PATH, {
      listDistricts: districtTypes.actions.FETCH_DISTRICTS,
    }),
    ...mapActions(lendingTypes.PATH, {
      fetchHistory: lendingTypes.actions.FETCH_HISTORY,
    }),
    ...mapActions(newTypes.PATH, {
      completeDataNew: newTypes.actions.COMPLETE_DATA_NEW,
    }),
    formattedPrice(value) {
      if (!value) return '';
      return value
        .toString()
        .replace(/\D/g, '') // Elimina caracteres no numéricos
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agrega puntos como separadores
    },
    inputCity(val) {
      localStorage.setItem('citySelectedMigration', val);
    },
    inputList(val) {
      localStorage.setItem('listSelectedMigration', val);
    },
    openNewModal() {
      this.item.city_id = parseInt(localStorage.getItem('citySelectedMigration'), 10);
      this.item.listing_id = parseInt(localStorage.getItem('listSelectedMigration'), 10);
      this.showDialog = true;
    },
    async completeNew(row) {
      showLoading('completando ...', 'Por favor, espere', true);
      await this.completeDataNew({
        id: row.id,
        status: 'consignado',
      });
      await this.getNews();
      this.$q.loading.hide();
    },
    async openModal(row) {
      showLoading('consultando ...', 'Por favor, espere', true);
      await this.fetchHistory(row.id);
      this.$q.loading.hide();
      this.showModalHistory = true;
    },
    hideModal() {
      this.clearItem();
    },
    clearItem() {
      this.item = { ...this.user };
    },
    async changeCity(cityValue) {
      console.log('changecity: ', cityValue);
      this.item.sector = null;
      this.item.district = null;
      this.item.listing_id = parseInt(localStorage.getItem('listSelectedMigration'), 10);
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listYardsByZone({ id: cityValue, displayAll: 1 });
      this.optionsListings = [...this.listings.filter((district) => district.city_id === this.item.city_id)];
      this.$q.loading.hide();
    },
    async changeSector() {
      this.user.district = null;
      showLoading('Cargando barrios ...', 'Por favor, espere', true);
      await this.listDistricts();
      this.optionsDistricts = [...this.districts.filter((district) => district.sector === this.item.sector)];
      this.optionsDistrictsWork = [...this.districts.filter((district) => district.sector === this.item.address_work_sector)];
      this.optionsDistrictsGuarantor = [...this.districts.filter((district) => district.sector === this.item.guarantor_sector)];
      this.optionsDistrictsRef1 = [...this.districts.filter((district) => district.sector === this.item.family_reference_sector)];
      this.optionsDistrictsRef2 = [...this.districts.filter((district) => district.sector === this.item.family2_reference_sector)];
      this.$q.loading.hide();
    },
    filterDistricts(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionsDistricts = this.districts.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
        this.optionsDistricts = [...this.optionsDistricts.filter((district) => district.sector === this.item.sector)];

        this.optionsDistrictsWork = this.districts.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
        this.optionsDistrictsWork = [...this.optionsDistrictsWork.filter((district) => district.sector === this.item.address_work_sector)];

        this.optionsDistrictsGuarantor = this.districts.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
        this.optionsDistrictsGuarantor = [...this.optionsDistrictsGuarantor.filter((district) => district.sector === this.item.guarantor_sector)];

        this.optionsDistrictsRef1 = this.districts.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
        this.optionsDistrictsRef1 = [...this.optionsDistrictsRef1.filter((district) => district.sector === this.item.family_reference_sector)];

        this.optionsDistrictsRef2 = this.districts.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
        this.optionsDistrictsRef2 = [...this.optionsDistrictsRef2.filter((district) => district.sector === this.item.family2_reference_sector)];
      });
    },
    async getNews() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      this.loading = true;
      try {
        const url = 'https://micomercio.com.co/api-prestamos/public/index.php/api/list-news';
        const response = await axios.get(url);
        const items = [...response.data.data];
        this.items = items.filter((item) => item.listing_id === this.item.listing_id);
        this.$q.notify({
          type: 'positive',
          message: '¡Datos recibidos correctamente!',
        });
        console.log('Respuesta del servidor:', response.data);
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Hubo un problema al enviar los datos.',
        });
        console.error('Error al enviar los datos:', error);
      } finally {
        this.loading = false;
        this.$q.loading.hide();
      }
    },
    async saveNew() {
      this.$q.dialog({
        title: 'Guardar',
        message: 'Está seguro que desea guardar ?',
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
        this.loading = true;
        try {
          const url = 'https://micomercio.com.co/api-prestamos/public/index.php/api/create-new';
          await axios.post(url, this.item);
          this.$q.notify({
            type: 'positive',
            message: '¡Datos enviados correctamente!',
          });
          this.showDialog = false;
        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: 'Hubo un problema al enviar los datos.',
          });
          console.error('Error al enviar los datos:', error);
        } finally {
          this.loading = false;
          await this.getNews();
        }
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    },
  },
};
</script>
<style scoped>
.q-card {
  margin: 0 auto;
}
.q-card-section {
  margin-bottom: 16px;
}
</style>
