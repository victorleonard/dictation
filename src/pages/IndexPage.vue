<template>
  <q-linear-progress size="20px" :value="progress" color="light-blue-9">
    <div class="absolute-full flex flex-center">
      <q-badge color="white" text-color="accent" :label="progress" />
    </div>
  </q-linear-progress>
  <q-page class="flex flex-center">
    <div>
      <div class="row">
        <transition
          appear
          :enter-active-class="`animated ${
            result === 'ok' ? 'bounce' : 'shake'
          }`"
        >
          <q-icon
            v-if="result"
            :name="
              result === 'ok' ? 'emoji_emotions' : 'sentiment_very_dissatisfied'
            "
            :class="result === 'ok' ? 'text-green' : 'text-red'"
            size="10em"
            style="margin: 0 auto"
          />
        </transition>
      </div>
      <div class="row">
        <transition appear enter-active-class="animated fadeIn">
          <h3 v-if="seeWord" class="q-ml-auto q-mr-auto">{{ word.value }}</h3>
        </transition>
      </div>
      <div class="row q-mb-xl">
        <q-btn
          v-if="!result"
          style="margin: 0 auto"
          size="1.5em"
          class="q-mr-sm"
          color="primary"
          label="Écouter"
          icon="volume_up"
          unelevated
          @click="say"
        />
      </div>
      <div class="row q-mb-md" v-if="word">
        <q-form @submit="check">
          <div style="margin: 0 auto; display: flex">
            <q-input
              standout
              v-model="userInput"
              :disable="result ? 'disable' : null"
              filled
              style="font-size: 2em"
            />
            <q-btn
              unelevated
              square
              color="primary"
              type="submit"
              icon="send"
              :disable="result.length || !userInput.length ? 'disable' : null"
            />
          </div>
        </q-form>
      </div>
      <div class="row q-mt-xl">
        <q-btn
          v-if="result"
          style="margin: 0 auto"
          color="primary"
          outline
          label="Nouveau mot"
          icon="games"
          unelevated
          @click="getRandomWord()"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { api } from "boot/axios";
import EasySpeech from "easy-speech";
import { useUserStore } from "stores/user";

const store = useUserStore();

EasySpeech.detect();

let word = ref("");

let seeWord = ref(false);
let userInput = ref("");
let result = ref("");

let progress = computed(() => {
  return ((store.learnedWord.length / store.nbWords) * 100).toFixed(2) + "%";
});

EasySpeech.init({ maxTimeout: 5000, interval: 250 })
  .then(() => console.debug("load complete"))
  .catch((e) => console.error(e));

defineOptions({
  name: "IndexPage",
});

function save() {
  api.put(`/api/users/me/word/${word.value.id}`, {}).then(() => {
    store.getMyLearnedWords();
  });
}

async function say() {
  await EasySpeech.init();
  await EasySpeech.speak({
    text: word.value.value,
    voice: EasySpeech.voices()[82], // optional, will use a default or fallback
    pitch: 1,
    rate: 0.8,
    volume: 1,
    // there are more events, see the API for supported events
    boundary: (e) => console.debug("boundary reached"),
  });
}

function check() {
  console.log(userInput.value, word.value.value);
  if (
    userInput.value.trim().toLowerCase() ===
    word.value.value.trim().toLowerCase()
  ) {
    console.log("bravo");
    save();
    seeWord.value = true;
    result.value = "ok";
  } else {
    seeWord.value = true;
    result.value = "ko";
    console.log("ko");
  }
}

function getRandomWord() {
  api.get("api/words/random").then((res) => {
    word.value = res.data;
    result.value = "";
    userInput.value = "";
    seeWord.value = false;
  });
}
onMounted(() => {
  getRandomWord();
});
</script>

<style>
.word {
  font-family: "Kalam", cursive;
  font-weight: 400;
  font-style: normal;
}
</style>
