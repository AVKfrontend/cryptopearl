<template>
  <section
    v-if="active !== ''"
    class="relative"
  >
    <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
      {{active}} - USD
    </h3>
    <div class="flex items-end border-gray-600 border-b border-l h-64">
      <div
        v-for="(tik, inx) in bars"
        :key="inx"
        :style="{ height: `${tik}%` }"
        ref="diagram"
        class="bg-purple-800 border w-10"
      ></div>
    </div>
    <button
      @click="$emit('active-del')"
      type="button"
      class="absolute top-0 right-0"
    >
      <DelSvg/>
    </button>
  </section>
</template>

<script>
import DelSvg from '../atoms/del_svg.vue'
import { nextTick } from 'vue'

let diagramElementWidth

export default {
  props: {
    tiks: {
      type: Array,
      default () { return [] },
      required: false
    },
    active: {
      type: String,
      default () { return '' },
      required: false
    }
  },
  emits: {
    'active-del': null
  },

  data () {
    return {
      diagramMaxElements: 0
    }
  },

  components: {
    DelSvg
  },

  computed: {
    bars () {
      const arr = this.tiks.slice(-Math.floor(this.diagramMaxElements))
      const maxEl = Math.max(...arr)
      const minEl = Math.min(...arr)
      return maxEl === minEl ? arr.map(el => 50) : arr.map(el => 5 + (el - minEl) * 90 / (maxEl - minEl))
    }
  },

  mounted () {
    window.addEventListener('resize', this.culculateDiagramMaxElements)
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.culculateDiagramMaxElements)
  },

  methods: {
    culculateDiagramMaxElements () {
      if (!this.tiks.length > 0) return
      const diagramWidth = this.$refs.diagram[0].parentElement.clientWidth
      this.diagramMaxElements = diagramWidth / (diagramElementWidth ?? this.getdiagramElementWidth())
    },
    getdiagramElementWidth () {
      diagramElementWidth = this.$refs.diagram[0].offsetWidth
      return diagramElementWidth
    }
  },

  watch: {
    tiks () {
      if (this.diagramMaxElements === 0) nextTick(() => { this.culculateDiagramMaxElements() })
    }
  }

}

</script>
