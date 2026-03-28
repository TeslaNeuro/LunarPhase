"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeFromAsyncStorage = exports.loadNetworksFromAsyncStorage = exports.saveNetworksToAsyncStorage = exports["default"] = exports.addNetwork = exports.setNetworks = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _asyncStorage = _interopRequireDefault(require("@react-native-async-storage/async-storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var networksSlice = (0, _toolkit.createSlice)({
  name: 'networks',
  initialState: {},
  reducers: {
    setNetworks: function setNetworks(state, action) {
      var newState = _objectSpread({}, state, {}, action.payload);

      saveNetworksToAsyncStorage(newState);
      return newState;
    },
    addNetwork: function addNetwork(state, action) {
      var newState = _objectSpread({}, state, _defineProperty({}, action.payload.ssid, action.payload));

      saveNetworksToAsyncStorage(newState);
      return newState;
    }
  }
});
var actions = networksSlice.actions,
    reducer = networksSlice.reducer;
var setNetworks = actions.setNetworks,
    addNetwork = actions.addNetwork;
exports.addNetwork = addNetwork;
exports.setNetworks = setNetworks;
var _default = reducer; // Async Storage functions

exports["default"] = _default;

var saveNetworksToAsyncStorage = function saveNetworksToAsyncStorage(value) {
  return regeneratorRuntime.async(function saveNetworksToAsyncStorage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_asyncStorage["default"].setItem('@networks', JSON.stringify(value)));

        case 3:
          _context.next = 8;
          break;

        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](0);
          console.error('Failed to save data to Async Storage:', _context.t0);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

exports.saveNetworksToAsyncStorage = saveNetworksToAsyncStorage;

var loadNetworksFromAsyncStorage = function loadNetworksFromAsyncStorage() {
  var value;
  return regeneratorRuntime.async(function loadNetworksFromAsyncStorage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_asyncStorage["default"].getItem('@networks'));

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

exports.loadNetworksFromAsyncStorage = loadNetworksFromAsyncStorage;

var removeFromAsyncStorage = function removeFromAsyncStorage() {
  return regeneratorRuntime.async(function removeFromAsyncStorage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_asyncStorage["default"].removeItem('@networks'));

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

exports.removeFromAsyncStorage = removeFromAsyncStorage;