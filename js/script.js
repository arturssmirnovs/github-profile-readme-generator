Vue.use(VueMarkdown);

Vue.component('custom-input', {
    props: ['value', 'title', 'placeholder', 'brand'],
    template: `
  <div class="form-group">
    <label :for="title">
      <img v-if="brand" :src="'https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/'+brand+'.svg'" :alt="brand" height='30'> &nbsp;
      {{ title }}
    </label>
    <input type="text" class="form-control" :value="value" @input="$emit('input', $event.target.value)" :aria-describedby="title" :placeholder="placeholder" />
  </div>
  `
})

Vue.component('brand-logo', {
    props: ['brand'],
    template: `
      <img v-if="brand" :src="'https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/'+brand+'.svg'" :alt="brand" height='30' class="brand-logo"> &nbsp;
  `
})

Vue.component('theme-option', {
    props: ['optionId', 'value', 'label'],
    template: `
        <div class="custom-control custom-radio">
            <input class="custom-control-input" type="radio" :id="optionId" :value="value" v-model="data.theme" v-on:change="changeTheme" checked v-if="optionId === 'themeDefault'">
            <input class="custom-control-input" type="radio" :id="optionId" :value="value" v-model="data.theme" v-on:change="changeTheme" v-else>
            <label class="custom-control-label" :for="optionId">{{ label }}</label>
        </div>
    `
})

new Vue({
    el: '#app',
    data: function () {
        return {
            forced: false,
            tab: "header",
            data: {
                language: "en",
                theme: "default",
                title: "my name is Arturs",
                subtitle: "I am GitHub Readme Generator's creator",
                text: "I made this project just for fun, it allows you to create nice and simple GitHub Readme files that you can copy/paste and use in your profile.",

                banner: "https://arturssmirnovs.github.io/github-profile-readme-generator/images/banner.png",

                skills: "VUE JS / REACT / JS / HTML / CSS",

                working: "this page.",
                learning: "",
                collaborate: "",
                help: "",
                ask: "",
                reach: "",
                pronouns: "",
                fact: "",

                views: false,
                stats: false,
                activityGraph: false,
                metrics: false,
                streak: false,

                languages: false,
                trophy: false,

                arctic: false,
                devprog: false,
                pro: false,
                star: false,
                sponsor: false,
                gitpro: false,

                github: "",
                dev: "",
                hashnode: "",
                linkedin: "",
                facebook: "",
                instagram: "",
                twitter: "",
                codepen: "",
                codesandbox: "",
                stackoverflow: "",
                youtube: "",
                twitch: "",
                reddit: "",
                website: "",

                items: [],

                translations: ""
            },
            source: "",
            translator: null
        };
    },
    watch: {
        data: {
            deep: true,
            handler() {
                this.forced = false;
                this.github = this.githubWatcher(this.data.github);
                this.source = this.getSource(this.data);
            }
        }
    },
    mounted: function(){
        this.getTranslations(this.data.language).then((translations) => {
            this.data.translations = translations;
            this.source = this.getSource(this.data);
            this.addItem();
        });

        this.translator = new Translator({
            persist: false,
            languages: ["en", "es"],
            defaultLanguage: "en",
            detectLanguage: true,
            filesLocation: "i18n"
        });
        this.translator.load();
    },
    methods: {
        githubWatcher(github) {
            if (!github) {
                this.data.views = false;
                this.data.stats = false;
                this.data.activityGraph = false;
                this.data.private = false;
                this.data.metrics = false;
                this.data.streak = false;
                this.data.languages = false;
                this.data.trophy = false;
                this.data.arctic = false;
                this.data.devprog = false;
                this.data.pro = false;
                this.data.star = false;
                this.data.sponsor = false;
                this.data.gitpro = false;
            }

            return github;
        },
        getTranslations(language) {
            return fetch(`i18n/${language}.json`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(response => response.json());
        },
        addItem() {
            this.data.items.push({
                value: '',
                icon: ''
            });
        },
        switchLanguage() {
            this.translator.load(this.data.language).then((translations) => {
                this.data.translations = this.translator.translations;
                this.source = this.getSource(this.data);
            });
        },
        changeTheme() {
            console.log('heyyy!')
        },
        onKeyUp(event) {
            this.forced = true;
        },
        slugify(text) {
            return text.toString().toLowerCase()
                .replace(/\.+/g, '-dot-')
                .replace(/\s+/g, '')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        },
        getSource: function (data) {
            let source = '';

            if (data) {
                
                if (data.title) {
                    source += `### ${data.translations.markdown.hiThere} 👋, ${data.title}`;
                    source += "\n";
                }
                if (data.subtitle) {
                    source += `#### ${data.subtitle}`;
                    source += "\n";
                }
                if (data.banner) {
                    source += `![${data.subtitle}](${data.banner})`;
                    source += "\n";
                    source += "\n";
                }
                if (data.text) {
                    source += data.text;
                    source += "\n";
                }
                if (data.skills) {
                    source += "\n";
                    source += `${data.translations.markdown.skills}: ${data.skills}`;
                    source += "\n";
                }

                source += "\n";

                if (data.working) {
                    source += `- 🔭 ${data.translations.markdown.working} ${data.working} `;
                    source += "\n";
                }
                if (data.learning) {
                    source += `- 🌱 ${data.translations.markdown.learning} ${data.learning} `;
                    source += "\n";
                }
                if (data.collaborate) {
                    source += `- 👯 ${data.translations.markdown.collaborate} ${data.collaborate} `;
                    source += "\n";
                }
                if (data.help) {
                    source += `- 🤔 ${data.translations.markdown.help} ${data.help} `;
                    source += "\n";
                }
                if (data.ask) {
                    source += `- 💬 ${data.translations.markdown.ask} ${data.ask} `;
                    source += "\n";
                }
                if (data.reach) {
                  source += `- 📫 ${data.translations.markdown.reach}: ${data.reach} `;
                  source += "\n";
                }
                if (data.pronouns) {
                    source += `- 😄 ${data.translations.markdown.pronouns}: ${data.pronouns} `;
                    source += "\n";
                }
                if (data.fact) {
                    source += `- ⚡ ${data.translations.markdown.fact}: ${data.fact} `;
                    source += "\n";
                }

                source += "\n";
                source += "\n";

                if (data.github) {
                    source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/github.svg' alt='github' height='40'>](https://github.com/${data.github})  `;
                }
                if (data.dev) {
                    source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/dev-dot-to.svg' alt='dev' height='40'>](https://dev.to/${data.dev})  `;
                }
                if (data.hashnode) {
                    source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/hashnode.svg' alt='dev' height='40'>](${data.hashnode})  `;
                }
                if (data.linkedin) {
                    source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/linkedin.svg' alt='linkedin' height='40'>](https://www.linkedin.com/in/${data.linkedin}/)  `;
                }
                if (data.facebook) {
                    source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/facebook.svg' alt='facebook' height='40'>](https://www.facebook.com/${data.facebook})  `;
                }
                if (data.instagram) {
                    source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/instagram.svg' alt='instagram' height='40'>](https://www.instagram.com/${data.instagram}/)  `;
                }
                if (data.twitter) {
                    source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/twitter.svg' alt='twitter' height='40'>](https://twitter.com/${data.twitter})  `;
                }
                if (data.codepen) {
                    source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/codepen.svg' alt='codepen' height='40'>](https://codepen.io/${data.codepen})  `;
                }
                if (data.codesandbox) {
                    source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/codesandbox.svg' alt='codesandbox' height='40'>](https://codesandbox.io/u/${data.codesandbox})  `;
                }
                if (data.stackoverflow) {
                    source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/stackoverflow.svg' alt='stackoverflow' height='40'>](https://stackoverflow.com/users/${data.stackoverflow})  `;
                }
                if (data.youtube) {
                    source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/youtube.svg' alt='YouTube' height='40'>](https://www.youtube.com/channel/${data.youtube})  `;
                }
                if (data.twitch) {
                    source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/twitch.svg' alt='Twitch' height='40'>](https://www.twitch.tv/${data.twitch})  `;
                }
                if (data.reddit) {
                    source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/reddit.svg' alt='Reddit' height='40'>](https://www.reddit.com/user/${data.reddit})  `;
                }
                if (data.website) {
                    source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/icloud.svg' alt='website' height='40'>](${data.website})  `;
                }

                for (index = 0; index < data.items.length; ++index) {
                    if (data.items[index].icon && data.items[index].value) {
                        let icon = this.slugify(data.items[index].icon);
                        let url = data.items[index].value;
                        source += `[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/${icon}.svg' alt='${icon}' height='40'>](${url})  `;
                    }
                }

                source += "\n";
                source += "\n";

                if (data.arctic) {
                    source += "<a href='https://archiveprogram.github.com/'><img src='https://raw.githubusercontent.com/acervenky/animated-github-badges/master/assets/acbadge.gif' width='40' height='40'></a> ";
                }
		        if (data.devprog) {
                    source += "<a href='https://docs.github.com/en/developers'><img src='https://raw.githubusercontent.com/acervenky/animated-github-badges/master/assets/devbadge.gif' width='40' height='40'></a> ";
                }
		        if (data.gitpro) {
                    source += "<a href='https://github.com/pricing'><img src='https://raw.githubusercontent.com/acervenky/animated-github-badges/master/assets/pro.gif' width='40' height='40'></a> ";
                }
				if (data.star) {
                    source += "<a href='https://stars.github.com/'><img src='https://raw.githubusercontent.com/acervenky/animated-github-badges/master/assets/starbadge.gif' width='35' height='35'></a> ";
                }
				if (data.sponsor) {
                    source += "<a href='https://docs.github.com/en/github/supporting-the-open-source-community-with-github-sponsors'><img src='https://raw.githubusercontent.com/acervenky/animated-github-badges/master/assets/sponsorbadge.gif' width='35' height='35'></a> ";
                }
		        if (data.arctic || data.devprog || data.gitpro ||data.star || data.sponsor) {
                    source += "\n";
                    source += "\n";
                }

                if (data.trophy && data.github) {
                    source += `[![trophy](https://github-profile-trophy.vercel.app/?username=${data.github})](https://github.com/ryo-ma/github-profile-trophy)`;
                    source += "\n";
                    source += "\n";
                }

                if (data.languages && data.github) {
                    source += `[![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${data.github})](https://github.com/anuraghazra/github-readme-stats)`;
                    source += "\n";
                    source += "\n";
                }

                if (data.stats && data.github && !data.private) {
                    source += `![GitHub stats](https://github-readme-stats.vercel.app/api?username=${data.github}&show_icons=true)  `;
                    source += "\n";
                    source += "\n";
                }

                if (data.stats && data.github && data.private) {
                    source += `![GitHub stats](https://github-readme-stats.vercel.app/api?username=${data.github}&show_icons=true&count_private=true)  `;
                    source += "\n";
                    source += "\n";
                }

                if (data.activityGraph && data.github) {
                    source += `![GitHub Activity Graph](https://activity-graph.herokuapp.com/graph?username=${data.github})  `;
                    source += "\n";
                    source += "\n";
                }

                if (data.metrics && data.github) {
                    source += `![GitHub metrics](https://metrics.lecoq.io/${data.github})  `;
                    source += "\n";
                    source += "\n";
                }

                if (data.streak && data.github) {
                    source += `![GitHub streak stats](https://github-readme-streak-stats.herokuapp.com/?user=${data.github})  `;
                    source += "\n";
                    source += "\n";
                }

                if (data.views && data.github) {
                    source += `![Profile views](https://gpvc.arturio.dev/${data.github})  `;
                }
            }

            return source;
        },
        copyCode() {
            this.$refs.code.select();
            document.execCommand("copy");
        }
    }
});
