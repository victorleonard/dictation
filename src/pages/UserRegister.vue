<template>
  <q-page class="flex flex-center">
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
      autocomplete="off"
    >
      <h3>Inscription</h3>
      <q-input
        filled
        v-model="username"
        label="Votre pseudo *"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Veillez saisir un pseudo',
        ]"
      />

      <q-input
        filled
        type="password"
        v-model="password"
        label="Mot de passe"
        lazy-rules
        :rules="[
          (val) =>
            (val !== null && val !== '') || 'Le mot de passe est obligatoire',
        ]"
      />

      <div>
        <q-btn label="S'inscrire" type="submit" color="primary" />
        <q-btn
          flat
          color="primary"
          to="/public/login"
          class="q-ml-sm"
          label="Connexion"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
const $q = useQuasar();

const username = ref("");
const password = ref("");

function onSubmit() {
  api
    .post("api/users", {
      username: username.value,
      plainPassword: password.value,
    })
    .then((res) => {
      $q.notify({
        type: "positive",
        message: "Vous êtes bien inscrit",
      });
    })
    .catch((e) => {
      $q.notify({
        type: "negative",
        message: "Echec de l'inscription",
        icon: "report_problem",
      });
    });
}
</script>
