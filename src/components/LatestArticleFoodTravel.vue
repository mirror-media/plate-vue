<template>
    <section class="latestArticle-foodtravel">
        <div class="topicsArticle-foodtravel-container mobile-only">
            <vue-dfp :is="props.vueDfp" pos="LMBL1" extClass="desktop-hide" :dfpUnits="props.dfpUnits" :section="props.section" :dfpId="props.dfpId" />
            <div class="topicsArticle-full-posts">
                <template v-for="(article, index) in topics">
                    <div class="topicsArticle-full-post">
                        <a :href="'/topic/' + article.id" :id="'topics-' + article.id" class="topicsArticle-full-post__img">
                            <figure :style="{ backgroundImage: 'url(' + getImage(article, 'mobile') + ')' }"></figure>
                        </a>
                        <div class="topicsArticle-full-post__content">
                            <a :href="'/topic/' + article.id" :id="'topics-' + article.id">
                                <h2 v-text="article.name"></h2>
                            </a>
                            <a :href="'/topic/' + article.id" :id="'topics-' + article.id">
                                <p v-html="getTruncatedVal(article.ogDescription, 45)"></p>
                            </a>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <div class="latestArticle-foodtravel-container">
            <items-title-rect class="header-rect">最新<br>文章</items-title-rect>
            <div class="latestArticle-full-posts">
                <template v-for="(article, index) in latestArticle">
                    <div :class="'latestArticle-full-post-' + (index % 2)">
                        <a :href="getHref(article)" :id="'latest-' + article.id" class="latestArticle-full-post__img">
                            <figure :style="{ backgroundImage: 'url(' + getImage(article, 'mobile') + ')' }"></figure>
                        </a>
                        <div class="latestArticle-full-post__content">
                            <a :href="getHref(article)" :id="'latest-' + article.id">
                                <h2 v-text="article.title"></h2>
                            </a>
                            <a :href="getHref(article)" :id="'latest-' + article.id">
                                <p v-html="getBrief(article, 70)"></p>
                            </a>
                            <div class="latestArticle-full-post__meta">
                                <span class="latestArticle-full-post__meta--author" v-show="getAuthor(article, 'writers', '／')" v-html="getAuthor(article, 'writers', '／')"></span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <div class="topicsArticle-foodtravel-container desktop-only">
            <vue-dfp :is="props.vueDfp" pos="LPCR1" extClass="mobile-hide" :dfpUnits="props.dfpUnits" :section="props.section" 
            :dfpId="props.dfpId" />
            <div class="topicsArticle-full-posts">
                <template v-for="(article, index) in topics">
                    <div class="topicsArticle-full-post">
                        <a :href="'/topic/' + article.id" :id="'topics-' + article.id" class="topicsArticle-full-post__img">
                            <figure :style="{ backgroundImage: 'url(' + getImage(article, 'mobile') + ')' }"></figure>
                        </a>
                        <div class="topicsArticle-full-post__content">
                            <a :href="'/topic/' + article.id" :id="'topics-' + article.id">
                                <h2 v-text="article.name"></h2>
                            </a>
                            <a :href="'/topic/' + article.id" :id="'topics-' + article.id">
                                <p v-html="getTruncatedVal(article.ogDescription, 45)"></p>
                            </a>
                        </div>
                    </div>
                </template>
            </div>
        </div>


    </section>
</template>

<script>
    import ItemsTitleRect from './ItemsTitleRect.vue'
    import {
        getAuthor,
        getBrief,
        getHref,
        getImage,
        getTruncatedVal
    } from '../utils/comm'
    import moment from 'moment'
    export default {
      name: 'latestArticle-foodtravel',
      props: [ 'articles', 'props', 'commonData' ],
      components: {
        'items-title-rect': ItemsTitleRect
      },
      methods: {
        getAuthor,
        getBrief,
        getHref,
        getImage,
        getTruncatedVal,
        moment
      },
      computed: {
        latestArticle () {
          return this.articles
        },
        topics () {
          return this.commonData.topics.items.filter((o) => {
            if (o.hasOwnProperty('sections')) return o.sections[0] === '57dfe399ee85930e00cad4d6' // foodtravel
          })
        }
      }
    }
</script>

<style lang="stylus" scoped>
.latestArticle-foodtravel
    display flex
    flex-direction column
    align-items flex-start
    width 100%

    .topicsArticle-foodtravel-container
        margin-top 5%
        margin-bottom 25px
        .topicsArticle-full-posts
            margin-top 25px
            .topicsArticle-full-post
                img_width = 100%
                content_width = 90%
                
                display flex
                flex-direction column
                justify-content flex-start
                align-items center
                margin 50px 5% 0px 5%
                border 2px solid white

                .topicsArticle-full-post__content
                    display flex
                    flex-direction column
                    justify-content space-around
                    align-items flex-start

                    width content_width
                    height 200px
                    padding 2%
                    h2
                        font-size 24px
                        font-weight bold
                        color black
                        line-height 30px
                    p, span
                        font-size 16px
                        font-weight normal
                        color black
                        line-height 24px

                &__img
                    width img_width
                    height 35vh
                    figure
                        width 100%
                        height 100%
                        margin 0
                        background-repeat no-repeat
                        background-size 100% 100%  

    .latestArticle-foodtravel-container
        margin-top 5%
        margin-bottom 25px
        .header-rect
            margin-left 5%

        .latestArticle-full-posts
            margin-top 25px
            .latestArticle-full-post
                img_width = 100%
                content_width = 90%
                border_style = 1px solid #4d4d4d
                
                
                // In mobile, there is no different between two classes below
                &-0, &-1
                    display flex
                    flex-direction column
                    justify-content flex-start
                    align-items center
                    margin-top 50px
                    .latestArticle-full-post__content
                        display flex
                        flex-direction column
                        justify-content space-around
                        align-items flex-start

                        border-right border_style
                        border-bottom border_style
                        border-left border_style
                        width content_width
                        height 300px
                        padding 0 5% 5% 5%
                        h2
                            font-size 24px
                            font-weight bold
                            color black
                            line-height 30px
                        p, span
                            font-size 16px
                            font-weight normal
                            color black
                            line-height 24px

                &__img
                    box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
                    width img_width
                    height 45vh
                    figure
                        width 100%
                        height 100%
                        margin 0
                        background-repeat no-repeat
                        background-size 100% 100%  


// Tablet
@media (min-width: 768px)
    .latestArticle-foodtravel
        align-items center
        .topicsArticle-foodtravel-container
            .topicsArticle-full-posts
                .topicsArticle-full-post
                    img_width = 80%
                    content_width = 90%
                    
                    flex-direction row
                    margin-top 50px

                    .topicsArticle-full-post__content
                        width content_width
                        height 250px
                    &__img
                        width img_width
                        height 200px

        .latestArticle-foodtravel-container
            margin-left 5%
            .header-rect
                margin 0

            .latestArticle-full-posts
                margin-top 50px
                .latestArticle-full-post
                    img_width = 48%
                    content_width = 95% - img_width + 10%
                    border_style = 1px solid #4d4d4d

                    // Img at left side, content at right side
                    &-0
                        flex-direction row
                        .latestArticle-full-post__content
                            margin-left -10%
                            border border_style
                            width content_width
                            height 350px
                            padding 0 2% 0 12%
                    
                    // Img at right side, content at left side
                    &-1
                        flex-direction row-reverse
                        justify-content flex-end
                        align-items center
                        .latestArticle-full-post__content
                            margin-right -10%
                            border border_style
                            width content_width
                            height 350px
                            padding 0 12% 0 2%

                    &__img
                        z-index 1
                        width img_width
                        height 300px 

// PC
@media (min-width: 1366px)
    .latestArticle-foodtravel
        flex-direction row
        align-items flex-start
                 
        .latestArticle-foodtravel-container
            margin-left 8.3%
            margin-right 4.3%
            margin-bottom 50px
            width 88%
            .header-rect
                margin 0

            .latestArticle-full-posts
                margin-top 50px
                .latestArticle-full-post
                    img_width = 56%
                    content_width = 100% - img_width
                    border_style = 1px solid #4d4d4d

                    // Img at left side, content at right side
                    &-0
                        flex-direction row
                        .latestArticle-full-post__content
                            margin 0
                            border-top border_style
                            border-right border_style
                            border-bottom border_style
                            border-left none
                            width content_width
                            height 36vh
                            padding 0 2% 0 2%
                            // h2
                            //     font-size 24px
                            //     line-height 30px
                            // p, span
                            //     font-size 16px
                            //     line-height 22px
                    
                    // Img at right side, content at left side
                    &-1
                        flex-direction row-reverse
                        justify-content flex-end
                        align-items center
                        .latestArticle-full-post__content
                            margin 0
                            border-top border_style
                            border-right none
                            border-bottom border_style
                            border-left border_style
                            width content_width
                            height 36vh
                            padding 0 2% 0 2%
                            // h2
                            //     font-size 24px
                            //     line-height 30px
                            // p, span
                            //     font-size 16px
                            //     line-height 22px

                    &__img
                        width img_width
                        height 44vh

        .topicsArticle-foodtravel-container
            flex-direction column
            margin-right 9.5%
            width 300px
            .topicsArticle-full-posts
                margin-top 5vh
                .topicsArticle-full-post
                    margin 0
                    margin-top 5vh
                    padding 0 0 50% 0
                    flex-direction column

                    img_width = 100%
                    content_width = 90%

                    .topicsArticle-full-post__content
                        height 150px
                        padding 80px 1.5% 10% 1.5%
                        width content_width
                    &__img
                        width img_width
                        height 200px

</style>
