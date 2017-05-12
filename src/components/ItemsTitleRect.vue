<template>
    <div><slot></slot></div>
</template>
<style lang="stylus" scoped>
    div
        font-size 24px
        font-weight 300
        letter-spacing 1px
        line-height 26px
        background-color #4d4d4d
        color white
        width 120px
        // height 80px
        // padding-top 8px
        // padding-left 8px
        padding 10px

    @media (min-width: 1200px)
        div
            width 120px
            // height 115px
            // padding-top 10px
            // padding-left 10px
            padding 10px

</style>
