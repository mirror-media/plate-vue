<template>
  <div class="wide-layout">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'UIWideLayout'
}
</script>

<style lang="stylus">

.wide-layout {
  font-family: source-han-sans-traditional, -apple-system, 'Microsoft JhengHei', Helvetica, Arial, sans-serif;
  word-break: break-word;
  overflow-wrap: break-word;
  h1, h2, h3, p {
    margin: 0;
    color: rgba(0,0,0,.87);
  }

  p {
    font-size: 15px;
    line-height: 2;
    & + p {
      margin-top: 2em;
    }
  }
  figure {
    margin: 0;
  }
}

</style>
