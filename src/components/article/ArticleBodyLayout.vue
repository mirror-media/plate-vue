<template>
  <div><slot></slot></div>
</template>
<script>
  export default {
    name: 'ArticleBodyLayout',
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus">
  .ad-container
    > div
      width 100%
      
  .article_body
    position relative
    width 100%

    .article_basic-info 
      display flex
      margin-top 20px
      justify-content space-between
      align-items flex-end

      .category 
        font-size 21px
        display flex
        justify-content flex-start
        align-items center

        .categorySquare 
          display inline-flex
          height 24px
          padding-left 10px
          justify-content center
          align-items center
        
      .date 
        font-style italic
        font-size 17px
        color #a1a1a1
        font-weight normal
      
    .hero-image
      margin-top 20px
    
    .article_title 
      width 100%
      margin 15px 0

      h1 
        font-size 40px
        font-weight 400
        margin 0
        text-align justify

    .article_subtitle  
      // width 695px
      display inline-block
      // max-width 695px
      margin 0 0 15px

      h2
        font-size 1.5rem
        font-weight 400
        margin 0

    .article_credit 
      // width 695px
      display inline-block
      // max-width 695px

      a.blue:hover, a.blue:link, a.blue:visited 
        color #74afd2
    
    .article_main 
      // width 695px
      display inline-block
      // max-width 695px
      overflow visible

      > h1, > h2
        color #000
        text-align justify
        line-height 1.5
      > h1
        margin 15px 0 0
        font-size 2rem
        & + div
          margin-top 25px
      > h2
        margin 5px 0 25px 0
        font-size 1.5rem

      .content--annotation
        position relative
        z-index 10

      .article__basic-info
        .article__basic-info-wrapper
          .article__share
            display flex
            align-items center
            margin-top .5em
            .share-light
              justify-content flex-end
              align-items flex-start
              margin 0 0 0 auto
      .article_main_pop 
        clear both
        margin-top 20px
      
      .article_main_tags 
        clear both
        margin-top 1.5em
        padding 0
        > p
          margin 1em 0 .5em
          color #a0a0a0

        .tags 
          display inline-block
          color rgba(2, 2, 2, 0.5)
          font-size 18px
          position relative

          a, a:hover, a:link, a:visited 
            display inline-block
            margin 0 .5em .6em 0
            padding .2em .4em
            color #fff
            text-decoration none
            background-color #c8c8c8
            border-bottom none
            cursor pointer
        
      .brief 
        margin-top 30px
        line-height 36px
        font-size 18px
        color rgba(65, 65, 65, 0.61)

        p 
          margin 0
          padding 1em 2em
          text-align justify
          color #fff
          font-weight bold
          font-size 1.2rem
          a
            color #fff
            border-bottom-color #fff
          strong 
            font-weight bold

          em
            font-weight bold
          
          i, cite, var, address, dfn 
            font-style normal        
      
      > .content 
        h2 
          color #000
          margin-top 40px
        
        p 
          color #171717
          font-size 18px
          line-height 36px
          margin 1.5em 0
          text-align justify
        
        .youtube 
          clear both
          .youtube-container 
            align-items center
            display flex
            justify-content center
            margin 25px 0 5px
            padding-bottom 56.25%
            padding-top 25px
            position relative

            iframe 
              width 100%
              height 100%
              position absolute
              top 0
              left 0

          > .caption 
            font-family "Noto Sans TC", STHeitiTC-Medium, "Microsoft JhengHei", sans-serif
            font-size 15px
            line-height 1.7
            letter-spacing 0.3px
            color rgba(0, 0, 0, 0.498039)
            padding-top 10px
            padding-bottom 10px
                    
        .embedded 
          text-align center
          margin 1.5em auto
          clear both

          > div:not(.caption)
            margin 0 auto
          > .caption 
            font-family "Noto Sans TC", STHeitiTC-Medium, "Microsoft JhengHei", sans-serif
            font-size 15px
            line-height 1.7
            letter-spacing 0.3px
            color rgba(0, 0, 0, 0.498039)
            padding-top 10px
            padding-bottom 10px

          > iframe
            max-width 100%
            margin 0 auto

        .audioBox
          width 100%

        .video
          text-align center
          margin 1.5em auto
          clear both
          position relative
        
      a, a:hover, a:link, a:visited 
        color #3195b3
        text-decoration none
        cursor pointer
        border-bottom 1px solid #3195b3
        padding-bottom 5px
      
      code 
        line-height 2rem
      
      blockquote.blockquote 
        clear both
        padding 10px 35px
        margin 70px 0

        .content 
          border-top 3px solid #255577
          padding-top 20px
          padding-left 30px
          border-left 3px solid #255577
          font-size 24px
          color #3a759e

          .triangle::before
            content ''
            width 0
            height 0
            border-style solid
            border-width 50px 0 0 70px
            position relative
            top -70px
            left 30px
            display block
            border-color transparent transparent transparent #255577
          
          .triangle::after
            content ''
            width 0
            height 0
            border-style solid
            border-width 50px 0 0 70px
            position relative
            top -114px
            left 33px
            display block
            border-color transparent transparent transparent #ffffff
          
          .quote-body 
            margin-top -95px
            line-height 44px
          
          .quote-by 
            text-align right
            font-size 18px
            margin-top 18px

            &::before 
              content ''
              display inline-block
              height 100%
              vertical-align super
              width 36px
              margin-right 5px
              border-top 1px solid #3a759e
                  
      blockquote.quote 
        clear both
        display flex
        margin 3em 0

        i 
          background-image url(/assets/mirrormedia/icon/quote.png)
          width 45px
          height 45px
          background-repeat no-repeat
          background-size contain
          display block
          margin-right 20px
          max-width 45px
          flex 3
        
        .quote-content 
          line-height 2.2rem
          font-size 1.2rem
          color #3a759e
          flex 10
          text-align justify
        
      
      .info-box-container 
        width 100%
        margin-bottom 3em

        .info-box-icon 
          &::before 
            content ''
            width 0
            height 0
            border-style solid
            border-width 12px 18px
            position relative
            left 0
            top 30px
            display block
            border-color #255577
          
          &::after 
            content ''
            width 0
            height 0
            border-style solid
            border-width 10px 0px 0px 18px
            position relative
            left 0
            top 30px
            display block
            border-color #7b7b7b transparent transparent transparent
          
        
        .info-box 
          border 1px solid #eaeaea
          padding 30px 50px
          box-shadow 0 0 14px rgba(146, 146, 146, 0.52)
          width 90%
          margin-top -35px
          margin-left 18px

          .info-box-title 
            color #3a6888
            font-size 25px
            margin-bottom 15px
          
          .info-box-body
            ol
              list-style decimal
            ul
              list-style disc
            p, li 
              color rgba(0, 0, 0, 0.64)
              font-size 16px
        
        &.right 
          float right
          width 300px
        
        &.left 
          float left
          width 300px
        
        &.center 
          clear both
          margin 3em 0

          .info-box 
            width 95%
      
      h3 
        font-size 26px
      
      ul 
        font-family "Noto Sans TC", STHeitiTC-Medium, "Microsoft JhengHei", sans-serif
        font-size 1rem
        line-height 2.2
        letter-spacing 0.3px
        color rgba(0, 0, 0, 0.701961)
        padding-left 45px
        // text-indent -26px
        margin-left 16px
        list-style none

        &.unordered-list-item
          li 
            &::before 
              content "• "
              color #2d5b7b
              font-size 30px
              line-height 1
              top 6px
              position relative

      ol
        font-family "Noto Sans TC", STHeitiTC-Medium, "Microsoft JhengHei", sans-serif
        font-size 1rem
        line-height 2.2
        letter-spacing 0.3px
        color rgba(0, 0, 0, 0.701961)
        counter-reset item 0
        list-style none

        &.ordered-list-item
          li
            &::before
              content counter(item) ". "
              counter-increment item
              color #004ea2
              padding-left 10px
              padding-right 10px
              line-height 1

      .split-line
        clear both

      .dfpad-set
        clear both
        &.mobile
          margin 0 auto
        &:not(.mobile)
          display flex
          justify-content space-around
    &.single-col 
      margin-top 50px

      .article_basic-info
        width 660px
        margin 0 auto

      .article_title
        margin 15px auto
        width 660px

      .article_credit 
        display block
        width 660px
        margin 0 auto
      
      .article_main 
        width 950px
        margin 0 auto
        max-width 950px
        display block

        p, h2, .split-line, .embedded, .article_main_pop, .article_main_proj, .article_main_related_bottom, .article_fb_comment, ul, .youtube, .dfpad-set
          padding 0 145px
          text-align justify

        .article_main_pop
          margin-top 40px
        
        blockquote
          padding 0 145px
          &.quote
            > .quote-content
              text-align justify

        .innerImg 
          padding 0 145px 1.5em
          
          &.left 
            margin-right 50px
            padding 0
          
          &.right 
            margin-left 50px
            padding 0
                  
        .article_main_tags 
          padding 0 145px
        
        .info-box-container 
          &.center 
            padding 0 145px
          
          .info-box 
            p, ul 
              padding 0
                
    .per-slide 
      // height 500px
      width 100%
      margin 1.5em 0

      .swiper-wrapper 
        // height 450px
        display flex
        align-items center

        .swiper-slide 
          display flex
          align-items center
          justify-content center

          > div
            width 100%

          .slideshowImg 
            img 
              width 100%
              object-fit contain
              object-position center center
              max-height 450px

            .img-caption
              width 100%
              margin 0 auto
              padding 8px 0
              color rgba(0,0,0,0.498)
              font-size 1rem
              text-align left
              line-height 1.4rem

      .swiper-pagination
        .swiper-pagination-bullet.swiper-pagination-bullet-active
          background-color rgba(179, 179, 179, 0.61)
  .fbPagePlugin
    display none
    margin-top 15px
    .fb-page, .fb-page span, .fb-page span iframe[style]
      width 100% !important
  
  .kianGi
    margin-top 1em
  
  .herbsapi
    display flex
    align-items center
    padding 15px 0
    margin 15px 0
    border-top 1px solid rgba(2,2,2,0.5)
    border-bottom 1px solid rgba(2,2,2,0.5)
    br
      display none
    
  #herbsapi
    height 40px
    margin-right 20px
    > a
      display inline-block
      padding 0
      font-size 0
      border none
  
  .article__basic-info
    display flex
    flex-direction column
    justify-content space-between
    // width 695px
    .article__basic-info-wrapper
      // display flex
      // justify-content space-between
      .blue
        border-bottom none !important

  .article__credit
    a.blue:hover, a.blue:link, a.blue:visited 
      color #74afd2
  .article__date
    font-style italic
    font-size 17px
    color #a1a1a1
    font-weight normal

  @media (min-width 0px) and (max-width 499px)
    .article_body
      > div:not([class="main"]):not([class="pic-container"])
        padding-right 25px
        padding-left 25px
      > .article_main
        > div:not([class="dfpad-set"]), article
          padding-left 25px
          padding-right 25px
          &.article_main_tags
            padding 0 25px
           
      .article_basic-info
        .category
          font-size 1.3rem
          
          .categorySquare
            height 1.3rem
        
        .date
          font-size 1rem
      
      .article_title
        h2
          font-size 1.7rem

      .article_main
        > h1, h2
          padding 0 25px
        .article_main_tags
          .tags
            line-height 1.6rem
            font-size 1rem
        
        .info-box-container        
          &, &.center, &.right, &.left
            float none
            margin 3em 0
            width 100%

            .info-box
              width 90%
              padding 30px 24px
          
              .info-box-body
                ul
                  text-indent 0
                  line-height 2rem
                  letter-spacing 0.05rem
                  padding-left 0
                  margin-left 1rem

                  li
                    overflow-wrap break-word

                    &::before
                      font-size 3rem
                      top 1rem
                      left 10px
              
              .info-box-title
                font-size 1.4rem
          
        ul
          text-indent -40px
          padding-left 15px
          margin-left 10px

          li
            &::before
              font-size 3rem
              top 15px
              left 10px
  @media (min-width 321px) and (max-width 499px)
    .article_body
      > div:not([class="main"])
        padding-right 0
        padding-left 0
      > .article_main
        > div:not([class="dfpad-set"]), article
          padding-left 0
          padding-right 0
          &.article_main_tags
            padding 0
      .article_main
        > h1, h2
          padding 0

  @media (min-width 0px) and (max-width 767px)
    .article_body
      .article_main, .article_credit, .article_subtitle
        width 100%
        max-width 100%

        & > .content
          .innerImg
            &.right, &.left
              float none
              width 100%
              margin 1.5rem 0
              border-bottom none
              padding-bottom 0
        
        blockquote.blockquote
          padding 0
        blockquote.quote
          > .quoteIcon
            height 40px
            width 40px
            max-width 30px
            margin-top 8px
            
          > .quote-content
            line-height 2.1rem
            font-size 1.2rem
            text-align justify

      > .article_title
        h1
          font-size 2.2rem




    .article_fb_comment
      margin-bottom 60px!important

  @media (max-width 899px) and (min-width 768px)
    .article_body
      // .article_basic-info, .article_credit, .article_main, .article_subtitle
      //   width 645px
      //   max-width 645px
      //   margin 0 auto
      
      .article_title
        // width 645px
        // max-width 645px
        margin 15px auto

      .article_subtitle
        // width 645px
        // max-width 645px
        margin 0 auto 15px
      .article_main
        > *
          width 645px
          margin-left auto !important
          margin-right auto !important
      
  @media (min-width 900px) and (max-width 1199px)
    .article_body
      // .article_basic-info
      //   width 695px
      //   max-width 695px
      //   margin 0 auto

      .article_credit, .article_main
        // width 695px
        // max-width 695px
        margin 0 auto
      .article_title
        // width 695px
        // max-width 695px
        margin 15px auto

      .article_subtitle
        // width 695px
        // max-width 695px
        margin 0 auto 15px
      .article_main
        > *
          width 695px
          margin-left auto !important
          margin-right auto !important

  @media (max-width 1199px)
    .article_body
      .article_main, .article_credit, .article_subtitle
        display block
      .article_basic-info
        margin-top 0
      
    .fbPagePlugin
      display block
    .herbsapi
      br
        display inline

  @media (min-width 768px)
    .article_body
      .per-slide 
        .swiper-wrapper 
          .swiper-slide 
            .slideshowImg 
              .img-caption
                width 70%
                padding 8px
                text-align center
                
  @media (min-width 1200px)
    .article_body
      .article_main
        width 695px
</style>