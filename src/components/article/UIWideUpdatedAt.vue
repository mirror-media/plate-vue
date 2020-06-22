<template>
  <div class="wide-updated-at">
    更新時間 / {{ updatedAt }}
  </div>
</template>

<script>
export default {
  name: 'UIWideUpdatedAt',
  props: {
    updatedAt: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.wide-updated-at {
  width: 300px;
  margin: 0 auto;
  padding: 12px 0 15px;
  color: rgba(0, 0, 0, 0.66);
  font-size: 13px;
  line-height: 2.31;
  letter-spacing: 1px;
  text-align: center;
  border-top: 1px solid #979797;
  @media (min-width: 768px) {
    width: 700px;
  }
  @media (min-width: 1024px) {
    width: 900px;
  }
}
</style>
