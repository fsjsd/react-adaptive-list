// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"J4Nk":[function(require,module,exports) {
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
'use strict';
/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};
},{}],"awqi":[function(require,module,exports) {
/** @license React v16.8.6
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

var k = require("object-assign"),
    n = "function" === typeof Symbol && Symbol.for,
    p = n ? Symbol.for("react.element") : 60103,
    q = n ? Symbol.for("react.portal") : 60106,
    r = n ? Symbol.for("react.fragment") : 60107,
    t = n ? Symbol.for("react.strict_mode") : 60108,
    u = n ? Symbol.for("react.profiler") : 60114,
    v = n ? Symbol.for("react.provider") : 60109,
    w = n ? Symbol.for("react.context") : 60110,
    x = n ? Symbol.for("react.concurrent_mode") : 60111,
    y = n ? Symbol.for("react.forward_ref") : 60112,
    z = n ? Symbol.for("react.suspense") : 60113,
    aa = n ? Symbol.for("react.memo") : 60115,
    ba = n ? Symbol.for("react.lazy") : 60116,
    A = "function" === typeof Symbol && Symbol.iterator;

function ca(a, b, d, c, e, g, h, f) {
  if (!a) {
    a = void 0;
    if (void 0 === b) a = Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else {
      var l = [d, c, e, g, h, f],
          m = 0;
      a = Error(b.replace(/%s/g, function () {
        return l[m++];
      }));
      a.name = "Invariant Violation";
    }
    a.framesToPop = 1;
    throw a;
  }
}

function B(a) {
  for (var b = arguments.length - 1, d = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 0; c < b; c++) d += "&args[]=" + encodeURIComponent(arguments[c + 1]);

  ca(!1, "Minified React error #" + a + "; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ", d);
}

var C = {
  isMounted: function () {
    return !1;
  },
  enqueueForceUpdate: function () {},
  enqueueReplaceState: function () {},
  enqueueSetState: function () {}
},
    D = {};

function E(a, b, d) {
  this.props = a;
  this.context = b;
  this.refs = D;
  this.updater = d || C;
}

E.prototype.isReactComponent = {};

E.prototype.setState = function (a, b) {
  "object" !== typeof a && "function" !== typeof a && null != a ? B("85") : void 0;
  this.updater.enqueueSetState(this, a, b, "setState");
};

E.prototype.forceUpdate = function (a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};

function F() {}

F.prototype = E.prototype;

function G(a, b, d) {
  this.props = a;
  this.context = b;
  this.refs = D;
  this.updater = d || C;
}

var H = G.prototype = new F();
H.constructor = G;
k(H, E.prototype);
H.isPureReactComponent = !0;
var I = {
  current: null
},
    J = {
  current: null
},
    K = Object.prototype.hasOwnProperty,
    L = {
  key: !0,
  ref: !0,
  __self: !0,
  __source: !0
};

function M(a, b, d) {
  var c = void 0,
      e = {},
      g = null,
      h = null;
  if (null != b) for (c in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (g = "" + b.key), b) K.call(b, c) && !L.hasOwnProperty(c) && (e[c] = b[c]);
  var f = arguments.length - 2;
  if (1 === f) e.children = d;else if (1 < f) {
    for (var l = Array(f), m = 0; m < f; m++) l[m] = arguments[m + 2];

    e.children = l;
  }
  if (a && a.defaultProps) for (c in f = a.defaultProps, f) void 0 === e[c] && (e[c] = f[c]);
  return {
    $$typeof: p,
    type: a,
    key: g,
    ref: h,
    props: e,
    _owner: J.current
  };
}

function da(a, b) {
  return {
    $$typeof: p,
    type: a.type,
    key: b,
    ref: a.ref,
    props: a.props,
    _owner: a._owner
  };
}

function N(a) {
  return "object" === typeof a && null !== a && a.$$typeof === p;
}

function escape(a) {
  var b = {
    "=": "=0",
    ":": "=2"
  };
  return "$" + ("" + a).replace(/[=:]/g, function (a) {
    return b[a];
  });
}

var O = /\/+/g,
    P = [];

function Q(a, b, d, c) {
  if (P.length) {
    var e = P.pop();
    e.result = a;
    e.keyPrefix = b;
    e.func = d;
    e.context = c;
    e.count = 0;
    return e;
  }

  return {
    result: a,
    keyPrefix: b,
    func: d,
    context: c,
    count: 0
  };
}

function R(a) {
  a.result = null;
  a.keyPrefix = null;
  a.func = null;
  a.context = null;
  a.count = 0;
  10 > P.length && P.push(a);
}

function S(a, b, d, c) {
  var e = typeof a;
  if ("undefined" === e || "boolean" === e) a = null;
  var g = !1;
  if (null === a) g = !0;else switch (e) {
    case "string":
    case "number":
      g = !0;
      break;

    case "object":
      switch (a.$$typeof) {
        case p:
        case q:
          g = !0;
      }

  }
  if (g) return d(c, a, "" === b ? "." + T(a, 0) : b), 1;
  g = 0;
  b = "" === b ? "." : b + ":";
  if (Array.isArray(a)) for (var h = 0; h < a.length; h++) {
    e = a[h];
    var f = b + T(e, h);
    g += S(e, f, d, c);
  } else if (null === a || "object" !== typeof a ? f = null : (f = A && a[A] || a["@@iterator"], f = "function" === typeof f ? f : null), "function" === typeof f) for (a = f.call(a), h = 0; !(e = a.next()).done;) e = e.value, f = b + T(e, h++), g += S(e, f, d, c);else "object" === e && (d = "" + a, B("31", "[object Object]" === d ? "object with keys {" + Object.keys(a).join(", ") + "}" : d, ""));
  return g;
}

function U(a, b, d) {
  return null == a ? 0 : S(a, "", b, d);
}

function T(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape(a.key) : b.toString(36);
}

function ea(a, b) {
  a.func.call(a.context, b, a.count++);
}

function fa(a, b, d) {
  var c = a.result,
      e = a.keyPrefix;
  a = a.func.call(a.context, b, a.count++);
  Array.isArray(a) ? V(a, c, d, function (a) {
    return a;
  }) : null != a && (N(a) && (a = da(a, e + (!a.key || b && b.key === a.key ? "" : ("" + a.key).replace(O, "$&/") + "/") + d)), c.push(a));
}

function V(a, b, d, c, e) {
  var g = "";
  null != d && (g = ("" + d).replace(O, "$&/") + "/");
  b = Q(b, g, c, e);
  U(a, fa, b);
  R(b);
}

function W() {
  var a = I.current;
  null === a ? B("321") : void 0;
  return a;
}

var X = {
  Children: {
    map: function (a, b, d) {
      if (null == a) return a;
      var c = [];
      V(a, c, null, b, d);
      return c;
    },
    forEach: function (a, b, d) {
      if (null == a) return a;
      b = Q(null, null, b, d);
      U(a, ea, b);
      R(b);
    },
    count: function (a) {
      return U(a, function () {
        return null;
      }, null);
    },
    toArray: function (a) {
      var b = [];
      V(a, b, null, function (a) {
        return a;
      });
      return b;
    },
    only: function (a) {
      N(a) ? void 0 : B("143");
      return a;
    }
  },
  createRef: function () {
    return {
      current: null
    };
  },
  Component: E,
  PureComponent: G,
  createContext: function (a, b) {
    void 0 === b && (b = null);
    a = {
      $$typeof: w,
      _calculateChangedBits: b,
      _currentValue: a,
      _currentValue2: a,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    };
    a.Provider = {
      $$typeof: v,
      _context: a
    };
    return a.Consumer = a;
  },
  forwardRef: function (a) {
    return {
      $$typeof: y,
      render: a
    };
  },
  lazy: function (a) {
    return {
      $$typeof: ba,
      _ctor: a,
      _status: -1,
      _result: null
    };
  },
  memo: function (a, b) {
    return {
      $$typeof: aa,
      type: a,
      compare: void 0 === b ? null : b
    };
  },
  useCallback: function (a, b) {
    return W().useCallback(a, b);
  },
  useContext: function (a, b) {
    return W().useContext(a, b);
  },
  useEffect: function (a, b) {
    return W().useEffect(a, b);
  },
  useImperativeHandle: function (a, b, d) {
    return W().useImperativeHandle(a, b, d);
  },
  useDebugValue: function () {},
  useLayoutEffect: function (a, b) {
    return W().useLayoutEffect(a, b);
  },
  useMemo: function (a, b) {
    return W().useMemo(a, b);
  },
  useReducer: function (a, b, d) {
    return W().useReducer(a, b, d);
  },
  useRef: function (a) {
    return W().useRef(a);
  },
  useState: function (a) {
    return W().useState(a);
  },
  Fragment: r,
  StrictMode: t,
  Suspense: z,
  createElement: M,
  cloneElement: function (a, b, d) {
    null === a || void 0 === a ? B("267", a) : void 0;
    var c = void 0,
        e = k({}, a.props),
        g = a.key,
        h = a.ref,
        f = a._owner;

    if (null != b) {
      void 0 !== b.ref && (h = b.ref, f = J.current);
      void 0 !== b.key && (g = "" + b.key);
      var l = void 0;
      a.type && a.type.defaultProps && (l = a.type.defaultProps);

      for (c in b) K.call(b, c) && !L.hasOwnProperty(c) && (e[c] = void 0 === b[c] && void 0 !== l ? l[c] : b[c]);
    }

    c = arguments.length - 2;
    if (1 === c) e.children = d;else if (1 < c) {
      l = Array(c);

      for (var m = 0; m < c; m++) l[m] = arguments[m + 2];

      e.children = l;
    }
    return {
      $$typeof: p,
      type: a.type,
      key: g,
      ref: h,
      props: e,
      _owner: f
    };
  },
  createFactory: function (a) {
    var b = M.bind(null, a);
    b.type = a;
    return b;
  },
  isValidElement: N,
  version: "16.8.6",
  unstable_ConcurrentMode: x,
  unstable_Profiler: u,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    ReactCurrentDispatcher: I,
    ReactCurrentOwner: J,
    assign: k
  }
},
    Y = {
  default: X
},
    Z = Y && X || Y;
module.exports = Z.default || Z;
},{"object-assign":"J4Nk"}],"1n8/":[function(require,module,exports) {
'use strict';

if ("production" === 'production') {
  module.exports = require('./cjs/react.production.min.js');
} else {
  module.exports = require('./cjs/react.development.js');
}
},{"./cjs/react.production.min.js":"awqi"}],"Asjh":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],"wVGV":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./lib/ReactPropTypesSecret":"Asjh"}],"5D9O":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
if ("production" !== 'production') {
  var ReactIs = require('react-is'); // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod


  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}
},{"./factoryWithThrowingShims":"wVGV"}],"NWdv":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useDebouncedCallback(callback, delay, options) {
    if (options === void 0) { options = {}; }
    var maxWait = options.maxWait;
    var maxWaitHandler = react_1.useRef(null);
    var maxWaitArgs = react_1.useRef([]);
    var functionTimeoutHandler = react_1.useRef(null);
    var isComponentUnmounted = react_1.useRef(false);
    var debouncedFunction = callback;
    var cancelDebouncedCallback = react_1.useCallback(function () {
        clearTimeout(functionTimeoutHandler.current);
        clearTimeout(maxWaitHandler.current);
        maxWaitHandler.current = null;
        maxWaitArgs.current = [];
        functionTimeoutHandler.current = null;
    }, []);
    react_1.useEffect(function () { return function () {
        // we use flag, as we allow to call callPending outside the hook
        isComponentUnmounted.current = true;
    }; }, []);
    var debouncedCallback = react_1.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        maxWaitArgs.current = args;
        clearTimeout(functionTimeoutHandler.current);
        functionTimeoutHandler.current = setTimeout(function () {
            cancelDebouncedCallback();
            if (!isComponentUnmounted.current) {
                debouncedFunction.apply(void 0, args);
            }
        }, delay);
        if (maxWait && !maxWaitHandler.current) {
            maxWaitHandler.current = setTimeout(function () {
                var args = maxWaitArgs.current;
                cancelDebouncedCallback();
                if (!isComponentUnmounted.current) {
                    debouncedFunction.apply(null, args);
                }
            }, maxWait);
        }
    }, [debouncedFunction, maxWait, delay, cancelDebouncedCallback]);
    var callPending = function () {
        // Call pending callback only if we have anything in our queue
        if (!functionTimeoutHandler.current) {
            return;
        }
        debouncedFunction.apply(null, maxWaitArgs.current);
        cancelDebouncedCallback();
    };
    // At the moment, we use 3 args array so that we save backward compatibility
    return [debouncedCallback, cancelDebouncedCallback, callPending];
}
exports.default = useDebouncedCallback;

},{"react":"1n8/"}],"fb8C":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var callback_1 = require("./callback");
function useDebounce(value, delay, options) {
    var _a = react_1.useState(value), state = _a[0], dispatch = _a[1];
    var _b = callback_1.default(react_1.useCallback(function (value) { return dispatch(value); }, []), delay, options), callback = _b[0], cancel = _b[1];
    var previousValue = react_1.useRef(value);
    react_1.useEffect(function () {
        // We need to use this condition otherwise we will run debounce timer for the first render (including maxWait option)
        if (previousValue.current !== value) {
            callback(value);
            previousValue.current = value;
        }
    }, [value, callback]);
    return [state, cancel];
}
exports.default = useDebounce;

},{"react":"1n8/","./callback":"NWdv"}],"Pau+":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cache_1 = require("./cache");
exports.useDebounce = cache_1.default;
var callback_1 = require("./callback");
exports.useDebouncedCallback = callback_1.default;

},{"./cache":"fb8C","./callback":"NWdv"}],"Vdi9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _useDebounce = require("use-debounce");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
var style = {
  wrapper: {//overflowY: 'auto',
  }
};
var scrollDebounceMs = 30;

var AdaptiveList = function AdaptiveList(_ref) {
  var initialData = _ref.initialData,
      isCompleteOnInit = _ref.isCompleteOnInit,
      onLoadMore = _ref.onLoadMore,
      renderRow = _ref.renderRow,
      renderEmptyList = _ref.renderEmptyList,
      renderLoadingMore = _ref.renderLoadingMore,
      renderTombstone = _ref.renderTombstone,
      rowHeight = _ref.rowHeight,
      _ref$overscanAmount = _ref.overscanAmount,
      overscanAmount = _ref$overscanAmount === void 0 ? 5 : _ref$overscanAmount,
      _ref$loadingMoreStyle = _ref.loadingMoreStyle,
      loadingMoreStyle = _ref$loadingMoreStyle === void 0 ? "loadingindicator" : _ref$loadingMoreStyle;

  //console.log("AdaptiveList::ctor");
  // default loadingMore if none is provided
  if (!renderLoadingMore) {
    renderLoadingMore = function renderLoadingMore() {
      return _react.default.createElement("div", null, "Loading ...");
    };
  }

  if (!renderTombstone) {
    renderTombstone = function renderTombstone(computedStyle) {
      return _react.default.createElement("div", {
        style: _objectSpread({}, computedStyle)
      });
    };
  }

  var _useState = (0, _react.useState)({
    items: initialData,
    isComplete: isCompleteOnInit,
    isLoadingMore: false,
    wrapperHeight: 0,
    wrapperVisibleHeight: 0,
    viewportScrollTop: 0,
    viewportScrollHeight: 0,
    viewportScrollPosition: 0,
    reachedLimit: false
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var overscan = rowHeight * overscanAmount;
  var setIsLoadingMore = (0, _react.useCallback)(function (isLoadingMore) {
    // setState(prevState => ({
    //   ...prevState,
    //   isLoadingMore: isLoadingMore
    // }));
    setState(function (prevState) {
      return _objectSpread({}, prevState, {
        isLoadingMore: isLoadingMore
      });
    }); // TODO:
  }, []); // DOM reference to wrapping viewport element

  var viewportWrapperElRef = (0, _react.useRef)(); // DOM reference to 'load more' element at end of list.
  // if this is visibile or within overscan, trigger request
  // for more data

  var loadMoreElRef = (0, _react.useRef)();

  var getViewportWrapper = function getViewportWrapper() {
    return viewportWrapperElRef.current;
  };

  var getLoadMoreEl = function getLoadMoreEl() {
    return loadMoreElRef.current;
  };

  var getVisibleHeight = (0, _react.useCallback)(function () {
    var el = getViewportWrapper();
    var visHeight = el ? parseFloat(window.getComputedStyle(el, null).getPropertyValue("height")) : 10000; //console.log(visHeight, el);

    return visHeight;
  }, []); //const getViewportWrapperClientRect = () => getViewportWrapper().getBoundingClientRect();
  // Debounce callback
  // https://github.com/xnimorz/use-debounce
  // Use { maxWait: 2000 } to emulate throttle?
  // https://github.com/xnimorz/use-debounce/blob/master/src/callback.js

  var _useDebouncedCallback = (0, _useDebounce.useDebouncedCallback)( // function
  function (e) {
    //console.log("handleScroll");
    setState(function (prevState) {
      return _objectSpread({}, prevState, {
        wrapperHeight: e.target.offsetHeight,
        wrapperVisibleHeight: getVisibleHeight(),
        viewportScrollTop: e.target.scrollTop,
        viewportScrollHeight: e.target.scrollHeight,
        reachedLimit: e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight
      });
    });
  }, // delay in ms
  scrollDebounceMs, {
    maxWait: scrollDebounceMs
  }),
      _useDebouncedCallback2 = _slicedToArray(_useDebouncedCallback, 1),
      handleScroll = _useDebouncedCallback2[0];

  var getElementPos = function getElementPos(el) {
    return {
      offsetHeight: el.offsetHeight,
      offsetTop: el.offsetTop,
      scrollTop: el.scrollTop,
      scrollHeight: el.scrollHeight
    };
  };

  var shouldLoadMore = function shouldLoadMore() {
    // don't attempt loading more if already in flight
    // drop out immediately on these flags to optimise repeat calls early
    if (state.isComplete || state.isLoadingMore) return false;
    var viewportWrapper = getViewportWrapper();
    var loadMoreEl = getLoadMoreEl();
    var currentWrapperPos = viewportWrapper && getElementPos(viewportWrapper);
    var latestWrapperPos = loadMoreEl && getElementPos(loadMoreEl); //const visibleHeight = getVisibleHeight();
    //console.log('shouldLoadMore', state.items.length, { isComplete: state.isComplete, isLoadingMore: state.isLoadingMore }, currentWrapperPos, loadMoreEl, latestWrapperPos);
    // drop out if initialising

    if (!currentWrapperPos || !latestWrapperPos) return false; // if loadMoreElRef is visible or within overscan, request more data

    var loadingVisible = loadMoreEl.offsetTop - viewportWrapper.offsetTop < viewportWrapper.offsetHeight + viewportWrapper.scrollTop;
    /* console.log("shouldLoadMore", {
      loadMoreOffTop: loadMoreEl.offsetTop,
      wrapperOffTop: viewportWrapper.offsetTop,
      wrapperOffHeight: viewportWrapper.offsetHeight,
      wrapperScrollTop: viewportWrapper.scrollTop,
      loadMoreVis: loadingVisible,
      isLoadingMore: state.isLoadingMore
    }); */

    if (!loadingVisible) {
      //console.log("EXIT");
      return false;
    } else {
      //console.log("LOAD MORE");
      setIsLoadingMore(true);
      onLoadMore(onMoreLoaded);
      return true;
    }
  }; //, [state.isComplete, state.isLoadingMore]);
  // callback when container component provides more
  // data after side effects


  var onMoreLoaded = function onMoreLoaded(_ref2) {
    var items = _ref2.items,
        complete = _ref2.complete;
    //console.log('onMoreLoaded', state.items.length, items.length, complete);
    setState(function (prevState) {
      return _objectSpread({}, prevState, {
        items: [].concat(_toConsumableArray(prevState.items), _toConsumableArray(items)),
        isComplete: complete,
        // mark component as ready to load more
        isLoadingMore: false
      });
    });
  };

  var isRowVisibleInViewPort = (0, _react.useCallback)(function (rowIndex) {
    var includeTopOverscan = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var visibleHeight = getVisibleHeight(); // render nothing until DOM established

    if (visibleHeight === 0) return false;
    var overscanAdjusted = includeTopOverscan ? overscan : 0;
    var rowTop = rowIndex * rowHeight;
    var rowBottom = rowTop + rowHeight;
    var topVis = rowTop >= state.viewportScrollTop - overscanAdjusted;
    var bottomVis = rowBottom <= state.viewportScrollTop + visibleHeight + overscan;
    /*
    console.log("isRowVisibleInViewPort", {
      rowIndex,
      rowBottom,
      vwScrollTop: state.viewportScrollTop,
      vwHeight: visibleHeight,
      topVis,
      bottomVis
    });
    */

    return topVis && bottomVis;
  }, [rowHeight, overscan, state.viewportScrollTop, getVisibleHeight]);
  var visibleTombStonePositions = (0, _react.useCallback)(function () {
    // spec. Generate 'fake' ts rows for every items beyond the current viewport, up to one page deep
    var tombStoneStartingTop = function tombStoneStartingTop(tombStoneIndex) {
      return tombStoneIndex * rowHeight;
    };

    var lastItemIndex = state.items.length - 1;
    var tombstones = [];

    while (isRowVisibleInViewPort(++lastItemIndex, false)) {
      tombstones.push({
        index: "ts".concat(lastItemIndex),
        top: "".concat(tombStoneStartingTop(lastItemIndex), "px")
      });
    }

    return tombstones;
  }, [rowHeight, state.items.length]); // on mount

  (0, _react.useEffect)(function () {
    getViewportWrapper().addEventListener("resize", handleScroll);
    getViewportWrapper().addEventListener("scroll", handleScroll, {
      passive: true
    }); // trigger on mount

    shouldLoadMore("onmount"); // detach on unmount

    return function () {
      var wrapperRef = getViewportWrapper();
      wrapperRef && getViewportWrapper().removeEventListener("scroll", handleScroll);
      wrapperRef && getViewportWrapper().removeEventListener("resize", handleScroll);
    };
  }, []);
  return _react.default.createElement("div", {
    className: "AdaptiveList",
    style: style.wrapper,
    ref: viewportWrapperElRef
  }, state.isComplete && state.items.length === 0 && renderEmptyList(), state.items.map(function (item, index) {
    return isRowVisibleInViewPort(index) && renderRow({
      index: index,
      item: item,
      computedStyle: {
        top: index * rowHeight
      }
    });
  }), state.isLoadingMore && loadingMoreStyle === "tombstones" && visibleTombStonePositions().map(function (tombStoneInfo) {
    return renderTombstone(tombStoneInfo);
  }), _react.default.createElement("div", {
    ref: loadMoreElRef,
    style: {
      position: "absolute",
      top: state.items.length * rowHeight
    }
  }, // show loading indictor if loading more or load initiated
  // via shouldLoadMore(), and if set style
  (state.isLoadingMore || shouldLoadMore()) && loadingMoreStyle === "loadingindicator" ? renderLoadingMore() : _react.default.createElement("div", null, "Loading")));
};

AdaptiveList.propTypes = {
  initialData: _propTypes.default.array.isRequired,
  isCompleteOnInit: _propTypes.default.bool.isRequired,
  onLoadMore: _propTypes.default.func.isRequired,
  renderRow: _propTypes.default.func.isRequired,
  renderEmptyList: _propTypes.default.func.isRequired,
  renderLoadingMore: _propTypes.default.func,
  renderTombstone: _propTypes.default.func,
  overscanAmount: _propTypes.default.number
};

var _default = _react.default.memo(AdaptiveList);

exports.default = _default;
},{"react":"1n8/","prop-types":"5D9O","use-debounce":"Pau+"}]},{},["Vdi9"], "react-adaptive-list")
//# sourceMappingURL=/AdaptiveList.js.map