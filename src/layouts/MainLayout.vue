<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
          <q-toolbar-title>
            {{$router.currentRoute.name}}
          </q-toolbar-title>
          <!-- <q-btn
            outline
            dense
            size="xs"
            label="Migracion"
            @click="$router.push('/upload-news')"
          /> -->
          <q-btn
            icon="add_location_alt"
            class="q-ml-md"
            color="primary"
            title="Click para registrar una dirección"
            @click="showModalAddNew = true">
          </q-btn>
          <q-btn-dropdown
            color="primary"
            class="no-shadow"
            push
            no-caps
            label="Perfil"
          >
            <div class="row no-wrap q-pa-md">
              <div class="column items-center">
                <q-avatar size="200px">
                  <upload-image-profile
                    :config="{
                      name: 'FOTO_PROFILE',
                      storage: 'users',
                      modelName: 'users',
                      modelId: user
                    }"
                  />
                </q-avatar>
                <div
                  class="text-subtitle1 q-mt-xs text-weight-bolder"
                >
                  {{ name }}
                </div>
                <div
                  v-for="role in roles"
                  :key="role"
                >
                  {{ role }}
                </div>
                <q-btn
                  color="primary"
                  label="Cambiar contraseña"
                  push
                  size="sm"
                  v-close-popup
                  @click="showChangePasswordForm()"
                />
                <q-btn
                  color="primary"
                  label="Cerrar sesión"
                  push
                  size="sm"
                  class="q-mt-sm"
                  @click="logout()"
                  v-close-popup
                />
              </div>
            </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          <img src="~/assets/logo-rectangle.png" width="250" class="q-mr-auto q-ml-auto">
        </q-item-label>
        <EssentialLink
          key="my-expenses-key"
          title="Mis movimientos"
          link="/my-expenses"
          icon="money_off"
          :class="'/my-expenses' === $router.currentRoute.name && 'bg-blue-grey-3'"
          :clickable="'/my-expenses' !== $router.currentRoute.path"
          :active="'/my-expenses' === $router.currentRoute.path"
        />
        <q-expansion-item
          v-for="({ name, icon, label, options }) in linksData"
          expand-separator
          :key="name"
          :icon="icon"
          :label="label"
        >
          <EssentialLink
            v-for="({ name, route }) in options"
            :key="name"
            :title="name"
            :link="route"
            :class="route === $router.currentRoute.name && 'bg-blue-grey-3'"
            :classes="'q-ml-lg'"
            :clickable="route !== $router.currentRoute.path"
            :active="route === $router.currentRoute.path"
          />
        </q-expansion-item>
      </q-list>
      <q-item-label header class="text-grey-8 text-center q-mt-md">
        {{ versionApp }}
      </q-item-label>
      <q-item-label header class="text-grey-8 text-center q-mt-md">
        {{ tokenPush }}
      </q-item-label>
      <map-current-position />
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
    <form-change-password
      ref="formChangePasswordReference"
      :titleRef="title"
    />
    <form-news
      v-if="showModalAddNew"
      v-model="showModalAddNew"
      type="C"
      :obj="objNew"
      :userSend="user"
      :showUserSend="false"
    />
    <info-user />
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import EssentialLink from 'components/common/EssentialLink.vue';
import FormChangePassword from 'components/user/FormChangePassword.vue';
import MapCurrentPosition from 'components/common/MapCurrentPosition.vue';
import UploadImageProfile from 'components/common/UploadImageProfile.vue';
import InfoUser from 'components/common/InfoUser.vue';
import FormNews from 'components/new/FormNews.vue';
import commonTypes from '../store/modules/common/types';
import { showNotifications } from '../helpers/showNotifications';
import { showLoading } from '../helpers/showLoading';

export default {
  name: 'MainLayout',
  components: {
    EssentialLink,
    FormChangePassword,
    MapCurrentPosition,
    UploadImageProfile,
    FormNews,
    InfoUser,
  },
  data() {
    return {
      leftDrawerOpen: false,
      title: 'Inicio',
      showModalChangePassword: false,
      linksData: [],
      statusSendingData: false,
      showModalWarnigs: false,
      showModalAddNew: false,
      objNew: {},
    };
  },
  async mounted() {
    await this.fillLinkData();
    this.leftDrawerOpen = false;
  },
  computed: {
    ...mapState(commonTypes.PATH, [
      'statusSign',
      'responseMessages',
      'menu',
      'currentRoute',
      'name',
      'user',
      'roles',
      'rolesArray',
    ]),
    showWarningCreatedSection() {
      if (
        this.synchronizationWarningResponseMessages
        && this.synchronizationWarningResponseMessages.tc
        && this.synchronizationWarningResponseMessages.tc.length > 0
      ) {
        return true;
      }
      return false;
    },
    showWarningUpdatedSection() {
      if (
        this.synchronizationWarningResponseMessages
        && this.synchronizationWarningResponseMessages.tu
        && this.synchronizationWarningResponseMessages.tu.length > 0
      ) {
        return true;
      }
      return false;
    },
    showWarningUpdatedSettledSection() {
      if (
        this.synchronizationWarningResponseMessages
        && this.synchronizationWarningResponseMessages.tus
        && this.synchronizationWarningResponseMessages.tus.length > 0
      ) {
        return true;
      }
      return false;
    },
    showWarningDeletedSettledSection() {
      if (
        this.synchronizationWarningResponseMessages
        && this.synchronizationWarningResponseMessages.tds
        && this.synchronizationWarningResponseMessages.tds.length > 0
      ) {
        return true;
      }
      return false;
    },
    versionApp() {
      return `Version ${process.env.LATEST_VERSION_APP}`;
    },
    tokenPush() {
      return `Mi token push: ${localStorage.getItem('tokenPush')}`;
    },
  },
  methods: {
    ...mapActions(commonTypes.PATH, {
      signout: commonTypes.actions.SIGN_OUT,
    }),
    async getLocation() {
      let error = '';
      try {
        if (!navigator.geolocation) {
          error = 'Geolocation is not supported by this browser.';
          return;
        }

        // Configuración de opciones para mejor precisión
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        };

        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });

        this.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        console.log('Ubicación obtenida con precisión de:', position.coords.accuracy, 'metros');
      } catch (err) {
        this.$q.loading.hide();
        // Manejo detallado de errores
        switch (err.code) {
          case err.PERMISSION_DENIED:
            error = 'Permiso de geolocalización denegado.';
            break;
          case err.POSITION_UNAVAILABLE:
            error = 'Ubicación no disponible.';
            break;
          case err.TIMEOUT:
            error = 'Tiempo de espera agotado.';
            break;
          default:
            error = 'Error desconocido al obtener ubicación.';
            break;
        }
        this.$q.notify({
          type: 'negative',
          message: error,
        });
        console.error('Error al obtener ubicación:', err);
      }
    },
    clickChangePassword() {
      this.showModalChangePassword = true;
    },
    async logout() {
      showLoading('Cerrando sesión ...', 'Por favor, espere', true);
      await this.signout();
      if (this.statusSign === true) {
        this.$q.loading.hide();
        this.$router.push('/');
      } else {
        this.$q.loading.hide();
        this.showNotification(this.responseMessages, this.statusSign, 'top-right', 5000);
      }
    },
    async fillLinkData() {
      if (this.menu) {
        this.menu.forEach((item) => {
          this.linksData.push(
            {
              label: item.label,
              options: item.options.filter((i) => i.menu === 1),
              icon: item.icon,
              link: item.route,
              open: true,
            },
          );
        });
      }
    },
    showChangePasswordForm() {
      showLoading('Preparando formulario ...', 'Por favor, espere', true);
      this.$refs.formChangePasswordReference.showModal();
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    showWarnings() {
      if (
        this.showWarningCreatedSection === true
        || this.showWarningUpdatedSection === true
        || this.showWarningUpdatedSettledSection === true
        || this.showWarningDeletedSettledSection === true
      ) {
        this.showModalWarnigs = true;
      }
    },
  },
};
</script>
