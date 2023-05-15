<template>
<div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
  <div class="container">
    <section>
      <AddTiker
        :tikers = "tikers"
        :availableTikers = "['BTC', 'ETH', 'DOGE', 'SOL']"
        @tiker-add="tikerAdd"
        />
    </section>
    <template v-if="tikers.length > 0">
      <hr class="w-full border-t border-gray-600 my-4" />
      <label for="filter" class="block text-sm font-medium text-gray-700"
      >Выбрать содержащие</label>
      <div class="mt-1 relative rounded-md shadow-md max-w-xs">
        <input
          v-model="filter"
          type="text"
          name="filter"
          id="filter"
          class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
          placeholder="Введите часть тикера"
        />
      </div>
      <button
        v-if="page > 1"
        v-on:click="page--"
        class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Предыдущая
      </button>
      <span
        v-if="pages > 1"
        class="my-4 inline-flex items-center py-2 px-4 text-sm leading-4 font-medium text-black"
      >
        Страница {{ page }} из {{ pages }}
      </span>
      <button
        v-if="page < pages"
        v-on:click="page++"
        class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Следующая
      </button>
      <div class="my-4 inline-flex items-center ml-3 max-w-xs">
        <label for="tikerperpage" class="mr-3 text-sm font-medium text-gray-700"
          >Выводить по</label>
        <input
          v-model="tikerPerPage"
          type="number"
          name="tikerperpage"
          id="tikerperpage"
          class="w-full border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm shadow-md rounded-md"
        />
      </div>
      <hr class="w-full border-t border-gray-600 my-4" />
      <p
        v-if="filtered.length === 0"
        class="text-sm text-red-600"
      >Нет тикеров отвечающих условию фильтрации</p>
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div
          v-for="card in pagedTikers"
          v-bind:key="card.tname"
          @click="activeSelect(card.tname)"
          :class="[active === card.tname ? 'border-4' : '']"
          class="overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
        >
          <div
          v-bind:class="[card.price === ' - ' ? 'bg-red-100' : 'bg-white']"
          class="px-4 py-5 sm:p-6 text-center"
          >
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ card.tname }} - USD
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ normalisePrice (card.price) }}
            </dd>
          </div>
          <div class="w-full border-t border-gray-200"></div>
          <button
            @:click.stop="checkingTikerDel(card)"
            class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
          >
            <BasketSvg />Удалить
          </button>
        </div>
      </dl>
      <hr class="w-full border-t border-gray-600 my-4" />
    </template>
    <DrawDiagram
      :active = "active"
      :tiks = "tiks"
      @active-del="activeUnSelect()"
    />
  </div>
  <ModalWindow
    v-if="!!modalWindowOpened"
    @close-modal="modalWindowClose()"
    @confirm-action="tikerDel(tikers.find(el => el.tname === active))"
  >
    <template #warn-mesage>
      {{ modalMesage }}
    </template>
    <template #consent-area="modalOptions">
      <ConsentArea
        :parole="modalOptions.parole"
        @consent-warn="modalOptions.action"
      />
    </template>
  </ModalWindow>
</div>
</template>

<script>
import { subscribeToPrice, unSubscribe } from './api.js'
import AddTiker from './components/modules/tiker-choice.vue'
import BasketSvg from './components/atoms/busket_svg.vue'
import DrawDiagram from './components/modules/draw-diagram.vue'
import ModalWindow from './components/modules/modal-window.vue'
import ConsentArea from './components/modules/consent-area.vue'

export default {
  name: 'App',

  data () {
    return {
      tikers: [],
      filter: '',
      page: 1,
      tikerPerPage: 3,
      active: '',
      modalWindowOpened: 0,
      tiks: []
    }
  },

  components: {
    BasketSvg,
    AddTiker,
    DrawDiagram,
    ConsentArea,
    ModalWindow
  },

  computed: {
    pages () {
      return this.filtered.length === 0 ? 1 : Math.ceil(this.filtered.length / this.tikerPerPage)
    },
    filtered () {
      return this.tikers.filter(el => el.tname.includes(this.filter.toUpperCase()))
    },
    pagedTikers () {
      const st = (this.page - 1) * this.tikerPerPage
      return this.filtered.slice(st, st + this.tikerPerPage)
    },
    tikersListParam () {
      return { filter: this.filter, page: this.page }
    },
    modalMesage () {
      return `Накопленая история по паре ${this.active} - USD будет потеряна`
    }
  },

  created () {
    const tikersList = sessionStorage.getItem('tikersList')
    if (tikersList) {
      this.tikers = JSON.parse(tikersList)
      this.tikers.forEach(el => subscribeToPrice(el.tname, this.handlerNewPrice))
    }
    for (const param of (new URL(document.URL)).searchParams.entries()) {
      if (param[0] === 'filter') this.filter = param[1]
      if (param[0] === 'page') this.page = param[1]
    }
  },

  mounted () {
  },

  methods: {
    normalisePrice (price) {
      return !Number.isFinite(price) ? price : price > 1 ? price.toFixed(2) : price.toPrecision(3)
    },
    handlerNewPrice (t, price) {
      const coin = this.tikers.find(el => el.tname === t)
      coin.price = price ?? ' - '
      if (t === this.active) {
        this.tiks.push(price)
      }
    },
    tikerAdd: function (t) {
      t = { tname: t, price: '-' }
      this.tikers = [t].concat(this.tikers)
      subscribeToPrice(t.tname, this.handlerNewPrice)
      this.page = 1
    },
    checkingTikerDel: function (t) {
      (t.tname === this.active) ? this.modalWindowOpen() : this.tikerDel(t)
    },
    tikerDel: function (t) {
      this.tikers = this.tikers.filter(el => el !== t)
      if (t.tname === this.active) this.activeUnSelect()
      unSubscribe(t.tname)
      if (this.modalWindowOpened) this.modalWindowClose()
    },
    modalWindowOpen () {
      this.modalWindowOpened = 1
    },
    modalWindowClose () {
      this.modalWindowOpened = 0
    },
    activeUnSelect () {
      this.active = ''
      this.tiks = []
    },
    activeSelect (tikerToSelect) {
      if (this.active === tikerToSelect) return
      this.active = tikerToSelect
    }
  },

  watch: {
    pages () {
      if (this.page > this.pages) this.page = this.pages
    },
    tikersListParam (obj) {
      history.replaceState(null, 'params', (new URL(document.URL)).pathname + `?filter=${obj.filter}&page=${obj.page}`)
    },
    tikers () {
      sessionStorage.setItem('tikersList', JSON.stringify(this.tikers))
    }
  },

  beforeUnmount () {
  }
}
</script>

<style>
@import "./app.css";
</style>
