<template>
  <div class="flex">
    <div class="max-w-xs">
      <label for="wallet" class="block text-sm font-medium text-gray-700"
        >Тикер</label
      >
      <div class="mt-1 relative rounded-md shadow-md">
        <input
          v-model="tiker"
          @input="errReset()"
          @keydown.enter="validateTiker(tiker)"
          ref="tikerInput"
          type="text"
          name="wallet"
          id="wallet"
          class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
          placeholder="Например DOGE"
        />
      </div>
      <template v-if="hint.length > 0">
        <div class="flex bg-white shadow-md m-1 p-1 rounded-md shadow-md flex-wrap">
          <span
            v-for="t_hint in hint"
            v-bind:key="t_hint"
            v-on:click="validateTiker(t_hint)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          >
            {{ t_hint }}
          </span>
        </div>
      </template>
      <div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
        <span  class="inline-flex items-center px-2 m-1 text-xs font-medium text-gray-800">
          Популярные:
        </span>
        <span
          v-for="aTiker of availableTikers"
          :key="aTiker"
          @:click="validateTiker(aTiker)"
          class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
          {{aTiker}}
        </span>
      </div>
      <p class="text-sm text-red-600">{{ errmes }}</p>
    </div>
  </div>
  <AddButton
    v-on:click="validateTiker(tiker)"
    class="my-4"
    />
</template>

<script>
import AddButton from '../features/add-button.vue'
import { getCoinList } from '@/coinlist'

let fullList = []

export default {
  props: {
    tikers: Array,
    availableTikers: Array
  },
  emits: ['tiker-add'],

  data () {
    return {
      tiker: '',
      errmes: ' '
    }
  },

  mounted () {
    (async () => {
      fullList = await getCoinList()
    })()
    setTimeout(this.focusOnInput, 1500)
  },

  components: {
    AddButton
  },

  computed: {
    hint () {
      const t = this.tiker === '' ? ' ' : this.tiker.toUpperCase()
      return fullList.filter(el => el.startsWith(t)).slice(0, 4)
    },
    suchTickerAlreadySelected () {
      return this.tikers.filter(el => el.tname === this.tiker).length !== 0
    },
    noDataAboutCoin () {
      return !fullList.find(el => el === this.tiker)
    },
    errorMesage () {
      if (this.suchTickerAlreadySelected) {
        return 'Такой тикер уже добавлен'
      }
      if (this.noDataAboutCoin) {
        return 'Нет данных про такую монету'
      }
      return ' '
    }
  },

  methods: {
    validateTiker (t) {
      this.errReset()
      t = t.toUpperCase()
      this.tiker = t
      this.errmes = this.errorMesage
      if (this.errmes !== ' ') return
      this.$emit('tiker-add', t)
      this.tiker = ''
    },
    focusOnInput () {
      this.$refs.tikerInput.focus()
    },
    errReset () {
      if (this.errmes !== ' ') this.errmes = ' '
    }
  },
  watch: {
    tikers (v) {
      if (v.length === 0) this.focusOnInput()
    }
  }
}
</script>
