"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeSettingsFromAsyncStorage = exports.loadSettingsFromAsyncStorage = exports.saveSettingsToAsyncStorage = exports.settingsReducer = exports.setSettings = exports.setUseDevice = exports.setTheme = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _asyncStorage = _interopRequireDefault(require("@react-native-async-storage/async-storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  themeMode: 'dark',
  useDevice: true
};
var settingsSlice = (0, _toolkit.createSlice)({
  name: 'settings',
  initialState: initialState,
  reducers: {
    setTheme: function setTheme(state, action) {
      var newState = _objectSpread({}, state, {
        themeMode: action.payload
      });

      saveSettingsToAsyncStorage(newState);
      return newState;
    },
    setUseDevice: function setUseDevice(state, action) {
      var newState = _objectSpread({}, state, {
        useDevice: action.payload
      });

      saveSettingsToAsyncStorage(newState);
      return newState;
    },
    setSettings: function setSettings(state, action) {
      var newState = _objectSpread({}, state, {}, action.payload);

      saveSettingsToAsyncStorage(newState);
      return newState;
    }
  }
});
var _settingsSlice$action = settingsSlice.actions,
    setTheme = _settingsSlice$action.setTheme,
    setUseDevice = _settingsSlice$action.setUseDevice,
    setSettings = _settingsSlice$action.setSettings;
exports.setSettings = setSettings;
exports.setUseDevice = setUseDevice;
exports.setTheme = setTheme;
var settingsReducer = settingsSlice.reducer; // Async Storage functions

exports.settingsReducer = settingsReducer;

var saveSettingsToAsyncStorage = function saveSettingsToAsyncStorage(value) {
  return regeneratorRuntime.async(function saveSettingsToAsyncStorage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("settings save payload", value);
          _context.next = 4;
          return regeneratorRuntime.awrap(_asyncStorage["default"].setItem('@settings', JSON.stringify(value)));

        case 4:
          _context.next = 9;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.error('Failed to save data to Async Storage:', _context.t0);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.saveSettingsToAsyncStorage = saveSettingsToAsyncStorage;

var loadSettingsFromAsyncStorage = function loadSettingsFromAsyncStorage() {
  var value;
  return regeneratorRuntime.async(function loadSettingsFromAsyncStorage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_asyncStorage["default"].getItem('@settings'));

        case 3:
          value = _context2.sent;
          return _context2.abrupt("return", JSON.parse(value));

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error('Failed to load data from Async Storage:', _context2.t0);
          return _context2.abrupt("return", 0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.loadSettingsFromAsyncStorage = loadSettingsFromAsyncStorage;

var removeSettingsFromAsyncStorage = function removeSettingsFromAsyncStorage() {
  return regeneratorRuntime.async(function removeSettingsFromAsyncStorage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_asyncStorage["default"].removeItem('@settings'));

        case 3:
          _context3.next = 8;
          break;

        case 5:
          _context3.prev = 5;
          _context3.t0 = _context3["catch"](0);
          console.error('Failed to remove data from Async Storage:', _context3.t0);

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

exports.removeSettingsFromAsyncStorage = removeSettingsFromAsyncStorage;