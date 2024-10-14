"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var pinia_1 = require("pinia");
var element_plus_1 = require("element-plus");
require("element-plus/dist/index.css");
var App_vue_1 = require("@/App.vue");
var router_1 = require("@/router");
require("@/assets/styles/style.scss");
var localization_1 = require("@/localization");
require("external-svg-loader");
var ElementPlusIconsVue = require("@element-plus/icons-vue");
var app = (0, vue_1.createApp)(App_vue_1.default);
for (var _i = 0, _a = Object.entries(ElementPlusIconsVue); _i < _a.length; _i++) {
    var _b = _a[_i], key = _b[0], component = _b[1];
    app.component(key, component);
}
app
    .use(element_plus_1.default)
    .use((0, pinia_1.createPinia)())
    .use(router_1.default)
    .use(localization_1.default)
    .mount("#app");
