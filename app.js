Vue.component('page-bar', {
    props: ['total'],
    data: function () {
        return {
            idx: 0
        }
    },
    template: '<nav class="navbar navbar-fixed-bottom navbar-inverse" aria-label="..." id="footer"><div class="container-fluid text-center"><a class="prev" @click="prev">❮</a><a class="next" @click="next">❯</a>{{ idx + 1 }}</div></nav>',
    methods: {
        prev: function () {
            this.idx--;
            if (this.idx < 0) {
                this.idx = this.total - 1;
            }
            this.$emit("goto", this.idx);
        },
        next: function () {
            this.idx++;
            if (this.idx >= this.total) {
                this.idx = 0;
            }
            this.$emit("goto", this.idx);
        },
        pushTo : function (i) {
            this.idx = i;
            this.$emit("goto", this.idx);
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        selected: 0,
        list: dataList
    },
    methods: {
        goto: function (idx) {
            this.selected = idx;
        },
        toggleAnswer: function (event) {
            var showFlg = false;
            if ($(event.target).hasClass('glyphicon-eye-open')) {
                showFlg = true;
                $(event.target).removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
                $(".image").removeClass('hide');
            } else {
                $(event.target).removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
                $(".image").addClass("hide");
            }
            $(".hint").each(function () {
                var hint = $(this).attr('data-hint');
                if (showFlg) {
                    if ($(this).val() == hint) {
                        $(this).css('color', 'blue');
                    } else {
                        $(this).css('color', 'red');
                    }
                    $(this).val(hint).attr('disabled', 'disabled');
                } else {
                    $(this).css('color', 'black').val('').removeAttr('disabled');
                }
            });
        }
    },
    computed: {
        current: function () {
            if (this.selected >= this.list.length) {
                this.selected = 0;
            } else if (this.selected < 0) {
                this.selected = this.list.length - 1;
            }

            var nowQuestion = this.list[this.selected];
            var article = nowQuestion.article;
            var arts = article.replace(/\[[^\]]+\]/g, '=').split('=');
            var hinds = article.replace(/^[^\[]*\[/g, '').replace(/\][^\[]*$/g, '').replace(/\][^\[]*\[/g, '=').split('=');
            article = '';
            for (var i = 0; i < arts.length; i++) {
                article = article + arts[i];
                if (i < hinds.length) {
                    var width = hinds[i].length * 12;
                    article = article + '<span class="hint_wrapper" style="width:' + width + 'px"><input type="text" class="hint" data-hint="' + hinds[i] + '"/></span>';
                }
            }
            nowQuestion.showArticle = article;
            $('.panel-heading').find('.glyphicon').removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
            if (!$(".image").hasClass('hide')) {
                $(".image").addClass('hide');
            }
            return nowQuestion;
        },
        current2: function () {
            if (this.selected >= this.list.length) {
                this.selected = 0;
            } else if (this.selected < 0) {
                this.selected = this.list.length - 1;
            }
            return this.list[this.selected];
        }
    },
    filters: {
        wordCounter : function(val) {
            if (!val) return 0;
            var s = val.replace(/<[^>]+>/gi, '');
            s = s.replace(/(^\s*)|(\s*$)/gi,"");
            s = s.replace(/[ ]{2,}/gi," ");
            return val.split(' ').length;
        }
    }
});
