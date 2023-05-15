<template>
  <p class="consent-mesage">{{ consentMesage }}</p>
  <div class="consent-wrupper flex">
    <div class="relative">
      <input
        v-model="ledParole"
        type="text"
        name="parole"
        id="parole"
        class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md shadow-md"
        placeholder="Например 123"
      />
    </div>
    <button
        type="button"
        class="modal__butt"
        :disabled="confirmedParole"
        @click="$emit('consent-warn')"
      >
        OK
      </button>
  </div>
</template>

<script>
export default {
  props: {
    parole: String
  },
  emits: {
    'consent-warn': null
  },
  data () {
    return {
      ledParole: ''
    }
  },
  computed: {
    confirmedParole () {
      return this.ledParole !== this.parole
    },
    consentMesage () {
      return `Введите пароль: "${this.parole}", для подтверждения`
    }
  }
}
</script>

<style scoped>
.consent-mesage {
  margin: 0.5rem;
  font-size: 0.8rem;
  text-align: center;
}
.consent-wrupper {
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}
.consent-wrupper input {
  margin: 0.5rem 0;
}
.modal__butt {
  display: block;
  padding: 0.5rem 1.5rem;
  max-width: 90px;
  background: rgb(113, 128, 150);
  border-radius: 999px;
  color: #fff;
  transition: background, ease, 0.3s;
}
.modal__butt:hover {
  background: rgb(74, 85, 104);
}
.modal__butt:disabled {
  background: rgb(230, 166, 166);
  cursor: not-allowed;
}
</style>
