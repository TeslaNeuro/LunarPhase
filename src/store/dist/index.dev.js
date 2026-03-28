"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "setTheme", {
  enumerable: true,
  get: function get() {
    return _settingsSlice.setTheme;
  }
});
Object.defineProperty(exports, "setUseDevice", {
  enumerable: true,
  get: function get() {
    return _settingsSlice.setUseDevice;
  }
});
exports["default"] = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _devicesSlice = _interopRequireWildcard(require("./devicesSlice"));

var _networksSlice = _interopRequireWildcard(require("./networksSlice"));

var _settingsSlice = require("./settingsSlice");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var store = (0, _toolkit.configureStore)({
  reducer: {
    devices: _devicesSlice["default"],
    networks: _networksSlice["default"],
    settings: _settingsSlice.settingsReducer
  }
});

var initializeStore = function initializeStore() {
  var storedDevicesValue, storedNetworksValue, storedSettingsValue;
  return regeneratorRuntime.async(function initializeStore$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('initialising store...');
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _devicesSlice.loadDevicesFromAsyncStorage)());

        case 3:
          storedDevicesValue = _context.sent;
          console.log('stored devices: ', storedDevicesValue);
          store.dispatch((0, _devicesSlice.setDevices)(storedDevicesValue));
          _context.next = 8;
          return regeneratorRuntime.awrap((0, _networksSlice.loadNetworksFromAsyncStorage)());

        case 8:
          storedNetworksValue = _context.sent;
          console.log('stored networks: ', storedNetworksValue);
          store.dispatch((0, _networksSlice.setNetworks)(storedNetworksValue)); // await removeSettingsFromAsyncStorage()

          _context.next = 13;
          return regeneratorRuntime.awrap((0, _settingsSlice.loadSettingsFromAsyncStorage)());

        case 13:
          storedSettingsValue = _context.sent;
          console.log('stored settings: ', storedSettingsValue);
          store.dispatch((0, _settingsSlice.setSettings)(storedSettingsValue));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
};

initializeStore();
var _default = store;
exports["default"] = _default;