/*! 18-03-2016 */
var urbaClic, urbaClicUtils = {};

urbaClicUtils.urlify = function(text) {
    if ("string" != typeof text) return text;
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + "</a>";
    });
}, jQuery(document).ready(function($) {
    var Templates = {};
    Templates.autocomplete = [ "{{#each features}}", '<li><a href="#" data-feature="{{jsonencode .}}">{{mark properties.label ../query}}</i></a>', "{{/each}}" ], 
    Templates.shareLink = [ '<div class="uData-shareLink">', '<div class="linkDiv"><a href="#">intégrez cet outil de recherche sur votre site&nbsp;<i class="fa fa-share-alt"></i></a></div>', '<div class="hidden">', "   <h4>Vous pouvez intégrer cet outil de recherche de données sur votre site</h4>", "   <p>Pour ceci collez le code suivant dans le code HTML de votre page</p>", "   <pre>", "&lt;script&gt;window.jQuery || document.write(\"&lt;script src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js'&gt;&lt;\\/script&gt;\")&lt;/script&gt;", "", "&lt;!-- chargement feuille de style font-awesome --&gt;", '&lt;link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css"&gt;', "", '&lt;script src="{{baseUrl}}udata.js"&gt;&lt;/script&gt;', '&lt;div class="uData-data"', '   data-q="{{q}}"', '   data-organizations="{{organizationList}}"', '   data-organization="{{organization}}"', '   data-page_size="{{page_size}}"', "&gt&lt;/div&gt", "   </pre>", "   <p>vous pouvez trouver plus d'info sur cet outil et son paramétrage à cette adresse: <a href='https://github.com/DepthFrance/udata-js' target='_blank'>https://github.com/DepthFrance/udata-js</a></p>", "</div>", "</div>" ];
    var baseUrl = jQuery('script[src$="/urbaclic.js"]')[0].src.replace("/urbaclic.js", "/"), _urbaclic = {};
    urbaClic = function(obj, options) {
        var input = obj.find("#urbaclic-search"), ban_options = {
            limit: 5
        }, autocomplete = function() {
            var t = input.val(), ul = obj.find("ul.urbaclic-autocomplete");
            if (t.length > 1) {
                var url = BAN_API + "search/", params = ban_options;
                params.q = t, obj.find("ul.urbaclic-autocomplete").length || jQuery('<ul class="urbaclic-autocomplete"></ul>').insertAfter(input).hide(), 
                jQuery.getJSON(url, params, function(data) {
                    data.features.length ? ul.html(Templates.autocomplete(data)).show() : ul.html("").hide();
                });
            } else ul.html("").hide();
        }, loadParcelle = _urbaclic.loadParcelle = function(params) {
            console.log(params);
        };
        return input.keydown(function(e) {
            setTimeout(autocomplete, 10);
        }), obj.on("click", "ul.urbaclic-autocomplete [data-feature]", function(e) {
            e.preventDefault(), loadParcelle(jQuery(this).data());
        }), _urbaclic;
    };
    var BAN_API = "https://api-adresse.data.gouv.fr/", checklibs = function() {
        var dependences = {
            Handlebars: "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.2/handlebars.min.js",
            i18n: "https://cdnjs.cloudflare.com/ajax/libs/i18next/1.6.3/i18next-1.6.3.min.js",
            L: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.js"
        }, css = {
            L: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css"
        }, ready = !0;
        for (var i in css) 0 == jQuery('link[href="' + css[i] + '"]').length && jQuery('<link type="text/css" href="' + css[i] + '" rel="stylesheet">').appendTo("head");
        for (var i in dependences) "undefined" == typeof window[i] && (0 == jQuery('script[src="' + dependences[i] + '"]').length && jQuery('<script src="' + dependences[i] + '"></script>').appendTo("body"), 
        ready = !1);
        ready ? start() : setTimeout(checklibs, 100);
    }, start = function() {
        var container = _urbaclic.container;
        _urbaclic.lang = lang = "fr", i18n.init({
            resGetPath: baseUrl + "locales/urbaclic." + lang + ".json",
            lng: lang,
            load: "unspecific",
            interpolationPrefix: "{",
            interpolationSuffix: "}",
            fallbackLng: !1,
            fallbackOnEmpty: !0,
            fallbackOnNull: !0,
            nsseparator: "::",
            keyseparator: "$$"
        }, function(err, t) {}), Handlebars.registerHelper("ifCond", function(v1, operator, v2, options) {
            switch (operator) {
              case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);

              case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);

              case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);

              case "<":
                return v2 > v1 ? options.fn(this) : options.inverse(this);

              case "<=":
                return v2 >= v1 ? options.fn(this) : options.inverse(this);

              case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);

              case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);

              case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);

              case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);

              default:
                return options.inverse(this);
            }
        }), Handlebars.registerHelper("ifCount", function(v1, operator, v2, options) {
            var v1 = v1.length;
            switch (operator) {
              case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);

              case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);

              case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);

              case "<":
                return v2 > v1 ? options.fn(this) : options.inverse(this);

              case "<=":
                return v2 >= v1 ? options.fn(this) : options.inverse(this);

              case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);

              case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);

              case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);

              case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);

              default:
                return options.inverse(this);
            }
        }), Handlebars.registerHelper("mark", function(text, key) {
            var match = text.match(new RegExp(key, "gi"));
            for (var i in match) text = text.replace(new RegExp(match[i], "g"), "<mark>" + match[i] + "</mark>");
            return new Handlebars.SafeString(text);
        }), Handlebars.registerHelper("paginate", function(n, total, page_size) {
            var res = "", nPage = Math.ceil(total / page_size);
            if (1 == nPage) return "";
            for (var i = 1; nPage >= i; ++i) res += "<li" + (i == n ? ' class="active"' : "") + ">", 
            res += '<a href="#" data-page=' + i + ">" + i + "</a></li>";
            return '<nav><ul class="pagination">' + res + "</ul></nav>";
        }), Handlebars.registerHelper("taglist", function(tags) {
            var res = "";
            for (var i in tags) res += "<span class='label label-primary' >" + tags[i] + "</span> ";
            return res;
        }), Handlebars.registerHelper("trimString", function(passedString) {
            if (passedString.length > 150) {
                var theString = passedString.substring(0, 150) + "...";
                return new Handlebars.SafeString(theString);
            }
            return passedString;
        }), Handlebars.registerHelper("uppercase", function(passedString) {
            return passedString.toUpperCase();
        }), Handlebars.registerHelper("truncate", function(str, len) {
            if (str && str.length > len && str.length > 0) {
                var new_str = str + " ";
                return new_str = str.substr(0, len), new_str = str.substr(0, new_str.lastIndexOf(" ")), 
                new_str = new_str.length > 0 ? new_str : str.substr(0, len), new Handlebars.SafeString(new_str + "...");
            }
            return str;
        }), Handlebars.registerHelper("default", function(value, defaultValue) {
            return null != value ? value : defaultValue;
        }), Handlebars.registerHelper("dt", function(value, options) {
            return moment(value).format(options.hash.format || "LLL");
        }), Handlebars.registerHelper("placeholder", function(url, type) {
            return url ? url : baseUrl + "img/placeholders/" + type + ".png";
        }), Handlebars.registerHelper("_", function(value, options) {
            if (!value || "string" != typeof value) return "";
            options.hash.defaultValue = "???";
            var res = i18n.t(value, options.hash);
            return "???" == res && (value = value.charAt(0).toLowerCase() + value.slice(1), 
            res = i18n.t(value, options.hash), res = res.charAt(0).toUpperCase() + res.slice(1)), 
            "???" == res && (value = value.charAt(0).toUpperCase() + value.slice(1), res = i18n.t(value, options.hash), 
            res = res.charAt(0).toLowerCase() + res.slice(1)), "???" == res ? (console.warn('i18n "' + value + '" NOT FOUND'), 
            value) : res;
        }), Handlebars.registerHelper("md", function(value) {
            return new Handlebars.SafeString(marked(value));
        }), Handlebars.registerHelper("mdshort", function(value, length) {
            if (value) {
                var EXCERPT_TOKEN = "<!--- --- -->", DEFAULT_LENGTH = 128;
                "undefined" == typeof length && (length = DEFAULT_LENGTH);
                var text, ellipsis;
                return value.indexOf("<!--- excerpt -->") && (value = value.split(EXCERPT_TOKEN, 1)[0]), 
                ellipsis = value.length >= length ? "..." : "", text = marked(value.substring(0, length) + ellipsis), 
                text = text.replace("<a ", "<span ").replace("</a>", "</span>"), new Handlebars.SafeString(text);
            }
        }), Handlebars.registerHelper("theme", function(value) {
            return new Handlebars.SafeString(baseUrl + "" + value);
        }), Handlebars.registerHelper("fulllogo", function(value) {
            return new Handlebars.SafeString(value);
        }), Handlebars.registerHelper("jsonencode", function(value) {
            return JSON.stringify(value, null, 4);
        });
        for (var tmpl in Templates) {
            var template_surcharge_id = "udata_template_" + tmpl;
            console.info("load template: #" + template_surcharge_id);
            var t = jQuery("#" + template_surcharge_id).first();
            t.length ? (Templates[tmpl] = t.html(), console.info("loaded.")) : console.info("not found, use default template."), 
            "string" != typeof Templates[tmpl] && (Templates[tmpl] = Templates[tmpl].join("\n")), 
            Templates[tmpl] = Handlebars.compile(Templates[tmpl]);
        }
        container = jQuery("#urbaclic"), container.length && container.each(function() {
            var obj = jQuery(this);
            urbaClic(obj, obj.data());
        });
    };
    checklibs();
});