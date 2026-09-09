(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!*********************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var objectKeys = ['qy', 'env', 'error', 'version', 'lanDebug', 'cloud', 'serviceMarket', 'router', 'worklet', '__webpack_require_UNI_MP_PLUGIN__'];
var singlePageDisableKey = ['lanDebug', 'router', 'worklet'];
var target = typeof globalThis !== 'undefined' ? globalThis : function () {
  return this;
}();
var key = ['w', 'x'].join('');
var oldWx = target[key];
var launchOption = oldWx.getLaunchOptionsSync ? oldWx.getLaunchOptionsSync() : null;
function isWxKey(key) {
  if (launchOption && launchOption.scene === 1154 && singlePageDisableKey.includes(key)) {
    return false;
  }
  return objectKeys.indexOf(key) > -1 || typeof oldWx[key] === 'function';
}
function initWx() {
  var newWx = {};
  for (var _key in oldWx) {
    if (isWxKey(_key)) {
      // TODO wrapper function
      newWx[_key] = oldWx[_key];
    }
  }
  return newWx;
}
target[key] = initWx();
if (!target[key].canIUse('getAppBaseInfo')) {
  target[key].getAppBaseInfo = target[key].getSystemInfoSync;
}
if (!target[key].canIUse('getWindowInfo')) {
  target[key].getWindowInfo = target[key].getSystemInfoSync;
}
if (!target[key].canIUse('getDeviceInfo')) {
  target[key].getDeviceInfo = target[key].getSystemInfoSync;
}
var _default = target[key];
exports.default = _default;

/***/ }),
/* 2 */
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, global) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApp = createApp;
exports.createComponent = createComponent;
exports.createPage = createPage;
exports.createPlugin = createPlugin;
exports.createSubpackageApp = createSubpackageApp;
exports.default = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _construct2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/construct */ 15));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var _uniI18n = __webpack_require__(/*! @dcloudio/uni-i18n */ 22);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var realAtob;
var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== 'function') {
  realAtob = function realAtob(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, '');
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }

    // Adding the padding if missing, for semplicity
    str += '=='.slice(2 - (str.length & 3));
    var bitmap;
    var result = '';
    var r1;
    var r2;
    var i = 0;
    for (; i < str.length;) {
      bitmap = b64.indexOf(str.charAt(i++)) << 18 | b64.indexOf(str.charAt(i++)) << 12 | (r1 = b64.indexOf(str.charAt(i++))) << 6 | (r2 = b64.indexOf(str.charAt(i++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  // 注意atob只能在全局对象上调用，例如：`const Base64 = {atob};Base64.atob('xxxx')`是错误的用法
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}
function getCurrentUserInfo() {
  var token = wx.getStorageSync('uni_id_token') || '';
  var tokenArr = token.split('.');
  if (!token || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  var userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error) {
    throw new Error('获取当前用户信息出错，详细错误信息为：' + error.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1000;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(Vue) {
  Vue.prototype.uniIDHasRole = function (roleId) {
    var _getCurrentUserInfo = getCurrentUserInfo(),
      role = _getCurrentUserInfo.role;
    return role.indexOf(roleId) > -1;
  };
  Vue.prototype.uniIDHasPermission = function (permissionId) {
    var _getCurrentUserInfo2 = getCurrentUserInfo(),
      permission = _getCurrentUserInfo2.permission;
    return this.uniIDHasRole('admin') || permission.indexOf(permissionId) > -1;
  };
  Vue.prototype.uniIDTokenValid = function () {
    var _getCurrentUserInfo3 = getCurrentUserInfo(),
      tokenExpired = _getCurrentUserInfo3.tokenExpired;
    return tokenExpired > Date.now();
  };
}
var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isFn(fn) {
  return typeof fn === 'function';
}
function isStr(str) {
  return typeof str === 'string';
}
function isObject(obj) {
  return obj !== null && (0, _typeof2.default)(obj) === 'object';
}
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
function noop() {}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
});
var HOOKS = ['invoke', 'success', 'fail', 'complete', 'returnValue'];
var globalInterceptors = {};
var scopedInterceptors = {};
function mergeHook(parentVal, childVal) {
  var res = childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}
function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}
function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}
function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}
function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}
function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}
function wrapperHook(hook, params) {
  return function (data) {
    return hook(data, params) || data;
  };
}
function isPromise(obj) {
  return !!obj && ((0, _typeof2.default)(obj) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
function queue(hooks, data, params) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.resolve(wrapperHook(hook, params));
    } else {
      var res = hook(data, params);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {}
        };
      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    }
  };
}
function wrapperOptions(interceptor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res, options).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}
function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, (0, _toConsumableArray2.default)(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, (0, _toConsumableArray2.default)(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method, api, options) {
  for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    params[_key - 3] = arguments[_key];
  }
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        // 重新访问 getApiInterceptorHooks, 允许 invoke 中再次调用 addInterceptor,removeInterceptor
        return api.apply(void 0, [wrapperOptions(getApiInterceptorHooks(method), options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}
var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return new Promise(function (resolve, reject) {
      res.then(function (res) {
        if (!res) {
          resolve(res);
          return;
        }
        if (res[0]) {
          reject(res[0]);
        } else {
          resolve(res[1]);
        }
      });
    });
  }
};
var SYNC_API_RE = /^\$|__f__|Window$|WindowStyle$|sendHostEvent|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|rpx2px|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getLocale|setLocale|invokePushCallback|getWindowInfo|getDeviceInfo|getAppBaseInfo|getSystemSetting|getAppAuthorizeSetting|initUTS|requireUTS|registerUTS|getFacialRecognitionMetaInfo/;
var CONTEXT_API_RE = /^create|Manager$/;

// Context例外情况
var CONTEXT_API_RE_EXC = ['createBLEConnection'];

// 同步例外情况
var ASYNC_API = ['createBLEConnection', 'createPushMessage'];
var CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}
function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).catch(function (err) {
    return [err];
  });
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}

/* eslint-disable no-extend-native */
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function (callback) {
    var promise = this.constructor;
    return this.then(function (value) {
      return promise.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return promise.resolve(callback()).then(function () {
        throw reason;
      });
    });
  };
}
function promisify(name, api) {
  if (!shouldPromise(name) || !isFn(api)) {
    return api;
  }
  return function promiseApi() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      params[_key2 - 1] = arguments[_key2];
    }
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, Object.assign({}, options)].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject
      })].concat(params));
    })));
  };
}
var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;
function checkDeviceWidth() {
  var windowWidth, pixelRatio, platform;
  {
    var windowInfo = typeof wx.getWindowInfo === 'function' && wx.getWindowInfo() ? wx.getWindowInfo() : wx.getSystemInfoSync();
    var deviceInfo = typeof wx.getDeviceInfo === 'function' && wx.getDeviceInfo() ? wx.getDeviceInfo() : wx.getSystemInfoSync();
    windowWidth = windowInfo.windowWidth;
    pixelRatio = windowInfo.pixelRatio;
    platform = deviceInfo.platform;
  }
  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}
function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number < 0 ? -result : result;
}
var LOCALE_ZH_HANS = 'zh-Hans';
var LOCALE_ZH_HANT = 'zh-Hant';
var LOCALE_EN = 'en';
var LOCALE_FR = 'fr';
var LOCALE_ES = 'es';
var messages = {};
function getLocaleLanguage() {
  var localeLanguage = '';
  {
    var appBaseInfo = typeof wx.getAppBaseInfo === 'function' && wx.getAppBaseInfo() ? wx.getAppBaseInfo() : wx.getSystemInfoSync();
    var language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
var locale;
{
  locale = getLocaleLanguage();
}
function initI18nMessages() {
  if (!isEnableLocale()) {
    return;
  }
  var localeKeys = Object.keys(__uniConfig.locales);
  if (localeKeys.length) {
    localeKeys.forEach(function (locale) {
      var curMessages = messages[locale];
      var userMessages = __uniConfig.locales[locale];
      if (curMessages) {
        Object.assign(curMessages, userMessages);
      } else {
        messages[locale] = userMessages;
      }
    });
  }
}
initI18nMessages();
var i18n = (0, _uniI18n.initVueI18n)(locale, {});
var t = i18n.t;
var i18nMixin = i18n.mixin = {
  beforeCreate: function beforeCreate() {
    var _this = this;
    var unwatch = i18n.i18n.watchLocale(function () {
      _this.$forceUpdate();
    });
    this.$once('hook:beforeDestroy', function () {
      unwatch();
    });
  },
  methods: {
    $$t: function $$t(key, values) {
      return t(key, values);
    }
  }
};
var setLocale = i18n.setLocale;
var getLocale = i18n.getLocale;
function initAppLocale(Vue, appVm, locale) {
  var state = Vue.observable({
    locale: locale || i18n.getLocale()
  });
  var localeWatchers = [];
  appVm.$watchLocale = function (fn) {
    localeWatchers.push(fn);
  };
  Object.defineProperty(appVm, '$locale', {
    get: function get() {
      return state.locale;
    },
    set: function set(v) {
      state.locale = v;
      localeWatchers.forEach(function (watch) {
        return watch(v);
      });
    }
  });
}
function isEnableLocale() {
  return typeof __uniConfig !== 'undefined' && __uniConfig.locales && !!Object.keys(__uniConfig.locales).length;
}
function include(str, parts) {
  return !!parts.find(function (part) {
    return str.indexOf(part) !== -1;
  });
}
function startsWith(str, parts) {
  return parts.find(function (part) {
    return str.indexOf(part) === 0;
  });
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, '-');
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === 'chinese') {
    // 支付宝
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf('zh') === 0) {
    if (locale.indexOf('-hans') > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf('-hant') > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ['-tw', '-hk', '-mo', '-cht'])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  var lang = startsWith(locale, [LOCALE_EN, LOCALE_FR, LOCALE_ES]);
  if (lang) {
    return lang;
  }
}
// export function initI18n() {
//   const localeKeys = Object.keys(__uniConfig.locales || {})
//   if (localeKeys.length) {
//     localeKeys.forEach((locale) =>
//       i18n.add(locale, __uniConfig.locales[locale])
//     )
//   }
// }

function getLocale$1() {
  // 优先使用 $locale
  if (isFn(getApp)) {
    var app = getApp({
      allowDefault: true
    });
    if (app && app.$vm) {
      return app.$vm.$locale;
    }
  }
  return getLocaleLanguage();
}
function setLocale$1(locale) {
  var app = isFn(getApp) ? getApp() : false;
  if (!app) {
    return false;
  }
  var oldLocale = app.$vm.$locale;
  if (oldLocale !== locale) {
    app.$vm.$locale = locale;
    onLocaleChangeCallbacks.forEach(function (fn) {
      return fn({
        locale: locale
      });
    });
    return true;
  }
  return false;
}
var onLocaleChangeCallbacks = [];
function onLocaleChange(fn) {
  if (onLocaleChangeCallbacks.indexOf(fn) === -1) {
    onLocaleChangeCallbacks.push(fn);
  }
}
if (typeof global !== 'undefined') {
  global.getLocale = getLocale$1;
}
var interceptors = {
  promiseInterceptor: promiseInterceptor
};
var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  rpx2px: upx2px,
  getLocale: getLocale$1,
  setLocale: setLocale$1,
  onLocaleChange: onLocaleChange,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor,
  interceptors: interceptors
});
function findExistsPageIndex(url) {
  var pages = getCurrentPages();
  var len = pages.length;
  while (len--) {
    var page = pages[len];
    if (page.$page && page.$page.fullPath === url) {
      return len;
    }
  }
  return -1;
}
var redirectTo = {
  name: function name(fromArgs) {
    if (fromArgs.exists === 'back' && fromArgs.delta) {
      return 'navigateBack';
    }
    return 'redirectTo';
  },
  args: function args(fromArgs) {
    if (fromArgs.exists === 'back' && fromArgs.url) {
      var existsPageIndex = findExistsPageIndex(fromArgs.url);
      if (existsPageIndex !== -1) {
        var delta = getCurrentPages().length - 1 - existsPageIndex;
        if (delta > 0) {
          fromArgs.delta = delta;
        }
      }
    }
  }
};
var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(function (item, index) {
        return index < currentIndex ? item !== urls[currentIndex] : true;
      });
    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
var UUID_KEY = '__DC_STAT_UUID';
var deviceId;
function useDeviceId(result) {
  deviceId = deviceId || wx.getStorageSync(UUID_KEY);
  if (!deviceId) {
    deviceId = Date.now() + '' + Math.floor(Math.random() * 1e7);
    wx.setStorage({
      key: UUID_KEY,
      data: deviceId
    });
  }
  result.deviceId = deviceId;
}
function addSafeAreaInsets(result) {
  if (result.safeArea) {
    var safeArea = result.safeArea;
    result.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: result.windowWidth - safeArea.right,
      bottom: result.screenHeight - safeArea.bottom
    };
  }
}
function getOSInfo(system, platform) {
  /**
   * system 枚举值说明：
   *
   * weixin: 操作系统及版本
   * qq: 操作系统及版本
   * kuaishou: 操作系统及版本
   *
   * alipay、dingding: 系统版本
   * baidu: 操作系统版本
   * toutiao/douyin: 操作系统版本
   * jd: 操作系统版本
   * harmony: 操作系统版本
   *
   * lark: 文档无此字段
   */
  var osName = '';
  var osVersion = '';
  if (platform && "mp-weixin" === 'mp-harmony') {
    osName = platform;
    osVersion = system;
    system = "".concat(osName, " ").concat(osVersion);
  } else {
    {
      osName = platform;
    }
    osVersion = system.split(' ')[1] || '';
  }
  osName = osName.toLocaleLowerCase();
  switch (osName) {
    case 'harmony': // alipay
    case 'ohos': // weixin harmony
    case 'openharmonyos': // weixin 由 HarmonyOS 改为了 OpenHarmonyOS
    case 'openharmony':
      // feishu
      osName = 'harmonyos';
      break;
    case 'iphone os':
      // alipay
      osName = 'ios';
      break;
    case 'mac': // weixin qq
    case 'darwin':
      // feishu
      osName = 'macos';
      break;
    case 'windows_nt':
      // feishu
      osName = 'windows';
      break;
  }
  return {
    osName: osName,
    osVersion: osVersion,
    system: system
  };
}
function getPlatform(platform) {
  /**
   * platform 枚举值说明：
   *
   * weixin：ios、android、windows、mac、ohos、ohos_pc、devtools
   * alipay、dingding：Android，iOS / iPhone OS，Harmony
   * harmony: 固定 ohos
   *
   * toutiao: Android，iOS 无 harmony 平台，暂不处理
   * lark: 'pc' | 'mobile' | 'android' | 'ios', 无 harmony 平台，暂不处理
   *
   * baidu：无相关描述
   * qq: 无相关描述
   * kuaishou: 无相关描述
   * jd: 无相关描述
   */
  platform = platform.toLowerCase();
  {
    if (platform === 'ohos') {
      platform = 'harmonyos';
    }
  }
  return platform;
}
function populateParameters(result) {
  var _result$brand = result.brand,
    brand = _result$brand === void 0 ? '' : _result$brand,
    _result$model = result.model,
    model = _result$model === void 0 ? '' : _result$model,
    _result$system = result.system,
    system = _result$system === void 0 ? '' : _result$system,
    _result$language = result.language,
    language = _result$language === void 0 ? '' : _result$language,
    theme = result.theme,
    version = result.version,
    platform = result.platform,
    fontSizeSetting = result.fontSizeSetting,
    SDKVersion = result.SDKVersion,
    pixelRatio = result.pixelRatio,
    deviceOrientation = result.deviceOrientation;
  // const isQuickApp = "mp-weixin".indexOf('quickapp-webview') !== -1

  var extraParam = {};

  // osName osVersion
  var _getOSInfo = getOSInfo(system, platform),
    osName = _getOSInfo.osName,
    osVersion = _getOSInfo.osVersion,
    updatedSystem = _getOSInfo.system;
  var hostVersion = version;

  // deviceType
  var deviceType = getGetDeviceType(result, model);

  // deviceModel
  var deviceBrand = getDeviceBrand(brand);

  // hostName
  var _hostName = getHostName(result);

  // deviceOrientation
  var _deviceOrientation = deviceOrientation; // 仅 微信 百度 支持

  // devicePixelRatio
  var _devicePixelRatio = pixelRatio;

  // SDKVersion
  var _SDKVersion = SDKVersion;

  // hostLanguage
  var hostLanguage = (language || '').replace(/_/g, '-');

  // wx.getAccountInfoSync

  var parameters = {
    appId: "",
    appName: "梦幻衣橱",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "5.24",
    uniCompilerVersion: "5.24",
    uniRuntimeVersion: "5.24",
    uniPlatform: undefined || "mp-weixin",
    deviceBrand: deviceBrand,
    deviceModel: model,
    deviceType: deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName: osName.toLocaleLowerCase(),
    osVersion: osVersion,
    hostTheme: theme,
    hostVersion: hostVersion,
    hostLanguage: hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    platform: getPlatform(platform),
    system: updatedSystem,
    // TODO
    osLanguage: undefined,
    osTheme: undefined,
    ua: undefined,
    hostPackageName: undefined,
    browserName: undefined,
    browserVersion: undefined,
    isUniAppX: false
  };
  Object.assign(result, parameters, extraParam);
}
function getGetDeviceType(result, model) {
  var platform = result.platform || '';
  var deviceType = result.deviceType || 'phone';
  {
    var deviceTypeMaps = {
      ipad: 'pad',
      windows: 'pc',
      mac: 'pc',
      linux: 'pc',
      pc: 'pc'
    };
    var deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    var _model = model.toLocaleLowerCase();
    for (var index = 0; index < deviceTypeMapsKeys.length; index++) {
      var _m = deviceTypeMapsKeys[index];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  {
    if (platform === 'ohos_pc') {
      deviceType = 'pc';
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  var deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = brand.toLocaleLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale$1 ? getLocale$1() : defaultLanguage;
}
function getHostName(result) {
  var _platform = 'WeChat';
  var _hostName = result.hostName || _platform; // mp-jd
  {
    if (result.environment) {
      _hostName = result.environment;
    } else if (result.host && result.host.env) {
      _hostName = result.host.env;
    }
  }
  return _hostName;
}
var getSystemInfo = {
  returnValue: function returnValue(result) {
    useDeviceId(result);
    addSafeAreaInsets(result);
    populateParameters(result);
  }
};
var showActionSheet = {
  args: function args(fromArgs) {
    if ((0, _typeof2.default)(fromArgs) === 'object') {
      fromArgs.alertText = fromArgs.title;
    }
  }
};
var getAppBaseInfo = {
  returnValue: function returnValue(result) {
    var _result = result,
      version = _result.version,
      language = _result.language,
      SDKVersion = _result.SDKVersion,
      theme = _result.theme;
    var _hostName = getHostName(result);
    var hostLanguage = (language || '').replace('_', '-');
    var parameters = {
      appId: "",
      appName: "梦幻衣橱",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage),
      hostVersion: version,
      hostLanguage: hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme,
      isUniAppX: false,
      uniPlatform: undefined || "mp-weixin",
      uniCompileVersion: "5.24",
      uniCompilerVersion: "5.24",
      uniRuntimeVersion: "5.24"
    };
    try {
      if (typeof wx.getAccountInfoSync === 'function') {
        parameters.packagename = wx.getAccountInfoSync().miniProgram.appId;
      }
    } catch (e) {}
    result = Object.assign(result, parameters);
  }
};

/**
 * 目前仅 weixin、toutiao/douyin 支持 deviceInfo。
 * system: 操作系统及版本
 */
var getDeviceInfo = {
  returnValue: function returnValue(result) {
    var _result2 = result,
      brand = _result2.brand,
      model = _result2.model,
      _result2$system = _result2.system,
      system = _result2$system === void 0 ? '' : _result2$system,
      _result2$platform = _result2.platform,
      platform = _result2$platform === void 0 ? '' : _result2$platform;
    var deviceType = getGetDeviceType(result, model);
    var deviceBrand = getDeviceBrand(brand);
    useDeviceId(result);
    var _getOSInfo2 = getOSInfo(system, platform),
      osName = _getOSInfo2.osName,
      osVersion = _getOSInfo2.osVersion;
    result = Object.assign(result, {
      deviceType: deviceType,
      deviceBrand: deviceBrand,
      deviceModel: model,
      osName: osName,
      osVersion: osVersion,
      platform: getPlatform(platform)
    });
  }
};
var getWindowInfo = {
  returnValue: function returnValue(result) {
    addSafeAreaInsets(result);
    result = Object.assign(result, {
      windowTop: 0,
      windowBottom: 0
    });
  }
};
var getAppAuthorizeSetting = {
  returnValue: function returnValue(result) {
    var locationReducedAccuracy = result.locationReducedAccuracy;
    result.locationAccuracy = 'unsupported';
    if (locationReducedAccuracy === true) {
      result.locationAccuracy = 'reduced';
    } else if (locationReducedAccuracy === false) {
      result.locationAccuracy = 'full';
    }
  }
};

// import navigateTo from 'uni-helpers/navigate-to'

var compressImage = {
  args: function args(fromArgs) {
    // https://developers.weixin.qq.com/community/develop/doc/000c08940c865011298e0a43256800?highLine=compressHeight
    if (fromArgs.compressedHeight && !fromArgs.compressHeight) {
      fromArgs.compressHeight = fromArgs.compressedHeight;
    }
    if (fromArgs.compressedWidth && !fromArgs.compressWidth) {
      fromArgs.compressWidth = fromArgs.compressedWidth;
    }
  }
};
var protocols = {
  redirectTo: redirectTo,
  // navigateTo,  // 由于在微信开发者工具的页面参数，会显示__id__参数，因此暂时关闭mp-weixin对于navigateTo的AOP
  previewImage: previewImage,
  getSystemInfo: getSystemInfo,
  getSystemInfoSync: getSystemInfo,
  showActionSheet: showActionSheet,
  getAppBaseInfo: getAppBaseInfo,
  getDeviceInfo: getDeviceInfo,
  getWindowInfo: getWindowInfo,
  getAppAuthorizeSetting: getAppAuthorizeSetting,
  compressImage: compressImage
};
var todos = ['vibrate', 'preloadPage', 'unPreloadPage', 'loadSubPackage'];
var canIUses = [];
var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];
function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}
function processArgs(methodName, fromArgs) {
  var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {
    // 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {
          // 不支持的参数
          console.warn("The '".concat(methodName, "' method of platform '\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F' does not support option '").concat(key, "'"));
        } else if (isStr(keyOption)) {
          // 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {
          // {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        if (isFn(fromArgs[key])) {
          toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
        }
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}
function processReturnValue(methodName, res, returnValue) {
  var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {
    // 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}
function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {
      // 暂不支持的 api
      return function () {
        console.error("Platform '\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F' does not support '".concat(methodName, "'."));
      };
    }
    return function (arg1, arg2) {
      // 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      if (isFn(options.name)) {
        methodName = options.name(arg1);
      } else if (isStr(options.name)) {
        methodName = options.name;
      }
      var returnValue = wx[methodName].apply(wx, args);
      if (isSyncApi(methodName)) {
        // 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}
var todoApis = Object.create(null);
var TODOS = ['onTabBarMidButtonTap', 'subscribePush', 'unsubscribePush', 'onPush', 'offPush', 'share'];
function createTodoApi(name) {
  return function todoApi(_ref) {
    var fail = _ref.fail,
      complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail method '").concat(name, "' not supported")
    };
    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}
TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});
var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin']
};
function getProvider(_ref2) {
  var service = _ref2.service,
    success = _ref2.success,
    fail = _ref2.fail,
    complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service]
    };
    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail service not found'
    };
    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}
var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider
});
var getEmitter = function () {
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();
function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}
function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}
var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit
});

/**
 * 框架内 try-catch
 */
/**
 * 开发者 try-catch
 */
function tryCatch(fn) {
  return function () {
    try {
      return fn.apply(fn, arguments);
    } catch (e) {
      // TODO
      console.error(e);
    }
  };
}
function getApiCallbacks(params) {
  var apiCallbacks = {};
  for (var name in params) {
    var param = params[name];
    if (isFn(param)) {
      apiCallbacks[name] = tryCatch(param);
      delete params[name];
    }
  }
  return apiCallbacks;
}
var cid;
var cidErrMsg;
var enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e) {}
  return message;
}
function invokePushCallback(args) {
  if (args.type === 'enabled') {
    enabled = true;
  } else if (args.type === 'clientId') {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === 'pushMsg') {
    var message = {
      type: 'receive',
      data: normalizePushMessage(args.message)
    };
    for (var i = 0; i < onPushMessageCallbacks.length; i++) {
      var callback = onPushMessageCallbacks[i];
      callback(message);
      // 该消息已被阻止
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === 'click') {
    onPushMessageCallbacks.forEach(function (callback) {
      callback({
        type: 'click',
        data: normalizePushMessage(args.message)
      });
    });
  }
}
var getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid, errMsg) {
  getPushCidCallbacks.forEach(function (callback) {
    callback(cid, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
function getPushClientId(args) {
  if (!isPlainObject(args)) {
    args = {};
  }
  var _getApiCallbacks = getApiCallbacks(args),
    success = _getApiCallbacks.success,
    fail = _getApiCallbacks.fail,
    complete = _getApiCallbacks.complete;
  var hasSuccess = isFn(success);
  var hasFail = isFn(fail);
  var hasComplete = isFn(complete);
  Promise.resolve().then(function () {
    if (typeof enabled === 'undefined') {
      enabled = false;
      cid = '';
      cidErrMsg = 'uniPush is not enabled';
    }
    getPushCidCallbacks.push(function (cid, errMsg) {
      var res;
      if (cid) {
        res = {
          errMsg: 'getPushClientId:ok',
          cid: cid
        };
        hasSuccess && success(res);
      } else {
        res = {
          errMsg: 'getPushClientId:fail' + (errMsg ? ' ' + errMsg : '')
        };
        hasFail && fail(res);
      }
      hasComplete && complete(res);
    });
    if (typeof cid !== 'undefined') {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
}
var onPushMessageCallbacks = [];
// 不使用 defineOnApi 实现，是因为 defineOnApi 依赖 UniServiceJSBridge ，该对象目前在小程序上未提供，故简单实现
var onPushMessage = function onPushMessage(fn) {
  if (onPushMessageCallbacks.indexOf(fn) === -1) {
    onPushMessageCallbacks.push(fn);
  }
};
var offPushMessage = function offPushMessage(fn) {
  if (!fn) {
    onPushMessageCallbacks.length = 0;
  } else {
    var index = onPushMessageCallbacks.indexOf(fn);
    if (index > -1) {
      onPushMessageCallbacks.splice(index, 1);
    }
  }
};
function __f__(type) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }
  console[type].apply(console, args);
}
var baseInfo = wx.getAppBaseInfo && wx.getAppBaseInfo();
if (!baseInfo) {
  baseInfo = wx.getSystemInfoSync();
}
var host = baseInfo ? baseInfo.host : null;
var shareVideoMessage = host && host.env === 'SAAASDK' ? wx.miniapp.shareVideoMessage : wx.shareVideoMessage;
var api = /*#__PURE__*/Object.freeze({
  __proto__: null,
  shareVideoMessage: shareVideoMessage,
  getPushClientId: getPushClientId,
  onPushMessage: onPushMessage,
  offPushMessage: offPushMessage,
  invokePushCallback: invokePushCallback,
  __f__: __f__
});
var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];
function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
function initBehavior(options) {
  return Behavior(options);
}
function isPage() {
  return !!this.route;
}
function initRelation(detail) {
  this.triggerEvent('__l', detail);
}
function selectAllComponents(mpInstance, selector, $refs) {
  var components = mpInstance.selectAllComponents(selector) || [];
  components.forEach(function (component) {
    var ref = component.dataset.ref;
    $refs[ref] = component.$vm || toSkip(component);
    {
      if (component.dataset.vueGeneric === 'scoped') {
        component.selectAllComponents('.scoped-ref').forEach(function (scopedComponent) {
          selectAllComponents(scopedComponent, selector, $refs);
        });
      }
    }
  });
}
function syncRefs(refs, newRefs) {
  var oldKeys = (0, _construct2.default)(Set, (0, _toConsumableArray2.default)(Object.keys(refs)));
  var newKeys = Object.keys(newRefs);
  newKeys.forEach(function (key) {
    var oldValue = refs[key];
    var newValue = newRefs[key];
    if (Array.isArray(oldValue) && Array.isArray(newValue) && oldValue.length === newValue.length && newValue.every(function (value) {
      return oldValue.includes(value);
    })) {
      return;
    }
    refs[key] = newValue;
    oldKeys.delete(key);
  });
  oldKeys.forEach(function (key) {
    delete refs[key];
  });
  return refs;
}
function initRefs(vm) {
  var mpInstance = vm.$scope;
  var refs = {};
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      selectAllComponents(mpInstance, '.vue-ref', $refs);
      // TODO 暂不考虑 for 中的 scoped
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for') || [];
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || toSkip(component));
      });
      return syncRefs(refs, $refs);
    }
  });
}
function handleLink(event) {
  var _ref3 = event.detail || event.value,
    vuePid = _ref3.vuePid,
    vueOptions = _ref3.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  vueOptions.parent = parentVm;
}
function markMPComponent(component) {
  // 在 Vue 中标记为小程序组件
  var IS_MP = '__v_isMPComponent';
  Object.defineProperty(component, IS_MP, {
    configurable: true,
    enumerable: false,
    value: true
  });
  return component;
}
function toSkip(obj) {
  var OB = '__ob__';
  var SKIP = '__v_skip';
  if (isObject(obj) && Object.isExtensible(obj)) {
    // 避免被 @vue/composition-api 观测
    Object.defineProperty(obj, OB, {
      configurable: true,
      enumerable: false,
      value: (0, _defineProperty2.default)({}, SKIP, true)
    });
  }
  return obj;
}
var WORKLET_RE = /_(.*)_worklet_factory_/;
function initWorkletMethods(mpMethods, vueMethods) {
  if (vueMethods) {
    Object.keys(vueMethods).forEach(function (name) {
      var matches = name.match(WORKLET_RE);
      if (matches) {
        var workletName = matches[1];
        mpMethods[name] = vueMethods[name];
        mpMethods[workletName] = vueMethods[workletName];
      }
    });
  }
}
var MPPage = Page;
var MPComponent = Component;
var customizeRE = /:/g;
var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});
function initTriggerEvent(mpInstance) {
  var oldTriggerEvent = mpInstance.triggerEvent;
  var newTriggerEvent = function newTriggerEvent(event) {
    for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }
    // 事件名统一转驼峰格式，仅处理：当前组件为 vue 组件、当前组件为 vue 组件子组件
    if (this.$vm || this.dataset && this.dataset.comType) {
      event = customize(event);
    } else {
      // 针对微信/QQ小程序单独补充驼峰格式事件，以兼容历史项目
      var newEvent = customize(event);
      if (newEvent !== event) {
        oldTriggerEvent.apply(this, [newEvent].concat(args));
      }
    }
    return oldTriggerEvent.apply(this, [event].concat(args));
  };
  try {
    // 京东小程序 triggerEvent 为只读
    mpInstance.triggerEvent = newTriggerEvent;
  } catch (error) {
    mpInstance._triggerEvent = newTriggerEvent;
  }
}
function initHook(name, options, isComponent) {
  var oldHook = options[name];
  options[name] = function () {
    markMPComponent(this);
    initTriggerEvent(this);
    if (oldHook) {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      return oldHook.apply(this, args);
    }
  };
}
if (!MPPage.__$wrappered) {
  MPPage.__$wrappered = true;
  Page = function Page() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    initHook('onLoad', options);
    return MPPage(options);
  };
  Page.after = MPPage.after;
  Component = function Component() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    initHook('created', options);
    return MPComponent(options);
  };
}
var PAGE_EVENT_HOOKS = ['onPullDownRefresh', 'onReachBottom', 'onAddToFavorites', 'onShareTimeline', 'onShareAppMessage', 'onPageScroll', 'onResize', 'onTabItemTap'];
function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}
function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }
  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }
  vueOptions = vueOptions.default || vueOptions;
  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super && vueOptions.super.options && Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }
  if (isFn(vueOptions[hook]) || Array.isArray(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {
      return hasHook(hook, mixin);
    });
  }
}
function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}
function initUnknownHooks(mpOptions, vueOptions) {
  var excludes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  findHooks(vueOptions).forEach(function (hook) {
    return initHook$1(mpOptions, hook, excludes);
  });
}
function findHooks(vueOptions) {
  var hooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (vueOptions) {
    Object.keys(vueOptions).forEach(function (name) {
      if (name.indexOf('on') === 0 && isFn(vueOptions[name])) {
        hooks.push(name);
      }
    });
  }
  return hooks;
}
function initHook$1(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn(mpOptions, hook)) {
    mpOptions[hook] = function (args) {
      return this.$vm && this.$vm.__call_hook(hook, args);
    };
  }
}
function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  vueOptions = VueComponent.options;
  return [VueComponent, vueOptions];
}
function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}
function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;
  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}
function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};
  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"梦幻衣橱","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }
  if (!isPlainObject(data)) {
    data = {};
  }
  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });
  return data;
}
var PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions.behaviors;
  var vueExtends = vueOptions.extends;
  var vueMixins = vueOptions.mixins;
  var vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps.name = {
            type: String,
            default: ''
          };
          vueProps.value = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ''
          };
        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(initBehavior({
      properties: initProperties(vueExtends.props, true)
    }));
  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(initBehavior({
          properties: initProperties(vueMixin.props, true)
        }));
      }
    });
  }
  return behaviors;
}
function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}
function initProperties(props) {
  var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var options = arguments.length > 3 ? arguments[3] : undefined;
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: ''
    };
    {
      if (options.virtualHost) {
        properties.virtualHostStyle = {
          type: null,
          value: ''
        };
        properties.virtualHostClass = {
          type: null,
          value: ''
        };
      }
    }
    // scopedSlotsCompiler auto
    properties.scopedSlotsCompiler = {
      type: String,
      value: ''
    };
    properties.vueSlots = {
      // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots
        });
      }
    };
  }
  if (Array.isArray(props)) {
    // ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key)
      };
    });
  } else if (isPlainObject(props)) {
    // {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {
        // title:{type:String,default:''}
        var value = opts.default;
        if (isFn(value)) {
          value = value();
        }
        opts.type = parsePropType(key, opts.type);
        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key)
        };
      } else {
        // content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key)
        };
      }
    });
  }
  return properties;
}
function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}
  event.stopPropagation = noop;
  event.preventDefault = noop;
  event.target = event.target || {};
  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }
  if (hasOwn(event, 'markerId')) {
    event.detail = (0, _typeof2.default)(event.detail) === 'object' ? event.detail : {};
    event.detail.markerId = event.markerId;
  }
  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }
  return event;
}
function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {
      // ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];
      var vFor;
      if (Number.isInteger(dataPath)) {
        vFor = dataPath;
      } else if (!dataPath) {
        vFor = context;
      } else if (typeof dataPath === 'string' && dataPath) {
        if (dataPath.indexOf('#s#') === 0) {
          vFor = dataPath.substr(3);
        } else {
          vFor = vm.__get_value(dataPath, context);
        }
      }
      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }
      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}
function processEventExtra(vm, extra, event, __args__) {
  var extraObj = {};
  if (Array.isArray(extra) && extra.length) {
    /**
     *[
     *    ['data.items', 'data.id', item.data.id],
     *    ['metas', 'id', meta.id]
     *],
     *[
     *    ['data.items', 'data.id', item.data.id],
     *    ['metas', 'id', meta.id]
     *],
     *'test'
     */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {
          // model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {
            // $event
            extraObj['$' + index] = event;
          } else if (dataPath === 'arguments') {
            extraObj['$' + index] = event.detail ? event.detail.__args__ || __args__ : __args__;
          } else if (dataPath.indexOf('$event.') === 0) {
            // $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }
  return extraObj;
}
function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}
function processEventArgs(vm, event) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var isCustom = arguments.length > 4 ? arguments[4] : undefined;
  var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象

  // fixed 用户直接触发 mpInstance.triggerEvent
  var __args__ = isPlainObject(event.detail) ? event.detail.__args__ || [event.detail] : [event.detail];
  if (isCustom) {
    // 自定义事件
    isCustomMPEvent = event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {
      // 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return __args__;
    }
  }
  var extraObj = processEventExtra(vm, extra, event, __args__);
  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {
        // input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(__args__[0]);
        } else {
          // wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });
  return ret;
}
var ONCE = '~';
var CUSTOM = '^';
function isMatchEventType(eventType, optType) {
  return eventType === optType || optType === 'regionchange' && (eventType === 'begin' || eventType === 'end');
}
function getContextVm(vm) {
  var $parent = vm.$parent;
  // 父组件是 scoped slots 或者其他自定义组件时继续查找
  while ($parent && $parent.$parent && ($parent.$options.generic || $parent.$parent.$options.generic || $parent.$scope._$vuePid)) {
    $parent = $parent.$parent;
  }
  return $parent && $parent.$parent;
}
function handleEvent(event) {
  var _this2 = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn('事件信息不存在');
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn('事件信息不存在');
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;
  var ret = [];
  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];
    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;
    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this2.$vm;
          if (handlerCtx.$options.generic) {
            // mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = getContextVm(handlerCtx) || handlerCtx;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx, processEventArgs(_this2.$vm, event, eventArray[1], eventArray[2], isCustom, methodName));
            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            var _type = _this2.$vm.mpType === 'page' ? 'Page' : 'Component';
            var path = _this2.route || _this2.is;
            throw new Error("".concat(_type, " \"").concat(path, "\" does not have a method \"").concat(methodName, "\""));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          var params = processEventArgs(_this2.$vm, event, eventArray[1], eventArray[2], isCustom, methodName);
          params = Array.isArray(params) ? params : [];
          // 参数尾部增加原始事件对象用于复杂表达式内获取额外数据
          if (/=\s*\S+\.eventParams\s*\|\|\s*\S+\[['"]event-params['"]\]/.test(handler.toString())) {
            // eslint-disable-next-line no-sparse-arrays
            params = params.concat([,,,,,,,,,, event]);
          }
          ret.push(handler.apply(handlerCtx, params));
        }
      });
    }
  });
  if (eventType === 'input' && ret.length === 1 && typeof ret[0] !== 'undefined') {
    return ret[0];
  }
}
var eventChannels = {};
function getEventChannel(id) {
  var eventChannel = eventChannels[id];
  delete eventChannels[id];
  return eventChannel;
}
var hooks = ['onShow', 'onHide', 'onError', 'onPageNotFound', 'onThemeChange', 'onUnhandledRejection'];
function initEventChannel() {
  _vue.default.prototype.getOpenerEventChannel = function () {
    // 微信小程序使用自身getOpenerEventChannel
    {
      return this.$scope.getOpenerEventChannel();
    }
  };
  var callHook = _vue.default.prototype.__call_hook;
  _vue.default.prototype.__call_hook = function (hook, args) {
    if (hook === 'onLoad' && args && args.__id__) {
      this.__eventChannel__ = getEventChannel(args.__id__);
      delete args.__id__;
    }
    return callHook.call(this, hook, args);
  };
}
function initScopedSlotsParams() {
  var center = {};
  var parents = {};
  function currentId(fn) {
    var vueIds = this.$options.propsData.vueId;
    if (vueIds) {
      var vueId = vueIds.split(',')[0];
      fn(vueId);
    }
  }
  _vue.default.prototype.$hasSSP = function (vueId) {
    var slot = center[vueId];
    if (!slot) {
      parents[vueId] = this;
      this.$on('hook:destroyed', function () {
        delete parents[vueId];
      });
    }
    return slot;
  };
  _vue.default.prototype.$getSSP = function (vueId, name, needAll) {
    var slot = center[vueId];
    if (slot) {
      var params = slot[name] || [];
      if (needAll) {
        return params;
      }
      return params[0];
    }
  };
  _vue.default.prototype.$setSSP = function (name, value) {
    var index = 0;
    currentId.call(this, function (vueId) {
      var slot = center[vueId];
      var params = slot[name] = slot[name] || [];
      params.push(value);
      index = params.length - 1;
    });
    return index;
  };
  _vue.default.prototype.$initSSP = function () {
    currentId.call(this, function (vueId) {
      center[vueId] = {};
    });
  };
  _vue.default.prototype.$callSSP = function () {
    currentId.call(this, function (vueId) {
      if (parents[vueId]) {
        parents[vueId].$forceUpdate();
      }
    });
  };
  _vue.default.mixin({
    destroyed: function destroyed() {
      var propsData = this.$options.propsData;
      var vueId = propsData && propsData.vueId;
      if (vueId) {
        delete center[vueId];
        delete parents[vueId];
      }
    }
  });
}
function parseBaseApp(vm, _ref4) {
  var mocks = _ref4.mocks,
    initRefs = _ref4.initRefs;
  initEventChannel();
  {
    initScopedSlotsParams();
  }
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }
  uniIdMixin(_vue.default);
  _vue.default.prototype.mpHost = "mp-weixin";
  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }
      this.mpType = this.$options.mpType;
      this.$mp = (0, _defineProperty2.default)({
        data: {}
      }, this.mpType, this.$options.mpInstance);
      this.$scope = this.$options.mpInstance;
      delete this.$options.mpType;
      delete this.$options.mpInstance;
      if (this.mpType === 'page' && typeof getApp === 'function') {
        // hack vue-i18n
        var app = getApp();
        if (app.$vm && app.$vm.$i18n) {
          this._i18n = app.$vm.$i18n;
        }
      }
      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    }
  });
  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {
        // 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (wx.canIUse && !wx.canIUse('nextTick')) {
          // 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }
      this.$vm = vm;
      this.$vm.$mp = {
        app: this
      };
      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;
      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);
      this.$vm.__call_hook('onLaunch', args);
    }
  };

  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }
  initAppLocale(_vue.default, vm, getLocaleLanguage$1());
  initHooks(appOptions, hooks);
  initUnknownHooks(appOptions, vm.$options);
  return appOptions;
}
function getLocaleLanguage$1() {
  var localeLanguage = '';
  {
    var appBaseInfo = wx.getAppBaseInfo();
    var language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs
  });
}
function createApp(vm) {
  App(parseApp(vm));
  return vm;
}
var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function encodeReserveReplacer(c) {
  return '%' + c.charCodeAt(0).toString(16);
};
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function encode(str) {
  return encodeURIComponent(str).replace(encodeReserveRE, encodeReserveReplacer).replace(commaRE, ',');
};
function stringifyQuery(obj) {
  var encodeStr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : encode;
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];
    if (val === undefined) {
      return '';
    }
    if (val === null) {
      return encodeStr(key);
    }
    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return;
        }
        if (val2 === null) {
          result.push(encodeStr(key));
        } else {
          result.push(encodeStr(key) + '=' + encodeStr(val2));
        }
      });
      return result.join('&');
    }
    return encodeStr(key) + '=' + encodeStr(val);
  }).filter(function (x) {
    return x.length > 0;
  }).join('&') : null;
  return res ? "?".concat(res) : '';
}
function parseBaseComponent(vueComponentOptions) {
  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    isPage = _ref5.isPage,
    initRelation = _ref5.initRelation;
  var needVueOptions = arguments.length > 2 ? arguments[2] : undefined;
  var _initVueComponent = initVueComponent(_vue.default, vueComponentOptions),
    _initVueComponent2 = (0, _slicedToArray2.default)(_initVueComponent, 2),
    VueComponent = _initVueComponent2[0],
    vueOptions = _initVueComponent2[1];
  var options = _objectSpread({
    multipleSlots: true,
    // styleIsolation: 'apply-shared',
    addGlobalClass: true
  }, vueOptions.options || {});
  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin'].options) {
      Object.assign(options, vueOptions['mp-weixin'].options);
    }
  }
  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file, options),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;
        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties
        };
        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options
        });

        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm && this.$vm.$destroy();
      }
    },
    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      }
    },
    methods: {
      __l: handleLink,
      __e: handleEvent
    }
  };
  // externalClasses
  if (vueOptions.externalClasses) {
    componentOptions.externalClasses = vueOptions.externalClasses;
  }
  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }
  if (needVueOptions) {
    return [componentOptions, vueOptions, VueComponent];
  }
  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}
function parseComponent(vueComponentOptions, needVueOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation
  }, needVueOptions);
}
var hooks$1 = ['onShow', 'onHide', 'onUnload'];
hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);
function parseBasePage(vuePageOptions) {
  var _parseComponent = parseComponent(vuePageOptions, true),
    _parseComponent2 = (0, _slicedToArray2.default)(_parseComponent, 2),
    pageOptions = _parseComponent2[0],
    vueOptions = _parseComponent2[1];
  initHooks(pageOptions.methods, hooks$1, vueOptions);
  pageOptions.methods.onLoad = function (query) {
    this.options = query;
    var copyQuery = Object.assign({}, query);
    delete copyQuery.__id__;
    this.$page = {
      fullPath: '/' + (this.route || this.is) + stringifyQuery(copyQuery)
    };
    this.$vm.$mp.query = query; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', query);
  };
  {
    initUnknownHooks(pageOptions.methods, vuePageOptions, ['onReady']);
  }
  {
    initWorkletMethods(pageOptions.methods, vueOptions.methods);
  }
  return pageOptions;
}
function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions);
}
function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}
function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}
function createSubpackageApp(vm) {
  var appOptions = parseApp(vm);
  var app = getApp({
    allowDefault: true
  });
  vm.$scope = app;
  var globalData = app.globalData;
  if (globalData) {
    Object.keys(appOptions.globalData).forEach(function (name) {
      if (!hasOwn(globalData, name)) {
        globalData[name] = appOptions.globalData[name];
      }
    });
  }
  Object.keys(appOptions).forEach(function (name) {
    if (!hasOwn(app, name)) {
      app[name] = appOptions[name];
    }
  });
  if (isFn(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow(function () {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      vm.__call_hook('onShow', args);
    });
  }
  if (isFn(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide(function () {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }
      vm.__call_hook('onHide', args);
    });
  }
  if (isFn(appOptions.onLaunch)) {
    var args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    vm.__call_hook('onLaunch', args);
  }
  return vm;
}
function createPlugin(vm) {
  var appOptions = parseApp(vm);
  if (isFn(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow(function () {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }
      vm.__call_hook('onShow', args);
    });
  }
  if (isFn(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide(function () {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }
      vm.__call_hook('onHide', args);
    });
  }
  if (isFn(appOptions.onLaunch)) {
    var args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    vm.__call_hook('onLaunch', args);
  }
  return vm;
}
todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});
canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name : canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});
var uni = {};
if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (hasOwn(target, name)) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    }
  });
} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });
  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, extraApi[name]);
    });
  }
  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });
  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });
  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}
wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;
wx.createSubpackageApp = createSubpackageApp;
wx.createPlugin = createPlugin;
var uni$1 = uni;
var _default = uni$1;
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 5 */
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles.js */ 6);
var iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit.js */ 7);
var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ 8);
var nonIterableRest = __webpack_require__(/*! ./nonIterableRest.js */ 10);
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 6 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 7 */
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0) {
        ;
      }
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 8 */
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ 9);
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 9 */
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayLikeToArray.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 10 */
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 11 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ 12);
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 12 */
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPropertyKey.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
var toPrimitive = __webpack_require__(/*! ./toPrimitive.js */ 14);
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 13 */
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(o) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 14 */
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPrimitive.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 15 */
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/construct.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ 16);
var isNativeReflectConstruct = __webpack_require__(/*! ./isNativeReflectConstruct.js */ 17);
function _construct(t, e, r) {
  if (isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && setPrototypeOf(p, r.prototype), p;
}
module.exports = _construct, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 16 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 17 */
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/isNativeReflectConstruct.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (module.exports = _isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports)();
}
module.exports = _isNativeReflectConstruct, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 18 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(/*! ./arrayWithoutHoles.js */ 19);
var iterableToArray = __webpack_require__(/*! ./iterableToArray.js */ 20);
var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ 8);
var nonIterableSpread = __webpack_require__(/*! ./nonIterableSpread.js */ 21);
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 19 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ 9);
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 20 */
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 21 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 22 */
/*!*************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-i18n/dist/uni-i18n.es.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, global) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOCALE_ZH_HANT = exports.LOCALE_ZH_HANS = exports.LOCALE_FR = exports.LOCALE_ES = exports.LOCALE_EN = exports.I18n = exports.Formatter = void 0;
exports.compileI18nJsonStr = compileI18nJsonStr;
exports.hasI18nJson = hasI18nJson;
exports.initVueI18n = initVueI18n;
exports.isI18nStr = isI18nStr;
exports.isString = void 0;
exports.normalizeLocale = normalizeLocale;
exports.parseI18nJson = parseI18nJson;
exports.resolveLocale = resolveLocale;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ 23));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ 24));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var isObject = function isObject(val) {
  return val !== null && (0, _typeof2.default)(val) === 'object';
};
var defaultDelimiters = ['{', '}'];
var BaseFormatter = /*#__PURE__*/function () {
  function BaseFormatter() {
    (0, _classCallCheck2.default)(this, BaseFormatter);
    this._caches = Object.create(null);
  }
  (0, _createClass2.default)(BaseFormatter, [{
    key: "interpolate",
    value: function interpolate(message, values) {
      var delimiters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultDelimiters;
      if (!values) {
        return [message];
      }
      var tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }]);
  return BaseFormatter;
}();
exports.Formatter = BaseFormatter;
var RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
var RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
function parse(format, _ref) {
  var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
    startDelimiter = _ref2[0],
    endDelimiter = _ref2[1];
  var tokens = [];
  var position = 0;
  var text = '';
  while (position < format.length) {
    var char = format[position++];
    if (char === startDelimiter) {
      if (text) {
        tokens.push({
          type: 'text',
          value: text
        });
      }
      text = '';
      var sub = '';
      char = format[position++];
      while (char !== undefined && char !== endDelimiter) {
        sub += char;
        char = format[position++];
      }
      var isClosed = char === endDelimiter;
      var type = RE_TOKEN_LIST_VALUE.test(sub) ? 'list' : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? 'named' : 'unknown';
      tokens.push({
        value: sub,
        type: type
      });
    }
    //  else if (char === '%') {
    //   // when found rails i18n syntax, skip text capture
    //   if (format[position] !== '{') {
    //     text += char
    //   }
    // }
    else {
      text += char;
    }
  }
  text && tokens.push({
    type: 'text',
    value: text
  });
  return tokens;
}
function compile(tokens, values) {
  var compiled = [];
  var index = 0;
  var mode = Array.isArray(values) ? 'list' : isObject(values) ? 'named' : 'unknown';
  if (mode === 'unknown') {
    return compiled;
  }
  while (index < tokens.length) {
    var token = tokens[index];
    switch (token.type) {
      case 'text':
        compiled.push(token.value);
        break;
      case 'list':
        compiled.push(values[parseInt(token.value, 10)]);
        break;
      case 'named':
        if (mode === 'named') {
          compiled.push(values[token.value]);
        } else {
          if (true) {
            console.warn("Type of token '".concat(token.type, "' and format of value '").concat(mode, "' don't match!"));
          }
        }
        break;
      case 'unknown':
        if (true) {
          console.warn("Detect 'unknown' type of token!");
        }
        break;
    }
    index++;
  }
  return compiled;
}
var LOCALE_ZH_HANS = 'zh-Hans';
exports.LOCALE_ZH_HANS = LOCALE_ZH_HANS;
var LOCALE_ZH_HANT = 'zh-Hant';
exports.LOCALE_ZH_HANT = LOCALE_ZH_HANT;
var LOCALE_EN = 'en';
exports.LOCALE_EN = LOCALE_EN;
var LOCALE_FR = 'fr';
exports.LOCALE_FR = LOCALE_FR;
var LOCALE_ES = 'es';
exports.LOCALE_ES = LOCALE_ES;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = function hasOwn(val, key) {
  return hasOwnProperty.call(val, key);
};
var defaultFormatter = new BaseFormatter();
function include(str, parts) {
  return !!parts.find(function (part) {
    return str.indexOf(part) !== -1;
  });
}
function startsWith(str, parts) {
  return parts.find(function (part) {
    return str.indexOf(part) === 0;
  });
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, '-');
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === 'chinese') {
    // 支付宝
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf('zh') === 0) {
    if (locale.indexOf('-hans') > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf('-hant') > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ['-tw', '-hk', '-mo', '-cht'])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  var locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
  if (messages && Object.keys(messages).length > 0) {
    locales = Object.keys(messages);
  }
  var lang = startsWith(locale, locales);
  if (lang) {
    return lang;
  }
}
var I18n = /*#__PURE__*/function () {
  function I18n(_ref3) {
    var locale = _ref3.locale,
      fallbackLocale = _ref3.fallbackLocale,
      messages = _ref3.messages,
      watcher = _ref3.watcher,
      formater = _ref3.formater;
    (0, _classCallCheck2.default)(this, I18n);
    this.locale = LOCALE_EN;
    this.fallbackLocale = LOCALE_EN;
    this.message = {};
    this.messages = {};
    this.watchers = [];
    if (fallbackLocale) {
      this.fallbackLocale = fallbackLocale;
    }
    this.formater = formater || defaultFormatter;
    this.messages = messages || {};
    this.setLocale(locale || LOCALE_EN);
    if (watcher) {
      this.watchLocale(watcher);
    }
  }
  (0, _createClass2.default)(I18n, [{
    key: "setLocale",
    value: function setLocale(locale) {
      var _this = this;
      var oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        // 可能初始化时不存在
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      // 仅发生变化时，通知
      if (oldLocale !== this.locale) {
        this.watchers.forEach(function (watcher) {
          watcher(_this.locale, oldLocale);
        });
      }
    }
  }, {
    key: "getLocale",
    value: function getLocale() {
      return this.locale;
    }
  }, {
    key: "watchLocale",
    value: function watchLocale(fn) {
      var _this2 = this;
      var index = this.watchers.push(fn) - 1;
      return function () {
        _this2.watchers.splice(index, 1);
      };
    }
  }, {
    key: "add",
    value: function add(locale, message) {
      var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach(function (key) {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
  }, {
    key: "f",
    value: function f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join('');
    }
  }, {
    key: "t",
    value: function t(key, locale, values) {
      var message = this.message;
      if (typeof locale === 'string') {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn("Cannot translate the value of keypath ".concat(key, ". Use the value of keypath as default."));
        return key;
      }
      return this.formater.interpolate(message[key], values).join('');
    }
  }]);
  return I18n;
}();
exports.I18n = I18n;
function watchAppLocale(appVm, i18n) {
  // 需要保证 watch 的触发在组件渲染之前
  if (appVm.$watchLocale) {
    // vue2
    appVm.$watchLocale(function (newLocale) {
      i18n.setLocale(newLocale);
    });
  } else {
    appVm.$watch(function () {
      return appVm.$locale;
    }, function (newLocale) {
      i18n.setLocale(newLocale);
    });
  }
}
function getDefaultLocale() {
  if (typeof uni !== 'undefined' && uni.getLocale) {
    return uni.getLocale();
  }
  // 小程序平台，uni 和 uni-i18n 互相引用，导致访问不到 uni，故在 global 上挂了 getLocale
  if (typeof global !== 'undefined' && global.getLocale) {
    return global.getLocale();
  }
  return LOCALE_EN;
}
function initVueI18n(locale) {
  var messages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fallbackLocale = arguments.length > 2 ? arguments[2] : undefined;
  var watcher = arguments.length > 3 ? arguments[3] : undefined;
  // 兼容旧版本入参
  if (typeof locale !== 'string') {
    var _ref4 = [messages, locale];
    locale = _ref4[0];
    messages = _ref4[1];
  }
  if (typeof locale !== 'string') {
    // 因为小程序平台，uni-i18n 和 uni 互相引用，导致此时访问 uni 时，为 undefined
    locale = getDefaultLocale();
  }
  if (typeof fallbackLocale !== 'string') {
    fallbackLocale = typeof __uniConfig !== 'undefined' && __uniConfig.fallbackLocale || LOCALE_EN;
  }
  var i18n = new I18n({
    locale: locale,
    fallbackLocale: fallbackLocale,
    messages: messages,
    watcher: watcher
  });
  var _t = function t(key, values) {
    if (typeof getApp !== 'function') {
      // app view
      /* eslint-disable no-func-assign */
      _t = function t(key, values) {
        return i18n.t(key, values);
      };
    } else {
      var isWatchedAppLocale = false;
      _t = function t(key, values) {
        var appVm = getApp().$vm;
        // 可能$vm还不存在，比如在支付宝小程序中，组件定义较早，在props的default里使用了t()函数（如uni-goods-nav），此时app还未初始化
        // options: {
        // 	type: Array,
        // 	default () {
        // 		return [{
        // 			icon: 'shop',
        // 			text: t("uni-goods-nav.options.shop"),
        // 		}, {
        // 			icon: 'cart',
        // 			text: t("uni-goods-nav.options.cart")
        // 		}]
        // 	}
        // },
        if (appVm) {
          // 触发响应式
          appVm.$locale;
          if (!isWatchedAppLocale) {
            isWatchedAppLocale = true;
            watchAppLocale(appVm, i18n);
          }
        }
        return i18n.t(key, values);
      };
    }
    return _t(key, values);
  };
  return {
    i18n: i18n,
    f: function f(message, values, delimiters) {
      return i18n.f(message, values, delimiters);
    },
    t: function t(key, values) {
      return _t(key, values);
    },
    add: function add(locale, message) {
      var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      return i18n.add(locale, message, override);
    },
    watch: function watch(fn) {
      return i18n.watchLocale(fn);
    },
    getLocale: function getLocale() {
      return i18n.getLocale();
    },
    setLocale: function setLocale(newLocale) {
      return i18n.setLocale(newLocale);
    }
  };
}
var isString = function isString(val) {
  return typeof val === 'string';
};
exports.isString = isString;
var formater;
function hasI18nJson(jsonObj, delimiters) {
  if (!formater) {
    formater = new BaseFormatter();
  }
  return walkJsonObj(jsonObj, function (jsonObj, key) {
    var value = jsonObj[key];
    if (isString(value)) {
      if (isI18nStr(value, delimiters)) {
        return true;
      }
    } else {
      return hasI18nJson(value, delimiters);
    }
  });
}
function parseI18nJson(jsonObj, values, delimiters) {
  if (!formater) {
    formater = new BaseFormatter();
  }
  walkJsonObj(jsonObj, function (jsonObj, key) {
    var value = jsonObj[key];
    if (isString(value)) {
      if (isI18nStr(value, delimiters)) {
        jsonObj[key] = compileStr(value, values, delimiters);
      }
    } else {
      parseI18nJson(value, values, delimiters);
    }
  });
  return jsonObj;
}
function compileI18nJsonStr(jsonStr, _ref5) {
  var locale = _ref5.locale,
    locales = _ref5.locales,
    delimiters = _ref5.delimiters;
  if (!isI18nStr(jsonStr, delimiters)) {
    return jsonStr;
  }
  if (!formater) {
    formater = new BaseFormatter();
  }
  var localeValues = [];
  Object.keys(locales).forEach(function (name) {
    if (name !== locale) {
      localeValues.push({
        locale: name,
        values: locales[name]
      });
    }
  });
  localeValues.unshift({
    locale: locale,
    values: locales[locale]
  });
  try {
    return JSON.stringify(compileJsonObj(JSON.parse(jsonStr), localeValues, delimiters), null, 2);
  } catch (e) {}
  return jsonStr;
}
function isI18nStr(value, delimiters) {
  return value.indexOf(delimiters[0]) > -1;
}
function compileStr(value, values, delimiters) {
  return formater.interpolate(value, values, delimiters).join('');
}
function compileValue(jsonObj, key, localeValues, delimiters) {
  var value = jsonObj[key];
  if (isString(value)) {
    // 存在国际化
    if (isI18nStr(value, delimiters)) {
      jsonObj[key] = compileStr(value, localeValues[0].values, delimiters);
      if (localeValues.length > 1) {
        // 格式化国际化语言
        var valueLocales = jsonObj[key + 'Locales'] = {};
        localeValues.forEach(function (localValue) {
          valueLocales[localValue.locale] = compileStr(value, localValue.values, delimiters);
        });
      }
    }
  } else {
    compileJsonObj(value, localeValues, delimiters);
  }
}
function compileJsonObj(jsonObj, localeValues, delimiters) {
  walkJsonObj(jsonObj, function (jsonObj, key) {
    compileValue(jsonObj, key, localeValues, delimiters);
  });
  return jsonObj;
}
function walkJsonObj(jsonObj, walk) {
  if (Array.isArray(jsonObj)) {
    for (var i = 0; i < jsonObj.length; i++) {
      if (walk(jsonObj, i)) {
        return true;
      }
    }
  } else if (isObject(jsonObj)) {
    for (var key in jsonObj) {
      if (walk(jsonObj, key)) {
        return true;
      }
    }
  }
  return false;
}
function resolveLocale(locales) {
  return function (locale) {
    if (!locale) {
      return locale;
    }
    locale = normalizeLocale(locale) || locale;
    return resolveLocaleChain(locale).find(function (locale) {
      return locales.indexOf(locale) > -1;
    });
  };
}
function resolveLocaleChain(locale) {
  var chain = [];
  var tokens = locale.split('-');
  while (tokens.length) {
    chain.push(tokens.join('-'));
    tokens.pop();
  }
  return chain;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 23 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 24 */
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ 12);
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 25 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global, Buffer) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2026 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator && window.navigator.userAgent && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      if (vm.$options && vm.$options.__file) { // fixed by xxxxxx
        return ('') + vm.$options.__file
      }
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm && vm.$options.name !== 'PageBody') {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        !vm.$options.isReserved && tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
  Dep.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
  Dep.target = Dep.SharedObject.target;
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue &&
    !value.__v_isMPComponent
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i, i++)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject,
  slotVm
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, slotVm || this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu' || vm.mpHost === 'mp-kuaishou' || vm.mpHost === 'mp-xhs'){//百度、快手、小红书 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    !vm._$fallback && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    !vm._$fallback && initProvide(vm); // resolve provide after data/props
    !vm._$fallback && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
var NULLTYPE = '[object Null]';
var UNDEFINEDTYPE = '[object Undefined]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function nullOrUndefined(currentType, preType) {
    if(
        (currentType === NULLTYPE || currentType === UNDEFINEDTYPE) && 
        (preType === NULLTYPE || preType === UNDEFINEDTYPE)
    ) {
        return false
    }
    return true
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue !== pre[key] && nullOrUndefined(currentType, preType)) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/**
 * rfdc v1.4.1
 * David Mark Clements <david.clements@nearform.com>
 * Really Fast Deep Clone
 * [npm](https://www.npmjs.com/package/rfdc) [homePage](https://github.com/davidmarkclements/rfdc.git)
 */

/**
 * @typedef {{proto?: boolean; circles?: boolean; reviver: (key: string, value: any) => any; constructorHandlers?: any[];}} Options
 */

function copyBuffer(cur) {
  if (typeof Buffer !== 'undefined' && cur instanceof Buffer) {
    return Buffer.from(cur)
  }

  var length = cur instanceof DataView ? cur.byteLength : cur.length;
  return new cur.constructor(cur.buffer.slice(), cur.byteOffset, length)
}

/**
 *
 * @param {Options} opts
 * @returns {(o: any) => any}
 */
function rfdc(opts) {
  opts = opts || {};
  if (opts.circles) { return rfdcCircles(opts) }

  var constructorHandlers = new Map();
  constructorHandlers.set(Date, function (o) { return o.toJSON(); });
  constructorHandlers.set(Map, function (o, fn) { return new Map(cloneArray(Array.from(o), fn)); });
  constructorHandlers.set(Set, function (o, fn) { return new Set(cloneArray(Array.from(o), fn)); });
  if (opts.constructorHandlers) {
    opts.constructorHandlers.forEach(function (handler) {
      constructorHandlers.set(handler[0], handler[1]);
    });
  }

  var handler = null;

  return opts.proto ? cloneProto : clone

  function cloneArray(a, fn) {
    var keys = Object.keys(a);
    var a2 = new Array(a.length);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var cur = a[k];
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur;
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        a2[k] = handler(cur, fn);
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur);
      } else {
        a2[k] = fn(opts.reviver ? opts.reviver(k, cur) : cur);
      }
    }
    return a2
  }

  function clone(o) {
    if (typeof o !== 'object' || o === null) { return o }
    if (Array.isArray(o)) { return cloneArray(o, clone) }
    if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
      return handler(o, clone)
    }
    var o2 = {};
    for (var k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) { continue }
      var cur = o[k];
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        o2[k] = handler(cur, clone);
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        o2[k] = clone(opts.reviver ? opts.reviver(k, cur) : cur);
      }
    }
    return o2
  }

  function cloneProto(o) {
    if (typeof o !== 'object' || o === null) { return o }
    if (Array.isArray(o)) { return cloneArray(o, cloneProto) }
    if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
      return handler(o, cloneProto)
    }
    var o2 = {};
    for (var k in o) {
      var cur = o[k];
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        o2[k] = handler(cur, cloneProto);
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        o2[k] = cloneProto(opts.reviver ? opts.reviver(k, cur) : cur);
      }
    }
    return o2
  }
}

function rfdcCircles(opts) {
  var refs = [];
  var refsNew = [];

  var constructorHandlers = new Map();
  constructorHandlers.set(Date, function (o) { return o.toJSON(); });
  constructorHandlers.set(Map, function (o, fn) { return new Map(cloneArray(Array.from(o), fn)); });
  constructorHandlers.set(Set, function (o, fn) { return new Set(cloneArray(Array.from(o), fn)); });
  if (opts.constructorHandlers) {
    opts.constructorHandlers.forEach(function (handler) {
      constructorHandlers.set(handler[0], handler[1]);
    });
  }

  var handler = null;
  return opts.proto ? cloneProto : clone

  function cloneArray(a, fn) {
    var keys = Object.keys(a);
    var a2 = new Array(a.length);
    refs.push(a);
    refsNew.push(a2);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var cur = a[k];
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur;
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        a2[k] = handler(cur, fn);
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur);
      } else {
        var index = refs.indexOf(cur);
        if (index !== -1) {
          a2[k] = refsNew[index];
        } else {
          a2[k] = fn(opts.reviver ? opts.reviver(k, cur) : cur);
        }
      }
    }
    refs.pop();
    refsNew.pop();
    return a2
  }

  function clone(o) {
    if (typeof o !== 'object' || o === null) { return o }
    if (Array.isArray(o)) { return cloneArray(o, clone) }
    if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
      return handler(o, clone)
    }
    var o2 = {};
    refs.push(o);
    refsNew.push(o2);
    for (var k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) { continue }
      var cur = o[k];
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        o2[k] = handler(cur, clone);
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        var i = refs.indexOf(cur);
        if (i !== -1) {
          o2[k] = refsNew[i];
        } else {
          o2[k] = clone(opts.reviver ? opts.reviver(k, cur) : cur);
        }
      }
    }
    refs.pop();
    refsNew.pop();
    return o2
  }

  function cloneProto(o) {
    if (typeof o !== 'object' || o === null) { return o }
    if (Array.isArray(o)) { return cloneArray(o, cloneProto) }
    if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
      return handler(o, cloneProto)
    }
    var o2 = {};
    refs.push(o);
    refsNew.push(o2);
    for (var k in o) {
      var cur = o[k];
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        o2[k] = handler(cur, cloneProto);
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        var i = refs.indexOf(cur);
        if (i !== -1) {
          o2[k] = refsNew[i];
        } else {
          o2[k] = cloneProto(opts.reviver ? opts.reviver(k, cur) : cur);
        }
      }
    }
    refs.pop();
    refsNew.pop();
    return o2
  }
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"梦幻衣橱","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"梦幻衣橱","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"梦幻衣橱","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function clearInstance(key, value) {
  // 简易去除 Vue 和小程序组件实例
  if (value) {
    if (value._isVue || value.__v_isMPComponent) {
      return {}
    }
  }
  return value
}

var cloneDeepCircles = rfdc({ circles: true, reviver: clearInstance });

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);

  // vue-composition-api
  var compositionApiState = vm.__composition_api_state__ || vm.__secret_vfa_state__;
  var rawBindings = compositionApiState && compositionApiState.rawBindings;
  if (rawBindings) {
    Object.keys(rawBindings).forEach(function (key) {
      ret[key] = vm[key];
    });
  }

  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return cloneDeepCircles(ret)
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = this.$shouldDiffData === false ? data : diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"梦幻衣橱","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  !vm._$fallback && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err, vm, info) {
    Vue.util.warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    console.error(err);
    /* eslint-disable no-undef */
    var app = typeof getApp === 'function' && getApp();
    if (app && app.onError) {
      app.onError(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      var triggerEvent = this.$scope['_triggerEvent'] || this.$scope['triggerEvent'];
      if (triggerEvent) {
        try {
          triggerEvent.call(this.$scope, event, {
            __args__: toArray(arguments, 1)
          });
        } catch (error) {

        }
      }
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    // 解决动态属性添加
    Vue.set(target, key, value);
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    // 解决动态属性添加
    Vue.set(target, key, value);
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0, l = val; i < l; i++) {
        // 第一个参数暂时仍和小程序一致
        ret[i] = iteratee(i, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onPageNotFound',
    'onThemeChange',
    'onError',
    'onUnhandledRejection',
    //Page
    'onInit',
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onAddToFavorites',
    'onShareTimeline',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    'onUploadDouyinVideo',
    'onNFCReadMessage',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3), __webpack_require__(/*! ./../../../../../buffer/index.js */ 26).Buffer))

/***/ }),
/* 26 */
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ 27)
var ieee754 = __webpack_require__(/*! ieee754 */ 28)
var isArray = __webpack_require__(/*! isarray */ 29)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ 3)))

/***/ }),
/* 27 */
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),
/* 28 */
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 29 */
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 30 */
/*!*******************************************************!*\
  !*** D:/WeChatApp/ChangeCloseGame/uni-app/pages.json ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),
/* 31 */
/*!********************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/uni-stat-public.es.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, global) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__resetInstall = __resetInstall;
exports.__resetStatApp = __resetStatApp;
exports.getStatApp = getStatApp;
exports.installPublicStat = installPublicStat;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ 24));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ 23));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ 32));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ 33));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ 34));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ 35));
var _wrapNativeSuper2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/wrapNativeSuper */ 36));
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 38));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var _PLATFORM_MAP;
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
/**
 * 事件类型与会话创建类型常量。
 *
 * 与私有版 / 文档 `uni统计上报参数.md` 的兼容关系：
 *   - 上行参数文档明确：`lt` 仅取 `1 / 3 / 11 / 21 / 31 / 41`，**没有** `lt=0`。
 *   - 历史架构文档（03-公有版架构设计.md §3.2）曾设计 `lt=0` 作为"客户端 session 边界"事件，
 *     但与服务端入库口径不一致（会话日志 = lt=1），已**整体移除**：
 *     新会话直接发一条 lt=1，会话字段（`sid / cst / fvts / lvts / tvc`）随 lt=1 上行。
 *   - 因此 `LT` 不再包含 `Session`；删除 lt=0 不影响老接收端。
 */
/**
 * Log Type（事件类型）。统一在此声明，禁止其他模块裸写字符串。
 *
 * 注：`lt=41`（uni-app x 原生崩溃日志）暂未在公有版实现，详见 `docs/暂未实现字段说明.md`。
 */
var LT = {
  Launch: '1',
  Hide: '3',
  Page: '11',
  Event: '21',
  Error: '31',
  Push: '101'
};
/**
 * Create Session Type / Session Create Type（同义）。
 *
 * - `1` 冷启动：进程刚起，第一次创建会话。
 * - `2` 后台超时：从后台返回前台，间隔 >= `backgroundTimeoutSec`（秒）。
 * - `3` 前台无操作超时：在前台一段时间无任何 page/event 触达。
 *
 * 公有版预留 `0` 给"未触发新会话"的零值；不要用 0 覆写 storage，仅作为内部哨兵。
 */
var CST = {
  ColdLaunch: 1,
  BackgroundTimeout: 2,
  PageInactiveTimeout: 3
};
/**
 * 入口页标记。
 *
 * `iey` / `ppiey` 上行字段以 `0/1` 形式表达布尔，与私有版数字风格保持一致。
 */
var IEY = {
  No: 0,
  Yes: 1
};
/**
 * 把任意输入归一化为 `IEYValue`。
 *
 * 用于 `domain/entry` 在拼装字段时统一布尔→0/1。`true / 1 / '1'` 均视为 Yes。
 */
function toIey(input) {
  if (input === true || input === 1 || input === '1') return IEY.Yes;
  return IEY.No;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * 安全工具集：序列化、try 包裹、指数退避重试。
 *
 * 修复缺陷：
 *   - #1 `_retry` 未初始化导致重试链路 NaN（公有版直接以参数显式传 `times`）。
 *   - #7 取值反向（私有版 `if (data.length > MAX_LENGTH)` 误判）。
 *   - #8 循环引用导致 `JSON.stringify` 抛错（用 WeakSet replacer 兜底）。
 */
var DEFAULT_MAX_LENGTH = 4096;
var TRUNCATED_SUFFIX = '…[truncated]';
/**
 * 序列化任意值为字符串：支持循环引用与最大长度截断。
 *
 * @param value 待序列化的值。`undefined` 返回 ''；string 直接返回（仍参与截断）。
 * @param max   字符串最大长度，默认 4096；超长会截断并附 `…[truncated]`。
 */
function safeStringify(value) {
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_MAX_LENGTH;
  var _a;
  if (value === undefined) return '';
  var raw;
  if (typeof value === 'string') {
    raw = value;
  } else {
    var seen = new WeakSet();
    try {
      raw = (_a = JSON.stringify(value, function (_key, val) {
        if ((0, _typeof2.default)(val) === 'object' && val !== null) {
          if (seen.has(val)) return '[Circular]';
          seen.add(val);
        }
        if (typeof val === 'bigint') return val.toString();
        if (typeof val === 'function') return "[Function ".concat(val.name || 'anonymous', "]");
        return val;
      })) !== null && _a !== void 0 ? _a : '';
    } catch (e) {
      raw = "[Unserializable: ".concat(e.message, "]");
    }
  }
  if (raw.length > max) {
    return raw.slice(0, Math.max(0, max - TRUNCATED_SUFFIX.length)) + TRUNCATED_SUFFIX;
  }
  return raw;
}
/**
 * 包裹同步函数，捕获任何抛出，返回 fallback。
 *
 * 不打印 console（由调用方按需 `logger.warn`）；保持纯函数风格便于热路径使用。
 */
function tryRun(fn, fallback) {
  try {
    return fn();
  } catch (_a) {
    return fallback;
  }
}
/**
 * 指数退避重试：失败时按 `baseDelayMs * 2^(n-1)` 等待后重试，全部失败抛出最后一个错误。
 *
 * @example
 *   await withRetry(() => fetch(url), { times: 3, baseDelayMs: 200 })
 *   // 第 1 次失败 → wait 200ms；第 2 次失败 → wait 400ms；第 3 次失败 → throw
 */
function withRetry(fn, opts) {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var _a, total, sleep, lastErr, attempt;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            total = Math.max(1, Math.floor(opts.times));
            sleep = (_a = opts.sleep) !== null && _a !== void 0 ? _a : defaultSleep;
            attempt = 1;
          case 3:
            if (!(attempt <= total)) {
              _context.next = 20;
              break;
            }
            _context.prev = 4;
            _context.next = 7;
            return fn();
          case 7:
            return _context.abrupt("return", _context.sent);
          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](4);
            lastErr = _context.t0;
            if (!(attempt >= total)) {
              _context.next = 15;
              break;
            }
            return _context.abrupt("break", 20);
          case 15:
            _context.next = 17;
            return sleep(opts.baseDelayMs * Math.pow(2, attempt - 1));
          case 17:
            attempt++;
            _context.next = 3;
            break;
          case 20:
            throw lastErr;
          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 10]]);
  }));
}
function defaultSleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

/**
 * 解析 uni-app 运行时根对象 `uni`。
 *
 * - H5 / App：常见为 `globalThis.uni`。
 * - 微信小程序等：多为 Vite/rollup 向**当前模块**注入的标识符 `uni`，
 *   **未必**同步挂到 `globalThis`；仅读 `globalThis.uni` 会导致
 *   `bindLifecycle` / `uni.request` / storage 等全部静默失败。
 * - 支付宝等旧版小程序：**无 `globalThis` 标识符**，须用 `getGlobalObject()` 兜底。
 * - H5 发行摇树：`pages.json.js` 会先把 `window.uni = {}` 占位；若仍按「有 object 即用」
 *   会误把空桩当真 uni。须用 `isUsableUniRuntime` 过滤后再择源。
 *
 * 第二路依赖宿主构建对 `uni` 的注入（与业务页面同一套解析规则），
 * 类型兜底见 `packages/uni-stat/src/uni-global.d.ts`。
 */
/**
 * 判断候选 `uni` 是否具备统计 SDK 可用的最小 API 集合（排除 H5 摇树空桩 `{}`）。
 *
 * 任一核心 API 存在即视为可用；与具体平台无关，微信/QQ/抖音/支付宝/百度等
 * 完整 runtime 均满足，仅「占位空对象」会被过滤。
 */
function isUsableUniRuntime(candidate) {
  if (candidate == null || (0, _typeof2.default)(candidate) !== 'object') return false;
  var u = candidate;
  return typeof u.getStorageSync === 'function' || typeof u.onCreateVueApp === 'function' || typeof u.request === 'function' || typeof u.onAppShow === 'function';
}
/**
 * 读取宿主向当前模块注入的 `uni`（小程序等）；不可用时返回 `undefined`。
 */
function getModuleUniCandidate() {
  if (typeof uni === 'undefined' || uni == null || (typeof uni === "undefined" ? "undefined" : (0, _typeof2.default)(uni)) !== 'object') {
    return undefined;
  }
  return uni;
}
/**
 * H5 兜底：在 `globalThis` / `self` 不可用时尝试读取 `window`。
 *
 * 通过 `Function` 间接访问，避免 ESLint `no-restricted-globals` 对 `window` 标识符的限制；
 * 小程序等环境执行失败时返回 `undefined`。
 */
function getWindowObject() {
  try {
    var w = Function('return typeof window !== "undefined" ? window : undefined')();
    return w != null ? w : undefined;
  } catch (_a) {
    return undefined;
  }
}
/**
 * 安全获取全局对象。
 *
 * 支付宝 / 部分旧版小程序运行时未提供 `globalThis`，直接写 `globalThis` 会
 * `ReferenceError: globalThis is not defined`，导致 install 阶段整包崩溃。
 */
function getGlobalObject() {
  if (typeof globalThis !== 'undefined' && globalThis != null) {
    return globalThis;
  }
  if (typeof global !== 'undefined' && global != null) {
    return global;
  }
  if (typeof self !== 'undefined' && self != null) {
    return self;
  }
  var win = getWindowObject();
  if (win) return win;
  return {};
}
/**
 * 用字面量 `uni.方法` 引用拼出一个可用的 `uni` facade。
 *
 * uni-app 各端构建的 API 注入器仅识别字面量成员表达式 `uni.方法`（H5 → `@dcloudio/uni-h5`，
 * 小程序 / App 同理），动态 `u.方法` 不会被注入。这里对所需 API 逐个写字面量 `uni.方法`，
 * 使其被注入后收敛为一个对象供下游适配器使用。
 *
 * 仅在 `globalThis.uni` 与模块 `uni` 均不可用时作为兜底（典型：H5 发行摇树后 `window.uni`
 * 为 `{}` 空桩）。未经注入的环境下 `uni.方法` 读到空桩 / 未声明，拼不出方法时返回 undefined。
 */
function buildInjectedUniRuntime() {
  try {
    var out = {};
    var pick = function pick(name, fn) {
      if (typeof fn === 'function') out[name] = fn;
    };
    // 必须逐个写字面量 `(uni as ...).方法`（emit 后为 `uni.方法`），不可别名 / 循环，否则不会被注入。
    pick('getStorageSync', uni.getStorageSync);
    pick('setStorageSync', uni.setStorageSync);
    pick('removeStorageSync', uni.removeStorageSync);
    pick('getSystemInfoSync', uni.getSystemInfoSync);
    pick('getDeviceInfo', uni.getDeviceInfo);
    pick('getAppBaseInfo', uni.getAppBaseInfo);
    pick('getWindowInfo', uni.getWindowInfo);
    pick('getNetworkType', uni.getNetworkType);
    pick('request', uni.request);
    pick('onAppShow', uni.onAppShow);
    pick('offAppShow', uni.offAppShow);
    pick('onAppHide', uni.onAppHide);
    pick('offAppHide', uni.offAppHide);
    pick('onAppLaunch', uni.onAppLaunch);
    pick('offAppLaunch', uni.offAppLaunch);
    pick('getLaunchOptionsSync', uni.getLaunchOptionsSync);
    pick('addInterceptor', uni.addInterceptor);
    pick('removeInterceptor', uni.removeInterceptor);
    pick('getPushClientId', uni.getPushClientId);
    pick('getAccountInfoSync', uni.getAccountInfoSync);
    pick('onCreateVueApp', uni.onCreateVueApp);
    return Object.keys(out).length > 0 ? out : undefined;
  } catch (_e) {
    // 未注入且 `uni` 未声明（单测 / 极端环境）→ ReferenceError，兜底返回 undefined。
    return undefined;
  }
}
/**
 * 探测 `uni` 解析路径（不改变 `resolveUniRuntime` 行为，仅用于 debug 诊断）。
 */
function probeUniRuntime() {
  var globalThisAvailable = typeof globalThis !== 'undefined';
  var g = getGlobalObject();
  var globalUni = g.uni;
  var globalThisHasUni = globalUni != null && (0, _typeof2.default)(globalUni) === 'object';
  var globalThisUniStub = globalThisHasUni && !isUsableUniRuntime(globalUni);
  var moduleUni = getModuleUniCandidate();
  var moduleUniDefined = moduleUni != null;
  if (isUsableUniRuntime(globalUni)) {
    return {
      resolved: true,
      source: 'globalThis',
      globalThisHasUni: true,
      globalThisUniStub: false,
      moduleUniDefined: moduleUniDefined,
      globalThisAvailable: globalThisAvailable,
      uni: globalUni
    };
  }
  if (isUsableUniRuntime(moduleUni)) {
    return {
      resolved: true,
      source: 'module',
      globalThisHasUni: globalThisHasUni,
      globalThisUniStub: globalThisUniStub,
      moduleUniDefined: true,
      globalThisAvailable: globalThisAvailable,
      uni: moduleUni
    };
  }
  // globalThis / 模块 uni 均不可用（典型 H5 发行空桩）时，用注入 facade 兜底。
  var injectedUni = buildInjectedUniRuntime();
  if (isUsableUniRuntime(injectedUni)) {
    return {
      resolved: true,
      source: 'injected',
      globalThisHasUni: globalThisHasUni,
      globalThisUniStub: globalThisUniStub,
      moduleUniDefined: moduleUniDefined,
      globalThisAvailable: globalThisAvailable,
      uni: injectedUni
    };
  }
  return {
    resolved: false,
    source: 'none',
    globalThisHasUni: globalThisHasUni,
    globalThisUniStub: globalThisUniStub,
    moduleUniDefined: moduleUniDefined,
    globalThisAvailable: globalThisAvailable,
    uni: undefined
  };
}
/**
 * 返回与业务侧一致的 `uni` 运行时根对象；均不可用时返回 `undefined`。
 */
function resolveUniRuntime() {
  var probe = probeUniRuntime();
  return probe.resolved ? probe.uni : undefined;
}

/**
 * 公有版统一日志出口。
 *
 * 修复的私有版缺陷：
 *   - #19 `!!process.env.UNI_STAT_DEBUG` 在构建时若被替换为字符串 `"false"` 仍是 truthy。
 *     公有版严格使用 `=== 'true'` 判定，并允许在运行时通过 `setDebug()` 临时打开
 *     （供调试 / 灰度小流量验证）。
 *
 * 行为约定：
 *   - `debug` 受调试开关控制；其他 level 始终输出到对应的 `console.*`。
 *   - **Android / iOS 真机**：`TAG` 与正文拼成单条字符串，避免桥接丢弃第二参起。
 *   - **其它平台**：`console.*(TAG, ...args)`，对象保持原生传递。
 *
 * 兼容性：
 *   - 历史版本插件 define 误把 `process.env.UNI_STAT_DEBUG` 替换成布尔字面量
 *     （未 `JSON.stringify`），导致 dist 运行时该值为 `true`/`false` 而非 `'true'`/`'false'`。
 *     `isDebug()` 同时接受字符串 `'true'` 与布尔字面量 `true`，避免历史构建产物完全失效。
 */
var TAG = '[uni统计 2.0]';
var runtimeDebug;
/**
 * 是否屏蔽 info / warn / error。
 * `undefined`：自动——`NODE_ENV === 'test'` 时默认屏蔽，避免 Jest 用例预期失败路径刷屏。
 */
var muteNonDebug;
/**
 * 是否将日志合并为单行（Android / iOS 真机侧）。
 */
function preferSingleLineConsole() {
  return isAndroidOrIosRuntime();
}
/**
 * 是否为 App 或小程序运行在 **Android / iOS** 上（仅此类环境对对象参数做字符串化）。
 */
function isAndroidOrIosRuntime() {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var raw = (_a = "mp-weixin") !== null && _a !== void 0 ? _a : '';
  var g = getGlobalObject();
  if (raw === 'app' || raw === 'app-plus' || raw === 'app-harmony') {
    var _n = (_d = (_c = (_b = g.plus) === null || _b === void 0 ? void 0 : _b.os) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.toLowerCase();
    if (!_n) return false;
    if (_n.includes('android')) return true;
    if (_n === 'ios' || _n.includes('iphone')) return true;
    return false;
  }
  if (raw.startsWith('mp-')) {
    try {
      var p = (_h = (_g = (_f = (_e = g.uni) === null || _e === void 0 ? void 0 : _e.getSystemInfoSync) === null || _f === void 0 ? void 0 : _f.call(_e)) === null || _g === void 0 ? void 0 : _g.platform) === null || _h === void 0 ? void 0 : _h.toLowerCase();
      return p === 'android' || p === 'ios';
    } catch (_j) {
      return false;
    }
  }
  return false;
}
/**
 * 在 Android/iOS 上将「对象类」参数转为可打印字符串；其余类型原样返回。
 */
function stringifyObjectArgForNative(value) {
  if (value === null || value === undefined) return value;
  if ((0, _typeof2.default)(value) !== 'object') return value;
  if (value instanceof Error) return "".concat(value.name, ": ").concat(value.message);
  return safeStringify(value);
}
/**
 * 将单段日志参数格式化为可拼进一行文本的片段（Android/iOS 单参输出用）。
 */
function formatLogArgForNativeConsole(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (typeof value === 'bigint') return String(value);
  if ((0, _typeof2.default)(value) === 'symbol') {
    try {
      return value.toString();
    } catch (_a) {
      return '?';
    }
  }
  if (typeof value === 'function') {
    var fn = value;
    return "[Function ".concat(fn.name || 'anonymous', "]");
  }
  if ((0, _typeof2.default)(value) === 'object') {
    if (value instanceof Error) return "".concat(value.name, ": ").concat(value.message);
    return safeStringify(value);
  }
  return String(value);
}
/**
 * 当前是否应屏蔽 info / warn / error（debug 仍由 `isDebug()` 单独控制）。
 */
function isNonDebugMuted() {
  if (muteNonDebug !== undefined) return muteNonDebug;
  return "development" === 'test';
}
/**
 * 测试 / CI 下临时恢复 warn 等输出（如断言 install 告警文案）。
 *
 * @param value `true` 屏蔽；`false` 允许；`undefined` 恢复为按 NODE_ENV 自动判定。
 */
function setMuteNonDebug(value) {
  muteNonDebug = value;
}
/**
 * 输出到 console：Android/iOS 真机整行单参；其余平台 `TAG` + 多参。
 */
function emitConsole(method, args) {
  if (method !== 'log' && isNonDebugMuted()) return;
  var fn = console[method];
  if (!preferSingleLineConsole()) {
    fn.call.apply(fn, [console, TAG].concat((0, _toConsumableArray2.default)(args)));
    return;
  }
  var mapped = isAndroidOrIosRuntime() ? args.map(stringifyObjectArgForNative) : args;
  if (mapped.length === 0) {
    fn.call(console, TAG);
    return;
  }
  var body = mapped.map(formatLogArgForNativeConsole).join(' ');
  fn.call(console, "".concat(TAG, " ").concat(body));
}
/**
 * 当前是否启用 debug 输出。优先级：
 *   1. `setDebug(value)` 显式设置过 → 直接返回。
 *   2. `process.env.UNI_STAT_DEBUG === 'true'` 或被构建期替换为布尔字面量 `true`
 *      （历史插件兼容路径）。
 */
function isDebug() {
  if (runtimeDebug !== undefined) return runtimeDebug;
  var v = false;
  return v === 'true' || v === true;
}
/**
 * 运行时切换 debug 开关；传 `undefined` 恢复为「按 process.env 判断」。
 */
function setDebug(value) {
  runtimeDebug = value;
}
var logger = {
  debug: function debug() {
    if (!isDebug()) return;
    // eslint-disable-next-line no-console
    for (var _len = arguments.length, args = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
      args[_key2] = arguments[_key2];
    }
    emitConsole('log', args);
  },
  info: function info() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
      args[_key3] = arguments[_key3];
    }
    // eslint-disable-next-line no-console
    emitConsole('info', args);
  },
  warn: function warn() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
      args[_key4] = arguments[_key4];
    }
    // eslint-disable-next-line no-console
    emitConsole('warn', args);
  },
  error: function error() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key5 = 0; _key5 < _len4; _key5++) {
      args[_key5] = arguments[_key5];
    }
    // eslint-disable-next-line no-console
    emitConsole('error', args);
  },
  setDebug: setDebug,
  isDebug: isDebug,
  setMuteNonDebug: setMuteNonDebug
};

/**
 * 公有版本地存储抽象（重写自私有版 `utils/db.js`）。
 *
 * 修复的私有版缺陷：
 *   - #14 `dbRemove` 第二段 `data = uni.getStorageSync(...)` 无 `|| {}` 兜底导致 NPE。
 *   - #18 每次 get/set/remove 都做 2~3 次 storage IO（read-modify-write），
 *         公有版改为「按 key 独立存储 + 内存缓存」，每次操作只 1 次同步 IO。
 *
 * 关键能力（供 Phase 4 缺陷 #5 修复使用）：
 *   - `safeRead`：读取失败时返回 `{ ok: false }` 而不是 `undefined`，调用方据此区分
 *     "key 不存在 / storage 异常"，避免老用户被 lvts=0 误判为新用户。
 *
 * 命名空间：所有 key 自动加前缀 `UNI_STAT_DATA:<appid>:`；`<appid>` 取
 * `process.env.UNI_APP_ID`，缺失时退化为 `default`。
 *
 * 注意：本模块依赖 `uni.{getStorageSync,setStorageSync,removeStorageSync}`，
 * 解析规则见 `infra/uniRuntime.ts`（含小程序注入路径）。
 * 测试中通过 `helpers/mockUni` 注入。
 */
/**
 * 公有版命名空间前缀，遵循公司内部统一规范 `UNI_STAT_DATA:<appid>:<key>`。
 *
 * 私有版（旧）使用 `$$STAT__DBDATA:<appid>` 作为单一聚合 key；这里**不再**使用旧前缀，
 * 仅在 Phase 4 `domain/migration` 中通过显式只读 API 读取一次老聚合数据并拆解到新前缀，
 * 保证平滑迁移；除迁移路径外，新代码全部写入 `UNI_STAT_DATA:` 命名空间。
 */
var NAMESPACE_ROOT = 'UNI_STAT_DATA';
/** 仅供迁移层读取老数据用：私有版聚合 key 的前缀。 */
var LEGACY_NAMESPACE_ROOT = '$$STAT__DBDATA';
/**
 * 内存缓存。值语义：
 *   - 命中且非 undefined → cache 中的真实值
 *   - 命中且 undefined   → 已经主动 `remove` 或确认 storage 中不存在
 *   - 未命中              → 还没读过 storage
 */
var cache = new Map();
/** 已知存在过的全部完整 key（用于 `clearNamespace`）。 */
var knownKeys = new Set();
/**
 * 拼装命名空间下的完整 key。
 */
function fullKey(key) {
  var appid =  false || 'default';
  return "".concat(NAMESPACE_ROOT, ":").concat(appid, ":").concat(key);
}
/**
 * 取真实 uni 对象。剥离到函数里，便于测试用 mockUni 替换后立即生效。
 */
function getUni$9() {
  var raw = resolveUniRuntime();
  var u = raw != null && (0, _typeof2.default)(raw) === 'object' ? raw : undefined;
  if (!u || typeof u.getStorageSync !== 'function') {
    throw new Error('[uni统计 2.0] uni storage API is not available');
  }
  return u;
}
/**
 * 获取一个 key 的值。
 *
 * @returns 命中返回值；未命中或 storage 异常返回 `undefined`（无法区分两种情况，
 *          需要区分时请使用 `safeRead`）。
 */
function get(key) {
  var fk = fullKey(key);
  if (cache.has(fk)) return cache.get(fk);
  try {
    var raw = getUni$9().getStorageSync(fk);
    // uni 规范：未命中返回空字符串
    if (raw === '' || raw === null || raw === undefined) {
      cache.set(fk, undefined);
      return undefined;
    }
    cache.set(fk, raw);
    knownKeys.add(fk);
    return raw;
  } catch (_a) {
    return undefined;
  }
}
/**
 * 安全读取：明确区分「未命中 / 读异常」。
 *
 * @returns
 *   - `{ ok: true, value }`：成功读取（value 可能为 undefined 表示 key 不存在）。
 *   - `{ ok: false, value: undefined }`：storage 抛错；调用方应使用上次内存值兜底，
 *     **绝不**直接退化为 0 / null（否则会复现缺陷 #5：老用户被误判为新用户）。
 */
function safeRead(key) {
  var fk = fullKey(key);
  if (cache.has(fk)) return {
    ok: true,
    value: cache.get(fk)
  };
  try {
    var raw = getUni$9().getStorageSync(fk);
    if (raw === '' || raw === null || raw === undefined) {
      cache.set(fk, undefined);
      return {
        ok: true,
        value: undefined
      };
    }
    cache.set(fk, raw);
    knownKeys.add(fk);
    return {
      ok: true,
      value: raw
    };
  } catch (_a) {
    return {
      ok: false,
      value: undefined
    };
  }
}
/**
 * 写入一个 key。`undefined` 视为删除（与私有版语义对齐）。
 *
 * 失败策略：先更新缓存，再写 storage；storage 抛错时不回滚缓存，
 * 由调用方决定是否补偿（视调用方场景而定，热路径不应阻塞）。
 */
function set(key, value) {
  var fk = fullKey(key);
  if (value === undefined) {
    remove(key);
    return;
  }
  cache.set(fk, value);
  knownKeys.add(fk);
  try {
    getUni$9().setStorageSync(fk, value);
  } catch (_a) {
    // 缓存已更新，吞掉异常；调用方如需感知请使用 try/catch 显式包裹。
  }
}
/**
 * 删除一个 key。
 */
function remove(key) {
  var fk = fullKey(key);
  cache.set(fk, undefined);
  try {
    getUni$9().removeStorageSync(fk);
  } catch (_a) {
    // 同 set：忽略 storage 异常，缓存已置空。
  }
}
/**
 * 批量读：返回 `Record<key, value>`，未命中 / 异常的 key 取值为 `undefined`。
 */
function batchGet(keys) {
  var out = {};
  var _iterator = _createForOfIteratorHelper(keys),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var k = _step.value;
      out[k] = get(k);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return out;
}
/**
 * 批量写：逐个 `set`，等价于循环调用，便于调用侧聚合。
 */
function batchSet(entries) {
  for (var _i = 0, _Object$keys = Object.keys(entries); _i < _Object$keys.length; _i++) {
    var k = _Object$keys[_i];
    set(k, entries[k]);
  }
}
/**
 * 清除当前 appid 命名空间下、自模块加载以来访问过的所有 key。
 *
 * 注意：受限于 uni storage 不一定支持 `getStorageInfoSync`，本函数只清理
 * 「本模块写入或读取过的 key」；未触达过的历史脏数据需要调用方显式处理。
 */
function clearNamespace() {
  var uni;
  try {
    uni = getUni$9();
  } catch (_a) {
    // uni 不可用：仅清缓存，无法清持久化
  }
  for (var _i2 = 0, _Array$from = Array.from(knownKeys); _i2 < _Array$from.length; _i2++) {
    var fk = _Array$from[_i2];
    try {
      uni === null || uni === void 0 ? void 0 : uni.removeStorageSync(fk);
    } catch (_b) {
      // 单 key 失败不影响其他 key 的清理
    }
    cache.set(fk, undefined);
  }
  knownKeys.clear();
}
/**
 * 仅供单测使用：清空内部缓存与 knownKeys 索引，让模块"像刚加载"一样。
 *
 * 单测必须在每个用例之间调用，否则会跨用例泄漏缓存状态。
 */
function __resetCache() {
  cache.clear();
  knownKeys.clear();
}
var storage = {
  get: get,
  set: set,
  remove: remove,
  safeRead: safeRead,
  batchGet: batchGet,
  batchSet: batchSet,
  clearNamespace: clearNamespace,
  __resetCache: __resetCache
};

/**
 * 访问字段 `fvts / lvts / tvc` 状态机。**专项修复缺陷 #5：lvts=0 老用户被误判为新用户。**
 *
 * 私有版（`utils/pageTime.js`）的副作用链：
 *   1. `get_first_visit_time` 在写 fvts 时主动 `dbRemove(LAST_VISIT_TIME_KEY)`
 *      → 第 1 次启动结束 storage 中 lvts 为空。
 *   2. `get_last_visit_time` 在读时立即 `dbSet(LAST_VISIT_TIME_KEY, get_time())`
 *      → 把 "上一次" 当成 "本次"，下次启动读出来已是当前时间。
 *   3. 写入早于上报，上报失败时无法回滚，下次启动状态错乱。
 *
 * 公有版严格契约：
 *   1. 老用户三段拆分：`loadVisitSnapshot()` 纯读、`buildVisitFields()` 仅生成本次待写、
 *      `commitVisitOnAck()` 在上报 ack 后才落 storage（仅推进 lvts，永不主动清 lvts）。
 *   2. **新用户首条 lt=1 例外（保证"一生只计一次新增"）**：本条仍上报 `lvts=0`，但
 *      `buildVisitFields` 会**立即**把基线 `fvts/lvts/tvc=now/now/1` 落库（对齐私有版
 *      `get_last_visit_time` 的"读即写"）。这样本进程后续续会话、以及下次冷启动都会读到
 *      `lvts=now`（非 0），不再被重复计为新增；首条即便上报失败也已由 retry 暂存重试，
 *      不会丢失这唯一一次新增信号。**唯有卸载应用 / 清空缓存**清掉基线后才会重新计一次。
 *   3. `loadVisitSnapshot` 区分 "key 不存在" 与 "storage 异常"：
 *      - 不存在 → `lvts=0`，按新用户路径走（Yes new user）。
 *      - 异常   → 内存有上次 snapshot 时复用之；首次启动且异常 → fallback `lvts=0`，
 *        但**记录** `degraded=true`，上层可决定是否仍上报（Phase 5 collector 用）。
 *   4. 同一进程内只允许一次 `buildVisitFields`；后续 cst=2/3 触发的新会话 lt=1
 *      调用 `buildVisitFieldsForSessionRenewal`，复用 committed / lastBuilt 推进 tvc，
 *      并保证 lvts 仍随 lt=1 上行（缺失会被服务端误判为新用户）。
 *
 * 与 `pipeline/collector.ts` 的契约见 `05-公有版重构开发计划.md` §4.1.5。
 */
var KEY_FVTS = 'visit:fvts';
var KEY_LVTS = 'visit:lvts';
var KEY_TVC = 'visit:tvc';
var EMPTY_SNAPSHOT = {
  fvts: 0,
  lvts: 0,
  tvc: 0,
  isNewUser: true,
  degraded: false
};
/** 启动后通过 `loadVisitSnapshot` 写入；后续 build/commit 均基于此推进。 */
var loaded = null;
/** `buildVisitFields` 生成；`commitVisitOnAck` 落库后清空。 */
var pending = null;
/** cst=2/3 新会话 lt=1 生成；`commitVisitOnAck` 落库后清空。 */
var pendingRenewal = null;
/** `commitVisitOnAck` 落库后写入；同进程内 cst=2/3 后续事件复用此 snapshot。 */
var committed = null;
/**
 * 本进程内最近一次 `buildVisitFields` 的产出。即使 pending 已被 commit / rollback 清空，
 * 仍保留这份，用于：
 *   - cst=2/3 复用同一份字段（参见 T5/T6）。
 *   - 拦截同进程二次 `buildVisitFields` 误调（warn 后返回此值，不再生成新值）。
 */
var lastBuilt = null;
/** 同进程内 `buildVisitFields` 只允许调用一次（缺陷 #5 修复点之一）。 */
var buildCalledInProcess = false;
/**
 * 转 number（兼容历史 storage 中 string 形式的时间戳）。
 *
 * 异常 / NaN / 负数一律视为 0；
 * 这里保守不抛错，因为读流程要保证不让"脏数据"中断采集链路。
 */
function toNum(v) {
  if (typeof v === 'number' && Number.isFinite(v) && v >= 0) return v;
  if (typeof v === 'string' && v.length > 0) {
    var _n2 = Number(v);
    if (Number.isFinite(_n2) && _n2 >= 0) return _n2;
  }
  return 0;
}
/**
 * snapshot 是否「确实是一台全新设备」：三字段全 0。
 *
 * 用于消费 `degraded`：storage 读取异常时 `lvts` 会退化为 0 而误判 `isNewUser=true`。
 * 若此时 `fvts/tvc` 仍读到非 0（说明是老用户、只是 lvts 这一项读失败），就**不能**当新增，
 * 也不能落库覆盖真实持久值；只有三字段都为 0 才是可信的全新设备。
 */
function isLikelyFreshDevice(snap) {
  return snap.fvts === 0 && snap.lvts === 0 && snap.tvc === 0;
}
/**
 * 是否为「可信的新用户」：非 degraded 直接信任 `isNewUser`；degraded 时仅当三字段全 0
 * （`isLikelyFreshDevice`）才信任，否则视为「读失败的老用户」，走老用户兜底路径。
 */
function isTrustworthyNewUser(snap) {
  if (!snap.isNewUser) return false;
  return !snap.degraded || isLikelyFreshDevice(snap);
}
/**
 * 从 storage 读取 snapshot。**纯读，无副作用**（spy `storage.set` 必须 not.toHaveBeenCalled）。
 *
 * 异常处理：
 *   - 三个 key 任意一个 `safeRead.ok=false` → degraded=true。
 *   - 后续读到值仍写 snapshot；调用方应根据 `degraded` 决策是否上报。
 */
function loadVisitSnapshot() {
  var fvtsR = storage.safeRead(KEY_FVTS);
  var lvtsR = storage.safeRead(KEY_LVTS);
  var tvcR = storage.safeRead(KEY_TVC);
  var degraded = !fvtsR.ok || !lvtsR.ok || !tvcR.ok;
  var fvts = toNum(fvtsR.value);
  var lvts = toNum(lvtsR.value);
  var tvc = toNum(tvcR.value);
  var snapshot = {
    fvts: fvts,
    lvts: lvts,
    tvc: tvc,
    isNewUser: lvts === 0,
    degraded: degraded
  };
  if (degraded) {
    var likelyFresh = fvts === 0 && lvts === 0 && tvc === 0 && snapshot.isNewUser;
    if (!likelyFresh) {
      logger.warn('[uni统计 2.0] visit snapshot degraded; some storage keys read failed');
    }
  }
  loaded = snapshot;
  return snapshot;
}
/**
 * 取已加载的 snapshot；未调用过 `loadVisitSnapshot` 时返回 EMPTY。
 *
 * 这里不主动调 `loadVisitSnapshot`，避免在错误时机产生隐式 IO；
 * collector 必须在启动时显式 load 一次。
 */
function ensureLoaded() {
  if (!loaded) loaded = EMPTY_SNAPSHOT;
  return loaded;
}
/**
 * 新用户首条 lt=1 的**乐观落库**：立即把基线 `fvts/lvts/tvc=now/now/1` 写入 storage，
 * 并把内存 `loaded`/`committed` 刷新为"非新用户"基线。
 *
 * 目的：保证一台设备一生只上报一次 `lvts=0`（=只计一次新增）。对齐私有版
 * `get_first_visit_time`/`get_last_visit_time` 的"读即写"语义。
 *
 * 与 ack-commit 的关系：
 *   - 首条 lt=1 仍按 `lvts=0` 上报（在 `buildVisitFields` 里单独构造 pending 返回）；
 *     即便该条上报失败，也已由 `pipeline/retry` 暂存重试，唯一一次新增信号不丢。
 *   - 本进程后续续会话（`buildVisitFieldsForSessionRenewal`）命中 `committed` → lvts=now（非 0）；
 *     下次冷启动 `loadVisitSnapshot` 读到 storage 里的 lvts=now → `isNewUser=false`。
 *   - 唯有卸载应用 / 清空缓存清掉基线后，才会重新计一次新增。
 */
function persistNewUserBaseline(now) {
  storage.set(KEY_FVTS, now);
  storage.set(KEY_LVTS, now);
  storage.set(KEY_TVC, 1);
  var baseline = {
    fvts: now,
    lvts: now,
    tvc: 1,
    isNewUser: false,
    degraded: false
  };
  loaded = baseline;
  committed = baseline;
}
/**
 * 生成本次启动要上报的 fvts/lvts/tvc 三元组。
 *
 * 推进规则：
 *   - 新用户（loaded.isNewUser）：本次上报 fvts=now, lvts=0（0 表示新增），tvc=1；
 *     **同时立即落库基线**（见 `persistNewUserBaseline`），确保后续不再重复计新增。
 *   - 老用户：**不写 storage**；fvts 维持 loaded.fvts；lvts 上报 loaded.lvts（"上一次"，
 *     不是 now）；tvc=loaded.tvc+1；真正落库由 `commitVisitOnAck` 在 ack 后推进。
 *
 * 注意：同一进程内只允许调用一次（参考 `domain/session` 设计）；cst=2/3 新会话应走
 * `buildVisitFieldsForSessionRenewal`。这里通过 `buildCalledInProcess` 哨兵防止误用，
 * 二次调用返回与首次相同的结果但发出 warn，便于排查上层 collector bug。
 */
function buildVisitFields(now) {
  var snap = ensureLoaded();
  if (buildCalledInProcess && lastBuilt) {
    logger.warn('[uni统计 2.0] buildVisitFields() called twice in same process; returning cached fields');
    return Object.assign({}, lastBuilt);
  }
  buildCalledInProcess = true;
  if (isTrustworthyNewUser(snap)) {
    pending = {
      fvts: now,
      lvts: 0,
      tvc: 1,
      now: now
    };
    persistNewUserBaseline(now);
  } else if (snap.isNewUser) {
    // degraded 且非全新设备：lvts 读失败被误当 0。按老用户兜底，**不**上报 lvts=0、
    // **不**落库基线（storage 不可靠），避免新增虚高与覆盖真实持久值。
    logger.warn('[uni统计 2.0] visit degraded: lvts 读取失败但检测到历史数据，按老用户处理以避免新增虚高');
    var fvts = snap.fvts > 0 ? snap.fvts : now;
    pending = {
      fvts: fvts,
      lvts: fvts,
      tvc: snap.tvc + 1,
      now: now
    };
  } else {
    pending = {
      fvts: snap.fvts,
      lvts: snap.lvts,
      tvc: snap.tvc + 1,
      now: now
    };
  }
  lastBuilt = {
    fvts: pending.fvts,
    lvts: pending.lvts,
    tvc: pending.tvc
  };
  return Object.assign({}, lastBuilt);
}
/**
 * 为 cst=2/3 新会话 lt=1 生成本次要上报的 visit 字段（**不写 storage**）。
 *
 * 与私有版 `sendReportRequest` 对齐：后台/前台超时触发的新会话仍携带 fvts/lvts/tvc，
 * 避免 lvts 缺失被服务端按新用户入库。
 *
 * 推进规则：
 *   - 已有 committed：fvts 不变，lvts 上报 committed.lvts，tvc=committed.tvc+1。
 *   - 冷启动 lt=1 尚未 ack：复用 lastBuilt，不重复递增 tvc。
 *   - 兜底读 loaded snapshot，逻辑同 buildVisitFields 的老用户路径。
 */
function buildVisitFieldsForSessionRenewal(now) {
  var fvts;
  var lvts;
  var tvc;
  if (committed) {
    fvts = committed.fvts;
    lvts = committed.lvts;
    tvc = committed.tvc + 1;
  } else if (lastBuilt) {
    fvts = lastBuilt.fvts;
    // 防御：新用户冷启首条 lt=1（lvts=0）尚未 ack 时，本进程后续续会话不能再上报 lvts=0，
    // 否则同一新设备被重复计新增。此时用"本次启动时间"(=fvts) 作为上一次访问时间。
    // 正常路径下 buildVisitFields 已落库基线并置 committed，会走上面的 committed 分支。
    lvts = lastBuilt.lvts !== 0 ? lastBuilt.lvts : lastBuilt.fvts;
    tvc = lastBuilt.tvc;
  } else {
    var snap = ensureLoaded();
    if (isTrustworthyNewUser(snap)) {
      // 续会话成为本进程首条 lt=1 且命中新用户（罕见：未走过冷启 build）：本条仍按
      // lvts=0 计一次新增，并立即落库基线，保证只计一次。
      fvts = now;
      lvts = 0;
      tvc = 1;
      persistNewUserBaseline(now);
    } else if (snap.isNewUser) {
      // degraded 且非全新设备：按老用户兜底，不上报 lvts=0、不落库基线。
      fvts = snap.fvts > 0 ? snap.fvts : now;
      lvts = fvts;
      tvc = snap.tvc + 1;
    } else {
      fvts = snap.fvts;
      lvts = snap.lvts;
      tvc = snap.tvc + 1;
    }
  }
  pendingRenewal = {
    fvts: fvts,
    lvts: lvts,
    tvc: tvc,
    now: now
  };
  return {
    fvts: fvts,
    lvts: lvts,
    tvc: tvc
  };
}
/**
 * 上报 ack 成功后落库。
 *
 * 实际写入：
 *   - 新用户：`fvts=now, lvts=now, tvc=1`（本次启动既是首装也是上一次）。
 *   - 老用户：`fvts` 不变，`lvts=now`（注意：不是 pending.lvts，是 commit 时的 now），`tvc=pending.tvc`。
 *
 * pending 为空 / commit 重复调用一律 noop（保持幂等，便于 collector 重试逻辑）。
 */
function commitVisitOnAck(now) {
  if (pending) {
    var snap = ensureLoaded();
    var _newFvts = snap.fvts === 0 ? now : snap.fvts;
    var _newLvts = now;
    var _newTvc = pending.tvc;
    storage.set(KEY_FVTS, _newFvts);
    storage.set(KEY_LVTS, _newLvts);
    storage.set(KEY_TVC, _newTvc);
    committed = {
      fvts: _newFvts,
      lvts: _newLvts,
      tvc: _newTvc,
      isNewUser: false,
      degraded: false
    };
    loaded = committed;
    pending = null;
    return;
  }
  if (!pendingRenewal) return;
  var newFvts = pendingRenewal.fvts;
  var newLvts = now;
  var newTvc = pendingRenewal.tvc;
  storage.set(KEY_FVTS, newFvts);
  storage.set(KEY_LVTS, newLvts);
  storage.set(KEY_TVC, newTvc);
  committed = {
    fvts: newFvts,
    lvts: newLvts,
    tvc: newTvc,
    isNewUser: false,
    degraded: false
  };
  loaded = committed;
  pendingRenewal = null;
}
/**
 * 上报失败回滚：清掉 pending，下次再 build 仍基于 loaded snapshot 推进。
 *
 * **不**重置 `buildCalledInProcess`：同一进程内即使首批失败，也不允许"重新"再造一份
 * fvts/lvts 上报，避免污染。失败的批次应由 `pipeline/retry` 负责持久化重试。
 */
function rollbackPendingVisit() {
  pending = null;
  pendingRenewal = null;
}

/**
 * 入口页（entry page）记忆与 `iey / ppiey` 计算。
 *
 * 设计文档：`03-公有版架构设计.md` §4 与 `04-字段字典与平台获取矩阵.md`。
 *
 * 上行出口：
 *   - **仅 `lt=11` 携带 `iey` / `ppiey`（0/1）**；`lt=1` / `lt=3` 等事件不含入口字段。
 * 字段含义（`lt=11` 在**下一页 onShow** 采集，描述**刚离开的上一页**）：
 *   - `iey`：离开页是否为本会话**首次离开的入口页**（会话内仅第一次离开入口路由为 1）。
 *   - `ppiey`：`urlref` 指向页是否仍为**有效入口**（同上，循环回到入口后再离开不算）。
 *
 * 写入时机（`markEntryPage` 仅维护「本会话入口 path」，供 `isEntry` 与 `lt=11` 使用）：
 *   - 新会话：`clearEntry()` 后立刻 `markEntryPage(route)`（launch / app_show / 首个 page_show），
 *     使首屏/恢复后当前页成为本会话登记入口。
 *   - 同一会话内仅首个 route 生效（一会话一 entry）；后续 `markEntryPage` noop。
 *
 * 模块**不持有** lastRoute；ppiey 由调用方传入"上一页"，避免和 `adapter/route` 的
 * 当前路由职责耦合。
 */
var KEY_ENTRY = 'session:entryRoute';
var cached$3;
/** 本会话是否已离开过登记入口（离开后循环回入口不再计 iey/ppiey）。 */
var entryDeparted = false;
/**
 * 标记当前页为入口页。
 *
 * 行为：
 *   - 已存在 entry 时直接 noop（保证一会话一 entry）。
 *   - route 为空字符串 / undefined 时 noop（不污染 storage）。
 */
function markEntryPage(route) {
  if (!route) return;
  var existing = getEntryRoute();
  if (existing) return;
  storage.set(KEY_ENTRY, route);
  cached$3 = route;
}
/**
 * 当前会话的入口路径；从内存优先取，未命中读 storage。
 */
function getEntryRoute() {
  if (cached$3 !== undefined) return cached$3 || undefined;
  var r = storage.safeRead(KEY_ENTRY);
  if (!r.ok) return undefined;
  if (typeof r.value === 'string' && r.value.length > 0) {
    cached$3 = r.value;
    return r.value;
  }
  // 标注已查过，避免下次再 IO
  cached$3 = '';
  return undefined;
}
/**
 * 当前路径是否为入口页。
 *
 * route 为空时返回 false；尚未 mark 时返回 false（不会把"未知"误判为入口）。
 */
function isEntry(route) {
  if (!route) return false;
  var entry = getEntryRoute();
  return entry === route;
}
/**
 * 当前路径是否仍按入口参与 `iey` / `ppiey` 计算。
 *
 * 与 `isEntry` 区别：用户首次离开登记入口后，即使再次导航回同一路由也不再视为入口。
 */
function isEntryForIey(route) {
  if (entryDeparted) return false;
  return isEntry(route);
}
/**
 * 标记本会话已离开登记入口；后续同路由访问不再产生 `iey=1` / `ppiey=1`。
 */
function markEntryDeparted() {
  entryDeparted = true;
}
/**
 * session 切换时调用：清掉 entry，等待新会话第一次 pageShow 重新登记。
 */
function clearEntry() {
  cached$3 = '';
  entryDeparted = false;
  storage.remove(KEY_ENTRY);
}

/**
 * pages.json 导航栏标题解析（ttpj 数据源）。
 *
 * 与私有版 `utils/pageInfo.js` 对齐，按 Vue 版本分两套构建期数据源：
 *   - VUE3：`uni:stat` 插件注入 `process.env.UNI_STAT_TITLE_JSON`（JSON 字符串）；
 *   - VUE2：`require('uni-pages?{"type":"style"}')` 在应用打包阶段解析 pages.json（公有版 dist
 *     拷贝进 Vue2 工程后无法依赖 define 注入，须与私有版同路径）。
 *
 * 运行时 `getPagesJsonNavigationTitle` 等价私有版 `get_page_name`。
 */
/** VUE3 懒加载缓存；`undefined` 表示尚未解析。 */
var titleMapCache;
/**
 * VUE2 构建期：由 `uni-pages` 虚拟模块解析出的 path → title 表（模块加载时即确定）。
 */

function buildVue2TitleMapFromUniPages() {
  var titleMap = {};
  try {
    // eslint-disable-next-line no-restricted-globals
    var pagesTitle = __webpack_require__(/*! uni-pages?{"type":"style"} */ 40).default;
    var pagesData = pagesTitle === null || pagesTitle === void 0 ? void 0 : pagesTitle.pages;
    if (!pagesData || (0, _typeof2.default)(pagesData) !== 'object') return titleMap;
    for (var path in pagesData) {
      var style = pagesData[path];
      var navigationBar = style.navigationBar;
      var titleText = style.navigationBarTitleText || style.defaultTitle || (navigationBar === null || navigationBar === void 0 ? void 0 : navigationBar.titleText) || '';
      if (titleText) {
        titleMap[path] = titleText;
      }
    }
  } catch (_a) {
    // uni-pages 不可用时（单测、非 uni 打包上下文）保持空表
  }
  return titleMap;
}
var vue2TitleMap = buildVue2TitleMapFromUniPages();

/**
 * VUE3：解析并缓存 `UNI_STAT_TITLE_JSON`；解析失败或缺失时得到空表，避免重复 JSON.parse。
 */

/**
 * 取当前编译目标下的标题映射表。
 */
function getTitleMap() {
  var map = {};
  map = vue2TitleMap;
  return map;
}
/**
 * 按当前页路由取 pages.json 中的导航栏标题，供 `setConfigTitle` → 上行 `ttpj`。
 *
 * @param routePath `getCurrentRoute()` 的典型返回值（一般无前导 `/`）；允许含 query。
 * @returns 未配置或查找不到时返回空串（与私有版 `get_page_name` 一致）。
 */
function getPagesJsonNavigationTitle(routePath) {
  if (!routePath || typeof routePath !== 'string') return '';
  var pathOnly = routePath.split('?')[0].trim();
  if (!pathOnly) return '';
  var map = getTitleMap();
  var result = '';
  var direct = map[pathOnly];
  result = typeof direct === 'string' && direct.length > 0 ? direct : '';
  return result;
}

/**
 * 导航栏标题内存状态。
 *
 * 私有版 `Stat._navigationBarTitle = { page, config, report }` 三段被分散维护：
 *   - `page`：拦截 `uni.setNavigationBarTitle` → `ttn`；
 *   - `config`：构建期注入的 pages.json 映射，运行时由 `getPagesJsonNavigationTitle(route)`（等价私有版 `get_page_name`）在每次 `onShow` 写入 → `ttpj`；
 *   - `report`：`uni.report('title', value)` / `StatApp.report('title')` → `ttc`。
 *
 * 公有版集中到 `domain/title.ts`，对外仅暴露 setter / getter / clearForRoute；
 * statData 拼装时通过 `getCurrentTitle()` 一次性读出，**不再**和拦截器/路由耦合。
 */
var state$2 = {
  page: '',
  config: '',
  report: ''
};
/**
 * 由拦截器在 `setNavigationBarTitle.invoke` 时调用。
 *
 * @param title 用户设置的标题；非字符串视为空串，避免污染上行 ttn。
 */
function setPageTitle(title) {
  state$2.page = typeof title === 'string' ? title : '';
}
/**
 * 由 collector / runtime 在 onPageShow 时写入 pages.json 配置标题。
 */
function setConfigTitle(title) {
  state$2.config = typeof title === 'string' ? title : '';
}
/**
 * 业务通过 `uni.report('title', value)` 写入；与私有版 `sendEvent('title')` 行为一致。
 */
function setReportTitle(title) {
  state$2.report = typeof title === 'string' ? title : '';
}
/**
 * 取当前 title 三元组的浅拷贝；statData.builder 在拼装 ttn/ttpj/ttc 时调用。
 */
function getCurrentTitle() {
  return {
    ttn: state$2.page,
    ttpj: state$2.config,
    ttc: state$2.report
  };
}
/**
 * 切换页面时清掉 page 维度的 title（config / report 由各自 setter 控制）。
 */
function clearPageTitle() {
  state$2.page = '';
}

/**
 * 时间相关基础设施。
 *
 * 设计要点：
 *   1. 单元统一：`Sec` 后缀代表秒级；`Ms` 后缀代表毫秒级。任何函数签名都禁止"参数与
 *      返回值单元不一致"，避免私有版长期存在的"秒/毫秒混用"问题。
 *   2. 全部走 `Date.now()`，不走 `new Date().getTime()`，便于 jest fake timers / mock。
 */
/**
 * 当前毫秒级时间戳。用于上报 jitter / 节流定时器等内部计算。
 */
function nowMs() {
  return Date.now();
}
/**
 * 当前秒级时间戳。用于 statData 上行字段（`t / fvts / lvts / sst` 等）。
 */
function nowSec() {
  return Math.floor(Date.now() / 1000);
}
/**
 * 将「离开页 / 后台前当前页」停留时长（秒）钳到与私有版 `get_residence_time` 一致：
 * 差值小于 1 秒时按 1 秒上报（`residenceTime &lt; 1 ? 1 : residenceTime`）。
 *
 * @param deltaSec 非负停留秒数优先；传入负数时视为 0 再钳制。
 */
function clampUrlrefStaySec(deltaSec) {
  var d = deltaSec > 0 ? deltaSec : 0;
  return d < 1 ? 1 : d;
}

/**
 * 平台标识适配。
 *
 * 私有版 `pageInfo.js#get_platform_name` 的能力等价物，但做了三点改进：
 *   1. 类型化：返回受控 `Platform` 联合，禁止把陌生平台直接透传出去。
 *   2. 拆出 `getRawPlatform()`：返回 `process.env.UNI_PLATFORM` 原值，便于 adapter 内部
 *      做"小程序基础库分支"判断，而无需重复读 env。
 *   3. `isApp / isMp / isH5 / isNvue` 一次实现，调用方不再四处 `if (platform === 'n')`。
 *
 * 上行字段约定：
 *   - `ut` = `getPlatform()`（宿主类型：wx / h5 / n …）。
 *   - `p` = 运行设备操作系统（与私有版 `report.js` 中 `sys.platform` 语义一致），由
 *     `normalizeStatOsP()` 从 `getSystemInfo` 合并结果解析，**不得**再用仅读 `plus` 的
 *     `getClientOs()` 填小程序（否则恒为 `unknown` → 空串）。
 *   - `getClientOs()`：保留为 App 端粗分字母 'a' / 'i' / 'h'（历史逻辑），与 `p` 无强绑定。
 *
 * 注意：本模块严禁缓存平台判定结果到模块级常量。`process.env.UNI_PLATFORM` 在 SSR 与
 * 单测中可能被运行时切换；缓存会让多端测试串味。
 */
/**
 * 将 uni 系统信息中的 `platform` / `osName` / `system` 归一为上行 `p`。
 *
 * 与私有版 `report.js`（`sys.platform` → `a|i|h`）数据源一致，但输出采用完整单词，
 * 并覆盖 H5 桌面端（windows / macos / linux）。小程序依赖 `getDeviceInfo` 等合并后的
 * `platform`（如 `ios` / `android`）；`devtools` 无有效机型时再退 `system` / `osName`。
 *
 * @param info 来自 `mergedSystemInfo()` 的字段子集；均可缺省。
 * @returns 小写 OS 名；无法判断时返回空串。
 */
function normalizeStatOsP(info) {
  var _a, _b, _c, _d, _e;
  var fromToken = function fromToken(raw) {
    var s = raw.toLowerCase().trim();
    if (!s) return '';
    if (s === 'devtools') return '';
    if (s === 'android') return 'android';
    if (s === 'ios' || s === 'iphone') return 'ios';
    if (s.includes('android')) return 'android';
    if (s.includes('iphone') || s === 'iphone os' || /\bios\b/.test(s)) return 'ios';
    if (s.includes('harmony') || s === 'ohos' || s === 'openharmony') return 'harmonyos';
    if (s.includes('windows') || s === 'windows_nt') return 'windows';
    if (s === 'mac' || s === 'darwin' || s.includes('mac os') || s === 'macos') return 'macos';
    if (s.includes('linux') && !s.includes('android')) return 'linux';
    return '';
  };
  var p0 = fromToken((_a = info.platform) !== null && _a !== void 0 ? _a : '');
  if (p0) return p0;
  var p1 = fromToken((_b = info.osName) !== null && _b !== void 0 ? _b : '');
  if (p1) return p1;
  var sys = ((_c = info.system) !== null && _c !== void 0 ? _c : '').toLowerCase();
  if (sys.includes('android')) return 'android';
  if (sys.includes('iphone') || /\bios\b/.test(sys)) return 'ios';
  if (sys.includes('harmony') || sys.includes('ohos')) return 'harmonyos';
  if (sys.includes('windows')) return 'windows';
  if (sys.includes('mac os') || sys.includes('darwin')) return 'macos';
  if (sys.includes('linux')) return 'linux';
  var plus = getGlobalObject().plus;
  var p2 = fromToken((_e = (_d = plus === null || plus === void 0 ? void 0 : plus.os) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : '');
  if (p2) return p2;
  return '';
}
/**
 * 与私有版 `pageInfo.js#get_platform_name` 中 `aliArr.reverse().join('')` 等价：
 * 得到 uni-app 注入的「阿里系小程序」`UNI_PLATFORM` 原始键。
 *
 * 苹果审核会扫描源码中的敏感品牌连续词，故**禁止**在字面量中直接写出完整键名；
 * 仅通过片段拼接构造（`mp-` + `ali` + `p` + `a` + `y` 逆序拼接）。
 */
function uniPlatformMpAliRaw() {
  var parts = ['y', 'a', 'p', 'mp-ali'];
  return [].concat(parts).reverse().join('');
}
/** 私有版兼容映射：UNI_PLATFORM → 短码。 */
var PLATFORM_MAP = (_PLATFORM_MAP = {
  app: 'n',
  'app-plus': 'n',
  'app-harmony': 'n',
  'mp-harmony': 'mhm',
  h5: 'h5',
  'mp-weixin': 'wx'
}, (0, _defineProperty2.default)(_PLATFORM_MAP, uniPlatformMpAliRaw(), 'ali'), (0, _defineProperty2.default)(_PLATFORM_MAP, 'mp-baidu', 'bd'), (0, _defineProperty2.default)(_PLATFORM_MAP, 'mp-toutiao', 'tt'), (0, _defineProperty2.default)(_PLATFORM_MAP, 'mp-qq', 'qq'), (0, _defineProperty2.default)(_PLATFORM_MAP, 'mp-kuaishou', 'ks'), (0, _defineProperty2.default)(_PLATFORM_MAP, 'mp-lark', 'lark'), (0, _defineProperty2.default)(_PLATFORM_MAP, 'mp-xhs', 'xhs'), (0, _defineProperty2.default)(_PLATFORM_MAP, 'mp-jd', 'jd'), (0, _defineProperty2.default)(_PLATFORM_MAP, 'quickapp-native', 'qn'), (0, _defineProperty2.default)(_PLATFORM_MAP, 'quickapp-webview', 'qw'), _PLATFORM_MAP);
/**
 * 取 `process.env.UNI_PLATFORM` 原值，未设置返回空字符串。
 *
 * 单独抽出是为了：
 *   - 单测可以专门校验"未注入 UNI_PLATFORM"路径，不被 PLATFORM_MAP 遮蔽。
 *   - 调用方做小程序差异判断（如阿里系再细分 ali/dt）时无需再 `process.env.*`。
 */
function getRawPlatform() {
  var _a;
  return (_a = "mp-weixin") !== null && _a !== void 0 ? _a : '';
}
/**
 * 取标准化后的平台短码。
 *
 * 阿里系细分逻辑：
 *   - 命中 `uniPlatformMpAliRaw()` 对应宿主时，若 `globalThis.my.env.clientName === 'dingtalk'` → `dt`。
 *   - 其他阿里系（小程序、H5 中嵌入支付宝端等）继续返回 `'ali'`。
 *
 * 未识别平台返回 `'unknown'`，禁止把陌生 raw 值直接当作 Platform 透传，
 * 避免上行字段污染（私有版的 `return … || process.env.VUE_APP_PLATFORM` 是潜在风险点）。
 */
function getPlatform() {
  var _a;
  var raw = getRawPlatform();
  var mapped = PLATFORM_MAP[raw];
  if (!mapped) return 'unknown';
  if (mapped === 'ali') {
    var my = getGlobalObject().my;
    if (((_a = my === null || my === void 0 ? void 0 : my.env) === null || _a === void 0 ? void 0 : _a.clientName) === 'dingtalk') return 'dt';
    return 'ali';
  }
  return mapped;
}
/** 当前是否运行在 App / nvue / HarmonyOS App 端。 */
function isApp() {
  var raw = getRawPlatform();
  return raw === 'app' || raw === 'app-plus' || raw === 'app-harmony';
}
/** 当前是否运行在小程序端（含各平台）。 */
function isMp() {
  return getRawPlatform().startsWith('mp-');
}
/** 当前是否运行在 H5 端。 */
function isH5() {
  return getRawPlatform() === 'h5';
}
/**
 * 当前页面/上下文是否为 nvue。
 *
 * uni-app nvue 页面的 `__UNI_FEATURE_NVUE__` 编译期常量为 true；
 * 运行时无可靠 API，统一通过编译期 define 注入的 `globalThis.__NVUE__` 判断。
 * 没有注入则保守返回 false。
 */
function isNvue() {
  return Boolean(getGlobalObject().__NVUE__);
}

/**
 * 设备 ID 适配。
 *
 * 私有版痛点（参考 `pageInfo.js#getUuid` / `get_uuid` / `get_odid`）：
 *   - `get_uuid` 优先用 `sys.deviceId`，但 `sys` 是模块加载期 `uni.getSystemInfoSync()`
 *     的快照，SSR/早期阶段可能不存在 `deviceId` 字段，导致退化路径被频繁走到。
 *   - 退化路径里 `uni.setStorageSync(UUID_KEY, UUID_VALUE)` —— 这里 `UUID_VALUE` 是
 *     字面量字符串 `'__DC_UUID_VALUE'`，会让所有"写入失败"的设备共享同一个 uuid，
 *     直接污染统计漏斗（缺陷 #28）。
 *
 * 公有版职责：
 *   1. `getUuid()`（上行 `did`）：稳定 + 持久化。
 *      - **App / H5 / 微信小程序（`mp-weixin`）**：优先 `uni.getDeviceInfo().deviceId`，
 *        再退 `getSystemInfoSync().deviceId`、storage、本地 anon。
 *      - **其余宿主**：不走 `getDeviceInfo` 首取，直接 `getSystemInfoSync().deviceId` →
 *        storage → anon（与历史兜底一致）。
 *   2. 任何 storage / uni 调用全部走 `tryRun` 兜底，绝不抛出。
 *   3. 内存级缓存：避免每次构建 statData 都触发一次同步 storage IO。
 *   4. `__resetCache()` 仅供测试。
 *
 * 说明：老版 `odid`（`plus.device.uuid`）已移除，不再参与装配与导出。
 */
var STORAGE_KEY_UUID = 'device:uuid';
/**
 * uni-h5 `getDeviceInfo().deviceId` 的底层 localStorage 键（见 `packages/uni-h5/src/helpers/uuid.ts`）。
 *
 * H5 端直接复用同一个键读写 deviceId：绕开 uni 运行时，保证 `did` 与页面
 * `uni.getDeviceInfo().deviceId` 同源一致，且跨刷新稳定。
 */
var WEB_UUID_KEY = '__DC_STAT_UUID';
var cachedUuid = null;
/**
 * App、H5、微信小程序上优先用拆分 API `getDeviceInfo().deviceId`；其它平台保持原兜底顺序。
 */
function preferGetDeviceInfoDeviceIdFirst() {
  if (isApp() || isH5()) return true;
  return getRawPlatform() === 'mp-weixin';
}
/**
 * 读取 `uni.getSystemInfoSync().deviceId`；任何异常 / 缺失返回空串。
 *
 * 不复用 `adapter/system.getSystemInfo`：deviceId 在 uni-app 字段表里属于"敏感字段"，
 * 公有版默认不暴露在 `SystemInfoStatic` 中，仅在本 adapter 内部使用。
 */
function readSysDeviceId() {
  var root = resolveUniRuntime();
  var u = root != null && (0, _typeof2.default)(root) === 'object' ? root : undefined;
  if (!u || typeof u.getSystemInfoSync !== 'function') return '';
  return tryRun(function () {
    var _a;
    return (_a = u.getSystemInfoSync().deviceId) !== null && _a !== void 0 ? _a : '';
  }, '');
}
/**
 * 读取 `uni.getDeviceInfo().deviceId`（官方推荐的设备标识来源之一）。
 *
 * API 不存在或抛错时返回空串，由 `getUuid` 继续走 `getSystemInfoSync` / storage 兜底。
 */
function readGetDeviceInfoDeviceId() {
  var root = resolveUniRuntime();
  var u = root != null && (0, _typeof2.default)(root) === 'object' ? root : undefined;
  if (!u || typeof u.getDeviceInfo !== 'function') return '';
  return tryRun(function () {
    var _a;
    return (_a = u.getDeviceInfo().deviceId) !== null && _a !== void 0 ? _a : '';
  }, '');
}
/**
 * 生成兜底设备 id（did）：**纯数字串**，与常见线上形态一致（毫秒时间戳 + 6 位随机数，约 19 位）。
 *
 * 与 `infra/sid.genSid` 区别：uuid 设备级持久化；sid 每会话新生且带 `-xxxx-xxxx` 形后缀。
 */
function generateAnonUuid() {
  var ms = nowMs();
  var rnd = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return "".concat(ms).concat(rnd);
}
/**
 * 把设备 id 写回统计命名空间（`UNI_STAT_DATA:<appid>:device:uuid`），供后续启动读回锁定。
 * 写入失败静默吞掉，不影响本次返回。
 */
function persistUuid(uuid) {
  tryRun(function () {
    return storage.set(STORAGE_KEY_UUID, uuid);
  }, undefined);
}
/**
 * 取浏览器 `localStorage`（cookie 被禁用 / 无 localStorage 时返回 undefined）。
 *
 * 直接走 `getGlobalObject()`（globalThis / window），**绕开可能不可用的 `uni` 运行时**；
 * 与 `adapter/web.getWebInfo` 直读 `location` 同思路。
 */
function getWebLocalStorage() {
  return tryRun(function () {
    var g = getGlobalObject();
    if (g.navigator && g.navigator.cookieEnabled === false) return undefined;
    var ls = g.localStorage;
    if (ls && typeof ls.getItem === 'function' && typeof ls.setItem === 'function') {
      return ls;
    }
    return undefined;
  }, undefined);
}
/**
 * H5：直接从浏览器 `localStorage` 读取 uni-h5 写入的稳定 deviceId（`__DC_STAT_UUID`）。
 * 取不到返回空串。
 */
function readWebDeviceId() {
  var ls = getWebLocalStorage();
  if (!ls) return '';
  return tryRun(function () {
    var v = ls.getItem(WEB_UUID_KEY);
    return typeof v === 'string' ? v : '';
  }, '');
}
/**
 * H5：把 did 直接写入浏览器 `localStorage`（与 uni-h5 同键 `__DC_STAT_UUID`）。
 * 使下次刷新读回同一值，并与页面 `uni.getDeviceInfo().deviceId` 对齐。
 */
function writeWebDeviceId(uuid) {
  var ls = getWebLocalStorage();
  if (!ls) return;
  tryRun(function () {
    return ls.setItem(WEB_UUID_KEY, uuid);
  }, undefined);
}
/**
 * 从 uni 运行时解析设备 id。
 *
 * - App / H5 / 微信小程序：优先 `getDeviceInfo().deviceId`，再退 `getSystemInfoSync().deviceId`；
 *   H5 上 `getDeviceInfo().deviceId` 取自 uni-h5 持久化的 `__DC_STAT_UUID`，跨刷新稳定。
 * - 其余宿主：直接 `getSystemInfoSync().deviceId`。
 *
 * 取不到时返回空串，由 `getUuid` 继续走 storage / anon 兜底。
 */
function resolveDeviceIdFromUni() {
  if (preferGetDeviceInfoDeviceIdFirst()) {
    var fromDeviceInfo = readGetDeviceInfoDeviceId();
    if (fromDeviceInfo) return fromDeviceInfo;
  }
  return readSysDeviceId();
}
/**
 * 取设备 uuid（上行映射为 `did`）。
 *
 * 解析顺序：
 *   1. 内存缓存（同进程内恒定，保证同次启动 `did` 与 `sid` 前半段一致）。
 *   2. H5：直接读浏览器 `localStorage['__DC_STAT_UUID']`（uni-h5 写入的 deviceId）。
 *   3. uni 设备源（getDeviceInfo / getSystemInfoSync），取到即写回 storage 锁定。
 *   4. uni storage 已持久化的 did。
 *   5. uni storage 正常且无历史值 → 生成 anon 并落库。
 *   6. uni storage 读取异常：H5 直接写浏览器 localStorage 并缓存；其它端返回不缓存、不落库的临时 did。
 *
 * 任何环节失败都不抛错，最差返回新生成的临时 uuid，保证上行字段非空。
 */
function getUuid() {
  if (cachedUuid) return cachedUuid;
  // H5：直读浏览器 localStorage 的 deviceId，与页面 uni.getDeviceInfo().deviceId 同源。
  if (isH5()) {
    var fromWeb = readWebDeviceId();
    if (fromWeb) {
      cachedUuid = fromWeb;
      return cachedUuid;
    }
  }
  // uni 设备源；取到后写回 storage 锁定。
  var fromDevice = resolveDeviceIdFromUni();
  if (fromDevice) {
    persistUuid(fromDevice);
    if (isH5()) writeWebDeviceId(fromDevice);
    cachedUuid = fromDevice;
    return cachedUuid;
  }
  // 设备源不可用：回落到 uni storage 已持久化的 did。
  // safeRead 区分「确无历史值」与「storage 读取异常」，后者不落库以免覆盖真实值。
  var storedRead = storage.safeRead(STORAGE_KEY_UUID);
  if (storedRead.ok) {
    var stored = storedRead.value;
    if (typeof stored === 'string' && stored.length > 0) {
      if (stored.startsWith('device-anon-')) {
        var upgraded = generateAnonUuid();
        persistUuid(upgraded);
        if (isH5()) writeWebDeviceId(upgraded);
        cachedUuid = upgraded;
        return cachedUuid;
      }
      cachedUuid = stored;
      return cachedUuid;
    }
    // 无历史值 → 首次生成并落库。
    var generated = generateAnonUuid();
    persistUuid(generated);
    if (isH5()) writeWebDeviceId(generated);
    cachedUuid = generated;
    return cachedUuid;
  }
  // uni storage 读取异常。
  var ephemeral = generateAnonUuid();
  if (isH5()) {
    // H5 写浏览器 localStorage 并缓存，下次刷新读回同一值。
    writeWebDeviceId(ephemeral);
    cachedUuid = ephemeral;
    return cachedUuid;
  }
  // 其它端：临时 did，不缓存、不落库，避免覆盖磁盘上可能仍存在的真实 did。
  return ephemeral;
}

/**
 * 会话 ID 生成器。
 *
 * 形如（与典型调试示例一致）：
 *   - 有 did（uuid）：`${did}-${8位base36}-${4位base36}`，例如 `1777261806777339018-moih1mhr-40gn`
 *   - 无 did：先生成与兜底 did 同形的数字主体，再拼同样后缀（避免 `anon-` 前缀）。
 *
 * 设计要点：
 *   1. 长度可控，避免上报字段超限。
 *   2. 仅依赖 `Math.random` 与 `Date.now`，不引入 crypto。
 */
var SUFFIX_HEAD_LEN = 8;
var SUFFIX_TAIL_LEN = 4;
/**
 * 生成 base36 随机串。
 *
 * @param len 期望长度；不足时用 '0' **末尾填充**（`padEnd`）补齐，保证长度稳定。
 */
function randomPart(len) {
  var r = Math.random().toString(36).slice(2, 2 + len);
  return r.length >= len ? r : r.padEnd(len, '0');
}
/**
 * 会话实例后缀：`xxxxxxxx-xxxx`（与常见上报示例形态一致）。
 */
function sessionInstanceSuffix() {
  return "".concat(randomPart(SUFFIX_HEAD_LEN), "-").concat(randomPart(SUFFIX_TAIL_LEN));
}
/**
 * 无设备 id 时的数字主体（与 device 兜底 did 生成规则对齐，避免引入循环依赖故略重复）。
 */
function anonNumericBody() {
  var ms = nowMs();
  var rnd = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return "".concat(ms).concat(rnd);
}
/**
 * 生成会话 ID。`uuid` 为空字符串 / undefined 时退化为「数字主体 + 后缀」。
 */
function genSid(uuid) {
  if (uuid && uuid.length > 0) {
    return "".concat(uuid, "-").concat(sessionInstanceSuffix());
  }
  return "".concat(anonNumericBody(), "-").concat(sessionInstanceSuffix());
}

/**
 * 客户端会话状态机（公有版核心新增）。
 *
 * 设计文档：`03-公有版架构设计.md` §3。
 *
 * 状态：
 *   - `None`：未生成过 session（首次启动 / clearStorage 后）。
 *   - `Active`：前台有有效 session，可继续 touch 推进 lastActive。
 *   - `Background`：应用进入后台，等待返回前台时判定是否超时。
 *
 * 触发器 → cst 映射：
 *   - `cold_launch`：进程冷启动 → cst=1。
 *   - `app_show` (从后台返回)：
 *       - now - bgTs >= backgroundTimeoutSec → 新 session, cst=2（与私有版 pageTime
 *         可读性对齐：配置为 10 秒时，隐藏端与显示端秒戳相差 10 即视为超时）。
 *       - 否则复用旧 session, cst=0。
 *   - `wx_scene_changed`：scene 与上次不同 → 新 session, cst=2。
 *   - `page_show` (前台已有 session)：
 *       - now - lastActive >= pageInactiveTimeoutSec → 新 session, cst=3。
 *       - 否则 touch & 复用, cst=0。
 *
 * 关键设计：所有 storage 操作都带 try / safeRead 兜底；任何路径都不抛异常，
 * 失败 → 退化生成新 session，避免阻塞采集链路。
 */
var KEY_SID = 'session:id';
var KEY_SST = 'session:start';
var KEY_SCT = 'session:sct';
var KEY_SEQ = 'session:seq';
var KEY_LAST_ACTIVE = 'session:lastActive';
var KEY_BG_TS = 'session:bgTs';
var KEY_LAST_SCENE = 'session:lastScene';
var DEFAULT_CONFIG = {
  backgroundTimeoutSec: 300,
  pageInactiveTimeoutSec: 1800
};
var config$1 = Object.assign({}, DEFAULT_CONFIG);
var cached$2 = null;
/** 配置注入（runtime/install.ts 在启动时调一次）。 */
function configure$1(c) {
  config$1 = Object.assign({}, DEFAULT_CONFIG, c);
}
/**
 * 工具：把 storage 读取到的值转 number；非法值返回 0。
 */
function readNum(key) {
  var r = storage.safeRead(key);
  if (!r.ok) return 0;
  var v = r.value;
  if (typeof v === 'number' && Number.isFinite(v) && v >= 0) return v;
  if (typeof v === 'string' && v.length > 0) {
    var _n3 = Number(v);
    if (Number.isFinite(_n3) && _n3 >= 0) return _n3;
  }
  return 0;
}
function readStr(key) {
  var r = storage.safeRead(key);
  if (!r.ok) return '';
  return typeof r.value === 'string' ? r.value : '';
}
/**
 * 计算 `now - from` 的非负秒差，防止设备时钟回拨（NTP 校时 / 用户手动改时间）导致
 * `elapsed < 0` 使后台 / 无操作超时判定**永不触发**、会话被异常拉长。
 *
 * 与 `infra/time.elapsedSec` 同语义（负值钳零），此处因状态机入参 `now` 由调用方注入、
 * 不直接走 `nowSec()`，故就地实现保持纯函数可测。
 */
function elapsedNonNeg(now, from) {
  var diff = now - from;
  return diff > 0 ? diff : 0;
}
/**
 * 从 storage 重建 snapshot；任意字段缺失返回 null。
 */
function loadFromStorage() {
  var sid = readStr(KEY_SID);
  if (!sid) return null;
  return {
    sid: sid,
    sst: readNum(KEY_SST),
    sct: readNum(KEY_SCT) || CST.ColdLaunch,
    seq: readNum(KEY_SEQ),
    lastActive: readNum(KEY_LAST_ACTIVE),
    bgTs: readNum(KEY_BG_TS),
    lastScene: readStr(KEY_LAST_SCENE)
  };
}
function ensureCache() {
  if (cached$2 !== null) return cached$2;
  cached$2 = loadFromStorage();
  return cached$2;
}
/**
 * 创建一个新 session，写入 storage 并返回新的 snapshot。
 *
 * 内部职责：
 *   - 重置 seq=0、lastActive=now、bgTs=0。
 *
 * 注：原"上一会话 sid（pid）"机制已移除——参数文档无 pid 字段，后端无入库口径，
 *     新会话的字段仅随当次 lt=1 携带。
 */
function createNew(now, sct, scene) {
  var sid = genSid(getUuid());
  var next = {
    sid: sid,
    sst: now,
    sct: sct,
    seq: 0,
    lastActive: now,
    bgTs: 0,
    lastScene: scene
  };
  storage.set(KEY_SID, sid);
  storage.set(KEY_SST, now);
  storage.set(KEY_SCT, sct);
  storage.set(KEY_SEQ, 0);
  storage.set(KEY_LAST_ACTIVE, now);
  storage.set(KEY_BG_TS, 0);
  storage.set(KEY_LAST_SCENE, scene);
  cached$2 = next;
  return next;
}
/**
 * 主入口：根据 trigger 与上下文，确保 session 处于正确状态。
 *
 * 结果包含 isNew / cst，供 lifecycleHooks 决定本次 lt=1 是否携带 fvts/lvts/tvc。
 */
function ensureSession(t, ctx) {
  var now = ctx.now,
    _ctx$scene = ctx.scene,
    scene = _ctx$scene === void 0 ? '' : _ctx$scene;
  var snap = ensureCache();
  if (t === 'cold_launch') {
    var created = createNew(now, CST.ColdLaunch, scene);
    return {
      snapshot: created,
      isNew: true,
      cst: CST.ColdLaunch
    };
  }
  if (!snap) {
    // 没有现存 session（罕见：app_show 但 storage 被清）→ 视为冷启动
    var _created = createNew(now, CST.ColdLaunch, scene);
    return {
      snapshot: _created,
      isNew: true,
      cst: CST.ColdLaunch
    };
  }
  if (t === 'app_show') {
    var enterCandidates = [];
    if (ctx.backgroundEnteredAt && ctx.backgroundEnteredAt > 0) {
      enterCandidates.push(ctx.backgroundEnteredAt);
    }
    if (snap.bgTs > 0) {
      enterCandidates.push(snap.bgTs);
    }
    var enterTs = enterCandidates.length > 0 ? Math.min.apply(Math, enterCandidates) : 0;
    var _elapsed = enterTs > 0 ? elapsedNonNeg(now, enterTs) : elapsedNonNeg(now, snap.lastActive);
    var sceneChanged = !!scene && !!snap.lastScene && scene !== snap.lastScene;
    var fromBackground = enterTs > 0;
    if (sceneChanged || fromBackground && _elapsed >= config$1.backgroundTimeoutSec) {
      var _created2 = createNew(now, CST.BackgroundTimeout, scene);
      return {
        snapshot: _created2,
        isNew: true,
        cst: CST.BackgroundTimeout
      };
    }
    // 未超时：清 bgTs，更新 lastActive
    touch(now);
    storage.set(KEY_BG_TS, 0);
    if (cached$2) cached$2.bgTs = 0;
    return {
      snapshot: cached$2,
      isNew: false,
      cst: 0
    };
  }
  if (t === 'wx_scene_changed') {
    if (scene && scene !== snap.lastScene) {
      var _created3 = createNew(now, CST.BackgroundTimeout, scene);
      return {
        snapshot: _created3,
        isNew: true,
        cst: CST.BackgroundTimeout
      };
    }
    return {
      snapshot: snap,
      isNew: false,
      cst: 0
    };
  }
  // page_show：判定前台无操作超时
  var elapsed = elapsedNonNeg(now, snap.lastActive);
  if (elapsed >= config$1.pageInactiveTimeoutSec) {
    var _created4 = createNew(now, CST.PageInactiveTimeout, scene || snap.lastScene);
    return {
      snapshot: _created4,
      isNew: true,
      cst: CST.PageInactiveTimeout
    };
  }
  touch(now);
  return {
    snapshot: cached$2,
    isNew: false,
    cst: 0
  };
}
/**
 * 标记应用进入后台。写入 bgTs，供下次 app_show 判定超时。
 */
function markBackground(now) {
  if (!cached$2) cached$2 = loadFromStorage();
  if (!cached$2) return;
  storage.set(KEY_BG_TS, now);
  cached$2.bgTs = now;
}
/**
 * 更新 lastActive；page_show 与**用户主动行为事件**（collector 在收到 lt=21 自定义/
 * 拦截器事件时调用）触发。这样「前台无操作超时（cst=3）」与文档「无任何 page/event
 * 触达」语义一致：用户持续点按但不翻页时不会被误判为无操作而开新会话。
 */
function touch(now) {
  if (!cached$2) cached$2 = loadFromStorage();
  if (!cached$2) return;
  storage.set(KEY_LAST_ACTIVE, now);
  cached$2.lastActive = now;
}
/**
 * 取下一个 seq；先递增 storage 中的 seq，再返回新值。
 *
 * 失败兜底：若 storage 异常，仍以内存 cached.seq 自增；保证序号单调，但跨进程可能跳号。
 */
function nextSeq() {
  if (!cached$2) cached$2 = loadFromStorage();
  if (!cached$2) return 0;
  var next = cached$2.seq + 1;
  cached$2.seq = next;
  storage.set(KEY_SEQ, next);
  return next;
}
/** 取当前 snapshot；未初始化时尝试从 storage 加载，仍为空返回 null。 */
function getSnapshot() {
  return ensureCache();
}
/**
 * 同步更新 session 的 lastScene，不触发新会话。
 *
 * 用于同一次回前台多 hook 携带不同 scene 时，避免重复 lt=1 后补写正确 scene。
 */
function syncLastScene(scene) {
  if (!scene) return;
  if (!cached$2) cached$2 = loadFromStorage();
  if (!cached$2) return;
  storage.set(KEY_LAST_SCENE, scene);
  cached$2.lastScene = scene;
}

/**
 * 页面路由适配。
 *
 * 私有版痛点（参考 `pageInfo.js#get_route / get_page_route / get_page_vm`）：
 *   - `get_page_route` 失败兜底用 `uni.getStorageSync('_STAT_LAST_PAGE_ROUTE')`，
 *     但这个 key 写入位置散落在 `report.js` 多处，时序复杂、容易脏。
 *   - 百度小程序 `_self.$mp.page.is` 取页面路由，逻辑硬编码在 `get_route` 里，
 *     新平台进来必须改这一处主流程。
 *   - `get_page_vm` 直接调 `getCurrentPages()`：在 `onHide` 之后窗口栈可能为空。
 *
 * 公有版职责：
 *   1. `getCurrentRoute()`：稳定获取当前页 path，支持显式传入 pageVm 与多端兜底。
 *   2. `getCurrentRouteWithQuery()`：取带 query 的完整 fullPath。
 *   3. `parseQuery()`：解析 query string 为对象（不依赖 url-search-params，nvue 兼容）。
 *   4. 全部 try/catch，永远返回 `string` / `object`，不返回 undefined。
 *
 * 与私有版兼容：上行字段 `url`（不含 query）/ `urlref`（前页 url）等仍由
 * `domain/statData` 拼装，本层只提供原料。
 */
/**
 * 判定当前 vm 是页面还是应用（对齐私有版 `pageInfo.js#get_page_types`）。
 *
 * Vue2 下应用前后台走 mixin 的 App `onShow` / `onHide`，不能仅靠 `uni.onAppShow`。
 */
function getPageVmType(vm) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  if (!vm) return null;
  var internalMpType = (_c = (_b = (_a = vm.$) === null || _a === void 0 ? void 0 : _a.type) === null || _b === void 0 ? void 0 : _b.mpType) !== null && _c !== void 0 ? _c : (_d = vm.type) === null || _d === void 0 ? void 0 : _d.mpType;
  if (vm.mpType === 'page' || vm.$mpType === 'page' || ((_e = vm.$mp) === null || _e === void 0 ? void 0 : _e.mpType) === 'page' || ((_f = vm.$options) === null || _f === void 0 ? void 0 : _f.mpType) === 'page' || internalMpType === 'page') {
    return 'page';
  }
  if (vm.mpType === 'app' || vm.$mpType === 'app' || ((_g = vm.$mp) === null || _g === void 0 ? void 0 : _g.mpType) === 'app' || ((_h = vm.$options) === null || _h === void 0 ? void 0 : _h.mpType) === 'app' || internalMpType === 'app') {
    return 'app';
  }
  return null;
}
/**
 * 取栈顶页面实例（vm）。
 *
 * 优先 `getCurrentPages()`；若不可用或栈为空返回 `undefined`。
 */
function getTopPageVm() {
  var _a;
  var fn = getGlobalObject().getCurrentPages;
  if (typeof fn !== 'function') return undefined;
  var pages = tryRun(function () {
    return fn();
  }, []) || [];
  if (!Array.isArray(pages) || pages.length === 0) return undefined;
  var top = pages[pages.length - 1];
  return (_a = top === null || top === void 0 ? void 0 : top.$vm) !== null && _a !== void 0 ? _a : top;
}
/**
 * 取当前页面路径（不含 query）。
 *
 * 取值顺序：
 *   1. 显式 pageVm 优先（mixin 收到的 self/this）。
 *   2. 百度小程序：`vm.$mp.page.is` / `vm.$scope.is`。
 *   3. 通用：`vm.route` → `vm.$scope.route` → `vm.$mp.page.route`。
 *   4. 取栈顶 page 兜底。
 *   5. 全失败返回 ''。
 */
function getCurrentRoute(pageVm) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
  var vm = pageVm !== null && pageVm !== void 0 ? pageVm : getTopPageVm();
  if (!vm) return '';
  if (getPlatform() === 'bd') {
    var r = (_e = (_c = (_b = (_a = vm.$mp) === null || _a === void 0 ? void 0 : _a.page) === null || _b === void 0 ? void 0 : _b.is) !== null && _c !== void 0 ? _c : (_d = vm.$scope) === null || _d === void 0 ? void 0 : _d.is) !== null && _e !== void 0 ? _e : '';
    if (r) return r;
  }
  return (_l = (_h = (_f = vm.route) !== null && _f !== void 0 ? _f : (_g = vm.$scope) === null || _g === void 0 ? void 0 : _g.route) !== null && _h !== void 0 ? _h : (_k = (_j = vm.$mp) === null || _j === void 0 ? void 0 : _j.page) === null || _k === void 0 ? void 0 : _k.route) !== null && _l !== void 0 ? _l : '';
}
/**
 * 取当前页 fullPath（含 query）；无 query 返回与 `getCurrentRoute` 一致。
 *
 * 取值顺序：vm.$page.fullPath → vm.$scope.$page.fullPath → 退化 route。
 * 与私有版一致：fullPath === '/' 时退到 route，避免根路径 query 丢失。
 */
function getCurrentRouteWithQuery(pageVm) {
  var _a, _b;
  var vm = pageVm !== null && pageVm !== void 0 ? pageVm : getTopPageVm();
  if (!vm) return '';
  var page = (_a = vm.$page) !== null && _a !== void 0 ? _a : (_b = vm.$scope) === null || _b === void 0 ? void 0 : _b.$page;
  if (page) {
    if (page.fullPath && page.fullPath !== '/') return page.fullPath;
    if (page.route) return page.route;
  }
  return getCurrentRoute(vm);
}

/**
 * 应用生命周期 + 场景值适配。
 *
 * 公有版职责：
 *   1. 把 `uni.onAppShow / onAppHide / onLaunch` 这一组事件抽象成"订阅 + 解绑"形式，
 *      供 `domain/session` 与 `pipeline/collector` 复用，避免业务层直接吃 uni API。
 *   2. 兜底所有调用：uni 缺失时 unsubscribe 为 noop，订阅失败不抛。
 *   3. `getLaunchScene()`：私有版 `get_scene` 仅限 wx，公有版补全 mp-qq / mp-toutiao /
 *      mp-baidu / 阿里系小程序宿主 / mp-lark / mp-kuaishou，并允许覆写（页面自带 scene）。
 *
 * 注意：本模块不维护订阅注册表（去重逻辑由 `infra/interceptor` 与 `runtime/install`
 * 处理），保持单一职责。
 */
function getUni$8() {
  var u = resolveUniRuntime();
  return u != null && (0, _typeof2.default)(u) === 'object' ? u : undefined;
}
/**
 * 启动时取场景值。优先级：
 *   1. 调用方显式传入 `override`（如页面 onLoad 收到的 options.scene）。
 *   2. `uni.getLaunchOptionsSync().scene`（多端通用）。
 *   3. 不识别的平台返回空字符串。
 *
 * 公有版扩展：所有小程序宿主（`mp-*`，含 wx/qq/tt/bd/阿里系/lark/ks/xhs/jd/harmony 等）
 * 均支持 `getLaunchOptionsSync().scene`，故统一以 `isMp()` 判定，避免逐个平台维护白名单时
 * 漏掉新增小程序端导致 scene 恒为空（H5 / App / 快应用无场景值，返回空串）。
 */
function getLaunchScene(override) {
  if (override !== undefined && override !== null && override !== '') {
    return String(override);
  }
  var u = getUni$8();
  if (typeof (u === null || u === void 0 ? void 0 : u.getLaunchOptionsSync) !== 'function') return '';
  // 仅小程序宿主有有意义的 scene；其它端即便存在 getLaunchOptionsSync 也无场景值。
  if (!isMp()) return '';
  return tryRun(function () {
    var opts = u.getLaunchOptionsSync();
    var scene = opts === null || opts === void 0 ? void 0 : opts.scene;
    return scene === undefined || scene === null ? '' : String(scene);
  }, '');
}

/**
 * uniPush ClientID 适配。
 *
 * 私有版（`core/stat.js#pushEvent`）逻辑：
 *   - 调 `uni.getPushClientId({ success(res){ cid = res.cid } })`，无 cid 直接丢弃。
 *   - 没有超时；某些机型 push 服务异常时，回调永远不来，导致这次 launch 的 push 上报丢失。
 *   - 返回值包在 success 回调里，无法 await，不便 pipeline 串接。
 *
 * 公有版职责：
 *   1. `getPushClientId({ enabled, timeoutMs })` 返回 `Promise<PushClientResult>`，
 *      永不 reject；超时 / 失败 / 关闭统一返回 `{ ok: false, cid: '' }`。
 *   2. `enabled` 默认 false（合规要求显式开启）；调用方应从 `config.uniPushClientID`
 *      透传。
 *   3. 不缓存：业务方需要会话维度复用时在 `domain/push.ts` 中缓存（待 Phase 5 接入）。
 */
function getUni$7() {
  var u = resolveUniRuntime();
  return u != null && (0, _typeof2.default)(u) === 'object' ? u : undefined;
}
/**
 * 异步取 push clientId。
 *
 * 任意异常路径都 resolve（永不 reject），调用方只需根据 `ok` 字段判断是否上报。
 */
function getPushClientId() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _opts$enabled = opts.enabled,
    enabled = _opts$enabled === void 0 ? false : _opts$enabled,
    _opts$timeoutMs = opts.timeoutMs,
    timeoutMs = _opts$timeoutMs === void 0 ? 3000 : _opts$timeoutMs;
  return new Promise(function (resolve) {
    if (!enabled) {
      resolve({
        ok: false,
        cid: '',
        reason: 'disabled'
      });
      return;
    }
    var u = getUni$7();
    if (!u || typeof u.getPushClientId !== 'function') {
      resolve({
        ok: false,
        cid: '',
        reason: 'unsupported'
      });
      return;
    }
    var settled = false;
    var finish = function finish(r) {
      if (settled) return;
      settled = true;
      resolve(r);
    };
    var timer = setTimeout(function () {
      return finish({
        ok: false,
        cid: '',
        reason: 'timeout'
      });
    }, timeoutMs);
    tryRun(function () {
      return u.getPushClientId({
        success: function success(res) {
          clearTimeout(timer);
          var cid = typeof (res === null || res === void 0 ? void 0 : res.cid) === 'string' ? res.cid : '';
          if (!cid) {
            finish({
              ok: false,
              cid: '',
              reason: 'fail'
            });
            return;
          }
          finish({
            ok: true,
            cid: cid
          });
        },
        fail: function fail() {
          clearTimeout(timer);
          finish({
            ok: false,
            cid: '',
            reason: 'fail'
          });
        }
      });
    }, undefined);
  });
}

/**
 * 生命周期 → collector 调度桥。
 *
 * 把 vue mixin / `uni.onAppShow|onAppHide` / push clientId 这些"运行时事件源"
 * 翻译成 collector 的 `report({lt, ...})` 调用，统一处理：
 *   - 会话状态机（ensureSession / markBackground）。
 *   - 入口页登记（entryPage）。
 *   - lastRoute / urlref / urlref_ts 维护。
 *   - 新会话首报：仅发一条 `lt=1`（Launch），新会话字段（sid/cst/fvts/lvts/tvc）随之上行；
 *     `app_show` 新 sid 后立即 **flush(true)**；`page_show`（cst=3）新 sid 在本轮 lt=11
 *     入队后 **flush(true)**（同批内 `LT_ORDER` 保证 lt=1 先于 lt=11）。与 `app_hide` 的
 *     lt=3+flush 一并降低「锚点未送达、后续已用新 sid」的丢失风险（与参数文档对齐；
 *     不再发已废弃的 `lt=0`）。
 *   - push CID 异步抓取后再发 `lt=101`，超时 / 失败静默丢弃。
 *
 * 暴露：
 *   - `bindLifecycle(app, opts?)`：返回 mixin / onAppShow / onAppHide 句柄与
 *     unbind 函数，runtime/install.ts 据此装到 vue & uni 上。
 *   - 内部句柄（`onLaunch / onAppShow / onAppHide / onPageShow / onPageHide / onError`）
 *     单独导出便于单测精准触发。
 *
 * 注意：本模块**不直接**依赖任何 adapter（除 `getCurrentRoute*` 与 `getLaunchScene`），
 * adapter 调用全部走 `tryRun` 兜底，单端缺失不影响调度。
 */
var EMPTY_TITLE_SNAP = {
  ttn: '',
  ttpj: '',
  ttc: ''
};
/** 模块级状态。`bindLifecycle` 返回的 unbind 仅断订阅，不重置 state。 */
var state$1 = {
  lastRoute: '',
  lastRouteFull: '',
  beforeLastRoute: '',
  beforeLastRouteFull: '',
  lastRouteEnterTime: 0,
  lastPageTitleSnap: Object.assign({}, EMPTY_TITLE_SNAP),
  lastIey: false,
  prevIey: false,
  isHide: false,
  wasBackgrounded: false,
  pendingBackgroundResume: false,
  backgroundEnteredAt: 0,
  suppressNextPageLogAfterResume: false,
  backgroundResumeLt1At: 0
};
/** Vue2 H5 hide 过程中偶发 page onShow（间隔≈0s），低于此阈值不消费 pending。 */
var BACKGROUND_RESUME_DEBOUNCE_SEC = 1;
/** 同一次回前台多 hook 重复 lt=1 的去重窗口（秒）。 */
var BACKGROUND_RESUME_LT1_DEDUP_SEC = 3;
/** 小程序等：page onHide 延迟判定「真进后台」；切页会在短时内 onShow 并取消。 */
var PAGE_APP_HIDE_DEFER_MS = 120;
var pageAppHideDeferTimer;
/**
 * Vue3 小程序等已绑定 `uni.onAppShow` 时，后台恢复应仅由 `handleAppShow` 消费。
 *
 * mixin / page onShow 过早消费会在 QQ 等端与 uni 回调形成双 hook，且 scene 不一致
 * （如 2001 vs 1011）导致重复 lt=1。Vue2 / H5 仍走 mixin 提前消费以适配 Page 先于 App onShow。
 */
function shouldEarlyConsumeBackgroundResumeInMixin() {
  return !shouldBindUniAppLifecycle();
}
/**
 * 记录本进程内最近一次后台恢复 lt=1 上报时刻。
 */
function markBackgroundResumeLt1Emitted(now) {
  state$1.backgroundResumeLt1At = now;
}
/**
 * 同一次回前台是否已在去重窗口内上报过后台恢复 lt=1。
 */
function shouldSkipDuplicateBackgroundResumeLt1(now) {
  return state$1.backgroundResumeLt1At > 0 && now - state$1.backgroundResumeLt1At <= BACKGROUND_RESUME_LT1_DEDUP_SEC;
}
/**
 * 取消 page onHide 触发的延迟进后台判定（Vue2/Vue3 共用）。
 */
function cancelPageAppHideDefer() {
  if (pageAppHideDeferTimer !== undefined) {
    clearTimeout(pageAppHideDeferTimer);
    pageAppHideDeferTimer = undefined;
  }
}
/**
 * H5 进后台时部分工程只触发 page onHide（Vue2/Vue3 均可能出现），
 * 需在 visibility 已为 hidden 时补记 lt=3；普通切页不会满足 hidden。
 */
function tryAppHideFromPageOnHideWhenH5Hidden(app, opts) {
  var _a;
  if (!isH5()) return;
  if (state$1.pendingBackgroundResume) return;
  var vis = (_a = globalThis.document) === null || _a === void 0 ? void 0 : _a.visibilityState;
  if (vis === 'hidden') {
    handleAppHide(app, opts);
  }
}
/**
 * 小程序等非 H5：page onHide 后短时延迟补记 lt=3；若随后 page onShow 则取消（切页）。
 */
function tryAppHideFromPageOnHideWhenMpDefer(app, opts) {
  if (isH5()) return;
  if (state$1.pendingBackgroundResume) return;
  cancelPageAppHideDefer();
  pageAppHideDeferTimer = setTimeout(function () {
    pageAppHideDeferTimer = undefined;
    if (state$1.pendingBackgroundResume) return;
    handleAppHide(app, opts);
  }, PAGE_APP_HIDE_DEFER_MS);
}

/**
 * Vue2 部分端进后台只触发 page onHide，须在此时补 `handleAppHide`。
 *
 * 普通切页也会触发 page onHide，**不能**无条件补记（否则多报 lt=3）。
 * 对齐私有版 `pageHide`：仅当 `__licationHide` 为真时不再发页面离开；此处等价于：
 *   - H5：`document.visibilityState === 'hidden'` 才补记；
 *   - 其它端：短时延迟，若下一页 onShow 则取消（切页），否则视为进后台。
 */
function tryVue2AppHideFromPageOnHide(app, opts) {
  if (state$1.pendingBackgroundResume) return;
  if (isH5()) {
    tryAppHideFromPageOnHideWhenH5Hidden(app, opts);
    return;
  }
  tryAppHideFromPageOnHideWhenMpDefer(app, opts);
}

/**
 * 取 collector；未 install 时返回 undefined（调用方需负责 noop）。
 */
function safeCollector(app) {
  return app.getCollector();
}
/**
 * 将 onLaunch / onShow 透传的 path 归一为 `markEntryPage` 使用的 route（去 query、去前导 `/`）。
 *
 * 与 `getCurrentRoute()` 常见返回值对齐，避免入口登记与实际页面 path 不一致。
 */
function normalizePathForEntryMark(raw) {
  var _a;
  if (!raw || typeof raw !== 'string') return '';
  var noQuery = (_a = raw.split('?')[0]) !== null && _a !== void 0 ? _a : '';
  return noQuery.startsWith('/') ? noQuery.slice(1) : noQuery;
}
/**
 * 新会话首报：仅发一条 `lt=1`（Launch），新会话字段随之上行。
 *
 * 重要约束（修复 lvts=0 / lvts 缺失缺陷）：
 *   - 进程内首次 lt=1（cold_launch）调用 `buildVisitFields`；
 *   - cst=2/3 新会话 lt=1 调用 `buildVisitFieldsForSessionRenewal`，仍携带 fvts/lvts/tvc，
 *     避免 lvts 缺失被服务端误判为新用户。
 *   - 通过 `firstVisitEmittedInProcess` 哨兵区分上述两条路径。
 *   - `cst` 入参仅用于将来可能的本地侧打印 / 监控；上行字段已由 statData 从 session
 *     snapshot 中读取（出口字段名为 `cst`）。
 *   - `url` 参数：参数文档要求 `lt=1` 携带当前启动页的完整 url；冷启动 / app_show
 *     可从 launch options.path 兜底；page_show 触发的 cst=3 由调用方直接传当前页路径。
 */
function reportNewSession(c, _cst, scene, now, attachVisit) {
  var url = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
  var visit;
  if (attachVisit && !firstVisitEmittedInProcess) {
    firstVisitEmittedInProcess = true;
    visit = tryRun(function () {
      return buildVisitFields(now);
    }, undefined);
  } else {
    // 续会话（attachVisit=false），或同进程内冷启 lt=1 已发过又被二次触发
    // （attachVisit=true 但 firstVisitEmittedInProcess 已 true）：都复用 renewal 字段，
    // 确保 lt=1 始终携带 fvts/lvts/tvc，杜绝"裸 lt=1 缺 lvts 被服务端按新增计入"。
    visit = tryRun(function () {
      return buildVisitFieldsForSessionRenewal(now);
    }, undefined);
  }
  var payload = {
    lt: LT.Launch,
    t: now,
    sc: scene,
    visit: visit
  };
  // url 仅当非空时携带；避免 lt=1 上行体出现 url=""（参数文档要求 url 至多 255 字符，但允许缺省）。
  if (url) payload.url = url;
  c.report(payload);
}
/** 进程内是否已发过首批访问字段（fvts/lvts/tvc）。 */
var firstVisitEmittedInProcess = false;
/**
 * 标题三元组快照代数：hide 优先写入快照并 ++；show 尾部 microtask 携带快照时的代数，
 * 若已被 hide 抢先递增则丢弃 microtask，避免「新页刚灌的 ttpj」顶替「离开页」应有的 ttn/ttc。
 */
var titleSnapGeneration = 0;
/** 在同步栈清空后再采样标题，确保晚于页面自己的 onShow / setNavigationBarTitle。 */
function scheduleDeferredTitleSnapshot() {
  var gen = titleSnapGeneration;
  var run = typeof queueMicrotask === 'function' ? queueMicrotask : function (fn) {
    void Promise.resolve().then(fn);
  };
  run(function () {
    tryRun(function () {
      if (gen !== titleSnapGeneration) return;
      state$1.lastPageTitleSnap = Object.assign({}, getCurrentTitle());
    }, undefined);
  });
}
/**
 * App.onLaunch：冷启动入口。
 *
 * 流程：
 *   1. ensureSession('cold_launch') → cst=1，必产新 session。
 *   2. 发一条 lt=1（携带 sid/cst/fvts/lvts/tvc/sc/url）。
 *   3. 异步抓 push CID，成功后发 lt=101。
 *   4. 兜底 onLaunch options 可能携带 scene / path（小程序）；path 透传成 lt=1 的 url。
 */
function handleLaunch(app) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var c = safeCollector(app);
  if (!c) return;
  var now = nowSec();
  var scene = tryRun(function () {
    return getLaunchScene(options.scene);
  }, '');
  var result = tryRun(function () {
    return ensureSession('cold_launch', {
      now: now,
      scene: scene
    });
  }, null);
  if (!result) return;
  // 冷启动同样视为新会话：清旧入口登记，再按 launch path 登记入口，最后发 lt=1（不含 iey，入口仅 lt=11）。
  tryRun(function () {
    return clearEntry();
  }, undefined);
  var url = options.path || '';
  var entryKey = normalizePathForEntryMark(url);
  if (entryKey) {
    tryRun(function () {
      return markEntryPage(entryKey);
    }, undefined);
  }
  reportNewSession(c, result.cst || CST.ColdLaunch, scene, now, true, url);
  if (opts.enablePush) {
    void getPushClientId({
      enabled: true,
      timeoutMs: opts.pushTimeoutMs
    }).then(function (r) {
      if (!r.ok || !r.cid) return;
      var c2 = safeCollector(app);
      if (!c2) return;
      c2.report({
        lt: LT.Push,
        cid: r.cid,
        t: nowSec()
      });
    }).catch(function (e) {
      return logger.warn('[uni统计 2.0] push cid fetch failed', e);
    });
  }
}
/**
 * 消费「从后台回前台」会话判定（cst=2）；返回 true 表示已处理（含防抖跳过但仍保留 pending）。
 *
 * Vue2：Page onShow 常早于 App onShow，且 hide 过程中可能误触发一次 page onShow，
 * 若在那时清空 pending/wasBackgrounded，App onShow 将看不到后台标记（用户截图现象）。
 */
function tryConsumeBackgroundResume(app) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _from = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'unknown';
  if (!state$1.pendingBackgroundResume) {
    return false;
  }
  var bgEnterAt = state$1.backgroundEnteredAt;
  if (bgEnterAt <= 0) {
    return false;
  }
  var c = safeCollector(app);
  if (!c) {
    return false;
  }
  var now = nowSec();
  var elapsed = now - bgEnterAt;
  if (elapsed < BACKGROUND_RESUME_DEBOUNCE_SEC) {
    state$1.suppressNextPageLogAfterResume = true;
    return true;
  }
  state$1.wasBackgrounded = false;
  state$1.suppressNextPageLogAfterResume = true;
  state$1.lastRouteEnterTime = now;
  var scene = tryRun(function () {
    return getLaunchScene(options.scene);
  }, '');
  var result = tryRun(function () {
    return ensureSession('app_show', {
      now: now,
      scene: scene,
      backgroundEnteredAt: bgEnterAt
    });
  }, null);
  state$1.pendingBackgroundResume = false;
  state$1.backgroundEnteredAt = 0;
  if (!result || !result.isNew) {
    return true;
  }
  tryRun(function () {
    return clearEntry();
  }, undefined);
  var url = options.path || state$1.lastRoute || '';
  var entryKey = normalizePathForEntryMark(url);
  if (entryKey) {
    tryRun(function () {
      return markEntryPage(entryKey);
    }, undefined);
  }
  reportNewSession(c, result.cst || CST.BackgroundTimeout, scene, now, false, url);
  markBackgroundResumeLt1Emitted(now);
  void c.flush(true).catch(function (e) {
    return logger.warn('[uni统计 2.0] flush after new session (app_show) failed', e);
  });
  return true;
}
/**
 * 应用从后台进入前台。
 *
 * 流程：
 *   1. `tryConsumeBackgroundResume`（pending）→ ensureSession('app_show') / cst=2。
 *   2. isNew=true 时发一条 lt=1，并 **flush(true)**。
 *   3. 无 pending 时仅处理 scene 变化等（少见）。
 */
function handleAppShow(app) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (tryConsumeBackgroundResume(app, options, opts, 'handleAppShow')) return;
  var c = safeCollector(app);
  if (!c) return;
  var now = nowSec();
  var scene = tryRun(function () {
    return getLaunchScene(options.scene);
  }, '');
  if (shouldSkipDuplicateBackgroundResumeLt1(now)) {
    tryRun(function () {
      return syncLastScene(scene);
    }, undefined);
    return;
  }
  var result = tryRun(function () {
    return ensureSession('app_show', {
      now: now,
      scene: scene
    });
  }, null);
  if (!result || !result.isNew) {
    return;
  }
  tryRun(function () {
    return clearEntry();
  }, undefined);
  var url = options.path || state$1.lastRoute || '';
  var entryKey = normalizePathForEntryMark(url);
  if (entryKey) {
    tryRun(function () {
      return markEntryPage(entryKey);
    }, undefined);
  }
  reportNewSession(c, result.cst || CST.BackgroundTimeout, scene, now, false, url);
  markBackgroundResumeLt1Emitted(now);
  void c.flush(true).catch(function (e) {
    return logger.warn('[uni统计 2.0] flush after new session (app_show) failed', e);
  });
}
/**
 * 应用进入后台。
 *
 * 流程：
 *   1. markBackground(now)：写 bgTs，让下次 app_show 能算超时。
 *   2. 若存在当前页且启用页面日志：先发一条 lt=11，闭合"离开当前页"语义（含 url/urlref/urlref_ts/iey/ppiey/title）。
 *   3. 再发 lt=3：保留"应用进入后台"语义（urlref=urlref_ts 指向后台前最后可见页）。
 *   4. 进入后台后强制 flush（force=true），尽量在被 kill 前送出。
 */
function handleAppHide(app) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (state$1.pendingBackgroundResume) return;
  var c = safeCollector(app);
  if (!c) return;
  var now = nowSec();
  state$1.wasBackgrounded = true;
  state$1.pendingBackgroundResume = true;
  state$1.backgroundEnteredAt = now;
  tryRun(function () {
    return markBackground(now);
  }, undefined);
  var deltaStay = state$1.lastRouteEnterTime > 0 ? now - state$1.lastRouteEnterTime : 0;
  var stayed = clampUrlrefStaySec(deltaStay);
  if (state$1.lastRoute && opts.enablePageLog !== false) {
    var exitedUrl = state$1.lastRouteFull || state$1.lastRoute;
    var ref = state$1.beforeLastRouteFull || state$1.beforeLastRoute || '';
    var snap = state$1.lastPageTitleSnap;
    var payload = {
      lt: LT.Page,
      t: now,
      url: exitedUrl,
      urlref_ts: stayed,
      iey: state$1.lastIey,
      ppiey: state$1.prevIey,
      ttn: snap.ttn,
      ttpj: snap.ttpj,
      ttc: snap.ttc
    };
    if (ref) payload.urlref = ref;
    c.report(payload);
    if (state$1.lastIey) {
      tryRun(function () {
        return markEntryDeparted();
      }, undefined);
      state$1.lastIey = false;
    }
  }
  c.report({
    lt: LT.Hide,
    t: now,
    urlref: state$1.lastRoute,
    urlref_ts: stayed
  });
  void c.flush(true).catch(function (e) {
    return logger.warn('[uni统计 2.0] flush on hide failed', e);
  });
}
/**
 * Page.onShow：页面前台展示。
 *
 * `lt=11`（页面日志）在**进入新页**的 `onShow` 触发，但语义描述的是**刚刚离开的页面**
 *（只有离开后才能闭合停留时长、导航栏标题等）：
 *
 *   - `url`：离开页的完整路径（含 query），来自上一次 onShow 结束时登记的 `lastRouteFull`。
 *   - `urlref`：再上一层的来源页（「上上个页面」），来自 `beforeLastRouteFull`；
 *     首次从启动页外跳（只有一层来源）时不带 `urlref`。
 *   - `urlref_ts`：离开页停留秒数（`now - lastRouteEnterTime`，不足 1 秒按 1 秒，对齐私有版）。
 *   - `iey` / `ppiey`：分别对应**离开页**是否仍为有效入口、`urlref` 指向页是否仍为有效入口
 *     （会话内仅**首次离开**登记入口为 1；循环回到入口后再离开不算）。
 *   - `ttn` / `ttpj` / `ttc`：三维独立内存（API 导航栏 / pages.json / uni.report('title')），
 *     **同一事件可同时非空**。离开页快照优先在 **`onHide` 且 `clearPageTitle` 之前**落盘；
 *     无 hide 场景依赖 **microtask**（晚于业务 `onShow`）— 由 `titleSnapGeneration` 防止被下一页 show 尾部误覆盖。
 *
 * 首次应用内 onShow（无前序页面）不发 `lt=11`。`enablePageLog=false` 时跳过整段 `lt=11`。
 */
function handlePageShow(app, vm) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var c = safeCollector(app);
  if (!c) return;
  if (state$1.pendingBackgroundResume && shouldEarlyConsumeBackgroundResumeInMixin()) {
    tryConsumeBackgroundResume(app, {}, opts, 'handlePageShow');
  }
  var now = nowSec();
  var route = tryRun(function () {
    return getCurrentRoute(vm);
  }, '');
  var url = tryRun(function () {
    return getCurrentRouteWithQuery(vm);
  }, '') || route;
  /**
   * H5/部分端存在"App.onShow 也会打到 mixin onShow"的情况，此时 this 并非页面 vm，
   * route/fullPath 为空。该事件应由 `handleAppShow` 处理，不能当 page_show。
   */
  if (!route && !url) return;
  var result = tryRun(function () {
    return ensureSession('page_show', {
      now: now
    });
  }, null);
  if (!result) return;
  // 每页重置「自定义上报标题」维（ttc）；注入 pages.json 导航标题 → `ttpj`。
  //
  // **禁止**在此处调用 `clearPageTitle()`：uni-app 页面 `onLoad` 早于统计 mixin 的 `onShow`，
  // 业务常在 `onLoad` 里 `uni.setNavigationBarTitle`，拦截器已写入 `ttn`；若此处再清 page，
  // 会把刚设好的 ttn 抹掉。**跨页**时由 `handlePageHide` 在快照后 `clearPageTitle` 即可。
  tryRun(function () {
    return setReportTitle('');
  }, undefined);
  tryRun(function () {
    return setConfigTitle(getPagesJsonNavigationTitle(route));
  }, undefined);
  if (result.isNew) {
    // 新会话：清 entry → 先登记当前页为会话入口（与 lt=1「落地即入口」一致）→ 再发 lt=1。
    tryRun(function () {
      return clearEntry();
    }, undefined);
  }
  if (route) {
    tryRun(function () {
      return markEntryPage(route);
    }, undefined);
  }
  if (result.isNew) {
    // cst=3：复用 committed visit 字段，与私有版 sendReportRequest 对齐。
    // 注意：lt=1（新会话首报）**不受** enablePageLog 控制 —— 与私有版语义一致，
    // is_page_report 仅拦截 pageShow/pageHide，不影响 launch/appShow/appHide。
    reportNewSession(c, result.cst || CST.PageInactiveTimeout, '', now, false, url);
  }
  // 存在上一页 → 发 lt=11：描述「离开的上一页」，而非当前 vm 所在页。
  var shouldSuppressPageLog = state$1.suppressNextPageLogAfterResume;
  if (state$1.lastRoute && opts.enablePageLog !== false && !shouldSuppressPageLog) {
    var deltaStay = state$1.lastRouteEnterTime > 0 ? now - state$1.lastRouteEnterTime : 0;
    var stayed = clampUrlrefStaySec(deltaStay);
    var exitedUrl = state$1.lastRouteFull || state$1.lastRoute;
    var ref = state$1.beforeLastRouteFull || state$1.beforeLastRoute || '';
    var snap = state$1.lastPageTitleSnap;
    var payload = {
      lt: LT.Page,
      t: now,
      url: exitedUrl,
      urlref_ts: stayed,
      // 离开页是否入口页 / urlref 指向页是否入口页（进入新页前状态尚未被本轮覆盖）。
      iey: state$1.lastIey,
      ppiey: state$1.prevIey
    };
    if (ref) payload.urlref = ref;
    // 三维并列上行，不因其一存在而省略其它；空串由 builder/omit 统一处理
    payload.ttn = snap.ttn;
    payload.ttpj = snap.ttpj;
    payload.ttc = snap.ttc;
    c.report(payload);
    if (state$1.lastIey) {
      tryRun(function () {
        return markEntryDeparted();
      }, undefined);
    }
  }
  // 轮换路由链：当前页在下一轮成为「上一页」。
  state$1.beforeLastRoute = state$1.lastRoute;
  state$1.beforeLastRouteFull = state$1.lastRouteFull;
  state$1.prevIey = state$1.lastIey;
  state$1.lastIey = !!route && tryRun(function () {
    return isEntryForIey(route);
  }, false);
  state$1.lastRoute = route;
  state$1.lastRouteFull = url;
  state$1.lastRouteEnterTime = now;
  state$1.suppressNextPageLogAfterResume = false;
  // 不在此处同步快照：此时 lastRoute 已指向新页，getCurrentTitle 会是新页 ttpj+空 ttn，造成顶替。
  // 离开页快照见 handlePageHide（优先）；否则见 scheduleDeferredTitleSnapshot。
  scheduleDeferredTitleSnapshot();
  state$1.isHide = false;
  // cst=3 新会话：本 tick 内可能已入队 lt=1 与（若有上一页）lt=11；serializer 按 LT_ORDER
  // 保证同批内 lt=1 先于 lt=11。此处强制 flush，避免仍等 reportInterval 才被杀死丢锚点。
  if (result.isNew) {
    void c.flush(true).catch(function (e) {
      return logger.warn('[uni统计 2.0] flush after new session (page_show) failed', e);
    });
  }
}
/**
 * Page.onHide / Page.onUnload：页面隐藏 / 卸载。
 *
 * 私有版用 `isHide` 区分 onUnload 是隐藏还是真离开；本模块同样兼容。
 *
 * 公有版调整（与 `docs/uni统计上报参数.md` 对齐）：
 *   - `lt=11` 不在 onHide 上报；页面离开闭环由「下一次 `handlePageShow` 或 `handleAppHide`」触发。
 *   - onHide 仅做收尾：标记 isHide、清掉自定义 title，避免下次新页空标题。
 *   - lastRoute / lastRouteEnterTime / lastIey 保持不变，由 `handlePageShow` 统一切换。
 */
function handlePageHide(app, _vm) {
  var c = safeCollector(app);
  if (!c) return;
  state$1.isHide = true;
  // 离开前快照：此时仍保留「本页」ttpj/ttn/ttc；清空 page 维后仅丢 ttn，故必须先快照
  titleSnapGeneration++;
  state$1.lastPageTitleSnap = Object.assign({}, getCurrentTitle());
  tryRun(function () {
    return clearPageTitle();
  }, undefined);
}
/**
 * 已经被本模块"异步重抛"过的错误实例，用于阻断 `onError → 重抛 → onError` 死循环。
 *
 * ## 选 WeakSet 的原因
 *   - 弱引用语义：业务方在外部 catch 这些 error 后，error 仍可被 GC，不内存泄漏。
 *   - uni-app 全端原生支持（H5 / 微信/支付宝/百度/字节 等小程序 / App-iOS/Android /
 *     nvue / uvue / 鸿蒙）—— vue runtime 自身大量使用 WeakSet/WeakMap 做响应式，
 *     任何不支持 WeakSet 的环境，vue 本身就起不来。
 *
 * ## 为什么仍然加 typeof 守卫
 *   作为 SDK 必须 defensive。万一极端环境（自定义沙箱阉割、业务代码 `delete
 *   globalThis.WeakSet`、SSR mock 等）导致 `new WeakSet()` 抛错，会让整个统计模块
 *   在初始化期 `ReferenceError` 加载失败 —— 过激的失败模式。
 *
 *   降级策略：退化为 has=false / add=noop 的 stub。后果是失去防重入保护，但 SDK
 *   仍可正常工作；最坏情况（小程序端 setTimeout 重抛被 mixin 二次接住）会触发
 *   一次额外的 setTimeout（仍是异步、不会同步阻塞），第二次 setTimeout 抛出后会
 *   到达全局 onError，仍然不会无限循环 —— 影响完全可控。
 *
 * ## 仅处理 object 类型
 *   非 object 错误（极少见的 `throw 'string'` / `throw 42` 等）无法进 WeakSet；
 *   且重抛非 object 在多数端的全局 onError 不会再次触发 vue mixin 的 onError，
 *   无重入风险，无需特殊处理。
 */
var rethrownErrors = typeof WeakSet === 'function' ? new WeakSet() :
// 极端环境降级：has=false 永不命中，add=noop；本模块只用 has/add 两个方法，
// 其它方法（delete / [Symbol.toStringTag]）调用方不依赖，类型断言即可。
{
  has: function has() {
    return false;
  },
  add: function add() {
    return rethrownErrors;
  }
};
/**
 * onError：上报错误（lt=31）+ 异步重抛，让错误回归原生 "Uncaught Error" 通路。
 *
 * ## 设计目标：统计是**旁路监听**，绝不侵入业务方的报错体验
 *
 * ### 私有版（含早期公有版）的两种错误做法都不达标
 *
 * 1. **私有版 `src/index.js#onError`**：仅 `stat.error(e)`，**完全吞掉错误**。
 *    一旦 mixin 注册了 onError，uni-app/Vue 视为业务已处理 → Vue 不再 console.error
 *    → 业务方在 H5 端排错时控制台一片空白，看不到任何 stack。
 *
 * 2. **早期公有版 `console.error(e)` 兜底**：能看到 stack，但 devtools 会把
 *    `console.error` 的**调用文件**（即 SDK 路径 `uni-stat-public.es.js:行号`）
 *    显示在控制台日志右侧的"来源"列。业务方误以为统计 SDK 出现在他们的错误栈里，
 *    与"旁路监听"承诺相悖。
 *
 * ### 当前方案：`setTimeout(() => { throw e }, 0)` 异步重抛（**仅非小程序**）
 *
 * - **H5 / App 等**：错误进入浏览器 / 原生 "Uncaught Exception" 通路（同 `window.onerror`），
 *   与**完全没接入统计**时的默认行为一致，且控制台「来源」指向用户任务而非 SDK。
 *
 * - **各小程序（`mp-*`）**：**不重抛**。运行时已在首次异常路径打印 `MiniProgramError` 等；
 *   若再 `setTimeout(throw)`，会二次进入全局 `onError`，且微信往往传入**新的包装对象**，
 *   `WeakSet` 无法按引用去重 → 多条 `lt=31`、控制台刷屏。统计在此只做旁路上报。
 *
 * ### 防重入（主要针对仍走重抛的环境）
 *
 * 重抛后可能被二次回调；用 `rethrownErrors`(WeakSet) 标记已处理的 error 实例。
 *
 * ### 顺序
 *
 * 1. **先标记重入防护** —— 防止极端竞态下 setTimeout 在同步上报完成前已 fire。
 * 2. **再上报** —— 同步执行，确保 lt=31 一定入队。
 * 3. **非小程序**：**最后**异步重抛 —— `setTimeout 0` 排到下一 task；小程序端跳过此步。
 *
 * 外层 `try/catch` 仅兜底 `reportError` 自身抛错（与私有版一致）；`tryRun` 兜底
 * `setTimeout` 在极端环境（如 SSR / 被 mock 的 timer）下不可用的情况。
 */
function handleError(app, e) {
  var isObj = (0, _typeof2.default)(e) === 'object' && e !== null;
  if (isObj && rethrownErrors.has(e)) return;
  if (isObj) rethrownErrors.add(e);
  try {
    app.reportError(e);
  } catch (err) {
    logger.warn('[uni统计 2.0] handleError failed', err);
  }
  if (isMp()) {
    return;
  }
  tryRun(function () {
    setTimeout(function () {
      throw e;
    }, 0);
  }, undefined);
}
function getUni$6() {
  var u = resolveUniRuntime();
  return u != null && (0, _typeof2.default)(u) === 'object' ? u : undefined;
}
/**
 * 是否由 mixin 分发 App 级 onShow/onHide（对齐私有版 `stat.show` / `stat.hide`）。
 *
 * - Vue2：始终走 mixin（`load_stat` 不注册 uni.onAppShow/Hide）。
 * - Vue3：仅 H5 / nvue 走 mixin；小程序等走 `uni.onAppShow` / `onAppHide`。
 *
 * 使用赋值而非连续 `return`：公有版 dist 经 Rollup 打包时，连续 return 会导致
 * `#ifdef VUE3` 分支被 tree-shake；应用构建再剥离 `#ifndef VUE3` 后函数体为空 → undefined。
 */
function shouldMixinDispatchAppLifecycle() {
  var result = isH5() || getPlatform() === 'n' || isNvue();
  result = true;
  return result;
}
/**
 * 是否注册 `uni.onAppShow` / `onAppHide`（对齐私有版 `index.js#load_stat` VUE3 分支）。
 *
 * 仅 Vue3 且非 H5、非 nvue（即小程序等）为 true；Vue2 必须为 false。
 */
function shouldBindUniAppLifecycle() {
  var result = !isH5() && getPlatform() !== 'n' && !isNvue();
  result = false;
  return result;
}
var uniAppHookRegistry = {
  showBound: false,
  hideBound: false,
  appShowCb: undefined,
  appHideCb: undefined
};
/**
 * 订阅应用级 `uni.onAppShow` / `onAppHide`；`uni` 或 API 未就绪时返回 false，可稍后重试。
 *
 * show/hide 分别绑定：避免 `onAppShow` 晚就绪时连 `onAppHide` 也无法注册（lt=3 缺失）。
 */
function tryBindUniAppLifecycle(app) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!shouldBindUniAppLifecycle()) return false;
  var u = getUni$6();
  if (!u) return false;
  if (!uniAppHookRegistry.showBound && typeof u.onAppShow === 'function') {
    uniAppHookRegistry.appShowCb = function (e) {
      return handleAppShow(app, e !== null && e !== void 0 ? e : {}, opts);
    };
    tryRun(function () {
      return u.onAppShow(uniAppHookRegistry.appShowCb);
    }, undefined);
    uniAppHookRegistry.showBound = true;
  }
  if (!uniAppHookRegistry.hideBound && typeof u.onAppHide === 'function') {
    uniAppHookRegistry.appHideCb = function () {
      return handleAppHide(app, opts);
    };
    tryRun(function () {
      return u.onAppHide(uniAppHookRegistry.appHideCb);
    }, undefined);
    uniAppHookRegistry.hideBound = true;
  }
  return uniAppHookRegistry.showBound && uniAppHookRegistry.hideBound;
}
/** 解绑 `tryBindUniAppLifecycle` 注册的回调。 */
function unbindUniAppLifecycle() {
  if (!uniAppHookRegistry.showBound && !uniAppHookRegistry.hideBound) return;
  var cur = getUni$6();
  if (uniAppHookRegistry.showBound && uniAppHookRegistry.appShowCb && (cur === null || cur === void 0 ? void 0 : cur.offAppShow)) {
    tryRun(function () {
      return cur.offAppShow(uniAppHookRegistry.appShowCb);
    }, undefined);
  }
  if (uniAppHookRegistry.hideBound && uniAppHookRegistry.appHideCb && (cur === null || cur === void 0 ? void 0 : cur.offAppHide)) {
    tryRun(function () {
      return cur.offAppHide(uniAppHookRegistry.appHideCb);
    }, undefined);
  }
  uniAppHookRegistry.showBound = false;
  uniAppHookRegistry.hideBound = false;
  uniAppHookRegistry.appShowCb = undefined;
  uniAppHookRegistry.appHideCb = undefined;
}
/**
 * 装配 vue mixin；Vue3 小程序等另由 `tryBindUniAppLifecycle` 订阅 uni 应用前后台。
 *
 * 与私有版 `src/index.js` + `core/stat.js#show|hide` 对齐：
 *   - Vue2：仅 `Vue.mixin`，App/Page 均在 mixin 的 onShow/onHide 内分支。
 *   - Vue3：H5/nvue 的 App 前后台在 mixin；其它端用 uni.onAppShow/onAppHide。
 */
function bindLifecycle(app) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var bound = true;
  var mixin = {
    onLaunch: function onLaunch() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      handleLaunch(app, options, opts);
    },
    onLoad: function onLoad() {
      // 保留钩子位，用于未来扩展（query 收集等）；当前 noop。
    },
    onShow: function onShow() {
      var vmType = getPageVmType(this);
      cancelPageAppHideDefer();
      if (state$1.pendingBackgroundResume && shouldEarlyConsumeBackgroundResumeInMixin()) {
        tryConsumeBackgroundResume(app, {}, opts, 'mixin.onShow');
      }
      state$1.isHide = false;
      if (vmType === 'page') {
        handlePageShow(app, this, opts);
      }
      if (shouldMixinDispatchAppLifecycle() && vmType === 'app') {
        handleAppShow(app, {}, opts);
      }
    },
    onHide: function onHide() {
      state$1.isHide = true;
      if (getPageVmType(this) === 'page') {
        handlePageHide(app);
        tryVue2AppHideFromPageOnHide(app, opts);
      }
      if (shouldMixinDispatchAppLifecycle() && getPageVmType(this) === 'app' && !state$1.pendingBackgroundResume) {
        handleAppHide(app, opts);
      }
    },
    onUnload: function onUnload() {
      if (state$1.isHide) {
        state$1.isHide = false;
        return;
      }
      handlePageHide(app);
    },
    onError: function onError(e) {
      handleError(app, e);
    }
  };
  if (shouldBindUniAppLifecycle()) {
    tryBindUniAppLifecycle(app, opts);
  }
  return {
    mixin: mixin,
    tryBindUniAppHooks: function tryBindUniAppHooks() {
      return shouldBindUniAppLifecycle() && tryBindUniAppLifecycle(app, opts);
    },
    unbind: function unbind() {
      if (!bound) return;
      bound = false;
      unbindUniAppLifecycle();
    }
  };
}

/**
 * 公有版常量与可配置项的集中定义（版本号、URL、超时阈值等）。
 *
 * 该模块只导出**编译期常量**与**默认值**；运行时可变配置走 `runtime/StatApp` 注入。
 */
/**
 * 上行字段 `usv` 取值：**uni-app 编译器版本号**（与权威参数文档
 * `docs/uni统计上报参数.md` 中 `usv: "4.24"` 示例对齐）。
 *
 * 与私有版 `src/config.ts` 保持同源做法：直接读 `process.env.UNI_COMPILER_VERSION`，
 * 由 uni-cli 在用户应用打包阶段通过 vite `define` 替换成字面量字符串；
 * 运行时取不到时回退为空串，避免拼到 URL 时变成 `undefined`。
 *
 * 注意：这里**不再**硬编码统计实现版本。统计入口由 `src/plugin/index.ts`
 * 的统计类型（`public` / `private`）控制；
 * 与 `usv` 字段无关。
 */
var STAT_VERSION_PUBLIC = "5.24" || false;
/** 1.0 通道（HTTP）默认上报地址。 */
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
/** H5 image 兜底通道（绕过跨域）。 */
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
/** 默认上报间隔（秒）。queue 节流阈值。 */
var REPORT_INTERVAL_SEC = 10;
/** HTTP 协议层最大重试次数（含首次）。 */
var HTTP_MAX_RETRIES = 3;
/** Cloud 协议层最大重试次数（含首次）。 */
var CLOUD_MAX_RETRIES = 2;
/** Image 协议层最大重试次数（含首次）。 */
var IMAGE_MAX_RETRIES = 2;
/** 重试基础延迟（指数退避）。 */
var RETRY_BASE_DELAY_MS = 1000;
/**
 * 微信小程序是否用 `wx.preloadAssets` + `WebTrack.gif` GET 上报。
 *
 * - `true`（默认）：`mp-weixin` 走 preload 信标；无 API 时回退 `uni.request` GET。
 * - `false`：微信与其它宿主一样走 `uni.request` GET（query 与 H5 一致）。
 *
 * 可在 `createImageChannel({ mpWeixinPreloadReport: false })` 覆盖。
 */
var MP_WEIXIN_USE_PRELOAD_ASSETS_REPORT = true;
/**
 * 微信 `wx.preloadAssets` 单次等待上限（ms）。
 *
 * 冷启动首包常慢于 10s（DNS/TLS/首连），而 image 通道默认 `timeoutMs=10000` 会先于
 * `success` 触发 SDK 超时；Network 里请求可能已是 200。默认放宽到 30s，`uni.request` GET 仍用 10s。
 */
var MP_WEIXIN_PRELOAD_TIMEOUT_MS = 30000;
/**
 * 微信小程序 preload 冷启动首包 flush 延迟（ms）。
 *
 * `onLaunch` 入队 lt=1 后，`queue.shouldFlush()` 会因 `lastFlushAt=0` 立即为 true；
 * 若在 App 尚未完成启动时调用 `wx.preloadAssets`，易出现 30s 无 success。延迟后再 flush，
 * 用于验证「启动时机」是否为根因（方案 C）。设为 `0` 则关闭延迟。
 */
var MP_WEIXIN_PRELOAD_FIRST_FLUSH_DELAY_MS = 2000;
/**
 * 单条事件序列化后允许的最大字节数。
 *
 * 阈值取舍：
 *   - GET 上报（`/WebTrack` / `/WebTrack.gif`）URL 上限约 6KB（见 `docs/image-url-too-long-修复说明.md`）；
 *     扣掉 host / ProjectId / TopicId / Source / Time 等固定 query 后，留给
 *     `Logs=encodeURIComponent(payload.requests)` 约 5.8KB 量级。
 *   - `encodeURIComponent` 对纯 ASCII 膨胀 ~1.05x，对中英混排 ~1.5–2x，对纯中文最坏 3x。
 *   - 取 **4KB 作为单条事件上限**：保证 ASCII 场景（含大段 Error stack）能放进单批；
 *     纯中文极端场景下，由 `chunkEvents` 单条独占一片 + image preflight 在 URL 编码后
 *     再做一次 6144 字节硬截断兜底。
 *   - 业务错误 stack 通常 ~1–3KB，4KB 足够；超 4KB 的单条多半是 base64 图片 / 大段 JSON
 *     这类**应该被业务自身收敛**的场景，直接丢弃并 warn 比静默卡死管道更安全。
 *
 * 超过本阈值的单条事件直接在 `queue.enqueue()` 内丢弃并 warn —— 不入桶、不持久化、
 * 不进入重试队列，避免 81KB 这种"任何 batch 切多细都过不了"的死信卡死管道。
 *
 * 参考排错文档：`docs/image-url-too-long-修复说明.md`。
 */
var SINGLE_EVENT_MAX_BYTES = 4 * 1024;
/**
 * 单批 `requests`（已 `JSON.stringify(events)`）允许的最大字节数。
 *
 * 与 GET URL 长度上限相关：`encodeURIComponent` 保守按 3x 估，
 * 本常量与 `createImageChannel.maxRequestBytes()` 取 min 后由 collector 切片。
 */
var BATCH_REQUESTS_MAX_BYTES = 4 * 1024;
/** 单批最多容纳的事件数；与字节阈值取 min 作为切片边界。 */
var BATCH_MAX_EVENTS = 30;
/**
 * 内存上报桶（主队列）允许容纳的事件总数上限。
 *
 * 设置原因：通道长期不可用时，失败批次会反复 `rollback` 回桶，且每次 `enqueue`/`rollback`
 * 都会 `persistBucket` 落盘。若无上限，内存与 storage 会随离线时长无界增长，最终可能触发
 * 小程序 storage 配额异常甚至 OOM。超过本上限时，`enqueue` 按 FIFO 丢弃**最旧**事件
 * （优先从当前最大的桶丢，尽量保住体量小但关键的 lt=1/lt=3），并 warn。
 *
 * 取值 1000：以单条均值约 0.5–1KB 估算，约占 0.5–1MB，远低于各端 storage 配额；
 * 正常在线（10s flush）场景永远触不到，仅在长时间离线积压时生效。
 */
var QUEUE_MAX_EVENTS = 1000;
/**
 * 单条 retry 队列条目允许的最大重放次数。
 *
 * 设置原因：`recoverRetry` 每次冷启串行重放历史 payload，对永久错误（例如曾经误塞入
 * 队列的超长 payload、协议早期版本的脏数据）只会反复 fail，永远卡在队列前部把后续
 * 健康 payload 也拖死。超过本阈值后由 `markAttempt` 自动 ack 删除（死信清理）。
 */
var RETRY_MAX_ATTEMPTS = 5;
var IMAGE_REPORT_DEFAULTS = {
  host: 'https://tongji-collector.dcloud.net.cn',
  /** 正式环境 */
  projectId: '964f0397-af5d-45bf-99d6-8fb3500d7849',
  topicId: '8563e231-f4cd-4ab0-8870-917e4b04e810'
  // 以下为历史测试环境（已停用，勿删便于回切排查）
  // projectId: '9fad19a2-b7f1-47f5-87ff-8621f545ab61',
  // topicId: '99b55c91-ed80-406e-b205-e9d18aca744d',
};
/**
 * uni-app appid。优先取构建期 `process.env.UNI_APP_ID`；未注入时返回 `''`，
 * 由调用方决定是否上报为 `'default'`。
 */
function getAppId$1() {
  var _a;
  return (_a = "") !== null && _a !== void 0 ? _a : '';
}

/**
 * 2.0 通道：uniCloud importObject 上报。
 *
 * 与私有版协议 1:1：
 *   `uni.__stat_uniCloud_space.importObject('uni-stat-receiver', { customUI: true }).report(payload)`
 *
 * 与私有版差异（修复点）：
 *   - 私有版 `sendRequest` 仅在 1.0 通道有 `_retry` 重试，2.0 通道**完全没有重试**，
 *     云函数偶发抖动会直接丢数据。本实现统一接入 `withRetry`（指数退避）。
 *   - 私有版直接读全局 `uni.__stat_uniCloud_space`，无法测试。本实现支持依赖注入
 *     `uniCloudSpace`（测试） / `getUniCloudSpace()`（运行时）。
 *   - `available()` 在 `space.importObject` 不可用时返回 false，调用方据此决定是否
 *     回退到 1.0 通道（由 selector 决策，本通道自身不做回退）。
 */
/**
 * 解析当前可用的 uniCloud space。
 *
 * 优先级：opts.uniCloudSpace > uni.__stat_uniCloud_space（`uni` 解析见 `infra/uniRuntime`）。
 * 都不可用返回 undefined，由 `available()` / `send()` 自行处理。
 */
/**
 * 校验云对象返回值是否表示业务失败。**只识别 uniCloud 标准失败约定，默认成功**，
 * 以避免把成功返回误判为失败而触发无谓重试：
 *   - `success === false`（显式布尔失败）
 *   - `errCode` 为非 0 的 number（uniCloud 云对象错误码约定；0 / 缺省 = 成功）
 *
 * **刻意不判断通用 `code` 字段**：部分接口用 `code: 200` 表示成功，若按「非 0 即失败」
 * 处理会把成功误判为失败、误入重试队列。未知返回形态一律视为成功（保守）。
 *
 * 命中失败约定时抛错，交由 `withRetry` / collector 走重试链路。
 */
function assertCloudResultOk(res) {
  if (!res || (0, _typeof2.default)(res) !== 'object') return;
  var r = res;
  if (r.success === false) {
    throw new Error('cloud receiver reported success=false');
  }
  if (typeof r.errCode === 'number' && r.errCode !== 0) {
    throw new Error('cloud receiver reported errCode=' + String(r.errCode));
  }
}
function resolveSpace(injected) {
  if (injected) return injected;
  var raw = resolveUniRuntime();
  var u = raw != null && (0, _typeof2.default)(raw) === 'object' ? raw : undefined;
  return u === null || u === void 0 ? void 0 : u.__stat_uniCloud_space;
}
function createCloudChannel() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _a, _b;
  var receiverName = (_a = opts.receiverName) !== null && _a !== void 0 ? _a : 'uni-stat-receiver';
  var maxRetries = (_b = opts.maxRetries) !== null && _b !== void 0 ? _b : CLOUD_MAX_RETRIES;
  function getReceiver() {
    var space = resolveSpace(opts.uniCloudSpace);
    if (!space || typeof space.importObject !== 'function') return undefined;
    try {
      return space.importObject(receiverName, {
        customUI: true
      });
    } catch (e) {
      logger.warn('[uni统计 2.0] cloud importObject threw', e);
      return undefined;
    }
  }
  function once(payload) {
    var receiver = getReceiver();
    if (!receiver || typeof receiver.report !== 'function') {
      return Promise.reject(new Error('uniCloud space unavailable'));
    }
    return Promise.resolve(receiver.report(payload)).then(function (res) {
      // 云对象未 throw 但**业务结果显式失败**时，仍按失败处理以触发重试，
      // 避免"resolve 即成功"漏掉服务端拒收。仅识别明确的失败约定，默认视为成功，
      // 防止把未知返回形态误判为失败（保守）。
      assertCloudResultOk(res);
    });
  }
  return {
    name: '2.0',
    available: function available() {
      var space = resolveSpace(opts.uniCloudSpace);
      return !!(space && typeof space.importObject === 'function');
    },
    send: function send(payload) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return withRetry(function () {
                  return once(payload);
                }, {
                  times: maxRetries,
                  baseDelayMs: RETRY_BASE_DELAY_MS,
                  sleep: opts.sleep
                });
              case 3:
                _context2.next = 9;
                break;
              case 5:
                _context2.prev = 5;
                _context2.t0 = _context2["catch"](0);
                logger.warn('[uni统计 2.0] 统计上报失败（云函数已重试）', _context2.t0);
                throw _context2.t0;
              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 5]]);
      }));
    }
  };
}

/**
 * 公有版调试日志：面向业务方的"采集 / 上报"过程日志封装。
 *
 * 与 `logger.debug` 的差异：
 *   - `logger.debug` 是底层 console.log + 闸门；调用点散落，文案随意。
 *   - 本模块提供**统一文案 / 统一格式**的高层包装，覆盖：
 *       1. 采集动作：每个 lt 都有中文动作名 +「采集 → 数据」标记。
 *       2. 上报生命周期：开始 / 成功 / 失败 / 冷启续传。
 *       3. 启动摘要：通道版本、上报间隔、ak 是否就位等。
 *   - 所有 helper 都内嵌 `logger.isDebug()` 判断；非 debug 模式下零开销，
 *     调用方无需再写 `if (logger.isDebug()) ...`。
 *
 * 文案风格参考私有版 `utils/pageInfo.js#log`：直接面向业务调试，**中文**为主，
 * 关键字段（lt / 通道 / 用时 / 错误原因）一目了然。
 *
 * 注意：不在此处吞错；任意 console.log 异常仍会冒泡。运行时调用方需要 `tryRun` 兜底
 * 时自行处理（一般 console.log 不会抛错，故未做包装）。
 */
/**
 * `lt` → 用户友好的中文动作名映射。
 *
 * 与私有版 `pageInfo.js#log` 的 msg_type 对齐。
 * 注：`lt=0` 已废弃（详见 `domain/eventTypes.ts` 头注释），新会话信息直接随 lt=1 上行。
 *
 * 未知 lt 走默认 "未知事件 (lt=X)"，便于排查异常上行。
 */
function getActionLabel(lt) {
  switch (lt) {
    case LT.Launch:
      return '应用启动';
    case LT.Hide:
      return '应用进入后台';
    case LT.Page:
      return '页面切换';
    case LT.Event:
      return '事件触发';
    case LT.Error:
      return '应用错误';
    case LT.Push:
      return 'PUSH 设备标识';
    default:
      return "\u672A\u77E5\u4E8B\u4EF6 (lt=".concat(String(lt !== null && lt !== void 0 ? lt : '?'), ")");
  }
}
/**
 * 计算 bucket（`Record<lt, StatData[]>`）内的事件总数。
 *
 * 仅在 debug 路径需要，单独抽出避免与 queue.size() 模块循环依赖。
 */
function bucketSize(bucket) {
  var n = 0;
  for (var _i3 = 0, _Object$keys2 = Object.keys(bucket); _i3 < _Object$keys2.length; _i3++) {
    var lt = _Object$keys2[_i3];
    var arr = bucket[lt];
    if (Array.isArray(arr)) n += arr.length;
  }
  return n;
}
/**
 * 把 bucket 摘要成 "lt=1×1, lt=11×3, lt=21×2" 形式，方便控制台扫读。
 */
function bucketSummary(bucket) {
  var parts = [];
  for (var _i4 = 0, _Object$keys3 = Object.keys(bucket); _i4 < _Object$keys3.length; _i4++) {
    var lt = _Object$keys3[_i4];
    var arr = bucket[lt];
    if (Array.isArray(arr) && arr.length > 0) {
      parts.push("lt=".concat(lt, "\xD7").concat(arr.length));
    }
  }
  return parts.join(', ') || '<空>';
}
/**
 * 单次事件采集日志。
 *
 * 文案示意：
 *   ```text
 *   [uni统计 2.0] === 统计数据采集：应用启动 (lt=1) ===
 *   [uni统计 2.0] {lt: '1', t: 1714123456, ut: 'h5', ...}
 *   [uni统计 2.0] === 采集结束 ===
 *   ```
 */
function logCollect(data) {
  if (!logger.isDebug()) return;
  var lt = data.lt;
  var label = getActionLabel(lt);
  logger.debug("=== \u7EDF\u8BA1\u6570\u636E\u91C7\u96C6\uFF1A".concat(label, " (lt=").concat(String(lt !== null && lt !== void 0 ? lt : '?'), ") ==="));
  logger.debug(data);
  logger.debug('=== 采集结束 ===');
}
/**
 * 启动 / 配置摘要。`installPublicStat` 装配完毕后调用一次，方便业务方一眼确认接入状态。
 */
function logBoot(info) {
  if (!logger.isDebug()) return;
  var timeoutParts = [];
  if (info.backgroundTimeoutSec != null) {
    timeoutParts.push("\u540E\u53F0\u8D85\u65F6(\u65B0\u4F1A\u8BDD): ".concat(info.backgroundTimeoutSec, "s"));
  }
  if (info.pageInactiveTimeoutSec != null) {
    timeoutParts.push("\u524D\u53F0\u65E0\u64CD\u4F5C\u8D85\u65F6: ".concat(info.pageInactiveTimeoutSec, "s"));
  }
  var timeoutSeg = timeoutParts.length > 0 ? " | ".concat(timeoutParts.join(' | ')) : '';
  var lines = ['=== uni统计 2.0 已启用 ===', "\u4E0A\u62A5\u95F4\u9694: ".concat(info.reportIntervalSec, "s").concat(timeoutSeg, " | \u5E94\u7528APPID: ").concat(info.ak || '<未注入>').concat(info.appName ? " | \u5E94\u7528\u540D: ".concat(info.appName) : '').concat(info.vueMode ? " | ".concat(info.vueMode) : '')];
  if (info.debugFromManifest) {
    lines.push('调试模式：已从 manifest.uniStatistics.debug 自动开启');
  }
  lines.push('=== 后续将在每次采集 / 上报时输出过程日志 ===');
  logger.debug(lines.join('\n'));
}
/**
 * 即将上报：取出 batch、选定 channel 后调用。
 *
 * 文案示意：
 *   ```text
 *   // 通道=${info.channel}
 *   [uni统计 2.0] === 准备上报： 共 4 条事件 (lt=1×1, lt=11×2, lt=21×1) [_id=p-xxxx] ===
 *   ```
 */
function logReportStart(info) {
  if (!logger.isDebug()) return;
  var total = bucketSize(info.bucket);
  var summary = bucketSummary(info.bucket);
  logger.debug("=== \u51C6\u5907\u4E0A\u62A5\uFF1A\u5171 ".concat(total, " \u6761\u4E8B\u4EF6 (").concat(summary, ") ==="));
}
/**
 * 仅输出失败的"原因 / 重试落盘"细节，不输出 `=== 上报失败 ===` headline。
 *
 * 用于 collector 在切片化发送时**每次失败 send 后立即给出可观察性**：业务方能看到
 * 是哪一批因什么失败、是否进入了重试队列；而最终的"上报失败 / 上报完成（部分失败）"
 * 总览由 `logReportSummary` 统一输出，避免一次失败被打两次 headline。
 */
function logReportFailureReason(info) {
  if (!logger.isDebug()) return;
  logger.debug("\u539F\u56E0: ".concat(describeError(info.error)));
  if (info.persistedId) {
    logger.debug("\u5DF2\u6682\u5B58\u91CD\u8BD5\u961F\u5217 [retryId=".concat(info.persistedId, "]\uFF0C\u4E0B\u6B21\u542F\u52A8\u81EA\u52A8\u7EED\u4F20"));
  } else {
    logger.debug('未能写入重试队列：本批数据已丢弃');
  }
}
/**
 * 单批次上报的最终汇总。
 *
 * 设计原则：**对外只暴露"成功 / 失败"两种结果，不暴露"切片"等内部实现细节**。
 *
 * 切片是 collector 为了适配 image 通道 URL 长度上限 / 全局 batch 字节阈值而做的
 * 内部分批发送策略；业务方关心的只是"这一批数据有没有送达、送达多少、丢失多少"。
 * 因此本汇总以**事件数**（而非片数）为统计维度，文案与单批 `logReportSuccess` /
 * `logReportFailure` 完全对齐——业务方感知不到内部走了几次 send。
 *
 * 三种状态文案：
 *   - 全成功：`=== 上报成功： N 条事件已送达, 用时 Tms ===`（与 logReportSuccess 同）
 *   - 全失败：`=== 上报失败： N 条事件未送达, 用时 Tms ===`（与 logReportFailure 同）
 *   - 部分失败：`=== 上报完成：成功 X 条，失败 Y 条，用时 Tms ===`
 *
 * 失败原因 / 重试落盘 id 等细节由 collector 在每次失败 send 后通过 logReportFailure
 * 输出，本汇总不再重复，避免噪音。
 */
function logReportSummary(info) {
  if (!logger.isDebug()) return;
  if (info.failedCount === 0) {
    logger.debug("=== \u4E0A\u62A5\u6210\u529F\uFF1A ".concat(info.okCount, " \u6761\u4E8B\u4EF6\u5DF2\u9001\u8FBE, \u7528\u65F6 ").concat(info.elapsedMs, "ms ==="));
  } else if (info.okCount === 0) {
    logger.debug("=== \u4E0A\u62A5\u5931\u8D25\uFF1A ".concat(info.failedCount, " \u6761\u4E8B\u4EF6\u672A\u9001\u8FBE, \u7528\u65F6 ").concat(info.elapsedMs, "ms ==="));
  } else {
    logger.debug("=== \u4E0A\u62A5\u5B8C\u6210\uFF1A\u6210\u529F ".concat(info.okCount, " \u6761\uFF0C\u5931\u8D25 ").concat(info.failedCount, " \u6761\uFF0C\u7528\u65F6 ").concat(info.elapsedMs, "ms ==="));
  }
}
/**
 * 无可用通道：通常是 channelVersion=2 但 uniCloud space 未关联，或 image 配置缺失。
 */
function logNoChannel(info) {
  if (!logger.isDebug()) return;
  logger.debug("=== \u4E0A\u62A5\u8DF3\u8FC7\uFF1A\u5F53\u524D\u65E0\u53EF\u7528\u901A\u9053\uFF0C\u5DF2\u56DE\u6EDA ".concat(bucketSize(info.bucket), " \u6761\u4E8B\u4EF6\u5165\u961F ==="));
}
/**
 * 冷启续传：进入 recoverRetry 时调用。
 */
function logRecoverStart(count) {
  if (!logger.isDebug()) return;
  logger.debug("=== \u51B7\u542F\u7EED\u4F20\uFF1A\u53D1\u73B0 ".concat(count, " \u6761\u5386\u53F2 payload\uFF0C\u5F00\u59CB\u9010\u6761\u91CD\u53D1 ==="));
}
/**
 * 冷启续传 - 单条结果。
 */
function logRecoverItem(info) {
  if (!logger.isDebug()) return;
  // const idTag = info.payloadId ? ` [_id=${info.payloadId}]` : ''
  if (info.ok) {
    logger.debug("\u7EED\u4F20\u6210\u529F (".concat(info.index, "/").concat(info.total, ")"));
  } else {
    logger.debug("\u7EED\u4F20\u5931\u8D25 (".concat(info.index, "/").concat(info.total, ")\uFF1A").concat(describeError(info.error)));
  }
}
/**
 * 把 unknown 错误压成可读字符串；保留 message + name，避免业务方在控制台只看到 `[object Object]`。
 */
function describeError(e) {
  if (!e) return '<无错误对象>';
  if (e instanceof Error) {
    return "".concat(e.name, ": ").concat(e.message);
  }
  if (typeof e === 'string') return e;
  return safeStringify(e) || String(e);
}

/**
 * 上行体瘦身：去掉值为空字符串 `''` 的字段。
 *
 * - **调试日志**：`collector.report` 在瘦身前把完整 `StatData` 交给 `logCollect`，空串字段仍会打印，
 *   便于对照「是真的没采集到」还是「协议口径为空」。
 * - **入队 / 发送**：经本函数后再 `queue.enqueue`，缩短 image GET URL（encode 后的 Logs），
 *   仅减少体积，不改变非空字段语义。
 *
 * 注意：
 *   - 只处理**顶层**键；`StatData` 事件对象为单层 KV。
 *   - 仅剔除 `v === ''`，保留 `0`、`false`、`null`（若上游传入）；当前 builder 不会主动写入 null。
 */
/**
 * 返回浅拷贝：值为 `''` 的键不拷贝到结果对象。
 */
function omitEmptyStringFieldsForUpload(data) {
  var out = {};
  for (var _i5 = 0, _Object$keys4 = Object.keys(data); _i5 < _Object$keys4.length; _i5++) {
    var key = _Object$keys4[_i5];
    var v = data[key];
    if (v === '') continue;
    out[key] = v;
  }
  return out;
}

/**
 * 上报体序列化（重写私有版 `utils/pageInfo.js#handle_data`）。
 *
 * 修复缺陷 #4：私有版用 `for...in` 拿到的 key 永远是字符串，写成 `i === 0` 与 `i === 3`
 * 导致两条边界分支从未命中：`lt=3`（应用进入后台）应排最后用于服务端 session 闭合——被混入中间。
 *
 * 公有版严格契约：
 *   1. 输出顺序固定：`1 → 11 → 21 → 31 → 101 → 3`（可在 `LT_ORDER` 中扩展）。
 *      `lt=0` 已废弃（参考 `domain/eventTypes.ts` 头注释），不再参与排序。
 *   2. 同一 lt 内事件按 push 顺序保留（稳定排序）。
 *   3. 纯函数：不读 storage、不调 console、不依赖 `'3'`。
 *   4. 输入桶为空 → 返回 `'[]'`，调用方应在外层判空。
 *
 * 数据形状（公有版只支持 v2 协议，元素为 JSON 对象；不再走 v1 的 `key=val&...` 字符串）：
 *   `JSON.stringify([{...stat1}, {...stat2}])`
 */
/**
 * 上报顺序权重表。值越小越靠前；未知 lt 落到最末（靠近 lt=3 之前），同时打 warn。
 *
 * 顺序设计依据：
 *   - lt=1：会话日志（含 sid/cst/fvts/lvts/tvc），最先；
 *   - lt=11/21/31/101：按事件类型轻重排开；
 *   - lt=3：应用进入后台，永远最后，用于服务端归一会话停留时长。
 */
var LT_ORDER = {
  '1': 1,
  '11': 2,
  '21': 3,
  '31': 4,
  '101': 5,
  '3': 100
};
var UNKNOWN_LT_WEIGHT = 50;
/**
 * 拉平 + 排序 + 序列化。
 *
 * @param buckets 按 lt 分组的事件桶。
 * @returns 上行 `requests` 字段的 JSON 字符串（`'[{...}]'`）。
 */
function handleData(buckets) {
  return JSON.stringify(flatten(buckets));
}
/**
 * 仅做拉平 + 排序，便于 collector 在不需要 stringify 的场景下做断言或二次处理（如分片）。
 *
 * 排序规则：
 *   - 主键：`LT_ORDER[lt] ?? UNKNOWN_LT_WEIGHT`。
 *   - 次键：原始 push 顺序（依靠 Array.prototype.sort 在 Node 11+ 已稳定）。
 *
 * 修复缺陷 #4 关键断言：`lt='3'` 必落最后；`lt='1'` 必落最前。
 */
function flatten(buckets) {
  var ltKeys = Object.keys(buckets);
  ltKeys.sort(function (a, b) {
    return weightOf(a) - weightOf(b);
  });
  var out = [];
  for (var i = 0; i < ltKeys.length; i++) {
    var lt = ltKeys[i];
    var list = buckets[lt];
    if (!list || list.length === 0) continue;
    for (var j = 0; j < list.length; j++) {
      out.push(list[j]);
    }
  }
  return out;
}
function weightOf(lt) {
  var w = LT_ORDER[lt];
  return typeof w === 'number' ? w : UNKNOWN_LT_WEIGHT;
}
/**
 * 把已 flatten 的事件数组按"事件数 + 字节数"双阈值贪婪切片。
 *
 * 用于 collector flush 阶段：把一次 flush 出来的整桶切成多个 ReportPayload，
 * 避免单批拼成 GET URL 后超过网关 / CDN / 浏览器 URL 上限（典型 8KB）。
 *
 * 行为：
 *   - **不丢任何事件**：单条事件即便已超 maxBytes 也独占一片（由 queue.enqueue 的
 *     `SINGLE_EVENT_MAX_BYTES` 兜底，正常路径走不到这里）。
 *   - **保持顺序**：贪婪累加，不打乱 flatten 排序结果，保证 lt=1 在最前 / lt=3 在最后的契约。
 *   - **空数组返回 []**：调用方据此跳过本次发送。
 */
function chunkEvents(events) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _a, _b;
  var maxEvents = (_a = opts.maxEvents) !== null && _a !== void 0 ? _a : Infinity;
  var maxBytes = (_b = opts.maxBytes) !== null && _b !== void 0 ? _b : Infinity;
  var out = [];
  if (!Array.isArray(events) || events.length === 0) return out;
  var safeMaxEvents = maxEvents > 0 ? maxEvents : Infinity;
  var safeMaxBytes = maxBytes > 0 ? maxBytes : Infinity;
  var cur = [];
  var curBytes = 2; // 头尾 '[]'
  for (var i = 0; i < events.length; i++) {
    var e = events[i];
    var _s2 = '';
    try {
      _s2 = JSON.stringify(e);
    } catch (_c) {
      // 单条不可序列化交给 collector 丢弃（serializer 不打 console，由外层日志代理）
      continue;
    }
    // 加入后会占用：当前是空片 → s.length；否则 +1（逗号分隔）
    var inc = cur.length === 0 ? _s2.length : _s2.length + 1;
    var wouldExceed = cur.length >= safeMaxEvents || cur.length > 0 && curBytes + inc > safeMaxBytes;
    if (wouldExceed) {
      out.push(cur);
      cur = [];
      curBytes = 2;
    }
    cur.push(e);
    curBytes += cur.length === 1 ? _s2.length : _s2.length + 1;
  }
  if (cur.length > 0) out.push(cur);
  return out;
}
/**
 * 切片版 handleData：返回多个 `requests` 字符串，对应多个 ReportPayload。
 *
 * `chunkEvents` 已保证排序与边界，本函数只做 stringify。
 */
function handleDataChunked(buckets) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var events = flatten(buckets);
  if (events.length === 0) return [];
  var chunks = chunkEvents(events, opts);
  var out = [];
  for (var i = 0; i < chunks.length; i++) {
    out.push(JSON.stringify(chunks[i]));
  }
  return out;
}

/**
 * Pipeline 层共享类型。
 *
 * 单独抽出避免 channel / queue / retry 之间循环 import。
 */
/**
 * 永久性通道错误：本次 payload 自身有问题（与网络无关），重试同一份 payload 永远不会过。
 *
 * 典型场景：
 *   - H5 GET URL 超过 `maxUrlLength`，重发同一份必定再次超长；
 *   - TLS host / projectId / topicId 未配置，换网络也救不了；
 *   - 浏览器内既无 `Image` 全局也没有 `uni.request`：环境本身缺失，重试无意义。
 *
 * 设计意图：
 *   - **不进 channel 内部 `withRetry`**：永久错误一抛立刻冒泡到 collector，避免协议层空转 N 次。
 *   - **不进 retry 队列**：collector 的 `report()` 捕获到 permanent 时跳过 `retry.persist`，
 *     避免下次冷启 `recoverRetry` 反复读出 → 反复失败 → 反复落盘的死循环
 *     （这是 `image url too long` 卡死队列的根因）。
 *   - **死信清理**：`recoverRetry` 重放历史 payload 时若再次拿到 permanent 错误，
 *     直接 `retry.ack(_id)` 删除，不再写回。
 *
 * 错误识别：用 `instanceof PermanentChannelError`。为兼容跨 bundle / 跨上下文（少见但
 * 防御性写法），同时设置 `permanent = true` 标志位，`isPermanentChannelError` 双重判定。
 */
var PermanentChannelError = /*#__PURE__*/function (_Error) {
  (0, _inherits2.default)(PermanentChannelError, _Error);
  var _super = _createSuper(PermanentChannelError);
  function PermanentChannelError(message) {
    var _this;
    (0, _classCallCheck2.default)(this, PermanentChannelError);
    _this = _super.call(this, message);
    /** 兼容跨 bundle 的标志位；与 `instanceof` 任一为真即视为永久错误。 */
    _this.permanent = true;
    _this.name = 'PermanentChannelError';
    // 修复 ts/babel 转译后 prototype 链丢失，导致 instanceof 失效
    Object.setPrototypeOf((0, _assertThisInitialized2.default)(_this), PermanentChannelError.prototype);
    return _this;
  }
  return (0, _createClass2.default)(PermanentChannelError);
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error));
/**
 * 类型守卫：判定一个 unknown 错误是否为永久性通道错误。
 *
 * 兼容三种来源：
 *   1. `instanceof PermanentChannelError`（同一 bundle）；
 *   2. `err.name === 'PermanentChannelError'`（跨 bundle 但同名）；
 *   3. `err.permanent === true`（任意错误显式标记）。
 */
function isPermanentChannelError(err) {
  if (!err || (0, _typeof2.default)(err) !== 'object') return false;
  if (err instanceof PermanentChannelError) return true;
  var e = err;
  if (e.name === 'PermanentChannelError') return true;
  if (e.permanent === true) return true;
  return false;
}

/**
 * Collector：domain 与 pipeline 的编排层。
 *
 * 职责（与 runtime/lifecycleHooks 配合）：
 *   1. `report(input)`：把外部输入（lt + 事件上下文）转成 statData 并入队；
 *      自动填充 session 快照、seq（仅本地状态使用，不再上行）。
 *   2. `flush(force?)`：从 queue 取快照 → serializer → 选 channel → 发送；
 *      成功调用 `visit.commit(now)`；失败 `queue.rollback` + `retry.persist`。
 *   3. `recoverRetry()`：冷启动时由 runtime 触发，把上次未送达的 payload 重试。
 *
 * 设计原则：
 *   - 依赖全部注入；本模块不直接 import 任何 adapter，便于测试与多端切换。
 *   - 不持有业务字段；所有 statData 字段由 `domain/statData.builder` 拼装。
 *   - 错误吞掉 + 日志：collector 层异常**不应**抛回到生命周期回调，避免污染业务页面。
 */
/**
 * 默认 payload id 生成；与 retry.ts 的 genId 风格一致但前缀不同，便于日志区分。
 */
function defaultGenPayloadId(nowMs) {
  return 'p-' + nowMs.toString(36) + '-' + Math.random().toString(36).slice(2, 6);
}
function createCollector(deps) {
  /** 是否已完成进程内首次 flush（含延迟触发的那一次）。 */
  var firstFlushDone = false;
  /** 已安排的延迟 flush 定时器，避免重复 schedule。 */
  var deferredFlushTimer = null;
  /** 取消已安排的延迟首 flush（`flush(true)` 等显式调用前使用）。 */
  function cancelDeferredFlush() {
    if (deferredFlushTimer == null) return;
    clearTimeout(deferredFlushTimer);
    deferredFlushTimer = null;
  }
  /**
   * `report` 达到阈值后的自动 flush 入口；仅此处做冷启动延迟（方案 C）。
   */
  function triggerAutoFlush() {
    var _a;
    var deferMs = Math.max(0, Math.floor((_a = deps.firstFlushDeferMs) !== null && _a !== void 0 ? _a : 0));
    if (!firstFlushDone && deferMs > 0) {
      if (deferredFlushTimer != null) return;
      deferredFlushTimer = setTimeout(function () {
        deferredFlushTimer = null;
        firstFlushDone = true;
        void flushImpl(false).catch(function (e) {
          return logger.warn('[uni统计 2.0] auto-flush failed', e);
        });
      }, deferMs);
      return;
    }
    firstFlushDone = true;
    void flushImpl(false).catch(function (e) {
      return logger.warn('[uni统计 2.0] auto-flush failed', e);
    });
  }
  /**
   * 构造 EventContext 并入队。
   *
   * 不再附加 pid（上一会话 sid）：参数文档无该字段，新会话信息由 lt=1 自身的
   * `sid / cst / fvts / lvts / tvc` 表达。
   */
  function report(input) {
    tryRun(function () {
      var t = typeof input.t === 'number' ? input.t : deps.nowSec();
      var snap = deps.session.getSnapshot();
      var sessionForCtx;
      if (snap) {
        var seq = deps.session.nextSeq();
        sessionForCtx = Object.assign({}, snap, {
          seq: seq
        });
      }
      // 用户主动行为事件（lt=21：自定义事件 / login / pay / share 拦截器）刷新
      // 前台无操作计时器，避免用户持续操作却无翻页时被误判「无操作超时」开新会话（cst=3）。
      // 仅 lt=21 视为「用户触达」；lt=1/3/11/31/101 由会话状态机自身管理。
      if (snap && input.lt === LT.Event && deps.session.touch) {
        deps.session.touch(t);
      }
      var ctx = Object.assign({}, input, {
        t: t,
        session: sessionForCtx
      });
      var data = deps.builder.build(ctx);
      // 调试日志打印完整对象（含空串）；入队发送侧去掉 '' 键以缩短 image URL
      logCollect(data);
      deps.queue.enqueue(omitEmptyStringFieldsForUpload(data));
      if (deps.queue.shouldFlush()) {
        triggerAutoFlush();
      }
    }, undefined);
  }
  /**
   * 真正发送：取快照、序列化、挑通道、按双阈值切片、串行发送，根据结果 commit/persist。
   *
   * 切片策略（修复 image url too long 死循环）：
   *   - 用 `handleDataChunked(snapshot, { maxEvents, maxBytes })` 把整桶切成 N 份；
   *   - 单片失败：永久错（`PermanentChannelError`）→ 直接丢弃，不 persist、不影响其他片；
   *     非永久错 → 调用 `retry.persist`，下次冷启 `recoverRetry` 重放该片。
   *   - **任意片失败** → 不 commit visit；**全部片成功** → commit 一次。
   *     切片场景下 `lt=1` 必定落在第一片（serializer 已按 `LT_ORDER` 排序），
   *     若需要更精细的"首批成功就 commit"，下一步迭代再做。
   *   - 通道不可用：依旧整桶 rollback 回 queue（与切片前行为一致）。
   *
   * @param force 强制 flush（忽略节流阈值）。
   */
  function flushImpl() {
    return __awaiter(this, arguments, void 0, function () {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var _a, _b, _c, _d, _e, snapshot, channel, globalMaxBytes, channelMaxBytes, limits, chunks, startMs, totalCount, _i6, _Object$keys5, lt, arr, hasLaunch, okEvents, failedEvents, allOk, firstChunkOk, i, requests, payload, sliceEvents, id, visitAccepted;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (deps.queue.shouldFlush(force)) {
                  _context3.next = 2;
                  break;
                }
                return _context3.abrupt("return");
              case 2:
                snapshot = deps.queue.flush();
                if (snapshot) {
                  _context3.next = 5;
                  break;
                }
                return _context3.abrupt("return");
              case 5:
                channel = deps.selectChannel();
                if (channel) {
                  _context3.next = 11;
                  break;
                }
                logger.warn('[uni统计 2.0] 无可用上报线路，本批已回滚队列');
                logNoChannel({
                  bucket: snapshot
                });
                deps.queue.rollback(snapshot);
                return _context3.abrupt("return");
              case 11:
                // 切片阈值 = min(全局配置, 通道物理上限)
                //   - 全局：BATCH_REQUESTS_MAX_BYTES（业务可调）
                //   - 通道：image GET URL 经 encodeURIComponent 膨胀，原文不能按 URL 上限直接用
                //     → 由 image 通道 maxRequestBytes() 反推（见 image.ts）
                // 这样 100 条事件在 image 通道下不会再切出"原文 4KB / encoded 7.5KB"超长片。
                globalMaxBytes = (_b = (_a = deps.batchLimits) === null || _a === void 0 ? void 0 : _a.maxBytes) !== null && _b !== void 0 ? _b : BATCH_REQUESTS_MAX_BYTES;
                channelMaxBytes = typeof channel.maxRequestBytes === 'function' ? channel.maxRequestBytes() : Number.POSITIVE_INFINITY;
                limits = {
                  maxEvents: (_d = (_c = deps.batchLimits) === null || _c === void 0 ? void 0 : _c.maxEvents) !== null && _d !== void 0 ? _d : BATCH_MAX_EVENTS,
                  maxBytes: Math.min(globalMaxBytes, channelMaxBytes)
                };
                chunks = handleDataChunked(snapshot, limits);
                if (!(chunks.length === 0)) {
                  _context3.next = 19;
                  break;
                }
                // 快照已被 flush() 从队列摘除，但切片结果为空（极端：桶内全是空数组 key，
                // 或所有事件 JSON.stringify 失败）。若直接 return 会**静默丢数**，故回滚回队列等待下次。
                logger.warn('[uni统计 2.0] flush 切片结果为空，已回滚队列', snapshot);
                deps.queue.rollback(snapshot);
                return _context3.abrupt("return");
              case 19:
                startMs = deps.nowMs();
                totalCount = 0;
                for (_i6 = 0, _Object$keys5 = Object.keys(snapshot); _i6 < _Object$keys5.length; _i6++) {
                  lt = _Object$keys5[_i6];
                  arr = snapshot[lt];
                  if (Array.isArray(arr)) totalCount += arr.length;
                }
                logReportStart({
                  channel: channel.name,
                  bucket: snapshot
                });
                // 切片是适配 image URL 长度限制 / 全局 batch 字节阈值的内部分批策略，业务方
                // 不应感知。统计维度统一为**事件数**：成功片累计 okEvents、失败片累计 failedEvents
                // + per-slice logReportFailure（保留原因）；末尾由 logReportSummary 输出统一汇总。
                // visit 字段（fvts/lvts/tvc）只随 lt=1 上行，而 serializer 已按 LT_ORDER 把 lt=1
                // 排到最前 → 必定落在第一片（chunks[0]）。因此「访问是否被服务端接收」只取决于
                // 第一片是否成功，与后续 lt=21/31 等切片成败无关。
                //   - 桶内有 lt=1：以 chunks[0] 成功与否决定 commit / rollback（部分成功也可 commit，
                //     避免后续片失败把已被接收的访问回滚，造成本地与服务端口径偏差）。
                //   - 桶内无 lt=1：visit pending 本就为空，commit/rollback 均为 noop；沿用「全部成功才 commit」
                //     的旧语义，保持既有行为与测试稳定。
                hasLaunch = Array.isArray(snapshot['1']) && snapshot['1'].length > 0;
                okEvents = 0;
                failedEvents = 0;
                allOk = true;
                firstChunkOk = true;
                i = 0;
              case 29:
                if (!(i < chunks.length)) {
                  _context3.next = 55;
                  break;
                }
                requests = chunks[i];
                payload = {
                  usv: deps.config.usv,
                  t: deps.nowSec(),
                  requests: requests,
                  _id: ((_e = deps.genPayloadId) !== null && _e !== void 0 ? _e : function () {
                    return defaultGenPayloadId(deps.nowMs());
                  })()
                };
                sliceEvents = countEvents(requests);
                _context3.prev = 33;
                _context3.next = 36;
                return channel.send(payload);
              case 36:
                okEvents += sliceEvents;
                _context3.next = 52;
                break;
              case 39:
                _context3.prev = 39;
                _context3.t0 = _context3["catch"](33);
                allOk = false;
                if (i === 0) firstChunkOk = false;
                failedEvents += sliceEvents;
                if (!isPermanentChannelError(_context3.t0)) {
                  _context3.next = 48;
                  break;
                }
                // 永久错：丢弃本片，不 persist、不污染下次冷启
                logger.warn('[uni统计 2.0] 统计上报失败（本批已丢弃，不可重试）', _context3.t0, 'sliceBytes=' + requests.length);
                logReportFailureReason({
                  error: _context3.t0,
                  persistedId: undefined
                });
                return _context3.abrupt("continue", 52);
              case 48:
                logger.warn('[uni统计 2.0] 统计上报失败（已暂存，下次启动自动重试）', _context3.t0);
                id = deps.retry.persist(payload);
                if (!id) {
                  logger.warn('[uni统计 2.0] 统计暂存重试失败（无 retryId），本批已丢弃');
                }
                logReportFailureReason({
                  error: _context3.t0,
                  persistedId: id
                });
              case 52:
                i++;
                _context3.next = 29;
                break;
              case 55:
                visitAccepted = hasLaunch ? firstChunkOk : allOk;
                if (visitAccepted) {
                  tryRun(function () {
                    return deps.visit.commitVisitOnAck(deps.nowSec());
                  }, undefined);
                } else {
                  tryRun(function () {
                    return deps.visit.rollbackPendingVisit();
                  }, undefined);
                }
                // 单批最终汇总：业务方视角只看到"成功/失败/部分失败"，不暴露切片实现。
                // 文案见 debugLog.ts#logReportSummary。
                logReportSummary({
                  channel: channel.name,
                  okCount: okEvents,
                  failedCount: failedEvents,
                  elapsedMs: deps.nowMs() - startMs
                });
              case 58:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[33, 39]]);
      })();
    });
  }
  /** 估算一片的事件数（容错：解析失败按 0 计）。仅供日志展示。 */
  function countEvents(requests) {
    try {
      var arr = JSON.parse(requests);
      return Array.isArray(arr) ? arr.length : 0;
    } catch (_a) {
      return 0;
    }
  }
  /**
   * 把上次进程留在 storage 中的 retry 队列依次重放。
   *
   * 串行执行，失败的条目保留在队列里（不动 _id），调用方会在下次冷启再次重放。
   */
  function recoverRetry() {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee4() {
      var items, channel, i, _iterator2, _step2, payload;
      return _regenerator.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              items = deps.retry.loadAll();
              if (!(items.length === 0)) {
                _context4.next = 3;
                break;
              }
              return _context4.abrupt("return");
            case 3:
              channel = deps.selectChannel();
              if (channel) {
                _context4.next = 7;
                break;
              }
              logger.warn('[uni统计 2.0] 续传重试跳过：当前无可用上报线路');
              return _context4.abrupt("return");
            case 7:
              logRecoverStart(items.length);
              i = 0;
              _iterator2 = _createForOfIteratorHelper(items);
              _context4.prev = 10;
              _iterator2.s();
            case 12:
              if ((_step2 = _iterator2.n()).done) {
                _context4.next = 34;
                break;
              }
              payload = _step2.value;
              i++;
              _context4.prev = 15;
              _context4.next = 18;
              return channel.send(payload);
            case 18:
              if (payload._id) deps.retry.ack(payload._id);
              logRecoverItem({
                index: i,
                total: items.length,
                payloadId: payload._id,
                ok: true
              });
              _context4.next = 32;
              break;
            case 22:
              _context4.prev = 22;
              _context4.t0 = _context4["catch"](15);
              if (!isPermanentChannelError(_context4.t0)) {
                _context4.next = 29;
                break;
              }
              if (payload._id) deps.retry.ack(payload._id);
              logger.warn('[uni统计 2.0] 续传重试失败（不可重试，已从队列移除）', _context4.t0, 'id=' + payload._id);
              logRecoverItem({
                index: i,
                total: items.length,
                payloadId: payload._id,
                ok: false,
                error: _context4.t0
              });
              return _context4.abrupt("continue", 32);
            case 29:
              if (payload._id && deps.retry.markAttempt) {
                // markAttempt 内部超过 maxAttempts 会自动 ack 兜底（参见 retry.ts）
                deps.retry.markAttempt(payload._id);
              }
              logger.warn('[uni统计 2.0] 续传重试失败（保留队列，下次启动再试）', _context4.t0);
              logRecoverItem({
                index: i,
                total: items.length,
                payloadId: payload._id,
                ok: false,
                error: _context4.t0
              });
            case 32:
              _context4.next = 12;
              break;
            case 34:
              _context4.next = 39;
              break;
            case 36:
              _context4.prev = 36;
              _context4.t1 = _context4["catch"](10);
              _iterator2.e(_context4.t1);
            case 39:
              _context4.prev = 39;
              _iterator2.f();
              return _context4.finish(39);
            case 42:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[10, 36, 39, 42], [15, 22]]);
    }));
  }
  /**
   * 对外 flush：显式调用（含 `flush(true)`）立即发送，并取消尚未触发的延迟首 flush。
   */
  function flush() {
    return __awaiter(this, arguments, void 0, function () {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                cancelDeferredFlush();
                firstFlushDone = true;
                return _context5.abrupt("return", flushImpl(force));
              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      })();
    });
  }
  /** 取消延迟首 flush 定时器，防止 collector 被弃后仍触发幽灵 flush。 */
  function destroy() {
    cancelDeferredFlush();
    // 置为「已完成首 flush」，即便有残留闭包再次调用 triggerAutoFlush 也不会重排定时器。
    firstFlushDone = true;
  }
  return {
    report: report,
    flush: flush,
    recoverRetry: recoverRetry,
    destroy: destroy
  };
}

/**
 * 1.0 通道：HTTP POST 上报。
 *
 * 兼容私有版同协议（`uni.request(POST STAT_URL)`），并修复其历史缺陷：
 *   - #1 `_retry` 未初始化导致 NaN：本实现以 `withRetry({times})` 显式控制。
 *   - #16 H5 在 nvue/部分小程序无 `Image`：本实现以 `uni.request` 为主；TLS 公有版 image
 *     通道的 H5 路径亦优先 `uni.request` GET 以读取 HTTP 状态，避免误报成功。
 *
 * 接口契约：
 *   - `available()`：在任何 uni 平台都返回 true（HTTP 是兜底通道）。
 *   - `send(payload)`：成功 resolve；3 次重试全失败抛错（供 retry.persist 落盘）。
 *   - 不缓存任何状态；每次 `send` 是无状态的。
 */
function getUni$5() {
  var u = resolveUniRuntime();
  return u != null && (0, _typeof2.default)(u) === 'object' ? u : undefined;
}
/**
 * 把 payload 拼成 query string，供 H5 image fallback 使用。
 *
 * 私有版用 `get_sgin(get_encodeURIComponent_options(data))` 还会算签名；公有版去掉签名
 * （服务端历史阶段仅 1.0 走签名，2.0 已弃用），保持 query 简单可读：
 *   `?usv=3&t=...&requests=URL_ENCODED_JSON`
 */
function toQuery(payload) {
  var out = [];
  out.push('usv=' + encodeURIComponent(String(payload.usv)));
  out.push('t=' + encodeURIComponent(String(payload.t)));
  out.push('requests=' + encodeURIComponent(payload.requests));
  return out.join('&');
}
/**
 * H5 image 通道。仅在 `Image` 全局存在时调用；否则返回 false 让外层退回 `uni.request`。
 *
 * 不等待 onload/onerror（image 兜底语义即"发出去就算"），同步 resolve。
 * 若 `new Image()` 本身抛错也吞掉，转给 fallback。
 */
function tryImageRequest(payload) {
  var h5Url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : STAT_H5_URL;
  var ImageCtor = getGlobalObject().Image;
  if (typeof ImageCtor !== 'function') return false;
  return tryRun(function () {
    var img = new ImageCtor();
    img.src = h5Url + '?' + toQuery(payload);
    return true;
  }, false);
}
function createHttpChannel() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _a, _b, _c, _d, _e;
  var url = (_a = opts.url) !== null && _a !== void 0 ? _a : STAT_URL;
  var h5Url = (_b = opts.h5Url) !== null && _b !== void 0 ? _b : STAT_H5_URL;
  var ut = (_c = opts.ut) !== null && _c !== void 0 ? _c : '';
  var timeoutMs = (_d = opts.timeoutMs) !== null && _d !== void 0 ? _d : 10000;
  var maxRetries = (_e = opts.maxRetries) !== null && _e !== void 0 ? _e : HTTP_MAX_RETRIES;
  function once(payload) {
    if (ut === 'h5' && opts.preferImageOnH5 !== false) {
      if (tryImageRequest(payload, h5Url)) return Promise.resolve();
    }
    var u = getUni$5();
    if (!u || typeof u.request !== 'function') {
      return Promise.reject(new Error('uni.request unavailable'));
    }
    return new Promise(function (resolve, reject) {
      var settled = false;
      var timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        reject(new Error('http timeout'));
      }, timeoutMs);
      u.request({
        url: url,
        method: 'POST',
        data: payload,
        timeout: timeoutMs,
        success: function success(res) {
          var _a;
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          var code = (_a = res === null || res === void 0 ? void 0 : res.statusCode) !== null && _a !== void 0 ? _a : 0;
          if (code >= 200 && code < 300) resolve();else reject(new Error('http status ' + code));
        },
        fail: function fail(e) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          reject(e instanceof Error ? e : new Error(String(e)));
        }
      });
    });
  }
  return {
    name: '1.0',
    available: function available() {
      var u = getUni$5();
      return !!(u && typeof u.request === 'function');
    },
    send: function send(payload) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return withRetry(function () {
                  return once(payload);
                }, {
                  times: maxRetries,
                  baseDelayMs: RETRY_BASE_DELAY_MS,
                  sleep: opts.sleep
                });
              case 3:
                _context6.next = 9;
                break;
              case 5:
                _context6.prev = 5;
                _context6.t0 = _context6["catch"](0);
                logger.warn('[uni统计 2.0] 统计上报失败（HTTP 已重试）', _context6.t0);
                throw _context6.t0;
              case 9:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 5]]);
      }));
    }
  };
}

/**
 * 公有版默认通道：火山 TLS Web 采集。
 *
 * **官方 GET**（`uni.request`，App / 小程序 / H5·微信回退）：
 *   `GET ${host}/WebTrack?ProjectId&TopicId&Logs&Source&Time&…`
 *   与文档 `curl GET 'http://${host}/WebTrack?ProjectId=…&TopicId=…&key=val'` 一致。
 *
 * **信标 GET**（H5 `fetch`/`Image`、微信 `preloadAssets`）：
 *   `GET ${host}/WebTrack.gif?…`（query 与 `/WebTrack` 相同，路径为 1×1 像素接口）。
 *   H5 优先 `fetch(keepalive)` 读真实状态码；采集端返回 `200 application/json` 且带
 *   `Access-Control-Allow-Origin: *`，故可跨域判定成败（旧 `<img>` 信标无法读状态，降级兜底）。
 *
 * **已废弃 POST**：`POST ${host}/WebTracks?ProjectId&TopicId` + JSON body。
 */
/** 官方 GET 接口路径（`uni.request`）。 */
var WEBTRACK_API_PATH = '/WebTrack';
/** 浏览器 / 微信 preload 信标路径。 */
var WEBTRACK_BEACON_PATH = '/WebTrack.gif';
/**
 * 解析运行时 `uni.request` API。
 */
function getUni$4() {
  var u = resolveUniRuntime();
  return u != null && (0, _typeof2.default)(u) === 'object' ? u : undefined;
}
/** URL 中除 `Logs` 外的固定 query 字节预算（保守值）。 */
var REPORT_URL_BASE_OVERHEAD = 256;
/** `encodeURIComponent` 字节膨胀比上界（用于 collector 切片反推）。 */
var REPORT_ENCODE_RATIO = 3.0;
/**
 * 拼装统计上报 query（ProjectId / TopicId / Logs / Source / Time）。
 *
 * @param payload 上报 payload；`requests` 为 `JSON.stringify(events)`。
 * @param opts    host / projectId / topicId / path / nowMs。
 */
function buildStatReportUrl(payload, opts) {
  var _a;
  var t = ((_a = opts.nowMs) !== null && _a !== void 0 ? _a : function () {
    return Date.now();
  })();
  var logs = encodeURIComponent(payload.requests);
  var host = opts.host.replace(/\/+$/, '');
  return host + opts.path + '?ProjectId=' + encodeURIComponent(opts.projectId) + '&TopicId=' + encodeURIComponent(opts.topicId) + '&Logs=' + logs + '&Source=webImg' + '&Time=' + t;
}
/**
 * 将 `uni.request` 返回的 `data` 压成短串，便于在 Error.message 中展示。
 *
 * @param data   success 回调中的 `res.data`
 * @param maxLen 最大字符数
 */
function summarizeHttpErrorBody(data) {
  var maxLen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 320;
  if (data == null) return '';
  if (typeof data === 'string') {
    return data.length <= maxLen ? data : data.slice(0, maxLen) + '…';
  }
  try {
    var _s3 = JSON.stringify(data);
    return _s3.length <= maxLen ? _s3 : _s3.slice(0, maxLen) + '…';
  } catch (_a) {
    return String(data).slice(0, maxLen);
  }
}
/**
 * H5 最后兜底：`Image` 触发 `/WebTrack.gif`；`onload` / `onerror` 均 resolve，仅超时 reject。
 *
 * ## 为什么 onload/onerror 都判成功（且为何不再作为首选）
 *
 * 采集端 `/WebTrack.gif` 成功时返回 `200 application/json`（空体），**并非合法图片**，
 * 浏览器无法把响应解码为图片 → 即便上报成功也会触发 `onerror`。因此 `<img>` 信标
 * 物理上**无法区分**「成功（JSON 响应）」与「真实失败（DNS/网络/拦截/4xx/5xx）」，
 * 只能一律 resolve，否则每次成功都会被误判失败并重试。
 *
 * 这是一个有损降级：仅在**既无 `fetch` 又无 `uni.request`** 的极旧 H5 环境才会走到。
 * 正常环境优先 `fetchBeaconAwait`（读真实状态码），次选 `uni.request` GET（读 statusCode）。
 *
 * @param url 完整信标 URL
 * @param ms  超时毫秒
 */
function imageBeaconAwait(url, ms) {
  var ImageCtor = getGlobalObject().Image;
  if (typeof ImageCtor !== 'function') {
    return Promise.reject(new PermanentChannelError('当前环境无法完成统计上报'));
  }
  return new Promise(function (resolve, reject) {
    var settled = false;
    var timer = setTimeout(function () {
      if (settled) return;
      settled = true;
      reject(new Error('统计上报超时'));
    }, ms);
    var img = new ImageCtor();
    img.onload = function () {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve();
    };
    img.onerror = function () {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve();
    };
    img.src = url;
  });
}
/**
 * H5 首选：`fetch` 触发 `/WebTrack.gif`，读取真实 HTTP 状态码判定成败。
 *
 * ## 为什么用 fetch 替代 `<img>` 信标
 *
 * 采集端 `/WebTrack.gif` 成功返回 `200 application/json`（空体），且响应头带
 * `Access-Control-Allow-Origin: *`，因此 H5 可**跨域读取** `res.ok`：
 *   - 2xx → 送达成功，resolve；
 *   - 其余状态码 / 网络异常（DNS、断网、CSP/拦截、4xx/5xx）→ reject，交由
 *     `withRetry` 重试，最终失败落盘 retry，**不再被静默 ACK**。
 *
 * `keepalive: true` 保证页面卸载（如 `lt=3` hide 期）请求仍能发出，等价于
 * `<img>` 信标的「卸载存活」能力，因此可安全取代旧的 onerror=成功 兜底。
 *
 * `credentials: 'omit'`：仅需读状态码，无需携带 cookie；同时规避
 * `Allow-Origin:*` 与 `include` 凭证模式在浏览器侧的冲突。
 *
 * @param url 完整信标 URL
 * @param ms  超时毫秒
 */
function fetchBeaconAwait(url, ms) {
  var g = getGlobalObject();
  var fetchFn = g.fetch;
  if (typeof fetchFn !== 'function') {
    return Promise.reject(new Error('fetch unavailable'));
  }
  var controller = typeof g.AbortController === 'function' ? new g.AbortController() : undefined;
  return new Promise(function (resolve, reject) {
    var settled = false;
    var timer = setTimeout(function () {
      if (settled) return;
      settled = true;
      if (controller) tryRun(function () {
        return controller.abort();
      }, undefined);
      reject(new Error('统计上报超时'));
    }, ms);
    fetchFn(url, {
      method: 'GET',
      keepalive: true,
      credentials: 'omit',
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (res && res.ok) {
        resolve();
        return;
      }
      reject(new Error('统计上报 HTTP ' + (res ? res.status : 0)));
    }, function (e) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(e instanceof Error ? e : new Error(String(e)));
    });
  });
}
/**
 * 读取微信 `wx.preloadAssets`（仅 mp-weixin 信标使用）。
 */
function getWxPreloadAssets() {
  var wx = getGlobalObject().wx;
  return typeof (wx === null || wx === void 0 ? void 0 : wx.preloadAssets) === 'function' ? wx.preloadAssets : undefined;
}
/**
 * 规范化 `wx.preloadAssets` 的 fail 入参。
 */
function formatWxPreloadFail(err) {
  if (err instanceof Error) return err;
  if (err != null && (0, _typeof2.default)(err) === 'object' && 'errMsg' in err) {
    var msg = err.errMsg;
    if (typeof msg === 'string' && msg.length > 0) return new Error(msg);
  }
  if (err == null) return new Error('preloadAssets fail (empty err)');
  return new Error(String(err));
}
/**
 * 微信：`wx.preloadAssets` 拉取 `/WebTrack.gif`；仅 `success` 视为送达。
 *
 * @param url     完整信标 URL
 * @param ms      超时毫秒
 * @param preload 已校验存在的 `wx.preloadAssets`
 */
function mpWeixinPreloadAssetsBeaconAwait(url, ms, preload) {
  return new Promise(function (resolve, reject) {
    var settled = false;
    var timer = setTimeout(function () {
      if (settled) return;
      settled = true;
      reject(new Error('统计上报超时(preloadAssets)'));
    }, ms);
    try {
      preload({
        data: [{
          type: 'image',
          src: url
        }],
        success: function success() {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve();
        },
        fail: function fail(err) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          reject(formatWxPreloadFail(err));
        }
      });
    } catch (e) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(e instanceof Error ? e : new Error(String(e)));
    }
  });
}
/**
 * 微信小程序是否启用 preload 信标（开关开且宿主为 mp-weixin）。
 */
function isMpWeixinPreloadEnabled(opts) {
  var _a, _b;
  var enabled = (_a = opts.mpWeixinPreloadReport) !== null && _a !== void 0 ? _a : MP_WEIXIN_USE_PRELOAD_ASSETS_REPORT;
  if (!enabled) return false;
  var raw = (_b = opts.rawPlatform) !== null && _b !== void 0 ? _b : getRawPlatform();
  return raw === 'mp-weixin';
}
function createImageChannel() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _a, _b, _c, _d, _e, _f, _g;
  var host = (_a = opts.host) !== null && _a !== void 0 ? _a : IMAGE_REPORT_DEFAULTS.host;
  var projectId = (_b = opts.projectId) !== null && _b !== void 0 ? _b : IMAGE_REPORT_DEFAULTS.projectId;
  var topicId = (_c = opts.topicId) !== null && _c !== void 0 ? _c : IMAGE_REPORT_DEFAULTS.topicId;
  var timeoutMs = (_d = opts.timeoutMs) !== null && _d !== void 0 ? _d : 10000;
  var maxRetries = (_e = opts.maxRetries) !== null && _e !== void 0 ? _e : IMAGE_MAX_RETRIES;
  var maxUrlLength = (_f = opts.maxUrlLength) !== null && _f !== void 0 ? _f : 6 * 1024;
  var preferBeacon = opts.preferImageBeacon !== false;
  var nowMs = opts.nowMs;
  var ut = (_g = opts.ut) !== null && _g !== void 0 ? _g : '';
  var isH5 = ut === 'h5';
  var mpWeixinPreload = isMpWeixinPreloadEnabled(opts);
  function configured() {
    return !!(host && projectId && topicId);
  }
  var reportOpts = {
    host: host,
    projectId: projectId,
    topicId: topicId,
    nowMs: nowMs
  };
  /**
   * 校验配置并拼装 URL；超长抛 `PermanentChannelError`。
   *
   * @param payload 批次数据
   * @param path    `WEBTRACK_API_PATH` 或 `WEBTRACK_BEACON_PATH`
   */
  function preflightUrl(payload, path) {
    if (!configured()) {
      throw new PermanentChannelError('统计上报未配置：请设置 TLS host、projectId、topicId');
    }
    var url = buildStatReportUrl(payload, {
      host: reportOpts.host,
      projectId: reportOpts.projectId,
      topicId: reportOpts.topicId,
      nowMs: reportOpts.nowMs,
      path: path
    });
    if (url.length > maxUrlLength) {
      throw new PermanentChannelError('统计上报 URL 过长: ' + url.length + ' > ' + maxUrlLength);
    }
    return url;
  }
  /**
   * `uni.request` GET `/WebTrack`（官方普通 GET，非信标）。
   */
  function webTrackGetViaRequest(url) {
    var u = getUni$4();
    if (!u || typeof u.request !== 'function') {
      return Promise.reject(new PermanentChannelError('当前环境无法完成统计上报'));
    }
    return new Promise(function (resolve, reject) {
      var settled = false;
      var timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        reject(new Error('统计上报超时'));
      }, timeoutMs);
      u.request({
        url: url,
        method: 'GET',
        timeout: timeoutMs,
        success: function success(res) {
          var _a;
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          var code = (_a = res === null || res === void 0 ? void 0 : res.statusCode) !== null && _a !== void 0 ? _a : 0;
          if (code >= 200 && code < 300) {
            resolve();
            return;
          }
          var hint = summarizeHttpErrorBody(res === null || res === void 0 ? void 0 : res.data);
          reject(new Error(hint ? "\u7EDF\u8BA1\u4E0A\u62A5 HTTP ".concat(code, ": ").concat(hint) : "\u7EDF\u8BA1\u4E0A\u62A5 HTTP ".concat(code)));
        },
        fail: function fail(e) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          reject(e instanceof Error ? e : new Error(String(e)));
        }
      });
    });
  }
  /**
   * H5 发送方式选择（均能判定真实成败，失败进 retry）：
   *   1. 首选 `fetch` 信标 `/WebTrack.gif`：跨域读 `res.ok`，`keepalive` 保证卸载期送达；
   *   2. 次选 `uni.request` GET `/WebTrack`：读 `statusCode`；
   *   3. 末选 `Image` 信标 `/WebTrack.gif`：仅极旧环境（无 fetch、无 uni.request）兜底，
   *      无法读状态，发出即视为送达（有损）。
   *
   * `preferImageBeacon: false` 时跳过信标，强制走 `uni.request` GET（测试/特殊场景）。
   */
  function onceH5(payload) {
    var g = getGlobalObject();
    var u = getUni$4();
    var hasRequest = !!(u && typeof u.request === 'function');
    if (preferBeacon && typeof g.fetch === 'function') {
      return fetchBeaconAwait(preflightUrl(payload, WEBTRACK_BEACON_PATH), timeoutMs);
    }
    if (hasRequest) {
      return webTrackGetViaRequest(preflightUrl(payload, WEBTRACK_API_PATH));
    }
    if (preferBeacon && typeof g.Image === 'function') {
      return imageBeaconAwait(preflightUrl(payload, WEBTRACK_BEACON_PATH), timeoutMs);
    }
    return Promise.reject(new PermanentChannelError('当前环境无法完成统计上报'));
  }
  /**
   * 微信：优先 `/WebTrack.gif` preload；否则 `uni.request` GET `/WebTrack`。
   */
  function onceMpWeixin(payload) {
    var preloadFn = getWxPreloadAssets();
    if (preloadFn) {
      return mpWeixinPreloadAssetsBeaconAwait(preflightUrl(payload, WEBTRACK_BEACON_PATH), MP_WEIXIN_PRELOAD_TIMEOUT_MS, preloadFn);
    }
    logger.warn('[uni统计 2.0] wx.preloadAssets 不可用，回退 uni.request GET /WebTrack');
    return webTrackGetViaRequest(preflightUrl(payload, WEBTRACK_API_PATH));
  }
  /**
   * 按宿主选择发送方式。
   */
  function dispatchReport(payload) {
    if (isH5) return onceH5(payload);
    if (mpWeixinPreload) return onceMpWeixin(payload);
    return webTrackGetViaRequest(preflightUrl(payload, WEBTRACK_API_PATH));
  }
  return {
    name: 'image',
    available: function available() {
      return configured();
    },
    maxRequestBytes: function maxRequestBytes() {
      var raw = (maxUrlLength - REPORT_URL_BASE_OVERHEAD) / REPORT_ENCODE_RATIO;
      return Math.max(512, Math.floor(raw));
    },
    send: function send(payload) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee7() {
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return withRetry(function () {
                  return dispatchReport(payload);
                }, {
                  times: maxRetries,
                  baseDelayMs: RETRY_BASE_DELAY_MS,
                  sleep: opts.sleep
                });
              case 3:
                _context7.next = 9;
                break;
              case 5:
                _context7.prev = 5;
                _context7.t0 = _context7["catch"](0);
                if (isPermanentChannelError(_context7.t0)) {
                  logger.warn('[uni统计 2.0] 统计上报失败（不可重试）', _context7.t0);
                } else {
                  logger.warn('[uni统计 2.0] 统计上报失败（已重试）', _context7.t0);
                }
                throw _context7.t0;
              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 5]]);
      }));
    }
  };
}

/**
 * 上行字段集中拼装。
 *
 * 私有版痛点：`sendXxxRequest` 系列函数中各自 `Object.assign(getStatData(), ...)`，
 * 字段散落、重复、字段名硬编码、新增字段需改多处。公有版集中到本模块，按事件类型
 * 决定字段子集。
 *
 * 设计要点：
 *   - 通过依赖注入（`createStatDataBuilder(deps)`）解耦 adapter / domain，便于单测。
 *   - 字段全部经过 `s/n` 兜底转换，禁止 undefined 出现在最终上行体（统一用空串 / 0）。
 *   - 事件类型驱动：仅 lt=1 携带 fvts/lvts/tvc / sc 等启动字段；其他事件不携带。
 *   - 仅做拼装，不做副作用：不写 storage、不调 ensureSession（这些由 collector 编排）。
 *   - 严守 ES2015 baseline：禁用 `ObjectExpression > SpreadElement`，统一用 `Object.assign`。
 *
 * 与 `docs/uni统计上报参数.md` 对齐说明：
 *   - 设备 ID 使用文档字段名 `did`（内部 SessionSnapshot/Adapter 仍以 uuid 命名，仅出口处映射）。
 *   - `on`：优先 **`romName`**（厂商 ROM，如 HyperOS）及 **`romVersion`**，否则 **`osName`**。
 *   - 会话创建类型使用文档字段名 `cst`（内部 storage 仍以 sct 命名，仅出口处映射）。
 *   - 不再上行 `sst / seq / pid`（及历史 `odid`）：
 *       * sst/seq 仅本地用于会话状态机，不参与服务端入库；
 *       * pid（上一会话 sid）当前后端无入库口径。
 *     这些字段在 SessionSnapshot 里仍保留，确保会话过期判断、调试日志可继续使用。
 */
/** 字段值兜底：把 undefined / null / NaN 转为类型默认值，避免污染上行 JSON。 */
function s(v) {
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return def;
}
function n(v) {
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.length > 0) {
    var x = Number(v);
    if (Number.isFinite(x)) return x;
  }
  return def;
}
/**
 * 创建 statData 构建器。
 *
 * 调用方典型用法：
 * ```ts
 * const builder = createStatDataBuilder(deps)
 * const data = builder.build({ lt: LT.Page, t: nowSec(), route: '...' })
 * ```
 */
function createStatDataBuilder(deps) {
  /**
   * 复用频率高的"基础字段"——每条事件都带。
   *
   * 字段映射（参考 `docs/uni统计上报参数.md`）：
   *   - `did` ← 内部 `device.uuid`（出口字段重命名为文档口径）
   *   - `p` ← `platform.p` 或 `system.osP`（仅操作系统 slug：`ios` / `android` …）
   *   - `on` ← `system.on`（ROM 展示名优先，否则 `osName`）
   *   - `mpsdk` ← `system.sdkVersion`
   *   - `mpv` ← `system.mpvHostVersion`（宿主客户端版本，与私有版 `sys.version` 同源）
   *   - `domain` ← `web.domain`（H5 含协议域名，如 `https://www.example.com`，非 H5 为空串）
   *   - `pr/ww/wh/sw/sh/lang` 来自 `locale`（实时取，修复缺陷 #18）
   *   - `lat/lng` 当前 LocationResult 仅含字符串经纬度，cn/pn/ct 留空待 adapter 扩展
   *
   * 不再装配 `odid`（老 App 兼容字段已移除）。
   */
  function baseFields() {
    var _a, _b, _c;
    var config = deps.config,
      platform = deps.platform,
      system = deps.system,
      locale = deps.locale,
      device = deps.device,
      net = deps.net,
      location = deps.location,
      pkg = deps.pkg,
      legacy = deps.legacy,
      web = deps.web;
    return {
      ak: s(config.ak),
      usv: s(config.usv),
      v: s((_a = config.v) !== null && _a !== void 0 ? _a : system.appVersion),
      ch: s(config.ch),
      ut: s(platform.ut),
      p: s((_b = platform.p) !== null && _b !== void 0 ? _b : system.osP),
      on: s(system.on),
      did: s(device.uuid),
      brand: s(system.brand),
      md: s(system.md),
      sv: s(system.sv),
      mpsdk: s(system.sdkVersion),
      mpv: s(system.mpvHostVersion),
      pr: n(locale.pr, 1),
      ww: n(locale.ww),
      wh: n(locale.wh),
      sw: n(locale.sw),
      sh: n(locale.sh),
      lang: s(locale.lang),
      net: s(net.net, 'unknown'),
      lat: s(location.lat),
      lng: s(location.lng),
      mpn: s((_c = legacy === null || legacy === void 0 ? void 0 : legacy.mpn) !== null && _c !== void 0 ? _c : pkg.mpn),
      tdaid: s(pkg.tdaid),
      pkn: s(pkg.pkn),
      an: s(pkg.an),
      domain: s(web.domain)
    };
  }
  /**
   * 会话字段：所有 lt 都要带。
   *
   * 与文档对齐：仅上行 `sid` 与 `cst`；
   * 内部状态字段 `sst / seq` 不再随上行体发出，仅保留在 SessionSnapshot 中。
   */
  function sessionFields(ctx) {
    if (!ctx.session) return {};
    return {
      sid: ctx.session.sid,
      cst: ctx.session.sct
    };
  }
  /** 页面字段：lt=11/3 / 普通页面事件携带。 */
  function pageFields(ctx) {
    var out = {};
    if (ctx.url !== undefined) out.url = s(ctx.url);
    if (ctx.urlref !== undefined) out.urlref = s(ctx.urlref);
    if (ctx.urlref_ts !== undefined) out.urlref_ts = n(ctx.urlref_ts);
    if (ctx.ttn !== undefined) out.ttn = s(ctx.ttn);
    if (ctx.ttpj !== undefined) out.ttpj = s(ctx.ttpj);
    if (ctx.ttc !== undefined) out.ttc = s(ctx.ttc);
    return out;
  }
  /**
   * 入口标记：**仅 lt=11** 携带 iey + ppiey（缺省按 0）；lt=1 / lt=3 等不参与入口字段。
   */
  function entryFields(ctx) {
    if (ctx.lt === '11') {
      return {
        iey: toIey(ctx.iey !== undefined ? ctx.iey : false),
        ppiey: toIey(ctx.ppiey !== undefined ? ctx.ppiey : false)
      };
    }
    return {};
  }
  /** 访问字段：仅 lt=1（应用启动 / 新会话）且 collector 显式传入 visit 时携带。 */
  function visitFields(ctx) {
    if (ctx.lt !== '1') return {};
    if (!ctx.visit) return {};
    return {
      fvts: ctx.visit.fvts,
      lvts: ctx.visit.lvts,
      tvc: ctx.visit.tvc
    };
  }
  /** 启动场景：仅 lt=1 携带。 */
  function launchFields(ctx) {
    if (ctx.lt !== '1') return {};
    if (ctx.sc === undefined) return {};
    return {
      sc: s(ctx.sc)
    };
  }
  /**
   * 错误事件特化字段：lt=31 时把 `errMsg`（含 stack）截断后写入 `em`。
   *
   * 截断动机：长 Error stack（尤其是 jest / Node 调用栈）轻易超过 3KB，会让单条事件
   * 触发 `SINGLE_EVENT_MAX_BYTES` 被 enqueue 丢弃；这里在 builder 阶段先做一次软截断，
   * 既能保留头部关键定位信息（错误类型、消息、第一层 stack），又能保证事件可达。
   *
   * 阈值：3KB（保留 1KB buffer 给其他字段，整体仍在 SINGLE_EVENT_MAX_BYTES = 4KB 内）。
   */
  function errorFields(ctx) {
    if (ctx.lt !== '31' || !ctx.errMsg) return {};
    var ERR_MSG_MAX = 3 * 1024;
    var TRUNC_SUFFIX = '…[truncated]';
    var em = s(ctx.errMsg);
    if (em.length > ERR_MSG_MAX) {
      em = em.slice(0, ERR_MSG_MAX - TRUNC_SUFFIX.length) + TRUNC_SUFFIX;
    }
    return {
      em: em
    };
  }
  /** Push 事件特化字段。 */
  function pushFields(ctx) {
    if (ctx.lt !== '101' || !ctx.cid) return {};
    return {
      cid: s(ctx.cid)
    };
  }
  /**
   * 拼装最终上行体。
   *
   * 合并顺序（**后者覆盖前者**）：
   *   base → session → page → entry → visit → launch → error → push → custom
   * custom 放最后，业务可控扩展，但**不允许**覆盖 lt/t/sid 等关键字段（在此过滤）。
   */
  function build(ctx) {
    var safeCustom = {};
    if (ctx.custom) {
      var reserved = new Set(['lt', 't', 'sid', 'cst', 'did', 'p', 'on', 'mpv', 'domain', 'fvts', 'lvts', 'tvc', 'sc']);
      for (var _i7 = 0, _Object$keys6 = Object.keys(ctx.custom); _i7 < _Object$keys6.length; _i7++) {
        var k = _Object$keys6[_i7];
        if (!reserved.has(k)) safeCustom[k] = ctx.custom[k];
      }
    }
    var out = {
      lt: ctx.lt,
      t: n(ctx.t)
    };
    Object.assign(out, baseFields(), sessionFields(ctx), pageFields(ctx), entryFields(ctx), visitFields(ctx), launchFields(ctx), errorFields(ctx), pushFields(ctx), safeCustom);
    return out;
  }
  return {
    build: build
  };
}

/**
 * 系统信息适配。
 *
 * 私有版的痛点（参考缺陷清单 #14、#18）：
 *   - `utils/util.js` 顶层 `export const sys = uni.getSystemInfoSync()`：模块加载即执行
 *     `uni.getSystemInfoSync`，SSR / 单测 / nvue 早期阶段会直接抛错。
 *   - `lang / ww / wh` 等"可变"字段被一同缓存，用户切换系统语言或旋转屏幕后字段失真。
 *
 * 公有版职责：
 *   1. `getSystemInfo()` 懒加载 + 缓存（不可变字段：brand/md/sv/v/ut/on …）。
 *   2. `getLocaleAndScreen()` 实时取（lang + ww/wh + sw/sh + pr）—— 修复缺陷 #18。
 *   3. SSR/单测：任一 API 不存在或抛错时，返回安全空对象，绝不抛。
 *   4. `__resetCache()`：仅供测试，重置缓存。
 *
 * 小程序新基础库对 `getSystemInfoSync` 做了能力拆分，部分字段为空或恒为 0。
 * 因此优先通过 `uni.getDeviceInfo / getAppBaseInfo / getWindowInfo` 取对应信息，
 * 再以 `uni.getSystemInfoSync` 合并兜底（与 uni-app 运行时、uni-api 侧实践一致）。
 *
 * **小程序注意**：`uni` 常由构建注入在模块作用域，仅读 `globalThis.uni` 会取不到
 * 任何 API；必须通过 `resolveUniRuntime()` 与 `package.ts` 等 adapter 对齐。
 * 微信系再叠一层 `wx.getDeviceInfo / getAppBaseInfo / getWindowInfo`（与 `uni-api`
 * `upx2px` 一致），避免 `uni` 代理未就绪时宽高全 0。
 */
var cachedStatic = null;
/**
 * 解析 `uni` 根对象：优先 `globalThis.uni`，再回退宿主注入的模块级 `uni`。
 *
 * @see `infra/uniRuntime.ts` 说明（小程序上仅读 globalThis 会静默失败）。
 */
function getUni$3() {
  var u = resolveUniRuntime();
  return u != null && (0, _typeof2.default)(u) === 'object' ? u : undefined;
}
/**
 * 微信系宿主上再取一层原生拆分 API，与 `uni` 合并结果再叠加以补全字段。
 *
 * @returns 已按 sync→device→app→window 合并过的一条快照；非微信系返回 `null`。
 */
function mergeWxHostSnapshots() {
  var raw = getRawPlatform();
  if (raw !== 'mp-weixin' && raw !== 'mp-qq') return null;
  var wxHost = getGlobalObject().wx;
  if (!wxHost) return null;
  var sync = typeof wxHost.getSystemInfoSync === 'function' ? tryRun(function () {
    return wxHost.getSystemInfoSync();
  }, null) : null;
  var device = typeof wxHost.getDeviceInfo === 'function' ? tryRun(function () {
    return wxHost.getDeviceInfo();
  }, null) : null;
  var appBase = typeof wxHost.getAppBaseInfo === 'function' ? tryRun(function () {
    return wxHost.getAppBaseInfo();
  }, null) : null;
  var windowInfo = typeof wxHost.getWindowInfo === 'function' ? tryRun(function () {
    return wxHost.getWindowInfo();
  }, null) : null;
  return mergeSystemSnapshots(sync, device, appBase, windowInfo);
}
/**
 * 从左到右浅合并多个快照：后者非 `undefined` / `null` 的键覆盖前者。
 *
 * 合并顺序为「sync → device → appBase → window」，使拆分 API 覆盖宿主裁剪后的
 * `getSystemInfoSync` 残缺字段。
 */
function mergeSystemSnapshots() {
  var out = {};
  for (var _len5 = arguments.length, parts = new Array(_len5), _key6 = 0; _key6 < _len5; _key6++) {
    parts[_key6] = arguments[_key6];
  }
  for (var _i8 = 0, _parts = parts; _i8 < _parts.length; _i8++) {
    var p = _parts[_i8];
    if (!p) continue;
    for (var _i9 = 0, _Object$keys7 = Object.keys(p); _i9 < _Object$keys7.length; _i9++) {
      var k = _Object$keys7[_i9];
      var v = p[k];
      if (v !== undefined && v !== null) out[k] = v;
    }
  }
  return out;
}
/**
 * 聚合当前运行时的系统信息：先 `getSystemInfoSync` 打底，再叠拆分 API。
 *
 * 各 API 均经 `tryRun` 包裹，任一失败不影响其余来源。
 */
function mergedSystemInfo() {
  var u = getUni$3();
  var sync = u && typeof u.getSystemInfoSync === 'function' ? tryRun(function () {
    return u.getSystemInfoSync();
  }, null) : null;
  var device = u && typeof u.getDeviceInfo === 'function' ? tryRun(function () {
    return u.getDeviceInfo();
  }, null) : null;
  var appBase = u && typeof u.getAppBaseInfo === 'function' ? tryRun(function () {
    return u.getAppBaseInfo();
  }, null) : null;
  var windowInfo = u && typeof u.getWindowInfo === 'function' ? tryRun(function () {
    return u.getWindowInfo();
  }, null) : null;
  var fromUni = mergeSystemSnapshots(sync, device, appBase, windowInfo);
  var fromWx = mergeWxHostSnapshots();
  var merged = fromWx ? mergeSystemSnapshots(fromUni, fromWx) : fromUni;
  return merged;
}
/**
 * 读取 H5 运行时 `__uniConfig.appVersion`（manifest.versionName）。
 *
 * H5 发行摇树时模块加载期 `window.uni` 可能仍是 `{}` 空桩，`resolveUniRuntime`
 * 无法调用 `getAppBaseInfo`；此时 `__uniConfig` 仍已由构建注入，可作为应用版本兜底。
 */
function resolveUniConfigAppVersion() {
  return tryRun(function () {
    var cfg = getGlobalObject().__uniConfig;
    return typeof (cfg === null || cfg === void 0 ? void 0 : cfg.appVersion) === 'string' ? cfg.appVersion : '';
  }, '');
}
/**
 * 读取构建期注入的 `UNI_APP_VERSION_NAME`（manifest.versionName）。
 *
 * 须**直接**访问 `process.env.UNI_APP_VERSION_NAME`，以便 Vite define 静态替换；
 * 经中间变量读取会导致发行包内始终为空（与 `install.ts#parseInjectedUniStatistics` 同理）。
 */
function resolveBuildTimeAppVersion() {
  var raw = "1.0.0";
  return typeof raw === 'string' ? raw : '';
}
/**
 * 解析上行用的应用版本 `appVersion`（对应 statData 字段 `v` 的主要回退来源）。
 *
 * 优先级：App 原生 `plus.runtime.version` → uni 拆分 API → H5 `__uniConfig` → 构建期 env。
 */
function resolveAppVersionForStat(plus, sys) {
  var _a;
  var fromPlus = (_a = plus === null || plus === void 0 ? void 0 : plus.runtime) === null || _a === void 0 ? void 0 : _a.version;
  if (typeof fromPlus === 'string' && fromPlus) return fromPlus;
  var fromSys = sys.appVersion;
  if (typeof fromSys === 'string' && fromSys) return fromSys;
  var fromUniConfig = resolveUniConfigAppVersion();
  if (fromUniConfig) return fromUniConfig;
  return resolveBuildTimeAppVersion();
}
/**
 * 组装上行 `on`：优先厂商定制系统名（ROM），否则退回操作系统名 `osName`。
 *
 * App 端 `uni.getDeviceInfo` 会带出 `romName`/`romVersion`（见 uni-app-plus 原生 systemInfo）；
 * 微信等小程序沙箱通常无 ROM 字段，此时与仅 `osName` 一致。
 *
 * @param sys `mergedSystemInfo()` 合并结果
 * @returns 去首尾空白后的展示串；均无则空串
 */
function buildOnForStat(sys) {
  var rom = typeof sys.romName === 'string' ? sys.romName.trim() : '';
  if (rom) {
    var romVer = typeof sys.romVersion === 'string' ? sys.romVersion.trim() : '';
    return romVer ? "".concat(rom, " ").concat(romVer).trim() : rom;
  }
  return typeof sys.osName === 'string' ? sys.osName.trim() : '';
}
/**
 * 取静态系统信息（懒加载 + 缓存）。
 *
 * 字段映射策略：
 *   - `brand / md`：优先 `deviceBrand`/`deviceModel`（拆分 API），再退化 `brand`/`model`。
 *   - `sv / v / sdkVersion`：优先 `osVersion`、`hostVersion`、`hostSDKVersion`，兼容旧字段。
 *   - `osP`：由 `platform` / `osName` / `system` 经 `normalizeStatOsP` 得到，供上行 `p`。
 *   - `mpvHostVersion`：`hostVersion ?? version`，与私有版 `sys.version` 同源。
 *   - `on`：`buildOnForStat`（优先 `romName`/`romVersion`，否则 `osName`），供上行 `on`。
 *   - `appVersion`：见 `resolveAppVersionForStat`（H5 发行空桩时回退 `__uniConfig` / 构建 env）。
 *   - 缺失统一空字符串或 0，避免上行 JSON 丢字段语义。
 */
function getSystemInfo() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
  if (cachedStatic) return cachedStatic;
  var sys = mergedSystemInfo();
  var plus = getGlobalObject().plus;
  var appVersion = resolveAppVersionForStat(plus, sys);
  cachedStatic = {
    brand: (_b = (_a = sys.deviceBrand) !== null && _a !== void 0 ? _a : sys.brand) !== null && _b !== void 0 ? _b : '',
    md: (_d = (_c = sys.deviceModel) !== null && _c !== void 0 ? _c : sys.model) !== null && _d !== void 0 ? _d : '',
    sv: (_f = (_e = sys.osVersion) !== null && _e !== void 0 ? _e : sys.system) !== null && _f !== void 0 ? _f : '',
    v: (_h = (_g = sys.hostVersion) !== null && _g !== void 0 ? _g : sys.version) !== null && _h !== void 0 ? _h : '',
    ut: (_j = sys.deviceType) !== null && _j !== void 0 ? _j : 'unknown',
    appVersion: appVersion,
    appWgtVersion: (_p = (_o = (_l = (_k = plus === null || plus === void 0 ? void 0 : plus.runtime) === null || _k === void 0 ? void 0 : _k.appWgtVersion) !== null && _l !== void 0 ? _l : (_m = plus === null || plus === void 0 ? void 0 : plus.runtime) === null || _m === void 0 ? void 0 : _m.appWgtRevision) !== null && _o !== void 0 ? _o : sys.appWgtVersion) !== null && _p !== void 0 ? _p : '',
    mpvHostVersion: ((_r = (_q = sys.hostVersion) !== null && _q !== void 0 ? _q : sys.version) !== null && _r !== void 0 ? _r : '').trim(),
    on: buildOnForStat(sys),
    sdkVersion: (_t = (_s = sys.hostSDKVersion) !== null && _s !== void 0 ? _s : sys.SDKVersion) !== null && _t !== void 0 ? _t : '',
    statusBarHeight: typeof sys.statusBarHeight === 'number' ? sys.statusBarHeight : 0,
    osP: normalizeStatOsP({
      platform: sys.platform,
      osName: sys.osName,
      system: sys.system
    })
  };
  return cachedStatic;
}
/**
 * 取实时字段（lang / 窗口尺寸 / 屏幕尺寸 / dpr）。
 *
 * 每次调用重新走拆分 API + sync 合并，不复用缓存，避免旋转屏、改语言后失真。
 */
function getLocaleAndScreen() {
  var _a, _b;
  var sys = mergedSystemInfo();
  var prRaw = typeof sys.pixelRatio === 'number' ? sys.pixelRatio : typeof sys.devicePixelRatio === 'number' ? sys.devicePixelRatio : 1;
  return {
    lang: ((_b = (_a = sys.hostLanguage) !== null && _a !== void 0 ? _a : sys.language) !== null && _b !== void 0 ? _b : '').replace(/_/g, '-'),
    ww: typeof sys.windowWidth === 'number' ? sys.windowWidth : 0,
    wh: typeof sys.windowHeight === 'number' ? sys.windowHeight : 0,
    sw: typeof sys.screenWidth === 'number' ? sys.screenWidth : 0,
    sh: typeof sys.screenHeight === 'number' ? sys.screenHeight : 0,
    pr: prRaw > 0 ? prRaw : 1
  };
}

/**
 * 包信息适配（公有版新增字段 `tdaid / pkn / an`）。
 *
 * 详细矩阵参考 `04-字段字典与平台获取矩阵.md` §3。本模块职责：
 *   - 启动时调用一次 `getPackageInfo()`，结果常驻内存；不入 storage。
 *   - 每端分支独立函数，便于单测精准 mock。
 *   - 任意端、任意 API 抛错 → 一律降级为 `''`，**绝不**抛出。
 *
 * 字段语义提示：
 *   - `mpn`：兼容字段；各端「原生包名或小程序 appid」的统一口径（与文档 `mpn` 对齐）。
 *   - `tdaid`：第三方平台 appid（如微信小程序 appid）。
 *   - `pkn`：原生包名 / bundleId（App）；小程序无独立包名时为空串，**不与** tdaid 混填。
 *   - `an`：应用展示名（App = plus.runtime.appname；小程序/H5 = `process.env.UNI_APP_NAME` 等）。
 */
var cached$1 = null;
function getUni$2() {
  var u = resolveUniRuntime();
  return u != null && (0, _typeof2.default)(u) === 'object' ? u : undefined;
}
function getPlus() {
  return getGlobalObject().plus;
}
/**
 * 取小程序系列的 tdaid。各端 API 不同：
 *   - 微信/QQ：`uni.getAccountInfoSync().miniProgram.appId`（基础库 ≥ 1.10.0）。
 *   - 支付宝：`my.getAppIdSync()`（部分版本可用）。
 *   - 头条/飞书：`tt.getEnvInfoSync().microapp.appId`。
 *   - 百度：`swan.getEnvInfoSync().common.appKey` 兜底。
 *   - 其他端：暂时返回 ''；后续真机探测后再补。
 *
 * 任何分支抛错都返回 ''。
 */
function getMpTdaid(platform) {
  var u = getUni$2();
  switch (platform) {
    case 'wx':
    case 'qq':
      {
        if (typeof (u === null || u === void 0 ? void 0 : u.getAccountInfoSync) === 'function') {
          var id = tryRun(function () {
            var _a, _b;
            return (_b = (_a = u.getAccountInfoSync().miniProgram) === null || _a === void 0 ? void 0 : _a.appId) !== null && _b !== void 0 ? _b : '';
          }, '');
          if (id) return id;
        }
        var wxHost = getGlobalObject().wx;
        if (typeof (wxHost === null || wxHost === void 0 ? void 0 : wxHost.getAccountInfoSync) === 'function') {
          var id2 = tryRun(function () {
            var _a, _b;
            return (_b = (_a = wxHost.getAccountInfoSync().miniProgram) === null || _a === void 0 ? void 0 : _a.appId) !== null && _b !== void 0 ? _b : '';
          }, '');
          if (id2) return id2;
        }
        var envId = "";
        return typeof envId === 'string' ? envId : '';
      }
    case 'ali':
    case 'dt':
      {
        var my = getGlobalObject().my;
        if (!my) return '';
        var v1 = tryRun(function () {
          var _a, _b;
          return (_b = (_a = my.getAppIdSync) === null || _a === void 0 ? void 0 : _a.call(my)) !== null && _b !== void 0 ? _b : '';
        }, '');
        if (v1) return v1;
        return tryRun(function () {
          var _a, _b, _c;
          return (_c = (_b = (_a = my.getAccountInfoSync) === null || _a === void 0 ? void 0 : _a.call(my).miniProgram) === null || _b === void 0 ? void 0 : _b.appId) !== null && _c !== void 0 ? _c : '';
        }, '');
      }
    case 'tt':
    case 'lark':
      {
        var tt = getGlobalObject().tt;
        return tryRun(function () {
          var _a, _b, _c;
          return (_c = (_b = (_a = tt === null || tt === void 0 ? void 0 : tt.getEnvInfoSync) === null || _a === void 0 ? void 0 : _a.call(tt).microapp) === null || _b === void 0 ? void 0 : _b.appId) !== null && _c !== void 0 ? _c : '';
        }, '');
      }
    case 'bd':
      {
        var swan = getGlobalObject().swan;
        return tryRun(function () {
          var _a, _b, _c;
          return (_c = (_b = (_a = swan === null || swan === void 0 ? void 0 : swan.getEnvInfoSync) === null || _a === void 0 ? void 0 : _a.call(swan).common) === null || _b === void 0 ? void 0 : _b.appKey) !== null && _c !== void 0 ? _c : '';
        }, '');
      }
    default:
      return '';
  }
}
/**
 * App 端 packageName / bundleId。
 *
 * Android 走 `plus.android.runtimeMainActivity().getPackageName()`；
 * iOS 走 `plus.ios.bundleId`，缺失时退化 `plus.runtime.appid`；
 * HarmonyOS 暂时取 `plus.runtime.appid` 兜底（待 OS API 稳定后扩展）。
 */
function getAppPkn() {
  var _a, _b, _c;
  var plus = getPlus();
  if (!plus) return '';
  var osName = (_c = (_b = (_a = plus.os) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== null && _c !== void 0 ? _c : '';
  if (osName.includes('android')) {
    return tryRun(function () {
      var _a, _b, _c, _d, _e;
      return (_e = (_d = (_c = (_b = (_a = plus.android) === null || _a === void 0 ? void 0 : _a.runtimeMainActivity) === null || _b === void 0 ? void 0 : _b.call(_a)) === null || _c === void 0 ? void 0 : _c.getPackageName) === null || _d === void 0 ? void 0 : _d.call(_c)) !== null && _e !== void 0 ? _e : '';
    }, '');
  }
  if (osName === 'ios' || osName === 'iphone os') {
    var v = tryRun(function () {
      var _a, _b;
      return (_b = (_a = plus.ios) === null || _a === void 0 ? void 0 : _a.bundleId) !== null && _b !== void 0 ? _b : '';
    }, '');
    return v || tryRun(function () {
      var _a, _b;
      return (_b = (_a = plus.runtime) === null || _a === void 0 ? void 0 : _a.appid) !== null && _b !== void 0 ? _b : '';
    }, '');
  }
  return tryRun(function () {
    var _a, _b;
    return (_b = (_a = plus.runtime) === null || _a === void 0 ? void 0 : _a.appid) !== null && _b !== void 0 ? _b : '';
  }, '');
}
/**
 * 取 plus.runtime.appname / plus.runtime.name。
 *
 * 旧版本 plus 上字段名不一致，两个都试一次。
 */
function getAppName() {
  var plus = getPlus();
  if (!plus) return '';
  return tryRun(function () {
    var _a, _b;
    return (_b = (_a = plus.runtime) === null || _a === void 0 ? void 0 : _a.appname) !== null && _b !== void 0 ? _b : '';
  }, '') || tryRun(function () {
    var _a, _b;
    return (_b = (_a = plus.runtime) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '';
  }, '');
}
/**
 * 取编译期注入的 UNI_APP_NAME。
 *
 * `plugin/index.ts` 后续会读取 `manifest.json#name` 注入此字段；当前若未注入返回 ''。
 */
function getEnvAppName() {
  var _a;
  return (_a = "梦幻衣橱") !== null && _a !== void 0 ? _a : '';
}
/**
 * 取 H5 端应用名：优先编译期注入，回退 `document.title`。
 */
function getH5AppName() {
  var env = getEnvAppName();
  if (env) return env;
  return tryRun(function () {
    var _a, _b;
    return (_b = (_a = getGlobalObject().document) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : '';
  }, '');
}
/**
 * 启动时获取一次包信息；结果缓存于内存。
 *
 * 所有字段保证返回 `string`；缺失统一为 `''`，符合 `domain/statData.ts` 的字段处理约定。
 */
function getPackageInfo() {
  if (cached$1) return cached$1;
  var platform = getPlatform();
  var mpn = '';
  var tdaid = '';
  var pkn = '';
  var an = '';
  if (isApp()) {
    tdaid = tryRun(function () {
      var _a, _b, _c;
      return (_c = (_b = (_a = getPlus()) === null || _a === void 0 ? void 0 : _a.runtime) === null || _b === void 0 ? void 0 : _b.appid) !== null && _c !== void 0 ? _c : '';
    }, '');
    pkn = getAppPkn() || tdaid;
    an = getAppName() || getEnvAppName();
    mpn = pkn || tdaid;
  } else if (isMp()) {
    tdaid = getMpTdaid(platform);
    pkn = '';
    an = getEnvAppName();
    mpn = tdaid || ( true ? "" : undefined);
  } else if (isH5()) {
    tdaid = '';
    pkn = '';
    an = getH5AppName();
    mpn = '';
  } else {
    // unknown / 快应用等：尝试 env 注入即可
    tdaid = '';
    pkn = '';
    an = getEnvAppName();
    mpn = '';
  }
  cached$1 = {
    mpn: mpn,
    tdaid: tdaid,
    pkn: pkn,
    an: an
  };
  return cached$1;
}

/**
 * H5 / Web 平台适配。
 *
 * 职责：采集仅 Web 端有意义的上行字段原料（如含协议的页面域名 `domain`）。
 * 非 H5 或运行时无 `window.location` 时一律返回空串，不抛错。
 */
var EMPTY_WEB_INFO = {
  domain: ''
};
var cached = null;
/**
 * 从 `location` 解析上行 `domain`（`https://host` / `http://host` 形式）。
 *
 * 仅 `http:` / `https:` 协议有效；`file:` 等返回空串。
 */
function readWebDomainFromLocation(loc) {
  var protocol = typeof loc.protocol === 'string' ? loc.protocol.toLowerCase() : '';
  if (protocol !== 'http:' && protocol !== 'https:') return '';
  if (typeof loc.origin === 'string' && loc.origin.trim()) {
    return loc.origin.trim();
  }
  var host = typeof loc.host === 'string' && loc.host.trim() ? loc.host.trim() : typeof loc.hostname === 'string' ? loc.hostname.trim() : '';
  if (!host) return '';
  return "".concat(protocol, "//").concat(host);
}
/**
 * 读取 H5 页面 Web 信息。
 *
 * 非 H5、SSR 或无 `location` 时 `domain` 为空串。
 * 结果在进程内缓存（SPA 内 origin 通常不变）。
 */
function getWebInfo() {
  if (!isH5()) return EMPTY_WEB_INFO;
  if (cached !== null) return cached;
  cached = tryRun(function () {
    var win = getGlobalObject();
    var loc = win.location;
    if (!loc) return EMPTY_WEB_INFO;
    return {
      domain: readWebDomainFromLocation(loc)
    };
  }, EMPTY_WEB_INFO);
  return cached;
}
var registry = new Map();
/**
 * 本模块每个 api 最近一次装入 uni 的 fanout 引用。
 * 用于重装 / 解绑时按引用精准 `removeInterceptor(api, prevFanout)`，不波及第三方拦截器。
 */
var installedFanout = new Map();
/**
 * 注册一个拦截器。同一 api 重复注册会去重，并自动按当前注册集合重装到 uni。
 *
 * @returns 解绑函数。调用后从集合中移除本次的 handlers，并按剩余集合重新装配。
 */
function add(api, handlers) {
  var _a;
  var set = (_a = registry.get(api)) !== null && _a !== void 0 ? _a : new Set();
  set.add(handlers);
  registry.set(api, set);
  reinstall(api);
  return function () {
    var cur = registry.get(api);
    if (!cur) return;
    cur.delete(handlers);
    if (cur.size === 0) {
      registry.delete(api);
      var prev = installedFanout.get(api);
      installedFanout.delete(api);
      if (prev) {
        try {
          // 精准移除本模块的 fanout，保留第三方在同一 api 上的拦截器。
          getUni$1().removeInterceptor(api, prev);
        } catch (_a) {
          // 即使解绑失败也应保证下次重装时不带本次 handlers
        }
      }
    } else {
      reinstall(api);
    }
  };
}
/**
 * 把某个 api 的全部 handlers 合并成单个 fanout 拦截器。
 *
 * 闭包持有 `set` 引用（registry 内的同一 Set），故 fanout 会实时反映集合的增删。
 */
function buildFanout(set) {
  return {
    invoke: function invoke(args) {
      var blocked = false;
      var _iterator3 = _createForOfIteratorHelper(set),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var h = _step3.value;
          if (!h.invoke) continue;
          var r = h.invoke(args);
          if (r === false) blocked = true;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return blocked ? false : undefined;
    },
    success: function success(res) {
      var _a;
      var _iterator4 = _createForOfIteratorHelper(set),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var h = _step4.value;
          (_a = h.success) === null || _a === void 0 ? void 0 : _a.call(h, res);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    },
    fail: function fail(err) {
      var _a;
      var _iterator5 = _createForOfIteratorHelper(set),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var h = _step5.value;
          (_a = h.fail) === null || _a === void 0 ? void 0 : _a.call(h, err);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    },
    complete: function complete(res) {
      var _a;
      var _iterator6 = _createForOfIteratorHelper(set),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var h = _step6.value;
          (_a = h.complete) === null || _a === void 0 ? void 0 : _a.call(h, res);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    },
    returnValue: function returnValue(res) {
      var v = res;
      var _iterator7 = _createForOfIteratorHelper(set),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var h = _step7.value;
          if (!h.returnValue) continue;
          v = h.returnValue(v);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
      return v;
    }
  };
}
/**
 * 把 registry 中某个 api 的全部 handlers 合并成一个 fanout 拦截器，重新挂到 uni。
 *
 * 精准重装：先按引用移除本模块**上一次**装入的 fanout（若有），再装入新 fanout；
 * 全程不调用「不带第二参数」的 blanket remove，故业务方 / 其它插件在同一 api 上的
 * 拦截器不会被波及。
 */
function reinstall(api) {
  var set = registry.get(api);
  if (!set || set.size === 0) return;
  var fanout = buildFanout(set);
  try {
    var _uni = getUni$1();
    var prev = installedFanout.get(api);
    if (prev) {
      try {
        _uni.removeInterceptor(api, prev);
      } catch (_a) {
        /* ignore：旧 fanout 移除失败不阻断新 fanout 装入 */
      }
    }
    _uni.addInterceptor(api, fanout);
    installedFanout.set(api, fanout);
  } catch (_b) {
    // uni 不可用（例如 nvue 早期阶段）：保留 registry 与 installedFanout，等下次 reinstall 再试
  }
}
function getUni$1() {
  var raw = resolveUniRuntime();
  var u = raw != null && (0, _typeof2.default)(raw) === 'object' ? raw : undefined;
  if (!u) throw new Error('[uni统计 2.0] uni interceptor API is not available');
  return u;
}
/**
 * 仅供单测使用：清空 registry，让本模块「像刚加载」一样。
 */
function __reset() {
  registry.clear();
  installedFanout.clear();
}
var interceptor = {
  add: add,
  __reset: __reset
};

/**
 * 拦截 `uni.login` 调用，complete 时上报一条 `lt=21, e_n=login` 自定义事件。
 *
 * 与私有版差异：
 *   - 走 `infra/interceptor.add`，多次 register 不会覆盖回调（修复缺陷 #26）。
 *   - 通过 `reporter` 注入，便于单测断言。
 */
/**
 * 注册 login 拦截器。
 *
 * @returns 解绑函数。同一 reporter 多次 register 视为多次回调（fanout）；卸载时只摘当次。
 */
function registerLoginInterceptor(reporter) {
  return interceptor.add('login', {
    complete: function complete() {
      reporter.report({
        lt: LT.Event,
        custom: {
          e_n: 'login'
        }
      });
    }
  });
}

/**
 * 拦截 `uni.setNavigationBarTitle`，把用户设置的标题写入 `domain/title` 内存。
 *
 * **不**直接 reporter.report；title 是字段维度的状态，由 statData.builder 在拼装
 * 页面事件时一次性读出。这样保证 ttn 与 lt=11 / lt=3 事件强相关，避免私有版"标题在
 * 全局对象、上报时机散落"的问题。
 */
/**
 * 注册 setNavigationBarTitle 拦截器；不依赖 reporter。
 *
 * @returns 解绑函数。
 */
function registerNavigationBarInterceptor() {
  return interceptor.add('setNavigationBarTitle', {
    invoke: function invoke(args) {
      var a = args;
      if (a && 'title' in a) setPageTitle(a.title);
    }
  });
}

/**
 * 拦截 `uni.requestPayment`：
 *   - success → `lt=21, e_n=pay_success`
 *   - fail    → `lt=21, e_n=pay_fail`
 *
 * 与私有版差异：经由 `infra/interceptor.add` 去重；多 reporter 注册都会触发（fanout）。
 */
function registerPaymentInterceptor(reporter) {
  return interceptor.add('requestPayment', {
    success: function success() {
      reporter.report({
        lt: LT.Event,
        custom: {
          e_n: 'pay_success'
        }
      });
    },
    fail: function fail() {
      reporter.report({
        lt: LT.Event,
        custom: {
          e_n: 'pay_fail'
        }
      });
    }
  });
}

/**
 * 拦截 `uni.share` 调用，success / fail 都上报一条 `lt=21, e_n=share` 自定义事件。
 *
 * 与私有版差异（修复缺陷 #26）：
 *   - 私有版 `interceptShare(true)` 在 `onLoad` 内重复 wrap `onShareAppMessage`，
 *     连续打开同一页面会导致 share 事件被多次上报。
 *   - 公有版通过 `infra/interceptor` 单次 fanout 注册；onLoad 不再重复包装。
 */
function registerShareInterceptor(reporter) {
  var fire = function fire() {
    return reporter.report({
      lt: LT.Event,
      custom: {
        e_n: 'share'
      }
    });
  };
  return interceptor.add('share', {
    success: function success() {
      fire();
    },
    fail: function fail() {
      fire();
    }
  });
}

/**
 * 拦截器统一装配入口。
 *
 * 使用：
 *   ```ts
 *   import { installAllInterceptors } from './interceptors'
 *   const uninstall = installAllInterceptors(collector)  // collector 实现 InterceptorReporter
 *   // 卸载（hot reload / unit test）：
 *   uninstall()
 *   ```
 *
 * 重复 install 安全：每次 install 都会返回独立的 unbinder；多次 install 触发的 fanout
 * 由 `infra/interceptor` 统一去重 + 解绑。
 */
/**
 * 一次性装配全部拦截器。
 *
 * @returns 解绑函数（顺序解绑全部已注册的拦截器）。
 */
function installAllInterceptors(reporter) {
  var unbinders = [registerLoginInterceptor(reporter), registerShareInterceptor(reporter), registerPaymentInterceptor(reporter), registerNavigationBarInterceptor()];
  return function () {
    var _iterator8 = _createForOfIteratorHelper(unbinders),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var u = _step8.value;
        try {
          u();
        } catch (_a) {
          // 单个解绑失败不影响其余
        }
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
  };
}

/**
 * 老版本（私有版 1.0/2.0）→ 公有版数据迁移。
 *
 * 老版本通过 `utils/db.js` 把所有字段写到一个聚合 key：
 *   `$$STAT__DBDATA:<appid>` → `{ '__first__visit__time': T, '__last__visit__time': T, ... }`
 *
 * 公有版改为按字段拆 key（`UNI_STAT_DATA:<appid>:<key>`）。
 *
 * 本模块职责（只读老数据，不删）：
 *   1. **一次性**把已知字段从老聚合 key 拆解写入新命名空间。
 *   2. 保留老 key（不 remove），让私有版同库共存场景仍能正常运行。
 *   3. 通过新命名空间下的 `migration:done` 哨兵避免重复执行。
 *   4. 任何步骤异常 → 静默吞掉，不影响采集主链路。
 *
 * 不做的事：
 *   - 不在迁移中写"今天本次启动"的 fvts/lvts；那是 `domain/visit/firstVisit` 的职责。
 *   - 不抛错；调用方无需 try/catch。
 *
 * 调用时机：
 *   - 由 `runtime/install.ts` 在公有版启动早期调用一次（在 `loadVisitSnapshot` 之前），
 *     保证 firstVisit 读到的是已迁移的新前缀数据。
 */
/** 已迁移哨兵 key（写到新命名空间）。值固定为 1。 */
var KEY_DONE = 'migration:done';
/**
 * 老聚合 key 内字段 → 新拆分 key 的映射表。
 *
 * 仅迁移**对公有版有用**的字段；其它（如 `__page__residence__time`）保留老 key，
 * 由 Phase 5 的对应 domain 模块按需读取。
 */
var KEY_MAP = [['__first__visit__time', 'visit:fvts'], ['__last__visit__time', 'visit:lvts'], ['__total__visit__count', 'visit:tvc']];
/** 取 UNI_APP_ID（与 storage 内部保持一致的回退）。 */
function getAppId() {
  var id = "";
  if (typeof id === 'string' && id.length > 0) return id;
  return 'default';
}
/**
 * 从底层 uni 读取老聚合 key（不走 `infra/storage`，避免命名空间被改写）。
 *
 * 任何异常一律返回 `null`，由调用方决定 noop。
 */
function readLegacyAggregate() {
  var u = resolveUniRuntime();
  if (!u || typeof u.getStorageSync !== 'function') return null;
  var key = "".concat(LEGACY_NAMESPACE_ROOT, ":").concat(getAppId());
  var raw = tryRun(function () {
    return u.getStorageSync(key);
  }, null);
  if (raw && (0, _typeof2.default)(raw) === 'object') return raw;
  return null;
}
/** 哨兵：本进程内不重复 run。 */
var ran = false;
/**
 * 执行迁移；幂等：
 *   - 进程内已 run → 直接 return false。
 *   - 新命名空间已有 `migration:done` → 直接 return false。
 *   - 老聚合 key 不存在 / 为空 → 写 `migration:done`，return false。
 *   - 真正发生迁移 → return true。
 */
function migrateLegacyData() {
  if (ran) return false;
  ran = true;
  var doneR = storage.safeRead(KEY_DONE);
  if (doneR.ok && doneR.value) return false;
  var legacy = readLegacyAggregate();
  if (!legacy) {
    storage.set(KEY_DONE, 1);
    return false;
  }
  var migrated = 0;
  for (var i = 0; i < KEY_MAP.length; i++) {
    var _KEY_MAP$i = (0, _slicedToArray2.default)(KEY_MAP[i], 2),
      oldKey = _KEY_MAP$i[0],
      newKey = _KEY_MAP$i[1];
    if (!(oldKey in legacy)) continue;
    var value = legacy[oldKey];
    // 已经存在新值就不覆盖（避免覆盖公有版自身已写入的更新值）
    var existing = storage.safeRead(newKey);
    if (existing.ok && existing.value !== undefined) continue;
    storage.set(newKey, value);
    migrated++;
  }
  storage.set(KEY_DONE, 1);
  if (migrated > 0) {
    logger.info('[uni统计 2.0] migrated legacy keys', migrated);
  }
  return migrated > 0;
}

/**
 * 通道选择器：根据**统计版本**与**运行环境**返回最合适的 Channel。
 *
 * 选择规则（公有版默认 image）：
 *   - `version === 'image'`（默认）：优先 image；image 不可用时按 fallback 决策走 http；
 *     image 通道未注入 → 静默走 http（公有版默认场景）。
 *   - `version === '2'`：优先 cloud；cloud 不可用时按 fallback 决策走 http（私有版兼容）。
 *   - `version === '1'`：始终 http。
 *
 * 注意：
 *   - 公有版**不会**主动构造 cloud channel（StatApp 仅在 version='2' 才创建），
 *     因此默认运行路径不会再触发"cloud channel unavailable"警告。
 *   - 选择是**幂等无副作用**的：调用方每次发送前调用 `selectChannel()` 即可，
 *     channel 自身不缓存可用性。
 */
/**
 * 根据策略挑选当前应使用的 channel。
 *
 * @returns 选中的 channel；若没有可用通道返回 `undefined`。
 */
function _selectChannel(opts) {
  var _a;
  var version = (_a = opts.version) !== null && _a !== void 0 ? _a : 'image';
  var fallback = opts.fallbackToHttp !== false;
  if (version === '1') {
    if (opts.http && opts.http.available()) return opts.http;
    return undefined;
  }
  if (version === '2') {
    if (opts.cloud && opts.cloud.available()) return opts.cloud;
    if (!fallback) {
      logger.warn('[uni统计 2.0] 云函数上报不可用且已关闭 HTTP 兜底，本批已丢弃');
      return undefined;
    }
    if (opts.http && opts.http.available()) {
      logger.warn('[uni统计 2.0] 云函数上报不可用，已降级为 HTTP 上报');
      return opts.http;
    }
    logger.warn('[uni统计 2.0] 无可用上报线路');
    return undefined;
  }
  // image（默认）：image > http
  if (opts.image && opts.image.available()) return opts.image;
  if (!fallback) {
    if (opts.image) {
      // 仅在 image 已构造但失效时给出警告，便于排查；未构造视为正常的"未启用"
      logger.warn('[uni统计 2.0] 统计上报线路不可用且已关闭 HTTP 兜底，本批已丢弃');
    }
    return undefined;
  }
  if (opts.http && opts.http.available()) {
    if (opts.image) {
      // 同上，仅在 image 已构造但失效时打印降级日志
      logger.warn('[uni统计 2.0] 统计上报线路不可用，已降级为 HTTP 上报');
    }
    return opts.http;
  }
  logger.warn('[uni统计 2.0] 无可用上报线路');
  return undefined;
}

/**
 * 事件入队 + 批量 flush，修复私有版缺陷 #3。
 *
 * 私有版 `report.js#request` 的入队逻辑：
 *   ```
 *   uniStatData = dbGet(KEY) || {}
 *   uniStatData[lt].push(data)
 *   dbSet(KEY, uniStatData)         // <-- 写
 *   ...
 *   const stat_data = handle_data(uniStatData)
 *   dbRemove(KEY)                   // <-- 删，但不是原子的
 *   sendRequest(...)
 *   ```
 *
 * 缺陷 #3：在 `dbSet` 与 `dbRemove` 之间，若有并发的 `request()` 调用执行
 * `dbGet → push → dbSet`，最后的 `dbRemove` 会**误删**这一批新数据。
 *
 * 公有版修复策略：
 *   - 入队全部走"内存桶 + 持久化镜像"双写；持久化只为冷启续传准备。
 *   - flush() 走一次"原子 swap"：把当前桶交换给空对象，立刻清持久化镜像；
 *     在 swap 之后插入的新事件落到新桶，绝不被 flush 误删。
 *   - flush() 仅返回快照，**不直接发送**：发送由 collector 负责，便于解耦
 *     单测与运行时（collector 不需要 mock 通道）。
 *
 * 数据形态：
 *   - bucket: `Record<lt, StatData[]>`，与私有版 `uniStatData` 兼容。
 *   - 持久化 key：`UNI_STAT_DATA:<appid>:queue`。
 */
var STORAGE_KEY$1 = 'queue';
var DEFAULT_SINGLE_EVENT_MAX_BYTES = SINGLE_EVENT_MAX_BYTES;
var state = {
  bucket: {},
  lastFlushAt: 0
};
var intervalSec = REPORT_INTERVAL_SEC;
var singleEventMaxBytes = DEFAULT_SINGLE_EVENT_MAX_BYTES;
var maxEvents = QUEUE_MAX_EVENTS;
var restored = false;
/** 容量超限 warn 节流：持续离线积压时仅首次告警，回落到上限内后复位。 */
var capacityWarned = false;
/**
 * 配置上报间隔；运行时可在 runtime/StatApp 初始化时注入。
 */
function configure(opts) {
  if (typeof opts.intervalSec === 'number' && opts.intervalSec >= 0) {
    intervalSec = Math.floor(opts.intervalSec);
  }
  if (typeof opts.singleEventMaxBytes === 'number' && opts.singleEventMaxBytes > 0) {
    singleEventMaxBytes = Math.floor(opts.singleEventMaxBytes);
  }
  if (typeof opts.maxEvents === 'number' && opts.maxEvents > 0) {
    maxEvents = Math.floor(opts.maxEvents);
  }
}
/**
 * 强制把内存桶事件总数压到 `maxEvents` 以内（FIFO 丢弃最旧）。
 *
 * 丢弃策略：每轮从**当前事件数最多的桶**头部移除一条（最旧），直到总数达标。
 * 这样长期离线时疯涨的 lt=21/lt=31 会先被裁剪，体量通常很小的 lt=1（会话锚点）/
 * lt=3（后台闭合）更可能被保留。仅在超限时打一次 warn，避免刷屏。
 */
function enforceCapacity() {
  var total = size();
  if (total <= maxEvents) {
    // 回落到上限内 → 复位告警节流，下次再超限时可再次提示。
    capacityWarned = false;
    return;
  }
  var dropped = total - maxEvents;
  while (total > maxEvents) {
    var largestLt = '';
    var largestLen = 0;
    for (var _i10 = 0, _Object$keys8 = Object.keys(state.bucket); _i10 < _Object$keys8.length; _i10++) {
      var lt = _Object$keys8[_i10];
      var len = state.bucket[lt].length;
      if (len > largestLen) {
        largestLen = len;
        largestLt = lt;
      }
    }
    if (!largestLt || largestLen === 0) break;
    state.bucket[largestLt].shift();
    if (state.bucket[largestLt].length === 0) delete state.bucket[largestLt];
    total--;
  }
  // 节流：持续离线积压时每次 enqueue 都会触发裁剪，但仅首次告警，避免刷屏。
  if (!capacityWarned) {
    capacityWarned = true;
    logger.warn('[uni统计 2.0] 上报队列超过容量上限，已丢弃最旧事件', 'dropped=' + dropped, 'limit=' + maxEvents);
  }
}
/**
 * 持久化当前内存桶。失败仅打日志，不影响主流程。
 */
function persistBucket() {
  if (Object.keys(state.bucket).length === 0) {
    storage.remove(STORAGE_KEY$1);
    return;
  }
  try {
    storage.set(STORAGE_KEY$1, state.bucket);
  } catch (e) {
    logger.warn('[uni统计 2.0] queue persist failed', e);
  }
}
/**
 * 冷启时尝试从 storage 恢复上一次进程未上报的桶；只在第一次入队前执行一次。
 *
 * 若 storage 中存在合法的桶数据，与当前内存桶**合并**而不是覆盖（合并语义防止极端
 * 边界场景下丢失冷启已入队的事件）。
 */
function restoreOnce() {
  if (restored) return;
  restored = true;
  var raw = storage.safeRead(STORAGE_KEY$1);
  if (!raw.ok || !raw.value || (0, _typeof2.default)(raw.value) !== 'object') return;
  var persisted = raw.value;
  for (var _i11 = 0, _Object$keys9 = Object.keys(persisted); _i11 < _Object$keys9.length; _i11++) {
    var _state$bucket$lt;
    var lt = _Object$keys9[_i11];
    var arr = persisted[lt];
    if (!Array.isArray(arr) || arr.length === 0) continue;
    if (!state.bucket[lt]) state.bucket[lt] = [];
    (_state$bucket$lt = state.bucket[lt]).push.apply(_state$bucket$lt, (0, _toConsumableArray2.default)(arr));
  }
}
/**
 * 把一条事件入队到对应 lt 的桶。
 *
 * 不抛错；data.lt 必填，缺失/类型异常时打日志丢弃。
 *
 * 单条体积保护：序列化后超过 `singleEventMaxBytes`（默认 2KB）的事件直接丢弃 ——
 * 进了桶最终一定打不出去（无论怎么切片都会顶满 GET URL），还会污染 retry 队列。
 * 典型源头：业务方在 `key/value` 里塞了 base64 图片 / 大段 JSON / 长 stack 等。
 */
function enqueue(data) {
  var _a;
  if (!data || (0, _typeof2.default)(data) !== 'object') return;
  var lt = String((_a = data.lt) !== null && _a !== void 0 ? _a : '');
  if (!lt) {
    logger.warn('[uni统计 2.0] enqueue dropped: missing lt', data);
    return;
  }
  var serialized = '';
  try {
    serialized = JSON.stringify(data);
  } catch (e) {
    logger.warn('[uni统计 2.0] enqueue dropped: stringify failed', e);
    return;
  }
  if (serialized.length > singleEventMaxBytes) {
    logger.warn('[uni统计 2.0] enqueue dropped: single event too large', 'lt=' + lt, 'bytes=' + serialized.length, 'limit=' + singleEventMaxBytes);
    return;
  }
  restoreOnce();
  if (!state.bucket[lt]) state.bucket[lt] = [];
  state.bucket[lt].push(data);
  enforceCapacity();
  persistBucket();
}
/**
 * 是否到达 flush 阈值。
 *
 * @param force 如为 true 直接返回 true（用于 onAppHide / 错误兜底等场景）。
 */
function shouldFlush() {
  var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (force) return true;
  if (intervalSec <= 0) return true;
  var elapsedSec = (nowMs() - state.lastFlushAt) / 1000;
  return elapsedSec >= intervalSec;
}
/**
 * 原子取出当前桶并清空（修复缺陷 #3）。
 *
 * 调用时机：由 collector 决定（间隔触发 / app hide / 强制刷新）。
 *
 * @returns 取出的桶；若空桶返回 undefined（调用方据此跳过本次发送）。
 */
function flush() {
  restoreOnce();
  var lts = Object.keys(state.bucket);
  if (lts.length === 0) return undefined;
  var snapshot = state.bucket;
  state.bucket = {};
  state.lastFlushAt = nowMs();
  storage.remove(STORAGE_KEY$1);
  return snapshot;
}
/**
 * 发送失败回滚：把 flush 取出的快照重新合并回当前桶，等待下一次 flush。
 *
 * 注意：合并时插入到桶的"前面"，保留 FIFO 语义。
 */
function rollback(snapshot) {
  if (!snapshot) return;
  for (var _i12 = 0, _Object$keys10 = Object.keys(snapshot); _i12 < _Object$keys10.length; _i12++) {
    var lt = _Object$keys10[_i12];
    var arr = snapshot[lt];
    if (!Array.isArray(arr) || arr.length === 0) continue;
    if (!state.bucket[lt]) state.bucket[lt] = [];
    state.bucket[lt] = arr.concat(state.bucket[lt]);
  }
  enforceCapacity();
  persistBucket();
}
/**
 * 当前桶内事件总数（按 lt 加总）。
 */
function size() {
  var n = 0;
  for (var _i13 = 0, _Object$keys11 = Object.keys(state.bucket); _i13 < _Object$keys11.length; _i13++) {
    var lt = _Object$keys11[_i13];
    n += state.bucket[lt].length;
  }
  return n;
}

/**
 * 失败重试落盘队列。
 *
 * 设计动机：
 *   - 私有版仅在 1.0 通道内做了 3 次内存级重试；进程被杀（应用退出 / kill）后所有
 *     未上报数据**直接丢失**，且 2.0 通道根本没有重试。
 *   - 公有版引入"内存重试 + 失败落盘 + 下次冷启重放"双层兜底：
 *       通道层：`channel.send` 内部已用 `withRetry` 做协议层重试。
 *       本模块：协议层最终失败后调用 `persist(payload)` 写入 storage；
 *               冷启时调 `loadAll()` 取出，逐条尝试重放，成功后 `ack(_id)` 删除。
 *
 * 数据结构：
 *   `UNI_STAT_DATA:<appid>:retry:queue`：`Array<RetryItem>`，最多 `maxItems` 条；
 *   超容时按 FIFO 丢弃最旧条目。每条带创建时间戳，超过 `maxAgeMs` 的过期清理。
 *
 * 与 retry 队列只存"已序列化的 ReportPayload"——不再依赖 collector / domain，
 * 由调用方负责重组业务字段（如重试时不需要再次重算 visit/session）。
 */
var STORAGE_KEY = 'retry:queue';
var DEFAULT_MAX_ITEMS = 50;
var DEFAULT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
var DEFAULT_MAX_ATTEMPTS = RETRY_MAX_ATTEMPTS;
var config = {
  maxItems: DEFAULT_MAX_ITEMS,
  maxAgeMs: DEFAULT_MAX_AGE_MS,
  maxAttempts: DEFAULT_MAX_ATTEMPTS
};
/**
 * 读取队列。出现异常或非数组时返回空数组（不影响主流程）。
 */
function readQueue() {
  var raw = storage.safeRead(STORAGE_KEY);
  if (!raw.ok || !Array.isArray(raw.value)) return [];
  return raw.value.filter(function (it) {
    return it && typeof it.id === 'string' && it.payload && (0, _typeof2.default)(it.payload) === 'object';
  });
}
/**
 * 写回队列。空数组时直接 remove，避免存储垃圾。
 */
function writeQueue(items) {
  if (items.length === 0) {
    storage.remove(STORAGE_KEY);
    return;
  }
  storage.set(STORAGE_KEY, items);
}
/**
 * 生成 retry item id。优先复用 payload._id（来自 queue 出栈时分配的批次 id）。
 */
function genId(payload) {
  if (payload._id) return payload._id;
  return 'r-' + nowMs().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
}
/**
 * 持久化一条失败 payload。
 *
 * @param payload 协议层最终失败的 payload。
 * @returns 实际写入的 retry id；若被丢弃返回 undefined。
 */
function persist(payload) {
  if (!payload) return undefined;
  var id = genId(payload);
  var items = readQueue();
  if (items.some(function (it) {
    return it.id === id;
  })) {
    return id;
  }
  var item = {
    id: id,
    payload: Object.assign({}, payload, {
      _id: id
    }),
    createdAt: nowMs(),
    attempts: 0
  };
  items.push(item);
  while (items.length > config.maxItems) {
    var dropped = items.shift();
    logger.warn('[uni统计 2.0] retry queue overflow, drop oldest', dropped === null || dropped === void 0 ? void 0 : dropped.id);
  }
  writeQueue(items);
  return id;
}
/**
 * 取出全部待重试条目（同时清理过期项），按入队顺序返回。
 *
 * 调用方应自行决定是否串行重放；本模块**不**自动触发任何网络。
 */
function loadAll() {
  var items = readQueue();
  if (items.length === 0) return [];
  var cutoff = nowMs() - config.maxAgeMs;
  var alive = [];
  var _iterator9 = _createForOfIteratorHelper(items),
    _step9;
  try {
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      var it = _step9.value;
      if (it.createdAt < cutoff) {
        logger.warn('[uni统计 2.0] retry item expired, drop', it.id);
        continue;
      }
      alive.push(it);
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
  if (alive.length !== items.length) writeQueue(alive);
  return alive.map(function (it) {
    return it.payload;
  });
}
/**
 * 重放成功后删除指定 id；id 不存在视为 no-op。
 */
function ack(id) {
  if (!id) return;
  var items = readQueue();
  var next = items.filter(function (it) {
    return it.id !== id;
  });
  if (next.length === items.length) return;
  writeQueue(next);
}
/**
 * 标记一次重放失败：累加 `attempts`，超过 `config.maxAttempts` 自动死信清理。
 *
 * 死信清理动机：`recoverRetry` 串行重放，永久错误（脏 payload / 历史协议数据）若不
 * 主动丢弃，会反复占据队列前部，把后续健康 payload 也拖到失败 —— 这是 image url too
 * long 看似"重试无穷大"的次因。本兜底与"过期清理（maxAgeMs）+ 容量裁剪（maxItems）"
 * 形成三道防线。
 */
function markAttempt(id) {
  if (!id) return;
  var items = readQueue();
  var nextItems = null;
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    if (it.id !== id) continue;
    it.attempts++;
    if (it.attempts >= config.maxAttempts) {
      logger.warn('[uni统计 2.0] retry item exceeded maxAttempts, drop as dead letter', id, 'attempts=' + it.attempts);
      nextItems = items.slice(0, i).concat(items.slice(i + 1));
    } else {
      nextItems = items;
    }
    break;
  }
  if (nextItems) writeQueue(nextItems);
}

/**
 * 公有版统计运行时门面（单例）。
 *
 * 职责：
 *   1. `install(config?, overrides?)`：一次性装配 collector / channel / 拦截器；
 *      启动时 `migrateLegacyData` → `loadVisitSnapshot` → `recoverRetry`。
 *      重复 install 幂等。
 *   2. `report(type, value)`：业务侧 `uni.report(type, value)` 的承接入口。
 *   3. `reportError(e)`：错误兜底事件（lt=31）。
 *   4. `getCollector()` / `getDeps()`：测试与 lifecycleHooks 复用。
 *
 * 设计原则：
 *   - 所有 adapter 调用都包了 `tryRun`，单端缺失 API 不影响 install。
 *   - 所有依赖通过 `defaults + overrides` 构造；测试可注入替换。
 *   - install 不抛错；任何子步骤失败都吞掉并 logger.warn。
 *   - 单例：`StatApp.getInstance()` 全局唯一；`__resetStatApp()` 仅供测试。
 */
var instance = null;
var StatApp = /*#__PURE__*/function () {
  function StatApp() {
    (0, _classCallCheck2.default)(this, StatApp);
    /** install 幂等哨兵。 */
    this.installed = false;
    /** 已生效的协议版本（'1' / '2' / 'image'）。 */
    this.statVersion = 'image';
  }
  (0, _createClass2.default)(StatApp, [{
    key: "install",
    value:
    /**
     * 一次性装配。重复调用直接返回。
     *
     * @param config 业务配置；缺省值兼容私有版默认行为。
     * @param overrides 测试钩子。
     */
    function install() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var overrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _a, _b, _c, _d, _e;
      if (this.installed) return;
      var cfg = this.normalizeConfig(config);
      this.config = cfg;
      this.statVersion = cfg.version;
      tryRun(function () {
        return configure$1({
          backgroundTimeoutSec: cfg.backgroundTimeoutSec,
          pageInactiveTimeoutSec: cfg.pageInactiveTimeoutSec
        });
      }, undefined);
      tryRun(function () {
        return configure({
          intervalSec: cfg.reportIntervalSec
        });
      }, undefined);
      if (!overrides.skipMigration) {
        tryRun(function () {
          return migrateLegacyData();
        }, false);
      }
      tryRun(function () {
        return loadVisitSnapshot();
      }, undefined);
      this.httpChannel = (_b = (_a = overrides.channels) === null || _a === void 0 ? void 0 : _a.http) !== null && _b !== void 0 ? _b : createHttpChannel({
        ut: getPlatform(),
        maxRetries: HTTP_MAX_RETRIES
      });
      // cloud：仅在用户明确选择 channelVersion=2 或测试 override 时构造，
      // 公有版默认路径不会创建 cloud，避免触发"cloud channel unavailable"误降级警告。
      if (overrides.channels && 'cloud' in overrides.channels) {
        this.cloudChannel = (_c = overrides.channels.cloud) !== null && _c !== void 0 ? _c : undefined;
      } else if (this.statVersion === '2') {
        this.cloudChannel = createCloudChannel({
          maxRetries: CLOUD_MAX_RETRIES
        });
      } else {
        this.cloudChannel = undefined;
      }
      // image：公有版默认通道。host/projectId/topicId 来自 config.IMAGE_REPORT_DEFAULTS，
      // 由 SDK 维护者直接在源码中调整，**不暴露**到 manifest / runtime API；
      // 测试场景仍可通过 overrides.channels.image 注入伪通道做断言。
      if (overrides.channels && 'image' in overrides.channels) {
        this.imageChannel = (_d = overrides.channels.image) !== null && _d !== void 0 ? _d : undefined;
      } else if (this.statVersion === 'image') {
        this.imageChannel = createImageChannel({
          host: IMAGE_REPORT_DEFAULTS.host,
          projectId: IMAGE_REPORT_DEFAULTS.projectId,
          topicId: IMAGE_REPORT_DEFAULTS.topicId,
          maxRetries: IMAGE_MAX_RETRIES,
          ut: getPlatform(),
          rawPlatform: getRawPlatform()
        });
      } else {
        this.imageChannel = undefined;
      }
      this.collectorDeps = this.buildCollectorDeps(cfg, (_e = overrides.collectorDepsPatch) !== null && _e !== void 0 ? _e : {});
      this.collector = createCollector(this.collectorDeps);
      if (!overrides.skipInterceptors) {
        var c = this.collector;
        this.uninstallInterceptors = tryRun(function () {
          return installAllInterceptors({
            report: function report(i) {
              return c.report(i);
            }
          });
        }, undefined);
      }
      if (!overrides.skipRecoverRetry) {
        void this.collector.recoverRetry().catch(function (e) {
          return logger.warn('[uni统计 2.0] recoverRetry failed', e);
        });
      }
      // 仅在 collector 与拦截器等就绪后再标记，避免中途抛错导致「已 install 却无 collector」。
      this.installed = true;
    }
    /**
     * 业务侧 `uni.report(type, value)` 入口。
     *
     * 兼容私有版语义：
     *   - `type === 'title'` → 写 reportTitle，不发事件；下次 lt=11 / lt=3 携带 `ttc`。
     *   - 其他 type → 自定义事件 lt=21，custom `{ e_n: type, e_v: value }`。
     */
  }, {
    key: "report",
    value: function report(type, value) {
      if (!this.installed || !this.collector) return;
      if (type === 'title') {
        setReportTitle(value);
        return;
      }
      var ev = (0, _typeof2.default)(value) === 'object' && value !== null ? tryRun(function () {
        return JSON.stringify(value);
      }, '') : value === undefined ? '' : String(value);
      this.collector.report({
        lt: LT.Event,
        custom: {
          e_n: type,
          e_v: ev
        }
      });
    }
    /** 上报 onError 捕获的错误。 */
  }, {
    key: "reportError",
    value: function reportError(err) {
      var _a;
      if (!this.installed || !this.collector) return;
      var errMsg = err instanceof Error ? "".concat(err.name, ": ").concat(err.message, "\n").concat((_a = err.stack) !== null && _a !== void 0 ? _a : '') : typeof err === 'string' ? err : tryRun(function () {
        return JSON.stringify(err);
      }, '');
      this.collector.report({
        lt: LT.Error,
        errMsg: errMsg
      });
    }
    /** 取 collector，供 lifecycleHooks 调度生命周期事件。 */
  }, {
    key: "getCollector",
    value: function getCollector() {
      return this.collector;
    }
    /** 取 deps（测试用）。 */
  }, {
    key: "getDeps",
    value: function getDeps() {
      return this.collectorDeps;
    }
    /** 是否已 install。 */
  }, {
    key: "isInstalled",
    value: function isInstalled() {
      return this.installed;
    }
    /** 当前协议版本。 */
  }, {
    key: "getStatVersion",
    value: function getStatVersion() {
      return this.statVersion;
    }
    /** 当前生效配置（含默认值合并），测试用。 */
  }, {
    key: "getConfig",
    value: function getConfig() {
      return this.config;
    }
    /**
     * 卸载（测试 / hot reload）。
     *
     * 解绑全部拦截器、清空内部句柄。**不**清外部模块（queue/visit/session）状态，
     * 那些由各自的 `__reset*` 在测试 setup 中处理。
     */
  }, {
    key: "uninstall",
    value: function uninstall() {
      var _this2 = this;
      if (this.uninstallInterceptors) {
        tryRun(function () {
          return _this2.uninstallInterceptors();
        }, undefined);
      }
      this.uninstallInterceptors = undefined;
      // 先释放 collector 内部定时器（取消延迟首 flush），再丢弃引用，避免幽灵 flush。
      if (this.collector) {
        tryRun(function () {
          return _this2.collector.destroy();
        }, undefined);
      }
      this.collector = undefined;
      this.collectorDeps = undefined;
      this.httpChannel = undefined;
      this.cloudChannel = undefined;
      this.imageChannel = undefined;
      this.config = undefined;
      this.installed = false;
    }
  }, {
    key: "normalizeConfig",
    value: function normalizeConfig(c) {
      var _a, _b, _c, _d, _e;
      return {
        ak: (_a = c.ak) !== null && _a !== void 0 ? _a : getAppId$1(),
        v: c.v,
        ch: (_b = c.ch) !== null && _b !== void 0 ? _b : '',
        version: (_c = c.version) !== null && _c !== void 0 ? _c : 'image',
        backgroundTimeoutSec: (_d = c.backgroundTimeoutSec) !== null && _d !== void 0 ? _d : 300,
        pageInactiveTimeoutSec: (_e = c.pageInactiveTimeoutSec) !== null && _e !== void 0 ? _e : 1800,
        reportIntervalSec: typeof c.reportIntervalSec === 'number' ? c.reportIntervalSec : REPORT_INTERVAL_SEC,
        // collectItems 默认值与私有版严格对齐：push 默认关闭、页面日志默认开启
        enablePush: c.enablePush === true,
        enablePageLog: c.enablePageLog !== false
      };
    }
    /**
     * 构建 collector 依赖。所有 adapter 调用都包了 `tryRun`，避免单端缺失 API 导致
     * install 失败。
     */
  }, {
    key: "buildCollectorDeps",
    value: function buildCollectorDeps(cfg, patch) {
      var _this3 = this;
      var platformShort = getPlatform();
      var builder = createStatDataBuilder({
        config: {
          ak: cfg.ak,
          usv: STAT_VERSION_PUBLIC,
          v: cfg.v,
          ch: cfg.ch
        },
        platform: {
          ut: platformShort
        },
        system: tryRun(function () {
          return getSystemInfo();
        }, {
          brand: '',
          md: '',
          sv: '',
          v: '',
          ut: 'unknown',
          appVersion: '',
          appWgtVersion: '',
          mpvHostVersion: '',
          on: '',
          sdkVersion: '',
          statusBarHeight: 0,
          osP: ''
        }),
        locale: tryRun(function () {
          return getLocaleAndScreen();
        }, {
          lang: '',
          ww: 0,
          wh: 0,
          sw: 0,
          sh: 0,
          pr: 1
        }),
        device: {
          // 惰性解析：每次 build 时再调 getUuid()，避免 install 过早（uni 运行时未就绪）冻结临时值。
          get uuid() {
            return tryRun(function () {
              return getUuid();
            }, '');
          }
        },
        net: {
          net: 'unknown',
          raw: ''
        },
        location: {
          lat: '',
          lng: '',
          ok: false
        },
        pkg: tryRun(function () {
          return getPackageInfo();
        }, {
          mpn: '',
          tdaid: '',
          pkn: '',
          an: ''
        }),
        web: tryRun(function () {
          return getWebInfo();
        }, {
          domain: ''
        })
      });
      var base = {
        builder: builder,
        queue: {
          enqueue: enqueue,
          flush: flush,
          rollback: rollback,
          shouldFlush: shouldFlush
        },
        serializer: {
          handleData: handleData
        },
        selectChannel: function selectChannel() {
          return _selectChannel({
            version: _this3.statVersion,
            http: _this3.httpChannel,
            cloud: _this3.cloudChannel,
            image: _this3.imageChannel
          });
        },
        retry: {
          persist: persist,
          loadAll: loadAll,
          ack: ack,
          markAttempt: markAttempt
        },
        visit: {
          commitVisitOnAck: commitVisitOnAck,
          rollbackPendingVisit: rollbackPendingVisit
        },
        session: {
          getSnapshot: getSnapshot,
          nextSeq: nextSeq,
          touch: touch
        },
        config: {
          usv: STAT_VERSION_PUBLIC
        },
        nowMs: nowMs,
        nowSec: nowSec,
        firstFlushDeferMs: getRawPlatform() === 'mp-weixin' && MP_WEIXIN_USE_PRELOAD_ASSETS_REPORT ? MP_WEIXIN_PRELOAD_FIRST_FLUSH_DELAY_MS : 0
      };
      return Object.assign(base, patch);
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      if (!instance) instance = new StatApp();
      return instance;
    }
  }]);
  return StatApp;
}();
/**
 * 便捷 API：获取或创建当前应用 collector，供拦截器 / lifecycleHooks 使用。
 *
 * 上层若希望直接拿 lt 入参，可先 `getStatApp().install(cfg)`，再
 * `getStatApp().getCollector()?.report({ lt, ... })`。
 */
function getStatApp() {
  return StatApp.getInstance();
}
/** 仅供测试：销毁全局单例与 install 状态（不会重置 queue/visit/session）。 */
function __resetStatApp() {
  if (instance) {
    instance.uninstall();
    instance = null;
  }
}

/**
 * 公有版统计运行时安装入口。
 *
 * 与私有版 `src/index.js#load_stat` 等价：
 *   - VUE3 走 `uni.onCreateVueApp(app => app.mixin(lifecycle))`。
 *   - VUE2 走 `Vue.mixin(lifecycle)`（require('vue')）。
 *   - 同时把 `uni.report = (type, value) => StatApp.report(type, value)` 暴露给业务。
 *
 * 与私有版差异：
 *   - 模块加载即调 `installPublicStat()`，但内部用 install 哨兵保证幂等；
 *     测试可调 `__resetStatApp()` 重置。
 *   - `is_debug / NODE_ENV === 'development'` 的开关由调用方在 build 阶段做（
 *     `plugin/index.ts` 已注入），运行时不再分支。
 *
 * 暴露：
 *   - `installPublicStat(config?, opts?)`：手动触发；幂等。
 *   - `getMixin()`：返回 vue mixin 对象，供宿主自行 `app.mixin(...)`。
 */
/**
 * 从 `process.env.UNI_STATISTICS_CONFIG`（plugin 注入的 manifest.uniStatistics 序列化串）
 * 读取业务配置，把已知字段映射为 StatApp.install 的 partial config。
 *
 * ## 字段命名严格对齐私有版
 *
 * uni-app 私有版（`src/utils/pageInfo.js`）历史已对外暴露的 manifest 字段：
 *
 *   | manifest 字段                          | 类型     | 默认值 | 私有版语义                       |
 *   | -------------------------------------- | -------- | ------ | -------------------------------- |
 *   | `enable`                               | Boolean  | false  | 总开关，由 plugin 处理           |
 *   | `version`                              | String   | "1"    | "1" / "2" / "3"（公有版新增）    |
 *   | `debug`                                | Boolean  | false  | logger.debug 开关                |
 *   | `reportInterval`                       | Number   | 10     | 上报间隔秒数；0 = 立即上报       |
 *   | `collectItems.uniPushClientID`         | Boolean  | false  | 是否采集 push ClientID（lt=101） |
 *   | `collectItems.uniStatPageLog`          | Boolean  | true   | 是否上报页面日志（lt=11）        |
 *
 * 公有版**新增**字段（私有版不支持）：
 *
 *   | manifest 字段             | 类型    | 默认值 | 说明                                                   |
 *   | ------------------------- | ------- | ------ | ------------------------------------------------------ |
 *   | `backgroundTimeout`       | Number  | 300    | 后台返回前台超过此秒数视为新会话（cst=2）              |
 *   | `pageInactiveTimeout`     | Number  | 1800   | 前台连续无操作超过此秒数视为新会话（cst=3）            |
 *   | `channelVersion`          | String  | image  | 内部调试：`image` / `1` / `2`，业务方一般不需要设置   |
 *
 * ## 别名兼容
 *
 * 公有版早期内部测试用了带 `Sec` 后缀的命名（`reportIntervalSec / backgroundTimeoutSec /
 * pageInactiveTimeoutSec`），未对外发布但已在示例中出现过；本函数同时接受这两套写法，
 * **优先取私有版命名**（无后缀），别名仅作向后兼容。
 *
 * ## 内部接入参数不可自定义
 *
 * image 通道的 `host / projectId / topicId` 是 SDK 内部接入参数，由维护者直接在
 * `public/config.ts#IMAGE_REPORT_DEFAULTS` 中维护，**不**通过 manifest 暴露给业务方。
 *
 * 任意 JSON 解析 / 字段类型异常都吞掉，回到默认值；此处**不能**抛错，否则会阻塞自动 install。
 *
 * ## 必须直接写 `process.env.UNI_STATISTICS_CONFIG`
 *
 * `uni:stat` 插件通过 Vite `define` 在**构建阶段**把字面量 `process.env.UNI_STATISTICS_CONFIG`
 * 替换为 JSON 字符串。若写成 `const env = process.env; env.UNI_STATISTICS_CONFIG`，
 * 打包器无法静态替换，小程序/H5 运行时读到的一直是 `undefined`，manifest 超时等字段全部丢失。
 *
 * ## 禁止 `typeof process !== 'undefined' ? process.env.XXX : …`
 *
 * 微信小程序等运行时**往往没有全局 `process`**。替换后源码等价于
 * `typeof process !== 'undefined' ? "{\"enable\":…}" : undefined`，条件为假时会**整段丢弃**
 * 已内联的 JSON 字符串，表现为 `UNI_STATISTICS_CONFIG_len=0`、会话阈值永远默认。
 * 因此必须**直接**书写 `process.env.UNI_STATISTICS_CONFIG`（无任何 `typeof process` 包裹）。
 */
/**
 * 解析构建期注入的 `UNI_STATISTICS_CONFIG`。
 * 正常为 JSON 字符串；少数打包配置会误注入为对象字面量，此处一并兼容。
 */
function parseInjectedUniStatistics() {
  var raw = {};
  if (raw == null) return undefined;
  if ((0, _typeof2.default)(raw) === 'object' && !Array.isArray(raw)) {
    return raw;
  }
  if (typeof raw !== 'string') return undefined;
  var trimmed = raw.trim();
  if (!trimmed || trimmed === 'undefined') return undefined;
  try {
    var obj = JSON.parse(trimmed);
    if (!obj || (0, _typeof2.default)(obj) !== 'object' || Array.isArray(obj)) return undefined;
    return obj;
  } catch (_e) {
    return undefined;
  }
}
function readManifestStatConfig() {
  try {
    var obj = parseInjectedUniStatistics();
    if (!obj) return undefined;
    var cfg = {};
    if (obj.channelVersion != null) {
      var v = String(obj.channelVersion);
      if (v === '1' || v === '2' || v === 'image') cfg.version = v;
    }
    // === 公有版扩展：backgroundTimeout / pageInactiveTimeout（私有版无此字段）===
    // 同时兼容早期内部用的带 Sec 后缀别名；优先无后缀（与官方风格一致）。
    var bg = pickPositiveNumber(obj.backgroundTimeout, obj.backgroundTimeoutSec);
    if (bg !== undefined) cfg.backgroundTimeoutSec = bg;
    var pi = pickPositiveNumber(obj.pageInactiveTimeout, obj.pageInactiveTimeoutSec);
    if (pi !== undefined) cfg.pageInactiveTimeoutSec = pi;
    // === 私有版同名字段：reportInterval（私有版默认 10）===
    // 兼容旧公有版别名 reportIntervalSec；允许 0（私有版语义"立即上报"）。
    var ri = pickNonNegativeNumber(obj.reportInterval, obj.reportIntervalSec);
    if (ri !== undefined) cfg.reportIntervalSec = ri;
    // === 私有版同名字段：collectItems.{uniPushClientID, uniStatPageLog} ===
    if (obj.collectItems && (0, _typeof2.default)(obj.collectItems) === 'object') {
      var items = obj.collectItems;
      if (typeof items.uniPushClientID === 'boolean') {
        cfg.enablePush = items.uniPushClientID;
      }
      if (typeof items.uniStatPageLog === 'boolean') {
        cfg.enablePageLog = items.uniStatPageLog;
      }
    }
    if (typeof obj.ak === 'string' && obj.ak) cfg.ak = obj.ak;
    if (typeof obj.v === 'string') cfg.v = obj.v;
    if (typeof obj.ch === 'string') cfg.ch = obj.ch;
    return Object.keys(cfg).length > 0 ? cfg : undefined;
  } catch (e) {
    logger.warn('[uni统计 2.0] readManifestStatConfig failed', e);
    return undefined;
  }
}
/**
 * 将 manifest / JSON 中的数值候选标准化为正数（> 0）。
 * 兼容部分工具或手工编辑 manifest 时写成**字符串数字**（如 `"60"`）的情况。
 */
function normalizePositiveNumber(value) {
  if (typeof value === 'number') {
    return value > 0 ? value : undefined;
  }
  if (typeof value === 'string') {
    var t = value.trim();
    if (t === '') return undefined;
    var _n4 = Number(t);
    if (Number.isFinite(_n4) && _n4 > 0) return _n4;
  }
  return undefined;
}
/**
 * 将候选标准化为非负数（>= 0），用于 `reportInterval`。
 */
function normalizeNonNegativeNumber(value) {
  if (typeof value === 'number') {
    return value >= 0 ? value : undefined;
  }
  if (typeof value === 'string') {
    var t = value.trim();
    if (t === '') return undefined;
    var _n5 = Number(t);
    if (Number.isFinite(_n5) && _n5 >= 0) return _n5;
  }
  return undefined;
}
/**
 * 在多个候选值中按顺序取**第一个有效的正数**（> 0），其余忽略。
 * 用于 manifest 字段的"主名 / 别名"二选一解析（如 `backgroundTimeout` / `backgroundTimeoutSec`）。
 *
 * 注意：私有版历史允许 `0` 表示"立即上报"，但仅 `reportInterval` 一项有此语义；
 * timeout 类字段 0 表示"立即超时"，不合理，本函数统一过滤为 undefined。
 */
function pickPositiveNumber() {
  for (var _len6 = arguments.length, candidates = new Array(_len6), _key7 = 0; _key7 < _len6; _key7++) {
    candidates[_key7] = arguments[_key7];
  }
  for (var _i14 = 0, _candidates = candidates; _i14 < _candidates.length; _i14++) {
    var c = _candidates[_i14];
    var _n6 = normalizePositiveNumber(c);
    if (_n6 !== undefined) return _n6;
  }
  return undefined;
}
/**
 * 同 `pickPositiveNumber`，但允许 `0`（用于 `reportInterval` 表达"立即上报"语义）。
 */
function pickNonNegativeNumber() {
  for (var _len7 = arguments.length, candidates = new Array(_len7), _key8 = 0; _key8 < _len7; _key8++) {
    candidates[_key8] = arguments[_key8];
  }
  for (var _i15 = 0, _candidates2 = candidates; _i15 < _candidates2.length; _i15++) {
    var c = _candidates2[_i15];
    var _n7 = normalizeNonNegativeNumber(c);
    if (_n7 !== undefined) return _n7;
  }
  return undefined;
}
function getUni() {
  var u = resolveUniRuntime();
  return u != null && (0, _typeof2.default)(u) === 'object' ? u : undefined;
}
/** Vue3 下晚就绪 API 重试次数（50ms 间隔，约 1s）。 */
var UNI_HOOK_RETRY_MAX = 20;
var UNI_HOOK_RETRY_MS = 50;
/** 已排队或已执行的 vue mixin 注入，避免重复。 */
var vueMixinMounted = false;
var vueMixinRetryTimer;
/** install 是否已经触发过（不论成功失败）。 */
var bootstrapped = false;
/** 已注册到全局的 unbind，便于 __reset。 */
var lastUnbind;
/** 晚就绪时重试 `uni.onAppShow` 的定时器。 */
var uniHookRetryTimer;
/**
 * 入口装配。重复调用时立即返回。
 *
 * 失败任意子步骤都吞掉日志，不抛回。
 */
function installPublicStat() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  if (bootstrapped) return;
  bootstrapped = true;
  // 优先级：opts.config（手动覆盖） > manifest.uniStatistics（plugin 注入） > 默认值。
  // 这样业务/灰度同学既能在 manifest 里改超时阈值（生产路径），
  // 也能用 installPublicStat({ config: {...} }) 在测试环境强行覆盖（接入调试）。
  var fromManifest = readManifestStatConfig();
  var finalConfig = Object.assign({}, fromManifest, opts.config);
  var app = getStatApp();
  tryRun(function () {
    return app.install(finalConfig, opts.overrides);
  }, undefined);
  // 启动摘要：与生命周期解耦，保证 StatApp.install 完成后立刻可打印（不依赖 uni 是否已挂载）。
  tryRun(function () {
    var _a, _b, _c;
    var cfgBoot = app.getConfig();
    var appName = "梦幻衣橱" || false;
    var injected = parseInjectedUniStatistics();
    var bootBase = {
      channel: (_a = cfgBoot === null || cfgBoot === void 0 ? void 0 : cfgBoot.version) !== null && _a !== void 0 ? _a : 'image',
      reportIntervalSec: (_b = cfgBoot === null || cfgBoot === void 0 ? void 0 : cfgBoot.reportIntervalSec) !== null && _b !== void 0 ? _b : 0,
      ak: (_c = cfgBoot === null || cfgBoot === void 0 ? void 0 : cfgBoot.ak) !== null && _c !== void 0 ? _c : '',
      appName: appName,
      debugFromManifest: false === 'true' || false === true
    };
    // 仅当 manifest 显式配置了超时项时才在 debug 启动摘要中展示（默认值 300/1800 不刷屏）。
    if (injected != null) {
      if (injected.backgroundTimeout != null || injected.backgroundTimeoutSec != null) {
        bootBase.backgroundTimeoutSec = cfgBoot === null || cfgBoot === void 0 ? void 0 : cfgBoot.backgroundTimeoutSec;
      }
      if (injected.pageInactiveTimeout != null || injected.pageInactiveTimeoutSec != null) {
        bootBase.pageInactiveTimeoutSec = cfgBoot === null || cfgBoot === void 0 ? void 0 : cfgBoot.pageInactiveTimeoutSec;
      }
    }
    logBoot(Object.assign({}, bootBase, {
      vueMode: 'Vue2'
    }));
  }, undefined);
  /**
   * 装配 vue mixin 与 uni 生命周期；与 logBoot 解耦，便于在 uni 晚就绪时延后执行。
   */
  var finishLifecycleInstall = function finishLifecycleInstall() {
    var _a, _b;
    // 把 collectItems 的开关透传给 lifecycleHooks：
    //   - uniPushClientID → enablePush（决定是否抓取 push CID 上报 lt=101）
    //   - uniStatPageLog  → enablePageLog（决定是否上报 lt=11 页面切换事件）
    // 调用方通过 opts.lifecycle 显式传入的值优先级最高，未指定时用 manifest 默认。
    var cfg = app.getConfig();
    var lifecycleOpts = Object.assign({}, {
      enablePush: (_a = cfg === null || cfg === void 0 ? void 0 : cfg.enablePush) !== null && _a !== void 0 ? _a : false,
      enablePageLog: (_b = cfg === null || cfg === void 0 ? void 0 : cfg.enablePageLog) !== null && _b !== void 0 ? _b : true
    }, opts.lifecycle);
    var _bindLifecycle = bindLifecycle(app, lifecycleOpts),
      mixin = _bindLifecycle.mixin,
      unbind = _bindLifecycle.unbind;
    lastUnbind = unbind;
    // 与私有版 load_stat 一致：同步注入 mixin，不等待 uni.onAppShow（Vue2 根本不注册该项）。
    if (!opts.skipVueMixin) {
      tryRun(function () {
        return mountVueMixin(mixin);
      }, undefined);
    }
    if (!opts.skipUniReport) {
      tryRun(function () {
        return mountUniReport(app);
      }, undefined);
    }
    // 私有版：仅 Vue3 且非 H5/nvue 注册 uni 应用前后台。
    if (shouldBindUniAppLifecycle() && !tryBindUniAppLifecycle(app, lifecycleOpts)) {
      scheduleUniAppHookRetry(function () {
        return tryBindUniAppLifecycle(app, lifecycleOpts);
      });
    }
  };
  finishLifecycleInstall();
}
/**
 * 仅 Vue3 小程序等重试 `uni.onAppShow` / `onAppHide`；Vue2 不调用。
 */
function scheduleUniAppHookRetry(tryBind) {
  if (uniHookRetryTimer) {
    clearTimeout(uniHookRetryTimer);
    uniHookRetryTimer = undefined;
  }
  var attempts = 0;
  var tick = function tick() {
    if (tryBind()) return;
    if (++attempts >= UNI_HOOK_RETRY_MAX) {
      logger.warn('[uni统计 2.0] Vue3 小程序：uni.onAppShow 暂不可用，应用前后台统计可能缺失');
      return;
    }
    uniHookRetryTimer = setTimeout(tick, UNI_HOOK_RETRY_MS);
  };
  uniHookRetryTimer = setTimeout(tick, UNI_HOOK_RETRY_MS);
}
/**
 * 把 mixin 装到 vue 实例上。
 *
 * 与私有版 `src/index.js#load_stat` 一致，必须用条件编译区分：
 *   - VUE3：`uni.onCreateVueApp` → `app.mixin`（与私有版相同，不引 `@dcloudio/uni-shared`）。
 *   - VUE2：`require('vue').mixin`（由应用打包器静态解析，勿用 `globalThis.require`）。
 *
 * `#ifdef` 保留到 dist，由宿主 `uni:pre` 在打包阶段剔除分支（同私有版 dist）。
 */

function mountVueMixin(mixin) {
  if (vueMixinMounted) return;
  if (mountVue2GlobalMixin(mixin)) {
    vueMixinMounted = true;
  }
}

/**
 * Vue2 全局 mixin（与私有版 `index.js` 中 `require('vue').mixin` 一致）。
 *
 * @returns 是否注入成功
 */
function mountVue2GlobalMixin(mixin) {
  var _a;
  // eslint-disable-next-line no-restricted-globals
  var Vue = __webpack_require__(/*! vue */ 25);
  var target = (_a = Vue.default) !== null && _a !== void 0 ? _a : Vue;
  if (target && typeof target.mixin === 'function') {
    tryRun(function () {
      return target.mixin(mixin);
    }, undefined);
    return true;
  }
  logger.warn('[uni统计 2.0] Vue2: vue.mixin 不可用，请检查是否已安装 vue 依赖');
  return false;
}
/**
 * 把 `uni.report` 桥到 StatApp.report。
 *
 * H5 发行摇树时 `resolveUniRuntime` 会跳过 `{}` 空桩，但业务仍可能通过
 * `window.uni.report` 调用；故在可用 runtime 缺失时回退 `getGlobalObject().uni`。
 */
function mountUniReport(app) {
  var _a;
  var g = getGlobalObject();
  var u = (_a = getUni()) !== null && _a !== void 0 ? _a : g.uni;
  if (!u || (0, _typeof2.default)(u) !== 'object') return;
  u.report = function (type, value) {
    app.report(type, value);
  };
}
/** 仅供测试：重置 install 哨兵；调用方应同时调 `__resetStatApp()`。 */
function __resetInstall() {
  if (uniHookRetryTimer) {
    clearTimeout(uniHookRetryTimer);
    uniHookRetryTimer = undefined;
  }
  if (vueMixinRetryTimer) {
    clearTimeout(vueMixinRetryTimer);
    vueMixinRetryTimer = undefined;
  }
  vueMixinMounted = false;
  if (lastUnbind) tryRun(function () {
    return lastUnbind();
  }, undefined);
  lastUnbind = undefined;
  bootstrapped = false;
}

/**
 * 公有版统计入口。
 *
 * 与私有版 `src/index.js#main()` 等价：模块加载即触发安装。宿主无需手动调用，
 * 只需 `import '@dcloudio/uni-stat-public'`（或对应 dist 路径）即可。
 *
 * 也对外导出 `installPublicStat / getStatApp` 以便调试或自定义场景手动重装。
 */
// 自动安装：与私有版行为一致，加载即触发。
installPublicStat();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 32 */
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/assertThisInitialized.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 33 */
/*!*********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/inherits.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ 16);
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}
module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 34 */
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
var assertThisInitialized = __webpack_require__(/*! ./assertThisInitialized.js */ 32);
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return assertThisInitialized(self);
}
module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 35 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/getPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _getPrototypeOf(o);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 36 */
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/wrapNativeSuper.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getPrototypeOf = __webpack_require__(/*! ./getPrototypeOf.js */ 35);
var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ 16);
var isNativeFunction = __webpack_require__(/*! ./isNativeFunction.js */ 37);
var construct = __webpack_require__(/*! ./construct.js */ 15);
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;
  module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !isNativeFunction(Class)) return Class;
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);
      _cache.set(Class, Wrapper);
    }
    function Wrapper() {
      return construct(Class, arguments, getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return setPrototypeOf(Wrapper, Class);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _wrapNativeSuper(Class);
}
module.exports = _wrapNativeSuper, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 37 */
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/isNativeFunction.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _isNativeFunction(fn) {
  try {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  } catch (e) {
    return typeof fn === "function";
  }
}
module.exports = _isNativeFunction, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 38 */
/*!************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/@babel/runtime/regenerator/index.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(/*! @babel/runtime/helpers/regeneratorRuntime */ 39)();
module.exports = runtime;

/***/ }),
/* 39 */
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/regeneratorRuntime.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
function _regeneratorRuntime() {
  "use strict";

  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return e;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function define(t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function value(t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) {
              if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            }
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(_typeof(e) + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) {
      r.push(n);
    }
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) {
        "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
      }
    },
    stop: function stop() {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function complete(t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function finish(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    "catch": function _catch(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 40 */
/*!************************************************************************!*\
  !*** D:/WeChatApp/ChangeCloseGame/uni-app/pages.json?{"type":"style"} ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  "pages": [{
    "path": "pages/index/index",
    "style": {
      "navigationBarTitleText": "梦幻衣橱",
      "navigationStyle": "custom",
      "app-plus": {
        "bounce": "none"
      }
    }
  }, {
    "path": "pages/ab/ab",
    "style": {
      "navigationBarTitleText": "A/B 渲染校验",
      "navigationStyle": "custom"
    }
  }],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "梦幻衣橱",
    "navigationBarBackgroundColor": "#fff5f9",
    "backgroundColor": "#fff5f9"
  }
};
exports.default = _default;

/***/ }),
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    if (!options.components) {
      options.components = {}
    }
    var hasOwn = Object.prototype.hasOwnProperty
    for (var name in components) {
      if (hasOwn.call(components, name) && !hasOwn.call(options.components, name)) {
        options.components[name] = components[name]
      }
    }
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    if(typeof renderjs.beforeCreate === 'function'){
			renderjs.beforeCreate = [renderjs.beforeCreate]
		}
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 54 */
/*!*************************************************************!*\
  !*** D:/WeChatApp/ChangeCloseGame/uni-app/common/avatar.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TAG_NAMES = exports.SKINS = exports.ITEM_MAP = exports.ITEMS = exports.INK = exports.HAIRSTYLES = exports.HAIRCOLORS = exports.EYESHAPES = exports.EYECOLORS = exports.CHARACTERS = exports.CATEGORIES = void 0;
exports.avatarSVG = avatarSVG;
exports.eyeShapeThumbSVG = eyeShapeThumbSVG;
exports.hairThumbSVG = hairThumbSVG;
exports.headThumbSVG = headThumbSVG;
exports.itemThumbSVG = itemThumbSVG;
exports.makeBody = makeBody;
exports.shade = shade;
exports.svgToDataUri = svgToDataUri;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
/* =========================================================================
   梦幻衣橱 · 纯 SVG 生成模块（由原 web-prototype/data.js + render.js 移植）
   纯函数，无 DOM 依赖：输入 cfg，输出完整角色的 SVG 字符串。
   uni-app 端把 SVG 转 base64 后交给 <image> 渲染（H5 / App 均可显示）。
   ========================================================================= */

/* ---------- 颜色工具 ---------- */
function shade(hex, p) {
  // p: -1 变暗 ~ 1 变亮
  if (!hex) return hex;
  if (hex.indexOf('url(') === 0) return hex; // 渐变引用不改色
  var n = parseInt(hex.slice(1), 16);
  if (isNaN(n)) return hex;
  var r = n >> 16,
    g = n >> 8 & 255,
    b = n & 255;
  var t = p < 0 ? 0 : 255,
    a = Math.abs(p);
  r = Math.round(r + (t - r) * a);
  g = Math.round(g + (t - g) * a);
  b = Math.round(b + (t - b) * a);
  return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}
function heart(x, y, s, fill, extra) {
  return "<path d=\"M ".concat(x, ",").concat(y + s * 0.9, " C ").concat(x - s * 1.4, ",").concat(y - s * 0.4, " ").concat(x - s * 0.6, ",").concat(y - s * 1.5, " ").concat(x, ",").concat(y - s * 0.4, " C ").concat(x + s * 0.6, ",").concat(y - s * 1.5, " ").concat(x + s * 1.4, ",").concat(y - s * 0.4, " ").concat(x, ",").concat(y + s * 0.9, " Z\" fill=\"").concat(fill, "\" ").concat(extra || '', "/>");
}
function star5(cx, cy, r, fill, extra) {
  var d = '';
  for (var i = 0; i < 10; i++) {
    var rr = i % 2 === 0 ? r : r * 0.45;
    var a = -Math.PI / 2 + i * Math.PI / 5;
    d += (i === 0 ? 'M' : 'L') + (cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1);
  }
  return "<path d=\"".concat(d, " Z\" fill=\"").concat(fill, "\" ").concat(extra || '', "/>");
}
function waveEdge(x0, x1, y, waves, amp) {
  // 波浪下摆（支持任意方向）
  var w = (x1 - x0) / waves;
  var d = '';
  for (var i = 0; i < waves; i++) {
    var a = x0 + i * w;
    d += " Q ".concat((a + w * 0.5).toFixed(1), ",").concat((y + amp).toFixed(1), " ").concat((a + w).toFixed(1), ",").concat(y);
  }
  return d;
}
function bodyHalfAt(b, y) {
  // 躯干在某 y 的半宽
  var pts = [[b.shoulderY, b.shoulderHalf], [b.chestY, b.chestHalf], [b.waistY, b.waistHalf], [b.hipY, b.hipHalf]];
  if (y <= pts[0][0]) return pts[0][1];
  for (var i = 1; i < pts.length; i++) {
    if (y <= pts[i][0]) {
      var t = (y - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]);
      return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t;
    }
  }
  return pts[3][1];
}

/* ---------- 线稿风格 ---------- */
var INK = '#4a3455';
exports.INK = INK;
function inked(fill, w) {
  return "fill=\"".concat(fill, "\" stroke=\"").concat(INK, "\" stroke-width=\"").concat(w || 2.6, "\" stroke-linejoin=\"round\"");
}
function limbPath(pts, w, color) {
  // 双描边：墨线粗描 + 彩色细描
  return "<path d=\"".concat(pts, "\" stroke=\"").concat(INK, "\" stroke-width=\"").concat(w + 3.2, "\" fill=\"none\" stroke-linecap=\"round\"/>") + "<path d=\"".concat(pts, "\" stroke=\"").concat(color, "\" stroke-width=\"").concat(w, "\" fill=\"none\" stroke-linecap=\"round\"/>");
}

/* ---------- 共享体型轮廓（角色与服装同一套函数，保证贴合） ---------- */
function armPts(b, side) {
  var cx = b.cx,
    sy = b.shoulderY,
    armX = b.armX,
    elbowX = b.elbowX,
    elbowY = b.elbowY,
    wristX = b.wristX,
    wristY = b.wristY;
  return "M ".concat(cx + side * armX, ",").concat(sy + 8, " Q ").concat(cx + side * elbowX, ",").concat(elbowY, " ").concat(cx + side * wristX, ",").concat(wristY);
}
function armPtsT(b, side, t) {
  var cx = b.cx,
    sy = b.shoulderY,
    armX = b.armX,
    elbowX = b.elbowX,
    elbowY = b.elbowY,
    wristX = b.wristX,
    wristY = b.wristY;
  var x0 = cx + side * armX,
    y0 = sy + 8;
  var x1 = cx + side * elbowX,
    y1 = elbowY;
  var x2 = cx + side * wristX,
    y2 = wristY;
  var u = 1 - t;
  var bx = u * u * x0 + 2 * u * t * x1 + t * t * x2;
  var by = u * u * y0 + 2 * u * t * y1 + t * t * y2;
  return "M ".concat(x0.toFixed(1), ",").concat(y0, " Q ").concat(x1.toFixed(1), ",").concat(y1, " ").concat(bx.toFixed(1), ",").concat(by.toFixed(1));
}
function legPts(b, side, endY) {
  var cx = b.cx,
    hy = b.hipY,
    ankleY = b.ankleY,
    legGap = b.legGap;
  var y2 = endY || ankleY;
  var t = Math.max(0, Math.min(1, (y2 - hy - 6) / (ankleY - hy - 6)));
  return "M ".concat(cx + side * legGap, ",").concat(hy + 6, " L ").concat((cx + side * (legGap - 1.5 * t)).toFixed(1), ",").concat(y2);
}
function legCenterX(b, side, y) {
  var hy = b.hipY,
    ankleY = b.ankleY,
    legGap = b.legGap;
  var t = Math.max(0, Math.min(1, (y - hy - 6) / (ankleY - hy - 6)));
  return b.cx + side * (legGap - 1.5 * t);
}
function footCX(b, side) {
  return b.cx + side * b.footX;
}
function torsoPath(b, e) {
  e = e || 0;
  var cx = b.cx,
    sy = b.shoulderY,
    wy = b.waistY,
    hy = b.hipY,
    sh = b.shoulderHalf,
    ch = b.chestHalf,
    wh = b.waistHalf,
    hh = b.hipHalf;
  return "M ".concat(cx - sh - e, ",").concat(sy + 2, "\n    C ").concat(cx - ch - e - 1, ",").concat(sy + 16, " ").concat(cx - wh - e + 1, ",").concat(wy - 11, " ").concat(cx - wh - e, ",").concat(wy + 7, "\n    C ").concat(cx - wh - e - 1, ",").concat(hy - 11, " ").concat(cx - hh - e, ",").concat(hy - 3, " ").concat(cx - hh - e, ",").concat(hy + 7, "\n    Q ").concat(cx, ",").concat(hy + 19, " ").concat(cx + hh + e, ",").concat(hy + 7, "\n    C ").concat(cx + hh + e, ",").concat(hy - 3, " ").concat(cx + wh + e + 1, ",").concat(hy - 11, " ").concat(cx + wh + e, ",").concat(wy + 7, "\n    C ").concat(cx + wh + e + 1, ",").concat(wy - 11, " ").concat(cx + ch + e + 1, ",").concat(sy + 16, " ").concat(cx + sh + e, ",").concat(sy + 2, "\n    Q ").concat(cx, ",").concat(sy + 13, " ").concat(cx - sh - e, ",").concat(sy + 2, " Z");
}
function torsoTopPath(b, e, hemY) {
  var cx = b.cx,
    sy = b.shoulderY,
    wy = b.waistY,
    sh = b.shoulderHalf,
    ch = b.chestHalf,
    wh = b.waistHalf;
  var hw = bodyHalfAt(b, hemY) + e;
  return "M ".concat(cx - sh - e, ",").concat(sy + 2, "\n    C ").concat(cx - ch - e - 1, ",").concat(sy + 16, " ").concat(cx - wh - e + 1, ",").concat(wy - 11, " ").concat(cx - hw, ",").concat(hemY, "\n    L ").concat(cx + hw, ",").concat(hemY, "\n    C ").concat(cx + wh + e + 1, ",").concat(wy - 11, " ").concat(cx + ch + e + 1, ",").concat(sy + 16, " ").concat(cx + sh + e, ",").concat(sy + 2, "\n    Q ").concat(cx, ",").concat(sy + 13, " ").concat(cx - sh - e, ",").concat(sy + 2, " Z");
}

/* ---------- 调色板 ---------- */
var SKINS = ['#ffe3d0', '#fcd0b0', '#f2b98e', '#dda27a', '#b37a50', '#8a5a38'];
exports.SKINS = SKINS;
var HAIRCOLORS = ['#2b2b33', '#5b3a29', '#8a5a33', '#c98a3d', '#f0cd7a', '#e87a8f', '#a78bfa', '#5eb8f0', '#7dc9a0', '#e8e4ee'];
exports.HAIRCOLORS = HAIRCOLORS;
var EYECOLORS = ['#4a3b2a', '#2f6f4f', '#3a6ea8', '#7a4fd0', '#c05a3a', '#d47fa6', '#e0a63c', '#7a828e'];
exports.EYECOLORS = EYECOLORS;
var EYESHAPES = [{
  id: 'round',
  name: '圆圆眼'
}, {
  id: 'almond',
  name: '杏眼'
}, {
  id: 'narrow',
  name: '丹凤眼'
}, {
  id: 'sparkle',
  name: '星光眼'
}, {
  id: 'sleepy',
  name: '睡眼'
}];

/* ---------- 6 位角色 ---------- */
exports.EYESHAPES = EYESHAPES;
var CHARACTERS = {
  yu: {
    name: '小玉',
    desc: '纤细 · 甜美系',
    head: 1.00,
    sw: 0.94,
    ww: 0.90,
    hw: 1.00,
    h: 1.00,
    neck: 1.00,
    mouth: 'smile',
    lash: true,
    preset: {
      hair: 'long',
      hairColor: 1,
      skin: 1,
      eyeColor: 3,
      eyeShape: 'almond',
      items: {
        top: 't1',
        bottom: 'p1',
        shoes: 'sh1'
      }
    }
  },
  zhe: {
    name: '阿哲',
    desc: '阳光 · 运动系',
    head: 0.96,
    sw: 1.24,
    ww: 1.08,
    hw: 0.98,
    h: 1.05,
    neck: 1.18,
    mouth: 'grin',
    lash: false,
    preset: {
      hair: 'spiky',
      hairColor: 0,
      skin: 2,
      eyeColor: 0,
      eyeShape: 'narrow',
      items: {
        top: 't2',
        bottom: 'p4',
        shoes: 'sh1'
      }
    }
  },
  yuan: {
    name: '圆圆',
    desc: '圆润 · 可爱系',
    head: 1.05,
    sw: 1.10,
    ww: 1.42,
    hw: 1.38,
    h: 0.96,
    neck: 1.05,
    mouth: 'happy',
    lash: true,
    preset: {
      hair: 'curly',
      hairColor: 4,
      skin: 0,
      eyeColor: 6,
      eyeShape: 'round',
      items: {
        dress: 'd1',
        shoes: 'sh4',
        necklace: 'n1'
      }
    }
  },
  man: {
    name: '小满',
    desc: '活泼 · 小不点',
    head: 1.28,
    sw: 0.80,
    ww: 0.82,
    hw: 0.85,
    h: 0.78,
    neck: 0.92,
    mouth: 'happy',
    lash: true,
    eyeBig: 1.28,
    preset: {
      hair: 'twin',
      hairColor: 3,
      skin: 0,
      eyeColor: 1,
      eyeShape: 'sparkle',
      items: {
        top: 't6',
        bottom: 'p2',
        shoes: 'sh1',
        headwear: 'hw1'
      }
    }
  },
  gao: {
    name: '高小姐',
    desc: '高挑 · 优雅系',
    head: 0.94,
    sw: 0.96,
    ww: 0.86,
    hw: 1.02,
    h: 1.10,
    neck: 1.05,
    mouth: 'calm',
    lash: true,
    preset: {
      hair: 'bun',
      hairColor: 0,
      skin: 1,
      eyeColor: 4,
      eyeShape: 'narrow',
      items: {
        dress: 'd5',
        shoes: 'sh5',
        earrings: 'e1'
      }
    }
  },
  chen: {
    name: '老陈',
    desc: '敦厚 · 暖心系',
    head: 1.04,
    sw: 1.20,
    ww: 1.30,
    hw: 1.14,
    h: 0.92,
    neck: 1.22,
    mouth: 'smile',
    lash: false,
    preset: {
      hair: 'buzz',
      hairColor: 1,
      skin: 3,
      eyeColor: 7,
      eyeShape: 'round',
      items: {
        top: 't3',
        bottom: 'p1',
        shoes: 'sh2'
      }
    }
  }
};

/* ---------- 服装绘制基础件 ---------- */
exports.CHARACTERS = CHARACTERS;
function topBase(b, o) {
  var cx = b.cx,
    sy = b.shoulderY,
    wy = b.waistY,
    neckW = b.neckW;
  var c = o.c,
    dk = o.dk || shade(c, -0.18);
  var e = o.slim ? 3 : 5.5;
  var hemY = o.hemY || wy + 10;
  var s = "<path d=\"".concat(torsoTopPath(b, e, hemY), "\" ").concat(inked(c), "/>");
  var collar = o.collar || 'round';
  if (collar === 'round') s += "<path d=\"M ".concat(cx - neckW - 3, ",").concat(sy + 3, " Q ").concat(cx, ",").concat(sy + 16, " ").concat(cx + neckW + 3, ",").concat(sy + 3, "\" stroke=\"").concat(INK, "\" stroke-width=\"2.2\" fill=\"none\" stroke-linecap=\"round\"/>");else if (collar === 'v') s += "<path d=\"M ".concat(cx - neckW - 5, ",").concat(sy + 1, " L ").concat(cx, ",").concat(sy + 30, " L ").concat(cx + neckW + 5, ",").concat(sy + 1, "\" stroke=\"").concat(INK, "\" stroke-width=\"2.2\" fill=\"none\" stroke-linejoin=\"round\"/>");
  if (o.hood) {
    s += "<path d=\"M ".concat(cx - b.shoulderHalf * 0.74, ",").concat(sy - 3, " Q ").concat(cx, ",").concat(sy - 30, " ").concat(cx + b.shoulderHalf * 0.74, ",").concat(sy - 3, " Q ").concat(cx + b.shoulderHalf * 0.5, ",").concat(sy + 9, " ").concat(cx, ",").concat(sy + 5, " Q ").concat(cx - b.shoulderHalf * 0.5, ",").concat(sy + 9, " ").concat(cx - b.shoulderHalf * 0.74, ",").concat(sy - 3, " Z\" ").concat(inked(dk, 2.2), "/>") + "<line x1=\"".concat(cx - 5, "\" y1=\"").concat(sy + 8, "\" x2=\"").concat(cx - 6, "\" y2=\"").concat(sy + 24, "\" stroke=\"#fff\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"").concat(cx + 5, "\" y1=\"").concat(sy + 8, "\" x2=\"").concat(cx + 6, "\" y2=\"").concat(sy + 24, "\" stroke=\"#fff\" stroke-width=\"2\" stroke-linecap=\"round\"/>");
  }
  if (o.pocket) {
    var pw = b.waistHalf * 0.95;
    s += "<rect x=\"".concat(cx - pw / 2, "\" y=\"").concat(hemY - 17, "\" width=\"").concat(pw, "\" height=\"13\" rx=\"4\" fill=\"none\" stroke=\"").concat(INK, "\" stroke-width=\"2\" opacity=\".75\"/>");
  }
  if (o.stripes) {
    [sy + 24, sy + 42, sy + 60].forEach(function (y) {
      if (y < hemY - 4) {
        var hw2 = bodyHalfAt(b, y) + e - 1;
        s += "<rect x=\"".concat(cx - hw2, "\" y=\"").concat(y, "\" width=\"").concat(hw2 * 2, "\" height=\"6.5\" rx=\"3.2\" fill=\"").concat(o.stripes, "\" opacity=\".92\"/>");
      }
    });
  }
  if (o.buttons) {
    [0.3, 0.55, 0.8].forEach(function (t) {
      var y = sy + 14 + (hemY - sy - 14) * t;
      s += "<circle cx=\"".concat(cx, "\" cy=\"").concat(y, "\" r=\"1.9\" fill=\"").concat(INK, "\" opacity=\".8\"/>");
    });
    s += "<line x1=\"".concat(cx, "\" y1=\"").concat(sy + 10, "\" x2=\"").concat(cx, "\" y2=\"").concat(hemY - 2, "\" stroke=\"").concat(INK, "\" stroke-width=\"1.4\" opacity=\".55\"/>");
  }
  s += sleeveSVG(b, o.sleeve, c, dk);
  if (o.hemLine) s += "<line x1=\"".concat(cx - (bodyHalfAt(b, hemY) + e - 2), "\" y1=\"").concat(hemY - 3, "\" x2=\"").concat(cx + (bodyHalfAt(b, hemY) + e - 2), "\" y2=\"").concat(hemY - 3, "\" stroke=\"").concat(dk, "\" stroke-width=\"2\" opacity=\".6\"/>");
  return s;
}
function sleeveSVG(b, type, c, dk) {
  if (!type || type === 'none') return '';
  var cx = b.cx,
    sy = b.shoulderY,
    chestHalf = b.chestHalf,
    chestY = b.chestY,
    armX = b.armX,
    armW = b.armW,
    wristX = b.wristX,
    wristY = b.wristY;
  if (type === 'strap') return [-1, 1].map(function (sd) {
    return "<path d=\"M ".concat(cx + sd * (armX - 4), ",").concat(sy + 3, " L ").concat(cx + sd * chestHalf * 0.58, ",").concat(chestY - 4, "\" stroke=\"").concat(c, "\" stroke-width=\"6\" stroke-linecap=\"round\"/>");
  }).join('');
  if (type === 'puff') return [-1, 1].map(function (sd) {
    return "<circle cx=\"".concat(cx + sd * (armX + 0.5), "\" cy=\"").concat(sy + 10, "\" r=\"").concat(12.5 * b.fs, "\" ").concat(inked(c, 2.2), "/>");
  }).join('');
  if (type === 'wide') return [-1, 1].map(function (sd) {
    return limbPath(armPts(b, sd), armW * 2.35, c) + "<ellipse cx=\"".concat(cx + sd * (wristX + 5), "\" cy=\"").concat(wristY - 3, "\" rx=\"").concat(10 * b.fs, "\" ry=\"").concat(14 * b.fs, "\" ").concat(inked(dk, 2), " opacity=\".9\"/>");
  }).join('');
  if (type === 'long') return [-1, 1].map(function (sd) {
    return limbPath(armPts(b, sd), armW + 4.5, c) + "<circle cx=\"".concat(cx + sd * wristX, "\" cy=\"").concat(wristY - 3, "\" r=\"").concat((armW + 4.5) / 2 + 1, "\" fill=\"").concat(dk, "\" stroke=\"").concat(INK, "\" stroke-width=\"1.6\"/>");
  }).join('');
  return [-1, 1].map(function (sd) {
    return limbPath(armPtsT(b, sd, 0.45), armW + 6, c);
  }).join('');
}
function pantsBase(b, o) {
  var cx = b.cx,
    wy = b.waistY,
    hy = b.hipY,
    hh = b.hipHalf,
    wh = b.waistHalf,
    kneeY = b.kneeY,
    ankleY = b.ankleY,
    legW = b.legW;
  var c = o.c,
    dk = o.dk || shade(c, -0.2);
  var endY = o.len === 'short' ? hy + (kneeY - hy) * 0.5 : ankleY - 4;
  var w = o.slim ? legW + 2 : legW + 4.5;
  var s = "<path d=\"M ".concat(cx - wh - 3, ",").concat(wy - 2, " L ").concat(cx + wh + 3, ",").concat(wy - 2, "\n    C ").concat(cx + hh + 7, ",").concat(hy + 1, " ").concat(cx + hh + 5, ",").concat(hy + 15, " ").concat(cx + hh * 0.22, ",").concat(hy + 19, "\n    L ").concat(cx - hh * 0.22, ",").concat(hy + 19, "\n    C ").concat(cx - hh - 5, ",").concat(hy + 15, " ").concat(cx - hh - 7, ",").concat(hy + 1, " ").concat(cx - wh - 3, ",").concat(wy - 2, " Z\" ").concat(inked(c), "/>");
  [-1, 1].forEach(function (sd) {
    var lx = legCenterX(b, sd, endY);
    s += limbPath(legPts(b, sd, endY), w, c);
    if (o.cuffs) s += "<rect x=\"".concat(lx - w / 2 - 1, "\" y=\"").concat(endY - 9, "\" width=\"").concat(w + 2, "\" height=\"9\" rx=\"4\" fill=\"").concat(dk, "\" stroke=\"").concat(INK, "\" stroke-width=\"1.6\"/>");
    if (o.cargoPockets) s += "<rect x=\"".concat(lx - w * 0.38, "\" y=\"").concat((hy + kneeY) / 2 - 8, "\" width=\"").concat(w * 0.76, "\" height=\"14\" rx=\"3.5\" fill=\"").concat(dk, "\" opacity=\".9\" stroke=\"").concat(INK, "\" stroke-width=\"1.4\"/>");
  });
  s += "<rect x=\"".concat(cx - wh - 3, "\" y=\"").concat(wy - 2, "\" width=\"").concat((wh + 3) * 2, "\" height=\"7\" rx=\"3\" fill=\"").concat(dk, "\" stroke=\"").concat(INK, "\" stroke-width=\"1.8\"/>");
  if (o.belt) s += "<rect x=\"".concat(cx - wh - 3.5, "\" y=\"").concat(wy - 3, "\" width=\"").concat((wh + 3.5) * 2, "\" height=\"6\" rx=\"3\" fill=\"").concat(o.belt, "\"/><rect x=\"").concat(cx - 4, "\" y=\"").concat(wy - 3.5, "\" width=\"8\" height=\"7\" rx=\"2\" fill=\"").concat(shade(o.belt, 0.3), "\"/>");
  return s;
}
function skirtBase(b, o) {
  var cx = b.cx,
    wy = b.waistY,
    wh = b.waistHalf,
    hh = b.hipHalf;
  var c = o.c,
    dk = o.dk || shade(c, -0.16);
  var hw = wh + (hh - wh) * 0.5 + wh * o.flare + 6;
  var hemY = wy + o.len;
  var s = "<path d=\"M ".concat(cx - wh - 3, ",").concat(wy - 2, " L ").concat(cx - hw, ",").concat(hemY, " ").concat(o.hem === 'wave' ? waveEdge(cx - hw, cx + hw, hemY, o.waves || 5, o.amp || 5) : "L ".concat(cx + hw, ",").concat(hemY), " C ").concat(cx + hw, ",").concat(hemY - 10, " ").concat(cx + hw * 0.8, ",").concat(hemY - 26, " ").concat(cx + wh + 3, ",").concat(wy - 2, " Z\" ").concat(inked(c), "/>");
  s += "<rect x=\"".concat(cx - wh - 3, "\" y=\"").concat(wy - 3, "\" width=\"").concat((wh + 3) * 2, "\" height=\"8\" rx=\"3.5\" fill=\"").concat(dk, "\" stroke=\"").concat(INK, "\" stroke-width=\"1.8\"/>");
  if (o.pleats) {
    for (var i = 1; i <= 5; i++) {
      var t = i / 6;
      s += "<line x1=\"".concat(cx - wh * 0.85 + t * wh * 1.7, "\" y1=\"").concat(wy + 12, "\" x2=\"").concat(cx - hw * 0.88 + t * hw * 1.76, "\" y2=\"").concat(hemY - 4, "\" stroke=\"").concat(dk, "\" stroke-width=\"1.8\" opacity=\".45\"/>");
    }
  }
  if (o.plaid) {
    var c2 = o.plaid;
    for (var _i = 1; _i <= 4; _i++) {
      var _t = _i / 5;
      s += "<line x1=\"".concat(cx - wh * 0.8 + _t * wh * 1.6, "\" y1=\"").concat(wy + 10, "\" x2=\"").concat(cx - hw * 0.85 + _t * hw * 1.7, "\" y2=\"").concat(hemY - 3, "\" stroke=\"").concat(c2, "\" stroke-width=\"2.4\" opacity=\".65\"/>");
    }
    [0.3, 0.55, 0.8].forEach(function (t) {
      var y = wy + 10 + (hemY - wy - 10) * t;
      var hw2 = wh + (hw - wh) * t;
      s += "<line x1=\"".concat(cx - hw2 * 0.92, "\" y1=\"").concat(y, "\" x2=\"").concat(cx + hw2 * 0.92, "\" y2=\"").concat(y, "\" stroke=\"").concat(c2, "\" stroke-width=\"2.2\" opacity=\".6\"/>");
    });
  }
  if (o.layers) {
    // 蛋糕裙层叠
    [0.45, 0.72].forEach(function (t, i) {
      var y = wy + o.len * t,
        hw2 = wh + (hw - wh) * t;
      s += "<path d=\"M ".concat(cx - hw2 * 0.94, ",").concat(y, " ").concat(waveEdge(cx - hw2 * 0.94, cx + hw2 * 0.94, y, 6, 4), " \" fill=\"none\" stroke=\"").concat(shade(c, i ? -0.1 : 0.22), "\" stroke-width=\"3\" opacity=\".8\"/>");
    });
  }
  if (o.pocket) s += "<rect x=\"".concat(cx + hw * 0.25, "\" y=\"").concat(wy + o.len * 0.35, "\" width=\"14\" height=\"12\" rx=\"3\" fill=\"").concat(dk, "\" opacity=\".85\" stroke=\"").concat(INK, "\" stroke-width=\"1.4\"/>");
  return s;
}
function dressBase(b, o) {
  var cx = b.cx,
    wy = b.waistY,
    wh = b.waistHalf;
  var bc = o.bodiceC || o.c,
    sk = o.skirtC || o.c;
  var bdk = o.dk || shade(bc, -0.16),
    sdk = shade(sk, -0.14);
  var s = skirtBase(b, {
    c: sk,
    dk: sdk,
    len: o.len,
    flare: o.flare,
    hem: o.hem,
    waves: o.waves,
    amp: o.amp,
    layers: o.layers
  });
  s += topBase(b, {
    c: bc,
    dk: bdk,
    hemY: wy + 6,
    collar: o.collar || 'round',
    sleeve: o.sleeve || 'none'
  });
  if (o.wrap) {
    // 汉服交领
    var sy = b.shoulderY,
      neckW = b.neckW;
    s += "<path d=\"M ".concat(cx - neckW - 6, ",").concat(sy + 2, " L ").concat(cx + wh * 0.55, ",").concat(wy + 2, " L ").concat(cx + wh * 0.55, ",").concat(wy - 5, " L ").concat(cx - neckW - 6, ",").concat(sy - 4, " Z\" fill=\"").concat(o.wrap, "\" opacity=\".95\"/>") + "<path d=\"M ".concat(cx + neckW + 6, ",").concat(sy + 2, " L ").concat(cx - wh * 0.2, ",").concat(wy + 2, " L ").concat(cx - wh * 0.2, ",").concat(wy - 5, " L ").concat(cx + neckW + 6, ",").concat(sy - 4, " Z\" fill=\"").concat(o.wrap, "\"/>");
  }
  if (o.sash) {
    s += "<rect x=\"".concat(cx - wh - 4, "\" y=\"").concat(wy - 4, "\" width=\"").concat((wh + 4) * 2, "\" height=\"9\" rx=\"4\" fill=\"").concat(o.sash, "\"/>");
    if (o.bowKnot) s += bowSVG(cx + wh * 0.7, wy, 8, o.sash);
  }
  if (o.flowers) {
    (o.flowerPos || [[-0.4, 0.3], [0.35, 0.55], [-0.1, 0.8]]).forEach(function (_ref) {
      var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
        fx = _ref2[0],
        fy = _ref2[1];
      var fx2 = cx + fx * wh * 1.4,
        fy2 = wy + o.len * fy * 0.6 + 10;
      s += "<circle cx=\"".concat(fx2, "\" cy=\"").concat(fy2, "\" r=\"4.5\" fill=\"").concat(o.flowers, "\"/><circle cx=\"").concat(fx2, "\" cy=\"").concat(fy2, "\" r=\"1.8\" fill=\"").concat(shade(o.flowers, 0.45), "\"/>");
    });
  }
  if (o.seqDots) {
    for (var i = 0; i < 14; i++) {
      var t = i / 14,
        y = b.shoulderY + 20 + (wy + o.len * 0.8 - b.shoulderY - 20) * (i * 7 % 10) / 10;
      var hw2 = bodyHalfAt(b, Math.min(y, b.hipY)) + wh * 0.9 * t;
      var x = cx + (i * 13 % 20 / 10 - 1) * hw2 * 0.8;
      s += star5(x, y, 2.2, '#fff', 'opacity=".9"');
    }
  }
  if (o.slit) {
    var hemY = wy + o.len,
      x0 = cx + (wh + (b.hipHalf - wh) * 0.5 + wh * o.flare + 6) * 0.45;
    s += "<path d=\"M ".concat(x0, ",").concat(hemY, " L ").concat(x0 * 1.02 - cx * 0.02 + cx, ",").concat(hemY - o.len * 0.45, "\" stroke=\"").concat(INK, "\" stroke-width=\"3\" stroke-linecap=\"round\" opacity=\".5\"/>");
  }
  return s;
}
function bowSVG(x, y, s, c, dk) {
  dk = dk || shade(c, -0.2);
  return "<path d=\"M ".concat(x, ",").concat(y, " L ").concat(x - s * 1.7, ",").concat(y - s, " L ").concat(x - s * 1.5, ",").concat(y + s * 0.9, " Z\" fill=\"").concat(c, "\"/>") + "<path d=\"M ".concat(x, ",").concat(y, " L ").concat(x + s * 1.7, ",").concat(y - s, " L ").concat(x + s * 1.5, ",").concat(y + s * 0.9, " Z\" fill=\"").concat(c, "\"/>") + "<circle cx=\"".concat(x, "\" cy=\"").concat(y, "\" r=\"").concat(s * 0.42, "\" fill=\"").concat(dk, "\"/>");
}
function shoesBase(b, o) {
  var c = o.c,
    dk = shade(c, -0.22),
    sole = o.sole || '#f6f3f8';
  var s = '';
  [-1, 1].forEach(function (sd) {
    var x = footCX(b, sd),
      fy = b.footY,
      ay = b.ankleY,
      w = 14.5 * b.fs;
    if (o.type === 'sneaker' || o.type === 'canvas') {
      s += "<rect x=\"".concat(x - w, "\" y=\"").concat(fy - 8 * b.fs, "\" width=\"").concat(2 * w, "\" height=\"").concat(15 * b.fs, "\" rx=\"").concat(7 * b.fs, "\" ").concat(inked(c), "/>") + "<path d=\"M ".concat(x - w + 1.5, ",").concat(fy + 3 * b.fs, " L ").concat(x + w - 1.5, ",").concat(fy + 3 * b.fs, "\" stroke=\"").concat(sole, "\" stroke-width=\"").concat(3.5 * b.fs, "\" stroke-linecap=\"round\"/>");
      if (o.type === 'sneaker') s += "<path d=\"M ".concat(x + sd * w * 0.15, ",").concat(fy - 4 * b.fs, " L ").concat(x + sd * w * 0.72, ",").concat(fy - 4 * b.fs, " M ").concat(x + sd * w * 0.15, ",").concat(fy - 0.5 * b.fs, " L ").concat(x + sd * w * 0.72, ",").concat(fy - 0.5 * b.fs, "\" stroke=\"").concat(shade(c, -0.28), "\" stroke-width=\"1.5\" opacity=\".7\"/>");else s += "<rect x=\"".concat(x - w + 2, "\" y=\"").concat(fy - 2, "\" width=\"").concat(2 * w - 4, "\" height=\"2.8\" fill=\"").concat(o.accent || '#e86a6a', "\" opacity=\".9\"/>");
    } else if (o.type === 'leather') {
      s += "<ellipse cx=\"".concat(x + sd * 1.5, "\" cy=\"").concat(fy + 0.5, "\" rx=\"").concat(w, "\" ry=\"").concat(7.8 * b.fs, "\" ").concat(inked(c), "/>") + "<path d=\"M ".concat(x - w * 0.5, ",").concat(fy + 2, " Q ").concat(x + sd * 1.5, ",").concat(fy - 3.5 * b.fs, " ").concat(x + w * 0.45, ",").concat(fy + 1, "\" stroke=\"").concat(shade(c, 0.3), "\" stroke-width=\"1.6\" fill=\"none\"/>");
    } else if (o.type === 'boot') {
      var bw = w * 0.92,
        topY = ay - 34 * b.fs;
      s += "<path d=\"M ".concat(x - bw, ",").concat(fy + 7 * b.fs, " L ").concat(x - bw, ",").concat(topY + 6 * b.fs, " Q ").concat(x - bw, ",").concat(topY, " ").concat(x - bw + 7 * b.fs, ",").concat(topY, " L ").concat(x + bw - 7 * b.fs, ",").concat(topY, " Q ").concat(x + bw, ",").concat(topY, " ").concat(x + bw, ",").concat(topY + 6 * b.fs, " L ").concat(x + bw, ",").concat(fy + 7 * b.fs, " Z\" ").concat(inked(c), "/>") + "<rect x=\"".concat(x - bw + 1, "\" y=\"").concat(fy + 3 * b.fs, "\" width=\"").concat(2 * bw - 2, "\" height=\"").concat(4 * b.fs, "\" rx=\"2\" fill=\"").concat(sole, "\"/>") + "<rect x=\"".concat(x - 4.5 * b.fs, "\" y=\"").concat(ay - 22 * b.fs, "\" width=\"").concat(9 * b.fs, "\" height=\"").concat(3.5 * b.fs, "\" rx=\"1.8\" fill=\"").concat(shade(c, 0.35), "\"/>");
    } else if (o.type === 'sandal') {
      s += "<ellipse cx=\"".concat(x, "\" cy=\"").concat(fy + 3.5, "\" rx=\"").concat(w, "\" ry=\"").concat(5.5 * b.fs, "\" ").concat(inked(c), "/>") + "<path d=\"M ".concat(x - w * 0.6, ",").concat(fy + 2, " L ").concat(x + w * 0.55, ",").concat(fy - 3.5 * b.fs, " M ").concat(x - w * 0.6, ",").concat(fy - 3.5 * b.fs, " L ").concat(x + w * 0.55, ",").concat(fy + 2, "\" stroke=\"").concat(dk, "\" stroke-width=\"3\" stroke-linecap=\"round\"/>") + "<path d=\"M ".concat(x - w * 0.7, ",").concat(ay + 3, " Q ").concat(x, ",").concat(ay - 2, " ").concat(x + w * 0.7, ",").concat(ay + 3, "\" stroke=\"").concat(dk, "\" stroke-width=\"2.6\" fill=\"none\"/>");
    } else if (o.type === 'heels') {
      s += "<path d=\"M ".concat(x - w * 0.85, ",").concat(fy + 4.5, " Q ").concat(x - w * 0.2, ",").concat(fy - 7 * b.fs, " ").concat(x + w, ",").concat(fy - 2 * b.fs, " L ").concat(x + w * 0.95, ",").concat(fy + 3.5, " Q ").concat(x, ",").concat(fy + 6.5, " ").concat(x - w * 0.85, ",").concat(fy + 4.5, " Z\" ").concat(inked(c), "/>") + "<rect x=\"".concat(x + w * 0.45, "\" y=\"").concat(fy + 3, "\" width=\"").concat(4.2 * b.fs, "\" height=\"").concat(8 * b.fs, "\" rx=\"1.8\" fill=\"").concat(dk, "\"/>") + "<path d=\"M ".concat(x - w * 0.65, ",").concat(ay + 2.5, " Q ").concat(x, ",").concat(ay - 3.5, " ").concat(x + w * 0.65, ",").concat(ay + 2.5, "\" stroke=\"").concat(dk, "\" stroke-width=\"2.6\" fill=\"none\"/>") + "<path d=\"M ".concat(x - w * 0.6, ",").concat(fy - 2 * b.fs, " Q ").concat(x, ",").concat(fy - 6 * b.fs, " ").concat(x + w * 0.7, ",").concat(fy - 3 * b.fs, "\" stroke=\"").concat(shade(c, 0.4), "\" stroke-width=\"1.4\" fill=\"none\" opacity=\".8\"/>");
    }
  });
  return s;
}

/* ---------- 发型 ---------- */
function hairCap(b, c, opt) {
  opt = opt || {};
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry;
  var rx = hr * (opt.rx || 1.06),
    drop = opt.drop == null ? 0.12 : opt.drop;
  return "<path d=\"M ".concat(cx - rx, ",").concat(cy + hry * drop, "\n    C ").concat(cx - rx - 3, ",").concat(cy - hry * (opt.top || 1.16), " ").concat(cx + rx + 3, ",").concat(cy - hry * (opt.top || 1.16), " ").concat(cx + rx, ",").concat(cy + hry * drop, "\n    C ").concat(cx + rx * 0.55, ",").concat(cy - hry * 0.4, " ").concat(cx - rx * 0.55, ",").concat(cy - hry * 0.4, " ").concat(cx - rx, ",").concat(cy + hry * drop, " Z\" fill=\"").concat(c, "\" stroke=\"").concat(INK, "\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/>");
}
function sideLocks(b, c, len) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    dk = shade(c, -0.15);
  return [-1, 1].map(function (sd) {
    return "<path d=\"M ".concat(cx + sd * hr * 0.96, ",").concat(cy - 6, " Q ").concat(cx + sd * hr * 1.1, ",").concat(cy + len * 0.5, " ").concat(cx + sd * hr * 0.82, ",").concat(cy + len, " Q ").concat(cx + sd * hr * 0.7, ",").concat(cy + len * 0.4, " ").concat(cx + sd * hr * 0.8, ",").concat(cy - 8, " Z\" fill=\"").concat(c, "\" stroke=\"").concat(INK, "\" stroke-width=\"2\" stroke-linejoin=\"round\"/>") + "<path d=\"M ".concat(cx + sd * hr * 0.94, ",").concat(cy, " Q ").concat(cx + sd * hr * 1.0, ",").concat(cy + len * 0.45, " ").concat(cx + sd * hr * 0.85, ",").concat(cy + len * 0.8, "\" stroke=\"").concat(dk, "\" stroke-width=\"1.5\" fill=\"none\" opacity=\".6\"/>");
  }).join('');
}
var HAIRSTYLES = {
  short: {
    name: '清爽短发',
    back: function back(b, c) {
      return hairCap(b, c, {
        rx: 1.04
      });
    },
    front: function front(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry;
      return hairCap(b, c) + sideLocks(b, c, 26 * b.fs) + "<path d=\"M ".concat(cx - hr * 0.55, ",").concat(cy - hry * 0.42, " Q ").concat(cx - hr * 0.3, ",").concat(cy - hry * 0.1, " ").concat(cx - hr * 0.05, ",").concat(cy - hry * 0.4, "\" stroke=\"").concat(shade(c, -0.2), "\" stroke-width=\"1.6\" fill=\"none\" opacity=\".5\"/>");
    }
  },
  long: {
    name: '及腰长直发',
    back: function back(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry,
        fs = b.fs,
        y1 = b.waistY + 30 * fs;
      return "<path d=\"M ".concat(cx - hr * 1.06, ",").concat(cy + hry * 0.2, "\n        C ").concat(cx - hr * 1.16, ",").concat(cy - hry * 1.1, " ").concat(cx + hr * 1.16, ",").concat(cy - hry * 1.1, " ").concat(cx + hr * 1.06, ",").concat(cy + hry * 0.2, "\n        C ").concat(cx + hr * 1.14, ",").concat(cy + 55 * fs, " ").concat(cx + hr * 1.05, ",").concat(y1 - 38 * fs, " ").concat(cx + hr * 0.98, ",").concat(y1, "\n        L ").concat(cx - hr * 0.98, ",").concat(y1, "\n        C ").concat(cx - hr * 1.05, ",").concat(y1 - 38 * fs, " ").concat(cx - hr * 1.14, ",").concat(cy + 55 * fs, " ").concat(cx - hr * 1.06, ",").concat(cy + hry * 0.2, " Z\" fill=\"").concat(c, "\" stroke=\"").concat(INK, "\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/>");
    },
    front: function front(b, c) {
      return hairCap(b, c) + sideLocks(b, c, 84 * b.fs) + "<path d=\"M ".concat(b.cx - b.hr * 0.5, ",").concat(b.cy - b.hry * 0.45, " Q ").concat(b.cx, ",").concat(b.cy - b.hry * 0.12, " ").concat(b.cx + b.hr * 0.5, ",").concat(b.cy - b.hry * 0.45, "\" stroke=\"").concat(shade(c, -0.22), "\" stroke-width=\"1.8\" fill=\"none\" opacity=\".55\"/>");
    }
  },
  twin: {
    name: '双马尾',
    back: function back(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry,
        fs = b.fs,
        dk = shade(c, -0.15);
      var s = hairCap(b, c, {
        rx: 1.05
      });
      [-1, 1].forEach(function (sd) {
        var x0 = cx + sd * hr * 1.02,
          y0 = cy - hry * 0.35;
        s += "<path d=\"M ".concat(x0, ",").concat(y0, " C ").concat(x0 + sd * 34 * fs, ",").concat(y0 - 6, " ").concat(x0 + sd * 30 * fs, ",").concat(y0 + 46 * fs, " ").concat(x0 + sd * 16 * fs, ",").concat(y0 + 72 * fs, " C ").concat(x0 + sd * 6, ",").concat(y0 + 50 * fs, " ").concat(x0 - sd * 4, ",").concat(y0 + 22 * fs, " ").concat(x0, ",").concat(y0 - 4, " Z\" fill=\"").concat(c, "\" stroke=\"").concat(INK, "\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/>") + "<path d=\"M ".concat(x0 + sd * 8, ",").concat(y0 + 18 * fs, " Q ").concat(x0 + sd * 18 * fs, ",").concat(y0 + 36 * fs, " ").concat(x0 + sd * 12 * fs, ",").concat(y0 + 58 * fs, "\" stroke=\"").concat(dk, "\" stroke-width=\"1.6\" fill=\"none\" opacity=\".6\"/>") + "<circle cx=\"".concat(x0, "\" cy=\"").concat(y0 + 2, "\" r=\"5.5\" fill=\"").concat(shade(c, -0.3), "\"/>");
      });
      return s;
    },
    front: function front(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry;
      var s = hairCap(b, c);
      s += "<path d=\"M ".concat(cx - hr * 1.02, ",").concat(cy - hry * 0.28, " Q ").concat(cx - hr * 0.7, ",").concat(cy - hry * 0.02, " ").concat(cx - hr * 0.4, ",").concat(cy - hry * 0.24, " Q ").concat(cx - hr * 0.15, ",").concat(cy - hry * 0.04, " ").concat(cx + hr * 0.15, ",").concat(cy - hry * 0.24, " Q ").concat(cx + hr * 0.45, ",").concat(cy - hry * 0.03, " ").concat(cx + hr * 1.02, ",").concat(cy - hry * 0.28, " L ").concat(cx + hr * 1.02, ",").concat(cy - hry * 0.5, " Q ").concat(cx, ",").concat(cy - hry * 1.05, " ").concat(cx - hr * 1.02, ",").concat(cy - hry * 0.5, " Z\" fill=\"").concat(c, "\"/>");
      return s;
    }
  },
  pony: {
    name: '高马尾',
    back: function back(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry,
        fs = b.fs;
      var y0 = cy - hry * 0.98;
      return hairCap(b, c, {
        rx: 1.04
      }) + "<path d=\"M ".concat(cx, ",").concat(y0, " Q ").concat(cx + hr * 1.7, ",").concat(cy - hry * 0.5, " ").concat(cx + hr * 0.95, ",").concat(cy + 52 * fs, " Q ").concat(cx + hr * 0.7, ",").concat(cy + 20 * fs, " ").concat(cx, ",").concat(y0 + 4, " Z\" fill=\"").concat(c, "\" stroke=\"").concat(INK, "\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/>") + "<circle cx=\"".concat(cx + 2, "\" cy=\"").concat(y0 + 3, "\" r=\"6\" fill=\"").concat(shade(c, -0.3), "\"/>");
    },
    front: function front(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry;
      return hairCap(b, c, {
        drop: 0.05,
        top: 1.1
      }) + "<path d=\"M ".concat(cx - hr * 0.85, ",").concat(cy - hry * 0.36, " Q ").concat(cx - hr * 0.3, ",").concat(cy - hry * 0.06, " ").concat(cx + hr * 0.25, ",").concat(cy - hry * 0.3, "\" stroke=\"").concat(shade(c, -0.22), "\" stroke-width=\"1.6\" fill=\"none\" opacity=\".5\"/>");
    }
  },
  bob: {
    name: '波波头',
    back: function back(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry;
      return "<path d=\"M ".concat(cx - hr * 1.08, ",").concat(cy - hry * 0.1, "\n        C ").concat(cx - hr * 1.18, ",").concat(cy - hry * 1.12, " ").concat(cx + hr * 1.18, ",").concat(cy - hry * 1.12, " ").concat(cx + hr * 1.08, ",").concat(cy - hry * 0.1, "\n        C ").concat(cx + hr * 1.12, ",").concat(cy + hry * 0.75, " ").concat(cx + hr * 0.9, ",").concat(cy + hry * 0.82, " ").concat(cx + hr * 0.6, ",").concat(cy + hry * 0.78, "\n        Q ").concat(cx, ",").concat(cy + hry * 0.95, " ").concat(cx - hr * 0.6, ",").concat(cy + hry * 0.78, "\n        C ").concat(cx - hr * 0.9, ",").concat(cy + hry * 0.82, " ").concat(cx - hr * 1.12, ",").concat(cy + hry * 0.75, " ").concat(cx - hr * 1.08, ",").concat(cy - hry * 0.1, " Z\" fill=\"").concat(c, "\" stroke=\"").concat(INK, "\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/>");
    },
    front: function front(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry;
      return hairCap(b, c, {
        drop: 0.16
      }) + "<path d=\"M ".concat(cx - hr, ",").concat(cy - hry * 0.3, " Q ").concat(cx - hr * 0.55, ",").concat(cy - hry * 0.05, " ").concat(cx - hr * 0.1, ",").concat(cy - hry * 0.28, " Q ").concat(cx + hr * 0.35, ",").concat(cy - hry * 0.04, " ").concat(cx + hr, ",").concat(cy - hry * 0.3, " L ").concat(cx + hr, ",").concat(cy - hry * 0.55, " Q ").concat(cx, ",").concat(cy - hry * 1.0, " ").concat(cx - hr, ",").concat(cy - hry * 0.55, " Z\" fill=\"").concat(shade(c, 0.07), "\"/>");
    }
  },
  curly: {
    name: '蓬蓬短卷',
    back: function back(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry;
      var s = "<ellipse cx=\"".concat(cx, "\" cy=\"").concat(cy - hry * 0.3, "\" rx=\"").concat(hr * 1.18, "\" ry=\"").concat(hry * 0.95, "\" fill=\"").concat(shade(c, -0.12), "\"/>");
      var pts = [[-1.05, -0.55], [-0.75, -0.95], [-0.3, -1.12], [0.25, -1.12], [0.72, -0.95], [1.05, -0.55], [-1.14, -0.1], [1.14, -0.1]];
      pts.forEach(function (_ref3, i) {
        var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
          px = _ref4[0],
          py = _ref4[1];
        s += "<circle cx=\"".concat(cx + px * hr, "\" cy=\"").concat(cy + py * hry, "\" r=\"").concat((11 + i % 3 * 2.5) * b.fs, "\" fill=\"").concat(i % 2 ? c : shade(c, 0.1), "\"/>");
      });
      return s;
    },
    front: function front(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry;
      var s = hairCap(b, c, {
        drop: 0.05
      });
      [[-0.8, -0.5], [-0.3, -0.72], [0.3, -0.7], [0.8, -0.48]].forEach(function (_ref5, i) {
        var _ref6 = (0, _slicedToArray2.default)(_ref5, 2),
          px = _ref6[0],
          py = _ref6[1];
        s += "<circle cx=\"".concat(cx + px * hr, "\" cy=\"").concat(cy + py * hry, "\" r=\"").concat(10 * b.fs, "\" fill=\"").concat(c, "\"/>");
      });
      return s;
    }
  },
  bun: {
    name: '优雅丸子头',
    back: function back(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry;
      var y0 = cy - hry * 1.08;
      return hairCap(b, c, {
        rx: 1.04,
        drop: 0.04
      }) + "<circle cx=\"".concat(cx, "\" cy=\"").concat(y0 - 8, "\" r=\"").concat(15 * b.fs, "\" fill=\"").concat(c, "\"/>") + "<path d=\"M ".concat(cx - 10 * b.fs, ",").concat(y0 - 12, " Q ").concat(cx, ",").concat(y0 - 20, " ").concat(cx + 10 * b.fs, ",").concat(y0 - 12, "\" stroke=\"").concat(shade(c, -0.2), "\" stroke-width=\"2\" fill=\"none\" opacity=\".6\"/>") + "<circle cx=\"".concat(cx, "\" cy=\"").concat(cy - hry * 0.98, "\" r=\"5.5\" fill=\"").concat(shade(c, -0.3), "\"/>");
    },
    front: function front(b, c) {
      return hairCap(b, c, {
        drop: 0.03,
        top: 1.12
      });
    }
  },
  buzz: {
    name: '利落寸头',
    back: function back(b, c) {
      return '';
    },
    front: function front(b, c) {
      return hairCap(b, c, {
        drop: -0.1,
        top: 1.02,
        rx: 1.01
      });
    }
  },
  spiky: {
    name: '炫酷刺猬',
    back: function back(b, c) {
      return '';
    },
    front: function front(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry;
      var s = hairCap(b, c, {
        drop: -0.06,
        top: 1.0
      });
      var peaks = [[-0.9, -0.75, -0.55, -1.25], [-0.45, -0.95, -0.1, -1.5], [0.15, -1.0, 0.5, -1.45], [0.6, -0.85, 0.95, -1.2]];
      peaks.forEach(function (_ref7) {
        var _ref8 = (0, _slicedToArray2.default)(_ref7, 4),
          x0 = _ref8[0],
          y0 = _ref8[1],
          x1 = _ref8[2],
          y1 = _ref8[3];
        s += "<path d=\"M ".concat(cx + x0 * hr, ",").concat(cy + y0 * hry, " L ").concat(cx + x1 * hr, ",").concat(cy + y1 * hry, " L ").concat(cx + (x1 + 0.18) * hr, ",").concat(cy + (y0 + 0.05) * hry, " Z\" fill=\"").concat(c, "\"/>");
      });
      return s;
    }
  },
  wavy: {
    name: '浪漫长卷发',
    back: function back(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry,
        fs = b.fs,
        y1 = b.waistY + 36 * fs;
      var s = "<path d=\"M ".concat(cx - hr * 1.1, ",").concat(cy + hry * 0.15, "\n        C ").concat(cx - hr * 1.22, ",").concat(cy - hry * 1.08, " ").concat(cx + hr * 1.22, ",").concat(cy - hry * 1.08, " ").concat(cx + hr * 1.1, ",").concat(cy + hry * 0.15, "\n        C ").concat(cx + hr * 1.2, ",").concat(cy + 62 * fs, " ").concat(cx + hr * 1.12, ",").concat(y1 - 42 * fs, " ").concat(cx + hr * 1.0, ",").concat(y1, "\n        ").concat(waveEdge(cx + hr * 1.0, cx - hr * 1.0, y1, 4, 7), "\n        C ").concat(cx - hr * 1.12, ",").concat(y1 - 42 * fs, " ").concat(cx - hr * 1.2, ",").concat(cy + 62 * fs, " ").concat(cx - hr * 1.1, ",").concat(cy + hry * 0.15, " Z\" fill=\"").concat(c, "\" stroke=\"").concat(INK, "\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/>");
      [[-1.02, 0.35], [-0.98, 0.75], [1.02, 0.35], [0.98, 0.75]].forEach(function (_ref9, i) {
        var _ref10 = (0, _slicedToArray2.default)(_ref9, 2),
          px = _ref10[0],
          py = _ref10[1];
        s += "<circle cx=\"".concat(cx + px * hr, "\" cy=\"").concat(cy + hry * py + 52 * fs, "\" r=\"").concat(13 * b.fs, "\" fill=\"").concat(i % 2 ? shade(c, 0.08) : c, "\"/>");
      });
      return s;
    },
    front: function front(b, c) {
      return hairCap(b, c) + sideLocks(b, c, 70 * b.fs);
    }
  },
  braid: {
    name: '麻花辫',
    back: function back(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry;
      var s = hairCap(b, c, {
        rx: 1.05
      });
      [-1, 1].forEach(function (sd) {
        var x = cx + sd * (hr * 1.0 + 4);
        for (var i = 0; i < 5; i++) {
          var r = (8.5 - i * 0.9) * b.fs,
            y = cy + 8 + i * 13 * b.fs;
          s += "<circle cx=\"".concat(x + (i % 2 ? 2 : -2) * sd, "\" cy=\"").concat(y, "\" r=\"").concat(r, "\" fill=\"").concat(i % 2 ? c : shade(c, 0.09), "\"/>");
        }
        s += "<path d=\"M ".concat(x, ",").concat(cy + 8 + 5 * 13 * b.fs - 6, " L ").concat(x + 3 * sd, ",").concat(cy + 8 + 5 * 13 * b.fs + 8, "\" stroke=\"").concat(c, "\" stroke-width=\"3\" stroke-linecap=\"round\"/>") + "<circle cx=\"".concat(x, "\" cy=\"").concat(cy + 2, "\" r=\"4\" fill=\"").concat(shade(c, -0.3), "\"/>");
      });
      return s;
    },
    front: function front(b, c) {
      var cx = b.cx,
        cy = b.cy,
        hr = b.hr,
        hry = b.hry;
      return hairCap(b, c, {
        drop: 0.1
      }) + "<path d=\"M ".concat(cx - hr * 0.06, ",").concat(cy - hry * 1.05, " L ").concat(cx - hr * 0.06, ",").concat(cy - hry * 0.4, "\" stroke=\"").concat(shade(c, -0.3), "\" stroke-width=\"2\" opacity=\".7\"/>");
    }
  }
};

/* ---------- 物品定义 ---------- */
exports.HAIRSTYLES = HAIRSTYLES;
var ITEMS = [];
exports.ITEMS = ITEMS;
function I(id, cat, name, tags, colors, draw) {
  ITEMS.push({
    id: id,
    cat: cat,
    name: name,
    tags: tags,
    colors: colors,
    draw: draw
  });
}

/* 上衣 6 */
I('t1', 'top', '纯白T恤', ['casual', 'basic'], ['#f6f6f8'], function (b) {
  return topBase(b, {
    c: '#f6f6f8',
    sleeve: 'short',
    collar: 'round',
    hemLine: 1
  });
});
I('t2', 'top', '海洋蓝衬衫', ['casual', 'fresh'], ['#7fb2e8'], function (b) {
  return topBase(b, {
    c: '#7fb2e8',
    sleeve: 'long',
    collar: 'v',
    buttons: 1,
    hemLine: 1
  });
});
I('t3', 'top', '奶黄连帽卫衣', ['casual', 'cute'], ['#ffd76e'], function (b) {
  return topBase(b, {
    c: '#ffd76e',
    sleeve: 'long',
    collar: 'round',
    hood: 1,
    pocket: 1
  });
});
I('t4', 'top', '薄荷运动背心', ['sporty', 'cool'], ['#7de8c8'], function (b) {
  return topBase(b, {
    c: '#7de8c8',
    sleeve: 'none',
    collar: 'v',
    hemY: b.waistY + 4,
    hemLine: 1
  });
});
I('t5', 'top', '樱花粉吊带', ['sweet', 'cute'], ['#ff9dbf'], function (b) {
  return topBase(b, {
    c: '#ff9dbf',
    sleeve: 'strap',
    collar: 'round',
    hemY: b.waistY + 2,
    hemLine: 1
  });
});
I('t6', 'top', '海军风条纹衫', ['casual', 'sea'], ['#4a6fa8', '#f6f6f8'], function (b) {
  return topBase(b, {
    c: '#4a6fa8',
    sleeve: 'short',
    collar: 'round',
    stripes: '#f6f6f8'
  });
});

/* 下装 6 */
I('p1', 'bottom', '经典牛仔裤', ['casual', 'basic'], ['#5b84c4'], function (b) {
  return pantsBase(b, {
    c: '#5b84c4',
    cuffs: 1
  });
});
I('p2', 'bottom', '卡其短裤', ['casual', 'sporty'], ['#d8b06e'], function (b) {
  return pantsBase(b, {
    c: '#d8b06e',
    len: 'short'
  });
});
I('p3', 'bottom', '黑色运动裤', ['sporty', 'cool'], ['#3a3a44'], function (b) {
  return pantsBase(b, {
    c: '#3a3a44',
    slim: 1,
    belt: '#e86a6a'
  });
});
I('p4', 'bottom', '工装多袋裤', ['cool', 'casual'], ['#8a9a6a'], function (b) {
  return pantsBase(b, {
    c: '#8a9a6a',
    cargoPockets: 1
  });
});
I('p5', 'bottom', '蜜桃运动裤', ['cute', 'sporty'], ['#f0a8c0'], function (b) {
  return pantsBase(b, {
    c: '#f0a8c0',
    cuffs: 1
  });
});
I('p6', 'bottom', '牛仔热裤', ['cool', 'sea'], ['#6f92cf'], function (b) {
  return pantsBase(b, {
    c: '#6f92cf',
    len: 'short',
    cuffs: 1
  });
});

/* 裙子 5 */
I('s1', 'skirt', '学院百褶裙', ['campus', 'sweet'], ['#a8c8f0'], function (b) {
  return skirtBase(b, {
    c: '#a8c8f0',
    len: 58,
    flare: 0.5,
    pleats: 1
  });
});
I('s2', 'skirt', '绯红A字裙', ['sweet', 'formal'], ['#e86a6a'], function (b) {
  return skirtBase(b, {
    c: '#e86a6a',
    len: 50,
    flare: 0.62
  });
});
I('s3', 'skirt', '莓果格纹裙', ['campus', 'cool'], ['#c46a8a'], function (b) {
  return skirtBase(b, {
    c: '#c46a8a',
    len: 60,
    flare: 0.55,
    plaid: 'rgba(255,240,244,.75)'
  });
});
I('s4', 'skirt', '云朵蛋糕裙', ['cute', 'princess'], ['#ffd0e8'], function (b) {
  return skirtBase(b, {
    c: '#ffd0e8',
    len: 66,
    flare: 1.05,
    hem: 'wave',
    amp: 7,
    layers: 1
  });
});
I('s5', 'skirt', '丹宁牛仔裙', ['casual', 'cool'], ['#6f92cf'], function (b) {
  return skirtBase(b, {
    c: '#6f92cf',
    len: 46,
    flare: 0.4,
    pocket: 1
  });
});

/* 连衣裙 / 套装 7 */
I('d1', 'dress', '碎花沙滩裙', ['sweet', 'fresh'], ['#ffe8f0', '#ff8fb0'], function (b) {
  return dressBase(b, {
    bodiceC: '#fff0f5',
    skirtC: '#ffe8f0',
    dk: '#f3b8cc',
    len: 96,
    flare: 0.9,
    sleeve: 'strap',
    collar: 'v',
    flowers: '#ff8fb0',
    hem: 'wave',
    amp: 5
  });
});
I('d2', 'dress', '草莓公主裙', ['princess', 'sweet'], ['#f8b8d8', '#ff7eb6'], function (b) {
  return dressBase(b, {
    bodiceC: '#f8b8d8',
    skirtC: '#f8c8e0',
    len: 118,
    flare: 1.35,
    sleeve: 'puff',
    sash: '#ff7eb6',
    bowKnot: 1,
    hem: 'wave',
    amp: 8,
    waves: 7,
    layers: 1
  });
});
I('d3', 'dress', '星夜晚礼服', ['formal', 'elegant'], ['#4a3f78'], function (b) {
  return dressBase(b, {
    c: '#4a3f78',
    dk: '#372e5e',
    len: 128,
    flare: 1.1,
    sleeve: 'none',
    collar: 'v',
    seqDots: 1,
    slit: 1
  });
});
I('d4', 'dress', '云锦汉服', ['classic', 'elegant'], ['#f0e0d0', '#c85a6a'], function (b) {
  return dressBase(b, {
    bodiceC: '#f0e0d0',
    skirtC: '#c85a6a',
    len: 120,
    flare: 1.15,
    sleeve: 'wide',
    collar: 'v',
    wrap: '#a83a48',
    sash: '#e8d5b0'
  });
});
I('d5', 'dress', '赫本小黑裙', ['formal', 'cool'], ['#2e2e38'], function (b) {
  return dressBase(b, {
    c: '#2e2e38',
    dk: '#211f28',
    len: 78,
    flare: 0.72,
    sleeve: 'none',
    collar: 'round',
    sash: '#2e2e38'
  });
});
I('d6', 'dress', '鎏金亮片裙', ['party', 'stage'], ['#ffd76e', '#ff9d6e'], function (b) {
  return "<defs><linearGradient id=\"gseq\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ffd76e\"/><stop offset=\".55\" stop-color=\"#ffab6e\"/><stop offset=\"1\" stop-color=\"#ff7eb6\"/></linearGradient></defs>" + dressBase(b, {
    bodiceC: 'url(#gseq)',
    skirtC: 'url(#gseq)',
    dk: '#e88a4a',
    len: 92,
    flare: 0.95,
    sleeve: 'none',
    collar: 'round',
    seqDots: 1
  });
});
I('d7', 'dress', '星光小礼服套装', ['formal', 'cool'], ['#3d3d6e', '#e86a6a'], function (b) {
  return pantsBase(b, {
    c: '#3d3d6e',
    slim: 1
  }) + topBase(b, {
    c: '#3d3d6e',
    dk: '#2c2c52',
    sleeve: 'long',
    collar: 'v',
    hemY: b.hipY + 6,
    buttons: 1
  }) + "<path d=\"M ".concat(b.cx - b.neckW - 6, ",").concat(b.shoulderY + 1, " L ").concat(b.cx - 2, ",").concat(b.shoulderY + 34, " L ").concat(b.cx - b.neckW - 10, ",").concat(b.shoulderY + 30, " Z\" fill=\"#2c2c52\"/>") + "<path d=\"M ".concat(b.cx + b.neckW + 6, ",").concat(b.shoulderY + 1, " L ").concat(b.cx + 2, ",").concat(b.shoulderY + 34, " L ").concat(b.cx + b.neckW + 10, ",").concat(b.shoulderY + 30, " Z\" fill=\"#2c2c52\"/>") + bowSVG(b.cx, b.shoulderY + 7, 6.5, '#e86a6a');
});

/* 鞋子 6 */
I('sh1', 'shoes', '元气小白鞋', ['sporty', 'casual'], ['#f6f6f8'], function (b) {
  return shoesBase(b, {
    type: 'sneaker',
    c: '#f6f6f8',
    accent: '#a78bfa'
  });
});
I('sh2', 'shoes', '绅士小皮鞋', ['formal', 'basic'], ['#4a3b30'], function (b) {
  return shoesBase(b, {
    type: 'leather',
    c: '#4a3b30'
  });
});
I('sh3', 'shoes', '帅气马丁靴', ['cool', 'casual'], ['#6a4a38'], function (b) {
  return shoesBase(b, {
    type: 'boot',
    c: '#6a4a38'
  });
});
I('sh4', 'shoes', '夏日凉鞋', ['fresh', 'casual'], ['#c98a3d'], function (b) {
  return shoesBase(b, {
    type: 'sandal',
    c: '#c98a3d'
  });
});
I('sh5', 'shoes', '樱桃高跟鞋', ['elegant', 'formal'], ['#d84a5a'], function (b) {
  return shoesBase(b, {
    type: 'heels',
    c: '#d84a5a'
  });
});
I('sh6', 'shoes', '复古帆布鞋', ['campus', 'casual'], ['#e84a5a'], function (b) {
  return shoesBase(b, {
    type: 'canvas',
    c: '#e84a5a',
    accent: '#fff'
  });
});

/* 帽子 6 */
I('h1', 'hat', '绯红棒球帽', ['sporty', 'casual'], ['#e86a6a'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry;
  return "<path d=\"M ".concat(cx - hr * 1.04, ",").concat(cy - hry * 0.3, " A ").concat(hr * 1.04, " ").concat(hry * 0.98, " 0 0 1 ").concat(cx + hr * 1.04, ",").concat(cy - hry * 0.3, " Z\" fill=\"#e86a6a\" stroke=\"").concat(INK, "\" stroke-width=\"2.2\"/>") + "<path d=\"M ".concat(cx - hr * 1.12, ",").concat(cy - hry * 0.3, " Q ").concat(cx, ",").concat(cy - hry * 0.14, " ").concat(cx + hr * 1.12, ",").concat(cy - hry * 0.3, " L ").concat(cx + hr * 1.12, ",").concat(cy - hry * 0.4, " Q ").concat(cx, ",").concat(cy - hry * 0.24, " ").concat(cx - hr * 1.12, ",").concat(cy - hry * 0.4, " Z\" fill=\"#c85050\" stroke=\"").concat(INK, "\" stroke-width=\"2\"/>") + "<circle cx=\"".concat(cx, "\" cy=\"").concat(cy - hry * 1.02, "\" r=\"4\" fill=\"#c85050\"/>") + "<path d=\"M ".concat(cx, ",").concat(cy - hry * 1.25, " L ").concat(cx, ",").concat(cy - hry * 0.35, "\" stroke=\"#d85a5a\" stroke-width=\"2\" opacity=\".5\"/>");
});
I('h2', 'hat', '薄荷毛线帽', ['cute', 'casual'], ['#7de8c8'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry;
  return "<path d=\"M ".concat(cx - hr * 1.05, ",").concat(cy - hry * 0.22, " A ").concat(hr * 1.05, " ").concat(hry * 1.02, " 0 0 1 ").concat(cx + hr * 1.05, ",").concat(cy - hry * 0.22, " Z\" fill=\"#7de8c8\" stroke=\"").concat(INK, "\" stroke-width=\"2.2\"/>") + "<path d=\"M ".concat(cx - hr * 1.1, ",").concat(cy - hry * 0.26, " Q ").concat(cx, ",").concat(cy - hry * 0.08, " ").concat(cx + hr * 1.1, ",").concat(cy - hry * 0.26, " L ").concat(cx + hr * 1.1, ",").concat(cy - hry * 0.44, " Q ").concat(cx, ",").concat(cy - hry * 0.26, " ").concat(cx - hr * 1.1, ",").concat(cy - hry * 0.44, " Z\" fill=\"#5ec9a8\" stroke=\"").concat(INK, "\" stroke-width=\"2\"/>") + "<circle cx=\"".concat(cx, "\" cy=\"").concat(cy - hry * 1.28, "\" r=\"").concat(9 * b.fs, "\" fill=\"#a8f0dc\" stroke=\"").concat(INK, "\" stroke-width=\"2\"/>");
});
I('h3', 'hat', '魔术师礼帽', ['formal', 'cool'], ['#2a2a34'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry,
    y0 = cy - hry * 0.62;
  return "<ellipse cx=\"".concat(cx, "\" cy=\"").concat(y0, "\" rx=\"").concat(hr * 1.4, "\" ry=\"").concat(9 * b.fs, "\" fill=\"#1c1c24\" stroke=\"").concat(INK, "\" stroke-width=\"2\"/>") + "<rect x=\"".concat(cx - hr * 0.85, "\" y=\"").concat(y0 - 50 * b.fs, "\" width=\"").concat(hr * 1.7, "\" height=\"").concat(50 * b.fs, "\" rx=\"").concat(7 * b.fs, "\" fill=\"#2a2a34\" stroke=\"").concat(INK, "\" stroke-width=\"2\"/>") + "<rect x=\"".concat(cx - hr * 0.85, "\" y=\"").concat(y0 - 16 * b.fs, "\" width=\"").concat(hr * 1.7, "\" height=\"").concat(9 * b.fs, "\" fill=\"#d84a5a\"/>") + "<ellipse cx=\"".concat(cx, "\" cy=\"").concat(y0 - 50 * b.fs, "\" rx=\"").concat(hr * 0.85, "\" ry=\"").concat(5 * b.fs, "\" fill=\"#3a3a46\"/>");
});
I('h4', 'hat', '艺术家贝雷帽', ['elegant', 'cute'], ['#ff9dbf'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry,
    y0 = cy - hry * 0.88;
  return "<g transform=\"rotate(-9 ".concat(cx, " ").concat(y0, ")\">") + "<ellipse cx=\"".concat(cx - hr * 0.08, "\" cy=\"").concat(y0, "\" rx=\"").concat(hr * 0.98, "\" ry=\"").concat(17 * b.fs, "\" fill=\"#ff9dbf\" stroke=\"").concat(INK, "\" stroke-width=\"2.2\"/>") + "<ellipse cx=\"".concat(cx - hr * 0.08, "\" cy=\"").concat(y0 - 4, "\" rx=\"").concat(hr * 0.8, "\" ry=\"").concat(11 * b.fs, "\" fill=\"#ffb3cd\"/>") + "<circle cx=\"".concat(cx - hr * 0.08, "\" cy=\"").concat(y0 - 15 * b.fs, "\" r=\"4.5\" fill=\"#e87a9f\"/></g>") + "<path d=\"M ".concat(cx - hr * 0.9, ",").concat(cy - hry * 0.66, " Q ").concat(cx, ",").concat(cy - hry * 0.5, " ").concat(cx + hr * 0.9, ",").concat(cy - hry * 0.66, "\" stroke=\"#e87a9f\" stroke-width=\"3\" fill=\"none\"/>");
});
I('h5', 'hat', '黄色头巾帽', ['fresh', 'cute'], ['#ffd76e'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry;
  return "<path d=\"M ".concat(cx - hr * 1.05, ",").concat(cy - hry * 0.2, " A ").concat(hr * 1.05, " ").concat(hry * 1.0, " 0 0 1 ").concat(cx + hr * 1.05, ",").concat(cy - hry * 0.2, " Q ").concat(cx, ",").concat(cy - hry * 0.02, " ").concat(cx - hr * 1.05, ",").concat(cy - hry * 0.2, " Z\" fill=\"#ffd76e\" stroke=\"").concat(INK, "\" stroke-width=\"2.2\"/>") + "<path d=\"M ".concat(cx - hr * 1.08, ",").concat(cy - hry * 0.24, " Q ").concat(cx, ",").concat(cy - hry * 0.05, " ").concat(cx + hr * 1.08, ",").concat(cy - hry * 0.24, "\" stroke=\"#e8b84a\" stroke-width=\"4\" fill=\"none\"/>") + "<circle cx=\"".concat(cx + hr * 1.02, "\" cy=\"").concat(cy - hry * 0.42, "\" r=\"").concat(7 * b.fs, "\" fill=\"#ffd76e\" stroke=\"").concat(INK, "\" stroke-width=\"2\"/>") + "<path d=\"M ".concat(cx + hr * 1.02, ",").concat(cy - hry * 0.42, " q 12,2 16,12 M ").concat(cx + hr * 1.02, ",").concat(cy - hry * 0.42, " q 14,8 12,18\" stroke=\"#e8b84a\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\"/>");
});
I('h6', 'hat', '海边草编帽', ['fresh', 'sea'], ['#e8c46a'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry,
    y0 = cy - hry * 0.55;
  return "<ellipse cx=\"".concat(cx, "\" cy=\"").concat(y0, "\" rx=\"").concat(hr * 1.75, "\" ry=\"").concat(13 * b.fs, "\" fill=\"#e8c46a\" stroke=\"").concat(INK, "\" stroke-width=\"2.2\"/>") + "<ellipse cx=\"".concat(cx, "\" cy=\"").concat(y0 - 3, "\" rx=\"").concat(hr * 1.75, "\" ry=\"").concat(10 * b.fs, "\" fill=\"#f4d488\"/>") + "<path d=\"M ".concat(cx - hr * 0.9, ",").concat(y0, " A ").concat(hr * 0.9, " ").concat(hry * 0.72, " 0 0 1 ").concat(cx + hr * 0.9, ",").concat(y0, " Z\" fill=\"#eecf78\" stroke=\"").concat(INK, "\" stroke-width=\"2\"/>") + "<path d=\"M ".concat(cx - hr * 0.92, ",").concat(y0 - 2, " Q ").concat(cx, ",").concat(y0 - 12, " ").concat(cx + hr * 0.92, ",").concat(y0 - 2, "\" stroke=\"#d84a5a\" stroke-width=\"6\" fill=\"none\"/>");
});

/* 头饰 5 */
I('hw1', 'headwear', '蝴蝶结发饰', ['cute', 'sweet'], ['#ff7eb6'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry;
  return bowSVG(cx + hr * 0.74, cy - hry * 0.6, 9 * b.fs, '#ff7eb6');
});
I('hw2', 'headwear', '花仙花环', ['fresh', 'princess'], ['#ff8fb0'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry;
  var cols = ['#ff8fb0', '#ffd76e', '#a78bfa', '#7dd8ff'];
  var s = '';
  for (var i = 0; i < 7; i++) {
    var a = Math.PI + i / 6 * Math.PI;
    var x = cx + Math.cos(a) * hr * 1.02,
      y = cy + Math.sin(a) * hry * 0.95;
    s += "<ellipse cx=\"".concat((x + cx) / 2, "\" cy=\"").concat(y - 7, "\" rx=\"3\" ry=\"5\" fill=\"#7dc9a0\" transform=\"rotate(").concat((i - 3) * 26, " ").concat((x + cx) / 2, " ").concat(y - 7, ")\"/>") + "<circle cx=\"".concat(x, "\" cy=\"").concat(y, "\" r=\"").concat(6.5 * b.fs, "\" fill=\"").concat(cols[i % 4], "\"/>") + "<circle cx=\"".concat(x, "\" cy=\"").concat(y, "\" r=\"").concat(2.6 * b.fs, "\" fill=\"#fff\" opacity=\".85\"/>");
  }
  return s;
});
I('hw3', 'headwear', '圆框眼镜', ['cool', 'basic'], ['#3a3a44'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry,
    fs = b.fs,
    ex = 14.5 * fs,
    ey = cy + 5 * fs;
  return "<circle cx=\"".concat(cx - ex, "\" cy=\"").concat(ey, "\" r=\"").concat(10.5 * fs, "\" fill=\"rgba(190,225,255,.2)\" stroke=\"#3a3a44\" stroke-width=\"").concat(2.4 * fs, "\"/>") + "<circle cx=\"".concat(cx + ex, "\" cy=\"").concat(ey, "\" r=\"").concat(10.5 * fs, "\" fill=\"rgba(190,225,255,.2)\" stroke=\"#3a3a44\" stroke-width=\"").concat(2.4 * fs, "\"/>") + "<path d=\"M ".concat(cx - ex + 10.5 * fs, ",").concat(ey, " Q ").concat(cx, ",").concat(ey - 3 * fs, " ").concat(cx + ex - 10.5 * fs, ",").concat(ey, "\" stroke=\"#3a3a44\" stroke-width=\"").concat(2.2 * fs, "\" fill=\"none\"/>") + "<path d=\"M ".concat(cx - ex - 10.5 * fs, ",").concat(ey, " L ").concat(cx - hr * 0.98, ",").concat(ey - 1, " M ").concat(cx + ex + 10.5 * fs, ",").concat(ey, " L ").concat(cx + hr * 0.98, ",").concat(ey - 1, "\" stroke=\"#3a3a44\" stroke-width=\"").concat(2.2 * fs, "\"/>");
});
I('hw4', 'headwear', '喵喵猫耳', ['cute', 'cool'], ['#4a4a58'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry;
  return [-1, 1].map(function (sd) {
    var x = cx + sd * hr * 0.6,
      y = cy - hry * 0.82;
    return "<path d=\"M ".concat(x - 9 * b.fs, ",").concat(y + 8, " L ").concat(x + sd * 4, ",").concat(y - 20 * b.fs, " L ").concat(x + 11 * b.fs, ",").concat(y + 6, " Z\" fill=\"#4a4a58\"/>") + "<path d=\"M ".concat(x - 4 * b.fs, ",").concat(y + 5, " L ").concat(x + sd * 3, ",").concat(y - 12 * b.fs, " L ").concat(x + 7 * b.fs, ",").concat(y + 3, " Z\" fill=\"#ff9dbf\"/>");
  }).join('');
});
I('hw5', 'headwear', '星空耳机', ['cool', 'sporty'], ['#2e2e3e'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry,
    fs = b.fs;
  return "<path d=\"M ".concat(cx - hr * 1.08, ",").concat(cy + 4 * fs, " A ").concat(hr * 1.08, " ").concat(hry * 1.06, " 0 0 1 ").concat(cx + hr * 1.08, ",").concat(cy + 4 * fs, "\" stroke=\"#2e2e3e\" stroke-width=\"").concat(6 * fs, "\" fill=\"none\"/>") + [-1, 1].map(function (sd) {
    return "<rect x=\"".concat(cx + sd * hr * 1.08 - 6 * fs, "\" y=\"").concat(cy - 4 * fs, "\" width=\"").concat(12 * fs, "\" height=\"").concat(24 * fs, "\" rx=\"").concat(6 * fs, "\" fill=\"#2e2e3e\"/>") + "<rect x=\"".concat(cx + sd * hr * 1.08 - 3.5 * fs, "\" y=\"").concat(cy - 1 * fs, "\" width=\"").concat(7 * fs, "\" height=\"").concat(18 * fs, "\" rx=\"").concat(3.5 * fs, "\" fill=\"#a78bfa\"/>");
  }).join('');
});

/* 耳饰 5 */
I('e1', 'earrings', '珍珠耳钉', ['elegant', 'basic'], ['#fdf6ee'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry;
  return [-1, 1].map(function (sd) {
    return "<circle cx=\"".concat(cx + sd * hr * 1.04, "\" cy=\"").concat(cy + hry * 0.42, "\" r=\"").concat(3.6 * b.fs, "\" fill=\"#fdf6ee\" stroke=\"#e3d5c5\" stroke-width=\".8\"/><circle cx=\"").concat(cx + sd * hr * 1.04 - 1, "\" cy=\"").concat(cy + hry * 0.42 - 1.2, "\" r=\"1\" fill=\"#fff\"/>");
  }).join('');
});
I('e2', 'earrings', '金圈耳环', ['cool', 'party'], ['#ffd76e'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry;
  return [-1, 1].map(function (sd) {
    return "<circle cx=\"".concat(cx + sd * hr * 1.06, "\" cy=\"").concat(cy + hry * 0.5, "\" r=\"").concat(6.5 * b.fs, "\" fill=\"none\" stroke=\"#ffd76e\" stroke-width=\"").concat(2.2 * b.fs, "\"/>");
  }).join('');
});
I('e3', 'earrings', '流苏耳坠', ['elegant', 'party'], ['#ff8fb0'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry;
  return [-1, 1].map(function (sd) {
    var x = cx + sd * hr * 1.04,
      y = cy + hry * 0.42;
    return "<circle cx=\"".concat(x, "\" cy=\"").concat(y, "\" r=\"").concat(2.6 * b.fs, "\" fill=\"#ffd76e\"/>") + [0, 1, 2].map(function (i) {
      return "<line x1=\"".concat(x - 3 + i * 3, "\" y1=\"").concat(y + 3, "\" x2=\"").concat(x - 3 + i * 3, "\" y2=\"").concat(y + 12 * b.fs, "\" stroke=\"#ff8fb0\" stroke-width=\"1.8\" stroke-linecap=\"round\"/>");
    }).join('');
  }).join('');
});
I('e4', 'earrings', '星星耳钉', ['cute', 'stage'], ['#ffe28a'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry;
  return [-1, 1].map(function (sd) {
    return star5(cx + sd * hr * 1.04, cy + hry * 0.42, 4.5 * b.fs, '#ffe28a');
  }).join('');
});
I('e5', 'earrings', '蜜桃心心坠', ['sweet', 'cute'], ['#ff7e9e'], function (b) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry;
  return [-1, 1].map(function (sd) {
    return heart(cx + sd * hr * 1.05, cy + hry * 0.42, 3.6 * b.fs, '#ff7e9e');
  }).join('');
});

/* 项链 5 */
I('n1', 'necklace', '珍珠项链', ['elegant', 'basic'], ['#fdf6ee'], function (b) {
  var cx = b.cx,
    sy = b.shoulderY,
    neckW = b.neckW;
  var s = "<path d=\"M ".concat(cx - neckW - 4, ",").concat(sy + 1, " Q ").concat(cx, ",").concat(sy + 17, " ").concat(cx + neckW + 4, ",").concat(sy + 1, "\" stroke=\"#e3d5c5\" stroke-width=\"1.6\" fill=\"none\"/>");
  for (var i = 0; i <= 6; i++) {
    var t = i / 6,
      x = cx - neckW - 4 + t * (neckW + 4) * 2;
    var y = sy + 1 + Math.sin(t * Math.PI) * 15;
    s += "<circle cx=\"".concat(x, "\" cy=\"").concat(y, "\" r=\"2.4\" fill=\"#fdf6ee\" stroke=\"#e3d5c5\" stroke-width=\".6\"/>");
  }
  return s;
});
I('n2', 'necklace', '薄荷宝石链', ['fresh', 'sweet'], ['#5eead4'], function (b) {
  var cx = b.cx,
    sy = b.shoulderY,
    neckW = b.neckW;
  return "<path d=\"M ".concat(cx - neckW - 4, ",").concat(sy, " Q ").concat(cx, ",").concat(sy + 18, " ").concat(cx + neckW + 4, ",").concat(sy, "\" stroke=\"#caa8e8\" stroke-width=\"1.6\" fill=\"none\"/>") + "<path d=\"M ".concat(cx - 5, ",").concat(sy + 14, " L ").concat(cx, ",").concat(sy + 8, " L ").concat(cx + 5, ",").concat(sy + 14, " L ").concat(cx, ",").concat(sy + 21, " Z\" fill=\"#5eead4\" stroke=\"#3fc9ae\" stroke-width=\"1\"/>");
});
I('n3', 'necklace', '黑色颈圈', ['cool', 'stage'], ['#2e2e38'], function (b) {
  var cx = b.cx,
    sy = b.shoulderY,
    neckW = b.neckW;
  return "<rect x=\"".concat(cx - neckW - 3, "\" y=\"").concat(sy - 5, "\" width=\"").concat((neckW + 3) * 2, "\" height=\"7\" rx=\"3.5\" fill=\"#2e2e38\"/>") + "<circle cx=\"".concat(cx, "\" cy=\"").concat(sy + 2, "\" r=\"3\" fill=\"#a78bfa\"/>");
});
I('n4', 'necklace', '心心锁骨链', ['sweet', 'cute'], ['#ff7e9e'], function (b) {
  var cx = b.cx,
    sy = b.shoulderY,
    neckW = b.neckW;
  return "<path d=\"M ".concat(cx - neckW - 4, ",").concat(sy, " Q ").concat(cx, ",").concat(sy + 19, " ").concat(cx + neckW + 4, ",").concat(sy, "\" stroke=\"#e8b4c4\" stroke-width=\"1.5\" fill=\"none\"/>") + heart(cx, sy + 19, 5, '#ff7e9e') + "<circle cx=\"".concat(cx, "\" cy=\"").concat(sy + 19, "\" r=\"1.2\" fill=\"#fff\" opacity=\".8\"/>");
});
I('n5', 'necklace', '蝴蝶结颈链', ['cute', 'princess'], ['#ff7eb6'], function (b) {
  var cx = b.cx,
    sy = b.shoulderY,
    neckW = b.neckW;
  return "<path d=\"M ".concat(cx - neckW - 3, ",").concat(sy - 4, " Q ").concat(cx, ",").concat(sy + 2, " ").concat(cx + neckW + 3, ",").concat(sy - 4, "\" stroke=\"#ffb8d4\" stroke-width=\"2.4\" fill=\"none\"/>") + bowSVG(cx, sy + 6, 7, '#ff7eb6');
});
var ITEM_MAP = {};
exports.ITEM_MAP = ITEM_MAP;
ITEMS.forEach(function (it) {
  return ITEM_MAP[it.id] = it;
});

/* ---------- UI 分类定义 ---------- */
var CATEGORIES = [{
  id: 'char',
  name: '角色',
  icon: '🧑',
  type: 'char'
}, {
  id: 'hair',
  name: '发型',
  icon: '💇',
  type: 'hair'
}, {
  id: 'hairColor',
  name: '发色',
  icon: '🎨',
  type: 'swatch',
  colors: HAIRCOLORS,
  key: 'hairColor'
}, {
  id: 'skin',
  name: '肤色',
  icon: '🫧',
  type: 'swatch',
  colors: SKINS,
  key: 'skin'
}, {
  id: 'eyeColor',
  name: '瞳色',
  icon: '👁️',
  type: 'swatch',
  colors: EYECOLORS,
  key: 'eyeColor'
}, {
  id: 'eyeShape',
  name: '眼型',
  icon: '✨',
  type: 'eyeShape'
}, {
  sep: '服饰 · 51 件'
}, {
  id: 'top',
  name: '上衣',
  icon: '👕',
  type: 'items'
}, {
  id: 'bottom',
  name: '裤装',
  icon: '👖',
  type: 'items'
}, {
  id: 'skirt',
  name: '裙装',
  icon: '🩱',
  type: 'items'
}, {
  id: 'dress',
  name: '连衣裙·套装',
  icon: '👗',
  type: 'items'
}, {
  id: 'shoes',
  name: '鞋子',
  icon: '👟',
  type: 'items'
}, {
  id: 'hat',
  name: '帽子',
  icon: '🧢',
  type: 'items'
}, {
  id: 'headwear',
  name: '头饰',
  icon: '👑',
  type: 'items'
}, {
  id: 'earrings',
  name: '耳饰',
  icon: '💎',
  type: 'items'
}, {
  id: 'necklace',
  name: '项链',
  icon: '📿',
  type: 'items'
}];
exports.CATEGORIES = CATEGORIES;
var TAG_NAMES = {
  casual: '休闲',
  sweet: '甜美',
  campus: '学院',
  sporty: '活力',
  cool: '帅气',
  formal: '优雅',
  princess: '童话',
  cute: '可爱',
  fresh: '清新',
  party: '派对',
  classic: '古风',
  sea: '度假',
  elegant: '精致',
  basic: '百搭',
  stage: '舞台'
};

/* ===================== 体型模型 + 角色渲染（render.js） ===================== */
exports.TAG_NAMES = TAG_NAMES;
function makeBody(charId) {
  var c = CHARACTERS[charId];
  var cx = 160;
  var hr = 35 * c.head,
    hry = 41 * c.head;
  var cy = 100;
  var fs = c.head;
  var neckW = 8.5 * fs * c.neck;
  var neckTop = cy + hry - 9;
  var shoulderY = neckTop + 14 + 7 * c.neck;
  var h = c.h;
  var chestY = shoulderY + 30 * h;
  var waistY = shoulderY + 74 * h;
  var hipY = shoulderY + 116 * h;
  var kneeY = hipY + 94 * h;
  var ankleY = kneeY + 102 * h;
  var footY = ankleY + 9;
  var shoulderHalf = 44 * c.sw;
  var chestHalf = 40 * c.ww;
  var waistHalf = 29 * c.ww;
  var hipHalf = 38 * c.hw;
  var armX = shoulderHalf - 2;
  var armW = 12.5 * fs;
  var elbowX = armX + 12 * fs,
    elbowY = shoulderY + 64 * h;
  var wristX = armX + 7 * fs,
    wristY = shoulderY + 126 * h;
  var legGap = Math.max(9, hipHalf * 0.40);
  var legW = Math.max(12, Math.min(30, legGap * 1.6));
  var footX = legGap + 3;
  return {
    cx: cx,
    cy: cy,
    hr: hr,
    hry: hry,
    fs: fs,
    neckW: neckW,
    neckTop: neckTop,
    shoulderY: shoulderY,
    chestY: chestY,
    waistY: waistY,
    hipY: hipY,
    kneeY: kneeY,
    ankleY: ankleY,
    footY: footY,
    shoulderHalf: shoulderHalf,
    chestHalf: chestHalf,
    waistHalf: waistHalf,
    hipHalf: hipHalf,
    armX: armX,
    armW: armW,
    elbowX: elbowX,
    wristX: wristX,
    elbowY: elbowY,
    wristY: wristY,
    legGap: legGap,
    legW: legW,
    footX: footX,
    skin: null,
    charId: charId,
    char: c
  };
}
function eyeSVG(x, y, s, shape, eyeC, skin, big) {
  var dk = '#2f2438';
  var ry = {
    round: 6,
    almond: 4.8,
    narrow: 3.3,
    sparkle: 6,
    sleepy: 5.6
  }[shape] || 6;
  var iris = "<ellipse cx=\"".concat(x, "\" cy=\"").concat(y, "\" rx=\"").concat(5.1 * s, "\" ry=\"").concat(ry * s, "\" fill=\"").concat(eyeC, "\"/>") + "<ellipse cx=\"".concat(x, "\" cy=\"").concat(y + 0.4 * s, "\" rx=\"").concat(2.2 * s, "\" ry=\"").concat(ry * s * 0.55, "\" fill=\"#241a2e\"/>") + "<circle cx=\"".concat(x - 1.8 * s, "\" cy=\"").concat(y - 2.1 * s, "\" r=\"").concat(1.7 * s, "\" fill=\"#fff\"/>") + "<circle cx=\"".concat(x + 1.9 * s, "\" cy=\"").concat(y + 2.1 * s, "\" r=\"").concat(0.9 * s, "\" fill=\"#fff\" opacity=\".85\"/>");
  if (shape === 'sparkle') {
    iris += "<circle cx=\"".concat(x + 2.2 * s, "\" cy=\"").concat(y - 2.6 * s, "\" r=\"").concat(1.3 * s, "\" fill=\"#fff\"/>") + "<circle cx=\"".concat(x - 2.6 * s, "\" cy=\"").concat(y + 1.4 * s, "\" r=\"").concat(0.8 * s, "\" fill=\"#fff\" opacity=\".9\"/>");
  }
  var lash = "<path d=\"M ".concat(x - 6.3 * s, ",").concat(y - ry * s * 0.75, " Q ").concat(x, ",").concat(y - (ry + 2.6) * s, " ").concat(x + 6.3 * s, ",").concat(y - ry * s * 0.75, "\" stroke=\"").concat(dk, "\" stroke-width=\"").concat(2.2 * s, "\" fill=\"none\" stroke-linecap=\"round\"/>");
  if (shape === 'narrow') lash = "<path d=\"M ".concat(x - 6.3 * s, ",").concat(y - ry * s * 0.8, " Q ").concat(x, ",").concat(y - (ry + 2.2) * s, " ").concat(x + 6.3 * s, ",").concat(y - ry * s * 0.8, " M ").concat(x + 5.6 * s, ",").concat(y - ry * s * 0.55, " q ").concat(2.6 * s, ",").concat(-0.6 * s, " ").concat(4 * s, ",").concat(-2.6 * s, "\" stroke=\"").concat(dk, "\" stroke-width=\"").concat(2.2 * s, "\" fill=\"none\" stroke-linecap=\"round\"/>");
  if (shape === 'almond') lash += "<path d=\"M ".concat(x + 5.6 * s, ",").concat(y - 2.6 * s, " q ").concat(2.8 * s, ",").concat(-1 * s, " ").concat(4.2 * s, ",").concat(-3.2 * s, "\" stroke=\"").concat(dk, "\" stroke-width=\"").concat(1.8 * s, "\" fill=\"none\" stroke-linecap=\"round\"/>");
  if (shape === 'sleepy') {
    iris += "<path d=\"M ".concat(x - 6.6 * s, ",").concat(y - 0.6 * s, " Q ").concat(x, ",").concat(y - 7 * s, " ").concat(x + 6.6 * s, ",").concat(y - 0.6 * s, " L ").concat(x + 6.6 * s, ",").concat(y - 5.5 * s, " Q ").concat(x, ",").concat(y - 11 * s, " ").concat(x - 6.6 * s, ",").concat(y - 5.5 * s, " Z\" fill=\"").concat(skin, "\"/>") + "<path d=\"M ".concat(x - 6.6 * s, ",").concat(y - 0.8 * s, " Q ").concat(x, ",").concat(y - 7.2 * s, " ").concat(x + 6.6 * s, ",").concat(y - 0.8 * s, "\" stroke=\"").concat(dk, "\" stroke-width=\"").concat(2 * s, "\" fill=\"none\" stroke-linecap=\"round\"/>");
  }
  return iris + lash;
}
function mouthSVG(b, type, fs) {
  var cx = b.cx,
    cy = b.cy,
    my = cy + 24 * fs;
  var c1 = '#d96a7a';
  if (type === 'grin') return "<path d=\"M ".concat(cx - 9 * fs, ",").concat(my - 1, " Q ").concat(cx, ",").concat(my + 8 * fs, " ").concat(cx + 9 * fs, ",").concat(my - 1, " Q ").concat(cx, ",").concat(my + 2 * fs, " ").concat(cx - 9 * fs, ",").concat(my - 1, " Z\" fill=\"#e8756f\"/>");
  if (type === 'happy') return "<path d=\"M ".concat(cx - 8 * fs, ",").concat(my, " Q ").concat(cx, ",").concat(my + 11 * fs, " ").concat(cx + 8 * fs, ",").concat(my, " Z\" fill=\"#e0757f\"/>") + "<path d=\"M ".concat(cx - 5 * fs, ",").concat(my + 0.5, " Q ").concat(cx, ",").concat(my + 4 * fs, " ").concat(cx + 5 * fs, ",").concat(my + 0.5, " Z\" fill=\"#ffb3c0\"/>");
  if (type === 'calm') return "<path d=\"M ".concat(cx - 5 * fs, ",").concat(my + 1, " Q ").concat(cx, ",").concat(my + 3.5 * fs, " ").concat(cx + 5 * fs, ",").concat(my + 1, "\" stroke=\"").concat(c1, "\" stroke-width=\"").concat(2 * fs, "\" fill=\"none\" stroke-linecap=\"round\"/>");
  return "<path d=\"M ".concat(cx - 6.5 * fs, ",").concat(my, " Q ").concat(cx, ",").concat(my + 5 * fs, " ").concat(cx + 6.5 * fs, ",").concat(my, "\" stroke=\"").concat(c1, "\" stroke-width=\"").concat(2.1 * fs, "\" fill=\"none\" stroke-linecap=\"round\"/>");
}
function faceSVG(b, cfg, skin, hairC) {
  var cx = b.cx,
    cy = b.cy,
    fs = b.fs;
  var eyeC = EYECOLORS[cfg.eyeColor],
    shape = cfg.eyeShape;
  var s = fs * (b.char.eyeBig || 1);
  var ex = 14.5 * fs,
    ey = cy + 5 * fs;
  var browC = shade(hairC, -0.3),
    browY = ey - 9.5 * s;
  var brows;
  if (b.char.mouth === 'calm') brows = [-1, 1].map(function (sd) {
    return "<line x1=\"".concat(cx + sd * ex - 5 * s, "\" y1=\"").concat(browY - 0.5, "\" x2=\"").concat(cx + sd * ex + 5 * s, "\" y2=\"").concat(browY - 0.5, "\" stroke=\"").concat(browC, "\" stroke-width=\"").concat(2 * s, "\" stroke-linecap=\"round\"/>");
  }).join('');else brows = [-1, 1].map(function (sd) {
    return "<path d=\"M ".concat(cx + sd * ex - 5.2 * s, ",").concat(browY + 1, " Q ").concat(cx + sd * ex, ",").concat(browY - 3 * s, " ").concat(cx + sd * ex + 5.2 * s, ",").concat(browY + 1, "\" stroke=\"").concat(browC, "\" stroke-width=\"").concat(2 * s, "\" fill=\"none\" stroke-linecap=\"round\"/>");
  }).join('');
  var eyes = eyeSVG(cx - ex, ey, s, shape, eyeC, skin) + eyeSVG(cx + ex, ey, s, shape, eyeC, skin);
  var nose = "<path d=\"M ".concat(cx + 1.5 * fs, ",").concat(cy + 13 * fs, " q ").concat(2.5 * fs, ",").concat(3 * fs, " ").concat(-0.5 * fs, ",").concat(5.5 * fs, "\" stroke=\"").concat(shade(skin, -0.2), "\" stroke-width=\"").concat(1.6 * fs, "\" fill=\"none\" stroke-linecap=\"round\"/>");
  var mouth = mouthSVG(b, b.char.mouth, fs);
  var blush = b.char.lash ? [-1, 1].map(function (sd) {
    return "<ellipse cx=\"".concat(cx + sd * 22 * fs, "\" cy=\"").concat(cy + 17 * fs, "\" rx=\"").concat(6.5 * fs, "\" ry=\"").concat(3.4 * fs, "\" fill=\"#ff9db0\" opacity=\".38\"/>");
  }).join('') : '';
  return "<g id=\"g-eyes\">".concat(eyes, "</g>").concat(brows).concat(nose).concat(mouth).concat(blush);
}
function headSVG(b, cfg, skin, hairC) {
  var cx = b.cx,
    cy = b.cy,
    hr = b.hr,
    hry = b.hry,
    fs = b.fs,
    neckW = b.neckW,
    neckTop = b.neckTop,
    sy = b.shoulderY;
  var dk = shade(skin, -0.1);
  return "<g id=\"g-head\">" + "<path d=\"M ".concat(cx - neckW, ",").concat(neckTop - 3, " L ").concat(cx - neckW, ",").concat(sy + 6, " Q ").concat(cx, ",").concat(sy + 14, " ").concat(cx + neckW, ",").concat(sy + 6, " L ").concat(cx + neckW, ",").concat(neckTop - 3, " Z\" fill=\"").concat(dk, "\" stroke=\"").concat(INK, "\" stroke-width=\"2.4\"/>") + [-1, 1].map(function (sd) {
    return "<ellipse cx=\"".concat(cx + sd * (hr + 1), "\" cy=\"").concat(cy + hry * 0.22, "\" rx=\"").concat(5 * fs, "\" ry=\"").concat(7.5 * fs, "\" fill=\"").concat(skin, "\" stroke=\"").concat(INK, "\" stroke-width=\"2.2\"/>");
  }).join('') + "<ellipse cx=\"".concat(cx, "\" cy=\"").concat(cy, "\" rx=\"").concat(hr, "\" ry=\"").concat(hry, "\" fill=\"").concat(skin, "\" stroke=\"").concat(INK, "\" stroke-width=\"3\"/>") + "<g id=\"g-face\" transform=\"translate(0,0)\">".concat(faceSVG(b, cfg, skin, hairC), "</g>") + "</g>";
}
function bodySVG(b, skin) {
  return [-1, 1].map(function (sd) {
    return limbPath(legPts(b, sd), b.legW, skin);
  }).join('') + [-1, 1].map(function (sd) {
    return "<ellipse cx=\"".concat(footCX(b, sd), "\" cy=\"").concat(b.footY, "\" rx=\"").concat(11.5 * b.fs, "\" ry=\"").concat(6.5 * b.fs, "\" fill=\"").concat(skin, "\" stroke=\"").concat(INK, "\" stroke-width=\"2.4\"/>");
  }).join('') + "<path d=\"".concat(torsoPath(b, 0), "\" fill=\"").concat(skin, "\" stroke=\"").concat(INK, "\" stroke-width=\"3\"/>") + [-1, 1].map(function (sd) {
    return limbPath(armPts(b, sd), b.armW, skin);
  }).join('') + [-1, 1].map(function (sd) {
    return "<circle cx=\"".concat(b.cx + sd * b.wristX, "\" cy=\"").concat(b.wristY + 5, "\" r=\"").concat(5.8 * b.fs, "\" fill=\"").concat(skin, "\" stroke=\"").concat(INK, "\" stroke-width=\"2.4\"/>");
  }).join('');
}

/* ---------- 主渲染：完整角色 ---------- */
function avatarSVG(cfg, opts) {
  opts = opts || {};
  var b = makeBody(cfg.charId);
  var skin = cfg.skinColor || SKINS[cfg.skin];
  var hairC = HAIRCOLORS[cfg.hairColor];
  var it = cfg.items || {};
  var draw = function draw(id) {
    return ITEM_MAP[id] ? ITEM_MAP[id].draw(b) : '';
  };
  var hair = HAIRSTYLES[cfg.hair];
  var hairBack = hair ? hair.back(b, hairC) : '';
  var hairFront = hair ? hair.front(b, hairC) : '';
  var layers = [['hairback', hairBack], ['legs', bodySVG(b, skin)], ['shoes', it.shoes ? draw(it.shoes) : ''], ['bottom', it.bottom ? draw(it.bottom) : it.skirt ? draw(it.skirt) : ''], ['dress', it.dress ? draw(it.dress) : ''], ['top', it.top ? draw(it.top) : ''], ['necklace', it.necklace ? draw(it.necklace) : ''], ['head', headSVG(b, cfg, skin, hairC)], ['hairfront', hairFront], ['hat', it.hat ? draw(it.hat) : ''], ['headwear', it.headwear ? draw(it.headwear) : ''], ['earrings', it.earrings ? draw(it.earrings) : '']];
  var inner = layers.map(function (_ref11) {
    var _ref12 = (0, _slicedToArray2.default)(_ref11, 2),
      k = _ref12[0],
      v = _ref12[1];
    return v ? "<g id=\"g-".concat(k, "\" data-layer=\"").concat(k, "\">").concat(v, "</g>") : '';
  }).join('');
  var shadowY = b.footY + 12;
  return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 560\" ".concat(opts.attrs || '', ">") + "<ellipse cx=\"160\" cy=\"".concat(shadowY, "\" rx=\"").concat(62 * b.fs, "\" ry=\"11\" fill=\"rgba(10,5,30,.3)\"/>") + "<g id=\"g-breath\"><g id=\"g-figure\">".concat(inner, "</g></g></svg>");
}
var MANNEQUIN = {
  charId: 'yu',
  skin: 1,
  hair: null,
  hairColor: 5,
  eyeColor: 0,
  eyeShape: 'round',
  skinColor: '#ece7f2',
  items: {}
};

/* ---------- 缩略图 ---------- */
function itemThumbSVG(itemId) {
  var it = ITEM_MAP[itemId];
  if (!it) return '';
  var cfg = JSON.parse(JSON.stringify(MANNEQUIN));
  cfg.items[it.cat] = itemId;
  var vb = '70 50 180 480';
  if (it.cat === 'top' || it.cat === 'dress' || it.cat === 'skirt' || it.cat === 'bottom') vb = '85 140 150 330';
  if (it.cat === 'shoes') vb = '90 400 140 130';
  if (it.cat === 'hat' || it.cat === 'headwear') vb = '85 4 150 158';
  if (it.cat === 'earrings' || it.cat === 'necklace') vb = '100 70 120 150';
  var svg = avatarSVG(cfg, {
    attrs: ''
  });
  return svg.replace('viewBox="0 0 320 560"', "viewBox=\"".concat(vb, "\""));
}
function headThumbSVG(cfg) {
  var b = makeBody(cfg.charId);
  var vb = "".concat(b.cx - 66, " ").concat(b.cy - b.hry - 42, " 132 152");
  var full = avatarSVG(cfg, {
    attrs: ''
  });
  return full.replace('viewBox="0 0 320 560"', "viewBox=\"".concat(vb, "\""));
}
function hairThumbSVG(hairId) {
  var cfg = JSON.parse(JSON.stringify(MANNEQUIN));
  cfg.hair = hairId;
  cfg.skinColor = '#f2d8c8';
  cfg.hairColor = 5;
  return headThumbSVG(cfg);
}
function eyeShapeThumbSVG(shapeId) {
  var s = 2.2,
    ex = 30,
    ey = 34;
  var eye = eyeSVG(-ex, ey, s, shapeId, '#5a4a8a', '#f2d8c8') + eyeSVG(ex, ey, s, shapeId, '#5a4a8a', '#f2d8c8');
  return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-60 4 120 62\">".concat(eye, "</svg>");
}

/* ---------- SVG 字符串 → base64 data URI（供 <image> 使用） ---------- */
function svgToDataUri(svg) {
  // SVG 实际为 ASCII/含少量转义，这里用 encodeURIComponent 以稳妥处理任意字符
  var b64 = _btoaUnicode(svg);
  return 'data:image/svg+xml;base64,' + b64;
}
function _btoaUnicode(str) {
  if (typeof btoa === 'function' && typeof unescape === 'function') {
    return btoa(unescape(encodeURIComponent(str))); // 稳妥处理任意字符
  }

  if (typeof btoa === 'function') return btoa(str); // SVG 均为 ASCII 时的快捷路径
  // 兜底（无 btoa 环境，如部分小程序运行时）
  var binary = '';
  for (var i = 0; i < str.length; i++) {
    binary += String.fromCharCode(str.charCodeAt(i) & 0xff);
  }
  return binary;
}

/***/ }),
/* 55 */
/*!***************************************************************!*\
  !*** D:/WeChatApp/ChangeCloseGame/uni-app/common/gamecore.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EXCLUSIVE = exports.CAT_KEYS = exports.ACHIEVEMENTS = void 0;
Object.defineProperty(exports, "EYECOLORS", {
  enumerable: true,
  get: function get() {
    return _avatar.EYECOLORS;
  }
});
Object.defineProperty(exports, "EYESHAPES", {
  enumerable: true,
  get: function get() {
    return _avatar.EYESHAPES;
  }
});
Object.defineProperty(exports, "HAIRCOLORS", {
  enumerable: true,
  get: function get() {
    return _avatar.HAIRCOLORS;
  }
});
exports.TAG_NAME = exports.MAX_OUTFITS = exports.ITEMS_BY_CAT = void 0;
exports.achCheck = achCheck;
exports.achProgress = achProgress;
exports.achTrack = achTrack;
exports.catCountOfItems = catCountOfItems;
exports.countChars = countChars;
exports.countEyes = countEyes;
exports.countHair = countHair;
exports.deepClone = deepClone;
exports.defaultCfg = defaultCfg;
exports.getChoiceThumb = getChoiceThumb;
exports.getItemsByCat = getItemsByCat;
exports.hexToHsl = hexToHsl;
exports.itemName = itemName;
exports.scoreOutfit = scoreOutfit;
exports.trackTry = trackTry;
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _avatar = __webpack_require__(/*! ./avatar.js */ 54);
/* 纯游戏规则 / 计算逻辑（无 UI、无 DOM 依赖）：
   互斥规则、每类可选列表、搭配评分、成就定义与判定。
   从原 web-prototype 的 app.js / features.js 移植。
*/

var MAX_OUTFITS = 8;

/* 互斥规则：连衣裙 vs 上下/裙/裤 等 */
exports.MAX_OUTFITS = MAX_OUTFITS;
var EXCLUSIVE = {
  dress: ['top', 'bottom', 'skirt'],
  top: ['dress'],
  bottom: ['dress', 'skirt'],
  skirt: ['dress', 'bottom']
};
exports.EXCLUSIVE = EXCLUSIVE;
var ITEMS_BY_CAT = {};
exports.ITEMS_BY_CAT = ITEMS_BY_CAT;
_avatar.ITEMS.forEach(function (it) {
  return (ITEMS_BY_CAT[it.cat] = ITEMS_BY_CAT[it.cat] || []).push(it);
});
function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}
function defaultCfg(charId) {
  var c = deepClone(_avatar.CHARACTERS[charId].preset);
  return Object.assign({
    charId: charId,
    items: {}
  }, c, {
    items: c.items || {}
  });
}
function getChoiceThumb(kind, id) {
  // 供 UI 缩略图使用：items -> itemThumbSVG，hair -> hairThumbSVG，eyeShape -> eyeShapeThumbSVG
  // 由调用方（index.vue）处理，这里保留接口说明
}

/* ---------- 颜色工具（评分用） ---------- */
function hexToHsl(hex) {
  var n = parseInt(hex.slice(1), 16);
  var r = (n >> 16) / 255,
    g = (n >> 8 & 255) / 255,
    b = (n & 255) / 255;
  var mx = Math.max(r, g, b),
    mn = Math.min(r, g, b);
  var h = 0,
    s = 0;
  var l = (mx + mn) / 2;
  if (mx !== mn) {
    var d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);else if (mx === g) h = (b - r) / d + 2;else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}

/* ---------- 搭配评分 ---------- */
function scoreOutfit(cfg) {
  var it = cfg.items || {};
  var worn = Object.keys(it).filter(function (k) {
    return it[k] && _avatar.ITEM_MAP[it[k]];
  });
  var items = worn.map(function (k) {
    return _avatar.ITEM_MAP[it[k]];
  });
  var dims = {};
  var complete = 0;
  if (it.dress || it.top && (it.bottom || it.skirt)) complete += 18;else if (it.top || it.bottom || it.skirt) complete += 8;
  if (it.shoes) complete += 8;
  if (it.hat) complete += 3;
  complete += Math.min(6, [it.headwear, it.earrings, it.necklace].filter(Boolean).length * 2);
  dims.complete = Math.round(complete / 35 * 100);
  var harmony = 12;
  var chroma = [];
  items.forEach(function (i) {
    return i.colors.forEach(function (c) {
      var _hexToHsl = hexToHsl(c),
        _hexToHsl2 = (0, _slicedToArray2.default)(_hexToHsl, 2),
        h = _hexToHsl2[0],
        s = _hexToHsl2[1];
      if (s > 0.22 && !(c === '#f6f6f8')) chroma.push(Math.round(h / 30) % 12);
    });
  });
  if (chroma.length) {
    var fams = (0, _toConsumableArray2.default)(new Set(chroma));
    if (fams.length === 1) harmony = 30;else if (fams.length === 2) {
      var _fams = (0, _slicedToArray2.default)(fams, 2),
        a = _fams[0],
        b2 = _fams[1];
      var gap = Math.min(Math.abs(a - b2), 12 - Math.abs(a - b2));
      harmony = gap <= 2 ? 28 : gap >= 5 ? 22 : 18;
    } else harmony = Math.max(8, 20 - (fams.length - 3) * 4);
  }
  dims.harmony = Math.round(harmony / 30 * 100);
  var style = 6;
  if (items.length) {
    var tagCount = {};
    items.forEach(function (i) {
      return i.tags.forEach(function (t) {
        return tagCount[t] = (tagCount[t] || 0) + 1;
      });
    });
    var dom = Math.max.apply(Math, (0, _toConsumableArray2.default)(Object.values(tagCount)));
    var total = items.reduce(function (n, i) {
      return n + i.tags.length;
    }, 0);
    style = Math.round(6 + 19 * (dom / total * 1.6 > 1 ? 1 : dom / total * 1.6));
  }
  dims.style = Math.round(style / 25 * 100);
  var bonus = [it.hat, it.headwear, it.earrings, it.necklace].filter(Boolean).length;
  dims.bonus = Math.round(Math.min(10, bonus * 2.5) / 10 * 100);
  var score = Math.round(complete / 35 * 35 + harmony / 30 * 30 + style / 25 * 25 + Math.min(10, bonus * 2.5));
  var stars = Math.max(1, Math.min(5, Math.round(score / 20)));
  var best = Object.entries(dims).sort(function (a, b2) {
    return b2[1] - a[1];
  })[0][0];
  var praise = {
    complete: '整套Look相当完整，从上到下都安排得明明白白！',
    harmony: '色彩感觉一流，配色和谐又高级！',
    style: '风格超级统一，主题感十足，像从杂志里走出来的！',
    bonus: '配饰点睛太绝了，细节控狂喜！'
  };
  var tips = [];
  if (!it.shoes) tips.push('还没穿鞋子哦，挑一双鞋会让整体更完整');
  if (!it.dress && it.top && !it.bottom && !it.skirt) tips.push('上半身有了，再选一条裤装或裙装吧');
  if (!it.dress && !it.top) tips.push('别忘了穿上衣～');
  if (!it.hat && !it.headwear) tips.push('试试加一顶帽子或头饰，层次感立刻不一样');
  if (!it.earrings && !it.necklace) tips.push('耳饰或项链能提升精致度哦');
  if (dims.harmony < 60) tips.push('配色稍有冲突，可以试试同色系或对比色系单品');
  if (!tips.length) tips.push('已经很棒啦！试试「随机搭配」碰撞新灵感吧');
  var comments = [[90, '✨ 惊为天人！这就是本季最佳穿搭！'], [75, '👏 非常出色的搭配，时髦度满分！'], [60, '👍 不错的搭配，已经有模有样啦！'], [40, '🙂 有潜力的搭配，再调整一下细节吧'], [0, '🌱 刚起步的穿搭，多试试不同单品吧']];
  var comment = comments.find(function (c) {
    return score >= c[0];
  })[1] + ' ' + praise[best];
  return {
    score: score,
    stars: stars,
    dims: dims,
    comment: comment,
    tips: tips.slice(0, 3)
  };
}

/* ---------- 成就系统 ---------- */
var ACHIEVEMENTS = [{
  id: 'first',
  icon: '👗',
  name: '初次登场',
  desc: '第一次换装',
  goal: 1,
  type: 'count',
  key: 'dressed'
}, {
  id: 'fullset',
  icon: '🧥',
  name: '全套出击',
  desc: '同时穿上衣、下装和鞋子',
  goal: 1,
  type: 'flag',
  key: 'fullset'
}, {
  id: 'try30',
  icon: '🛍️',
  name: '试衣间常客',
  desc: '试穿 30 件不同单品',
  goal: 30,
  type: 'set',
  key: 'tried'
}, {
  id: 'dress5',
  icon: '👑',
  name: '裙子收藏家',
  desc: '试穿 5 条不同连衣裙',
  goal: 5,
  type: 'set',
  key: 'triedDress'
}, {
  id: 'save5',
  icon: '💾',
  name: '收藏爱好者',
  desc: '保存 5 套搭配',
  goal: 5,
  type: 'count',
  key: 'saved'
}, {
  id: 'color8',
  icon: '🎨',
  name: '发色魔法师',
  desc: '尝试 8 种不同发色',
  goal: 8,
  type: 'set',
  key: 'hairTried'
}, {
  id: 'style20',
  icon: '🔄',
  name: '百变星人',
  desc: '累计更换 20 次造型',
  goal: 20,
  type: 'count',
  key: 'dressed'
}, {
  id: 'random10',
  icon: '🎲',
  name: '命运搭配师',
  desc: '使用 10 次随机搭配',
  goal: 10,
  type: 'count',
  key: 'randoms'
}, {
  id: 'perfect',
  icon: '⭐',
  name: '完美瞬间',
  desc: '获得 90 分以上评分',
  goal: 1,
  type: 'flag',
  key: 'perfect'
}, {
  id: 'share1',
  icon: '📤',
  name: '分享达人',
  desc: '分享一次搭配',
  goal: 1,
  type: 'count',
  key: 'shared'
}, {
  id: 'allcat',
  icon: '🏅',
  name: '十八般武艺',
  desc: '佩戴过全部服饰类别',
  goal: 9,
  type: 'set',
  key: 'cats'
}];
exports.ACHIEVEMENTS = ACHIEVEMENTS;
var CAT_KEYS = ['top', 'bottom', 'skirt', 'dress', 'shoes', 'hat', 'headwear', 'earrings', 'necklace'];

/* 成就状态操作：传入持久化对象 { progress:{}, unlocked:[] } */
exports.CAT_KEYS = CAT_KEYS;
function achProgress(achState, a) {
  if (achState.unlocked.includes(a.id)) return {
    cur: a.goal,
    done: true
  };
  var p = achState.progress[a.key] || {};
  if (a.type === 'set') return {
    cur: (p.items || []).length,
    done: false
  };
  if (a.type === 'count') return {
    cur: p.n || 0,
    done: false
  };
  return {
    cur: p.done ? 1 : 0,
    done: false
  };
}
function achTrack(achState, key, action, val) {
  var p = achState.progress[key] = achState.progress[key] || {};
  if (action === 'set') {
    p.items = p.items || [];
    if (!p.items.includes(val)) p.items.push(val);
  } else if (action === 'inc') p.n = (p.n || 0) + (val || 1);else if (action === 'flag') p.done = true;
}
function achCheck(achState) {
  var newly = [];
  ACHIEVEMENTS.forEach(function (a) {
    if (achState.unlocked.includes(a.id)) return;
    var _achProgress = achProgress(achState, a),
      cur = _achProgress.cur;
    if (cur >= a.goal) {
      achState.unlocked.push(a.id);
      newly.push(a);
    }
  });
  return newly;
}

/* 便捷：试穿/完整度追踪（需配合 achTrack/achCheck 使用） */
function trackTry(achState, cat, id) {
  achTrack(achState, 'dressed', 'inc');
  if (id) {
    achTrack(achState, 'tried', 'set', id);
    if (cat === 'dress') achTrack(achState, 'triedDress', 'set', id);
    achTrack(achState, 'cats', 'set', cat);
  }
}
var TAG_NAME = function TAG_NAME(t) {
  return _avatar.TAG_NAMES[t] || t;
};
exports.TAG_NAME = TAG_NAME;
function itemName(id) {
  return _avatar.ITEM_MAP[id] ? _avatar.ITEM_MAP[id].name : id;
}
function catCountOfItems(cat) {
  return (ITEMS_BY_CAT[cat] || []).length;
}
function getItemsByCat(cat) {
  return ITEMS_BY_CAT[cat] || [];
}
function countHair() {
  return Object.keys(_avatar.HAIRSTYLES).length;
}
function countEyes() {
  return _avatar.EYESHAPES.length;
}
function countChars() {
  return Object.keys(_avatar.CHARACTERS).length;
}

/***/ }),
/* 56 */
/*!**************************************************************!*\
  !*** D:/WeChatApp/ChangeCloseGame/uni-app/common/storage.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJSON = void 0;
exports.getStore = getStore;
exports.removeStore = removeStore;
exports.setJSON = void 0;
exports.setStore = setStore;
var _config = _interopRequireDefault(__webpack_require__(/*! ./config.js */ 57));
/* 统一本地存储（单条编码路径，避免双重 JSON.stringify）。
   所有值都以 JSON 字符串形式写入，读回时反序列化；优先 uni.*，其次 localStorage / 内存兜底。
*/

var mem = {}; // 无任何存储环境时的兜底

function backend() {
  if (typeof uni !== 'undefined' && uni && typeof uni.getStorageSync === 'function') return 'uni';
  if (typeof localStorage !== 'undefined') return 'local';
  return 'mem';
}
var keyOf = function keyOf(k) {
  return _config.default.STORE_PREFIX + k;
};
function getStore(key, def) {
  var k = keyOf(key);
  try {
    var b = backend();
    var raw = null;
    if (b === 'uni') {
      var v = uni.getStorageSync(k);
      raw = v === '' || v == null ? null : v;
    } else if (b === 'local') {
      raw = localStorage.getItem(k);
    } else raw = k in mem ? mem[k] : null;
    if (raw == null) return def;
    return JSON.parse(raw); // 无论类型统一反序列化
  } catch (e) {
    return def;
  }
}
function setStore(key, val) {
  var k = keyOf(key);
  try {
    var raw = JSON.stringify(val);
    var b = backend();
    if (b === 'uni') uni.setStorageSync(k, raw);else if (b === 'local') localStorage.setItem(k, raw);else mem[k] = raw;
  } catch (e) {/* ignore */}
}
function removeStore(key) {
  var k = keyOf(key);
  try {
    var b = backend();
    if (b === 'uni') uni.removeStorageSync(k);else if (b === 'local') localStorage.removeItem(k);else delete mem[k];
  } catch (e) {/* ignore */}
}

// 与原先命名一致（存 / 取任意 JSON 值，含字符串 / 布尔 / 对象）
var getJSON = getStore;
exports.getJSON = getJSON;
var setJSON = setStore;
exports.setJSON = setJSON;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),
/* 57 */
/*!*************************************************************!*\
  !*** D:/WeChatApp/ChangeCloseGame/uni-app/common/config.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/* 全局配置 */
var _default = {
  // FastAPI 后端地址。
  //  - 本机 H5 调试：保持 http://127.0.0.1:8000
  //  - 真机 / 局域网：改成电脑局域网 IP，如 http://192.168.1.5:8000
  //  - 部署到小程序 / 线上：填 https 域名（微信需在后台配置 request 合法域名）
  API_BASE: 'http://127.0.0.1:8000',
  // 云端开关：false 时完全离线（仅本地存储）
  CLOUD_ENABLED: true,
  // 本地存档 key 前缀
  STORE_PREFIX: 'dw_'
};
exports.default = _default;

/***/ }),
/* 58 */
/*!**********************************************************!*\
  !*** D:/WeChatApp/ChangeCloseGame/uni-app/common/api.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStats = getStats;
exports.getUid = getUid;
exports.isOnline = isOnline;
exports.loadFromCloud = loadFromCloud;
exports.mergeStats = mergeStats;
exports.reportEvent = reportEvent;
exports.saveToCloud = saveToCloud;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 38));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 53));
var _config = _interopRequireDefault(__webpack_require__(/*! ./config.js */ 57));
var _storage = __webpack_require__(/*! ./storage.js */ 56);
/* 云端 API（FastAPI backend）封装。
   所有方法都“尽力而为”：网络失败 / 后端未启动时 resolve(false)，
   不影响本地玩法。真正的数据优先走本地 storage。
*/

var base = function base() {
  return _config.default.API_BASE.replace(/\/+$/, '');
};
var CLOUD_KEY = 'cloud.uid';
function req(method, path, data) {
  return new Promise(function (resolve) {
    if (!_config.default.CLOUD_ENABLED) return resolve({
      ok: false,
      reason: 'disabled'
    });
    uni.request({
      url: base() + path,
      method: method,
      data: data || {},
      timeout: 5000,
      header: {
        'content-type': 'application/json'
      },
      success: function success(res) {
        return resolve({
          ok: true,
          status: res.statusCode,
          data: res.data
        });
      },
      fail: function fail() {
        return resolve({
          ok: false,
          reason: 'network'
        });
      }
    });
  });
}

/* 稳定玩家标识：本地生成后常驻 */
function getUid() {
  var uid = (0, _storage.getJSON)(CLOUD_KEY, null);
  if (!uid) {
    uid = 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    (0, _storage.setJSON)(CLOUD_KEY, uid);
  }
  return uid;
}

/* 上传云存档（payload 为完整本地状态文档） */
function saveToCloud(_x) {
  return _saveToCloud.apply(this, arguments);
}
/* 拉取云存档，返回 payload 或 null */
function _saveToCloud() {
  _saveToCloud = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(payload) {
    var uid, r;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            uid = getUid();
            _context.next = 3;
            return req('POST', '/api/save', {
              uid: uid,
              payload: payload
            });
          case 3:
            r = _context.sent;
            return _context.abrupt("return", r.ok && r.status === 200);
          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _saveToCloud.apply(this, arguments);
}
function loadFromCloud() {
  return _loadFromCloud.apply(this, arguments);
}
/* 合并成就计数与解锁（整包同步） */
function _loadFromCloud() {
  _loadFromCloud = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    var uid, r;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            uid = getUid();
            _context2.next = 3;
            return req('GET', '/api/save/' + encodeURIComponent(uid));
          case 3:
            r = _context2.sent;
            if (!(r.ok && r.status === 200 && r.data && r.data.payload != null)) {
              _context2.next = 6;
              break;
            }
            return _context2.abrupt("return", r.data.payload);
          case 6:
            return _context2.abrupt("return", null);
          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _loadFromCloud.apply(this, arguments);
}
function mergeStats(_x2, _x3) {
  return _mergeStats.apply(this, arguments);
}
/* 上报单个事件（含次数），返回最新统计 */
function _mergeStats() {
  _mergeStats = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(counters, unlocks) {
    var uid, r;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            uid = getUid();
            _context3.next = 3;
            return req('POST', '/api/stats/merge', {
              uid: uid,
              counters: counters,
              unlocks: unlocks
            });
          case 3:
            r = _context3.sent;
            return _context3.abrupt("return", r.ok && r.status === 200 ? r.data : null);
          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _mergeStats.apply(this, arguments);
}
function reportEvent(_x4) {
  return _reportEvent.apply(this, arguments);
}
/* 读取服务端统计 */
function _reportEvent() {
  _reportEvent = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(name) {
    var delta,
      uid,
      r,
      _args4 = arguments;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            delta = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : 1;
            uid = getUid();
            _context4.next = 4;
            return req('POST', '/api/stats/events', {
              uid: uid,
              events: [{
                name: name,
                delta: delta
              }]
            });
          case 4:
            r = _context4.sent;
            return _context4.abrupt("return", r.ok && r.status === 200 ? r.data : null);
          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _reportEvent.apply(this, arguments);
}
function getStats() {
  return _getStats.apply(this, arguments);
}
function _getStats() {
  _getStats = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
    var uid, r;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            uid = getUid();
            _context5.next = 3;
            return req('GET', '/api/stats/' + encodeURIComponent(uid));
          case 3:
            r = _context5.sent;
            if (!(r.ok && r.status === 200)) {
              _context5.next = 6;
              break;
            }
            return _context5.abrupt("return", r.data);
          case 6:
            return _context5.abrupt("return", null);
          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getStats.apply(this, arguments);
}
function isOnline() {
  return _config.default.CLOUD_ENABLED;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */
/*!*****************************************************************!*\
  !*** D:/WeChatApp/ChangeCloseGame/uni-app/common/svg2canvas.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawAvatar = drawAvatar;
exports.drawElement = drawElement;
exports.drawPath = drawPath;
exports.parseSVG = parseSVG;
exports.svgToCanvas = svgToCanvas;
exports.tokenizePath = tokenizePath;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _avatar = __webpack_require__(/*! ./avatar.js */ 54);
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
/* =========================================================================
   轻量 SVG → Canvas2D 解释器
   ---------------------------------------------------------------
   用途：微信小程序端 <image> 不支持 SVG。为让换装角色能在 mp-weixin 显示，
   这里把 avatar.js 已生成的 SVG 字符串解析并在一个标准 Canvas2D ctx 上重绘。
   只支持本作实际用到的 SVG 子集（已在数据上逐一核对）：

     元素：svg / g / defs / linearGradient / stop / path / circle /
           ellipse / rect / line
     路径命令：M L C Q A Z（绝对）与 q（相对二次贝塞尔）
     属性：fill / stroke / stroke-width / stroke-linecap / stroke-linejoin /
           opacity / cx cy r rx ry / x y width height rx（圆角矩形）/
           x1 y1 x2 y2 / d / transform="rotate(a cx cy)" / id
     渐变：linearGradient 默认 objectBoundingBox（近似用整幅 320x560 对角），
           供 d6 鎏金亮片裙等使用。

   设计目标：与浏览器 <image> 显示同一段 SVG，几何逐点一致，仅颜色/渐变近似。
   ctx 为标准 2D 接口（浏览器 / 微信 canvas 2d 均支持）：
     save restore beginPath moveTo lineTo bezierCurveTo quadraticCurveTo
     closePath fill stroke lineWidth lineCap lineJoin globalAlpha
     createLinearGradient addColorStop translate rotate
   ========================================================================= */

// ---------- SVG 文本解析成极简元素树 ----------
function parseSVG(text) {
  var root = {
    tag: 'svg',
    attrs: {},
    children: []
  };
  var stack = [root];
  var i = 0;
  var reTag = /<\s*(\/?)\s*([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)\/?\s*>/g;
  // 更稳妥：逐字符扫描
  while (i < text.length) {
    var lt = text.indexOf('<', i);
    if (lt < 0) break;
    var gt = text.indexOf('>', lt);
    if (gt < 0) break;
    var inner = text.slice(lt + 1, gt).trim();
    i = gt + 1;
    if (!inner) continue;
    if (inner[0] === '/') {
      // 闭合标签
      var _name = inner.slice(1).trim();
      var _top = stack[stack.length - 1];
      if (_top && _top.tag === _name) stack.pop();
      continue;
    }
    var selfClose = inner.endsWith('/');
    if (selfClose) inner = inner.slice(0, -1).trim();
    var sp = inner.search(/[\s/]/);
    var name = void 0,
      rest = '';
    if (sp < 0) {
      name = inner;
    } else {
      name = inner.slice(0, sp);
      rest = inner.slice(sp + 1);
    }
    // 解析属性
    var attrs = {};
    var attrRe = /([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
    var m = void 0;
    while (m = attrRe.exec(rest)) {
      attrs[m[1]] = m[3] !== undefined ? m[3] : m[4];
    }
    var el = {
      tag: name,
      attrs: attrs,
      children: []
    };
    var top = stack[stack.length - 1];
    if (top) top.children.push(el);
    if (!selfClose && (name === 'svg' || name === 'g' || name === 'defs')) {
      stack.push(el);
    }
  }
  return root;
}
function num(v) {
  var d = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (v === undefined || v === '' || v === null) return d;
  var n = parseFloat(v);
  return isNaN(n) ? d : n;
}

// ---------- 颜色 / 透明度解析 ----------
function isNone(v) {
  return !v || v === 'none' || v === 'transparent';
}

// ---------- 路径命令解析（M L C Q A Z + q）----------
function tokenizePath(d) {
  d = (d || '').replace(/,/g, ' ').trim();
  var out = [];
  var re = /([AaCcHhLlMmQqSsTtVvZz])|(-?\d*\.?\d+(?:[eE][-+]?\d+)?)/g;
  var m;
  while (m = re.exec(d)) {
    if (m[1]) out.push({
      c: m[1]
    });else out.push({
      n: parseFloat(m[2])
    });
  }
  return out;
}
function drawPath(ctx, d, P) {
  // P = { sx: 全局 x 缩放, sy: 全局 y 缩放, tx, ty }
  if (!d) return;
  var toks = tokenizePath(d);
  var p = 0;
  var curX = 0,
    curY = 0;
  var startX = 0,
    startY = 0;
  var isFirst = true;
  var _loop = function _loop() {
    var c = toks[p].c;
    if (!c) {
      p++;
      return "continue";
    }
    var rel = c >= 'a' && c <= 'z';
    var up = c.toUpperCase();
    if (c === 'Z' || c === 'z') {
      ctx.closePath();
      curX = startX;
      curY = startY;
      p++;
      return "continue";
    }
    // 读取参数序列直到遇到下一个命令
    var params = [];
    var pp = p + 1;
    while (pp < toks.length && toks[pp].n !== undefined) {
      params.push(toks[pp].n);
      pp++;
    }
    p = pp;
    var take = function take(n) {
      var a = params.slice(0, n);
      params.splice(0, n);
      return a;
    };
    var X = function X(v) {
      return rel ? curX + v : v;
    };
    var Y = function Y(v) {
      return rel ? curY + v : v;
    };
    if (up === 'M') {
      while (params.length >= 2) {
        var _take = take(2),
          _take2 = (0, _slicedToArray2.default)(_take, 2),
          x0 = _take2[0],
          y0 = _take2[1];
        var nx = X(x0),
          ny = Y(y0);
        if (isFirst) {
          ctx.moveTo(nx, ny);
          isFirst = false;
        } else ctx.lineTo(nx, ny);
        curX = nx;
        curY = ny;
        if (rel && params.length) {/* 相对 M 后后续为相对 */}
      }
      startX = curX;
      startY = curY;
    } else if (up === 'L') {
      while (params.length >= 2) {
        var _take3 = take(2),
          _take4 = (0, _slicedToArray2.default)(_take3, 2),
          _x = _take4[0],
          _y = _take4[1];
        var _nx = X(_x),
          _ny = Y(_y);
        ctx.lineTo(_nx, _ny);
        curX = _nx;
        curY = _ny;
      }
    } else if (up === 'C') {
      while (params.length >= 6) {
        var _take5 = take(6),
          _take6 = (0, _slicedToArray2.default)(_take5, 6),
          a1 = _take6[0],
          b1 = _take6[1],
          a2 = _take6[2],
          b2 = _take6[3],
          ex = _take6[4],
          ey = _take6[5];
        ctx.bezierCurveTo(X(a1), Y(b1), X(a2), Y(b2), X(ex), Y(ey));
        curX = X(ex);
        curY = Y(ey);
      }
    } else if (up === 'Q') {
      while (params.length >= 4) {
        var _take7 = take(4),
          _take8 = (0, _slicedToArray2.default)(_take7, 4),
          cx0 = _take8[0],
          cy0 = _take8[1],
          _ex = _take8[2],
          _ey = _take8[3];
        ctx.quadraticCurveTo(X(cx0), Y(cy0), X(_ex), Y(_ey));
        curX = X(_ex);
        curY = Y(_ey);
      }
    } else if (up === 'A') {
      // rx ry xrot large sweep x y
      while (params.length >= 7) {
        var rx = take(1)[0],
          ry = take(1)[0],
          rot = take(1)[0];
        var large = take(1)[0] !== 0,
          sweep = take(1)[0] !== 0;
        var _ex2 = X(take(1)[0]),
          _ey2 = Y(take(1)[0]);
        addEllipticalArc(ctx, curX, curY, Math.abs(rx), Math.abs(ry), rot, large, sweep, _ex2, _ey2);
        curX = _ex2;
        curY = _ey2;
      }
    } else {
      // 遇到未用到的命令（H/V/S/T）做保守近似：跳到下一组
      var arity = up === 'H' || up === 'V' ? 1 : up === 'T' ? 2 : 4;
      params.splice(0, params.length - params.length % arity);
    }
  };
  while (p < toks.length) {
    var _ret = _loop();
    if (_ret === "continue") continue;
  }
}

/* 端点参数化的椭圆弧 → 采样为折线段（画布无需原生椭圆弧/缩放变换，稳定） */
function addEllipticalArc(ctx, x1, y1, rx, ry, phiDeg, large, sweep, x2, y2) {
  if (rx === 0 || ry === 0 || x1 === x2 && y1 === y2) {
    ctx.lineTo(x2, y2);
    return;
  }
  var phi = phiDeg * Math.PI / 180;
  var cosP = Math.cos(phi),
    sinP = Math.sin(phi);
  var dx = (x1 - x2) / 2,
    dy = (y1 - y2) / 2;
  var x1p = cosP * dx + sinP * dy;
  var y1p = -sinP * dx + cosP * dy;
  var lambda = x1p * x1p / (rx * rx) + y1p * y1p / (ry * ry);
  if (lambda > 1) {
    var s = Math.sqrt(lambda);
    rx *= s;
    ry *= s;
  }
  var sgn = large === sweep ? -1 : 1;
  var numA = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  var den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  var coef = sgn * Math.sqrt(Math.max(0, numA / Math.max(den, 1e-9)));
  var cxp = coef * (rx * y1p / ry);
  var cyp = coef * (-ry * x1p / rx);
  var cx = cosP * cxp - sinP * cyp + (x1 + x2) / 2;
  var cy = sinP * cxp + cosP * cyp + (y1 + y2) / 2;
  var ux = (x1p - cxp) / rx,
    uy = (y1p - cyp) / ry;
  var vx = (-x1p - cxp) / rx,
    vy = (-y1p - cyp) / ry;
  var start = Math.atan2(uy, ux);
  var delta = angleBetween(ux, uy, vx, vy);
  if (!sweep && delta > 0) delta -= 2 * Math.PI;
  if (sweep && delta < 0) delta += 2 * Math.PI;
  var N = Math.max(4, Math.ceil(Math.abs(delta) / (Math.PI / 10)));
  for (var i = 1; i <= N; i++) {
    var a = start + delta * i / N;
    var ox = rx * Math.cos(a),
      oy = ry * Math.sin(a);
    var finalX = cx + cosP * ox - sinP * oy;
    var finalY = cy + sinP * ox + cosP * oy;
    ctx.lineTo(finalX, finalY);
  }
}
function angleBetween(ux, uy, vx, vy) {
  return Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
}

// ---------- 解析 transform="rotate(a cx cy)" ----------
function applyTransform(ctx, attr) {
  if (!attr) return false;
  var m = /rotate\(\s*([-0-9.]+)\s*([-0-9.]+)?\s*([-0-9.]+)?\s*\)/.exec(attr);
  if (m) {
    var a = parseFloat(m[1]) * Math.PI / 180;
    var cx = m[2] !== undefined ? parseFloat(m[2]) : 0;
    var cy = m[3] !== undefined ? parseFloat(m[3]) : 0;
    ctx.save();
    if (cx || cy) ctx.translate(cx, cy);
    ctx.rotate(a);
    if (cx || cy) ctx.translate(-cx, -cy);
    return true;
  }
  var t = /translate\(\s*([-0-9.]+)\s*,?\s*([-0-9.]+)?\s*\)/.exec(attr);
  if (t) {
    var tx = parseFloat(t[1] || 0);
    var ty = t[2] !== undefined ? parseFloat(t[2]) : 0;
    ctx.save();
    ctx.translate(tx, ty);
    return true;
  }
  return false;
}

// ---------- 元素绘制 ----------
function drawElement(ctx, el, gradById) {
  var a = el.attrs;
  var tag = el.tag;
  if (tag === 'defs') {
    var _iterator = _createForOfIteratorHelper(el.children),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var c = _step.value;
        if (c.tag === 'linearGradient') gradById[c.attrs.id] = c;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return;
  }
  if (tag === 'g') {
    var saved = applyTransform(ctx, a.transform);
    var _iterator2 = _createForOfIteratorHelper(el.children),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _c = _step2.value;
        drawElement(ctx, _c, gradById);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    if (saved) ctx.restore();
    return;
  }
  if (tag === 'svg') {
    var _iterator3 = _createForOfIteratorHelper(el.children),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _c2 = _step3.value;
        drawElement(ctx, _c2, gradById);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return;
  }
  if (tag !== 'path' && tag !== 'circle' && tag !== 'ellipse' && tag !== 'rect' && tag !== 'line') return;
  if (typeof ctx.onShapeStart === 'function') ctx.onShapeStart(tag, a);
  var opacity = a.opacity === undefined ? 1 : num(a.opacity, 1);
  var hadAlpha = opacity < 1;
  if (hadAlpha) {
    ctx.save();
    ctx.globalAlpha *= opacity;
  }
  ctx.beginPath();
  if (tag === 'path') {
    drawPath(ctx, a.d, {});
  } else if (tag === 'circle') {
    var cx = num(a.cx),
      cy = num(a.cy),
      r = num(a.r);
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  } else if (tag === 'ellipse') {
    ellipse(ctx, num(a.cx), num(a.cy), num(a.rx), num(a.ry));
  } else if (tag === 'rect') {
    var x = num(a.x),
      y = num(a.y),
      w = num(a.width),
      h = num(a.height),
      _r = num(a.rx);
    roundRectPath(ctx, x, y, w, h, _r);
  } else if (tag === 'line') {
    ctx.moveTo(num(a.x1), num(a.y1));
    ctx.lineTo(num(a.x2), num(a.y2));
  }

  // 填充
  var fill = a.fill;
  if (fill !== undefined && !isNone(fill)) {
    ctx.fillStyle = resolveColor(ctx, fill, gradById);
    ctx.fill();
  }
  // 描边
  if (a.stroke !== undefined && !isNone(a.stroke)) {
    ctx.strokeStyle = resolveColor(ctx, a.stroke, gradById);
    ctx.lineWidth = num(a['stroke-width'], 1);
    if (a['stroke-linecap']) ctx.lineCap = a['stroke-linecap'];
    if (a['stroke-linejoin']) ctx.lineJoin = a['stroke-linejoin'];
    ctx.stroke();
  }
  if (hadAlpha) ctx.restore();
}
function ellipse(ctx, cx, cy, rx, ry) {
  // 用参数采样画椭圆，避免中途缩放变换导致后续 fill 坐标错乱
  if (rx <= 0 || ry <= 0) return;
  if (rx === ry) {
    ctx.arc(cx, cy, rx, 0, Math.PI * 2);
    return;
  }
  var N = 64;
  for (var i = 0; i <= N; i++) {
    var a = i / N * Math.PI * 2;
    var px = cx + rx * Math.cos(a),
      py = cy + ry * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py);else ctx.lineTo(px, py);
  }
  ctx.closePath();
}
function roundRectPath(ctx, x, y, w, h, r) {
  if (!r || r <= 0) {
    ctx.rect(x, y, w, h);
    return;
  }
  var rr = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + rr, y + h);
  ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
}
function resolveColor(ctx, color, gradById) {
  var m = /url\(\s*#([\w-]+)\s*\)/.exec(color || '');
  if (m) {
    var g = gradById[m[1]];
    if (g) return makeGradient(ctx, g);
  }
  return color;
}
function makeGradient(ctx, g) {
  // linearGradient（objectBoundingBox 默认）→ 近似用整幅 320x560 的对角坐标
  var x1 = num(g.attrs.x1, 0),
    y1 = num(g.attrs.y1, 0);
  var x2 = num(g.attrs.x2, 1),
    y2 = num(g.attrs.y2, 1);
  var W = 320,
    H = 560;
  var grad = ctx.createLinearGradient(x1 * W, y1 * H, x2 * W, y2 * H);
  var _iterator4 = _createForOfIteratorHelper(g.children),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var stop = _step4.value;
      if (stop.tag !== 'stop') continue;
      var off = Math.max(0, Math.min(1, num(stop.attrs.offset, 0)));
      grad.addColorStop(off, stop.attrs['stop-color'] || '#000');
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return grad;
}

/* ---------- 主入口 ---------- */
function svgToCanvas(ctx, svgText) {
  var root = parseSVG(svgText);
  var gradById = {};
  drawElement(ctx, root, gradById);
}

// 供调试/测试使用

function drawAvatar(ctx, cfg, size) {
  var svg = (0, _avatar.avatarSVG)(cfg, {});
  var target = size || {
    w: 320,
    h: 560
  };
  var sx = target.w / 320,
    sy = target.h / 560;
  ctx.save();
  ctx.scale(sx, sy);
  svgToCanvas(ctx, svg);
  ctx.restore();
}

/***/ }),
/* 75 */
/*!****************************************************************!*\
  !*** D:/WeChatApp/ChangeCloseGame/uni-app/common/canvasctx.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get2DNode = get2DNode;
/* =========================================================================
   跨端获取标准 2D canvas 上下文
   兼容：微信小程序（<canvas type="2d"> + createSelectorQuery node）
       与 H5（浏览器 <canvas>）。
   只负责“拿到已按 DPR 设置好宽高的 ctx”，绘制由调用方完成。
   ========================================================================= */
function get2DNode(that, id) {
  // Promise<{ canvas, ctx, dpr, cssW, cssH } | null>
  return new Promise(function (resolve) {
    var finalize = function finalize(canvas, cssW, cssH) {
      try {
        var dpr = 1;
        if (typeof uni !== 'undefined' && uni.getSystemInfoSync) {
          var info = uni.getSystemInfoSync();
          dpr = info && info.pixelRatio || 1;
        } else if (typeof window !== 'undefined' && window.devicePixelRatio) {
          dpr = window.devicePixelRatio || 1;
        }
        var w = Math.max(1, Math.round((cssW || 320) * dpr));
        var h = Math.max(1, Math.round((cssH || 560) * dpr));
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        return resolve({
          canvas: canvas,
          ctx: ctx,
          dpr: dpr,
          cssW: cssW || 320,
          cssH: cssH || 560
        });
      } catch (e) {
        return resolve(null);
      }
    };
    if (typeof uni !== 'undefined' && uni.createSelectorQuery) {
      uni.createSelectorQuery().in(that).select('#' + id).fields({
        node: true,
        size: true
      }).exec(function (res) {
        var r = res && res[0];
        if (r && r.node) return finalize(r.node, r.width, r.height);
        if (typeof document !== 'undefined') {
          // 某些 H5 环境 node 字段不可用
          var n = document.getElementById(id);
          if (n) return finalize(n, n.clientWidth, n.clientHeight);
        }
        return resolve(null);
      });
    } else if (typeof document !== 'undefined') {
      var n = document.getElementById(id);
      if (!n) return resolve(null);
      return finalize(n, n.clientWidth, n.clientHeight);
    } else {
      return resolve(null);
    }
  });
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ })
]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map