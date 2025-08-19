function Im(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Yf = { exports: {} }, I = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var br = Symbol.for("react.element"), jm = Symbol.for("react.portal"), Fm = Symbol.for("react.fragment"), Om = Symbol.for("react.strict_mode"), zm = Symbol.for("react.profiler"), Bm = Symbol.for("react.provider"), Um = Symbol.for("react.context"), $m = Symbol.for("react.forward_ref"), Wm = Symbol.for("react.suspense"), Hm = Symbol.for("react.memo"), Km = Symbol.for("react.lazy"), xu = Symbol.iterator;
function Gm(e) {
  return e === null || typeof e != "object" ? null : (e = xu && e[xu] || e["@@iterator"], typeof e == "function" ? e : null);
}
var Xf = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, Zf = Object.assign, Jf = {};
function Zn(e, t, n) {
  this.props = e, this.context = t, this.refs = Jf, this.updater = n || Xf;
}
Zn.prototype.isReactComponent = {};
Zn.prototype.setState = function(e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, e, t, "setState");
};
Zn.prototype.forceUpdate = function(e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function qf() {
}
qf.prototype = Zn.prototype;
function Gl(e, t, n) {
  this.props = e, this.context = t, this.refs = Jf, this.updater = n || Xf;
}
var Ql = Gl.prototype = new qf();
Ql.constructor = Gl;
Zf(Ql, Zn.prototype);
Ql.isPureReactComponent = !0;
var ku = Array.isArray, bf = Object.prototype.hasOwnProperty, Yl = { current: null }, ed = { key: !0, ref: !0, __self: !0, __source: !0 };
function td(e, t, n) {
  var r, i = {}, s = null, o = null;
  if (t != null) for (r in t.ref !== void 0 && (o = t.ref), t.key !== void 0 && (s = "" + t.key), t) bf.call(t, r) && !ed.hasOwnProperty(r) && (i[r] = t[r]);
  var l = arguments.length - 2;
  if (l === 1) i.children = n;
  else if (1 < l) {
    for (var a = Array(l), u = 0; u < l; u++) a[u] = arguments[u + 2];
    i.children = a;
  }
  if (e && e.defaultProps) for (r in l = e.defaultProps, l) i[r] === void 0 && (i[r] = l[r]);
  return { $$typeof: br, type: e, key: s, ref: o, props: i, _owner: Yl.current };
}
function Qm(e, t) {
  return { $$typeof: br, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner };
}
function Xl(e) {
  return typeof e == "object" && e !== null && e.$$typeof === br;
}
function Ym(e) {
  var t = { "=": "=0", ":": "=2" };
  return "$" + e.replace(/[=:]/g, function(n) {
    return t[n];
  });
}
var Pu = /\/+/g;
function Zs(e, t) {
  return typeof e == "object" && e !== null && e.key != null ? Ym("" + e.key) : t.toString(36);
}
function Ni(e, t, n, r, i) {
  var s = typeof e;
  (s === "undefined" || s === "boolean") && (e = null);
  var o = !1;
  if (e === null) o = !0;
  else switch (s) {
    case "string":
    case "number":
      o = !0;
      break;
    case "object":
      switch (e.$$typeof) {
        case br:
        case jm:
          o = !0;
      }
  }
  if (o) return o = e, i = i(o), e = r === "" ? "." + Zs(o, 0) : r, ku(i) ? (n = "", e != null && (n = e.replace(Pu, "$&/") + "/"), Ni(i, t, n, "", function(u) {
    return u;
  })) : i != null && (Xl(i) && (i = Qm(i, n + (!i.key || o && o.key === i.key ? "" : ("" + i.key).replace(Pu, "$&/") + "/") + e)), t.push(i)), 1;
  if (o = 0, r = r === "" ? "." : r + ":", ku(e)) for (var l = 0; l < e.length; l++) {
    s = e[l];
    var a = r + Zs(s, l);
    o += Ni(s, t, n, a, i);
  }
  else if (a = Gm(e), typeof a == "function") for (e = a.call(e), l = 0; !(s = e.next()).done; ) s = s.value, a = r + Zs(s, l++), o += Ni(s, t, n, a, i);
  else if (s === "object") throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
  return o;
}
function ci(e, t, n) {
  if (e == null) return e;
  var r = [], i = 0;
  return Ni(e, r, "", "", function(s) {
    return t.call(n, s, i++);
  }), r;
}
function Xm(e) {
  if (e._status === -1) {
    var t = e._result;
    t = t(), t.then(function(n) {
      (e._status === 0 || e._status === -1) && (e._status = 1, e._result = n);
    }, function(n) {
      (e._status === 0 || e._status === -1) && (e._status = 2, e._result = n);
    }), e._status === -1 && (e._status = 0, e._result = t);
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var xe = { current: null }, Ii = { transition: null }, Zm = { ReactCurrentDispatcher: xe, ReactCurrentBatchConfig: Ii, ReactCurrentOwner: Yl };
function nd() {
  throw Error("act(...) is not supported in production builds of React.");
}
I.Children = { map: ci, forEach: function(e, t, n) {
  ci(e, function() {
    t.apply(this, arguments);
  }, n);
}, count: function(e) {
  var t = 0;
  return ci(e, function() {
    t++;
  }), t;
}, toArray: function(e) {
  return ci(e, function(t) {
    return t;
  }) || [];
}, only: function(e) {
  if (!Xl(e)) throw Error("React.Children.only expected to receive a single React element child.");
  return e;
} };
I.Component = Zn;
I.Fragment = Fm;
I.Profiler = zm;
I.PureComponent = Gl;
I.StrictMode = Om;
I.Suspense = Wm;
I.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Zm;
I.act = nd;
I.cloneElement = function(e, t, n) {
  if (e == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
  var r = Zf({}, e.props), i = e.key, s = e.ref, o = e._owner;
  if (t != null) {
    if (t.ref !== void 0 && (s = t.ref, o = Yl.current), t.key !== void 0 && (i = "" + t.key), e.type && e.type.defaultProps) var l = e.type.defaultProps;
    for (a in t) bf.call(t, a) && !ed.hasOwnProperty(a) && (r[a] = t[a] === void 0 && l !== void 0 ? l[a] : t[a]);
  }
  var a = arguments.length - 2;
  if (a === 1) r.children = n;
  else if (1 < a) {
    l = Array(a);
    for (var u = 0; u < a; u++) l[u] = arguments[u + 2];
    r.children = l;
  }
  return { $$typeof: br, type: e.type, key: i, ref: s, props: r, _owner: o };
};
I.createContext = function(e) {
  return e = { $$typeof: Um, _currentValue: e, _currentValue2: e, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, e.Provider = { $$typeof: Bm, _context: e }, e.Consumer = e;
};
I.createElement = td;
I.createFactory = function(e) {
  var t = td.bind(null, e);
  return t.type = e, t;
};
I.createRef = function() {
  return { current: null };
};
I.forwardRef = function(e) {
  return { $$typeof: $m, render: e };
};
I.isValidElement = Xl;
I.lazy = function(e) {
  return { $$typeof: Km, _payload: { _status: -1, _result: e }, _init: Xm };
};
I.memo = function(e, t) {
  return { $$typeof: Hm, type: e, compare: t === void 0 ? null : t };
};
I.startTransition = function(e) {
  var t = Ii.transition;
  Ii.transition = {};
  try {
    e();
  } finally {
    Ii.transition = t;
  }
};
I.unstable_act = nd;
I.useCallback = function(e, t) {
  return xe.current.useCallback(e, t);
};
I.useContext = function(e) {
  return xe.current.useContext(e);
};
I.useDebugValue = function() {
};
I.useDeferredValue = function(e) {
  return xe.current.useDeferredValue(e);
};
I.useEffect = function(e, t) {
  return xe.current.useEffect(e, t);
};
I.useId = function() {
  return xe.current.useId();
};
I.useImperativeHandle = function(e, t, n) {
  return xe.current.useImperativeHandle(e, t, n);
};
I.useInsertionEffect = function(e, t) {
  return xe.current.useInsertionEffect(e, t);
};
I.useLayoutEffect = function(e, t) {
  return xe.current.useLayoutEffect(e, t);
};
I.useMemo = function(e, t) {
  return xe.current.useMemo(e, t);
};
I.useReducer = function(e, t, n) {
  return xe.current.useReducer(e, t, n);
};
I.useRef = function(e) {
  return xe.current.useRef(e);
};
I.useState = function(e) {
  return xe.current.useState(e);
};
I.useSyncExternalStore = function(e, t, n) {
  return xe.current.useSyncExternalStore(e, t, n);
};
I.useTransition = function() {
  return xe.current.useTransition();
};
I.version = "18.3.1";
Yf.exports = I;
var C = Yf.exports;
const Jm = /* @__PURE__ */ Im(C);
var Fo = {}, rd = { exports: {} }, Ne = {}, id = { exports: {} }, sd = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(e) {
  function t(A, V) {
    var L = A.length;
    A.push(V);
    e: for (; 0 < L; ) {
      var b = L - 1 >>> 1, se = A[b];
      if (0 < i(se, V)) A[b] = V, A[L] = se, L = b;
      else break e;
    }
  }
  function n(A) {
    return A.length === 0 ? null : A[0];
  }
  function r(A) {
    if (A.length === 0) return null;
    var V = A[0], L = A.pop();
    if (L !== V) {
      A[0] = L;
      e: for (var b = 0, se = A.length, ai = se >>> 1; b < ai; ) {
        var Gt = 2 * (b + 1) - 1, Xs = A[Gt], Qt = Gt + 1, ui = A[Qt];
        if (0 > i(Xs, L)) Qt < se && 0 > i(ui, Xs) ? (A[b] = ui, A[Qt] = L, b = Qt) : (A[b] = Xs, A[Gt] = L, b = Gt);
        else if (Qt < se && 0 > i(ui, L)) A[b] = ui, A[Qt] = L, b = Qt;
        else break e;
      }
    }
    return V;
  }
  function i(A, V) {
    var L = A.sortIndex - V.sortIndex;
    return L !== 0 ? L : A.id - V.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var s = performance;
    e.unstable_now = function() {
      return s.now();
    };
  } else {
    var o = Date, l = o.now();
    e.unstable_now = function() {
      return o.now() - l;
    };
  }
  var a = [], u = [], c = 1, f = null, d = 3, y = !1, g = !1, v = !1, x = typeof setTimeout == "function" ? setTimeout : null, p = typeof clearTimeout == "function" ? clearTimeout : null, h = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function m(A) {
    for (var V = n(u); V !== null; ) {
      if (V.callback === null) r(u);
      else if (V.startTime <= A) r(u), V.sortIndex = V.expirationTime, t(a, V);
      else break;
      V = n(u);
    }
  }
  function w(A) {
    if (v = !1, m(A), !g) if (n(a) !== null) g = !0, xt(S);
    else {
      var V = n(u);
      V !== null && B(w, V.startTime - A);
    }
  }
  function S(A, V) {
    g = !1, v && (v = !1, p(k), k = -1), y = !0;
    var L = d;
    try {
      for (m(V), f = n(a); f !== null && (!(f.expirationTime > V) || A && !q()); ) {
        var b = f.callback;
        if (typeof b == "function") {
          f.callback = null, d = f.priorityLevel;
          var se = b(f.expirationTime <= V);
          V = e.unstable_now(), typeof se == "function" ? f.callback = se : f === n(a) && r(a), m(V);
        } else r(a);
        f = n(a);
      }
      if (f !== null) var ai = !0;
      else {
        var Gt = n(u);
        Gt !== null && B(w, Gt.startTime - V), ai = !1;
      }
      return ai;
    } finally {
      f = null, d = L, y = !1;
    }
  }
  var P = !1, E = null, k = -1, _ = 5, M = -1;
  function q() {
    return !(e.unstable_now() - M < _);
  }
  function He() {
    if (E !== null) {
      var A = e.unstable_now();
      M = A;
      var V = !0;
      try {
        V = E(!0, A);
      } finally {
        V ? j() : (P = !1, E = null);
      }
    } else P = !1;
  }
  var j;
  if (typeof h == "function") j = function() {
    h(He);
  };
  else if (typeof MessageChannel < "u") {
    var z = new MessageChannel(), de = z.port2;
    z.port1.onmessage = He, j = function() {
      de.postMessage(null);
    };
  } else j = function() {
    x(He, 0);
  };
  function xt(A) {
    E = A, P || (P = !0, j());
  }
  function B(A, V) {
    k = x(function() {
      A(e.unstable_now());
    }, V);
  }
  e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(A) {
    A.callback = null;
  }, e.unstable_continueExecution = function() {
    g || y || (g = !0, xt(S));
  }, e.unstable_forceFrameRate = function(A) {
    0 > A || 125 < A ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : _ = 0 < A ? Math.floor(1e3 / A) : 5;
  }, e.unstable_getCurrentPriorityLevel = function() {
    return d;
  }, e.unstable_getFirstCallbackNode = function() {
    return n(a);
  }, e.unstable_next = function(A) {
    switch (d) {
      case 1:
      case 2:
      case 3:
        var V = 3;
        break;
      default:
        V = d;
    }
    var L = d;
    d = V;
    try {
      return A();
    } finally {
      d = L;
    }
  }, e.unstable_pauseExecution = function() {
  }, e.unstable_requestPaint = function() {
  }, e.unstable_runWithPriority = function(A, V) {
    switch (A) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        A = 3;
    }
    var L = d;
    d = A;
    try {
      return V();
    } finally {
      d = L;
    }
  }, e.unstable_scheduleCallback = function(A, V, L) {
    var b = e.unstable_now();
    switch (typeof L == "object" && L !== null ? (L = L.delay, L = typeof L == "number" && 0 < L ? b + L : b) : L = b, A) {
      case 1:
        var se = -1;
        break;
      case 2:
        se = 250;
        break;
      case 5:
        se = 1073741823;
        break;
      case 4:
        se = 1e4;
        break;
      default:
        se = 5e3;
    }
    return se = L + se, A = { id: c++, callback: V, priorityLevel: A, startTime: L, expirationTime: se, sortIndex: -1 }, L > b ? (A.sortIndex = L, t(u, A), n(a) === null && A === n(u) && (v ? (p(k), k = -1) : v = !0, B(w, L - b))) : (A.sortIndex = se, t(a, A), g || y || (g = !0, xt(S))), A;
  }, e.unstable_shouldYield = q, e.unstable_wrapCallback = function(A) {
    var V = d;
    return function() {
      var L = d;
      d = V;
      try {
        return A.apply(this, arguments);
      } finally {
        d = L;
      }
    };
  };
})(sd);
id.exports = sd;
var qm = id.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var bm = C, Le = qm;
function T(e) {
  for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var od = /* @__PURE__ */ new Set(), Rr = {};
function hn(e, t) {
  Bn(e, t), Bn(e + "Capture", t);
}
function Bn(e, t) {
  for (Rr[e] = t, e = 0; e < t.length; e++) od.add(t[e]);
}
var mt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Oo = Object.prototype.hasOwnProperty, ey = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Tu = {}, Cu = {};
function ty(e) {
  return Oo.call(Cu, e) ? !0 : Oo.call(Tu, e) ? !1 : ey.test(e) ? Cu[e] = !0 : (Tu[e] = !0, !1);
}
function ny(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r ? !1 : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function ry(e, t, n, r) {
  if (t === null || typeof t > "u" || ny(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null) switch (n.type) {
    case 3:
      return !t;
    case 4:
      return t === !1;
    case 5:
      return isNaN(t);
    case 6:
      return isNaN(t) || 1 > t;
  }
  return !1;
}
function ke(e, t, n, r, i, s, o) {
  this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = i, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = o;
}
var fe = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
  fe[e] = new ke(e, 0, !1, e, null, !1, !1);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
  var t = e[0];
  fe[t] = new ke(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
  fe[e] = new ke(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
  fe[e] = new ke(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
  fe[e] = new ke(e, 3, !1, e.toLowerCase(), null, !1, !1);
});
["checked", "multiple", "muted", "selected"].forEach(function(e) {
  fe[e] = new ke(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function(e) {
  fe[e] = new ke(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function(e) {
  fe[e] = new ke(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function(e) {
  fe[e] = new ke(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var Zl = /[\-:]([a-z])/g;
function Jl(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
  var t = e.replace(
    Zl,
    Jl
  );
  fe[t] = new ke(t, 1, !1, e, null, !1, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
  var t = e.replace(Zl, Jl);
  fe[t] = new ke(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
  var t = e.replace(Zl, Jl);
  fe[t] = new ke(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function(e) {
  fe[e] = new ke(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
fe.xlinkHref = new ke("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(e) {
  fe[e] = new ke(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function ql(e, t, n, r) {
  var i = fe.hasOwnProperty(t) ? fe[t] : null;
  (i !== null ? i.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (ry(t, n, i, r) && (n = null), r || i === null ? ty(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : i.mustUseProperty ? e[i.propertyName] = n === null ? i.type === 3 ? !1 : "" : n : (t = i.attributeName, r = i.attributeNamespace, n === null ? e.removeAttribute(t) : (i = i.type, n = i === 3 || i === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var St = bm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, fi = Symbol.for("react.element"), gn = Symbol.for("react.portal"), vn = Symbol.for("react.fragment"), bl = Symbol.for("react.strict_mode"), zo = Symbol.for("react.profiler"), ld = Symbol.for("react.provider"), ad = Symbol.for("react.context"), ea = Symbol.for("react.forward_ref"), Bo = Symbol.for("react.suspense"), Uo = Symbol.for("react.suspense_list"), ta = Symbol.for("react.memo"), Tt = Symbol.for("react.lazy"), ud = Symbol.for("react.offscreen"), Eu = Symbol.iterator;
function tr(e) {
  return e === null || typeof e != "object" ? null : (e = Eu && e[Eu] || e["@@iterator"], typeof e == "function" ? e : null);
}
var X = Object.assign, Js;
function cr(e) {
  if (Js === void 0) try {
    throw Error();
  } catch (n) {
    var t = n.stack.trim().match(/\n( *(at )?)/);
    Js = t && t[1] || "";
  }
  return `
` + Js + e;
}
var qs = !1;
function bs(e, t) {
  if (!e || qs) return "";
  qs = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t) if (t = function() {
      throw Error();
    }, Object.defineProperty(t.prototype, "props", { set: function() {
      throw Error();
    } }), typeof Reflect == "object" && Reflect.construct) {
      try {
        Reflect.construct(t, []);
      } catch (u) {
        var r = u;
      }
      Reflect.construct(e, [], t);
    } else {
      try {
        t.call();
      } catch (u) {
        r = u;
      }
      e.call(t.prototype);
    }
    else {
      try {
        throw Error();
      } catch (u) {
        r = u;
      }
      e();
    }
  } catch (u) {
    if (u && r && typeof u.stack == "string") {
      for (var i = u.stack.split(`
`), s = r.stack.split(`
`), o = i.length - 1, l = s.length - 1; 1 <= o && 0 <= l && i[o] !== s[l]; ) l--;
      for (; 1 <= o && 0 <= l; o--, l--) if (i[o] !== s[l]) {
        if (o !== 1 || l !== 1)
          do
            if (o--, l--, 0 > l || i[o] !== s[l]) {
              var a = `
` + i[o].replace(" at new ", " at ");
              return e.displayName && a.includes("<anonymous>") && (a = a.replace("<anonymous>", e.displayName)), a;
            }
          while (1 <= o && 0 <= l);
        break;
      }
    }
  } finally {
    qs = !1, Error.prepareStackTrace = n;
  }
  return (e = e ? e.displayName || e.name : "") ? cr(e) : "";
}
function iy(e) {
  switch (e.tag) {
    case 5:
      return cr(e.type);
    case 16:
      return cr("Lazy");
    case 13:
      return cr("Suspense");
    case 19:
      return cr("SuspenseList");
    case 0:
    case 2:
    case 15:
      return e = bs(e.type, !1), e;
    case 11:
      return e = bs(e.type.render, !1), e;
    case 1:
      return e = bs(e.type, !0), e;
    default:
      return "";
  }
}
function $o(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case vn:
      return "Fragment";
    case gn:
      return "Portal";
    case zo:
      return "Profiler";
    case bl:
      return "StrictMode";
    case Bo:
      return "Suspense";
    case Uo:
      return "SuspenseList";
  }
  if (typeof e == "object") switch (e.$$typeof) {
    case ad:
      return (e.displayName || "Context") + ".Consumer";
    case ld:
      return (e._context.displayName || "Context") + ".Provider";
    case ea:
      var t = e.render;
      return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
    case ta:
      return t = e.displayName || null, t !== null ? t : $o(e.type) || "Memo";
    case Tt:
      t = e._payload, e = e._init;
      try {
        return $o(e(t));
      } catch {
      }
  }
  return null;
}
function sy(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return $o(t);
    case 8:
      return t === bl ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function Ot(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function cd(e) {
  var t = e.type;
  return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
}
function oy(e) {
  var t = cd(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
  if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
    var i = n.get, s = n.set;
    return Object.defineProperty(e, t, { configurable: !0, get: function() {
      return i.call(this);
    }, set: function(o) {
      r = "" + o, s.call(this, o);
    } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
      return r;
    }, setValue: function(o) {
      r = "" + o;
    }, stopTracking: function() {
      e._valueTracker = null, delete e[t];
    } };
  }
}
function di(e) {
  e._valueTracker || (e._valueTracker = oy(e));
}
function fd(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(), r = "";
  return e && (r = cd(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
}
function Zi(e) {
  if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function Wo(e, t) {
  var n = t.checked;
  return X({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
}
function Au(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
  n = Ot(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
}
function dd(e, t) {
  t = t.checked, t != null && ql(e, "checked", t, !1);
}
function Ho(e, t) {
  dd(e, t);
  var n = Ot(t.value), r = t.type;
  if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value") ? Ko(e, t.type, n) : t.hasOwnProperty("defaultValue") && Ko(e, t.type, Ot(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
}
function Du(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
    t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
  }
  n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
}
function Ko(e, t, n) {
  (t !== "number" || Zi(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var fr = Array.isArray;
function Nn(e, t, n, r) {
  if (e = e.options, t) {
    t = {};
    for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
    for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + Ot(n), t = null, i = 0; i < e.length; i++) {
      if (e[i].value === n) {
        e[i].selected = !0, r && (e[i].defaultSelected = !0);
        return;
      }
      t !== null || e[i].disabled || (t = e[i]);
    }
    t !== null && (t.selected = !0);
  }
}
function Go(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(T(91));
  return X({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
}
function Mu(e, t) {
  var n = t.value;
  if (n == null) {
    if (n = t.children, t = t.defaultValue, n != null) {
      if (t != null) throw Error(T(92));
      if (fr(n)) {
        if (1 < n.length) throw Error(T(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), n = t;
  }
  e._wrapperState = { initialValue: Ot(n) };
}
function hd(e, t) {
  var n = Ot(t.value), r = Ot(t.defaultValue);
  n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
}
function Ru(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function pd(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Qo(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml" ? pd(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
}
var hi, md = function(e) {
  return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, i) {
    MSApp.execUnsafeLocalFunction(function() {
      return e(t, n, r, i);
    });
  } : e;
}(function(e, t) {
  if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
  else {
    for (hi = hi || document.createElement("div"), hi.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = hi.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
    for (; t.firstChild; ) e.appendChild(t.firstChild);
  }
});
function Vr(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var gr = {
  animationIterationCount: !0,
  aspectRatio: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridArea: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowSpan: !0,
  gridRowStart: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnSpan: !0,
  gridColumnStart: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  fillOpacity: !0,
  floodOpacity: !0,
  stopOpacity: !0,
  strokeDasharray: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0
}, ly = ["Webkit", "ms", "Moz", "O"];
Object.keys(gr).forEach(function(e) {
  ly.forEach(function(t) {
    t = t + e.charAt(0).toUpperCase() + e.substring(1), gr[t] = gr[e];
  });
});
function yd(e, t, n) {
  return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || gr.hasOwnProperty(e) && gr[e] ? ("" + t).trim() : t + "px";
}
function gd(e, t) {
  e = e.style;
  for (var n in t) if (t.hasOwnProperty(n)) {
    var r = n.indexOf("--") === 0, i = yd(n, t[n], r);
    n === "float" && (n = "cssFloat"), r ? e.setProperty(n, i) : e[n] = i;
  }
}
var ay = X({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
function Yo(e, t) {
  if (t) {
    if (ay[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(T(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(T(60));
      if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(T(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(T(62));
  }
}
function Xo(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var Zo = null;
function na(e) {
  return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
}
var Jo = null, In = null, jn = null;
function Vu(e) {
  if (e = ni(e)) {
    if (typeof Jo != "function") throw Error(T(280));
    var t = e.stateNode;
    t && (t = Vs(t), Jo(e.stateNode, e.type, t));
  }
}
function vd(e) {
  In ? jn ? jn.push(e) : jn = [e] : In = e;
}
function wd() {
  if (In) {
    var e = In, t = jn;
    if (jn = In = null, Vu(e), t) for (e = 0; e < t.length; e++) Vu(t[e]);
  }
}
function Sd(e, t) {
  return e(t);
}
function xd() {
}
var eo = !1;
function kd(e, t, n) {
  if (eo) return e(t, n);
  eo = !0;
  try {
    return Sd(e, t, n);
  } finally {
    eo = !1, (In !== null || jn !== null) && (xd(), wd());
  }
}
function Lr(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = Vs(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(T(231, t, typeof n));
  return n;
}
var qo = !1;
if (mt) try {
  var nr = {};
  Object.defineProperty(nr, "passive", { get: function() {
    qo = !0;
  } }), window.addEventListener("test", nr, nr), window.removeEventListener("test", nr, nr);
} catch {
  qo = !1;
}
function uy(e, t, n, r, i, s, o, l, a) {
  var u = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, u);
  } catch (c) {
    this.onError(c);
  }
}
var vr = !1, Ji = null, qi = !1, bo = null, cy = { onError: function(e) {
  vr = !0, Ji = e;
} };
function fy(e, t, n, r, i, s, o, l, a) {
  vr = !1, Ji = null, uy.apply(cy, arguments);
}
function dy(e, t, n, r, i, s, o, l, a) {
  if (fy.apply(this, arguments), vr) {
    if (vr) {
      var u = Ji;
      vr = !1, Ji = null;
    } else throw Error(T(198));
    qi || (qi = !0, bo = u);
  }
}
function pn(e) {
  var t = e, n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do
      t = e, t.flags & 4098 && (n = t.return), e = t.return;
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function Pd(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
  }
  return null;
}
function Lu(e) {
  if (pn(e) !== e) throw Error(T(188));
}
function hy(e) {
  var t = e.alternate;
  if (!t) {
    if (t = pn(e), t === null) throw Error(T(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var i = n.return;
    if (i === null) break;
    var s = i.alternate;
    if (s === null) {
      if (r = i.return, r !== null) {
        n = r;
        continue;
      }
      break;
    }
    if (i.child === s.child) {
      for (s = i.child; s; ) {
        if (s === n) return Lu(i), e;
        if (s === r) return Lu(i), t;
        s = s.sibling;
      }
      throw Error(T(188));
    }
    if (n.return !== r.return) n = i, r = s;
    else {
      for (var o = !1, l = i.child; l; ) {
        if (l === n) {
          o = !0, n = i, r = s;
          break;
        }
        if (l === r) {
          o = !0, r = i, n = s;
          break;
        }
        l = l.sibling;
      }
      if (!o) {
        for (l = s.child; l; ) {
          if (l === n) {
            o = !0, n = s, r = i;
            break;
          }
          if (l === r) {
            o = !0, r = s, n = i;
            break;
          }
          l = l.sibling;
        }
        if (!o) throw Error(T(189));
      }
    }
    if (n.alternate !== r) throw Error(T(190));
  }
  if (n.tag !== 3) throw Error(T(188));
  return n.stateNode.current === n ? e : t;
}
function Td(e) {
  return e = hy(e), e !== null ? Cd(e) : null;
}
function Cd(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = Cd(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Ed = Le.unstable_scheduleCallback, _u = Le.unstable_cancelCallback, py = Le.unstable_shouldYield, my = Le.unstable_requestPaint, te = Le.unstable_now, yy = Le.unstable_getCurrentPriorityLevel, ra = Le.unstable_ImmediatePriority, Ad = Le.unstable_UserBlockingPriority, bi = Le.unstable_NormalPriority, gy = Le.unstable_LowPriority, Dd = Le.unstable_IdlePriority, As = null, nt = null;
function vy(e) {
  if (nt && typeof nt.onCommitFiberRoot == "function") try {
    nt.onCommitFiberRoot(As, e, void 0, (e.current.flags & 128) === 128);
  } catch {
  }
}
var Ze = Math.clz32 ? Math.clz32 : xy, wy = Math.log, Sy = Math.LN2;
function xy(e) {
  return e >>>= 0, e === 0 ? 32 : 31 - (wy(e) / Sy | 0) | 0;
}
var pi = 64, mi = 4194304;
function dr(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function es(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0, i = e.suspendedLanes, s = e.pingedLanes, o = n & 268435455;
  if (o !== 0) {
    var l = o & ~i;
    l !== 0 ? r = dr(l) : (s &= o, s !== 0 && (r = dr(s)));
  } else o = n & ~i, o !== 0 ? r = dr(o) : s !== 0 && (r = dr(s));
  if (r === 0) return 0;
  if (t !== 0 && t !== r && !(t & i) && (i = r & -r, s = t & -t, i >= s || i === 16 && (s & 4194240) !== 0)) return t;
  if (r & 4 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - Ze(t), i = 1 << n, r |= e[n], t &= ~i;
  return r;
}
function ky(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function Py(e, t) {
  for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, s = e.pendingLanes; 0 < s; ) {
    var o = 31 - Ze(s), l = 1 << o, a = i[o];
    a === -1 ? (!(l & n) || l & r) && (i[o] = ky(l, t)) : a <= t && (e.expiredLanes |= l), s &= ~l;
  }
}
function el(e) {
  return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
}
function Md() {
  var e = pi;
  return pi <<= 1, !(pi & 4194240) && (pi = 64), e;
}
function to(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function ei(e, t, n) {
  e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Ze(t), e[t] = n;
}
function Ty(e, t) {
  var n = e.pendingLanes & ~t;
  e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var i = 31 - Ze(n), s = 1 << i;
    t[i] = 0, r[i] = -1, e[i] = -1, n &= ~s;
  }
}
function ia(e, t) {
  var n = e.entangledLanes |= t;
  for (e = e.entanglements; n; ) {
    var r = 31 - Ze(n), i = 1 << r;
    i & t | e[r] & t && (e[r] |= t), n &= ~i;
  }
}
var O = 0;
function Rd(e) {
  return e &= -e, 1 < e ? 4 < e ? e & 268435455 ? 16 : 536870912 : 4 : 1;
}
var Vd, sa, Ld, _d, Nd, tl = !1, yi = [], Rt = null, Vt = null, Lt = null, _r = /* @__PURE__ */ new Map(), Nr = /* @__PURE__ */ new Map(), Et = [], Cy = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Nu(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      Rt = null;
      break;
    case "dragenter":
    case "dragleave":
      Vt = null;
      break;
    case "mouseover":
    case "mouseout":
      Lt = null;
      break;
    case "pointerover":
    case "pointerout":
      _r.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Nr.delete(t.pointerId);
  }
}
function rr(e, t, n, r, i, s) {
  return e === null || e.nativeEvent !== s ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: s, targetContainers: [i] }, t !== null && (t = ni(t), t !== null && sa(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
}
function Ey(e, t, n, r, i) {
  switch (t) {
    case "focusin":
      return Rt = rr(Rt, e, t, n, r, i), !0;
    case "dragenter":
      return Vt = rr(Vt, e, t, n, r, i), !0;
    case "mouseover":
      return Lt = rr(Lt, e, t, n, r, i), !0;
    case "pointerover":
      var s = i.pointerId;
      return _r.set(s, rr(_r.get(s) || null, e, t, n, r, i)), !0;
    case "gotpointercapture":
      return s = i.pointerId, Nr.set(s, rr(Nr.get(s) || null, e, t, n, r, i)), !0;
  }
  return !1;
}
function Id(e) {
  var t = en(e.target);
  if (t !== null) {
    var n = pn(t);
    if (n !== null) {
      if (t = n.tag, t === 13) {
        if (t = Pd(n), t !== null) {
          e.blockedOn = t, Nd(e.priority, function() {
            Ld(n);
          });
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function ji(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = nl(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      Zo = r, n.target.dispatchEvent(r), Zo = null;
    } else return t = ni(n), t !== null && sa(t), e.blockedOn = n, !1;
    t.shift();
  }
  return !0;
}
function Iu(e, t, n) {
  ji(e) && n.delete(t);
}
function Ay() {
  tl = !1, Rt !== null && ji(Rt) && (Rt = null), Vt !== null && ji(Vt) && (Vt = null), Lt !== null && ji(Lt) && (Lt = null), _r.forEach(Iu), Nr.forEach(Iu);
}
function ir(e, t) {
  e.blockedOn === t && (e.blockedOn = null, tl || (tl = !0, Le.unstable_scheduleCallback(Le.unstable_NormalPriority, Ay)));
}
function Ir(e) {
  function t(i) {
    return ir(i, e);
  }
  if (0 < yi.length) {
    ir(yi[0], e);
    for (var n = 1; n < yi.length; n++) {
      var r = yi[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (Rt !== null && ir(Rt, e), Vt !== null && ir(Vt, e), Lt !== null && ir(Lt, e), _r.forEach(t), Nr.forEach(t), n = 0; n < Et.length; n++) r = Et[n], r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < Et.length && (n = Et[0], n.blockedOn === null); ) Id(n), n.blockedOn === null && Et.shift();
}
var Fn = St.ReactCurrentBatchConfig, ts = !0;
function Dy(e, t, n, r) {
  var i = O, s = Fn.transition;
  Fn.transition = null;
  try {
    O = 1, oa(e, t, n, r);
  } finally {
    O = i, Fn.transition = s;
  }
}
function My(e, t, n, r) {
  var i = O, s = Fn.transition;
  Fn.transition = null;
  try {
    O = 4, oa(e, t, n, r);
  } finally {
    O = i, Fn.transition = s;
  }
}
function oa(e, t, n, r) {
  if (ts) {
    var i = nl(e, t, n, r);
    if (i === null) fo(e, t, r, ns, n), Nu(e, r);
    else if (Ey(i, e, t, n, r)) r.stopPropagation();
    else if (Nu(e, r), t & 4 && -1 < Cy.indexOf(e)) {
      for (; i !== null; ) {
        var s = ni(i);
        if (s !== null && Vd(s), s = nl(e, t, n, r), s === null && fo(e, t, r, ns, n), s === i) break;
        i = s;
      }
      i !== null && r.stopPropagation();
    } else fo(e, t, r, null, n);
  }
}
var ns = null;
function nl(e, t, n, r) {
  if (ns = null, e = na(r), e = en(e), e !== null) if (t = pn(e), t === null) e = null;
  else if (n = t.tag, n === 13) {
    if (e = Pd(t), e !== null) return e;
    e = null;
  } else if (n === 3) {
    if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
    e = null;
  } else t !== e && (e = null);
  return ns = e, null;
}
function jd(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (yy()) {
        case ra:
          return 1;
        case Ad:
          return 4;
        case bi:
        case gy:
          return 16;
        case Dd:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var Dt = null, la = null, Fi = null;
function Fd() {
  if (Fi) return Fi;
  var e, t = la, n = t.length, r, i = "value" in Dt ? Dt.value : Dt.textContent, s = i.length;
  for (e = 0; e < n && t[e] === i[e]; e++) ;
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === i[s - r]; r++) ;
  return Fi = i.slice(e, 1 < r ? 1 - r : void 0);
}
function Oi(e) {
  var t = e.keyCode;
  return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
}
function gi() {
  return !0;
}
function ju() {
  return !1;
}
function Ie(e) {
  function t(n, r, i, s, o) {
    this._reactName = n, this._targetInst = i, this.type = r, this.nativeEvent = s, this.target = o, this.currentTarget = null;
    for (var l in e) e.hasOwnProperty(l) && (n = e[l], this[l] = n ? n(s) : s[l]);
    return this.isDefaultPrevented = (s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1) ? gi : ju, this.isPropagationStopped = ju, this;
  }
  return X(t.prototype, { preventDefault: function() {
    this.defaultPrevented = !0;
    var n = this.nativeEvent;
    n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = gi);
  }, stopPropagation: function() {
    var n = this.nativeEvent;
    n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = gi);
  }, persist: function() {
  }, isPersistent: gi }), t;
}
var Jn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
  return e.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, aa = Ie(Jn), ti = X({}, Jn, { view: 0, detail: 0 }), Ry = Ie(ti), no, ro, sr, Ds = X({}, ti, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ua, button: 0, buttons: 0, relatedTarget: function(e) {
  return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
}, movementX: function(e) {
  return "movementX" in e ? e.movementX : (e !== sr && (sr && e.type === "mousemove" ? (no = e.screenX - sr.screenX, ro = e.screenY - sr.screenY) : ro = no = 0, sr = e), no);
}, movementY: function(e) {
  return "movementY" in e ? e.movementY : ro;
} }), Fu = Ie(Ds), Vy = X({}, Ds, { dataTransfer: 0 }), Ly = Ie(Vy), _y = X({}, ti, { relatedTarget: 0 }), io = Ie(_y), Ny = X({}, Jn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Iy = Ie(Ny), jy = X({}, Jn, { clipboardData: function(e) {
  return "clipboardData" in e ? e.clipboardData : window.clipboardData;
} }), Fy = Ie(jy), Oy = X({}, Jn, { data: 0 }), Ou = Ie(Oy), zy = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, By = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Uy = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function $y(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = Uy[e]) ? !!t[e] : !1;
}
function ua() {
  return $y;
}
var Wy = X({}, ti, { key: function(e) {
  if (e.key) {
    var t = zy[e.key] || e.key;
    if (t !== "Unidentified") return t;
  }
  return e.type === "keypress" ? (e = Oi(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? By[e.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ua, charCode: function(e) {
  return e.type === "keypress" ? Oi(e) : 0;
}, keyCode: function(e) {
  return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
}, which: function(e) {
  return e.type === "keypress" ? Oi(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
} }), Hy = Ie(Wy), Ky = X({}, Ds, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), zu = Ie(Ky), Gy = X({}, ti, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ua }), Qy = Ie(Gy), Yy = X({}, Jn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xy = Ie(Yy), Zy = X({}, Ds, {
  deltaX: function(e) {
    return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
  },
  deltaY: function(e) {
    return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Jy = Ie(Zy), qy = [9, 13, 27, 32], ca = mt && "CompositionEvent" in window, wr = null;
mt && "documentMode" in document && (wr = document.documentMode);
var by = mt && "TextEvent" in window && !wr, Od = mt && (!ca || wr && 8 < wr && 11 >= wr), Bu = " ", Uu = !1;
function zd(e, t) {
  switch (e) {
    case "keyup":
      return qy.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function Bd(e) {
  return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
}
var wn = !1;
function eg(e, t) {
  switch (e) {
    case "compositionend":
      return Bd(t);
    case "keypress":
      return t.which !== 32 ? null : (Uu = !0, Bu);
    case "textInput":
      return e = t.data, e === Bu && Uu ? null : e;
    default:
      return null;
  }
}
function tg(e, t) {
  if (wn) return e === "compositionend" || !ca && zd(e, t) ? (e = Fd(), Fi = la = Dt = null, wn = !1, e) : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return Od && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var ng = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
function $u(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!ng[e.type] : t === "textarea";
}
function Ud(e, t, n, r) {
  vd(r), t = rs(t, "onChange"), 0 < t.length && (n = new aa("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
}
var Sr = null, jr = null;
function rg(e) {
  qd(e, 0);
}
function Ms(e) {
  var t = kn(e);
  if (fd(t)) return e;
}
function ig(e, t) {
  if (e === "change") return t;
}
var $d = !1;
if (mt) {
  var so;
  if (mt) {
    var oo = "oninput" in document;
    if (!oo) {
      var Wu = document.createElement("div");
      Wu.setAttribute("oninput", "return;"), oo = typeof Wu.oninput == "function";
    }
    so = oo;
  } else so = !1;
  $d = so && (!document.documentMode || 9 < document.documentMode);
}
function Hu() {
  Sr && (Sr.detachEvent("onpropertychange", Wd), jr = Sr = null);
}
function Wd(e) {
  if (e.propertyName === "value" && Ms(jr)) {
    var t = [];
    Ud(t, jr, e, na(e)), kd(rg, t);
  }
}
function sg(e, t, n) {
  e === "focusin" ? (Hu(), Sr = t, jr = n, Sr.attachEvent("onpropertychange", Wd)) : e === "focusout" && Hu();
}
function og(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") return Ms(jr);
}
function lg(e, t) {
  if (e === "click") return Ms(t);
}
function ag(e, t) {
  if (e === "input" || e === "change") return Ms(t);
}
function ug(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var qe = typeof Object.is == "function" ? Object.is : ug;
function Fr(e, t) {
  if (qe(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
  var n = Object.keys(e), r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var i = n[r];
    if (!Oo.call(t, i) || !qe(e[i], t[i])) return !1;
  }
  return !0;
}
function Ku(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Gu(e, t) {
  var n = Ku(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (r = e + n.textContent.length, e <= t && r >= t) return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Ku(n);
  }
}
function Hd(e, t) {
  return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Hd(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
}
function Kd() {
  for (var e = window, t = Zi(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Zi(e.document);
  }
  return t;
}
function fa(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
}
function cg(e) {
  var t = Kd(), n = e.focusedElem, r = e.selectionRange;
  if (t !== n && n && n.ownerDocument && Hd(n.ownerDocument.documentElement, n)) {
    if (r !== null && fa(n)) {
      if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
      else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
        e = e.getSelection();
        var i = n.textContent.length, s = Math.min(r.start, i);
        r = r.end === void 0 ? s : Math.min(r.end, i), !e.extend && s > r && (i = r, r = s, s = i), i = Gu(n, s);
        var o = Gu(
          n,
          r
        );
        i && o && (e.rangeCount !== 1 || e.anchorNode !== i.node || e.anchorOffset !== i.offset || e.focusNode !== o.node || e.focusOffset !== o.offset) && (t = t.createRange(), t.setStart(i.node, i.offset), e.removeAllRanges(), s > r ? (e.addRange(t), e.extend(o.node, o.offset)) : (t.setEnd(o.node, o.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
  }
}
var fg = mt && "documentMode" in document && 11 >= document.documentMode, Sn = null, rl = null, xr = null, il = !1;
function Qu(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  il || Sn == null || Sn !== Zi(r) || (r = Sn, "selectionStart" in r && fa(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), xr && Fr(xr, r) || (xr = r, r = rs(rl, "onSelect"), 0 < r.length && (t = new aa("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Sn)));
}
function vi(e, t) {
  var n = {};
  return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
}
var xn = { animationend: vi("Animation", "AnimationEnd"), animationiteration: vi("Animation", "AnimationIteration"), animationstart: vi("Animation", "AnimationStart"), transitionend: vi("Transition", "TransitionEnd") }, lo = {}, Gd = {};
mt && (Gd = document.createElement("div").style, "AnimationEvent" in window || (delete xn.animationend.animation, delete xn.animationiteration.animation, delete xn.animationstart.animation), "TransitionEvent" in window || delete xn.transitionend.transition);
function Rs(e) {
  if (lo[e]) return lo[e];
  if (!xn[e]) return e;
  var t = xn[e], n;
  for (n in t) if (t.hasOwnProperty(n) && n in Gd) return lo[e] = t[n];
  return e;
}
var Qd = Rs("animationend"), Yd = Rs("animationiteration"), Xd = Rs("animationstart"), Zd = Rs("transitionend"), Jd = /* @__PURE__ */ new Map(), Yu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function $t(e, t) {
  Jd.set(e, t), hn(t, [e]);
}
for (var ao = 0; ao < Yu.length; ao++) {
  var uo = Yu[ao], dg = uo.toLowerCase(), hg = uo[0].toUpperCase() + uo.slice(1);
  $t(dg, "on" + hg);
}
$t(Qd, "onAnimationEnd");
$t(Yd, "onAnimationIteration");
$t(Xd, "onAnimationStart");
$t("dblclick", "onDoubleClick");
$t("focusin", "onFocus");
$t("focusout", "onBlur");
$t(Zd, "onTransitionEnd");
Bn("onMouseEnter", ["mouseout", "mouseover"]);
Bn("onMouseLeave", ["mouseout", "mouseover"]);
Bn("onPointerEnter", ["pointerout", "pointerover"]);
Bn("onPointerLeave", ["pointerout", "pointerover"]);
hn("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
hn("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
hn("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
hn("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
hn("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
hn("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var hr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), pg = new Set("cancel close invalid load scroll toggle".split(" ").concat(hr));
function Xu(e, t, n) {
  var r = e.type || "unknown-event";
  e.currentTarget = n, dy(r, t, void 0, e), e.currentTarget = null;
}
function qd(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n], i = r.event;
    r = r.listeners;
    e: {
      var s = void 0;
      if (t) for (var o = r.length - 1; 0 <= o; o--) {
        var l = r[o], a = l.instance, u = l.currentTarget;
        if (l = l.listener, a !== s && i.isPropagationStopped()) break e;
        Xu(i, l, u), s = a;
      }
      else for (o = 0; o < r.length; o++) {
        if (l = r[o], a = l.instance, u = l.currentTarget, l = l.listener, a !== s && i.isPropagationStopped()) break e;
        Xu(i, l, u), s = a;
      }
    }
  }
  if (qi) throw e = bo, qi = !1, bo = null, e;
}
function W(e, t) {
  var n = t[ul];
  n === void 0 && (n = t[ul] = /* @__PURE__ */ new Set());
  var r = e + "__bubble";
  n.has(r) || (bd(t, e, 2, !1), n.add(r));
}
function co(e, t, n) {
  var r = 0;
  t && (r |= 4), bd(n, e, r, t);
}
var wi = "_reactListening" + Math.random().toString(36).slice(2);
function Or(e) {
  if (!e[wi]) {
    e[wi] = !0, od.forEach(function(n) {
      n !== "selectionchange" && (pg.has(n) || co(n, !1, e), co(n, !0, e));
    });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[wi] || (t[wi] = !0, co("selectionchange", !1, t));
  }
}
function bd(e, t, n, r) {
  switch (jd(t)) {
    case 1:
      var i = Dy;
      break;
    case 4:
      i = My;
      break;
    default:
      i = oa;
  }
  n = i.bind(null, t, n, e), i = void 0, !qo || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: i }) : e.addEventListener(t, n, !0) : i !== void 0 ? e.addEventListener(t, n, { passive: i }) : e.addEventListener(t, n, !1);
}
function fo(e, t, n, r, i) {
  var s = r;
  if (!(t & 1) && !(t & 2) && r !== null) e: for (; ; ) {
    if (r === null) return;
    var o = r.tag;
    if (o === 3 || o === 4) {
      var l = r.stateNode.containerInfo;
      if (l === i || l.nodeType === 8 && l.parentNode === i) break;
      if (o === 4) for (o = r.return; o !== null; ) {
        var a = o.tag;
        if ((a === 3 || a === 4) && (a = o.stateNode.containerInfo, a === i || a.nodeType === 8 && a.parentNode === i)) return;
        o = o.return;
      }
      for (; l !== null; ) {
        if (o = en(l), o === null) return;
        if (a = o.tag, a === 5 || a === 6) {
          r = s = o;
          continue e;
        }
        l = l.parentNode;
      }
    }
    r = r.return;
  }
  kd(function() {
    var u = s, c = na(n), f = [];
    e: {
      var d = Jd.get(e);
      if (d !== void 0) {
        var y = aa, g = e;
        switch (e) {
          case "keypress":
            if (Oi(n) === 0) break e;
          case "keydown":
          case "keyup":
            y = Hy;
            break;
          case "focusin":
            g = "focus", y = io;
            break;
          case "focusout":
            g = "blur", y = io;
            break;
          case "beforeblur":
          case "afterblur":
            y = io;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            y = Fu;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            y = Ly;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            y = Qy;
            break;
          case Qd:
          case Yd:
          case Xd:
            y = Iy;
            break;
          case Zd:
            y = Xy;
            break;
          case "scroll":
            y = Ry;
            break;
          case "wheel":
            y = Jy;
            break;
          case "copy":
          case "cut":
          case "paste":
            y = Fy;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            y = zu;
        }
        var v = (t & 4) !== 0, x = !v && e === "scroll", p = v ? d !== null ? d + "Capture" : null : d;
        v = [];
        for (var h = u, m; h !== null; ) {
          m = h;
          var w = m.stateNode;
          if (m.tag === 5 && w !== null && (m = w, p !== null && (w = Lr(h, p), w != null && v.push(zr(h, w, m)))), x) break;
          h = h.return;
        }
        0 < v.length && (d = new y(d, g, null, n, c), f.push({ event: d, listeners: v }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (d = e === "mouseover" || e === "pointerover", y = e === "mouseout" || e === "pointerout", d && n !== Zo && (g = n.relatedTarget || n.fromElement) && (en(g) || g[yt])) break e;
        if ((y || d) && (d = c.window === c ? c : (d = c.ownerDocument) ? d.defaultView || d.parentWindow : window, y ? (g = n.relatedTarget || n.toElement, y = u, g = g ? en(g) : null, g !== null && (x = pn(g), g !== x || g.tag !== 5 && g.tag !== 6) && (g = null)) : (y = null, g = u), y !== g)) {
          if (v = Fu, w = "onMouseLeave", p = "onMouseEnter", h = "mouse", (e === "pointerout" || e === "pointerover") && (v = zu, w = "onPointerLeave", p = "onPointerEnter", h = "pointer"), x = y == null ? d : kn(y), m = g == null ? d : kn(g), d = new v(w, h + "leave", y, n, c), d.target = x, d.relatedTarget = m, w = null, en(c) === u && (v = new v(p, h + "enter", g, n, c), v.target = m, v.relatedTarget = x, w = v), x = w, y && g) t: {
            for (v = y, p = g, h = 0, m = v; m; m = yn(m)) h++;
            for (m = 0, w = p; w; w = yn(w)) m++;
            for (; 0 < h - m; ) v = yn(v), h--;
            for (; 0 < m - h; ) p = yn(p), m--;
            for (; h--; ) {
              if (v === p || p !== null && v === p.alternate) break t;
              v = yn(v), p = yn(p);
            }
            v = null;
          }
          else v = null;
          y !== null && Zu(f, d, y, v, !1), g !== null && x !== null && Zu(f, x, g, v, !0);
        }
      }
      e: {
        if (d = u ? kn(u) : window, y = d.nodeName && d.nodeName.toLowerCase(), y === "select" || y === "input" && d.type === "file") var S = ig;
        else if ($u(d)) if ($d) S = ag;
        else {
          S = og;
          var P = sg;
        }
        else (y = d.nodeName) && y.toLowerCase() === "input" && (d.type === "checkbox" || d.type === "radio") && (S = lg);
        if (S && (S = S(e, u))) {
          Ud(f, S, n, c);
          break e;
        }
        P && P(e, d, u), e === "focusout" && (P = d._wrapperState) && P.controlled && d.type === "number" && Ko(d, "number", d.value);
      }
      switch (P = u ? kn(u) : window, e) {
        case "focusin":
          ($u(P) || P.contentEditable === "true") && (Sn = P, rl = u, xr = null);
          break;
        case "focusout":
          xr = rl = Sn = null;
          break;
        case "mousedown":
          il = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          il = !1, Qu(f, n, c);
          break;
        case "selectionchange":
          if (fg) break;
        case "keydown":
        case "keyup":
          Qu(f, n, c);
      }
      var E;
      if (ca) e: {
        switch (e) {
          case "compositionstart":
            var k = "onCompositionStart";
            break e;
          case "compositionend":
            k = "onCompositionEnd";
            break e;
          case "compositionupdate":
            k = "onCompositionUpdate";
            break e;
        }
        k = void 0;
      }
      else wn ? zd(e, n) && (k = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (k = "onCompositionStart");
      k && (Od && n.locale !== "ko" && (wn || k !== "onCompositionStart" ? k === "onCompositionEnd" && wn && (E = Fd()) : (Dt = c, la = "value" in Dt ? Dt.value : Dt.textContent, wn = !0)), P = rs(u, k), 0 < P.length && (k = new Ou(k, e, null, n, c), f.push({ event: k, listeners: P }), E ? k.data = E : (E = Bd(n), E !== null && (k.data = E)))), (E = by ? eg(e, n) : tg(e, n)) && (u = rs(u, "onBeforeInput"), 0 < u.length && (c = new Ou("onBeforeInput", "beforeinput", null, n, c), f.push({ event: c, listeners: u }), c.data = E));
    }
    qd(f, t);
  });
}
function zr(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function rs(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var i = e, s = i.stateNode;
    i.tag === 5 && s !== null && (i = s, s = Lr(e, n), s != null && r.unshift(zr(e, s, i)), s = Lr(e, t), s != null && r.push(zr(e, s, i))), e = e.return;
  }
  return r;
}
function yn(e) {
  if (e === null) return null;
  do
    e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Zu(e, t, n, r, i) {
  for (var s = t._reactName, o = []; n !== null && n !== r; ) {
    var l = n, a = l.alternate, u = l.stateNode;
    if (a !== null && a === r) break;
    l.tag === 5 && u !== null && (l = u, i ? (a = Lr(n, s), a != null && o.unshift(zr(n, a, l))) : i || (a = Lr(n, s), a != null && o.push(zr(n, a, l)))), n = n.return;
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var mg = /\r\n?/g, yg = /\u0000|\uFFFD/g;
function Ju(e) {
  return (typeof e == "string" ? e : "" + e).replace(mg, `
`).replace(yg, "");
}
function Si(e, t, n) {
  if (t = Ju(t), Ju(e) !== t && n) throw Error(T(425));
}
function is() {
}
var sl = null, ol = null;
function ll(e, t) {
  return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
}
var al = typeof setTimeout == "function" ? setTimeout : void 0, gg = typeof clearTimeout == "function" ? clearTimeout : void 0, qu = typeof Promise == "function" ? Promise : void 0, vg = typeof queueMicrotask == "function" ? queueMicrotask : typeof qu < "u" ? function(e) {
  return qu.resolve(null).then(e).catch(wg);
} : al;
function wg(e) {
  setTimeout(function() {
    throw e;
  });
}
function ho(e, t) {
  var n = t, r = 0;
  do {
    var i = n.nextSibling;
    if (e.removeChild(n), i && i.nodeType === 8) if (n = i.data, n === "/$") {
      if (r === 0) {
        e.removeChild(i), Ir(t);
        return;
      }
      r--;
    } else n !== "$" && n !== "$?" && n !== "$!" || r++;
    n = i;
  } while (n);
  Ir(t);
}
function _t(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function bu(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var qn = Math.random().toString(36).slice(2), tt = "__reactFiber$" + qn, Br = "__reactProps$" + qn, yt = "__reactContainer$" + qn, ul = "__reactEvents$" + qn, Sg = "__reactListeners$" + qn, xg = "__reactHandles$" + qn;
function en(e) {
  var t = e[tt];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if (t = n[yt] || n[tt]) {
      if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = bu(e); e !== null; ) {
        if (n = e[tt]) return n;
        e = bu(e);
      }
      return t;
    }
    e = n, n = e.parentNode;
  }
  return null;
}
function ni(e) {
  return e = e[tt] || e[yt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
}
function kn(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(T(33));
}
function Vs(e) {
  return e[Br] || null;
}
var cl = [], Pn = -1;
function Wt(e) {
  return { current: e };
}
function H(e) {
  0 > Pn || (e.current = cl[Pn], cl[Pn] = null, Pn--);
}
function U(e, t) {
  Pn++, cl[Pn] = e.current, e.current = t;
}
var zt = {}, ve = Wt(zt), Ce = Wt(!1), an = zt;
function Un(e, t) {
  var n = e.type.contextTypes;
  if (!n) return zt;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
  var i = {}, s;
  for (s in n) i[s] = t[s];
  return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = i), i;
}
function Ee(e) {
  return e = e.childContextTypes, e != null;
}
function ss() {
  H(Ce), H(ve);
}
function ec(e, t, n) {
  if (ve.current !== zt) throw Error(T(168));
  U(ve, t), U(Ce, n);
}
function eh(e, t, n) {
  var r = e.stateNode;
  if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
  r = r.getChildContext();
  for (var i in r) if (!(i in t)) throw Error(T(108, sy(e) || "Unknown", i));
  return X({}, n, r);
}
function os(e) {
  return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || zt, an = ve.current, U(ve, e), U(Ce, Ce.current), !0;
}
function tc(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(T(169));
  n ? (e = eh(e, t, an), r.__reactInternalMemoizedMergedChildContext = e, H(Ce), H(ve), U(ve, e)) : H(Ce), U(Ce, n);
}
var ut = null, Ls = !1, po = !1;
function th(e) {
  ut === null ? ut = [e] : ut.push(e);
}
function kg(e) {
  Ls = !0, th(e);
}
function Ht() {
  if (!po && ut !== null) {
    po = !0;
    var e = 0, t = O;
    try {
      var n = ut;
      for (O = 1; e < n.length; e++) {
        var r = n[e];
        do
          r = r(!0);
        while (r !== null);
      }
      ut = null, Ls = !1;
    } catch (i) {
      throw ut !== null && (ut = ut.slice(e + 1)), Ed(ra, Ht), i;
    } finally {
      O = t, po = !1;
    }
  }
  return null;
}
var Tn = [], Cn = 0, ls = null, as = 0, Oe = [], ze = 0, un = null, ct = 1, ft = "";
function Zt(e, t) {
  Tn[Cn++] = as, Tn[Cn++] = ls, ls = e, as = t;
}
function nh(e, t, n) {
  Oe[ze++] = ct, Oe[ze++] = ft, Oe[ze++] = un, un = e;
  var r = ct;
  e = ft;
  var i = 32 - Ze(r) - 1;
  r &= ~(1 << i), n += 1;
  var s = 32 - Ze(t) + i;
  if (30 < s) {
    var o = i - i % 5;
    s = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, ct = 1 << 32 - Ze(t) + i | n << i | r, ft = s + e;
  } else ct = 1 << s | n << i | r, ft = e;
}
function da(e) {
  e.return !== null && (Zt(e, 1), nh(e, 1, 0));
}
function ha(e) {
  for (; e === ls; ) ls = Tn[--Cn], Tn[Cn] = null, as = Tn[--Cn], Tn[Cn] = null;
  for (; e === un; ) un = Oe[--ze], Oe[ze] = null, ft = Oe[--ze], Oe[ze] = null, ct = Oe[--ze], Oe[ze] = null;
}
var Re = null, Me = null, K = !1, Xe = null;
function rh(e, t) {
  var n = Be(5, null, null, 0);
  n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
}
function nc(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, Re = e, Me = _t(t.firstChild), !0) : !1;
    case 6:
      return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, Re = e, Me = null, !0) : !1;
    case 13:
      return t = t.nodeType !== 8 ? null : t, t !== null ? (n = un !== null ? { id: ct, overflow: ft } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = Be(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, Re = e, Me = null, !0) : !1;
    default:
      return !1;
  }
}
function fl(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function dl(e) {
  if (K) {
    var t = Me;
    if (t) {
      var n = t;
      if (!nc(e, t)) {
        if (fl(e)) throw Error(T(418));
        t = _t(n.nextSibling);
        var r = Re;
        t && nc(e, t) ? rh(r, n) : (e.flags = e.flags & -4097 | 2, K = !1, Re = e);
      }
    } else {
      if (fl(e)) throw Error(T(418));
      e.flags = e.flags & -4097 | 2, K = !1, Re = e;
    }
  }
}
function rc(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
  Re = e;
}
function xi(e) {
  if (e !== Re) return !1;
  if (!K) return rc(e), K = !0, !1;
  var t;
  if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !ll(e.type, e.memoizedProps)), t && (t = Me)) {
    if (fl(e)) throw ih(), Error(T(418));
    for (; t; ) rh(e, t), t = _t(t.nextSibling);
  }
  if (rc(e), e.tag === 13) {
    if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(T(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              Me = _t(e.nextSibling);
              break e;
            }
            t--;
          } else n !== "$" && n !== "$!" && n !== "$?" || t++;
        }
        e = e.nextSibling;
      }
      Me = null;
    }
  } else Me = Re ? _t(e.stateNode.nextSibling) : null;
  return !0;
}
function ih() {
  for (var e = Me; e; ) e = _t(e.nextSibling);
}
function $n() {
  Me = Re = null, K = !1;
}
function pa(e) {
  Xe === null ? Xe = [e] : Xe.push(e);
}
var Pg = St.ReactCurrentBatchConfig;
function or(e, t, n) {
  if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
    if (n._owner) {
      if (n = n._owner, n) {
        if (n.tag !== 1) throw Error(T(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(T(147, e));
      var i = r, s = "" + e;
      return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === s ? t.ref : (t = function(o) {
        var l = i.refs;
        o === null ? delete l[s] : l[s] = o;
      }, t._stringRef = s, t);
    }
    if (typeof e != "string") throw Error(T(284));
    if (!n._owner) throw Error(T(290, e));
  }
  return e;
}
function ki(e, t) {
  throw e = Object.prototype.toString.call(t), Error(T(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
}
function ic(e) {
  var t = e._init;
  return t(e._payload);
}
function sh(e) {
  function t(p, h) {
    if (e) {
      var m = p.deletions;
      m === null ? (p.deletions = [h], p.flags |= 16) : m.push(h);
    }
  }
  function n(p, h) {
    if (!e) return null;
    for (; h !== null; ) t(p, h), h = h.sibling;
    return null;
  }
  function r(p, h) {
    for (p = /* @__PURE__ */ new Map(); h !== null; ) h.key !== null ? p.set(h.key, h) : p.set(h.index, h), h = h.sibling;
    return p;
  }
  function i(p, h) {
    return p = Ft(p, h), p.index = 0, p.sibling = null, p;
  }
  function s(p, h, m) {
    return p.index = m, e ? (m = p.alternate, m !== null ? (m = m.index, m < h ? (p.flags |= 2, h) : m) : (p.flags |= 2, h)) : (p.flags |= 1048576, h);
  }
  function o(p) {
    return e && p.alternate === null && (p.flags |= 2), p;
  }
  function l(p, h, m, w) {
    return h === null || h.tag !== 6 ? (h = xo(m, p.mode, w), h.return = p, h) : (h = i(h, m), h.return = p, h);
  }
  function a(p, h, m, w) {
    var S = m.type;
    return S === vn ? c(p, h, m.props.children, w, m.key) : h !== null && (h.elementType === S || typeof S == "object" && S !== null && S.$$typeof === Tt && ic(S) === h.type) ? (w = i(h, m.props), w.ref = or(p, h, m), w.return = p, w) : (w = Ki(m.type, m.key, m.props, null, p.mode, w), w.ref = or(p, h, m), w.return = p, w);
  }
  function u(p, h, m, w) {
    return h === null || h.tag !== 4 || h.stateNode.containerInfo !== m.containerInfo || h.stateNode.implementation !== m.implementation ? (h = ko(m, p.mode, w), h.return = p, h) : (h = i(h, m.children || []), h.return = p, h);
  }
  function c(p, h, m, w, S) {
    return h === null || h.tag !== 7 ? (h = on(m, p.mode, w, S), h.return = p, h) : (h = i(h, m), h.return = p, h);
  }
  function f(p, h, m) {
    if (typeof h == "string" && h !== "" || typeof h == "number") return h = xo("" + h, p.mode, m), h.return = p, h;
    if (typeof h == "object" && h !== null) {
      switch (h.$$typeof) {
        case fi:
          return m = Ki(h.type, h.key, h.props, null, p.mode, m), m.ref = or(p, null, h), m.return = p, m;
        case gn:
          return h = ko(h, p.mode, m), h.return = p, h;
        case Tt:
          var w = h._init;
          return f(p, w(h._payload), m);
      }
      if (fr(h) || tr(h)) return h = on(h, p.mode, m, null), h.return = p, h;
      ki(p, h);
    }
    return null;
  }
  function d(p, h, m, w) {
    var S = h !== null ? h.key : null;
    if (typeof m == "string" && m !== "" || typeof m == "number") return S !== null ? null : l(p, h, "" + m, w);
    if (typeof m == "object" && m !== null) {
      switch (m.$$typeof) {
        case fi:
          return m.key === S ? a(p, h, m, w) : null;
        case gn:
          return m.key === S ? u(p, h, m, w) : null;
        case Tt:
          return S = m._init, d(
            p,
            h,
            S(m._payload),
            w
          );
      }
      if (fr(m) || tr(m)) return S !== null ? null : c(p, h, m, w, null);
      ki(p, m);
    }
    return null;
  }
  function y(p, h, m, w, S) {
    if (typeof w == "string" && w !== "" || typeof w == "number") return p = p.get(m) || null, l(h, p, "" + w, S);
    if (typeof w == "object" && w !== null) {
      switch (w.$$typeof) {
        case fi:
          return p = p.get(w.key === null ? m : w.key) || null, a(h, p, w, S);
        case gn:
          return p = p.get(w.key === null ? m : w.key) || null, u(h, p, w, S);
        case Tt:
          var P = w._init;
          return y(p, h, m, P(w._payload), S);
      }
      if (fr(w) || tr(w)) return p = p.get(m) || null, c(h, p, w, S, null);
      ki(h, w);
    }
    return null;
  }
  function g(p, h, m, w) {
    for (var S = null, P = null, E = h, k = h = 0, _ = null; E !== null && k < m.length; k++) {
      E.index > k ? (_ = E, E = null) : _ = E.sibling;
      var M = d(p, E, m[k], w);
      if (M === null) {
        E === null && (E = _);
        break;
      }
      e && E && M.alternate === null && t(p, E), h = s(M, h, k), P === null ? S = M : P.sibling = M, P = M, E = _;
    }
    if (k === m.length) return n(p, E), K && Zt(p, k), S;
    if (E === null) {
      for (; k < m.length; k++) E = f(p, m[k], w), E !== null && (h = s(E, h, k), P === null ? S = E : P.sibling = E, P = E);
      return K && Zt(p, k), S;
    }
    for (E = r(p, E); k < m.length; k++) _ = y(E, p, k, m[k], w), _ !== null && (e && _.alternate !== null && E.delete(_.key === null ? k : _.key), h = s(_, h, k), P === null ? S = _ : P.sibling = _, P = _);
    return e && E.forEach(function(q) {
      return t(p, q);
    }), K && Zt(p, k), S;
  }
  function v(p, h, m, w) {
    var S = tr(m);
    if (typeof S != "function") throw Error(T(150));
    if (m = S.call(m), m == null) throw Error(T(151));
    for (var P = S = null, E = h, k = h = 0, _ = null, M = m.next(); E !== null && !M.done; k++, M = m.next()) {
      E.index > k ? (_ = E, E = null) : _ = E.sibling;
      var q = d(p, E, M.value, w);
      if (q === null) {
        E === null && (E = _);
        break;
      }
      e && E && q.alternate === null && t(p, E), h = s(q, h, k), P === null ? S = q : P.sibling = q, P = q, E = _;
    }
    if (M.done) return n(
      p,
      E
    ), K && Zt(p, k), S;
    if (E === null) {
      for (; !M.done; k++, M = m.next()) M = f(p, M.value, w), M !== null && (h = s(M, h, k), P === null ? S = M : P.sibling = M, P = M);
      return K && Zt(p, k), S;
    }
    for (E = r(p, E); !M.done; k++, M = m.next()) M = y(E, p, k, M.value, w), M !== null && (e && M.alternate !== null && E.delete(M.key === null ? k : M.key), h = s(M, h, k), P === null ? S = M : P.sibling = M, P = M);
    return e && E.forEach(function(He) {
      return t(p, He);
    }), K && Zt(p, k), S;
  }
  function x(p, h, m, w) {
    if (typeof m == "object" && m !== null && m.type === vn && m.key === null && (m = m.props.children), typeof m == "object" && m !== null) {
      switch (m.$$typeof) {
        case fi:
          e: {
            for (var S = m.key, P = h; P !== null; ) {
              if (P.key === S) {
                if (S = m.type, S === vn) {
                  if (P.tag === 7) {
                    n(p, P.sibling), h = i(P, m.props.children), h.return = p, p = h;
                    break e;
                  }
                } else if (P.elementType === S || typeof S == "object" && S !== null && S.$$typeof === Tt && ic(S) === P.type) {
                  n(p, P.sibling), h = i(P, m.props), h.ref = or(p, P, m), h.return = p, p = h;
                  break e;
                }
                n(p, P);
                break;
              } else t(p, P);
              P = P.sibling;
            }
            m.type === vn ? (h = on(m.props.children, p.mode, w, m.key), h.return = p, p = h) : (w = Ki(m.type, m.key, m.props, null, p.mode, w), w.ref = or(p, h, m), w.return = p, p = w);
          }
          return o(p);
        case gn:
          e: {
            for (P = m.key; h !== null; ) {
              if (h.key === P) if (h.tag === 4 && h.stateNode.containerInfo === m.containerInfo && h.stateNode.implementation === m.implementation) {
                n(p, h.sibling), h = i(h, m.children || []), h.return = p, p = h;
                break e;
              } else {
                n(p, h);
                break;
              }
              else t(p, h);
              h = h.sibling;
            }
            h = ko(m, p.mode, w), h.return = p, p = h;
          }
          return o(p);
        case Tt:
          return P = m._init, x(p, h, P(m._payload), w);
      }
      if (fr(m)) return g(p, h, m, w);
      if (tr(m)) return v(p, h, m, w);
      ki(p, m);
    }
    return typeof m == "string" && m !== "" || typeof m == "number" ? (m = "" + m, h !== null && h.tag === 6 ? (n(p, h.sibling), h = i(h, m), h.return = p, p = h) : (n(p, h), h = xo(m, p.mode, w), h.return = p, p = h), o(p)) : n(p, h);
  }
  return x;
}
var Wn = sh(!0), oh = sh(!1), us = Wt(null), cs = null, En = null, ma = null;
function ya() {
  ma = En = cs = null;
}
function ga(e) {
  var t = us.current;
  H(us), e._currentValue = t;
}
function hl(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
    e = e.return;
  }
}
function On(e, t) {
  cs = e, ma = En = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.lanes & t && (Te = !0), e.firstContext = null);
}
function $e(e) {
  var t = e._currentValue;
  if (ma !== e) if (e = { context: e, memoizedValue: t, next: null }, En === null) {
    if (cs === null) throw Error(T(308));
    En = e, cs.dependencies = { lanes: 0, firstContext: e };
  } else En = En.next = e;
  return t;
}
var tn = null;
function va(e) {
  tn === null ? tn = [e] : tn.push(e);
}
function lh(e, t, n, r) {
  var i = t.interleaved;
  return i === null ? (n.next = n, va(t)) : (n.next = i.next, i.next = n), t.interleaved = n, gt(e, r);
}
function gt(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
  return n.tag === 3 ? n.stateNode : null;
}
var Ct = !1;
function wa(e) {
  e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function ah(e, t) {
  e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
}
function dt(e, t) {
  return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
}
function Nt(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (r = r.shared, F & 2) {
    var i = r.pending;
    return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, gt(e, n);
  }
  return i = r.interleaved, i === null ? (t.next = t, va(r)) : (t.next = i.next, i.next = t), r.interleaved = t, gt(e, n);
}
function zi(e, t, n) {
  if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, ia(e, n);
  }
}
function sc(e, t) {
  var n = e.updateQueue, r = e.alternate;
  if (r !== null && (r = r.updateQueue, n === r)) {
    var i = null, s = null;
    if (n = n.firstBaseUpdate, n !== null) {
      do {
        var o = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
        s === null ? i = s = o : s = s.next = o, n = n.next;
      } while (n !== null);
      s === null ? i = s = t : s = s.next = t;
    } else i = s = t;
    n = { baseState: r.baseState, firstBaseUpdate: i, lastBaseUpdate: s, shared: r.shared, effects: r.effects }, e.updateQueue = n;
    return;
  }
  e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
}
function fs(e, t, n, r) {
  var i = e.updateQueue;
  Ct = !1;
  var s = i.firstBaseUpdate, o = i.lastBaseUpdate, l = i.shared.pending;
  if (l !== null) {
    i.shared.pending = null;
    var a = l, u = a.next;
    a.next = null, o === null ? s = u : o.next = u, o = a;
    var c = e.alternate;
    c !== null && (c = c.updateQueue, l = c.lastBaseUpdate, l !== o && (l === null ? c.firstBaseUpdate = u : l.next = u, c.lastBaseUpdate = a));
  }
  if (s !== null) {
    var f = i.baseState;
    o = 0, c = u = a = null, l = s;
    do {
      var d = l.lane, y = l.eventTime;
      if ((r & d) === d) {
        c !== null && (c = c.next = {
          eventTime: y,
          lane: 0,
          tag: l.tag,
          payload: l.payload,
          callback: l.callback,
          next: null
        });
        e: {
          var g = e, v = l;
          switch (d = t, y = n, v.tag) {
            case 1:
              if (g = v.payload, typeof g == "function") {
                f = g.call(y, f, d);
                break e;
              }
              f = g;
              break e;
            case 3:
              g.flags = g.flags & -65537 | 128;
            case 0:
              if (g = v.payload, d = typeof g == "function" ? g.call(y, f, d) : g, d == null) break e;
              f = X({}, f, d);
              break e;
            case 2:
              Ct = !0;
          }
        }
        l.callback !== null && l.lane !== 0 && (e.flags |= 64, d = i.effects, d === null ? i.effects = [l] : d.push(l));
      } else y = { eventTime: y, lane: d, tag: l.tag, payload: l.payload, callback: l.callback, next: null }, c === null ? (u = c = y, a = f) : c = c.next = y, o |= d;
      if (l = l.next, l === null) {
        if (l = i.shared.pending, l === null) break;
        d = l, l = d.next, d.next = null, i.lastBaseUpdate = d, i.shared.pending = null;
      }
    } while (!0);
    if (c === null && (a = f), i.baseState = a, i.firstBaseUpdate = u, i.lastBaseUpdate = c, t = i.shared.interleaved, t !== null) {
      i = t;
      do
        o |= i.lane, i = i.next;
      while (i !== t);
    } else s === null && (i.shared.lanes = 0);
    fn |= o, e.lanes = o, e.memoizedState = f;
  }
}
function oc(e, t, n) {
  if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
    var r = e[t], i = r.callback;
    if (i !== null) {
      if (r.callback = null, r = n, typeof i != "function") throw Error(T(191, i));
      i.call(r);
    }
  }
}
var ri = {}, rt = Wt(ri), Ur = Wt(ri), $r = Wt(ri);
function nn(e) {
  if (e === ri) throw Error(T(174));
  return e;
}
function Sa(e, t) {
  switch (U($r, t), U(Ur, e), U(rt, ri), e = t.nodeType, e) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : Qo(null, "");
      break;
    default:
      e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Qo(t, e);
  }
  H(rt), U(rt, t);
}
function Hn() {
  H(rt), H(Ur), H($r);
}
function uh(e) {
  nn($r.current);
  var t = nn(rt.current), n = Qo(t, e.type);
  t !== n && (U(Ur, e), U(rt, n));
}
function xa(e) {
  Ur.current === e && (H(rt), H(Ur));
}
var G = Wt(0);
function ds(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      t.child.return = t, t = t.child;
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    t.sibling.return = t.return, t = t.sibling;
  }
  return null;
}
var mo = [];
function ka() {
  for (var e = 0; e < mo.length; e++) mo[e]._workInProgressVersionPrimary = null;
  mo.length = 0;
}
var Bi = St.ReactCurrentDispatcher, yo = St.ReactCurrentBatchConfig, cn = 0, Y = null, re = null, oe = null, hs = !1, kr = !1, Wr = 0, Tg = 0;
function he() {
  throw Error(T(321));
}
function Pa(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++) if (!qe(e[n], t[n])) return !1;
  return !0;
}
function Ta(e, t, n, r, i, s) {
  if (cn = s, Y = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Bi.current = e === null || e.memoizedState === null ? Dg : Mg, e = n(r, i), kr) {
    s = 0;
    do {
      if (kr = !1, Wr = 0, 25 <= s) throw Error(T(301));
      s += 1, oe = re = null, t.updateQueue = null, Bi.current = Rg, e = n(r, i);
    } while (kr);
  }
  if (Bi.current = ps, t = re !== null && re.next !== null, cn = 0, oe = re = Y = null, hs = !1, t) throw Error(T(300));
  return e;
}
function Ca() {
  var e = Wr !== 0;
  return Wr = 0, e;
}
function et() {
  var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return oe === null ? Y.memoizedState = oe = e : oe = oe.next = e, oe;
}
function We() {
  if (re === null) {
    var e = Y.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = re.next;
  var t = oe === null ? Y.memoizedState : oe.next;
  if (t !== null) oe = t, re = e;
  else {
    if (e === null) throw Error(T(310));
    re = e, e = { memoizedState: re.memoizedState, baseState: re.baseState, baseQueue: re.baseQueue, queue: re.queue, next: null }, oe === null ? Y.memoizedState = oe = e : oe = oe.next = e;
  }
  return oe;
}
function Hr(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function go(e) {
  var t = We(), n = t.queue;
  if (n === null) throw Error(T(311));
  n.lastRenderedReducer = e;
  var r = re, i = r.baseQueue, s = n.pending;
  if (s !== null) {
    if (i !== null) {
      var o = i.next;
      i.next = s.next, s.next = o;
    }
    r.baseQueue = i = s, n.pending = null;
  }
  if (i !== null) {
    s = i.next, r = r.baseState;
    var l = o = null, a = null, u = s;
    do {
      var c = u.lane;
      if ((cn & c) === c) a !== null && (a = a.next = { lane: 0, action: u.action, hasEagerState: u.hasEagerState, eagerState: u.eagerState, next: null }), r = u.hasEagerState ? u.eagerState : e(r, u.action);
      else {
        var f = {
          lane: c,
          action: u.action,
          hasEagerState: u.hasEagerState,
          eagerState: u.eagerState,
          next: null
        };
        a === null ? (l = a = f, o = r) : a = a.next = f, Y.lanes |= c, fn |= c;
      }
      u = u.next;
    } while (u !== null && u !== s);
    a === null ? o = r : a.next = l, qe(r, t.memoizedState) || (Te = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = a, n.lastRenderedState = r;
  }
  if (e = n.interleaved, e !== null) {
    i = e;
    do
      s = i.lane, Y.lanes |= s, fn |= s, i = i.next;
    while (i !== e);
  } else i === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function vo(e) {
  var t = We(), n = t.queue;
  if (n === null) throw Error(T(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch, i = n.pending, s = t.memoizedState;
  if (i !== null) {
    n.pending = null;
    var o = i = i.next;
    do
      s = e(s, o.action), o = o.next;
    while (o !== i);
    qe(s, t.memoizedState) || (Te = !0), t.memoizedState = s, t.baseQueue === null && (t.baseState = s), n.lastRenderedState = s;
  }
  return [s, r];
}
function ch() {
}
function fh(e, t) {
  var n = Y, r = We(), i = t(), s = !qe(r.memoizedState, i);
  if (s && (r.memoizedState = i, Te = !0), r = r.queue, Ea(ph.bind(null, n, r, e), [e]), r.getSnapshot !== t || s || oe !== null && oe.memoizedState.tag & 1) {
    if (n.flags |= 2048, Kr(9, hh.bind(null, n, r, i, t), void 0, null), le === null) throw Error(T(349));
    cn & 30 || dh(n, t, i);
  }
  return i;
}
function dh(e, t, n) {
  e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Y.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Y.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
}
function hh(e, t, n, r) {
  t.value = n, t.getSnapshot = r, mh(t) && yh(e);
}
function ph(e, t, n) {
  return n(function() {
    mh(t) && yh(e);
  });
}
function mh(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !qe(e, n);
  } catch {
    return !0;
  }
}
function yh(e) {
  var t = gt(e, 1);
  t !== null && Je(t, e, 1, -1);
}
function lc(e) {
  var t = et();
  return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Hr, lastRenderedState: e }, t.queue = e, e = e.dispatch = Ag.bind(null, Y, e), [t.memoizedState, e];
}
function Kr(e, t, n, r) {
  return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = Y.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Y.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
}
function gh() {
  return We().memoizedState;
}
function Ui(e, t, n, r) {
  var i = et();
  Y.flags |= e, i.memoizedState = Kr(1 | t, n, void 0, r === void 0 ? null : r);
}
function _s(e, t, n, r) {
  var i = We();
  r = r === void 0 ? null : r;
  var s = void 0;
  if (re !== null) {
    var o = re.memoizedState;
    if (s = o.destroy, r !== null && Pa(r, o.deps)) {
      i.memoizedState = Kr(t, n, s, r);
      return;
    }
  }
  Y.flags |= e, i.memoizedState = Kr(1 | t, n, s, r);
}
function ac(e, t) {
  return Ui(8390656, 8, e, t);
}
function Ea(e, t) {
  return _s(2048, 8, e, t);
}
function vh(e, t) {
  return _s(4, 2, e, t);
}
function wh(e, t) {
  return _s(4, 4, e, t);
}
function Sh(e, t) {
  if (typeof t == "function") return e = e(), t(e), function() {
    t(null);
  };
  if (t != null) return e = e(), t.current = e, function() {
    t.current = null;
  };
}
function xh(e, t, n) {
  return n = n != null ? n.concat([e]) : null, _s(4, 4, Sh.bind(null, t, e), n);
}
function Aa() {
}
function kh(e, t) {
  var n = We();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Pa(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
}
function Ph(e, t) {
  var n = We();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Pa(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
}
function Th(e, t, n) {
  return cn & 21 ? (qe(n, t) || (n = Md(), Y.lanes |= n, fn |= n, e.baseState = !0), t) : (e.baseState && (e.baseState = !1, Te = !0), e.memoizedState = n);
}
function Cg(e, t) {
  var n = O;
  O = n !== 0 && 4 > n ? n : 4, e(!0);
  var r = yo.transition;
  yo.transition = {};
  try {
    e(!1), t();
  } finally {
    O = n, yo.transition = r;
  }
}
function Ch() {
  return We().memoizedState;
}
function Eg(e, t, n) {
  var r = jt(e);
  if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Eh(e)) Ah(t, n);
  else if (n = lh(e, t, n, r), n !== null) {
    var i = Se();
    Je(n, e, r, i), Dh(n, t, r);
  }
}
function Ag(e, t, n) {
  var r = jt(e), i = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Eh(e)) Ah(t, i);
  else {
    var s = e.alternate;
    if (e.lanes === 0 && (s === null || s.lanes === 0) && (s = t.lastRenderedReducer, s !== null)) try {
      var o = t.lastRenderedState, l = s(o, n);
      if (i.hasEagerState = !0, i.eagerState = l, qe(l, o)) {
        var a = t.interleaved;
        a === null ? (i.next = i, va(t)) : (i.next = a.next, a.next = i), t.interleaved = i;
        return;
      }
    } catch {
    } finally {
    }
    n = lh(e, t, i, r), n !== null && (i = Se(), Je(n, e, r, i), Dh(n, t, r));
  }
}
function Eh(e) {
  var t = e.alternate;
  return e === Y || t !== null && t === Y;
}
function Ah(e, t) {
  kr = hs = !0;
  var n = e.pending;
  n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
}
function Dh(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, ia(e, n);
  }
}
var ps = { readContext: $e, useCallback: he, useContext: he, useEffect: he, useImperativeHandle: he, useInsertionEffect: he, useLayoutEffect: he, useMemo: he, useReducer: he, useRef: he, useState: he, useDebugValue: he, useDeferredValue: he, useTransition: he, useMutableSource: he, useSyncExternalStore: he, useId: he, unstable_isNewReconciler: !1 }, Dg = { readContext: $e, useCallback: function(e, t) {
  return et().memoizedState = [e, t === void 0 ? null : t], e;
}, useContext: $e, useEffect: ac, useImperativeHandle: function(e, t, n) {
  return n = n != null ? n.concat([e]) : null, Ui(
    4194308,
    4,
    Sh.bind(null, t, e),
    n
  );
}, useLayoutEffect: function(e, t) {
  return Ui(4194308, 4, e, t);
}, useInsertionEffect: function(e, t) {
  return Ui(4, 2, e, t);
}, useMemo: function(e, t) {
  var n = et();
  return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
}, useReducer: function(e, t, n) {
  var r = et();
  return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Eg.bind(null, Y, e), [r.memoizedState, e];
}, useRef: function(e) {
  var t = et();
  return e = { current: e }, t.memoizedState = e;
}, useState: lc, useDebugValue: Aa, useDeferredValue: function(e) {
  return et().memoizedState = e;
}, useTransition: function() {
  var e = lc(!1), t = e[0];
  return e = Cg.bind(null, e[1]), et().memoizedState = e, [t, e];
}, useMutableSource: function() {
}, useSyncExternalStore: function(e, t, n) {
  var r = Y, i = et();
  if (K) {
    if (n === void 0) throw Error(T(407));
    n = n();
  } else {
    if (n = t(), le === null) throw Error(T(349));
    cn & 30 || dh(r, t, n);
  }
  i.memoizedState = n;
  var s = { value: n, getSnapshot: t };
  return i.queue = s, ac(ph.bind(
    null,
    r,
    s,
    e
  ), [e]), r.flags |= 2048, Kr(9, hh.bind(null, r, s, n, t), void 0, null), n;
}, useId: function() {
  var e = et(), t = le.identifierPrefix;
  if (K) {
    var n = ft, r = ct;
    n = (r & ~(1 << 32 - Ze(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Wr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
  } else n = Tg++, t = ":" + t + "r" + n.toString(32) + ":";
  return e.memoizedState = t;
}, unstable_isNewReconciler: !1 }, Mg = {
  readContext: $e,
  useCallback: kh,
  useContext: $e,
  useEffect: Ea,
  useImperativeHandle: xh,
  useInsertionEffect: vh,
  useLayoutEffect: wh,
  useMemo: Ph,
  useReducer: go,
  useRef: gh,
  useState: function() {
    return go(Hr);
  },
  useDebugValue: Aa,
  useDeferredValue: function(e) {
    var t = We();
    return Th(t, re.memoizedState, e);
  },
  useTransition: function() {
    var e = go(Hr)[0], t = We().memoizedState;
    return [e, t];
  },
  useMutableSource: ch,
  useSyncExternalStore: fh,
  useId: Ch,
  unstable_isNewReconciler: !1
}, Rg = { readContext: $e, useCallback: kh, useContext: $e, useEffect: Ea, useImperativeHandle: xh, useInsertionEffect: vh, useLayoutEffect: wh, useMemo: Ph, useReducer: vo, useRef: gh, useState: function() {
  return vo(Hr);
}, useDebugValue: Aa, useDeferredValue: function(e) {
  var t = We();
  return re === null ? t.memoizedState = e : Th(t, re.memoizedState, e);
}, useTransition: function() {
  var e = vo(Hr)[0], t = We().memoizedState;
  return [e, t];
}, useMutableSource: ch, useSyncExternalStore: fh, useId: Ch, unstable_isNewReconciler: !1 };
function Qe(e, t) {
  if (e && e.defaultProps) {
    t = X({}, t), e = e.defaultProps;
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function pl(e, t, n, r) {
  t = e.memoizedState, n = n(r, t), n = n == null ? t : X({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
}
var Ns = { isMounted: function(e) {
  return (e = e._reactInternals) ? pn(e) === e : !1;
}, enqueueSetState: function(e, t, n) {
  e = e._reactInternals;
  var r = Se(), i = jt(e), s = dt(r, i);
  s.payload = t, n != null && (s.callback = n), t = Nt(e, s, i), t !== null && (Je(t, e, i, r), zi(t, e, i));
}, enqueueReplaceState: function(e, t, n) {
  e = e._reactInternals;
  var r = Se(), i = jt(e), s = dt(r, i);
  s.tag = 1, s.payload = t, n != null && (s.callback = n), t = Nt(e, s, i), t !== null && (Je(t, e, i, r), zi(t, e, i));
}, enqueueForceUpdate: function(e, t) {
  e = e._reactInternals;
  var n = Se(), r = jt(e), i = dt(n, r);
  i.tag = 2, t != null && (i.callback = t), t = Nt(e, i, r), t !== null && (Je(t, e, r, n), zi(t, e, r));
} };
function uc(e, t, n, r, i, s, o) {
  return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, s, o) : t.prototype && t.prototype.isPureReactComponent ? !Fr(n, r) || !Fr(i, s) : !0;
}
function Mh(e, t, n) {
  var r = !1, i = zt, s = t.contextType;
  return typeof s == "object" && s !== null ? s = $e(s) : (i = Ee(t) ? an : ve.current, r = t.contextTypes, s = (r = r != null) ? Un(e, i) : zt), t = new t(n, s), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Ns, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = i, e.__reactInternalMemoizedMaskedChildContext = s), t;
}
function cc(e, t, n, r) {
  e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Ns.enqueueReplaceState(t, t.state, null);
}
function ml(e, t, n, r) {
  var i = e.stateNode;
  i.props = n, i.state = e.memoizedState, i.refs = {}, wa(e);
  var s = t.contextType;
  typeof s == "object" && s !== null ? i.context = $e(s) : (s = Ee(t) ? an : ve.current, i.context = Un(e, s)), i.state = e.memoizedState, s = t.getDerivedStateFromProps, typeof s == "function" && (pl(e, t, s, n), i.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (t = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), t !== i.state && Ns.enqueueReplaceState(i, i.state, null), fs(e, n, i, r), i.state = e.memoizedState), typeof i.componentDidMount == "function" && (e.flags |= 4194308);
}
function Kn(e, t) {
  try {
    var n = "", r = t;
    do
      n += iy(r), r = r.return;
    while (r);
    var i = n;
  } catch (s) {
    i = `
Error generating stack: ` + s.message + `
` + s.stack;
  }
  return { value: e, source: t, stack: i, digest: null };
}
function wo(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function yl(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function() {
      throw n;
    });
  }
}
var Vg = typeof WeakMap == "function" ? WeakMap : Map;
function Rh(e, t, n) {
  n = dt(-1, n), n.tag = 3, n.payload = { element: null };
  var r = t.value;
  return n.callback = function() {
    ys || (ys = !0, El = r), yl(e, t);
  }, n;
}
function Vh(e, t, n) {
  n = dt(-1, n), n.tag = 3;
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var i = t.value;
    n.payload = function() {
      return r(i);
    }, n.callback = function() {
      yl(e, t);
    };
  }
  var s = e.stateNode;
  return s !== null && typeof s.componentDidCatch == "function" && (n.callback = function() {
    yl(e, t), typeof r != "function" && (It === null ? It = /* @__PURE__ */ new Set([this]) : It.add(this));
    var o = t.stack;
    this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
  }), n;
}
function fc(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new Vg();
    var i = /* @__PURE__ */ new Set();
    r.set(t, i);
  } else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
  i.has(n) || (i.add(n), e = Kg.bind(null, e, t, n), t.then(e, e));
}
function dc(e) {
  do {
    var t;
    if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function hc(e, t, n, r, i) {
  return e.mode & 1 ? (e.flags |= 65536, e.lanes = i, e) : (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = dt(-1, 1), t.tag = 2, Nt(n, t, 1))), n.lanes |= 1), e);
}
var Lg = St.ReactCurrentOwner, Te = !1;
function we(e, t, n, r) {
  t.child = e === null ? oh(t, null, n, r) : Wn(t, e.child, n, r);
}
function pc(e, t, n, r, i) {
  n = n.render;
  var s = t.ref;
  return On(t, i), r = Ta(e, t, n, r, s, i), n = Ca(), e !== null && !Te ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~i, vt(e, t, i)) : (K && n && da(t), t.flags |= 1, we(e, t, r, i), t.child);
}
function mc(e, t, n, r, i) {
  if (e === null) {
    var s = n.type;
    return typeof s == "function" && !Ia(s) && s.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = s, Lh(e, t, s, r, i)) : (e = Ki(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
  }
  if (s = e.child, !(e.lanes & i)) {
    var o = s.memoizedProps;
    if (n = n.compare, n = n !== null ? n : Fr, n(o, r) && e.ref === t.ref) return vt(e, t, i);
  }
  return t.flags |= 1, e = Ft(s, r), e.ref = t.ref, e.return = t, t.child = e;
}
function Lh(e, t, n, r, i) {
  if (e !== null) {
    var s = e.memoizedProps;
    if (Fr(s, r) && e.ref === t.ref) if (Te = !1, t.pendingProps = r = s, (e.lanes & i) !== 0) e.flags & 131072 && (Te = !0);
    else return t.lanes = e.lanes, vt(e, t, i);
  }
  return gl(e, t, n, r, i);
}
function _h(e, t, n) {
  var r = t.pendingProps, i = r.children, s = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden") if (!(t.mode & 1)) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, U(Dn, De), De |= n;
  else {
    if (!(n & 1073741824)) return e = s !== null ? s.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, U(Dn, De), De |= e, null;
    t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = s !== null ? s.baseLanes : n, U(Dn, De), De |= r;
  }
  else s !== null ? (r = s.baseLanes | n, t.memoizedState = null) : r = n, U(Dn, De), De |= r;
  return we(e, t, i, n), t.child;
}
function Nh(e, t) {
  var n = t.ref;
  (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
}
function gl(e, t, n, r, i) {
  var s = Ee(n) ? an : ve.current;
  return s = Un(t, s), On(t, i), n = Ta(e, t, n, r, s, i), r = Ca(), e !== null && !Te ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~i, vt(e, t, i)) : (K && r && da(t), t.flags |= 1, we(e, t, n, i), t.child);
}
function yc(e, t, n, r, i) {
  if (Ee(n)) {
    var s = !0;
    os(t);
  } else s = !1;
  if (On(t, i), t.stateNode === null) $i(e, t), Mh(t, n, r), ml(t, n, r, i), r = !0;
  else if (e === null) {
    var o = t.stateNode, l = t.memoizedProps;
    o.props = l;
    var a = o.context, u = n.contextType;
    typeof u == "object" && u !== null ? u = $e(u) : (u = Ee(n) ? an : ve.current, u = Un(t, u));
    var c = n.getDerivedStateFromProps, f = typeof c == "function" || typeof o.getSnapshotBeforeUpdate == "function";
    f || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (l !== r || a !== u) && cc(t, o, r, u), Ct = !1;
    var d = t.memoizedState;
    o.state = d, fs(t, r, o, i), a = t.memoizedState, l !== r || d !== a || Ce.current || Ct ? (typeof c == "function" && (pl(t, n, c, r), a = t.memoizedState), (l = Ct || uc(t, n, l, r, d, a, u)) ? (f || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = a), o.props = r, o.state = a, o.context = u, r = l) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
  } else {
    o = t.stateNode, ah(e, t), l = t.memoizedProps, u = t.type === t.elementType ? l : Qe(t.type, l), o.props = u, f = t.pendingProps, d = o.context, a = n.contextType, typeof a == "object" && a !== null ? a = $e(a) : (a = Ee(n) ? an : ve.current, a = Un(t, a));
    var y = n.getDerivedStateFromProps;
    (c = typeof y == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (l !== f || d !== a) && cc(t, o, r, a), Ct = !1, d = t.memoizedState, o.state = d, fs(t, r, o, i);
    var g = t.memoizedState;
    l !== f || d !== g || Ce.current || Ct ? (typeof y == "function" && (pl(t, n, y, r), g = t.memoizedState), (u = Ct || uc(t, n, u, r, d, g, a) || !1) ? (c || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, g, a), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, g, a)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || l === e.memoizedProps && d === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || l === e.memoizedProps && d === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = g), o.props = r, o.state = g, o.context = a, r = u) : (typeof o.componentDidUpdate != "function" || l === e.memoizedProps && d === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || l === e.memoizedProps && d === e.memoizedState || (t.flags |= 1024), r = !1);
  }
  return vl(e, t, n, r, s, i);
}
function vl(e, t, n, r, i, s) {
  Nh(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return i && tc(t, n, !1), vt(e, t, s);
  r = t.stateNode, Lg.current = t;
  var l = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return t.flags |= 1, e !== null && o ? (t.child = Wn(t, e.child, null, s), t.child = Wn(t, null, l, s)) : we(e, t, l, s), t.memoizedState = r.state, i && tc(t, n, !0), t.child;
}
function Ih(e) {
  var t = e.stateNode;
  t.pendingContext ? ec(e, t.pendingContext, t.pendingContext !== t.context) : t.context && ec(e, t.context, !1), Sa(e, t.containerInfo);
}
function gc(e, t, n, r, i) {
  return $n(), pa(i), t.flags |= 256, we(e, t, n, r), t.child;
}
var wl = { dehydrated: null, treeContext: null, retryLane: 0 };
function Sl(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function jh(e, t, n) {
  var r = t.pendingProps, i = G.current, s = !1, o = (t.flags & 128) !== 0, l;
  if ((l = o) || (l = e !== null && e.memoizedState === null ? !1 : (i & 2) !== 0), l ? (s = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (i |= 1), U(G, i & 1), e === null)
    return dl(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? (t.mode & 1 ? e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824 : t.lanes = 1, null) : (o = r.children, e = r.fallback, s ? (r = t.mode, s = t.child, o = { mode: "hidden", children: o }, !(r & 1) && s !== null ? (s.childLanes = 0, s.pendingProps = o) : s = Fs(o, r, 0, null), e = on(e, r, n, null), s.return = t, e.return = t, s.sibling = e, t.child = s, t.child.memoizedState = Sl(n), t.memoizedState = wl, e) : Da(t, o));
  if (i = e.memoizedState, i !== null && (l = i.dehydrated, l !== null)) return _g(e, t, o, r, l, i, n);
  if (s) {
    s = r.fallback, o = t.mode, i = e.child, l = i.sibling;
    var a = { mode: "hidden", children: r.children };
    return !(o & 1) && t.child !== i ? (r = t.child, r.childLanes = 0, r.pendingProps = a, t.deletions = null) : (r = Ft(i, a), r.subtreeFlags = i.subtreeFlags & 14680064), l !== null ? s = Ft(l, s) : (s = on(s, o, n, null), s.flags |= 2), s.return = t, r.return = t, r.sibling = s, t.child = r, r = s, s = t.child, o = e.child.memoizedState, o = o === null ? Sl(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, s.memoizedState = o, s.childLanes = e.childLanes & ~n, t.memoizedState = wl, r;
  }
  return s = e.child, e = s.sibling, r = Ft(s, { mode: "visible", children: r.children }), !(t.mode & 1) && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
}
function Da(e, t) {
  return t = Fs({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
}
function Pi(e, t, n, r) {
  return r !== null && pa(r), Wn(t, e.child, null, n), e = Da(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
}
function _g(e, t, n, r, i, s, o) {
  if (n)
    return t.flags & 256 ? (t.flags &= -257, r = wo(Error(T(422))), Pi(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (s = r.fallback, i = t.mode, r = Fs({ mode: "visible", children: r.children }, i, 0, null), s = on(s, i, o, null), s.flags |= 2, r.return = t, s.return = t, r.sibling = s, t.child = r, t.mode & 1 && Wn(t, e.child, null, o), t.child.memoizedState = Sl(o), t.memoizedState = wl, s);
  if (!(t.mode & 1)) return Pi(e, t, o, null);
  if (i.data === "$!") {
    if (r = i.nextSibling && i.nextSibling.dataset, r) var l = r.dgst;
    return r = l, s = Error(T(419)), r = wo(s, r, void 0), Pi(e, t, o, r);
  }
  if (l = (o & e.childLanes) !== 0, Te || l) {
    if (r = le, r !== null) {
      switch (o & -o) {
        case 4:
          i = 2;
          break;
        case 16:
          i = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          i = 32;
          break;
        case 536870912:
          i = 268435456;
          break;
        default:
          i = 0;
      }
      i = i & (r.suspendedLanes | o) ? 0 : i, i !== 0 && i !== s.retryLane && (s.retryLane = i, gt(e, i), Je(r, e, i, -1));
    }
    return Na(), r = wo(Error(T(421))), Pi(e, t, o, r);
  }
  return i.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Gg.bind(null, e), i._reactRetry = t, null) : (e = s.treeContext, Me = _t(i.nextSibling), Re = t, K = !0, Xe = null, e !== null && (Oe[ze++] = ct, Oe[ze++] = ft, Oe[ze++] = un, ct = e.id, ft = e.overflow, un = t), t = Da(t, r.children), t.flags |= 4096, t);
}
function vc(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), hl(e.return, t, n);
}
function So(e, t, n, r, i) {
  var s = e.memoizedState;
  s === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: i } : (s.isBackwards = t, s.rendering = null, s.renderingStartTime = 0, s.last = r, s.tail = n, s.tailMode = i);
}
function Fh(e, t, n) {
  var r = t.pendingProps, i = r.revealOrder, s = r.tail;
  if (we(e, t, r.children, n), r = G.current, r & 2) r = r & 1 | 2, t.flags |= 128;
  else {
    if (e !== null && e.flags & 128) e: for (e = t.child; e !== null; ) {
      if (e.tag === 13) e.memoizedState !== null && vc(e, n, t);
      else if (e.tag === 19) vc(e, n, t);
      else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break e;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) break e;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    r &= 1;
  }
  if (U(G, r), !(t.mode & 1)) t.memoizedState = null;
  else switch (i) {
    case "forwards":
      for (n = t.child, i = null; n !== null; ) e = n.alternate, e !== null && ds(e) === null && (i = n), n = n.sibling;
      n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), So(t, !1, i, n, s);
      break;
    case "backwards":
      for (n = null, i = t.child, t.child = null; i !== null; ) {
        if (e = i.alternate, e !== null && ds(e) === null) {
          t.child = i;
          break;
        }
        e = i.sibling, i.sibling = n, n = i, i = e;
      }
      So(t, !0, n, null, s);
      break;
    case "together":
      So(t, !1, null, null, void 0);
      break;
    default:
      t.memoizedState = null;
  }
  return t.child;
}
function $i(e, t) {
  !(t.mode & 1) && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
}
function vt(e, t, n) {
  if (e !== null && (t.dependencies = e.dependencies), fn |= t.lanes, !(n & t.childLanes)) return null;
  if (e !== null && t.child !== e.child) throw Error(T(153));
  if (t.child !== null) {
    for (e = t.child, n = Ft(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Ft(e, e.pendingProps), n.return = t;
    n.sibling = null;
  }
  return t.child;
}
function Ng(e, t, n) {
  switch (t.tag) {
    case 3:
      Ih(t), $n();
      break;
    case 5:
      uh(t);
      break;
    case 1:
      Ee(t.type) && os(t);
      break;
    case 4:
      Sa(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context, i = t.memoizedProps.value;
      U(us, r._currentValue), r._currentValue = i;
      break;
    case 13:
      if (r = t.memoizedState, r !== null)
        return r.dehydrated !== null ? (U(G, G.current & 1), t.flags |= 128, null) : n & t.child.childLanes ? jh(e, t, n) : (U(G, G.current & 1), e = vt(e, t, n), e !== null ? e.sibling : null);
      U(G, G.current & 1);
      break;
    case 19:
      if (r = (n & t.childLanes) !== 0, e.flags & 128) {
        if (r) return Fh(e, t, n);
        t.flags |= 128;
      }
      if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), U(G, G.current), r) break;
      return null;
    case 22:
    case 23:
      return t.lanes = 0, _h(e, t, n);
  }
  return vt(e, t, n);
}
var Oh, xl, zh, Bh;
Oh = function(e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      n.child.return = n, n = n.child;
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    n.sibling.return = n.return, n = n.sibling;
  }
};
xl = function() {
};
zh = function(e, t, n, r) {
  var i = e.memoizedProps;
  if (i !== r) {
    e = t.stateNode, nn(rt.current);
    var s = null;
    switch (n) {
      case "input":
        i = Wo(e, i), r = Wo(e, r), s = [];
        break;
      case "select":
        i = X({}, i, { value: void 0 }), r = X({}, r, { value: void 0 }), s = [];
        break;
      case "textarea":
        i = Go(e, i), r = Go(e, r), s = [];
        break;
      default:
        typeof i.onClick != "function" && typeof r.onClick == "function" && (e.onclick = is);
    }
    Yo(n, r);
    var o;
    n = null;
    for (u in i) if (!r.hasOwnProperty(u) && i.hasOwnProperty(u) && i[u] != null) if (u === "style") {
      var l = i[u];
      for (o in l) l.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
    } else u !== "dangerouslySetInnerHTML" && u !== "children" && u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && u !== "autoFocus" && (Rr.hasOwnProperty(u) ? s || (s = []) : (s = s || []).push(u, null));
    for (u in r) {
      var a = r[u];
      if (l = i != null ? i[u] : void 0, r.hasOwnProperty(u) && a !== l && (a != null || l != null)) if (u === "style") if (l) {
        for (o in l) !l.hasOwnProperty(o) || a && a.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
        for (o in a) a.hasOwnProperty(o) && l[o] !== a[o] && (n || (n = {}), n[o] = a[o]);
      } else n || (s || (s = []), s.push(
        u,
        n
      )), n = a;
      else u === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, l = l ? l.__html : void 0, a != null && l !== a && (s = s || []).push(u, a)) : u === "children" ? typeof a != "string" && typeof a != "number" || (s = s || []).push(u, "" + a) : u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && (Rr.hasOwnProperty(u) ? (a != null && u === "onScroll" && W("scroll", e), s || l === a || (s = [])) : (s = s || []).push(u, a));
    }
    n && (s = s || []).push("style", n);
    var u = s;
    (t.updateQueue = u) && (t.flags |= 4);
  }
};
Bh = function(e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function lr(e, t) {
  if (!K) switch (e.tailMode) {
    case "hidden":
      t = e.tail;
      for (var n = null; t !== null; ) t.alternate !== null && (n = t), t = t.sibling;
      n === null ? e.tail = null : n.sibling = null;
      break;
    case "collapsed":
      n = e.tail;
      for (var r = null; n !== null; ) n.alternate !== null && (r = n), n = n.sibling;
      r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
  }
}
function pe(e) {
  var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
  if (t) for (var i = e.child; i !== null; ) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 14680064, r |= i.flags & 14680064, i.return = e, i = i.sibling;
  else for (i = e.child; i !== null; ) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
  return e.subtreeFlags |= r, e.childLanes = n, t;
}
function Ig(e, t, n) {
  var r = t.pendingProps;
  switch (ha(t), t.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return pe(t), null;
    case 1:
      return Ee(t.type) && ss(), pe(t), null;
    case 3:
      return r = t.stateNode, Hn(), H(Ce), H(ve), ka(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (xi(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Xe !== null && (Ml(Xe), Xe = null))), xl(e, t), pe(t), null;
    case 5:
      xa(t);
      var i = nn($r.current);
      if (n = t.type, e !== null && t.stateNode != null) zh(e, t, n, r, i), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(T(166));
          return pe(t), null;
        }
        if (e = nn(rt.current), xi(t)) {
          r = t.stateNode, n = t.type;
          var s = t.memoizedProps;
          switch (r[tt] = t, r[Br] = s, e = (t.mode & 1) !== 0, n) {
            case "dialog":
              W("cancel", r), W("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              W("load", r);
              break;
            case "video":
            case "audio":
              for (i = 0; i < hr.length; i++) W(hr[i], r);
              break;
            case "source":
              W("error", r);
              break;
            case "img":
            case "image":
            case "link":
              W(
                "error",
                r
              ), W("load", r);
              break;
            case "details":
              W("toggle", r);
              break;
            case "input":
              Au(r, s), W("invalid", r);
              break;
            case "select":
              r._wrapperState = { wasMultiple: !!s.multiple }, W("invalid", r);
              break;
            case "textarea":
              Mu(r, s), W("invalid", r);
          }
          Yo(n, s), i = null;
          for (var o in s) if (s.hasOwnProperty(o)) {
            var l = s[o];
            o === "children" ? typeof l == "string" ? r.textContent !== l && (s.suppressHydrationWarning !== !0 && Si(r.textContent, l, e), i = ["children", l]) : typeof l == "number" && r.textContent !== "" + l && (s.suppressHydrationWarning !== !0 && Si(
              r.textContent,
              l,
              e
            ), i = ["children", "" + l]) : Rr.hasOwnProperty(o) && l != null && o === "onScroll" && W("scroll", r);
          }
          switch (n) {
            case "input":
              di(r), Du(r, s, !0);
              break;
            case "textarea":
              di(r), Ru(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof s.onClick == "function" && (r.onclick = is);
          }
          r = i, t.updateQueue = r, r !== null && (t.flags |= 4);
        } else {
          o = i.nodeType === 9 ? i : i.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = pd(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[tt] = t, e[Br] = r, Oh(e, t, !1, !1), t.stateNode = e;
          e: {
            switch (o = Xo(n, r), n) {
              case "dialog":
                W("cancel", e), W("close", e), i = r;
                break;
              case "iframe":
              case "object":
              case "embed":
                W("load", e), i = r;
                break;
              case "video":
              case "audio":
                for (i = 0; i < hr.length; i++) W(hr[i], e);
                i = r;
                break;
              case "source":
                W("error", e), i = r;
                break;
              case "img":
              case "image":
              case "link":
                W(
                  "error",
                  e
                ), W("load", e), i = r;
                break;
              case "details":
                W("toggle", e), i = r;
                break;
              case "input":
                Au(e, r), i = Wo(e, r), W("invalid", e);
                break;
              case "option":
                i = r;
                break;
              case "select":
                e._wrapperState = { wasMultiple: !!r.multiple }, i = X({}, r, { value: void 0 }), W("invalid", e);
                break;
              case "textarea":
                Mu(e, r), i = Go(e, r), W("invalid", e);
                break;
              default:
                i = r;
            }
            Yo(n, i), l = i;
            for (s in l) if (l.hasOwnProperty(s)) {
              var a = l[s];
              s === "style" ? gd(e, a) : s === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, a != null && md(e, a)) : s === "children" ? typeof a == "string" ? (n !== "textarea" || a !== "") && Vr(e, a) : typeof a == "number" && Vr(e, "" + a) : s !== "suppressContentEditableWarning" && s !== "suppressHydrationWarning" && s !== "autoFocus" && (Rr.hasOwnProperty(s) ? a != null && s === "onScroll" && W("scroll", e) : a != null && ql(e, s, a, o));
            }
            switch (n) {
              case "input":
                di(e), Du(e, r, !1);
                break;
              case "textarea":
                di(e), Ru(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + Ot(r.value));
                break;
              case "select":
                e.multiple = !!r.multiple, s = r.value, s != null ? Nn(e, !!r.multiple, s, !1) : r.defaultValue != null && Nn(
                  e,
                  !!r.multiple,
                  r.defaultValue,
                  !0
                );
                break;
              default:
                typeof i.onClick == "function" && (e.onclick = is);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
      }
      return pe(t), null;
    case 6:
      if (e && t.stateNode != null) Bh(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(T(166));
        if (n = nn($r.current), nn(rt.current), xi(t)) {
          if (r = t.stateNode, n = t.memoizedProps, r[tt] = t, (s = r.nodeValue !== n) && (e = Re, e !== null)) switch (e.tag) {
            case 3:
              Si(r.nodeValue, n, (e.mode & 1) !== 0);
              break;
            case 5:
              e.memoizedProps.suppressHydrationWarning !== !0 && Si(r.nodeValue, n, (e.mode & 1) !== 0);
          }
          s && (t.flags |= 4);
        } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[tt] = t, t.stateNode = r;
      }
      return pe(t), null;
    case 13:
      if (H(G), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
        if (K && Me !== null && t.mode & 1 && !(t.flags & 128)) ih(), $n(), t.flags |= 98560, s = !1;
        else if (s = xi(t), r !== null && r.dehydrated !== null) {
          if (e === null) {
            if (!s) throw Error(T(318));
            if (s = t.memoizedState, s = s !== null ? s.dehydrated : null, !s) throw Error(T(317));
            s[tt] = t;
          } else $n(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
          pe(t), s = !1;
        } else Xe !== null && (Ml(Xe), Xe = null), s = !0;
        if (!s) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, t.mode & 1 && (e === null || G.current & 1 ? ie === 0 && (ie = 3) : Na())), t.updateQueue !== null && (t.flags |= 4), pe(t), null);
    case 4:
      return Hn(), xl(e, t), e === null && Or(t.stateNode.containerInfo), pe(t), null;
    case 10:
      return ga(t.type._context), pe(t), null;
    case 17:
      return Ee(t.type) && ss(), pe(t), null;
    case 19:
      if (H(G), s = t.memoizedState, s === null) return pe(t), null;
      if (r = (t.flags & 128) !== 0, o = s.rendering, o === null) if (r) lr(s, !1);
      else {
        if (ie !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null; ) {
          if (o = ds(e), o !== null) {
            for (t.flags |= 128, lr(s, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) s = n, e = r, s.flags &= 14680066, o = s.alternate, o === null ? (s.childLanes = 0, s.lanes = e, s.child = null, s.subtreeFlags = 0, s.memoizedProps = null, s.memoizedState = null, s.updateQueue = null, s.dependencies = null, s.stateNode = null) : (s.childLanes = o.childLanes, s.lanes = o.lanes, s.child = o.child, s.subtreeFlags = 0, s.deletions = null, s.memoizedProps = o.memoizedProps, s.memoizedState = o.memoizedState, s.updateQueue = o.updateQueue, s.type = o.type, e = o.dependencies, s.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
            return U(G, G.current & 1 | 2), t.child;
          }
          e = e.sibling;
        }
        s.tail !== null && te() > Gn && (t.flags |= 128, r = !0, lr(s, !1), t.lanes = 4194304);
      }
      else {
        if (!r) if (e = ds(o), e !== null) {
          if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), lr(s, !0), s.tail === null && s.tailMode === "hidden" && !o.alternate && !K) return pe(t), null;
        } else 2 * te() - s.renderingStartTime > Gn && n !== 1073741824 && (t.flags |= 128, r = !0, lr(s, !1), t.lanes = 4194304);
        s.isBackwards ? (o.sibling = t.child, t.child = o) : (n = s.last, n !== null ? n.sibling = o : t.child = o, s.last = o);
      }
      return s.tail !== null ? (t = s.tail, s.rendering = t, s.tail = t.sibling, s.renderingStartTime = te(), t.sibling = null, n = G.current, U(G, r ? n & 1 | 2 : n & 1), t) : (pe(t), null);
    case 22:
    case 23:
      return _a(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && t.mode & 1 ? De & 1073741824 && (pe(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : pe(t), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(T(156, t.tag));
}
function jg(e, t) {
  switch (ha(t), t.tag) {
    case 1:
      return Ee(t.type) && ss(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 3:
      return Hn(), H(Ce), H(ve), ka(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
    case 5:
      return xa(t), null;
    case 13:
      if (H(G), e = t.memoizedState, e !== null && e.dehydrated !== null) {
        if (t.alternate === null) throw Error(T(340));
        $n();
      }
      return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 19:
      return H(G), null;
    case 4:
      return Hn(), null;
    case 10:
      return ga(t.type._context), null;
    case 22:
    case 23:
      return _a(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Ti = !1, ye = !1, Fg = typeof WeakSet == "function" ? WeakSet : Set, D = null;
function An(e, t) {
  var n = e.ref;
  if (n !== null) if (typeof n == "function") try {
    n(null);
  } catch (r) {
    J(e, t, r);
  }
  else n.current = null;
}
function kl(e, t, n) {
  try {
    n();
  } catch (r) {
    J(e, t, r);
  }
}
var wc = !1;
function Og(e, t) {
  if (sl = ts, e = Kd(), fa(e)) {
    if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
    else e: {
      n = (n = e.ownerDocument) && n.defaultView || window;
      var r = n.getSelection && n.getSelection();
      if (r && r.rangeCount !== 0) {
        n = r.anchorNode;
        var i = r.anchorOffset, s = r.focusNode;
        r = r.focusOffset;
        try {
          n.nodeType, s.nodeType;
        } catch {
          n = null;
          break e;
        }
        var o = 0, l = -1, a = -1, u = 0, c = 0, f = e, d = null;
        t: for (; ; ) {
          for (var y; f !== n || i !== 0 && f.nodeType !== 3 || (l = o + i), f !== s || r !== 0 && f.nodeType !== 3 || (a = o + r), f.nodeType === 3 && (o += f.nodeValue.length), (y = f.firstChild) !== null; )
            d = f, f = y;
          for (; ; ) {
            if (f === e) break t;
            if (d === n && ++u === i && (l = o), d === s && ++c === r && (a = o), (y = f.nextSibling) !== null) break;
            f = d, d = f.parentNode;
          }
          f = y;
        }
        n = l === -1 || a === -1 ? null : { start: l, end: a };
      } else n = null;
    }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (ol = { focusedElem: e, selectionRange: n }, ts = !1, D = t; D !== null; ) if (t = D, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, D = e;
  else for (; D !== null; ) {
    t = D;
    try {
      var g = t.alternate;
      if (t.flags & 1024) switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (g !== null) {
            var v = g.memoizedProps, x = g.memoizedState, p = t.stateNode, h = p.getSnapshotBeforeUpdate(t.elementType === t.type ? v : Qe(t.type, v), x);
            p.__reactInternalSnapshotBeforeUpdate = h;
          }
          break;
        case 3:
          var m = t.stateNode.containerInfo;
          m.nodeType === 1 ? m.textContent = "" : m.nodeType === 9 && m.documentElement && m.removeChild(m.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(T(163));
      }
    } catch (w) {
      J(t, t.return, w);
    }
    if (e = t.sibling, e !== null) {
      e.return = t.return, D = e;
      break;
    }
    D = t.return;
  }
  return g = wc, wc = !1, g;
}
function Pr(e, t, n) {
  var r = t.updateQueue;
  if (r = r !== null ? r.lastEffect : null, r !== null) {
    var i = r = r.next;
    do {
      if ((i.tag & e) === e) {
        var s = i.destroy;
        i.destroy = void 0, s !== void 0 && kl(t, n, s);
      }
      i = i.next;
    } while (i !== r);
  }
}
function Is(e, t) {
  if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
    var n = t = t.next;
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function Pl(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : t.current = e;
  }
}
function Uh(e) {
  var t = e.alternate;
  t !== null && (e.alternate = null, Uh(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[tt], delete t[Br], delete t[ul], delete t[Sg], delete t[xg])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
}
function $h(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Sc(e) {
  e: for (; ; ) {
    for (; e.sibling === null; ) {
      if (e.return === null || $h(e.return)) return null;
      e = e.return;
    }
    for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      e.child.return = e, e = e.child;
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function Tl(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = is));
  else if (r !== 4 && (e = e.child, e !== null)) for (Tl(e, t, n), e = e.sibling; e !== null; ) Tl(e, t, n), e = e.sibling;
}
function Cl(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && (e = e.child, e !== null)) for (Cl(e, t, n), e = e.sibling; e !== null; ) Cl(e, t, n), e = e.sibling;
}
var ae = null, Ye = !1;
function kt(e, t, n) {
  for (n = n.child; n !== null; ) Wh(e, t, n), n = n.sibling;
}
function Wh(e, t, n) {
  if (nt && typeof nt.onCommitFiberUnmount == "function") try {
    nt.onCommitFiberUnmount(As, n);
  } catch {
  }
  switch (n.tag) {
    case 5:
      ye || An(n, t);
    case 6:
      var r = ae, i = Ye;
      ae = null, kt(e, t, n), ae = r, Ye = i, ae !== null && (Ye ? (e = ae, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : ae.removeChild(n.stateNode));
      break;
    case 18:
      ae !== null && (Ye ? (e = ae, n = n.stateNode, e.nodeType === 8 ? ho(e.parentNode, n) : e.nodeType === 1 && ho(e, n), Ir(e)) : ho(ae, n.stateNode));
      break;
    case 4:
      r = ae, i = Ye, ae = n.stateNode.containerInfo, Ye = !0, kt(e, t, n), ae = r, Ye = i;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!ye && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
        i = r = r.next;
        do {
          var s = i, o = s.destroy;
          s = s.tag, o !== void 0 && (s & 2 || s & 4) && kl(n, t, o), i = i.next;
        } while (i !== r);
      }
      kt(e, t, n);
      break;
    case 1:
      if (!ye && (An(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
        r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
      } catch (l) {
        J(n, t, l);
      }
      kt(e, t, n);
      break;
    case 21:
      kt(e, t, n);
      break;
    case 22:
      n.mode & 1 ? (ye = (r = ye) || n.memoizedState !== null, kt(e, t, n), ye = r) : kt(e, t, n);
      break;
    default:
      kt(e, t, n);
  }
}
function xc(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new Fg()), t.forEach(function(r) {
      var i = Qg.bind(null, e, r);
      n.has(r) || (n.add(r), r.then(i, i));
    });
  }
}
function Ke(e, t) {
  var n = t.deletions;
  if (n !== null) for (var r = 0; r < n.length; r++) {
    var i = n[r];
    try {
      var s = e, o = t, l = o;
      e: for (; l !== null; ) {
        switch (l.tag) {
          case 5:
            ae = l.stateNode, Ye = !1;
            break e;
          case 3:
            ae = l.stateNode.containerInfo, Ye = !0;
            break e;
          case 4:
            ae = l.stateNode.containerInfo, Ye = !0;
            break e;
        }
        l = l.return;
      }
      if (ae === null) throw Error(T(160));
      Wh(s, o, i), ae = null, Ye = !1;
      var a = i.alternate;
      a !== null && (a.return = null), i.return = null;
    } catch (u) {
      J(i, t, u);
    }
  }
  if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Hh(t, e), t = t.sibling;
}
function Hh(e, t) {
  var n = e.alternate, r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if (Ke(t, e), be(e), r & 4) {
        try {
          Pr(3, e, e.return), Is(3, e);
        } catch (v) {
          J(e, e.return, v);
        }
        try {
          Pr(5, e, e.return);
        } catch (v) {
          J(e, e.return, v);
        }
      }
      break;
    case 1:
      Ke(t, e), be(e), r & 512 && n !== null && An(n, n.return);
      break;
    case 5:
      if (Ke(t, e), be(e), r & 512 && n !== null && An(n, n.return), e.flags & 32) {
        var i = e.stateNode;
        try {
          Vr(i, "");
        } catch (v) {
          J(e, e.return, v);
        }
      }
      if (r & 4 && (i = e.stateNode, i != null)) {
        var s = e.memoizedProps, o = n !== null ? n.memoizedProps : s, l = e.type, a = e.updateQueue;
        if (e.updateQueue = null, a !== null) try {
          l === "input" && s.type === "radio" && s.name != null && dd(i, s), Xo(l, o);
          var u = Xo(l, s);
          for (o = 0; o < a.length; o += 2) {
            var c = a[o], f = a[o + 1];
            c === "style" ? gd(i, f) : c === "dangerouslySetInnerHTML" ? md(i, f) : c === "children" ? Vr(i, f) : ql(i, c, f, u);
          }
          switch (l) {
            case "input":
              Ho(i, s);
              break;
            case "textarea":
              hd(i, s);
              break;
            case "select":
              var d = i._wrapperState.wasMultiple;
              i._wrapperState.wasMultiple = !!s.multiple;
              var y = s.value;
              y != null ? Nn(i, !!s.multiple, y, !1) : d !== !!s.multiple && (s.defaultValue != null ? Nn(
                i,
                !!s.multiple,
                s.defaultValue,
                !0
              ) : Nn(i, !!s.multiple, s.multiple ? [] : "", !1));
          }
          i[Br] = s;
        } catch (v) {
          J(e, e.return, v);
        }
      }
      break;
    case 6:
      if (Ke(t, e), be(e), r & 4) {
        if (e.stateNode === null) throw Error(T(162));
        i = e.stateNode, s = e.memoizedProps;
        try {
          i.nodeValue = s;
        } catch (v) {
          J(e, e.return, v);
        }
      }
      break;
    case 3:
      if (Ke(t, e), be(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
        Ir(t.containerInfo);
      } catch (v) {
        J(e, e.return, v);
      }
      break;
    case 4:
      Ke(t, e), be(e);
      break;
    case 13:
      Ke(t, e), be(e), i = e.child, i.flags & 8192 && (s = i.memoizedState !== null, i.stateNode.isHidden = s, !s || i.alternate !== null && i.alternate.memoizedState !== null || (Va = te())), r & 4 && xc(e);
      break;
    case 22:
      if (c = n !== null && n.memoizedState !== null, e.mode & 1 ? (ye = (u = ye) || c, Ke(t, e), ye = u) : Ke(t, e), be(e), r & 8192) {
        if (u = e.memoizedState !== null, (e.stateNode.isHidden = u) && !c && e.mode & 1) for (D = e, c = e.child; c !== null; ) {
          for (f = D = c; D !== null; ) {
            switch (d = D, y = d.child, d.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pr(4, d, d.return);
                break;
              case 1:
                An(d, d.return);
                var g = d.stateNode;
                if (typeof g.componentWillUnmount == "function") {
                  r = d, n = d.return;
                  try {
                    t = r, g.props = t.memoizedProps, g.state = t.memoizedState, g.componentWillUnmount();
                  } catch (v) {
                    J(r, n, v);
                  }
                }
                break;
              case 5:
                An(d, d.return);
                break;
              case 22:
                if (d.memoizedState !== null) {
                  Pc(f);
                  continue;
                }
            }
            y !== null ? (y.return = d, D = y) : Pc(f);
          }
          c = c.sibling;
        }
        e: for (c = null, f = e; ; ) {
          if (f.tag === 5) {
            if (c === null) {
              c = f;
              try {
                i = f.stateNode, u ? (s = i.style, typeof s.setProperty == "function" ? s.setProperty("display", "none", "important") : s.display = "none") : (l = f.stateNode, a = f.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null, l.style.display = yd("display", o));
              } catch (v) {
                J(e, e.return, v);
              }
            }
          } else if (f.tag === 6) {
            if (c === null) try {
              f.stateNode.nodeValue = u ? "" : f.memoizedProps;
            } catch (v) {
              J(e, e.return, v);
            }
          } else if ((f.tag !== 22 && f.tag !== 23 || f.memoizedState === null || f === e) && f.child !== null) {
            f.child.return = f, f = f.child;
            continue;
          }
          if (f === e) break e;
          for (; f.sibling === null; ) {
            if (f.return === null || f.return === e) break e;
            c === f && (c = null), f = f.return;
          }
          c === f && (c = null), f.sibling.return = f.return, f = f.sibling;
        }
      }
      break;
    case 19:
      Ke(t, e), be(e), r & 4 && xc(e);
      break;
    case 21:
      break;
    default:
      Ke(
        t,
        e
      ), be(e);
  }
}
function be(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if ($h(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(T(160));
      }
      switch (r.tag) {
        case 5:
          var i = r.stateNode;
          r.flags & 32 && (Vr(i, ""), r.flags &= -33);
          var s = Sc(e);
          Cl(e, s, i);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo, l = Sc(e);
          Tl(e, l, o);
          break;
        default:
          throw Error(T(161));
      }
    } catch (a) {
      J(e, e.return, a);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function zg(e, t, n) {
  D = e, Kh(e);
}
function Kh(e, t, n) {
  for (var r = (e.mode & 1) !== 0; D !== null; ) {
    var i = D, s = i.child;
    if (i.tag === 22 && r) {
      var o = i.memoizedState !== null || Ti;
      if (!o) {
        var l = i.alternate, a = l !== null && l.memoizedState !== null || ye;
        l = Ti;
        var u = ye;
        if (Ti = o, (ye = a) && !u) for (D = i; D !== null; ) o = D, a = o.child, o.tag === 22 && o.memoizedState !== null ? Tc(i) : a !== null ? (a.return = o, D = a) : Tc(i);
        for (; s !== null; ) D = s, Kh(s), s = s.sibling;
        D = i, Ti = l, ye = u;
      }
      kc(e);
    } else i.subtreeFlags & 8772 && s !== null ? (s.return = i, D = s) : kc(e);
  }
}
function kc(e) {
  for (; D !== null; ) {
    var t = D;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            ye || Is(5, t);
            break;
          case 1:
            var r = t.stateNode;
            if (t.flags & 4 && !ye) if (n === null) r.componentDidMount();
            else {
              var i = t.elementType === t.type ? n.memoizedProps : Qe(t.type, n.memoizedProps);
              r.componentDidUpdate(i, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
            }
            var s = t.updateQueue;
            s !== null && oc(t, s, r);
            break;
          case 3:
            var o = t.updateQueue;
            if (o !== null) {
              if (n = null, t.child !== null) switch (t.child.tag) {
                case 5:
                  n = t.child.stateNode;
                  break;
                case 1:
                  n = t.child.stateNode;
              }
              oc(t, o, n);
            }
            break;
          case 5:
            var l = t.stateNode;
            if (n === null && t.flags & 4) {
              n = l;
              var a = t.memoizedProps;
              switch (t.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  a.autoFocus && n.focus();
                  break;
                case "img":
                  a.src && (n.src = a.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (t.memoizedState === null) {
              var u = t.alternate;
              if (u !== null) {
                var c = u.memoizedState;
                if (c !== null) {
                  var f = c.dehydrated;
                  f !== null && Ir(f);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(T(163));
        }
        ye || t.flags & 512 && Pl(t);
      } catch (d) {
        J(t, t.return, d);
      }
    }
    if (t === e) {
      D = null;
      break;
    }
    if (n = t.sibling, n !== null) {
      n.return = t.return, D = n;
      break;
    }
    D = t.return;
  }
}
function Pc(e) {
  for (; D !== null; ) {
    var t = D;
    if (t === e) {
      D = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      n.return = t.return, D = n;
      break;
    }
    D = t.return;
  }
}
function Tc(e) {
  for (; D !== null; ) {
    var t = D;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            Is(4, t);
          } catch (a) {
            J(t, n, a);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var i = t.return;
            try {
              r.componentDidMount();
            } catch (a) {
              J(t, i, a);
            }
          }
          var s = t.return;
          try {
            Pl(t);
          } catch (a) {
            J(t, s, a);
          }
          break;
        case 5:
          var o = t.return;
          try {
            Pl(t);
          } catch (a) {
            J(t, o, a);
          }
      }
    } catch (a) {
      J(t, t.return, a);
    }
    if (t === e) {
      D = null;
      break;
    }
    var l = t.sibling;
    if (l !== null) {
      l.return = t.return, D = l;
      break;
    }
    D = t.return;
  }
}
var Bg = Math.ceil, ms = St.ReactCurrentDispatcher, Ma = St.ReactCurrentOwner, Ue = St.ReactCurrentBatchConfig, F = 0, le = null, ne = null, ce = 0, De = 0, Dn = Wt(0), ie = 0, Gr = null, fn = 0, js = 0, Ra = 0, Tr = null, Pe = null, Va = 0, Gn = 1 / 0, at = null, ys = !1, El = null, It = null, Ci = !1, Mt = null, gs = 0, Cr = 0, Al = null, Wi = -1, Hi = 0;
function Se() {
  return F & 6 ? te() : Wi !== -1 ? Wi : Wi = te();
}
function jt(e) {
  return e.mode & 1 ? F & 2 && ce !== 0 ? ce & -ce : Pg.transition !== null ? (Hi === 0 && (Hi = Md()), Hi) : (e = O, e !== 0 || (e = window.event, e = e === void 0 ? 16 : jd(e.type)), e) : 1;
}
function Je(e, t, n, r) {
  if (50 < Cr) throw Cr = 0, Al = null, Error(T(185));
  ei(e, n, r), (!(F & 2) || e !== le) && (e === le && (!(F & 2) && (js |= n), ie === 4 && At(e, ce)), Ae(e, r), n === 1 && F === 0 && !(t.mode & 1) && (Gn = te() + 500, Ls && Ht()));
}
function Ae(e, t) {
  var n = e.callbackNode;
  Py(e, t);
  var r = es(e, e === le ? ce : 0);
  if (r === 0) n !== null && _u(n), e.callbackNode = null, e.callbackPriority = 0;
  else if (t = r & -r, e.callbackPriority !== t) {
    if (n != null && _u(n), t === 1) e.tag === 0 ? kg(Cc.bind(null, e)) : th(Cc.bind(null, e)), vg(function() {
      !(F & 6) && Ht();
    }), n = null;
    else {
      switch (Rd(r)) {
        case 1:
          n = ra;
          break;
        case 4:
          n = Ad;
          break;
        case 16:
          n = bi;
          break;
        case 536870912:
          n = Dd;
          break;
        default:
          n = bi;
      }
      n = bh(n, Gh.bind(null, e));
    }
    e.callbackPriority = t, e.callbackNode = n;
  }
}
function Gh(e, t) {
  if (Wi = -1, Hi = 0, F & 6) throw Error(T(327));
  var n = e.callbackNode;
  if (zn() && e.callbackNode !== n) return null;
  var r = es(e, e === le ? ce : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = vs(e, r);
  else {
    t = r;
    var i = F;
    F |= 2;
    var s = Yh();
    (le !== e || ce !== t) && (at = null, Gn = te() + 500, sn(e, t));
    do
      try {
        Wg();
        break;
      } catch (l) {
        Qh(e, l);
      }
    while (!0);
    ya(), ms.current = s, F = i, ne !== null ? t = 0 : (le = null, ce = 0, t = ie);
  }
  if (t !== 0) {
    if (t === 2 && (i = el(e), i !== 0 && (r = i, t = Dl(e, i))), t === 1) throw n = Gr, sn(e, 0), At(e, r), Ae(e, te()), n;
    if (t === 6) At(e, r);
    else {
      if (i = e.current.alternate, !(r & 30) && !Ug(i) && (t = vs(e, r), t === 2 && (s = el(e), s !== 0 && (r = s, t = Dl(e, s))), t === 1)) throw n = Gr, sn(e, 0), At(e, r), Ae(e, te()), n;
      switch (e.finishedWork = i, e.finishedLanes = r, t) {
        case 0:
        case 1:
          throw Error(T(345));
        case 2:
          Jt(e, Pe, at);
          break;
        case 3:
          if (At(e, r), (r & 130023424) === r && (t = Va + 500 - te(), 10 < t)) {
            if (es(e, 0) !== 0) break;
            if (i = e.suspendedLanes, (i & r) !== r) {
              Se(), e.pingedLanes |= e.suspendedLanes & i;
              break;
            }
            e.timeoutHandle = al(Jt.bind(null, e, Pe, at), t);
            break;
          }
          Jt(e, Pe, at);
          break;
        case 4:
          if (At(e, r), (r & 4194240) === r) break;
          for (t = e.eventTimes, i = -1; 0 < r; ) {
            var o = 31 - Ze(r);
            s = 1 << o, o = t[o], o > i && (i = o), r &= ~s;
          }
          if (r = i, r = te() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Bg(r / 1960)) - r, 10 < r) {
            e.timeoutHandle = al(Jt.bind(null, e, Pe, at), r);
            break;
          }
          Jt(e, Pe, at);
          break;
        case 5:
          Jt(e, Pe, at);
          break;
        default:
          throw Error(T(329));
      }
    }
  }
  return Ae(e, te()), e.callbackNode === n ? Gh.bind(null, e) : null;
}
function Dl(e, t) {
  var n = Tr;
  return e.current.memoizedState.isDehydrated && (sn(e, t).flags |= 256), e = vs(e, t), e !== 2 && (t = Pe, Pe = n, t !== null && Ml(t)), e;
}
function Ml(e) {
  Pe === null ? Pe = e : Pe.push.apply(Pe, e);
}
function Ug(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
        var i = n[r], s = i.getSnapshot;
        i = i.value;
        try {
          if (!qe(s(), i)) return !1;
        } catch {
          return !1;
        }
      }
    }
    if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
  }
  return !0;
}
function At(e, t) {
  for (t &= ~Ra, t &= ~js, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
    var n = 31 - Ze(t), r = 1 << n;
    e[n] = -1, t &= ~r;
  }
}
function Cc(e) {
  if (F & 6) throw Error(T(327));
  zn();
  var t = es(e, 0);
  if (!(t & 1)) return Ae(e, te()), null;
  var n = vs(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = el(e);
    r !== 0 && (t = r, n = Dl(e, r));
  }
  if (n === 1) throw n = Gr, sn(e, 0), At(e, t), Ae(e, te()), n;
  if (n === 6) throw Error(T(345));
  return e.finishedWork = e.current.alternate, e.finishedLanes = t, Jt(e, Pe, at), Ae(e, te()), null;
}
function La(e, t) {
  var n = F;
  F |= 1;
  try {
    return e(t);
  } finally {
    F = n, F === 0 && (Gn = te() + 500, Ls && Ht());
  }
}
function dn(e) {
  Mt !== null && Mt.tag === 0 && !(F & 6) && zn();
  var t = F;
  F |= 1;
  var n = Ue.transition, r = O;
  try {
    if (Ue.transition = null, O = 1, e) return e();
  } finally {
    O = r, Ue.transition = n, F = t, !(F & 6) && Ht();
  }
}
function _a() {
  De = Dn.current, H(Dn);
}
function sn(e, t) {
  e.finishedWork = null, e.finishedLanes = 0;
  var n = e.timeoutHandle;
  if (n !== -1 && (e.timeoutHandle = -1, gg(n)), ne !== null) for (n = ne.return; n !== null; ) {
    var r = n;
    switch (ha(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r != null && ss();
        break;
      case 3:
        Hn(), H(Ce), H(ve), ka();
        break;
      case 5:
        xa(r);
        break;
      case 4:
        Hn();
        break;
      case 13:
        H(G);
        break;
      case 19:
        H(G);
        break;
      case 10:
        ga(r.type._context);
        break;
      case 22:
      case 23:
        _a();
    }
    n = n.return;
  }
  if (le = e, ne = e = Ft(e.current, null), ce = De = t, ie = 0, Gr = null, Ra = js = fn = 0, Pe = Tr = null, tn !== null) {
    for (t = 0; t < tn.length; t++) if (n = tn[t], r = n.interleaved, r !== null) {
      n.interleaved = null;
      var i = r.next, s = n.pending;
      if (s !== null) {
        var o = s.next;
        s.next = i, r.next = o;
      }
      n.pending = r;
    }
    tn = null;
  }
  return e;
}
function Qh(e, t) {
  do {
    var n = ne;
    try {
      if (ya(), Bi.current = ps, hs) {
        for (var r = Y.memoizedState; r !== null; ) {
          var i = r.queue;
          i !== null && (i.pending = null), r = r.next;
        }
        hs = !1;
      }
      if (cn = 0, oe = re = Y = null, kr = !1, Wr = 0, Ma.current = null, n === null || n.return === null) {
        ie = 1, Gr = t, ne = null;
        break;
      }
      e: {
        var s = e, o = n.return, l = n, a = t;
        if (t = ce, l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
          var u = a, c = l, f = c.tag;
          if (!(c.mode & 1) && (f === 0 || f === 11 || f === 15)) {
            var d = c.alternate;
            d ? (c.updateQueue = d.updateQueue, c.memoizedState = d.memoizedState, c.lanes = d.lanes) : (c.updateQueue = null, c.memoizedState = null);
          }
          var y = dc(o);
          if (y !== null) {
            y.flags &= -257, hc(y, o, l, s, t), y.mode & 1 && fc(s, u, t), t = y, a = u;
            var g = t.updateQueue;
            if (g === null) {
              var v = /* @__PURE__ */ new Set();
              v.add(a), t.updateQueue = v;
            } else g.add(a);
            break e;
          } else {
            if (!(t & 1)) {
              fc(s, u, t), Na();
              break e;
            }
            a = Error(T(426));
          }
        } else if (K && l.mode & 1) {
          var x = dc(o);
          if (x !== null) {
            !(x.flags & 65536) && (x.flags |= 256), hc(x, o, l, s, t), pa(Kn(a, l));
            break e;
          }
        }
        s = a = Kn(a, l), ie !== 4 && (ie = 2), Tr === null ? Tr = [s] : Tr.push(s), s = o;
        do {
          switch (s.tag) {
            case 3:
              s.flags |= 65536, t &= -t, s.lanes |= t;
              var p = Rh(s, a, t);
              sc(s, p);
              break e;
            case 1:
              l = a;
              var h = s.type, m = s.stateNode;
              if (!(s.flags & 128) && (typeof h.getDerivedStateFromError == "function" || m !== null && typeof m.componentDidCatch == "function" && (It === null || !It.has(m)))) {
                s.flags |= 65536, t &= -t, s.lanes |= t;
                var w = Vh(s, l, t);
                sc(s, w);
                break e;
              }
          }
          s = s.return;
        } while (s !== null);
      }
      Zh(n);
    } catch (S) {
      t = S, ne === n && n !== null && (ne = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function Yh() {
  var e = ms.current;
  return ms.current = ps, e === null ? ps : e;
}
function Na() {
  (ie === 0 || ie === 3 || ie === 2) && (ie = 4), le === null || !(fn & 268435455) && !(js & 268435455) || At(le, ce);
}
function vs(e, t) {
  var n = F;
  F |= 2;
  var r = Yh();
  (le !== e || ce !== t) && (at = null, sn(e, t));
  do
    try {
      $g();
      break;
    } catch (i) {
      Qh(e, i);
    }
  while (!0);
  if (ya(), F = n, ms.current = r, ne !== null) throw Error(T(261));
  return le = null, ce = 0, ie;
}
function $g() {
  for (; ne !== null; ) Xh(ne);
}
function Wg() {
  for (; ne !== null && !py(); ) Xh(ne);
}
function Xh(e) {
  var t = qh(e.alternate, e, De);
  e.memoizedProps = e.pendingProps, t === null ? Zh(e) : ne = t, Ma.current = null;
}
function Zh(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (e = t.return, t.flags & 32768) {
      if (n = jg(n, t), n !== null) {
        n.flags &= 32767, ne = n;
        return;
      }
      if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
      else {
        ie = 6, ne = null;
        return;
      }
    } else if (n = Ig(n, t, De), n !== null) {
      ne = n;
      return;
    }
    if (t = t.sibling, t !== null) {
      ne = t;
      return;
    }
    ne = t = e;
  } while (t !== null);
  ie === 0 && (ie = 5);
}
function Jt(e, t, n) {
  var r = O, i = Ue.transition;
  try {
    Ue.transition = null, O = 1, Hg(e, t, n, r);
  } finally {
    Ue.transition = i, O = r;
  }
  return null;
}
function Hg(e, t, n, r) {
  do
    zn();
  while (Mt !== null);
  if (F & 6) throw Error(T(327));
  n = e.finishedWork;
  var i = e.finishedLanes;
  if (n === null) return null;
  if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(T(177));
  e.callbackNode = null, e.callbackPriority = 0;
  var s = n.lanes | n.childLanes;
  if (Ty(e, s), e === le && (ne = le = null, ce = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || Ci || (Ci = !0, bh(bi, function() {
    return zn(), null;
  })), s = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || s) {
    s = Ue.transition, Ue.transition = null;
    var o = O;
    O = 1;
    var l = F;
    F |= 4, Ma.current = null, Og(e, n), Hh(n, e), cg(ol), ts = !!sl, ol = sl = null, e.current = n, zg(n), my(), F = l, O = o, Ue.transition = s;
  } else e.current = n;
  if (Ci && (Ci = !1, Mt = e, gs = i), s = e.pendingLanes, s === 0 && (It = null), vy(n.stateNode), Ae(e, te()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) i = t[n], r(i.value, { componentStack: i.stack, digest: i.digest });
  if (ys) throw ys = !1, e = El, El = null, e;
  return gs & 1 && e.tag !== 0 && zn(), s = e.pendingLanes, s & 1 ? e === Al ? Cr++ : (Cr = 0, Al = e) : Cr = 0, Ht(), null;
}
function zn() {
  if (Mt !== null) {
    var e = Rd(gs), t = Ue.transition, n = O;
    try {
      if (Ue.transition = null, O = 16 > e ? 16 : e, Mt === null) var r = !1;
      else {
        if (e = Mt, Mt = null, gs = 0, F & 6) throw Error(T(331));
        var i = F;
        for (F |= 4, D = e.current; D !== null; ) {
          var s = D, o = s.child;
          if (D.flags & 16) {
            var l = s.deletions;
            if (l !== null) {
              for (var a = 0; a < l.length; a++) {
                var u = l[a];
                for (D = u; D !== null; ) {
                  var c = D;
                  switch (c.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pr(8, c, s);
                  }
                  var f = c.child;
                  if (f !== null) f.return = c, D = f;
                  else for (; D !== null; ) {
                    c = D;
                    var d = c.sibling, y = c.return;
                    if (Uh(c), c === u) {
                      D = null;
                      break;
                    }
                    if (d !== null) {
                      d.return = y, D = d;
                      break;
                    }
                    D = y;
                  }
                }
              }
              var g = s.alternate;
              if (g !== null) {
                var v = g.child;
                if (v !== null) {
                  g.child = null;
                  do {
                    var x = v.sibling;
                    v.sibling = null, v = x;
                  } while (v !== null);
                }
              }
              D = s;
            }
          }
          if (s.subtreeFlags & 2064 && o !== null) o.return = s, D = o;
          else e: for (; D !== null; ) {
            if (s = D, s.flags & 2048) switch (s.tag) {
              case 0:
              case 11:
              case 15:
                Pr(9, s, s.return);
            }
            var p = s.sibling;
            if (p !== null) {
              p.return = s.return, D = p;
              break e;
            }
            D = s.return;
          }
        }
        var h = e.current;
        for (D = h; D !== null; ) {
          o = D;
          var m = o.child;
          if (o.subtreeFlags & 2064 && m !== null) m.return = o, D = m;
          else e: for (o = h; D !== null; ) {
            if (l = D, l.flags & 2048) try {
              switch (l.tag) {
                case 0:
                case 11:
                case 15:
                  Is(9, l);
              }
            } catch (S) {
              J(l, l.return, S);
            }
            if (l === o) {
              D = null;
              break e;
            }
            var w = l.sibling;
            if (w !== null) {
              w.return = l.return, D = w;
              break e;
            }
            D = l.return;
          }
        }
        if (F = i, Ht(), nt && typeof nt.onPostCommitFiberRoot == "function") try {
          nt.onPostCommitFiberRoot(As, e);
        } catch {
        }
        r = !0;
      }
      return r;
    } finally {
      O = n, Ue.transition = t;
    }
  }
  return !1;
}
function Ec(e, t, n) {
  t = Kn(n, t), t = Rh(e, t, 1), e = Nt(e, t, 1), t = Se(), e !== null && (ei(e, 1, t), Ae(e, t));
}
function J(e, t, n) {
  if (e.tag === 3) Ec(e, e, n);
  else for (; t !== null; ) {
    if (t.tag === 3) {
      Ec(t, e, n);
      break;
    } else if (t.tag === 1) {
      var r = t.stateNode;
      if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (It === null || !It.has(r))) {
        e = Kn(n, e), e = Vh(t, e, 1), t = Nt(t, e, 1), e = Se(), t !== null && (ei(t, 1, e), Ae(t, e));
        break;
      }
    }
    t = t.return;
  }
}
function Kg(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t), t = Se(), e.pingedLanes |= e.suspendedLanes & n, le === e && (ce & n) === n && (ie === 4 || ie === 3 && (ce & 130023424) === ce && 500 > te() - Va ? sn(e, 0) : Ra |= n), Ae(e, t);
}
function Jh(e, t) {
  t === 0 && (e.mode & 1 ? (t = mi, mi <<= 1, !(mi & 130023424) && (mi = 4194304)) : t = 1);
  var n = Se();
  e = gt(e, t), e !== null && (ei(e, t, n), Ae(e, n));
}
function Gg(e) {
  var t = e.memoizedState, n = 0;
  t !== null && (n = t.retryLane), Jh(e, n);
}
function Qg(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode, i = e.memoizedState;
      i !== null && (n = i.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(T(314));
  }
  r !== null && r.delete(t), Jh(e, n);
}
var qh;
qh = function(e, t, n) {
  if (e !== null) if (e.memoizedProps !== t.pendingProps || Ce.current) Te = !0;
  else {
    if (!(e.lanes & n) && !(t.flags & 128)) return Te = !1, Ng(e, t, n);
    Te = !!(e.flags & 131072);
  }
  else Te = !1, K && t.flags & 1048576 && nh(t, as, t.index);
  switch (t.lanes = 0, t.tag) {
    case 2:
      var r = t.type;
      $i(e, t), e = t.pendingProps;
      var i = Un(t, ve.current);
      On(t, n), i = Ta(null, t, r, e, i, n);
      var s = Ca();
      return t.flags |= 1, typeof i == "object" && i !== null && typeof i.render == "function" && i.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ee(r) ? (s = !0, os(t)) : s = !1, t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, wa(t), i.updater = Ns, t.stateNode = i, i._reactInternals = t, ml(t, r, e, n), t = vl(null, t, r, !0, s, n)) : (t.tag = 0, K && s && da(t), we(null, t, i, n), t = t.child), t;
    case 16:
      r = t.elementType;
      e: {
        switch ($i(e, t), e = t.pendingProps, i = r._init, r = i(r._payload), t.type = r, i = t.tag = Xg(r), e = Qe(r, e), i) {
          case 0:
            t = gl(null, t, r, e, n);
            break e;
          case 1:
            t = yc(null, t, r, e, n);
            break e;
          case 11:
            t = pc(null, t, r, e, n);
            break e;
          case 14:
            t = mc(null, t, r, Qe(r.type, e), n);
            break e;
        }
        throw Error(T(
          306,
          r,
          ""
        ));
      }
      return t;
    case 0:
      return r = t.type, i = t.pendingProps, i = t.elementType === r ? i : Qe(r, i), gl(e, t, r, i, n);
    case 1:
      return r = t.type, i = t.pendingProps, i = t.elementType === r ? i : Qe(r, i), yc(e, t, r, i, n);
    case 3:
      e: {
        if (Ih(t), e === null) throw Error(T(387));
        r = t.pendingProps, s = t.memoizedState, i = s.element, ah(e, t), fs(t, r, null, n);
        var o = t.memoizedState;
        if (r = o.element, s.isDehydrated) if (s = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = s, t.memoizedState = s, t.flags & 256) {
          i = Kn(Error(T(423)), t), t = gc(e, t, r, n, i);
          break e;
        } else if (r !== i) {
          i = Kn(Error(T(424)), t), t = gc(e, t, r, n, i);
          break e;
        } else for (Me = _t(t.stateNode.containerInfo.firstChild), Re = t, K = !0, Xe = null, n = oh(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
        else {
          if ($n(), r === i) {
            t = vt(e, t, n);
            break e;
          }
          we(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return uh(t), e === null && dl(t), r = t.type, i = t.pendingProps, s = e !== null ? e.memoizedProps : null, o = i.children, ll(r, i) ? o = null : s !== null && ll(r, s) && (t.flags |= 32), Nh(e, t), we(e, t, o, n), t.child;
    case 6:
      return e === null && dl(t), null;
    case 13:
      return jh(e, t, n);
    case 4:
      return Sa(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Wn(t, null, r, n) : we(e, t, r, n), t.child;
    case 11:
      return r = t.type, i = t.pendingProps, i = t.elementType === r ? i : Qe(r, i), pc(e, t, r, i, n);
    case 7:
      return we(e, t, t.pendingProps, n), t.child;
    case 8:
      return we(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return we(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (r = t.type._context, i = t.pendingProps, s = t.memoizedProps, o = i.value, U(us, r._currentValue), r._currentValue = o, s !== null) if (qe(s.value, o)) {
          if (s.children === i.children && !Ce.current) {
            t = vt(e, t, n);
            break e;
          }
        } else for (s = t.child, s !== null && (s.return = t); s !== null; ) {
          var l = s.dependencies;
          if (l !== null) {
            o = s.child;
            for (var a = l.firstContext; a !== null; ) {
              if (a.context === r) {
                if (s.tag === 1) {
                  a = dt(-1, n & -n), a.tag = 2;
                  var u = s.updateQueue;
                  if (u !== null) {
                    u = u.shared;
                    var c = u.pending;
                    c === null ? a.next = a : (a.next = c.next, c.next = a), u.pending = a;
                  }
                }
                s.lanes |= n, a = s.alternate, a !== null && (a.lanes |= n), hl(
                  s.return,
                  n,
                  t
                ), l.lanes |= n;
                break;
              }
              a = a.next;
            }
          } else if (s.tag === 10) o = s.type === t.type ? null : s.child;
          else if (s.tag === 18) {
            if (o = s.return, o === null) throw Error(T(341));
            o.lanes |= n, l = o.alternate, l !== null && (l.lanes |= n), hl(o, n, t), o = s.sibling;
          } else o = s.child;
          if (o !== null) o.return = s;
          else for (o = s; o !== null; ) {
            if (o === t) {
              o = null;
              break;
            }
            if (s = o.sibling, s !== null) {
              s.return = o.return, o = s;
              break;
            }
            o = o.return;
          }
          s = o;
        }
        we(e, t, i.children, n), t = t.child;
      }
      return t;
    case 9:
      return i = t.type, r = t.pendingProps.children, On(t, n), i = $e(i), r = r(i), t.flags |= 1, we(e, t, r, n), t.child;
    case 14:
      return r = t.type, i = Qe(r, t.pendingProps), i = Qe(r.type, i), mc(e, t, r, i, n);
    case 15:
      return Lh(e, t, t.type, t.pendingProps, n);
    case 17:
      return r = t.type, i = t.pendingProps, i = t.elementType === r ? i : Qe(r, i), $i(e, t), t.tag = 1, Ee(r) ? (e = !0, os(t)) : e = !1, On(t, n), Mh(t, r, i), ml(t, r, i, n), vl(null, t, r, !0, e, n);
    case 19:
      return Fh(e, t, n);
    case 22:
      return _h(e, t, n);
  }
  throw Error(T(156, t.tag));
};
function bh(e, t) {
  return Ed(e, t);
}
function Yg(e, t, n, r) {
  this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function Be(e, t, n, r) {
  return new Yg(e, t, n, r);
}
function Ia(e) {
  return e = e.prototype, !(!e || !e.isReactComponent);
}
function Xg(e) {
  if (typeof e == "function") return Ia(e) ? 1 : 0;
  if (e != null) {
    if (e = e.$$typeof, e === ea) return 11;
    if (e === ta) return 14;
  }
  return 2;
}
function Ft(e, t) {
  var n = e.alternate;
  return n === null ? (n = Be(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
}
function Ki(e, t, n, r, i, s) {
  var o = 2;
  if (r = e, typeof e == "function") Ia(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else e: switch (e) {
    case vn:
      return on(n.children, i, s, t);
    case bl:
      o = 8, i |= 8;
      break;
    case zo:
      return e = Be(12, n, t, i | 2), e.elementType = zo, e.lanes = s, e;
    case Bo:
      return e = Be(13, n, t, i), e.elementType = Bo, e.lanes = s, e;
    case Uo:
      return e = Be(19, n, t, i), e.elementType = Uo, e.lanes = s, e;
    case ud:
      return Fs(n, i, s, t);
    default:
      if (typeof e == "object" && e !== null) switch (e.$$typeof) {
        case ld:
          o = 10;
          break e;
        case ad:
          o = 9;
          break e;
        case ea:
          o = 11;
          break e;
        case ta:
          o = 14;
          break e;
        case Tt:
          o = 16, r = null;
          break e;
      }
      throw Error(T(130, e == null ? e : typeof e, ""));
  }
  return t = Be(o, n, t, i), t.elementType = e, t.type = r, t.lanes = s, t;
}
function on(e, t, n, r) {
  return e = Be(7, e, r, t), e.lanes = n, e;
}
function Fs(e, t, n, r) {
  return e = Be(22, e, r, t), e.elementType = ud, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
}
function xo(e, t, n) {
  return e = Be(6, e, null, t), e.lanes = n, e;
}
function ko(e, t, n) {
  return t = Be(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
}
function Zg(e, t, n, r, i) {
  this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = to(0), this.expirationTimes = to(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = to(0), this.identifierPrefix = r, this.onRecoverableError = i, this.mutableSourceEagerHydrationData = null;
}
function ja(e, t, n, r, i, s, o, l, a) {
  return e = new Zg(e, t, n, l, a), t === 1 ? (t = 1, s === !0 && (t |= 8)) : t = 0, s = Be(3, null, null, t), e.current = s, s.stateNode = e, s.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, wa(s), e;
}
function Jg(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: gn, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
}
function ep(e) {
  if (!e) return zt;
  e = e._reactInternals;
  e: {
    if (pn(e) !== e || e.tag !== 1) throw Error(T(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (Ee(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(T(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (Ee(n)) return eh(e, n, t);
  }
  return t;
}
function tp(e, t, n, r, i, s, o, l, a) {
  return e = ja(n, r, !0, e, i, s, o, l, a), e.context = ep(null), n = e.current, r = Se(), i = jt(n), s = dt(r, i), s.callback = t ?? null, Nt(n, s, i), e.current.lanes = i, ei(e, i, r), Ae(e, r), e;
}
function Os(e, t, n, r) {
  var i = t.current, s = Se(), o = jt(i);
  return n = ep(n), t.context === null ? t.context = n : t.pendingContext = n, t = dt(s, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Nt(i, t, o), e !== null && (Je(e, i, o, s), zi(e, i, o)), o;
}
function ws(e) {
  if (e = e.current, !e.child) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Ac(e, t) {
  if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function Fa(e, t) {
  Ac(e, t), (e = e.alternate) && Ac(e, t);
}
function qg() {
  return null;
}
var np = typeof reportError == "function" ? reportError : function(e) {
  console.error(e);
};
function Oa(e) {
  this._internalRoot = e;
}
zs.prototype.render = Oa.prototype.render = function(e) {
  var t = this._internalRoot;
  if (t === null) throw Error(T(409));
  Os(e, t, null, null);
};
zs.prototype.unmount = Oa.prototype.unmount = function() {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    dn(function() {
      Os(null, e, null, null);
    }), t[yt] = null;
  }
};
function zs(e) {
  this._internalRoot = e;
}
zs.prototype.unstable_scheduleHydration = function(e) {
  if (e) {
    var t = _d();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < Et.length && t !== 0 && t < Et[n].priority; n++) ;
    Et.splice(n, 0, e), n === 0 && Id(e);
  }
};
function za(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
}
function Bs(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
}
function Dc() {
}
function bg(e, t, n, r, i) {
  if (i) {
    if (typeof r == "function") {
      var s = r;
      r = function() {
        var u = ws(o);
        s.call(u);
      };
    }
    var o = tp(t, r, e, 0, null, !1, !1, "", Dc);
    return e._reactRootContainer = o, e[yt] = o.current, Or(e.nodeType === 8 ? e.parentNode : e), dn(), o;
  }
  for (; i = e.lastChild; ) e.removeChild(i);
  if (typeof r == "function") {
    var l = r;
    r = function() {
      var u = ws(a);
      l.call(u);
    };
  }
  var a = ja(e, 0, !1, null, null, !1, !1, "", Dc);
  return e._reactRootContainer = a, e[yt] = a.current, Or(e.nodeType === 8 ? e.parentNode : e), dn(function() {
    Os(t, a, n, r);
  }), a;
}
function Us(e, t, n, r, i) {
  var s = n._reactRootContainer;
  if (s) {
    var o = s;
    if (typeof i == "function") {
      var l = i;
      i = function() {
        var a = ws(o);
        l.call(a);
      };
    }
    Os(t, o, e, i);
  } else o = bg(n, t, e, i, r);
  return ws(o);
}
Vd = function(e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = dr(t.pendingLanes);
        n !== 0 && (ia(t, n | 1), Ae(t, te()), !(F & 6) && (Gn = te() + 500, Ht()));
      }
      break;
    case 13:
      dn(function() {
        var r = gt(e, 1);
        if (r !== null) {
          var i = Se();
          Je(r, e, 1, i);
        }
      }), Fa(e, 1);
  }
};
sa = function(e) {
  if (e.tag === 13) {
    var t = gt(e, 134217728);
    if (t !== null) {
      var n = Se();
      Je(t, e, 134217728, n);
    }
    Fa(e, 134217728);
  }
};
Ld = function(e) {
  if (e.tag === 13) {
    var t = jt(e), n = gt(e, t);
    if (n !== null) {
      var r = Se();
      Je(n, e, t, r);
    }
    Fa(e, t);
  }
};
_d = function() {
  return O;
};
Nd = function(e, t) {
  var n = O;
  try {
    return O = e, t();
  } finally {
    O = n;
  }
};
Jo = function(e, t, n) {
  switch (t) {
    case "input":
      if (Ho(e, n), t = n.name, n.type === "radio" && t != null) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var i = Vs(r);
            if (!i) throw Error(T(90));
            fd(r), Ho(r, i);
          }
        }
      }
      break;
    case "textarea":
      hd(e, n);
      break;
    case "select":
      t = n.value, t != null && Nn(e, !!n.multiple, t, !1);
  }
};
Sd = La;
xd = dn;
var ev = { usingClientEntryPoint: !1, Events: [ni, kn, Vs, vd, wd, La] }, ar = { findFiberByHostInstance: en, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, tv = { bundleType: ar.bundleType, version: ar.version, rendererPackageName: ar.rendererPackageName, rendererConfig: ar.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: St.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
  return e = Td(e), e === null ? null : e.stateNode;
}, findFiberByHostInstance: ar.findFiberByHostInstance || qg, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var Ei = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Ei.isDisabled && Ei.supportsFiber) try {
    As = Ei.inject(tv), nt = Ei;
  } catch {
  }
}
Ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ev;
Ne.createPortal = function(e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!za(t)) throw Error(T(200));
  return Jg(e, t, null, n);
};
Ne.createRoot = function(e, t) {
  if (!za(e)) throw Error(T(299));
  var n = !1, r = "", i = np;
  return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (i = t.onRecoverableError)), t = ja(e, 1, !1, null, null, n, !1, r, i), e[yt] = t.current, Or(e.nodeType === 8 ? e.parentNode : e), new Oa(t);
};
Ne.findDOMNode = function(e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function" ? Error(T(188)) : (e = Object.keys(e).join(","), Error(T(268, e)));
  return e = Td(t), e = e === null ? null : e.stateNode, e;
};
Ne.flushSync = function(e) {
  return dn(e);
};
Ne.hydrate = function(e, t, n) {
  if (!Bs(t)) throw Error(T(200));
  return Us(null, e, t, !0, n);
};
Ne.hydrateRoot = function(e, t, n) {
  if (!za(e)) throw Error(T(405));
  var r = n != null && n.hydratedSources || null, i = !1, s = "", o = np;
  if (n != null && (n.unstable_strictMode === !0 && (i = !0), n.identifierPrefix !== void 0 && (s = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = tp(t, null, e, 1, n ?? null, i, !1, s, o), e[yt] = t.current, Or(e), r) for (e = 0; e < r.length; e++) n = r[e], i = n._getVersion, i = i(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, i] : t.mutableSourceEagerHydrationData.push(
    n,
    i
  );
  return new zs(t);
};
Ne.render = function(e, t, n) {
  if (!Bs(t)) throw Error(T(200));
  return Us(null, e, t, !1, n);
};
Ne.unmountComponentAtNode = function(e) {
  if (!Bs(e)) throw Error(T(40));
  return e._reactRootContainer ? (dn(function() {
    Us(null, null, e, !1, function() {
      e._reactRootContainer = null, e[yt] = null;
    });
  }), !0) : !1;
};
Ne.unstable_batchedUpdates = La;
Ne.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
  if (!Bs(n)) throw Error(T(200));
  if (e == null || e._reactInternals === void 0) throw Error(T(38));
  return Us(e, t, n, !1, r);
};
Ne.version = "18.3.1-next-f1338f8080-20240426";
function rp() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(rp);
    } catch (e) {
      console.error(e);
    }
}
rp(), rd.exports = Ne;
var nv = rd.exports, Mc = nv;
Fo.createRoot = Mc.createRoot, Fo.hydrateRoot = Mc.hydrateRoot;
var rv = Object.defineProperty, iv = (e, t, n) => t in e ? rv(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Ai = (e, t, n) => iv(e, typeof t != "symbol" ? t + "" : t, n);
const sv = {
  stringify: (e) => e ? "true" : "false",
  parse: (e) => /^[ty1-9]/i.test(e)
}, ov = {
  stringify: (e) => e.name,
  parse: (e, t, n) => {
    const r = (() => {
      if (typeof window < "u" && e in window)
        return window[e];
      if (typeof global < "u" && e in global)
        return global[e];
    })();
    return typeof r == "function" ? r.bind(n) : void 0;
  }
}, lv = {
  stringify: (e) => JSON.stringify(e),
  parse: (e) => JSON.parse(e)
}, av = {
  stringify: (e) => `${e}`,
  parse: (e) => parseFloat(e)
}, uv = {
  stringify: (e) => e,
  parse: (e) => e
}, Po = {
  string: uv,
  number: av,
  boolean: sv,
  function: ov,
  json: lv
};
function cv(e) {
  return e.replace(
    /([a-z0-9])([A-Z])/g,
    (t, n, r) => `${n}-${r.toLowerCase()}`
  );
}
const Di = Symbol.for("r2wc.render"), Mi = Symbol.for("r2wc.connected"), Yt = Symbol.for("r2wc.context"), ot = Symbol.for("r2wc.props");
function fv(e, t, n) {
  var r, i, s;
  t.props || (t.props = e.propTypes ? Object.keys(e.propTypes) : []), t.events || (t.events = []);
  const o = Array.isArray(t.props) ? t.props.slice() : Object.keys(t.props), l = Array.isArray(t.events) ? t.events.slice() : Object.keys(t.events), a = {}, u = {}, c = {}, f = {};
  for (const y of o) {
    a[y] = Array.isArray(t.props) ? "string" : t.props[y];
    const g = cv(y);
    c[y] = g, f[g] = y;
  }
  for (const y of l)
    u[y] = Array.isArray(t.events) ? {} : t.events[y];
  class d extends HTMLElement {
    constructor() {
      super(), Ai(this, s, !0), Ai(this, i), Ai(this, r, {}), Ai(this, "container"), t.shadow ? this.container = this.attachShadow({
        mode: t.shadow
      }) : this.container = this, this[ot].container = this.container;
      for (const g of o) {
        const v = c[g], x = this.getAttribute(v), p = a[g], h = p ? Po[p] : null;
        h != null && h.parse && x && (this[ot][g] = h.parse(x, v, this));
      }
      for (const g of l)
        this[ot][g] = (v) => {
          const x = g.replace(/^on/, "").toLowerCase();
          this.dispatchEvent(
            new CustomEvent(x, { detail: v, ...u[g] })
          );
        };
    }
    static get observedAttributes() {
      return Object.keys(f);
    }
    connectedCallback() {
      this[Mi] = !0, this[Di]();
    }
    disconnectedCallback() {
      this[Mi] = !1, this[Yt] && n.unmount(this[Yt]), delete this[Yt];
    }
    attributeChangedCallback(g, v, x) {
      const p = f[g], h = a[p], m = h ? Po[h] : null;
      p in a && m != null && m.parse && x && (this[ot][p] = m.parse(x, g, this), this[Di]());
    }
    [(s = Mi, i = Yt, r = ot, Di)]() {
      this[Mi] && (this[Yt] ? n.update(this[Yt], this[ot]) : this[Yt] = n.mount(
        this.container,
        e,
        this[ot]
      ));
    }
  }
  for (const y of o) {
    const g = c[y], v = a[y];
    Object.defineProperty(d.prototype, y, {
      enumerable: !0,
      configurable: !0,
      get() {
        return this[ot][y];
      },
      set(x) {
        this[ot][y] = x;
        const p = v ? Po[v] : null;
        if (p != null && p.stringify) {
          const h = p.stringify(x, g, this);
          this.getAttribute(g) !== h && this.setAttribute(g, h);
        } else
          this[Di]();
      }
    });
  }
  return d;
}
function dv(e, t, n, r = {}) {
  function i(l, a, u) {
    const c = t.createElement(a, u);
    if ("createRoot" in n) {
      const f = n.createRoot(l);
      return f.render(c), {
        container: l,
        root: f,
        ReactComponent: a
      };
    }
    if ("render" in n)
      return n.render(c, l), {
        container: l,
        ReactComponent: a
      };
    throw new Error("Invalid ReactDOM instance provided.");
  }
  function s({ container: l, root: a, ReactComponent: u }, c) {
    const f = t.createElement(u, c);
    if (a) {
      a.render(f);
      return;
    }
    if ("render" in n) {
      n.render(f, l);
      return;
    }
  }
  function o({ container: l, root: a }) {
    if (a) {
      a.unmount();
      return;
    }
    if ("unmountComponentAtNode" in n) {
      n.unmountComponentAtNode(l);
      return;
    }
  }
  return fv(e, r, { mount: i, unmount: o, update: s });
}
var ip = { exports: {} }, $s = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hv = C, pv = Symbol.for("react.element"), mv = Symbol.for("react.fragment"), yv = Object.prototype.hasOwnProperty, gv = hv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, vv = { key: !0, ref: !0, __self: !0, __source: !0 };
function sp(e, t, n) {
  var r, i = {}, s = null, o = null;
  n !== void 0 && (s = "" + n), t.key !== void 0 && (s = "" + t.key), t.ref !== void 0 && (o = t.ref);
  for (r in t) yv.call(t, r) && !vv.hasOwnProperty(r) && (i[r] = t[r]);
  if (e && e.defaultProps) for (r in t = e.defaultProps, t) i[r] === void 0 && (i[r] = t[r]);
  return { $$typeof: pv, type: e, key: s, ref: o, props: i, _owner: gv.current };
}
$s.Fragment = mv;
$s.jsx = sp;
$s.jsxs = sp;
ip.exports = $s;
var N = ip.exports;
const Qr = C.createContext({});
function Ba(e) {
  const t = C.useRef(null);
  return t.current === null && (t.current = e()), t.current;
}
const Ws = C.createContext(null), Ua = C.createContext({
  transformPagePoint: (e) => e,
  isStatic: !1,
  reducedMotion: "never"
});
class wv extends C.Component {
  getSnapshotBeforeUpdate(t) {
    const n = this.props.childRef.current;
    if (n && t.isPresent && !this.props.isPresent) {
      const r = this.props.sizeRef.current;
      r.height = n.offsetHeight || 0, r.width = n.offsetWidth || 0, r.top = n.offsetTop, r.left = n.offsetLeft;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function Sv({ children: e, isPresent: t }) {
  const n = C.useId(), r = C.useRef(null), i = C.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }), { nonce: s } = C.useContext(Ua);
  return C.useInsertionEffect(() => {
    const { width: o, height: l, top: a, left: u } = i.current;
    if (t || !r.current || !o || !l)
      return;
    r.current.dataset.motionPopId = n;
    const c = document.createElement("style");
    return s && (c.nonce = s), document.head.appendChild(c), c.sheet && c.sheet.insertRule(`
          [data-motion-pop-id="${n}"] {
            position: absolute !important;
            width: ${o}px !important;
            height: ${l}px !important;
            top: ${a}px !important;
            left: ${u}px !important;
          }
        `), () => {
      document.head.removeChild(c);
    };
  }, [t]), N.jsx(wv, { isPresent: t, childRef: r, sizeRef: i, children: C.cloneElement(e, { ref: r }) });
}
const xv = ({ children: e, initial: t, isPresent: n, onExitComplete: r, custom: i, presenceAffectsLayout: s, mode: o }) => {
  const l = Ba(kv), a = C.useId(), u = C.useCallback((f) => {
    l.set(f, !0);
    for (const d of l.values())
      if (!d)
        return;
    r && r();
  }, [l, r]), c = C.useMemo(
    () => ({
      id: a,
      initial: t,
      isPresent: n,
      custom: i,
      onExitComplete: u,
      register: (f) => (l.set(f, !1), () => l.delete(f))
    }),
    /**
     * If the presence of a child affects the layout of the components around it,
     * we want to make a new context value to ensure they get re-rendered
     * so they can detect that layout change.
     */
    s ? [Math.random(), u] : [n, u]
  );
  return C.useMemo(() => {
    l.forEach((f, d) => l.set(d, !1));
  }, [n]), C.useEffect(() => {
    !n && !l.size && r && r();
  }, [n]), o === "popLayout" && (e = N.jsx(Sv, { isPresent: n, children: e })), N.jsx(Ws.Provider, { value: c, children: e });
};
function kv() {
  return /* @__PURE__ */ new Map();
}
function op(e = !0) {
  const t = C.useContext(Ws);
  if (t === null)
    return [!0, null];
  const { isPresent: n, onExitComplete: r, register: i } = t, s = C.useId();
  C.useEffect(() => {
    e && i(s);
  }, [e]);
  const o = C.useCallback(() => e && r && r(s), [s, r, e]);
  return !n && r ? [!1, o] : [!0];
}
const Ri = (e) => e.key || "";
function Rc(e) {
  const t = [];
  return C.Children.forEach(e, (n) => {
    C.isValidElement(n) && t.push(n);
  }), t;
}
const $a = typeof window < "u", Wa = $a ? C.useLayoutEffect : C.useEffect, Vc = ({ children: e, custom: t, initial: n = !0, onExitComplete: r, presenceAffectsLayout: i = !0, mode: s = "sync", propagate: o = !1 }) => {
  const [l, a] = op(o), u = C.useMemo(() => Rc(e), [e]), c = o && !l ? [] : u.map(Ri), f = C.useRef(!0), d = C.useRef(u), y = Ba(() => /* @__PURE__ */ new Map()), [g, v] = C.useState(u), [x, p] = C.useState(u);
  Wa(() => {
    f.current = !1, d.current = u;
    for (let w = 0; w < x.length; w++) {
      const S = Ri(x[w]);
      c.includes(S) ? y.delete(S) : y.get(S) !== !0 && y.set(S, !1);
    }
  }, [x, c.length, c.join("-")]);
  const h = [];
  if (u !== g) {
    let w = [...u];
    for (let S = 0; S < x.length; S++) {
      const P = x[S], E = Ri(P);
      c.includes(E) || (w.splice(S, 0, P), h.push(P));
    }
    s === "wait" && h.length && (w = h), p(Rc(w)), v(u);
    return;
  }
  const { forceRender: m } = C.useContext(Qr);
  return N.jsx(N.Fragment, { children: x.map((w) => {
    const S = Ri(w), P = o && !l ? !1 : u === x || c.includes(S), E = () => {
      if (y.has(S))
        y.set(S, !0);
      else
        return;
      let k = !0;
      y.forEach((_) => {
        _ || (k = !1);
      }), k && (m == null || m(), p(d.current), o && (a == null || a()), r && r());
    };
    return N.jsx(xv, { isPresent: P, initial: !f.current || n ? void 0 : !1, custom: P ? void 0 : t, presenceAffectsLayout: i, mode: s, onExitComplete: P ? void 0 : E, children: w }, S);
  }) });
}, Pv = C.createContext(null);
function Tv() {
  const e = C.useRef(!1);
  return Wa(() => (e.current = !0, () => {
    e.current = !1;
  }), []), e;
}
const Ve = /* @__NO_SIDE_EFFECTS__ */ (e) => e;
let lp = Ve;
// @__NO_SIDE_EFFECTS__
function Ha(e) {
  let t;
  return () => (t === void 0 && (t = e()), t);
}
const Qn = /* @__NO_SIDE_EFFECTS__ */ (e, t, n) => {
  const r = t - e;
  return r === 0 ? 1 : (n - e) / r;
}, ht = /* @__NO_SIDE_EFFECTS__ */ (e) => e * 1e3, pt = /* @__NO_SIDE_EFFECTS__ */ (e) => e / 1e3, Cv = {
  useManualTiming: !1
};
function Ev(e) {
  let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = !1, i = !1;
  const s = /* @__PURE__ */ new WeakSet();
  let o = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function l(u) {
    s.has(u) && (a.schedule(u), e()), u(o);
  }
  const a = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (u, c = !1, f = !1) => {
      const y = f && r ? t : n;
      return c && s.add(u), y.has(u) || y.add(u), u;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (u) => {
      n.delete(u), s.delete(u);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (u) => {
      if (o = u, r) {
        i = !0;
        return;
      }
      r = !0, [t, n] = [n, t], t.forEach(l), t.clear(), r = !1, i && (i = !1, a.process(u));
    }
  };
  return a;
}
const Vi = [
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
], Av = 40;
function ap(e, t) {
  let n = !1, r = !0;
  const i = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, s = () => n = !0, o = Vi.reduce((p, h) => (p[h] = Ev(s), p), {}), { read: l, resolveKeyframes: a, update: u, preRender: c, render: f, postRender: d } = o, y = () => {
    const p = performance.now();
    n = !1, i.delta = r ? 1e3 / 60 : Math.max(Math.min(p - i.timestamp, Av), 1), i.timestamp = p, i.isProcessing = !0, l.process(i), a.process(i), u.process(i), c.process(i), f.process(i), d.process(i), i.isProcessing = !1, n && t && (r = !1, e(y));
  }, g = () => {
    n = !0, r = !0, i.isProcessing || e(y);
  };
  return { schedule: Vi.reduce((p, h) => {
    const m = o[h];
    return p[h] = (w, S = !1, P = !1) => (n || g(), m.schedule(w, S, P)), p;
  }, {}), cancel: (p) => {
    for (let h = 0; h < Vi.length; h++)
      o[Vi[h]].cancel(p);
  }, state: i, steps: o };
}
const { schedule: $, cancel: Bt, state: ue, steps: To } = ap(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Ve, !0);
function Dv() {
  const e = Tv(), [t, n] = C.useState(0), r = C.useCallback(() => {
    e.current && n(t + 1);
  }, [t]);
  return [C.useCallback(() => $.postRender(r), [r]), t];
}
const Mv = (e) => !e.isLayoutDirty && e.willUpdate(!1);
function Lc() {
  const e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new WeakMap(), n = () => e.forEach(Mv);
  return {
    add: (r) => {
      e.add(r), t.set(r, r.addEventListener("willUpdate", n));
    },
    remove: (r) => {
      e.delete(r);
      const i = t.get(r);
      i && (i(), t.delete(r)), n();
    },
    dirty: n
  };
}
const up = (e) => e === !0, Rv = (e) => up(e === !0) || e === "id", Vv = ({ children: e, id: t, inherit: n = !0 }) => {
  const r = C.useContext(Qr), i = C.useContext(Pv), [s, o] = Dv(), l = C.useRef(null), a = r.id || i;
  l.current === null && (Rv(n) && a && (t = t ? a + "-" + t : a), l.current = {
    id: t,
    group: up(n) && r.group || Lc()
  });
  const u = C.useMemo(() => ({ ...l.current, forceRender: s }), [o]);
  return N.jsx(Qr.Provider, { value: u, children: e });
}, cp = C.createContext({ strict: !1 }), _c = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
}, Yn = {};
for (const e in _c)
  Yn[e] = {
    isEnabled: (t) => _c[e].some((n) => !!t[n])
  };
function Lv(e) {
  for (const t in e)
    Yn[t] = {
      ...Yn[t],
      ...e[t]
    };
}
const _v = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function Ss(e) {
  return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || _v.has(e);
}
let fp = (e) => !Ss(e);
function Nv(e) {
  e && (fp = (t) => t.startsWith("on") ? !Ss(t) : e(t));
}
try {
  Nv(require("@emotion/is-prop-valid").default);
} catch {
}
function Iv(e, t, n) {
  const r = {};
  for (const i in e)
    i === "values" && typeof e.values == "object" || (fp(i) || n === !0 && Ss(i) || !t && !Ss(i) || // If trying to use native HTML drag events, forward drag listeners
    e.draggable && i.startsWith("onDrag")) && (r[i] = e[i]);
  return r;
}
function jv(e) {
  if (typeof Proxy > "u")
    return e;
  const t = /* @__PURE__ */ new Map(), n = (...r) => e(...r);
  return new Proxy(n, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (r, i) => i === "create" ? e : (t.has(i) || t.set(i, e(i)), t.get(i))
  });
}
const Hs = C.createContext({});
function Yr(e) {
  return typeof e == "string" || Array.isArray(e);
}
function Ks(e) {
  return e !== null && typeof e == "object" && typeof e.start == "function";
}
const Ka = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], Ga = ["initial", ...Ka];
function Gs(e) {
  return Ks(e.animate) || Ga.some((t) => Yr(e[t]));
}
function dp(e) {
  return !!(Gs(e) || e.variants);
}
function Fv(e, t) {
  if (Gs(e)) {
    const { initial: n, animate: r } = e;
    return {
      initial: n === !1 || Yr(n) ? n : void 0,
      animate: Yr(r) ? r : void 0
    };
  }
  return e.inherit !== !1 ? t : {};
}
function Ov(e) {
  const { initial: t, animate: n } = Fv(e, C.useContext(Hs));
  return C.useMemo(() => ({ initial: t, animate: n }), [Nc(t), Nc(n)]);
}
function Nc(e) {
  return Array.isArray(e) ? e.join(" ") : e;
}
const zv = Symbol.for("motionComponentSymbol");
function Mn(e) {
  return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
function Bv(e, t, n) {
  return C.useCallback(
    (r) => {
      r && e.onMount && e.onMount(r), t && (r ? t.mount(r) : t.unmount()), n && (typeof n == "function" ? n(r) : Mn(n) && (n.current = r));
    },
    /**
     * Only pass a new ref callback to React if we've received a visual element
     * factory. Otherwise we'll be mounting/remounting every time externalRef
     * or other dependencies change.
     */
    [t]
  );
}
const Qa = (e) => e.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), Uv = "framerAppearId", hp = "data-" + Qa(Uv), { schedule: Ya } = ap(queueMicrotask, !1), pp = C.createContext({});
function $v(e, t, n, r, i) {
  var s, o;
  const { visualElement: l } = C.useContext(Hs), a = C.useContext(cp), u = C.useContext(Ws), c = C.useContext(Ua).reducedMotion, f = C.useRef(null);
  r = r || a.renderer, !f.current && r && (f.current = r(e, {
    visualState: t,
    parent: l,
    props: n,
    presenceContext: u,
    blockInitialAnimation: u ? u.initial === !1 : !1,
    reducedMotionConfig: c
  }));
  const d = f.current, y = C.useContext(pp);
  d && !d.projection && i && (d.type === "html" || d.type === "svg") && Wv(f.current, n, i, y);
  const g = C.useRef(!1);
  C.useInsertionEffect(() => {
    d && g.current && d.update(n, u);
  });
  const v = n[hp], x = C.useRef(!!v && !(!((s = window.MotionHandoffIsComplete) === null || s === void 0) && s.call(window, v)) && ((o = window.MotionHasOptimisedAnimation) === null || o === void 0 ? void 0 : o.call(window, v)));
  return Wa(() => {
    d && (g.current = !0, window.MotionIsMounted = !0, d.updateFeatures(), Ya.render(d.render), x.current && d.animationState && d.animationState.animateChanges());
  }), C.useEffect(() => {
    d && (!x.current && d.animationState && d.animationState.animateChanges(), x.current && (queueMicrotask(() => {
      var p;
      (p = window.MotionHandoffMarkAsComplete) === null || p === void 0 || p.call(window, v);
    }), x.current = !1));
  }), d;
}
function Wv(e, t, n, r) {
  const { layoutId: i, layout: s, drag: o, dragConstraints: l, layoutScroll: a, layoutRoot: u } = t;
  e.projection = new n(e.latestValues, t["data-framer-portal-id"] ? void 0 : mp(e.parent)), e.projection.setOptions({
    layoutId: i,
    layout: s,
    alwaysMeasureLayout: !!o || l && Mn(l),
    visualElement: e,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof s == "string" ? s : "both",
    initialPromotionConfig: r,
    layoutScroll: a,
    layoutRoot: u
  });
}
function mp(e) {
  if (e)
    return e.options.allowProjection !== !1 ? e.projection : mp(e.parent);
}
function Hv({ preloadedFeatures: e, createVisualElement: t, useRender: n, useVisualState: r, Component: i }) {
  var s, o;
  e && Lv(e);
  function l(u, c) {
    let f;
    const d = {
      ...C.useContext(Ua),
      ...u,
      layoutId: Kv(u)
    }, { isStatic: y } = d, g = Ov(u), v = r(u, y);
    if (!y && $a) {
      Gv();
      const x = Qv(d);
      f = x.MeasureLayout, g.visualElement = $v(i, v, d, t, x.ProjectionNode);
    }
    return N.jsxs(Hs.Provider, { value: g, children: [f && g.visualElement ? N.jsx(f, { visualElement: g.visualElement, ...d }) : null, n(i, u, Bv(v, g.visualElement, c), v, y, g.visualElement)] });
  }
  l.displayName = `motion.${typeof i == "string" ? i : `create(${(o = (s = i.displayName) !== null && s !== void 0 ? s : i.name) !== null && o !== void 0 ? o : ""})`}`;
  const a = C.forwardRef(l);
  return a[zv] = i, a;
}
function Kv({ layoutId: e }) {
  const t = C.useContext(Qr).id;
  return t && e !== void 0 ? t + "-" + e : e;
}
function Gv(e, t) {
  C.useContext(cp).strict;
}
function Qv(e) {
  const { drag: t, layout: n } = Yn;
  if (!t && !n)
    return {};
  const r = { ...t, ...n };
  return {
    MeasureLayout: t != null && t.isEnabled(e) || n != null && n.isEnabled(e) ? r.MeasureLayout : void 0,
    ProjectionNode: r.ProjectionNode
  };
}
const Yv = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function Xa(e) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof e != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    e.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(Yv.indexOf(e) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(e))
    )
  );
}
function Ic(e) {
  const t = [{}, {}];
  return e == null || e.values.forEach((n, r) => {
    t[0][r] = n.get(), t[1][r] = n.getVelocity();
  }), t;
}
function Za(e, t, n, r) {
  if (typeof t == "function") {
    const [i, s] = Ic(r);
    t = t(n !== void 0 ? n : e.custom, i, s);
  }
  if (typeof t == "string" && (t = e.variants && e.variants[t]), typeof t == "function") {
    const [i, s] = Ic(r);
    t = t(n !== void 0 ? n : e.custom, i, s);
  }
  return t;
}
const Rl = (e) => Array.isArray(e), Xv = (e) => !!(e && typeof e == "object" && e.mix && e.toValue), Zv = (e) => Rl(e) ? e[e.length - 1] || 0 : e, ge = (e) => !!(e && e.getVelocity);
function Gi(e) {
  const t = ge(e) ? e.get() : e;
  return Xv(t) ? t.toValue() : t;
}
function Jv({ scrapeMotionValuesFromProps: e, createRenderState: t, onUpdate: n }, r, i, s) {
  const o = {
    latestValues: qv(r, i, s, e),
    renderState: t()
  };
  return n && (o.onMount = (l) => n({ props: r, current: l, ...o }), o.onUpdate = (l) => n(l)), o;
}
const yp = (e) => (t, n) => {
  const r = C.useContext(Hs), i = C.useContext(Ws), s = () => Jv(e, t, r, i);
  return n ? s() : Ba(s);
};
function qv(e, t, n, r) {
  const i = {}, s = r(e, {});
  for (const d in s)
    i[d] = Gi(s[d]);
  let { initial: o, animate: l } = e;
  const a = Gs(e), u = dp(e);
  t && u && !a && e.inherit !== !1 && (o === void 0 && (o = t.initial), l === void 0 && (l = t.animate));
  let c = n ? n.initial === !1 : !1;
  c = c || o === !1;
  const f = c ? l : o;
  if (f && typeof f != "boolean" && !Ks(f)) {
    const d = Array.isArray(f) ? f : [f];
    for (let y = 0; y < d.length; y++) {
      const g = Za(e, d[y]);
      if (g) {
        const { transitionEnd: v, transition: x, ...p } = g;
        for (const h in p) {
          let m = p[h];
          if (Array.isArray(m)) {
            const w = c ? m.length - 1 : 0;
            m = m[w];
          }
          m !== null && (i[h] = m);
        }
        for (const h in v)
          i[h] = v[h];
      }
    }
  }
  return i;
}
const bn = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], mn = new Set(bn), gp = (e) => (t) => typeof t == "string" && t.startsWith(e), vp = /* @__PURE__ */ gp("--"), bv = /* @__PURE__ */ gp("var(--"), Ja = (e) => bv(e) ? e0.test(e.split("/*")[0].trim()) : !1, e0 = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, wp = (e, t) => t && typeof e == "number" ? t.transform(e) : e, wt = (e, t, n) => n > t ? t : n < e ? e : n, er = {
  test: (e) => typeof e == "number",
  parse: parseFloat,
  transform: (e) => e
}, Xr = {
  ...er,
  transform: (e) => wt(0, 1, e)
}, Li = {
  ...er,
  default: 1
}, ii = (e) => ({
  test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
  parse: parseFloat,
  transform: (t) => `${t}${e}`
}), Pt = /* @__PURE__ */ ii("deg"), it = /* @__PURE__ */ ii("%"), R = /* @__PURE__ */ ii("px"), t0 = /* @__PURE__ */ ii("vh"), n0 = /* @__PURE__ */ ii("vw"), jc = {
  ...it,
  parse: (e) => it.parse(e) / 100,
  transform: (e) => it.transform(e * 100)
}, r0 = {
  // Border props
  borderWidth: R,
  borderTopWidth: R,
  borderRightWidth: R,
  borderBottomWidth: R,
  borderLeftWidth: R,
  borderRadius: R,
  radius: R,
  borderTopLeftRadius: R,
  borderTopRightRadius: R,
  borderBottomRightRadius: R,
  borderBottomLeftRadius: R,
  // Positioning props
  width: R,
  maxWidth: R,
  height: R,
  maxHeight: R,
  top: R,
  right: R,
  bottom: R,
  left: R,
  // Spacing props
  padding: R,
  paddingTop: R,
  paddingRight: R,
  paddingBottom: R,
  paddingLeft: R,
  margin: R,
  marginTop: R,
  marginRight: R,
  marginBottom: R,
  marginLeft: R,
  // Misc
  backgroundPositionX: R,
  backgroundPositionY: R
}, i0 = {
  rotate: Pt,
  rotateX: Pt,
  rotateY: Pt,
  rotateZ: Pt,
  scale: Li,
  scaleX: Li,
  scaleY: Li,
  scaleZ: Li,
  skew: Pt,
  skewX: Pt,
  skewY: Pt,
  distance: R,
  translateX: R,
  translateY: R,
  translateZ: R,
  x: R,
  y: R,
  z: R,
  perspective: R,
  transformPerspective: R,
  opacity: Xr,
  originX: jc,
  originY: jc,
  originZ: R
}, Fc = {
  ...er,
  transform: Math.round
}, qa = {
  ...r0,
  ...i0,
  zIndex: Fc,
  size: R,
  // SVG
  fillOpacity: Xr,
  strokeOpacity: Xr,
  numOctaves: Fc
}, s0 = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, o0 = bn.length;
function l0(e, t, n) {
  let r = "", i = !0;
  for (let s = 0; s < o0; s++) {
    const o = bn[s], l = e[o];
    if (l === void 0)
      continue;
    let a = !0;
    if (typeof l == "number" ? a = l === (o.startsWith("scale") ? 1 : 0) : a = parseFloat(l) === 0, !a || n) {
      const u = wp(l, qa[o]);
      if (!a) {
        i = !1;
        const c = s0[o] || o;
        r += `${c}(${u}) `;
      }
      n && (t[o] = u);
    }
  }
  return r = r.trim(), n ? r = n(t, i ? "" : r) : i && (r = "none"), r;
}
function ba(e, t, n) {
  const { style: r, vars: i, transformOrigin: s } = e;
  let o = !1, l = !1;
  for (const a in t) {
    const u = t[a];
    if (mn.has(a)) {
      o = !0;
      continue;
    } else if (vp(a)) {
      i[a] = u;
      continue;
    } else {
      const c = wp(u, qa[a]);
      a.startsWith("origin") ? (l = !0, s[a] = c) : r[a] = c;
    }
  }
  if (t.transform || (o || n ? r.transform = l0(t, e.transform, n) : r.transform && (r.transform = "none")), l) {
    const { originX: a = "50%", originY: u = "50%", originZ: c = 0 } = s;
    r.transformOrigin = `${a} ${u} ${c}`;
  }
}
const a0 = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, u0 = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function c0(e, t, n = 1, r = 0, i = !0) {
  e.pathLength = 1;
  const s = i ? a0 : u0;
  e[s.offset] = R.transform(-r);
  const o = R.transform(t), l = R.transform(n);
  e[s.array] = `${o} ${l}`;
}
function Oc(e, t, n) {
  return typeof e == "string" ? e : R.transform(t + n * e);
}
function f0(e, t, n) {
  const r = Oc(t, e.x, e.width), i = Oc(n, e.y, e.height);
  return `${r} ${i}`;
}
function eu(e, {
  attrX: t,
  attrY: n,
  attrScale: r,
  originX: i,
  originY: s,
  pathLength: o,
  pathSpacing: l = 1,
  pathOffset: a = 0,
  // This is object creation, which we try to avoid per-frame.
  ...u
}, c, f) {
  if (ba(e, u, f), c) {
    e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
    return;
  }
  e.attrs = e.style, e.style = {};
  const { attrs: d, style: y, dimensions: g } = e;
  d.transform && (g && (y.transform = d.transform), delete d.transform), g && (i !== void 0 || s !== void 0 || y.transform) && (y.transformOrigin = f0(g, i !== void 0 ? i : 0.5, s !== void 0 ? s : 0.5)), t !== void 0 && (d.x = t), n !== void 0 && (d.y = n), r !== void 0 && (d.scale = r), o !== void 0 && c0(d, o, l, a, !1);
}
const tu = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
}), Sp = () => ({
  ...tu(),
  attrs: {}
}), nu = (e) => typeof e == "string" && e.toLowerCase() === "svg";
function xp(e, { style: t, vars: n }, r, i) {
  Object.assign(e.style, t, i && i.getProjectionStyles(r));
  for (const s in n)
    e.style.setProperty(s, n[s]);
}
const kp = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
function Pp(e, t, n, r) {
  xp(e, t, void 0, r);
  for (const i in t.attrs)
    e.setAttribute(kp.has(i) ? i : Qa(i), t.attrs[i]);
}
const xs = {};
function d0(e) {
  Object.assign(xs, e);
}
function Tp(e, { layout: t, layoutId: n }) {
  return mn.has(e) || e.startsWith("origin") || (t || n !== void 0) && (!!xs[e] || e === "opacity");
}
function ru(e, t, n) {
  var r;
  const { style: i } = e, s = {};
  for (const o in i)
    (ge(i[o]) || t.style && ge(t.style[o]) || Tp(o, e) || ((r = n == null ? void 0 : n.getValue(o)) === null || r === void 0 ? void 0 : r.liveStyle) !== void 0) && (s[o] = i[o]);
  return s;
}
function Cp(e, t, n) {
  const r = ru(e, t, n);
  for (const i in e)
    if (ge(e[i]) || ge(t[i])) {
      const s = bn.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
      r[s] = e[i];
    }
  return r;
}
function h0(e, t) {
  try {
    t.dimensions = typeof e.getBBox == "function" ? e.getBBox() : e.getBoundingClientRect();
  } catch {
    t.dimensions = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }
}
const zc = ["x", "y", "width", "height", "cx", "cy", "r"], p0 = {
  useVisualState: yp({
    scrapeMotionValuesFromProps: Cp,
    createRenderState: Sp,
    onUpdate: ({ props: e, prevProps: t, current: n, renderState: r, latestValues: i }) => {
      if (!n)
        return;
      let s = !!e.drag;
      if (!s) {
        for (const l in i)
          if (mn.has(l)) {
            s = !0;
            break;
          }
      }
      if (!s)
        return;
      let o = !t;
      if (t)
        for (let l = 0; l < zc.length; l++) {
          const a = zc[l];
          e[a] !== t[a] && (o = !0);
        }
      o && $.read(() => {
        h0(n, r), $.render(() => {
          eu(r, i, nu(n.tagName), e.transformTemplate), Pp(n, r);
        });
      });
    }
  })
}, m0 = {
  useVisualState: yp({
    scrapeMotionValuesFromProps: ru,
    createRenderState: tu
  })
};
function Ep(e, t, n) {
  for (const r in t)
    !ge(t[r]) && !Tp(r, n) && (e[r] = t[r]);
}
function y0({ transformTemplate: e }, t) {
  return C.useMemo(() => {
    const n = tu();
    return ba(n, t, e), Object.assign({}, n.vars, n.style);
  }, [t]);
}
function g0(e, t) {
  const n = e.style || {}, r = {};
  return Ep(r, n, e), Object.assign(r, y0(e, t)), r;
}
function v0(e, t) {
  const n = {}, r = g0(e, t);
  return e.drag && e.dragListener !== !1 && (n.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0), n.style = r, n;
}
function w0(e, t, n, r) {
  const i = C.useMemo(() => {
    const s = Sp();
    return eu(s, t, nu(r), e.transformTemplate), {
      ...s.attrs,
      style: { ...s.style }
    };
  }, [t]);
  if (e.style) {
    const s = {};
    Ep(s, e.style, e), i.style = { ...s, ...i.style };
  }
  return i;
}
function S0(e = !1) {
  return (n, r, i, { latestValues: s }, o) => {
    const a = (Xa(n) ? w0 : v0)(r, s, o, n), u = Iv(r, typeof n == "string", e), c = n !== C.Fragment ? { ...u, ...a, ref: i } : {}, { children: f } = r, d = C.useMemo(() => ge(f) ? f.get() : f, [f]);
    return C.createElement(n, {
      ...c,
      children: d
    });
  };
}
function x0(e, t) {
  return function(r, { forwardMotionProps: i } = { forwardMotionProps: !1 }) {
    const o = {
      ...Xa(r) ? p0 : m0,
      preloadedFeatures: e,
      useRender: S0(i),
      createVisualElement: t,
      Component: r
    };
    return Hv(o);
  };
}
function Ap(e, t) {
  if (!Array.isArray(t))
    return !1;
  const n = t.length;
  if (n !== e.length)
    return !1;
  for (let r = 0; r < n; r++)
    if (t[r] !== e[r])
      return !1;
  return !0;
}
function Qs(e, t, n) {
  const r = e.getProps();
  return Za(r, t, n !== void 0 ? n : r.custom, e);
}
const k0 = /* @__PURE__ */ Ha(() => window.ScrollTimeline !== void 0);
class P0 {
  constructor(t) {
    this.stop = () => this.runAll("stop"), this.animations = t.filter(Boolean);
  }
  get finished() {
    return Promise.all(this.animations.map((t) => "finished" in t ? t.finished : t));
  }
  /**
   * TODO: Filter out cancelled or stopped animations before returning
   */
  getAll(t) {
    return this.animations[0][t];
  }
  setAll(t, n) {
    for (let r = 0; r < this.animations.length; r++)
      this.animations[r][t] = n;
  }
  attachTimeline(t, n) {
    const r = this.animations.map((i) => {
      if (k0() && i.attachTimeline)
        return i.attachTimeline(t);
      if (typeof n == "function")
        return n(i);
    });
    return () => {
      r.forEach((i, s) => {
        i && i(), this.animations[s].stop();
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(t) {
    this.setAll("time", t);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(t) {
    this.setAll("speed", t);
  }
  get startTime() {
    return this.getAll("startTime");
  }
  get duration() {
    let t = 0;
    for (let n = 0; n < this.animations.length; n++)
      t = Math.max(t, this.animations[n].duration);
    return t;
  }
  runAll(t) {
    this.animations.forEach((n) => n[t]());
  }
  flatten() {
    this.runAll("flatten");
  }
  play() {
    this.runAll("play");
  }
  pause() {
    this.runAll("pause");
  }
  cancel() {
    this.runAll("cancel");
  }
  complete() {
    this.runAll("complete");
  }
}
class T0 extends P0 {
  then(t, n) {
    return Promise.all(this.animations).then(t).catch(n);
  }
}
function iu(e, t) {
  return e ? e[t] || e.default || e : void 0;
}
const Vl = 2e4;
function Dp(e) {
  let t = 0;
  const n = 50;
  let r = e.next(t);
  for (; !r.done && t < Vl; )
    t += n, r = e.next(t);
  return t >= Vl ? 1 / 0 : t;
}
function su(e) {
  return typeof e == "function";
}
function Bc(e, t) {
  e.timeline = t, e.onfinish = null;
}
const ou = (e) => Array.isArray(e) && typeof e[0] == "number", C0 = {
  linearEasing: void 0
};
function E0(e, t) {
  const n = /* @__PURE__ */ Ha(e);
  return () => {
    var r;
    return (r = C0[t]) !== null && r !== void 0 ? r : n();
  };
}
const ks = /* @__PURE__ */ E0(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), Mp = (e, t, n = 10) => {
  let r = "";
  const i = Math.max(Math.round(t / n), 2);
  for (let s = 0; s < i; s++)
    r += e(/* @__PURE__ */ Qn(0, i - 1, s)) + ", ";
  return `linear(${r.substring(0, r.length - 2)})`;
};
function Rp(e) {
  return !!(typeof e == "function" && ks() || !e || typeof e == "string" && (e in Ll || ks()) || ou(e) || Array.isArray(e) && e.every(Rp));
}
const pr = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`, Ll = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ pr([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ pr([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ pr([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ pr([0.33, 1.53, 0.69, 0.99])
};
function Vp(e, t) {
  if (e)
    return typeof e == "function" && ks() ? Mp(e, t) : ou(e) ? pr(e) : Array.isArray(e) ? e.map((n) => Vp(n, t) || Ll.easeOut) : Ll[e];
}
const Ge = {
  x: !1,
  y: !1
};
function Lp() {
  return Ge.x || Ge.y;
}
function A0(e, t, n) {
  var r;
  if (e instanceof Element)
    return [e];
  if (typeof e == "string") {
    let i = document;
    const s = (r = void 0) !== null && r !== void 0 ? r : i.querySelectorAll(e);
    return s ? Array.from(s) : [];
  }
  return Array.from(e);
}
function _p(e, t) {
  const n = A0(e), r = new AbortController(), i = {
    passive: !0,
    ...t,
    signal: r.signal
  };
  return [n, i, () => r.abort()];
}
function Uc(e) {
  return (t) => {
    t.pointerType === "touch" || Lp() || e(t);
  };
}
function D0(e, t, n = {}) {
  const [r, i, s] = _p(e, n), o = Uc((l) => {
    const { target: a } = l, u = t(l);
    if (typeof u != "function" || !a)
      return;
    const c = Uc((f) => {
      u(f), a.removeEventListener("pointerleave", c);
    });
    a.addEventListener("pointerleave", c, i);
  });
  return r.forEach((l) => {
    l.addEventListener("pointerenter", o, i);
  }), s;
}
const Np = (e, t) => t ? e === t ? !0 : Np(e, t.parentElement) : !1, lu = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1, M0 = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function R0(e) {
  return M0.has(e.tagName) || e.tabIndex !== -1;
}
const mr = /* @__PURE__ */ new WeakSet();
function $c(e) {
  return (t) => {
    t.key === "Enter" && e(t);
  };
}
function Co(e, t) {
  e.dispatchEvent(new PointerEvent("pointer" + t, { isPrimary: !0, bubbles: !0 }));
}
const V0 = (e, t) => {
  const n = e.currentTarget;
  if (!n)
    return;
  const r = $c(() => {
    if (mr.has(n))
      return;
    Co(n, "down");
    const i = $c(() => {
      Co(n, "up");
    }), s = () => Co(n, "cancel");
    n.addEventListener("keyup", i, t), n.addEventListener("blur", s, t);
  });
  n.addEventListener("keydown", r, t), n.addEventListener("blur", () => n.removeEventListener("keydown", r), t);
};
function Wc(e) {
  return lu(e) && !Lp();
}
function L0(e, t, n = {}) {
  const [r, i, s] = _p(e, n), o = (l) => {
    const a = l.currentTarget;
    if (!Wc(l) || mr.has(a))
      return;
    mr.add(a);
    const u = t(l), c = (y, g) => {
      window.removeEventListener("pointerup", f), window.removeEventListener("pointercancel", d), !(!Wc(y) || !mr.has(a)) && (mr.delete(a), typeof u == "function" && u(y, { success: g }));
    }, f = (y) => {
      c(y, n.useGlobalTarget || Np(a, y.target));
    }, d = (y) => {
      c(y, !1);
    };
    window.addEventListener("pointerup", f, i), window.addEventListener("pointercancel", d, i);
  };
  return r.forEach((l) => {
    !R0(l) && l.getAttribute("tabindex") === null && (l.tabIndex = 0), (n.useGlobalTarget ? window : l).addEventListener("pointerdown", o, i), l.addEventListener("focus", (u) => V0(u, i), i);
  }), s;
}
function _0(e) {
  return e === "x" || e === "y" ? Ge[e] ? null : (Ge[e] = !0, () => {
    Ge[e] = !1;
  }) : Ge.x || Ge.y ? null : (Ge.x = Ge.y = !0, () => {
    Ge.x = Ge.y = !1;
  });
}
const Ip = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...bn
]);
let Qi;
function N0() {
  Qi = void 0;
}
const st = {
  now: () => (Qi === void 0 && st.set(ue.isProcessing || Cv.useManualTiming ? ue.timestamp : performance.now()), Qi),
  set: (e) => {
    Qi = e, queueMicrotask(N0);
  }
};
function au(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function uu(e, t) {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
class cu {
  constructor() {
    this.subscriptions = [];
  }
  add(t) {
    return au(this.subscriptions, t), () => uu(this.subscriptions, t);
  }
  notify(t, n, r) {
    const i = this.subscriptions.length;
    if (i)
      if (i === 1)
        this.subscriptions[0](t, n, r);
      else
        for (let s = 0; s < i; s++) {
          const o = this.subscriptions[s];
          o && o(t, n, r);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
function jp(e, t) {
  return t ? e * (1e3 / t) : 0;
}
const Hc = 30, I0 = (e) => !isNaN(parseFloat(e));
class j0 {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   *
   * @internal
   */
  constructor(t, n = {}) {
    this.version = "11.18.2", this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (r, i = !0) => {
      const s = st.now();
      this.updatedAt !== s && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(r), this.current !== this.prev && this.events.change && this.events.change.notify(this.current), i && this.events.renderRequest && this.events.renderRequest.notify(this.current);
    }, this.hasAnimated = !1, this.setCurrent(t), this.owner = n.owner;
  }
  setCurrent(t) {
    this.current = t, this.updatedAt = st.now(), this.canTrackVelocity === null && t !== void 0 && (this.canTrackVelocity = I0(this.current));
  }
  setPrevFrameValue(t = this.current) {
    this.prevFrameValue = t, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(t) {
    return this.on("change", t);
  }
  on(t, n) {
    this.events[t] || (this.events[t] = new cu());
    const r = this.events[t].add(n);
    return t === "change" ? () => {
      r(), $.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : r;
  }
  clearListeners() {
    for (const t in this.events)
      this.events[t].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   *
   * @internal
   */
  attach(t, n) {
    this.passiveEffect = t, this.stopPassiveEffect = n;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(t, n = !0) {
    !n || !this.passiveEffect ? this.updateAndNotify(t, n) : this.passiveEffect(t, this.updateAndNotify);
  }
  setWithVelocity(t, n, r) {
    this.set(n), this.prev = void 0, this.prevFrameValue = t, this.prevUpdatedAt = this.updatedAt - r;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(t, n = !0) {
    this.updateAndNotify(t), this.prev = t, this.prevUpdatedAt = this.prevFrameValue = void 0, n && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const t = st.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || t - this.updatedAt > Hc)
      return 0;
    const n = Math.min(this.updatedAt - this.prevUpdatedAt, Hc);
    return jp(parseFloat(this.current) - parseFloat(this.prevFrameValue), n);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   *
   * @internal
   */
  start(t) {
    return this.stop(), new Promise((n) => {
      this.hasAnimated = !0, this.animation = t(n), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function Zr(e, t) {
  return new j0(e, t);
}
function F0(e, t, n) {
  e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, Zr(n));
}
function O0(e, t) {
  const n = Qs(e, t);
  let { transitionEnd: r = {}, transition: i = {}, ...s } = n || {};
  s = { ...s, ...r };
  for (const o in s) {
    const l = Zv(s[o]);
    F0(e, o, l);
  }
}
function z0(e) {
  return !!(ge(e) && e.add);
}
function _l(e, t) {
  const n = e.getValue("willChange");
  if (z0(n))
    return n.add(t);
}
function Fp(e) {
  return e.props[hp];
}
const Op = (e, t, n) => (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e, B0 = 1e-7, U0 = 12;
function $0(e, t, n, r, i) {
  let s, o, l = 0;
  do
    o = t + (n - t) / 2, s = Op(o, r, i) - e, s > 0 ? n = o : t = o;
  while (Math.abs(s) > B0 && ++l < U0);
  return o;
}
function si(e, t, n, r) {
  if (e === t && n === r)
    return Ve;
  const i = (s) => $0(s, 0, 1, e, n);
  return (s) => s === 0 || s === 1 ? s : Op(i(s), t, r);
}
const zp = (e) => (t) => t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, Bp = (e) => (t) => 1 - e(1 - t), Up = /* @__PURE__ */ si(0.33, 1.53, 0.69, 0.99), fu = /* @__PURE__ */ Bp(Up), $p = /* @__PURE__ */ zp(fu), Wp = (e) => (e *= 2) < 1 ? 0.5 * fu(e) : 0.5 * (2 - Math.pow(2, -10 * (e - 1))), du = (e) => 1 - Math.sin(Math.acos(e)), Hp = Bp(du), Kp = zp(du), Gp = (e) => /^0[^.\s]+$/u.test(e);
function W0(e) {
  return typeof e == "number" ? e === 0 : e !== null ? e === "none" || e === "0" || Gp(e) : !0;
}
const Er = (e) => Math.round(e * 1e5) / 1e5, hu = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function H0(e) {
  return e == null;
}
const K0 = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, pu = (e, t) => (n) => !!(typeof n == "string" && K0.test(n) && n.startsWith(e) || t && !H0(n) && Object.prototype.hasOwnProperty.call(n, t)), Qp = (e, t, n) => (r) => {
  if (typeof r != "string")
    return r;
  const [i, s, o, l] = r.match(hu);
  return {
    [e]: parseFloat(i),
    [t]: parseFloat(s),
    [n]: parseFloat(o),
    alpha: l !== void 0 ? parseFloat(l) : 1
  };
}, G0 = (e) => wt(0, 255, e), Eo = {
  ...er,
  transform: (e) => Math.round(G0(e))
}, rn = {
  test: /* @__PURE__ */ pu("rgb", "red"),
  parse: /* @__PURE__ */ Qp("red", "green", "blue"),
  transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => "rgba(" + Eo.transform(e) + ", " + Eo.transform(t) + ", " + Eo.transform(n) + ", " + Er(Xr.transform(r)) + ")"
};
function Q0(e) {
  let t = "", n = "", r = "", i = "";
  return e.length > 5 ? (t = e.substring(1, 3), n = e.substring(3, 5), r = e.substring(5, 7), i = e.substring(7, 9)) : (t = e.substring(1, 2), n = e.substring(2, 3), r = e.substring(3, 4), i = e.substring(4, 5), t += t, n += n, r += r, i += i), {
    red: parseInt(t, 16),
    green: parseInt(n, 16),
    blue: parseInt(r, 16),
    alpha: i ? parseInt(i, 16) / 255 : 1
  };
}
const Nl = {
  test: /* @__PURE__ */ pu("#"),
  parse: Q0,
  transform: rn.transform
}, Rn = {
  test: /* @__PURE__ */ pu("hsl", "hue"),
  parse: /* @__PURE__ */ Qp("hue", "saturation", "lightness"),
  transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(e) + ", " + it.transform(Er(t)) + ", " + it.transform(Er(n)) + ", " + Er(Xr.transform(r)) + ")"
}, me = {
  test: (e) => rn.test(e) || Nl.test(e) || Rn.test(e),
  parse: (e) => rn.test(e) ? rn.parse(e) : Rn.test(e) ? Rn.parse(e) : Nl.parse(e),
  transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? rn.transform(e) : Rn.transform(e)
}, Y0 = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function X0(e) {
  var t, n;
  return isNaN(e) && typeof e == "string" && (((t = e.match(hu)) === null || t === void 0 ? void 0 : t.length) || 0) + (((n = e.match(Y0)) === null || n === void 0 ? void 0 : n.length) || 0) > 0;
}
const Yp = "number", Xp = "color", Z0 = "var", J0 = "var(", Kc = "${}", q0 = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Jr(e) {
  const t = e.toString(), n = [], r = {
    color: [],
    number: [],
    var: []
  }, i = [];
  let s = 0;
  const l = t.replace(q0, (a) => (me.test(a) ? (r.color.push(s), i.push(Xp), n.push(me.parse(a))) : a.startsWith(J0) ? (r.var.push(s), i.push(Z0), n.push(a)) : (r.number.push(s), i.push(Yp), n.push(parseFloat(a))), ++s, Kc)).split(Kc);
  return { values: n, split: l, indexes: r, types: i };
}
function Zp(e) {
  return Jr(e).values;
}
function Jp(e) {
  const { split: t, types: n } = Jr(e), r = t.length;
  return (i) => {
    let s = "";
    for (let o = 0; o < r; o++)
      if (s += t[o], i[o] !== void 0) {
        const l = n[o];
        l === Yp ? s += Er(i[o]) : l === Xp ? s += me.transform(i[o]) : s += i[o];
      }
    return s;
  };
}
const b0 = (e) => typeof e == "number" ? 0 : e;
function e1(e) {
  const t = Zp(e);
  return Jp(e)(t.map(b0));
}
const Ut = {
  test: X0,
  parse: Zp,
  createTransformer: Jp,
  getAnimatableNone: e1
}, t1 = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function n1(e) {
  const [t, n] = e.slice(0, -1).split("(");
  if (t === "drop-shadow")
    return e;
  const [r] = n.match(hu) || [];
  if (!r)
    return e;
  const i = n.replace(r, "");
  let s = t1.has(t) ? 1 : 0;
  return r !== n && (s *= 100), t + "(" + s + i + ")";
}
const r1 = /\b([a-z-]*)\(.*?\)/gu, Il = {
  ...Ut,
  getAnimatableNone: (e) => {
    const t = e.match(r1);
    return t ? t.map(n1).join(" ") : e;
  }
}, i1 = {
  ...qa,
  // Color props
  color: me,
  backgroundColor: me,
  outlineColor: me,
  fill: me,
  stroke: me,
  // Border props
  borderColor: me,
  borderTopColor: me,
  borderRightColor: me,
  borderBottomColor: me,
  borderLeftColor: me,
  filter: Il,
  WebkitFilter: Il
}, mu = (e) => i1[e];
function qp(e, t) {
  let n = mu(e);
  return n !== Il && (n = Ut), n.getAnimatableNone ? n.getAnimatableNone(t) : void 0;
}
const s1 = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function o1(e, t, n) {
  let r = 0, i;
  for (; r < e.length && !i; ) {
    const s = e[r];
    typeof s == "string" && !s1.has(s) && Jr(s).values.length && (i = e[r]), r++;
  }
  if (i && n)
    for (const s of t)
      e[s] = qp(n, i);
}
const Gc = (e) => e === er || e === R, Qc = (e, t) => parseFloat(e.split(", ")[t]), Yc = (e, t) => (n, { transform: r }) => {
  if (r === "none" || !r)
    return 0;
  const i = r.match(/^matrix3d\((.+)\)$/u);
  if (i)
    return Qc(i[1], t);
  {
    const s = r.match(/^matrix\((.+)\)$/u);
    return s ? Qc(s[1], e) : 0;
  }
}, l1 = /* @__PURE__ */ new Set(["x", "y", "z"]), a1 = bn.filter((e) => !l1.has(e));
function u1(e) {
  const t = [];
  return a1.forEach((n) => {
    const r = e.getValue(n);
    r !== void 0 && (t.push([n, r.get()]), r.set(n.startsWith("scale") ? 1 : 0));
  }), t;
}
const Xn = {
  // Dimensions
  width: ({ x: e }, { paddingLeft: t = "0", paddingRight: n = "0" }) => e.max - e.min - parseFloat(t) - parseFloat(n),
  height: ({ y: e }, { paddingTop: t = "0", paddingBottom: n = "0" }) => e.max - e.min - parseFloat(t) - parseFloat(n),
  top: (e, { top: t }) => parseFloat(t),
  left: (e, { left: t }) => parseFloat(t),
  bottom: ({ y: e }, { top: t }) => parseFloat(t) + (e.max - e.min),
  right: ({ x: e }, { left: t }) => parseFloat(t) + (e.max - e.min),
  // Transform
  x: Yc(4, 13),
  y: Yc(5, 14)
};
Xn.translateX = Xn.x;
Xn.translateY = Xn.y;
const ln = /* @__PURE__ */ new Set();
let jl = !1, Fl = !1;
function bp() {
  if (Fl) {
    const e = Array.from(ln).filter((r) => r.needsMeasurement), t = new Set(e.map((r) => r.element)), n = /* @__PURE__ */ new Map();
    t.forEach((r) => {
      const i = u1(r);
      i.length && (n.set(r, i), r.render());
    }), e.forEach((r) => r.measureInitialState()), t.forEach((r) => {
      r.render();
      const i = n.get(r);
      i && i.forEach(([s, o]) => {
        var l;
        (l = r.getValue(s)) === null || l === void 0 || l.set(o);
      });
    }), e.forEach((r) => r.measureEndState()), e.forEach((r) => {
      r.suspendedScrollY !== void 0 && window.scrollTo(0, r.suspendedScrollY);
    });
  }
  Fl = !1, jl = !1, ln.forEach((e) => e.complete()), ln.clear();
}
function em() {
  ln.forEach((e) => {
    e.readKeyframes(), e.needsMeasurement && (Fl = !0);
  });
}
function c1() {
  em(), bp();
}
class yu {
  constructor(t, n, r, i, s, o = !1) {
    this.isComplete = !1, this.isAsync = !1, this.needsMeasurement = !1, this.isScheduled = !1, this.unresolvedKeyframes = [...t], this.onComplete = n, this.name = r, this.motionValue = i, this.element = s, this.isAsync = o;
  }
  scheduleResolve() {
    this.isScheduled = !0, this.isAsync ? (ln.add(this), jl || (jl = !0, $.read(em), $.resolveKeyframes(bp))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, name: n, element: r, motionValue: i } = this;
    for (let s = 0; s < t.length; s++)
      if (t[s] === null)
        if (s === 0) {
          const o = i == null ? void 0 : i.get(), l = t[t.length - 1];
          if (o !== void 0)
            t[0] = o;
          else if (r && n) {
            const a = r.readValue(n, l);
            a != null && (t[0] = a);
          }
          t[0] === void 0 && (t[0] = l), i && o === void 0 && i.set(t[0]);
        } else
          t[s] = t[s - 1];
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete() {
    this.isComplete = !0, this.onComplete(this.unresolvedKeyframes, this.finalKeyframe), ln.delete(this);
  }
  cancel() {
    this.isComplete || (this.isScheduled = !1, ln.delete(this));
  }
  resume() {
    this.isComplete || this.scheduleResolve();
  }
}
const tm = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e), f1 = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function d1(e) {
  const t = f1.exec(e);
  if (!t)
    return [,];
  const [, n, r, i] = t;
  return [`--${n ?? r}`, i];
}
function nm(e, t, n = 1) {
  const [r, i] = d1(e);
  if (!r)
    return;
  const s = window.getComputedStyle(t).getPropertyValue(r);
  if (s) {
    const o = s.trim();
    return tm(o) ? parseFloat(o) : o;
  }
  return Ja(i) ? nm(i, t, n + 1) : i;
}
const rm = (e) => (t) => t.test(e), h1 = {
  test: (e) => e === "auto",
  parse: (e) => e
}, im = [er, R, it, Pt, n0, t0, h1], Xc = (e) => im.find(rm(e));
class sm extends yu {
  constructor(t, n, r, i, s) {
    super(t, n, r, i, s, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, element: n, name: r } = this;
    if (!n || !n.current)
      return;
    super.readKeyframes();
    for (let a = 0; a < t.length; a++) {
      let u = t[a];
      if (typeof u == "string" && (u = u.trim(), Ja(u))) {
        const c = nm(u, n.current);
        c !== void 0 && (t[a] = c), a === t.length - 1 && (this.finalKeyframe = u);
      }
    }
    if (this.resolveNoneKeyframes(), !Ip.has(r) || t.length !== 2)
      return;
    const [i, s] = t, o = Xc(i), l = Xc(s);
    if (o !== l)
      if (Gc(o) && Gc(l))
        for (let a = 0; a < t.length; a++) {
          const u = t[a];
          typeof u == "string" && (t[a] = parseFloat(u));
        }
      else
        this.needsMeasurement = !0;
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: n } = this, r = [];
    for (let i = 0; i < t.length; i++)
      W0(t[i]) && r.push(i);
    r.length && o1(t, r, n);
  }
  measureInitialState() {
    const { element: t, unresolvedKeyframes: n, name: r } = this;
    if (!t || !t.current)
      return;
    r === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = Xn[r](t.measureViewportBox(), window.getComputedStyle(t.current)), n[0] = this.measuredOrigin;
    const i = n[n.length - 1];
    i !== void 0 && t.getValue(r, i).jump(i, !1);
  }
  measureEndState() {
    var t;
    const { element: n, name: r, unresolvedKeyframes: i } = this;
    if (!n || !n.current)
      return;
    const s = n.getValue(r);
    s && s.jump(this.measuredOrigin, !1);
    const o = i.length - 1, l = i[o];
    i[o] = Xn[r](n.measureViewportBox(), window.getComputedStyle(n.current)), l !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = l), !((t = this.removedTransforms) === null || t === void 0) && t.length && this.removedTransforms.forEach(([a, u]) => {
      n.getValue(a).set(u);
    }), this.resolveNoneKeyframes();
  }
}
const Zc = (e, t) => t === "zIndex" ? !1 : !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && // It's animatable if we have a string
(Ut.test(e) || e === "0") && // And it contains numbers and/or colors
!e.startsWith("url("));
function p1(e) {
  const t = e[0];
  if (e.length === 1)
    return !0;
  for (let n = 0; n < e.length; n++)
    if (e[n] !== t)
      return !0;
}
function m1(e, t, n, r) {
  const i = e[0];
  if (i === null)
    return !1;
  if (t === "display" || t === "visibility")
    return !0;
  const s = e[e.length - 1], o = Zc(i, t), l = Zc(s, t);
  return !o || !l ? !1 : p1(e) || (n === "spring" || su(n)) && r;
}
const y1 = (e) => e !== null;
function Ys(e, { repeat: t, repeatType: n = "loop" }, r) {
  const i = e.filter(y1), s = t && n !== "loop" && t % 2 === 1 ? 0 : i.length - 1;
  return !s || r === void 0 ? i[s] : r;
}
const g1 = 40;
class om {
  constructor({ autoplay: t = !0, delay: n = 0, type: r = "keyframes", repeat: i = 0, repeatDelay: s = 0, repeatType: o = "loop", ...l }) {
    this.isStopped = !1, this.hasAttemptedResolve = !1, this.createdAt = st.now(), this.options = {
      autoplay: t,
      delay: n,
      type: r,
      repeat: i,
      repeatDelay: s,
      repeatType: o,
      ...l
    }, this.updateFinishedPromise();
  }
  /**
   * This method uses the createdAt and resolvedAt to calculate the
   * animation startTime. *Ideally*, we would use the createdAt time as t=0
   * as the following frame would then be the first frame of the animation in
   * progress, which would feel snappier.
   *
   * However, if there's a delay (main thread work) between the creation of
   * the animation and the first commited frame, we prefer to use resolvedAt
   * to avoid a sudden jump into the animation.
   */
  calcStartTime() {
    return this.resolvedAt ? this.resolvedAt - this.createdAt > g1 ? this.resolvedAt : this.createdAt : this.createdAt;
  }
  /**
   * A getter for resolved data. If keyframes are not yet resolved, accessing
   * this.resolved will synchronously flush all pending keyframe resolvers.
   * This is a deoptimisation, but at its worst still batches read/writes.
   */
  get resolved() {
    return !this._resolved && !this.hasAttemptedResolve && c1(), this._resolved;
  }
  /**
   * A method to be called when the keyframes resolver completes. This method
   * will check if its possible to run the animation and, if not, skip it.
   * Otherwise, it will call initPlayback on the implementing class.
   */
  onKeyframesResolved(t, n) {
    this.resolvedAt = st.now(), this.hasAttemptedResolve = !0;
    const { name: r, type: i, velocity: s, delay: o, onComplete: l, onUpdate: a, isGenerator: u } = this.options;
    if (!u && !m1(t, r, i, s))
      if (o)
        this.options.duration = 0;
      else {
        a && a(Ys(t, this.options, n)), l && l(), this.resolveFinishedPromise();
        return;
      }
    const c = this.initPlayback(t, n);
    c !== !1 && (this._resolved = {
      keyframes: t,
      finalKeyframe: n,
      ...c
    }, this.onPostResolved());
  }
  onPostResolved() {
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(t, n) {
    return this.currentFinishedPromise.then(t, n);
  }
  flatten() {
    this.options.type = "keyframes", this.options.ease = "linear";
  }
  updateFinishedPromise() {
    this.currentFinishedPromise = new Promise((t) => {
      this.resolveFinishedPromise = t;
    });
  }
}
const Q = (e, t, n) => e + (t - e) * n;
function Ao(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function v1({ hue: e, saturation: t, lightness: n, alpha: r }) {
  e /= 360, t /= 100, n /= 100;
  let i = 0, s = 0, o = 0;
  if (!t)
    i = s = o = n;
  else {
    const l = n < 0.5 ? n * (1 + t) : n + t - n * t, a = 2 * n - l;
    i = Ao(a, l, e + 1 / 3), s = Ao(a, l, e), o = Ao(a, l, e - 1 / 3);
  }
  return {
    red: Math.round(i * 255),
    green: Math.round(s * 255),
    blue: Math.round(o * 255),
    alpha: r
  };
}
function Ps(e, t) {
  return (n) => n > 0 ? t : e;
}
const Do = (e, t, n) => {
  const r = e * e, i = n * (t * t - r) + r;
  return i < 0 ? 0 : Math.sqrt(i);
}, w1 = [Nl, rn, Rn], S1 = (e) => w1.find((t) => t.test(e));
function Jc(e) {
  const t = S1(e);
  if (!t)
    return !1;
  let n = t.parse(e);
  return t === Rn && (n = v1(n)), n;
}
const qc = (e, t) => {
  const n = Jc(e), r = Jc(t);
  if (!n || !r)
    return Ps(e, t);
  const i = { ...n };
  return (s) => (i.red = Do(n.red, r.red, s), i.green = Do(n.green, r.green, s), i.blue = Do(n.blue, r.blue, s), i.alpha = Q(n.alpha, r.alpha, s), rn.transform(i));
}, x1 = (e, t) => (n) => t(e(n)), oi = (...e) => e.reduce(x1), Ol = /* @__PURE__ */ new Set(["none", "hidden"]);
function k1(e, t) {
  return Ol.has(e) ? (n) => n <= 0 ? e : t : (n) => n >= 1 ? t : e;
}
function P1(e, t) {
  return (n) => Q(e, t, n);
}
function gu(e) {
  return typeof e == "number" ? P1 : typeof e == "string" ? Ja(e) ? Ps : me.test(e) ? qc : E1 : Array.isArray(e) ? lm : typeof e == "object" ? me.test(e) ? qc : T1 : Ps;
}
function lm(e, t) {
  const n = [...e], r = n.length, i = e.map((s, o) => gu(s)(s, t[o]));
  return (s) => {
    for (let o = 0; o < r; o++)
      n[o] = i[o](s);
    return n;
  };
}
function T1(e, t) {
  const n = { ...e, ...t }, r = {};
  for (const i in n)
    e[i] !== void 0 && t[i] !== void 0 && (r[i] = gu(e[i])(e[i], t[i]));
  return (i) => {
    for (const s in r)
      n[s] = r[s](i);
    return n;
  };
}
function C1(e, t) {
  var n;
  const r = [], i = { color: 0, var: 0, number: 0 };
  for (let s = 0; s < t.values.length; s++) {
    const o = t.types[s], l = e.indexes[o][i[o]], a = (n = e.values[l]) !== null && n !== void 0 ? n : 0;
    r[s] = a, i[o]++;
  }
  return r;
}
const E1 = (e, t) => {
  const n = Ut.createTransformer(t), r = Jr(e), i = Jr(t);
  return r.indexes.var.length === i.indexes.var.length && r.indexes.color.length === i.indexes.color.length && r.indexes.number.length >= i.indexes.number.length ? Ol.has(e) && !i.values.length || Ol.has(t) && !r.values.length ? k1(e, t) : oi(lm(C1(r, i), i.values), n) : Ps(e, t);
};
function am(e, t, n) {
  return typeof e == "number" && typeof t == "number" && typeof n == "number" ? Q(e, t, n) : gu(e)(e, t);
}
const A1 = 5;
function um(e, t, n) {
  const r = Math.max(t - A1, 0);
  return jp(n - e(r), t - r);
}
const Z = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
}, Mo = 1e-3;
function D1({ duration: e = Z.duration, bounce: t = Z.bounce, velocity: n = Z.velocity, mass: r = Z.mass }) {
  let i, s, o = 1 - t;
  o = wt(Z.minDamping, Z.maxDamping, o), e = wt(Z.minDuration, Z.maxDuration, /* @__PURE__ */ pt(e)), o < 1 ? (i = (u) => {
    const c = u * o, f = c * e, d = c - n, y = zl(u, o), g = Math.exp(-f);
    return Mo - d / y * g;
  }, s = (u) => {
    const f = u * o * e, d = f * n + n, y = Math.pow(o, 2) * Math.pow(u, 2) * e, g = Math.exp(-f), v = zl(Math.pow(u, 2), o);
    return (-i(u) + Mo > 0 ? -1 : 1) * ((d - y) * g) / v;
  }) : (i = (u) => {
    const c = Math.exp(-u * e), f = (u - n) * e + 1;
    return -Mo + c * f;
  }, s = (u) => {
    const c = Math.exp(-u * e), f = (n - u) * (e * e);
    return c * f;
  });
  const l = 5 / e, a = R1(i, s, l);
  if (e = /* @__PURE__ */ ht(e), isNaN(a))
    return {
      stiffness: Z.stiffness,
      damping: Z.damping,
      duration: e
    };
  {
    const u = Math.pow(a, 2) * r;
    return {
      stiffness: u,
      damping: o * 2 * Math.sqrt(r * u),
      duration: e
    };
  }
}
const M1 = 12;
function R1(e, t, n) {
  let r = n;
  for (let i = 1; i < M1; i++)
    r = r - e(r) / t(r);
  return r;
}
function zl(e, t) {
  return e * Math.sqrt(1 - t * t);
}
const V1 = ["duration", "bounce"], L1 = ["stiffness", "damping", "mass"];
function bc(e, t) {
  return t.some((n) => e[n] !== void 0);
}
function _1(e) {
  let t = {
    velocity: Z.velocity,
    stiffness: Z.stiffness,
    damping: Z.damping,
    mass: Z.mass,
    isResolvedFromDuration: !1,
    ...e
  };
  if (!bc(e, L1) && bc(e, V1))
    if (e.visualDuration) {
      const n = e.visualDuration, r = 2 * Math.PI / (n * 1.2), i = r * r, s = 2 * wt(0.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(i);
      t = {
        ...t,
        mass: Z.mass,
        stiffness: i,
        damping: s
      };
    } else {
      const n = D1(e);
      t = {
        ...t,
        ...n,
        mass: Z.mass
      }, t.isResolvedFromDuration = !0;
    }
  return t;
}
function cm(e = Z.visualDuration, t = Z.bounce) {
  const n = typeof e != "object" ? {
    visualDuration: e,
    keyframes: [0, 1],
    bounce: t
  } : e;
  let { restSpeed: r, restDelta: i } = n;
  const s = n.keyframes[0], o = n.keyframes[n.keyframes.length - 1], l = { done: !1, value: s }, { stiffness: a, damping: u, mass: c, duration: f, velocity: d, isResolvedFromDuration: y } = _1({
    ...n,
    velocity: -/* @__PURE__ */ pt(n.velocity || 0)
  }), g = d || 0, v = u / (2 * Math.sqrt(a * c)), x = o - s, p = /* @__PURE__ */ pt(Math.sqrt(a / c)), h = Math.abs(x) < 5;
  r || (r = h ? Z.restSpeed.granular : Z.restSpeed.default), i || (i = h ? Z.restDelta.granular : Z.restDelta.default);
  let m;
  if (v < 1) {
    const S = zl(p, v);
    m = (P) => {
      const E = Math.exp(-v * p * P);
      return o - E * ((g + v * p * x) / S * Math.sin(S * P) + x * Math.cos(S * P));
    };
  } else if (v === 1)
    m = (S) => o - Math.exp(-p * S) * (x + (g + p * x) * S);
  else {
    const S = p * Math.sqrt(v * v - 1);
    m = (P) => {
      const E = Math.exp(-v * p * P), k = Math.min(S * P, 300);
      return o - E * ((g + v * p * x) * Math.sinh(k) + S * x * Math.cosh(k)) / S;
    };
  }
  const w = {
    calculatedDuration: y && f || null,
    next: (S) => {
      const P = m(S);
      if (y)
        l.done = S >= f;
      else {
        let E = 0;
        v < 1 && (E = S === 0 ? /* @__PURE__ */ ht(g) : um(m, S, P));
        const k = Math.abs(E) <= r, _ = Math.abs(o - P) <= i;
        l.done = k && _;
      }
      return l.value = l.done ? o : P, l;
    },
    toString: () => {
      const S = Math.min(Dp(w), Vl), P = Mp((E) => w.next(S * E).value, S, 30);
      return S + "ms " + P;
    }
  };
  return w;
}
function ef({ keyframes: e, velocity: t = 0, power: n = 0.8, timeConstant: r = 325, bounceDamping: i = 10, bounceStiffness: s = 500, modifyTarget: o, min: l, max: a, restDelta: u = 0.5, restSpeed: c }) {
  const f = e[0], d = {
    done: !1,
    value: f
  }, y = (k) => l !== void 0 && k < l || a !== void 0 && k > a, g = (k) => l === void 0 ? a : a === void 0 || Math.abs(l - k) < Math.abs(a - k) ? l : a;
  let v = n * t;
  const x = f + v, p = o === void 0 ? x : o(x);
  p !== x && (v = p - f);
  const h = (k) => -v * Math.exp(-k / r), m = (k) => p + h(k), w = (k) => {
    const _ = h(k), M = m(k);
    d.done = Math.abs(_) <= u, d.value = d.done ? p : M;
  };
  let S, P;
  const E = (k) => {
    y(d.value) && (S = k, P = cm({
      keyframes: [d.value, g(d.value)],
      velocity: um(m, k, d.value),
      // TODO: This should be passing * 1000
      damping: i,
      stiffness: s,
      restDelta: u,
      restSpeed: c
    }));
  };
  return E(0), {
    calculatedDuration: null,
    next: (k) => {
      let _ = !1;
      return !P && S === void 0 && (_ = !0, w(k), E(k)), S !== void 0 && k >= S ? P.next(k - S) : (!_ && w(k), d);
    }
  };
}
const N1 = /* @__PURE__ */ si(0.42, 0, 1, 1), I1 = /* @__PURE__ */ si(0, 0, 0.58, 1), fm = /* @__PURE__ */ si(0.42, 0, 0.58, 1), j1 = (e) => Array.isArray(e) && typeof e[0] != "number", F1 = {
  linear: Ve,
  easeIn: N1,
  easeInOut: fm,
  easeOut: I1,
  circIn: du,
  circInOut: Kp,
  circOut: Hp,
  backIn: fu,
  backInOut: $p,
  backOut: Up,
  anticipate: Wp
}, tf = (e) => {
  if (ou(e)) {
    lp(e.length === 4);
    const [t, n, r, i] = e;
    return si(t, n, r, i);
  } else if (typeof e == "string")
    return F1[e];
  return e;
};
function O1(e, t, n) {
  const r = [], i = n || am, s = e.length - 1;
  for (let o = 0; o < s; o++) {
    let l = i(e[o], e[o + 1]);
    if (t) {
      const a = Array.isArray(t) ? t[o] || Ve : t;
      l = oi(a, l);
    }
    r.push(l);
  }
  return r;
}
function z1(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
  const s = e.length;
  if (lp(s === t.length), s === 1)
    return () => t[0];
  if (s === 2 && t[0] === t[1])
    return () => t[1];
  const o = e[0] === e[1];
  e[0] > e[s - 1] && (e = [...e].reverse(), t = [...t].reverse());
  const l = O1(t, r, i), a = l.length, u = (c) => {
    if (o && c < e[0])
      return t[0];
    let f = 0;
    if (a > 1)
      for (; f < e.length - 2 && !(c < e[f + 1]); f++)
        ;
    const d = /* @__PURE__ */ Qn(e[f], e[f + 1], c);
    return l[f](d);
  };
  return n ? (c) => u(wt(e[0], e[s - 1], c)) : u;
}
function B1(e, t) {
  const n = e[e.length - 1];
  for (let r = 1; r <= t; r++) {
    const i = /* @__PURE__ */ Qn(0, t, r);
    e.push(Q(n, 1, i));
  }
}
function U1(e) {
  const t = [0];
  return B1(t, e.length - 1), t;
}
function $1(e, t) {
  return e.map((n) => n * t);
}
function W1(e, t) {
  return e.map(() => t || fm).splice(0, e.length - 1);
}
function Ts({ duration: e = 300, keyframes: t, times: n, ease: r = "easeInOut" }) {
  const i = j1(r) ? r.map(tf) : tf(r), s = {
    done: !1,
    value: t[0]
  }, o = $1(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    n && n.length === t.length ? n : U1(t),
    e
  ), l = z1(o, t, {
    ease: Array.isArray(i) ? i : W1(t, i)
  });
  return {
    calculatedDuration: e,
    next: (a) => (s.value = l(a), s.done = a >= e, s)
  };
}
const H1 = (e) => {
  const t = ({ timestamp: n }) => e(n);
  return {
    start: () => $.update(t, !0),
    stop: () => Bt(t),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => ue.isProcessing ? ue.timestamp : st.now()
  };
}, K1 = {
  decay: ef,
  inertia: ef,
  tween: Ts,
  keyframes: Ts,
  spring: cm
}, G1 = (e) => e / 100;
class vu extends om {
  constructor(t) {
    super(t), this.holdTime = null, this.cancelTime = null, this.currentTime = 0, this.playbackSpeed = 1, this.pendingPlayState = "running", this.startTime = null, this.state = "idle", this.stop = () => {
      if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
        return;
      this.teardown();
      const { onStop: a } = this.options;
      a && a();
    };
    const { name: n, motionValue: r, element: i, keyframes: s } = this.options, o = (i == null ? void 0 : i.KeyframeResolver) || yu, l = (a, u) => this.onKeyframesResolved(a, u);
    this.resolver = new o(s, l, n, r, i), this.resolver.scheduleResolve();
  }
  flatten() {
    super.flatten(), this._resolved && Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
  }
  initPlayback(t) {
    const { type: n = "keyframes", repeat: r = 0, repeatDelay: i = 0, repeatType: s, velocity: o = 0 } = this.options, l = su(n) ? n : K1[n] || Ts;
    let a, u;
    l !== Ts && typeof t[0] != "number" && (a = oi(G1, am(t[0], t[1])), t = [0, 100]);
    const c = l({ ...this.options, keyframes: t });
    s === "mirror" && (u = l({
      ...this.options,
      keyframes: [...t].reverse(),
      velocity: -o
    })), c.calculatedDuration === null && (c.calculatedDuration = Dp(c));
    const { calculatedDuration: f } = c, d = f + i, y = d * (r + 1) - i;
    return {
      generator: c,
      mirroredGenerator: u,
      mapPercentToKeyframes: a,
      calculatedDuration: f,
      resolvedDuration: d,
      totalDuration: y
    };
  }
  onPostResolved() {
    const { autoplay: t = !0 } = this.options;
    this.play(), this.pendingPlayState === "paused" || !t ? this.pause() : this.state = this.pendingPlayState;
  }
  tick(t, n = !1) {
    const { resolved: r } = this;
    if (!r) {
      const { keyframes: k } = this.options;
      return { done: !0, value: k[k.length - 1] };
    }
    const { finalKeyframe: i, generator: s, mirroredGenerator: o, mapPercentToKeyframes: l, keyframes: a, calculatedDuration: u, totalDuration: c, resolvedDuration: f } = r;
    if (this.startTime === null)
      return s.next(0);
    const { delay: d, repeat: y, repeatType: g, repeatDelay: v, onUpdate: x } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, t) : this.speed < 0 && (this.startTime = Math.min(t - c / this.speed, this.startTime)), n ? this.currentTime = t : this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = Math.round(t - this.startTime) * this.speed;
    const p = this.currentTime - d * (this.speed >= 0 ? 1 : -1), h = this.speed >= 0 ? p < 0 : p > c;
    this.currentTime = Math.max(p, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = c);
    let m = this.currentTime, w = s;
    if (y) {
      const k = Math.min(this.currentTime, c) / f;
      let _ = Math.floor(k), M = k % 1;
      !M && k >= 1 && (M = 1), M === 1 && _--, _ = Math.min(_, y + 1), !!(_ % 2) && (g === "reverse" ? (M = 1 - M, v && (M -= v / f)) : g === "mirror" && (w = o)), m = wt(0, 1, M) * f;
    }
    const S = h ? { done: !1, value: a[0] } : w.next(m);
    l && (S.value = l(S.value));
    let { done: P } = S;
    !h && u !== null && (P = this.speed >= 0 ? this.currentTime >= c : this.currentTime <= 0);
    const E = this.holdTime === null && (this.state === "finished" || this.state === "running" && P);
    return E && i !== void 0 && (S.value = Ys(a, this.options, i)), x && x(S.value), E && this.finish(), S;
  }
  get duration() {
    const { resolved: t } = this;
    return t ? /* @__PURE__ */ pt(t.calculatedDuration) : 0;
  }
  get time() {
    return /* @__PURE__ */ pt(this.currentTime);
  }
  set time(t) {
    t = /* @__PURE__ */ ht(t), this.currentTime = t, this.holdTime !== null || this.speed === 0 ? this.holdTime = t : this.driver && (this.startTime = this.driver.now() - t / this.speed);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(t) {
    const n = this.playbackSpeed !== t;
    this.playbackSpeed = t, n && (this.time = /* @__PURE__ */ pt(this.currentTime));
  }
  play() {
    if (this.resolver.isScheduled || this.resolver.resume(), !this._resolved) {
      this.pendingPlayState = "running";
      return;
    }
    if (this.isStopped)
      return;
    const { driver: t = H1, onPlay: n, startTime: r } = this.options;
    this.driver || (this.driver = t((s) => this.tick(s))), n && n();
    const i = this.driver.now();
    this.holdTime !== null ? this.startTime = i - this.holdTime : this.startTime ? this.state === "finished" && (this.startTime = i) : this.startTime = r ?? this.calcStartTime(), this.state === "finished" && this.updateFinishedPromise(), this.cancelTime = this.startTime, this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    var t;
    if (!this._resolved) {
      this.pendingPlayState = "paused";
      return;
    }
    this.state = "paused", this.holdTime = (t = this.currentTime) !== null && t !== void 0 ? t : 0;
  }
  complete() {
    this.state !== "running" && this.play(), this.pendingPlayState = this.state = "finished", this.holdTime = null;
  }
  finish() {
    this.teardown(), this.state = "finished";
    const { onComplete: t } = this.options;
    t && t();
  }
  cancel() {
    this.cancelTime !== null && this.tick(this.cancelTime), this.teardown(), this.updateFinishedPromise();
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.resolveFinishedPromise(), this.updateFinishedPromise(), this.startTime = this.cancelTime = null, this.resolver.cancel();
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(t) {
    return this.startTime = 0, this.tick(t, !0);
  }
}
const Q1 = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]);
function Y1(e, t, n, { delay: r = 0, duration: i = 300, repeat: s = 0, repeatType: o = "loop", ease: l = "easeInOut", times: a } = {}) {
  const u = { [t]: n };
  a && (u.offset = a);
  const c = Vp(l, i);
  return Array.isArray(c) && (u.easing = c), e.animate(u, {
    delay: r,
    duration: i,
    easing: Array.isArray(c) ? "linear" : c,
    fill: "both",
    iterations: s + 1,
    direction: o === "reverse" ? "alternate" : "normal"
  });
}
const X1 = /* @__PURE__ */ Ha(() => Object.hasOwnProperty.call(Element.prototype, "animate")), Cs = 10, Z1 = 2e4;
function J1(e) {
  return su(e.type) || e.type === "spring" || !Rp(e.ease);
}
function q1(e, t) {
  const n = new vu({
    ...t,
    keyframes: e,
    repeat: 0,
    delay: 0,
    isGenerator: !0
  });
  let r = { done: !1, value: e[0] };
  const i = [];
  let s = 0;
  for (; !r.done && s < Z1; )
    r = n.sample(s), i.push(r.value), s += Cs;
  return {
    times: void 0,
    keyframes: i,
    duration: s - Cs,
    ease: "linear"
  };
}
const dm = {
  anticipate: Wp,
  backInOut: $p,
  circInOut: Kp
};
function b1(e) {
  return e in dm;
}
class nf extends om {
  constructor(t) {
    super(t);
    const { name: n, motionValue: r, element: i, keyframes: s } = this.options;
    this.resolver = new sm(s, (o, l) => this.onKeyframesResolved(o, l), n, r, i), this.resolver.scheduleResolve();
  }
  initPlayback(t, n) {
    let { duration: r = 300, times: i, ease: s, type: o, motionValue: l, name: a, startTime: u } = this.options;
    if (!l.owner || !l.owner.current)
      return !1;
    if (typeof s == "string" && ks() && b1(s) && (s = dm[s]), J1(this.options)) {
      const { onComplete: f, onUpdate: d, motionValue: y, element: g, ...v } = this.options, x = q1(t, v);
      t = x.keyframes, t.length === 1 && (t[1] = t[0]), r = x.duration, i = x.times, s = x.ease, o = "keyframes";
    }
    const c = Y1(l.owner.current, a, t, { ...this.options, duration: r, times: i, ease: s });
    return c.startTime = u ?? this.calcStartTime(), this.pendingTimeline ? (Bc(c, this.pendingTimeline), this.pendingTimeline = void 0) : c.onfinish = () => {
      const { onComplete: f } = this.options;
      l.set(Ys(t, this.options, n)), f && f(), this.cancel(), this.resolveFinishedPromise();
    }, {
      animation: c,
      duration: r,
      times: i,
      type: o,
      ease: s,
      keyframes: t
    };
  }
  get duration() {
    const { resolved: t } = this;
    if (!t)
      return 0;
    const { duration: n } = t;
    return /* @__PURE__ */ pt(n);
  }
  get time() {
    const { resolved: t } = this;
    if (!t)
      return 0;
    const { animation: n } = t;
    return /* @__PURE__ */ pt(n.currentTime || 0);
  }
  set time(t) {
    const { resolved: n } = this;
    if (!n)
      return;
    const { animation: r } = n;
    r.currentTime = /* @__PURE__ */ ht(t);
  }
  get speed() {
    const { resolved: t } = this;
    if (!t)
      return 1;
    const { animation: n } = t;
    return n.playbackRate;
  }
  set speed(t) {
    const { resolved: n } = this;
    if (!n)
      return;
    const { animation: r } = n;
    r.playbackRate = t;
  }
  get state() {
    const { resolved: t } = this;
    if (!t)
      return "idle";
    const { animation: n } = t;
    return n.playState;
  }
  get startTime() {
    const { resolved: t } = this;
    if (!t)
      return null;
    const { animation: n } = t;
    return n.startTime;
  }
  /**
   * Replace the default DocumentTimeline with another AnimationTimeline.
   * Currently used for scroll animations.
   */
  attachTimeline(t) {
    if (!this._resolved)
      this.pendingTimeline = t;
    else {
      const { resolved: n } = this;
      if (!n)
        return Ve;
      const { animation: r } = n;
      Bc(r, t);
    }
    return Ve;
  }
  play() {
    if (this.isStopped)
      return;
    const { resolved: t } = this;
    if (!t)
      return;
    const { animation: n } = t;
    n.playState === "finished" && this.updateFinishedPromise(), n.play();
  }
  pause() {
    const { resolved: t } = this;
    if (!t)
      return;
    const { animation: n } = t;
    n.pause();
  }
  stop() {
    if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
      return;
    this.resolveFinishedPromise(), this.updateFinishedPromise();
    const { resolved: t } = this;
    if (!t)
      return;
    const { animation: n, keyframes: r, duration: i, type: s, ease: o, times: l } = t;
    if (n.playState === "idle" || n.playState === "finished")
      return;
    if (this.time) {
      const { motionValue: u, onUpdate: c, onComplete: f, element: d, ...y } = this.options, g = new vu({
        ...y,
        keyframes: r,
        duration: i,
        type: s,
        ease: o,
        times: l,
        isGenerator: !0
      }), v = /* @__PURE__ */ ht(this.time);
      u.setWithVelocity(g.sample(v - Cs).value, g.sample(v).value, Cs);
    }
    const { onStop: a } = this.options;
    a && a(), this.cancel();
  }
  complete() {
    const { resolved: t } = this;
    t && t.animation.finish();
  }
  cancel() {
    const { resolved: t } = this;
    t && t.animation.cancel();
  }
  static supports(t) {
    const { motionValue: n, name: r, repeatDelay: i, repeatType: s, damping: o, type: l } = t;
    if (!n || !n.owner || !(n.owner.current instanceof HTMLElement))
      return !1;
    const { onUpdate: a, transformTemplate: u } = n.owner.getProps();
    return X1() && r && Q1.has(r) && /**
     * If we're outputting values to onUpdate then we can't use WAAPI as there's
     * no way to read the value from WAAPI every frame.
     */
    !a && !u && !i && s !== "mirror" && o !== 0 && l !== "inertia";
  }
}
const ew = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, tw = (e) => ({
  type: "spring",
  stiffness: 550,
  damping: e === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), nw = {
  type: "keyframes",
  duration: 0.8
}, rw = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, iw = (e, { keyframes: t }) => t.length > 2 ? nw : mn.has(e) ? e.startsWith("scale") ? tw(t[1]) : ew : rw;
function sw({ when: e, delay: t, delayChildren: n, staggerChildren: r, staggerDirection: i, repeat: s, repeatType: o, repeatDelay: l, from: a, elapsed: u, ...c }) {
  return !!Object.keys(c).length;
}
const wu = (e, t, n, r = {}, i, s) => (o) => {
  const l = iu(r, e) || {}, a = l.delay || r.delay || 0;
  let { elapsed: u = 0 } = r;
  u = u - /* @__PURE__ */ ht(a);
  let c = {
    keyframes: Array.isArray(n) ? n : [null, n],
    ease: "easeOut",
    velocity: t.getVelocity(),
    ...l,
    delay: -u,
    onUpdate: (d) => {
      t.set(d), l.onUpdate && l.onUpdate(d);
    },
    onComplete: () => {
      o(), l.onComplete && l.onComplete();
    },
    name: e,
    motionValue: t,
    element: s ? void 0 : i
  };
  sw(l) || (c = {
    ...c,
    ...iw(e, c)
  }), c.duration && (c.duration = /* @__PURE__ */ ht(c.duration)), c.repeatDelay && (c.repeatDelay = /* @__PURE__ */ ht(c.repeatDelay)), c.from !== void 0 && (c.keyframes[0] = c.from);
  let f = !1;
  if ((c.type === !1 || c.duration === 0 && !c.repeatDelay) && (c.duration = 0, c.delay === 0 && (f = !0)), f && !s && t.get() !== void 0) {
    const d = Ys(c.keyframes, l);
    if (d !== void 0)
      return $.update(() => {
        c.onUpdate(d), c.onComplete();
      }), new T0([]);
  }
  return !s && nf.supports(c) ? new nf(c) : new vu(c);
};
function ow({ protectedKeys: e, needsAnimating: t }, n) {
  const r = e.hasOwnProperty(n) && t[n] !== !0;
  return t[n] = !1, r;
}
function hm(e, t, { delay: n = 0, transitionOverride: r, type: i } = {}) {
  var s;
  let { transition: o = e.getDefaultTransition(), transitionEnd: l, ...a } = t;
  r && (o = r);
  const u = [], c = i && e.animationState && e.animationState.getState()[i];
  for (const f in a) {
    const d = e.getValue(f, (s = e.latestValues[f]) !== null && s !== void 0 ? s : null), y = a[f];
    if (y === void 0 || c && ow(c, f))
      continue;
    const g = {
      delay: n,
      ...iu(o || {}, f)
    };
    let v = !1;
    if (window.MotionHandoffAnimation) {
      const p = Fp(e);
      if (p) {
        const h = window.MotionHandoffAnimation(p, f, $);
        h !== null && (g.startTime = h, v = !0);
      }
    }
    _l(e, f), d.start(wu(f, d, y, e.shouldReduceMotion && Ip.has(f) ? { type: !1 } : g, e, v));
    const x = d.animation;
    x && u.push(x);
  }
  return l && Promise.all(u).then(() => {
    $.update(() => {
      l && O0(e, l);
    });
  }), u;
}
function Bl(e, t, n = {}) {
  var r;
  const i = Qs(e, t, n.type === "exit" ? (r = e.presenceContext) === null || r === void 0 ? void 0 : r.custom : void 0);
  let { transition: s = e.getDefaultTransition() || {} } = i || {};
  n.transitionOverride && (s = n.transitionOverride);
  const o = i ? () => Promise.all(hm(e, i, n)) : () => Promise.resolve(), l = e.variantChildren && e.variantChildren.size ? (u = 0) => {
    const { delayChildren: c = 0, staggerChildren: f, staggerDirection: d } = s;
    return lw(e, t, c + u, f, d, n);
  } : () => Promise.resolve(), { when: a } = s;
  if (a) {
    const [u, c] = a === "beforeChildren" ? [o, l] : [l, o];
    return u().then(() => c());
  } else
    return Promise.all([o(), l(n.delay)]);
}
function lw(e, t, n = 0, r = 0, i = 1, s) {
  const o = [], l = (e.variantChildren.size - 1) * r, a = i === 1 ? (u = 0) => u * r : (u = 0) => l - u * r;
  return Array.from(e.variantChildren).sort(aw).forEach((u, c) => {
    u.notify("AnimationStart", t), o.push(Bl(u, t, {
      ...s,
      delay: n + a(c)
    }).then(() => u.notify("AnimationComplete", t)));
  }), Promise.all(o);
}
function aw(e, t) {
  return e.sortNodePosition(t);
}
function uw(e, t, n = {}) {
  e.notify("AnimationStart", t);
  let r;
  if (Array.isArray(t)) {
    const i = t.map((s) => Bl(e, s, n));
    r = Promise.all(i);
  } else if (typeof t == "string")
    r = Bl(e, t, n);
  else {
    const i = typeof t == "function" ? Qs(e, t, n.custom) : t;
    r = Promise.all(hm(e, i, n));
  }
  return r.then(() => {
    e.notify("AnimationComplete", t);
  });
}
const cw = Ga.length;
function pm(e) {
  if (!e)
    return;
  if (!e.isControllingVariants) {
    const n = e.parent ? pm(e.parent) || {} : {};
    return e.props.initial !== void 0 && (n.initial = e.props.initial), n;
  }
  const t = {};
  for (let n = 0; n < cw; n++) {
    const r = Ga[n], i = e.props[r];
    (Yr(i) || i === !1) && (t[r] = i);
  }
  return t;
}
const fw = [...Ka].reverse(), dw = Ka.length;
function hw(e) {
  return (t) => Promise.all(t.map(({ animation: n, options: r }) => uw(e, n, r)));
}
function pw(e) {
  let t = hw(e), n = rf(), r = !0;
  const i = (a) => (u, c) => {
    var f;
    const d = Qs(e, c, a === "exit" ? (f = e.presenceContext) === null || f === void 0 ? void 0 : f.custom : void 0);
    if (d) {
      const { transition: y, transitionEnd: g, ...v } = d;
      u = { ...u, ...v, ...g };
    }
    return u;
  };
  function s(a) {
    t = a(e);
  }
  function o(a) {
    const { props: u } = e, c = pm(e.parent) || {}, f = [], d = /* @__PURE__ */ new Set();
    let y = {}, g = 1 / 0;
    for (let x = 0; x < dw; x++) {
      const p = fw[x], h = n[p], m = u[p] !== void 0 ? u[p] : c[p], w = Yr(m), S = p === a ? h.isActive : null;
      S === !1 && (g = x);
      let P = m === c[p] && m !== u[p] && w;
      if (P && r && e.manuallyAnimateOnMount && (P = !1), h.protectedKeys = { ...y }, // If it isn't active and hasn't *just* been set as inactive
      !h.isActive && S === null || // If we didn't and don't have any defined prop for this animation type
      !m && !h.prevProp || // Or if the prop doesn't define an animation
      Ks(m) || typeof m == "boolean")
        continue;
      const E = mw(h.prevProp, m);
      let k = E || // If we're making this variant active, we want to always make it active
      p === a && h.isActive && !P && w || // If we removed a higher-priority variant (i is in reverse order)
      x > g && w, _ = !1;
      const M = Array.isArray(m) ? m : [m];
      let q = M.reduce(i(p), {});
      S === !1 && (q = {});
      const { prevResolvedValues: He = {} } = h, j = {
        ...He,
        ...q
      }, z = (B) => {
        k = !0, d.has(B) && (_ = !0, d.delete(B)), h.needsAnimating[B] = !0;
        const A = e.getValue(B);
        A && (A.liveStyle = !1);
      };
      for (const B in j) {
        const A = q[B], V = He[B];
        if (y.hasOwnProperty(B))
          continue;
        let L = !1;
        Rl(A) && Rl(V) ? L = !Ap(A, V) : L = A !== V, L ? A != null ? z(B) : d.add(B) : A !== void 0 && d.has(B) ? z(B) : h.protectedKeys[B] = !0;
      }
      h.prevProp = m, h.prevResolvedValues = q, h.isActive && (y = { ...y, ...q }), r && e.blockInitialAnimation && (k = !1), k && (!(P && E) || _) && f.push(...M.map((B) => ({
        animation: B,
        options: { type: p }
      })));
    }
    if (d.size) {
      const x = {};
      d.forEach((p) => {
        const h = e.getBaseTarget(p), m = e.getValue(p);
        m && (m.liveStyle = !0), x[p] = h ?? null;
      }), f.push({ animation: x });
    }
    let v = !!f.length;
    return r && (u.initial === !1 || u.initial === u.animate) && !e.manuallyAnimateOnMount && (v = !1), r = !1, v ? t(f) : Promise.resolve();
  }
  function l(a, u) {
    var c;
    if (n[a].isActive === u)
      return Promise.resolve();
    (c = e.variantChildren) === null || c === void 0 || c.forEach((d) => {
      var y;
      return (y = d.animationState) === null || y === void 0 ? void 0 : y.setActive(a, u);
    }), n[a].isActive = u;
    const f = o(a);
    for (const d in n)
      n[d].protectedKeys = {};
    return f;
  }
  return {
    animateChanges: o,
    setActive: l,
    setAnimateFunction: s,
    getState: () => n,
    reset: () => {
      n = rf(), r = !0;
    }
  };
}
function mw(e, t) {
  return typeof t == "string" ? t !== e : Array.isArray(t) ? !Ap(t, e) : !1;
}
function Xt(e = !1) {
  return {
    isActive: e,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function rf() {
  return {
    animate: Xt(!0),
    whileInView: Xt(),
    whileHover: Xt(),
    whileTap: Xt(),
    whileDrag: Xt(),
    whileFocus: Xt(),
    exit: Xt()
  };
}
class Kt {
  constructor(t) {
    this.isMounted = !1, this.node = t;
  }
  update() {
  }
}
class yw extends Kt {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(t) {
    super(t), t.animationState || (t.animationState = pw(t));
  }
  updateAnimationControlsSubscription() {
    const { animate: t } = this.node.getProps();
    Ks(t) && (this.unmountControls = t.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: t } = this.node.getProps(), { animate: n } = this.node.prevProps || {};
    t !== n && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var t;
    this.node.animationState.reset(), (t = this.unmountControls) === null || t === void 0 || t.call(this);
  }
}
let gw = 0;
class vw extends Kt {
  constructor() {
    super(...arguments), this.id = gw++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: t, onExitComplete: n } = this.node.presenceContext, { isPresent: r } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || t === r)
      return;
    const i = this.node.animationState.setActive("exit", !t);
    n && !t && i.then(() => n(this.id));
  }
  mount() {
    const { register: t } = this.node.presenceContext || {};
    t && (this.unmount = t(this.id));
  }
  unmount() {
  }
}
const ww = {
  animation: {
    Feature: yw
  },
  exit: {
    Feature: vw
  }
};
function qr(e, t, n, r = { passive: !0 }) {
  return e.addEventListener(t, n, r), () => e.removeEventListener(t, n);
}
function li(e) {
  return {
    point: {
      x: e.pageX,
      y: e.pageY
    }
  };
}
const Sw = (e) => (t) => lu(t) && e(t, li(t));
function Ar(e, t, n, r) {
  return qr(e, t, Sw(n), r);
}
const sf = (e, t) => Math.abs(e - t);
function xw(e, t) {
  const n = sf(e.x, t.x), r = sf(e.y, t.y);
  return Math.sqrt(n ** 2 + r ** 2);
}
class mm {
  constructor(t, n, { transformPagePoint: r, contextWindow: i, dragSnapToOrigin: s = !1 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const f = Vo(this.lastMoveEventInfo, this.history), d = this.startEvent !== null, y = xw(f.offset, { x: 0, y: 0 }) >= 3;
      if (!d && !y)
        return;
      const { point: g } = f, { timestamp: v } = ue;
      this.history.push({ ...g, timestamp: v });
      const { onStart: x, onMove: p } = this.handlers;
      d || (x && x(this.lastMoveEvent, f), this.startEvent = this.lastMoveEvent), p && p(this.lastMoveEvent, f);
    }, this.handlePointerMove = (f, d) => {
      this.lastMoveEvent = f, this.lastMoveEventInfo = Ro(d, this.transformPagePoint), $.update(this.updatePoint, !0);
    }, this.handlePointerUp = (f, d) => {
      this.end();
      const { onEnd: y, onSessionEnd: g, resumeAnimation: v } = this.handlers;
      if (this.dragSnapToOrigin && v && v(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const x = Vo(f.type === "pointercancel" ? this.lastMoveEventInfo : Ro(d, this.transformPagePoint), this.history);
      this.startEvent && y && y(f, x), g && g(f, x);
    }, !lu(t))
      return;
    this.dragSnapToOrigin = s, this.handlers = n, this.transformPagePoint = r, this.contextWindow = i || window;
    const o = li(t), l = Ro(o, this.transformPagePoint), { point: a } = l, { timestamp: u } = ue;
    this.history = [{ ...a, timestamp: u }];
    const { onSessionStart: c } = n;
    c && c(t, Vo(l, this.history)), this.removeListeners = oi(Ar(this.contextWindow, "pointermove", this.handlePointerMove), Ar(this.contextWindow, "pointerup", this.handlePointerUp), Ar(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(t) {
    this.handlers = t;
  }
  end() {
    this.removeListeners && this.removeListeners(), Bt(this.updatePoint);
  }
}
function Ro(e, t) {
  return t ? { point: t(e.point) } : e;
}
function of(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function Vo({ point: e }, t) {
  return {
    point: e,
    delta: of(e, ym(t)),
    offset: of(e, kw(t)),
    velocity: Pw(t, 0.1)
  };
}
function kw(e) {
  return e[0];
}
function ym(e) {
  return e[e.length - 1];
}
function Pw(e, t) {
  if (e.length < 2)
    return { x: 0, y: 0 };
  let n = e.length - 1, r = null;
  const i = ym(e);
  for (; n >= 0 && (r = e[n], !(i.timestamp - r.timestamp > /* @__PURE__ */ ht(t))); )
    n--;
  if (!r)
    return { x: 0, y: 0 };
  const s = /* @__PURE__ */ pt(i.timestamp - r.timestamp);
  if (s === 0)
    return { x: 0, y: 0 };
  const o = {
    x: (i.x - r.x) / s,
    y: (i.y - r.y) / s
  };
  return o.x === 1 / 0 && (o.x = 0), o.y === 1 / 0 && (o.y = 0), o;
}
const gm = 1e-4, Tw = 1 - gm, Cw = 1 + gm, vm = 0.01, Ew = 0 - vm, Aw = 0 + vm;
function _e(e) {
  return e.max - e.min;
}
function Dw(e, t, n) {
  return Math.abs(e - t) <= n;
}
function lf(e, t, n, r = 0.5) {
  e.origin = r, e.originPoint = Q(t.min, t.max, e.origin), e.scale = _e(n) / _e(t), e.translate = Q(n.min, n.max, e.origin) - e.originPoint, (e.scale >= Tw && e.scale <= Cw || isNaN(e.scale)) && (e.scale = 1), (e.translate >= Ew && e.translate <= Aw || isNaN(e.translate)) && (e.translate = 0);
}
function Dr(e, t, n, r) {
  lf(e.x, t.x, n.x, r ? r.originX : void 0), lf(e.y, t.y, n.y, r ? r.originY : void 0);
}
function af(e, t, n) {
  e.min = n.min + t.min, e.max = e.min + _e(t);
}
function Mw(e, t, n) {
  af(e.x, t.x, n.x), af(e.y, t.y, n.y);
}
function uf(e, t, n) {
  e.min = t.min - n.min, e.max = e.min + _e(t);
}
function Mr(e, t, n) {
  uf(e.x, t.x, n.x), uf(e.y, t.y, n.y);
}
function Rw(e, { min: t, max: n }, r) {
  return t !== void 0 && e < t ? e = r ? Q(t, e, r.min) : Math.max(e, t) : n !== void 0 && e > n && (e = r ? Q(n, e, r.max) : Math.min(e, n)), e;
}
function cf(e, t, n) {
  return {
    min: t !== void 0 ? e.min + t : void 0,
    max: n !== void 0 ? e.max + n - (e.max - e.min) : void 0
  };
}
function Vw(e, { top: t, left: n, bottom: r, right: i }) {
  return {
    x: cf(e.x, n, i),
    y: cf(e.y, t, r)
  };
}
function ff(e, t) {
  let n = t.min - e.min, r = t.max - e.max;
  return t.max - t.min < e.max - e.min && ([n, r] = [r, n]), { min: n, max: r };
}
function Lw(e, t) {
  return {
    x: ff(e.x, t.x),
    y: ff(e.y, t.y)
  };
}
function _w(e, t) {
  let n = 0.5;
  const r = _e(e), i = _e(t);
  return i > r ? n = /* @__PURE__ */ Qn(t.min, t.max - r, e.min) : r > i && (n = /* @__PURE__ */ Qn(e.min, e.max - i, t.min)), wt(0, 1, n);
}
function Nw(e, t) {
  const n = {};
  return t.min !== void 0 && (n.min = t.min - e.min), t.max !== void 0 && (n.max = t.max - e.min), n;
}
const Ul = 0.35;
function Iw(e = Ul) {
  return e === !1 ? e = 0 : e === !0 && (e = Ul), {
    x: df(e, "left", "right"),
    y: df(e, "top", "bottom")
  };
}
function df(e, t, n) {
  return {
    min: hf(e, t),
    max: hf(e, n)
  };
}
function hf(e, t) {
  return typeof e == "number" ? e : e[t] || 0;
}
const pf = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), Vn = () => ({
  x: pf(),
  y: pf()
}), mf = () => ({ min: 0, max: 0 }), ee = () => ({
  x: mf(),
  y: mf()
});
function Fe(e) {
  return [e("x"), e("y")];
}
function wm({ top: e, left: t, right: n, bottom: r }) {
  return {
    x: { min: t, max: n },
    y: { min: e, max: r }
  };
}
function jw({ x: e, y: t }) {
  return { top: t.min, right: e.max, bottom: t.max, left: e.min };
}
function Fw(e, t) {
  if (!t)
    return e;
  const n = t({ x: e.left, y: e.top }), r = t({ x: e.right, y: e.bottom });
  return {
    top: n.y,
    left: n.x,
    bottom: r.y,
    right: r.x
  };
}
function Lo(e) {
  return e === void 0 || e === 1;
}
function $l({ scale: e, scaleX: t, scaleY: n }) {
  return !Lo(e) || !Lo(t) || !Lo(n);
}
function qt(e) {
  return $l(e) || Sm(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY;
}
function Sm(e) {
  return yf(e.x) || yf(e.y);
}
function yf(e) {
  return e && e !== "0%";
}
function Es(e, t, n) {
  const r = e - n, i = t * r;
  return n + i;
}
function gf(e, t, n, r, i) {
  return i !== void 0 && (e = Es(e, i, r)), Es(e, n, r) + t;
}
function Wl(e, t = 0, n = 1, r, i) {
  e.min = gf(e.min, t, n, r, i), e.max = gf(e.max, t, n, r, i);
}
function xm(e, { x: t, y: n }) {
  Wl(e.x, t.translate, t.scale, t.originPoint), Wl(e.y, n.translate, n.scale, n.originPoint);
}
const vf = 0.999999999999, wf = 1.0000000000001;
function Ow(e, t, n, r = !1) {
  const i = n.length;
  if (!i)
    return;
  t.x = t.y = 1;
  let s, o;
  for (let l = 0; l < i; l++) {
    s = n[l], o = s.projectionDelta;
    const { visualElement: a } = s.options;
    a && a.props.style && a.props.style.display === "contents" || (r && s.options.layoutScroll && s.scroll && s !== s.root && _n(e, {
      x: -s.scroll.offset.x,
      y: -s.scroll.offset.y
    }), o && (t.x *= o.x.scale, t.y *= o.y.scale, xm(e, o)), r && qt(s.latestValues) && _n(e, s.latestValues));
  }
  t.x < wf && t.x > vf && (t.x = 1), t.y < wf && t.y > vf && (t.y = 1);
}
function Ln(e, t) {
  e.min = e.min + t, e.max = e.max + t;
}
function Sf(e, t, n, r, i = 0.5) {
  const s = Q(e.min, e.max, i);
  Wl(e, t, n, s, r);
}
function _n(e, t) {
  Sf(e.x, t.x, t.scaleX, t.scale, t.originX), Sf(e.y, t.y, t.scaleY, t.scale, t.originY);
}
function km(e, t) {
  return wm(Fw(e.getBoundingClientRect(), t));
}
function zw(e, t, n) {
  const r = km(e, n), { scroll: i } = t;
  return i && (Ln(r.x, i.offset.x), Ln(r.y, i.offset.y)), r;
}
const Pm = ({ current: e }) => e ? e.ownerDocument.defaultView : null, Bw = /* @__PURE__ */ new WeakMap();
class Uw {
  constructor(t) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = ee(), this.visualElement = t;
  }
  start(t, { snapToCursor: n = !1 } = {}) {
    const { presenceContext: r } = this.visualElement;
    if (r && r.isPresent === !1)
      return;
    const i = (c) => {
      const { dragSnapToOrigin: f } = this.getProps();
      f ? this.pauseAnimation() : this.stopAnimation(), n && this.snapToCursor(li(c).point);
    }, s = (c, f) => {
      const { drag: d, dragPropagation: y, onDragStart: g } = this.getProps();
      if (d && !y && (this.openDragLock && this.openDragLock(), this.openDragLock = _0(d), !this.openDragLock))
        return;
      this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), Fe((x) => {
        let p = this.getAxisMotionValue(x).get() || 0;
        if (it.test(p)) {
          const { projection: h } = this.visualElement;
          if (h && h.layout) {
            const m = h.layout.layoutBox[x];
            m && (p = _e(m) * (parseFloat(p) / 100));
          }
        }
        this.originPoint[x] = p;
      }), g && $.postRender(() => g(c, f)), _l(this.visualElement, "transform");
      const { animationState: v } = this.visualElement;
      v && v.setActive("whileDrag", !0);
    }, o = (c, f) => {
      const { dragPropagation: d, dragDirectionLock: y, onDirectionLock: g, onDrag: v } = this.getProps();
      if (!d && !this.openDragLock)
        return;
      const { offset: x } = f;
      if (y && this.currentDirection === null) {
        this.currentDirection = $w(x), this.currentDirection !== null && g && g(this.currentDirection);
        return;
      }
      this.updateAxis("x", f.point, x), this.updateAxis("y", f.point, x), this.visualElement.render(), v && v(c, f);
    }, l = (c, f) => this.stop(c, f), a = () => Fe((c) => {
      var f;
      return this.getAnimationState(c) === "paused" && ((f = this.getAxisMotionValue(c).animation) === null || f === void 0 ? void 0 : f.play());
    }), { dragSnapToOrigin: u } = this.getProps();
    this.panSession = new mm(t, {
      onSessionStart: i,
      onStart: s,
      onMove: o,
      onSessionEnd: l,
      resumeAnimation: a
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: u,
      contextWindow: Pm(this.visualElement)
    });
  }
  stop(t, n) {
    const r = this.isDragging;
    if (this.cancel(), !r)
      return;
    const { velocity: i } = n;
    this.startAnimation(i);
    const { onDragEnd: s } = this.getProps();
    s && $.postRender(() => s(t, n));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: t, animationState: n } = this.visualElement;
    t && (t.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation: r } = this.getProps();
    !r && this.openDragLock && (this.openDragLock(), this.openDragLock = null), n && n.setActive("whileDrag", !1);
  }
  updateAxis(t, n, r) {
    const { drag: i } = this.getProps();
    if (!r || !_i(t, i, this.currentDirection))
      return;
    const s = this.getAxisMotionValue(t);
    let o = this.originPoint[t] + r[t];
    this.constraints && this.constraints[t] && (o = Rw(o, this.constraints[t], this.elastic[t])), s.set(o);
  }
  resolveConstraints() {
    var t;
    const { dragConstraints: n, dragElastic: r } = this.getProps(), i = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (t = this.visualElement.projection) === null || t === void 0 ? void 0 : t.layout, s = this.constraints;
    n && Mn(n) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : n && i ? this.constraints = Vw(i.layoutBox, n) : this.constraints = !1, this.elastic = Iw(r), s !== this.constraints && i && this.constraints && !this.hasMutatedConstraints && Fe((o) => {
      this.constraints !== !1 && this.getAxisMotionValue(o) && (this.constraints[o] = Nw(i.layoutBox[o], this.constraints[o]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: t, onMeasureDragConstraints: n } = this.getProps();
    if (!t || !Mn(t))
      return !1;
    const r = t.current, { projection: i } = this.visualElement;
    if (!i || !i.layout)
      return !1;
    const s = zw(r, i.root, this.visualElement.getTransformPagePoint());
    let o = Lw(i.layout.layoutBox, s);
    if (n) {
      const l = n(jw(o));
      this.hasMutatedConstraints = !!l, l && (o = wm(l));
    }
    return o;
  }
  startAnimation(t) {
    const { drag: n, dragMomentum: r, dragElastic: i, dragTransition: s, dragSnapToOrigin: o, onDragTransitionEnd: l } = this.getProps(), a = this.constraints || {}, u = Fe((c) => {
      if (!_i(c, n, this.currentDirection))
        return;
      let f = a && a[c] || {};
      o && (f = { min: 0, max: 0 });
      const d = i ? 200 : 1e6, y = i ? 40 : 1e7, g = {
        type: "inertia",
        velocity: r ? t[c] : 0,
        bounceStiffness: d,
        bounceDamping: y,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...s,
        ...f
      };
      return this.startAxisValueAnimation(c, g);
    });
    return Promise.all(u).then(l);
  }
  startAxisValueAnimation(t, n) {
    const r = this.getAxisMotionValue(t);
    return _l(this.visualElement, t), r.start(wu(t, r, 0, n, this.visualElement, !1));
  }
  stopAnimation() {
    Fe((t) => this.getAxisMotionValue(t).stop());
  }
  pauseAnimation() {
    Fe((t) => {
      var n;
      return (n = this.getAxisMotionValue(t).animation) === null || n === void 0 ? void 0 : n.pause();
    });
  }
  getAnimationState(t) {
    var n;
    return (n = this.getAxisMotionValue(t).animation) === null || n === void 0 ? void 0 : n.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(t) {
    const n = `_drag${t.toUpperCase()}`, r = this.visualElement.getProps(), i = r[n];
    return i || this.visualElement.getValue(t, (r.initial ? r.initial[t] : void 0) || 0);
  }
  snapToCursor(t) {
    Fe((n) => {
      const { drag: r } = this.getProps();
      if (!_i(n, r, this.currentDirection))
        return;
      const { projection: i } = this.visualElement, s = this.getAxisMotionValue(n);
      if (i && i.layout) {
        const { min: o, max: l } = i.layout.layoutBox[n];
        s.set(t[n] - Q(o, l, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: t, dragConstraints: n } = this.getProps(), { projection: r } = this.visualElement;
    if (!Mn(n) || !r || !this.constraints)
      return;
    this.stopAnimation();
    const i = { x: 0, y: 0 };
    Fe((o) => {
      const l = this.getAxisMotionValue(o);
      if (l && this.constraints !== !1) {
        const a = l.get();
        i[o] = _w({ min: a, max: a }, this.constraints[o]);
      }
    });
    const { transformTemplate: s } = this.visualElement.getProps();
    this.visualElement.current.style.transform = s ? s({}, "") : "none", r.root && r.root.updateScroll(), r.updateLayout(), this.resolveConstraints(), Fe((o) => {
      if (!_i(o, t, null))
        return;
      const l = this.getAxisMotionValue(o), { min: a, max: u } = this.constraints[o];
      l.set(Q(a, u, i[o]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    Bw.set(this.visualElement, this);
    const t = this.visualElement.current, n = Ar(t, "pointerdown", (a) => {
      const { drag: u, dragListener: c = !0 } = this.getProps();
      u && c && this.start(a);
    }), r = () => {
      const { dragConstraints: a } = this.getProps();
      Mn(a) && a.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: i } = this.visualElement, s = i.addEventListener("measure", r);
    i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), $.read(r);
    const o = qr(window, "resize", () => this.scalePositionWithinConstraints()), l = i.addEventListener("didUpdate", ({ delta: a, hasLayoutChanged: u }) => {
      this.isDragging && u && (Fe((c) => {
        const f = this.getAxisMotionValue(c);
        f && (this.originPoint[c] += a[c].translate, f.set(f.get() + a[c].translate));
      }), this.visualElement.render());
    });
    return () => {
      o(), n(), s(), l && l();
    };
  }
  getProps() {
    const t = this.visualElement.getProps(), { drag: n = !1, dragDirectionLock: r = !1, dragPropagation: i = !1, dragConstraints: s = !1, dragElastic: o = Ul, dragMomentum: l = !0 } = t;
    return {
      ...t,
      drag: n,
      dragDirectionLock: r,
      dragPropagation: i,
      dragConstraints: s,
      dragElastic: o,
      dragMomentum: l
    };
  }
}
function _i(e, t, n) {
  return (t === !0 || t === e) && (n === null || n === e);
}
function $w(e, t = 10) {
  let n = null;
  return Math.abs(e.y) > t ? n = "y" : Math.abs(e.x) > t && (n = "x"), n;
}
class Ww extends Kt {
  constructor(t) {
    super(t), this.removeGroupControls = Ve, this.removeListeners = Ve, this.controls = new Uw(t);
  }
  mount() {
    const { dragControls: t } = this.node.getProps();
    t && (this.removeGroupControls = t.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || Ve;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const xf = (e) => (t, n) => {
  e && $.postRender(() => e(t, n));
};
class Hw extends Kt {
  constructor() {
    super(...arguments), this.removePointerDownListener = Ve;
  }
  onPointerDown(t) {
    this.session = new mm(t, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: Pm(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: t, onPanStart: n, onPan: r, onPanEnd: i } = this.node.getProps();
    return {
      onSessionStart: xf(t),
      onStart: xf(n),
      onMove: r,
      onEnd: (s, o) => {
        delete this.session, i && $.postRender(() => i(s, o));
      }
    };
  }
  mount() {
    this.removePointerDownListener = Ar(this.node.current, "pointerdown", (t) => this.onPointerDown(t));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const Yi = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
};
function kf(e, t) {
  return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
}
const ur = {
  correct: (e, t) => {
    if (!t.target)
      return e;
    if (typeof e == "string")
      if (R.test(e))
        e = parseFloat(e);
      else
        return e;
    const n = kf(e, t.target.x), r = kf(e, t.target.y);
    return `${n}% ${r}%`;
  }
}, Kw = {
  correct: (e, { treeScale: t, projectionDelta: n }) => {
    const r = e, i = Ut.parse(e);
    if (i.length > 5)
      return r;
    const s = Ut.createTransformer(e), o = typeof i[0] != "number" ? 1 : 0, l = n.x.scale * t.x, a = n.y.scale * t.y;
    i[0 + o] /= l, i[1 + o] /= a;
    const u = Q(l, a, 0.5);
    return typeof i[2 + o] == "number" && (i[2 + o] /= u), typeof i[3 + o] == "number" && (i[3 + o] /= u), s(i);
  }
};
class Gw extends C.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: t, layoutGroup: n, switchLayoutGroup: r, layoutId: i } = this.props, { projection: s } = t;
    d0(Qw), s && (n.group && n.group.add(s), r && r.register && i && r.register(s), s.root.didUpdate(), s.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), s.setOptions({
      ...s.options,
      onExitComplete: () => this.safeToRemove()
    })), Yi.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(t) {
    const { layoutDependency: n, visualElement: r, drag: i, isPresent: s } = this.props, o = r.projection;
    return o && (o.isPresent = s, i || t.layoutDependency !== n || n === void 0 ? o.willUpdate() : this.safeToRemove(), t.isPresent !== s && (s ? o.promote() : o.relegate() || $.postRender(() => {
      const l = o.getStack();
      (!l || !l.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: t } = this.props.visualElement;
    t && (t.root.didUpdate(), Ya.postRender(() => {
      !t.currentAnimation && t.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: t, layoutGroup: n, switchLayoutGroup: r } = this.props, { projection: i } = t;
    i && (i.scheduleCheckAfterUnmount(), n && n.group && n.group.remove(i), r && r.deregister && r.deregister(i));
  }
  safeToRemove() {
    const { safeToRemove: t } = this.props;
    t && t();
  }
  render() {
    return null;
  }
}
function Tm(e) {
  const [t, n] = op(), r = C.useContext(Qr);
  return N.jsx(Gw, { ...e, layoutGroup: r, switchLayoutGroup: C.useContext(pp), isPresent: t, safeToRemove: n });
}
const Qw = {
  borderRadius: {
    ...ur,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: ur,
  borderTopRightRadius: ur,
  borderBottomLeftRadius: ur,
  borderBottomRightRadius: ur,
  boxShadow: Kw
};
function Yw(e, t, n) {
  const r = ge(e) ? e : Zr(e);
  return r.start(wu("", r, t, n)), r.animation;
}
function Xw(e) {
  return e instanceof SVGElement && e.tagName !== "svg";
}
const Zw = (e, t) => e.depth - t.depth;
class Jw {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(t) {
    au(this.children, t), this.isDirty = !0;
  }
  remove(t) {
    uu(this.children, t), this.isDirty = !0;
  }
  forEach(t) {
    this.isDirty && this.children.sort(Zw), this.isDirty = !1, this.children.forEach(t);
  }
}
function qw(e, t) {
  const n = st.now(), r = ({ timestamp: i }) => {
    const s = i - n;
    s >= t && (Bt(r), e(s - t));
  };
  return $.read(r, !0), () => Bt(r);
}
const Cm = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], bw = Cm.length, Pf = (e) => typeof e == "string" ? parseFloat(e) : e, Tf = (e) => typeof e == "number" || R.test(e);
function eS(e, t, n, r, i, s) {
  i ? (e.opacity = Q(
    0,
    // TODO Reinstate this if only child
    n.opacity !== void 0 ? n.opacity : 1,
    tS(r)
  ), e.opacityExit = Q(t.opacity !== void 0 ? t.opacity : 1, 0, nS(r))) : s && (e.opacity = Q(t.opacity !== void 0 ? t.opacity : 1, n.opacity !== void 0 ? n.opacity : 1, r));
  for (let o = 0; o < bw; o++) {
    const l = `border${Cm[o]}Radius`;
    let a = Cf(t, l), u = Cf(n, l);
    if (a === void 0 && u === void 0)
      continue;
    a || (a = 0), u || (u = 0), a === 0 || u === 0 || Tf(a) === Tf(u) ? (e[l] = Math.max(Q(Pf(a), Pf(u), r), 0), (it.test(u) || it.test(a)) && (e[l] += "%")) : e[l] = u;
  }
  (t.rotate || n.rotate) && (e.rotate = Q(t.rotate || 0, n.rotate || 0, r));
}
function Cf(e, t) {
  return e[t] !== void 0 ? e[t] : e.borderRadius;
}
const tS = /* @__PURE__ */ Em(0, 0.5, Hp), nS = /* @__PURE__ */ Em(0.5, 0.95, Ve);
function Em(e, t, n) {
  return (r) => r < e ? 0 : r > t ? 1 : n(/* @__PURE__ */ Qn(e, t, r));
}
function Ef(e, t) {
  e.min = t.min, e.max = t.max;
}
function je(e, t) {
  Ef(e.x, t.x), Ef(e.y, t.y);
}
function Af(e, t) {
  e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
function Df(e, t, n, r, i) {
  return e -= t, e = Es(e, 1 / n, r), i !== void 0 && (e = Es(e, 1 / i, r)), e;
}
function rS(e, t = 0, n = 1, r = 0.5, i, s = e, o = e) {
  if (it.test(t) && (t = parseFloat(t), t = Q(o.min, o.max, t / 100) - o.min), typeof t != "number")
    return;
  let l = Q(s.min, s.max, r);
  e === s && (l -= t), e.min = Df(e.min, t, n, l, i), e.max = Df(e.max, t, n, l, i);
}
function Mf(e, t, [n, r, i], s, o) {
  rS(e, t[n], t[r], t[i], t.scale, s, o);
}
const iS = ["x", "scaleX", "originX"], sS = ["y", "scaleY", "originY"];
function Rf(e, t, n, r) {
  Mf(e.x, t, iS, n ? n.x : void 0, r ? r.x : void 0), Mf(e.y, t, sS, n ? n.y : void 0, r ? r.y : void 0);
}
function Vf(e) {
  return e.translate === 0 && e.scale === 1;
}
function Am(e) {
  return Vf(e.x) && Vf(e.y);
}
function Lf(e, t) {
  return e.min === t.min && e.max === t.max;
}
function oS(e, t) {
  return Lf(e.x, t.x) && Lf(e.y, t.y);
}
function _f(e, t) {
  return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function Dm(e, t) {
  return _f(e.x, t.x) && _f(e.y, t.y);
}
function Nf(e) {
  return _e(e.x) / _e(e.y);
}
function If(e, t) {
  return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
class lS {
  constructor() {
    this.members = [];
  }
  add(t) {
    au(this.members, t), t.scheduleRender();
  }
  remove(t) {
    if (uu(this.members, t), t === this.prevLead && (this.prevLead = void 0), t === this.lead) {
      const n = this.members[this.members.length - 1];
      n && this.promote(n);
    }
  }
  relegate(t) {
    const n = this.members.findIndex((i) => t === i);
    if (n === 0)
      return !1;
    let r;
    for (let i = n; i >= 0; i--) {
      const s = this.members[i];
      if (s.isPresent !== !1) {
        r = s;
        break;
      }
    }
    return r ? (this.promote(r), !0) : !1;
  }
  promote(t, n) {
    const r = this.lead;
    if (t !== r && (this.prevLead = r, this.lead = t, t.show(), r)) {
      r.instance && r.scheduleRender(), t.scheduleRender(), t.resumeFrom = r, n && (t.resumeFrom.preserveOpacity = !0), r.snapshot && (t.snapshot = r.snapshot, t.snapshot.latestValues = r.animationValues || r.latestValues), t.root && t.root.isUpdating && (t.isLayoutDirty = !0);
      const { crossfade: i } = t.options;
      i === !1 && r.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((t) => {
      const { options: n, resumingFrom: r } = t;
      n.onExitComplete && n.onExitComplete(), r && r.options.onExitComplete && r.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((t) => {
      t.instance && t.scheduleRender(!1);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function aS(e, t, n) {
  let r = "";
  const i = e.x.translate / t.x, s = e.y.translate / t.y, o = (n == null ? void 0 : n.z) || 0;
  if ((i || s || o) && (r = `translate3d(${i}px, ${s}px, ${o}px) `), (t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `), n) {
    const { transformPerspective: u, rotate: c, rotateX: f, rotateY: d, skewX: y, skewY: g } = n;
    u && (r = `perspective(${u}px) ${r}`), c && (r += `rotate(${c}deg) `), f && (r += `rotateX(${f}deg) `), d && (r += `rotateY(${d}deg) `), y && (r += `skewX(${y}deg) `), g && (r += `skewY(${g}deg) `);
  }
  const l = e.x.scale * t.x, a = e.y.scale * t.y;
  return (l !== 1 || a !== 1) && (r += `scale(${l}, ${a})`), r || "none";
}
const bt = {
  type: "projectionFrame",
  totalNodes: 0,
  resolvedTargetDeltas: 0,
  recalculatedProjection: 0
}, yr = typeof window < "u" && window.MotionDebug !== void 0, _o = ["", "X", "Y", "Z"], uS = { visibility: "hidden" }, jf = 1e3;
let cS = 0;
function No(e, t, n, r) {
  const { latestValues: i } = t;
  i[e] && (n[e] = i[e], t.setStaticValue(e, 0), r && (r[e] = 0));
}
function Mm(e) {
  if (e.hasCheckedOptimisedAppear = !0, e.root === e)
    return;
  const { visualElement: t } = e.options;
  if (!t)
    return;
  const n = Fp(t);
  if (window.MotionHasOptimisedAnimation(n, "transform")) {
    const { layout: i, layoutId: s } = e.options;
    window.MotionCancelOptimisedAnimation(n, "transform", $, !(i || s));
  }
  const { parent: r } = e;
  r && !r.hasCheckedOptimisedAppear && Mm(r);
}
function Rm({ attachResizeListener: e, defaultParent: t, measureScroll: n, checkIsScrollRoot: r, resetTransform: i }) {
  return class {
    constructor(o = {}, l = t == null ? void 0 : t()) {
      this.id = cS++, this.animationId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, yr && (bt.totalNodes = bt.resolvedTargetDeltas = bt.recalculatedProjection = 0), this.nodes.forEach(hS), this.nodes.forEach(vS), this.nodes.forEach(wS), this.nodes.forEach(pS), yr && window.MotionDebug.record(bt);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = o, this.root = l ? l.root || l : this, this.path = l ? [...l.path, l] : [], this.parent = l, this.depth = l ? l.depth + 1 : 0;
      for (let a = 0; a < this.path.length; a++)
        this.path[a].shouldResetTransform = !0;
      this.root === this && (this.nodes = new Jw());
    }
    addEventListener(o, l) {
      return this.eventHandlers.has(o) || this.eventHandlers.set(o, new cu()), this.eventHandlers.get(o).add(l);
    }
    notifyListeners(o, ...l) {
      const a = this.eventHandlers.get(o);
      a && a.notify(...l);
    }
    hasListeners(o) {
      return this.eventHandlers.has(o);
    }
    /**
     * Lifecycles
     */
    mount(o, l = this.root.hasTreeAnimated) {
      if (this.instance)
        return;
      this.isSVG = Xw(o), this.instance = o;
      const { layoutId: a, layout: u, visualElement: c } = this.options;
      if (c && !c.current && c.mount(o), this.root.nodes.add(this), this.parent && this.parent.children.add(this), l && (u || a) && (this.isLayoutDirty = !0), e) {
        let f;
        const d = () => this.root.updateBlockedByResize = !1;
        e(o, () => {
          this.root.updateBlockedByResize = !0, f && f(), f = qw(d, 250), Yi.hasAnimatedSinceResize && (Yi.hasAnimatedSinceResize = !1, this.nodes.forEach(Of));
        });
      }
      a && this.root.registerSharedNode(a, this), this.options.animate !== !1 && c && (a || u) && this.addEventListener("didUpdate", ({ delta: f, hasLayoutChanged: d, hasRelativeTargetChanged: y, layout: g }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const v = this.options.transition || c.getDefaultTransition() || TS, { onLayoutAnimationStart: x, onLayoutAnimationComplete: p } = c.getProps(), h = !this.targetLayout || !Dm(this.targetLayout, g) || y, m = !d && y;
        if (this.options.layoutRoot || this.resumeFrom && this.resumeFrom.instance || m || d && (h || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0), this.setAnimationOrigin(f, m);
          const w = {
            ...iu(v, "layout"),
            onPlay: x,
            onComplete: p
          };
          (c.shouldReduceMotion || this.options.layoutRoot) && (w.delay = 0, w.type = !1), this.startAnimation(w);
        } else
          d || Of(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = g;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const o = this.getStack();
      o && o.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, Bt(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(SS), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: o } = this.options;
      return o && o.getProps().transformTemplate;
    }
    willUpdate(o = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Mm(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let c = 0; c < this.path.length; c++) {
        const f = this.path[c];
        f.shouldResetTransform = !0, f.updateScroll("snapshot"), f.options.layoutRoot && f.willUpdate(!1);
      }
      const { layoutId: l, layout: a } = this.options;
      if (l === void 0 && !a)
        return;
      const u = this.getTransformTemplate();
      this.prevTransformTemplateValue = u ? u(this.latestValues, "") : void 0, this.updateSnapshot(), o && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(Ff);
        return;
      }
      this.isUpdating || this.nodes.forEach(yS), this.isUpdating = !1, this.nodes.forEach(gS), this.nodes.forEach(fS), this.nodes.forEach(dS), this.clearAllSnapshots();
      const l = st.now();
      ue.delta = wt(0, 1e3 / 60, l - ue.timestamp), ue.timestamp = l, ue.isProcessing = !0, To.update.process(ue), To.preRender.process(ue), To.render.process(ue), ue.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, Ya.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(mS), this.sharedNodes.forEach(xS);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, $.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      $.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure());
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let a = 0; a < this.path.length; a++)
          this.path[a].updateScroll();
      const o = this.layout;
      this.layout = this.measure(!1), this.layoutCorrected = ee(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: l } = this.options;
      l && l.notify("LayoutMeasure", this.layout.layoutBox, o ? o.layoutBox : void 0);
    }
    updateScroll(o = "measure") {
      let l = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === o && (l = !1), l) {
        const a = r(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: o,
          isRoot: a,
          offset: n(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : a
        };
      }
    }
    resetTransform() {
      if (!i)
        return;
      const o = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, l = this.projectionDelta && !Am(this.projectionDelta), a = this.getTransformTemplate(), u = a ? a(this.latestValues, "") : void 0, c = u !== this.prevTransformTemplateValue;
      o && (l || qt(this.latestValues) || c) && (i(this.instance, u), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(o = !0) {
      const l = this.measurePageBox();
      let a = this.removeElementScroll(l);
      return o && (a = this.removeTransform(a)), CS(a), {
        animationId: this.root.animationId,
        measuredBox: l,
        layoutBox: a,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var o;
      const { visualElement: l } = this.options;
      if (!l)
        return ee();
      const a = l.measureViewportBox();
      if (!(((o = this.scroll) === null || o === void 0 ? void 0 : o.wasRoot) || this.path.some(ES))) {
        const { scroll: c } = this.root;
        c && (Ln(a.x, c.offset.x), Ln(a.y, c.offset.y));
      }
      return a;
    }
    removeElementScroll(o) {
      var l;
      const a = ee();
      if (je(a, o), !((l = this.scroll) === null || l === void 0) && l.wasRoot)
        return a;
      for (let u = 0; u < this.path.length; u++) {
        const c = this.path[u], { scroll: f, options: d } = c;
        c !== this.root && f && d.layoutScroll && (f.wasRoot && je(a, o), Ln(a.x, f.offset.x), Ln(a.y, f.offset.y));
      }
      return a;
    }
    applyTransform(o, l = !1) {
      const a = ee();
      je(a, o);
      for (let u = 0; u < this.path.length; u++) {
        const c = this.path[u];
        !l && c.options.layoutScroll && c.scroll && c !== c.root && _n(a, {
          x: -c.scroll.offset.x,
          y: -c.scroll.offset.y
        }), qt(c.latestValues) && _n(a, c.latestValues);
      }
      return qt(this.latestValues) && _n(a, this.latestValues), a;
    }
    removeTransform(o) {
      const l = ee();
      je(l, o);
      for (let a = 0; a < this.path.length; a++) {
        const u = this.path[a];
        if (!u.instance || !qt(u.latestValues))
          continue;
        $l(u.latestValues) && u.updateSnapshot();
        const c = ee(), f = u.measurePageBox();
        je(c, f), Rf(l, u.latestValues, u.snapshot ? u.snapshot.layoutBox : void 0, c);
      }
      return qt(this.latestValues) && Rf(l, this.latestValues), l;
    }
    setTargetDelta(o) {
      this.targetDelta = o, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(o) {
      this.options = {
        ...this.options,
        ...o,
        crossfade: o.crossfade !== void 0 ? o.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== ue.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(o = !1) {
      var l;
      const a = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = a.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = a.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = a.isSharedProjectionDirty);
      const u = !!this.resumingFrom || this !== a;
      if (!(o || u && this.isSharedProjectionDirty || this.isProjectionDirty || !((l = this.parent) === null || l === void 0) && l.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: f, layoutId: d } = this.options;
      if (!(!this.layout || !(f || d))) {
        if (this.resolvedRelativeTargetAt = ue.timestamp, !this.targetDelta && !this.relativeTarget) {
          const y = this.getClosestProjectingParent();
          y && y.layout && this.animationProgress !== 1 ? (this.relativeParent = y, this.forceRelativeParentToResolveTarget(), this.relativeTarget = ee(), this.relativeTargetOrigin = ee(), Mr(this.relativeTargetOrigin, this.layout.layoutBox, y.layout.layoutBox), je(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta)) {
          if (this.target || (this.target = ee(), this.targetWithTransforms = ee()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), Mw(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : je(this.target, this.layout.layoutBox), xm(this.target, this.targetDelta)) : je(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget) {
            this.attemptToResolveRelativeTarget = !1;
            const y = this.getClosestProjectingParent();
            y && !!y.resumingFrom == !!this.resumingFrom && !y.options.layoutScroll && y.target && this.animationProgress !== 1 ? (this.relativeParent = y, this.forceRelativeParentToResolveTarget(), this.relativeTarget = ee(), this.relativeTargetOrigin = ee(), Mr(this.relativeTargetOrigin, this.target, y.target), je(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
          }
          yr && bt.resolvedTargetDeltas++;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || $l(this.parent.latestValues) || Sm(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var o;
      const l = this.getLead(), a = !!this.resumingFrom || this !== l;
      let u = !0;
      if ((this.isProjectionDirty || !((o = this.parent) === null || o === void 0) && o.isProjectionDirty) && (u = !1), a && (this.isSharedProjectionDirty || this.isTransformDirty) && (u = !1), this.resolvedRelativeTargetAt === ue.timestamp && (u = !1), u)
        return;
      const { layout: c, layoutId: f } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(c || f))
        return;
      je(this.layoutCorrected, this.layout.layoutBox);
      const d = this.treeScale.x, y = this.treeScale.y;
      Ow(this.layoutCorrected, this.treeScale, this.path, a), l.layout && !l.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (l.target = l.layout.layoutBox, l.targetWithTransforms = ee());
      const { target: g } = l;
      if (!g) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (Af(this.prevProjectionDelta.x, this.projectionDelta.x), Af(this.prevProjectionDelta.y, this.projectionDelta.y)), Dr(this.projectionDelta, this.layoutCorrected, g, this.latestValues), (this.treeScale.x !== d || this.treeScale.y !== y || !If(this.projectionDelta.x, this.prevProjectionDelta.x) || !If(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", g)), yr && bt.recalculatedProjection++;
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(o = !0) {
      var l;
      if ((l = this.options.visualElement) === null || l === void 0 || l.scheduleRender(), o) {
        const a = this.getStack();
        a && a.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = Vn(), this.projectionDelta = Vn(), this.projectionDeltaWithTransform = Vn();
    }
    setAnimationOrigin(o, l = !1) {
      const a = this.snapshot, u = a ? a.latestValues : {}, c = { ...this.latestValues }, f = Vn();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !l;
      const d = ee(), y = a ? a.source : void 0, g = this.layout ? this.layout.source : void 0, v = y !== g, x = this.getStack(), p = !x || x.members.length <= 1, h = !!(v && !p && this.options.crossfade === !0 && !this.path.some(PS));
      this.animationProgress = 0;
      let m;
      this.mixTargetDelta = (w) => {
        const S = w / 1e3;
        zf(f.x, o.x, S), zf(f.y, o.y, S), this.setTargetDelta(f), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Mr(d, this.layout.layoutBox, this.relativeParent.layout.layoutBox), kS(this.relativeTarget, this.relativeTargetOrigin, d, S), m && oS(this.relativeTarget, m) && (this.isProjectionDirty = !1), m || (m = ee()), je(m, this.relativeTarget)), v && (this.animationValues = c, eS(c, u, this.latestValues, S, h, p)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = S;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(o) {
      this.notifyListeners("animationStart"), this.currentAnimation && this.currentAnimation.stop(), this.resumingFrom && this.resumingFrom.currentAnimation && this.resumingFrom.currentAnimation.stop(), this.pendingAnimation && (Bt(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = $.update(() => {
        Yi.hasAnimatedSinceResize = !0, this.currentAnimation = Yw(0, jf, {
          ...o,
          onUpdate: (l) => {
            this.mixTargetDelta(l), o.onUpdate && o.onUpdate(l);
          },
          onComplete: () => {
            o.onComplete && o.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const o = this.getStack();
      o && o.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(jf), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const o = this.getLead();
      let { targetWithTransforms: l, target: a, layout: u, latestValues: c } = o;
      if (!(!l || !a || !u)) {
        if (this !== o && this.layout && u && Vm(this.options.animationType, this.layout.layoutBox, u.layoutBox)) {
          a = this.target || ee();
          const f = _e(this.layout.layoutBox.x);
          a.x.min = o.target.x.min, a.x.max = a.x.min + f;
          const d = _e(this.layout.layoutBox.y);
          a.y.min = o.target.y.min, a.y.max = a.y.min + d;
        }
        je(l, a), _n(l, c), Dr(this.projectionDeltaWithTransform, this.layoutCorrected, l, c);
      }
    }
    registerSharedNode(o, l) {
      this.sharedNodes.has(o) || this.sharedNodes.set(o, new lS()), this.sharedNodes.get(o).add(l);
      const u = l.options.initialPromotionConfig;
      l.promote({
        transition: u ? u.transition : void 0,
        preserveFollowOpacity: u && u.shouldPreserveFollowOpacity ? u.shouldPreserveFollowOpacity(l) : void 0
      });
    }
    isLead() {
      const o = this.getStack();
      return o ? o.lead === this : !0;
    }
    getLead() {
      var o;
      const { layoutId: l } = this.options;
      return l ? ((o = this.getStack()) === null || o === void 0 ? void 0 : o.lead) || this : this;
    }
    getPrevLead() {
      var o;
      const { layoutId: l } = this.options;
      return l ? (o = this.getStack()) === null || o === void 0 ? void 0 : o.prevLead : void 0;
    }
    getStack() {
      const { layoutId: o } = this.options;
      if (o)
        return this.root.sharedNodes.get(o);
    }
    promote({ needsReset: o, transition: l, preserveFollowOpacity: a } = {}) {
      const u = this.getStack();
      u && u.promote(this, a), o && (this.projectionDelta = void 0, this.needsReset = !0), l && this.setOptions({ transition: l });
    }
    relegate() {
      const o = this.getStack();
      return o ? o.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: o } = this.options;
      if (!o)
        return;
      let l = !1;
      const { latestValues: a } = o;
      if ((a.z || a.rotate || a.rotateX || a.rotateY || a.rotateZ || a.skewX || a.skewY) && (l = !0), !l)
        return;
      const u = {};
      a.z && No("z", o, u, this.animationValues);
      for (let c = 0; c < _o.length; c++)
        No(`rotate${_o[c]}`, o, u, this.animationValues), No(`skew${_o[c]}`, o, u, this.animationValues);
      o.render();
      for (const c in u)
        o.setStaticValue(c, u[c]), this.animationValues && (this.animationValues[c] = u[c]);
      o.scheduleRender();
    }
    getProjectionStyles(o) {
      var l, a;
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible)
        return uS;
      const u = {
        visibility: ""
      }, c = this.getTransformTemplate();
      if (this.needsReset)
        return this.needsReset = !1, u.opacity = "", u.pointerEvents = Gi(o == null ? void 0 : o.pointerEvents) || "", u.transform = c ? c(this.latestValues, "") : "none", u;
      const f = this.getLead();
      if (!this.projectionDelta || !this.layout || !f.target) {
        const v = {};
        return this.options.layoutId && (v.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, v.pointerEvents = Gi(o == null ? void 0 : o.pointerEvents) || ""), this.hasProjected && !qt(this.latestValues) && (v.transform = c ? c({}, "") : "none", this.hasProjected = !1), v;
      }
      const d = f.animationValues || f.latestValues;
      this.applyTransformsToTarget(), u.transform = aS(this.projectionDeltaWithTransform, this.treeScale, d), c && (u.transform = c(d, u.transform));
      const { x: y, y: g } = this.projectionDelta;
      u.transformOrigin = `${y.origin * 100}% ${g.origin * 100}% 0`, f.animationValues ? u.opacity = f === this ? (a = (l = d.opacity) !== null && l !== void 0 ? l : this.latestValues.opacity) !== null && a !== void 0 ? a : 1 : this.preserveOpacity ? this.latestValues.opacity : d.opacityExit : u.opacity = f === this ? d.opacity !== void 0 ? d.opacity : "" : d.opacityExit !== void 0 ? d.opacityExit : 0;
      for (const v in xs) {
        if (d[v] === void 0)
          continue;
        const { correct: x, applyTo: p } = xs[v], h = u.transform === "none" ? d[v] : x(d[v], f);
        if (p) {
          const m = p.length;
          for (let w = 0; w < m; w++)
            u[p[w]] = h;
        } else
          u[v] = h;
      }
      return this.options.layoutId && (u.pointerEvents = f === this ? Gi(o == null ? void 0 : o.pointerEvents) || "" : "none"), u;
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((o) => {
        var l;
        return (l = o.currentAnimation) === null || l === void 0 ? void 0 : l.stop();
      }), this.root.nodes.forEach(Ff), this.root.sharedNodes.clear();
    }
  };
}
function fS(e) {
  e.updateLayout();
}
function dS(e) {
  var t;
  const n = ((t = e.resumeFrom) === null || t === void 0 ? void 0 : t.snapshot) || e.snapshot;
  if (e.isLead() && e.layout && n && e.hasListeners("didUpdate")) {
    const { layoutBox: r, measuredBox: i } = e.layout, { animationType: s } = e.options, o = n.source !== e.layout.source;
    s === "size" ? Fe((f) => {
      const d = o ? n.measuredBox[f] : n.layoutBox[f], y = _e(d);
      d.min = r[f].min, d.max = d.min + y;
    }) : Vm(s, n.layoutBox, r) && Fe((f) => {
      const d = o ? n.measuredBox[f] : n.layoutBox[f], y = _e(r[f]);
      d.max = d.min + y, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[f].max = e.relativeTarget[f].min + y);
    });
    const l = Vn();
    Dr(l, r, n.layoutBox);
    const a = Vn();
    o ? Dr(a, e.applyTransform(i, !0), n.measuredBox) : Dr(a, r, n.layoutBox);
    const u = !Am(l);
    let c = !1;
    if (!e.resumeFrom) {
      const f = e.getClosestProjectingParent();
      if (f && !f.resumeFrom) {
        const { snapshot: d, layout: y } = f;
        if (d && y) {
          const g = ee();
          Mr(g, n.layoutBox, d.layoutBox);
          const v = ee();
          Mr(v, r, y.layoutBox), Dm(g, v) || (c = !0), f.options.layoutRoot && (e.relativeTarget = v, e.relativeTargetOrigin = g, e.relativeParent = f);
        }
      }
    }
    e.notifyListeners("didUpdate", {
      layout: r,
      snapshot: n,
      delta: a,
      layoutDelta: l,
      hasLayoutChanged: u,
      hasRelativeTargetChanged: c
    });
  } else if (e.isLead()) {
    const { onExitComplete: r } = e.options;
    r && r();
  }
  e.options.transition = void 0;
}
function hS(e) {
  yr && bt.totalNodes++, e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty || (e.isSharedProjectionDirty = !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty)), e.isTransformDirty || (e.isTransformDirty = e.parent.isTransformDirty));
}
function pS(e) {
  e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function mS(e) {
  e.clearSnapshot();
}
function Ff(e) {
  e.clearMeasurements();
}
function yS(e) {
  e.isLayoutDirty = !1;
}
function gS(e) {
  const { visualElement: t } = e.options;
  t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function Of(e) {
  e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function vS(e) {
  e.resolveTargetDelta();
}
function wS(e) {
  e.calcProjection();
}
function SS(e) {
  e.resetSkewAndRotation();
}
function xS(e) {
  e.removeLeadSnapshot();
}
function zf(e, t, n) {
  e.translate = Q(t.translate, 0, n), e.scale = Q(t.scale, 1, n), e.origin = t.origin, e.originPoint = t.originPoint;
}
function Bf(e, t, n, r) {
  e.min = Q(t.min, n.min, r), e.max = Q(t.max, n.max, r);
}
function kS(e, t, n, r) {
  Bf(e.x, t.x, n.x, r), Bf(e.y, t.y, n.y, r);
}
function PS(e) {
  return e.animationValues && e.animationValues.opacityExit !== void 0;
}
const TS = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, Uf = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), $f = Uf("applewebkit/") && !Uf("chrome/") ? Math.round : Ve;
function Wf(e) {
  e.min = $f(e.min), e.max = $f(e.max);
}
function CS(e) {
  Wf(e.x), Wf(e.y);
}
function Vm(e, t, n) {
  return e === "position" || e === "preserve-aspect" && !Dw(Nf(t), Nf(n), 0.2);
}
function ES(e) {
  var t;
  return e !== e.root && ((t = e.scroll) === null || t === void 0 ? void 0 : t.wasRoot);
}
const AS = Rm({
  attachResizeListener: (e, t) => qr(e, "resize", t),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), Io = {
  current: void 0
}, Lm = Rm({
  measureScroll: (e) => ({
    x: e.scrollLeft,
    y: e.scrollTop
  }),
  defaultParent: () => {
    if (!Io.current) {
      const e = new AS({});
      e.mount(window), e.setOptions({ layoutScroll: !0 }), Io.current = e;
    }
    return Io.current;
  },
  resetTransform: (e, t) => {
    e.style.transform = t !== void 0 ? t : "none";
  },
  checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), DS = {
  pan: {
    Feature: Hw
  },
  drag: {
    Feature: Ww,
    ProjectionNode: Lm,
    MeasureLayout: Tm
  }
};
function Hf(e, t, n) {
  const { props: r } = e;
  e.animationState && r.whileHover && e.animationState.setActive("whileHover", n === "Start");
  const i = "onHover" + n, s = r[i];
  s && $.postRender(() => s(t, li(t)));
}
class MS extends Kt {
  mount() {
    const { current: t } = this.node;
    t && (this.unmount = D0(t, (n) => (Hf(this.node, n, "Start"), (r) => Hf(this.node, r, "End"))));
  }
  unmount() {
  }
}
class RS extends Kt {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let t = !1;
    try {
      t = this.node.current.matches(":focus-visible");
    } catch {
      t = !0;
    }
    !t || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = oi(qr(this.node.current, "focus", () => this.onFocus()), qr(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function Kf(e, t, n) {
  const { props: r } = e;
  e.animationState && r.whileTap && e.animationState.setActive("whileTap", n === "Start");
  const i = "onTap" + (n === "End" ? "" : n), s = r[i];
  s && $.postRender(() => s(t, li(t)));
}
class VS extends Kt {
  mount() {
    const { current: t } = this.node;
    t && (this.unmount = L0(t, (n) => (Kf(this.node, n, "Start"), (r, { success: i }) => Kf(this.node, r, i ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const Hl = /* @__PURE__ */ new WeakMap(), jo = /* @__PURE__ */ new WeakMap(), LS = (e) => {
  const t = Hl.get(e.target);
  t && t(e);
}, _S = (e) => {
  e.forEach(LS);
};
function NS({ root: e, ...t }) {
  const n = e || document;
  jo.has(n) || jo.set(n, {});
  const r = jo.get(n), i = JSON.stringify(t);
  return r[i] || (r[i] = new IntersectionObserver(_S, { root: e, ...t })), r[i];
}
function IS(e, t, n) {
  const r = NS(t);
  return Hl.set(e, n), r.observe(e), () => {
    Hl.delete(e), r.unobserve(e);
  };
}
const jS = {
  some: 0,
  all: 1
};
class FS extends Kt {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: t = {} } = this.node.getProps(), { root: n, margin: r, amount: i = "some", once: s } = t, o = {
      root: n ? n.current : void 0,
      rootMargin: r,
      threshold: typeof i == "number" ? i : jS[i]
    }, l = (a) => {
      const { isIntersecting: u } = a;
      if (this.isInView === u || (this.isInView = u, s && !u && this.hasEnteredView))
        return;
      u && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", u);
      const { onViewportEnter: c, onViewportLeave: f } = this.node.getProps(), d = u ? c : f;
      d && d(a);
    };
    return IS(this.node.current, o, l);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: t, prevProps: n } = this.node;
    ["amount", "margin", "root"].some(OS(t, n)) && this.startObserver();
  }
  unmount() {
  }
}
function OS({ viewport: e = {} }, { viewport: t = {} } = {}) {
  return (n) => e[n] !== t[n];
}
const zS = {
  inView: {
    Feature: FS
  },
  tap: {
    Feature: VS
  },
  focus: {
    Feature: RS
  },
  hover: {
    Feature: MS
  }
}, BS = {
  layout: {
    ProjectionNode: Lm,
    MeasureLayout: Tm
  }
}, Kl = { current: null }, _m = { current: !1 };
function US() {
  if (_m.current = !0, !!$a)
    if (window.matchMedia) {
      const e = window.matchMedia("(prefers-reduced-motion)"), t = () => Kl.current = e.matches;
      e.addListener(t), t();
    } else
      Kl.current = !1;
}
const $S = [...im, me, Ut], WS = (e) => $S.find(rm(e)), Gf = /* @__PURE__ */ new WeakMap();
function HS(e, t, n) {
  for (const r in t) {
    const i = t[r], s = n[r];
    if (ge(i))
      e.addValue(r, i);
    else if (ge(s))
      e.addValue(r, Zr(i, { owner: e }));
    else if (s !== i)
      if (e.hasValue(r)) {
        const o = e.getValue(r);
        o.liveStyle === !0 ? o.jump(i) : o.hasAnimated || o.set(i);
      } else {
        const o = e.getStaticValue(r);
        e.addValue(r, Zr(o !== void 0 ? o : i, { owner: e }));
      }
  }
  for (const r in n)
    t[r] === void 0 && e.removeValue(r);
  return t;
}
const Qf = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class KS {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(t, n, r) {
    return {};
  }
  constructor({ parent: t, props: n, presenceContext: r, reducedMotionConfig: i, blockInitialAnimation: s, visualState: o }, l = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = yu, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const y = st.now();
      this.renderScheduledAt < y && (this.renderScheduledAt = y, $.render(this.render, !1, !0));
    };
    const { latestValues: a, renderState: u, onUpdate: c } = o;
    this.onUpdate = c, this.latestValues = a, this.baseTarget = { ...a }, this.initialValues = n.initial ? { ...a } : {}, this.renderState = u, this.parent = t, this.props = n, this.presenceContext = r, this.depth = t ? t.depth + 1 : 0, this.reducedMotionConfig = i, this.options = l, this.blockInitialAnimation = !!s, this.isControllingVariants = Gs(n), this.isVariantNode = dp(n), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(t && t.current);
    const { willChange: f, ...d } = this.scrapeMotionValuesFromProps(n, {}, this);
    for (const y in d) {
      const g = d[y];
      a[y] !== void 0 && ge(g) && g.set(a[y], !1);
    }
  }
  mount(t) {
    this.current = t, Gf.set(t, this), this.projection && !this.projection.instance && this.projection.mount(t), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, r) => this.bindToMotionValue(r, n)), _m.current || US(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : Kl.current, this.parent && this.parent.children.add(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    Gf.delete(this.current), this.projection && this.projection.unmount(), Bt(this.notifyUpdate), Bt(this.render), this.valueSubscriptions.forEach((t) => t()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent && this.parent.children.delete(this);
    for (const t in this.events)
      this.events[t].clear();
    for (const t in this.features) {
      const n = this.features[t];
      n && (n.unmount(), n.isMounted = !1);
    }
    this.current = null;
  }
  bindToMotionValue(t, n) {
    this.valueSubscriptions.has(t) && this.valueSubscriptions.get(t)();
    const r = mn.has(t), i = n.on("change", (l) => {
      this.latestValues[t] = l, this.props.onUpdate && $.preRender(this.notifyUpdate), r && this.projection && (this.projection.isTransformDirty = !0);
    }), s = n.on("renderRequest", this.scheduleRender);
    let o;
    window.MotionCheckAppearSync && (o = window.MotionCheckAppearSync(this, t, n)), this.valueSubscriptions.set(t, () => {
      i(), s(), o && o(), n.owner && n.stop();
    });
  }
  sortNodePosition(t) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== t.type ? 0 : this.sortInstanceNodePosition(this.current, t.current);
  }
  updateFeatures() {
    let t = "animation";
    for (t in Yn) {
      const n = Yn[t];
      if (!n)
        continue;
      const { isEnabled: r, Feature: i } = n;
      if (!this.features[t] && i && r(this.props) && (this.features[t] = new i(this)), this.features[t]) {
        const s = this.features[t];
        s.isMounted ? s.update() : (s.mount(), s.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : ee();
  }
  getStaticValue(t) {
    return this.latestValues[t];
  }
  setStaticValue(t, n) {
    this.latestValues[t] = n;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(t, n) {
    (t.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = t, this.prevPresenceContext = this.presenceContext, this.presenceContext = n;
    for (let r = 0; r < Qf.length; r++) {
      const i = Qf[r];
      this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
      const s = "on" + i, o = t[s];
      o && (this.propEventSubscriptions[i] = this.on(i, o));
    }
    this.prevMotionValues = HS(this, this.scrapeMotionValuesFromProps(t, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue(), this.onUpdate && this.onUpdate(this);
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(t) {
    return this.props.variants ? this.props.variants[t] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(t) {
    const n = this.getClosestVariantNode();
    if (n)
      return n.variantChildren && n.variantChildren.add(t), () => n.variantChildren.delete(t);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(t, n) {
    const r = this.values.get(t);
    n !== r && (r && this.removeValue(t), this.bindToMotionValue(t, n), this.values.set(t, n), this.latestValues[t] = n.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(t) {
    this.values.delete(t);
    const n = this.valueSubscriptions.get(t);
    n && (n(), this.valueSubscriptions.delete(t)), delete this.latestValues[t], this.removeValueFromRenderState(t, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(t) {
    return this.values.has(t);
  }
  getValue(t, n) {
    if (this.props.values && this.props.values[t])
      return this.props.values[t];
    let r = this.values.get(t);
    return r === void 0 && n !== void 0 && (r = Zr(n === null ? void 0 : n, { owner: this }), this.addValue(t, r)), r;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(t, n) {
    var r;
    let i = this.latestValues[t] !== void 0 || !this.current ? this.latestValues[t] : (r = this.getBaseTargetFromProps(this.props, t)) !== null && r !== void 0 ? r : this.readValueFromInstance(this.current, t, this.options);
    return i != null && (typeof i == "string" && (tm(i) || Gp(i)) ? i = parseFloat(i) : !WS(i) && Ut.test(n) && (i = qp(t, n)), this.setBaseTarget(t, ge(i) ? i.get() : i)), ge(i) ? i.get() : i;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(t, n) {
    this.baseTarget[t] = n;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(t) {
    var n;
    const { initial: r } = this.props;
    let i;
    if (typeof r == "string" || typeof r == "object") {
      const o = Za(this.props, r, (n = this.presenceContext) === null || n === void 0 ? void 0 : n.custom);
      o && (i = o[t]);
    }
    if (r && i !== void 0)
      return i;
    const s = this.getBaseTargetFromProps(this.props, t);
    return s !== void 0 && !ge(s) ? s : this.initialValues[t] !== void 0 && i === void 0 ? void 0 : this.baseTarget[t];
  }
  on(t, n) {
    return this.events[t] || (this.events[t] = new cu()), this.events[t].add(n);
  }
  notify(t, ...n) {
    this.events[t] && this.events[t].notify(...n);
  }
}
class Nm extends KS {
  constructor() {
    super(...arguments), this.KeyframeResolver = sm;
  }
  sortInstanceNodePosition(t, n) {
    return t.compareDocumentPosition(n) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(t, n) {
    return t.style ? t.style[n] : void 0;
  }
  removeValueFromRenderState(t, { vars: n, style: r }) {
    delete n[t], delete r[t];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: t } = this.props;
    ge(t) && (this.childSubscription = t.on("change", (n) => {
      this.current && (this.current.textContent = `${n}`);
    }));
  }
}
function GS(e) {
  return window.getComputedStyle(e);
}
class QS extends Nm {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = xp;
  }
  readValueFromInstance(t, n) {
    if (mn.has(n)) {
      const r = mu(n);
      return r && r.default || 0;
    } else {
      const r = GS(t), i = (vp(n) ? r.getPropertyValue(n) : r[n]) || 0;
      return typeof i == "string" ? i.trim() : i;
    }
  }
  measureInstanceViewportBox(t, { transformPagePoint: n }) {
    return km(t, n);
  }
  build(t, n, r) {
    ba(t, n, r.transformTemplate);
  }
  scrapeMotionValuesFromProps(t, n, r) {
    return ru(t, n, r);
  }
}
class YS extends Nm {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = ee;
  }
  getBaseTargetFromProps(t, n) {
    return t[n];
  }
  readValueFromInstance(t, n) {
    if (mn.has(n)) {
      const r = mu(n);
      return r && r.default || 0;
    }
    return n = kp.has(n) ? n : Qa(n), t.getAttribute(n);
  }
  scrapeMotionValuesFromProps(t, n, r) {
    return Cp(t, n, r);
  }
  build(t, n, r) {
    eu(t, n, this.isSVGTag, r.transformTemplate);
  }
  renderInstance(t, n, r, i) {
    Pp(t, n, r, i);
  }
  mount(t) {
    this.isSVGTag = nu(t.tagName), super.mount(t);
  }
}
const XS = (e, t) => Xa(e) ? new YS(t) : new QS(t, {
  allowProjection: e !== C.Fragment
}), ZS = /* @__PURE__ */ x0({
  ...ww,
  ...zS,
  ...DS,
  ...BS
}, XS), lt = /* @__PURE__ */ jv(ZS), JS = "";
function qS(e) {
  return String(e || "common").toLowerCase();
}
async function Su(e, t = {}) {
  const n = await fetch(`${JS}${e}`, {
    headers: { "Content-Type": "application/json", ...t.headers || {} },
    ...t
  });
  if (!n.ok) {
    let r = `${t.method || "GET"} ${e} ${n.status}`;
    try {
      const i = await n.json();
      i && i.error && (r = i.error);
    } catch {
    }
    throw new Error(r);
  }
  return n.json();
}
async function bS() {
  return Su("/api/packs");
}
async function Xi() {
  return Su("/api/inventory");
}
async function ex(e, t) {
  return Su("/api/packs/open", {
    method: "POST",
    body: JSON.stringify({ packId: e, idempotencyKey: t })
  });
}
async function tx(e = []) {
  try {
    return { ok: !0, inventory: await Xi() };
  } catch (t) {
    return { ok: !1, error: String(t) };
  }
}
function nx() {
  return crypto.randomUUID && crypto.randomUUID() || ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, (e) => (e ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> e / 4).toString(16));
}
function rx(e = []) {
  if (e.length >= 5) return e.slice(0, 5);
  const t = e.slice(), n = 5 - t.length, r = [
    { r: "legendary", w: 1 },
    { r: "epic", w: 4 },
    { r: "rare", w: 10 },
    { r: "common", w: 85 }
  ], i = () => {
    const s = r.reduce((l, a) => l + a.w, 0);
    let o = Math.random() * s;
    for (const l of r)
      if ((o -= l.w) <= 0) return l.r;
    return "common";
  };
  for (let s = 0; s < n; s++) {
    const o = i();
    t.push({
      itemId: `placeholder-${s + 1}`,
      name: o === "legendary" ? "Mythic" : o.charAt(0).toUpperCase() + o.slice(1),
      rarity: o,
      imageUrl: "/assets/card-front.png",
      backImageUrl: "/assets/card-back.png",
      isDupe: !1
    });
  }
  return t;
}
function ix() {
  var q, He;
  const [e, t] = C.useState([]), [n, r] = C.useState({ balance: { COIN: 2e4 }, items: [] }), [i, s] = C.useState(""), [o, l] = C.useState(!1), [a, u] = C.useState(null), [c, f] = C.useState("idle"), [d, y] = C.useState([]), [g, v] = C.useState(!1), [x, p] = C.useState(null), [h, m] = C.useState(!1);
  C.useEffect(() => {
    (async () => {
      const [j, z] = await Promise.all([bS(), Xi()]);
      t(j.packs), r(z);
    })().catch((j) => s(String(j)));
  }, []);
  async function w(j) {
    s(""), l(!0), u(null), y([]), f("tearing");
    try {
      const z = await ex(j, nx()), de = rx(z.results || []).slice(0, 5);
      u({ ...z, results: de }), setTimeout(() => f("spilling"), 800), setTimeout(() => {
        f("stack"), l(!1);
      }, 1500), Xi().then(r).catch(() => {
      });
    } catch (z) {
      s(String(z.message || z)), l(!1), f("idle");
    }
  }
  const S = e[0], P = C.useMemo(() => {
    const j = (a == null ? void 0 : a.results) || [];
    for (let z = 0; z < j.length; z++)
      if (!d.includes(z)) return z;
    return -1;
  }, [a, d]), E = () => {
    P < 0 || y((j) => j.concat(P));
  }, k = !!(a != null && a.results) && d.length === a.results.length;
  C.useEffect(() => {
    c === "stack" && k && f("tray");
  }, [c, k]);
  const _ = C.useMemo(
    () => ((a == null ? void 0 : a.results) || []).filter((j, z) => d.includes(z)),
    [a, d]
  );
  async function M() {
    if (!(!k || !a || x)) {
      v(!0), m(!0), s("");
      try {
        await tx(_.map((j) => j.itemId)), Xi().then(r).catch(() => {
        }), setTimeout(() => {
          u(null), y([]), p(null), f("idle"), v(!1), m(!1);
        }, 550);
      } catch (j) {
        s(String(j.message || j)), v(!1), m(!1);
      }
    }
  }
  return /* @__PURE__ */ N.jsxs("div", { className: "widget widget--wide", children: [
    S && /* @__PURE__ */ N.jsxs("div", { className: "pack-info", style: { textAlign: "center", marginBottom: "1rem" }, children: [
      /* @__PURE__ */ N.jsxs("div", { className: "balance", children: [
        "Balance: ",
        n.balance.COIN,
        " Credits "
      ] }),
      /* @__PURE__ */ N.jsxs("div", { className: "price", children: [
        "Price: ",
        S.price.amount,
        " ",
        S.price.currency
      ] })
    ] }),
    /* @__PURE__ */ N.jsx(Vv, { id: "pack-stage", children: /* @__PURE__ */ N.jsx("div", { className: "card-stage", children: /* @__PURE__ */ N.jsx("div", { className: "stage-center", children: /* @__PURE__ */ N.jsxs("div", { className: "stage-anchor", children: [
      /* @__PURE__ */ N.jsxs(Vc, { mode: "sync", children: [
        (c === "idle" || c === "tearing" || c === "spilling") && /* @__PURE__ */ N.jsx(
          lt.div,
          {
            className: "pack-wrap",
            style: { pointerEvents: "none", zIndex: 10 },
            initial: { opacity: 0, y: 16, scale: 0.98 },
            animate: {
              opacity: 1,
              y: c === "tearing" ? -2 : 0,
              scale: c === "tearing" ? 1.01 : 1
            },
            exit: { opacity: 0, y: -40, scale: 0.98 },
            transition: { duration: 0.6 },
            children: /* @__PURE__ */ N.jsx(
              lt.img,
              {
                className: "pack-img",
                src: "/assets/pack.png",
                alt: "Sealed Pack",
                initial: !1,
                animate: { y: c === "spilling" ? -28 : 0, opacity: 1 },
                transition: { type: "spring", stiffness: 160, damping: 18 }
              }
            )
          },
          "pack"
        ),
        c === "stack" && ((q = a == null ? void 0 : a.results) == null ? void 0 : q.length) > 0 && /* @__PURE__ */ N.jsx(
          lt.div,
          {
            className: "card-stack",
            style: { zIndex: 20, position: "absolute", inset: 0 },
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            transition: { type: "spring", stiffness: 180, damping: 20 },
            children: a.results.map((j, z) => {
              const de = z === P, xt = d.includes(z), B = j.imageUrl || "/assets/card-front.png";
              return xt ? null : /* @__PURE__ */ N.jsxs(
                lt.div,
                {
                  className: "card-abs",
                  style: {
                    zIndex: 100 + (de ? 10 : 0),
                    pointerEvents: de ? "auto" : "none",
                    cursor: de ? "pointer" : "default"
                  },
                  onClick: de ? E : void 0,
                  initial: { scale: 0.92, opacity: 0, y: 10 },
                  animate: { scale: 1, opacity: 1, y: Math.min((a.results.length - z - 1) * 3, 18) },
                  exit: { opacity: 0, scale: 0.9 },
                  transition: { type: "spring", stiffness: 280, damping: 24 },
                  layoutId: `card-${j.itemId}-${z}`,
                  children: [
                    /* @__PURE__ */ N.jsx("img", { src: B, alt: j.name, className: "card-img", style: { pointerEvents: "none" } }),
                    /* @__PURE__ */ N.jsx("div", { className: `tag ${qS(j.rarity)} card-tag`, children: j.rarity })
                  ]
                },
                `${j.itemId}:${z}`
              );
            })
          },
          "stack"
        ),
        c === "tray" && ((He = a == null ? void 0 : a.results) == null ? void 0 : He.length) > 0 && /* @__PURE__ */ N.jsx(
          lt.div,
          {
            className: `tray-wrap ${x ? "has-preview" : ""}`,
            style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", zIndex: 30 },
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            transition: { type: "spring", stiffness: 200, damping: 22 },
            children: /* @__PURE__ */ N.jsx("div", { className: "tray-grid", children: d.map((j, z) => {
              var A;
              const de = a.results[j], xt = de.imageUrl || "/assets/card-front.png", B = ((A = x == null ? void 0 : x.item) == null ? void 0 : A.itemId) === de.itemId && (x == null ? void 0 : x.idx) === j;
              return /* @__PURE__ */ N.jsx(
                lt.button,
                {
                  className: `tray-card ${B ? "is-active" : ""}`,
                  whileHover: { y: x ? 0 : -2 },
                  transition: { type: "spring", stiffness: 260, damping: 22 },
                  "data-pos": z + 1,
                  layoutId: `card-${de.itemId}-${j}`,
                  onClick: () => p({ item: de, idx: j }),
                  style: {
                    opacity: x && !B ? 0.35 : 1,
                    filter: x && !B ? "saturate(0.7)" : "none",
                    pointerEvents: x && !B ? "none" : "auto",
                    transform: "none"
                  },
                  children: /* @__PURE__ */ N.jsx("img", { src: xt, alt: de.name })
                },
                `${de.itemId}:tray:${j}`
              );
            }) })
          },
          "tray"
        )
      ] }),
      /* @__PURE__ */ N.jsx(Vc, { children: x && /* @__PURE__ */ N.jsxs("div", { className: "stage-modal-layer", children: [
        /* @__PURE__ */ N.jsx(
          lt.div,
          {
            className: "stage-modal-backdrop",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            onClick: () => p(null)
          }
        ),
        /* @__PURE__ */ N.jsxs(
          lt.div,
          {
            className: "stage-modal-card",
            initial: { opacity: 0, scale: 0.92 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.96 },
            transition: { type: "spring", stiffness: 240, damping: 24 },
            onClick: () => p(null),
            children: [
              /* @__PURE__ */ N.jsx(
                lt.img,
                {
                  layoutId: `card-${x.item.itemId}-${x.idx}`,
                  src: x.item.imageUrl || "/assets/card-front.png",
                  alt: x.item.name,
                  className: "stage-modal-img"
                }
              ),
              /* @__PURE__ */ N.jsx("div", { className: "modal-meta" })
            ]
          }
        )
      ] }) })
    ] }) }) }) }),
    /* @__PURE__ */ N.jsxs("div", { className: "stage-actions", children: [
      c === "idle" && !o && !x && /* @__PURE__ */ N.jsx(
        "button",
        {
          className: "btn-primary",
          onClick: () => S && w(S.id),
          disabled: !S || o,
          children: S ? "Open Pack" : "Loading…"
        }
      ),
      c === "tray" && !x && !g && !h && /* @__PURE__ */ N.jsx(
        "button",
        {
          className: "btn-primary",
          onClick: M,
          disabled: g,
          title: "Add these 5 to your collection",
          children: g ? "Adding…" : "Add to collection"
        }
      )
    ] }),
    i && /* @__PURE__ */ N.jsx("div", { style: { color: "#f87171", marginTop: 8 }, children: i })
  ] });
}
const sx = dv(ix, Jm, Fo, {
  shadow: !1
});
customElements.define("packs-widget", sx);
