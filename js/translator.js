class Translator {
    constructor(options = {}) {
        this._options = Object.assign({}, this.defaultConfig, options);
        this._elements = document.querySelectorAll("[data-i18n]");
        this._cache = new Map();
        this.translations = {};

        if (this._options.detectLanguage) {
            this._options.defaultLanguage = this._detectLanguage();
        }

        if (this._options.defaultLanguage && typeof this._options.defaultLanguage == "string") {
            this._getResource(this._options.defaultLanguage);
        }
    }

    _detectLanguage() {
        var stored = localStorage.getItem("language");

        if (this._options.persist && stored) {
            return stored;
        }

        var lang = navigator.languages ? navigator.languages[0] : navigator.language;
        return lang.substr(0, 2);
    }

    _fetch(path) {
        return fetch(path)
            .then(response => response.json())
            .catch(() => {
                console.error(
                    `Could not load ${path}. Please make sure that the file exists.`
                );
            });
    }

    async _getResource(lang) {
        if (this._cache.has(lang)) {
            this.translations = JSON.parse(this._cache.get(lang));
            return JSON.parse(this._cache.get(lang));
        }

        var translation = await this._fetch(
            `${this._options.filesLocation}/${lang}.json`
        );

        if (!this._cache.has(lang)) {
            this._cache.set(lang, JSON.stringify(translation));
        }

        this.translations = translation;

        return translation;
    }

    async load(lang) {
        if (!this._options.languages.includes(lang)) {
            return;
        }

        this._translate(await this._getResource(lang));
        document.documentElement.lang = lang;

        if (this._options.persist) {
            localStorage.setItem("language", lang);
        }
    }

    async getTranslationByKey(lang, key) {
        if (!key) throw new Error("Expected a key to translate, got nothing.");

        if (typeof key != "string")
            throw new Error(
                `Expected a string for the key parameter, got ${typeof key} instead.`
            );

        var translation = await this._getResource(lang);
        return this._getValueFromJSON(key, translation, true);
    }

    _getValueFromJSON(key, json, fallback) {
        var text = key.split(".").reduce((obj, i) => obj[i], json);

        if (!text && this._options.defaultLanguage && fallback) {
            let fallbackTranslation = JSON.parse(
                this._cache.get(this._options.defaultLanguage)
            );
            text = this._getValueFromJSON(key, fallbackTranslation, false);
        } else if (!text) {
            text = key;
            console.warn(`Could not find text for attribute "${key}".`);
        }

        return text;
    }

    _translate(translation) {
        var zip = (keys, values) => keys.map((key, i) => [key, values[i]]);
        var nullSafeSplit = (str, separator) => (str ? str.split(separator) : null);

        var replace = element => {
            var keys = nullSafeSplit(element.getAttribute("data-i18n"), " ") || [];
            var properties = nullSafeSplit(element.getAttribute("data-i18n-attr"), " ") || ["innerHTML"];
            if (keys.length > 0 && keys.length !== properties.length) {
                console.error(
                    "data-i18n and data-i18n-attr must contain the same number of items"
                );
            } else {
                var pairs = zip(keys, properties);
                pairs.forEach(pair => {
                    const [key, property] = pair;
                    var text = this._getValueFromJSON(key, translation, true);

                    if (text) {
                        element[property] = text;
                        element.setAttribute(property, text);
                    } else {
                        console.error(`Could not find text for attribute "${key}".`);
                    }
                });
            }
        };
        this._elements.forEach(replace);
    }

    get defaultConfig() {
        return {
            persist: false,
            languages: ["en"],
            defaultLanguage: "",
            detectLanguage: true,
            filesLocation: "/i18n"
        };
    }
}