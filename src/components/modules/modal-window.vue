<template>
  <div
    class="shade"
    @click.self="closeModal()"
  >
    <div class="modal">
      <article class="modal__mesage">
        <slot name="warn-mesage"></slot>
      </article>
      <slot name="consent-area" :parole="$options.parole" :action="confirmAction"></slot>
    </div>
  </div>
</template>

<script>

export default {
  modalDelTikerOptions: null,
  parole: '123',
  props: [],
  emits: [],
  methods: {
    hendlerUserAction () {
      const modalPromise = new Promise((resolve, reject) => {
        this.$options.modalDelTikerOptions = { resolve, reject }
      })
      return modalPromise
    },
    keyHendler (event) {
      if (event.key !== 'Escape') return
      this.closeModal()
    },
    closeModal () {
      this.$options.modalDelTikerOptions.resolve('cancel')
    },
    confirmAction () {
      this.$options.modalDelTikerOptions.resolve('confirm')
    }
  },
  mounted () {
    document.addEventListener('keydown', this.keyHendler)
  },
  beforeUnmount () {
    document.removeEventListener('keydown', this.keyHendler)
  }
}

</script>

<style scoped>
.shade {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.75);
  z-index: 1;
}
.modal {
  position: absolute;
  left: 50%;
  top: 50%;
  padding: 1.6rem;
  width: 50%;
  min-width: 200px;
  max-width: 500px;
  border: solid rgb(85, 60, 154) 4px;
  border-radius: 0.5rem;
  background: #fff;
  transform: translate(-50%, -50%);
  font-size: 1.1rem;
}
.modal__mesage {
  margin: 1rem;
  padding: 0.5rem;
  color:brown;
  text-align: center;
  font-size: 1.2rem;
}
</style>
