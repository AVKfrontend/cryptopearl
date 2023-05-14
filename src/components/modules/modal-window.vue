<template>
  <div
    class="shade"
    @click="$emit('close-modal')"
  >
    <div class="modal">
      <article class="modal__mesage">
        <slot name="warn-mesage"></slot>
      </article>
      <button
        type="button"
        class="modal__butt"
        @click.stop="$emit('consent-warn')"
      >
        OK
      </button>
    </div>
  </div>
</template>

<script>

export default {
  props: [],
  emits: {
    'consent-warn': null,
    'close-modal': null
  }
}

</script>

<style scoped>
.shade {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.9);
  z-index: 1;
}
.modal {
  position: absolute;
  left: 50%;
  top: 50%;
  padding: 1.6rem;
  width: 50%;
  min-width: 200px;
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
.modal__butt {
  display: block;
  margin: 0 auto;
  padding: 0.5rem 1.5rem;
  max-width: 90px;
  background: rgb(113, 128, 150);
  border-radius: 999px;
  color: #fff;
  transition: background, 0.3s;
}
.modal__butt:hover {
  background: rgb(74, 85, 104);
}
</style>
