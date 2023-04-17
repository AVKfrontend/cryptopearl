<template>
<div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
  <!-- <div class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center">
    <svg class="animate-spin -ml-1 mr-3 h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div> -->
  <div class="container">
    <section>
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
            <span v-on:click="validateTiker('BTC')" class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              BTC
            </span>
            <span v-on:click="validateTiker('ETH')" class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              ETH
            </span>
            <span v-on:click="validateTiker('DOGE')" class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              DOGE
            </span>
            <span v-on:click="validateTiker('SOL')" class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              SOL
            </span>
          </div>
          <p class="text-sm text-red-600">{{ errmes }}</p>
        </div>
      </div>
      <button
        v-on:click="validateTiker(tiker)"
        type="button"
        class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <!-- Heroicon name: solid/mail -->
        <svg
          class="-ml-0.5 mr-2 h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="#ffffff"
        >
          <path
            d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          ></path>
        </svg>
        Добавить
      </button>
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
          class="pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm shadow-md rounded-md"
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
          @click="(active = card.tname, tiks = [])"
          :class="[active === card.tname ? 'border-4' : '']"
          class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
        >
          <div class="px-4 py-5 sm:p-6 text-center">
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ card.tname }} - USD
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ normalisePrice (card.price) }}
            </dd>
          </div>
          <div class="w-full border-t border-gray-200"></div>
          <button
            @:click.stop="tikerDel(card)"
            class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
          >
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#718096"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              ></path></svg>Удалить
          </button>
        </div>
      </dl>
      <hr class="w-full border-t border-gray-600 my-4" />
    </template>
    <template v-if="active !== ''">
      <section class="relative">
      <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
        {{active}} - USD
      </h3>
      <div class="flex items-end border-gray-600 border-b border-l h-64">
        <div
          v-for="(tik, inx) in bars"
          :key="inx"
          :style="{ height: `${tik}%` }"
          class="bg-purple-800 border w-10"
        ></div>
      </div>
      <button
        @click="active = ''"
        type="button"
        class="absolute top-0 right-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xmlns:svgjs="http://svgjs.com/svgjs"
          version="1.1"
          width="30"
          height="30"
          x="0"
          y="0"
          viewBox="0 0 511.76 511.76"
          style="enable-background:new 0 0 512 512"
          xml:space="preserve"
        >
          <g>
            <path
              d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
              fill="#718096"
              data-original="#000000"
            ></path>
          </g>
        </svg>
      </button>
      </section>
    </template>
  </div>
</div>
</template>

<script>
import { getCoinList } from './coinlist.js'
import { subscribeToPrice, unSubscribe } from './api'

let fullList = []

export default {
  name: 'App',
  data () {
    return {
      tiker: '',
      tikers: [],
      errmes: ' ',
      active: '',
      tiks: [],
      filter: '',
      page: 1,
      tikerPerPage: 3
    }
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
    hint () {
      const t = this.tiker === '' ? ' ' : this.tiker.toUpperCase()
      return fullList.filter(el => el.startsWith(t)).slice(0, 4)
    },
    bars () {
      const arr = this.tiks
      const maxEl = Math.max(...arr)
      const minEl = Math.min(...arr)
      return maxEl === minEl ? arr.map(el => 50) : arr.map(el => 5 + (el - minEl) * 90 / (maxEl - minEl))
    },
    tikersListParam () {
      return { filter: this.filter, page: this.page }
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
    (async () => {
      fullList = await getCoinList()
    })()
  },

  methods: {
    errReset: function () {
      if (this.errmes !== ' ') this.errmes = ' '
    },
    normalisePrice (price) {
      return price === '-' ? '-' : price > 1 ? price.toFixed(2) : price.toPrecision(3)
    },
    validateTiker (t) {
      this.errReset()
      t = t.toUpperCase()
      if (this.tikers.filter(el => el.tname === t).length === 0) {
        if ((fullList.filter(el => el === t).length !== 0)) {
          this.tikerAdd(t)
        } else {
          this.errmes = 'Нет данных про такую монету'
        }
      } else {
        this.tiker = t
        this.errmes = 'Такой тикер уже добавлен'
      }
    },
    handlerNewPrice (t, price) {
      const coin = this.tikers.find(el => el.tname === t)
      coin.price = price
      if (t === this.active) {
        this.tiks.push(price)
        if (this.tiks.lenght > 100) this.tiks.shift()
      }
    },
    tikerAdd: function (t) {
      t = { tname: t, price: '-' }
      this.tikers = [t].concat(this.tikers)
      subscribeToPrice(t.tname, this.handlerNewPrice)
      this.tiker = ''
      this.page = 1
    },
    tikerDel: function (t) {
      this.tikers = this.tikers.filter(el => el !== t)
      if (t.tname === this.active) this.active = ''
      unSubscribe(t.tname)
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

  components: {

  },

  beforeUnmount () {
  }
}
</script>

<style>
@import "./app.css";
</style>
