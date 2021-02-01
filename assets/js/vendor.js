var a, b;
"undefined" != typeof navigator && (a = window || {}, b = function(window) {
        "use strict";
        var svgNS = "http://www.w3.org/2000/svg",
            locationHref = "",
            initialDefaultFrame = -999999,
            subframeEnabled = !0,
            expressionsPlugin, isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
            cachedColors = {},
            bm_rounder = Math.round,
            bm_rnd, bm_pow = Math.pow,
            bm_sqrt = Math.sqrt,
            bm_abs = Math.abs,
            bm_floor = Math.floor,
            bm_max = Math.max,
            bm_min = Math.min,
            blitter = 10,
            BMMath = {};
        function ProjectInterface() {
            return {}
        }! function() {
            var t, e = ["abs", "acos", "acosh", "asin", "asinh", "atan", "atanh", "atan2", "ceil", "cbrt", "expm1", "clz32", "cos", "cosh", "exp", "floor", "fround", "hypot", "imul", "log", "log1p", "log2", "log10", "max", "min", "pow", "random", "round", "sign", "sin", "sinh", "sqrt", "tan", "tanh", "trunc", "E", "LN10", "LN2", "LOG10E", "LOG2E", "PI", "SQRT1_2", "SQRT2"],
                i = e.length;
            for (t = 0; t < i; t += 1) BMMath[e[t]] = Math[e[t]]
        }(), BMMath.random = Math.random, BMMath.abs = function(t) {
            if ("object" == typeof t && t.length) {
                var e, i = createSizedArray(t.length),
                    s = t.length;
                for (e = 0; e < s; e += 1) i[e] = Math.abs(t[e]);
                return i
            }
            return Math.abs(t)
        };
        var defaultCurveSegments = 150,
            degToRads = Math.PI / 180,
            roundCorner = .5519;
        function roundValues(t) {
            bm_rnd = t ? Math.round : function(t) {
                return t
            }
        }
        function styleDiv(t) {
            t.style.position = "absolute", t.style.top = 0, t.style.left = 0, t.style.display = "block", t.style.transformOrigin = t.style.webkitTransformOrigin = "0 0", t.style.backfaceVisibility = t.style.webkitBackfaceVisibility = "visible", t.style.transformStyle = t.style.webkitTransformStyle = t.style.mozTransformStyle = "preserve-3d"
        }
        function BMEnterFrameEvent(t, e, i, s) {
            this.type = t, this.currentTime = e, this.totalTime = i, this.direction = s < 0 ? -1 : 1
        }
        function BMCompleteEvent(t, e) {
            this.type = t, this.direction = e < 0 ? -1 : 1
        }
        function BMCompleteLoopEvent(t, e, i, s) {
            this.type = t, this.currentLoop = i, this.totalLoops = e, this.direction = s < 0 ? -1 : 1
        }
        function BMSegmentStartEvent(t, e, i) {
            this.type = t, this.firstFrame = e, this.totalFrames = i
        }
        function BMDestroyEvent(t, e) {
            this.type = t, this.target = e
        }
        function BMRenderFrameErrorEvent(t, e) {
            this.type = "renderFrameError", this.nativeError = t, this.currentTime = e
        }
        function BMConfigErrorEvent(t) {
            this.type = "configError", this.nativeError = t
        }
        function BMAnimationConfigErrorEvent(t, e) {
            this.type = t, this.nativeError = e, this.currentTime = currentTime
        }
        roundValues(!1);
        var createElementID = (I = 0, function() {
                return "__lottie_element_" + ++I
            }),
            I;
        function HSVtoRGB(t, e, i) {
            var s, r, a, n, o, l, h, p;
            switch (l = i * (1 - e), h = i * (1 - (o = 6 * t - (n = Math.floor(6 * t))) * e), p = i * (1 - (1 - o) * e), n % 6) {
                case 0:
                    s = i, r = p, a = l;
                    break;
                case 1:
                    s = h, r = i, a = l;
                    break;
                case 2:
                    s = l, r = i, a = p;
                    break;
                case 3:
                    s = l, r = h, a = i;
                    break;
                case 4:
                    s = p, r = l, a = i;
                    break;
                case 5:
                    s = i, r = l, a = h
            }
            return [s, r, a]
        }
        function RGBtoHSV(t, e, i) {
            var s, r = Math.max(t, e, i),
                a = Math.min(t, e, i),
                n = r - a,
                o = 0 === r ? 0 : n / r,
                l = r / 255;
            switch (r) {
                case a:
                    s = 0;
                    break;
                case t:
                    s = e - i + n * (e < i ? 6 : 0), s /= 6 * n;
                    break;
                case e:
                    s = i - t + 2 * n, s /= 6 * n;
                    break;
                case i:
                    s = t - e + 4 * n, s /= 6 * n
            }
            return [s, o, l]
        }
        function addSaturationToRGB(t, e) {
            var i = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
            return i[1] += e, 1 < i[1] ? i[1] = 1 : i[1] <= 0 && (i[1] = 0), HSVtoRGB(i[0], i[1], i[2])
        }
        function addBrightnessToRGB(t, e) {
            var i = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
            return i[2] += e, 1 < i[2] ? i[2] = 1 : i[2] < 0 && (i[2] = 0), HSVtoRGB(i[0], i[1], i[2])
        }
        function addHueToRGB(t, e) {
            var i = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
            return i[0] += e / 360, 1 < i[0] ? i[0] -= 1 : i[0] < 0 && (i[0] += 1), HSVtoRGB(i[0], i[1], i[2])
        }
        var rgbToHex = function() {
            var t, e, s = [];
            for (t = 0; t < 256; t += 1) e = t.toString(16), s[t] = 1 == e.length ? "0" + e : e;
            return function(t, e, i) {
                return t < 0 && (t = 0), e < 0 && (e = 0), i < 0 && (i = 0), "#" + s[t] + s[e] + s[i]
            }
        }();
        function BaseEvent() {}
        BaseEvent.prototype = {
            triggerEvent: function(t, e) {
                if (this._cbs[t])
                    for (var i = this._cbs[t].length, s = 0; s < i; s++) this._cbs[t][s](e)
            },
            addEventListener: function(t, e) {
                return this._cbs[t] || (this._cbs[t] = []), this._cbs[t].push(e),
                    function() {
                        this.removeEventListener(t, e)
                    }.bind(this)
            },
            removeEventListener: function(t, e) {
                if (e) {
                    if (this._cbs[t]) {
                        for (var i = 0, s = this._cbs[t].length; i < s;) this._cbs[t][i] === e && (this._cbs[t].splice(i, 1), i -= 1, s -= 1), i += 1;
                        this._cbs[t].length || (this._cbs[t] = null)
                    }
                } else this._cbs[t] = null
            }
        };
        var createTypedArray = "function" == typeof Uint8ClampedArray && "function" == typeof Float32Array ? function(t, e) {
            return "float32" === t ? new Float32Array(e) : "int16" === t ? new Int16Array(e) : "uint8c" === t ? new Uint8ClampedArray(e) : void 0
        } : function(t, e) {
            var i, s = 0,
                r = [];
            switch (t) {
                case "int16":
                case "uint8c":
                    i = 1;
                    break;
                default:
                    i = 1.1
            }
            for (s = 0; s < e; s += 1) r.push(i);
            return r
        };
        function createSizedArray(t) {
            return Array.apply(null, {
                length: t
            })
        }
        function createNS(t) {
            return document.createElementNS(svgNS, t)
        }
        function createTag(t) {
            return document.createElement(t)
        }
        function DynamicPropertyContainer() {}
        DynamicPropertyContainer.prototype = {
            addDynamicProperty: function(t) {
                -1 === this.dynamicProperties.indexOf(t) && (this.dynamicProperties.push(t), this.container.addDynamicProperty(this), this._isAnimated = !0)
            },
            iterateDynamicProperties: function() {
                this._mdf = !1;
                var t, e = this.dynamicProperties.length;
                for (t = 0; t < e; t += 1) this.dynamicProperties[t].getValue(), this.dynamicProperties[t]._mdf && (this._mdf = !0)
            },
            initDynamicPropertyContainer: function(t) {
                this.container = t, this.dynamicProperties = [], this._mdf = !1, this._isAnimated = !1
            }
        };
        var getBlendMode = (Ra = {
                0: "source-over",
                1: "multiply",
                2: "screen",
                3: "overlay",
                4: "darken",
                5: "lighten",
                6: "color-dodge",
                7: "color-burn",
                8: "hard-light",
                9: "soft-light",
                10: "difference",
                11: "exclusion",
                12: "hue",
                13: "saturation",
                14: "color",
                15: "luminosity"
            }, function(t) {
                return Ra[t] || ""
            }),
            Ra, Matrix = function() {
                var r = Math.cos,
                    a = Math.sin,
                    n = Math.tan,
                    s = Math.round;
                function t() {
                    return this.props[0] = 1, this.props[1] = 0, this.props[2] = 0, this.props[3] = 0, this.props[4] = 0, this.props[5] = 1, this.props[6] = 0, this.props[7] = 0, this.props[8] = 0, this.props[9] = 0, this.props[10] = 1, this.props[11] = 0, this.props[12] = 0, this.props[13] = 0, this.props[14] = 0, this.props[15] = 1, this
                }
                function e(t) {
                    if (0 === t) return this;
                    var e = r(t),
                        i = a(t);
                    return this._t(e, -i, 0, 0, i, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
                }
                function i(t) {
                    if (0 === t) return this;
                    var e = r(t),
                        i = a(t);
                    return this._t(1, 0, 0, 0, 0, e, -i, 0, 0, i, e, 0, 0, 0, 0, 1)
                }
                function o(t) {
                    if (0 === t) return this;
                    var e = r(t),
                        i = a(t);
                    return this._t(e, 0, i, 0, 0, 1, 0, 0, -i, 0, e, 0, 0, 0, 0, 1)
                }
                function l(t) {
                    if (0 === t) return this;
                    var e = r(t),
                        i = a(t);
                    return this._t(e, -i, 0, 0, i, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
                }
                function h(t, e) {
                    return this._t(1, e, t, 1, 0, 0)
                }
                function p(t, e) {
                    return this.shear(n(t), n(e))
                }
                function d(t, e) {
                    var i = r(e),
                        s = a(e);
                    return this._t(i, s, 0, 0, -s, i, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, n(t), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(i, -s, 0, 0, s, i, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
                }
                function c(t, e, i) {
                    return i || 0 === i || (i = 1), 1 === t && 1 === e && 1 === i ? this : this._t(t, 0, 0, 0, 0, e, 0, 0, 0, 0, i, 0, 0, 0, 0, 1)
                }
                function f(t, e, i, s, r, a, n, o, l, h, p, d, c, f, u, m) {
                    return this.props[0] = t, this.props[1] = e, this.props[2] = i, this.props[3] = s, this.props[4] = r, this.props[5] = a, this.props[6] = n, this.props[7] = o, this.props[8] = l, this.props[9] = h, this.props[10] = p, this.props[11] = d, this.props[12] = c, this.props[13] = f, this.props[14] = u, this.props[15] = m, this
                }
                function u(t, e, i) {
                    return i = i || 0, 0 !== t || 0 !== e || 0 !== i ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, i, 1) : this
                }
                function m(t, e, i, s, r, a, n, o, l, h, p, d, c, f, u, m) {
                    var g = this.props;
                    if (1 === t && 0 === e && 0 === i && 0 === s && 0 === r && 1 === a && 0 === n && 0 === o && 0 === l && 0 === h && 1 === p && 0 === d) return g[12] = g[12] * t + g[15] * c, g[13] = g[13] * a + g[15] * f, g[14] = g[14] * p + g[15] * u, g[15] = g[15] * m, this._identityCalculated = !1, this;
                    var v = g[0],
                        y = g[1],
                        _ = g[2],
                        b = g[3],
                        x = g[4],
                        T = g[5],
                        w = g[6],
                        E = g[7],
                        S = g[8],
                        P = g[9],
                        C = g[10],
                        k = g[11],
                        M = g[12],
                        A = g[13],
                        D = g[14],
                        I = g[15];
                    return g[0] = v * t + y * r + _ * l + b * c, g[1] = v * e + y * a + _ * h + b * f, g[2] = v * i + y * n + _ * p + b * u, g[3] = v * s + y * o + _ * d + b * m, g[4] = x * t + T * r + w * l + E * c, g[5] = x * e + T * a + w * h + E * f, g[6] = x * i + T * n + w * p + E * u, g[7] = x * s + T * o + w * d + E * m, g[8] = S * t + P * r + C * l + k * c, g[9] = S * e + P * a + C * h + k * f, g[10] = S * i + P * n + C * p + k * u, g[11] = S * s + P * o + C * d + k * m, g[12] = M * t + A * r + D * l + I * c, g[13] = M * e + A * a + D * h + I * f, g[14] = M * i + A * n + D * p + I * u, g[15] = M * s + A * o + D * d + I * m, this._identityCalculated = !1, this
                }
                function g() {
                    return this._identityCalculated || (this._identity = !(1 !== this.props[0] || 0 !== this.props[1] || 0 !== this.props[2] || 0 !== this.props[3] || 0 !== this.props[4] || 1 !== this.props[5] || 0 !== this.props[6] || 0 !== this.props[7] || 0 !== this.props[8] || 0 !== this.props[9] || 1 !== this.props[10] || 0 !== this.props[11] || 0 !== this.props[12] || 0 !== this.props[13] || 0 !== this.props[14] || 1 !== this.props[15]), this._identityCalculated = !0), this._identity
                }
                function v(t) {
                    for (var e = 0; e < 16;) {
                        if (t.props[e] !== this.props[e]) return !1;
                        e += 1
                    }
                    return !0
                }
                function y(t) {
                    var e;
                    for (e = 0; e < 16; e += 1) t.props[e] = this.props[e]
                }
                function _(t) {
                    var e;
                    for (e = 0; e < 16; e += 1) this.props[e] = t[e]
                }
                function b(t, e, i) {
                    return {
                        x: t * this.props[0] + e * this.props[4] + i * this.props[8] + this.props[12],
                        y: t * this.props[1] + e * this.props[5] + i * this.props[9] + this.props[13],
                        z: t * this.props[2] + e * this.props[6] + i * this.props[10] + this.props[14]
                    }
                }
                function x(t, e, i) {
                    return t * this.props[0] + e * this.props[4] + i * this.props[8] + this.props[12]
                }
                function T(t, e, i) {
                    return t * this.props[1] + e * this.props[5] + i * this.props[9] + this.props[13]
                }
                function w(t, e, i) {
                    return t * this.props[2] + e * this.props[6] + i * this.props[10] + this.props[14]
                }
                function E(t) {
                    var e = this.props[0] * this.props[5] - this.props[1] * this.props[4],
                        i = this.props[5] / e,
                        s = -this.props[1] / e,
                        r = -this.props[4] / e,
                        a = this.props[0] / e,
                        n = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / e,
                        o = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / e;
                    return [t[0] * i + t[1] * r + n, t[0] * s + t[1] * a + o, 0]
                }
                function S(t) {
                    var e, i = t.length,
                        s = [];
                    for (e = 0; e < i; e += 1) s[e] = E(t[e]);
                    return s
                }
                function P(t, e, i) {
                    var s = createTypedArray("float32", 6);
                    if (this.isIdentity()) s[0] = t[0], s[1] = t[1], s[2] = e[0], s[3] = e[1], s[4] = i[0], s[5] = i[1];
                    else {
                        var r = this.props[0],
                            a = this.props[1],
                            n = this.props[4],
                            o = this.props[5],
                            l = this.props[12],
                            h = this.props[13];
                        s[0] = t[0] * r + t[1] * n + l, s[1] = t[0] * a + t[1] * o + h, s[2] = e[0] * r + e[1] * n + l, s[3] = e[0] * a + e[1] * o + h, s[4] = i[0] * r + i[1] * n + l, s[5] = i[0] * a + i[1] * o + h
                    }
                    return s
                }
                function C(t, e, i) {
                    return this.isIdentity() ? [t, e, i] : [t * this.props[0] + e * this.props[4] + i * this.props[8] + this.props[12], t * this.props[1] + e * this.props[5] + i * this.props[9] + this.props[13], t * this.props[2] + e * this.props[6] + i * this.props[10] + this.props[14]]
                }
                function k(t, e) {
                    if (this.isIdentity()) return t + "," + e;
                    var i = this.props;
                    return Math.round(100 * (t * i[0] + e * i[4] + i[12])) / 100 + "," + Math.round(100 * (t * i[1] + e * i[5] + i[13])) / 100
                }
                function M() {
                    for (var t = 0, e = this.props, i = "matrix3d("; t < 16;) i += s(1e4 * e[t]) / 1e4, i += 15 === t ? ")" : ",", t += 1;
                    return i
                }
                function A(t) {
                    return t < 1e-6 && 0 < t || -1e-6 < t && t < 0 ? s(1e4 * t) / 1e4 : t
                }
                function D() {
                    var t = this.props;
                    return "matrix(" + A(t[0]) + "," + A(t[1]) + "," + A(t[4]) + "," + A(t[5]) + "," + A(t[12]) + "," + A(t[13]) + ")"
                }
                return function() {
                    this.reset = t, this.rotate = e, this.rotateX = i, this.rotateY = o, this.rotateZ = l, this.skew = p, this.skewFromAxis = d, this.shear = h, this.scale = c, this.setTransform = f, this.translate = u, this.transform = m, this.applyToPoint = b, this.applyToX = x, this.applyToY = T, this.applyToZ = w, this.applyToPointArray = C, this.applyToTriplePoints = P, this.applyToPointStringified = k, this.toCSS = M, this.to2dCSS = D, this.clone = y, this.cloneFromProps = _, this.equals = v, this.inversePoints = S, this.inversePoint = E, this._t = this.transform, this.isIdentity = g, this._identity = !0, this._identityCalculated = !1, this.props = createTypedArray("float32", 16), this.reset()
                }
            }();
        ! function(o, l) {
            var h = this,
                p = 256,
                d = l.pow(p, 6),
                c = l.pow(2, 52),
                f = 2 * c,
                u = p - 1;
            function m(t) {
                var e, i = t.length,
                    n = this,
                    s = 0,
                    r = n.i = n.j = 0,
                    a = n.S = [];
                for (i || (t = [i++]); s < p;) a[s] = s++;
                for (s = 0; s < p; s++) a[s] = a[r = u & r + t[s % i] + (e = a[s])], a[r] = e;
                n.g = function(t) {
                    for (var e, i = 0, s = n.i, r = n.j, a = n.S; t--;) e = a[s = u & s + 1], i = i * p + a[u & (a[s] = a[r = u & r + e]) + (a[r] = e)];
                    return n.i = s, n.j = r, i
                }
            }
            function g(t, e) {
                return e.i = t.i, e.j = t.j, e.S = t.S.slice(), e
            }
            function v(t, e) {
                for (var i, s = t + "", r = 0; r < s.length;) e[u & r] = u & (i ^= 19 * e[u & r]) + s.charCodeAt(r++);
                return y(e)
            }
            function y(t) {
                return String.fromCharCode.apply(0, t)
            }
            l.seedrandom = function(t, e, i) {
                var s = [],
                    r = v(function t(e, i) {
                        var s, r = [],
                            a = typeof e;
                        if (i && "object" == a)
                            for (s in e) try {
                                r.push(t(e[s], i - 1))
                            } catch (t) {}
                        return r.length ? r : "string" == a ? e : e + "\0"
                    }((e = !0 === e ? {
                        entropy: !0
                    } : e || {}).entropy ? [t, y(o)] : null === t ? function() {
                        try {
                            void 0;
                            var t = new Uint8Array(p);
                            return (h.crypto || h.msCrypto).getRandomValues(t), y(t)
                        } catch (t) {
                            var e = h.navigator,
                                i = e && e.plugins;
                            return [+new Date, h, i, h.screen, y(o)]
                        }
                    }() : t, 3), s),
                    a = new m(s),
                    n = function() {
                        for (var t = a.g(6), e = d, i = 0; t < c;) t = (t + i) * p, e *= p, i = a.g(1);
                        for (; f <= t;) t /= 2, e /= 2, i >>>= 1;
                        return (t + i) / e
                    };
                return n.int32 = function() {
                    return 0 | a.g(4)
                }, n.quick = function() {
                    return a.g(4) / 4294967296
                }, n.double = n, v(y(a.S), o), (e.pass || i || function(t, e, i, s) {
                    return s && (s.S && g(s, a), t.state = function() {
                        return g(a, {})
                    }), i ? (l.random = t, e) : t
                })(n, r, "global" in e ? e.global : this == l, e.state)
            }, v(l.random(), o)
        }([], BMMath);
        var BezierFactory = function() {
            var t = {
                    getBezierEasing: function(t, e, i, s, r) {
                        var a = r || ("bez_" + t + "_" + e + "_" + i + "_" + s).replace(/\./g, "p");
                        if (o[a]) return o[a];
                        var n = new l([t, e, i, s]);
                        return o[a] = n
                    }
                },
                o = {},
                h = 11,
                p = 1 / (h - 1),
                e = "function" == typeof Float32Array;
            function s(t, e) {
                return 1 - 3 * e + 3 * t
            }
            function r(t, e) {
                return 3 * e - 6 * t
            }
            function a(t) {
                return 3 * t
            }
            function d(t, e, i) {
                return ((s(e, i) * t + r(e, i)) * t + a(e)) * t
            }
            function c(t, e, i) {
                return 3 * s(e, i) * t * t + 2 * r(e, i) * t + a(e)
            }
            function l(t) {
                this._p = t, this._mSampleValues = e ? new Float32Array(h) : new Array(h), this._precomputed = !1, this.get = this.get.bind(this)
            }
            return l.prototype = {
                get: function(t) {
                    var e = this._p[0],
                        i = this._p[1],
                        s = this._p[2],
                        r = this._p[3];
                    return this._precomputed || this._precompute(), e === i && s === r ? t : 0 === t ? 0 : 1 === t ? 1 : d(this._getTForX(t), i, r)
                },
                _precompute: function() {
                    var t = this._p[0],
                        e = this._p[1],
                        i = this._p[2],
                        s = this._p[3];
                    this._precomputed = !0, t === e && i === s || this._calcSampleValues()
                },
                _calcSampleValues: function() {
                    for (var t = this._p[0], e = this._p[2], i = 0; i < h; ++i) this._mSampleValues[i] = d(i * p, t, e)
                },
                _getTForX: function(t) {
                    for (var e = this._p[0], i = this._p[2], s = this._mSampleValues, r = 0, a = 1, n = h - 1; a !== n && s[a] <= t; ++a) r += p;
                    var o = r + (t - s[--a]) / (s[a + 1] - s[a]) * p,
                        l = c(o, e, i);
                    return .001 <= l ? function(t, e, i, s) {
                        for (var r = 0; r < 4; ++r) {
                            var a = c(e, i, s);
                            if (0 === a) return e;
                            e -= (d(e, i, s) - t) / a
                        }
                        return e
                    }(t, o, e, i) : 0 === l ? o : function(t, e, i, s, r) {
                        for (var a, n, o = 0; 0 < (a = d(n = e + (i - e) / 2, s, r) - t) ? i = n : e = n, 1e-7 < Math.abs(a) && ++o < 10;);
                        return n
                    }(t, r, r + p, e, i)
                }
            }, t
        }();
        function extendPrototype(t, e) {
            var i, s, r = t.length;
            for (i = 0; i < r; i += 1)
                for (var a in s = t[i].prototype) s.hasOwnProperty(a) && (e.prototype[a] = s[a])
        }
        function getDescriptor(t, e) {
            return Object.getOwnPropertyDescriptor(t, e)
        }
        function createProxyFunction(t) {
            function e() {}
            return e.prototype = t, e
        }
        function bezFunction() {
            function g(t, e, i, s, r, a) {
                var n = t * s + e * r + i * a - r * s - a * t - i * e;
                return -.001 < n && n < .001
            }
            Math;
            var p = function(t, e, i, s) {
                var r, a, n, o, l, h, p = defaultCurveSegments,
                    d = 0,
                    c = [],
                    f = [],
                    u = bezier_length_pool.newElement();
                for (n = i.length, r = 0; r < p; r += 1) {
                    for (l = r / (p - 1), a = h = 0; a < n; a += 1) o = bm_pow(1 - l, 3) * t[a] + 3 * bm_pow(1 - l, 2) * l * i[a] + 3 * (1 - l) * bm_pow(l, 2) * s[a] + bm_pow(l, 3) * e[a], c[a] = o, null !== f[a] && (h += bm_pow(c[a] - f[a], 2)), f[a] = c[a];
                    h && (d += h = bm_sqrt(h)), u.percents[r] = l, u.lengths[r] = d
                }
                return u.addedLength = d, u
            };
            function v(t) {
                this.segmentLength = 0, this.points = new Array(t)
            }
            function y(t, e) {
                this.partialLength = t, this.point = e
            }
            var _, t = (_ = {}, function(t, e, i, s) {
                var r = (t[0] + "_" + t[1] + "_" + e[0] + "_" + e[1] + "_" + i[0] + "_" + i[1] + "_" + s[0] + "_" + s[1]).replace(/\./g, "p");
                if (!_[r]) {
                    var a, n, o, l, h, p, d, c = defaultCurveSegments,
                        f = 0,
                        u = null;
                    2 === t.length && (t[0] != e[0] || t[1] != e[1]) && g(t[0], t[1], e[0], e[1], t[0] + i[0], t[1] + i[1]) && g(t[0], t[1], e[0], e[1], e[0] + s[0], e[1] + s[1]) && (c = 2);
                    var m = new v(c);
                    for (o = i.length, a = 0; a < c; a += 1) {
                        for (d = createSizedArray(o), h = a / (c - 1), n = p = 0; n < o; n += 1) l = bm_pow(1 - h, 3) * t[n] + 3 * bm_pow(1 - h, 2) * h * (t[n] + i[n]) + 3 * (1 - h) * bm_pow(h, 2) * (e[n] + s[n]) + bm_pow(h, 3) * e[n], d[n] = l, null !== u && (p += bm_pow(d[n] - u[n], 2));
                        f += p = bm_sqrt(p), m.points[a] = new y(p, d), u = d
                    }
                    m.segmentLength = f, _[r] = m
                }
                return _[r]
            });
            function M(t, e) {
                var i = e.percents,
                    s = e.lengths,
                    r = i.length,
                    a = bm_floor((r - 1) * t),
                    n = t * e.addedLength,
                    o = 0;
                if (a === r - 1 || 0 === a || n === s[a]) return i[a];
                for (var l = s[a] > n ? -1 : 1, h = !0; h;)
                    if (s[a] <= n && s[a + 1] > n ? (o = (n - s[a]) / (s[a + 1] - s[a]), h = !1) : a += l, a < 0 || r - 1 <= a) {
                        if (a === r - 1) return i[a];
                        h = !1
                    }
                return i[a] + (i[a + 1] - i[a]) * o
            }
            var A = createTypedArray("float32", 8);
            return {
                getSegmentsLength: function(t) {
                    var e, i = segments_length_pool.newElement(),
                        s = t.c,
                        r = t.v,
                        a = t.o,
                        n = t.i,
                        o = t._length,
                        l = i.lengths,
                        h = 0;
                    for (e = 0; e < o - 1; e += 1) l[e] = p(r[e], r[e + 1], a[e], n[e + 1]), h += l[e].addedLength;
                    return s && o && (l[e] = p(r[e], r[0], a[e], n[0]), h += l[e].addedLength), i.totalLength = h, i
                },
                getNewSegment: function(t, e, i, s, r, a, n) {
                    var o, l = M(r = r < 0 ? 0 : 1 < r ? 1 : r, n),
                        h = M(a = 1 < a ? 1 : a, n),
                        p = t.length,
                        d = 1 - l,
                        c = 1 - h,
                        f = d * d * d,
                        u = l * d * d * 3,
                        m = l * l * d * 3,
                        g = l * l * l,
                        v = d * d * c,
                        y = l * d * c + d * l * c + d * d * h,
                        _ = l * l * c + d * l * h + l * d * h,
                        b = l * l * h,
                        x = d * c * c,
                        T = l * c * c + d * h * c + d * c * h,
                        w = l * h * c + d * h * h + l * c * h,
                        E = l * h * h,
                        S = c * c * c,
                        P = h * c * c + c * h * c + c * c * h,
                        C = h * h * c + c * h * h + h * c * h,
                        k = h * h * h;
                    for (o = 0; o < p; o += 1) A[4 * o] = Math.round(1e3 * (f * t[o] + u * i[o] + m * s[o] + g * e[o])) / 1e3, A[4 * o + 1] = Math.round(1e3 * (v * t[o] + y * i[o] + _ * s[o] + b * e[o])) / 1e3, A[4 * o + 2] = Math.round(1e3 * (x * t[o] + T * i[o] + w * s[o] + E * e[o])) / 1e3, A[4 * o + 3] = Math.round(1e3 * (S * t[o] + P * i[o] + C * s[o] + k * e[o])) / 1e3;
                    return A
                },
                getPointInSegment: function(t, e, i, s, r, a) {
                    var n = M(r, a),
                        o = 1 - n;
                    return [Math.round(1e3 * (o * o * o * t[0] + (n * o * o + o * n * o + o * o * n) * i[0] + (n * n * o + o * n * n + n * o * n) * s[0] + n * n * n * e[0])) / 1e3, Math.round(1e3 * (o * o * o * t[1] + (n * o * o + o * n * o + o * o * n) * i[1] + (n * n * o + o * n * n + n * o * n) * s[1] + n * n * n * e[1])) / 1e3]
                },
                buildBezierData: t,
                pointOnLine2D: g,
                pointOnLine3D: function(t, e, i, s, r, a, n, o, l) {
                    if (0 === i && 0 === a && 0 === l) return g(t, e, s, r, n, o);
                    var h, p = Math.sqrt(Math.pow(s - t, 2) + Math.pow(r - e, 2) + Math.pow(a - i, 2)),
                        d = Math.sqrt(Math.pow(n - t, 2) + Math.pow(o - e, 2) + Math.pow(l - i, 2)),
                        c = Math.sqrt(Math.pow(n - s, 2) + Math.pow(o - r, 2) + Math.pow(l - a, 2));
                    return -1e-4 < (h = d < p ? c < p ? p - d - c : c - d - p : d < c ? c - d - p : d - p - c) && h < 1e-4
                }
            }
        }! function() {
            for (var a = 0, t = ["ms", "moz", "webkit", "o"], e = 0; e < t.length && !window.requestAnimationFrame; ++e) window.requestAnimationFrame = window[t[e] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[t[e] + "CancelAnimationFrame"] || window[t[e] + "CancelRequestAnimationFrame"];
            window.requestAnimationFrame || (window.requestAnimationFrame = function(t, e) {
                var i = (new Date).getTime(),
                    s = Math.max(0, 16 - (i - a)),
                    r = setTimeout(function() {
                        t(i + s)
                    }, s);
                return a = i + s, r
            }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(t) {
                clearTimeout(t)
            })
        }();
        var bez = bezFunction();
        function dataFunctionManager() {
            function f(t, e) {
                for (var i = 0, s = e.length; i < s;) {
                    if (e[i].id === t) return e[i].layers.__used ? JSON.parse(JSON.stringify(e[i].layers)) : (e[i].layers.__used = !0, e[i].layers);
                    i += 1
                }
            }
            function u(t) {
                var e, i, s;
                for (e = t.length - 1; 0 <= e; e -= 1)
                    if ("sh" == t[e].ty)
                        if (t[e].ks.k.i) m(t[e].ks.k);
                        else
                            for (s = t[e].ks.k.length, i = 0; i < s; i += 1) t[e].ks.k[i].s && m(t[e].ks.k[i].s[0]), t[e].ks.k[i].e && m(t[e].ks.k[i].e[0]);
                else "gr" == t[e].ty && u(t[e].it)
            }
            function m(t) {
                var e, i = t.i.length;
                for (e = 0; e < i; e += 1) t.i[e][0] += t.v[e][0], t.i[e][1] += t.v[e][1], t.o[e][0] += t.v[e][0], t.o[e][1] += t.v[e][1]
            }
            function o(t, e) {
                var i = e ? e.split(".") : [100, 100, 100];
                return t[0] > i[0] || !(i[0] > t[0]) && (t[1] > i[1] || !(i[1] > t[1]) && (t[2] > i[2] || !(i[2] > t[2]) && void 0))
            }
            var l, i = function() {
                    var s = [4, 4, 14];
                    function r(t) {
                        var e, i, s, r = t.length;
                        for (e = 0; e < r; e += 1) 5 === t[e].ty && (s = (i = t[e]).t.d, i.t.d = {
                            k: [{
                                s: s,
                                t: 0
                            }]
                        })
                    }
                    return function(t) {
                        if (o(s, t.v) && (r(t.layers), t.assets)) {
                            var e, i = t.assets.length;
                            for (e = 0; e < i; e += 1) t.assets[e].layers && r(t.assets[e].layers)
                        }
                    }
                }(),
                s = (l = [4, 7, 99], function(t) {
                    if (t.chars && !o(l, t.v)) {
                        var e, i, s, r, a, n = t.chars.length;
                        for (e = 0; e < n; e += 1)
                            if (t.chars[e].data && t.chars[e].data.shapes)
                                for (s = (a = t.chars[e].data.shapes[0].it).length, i = 0; i < s; i += 1)(r = a[i].ks.k).__converted || (m(a[i].ks.k), r.__converted = !0)
                    }
                }),
                r = function() {
                    var s = [4, 1, 9];
                    function a(t) {
                        var e, i, s, r = t.length;
                        for (e = 0; e < r; e += 1)
                            if ("gr" === t[e].ty) a(t[e].it);
                            else if ("fl" === t[e].ty || "st" === t[e].ty)
                            if (t[e].c.k && t[e].c.k[0].i)
                                for (s = t[e].c.k.length, i = 0; i < s; i += 1) t[e].c.k[i].s && (t[e].c.k[i].s[0] /= 255, t[e].c.k[i].s[1] /= 255, t[e].c.k[i].s[2] /= 255, t[e].c.k[i].s[3] /= 255), t[e].c.k[i].e && (t[e].c.k[i].e[0] /= 255, t[e].c.k[i].e[1] /= 255, t[e].c.k[i].e[2] /= 255, t[e].c.k[i].e[3] /= 255);
                            else t[e].c.k[0] /= 255, t[e].c.k[1] /= 255, t[e].c.k[2] /= 255, t[e].c.k[3] /= 255
                    }
                    function r(t) {
                        var e, i = t.length;
                        for (e = 0; e < i; e += 1) 4 === t[e].ty && a(t[e].shapes)
                    }
                    return function(t) {
                        if (o(s, t.v) && (r(t.layers), t.assets)) {
                            var e, i = t.assets.length;
                            for (e = 0; e < i; e += 1) t.assets[e].layers && r(t.assets[e].layers)
                        }
                    }
                }(),
                a = function() {
                    var s = [4, 4, 18];
                    function h(t) {
                        var e, i, s;
                        for (e = t.length - 1; 0 <= e; e -= 1)
                            if ("sh" == t[e].ty)
                                if (t[e].ks.k.i) t[e].ks.k.c = t[e].closed;
                                else
                                    for (s = t[e].ks.k.length, i = 0; i < s; i += 1) t[e].ks.k[i].s && (t[e].ks.k[i].s[0].c = t[e].closed), t[e].ks.k[i].e && (t[e].ks.k[i].e[0].c = t[e].closed);
                        else "gr" == t[e].ty && h(t[e].it)
                    }
                    function r(t) {
                        var e, i, s, r, a, n, o = t.length;
                        for (i = 0; i < o; i += 1) {
                            if ((e = t[i]).hasMask) {
                                var l = e.masksProperties;
                                for (r = l.length, s = 0; s < r; s += 1)
                                    if (l[s].pt.k.i) l[s].pt.k.c = l[s].cl;
                                    else
                                        for (n = l[s].pt.k.length, a = 0; a < n; a += 1) l[s].pt.k[a].s && (l[s].pt.k[a].s[0].c = l[s].cl), l[s].pt.k[a].e && (l[s].pt.k[a].e[0].c = l[s].cl)
                            }
                            4 === e.ty && h(e.shapes)
                        }
                    }
                    return function(t) {
                        if (o(s, t.v) && (r(t.layers), t.assets)) {
                            var e, i = t.assets.length;
                            for (e = 0; e < i; e += 1) t.assets[e].layers && r(t.assets[e].layers)
                        }
                    }
                }(),
                t = {
                    completeData: function(t, e) {
                        t.__complete || (r(t), i(t), s(t), a(t), function t(e, i, s) {
                            var r, a, n, o, l, h, p, d = e.length;
                            for (a = 0; a < d; a += 1)
                                if ("ks" in (r = e[a]) && !r.completed) {
                                    if (r.completed = !0, r.tt && (e[a - 1].td = r.tt), r.hasMask) {
                                        var c = r.masksProperties;
                                        for (o = c.length, n = 0; n < o; n += 1)
                                            if (c[n].pt.k.i) m(c[n].pt.k);
                                            else
                                                for (h = c[n].pt.k.length, l = 0; l < h; l += 1) c[n].pt.k[l].s && m(c[n].pt.k[l].s[0]), c[n].pt.k[l].e && m(c[n].pt.k[l].e[0])
                                    }
                                    0 === r.ty ? (r.layers = f(r.refId, i), t(r.layers, i, s)) : 4 === r.ty ? u(r.shapes) : 5 == r.ty && (0 !== (p = r).t.a.length || "m" in p.t.p || (p.singleShape = !0))
                                }
                        }(t.layers, t.assets, e), t.__complete = !0)
                    }
                };
            return t
        }
        var dataManager = dataFunctionManager(),
            FontManager = function() {
                var a = {
                        w: 0,
                        size: 0,
                        shapes: []
                    },
                    t = [];
                function m(t, e) {
                    var i = createTag("span");
                    i.style.fontFamily = e;
                    var s = createTag("span");
                    s.innerHTML = "giItT1WQy@!-/#", i.style.position = "absolute", i.style.left = "-10000px", i.style.top = "-10000px", i.style.fontSize = "300px", i.style.fontVariant = "normal", i.style.fontStyle = "normal", i.style.fontWeight = "normal", i.style.letterSpacing = "0", i.appendChild(s), document.body.appendChild(i);
                    var r = s.offsetWidth;
                    return s.style.fontFamily = t + ", " + e, {
                        node: s,
                        w: r,
                        parent: i
                    }
                }
                t = t.concat([2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403]);
                var e = function() {
                    this.fonts = [], this.chars = null, this.typekitLoaded = 0, this.isLoaded = !1, this.initTime = Date.now()
                };
                return e.getCombinedCharacterCodes = function() {
                    return t
                }, e.prototype.addChars = function(t) {
                    if (t) {
                        this.chars || (this.chars = []);
                        var e, i, s, r = t.length,
                            a = this.chars.length;
                        for (e = 0; e < r; e += 1) {
                            for (i = 0, s = !1; i < a;) this.chars[i].style === t[e].style && this.chars[i].fFamily === t[e].fFamily && this.chars[i].ch === t[e].ch && (s = !0), i += 1;
                            s || (this.chars.push(t[e]), a += 1)
                        }
                    }
                }, e.prototype.addFonts = function(t, e) {
                    if (t) {
                        if (this.chars) return this.isLoaded = !0, void(this.fonts = t.list);
                        var i, s, r, a, n = t.list,
                            o = n.length,
                            l = o;
                        for (i = 0; i < o; i += 1) {
                            var h, p, d = !0;
                            if (n[i].loaded = !1, n[i].monoCase = m(n[i].fFamily, "monospace"), n[i].sansCase = m(n[i].fFamily, "sans-serif"), n[i].fPath) {
                                if ("p" === n[i].fOrigin || 3 === n[i].origin) {
                                    if (0 < (h = document.querySelectorAll('style[f-forigin="p"][f-family="' + n[i].fFamily + '"], style[f-origin="3"][f-family="' + n[i].fFamily + '"]')).length && (d = !1), d) {
                                        var c = createTag("style");
                                        c.setAttribute("f-forigin", n[i].fOrigin), c.setAttribute("f-origin", n[i].origin), c.setAttribute("f-family", n[i].fFamily), c.type = "text/css", c.innerHTML = "@font-face {font-family: " + n[i].fFamily + "; font-style: normal; src: url('" + n[i].fPath + "');}", e.appendChild(c)
                                    }
                                } else if ("g" === n[i].fOrigin || 1 === n[i].origin) {
                                    for (h = document.querySelectorAll('link[f-forigin="g"], link[f-origin="1"]'), p = 0; p < h.length; p++) - 1 !== h[p].href.indexOf(n[i].fPath) && (d = !1);
                                    if (d) {
                                        var f = createTag("link");
                                        f.setAttribute("f-forigin", n[i].fOrigin), f.setAttribute("f-origin", n[i].origin), f.type = "text/css", f.rel = "stylesheet", f.href = n[i].fPath, document.body.appendChild(f)
                                    }
                                } else if ("t" === n[i].fOrigin || 2 === n[i].origin) {
                                    for (h = document.querySelectorAll('script[f-forigin="t"], script[f-origin="2"]'), p = 0; p < h.length; p++) n[i].fPath === h[p].src && (d = !1);
                                    if (d) {
                                        var u = createTag("link");
                                        u.setAttribute("f-forigin", n[i].fOrigin), u.setAttribute("f-origin", n[i].origin), u.setAttribute("rel", "stylesheet"), u.setAttribute("href", n[i].fPath), e.appendChild(u)
                                    }
                                }
                            } else n[i].loaded = !0, l -= 1;
                            n[i].helper = (s = e, r = n[i], a = void 0, (a = createNS("text")).style.fontSize = "100px", a.setAttribute("font-family", r.fFamily), a.setAttribute("font-style", r.fStyle), a.setAttribute("font-weight", r.fWeight), a.textContent = "1", r.fClass ? (a.style.fontFamily = "inherit", a.setAttribute("class", r.fClass)) : a.style.fontFamily = r.fFamily, s.appendChild(a), createTag("canvas").getContext("2d").font = r.fWeight + " " + r.fStyle + " 100px " + r.fFamily, a), n[i].cache = {}, this.fonts.push(n[i])
                        }
                        0 === l ? this.isLoaded = !0 : setTimeout(this.checkLoadedFonts.bind(this), 100)
                    } else this.isLoaded = !0
                }, e.prototype.getCharData = function(t, e, i) {
                    for (var s = 0, r = this.chars.length; s < r;) {
                        if (this.chars[s].ch === t && this.chars[s].style === e && this.chars[s].fFamily === i) return this.chars[s];
                        s += 1
                    }
                    return ("string" == typeof t && 13 !== t.charCodeAt(0) || !t) && console && console.warn && console.warn("Missing character from exported characters list: ", t, e, i), a
                }, e.prototype.getFontByName = function(t) {
                    for (var e = 0, i = this.fonts.length; e < i;) {
                        if (this.fonts[e].fName === t) return this.fonts[e];
                        e += 1
                    }
                    return this.fonts[0]
                }, e.prototype.measureText = function(t, e, i) {
                    var s = this.getFontByName(e),
                        r = t.charCodeAt(0);
                    if (!s.cache[r + 1]) {
                        var a = s.helper;
                        if (" " === t) {
                            a.textContent = "|" + t + "|";
                            var n = a.getComputedTextLength();
                            a.textContent = "||";
                            var o = a.getComputedTextLength();
                            s.cache[r + 1] = (n - o) / 100
                        } else a.textContent = t, s.cache[r + 1] = a.getComputedTextLength() / 100
                    }
                    return s.cache[r + 1] * i
                }, e.prototype.checkLoadedFonts = function() {
                    var t, e, i, s = this.fonts.length,
                        r = s;
                    for (t = 0; t < s; t += 1) this.fonts[t].loaded ? r -= 1 : "n" === this.fonts[t].fOrigin || 0 === this.fonts[t].origin ? this.fonts[t].loaded = !0 : (e = this.fonts[t].monoCase.node, i = this.fonts[t].monoCase.w, e.offsetWidth !== i ? (r -= 1, this.fonts[t].loaded = !0) : (e = this.fonts[t].sansCase.node, i = this.fonts[t].sansCase.w, e.offsetWidth !== i && (r -= 1, this.fonts[t].loaded = !0)), this.fonts[t].loaded && (this.fonts[t].sansCase.parent.parentNode.removeChild(this.fonts[t].sansCase.parent), this.fonts[t].monoCase.parent.parentNode.removeChild(this.fonts[t].monoCase.parent)));
                    0 !== r && Date.now() - this.initTime < 5e3 ? setTimeout(this.checkLoadedFonts.bind(this), 20) : setTimeout(function() {
                        this.isLoaded = !0
                    }.bind(this), 0)
                }, e.prototype.loaded = function() {
                    return this.isLoaded
                }, e
            }(),
            PropertyFactory = function() {
                var d = initialDefaultFrame,
                    r = Math.abs;
                function c(t, e) {
                    var i, s = this.offsetTime;
                    "multidimensional" === this.propType && (i = createTypedArray("float32", this.pv.length));
                    for (var r, a, n, o, l, h, p, d, c = e.lastIndex, f = c, u = this.keyframes.length - 1, m = !0; m;) {
                        if (r = this.keyframes[f], a = this.keyframes[f + 1], f === u - 1 && t >= a.t - s) {
                            r.h && (r = a), c = 0;
                            break
                        }
                        if (a.t - s > t) {
                            c = f;
                            break
                        }
                        f < u - 1 ? f += 1 : (c = 0, m = !1)
                    }
                    var g, v, y, _, b, x, T, w, E, S, P, C, k, M, A, D, I, F, R, O, z, L, B, V, N, G, H, $ = a.t - s,
                        j = r.t - s;
                    if (r.to) {
                        r.bezierData || (r.bezierData = bez.buildBezierData(r.s, a.s || r.e, r.to, r.ti));
                        var X = r.bezierData;
                        if ($ <= t || t < j) {
                            var Y = $ <= t ? X.points.length - 1 : 0;
                            for (o = X.points[Y].point.length, n = 0; n < o; n += 1) i[n] = X.points[Y].point[n]
                        } else {
                            r.__fnct ? d = r.__fnct : (d = BezierFactory.getBezierEasing(r.o.x, r.o.y, r.i.x, r.i.y, r.n).get, r.__fnct = d), l = d((t - j) / ($ - j));
                            var q, W = X.segmentLength * l,
                                U = e.lastFrame < t && e._lastKeyframeIndex === f ? e._lastAddedLength : 0;
                            for (p = e.lastFrame < t && e._lastKeyframeIndex === f ? e._lastPoint : 0, m = !0, h = X.points.length; m;) {
                                if (U += X.points[p].partialLength, 0 === W || 0 === l || p === X.points.length - 1) {
                                    for (o = X.points[p].point.length, n = 0; n < o; n += 1) i[n] = X.points[p].point[n];
                                    break
                                }
                                if (U <= W && W < U + X.points[p + 1].partialLength) {
                                    for (q = (W - U) / X.points[p + 1].partialLength, o = X.points[p].point.length, n = 0; n < o; n += 1) i[n] = X.points[p].point[n] + (X.points[p + 1].point[n] - X.points[p].point[n]) * q;
                                    break
                                }
                                p < h - 1 ? p += 1 : m = !1
                            }
                            e._lastPoint = p, e._lastAddedLength = U - X.points[p].partialLength, e._lastKeyframeIndex = f
                        }
                    } else {
                        var K, Z, Q, J, tt;
                        if (u = r.s.length, g = a.s || r.e, this.sh && 1 !== r.h)
                            if ($ <= t) i[0] = g[0], i[1] = g[1], i[2] = g[2];
                            else if (t <= j) i[0] = r.s[0], i[1] = r.s[1], i[2] = r.s[2];
                        else {
                            var et = st(r.s),
                                it = st(g);
                            v = i, C = it, k = (t - j) / ($ - j), R = [], O = (P = et)[0], z = P[1], L = P[2], B = P[3], V = C[0], N = C[1], G = C[2], H = C[3], (A = O * V + z * N + L * G + B * H) < 0 && (A = -A, V = -V, N = -N, G = -G, H = -H), F = 1e-6 < 1 - A ? (M = Math.acos(A), D = Math.sin(M), I = Math.sin((1 - k) * M) / D, Math.sin(k * M) / D) : (I = 1 - k, k), R[0] = I * O + F * V, R[1] = I * z + F * N, R[2] = I * L + F * G, R[3] = I * B + F * H, _ = (y = R)[0], b = y[1], x = y[2], T = y[3], w = Math.atan2(2 * b * T - 2 * _ * x, 1 - 2 * b * b - 2 * x * x), E = Math.asin(2 * _ * b + 2 * x * T), S = Math.atan2(2 * _ * T - 2 * b * x, 1 - 2 * _ * _ - 2 * x * x), v[0] = w / degToRads, v[1] = E / degToRads, v[2] = S / degToRads
                        } else
                            for (f = 0; f < u; f += 1) 1 !== r.h && (l = $ <= t ? 1 : t < j ? 0 : (r.o.x.constructor === Array ? (r.__fnct || (r.__fnct = []), r.__fnct[f] ? d = r.__fnct[f] : (K = void 0 === r.o.x[f] ? r.o.x[0] : r.o.x[f], Z = void 0 === r.o.y[f] ? r.o.y[0] : r.o.y[f], Q = void 0 === r.i.x[f] ? r.i.x[0] : r.i.x[f], J = void 0 === r.i.y[f] ? r.i.y[0] : r.i.y[f], d = BezierFactory.getBezierEasing(K, Z, Q, J).get, r.__fnct[f] = d)) : r.__fnct ? d = r.__fnct : (K = r.o.x, Z = r.o.y, Q = r.i.x, J = r.i.y, d = BezierFactory.getBezierEasing(K, Z, Q, J).get, r.__fnct = d), d((t - j) / ($ - j)))), g = a.s || r.e, tt = 1 === r.h ? r.s[f] : r.s[f] + (g[f] - r.s[f]) * l, "multidimensional" === this.propType ? i[f] = tt : i = tt
                    }
                    return e.lastIndex = c, i
                }
                function st(t) {
                    var e = t[0] * degToRads,
                        i = t[1] * degToRads,
                        s = t[2] * degToRads,
                        r = Math.cos(e / 2),
                        a = Math.cos(i / 2),
                        n = Math.cos(s / 2),
                        o = Math.sin(e / 2),
                        l = Math.sin(i / 2),
                        h = Math.sin(s / 2);
                    return [o * l * n + r * a * h, o * a * n + r * l * h, r * l * n - o * a * h, r * a * n - o * l * h]
                }
                function f() {
                    var t = this.comp.renderedFrame - this.offsetTime,
                        e = this.keyframes[0].t - this.offsetTime,
                        i = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
                    if (!(t === this._caching.lastFrame || this._caching.lastFrame !== d && (this._caching.lastFrame >= i && i <= t || this._caching.lastFrame < e && t < e))) {
                        this._caching.lastFrame >= t && (this._caching._lastKeyframeIndex = -1, this._caching.lastIndex = 0);
                        var s = this.interpolateValue(t, this._caching);
                        this.pv = s
                    }
                    return this._caching.lastFrame = t, this.pv
                }
                function u(t) {
                    var e;
                    if ("unidimensional" === this.propType) e = t * this.mult, 1e-5 < r(this.v - e) && (this.v = e, this._mdf = !0);
                    else
                        for (var i = 0, s = this.v.length; i < s;) e = t[i] * this.mult, 1e-5 < r(this.v[i] - e) && (this.v[i] = e, this._mdf = !0), i += 1
                }
                function m() {
                    if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length)
                        if (this.lock) this.setVValue(this.pv);
                        else {
                            this.lock = !0, this._mdf = this._isFirstFrame;
                            var t, e = this.effectsSequence.length,
                                i = this.kf ? this.pv : this.data.k;
                            for (t = 0; t < e; t += 1) i = this.effectsSequence[t](i);
                            this.setVValue(i), this._isFirstFrame = !1, this.lock = !1, this.frameId = this.elem.globalData.frameId
                        }
                }
                function g(t) {
                    this.effectsSequence.push(t), this.container.addDynamicProperty(this)
                }
                function n(t, e, i, s) {
                    this.propType = "unidimensional", this.mult = i || 1, this.data = e, this.v = i ? e.k * i : e.k, this.pv = e.k, this._mdf = !1, this.elem = t, this.container = s, this.comp = t.comp, this.k = !1, this.kf = !1, this.vel = 0, this.effectsSequence = [], this._isFirstFrame = !0, this.getValue = m, this.setVValue = u, this.addEffect = g
                }
                function o(t, e, i, s) {
                    this.propType = "multidimensional", this.mult = i || 1, this.data = e, this._mdf = !1, this.elem = t, this.container = s, this.comp = t.comp, this.k = !1, this.kf = !1, this.frameId = -1;
                    var r, a = e.k.length;
                    for (this.v = createTypedArray("float32", a), this.pv = createTypedArray("float32", a), createTypedArray("float32", a), this.vel = createTypedArray("float32", a), r = 0; r < a; r += 1) this.v[r] = e.k[r] * this.mult, this.pv[r] = e.k[r];
                    this._isFirstFrame = !0, this.effectsSequence = [], this.getValue = m, this.setVValue = u, this.addEffect = g
                }
                function l(t, e, i, s) {
                    this.propType = "unidimensional", this.keyframes = e.k, this.offsetTime = t.data.st, this.frameId = -1, this._caching = {
                        lastFrame: d,
                        lastIndex: 0,
                        value: 0,
                        _lastKeyframeIndex: -1
                    }, this.k = !0, this.kf = !0, this.data = e, this.mult = i || 1, this.elem = t, this.container = s, this.comp = t.comp, this.v = d, this.pv = d, this._isFirstFrame = !0, this.getValue = m, this.setVValue = u, this.interpolateValue = c, this.effectsSequence = [f.bind(this)], this.addEffect = g
                }
                function h(t, e, i, s) {
                    this.propType = "multidimensional";
                    var r, a, n, o, l, h = e.k.length;
                    for (r = 0; r < h - 1; r += 1) e.k[r].to && e.k[r].s && e.k[r].e && (a = e.k[r].s, n = e.k[r].e, o = e.k[r].to, l = e.k[r].ti, (2 === a.length && (a[0] !== n[0] || a[1] !== n[1]) && bez.pointOnLine2D(a[0], a[1], n[0], n[1], a[0] + o[0], a[1] + o[1]) && bez.pointOnLine2D(a[0], a[1], n[0], n[1], n[0] + l[0], n[1] + l[1]) || 3 === a.length && (a[0] !== n[0] || a[1] !== n[1] || a[2] !== n[2]) && bez.pointOnLine3D(a[0], a[1], a[2], n[0], n[1], n[2], a[0] + o[0], a[1] + o[1], a[2] + o[2]) && bez.pointOnLine3D(a[0], a[1], a[2], n[0], n[1], n[2], n[0] + l[0], n[1] + l[1], n[2] + l[2])) && (e.k[r].to = null, e.k[r].ti = null), a[0] === n[0] && a[1] === n[1] && 0 === o[0] && 0 === o[1] && 0 === l[0] && 0 === l[1] && (2 === a.length || a[2] === n[2] && 0 === o[2] && 0 === l[2]) && (e.k[r].to = null, e.k[r].ti = null));
                    this.effectsSequence = [f.bind(this)], this.keyframes = e.k, this.offsetTime = t.data.st, this.k = !0, this.kf = !0, this._isFirstFrame = !0, this.mult = i || 1, this.elem = t, this.container = s, this.comp = t.comp, this.getValue = m, this.setVValue = u, this.interpolateValue = c, this.frameId = -1;
                    var p = e.k[0].s.length;
                    for (this.v = createTypedArray("float32", p), this.pv = createTypedArray("float32", p), r = 0; r < p; r += 1) this.v[r] = d, this.pv[r] = d;
                    this._caching = {
                        lastFrame: d,
                        lastIndex: 0,
                        value: createTypedArray("float32", p)
                    }, this.addEffect = g
                }
                return {
                    getProp: function(t, e, i, s, r) {
                        var a;
                        if (e.k.length)
                            if ("number" == typeof e.k[0]) a = new o(t, e, s, r);
                            else switch (i) {
                                case 0:
                                    a = new l(t, e, s, r);
                                    break;
                                case 1:
                                    a = new h(t, e, s, r)
                            } else a = new n(t, e, s, r);
                        return a.effectsSequence.length && r.addDynamicProperty(a), a
                    }
                }
            }(),
            TransformPropertyFactory = function() {
                function s(t, e, i) {
                    if (this.elem = t, this.frameId = -1, this.propType = "transform", this.data = e, this.v = new Matrix, this.pre = new Matrix, this.appliedTransformations = 0, this.initDynamicPropertyContainer(i || t), e.p && e.p.s ? (this.px = PropertyFactory.getProp(t, e.p.x, 0, 0, this), this.py = PropertyFactory.getProp(t, e.p.y, 0, 0, this), e.p.z && (this.pz = PropertyFactory.getProp(t, e.p.z, 0, 0, this))) : this.p = PropertyFactory.getProp(t, e.p || {
                            k: [0, 0, 0]
                        }, 1, 0, this), e.rx) {
                        if (this.rx = PropertyFactory.getProp(t, e.rx, 0, degToRads, this), this.ry = PropertyFactory.getProp(t, e.ry, 0, degToRads, this), this.rz = PropertyFactory.getProp(t, e.rz, 0, degToRads, this), e.or.k[0].ti) {
                            var s, r = e.or.k.length;
                            for (s = 0; s < r; s += 1) e.or.k[s].to = e.or.k[s].ti = null
                        }
                        this.or = PropertyFactory.getProp(t, e.or, 1, degToRads, this), this.or.sh = !0
                    } else this.r = PropertyFactory.getProp(t, e.r || {
                        k: 0
                    }, 0, degToRads, this);
                    e.sk && (this.sk = PropertyFactory.getProp(t, e.sk, 0, degToRads, this), this.sa = PropertyFactory.getProp(t, e.sa, 0, degToRads, this)), this.a = PropertyFactory.getProp(t, e.a || {
                        k: [0, 0, 0]
                    }, 1, 0, this), this.s = PropertyFactory.getProp(t, e.s || {
                        k: [100, 100, 100]
                    }, 1, .01, this), e.o ? this.o = PropertyFactory.getProp(t, e.o, 0, .01, t) : this.o = {
                        _mdf: !1,
                        v: 1
                    }, this._isDirty = !0, this.dynamicProperties.length || this.getValue(!0)
                }
                return s.prototype = {
                    applyToMatrix: function(t) {
                        var e = this._mdf;
                        this.iterateDynamicProperties(), this._mdf = this._mdf || e, this.a && t.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.s && t.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && t.skewFromAxis(-this.sk.v, this.sa.v), this.r ? t.rotate(-this.r.v) : t.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.data.p.s ? this.data.p.z ? t.translate(this.px.v, this.py.v, -this.pz.v) : t.translate(this.px.v, this.py.v, 0) : t.translate(this.p.v[0], this.p.v[1], -this.p.v[2])
                    },
                    getValue: function(t) {
                        if (this.elem.globalData.frameId !== this.frameId) {
                            if (this._isDirty && (this.precalculateMatrix(), this._isDirty = !1), this.iterateDynamicProperties(), this._mdf || t) {
                                if (this.v.cloneFromProps(this.pre.props), this.appliedTransformations < 1 && this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations < 2 && this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && this.appliedTransformations < 3 && this.v.skewFromAxis(-this.sk.v, this.sa.v), this.r && this.appliedTransformations < 4 ? this.v.rotate(-this.r.v) : !this.r && this.appliedTransformations < 4 && this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.autoOriented) {
                                    var e, i, s = this.elem.globalData.frameRate;
                                    if (this.p && this.p.keyframes && this.p.getValueAtTime) i = this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t ? (e = this.p.getValueAtTime((this.p.keyframes[0].t + .01) / s, 0), this.p.getValueAtTime(this.p.keyframes[0].t / s, 0)) : this.p._caching.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t ? (e = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / s, 0), this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - .01) / s, 0)) : (e = this.p.pv, this.p.getValueAtTime((this.p._caching.lastFrame + this.p.offsetTime - .01) / s, this.p.offsetTime));
                                    else if (this.px && this.px.keyframes && this.py.keyframes && this.px.getValueAtTime && this.py.getValueAtTime) {
                                        e = [], i = [];
                                        var r = this.px,
                                            a = this.py;
                                        r._caching.lastFrame + r.offsetTime <= r.keyframes[0].t ? (e[0] = r.getValueAtTime((r.keyframes[0].t + .01) / s, 0), e[1] = a.getValueAtTime((a.keyframes[0].t + .01) / s, 0), i[0] = r.getValueAtTime(r.keyframes[0].t / s, 0), i[1] = a.getValueAtTime(a.keyframes[0].t / s, 0)) : r._caching.lastFrame + r.offsetTime >= r.keyframes[r.keyframes.length - 1].t ? (e[0] = r.getValueAtTime(r.keyframes[r.keyframes.length - 1].t / s, 0), e[1] = a.getValueAtTime(a.keyframes[a.keyframes.length - 1].t / s, 0), i[0] = r.getValueAtTime((r.keyframes[r.keyframes.length - 1].t - .01) / s, 0), i[1] = a.getValueAtTime((a.keyframes[a.keyframes.length - 1].t - .01) / s, 0)) : (e = [r.pv, a.pv], i[0] = r.getValueAtTime((r._caching.lastFrame + r.offsetTime - .01) / s, r.offsetTime), i[1] = a.getValueAtTime((a._caching.lastFrame + a.offsetTime - .01) / s, a.offsetTime))
                                    }
                                    this.v.rotate(-Math.atan2(e[1] - i[1], e[0] - i[0]))
                                }
                                this.data.p && this.data.p.s ? this.data.p.z ? this.v.translate(this.px.v, this.py.v, -this.pz.v) : this.v.translate(this.px.v, this.py.v, 0) : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2])
                            }
                            this.frameId = this.elem.globalData.frameId
                        }
                    },
                    precalculateMatrix: function() {
                        if (!this.a.k && (this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations = 1, !this.s.effectsSequence.length)) {
                            if (this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.appliedTransformations = 2, this.sk) {
                                if (this.sk.effectsSequence.length || this.sa.effectsSequence.length) return;
                                this.pre.skewFromAxis(-this.sk.v, this.sa.v), this.appliedTransformations = 3
                            }
                            if (this.r) {
                                if (this.r.effectsSequence.length) return;
                                this.pre.rotate(-this.r.v), this.appliedTransformations = 4
                            } else this.rz.effectsSequence.length || this.ry.effectsSequence.length || this.rx.effectsSequence.length || this.or.effectsSequence.length || (this.pre.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.appliedTransformations = 4)
                        }
                    },
                    autoOrient: function() {}
                }, extendPrototype([DynamicPropertyContainer], s), s.prototype.addDynamicProperty = function(t) {
                    this._addDynamicProperty(t), this.elem.addDynamicProperty(t), this._isDirty = !0
                }, s.prototype._addDynamicProperty = DynamicPropertyContainer.prototype.addDynamicProperty, {
                    getTransformProperty: function(t, e, i) {
                        return new s(t, e, i)
                    }
                }
            }();
        function ShapePath() {
            this.c = !1, this._length = 0, this._maxLength = 8, this.v = createSizedArray(this._maxLength), this.o = createSizedArray(this._maxLength), this.i = createSizedArray(this._maxLength)
        }
        ShapePath.prototype.setPathData = function(t, e) {
            this.c = t, this.setLength(e);
            for (var i = 0; i < e;) this.v[i] = point_pool.newElement(), this.o[i] = point_pool.newElement(), this.i[i] = point_pool.newElement(), i += 1
        }, ShapePath.prototype.setLength = function(t) {
            for (; this._maxLength < t;) this.doubleArrayLength();
            this._length = t
        }, ShapePath.prototype.doubleArrayLength = function() {
            this.v = this.v.concat(createSizedArray(this._maxLength)), this.i = this.i.concat(createSizedArray(this._maxLength)), this.o = this.o.concat(createSizedArray(this._maxLength)), this._maxLength *= 2
        }, ShapePath.prototype.setXYAt = function(t, e, i, s, r) {
            var a;
            switch (this._length = Math.max(this._length, s + 1), this._length >= this._maxLength && this.doubleArrayLength(), i) {
                case "v":
                    a = this.v;
                    break;
                case "i":
                    a = this.i;
                    break;
                case "o":
                    a = this.o
            }(!a[s] || a[s] && !r) && (a[s] = point_pool.newElement()), a[s][0] = t, a[s][1] = e
        }, ShapePath.prototype.setTripleAt = function(t, e, i, s, r, a, n, o) {
            this.setXYAt(t, e, "v", n, o), this.setXYAt(i, s, "o", n, o), this.setXYAt(r, a, "i", n, o)
        }, ShapePath.prototype.reverse = function() {
            var t = new ShapePath;
            t.setPathData(this.c, this._length);
            var e = this.v,
                i = this.o,
                s = this.i,
                r = 0;
            this.c && (t.setTripleAt(e[0][0], e[0][1], s[0][0], s[0][1], i[0][0], i[0][1], 0, !1), r = 1);
            var a, n = this._length - 1,
                o = this._length;
            for (a = r; a < o; a += 1) t.setTripleAt(e[n][0], e[n][1], s[n][0], s[n][1], i[n][0], i[n][1], a, !1), n -= 1;
            return t
        };
        var ShapePropertyFactory = function() {
                var r = -999999;
                function t(t, e, i) {
                    var s, r, a, n, o, l, h, p, d, c = i.lastIndex,
                        f = this.keyframes;
                    if (t < f[0].t - this.offsetTime) s = f[0].s[0], a = !0, c = 0;
                    else if (t >= f[f.length - 1].t - this.offsetTime) s = f[f.length - 1].s ? f[f.length - 1].s[0] : f[f.length - 2].e[0], a = !0;
                    else {
                        for (var u, m, g = c, v = f.length - 1, y = !0; y && (u = f[g], !((m = f[g + 1]).t - this.offsetTime > t));) g < v - 1 ? g += 1 : y = !1;
                        if (c = g, !(a = 1 === u.h)) {
                            if (t >= m.t - this.offsetTime) p = 1;
                            else if (t < u.t - this.offsetTime) p = 0;
                            else {
                                var _;
                                u.__fnct ? _ = u.__fnct : (_ = BezierFactory.getBezierEasing(u.o.x, u.o.y, u.i.x, u.i.y).get, u.__fnct = _), p = _((t - (u.t - this.offsetTime)) / (m.t - this.offsetTime - (u.t - this.offsetTime)))
                            }
                            r = m.s ? m.s[0] : u.e[0]
                        }
                        s = u.s[0]
                    }
                    for (l = e._length, h = s.i[0].length, i.lastIndex = c, n = 0; n < l; n += 1)
                        for (o = 0; o < h; o += 1) d = a ? s.i[n][o] : s.i[n][o] + (r.i[n][o] - s.i[n][o]) * p, e.i[n][o] = d, d = a ? s.o[n][o] : s.o[n][o] + (r.o[n][o] - s.o[n][o]) * p, e.o[n][o] = d, d = a ? s.v[n][o] : s.v[n][o] + (r.v[n][o] - s.v[n][o]) * p, e.v[n][o] = d
                }
                function a() {
                    this.paths = this.localShapeCollection
                }
                function e(t) {
                    (function(t, e) {
                        if (t._length !== e._length || t.c !== e.c) return !1;
                        var i, s = t._length;
                        for (i = 0; i < s; i += 1)
                            if (t.v[i][0] !== e.v[i][0] || t.v[i][1] !== e.v[i][1] || t.o[i][0] !== e.o[i][0] || t.o[i][1] !== e.o[i][1] || t.i[i][0] !== e.i[i][0] || t.i[i][1] !== e.i[i][1]) return !1;
                        return !0
                    })(this.v, t) || (this.v = shape_pool.clone(t), this.localShapeCollection.releaseShapes(), this.localShapeCollection.addShape(this.v), this._mdf = !0, this.paths = this.localShapeCollection)
                }
                function i() {
                    if (this.elem.globalData.frameId !== this.frameId)
                        if (this.effectsSequence.length)
                            if (this.lock) this.setVValue(this.pv);
                            else {
                                this.lock = !0, this._mdf = !1;
                                var t, e = this.kf ? this.pv : this.data.ks ? this.data.ks.k : this.data.pt.k,
                                    i = this.effectsSequence.length;
                                for (t = 0; t < i; t += 1) e = this.effectsSequence[t](e);
                                this.setVValue(e), this.lock = !1, this.frameId = this.elem.globalData.frameId
                            }
                    else this._mdf = !1
                }
                function n(t, e, i) {
                    this.propType = "shape", this.comp = t.comp, this.container = t, this.elem = t, this.data = e, this.k = !1, this.kf = !1, this._mdf = !1;
                    var s = 3 === i ? e.pt.k : e.ks.k;
                    this.v = shape_pool.clone(s), this.pv = shape_pool.clone(this.v), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.reset = a, this.effectsSequence = []
                }
                function s(t) {
                    this.effectsSequence.push(t), this.container.addDynamicProperty(this)
                }
                function o(t, e, i) {
                    this.propType = "shape", this.comp = t.comp, this.elem = t, this.container = t, this.offsetTime = t.data.st, this.keyframes = 3 === i ? e.pt.k : e.ks.k, this.k = !0, this.kf = !0;
                    var s = this.keyframes[0].s[0].i.length;
                    this.keyframes[0].s[0].i[0].length, this.v = shape_pool.newElement(), this.v.setPathData(this.keyframes[0].s[0].c, s), this.pv = shape_pool.clone(this.v), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.lastFrame = r, this.reset = a, this._caching = {
                        lastFrame: r,
                        lastIndex: 0
                    }, this.effectsSequence = [function() {
                        var t = this.comp.renderedFrame - this.offsetTime,
                            e = this.keyframes[0].t - this.offsetTime,
                            i = this.keyframes[this.keyframes.length - 1].t - this.offsetTime,
                            s = this._caching.lastFrame;
                        return s !== r && (s < e && t < e || i < s && i < t) || (this._caching.lastIndex = s < t ? this._caching.lastIndex : 0, this.interpolateShape(t, this.pv, this._caching)), this._caching.lastFrame = t, this.pv
                    }.bind(this)]
                }
                n.prototype.interpolateShape = t, n.prototype.getValue = i, n.prototype.setVValue = e, n.prototype.addEffect = s, o.prototype.getValue = i, o.prototype.interpolateShape = t, o.prototype.setVValue = e, o.prototype.addEffect = s;
                var l = function() {
                        var n = roundCorner;
                        function t(t, e) {
                            this.v = shape_pool.newElement(), this.v.setPathData(!0, 4), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.paths = this.localShapeCollection, this.localShapeCollection.addShape(this.v), this.d = e.d, this.elem = t, this.comp = t.comp, this.frameId = -1, this.initDynamicPropertyContainer(t), this.p = PropertyFactory.getProp(t, e.p, 1, 0, this), this.s = PropertyFactory.getProp(t, e.s, 1, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertEllToPath())
                        }
                        return t.prototype = {
                            reset: a,
                            getValue: function() {
                                this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertEllToPath())
                            },
                            convertEllToPath: function() {
                                var t = this.p.v[0],
                                    e = this.p.v[1],
                                    i = this.s.v[0] / 2,
                                    s = this.s.v[1] / 2,
                                    r = 3 !== this.d,
                                    a = this.v;
                                a.v[0][0] = t, a.v[0][1] = e - s, a.v[1][0] = r ? t + i : t - i, a.v[1][1] = e, a.v[2][0] = t, a.v[2][1] = e + s, a.v[3][0] = r ? t - i : t + i, a.v[3][1] = e, a.i[0][0] = r ? t - i * n : t + i * n, a.i[0][1] = e - s, a.i[1][0] = r ? t + i : t - i, a.i[1][1] = e - s * n, a.i[2][0] = r ? t + i * n : t - i * n, a.i[2][1] = e + s, a.i[3][0] = r ? t - i : t + i, a.i[3][1] = e + s * n, a.o[0][0] = r ? t + i * n : t - i * n, a.o[0][1] = e - s, a.o[1][0] = r ? t + i : t - i, a.o[1][1] = e + s * n, a.o[2][0] = r ? t - i * n : t + i * n, a.o[2][1] = e + s, a.o[3][0] = r ? t - i : t + i, a.o[3][1] = e - s * n
                            }
                        }, extendPrototype([DynamicPropertyContainer], t), t
                    }(),
                    h = function() {
                        function t(t, e) {
                            this.v = shape_pool.newElement(), this.v.setPathData(!0, 0), this.elem = t, this.comp = t.comp, this.data = e, this.frameId = -1, this.d = e.d, this.initDynamicPropertyContainer(t), 1 === e.sy ? (this.ir = PropertyFactory.getProp(t, e.ir, 0, 0, this), this.is = PropertyFactory.getProp(t, e.is, 0, .01, this), this.convertToPath = this.convertStarToPath) : this.convertToPath = this.convertPolygonToPath, this.pt = PropertyFactory.getProp(t, e.pt, 0, 0, this), this.p = PropertyFactory.getProp(t, e.p, 1, 0, this), this.r = PropertyFactory.getProp(t, e.r, 0, degToRads, this), this.or = PropertyFactory.getProp(t, e.or, 0, 0, this), this.os = PropertyFactory.getProp(t, e.os, 0, .01, this), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertToPath())
                        }
                        return t.prototype = {
                            reset: a,
                            getValue: function() {
                                this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertToPath())
                            },
                            convertStarToPath: function() {
                                var t, e, i, s, r = 2 * Math.floor(this.pt.v),
                                    a = 2 * Math.PI / r,
                                    n = !0,
                                    o = this.or.v,
                                    l = this.ir.v,
                                    h = this.os.v,
                                    p = this.is.v,
                                    d = 2 * Math.PI * o / (2 * r),
                                    c = 2 * Math.PI * l / (2 * r),
                                    f = -Math.PI / 2;
                                f += this.r.v;
                                var u = 3 === this.data.d ? -1 : 1;
                                for (t = this.v._length = 0; t < r; t += 1) {
                                    i = n ? h : p, s = n ? d : c;
                                    var m = (e = n ? o : l) * Math.cos(f),
                                        g = e * Math.sin(f),
                                        v = 0 === m && 0 === g ? 0 : g / Math.sqrt(m * m + g * g),
                                        y = 0 === m && 0 === g ? 0 : -m / Math.sqrt(m * m + g * g);
                                    m += +this.p.v[0], g += +this.p.v[1], this.v.setTripleAt(m, g, m - v * s * i * u, g - y * s * i * u, m + v * s * i * u, g + y * s * i * u, t, !0), n = !n, f += a * u
                                }
                            },
                            convertPolygonToPath: function() {
                                var t, e = Math.floor(this.pt.v),
                                    i = 2 * Math.PI / e,
                                    s = this.or.v,
                                    r = this.os.v,
                                    a = 2 * Math.PI * s / (4 * e),
                                    n = -Math.PI / 2,
                                    o = 3 === this.data.d ? -1 : 1;
                                for (n += this.r.v, t = this.v._length = 0; t < e; t += 1) {
                                    var l = s * Math.cos(n),
                                        h = s * Math.sin(n),
                                        p = 0 === l && 0 === h ? 0 : h / Math.sqrt(l * l + h * h),
                                        d = 0 === l && 0 === h ? 0 : -l / Math.sqrt(l * l + h * h);
                                    l += +this.p.v[0], h += +this.p.v[1], this.v.setTripleAt(l, h, l - p * a * r * o, h - d * a * r * o, l + p * a * r * o, h + d * a * r * o, t, !0), n += i * o
                                }
                                this.paths.length = 0, this.paths[0] = this.v
                            }
                        }, extendPrototype([DynamicPropertyContainer], t), t
                    }(),
                    p = function() {
                        function t(t, e) {
                            this.v = shape_pool.newElement(), this.v.c = !0, this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.elem = t, this.comp = t.comp, this.frameId = -1, this.d = e.d, this.initDynamicPropertyContainer(t), this.p = PropertyFactory.getProp(t, e.p, 1, 0, this), this.s = PropertyFactory.getProp(t, e.s, 1, 0, this), this.r = PropertyFactory.getProp(t, e.r, 0, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertRectToPath())
                        }
                        return t.prototype = {
                            convertRectToPath: function() {
                                var t = this.p.v[0],
                                    e = this.p.v[1],
                                    i = this.s.v[0] / 2,
                                    s = this.s.v[1] / 2,
                                    r = bm_min(i, s, this.r.v),
                                    a = r * (1 - roundCorner);
                                this.v._length = 0, 2 === this.d || 1 === this.d ? (this.v.setTripleAt(t + i, e - s + r, t + i, e - s + r, t + i, e - s + a, 0, !0), this.v.setTripleAt(t + i, e + s - r, t + i, e + s - a, t + i, e + s - r, 1, !0), 0 !== r ? (this.v.setTripleAt(t + i - r, e + s, t + i - r, e + s, t + i - a, e + s, 2, !0), this.v.setTripleAt(t - i + r, e + s, t - i + a, e + s, t - i + r, e + s, 3, !0), this.v.setTripleAt(t - i, e + s - r, t - i, e + s - r, t - i, e + s - a, 4, !0), this.v.setTripleAt(t - i, e - s + r, t - i, e - s + a, t - i, e - s + r, 5, !0), this.v.setTripleAt(t - i + r, e - s, t - i + r, e - s, t - i + a, e - s, 6, !0), this.v.setTripleAt(t + i - r, e - s, t + i - a, e - s, t + i - r, e - s, 7, !0)) : (this.v.setTripleAt(t - i, e + s, t - i + a, e + s, t - i, e + s, 2), this.v.setTripleAt(t - i, e - s, t - i, e - s + a, t - i, e - s, 3))) : (this.v.setTripleAt(t + i, e - s + r, t + i, e - s + a, t + i, e - s + r, 0, !0), 0 !== r ? (this.v.setTripleAt(t + i - r, e - s, t + i - r, e - s, t + i - a, e - s, 1, !0), this.v.setTripleAt(t - i + r, e - s, t - i + a, e - s, t - i + r, e - s, 2, !0), this.v.setTripleAt(t - i, e - s + r, t - i, e - s + r, t - i, e - s + a, 3, !0), this.v.setTripleAt(t - i, e + s - r, t - i, e + s - a, t - i, e + s - r, 4, !0), this.v.setTripleAt(t - i + r, e + s, t - i + r, e + s, t - i + a, e + s, 5, !0), this.v.setTripleAt(t + i - r, e + s, t + i - a, e + s, t + i - r, e + s, 6, !0), this.v.setTripleAt(t + i, e + s - r, t + i, e + s - r, t + i, e + s - a, 7, !0)) : (this.v.setTripleAt(t - i, e - s, t - i + a, e - s, t - i, e - s, 1, !0), this.v.setTripleAt(t - i, e + s, t - i, e + s - a, t - i, e + s, 2, !0), this.v.setTripleAt(t + i, e + s, t + i - a, e + s, t + i, e + s, 3, !0)))
                            },
                            getValue: function(t) {
                                this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertRectToPath())
                            },
                            reset: a
                        }, extendPrototype([DynamicPropertyContainer], t), t
                    }();
                return {
                    getShapeProp: function(t, e, i) {
                        var s;
                        return 3 === i || 4 === i ? s = (3 === i ? e.pt : e.ks).k.length ? new o(t, e, i) : new n(t, e, i) : 5 === i ? s = new p(t, e) : 6 === i ? s = new l(t, e) : 7 === i && (s = new h(t, e)), s.k && t.addDynamicProperty(s), s
                    },
                    getConstructorFunction: function() {
                        return n
                    },
                    getKeyframedConstructorFunction: function() {
                        return o
                    }
                }
            }(),
            ShapeModifiers = (Yr = {}, Zr = {}, Yr.registerModifier = function(t, e) {
                Zr[t] || (Zr[t] = e)
            }, Yr.getModifier = function(t, e, i) {
                return new Zr[t](e, i)
            }, Yr),
            Yr, Zr;
        function ShapeModifier() {}
        function TrimModifier() {}
        function RoundCornersModifier() {}
        function RepeaterModifier() {}
        function ShapeCollection() {
            this._length = 0, this._maxLength = 4, this.shapes = createSizedArray(this._maxLength)
        }
        function DashProperty(t, e, i, s) {
            this.elem = t, this.frameId = -1, this.dataProps = createSizedArray(e.length), this.renderer = i, this.k = !1, this.dashStr = "", this.dashArray = createTypedArray("float32", e.length ? e.length - 1 : 0), this.dashoffset = createTypedArray("float32", 1), this.initDynamicPropertyContainer(s);
            var r, a, n = e.length || 0;
            for (r = 0; r < n; r += 1) a = PropertyFactory.getProp(t, e[r].v, 0, 0, this), this.k = a.k || this.k, this.dataProps[r] = {
                n: e[r].n,
                p: a
            };
            this.k || this.getValue(!0), this._isAnimated = this.k
        }
        function GradientProperty(t, e, i) {
            this.data = e, this.c = createTypedArray("uint8c", 4 * e.p);
            var s = e.k.k[0].s ? e.k.k[0].s.length - 4 * e.p : e.k.k.length - 4 * e.p;
            this.o = createTypedArray("float32", s), this._cmdf = !1, this._omdf = !1, this._collapsable = this.checkCollapsable(), this._hasOpacity = s, this.initDynamicPropertyContainer(i), this.prop = PropertyFactory.getProp(t, e.k, 1, null, this), this.k = this.prop.k, this.getValue(!0)
        }
        ShapeModifier.prototype.initModifierProperties = function() {}, ShapeModifier.prototype.addShapeToModifier = function() {}, ShapeModifier.prototype.addShape = function(t) {
            if (!this.closed) {
                t.sh.container.addDynamicProperty(t.sh);
                var e = {
                    shape: t.sh,
                    data: t,
                    localShapeCollection: shapeCollection_pool.newShapeCollection()
                };
                this.shapes.push(e), this.addShapeToModifier(e), this._isAnimated && t.setAsAnimated()
            }
        }, ShapeModifier.prototype.init = function(t, e) {
            this.shapes = [], this.elem = t, this.initDynamicPropertyContainer(t), this.initModifierProperties(t, e), this.frameId = initialDefaultFrame, this.closed = !1, this.k = !1, this.dynamicProperties.length ? this.k = !0 : this.getValue(!0)
        }, ShapeModifier.prototype.processKeys = function() {
            this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties())
        }, extendPrototype([DynamicPropertyContainer], ShapeModifier), extendPrototype([ShapeModifier], TrimModifier), TrimModifier.prototype.initModifierProperties = function(t, e) {
            this.s = PropertyFactory.getProp(t, e.s, 0, .01, this), this.e = PropertyFactory.getProp(t, e.e, 0, .01, this), this.o = PropertyFactory.getProp(t, e.o, 0, 0, this), this.sValue = 0, this.eValue = 0, this.getValue = this.processKeys, this.m = e.m, this._isAnimated = !!this.s.effectsSequence.length || !!this.e.effectsSequence.length || !!this.o.effectsSequence.length
        }, TrimModifier.prototype.addShapeToModifier = function(t) {
            t.pathsData = []
        }, TrimModifier.prototype.calculateShapeEdges = function(t, e, i, s, r) {
            var a = [];
            e <= 1 ? a.push({
                s: t,
                e: e
            }) : 1 <= t ? a.push({
                s: t - 1,
                e: e - 1
            }) : (a.push({
                s: t,
                e: 1
            }), a.push({
                s: 0,
                e: e - 1
            }));
            var n, o, l = [],
                h = a.length;
            for (n = 0; n < h; n += 1) {
                var p, d;
                (o = a[n]).e * r < s || o.s * r > s + i || (p = o.s * r <= s ? 0 : (o.s * r - s) / i, d = o.e * r >= s + i ? 1 : (o.e * r - s) / i, l.push([p, d]))
            }
            return l.length || l.push([0, 0]), l
        }, TrimModifier.prototype.releasePathsData = function(t) {
            var e, i = t.length;
            for (e = 0; e < i; e += 1) segments_length_pool.release(t[e]);
            return t.length = 0, t
        }, TrimModifier.prototype.processShapes = function(t) {
            var e, i, s;
            if (this._mdf || t) {
                var r = this.o.v % 360 / 360;
                if (r < 0 && (r += 1), e = (1 < this.s.v ? 1 : this.s.v < 0 ? 0 : this.s.v) + r, (i = (1 < this.e.v ? 1 : this.e.v < 0 ? 0 : this.e.v) + r) < e) {
                    var a = e;
                    e = i, i = a
                }
                e = 1e-4 * Math.round(1e4 * e), i = 1e-4 * Math.round(1e4 * i), this.sValue = e, this.eValue = i
            } else e = this.sValue, i = this.eValue;
            var n, o, l, h, p, d, c = this.shapes.length,
                f = 0;
            if (i === e)
                for (n = 0; n < c; n += 1) this.shapes[n].localShapeCollection.releaseShapes(), this.shapes[n].shape._mdf = !0, this.shapes[n].shape.paths = this.shapes[n].localShapeCollection;
            else if (1 === i && 0 === e || 0 === i && 1 === e) {
                if (this._mdf)
                    for (n = 0; n < c; n += 1) this.shapes[n].pathsData.length = 0, this.shapes[n].shape._mdf = !0
            } else {
                var u, m, g = [];
                for (n = 0; n < c; n += 1)
                    if ((u = this.shapes[n]).shape._mdf || this._mdf || t || 2 === this.m) {
                        if (l = (s = u.shape.paths)._length, d = 0, !u.shape._mdf && u.pathsData.length) d = u.totalShapeLength;
                        else {
                            for (h = this.releasePathsData(u.pathsData), o = 0; o < l; o += 1) p = bez.getSegmentsLength(s.shapes[o]), h.push(p), d += p.totalLength;
                            u.totalShapeLength = d, u.pathsData = h
                        }
                        f += d, u.shape._mdf = !0
                    } else u.shape.paths = u.localShapeCollection;
                var v, y = e,
                    _ = i,
                    b = 0;
                for (n = c - 1; 0 <= n; n -= 1)
                    if ((u = this.shapes[n]).shape._mdf) {
                        for ((m = u.localShapeCollection).releaseShapes(), 2 === this.m && 1 < c ? (v = this.calculateShapeEdges(e, i, u.totalShapeLength, b, f), b += u.totalShapeLength) : v = [
                                [y, _]
                            ], l = v.length, o = 0; o < l; o += 1) {
                            y = v[o][0], _ = v[o][1], g.length = 0, _ <= 1 ? g.push({
                                s: u.totalShapeLength * y,
                                e: u.totalShapeLength * _
                            }) : 1 <= y ? g.push({
                                s: u.totalShapeLength * (y - 1),
                                e: u.totalShapeLength * (_ - 1)
                            }) : (g.push({
                                s: u.totalShapeLength * y,
                                e: u.totalShapeLength
                            }), g.push({
                                s: 0,
                                e: u.totalShapeLength * (_ - 1)
                            }));
                            var x = this.addShapes(u, g[0]);
                            if (g[0].s !== g[0].e) {
                                if (1 < g.length)
                                    if (u.shape.paths.shapes[u.shape.paths._length - 1].c) {
                                        var T = x.pop();
                                        this.addPaths(x, m), x = this.addShapes(u, g[1], T)
                                    } else this.addPaths(x, m), x = this.addShapes(u, g[1]);
                                this.addPaths(x, m)
                            }
                        }
                        u.shape.paths = m
                    }
            }
        }, TrimModifier.prototype.addPaths = function(t, e) {
            var i, s = t.length;
            for (i = 0; i < s; i += 1) e.addShape(t[i])
        }, TrimModifier.prototype.addSegment = function(t, e, i, s, r, a, n) {
            r.setXYAt(e[0], e[1], "o", a), r.setXYAt(i[0], i[1], "i", a + 1), n && r.setXYAt(t[0], t[1], "v", a), r.setXYAt(s[0], s[1], "v", a + 1)
        }, TrimModifier.prototype.addSegmentFromArray = function(t, e, i, s) {
            e.setXYAt(t[1], t[5], "o", i), e.setXYAt(t[2], t[6], "i", i + 1), s && e.setXYAt(t[0], t[4], "v", i), e.setXYAt(t[3], t[7], "v", i + 1)
        }, TrimModifier.prototype.addShapes = function(t, e, i) {
            var s, r, a, n, o, l, h, p, d = t.pathsData,
                c = t.shape.paths.shapes,
                f = t.shape.paths._length,
                u = 0,
                m = [],
                g = !0;
            for (p = i ? (o = i._length, i._length) : (i = shape_pool.newElement(), o = 0), m.push(i), s = 0; s < f; s += 1) {
                for (l = d[s].lengths, i.c = c[s].c, a = c[s].c ? l.length : l.length + 1, r = 1; r < a; r += 1)
                    if (u + (n = l[r - 1]).addedLength < e.s) u += n.addedLength, i.c = !1;
                    else {
                        if (u > e.e) {
                            i.c = !1;
                            break
                        }
                        e.s <= u && e.e >= u + n.addedLength ? (this.addSegment(c[s].v[r - 1], c[s].o[r - 1], c[s].i[r], c[s].v[r], i, o, g), g = !1) : (h = bez.getNewSegment(c[s].v[r - 1], c[s].v[r], c[s].o[r - 1], c[s].i[r], (e.s - u) / n.addedLength, (e.e - u) / n.addedLength, l[r - 1]), this.addSegmentFromArray(h, i, o, g), g = !1, i.c = !1), u += n.addedLength, o += 1
                    }
                if (c[s].c && l.length) {
                    if (n = l[r - 1], u <= e.e) {
                        var v = l[r - 1].addedLength;
                        e.s <= u && e.e >= u + v ? (this.addSegment(c[s].v[r - 1], c[s].o[r - 1], c[s].i[0], c[s].v[0], i, o, g), g = !1) : (h = bez.getNewSegment(c[s].v[r - 1], c[s].v[0], c[s].o[r - 1], c[s].i[0], (e.s - u) / v, (e.e - u) / v, l[r - 1]), this.addSegmentFromArray(h, i, o, g), g = !1, i.c = !1)
                    } else i.c = !1;
                    u += n.addedLength, o += 1
                }
                if (i._length && (i.setXYAt(i.v[p][0], i.v[p][1], "i", p), i.setXYAt(i.v[i._length - 1][0], i.v[i._length - 1][1], "o", i._length - 1)), u > e.e) break;
                s < f - 1 && (i = shape_pool.newElement(), g = !0, m.push(i), o = 0)
            }
            return m
        }, ShapeModifiers.registerModifier("tm", TrimModifier), extendPrototype([ShapeModifier], RoundCornersModifier), RoundCornersModifier.prototype.initModifierProperties = function(t, e) {
            this.getValue = this.processKeys, this.rd = PropertyFactory.getProp(t, e.r, 0, null, this), this._isAnimated = !!this.rd.effectsSequence.length
        }, RoundCornersModifier.prototype.processPath = function(t, e) {
            var i = shape_pool.newElement();
            i.c = t.c;
            var s, r, a, n, o, l, h, p, d, c, f, u, m, g = t._length,
                v = 0;
            for (s = 0; s < g; s += 1) r = t.v[s], n = t.o[s], a = t.i[s], r[0] === n[0] && r[1] === n[1] && r[0] === a[0] && r[1] === a[1] ? 0 !== s && s !== g - 1 || t.c ? (o = 0 === s ? t.v[g - 1] : t.v[s - 1], h = (l = Math.sqrt(Math.pow(r[0] - o[0], 2) + Math.pow(r[1] - o[1], 2))) ? Math.min(l / 2, e) / l : 0, p = u = r[0] + (o[0] - r[0]) * h, d = m = r[1] - (r[1] - o[1]) * h, c = p - (p - r[0]) * roundCorner, f = d - (d - r[1]) * roundCorner, i.setTripleAt(p, d, c, f, u, m, v), v += 1, o = s === g - 1 ? t.v[0] : t.v[s + 1], h = (l = Math.sqrt(Math.pow(r[0] - o[0], 2) + Math.pow(r[1] - o[1], 2))) ? Math.min(l / 2, e) / l : 0, p = c = r[0] + (o[0] - r[0]) * h, d = f = r[1] + (o[1] - r[1]) * h, u = p - (p - r[0]) * roundCorner, m = d - (d - r[1]) * roundCorner, i.setTripleAt(p, d, c, f, u, m, v)) : i.setTripleAt(r[0], r[1], n[0], n[1], a[0], a[1], v) : i.setTripleAt(t.v[s][0], t.v[s][1], t.o[s][0], t.o[s][1], t.i[s][0], t.i[s][1], v), v += 1;
            return i
        }, RoundCornersModifier.prototype.processShapes = function(t) {
            var e, i, s, r, a, n, o = this.shapes.length,
                l = this.rd.v;
            if (0 !== l)
                for (i = 0; i < o; i += 1) {
                    if ((a = this.shapes[i]).shape.paths, n = a.localShapeCollection, a.shape._mdf || this._mdf || t)
                        for (n.releaseShapes(), a.shape._mdf = !0, e = a.shape.paths.shapes, r = a.shape.paths._length, s = 0; s < r; s += 1) n.addShape(this.processPath(e[s], l));
                    a.shape.paths = a.localShapeCollection
                }
            this.dynamicProperties.length || (this._mdf = !1)
        }, ShapeModifiers.registerModifier("rd", RoundCornersModifier), extendPrototype([ShapeModifier], RepeaterModifier), RepeaterModifier.prototype.initModifierProperties = function(t, e) {
            this.getValue = this.processKeys, this.c = PropertyFactory.getProp(t, e.c, 0, null, this), this.o = PropertyFactory.getProp(t, e.o, 0, null, this), this.tr = TransformPropertyFactory.getTransformProperty(t, e.tr, this), this.so = PropertyFactory.getProp(t, e.tr.so, 0, .01, this), this.eo = PropertyFactory.getProp(t, e.tr.eo, 0, .01, this), this.data = e, this.dynamicProperties.length || this.getValue(!0), this._isAnimated = !!this.dynamicProperties.length, this.pMatrix = new Matrix, this.rMatrix = new Matrix, this.sMatrix = new Matrix, this.tMatrix = new Matrix, this.matrix = new Matrix
        }, RepeaterModifier.prototype.applyTransforms = function(t, e, i, s, r, a) {
            var n = a ? -1 : 1,
                o = s.s.v[0] + (1 - s.s.v[0]) * (1 - r),
                l = s.s.v[1] + (1 - s.s.v[1]) * (1 - r);
            t.translate(s.p.v[0] * n * r, s.p.v[1] * n * r, s.p.v[2]), e.translate(-s.a.v[0], -s.a.v[1], s.a.v[2]), e.rotate(-s.r.v * n * r), e.translate(s.a.v[0], s.a.v[1], s.a.v[2]), i.translate(-s.a.v[0], -s.a.v[1], s.a.v[2]), i.scale(a ? 1 / o : o, a ? 1 / l : l), i.translate(s.a.v[0], s.a.v[1], s.a.v[2])
        }, RepeaterModifier.prototype.init = function(t, e, i, s) {
            for (this.elem = t, this.arr = e, this.pos = i, this.elemsData = s, this._currentCopies = 0, this._elements = [], this._groups = [], this.frameId = -1, this.initDynamicPropertyContainer(t), this.initModifierProperties(t, e[i]); 0 < i;) i -= 1, this._elements.unshift(e[i]);
            this.dynamicProperties.length ? this.k = !0 : this.getValue(!0)
        }, RepeaterModifier.prototype.resetElements = function(t) {
            var e, i = t.length;
            for (e = 0; e < i; e += 1) t[e]._processed = !1, "gr" === t[e].ty && this.resetElements(t[e].it)
        }, RepeaterModifier.prototype.cloneElements = function(t) {
            t.length;
            var e = JSON.parse(JSON.stringify(t));
            return this.resetElements(e), e
        }, RepeaterModifier.prototype.changeGroupRender = function(t, e) {
            var i, s = t.length;
            for (i = 0; i < s; i += 1) t[i]._render = e, "gr" === t[i].ty && this.changeGroupRender(t[i].it, e)
        }, RepeaterModifier.prototype.processShapes = function(t) {
            var e, i, s, r, a;
            if (this._mdf || t) {
                var n, o = Math.ceil(this.c.v);
                if (this._groups.length < o) {
                    for (; this._groups.length < o;) {
                        var l = {
                            it: this.cloneElements(this._elements),
                            ty: "gr"
                        };
                        l.it.push({
                            a: {
                                a: 0,
                                ix: 1,
                                k: [0, 0]
                            },
                            nm: "Transform",
                            o: {
                                a: 0,
                                ix: 7,
                                k: 100
                            },
                            p: {
                                a: 0,
                                ix: 2,
                                k: [0, 0]
                            },
                            r: {
                                a: 1,
                                ix: 6,
                                k: [{
                                    s: 0,
                                    e: 0,
                                    t: 0
                                }, {
                                    s: 0,
                                    e: 0,
                                    t: 1
                                }]
                            },
                            s: {
                                a: 0,
                                ix: 3,
                                k: [100, 100]
                            },
                            sa: {
                                a: 0,
                                ix: 5,
                                k: 0
                            },
                            sk: {
                                a: 0,
                                ix: 4,
                                k: 0
                            },
                            ty: "tr"
                        }), this.arr.splice(0, 0, l), this._groups.splice(0, 0, l), this._currentCopies += 1
                    }
                    this.elem.reloadShapes()
                }
                for (s = a = 0; s <= this._groups.length - 1; s += 1) n = a < o, this._groups[s]._render = n, this.changeGroupRender(this._groups[s].it, n), a += 1;
                this._currentCopies = o;
                var h = this.o.v,
                    p = h % 1,
                    d = 0 < h ? Math.floor(h) : Math.ceil(h),
                    c = (this.tr.v.props, this.pMatrix.props),
                    f = this.rMatrix.props,
                    u = this.sMatrix.props;
                this.pMatrix.reset(), this.rMatrix.reset(), this.sMatrix.reset(), this.tMatrix.reset(), this.matrix.reset();
                var m, g, v = 0;
                if (0 < h) {
                    for (; v < d;) this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), v += 1;
                    p && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, p, !1), v += p)
                } else if (h < 0) {
                    for (; d < v;) this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !0), v -= 1;
                    p && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, -p, !0), v -= p)
                }
                for (s = 1 === this.data.m ? 0 : this._currentCopies - 1, r = 1 === this.data.m ? 1 : -1, a = this._currentCopies; a;) {
                    if (g = (i = (e = this.elemsData[s].it)[e.length - 1].transform.mProps.v.props).length, e[e.length - 1].transform.mProps._mdf = !0, e[e.length - 1].transform.op._mdf = !0, e[e.length - 1].transform.op.v = this.so.v + (this.eo.v - this.so.v) * (s / (this._currentCopies - 1)), 0 !== v) {
                        for ((0 !== s && 1 === r || s !== this._currentCopies - 1 && -1 === r) && this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), this.matrix.transform(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7], f[8], f[9], f[10], f[11], f[12], f[13], f[14], f[15]), this.matrix.transform(u[0], u[1], u[2], u[3], u[4], u[5], u[6], u[7], u[8], u[9], u[10], u[11], u[12], u[13], u[14], u[15]), this.matrix.transform(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9], c[10], c[11], c[12], c[13], c[14], c[15]), m = 0; m < g; m += 1) i[m] = this.matrix.props[m];
                        this.matrix.reset()
                    } else
                        for (this.matrix.reset(), m = 0; m < g; m += 1) i[m] = this.matrix.props[m];
                    v += 1, a -= 1, s += r
                }
            } else
                for (a = this._currentCopies, s = 0, r = 1; a;) i = (e = this.elemsData[s].it)[e.length - 1].transform.mProps.v.props, e[e.length - 1].transform.mProps._mdf = !1, e[e.length - 1].transform.op._mdf = !1, a -= 1, s += r
        }, RepeaterModifier.prototype.addShape = function() {}, ShapeModifiers.registerModifier("rp", RepeaterModifier), ShapeCollection.prototype.addShape = function(t) {
            this._length === this._maxLength && (this.shapes = this.shapes.concat(createSizedArray(this._maxLength)), this._maxLength *= 2), this.shapes[this._length] = t, this._length += 1
        }, ShapeCollection.prototype.releaseShapes = function() {
            var t;
            for (t = 0; t < this._length; t += 1) shape_pool.release(this.shapes[t]);
            this._length = 0
        }, DashProperty.prototype.getValue = function(t) {
            if ((this.elem.globalData.frameId !== this.frameId || t) && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf = this._mdf || t, this._mdf)) {
                var e = 0,
                    i = this.dataProps.length;
                for ("svg" === this.renderer && (this.dashStr = ""), e = 0; e < i; e += 1) "o" != this.dataProps[e].n ? "svg" === this.renderer ? this.dashStr += " " + this.dataProps[e].p.v : this.dashArray[e] = this.dataProps[e].p.v : this.dashoffset[0] = this.dataProps[e].p.v
            }
        }, extendPrototype([DynamicPropertyContainer], DashProperty), GradientProperty.prototype.comparePoints = function(t, e) {
            for (var i = 0, s = this.o.length / 2; i < s;) {
                if (.01 < Math.abs(t[4 * i] - t[4 * e + 2 * i])) return !1;
                i += 1
            }
            return !0
        }, GradientProperty.prototype.checkCollapsable = function() {
            if (this.o.length / 2 != this.c.length / 4) return !1;
            if (this.data.k.k[0].s)
                for (var t = 0, e = this.data.k.k.length; t < e;) {
                    if (!this.comparePoints(this.data.k.k[t].s, this.data.p)) return !1;
                    t += 1
                } else if (!this.comparePoints(this.data.k.k, this.data.p)) return !1;
            return !0
        }, GradientProperty.prototype.getValue = function(t) {
            if (this.prop.getValue(), this._mdf = !1, this._cmdf = !1, this._omdf = !1, this.prop._mdf || t) {
                var e, i, s, r = 4 * this.data.p;
                for (e = 0; e < r; e += 1) i = e % 4 == 0 ? 100 : 255, s = Math.round(this.prop.v[e] * i), this.c[e] !== s && (this.c[e] = s, this._cmdf = !t);
                if (this.o.length)
                    for (r = this.prop.v.length, e = 4 * this.data.p; e < r; e += 1) i = e % 2 == 0 ? 100 : 1, s = e % 2 == 0 ? Math.round(100 * this.prop.v[e]) : this.prop.v[e], this.o[e - 4 * this.data.p] !== s && (this.o[e - 4 * this.data.p] = s, this._omdf = !t);
                this._mdf = !t
            }
        }, extendPrototype([DynamicPropertyContainer], GradientProperty);
        var buildShapeString = function(t, e, i, s) {
                if (0 === e) return "";
                var r, a = t.o,
                    n = t.i,
                    o = t.v,
                    l = " M" + s.applyToPointStringified(o[0][0], o[0][1]);
                for (r = 1; r < e; r += 1) l += " C" + s.applyToPointStringified(a[r - 1][0], a[r - 1][1]) + " " + s.applyToPointStringified(n[r][0], n[r][1]) + " " + s.applyToPointStringified(o[r][0], o[r][1]);
                return i && e && (l += " C" + s.applyToPointStringified(a[r - 1][0], a[r - 1][1]) + " " + s.applyToPointStringified(n[0][0], n[0][1]) + " " + s.applyToPointStringified(o[0][0], o[0][1]), l += "z"), l
            },
            ImagePreloader = function() {
                var r = function() {
                    var t = createTag("canvas");
                    t.width = 1, t.height = 1;
                    var e = t.getContext("2d");
                    return e.fillStyle = "rgba(0,0,0,0)", e.fillRect(0, 0, 1, 1), t
                }();
                function t() {
                    this.loadedAssets += 1, this.loadedAssets === this.totalImages && this.imagesLoadedCb && this.imagesLoadedCb(null)
                }
                function e(t) {
                    var e = function(t, e, i) {
                            var s = "";
                            if (t.e) s = t.p;
                            else if (e) {
                                var r = t.p; - 1 !== r.indexOf("images/") && (r = r.split("/")[1]), s = e + r
                            } else s = i, s += t.u ? t.u : "", s += t.p;
                            return s
                        }(t, this.assetsPath, this.path),
                        i = createTag("img");
                    i.crossOrigin = "anonymous", i.addEventListener("load", this._imageLoaded.bind(this), !1), i.addEventListener("error", function() {
                        s.img = r, this._imageLoaded()
                    }.bind(this), !1), i.src = e;
                    var s = {
                        img: i,
                        assetData: t
                    };
                    return s
                }
                function i(t, e) {
                    this.imagesLoadedCb = e;
                    var i, s = t.length;
                    for (i = 0; i < s; i += 1) t[i].layers || (this.totalImages += 1, this.images.push(this._createImageData(t[i])))
                }
                function s(t) {
                    this.path = t || ""
                }
                function a(t) {
                    this.assetsPath = t || ""
                }
                function n(t) {
                    for (var e = 0, i = this.images.length; e < i;) {
                        if (this.images[e].assetData === t) return this.images[e].img;
                        e += 1
                    }
                }
                function o() {
                    this.imagesLoadedCb = null, this.images.length = 0
                }
                function l() {
                    return this.totalImages === this.loadedAssets
                }
                return function() {
                    this.loadAssets = i, this.setAssetsPath = a, this.setPath = s, this.loaded = l, this.destroy = o, this.getImage = n, this._createImageData = e, this._imageLoaded = t, this.assetsPath = "", this.path = "", this.totalImages = 0, this.loadedAssets = 0, this.imagesLoadedCb = null, this.images = []
                }
            }(),
            featureSupport = (qw = {
                maskType: !0
            }, (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) && (qw.maskType = !1), qw),
            qw, filtersFactory = (rw = {}, rw.createFilter = function(t) {
                var e = createNS("filter");
                return e.setAttribute("id", t), e.setAttribute("filterUnits", "objectBoundingBox"), e.setAttribute("x", "0%"), e.setAttribute("y", "0%"), e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e
            }, rw.createAlphaToLuminanceFilter = function() {
                var t = createNS("feColorMatrix");
                return t.setAttribute("type", "matrix"), t.setAttribute("color-interpolation-filters", "sRGB"), t.setAttribute("values", "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1"), t
            }, rw),
            rw, assetLoader = function() {
                function a(t) {
                    return t.response && "object" == typeof t.response ? t.response : t.response && "string" == typeof t.response ? JSON.parse(t.response) : t.responseText ? JSON.parse(t.responseText) : void 0
                }
                return {
                    load: function(t, e, i) {
                        var s, r = new XMLHttpRequest;
                        r.open("GET", t, !0);
                        try {
                            r.responseType = "json"
                        } catch (t) {}
                        r.send(), r.onreadystatechange = function() {
                            if (4 == r.readyState)
                                if (200 == r.status) s = a(r), e(s);
                                else try {
                                    s = a(r), e(s)
                                } catch (t) {
                                    i && i(t)
                                }
                        }
                    }
                }
            }();
        function TextAnimatorProperty(t, e, i) {
            this._isFirstFrame = !0, this._hasMaskedPath = !1, this._frameId = -1, this._textData = t, this._renderType = e, this._elem = i, this._animatorsData = createSizedArray(this._textData.a.length), this._pathData = {}, this._moreOptions = {
                alignment: {}
            }, this.renderedLetters = [], this.lettersChangedFlag = !1, this.initDynamicPropertyContainer(i)
        }
        function TextAnimatorDataProperty(t, e, i) {
            var s = {
                    propType: !1
                },
                r = PropertyFactory.getProp,
                a = e.a;
            this.a = {
                r: a.r ? r(t, a.r, 0, degToRads, i) : s,
                rx: a.rx ? r(t, a.rx, 0, degToRads, i) : s,
                ry: a.ry ? r(t, a.ry, 0, degToRads, i) : s,
                sk: a.sk ? r(t, a.sk, 0, degToRads, i) : s,
                sa: a.sa ? r(t, a.sa, 0, degToRads, i) : s,
                s: a.s ? r(t, a.s, 1, .01, i) : s,
                a: a.a ? r(t, a.a, 1, 0, i) : s,
                o: a.o ? r(t, a.o, 0, .01, i) : s,
                p: a.p ? r(t, a.p, 1, 0, i) : s,
                sw: a.sw ? r(t, a.sw, 0, 0, i) : s,
                sc: a.sc ? r(t, a.sc, 1, 0, i) : s,
                fc: a.fc ? r(t, a.fc, 1, 0, i) : s,
                fh: a.fh ? r(t, a.fh, 0, 0, i) : s,
                fs: a.fs ? r(t, a.fs, 0, .01, i) : s,
                fb: a.fb ? r(t, a.fb, 0, .01, i) : s,
                t: a.t ? r(t, a.t, 0, 0, i) : s
            }, this.s = TextSelectorProp.getTextSelectorProp(t, e.s, i), this.s.t = e.s.t
        }
        function LetterProps(t, e, i, s, r, a) {
            this.o = t, this.sw = e, this.sc = i, this.fc = s, this.m = r, this.p = a, this._mdf = {
                o: !0,
                sw: !!e,
                sc: !!i,
                fc: !!s,
                m: !0,
                p: !0
            }
        }
        function TextProperty(t, e) {
            this._frameId = initialDefaultFrame, this.pv = "", this.v = "", this.kf = !1, this._isFirstFrame = !0, this._mdf = !1, this.data = e, this.elem = t, this.comp = this.elem.comp, this.keysIndex = 0, this.canResize = !1, this.minimumFontSize = 1, this.effectsSequence = [], this.currentData = {
                ascent: 0,
                boxWidth: this.defaultBoxWidth,
                f: "",
                fStyle: "",
                fWeight: "",
                fc: "",
                j: "",
                justifyOffset: "",
                l: [],
                lh: 0,
                lineWidths: [],
                ls: "",
                of: "",
                s: "",
                sc: "",
                sw: 0,
                t: 0,
                tr: 0,
                sz: 0,
                ps: null,
                fillColorAnim: !1,
                strokeColorAnim: !1,
                strokeWidthAnim: !1,
                yOffset: 0,
                finalSize: 0,
                finalText: [],
                finalLineHeight: 0,
                __complete: !1
            }, this.copyData(this.currentData, this.data.d.k[0].s), this.searchProperty() || this.completeTextData(this.currentData)
        }
        TextAnimatorProperty.prototype.searchProperties = function() {
            var t, e, i = this._textData.a.length,
                s = PropertyFactory.getProp;
            for (t = 0; t < i; t += 1) e = this._textData.a[t], this._animatorsData[t] = new TextAnimatorDataProperty(this._elem, e, this);
            this._textData.p && "m" in this._textData.p ? (this._pathData = {
                f: s(this._elem, this._textData.p.f, 0, 0, this),
                l: s(this._elem, this._textData.p.l, 0, 0, this),
                r: this._textData.p.r,
                m: this._elem.maskManager.getMaskProperty(this._textData.p.m)
            }, this._hasMaskedPath = !0) : this._hasMaskedPath = !1, this._moreOptions.alignment = s(this._elem, this._textData.m.a, 1, 0, this)
        }, TextAnimatorProperty.prototype.getMeasures = function(t, e) {
            if (this.lettersChangedFlag = e, this._mdf || this._isFirstFrame || e || this._hasMaskedPath && this._pathData.m._mdf) {
                this._isFirstFrame = !1;
                var i, s, r, a, n, o, l, h, p, d, c, f, u, m, g, v, y, _, b, x = this._moreOptions.alignment.v,
                    T = this._animatorsData,
                    w = this._textData,
                    E = this.mHelper,
                    S = this._renderType,
                    P = this.renderedLetters.length,
                    C = (this.data, t.l);
                if (this._hasMaskedPath) {
                    if (b = this._pathData.m, !this._pathData.n || this._pathData._mdf) {
                        var k, M = b.v;
                        for (this._pathData.r && (M = M.reverse()), n = {
                                tLength: 0,
                                segments: []
                            }, a = M._length - 1, r = v = 0; r < a; r += 1) k = bez.buildBezierData(M.v[r], M.v[r + 1], [M.o[r][0] - M.v[r][0], M.o[r][1] - M.v[r][1]], [M.i[r + 1][0] - M.v[r + 1][0], M.i[r + 1][1] - M.v[r + 1][1]]), n.tLength += k.segmentLength, n.segments.push(k), v += k.segmentLength;
                        r = a, b.v.c && (k = bez.buildBezierData(M.v[r], M.v[0], [M.o[r][0] - M.v[r][0], M.o[r][1] - M.v[r][1]], [M.i[0][0] - M.v[0][0], M.i[0][1] - M.v[0][1]]), n.tLength += k.segmentLength, n.segments.push(k), v += k.segmentLength), this._pathData.pi = n
                    }
                    if (n = this._pathData.pi, o = this._pathData.f.v, d = 1, p = !(h = c = 0), m = n.segments, o < 0 && b.v.c)
                        for (n.tLength < Math.abs(o) && (o = -Math.abs(o) % n.tLength), d = (u = m[c = m.length - 1].points).length - 1; o < 0;) o += u[d].partialLength, (d -= 1) < 0 && (d = (u = m[c -= 1].points).length - 1);
                    f = (u = m[c].points)[d - 1], g = (l = u[d]).partialLength
                }
                a = C.length, s = i = 0;
                var A, D, I, F, R = 1.2 * t.finalSize * .714,
                    O = !0;
                I = T.length;
                var z, L, B, V, N, G, H, $, j, X, Y, q, W, U = -1,
                    K = o,
                    Z = c,
                    Q = d,
                    J = -1,
                    tt = "",
                    et = this.defaultPropsArray;
                if (2 === t.j || 1 === t.j) {
                    var it = 0,
                        st = 0,
                        rt = 2 === t.j ? -.5 : -1,
                        at = 0,
                        nt = !0;
                    for (r = 0; r < a; r += 1)
                        if (C[r].n) {
                            for (it && (it += st); at < r;) C[at].animatorJustifyOffset = it, at += 1;
                            nt = !(it = 0)
                        } else {
                            for (D = 0; D < I; D += 1)(A = T[D].a).t.propType && (nt && 2 === t.j && (st += A.t.v * rt), (z = T[D].s.getMult(C[r].anIndexes[D], w.a[D].s.totalChars)).length ? it += A.t.v * z[0] * rt : it += A.t.v * z * rt);
                            nt = !1
                        }
                    for (it && (it += st); at < r;) C[at].animatorJustifyOffset = it, at += 1
                }
                for (r = 0; r < a; r += 1) {
                    if (E.reset(), N = 1, C[r].n) i = 0, s += t.yOffset, s += O ? 1 : 0, o = K, O = !1, this._hasMaskedPath && (d = Q, f = (u = m[c = Z].points)[d - 1], g = (l = u[d]).partialLength, h = 0), W = X = q = tt = "", et = this.defaultPropsArray;
                    else {
                        if (this._hasMaskedPath) {
                            if (J !== C[r].line) {
                                switch (t.j) {
                                    case 1:
                                        o += v - t.lineWidths[C[r].line];
                                        break;
                                    case 2:
                                        o += (v - t.lineWidths[C[r].line]) / 2
                                }
                                J = C[r].line
                            }
                            U !== C[r].ind && (C[U] && (o += C[U].extra), o += C[r].an / 2, U = C[r].ind), o += x[0] * C[r].an / 200;
                            var ot = 0;
                            for (D = 0; D < I; D += 1)(A = T[D].a).p.propType && ((z = T[D].s.getMult(C[r].anIndexes[D], w.a[D].s.totalChars)).length ? ot += A.p.v[0] * z[0] : ot += A.p.v[0] * z), A.a.propType && ((z = T[D].s.getMult(C[r].anIndexes[D], w.a[D].s.totalChars)).length ? ot += A.a.v[0] * z[0] : ot += A.a.v[0] * z);
                            for (p = !0; p;) o + ot <= h + g || !u ? (y = (o + ot - h) / l.partialLength, B = f.point[0] + (l.point[0] - f.point[0]) * y, V = f.point[1] + (l.point[1] - f.point[1]) * y, E.translate(-x[0] * C[r].an / 200, -x[1] * R / 100), p = !1) : u && (h += l.partialLength, (d += 1) >= u.length && (d = 0, u = m[c += 1] ? m[c].points : b.v.c ? m[c = d = 0].points : (h -= l.partialLength, null)), u && (f = l, g = (l = u[d]).partialLength));
                            L = C[r].an / 2 - C[r].add, E.translate(-L, 0, 0)
                        } else L = C[r].an / 2 - C[r].add, E.translate(-L, 0, 0), E.translate(-x[0] * C[r].an / 200, -x[1] * R / 100, 0);
                        for (C[r].l, D = 0; D < I; D += 1)(A = T[D].a).t.propType && (z = T[D].s.getMult(C[r].anIndexes[D], w.a[D].s.totalChars), 0 === i && 0 === t.j || (this._hasMaskedPath ? z.length ? o += A.t.v * z[0] : o += A.t.v * z : z.length ? i += A.t.v * z[0] : i += A.t.v * z));
                        for (C[r].l, t.strokeWidthAnim && (H = t.sw || 0), t.strokeColorAnim && (G = t.sc ? [t.sc[0], t.sc[1], t.sc[2]] : [0, 0, 0]), t.fillColorAnim && t.fc && ($ = [t.fc[0], t.fc[1], t.fc[2]]), D = 0; D < I; D += 1)(A = T[D].a).a.propType && ((z = T[D].s.getMult(C[r].anIndexes[D], w.a[D].s.totalChars)).length ? E.translate(-A.a.v[0] * z[0], -A.a.v[1] * z[1], A.a.v[2] * z[2]) : E.translate(-A.a.v[0] * z, -A.a.v[1] * z, A.a.v[2] * z));
                        for (D = 0; D < I; D += 1)(A = T[D].a).s.propType && ((z = T[D].s.getMult(C[r].anIndexes[D], w.a[D].s.totalChars)).length ? E.scale(1 + (A.s.v[0] - 1) * z[0], 1 + (A.s.v[1] - 1) * z[1], 1) : E.scale(1 + (A.s.v[0] - 1) * z, 1 + (A.s.v[1] - 1) * z, 1));
                        for (D = 0; D < I; D += 1) {
                            if (A = T[D].a, z = T[D].s.getMult(C[r].anIndexes[D], w.a[D].s.totalChars), A.sk.propType && (z.length ? E.skewFromAxis(-A.sk.v * z[0], A.sa.v * z[1]) : E.skewFromAxis(-A.sk.v * z, A.sa.v * z)), A.r.propType && (z.length ? E.rotateZ(-A.r.v * z[2]) : E.rotateZ(-A.r.v * z)), A.ry.propType && (z.length ? E.rotateY(A.ry.v * z[1]) : E.rotateY(A.ry.v * z)), A.rx.propType && (z.length ? E.rotateX(A.rx.v * z[0]) : E.rotateX(A.rx.v * z)), A.o.propType && (z.length ? N += (A.o.v * z[0] - N) * z[0] : N += (A.o.v * z - N) * z), t.strokeWidthAnim && A.sw.propType && (z.length ? H += A.sw.v * z[0] : H += A.sw.v * z), t.strokeColorAnim && A.sc.propType)
                                for (j = 0; j < 3; j += 1) z.length ? G[j] = G[j] + (A.sc.v[j] - G[j]) * z[0] : G[j] = G[j] + (A.sc.v[j] - G[j]) * z;
                            if (t.fillColorAnim && t.fc) {
                                if (A.fc.propType)
                                    for (j = 0; j < 3; j += 1) z.length ? $[j] = $[j] + (A.fc.v[j] - $[j]) * z[0] : $[j] = $[j] + (A.fc.v[j] - $[j]) * z;
                                A.fh.propType && ($ = z.length ? addHueToRGB($, A.fh.v * z[0]) : addHueToRGB($, A.fh.v * z)), A.fs.propType && ($ = z.length ? addSaturationToRGB($, A.fs.v * z[0]) : addSaturationToRGB($, A.fs.v * z)), A.fb.propType && ($ = z.length ? addBrightnessToRGB($, A.fb.v * z[0]) : addBrightnessToRGB($, A.fb.v * z))
                            }
                        }
                        for (D = 0; D < I; D += 1)(A = T[D].a).p.propType && (z = T[D].s.getMult(C[r].anIndexes[D], w.a[D].s.totalChars), this._hasMaskedPath ? z.length ? E.translate(0, A.p.v[1] * z[0], -A.p.v[2] * z[1]) : E.translate(0, A.p.v[1] * z, -A.p.v[2] * z) : z.length ? E.translate(A.p.v[0] * z[0], A.p.v[1] * z[1], -A.p.v[2] * z[2]) : E.translate(A.p.v[0] * z, A.p.v[1] * z, -A.p.v[2] * z));
                        if (t.strokeWidthAnim && (X = H < 0 ? 0 : H), t.strokeColorAnim && (Y = "rgb(" + Math.round(255 * G[0]) + "," + Math.round(255 * G[1]) + "," + Math.round(255 * G[2]) + ")"), t.fillColorAnim && t.fc && (q = "rgb(" + Math.round(255 * $[0]) + "," + Math.round(255 * $[1]) + "," + Math.round(255 * $[2]) + ")"), this._hasMaskedPath) {
                            if (E.translate(0, -t.ls), E.translate(0, x[1] * R / 100 + s, 0), w.p.p) {
                                _ = (l.point[1] - f.point[1]) / (l.point[0] - f.point[0]);
                                var lt = 180 * Math.atan(_) / Math.PI;
                                l.point[0] < f.point[0] && (lt += 180), E.rotate(-lt * Math.PI / 180)
                            }
                            E.translate(B, V, 0), o -= x[0] * C[r].an / 200, C[r + 1] && U !== C[r + 1].ind && (o += C[r].an / 2, o += t.tr / 1e3 * t.finalSize)
                        } else {
                            switch (E.translate(i, s, 0), t.ps && E.translate(t.ps[0], t.ps[1] + t.ascent, 0), t.j) {
                                case 1:
                                    E.translate(C[r].animatorJustifyOffset + t.justifyOffset + (t.boxWidth - t.lineWidths[C[r].line]), 0, 0);
                                    break;
                                case 2:
                                    E.translate(C[r].animatorJustifyOffset + t.justifyOffset + (t.boxWidth - t.lineWidths[C[r].line]) / 2, 0, 0)
                            }
                            E.translate(0, -t.ls), E.translate(L, 0, 0), E.translate(x[0] * C[r].an / 200, x[1] * R / 100, 0), i += C[r].l + t.tr / 1e3 * t.finalSize
                        }
                        "html" === S ? tt = E.toCSS() : "svg" === S ? tt = E.to2dCSS() : et = [E.props[0], E.props[1], E.props[2], E.props[3], E.props[4], E.props[5], E.props[6], E.props[7], E.props[8], E.props[9], E.props[10], E.props[11], E.props[12], E.props[13], E.props[14], E.props[15]], W = N
                    }
                    this.lettersChangedFlag = P <= r ? (F = new LetterProps(W, X, Y, q, tt, et), this.renderedLetters.push(F), P += 1, !0) : (F = this.renderedLetters[r]).update(W, X, Y, q, tt, et) || this.lettersChangedFlag
                }
            }
        }, TextAnimatorProperty.prototype.getValue = function() {
            this._elem.globalData.frameId !== this._frameId && (this._frameId = this._elem.globalData.frameId, this.iterateDynamicProperties())
        }, TextAnimatorProperty.prototype.mHelper = new Matrix, TextAnimatorProperty.prototype.defaultPropsArray = [], extendPrototype([DynamicPropertyContainer], TextAnimatorProperty), LetterProps.prototype.update = function(t, e, i, s, r, a) {
            this._mdf.o = !1, this._mdf.sw = !1, this._mdf.sc = !1, this._mdf.fc = !1, this._mdf.m = !1;
            var n = this._mdf.p = !1;
            return this.o !== t && (this.o = t, n = this._mdf.o = !0), this.sw !== e && (this.sw = e, n = this._mdf.sw = !0), this.sc !== i && (this.sc = i, n = this._mdf.sc = !0), this.fc !== s && (this.fc = s, n = this._mdf.fc = !0), this.m !== r && (this.m = r, n = this._mdf.m = !0), !a.length || this.p[0] === a[0] && this.p[1] === a[1] && this.p[4] === a[4] && this.p[5] === a[5] && this.p[12] === a[12] && this.p[13] === a[13] || (this.p = a, n = this._mdf.p = !0), n
        }, TextProperty.prototype.defaultBoxWidth = [0, 0], TextProperty.prototype.copyData = function(t, e) {
            for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
            return t
        }, TextProperty.prototype.setCurrentData = function(t) {
            t.__complete || this.completeTextData(t), this.currentData = t, this.currentData.boxWidth = this.currentData.boxWidth || this.defaultBoxWidth, this._mdf = !0
        }, TextProperty.prototype.searchProperty = function() {
            return this.searchKeyframes()
        }, TextProperty.prototype.searchKeyframes = function() {
            return this.kf = 1 < this.data.d.k.length, this.kf && this.addEffect(this.getKeyframeValue.bind(this)), this.kf
        }, TextProperty.prototype.addEffect = function(t) {
            this.effectsSequence.push(t), this.elem.addDynamicProperty(this)
        }, TextProperty.prototype.getValue = function(t) {
            if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length || t) {
                this.currentData.t = this.data.d.k[this.keysIndex].s.t;
                var e = this.currentData,
                    i = this.keysIndex;
                if (this.lock) this.setCurrentData(this.currentData);
                else {
                    this.lock = !0, this._mdf = !1;
                    var s, r = this.effectsSequence.length,
                        a = t || this.data.d.k[this.keysIndex].s;
                    for (s = 0; s < r; s += 1) a = i !== this.keysIndex ? this.effectsSequence[s](a, a.t) : this.effectsSequence[s](this.currentData, a.t);
                    e !== a && this.setCurrentData(a), this.pv = this.v = this.currentData, this.lock = !1, this.frameId = this.elem.globalData.frameId
                }
            }
        }, TextProperty.prototype.getKeyframeValue = function() {
            for (var t = this.data.d.k, e = this.elem.comp.renderedFrame, i = 0, s = t.length; i <= s - 1 && (t[i].s, !(i === s - 1 || t[i + 1].t > e));) i += 1;
            return this.keysIndex !== i && (this.keysIndex = i), this.data.d.k[this.keysIndex].s
        }, TextProperty.prototype.buildFinalText = function(t) {
            for (var e, i = FontManager.getCombinedCharacterCodes(), s = [], r = 0, a = t.length; r < a;) e = t.charCodeAt(r), -1 !== i.indexOf(e) ? s[s.length - 1] += t.charAt(r) : 55296 <= e && e <= 56319 && 56320 <= (e = t.charCodeAt(r + 1)) && e <= 57343 ? (s.push(t.substr(r, 2)), ++r) : s.push(t.charAt(r)), r += 1;
            return s
        }, TextProperty.prototype.completeTextData = function(t) {
            t.__complete = !0;
            var e, i, s, r, a, n, o, l = this.elem.globalData.fontManager,
                h = this.data,
                p = [],
                d = 0,
                c = h.m.g,
                f = 0,
                u = 0,
                m = 0,
                g = [],
                v = 0,
                y = 0,
                _ = l.getFontByName(t.f),
                b = 0,
                x = _.fStyle ? _.fStyle.split(" ") : [],
                T = "normal",
                w = "normal";
            for (i = x.length, e = 0; e < i; e += 1) switch (x[e].toLowerCase()) {
                case "italic":
                    w = "italic";
                    break;
                case "bold":
                    T = "700";
                    break;
                case "black":
                    T = "900";
                    break;
                case "medium":
                    T = "500";
                    break;
                case "regular":
                case "normal":
                    T = "400";
                    break;
                case "light":
                case "thin":
                    T = "200"
            }
            t.fWeight = _.fWeight || T, t.fStyle = w, t.finalSize = t.s, t.finalText = this.buildFinalText(t.t), i = t.finalText.length, t.finalLineHeight = t.lh;
            var E, S = t.tr / 1e3 * t.finalSize;
            if (t.sz)
                for (var P, C, k = !0, M = t.sz[0], A = t.sz[1]; k;) {
                    v = P = 0, i = (C = this.buildFinalText(t.t)).length, S = t.tr / 1e3 * t.finalSize;
                    var D = -1;
                    for (e = 0; e < i; e += 1) E = C[e].charCodeAt(0), s = !1, " " === C[e] ? D = e : 13 !== E && 3 !== E || (s = !(v = 0), P += t.finalLineHeight || 1.2 * t.finalSize), M < v + (b = l.chars ? (o = l.getCharData(C[e], _.fStyle, _.fFamily), s ? 0 : o.w * t.finalSize / 100) : l.measureText(C[e], t.f, t.finalSize)) && " " !== C[e] ? (-1 === D ? i += 1 : e = D, P += t.finalLineHeight || 1.2 * t.finalSize, C.splice(e, D === e ? 1 : 0, "\r"), D = -1, v = 0) : (v += b, v += S);
                    P += _.ascent * t.finalSize / 100, this.canResize && t.finalSize > this.minimumFontSize && A < P ? (t.finalSize -= 1, t.finalLineHeight = t.finalSize * t.lh / t.s) : (t.finalText = C, i = t.finalText.length, k = !1)
                }
            v = -S;
            var I, F = b = 0;
            for (e = 0; e < i; e += 1)
                if (s = !1, E = (I = t.finalText[e]).charCodeAt(0), " " === I ? r = "Â " : 13 === E || 3 === E ? (F = 0, g.push(v), y = y < v ? v : y, v = -2 * S, s = !(r = ""), m += 1) : r = t.finalText[e], b = l.chars ? (o = l.getCharData(I, _.fStyle, l.getFontByName(t.f).fFamily), s ? 0 : o.w * t.finalSize / 100) : l.measureText(r, t.f, t.finalSize), " " === I ? F += b + S : (v += b + S + F, F = 0), p.push({
                        l: b,
                        an: b,
                        add: f,
                        n: s,
                        anIndexes: [],
                        val: r,
                        line: m,
                        animatorJustifyOffset: 0
                    }), 2 == c) {
                    if (f += b, "" === r || "Â " === r || e === i - 1) {
                        for ("" !== r && "Â " !== r || (f -= b); u <= e;) p[u].an = f, p[u].ind = d, p[u].extra = b, u += 1;
                        d += 1, f = 0
                    }
                } else if (3 == c) {
                if (f += b, "" === r || e === i - 1) {
                    for ("" === r && (f -= b); u <= e;) p[u].an = f, p[u].ind = d, p[u].extra = b, u += 1;
                    f = 0, d += 1
                }
            } else p[d].ind = d, p[d].extra = 0, d += 1;
            if (t.l = p, y = y < v ? v : y, g.push(v), t.sz) t.boxWidth = t.sz[0], t.justifyOffset = 0;
            else switch (t.boxWidth = y, t.j) {
                case 1:
                    t.justifyOffset = -t.boxWidth;
                    break;
                case 2:
                    t.justifyOffset = -t.boxWidth / 2;
                    break;
                default:
                    t.justifyOffset = 0
            }
            t.lineWidths = g;
            var R, O, z = h.a;
            n = z.length;
            var L, B, V = [];
            for (a = 0; a < n; a += 1) {
                for ((R = z[a]).a.sc && (t.strokeColorAnim = !0), R.a.sw && (t.strokeWidthAnim = !0), (R.a.fc || R.a.fh || R.a.fs || R.a.fb) && (t.fillColorAnim = !0), B = 0, L = R.s.b, e = 0; e < i; e += 1)(O = p[e]).anIndexes[a] = B, (1 == L && "" !== O.val || 2 == L && "" !== O.val && "Â " !== O.val || 3 == L && (O.n || "Â " == O.val || e == i - 1) || 4 == L && (O.n || e == i - 1)) && (1 === R.s.rn && V.push(B), B += 1);
                h.a[a].s.totalChars = B;
                var N, G = -1;
                if (1 === R.s.rn)
                    for (e = 0; e < i; e += 1) G != (O = p[e]).anIndexes[a] && (G = O.anIndexes[a], N = V.splice(Math.floor(Math.random() * V.length), 1)[0]), O.anIndexes[a] = N
            }
            t.yOffset = t.finalLineHeight || 1.2 * t.finalSize, t.ls = t.ls || 0, t.ascent = _.ascent * t.finalSize / 100
        }, TextProperty.prototype.updateDocumentData = function(t, e) {
            e = void 0 === e ? this.keysIndex : e;
            var i = this.copyData({}, this.data.d.k[e].s);
            i = this.copyData(i, t), this.data.d.k[e].s = i, this.recalculate(e), this.elem.addDynamicProperty(this)
        }, TextProperty.prototype.recalculate = function(t) {
            var e = this.data.d.k[t].s;
            e.__complete = !1, this.keysIndex = 0, this._isFirstFrame = !0, this.getValue(e)
        }, TextProperty.prototype.canResizeFont = function(t) {
            this.canResize = t, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this)
        }, TextProperty.prototype.setMinimumFontSize = function(t) {
            this.minimumFontSize = Math.floor(t) || 1, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this)
        };
        var TextSelectorProp = function() {
                var h = Math.max,
                    p = Math.min,
                    d = Math.floor;
                function s(t, e) {
                    this._currentTextLength = -1, this.k = !1, this.data = e, this.elem = t, this.comp = t.comp, this.finalS = 0, this.finalE = 0, this.initDynamicPropertyContainer(t), this.s = PropertyFactory.getProp(t, e.s || {
                        k: 0
                    }, 0, 0, this), this.e = "e" in e ? PropertyFactory.getProp(t, e.e, 0, 0, this) : {
                        v: 100
                    }, this.o = PropertyFactory.getProp(t, e.o || {
                        k: 0
                    }, 0, 0, this), this.xe = PropertyFactory.getProp(t, e.xe || {
                        k: 0
                    }, 0, 0, this), this.ne = PropertyFactory.getProp(t, e.ne || {
                        k: 0
                    }, 0, 0, this), this.a = PropertyFactory.getProp(t, e.a, 0, .01, this), this.dynamicProperties.length || this.getValue()
                }
                return s.prototype = {
                    getMult: function(t) {
                        this._currentTextLength !== this.elem.textProperty.currentData.l.length && this.getValue();
                        var e = BezierFactory.getBezierEasing(this.ne.v / 100, 0, 1 - this.xe.v / 100, 1).get,
                            i = 0,
                            s = this.finalS,
                            r = this.finalE,
                            a = this.data.sh;
                        if (2 == a) i = e(i = r === s ? r <= t ? 1 : 0 : h(0, p(.5 / (r - s) + (t - s) / (r - s), 1)));
                        else if (3 == a) i = e(i = r === s ? r <= t ? 0 : 1 : 1 - h(0, p(.5 / (r - s) + (t - s) / (r - s), 1)));
                        else if (4 == a) r === s ? i = 0 : (i = h(0, p(.5 / (r - s) + (t - s) / (r - s), 1))) < .5 ? i *= 2 : i = 1 - 2 * (i - .5), i = e(i);
                        else if (5 == a) {
                            if (r === s) i = 0;
                            else {
                                var n = r - s,
                                    o = -n / 2 + (t = p(h(0, t + .5 - s), r - s)),
                                    l = n / 2;
                                i = Math.sqrt(1 - o * o / (l * l))
                            }
                            i = e(i)
                        } else i = 6 == a ? e(i = r === s ? 0 : (t = p(h(0, t + .5 - s), r - s), (1 + Math.cos(Math.PI + 2 * Math.PI * t / (r - s))) / 2)) : (t >= d(s) && (i = t - s < 0 ? 1 - (s - t) : h(0, p(r - t, 1))), e(i));
                        return i * this.a.v
                    },
                    getValue: function(t) {
                        this.iterateDynamicProperties(), this._mdf = t || this._mdf, this._currentTextLength = this.elem.textProperty.currentData.l.length || 0, t && 2 === this.data.r && (this.e.v = this._currentTextLength);
                        var e = 2 === this.data.r ? 1 : 100 / this.data.totalChars,
                            i = this.o.v / e,
                            s = this.s.v / e + i,
                            r = this.e.v / e + i;
                        if (r < s) {
                            var a = s;
                            s = r, r = a
                        }
                        this.finalS = s, this.finalE = r
                    }
                }, extendPrototype([DynamicPropertyContainer], s), {
                    getTextSelectorProp: function(t, e, i) {
                        return new s(t, e, i)
                    }
                }
            }(),
            pool_factory = function(t, e, i, s) {
                var r = 0,
                    a = t,
                    n = createSizedArray(a);
                return {
                    newElement: function() {
                        return r ? n[r -= 1] : e()
                    },
                    release: function(t) {
                        r === a && (n = pooling.double(n), a *= 2), i && i(t), n[r] = t, r += 1
                    }
                }
            },
            pooling = {
                double: function(t) {
                    return t.concat(createSizedArray(t.length))
                }
            },
            point_pool = pool_factory(8, function() {
                return createTypedArray("float32", 2)
            }),
            shape_pool = (EA = pool_factory(4, function() {
                return new ShapePath
            }, function(t) {
                var e, i = t._length;
                for (e = 0; e < i; e += 1) point_pool.release(t.v[e]), point_pool.release(t.i[e]), point_pool.release(t.o[e]), t.v[e] = null, t.i[e] = null, t.o[e] = null;
                t._length = 0, t.c = !1
            }), EA.clone = function(t) {
                var e, i = EA.newElement(),
                    s = void 0 === t._length ? t.v.length : t._length;
                for (i.setLength(s), i.c = t.c, e = 0; e < s; e += 1) i.setTripleAt(t.v[e][0], t.v[e][1], t.o[e][0], t.o[e][1], t.i[e][0], t.i[e][1], e);
                return i
            }, EA),
            EA, shapeCollection_pool = (NA = {
                newShapeCollection: function() {
                    return OA ? QA[OA -= 1] : new ShapeCollection
                },
                release: function(t) {
                    var e, i = t._length;
                    for (e = 0; e < i; e += 1) shape_pool.release(t.shapes[e]);
                    t._length = 0, OA === PA && (QA = pooling.double(QA), PA *= 2), QA[OA] = t, OA += 1
                }
            }, OA = 0, PA = 4, QA = createSizedArray(PA), NA),
            NA, OA, PA, QA, segments_length_pool = pool_factory(8, function() {
                return {
                    lengths: [],
                    totalLength: 0
                }
            }, function(t) {
                var e, i = t.lengths.length;
                for (e = 0; e < i; e += 1) bezier_length_pool.release(t.lengths[e]);
                t.lengths.length = 0
            }),
            bezier_length_pool = pool_factory(8, function() {
                return {
                    addedLength: 0,
                    percents: createTypedArray("float32", defaultCurveSegments),
                    lengths: createTypedArray("float32", defaultCurveSegments)
                }
            });
        function BaseRenderer() {}
        function SVGRenderer(t, e) {
            this.animationItem = t, this.layers = null, this.renderedFrame = -1, this.svgElement = createNS("svg");
            var i = "";
            if (e && e.title) {
                var s = createNS("title"),
                    r = createElementID();
                s.setAttribute("id", r), s.textContent = e.title, this.svgElement.appendChild(s), i += r
            }
            if (e && e.description) {
                var a = createNS("desc"),
                    n = createElementID();
                a.setAttribute("id", n), a.textContent = e.description, this.svgElement.appendChild(a), i += " " + n
            }
            i && this.svgElement.setAttribute("aria-labelledby", i);
            var o = createNS("defs");
            this.svgElement.appendChild(o);
            var l = createNS("g");
            this.svgElement.appendChild(l), this.layerElement = l, this.renderConfig = {
                preserveAspectRatio: e && e.preserveAspectRatio || "xMidYMid meet",
                imagePreserveAspectRatio: e && e.imagePreserveAspectRatio || "xMidYMid slice",
                progressiveLoad: e && e.progressiveLoad || !1,
                hideOnTransparent: !e || !1 !== e.hideOnTransparent,
                viewBoxOnly: e && e.viewBoxOnly || !1,
                viewBoxSize: e && e.viewBoxSize || !1,
                className: e && e.className || "",
                focusable: e && e.focusable
            }, this.globalData = {
                _mdf: !1,
                frameNum: -1,
                defs: o,
                renderConfig: this.renderConfig
            }, this.elements = [], this.pendingElements = [], this.destroyed = !1, this.rendererType = "svg"
        }
        function CanvasRenderer(t, e) {
            this.animationItem = t, this.renderConfig = {
                clearCanvas: !e || void 0 === e.clearCanvas || e.clearCanvas,
                context: e && e.context || null,
                progressiveLoad: e && e.progressiveLoad || !1,
                preserveAspectRatio: e && e.preserveAspectRatio || "xMidYMid meet",
                imagePreserveAspectRatio: e && e.imagePreserveAspectRatio || "xMidYMid slice",
                className: e && e.className || ""
            }, this.renderConfig.dpr = e && e.dpr || 1, this.animationItem.wrapper && (this.renderConfig.dpr = e && e.dpr || window.devicePixelRatio || 1), this.renderedFrame = -1, this.globalData = {
                frameNum: -1,
                _mdf: !1,
                renderConfig: this.renderConfig,
                currentGlobalAlpha: -1
            }, this.contextData = new CVContextData, this.elements = [], this.pendingElements = [], this.transformMat = new Matrix, this.completeLayers = !1, this.rendererType = "canvas"
        }
        function HybridRenderer(t, e) {
            this.animationItem = t, this.layers = null, this.renderedFrame = -1, this.renderConfig = {
                className: e && e.className || "",
                imagePreserveAspectRatio: e && e.imagePreserveAspectRatio || "xMidYMid slice",
                hideOnTransparent: !e || !1 !== e.hideOnTransparent
            }, this.globalData = {
                _mdf: !1,
                frameNum: -1,
                renderConfig: this.renderConfig
            }, this.pendingElements = [], this.elements = [], this.threeDElements = [], this.destroyed = !1, this.camera = null, this.supports3d = !0, this.rendererType = "html"
        }
        function MaskElement(t, e, i) {
            this.data = t, this.element = e, this.globalData = i, this.storedData = [], this.masksProperties = this.data.masksProperties || [], this.maskElement = null;
            var s, r = this.globalData.defs,
                a = this.masksProperties ? this.masksProperties.length : 0;
            this.viewData = createSizedArray(a), this.solidPath = "";
            var n, o, l, h, p, d, c, f = this.masksProperties,
                u = 0,
                m = [],
                g = createElementID(),
                v = "clipPath",
                y = "clip-path";
            for (s = 0; s < a; s++)
                if (("a" !== f[s].mode && "n" !== f[s].mode || f[s].inv || 100 !== f[s].o.k || f[s].o.x) && (y = v = "mask"), "s" != f[s].mode && "i" != f[s].mode || 0 !== u ? h = null : ((h = createNS("rect")).setAttribute("fill", "#ffffff"), h.setAttribute("width", this.element.comp.data.w || 0), h.setAttribute("height", this.element.comp.data.h || 0), m.push(h)), n = createNS("path"), "n" != f[s].mode) {
                    var _;
                    if (u += 1, n.setAttribute("fill", "s" === f[s].mode ? "#000000" : "#ffffff"), n.setAttribute("clip-rule", "nonzero"), 0 !== f[s].x.k ? (y = v = "mask", c = PropertyFactory.getProp(this.element, f[s].x, 0, null, this.element), _ = createElementID(), (p = createNS("filter")).setAttribute("id", _), (d = createNS("feMorphology")).setAttribute("operator", "erode"), d.setAttribute("in", "SourceGraphic"), d.setAttribute("radius", "0"), p.appendChild(d), r.appendChild(p), n.setAttribute("stroke", "s" === f[s].mode ? "#000000" : "#ffffff")) : c = d = null, this.storedData[s] = {
                            elem: n,
                            x: c,
                            expan: d,
                            lastPath: "",
                            lastOperator: "",
                            filterId: _,
                            lastRadius: 0
                        }, "i" == f[s].mode) {
                        l = m.length;
                        var b = createNS("g");
                        for (o = 0; o < l; o += 1) b.appendChild(m[o]);
                        var x = createNS("mask");
                        x.setAttribute("mask-type", "alpha"), x.setAttribute("id", g + "_" + u), x.appendChild(n), r.appendChild(x), b.setAttribute("mask", "url(" + locationHref + "#" + g + "_" + u + ")"), m.length = 0, m.push(b)
                    } else m.push(n);
                    f[s].inv && !this.solidPath && (this.solidPath = this.createLayerSolidPath()), this.viewData[s] = {
                        elem: n,
                        lastPath: "",
                        op: PropertyFactory.getProp(this.element, f[s].o, 0, .01, this.element),
                        prop: ShapePropertyFactory.getShapeProp(this.element, f[s], 3),
                        invRect: h
                    }, this.viewData[s].prop.k || this.drawPath(f[s], this.viewData[s].prop.v, this.viewData[s])
                } else this.viewData[s] = {
                    op: PropertyFactory.getProp(this.element, f[s].o, 0, .01, this.element),
                    prop: ShapePropertyFactory.getShapeProp(this.element, f[s], 3),
                    elem: n,
                    lastPath: ""
                }, r.appendChild(n);
            for (this.maskElement = createNS(v), a = m.length, s = 0; s < a; s += 1) this.maskElement.appendChild(m[s]);
            0 < u && (this.maskElement.setAttribute("id", g), this.element.maskedElement.setAttribute(y, "url(" + locationHref + "#" + g + ")"), r.appendChild(this.maskElement)), this.viewData.length && this.element.addRenderableComponent(this)
        }
        function HierarchyElement() {}
        function FrameElement() {}
        function TransformElement() {}
        function RenderableElement() {}
        function RenderableDOMElement() {}
        function ProcessedElement(t, e) {
            this.elem = t, this.pos = e
        }
        function SVGStyleData(t, e) {
            this.data = t, this.type = t.ty, this.d = "", this.lvl = e, this._mdf = !1, this.closed = !0 === t.hd, this.pElem = createNS("path"), this.msElem = null
        }
        function SVGShapeData(t, e, i) {
            this.caches = [], this.styles = [], this.transformers = t, this.lStr = "", this.sh = i, this.lvl = e, this._isAnimated = !!i.k;
            for (var s = 0, r = t.length; s < r;) {
                if (t[s].mProps.dynamicProperties.length) {
                    this._isAnimated = !0;
                    break
                }
                s += 1
            }
        }
        function SVGTransformData(t, e, i) {
            this.transform = {
                mProps: t,
                op: e,
                container: i
            }, this.elements = [], this._isAnimated = this.transform.mProps.dynamicProperties.length || this.transform.op.effectsSequence.length
        }
        function SVGStrokeStyleData(t, e, i) {
            this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.o = PropertyFactory.getProp(t, e.o, 0, .01, this), this.w = PropertyFactory.getProp(t, e.w, 0, null, this), this.d = new DashProperty(t, e.d || {}, "svg", this), this.c = PropertyFactory.getProp(t, e.c, 1, 255, this), this.style = i, this._isAnimated = !!this._isAnimated
        }
        function SVGFillStyleData(t, e, i) {
            this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.o = PropertyFactory.getProp(t, e.o, 0, .01, this), this.c = PropertyFactory.getProp(t, e.c, 1, 255, this), this.style = i
        }
        function SVGGradientFillStyleData(t, e, i) {
            this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.initGradientData(t, e, i)
        }
        function SVGGradientStrokeStyleData(t, e, i) {
            this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.w = PropertyFactory.getProp(t, e.w, 0, null, this), this.d = new DashProperty(t, e.d || {}, "svg", this), this.initGradientData(t, e, i), this._isAnimated = !!this._isAnimated
        }
        function ShapeGroupData() {
            this.it = [], this.prevViewData = [], this.gr = createNS("g")
        }
        BaseRenderer.prototype.checkLayers = function(t) {
            var e, i, s = this.layers.length;
            for (this.completeLayers = !0, e = s - 1; 0 <= e; e--) this.elements[e] || (i = this.layers[e]).ip - i.st <= t - this.layers[e].st && i.op - i.st > t - this.layers[e].st && this.buildItem(e), this.completeLayers = !!this.elements[e] && this.completeLayers;
            this.checkPendingElements()
        }, BaseRenderer.prototype.createItem = function(t) {
            switch (t.ty) {
                case 2:
                    return this.createImage(t);
                case 0:
                    return this.createComp(t);
                case 1:
                    return this.createSolid(t);
                case 3:
                    return this.createNull(t);
                case 4:
                    return this.createShape(t);
                case 5:
                    return this.createText(t);
                case 13:
                    return this.createCamera(t)
            }
            return this.createNull(t)
        }, BaseRenderer.prototype.createCamera = function() {
            throw new Error("You're using a 3d camera. Try the html renderer.")
        }, BaseRenderer.prototype.buildAllItems = function() {
            var t, e = this.layers.length;
            for (t = 0; t < e; t += 1) this.buildItem(t);
            this.checkPendingElements()
        }, BaseRenderer.prototype.includeLayers = function(t) {
            this.completeLayers = !1;
            var e, i, s = t.length,
                r = this.layers.length;
            for (e = 0; e < s; e += 1)
                for (i = 0; i < r;) {
                    if (this.layers[i].id == t[e].id) {
                        this.layers[i] = t[e];
                        break
                    }
                    i += 1
                }
        }, BaseRenderer.prototype.setProjectInterface = function(t) {
            this.globalData.projectInterface = t
        }, BaseRenderer.prototype.initItems = function() {
            this.globalData.progressiveLoad || this.buildAllItems()
        }, BaseRenderer.prototype.buildElementParenting = function(t, e, i) {
            for (var s = this.elements, r = this.layers, a = 0, n = r.length; a < n;) r[a].ind == e && (s[a] && !0 !== s[a] ? (i.push(s[a]), s[a].setAsParent(), void 0 !== r[a].parent ? this.buildElementParenting(t, r[a].parent, i) : t.setHierarchy(i)) : (this.buildItem(a), this.addPendingElement(t))), a += 1
        }, BaseRenderer.prototype.addPendingElement = function(t) {
            this.pendingElements.push(t)
        }, BaseRenderer.prototype.searchExtraCompositions = function(t) {
            var e, i = t.length;
            for (e = 0; e < i; e += 1)
                if (t[e].xt) {
                    var s = this.createComp(t[e]);
                    s.initExpressions(), this.globalData.projectInterface.registerComposition(s)
                }
        }, BaseRenderer.prototype.setupGlobalData = function(t, e) {
            this.globalData.fontManager = new FontManager, this.globalData.fontManager.addChars(t.chars), this.globalData.fontManager.addFonts(t.fonts, e), this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem), this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem), this.globalData.imageLoader = this.animationItem.imagePreloader, this.globalData.frameId = 0, this.globalData.frameRate = t.fr, this.globalData.nm = t.nm, this.globalData.compSize = {
                w: t.w,
                h: t.h
            }
        }, extendPrototype([BaseRenderer], SVGRenderer), SVGRenderer.prototype.createNull = function(t) {
            return new NullElement(t, this.globalData, this)
        }, SVGRenderer.prototype.createShape = function(t) {
            return new SVGShapeElement(t, this.globalData, this)
        }, SVGRenderer.prototype.createText = function(t) {
            return new SVGTextElement(t, this.globalData, this)
        }, SVGRenderer.prototype.createImage = function(t) {
            return new IImageElement(t, this.globalData, this)
        }, SVGRenderer.prototype.createComp = function(t) {
            return new SVGCompElement(t, this.globalData, this)
        }, SVGRenderer.prototype.createSolid = function(t) {
            return new ISolidElement(t, this.globalData, this)
        }, SVGRenderer.prototype.configAnimation = function(t) {
            this.svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.renderConfig.viewBoxSize ? this.svgElement.setAttribute("viewBox", this.renderConfig.viewBoxSize) : this.svgElement.setAttribute("viewBox", "0 0 " + t.w + " " + t.h), this.renderConfig.viewBoxOnly || (this.svgElement.setAttribute("width", t.w), this.svgElement.setAttribute("height", t.h), this.svgElement.style.width = "100%", this.svgElement.style.height = "100%", this.svgElement.style.transform = "translate3d(0,0,0)"), this.renderConfig.className && this.svgElement.setAttribute("class", this.renderConfig.className), void 0 !== this.renderConfig.focusable && this.svgElement.setAttribute("focusable", this.renderConfig.focusable), this.svgElement.setAttribute("preserveAspectRatio", this.renderConfig.preserveAspectRatio), this.animationItem.wrapper.appendChild(this.svgElement);
            var e = this.globalData.defs;
            this.setupGlobalData(t, e), this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.data = t;
            var i = createNS("clipPath"),
                s = createNS("rect");
            s.setAttribute("width", t.w), s.setAttribute("height", t.h), s.setAttribute("x", 0), s.setAttribute("y", 0);
            var r = createElementID();
            i.setAttribute("id", r), i.appendChild(s), this.layerElement.setAttribute("clip-path", "url(" + locationHref + "#" + r + ")"), e.appendChild(i), this.layers = t.layers, this.elements = createSizedArray(t.layers.length)
        }, SVGRenderer.prototype.destroy = function() {
            this.animationItem.wrapper.innerHTML = "", this.layerElement = null, this.globalData.defs = null;
            var t, e = this.layers ? this.layers.length : 0;
            for (t = 0; t < e; t++) this.elements[t] && this.elements[t].destroy();
            this.elements.length = 0, this.destroyed = !0, this.animationItem = null
        }, SVGRenderer.prototype.updateContainerSize = function() {}, SVGRenderer.prototype.buildItem = function(t) {
            var e = this.elements;
            if (!e[t] && 99 != this.layers[t].ty) {
                e[t] = !0;
                var i = this.createItem(this.layers[t]);
                e[t] = i, expressionsPlugin && (0 === this.layers[t].ty && this.globalData.projectInterface.registerComposition(i), i.initExpressions()), this.appendElementInPos(i, t), this.layers[t].tt && (this.elements[t - 1] && !0 !== this.elements[t - 1] ? i.setMatte(e[t - 1].layerId) : (this.buildItem(t - 1), this.addPendingElement(i)))
            }
        }, SVGRenderer.prototype.checkPendingElements = function() {
            for (; this.pendingElements.length;) {
                var t = this.pendingElements.pop();
                if (t.checkParenting(), t.data.tt)
                    for (var e = 0, i = this.elements.length; e < i;) {
                        if (this.elements[e] === t) {
                            t.setMatte(this.elements[e - 1].layerId);
                            break
                        }
                        e += 1
                    }
            }
        }, SVGRenderer.prototype.renderFrame = function(t) {
            if (this.renderedFrame !== t && !this.destroyed) {
                null === t ? t = this.renderedFrame : this.renderedFrame = t, this.globalData.frameNum = t, this.globalData.frameId += 1, this.globalData.projectInterface.currentFrame = t, this.globalData._mdf = !1;
                var e, i = this.layers.length;
                for (this.completeLayers || this.checkLayers(t), e = i - 1; 0 <= e; e--)(this.completeLayers || this.elements[e]) && this.elements[e].prepareFrame(t - this.layers[e].st);
                if (this.globalData._mdf)
                    for (e = 0; e < i; e += 1)(this.completeLayers || this.elements[e]) && this.elements[e].renderFrame()
            }
        }, SVGRenderer.prototype.appendElementInPos = function(t, e) {
            var i = t.getBaseElement();
            if (i) {
                for (var s, r = 0; r < e;) this.elements[r] && !0 !== this.elements[r] && this.elements[r].getBaseElement() && (s = this.elements[r].getBaseElement()), r += 1;
                s ? this.layerElement.insertBefore(i, s) : this.layerElement.appendChild(i)
            }
        }, SVGRenderer.prototype.hide = function() {
            this.layerElement.style.display = "none"
        }, SVGRenderer.prototype.show = function() {
            this.layerElement.style.display = "block"
        }, extendPrototype([BaseRenderer], CanvasRenderer), CanvasRenderer.prototype.createShape = function(t) {
            return new CVShapeElement(t, this.globalData, this)
        }, CanvasRenderer.prototype.createText = function(t) {
            return new CVTextElement(t, this.globalData, this)
        }, CanvasRenderer.prototype.createImage = function(t) {
            return new CVImageElement(t, this.globalData, this)
        }, CanvasRenderer.prototype.createComp = function(t) {
            return new CVCompElement(t, this.globalData, this)
        }, CanvasRenderer.prototype.createSolid = function(t) {
            return new CVSolidElement(t, this.globalData, this)
        }, CanvasRenderer.prototype.createNull = SVGRenderer.prototype.createNull, CanvasRenderer.prototype.ctxTransform = function(t) {
            if (1 !== t[0] || 0 !== t[1] || 0 !== t[4] || 1 !== t[5] || 0 !== t[12] || 0 !== t[13])
                if (this.renderConfig.clearCanvas) {
                    this.transformMat.cloneFromProps(t);
                    var e = this.contextData.cTr.props;
                    this.transformMat.transform(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]), this.contextData.cTr.cloneFromProps(this.transformMat.props);
                    var i = this.contextData.cTr.props;
                    this.canvasContext.setTransform(i[0], i[1], i[4], i[5], i[12], i[13])
                } else this.canvasContext.transform(t[0], t[1], t[4], t[5], t[12], t[13])
        }, CanvasRenderer.prototype.ctxOpacity = function(t) {
            if (!this.renderConfig.clearCanvas) return this.canvasContext.globalAlpha *= t < 0 ? 0 : t, void(this.globalData.currentGlobalAlpha = this.contextData.cO);
            this.contextData.cO *= t < 0 ? 0 : t, this.globalData.currentGlobalAlpha !== this.contextData.cO && (this.canvasContext.globalAlpha = this.contextData.cO, this.globalData.currentGlobalAlpha = this.contextData.cO)
        }, CanvasRenderer.prototype.reset = function() {
            this.renderConfig.clearCanvas ? this.contextData.reset() : this.canvasContext.restore()
        }, CanvasRenderer.prototype.save = function(t) {
            if (this.renderConfig.clearCanvas) {
                t && this.canvasContext.save();
                var e = this.contextData.cTr.props;
                this.contextData._length <= this.contextData.cArrPos && this.contextData.duplicate();
                var i, s = this.contextData.saved[this.contextData.cArrPos];
                for (i = 0; i < 16; i += 1) s[i] = e[i];
                this.contextData.savedOp[this.contextData.cArrPos] = this.contextData.cO, this.contextData.cArrPos += 1
            } else this.canvasContext.save()
        }, CanvasRenderer.prototype.restore = function(t) {
            if (this.renderConfig.clearCanvas) {
                t && (this.canvasContext.restore(), this.globalData.blendMode = "source-over"), this.contextData.cArrPos -= 1;
                var e, i = this.contextData.saved[this.contextData.cArrPos],
                    s = this.contextData.cTr.props;
                for (e = 0; e < 16; e += 1) s[e] = i[e];
                this.canvasContext.setTransform(i[0], i[1], i[4], i[5], i[12], i[13]), i = this.contextData.savedOp[this.contextData.cArrPos], this.contextData.cO = i, this.globalData.currentGlobalAlpha !== i && (this.canvasContext.globalAlpha = i, this.globalData.currentGlobalAlpha = i)
            } else this.canvasContext.restore()
        }, CanvasRenderer.prototype.configAnimation = function(t) {
            this.animationItem.wrapper ? (this.animationItem.container = createTag("canvas"), this.animationItem.container.style.width = "100%", this.animationItem.container.style.height = "100%", this.animationItem.container.style.transformOrigin = this.animationItem.container.style.mozTransformOrigin = this.animationItem.container.style.webkitTransformOrigin = this.animationItem.container.style["-webkit-transform"] = "0px 0px 0px", this.animationItem.wrapper.appendChild(this.animationItem.container), this.canvasContext = this.animationItem.container.getContext("2d"), this.renderConfig.className && this.animationItem.container.setAttribute("class", this.renderConfig.className)) : this.canvasContext = this.renderConfig.context, this.data = t, this.layers = t.layers, this.transformCanvas = {
                w: t.w,
                h: t.h,
                sx: 0,
                sy: 0,
                tx: 0,
                ty: 0
            }, this.setupGlobalData(t, document.body), this.globalData.canvasContext = this.canvasContext, (this.globalData.renderer = this).globalData.isDashed = !1, this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.globalData.transformCanvas = this.transformCanvas, this.elements = createSizedArray(t.layers.length), this.updateContainerSize()
        }, CanvasRenderer.prototype.updateContainerSize = function() {
            var t, e, i, s;
            if (this.reset(), this.animationItem.wrapper && this.animationItem.container ? (t = this.animationItem.wrapper.offsetWidth, e = this.animationItem.wrapper.offsetHeight, this.animationItem.container.setAttribute("width", t * this.renderConfig.dpr), this.animationItem.container.setAttribute("height", e * this.renderConfig.dpr)) : (t = this.canvasContext.canvas.width * this.renderConfig.dpr, e = this.canvasContext.canvas.height * this.renderConfig.dpr), -1 !== this.renderConfig.preserveAspectRatio.indexOf("meet") || -1 !== this.renderConfig.preserveAspectRatio.indexOf("slice")) {
                var r = this.renderConfig.preserveAspectRatio.split(" "),
                    a = r[1] || "meet",
                    n = r[0] || "xMidYMid",
                    o = n.substr(0, 4),
                    l = n.substr(4);
                i = t / e, s = this.transformCanvas.w / this.transformCanvas.h, this.transformCanvas.sy = i < s && "meet" === a || s < i && "slice" === a ? (this.transformCanvas.sx = t / (this.transformCanvas.w / this.renderConfig.dpr), t / (this.transformCanvas.w / this.renderConfig.dpr)) : (this.transformCanvas.sx = e / (this.transformCanvas.h / this.renderConfig.dpr), e / (this.transformCanvas.h / this.renderConfig.dpr)), this.transformCanvas.tx = "xMid" === o && (s < i && "meet" === a || i < s && "slice" === a) ? (t - this.transformCanvas.w * (e / this.transformCanvas.h)) / 2 * this.renderConfig.dpr : "xMax" === o && (s < i && "meet" === a || i < s && "slice" === a) ? (t - this.transformCanvas.w * (e / this.transformCanvas.h)) * this.renderConfig.dpr : 0, this.transformCanvas.ty = "YMid" === l && (i < s && "meet" === a || s < i && "slice" === a) ? (e - this.transformCanvas.h * (t / this.transformCanvas.w)) / 2 * this.renderConfig.dpr : "YMax" === l && (i < s && "meet" === a || s < i && "slice" === a) ? (e - this.transformCanvas.h * (t / this.transformCanvas.w)) * this.renderConfig.dpr : 0
            } else "none" == this.renderConfig.preserveAspectRatio ? (this.transformCanvas.sx = t / (this.transformCanvas.w / this.renderConfig.dpr), this.transformCanvas.sy = e / (this.transformCanvas.h / this.renderConfig.dpr)) : (this.transformCanvas.sx = this.renderConfig.dpr, this.transformCanvas.sy = this.renderConfig.dpr), this.transformCanvas.tx = 0, this.transformCanvas.ty = 0;
            this.transformCanvas.props = [this.transformCanvas.sx, 0, 0, 0, 0, this.transformCanvas.sy, 0, 0, 0, 0, 1, 0, this.transformCanvas.tx, this.transformCanvas.ty, 0, 1], this.ctxTransform(this.transformCanvas.props), this.canvasContext.beginPath(), this.canvasContext.rect(0, 0, this.transformCanvas.w, this.transformCanvas.h), this.canvasContext.closePath(), this.canvasContext.clip(), this.renderFrame(this.renderedFrame, !0)
        }, CanvasRenderer.prototype.destroy = function() {
            var t;
            for (this.renderConfig.clearCanvas && (this.animationItem.wrapper.innerHTML = ""), t = (this.layers ? this.layers.length : 0) - 1; 0 <= t; t -= 1) this.elements[t] && this.elements[t].destroy();
            this.elements.length = 0, this.globalData.canvasContext = null, this.animationItem.container = null, this.destroyed = !0
        }, CanvasRenderer.prototype.renderFrame = function(t, e) {
            if ((this.renderedFrame !== t || !0 !== this.renderConfig.clearCanvas || e) && !this.destroyed && -1 !== t) {
                this.renderedFrame = t, this.globalData.frameNum = t - this.animationItem._isFirstFrame, this.globalData.frameId += 1, this.globalData._mdf = !this.renderConfig.clearCanvas || e, this.globalData.projectInterface.currentFrame = t;
                var i, s = this.layers.length;
                for (this.completeLayers || this.checkLayers(t), i = 0; i < s; i++)(this.completeLayers || this.elements[i]) && this.elements[i].prepareFrame(t - this.layers[i].st);
                if (this.globalData._mdf) {
                    for (!0 === this.renderConfig.clearCanvas ? this.canvasContext.clearRect(0, 0, this.transformCanvas.w, this.transformCanvas.h) : this.save(), i = s - 1; 0 <= i; i -= 1)(this.completeLayers || this.elements[i]) && this.elements[i].renderFrame();
                    !0 !== this.renderConfig.clearCanvas && this.restore()
                }
            }
        }, CanvasRenderer.prototype.buildItem = function(t) {
            var e = this.elements;
            if (!e[t] && 99 != this.layers[t].ty) {
                var i = this.createItem(this.layers[t], this, this.globalData);
                (e[t] = i).initExpressions()
            }
        }, CanvasRenderer.prototype.checkPendingElements = function() {
            for (; this.pendingElements.length;) this.pendingElements.pop().checkParenting()
        }, CanvasRenderer.prototype.hide = function() {
            this.animationItem.container.style.display = "none"
        }, CanvasRenderer.prototype.show = function() {
            this.animationItem.container.style.display = "block"
        }, extendPrototype([BaseRenderer], HybridRenderer), HybridRenderer.prototype.buildItem = SVGRenderer.prototype.buildItem, HybridRenderer.prototype.checkPendingElements = function() {
            for (; this.pendingElements.length;) this.pendingElements.pop().checkParenting()
        }, HybridRenderer.prototype.appendElementInPos = function(t, e) {
            var i = t.getBaseElement();
            if (i) {
                var s = this.layers[e];
                if (s.ddd && this.supports3d) this.addTo3dContainer(i, e);
                else if (this.threeDElements) this.addTo3dContainer(i, e);
                else {
                    for (var r, a, n = 0; n < e;) this.elements[n] && !0 !== this.elements[n] && this.elements[n].getBaseElement && (a = this.elements[n], r = (this.layers[n].ddd ? this.getThreeDContainerByPos(n) : a.getBaseElement()) || r), n += 1;
                    r ? s.ddd && this.supports3d || this.layerElement.insertBefore(i, r) : s.ddd && this.supports3d || this.layerElement.appendChild(i)
                }
            }
        }, HybridRenderer.prototype.createShape = function(t) {
            return this.supports3d ? new HShapeElement(t, this.globalData, this) : new SVGShapeElement(t, this.globalData, this)
        }, HybridRenderer.prototype.createText = function(t) {
            return this.supports3d ? new HTextElement(t, this.globalData, this) : new SVGTextElement(t, this.globalData, this)
        }, HybridRenderer.prototype.createCamera = function(t) {
            return this.camera = new HCameraElement(t, this.globalData, this), this.camera
        }, HybridRenderer.prototype.createImage = function(t) {
            return this.supports3d ? new HImageElement(t, this.globalData, this) : new IImageElement(t, this.globalData, this)
        }, HybridRenderer.prototype.createComp = function(t) {
            return this.supports3d ? new HCompElement(t, this.globalData, this) : new SVGCompElement(t, this.globalData, this)
        }, HybridRenderer.prototype.createSolid = function(t) {
            return this.supports3d ? new HSolidElement(t, this.globalData, this) : new ISolidElement(t, this.globalData, this)
        }, HybridRenderer.prototype.createNull = SVGRenderer.prototype.createNull, HybridRenderer.prototype.getThreeDContainerByPos = function(t) {
            for (var e = 0, i = this.threeDElements.length; e < i;) {
                if (this.threeDElements[e].startPos <= t && this.threeDElements[e].endPos >= t) return this.threeDElements[e].perspectiveElem;
                e += 1
            }
        }, HybridRenderer.prototype.createThreeDContainer = function(t, e) {
            var i = createTag("div");
            styleDiv(i);
            var s = createTag("div");
            styleDiv(s), "3d" === e && (i.style.width = this.globalData.compSize.w + "px", i.style.height = this.globalData.compSize.h + "px", i.style.transformOrigin = i.style.mozTransformOrigin = i.style.webkitTransformOrigin = "50% 50%", s.style.transform = s.style.webkitTransform = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)"), i.appendChild(s);
            var r = {
                container: s,
                perspectiveElem: i,
                startPos: t,
                endPos: t,
                type: e
            };
            return this.threeDElements.push(r), r
        }, HybridRenderer.prototype.build3dContainers = function() {
            var t, e, i = this.layers.length,
                s = "";
            for (t = 0; t < i; t += 1) this.layers[t].ddd && 3 !== this.layers[t].ty ? "3d" !== s && (s = "3d", e = this.createThreeDContainer(t, "3d")) : "2d" !== s && (s = "2d", e = this.createThreeDContainer(t, "2d")), e.endPos = Math.max(e.endPos, t);
            for (t = (i = this.threeDElements.length) - 1; 0 <= t; t--) this.resizerElem.appendChild(this.threeDElements[t].perspectiveElem)
        }, HybridRenderer.prototype.addTo3dContainer = function(t, e) {
            for (var i = 0, s = this.threeDElements.length; i < s;) {
                if (e <= this.threeDElements[i].endPos) {
                    for (var r, a = this.threeDElements[i].startPos; a < e;) this.elements[a] && this.elements[a].getBaseElement && (r = this.elements[a].getBaseElement()), a += 1;
                    r ? this.threeDElements[i].container.insertBefore(t, r) : this.threeDElements[i].container.appendChild(t);
                    break
                }
                i += 1
            }
        }, HybridRenderer.prototype.configAnimation = function(t) {
            var e = createTag("div"),
                i = this.animationItem.wrapper;
            e.style.width = t.w + "px", e.style.height = t.h + "px", styleDiv(this.resizerElem = e), e.style.transformStyle = e.style.webkitTransformStyle = e.style.mozTransformStyle = "flat", this.renderConfig.className && e.setAttribute("class", this.renderConfig.className), i.appendChild(e), e.style.overflow = "hidden";
            var s = createNS("svg");
            s.setAttribute("width", "1"), s.setAttribute("height", "1"), styleDiv(s), this.resizerElem.appendChild(s);
            var r = createNS("defs");
            s.appendChild(r), this.data = t, this.setupGlobalData(t, s), this.globalData.defs = r, this.layers = t.layers, this.layerElement = this.resizerElem, this.build3dContainers(), this.updateContainerSize()
        }, HybridRenderer.prototype.destroy = function() {
            this.animationItem.wrapper.innerHTML = "", this.animationItem.container = null, this.globalData.defs = null;
            var t, e = this.layers ? this.layers.length : 0;
            for (t = 0; t < e; t++) this.elements[t].destroy();
            this.elements.length = 0, this.destroyed = !0, this.animationItem = null
        }, HybridRenderer.prototype.updateContainerSize = function() {
            var t, e, i, s, r = this.animationItem.wrapper.offsetWidth,
                a = this.animationItem.wrapper.offsetHeight;
            s = r / a < this.globalData.compSize.w / this.globalData.compSize.h ? (t = r / this.globalData.compSize.w, e = r / this.globalData.compSize.w, i = 0, (a - this.globalData.compSize.h * (r / this.globalData.compSize.w)) / 2) : (t = a / this.globalData.compSize.h, e = a / this.globalData.compSize.h, i = (r - this.globalData.compSize.w * (a / this.globalData.compSize.h)) / 2, 0), this.resizerElem.style.transform = this.resizerElem.style.webkitTransform = "matrix3d(" + t + ",0,0,0,0," + e + ",0,0,0,0,1,0," + i + "," + s + ",0,1)"
        }, HybridRenderer.prototype.renderFrame = SVGRenderer.prototype.renderFrame, HybridRenderer.prototype.hide = function() {
            this.resizerElem.style.display = "none"
        }, HybridRenderer.prototype.show = function() {
            this.resizerElem.style.display = "block"
        }, HybridRenderer.prototype.initItems = function() {
            if (this.buildAllItems(), this.camera) this.camera.setup();
            else {
                var t, e = this.globalData.compSize.w,
                    i = this.globalData.compSize.h,
                    s = this.threeDElements.length;
                for (t = 0; t < s; t += 1) this.threeDElements[t].perspectiveElem.style.perspective = this.threeDElements[t].perspectiveElem.style.webkitPerspective = Math.sqrt(Math.pow(e, 2) + Math.pow(i, 2)) + "px"
            }
        }, HybridRenderer.prototype.searchExtraCompositions = function(t) {
            var e, i = t.length,
                s = createTag("div");
            for (e = 0; e < i; e += 1)
                if (t[e].xt) {
                    var r = this.createComp(t[e], s, this.globalData.comp, null);
                    r.initExpressions(), this.globalData.projectInterface.registerComposition(r)
                }
        }, MaskElement.prototype.getMaskProperty = function(t) {
            return this.viewData[t].prop
        }, MaskElement.prototype.renderFrame = function(t) {
            var e, i = this.element.finalTransform.mat,
                s = this.masksProperties.length;
            for (e = 0; e < s; e++)
                if ((this.viewData[e].prop._mdf || t) && this.drawPath(this.masksProperties[e], this.viewData[e].prop.v, this.viewData[e]), (this.viewData[e].op._mdf || t) && this.viewData[e].elem.setAttribute("fill-opacity", this.viewData[e].op.v), "n" !== this.masksProperties[e].mode && (this.viewData[e].invRect && (this.element.finalTransform.mProp._mdf || t) && (this.viewData[e].invRect.setAttribute("x", -i.props[12]), this.viewData[e].invRect.setAttribute("y", -i.props[13])), this.storedData[e].x && (this.storedData[e].x._mdf || t))) {
                    var r = this.storedData[e].expan;
                    this.storedData[e].x.v < 0 ? ("erode" !== this.storedData[e].lastOperator && (this.storedData[e].lastOperator = "erode", this.storedData[e].elem.setAttribute("filter", "url(" + locationHref + "#" + this.storedData[e].filterId + ")")), r.setAttribute("radius", -this.storedData[e].x.v)) : ("dilate" !== this.storedData[e].lastOperator && (this.storedData[e].lastOperator = "dilate", this.storedData[e].elem.setAttribute("filter", null)), this.storedData[e].elem.setAttribute("stroke-width", 2 * this.storedData[e].x.v))
                }
        }, MaskElement.prototype.getMaskelement = function() {
            return this.maskElement
        }, MaskElement.prototype.createLayerSolidPath = function() {
            var t = "M0,0 ";
            return t += " h" + this.globalData.compSize.w, t += " v" + this.globalData.compSize.h, (t += " h-" + this.globalData.compSize.w) + " v-" + this.globalData.compSize.h + " "
        }, MaskElement.prototype.drawPath = function(t, e, i) {
            var s, r, a = " M" + e.v[0][0] + "," + e.v[0][1];
            for (r = e._length, s = 1; s < r; s += 1) a += " C" + e.o[s - 1][0] + "," + e.o[s - 1][1] + " " + e.i[s][0] + "," + e.i[s][1] + " " + e.v[s][0] + "," + e.v[s][1];
            if (e.c && 1 < r && (a += " C" + e.o[s - 1][0] + "," + e.o[s - 1][1] + " " + e.i[0][0] + "," + e.i[0][1] + " " + e.v[0][0] + "," + e.v[0][1]), i.lastPath !== a) {
                var n = "";
                i.elem && (e.c && (n = t.inv ? this.solidPath + a : a), i.elem.setAttribute("d", n)), i.lastPath = a
            }
        }, MaskElement.prototype.destroy = function() {
            this.element = null, this.globalData = null, this.maskElement = null, this.data = null, this.masksProperties = null
        }, HierarchyElement.prototype = {
            initHierarchy: function() {
                this.hierarchy = [], this._isParent = !1, this.checkParenting()
            },
            setHierarchy: function(t) {
                this.hierarchy = t
            },
            setAsParent: function() {
                this._isParent = !0
            },
            checkParenting: function() {
                void 0 !== this.data.parent && this.comp.buildElementParenting(this, this.data.parent, [])
            }
        }, FrameElement.prototype = {
            initFrame: function() {
                this._isFirstFrame = !1, this.dynamicProperties = [], this._mdf = !1
            },
            prepareProperties: function(t, e) {
                var i, s = this.dynamicProperties.length;
                for (i = 0; i < s; i += 1)(e || this._isParent && "transform" === this.dynamicProperties[i].propType) && (this.dynamicProperties[i].getValue(), this.dynamicProperties[i]._mdf && (this.globalData._mdf = !0, this._mdf = !0))
            },
            addDynamicProperty: function(t) {
                -1 === this.dynamicProperties.indexOf(t) && this.dynamicProperties.push(t)
            }
        }, TransformElement.prototype = {
            initTransform: function() {
                this.finalTransform = {
                    mProp: this.data.ks ? TransformPropertyFactory.getTransformProperty(this, this.data.ks, this) : {
                        o: 0
                    },
                    _matMdf: !1,
                    _opMdf: !1,
                    mat: new Matrix
                }, this.data.ao && (this.finalTransform.mProp.autoOriented = !0), this.data.ty
            },
            renderTransform: function() {
                if (this.finalTransform._opMdf = this.finalTransform.mProp.o._mdf || this._isFirstFrame, this.finalTransform._matMdf = this.finalTransform.mProp._mdf || this._isFirstFrame, this.hierarchy) {
                    var t, e = this.finalTransform.mat,
                        i = 0,
                        s = this.hierarchy.length;
                    if (!this.finalTransform._matMdf)
                        for (; i < s;) {
                            if (this.hierarchy[i].finalTransform.mProp._mdf) {
                                this.finalTransform._matMdf = !0;
                                break
                            }
                            i += 1
                        }
                    if (this.finalTransform._matMdf)
                        for (t = this.finalTransform.mProp.v.props, e.cloneFromProps(t), i = 0; i < s; i += 1) t = this.hierarchy[i].finalTransform.mProp.v.props, e.transform(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15])
                }
            },
            globalToLocal: function(t) {
                var e = [];
                e.push(this.finalTransform);
                for (var i = !0, s = this.comp; i;) s.finalTransform ? (s.data.hasMask && e.splice(0, 0, s.finalTransform), s = s.comp) : i = !1;
                var r, a, n = e.length;
                for (r = 0; r < n; r += 1) a = e[r].mat.applyToPointArray(0, 0, 0), t = [t[0] - a[0], t[1] - a[1], 0];
                return t
            },
            mHelper: new Matrix
        }, RenderableElement.prototype = {
            initRenderable: function() {
                this.isInRange = !1, this.hidden = !1, this.isTransparent = !1, this.renderableComponents = []
            },
            addRenderableComponent: function(t) {
                -1 === this.renderableComponents.indexOf(t) && this.renderableComponents.push(t)
            },
            removeRenderableComponent: function(t) {
                -1 !== this.renderableComponents.indexOf(t) && this.renderableComponents.splice(this.renderableComponents.indexOf(t), 1)
            },
            prepareRenderableFrame: function(t) {
                this.checkLayerLimits(t)
            },
            checkTransparency: function() {
                this.finalTransform.mProp.o.v <= 0 ? !this.isTransparent && this.globalData.renderConfig.hideOnTransparent && (this.isTransparent = !0, this.hide()) : this.isTransparent && (this.isTransparent = !1, this.show())
            },
            checkLayerLimits: function(t) {
                this.data.ip - this.data.st <= t && this.data.op - this.data.st > t ? !0 !== this.isInRange && (this.globalData._mdf = !0, this._mdf = !0, this.isInRange = !0, this.show()) : !1 !== this.isInRange && (this.globalData._mdf = !0, this.isInRange = !1, this.hide())
            },
            renderRenderable: function() {
                var t, e = this.renderableComponents.length;
                for (t = 0; t < e; t += 1) this.renderableComponents[t].renderFrame(this._isFirstFrame)
            },
            sourceRectAtTime: function() {
                return {
                    top: 0,
                    left: 0,
                    width: 100,
                    height: 100
                }
            },
            getLayerSize: function() {
                return 5 === this.data.ty ? {
                    w: this.data.textData.width,
                    h: this.data.textData.height
                } : {
                    w: this.data.width,
                    h: this.data.height
                }
            }
        }, extendPrototype([RenderableElement, createProxyFunction({
            initElement: function(t, e, i) {
                this.initFrame(), this.initBaseData(t, e, i), this.initTransform(t, e, i), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide()
            },
            hide: function() {
                this.hidden || this.isInRange && !this.isTransparent || ((this.baseElement || this.layerElement).style.display = "none", this.hidden = !0)
            },
            show: function() {
                this.isInRange && !this.isTransparent && (this.data.hd || ((this.baseElement || this.layerElement).style.display = "block"), this.hidden = !1, this._isFirstFrame = !0)
            },
            renderFrame: function() {
                this.data.hd || this.hidden || (this.renderTransform(), this.renderRenderable(), this.renderElement(), this.renderInnerContent(), this._isFirstFrame && (this._isFirstFrame = !1))
            },
            renderInnerContent: function() {},
            prepareFrame: function(t) {
                this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), this.checkTransparency()
            },
            destroy: function() {
                this.innerElem = null, this.destroyBaseElement()
            }
        })], RenderableDOMElement), SVGStyleData.prototype.reset = function() {
            this.d = "", this._mdf = !1
        }, SVGShapeData.prototype.setAsAnimated = function() {
            this._isAnimated = !0
        }, extendPrototype([DynamicPropertyContainer], SVGStrokeStyleData), extendPrototype([DynamicPropertyContainer], SVGFillStyleData), SVGGradientFillStyleData.prototype.initGradientData = function(t, e, i) {
            this.o = PropertyFactory.getProp(t, e.o, 0, .01, this), this.s = PropertyFactory.getProp(t, e.s, 1, null, this), this.e = PropertyFactory.getProp(t, e.e, 1, null, this), this.h = PropertyFactory.getProp(t, e.h || {
                k: 0
            }, 0, .01, this), this.a = PropertyFactory.getProp(t, e.a || {
                k: 0
            }, 0, degToRads, this), this.g = new GradientProperty(t, e.g, this), this.style = i, this.stops = [], this.setGradientData(i.pElem, e), this.setGradientOpacity(e, i), this._isAnimated = !!this._isAnimated
        }, SVGGradientFillStyleData.prototype.setGradientData = function(t, e) {
            var i = createElementID(),
                s = createNS(1 === e.t ? "linearGradient" : "radialGradient");
            s.setAttribute("id", i), s.setAttribute("spreadMethod", "pad"), s.setAttribute("gradientUnits", "userSpaceOnUse");
            var r, a, n, o = [];
            for (n = 4 * e.g.p, a = 0; a < n; a += 4) r = createNS("stop"), s.appendChild(r), o.push(r);
            t.setAttribute("gf" === e.ty ? "fill" : "stroke", "url(" + locationHref + "#" + i + ")"), this.gf = s, this.cst = o
        }, SVGGradientFillStyleData.prototype.setGradientOpacity = function(t, e) {
            if (this.g._hasOpacity && !this.g._collapsable) {
                var i, s, r, a = createNS("mask"),
                    n = createNS("path");
                a.appendChild(n);
                var o = createElementID(),
                    l = createElementID();
                a.setAttribute("id", l);
                var h = createNS(1 === t.t ? "linearGradient" : "radialGradient");
                h.setAttribute("id", o), h.setAttribute("spreadMethod", "pad"), h.setAttribute("gradientUnits", "userSpaceOnUse"), r = t.g.k.k[0].s ? t.g.k.k[0].s.length : t.g.k.k.length;
                var p = this.stops;
                for (s = 4 * t.g.p; s < r; s += 2)(i = createNS("stop")).setAttribute("stop-color", "rgb(255,255,255)"), h.appendChild(i), p.push(i);
                n.setAttribute("gf" === t.ty ? "fill" : "stroke", "url(" + locationHref + "#" + o + ")"), this.of = h, this.ms = a, this.ost = p, this.maskId = l, e.msElem = n
            }
        }, extendPrototype([DynamicPropertyContainer], SVGGradientFillStyleData), extendPrototype([SVGGradientFillStyleData, DynamicPropertyContainer], SVGGradientStrokeStyleData);
        var SVGElementsRenderer = function() {
            var g = new Matrix,
                v = new Matrix;
            function e(t, e, i) {
                (i || e.transform.op._mdf) && e.transform.container.setAttribute("opacity", e.transform.op.v), (i || e.transform.mProps._mdf) && e.transform.container.setAttribute("transform", e.transform.mProps.v.to2dCSS())
            }
            function i(t, e, i) {
                var s, r, a, n, o, l, h, p, d, c, f, u = e.styles.length,
                    m = e.lvl;
                for (l = 0; l < u; l += 1) {
                    if (n = e.sh._mdf || i, e.styles[l].lvl < m) {
                        for (p = v.reset(), c = m - e.styles[l].lvl, f = e.transformers.length - 1; !n && 0 < c;) n = e.transformers[f].mProps._mdf || n, c--, f--;
                        if (n)
                            for (c = m - e.styles[l].lvl, f = e.transformers.length - 1; 0 < c;) d = e.transformers[f].mProps.v.props, p.transform(d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8], d[9], d[10], d[11], d[12], d[13], d[14], d[15]), c--, f--
                    } else p = g;
                    if (r = (h = e.sh.paths)._length, n) {
                        for (a = "", s = 0; s < r; s += 1)(o = h.shapes[s]) && o._length && (a += buildShapeString(o, o._length, o.c, p));
                        e.caches[l] = a
                    } else a = e.caches[l];
                    e.styles[l].d += !0 === t.hd ? "" : a, e.styles[l]._mdf = n || e.styles[l]._mdf
                }
            }
            function s(t, e, i) {
                var s = e.style;
                (e.c._mdf || i) && s.pElem.setAttribute("fill", "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o._mdf || i) && s.pElem.setAttribute("fill-opacity", e.o.v)
            }
            function r(t, e, i) {
                a(t, e, i), n(t, e, i)
            }
            function a(t, e, i) {
                var s, r, a, n, o, l = e.gf,
                    h = e.g._hasOpacity,
                    p = e.s.v,
                    d = e.e.v;
                if (e.o._mdf || i) {
                    var c = "gf" === t.ty ? "fill-opacity" : "stroke-opacity";
                    e.style.pElem.setAttribute(c, e.o.v)
                }
                if (e.s._mdf || i) {
                    var f = 1 === t.t ? "x1" : "cx",
                        u = "x1" === f ? "y1" : "cy";
                    l.setAttribute(f, p[0]), l.setAttribute(u, p[1]), h && !e.g._collapsable && (e.of.setAttribute(f, p[0]), e.of.setAttribute(u, p[1]))
                }
                if (e.g._cmdf || i) {
                    s = e.cst;
                    var m = e.g.c;
                    for (a = s.length, r = 0; r < a; r += 1)(n = s[r]).setAttribute("offset", m[4 * r] + "%"), n.setAttribute("stop-color", "rgb(" + m[4 * r + 1] + "," + m[4 * r + 2] + "," + m[4 * r + 3] + ")")
                }
                if (h && (e.g._omdf || i)) {
                    var g = e.g.o;
                    for (a = (s = e.g._collapsable ? e.cst : e.ost).length, r = 0; r < a; r += 1) n = s[r], e.g._collapsable || n.setAttribute("offset", g[2 * r] + "%"), n.setAttribute("stop-opacity", g[2 * r + 1])
                }
                if (1 === t.t)(e.e._mdf || i) && (l.setAttribute("x2", d[0]), l.setAttribute("y2", d[1]), h && !e.g._collapsable && (e.of.setAttribute("x2", d[0]), e.of.setAttribute("y2", d[1])));
                else if ((e.s._mdf || e.e._mdf || i) && (o = Math.sqrt(Math.pow(p[0] - d[0], 2) + Math.pow(p[1] - d[1], 2)), l.setAttribute("r", o), h && !e.g._collapsable && e.of.setAttribute("r", o)), e.e._mdf || e.h._mdf || e.a._mdf || i) {
                    o || (o = Math.sqrt(Math.pow(p[0] - d[0], 2) + Math.pow(p[1] - d[1], 2)));
                    var v = Math.atan2(d[1] - p[1], d[0] - p[0]),
                        y = o * (1 <= e.h.v ? .99 : e.h.v <= -1 ? -.99 : e.h.v),
                        _ = Math.cos(v + e.a.v) * y + p[0],
                        b = Math.sin(v + e.a.v) * y + p[1];
                    l.setAttribute("fx", _), l.setAttribute("fy", b), h && !e.g._collapsable && (e.of.setAttribute("fx", _), e.of.setAttribute("fy", b))
                }
            }
            function n(t, e, i) {
                var s = e.style,
                    r = e.d;
                r && (r._mdf || i) && r.dashStr && (s.pElem.setAttribute("stroke-dasharray", r.dashStr), s.pElem.setAttribute("stroke-dashoffset", r.dashoffset[0])), e.c && (e.c._mdf || i) && s.pElem.setAttribute("stroke", "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o._mdf || i) && s.pElem.setAttribute("stroke-opacity", e.o.v), (e.w._mdf || i) && (s.pElem.setAttribute("stroke-width", e.w.v), s.msElem && s.msElem.setAttribute("stroke-width", e.w.v))
            }
            return {
                createRenderFunction: function(t) {
                    switch (t.ty, t.ty) {
                        case "fl":
                            return s;
                        case "gf":
                            return a;
                        case "gs":
                            return r;
                        case "st":
                            return n;
                        case "sh":
                        case "el":
                        case "rc":
                        case "sr":
                            return i;
                        case "tr":
                            return e
                    }
                }
            }
        }();
        function ShapeTransformManager() {
            this.sequences = {}, this.sequenceList = [], this.transform_key_count = 0
        }
        function CVShapeData(t, e, i, s) {
            this.styledShapes = [], this.tr = [0, 0, 0, 0, 0, 0];
            var r = 4;
            "rc" == e.ty ? r = 5 : "el" == e.ty ? r = 6 : "sr" == e.ty && (r = 7), this.sh = ShapePropertyFactory.getShapeProp(t, e, r, t);
            var a, n, o = i.length;
            for (a = 0; a < o; a += 1) i[a].closed || (n = {
                transforms: s.addTransformSequence(i[a].transforms),
                trNodes: []
            }, this.styledShapes.push(n), i[a].elements.push(n))
        }
        function BaseElement() {}
        function NullElement(t, e, i) {
            this.initFrame(), this.initBaseData(t, e, i), this.initFrame(), this.initTransform(t, e, i), this.initHierarchy()
        }
        function SVGBaseElement() {}
        function IShapeElement() {}
        function ITextElement() {}
        function ICompElement() {}
        function IImageElement(t, e, i) {
            this.assetData = e.getAssetData(t.refId), this.initElement(t, e, i), this.sourceRect = {
                top: 0,
                left: 0,
                width: this.assetData.w,
                height: this.assetData.h
            }
        }
        function ISolidElement(t, e, i) {
            this.initElement(t, e, i)
        }
        function SVGCompElement(t, e, i) {
            this.layers = t.layers, this.supports3d = !0, this.completeLayers = !1, this.pendingElements = [], this.elements = this.layers ? createSizedArray(this.layers.length) : [], this.initElement(t, e, i), this.tm = t.tm ? PropertyFactory.getProp(this, t.tm, 0, e.frameRate, this) : {
                _placeholder: !0
            }
        }
        function SVGTextElement(t, e, i) {
            this.textSpans = [], this.renderType = "svg", this.initElement(t, e, i)
        }
        function SVGShapeElement(t, e, i) {
            this.shapes = [], this.shapesData = t.shapes, this.stylesList = [], this.shapeModifiers = [], this.itemsData = [], this.processedElements = [], this.animatedContents = [], this.initElement(t, e, i), this.prevViewData = []
        }
        function SVGTintFilter(t, e) {
            this.filterManager = e;
            var i = createNS("feColorMatrix");
            if (i.setAttribute("type", "matrix"), i.setAttribute("color-interpolation-filters", "linearRGB"), i.setAttribute("values", "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"), i.setAttribute("result", "f1"), t.appendChild(i), (i = createNS("feColorMatrix")).setAttribute("type", "matrix"), i.setAttribute("color-interpolation-filters", "sRGB"), i.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"), i.setAttribute("result", "f2"), t.appendChild(i), this.matrixFilter = i, 100 !== e.effectElements[2].p.v || e.effectElements[2].p.k) {
                var s, r = createNS("feMerge");
                t.appendChild(r), (s = createNS("feMergeNode")).setAttribute("in", "SourceGraphic"), r.appendChild(s), (s = createNS("feMergeNode")).setAttribute("in", "f2"), r.appendChild(s)
            }
        }
        function SVGFillFilter(t, e) {
            this.filterManager = e;
            var i = createNS("feColorMatrix");
            i.setAttribute("type", "matrix"), i.setAttribute("color-interpolation-filters", "sRGB"), i.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"), t.appendChild(i), this.matrixFilter = i
        }
        function SVGGaussianBlurEffect(t, e) {
            t.setAttribute("x", "-100%"), t.setAttribute("y", "-100%"), t.setAttribute("width", "300%"), t.setAttribute("height", "300%"), this.filterManager = e;
            var i = createNS("feGaussianBlur");
            t.appendChild(i), this.feGaussianBlur = i
        }
        function SVGStrokeEffect(t, e) {
            this.initialized = !1, this.filterManager = e, this.elem = t, this.paths = []
        }
        function SVGTritoneFilter(t, e) {
            this.filterManager = e;
            var i = createNS("feColorMatrix");
            i.setAttribute("type", "matrix"), i.setAttribute("color-interpolation-filters", "linearRGB"), i.setAttribute("values", "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"), i.setAttribute("result", "f1"), t.appendChild(i);
            var s = createNS("feComponentTransfer");
            s.setAttribute("color-interpolation-filters", "sRGB"), t.appendChild(s), this.matrixFilter = s;
            var r = createNS("feFuncR");
            r.setAttribute("type", "table"), s.appendChild(r), this.feFuncR = r;
            var a = createNS("feFuncG");
            a.setAttribute("type", "table"), s.appendChild(a), this.feFuncG = a;
            var n = createNS("feFuncB");
            n.setAttribute("type", "table"), s.appendChild(n), this.feFuncB = n
        }
        function SVGProLevelsFilter(t, e) {
            this.filterManager = e;
            var i = this.filterManager.effectElements,
                s = createNS("feComponentTransfer");
            (i[10].p.k || 0 !== i[10].p.v || i[11].p.k || 1 !== i[11].p.v || i[12].p.k || 1 !== i[12].p.v || i[13].p.k || 0 !== i[13].p.v || i[14].p.k || 1 !== i[14].p.v) && (this.feFuncR = this.createFeFunc("feFuncR", s)), (i[17].p.k || 0 !== i[17].p.v || i[18].p.k || 1 !== i[18].p.v || i[19].p.k || 1 !== i[19].p.v || i[20].p.k || 0 !== i[20].p.v || i[21].p.k || 1 !== i[21].p.v) && (this.feFuncG = this.createFeFunc("feFuncG", s)), (i[24].p.k || 0 !== i[24].p.v || i[25].p.k || 1 !== i[25].p.v || i[26].p.k || 1 !== i[26].p.v || i[27].p.k || 0 !== i[27].p.v || i[28].p.k || 1 !== i[28].p.v) && (this.feFuncB = this.createFeFunc("feFuncB", s)), (i[31].p.k || 0 !== i[31].p.v || i[32].p.k || 1 !== i[32].p.v || i[33].p.k || 1 !== i[33].p.v || i[34].p.k || 0 !== i[34].p.v || i[35].p.k || 1 !== i[35].p.v) && (this.feFuncA = this.createFeFunc("feFuncA", s)), (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) && (s.setAttribute("color-interpolation-filters", "sRGB"), t.appendChild(s), s = createNS("feComponentTransfer")), (i[3].p.k || 0 !== i[3].p.v || i[4].p.k || 1 !== i[4].p.v || i[5].p.k || 1 !== i[5].p.v || i[6].p.k || 0 !== i[6].p.v || i[7].p.k || 1 !== i[7].p.v) && (s.setAttribute("color-interpolation-filters", "sRGB"), t.appendChild(s), this.feFuncRComposed = this.createFeFunc("feFuncR", s), this.feFuncGComposed = this.createFeFunc("feFuncG", s), this.feFuncBComposed = this.createFeFunc("feFuncB", s))
        }
        function SVGDropShadowEffect(t, e) {
            t.setAttribute("x", "-100%"), t.setAttribute("y", "-100%"), t.setAttribute("width", "400%"), t.setAttribute("height", "400%"), this.filterManager = e;
            var i = createNS("feGaussianBlur");
            i.setAttribute("in", "SourceAlpha"), i.setAttribute("result", "drop_shadow_1"), i.setAttribute("stdDeviation", "0"), this.feGaussianBlur = i, t.appendChild(i);
            var s = createNS("feOffset");
            s.setAttribute("dx", "25"), s.setAttribute("dy", "0"), s.setAttribute("in", "drop_shadow_1"), s.setAttribute("result", "drop_shadow_2"), this.feOffset = s, t.appendChild(s);
            var r = createNS("feFlood");
            r.setAttribute("flood-color", "#00ff00"), r.setAttribute("flood-opacity", "1"), r.setAttribute("result", "drop_shadow_3"), this.feFlood = r, t.appendChild(r);
            var a = createNS("feComposite");
            a.setAttribute("in", "drop_shadow_3"), a.setAttribute("in2", "drop_shadow_2"), a.setAttribute("operator", "in"), a.setAttribute("result", "drop_shadow_4"), t.appendChild(a);
            var n, o = createNS("feMerge");
            t.appendChild(o), n = createNS("feMergeNode"), o.appendChild(n), (n = createNS("feMergeNode")).setAttribute("in", "SourceGraphic"), this.feMergeNode = n, this.feMerge = o, this.originalNodeAdded = !1, o.appendChild(n)
        }
        ShapeTransformManager.prototype = {
            addTransformSequence: function(t) {
                var e, i = t.length,
                    s = "_";
                for (e = 0; e < i; e += 1) s += t[e].transform.key + "_";
                var r = this.sequences[s];
                return r || (r = {
                    transforms: [].concat(t),
                    finalTransform: new Matrix,
                    _mdf: !1
                }, this.sequences[s] = r, this.sequenceList.push(r)), r
            },
            processSequence: function(t, e) {
                for (var i, s = 0, r = t.transforms.length, a = e; s < r && !e;) {
                    if (t.transforms[s].transform.mProps._mdf) {
                        a = !0;
                        break
                    }
                    s += 1
                }
                if (a)
                    for (t.finalTransform.reset(), s = r - 1; 0 <= s; s -= 1) i = t.transforms[s].transform.mProps.v.props, t.finalTransform.transform(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8], i[9], i[10], i[11], i[12], i[13], i[14], i[15]);
                t._mdf = a
            },
            processSequences: function(t) {
                var e, i = this.sequenceList.length;
                for (e = 0; e < i; e += 1) this.processSequence(this.sequenceList[e], t)
            },
            getNewKey: function() {
                return "_" + this.transform_key_count++
            }
        }, CVShapeData.prototype.setAsAnimated = SVGShapeData.prototype.setAsAnimated, BaseElement.prototype = {
            checkMasks: function() {
                if (!this.data.hasMask) return !1;
                for (var t = 0, e = this.data.masksProperties.length; t < e;) {
                    if ("n" !== this.data.masksProperties[t].mode && !1 !== this.data.masksProperties[t].cl) return !0;
                    t += 1
                }
                return !1
            },
            initExpressions: function() {
                this.layerInterface = LayerExpressionInterface(this), this.data.hasMask && this.maskManager && this.layerInterface.registerMaskInterface(this.maskManager);
                var t = EffectsExpressionInterface.createEffectsInterface(this, this.layerInterface);
                this.layerInterface.registerEffectsInterface(t), 0 === this.data.ty || this.data.xt ? this.compInterface = CompExpressionInterface(this) : 4 === this.data.ty ? (this.layerInterface.shapeInterface = ShapeExpressionInterface(this.shapesData, this.itemsData, this.layerInterface), this.layerInterface.content = this.layerInterface.shapeInterface) : 5 === this.data.ty && (this.layerInterface.textInterface = TextExpressionInterface(this), this.layerInterface.text = this.layerInterface.textInterface)
            },
            setBlendMode: function() {
                var t = getBlendMode(this.data.bm);
                (this.baseElement || this.layerElement).style["mix-blend-mode"] = t
            },
            initBaseData: function(t, e, i) {
                this.globalData = e, this.comp = i, this.data = t, this.layerId = createElementID(), this.data.sr || (this.data.sr = 1), this.effectsManager = new EffectsManager(this.data, this, this.dynamicProperties)
            },
            getType: function() {
                return this.type
            },
            sourceRectAtTime: function() {}
        }, NullElement.prototype.prepareFrame = function(t) {
            this.prepareProperties(t, !0)
        }, NullElement.prototype.renderFrame = function() {}, NullElement.prototype.getBaseElement = function() {
            return null
        }, NullElement.prototype.destroy = function() {}, NullElement.prototype.sourceRectAtTime = function() {}, NullElement.prototype.hide = function() {}, extendPrototype([BaseElement, TransformElement, HierarchyElement, FrameElement], NullElement), SVGBaseElement.prototype = {
            initRendererElement: function() {
                this.layerElement = createNS("g")
            },
            createContainerElements: function() {
                this.matteElement = createNS("g"), this.transformedElement = this.layerElement, this.maskedElement = this.layerElement, this._sizeChanged = !1;
                var t, e, i, s = null;
                if (this.data.td) {
                    if (3 == this.data.td || 1 == this.data.td) {
                        var r = createNS("mask");
                        r.setAttribute("id", this.layerId), r.setAttribute("mask-type", 3 == this.data.td ? "luminance" : "alpha"), r.appendChild(this.layerElement), s = r, this.globalData.defs.appendChild(r), featureSupport.maskType || 1 != this.data.td || (r.setAttribute("mask-type", "luminance"), t = createElementID(), e = filtersFactory.createFilter(t), this.globalData.defs.appendChild(e), e.appendChild(filtersFactory.createAlphaToLuminanceFilter()), (i = createNS("g")).appendChild(this.layerElement), s = i, r.appendChild(i), i.setAttribute("filter", "url(" + locationHref + "#" + t + ")"))
                    } else if (2 == this.data.td) {
                        var a = createNS("mask");
                        a.setAttribute("id", this.layerId), a.setAttribute("mask-type", "alpha");
                        var n = createNS("g");
                        a.appendChild(n), t = createElementID(), e = filtersFactory.createFilter(t);
                        var o = createNS("feComponentTransfer");
                        o.setAttribute("in", "SourceGraphic"), e.appendChild(o);
                        var l = createNS("feFuncA");
                        l.setAttribute("type", "table"), l.setAttribute("tableValues", "1.0 0.0"), o.appendChild(l), this.globalData.defs.appendChild(e);
                        var h = createNS("rect");
                        h.setAttribute("width", this.comp.data.w), h.setAttribute("height", this.comp.data.h), h.setAttribute("x", "0"), h.setAttribute("y", "0"), h.setAttribute("fill", "#ffffff"), h.setAttribute("opacity", "0"), n.setAttribute("filter", "url(" + locationHref + "#" + t + ")"), n.appendChild(h), n.appendChild(this.layerElement), s = n, featureSupport.maskType || (a.setAttribute("mask-type", "luminance"), e.appendChild(filtersFactory.createAlphaToLuminanceFilter()), i = createNS("g"), n.appendChild(h), i.appendChild(this.layerElement), s = i, n.appendChild(i)), this.globalData.defs.appendChild(a)
                    }
                } else this.data.tt ? (this.matteElement.appendChild(this.layerElement), s = this.matteElement, this.baseElement = this.matteElement) : this.baseElement = this.layerElement;
                if (this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.data.cl && this.layerElement.setAttribute("class", this.data.cl), 0 === this.data.ty && !this.data.hd) {
                    var p = createNS("clipPath"),
                        d = createNS("path");
                    d.setAttribute("d", "M0,0 L" + this.data.w + ",0 L" + this.data.w + "," + this.data.h + " L0," + this.data.h + "z");
                    var c = createElementID();
                    if (p.setAttribute("id", c), p.appendChild(d), this.globalData.defs.appendChild(p), this.checkMasks()) {
                        var f = createNS("g");
                        f.setAttribute("clip-path", "url(" + locationHref + "#" + c + ")"), f.appendChild(this.layerElement), this.transformedElement = f, s ? s.appendChild(this.transformedElement) : this.baseElement = this.transformedElement
                    } else this.layerElement.setAttribute("clip-path", "url(" + locationHref + "#" + c + ")")
                }
                0 !== this.data.bm && this.setBlendMode()
            },
            renderElement: function() {
                this.finalTransform._matMdf && this.transformedElement.setAttribute("transform", this.finalTransform.mat.to2dCSS()), this.finalTransform._opMdf && this.transformedElement.setAttribute("opacity", this.finalTransform.mProp.o.v)
            },
            destroyBaseElement: function() {
                this.layerElement = null, this.matteElement = null, this.maskManager.destroy()
            },
            getBaseElement: function() {
                return this.data.hd ? null : this.baseElement
            },
            createRenderableComponents: function() {
                this.maskManager = new MaskElement(this.data, this, this.globalData), this.renderableEffectsManager = new SVGEffects(this)
            },
            setMatte: function(t) {
                this.matteElement && this.matteElement.setAttribute("mask", "url(" + locationHref + "#" + t + ")")
            }
        }, IShapeElement.prototype = {
            addShapeToModifiers: function(t) {
                var e, i = this.shapeModifiers.length;
                for (e = 0; e < i; e += 1) this.shapeModifiers[e].addShape(t)
            },
            isShapeInAnimatedModifiers: function(t) {
                for (var e = this.shapeModifiers.length; 0 < e;)
                    if (this.shapeModifiers[0].isAnimatedWithShape(t)) return !0;
                return !1
            },
            renderModifiers: function() {
                if (this.shapeModifiers.length) {
                    var t, e = this.shapes.length;
                    for (t = 0; t < e; t += 1) this.shapes[t].sh.reset();
                    for (t = (e = this.shapeModifiers.length) - 1; 0 <= t; t -= 1) this.shapeModifiers[t].processShapes(this._isFirstFrame)
                }
            },
            lcEnum: {
                1: "butt",
                2: "round",
                3: "square"
            },
            ljEnum: {
                1: "miter",
                2: "round",
                3: "bevel"
            },
            searchProcessedElement: function(t) {
                for (var e = this.processedElements, i = 0, s = e.length; i < s;) {
                    if (e[i].elem === t) return e[i].pos;
                    i += 1
                }
                return 0
            },
            addProcessedElement: function(t, e) {
                for (var i = this.processedElements, s = i.length; s;)
                    if (i[s -= 1].elem === t) return void(i[s].pos = e);
                i.push(new ProcessedElement(t, e))
            },
            prepareFrame: function(t) {
                this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange)
            }
        }, ITextElement.prototype.initElement = function(t, e, i) {
            this.lettersChangedFlag = !0, this.initFrame(), this.initBaseData(t, e, i), this.textProperty = new TextProperty(this, t.t, this.dynamicProperties), this.textAnimator = new TextAnimatorProperty(t.t, this.renderType, this), this.initTransform(t, e, i), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide(), this.textAnimator.searchProperties(this.dynamicProperties)
        }, ITextElement.prototype.prepareFrame = function(t) {
            this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), (this.textProperty._mdf || this.textProperty._isFirstFrame) && (this.buildNewText(), this.textProperty._isFirstFrame = !1, this.textProperty._mdf = !1)
        }, ITextElement.prototype.createPathShape = function(t, e) {
            var i, s, r = e.length,
                a = "";
            for (i = 0; i < r; i += 1) s = e[i].ks.k, a += buildShapeString(s, s.i.length, !0, t);
            return a
        }, ITextElement.prototype.updateDocumentData = function(t, e) {
            this.textProperty.updateDocumentData(t, e)
        }, ITextElement.prototype.canResizeFont = function(t) {
            this.textProperty.canResizeFont(t)
        }, ITextElement.prototype.setMinimumFontSize = function(t) {
            this.textProperty.setMinimumFontSize(t)
        }, ITextElement.prototype.applyTextPropertiesToMatrix = function(t, e, i, s, r) {
            switch (t.ps && e.translate(t.ps[0], t.ps[1] + t.ascent, 0), e.translate(0, -t.ls, 0), t.j) {
                case 1:
                    e.translate(t.justifyOffset + (t.boxWidth - t.lineWidths[i]), 0, 0);
                    break;
                case 2:
                    e.translate(t.justifyOffset + (t.boxWidth - t.lineWidths[i]) / 2, 0, 0)
            }
            e.translate(s, r, 0)
        }, ITextElement.prototype.buildColor = function(t) {
            return "rgb(" + Math.round(255 * t[0]) + "," + Math.round(255 * t[1]) + "," + Math.round(255 * t[2]) + ")"
        }, ITextElement.prototype.emptyProp = new LetterProps, ITextElement.prototype.destroy = function() {}, extendPrototype([BaseElement, TransformElement, HierarchyElement, FrameElement, RenderableDOMElement], ICompElement), ICompElement.prototype.initElement = function(t, e, i) {
            this.initFrame(), this.initBaseData(t, e, i), this.initTransform(t, e, i), this.initRenderable(), this.initHierarchy(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), !this.data.xt && e.progressiveLoad || this.buildAllItems(), this.hide()
        }, ICompElement.prototype.prepareFrame = function(t) {
            if (this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), this.isInRange || this.data.xt) {
                if (this.tm._placeholder) this.renderedFrame = t / this.data.sr;
                else {
                    var e = this.tm.v;
                    e === this.data.op && (e = this.data.op - 1), this.renderedFrame = e
                }
                var i, s = this.elements.length;
                for (this.completeLayers || this.checkLayers(this.renderedFrame), i = s - 1; 0 <= i; i -= 1)(this.completeLayers || this.elements[i]) && (this.elements[i].prepareFrame(this.renderedFrame - this.layers[i].st), this.elements[i]._mdf && (this._mdf = !0))
            }
        }, ICompElement.prototype.renderInnerContent = function() {
            var t, e = this.layers.length;
            for (t = 0; t < e; t += 1)(this.completeLayers || this.elements[t]) && this.elements[t].renderFrame()
        }, ICompElement.prototype.setElements = function(t) {
            this.elements = t
        }, ICompElement.prototype.getElements = function() {
            return this.elements
        }, ICompElement.prototype.destroyElements = function() {
            var t, e = this.layers.length;
            for (t = 0; t < e; t += 1) this.elements[t] && this.elements[t].destroy()
        }, ICompElement.prototype.destroy = function() {
            this.destroyElements(), this.destroyBaseElement()
        }, extendPrototype([BaseElement, TransformElement, SVGBaseElement, HierarchyElement, FrameElement, RenderableDOMElement], IImageElement), IImageElement.prototype.createContent = function() {
            var t = this.globalData.getAssetsPath(this.assetData);
            this.innerElem = createNS("image"), this.innerElem.setAttribute("width", this.assetData.w + "px"), this.innerElem.setAttribute("height", this.assetData.h + "px"), this.innerElem.setAttribute("preserveAspectRatio", this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio), this.innerElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", t), this.layerElement.appendChild(this.innerElem)
        }, IImageElement.prototype.sourceRectAtTime = function() {
            return this.sourceRect
        }, extendPrototype([IImageElement], ISolidElement), ISolidElement.prototype.createContent = function() {
            var t = createNS("rect");
            t.setAttribute("width", this.data.sw), t.setAttribute("height", this.data.sh), t.setAttribute("fill", this.data.sc), this.layerElement.appendChild(t)
        }, extendPrototype([SVGRenderer, ICompElement, SVGBaseElement], SVGCompElement), extendPrototype([BaseElement, TransformElement, SVGBaseElement, HierarchyElement, FrameElement, RenderableDOMElement, ITextElement], SVGTextElement), SVGTextElement.prototype.createContent = function() {
            this.data.singleShape && !this.globalData.fontManager.chars && (this.textContainer = createNS("text"))
        }, SVGTextElement.prototype.buildTextContents = function(t) {
            for (var e = 0, i = t.length, s = [], r = ""; e < i;) t[e] === String.fromCharCode(13) || t[e] === String.fromCharCode(3) ? (s.push(r), r = "") : r += t[e], e += 1;
            return s.push(r), s
        }, SVGTextElement.prototype.buildNewText = function() {
            var t, e, i = this.textProperty.currentData;
            this.renderedLetters = createSizedArray(i ? i.l.length : 0), i.fc ? this.layerElement.setAttribute("fill", this.buildColor(i.fc)) : this.layerElement.setAttribute("fill", "rgba(0,0,0,0)"), i.sc && (this.layerElement.setAttribute("stroke", this.buildColor(i.sc)), this.layerElement.setAttribute("stroke-width", i.sw)), this.layerElement.setAttribute("font-size", i.finalSize);
            var s = this.globalData.fontManager.getFontByName(i.f);
            if (s.fClass) this.layerElement.setAttribute("class", s.fClass);
            else {
                this.layerElement.setAttribute("font-family", s.fFamily);
                var r = i.fWeight,
                    a = i.fStyle;
                this.layerElement.setAttribute("font-style", a), this.layerElement.setAttribute("font-weight", r)
            }
            this.layerElement.setAttribute("aria-label", i.t);
            var n, o = i.l || [],
                l = !!this.globalData.fontManager.chars;
            e = o.length;
            var h, p = this.mHelper,
                d = "",
                c = this.data.singleShape,
                f = 0,
                u = 0,
                m = !0,
                g = i.tr / 1e3 * i.finalSize;
            if (!c || l || i.sz) {
                var v, y, _ = this.textSpans.length;
                for (t = 0; t < e; t += 1) l && c && 0 !== t || (n = t < _ ? this.textSpans[t] : createNS(l ? "path" : "text"), _ <= t && (n.setAttribute("stroke-linecap", "butt"), n.setAttribute("stroke-linejoin", "round"), n.setAttribute("stroke-miterlimit", "4"), this.textSpans[t] = n, this.layerElement.appendChild(n)), n.style.display = "inherit"), p.reset(), p.scale(i.finalSize / 100, i.finalSize / 100), c && (o[t].n && (f = -g, u += i.yOffset, u += m ? 1 : 0, m = !1), this.applyTextPropertiesToMatrix(i, p, o[t].line, f, u), f += o[t].l || 0, f += g), l ? (h = (v = (y = this.globalData.fontManager.getCharData(i.finalText[t], s.fStyle, this.globalData.fontManager.getFontByName(i.f).fFamily)) && y.data || {}).shapes ? v.shapes[0].it : [], c ? d += this.createPathShape(p, h) : n.setAttribute("d", this.createPathShape(p, h))) : (c && n.setAttribute("transform", "translate(" + p.props[12] + "," + p.props[13] + ")"), n.textContent = o[t].val, n.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve"));
                c && n && n.setAttribute("d", d)
            } else {
                var b = this.textContainer,
                    x = "start";
                switch (i.j) {
                    case 1:
                        x = "end";
                        break;
                    case 2:
                        x = "middle"
                }
                b.setAttribute("text-anchor", x), b.setAttribute("letter-spacing", g);
                var T = this.buildTextContents(i.finalText);
                for (e = T.length, u = i.ps ? i.ps[1] + i.ascent : 0, t = 0; t < e; t += 1)(n = this.textSpans[t] || createNS("tspan")).textContent = T[t], n.setAttribute("x", 0), n.setAttribute("y", u), n.style.display = "inherit", b.appendChild(n), this.textSpans[t] = n, u += i.finalLineHeight;
                this.layerElement.appendChild(b)
            }
            for (; t < this.textSpans.length;) this.textSpans[t].style.display = "none", t += 1;
            this._sizeChanged = !0
        }, SVGTextElement.prototype.sourceRectAtTime = function(t) {
            if (this.prepareFrame(this.comp.renderedFrame - this.data.st), this.renderInnerContent(), this._sizeChanged) {
                this._sizeChanged = !1;
                var e = this.layerElement.getBBox();
                this.bbox = {
                    top: e.y,
                    left: e.x,
                    width: e.width,
                    height: e.height
                }
            }
            return this.bbox
        }, SVGTextElement.prototype.renderInnerContent = function() {
            if (!this.data.singleShape && (this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag), this.lettersChangedFlag || this.textAnimator.lettersChangedFlag)) {
                var t, e;
                this._sizeChanged = !0;
                var i, s, r = this.textAnimator.renderedLetters,
                    a = this.textProperty.currentData.l;
                for (e = a.length, t = 0; t < e; t += 1) a[t].n || (i = r[t], s = this.textSpans[t], i._mdf.m && s.setAttribute("transform", i.m), i._mdf.o && s.setAttribute("opacity", i.o), i._mdf.sw && s.setAttribute("stroke-width", i.sw), i._mdf.sc && s.setAttribute("stroke", i.sc), i._mdf.fc && s.setAttribute("fill", i.fc))
            }
        }, extendPrototype([BaseElement, TransformElement, SVGBaseElement, IShapeElement, HierarchyElement, FrameElement, RenderableDOMElement], SVGShapeElement), SVGShapeElement.prototype.initSecondaryElement = function() {}, SVGShapeElement.prototype.identityMatrix = new Matrix, SVGShapeElement.prototype.buildExpressionInterface = function() {}, SVGShapeElement.prototype.createContent = function() {
            this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes()
        }, SVGShapeElement.prototype.filterUniqueShapes = function() {
            var t, e, i, s, r = this.shapes.length,
                a = this.stylesList.length,
                n = [],
                o = !1;
            for (i = 0; i < a; i += 1) {
                for (s = this.stylesList[i], o = !1, t = n.length = 0; t < r; t += 1) - 1 !== (e = this.shapes[t]).styles.indexOf(s) && (n.push(e), o = e._isAnimated || o);
                1 < n.length && o && this.setShapesAsAnimated(n)
            }
        }, SVGShapeElement.prototype.setShapesAsAnimated = function(t) {
            var e, i = t.length;
            for (e = 0; e < i; e += 1) t[e].setAsAnimated()
        }, SVGShapeElement.prototype.createStyleElement = function(t, e) {
            var i, s = new SVGStyleData(t, e),
                r = s.pElem;
            return "st" === t.ty ? i = new SVGStrokeStyleData(this, t, s) : "fl" === t.ty ? i = new SVGFillStyleData(this, t, s) : "gf" !== t.ty && "gs" !== t.ty || (i = new("gf" === t.ty ? SVGGradientFillStyleData : SVGGradientStrokeStyleData)(this, t, s), this.globalData.defs.appendChild(i.gf), i.maskId && (this.globalData.defs.appendChild(i.ms), this.globalData.defs.appendChild(i.of), r.setAttribute("mask", "url(" + locationHref + "#" + i.maskId + ")"))), "st" !== t.ty && "gs" !== t.ty || (r.setAttribute("stroke-linecap", this.lcEnum[t.lc] || "round"), r.setAttribute("stroke-linejoin", this.ljEnum[t.lj] || "round"), r.setAttribute("fill-opacity", "0"), 1 === t.lj && r.setAttribute("stroke-miterlimit", t.ml)), 2 === t.r && r.setAttribute("fill-rule", "evenodd"), t.ln && r.setAttribute("id", t.ln), t.cl && r.setAttribute("class", t.cl), t.bm && (r.style["mix-blend-mode"] = getBlendMode(t.bm)), this.stylesList.push(s), this.addToAnimatedContents(t, i), i
        }, SVGShapeElement.prototype.createGroupElement = function(t) {
            var e = new ShapeGroupData;
            return t.ln && e.gr.setAttribute("id", t.ln), t.cl && e.gr.setAttribute("class", t.cl), t.bm && (e.gr.style["mix-blend-mode"] = getBlendMode(t.bm)), e
        }, SVGShapeElement.prototype.createTransformElement = function(t, e) {
            var i = TransformPropertyFactory.getTransformProperty(this, t, this),
                s = new SVGTransformData(i, i.o, e);
            return this.addToAnimatedContents(t, s), s
        }, SVGShapeElement.prototype.createShapeElement = function(t, e, i) {
            var s = 4;
            "rc" === t.ty ? s = 5 : "el" === t.ty ? s = 6 : "sr" === t.ty && (s = 7);
            var r = new SVGShapeData(e, i, ShapePropertyFactory.getShapeProp(this, t, s, this));
            return this.shapes.push(r), this.addShapeToModifiers(r), this.addToAnimatedContents(t, r), r
        }, SVGShapeElement.prototype.addToAnimatedContents = function(t, e) {
            for (var i = 0, s = this.animatedContents.length; i < s;) {
                if (this.animatedContents[i].element === e) return;
                i += 1
            }
            this.animatedContents.push({
                fn: SVGElementsRenderer.createRenderFunction(t),
                element: e,
                data: t
            })
        }, SVGShapeElement.prototype.setElementStyles = function(t) {
            var e, i = t.styles,
                s = this.stylesList.length;
            for (e = 0; e < s; e += 1) this.stylesList[e].closed || i.push(this.stylesList[e])
        }, SVGShapeElement.prototype.reloadShapes = function() {
            this._isFirstFrame = !0;
            var t, e = this.itemsData.length;
            for (t = 0; t < e; t += 1) this.prevViewData[t] = this.itemsData[t];
            for (this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes(), e = this.dynamicProperties.length, t = 0; t < e; t += 1) this.dynamicProperties[t].getValue();
            this.renderModifiers()
        }, SVGShapeElement.prototype.searchShapes = function(t, e, i, s, r, a, n) {
            var o, l, h, p, d, c, f = [].concat(a),
                u = t.length - 1,
                m = [],
                g = [];
            for (o = u; 0 <= o; o -= 1) {
                if ((c = this.searchProcessedElement(t[o])) ? e[o] = i[c - 1] : t[o]._render = n, "fl" == t[o].ty || "st" == t[o].ty || "gf" == t[o].ty || "gs" == t[o].ty) c ? e[o].style.closed = !1 : e[o] = this.createStyleElement(t[o], r), t[o]._render && s.appendChild(e[o].style.pElem), m.push(e[o].style);
                else if ("gr" == t[o].ty) {
                    if (c)
                        for (h = e[o].it.length, l = 0; l < h; l += 1) e[o].prevViewData[l] = e[o].it[l];
                    else e[o] = this.createGroupElement(t[o]);
                    this.searchShapes(t[o].it, e[o].it, e[o].prevViewData, e[o].gr, r + 1, f, n), t[o]._render && s.appendChild(e[o].gr)
                } else "tr" == t[o].ty ? (c || (e[o] = this.createTransformElement(t[o], s)), p = e[o].transform, f.push(p)) : "sh" == t[o].ty || "rc" == t[o].ty || "el" == t[o].ty || "sr" == t[o].ty ? (c || (e[o] = this.createShapeElement(t[o], f, r)), this.setElementStyles(e[o])) : "tm" == t[o].ty || "rd" == t[o].ty || "ms" == t[o].ty ? (c ? (d = e[o]).closed = !1 : ((d = ShapeModifiers.getModifier(t[o].ty)).init(this, t[o]), e[o] = d, this.shapeModifiers.push(d)), g.push(d)) : "rp" == t[o].ty && (c ? (d = e[o]).closed = !0 : (d = ShapeModifiers.getModifier(t[o].ty), (e[o] = d).init(this, t, o, e), this.shapeModifiers.push(d), n = !1), g.push(d));
                this.addProcessedElement(t[o], o + 1)
            }
            for (u = m.length, o = 0; o < u; o += 1) m[o].closed = !0;
            for (u = g.length, o = 0; o < u; o += 1) g[o].closed = !0
        }, SVGShapeElement.prototype.renderInnerContent = function() {
            this.renderModifiers();
            var t, e = this.stylesList.length;
            for (t = 0; t < e; t += 1) this.stylesList[t].reset();
            for (this.renderShape(), t = 0; t < e; t += 1)(this.stylesList[t]._mdf || this._isFirstFrame) && (this.stylesList[t].msElem && (this.stylesList[t].msElem.setAttribute("d", this.stylesList[t].d), this.stylesList[t].d = "M0 0" + this.stylesList[t].d), this.stylesList[t].pElem.setAttribute("d", this.stylesList[t].d || "M0 0"))
        }, SVGShapeElement.prototype.renderShape = function() {
            var t, e, i = this.animatedContents.length;
            for (t = 0; t < i; t += 1) e = this.animatedContents[t], (this._isFirstFrame || e.element._isAnimated) && !0 !== e.data && e.fn(e.data, e.element, this._isFirstFrame)
        }, SVGShapeElement.prototype.destroy = function() {
            this.destroyBaseElement(), this.shapesData = null, this.itemsData = null
        }, SVGTintFilter.prototype.renderFrame = function(t) {
            if (t || this.filterManager._mdf) {
                var e = this.filterManager.effectElements[0].p.v,
                    i = this.filterManager.effectElements[1].p.v,
                    s = this.filterManager.effectElements[2].p.v / 100;
                this.matrixFilter.setAttribute("values", i[0] - e[0] + " 0 0 0 " + e[0] + " " + (i[1] - e[1]) + " 0 0 0 " + e[1] + " " + (i[2] - e[2]) + " 0 0 0 " + e[2] + " 0 0 0 " + s + " 0")
            }
        }, SVGFillFilter.prototype.renderFrame = function(t) {
            if (t || this.filterManager._mdf) {
                var e = this.filterManager.effectElements[2].p.v,
                    i = this.filterManager.effectElements[6].p.v;
                this.matrixFilter.setAttribute("values", "0 0 0 0 " + e[0] + " 0 0 0 0 " + e[1] + " 0 0 0 0 " + e[2] + " 0 0 0 " + i + " 0")
            }
        }, SVGGaussianBlurEffect.prototype.renderFrame = function(t) {
            if (t || this.filterManager._mdf) {
                var e = .3 * this.filterManager.effectElements[0].p.v,
                    i = this.filterManager.effectElements[1].p.v,
                    s = 3 == i ? 0 : e,
                    r = 2 == i ? 0 : e;
                this.feGaussianBlur.setAttribute("stdDeviation", s + " " + r);
                var a = 1 == this.filterManager.effectElements[2].p.v ? "wrap" : "duplicate";
                this.feGaussianBlur.setAttribute("edgeMode", a)
            }
        }, SVGStrokeEffect.prototype.initialize = function() {
            var t, e, i, s, r = this.elem.layerElement.children || this.elem.layerElement.childNodes;
            for (1 === this.filterManager.effectElements[1].p.v ? (s = this.elem.maskManager.masksProperties.length, i = 0) : s = 1 + (i = this.filterManager.effectElements[0].p.v - 1), (e = createNS("g")).setAttribute("fill", "none"), e.setAttribute("stroke-linecap", "round"), e.setAttribute("stroke-dashoffset", 1); i < s; i += 1) t = createNS("path"), e.appendChild(t), this.paths.push({
                p: t,
                m: i
            });
            if (3 === this.filterManager.effectElements[10].p.v) {
                var a = createNS("mask"),
                    n = createElementID();
                a.setAttribute("id", n), a.setAttribute("mask-type", "alpha"), a.appendChild(e), this.elem.globalData.defs.appendChild(a);
                var o = createNS("g");
                for (o.setAttribute("mask", "url(" + locationHref + "#" + n + ")"); r[0];) o.appendChild(r[0]);
                this.elem.layerElement.appendChild(o), this.masker = a, e.setAttribute("stroke", "#fff")
            } else if (1 === this.filterManager.effectElements[10].p.v || 2 === this.filterManager.effectElements[10].p.v) {
                if (2 === this.filterManager.effectElements[10].p.v)
                    for (r = this.elem.layerElement.children || this.elem.layerElement.childNodes; r.length;) this.elem.layerElement.removeChild(r[0]);
                this.elem.layerElement.appendChild(e), this.elem.layerElement.removeAttribute("mask"), e.setAttribute("stroke", "#fff")
            }
            this.initialized = !0, this.pathMasker = e
        }, SVGStrokeEffect.prototype.renderFrame = function(t) {
            this.initialized || this.initialize();
            var e, i, s, r = this.paths.length;
            for (e = 0; e < r; e += 1)
                if (-1 !== this.paths[e].m && (i = this.elem.maskManager.viewData[this.paths[e].m], s = this.paths[e].p, (t || this.filterManager._mdf || i.prop._mdf) && s.setAttribute("d", i.lastPath), t || this.filterManager.effectElements[9].p._mdf || this.filterManager.effectElements[4].p._mdf || this.filterManager.effectElements[7].p._mdf || this.filterManager.effectElements[8].p._mdf || i.prop._mdf)) {
                    var a;
                    if (0 !== this.filterManager.effectElements[7].p.v || 100 !== this.filterManager.effectElements[8].p.v) {
                        var n = Math.min(this.filterManager.effectElements[7].p.v, this.filterManager.effectElements[8].p.v) / 100,
                            o = Math.max(this.filterManager.effectElements[7].p.v, this.filterManager.effectElements[8].p.v) / 100,
                            l = s.getTotalLength();
                        a = "0 0 0 " + l * n + " ";
                        var h, p = l * (o - n),
                            d = 1 + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v / 100,
                            c = Math.floor(p / d);
                        for (h = 0; h < c; h += 1) a += "1 " + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v / 100 + " ";
                        a += "0 " + 10 * l + " 0 0"
                    } else a = "1 " + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v / 100;
                    s.setAttribute("stroke-dasharray", a)
                }
            if ((t || this.filterManager.effectElements[4].p._mdf) && this.pathMasker.setAttribute("stroke-width", 2 * this.filterManager.effectElements[4].p.v), (t || this.filterManager.effectElements[6].p._mdf) && this.pathMasker.setAttribute("opacity", this.filterManager.effectElements[6].p.v), (1 === this.filterManager.effectElements[10].p.v || 2 === this.filterManager.effectElements[10].p.v) && (t || this.filterManager.effectElements[3].p._mdf)) {
                var f = this.filterManager.effectElements[3].p.v;
                this.pathMasker.setAttribute("stroke", "rgb(" + bm_floor(255 * f[0]) + "," + bm_floor(255 * f[1]) + "," + bm_floor(255 * f[2]) + ")")
            }
        }, SVGTritoneFilter.prototype.renderFrame = function(t) {
            if (t || this.filterManager._mdf) {
                var e = this.filterManager.effectElements[0].p.v,
                    i = this.filterManager.effectElements[1].p.v,
                    s = this.filterManager.effectElements[2].p.v,
                    r = s[0] + " " + i[0] + " " + e[0],
                    a = s[1] + " " + i[1] + " " + e[1],
                    n = s[2] + " " + i[2] + " " + e[2];
                this.feFuncR.setAttribute("tableValues", r), this.feFuncG.setAttribute("tableValues", a), this.feFuncB.setAttribute("tableValues", n)
            }
        }, SVGProLevelsFilter.prototype.createFeFunc = function(t, e) {
            var i = createNS(t);
            return i.setAttribute("type", "table"), e.appendChild(i), i
        }, SVGProLevelsFilter.prototype.getTableValue = function(t, e, i, s, r) {
            for (var a, n, o = 0, l = Math.min(t, e), h = Math.max(t, e), p = Array.call(null, {
                    length: 256
                }), d = 0, c = r - s, f = e - t; o <= 256;) n = (a = o / 256) <= l ? f < 0 ? r : s : h <= a ? f < 0 ? s : r : s + c * Math.pow((a - t) / f, 1 / i), p[d++] = n, o += 256 / 255;
            return p.join(" ")
        }, SVGProLevelsFilter.prototype.renderFrame = function(t) {
            if (t || this.filterManager._mdf) {
                var e, i = this.filterManager.effectElements;
                this.feFuncRComposed && (t || i[3].p._mdf || i[4].p._mdf || i[5].p._mdf || i[6].p._mdf || i[7].p._mdf) && (e = this.getTableValue(i[3].p.v, i[4].p.v, i[5].p.v, i[6].p.v, i[7].p.v), this.feFuncRComposed.setAttribute("tableValues", e), this.feFuncGComposed.setAttribute("tableValues", e), this.feFuncBComposed.setAttribute("tableValues", e)), this.feFuncR && (t || i[10].p._mdf || i[11].p._mdf || i[12].p._mdf || i[13].p._mdf || i[14].p._mdf) && (e = this.getTableValue(i[10].p.v, i[11].p.v, i[12].p.v, i[13].p.v, i[14].p.v), this.feFuncR.setAttribute("tableValues", e)), this.feFuncG && (t || i[17].p._mdf || i[18].p._mdf || i[19].p._mdf || i[20].p._mdf || i[21].p._mdf) && (e = this.getTableValue(i[17].p.v, i[18].p.v, i[19].p.v, i[20].p.v, i[21].p.v), this.feFuncG.setAttribute("tableValues", e)), this.feFuncB && (t || i[24].p._mdf || i[25].p._mdf || i[26].p._mdf || i[27].p._mdf || i[28].p._mdf) && (e = this.getTableValue(i[24].p.v, i[25].p.v, i[26].p.v, i[27].p.v, i[28].p.v), this.feFuncB.setAttribute("tableValues", e)), this.feFuncA && (t || i[31].p._mdf || i[32].p._mdf || i[33].p._mdf || i[34].p._mdf || i[35].p._mdf) && (e = this.getTableValue(i[31].p.v, i[32].p.v, i[33].p.v, i[34].p.v, i[35].p.v), this.feFuncA.setAttribute("tableValues", e))
            }
        }, SVGDropShadowEffect.prototype.renderFrame = function(t) {
            if (t || this.filterManager._mdf) {
                if ((t || this.filterManager.effectElements[4].p._mdf) && this.feGaussianBlur.setAttribute("stdDeviation", this.filterManager.effectElements[4].p.v / 4), t || this.filterManager.effectElements[0].p._mdf) {
                    var e = this.filterManager.effectElements[0].p.v;
                    this.feFlood.setAttribute("flood-color", rgbToHex(Math.round(255 * e[0]), Math.round(255 * e[1]), Math.round(255 * e[2])))
                }
                if ((t || this.filterManager.effectElements[1].p._mdf) && this.feFlood.setAttribute("flood-opacity", this.filterManager.effectElements[1].p.v / 255), t || this.filterManager.effectElements[2].p._mdf || this.filterManager.effectElements[3].p._mdf) {
                    var i = this.filterManager.effectElements[3].p.v,
                        s = (this.filterManager.effectElements[2].p.v - 90) * degToRads,
                        r = i * Math.cos(s),
                        a = i * Math.sin(s);
                    this.feOffset.setAttribute("dx", r), this.feOffset.setAttribute("dy", a)
                }
            }
        };
        var _svgMatteSymbols = [];
        function SVGMatte3Effect(t, e, i) {
            this.initialized = !1, this.filterManager = e, this.filterElem = t, (this.elem = i).matteElement = createNS("g"), i.matteElement.appendChild(i.layerElement), i.matteElement.appendChild(i.transformedElement), i.baseElement = i.matteElement
        }
        function SVGEffects(t) {
            var e, i, s = t.data.ef ? t.data.ef.length : 0,
                r = createElementID(),
                a = filtersFactory.createFilter(r),
                n = 0;
            for (this.filters = [], e = 0; e < s; e += 1) i = null, 20 === t.data.ef[e].ty ? (n += 1, i = new SVGTintFilter(a, t.effectsManager.effectElements[e])) : 21 === t.data.ef[e].ty ? (n += 1, i = new SVGFillFilter(a, t.effectsManager.effectElements[e])) : 22 === t.data.ef[e].ty ? i = new SVGStrokeEffect(t, t.effectsManager.effectElements[e]) : 23 === t.data.ef[e].ty ? (n += 1, i = new SVGTritoneFilter(a, t.effectsManager.effectElements[e])) : 24 === t.data.ef[e].ty ? (n += 1, i = new SVGProLevelsFilter(a, t.effectsManager.effectElements[e])) : 25 === t.data.ef[e].ty ? (n += 1, i = new SVGDropShadowEffect(a, t.effectsManager.effectElements[e])) : 28 === t.data.ef[e].ty ? i = new SVGMatte3Effect(a, t.effectsManager.effectElements[e], t) : 29 === t.data.ef[e].ty && (n += 1, i = new SVGGaussianBlurEffect(a, t.effectsManager.effectElements[e])), i && this.filters.push(i);
            n && (t.globalData.defs.appendChild(a), t.layerElement.setAttribute("filter", "url(" + locationHref + "#" + r + ")")), this.filters.length && t.addRenderableComponent(this)
        }
        function CVContextData() {
            var t;
            for (this.saved = [], this.cArrPos = 0, this.cTr = new Matrix, this.cO = 1, this.savedOp = createTypedArray("float32", 15), t = 0; t < 15; t += 1) this.saved[t] = createTypedArray("float32", 16);
            this._length = 15
        }
        function CVBaseElement() {}
        function CVImageElement(t, e, i) {
            this.assetData = e.getAssetData(t.refId), this.img = e.imageLoader.getImage(this.assetData), this.initElement(t, e, i)
        }
        function CVCompElement(t, e, i) {
            this.completeLayers = !1, this.layers = t.layers, this.pendingElements = [], this.elements = createSizedArray(this.layers.length), this.initElement(t, e, i), this.tm = t.tm ? PropertyFactory.getProp(this, t.tm, 0, e.frameRate, this) : {
                _placeholder: !0
            }
        }
        function CVMaskElement(t, e) {
            this.data = t, this.element = e, this.masksProperties = this.data.masksProperties || [], this.viewData = createSizedArray(this.masksProperties.length);
            var i, s = this.masksProperties.length,
                r = !1;
            for (i = 0; i < s; i++) "n" !== this.masksProperties[i].mode && (r = !0), this.viewData[i] = ShapePropertyFactory.getShapeProp(this.element, this.masksProperties[i], 3);
            (this.hasMasks = r) && this.element.addRenderableComponent(this)
        }
        function CVShapeElement(t, e, i) {
            this.shapes = [], this.shapesData = t.shapes, this.stylesList = [], this.itemsData = [], this.prevViewData = [], this.shapeModifiers = [], this.processedElements = [], this.transformsManager = new ShapeTransformManager, this.initElement(t, e, i)
        }
        function CVSolidElement(t, e, i) {
            this.initElement(t, e, i)
        }
        function CVTextElement(t, e, i) {
            this.textSpans = [], this.yOffset = 0, this.fillColorAnim = !1, this.strokeColorAnim = !1, this.strokeWidthAnim = !1, this.stroke = !1, this.fill = !1, this.justifyOffset = 0, this.currentRender = null, this.renderType = "canvas", this.values = {
                fill: "rgba(0,0,0,0)",
                stroke: "rgba(0,0,0,0)",
                sWidth: 0,
                fValue: ""
            }, this.initElement(t, e, i)
        }
        function CVEffects() {}
        function HBaseElement(t, e, i) {}
        function HSolidElement(t, e, i) {
            this.initElement(t, e, i)
        }
        function HCompElement(t, e, i) {
            this.layers = t.layers, this.supports3d = !t.hasMask, this.completeLayers = !1, this.pendingElements = [], this.elements = this.layers ? createSizedArray(this.layers.length) : [], this.initElement(t, e, i), this.tm = t.tm ? PropertyFactory.getProp(this, t.tm, 0, e.frameRate, this) : {
                _placeholder: !0
            }
        }
        function HShapeElement(t, e, i) {
            this.shapes = [], this.shapesData = t.shapes, this.stylesList = [], this.shapeModifiers = [], this.itemsData = [], this.processedElements = [], this.animatedContents = [], this.shapesContainer = createNS("g"), this.initElement(t, e, i), this.prevViewData = [], this.currentBBox = {
                x: 999999,
                y: -999999,
                h: 0,
                w: 0
            }
        }
        function HTextElement(t, e, i) {
            this.textSpans = [], this.textPaths = [], this.currentBBox = {
                x: 999999,
                y: -999999,
                h: 0,
                w: 0
            }, this.renderType = "svg", this.isMasked = !1, this.initElement(t, e, i)
        }
        function HImageElement(t, e, i) {
            this.assetData = e.getAssetData(t.refId), this.initElement(t, e, i)
        }
        function HCameraElement(t, e, i) {
            this.initFrame(), this.initBaseData(t, e, i), this.initHierarchy();
            var s = PropertyFactory.getProp;
            if (this.pe = s(this, t.pe, 0, 0, this), t.ks.p.s ? (this.px = s(this, t.ks.p.x, 1, 0, this), this.py = s(this, t.ks.p.y, 1, 0, this), this.pz = s(this, t.ks.p.z, 1, 0, this)) : this.p = s(this, t.ks.p, 1, 0, this), t.ks.a && (this.a = s(this, t.ks.a, 1, 0, this)), t.ks.or.k.length && t.ks.or.k[0].to) {
                var r, a = t.ks.or.k.length;
                for (r = 0; r < a; r += 1) t.ks.or.k[r].to = null, t.ks.or.k[r].ti = null
            }
            this.or = s(this, t.ks.or, 1, degToRads, this), this.or.sh = !0, this.rx = s(this, t.ks.rx, 0, degToRads, this), this.ry = s(this, t.ks.ry, 0, degToRads, this), this.rz = s(this, t.ks.rz, 0, degToRads, this), this.mat = new Matrix, this._prevMat = new Matrix, this._isFirstFrame = !0, this.finalTransform = {
                mProp: this
            }
        }
        function HEffects() {}
        SVGMatte3Effect.prototype.findSymbol = function(t) {
            for (var e = 0, i = _svgMatteSymbols.length; e < i;) {
                if (_svgMatteSymbols[e] === t) return _svgMatteSymbols[e];
                e += 1
            }
            return null
        }, SVGMatte3Effect.prototype.replaceInParent = function(t, e) {
            var i = t.layerElement.parentNode;
            if (i) {
                for (var s, r = i.children, a = 0, n = r.length; a < n && r[a] !== t.layerElement;) a += 1;
                a <= n - 2 && (s = r[a + 1]);
                var o = createNS("use");
                o.setAttribute("href", "#" + e), s ? i.insertBefore(o, s) : i.appendChild(o)
            }
        }, SVGMatte3Effect.prototype.setElementAsMask = function(t, e) {
            if (!this.findSymbol(e)) {
                var i = createElementID(),
                    s = createNS("mask");
                s.setAttribute("id", e.layerId), s.setAttribute("mask-type", "alpha"), _svgMatteSymbols.push(e);
                var r = t.globalData.defs;
                r.appendChild(s);
                var a = createNS("symbol");
                a.setAttribute("id", i), this.replaceInParent(e, i), a.appendChild(e.layerElement), r.appendChild(a);
                var n = createNS("use");
                n.setAttribute("href", "#" + i), s.appendChild(n), e.data.hd = !1, e.show()
            }
            t.setMatte(e.layerId)
        }, SVGMatte3Effect.prototype.initialize = function() {
            for (var t = this.filterManager.effectElements[0].p.v, e = this.elem.comp.elements, i = 0, s = e.length; i < s;) e[i] && e[i].data.ind === t && this.setElementAsMask(this.elem, e[i]), i += 1;
            this.initialized = !0
        }, SVGMatte3Effect.prototype.renderFrame = function() {
            this.initialized || this.initialize()
        }, SVGEffects.prototype.renderFrame = function(t) {
            var e, i = this.filters.length;
            for (e = 0; e < i; e += 1) this.filters[e].renderFrame(t)
        }, CVContextData.prototype.duplicate = function() {
            var t = 2 * this._length,
                e = this.savedOp;
            this.savedOp = createTypedArray("float32", t), this.savedOp.set(e);
            var i = 0;
            for (i = this._length; i < t; i += 1) this.saved[i] = createTypedArray("float32", 16);
            this._length = t
        }, CVContextData.prototype.reset = function() {
            this.cArrPos = 0, this.cTr.reset(), this.cO = 1
        }, CVBaseElement.prototype = {
            createElements: function() {},
            initRendererElement: function() {},
            createContainerElements: function() {
                this.canvasContext = this.globalData.canvasContext, this.renderableEffectsManager = new CVEffects(this)
            },
            createContent: function() {},
            setBlendMode: function() {
                var t = this.globalData;
                if (t.blendMode !== this.data.bm) {
                    t.blendMode = this.data.bm;
                    var e = getBlendMode(this.data.bm);
                    t.canvasContext.globalCompositeOperation = e
                }
            },
            createRenderableComponents: function() {
                this.maskManager = new CVMaskElement(this.data, this)
            },
            hideElement: function() {
                this.hidden || this.isInRange && !this.isTransparent || (this.hidden = !0)
            },
            showElement: function() {
                this.isInRange && !this.isTransparent && (this.hidden = !1, this._isFirstFrame = !0, this.maskManager._isFirstFrame = !0)
            },
            renderFrame: function() {
                this.hidden || this.data.hd || (this.renderTransform(), this.renderRenderable(), this.setBlendMode(), this.globalData.renderer.save(), this.globalData.renderer.ctxTransform(this.finalTransform.mat.props), this.globalData.renderer.ctxOpacity(this.finalTransform.mProp.o.v), this.renderInnerContent(), this.globalData.renderer.restore(), this.maskManager.hasMasks && this.globalData.renderer.restore(!0), this._isFirstFrame && (this._isFirstFrame = !1))
            },
            destroy: function() {
                this.canvasContext = null, this.data = null, this.globalData = null, this.maskManager.destroy()
            },
            mHelper: new Matrix
        }, CVBaseElement.prototype.hide = CVBaseElement.prototype.hideElement, CVBaseElement.prototype.show = CVBaseElement.prototype.showElement, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVImageElement), CVImageElement.prototype.initElement = SVGShapeElement.prototype.initElement, CVImageElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame, CVImageElement.prototype.createContent = function() {
            if (this.img.width && (this.assetData.w !== this.img.width || this.assetData.h !== this.img.height)) {
                var t = createTag("canvas");
                t.width = this.assetData.w, t.height = this.assetData.h;
                var e, i, s = t.getContext("2d"),
                    r = this.img.width,
                    a = this.img.height,
                    n = r / a,
                    o = this.assetData.w / this.assetData.h,
                    l = this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio;
                o < n && "xMidYMid slice" === l || n < o && "xMidYMid slice" !== l ? e = (i = a) * o : i = (e = r) / o, s.drawImage(this.img, (r - e) / 2, (a - i) / 2, e, i, 0, 0, this.assetData.w, this.assetData.h), this.img = t
            }
        }, CVImageElement.prototype.renderInnerContent = function(t) {
            this.canvasContext.drawImage(this.img, 0, 0)
        }, CVImageElement.prototype.destroy = function() {
            this.img = null
        }, extendPrototype([CanvasRenderer, ICompElement, CVBaseElement], CVCompElement), CVCompElement.prototype.renderInnerContent = function() {
            var t;
            for (t = this.layers.length - 1; 0 <= t; t -= 1)(this.completeLayers || this.elements[t]) && this.elements[t].renderFrame()
        }, CVCompElement.prototype.destroy = function() {
            var t;
            for (t = this.layers.length - 1; 0 <= t; t -= 1) this.elements[t] && this.elements[t].destroy();
            this.layers = null, this.elements = null
        }, CVMaskElement.prototype.renderFrame = function() {
            if (this.hasMasks) {
                var t, e, i, s, r = this.element.finalTransform.mat,
                    a = this.element.canvasContext,
                    n = this.masksProperties.length;
                for (a.beginPath(), t = 0; t < n; t++)
                    if ("n" !== this.masksProperties[t].mode) {
                        this.masksProperties[t].inv && (a.moveTo(0, 0), a.lineTo(this.element.globalData.compSize.w, 0), a.lineTo(this.element.globalData.compSize.w, this.element.globalData.compSize.h), a.lineTo(0, this.element.globalData.compSize.h), a.lineTo(0, 0)), s = this.viewData[t].v, e = r.applyToPointArray(s.v[0][0], s.v[0][1], 0), a.moveTo(e[0], e[1]);
                        var o, l = s._length;
                        for (o = 1; o < l; o++) i = r.applyToTriplePoints(s.o[o - 1], s.i[o], s.v[o]), a.bezierCurveTo(i[0], i[1], i[2], i[3], i[4], i[5]);
                        i = r.applyToTriplePoints(s.o[o - 1], s.i[0], s.v[0]), a.bezierCurveTo(i[0], i[1], i[2], i[3], i[4], i[5])
                    }
                this.element.globalData.renderer.save(!0), a.clip()
            }
        }, CVMaskElement.prototype.getMaskProperty = MaskElement.prototype.getMaskProperty, CVMaskElement.prototype.destroy = function() {
            this.element = null
        }, extendPrototype([BaseElement, TransformElement, CVBaseElement, IShapeElement, HierarchyElement, FrameElement, RenderableElement], CVShapeElement), CVShapeElement.prototype.initElement = RenderableDOMElement.prototype.initElement, CVShapeElement.prototype.transformHelper = {
            opacity: 1,
            _opMdf: !1
        }, CVShapeElement.prototype.dashResetter = [], CVShapeElement.prototype.createContent = function() {
            this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, !0, [])
        }, CVShapeElement.prototype.createStyleElement = function(t, e) {
            var i = {
                    data: t,
                    type: t.ty,
                    preTransforms: this.transformsManager.addTransformSequence(e),
                    transforms: [],
                    elements: [],
                    closed: !0 === t.hd
                },
                s = {};
            if ("fl" == t.ty || "st" == t.ty ? (s.c = PropertyFactory.getProp(this, t.c, 1, 255, this), s.c.k || (i.co = "rgb(" + bm_floor(s.c.v[0]) + "," + bm_floor(s.c.v[1]) + "," + bm_floor(s.c.v[2]) + ")")) : "gf" !== t.ty && "gs" !== t.ty || (s.s = PropertyFactory.getProp(this, t.s, 1, null, this), s.e = PropertyFactory.getProp(this, t.e, 1, null, this), s.h = PropertyFactory.getProp(this, t.h || {
                    k: 0
                }, 0, .01, this), s.a = PropertyFactory.getProp(this, t.a || {
                    k: 0
                }, 0, degToRads, this), s.g = new GradientProperty(this, t.g, this)), s.o = PropertyFactory.getProp(this, t.o, 0, .01, this), "st" == t.ty || "gs" == t.ty) {
                if (i.lc = this.lcEnum[t.lc] || "round", i.lj = this.ljEnum[t.lj] || "round", 1 == t.lj && (i.ml = t.ml), s.w = PropertyFactory.getProp(this, t.w, 0, null, this), s.w.k || (i.wi = s.w.v), t.d) {
                    var r = new DashProperty(this, t.d, "canvas", this);
                    s.d = r, s.d.k || (i.da = s.d.dashArray, i.do = s.d.dashoffset[0])
                }
            } else i.r = 2 === t.r ? "evenodd" : "nonzero";
            return this.stylesList.push(i), s.style = i, s
        }, CVShapeElement.prototype.createGroupElement = function(t) {
            return {
                it: [],
                prevViewData: []
            }
        }, CVShapeElement.prototype.createTransformElement = function(t) {
            return {
                transform: {
                    opacity: 1,
                    _opMdf: !1,
                    key: this.transformsManager.getNewKey(),
                    op: PropertyFactory.getProp(this, t.o, 0, .01, this),
                    mProps: TransformPropertyFactory.getTransformProperty(this, t, this)
                }
            }
        }, CVShapeElement.prototype.createShapeElement = function(t) {
            var e = new CVShapeData(this, t, this.stylesList, this.transformsManager);
            return this.shapes.push(e), this.addShapeToModifiers(e), e
        }, CVShapeElement.prototype.reloadShapes = function() {
            this._isFirstFrame = !0;
            var t, e = this.itemsData.length;
            for (t = 0; t < e; t += 1) this.prevViewData[t] = this.itemsData[t];
            for (this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, !0, []), e = this.dynamicProperties.length, t = 0; t < e; t += 1) this.dynamicProperties[t].getValue();
            this.renderModifiers(), this.transformsManager.processSequences(this._isFirstFrame)
        }, CVShapeElement.prototype.addTransformToStyleList = function(t) {
            var e, i = this.stylesList.length;
            for (e = 0; e < i; e += 1) this.stylesList[e].closed || this.stylesList[e].transforms.push(t)
        }, CVShapeElement.prototype.removeTransformFromStyleList = function() {
            var t, e = this.stylesList.length;
            for (t = 0; t < e; t += 1) this.stylesList[t].closed || this.stylesList[t].transforms.pop()
        }, CVShapeElement.prototype.closeStyles = function(t) {
            var e, i = t.length;
            for (e = 0; e < i; e += 1) t[e].closed = !0
        }, CVShapeElement.prototype.searchShapes = function(t, e, i, s, r) {
            var a, n, o, l, h, p, d = t.length - 1,
                c = [],
                f = [],
                u = [].concat(r);
            for (a = d; 0 <= a; a -= 1) {
                if ((l = this.searchProcessedElement(t[a])) ? e[a] = i[l - 1] : t[a]._shouldRender = s, "fl" == t[a].ty || "st" == t[a].ty || "gf" == t[a].ty || "gs" == t[a].ty) l ? e[a].style.closed = !1 : e[a] = this.createStyleElement(t[a], u), c.push(e[a].style);
                else if ("gr" == t[a].ty) {
                    if (l)
                        for (o = e[a].it.length, n = 0; n < o; n += 1) e[a].prevViewData[n] = e[a].it[n];
                    else e[a] = this.createGroupElement(t[a]);
                    this.searchShapes(t[a].it, e[a].it, e[a].prevViewData, s, u)
                } else "tr" == t[a].ty ? (l || (p = this.createTransformElement(t[a]), e[a] = p), u.push(e[a]), this.addTransformToStyleList(e[a])) : "sh" == t[a].ty || "rc" == t[a].ty || "el" == t[a].ty || "sr" == t[a].ty ? l || (e[a] = this.createShapeElement(t[a])) : "tm" == t[a].ty || "rd" == t[a].ty ? (l ? (h = e[a]).closed = !1 : ((h = ShapeModifiers.getModifier(t[a].ty)).init(this, t[a]), e[a] = h, this.shapeModifiers.push(h)), f.push(h)) : "rp" == t[a].ty && (l ? (h = e[a]).closed = !0 : (h = ShapeModifiers.getModifier(t[a].ty), (e[a] = h).init(this, t, a, e), this.shapeModifiers.push(h), s = !1), f.push(h));
                this.addProcessedElement(t[a], a + 1)
            }
            for (this.removeTransformFromStyleList(), this.closeStyles(c), d = f.length, a = 0; a < d; a += 1) f[a].closed = !0
        }, CVShapeElement.prototype.renderInnerContent = function() {
            this.transformHelper.opacity = 1, this.transformHelper._opMdf = !1, this.renderModifiers(), this.transformsManager.processSequences(this._isFirstFrame), this.renderShape(this.transformHelper, this.shapesData, this.itemsData, !0)
        }, CVShapeElement.prototype.renderShapeTransform = function(t, e) {
            (t._opMdf || e.op._mdf || this._isFirstFrame) && (e.opacity = t.opacity, e.opacity *= e.op.v, e._opMdf = !0)
        }, CVShapeElement.prototype.drawLayer = function() {
            var t, e, i, s, r, a, n, o, l, h = this.stylesList.length,
                p = this.globalData.renderer,
                d = this.globalData.canvasContext;
            for (t = 0; t < h; t += 1)
                if (("st" !== (o = (l = this.stylesList[t]).type) && "gs" !== o || 0 !== l.wi) && l.data._shouldRender && 0 !== l.coOp && 0 !== this.globalData.currentGlobalAlpha) {
                    for (p.save(), a = l.elements, "st" === o || "gs" === o ? (d.strokeStyle = "st" === o ? l.co : l.grd, d.lineWidth = l.wi, d.lineCap = l.lc, d.lineJoin = l.lj, d.miterLimit = l.ml || 0) : d.fillStyle = "fl" === o ? l.co : l.grd, p.ctxOpacity(l.coOp), "st" !== o && "gs" !== o && d.beginPath(), p.ctxTransform(l.preTransforms.finalTransform.props), i = a.length, e = 0; e < i; e += 1) {
                        for ("st" !== o && "gs" !== o || (d.beginPath(), l.da && (d.setLineDash(l.da), d.lineDashOffset = l.do)), r = (n = a[e].trNodes).length, s = 0; s < r; s += 1) "m" == n[s].t ? d.moveTo(n[s].p[0], n[s].p[1]) : "c" == n[s].t ? d.bezierCurveTo(n[s].pts[0], n[s].pts[1], n[s].pts[2], n[s].pts[3], n[s].pts[4], n[s].pts[5]) : d.closePath();
                        "st" !== o && "gs" !== o || (d.stroke(), l.da && d.setLineDash(this.dashResetter))
                    }
                    "st" !== o && "gs" !== o && d.fill(l.r), p.restore()
                }
        }, CVShapeElement.prototype.renderShape = function(t, e, i, s) {
            var r, a;
            for (a = t, r = e.length - 1; 0 <= r; r -= 1) "tr" == e[r].ty ? (a = i[r].transform, this.renderShapeTransform(t, a)) : "sh" == e[r].ty || "el" == e[r].ty || "rc" == e[r].ty || "sr" == e[r].ty ? this.renderPath(e[r], i[r]) : "fl" == e[r].ty ? this.renderFill(e[r], i[r], a) : "st" == e[r].ty ? this.renderStroke(e[r], i[r], a) : "gf" == e[r].ty || "gs" == e[r].ty ? this.renderGradientFill(e[r], i[r], a) : "gr" == e[r].ty ? this.renderShape(a, e[r].it, i[r].it) : e[r].ty;
            s && this.drawLayer()
        }, CVShapeElement.prototype.renderStyledShape = function(t, e) {
            if (this._isFirstFrame || e._mdf || t.transforms._mdf) {
                var i, s, r, a = t.trNodes,
                    n = e.paths,
                    o = n._length;
                a.length = 0;
                var l = t.transforms.finalTransform;
                for (r = 0; r < o; r += 1) {
                    var h = n.shapes[r];
                    if (h && h.v) {
                        for (s = h._length, i = 1; i < s; i += 1) 1 === i && a.push({
                            t: "m",
                            p: l.applyToPointArray(h.v[0][0], h.v[0][1], 0)
                        }), a.push({
                            t: "c",
                            pts: l.applyToTriplePoints(h.o[i - 1], h.i[i], h.v[i])
                        });
                        1 === s && a.push({
                            t: "m",
                            p: l.applyToPointArray(h.v[0][0], h.v[0][1], 0)
                        }), h.c && s && (a.push({
                            t: "c",
                            pts: l.applyToTriplePoints(h.o[i - 1], h.i[0], h.v[0])
                        }), a.push({
                            t: "z"
                        }))
                    }
                }
                t.trNodes = a
            }
        }, CVShapeElement.prototype.renderPath = function(t, e) {
            if (!0 !== t.hd && t._shouldRender) {
                var i, s = e.styledShapes.length;
                for (i = 0; i < s; i += 1) this.renderStyledShape(e.styledShapes[i], e.sh)
            }
        }, CVShapeElement.prototype.renderFill = function(t, e, i) {
            var s = e.style;
            (e.c._mdf || this._isFirstFrame) && (s.co = "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o._mdf || i._opMdf || this._isFirstFrame) && (s.coOp = e.o.v * i.opacity)
        }, CVShapeElement.prototype.renderGradientFill = function(t, e, i) {
            var s = e.style;
            if (!s.grd || e.g._mdf || e.s._mdf || e.e._mdf || 1 !== t.t && (e.h._mdf || e.a._mdf)) {
                var r = this.globalData.canvasContext,
                    a = e.s.v,
                    n = e.e.v;
                if (1 === t.t) c = r.createLinearGradient(a[0], a[1], n[0], n[1]);
                else var o = Math.sqrt(Math.pow(a[0] - n[0], 2) + Math.pow(a[1] - n[1], 2)),
                    l = Math.atan2(n[1] - a[1], n[0] - a[0]),
                    h = o * (1 <= e.h.v ? .99 : e.h.v <= -1 ? -.99 : e.h.v),
                    p = Math.cos(l + e.a.v) * h + a[0],
                    d = Math.sin(l + e.a.v) * h + a[1],
                    c = r.createRadialGradient(p, d, 0, a[0], a[1], o);
                var f, u = t.g.p,
                    m = e.g.c,
                    g = 1;
                for (f = 0; f < u; f += 1) e.g._hasOpacity && e.g._collapsable && (g = e.g.o[2 * f + 1]), c.addColorStop(m[4 * f] / 100, "rgba(" + m[4 * f + 1] + "," + m[4 * f + 2] + "," + m[4 * f + 3] + "," + g + ")");
                s.grd = c
            }
            s.coOp = e.o.v * i.opacity
        }, CVShapeElement.prototype.renderStroke = function(t, e, i) {
            var s = e.style,
                r = e.d;
            r && (r._mdf || this._isFirstFrame) && (s.da = r.dashArray, s.do = r.dashoffset[0]), (e.c._mdf || this._isFirstFrame) && (s.co = "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o._mdf || i._opMdf || this._isFirstFrame) && (s.coOp = e.o.v * i.opacity), (e.w._mdf || this._isFirstFrame) && (s.wi = e.w.v)
        }, CVShapeElement.prototype.destroy = function() {
            this.shapesData = null, this.globalData = null, this.canvasContext = null, this.stylesList.length = 0, this.itemsData.length = 0
        }, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVSolidElement), CVSolidElement.prototype.initElement = SVGShapeElement.prototype.initElement, CVSolidElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame, CVSolidElement.prototype.renderInnerContent = function() {
            var t = this.canvasContext;
            t.fillStyle = this.data.sc, t.fillRect(0, 0, this.data.sw, this.data.sh)
        }, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement, ITextElement], CVTextElement), CVTextElement.prototype.tHelper = createTag("canvas").getContext("2d"), CVTextElement.prototype.buildNewText = function() {
            var t = this.textProperty.currentData;
            this.renderedLetters = createSizedArray(t.l ? t.l.length : 0);
            var e = !1;
            t.fc ? (e = !0, this.values.fill = this.buildColor(t.fc)) : this.values.fill = "rgba(0,0,0,0)", this.fill = e;
            var i = !1;
            t.sc && (i = !0, this.values.stroke = this.buildColor(t.sc), this.values.sWidth = t.sw);
            var s, r, a = this.globalData.fontManager.getFontByName(t.f),
                n = t.l,
                o = this.mHelper;
            this.stroke = i, this.values.fValue = t.finalSize + "px " + this.globalData.fontManager.getFontByName(t.f).fFamily, r = t.finalText.length;
            var l, h, p, d, c, f, u, m, g, v, y = this.data.singleShape,
                _ = t.tr / 1e3 * t.finalSize,
                b = 0,
                x = 0,
                T = !0,
                w = 0;
            for (s = 0; s < r; s += 1) {
                for (h = (l = this.globalData.fontManager.getCharData(t.finalText[s], a.fStyle, this.globalData.fontManager.getFontByName(t.f).fFamily)) && l.data || {}, o.reset(), y && n[s].n && (b = -_, x += t.yOffset, x += T ? 1 : 0, T = !1), u = (c = h.shapes ? h.shapes[0].it : []).length, o.scale(t.finalSize / 100, t.finalSize / 100), y && this.applyTextPropertiesToMatrix(t, o, n[s].line, b, x), g = createSizedArray(u), f = 0; f < u; f += 1) {
                    for (d = c[f].ks.k.i.length, m = c[f].ks.k, v = [], p = 1; p < d; p += 1) 1 == p && v.push(o.applyToX(m.v[0][0], m.v[0][1], 0), o.applyToY(m.v[0][0], m.v[0][1], 0)), v.push(o.applyToX(m.o[p - 1][0], m.o[p - 1][1], 0), o.applyToY(m.o[p - 1][0], m.o[p - 1][1], 0), o.applyToX(m.i[p][0], m.i[p][1], 0), o.applyToY(m.i[p][0], m.i[p][1], 0), o.applyToX(m.v[p][0], m.v[p][1], 0), o.applyToY(m.v[p][0], m.v[p][1], 0));
                    v.push(o.applyToX(m.o[p - 1][0], m.o[p - 1][1], 0), o.applyToY(m.o[p - 1][0], m.o[p - 1][1], 0), o.applyToX(m.i[0][0], m.i[0][1], 0), o.applyToY(m.i[0][0], m.i[0][1], 0), o.applyToX(m.v[0][0], m.v[0][1], 0), o.applyToY(m.v[0][0], m.v[0][1], 0)), g[f] = v
                }
                y && (b += n[s].l, b += _), this.textSpans[w] ? this.textSpans[w].elem = g : this.textSpans[w] = {
                    elem: g
                }, w += 1
            }
        }, CVTextElement.prototype.renderInnerContent = function() {
            var t, e, i, s, r, a, n = this.canvasContext;
            this.finalTransform.mat.props, n.font = this.values.fValue, n.lineCap = "butt", n.lineJoin = "miter", n.miterLimit = 4, this.data.singleShape || this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag);
            var o, l = this.textAnimator.renderedLetters,
                h = this.textProperty.currentData.l;
            e = h.length;
            var p, d, c = null,
                f = null,
                u = null;
            for (t = 0; t < e; t += 1)
                if (!h[t].n) {
                    if ((o = l[t]) && (this.globalData.renderer.save(), this.globalData.renderer.ctxTransform(o.p), this.globalData.renderer.ctxOpacity(o.o)), this.fill) {
                        for (o && o.fc ? c !== o.fc && (c = o.fc, n.fillStyle = o.fc) : c !== this.values.fill && (c = this.values.fill, n.fillStyle = this.values.fill), s = (p = this.textSpans[t].elem).length, this.globalData.canvasContext.beginPath(), i = 0; i < s; i += 1)
                            for (a = (d = p[i]).length, this.globalData.canvasContext.moveTo(d[0], d[1]), r = 2; r < a; r += 6) this.globalData.canvasContext.bezierCurveTo(d[r], d[r + 1], d[r + 2], d[r + 3], d[r + 4], d[r + 5]);
                        this.globalData.canvasContext.closePath(), this.globalData.canvasContext.fill()
                    }
                    if (this.stroke) {
                        for (o && o.sw ? u !== o.sw && (u = o.sw, n.lineWidth = o.sw) : u !== this.values.sWidth && (u = this.values.sWidth, n.lineWidth = this.values.sWidth), o && o.sc ? f !== o.sc && (f = o.sc, n.strokeStyle = o.sc) : f !== this.values.stroke && (f = this.values.stroke, n.strokeStyle = this.values.stroke), s = (p = this.textSpans[t].elem).length, this.globalData.canvasContext.beginPath(), i = 0; i < s; i += 1)
                            for (a = (d = p[i]).length, this.globalData.canvasContext.moveTo(d[0], d[1]), r = 2; r < a; r += 6) this.globalData.canvasContext.bezierCurveTo(d[r], d[r + 1], d[r + 2], d[r + 3], d[r + 4], d[r + 5]);
                        this.globalData.canvasContext.closePath(), this.globalData.canvasContext.stroke()
                    }
                    o && this.globalData.renderer.restore()
                }
        }, CVEffects.prototype.renderFrame = function() {}, HBaseElement.prototype = {
            checkBlendMode: function() {},
            initRendererElement: function() {
                this.baseElement = createTag(this.data.tg || "div"), this.data.hasMask ? (this.svgElement = createNS("svg"), this.layerElement = createNS("g"), this.maskedElement = this.layerElement, this.svgElement.appendChild(this.layerElement), this.baseElement.appendChild(this.svgElement)) : this.layerElement = this.baseElement, styleDiv(this.baseElement)
            },
            createContainerElements: function() {
                this.renderableEffectsManager = new CVEffects(this), this.transformedElement = this.baseElement, this.maskedElement = this.layerElement, this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.data.cl && this.layerElement.setAttribute("class", this.data.cl), 0 !== this.data.bm && this.setBlendMode()
            },
            renderElement: function() {
                this.finalTransform._matMdf && (this.transformedElement.style.transform = this.transformedElement.style.webkitTransform = this.finalTransform.mat.toCSS()), this.finalTransform._opMdf && (this.transformedElement.style.opacity = this.finalTransform.mProp.o.v)
            },
            renderFrame: function() {
                this.data.hd || this.hidden || (this.renderTransform(), this.renderRenderable(), this.renderElement(), this.renderInnerContent(), this._isFirstFrame && (this._isFirstFrame = !1))
            },
            destroy: function() {
                this.layerElement = null, this.transformedElement = null, this.matteElement && (this.matteElement = null), this.maskManager && (this.maskManager.destroy(), this.maskManager = null)
            },
            createRenderableComponents: function() {
                this.maskManager = new MaskElement(this.data, this, this.globalData)
            },
            addEffects: function() {},
            setMatte: function() {}
        }, HBaseElement.prototype.getBaseElement = SVGBaseElement.prototype.getBaseElement, HBaseElement.prototype.destroyBaseElement = HBaseElement.prototype.destroy, HBaseElement.prototype.buildElementParenting = HybridRenderer.prototype.buildElementParenting, extendPrototype([BaseElement, TransformElement, HBaseElement, HierarchyElement, FrameElement, RenderableDOMElement], HSolidElement), HSolidElement.prototype.createContent = function() {
            var t;
            this.data.hasMask ? ((t = createNS("rect")).setAttribute("width", this.data.sw), t.setAttribute("height", this.data.sh), t.setAttribute("fill", this.data.sc), this.svgElement.setAttribute("width", this.data.sw), this.svgElement.setAttribute("height", this.data.sh)) : ((t = createTag("div")).style.width = this.data.sw + "px", t.style.height = this.data.sh + "px", t.style.backgroundColor = this.data.sc), this.layerElement.appendChild(t)
        }, extendPrototype([HybridRenderer, ICompElement, HBaseElement], HCompElement), HCompElement.prototype._createBaseContainerElements = HCompElement.prototype.createContainerElements, HCompElement.prototype.createContainerElements = function() {
            this._createBaseContainerElements(), this.data.hasMask ? (this.svgElement.setAttribute("width", this.data.w), this.svgElement.setAttribute("height", this.data.h), this.transformedElement = this.baseElement) : this.transformedElement = this.layerElement
        }, HCompElement.prototype.addTo3dContainer = function(t, e) {
            for (var i, s = 0; s < e;) this.elements[s] && this.elements[s].getBaseElement && (i = this.elements[s].getBaseElement()), s += 1;
            i ? this.layerElement.insertBefore(t, i) : this.layerElement.appendChild(t)
        }, extendPrototype([BaseElement, TransformElement, HSolidElement, SVGShapeElement, HBaseElement, HierarchyElement, FrameElement, RenderableElement], HShapeElement), HShapeElement.prototype._renderShapeFrame = HShapeElement.prototype.renderInnerContent, HShapeElement.prototype.createContent = function() {
            var t;
            if (this.baseElement.style.fontSize = 0, this.data.hasMask) this.layerElement.appendChild(this.shapesContainer), t = this.svgElement;
            else {
                t = createNS("svg");
                var e = this.comp.data ? this.comp.data : this.globalData.compSize;
                t.setAttribute("width", e.w), t.setAttribute("height", e.h), t.appendChild(this.shapesContainer), this.layerElement.appendChild(t)
            }
            this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.shapesContainer, 0, [], !0), this.filterUniqueShapes(), this.shapeCont = t
        }, HShapeElement.prototype.getTransformedPoint = function(t, e) {
            var i, s = t.length;
            for (i = 0; i < s; i += 1) e = t[i].mProps.v.applyToPointArray(e[0], e[1], 0);
            return e
        }, HShapeElement.prototype.calculateShapeBoundingBox = function(t, e) {
            var i, s, r, a, n, o = t.sh.v,
                l = t.transformers,
                h = o._length;
            if (!(h <= 1)) {
                for (i = 0; i < h - 1; i += 1) s = this.getTransformedPoint(l, o.v[i]), r = this.getTransformedPoint(l, o.o[i]), a = this.getTransformedPoint(l, o.i[i + 1]), n = this.getTransformedPoint(l, o.v[i + 1]), this.checkBounds(s, r, a, n, e);
                o.c && (s = this.getTransformedPoint(l, o.v[i]), r = this.getTransformedPoint(l, o.o[i]), a = this.getTransformedPoint(l, o.i[0]), n = this.getTransformedPoint(l, o.v[0]), this.checkBounds(s, r, a, n, e))
            }
        }, HShapeElement.prototype.checkBounds = function(t, e, i, s, r) {
            this.getBoundsOfCurve(t, e, i, s);
            var a = this.shapeBoundingBox;
            r.x = bm_min(a.left, r.x), r.xMax = bm_max(a.right, r.xMax), r.y = bm_min(a.top, r.y), r.yMax = bm_max(a.bottom, r.yMax)
        }, HShapeElement.prototype.shapeBoundingBox = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }, HShapeElement.prototype.tempBoundingBox = {
            x: 0,
            xMax: 0,
            y: 0,
            yMax: 0,
            width: 0,
            height: 0
        }, HShapeElement.prototype.getBoundsOfCurve = function(t, e, i, s) {
            for (var r, a, n, o, l, h, p, d = [
                    [t[0], s[0]],
                    [t[1], s[1]]
                ], c = 0; c < 2; ++c)
                if (a = 6 * t[c] - 12 * e[c] + 6 * i[c], r = -3 * t[c] + 9 * e[c] - 9 * i[c] + 3 * s[c], n = 3 * e[c] - 3 * t[c], a |= 0, n |= 0, 0 != (r |= 0))(l = a * a - 4 * n * r) < 0 || (0 < (h = (-a + bm_sqrt(l)) / (2 * r)) && h < 1 && d[c].push(this.calculateF(h, t, e, i, s, c)), 0 < (p = (-a - bm_sqrt(l)) / (2 * r)) && p < 1 && d[c].push(this.calculateF(p, t, e, i, s, c)));
                else {
                    if (0 === a) continue;
                    0 < (o = -n / a) && o < 1 && d[c].push(this.calculateF(o, t, e, i, s, c))
                }
            this.shapeBoundingBox.left = bm_min.apply(null, d[0]), this.shapeBoundingBox.top = bm_min.apply(null, d[1]), this.shapeBoundingBox.right = bm_max.apply(null, d[0]), this.shapeBoundingBox.bottom = bm_max.apply(null, d[1])
        }, HShapeElement.prototype.calculateF = function(t, e, i, s, r, a) {
            return bm_pow(1 - t, 3) * e[a] + 3 * bm_pow(1 - t, 2) * t * i[a] + 3 * (1 - t) * bm_pow(t, 2) * s[a] + bm_pow(t, 3) * r[a]
        }, HShapeElement.prototype.calculateBoundingBox = function(t, e) {
            var i, s = t.length;
            for (i = 0; i < s; i += 1) t[i] && t[i].sh ? this.calculateShapeBoundingBox(t[i], e) : t[i] && t[i].it && this.calculateBoundingBox(t[i].it, e)
        }, HShapeElement.prototype.currentBoxContains = function(t) {
            return this.currentBBox.x <= t.x && this.currentBBox.y <= t.y && this.currentBBox.width + this.currentBBox.x >= t.x + t.width && this.currentBBox.height + this.currentBBox.y >= t.y + t.height
        }, HShapeElement.prototype.renderInnerContent = function() {
            if (this._renderShapeFrame(), !this.hidden && (this._isFirstFrame || this._mdf)) {
                var t = this.tempBoundingBox,
                    e = 999999;
                if (t.x = e, t.xMax = -e, t.y = e, t.yMax = -e, this.calculateBoundingBox(this.itemsData, t), t.width = t.xMax < t.x ? 0 : t.xMax - t.x, t.height = t.yMax < t.y ? 0 : t.yMax - t.y, this.currentBoxContains(t)) return;
                var i = !1;
                this.currentBBox.w !== t.width && (this.currentBBox.w = t.width, this.shapeCont.setAttribute("width", t.width), i = !0), this.currentBBox.h !== t.height && (this.currentBBox.h = t.height, this.shapeCont.setAttribute("height", t.height), i = !0), (i || this.currentBBox.x !== t.x || this.currentBBox.y !== t.y) && (this.currentBBox.w = t.width, this.currentBBox.h = t.height, this.currentBBox.x = t.x, this.currentBBox.y = t.y, this.shapeCont.setAttribute("viewBox", this.currentBBox.x + " " + this.currentBBox.y + " " + this.currentBBox.w + " " + this.currentBBox.h), this.shapeCont.style.transform = this.shapeCont.style.webkitTransform = "translate(" + this.currentBBox.x + "px," + this.currentBBox.y + "px)")
            }
        }, extendPrototype([BaseElement, TransformElement, HBaseElement, HierarchyElement, FrameElement, RenderableDOMElement, ITextElement], HTextElement), HTextElement.prototype.createContent = function() {
            if (this.isMasked = this.checkMasks(), this.isMasked) {
                this.renderType = "svg", this.compW = this.comp.data.w, this.compH = this.comp.data.h, this.svgElement.setAttribute("width", this.compW), this.svgElement.setAttribute("height", this.compH);
                var t = createNS("g");
                this.maskedElement.appendChild(t), this.innerElem = t
            } else this.renderType = "html", this.innerElem = this.layerElement;
            this.checkParenting()
        }, HTextElement.prototype.buildNewText = function() {
            var t = this.textProperty.currentData;
            this.renderedLetters = createSizedArray(t.l ? t.l.length : 0);
            var e = this.innerElem.style;
            e.color = e.fill = t.fc ? this.buildColor(t.fc) : "rgba(0,0,0,0)", t.sc && (e.stroke = this.buildColor(t.sc), e.strokeWidth = t.sw + "px");
            var i, s, r = this.globalData.fontManager.getFontByName(t.f);
            if (!this.globalData.fontManager.chars)
                if (e.fontSize = t.finalSize + "px", e.lineHeight = t.finalSize + "px", r.fClass) this.innerElem.className = r.fClass;
                else {
                    e.fontFamily = r.fFamily;
                    var a = t.fWeight,
                        n = t.fStyle;
                    e.fontStyle = n, e.fontWeight = a
                }
            var o, l, h, p = t.l;
            s = p.length;
            var d, c = this.mHelper,
                f = "",
                u = 0;
            for (i = 0; i < s; i += 1) {
                if (this.globalData.fontManager.chars ? (this.textPaths[u] ? o = this.textPaths[u] : ((o = createNS("path")).setAttribute("stroke-linecap", "butt"), o.setAttribute("stroke-linejoin", "round"), o.setAttribute("stroke-miterlimit", "4")), this.isMasked || (this.textSpans[u] ? h = (l = this.textSpans[u]).children[0] : ((l = createTag("div")).style.lineHeight = 0, (h = createNS("svg")).appendChild(o), styleDiv(l)))) : this.isMasked ? o = this.textPaths[u] ? this.textPaths[u] : createNS("text") : this.textSpans[u] ? (l = this.textSpans[u], o = this.textPaths[u]) : (styleDiv(l = createTag("span")), styleDiv(o = createTag("span")), l.appendChild(o)), this.globalData.fontManager.chars) {
                    var m, g = this.globalData.fontManager.getCharData(t.finalText[i], r.fStyle, this.globalData.fontManager.getFontByName(t.f).fFamily);
                    if (m = g ? g.data : null, c.reset(), m && m.shapes && (d = m.shapes[0].it, c.scale(t.finalSize / 100, t.finalSize / 100), f = this.createPathShape(c, d), o.setAttribute("d", f)), this.isMasked) this.innerElem.appendChild(o);
                    else {
                        if (this.innerElem.appendChild(l), m && m.shapes) {
                            document.body.appendChild(h);
                            var v = h.getBBox();
                            h.setAttribute("width", v.width + 2), h.setAttribute("height", v.height + 2), h.setAttribute("viewBox", v.x - 1 + " " + (v.y - 1) + " " + (v.width + 2) + " " + (v.height + 2)), h.style.transform = h.style.webkitTransform = "translate(" + (v.x - 1) + "px," + (v.y - 1) + "px)", p[i].yOffset = v.y - 1
                        } else h.setAttribute("width", 1), h.setAttribute("height", 1);
                        l.appendChild(h)
                    }
                } else o.textContent = p[i].val, o.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve"), this.isMasked ? this.innerElem.appendChild(o) : (this.innerElem.appendChild(l), o.style.transform = o.style.webkitTransform = "translate3d(0," + -t.finalSize / 1.2 + "px,0)");
                this.isMasked ? this.textSpans[u] = o : this.textSpans[u] = l, this.textSpans[u].style.display = "block", this.textPaths[u] = o, u += 1
            }
            for (; u < this.textSpans.length;) this.textSpans[u].style.display = "none", u += 1
        }, HTextElement.prototype.renderInnerContent = function() {
            if (this.data.singleShape) {
                if (!this._isFirstFrame && !this.lettersChangedFlag) return;
                this.isMasked && this.finalTransform._matMdf && (this.svgElement.setAttribute("viewBox", -this.finalTransform.mProp.p.v[0] + " " + -this.finalTransform.mProp.p.v[1] + " " + this.compW + " " + this.compH), this.svgElement.style.transform = this.svgElement.style.webkitTransform = "translate(" + -this.finalTransform.mProp.p.v[0] + "px," + -this.finalTransform.mProp.p.v[1] + "px)")
            }
            if (this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag), this.lettersChangedFlag || this.textAnimator.lettersChangedFlag) {
                var t, e, i, s, r, a = 0,
                    n = this.textAnimator.renderedLetters,
                    o = this.textProperty.currentData.l;
                for (e = o.length, t = 0; t < e; t += 1) o[t].n ? a += 1 : (s = this.textSpans[t], r = this.textPaths[t], i = n[a], a += 1, i._mdf.m && (this.isMasked ? s.setAttribute("transform", i.m) : s.style.transform = s.style.webkitTransform = i.m), s.style.opacity = i.o, i.sw && i._mdf.sw && r.setAttribute("stroke-width", i.sw), i.sc && i._mdf.sc && r.setAttribute("stroke", i.sc), i.fc && i._mdf.fc && (r.setAttribute("fill", i.fc), r.style.color = i.fc));
                if (this.innerElem.getBBox && !this.hidden && (this._isFirstFrame || this._mdf)) {
                    var l = this.innerElem.getBBox();
                    this.currentBBox.w !== l.width && (this.currentBBox.w = l.width, this.svgElement.setAttribute("width", l.width)), this.currentBBox.h !== l.height && (this.currentBBox.h = l.height, this.svgElement.setAttribute("height", l.height)), this.currentBBox.w === l.width + 2 && this.currentBBox.h === l.height + 2 && this.currentBBox.x === l.x - 1 && this.currentBBox.y === l.y - 1 || (this.currentBBox.w = l.width + 2, this.currentBBox.h = l.height + 2, this.currentBBox.x = l.x - 1, this.currentBBox.y = l.y - 1, this.svgElement.setAttribute("viewBox", this.currentBBox.x + " " + this.currentBBox.y + " " + this.currentBBox.w + " " + this.currentBBox.h), this.svgElement.style.transform = this.svgElement.style.webkitTransform = "translate(" + this.currentBBox.x + "px," + this.currentBBox.y + "px)")
                }
            }
        }, extendPrototype([BaseElement, TransformElement, HBaseElement, HSolidElement, HierarchyElement, FrameElement, RenderableElement], HImageElement), HImageElement.prototype.createContent = function() {
            var t = this.globalData.getAssetsPath(this.assetData),
                e = new Image;
            this.data.hasMask ? (this.imageElem = createNS("image"), this.imageElem.setAttribute("width", this.assetData.w + "px"), this.imageElem.setAttribute("height", this.assetData.h + "px"), this.imageElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", t), this.layerElement.appendChild(this.imageElem), this.baseElement.setAttribute("width", this.assetData.w), this.baseElement.setAttribute("height", this.assetData.h)) : this.layerElement.appendChild(e), e.src = t, this.data.ln && this.baseElement.setAttribute("id", this.data.ln)
        }, extendPrototype([BaseElement, FrameElement, HierarchyElement], HCameraElement), HCameraElement.prototype.setup = function() {
            var t, e, i = this.comp.threeDElements.length;
            for (t = 0; t < i; t += 1) "3d" === (e = this.comp.threeDElements[t]).type && (e.perspectiveElem.style.perspective = e.perspectiveElem.style.webkitPerspective = this.pe.v + "px", e.container.style.transformOrigin = e.container.style.mozTransformOrigin = e.container.style.webkitTransformOrigin = "0px 0px 0px", e.perspectiveElem.style.transform = e.perspectiveElem.style.webkitTransform = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)")
        }, HCameraElement.prototype.createElements = function() {}, HCameraElement.prototype.hide = function() {}, HCameraElement.prototype.renderFrame = function() {
            var t, e, i = this._isFirstFrame;
            if (this.hierarchy)
                for (e = this.hierarchy.length, t = 0; t < e; t += 1) i = this.hierarchy[t].finalTransform.mProp._mdf || i;
            if (i || this.pe._mdf || this.p && this.p._mdf || this.px && (this.px._mdf || this.py._mdf || this.pz._mdf) || this.rx._mdf || this.ry._mdf || this.rz._mdf || this.or._mdf || this.a && this.a._mdf) {
                if (this.mat.reset(), this.hierarchy)
                    for (t = e = this.hierarchy.length - 1; 0 <= t; t -= 1) {
                        var s = this.hierarchy[t].finalTransform.mProp;
                        this.mat.translate(-s.p.v[0], -s.p.v[1], s.p.v[2]), this.mat.rotateX(-s.or.v[0]).rotateY(-s.or.v[1]).rotateZ(s.or.v[2]), this.mat.rotateX(-s.rx.v).rotateY(-s.ry.v).rotateZ(s.rz.v), this.mat.scale(1 / s.s.v[0], 1 / s.s.v[1], 1 / s.s.v[2]), this.mat.translate(s.a.v[0], s.a.v[1], s.a.v[2])
                    }
                if (this.p ? this.mat.translate(-this.p.v[0], -this.p.v[1], this.p.v[2]) : this.mat.translate(-this.px.v, -this.py.v, this.pz.v), this.a) {
                    var r;
                    r = this.p ? [this.p.v[0] - this.a.v[0], this.p.v[1] - this.a.v[1], this.p.v[2] - this.a.v[2]] : [this.px.v - this.a.v[0], this.py.v - this.a.v[1], this.pz.v - this.a.v[2]];
                    var a = Math.sqrt(Math.pow(r[0], 2) + Math.pow(r[1], 2) + Math.pow(r[2], 2)),
                        n = [r[0] / a, r[1] / a, r[2] / a],
                        o = Math.sqrt(n[2] * n[2] + n[0] * n[0]),
                        l = Math.atan2(n[1], o),
                        h = Math.atan2(n[0], -n[2]);
                    this.mat.rotateY(h).rotateX(-l)
                }
                this.mat.rotateX(-this.rx.v).rotateY(-this.ry.v).rotateZ(this.rz.v), this.mat.rotateX(-this.or.v[0]).rotateY(-this.or.v[1]).rotateZ(this.or.v[2]), this.mat.translate(this.globalData.compSize.w / 2, this.globalData.compSize.h / 2, 0), this.mat.translate(0, 0, this.pe.v);
                var p = !this._prevMat.equals(this.mat);
                if ((p || this.pe._mdf) && this.comp.threeDElements) {
                    var d;
                    for (e = this.comp.threeDElements.length, t = 0; t < e; t += 1) "3d" === (d = this.comp.threeDElements[t]).type && (p && (d.container.style.transform = d.container.style.webkitTransform = this.mat.toCSS()), this.pe._mdf && (d.perspectiveElem.style.perspective = d.perspectiveElem.style.webkitPerspective = this.pe.v + "px"));
                    this.mat.clone(this._prevMat)
                }
            }
            this._isFirstFrame = !1
        }, HCameraElement.prototype.prepareFrame = function(t) {
            this.prepareProperties(t, !0)
        }, HCameraElement.prototype.destroy = function() {}, HCameraElement.prototype.getBaseElement = function() {
            return null
        }, HEffects.prototype.renderFrame = function() {};
        var animationManager = function() {
                var t = {},
                    r = [],
                    s = 0,
                    a = 0,
                    n = 0,
                    o = !0,
                    l = !1;
                function i(t) {
                    for (var e = 0, i = t.target; e < a;) r[e].animation === i && (r.splice(e, 1), e -= 1, a -= 1, i.isPaused || d()), e += 1
                }
                function h(t, e) {
                    if (!t) return null;
                    for (var i = 0; i < a;) {
                        if (r[i].elem == t && null !== r[i].elem) return r[i].animation;
                        i += 1
                    }
                    var s = new AnimationItem;
                    return c(s, t), s.setData(t, e), s
                }
                function p() {
                    n += 1, u()
                }
                function d() {
                    n -= 1
                }
                function c(t, e) {
                    t.addEventListener("destroy", i), t.addEventListener("_active", p), t.addEventListener("_idle", d), r.push({
                        elem: e,
                        animation: t
                    }), a += 1
                }
                function f(t) {
                    var e, i = t - s;
                    for (e = 0; e < a; e += 1) r[e].animation.advanceTime(i);
                    s = t, n && !l ? window.requestAnimationFrame(f) : o = !0
                }
                function e(t) {
                    s = t, window.requestAnimationFrame(f)
                }
                function u() {
                    !l && n && o && (window.requestAnimationFrame(e), o = !1)
                }
                return t.registerAnimation = h, t.loadAnimation = function(t) {
                    var e = new AnimationItem;
                    return c(e, null), e.setParams(t), e
                }, t.setSpeed = function(t, e) {
                    var i;
                    for (i = 0; i < a; i += 1) r[i].animation.setSpeed(t, e)
                }, t.setDirection = function(t, e) {
                    var i;
                    for (i = 0; i < a; i += 1) r[i].animation.setDirection(t, e)
                }, t.play = function(t) {
                    var e;
                    for (e = 0; e < a; e += 1) r[e].animation.play(t)
                }, t.pause = function(t) {
                    var e;
                    for (e = 0; e < a; e += 1) r[e].animation.pause(t)
                }, t.stop = function(t) {
                    var e;
                    for (e = 0; e < a; e += 1) r[e].animation.stop(t)
                }, t.togglePause = function(t) {
                    var e;
                    for (e = 0; e < a; e += 1) r[e].animation.togglePause(t)
                }, t.searchAnimations = function(t, e, i) {
                    var s, r = [].concat([].slice.call(document.getElementsByClassName("lottie")), [].slice.call(document.getElementsByClassName("bodymovin"))),
                        a = r.length;
                    for (s = 0; s < a; s += 1) i && r[s].setAttribute("data-bm-type", i), h(r[s], t);
                    if (e && 0 === a) {
                        i || (i = "svg");
                        var n = document.getElementsByTagName("body")[0];
                        n.innerHTML = "";
                        var o = createTag("div");
                        o.style.width = "100%", o.style.height = "100%", o.setAttribute("data-bm-type", i), n.appendChild(o), h(o, t)
                    }
                }, t.resize = function() {
                    var t;
                    for (t = 0; t < a; t += 1) r[t].animation.resize()
                }, t.goToAndStop = function(t, e, i) {
                    var s;
                    for (s = 0; s < a; s += 1) r[s].animation.goToAndStop(t, e, i)
                }, t.destroy = function(t) {
                    var e;
                    for (e = a - 1; 0 <= e; e -= 1) r[e].animation.destroy(t)
                }, t.freeze = function() {
                    l = !0
                }, t.unfreeze = function() {
                    l = !1, u()
                }, t.getRegisteredAnimations = function() {
                    var t, e = r.length,
                        i = [];
                    for (t = 0; t < e; t += 1) i.push(r[t].animation);
                    return i
                }, t
            }(),
            AnimationItem = function() {
                this._cbs = [], this.name = "", this.path = "", this.isLoaded = !1, this.currentFrame = 0, this.currentRawFrame = 0, this.totalFrames = 0, this.frameRate = 0, this.frameMult = 0, this.playSpeed = 1, this.playDirection = 1, this.playCount = 0, this.animationData = {}, this.assets = [], this.isPaused = !0, this.autoplay = !1, this.loop = !0, this.renderer = null, this.animationID = createElementID(), this.assetsPath = "", this.timeCompleted = 0, this.segmentPos = 0, this.subframeEnabled = subframeEnabled, this.segments = [], this._idle = !0, this._completedLoop = !1, this.projectInterface = ProjectInterface(), this.imagePreloader = new ImagePreloader
            };
        extendPrototype([BaseEvent], AnimationItem), AnimationItem.prototype.setParams = function(t) {
            t.context && (this.context = t.context), (t.wrapper || t.container) && (this.wrapper = t.wrapper || t.container);
            var e = t.animType ? t.animType : t.renderer ? t.renderer : "svg";
            switch (e) {
                case "canvas":
                    this.renderer = new CanvasRenderer(this, t.rendererSettings);
                    break;
                case "svg":
                    this.renderer = new SVGRenderer(this, t.rendererSettings);
                    break;
                default:
                    this.renderer = new HybridRenderer(this, t.rendererSettings)
            }
            this.renderer.setProjectInterface(this.projectInterface), this.animType = e, "" === t.loop || null === t.loop || (!1 === t.loop ? this.loop = !1 : !0 === t.loop ? this.loop = !0 : this.loop = parseInt(t.loop)), this.autoplay = !("autoplay" in t) || t.autoplay, this.name = t.name ? t.name : "", this.autoloadSegments = !t.hasOwnProperty("autoloadSegments") || t.autoloadSegments, this.assetsPath = t.assetsPath, t.animationData ? this.configAnimation(t.animationData) : t.path && (-1 !== t.path.lastIndexOf("\\") ? this.path = t.path.substr(0, t.path.lastIndexOf("\\") + 1) : this.path = t.path.substr(0, t.path.lastIndexOf("/") + 1), this.fileName = t.path.substr(t.path.lastIndexOf("/") + 1), this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf(".json")), assetLoader.load(t.path, this.configAnimation.bind(this), function() {
                this.trigger("data_failed")
            }.bind(this)))
        }, AnimationItem.prototype.setData = function(t, e) {
            var i = {
                    wrapper: t,
                    animationData: e ? "object" == typeof e ? e : JSON.parse(e) : null
                },
                s = t.attributes;
            i.path = s.getNamedItem("data-animation-path") ? s.getNamedItem("data-animation-path").value : s.getNamedItem("data-bm-path") ? s.getNamedItem("data-bm-path").value : s.getNamedItem("bm-path") ? s.getNamedItem("bm-path").value : "", i.animType = s.getNamedItem("data-anim-type") ? s.getNamedItem("data-anim-type").value : s.getNamedItem("data-bm-type") ? s.getNamedItem("data-bm-type").value : s.getNamedItem("bm-type") ? s.getNamedItem("bm-type").value : s.getNamedItem("data-bm-renderer") ? s.getNamedItem("data-bm-renderer").value : s.getNamedItem("bm-renderer") ? s.getNamedItem("bm-renderer").value : "canvas";
            var r = s.getNamedItem("data-anim-loop") ? s.getNamedItem("data-anim-loop").value : s.getNamedItem("data-bm-loop") ? s.getNamedItem("data-bm-loop").value : s.getNamedItem("bm-loop") ? s.getNamedItem("bm-loop").value : "";
            "" === r || (i.loop = "false" !== r && ("true" === r || parseInt(r)));
            var a = s.getNamedItem("data-anim-autoplay") ? s.getNamedItem("data-anim-autoplay").value : s.getNamedItem("data-bm-autoplay") ? s.getNamedItem("data-bm-autoplay").value : !s.getNamedItem("bm-autoplay") || s.getNamedItem("bm-autoplay").value;
            i.autoplay = "false" !== a, i.name = s.getNamedItem("data-name") ? s.getNamedItem("data-name").value : s.getNamedItem("data-bm-name") ? s.getNamedItem("data-bm-name").value : s.getNamedItem("bm-name") ? s.getNamedItem("bm-name").value : "", "false" === (s.getNamedItem("data-anim-prerender") ? s.getNamedItem("data-anim-prerender").value : s.getNamedItem("data-bm-prerender") ? s.getNamedItem("data-bm-prerender").value : s.getNamedItem("bm-prerender") ? s.getNamedItem("bm-prerender").value : "") && (i.prerender = !1), this.setParams(i)
        }, AnimationItem.prototype.includeLayers = function(t) {
            t.op > this.animationData.op && (this.animationData.op = t.op, this.totalFrames = Math.floor(t.op - this.animationData.ip));
            var e, i, s = this.animationData.layers,
                r = s.length,
                a = t.layers,
                n = a.length;
            for (i = 0; i < n; i += 1)
                for (e = 0; e < r;) {
                    if (s[e].id == a[i].id) {
                        s[e] = a[i];
                        break
                    }
                    e += 1
                }
            if ((t.chars || t.fonts) && (this.renderer.globalData.fontManager.addChars(t.chars), this.renderer.globalData.fontManager.addFonts(t.fonts, this.renderer.globalData.defs)), t.assets)
                for (r = t.assets.length, e = 0; e < r; e += 1) this.animationData.assets.push(t.assets[e]);
            this.animationData.__complete = !1, dataManager.completeData(this.animationData, this.renderer.globalData.fontManager), this.renderer.includeLayers(t.layers), expressionsPlugin && expressionsPlugin.initExpressions(this), this.loadNextSegment()
        }, AnimationItem.prototype.loadNextSegment = function() {
            var t = this.animationData.segments;
            if (!t || 0 === t.length || !this.autoloadSegments) return this.trigger("data_ready"), void(this.timeCompleted = this.totalFrames);
            var e = t.shift();
            this.timeCompleted = e.time * this.frameRate;
            var i = this.path + this.fileName + "_" + this.segmentPos + ".json";
            this.segmentPos += 1, assetLoader.load(i, this.includeLayers.bind(this), function() {
                this.trigger("data_failed")
            }.bind(this))
        }, AnimationItem.prototype.loadSegments = function() {
            this.animationData.segments || (this.timeCompleted = this.totalFrames), this.loadNextSegment()
        }, AnimationItem.prototype.imagesLoaded = function() {
            this.trigger("loaded_images"), this.checkLoaded()
        }, AnimationItem.prototype.preloadImages = function() {
            this.imagePreloader.setAssetsPath(this.assetsPath), this.imagePreloader.setPath(this.path), this.imagePreloader.loadAssets(this.animationData.assets, this.imagesLoaded.bind(this))
        }, AnimationItem.prototype.configAnimation = function(t) {
            if (this.renderer) try {
                this.animationData = t, this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip), this.renderer.configAnimation(t), t.assets || (t.assets = []), this.assets = this.animationData.assets, this.frameRate = this.animationData.fr, this.firstFrame = Math.round(this.animationData.ip), this.frameMult = this.animationData.fr / 1e3, this.renderer.searchExtraCompositions(t.assets), this.trigger("config_ready"), this.preloadImages(), this.loadSegments(), this.updaFrameModifier(), this.waitForFontsLoaded()
            } catch (t) {
                this.triggerConfigError(t)
            }
        }, AnimationItem.prototype.waitForFontsLoaded = function() {
            this.renderer && (this.renderer.globalData.fontManager.loaded() ? this.checkLoaded() : setTimeout(this.waitForFontsLoaded.bind(this), 20))
        }, AnimationItem.prototype.checkLoaded = function() {
            this.isLoaded || !this.renderer.globalData.fontManager.loaded() || !this.imagePreloader.loaded() && "canvas" === this.renderer.rendererType || (this.isLoaded = !0, dataManager.completeData(this.animationData, this.renderer.globalData.fontManager), expressionsPlugin && expressionsPlugin.initExpressions(this), this.renderer.initItems(), setTimeout(function() {
                this.trigger("DOMLoaded")
            }.bind(this), 0), this.gotoFrame(), this.autoplay && this.play())
        }, AnimationItem.prototype.resize = function() {
            this.renderer.updateContainerSize()
        }, AnimationItem.prototype.setSubframe = function(t) {
            this.subframeEnabled = !!t
        }, AnimationItem.prototype.gotoFrame = function() {
            this.currentFrame = this.subframeEnabled ? this.currentRawFrame : ~~this.currentRawFrame, this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted && (this.currentFrame = this.timeCompleted), this.trigger("enterFrame"), this.renderFrame()
        }, AnimationItem.prototype.renderFrame = function() {
            if (!1 !== this.isLoaded) try {
                this.renderer.renderFrame(this.currentFrame + this.firstFrame)
            } catch (t) {
                this.triggerRenderFrameError(t)
            }
        }, AnimationItem.prototype.play = function(t) {
            t && this.name != t || !0 === this.isPaused && (this.isPaused = !1, this._idle && (this._idle = !1, this.trigger("_active")))
        }, AnimationItem.prototype.pause = function(t) {
            t && this.name != t || !1 === this.isPaused && (this.isPaused = !0, this._idle = !0, this.trigger("_idle"))
        }, AnimationItem.prototype.togglePause = function(t) {
            t && this.name != t || (!0 === this.isPaused ? this.play() : this.pause())
        }, AnimationItem.prototype.stop = function(t) {
            t && this.name != t || (this.pause(), this.playCount = 0, this._completedLoop = !1, this.setCurrentRawFrameValue(0))
        }, AnimationItem.prototype.goToAndStop = function(t, e, i) {
            i && this.name != i || (e ? this.setCurrentRawFrameValue(t) : this.setCurrentRawFrameValue(t * this.frameModifier), this.pause())
        }, AnimationItem.prototype.goToAndPlay = function(t, e, i) {
            this.goToAndStop(t, e, i), this.play()
        }, AnimationItem.prototype.advanceTime = function(t) {
            if (!0 !== this.isPaused && !1 !== this.isLoaded) {
                var e = this.currentRawFrame + t * this.frameModifier,
                    i = !1;
                e >= this.totalFrames - 1 && 0 < this.frameModifier ? this.loop && this.playCount !== this.loop ? e >= this.totalFrames ? (this.playCount += 1, this.checkSegments(e % this.totalFrames) || (this.setCurrentRawFrameValue(e % this.totalFrames), this._completedLoop = !0, this.trigger("loopComplete"))) : this.setCurrentRawFrameValue(e) : this.checkSegments(e > this.totalFrames ? e % this.totalFrames : 0) || (i = !0, e = this.totalFrames - 1) : e < 0 ? this.checkSegments(e % this.totalFrames) || (!this.loop || this.playCount-- <= 0 && !0 !== this.loop ? (i = !0, e = 0) : (this.setCurrentRawFrameValue(this.totalFrames + e % this.totalFrames), this._completedLoop ? this.trigger("loopComplete") : this._completedLoop = !0)) : this.setCurrentRawFrameValue(e), i && (this.setCurrentRawFrameValue(e), this.pause(), this.trigger("complete"))
            }
        }, AnimationItem.prototype.adjustSegment = function(t, e) {
            this.playCount = 0, t[1] < t[0] ? (0 < this.frameModifier && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(-1)), this.timeCompleted = this.totalFrames = t[0] - t[1], this.firstFrame = t[1], this.setCurrentRawFrameValue(this.totalFrames - .001 - e)) : t[1] > t[0] && (this.frameModifier < 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(1)), this.timeCompleted = this.totalFrames = t[1] - t[0], this.firstFrame = t[0], this.setCurrentRawFrameValue(.001 + e)), this.trigger("segmentStart")
        }, AnimationItem.prototype.setSegment = function(t, e) {
            var i = -1;
            this.isPaused && (this.currentRawFrame + this.firstFrame < t ? i = t : this.currentRawFrame + this.firstFrame > e && (i = e - t)), this.firstFrame = t, this.timeCompleted = this.totalFrames = e - t, -1 !== i && this.goToAndStop(i, !0)
        }, AnimationItem.prototype.playSegments = function(t, e) {
            if (e && (this.segments.length = 0), "object" == typeof t[0]) {
                var i, s = t.length;
                for (i = 0; i < s; i += 1) this.segments.push(t[i])
            } else this.segments.push(t);
            this.segments.length && e && this.adjustSegment(this.segments.shift(), 0), this.isPaused && this.play()
        }, AnimationItem.prototype.resetSegments = function(t) {
            this.segments.length = 0, this.segments.push([this.animationData.ip, this.animationData.op]), t && this.checkSegments(0)
        }, AnimationItem.prototype.checkSegments = function(t) {
            return !!this.segments.length && (this.adjustSegment(this.segments.shift(), t), !0)
        }, AnimationItem.prototype.destroy = function(t) {
            t && this.name != t || !this.renderer || (this.renderer.destroy(), this.imagePreloader.destroy(), this.trigger("destroy"), this._cbs = null, this.onEnterFrame = this.onLoopComplete = this.onComplete = this.onSegmentStart = this.onDestroy = null, this.renderer = null)
        }, AnimationItem.prototype.setCurrentRawFrameValue = function(t) {
            this.currentRawFrame = t, this.gotoFrame()
        }, AnimationItem.prototype.setSpeed = function(t) {
            this.playSpeed = t, this.updaFrameModifier()
        }, AnimationItem.prototype.setDirection = function(t) {
            this.playDirection = t < 0 ? -1 : 1, this.updaFrameModifier()
        }, AnimationItem.prototype.updaFrameModifier = function() {
            this.frameModifier = this.frameMult * this.playSpeed * this.playDirection
        }, AnimationItem.prototype.getPath = function() {
            return this.path
        }, AnimationItem.prototype.getAssetsPath = function(t) {
            var e = "";
            if (t.e) e = t.p;
            else if (this.assetsPath) {
                var i = t.p; - 1 !== i.indexOf("images/") && (i = i.split("/")[1]), e = this.assetsPath + i
            } else e = this.path, e += t.u ? t.u : "", e += t.p;
            return e
        }, AnimationItem.prototype.getAssetData = function(t) {
            for (var e = 0, i = this.assets.length; e < i;) {
                if (t == this.assets[e].id) return this.assets[e];
                e += 1
            }
        }, AnimationItem.prototype.hide = function() {
            this.renderer.hide()
        }, AnimationItem.prototype.show = function() {
            this.renderer.show()
        }, AnimationItem.prototype.getDuration = function(t) {
            return t ? this.totalFrames : this.totalFrames / this.frameRate
        }, AnimationItem.prototype.trigger = function(t) {
            if (this._cbs && this._cbs[t]) switch (t) {
                case "enterFrame":
                    this.triggerEvent(t, new BMEnterFrameEvent(t, this.currentFrame, this.totalFrames, this.frameModifier));
                    break;
                case "loopComplete":
                    this.triggerEvent(t, new BMCompleteLoopEvent(t, this.loop, this.playCount, this.frameMult));
                    break;
                case "complete":
                    this.triggerEvent(t, new BMCompleteEvent(t, this.frameMult));
                    break;
                case "segmentStart":
                    this.triggerEvent(t, new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames));
                    break;
                case "destroy":
                    this.triggerEvent(t, new BMDestroyEvent(t, this));
                    break;
                default:
                    this.triggerEvent(t)
            }
            "enterFrame" === t && this.onEnterFrame && this.onEnterFrame.call(this, new BMEnterFrameEvent(t, this.currentFrame, this.totalFrames, this.frameMult)), "loopComplete" === t && this.onLoopComplete && this.onLoopComplete.call(this, new BMCompleteLoopEvent(t, this.loop, this.playCount, this.frameMult)), "complete" === t && this.onComplete && this.onComplete.call(this, new BMCompleteEvent(t, this.frameMult)), "segmentStart" === t && this.onSegmentStart && this.onSegmentStart.call(this, new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames)), "destroy" === t && this.onDestroy && this.onDestroy.call(this, new BMDestroyEvent(t, this))
        }, AnimationItem.prototype.triggerRenderFrameError = function(t) {
            var e = new BMRenderFrameErrorEvent(t, this.currentFrame);
            this.triggerEvent("error", e), this.onError && this.onError.call(this, e)
        }, AnimationItem.prototype.triggerConfigError = function(t) {
            var e = new BMConfigErrorEvent(t, this.currentFrame);
            this.triggerEvent("error", e), this.onError && this.onError.call(this, e)
        };
        var Expressions = (zW = {}, zW.initExpressions = function(t) {
                var e = 0,
                    i = [];
                t.renderer.compInterface = CompExpressionInterface(t.renderer), t.renderer.globalData.projectInterface.registerComposition(t.renderer), t.renderer.globalData.pushExpression = function() {
                    e += 1
                }, t.renderer.globalData.popExpression = function() {
                    0 == (e -= 1) && function() {
                        var t, e = i.length;
                        for (t = 0; t < e; t += 1) i[t].release();
                        i.length = 0
                    }()
                }, t.renderer.globalData.registerExpressionProperty = function(t) {
                    -1 === i.indexOf(t) && i.push(t)
                }
            }, zW),
            zW;
        expressionsPlugin = Expressions;
        var ExpressionManager = function() {
                var ob = {},
                    Math = BMMath,
                    window = null,
                    document = null;
                function $bm_isInstanceOfArray(t) {
                    return t.constructor === Array || t.constructor === Float32Array
                }
                function isNumerable(t, e) {
                    return "number" === t || "boolean" === t || "string" === t || e instanceof Number
                }
                function $bm_neg(t) {
                    var e = typeof t;
                    if ("number" === e || "boolean" === e || t instanceof Number) return -t;
                    if ($bm_isInstanceOfArray(t)) {
                        var i, s = t.length,
                            r = [];
                        for (i = 0; i < s; i += 1) r[i] = -t[i];
                        return r
                    }
                    return t.propType ? t.v : void 0
                }
                var easeInBez = BezierFactory.getBezierEasing(.333, 0, .833, .833, "easeIn").get,
                    easeOutBez = BezierFactory.getBezierEasing(.167, .167, .667, 1, "easeOut").get,
                    easeInOutBez = BezierFactory.getBezierEasing(.33, 0, .667, 1, "easeInOut").get;
                function sum(t, e) {
                    var i = typeof t,
                        s = typeof e;
                    if ("string" === i || "string" === s) return t + e;
                    if (isNumerable(i, t) && isNumerable(s, e)) return t + e;
                    if ($bm_isInstanceOfArray(t) && isNumerable(s, e)) return (t = t.slice(0))[0] = t[0] + e, t;
                    if (isNumerable(i, t) && $bm_isInstanceOfArray(e)) return (e = e.slice(0))[0] = t + e[0], e;
                    if ($bm_isInstanceOfArray(t) && $bm_isInstanceOfArray(e)) {
                        for (var r = 0, a = t.length, n = e.length, o = []; r < a || r < n;)("number" == typeof t[r] || t[r] instanceof Number) && ("number" == typeof e[r] || e[r] instanceof Number) ? o[r] = t[r] + e[r] : o[r] = void 0 === e[r] ? t[r] : t[r] || e[r], r += 1;
                        return o
                    }
                    return 0
                }
                var add = sum;
                function sub(t, e) {
                    var i = typeof t,
                        s = typeof e;
                    if (isNumerable(i, t) && isNumerable(s, e)) return "string" === i && (t = parseInt(t)), "string" === s && (e = parseInt(e)), t - e;
                    if ($bm_isInstanceOfArray(t) && isNumerable(s, e)) return (t = t.slice(0))[0] = t[0] - e, t;
                    if (isNumerable(i, t) && $bm_isInstanceOfArray(e)) return (e = e.slice(0))[0] = t - e[0], e;
                    if ($bm_isInstanceOfArray(t) && $bm_isInstanceOfArray(e)) {
                        for (var r = 0, a = t.length, n = e.length, o = []; r < a || r < n;)("number" == typeof t[r] || t[r] instanceof Number) && ("number" == typeof e[r] || e[r] instanceof Number) ? o[r] = t[r] - e[r] : o[r] = void 0 === e[r] ? t[r] : t[r] || e[r], r += 1;
                        return o
                    }
                    return 0
                }
                function mul(t, e) {
                    var i, s, r, a = typeof t,
                        n = typeof e;
                    if (isNumerable(a, t) && isNumerable(n, e)) return t * e;
                    if ($bm_isInstanceOfArray(t) && isNumerable(n, e)) {
                        for (r = t.length, i = createTypedArray("float32", r), s = 0; s < r; s += 1) i[s] = t[s] * e;
                        return i
                    }
                    if (isNumerable(a, t) && $bm_isInstanceOfArray(e)) {
                        for (r = e.length, i = createTypedArray("float32", r), s = 0; s < r; s += 1) i[s] = t * e[s];
                        return i
                    }
                    return 0
                }
                function div(t, e) {
                    var i, s, r, a = typeof t,
                        n = typeof e;
                    if (isNumerable(a, t) && isNumerable(n, e)) return t / e;
                    if ($bm_isInstanceOfArray(t) && isNumerable(n, e)) {
                        for (r = t.length, i = createTypedArray("float32", r), s = 0; s < r; s += 1) i[s] = t[s] / e;
                        return i
                    }
                    if (isNumerable(a, t) && $bm_isInstanceOfArray(e)) {
                        for (r = e.length, i = createTypedArray("float32", r), s = 0; s < r; s += 1) i[s] = t / e[s];
                        return i
                    }
                    return 0
                }
                function mod(t, e) {
                    return "string" == typeof t && (t = parseInt(t)), "string" == typeof e && (e = parseInt(e)), t % e
                }
                var $bm_sum = sum,
                    $bm_sub = sub,
                    $bm_mul = mul,
                    $bm_div = div,
                    $bm_mod = mod;
                function clamp(t, e, i) {
                    if (i < e) {
                        var s = i;
                        i = e, e = s
                    }
                    return Math.min(Math.max(t, e), i)
                }
                function radiansToDegrees(t) {
                    return t / degToRads
                }
                var radians_to_degrees = radiansToDegrees;
                function degreesToRadians(t) {
                    return t * degToRads
                }
                var degrees_to_radians = radiansToDegrees,
                    helperLengthArray = [0, 0, 0, 0, 0, 0];
                function length(t, e) {
                    if ("number" == typeof t || t instanceof Number) return e = e || 0, Math.abs(t - e);
                    e || (e = helperLengthArray);
                    var i, s = Math.min(t.length, e.length),
                        r = 0;
                    for (i = 0; i < s; i += 1) r += Math.pow(e[i] - t[i], 2);
                    return Math.sqrt(r)
                }
                function normalize(t) {
                    return div(t, length(t))
                }
                function rgbToHsl(t) {
                    var e, i, s = t[0],
                        r = t[1],
                        a = t[2],
                        n = Math.max(s, r, a),
                        o = Math.min(s, r, a),
                        l = (n + o) / 2;
                    if (n == o) e = i = 0;
                    else {
                        var h = n - o;
                        switch (i = .5 < l ? h / (2 - n - o) : h / (n + o), n) {
                            case s:
                                e = (r - a) / h + (r < a ? 6 : 0);
                                break;
                            case r:
                                e = (a - s) / h + 2;
                                break;
                            case a:
                                e = (s - r) / h + 4
                        }
                        e /= 6
                    }
                    return [e, i, l, t[3]]
                }
                function hue2rgb(t, e, i) {
                    return i < 0 && (i += 1), 1 < i && (i -= 1), i < 1 / 6 ? t + 6 * (e - t) * i : i < .5 ? e : i < 2 / 3 ? t + (e - t) * (2 / 3 - i) * 6 : t
                }
                function hslToRgb(t) {
                    var e, i, s, r = t[0],
                        a = t[1],
                        n = t[2];
                    if (0 === a) e = i = s = n;
                    else {
                        var o = n < .5 ? n * (1 + a) : n + a - n * a,
                            l = 2 * n - o;
                        e = hue2rgb(l, o, r + 1 / 3), i = hue2rgb(l, o, r), s = hue2rgb(l, o, r - 1 / 3)
                    }
                    return [e, i, s, t[3]]
                }
                function linear(t, e, i, s, r) {
                    if (void 0 !== s && void 0 !== r || (s = e, r = i, e = 0, i = 1), i < e) {
                        var a = i;
                        i = e, e = a
                    }
                    if (t <= e) return s;
                    if (i <= t) return r;
                    var n = i === e ? 0 : (t - e) / (i - e);
                    if (!s.length) return s + (r - s) * n;
                    var o, l = s.length,
                        h = createTypedArray("float32", l);
                    for (o = 0; o < l; o += 1) h[o] = s[o] + (r[o] - s[o]) * n;
                    return h
                }
                function random(t, e) {
                    if (void 0 === e && (void 0 === t ? (t = 0, e = 1) : (e = t, t = void 0)), e.length) {
                        var i, s = e.length;
                        t || (t = createTypedArray("float32", s));
                        var r = createTypedArray("float32", s),
                            a = BMMath.random();
                        for (i = 0; i < s; i += 1) r[i] = t[i] + a * (e[i] - t[i]);
                        return r
                    }
                    return void 0 === t && (t = 0), t + BMMath.random() * (e - t)
                }
                function createPath(t, e, i, s) {
                    var r, a = t.length,
                        n = shape_pool.newElement();
                    n.setPathData(!!s, a);
                    var o, l, h = [0, 0];
                    for (r = 0; r < a; r += 1) o = e && e[r] ? e[r] : h, l = i && i[r] ? i[r] : h, n.setTripleAt(t[r][0], t[r][1], l[0] + t[r][0], l[1] + t[r][1], o[0] + t[r][0], o[1] + t[r][1], r, !0);
                    return n
                }
                function initiateExpression(elem, data, property) {
                    var val = data.x,
                        needsVelocity = /velocity(?![\w\d])/.test(val),
                        _needsRandom = -1 !== val.indexOf("random"),
                        elemType = elem.data.ty,
                        transform, $bm_transform, content, effect, thisProperty = property;
                    thisProperty.valueAtTime = thisProperty.getValueAtTime, Object.defineProperty(thisProperty, "value", {
                        get: function() {
                            return thisProperty.v
                        }
                    }), elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate, elem.comp.displayStartTime = 0;
                    var inPoint = elem.data.ip / elem.comp.globalData.frameRate,
                        outPoint = elem.data.op / elem.comp.globalData.frameRate,
                        width = elem.data.sw ? elem.data.sw : 0,
                        height = elem.data.sh ? elem.data.sh : 0,
                        name = elem.data.nm,
                        loopIn, loop_in, loopOut, loop_out, smooth, toWorld, fromWorld, fromComp, toComp, fromCompToSurface, position, rotation, anchorPoint, scale, thisLayer, thisComp, mask, valueAtTime, velocityAtTime, __expression_functions = [],
                        scoped_bm_rt;
                    if (data.xf) {
                        var i, len = data.xf.length;
                        for (i = 0; i < len; i += 1) __expression_functions[i] = eval("(function(){ return " + data.xf[i] + "}())")
                    }
                    var expression_function = eval("[function _expression_function(){" + val + ";scoped_bm_rt=$bm_rt}]")[0],
                        numKeys = property.kf ? data.k.length : 0,
                        active = !this.data || !0 !== this.data.hd,
                        wiggle = function(t, e) {
                            var i, s, r = this.pv.length ? this.pv.length : 1,
                                a = createTypedArray("float32", r),
                                n = Math.floor(5 * time);
                            for (s = i = 0; i < n;) {
                                for (s = 0; s < r; s += 1) a[s] += -e + 2 * e * BMMath.random();
                                i += 1
                            }
                            var o = 5 * time,
                                l = o - Math.floor(o),
                                h = createTypedArray("float32", r);
                            if (1 < r) {
                                for (s = 0; s < r; s += 1) h[s] = this.pv[s] + a[s] + (-e + 2 * e * BMMath.random()) * l;
                                return h
                            }
                            return this.pv + a[0] + (-e + 2 * e * BMMath.random()) * l
                        }.bind(this);
                    function loopInDuration(t, e) {
                        return loopIn(t, e, !0)
                    }
                    function loopOutDuration(t, e) {
                        return loopOut(t, e, !0)
                    }
                    thisProperty.loopIn && (loopIn = thisProperty.loopIn.bind(thisProperty), loop_in = loopIn), thisProperty.loopOut && (loopOut = thisProperty.loopOut.bind(thisProperty), loop_out = loopOut), thisProperty.smooth && (smooth = thisProperty.smooth.bind(thisProperty)), this.getValueAtTime && (valueAtTime = this.getValueAtTime.bind(this)), this.getVelocityAtTime && (velocityAtTime = this.getVelocityAtTime.bind(this));
                    var comp = elem.comp.globalData.projectInterface.bind(elem.comp.globalData.projectInterface),
                        time, velocity, value, text, textIndex, textTotal, selectorValue;
                    function lookAt(t, e) {
                        var i = [e[0] - t[0], e[1] - t[1], e[2] - t[2]],
                            s = Math.atan2(i[0], Math.sqrt(i[1] * i[1] + i[2] * i[2])) / degToRads;
                        return [-Math.atan2(i[1], i[2]) / degToRads, s, 0]
                    }
                    function easeOut(t, e, i, s, r) {
                        return applyEase(easeOutBez, t, e, i, s, r)
                    }
                    function easeIn(t, e, i, s, r) {
                        return applyEase(easeInBez, t, e, i, s, r)
                    }
                    function ease(t, e, i, s, r) {
                        return applyEase(easeInOutBez, t, e, i, s, r)
                    }
                    function applyEase(t, e, i, s, r, a) {
                        void 0 === r ? (r = i, a = s) : e = (e - i) / (s - i);
                        var n = t(e = 1 < e ? 1 : e < 0 ? 0 : e);
                        if ($bm_isInstanceOfArray(r)) {
                            var o, l = r.length,
                                h = createTypedArray("float32", l);
                            for (o = 0; o < l; o += 1) h[o] = (a[o] - r[o]) * n + r[o];
                            return h
                        }
                        return (a - r) * n + r
                    }
                    function nearestKey(t) {
                        var e, i, s, r = data.k.length;
                        if (data.k.length && "number" != typeof data.k[0])
                            if (i = -1, (t *= elem.comp.globalData.frameRate) < data.k[0].t) i = 1, s = data.k[0].t;
                            else {
                                for (e = 0; e < r - 1; e += 1) {
                                    if (t === data.k[e].t) {
                                        i = e + 1, s = data.k[e].t;
                                        break
                                    }
                                    if (t > data.k[e].t && t < data.k[e + 1].t) {
                                        s = t - data.k[e].t > data.k[e + 1].t - t ? (i = e + 2, data.k[e + 1].t) : (i = e + 1, data.k[e].t);
                                        break
                                    }
                                } - 1 === i && (i = e + 1, s = data.k[e].t)
                            }
                        else s = i = 0;
                        var a = {};
                        return a.index = i, a.time = s / elem.comp.globalData.frameRate, a
                    }
                    function key(t) {
                        var e, i, s;
                        if (!data.k.length || "number" == typeof data.k[0]) throw new Error("The property has no keyframe at index " + t);
                        t -= 1, e = {
                            time: data.k[t].t / elem.comp.globalData.frameRate,
                            value: []
                        };
                        var r = data.k[t].hasOwnProperty("s") ? data.k[t].s : data.k[t - 1].e;
                        for (s = r.length, i = 0; i < s; i += 1) e[i] = r[i], e.value[i] = r[i];
                        return e
                    }
                    function framesToTime(t, e) {
                        return e || (e = elem.comp.globalData.frameRate), t / e
                    }
                    function timeToFrames(t, e) {
                        return t || 0 === t || (t = time), e || (e = elem.comp.globalData.frameRate), t * e
                    }
                    function seedRandom(t) {
                        BMMath.seedrandom(randSeed + t)
                    }
                    function sourceRectAtTime() {
                        return elem.sourceRectAtTime()
                    }
                    function substring(t, e) {
                        return "string" == typeof value ? void 0 === e ? value.substring(t) : value.substring(t, e) : ""
                    }
                    function substr(t, e) {
                        return "string" == typeof value ? void 0 === e ? value.substr(t) : value.substr(t, e) : ""
                    }
                    var index = elem.data.ind,
                        hasParent = !(!elem.hierarchy || !elem.hierarchy.length),
                        parent, randSeed = Math.floor(1e6 * Math.random()),
                        globalData = elem.globalData;
                    function executeExpression(t) {
                        return value = t, _needsRandom && seedRandom(randSeed), this.frameExpressionId === elem.globalData.frameId && "textSelector" !== this.propType ? value : ("textSelector" === this.propType && (textIndex = this.textIndex, textTotal = this.textTotal, selectorValue = this.selectorValue), thisLayer || (text = elem.layerInterface.text, thisLayer = elem.layerInterface, thisComp = elem.comp.compInterface, toWorld = thisLayer.toWorld.bind(thisLayer), fromWorld = thisLayer.fromWorld.bind(thisLayer), fromComp = thisLayer.fromComp.bind(thisLayer), toComp = thisLayer.toComp.bind(thisLayer), mask = thisLayer.mask ? thisLayer.mask.bind(thisLayer) : null, fromCompToSurface = fromComp), transform || (transform = elem.layerInterface("ADBE Transform Group"), ($bm_transform = transform) && (anchorPoint = transform.anchorPoint)), 4 !== elemType || content || (content = thisLayer("ADBE Root Vectors Group")), effect || (effect = thisLayer(4)), (hasParent = !(!elem.hierarchy || !elem.hierarchy.length)) && !parent && (parent = elem.hierarchy[0].layerInterface), time = this.comp.renderedFrame / this.comp.globalData.frameRate, needsVelocity && (velocity = velocityAtTime(time)), expression_function(), this.frameExpressionId = elem.globalData.frameId, "shape" === scoped_bm_rt.propType && (scoped_bm_rt = scoped_bm_rt.v), scoped_bm_rt)
                    }
                    return executeExpression
                }
                return ob.initiateExpression = initiateExpression, ob
            }(),
            expressionHelpers = {
                searchExpressions: function(t, e, i) {
                    e.x && (i.k = !0, i.x = !0, i.initiateExpression = ExpressionManager.initiateExpression, i.effectsSequence.push(i.initiateExpression(t, e, i).bind(i)))
                },
                getSpeedAtTime: function(t) {
                    var e = this.getValueAtTime(t),
                        i = this.getValueAtTime(t + -.01),
                        s = 0;
                    if (e.length) {
                        var r;
                        for (r = 0; r < e.length; r += 1) s += Math.pow(i[r] - e[r], 2);
                        s = 100 * Math.sqrt(s)
                    } else s = 0;
                    return s
                },
                getVelocityAtTime: function(t) {
                    if (void 0 !== this.vel) return this.vel;
                    var e, i, s = this.getValueAtTime(t),
                        r = this.getValueAtTime(t + -.001);
                    if (s.length)
                        for (e = createTypedArray("float32", s.length), i = 0; i < s.length; i += 1) e[i] = (r[i] - s[i]) / -.001;
                    else e = (r - s) / -.001;
                    return e
                },
                getValueAtTime: function(t) {
                    return t *= this.elem.globalData.frameRate, (t -= this.offsetTime) !== this._cachingAtTime.lastFrame && (this._cachingAtTime.lastIndex = this._cachingAtTime.lastFrame < t ? this._cachingAtTime.lastIndex : 0, this._cachingAtTime.value = this.interpolateValue(t, this._cachingAtTime), this._cachingAtTime.lastFrame = t), this._cachingAtTime.value
                },
                getStaticValueAtTime: function() {
                    return this.pv
                },
                setGroupProperty: function(t) {
                    this.propertyGroup = t
                }
            };
        ! function() {
            function o(t, e, i) {
                if (!this.k || !this.keyframes) return this.pv;
                t = t ? t.toLowerCase() : "";
                var s, r, a, n, o, l = this.comp.renderedFrame,
                    h = this.keyframes,
                    p = h[h.length - 1].t;
                if (l <= p) return this.pv;
                if (i ? r = p - (s = e ? Math.abs(p - elem.comp.globalData.frameRate * e) : Math.max(0, p - this.elem.data.ip)) : ((!e || e > h.length - 1) && (e = h.length - 1), s = p - (r = h[h.length - 1 - e].t)), "pingpong" === t) {
                    if (Math.floor((l - r) / s) % 2 != 0) return this.getValueAtTime((s - (l - r) % s + r) / this.comp.globalData.frameRate, 0)
                } else {
                    if ("offset" === t) {
                        var d = this.getValueAtTime(r / this.comp.globalData.frameRate, 0),
                            c = this.getValueAtTime(p / this.comp.globalData.frameRate, 0),
                            f = this.getValueAtTime(((l - r) % s + r) / this.comp.globalData.frameRate, 0),
                            u = Math.floor((l - r) / s);
                        if (this.pv.length) {
                            for (n = (o = new Array(d.length)).length, a = 0; a < n; a += 1) o[a] = (c[a] - d[a]) * u + f[a];
                            return o
                        }
                        return (c - d) * u + f
                    }
                    if ("continue" === t) {
                        var m = this.getValueAtTime(p / this.comp.globalData.frameRate, 0),
                            g = this.getValueAtTime((p - .001) / this.comp.globalData.frameRate, 0);
                        if (this.pv.length) {
                            for (n = (o = new Array(m.length)).length, a = 0; a < n; a += 1) o[a] = m[a] + (m[a] - g[a]) * ((l - p) / this.comp.globalData.frameRate) / 5e-4;
                            return o
                        }
                        return m + (l - p) / .001 * (m - g)
                    }
                }
                return this.getValueAtTime(((l - r) % s + r) / this.comp.globalData.frameRate, 0)
            }
            function l(t, e, i) {
                if (!this.k) return this.pv;
                t = t ? t.toLowerCase() : "";
                var s, r, a, n, o, l = this.comp.renderedFrame,
                    h = this.keyframes,
                    p = h[0].t;
                if (p <= l) return this.pv;
                if (i ? r = p + (s = e ? Math.abs(elem.comp.globalData.frameRate * e) : Math.max(0, this.elem.data.op - p)) : ((!e || e > h.length - 1) && (e = h.length - 1), s = (r = h[e].t) - p), "pingpong" === t) {
                    if (Math.floor((p - l) / s) % 2 == 0) return this.getValueAtTime(((p - l) % s + p) / this.comp.globalData.frameRate, 0)
                } else {
                    if ("offset" === t) {
                        var d = this.getValueAtTime(p / this.comp.globalData.frameRate, 0),
                            c = this.getValueAtTime(r / this.comp.globalData.frameRate, 0),
                            f = this.getValueAtTime((s - (p - l) % s + p) / this.comp.globalData.frameRate, 0),
                            u = Math.floor((p - l) / s) + 1;
                        if (this.pv.length) {
                            for (n = (o = new Array(d.length)).length, a = 0; a < n; a += 1) o[a] = f[a] - (c[a] - d[a]) * u;
                            return o
                        }
                        return f - (c - d) * u
                    }
                    if ("continue" === t) {
                        var m = this.getValueAtTime(p / this.comp.globalData.frameRate, 0),
                            g = this.getValueAtTime((p + .001) / this.comp.globalData.frameRate, 0);
                        if (this.pv.length) {
                            for (n = (o = new Array(m.length)).length, a = 0; a < n; a += 1) o[a] = m[a] + (m[a] - g[a]) * (p - l) / .001;
                            return o
                        }
                        return m + (m - g) * (p - l) / .001
                    }
                }
                return this.getValueAtTime((s - (p - l) % s + p) / this.comp.globalData.frameRate, 0)
            }
            function h(t, e) {
                if (!this.k) return this.pv;
                if (t = .5 * (t || .4), (e = Math.floor(e || 5)) <= 1) return this.pv;
                var i, s, r = this.comp.renderedFrame / this.comp.globalData.frameRate,
                    a = r - t,
                    n = 1 < e ? (r + t - a) / (e - 1) : 1,
                    o = 0,
                    l = 0;
                for (i = this.pv.length ? createTypedArray("float32", this.pv.length) : 0; o < e;) {
                    if (s = this.getValueAtTime(a + o * n), this.pv.length)
                        for (l = 0; l < this.pv.length; l += 1) i[l] += s[l];
                    else i += s;
                    o += 1
                }
                if (this.pv.length)
                    for (l = 0; l < this.pv.length; l += 1) i[l] /= e;
                else i /= e;
                return i
            }
            var r = TransformPropertyFactory.getTransformProperty;
            TransformPropertyFactory.getTransformProperty = function(t, e, i) {
                var s = r(t, e, i);
                return s.dynamicProperties.length ? s.getValueAtTime = function(t) {
                    console.warn("Transform at time not supported")
                }.bind(s) : s.getValueAtTime = function(t) {}.bind(s), s.setGroupProperty = expressionHelpers.setGroupProperty, s
            };
            var p = PropertyFactory.getProp;
            PropertyFactory.getProp = function(t, e, i, s, r) {
                var a = p(t, e, i, s, r);
                a.kf ? a.getValueAtTime = expressionHelpers.getValueAtTime.bind(a) : a.getValueAtTime = expressionHelpers.getStaticValueAtTime.bind(a), a.setGroupProperty = expressionHelpers.setGroupProperty, a.loopOut = o, a.loopIn = l, a.smooth = h, a.getVelocityAtTime = expressionHelpers.getVelocityAtTime.bind(a), a.getSpeedAtTime = expressionHelpers.getSpeedAtTime.bind(a), a.numKeys = 1 === e.a ? e.k.length : 0, a.propertyIndex = e.ix;
                var n = 0;
                return 0 !== i && (n = createTypedArray("float32", 1 === e.a ? e.k[0].s.length : e.k.length)), a._cachingAtTime = {
                    lastFrame: initialDefaultFrame,
                    lastIndex: 0,
                    value: n
                }, expressionHelpers.searchExpressions(t, e, a), a.k && r.addDynamicProperty(a), a
            };
            var t = ShapePropertyFactory.getConstructorFunction(),
                e = ShapePropertyFactory.getKeyframedConstructorFunction();
            function i() {}
            i.prototype = {
                vertices: function(t, e) {
                    this.k && this.getValue();
                    var i = this.v;
                    void 0 !== e && (i = this.getValueAtTime(e, 0));
                    var s, r = i._length,
                        a = i[t],
                        n = i.v,
                        o = createSizedArray(r);
                    for (s = 0; s < r; s += 1) o[s] = "i" === t || "o" === t ? [a[s][0] - n[s][0], a[s][1] - n[s][1]] : [a[s][0], a[s][1]];
                    return o
                },
                points: function(t) {
                    return this.vertices("v", t)
                },
                inTangents: function(t) {
                    return this.vertices("i", t)
                },
                outTangents: function(t) {
                    return this.vertices("o", t)
                },
                isClosed: function() {
                    return this.v.c
                },
                pointOnPath: function(t, e) {
                    var i = this.v;
                    void 0 !== e && (i = this.getValueAtTime(e, 0)), this._segmentsLength || (this._segmentsLength = bez.getSegmentsLength(i));
                    for (var s, r = this._segmentsLength, a = r.lengths, n = r.totalLength * t, o = 0, l = a.length, h = 0; o < l;) {
                        if (h + a[o].addedLength > n) {
                            var p = o,
                                d = i.c && o === l - 1 ? 0 : o + 1,
                                c = (n - h) / a[o].addedLength;
                            s = bez.getPointInSegment(i.v[p], i.v[d], i.o[p], i.i[d], c, a[o]);
                            break
                        }
                        h += a[o].addedLength, o += 1
                    }
                    return s || (s = i.c ? [i.v[0][0], i.v[0][1]] : [i.v[i._length - 1][0], i.v[i._length - 1][1]]), s
                },
                vectorOnPath: function(t, e, i) {
                    t = 1 == t ? this.v.c ? 0 : .999 : t;
                    var s = this.pointOnPath(t, e),
                        r = this.pointOnPath(t + .001, e),
                        a = r[0] - s[0],
                        n = r[1] - s[1],
                        o = Math.sqrt(Math.pow(a, 2) + Math.pow(n, 2));
                    return 0 === o ? [0, 0] : "tangent" === i ? [a / o, n / o] : [-n / o, a / o]
                },
                tangentOnPath: function(t, e) {
                    return this.vectorOnPath(t, e, "tangent")
                },
                normalOnPath: function(t, e) {
                    return this.vectorOnPath(t, e, "normal")
                },
                setGroupProperty: expressionHelpers.setGroupProperty,
                getValueAtTime: expressionHelpers.getStaticValueAtTime
            }, extendPrototype([i], t), extendPrototype([i], e), e.prototype.getValueAtTime = function(t) {
                return this._cachingAtTime || (this._cachingAtTime = {
                    shapeValue: shape_pool.clone(this.pv),
                    lastIndex: 0,
                    lastTime: initialDefaultFrame
                }), t *= this.elem.globalData.frameRate, (t -= this.offsetTime) !== this._cachingAtTime.lastTime && (this._cachingAtTime.lastIndex = this._cachingAtTime.lastTime < t ? this._caching.lastIndex : 0, this._cachingAtTime.lastTime = t, this.interpolateShape(t, this._cachingAtTime.shapeValue, this._cachingAtTime)), this._cachingAtTime.shapeValue
            }, e.prototype.initiateExpression = ExpressionManager.initiateExpression;
            var n = ShapePropertyFactory.getShapeProp;
            ShapePropertyFactory.getShapeProp = function(t, e, i, s, r) {
                var a = n(t, e, i, s, r);
                return a.propertyIndex = e.ix, a.lock = !1, 3 === i ? expressionHelpers.searchExpressions(t, e.pt, a) : 4 === i && expressionHelpers.searchExpressions(t, e.ks, a), a.k && t.addDynamicProperty(a), a
            }
        }(), TextProperty.prototype.getExpressionValue = function(t, e) {
            var i = this.calculateExpression(e);
            if (t.t === i) return t;
            var s = {};
            return this.copyData(s, t), s.t = i.toString(), s.__complete = !1, s
        }, TextProperty.prototype.searchProperty = function() {
            var t = this.searchKeyframes(),
                e = this.searchExpressions();
            return this.kf = t || e, this.kf
        }, TextProperty.prototype.searchExpressions = function() {
            if (this.data.d.x) return this.calculateExpression = ExpressionManager.initiateExpression.bind(this)(this.elem, this.data.d, this), this.addEffect(this.getExpressionValue.bind(this)), !0
        };
        var ShapeExpressionInterface = function() {
                function d(t, e, i) {
                    var s, r = [],
                        a = t ? t.length : 0;
                    for (s = 0; s < a; s += 1) "gr" == t[s].ty ? r.push(n(t[s], e[s], i)) : "fl" == t[s].ty ? r.push(o(t[s], e[s], i)) : "st" == t[s].ty ? r.push(l(t[s], e[s], i)) : "tm" == t[s].ty ? r.push(h(t[s], e[s], i)) : "tr" == t[s].ty || ("el" == t[s].ty ? r.push(p(t[s], e[s], i)) : "sr" == t[s].ty ? r.push(c(t[s], e[s], i)) : "sh" == t[s].ty ? r.push(g(t[s], e[s], i)) : "rc" == t[s].ty ? r.push(f(t[s], e[s], i)) : "rd" == t[s].ty ? r.push(u(t[s], e[s], i)) : "rp" == t[s].ty && r.push(m(t[s], e[s], i)));
                    return r
                }
                function n(t, e, i) {
                    var s = function(t) {
                        switch (t) {
                            case "ADBE Vectors Group":
                            case "Contents":
                            case 2:
                                return s.content;
                            default:
                                return s.transform
                        }
                    };
                    s.propertyGroup = function(t) {
                        return 1 === t ? s : i(t - 1)
                    };
                    var r, a, n, o, l, h = (r = t, a = e, n = s.propertyGroup, (l = function(t) {
                            for (var e = 0, i = o.length; e < i;) {
                                if (o[e]._name === t || o[e].mn === t || o[e].propertyIndex === t || o[e].ix === t || o[e].ind === t) return o[e];
                                e += 1
                            }
                            if ("number" == typeof t) return o[t - 1]
                        }).propertyGroup = function(t) {
                            return 1 === t ? l : n(t - 1)
                        }, o = d(r.it, a.it, l.propertyGroup), l.numProperties = o.length, l.propertyIndex = r.cix, l._name = r.nm, l),
                        p = function(e, t, i) {
                            function s(t) {
                                return 1 == t ? r : i(--t)
                            }
                            function r(t) {
                                return e.a.ix === t || "Anchor Point" === t ? r.anchorPoint : e.o.ix === t || "Opacity" === t ? r.opacity : e.p.ix === t || "Position" === t ? r.position : e.r.ix === t || "Rotation" === t || "ADBE Vector Rotation" === t ? r.rotation : e.s.ix === t || "Scale" === t ? r.scale : e.sk && e.sk.ix === t || "Skew" === t ? r.skew : e.sa && e.sa.ix === t || "Skew Axis" === t ? r.skewAxis : void 0
                            }
                            return t.transform.mProps.o.setGroupProperty(s), t.transform.mProps.p.setGroupProperty(s), t.transform.mProps.a.setGroupProperty(s), t.transform.mProps.s.setGroupProperty(s), t.transform.mProps.r.setGroupProperty(s), t.transform.mProps.sk && (t.transform.mProps.sk.setGroupProperty(s), t.transform.mProps.sa.setGroupProperty(s)), t.transform.op.setGroupProperty(s), Object.defineProperties(r, {
                                opacity: {
                                    get: ExpressionPropertyInterface(t.transform.mProps.o)
                                },
                                position: {
                                    get: ExpressionPropertyInterface(t.transform.mProps.p)
                                },
                                anchorPoint: {
                                    get: ExpressionPropertyInterface(t.transform.mProps.a)
                                },
                                scale: {
                                    get: ExpressionPropertyInterface(t.transform.mProps.s)
                                },
                                rotation: {
                                    get: ExpressionPropertyInterface(t.transform.mProps.r)
                                },
                                skew: {
                                    get: ExpressionPropertyInterface(t.transform.mProps.sk)
                                },
                                skewAxis: {
                                    get: ExpressionPropertyInterface(t.transform.mProps.sa)
                                },
                                _name: {
                                    value: e.nm
                                }
                            }), r.ty = "tr", r.mn = e.mn, r.propertyGroup = i, r
                        }(t.it[t.it.length - 1], e.it[e.it.length - 1], s.propertyGroup);
                    return s.content = h, s.transform = p, Object.defineProperty(s, "_name", {
                        get: function() {
                            return t.nm
                        }
                    }), s.numProperties = t.np, s.propertyIndex = t.ix, s.nm = t.nm, s.mn = t.mn, s
                }
                function o(t, e, i) {
                    function s(t) {
                        return "Color" === t || "color" === t ? s.color : "Opacity" === t || "opacity" === t ? s.opacity : void 0
                    }
                    return Object.defineProperties(s, {
                        color: {
                            get: ExpressionPropertyInterface(e.c)
                        },
                        opacity: {
                            get: ExpressionPropertyInterface(e.o)
                        },
                        _name: {
                            value: t.nm
                        },
                        mn: {
                            value: t.mn
                        }
                    }), e.c.setGroupProperty(i), e.o.setGroupProperty(i), s
                }
                function l(t, e, i) {
                    function s(t) {
                        return 1 === t ? ob : i(t - 1)
                    }
                    function r(t) {
                        return 1 === t ? l : s(t - 1)
                    }
                    var a, n, o = t.d ? t.d.length : 0,
                        l = {};
                    for (a = 0; a < o; a += 1) n = a, Object.defineProperty(l, t.d[n].nm, {
                        get: ExpressionPropertyInterface(e.d.dataProps[n].p)
                    }), e.d.dataProps[a].p.setGroupProperty(r);
                    function h(t) {
                        return "Color" === t || "color" === t ? h.color : "Opacity" === t || "opacity" === t ? h.opacity : "Stroke Width" === t || "stroke width" === t ? h.strokeWidth : void 0
                    }
                    return Object.defineProperties(h, {
                        color: {
                            get: ExpressionPropertyInterface(e.c)
                        },
                        opacity: {
                            get: ExpressionPropertyInterface(e.o)
                        },
                        strokeWidth: {
                            get: ExpressionPropertyInterface(e.w)
                        },
                        dash: {
                            get: function() {
                                return l
                            }
                        },
                        _name: {
                            value: t.nm
                        },
                        mn: {
                            value: t.mn
                        }
                    }), e.c.setGroupProperty(s), e.o.setGroupProperty(s), e.w.setGroupProperty(s), h
                }
                function h(e, t, i) {
                    function s(t) {
                        return 1 == t ? r : i(--t)
                    }
                    function r(t) {
                        return t === e.e.ix || "End" === t || "end" === t ? r.end : t === e.s.ix ? r.start : t === e.o.ix ? r.offset : void 0
                    }
                    return r.propertyIndex = e.ix, t.s.setGroupProperty(s), t.e.setGroupProperty(s), t.o.setGroupProperty(s), r.propertyIndex = e.ix, r.propertyGroup = i, Object.defineProperties(r, {
                        start: {
                            get: ExpressionPropertyInterface(t.s)
                        },
                        end: {
                            get: ExpressionPropertyInterface(t.e)
                        },
                        offset: {
                            get: ExpressionPropertyInterface(t.o)
                        },
                        _name: {
                            value: e.nm
                        }
                    }), r.mn = e.mn, r
                }
                function p(e, t, i) {
                    function s(t) {
                        return 1 == t ? a : i(--t)
                    }
                    a.propertyIndex = e.ix;
                    var r = "tm" === t.sh.ty ? t.sh.prop : t.sh;
                    function a(t) {
                        return e.p.ix === t ? a.position : e.s.ix === t ? a.size : void 0
                    }
                    return r.s.setGroupProperty(s), r.p.setGroupProperty(s), Object.defineProperties(a, {
                        size: {
                            get: ExpressionPropertyInterface(r.s)
                        },
                        position: {
                            get: ExpressionPropertyInterface(r.p)
                        },
                        _name: {
                            value: e.nm
                        }
                    }), a.mn = e.mn, a
                }
                function c(e, t, i) {
                    function s(t) {
                        return 1 == t ? a : i(--t)
                    }
                    var r = "tm" === t.sh.ty ? t.sh.prop : t.sh;
                    function a(t) {
                        return e.p.ix === t ? a.position : e.r.ix === t ? a.rotation : e.pt.ix === t ? a.points : e.or.ix === t || "ADBE Vector Star Outer Radius" === t ? a.outerRadius : e.os.ix === t ? a.outerRoundness : !e.ir || e.ir.ix !== t && "ADBE Vector Star Inner Radius" !== t ? e.is && e.is.ix === t ? a.innerRoundness : void 0 : a.innerRadius
                    }
                    return a.propertyIndex = e.ix, r.or.setGroupProperty(s), r.os.setGroupProperty(s), r.pt.setGroupProperty(s), r.p.setGroupProperty(s), r.r.setGroupProperty(s), e.ir && (r.ir.setGroupProperty(s), r.is.setGroupProperty(s)), Object.defineProperties(a, {
                        position: {
                            get: ExpressionPropertyInterface(r.p)
                        },
                        rotation: {
                            get: ExpressionPropertyInterface(r.r)
                        },
                        points: {
                            get: ExpressionPropertyInterface(r.pt)
                        },
                        outerRadius: {
                            get: ExpressionPropertyInterface(r.or)
                        },
                        outerRoundness: {
                            get: ExpressionPropertyInterface(r.os)
                        },
                        innerRadius: {
                            get: ExpressionPropertyInterface(r.ir)
                        },
                        innerRoundness: {
                            get: ExpressionPropertyInterface(r.is)
                        },
                        _name: {
                            value: e.nm
                        }
                    }), a.mn = e.mn, a
                }
                function f(e, t, i) {
                    function s(t) {
                        return 1 == t ? a : i(--t)
                    }
                    var r = "tm" === t.sh.ty ? t.sh.prop : t.sh;
                    function a(t) {
                        return e.p.ix === t ? a.position : e.r.ix === t ? a.roundness : e.s.ix === t || "Size" === t || "ADBE Vector Rect Size" === t ? a.size : void 0
                    }
                    return a.propertyIndex = e.ix, r.p.setGroupProperty(s), r.s.setGroupProperty(s), r.r.setGroupProperty(s), Object.defineProperties(a, {
                        position: {
                            get: ExpressionPropertyInterface(r.p)
                        },
                        roundness: {
                            get: ExpressionPropertyInterface(r.r)
                        },
                        size: {
                            get: ExpressionPropertyInterface(r.s)
                        },
                        _name: {
                            value: e.nm
                        }
                    }), a.mn = e.mn, a
                }
                function u(e, t, i) {
                    var s = t;
                    function r(t) {
                        if (e.r.ix === t || "Round Corners 1" === t) return r.radius
                    }
                    return r.propertyIndex = e.ix, s.rd.setGroupProperty(function(t) {
                        return 1 == t ? r : i(--t)
                    }), Object.defineProperties(r, {
                        radius: {
                            get: ExpressionPropertyInterface(s.rd)
                        },
                        _name: {
                            value: e.nm
                        }
                    }), r.mn = e.mn, r
                }
                function m(e, t, i) {
                    function s(t) {
                        return 1 == t ? a : i(--t)
                    }
                    var r = t;
                    function a(t) {
                        return e.c.ix === t || "Copies" === t ? a.copies : e.o.ix === t || "Offset" === t ? a.offset : void 0
                    }
                    return a.propertyIndex = e.ix, r.c.setGroupProperty(s), r.o.setGroupProperty(s), Object.defineProperties(a, {
                        copies: {
                            get: ExpressionPropertyInterface(r.c)
                        },
                        offset: {
                            get: ExpressionPropertyInterface(r.o)
                        },
                        _name: {
                            value: e.nm
                        }
                    }), a.mn = e.mn, a
                }
                function g(t, e, i) {
                    var s = e.sh;
                    function r(t) {
                        if ("Shape" === t || "shape" === t || "Path" === t || "path" === t || "ADBE Vector Shape" === t || 2 === t) return r.path
                    }
                    return s.setGroupProperty(function(t) {
                        return 1 == t ? r : i(--t)
                    }), Object.defineProperties(r, {
                        path: {
                            get: function() {
                                return s.k && s.getValue(), s
                            }
                        },
                        shape: {
                            get: function() {
                                return s.k && s.getValue(), s
                            }
                        },
                        _name: {
                            value: t.nm
                        },
                        ix: {
                            value: t.ix
                        },
                        propertyIndex: {
                            value: t.ix
                        },
                        mn: {
                            value: t.mn
                        }
                    }), r
                }
                return function(t, e, i) {
                    var s;
                    function r(t) {
                        if ("number" == typeof t) return s[t - 1];
                        for (var e = 0, i = s.length; e < i;) {
                            if (s[e]._name === t) return s[e];
                            e += 1
                        }
                    }
                    return r.propertyGroup = i, s = d(t, e, r), r.numProperties = s.length, r
                }
            }(),
            TextExpressionInterface = function(e) {
                var i;
                function t() {}
                return Object.defineProperty(t, "sourceText", {
                    get: function() {
                        e.textProperty.getValue();
                        var t = e.textProperty.currentData.t;
                        return void 0 !== t && (e.textProperty.currentData.t = void 0, (i = new String(t)).value = t || new String(t)), i
                    }
                }), t
            },
            LayerExpressionInterface = function() {
                function r(t, e) {
                    var i = new Matrix;
                    if (i.reset(), this._elem.finalTransform.mProp.applyToMatrix(i), this._elem.hierarchy && this._elem.hierarchy.length) {
                        var s, r = this._elem.hierarchy.length;
                        for (s = 0; s < r; s += 1) this._elem.hierarchy[s].finalTransform.mProp.applyToMatrix(i);
                        return i.applyToPointArray(t[0], t[1], t[2] || 0)
                    }
                    return i.applyToPointArray(t[0], t[1], t[2] || 0)
                }
                function a(t, e) {
                    var i = new Matrix;
                    if (i.reset(), this._elem.finalTransform.mProp.applyToMatrix(i), this._elem.hierarchy && this._elem.hierarchy.length) {
                        var s, r = this._elem.hierarchy.length;
                        for (s = 0; s < r; s += 1) this._elem.hierarchy[s].finalTransform.mProp.applyToMatrix(i);
                        return i.inversePoint(t)
                    }
                    return i.inversePoint(t)
                }
                function n(t) {
                    var e = new Matrix;
                    if (e.reset(), this._elem.finalTransform.mProp.applyToMatrix(e), this._elem.hierarchy && this._elem.hierarchy.length) {
                        var i, s = this._elem.hierarchy.length;
                        for (i = 0; i < s; i += 1) this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(e);
                        return e.inversePoint(t)
                    }
                    return e.inversePoint(t)
                }
                function o() {
                    return [1, 1, 1, 1]
                }
                return function(e) {
                    var i;
                    function s(t) {
                        switch (t) {
                            case "ADBE Root Vectors Group":
                            case "Contents":
                            case 2:
                                return s.shapeInterface;
                            case 1:
                            case 6:
                            case "Transform":
                            case "transform":
                            case "ADBE Transform Group":
                                return i;
                            case 4:
                            case "ADBE Effect Parade":
                            case "effects":
                            case "Effects":
                                return s.effect
                        }
                    }
                    s.toWorld = r, s.fromWorld = a, s.toComp = r, s.fromComp = n, s.sampleImage = o, s.sourceRectAtTime = e.sourceRectAtTime.bind(e);
                    var t = getDescriptor(i = TransformExpressionInterface((s._elem = e).finalTransform.mProp), "anchorPoint");
                    return Object.defineProperties(s, {
                        hasParent: {
                            get: function() {
                                return e.hierarchy.length
                            }
                        },
                        parent: {
                            get: function() {
                                return e.hierarchy[0].layerInterface
                            }
                        },
                        rotation: getDescriptor(i, "rotation"),
                        scale: getDescriptor(i, "scale"),
                        position: getDescriptor(i, "position"),
                        opacity: getDescriptor(i, "opacity"),
                        anchorPoint: t,
                        anchor_point: t,
                        transform: {
                            get: function() {
                                return i
                            }
                        },
                        active: {
                            get: function() {
                                return e.isInRange
                            }
                        }
                    }), s.startTime = e.data.st, s.index = e.data.ind, s.source = e.data.refId, s.height = 0 === e.data.ty ? e.data.h : 100, s.width = 0 === e.data.ty ? e.data.w : 100, s.inPoint = e.data.ip / e.comp.globalData.frameRate, s.outPoint = e.data.op / e.comp.globalData.frameRate, s._name = e.data.nm, s.registerMaskInterface = function(t) {
                        s.mask = new MaskManagerInterface(t, e)
                    }, s.registerEffectsInterface = function(t) {
                        s.effect = t
                    }, s
                }
            }(),
            CompExpressionInterface = function(s) {
                function t(t) {
                    for (var e = 0, i = s.layers.length; e < i;) {
                        if (s.layers[e].nm === t || s.layers[e].ind === t) return s.elements[e].layerInterface;
                        e += 1
                    }
                    return null
                }
                return Object.defineProperty(t, "_name", {
                    value: s.data.nm
                }), (t.layer = t).pixelAspect = 1, t.height = s.data.h || s.globalData.compSize.h, t.width = s.data.w || s.globalData.compSize.w, t.pixelAspect = 1, t.frameDuration = 1 / s.globalData.frameRate, t.displayStartTime = 0, t.numLayers = s.layers.length, t
            },
            TransformExpressionInterface = function(t) {
                function e(t) {
                    switch (t) {
                        case "scale":
                        case "Scale":
                        case "ADBE Scale":
                        case 6:
                            return e.scale;
                        case "rotation":
                        case "Rotation":
                        case "ADBE Rotation":
                        case "ADBE Rotate Z":
                        case 10:
                            return e.rotation;
                        case "ADBE Rotate X":
                            return e.xRotation;
                        case "ADBE Rotate Y":
                            return e.yRotation;
                        case "position":
                        case "Position":
                        case "ADBE Position":
                        case 2:
                            return e.position;
                        case "ADBE Position_0":
                            return e.xPosition;
                        case "ADBE Position_1":
                            return e.yPosition;
                        case "ADBE Position_2":
                            return e.zPosition;
                        case "anchorPoint":
                        case "AnchorPoint":
                        case "Anchor Point":
                        case "ADBE AnchorPoint":
                        case 1:
                            return e.anchorPoint;
                        case "opacity":
                        case "Opacity":
                        case 11:
                            return e.opacity
                    }
                }
                if (Object.defineProperty(e, "rotation", {
                        get: ExpressionPropertyInterface(t.r || t.rz)
                    }), Object.defineProperty(e, "zRotation", {
                        get: ExpressionPropertyInterface(t.rz || t.r)
                    }), Object.defineProperty(e, "xRotation", {
                        get: ExpressionPropertyInterface(t.rx)
                    }), Object.defineProperty(e, "yRotation", {
                        get: ExpressionPropertyInterface(t.ry)
                    }), Object.defineProperty(e, "scale", {
                        get: ExpressionPropertyInterface(t.s)
                    }), t.p) var i = ExpressionPropertyInterface(t.p);
                return Object.defineProperty(e, "position", {
                    get: function() {
                        return t.p ? i() : [t.px.v, t.py.v, t.pz ? t.pz.v : 0]
                    }
                }), Object.defineProperty(e, "xPosition", {
                    get: ExpressionPropertyInterface(t.px)
                }), Object.defineProperty(e, "yPosition", {
                    get: ExpressionPropertyInterface(t.py)
                }), Object.defineProperty(e, "zPosition", {
                    get: ExpressionPropertyInterface(t.pz)
                }), Object.defineProperty(e, "anchorPoint", {
                    get: ExpressionPropertyInterface(t.a)
                }), Object.defineProperty(e, "opacity", {
                    get: ExpressionPropertyInterface(t.o)
                }), Object.defineProperty(e, "skew", {
                    get: ExpressionPropertyInterface(t.sk)
                }), Object.defineProperty(e, "skewAxis", {
                    get: ExpressionPropertyInterface(t.sa)
                }), Object.defineProperty(e, "orientation", {
                    get: ExpressionPropertyInterface(t.or)
                }), e
            },
            ProjectInterface = function() {
                function e(t) {
                    this.compositions.push(t)
                }
                return function() {
                    function t(t) {
                        for (var e = 0, i = this.compositions.length; e < i;) {
                            if (this.compositions[e].data && this.compositions[e].data.nm === t) return this.compositions[e].prepareFrame && this.compositions[e].data.xt && this.compositions[e].prepareFrame(this.currentFrame), this.compositions[e].compInterface;
                            e += 1
                        }
                    }
                    return t.compositions = [], t.currentFrame = 0, t.registerComposition = e, t
                }
            }(),
            EffectsExpressionInterface = function() {
                function h(r, t, e, i) {
                    var s, a = [],
                        n = r.ef.length;
                    for (s = 0; s < n; s += 1) 5 === r.ef[s].ty ? a.push(h(r.ef[s], t.effectElements[s], t.effectElements[s].propertyGroup, i)) : a.push(p(t.effectElements[s], r.ef[s].ty, i, o));
                    function o(t) {
                        return 1 === t ? l : e(t - 1)
                    }
                    var l = function(t) {
                        for (var e = r.ef, i = 0, s = e.length; i < s;) {
                            if (t === e[i].nm || t === e[i].mn || t === e[i].ix) return 5 === e[i].ty ? a[i] : a[i]();
                            i += 1
                        }
                        return a[0]()
                    };
                    return l.propertyGroup = o, "ADBE Color Control" === r.mn && Object.defineProperty(l, "color", {
                        get: function() {
                            return a[0]()
                        }
                    }), Object.defineProperty(l, "numProperties", {
                        get: function() {
                            return r.np
                        }
                    }), l.active = l.enabled = 0 !== r.en, l
                }
                function p(t, e, i, s) {
                    var r = ExpressionPropertyInterface(t.p);
                    return t.p.setGroupProperty && t.p.setGroupProperty(s),
                        function() {
                            return 10 === e ? i.comp.compInterface(t.p.v) : r()
                        }
                }
                return {
                    createEffectsInterface: function(r, t) {
                        if (r.effectsManager) {
                            var e, a = [],
                                i = r.data.ef,
                                s = r.effectsManager.effectElements.length;
                            for (e = 0; e < s; e += 1) a.push(h(i[e], r.effectsManager.effectElements[e], t, r));
                            return function(t) {
                                for (var e = r.data.ef || [], i = 0, s = e.length; i < s;) {
                                    if (t === e[i].nm || t === e[i].mn || t === e[i].ix) return a[i];
                                    i += 1
                                }
                            }
                        }
                    }
                }
            }(),
            MaskManagerInterface = function() {
                function a(t, e) {
                    this._mask = t, this._data = e
                }
                return Object.defineProperty(a.prototype, "maskPath", {
                        get: function() {
                            return this._mask.prop.k && this._mask.prop.getValue(), this._mask.prop
                        }
                    }), Object.defineProperty(a.prototype, "maskOpacity", {
                        get: function() {
                            return this._mask.op.k && this._mask.op.getValue(), 100 * this._mask.op.v
                        }
                    }),
                    function(e, t) {
                        var i, s = createSizedArray(e.viewData.length),
                            r = e.viewData.length;
                        for (i = 0; i < r; i += 1) s[i] = new a(e.viewData[i], e.masksProperties[i]);
                        return function(t) {
                            for (i = 0; i < r;) {
                                if (e.masksProperties[i].nm === t) return s[i];
                                i += 1
                            }
                        }
                    }
            }(),
            ExpressionPropertyInterface = function() {
                var r = {
                        pv: 0,
                        v: 0,
                        mult: 1
                    },
                    n = {
                        pv: [0, 0, 0],
                        v: [0, 0, 0],
                        mult: 1
                    };
                function o(s, r, a) {
                    Object.defineProperty(s, "velocity", {
                        get: function() {
                            return r.getVelocityAtTime(r.comp.currentFrame)
                        }
                    }), s.numKeys = r.keyframes ? r.keyframes.length : 0, s.key = function(t) {
                        if (s.numKeys) {
                            var e;
                            e = "s" in r.keyframes[t - 1] ? r.keyframes[t - 1].s : "e" in r.keyframes[t - 2] ? r.keyframes[t - 2].e : r.keyframes[t - 2].s;
                            var i = "unidimensional" === a ? new Number(e) : Object.assign({}, e);
                            return i.time = r.keyframes[t - 1].t / r.elem.comp.globalData.frameRate, i
                        }
                        return 0
                    }, s.valueAtTime = r.getValueAtTime, s.speedAtTime = r.getSpeedAtTime, s.velocityAtTime = r.getVelocityAtTime, s.propertyGroup = r.propertyGroup
                }
                function e() {
                    return r
                }
                return function(t) {
                    return t ? "unidimensional" === t.propType ? function(t) {
                        t && "pv" in t || (t = r);
                        var e = 1 / t.mult,
                            i = t.pv * e,
                            s = new Number(i);
                        return s.value = i, o(s, t, "unidimensional"),
                            function() {
                                return t.k && t.getValue(), i = t.v * e, s.value !== i && ((s = new Number(i)).value = i, o(s, t, "unidimensional")), s
                            }
                    }(t) : function(e) {
                        e && "pv" in e || (e = n);
                        var i = 1 / e.mult,
                            s = e.pv.length,
                            r = createTypedArray("float32", s),
                            a = createTypedArray("float32", s);
                        return r.value = a, o(r, e, "multidimensional"),
                            function() {
                                e.k && e.getValue();
                                for (var t = 0; t < s; t += 1) r[t] = a[t] = e.v[t] * i;
                                return r
                            }
                    }(t) : e
                }
            }(),
            h5, i5;
        function SliderEffect(t, e, i) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, i)
        }
        function AngleEffect(t, e, i) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, i)
        }
        function ColorEffect(t, e, i) {
            this.p = PropertyFactory.getProp(e, t.v, 1, 0, i)
        }
        function PointEffect(t, e, i) {
            this.p = PropertyFactory.getProp(e, t.v, 1, 0, i)
        }
        function LayerIndexEffect(t, e, i) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, i)
        }
        function MaskIndexEffect(t, e, i) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, i)
        }
        function CheckboxEffect(t, e, i) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, i)
        }
        function NoValueEffect() {
            this.p = {}
        }
        function EffectsManager() {}
        function EffectsManager(t, e) {
            var i = t.ef || [];
            this.effectElements = [];
            var s, r, a = i.length;
            for (s = 0; s < a; s++) r = new GroupEffect(i[s], e), this.effectElements.push(r)
        }
        function GroupEffect(t, e) {
            this.init(t, e)
        }
        h5 = function() {
            function i(t, e) {
                return this.textIndex = t + 1, this.textTotal = e, this.v = this.getValue() * this.mult, this.v
            }
            return function(t, e) {
                this.pv = 1, this.comp = t.comp, this.elem = t, this.mult = .01, this.propType = "textSelector", this.textTotal = e.totalChars, this.selectorValue = 100, this.lastValue = [1, 1, 1], this.k = !0, this.x = !0, this.getValue = ExpressionManager.initiateExpression.bind(this)(t, e, this), this.getMult = i, this.getVelocityAtTime = expressionHelpers.getVelocityAtTime, this.kf ? this.getValueAtTime = expressionHelpers.getValueAtTime.bind(this) : this.getValueAtTime = expressionHelpers.getStaticValueAtTime.bind(this), this.setGroupProperty = expressionHelpers.setGroupProperty
            }
        }(), i5 = TextSelectorProp.getTextSelectorProp, TextSelectorProp.getTextSelectorProp = function(t, e, i) {
            return 1 === e.t ? new h5(t, e, i) : i5(t, e, i)
        }, extendPrototype([DynamicPropertyContainer], GroupEffect), GroupEffect.prototype.getValue = GroupEffect.prototype.iterateDynamicProperties, GroupEffect.prototype.init = function(t, e) {
            this.data = t, this.effectElements = [], this.initDynamicPropertyContainer(e);
            var i, s, r = this.data.ef.length,
                a = this.data.ef;
            for (i = 0; i < r; i += 1) {
                switch (s = null, a[i].ty) {
                    case 0:
                        s = new SliderEffect(a[i], e, this);
                        break;
                    case 1:
                        s = new AngleEffect(a[i], e, this);
                        break;
                    case 2:
                        s = new ColorEffect(a[i], e, this);
                        break;
                    case 3:
                        s = new PointEffect(a[i], e, this);
                        break;
                    case 4:
                    case 7:
                        s = new CheckboxEffect(a[i], e, this);
                        break;
                    case 10:
                        s = new LayerIndexEffect(a[i], e, this);
                        break;
                    case 11:
                        s = new MaskIndexEffect(a[i], e, this);
                        break;
                    case 5:
                        s = new EffectsManager(a[i], e, this);
                        break;
                    default:
                        s = new NoValueEffect(a[i], e, this)
                }
                s && this.effectElements.push(s)
            }
        };
        var lottiejs = {},
            _isFrozen = !1;
        function setLocationHref(t) {
            locationHref = t
        }
        function searchAnimations() {
            !0 === standalone ? animationManager.searchAnimations(animationData, standalone, renderer) : animationManager.searchAnimations()
        }
        function setSubframeRendering(t) {
            subframeEnabled = t
        }
        function loadAnimation(t) {
            return !0 === standalone && (t.animationData = JSON.parse(animationData)), animationManager.loadAnimation(t)
        }
        function setQuality(t) {
            if ("string" == typeof t) switch (t) {
                case "high":
                    defaultCurveSegments = 200;
                    break;
                case "medium":
                    defaultCurveSegments = 50;
                    break;
                case "low":
                    defaultCurveSegments = 10
            } else !isNaN(t) && 1 < t && (defaultCurveSegments = t);
            roundValues(!(50 <= defaultCurveSegments))
        }
        function inBrowser() {
            return "undefined" != typeof navigator
        }
        function installPlugin(t, e) {
            "expressions" === t && (expressionsPlugin = e)
        }
        function getFactory(t) {
            switch (t) {
                case "propertyFactory":
                    return PropertyFactory;
                case "shapePropertyFactory":
                    return ShapePropertyFactory;
                case "matrix":
                    return Matrix
            }
        }
        function checkReady() {
            "complete" === document.readyState && (clearInterval(readyStateCheckInterval), searchAnimations())
        }
        function getQueryVariable(t) {
            for (var e = queryString.split("&"), i = 0; i < e.length; i++) {
                var s = e[i].split("=");
                if (decodeURIComponent(s[0]) == t) return decodeURIComponent(s[1])
            }
        }
        lottiejs.play = animationManager.play, lottiejs.pause = animationManager.pause, lottiejs.setLocationHref = setLocationHref, lottiejs.togglePause = animationManager.togglePause, lottiejs.setSpeed = animationManager.setSpeed, lottiejs.setDirection = animationManager.setDirection, lottiejs.stop = animationManager.stop, lottiejs.searchAnimations = searchAnimations, lottiejs.registerAnimation = animationManager.registerAnimation, lottiejs.loadAnimation = loadAnimation, lottiejs.setSubframeRendering = setSubframeRendering, lottiejs.resize = animationManager.resize, lottiejs.goToAndStop = animationManager.goToAndStop, lottiejs.destroy = animationManager.destroy, lottiejs.setQuality = setQuality, lottiejs.inBrowser = inBrowser, lottiejs.installPlugin = installPlugin, lottiejs.freeze = animationManager.freeze, lottiejs.unfreeze = animationManager.unfreeze, lottiejs.getRegisteredAnimations = animationManager.getRegisteredAnimations, lottiejs.__getFactory = getFactory, lottiejs.version = "5.5.8";
        var standalone = "__[STANDALONE]__",
            animationData = "__[ANIMATIONDATA]__",
            renderer = "";
        if (standalone) {
            var scripts = document.getElementsByTagName("script"),
                index = scripts.length - 1,
                myScript = scripts[index] || {
                    src: ""
                },
                queryString = myScript.src.replace(/^[^\?]+\??/, "");
            renderer = getQueryVariable("renderer")
        }
        var readyStateCheckInterval = setInterval(checkReady, 100);
        return lottiejs
    }, "function" == typeof define && define.amd ? define(function() {
        return b(a)
    }) : "object" == typeof module && module.exports ? module.exports = b(a) : (a.lottie = b(a), a.bodymovin = a.lottie)),
    function(t, e) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.Swiper = e()
    }(this, function() {
        "use strict";
        var m = "undefined" == typeof document ? {
                body: {},
                addEventListener: function() {},
                removeEventListener: function() {},
                activeElement: {
                    blur: function() {},
                    nodeName: ""
                },
                querySelector: function() {
                    return null
                },
                querySelectorAll: function() {
                    return []
                },
                getElementById: function() {
                    return null
                },
                createEvent: function() {
                    return {
                        initEvent: function() {}
                    }
                },
                createElement: function() {
                    return {
                        children: [],
                        childNodes: [],
                        style: {},
                        setAttribute: function() {},
                        getElementsByTagName: function() {
                            return []
                        }
                    }
                },
                location: {
                    hash: ""
                }
            } : document,
            G = "undefined" == typeof window ? {
                document: m,
                navigator: {
                    userAgent: ""
                },
                location: {},
                history: {},
                CustomEvent: function() {
                    return this
                },
                addEventListener: function() {},
                removeEventListener: function() {},
                getComputedStyle: function() {
                    return {
                        getPropertyValue: function() {
                            return ""
                        }
                    }
                },
                Image: function() {},
                Date: function() {},
                screen: {},
                setTimeout: function() {},
                clearTimeout: function() {}
            } : window,
            l = function(t) {
                for (var e = 0; e < t.length; e += 1) this[e] = t[e];
                return this.length = t.length, this
            };
        function D(t, e) {
            var i = [],
                s = 0;
            if (t && !e && t instanceof l) return t;
            if (t)
                if ("string" == typeof t) {
                    var r, a, n = t.trim();
                    if (0 <= n.indexOf("<") && 0 <= n.indexOf(">")) {
                        var o = "div";
                        for (0 === n.indexOf("<li") && (o = "ul"), 0 === n.indexOf("<tr") && (o = "tbody"), 0 !== n.indexOf("<td") && 0 !== n.indexOf("<th") || (o = "tr"), 0 === n.indexOf("<tbody") && (o = "table"), 0 === n.indexOf("<option") && (o = "select"), (a = m.createElement(o)).innerHTML = n, s = 0; s < a.childNodes.length; s += 1) i.push(a.childNodes[s])
                    } else
                        for (r = e || "#" !== t[0] || t.match(/[ .<>:~]/) ? (e || m).querySelectorAll(t.trim()) : [m.getElementById(t.trim().split("#")[1])], s = 0; s < r.length; s += 1) r[s] && i.push(r[s])
                } else if (t.nodeType || t === G || t === m) i.push(t);
            else if (0 < t.length && t[0].nodeType)
                for (s = 0; s < t.length; s += 1) i.push(t[s]);
            return new l(i)
        }
        function a(t) {
            for (var e = [], i = 0; i < t.length; i += 1) - 1 === e.indexOf(t[i]) && e.push(t[i]);
            return e
        }
        D.fn = l.prototype, D.Class = l, D.Dom7 = l;
        var e = {
            addClass: function(t) {
                if (void 0 === t) return this;
                for (var e = t.split(" "), i = 0; i < e.length; i += 1)
                    for (var s = 0; s < this.length; s += 1) void 0 !== this[s] && void 0 !== this[s].classList && this[s].classList.add(e[i]);
                return this
            },
            removeClass: function(t) {
                for (var e = t.split(" "), i = 0; i < e.length; i += 1)
                    for (var s = 0; s < this.length; s += 1) void 0 !== this[s] && void 0 !== this[s].classList && this[s].classList.remove(e[i]);
                return this
            },
            hasClass: function(t) {
                return !!this[0] && this[0].classList.contains(t)
            },
            toggleClass: function(t) {
                for (var e = t.split(" "), i = 0; i < e.length; i += 1)
                    for (var s = 0; s < this.length; s += 1) void 0 !== this[s] && void 0 !== this[s].classList && this[s].classList.toggle(e[i]);
                return this
            },
            attr: function(t, e) {
                var i = arguments;
                if (1 === arguments.length && "string" == typeof t) return this[0] ? this[0].getAttribute(t) : void 0;
                for (var s = 0; s < this.length; s += 1)
                    if (2 === i.length) this[s].setAttribute(t, e);
                    else
                        for (var r in t) this[s][r] = t[r], this[s].setAttribute(r, t[r]);
                return this
            },
            removeAttr: function(t) {
                for (var e = 0; e < this.length; e += 1) this[e].removeAttribute(t);
                return this
            },
            data: function(t, e) {
                var i;
                if (void 0 !== e) {
                    for (var s = 0; s < this.length; s += 1)(i = this[s]).dom7ElementDataStorage || (i.dom7ElementDataStorage = {}), i.dom7ElementDataStorage[t] = e;
                    return this
                }
                if (i = this[0]) return i.dom7ElementDataStorage && t in i.dom7ElementDataStorage ? i.dom7ElementDataStorage[t] : i.getAttribute("data-" + t) || void 0
            },
            transform: function(t) {
                for (var e = 0; e < this.length; e += 1) {
                    var i = this[e].style;
                    i.webkitTransform = t, i.transform = t
                }
                return this
            },
            transition: function(t) {
                "string" != typeof t && (t += "ms");
                for (var e = 0; e < this.length; e += 1) {
                    var i = this[e].style;
                    i.webkitTransitionDuration = t, i.transitionDuration = t
                }
                return this
            },
            on: function() {
                for (var t, e = [], i = arguments.length; i--;) e[i] = arguments[i];
                var s = e[0],
                    a = e[1],
                    n = e[2],
                    r = e[3];
                function o(t) {
                    var e = t.target;
                    if (e) {
                        var i = t.target.dom7EventData || [];
                        if (i.indexOf(t) < 0 && i.unshift(t), D(e).is(a)) n.apply(e, i);
                        else
                            for (var s = D(e).parents(), r = 0; r < s.length; r += 1) D(s[r]).is(a) && n.apply(s[r], i)
                    }
                }
                function l(t) {
                    var e = t && t.target && t.target.dom7EventData || [];
                    e.indexOf(t) < 0 && e.unshift(t), n.apply(this, e)
                }
                "function" == typeof e[1] && (s = (t = e)[0], n = t[1], r = t[2], a = void 0), r || (r = !1);
                for (var h, p = s.split(" "), d = 0; d < this.length; d += 1) {
                    var c = this[d];
                    if (a)
                        for (h = 0; h < p.length; h += 1) {
                            var f = p[h];
                            c.dom7LiveListeners || (c.dom7LiveListeners = {}), c.dom7LiveListeners[f] || (c.dom7LiveListeners[f] = []), c.dom7LiveListeners[f].push({
                                listener: n,
                                proxyListener: o
                            }), c.addEventListener(f, o, r)
                        } else
                            for (h = 0; h < p.length; h += 1) {
                                var u = p[h];
                                c.dom7Listeners || (c.dom7Listeners = {}), c.dom7Listeners[u] || (c.dom7Listeners[u] = []), c.dom7Listeners[u].push({
                                    listener: n,
                                    proxyListener: l
                                }), c.addEventListener(u, l, r)
                            }
                }
                return this
            },
            off: function() {
                for (var t, e = [], i = arguments.length; i--;) e[i] = arguments[i];
                var s = e[0],
                    r = e[1],
                    a = e[2],
                    n = e[3];
                "function" == typeof e[1] && (s = (t = e)[0], a = t[1], n = t[2], r = void 0), n || (n = !1);
                for (var o = s.split(" "), l = 0; l < o.length; l += 1)
                    for (var h = o[l], p = 0; p < this.length; p += 1) {
                        var d = this[p],
                            c = void 0;
                        if (!r && d.dom7Listeners ? c = d.dom7Listeners[h] : r && d.dom7LiveListeners && (c = d.dom7LiveListeners[h]), c && c.length)
                            for (var f = c.length - 1; 0 <= f; f -= 1) {
                                var u = c[f];
                                a && u.listener === a ? (d.removeEventListener(h, u.proxyListener, n), c.splice(f, 1)) : a || (d.removeEventListener(h, u.proxyListener, n), c.splice(f, 1))
                            }
                    }
                return this
            },
            trigger: function() {
                for (var t = [], e = arguments.length; e--;) t[e] = arguments[e];
                for (var i = t[0].split(" "), s = t[1], r = 0; r < i.length; r += 1)
                    for (var a = i[r], n = 0; n < this.length; n += 1) {
                        var o = this[n],
                            l = void 0;
                        try {
                            l = new G.CustomEvent(a, {
                                detail: s,
                                bubbles: !0,
                                cancelable: !0
                            })
                        } catch (t) {
                            (l = m.createEvent("Event")).initEvent(a, !0, !0), l.detail = s
                        }
                        o.dom7EventData = t.filter(function(t, e) {
                            return 0 < e
                        }), o.dispatchEvent(l), o.dom7EventData = [], delete o.dom7EventData
                    }
                return this
            },
            transitionEnd: function(e) {
                var i, s = ["webkitTransitionEnd", "transitionend"],
                    r = this;
                function a(t) {
                    if (t.target === this)
                        for (e.call(this, t), i = 0; i < s.length; i += 1) r.off(s[i], a)
                }
                if (e)
                    for (i = 0; i < s.length; i += 1) r.on(s[i], a);
                return this
            },
            outerWidth: function(t) {
                if (0 < this.length) {
                    if (t) {
                        var e = this.styles();
                        return this[0].offsetWidth + parseFloat(e.getPropertyValue("margin-right")) + parseFloat(e.getPropertyValue("margin-left"))
                    }
                    return this[0].offsetWidth
                }
                return null
            },
            outerHeight: function(t) {
                if (0 < this.length) {
                    if (t) {
                        var e = this.styles();
                        return this[0].offsetHeight + parseFloat(e.getPropertyValue("margin-top")) + parseFloat(e.getPropertyValue("margin-bottom"))
                    }
                    return this[0].offsetHeight
                }
                return null
            },
            offset: function() {
                if (0 < this.length) {
                    var t = this[0],
                        e = t.getBoundingClientRect(),
                        i = m.body,
                        s = t.clientTop || i.clientTop || 0,
                        r = t.clientLeft || i.clientLeft || 0,
                        a = t === G ? G.scrollY : t.scrollTop,
                        n = t === G ? G.scrollX : t.scrollLeft;
                    return {
                        top: e.top + a - s,
                        left: e.left + n - r
                    }
                }
                return null
            },
            css: function(t, e) {
                var i;
                if (1 === arguments.length) {
                    if ("string" != typeof t) {
                        for (i = 0; i < this.length; i += 1)
                            for (var s in t) this[i].style[s] = t[s];
                        return this
                    }
                    if (this[0]) return G.getComputedStyle(this[0], null).getPropertyValue(t)
                }
                if (2 !== arguments.length || "string" != typeof t) return this;
                for (i = 0; i < this.length; i += 1) this[i].style[t] = e;
                return this
            },
            each: function(t) {
                if (!t) return this;
                for (var e = 0; e < this.length; e += 1)
                    if (!1 === t.call(this[e], e, this[e])) return this;
                return this
            },
            html: function(t) {
                if (void 0 === t) return this[0] ? this[0].innerHTML : void 0;
                for (var e = 0; e < this.length; e += 1) this[e].innerHTML = t;
                return this
            },
            text: function(t) {
                if (void 0 === t) return this[0] ? this[0].textContent.trim() : null;
                for (var e = 0; e < this.length; e += 1) this[e].textContent = t;
                return this
            },
            is: function(t) {
                var e, i, s = this[0];
                if (!s || void 0 === t) return !1;
                if ("string" == typeof t) {
                    if (s.matches) return s.matches(t);
                    if (s.webkitMatchesSelector) return s.webkitMatchesSelector(t);
                    if (s.msMatchesSelector) return s.msMatchesSelector(t);
                    for (e = D(t), i = 0; i < e.length; i += 1)
                        if (e[i] === s) return !0;
                    return !1
                }
                if (t === m) return s === m;
                if (t === G) return s === G;
                if (t.nodeType || t instanceof l) {
                    for (e = t.nodeType ? [t] : t, i = 0; i < e.length; i += 1)
                        if (e[i] === s) return !0;
                    return !1
                }
                return !1
            },
            index: function() {
                var t, e = this[0];
                if (e) {
                    for (t = 0; null !== (e = e.previousSibling);) 1 === e.nodeType && (t += 1);
                    return t
                }
            },
            eq: function(t) {
                if (void 0 === t) return this;
                var e, i = this.length;
                return new l(i - 1 < t ? [] : t < 0 ? (e = i + t) < 0 ? [] : [this[e]] : [this[t]])
            },
            append: function() {
                for (var t, e = [], i = arguments.length; i--;) e[i] = arguments[i];
                for (var s = 0; s < e.length; s += 1) {
                    t = e[s];
                    for (var r = 0; r < this.length; r += 1)
                        if ("string" == typeof t) {
                            var a = m.createElement("div");
                            for (a.innerHTML = t; a.firstChild;) this[r].appendChild(a.firstChild)
                        } else if (t instanceof l)
                        for (var n = 0; n < t.length; n += 1) this[r].appendChild(t[n]);
                    else this[r].appendChild(t)
                }
                return this
            },
            prepend: function(t) {
                var e, i;
                for (e = 0; e < this.length; e += 1)
                    if ("string" == typeof t) {
                        var s = m.createElement("div");
                        for (s.innerHTML = t, i = s.childNodes.length - 1; 0 <= i; i -= 1) this[e].insertBefore(s.childNodes[i], this[e].childNodes[0])
                    } else if (t instanceof l)
                    for (i = 0; i < t.length; i += 1) this[e].insertBefore(t[i], this[e].childNodes[0]);
                else this[e].insertBefore(t, this[e].childNodes[0]);
                return this
            },
            next: function(t) {
                return 0 < this.length ? t ? this[0].nextElementSibling && D(this[0].nextElementSibling).is(t) ? new l([this[0].nextElementSibling]) : new l([]) : this[0].nextElementSibling ? new l([this[0].nextElementSibling]) : new l([]) : new l([])
            },
            nextAll: function(t) {
                var e = [],
                    i = this[0];
                if (!i) return new l([]);
                for (; i.nextElementSibling;) {
                    var s = i.nextElementSibling;
                    t ? D(s).is(t) && e.push(s) : e.push(s), i = s
                }
                return new l(e)
            },
            prev: function(t) {
                if (0 < this.length) {
                    var e = this[0];
                    return t ? e.previousElementSibling && D(e.previousElementSibling).is(t) ? new l([e.previousElementSibling]) : new l([]) : e.previousElementSibling ? new l([e.previousElementSibling]) : new l([])
                }
                return new l([])
            },
            prevAll: function(t) {
                var e = [],
                    i = this[0];
                if (!i) return new l([]);
                for (; i.previousElementSibling;) {
                    var s = i.previousElementSibling;
                    t ? D(s).is(t) && e.push(s) : e.push(s), i = s
                }
                return new l(e)
            },
            parent: function(t) {
                for (var e = [], i = 0; i < this.length; i += 1) null !== this[i].parentNode && (t ? D(this[i].parentNode).is(t) && e.push(this[i].parentNode) : e.push(this[i].parentNode));
                return D(a(e))
            },
            parents: function(t) {
                for (var e = [], i = 0; i < this.length; i += 1)
                    for (var s = this[i].parentNode; s;) t ? D(s).is(t) && e.push(s) : e.push(s), s = s.parentNode;
                return D(a(e))
            },
            closest: function(t) {
                var e = this;
                return void 0 === t ? new l([]) : (e.is(t) || (e = e.parents(t).eq(0)), e)
            },
            find: function(t) {
                for (var e = [], i = 0; i < this.length; i += 1)
                    for (var s = this[i].querySelectorAll(t), r = 0; r < s.length; r += 1) e.push(s[r]);
                return new l(e)
            },
            children: function(t) {
                for (var e = [], i = 0; i < this.length; i += 1)
                    for (var s = this[i].childNodes, r = 0; r < s.length; r += 1) t ? 1 === s[r].nodeType && D(s[r]).is(t) && e.push(s[r]) : 1 === s[r].nodeType && e.push(s[r]);
                return new l(a(e))
            },
            remove: function() {
                for (var t = 0; t < this.length; t += 1) this[t].parentNode && this[t].parentNode.removeChild(this[t]);
                return this
            },
            add: function() {
                for (var t = [], e = arguments.length; e--;) t[e] = arguments[e];
                var i, s;
                for (i = 0; i < t.length; i += 1) {
                    var r = D(t[i]);
                    for (s = 0; s < r.length; s += 1) this[this.length] = r[s], this.length += 1
                }
                return this
            },
            styles: function() {
                return this[0] ? G.getComputedStyle(this[0], null) : {}
            }
        };
        Object.keys(e).forEach(function(t) {
            D.fn[t] = e[t]
        });
        var t, i, s, H = {
                deleteProps: function(t) {
                    var e = t;
                    Object.keys(e).forEach(function(t) {
                        try {
                            e[t] = null
                        } catch (t) {}
                        try {
                            delete e[t]
                        } catch (t) {}
                    })
                },
                nextTick: function(t, e) {
                    return void 0 === e && (e = 0), setTimeout(t, e)
                },
                now: function() {
                    return Date.now()
                },
                getTranslate: function(t, e) {
                    var i, s, r;
                    void 0 === e && (e = "x");
                    var a = G.getComputedStyle(t, null);
                    return G.WebKitCSSMatrix ? (6 < (s = a.transform || a.webkitTransform).split(",").length && (s = s.split(", ").map(function(t) {
                        return t.replace(",", ".")
                    }).join(", ")), r = new G.WebKitCSSMatrix("none" === s ? "" : s)) : i = (r = a.MozTransform || a.OTransform || a.MsTransform || a.msTransform || a.transform || a.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,")).toString().split(","), "x" === e && (s = G.WebKitCSSMatrix ? r.m41 : 16 === i.length ? parseFloat(i[12]) : parseFloat(i[4])), "y" === e && (s = G.WebKitCSSMatrix ? r.m42 : 16 === i.length ? parseFloat(i[13]) : parseFloat(i[5])), s || 0
                },
                parseUrlQuery: function(t) {
                    var e, i, s, r, a = {},
                        n = t || G.location.href;
                    if ("string" == typeof n && n.length)
                        for (r = (i = (n = -1 < n.indexOf("?") ? n.replace(/\S*\?/, "") : "").split("&").filter(function(t) {
                                return "" !== t
                            })).length, e = 0; e < r; e += 1) s = i[e].replace(/#\S+/g, "").split("="), a[decodeURIComponent(s[0])] = void 0 === s[1] ? void 0 : decodeURIComponent(s[1]) || "";
                    return a
                },
                isObject: function(t) {
                    return "object" == typeof t && null !== t && t.constructor && t.constructor === Object
                },
                extend: function() {
                    for (var t = [], e = arguments.length; e--;) t[e] = arguments[e];
                    for (var i = Object(t[0]), s = 1; s < t.length; s += 1) {
                        var r = t[s];
                        if (null != r)
                            for (var a = Object.keys(Object(r)), n = 0, o = a.length; n < o; n += 1) {
                                var l = a[n],
                                    h = Object.getOwnPropertyDescriptor(r, l);
                                void 0 !== h && h.enumerable && (H.isObject(i[l]) && H.isObject(r[l]) ? H.extend(i[l], r[l]) : !H.isObject(i[l]) && H.isObject(r[l]) ? (i[l] = {}, H.extend(i[l], r[l])) : i[l] = r[l])
                            }
                    }
                    return i
                }
            },
            $ = (s = m.createElement("div"), {
                touch: G.Modernizr && !0 === G.Modernizr.touch || !!("ontouchstart" in G || G.DocumentTouch && m instanceof G.DocumentTouch),
                pointerEvents: !!(G.navigator.pointerEnabled || G.PointerEvent || "maxTouchPoints" in G.navigator),
                prefixedPointerEvents: !!G.navigator.msPointerEnabled,
                transition: (i = s.style, "transition" in i || "webkitTransition" in i || "MozTransition" in i),
                transforms3d: G.Modernizr && !0 === G.Modernizr.csstransforms3d || (t = s.style, "webkitPerspective" in t || "MozPerspective" in t || "OPerspective" in t || "MsPerspective" in t || "perspective" in t),
                flexbox: function() {
                    for (var t = s.style, e = "alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "), i = 0; i < e.length; i += 1)
                        if (e[i] in t) return !0;
                    return !1
                }(),
                observer: "MutationObserver" in G || "WebkitMutationObserver" in G,
                passiveListener: function() {
                    var t = !1;
                    try {
                        var e = Object.defineProperty({}, "passive", {
                            get: function() {
                                t = !0
                            }
                        });
                        G.addEventListener("testPassiveListener", null, e)
                    } catch (t) {}
                    return t
                }(),
                gestures: "ongesturestart" in G
            }),
            r = function(t) {
                void 0 === t && (t = {});
                var e = this;
                e.params = t, e.eventsListeners = {}, e.params && e.params.on && Object.keys(e.params.on).forEach(function(t) {
                    e.on(t, e.params.on[t])
                })
            },
            n = {
                components: {
                    configurable: !0
                }
            };
        r.prototype.on = function(t, e, i) {
            var s = this;
            if ("function" != typeof e) return s;
            var r = i ? "unshift" : "push";
            return t.split(" ").forEach(function(t) {
                s.eventsListeners[t] || (s.eventsListeners[t] = []), s.eventsListeners[t][r](e)
            }), s
        }, r.prototype.once = function(s, r, t) {
            var a = this;
            return "function" != typeof r ? a : a.on(s, function t() {
                for (var e = [], i = arguments.length; i--;) e[i] = arguments[i];
                r.apply(a, e), a.off(s, t)
            }, t)
        }, r.prototype.off = function(t, s) {
            var r = this;
            return r.eventsListeners && t.split(" ").forEach(function(i) {
                void 0 === s ? r.eventsListeners[i] = [] : r.eventsListeners[i] && r.eventsListeners[i].length && r.eventsListeners[i].forEach(function(t, e) {
                    t === s && r.eventsListeners[i].splice(e, 1)
                })
            }), r
        }, r.prototype.emit = function() {
            for (var t = [], e = arguments.length; e--;) t[e] = arguments[e];
            var i, s, r, a = this;
            return a.eventsListeners && (r = "string" == typeof t[0] || Array.isArray(t[0]) ? (i = t[0], s = t.slice(1, t.length), a) : (i = t[0].events, s = t[0].data, t[0].context || a), (Array.isArray(i) ? i : i.split(" ")).forEach(function(t) {
                if (a.eventsListeners && a.eventsListeners[t]) {
                    var e = [];
                    a.eventsListeners[t].forEach(function(t) {
                        e.push(t)
                    }), e.forEach(function(t) {
                        t.apply(r, s)
                    })
                }
            })), a
        }, r.prototype.useModulesParams = function(i) {
            var s = this;
            s.modules && Object.keys(s.modules).forEach(function(t) {
                var e = s.modules[t];
                e.params && H.extend(i, e.params)
            })
        }, r.prototype.useModules = function(s) {
            void 0 === s && (s = {});
            var r = this;
            r.modules && Object.keys(r.modules).forEach(function(t) {
                var i = r.modules[t],
                    e = s[t] || {};
                i.instance && Object.keys(i.instance).forEach(function(t) {
                    var e = i.instance[t];
                    r[t] = "function" == typeof e ? e.bind(r) : e
                }), i.on && r.on && Object.keys(i.on).forEach(function(t) {
                    r.on(t, i.on[t])
                }), i.create && i.create.bind(r)(e)
            })
        }, n.components.set = function(t) {
            this.use && this.use(t)
        }, r.installModule = function(e) {
            for (var t = [], i = arguments.length - 1; 0 < i--;) t[i] = arguments[i + 1];
            var s = this;
            s.prototype.modules || (s.prototype.modules = {});
            var r = e.name || Object.keys(s.prototype.modules).length + "_" + H.now();
            return (s.prototype.modules[r] = e).proto && Object.keys(e.proto).forEach(function(t) {
                s.prototype[t] = e.proto[t]
            }), e.static && Object.keys(e.static).forEach(function(t) {
                s[t] = e.static[t]
            }), e.install && e.install.apply(s, t), s
        }, r.use = function(t) {
            for (var e = [], i = arguments.length - 1; 0 < i--;) e[i] = arguments[i + 1];
            var s = this;
            return Array.isArray(t) ? (t.forEach(function(t) {
                return s.installModule(t)
            }), s) : s.installModule.apply(s, [t].concat(e))
        }, Object.defineProperties(r, n);
        var o = {
                updateSize: function() {
                    var t, e, i = this,
                        s = i.$el;
                    t = void 0 !== i.params.width ? i.params.width : s[0].clientWidth, e = void 0 !== i.params.height ? i.params.height : s[0].clientHeight, 0 === t && i.isHorizontal() || 0 === e && i.isVertical() || (t = t - parseInt(s.css("padding-left"), 10) - parseInt(s.css("padding-right"), 10), e = e - parseInt(s.css("padding-top"), 10) - parseInt(s.css("padding-bottom"), 10), H.extend(i, {
                        width: t,
                        height: e,
                        size: i.isHorizontal() ? t : e
                    }))
                },
                updateSlides: function() {
                    var t = this,
                        e = t.params,
                        i = t.$wrapperEl,
                        s = t.size,
                        r = t.rtlTranslate,
                        a = t.wrongRTL,
                        n = t.virtual && e.virtual.enabled,
                        o = n ? t.virtual.slides.length : t.slides.length,
                        l = i.children("." + t.params.slideClass),
                        h = n ? t.virtual.slides.length : l.length,
                        p = [],
                        d = [],
                        c = [],
                        f = e.slidesOffsetBefore;
                    "function" == typeof f && (f = e.slidesOffsetBefore.call(t));
                    var u = e.slidesOffsetAfter;
                    "function" == typeof u && (u = e.slidesOffsetAfter.call(t));
                    var m = t.snapGrid.length,
                        g = t.snapGrid.length,
                        v = e.spaceBetween,
                        y = -f,
                        _ = 0,
                        b = 0;
                    if (void 0 !== s) {
                        var x, T;
                        "string" == typeof v && 0 <= v.indexOf("%") && (v = parseFloat(v.replace("%", "")) / 100 * s), t.virtualSize = -v, r ? l.css({
                            marginLeft: "",
                            marginTop: ""
                        }) : l.css({
                            marginRight: "",
                            marginBottom: ""
                        }), 1 < e.slidesPerColumn && (x = Math.floor(h / e.slidesPerColumn) === h / t.params.slidesPerColumn ? h : Math.ceil(h / e.slidesPerColumn) * e.slidesPerColumn, "auto" !== e.slidesPerView && "row" === e.slidesPerColumnFill && (x = Math.max(x, e.slidesPerView * e.slidesPerColumn)));
                        for (var w, E = e.slidesPerColumn, S = x / E, P = S - (e.slidesPerColumn * S - h), C = 0; C < h; C += 1) {
                            T = 0;
                            var k = l.eq(C);
                            if (1 < e.slidesPerColumn) {
                                var M = void 0,
                                    A = void 0,
                                    D = void 0;
                                "column" === e.slidesPerColumnFill ? (D = C - (A = Math.floor(C / E)) * E, (P < A || A === P && D === E - 1) && E <= (D += 1) && (D = 0, A += 1), M = A + D * x / E, k.css({
                                    "-webkit-box-ordinal-group": M,
                                    "-moz-box-ordinal-group": M,
                                    "-ms-flex-order": M,
                                    "-webkit-order": M,
                                    order: M
                                })) : A = C - (D = Math.floor(C / S)) * S, k.css("margin-" + (t.isHorizontal() ? "top" : "left"), 0 !== D && e.spaceBetween && e.spaceBetween + "px").attr("data-swiper-column", A).attr("data-swiper-row", D)
                            }
                            if ("none" !== k.css("display")) {
                                if ("auto" === e.slidesPerView) {
                                    var I = G.getComputedStyle(k[0], null),
                                        F = k[0].style.transform,
                                        R = k[0].style.webkitTransform;
                                    F && (k[0].style.transform = "none"), R && (k[0].style.webkitTransform = "none"), T = e.roundLengths ? t.isHorizontal() ? k.outerWidth(!0) : k.outerHeight(!0) : t.isHorizontal() ? parseFloat(I.getPropertyValue("width")) + parseFloat(I.getPropertyValue("margin-left")) + parseFloat(I.getPropertyValue("margin-right")) : parseFloat(I.getPropertyValue("height")) + parseFloat(I.getPropertyValue("margin-top")) + parseFloat(I.getPropertyValue("margin-bottom")), F && (k[0].style.transform = F), R && (k[0].style.webkitTransform = R), e.roundLengths && (T = Math.floor(T))
                                } else T = (s - (e.slidesPerView - 1) * v) / e.slidesPerView, e.roundLengths && (T = Math.floor(T)), l[C] && (t.isHorizontal() ? l[C].style.width = T + "px" : l[C].style.height = T + "px");
                                l[C] && (l[C].swiperSlideSize = T), c.push(T), e.centeredSlides ? (y = y + T / 2 + _ / 2 + v, 0 === _ && 0 !== C && (y = y - s / 2 - v), 0 === C && (y = y - s / 2 - v), Math.abs(y) < .001 && (y = 0), e.roundLengths && (y = Math.floor(y)), b % e.slidesPerGroup == 0 && p.push(y), d.push(y)) : (e.roundLengths && (y = Math.floor(y)), b % e.slidesPerGroup == 0 && p.push(y), d.push(y), y = y + T + v), t.virtualSize += T + v, _ = T, b += 1
                            }
                        }
                        if (t.virtualSize = Math.max(t.virtualSize, s) + u, r && a && ("slide" === e.effect || "coverflow" === e.effect) && i.css({
                                width: t.virtualSize + e.spaceBetween + "px"
                            }), $.flexbox && !e.setWrapperSize || (t.isHorizontal() ? i.css({
                                width: t.virtualSize + e.spaceBetween + "px"
                            }) : i.css({
                                height: t.virtualSize + e.spaceBetween + "px"
                            })), 1 < e.slidesPerColumn && (t.virtualSize = (T + e.spaceBetween) * x, t.virtualSize = Math.ceil(t.virtualSize / e.slidesPerColumn) - e.spaceBetween, t.isHorizontal() ? i.css({
                                width: t.virtualSize + e.spaceBetween + "px"
                            }) : i.css({
                                height: t.virtualSize + e.spaceBetween + "px"
                            }), e.centeredSlides)) {
                            w = [];
                            for (var O = 0; O < p.length; O += 1) {
                                var z = p[O];
                                e.roundLengths && (z = Math.floor(z)), p[O] < t.virtualSize + p[0] && w.push(z)
                            }
                            p = w
                        }
                        if (!e.centeredSlides) {
                            w = [];
                            for (var L = 0; L < p.length; L += 1) {
                                var B = p[L];
                                e.roundLengths && (B = Math.floor(B)), p[L] <= t.virtualSize - s && w.push(B)
                            }
                            p = w, 1 < Math.floor(t.virtualSize - s) - Math.floor(p[p.length - 1]) && p.push(t.virtualSize - s)
                        }
                        if (0 === p.length && (p = [0]), 0 !== e.spaceBetween && (t.isHorizontal() ? r ? l.css({
                                marginLeft: v + "px"
                            }) : l.css({
                                marginRight: v + "px"
                            }) : l.css({
                                marginBottom: v + "px"
                            })), e.centerInsufficientSlides) {
                            var V = 0;
                            if (c.forEach(function(t) {
                                    V += t + (e.spaceBetween ? e.spaceBetween : 0)
                                }), (V -= e.spaceBetween) < s) {
                                var N = (s - V) / 2;
                                p.forEach(function(t, e) {
                                    p[e] = t - N
                                }), d.forEach(function(t, e) {
                                    d[e] = t + N
                                })
                            }
                        }
                        H.extend(t, {
                            slides: l,
                            snapGrid: p,
                            slidesGrid: d,
                            slidesSizesGrid: c
                        }), h !== o && t.emit("slidesLengthChange"), p.length !== m && (t.params.watchOverflow && t.checkOverflow(), t.emit("snapGridLengthChange")), d.length !== g && t.emit("slidesGridLengthChange"), (e.watchSlidesProgress || e.watchSlidesVisibility) && t.updateSlidesOffset()
                    }
                },
                updateAutoHeight: function(t) {
                    var e, i = this,
                        s = [],
                        r = 0;
                    if ("number" == typeof t ? i.setTransition(t) : !0 === t && i.setTransition(i.params.speed), "auto" !== i.params.slidesPerView && 1 < i.params.slidesPerView)
                        for (e = 0; e < Math.ceil(i.params.slidesPerView); e += 1) {
                            var a = i.activeIndex + e;
                            if (a > i.slides.length) break;
                            s.push(i.slides.eq(a)[0])
                        } else s.push(i.slides.eq(i.activeIndex)[0]);
                    for (e = 0; e < s.length; e += 1)
                        if (void 0 !== s[e]) {
                            var n = s[e].offsetHeight;
                            r = r < n ? n : r
                        }
                    r && i.$wrapperEl.css("height", r + "px")
                },
                updateSlidesOffset: function() {
                    for (var t = this.slides, e = 0; e < t.length; e += 1) t[e].swiperSlideOffset = this.isHorizontal() ? t[e].offsetLeft : t[e].offsetTop
                },
                updateSlidesProgress: function(t) {
                    void 0 === t && (t = this && this.translate || 0);
                    var e = this,
                        i = e.params,
                        s = e.slides,
                        r = e.rtlTranslate;
                    if (0 !== s.length) {
                        void 0 === s[0].swiperSlideOffset && e.updateSlidesOffset();
                        var a = -t;
                        r && (a = t), s.removeClass(i.slideVisibleClass), e.visibleSlidesIndexes = [], e.visibleSlides = [];
                        for (var n = 0; n < s.length; n += 1) {
                            var o = s[n],
                                l = (a + (i.centeredSlides ? e.minTranslate() : 0) - o.swiperSlideOffset) / (o.swiperSlideSize + i.spaceBetween);
                            if (i.watchSlidesVisibility) {
                                var h = -(a - o.swiperSlideOffset),
                                    p = h + e.slidesSizesGrid[n];
                                (0 <= h && h < e.size || 0 < p && p <= e.size || h <= 0 && p >= e.size) && (e.visibleSlides.push(o), e.visibleSlidesIndexes.push(n), s.eq(n).addClass(i.slideVisibleClass))
                            }
                            o.progress = r ? -l : l
                        }
                        e.visibleSlides = D(e.visibleSlides)
                    }
                },
                updateProgress: function(t) {
                    void 0 === t && (t = this && this.translate || 0);
                    var e = this,
                        i = e.params,
                        s = e.maxTranslate() - e.minTranslate(),
                        r = e.progress,
                        a = e.isBeginning,
                        n = e.isEnd,
                        o = a,
                        l = n;
                    n = 0 === s ? a = !(r = 0) : (a = (r = (t - e.minTranslate()) / s) <= 0, 1 <= r), H.extend(e, {
                        progress: r,
                        isBeginning: a,
                        isEnd: n
                    }), (i.watchSlidesProgress || i.watchSlidesVisibility) && e.updateSlidesProgress(t), a && !o && e.emit("reachBeginning toEdge"), n && !l && e.emit("reachEnd toEdge"), (o && !a || l && !n) && e.emit("fromEdge"), e.emit("progress", r)
                },
                updateSlidesClasses: function() {
                    var t, e = this,
                        i = e.slides,
                        s = e.params,
                        r = e.$wrapperEl,
                        a = e.activeIndex,
                        n = e.realIndex,
                        o = e.virtual && s.virtual.enabled;
                    i.removeClass(s.slideActiveClass + " " + s.slideNextClass + " " + s.slidePrevClass + " " + s.slideDuplicateActiveClass + " " + s.slideDuplicateNextClass + " " + s.slideDuplicatePrevClass), (t = o ? e.$wrapperEl.find("." + s.slideClass + '[data-swiper-slide-index="' + a + '"]') : i.eq(a)).addClass(s.slideActiveClass), s.loop && (t.hasClass(s.slideDuplicateClass) ? r.children("." + s.slideClass + ":not(." + s.slideDuplicateClass + ')[data-swiper-slide-index="' + n + '"]').addClass(s.slideDuplicateActiveClass) : r.children("." + s.slideClass + "." + s.slideDuplicateClass + '[data-swiper-slide-index="' + n + '"]').addClass(s.slideDuplicateActiveClass));
                    var l = t.nextAll("." + s.slideClass).eq(0).addClass(s.slideNextClass);
                    s.loop && 0 === l.length && (l = i.eq(0)).addClass(s.slideNextClass);
                    var h = t.prevAll("." + s.slideClass).eq(0).addClass(s.slidePrevClass);
                    s.loop && 0 === h.length && (h = i.eq(-1)).addClass(s.slidePrevClass), s.loop && (l.hasClass(s.slideDuplicateClass) ? r.children("." + s.slideClass + ":not(." + s.slideDuplicateClass + ')[data-swiper-slide-index="' + l.attr("data-swiper-slide-index") + '"]').addClass(s.slideDuplicateNextClass) : r.children("." + s.slideClass + "." + s.slideDuplicateClass + '[data-swiper-slide-index="' + l.attr("data-swiper-slide-index") + '"]').addClass(s.slideDuplicateNextClass), h.hasClass(s.slideDuplicateClass) ? r.children("." + s.slideClass + ":not(." + s.slideDuplicateClass + ')[data-swiper-slide-index="' + h.attr("data-swiper-slide-index") + '"]').addClass(s.slideDuplicatePrevClass) : r.children("." + s.slideClass + "." + s.slideDuplicateClass + '[data-swiper-slide-index="' + h.attr("data-swiper-slide-index") + '"]').addClass(s.slideDuplicatePrevClass))
                },
                updateActiveIndex: function(t) {
                    var e, i = this,
                        s = i.rtlTranslate ? i.translate : -i.translate,
                        r = i.slidesGrid,
                        a = i.snapGrid,
                        n = i.params,
                        o = i.activeIndex,
                        l = i.realIndex,
                        h = i.snapIndex,
                        p = t;
                    if (void 0 === p) {
                        for (var d = 0; d < r.length; d += 1) void 0 !== r[d + 1] ? s >= r[d] && s < r[d + 1] - (r[d + 1] - r[d]) / 2 ? p = d : s >= r[d] && s < r[d + 1] && (p = d + 1) : s >= r[d] && (p = d);
                        n.normalizeSlideIndex && (p < 0 || void 0 === p) && (p = 0)
                    }
                    if ((e = 0 <= a.indexOf(s) ? a.indexOf(s) : Math.floor(p / n.slidesPerGroup)) >= a.length && (e = a.length - 1), p !== o) {
                        var c = parseInt(i.slides.eq(p).attr("data-swiper-slide-index") || p, 10);
                        H.extend(i, {
                            snapIndex: e,
                            realIndex: c,
                            previousIndex: o,
                            activeIndex: p
                        }), i.emit("activeIndexChange"), i.emit("snapIndexChange"), l !== c && i.emit("realIndexChange"), i.emit("slideChange")
                    } else e !== h && (i.snapIndex = e, i.emit("snapIndexChange"))
                },
                updateClickedSlide: function(t) {
                    var e = this,
                        i = e.params,
                        s = D(t.target).closest("." + i.slideClass)[0],
                        r = !1;
                    if (s)
                        for (var a = 0; a < e.slides.length; a += 1) e.slides[a] === s && (r = !0);
                    if (!s || !r) return e.clickedSlide = void 0, void(e.clickedIndex = void 0);
                    e.clickedSlide = s, e.virtual && e.params.virtual.enabled ? e.clickedIndex = parseInt(D(s).attr("data-swiper-slide-index"), 10) : e.clickedIndex = D(s).index(), i.slideToClickedSlide && void 0 !== e.clickedIndex && e.clickedIndex !== e.activeIndex && e.slideToClickedSlide()
                }
            },
            h = {
                getTranslate: function(t) {
                    void 0 === t && (t = this.isHorizontal() ? "x" : "y");
                    var e = this.params,
                        i = this.rtlTranslate,
                        s = this.translate,
                        r = this.$wrapperEl;
                    if (e.virtualTranslate) return i ? -s : s;
                    var a = H.getTranslate(r[0], t);
                    return i && (a = -a), a || 0
                },
                setTranslate: function(t, e) {
                    var i = this,
                        s = i.rtlTranslate,
                        r = i.params,
                        a = i.$wrapperEl,
                        n = i.progress,
                        o = 0,
                        l = 0;
                    i.isHorizontal() ? o = s ? -t : t : l = t, r.roundLengths && (o = Math.floor(o), l = Math.floor(l)), r.virtualTranslate || ($.transforms3d ? a.transform("translate3d(" + o + "px, " + l + "px, 0px)") : a.transform("translate(" + o + "px, " + l + "px)")), i.previousTranslate = i.translate, i.translate = i.isHorizontal() ? o : l;
                    var h = i.maxTranslate() - i.minTranslate();
                    (0 === h ? 0 : (t - i.minTranslate()) / h) !== n && i.updateProgress(t), i.emit("setTranslate", i.translate, e)
                },
                minTranslate: function() {
                    return -this.snapGrid[0]
                },
                maxTranslate: function() {
                    return -this.snapGrid[this.snapGrid.length - 1]
                }
            },
            p = {
                slideTo: function(t, e, i, s) {
                    void 0 === t && (t = 0), void 0 === e && (e = this.params.speed), void 0 === i && (i = !0);
                    var r = this,
                        a = t;
                    a < 0 && (a = 0);
                    var n = r.params,
                        o = r.snapGrid,
                        l = r.slidesGrid,
                        h = r.previousIndex,
                        p = r.activeIndex,
                        d = r.rtlTranslate;
                    if (r.animating && n.preventInteractionOnTransition) return !1;
                    var c = Math.floor(a / n.slidesPerGroup);
                    c >= o.length && (c = o.length - 1), (p || n.initialSlide || 0) === (h || 0) && i && r.emit("beforeSlideChangeStart");
                    var f, u = -o[c];
                    if (r.updateProgress(u), n.normalizeSlideIndex)
                        for (var m = 0; m < l.length; m += 1) - Math.floor(100 * u) >= Math.floor(100 * l[m]) && (a = m);
                    if (r.initialized && a !== p) {
                        if (!r.allowSlideNext && u < r.translate && u < r.minTranslate()) return !1;
                        if (!r.allowSlidePrev && u > r.translate && u > r.maxTranslate() && (p || 0) !== a) return !1
                    }
                    return f = p < a ? "next" : a < p ? "prev" : "reset", d && -u === r.translate || !d && u === r.translate ? (r.updateActiveIndex(a), n.autoHeight && r.updateAutoHeight(), r.updateSlidesClasses(), "slide" !== n.effect && r.setTranslate(u), "reset" !== f && (r.transitionStart(i, f), r.transitionEnd(i, f)), !1) : (0 !== e && $.transition ? (r.setTransition(e), r.setTranslate(u), r.updateActiveIndex(a), r.updateSlidesClasses(), r.emit("beforeTransitionStart", e, s), r.transitionStart(i, f), r.animating || (r.animating = !0, r.onSlideToWrapperTransitionEnd || (r.onSlideToWrapperTransitionEnd = function(t) {
                        r && !r.destroyed && t.target === this && (r.$wrapperEl[0].removeEventListener("transitionend", r.onSlideToWrapperTransitionEnd), r.$wrapperEl[0].removeEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd), r.onSlideToWrapperTransitionEnd = null, delete r.onSlideToWrapperTransitionEnd, r.transitionEnd(i, f))
                    }), r.$wrapperEl[0].addEventListener("transitionend", r.onSlideToWrapperTransitionEnd), r.$wrapperEl[0].addEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd))) : (r.setTransition(0), r.setTranslate(u), r.updateActiveIndex(a), r.updateSlidesClasses(), r.emit("beforeTransitionStart", e, s), r.transitionStart(i, f), r.transitionEnd(i, f)), !0)
                },
                slideToLoop: function(t, e, i, s) {
                    void 0 === t && (t = 0), void 0 === e && (e = this.params.speed), void 0 === i && (i = !0);
                    var r = t;
                    return this.params.loop && (r += this.loopedSlides), this.slideTo(r, e, i, s)
                },
                slideNext: function(t, e, i) {
                    void 0 === t && (t = this.params.speed), void 0 === e && (e = !0);
                    var s = this.params,
                        r = this.animating;
                    return s.loop ? !r && (this.loopFix(), this._clientLeft = this.$wrapperEl[0].clientLeft, this.slideTo(this.activeIndex + s.slidesPerGroup, t, e, i)) : this.slideTo(this.activeIndex + s.slidesPerGroup, t, e, i)
                },
                slidePrev: function(t, e, i) {
                    void 0 === t && (t = this.params.speed), void 0 === e && (e = !0);
                    var s = this,
                        r = s.params,
                        a = s.animating,
                        n = s.snapGrid,
                        o = s.slidesGrid,
                        l = s.rtlTranslate;
                    if (r.loop) {
                        if (a) return !1;
                        s.loopFix(), s._clientLeft = s.$wrapperEl[0].clientLeft
                    }
                    function h(t) {
                        return t < 0 ? -Math.floor(Math.abs(t)) : Math.floor(t)
                    }
                    var p, d = h(l ? s.translate : -s.translate),
                        c = n.map(function(t) {
                            return h(t)
                        }),
                        f = (o.map(function(t) {
                            return h(t)
                        }), n[c.indexOf(d)], n[c.indexOf(d) - 1]);
                    return void 0 !== f && (p = o.indexOf(f)) < 0 && (p = s.activeIndex - 1), s.slideTo(p, t, e, i)
                },
                slideReset: function(t, e, i) {
                    return void 0 === t && (t = this.params.speed), void 0 === e && (e = !0), this.slideTo(this.activeIndex, t, e, i)
                },
                slideToClosest: function(t, e, i) {
                    void 0 === t && (t = this.params.speed), void 0 === e && (e = !0);
                    var s = this,
                        r = s.activeIndex,
                        a = Math.floor(r / s.params.slidesPerGroup);
                    if (a < s.snapGrid.length - 1) {
                        var n = s.rtlTranslate ? s.translate : -s.translate,
                            o = s.snapGrid[a];
                        (s.snapGrid[a + 1] - o) / 2 < n - o && (r = s.params.slidesPerGroup)
                    }
                    return s.slideTo(r, t, e, i)
                },
                slideToClickedSlide: function() {
                    var t, e = this,
                        i = e.params,
                        s = e.$wrapperEl,
                        r = "auto" === i.slidesPerView ? e.slidesPerViewDynamic() : i.slidesPerView,
                        a = e.clickedIndex;
                    if (i.loop) {
                        if (e.animating) return;
                        t = parseInt(D(e.clickedSlide).attr("data-swiper-slide-index"), 10), i.centeredSlides ? a < e.loopedSlides - r / 2 || a > e.slides.length - e.loopedSlides + r / 2 ? (e.loopFix(), a = s.children("." + i.slideClass + '[data-swiper-slide-index="' + t + '"]:not(.' + i.slideDuplicateClass + ")").eq(0).index(), H.nextTick(function() {
                            e.slideTo(a)
                        })) : e.slideTo(a) : a > e.slides.length - r ? (e.loopFix(), a = s.children("." + i.slideClass + '[data-swiper-slide-index="' + t + '"]:not(.' + i.slideDuplicateClass + ")").eq(0).index(), H.nextTick(function() {
                            e.slideTo(a)
                        })) : e.slideTo(a)
                    } else e.slideTo(a)
                }
            },
            d = {
                loopCreate: function() {
                    var s = this,
                        t = s.params,
                        e = s.$wrapperEl;
                    e.children("." + t.slideClass + "." + t.slideDuplicateClass).remove();
                    var r = e.children("." + t.slideClass);
                    if (t.loopFillGroupWithBlank) {
                        var i = t.slidesPerGroup - r.length % t.slidesPerGroup;
                        if (i !== t.slidesPerGroup) {
                            for (var a = 0; a < i; a += 1) {
                                var n = D(m.createElement("div")).addClass(t.slideClass + " " + t.slideBlankClass);
                                e.append(n)
                            }
                            r = e.children("." + t.slideClass)
                        }
                    }
                    "auto" !== t.slidesPerView || t.loopedSlides || (t.loopedSlides = r.length), s.loopedSlides = parseInt(t.loopedSlides || t.slidesPerView, 10), s.loopedSlides += t.loopAdditionalSlides, s.loopedSlides > r.length && (s.loopedSlides = r.length);
                    var o = [],
                        l = [];
                    r.each(function(t, e) {
                        var i = D(e);
                        t < s.loopedSlides && l.push(e), t < r.length && t >= r.length - s.loopedSlides && o.push(e), i.attr("data-swiper-slide-index", t)
                    });
                    for (var h = 0; h < l.length; h += 1) e.append(D(l[h].cloneNode(!0)).addClass(t.slideDuplicateClass));
                    for (var p = o.length - 1; 0 <= p; p -= 1) e.prepend(D(o[p].cloneNode(!0)).addClass(t.slideDuplicateClass))
                },
                loopFix: function() {
                    var t, e = this,
                        i = e.params,
                        s = e.activeIndex,
                        r = e.slides,
                        a = e.loopedSlides,
                        n = e.allowSlidePrev,
                        o = e.allowSlideNext,
                        l = e.snapGrid,
                        h = e.rtlTranslate;
                    e.allowSlidePrev = !0, e.allowSlideNext = !0;
                    var p = -l[s] - e.getTranslate();
                    s < a ? (t = r.length - 3 * a + s, t += a, e.slideTo(t, 0, !1, !0) && 0 !== p && e.setTranslate((h ? -e.translate : e.translate) - p)) : ("auto" === i.slidesPerView && 2 * a <= s || s >= r.length - a) && (t = -r.length + s + a, t += a, e.slideTo(t, 0, !1, !0) && 0 !== p && e.setTranslate((h ? -e.translate : e.translate) - p)), e.allowSlidePrev = n, e.allowSlideNext = o
                },
                loopDestroy: function() {
                    var t = this.$wrapperEl,
                        e = this.params,
                        i = this.slides;
                    t.children("." + e.slideClass + "." + e.slideDuplicateClass).remove(), i.removeAttr("data-swiper-slide-index")
                }
            },
            c = {
                setGrabCursor: function(t) {
                    if (!($.touch || !this.params.simulateTouch || this.params.watchOverflow && this.isLocked)) {
                        var e = this.el;
                        e.style.cursor = "move", e.style.cursor = t ? "-webkit-grabbing" : "-webkit-grab", e.style.cursor = t ? "-moz-grabbin" : "-moz-grab", e.style.cursor = t ? "grabbing" : "grab"
                    }
                },
                unsetGrabCursor: function() {
                    $.touch || this.params.watchOverflow && this.isLocked || (this.el.style.cursor = "")
                }
            },
            f = {
                appendSlide: function(t) {
                    var e = this.$wrapperEl,
                        i = this.params;
                    if (i.loop && this.loopDestroy(), "object" == typeof t && "length" in t)
                        for (var s = 0; s < t.length; s += 1) t[s] && e.append(t[s]);
                    else e.append(t);
                    i.loop && this.loopCreate(), i.observer && $.observer || this.update()
                },
                prependSlide: function(t) {
                    var e = this.params,
                        i = this.$wrapperEl,
                        s = this.activeIndex;
                    e.loop && this.loopDestroy();
                    var r = s + 1;
                    if ("object" == typeof t && "length" in t) {
                        for (var a = 0; a < t.length; a += 1) t[a] && i.prepend(t[a]);
                        r = s + t.length
                    } else i.prepend(t);
                    e.loop && this.loopCreate(), e.observer && $.observer || this.update(), this.slideTo(r, 0, !1)
                },
                addSlide: function(t, e) {
                    var i = this,
                        s = i.$wrapperEl,
                        r = i.params,
                        a = i.activeIndex;
                    r.loop && (a -= i.loopedSlides, i.loopDestroy(), i.slides = s.children("." + r.slideClass));
                    var n = i.slides.length;
                    if (t <= 0) i.prependSlide(e);
                    else if (n <= t) i.appendSlide(e);
                    else {
                        for (var o = t < a ? a + 1 : a, l = [], h = n - 1; t <= h; h -= 1) {
                            var p = i.slides.eq(h);
                            p.remove(), l.unshift(p)
                        }
                        if ("object" == typeof e && "length" in e) {
                            for (var d = 0; d < e.length; d += 1) e[d] && s.append(e[d]);
                            o = t < a ? a + e.length : a
                        } else s.append(e);
                        for (var c = 0; c < l.length; c += 1) s.append(l[c]);
                        r.loop && i.loopCreate(), r.observer && $.observer || i.update(), r.loop ? i.slideTo(o + i.loopedSlides, 0, !1) : i.slideTo(o, 0, !1)
                    }
                },
                removeSlide: function(t) {
                    var e = this,
                        i = e.params,
                        s = e.$wrapperEl,
                        r = e.activeIndex;
                    i.loop && (r -= e.loopedSlides, e.loopDestroy(), e.slides = s.children("." + i.slideClass));
                    var a, n = r;
                    if ("object" == typeof t && "length" in t) {
                        for (var o = 0; o < t.length; o += 1) a = t[o], e.slides[a] && e.slides.eq(a).remove(), a < n && (n -= 1);
                        n = Math.max(n, 0)
                    } else a = t, e.slides[a] && e.slides.eq(a).remove(), a < n && (n -= 1), n = Math.max(n, 0);
                    i.loop && e.loopCreate(), i.observer && $.observer || e.update(), i.loop ? e.slideTo(n + e.loopedSlides, 0, !1) : e.slideTo(n, 0, !1)
                },
                removeAllSlides: function() {
                    for (var t = [], e = 0; e < this.slides.length; e += 1) t.push(e);
                    this.removeSlide(t)
                }
            },
            u = function() {
                var t = G.navigator.userAgent,
                    e = {
                        ios: !1,
                        android: !1,
                        androidChrome: !1,
                        desktop: !1,
                        windows: !1,
                        iphone: !1,
                        ipod: !1,
                        ipad: !1,
                        cordova: G.cordova || G.phonegap,
                        phonegap: G.cordova || G.phonegap
                    },
                    i = t.match(/(Windows Phone);?[\s\/]+([\d.]+)?/),
                    s = t.match(/(Android);?[\s\/]+([\d.]+)?/),
                    r = t.match(/(iPad).*OS\s([\d_]+)/),
                    a = t.match(/(iPod)(.*OS\s([\d_]+))?/),
                    n = !r && t.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
                if (i && (e.os = "windows", e.osVersion = i[2], e.windows = !0), s && !i && (e.os = "android", e.osVersion = s[2], e.android = !0, e.androidChrome = 0 <= t.toLowerCase().indexOf("chrome")), (r || n || a) && (e.os = "ios", e.ios = !0), n && !a && (e.osVersion = n[2].replace(/_/g, "."), e.iphone = !0), r && (e.osVersion = r[2].replace(/_/g, "."), e.ipad = !0), a && (e.osVersion = a[3] ? a[3].replace(/_/g, ".") : null, e.iphone = !0), e.ios && e.osVersion && 0 <= t.indexOf("Version/") && "10" === e.osVersion.split(".")[0] && (e.osVersion = t.toLowerCase().split("version/")[1].split(" ")[0]), e.desktop = !(e.os || e.android || e.webView), e.webView = (n || r || a) && t.match(/.*AppleWebKit(?!.*Safari)/i), e.os && "ios" === e.os) {
                    var o = e.osVersion.split("."),
                        l = m.querySelector('meta[name="viewport"]');
                    e.minimalUi = !e.webView && (a || n) && (1 * o[0] == 7 ? 1 <= 1 * o[1] : 7 < 1 * o[0]) && l && 0 <= l.getAttribute("content").indexOf("minimal-ui")
                }
                return e.pixelRatio = G.devicePixelRatio || 1, e
            }();
        function g() {
            var t = this,
                e = t.params,
                i = t.el;
            if (!i || 0 !== i.offsetWidth) {
                e.breakpoints && t.setBreakpoint();
                var s = t.allowSlideNext,
                    r = t.allowSlidePrev,
                    a = t.snapGrid;
                if (t.allowSlideNext = !0, t.allowSlidePrev = !0, t.updateSize(), t.updateSlides(), e.freeMode) {
                    var n = Math.min(Math.max(t.translate, t.maxTranslate()), t.minTranslate());
                    t.setTranslate(n), t.updateActiveIndex(), t.updateSlidesClasses(), e.autoHeight && t.updateAutoHeight()
                } else t.updateSlidesClasses(), ("auto" === e.slidesPerView || 1 < e.slidesPerView) && t.isEnd && !t.params.centeredSlides ? t.slideTo(t.slides.length - 1, 0, !1, !0) : t.slideTo(t.activeIndex, 0, !1, !0);
                t.allowSlidePrev = r, t.allowSlideNext = s, t.params.watchOverflow && a !== t.snapGrid && t.checkOverflow()
            }
        }
        var v, y = {
                attachEvents: function() {
                    var t = this,
                        e = t.params,
                        i = t.touchEvents,
                        s = t.el,
                        r = t.wrapperEl;
                    t.onTouchStart = function(t) {
                        var e = this,
                            i = e.touchEventsData,
                            s = e.params,
                            r = e.touches;
                        if (!e.animating || !s.preventInteractionOnTransition) {
                            var a = t;
                            if (a.originalEvent && (a = a.originalEvent), i.isTouchEvent = "touchstart" === a.type, (i.isTouchEvent || !("which" in a) || 3 !== a.which) && !(!i.isTouchEvent && "button" in a && 0 < a.button || i.isTouched && i.isMoved))
                                if (s.noSwiping && D(a.target).closest(s.noSwipingSelector ? s.noSwipingSelector : "." + s.noSwipingClass)[0]) e.allowClick = !0;
                                else if (!s.swipeHandler || D(a).closest(s.swipeHandler)[0]) {
                                r.currentX = "touchstart" === a.type ? a.targetTouches[0].pageX : a.pageX, r.currentY = "touchstart" === a.type ? a.targetTouches[0].pageY : a.pageY;
                                var n = r.currentX,
                                    o = r.currentY,
                                    l = s.edgeSwipeDetection || s.iOSEdgeSwipeDetection,
                                    h = s.edgeSwipeThreshold || s.iOSEdgeSwipeThreshold;
                                if (!l || !(n <= h || n >= G.screen.width - h)) {
                                    if (H.extend(i, {
                                            isTouched: !0,
                                            isMoved: !1,
                                            allowTouchCallbacks: !0,
                                            isScrolling: void 0,
                                            startMoving: void 0
                                        }), r.startX = n, r.startY = o, i.touchStartTime = H.now(), e.allowClick = !0, e.updateSize(), e.swipeDirection = void 0, 0 < s.threshold && (i.allowThresholdMove = !1), "touchstart" !== a.type) {
                                        var p = !0;
                                        D(a.target).is(i.formElements) && (p = !1), m.activeElement && D(m.activeElement).is(i.formElements) && m.activeElement !== a.target && m.activeElement.blur();
                                        var d = p && e.allowTouchMove && s.touchStartPreventDefault;
                                        (s.touchStartForcePreventDefault || d) && a.preventDefault()
                                    }
                                    e.emit("touchStart", a)
                                }
                            }
                        }
                    }.bind(t), t.onTouchMove = function(t) {
                        var e = this,
                            i = e.touchEventsData,
                            s = e.params,
                            r = e.touches,
                            a = e.rtlTranslate,
                            n = t;
                        if (n.originalEvent && (n = n.originalEvent), i.isTouched) {
                            if (!i.isTouchEvent || "mousemove" !== n.type) {
                                var o = "touchmove" === n.type ? n.targetTouches[0].pageX : n.pageX,
                                    l = "touchmove" === n.type ? n.targetTouches[0].pageY : n.pageY;
                                if (n.preventedByNestedSwiper) return r.startX = o, void(r.startY = l);
                                if (!e.allowTouchMove) return e.allowClick = !1, void(i.isTouched && (H.extend(r, {
                                    startX: o,
                                    startY: l,
                                    currentX: o,
                                    currentY: l
                                }), i.touchStartTime = H.now()));
                                if (i.isTouchEvent && s.touchReleaseOnEdges && !s.loop)
                                    if (e.isVertical()) {
                                        if (l < r.startY && e.translate <= e.maxTranslate() || l > r.startY && e.translate >= e.minTranslate()) return i.isTouched = !1, void(i.isMoved = !1)
                                    } else if (o < r.startX && e.translate <= e.maxTranslate() || o > r.startX && e.translate >= e.minTranslate()) return;
                                if (i.isTouchEvent && m.activeElement && n.target === m.activeElement && D(n.target).is(i.formElements)) return i.isMoved = !0, void(e.allowClick = !1);
                                if (i.allowTouchCallbacks && e.emit("touchMove", n), !(n.targetTouches && 1 < n.targetTouches.length)) {
                                    r.currentX = o, r.currentY = l;
                                    var h, p = r.currentX - r.startX,
                                        d = r.currentY - r.startY;
                                    if (!(e.params.threshold && Math.sqrt(Math.pow(p, 2) + Math.pow(d, 2)) < e.params.threshold))
                                        if (void 0 === i.isScrolling && (e.isHorizontal() && r.currentY === r.startY || e.isVertical() && r.currentX === r.startX ? i.isScrolling = !1 : 25 <= p * p + d * d && (h = 180 * Math.atan2(Math.abs(d), Math.abs(p)) / Math.PI, i.isScrolling = e.isHorizontal() ? h > s.touchAngle : 90 - h > s.touchAngle)), i.isScrolling && e.emit("touchMoveOpposite", n), void 0 === i.startMoving && (r.currentX === r.startX && r.currentY === r.startY || (i.startMoving = !0)), i.isScrolling) i.isTouched = !1;
                                        else if (i.startMoving) {
                                        e.allowClick = !1, n.preventDefault(), s.touchMoveStopPropagation && !s.nested && n.stopPropagation(), i.isMoved || (s.loop && e.loopFix(), i.startTranslate = e.getTranslate(), e.setTransition(0), e.animating && e.$wrapperEl.trigger("webkitTransitionEnd transitionend"), i.allowMomentumBounce = !1, !s.grabCursor || !0 !== e.allowSlideNext && !0 !== e.allowSlidePrev || e.setGrabCursor(!0), e.emit("sliderFirstMove", n)), e.emit("sliderMove", n), i.isMoved = !0;
                                        var c = e.isHorizontal() ? p : d;
                                        r.diff = c, c *= s.touchRatio, a && (c = -c), e.swipeDirection = 0 < c ? "prev" : "next", i.currentTranslate = c + i.startTranslate;
                                        var f = !0,
                                            u = s.resistanceRatio;
                                        if (s.touchReleaseOnEdges && (u = 0), 0 < c && i.currentTranslate > e.minTranslate() ? (f = !1, s.resistance && (i.currentTranslate = e.minTranslate() - 1 + Math.pow(-e.minTranslate() + i.startTranslate + c, u))) : c < 0 && i.currentTranslate < e.maxTranslate() && (f = !1, s.resistance && (i.currentTranslate = e.maxTranslate() + 1 - Math.pow(e.maxTranslate() - i.startTranslate - c, u))), f && (n.preventedByNestedSwiper = !0), !e.allowSlideNext && "next" === e.swipeDirection && i.currentTranslate < i.startTranslate && (i.currentTranslate = i.startTranslate), !e.allowSlidePrev && "prev" === e.swipeDirection && i.currentTranslate > i.startTranslate && (i.currentTranslate = i.startTranslate), 0 < s.threshold) {
                                            if (!(Math.abs(c) > s.threshold || i.allowThresholdMove)) return void(i.currentTranslate = i.startTranslate);
                                            if (!i.allowThresholdMove) return i.allowThresholdMove = !0, r.startX = r.currentX, r.startY = r.currentY, i.currentTranslate = i.startTranslate, void(r.diff = e.isHorizontal() ? r.currentX - r.startX : r.currentY - r.startY)
                                        }
                                        s.followFinger && ((s.freeMode || s.watchSlidesProgress || s.watchSlidesVisibility) && (e.updateActiveIndex(), e.updateSlidesClasses()), s.freeMode && (0 === i.velocities.length && i.velocities.push({
                                            position: r[e.isHorizontal() ? "startX" : "startY"],
                                            time: i.touchStartTime
                                        }), i.velocities.push({
                                            position: r[e.isHorizontal() ? "currentX" : "currentY"],
                                            time: H.now()
                                        })), e.updateProgress(i.currentTranslate), e.setTranslate(i.currentTranslate))
                                    }
                                }
                            }
                        } else i.startMoving && i.isScrolling && e.emit("touchMoveOpposite", n)
                    }.bind(t), t.onTouchEnd = function(t) {
                        var e = this,
                            i = e.touchEventsData,
                            s = e.params,
                            r = e.touches,
                            a = e.rtlTranslate,
                            n = e.$wrapperEl,
                            o = e.slidesGrid,
                            l = e.snapGrid,
                            h = t;
                        if (h.originalEvent && (h = h.originalEvent), i.allowTouchCallbacks && e.emit("touchEnd", h), i.allowTouchCallbacks = !1, !i.isTouched) return i.isMoved && s.grabCursor && e.setGrabCursor(!1), i.isMoved = !1, void(i.startMoving = !1);
                        s.grabCursor && i.isMoved && i.isTouched && (!0 === e.allowSlideNext || !0 === e.allowSlidePrev) && e.setGrabCursor(!1);
                        var p, d = H.now(),
                            c = d - i.touchStartTime;
                        if (e.allowClick && (e.updateClickedSlide(h), e.emit("tap", h), c < 300 && 300 < d - i.lastClickTime && (i.clickTimeout && clearTimeout(i.clickTimeout), i.clickTimeout = H.nextTick(function() {
                                e && !e.destroyed && e.emit("click", h)
                            }, 300)), c < 300 && d - i.lastClickTime < 300 && (i.clickTimeout && clearTimeout(i.clickTimeout), e.emit("doubleTap", h))), i.lastClickTime = H.now(), H.nextTick(function() {
                                e.destroyed || (e.allowClick = !0)
                            }), !i.isTouched || !i.isMoved || !e.swipeDirection || 0 === r.diff || i.currentTranslate === i.startTranslate) return i.isTouched = !1, i.isMoved = !1, void(i.startMoving = !1);
                        if (i.isTouched = !1, i.isMoved = !1, i.startMoving = !1, p = s.followFinger ? a ? e.translate : -e.translate : -i.currentTranslate, s.freeMode) {
                            if (p < -e.minTranslate()) return void e.slideTo(e.activeIndex);
                            if (p > -e.maxTranslate()) return void(e.slides.length < l.length ? e.slideTo(l.length - 1) : e.slideTo(e.slides.length - 1));
                            if (s.freeModeMomentum) {
                                if (1 < i.velocities.length) {
                                    var f = i.velocities.pop(),
                                        u = i.velocities.pop(),
                                        m = f.position - u.position,
                                        g = f.time - u.time;
                                    e.velocity = m / g, e.velocity /= 2, Math.abs(e.velocity) < s.freeModeMinimumVelocity && (e.velocity = 0), (150 < g || 300 < H.now() - f.time) && (e.velocity = 0)
                                } else e.velocity = 0;
                                e.velocity *= s.freeModeMomentumVelocityRatio, i.velocities.length = 0;
                                var v = 1e3 * s.freeModeMomentumRatio,
                                    y = e.velocity * v,
                                    _ = e.translate + y;
                                a && (_ = -_);
                                var b, x, T = !1,
                                    w = 20 * Math.abs(e.velocity) * s.freeModeMomentumBounceRatio;
                                if (_ < e.maxTranslate()) s.freeModeMomentumBounce ? (_ + e.maxTranslate() < -w && (_ = e.maxTranslate() - w), b = e.maxTranslate(), T = !0, i.allowMomentumBounce = !0) : _ = e.maxTranslate(), s.loop && s.centeredSlides && (x = !0);
                                else if (_ > e.minTranslate()) s.freeModeMomentumBounce ? (_ - e.minTranslate() > w && (_ = e.minTranslate() + w), b = e.minTranslate(), T = !0, i.allowMomentumBounce = !0) : _ = e.minTranslate(), s.loop && s.centeredSlides && (x = !0);
                                else if (s.freeModeSticky) {
                                    for (var E, S = 0; S < l.length; S += 1)
                                        if (l[S] > -_) {
                                            E = S;
                                            break
                                        }
                                    _ = -(_ = Math.abs(l[E] - _) < Math.abs(l[E - 1] - _) || "next" === e.swipeDirection ? l[E] : l[E - 1])
                                }
                                if (x && e.once("transitionEnd", function() {
                                        e.loopFix()
                                    }), 0 !== e.velocity) v = a ? Math.abs((-_ - e.translate) / e.velocity) : Math.abs((_ - e.translate) / e.velocity);
                                else if (s.freeModeSticky) return void e.slideToClosest();
                                s.freeModeMomentumBounce && T ? (e.updateProgress(b), e.setTransition(v), e.setTranslate(_), e.transitionStart(!0, e.swipeDirection), e.animating = !0, n.transitionEnd(function() {
                                    e && !e.destroyed && i.allowMomentumBounce && (e.emit("momentumBounce"), e.setTransition(s.speed), e.setTranslate(b), n.transitionEnd(function() {
                                        e && !e.destroyed && e.transitionEnd()
                                    }))
                                })) : e.velocity ? (e.updateProgress(_), e.setTransition(v), e.setTranslate(_), e.transitionStart(!0, e.swipeDirection), e.animating || (e.animating = !0, n.transitionEnd(function() {
                                    e && !e.destroyed && e.transitionEnd()
                                }))) : e.updateProgress(_), e.updateActiveIndex(), e.updateSlidesClasses()
                            } else if (s.freeModeSticky) return void e.slideToClosest();
                            (!s.freeModeMomentum || c >= s.longSwipesMs) && (e.updateProgress(), e.updateActiveIndex(), e.updateSlidesClasses())
                        } else {
                            for (var P = 0, C = e.slidesSizesGrid[0], k = 0; k < o.length; k += s.slidesPerGroup) void 0 !== o[k + s.slidesPerGroup] ? p >= o[k] && p < o[k + s.slidesPerGroup] && (C = o[(P = k) + s.slidesPerGroup] - o[k]) : p >= o[k] && (P = k, C = o[o.length - 1] - o[o.length - 2]);
                            var M = (p - o[P]) / C;
                            if (c > s.longSwipesMs) {
                                if (!s.longSwipes) return void e.slideTo(e.activeIndex);
                                "next" === e.swipeDirection && (M >= s.longSwipesRatio ? e.slideTo(P + s.slidesPerGroup) : e.slideTo(P)), "prev" === e.swipeDirection && (M > 1 - s.longSwipesRatio ? e.slideTo(P + s.slidesPerGroup) : e.slideTo(P))
                            } else {
                                if (!s.shortSwipes) return void e.slideTo(e.activeIndex);
                                "next" === e.swipeDirection && e.slideTo(P + s.slidesPerGroup), "prev" === e.swipeDirection && e.slideTo(P)
                            }
                        }
                    }.bind(t), t.onClick = function(t) {
                        this.allowClick || (this.params.preventClicks && t.preventDefault(), this.params.preventClicksPropagation && this.animating && (t.stopPropagation(), t.stopImmediatePropagation()))
                    }.bind(t);
                    var a = "container" === e.touchEventsTarget ? s : r,
                        n = !!e.nested;
                    if ($.touch || !$.pointerEvents && !$.prefixedPointerEvents) {
                        if ($.touch) {
                            var o = !("touchstart" !== i.start || !$.passiveListener || !e.passiveListeners) && {
                                passive: !0,
                                capture: !1
                            };
                            a.addEventListener(i.start, t.onTouchStart, o), a.addEventListener(i.move, t.onTouchMove, $.passiveListener ? {
                                passive: !1,
                                capture: n
                            } : n), a.addEventListener(i.end, t.onTouchEnd, o)
                        }(e.simulateTouch && !u.ios && !u.android || e.simulateTouch && !$.touch && u.ios) && (a.addEventListener("mousedown", t.onTouchStart, !1), m.addEventListener("mousemove", t.onTouchMove, n), m.addEventListener("mouseup", t.onTouchEnd, !1))
                    } else a.addEventListener(i.start, t.onTouchStart, !1), m.addEventListener(i.move, t.onTouchMove, n), m.addEventListener(i.end, t.onTouchEnd, !1);
                    (e.preventClicks || e.preventClicksPropagation) && a.addEventListener("click", t.onClick, !0), t.on(u.ios || u.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", g, !0)
                },
                detachEvents: function() {
                    var t = this,
                        e = t.params,
                        i = t.touchEvents,
                        s = t.el,
                        r = t.wrapperEl,
                        a = "container" === e.touchEventsTarget ? s : r,
                        n = !!e.nested;
                    if ($.touch || !$.pointerEvents && !$.prefixedPointerEvents) {
                        if ($.touch) {
                            var o = !("onTouchStart" !== i.start || !$.passiveListener || !e.passiveListeners) && {
                                passive: !0,
                                capture: !1
                            };
                            a.removeEventListener(i.start, t.onTouchStart, o), a.removeEventListener(i.move, t.onTouchMove, n), a.removeEventListener(i.end, t.onTouchEnd, o)
                        }(e.simulateTouch && !u.ios && !u.android || e.simulateTouch && !$.touch && u.ios) && (a.removeEventListener("mousedown", t.onTouchStart, !1), m.removeEventListener("mousemove", t.onTouchMove, n), m.removeEventListener("mouseup", t.onTouchEnd, !1))
                    } else a.removeEventListener(i.start, t.onTouchStart, !1), m.removeEventListener(i.move, t.onTouchMove, n), m.removeEventListener(i.end, t.onTouchEnd, !1);
                    (e.preventClicks || e.preventClicksPropagation) && a.removeEventListener("click", t.onClick, !0), t.off(u.ios || u.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", g)
                }
            },
            _ = {
                setBreakpoint: function() {
                    var t = this,
                        e = t.activeIndex,
                        i = t.initialized,
                        s = t.loopedSlides;
                    void 0 === s && (s = 0);
                    var r = t.params,
                        a = r.breakpoints;
                    if (a && (!a || 0 !== Object.keys(a).length)) {
                        var n = t.getBreakpoint(a);
                        if (n && t.currentBreakpoint !== n) {
                            var o = n in a ? a[n] : void 0;
                            o && ["slidesPerView", "spaceBetween", "slidesPerGroup"].forEach(function(t) {
                                var e = o[t];
                                void 0 !== e && (o[t] = "slidesPerView" !== t || "AUTO" !== e && "auto" !== e ? "slidesPerView" === t ? parseFloat(e) : parseInt(e, 10) : "auto")
                            });
                            var l = o || t.originalParams,
                                h = r.loop && l.slidesPerView !== r.slidesPerView;
                            H.extend(t.params, l), H.extend(t, {
                                allowTouchMove: t.params.allowTouchMove,
                                allowSlideNext: t.params.allowSlideNext,
                                allowSlidePrev: t.params.allowSlidePrev
                            }), t.currentBreakpoint = n, h && i && (t.loopDestroy(), t.loopCreate(), t.updateSlides(), t.slideTo(e - s + t.loopedSlides, 0, !1)), t.emit("breakpoint", l)
                        }
                    }
                },
                getBreakpoint: function(t) {
                    if (t) {
                        var e = !1,
                            i = [];
                        Object.keys(t).forEach(function(t) {
                            i.push(t)
                        }), i.sort(function(t, e) {
                            return parseInt(t, 10) - parseInt(e, 10)
                        });
                        for (var s = 0; s < i.length; s += 1) {
                            var r = i[s];
                            this.params.breakpointsInverse ? r <= G.innerWidth && (e = r) : r >= G.innerWidth && !e && (e = r)
                        }
                        return e || "max"
                    }
                }
            },
            I = {
                isIE: !!G.navigator.userAgent.match(/Trident/g) || !!G.navigator.userAgent.match(/MSIE/g),
                isEdge: !!G.navigator.userAgent.match(/Edge/g),
                isSafari: (v = G.navigator.userAgent.toLowerCase(), 0 <= v.indexOf("safari") && v.indexOf("chrome") < 0 && v.indexOf("android") < 0),
                isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(G.navigator.userAgent)
            },
            b = {
                init: !0,
                direction: "horizontal",
                touchEventsTarget: "container",
                initialSlide: 0,
                speed: 300,
                preventInteractionOnTransition: !1,
                edgeSwipeDetection: !1,
                edgeSwipeThreshold: 20,
                freeMode: !1,
                freeModeMomentum: !0,
                freeModeMomentumRatio: 1,
                freeModeMomentumBounce: !0,
                freeModeMomentumBounceRatio: 1,
                freeModeMomentumVelocityRatio: 1,
                freeModeSticky: !1,
                freeModeMinimumVelocity: .02,
                autoHeight: !1,
                setWrapperSize: !1,
                virtualTranslate: !1,
                effect: "slide",
                breakpoints: void 0,
                breakpointsInverse: !1,
                spaceBetween: 0,
                slidesPerView: 1,
                slidesPerColumn: 1,
                slidesPerColumnFill: "column",
                slidesPerGroup: 1,
                centeredSlides: !1,
                slidesOffsetBefore: 0,
                slidesOffsetAfter: 0,
                normalizeSlideIndex: !0,
                centerInsufficientSlides: !1,
                watchOverflow: !1,
                roundLengths: !1,
                touchRatio: 1,
                touchAngle: 45,
                simulateTouch: !0,
                shortSwipes: !0,
                longSwipes: !0,
                longSwipesRatio: .5,
                longSwipesMs: 300,
                followFinger: !0,
                allowTouchMove: !0,
                threshold: 0,
                touchMoveStopPropagation: !0,
                touchStartPreventDefault: !0,
                touchStartForcePreventDefault: !1,
                touchReleaseOnEdges: !1,
                uniqueNavElements: !0,
                resistance: !0,
                resistanceRatio: .85,
                watchSlidesProgress: !1,
                watchSlidesVisibility: !1,
                grabCursor: !1,
                preventClicks: !0,
                preventClicksPropagation: !0,
                slideToClickedSlide: !1,
                preloadImages: !0,
                updateOnImagesReady: !0,
                loop: !1,
                loopAdditionalSlides: 0,
                loopedSlides: null,
                loopFillGroupWithBlank: !1,
                allowSlidePrev: !0,
                allowSlideNext: !0,
                swipeHandler: null,
                noSwiping: !0,
                noSwipingClass: "swiper-no-swiping",
                noSwipingSelector: null,
                passiveListeners: !0,
                containerModifierClass: "swiper-container-",
                slideClass: "swiper-slide",
                slideBlankClass: "swiper-slide-invisible-blank",
                slideActiveClass: "swiper-slide-active",
                slideDuplicateActiveClass: "swiper-slide-duplicate-active",
                slideVisibleClass: "swiper-slide-visible",
                slideDuplicateClass: "swiper-slide-duplicate",
                slideNextClass: "swiper-slide-next",
                slideDuplicateNextClass: "swiper-slide-duplicate-next",
                slidePrevClass: "swiper-slide-prev",
                slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
                wrapperClass: "swiper-wrapper",
                runCallbacksOnInit: !0
            },
            x = {
                update: o,
                translate: h,
                transition: {
                    setTransition: function(t, e) {
                        this.$wrapperEl.transition(t), this.emit("setTransition", t, e)
                    },
                    transitionStart: function(t, e) {
                        void 0 === t && (t = !0);
                        var i = this.activeIndex,
                            s = this.params,
                            r = this.previousIndex;
                        s.autoHeight && this.updateAutoHeight();
                        var a = e;
                        if (a || (a = r < i ? "next" : i < r ? "prev" : "reset"), this.emit("transitionStart"), t && i !== r) {
                            if ("reset" === a) return void this.emit("slideResetTransitionStart");
                            this.emit("slideChangeTransitionStart"), "next" === a ? this.emit("slideNextTransitionStart") : this.emit("slidePrevTransitionStart")
                        }
                    },
                    transitionEnd: function(t, e) {
                        void 0 === t && (t = !0);
                        var i = this.activeIndex,
                            s = this.previousIndex;
                        this.animating = !1, this.setTransition(0);
                        var r = e;
                        if (r || (r = s < i ? "next" : i < s ? "prev" : "reset"), this.emit("transitionEnd"), t && i !== s) {
                            if ("reset" === r) return void this.emit("slideResetTransitionEnd");
                            this.emit("slideChangeTransitionEnd"), "next" === r ? this.emit("slideNextTransitionEnd") : this.emit("slidePrevTransitionEnd")
                        }
                    }
                },
                slide: p,
                loop: d,
                grabCursor: c,
                manipulation: f,
                events: y,
                breakpoints: _,
                checkOverflow: {
                    checkOverflow: function() {
                        var t = this,
                            e = t.isLocked;
                        t.isLocked = 1 === t.snapGrid.length, t.allowSlideNext = !t.isLocked, t.allowSlidePrev = !t.isLocked, e !== t.isLocked && t.emit(t.isLocked ? "lock" : "unlock"), e && e !== t.isLocked && (t.isEnd = !1, t.navigation.update())
                    }
                },
                classes: {
                    addClasses: function() {
                        var e = this.classNames,
                            i = this.params,
                            t = this.rtl,
                            s = this.$el,
                            r = [];
                        r.push(i.direction), i.freeMode && r.push("free-mode"), $.flexbox || r.push("no-flexbox"), i.autoHeight && r.push("autoheight"), t && r.push("rtl"), 1 < i.slidesPerColumn && r.push("multirow"), u.android && r.push("android"), u.ios && r.push("ios"), (I.isIE || I.isEdge) && ($.pointerEvents || $.prefixedPointerEvents) && r.push("wp8-" + i.direction), r.forEach(function(t) {
                            e.push(i.containerModifierClass + t)
                        }), s.addClass(e.join(" "))
                    },
                    removeClasses: function() {
                        var t = this.$el,
                            e = this.classNames;
                        t.removeClass(e.join(" "))
                    }
                },
                images: {
                    loadImage: function(t, e, i, s, r, a) {
                        var n;
                        function o() {
                            a && a()
                        }
                        t.complete && r ? o() : e ? ((n = new G.Image).onload = o, n.onerror = o, s && (n.sizes = s), i && (n.srcset = i), e && (n.src = e)) : o()
                    },
                    preloadImages: function() {
                        var t = this;
                        function e() {
                            null != t && t && !t.destroyed && (void 0 !== t.imagesLoaded && (t.imagesLoaded += 1), t.imagesLoaded === t.imagesToLoad.length && (t.params.updateOnImagesReady && t.update(), t.emit("imagesReady")))
                        }
                        t.imagesToLoad = t.$el.find("img");
                        for (var i = 0; i < t.imagesToLoad.length; i += 1) {
                            var s = t.imagesToLoad[i];
                            t.loadImage(s, s.currentSrc || s.getAttribute("src"), s.srcset || s.getAttribute("srcset"), s.sizes || s.getAttribute("sizes"), !0, e)
                        }
                    }
                }
            },
            T = {},
            w = function(c) {
                function f() {
                    for (var t, e, r, i = [], s = arguments.length; s--;) i[s] = arguments[s];
                    (r = 1 === i.length && i[0].constructor && i[0].constructor === Object ? i[0] : (e = (t = i)[0], t[1])) || (r = {}), r = H.extend({}, r), e && !r.el && (r.el = e), c.call(this, r), Object.keys(x).forEach(function(e) {
                        Object.keys(x[e]).forEach(function(t) {
                            f.prototype[t] || (f.prototype[t] = x[e][t])
                        })
                    });
                    var a = this;
                    void 0 === a.modules && (a.modules = {}), Object.keys(a.modules).forEach(function(t) {
                        var e = a.modules[t];
                        if (e.params) {
                            var i = Object.keys(e.params)[0],
                                s = e.params[i];
                            if ("object" != typeof s || null === s) return;
                            if (!(i in r && "enabled" in s)) return;
                            !0 === r[i] && (r[i] = {
                                enabled: !0
                            }), "object" != typeof r[i] || "enabled" in r[i] || (r[i].enabled = !0), r[i] || (r[i] = {
                                enabled: !1
                            })
                        }
                    });
                    var n = H.extend({}, b);
                    a.useModulesParams(n), a.params = H.extend({}, n, T, r), a.originalParams = H.extend({}, a.params), a.passedParams = H.extend({}, r);
                    var o = (a.$ = D)(a.params.el);
                    if (e = o[0]) {
                        if (1 < o.length) {
                            var l = [];
                            return o.each(function(t, e) {
                                var i = H.extend({}, r, {
                                    el: e
                                });
                                l.push(new f(i))
                            }), l
                        }
                        e.swiper = a, o.data("swiper", a);
                        var h, p, d = o.children("." + a.params.wrapperClass);
                        return H.extend(a, {
                            $el: o,
                            el: e,
                            $wrapperEl: d,
                            wrapperEl: d[0],
                            classNames: [],
                            slides: D(),
                            slidesGrid: [],
                            snapGrid: [],
                            slidesSizesGrid: [],
                            isHorizontal: function() {
                                return "horizontal" === a.params.direction
                            },
                            isVertical: function() {
                                return "vertical" === a.params.direction
                            },
                            rtl: "rtl" === e.dir.toLowerCase() || "rtl" === o.css("direction"),
                            rtlTranslate: "horizontal" === a.params.direction && ("rtl" === e.dir.toLowerCase() || "rtl" === o.css("direction")),
                            wrongRTL: "-webkit-box" === d.css("display"),
                            activeIndex: 0,
                            realIndex: 0,
                            isBeginning: !0,
                            isEnd: !1,
                            translate: 0,
                            previousTranslate: 0,
                            progress: 0,
                            velocity: 0,
                            animating: !1,
                            allowSlideNext: a.params.allowSlideNext,
                            allowSlidePrev: a.params.allowSlidePrev,
                            touchEvents: (h = ["touchstart", "touchmove", "touchend"], p = ["mousedown", "mousemove", "mouseup"], $.pointerEvents ? p = ["pointerdown", "pointermove", "pointerup"] : $.prefixedPointerEvents && (p = ["MSPointerDown", "MSPointerMove", "MSPointerUp"]), a.touchEventsTouch = {
                                start: h[0],
                                move: h[1],
                                end: h[2]
                            }, a.touchEventsDesktop = {
                                start: p[0],
                                move: p[1],
                                end: p[2]
                            }, $.touch || !a.params.simulateTouch ? a.touchEventsTouch : a.touchEventsDesktop),
                            touchEventsData: {
                                isTouched: void 0,
                                isMoved: void 0,
                                allowTouchCallbacks: void 0,
                                touchStartTime: void 0,
                                isScrolling: void 0,
                                currentTranslate: void 0,
                                startTranslate: void 0,
                                allowThresholdMove: void 0,
                                formElements: "input, select, option, textarea, button, video",
                                lastClickTime: H.now(),
                                clickTimeout: void 0,
                                velocities: [],
                                allowMomentumBounce: void 0,
                                isTouchEvent: void 0,
                                startMoving: void 0
                            },
                            allowClick: !0,
                            allowTouchMove: a.params.allowTouchMove,
                            touches: {
                                startX: 0,
                                startY: 0,
                                currentX: 0,
                                currentY: 0,
                                diff: 0
                            },
                            imagesToLoad: [],
                            imagesLoaded: 0
                        }), a.useModules(), a.params.init && a.init(), a
                    }
                }
                c && (f.__proto__ = c);
                var t = {
                    extendedDefaults: {
                        configurable: !0
                    },
                    defaults: {
                        configurable: !0
                    },
                    Class: {
                        configurable: !0
                    },
                    $: {
                        configurable: !0
                    }
                };
                return ((f.prototype = Object.create(c && c.prototype)).constructor = f).prototype.slidesPerViewDynamic = function() {
                    var t = this.params,
                        e = this.slides,
                        i = this.slidesGrid,
                        s = this.size,
                        r = this.activeIndex,
                        a = 1;
                    if (t.centeredSlides) {
                        for (var n, o = e[r].swiperSlideSize, l = r + 1; l < e.length; l += 1) e[l] && !n && (a += 1, s < (o += e[l].swiperSlideSize) && (n = !0));
                        for (var h = r - 1; 0 <= h; h -= 1) e[h] && !n && (a += 1, s < (o += e[h].swiperSlideSize) && (n = !0))
                    } else
                        for (var p = r + 1; p < e.length; p += 1) i[p] - i[r] < s && (a += 1);
                    return a
                }, f.prototype.update = function() {
                    var i = this;
                    if (i && !i.destroyed) {
                        var t = i.snapGrid,
                            e = i.params;
                        e.breakpoints && i.setBreakpoint(), i.updateSize(), i.updateSlides(), i.updateProgress(), i.updateSlidesClasses(), i.params.freeMode ? (s(), i.params.autoHeight && i.updateAutoHeight()) : (("auto" === i.params.slidesPerView || 1 < i.params.slidesPerView) && i.isEnd && !i.params.centeredSlides ? i.slideTo(i.slides.length - 1, 0, !1, !0) : i.slideTo(i.activeIndex, 0, !1, !0)) || s(), e.watchOverflow && t !== i.snapGrid && i.checkOverflow(), i.emit("update")
                    }
                    function s() {
                        var t = i.rtlTranslate ? -1 * i.translate : i.translate,
                            e = Math.min(Math.max(t, i.maxTranslate()), i.minTranslate());
                        i.setTranslate(e), i.updateActiveIndex(), i.updateSlidesClasses()
                    }
                }, f.prototype.init = function() {
                    var t = this;
                    t.initialized || (t.emit("beforeInit"), t.params.breakpoints && t.setBreakpoint(), t.addClasses(), t.params.loop && t.loopCreate(), t.updateSize(), t.updateSlides(), t.params.watchOverflow && t.checkOverflow(), t.params.grabCursor && t.setGrabCursor(), t.params.preloadImages && t.preloadImages(), t.params.loop ? t.slideTo(t.params.initialSlide + t.loopedSlides, 0, t.params.runCallbacksOnInit) : t.slideTo(t.params.initialSlide, 0, t.params.runCallbacksOnInit), t.attachEvents(), t.initialized = !0, t.emit("init"))
                }, f.prototype.destroy = function(t, e) {
                    void 0 === t && (t = !0), void 0 === e && (e = !0);
                    var i = this,
                        s = i.params,
                        r = i.$el,
                        a = i.$wrapperEl,
                        n = i.slides;
                    return void 0 === i.params || i.destroyed || (i.emit("beforeDestroy"), i.initialized = !1, i.detachEvents(), s.loop && i.loopDestroy(), e && (i.removeClasses(), r.removeAttr("style"), a.removeAttr("style"), n && n.length && n.removeClass([s.slideVisibleClass, s.slideActiveClass, s.slideNextClass, s.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index").removeAttr("data-swiper-column").removeAttr("data-swiper-row")), i.emit("destroy"), Object.keys(i.eventsListeners).forEach(function(t) {
                        i.off(t)
                    }), !1 !== t && (i.$el[0].swiper = null, i.$el.data("swiper", null), H.deleteProps(i)), i.destroyed = !0), null
                }, f.extendDefaults = function(t) {
                    H.extend(T, t)
                }, t.extendedDefaults.get = function() {
                    return T
                }, t.defaults.get = function() {
                    return b
                }, t.Class.get = function() {
                    return c
                }, t.$.get = function() {
                    return D
                }, Object.defineProperties(f, t), f
            }(r),
            E = {
                name: "device",
                proto: {
                    device: u
                },
                static: {
                    device: u
                }
            },
            S = {
                name: "support",
                proto: {
                    support: $
                },
                static: {
                    support: $
                }
            },
            P = {
                name: "browser",
                proto: {
                    browser: I
                },
                static: {
                    browser: I
                }
            },
            C = {
                name: "resize",
                create: function() {
                    var t = this;
                    H.extend(t, {
                        resize: {
                            resizeHandler: function() {
                                t && !t.destroyed && t.initialized && (t.emit("beforeResize"), t.emit("resize"))
                            },
                            orientationChangeHandler: function() {
                                t && !t.destroyed && t.initialized && t.emit("orientationchange")
                            }
                        }
                    })
                },
                on: {
                    init: function() {
                        G.addEventListener("resize", this.resize.resizeHandler), G.addEventListener("orientationchange", this.resize.orientationChangeHandler)
                    },
                    destroy: function() {
                        G.removeEventListener("resize", this.resize.resizeHandler), G.removeEventListener("orientationchange", this.resize.orientationChangeHandler)
                    }
                }
            },
            k = {
                func: G.MutationObserver || G.WebkitMutationObserver,
                attach: function(t, e) {
                    void 0 === e && (e = {});
                    var i = this,
                        s = new k.func(function(t) {
                            if (1 !== t.length) {
                                var e = function() {
                                    i.emit("observerUpdate", t[0])
                                };
                                G.requestAnimationFrame ? G.requestAnimationFrame(e) : G.setTimeout(e, 0)
                            } else i.emit("observerUpdate", t[0])
                        });
                    s.observe(t, {
                        attributes: void 0 === e.attributes || e.attributes,
                        childList: void 0 === e.childList || e.childList,
                        characterData: void 0 === e.characterData || e.characterData
                    }), i.observer.observers.push(s)
                },
                init: function() {
                    if ($.observer && this.params.observer) {
                        if (this.params.observeParents)
                            for (var t = this.$el.parents(), e = 0; e < t.length; e += 1) this.observer.attach(t[e]);
                        this.observer.attach(this.$el[0], {
                            childList: !1
                        }), this.observer.attach(this.$wrapperEl[0], {
                            attributes: !1
                        })
                    }
                },
                destroy: function() {
                    this.observer.observers.forEach(function(t) {
                        t.disconnect()
                    }), this.observer.observers = []
                }
            },
            M = {
                name: "observer",
                params: {
                    observer: !1,
                    observeParents: !1
                },
                create: function() {
                    H.extend(this, {
                        observer: {
                            init: k.init.bind(this),
                            attach: k.attach.bind(this),
                            destroy: k.destroy.bind(this),
                            observers: []
                        }
                    })
                },
                on: {
                    init: function() {
                        this.observer.init()
                    },
                    destroy: function() {
                        this.observer.destroy()
                    }
                }
            },
            A = {
                update: function(t) {
                    var e = this,
                        i = e.params,
                        s = i.slidesPerView,
                        r = i.slidesPerGroup,
                        a = i.centeredSlides,
                        n = e.params.virtual,
                        o = n.addSlidesBefore,
                        l = n.addSlidesAfter,
                        h = e.virtual,
                        p = h.from,
                        d = h.to,
                        c = h.slides,
                        f = h.slidesGrid,
                        u = h.renderSlide,
                        m = h.offset;
                    e.updateActiveIndex();
                    var g, v, y, _ = e.activeIndex || 0;
                    g = e.rtlTranslate ? "right" : e.isHorizontal() ? "left" : "top", y = a ? (v = Math.floor(s / 2) + r + o, Math.floor(s / 2) + r + l) : (v = s + (r - 1) + o, r + l);
                    var b = Math.max((_ || 0) - y, 0),
                        x = Math.min((_ || 0) + v, c.length - 1),
                        T = (e.slidesGrid[b] || 0) - (e.slidesGrid[0] || 0);
                    function w() {
                        e.updateSlides(), e.updateProgress(), e.updateSlidesClasses(), e.lazy && e.params.lazy.enabled && e.lazy.load()
                    }
                    if (H.extend(e.virtual, {
                            from: b,
                            to: x,
                            offset: T,
                            slidesGrid: e.slidesGrid
                        }), p === b && d === x && !t) return e.slidesGrid !== f && T !== m && e.slides.css(g, T + "px"), void e.updateProgress();
                    if (e.params.virtual.renderExternal) return e.params.virtual.renderExternal.call(e, {
                        offset: T,
                        from: b,
                        to: x,
                        slides: function() {
                            for (var t = [], e = b; e <= x; e += 1) t.push(c[e]);
                            return t
                        }()
                    }), void w();
                    var E = [],
                        S = [];
                    if (t) e.$wrapperEl.find("." + e.params.slideClass).remove();
                    else
                        for (var P = p; P <= d; P += 1)(P < b || x < P) && e.$wrapperEl.find("." + e.params.slideClass + '[data-swiper-slide-index="' + P + '"]').remove();
                    for (var C = 0; C < c.length; C += 1) b <= C && C <= x && (void 0 === d || t ? S.push(C) : (d < C && S.push(C), C < p && E.push(C)));
                    S.forEach(function(t) {
                        e.$wrapperEl.append(u(c[t], t))
                    }), E.sort(function(t, e) {
                        return e - t
                    }).forEach(function(t) {
                        e.$wrapperEl.prepend(u(c[t], t))
                    }), e.$wrapperEl.children(".swiper-slide").css(g, T + "px"), w()
                },
                renderSlide: function(t, e) {
                    var i = this.params.virtual;
                    if (i.cache && this.virtual.cache[e]) return this.virtual.cache[e];
                    var s = i.renderSlide ? D(i.renderSlide.call(this, t, e)) : D('<div class="' + this.params.slideClass + '" data-swiper-slide-index="' + e + '">' + t + "</div>");
                    return s.attr("data-swiper-slide-index") || s.attr("data-swiper-slide-index", e), i.cache && (this.virtual.cache[e] = s), s
                },
                appendSlide: function(t) {
                    this.virtual.slides.push(t), this.virtual.update(!0)
                },
                prependSlide: function(t) {
                    if (this.virtual.slides.unshift(t), this.params.virtual.cache) {
                        var e = this.virtual.cache,
                            i = {};
                        Object.keys(e).forEach(function(t) {
                            i[t + 1] = e[t]
                        }), this.virtual.cache = i
                    }
                    this.virtual.update(!0), this.slideNext(0)
                }
            },
            F = {
                name: "virtual",
                params: {
                    virtual: {
                        enabled: !1,
                        slides: [],
                        cache: !0,
                        renderSlide: null,
                        renderExternal: null,
                        addSlidesBefore: 0,
                        addSlidesAfter: 0
                    }
                },
                create: function() {
                    H.extend(this, {
                        virtual: {
                            update: A.update.bind(this),
                            appendSlide: A.appendSlide.bind(this),
                            prependSlide: A.prependSlide.bind(this),
                            renderSlide: A.renderSlide.bind(this),
                            slides: this.params.virtual.slides,
                            cache: {}
                        }
                    })
                },
                on: {
                    beforeInit: function() {
                        if (this.params.virtual.enabled) {
                            this.classNames.push(this.params.containerModifierClass + "virtual");
                            var t = {
                                watchSlidesProgress: !0
                            };
                            H.extend(this.params, t), H.extend(this.originalParams, t), this.params.initialSlide || this.virtual.update()
                        }
                    },
                    setTranslate: function() {
                        this.params.virtual.enabled && this.virtual.update()
                    }
                }
            },
            R = {
                handle: function(t) {
                    var e = this,
                        i = e.rtlTranslate,
                        s = t;
                    s.originalEvent && (s = s.originalEvent);
                    var r = s.keyCode || s.charCode;
                    if (!e.allowSlideNext && (e.isHorizontal() && 39 === r || e.isVertical() && 40 === r)) return !1;
                    if (!e.allowSlidePrev && (e.isHorizontal() && 37 === r || e.isVertical() && 38 === r)) return !1;
                    if (!(s.shiftKey || s.altKey || s.ctrlKey || s.metaKey || m.activeElement && m.activeElement.nodeName && ("input" === m.activeElement.nodeName.toLowerCase() || "textarea" === m.activeElement.nodeName.toLowerCase()))) {
                        if (e.params.keyboard.onlyInViewport && (37 === r || 39 === r || 38 === r || 40 === r)) {
                            var a = !1;
                            if (0 < e.$el.parents("." + e.params.slideClass).length && 0 === e.$el.parents("." + e.params.slideActiveClass).length) return;
                            var n = G.innerWidth,
                                o = G.innerHeight,
                                l = e.$el.offset();
                            i && (l.left -= e.$el[0].scrollLeft);
                            for (var h = [
                                    [l.left, l.top],
                                    [l.left + e.width, l.top],
                                    [l.left, l.top + e.height],
                                    [l.left + e.width, l.top + e.height]
                                ], p = 0; p < h.length; p += 1) {
                                var d = h[p];
                                0 <= d[0] && d[0] <= n && 0 <= d[1] && d[1] <= o && (a = !0)
                            }
                            if (!a) return
                        }
                        e.isHorizontal() ? (37 !== r && 39 !== r || (s.preventDefault ? s.preventDefault() : s.returnValue = !1), (39 === r && !i || 37 === r && i) && e.slideNext(), (37 === r && !i || 39 === r && i) && e.slidePrev()) : (38 !== r && 40 !== r || (s.preventDefault ? s.preventDefault() : s.returnValue = !1), 40 === r && e.slideNext(), 38 === r && e.slidePrev()), e.emit("keyPress", r)
                    }
                },
                enable: function() {
                    this.keyboard.enabled || (D(m).on("keydown", this.keyboard.handle), this.keyboard.enabled = !0)
                },
                disable: function() {
                    this.keyboard.enabled && (D(m).off("keydown", this.keyboard.handle), this.keyboard.enabled = !1)
                }
            },
            O = {
                name: "keyboard",
                params: {
                    keyboard: {
                        enabled: !1,
                        onlyInViewport: !0
                    }
                },
                create: function() {
                    H.extend(this, {
                        keyboard: {
                            enabled: !1,
                            enable: R.enable.bind(this),
                            disable: R.disable.bind(this),
                            handle: R.handle.bind(this)
                        }
                    })
                },
                on: {
                    init: function() {
                        this.params.keyboard.enabled && this.keyboard.enable()
                    },
                    destroy: function() {
                        this.keyboard.enabled && this.keyboard.disable()
                    }
                }
            },
            z = {
                lastScrollTime: H.now(),
                event: -1 < G.navigator.userAgent.indexOf("firefox") ? "DOMMouseScroll" : function() {
                    var t = "onwheel",
                        e = t in m;
                    if (!e) {
                        var i = m.createElement("div");
                        i.setAttribute(t, "return;"), e = "function" == typeof i[t]
                    }
                    return !e && m.implementation && m.implementation.hasFeature && !0 !== m.implementation.hasFeature("", "") && (e = m.implementation.hasFeature("Events.wheel", "3.0")), e
                }() ? "wheel" : "mousewheel",
                normalize: function(t) {
                    var e = 0,
                        i = 0,
                        s = 0,
                        r = 0;
                    return "detail" in t && (i = t.detail), "wheelDelta" in t && (i = -t.wheelDelta / 120), "wheelDeltaY" in t && (i = -t.wheelDeltaY / 120), "wheelDeltaX" in t && (e = -t.wheelDeltaX / 120), "axis" in t && t.axis === t.HORIZONTAL_AXIS && (e = i, i = 0), s = 10 * e, r = 10 * i, "deltaY" in t && (r = t.deltaY), "deltaX" in t && (s = t.deltaX), (s || r) && t.deltaMode && (1 === t.deltaMode ? (s *= 40, r *= 40) : (s *= 800, r *= 800)), s && !e && (e = s < 1 ? -1 : 1), r && !i && (i = r < 1 ? -1 : 1), {
                        spinX: e,
                        spinY: i,
                        pixelX: s,
                        pixelY: r
                    }
                },
                handleMouseEnter: function() {
                    this.mouseEntered = !0
                },
                handleMouseLeave: function() {
                    this.mouseEntered = !1
                },
                handle: function(t) {
                    var e = t,
                        i = this,
                        s = i.params.mousewheel;
                    if (!i.mouseEntered && !s.releaseOnEdges) return !0;
                    e.originalEvent && (e = e.originalEvent);
                    var r = 0,
                        a = i.rtlTranslate ? -1 : 1,
                        n = z.normalize(e);
                    if (s.forceToAxis)
                        if (i.isHorizontal()) {
                            if (!(Math.abs(n.pixelX) > Math.abs(n.pixelY))) return !0;
                            r = n.pixelX * a
                        } else {
                            if (!(Math.abs(n.pixelY) > Math.abs(n.pixelX))) return !0;
                            r = n.pixelY
                        }
                    else r = Math.abs(n.pixelX) > Math.abs(n.pixelY) ? -n.pixelX * a : -n.pixelY;
                    if (0 === r) return !0;
                    if (s.invert && (r = -r), i.params.freeMode) {
                        i.params.loop && i.loopFix();
                        var o = i.getTranslate() + r * s.sensitivity,
                            l = i.isBeginning,
                            h = i.isEnd;
                        if (o >= i.minTranslate() && (o = i.minTranslate()), o <= i.maxTranslate() && (o = i.maxTranslate()), i.setTransition(0), i.setTranslate(o), i.updateProgress(), i.updateActiveIndex(), i.updateSlidesClasses(), (!l && i.isBeginning || !h && i.isEnd) && i.updateSlidesClasses(), i.params.freeModeSticky && (clearTimeout(i.mousewheel.timeout), i.mousewheel.timeout = H.nextTick(function() {
                                i.slideToClosest()
                            }, 300)), i.emit("scroll", e), i.params.autoplay && i.params.autoplayDisableOnInteraction && i.autoplay.stop(), o === i.minTranslate() || o === i.maxTranslate()) return !0
                    } else {
                        if (60 < H.now() - i.mousewheel.lastScrollTime)
                            if (r < 0)
                                if (i.isEnd && !i.params.loop || i.animating) {
                                    if (s.releaseOnEdges) return !0
                                } else i.slideNext(), i.emit("scroll", e);
                        else if (i.isBeginning && !i.params.loop || i.animating) {
                            if (s.releaseOnEdges) return !0
                        } else i.slidePrev(), i.emit("scroll", e);
                        i.mousewheel.lastScrollTime = (new G.Date).getTime()
                    }
                    return e.preventDefault ? e.preventDefault() : e.returnValue = !1, !1
                },
                enable: function() {
                    if (!z.event) return !1;
                    if (this.mousewheel.enabled) return !1;
                    var t = this.$el;
                    return "container" !== this.params.mousewheel.eventsTarged && (t = D(this.params.mousewheel.eventsTarged)), t.on("mouseenter", this.mousewheel.handleMouseEnter), t.on("mouseleave", this.mousewheel.handleMouseLeave), t.on(z.event, this.mousewheel.handle), this.mousewheel.enabled = !0
                },
                disable: function() {
                    if (!z.event) return !1;
                    if (!this.mousewheel.enabled) return !1;
                    var t = this.$el;
                    return "container" !== this.params.mousewheel.eventsTarged && (t = D(this.params.mousewheel.eventsTarged)), t.off(z.event, this.mousewheel.handle), !(this.mousewheel.enabled = !1)
                }
            },
            L = {
                update: function() {
                    var t = this.params.navigation;
                    if (!this.params.loop) {
                        var e = this.navigation,
                            i = e.$nextEl,
                            s = e.$prevEl;
                        s && 0 < s.length && (this.isBeginning ? s.addClass(t.disabledClass) : s.removeClass(t.disabledClass), s[this.params.watchOverflow && this.isLocked ? "addClass" : "removeClass"](t.lockClass)), i && 0 < i.length && (this.isEnd ? i.addClass(t.disabledClass) : i.removeClass(t.disabledClass), i[this.params.watchOverflow && this.isLocked ? "addClass" : "removeClass"](t.lockClass))
                    }
                },
                onPrevClick: function(t) {
                    t.preventDefault(), this.isBeginning && !this.params.loop || this.slidePrev()
                },
                onNextClick: function(t) {
                    t.preventDefault(), this.isEnd && !this.params.loop || this.slideNext()
                },
                init: function() {
                    var t, e, i = this,
                        s = i.params.navigation;
                    (s.nextEl || s.prevEl) && (s.nextEl && (t = D(s.nextEl), i.params.uniqueNavElements && "string" == typeof s.nextEl && 1 < t.length && 1 === i.$el.find(s.nextEl).length && (t = i.$el.find(s.nextEl))), s.prevEl && (e = D(s.prevEl), i.params.uniqueNavElements && "string" == typeof s.prevEl && 1 < e.length && 1 === i.$el.find(s.prevEl).length && (e = i.$el.find(s.prevEl))), t && 0 < t.length && t.on("click", i.navigation.onNextClick), e && 0 < e.length && e.on("click", i.navigation.onPrevClick), H.extend(i.navigation, {
                        $nextEl: t,
                        nextEl: t && t[0],
                        $prevEl: e,
                        prevEl: e && e[0]
                    }))
                },
                destroy: function() {
                    var t = this.navigation,
                        e = t.$nextEl,
                        i = t.$prevEl;
                    e && e.length && (e.off("click", this.navigation.onNextClick), e.removeClass(this.params.navigation.disabledClass)), i && i.length && (i.off("click", this.navigation.onPrevClick), i.removeClass(this.params.navigation.disabledClass))
                }
            },
            B = {
                update: function() {
                    var t = this,
                        e = t.rtl,
                        r = t.params.pagination;
                    if (r.el && t.pagination.el && t.pagination.$el && 0 !== t.pagination.$el.length) {
                        var a, i = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length,
                            s = t.pagination.$el,
                            n = t.params.loop ? Math.ceil((i - 2 * t.loopedSlides) / t.params.slidesPerGroup) : t.snapGrid.length;
                        if (t.params.loop ? ((a = Math.ceil((t.activeIndex - t.loopedSlides) / t.params.slidesPerGroup)) > i - 1 - 2 * t.loopedSlides && (a -= i - 2 * t.loopedSlides), n - 1 < a && (a -= n), a < 0 && "bullets" !== t.params.paginationType && (a = n + a)) : a = void 0 !== t.snapIndex ? t.snapIndex : t.activeIndex || 0, "bullets" === r.type && t.pagination.bullets && 0 < t.pagination.bullets.length) {
                            var o, l, h, p = t.pagination.bullets;
                            if (r.dynamicBullets && (t.pagination.bulletSize = p.eq(0)[t.isHorizontal() ? "outerWidth" : "outerHeight"](!0), s.css(t.isHorizontal() ? "width" : "height", t.pagination.bulletSize * (r.dynamicMainBullets + 4) + "px"), 1 < r.dynamicMainBullets && void 0 !== t.previousIndex && (t.pagination.dynamicBulletIndex += a - t.previousIndex, t.pagination.dynamicBulletIndex > r.dynamicMainBullets - 1 ? t.pagination.dynamicBulletIndex = r.dynamicMainBullets - 1 : t.pagination.dynamicBulletIndex < 0 && (t.pagination.dynamicBulletIndex = 0)), o = a - t.pagination.dynamicBulletIndex, h = ((l = o + (Math.min(p.length, r.dynamicMainBullets) - 1)) + o) / 2), p.removeClass(r.bulletActiveClass + " " + r.bulletActiveClass + "-next " + r.bulletActiveClass + "-next-next " + r.bulletActiveClass + "-prev " + r.bulletActiveClass + "-prev-prev " + r.bulletActiveClass + "-main"), 1 < s.length) p.each(function(t, e) {
                                var i = D(e),
                                    s = i.index();
                                s === a && i.addClass(r.bulletActiveClass), r.dynamicBullets && (o <= s && s <= l && i.addClass(r.bulletActiveClass + "-main"), s === o && i.prev().addClass(r.bulletActiveClass + "-prev").prev().addClass(r.bulletActiveClass + "-prev-prev"), s === l && i.next().addClass(r.bulletActiveClass + "-next").next().addClass(r.bulletActiveClass + "-next-next"))
                            });
                            else if (p.eq(a).addClass(r.bulletActiveClass), r.dynamicBullets) {
                                for (var d = p.eq(o), c = p.eq(l), f = o; f <= l; f += 1) p.eq(f).addClass(r.bulletActiveClass + "-main");
                                d.prev().addClass(r.bulletActiveClass + "-prev").prev().addClass(r.bulletActiveClass + "-prev-prev"), c.next().addClass(r.bulletActiveClass + "-next").next().addClass(r.bulletActiveClass + "-next-next")
                            }
                            if (r.dynamicBullets) {
                                var u = Math.min(p.length, r.dynamicMainBullets + 4),
                                    m = (t.pagination.bulletSize * u - t.pagination.bulletSize) / 2 - h * t.pagination.bulletSize,
                                    g = e ? "right" : "left";
                                p.css(t.isHorizontal() ? g : "top", m + "px")
                            }
                        }
                        if ("fraction" === r.type && (s.find("." + r.currentClass).text(r.formatFractionCurrent(a + 1)), s.find("." + r.totalClass).text(r.formatFractionTotal(n))), "progressbar" === r.type) {
                            var v;
                            v = r.progressbarOpposite ? t.isHorizontal() ? "vertical" : "horizontal" : t.isHorizontal() ? "horizontal" : "vertical";
                            var y = (a + 1) / n,
                                _ = 1,
                                b = 1;
                            "horizontal" === v ? _ = y : b = y, s.find("." + r.progressbarFillClass).transform("translate3d(0,0,0) scaleX(" + _ + ") scaleY(" + b + ")").transition(t.params.speed)
                        }
                        "custom" === r.type && r.renderCustom ? (s.html(r.renderCustom(t, a + 1, n)), t.emit("paginationRender", t, s[0])) : t.emit("paginationUpdate", t, s[0]), s[t.params.watchOverflow && t.isLocked ? "addClass" : "removeClass"](r.lockClass)
                    }
                },
                render: function() {
                    var t = this,
                        e = t.params.pagination;
                    if (e.el && t.pagination.el && t.pagination.$el && 0 !== t.pagination.$el.length) {
                        var i = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length,
                            s = t.pagination.$el,
                            r = "";
                        if ("bullets" === e.type) {
                            for (var a = t.params.loop ? Math.ceil((i - 2 * t.loopedSlides) / t.params.slidesPerGroup) : t.snapGrid.length, n = 0; n < a; n += 1) e.renderBullet ? r += e.renderBullet.call(t, n, e.bulletClass) : r += "<" + e.bulletElement + ' class="' + e.bulletClass + '"></' + e.bulletElement + ">";
                            s.html(r), t.pagination.bullets = s.find("." + e.bulletClass)
                        }
                        "fraction" === e.type && (r = e.renderFraction ? e.renderFraction.call(t, e.currentClass, e.totalClass) : '<span class="' + e.currentClass + '"></span> / <span class="' + e.totalClass + '"></span>', s.html(r)), "progressbar" === e.type && (r = e.renderProgressbar ? e.renderProgressbar.call(t, e.progressbarFillClass) : '<span class="' + e.progressbarFillClass + '"></span>', s.html(r)), "custom" !== e.type && t.emit("paginationRender", t.pagination.$el[0])
                    }
                },
                init: function() {
                    var i = this,
                        t = i.params.pagination;
                    if (t.el) {
                        var e = D(t.el);
                        0 !== e.length && (i.params.uniqueNavElements && "string" == typeof t.el && 1 < e.length && 1 === i.$el.find(t.el).length && (e = i.$el.find(t.el)), "bullets" === t.type && t.clickable && e.addClass(t.clickableClass), e.addClass(t.modifierClass + t.type), "bullets" === t.type && t.dynamicBullets && (e.addClass("" + t.modifierClass + t.type + "-dynamic"), i.pagination.dynamicBulletIndex = 0, t.dynamicMainBullets < 1 && (t.dynamicMainBullets = 1)), "progressbar" === t.type && t.progressbarOpposite && e.addClass(t.progressbarOppositeClass), t.clickable && e.on("click", "." + t.bulletClass, function(t) {
                            t.preventDefault();
                            var e = D(this).index() * i.params.slidesPerGroup;
                            i.params.loop && (e += i.loopedSlides), i.slideTo(e)
                        }), H.extend(i.pagination, {
                            $el: e,
                            el: e[0]
                        }))
                    }
                },
                destroy: function() {
                    var t = this.params.pagination;
                    if (t.el && this.pagination.el && this.pagination.$el && 0 !== this.pagination.$el.length) {
                        var e = this.pagination.$el;
                        e.removeClass(t.hiddenClass), e.removeClass(t.modifierClass + t.type), this.pagination.bullets && this.pagination.bullets.removeClass(t.bulletActiveClass), t.clickable && e.off("click", "." + t.bulletClass)
                    }
                }
            },
            V = {
                setTranslate: function() {
                    if (this.params.scrollbar.el && this.scrollbar.el) {
                        var t = this.scrollbar,
                            e = this.rtlTranslate,
                            i = this.progress,
                            s = t.dragSize,
                            r = t.trackSize,
                            a = t.$dragEl,
                            n = t.$el,
                            o = this.params.scrollbar,
                            l = s,
                            h = (r - s) * i;
                        e ? 0 < (h = -h) ? (l = s - h, h = 0) : r < -h + s && (l = r + h) : h < 0 ? (l = s + h, h = 0) : r < h + s && (l = r - h), this.isHorizontal() ? ($.transforms3d ? a.transform("translate3d(" + h + "px, 0, 0)") : a.transform("translateX(" + h + "px)"), a[0].style.width = l + "px") : ($.transforms3d ? a.transform("translate3d(0px, " + h + "px, 0)") : a.transform("translateY(" + h + "px)"), a[0].style.height = l + "px"), o.hide && (clearTimeout(this.scrollbar.timeout), n[0].style.opacity = 1, this.scrollbar.timeout = setTimeout(function() {
                            n[0].style.opacity = 0, n.transition(400)
                        }, 1e3))
                    }
                },
                setTransition: function(t) {
                    this.params.scrollbar.el && this.scrollbar.el && this.scrollbar.$dragEl.transition(t)
                },
                updateSize: function() {
                    var t = this;
                    if (t.params.scrollbar.el && t.scrollbar.el) {
                        var e = t.scrollbar,
                            i = e.$dragEl,
                            s = e.$el;
                        i[0].style.width = "", i[0].style.height = "";
                        var r, a = t.isHorizontal() ? s[0].offsetWidth : s[0].offsetHeight,
                            n = t.size / t.virtualSize,
                            o = n * (a / t.size);
                        r = "auto" === t.params.scrollbar.dragSize ? a * n : parseInt(t.params.scrollbar.dragSize, 10), t.isHorizontal() ? i[0].style.width = r + "px" : i[0].style.height = r + "px", s[0].style.display = 1 <= n ? "none" : "", t.params.scrollbarHide && (s[0].style.opacity = 0), H.extend(e, {
                            trackSize: a,
                            divider: n,
                            moveDivider: o,
                            dragSize: r
                        }), e.$el[t.params.watchOverflow && t.isLocked ? "addClass" : "removeClass"](t.params.scrollbar.lockClass)
                    }
                },
                setDragPosition: function(t) {
                    var e, i = this,
                        s = i.scrollbar,
                        r = i.rtlTranslate,
                        a = s.$el,
                        n = s.dragSize,
                        o = s.trackSize;
                    e = ((i.isHorizontal() ? "touchstart" === t.type || "touchmove" === t.type ? t.targetTouches[0].pageX : t.pageX || t.clientX : "touchstart" === t.type || "touchmove" === t.type ? t.targetTouches[0].pageY : t.pageY || t.clientY) - a.offset()[i.isHorizontal() ? "left" : "top"] - n / 2) / (o - n), e = Math.max(Math.min(e, 1), 0), r && (e = 1 - e);
                    var l = i.minTranslate() + (i.maxTranslate() - i.minTranslate()) * e;
                    i.updateProgress(l), i.setTranslate(l), i.updateActiveIndex(), i.updateSlidesClasses()
                },
                onDragStart: function(t) {
                    var e = this.params.scrollbar,
                        i = this.scrollbar,
                        s = this.$wrapperEl,
                        r = i.$el,
                        a = i.$dragEl;
                    this.scrollbar.isTouched = !0, t.preventDefault(), t.stopPropagation(), s.transition(100), a.transition(100), i.setDragPosition(t), clearTimeout(this.scrollbar.dragTimeout), r.transition(0), e.hide && r.css("opacity", 1), this.emit("scrollbarDragStart", t)
                },
                onDragMove: function(t) {
                    var e = this.scrollbar,
                        i = this.$wrapperEl,
                        s = e.$el,
                        r = e.$dragEl;
                    this.scrollbar.isTouched && (t.preventDefault ? t.preventDefault() : t.returnValue = !1, e.setDragPosition(t), i.transition(0), s.transition(0), r.transition(0), this.emit("scrollbarDragMove", t))
                },
                onDragEnd: function(t) {
                    var e = this.params.scrollbar,
                        i = this.scrollbar.$el;
                    this.scrollbar.isTouched && (this.scrollbar.isTouched = !1, e.hide && (clearTimeout(this.scrollbar.dragTimeout), this.scrollbar.dragTimeout = H.nextTick(function() {
                        i.css("opacity", 0), i.transition(400)
                    }, 1e3)), this.emit("scrollbarDragEnd", t), e.snapOnRelease && this.slideToClosest())
                },
                enableDraggable: function() {
                    var t = this;
                    if (t.params.scrollbar.el) {
                        var e = t.scrollbar,
                            i = t.touchEventsTouch,
                            s = t.touchEventsDesktop,
                            r = t.params,
                            a = e.$el[0],
                            n = !(!$.passiveListener || !r.passiveListeners) && {
                                passive: !1,
                                capture: !1
                            },
                            o = !(!$.passiveListener || !r.passiveListeners) && {
                                passive: !0,
                                capture: !1
                            };
                        $.touch ? (a.addEventListener(i.start, t.scrollbar.onDragStart, n), a.addEventListener(i.move, t.scrollbar.onDragMove, n), a.addEventListener(i.end, t.scrollbar.onDragEnd, o)) : (a.addEventListener(s.start, t.scrollbar.onDragStart, n), m.addEventListener(s.move, t.scrollbar.onDragMove, n), m.addEventListener(s.end, t.scrollbar.onDragEnd, o))
                    }
                },
                disableDraggable: function() {
                    var t = this;
                    if (t.params.scrollbar.el) {
                        var e = t.scrollbar,
                            i = t.touchEventsTouch,
                            s = t.touchEventsDesktop,
                            r = t.params,
                            a = e.$el[0],
                            n = !(!$.passiveListener || !r.passiveListeners) && {
                                passive: !1,
                                capture: !1
                            },
                            o = !(!$.passiveListener || !r.passiveListeners) && {
                                passive: !0,
                                capture: !1
                            };
                        $.touch ? (a.removeEventListener(i.start, t.scrollbar.onDragStart, n), a.removeEventListener(i.move, t.scrollbar.onDragMove, n), a.removeEventListener(i.end, t.scrollbar.onDragEnd, o)) : (a.removeEventListener(s.start, t.scrollbar.onDragStart, n), m.removeEventListener(s.move, t.scrollbar.onDragMove, n), m.removeEventListener(s.end, t.scrollbar.onDragEnd, o))
                    }
                },
                init: function() {
                    if (this.params.scrollbar.el) {
                        var t = this.scrollbar,
                            e = this.$el,
                            i = this.params.scrollbar,
                            s = D(i.el);
                        this.params.uniqueNavElements && "string" == typeof i.el && 1 < s.length && 1 === e.find(i.el).length && (s = e.find(i.el));
                        var r = s.find("." + this.params.scrollbar.dragClass);
                        0 === r.length && (r = D('<div class="' + this.params.scrollbar.dragClass + '"></div>'), s.append(r)), H.extend(t, {
                            $el: s,
                            el: s[0],
                            $dragEl: r,
                            dragEl: r[0]
                        }), i.draggable && t.enableDraggable()
                    }
                },
                destroy: function() {
                    this.scrollbar.disableDraggable()
                }
            },
            N = {
                setTransform: function(t, e) {
                    var i = this.rtl,
                        s = D(t),
                        r = i ? -1 : 1,
                        a = s.attr("data-swiper-parallax") || "0",
                        n = s.attr("data-swiper-parallax-x"),
                        o = s.attr("data-swiper-parallax-y"),
                        l = s.attr("data-swiper-parallax-scale"),
                        h = s.attr("data-swiper-parallax-opacity");
                    if (n || o ? (n = n || "0", o = o || "0") : this.isHorizontal() ? (n = a, o = "0") : (o = a, n = "0"), n = 0 <= n.indexOf("%") ? parseInt(n, 10) * e * r + "%" : n * e * r + "px", o = 0 <= o.indexOf("%") ? parseInt(o, 10) * e + "%" : o * e + "px", null != h) {
                        var p = h - (h - 1) * (1 - Math.abs(e));
                        s[0].style.opacity = p
                    }
                    if (null == l) s.transform("translate3d(" + n + ", " + o + ", 0px)");
                    else {
                        var d = l - (l - 1) * (1 - Math.abs(e));
                        s.transform("translate3d(" + n + ", " + o + ", 0px) scale(" + d + ")")
                    }
                },
                setTranslate: function() {
                    var s = this,
                        t = s.$el,
                        e = s.slides,
                        r = s.progress,
                        a = s.snapGrid;
                    t.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(t, e) {
                        s.parallax.setTransform(e, r)
                    }), e.each(function(t, e) {
                        var i = e.progress;
                        1 < s.params.slidesPerGroup && "auto" !== s.params.slidesPerView && (i += Math.ceil(t / 2) - r * (a.length - 1)), i = Math.min(Math.max(i, -1), 1), D(e).find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(t, e) {
                            s.parallax.setTransform(e, i)
                        })
                    })
                },
                setTransition: function(r) {
                    void 0 === r && (r = this.params.speed), this.$el.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(t, e) {
                        var i = D(e),
                            s = parseInt(i.attr("data-swiper-parallax-duration"), 10) || r;
                        0 === r && (s = 0), i.transition(s)
                    })
                }
            },
            j = {
                getDistanceBetweenTouches: function(t) {
                    if (t.targetTouches.length < 2) return 1;
                    var e = t.targetTouches[0].pageX,
                        i = t.targetTouches[0].pageY,
                        s = t.targetTouches[1].pageX,
                        r = t.targetTouches[1].pageY;
                    return Math.sqrt(Math.pow(s - e, 2) + Math.pow(r - i, 2))
                },
                onGestureStart: function(t) {
                    var e = this.params.zoom,
                        i = this.zoom,
                        s = i.gesture;
                    if (i.fakeGestureTouched = !1, i.fakeGestureMoved = !1, !$.gestures) {
                        if ("touchstart" !== t.type || "touchstart" === t.type && t.targetTouches.length < 2) return;
                        i.fakeGestureTouched = !0, s.scaleStart = j.getDistanceBetweenTouches(t)
                    }
                    s.$slideEl && s.$slideEl.length || (s.$slideEl = D(t.target).closest(".swiper-slide"), 0 === s.$slideEl.length && (s.$slideEl = this.slides.eq(this.activeIndex)), s.$imageEl = s.$slideEl.find("img, svg, canvas"), s.$imageWrapEl = s.$imageEl.parent("." + e.containerClass), s.maxRatio = s.$imageWrapEl.attr("data-swiper-zoom") || e.maxRatio, 0 !== s.$imageWrapEl.length) ? (s.$imageEl.transition(0), this.zoom.isScaling = !0) : s.$imageEl = void 0
                },
                onGestureChange: function(t) {
                    var e = this.params.zoom,
                        i = this.zoom,
                        s = i.gesture;
                    if (!$.gestures) {
                        if ("touchmove" !== t.type || "touchmove" === t.type && t.targetTouches.length < 2) return;
                        i.fakeGestureMoved = !0, s.scaleMove = j.getDistanceBetweenTouches(t)
                    }
                    s.$imageEl && 0 !== s.$imageEl.length && ($.gestures ? this.zoom.scale = t.scale * i.currentScale : i.scale = s.scaleMove / s.scaleStart * i.currentScale, i.scale > s.maxRatio && (i.scale = s.maxRatio - 1 + Math.pow(i.scale - s.maxRatio + 1, .5)), i.scale < e.minRatio && (i.scale = e.minRatio + 1 - Math.pow(e.minRatio - i.scale + 1, .5)), s.$imageEl.transform("translate3d(0,0,0) scale(" + i.scale + ")"))
                },
                onGestureEnd: function(t) {
                    var e = this.params.zoom,
                        i = this.zoom,
                        s = i.gesture;
                    if (!$.gestures) {
                        if (!i.fakeGestureTouched || !i.fakeGestureMoved) return;
                        if ("touchend" !== t.type || "touchend" === t.type && t.changedTouches.length < 2 && !u.android) return;
                        i.fakeGestureTouched = !1, i.fakeGestureMoved = !1
                    }
                    s.$imageEl && 0 !== s.$imageEl.length && (i.scale = Math.max(Math.min(i.scale, s.maxRatio), e.minRatio), s.$imageEl.transition(this.params.speed).transform("translate3d(0,0,0) scale(" + i.scale + ")"), i.currentScale = i.scale, i.isScaling = !1, 1 === i.scale && (s.$slideEl = void 0))
                },
                onTouchStart: function(t) {
                    var e = this.zoom,
                        i = e.gesture,
                        s = e.image;
                    i.$imageEl && 0 !== i.$imageEl.length && (s.isTouched || (u.android && t.preventDefault(), s.isTouched = !0, s.touchesStart.x = "touchstart" === t.type ? t.targetTouches[0].pageX : t.pageX, s.touchesStart.y = "touchstart" === t.type ? t.targetTouches[0].pageY : t.pageY))
                },
                onTouchMove: function(t) {
                    var e = this.zoom,
                        i = e.gesture,
                        s = e.image,
                        r = e.velocity;
                    if (i.$imageEl && 0 !== i.$imageEl.length && (this.allowClick = !1, s.isTouched && i.$slideEl)) {
                        s.isMoved || (s.width = i.$imageEl[0].offsetWidth, s.height = i.$imageEl[0].offsetHeight, s.startX = H.getTranslate(i.$imageWrapEl[0], "x") || 0, s.startY = H.getTranslate(i.$imageWrapEl[0], "y") || 0, i.slideWidth = i.$slideEl[0].offsetWidth, i.slideHeight = i.$slideEl[0].offsetHeight, i.$imageWrapEl.transition(0), this.rtl && (s.startX = -s.startX, s.startY = -s.startY));
                        var a = s.width * e.scale,
                            n = s.height * e.scale;
                        if (!(a < i.slideWidth && n < i.slideHeight)) {
                            if (s.minX = Math.min(i.slideWidth / 2 - a / 2, 0), s.maxX = -s.minX, s.minY = Math.min(i.slideHeight / 2 - n / 2, 0), s.maxY = -s.minY, s.touchesCurrent.x = "touchmove" === t.type ? t.targetTouches[0].pageX : t.pageX, s.touchesCurrent.y = "touchmove" === t.type ? t.targetTouches[0].pageY : t.pageY, !s.isMoved && !e.isScaling) {
                                if (this.isHorizontal() && (Math.floor(s.minX) === Math.floor(s.startX) && s.touchesCurrent.x < s.touchesStart.x || Math.floor(s.maxX) === Math.floor(s.startX) && s.touchesCurrent.x > s.touchesStart.x)) return void(s.isTouched = !1);
                                if (!this.isHorizontal() && (Math.floor(s.minY) === Math.floor(s.startY) && s.touchesCurrent.y < s.touchesStart.y || Math.floor(s.maxY) === Math.floor(s.startY) && s.touchesCurrent.y > s.touchesStart.y)) return void(s.isTouched = !1)
                            }
                            t.preventDefault(), t.stopPropagation(), s.isMoved = !0, s.currentX = s.touchesCurrent.x - s.touchesStart.x + s.startX, s.currentY = s.touchesCurrent.y - s.touchesStart.y + s.startY, s.currentX < s.minX && (s.currentX = s.minX + 1 - Math.pow(s.minX - s.currentX + 1, .8)), s.currentX > s.maxX && (s.currentX = s.maxX - 1 + Math.pow(s.currentX - s.maxX + 1, .8)), s.currentY < s.minY && (s.currentY = s.minY + 1 - Math.pow(s.minY - s.currentY + 1, .8)), s.currentY > s.maxY && (s.currentY = s.maxY - 1 + Math.pow(s.currentY - s.maxY + 1, .8)), r.prevPositionX || (r.prevPositionX = s.touchesCurrent.x), r.prevPositionY || (r.prevPositionY = s.touchesCurrent.y), r.prevTime || (r.prevTime = Date.now()), r.x = (s.touchesCurrent.x - r.prevPositionX) / (Date.now() - r.prevTime) / 2, r.y = (s.touchesCurrent.y - r.prevPositionY) / (Date.now() - r.prevTime) / 2, Math.abs(s.touchesCurrent.x - r.prevPositionX) < 2 && (r.x = 0), Math.abs(s.touchesCurrent.y - r.prevPositionY) < 2 && (r.y = 0), r.prevPositionX = s.touchesCurrent.x, r.prevPositionY = s.touchesCurrent.y, r.prevTime = Date.now(), i.$imageWrapEl.transform("translate3d(" + s.currentX + "px, " + s.currentY + "px,0)")
                        }
                    }
                },
                onTouchEnd: function() {
                    var t = this.zoom,
                        e = t.gesture,
                        i = t.image,
                        s = t.velocity;
                    if (e.$imageEl && 0 !== e.$imageEl.length) {
                        if (!i.isTouched || !i.isMoved) return i.isTouched = !1, void(i.isMoved = !1);
                        i.isTouched = !1, i.isMoved = !1;
                        var r = 300,
                            a = 300,
                            n = s.x * r,
                            o = i.currentX + n,
                            l = s.y * a,
                            h = i.currentY + l;
                        0 !== s.x && (r = Math.abs((o - i.currentX) / s.x)), 0 !== s.y && (a = Math.abs((h - i.currentY) / s.y));
                        var p = Math.max(r, a);
                        i.currentX = o, i.currentY = h;
                        var d = i.width * t.scale,
                            c = i.height * t.scale;
                        i.minX = Math.min(e.slideWidth / 2 - d / 2, 0), i.maxX = -i.minX, i.minY = Math.min(e.slideHeight / 2 - c / 2, 0), i.maxY = -i.minY, i.currentX = Math.max(Math.min(i.currentX, i.maxX), i.minX), i.currentY = Math.max(Math.min(i.currentY, i.maxY), i.minY), e.$imageWrapEl.transition(p).transform("translate3d(" + i.currentX + "px, " + i.currentY + "px,0)")
                    }
                },
                onTransitionEnd: function() {
                    var t = this.zoom,
                        e = t.gesture;
                    e.$slideEl && this.previousIndex !== this.activeIndex && (e.$imageEl.transform("translate3d(0,0,0) scale(1)"), e.$imageWrapEl.transform("translate3d(0,0,0)"), e.$slideEl = void 0, e.$imageEl = void 0, e.$imageWrapEl = void 0, t.scale = 1, t.currentScale = 1)
                },
                toggle: function(t) {
                    var e = this.zoom;
                    e.scale && 1 !== e.scale ? e.out() : e.in(t)
                },
                in: function(t) {
                    var e, i, s, r, a, n, o, l, h, p, d, c, f, u, m, g, v = this.zoom,
                        y = this.params.zoom,
                        _ = v.gesture,
                        b = v.image;
                    _.$slideEl || (_.$slideEl = this.clickedSlide ? D(this.clickedSlide) : this.slides.eq(this.activeIndex), _.$imageEl = _.$slideEl.find("img, svg, canvas"), _.$imageWrapEl = _.$imageEl.parent("." + y.containerClass)), _.$imageEl && 0 !== _.$imageEl.length && (_.$slideEl.addClass("" + y.zoomedSlideClass), i = void 0 === b.touchesStart.x && t ? (e = "touchend" === t.type ? t.changedTouches[0].pageX : t.pageX, "touchend" === t.type ? t.changedTouches[0].pageY : t.pageY) : (e = b.touchesStart.x, b.touchesStart.y), v.scale = _.$imageWrapEl.attr("data-swiper-zoom") || y.maxRatio, v.currentScale = _.$imageWrapEl.attr("data-swiper-zoom") || y.maxRatio, t ? (m = _.$slideEl[0].offsetWidth, g = _.$slideEl[0].offsetHeight, s = _.$slideEl.offset().left + m / 2 - e, r = _.$slideEl.offset().top + g / 2 - i, o = _.$imageEl[0].offsetWidth, l = _.$imageEl[0].offsetHeight, h = o * v.scale, p = l * v.scale, f = -(d = Math.min(m / 2 - h / 2, 0)), u = -(c = Math.min(g / 2 - p / 2, 0)), (a = s * v.scale) < d && (a = d), f < a && (a = f), (n = r * v.scale) < c && (n = c), u < n && (n = u)) : n = a = 0, _.$imageWrapEl.transition(300).transform("translate3d(" + a + "px, " + n + "px,0)"), _.$imageEl.transition(300).transform("translate3d(0,0,0) scale(" + v.scale + ")"))
                },
                out: function() {
                    var t = this.zoom,
                        e = this.params.zoom,
                        i = t.gesture;
                    i.$slideEl || (i.$slideEl = this.clickedSlide ? D(this.clickedSlide) : this.slides.eq(this.activeIndex), i.$imageEl = i.$slideEl.find("img, svg, canvas"), i.$imageWrapEl = i.$imageEl.parent("." + e.containerClass)), i.$imageEl && 0 !== i.$imageEl.length && (t.scale = 1, t.currentScale = 1, i.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"), i.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"), i.$slideEl.removeClass("" + e.zoomedSlideClass), i.$slideEl = void 0)
                },
                enable: function() {
                    var t = this,
                        e = t.zoom;
                    if (!e.enabled) {
                        e.enabled = !0;
                        var i = !("touchstart" !== t.touchEvents.start || !$.passiveListener || !t.params.passiveListeners) && {
                            passive: !0,
                            capture: !1
                        };
                        $.gestures ? (t.$wrapperEl.on("gesturestart", ".swiper-slide", e.onGestureStart, i), t.$wrapperEl.on("gesturechange", ".swiper-slide", e.onGestureChange, i), t.$wrapperEl.on("gestureend", ".swiper-slide", e.onGestureEnd, i)) : "touchstart" === t.touchEvents.start && (t.$wrapperEl.on(t.touchEvents.start, ".swiper-slide", e.onGestureStart, i), t.$wrapperEl.on(t.touchEvents.move, ".swiper-slide", e.onGestureChange, i), t.$wrapperEl.on(t.touchEvents.end, ".swiper-slide", e.onGestureEnd, i)), t.$wrapperEl.on(t.touchEvents.move, "." + t.params.zoom.containerClass, e.onTouchMove)
                    }
                },
                disable: function() {
                    var t = this,
                        e = t.zoom;
                    if (e.enabled) {
                        t.zoom.enabled = !1;
                        var i = !("touchstart" !== t.touchEvents.start || !$.passiveListener || !t.params.passiveListeners) && {
                            passive: !0,
                            capture: !1
                        };
                        $.gestures ? (t.$wrapperEl.off("gesturestart", ".swiper-slide", e.onGestureStart, i), t.$wrapperEl.off("gesturechange", ".swiper-slide", e.onGestureChange, i), t.$wrapperEl.off("gestureend", ".swiper-slide", e.onGestureEnd, i)) : "touchstart" === t.touchEvents.start && (t.$wrapperEl.off(t.touchEvents.start, ".swiper-slide", e.onGestureStart, i), t.$wrapperEl.off(t.touchEvents.move, ".swiper-slide", e.onGestureChange, i), t.$wrapperEl.off(t.touchEvents.end, ".swiper-slide", e.onGestureEnd, i)), t.$wrapperEl.off(t.touchEvents.move, "." + t.params.zoom.containerClass, e.onTouchMove)
                    }
                }
            },
            X = {
                loadInSlide: function(t, l) {
                    void 0 === l && (l = !0);
                    var h = this,
                        p = h.params.lazy;
                    if (void 0 !== t && 0 !== h.slides.length) {
                        var d = h.virtual && h.params.virtual.enabled ? h.$wrapperEl.children("." + h.params.slideClass + '[data-swiper-slide-index="' + t + '"]') : h.slides.eq(t),
                            e = d.find("." + p.elementClass + ":not(." + p.loadedClass + "):not(." + p.loadingClass + ")");
                        !d.hasClass(p.elementClass) || d.hasClass(p.loadedClass) || d.hasClass(p.loadingClass) || (e = e.add(d[0])), 0 !== e.length && e.each(function(t, e) {
                            var s = D(e);
                            s.addClass(p.loadingClass);
                            var r = s.attr("data-background"),
                                a = s.attr("data-src"),
                                n = s.attr("data-srcset"),
                                o = s.attr("data-sizes");
                            h.loadImage(s[0], a || r, n, o, !1, function() {
                                if (null != h && h && (!h || h.params) && !h.destroyed) {
                                    if (r ? (s.css("background-image", 'url("' + r + '")'), s.removeAttr("data-background")) : (n && (s.attr("srcset", n), s.removeAttr("data-srcset")), o && (s.attr("sizes", o), s.removeAttr("data-sizes")), a && (s.attr("src", a), s.removeAttr("data-src"))), s.addClass(p.loadedClass).removeClass(p.loadingClass), d.find("." + p.preloaderClass).remove(), h.params.loop && l) {
                                        var t = d.attr("data-swiper-slide-index");
                                        if (d.hasClass(h.params.slideDuplicateClass)) {
                                            var e = h.$wrapperEl.children('[data-swiper-slide-index="' + t + '"]:not(.' + h.params.slideDuplicateClass + ")");
                                            h.lazy.loadInSlide(e.index(), !1)
                                        } else {
                                            var i = h.$wrapperEl.children("." + h.params.slideDuplicateClass + '[data-swiper-slide-index="' + t + '"]');
                                            h.lazy.loadInSlide(i.index(), !1)
                                        }
                                    }
                                    h.emit("lazyImageReady", d[0], s[0])
                                }
                            }), h.emit("lazyImageLoad", d[0], s[0])
                        })
                    }
                },
                load: function() {
                    var s = this,
                        e = s.$wrapperEl,
                        i = s.params,
                        r = s.slides,
                        t = s.activeIndex,
                        a = s.virtual && i.virtual.enabled,
                        n = i.lazy,
                        o = i.slidesPerView;
                    function l(t) {
                        if (a) {
                            if (e.children("." + i.slideClass + '[data-swiper-slide-index="' + t + '"]').length) return !0
                        } else if (r[t]) return !0;
                        return !1
                    }
                    function h(t) {
                        return a ? D(t).attr("data-swiper-slide-index") : D(t).index()
                    }
                    if ("auto" === o && (o = 0), s.lazy.initialImageLoaded || (s.lazy.initialImageLoaded = !0), s.params.watchSlidesVisibility) e.children("." + i.slideVisibleClass).each(function(t, e) {
                        var i = a ? D(e).attr("data-swiper-slide-index") : D(e).index();
                        s.lazy.loadInSlide(i)
                    });
                    else if (1 < o)
                        for (var p = t; p < t + o; p += 1) l(p) && s.lazy.loadInSlide(p);
                    else s.lazy.loadInSlide(t);
                    if (n.loadPrevNext)
                        if (1 < o || n.loadPrevNextAmount && 1 < n.loadPrevNextAmount) {
                            for (var d = n.loadPrevNextAmount, c = o, f = Math.min(t + c + Math.max(d, c), r.length), u = Math.max(t - Math.max(c, d), 0), m = t + o; m < f; m += 1) l(m) && s.lazy.loadInSlide(m);
                            for (var g = u; g < t; g += 1) l(g) && s.lazy.loadInSlide(g)
                        } else {
                            var v = e.children("." + i.slideNextClass);
                            0 < v.length && s.lazy.loadInSlide(h(v));
                            var y = e.children("." + i.slidePrevClass);
                            0 < y.length && s.lazy.loadInSlide(h(y))
                        }
                }
            },
            Y = {
                LinearSpline: function(t, e) {
                    var i, s, r, a, n;
                    return this.x = t, this.y = e, this.lastIndex = t.length - 1, this.interpolate = function(t) {
                        return t ? (n = function(t, e) {
                            for (s = -1, i = t.length; 1 < i - s;) t[r = i + s >> 1] <= e ? s = r : i = r;
                            return i
                        }(this.x, t), a = n - 1, (t - this.x[a]) * (this.y[n] - this.y[a]) / (this.x[n] - this.x[a]) + this.y[a]) : 0
                    }, this
                },
                getInterpolateFunction: function(t) {
                    this.controller.spline || (this.controller.spline = this.params.loop ? new Y.LinearSpline(this.slidesGrid, t.slidesGrid) : new Y.LinearSpline(this.snapGrid, t.snapGrid))
                },
                setTranslate: function(t, e) {
                    var i, s, r = this,
                        a = r.controller.control;
                    function n(t) {
                        var e = r.rtlTranslate ? -r.translate : r.translate;
                        "slide" === r.params.controller.by && (r.controller.getInterpolateFunction(t), s = -r.controller.spline.interpolate(-e)), s && "container" !== r.params.controller.by || (i = (t.maxTranslate() - t.minTranslate()) / (r.maxTranslate() - r.minTranslate()), s = (e - r.minTranslate()) * i + t.minTranslate()), r.params.controller.inverse && (s = t.maxTranslate() - s), t.updateProgress(s), t.setTranslate(s, r), t.updateActiveIndex(), t.updateSlidesClasses()
                    }
                    if (Array.isArray(a))
                        for (var o = 0; o < a.length; o += 1) a[o] !== e && a[o] instanceof w && n(a[o]);
                    else a instanceof w && e !== a && n(a)
                },
                setTransition: function(e, t) {
                    var i, s = this,
                        r = s.controller.control;
                    function a(t) {
                        t.setTransition(e, s), 0 !== e && (t.transitionStart(), t.params.autoHeight && H.nextTick(function() {
                            t.updateAutoHeight()
                        }), t.$wrapperEl.transitionEnd(function() {
                            r && (t.params.loop && "slide" === s.params.controller.by && t.loopFix(), t.transitionEnd())
                        }))
                    }
                    if (Array.isArray(r))
                        for (i = 0; i < r.length; i += 1) r[i] !== t && r[i] instanceof w && a(r[i]);
                    else r instanceof w && t !== r && a(r)
                }
            },
            q = {
                makeElFocusable: function(t) {
                    return t.attr("tabIndex", "0"), t
                },
                addElRole: function(t, e) {
                    return t.attr("role", e), t
                },
                addElLabel: function(t, e) {
                    return t.attr("aria-label", e), t
                },
                disableEl: function(t) {
                    return t.attr("aria-disabled", !0), t
                },
                enableEl: function(t) {
                    return t.attr("aria-disabled", !1), t
                },
                onEnterKey: function(t) {
                    var e = this,
                        i = e.params.a11y;
                    if (13 === t.keyCode) {
                        var s = D(t.target);
                        e.navigation && e.navigation.$nextEl && s.is(e.navigation.$nextEl) && (e.isEnd && !e.params.loop || e.slideNext(), e.isEnd ? e.a11y.notify(i.lastSlideMessage) : e.a11y.notify(i.nextSlideMessage)), e.navigation && e.navigation.$prevEl && s.is(e.navigation.$prevEl) && (e.isBeginning && !e.params.loop || e.slidePrev(), e.isBeginning ? e.a11y.notify(i.firstSlideMessage) : e.a11y.notify(i.prevSlideMessage)), e.pagination && s.is("." + e.params.pagination.bulletClass) && s[0].click()
                    }
                },
                notify: function(t) {
                    var e = this.a11y.liveRegion;
                    0 !== e.length && (e.html(""), e.html(t))
                },
                updateNavigation: function() {
                    if (!this.params.loop) {
                        var t = this.navigation,
                            e = t.$nextEl,
                            i = t.$prevEl;
                        i && 0 < i.length && (this.isBeginning ? this.a11y.disableEl(i) : this.a11y.enableEl(i)), e && 0 < e.length && (this.isEnd ? this.a11y.disableEl(e) : this.a11y.enableEl(e))
                    }
                },
                updatePagination: function() {
                    var s = this,
                        r = s.params.a11y;
                    s.pagination && s.params.pagination.clickable && s.pagination.bullets && s.pagination.bullets.length && s.pagination.bullets.each(function(t, e) {
                        var i = D(e);
                        s.a11y.makeElFocusable(i), s.a11y.addElRole(i, "button"), s.a11y.addElLabel(i, r.paginationBulletMessage.replace(/{{index}}/, i.index() + 1))
                    })
                },
                init: function() {
                    var t = this;
                    t.$el.append(t.a11y.liveRegion);
                    var e, i, s = t.params.a11y;
                    t.navigation && t.navigation.$nextEl && (e = t.navigation.$nextEl), t.navigation && t.navigation.$prevEl && (i = t.navigation.$prevEl), e && (t.a11y.makeElFocusable(e), t.a11y.addElRole(e, "button"), t.a11y.addElLabel(e, s.nextSlideMessage), e.on("keydown", t.a11y.onEnterKey)), i && (t.a11y.makeElFocusable(i), t.a11y.addElRole(i, "button"), t.a11y.addElLabel(i, s.prevSlideMessage), i.on("keydown", t.a11y.onEnterKey)), t.pagination && t.params.pagination.clickable && t.pagination.bullets && t.pagination.bullets.length && t.pagination.$el.on("keydown", "." + t.params.pagination.bulletClass, t.a11y.onEnterKey)
                },
                destroy: function() {
                    var t, e, i = this;
                    i.a11y.liveRegion && 0 < i.a11y.liveRegion.length && i.a11y.liveRegion.remove(), i.navigation && i.navigation.$nextEl && (t = i.navigation.$nextEl), i.navigation && i.navigation.$prevEl && (e = i.navigation.$prevEl), t && t.off("keydown", i.a11y.onEnterKey), e && e.off("keydown", i.a11y.onEnterKey), i.pagination && i.params.pagination.clickable && i.pagination.bullets && i.pagination.bullets.length && i.pagination.$el.off("keydown", "." + i.params.pagination.bulletClass, i.a11y.onEnterKey)
                }
            },
            W = {
                init: function() {
                    if (this.params.history) {
                        if (!G.history || !G.history.pushState) return this.params.history.enabled = !1, void(this.params.hashNavigation.enabled = !0);
                        var t = this.history;
                        t.initialized = !0, t.paths = W.getPathValues(), (t.paths.key || t.paths.value) && (t.scrollToSlide(0, t.paths.value, this.params.runCallbacksOnInit), this.params.history.replaceState || G.addEventListener("popstate", this.history.setHistoryPopState))
                    }
                },
                destroy: function() {
                    this.params.history.replaceState || G.removeEventListener("popstate", this.history.setHistoryPopState)
                },
                setHistoryPopState: function() {
                    this.history.paths = W.getPathValues(), this.history.scrollToSlide(this.params.speed, this.history.paths.value, !1)
                },
                getPathValues: function() {
                    var t = G.location.pathname.slice(1).split("/").filter(function(t) {
                            return "" !== t
                        }),
                        e = t.length;
                    return {
                        key: t[e - 2],
                        value: t[e - 1]
                    }
                },
                setHistory: function(t, e) {
                    if (this.history.initialized && this.params.history.enabled) {
                        var i = this.slides.eq(e),
                            s = W.slugify(i.attr("data-history"));
                        G.location.pathname.includes(t) || (s = t + "/" + s);
                        var r = G.history.state;
                        r && r.value === s || (this.params.history.replaceState ? G.history.replaceState({
                            value: s
                        }, null, s) : G.history.pushState({
                            value: s
                        }, null, s))
                    }
                },
                slugify: function(t) {
                    return t.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "")
                },
                scrollToSlide: function(t, e, i) {
                    if (e)
                        for (var s = 0, r = this.slides.length; s < r; s += 1) {
                            var a = this.slides.eq(s);
                            if (W.slugify(a.attr("data-history")) === e && !a.hasClass(this.params.slideDuplicateClass)) {
                                var n = a.index();
                                this.slideTo(n, t, i)
                            }
                        } else this.slideTo(0, t, i)
                }
            },
            U = {
                onHashCange: function() {
                    var t = m.location.hash.replace("#", "");
                    if (t !== this.slides.eq(this.activeIndex).attr("data-hash")) {
                        var e = this.$wrapperEl.children("." + this.params.slideClass + '[data-hash="' + t + '"]').index();
                        if (void 0 === e) return;
                        this.slideTo(e)
                    }
                },
                setHash: function() {
                    if (this.hashNavigation.initialized && this.params.hashNavigation.enabled)
                        if (this.params.hashNavigation.replaceState && G.history && G.history.replaceState) G.history.replaceState(null, null, "#" + this.slides.eq(this.activeIndex).attr("data-hash") || "");
                        else {
                            var t = this.slides.eq(this.activeIndex),
                                e = t.attr("data-hash") || t.attr("data-history");
                            m.location.hash = e || ""
                        }
                },
                init: function() {
                    var t = this;
                    if (!(!t.params.hashNavigation.enabled || t.params.history && t.params.history.enabled)) {
                        t.hashNavigation.initialized = !0;
                        var e = m.location.hash.replace("#", "");
                        if (e)
                            for (var i = 0, s = t.slides.length; i < s; i += 1) {
                                var r = t.slides.eq(i);
                                if ((r.attr("data-hash") || r.attr("data-history")) === e && !r.hasClass(t.params.slideDuplicateClass)) {
                                    var a = r.index();
                                    t.slideTo(a, 0, t.params.runCallbacksOnInit, !0)
                                }
                            }
                        t.params.hashNavigation.watchState && D(G).on("hashchange", t.hashNavigation.onHashCange)
                    }
                },
                destroy: function() {
                    this.params.hashNavigation.watchState && D(G).off("hashchange", this.hashNavigation.onHashCange)
                }
            },
            K = {
                run: function() {
                    var t = this,
                        e = t.slides.eq(t.activeIndex),
                        i = t.params.autoplay.delay;
                    e.attr("data-swiper-autoplay") && (i = e.attr("data-swiper-autoplay") || t.params.autoplay.delay), t.autoplay.timeout = H.nextTick(function() {
                        t.params.autoplay.reverseDirection ? t.params.loop ? (t.loopFix(), t.slidePrev(t.params.speed, !0, !0), t.emit("autoplay")) : t.isBeginning ? t.params.autoplay.stopOnLastSlide ? t.autoplay.stop() : (t.slideTo(t.slides.length - 1, t.params.speed, !0, !0), t.emit("autoplay")) : (t.slidePrev(t.params.speed, !0, !0), t.emit("autoplay")) : t.params.loop ? (t.loopFix(), t.slideNext(t.params.speed, !0, !0), t.emit("autoplay")) : t.isEnd ? t.params.autoplay.stopOnLastSlide ? t.autoplay.stop() : (t.slideTo(0, t.params.speed, !0, !0), t.emit("autoplay")) : (t.slideNext(t.params.speed, !0, !0), t.emit("autoplay"))
                    }, i)
                },
                start: function() {
                    return void 0 === this.autoplay.timeout && !this.autoplay.running && (this.autoplay.running = !0, this.emit("autoplayStart"), this.autoplay.run(), !0)
                },
                stop: function() {
                    return !!this.autoplay.running && void 0 !== this.autoplay.timeout && (this.autoplay.timeout && (clearTimeout(this.autoplay.timeout), this.autoplay.timeout = void 0), this.autoplay.running = !1, this.emit("autoplayStop"), !0)
                },
                pause: function(t) {
                    var e = this;
                    e.autoplay.running && (e.autoplay.paused || (e.autoplay.timeout && clearTimeout(e.autoplay.timeout), e.autoplay.paused = !0, 0 !== t && e.params.autoplay.waitForTransition ? (e.$wrapperEl[0].addEventListener("transitionend", e.autoplay.onTransitionEnd), e.$wrapperEl[0].addEventListener("webkitTransitionEnd", e.autoplay.onTransitionEnd)) : (e.autoplay.paused = !1, e.autoplay.run())))
                }
            },
            Z = {
                setTranslate: function() {
                    for (var t = this.slides, e = 0; e < t.length; e += 1) {
                        var i = this.slides.eq(e),
                            s = -i[0].swiperSlideOffset;
                        this.params.virtualTranslate || (s -= this.translate);
                        var r = 0;
                        this.isHorizontal() || (r = s, s = 0);
                        var a = this.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(i[0].progress), 0) : 1 + Math.min(Math.max(i[0].progress, -1), 0);
                        i.css({
                            opacity: a
                        }).transform("translate3d(" + s + "px, " + r + "px, 0px)")
                    }
                },
                setTransition: function(t) {
                    var i = this,
                        e = i.slides,
                        s = i.$wrapperEl;
                    if (e.transition(t), i.params.virtualTranslate && 0 !== t) {
                        var r = !1;
                        e.transitionEnd(function() {
                            if (!r && i && !i.destroyed) {
                                r = !0, i.animating = !1;
                                for (var t = ["webkitTransitionEnd", "transitionend"], e = 0; e < t.length; e += 1) s.trigger(t[e])
                            }
                        })
                    }
                }
            },
            Q = {
                setTranslate: function() {
                    var t, e = this,
                        i = e.$el,
                        s = e.$wrapperEl,
                        r = e.slides,
                        a = e.width,
                        n = e.height,
                        o = e.rtlTranslate,
                        l = e.size,
                        h = e.params.cubeEffect,
                        p = e.isHorizontal(),
                        d = e.virtual && e.params.virtual.enabled,
                        c = 0;
                    h.shadow && (p ? (0 === (t = s.find(".swiper-cube-shadow")).length && (t = D('<div class="swiper-cube-shadow"></div>'), s.append(t)), t.css({
                        height: a + "px"
                    })) : 0 === (t = i.find(".swiper-cube-shadow")).length && (t = D('<div class="swiper-cube-shadow"></div>'), i.append(t)));
                    for (var f = 0; f < r.length; f += 1) {
                        var u = r.eq(f),
                            m = f;
                        d && (m = parseInt(u.attr("data-swiper-slide-index"), 10));
                        var g = 90 * m,
                            v = Math.floor(g / 360);
                        o && (g = -g, v = Math.floor(-g / 360));
                        var y = Math.max(Math.min(u[0].progress, 1), -1),
                            _ = 0,
                            b = 0,
                            x = 0;
                        m % 4 == 0 ? (_ = 4 * -v * l, x = 0) : (m - 1) % 4 == 0 ? (_ = 0, x = 4 * -v * l) : (m - 2) % 4 == 0 ? (_ = l + 4 * v * l, x = l) : (m - 3) % 4 == 0 && (_ = -l, x = 3 * l + 4 * l * v), o && (_ = -_), p || (b = _, _ = 0);
                        var T = "rotateX(" + (p ? 0 : -g) + "deg) rotateY(" + (p ? g : 0) + "deg) translate3d(" + _ + "px, " + b + "px, " + x + "px)";
                        if (y <= 1 && -1 < y && (c = 90 * m + 90 * y, o && (c = 90 * -m - 90 * y)), u.transform(T), h.slideShadows) {
                            var w = p ? u.find(".swiper-slide-shadow-left") : u.find(".swiper-slide-shadow-top"),
                                E = p ? u.find(".swiper-slide-shadow-right") : u.find(".swiper-slide-shadow-bottom");
                            0 === w.length && (w = D('<div class="swiper-slide-shadow-' + (p ? "left" : "top") + '"></div>'), u.append(w)), 0 === E.length && (E = D('<div class="swiper-slide-shadow-' + (p ? "right" : "bottom") + '"></div>'), u.append(E)), w.length && (w[0].style.opacity = Math.max(-y, 0)), E.length && (E[0].style.opacity = Math.max(y, 0))
                        }
                    }
                    if (s.css({
                            "-webkit-transform-origin": "50% 50% -" + l / 2 + "px",
                            "-moz-transform-origin": "50% 50% -" + l / 2 + "px",
                            "-ms-transform-origin": "50% 50% -" + l / 2 + "px",
                            "transform-origin": "50% 50% -" + l / 2 + "px"
                        }), h.shadow)
                        if (p) t.transform("translate3d(0px, " + (a / 2 + h.shadowOffset) + "px, " + -a / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + h.shadowScale + ")");
                        else {
                            var S = Math.abs(c) - 90 * Math.floor(Math.abs(c) / 90),
                                P = 1.5 - (Math.sin(2 * S * Math.PI / 360) / 2 + Math.cos(2 * S * Math.PI / 360) / 2),
                                C = h.shadowScale,
                                k = h.shadowScale / P,
                                M = h.shadowOffset;
                            t.transform("scale3d(" + C + ", 1, " + k + ") translate3d(0px, " + (n / 2 + M) + "px, " + -n / 2 / k + "px) rotateX(-90deg)")
                        }
                    var A = I.isSafari || I.isUiWebView ? -l / 2 : 0;
                    s.transform("translate3d(0px,0," + A + "px) rotateX(" + (e.isHorizontal() ? 0 : c) + "deg) rotateY(" + (e.isHorizontal() ? -c : 0) + "deg)")
                },
                setTransition: function(t) {
                    var e = this.$el;
                    this.slides.transition(t).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(t), this.params.cubeEffect.shadow && !this.isHorizontal() && e.find(".swiper-cube-shadow").transition(t)
                }
            },
            J = {
                setTranslate: function() {
                    for (var t = this.slides, e = this.rtlTranslate, i = 0; i < t.length; i += 1) {
                        var s = t.eq(i),
                            r = s[0].progress;
                        this.params.flipEffect.limitRotation && (r = Math.max(Math.min(s[0].progress, 1), -1));
                        var a = -180 * r,
                            n = 0,
                            o = -s[0].swiperSlideOffset,
                            l = 0;
                        if (this.isHorizontal() ? e && (a = -a) : (l = o, n = -a, a = o = 0), s[0].style.zIndex = -Math.abs(Math.round(r)) + t.length, this.params.flipEffect.slideShadows) {
                            var h = this.isHorizontal() ? s.find(".swiper-slide-shadow-left") : s.find(".swiper-slide-shadow-top"),
                                p = this.isHorizontal() ? s.find(".swiper-slide-shadow-right") : s.find(".swiper-slide-shadow-bottom");
                            0 === h.length && (h = D('<div class="swiper-slide-shadow-' + (this.isHorizontal() ? "left" : "top") + '"></div>'), s.append(h)), 0 === p.length && (p = D('<div class="swiper-slide-shadow-' + (this.isHorizontal() ? "right" : "bottom") + '"></div>'), s.append(p)), h.length && (h[0].style.opacity = Math.max(-r, 0)), p.length && (p[0].style.opacity = Math.max(r, 0))
                        }
                        s.transform("translate3d(" + o + "px, " + l + "px, 0px) rotateX(" + n + "deg) rotateY(" + a + "deg)")
                    }
                },
                setTransition: function(t) {
                    var i = this,
                        e = i.slides,
                        s = i.activeIndex,
                        r = i.$wrapperEl;
                    if (e.transition(t).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(t), i.params.virtualTranslate && 0 !== t) {
                        var a = !1;
                        e.eq(s).transitionEnd(function() {
                            if (!a && i && !i.destroyed) {
                                a = !0, i.animating = !1;
                                for (var t = ["webkitTransitionEnd", "transitionend"], e = 0; e < t.length; e += 1) r.trigger(t[e])
                            }
                        })
                    }
                }
            },
            tt = {
                setTranslate: function() {
                    for (var t = this.width, e = this.height, i = this.slides, s = this.$wrapperEl, r = this.slidesSizesGrid, a = this.params.coverflowEffect, n = this.isHorizontal(), o = this.translate, l = n ? t / 2 - o : e / 2 - o, h = n ? a.rotate : -a.rotate, p = a.depth, d = 0, c = i.length; d < c; d += 1) {
                        var f = i.eq(d),
                            u = r[d],
                            m = (l - f[0].swiperSlideOffset - u / 2) / u * a.modifier,
                            g = n ? h * m : 0,
                            v = n ? 0 : h * m,
                            y = -p * Math.abs(m),
                            _ = n ? 0 : a.stretch * m,
                            b = n ? a.stretch * m : 0;
                        Math.abs(b) < .001 && (b = 0), Math.abs(_) < .001 && (_ = 0), Math.abs(y) < .001 && (y = 0), Math.abs(g) < .001 && (g = 0), Math.abs(v) < .001 && (v = 0);
                        var x = "translate3d(" + b + "px," + _ + "px," + y + "px)  rotateX(" + v + "deg) rotateY(" + g + "deg)";
                        if (f.transform(x), f[0].style.zIndex = 1 - Math.abs(Math.round(m)), a.slideShadows) {
                            var T = n ? f.find(".swiper-slide-shadow-left") : f.find(".swiper-slide-shadow-top"),
                                w = n ? f.find(".swiper-slide-shadow-right") : f.find(".swiper-slide-shadow-bottom");
                            0 === T.length && (T = D('<div class="swiper-slide-shadow-' + (n ? "left" : "top") + '"></div>'), f.append(T)), 0 === w.length && (w = D('<div class="swiper-slide-shadow-' + (n ? "right" : "bottom") + '"></div>'), f.append(w)), T.length && (T[0].style.opacity = 0 < m ? m : 0), w.length && (w[0].style.opacity = 0 < -m ? -m : 0)
                        }
                    }($.pointerEvents || $.prefixedPointerEvents) && (s[0].style.perspectiveOrigin = l + "px 50%")
                },
                setTransition: function(t) {
                    this.slides.transition(t).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(t)
                }
            },
            et = {
                init: function() {
                    var t = this,
                        e = t.params.thumbs,
                        i = t.constructor;
                    e.swiper instanceof i ? (t.thumbs.swiper = e.swiper, H.extend(t.thumbs.swiper.originalParams, {
                        watchSlidesProgress: !0,
                        slideToClickedSlide: !1
                    }), H.extend(t.thumbs.swiper.params, {
                        watchSlidesProgress: !0,
                        slideToClickedSlide: !1
                    })) : H.isObject(e.swiper) && (t.thumbs.swiper = new i(H.extend({}, e.swiper, {
                        watchSlidesVisibility: !0,
                        watchSlidesProgress: !0,
                        slideToClickedSlide: !1
                    })), t.thumbs.swiperCreated = !0), t.thumbs.swiper.$el.addClass(t.params.thumbs.thumbsContainerClass), t.thumbs.swiper.on("tap", t.thumbs.onThumbClick)
                },
                onThumbClick: function() {
                    var t = this,
                        e = t.thumbs.swiper;
                    if (e) {
                        var i = e.clickedIndex,
                            s = e.clickedSlide;
                        if (!(s && D(s).hasClass(t.params.thumbs.slideThumbActiveClass) || null == i)) {
                            var r;
                            if (r = e.params.loop ? parseInt(D(e.clickedSlide).attr("data-swiper-slide-index"), 10) : i, t.params.loop) {
                                var a = t.activeIndex;
                                t.slides.eq(a).hasClass(t.params.slideDuplicateClass) && (t.loopFix(), t._clientLeft = t.$wrapperEl[0].clientLeft, a = t.activeIndex);
                                var n = t.slides.eq(a).prevAll('[data-swiper-slide-index="' + r + '"]').eq(0).index(),
                                    o = t.slides.eq(a).nextAll('[data-swiper-slide-index="' + r + '"]').eq(0).index();
                                r = void 0 === n ? o : void 0 === o ? n : o - a < a - n ? o : n
                            }
                            t.slideTo(r)
                        }
                    }
                },
                update: function(t) {
                    var e = this,
                        i = e.thumbs.swiper;
                    if (i) {
                        var s = "auto" === i.params.slidesPerView ? i.slidesPerViewDynamic() : i.params.slidesPerView;
                        if (e.realIndex !== i.realIndex) {
                            var r, a = i.activeIndex;
                            if (i.params.loop) {
                                i.slides.eq(a).hasClass(i.params.slideDuplicateClass) && (i.loopFix(), i._clientLeft = i.$wrapperEl[0].clientLeft, a = i.activeIndex);
                                var n = i.slides.eq(a).prevAll('[data-swiper-slide-index="' + e.realIndex + '"]').eq(0).index(),
                                    o = i.slides.eq(a).nextAll('[data-swiper-slide-index="' + e.realIndex + '"]').eq(0).index();
                                r = void 0 === n ? o : void 0 === o ? n : o - a == a - n ? a : o - a < a - n ? o : n
                            } else r = e.realIndex;
                            i.visibleSlidesIndexes.indexOf(r) < 0 && (i.params.centeredSlides ? r = a < r ? r - Math.floor(s / 2) + 1 : r + Math.floor(s / 2) - 1 : a < r && (r = r - s + 1), i.slideTo(r, t ? 0 : void 0))
                        }
                        var l = 1,
                            h = e.params.thumbs.slideThumbActiveClass;
                        if (1 < e.params.slidesPerView && !e.params.centeredSlides && (l = e.params.slidesPerView), i.slides.removeClass(h), i.params.loop)
                            for (var p = 0; p < l; p += 1) i.$wrapperEl.children('[data-swiper-slide-index="' + (e.realIndex + p) + '"]').addClass(h);
                        else
                            for (var d = 0; d < l; d += 1) i.slides.eq(e.realIndex + d).addClass(h)
                    }
                }
            },
            it = [E, S, P, C, M, F, O, {
                name: "mousewheel",
                params: {
                    mousewheel: {
                        enabled: !1,
                        releaseOnEdges: !1,
                        invert: !1,
                        forceToAxis: !1,
                        sensitivity: 1,
                        eventsTarged: "container"
                    }
                },
                create: function() {
                    H.extend(this, {
                        mousewheel: {
                            enabled: !1,
                            enable: z.enable.bind(this),
                            disable: z.disable.bind(this),
                            handle: z.handle.bind(this),
                            handleMouseEnter: z.handleMouseEnter.bind(this),
                            handleMouseLeave: z.handleMouseLeave.bind(this),
                            lastScrollTime: H.now()
                        }
                    })
                },
                on: {
                    init: function() {
                        this.params.mousewheel.enabled && this.mousewheel.enable()
                    },
                    destroy: function() {
                        this.mousewheel.enabled && this.mousewheel.disable()
                    }
                }
            }, {
                name: "navigation",
                params: {
                    navigation: {
                        nextEl: null,
                        prevEl: null,
                        hideOnClick: !1,
                        disabledClass: "swiper-button-disabled",
                        hiddenClass: "swiper-button-hidden",
                        lockClass: "swiper-button-lock"
                    }
                },
                create: function() {
                    H.extend(this, {
                        navigation: {
                            init: L.init.bind(this),
                            update: L.update.bind(this),
                            destroy: L.destroy.bind(this),
                            onNextClick: L.onNextClick.bind(this),
                            onPrevClick: L.onPrevClick.bind(this)
                        }
                    })
                },
                on: {
                    init: function() {
                        this.navigation.init(), this.navigation.update()
                    },
                    toEdge: function() {
                        this.navigation.update()
                    },
                    fromEdge: function() {
                        this.navigation.update()
                    },
                    destroy: function() {
                        this.navigation.destroy()
                    },
                    click: function(t) {
                        var e = this.navigation,
                            i = e.$nextEl,
                            s = e.$prevEl;
                        !this.params.navigation.hideOnClick || D(t.target).is(s) || D(t.target).is(i) || (i && i.toggleClass(this.params.navigation.hiddenClass), s && s.toggleClass(this.params.navigation.hiddenClass))
                    }
                }
            }, {
                name: "pagination",
                params: {
                    pagination: {
                        el: null,
                        bulletElement: "span",
                        clickable: !1,
                        hideOnClick: !1,
                        renderBullet: null,
                        renderProgressbar: null,
                        renderFraction: null,
                        renderCustom: null,
                        progressbarOpposite: !1,
                        type: "bullets",
                        dynamicBullets: !1,
                        dynamicMainBullets: 1,
                        formatFractionCurrent: function(t) {
                            return t
                        },
                        formatFractionTotal: function(t) {
                            return t
                        },
                        bulletClass: "swiper-pagination-bullet",
                        bulletActiveClass: "swiper-pagination-bullet-active",
                        modifierClass: "swiper-pagination-",
                        currentClass: "swiper-pagination-current",
                        totalClass: "swiper-pagination-total",
                        hiddenClass: "swiper-pagination-hidden",
                        progressbarFillClass: "swiper-pagination-progressbar-fill",
                        progressbarOppositeClass: "swiper-pagination-progressbar-opposite",
                        clickableClass: "swiper-pagination-clickable",
                        lockClass: "swiper-pagination-lock"
                    }
                },
                create: function() {
                    H.extend(this, {
                        pagination: {
                            init: B.init.bind(this),
                            render: B.render.bind(this),
                            update: B.update.bind(this),
                            destroy: B.destroy.bind(this),
                            dynamicBulletIndex: 0
                        }
                    })
                },
                on: {
                    init: function() {
                        this.pagination.init(), this.pagination.render(), this.pagination.update()
                    },
                    activeIndexChange: function() {
                        this.params.loop ? this.pagination.update() : void 0 === this.snapIndex && this.pagination.update()
                    },
                    snapIndexChange: function() {
                        this.params.loop || this.pagination.update()
                    },
                    slidesLengthChange: function() {
                        this.params.loop && (this.pagination.render(), this.pagination.update())
                    },
                    snapGridLengthChange: function() {
                        this.params.loop || (this.pagination.render(), this.pagination.update())
                    },
                    destroy: function() {
                        this.pagination.destroy()
                    },
                    click: function(t) {
                        this.params.pagination.el && this.params.pagination.hideOnClick && 0 < this.pagination.$el.length && !D(t.target).hasClass(this.params.pagination.bulletClass) && this.pagination.$el.toggleClass(this.params.pagination.hiddenClass)
                    }
                }
            }, {
                name: "scrollbar",
                params: {
                    scrollbar: {
                        el: null,
                        dragSize: "auto",
                        hide: !1,
                        draggable: !1,
                        snapOnRelease: !0,
                        lockClass: "swiper-scrollbar-lock",
                        dragClass: "swiper-scrollbar-drag"
                    }
                },
                create: function() {
                    var t = this;
                    H.extend(t, {
                        scrollbar: {
                            init: V.init.bind(t),
                            destroy: V.destroy.bind(t),
                            updateSize: V.updateSize.bind(t),
                            setTranslate: V.setTranslate.bind(t),
                            setTransition: V.setTransition.bind(t),
                            enableDraggable: V.enableDraggable.bind(t),
                            disableDraggable: V.disableDraggable.bind(t),
                            setDragPosition: V.setDragPosition.bind(t),
                            onDragStart: V.onDragStart.bind(t),
                            onDragMove: V.onDragMove.bind(t),
                            onDragEnd: V.onDragEnd.bind(t),
                            isTouched: !1,
                            timeout: null,
                            dragTimeout: null
                        }
                    })
                },
                on: {
                    init: function() {
                        this.scrollbar.init(), this.scrollbar.updateSize(), this.scrollbar.setTranslate()
                    },
                    update: function() {
                        this.scrollbar.updateSize()
                    },
                    resize: function() {
                        this.scrollbar.updateSize()
                    },
                    observerUpdate: function() {
                        this.scrollbar.updateSize()
                    },
                    setTranslate: function() {
                        this.scrollbar.setTranslate()
                    },
                    setTransition: function(t) {
                        this.scrollbar.setTransition(t)
                    },
                    destroy: function() {
                        this.scrollbar.destroy()
                    }
                }
            }, {
                name: "parallax",
                params: {
                    parallax: {
                        enabled: !1
                    }
                },
                create: function() {
                    H.extend(this, {
                        parallax: {
                            setTransform: N.setTransform.bind(this),
                            setTranslate: N.setTranslate.bind(this),
                            setTransition: N.setTransition.bind(this)
                        }
                    })
                },
                on: {
                    beforeInit: function() {
                        this.params.parallax.enabled && (this.params.watchSlidesProgress = !0, this.originalParams.watchSlidesProgress = !0)
                    },
                    init: function() {
                        this.params.parallax && this.parallax.setTranslate()
                    },
                    setTranslate: function() {
                        this.params.parallax && this.parallax.setTranslate()
                    },
                    setTransition: function(t) {
                        this.params.parallax && this.parallax.setTransition(t)
                    }
                }
            }, {
                name: "zoom",
                params: {
                    zoom: {
                        enabled: !1,
                        maxRatio: 3,
                        minRatio: 1,
                        toggle: !0,
                        containerClass: "swiper-zoom-container",
                        zoomedSlideClass: "swiper-slide-zoomed"
                    }
                },
                create: function() {
                    var e = this,
                        i = {
                            enabled: !1,
                            scale: 1,
                            currentScale: 1,
                            isScaling: !1,
                            gesture: {
                                $slideEl: void 0,
                                slideWidth: void 0,
                                slideHeight: void 0,
                                $imageEl: void 0,
                                $imageWrapEl: void 0,
                                maxRatio: 3
                            },
                            image: {
                                isTouched: void 0,
                                isMoved: void 0,
                                currentX: void 0,
                                currentY: void 0,
                                minX: void 0,
                                minY: void 0,
                                maxX: void 0,
                                maxY: void 0,
                                width: void 0,
                                height: void 0,
                                startX: void 0,
                                startY: void 0,
                                touchesStart: {},
                                touchesCurrent: {}
                            },
                            velocity: {
                                x: void 0,
                                y: void 0,
                                prevPositionX: void 0,
                                prevPositionY: void 0,
                                prevTime: void 0
                            }
                        };
                    "onGestureStart onGestureChange onGestureEnd onTouchStart onTouchMove onTouchEnd onTransitionEnd toggle enable disable in out".split(" ").forEach(function(t) {
                        i[t] = j[t].bind(e)
                    }), H.extend(e, {
                        zoom: i
                    })
                },
                on: {
                    init: function() {
                        this.params.zoom.enabled && this.zoom.enable()
                    },
                    destroy: function() {
                        this.zoom.disable()
                    },
                    touchStart: function(t) {
                        this.zoom.enabled && this.zoom.onTouchStart(t)
                    },
                    touchEnd: function(t) {
                        this.zoom.enabled && this.zoom.onTouchEnd(t)
                    },
                    doubleTap: function(t) {
                        this.params.zoom.enabled && this.zoom.enabled && this.params.zoom.toggle && this.zoom.toggle(t)
                    },
                    transitionEnd: function() {
                        this.zoom.enabled && this.params.zoom.enabled && this.zoom.onTransitionEnd()
                    }
                }
            }, {
                name: "lazy",
                params: {
                    lazy: {
                        enabled: !1,
                        loadPrevNext: !1,
                        loadPrevNextAmount: 1,
                        loadOnTransitionStart: !1,
                        elementClass: "swiper-lazy",
                        loadingClass: "swiper-lazy-loading",
                        loadedClass: "swiper-lazy-loaded",
                        preloaderClass: "swiper-lazy-preloader"
                    }
                },
                create: function() {
                    H.extend(this, {
                        lazy: {
                            initialImageLoaded: !1,
                            load: X.load.bind(this),
                            loadInSlide: X.loadInSlide.bind(this)
                        }
                    })
                },
                on: {
                    beforeInit: function() {
                        this.params.lazy.enabled && this.params.preloadImages && (this.params.preloadImages = !1)
                    },
                    init: function() {
                        this.params.lazy.enabled && !this.params.loop && 0 === this.params.initialSlide && this.lazy.load()
                    },
                    scroll: function() {
                        this.params.freeMode && !this.params.freeModeSticky && this.lazy.load()
                    },
                    resize: function() {
                        this.params.lazy.enabled && this.lazy.load()
                    },
                    scrollbarDragMove: function() {
                        this.params.lazy.enabled && this.lazy.load()
                    },
                    transitionStart: function() {
                        this.params.lazy.enabled && (this.params.lazy.loadOnTransitionStart || !this.params.lazy.loadOnTransitionStart && !this.lazy.initialImageLoaded) && this.lazy.load()
                    },
                    transitionEnd: function() {
                        this.params.lazy.enabled && !this.params.lazy.loadOnTransitionStart && this.lazy.load()
                    }
                }
            }, {
                name: "controller",
                params: {
                    controller: {
                        control: void 0,
                        inverse: !1,
                        by: "slide"
                    }
                },
                create: function() {
                    H.extend(this, {
                        controller: {
                            control: this.params.controller.control,
                            getInterpolateFunction: Y.getInterpolateFunction.bind(this),
                            setTranslate: Y.setTranslate.bind(this),
                            setTransition: Y.setTransition.bind(this)
                        }
                    })
                },
                on: {
                    update: function() {
                        this.controller.control && this.controller.spline && (this.controller.spline = void 0, delete this.controller.spline)
                    },
                    resize: function() {
                        this.controller.control && this.controller.spline && (this.controller.spline = void 0, delete this.controller.spline)
                    },
                    observerUpdate: function() {
                        this.controller.control && this.controller.spline && (this.controller.spline = void 0, delete this.controller.spline)
                    },
                    setTranslate: function(t, e) {
                        this.controller.control && this.controller.setTranslate(t, e)
                    },
                    setTransition: function(t, e) {
                        this.controller.control && this.controller.setTransition(t, e)
                    }
                }
            }, {
                name: "a11y",
                params: {
                    a11y: {
                        enabled: !0,
                        notificationClass: "swiper-notification",
                        prevSlideMessage: "Previous slide",
                        nextSlideMessage: "Next slide",
                        firstSlideMessage: "This is the first slide",
                        lastSlideMessage: "This is the last slide",
                        paginationBulletMessage: "Go to slide {{index}}"
                    }
                },
                create: function() {
                    var e = this;
                    H.extend(e, {
                        a11y: {
                            liveRegion: D('<span class="' + e.params.a11y.notificationClass + '" aria-live="assertive" aria-atomic="true"></span>')
                        }
                    }), Object.keys(q).forEach(function(t) {
                        e.a11y[t] = q[t].bind(e)
                    })
                },
                on: {
                    init: function() {
                        this.params.a11y.enabled && (this.a11y.init(), this.a11y.updateNavigation())
                    },
                    toEdge: function() {
                        this.params.a11y.enabled && this.a11y.updateNavigation()
                    },
                    fromEdge: function() {
                        this.params.a11y.enabled && this.a11y.updateNavigation()
                    },
                    paginationUpdate: function() {
                        this.params.a11y.enabled && this.a11y.updatePagination()
                    },
                    destroy: function() {
                        this.params.a11y.enabled && this.a11y.destroy()
                    }
                }
            }, {
                name: "history",
                params: {
                    history: {
                        enabled: !1,
                        replaceState: !1,
                        key: "slides"
                    }
                },
                create: function() {
                    H.extend(this, {
                        history: {
                            init: W.init.bind(this),
                            setHistory: W.setHistory.bind(this),
                            setHistoryPopState: W.setHistoryPopState.bind(this),
                            scrollToSlide: W.scrollToSlide.bind(this),
                            destroy: W.destroy.bind(this)
                        }
                    })
                },
                on: {
                    init: function() {
                        this.params.history.enabled && this.history.init()
                    },
                    destroy: function() {
                        this.params.history.enabled && this.history.destroy()
                    },
                    transitionEnd: function() {
                        this.history.initialized && this.history.setHistory(this.params.history.key, this.activeIndex)
                    }
                }
            }, {
                name: "hash-navigation",
                params: {
                    hashNavigation: {
                        enabled: !1,
                        replaceState: !1,
                        watchState: !1
                    }
                },
                create: function() {
                    H.extend(this, {
                        hashNavigation: {
                            initialized: !1,
                            init: U.init.bind(this),
                            destroy: U.destroy.bind(this),
                            setHash: U.setHash.bind(this),
                            onHashCange: U.onHashCange.bind(this)
                        }
                    })
                },
                on: {
                    init: function() {
                        this.params.hashNavigation.enabled && this.hashNavigation.init()
                    },
                    destroy: function() {
                        this.params.hashNavigation.enabled && this.hashNavigation.destroy()
                    },
                    transitionEnd: function() {
                        this.hashNavigation.initialized && this.hashNavigation.setHash()
                    }
                }
            }, {
                name: "autoplay",
                params: {
                    autoplay: {
                        enabled: !1,
                        delay: 3e3,
                        waitForTransition: !0,
                        disableOnInteraction: !0,
                        stopOnLastSlide: !1,
                        reverseDirection: !1
                    }
                },
                create: function() {
                    var e = this;
                    H.extend(e, {
                        autoplay: {
                            running: !1,
                            paused: !1,
                            run: K.run.bind(e),
                            start: K.start.bind(e),
                            stop: K.stop.bind(e),
                            pause: K.pause.bind(e),
                            onTransitionEnd: function(t) {
                                e && !e.destroyed && e.$wrapperEl && t.target === this && (e.$wrapperEl[0].removeEventListener("transitionend", e.autoplay.onTransitionEnd), e.$wrapperEl[0].removeEventListener("webkitTransitionEnd", e.autoplay.onTransitionEnd), e.autoplay.paused = !1, e.autoplay.running ? e.autoplay.run() : e.autoplay.stop())
                            }
                        }
                    })
                },
                on: {
                    init: function() {
                        this.params.autoplay.enabled && this.autoplay.start()
                    },
                    beforeTransitionStart: function(t, e) {
                        this.autoplay.running && (e || !this.params.autoplay.disableOnInteraction ? this.autoplay.pause(t) : this.autoplay.stop())
                    },
                    sliderFirstMove: function() {
                        this.autoplay.running && (this.params.autoplay.disableOnInteraction ? this.autoplay.stop() : this.autoplay.pause())
                    },
                    destroy: function() {
                        this.autoplay.running && this.autoplay.stop()
                    }
                }
            }, {
                name: "effect-fade",
                params: {
                    fadeEffect: {
                        crossFade: !1
                    }
                },
                create: function() {
                    H.extend(this, {
                        fadeEffect: {
                            setTranslate: Z.setTranslate.bind(this),
                            setTransition: Z.setTransition.bind(this)
                        }
                    })
                },
                on: {
                    beforeInit: function() {
                        if ("fade" === this.params.effect) {
                            this.classNames.push(this.params.containerModifierClass + "fade");
                            var t = {
                                slidesPerView: 1,
                                slidesPerColumn: 1,
                                slidesPerGroup: 1,
                                watchSlidesProgress: !0,
                                spaceBetween: 0,
                                virtualTranslate: !0
                            };
                            H.extend(this.params, t), H.extend(this.originalParams, t)
                        }
                    },
                    setTranslate: function() {
                        "fade" === this.params.effect && this.fadeEffect.setTranslate()
                    },
                    setTransition: function(t) {
                        "fade" === this.params.effect && this.fadeEffect.setTransition(t)
                    }
                }
            }, {
                name: "effect-cube",
                params: {
                    cubeEffect: {
                        slideShadows: !0,
                        shadow: !0,
                        shadowOffset: 20,
                        shadowScale: .94
                    }
                },
                create: function() {
                    H.extend(this, {
                        cubeEffect: {
                            setTranslate: Q.setTranslate.bind(this),
                            setTransition: Q.setTransition.bind(this)
                        }
                    })
                },
                on: {
                    beforeInit: function() {
                        if ("cube" === this.params.effect) {
                            this.classNames.push(this.params.containerModifierClass + "cube"), this.classNames.push(this.params.containerModifierClass + "3d");
                            var t = {
                                slidesPerView: 1,
                                slidesPerColumn: 1,
                                slidesPerGroup: 1,
                                watchSlidesProgress: !0,
                                resistanceRatio: 0,
                                spaceBetween: 0,
                                centeredSlides: !1,
                                virtualTranslate: !0
                            };
                            H.extend(this.params, t), H.extend(this.originalParams, t)
                        }
                    },
                    setTranslate: function() {
                        "cube" === this.params.effect && this.cubeEffect.setTranslate()
                    },
                    setTransition: function(t) {
                        "cube" === this.params.effect && this.cubeEffect.setTransition(t)
                    }
                }
            }, {
                name: "effect-flip",
                params: {
                    flipEffect: {
                        slideShadows: !0,
                        limitRotation: !0
                    }
                },
                create: function() {
                    H.extend(this, {
                        flipEffect: {
                            setTranslate: J.setTranslate.bind(this),
                            setTransition: J.setTransition.bind(this)
                        }
                    })
                },
                on: {
                    beforeInit: function() {
                        if ("flip" === this.params.effect) {
                            this.classNames.push(this.params.containerModifierClass + "flip"), this.classNames.push(this.params.containerModifierClass + "3d");
                            var t = {
                                slidesPerView: 1,
                                slidesPerColumn: 1,
                                slidesPerGroup: 1,
                                watchSlidesProgress: !0,
                                spaceBetween: 0,
                                virtualTranslate: !0
                            };
                            H.extend(this.params, t), H.extend(this.originalParams, t)
                        }
                    },
                    setTranslate: function() {
                        "flip" === this.params.effect && this.flipEffect.setTranslate()
                    },
                    setTransition: function(t) {
                        "flip" === this.params.effect && this.flipEffect.setTransition(t)
                    }
                }
            }, {
                name: "effect-coverflow",
                params: {
                    coverflowEffect: {
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: !0
                    }
                },
                create: function() {
                    H.extend(this, {
                        coverflowEffect: {
                            setTranslate: tt.setTranslate.bind(this),
                            setTransition: tt.setTransition.bind(this)
                        }
                    })
                },
                on: {
                    beforeInit: function() {
                        "coverflow" === this.params.effect && (this.classNames.push(this.params.containerModifierClass + "coverflow"), this.classNames.push(this.params.containerModifierClass + "3d"), this.params.watchSlidesProgress = !0, this.originalParams.watchSlidesProgress = !0)
                    },
                    setTranslate: function() {
                        "coverflow" === this.params.effect && this.coverflowEffect.setTranslate()
                    },
                    setTransition: function(t) {
                        "coverflow" === this.params.effect && this.coverflowEffect.setTransition(t)
                    }
                }
            }, {
                name: "thumbs",
                params: {
                    thumbs: {
                        swiper: null,
                        slideThumbActiveClass: "swiper-slide-thumb-active",
                        thumbsContainerClass: "swiper-container-thumbs"
                    }
                },
                create: function() {
                    H.extend(this, {
                        thumbs: {
                            swiper: null,
                            init: et.init.bind(this),
                            update: et.update.bind(this),
                            onThumbClick: et.onThumbClick.bind(this)
                        }
                    })
                },
                on: {
                    beforeInit: function() {
                        var t = this.params.thumbs;
                        t && t.swiper && (this.thumbs.init(), this.thumbs.update(!0))
                    },
                    slideChange: function() {
                        this.thumbs.swiper && this.thumbs.update()
                    },
                    update: function() {
                        this.thumbs.swiper && this.thumbs.update()
                    },
                    resize: function() {
                        this.thumbs.swiper && this.thumbs.update()
                    },
                    observerUpdate: function() {
                        this.thumbs.swiper && this.thumbs.update()
                    },
                    setTransition: function(t) {
                        var e = this.thumbs.swiper;
                        e && e.setTransition(t)
                    },
                    beforeDestroy: function() {
                        var t = this.thumbs.swiper;
                        t && this.thumbs.swiperCreated && t && t.destroy()
                    }
                }
            }];
        return void 0 === w.use && (w.use = w.Class.use, w.installModule = w.Class.installModule), w.use(it), w
    }),
    function(t, e) {
        "function" == typeof define && define.amd ? define([], function() {
            return t.svg4everybody = e()
        }) : "object" == typeof module && module.exports ? module.exports = e() : t.svg4everybody = e()
    }(this, function() {
        function g(t, e, i) {
            if (i) {
                var s = document.createDocumentFragment(),
                    r = !e.hasAttribute("viewBox") && i.getAttribute("viewBox");
                r && e.setAttribute("viewBox", r);
                for (var a = i.cloneNode(!0); a.childNodes.length;) s.appendChild(a.firstChild);
                t.appendChild(s)
            }
        }
        function v(s) {
            s.onreadystatechange = function() {
                if (4 === s.readyState) {
                    var i = s._cachedDocument;
                    i || ((i = s._cachedDocument = document.implementation.createHTMLDocument("")).body.innerHTML = s.responseText, s._cachedTarget = {}), s._embeds.splice(0).map(function(t) {
                        var e = s._cachedTarget[t.id];
                        e || (e = s._cachedTarget[t.id] = i.getElementById(t.id)), g(t.parent, t.svg, e)
                    })
                }
            }, s.onreadystatechange()
        }
        function y(t) {
            for (var e = t;
                "svg" !== e.nodeName.toLowerCase() && (e = e.parentNode););
            return e
        }
        return function(t) {
            var p, d = Object(t),
                e = window.top !== window.self;
            p = "polyfill" in d ? d.polyfill : /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/.test(navigator.userAgent) || (navigator.userAgent.match(/\bEdge\/12\.(\d+)\b/) || [])[1] < 10547 || (navigator.userAgent.match(/\bAppleWebKit\/(\d+)\b/) || [])[1] < 537 || /\bEdge\/.(\d+)\b/.test(navigator.userAgent) && e;
            var c = {},
                f = window.requestAnimationFrame || setTimeout,
                u = document.getElementsByTagName("use"),
                m = 0;
            p && function t() {
                for (var e = 0; e < u.length;) {
                    var i = u[e],
                        s = i.parentNode,
                        r = y(s),
                        a = i.getAttribute("xlink:href") || i.getAttribute("href");
                    if (!a && d.attributeName && (a = i.getAttribute(d.attributeName)), r && a) {
                        if (p)
                            if (!d.validate || d.validate(a, r, i)) {
                                s.removeChild(i);
                                var n = a.split("#"),
                                    o = n.shift(),
                                    l = n.join("#");
                                if (o.length) {
                                    var h = c[o];
                                    h || ((h = c[o] = new XMLHttpRequest).open("GET", o), h.send(), h._embeds = []), h._embeds.push({
                                        parent: s,
                                        svg: r,
                                        id: l
                                    }), v(h)
                                } else g(s, r, document.getElementById(l))
                            } else ++e, ++m
                    } else ++e
                }(!u.length || 0 < u.length - m) && f(t, 67)
            }()
        }
    });
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
        "use strict";
        var t, l, h, e, w, x, T, E, v, i, y, S, _, b, f, u, g, s;
        _gsScope._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(s, p, _) {
            var m = function(t) {
                    var e, i = [],
                        s = t.length;
                    for (e = 0; e !== s; i.push(t[e++]));
                    return i
                },
                g = function(t, e, i) {
                    var s, r, a = t.cycle;
                    for (s in a) r = a[s], t[s] = "function" == typeof r ? r(i, e[i], e) : r[i % r.length];
                    delete t.cycle
                },
                v = function(t) {
                    if ("function" == typeof t) return t;
                    var u = "object" == typeof t ? t : {
                            each: t
                        },
                        m = u.ease,
                        g = u.from || 0,
                        v = u.base || 0,
                        y = {},
                        _ = isNaN(g),
                        b = u.axis,
                        x = {
                            center: .5,
                            end: 1
                        }[g] || 0;
                    return function(t, e, i) {
                        var s, r, a, n, o, l, h, p, d, c = (i || u).length,
                            f = y[c];
                        if (!f) {
                            if (!(d = "auto" === u.grid ? 0 : (u.grid || [1 / 0])[0])) {
                                for (h = -1 / 0; h < (h = i[d++].getBoundingClientRect().left) && d < c;);
                                d--
                            }
                            for (f = y[c] = [], s = _ ? Math.min(d, c) * x - .5 : g % d, r = _ ? c * x / d - .5 : g / d | 0, p = 1 / (h = 0), l = 0; l < c; l++) a = l % d - s, n = r - (l / d | 0), f[l] = o = b ? Math.abs("y" === b ? n : a) : Math.sqrt(a * a + n * n), h < o && (h = o), o < p && (p = o);
                            f.max = h - p, f.min = p, f.v = c = u.amount || u.each * (c < d ? c : b ? "y" === b ? c / d : d : Math.max(d, c / d)) || 0, f.b = c < 0 ? v - c : v
                        }
                        return c = (f[t] - f.min) / f.max, f.b + (m ? m.getRatio(c) : c) * f.v
                    }
                },
                y = function(t, e, i) {
                    _.call(this, t, e, i), this._cycle = 0, this._yoyo = !0 === this.vars.yoyo || !!this.vars.yoyoEase, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._repeat && this._uncache(!0), this.render = y.prototype.render
                },
                b = 1e-8,
                x = _._internals,
                T = x.isSelector,
                w = x.isArray,
                t = y.prototype = _.to({}, .1, {}),
                E = [];
            y.version = "2.1.2", t.constructor = y, t.kill()._gc = !1, y.killTweensOf = y.killDelayedCallsTo = _.killTweensOf, y.getTweensOf = _.getTweensOf, y.lagSmoothing = _.lagSmoothing, y.ticker = _.ticker, y.render = _.render, y.distribute = v, t.invalidate = function() {
                return this._yoyo = !0 === this.vars.yoyo || !!this.vars.yoyoEase, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._yoyoEase = null, this._uncache(!0), _.prototype.invalidate.call(this)
            }, t.updateTo = function(t, e) {
                var i, s = this,
                    r = s.ratio,
                    a = s.vars.immediateRender || t.immediateRender;
                for (i in e && s._startTime < s._timeline._time && (s._startTime = s._timeline._time, s._uncache(!1), s._gc ? s._enabled(!0, !1) : s._timeline.insert(s, s._startTime - s._delay)), t) s.vars[i] = t[i];
                if (s._initted || a)
                    if (e) s._initted = !1, a && s.render(0, !0, !0);
                    else if (s._gc && s._enabled(!0, !1), s._notifyPluginsOfEnabled && s._firstPT && _._onPluginEvent("_onDisable", s), .998 < s._time / s._duration) {
                    var n = s._totalTime;
                    s.render(0, !0, !1), s._initted = !1, s.render(n, !0, !1)
                } else if (s._initted = !1, s._init(), 0 < s._time || a)
                    for (var o, l = 1 / (1 - r), h = s._firstPT; h;) o = h.s + h.c, h.c *= l, h.s = o - h.c, h = h._next;
                return s
            }, t.render = function(t, e, i) {
                this._initted || 0 === this._duration && this.vars.repeat && this.invalidate();
                var s, r, a, n, o, l, h, p, d, c = this,
                    f = c._dirty ? c.totalDuration() : c._totalDuration,
                    u = c._time,
                    m = c._totalTime,
                    g = c._cycle,
                    v = c._duration,
                    y = c._rawPrevTime;
                if (f - b <= t && 0 <= t ? (c._totalTime = f, c._cycle = c._repeat, c._yoyo && 0 != (1 & c._cycle) ? (c._time = 0, c.ratio = c._ease._calcEnd ? c._ease.getRatio(0) : 0) : (c._time = v, c.ratio = c._ease._calcEnd ? c._ease.getRatio(1) : 1), c._reversed || (s = !0, r = "onComplete", i = i || c._timeline.autoRemoveChildren), 0 === v && (c._initted || !c.vars.lazy || i) && (c._startTime === c._timeline._duration && (t = 0), (y < 0 || t <= 0 && -b <= t || y === b && "isPause" !== c.data) && y !== t && (i = !0, b < y && (r = "onReverseComplete")), c._rawPrevTime = p = !e || t || y === t ? t : b)) : t < b ? (c._totalTime = c._time = c._cycle = 0, c.ratio = c._ease._calcEnd ? c._ease.getRatio(0) : 0, (0 !== m || 0 === v && 0 < y) && (r = "onReverseComplete", s = c._reversed), -b < t ? t = 0 : t < 0 && (c._active = !1, 0 === v && (c._initted || !c.vars.lazy || i) && (0 <= y && (i = !0), c._rawPrevTime = p = !e || t || y === t ? t : b)), c._initted || (i = !0)) : (c._totalTime = c._time = t, 0 !== c._repeat && (n = v + c._repeatDelay, c._cycle = c._totalTime / n >> 0, 0 !== c._cycle && c._cycle === c._totalTime / n && m <= t && c._cycle--, c._time = c._totalTime - c._cycle * n, c._yoyo && 0 != (1 & c._cycle) && (c._time = v - c._time, (d = c._yoyoEase || c.vars.yoyoEase) && (c._yoyoEase || (!0 !== d || c._initted ? c._yoyoEase = d = !0 === d ? c._ease : d instanceof Ease ? d : Ease.map[d] : (d = c.vars.ease, c._yoyoEase = d = d ? d instanceof Ease ? d : "function" == typeof d ? new Ease(d, c.vars.easeParams) : Ease.map[d] || _.defaultEase : _.defaultEase)), c.ratio = d ? 1 - d.getRatio((v - c._time) / v) : 0)), c._time > v ? c._time = v : c._time < 0 && (c._time = 0)), c._easeType && !d ? (o = c._time / v, (1 === (l = c._easeType) || 3 === l && .5 <= o) && (o = 1 - o), 3 === l && (o *= 2), 1 === (h = c._easePower) ? o *= o : 2 === h ? o *= o * o : 3 === h ? o *= o * o * o : 4 === h && (o *= o * o * o * o), c.ratio = 1 === l ? 1 - o : 2 === l ? o : c._time / v < .5 ? o / 2 : 1 - o / 2) : d || (c.ratio = c._ease.getRatio(c._time / v))), u !== c._time || i || g !== c._cycle) {
                    if (!c._initted) {
                        if (c._init(), !c._initted || c._gc) return;
                        if (!i && c._firstPT && (!1 !== c.vars.lazy && c._duration || c.vars.lazy && !c._duration)) return c._time = u, c._totalTime = m, c._rawPrevTime = y, c._cycle = g, x.lazyTweens.push(c), void(c._lazy = [t, e]);
                        !c._time || s || d ? s && this._ease._calcEnd && !d && (c.ratio = c._ease.getRatio(0 === c._time ? 0 : 1)) : c.ratio = c._ease.getRatio(c._time / v)
                    }
                    for (!1 !== c._lazy && (c._lazy = !1), c._active || !c._paused && c._time !== u && 0 <= t && (c._active = !0), 0 === m && (2 === c._initted && 0 < t && c._init(), c._startAt && (0 <= t ? c._startAt.render(t, !0, i) : r || (r = "_dummyGS")), c.vars.onStart && (0 !== c._totalTime || 0 === v) && (e || c._callback("onStart"))), a = c._firstPT; a;) a.f ? a.t[a.p](a.c * c.ratio + a.s) : a.t[a.p] = a.c * c.ratio + a.s, a = a._next;
                    c._onUpdate && (t < 0 && c._startAt && c._startTime && c._startAt.render(t, !0, i), e || (c._totalTime !== m || r) && c._callback("onUpdate")), c._cycle !== g && (e || c._gc || c.vars.onRepeat && c._callback("onRepeat")), r && (!c._gc || i) && (t < 0 && c._startAt && !c._onUpdate && c._startTime && c._startAt.render(t, !0, i), s && (c._timeline.autoRemoveChildren && c._enabled(!1, !1), c._active = !1), !e && c.vars[r] && c._callback(r), 0 === v && c._rawPrevTime === b && p !== b && (c._rawPrevTime = 0))
                } else m !== c._totalTime && c._onUpdate && (e || c._callback("onUpdate"))
            }, y.to = function(t, e, i) {
                return new y(t, e, i)
            }, y.from = function(t, e, i) {
                return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new y(t, e, i)
            }, y.fromTo = function(t, e, i, s) {
                return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, new y(t, e, s)
            }, y.staggerTo = y.allTo = function(t, e, i, s, r, a, n) {
                var o, l, h, p, d = [],
                    c = v(i.stagger || s),
                    f = i.cycle,
                    u = (i.startAt || E).cycle;
                for (w(t) || ("string" == typeof t && (t = _.selector(t) || t), T(t) && (t = m(t))), o = (t = t || []).length - 1, h = 0; h <= o; h++) {
                    for (p in l = {}, i) l[p] = i[p];
                    if (f && (g(l, t, h), null != l.duration && (e = l.duration, delete l.duration)), u) {
                        for (p in u = l.startAt = {}, i.startAt) u[p] = i.startAt[p];
                        g(l.startAt, t, h)
                    }
                    l.delay = c(h, t[h], t) + (l.delay || 0), h === o && r && (l.onComplete = function() {
                        i.onComplete && i.onComplete.apply(i.onCompleteScope || this, arguments), r.apply(n || i.callbackScope || this, a || E)
                    }), d[h] = new y(t[h], e, l)
                }
                return d
            }, y.staggerFrom = y.allFrom = function(t, e, i, s, r, a, n) {
                return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, y.staggerTo(t, e, i, s, r, a, n)
            }, y.staggerFromTo = y.allFromTo = function(t, e, i, s, r, a, n, o) {
                return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, y.staggerTo(t, e, s, r, a, n, o)
            }, y.delayedCall = function(t, e, i, s, r) {
                return new y(e, 0, {
                    delay: t,
                    onComplete: e,
                    onCompleteParams: i,
                    callbackScope: s,
                    onReverseComplete: e,
                    onReverseCompleteParams: i,
                    immediateRender: !1,
                    useFrames: r,
                    overwrite: 0
                })
            }, y.set = function(t, e) {
                return new y(t, 0, e)
            }, y.isTweening = function(t) {
                return 0 < _.getTweensOf(t, !0).length
            };
            var a = function(t, e) {
                    for (var i = [], s = 0, r = t._first; r;) r instanceof _ ? i[s++] = r : (e && (i[s++] = r), s = (i = i.concat(a(r, e))).length), r = r._next;
                    return i
                },
                d = y.getAllTweens = function(t) {
                    return a(s._rootTimeline, t).concat(a(s._rootFramesTimeline, t))
                };
            y.killAll = function(t, e, i, s) {
                null == e && (e = !0), null == i && (i = !0);
                var r, a, n, o = d(0 != s),
                    l = o.length,
                    h = e && i && s;
                for (n = 0; n < l; n++) a = o[n], (h || a instanceof p || (r = a.target === a.vars.onComplete) && i || e && !r) && (t ? a.totalTime(a._reversed ? 0 : a.totalDuration()) : a._enabled(!1, !1))
            }, y.killChildTweensOf = function(t, e) {
                if (null != t) {
                    var i, s, r, a, n, o = x.tweenLookup;
                    if ("string" == typeof t && (t = _.selector(t) || t), T(t) && (t = m(t)), w(t))
                        for (a = t.length; - 1 < --a;) y.killChildTweensOf(t[a], e);
                    else {
                        for (r in i = [], o)
                            for (s = o[r].target.parentNode; s;) s === t && (i = i.concat(o[r].tweens)), s = s.parentNode;
                        for (n = i.length, a = 0; a < n; a++) e && i[a].totalTime(i[a].totalDuration()), i[a]._enabled(!1, !1)
                    }
                }
            };
            var r = function(t, e, i, s) {
                e = !1 !== e, i = !1 !== i;
                for (var r, a, n = d(s = !1 !== s), o = e && i && s, l = n.length; - 1 < --l;) a = n[l], (o || a instanceof p || (r = a.target === a.vars.onComplete) && i || e && !r) && a.paused(t)
            };
            return y.pauseAll = function(t, e, i) {
                r(!0, t, e, i)
            }, y.resumeAll = function(t, e, i) {
                r(!1, t, e, i)
            }, y.globalTimeScale = function(t) {
                var e = s._rootTimeline,
                    i = _.ticker.time;
                return arguments.length ? (t = t || b, e._startTime = i - (i - e._startTime) * e._timeScale / t, e = s._rootFramesTimeline, i = _.ticker.frame, e._startTime = i - (i - e._startTime) * e._timeScale / t, e._timeScale = s._rootTimeline._timeScale = t, t) : e._timeScale
            }, t.progress = function(t, e) {
                return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 != (1 & this._cycle) ? 1 - t : t) + this._cycle * (this._duration + this._repeatDelay), e) : this._time / this.duration()
            }, t.totalProgress = function(t, e) {
                return arguments.length ? this.totalTime(this.totalDuration() * t, e) : this._totalTime / this.totalDuration()
            }, t.time = function(t, e) {
                if (!arguments.length) return this._time;
                this._dirty && this.totalDuration();
                var i = this._duration,
                    s = this._cycle,
                    r = s * (i + this._repeatDelay);
                return i < t && (t = i), this.totalTime(this._yoyo && 1 & s ? i - t + r : this._repeat ? t + r : t, e)
            }, t.duration = function(t) {
                return arguments.length ? s.prototype.duration.call(this, t) : this._duration
            }, t.totalDuration = function(t) {
                return arguments.length ? -1 === this._repeat ? this : this.duration((t - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat, this._dirty = !1), this._totalDuration)
            }, t.repeat = function(t) {
                return arguments.length ? (this._repeat = t, this._uncache(!0)) : this._repeat
            }, t.repeatDelay = function(t) {
                return arguments.length ? (this._repeatDelay = t, this._uncache(!0)) : this._repeatDelay
            }, t.yoyo = function(t) {
                return arguments.length ? (this._yoyo = t, this) : this._yoyo
            }, y
        }, !0), _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(d, c, u) {
            var m = function(t) {
                    c.call(this, t);
                    var e, i, s = this.vars;
                    for (i in this._labels = {}, this.autoRemoveChildren = !!s.autoRemoveChildren, this.smoothChildTiming = !!s.smoothChildTiming, this._sortChildren = !0, this._onUpdate = s.onUpdate, s) e = s[i], f(e) && -1 !== e.join("").indexOf("{self}") && (s[i] = this._swapSelfInParams(e));
                    f(s.tweens) && this.add(s.tweens, 0, s.align, s.stagger)
                },
                t = u._internals,
                e = m._internals = {},
                g = t.isSelector,
                f = t.isArray,
                v = t.lazyTweens,
                y = t.lazyRender,
                n = _gsScope._gsDefine.globals,
                _ = function(t) {
                    var e, i = {};
                    for (e in t) i[e] = t[e];
                    return i
                },
                b = function(t, e, i) {
                    var s, r, a = t.cycle;
                    for (s in a) r = a[s], t[s] = "function" == typeof r ? r(i, e[i], e) : r[i % r.length];
                    delete t.cycle
                },
                a = e.pauseCallback = function() {},
                h = function(t, e, i, s) {
                    var r = "immediateRender";
                    return r in e || (e[r] = !(i && !1 === i[r] || s)), e
                },
                x = function(t) {
                    if ("function" == typeof t) return t;
                    var u = "object" == typeof t ? t : {
                            each: t
                        },
                        m = u.ease,
                        g = u.from || 0,
                        v = u.base || 0,
                        y = {},
                        _ = isNaN(g),
                        b = u.axis,
                        x = {
                            center: .5,
                            end: 1
                        }[g] || 0;
                    return function(t, e, i) {
                        var s, r, a, n, o, l, h, p, d, c = (i || u).length,
                            f = y[c];
                        if (!f) {
                            if (!(d = "auto" === u.grid ? 0 : (u.grid || [1 / 0])[0])) {
                                for (h = -1 / 0; h < (h = i[d++].getBoundingClientRect().left) && d < c;);
                                d--
                            }
                            for (f = y[c] = [], s = _ ? Math.min(d, c) * x - .5 : g % d, r = _ ? c * x / d - .5 : g / d | 0, p = 1 / (h = 0), l = 0; l < c; l++) a = l % d - s, n = r - (l / d | 0), f[l] = o = b ? Math.abs("y" === b ? n : a) : Math.sqrt(a * a + n * n), h < o && (h = o), o < p && (p = o);
                            f.max = h - p, f.min = p, f.v = c = u.amount || u.each * (c < d ? c : b ? "y" === b ? c / d : d : Math.max(d, c / d)) || 0, f.b = c < 0 ? v - c : v
                        }
                        return c = (f[t] - f.min) / f.max, f.b + (m ? m.getRatio(c) : c) * f.v
                    }
                },
                i = m.prototype = new c;
            return m.version = "2.1.2", m.distribute = x, i.constructor = m, i.kill()._gc = i._forcingPlayhead = i._hasPause = !1, i.to = function(t, e, i, s) {
                var r = i.repeat && n.TweenMax || u;
                return e ? this.add(new r(t, e, i), s) : this.set(t, i, s)
            }, i.from = function(t, e, i, s) {
                return this.add((i.repeat && n.TweenMax || u).from(t, e, h(0, i)), s)
            }, i.fromTo = function(t, e, i, s, r) {
                var a = s.repeat && n.TweenMax || u;
                return s = h(0, s, i), e ? this.add(a.fromTo(t, e, i, s), r) : this.set(t, s, r)
            }, i.staggerTo = function(t, e, i, s, r, a, n, o) {
                var l, h, p = new m({
                        onComplete: a,
                        onCompleteParams: n,
                        callbackScope: o,
                        smoothChildTiming: this.smoothChildTiming
                    }),
                    d = x(i.stagger || s),
                    c = i.startAt,
                    f = i.cycle;
                for ("string" == typeof t && (t = u.selector(t) || t), g(t = t || []) && (t = function(t) {
                        var e, i = [],
                            s = t.length;
                        for (e = 0; e !== s; i.push(t[e++]));
                        return i
                    }(t)), h = 0; h < t.length; h++) l = _(i), c && (l.startAt = _(c), c.cycle && b(l.startAt, t, h)), f && (b(l, t, h), null != l.duration && (e = l.duration, delete l.duration)), p.to(t[h], e, l, d(h, t[h], t));
                return this.add(p, r)
            }, i.staggerFrom = function(t, e, i, s, r, a, n, o) {
                return i.runBackwards = !0, this.staggerTo(t, e, h(0, i), s, r, a, n, o)
            }, i.staggerFromTo = function(t, e, i, s, r, a, n, o, l) {
                return s.startAt = i, this.staggerTo(t, e, h(0, s, i), r, a, n, o, l)
            }, i.call = function(t, e, i, s) {
                return this.add(u.delayedCall(0, t, e, i), s)
            }, i.set = function(t, e, i) {
                return this.add(new u(t, 0, h(0, e, null, !0)), i)
            }, m.exportRoot = function(t, e) {
                null == (t = t || {}).smoothChildTiming && (t.smoothChildTiming = !0);
                var i, s, r, a, n = new m(t),
                    o = n._timeline;
                for (null == e && (e = !0), o._remove(n, !0), n._startTime = 0, n._rawPrevTime = n._time = n._totalTime = o._time, r = o._first; r;) a = r._next, e && r instanceof u && r.target === r.vars.onComplete || ((s = r._startTime - r._delay) < 0 && (i = 1), n.add(r, s)), r = a;
                return o.add(n, 0), i && n.totalDuration(), n
            }, i.add = function(t, e, i, s) {
                var r, a, n, o, l, h, p = this;
                if ("number" != typeof e && (e = p._parseTimeOrLabel(e, 0, !0, t)), !(t instanceof d)) {
                    if (t instanceof Array || t && t.push && f(t)) {
                        for (i = i || "normal", s = s || 0, r = e, a = t.length, n = 0; n < a; n++) f(o = t[n]) && (o = new m({
                            tweens: o
                        })), p.add(o, r), "string" != typeof o && "function" != typeof o && ("sequence" === i ? r = o._startTime + o.totalDuration() / o._timeScale : "start" === i && (o._startTime -= o.delay())), r += s;
                        return p._uncache(!0)
                    }
                    if ("string" == typeof t) return p.addLabel(t, e);
                    if ("function" != typeof t) throw "Cannot add " + t + " into the timeline; it is not a tween, timeline, function, or string.";
                    t = u.delayedCall(0, t)
                }
                if (c.prototype.add.call(p, t, e), (t._time || !t._duration && t._initted) && (r = (p.rawTime() - t._startTime) * t._timeScale, (!t._duration || 1e-5 < Math.abs(Math.max(0, Math.min(t.totalDuration(), r))) - t._totalTime) && t.render(r, !1, !1)), (p._gc || p._time === p._duration) && !p._paused && p._duration < p.duration())
                    for (h = (l = p).rawTime() > t._startTime; l._timeline;) h && l._timeline.smoothChildTiming ? l.totalTime(l._totalTime, !0) : l._gc && l._enabled(!0, !1), l = l._timeline;
                return p
            }, i.remove = function(t) {
                if (t instanceof d) {
                    this._remove(t, !1);
                    var e = t._timeline = t.vars.useFrames ? d._rootFramesTimeline : d._rootTimeline;
                    return t._startTime = (t._paused ? t._pauseTime : e._time) - (t._reversed ? t.totalDuration() - t._totalTime : t._totalTime) / t._timeScale, this
                }
                if (t instanceof Array || t && t.push && f(t)) {
                    for (var i = t.length; - 1 < --i;) this.remove(t[i]);
                    return this
                }
                return "string" == typeof t ? this.removeLabel(t) : this.kill(null, t)
            }, i._remove = function(t, e) {
                return c.prototype._remove.call(this, t, e), this._last ? this._time > this.duration() && (this._time = this._duration, this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0, this
            }, i.append = function(t, e) {
                return this.add(t, this._parseTimeOrLabel(null, e, !0, t))
            }, i.insert = i.insertMultiple = function(t, e, i, s) {
                return this.add(t, e || 0, i, s)
            }, i.appendMultiple = function(t, e, i, s) {
                return this.add(t, this._parseTimeOrLabel(null, e, !0, t), i, s)
            }, i.addLabel = function(t, e) {
                return this._labels[t] = this._parseTimeOrLabel(e), this
            }, i.addPause = function(t, e, i, s) {
                var r = u.delayedCall(0, a, i, s || this);
                return r.vars.onComplete = r.vars.onReverseComplete = e, r.data = "isPause", this._hasPause = !0, this.add(r, t)
            }, i.removeLabel = function(t) {
                return delete this._labels[t], this
            }, i.getLabelTime = function(t) {
                return null != this._labels[t] ? this._labels[t] : -1
            }, i._parseTimeOrLabel = function(t, e, i, s) {
                var r, a;
                if (s instanceof d && s.timeline === this) this.remove(s);
                else if (s && (s instanceof Array || s.push && f(s)))
                    for (a = s.length; - 1 < --a;) s[a] instanceof d && s[a].timeline === this && this.remove(s[a]);
                if (r = "number" != typeof t || e ? 99999999999 < this.duration() ? this.recent().endTime(!1) : this._duration : 0, "string" == typeof e) return this._parseTimeOrLabel(e, i && "number" == typeof t && null == this._labels[e] ? t - r : 0, i);
                if (e = e || 0, "string" != typeof t || !isNaN(t) && null == this._labels[t]) null == t && (t = r);
                else {
                    if (-1 === (a = t.indexOf("="))) return null == this._labels[t] ? i ? this._labels[t] = r + e : e : this._labels[t] + e;
                    e = parseInt(t.charAt(a - 1) + "1", 10) * Number(t.substr(a + 1)), t = 1 < a ? this._parseTimeOrLabel(t.substr(0, a - 1), 0, i) : r
                }
                return Number(t) + e
            }, i.seek = function(t, e) {
                return this.totalTime("number" == typeof t ? t : this._parseTimeOrLabel(t), !1 !== e)
            }, i.stop = function() {
                return this.paused(!0)
            }, i.gotoAndPlay = function(t, e) {
                return this.play(t, e)
            }, i.gotoAndStop = function(t, e) {
                return this.pause(t, e)
            }, i.render = function(t, e, i) {
                this._gc && this._enabled(!0, !1);
                var s, r, a, n, o, l, h, p, d = this,
                    c = d._time,
                    f = d._dirty ? d.totalDuration() : d._totalDuration,
                    u = d._startTime,
                    m = d._timeScale,
                    g = d._paused;
                if (c !== d._time && (t += d._time - c), f - 1e-8 <= t && 0 <= t) d._totalTime = d._time = f, d._reversed || d._hasPausedChild() || (r = !0, n = "onComplete", o = !!d._timeline.autoRemoveChildren, 0 === d._duration && (t <= 0 && -1e-8 <= t || d._rawPrevTime < 0 || 1e-8 === d._rawPrevTime) && d._rawPrevTime !== t && d._first && (o = !0, 1e-8 < d._rawPrevTime && (n = "onReverseComplete"))), d._rawPrevTime = d._duration || !e || t || d._rawPrevTime === t ? t : 1e-8, t = f + 1e-4;
                else if (t < 1e-8)
                    if (d._totalTime = d._time = 0, -1e-8 < t && (t = 0), (0 !== c || 0 === d._duration && 1e-8 !== d._rawPrevTime && (0 < d._rawPrevTime || t < 0 && 0 <= d._rawPrevTime)) && (n = "onReverseComplete", r = d._reversed), t < 0) d._active = !1, d._timeline.autoRemoveChildren && d._reversed ? (o = r = !0, n = "onReverseComplete") : 0 <= d._rawPrevTime && d._first && (o = !0), d._rawPrevTime = t;
                    else {
                        if (d._rawPrevTime = d._duration || !e || t || d._rawPrevTime === t ? t : 1e-8, 0 === t && r)
                            for (s = d._first; s && 0 === s._startTime;) s._duration || (r = !1), s = s._next;
                        t = 0, d._initted || (o = !0)
                    }
                else {
                    if (d._hasPause && !d._forcingPlayhead && !e) {
                        if (c <= t)
                            for (s = d._first; s && s._startTime <= t && !l;) s._duration || "isPause" !== s.data || s.ratio || 0 === s._startTime && 0 === d._rawPrevTime || (l = s), s = s._next;
                        else
                            for (s = d._last; s && s._startTime >= t && !l;) s._duration || "isPause" === s.data && 0 < s._rawPrevTime && (l = s), s = s._prev;
                        l && (d._time = d._totalTime = t = l._startTime, p = d._startTime + t / d._timeScale)
                    }
                    d._totalTime = d._time = d._rawPrevTime = t
                }
                if (d._time !== c && d._first || i || o || l) {
                    if (d._initted || (d._initted = !0), d._active || !d._paused && d._time !== c && 0 < t && (d._active = !0), 0 === c && d.vars.onStart && (0 === d._time && d._duration || e || d._callback("onStart")), c <= (h = d._time))
                        for (s = d._first; s && (a = s._next, h === d._time && (!d._paused || g));)(s._active || s._startTime <= h && !s._paused && !s._gc) && (l === s && (d.pause(), d._pauseTime = p), s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), s = a;
                    else
                        for (s = d._last; s && (a = s._prev, h === d._time && (!d._paused || g));) {
                            if (s._active || s._startTime <= c && !s._paused && !s._gc) {
                                if (l === s) {
                                    for (l = s._prev; l && l.endTime() > d._time;) l.render(l._reversed ? l.totalDuration() - (t - l._startTime) * l._timeScale : (t - l._startTime) * l._timeScale, e, i), l = l._prev;
                                    l = null, d.pause(), d._pauseTime = p
                                }
                                s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)
                            }
                            s = a
                        }
                    d._onUpdate && (e || (v.length && y(), d._callback("onUpdate"))), n && (d._gc || (u === d._startTime || m !== d._timeScale) && (0 === d._time || f >= d.totalDuration()) && (r && (v.length && y(), d._timeline.autoRemoveChildren && d._enabled(!1, !1), d._active = !1), !e && d.vars[n] && d._callback(n)))
                }
            }, i._hasPausedChild = function() {
                for (var t = this._first; t;) {
                    if (t._paused || t instanceof m && t._hasPausedChild()) return !0;
                    t = t._next
                }
                return !1
            }, i.getChildren = function(t, e, i, s) {
                s = s || -9999999999;
                for (var r = [], a = this._first, n = 0; a;) a._startTime < s || (a instanceof u ? !1 !== e && (r[n++] = a) : (!1 !== i && (r[n++] = a), !1 !== t && (n = (r = r.concat(a.getChildren(!0, e, i))).length))), a = a._next;
                return r
            }, i.getTweensOf = function(t, e) {
                var i, s, r = this._gc,
                    a = [],
                    n = 0;
                for (r && this._enabled(!0, !0), s = (i = u.getTweensOf(t)).length; - 1 < --s;)(i[s].timeline === this || e && this._contains(i[s])) && (a[n++] = i[s]);
                return r && this._enabled(!1, !0), a
            }, i.recent = function() {
                return this._recent
            }, i._contains = function(t) {
                for (var e = t.timeline; e;) {
                    if (e === this) return !0;
                    e = e.timeline
                }
                return !1
            }, i.shiftChildren = function(t, e, i) {
                i = i || 0;
                for (var s, r = this._first, a = this._labels; r;) r._startTime >= i && (r._startTime += t), r = r._next;
                if (e)
                    for (s in a) a[s] >= i && (a[s] += t);
                return this._uncache(!0)
            }, i._kill = function(t, e) {
                if (!t && !e) return this._enabled(!1, !1);
                for (var i = e ? this.getTweensOf(e) : this.getChildren(!0, !0, !1), s = i.length, r = !1; - 1 < --s;) i[s]._kill(t, e) && (r = !0);
                return r
            }, i.clear = function(t) {
                var e = this.getChildren(!1, !0, !0),
                    i = e.length;
                for (this._time = this._totalTime = 0; - 1 < --i;) e[i]._enabled(!1, !1);
                return !1 !== t && (this._labels = {}), this._uncache(!0)
            }, i.invalidate = function() {
                for (var t = this._first; t;) t.invalidate(), t = t._next;
                return d.prototype.invalidate.call(this)
            }, i._enabled = function(t, e) {
                if (t === this._gc)
                    for (var i = this._first; i;) i._enabled(t, !0), i = i._next;
                return c.prototype._enabled.call(this, t, e)
            }, i.totalTime = function(t, e, i) {
                this._forcingPlayhead = !0;
                var s = d.prototype.totalTime.apply(this, arguments);
                return this._forcingPlayhead = !1, s
            }, i.duration = function(t) {
                return arguments.length ? (0 !== this.duration() && 0 !== t && this.timeScale(this._duration / t), this) : (this._dirty && this.totalDuration(), this._duration)
            }, i.totalDuration = function(t) {
                if (arguments.length) return t && this.totalDuration() ? this.timeScale(this._totalDuration / t) : this;
                if (this._dirty) {
                    for (var e, i, s = 0, r = this, a = r._last, n = 999999999999; a;) e = a._prev, a._dirty && a.totalDuration(), a._startTime > n && r._sortChildren && !a._paused && !r._calculatingDuration ? (r._calculatingDuration = 1, r.add(a, a._startTime - a._delay), r._calculatingDuration = 0) : n = a._startTime, a._startTime < 0 && !a._paused && (s -= a._startTime, r._timeline.smoothChildTiming && (r._startTime += a._startTime / r._timeScale, r._time -= a._startTime, r._totalTime -= a._startTime, r._rawPrevTime -= a._startTime), r.shiftChildren(-a._startTime, !1, -9999999999), n = 0), s < (i = a._startTime + a._totalDuration / a._timeScale) && (s = i), a = e;
                    r._duration = r._totalDuration = s, r._dirty = !1
                }
                return this._totalDuration
            }, i.paused = function(t) {
                if (!1 === t && this._paused)
                    for (var e = this._first; e;) e._startTime === this._time && "isPause" === e.data && (e._rawPrevTime = 0), e = e._next;
                return d.prototype.paused.apply(this, arguments)
            }, i.usesFrames = function() {
                for (var t = this._timeline; t._timeline;) t = t._timeline;
                return t === d._rootFramesTimeline
            }, i.rawTime = function(t) {
                return t && (this._paused || this._repeat && 0 < this.time() && this.totalProgress() < 1) ? this._totalTime % (this._duration + this._repeatDelay) : this._paused ? this._totalTime : (this._timeline.rawTime(t) - this._startTime) * this._timeScale
            }, m
        }, !0), _gsScope._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function(e, o, t) {
            var i = function(t) {
                    e.call(this, t), this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._cycle = 0, this._yoyo = !!this.vars.yoyo, this._dirty = !0
                },
                k = 1e-8,
                s = o._internals,
                M = s.lazyTweens,
                A = s.lazyRender,
                l = _gsScope._gsDefine.globals,
                h = new t(null, null, 1, 0),
                r = i.prototype = new e;
            return r.constructor = i, r.kill()._gc = !1, i.version = "2.1.2", r.invalidate = function() {
                return this._yoyo = !!this.vars.yoyo, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(!0), e.prototype.invalidate.call(this)
            }, r.addCallback = function(t, e, i, s) {
                return this.add(o.delayedCall(0, t, i, s), e)
            }, r.removeCallback = function(t, e) {
                if (t)
                    if (null == e) this._kill(null, t);
                    else
                        for (var i = this.getTweensOf(t, !1), s = i.length, r = this._parseTimeOrLabel(e); - 1 < --s;) i[s]._startTime === r && i[s]._enabled(!1, !1);
                return this
            }, r.removePause = function(t) {
                return this.removeCallback(e._internals.pauseCallback, t)
            }, r.tweenTo = function(t, e) {
                e = e || {};
                var i, s, r, a = {
                        ease: h,
                        useFrames: this.usesFrames(),
                        immediateRender: !1,
                        lazy: !1
                    },
                    n = e.repeat && l.TweenMax || o;
                for (s in e) a[s] = e[s];
                return a.time = this._parseTimeOrLabel(t), i = Math.abs(Number(a.time) - this._time) / this._timeScale || .001, r = new n(this, i, a), a.onStart = function() {
                    r.target.paused(!0), r.vars.time === r.target.time() || i !== r.duration() || r.isFromTo || r.duration(Math.abs(r.vars.time - r.target.time()) / r.target._timeScale).render(r.time(), !0, !0), e.onStart && e.onStart.apply(e.onStartScope || e.callbackScope || r, e.onStartParams || [])
                }, r
            }, r.tweenFromTo = function(t, e, i) {
                i = i || {}, t = this._parseTimeOrLabel(t), i.startAt = {
                    onComplete: this.seek,
                    onCompleteParams: [t],
                    callbackScope: this
                }, i.immediateRender = !1 !== i.immediateRender;
                var s = this.tweenTo(e, i);
                return s.isFromTo = 1, s.duration(Math.abs(s.vars.time - t) / this._timeScale || .001)
            }, r.render = function(t, e, i) {
                this._gc && this._enabled(!0, !1);
                var s, r, a, n, o, l, h, p, d, c = this,
                    f = c._time,
                    u = c._dirty ? c.totalDuration() : c._totalDuration,
                    m = c._duration,
                    g = c._totalTime,
                    v = c._startTime,
                    y = c._timeScale,
                    _ = c._rawPrevTime,
                    b = c._paused,
                    x = c._cycle;
                if (f !== c._time && (t += c._time - f), u - k <= t && 0 <= t) c._locked || (c._totalTime = u, c._cycle = c._repeat), c._reversed || c._hasPausedChild() || (r = !0, n = "onComplete", o = !!c._timeline.autoRemoveChildren, 0 === c._duration && (t <= 0 && -k <= t || _ < 0 || _ === k) && _ !== t && c._first && (o = !0, k < _ && (n = "onReverseComplete"))), c._rawPrevTime = c._duration || !e || t || c._rawPrevTime === t ? t : k, c._yoyo && 1 & c._cycle ? c._time = t = 0 : t = (c._time = m) + 1e-4;
                else if (t < k)
                    if (c._locked || (c._totalTime = c._cycle = 0), c._time = 0, -k < t && (t = 0), (0 !== f || 0 === m && _ !== k && (0 < _ || t < 0 && 0 <= _) && !c._locked) && (n = "onReverseComplete", r = c._reversed), t < 0) c._active = !1, c._timeline.autoRemoveChildren && c._reversed ? (o = r = !0, n = "onReverseComplete") : 0 <= _ && c._first && (o = !0), c._rawPrevTime = t;
                    else {
                        if (c._rawPrevTime = m || !e || t || c._rawPrevTime === t ? t : k, 0 === t && r)
                            for (s = c._first; s && 0 === s._startTime;) s._duration || (r = !1), s = s._next;
                        t = 0, c._initted || (o = !0)
                    }
                else if (0 === m && _ < 0 && (o = !0), c._time = c._rawPrevTime = t, c._locked || (c._totalTime = t, 0 !== c._repeat && (l = m + c._repeatDelay, c._cycle = c._totalTime / l >> 0, c._cycle && c._cycle === c._totalTime / l && g <= t && c._cycle--, c._time = c._totalTime - c._cycle * l, c._yoyo && 1 & c._cycle && (c._time = m - c._time), c._time > m ? t = (c._time = m) + 1e-4 : c._time < 0 ? c._time = t = 0 : t = c._time)), c._hasPause && !c._forcingPlayhead && !e) {
                    if (f <= (t = c._time) || c._repeat && x !== c._cycle)
                        for (s = c._first; s && s._startTime <= t && !h;) s._duration || "isPause" !== s.data || s.ratio || 0 === s._startTime && 0 === c._rawPrevTime || (h = s), s = s._next;
                    else
                        for (s = c._last; s && s._startTime >= t && !h;) s._duration || "isPause" === s.data && 0 < s._rawPrevTime && (h = s), s = s._prev;
                    h && (d = c._startTime + h._startTime / c._timeScale, h._startTime < m && (c._time = c._rawPrevTime = t = h._startTime, c._totalTime = t + c._cycle * (c._totalDuration + c._repeatDelay)))
                }
                if (c._cycle !== x && !c._locked) {
                    var T = c._yoyo && 0 != (1 & x),
                        w = T === (c._yoyo && 0 != (1 & c._cycle)),
                        E = c._totalTime,
                        S = c._cycle,
                        P = c._rawPrevTime,
                        C = c._time;
                    if (c._totalTime = x * m, c._cycle < x ? T = !T : c._totalTime += m, c._time = f, c._rawPrevTime = 0 === m ? _ - 1e-4 : _, c._cycle = x, c._locked = !0, f = T ? 0 : m, c.render(f, e, 0 === m), e || c._gc || c.vars.onRepeat && (c._cycle = S, c._locked = !1, c._callback("onRepeat")), f !== c._time) return;
                    if (w && (c._cycle = x, c._locked = !0, f = T ? m + 1e-4 : -1e-4, c.render(f, !0, !1)), c._locked = !1, c._paused && !b) return;
                    c._time = C, c._totalTime = E, c._cycle = S, c._rawPrevTime = P
                }
                if (c._time !== f && c._first || i || o || h) {
                    if (c._initted || (c._initted = !0), c._active || !c._paused && c._totalTime !== g && 0 < t && (c._active = !0), 0 === g && c.vars.onStart && (0 === c._totalTime && c._totalDuration || e || c._callback("onStart")), f <= (p = c._time))
                        for (s = c._first; s && (a = s._next, p === c._time && (!c._paused || b));)(s._active || s._startTime <= c._time && !s._paused && !s._gc) && (h === s && (c.pause(), c._pauseTime = d), s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), s = a;
                    else
                        for (s = c._last; s && (a = s._prev, p === c._time && (!c._paused || b));) {
                            if (s._active || s._startTime <= f && !s._paused && !s._gc) {
                                if (h === s) {
                                    for (h = s._prev; h && h.endTime() > c._time;) h.render(h._reversed ? h.totalDuration() - (t - h._startTime) * h._timeScale : (t - h._startTime) * h._timeScale, e, i), h = h._prev;
                                    h = null, c.pause(), c._pauseTime = d
                                }
                                s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)
                            }
                            s = a
                        }
                    c._onUpdate && (e || (M.length && A(), c._callback("onUpdate"))), n && (c._locked || c._gc || (v === c._startTime || y !== c._timeScale) && (0 === c._time || u >= c.totalDuration()) && (r && (M.length && A(), c._timeline.autoRemoveChildren && c._enabled(!1, !1), c._active = !1), !e && c.vars[n] && c._callback(n)))
                } else g !== c._totalTime && c._onUpdate && (e || c._callback("onUpdate"))
            }, r.getActive = function(t, e, i) {
                var s, r, a = [],
                    n = this.getChildren(t || null == t, e || null == t, !!i),
                    o = 0,
                    l = n.length;
                for (s = 0; s < l; s++)(r = n[s]).isActive() && (a[o++] = r);
                return a
            }, r.getLabelAfter = function(t) {
                t || 0 !== t && (t = this._time);
                var e, i = this.getLabelsArray(),
                    s = i.length;
                for (e = 0; e < s; e++)
                    if (i[e].time > t) return i[e].name;
                return null
            }, r.getLabelBefore = function(t) {
                null == t && (t = this._time);
                for (var e = this.getLabelsArray(), i = e.length; - 1 < --i;)
                    if (e[i].time < t) return e[i].name;
                return null
            }, r.getLabelsArray = function() {
                var t, e = [],
                    i = 0;
                for (t in this._labels) e[i++] = {
                    time: this._labels[t],
                    name: t
                };
                return e.sort(function(t, e) {
                    return t.time - e.time
                }), e
            }, r.invalidate = function() {
                return this._locked = !1, e.prototype.invalidate.call(this)
            }, r.progress = function(t, e) {
                return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 != (1 & this._cycle) ? 1 - t : t) + this._cycle * (this._duration + this._repeatDelay), e) : this._time / this.duration() || 0
            }, r.totalProgress = function(t, e) {
                return arguments.length ? this.totalTime(this.totalDuration() * t, e) : this._totalTime / this.totalDuration() || 0
            }, r.totalDuration = function(t) {
                return arguments.length ? -1 !== this._repeat && t ? this.timeScale(this.totalDuration() / t) : this : (this._dirty && (e.prototype.totalDuration.call(this), this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), this._totalDuration)
            }, r.time = function(t, e) {
                if (!arguments.length) return this._time;
                this._dirty && this.totalDuration();
                var i = this._duration,
                    s = this._cycle,
                    r = s * (i + this._repeatDelay);
                return i < t && (t = i), this.totalTime(this._yoyo && 1 & s ? i - t + r : this._repeat ? t + r : t, e)
            }, r.repeat = function(t) {
                return arguments.length ? (this._repeat = t, this._uncache(!0)) : this._repeat
            }, r.repeatDelay = function(t) {
                return arguments.length ? (this._repeatDelay = t, this._uncache(!0)) : this._repeatDelay
            }, r.yoyo = function(t) {
                return arguments.length ? (this._yoyo = t, this) : this._yoyo
            }, r.currentLabel = function(t) {
                return arguments.length ? this.seek(t, !0) : this.getLabelBefore(this._time + k)
            }, i
        }, !0), w = 180 / Math.PI, x = [], T = [], E = [], v = {}, i = _gsScope._gsDefine.globals, y = function(t, e, i, s) {
            i === s && (i = s - (s - e) / 1e6), t === e && (e = t + (i - t) / 1e6), this.a = t, this.b = e, this.c = i, this.d = s, this.da = s - t, this.ca = i - t, this.ba = e - t
        }, S = function(t, e, i, s) {
            var r = {
                    a: t
                },
                a = {},
                n = {},
                o = {
                    c: s
                },
                l = (t + e) / 2,
                h = (e + i) / 2,
                p = (i + s) / 2,
                d = (l + h) / 2,
                c = (h + p) / 2,
                f = (c - d) / 8;
            return r.b = l + (t - l) / 4, a.b = d + f, r.c = a.a = (r.b + a.b) / 2, a.c = n.a = (d + c) / 2, n.b = c - f, o.b = p + (s - p) / 4, n.c = o.a = (n.b + o.b) / 2, [r, a, n, o]
        }, _ = function(t, e, i, s, r) {
            var a, n, o, l, h, p, d, c, f, u, m, g, v, y = t.length - 1,
                _ = 0,
                b = t[0].a;
            for (a = 0; a < y; a++) n = (h = t[_]).a, o = h.d, l = t[_ + 1].d, c = r ? (m = x[a], v = ((g = T[a]) + m) * e * .25 / (s ? .5 : E[a] || .5), o - ((p = o - (o - n) * (s ? .5 * e : 0 !== m ? v / m : 0)) + (((d = o + (l - o) * (s ? .5 * e : 0 !== g ? v / g : 0)) - p) * (3 * m / (m + g) + .5) / 4 || 0))) : o - ((p = o - (o - n) * e * .5) + (d = o + (l - o) * e * .5)) / 2, p += c, d += c, h.c = f = p, h.b = 0 !== a ? b : b = h.a + .6 * (h.c - h.a), h.da = o - n, h.ca = f - n, h.ba = b - n, i ? (u = S(n, b, f, o), t.splice(_, 1, u[0], u[1], u[2], u[3]), _ += 4) : _++, b = d;
            (h = t[_]).b = b, h.c = b + .4 * (h.d - b), h.da = h.d - h.a, h.ca = h.c - h.a, h.ba = b - h.a, i && (u = S(h.a, b, h.c, h.d), t.splice(_, 1, u[0], u[1], u[2], u[3]))
        }, b = function(t, e, i, s) {
            var r, a, n, o, l, h, p = [];
            if (s)
                for (a = (t = [s].concat(t)).length; - 1 < --a;) "string" == typeof(h = t[a][e]) && "=" === h.charAt(1) && (t[a][e] = s[e] + Number(h.charAt(0) + h.substr(2)));
            if ((r = t.length - 2) < 0) return p[0] = new y(t[0][e], 0, 0, t[0][e]), p;
            for (a = 0; a < r; a++) n = t[a][e], o = t[a + 1][e], p[a] = new y(n, 0, 0, o), i && (l = t[a + 2][e], x[a] = (x[a] || 0) + (o - n) * (o - n), T[a] = (T[a] || 0) + (l - o) * (l - o));
            return p[a] = new y(t[a][e], 0, 0, t[a + 1][e]), p
        }, f = function(t, e, i, s, r, a) {
            var n, o, l, h, p, d, c, f, u = {},
                m = [],
                g = a || t[0];
            for (o in r = "string" == typeof r ? "," + r + "," : ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,", null == e && (e = 1), t[0]) m.push(o);
            if (1 < t.length) {
                for (f = t[t.length - 1], c = !0, n = m.length; - 1 < --n;)
                    if (o = m[n], .05 < Math.abs(g[o] - f[o])) {
                        c = !1;
                        break
                    }
                c && (t = t.concat(), a && t.unshift(a), t.push(t[1]), a = t[t.length - 3])
            }
            for (x.length = T.length = E.length = 0, n = m.length; - 1 < --n;) o = m[n], v[o] = -1 !== r.indexOf("," + o + ","), u[o] = b(t, o, v[o], a);
            for (n = x.length; - 1 < --n;) x[n] = Math.sqrt(x[n]), T[n] = Math.sqrt(T[n]);
            if (!s) {
                for (n = m.length; - 1 < --n;)
                    if (v[o])
                        for (d = (l = u[m[n]]).length - 1, h = 0; h < d; h++) p = l[h + 1].da / T[h] + l[h].da / x[h] || 0, E[h] = (E[h] || 0) + p * p;
                for (n = E.length; - 1 < --n;) E[n] = Math.sqrt(E[n])
            }
            for (n = m.length, h = i ? 4 : 1; - 1 < --n;) l = u[o = m[n]], _(l, e, i, s, v[o]), c && (l.splice(0, h), l.splice(l.length - h, h));
            return u
        }, u = function(t, e, i) {
            for (var s, r, a, n, o, l, h, p, d, c, f, u = 1 / i, m = t.length; - 1 < --m;)
                for (a = (c = t[m]).a, n = c.d - a, o = c.c - a, l = c.b - a, s = r = 0, p = 1; p <= i; p++) s = r - (r = ((h = u * p) * h * n + 3 * (d = 1 - h) * (h * o + d * l)) * h), e[f = m * i + p - 1] = (e[f] || 0) + s * s
        }, g = _gsScope._gsDefine.plugin({
            propName: "bezier",
            priority: -1,
            version: "1.3.8",
            API: 2,
            global: !0,
            init: function(t, e, i) {
                this._target = t, e instanceof Array && (e = {
                    values: e
                }), this._func = {}, this._mod = {}, this._props = [], this._timeRes = null == e.timeResolution ? 6 : parseInt(e.timeResolution, 10);
                var s, r, a, n, o, l = e.values || [],
                    h = {},
                    p = l[0],
                    d = e.autoRotate || i.vars.orientToBezier;
                for (s in this._autoRotate = d ? d instanceof Array ? d : [
                        ["x", "y", "rotation", !0 === d ? 0 : Number(d) || 0]
                    ] : null, p) this._props.push(s);
                for (a = this._props.length; - 1 < --a;) s = this._props[a], this._overwriteProps.push(s), r = this._func[s] = "function" == typeof t[s], h[s] = r ? t[s.indexOf("set") || "function" != typeof t["get" + s.substr(3)] ? s : "get" + s.substr(3)]() : parseFloat(t[s]), o || h[s] !== l[0][s] && (o = h);
                if (this._beziers = "cubic" !== e.type && "quadratic" !== e.type && "soft" !== e.type ? f(l, isNaN(e.curviness) ? 1 : e.curviness, !1, "thruBasic" === e.type, e.correlate, o) : function(t, e, i) {
                        var s, r, a, n, o, l, h, p, d, c, f, u = {},
                            m = "cubic" === (e = e || "soft") ? 3 : 2,
                            g = "soft" === e,
                            v = [];
                        if (g && i && (t = [i].concat(t)), null == t || t.length < m + 1) throw "invalid Bezier data";
                        for (d in t[0]) v.push(d);
                        for (l = v.length; - 1 < --l;) {
                            for (u[d = v[l]] = o = [], c = 0, p = t.length, h = 0; h < p; h++) s = null == i ? t[h][d] : "string" == typeof(f = t[h][d]) && "=" === f.charAt(1) ? i[d] + Number(f.charAt(0) + f.substr(2)) : Number(f), g && 1 < h && h < p - 1 && (o[c++] = (s + o[c - 2]) / 2), o[c++] = s;
                            for (p = c - m + 1, h = c = 0; h < p; h += m) s = o[h], r = o[h + 1], a = o[h + 2], n = 2 === m ? 0 : o[h + 3], o[c++] = f = 3 === m ? new y(s, r, a, n) : new y(s, (2 * r + s) / 3, (2 * r + a) / 3, a);
                            o.length = c
                        }
                        return u
                    }(l, e.type, h), this._segCount = this._beziers[s].length, this._timeRes) {
                    var c = function(t, e) {
                        var i, s, r, a, n = [],
                            o = [],
                            l = 0,
                            h = 0,
                            p = (e = e >> 0 || 6) - 1,
                            d = [],
                            c = [];
                        for (i in t) u(t[i], n, e);
                        for (r = n.length, s = 0; s < r; s++) l += Math.sqrt(n[s]), c[a = s % e] = l, a === p && (h += l, d[a = s / e >> 0] = c, o[a] = h, l = 0, c = []);
                        return {
                            length: h,
                            lengths: o,
                            segments: d
                        }
                    }(this._beziers, this._timeRes);
                    this._length = c.length, this._lengths = c.lengths, this._segments = c.segments, this._l1 = this._li = this._s1 = this._si = 0, this._l2 = this._lengths[0], this._curSeg = this._segments[0], this._s2 = this._curSeg[0], this._prec = 1 / this._curSeg.length
                }
                if (d = this._autoRotate)
                    for (this._initialRotations = [], d[0] instanceof Array || (this._autoRotate = d = [d]), a = d.length; - 1 < --a;) {
                        for (n = 0; n < 3; n++) s = d[a][n], this._func[s] = "function" == typeof t[s] && t[s.indexOf("set") || "function" != typeof t["get" + s.substr(3)] ? s : "get" + s.substr(3)];
                        s = d[a][2], this._initialRotations[a] = (this._func[s] ? this._func[s].call(this._target) : this._target[s]) || 0, this._overwriteProps.push(s)
                    }
                return this._startRatio = i.vars.runBackwards ? 1 : 0, !0
            },
            set: function(t) {
                var e, i, s, r, a, n, o, l, h, p, d = this._segCount,
                    c = this._func,
                    f = this._target,
                    u = t !== this._startRatio;
                if (this._timeRes) {
                    if (h = this._lengths, p = this._curSeg, t *= this._length, s = this._li, t > this._l2 && s < d - 1) {
                        for (l = d - 1; s < l && (this._l2 = h[++s]) <= t;);
                        this._l1 = h[s - 1], this._li = s, this._curSeg = p = this._segments[s], this._s2 = p[this._s1 = this._si = 0]
                    } else if (t < this._l1 && 0 < s) {
                        for (; 0 < s && (this._l1 = h[--s]) >= t;);
                        0 === s && t < this._l1 ? this._l1 = 0 : s++, this._l2 = h[s], this._li = s, this._curSeg = p = this._segments[s], this._s1 = p[(this._si = p.length - 1) - 1] || 0, this._s2 = p[this._si]
                    }
                    if (e = s, t -= this._l1, s = this._si, t > this._s2 && s < p.length - 1) {
                        for (l = p.length - 1; s < l && (this._s2 = p[++s]) <= t;);
                        this._s1 = p[s - 1], this._si = s
                    } else if (t < this._s1 && 0 < s) {
                        for (; 0 < s && (this._s1 = p[--s]) >= t;);
                        0 === s && t < this._s1 ? this._s1 = 0 : s++, this._s2 = p[s], this._si = s
                    }
                    n = (s + (t - this._s1) / (this._s2 - this._s1)) * this._prec || 0
                } else n = (t - (e = t < 0 ? 0 : 1 <= t ? d - 1 : d * t >> 0) * (1 / d)) * d;
                for (i = 1 - n, s = this._props.length; - 1 < --s;) r = this._props[s], o = (n * n * (a = this._beziers[r][e]).da + 3 * i * (n * a.ca + i * a.ba)) * n + a.a, this._mod[r] && (o = this._mod[r](o, f)), c[r] ? f[r](o) : f[r] = o;
                if (this._autoRotate) {
                    var m, g, v, y, _, b, x, T = this._autoRotate;
                    for (s = T.length; - 1 < --s;) r = T[s][2], b = T[s][3] || 0, x = !0 === T[s][4] ? 1 : w, a = this._beziers[T[s][0]], m = this._beziers[T[s][1]], a && m && (a = a[e], m = m[e], g = a.a + (a.b - a.a) * n, g += ((y = a.b + (a.c - a.b) * n) - g) * n, y += (a.c + (a.d - a.c) * n - y) * n, v = m.a + (m.b - m.a) * n, v += ((_ = m.b + (m.c - m.b) * n) - v) * n, _ += (m.c + (m.d - m.c) * n - _) * n, o = u ? Math.atan2(_ - v, y - g) * x + b : this._initialRotations[s], this._mod[r] && (o = this._mod[r](o, f)), c[r] ? f[r](o) : f[r] = o)
                }
            }
        }), s = g.prototype, g.bezierThrough = f, g.cubicToQuadratic = S, g._autoCSS = !0, g.quadraticToCubic = function(t, e, i) {
            return new y(t, (2 * e + t) / 3, (2 * e + i) / 3, i)
        }, g._cssRegister = function() {
            var t = i.CSSPlugin;
            if (t) {
                var e = t._internals,
                    f = e._parseToProxy,
                    u = e._setPluginRatio,
                    m = e.CSSPropTween;
                e._registerComplexSpecialProp("bezier", {
                    parser: function(t, e, i, s, r, a) {
                        e instanceof Array && (e = {
                            values: e
                        }), a = new g;
                        var n, o, l, h = e.values,
                            p = h.length - 1,
                            d = [],
                            c = {};
                        if (p < 0) return r;
                        for (n = 0; n <= p; n++) l = f(t, h[n], s, r, a, p !== n), d[n] = l.end;
                        for (o in e) c[o] = e[o];
                        return c.values = d, (r = new m(t, "bezier", 0, 0, l.pt, 2)).data = l, r.plugin = a, r.setRatio = u, 0 === c.autoRotate && (c.autoRotate = !0), !c.autoRotate || c.autoRotate instanceof Array || (n = !0 === c.autoRotate ? 0 : Number(c.autoRotate), c.autoRotate = null != l.end.left ? [
                            ["left", "top", "rotation", n, !1]
                        ] : null != l.end.x && [
                            ["x", "y", "rotation", n, !1]
                        ]), c.autoRotate && (s._transform || s._enableTransforms(!1), l.autoRotate = s._target._gsTransform, l.proxy.rotation = l.autoRotate.rotation || 0, s._overwriteProps.push("rotation")), a._onInitTween(l.proxy, c, s._tween), r
                    }
                })
            }
        }, s._mod = function(t) {
            for (var e, i = this._overwriteProps, s = i.length; - 1 < --s;)(e = t[i[s]]) && "function" == typeof e && (this._mod[i[s]] = e)
        }, s._kill = function(t) {
            var e, i, s = this._props;
            for (e in this._beziers)
                if (e in t)
                    for (delete this._beziers[e], delete this._func[e], i = s.length; - 1 < --i;) s[i] === e && s.splice(i, 1);
            if (s = this._autoRotate)
                for (i = s.length; - 1 < --i;) t[s[i][2]] && s.splice(i, 1);
            return this._super._kill.call(this, t)
        }, _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function(a, N) {
            var u, E, S, m, G = function() {
                    a.call(this, "css"), this._overwriteProps.length = 0, this.setRatio = G.prototype.setRatio
                },
                h = _gsScope._gsDefine.globals,
                g = {},
                t = G.prototype = new a("css");
            (t.constructor = G).version = "2.1.0", G.API = 2, G.defaultTransformPerspective = 0, G.defaultSkewType = "compensated", G.defaultSmoothOrigin = !0, t = "px", G.suffixMap = {
                top: t,
                right: t,
                bottom: t,
                left: t,
                width: t,
                height: t,
                fontSize: t,
                padding: t,
                margin: t,
                perspective: t,
                lineHeight: ""
            };
            var C, v, y, L, _, P, k, M, e, i, A = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
                D = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
                b = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
                p = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
                I = /(?:\d|\-|\+|=|#|\.)*/g,
                F = /opacity *= *([^)]*)/i,
                x = /opacity:([^;]*)/i,
                n = /alpha\(opacity *=.+?\)/i,
                T = /^(rgb|hsl)/,
                o = /([A-Z])/g,
                l = /-([a-z])/gi,
                w = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
                d = function(t, e) {
                    return e.toUpperCase()
                },
                f = /(?:Left|Right|Width)/i,
                c = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
                R = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
                O = /,(?=[^\)]*(?:\(|$))/gi,
                z = /[\s,\(]/i,
                B = Math.PI / 180,
                H = 180 / Math.PI,
                V = {},
                s = {
                    style: {}
                },
                $ = _gsScope.document || {
                    createElement: function() {
                        return s
                    }
                },
                j = function(t, e) {
                    return e && $.createElementNS ? $.createElementNS(e, t) : $.createElement(t)
                },
                X = j("div"),
                Y = j("img"),
                r = G._internals = {
                    _specialProps: g
                },
                q = (_gsScope.navigator || {}).userAgent || "",
                W = (e = q.indexOf("Android"), i = j("a"), y = -1 !== q.indexOf("Safari") && -1 === q.indexOf("Chrome") && (-1 === e || 3 < parseFloat(q.substr(e + 8, 2))), _ = y && parseFloat(q.substr(q.indexOf("Version/") + 8, 2)) < 6, L = -1 !== q.indexOf("Firefox"), (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(q) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(q)) && (P = parseFloat(RegExp.$1)), !!i && (i.style.cssText = "top:1px;opacity:.55;", /^0.55/.test(i.style.opacity))),
                U = function(t) {
                    return F.test("string" == typeof t ? t : (t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
                },
                K = function(t) {
                    _gsScope.console && console.log(t)
                },
                Z = "",
                Q = "",
                J = function(t, e) {
                    var i, s, r = (e = e || X).style;
                    if (void 0 !== r[t]) return t;
                    for (t = t.charAt(0).toUpperCase() + t.substr(1), i = ["O", "Moz", "ms", "Ms", "Webkit"], s = 5; - 1 < --s && void 0 === r[i[s] + t];);
                    return 0 <= s ? (Z = "-" + (Q = 3 === s ? "ms" : i[s]).toLowerCase() + "-", Q + t) : null
                },
                tt = "undefined" != typeof window ? window : $.defaultView || {
                    getComputedStyle: function() {}
                },
                et = function(t) {
                    return tt.getComputedStyle(t)
                },
                it = G.getStyle = function(t, e, i, s, r) {
                    var a;
                    return W || "opacity" !== e ? (!s && t.style[e] ? a = t.style[e] : (i = i || et(t)) ? a = i[e] || i.getPropertyValue(e) || i.getPropertyValue(e.replace(o, "-$1").toLowerCase()) : t.currentStyle && (a = t.currentStyle[e]), null == r || a && "none" !== a && "auto" !== a && "auto auto" !== a ? a : r) : U(t)
                },
                st = r.convertToPixels = function(t, e, i, s, r) {
                    if ("px" === s || !s && "lineHeight" !== e) return i;
                    if ("auto" === s || !i) return 0;
                    var a, n, o, l = f.test(e),
                        h = t,
                        p = X.style,
                        d = i < 0,
                        c = 1 === i;
                    if (d && (i = -i), c && (i *= 100), "lineHeight" !== e || s)
                        if ("%" === s && -1 !== e.indexOf("border")) a = i / 100 * (l ? t.clientWidth : t.clientHeight);
                        else {
                            if (p.cssText = "border:0 solid red;position:" + it(t, "position") + ";line-height:0;", "%" !== s && h.appendChild && "v" !== s.charAt(0) && "rem" !== s) p[l ? "borderLeftWidth" : "borderTopWidth"] = i + s;
                            else {
                                if (h = t.parentNode || $.body, -1 !== it(h, "display").indexOf("flex") && (p.position = "absolute"), n = h._gsCache, o = N.ticker.frame, n && l && n.time === o) return n.width * i / 100;
                                p[l ? "width" : "height"] = i + s
                            }
                            h.appendChild(X), a = parseFloat(X[l ? "offsetWidth" : "offsetHeight"]), h.removeChild(X), l && "%" === s && !1 !== G.cacheWidths && ((n = h._gsCache = h._gsCache || {}).time = o, n.width = a / i * 100), 0 !== a || r || (a = st(t, e, i, s, !0))
                        }
                    else n = et(t).lineHeight, t.style.lineHeight = i, a = parseFloat(et(t).lineHeight), t.style.lineHeight = n;
                    return c && (a /= 100), d ? -a : a
                },
                rt = r.calculateOffset = function(t, e, i) {
                    if ("absolute" !== it(t, "position", i)) return 0;
                    var s = "left" === e ? "Left" : "Top",
                        r = it(t, "margin" + s, i);
                    return t["offset" + s] - (st(t, e, parseFloat(r), r.replace(I, "")) || 0)
                },
                at = function(t, e) {
                    var i, s, r, a = {};
                    if (e = e || et(t))
                        if (i = e.length)
                            for (; - 1 < --i;)(-1 === (r = e[i]).indexOf("-transform") || zt === r) && (a[r.replace(l, d)] = e.getPropertyValue(r));
                        else
                            for (i in e)(-1 === i.indexOf("Transform") || Ot === i) && (a[i] = e[i]);
                    else if (e = t.currentStyle || t.style)
                        for (i in e) "string" == typeof i && void 0 === a[i] && (a[i.replace(l, d)] = e[i]);
                    return W || (a.opacity = U(t)), s = Ut(t, e, !1), a.rotation = s.rotation, a.skewX = s.skewX, a.scaleX = s.scaleX, a.scaleY = s.scaleY, a.x = s.x, a.y = s.y, Bt && (a.z = s.z, a.rotationX = s.rotationX, a.rotationY = s.rotationY, a.scaleZ = s.scaleZ), a.filters && delete a.filters, a
                },
                nt = function(t, e, i, s, r) {
                    var a, n, o, l = {},
                        h = t.style;
                    for (n in i) "cssText" !== n && "length" !== n && isNaN(n) && (e[n] !== (a = i[n]) || r && r[n]) && -1 === n.indexOf("Origin") && ("number" == typeof a || "string" == typeof a) && (l[n] = "auto" !== a || "left" !== n && "top" !== n ? "" !== a && "auto" !== a && "none" !== a || "string" != typeof e[n] || "" === e[n].replace(p, "") ? a : 0 : rt(t, n), void 0 !== h[n] && (o = new xt(h, n, h[n], o)));
                    if (s)
                        for (n in s) "className" !== n && (l[n] = s[n]);
                    return {
                        difs: l,
                        firstMPT: o
                    }
                },
                ot = {
                    width: ["Left", "Right"],
                    height: ["Top", "Bottom"]
                },
                lt = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
                ht = function(t, e, i) {
                    if ("svg" === (t.nodeName + "").toLowerCase()) return (i || et(t))[e] || 0;
                    if (t.getCTM && Yt(t)) return t.getBBox()[e] || 0;
                    var s = parseFloat("width" === e ? t.offsetWidth : t.offsetHeight),
                        r = ot[e],
                        a = r.length;
                    for (i = i || et(t); - 1 < --a;) s -= parseFloat(it(t, "padding" + r[a], i, !0)) || 0, s -= parseFloat(it(t, "border" + r[a] + "Width", i, !0)) || 0;
                    return s
                },
                pt = function(t, e) {
                    if ("contain" === t || "auto" === t || "auto auto" === t) return t + " ";
                    (null == t || "" === t) && (t = "0 0");
                    var i, s = t.split(" "),
                        r = -1 !== t.indexOf("left") ? "0%" : -1 !== t.indexOf("right") ? "100%" : s[0],
                        a = -1 !== t.indexOf("top") ? "0%" : -1 !== t.indexOf("bottom") ? "100%" : s[1];
                    if (3 < s.length && !e) {
                        for (s = t.split(", ").join(",").split(","), t = [], i = 0; i < s.length; i++) t.push(pt(s[i]));
                        return t.join(",")
                    }
                    return null == a ? a = "center" === r ? "50%" : "0" : "center" === a && (a = "50%"), ("center" === r || isNaN(parseFloat(r)) && -1 === (r + "").indexOf("=")) && (r = "50%"), t = r + " " + a + (2 < s.length ? " " + s[2] : ""), e && (e.oxp = -1 !== r.indexOf("%"), e.oyp = -1 !== a.indexOf("%"), e.oxr = "=" === r.charAt(1), e.oyr = "=" === a.charAt(1), e.ox = parseFloat(r.replace(p, "")), e.oy = parseFloat(a.replace(p, "")), e.v = t), e || t
                },
                dt = function(t, e) {
                    return "function" == typeof t && (t = t(M, k)), "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) : parseFloat(t) - parseFloat(e) || 0
                },
                ct = function(t, e) {
                    "function" == typeof t && (t = t(M, k));
                    var i = "string" == typeof t && "=" === t.charAt(1);
                    return "string" == typeof t && "v" === t.charAt(t.length - 2) && (t = (i ? t.substr(0, 2) : 0) + window["inner" + ("vh" === t.substr(-2) ? "Height" : "Width")] * (parseFloat(i ? t.substr(2) : t) / 100)), null == t ? e : i ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) + e : parseFloat(t) || 0
                },
                ft = function(t, e, i, s) {
                    var r, a, n, o;
                    return "function" == typeof t && (t = t(M, k)), (n = null == t ? e : "number" == typeof t ? t : (360, r = t.split("_"), a = ((o = "=" === t.charAt(1)) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(r[0].substr(2)) : parseFloat(r[0])) * (-1 === t.indexOf("rad") ? 1 : H) - (o ? 0 : e), r.length && (s && (s[i] = e + a), -1 !== t.indexOf("short") && ((a %= 360) !== a % 180 && (a = a < 0 ? a + 360 : a - 360)), -1 !== t.indexOf("_cw") && a < 0 ? a = (a + 3599999999640) % 360 - 360 * (a / 360 | 0) : -1 !== t.indexOf("ccw") && 0 < a && (a = (a - 3599999999640) % 360 - 360 * (a / 360 | 0))), e + a)) < 1e-6 && -1e-6 < n && (n = 0), n
                },
                ut = {
                    aqua: [0, 255, 255],
                    lime: [0, 255, 0],
                    silver: [192, 192, 192],
                    black: [0, 0, 0],
                    maroon: [128, 0, 0],
                    teal: [0, 128, 128],
                    blue: [0, 0, 255],
                    navy: [0, 0, 128],
                    white: [255, 255, 255],
                    fuchsia: [255, 0, 255],
                    olive: [128, 128, 0],
                    yellow: [255, 255, 0],
                    orange: [255, 165, 0],
                    gray: [128, 128, 128],
                    purple: [128, 0, 128],
                    green: [0, 128, 0],
                    red: [255, 0, 0],
                    pink: [255, 192, 203],
                    cyan: [0, 255, 255],
                    transparent: [255, 255, 255, 0]
                },
                mt = function(t, e, i) {
                    return 255 * (6 * (t = t < 0 ? t + 1 : 1 < t ? t - 1 : t) < 1 ? e + (i - e) * t * 6 : t < .5 ? i : 3 * t < 2 ? e + (i - e) * (2 / 3 - t) * 6 : e) + .5 | 0
                },
                gt = G.parseColor = function(t, e) {
                    var i, s, r, a, n, o, l, h, p, d, c;
                    if (t)
                        if ("number" == typeof t) i = [t >> 16, t >> 8 & 255, 255 & t];
                        else {
                            if ("," === t.charAt(t.length - 1) && (t = t.substr(0, t.length - 1)), ut[t]) i = ut[t];
                            else if ("#" === t.charAt(0)) 4 === t.length && (t = "#" + (s = t.charAt(1)) + s + (r = t.charAt(2)) + r + (a = t.charAt(3)) + a), i = [(t = parseInt(t.substr(1), 16)) >> 16, t >> 8 & 255, 255 & t];
                            else if ("hsl" === t.substr(0, 3))
                                if (i = c = t.match(A), e) {
                                    if (-1 !== t.indexOf("=")) return t.match(D)
                                } else n = Number(i[0]) % 360 / 360, o = Number(i[1]) / 100, s = 2 * (l = Number(i[2]) / 100) - (r = l <= .5 ? l * (o + 1) : l + o - l * o), 3 < i.length && (i[3] = Number(i[3])), i[0] = mt(n + 1 / 3, s, r), i[1] = mt(n, s, r), i[2] = mt(n - 1 / 3, s, r);
                            else i = t.match(A) || ut.transparent;
                            i[0] = Number(i[0]), i[1] = Number(i[1]), i[2] = Number(i[2]), 3 < i.length && (i[3] = Number(i[3]))
                        }
                    else i = ut.black;
                    return e && !c && (s = i[0] / 255, r = i[1] / 255, a = i[2] / 255, l = ((h = Math.max(s, r, a)) + (p = Math.min(s, r, a))) / 2, h === p ? n = o = 0 : (d = h - p, o = .5 < l ? d / (2 - h - p) : d / (h + p), n = h === s ? (r - a) / d + (r < a ? 6 : 0) : h === r ? (a - s) / d + 2 : (s - r) / d + 4, n *= 60), i[0] = n + .5 | 0, i[1] = 100 * o + .5 | 0, i[2] = 100 * l + .5 | 0), i
                },
                vt = function(t, e) {
                    var i, s, r, a = t.match(yt) || [],
                        n = 0,
                        o = "";
                    if (!a.length) return t;
                    for (i = 0; i < a.length; i++) s = a[i], n += (r = t.substr(n, t.indexOf(s, n) - n)).length + s.length, 3 === (s = gt(s, e)).length && s.push(1), o += r + (e ? "hsla(" + s[0] + "," + s[1] + "%," + s[2] + "%," + s[3] : "rgba(" + s.join(",")) + ")";
                    return o + t.substr(n)
                },
                yt = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
            for (t in ut) yt += "|" + t + "\\b";
            yt = new RegExp(yt + ")", "gi"), G.colorStringFilter = function(t) {
                var e, i = t[0] + " " + t[1];
                yt.test(i) && (e = -1 !== i.indexOf("hsl(") || -1 !== i.indexOf("hsla("), t[0] = vt(t[0], e), t[1] = vt(t[1], e)), yt.lastIndex = 0
            }, N.defaultStringFilter || (N.defaultStringFilter = G.colorStringFilter);
            var _t = function(t, e, a, n) {
                    if (null == t) return function(t) {
                        return t
                    };
                    var o, l = e ? (t.match(yt) || [""])[0] : "",
                        h = t.split(l).join("").match(b) || [],
                        p = t.substr(0, t.indexOf(h[0])),
                        d = ")" === t.charAt(t.length - 1) ? ")" : "",
                        c = -1 !== t.indexOf(" ") ? " " : ",",
                        f = h.length,
                        u = 0 < f ? h[0].replace(A, "") : "";
                    return f ? o = e ? function(t) {
                        var e, i, s, r;
                        if ("number" == typeof t) t += u;
                        else if (n && O.test(t)) {
                            for (r = t.replace(O, "|").split("|"), s = 0; s < r.length; s++) r[s] = o(r[s]);
                            return r.join(",")
                        }
                        if (e = (t.match(yt) || [l])[0], s = (i = t.split(e).join("").match(b) || []).length, f > s--)
                            for (; ++s < f;) i[s] = a ? i[(s - 1) / 2 | 0] : h[s];
                        return p + i.join(c) + c + e + d + (-1 !== t.indexOf("inset") ? " inset" : "")
                    } : function(t) {
                        var e, i, s;
                        if ("number" == typeof t) t += u;
                        else if (n && O.test(t)) {
                            for (i = t.replace(O, "|").split("|"), s = 0; s < i.length; s++) i[s] = o(i[s]);
                            return i.join(",")
                        }
                        if (s = (e = t.match(b) || []).length, f > s--)
                            for (; ++s < f;) e[s] = a ? e[(s - 1) / 2 | 0] : h[s];
                        return p + e.join(c) + d
                    } : function(t) {
                        return t
                    }
                },
                bt = function(h) {
                    return h = h.split(","),
                        function(t, e, i, s, r, a, n) {
                            var o, l = (e + "").split(" ");
                            for (n = {}, o = 0; o < 4; o++) n[h[o]] = l[o] = l[o] || l[(o - 1) / 2 >> 0];
                            return s.parse(t, n, r, a)
                        }
                },
                xt = (r._setPluginRatio = function(t) {
                    this.plugin.setRatio(t);
                    for (var e, i, s, r, a, n = this.data, o = n.proxy, l = n.firstMPT; l;) e = o[l.v], l.r ? e = l.r(e) : e < 1e-6 && -1e-6 < e && (e = 0), l.t[l.p] = e, l = l._next;
                    if (n.autoRotate && (n.autoRotate.rotation = n.mod ? n.mod.call(this._tween, o.rotation, this.t, this._tween) : o.rotation), 1 === t || 0 === t)
                        for (l = n.firstMPT, a = 1 === t ? "e" : "b"; l;) {
                            if ((i = l.t).type) {
                                if (1 === i.type) {
                                    for (r = i.xs0 + i.s + i.xs1, s = 1; s < i.l; s++) r += i["xn" + s] + i["xs" + (s + 1)];
                                    i[a] = r
                                }
                            } else i[a] = i.s + i.xs0;
                            l = l._next
                        }
                }, function(t, e, i, s, r) {
                    this.t = t, this.p = e, this.v = i, this.r = r, s && ((s._prev = this)._next = s)
                }),
                Tt = (r._parseToProxy = function(t, e, i, s, r, a) {
                    var n, o, l, h, p, d = s,
                        c = {},
                        f = {},
                        u = i._transform,
                        m = V;
                    for (i._transform = null, V = e, s = p = i.parse(t, e, s, r), V = m, a && (i._transform = u, d && (d._prev = null, d._prev && (d._prev._next = null))); s && s !== d;) {
                        if (s.type <= 1 && (f[o = s.p] = s.s + s.c, c[o] = s.s, a || (h = new xt(s, "s", o, h, s.r), s.c = 0), 1 === s.type))
                            for (n = s.l; 0 < --n;) l = "xn" + n, f[o = s.p + "_" + l] = s.data[l], c[o] = s[l], a || (h = new xt(s, l, o, h, s.rxp[l]));
                        s = s._next
                    }
                    return {
                        proxy: c,
                        end: f,
                        firstMPT: h,
                        pt: p
                    }
                }, r.CSSPropTween = function(t, e, i, s, r, a, n, o, l, h, p) {
                    this.t = t, this.p = e, this.s = i, this.c = s, this.n = n || e, t instanceof Tt || m.push(this.n), this.r = o ? "function" == typeof o ? o : Math.round : o, this.type = a || 0, l && (this.pr = l, u = !0), this.b = void 0 === h ? i : h, this.e = void 0 === p ? i + s : p, r && ((this._next = r)._prev = this)
                }),
                wt = function(t, e, i, s, r, a) {
                    var n = new Tt(t, e, i, s - i, r, -1, a);
                    return n.b = i, n.e = n.xs0 = s, n
                },
                Et = G.parseComplex = function(t, e, i, s, r, a, n, o, l, h) {
                    i = i || a || "", "function" == typeof s && (s = s(M, k)), n = new Tt(t, e, 0, 0, n, h ? 2 : 1, null, !1, o, i, s), s += "", r && yt.test(s + i) && (s = [i, s], G.colorStringFilter(s), i = s[0], s = s[1]);
                    var p, d, c, f, u, m, g, v, y, _, b, x, T, w = i.split(", ").join(",").split(" "),
                        E = s.split(", ").join(",").split(" "),
                        S = w.length,
                        P = !1 !== C;
                    for ((-1 !== s.indexOf(",") || -1 !== i.indexOf(",")) && (E = -1 !== (s + i).indexOf("rgb") || -1 !== (s + i).indexOf("hsl") ? (w = w.join(" ").replace(O, ", ").split(" "), E.join(" ").replace(O, ", ").split(" ")) : (w = w.join(" ").split(",").join(", ").split(" "), E.join(" ").split(",").join(", ").split(" ")), S = w.length), S !== E.length && (S = (w = (a || "").split(" ")).length), n.plugin = l, n.setRatio = h, p = yt.lastIndex = 0; p < S; p++)
                        if (f = w[p], u = E[p] + "", (v = parseFloat(f)) || 0 === v) n.appendXtra("", v, dt(u, v), u.replace(D, ""), !(!P || -1 === u.indexOf("px")) && Math.round, !0);
                        else if (r && yt.test(f)) x = ")" + ((x = u.indexOf(")") + 1) ? u.substr(x) : ""), T = -1 !== u.indexOf("hsl") && W, _ = u, f = gt(f, T), u = gt(u, T), (y = 6 < f.length + u.length) && !W && 0 === u[3] ? (n["xs" + n.l] += n.l ? " transparent" : "transparent", n.e = n.e.split(E[p]).join("transparent")) : (W || (y = !1), T ? n.appendXtra(_.substr(0, _.indexOf("hsl")) + (y ? "hsla(" : "hsl("), f[0], dt(u[0], f[0]), ",", !1, !0).appendXtra("", f[1], dt(u[1], f[1]), "%,", !1).appendXtra("", f[2], dt(u[2], f[2]), y ? "%," : "%" + x, !1) : n.appendXtra(_.substr(0, _.indexOf("rgb")) + (y ? "rgba(" : "rgb("), f[0], u[0] - f[0], ",", Math.round, !0).appendXtra("", f[1], u[1] - f[1], ",", Math.round).appendXtra("", f[2], u[2] - f[2], y ? "," : x, Math.round), y && (f = f.length < 4 ? 1 : f[3], n.appendXtra("", f, (u.length < 4 ? 1 : u[3]) - f, x, !1))), yt.lastIndex = 0;
                    else if (m = f.match(A)) {
                        if (!(g = u.match(D)) || g.length !== m.length) return n;
                        for (d = c = 0; d < m.length; d++) b = m[d], _ = f.indexOf(b, c), n.appendXtra(f.substr(c, _ - c), Number(b), dt(g[d], b), "", !(!P || "px" !== f.substr(_ + b.length, 2)) && Math.round, 0 === d), c = _ + b.length;
                        n["xs" + n.l] += f.substr(c)
                    } else n["xs" + n.l] += n.l || n["xs" + n.l] ? " " + u : u;
                    if (-1 !== s.indexOf("=") && n.data) {
                        for (x = n.xs0 + n.data.s, p = 1; p < n.l; p++) x += n["xs" + p] + n.data["xn" + p];
                        n.e = x + n["xs" + p]
                    }
                    return n.l || (n.type = -1, n.xs0 = n.e), n.xfirst || n
                },
                St = 9;
            for ((t = Tt.prototype).l = t.pr = 0; 0 < --St;) t["xn" + St] = 0, t["xs" + St] = "";
            t.xs0 = "", t._next = t._prev = t.xfirst = t.data = t.plugin = t.setRatio = t.rxp = null, t.appendXtra = function(t, e, i, s, r, a) {
                var n = this,
                    o = n.l;
                return n["xs" + o] += a && (o || n["xs" + o]) ? " " + t : t || "", i || 0 === o || n.plugin ? (n.l++, n.type = n.setRatio ? 2 : 1, n["xs" + n.l] = s || "", 0 < o ? (n.data["xn" + o] = e + i, n.rxp["xn" + o] = r, n["xn" + o] = e, n.plugin || (n.xfirst = new Tt(n, "xn" + o, e, i, n.xfirst || n, 0, n.n, r, n.pr), n.xfirst.xs0 = 0)) : (n.data = {
                    s: e + i
                }, n.rxp = {}, n.s = e, n.c = i, n.r = r)) : n["xs" + o] += e + (s || ""), n
            };
            var Pt = function(t, e) {
                    e = e || {}, this.p = e.prefix && J(t) || t, g[t] = g[this.p] = this, this.format = e.formatter || _t(e.defaultValue, e.color, e.collapsible, e.multi), e.parser && (this.parse = e.parser), this.clrs = e.color, this.multi = e.multi, this.keyword = e.keyword, this.dflt = e.defaultValue, this.allowFunc = e.allowFunc, this.pr = e.priority || 0
                },
                Ct = r._registerComplexSpecialProp = function(t, e, i) {
                    "object" != typeof e && (e = {
                        parser: i
                    });
                    var s, r = t.split(","),
                        a = e.defaultValue;
                    for (i = i || [a], s = 0; s < r.length; s++) e.prefix = 0 === s && e.prefix, e.defaultValue = i[s] || a, new Pt(r[s], e)
                },
                kt = r._registerPluginProp = function(t) {
                    if (!g[t]) {
                        var l = t.charAt(0).toUpperCase() + t.substr(1) + "Plugin";
                        Ct(t, {
                            parser: function(t, e, i, s, r, a, n) {
                                var o = h.com.greensock.plugins[l];
                                return o ? (o._cssRegister(), g[i].parse(t, e, i, s, r, a, n)) : (K("Error: " + l + " js file not loaded."), r)
                            }
                        })
                    }
                };
            (t = Pt.prototype).parseComplex = function(t, e, i, s, r, a) {
                var n, o, l, h, p, d, c = this.keyword;
                if (this.multi && (O.test(i) || O.test(e) ? (o = e.replace(O, "|").split("|"), l = i.replace(O, "|").split("|")) : c && (o = [e], l = [i])), l) {
                    for (h = l.length > o.length ? l.length : o.length, n = 0; n < h; n++) e = o[n] = o[n] || this.dflt, i = l[n] = l[n] || this.dflt, c && ((p = e.indexOf(c)) !== (d = i.indexOf(c)) && (-1 === d ? o[n] = o[n].split(c).join("") : -1 === p && (o[n] += " " + c)));
                    e = o.join(", "), i = l.join(", ")
                }
                return Et(t, this.p, e, i, this.clrs, this.dflt, s, this.pr, r, a)
            }, t.parse = function(t, e, i, s, r, a, n) {
                return this.parseComplex(t.style, this.format(it(t, this.p, S, !1, this.dflt)), this.format(e), r, a)
            }, G.registerSpecialProp = function(t, l, h) {
                Ct(t, {
                    parser: function(t, e, i, s, r, a, n) {
                        var o = new Tt(t, i, 0, 0, r, 2, i, !1, h);
                        return o.plugin = a, o.setRatio = l(t, e, s._tween, i), o
                    },
                    priority: h
                })
            }, G.useSVGTransformAttr = !0;
            var Mt, At, Dt, It, Ft, Rt = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),
                Ot = J("transform"),
                zt = Z + "transform",
                Lt = J("transformOrigin"),
                Bt = null !== J("perspective"),
                Vt = r.Transform = function() {
                    this.perspective = parseFloat(G.defaultTransformPerspective) || 0, this.force3D = !(!1 === G.defaultForce3D || !Bt) && (G.defaultForce3D || "auto")
                },
                Nt = _gsScope.SVGElement,
                Gt = function(t, e, i) {
                    var s, r = $.createElementNS("http://www.w3.org/2000/svg", t),
                        a = /([a-z])([A-Z])/g;
                    for (s in i) r.setAttributeNS(null, s.replace(a, "$1-$2").toLowerCase(), i[s]);
                    return e.appendChild(r), r
                },
                Ht = $.documentElement || {},
                $t = (Ft = P || /Android/i.test(q) && !_gsScope.chrome, $.createElementNS && !Ft && (At = Gt("svg", Ht), It = (Dt = Gt("rect", At, {
                    width: 100,
                    height: 50,
                    x: 100
                })).getBoundingClientRect().width, Dt.style[Lt] = "50% 50%", Dt.style[Ot] = "scaleX(0.5)", Ft = It === Dt.getBoundingClientRect().width && !(L && Bt), Ht.removeChild(At)), Ft),
                jt = function(t, e, i, s, r, a) {
                    var n, o, l, h, p, d, c, f, u, m, g, v, y, _, b = t._gsTransform,
                        x = Wt(t, !0);
                    b && (y = b.xOrigin, _ = b.yOrigin), (!s || (n = s.split(" ")).length < 2) && (0 === (c = t.getBBox()).x && 0 === c.y && c.width + c.height === 0 && (c = {
                        x: parseFloat(t.hasAttribute("x") ? t.getAttribute("x") : t.hasAttribute("cx") ? t.getAttribute("cx") : 0) || 0,
                        y: parseFloat(t.hasAttribute("y") ? t.getAttribute("y") : t.hasAttribute("cy") ? t.getAttribute("cy") : 0) || 0,
                        width: 0,
                        height: 0
                    }), n = [(-1 !== (e = pt(e).split(" "))[0].indexOf("%") ? parseFloat(e[0]) / 100 * c.width : parseFloat(e[0])) + c.x, (-1 !== e[1].indexOf("%") ? parseFloat(e[1]) / 100 * c.height : parseFloat(e[1])) + c.y]), i.xOrigin = h = parseFloat(n[0]), i.yOrigin = p = parseFloat(n[1]), s && x !== qt && (d = x[0], c = x[1], f = x[2], u = x[3], m = x[4], g = x[5], (v = d * u - c * f) && (o = h * (u / v) + p * (-f / v) + (f * g - u * m) / v, l = h * (-c / v) + p * (d / v) - (d * g - c * m) / v, h = i.xOrigin = n[0] = o, p = i.yOrigin = n[1] = l)), b && (a && (i.xOffset = b.xOffset, i.yOffset = b.yOffset, b = i), r || !1 !== r && !1 !== G.defaultSmoothOrigin ? (o = h - y, l = p - _, b.xOffset += o * x[0] + l * x[2] - o, b.yOffset += o * x[1] + l * x[3] - l) : b.xOffset = b.yOffset = 0), a || t.setAttribute("data-svg-origin", n.join(" "))
                },
                Xt = function(t) {
                    var e, i = j("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
                        s = this.parentNode,
                        r = this.nextSibling,
                        a = this.style.cssText;
                    if (Ht.appendChild(i), i.appendChild(this), this.style.display = "block", t) try {
                        e = this.getBBox(), this._originalGetBBox = this.getBBox, this.getBBox = Xt
                    } catch (t) {} else this._originalGetBBox && (e = this._originalGetBBox());
                    return r ? s.insertBefore(this, r) : s.appendChild(this), Ht.removeChild(i), this.style.cssText = a, e
                },
                Yt = function(t) {
                    return !(!Nt || !t.getCTM || t.parentNode && !t.ownerSVGElement || ! function(e) {
                        try {
                            return e.getBBox()
                        } catch (t) {
                            return Xt.call(e, !0)
                        }
                    }(t))
                },
                qt = [1, 0, 0, 1, 0, 0],
                Wt = function(t, e) {
                    var i, s, r, a, n, o, l, h = t._gsTransform || new Vt,
                        p = t.style;
                    if (Ot ? s = it(t, zt, null, !0) : t.currentStyle && (s = (s = t.currentStyle.filter.match(c)) && 4 === s.length ? [s[0].substr(4), Number(s[2].substr(4)), Number(s[1].substr(4)), s[3].substr(4), h.x || 0, h.y || 0].join(",") : ""), i = !s || "none" === s || "matrix(1, 0, 0, 1, 0, 0)" === s, Ot && i && !t.offsetParent && (a = p.display, p.display = "block", (l = t.parentNode) && t.offsetParent || (n = 1, o = t.nextSibling, Ht.appendChild(t)), i = !(s = it(t, zt, null, !0)) || "none" === s || "matrix(1, 0, 0, 1, 0, 0)" === s, a ? p.display = a : Jt(p, "display"), n && (o ? l.insertBefore(t, o) : l ? l.appendChild(t) : Ht.removeChild(t))), (h.svg || t.getCTM && Yt(t)) && (i && -1 !== (p[Ot] + "").indexOf("matrix") && (s = p[Ot], i = 0), r = t.getAttribute("transform"), i && r && (s = "matrix(" + (r = t.transform.baseVal.consolidate().matrix).a + "," + r.b + "," + r.c + "," + r.d + "," + r.e + "," + r.f + ")", i = 0)), i) return qt;
                    for (r = (s || "").match(A) || [], St = r.length; - 1 < --St;) a = Number(r[St]), r[St] = (n = a - (a |= 0)) ? (1e5 * n + (n < 0 ? -.5 : .5) | 0) / 1e5 + a : a;
                    return e && 6 < r.length ? [r[0], r[1], r[4], r[5], r[12], r[13]] : r
                },
                Ut = r.getTransform = function(t, e, i, s) {
                    if (t._gsTransform && i && !s) return t._gsTransform;
                    var r, a, n, o, l, h, p = i && t._gsTransform || new Vt,
                        d = p.scaleX < 0,
                        c = Bt && (parseFloat(it(t, Lt, e, !1, "0 0 0").split(" ")[2]) || p.zOrigin) || 0,
                        f = parseFloat(G.defaultTransformPerspective) || 0;
                    if (p.svg = !(!t.getCTM || !Yt(t)), p.svg && (jt(t, it(t, Lt, e, !1, "50% 50%") + "", p, t.getAttribute("data-svg-origin")), Mt = G.useSVGTransformAttr || $t), (r = Wt(t)) !== qt) {
                        if (16 === r.length) {
                            var u, m, g, v, y, _ = r[0],
                                b = r[1],
                                x = r[2],
                                T = r[3],
                                w = r[4],
                                E = r[5],
                                S = r[6],
                                P = r[7],
                                C = r[8],
                                k = r[9],
                                M = r[10],
                                A = r[12],
                                D = r[13],
                                I = r[14],
                                F = r[11],
                                R = Math.atan2(S, M);
                            p.zOrigin && (A = C * (I = -p.zOrigin) - r[12], D = k * I - r[13], I = M * I + p.zOrigin - r[14]), p.rotationX = R * H, R && (u = w * (v = Math.cos(-R)) + C * (y = Math.sin(-R)), m = E * v + k * y, g = S * v + M * y, C = w * -y + C * v, k = E * -y + k * v, M = S * -y + M * v, F = P * -y + F * v, w = u, E = m, S = g), R = Math.atan2(-x, M), p.rotationY = R * H, R && (m = b * (v = Math.cos(-R)) - k * (y = Math.sin(-R)), g = x * v - M * y, k = b * y + k * v, M = x * y + M * v, F = T * y + F * v, _ = u = _ * v - C * y, b = m, x = g), R = Math.atan2(b, _), p.rotation = R * H, R && (u = _ * (v = Math.cos(R)) + b * (y = Math.sin(R)), m = w * v + E * y, g = C * v + k * y, b = b * v - _ * y, E = E * v - w * y, k = k * v - C * y, _ = u, w = m, C = g), p.rotationX && 359.9 < Math.abs(p.rotationX) + Math.abs(p.rotation) && (p.rotationX = p.rotation = 0, p.rotationY = 180 - p.rotationY), R = Math.atan2(w, E), p.scaleX = (1e5 * Math.sqrt(_ * _ + b * b + x * x) + .5 | 0) / 1e5, p.scaleY = (1e5 * Math.sqrt(E * E + S * S) + .5 | 0) / 1e5, p.scaleZ = (1e5 * Math.sqrt(C * C + k * k + M * M) + .5 | 0) / 1e5, _ /= p.scaleX, w /= p.scaleY, b /= p.scaleX, E /= p.scaleY, 2e-5 < Math.abs(R) ? (p.skewX = R * H, w = 0, "simple" !== p.skewType && (p.scaleY *= 1 / Math.cos(R))) : p.skewX = 0, p.perspective = F ? 1 / (F < 0 ? -F : F) : 0, p.x = A, p.y = D, p.z = I, p.svg && (p.x -= p.xOrigin - (p.xOrigin * _ - p.yOrigin * w), p.y -= p.yOrigin - (p.yOrigin * b - p.xOrigin * E))
                        } else if (!Bt || s || !r.length || p.x !== r[4] || p.y !== r[5] || !p.rotationX && !p.rotationY) {
                            var O = 6 <= r.length,
                                z = O ? r[0] : 1,
                                L = r[1] || 0,
                                B = r[2] || 0,
                                V = O ? r[3] : 1;
                            p.x = r[4] || 0, p.y = r[5] || 0, n = Math.sqrt(z * z + L * L), o = Math.sqrt(V * V + B * B), l = z || L ? Math.atan2(L, z) * H : p.rotation || 0, h = B || V ? Math.atan2(B, V) * H + l : p.skewX || 0, p.scaleX = n, p.scaleY = o, p.rotation = l, p.skewX = h, Bt && (p.rotationX = p.rotationY = p.z = 0, p.perspective = f, p.scaleZ = 1), p.svg && (p.x -= p.xOrigin - (p.xOrigin * z + p.yOrigin * B), p.y -= p.yOrigin - (p.xOrigin * L + p.yOrigin * V))
                        }
                        for (a in 90 < Math.abs(p.skewX) && Math.abs(p.skewX) < 270 && (d ? (p.scaleX *= -1, p.skewX += p.rotation <= 0 ? 180 : -180, p.rotation += p.rotation <= 0 ? 180 : -180) : (p.scaleY *= -1, p.skewX += p.skewX <= 0 ? 180 : -180)), p.zOrigin = c, p) p[a] < 2e-5 && -2e-5 < p[a] && (p[a] = 0)
                    }
                    return i && ((t._gsTransform = p).svg && (Mt && t.style[Ot] ? N.delayedCall(.001, function() {
                        Jt(t.style, Ot)
                    }) : !Mt && t.getAttribute("transform") && N.delayedCall(.001, function() {
                        t.removeAttribute("transform")
                    }))), p
                },
                Kt = function(t) {
                    var e, i, s = this.data,
                        r = -s.rotation * B,
                        a = r + s.skewX * B,
                        n = (Math.cos(r) * s.scaleX * 1e5 | 0) / 1e5,
                        o = (Math.sin(r) * s.scaleX * 1e5 | 0) / 1e5,
                        l = (Math.sin(a) * -s.scaleY * 1e5 | 0) / 1e5,
                        h = (Math.cos(a) * s.scaleY * 1e5 | 0) / 1e5,
                        p = this.t.style,
                        d = this.t.currentStyle;
                    if (d) {
                        i = o, o = -l, l = -i, e = d.filter, p.filter = "";
                        var c, f, u = this.t.offsetWidth,
                            m = this.t.offsetHeight,
                            g = "absolute" !== d.position,
                            v = "progid:DXImageTransform.Microsoft.Matrix(M11=" + n + ", M12=" + o + ", M21=" + l + ", M22=" + h,
                            y = s.x + u * s.xPercent / 100,
                            _ = s.y + m * s.yPercent / 100;
                        if (null != s.ox && (y += (c = (s.oxp ? u * s.ox * .01 : s.ox) - u / 2) - (c * n + (f = (s.oyp ? m * s.oy * .01 : s.oy) - m / 2) * o), _ += f - (c * l + f * h)), g ? v += ", Dx=" + ((c = u / 2) - (c * n + (f = m / 2) * o) + y) + ", Dy=" + (f - (c * l + f * h) + _) + ")" : v += ", sizingMethod='auto expand')", -1 !== e.indexOf("DXImageTransform.Microsoft.Matrix(") ? p.filter = e.replace(R, v) : p.filter = v + " " + e, (0 === t || 1 === t) && 1 === n && 0 === o && 0 === l && 1 === h && (g && -1 === v.indexOf("Dx=0, Dy=0") || F.test(e) && 100 !== parseFloat(RegExp.$1) || -1 === e.indexOf(e.indexOf("Alpha")) && p.removeAttribute("filter")), !g) {
                            var b, x, T, w = P < 8 ? 1 : -1;
                            for (c = s.ieOffsetX || 0, f = s.ieOffsetY || 0, s.ieOffsetX = Math.round((u - ((n < 0 ? -n : n) * u + (o < 0 ? -o : o) * m)) / 2 + y), s.ieOffsetY = Math.round((m - ((h < 0 ? -h : h) * m + (l < 0 ? -l : l) * u)) / 2 + _), St = 0; St < 4; St++) T = (i = -1 !== (b = d[x = lt[St]]).indexOf("px") ? parseFloat(b) : st(this.t, x, parseFloat(b), b.replace(I, "")) || 0) !== s[x] ? St < 2 ? -s.ieOffsetX : -s.ieOffsetY : St < 2 ? c - s.ieOffsetX : f - s.ieOffsetY, p[x] = (s[x] = Math.round(i - T * (0 === St || 2 === St ? 1 : w))) + "px"
                        }
                    }
                },
                Zt = r.set3DTransformRatio = r.setTransformRatio = function(t) {
                    var e, i, s, r, a, n, o, l, h, p, d, c, f, u, m, g, v, y, _, b, x = this.data,
                        T = this.t.style,
                        w = x.rotation,
                        E = x.rotationX,
                        S = x.rotationY,
                        P = x.scaleX,
                        C = x.scaleY,
                        k = x.scaleZ,
                        M = x.x,
                        A = x.y,
                        D = x.z,
                        I = x.svg,
                        F = x.perspective,
                        R = x.force3D,
                        O = x.skewY,
                        z = x.skewX;
                    if (O && (z += O, w += O), !((1 !== t && 0 !== t || "auto" !== R || this.tween._totalTime !== this.tween._totalDuration && this.tween._totalTime) && R || D || F || S || E || 1 !== k) || Mt && I || !Bt) w || z || I ? (w *= B, b = z * B, 1e5, i = Math.cos(w) * P, a = Math.sin(w) * P, s = Math.sin(w - b) * -C, n = Math.cos(w - b) * C, b && "simple" === x.skewType && (e = Math.tan(b - O * B), s *= e = Math.sqrt(1 + e * e), n *= e, O && (e = Math.tan(O * B), i *= e = Math.sqrt(1 + e * e), a *= e)), I && (M += x.xOrigin - (x.xOrigin * i + x.yOrigin * s) + x.xOffset, A += x.yOrigin - (x.xOrigin * a + x.yOrigin * n) + x.yOffset, Mt && (x.xPercent || x.yPercent) && (m = this.t.getBBox(), M += .01 * x.xPercent * m.width, A += .01 * x.yPercent * m.height), M < (m = 1e-6) && -m < M && (M = 0), A < m && -m < A && (A = 0)), _ = (1e5 * i | 0) / 1e5 + "," + (1e5 * a | 0) / 1e5 + "," + (1e5 * s | 0) / 1e5 + "," + (1e5 * n | 0) / 1e5 + "," + M + "," + A + ")", I && Mt ? this.t.setAttribute("transform", "matrix(" + _) : T[Ot] = (x.xPercent || x.yPercent ? "translate(" + x.xPercent + "%," + x.yPercent + "%) matrix(" : "matrix(") + _) : T[Ot] = (x.xPercent || x.yPercent ? "translate(" + x.xPercent + "%," + x.yPercent + "%) matrix(" : "matrix(") + P + ",0,0," + C + "," + M + "," + A + ")";
                    else {
                        if (L && (P < (m = 1e-4) && -m < P && (P = k = 2e-5), C < m && -m < C && (C = k = 2e-5), !F || x.z || x.rotationX || x.rotationY || (F = 0)), w || z) w *= B, g = i = Math.cos(w), v = a = Math.sin(w), z && (w -= z * B, g = Math.cos(w), v = Math.sin(w), "simple" === x.skewType && (e = Math.tan((z - O) * B), g *= e = Math.sqrt(1 + e * e), v *= e, x.skewY && (e = Math.tan(O * B), i *= e = Math.sqrt(1 + e * e), a *= e))), s = -v, n = g;
                        else {
                            if (!(S || E || 1 !== k || F || I)) return void(T[Ot] = (x.xPercent || x.yPercent ? "translate(" + x.xPercent + "%," + x.yPercent + "%) translate3d(" : "translate3d(") + M + "px," + A + "px," + D + "px)" + (1 !== P || 1 !== C ? " scale(" + P + "," + C + ")" : ""));
                            i = n = 1, s = a = 0
                        }
                        p = 1, r = o = l = h = d = c = 0, f = F ? -1 / F : 0, u = x.zOrigin, m = 1e-6, ",", "0", (w = S * B) && (g = Math.cos(w), d = f * (l = -(v = Math.sin(w))), r = i * v, o = a * v, f *= p = g, i *= g, a *= g), (w = E * B) && (e = s * (g = Math.cos(w)) + r * (v = Math.sin(w)), y = n * g + o * v, h = p * v, c = f * v, r = s * -v + r * g, o = n * -v + o * g, p *= g, f *= g, s = e, n = y), 1 !== k && (r *= k, o *= k, p *= k, f *= k), 1 !== C && (s *= C, n *= C, h *= C, c *= C), 1 !== P && (i *= P, a *= P, l *= P, d *= P), (u || I) && (u && (M += r * -u, A += o * -u, D += p * -u + u), I && (M += x.xOrigin - (x.xOrigin * i + x.yOrigin * s) + x.xOffset, A += x.yOrigin - (x.xOrigin * a + x.yOrigin * n) + x.yOffset), M < m && -m < M && (M = "0"), A < m && -m < A && (A = "0"), D < m && -m < D && (D = 0)), _ = x.xPercent || x.yPercent ? "translate(" + x.xPercent + "%," + x.yPercent + "%) matrix3d(" : "matrix3d(", _ += (i < m && -m < i ? "0" : i) + "," + (a < m && -m < a ? "0" : a) + "," + (l < m && -m < l ? "0" : l), _ += "," + (d < m && -m < d ? "0" : d) + "," + (s < m && -m < s ? "0" : s) + "," + (n < m && -m < n ? "0" : n), E || S || 1 !== k ? (_ += "," + (h < m && -m < h ? "0" : h) + "," + (c < m && -m < c ? "0" : c) + "," + (r < m && -m < r ? "0" : r), _ += "," + (o < m && -m < o ? "0" : o) + "," + (p < m && -m < p ? "0" : p) + "," + (f < m && -m < f ? "0" : f) + ",") : _ += ",0,0,0,0,1,0,", _ += M + "," + A + "," + D + "," + (F ? 1 + -D / F : 1) + ")", T[Ot] = _
                    }
                };
            (t = Vt.prototype).x = t.y = t.z = t.skewX = t.skewY = t.rotation = t.rotationX = t.rotationY = t.zOrigin = t.xPercent = t.yPercent = t.xOffset = t.yOffset = 0, t.scaleX = t.scaleY = t.scaleZ = 1, Ct("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {
                parser: function(t, e, i, s, r, a, n) {
                    if (s._lastParsedTransform === n) return r;
                    var o = (s._lastParsedTransform = n).scale && "function" == typeof n.scale ? n.scale : 0;
                    o && (n.scale = o(M, t));
                    var l, h, p, d, c, f, u, m, g, v = t._gsTransform,
                        y = t.style,
                        _ = Rt.length,
                        b = n,
                        x = {},
                        T = "transformOrigin",
                        w = Ut(t, S, !0, b.parseTransform),
                        E = b.transform && ("function" == typeof b.transform ? b.transform(M, k) : b.transform);
                    if (w.skewType = b.skewType || w.skewType || G.defaultSkewType, s._transform = w, "rotationZ" in b && (b.rotation = b.rotationZ), E && "string" == typeof E && Ot)(h = X.style)[Ot] = E, h.display = "block", h.position = "absolute", -1 !== E.indexOf("%") && (h.width = it(t, "width"), h.height = it(t, "height")), $.body.appendChild(X), l = Ut(X, null, !1), "simple" === w.skewType && (l.scaleY *= Math.cos(l.skewX * B)), w.svg && (f = w.xOrigin, u = w.yOrigin, l.x -= w.xOffset, l.y -= w.yOffset, (b.transformOrigin || b.svgOrigin) && (E = {}, jt(t, pt(b.transformOrigin), E, b.svgOrigin, b.smoothOrigin, !0), f = E.xOrigin, u = E.yOrigin, l.x -= E.xOffset - w.xOffset, l.y -= E.yOffset - w.yOffset), (f || u) && (m = Wt(X, !0), l.x -= f - (f * m[0] + u * m[2]), l.y -= u - (f * m[1] + u * m[3]))), $.body.removeChild(X), l.perspective || (l.perspective = w.perspective), null != b.xPercent && (l.xPercent = ct(b.xPercent, w.xPercent)), null != b.yPercent && (l.yPercent = ct(b.yPercent, w.yPercent));
                    else if ("object" == typeof b) {
                        if (l = {
                                scaleX: ct(null != b.scaleX ? b.scaleX : b.scale, w.scaleX),
                                scaleY: ct(null != b.scaleY ? b.scaleY : b.scale, w.scaleY),
                                scaleZ: ct(b.scaleZ, w.scaleZ),
                                x: ct(b.x, w.x),
                                y: ct(b.y, w.y),
                                z: ct(b.z, w.z),
                                xPercent: ct(b.xPercent, w.xPercent),
                                yPercent: ct(b.yPercent, w.yPercent),
                                perspective: ct(b.transformPerspective, w.perspective)
                            }, null != (c = b.directionalRotation))
                            if ("object" == typeof c)
                                for (h in c) b[h] = c[h];
                            else b.rotation = c;
                            "string" == typeof b.x && -1 !== b.x.indexOf("%") && (l.x = 0, l.xPercent = ct(b.x, w.xPercent)), "string" == typeof b.y && -1 !== b.y.indexOf("%") && (l.y = 0, l.yPercent = ct(b.y, w.yPercent)), l.rotation = ft("rotation" in b ? b.rotation : "shortRotation" in b ? b.shortRotation + "_short" : w.rotation, w.rotation, "rotation", x), Bt && (l.rotationX = ft("rotationX" in b ? b.rotationX : "shortRotationX" in b ? b.shortRotationX + "_short" : w.rotationX || 0, w.rotationX, "rotationX", x), l.rotationY = ft("rotationY" in b ? b.rotationY : "shortRotationY" in b ? b.shortRotationY + "_short" : w.rotationY || 0, w.rotationY, "rotationY", x)), l.skewX = ft(b.skewX, w.skewX), l.skewY = ft(b.skewY, w.skewY)
                    }
                    for (Bt && null != b.force3D && (w.force3D = b.force3D, d = !0), (p = w.force3D || w.z || w.rotationX || w.rotationY || l.z || l.rotationX || l.rotationY || l.perspective) || null == b.scale || (l.scaleZ = 1); - 1 < --_;)(1e-6 < (E = l[g = Rt[_]] - w[g]) || E < -1e-6 || null != b[g] || null != V[g]) && (d = !0, r = new Tt(w, g, w[g], E, r), g in x && (r.e = x[g]), r.xs0 = 0, r.plugin = a, s._overwriteProps.push(r.n));
                    return E = "function" == typeof b.transformOrigin ? b.transformOrigin(M, k) : b.transformOrigin, w.svg && (E || b.svgOrigin) && (f = w.xOffset, u = w.yOffset, jt(t, pt(E), l, b.svgOrigin, b.smoothOrigin), r = wt(w, "xOrigin", (v ? w : l).xOrigin, l.xOrigin, r, T), r = wt(w, "yOrigin", (v ? w : l).yOrigin, l.yOrigin, r, T), (f !== w.xOffset || u !== w.yOffset) && (r = wt(w, "xOffset", v ? f : w.xOffset, w.xOffset, r, T), r = wt(w, "yOffset", v ? u : w.yOffset, w.yOffset, r, T)), E = "0px 0px"), (E || Bt && p && w.zOrigin) && (Ot ? (d = !0, g = Lt, E || (E = (E = (it(t, g, S, !1, "50% 50%") + "").split(" "))[0] + " " + E[1] + " " + w.zOrigin + "px"), E += "", (r = new Tt(y, g, 0, 0, r, -1, T)).b = y[g], r.plugin = a, r.xs0 = r.e = Bt ? (h = w.zOrigin, E = E.split(" "), w.zOrigin = (2 < E.length ? parseFloat(E[2]) : h) || 0, r.xs0 = r.e = E[0] + " " + (E[1] || "50%") + " 0px", (r = new Tt(w, "zOrigin", 0, 0, r, -1, r.n)).b = h, w.zOrigin) : E) : pt(E + "", w)), d && (s._transformType = w.svg && Mt || !p && 3 !== this._transformType ? 2 : 3), o && (n.scale = o), r
                },
                allowFunc: !0,
                prefix: !0
            }), Ct("boxShadow", {
                defaultValue: "0px 0px 0px 0px #999",
                prefix: !0,
                color: !0,
                multi: !0,
                keyword: "inset"
            }), Ct("clipPath", {
                defaultValue: "inset(0px)",
                prefix: !0,
                multi: !0,
                formatter: _t("inset(0px 0px 0px 0px)", !1, !0)
            }), Ct("borderRadius", {
                defaultValue: "0px",
                parser: function(t, e, i, s, r, a) {
                    e = this.format(e);
                    var n, o, l, h, p, d, c, f, u, m, g, v, y, _, b, x, T = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                        w = t.style;
                    for (u = parseFloat(t.offsetWidth), m = parseFloat(t.offsetHeight), n = e.split(" "), o = 0; o < T.length; o++) this.p.indexOf("border") && (T[o] = J(T[o])), -1 !== (p = h = it(t, T[o], S, !1, "0px")).indexOf(" ") && (p = (h = p.split(" "))[0], h = h[1]), d = l = n[o], c = parseFloat(p), v = p.substr((c + "").length), "" === (g = (y = "=" === d.charAt(1)) ? (f = parseInt(d.charAt(0) + "1", 10), d = d.substr(2), f *= parseFloat(d), d.substr((f + "").length - (f < 0 ? 1 : 0)) || "") : (f = parseFloat(d), d.substr((f + "").length))) && (g = E[i] || v), g !== v && (_ = st(t, "borderLeft", c, v), b = st(t, "borderTop", c, v), h = "%" === g ? (p = _ / u * 100 + "%", b / m * 100 + "%") : "em" === g ? (p = _ / (x = st(t, "borderLeft", 1, "em")) + "em", b / x + "em") : (p = _ + "px", b + "px"), y && (d = parseFloat(p) + f + g, l = parseFloat(h) + f + g)), r = Et(w, T[o], p + " " + h, d + " " + l, !1, "0px", r);
                    return r
                },
                prefix: !0,
                formatter: _t("0px 0px 0px 0px", !1, !0)
            }), Ct("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {
                defaultValue: "0px",
                parser: function(t, e, i, s, r, a) {
                    return Et(t.style, i, this.format(it(t, i, S, !1, "0px 0px")), this.format(e), !1, "0px", r)
                },
                prefix: !0,
                formatter: _t("0px 0px", !1, !0)
            }), Ct("backgroundPosition", {
                defaultValue: "0 0",
                parser: function(t, e, i, s, r, a) {
                    var n, o, l, h, p, d, c = "background-position",
                        f = S || et(t),
                        u = this.format((f ? P ? f.getPropertyValue(c + "-x") + " " + f.getPropertyValue(c + "-y") : f.getPropertyValue(c) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"),
                        m = this.format(e);
                    if (-1 !== u.indexOf("%") != (-1 !== m.indexOf("%")) && m.split(",").length < 2 && ((d = it(t, "backgroundImage").replace(w, "")) && "none" !== d)) {
                        for (n = u.split(" "), o = m.split(" "), Y.setAttribute("src", d), l = 2; - 1 < --l;)(h = -1 !== (u = n[l]).indexOf("%")) !== (-1 !== o[l].indexOf("%")) && (p = 0 === l ? t.offsetWidth - Y.width : t.offsetHeight - Y.height, n[l] = h ? parseFloat(u) / 100 * p + "px" : parseFloat(u) / p * 100 + "%");
                        u = n.join(" ")
                    }
                    return this.parseComplex(t.style, u, m, r, a)
                },
                formatter: pt
            }), Ct("backgroundSize", {
                defaultValue: "0 0",
                formatter: function(t) {
                    return "co" === (t += "").substr(0, 2) ? t : pt(-1 === t.indexOf(" ") ? t + " " + t : t)
                }
            }), Ct("perspective", {
                defaultValue: "0px",
                prefix: !0
            }), Ct("perspectiveOrigin", {
                defaultValue: "50% 50%",
                prefix: !0
            }), Ct("transformStyle", {
                prefix: !0
            }), Ct("backfaceVisibility", {
                prefix: !0
            }), Ct("userSelect", {
                prefix: !0
            }), Ct("margin", {
                parser: bt("marginTop,marginRight,marginBottom,marginLeft")
            }), Ct("padding", {
                parser: bt("paddingTop,paddingRight,paddingBottom,paddingLeft")
            }), Ct("clip", {
                defaultValue: "rect(0px,0px,0px,0px)",
                parser: function(t, e, i, s, r, a) {
                    var n, o, l;
                    return e = P < 9 ? (o = t.currentStyle, l = P < 8 ? " " : ",", n = "rect(" + o.clipTop + l + o.clipRight + l + o.clipBottom + l + o.clipLeft + ")", this.format(e).split(",").join(l)) : (n = this.format(it(t, this.p, S, !1, this.dflt)), this.format(e)), this.parseComplex(t.style, n, e, r, a)
                }
            }), Ct("textShadow", {
                defaultValue: "0px 0px 0px #999",
                color: !0,
                multi: !0
            }), Ct("autoRound,strictUnits", {
                parser: function(t, e, i, s, r) {
                    return r
                }
            }), Ct("border", {
                defaultValue: "0px solid #000",
                parser: function(t, e, i, s, r, a) {
                    var n = it(t, "borderTopWidth", S, !1, "0px"),
                        o = this.format(e).split(" "),
                        l = o[0].replace(I, "");
                    return "px" !== l && (n = parseFloat(n) / st(t, "borderTopWidth", 1, l) + l), this.parseComplex(t.style, this.format(n + " " + it(t, "borderTopStyle", S, !1, "solid") + " " + it(t, "borderTopColor", S, !1, "#000")), o.join(" "), r, a)
                },
                color: !0,
                formatter: function(t) {
                    var e = t.split(" ");
                    return e[0] + " " + (e[1] || "solid") + " " + (t.match(yt) || ["#000"])[0]
                }
            }), Ct("borderWidth", {
                parser: bt("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
            }), Ct("float,cssFloat,styleFloat", {
                parser: function(t, e, i, s, r, a) {
                    var n = t.style,
                        o = "cssFloat" in n ? "cssFloat" : "styleFloat";
                    return new Tt(n, o, 0, 0, r, -1, i, !1, 0, n[o], e)
                }
            });
            var Qt = function(t) {
                var e, i = this.t,
                    s = i.filter || it(this.data, "filter") || "",
                    r = this.s + this.c * t | 0;
                100 === r && (e = -1 === s.indexOf("atrix(") && -1 === s.indexOf("radient(") && -1 === s.indexOf("oader(") ? (i.removeAttribute("filter"), !it(this.data, "filter")) : (i.filter = s.replace(n, ""), !0)), e || (this.xn1 && (i.filter = s = s || "alpha(opacity=" + r + ")"), -1 === s.indexOf("pacity") ? 0 === r && this.xn1 || (i.filter = s + " alpha(opacity=" + r + ")") : i.filter = s.replace(F, "opacity=" + r))
            };
            Ct("opacity,alpha,autoAlpha", {
                defaultValue: "1",
                parser: function(t, e, i, s, r, a) {
                    var n = parseFloat(it(t, "opacity", S, !1, "1")),
                        o = t.style,
                        l = "autoAlpha" === i;
                    return "string" == typeof e && "=" === e.charAt(1) && (e = ("-" === e.charAt(0) ? -1 : 1) * parseFloat(e.substr(2)) + n), l && 1 === n && "hidden" === it(t, "visibility", S) && 0 !== e && (n = 0), W ? r = new Tt(o, "opacity", n, e - n, r) : ((r = new Tt(o, "opacity", 100 * n, 100 * (e - n), r)).xn1 = l ? 1 : 0, o.zoom = 1, r.type = 2, r.b = "alpha(opacity=" + r.s + ")", r.e = "alpha(opacity=" + (r.s + r.c) + ")", r.data = t, r.plugin = a, r.setRatio = Qt), l && ((r = new Tt(o, "visibility", 0, 0, r, -1, null, !1, 0, 0 !== n ? "inherit" : "hidden", 0 === e ? "hidden" : "inherit")).xs0 = "inherit", s._overwriteProps.push(r.n), s._overwriteProps.push(i)), r
                }
            });
            var Jt = function(t, e) {
                    e && (t.removeProperty ? (("ms" === e.substr(0, 2) || "webkit" === e.substr(0, 6)) && (e = "-" + e), t.removeProperty(e.replace(o, "-$1").toLowerCase())) : t.removeAttribute(e))
                },
                te = function(t) {
                    if (this.t._gsClassPT = this, 1 === t || 0 === t) {
                        this.t.setAttribute("class", 0 === t ? this.b : this.e);
                        for (var e = this.data, i = this.t.style; e;) e.v ? i[e.p] = e.v : Jt(i, e.p), e = e._next;
                        1 === t && this.t._gsClassPT === this && (this.t._gsClassPT = null)
                    } else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
                };
            Ct("className", {
                parser: function(t, e, i, s, r, a, n) {
                    var o, l, h, p, d, c = t.getAttribute("class") || "",
                        f = t.style.cssText;
                    if ((r = s._classNamePT = new Tt(t, i, 0, 0, r, 2)).setRatio = te, r.pr = -11, u = !0, r.b = c, l = at(t, S), h = t._gsClassPT) {
                        for (p = {}, d = h.data; d;) p[d.p] = 1, d = d._next;
                        h.setRatio(1)
                    }
                    return (t._gsClassPT = r).e = "=" !== e.charAt(1) ? e : c.replace(new RegExp("(?:\\s|^)" + e.substr(2) + "(?![\\w-])"), "") + ("+" === e.charAt(0) ? " " + e.substr(2) : ""), t.setAttribute("class", r.e), o = nt(t, l, at(t), n, p), t.setAttribute("class", c), r.data = o.firstMPT, t.style.cssText = f, r.xfirst = s.parse(t, o.difs, r, a)
                }
            });
            var ee = function(t) {
                if ((1 === t || 0 === t) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
                    var e, i, s, r, a, n = this.t.style,
                        o = g.transform.parse;
                    if ("all" === this.e) r = !(n.cssText = "");
                    else
                        for (s = (e = this.e.split(" ").join("").split(",")).length; - 1 < --s;) i = e[s], g[i] && (g[i].parse === o ? r = !0 : i = "transformOrigin" === i ? Lt : g[i].p), Jt(n, i);
                    r && (Jt(n, Ot), (a = this.t._gsTransform) && (a.svg && (this.t.removeAttribute("data-svg-origin"), this.t.removeAttribute("transform")), delete this.t._gsTransform))
                }
            };
            for (Ct("clearProps", {
                    parser: function(t, e, i, s, r) {
                        return (r = new Tt(t, i, 0, 0, r, 2)).setRatio = ee, r.e = e, r.pr = -10, r.data = s._tween, u = !0, r
                    }
                }), t = "bezier,throwProps,physicsProps,physics2D".split(","), St = t.length; St--;) kt(t[St]);
            (t = G.prototype)._firstPT = t._lastParsedTransform = t._transform = null, t._onInitTween = function(t, e, i, s) {
                if (!t.nodeType) return !1;
                this._target = k = t, this._tween = i, this._vars = e, M = s, C = e.autoRound, u = !1, E = e.suffixMap || G.suffixMap, S = et(t), m = this._overwriteProps;
                var r, a, n, o, l, h, p, d, c, f = t.style;
                if (v && "" === f.zIndex && (("auto" === (r = it(t, "zIndex", S)) || "" === r) && this._addLazySet(f, "zIndex", 0)), "string" == typeof e && (o = f.cssText, r = at(t, S), f.cssText = o + ";" + e, r = nt(t, r, at(t)).difs, !W && x.test(e) && (r.opacity = parseFloat(RegExp.$1)), e = r, f.cssText = o), e.className ? this._firstPT = a = g.className.parse(t, e.className, "className", this, null, null, e) : this._firstPT = a = this.parse(t, e, null), this._transformType) {
                    for (c = 3 === this._transformType, Ot ? y && (v = !0, "" === f.zIndex && (("auto" === (p = it(t, "zIndex", S)) || "" === p) && this._addLazySet(f, "zIndex", 0)), _ && this._addLazySet(f, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (c ? "visible" : "hidden"))) : f.zoom = 1, n = a; n && n._next;) n = n._next;
                    d = new Tt(t, "transform", 0, 0, null, 2), this._linkCSSP(d, null, n), d.setRatio = Ot ? Zt : Kt, d.data = this._transform || Ut(t, S, !0), d.tween = i, d.pr = -1, m.pop()
                }
                if (u) {
                    for (; a;) {
                        for (h = a._next, n = o; n && n.pr > a.pr;) n = n._next;
                        (a._prev = n ? n._prev : l) ? a._prev._next = a: o = a, (a._next = n) ? n._prev = a : l = a, a = h
                    }
                    this._firstPT = o
                }
                return !0
            }, t.parse = function(t, e, i, s) {
                var r, a, n, o, l, h, p, d, c, f, u = t.style;
                for (r in e) {
                    if (h = e[r], a = g[r], "function" != typeof h || a && a.allowFunc || (h = h(M, k)), a) i = a.parse(t, h, r, this, i, s, e);
                    else {
                        if ("--" === r.substr(0, 2)) {
                            this._tween._propLookup[r] = this._addTween.call(this._tween, t.style, "setProperty", et(t).getPropertyValue(r) + "", h + "", r, !1, r);
                            continue
                        }
                        l = it(t, r, S) + "", c = "string" == typeof h, "color" === r || "fill" === r || "stroke" === r || -1 !== r.indexOf("Color") || c && T.test(h) ? (c || (h = (3 < (h = gt(h)).length ? "rgba(" : "rgb(") + h.join(",") + ")"), i = Et(u, r, l, h, !0, "transparent", i, 0, s)) : c && z.test(h) ? i = Et(u, r, l, h, !0, null, i, 0, s) : (p = (n = parseFloat(l)) || 0 === n ? l.substr((n + "").length) : "", ("" === l || "auto" === l) && (p = "width" === r || "height" === r ? (n = ht(t, r, S), "px") : "left" === r || "top" === r ? (n = rt(t, r, S), "px") : (n = "opacity" !== r ? 0 : 1, "")), "" === (d = (f = c && "=" === h.charAt(1)) ? (o = parseInt(h.charAt(0) + "1", 10), h = h.substr(2), o *= parseFloat(h), h.replace(I, "")) : (o = parseFloat(h), c ? h.replace(I, "") : "")) && (d = r in E ? E[r] : p), h = o || 0 === o ? (f ? o + n : o) + d : e[r], p !== d && ("" !== d || "lineHeight" === r) && (o || 0 === o) && n && (n = st(t, r, n, p), "%" === d ? (n /= st(t, r, 100, "%") / 100, !0 !== e.strictUnits && (l = n + "%")) : "em" === d || "rem" === d || "vw" === d || "vh" === d ? n /= st(t, r, 1, d) : "px" !== d && (o = st(t, r, o, d), d = "px"), f && (o || 0 === o) && (h = o + n + d)), f && (o += n), !n && 0 !== n || !o && 0 !== o ? void 0 !== u[r] && (h || h + "" != "NaN" && null != h) ? (i = new Tt(u, r, o || n || 0, 0, i, -1, r, !1, 0, l, h)).xs0 = "none" !== h || "display" !== r && -1 === r.indexOf("Style") ? h : l : K("invalid " + r + " tween value: " + e[r]) : (i = new Tt(u, r, n, o - n, i, 0, r, !1 !== C && ("px" === d || "zIndex" === r), 0, l, h)).xs0 = d)
                    }
                    s && i && !i.plugin && (i.plugin = s)
                }
                return i
            }, t.setRatio = function(t) {
                var e, i, s, r = this._firstPT;
                if (1 !== t || this._tween._time !== this._tween._duration && 0 !== this._tween._time)
                    if (t || this._tween._time !== this._tween._duration && 0 !== this._tween._time || -1e-6 === this._tween._rawPrevTime)
                        for (; r;) {
                            if (e = r.c * t + r.s, r.r ? e = r.r(e) : e < 1e-6 && -1e-6 < e && (e = 0), r.type)
                                if (1 === r.type)
                                    if (2 === (s = r.l)) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2;
                                    else if (3 === s) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3;
                            else if (4 === s) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3 + r.xn3 + r.xs4;
                            else if (5 === s) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3 + r.xn3 + r.xs4 + r.xn4 + r.xs5;
                            else {
                                for (i = r.xs0 + e + r.xs1, s = 1; s < r.l; s++) i += r["xn" + s] + r["xs" + (s + 1)];
                                r.t[r.p] = i
                            } else -1 === r.type ? r.t[r.p] = r.xs0 : r.setRatio && r.setRatio(t);
                            else r.t[r.p] = e + r.xs0;
                            r = r._next
                        } else
                            for (; r;) 2 !== r.type ? r.t[r.p] = r.b : r.setRatio(t), r = r._next;
                    else
                        for (; r;) {
                            if (2 !== r.type)
                                if (r.r && -1 !== r.type)
                                    if (e = r.r(r.s + r.c), r.type) {
                                        if (1 === r.type) {
                                            for (s = r.l, i = r.xs0 + e + r.xs1, s = 1; s < r.l; s++) i += r["xn" + s] + r["xs" + (s + 1)];
                                            r.t[r.p] = i
                                        }
                                    } else r.t[r.p] = e + r.xs0;
                            else r.t[r.p] = r.e;
                            else r.setRatio(t);
                            r = r._next
                        }
            }, t._enableTransforms = function(t) {
                this._transform = this._transform || Ut(this._target, S, !0), this._transformType = this._transform.svg && Mt || !t && 3 !== this._transformType ? 2 : 3
            };
            var ie = function(t) {
                this.t[this.p] = this.e, this.data._linkCSSP(this, this._next, null, !0)
            };
            t._addLazySet = function(t, e, i) {
                var s = this._firstPT = new Tt(t, e, 0, 0, this._firstPT, 2);
                s.e = i, s.setRatio = ie, s.data = this
            }, t._linkCSSP = function(t, e, i, s) {
                return t && (e && (e._prev = t), t._next && (t._next._prev = t._prev), t._prev ? t._prev._next = t._next : this._firstPT === t && (this._firstPT = t._next, s = !0), i ? i._next = t : s || null !== this._firstPT || (this._firstPT = t), t._next = e, t._prev = i), t
            }, t._mod = function(t) {
                for (var e = this._firstPT; e;) "function" == typeof t[e.p] && (e.r = t[e.p]), e = e._next
            }, t._kill = function(t) {
                var e, i, s, r = t;
                if (t.autoAlpha || t.alpha) {
                    for (i in r = {}, t) r[i] = t[i];
                    r.opacity = 1, r.autoAlpha && (r.visibility = 1)
                }
                for (t.className && (e = this._classNamePT) && ((s = e.xfirst) && s._prev ? this._linkCSSP(s._prev, e._next, s._prev._prev) : s === this._firstPT && (this._firstPT = e._next), e._next && this._linkCSSP(e._next, e._next._next, s._prev), this._classNamePT = null), e = this._firstPT; e;) e.plugin && e.plugin !== i && e.plugin._kill && (e.plugin._kill(t), i = e.plugin), e = e._next;
                return a.prototype._kill.call(this, r)
            };
            var se = function(t, e, i) {
                var s, r, a, n;
                if (t.slice)
                    for (r = t.length; - 1 < --r;) se(t[r], e, i);
                else
                    for (r = (s = t.childNodes).length; - 1 < --r;) n = (a = s[r]).type, a.style && (e.push(at(a)), i && i.push(a)), 1 !== n && 9 !== n && 11 !== n || !a.childNodes.length || se(a, e, i)
            };
            return G.cascadeTo = function(t, e, i) {
                var s, r, a, n, o = N.to(t, e, i),
                    l = [o],
                    h = [],
                    p = [],
                    d = [],
                    c = N._internals.reservedProps;
                for (t = o._targets || o.target, se(t, h, d), o.render(e, !0, !0), se(t, p), o.render(0, !0, !0), o._enabled(!0), s = d.length; - 1 < --s;)
                    if ((r = nt(d[s], h[s], p[s])).firstMPT) {
                        for (a in r = r.difs, i) c[a] && (r[a] = i[a]);
                        for (a in n = {}, r) n[a] = h[s][a];
                        l.push(N.fromTo(d[s], e, n, r))
                    }
                return l
            }, a.activate([G]), G
        }, !0), t = _gsScope._gsDefine.plugin({
            propName: "roundProps",
            version: "1.7.0",
            priority: -1,
            API: 2,
            init: function(t, e, i) {
                return this._tween = i, !0
            }
        }), l = function(e) {
            var i = e < 1 ? Math.pow(10, (e + "").length - 2) : 1;
            return function(t) {
                return (Math.round(t / e) * e * i | 0) / i
            }
        }, h = function(t, e) {
            for (; t;) t.f || t.blob || (t.m = e || Math.round), t = t._next
        }, (e = t.prototype)._onInitAllProps = function() {
            var t, e, i, s, r = this._tween,
                a = r.vars.roundProps,
                n = {},
                o = r._propLookup.roundProps;
            if ("object" != typeof a || a.push)
                for ("string" == typeof a && (a = a.split(",")), i = a.length; - 1 < --i;) n[a[i]] = Math.round;
            else
                for (s in a) n[s] = l(a[s]);
            for (s in n)
                for (t = r._firstPT; t;) e = t._next, t.pg ? t.t._mod(n) : t.n === s && (2 === t.f && t.t ? h(t.t._firstPT, n[s]) : (this._add(t.t, s, t.s, t.c, n[s]), e && (e._prev = t._prev), t._prev ? t._prev._next = e : r._firstPT === t && (r._firstPT = e), t._next = t._prev = null, r._propLookup[s] = o)), t = e;
            return !1
        }, e._add = function(t, e, i, s, r) {
            this._addTween(t, e, i, i + s, e, r || Math.round), this._overwriteProps.push(e)
        }, _gsScope._gsDefine.plugin({
            propName: "attr",
            API: 2,
            version: "0.6.1",
            init: function(t, e, i, s) {
                var r, a;
                if ("function" != typeof t.setAttribute) return !1;
                for (r in e) "function" == typeof(a = e[r]) && (a = a(s, t)), this._addTween(t, "setAttribute", t.getAttribute(r) + "", a + "", r, !1, r), this._overwriteProps.push(r);
                return !0
            }
        }), _gsScope._gsDefine.plugin({
            propName: "directionalRotation",
            version: "0.3.1",
            API: 2,
            init: function(t, e, i, s) {
                "object" != typeof e && (e = {
                    rotation: e
                }), this.finals = {};
                var r, a, n, o, l, h, p = !0 === e.useRadians ? 2 * Math.PI : 360;
                for (r in e) "useRadians" !== r && ("function" == typeof(o = e[r]) && (o = o(s, t)), a = (h = (o + "").split("_"))[0], n = parseFloat("function" != typeof t[r] ? t[r] : t[r.indexOf("set") || "function" != typeof t["get" + r.substr(3)] ? r : "get" + r.substr(3)]()), l = (o = this.finals[r] = "string" == typeof a && "=" === a.charAt(1) ? n + parseInt(a.charAt(0) + "1", 10) * Number(a.substr(2)) : Number(a) || 0) - n, h.length && (-1 !== (a = h.join("_")).indexOf("short") && ((l %= p) !== l % (p / 2) && (l = l < 0 ? l + p : l - p)), -1 !== a.indexOf("_cw") && l < 0 ? l = (l + 9999999999 * p) % p - (l / p | 0) * p : -1 !== a.indexOf("ccw") && 0 < l && (l = (l - 9999999999 * p) % p - (l / p | 0) * p)), (1e-6 < l || l < -1e-6) && (this._addTween(t, r, n, n + l, r), this._overwriteProps.push(r)));
                return !0
            },
            set: function(t) {
                var e;
                if (1 !== t) this._super.setRatio.call(this, t);
                else
                    for (e = this._firstPT; e;) e.f ? e.t[e.p](this.finals[e.p]) : e.t[e.p] = this.finals[e.p], e = e._next
            }
        })._autoCSS = !0, _gsScope._gsDefine("easing.Back", ["easing.Ease"], function(g) {
            var i, s, e, t, r = _gsScope.GreenSockGlobals || _gsScope,
                a = r.com.greensock,
                n = 2 * Math.PI,
                o = Math.PI / 2,
                l = a._class,
                h = function(t, e) {
                    var i = l("easing." + t, function() {}, !0),
                        s = i.prototype = new g;
                    return s.constructor = i, s.getRatio = e, i
                },
                p = g.register || function() {},
                d = function(t, e, i, s, r) {
                    var a = l("easing." + t, {
                        easeOut: new e,
                        easeIn: new i,
                        easeInOut: new s
                    }, !0);
                    return p(a, t), a
                },
                v = function(t, e, i) {
                    this.t = t, this.v = e, i && (((this.next = i).prev = this).c = i.v - e, this.gap = i.t - t)
                },
                c = function(t, e) {
                    var i = l("easing." + t, function(t) {
                            this._p1 = t || 0 === t ? t : 1.70158, this._p2 = 1.525 * this._p1
                        }, !0),
                        s = i.prototype = new g;
                    return s.constructor = i, s.getRatio = e, s.config = function(t) {
                        return new i(t)
                    }, i
                },
                f = d("Back", c("BackOut", function(t) {
                    return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1
                }), c("BackIn", function(t) {
                    return t * t * ((this._p1 + 1) * t - this._p1)
                }), c("BackInOut", function(t) {
                    return (t *= 2) < 1 ? .5 * t * t * ((this._p2 + 1) * t - this._p2) : .5 * ((t -= 2) * t * ((this._p2 + 1) * t + this._p2) + 2)
                })),
                u = l("easing.SlowMo", function(t, e, i) {
                    e = e || 0 === e ? e : .7, null == t ? t = .7 : 1 < t && (t = 1), this._p = 1 !== t ? e : 0, this._p1 = (1 - t) / 2, this._p2 = t, this._p3 = this._p1 + this._p2, this._calcEnd = !0 === i
                }, !0),
                m = u.prototype = new g;
            return m.constructor = u, m.getRatio = function(t) {
                var e = t + (.5 - t) * this._p;
                return t < this._p1 ? this._calcEnd ? 1 - (t = 1 - t / this._p1) * t : e - (t = 1 - t / this._p1) * t * t * t * e : t > this._p3 ? this._calcEnd ? 1 === t ? 0 : 1 - (t = (t - this._p3) / this._p1) * t : e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t : this._calcEnd ? 1 : e
            }, u.ease = new u(.7, .7), m.config = u.config = function(t, e, i) {
                return new u(t, e, i)
            }, (m = (i = l("easing.SteppedEase", function(t, e) {
                t = t || 1, this._p1 = 1 / t, this._p2 = t + (e ? 0 : 1), this._p3 = e ? 1 : 0
            }, !0)).prototype = new g).constructor = i, m.getRatio = function(t) {
                return t < 0 ? t = 0 : 1 <= t && (t = .999999999), ((this._p2 * t | 0) + this._p3) * this._p1
            }, m.config = i.config = function(t, e) {
                return new i(t, e)
            }, (m = (s = l("easing.ExpoScaleEase", function(t, e, i) {
                this._p1 = Math.log(e / t), this._p2 = e - t, this._p3 = t, this._ease = i
            }, !0)).prototype = new g).constructor = s, m.getRatio = function(t) {
                return this._ease && (t = this._ease.getRatio(t)), (this._p3 * Math.exp(this._p1 * t) - this._p3) / this._p2
            }, m.config = s.config = function(t, e, i) {
                return new s(t, e, i)
            }, (m = (e = l("easing.RoughEase", function(t) {
                for (var e, i, s, r, a, n, o = (t = t || {}).taper || "none", l = [], h = 0, p = 0 | (t.points || 20), d = p, c = !1 !== t.randomize, f = !0 === t.clamp, u = t.template instanceof g ? t.template : null, m = "number" == typeof t.strength ? .4 * t.strength : .4; - 1 < --d;) e = c ? Math.random() : 1 / p * d, i = u ? u.getRatio(e) : e, s = "none" === o ? m : "out" === o ? (r = 1 - e) * r * m : "in" === o ? e * e * m : (r = e < .5 ? 2 * e : 2 * (1 - e)) * r * .5 * m, c ? i += Math.random() * s - .5 * s : d % 2 ? i += .5 * s : i -= .5 * s, f && (1 < i ? i = 1 : i < 0 && (i = 0)), l[h++] = {
                    x: e,
                    y: i
                };
                for (l.sort(function(t, e) {
                        return t.x - e.x
                    }), n = new v(1, 1, null), d = p; - 1 < --d;) a = l[d], n = new v(a.x, a.y, n);
                this._prev = new v(0, 0, 0 !== n.t ? n : n.next)
            }, !0)).prototype = new g).constructor = e, m.getRatio = function(t) {
                var e = this._prev;
                if (t > e.t) {
                    for (; e.next && t >= e.t;) e = e.next;
                    e = e.prev
                } else
                    for (; e.prev && t <= e.t;) e = e.prev;
                return (this._prev = e).v + (t - e.t) / e.gap * e.c
            }, m.config = function(t) {
                return new e(t)
            }, e.ease = new e, d("Bounce", h("BounceOut", function(t) {
                return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
            }), h("BounceIn", function(t) {
                return (t = 1 - t) < 1 / 2.75 ? 1 - 7.5625 * t * t : t < 2 / 2.75 ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : t < 2.5 / 2.75 ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 1 - (7.5625 * (t -= 2.625 / 2.75) * t + .984375)
            }), h("BounceInOut", function(t) {
                var e = t < .5;
                return t = (t = e ? 1 - 2 * t : 2 * t - 1) < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375, e ? .5 * (1 - t) : .5 * t + .5
            })), d("Circ", h("CircOut", function(t) {
                return Math.sqrt(1 - (t -= 1) * t)
            }), h("CircIn", function(t) {
                return -(Math.sqrt(1 - t * t) - 1)
            }), h("CircInOut", function(t) {
                return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
            })), d("Elastic", (t = function(t, e, i) {
                var s = l("easing." + t, function(t, e) {
                        this._p1 = 1 <= t ? t : 1, this._p2 = (e || i) / (t < 1 ? t : 1), this._p3 = this._p2 / n * (Math.asin(1 / this._p1) || 0), this._p2 = n / this._p2
                    }, !0),
                    r = s.prototype = new g;
                return r.constructor = s, r.getRatio = e, r.config = function(t, e) {
                    return new s(t, e)
                }, s
            })("ElasticOut", function(t) {
                return this._p1 * Math.pow(2, -10 * t) * Math.sin((t - this._p3) * this._p2) + 1
            }, .3), t("ElasticIn", function(t) {
                return -this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2)
            }, .3), t("ElasticInOut", function(t) {
                return (t *= 2) < 1 ? this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2) * -.5 : this._p1 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2) * .5 + 1
            }, .45)), d("Expo", h("ExpoOut", function(t) {
                return 1 - Math.pow(2, -10 * t)
            }), h("ExpoIn", function(t) {
                return Math.pow(2, 10 * (t - 1)) - .001
            }), h("ExpoInOut", function(t) {
                return (t *= 2) < 1 ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
            })), d("Sine", h("SineOut", function(t) {
                return Math.sin(t * o)
            }), h("SineIn", function(t) {
                return 1 - Math.cos(t * o)
            }), h("SineInOut", function(t) {
                return -.5 * (Math.cos(Math.PI * t) - 1)
            })), l("easing.EaseLookup", {
                find: function(t) {
                    return g.map[t]
                }
            }, !0), p(r.SlowMo, "SlowMo", "ease,"), p(e, "RoughEase", "ease,"), p(i, "SteppedEase", "ease,"), f
        }, !0)
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function(c, f) {
        "use strict";
        var u = {},
            s = c.document,
            m = c.GreenSockGlobals = c.GreenSockGlobals || c,
            t = m[f];
        if (t) return "undefined" != typeof module && module.exports && (module.exports = t);
        var e, i, r, g, v, a, n, y = function(t) {
                var e, i = t.split("."),
                    s = m;
                for (e = 0; e < i.length; e++) s[i[e]] = s = s[i[e]] || {};
                return s
            },
            d = y("com.greensock"),
            _ = 1e-8,
            l = function(t) {
                var e, i = [],
                    s = t.length;
                for (e = 0; e !== s; i.push(t[e++]));
                return i
            },
            b = function() {},
            x = (a = Object.prototype.toString, n = a.call([]), function(t) {
                return null != t && (t instanceof Array || "object" == typeof t && !!t.push && a.call(t) === n)
            }),
            T = {},
            w = function(o, l, h, p) {
                this.sc = T[o] ? T[o].sc : [], (T[o] = this).gsClass = null, this.func = h;
                var d = [];
                this.check = function(t) {
                    for (var e, i, s, r, a = l.length, n = a; - 1 < --a;)(e = T[l[a]] || new w(l[a], [])).gsClass ? (d[a] = e.gsClass, n--) : t && e.sc.push(this);
                    if (0 === n && h) {
                        if (s = (i = ("com.greensock." + o).split(".")).pop(), r = y(i.join("."))[s] = this.gsClass = h.apply(h, d), p)
                            if (m[s] = u[s] = r, "undefined" != typeof module && module.exports)
                                if (o === f)
                                    for (a in module.exports = u[f] = r, u) r[a] = u[a];
                                else u[f] && (u[f][s] = r);
                        else "function" == typeof define && define.amd && define((c.GreenSockAMDPath ? c.GreenSockAMDPath + "/" : "") + o.split(".").pop(), [], function() {
                            return r
                        });
                        for (a = 0; a < this.sc.length; a++) this.sc[a].check()
                    }
                }, this.check(!0)
            },
            o = c._gsDefine = function(t, e, i, s) {
                return new w(t, e, i, s)
            },
            E = d._class = function(t, e, i) {
                return e = e || function() {}, o(t, [], function() {
                    return e
                }, i), e
            };
        o.globals = m;
        var h = [0, 0, 1, 1],
            S = E("easing.Ease", function(t, e, i, s) {
                this._func = t, this._type = i || 0, this._power = s || 0, this._params = e ? h.concat(e) : h
            }, !0),
            P = S.map = {},
            p = S.register = function(t, e, i, s) {
                for (var r, a, n, o, l = e.split(","), h = l.length, p = (i || "easeIn,easeOut,easeInOut").split(","); - 1 < --h;)
                    for (a = l[h], r = s ? E("easing." + a, null, !0) : d.easing[a] || {}, n = p.length; - 1 < --n;) o = p[n], P[a + "." + o] = P[o + a] = r[o] = t.getRatio ? t : t[o] || new t
            };
        for ((r = S.prototype)._calcEnd = !1, r.getRatio = function(t) {
                if (this._func) return this._params[0] = t, this._func.apply(null, this._params);
                var e = this._type,
                    i = this._power,
                    s = 1 === e ? 1 - t : 2 === e ? t : t < .5 ? 2 * t : 2 * (1 - t);
                return 1 === i ? s *= s : 2 === i ? s *= s * s : 3 === i ? s *= s * s * s : 4 === i && (s *= s * s * s * s), 1 === e ? 1 - s : 2 === e ? s : t < .5 ? s / 2 : 1 - s / 2
            }, i = (e = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"]).length; - 1 < --i;) r = e[i] + ",Power" + i, p(new S(null, null, 1, i), r, "easeOut", !0), p(new S(null, null, 2, i), r, "easeIn" + (0 === i ? ",easeNone" : "")), p(new S(null, null, 3, i), r, "easeInOut");
        P.linear = d.easing.Linear.easeIn, P.swing = d.easing.Quad.easeInOut;
        var C = E("events.EventDispatcher", function(t) {
            this._listeners = {}, this._eventTarget = t || this
        });
        (r = C.prototype).addEventListener = function(t, e, i, s, r) {
            r = r || 0;
            var a, n, o = this._listeners[t],
                l = 0;
            for (this !== g || v || g.wake(), null == o && (this._listeners[t] = o = []), n = o.length; - 1 < --n;)(a = o[n]).c === e && a.s === i ? o.splice(n, 1) : 0 === l && a.pr < r && (l = n + 1);
            o.splice(l, 0, {
                c: e,
                s: i,
                up: s,
                pr: r
            })
        }, r.removeEventListener = function(t, e) {
            var i, s = this._listeners[t];
            if (s)
                for (i = s.length; - 1 < --i;)
                    if (s[i].c === e) return void s.splice(i, 1)
        }, r.dispatchEvent = function(t) {
            var e, i, s, r = this._listeners[t];
            if (r)
                for (1 < (e = r.length) && (r = r.slice(0)), i = this._eventTarget; - 1 < --e;)(s = r[e]) && (s.up ? s.c.call(s.s || i, {
                    type: t,
                    target: i
                }) : s.c.call(s.s || i))
        };
        var k = c.requestAnimationFrame,
            M = c.cancelAnimationFrame,
            A = Date.now || function() {
                return (new Date).getTime()
            },
            D = A();
        for (i = (e = ["ms", "moz", "webkit", "o"]).length; - 1 < --i && !k;) k = c[e[i] + "RequestAnimationFrame"], M = c[e[i] + "CancelAnimationFrame"] || c[e[i] + "CancelRequestAnimationFrame"];
        E("Ticker", function(t, e) {
            var r, a, n, o, l, h = this,
                p = A(),
                i = !(!1 === e || !k) && "auto",
                d = 500,
                c = 33,
                f = function(t) {
                    var e, i, s = A() - D;
                    d < s && (p += s - c), D += s, h.time = (D - p) / 1e3, e = h.time - l, (!r || 0 < e || !0 === t) && (h.frame++, l += e + (o <= e ? .004 : o - e), i = !0), !0 !== t && (n = a(f)), i && h.dispatchEvent("tick")
                };
            C.call(h), h.time = h.frame = 0, h.tick = function() {
                f(!0)
            }, h.lagSmoothing = function(t, e) {
                return arguments.length ? (d = t || 1e8, void(c = Math.min(e, d, 0))) : d < 1e8
            }, h.sleep = function() {
                null != n && (i && M ? M(n) : clearTimeout(n), a = b, n = null, h === g && (v = !1))
            }, h.wake = function(t) {
                null !== n ? h.sleep() : t ? p += -D + (D = A()) : 10 < h.frame && (D = A() - d + 5), a = 0 === r ? b : i && k ? k : function(t) {
                    return setTimeout(t, 1e3 * (l - h.time) + 1 | 0)
                }, h === g && (v = !0), f(2)
            }, h.fps = function(t) {
                return arguments.length ? (o = 1 / ((r = t) || 60), l = this.time + o, void h.wake()) : r
            }, h.useRAF = function(t) {
                return arguments.length ? (h.sleep(), i = t, void h.fps(r)) : i
            }, h.fps(t), setTimeout(function() {
                "auto" === i && h.frame < 5 && "hidden" !== (s || {}).visibilityState && h.useRAF(!1)
            }, 1500)
        }), (r = d.Ticker.prototype = new d.events.EventDispatcher).constructor = d.Ticker;
        var I = E("core.Animation", function(t, e) {
            if (this.vars = e = e || {}, this._duration = this._totalDuration = t || 0, this._delay = Number(e.delay) || 0, this._timeScale = 1, this._active = !!e.immediateRender, this.data = e.data, this._reversed = !!e.reversed, Q) {
                v || g.wake();
                var i = this.vars.useFrames ? Z : Q;
                i.add(this, i._time), this.vars.paused && this.paused(!0)
            }
        });
        g = I.ticker = new d.Ticker, (r = I.prototype)._dirty = r._gc = r._initted = r._paused = !1, r._totalTime = r._time = 0, r._rawPrevTime = -1, r._next = r._last = r._onUpdate = r._timeline = r.timeline = null, r._paused = !1;
        var F = function() {
            v && 2e3 < A() - D && ("hidden" !== (s || {}).visibilityState || !g.lagSmoothing()) && g.wake();
            var t = setTimeout(F, 2e3);
            t.unref && t.unref()
        };
        F(), r.play = function(t, e) {
            return null != t && this.seek(t, e), this.reversed(!1).paused(!1)
        }, r.pause = function(t, e) {
            return null != t && this.seek(t, e), this.paused(!0)
        }, r.resume = function(t, e) {
            return null != t && this.seek(t, e), this.paused(!1)
        }, r.seek = function(t, e) {
            return this.totalTime(Number(t), !1 !== e)
        }, r.restart = function(t, e) {
            return this.reversed(!1).paused(!1).totalTime(t ? -this._delay : 0, !1 !== e, !0)
        }, r.reverse = function(t, e) {
            return null != t && this.seek(t || this.totalDuration(), e), this.reversed(!0).paused(!1)
        }, r.render = function(t, e, i) {}, r.invalidate = function() {
            return this._time = this._totalTime = 0, this._initted = this._gc = !1, this._rawPrevTime = -1, (this._gc || !this.timeline) && this._enabled(!0), this
        }, r.isActive = function() {
            var t, e = this._timeline,
                i = this._startTime;
            return !e || !this._gc && !this._paused && e.isActive() && (t = e.rawTime(!0)) >= i && t < i + this.totalDuration() / this._timeScale - _
        }, r._enabled = function(t, e) {
            return v || g.wake(), this._gc = !t, this._active = this.isActive(), !0 !== e && (t && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !t && this.timeline && this._timeline._remove(this, !0)), !1
        }, r._kill = function(t, e) {
            return this._enabled(!1, !1)
        }, r.kill = function(t, e) {
            return this._kill(t, e), this
        }, r._uncache = function(t) {
            for (var e = t ? this : this.timeline; e;) e._dirty = !0, e = e.timeline;
            return this
        }, r._swapSelfInParams = function(t) {
            for (var e = t.length, i = t.concat(); - 1 < --e;) "{self}" === t[e] && (i[e] = this);
            return i
        }, r._callback = function(t) {
            var e = this.vars,
                i = e[t],
                s = e[t + "Params"],
                r = e[t + "Scope"] || e.callbackScope || this;
            switch (s ? s.length : 0) {
                case 0:
                    i.call(r);
                    break;
                case 1:
                    i.call(r, s[0]);
                    break;
                case 2:
                    i.call(r, s[0], s[1]);
                    break;
                default:
                    i.apply(r, s)
            }
        }, r.eventCallback = function(t, e, i, s) {
            if ("on" === (t || "").substr(0, 2)) {
                var r = this.vars;
                if (1 === arguments.length) return r[t];
                null == e ? delete r[t] : (r[t] = e, r[t + "Params"] = x(i) && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i, r[t + "Scope"] = s), "onUpdate" === t && (this._onUpdate = e)
            }
            return this
        }, r.delay = function(t) {
            return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + t - this._delay), this._delay = t, this) : this._delay
        }, r.duration = function(t) {
            return arguments.length ? (this._duration = this._totalDuration = t, this._uncache(!0), this._timeline.smoothChildTiming && 0 < this._time && this._time < this._duration && 0 !== t && this.totalTime(this._totalTime * (t / this._duration), !0), this) : (this._dirty = !1, this._duration)
        }, r.totalDuration = function(t) {
            return this._dirty = !1, arguments.length ? this.duration(t) : this._totalDuration
        }, r.time = function(t, e) {
            return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(t > this._duration ? this._duration : t, e)) : this._time
        }, r.totalTime = function(t, e, i) {
            if (v || g.wake(), !arguments.length) return this._totalTime;
            if (this._timeline) {
                if (t < 0 && !i && (t += this.totalDuration()), this._timeline.smoothChildTiming) {
                    this._dirty && this.totalDuration();
                    var s = this._totalDuration,
                        r = this._timeline;
                    if (s < t && !i && (t = s), this._startTime = (this._paused ? this._pauseTime : r._time) - (this._reversed ? s - t : t) / this._timeScale, r._dirty || this._uncache(!1), r._timeline)
                        for (; r._timeline;) r._timeline._time !== (r._startTime + r._totalTime) / r._timeScale && r.totalTime(r._totalTime, !0), r = r._timeline
                }
                this._gc && this._enabled(!0, !1), (this._totalTime !== t || 0 === this._duration) && (L.length && tt(), this.render(t, e, !1), L.length && tt())
            }
            return this
        }, r.progress = r.totalProgress = function(t, e) {
            var i = this.duration();
            return arguments.length ? this.totalTime(i * t, e) : i ? this._time / i : this.ratio
        }, r.startTime = function(t) {
            return arguments.length ? (t !== this._startTime && (this._startTime = t, this.timeline && this.timeline._sortChildren && this.timeline.add(this, t - this._delay)), this) : this._startTime
        }, r.endTime = function(t) {
            return this._startTime + (0 != t ? this.totalDuration() : this.duration()) / this._timeScale
        }, r.timeScale = function(t) {
            if (!arguments.length) return this._timeScale;
            var e, i;
            for (t = t || _, this._timeline && this._timeline.smoothChildTiming && (i = (e = this._pauseTime) || 0 === e ? e : this._timeline.totalTime(), this._startTime = i - (i - this._startTime) * this._timeScale / t), this._timeScale = t, i = this.timeline; i && i.timeline;) i._dirty = !0, i.totalDuration(), i = i.timeline;
            return this
        }, r.reversed = function(t) {
            return arguments.length ? (t != this._reversed && (this._reversed = t, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed
        }, r.paused = function(t) {
            if (!arguments.length) return this._paused;
            var e, i, s = this._timeline;
            return t != this._paused && s && (v || t || g.wake(), i = (e = s.rawTime()) - this._pauseTime, !t && s.smoothChildTiming && (this._startTime += i, this._uncache(!1)), this._pauseTime = t ? e : null, this._paused = t, this._active = this.isActive(), !t && 0 !== i && this._initted && this.duration() && (e = s.smoothChildTiming ? this._totalTime : (e - this._startTime) / this._timeScale, this.render(e, e === this._totalTime, !0))), this._gc && !t && this._enabled(!0, !1), this
        };
        var R = E("core.SimpleTimeline", function(t) {
            I.call(this, 0, t), this.autoRemoveChildren = this.smoothChildTiming = !0
        });
        (r = R.prototype = new I).constructor = R, r.kill()._gc = !1, r._first = r._last = r._recent = null, r._sortChildren = !1, r.add = r.insert = function(t, e, i, s) {
            var r, a;
            if (t._startTime = Number(e || 0) + t._delay, t._paused && this !== t._timeline && (t._pauseTime = this.rawTime() - (t._timeline.rawTime() - t._pauseTime)), t.timeline && t.timeline._remove(t, !0), t.timeline = t._timeline = this, t._gc && t._enabled(!0, !0), r = this._last, this._sortChildren)
                for (a = t._startTime; r && r._startTime > a;) r = r._prev;
            return r ? (t._next = r._next, r._next = t) : (t._next = this._first, this._first = t), t._next ? t._next._prev = t : this._last = t, t._prev = r, this._recent = t, this._timeline && this._uncache(!0), this
        }, r._remove = function(t, e) {
            return t.timeline === this && (e || t._enabled(!1, !0), t._prev ? t._prev._next = t._next : this._first === t && (this._first = t._next), t._next ? t._next._prev = t._prev : this._last === t && (this._last = t._prev), t._next = t._prev = t.timeline = null, t === this._recent && (this._recent = this._last), this._timeline && this._uncache(!0)), this
        }, r.render = function(t, e, i) {
            var s, r = this._first;
            for (this._totalTime = this._time = this._rawPrevTime = t; r;) s = r._next, (r._active || t >= r._startTime && !r._paused && !r._gc) && (r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (t - r._startTime) * r._timeScale, e, i) : r.render((t - r._startTime) * r._timeScale, e, i)), r = s
        }, r.rawTime = function() {
            return v || g.wake(), this._totalTime
        };
        var O = E("TweenLite", function(t, e, i) {
                if (I.call(this, e, i), this.render = O.prototype.render, null == t) throw "Cannot tween a null target.";
                this.target = t = "string" != typeof t ? t : O.selector(t) || t;
                var s, r, a, n = t.jquery || t.length && t !== c && t[0] && (t[0] === c || t[0].nodeType && t[0].style && !t.nodeType),
                    o = this.vars.overwrite;
                if (this._overwrite = o = null == o ? K[O.defaultOverwrite] : "number" == typeof o ? o >> 0 : K[o], (n || t instanceof Array || t.push && x(t)) && "number" != typeof t[0])
                    for (this._targets = a = l(t), this._propLookup = [], this._siblings = [], s = 0; s < a.length; s++)(r = a[s]) ? "string" != typeof r ? r.length && r !== c && r[0] && (r[0] === c || r[0].nodeType && r[0].style && !r.nodeType) ? (a.splice(s--, 1), this._targets = a = a.concat(l(r))) : (this._siblings[s] = et(r, this, !1), 1 === o && 1 < this._siblings[s].length && st(r, this, null, 1, this._siblings[s])) : "string" == typeof(r = a[s--] = O.selector(r)) && a.splice(s + 1, 1) : a.splice(s--, 1);
                else this._propLookup = {}, this._siblings = et(t, this, !1), 1 === o && 1 < this._siblings.length && st(t, this, null, 1, this._siblings);
                (this.vars.immediateRender || 0 === e && 0 === this._delay && !1 !== this.vars.immediateRender) && (this._time = -_, this.render(Math.min(0, -this._delay)))
            }, !0),
            z = function(t) {
                return t && t.length && t !== c && t[0] && (t[0] === c || t[0].nodeType && t[0].style && !t.nodeType)
            };
        (r = O.prototype = new I).constructor = O, r.kill()._gc = !1, r.ratio = 0, r._firstPT = r._targets = r._overwrittenProps = r._startAt = null, r._notifyPluginsOfEnabled = r._lazy = !1, O.version = "2.1.2", O.defaultEase = r._ease = new S(null, null, 1, 1), O.defaultOverwrite = "auto", O.ticker = g, O.autoSleep = 120, O.lagSmoothing = function(t, e) {
            g.lagSmoothing(t, e)
        }, O.selector = c.$ || c.jQuery || function(t) {
            var e = c.$ || c.jQuery;
            return e ? (O.selector = e)(t) : (s || (s = c.document), s ? s.querySelectorAll ? s.querySelectorAll(t) : s.getElementById("#" === t.charAt(0) ? t.substr(1) : t) : t)
        };
        var L = [],
            B = {},
            V = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
            N = /[\+-]=-?[\.\d]/,
            G = function(t) {
                for (var e, i = this._firstPT; i;) e = i.blob ? 1 === t && null != this.end ? this.end : t ? this.join("") : this.start : i.c * t + i.s, i.m ? e = i.m.call(this._tween, e, this._target || i.t, this._tween) : e < 1e-6 && -1e-6 < e && !i.blob && (e = 0), i.f ? i.fp ? i.t[i.p](i.fp, e) : i.t[i.p](e) : i.t[i.p] = e, i = i._next
            },
            H = function(t) {
                return (1e3 * t | 0) / 1e3 + ""
            },
            $ = function(t, e, i, s) {
                var r, a, n, o, l, h, p, d = [],
                    c = 0,
                    f = "",
                    u = 0;
                for (d.start = t, d.end = e, t = d[0] = t + "", e = d[1] = e + "", i && (i(d), t = d[0], e = d[1]), d.length = 0, r = t.match(V) || [], a = e.match(V) || [], s && (s._next = null, s.blob = 1, d._firstPT = d._applyPT = s), l = a.length, o = 0; o < l; o++) p = a[o], f += (h = e.substr(c, e.indexOf(p, c) - c)) || !o ? h : ",", c += h.length, u ? u = (u + 1) % 5 : "rgba(" === h.substr(-5) && (u = 1), p === r[o] || r.length <= o ? f += p : (f && (d.push(f), f = ""), n = parseFloat(r[o]), d.push(n), d._firstPT = {
                    _next: d._firstPT,
                    t: d,
                    p: d.length - 1,
                    s: n,
                    c: ("=" === p.charAt(1) ? parseInt(p.charAt(0) + "1", 10) * parseFloat(p.substr(2)) : parseFloat(p) - n) || 0,
                    f: 0,
                    m: u && u < 4 ? Math.round : H
                }), c += p.length;
                return (f += e.substr(c)) && d.push(f), d.setRatio = G, N.test(e) && (d.end = null), d
            },
            j = function(t, e, i, s, r, a, n, o, l) {
                "function" == typeof s && (s = s(l || 0, t));
                var h = typeof t[e],
                    p = "function" !== h ? "" : e.indexOf("set") || "function" != typeof t["get" + e.substr(3)] ? e : "get" + e.substr(3),
                    d = "get" !== i ? i : p ? n ? t[p](n) : t[p]() : t[e],
                    c = "string" == typeof s && "=" === s.charAt(1),
                    f = {
                        t: t,
                        p: e,
                        s: d,
                        f: "function" === h,
                        pg: 0,
                        n: r || e,
                        m: a ? "function" == typeof a ? a : Math.round : 0,
                        pr: 0,
                        c: c ? parseInt(s.charAt(0) + "1", 10) * parseFloat(s.substr(2)) : parseFloat(s) - d || 0
                    };
                return ("number" != typeof d || "number" != typeof s && !c) && (n || isNaN(d) || !c && isNaN(s) || "boolean" == typeof d || "boolean" == typeof s ? (f.fp = n, f = {
                    t: $(d, c ? parseFloat(f.s) + f.c + (f.s + "").replace(/[0-9\-\.]/g, "") : s, o || O.defaultStringFilter, f),
                    p: "setRatio",
                    s: 0,
                    c: 1,
                    f: 2,
                    pg: 0,
                    n: r || e,
                    pr: 0,
                    m: 0
                }) : (f.s = parseFloat(d), c || (f.c = parseFloat(s) - f.s || 0))), f.c ? ((f._next = this._firstPT) && (f._next._prev = f), this._firstPT = f) : void 0
            },
            X = O._internals = {
                isArray: x,
                isSelector: z,
                lazyTweens: L,
                blobDif: $
            },
            Y = O._plugins = {},
            q = X.tweenLookup = {},
            W = 0,
            U = X.reservedProps = {
                ease: 1,
                delay: 1,
                overwrite: 1,
                onComplete: 1,
                onCompleteParams: 1,
                onCompleteScope: 1,
                useFrames: 1,
                runBackwards: 1,
                startAt: 1,
                onUpdate: 1,
                onUpdateParams: 1,
                onUpdateScope: 1,
                onStart: 1,
                onStartParams: 1,
                onStartScope: 1,
                onReverseComplete: 1,
                onReverseCompleteParams: 1,
                onReverseCompleteScope: 1,
                onRepeat: 1,
                onRepeatParams: 1,
                onRepeatScope: 1,
                easeParams: 1,
                yoyo: 1,
                immediateRender: 1,
                repeat: 1,
                repeatDelay: 1,
                data: 1,
                paused: 1,
                reversed: 1,
                autoCSS: 1,
                lazy: 1,
                onOverwrite: 1,
                callbackScope: 1,
                stringFilter: 1,
                id: 1,
                yoyoEase: 1,
                stagger: 1
            },
            K = {
                none: 0,
                all: 1,
                auto: 2,
                concurrent: 3,
                allOnStart: 4,
                preexisting: 5,
                true: 1,
                false: 0
            },
            Z = I._rootFramesTimeline = new R,
            Q = I._rootTimeline = new R,
            J = 30,
            tt = X.lazyRender = function() {
                var t, e, i = L.length;
                for (B = {}, t = 0; t < i; t++)(e = L[t]) && !1 !== e._lazy && (e.render(e._lazy[0], e._lazy[1], !0), e._lazy = !1);
                L.length = 0
            };
        Q._startTime = g.time, Z._startTime = g.frame, Q._active = Z._active = !0, setTimeout(tt, 1), I._updateRoot = O.render = function() {
            var t, e, i;
            if (L.length && tt(), Q.render((g.time - Q._startTime) * Q._timeScale, !1, !1), Z.render((g.frame - Z._startTime) * Z._timeScale, !1, !1), L.length && tt(), g.frame >= J) {
                for (i in J = g.frame + (parseInt(O.autoSleep, 10) || 120), q) {
                    for (t = (e = q[i].tweens).length; - 1 < --t;) e[t]._gc && e.splice(t, 1);
                    0 === e.length && delete q[i]
                }
                if ((!(i = Q._first) || i._paused) && O.autoSleep && !Z._first && 1 === g._listeners.tick.length) {
                    for (; i && i._paused;) i = i._next;
                    i || g.sleep()
                }
            }
        }, g.addEventListener("tick", I._updateRoot);
        var et = function(t, e, i) {
                var s, r, a = t._gsTweenID;
                if (q[a || (t._gsTweenID = a = "t" + W++)] || (q[a] = {
                        target: t,
                        tweens: []
                    }), e && ((s = q[a].tweens)[r = s.length] = e, i))
                    for (; - 1 < --r;) s[r] === e && s.splice(r, 1);
                return q[a].tweens
            },
            it = function(t, e, i, s) {
                var r, a, n = t.vars.onOverwrite;
                return n && (r = n(t, e, i, s)), (n = O.onOverwrite) && (a = n(t, e, i, s)), !1 !== r && !1 !== a
            },
            st = function(t, e, i, s, r) {
                var a, n, o, l;
                if (1 === s || 4 <= s) {
                    for (l = r.length, a = 0; a < l; a++)
                        if ((o = r[a]) !== e) o._gc || o._kill(null, t, e) && (n = !0);
                        else if (5 === s) break;
                    return n
                }
                var h, p = e._startTime + _,
                    d = [],
                    c = 0,
                    f = 0 === e._duration;
                for (a = r.length; - 1 < --a;)(o = r[a]) === e || o._gc || o._paused || (o._timeline !== e._timeline ? (h = h || rt(e, 0, f), 0 === rt(o, h, f) && (d[c++] = o)) : o._startTime <= p && o._startTime + o.totalDuration() / o._timeScale > p && ((f || !o._initted) && p - o._startTime <= 2e-8 || (d[c++] = o)));
                for (a = c; - 1 < --a;)
                    if (l = (o = d[a])._firstPT, 2 === s && o._kill(i, t, e) && (n = !0), 2 !== s || !o._firstPT && o._initted && l) {
                        if (2 !== s && !it(o, e)) continue;
                        o._enabled(!1, !1) && (n = !0)
                    }
                return n
            },
            rt = function(t, e, i) {
                for (var s = t._timeline, r = s._timeScale, a = t._startTime; s._timeline;) {
                    if (a += s._startTime, r *= s._timeScale, s._paused) return -100;
                    s = s._timeline
                }
                return e < (a /= r) ? a - e : i && a === e || !t._initted && a - e < 2e-8 ? _ : (a += t.totalDuration() / t._timeScale / r) > e + _ ? 0 : a - e - _
            };
        r._init = function() {
            var t, e, i, s, r, a, n = this.vars,
                o = this._overwrittenProps,
                l = this._duration,
                h = !!n.immediateRender,
                p = n.ease,
                d = this._startAt;
            if (n.startAt) {
                for (s in d && (d.render(-1, !0), d.kill()), r = {}, n.startAt) r[s] = n.startAt[s];
                if (r.data = "isStart", r.overwrite = !1, r.immediateRender = !0, r.lazy = h && !1 !== n.lazy, r.startAt = r.delay = null, r.onUpdate = n.onUpdate, r.onUpdateParams = n.onUpdateParams, r.onUpdateScope = n.onUpdateScope || n.callbackScope || this, this._startAt = O.to(this.target || {}, 0, r), h)
                    if (0 < this._time) this._startAt = null;
                    else if (0 !== l) return
            } else if (n.runBackwards && 0 !== l)
                if (d) d.render(-1, !0), d.kill(), this._startAt = null;
                else {
                    for (s in 0 !== this._time && (h = !1), i = {}, n) U[s] && "autoCSS" !== s || (i[s] = n[s]);
                    if (i.overwrite = 0, i.data = "isFromStart", i.lazy = h && !1 !== n.lazy, i.immediateRender = h, this._startAt = O.to(this.target, 0, i), h) {
                        if (0 === this._time) return
                    } else this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null)
                }
            if (this._ease = p = p ? p instanceof S ? p : "function" == typeof p ? new S(p, n.easeParams) : P[p] || O.defaultEase : O.defaultEase, n.easeParams instanceof Array && p.config && (this._ease = p.config.apply(p, n.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)
                for (a = this._targets.length, t = 0; t < a; t++) this._initProps(this._targets[t], this._propLookup[t] = {}, this._siblings[t], o ? o[t] : null, t) && (e = !0);
            else e = this._initProps(this.target, this._propLookup, this._siblings, o, 0);
            if (e && O._onPluginEvent("_onInitAllProps", this), o && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), n.runBackwards)
                for (i = this._firstPT; i;) i.s += i.c, i.c = -i.c, i = i._next;
            this._onUpdate = n.onUpdate, this._initted = !0
        }, r._initProps = function(t, e, i, s, r) {
            var a, n, o, l, h, p;
            if (null == t) return !1;
            for (a in B[t._gsTweenID] && tt(), this.vars.css || t.style && t !== c && t.nodeType && Y.css && !1 !== this.vars.autoCSS && function(t, e) {
                    var i, s = {};
                    for (i in t) U[i] || i in e && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!Y[i] || Y[i] && Y[i]._autoCSS) || (s[i] = t[i], delete t[i]);
                    t.css = s
                }(this.vars, t), this.vars)
                if (p = this.vars[a], U[a]) p && (p instanceof Array || p.push && x(p)) && -1 !== p.join("").indexOf("{self}") && (this.vars[a] = p = this._swapSelfInParams(p, this));
                else if (Y[a] && (l = new Y[a])._onInitTween(t, this.vars[a], this, r)) {
                for (this._firstPT = h = {
                        _next: this._firstPT,
                        t: l,
                        p: "setRatio",
                        s: 0,
                        c: 1,
                        f: 1,
                        n: a,
                        pg: 1,
                        pr: l._priority,
                        m: 0
                    }, n = l._overwriteProps.length; - 1 < --n;) e[l._overwriteProps[n]] = this._firstPT;
                (l._priority || l._onInitAllProps) && (o = !0), (l._onDisable || l._onEnable) && (this._notifyPluginsOfEnabled = !0), h._next && (h._next._prev = h)
            } else e[a] = j.call(this, t, a, "get", p, a, 0, null, this.vars.stringFilter, r);
            return s && this._kill(s, t) ? this._initProps(t, e, i, s, r) : 1 < this._overwrite && this._firstPT && 1 < i.length && st(t, this, e, this._overwrite, i) ? (this._kill(e, t), this._initProps(t, e, i, s, r)) : (this._firstPT && (!1 !== this.vars.lazy && this._duration || this.vars.lazy && !this._duration) && (B[t._gsTweenID] = !0), o)
        }, r.render = function(t, e, i) {
            var s, r, a, n, o = this,
                l = o._time,
                h = o._duration,
                p = o._rawPrevTime;
            if (h - _ <= t && 0 <= t) o._totalTime = o._time = h, o.ratio = o._ease._calcEnd ? o._ease.getRatio(1) : 1, o._reversed || (s = !0, r = "onComplete", i = i || o._timeline.autoRemoveChildren), 0 === h && (o._initted || !o.vars.lazy || i) && (o._startTime === o._timeline._duration && (t = 0), (p < 0 || t <= 0 && -_ <= t || p === _ && "isPause" !== o.data) && p !== t && (i = !0, _ < p && (r = "onReverseComplete")), o._rawPrevTime = n = !e || t || p === t ? t : _);
            else if (t < _) o._totalTime = o._time = 0, o.ratio = o._ease._calcEnd ? o._ease.getRatio(0) : 0, (0 !== l || 0 === h && 0 < p) && (r = "onReverseComplete", s = o._reversed), -_ < t ? t = 0 : t < 0 && (o._active = !1, 0 === h && (o._initted || !o.vars.lazy || i) && (0 <= p && (p !== _ || "isPause" !== o.data) && (i = !0), o._rawPrevTime = n = !e || t || p === t ? t : _)), (!o._initted || o._startAt && o._startAt.progress()) && (i = !0);
            else if (o._totalTime = o._time = t, o._easeType) {
                var d = t / h,
                    c = o._easeType,
                    f = o._easePower;
                (1 === c || 3 === c && .5 <= d) && (d = 1 - d), 3 === c && (d *= 2), 1 === f ? d *= d : 2 === f ? d *= d * d : 3 === f ? d *= d * d * d : 4 === f && (d *= d * d * d * d), o.ratio = 1 === c ? 1 - d : 2 === c ? d : t / h < .5 ? d / 2 : 1 - d / 2
            } else o.ratio = o._ease.getRatio(t / h);
            if (o._time !== l || i) {
                if (!o._initted) {
                    if (o._init(), !o._initted || o._gc) return;
                    if (!i && o._firstPT && (!1 !== o.vars.lazy && o._duration || o.vars.lazy && !o._duration)) return o._time = o._totalTime = l, o._rawPrevTime = p, L.push(o), void(o._lazy = [t, e]);
                    o._time && !s ? o.ratio = o._ease.getRatio(o._time / h) : s && o._ease._calcEnd && (o.ratio = o._ease.getRatio(0 === o._time ? 0 : 1))
                }
                for (!1 !== o._lazy && (o._lazy = !1), o._active || !o._paused && o._time !== l && 0 <= t && (o._active = !0), 0 === l && (o._startAt && (0 <= t ? o._startAt.render(t, !0, i) : r || (r = "_dummyGS")), o.vars.onStart && (0 !== o._time || 0 === h) && (e || o._callback("onStart"))), a = o._firstPT; a;) a.f ? a.t[a.p](a.c * o.ratio + a.s) : a.t[a.p] = a.c * o.ratio + a.s, a = a._next;
                o._onUpdate && (t < 0 && o._startAt && -1e-4 !== t && o._startAt.render(t, !0, i), e || (o._time !== l || s || i) && o._callback("onUpdate")), r && (!o._gc || i) && (t < 0 && o._startAt && !o._onUpdate && -1e-4 !== t && o._startAt.render(t, !0, i), s && (o._timeline.autoRemoveChildren && o._enabled(!1, !1), o._active = !1), !e && o.vars[r] && o._callback(r), 0 === h && o._rawPrevTime === _ && n !== _ && (o._rawPrevTime = 0))
            }
        }, r._kill = function(t, e, i) {
            if ("all" === t && (t = null), null == t && (null == e || e === this.target)) return this._lazy = !1, this._enabled(!1, !1);
            e = "string" != typeof e ? e || this._targets || this.target : O.selector(e) || e;
            var s, r, a, n, o, l, h, p, d, c = i && this._time && i._startTime === this._startTime && this._timeline === i._timeline,
                f = this._firstPT;
            if ((x(e) || z(e)) && "number" != typeof e[0])
                for (s = e.length; - 1 < --s;) this._kill(t, e[s], i) && (l = !0);
            else {
                if (this._targets) {
                    for (s = this._targets.length; - 1 < --s;)
                        if (e === this._targets[s]) {
                            o = this._propLookup[s] || {}, this._overwrittenProps = this._overwrittenProps || [], r = this._overwrittenProps[s] = t ? this._overwrittenProps[s] || {} : "all";
                            break
                        }
                } else {
                    if (e !== this.target) return !1;
                    o = this._propLookup, r = this._overwrittenProps = t ? this._overwrittenProps || {} : "all"
                }
                if (o) {
                    if (h = t || o, p = t !== r && "all" !== r && t !== o && ("object" != typeof t || !t._tempKill), i && (O.onOverwrite || this.vars.onOverwrite)) {
                        for (a in h) o[a] && (d || (d = []), d.push(a));
                        if ((d || !t) && !it(this, i, e, d)) return !1
                    }
                    for (a in h)(n = o[a]) && (c && (n.f ? n.t[n.p](n.s) : n.t[n.p] = n.s, l = !0), n.pg && n.t._kill(h) && (l = !0), n.pg && 0 !== n.t._overwriteProps.length || (n._prev ? n._prev._next = n._next : n === this._firstPT && (this._firstPT = n._next), n._next && (n._next._prev = n._prev), n._next = n._prev = null), delete o[a]), p && (r[a] = 1);
                    !this._firstPT && this._initted && f && this._enabled(!1, !1)
                }
            }
            return l
        }, r.invalidate = function() {
            this._notifyPluginsOfEnabled && O._onPluginEvent("_onDisable", this);
            var t = this._time;
            return this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null, this._notifyPluginsOfEnabled = this._active = this._lazy = !1, this._propLookup = this._targets ? {} : [], I.prototype.invalidate.call(this), this.vars.immediateRender && (this._time = -_, this.render(t, !1, !1 !== this.vars.lazy)), this
        }, r._enabled = function(t, e) {
            if (v || g.wake(), t && this._gc) {
                var i, s = this._targets;
                if (s)
                    for (i = s.length; - 1 < --i;) this._siblings[i] = et(s[i], this, !0);
                else this._siblings = et(this.target, this, !0)
            }
            return I.prototype._enabled.call(this, t, e), !(!this._notifyPluginsOfEnabled || !this._firstPT) && O._onPluginEvent(t ? "_onEnable" : "_onDisable", this)
        }, O.to = function(t, e, i) {
            return new O(t, e, i)
        }, O.from = function(t, e, i) {
            return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new O(t, e, i)
        }, O.fromTo = function(t, e, i, s) {
            return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, new O(t, e, s)
        }, O.delayedCall = function(t, e, i, s, r) {
            return new O(e, 0, {
                delay: t,
                onComplete: e,
                onCompleteParams: i,
                callbackScope: s,
                onReverseComplete: e,
                onReverseCompleteParams: i,
                immediateRender: !1,
                lazy: !1,
                useFrames: r,
                overwrite: 0
            })
        }, O.set = function(t, e) {
            return new O(t, 0, e)
        }, O.getTweensOf = function(t, e) {
            if (null == t) return [];
            var i, s, r, a;
            if (t = "string" != typeof t ? t : O.selector(t) || t, (x(t) || z(t)) && "number" != typeof t[0]) {
                for (i = t.length, s = []; - 1 < --i;) s = s.concat(O.getTweensOf(t[i], e));
                for (i = s.length; - 1 < --i;)
                    for (a = s[i], r = i; - 1 < --r;) a === s[r] && s.splice(i, 1)
            } else if (t._gsTweenID)
                for (i = (s = et(t).concat()).length; - 1 < --i;)(s[i]._gc || e && !s[i].isActive()) && s.splice(i, 1);
            return s || []
        }, O.killTweensOf = O.killDelayedCallsTo = function(t, e, i) {
            "object" == typeof e && (i = e, e = !1);
            for (var s = O.getTweensOf(t, e), r = s.length; - 1 < --r;) s[r]._kill(i, t)
        };
        var at = E("plugins.TweenPlugin", function(t, e) {
            this._overwriteProps = (t || "").split(","), this._propName = this._overwriteProps[0], this._priority = e || 0, this._super = at.prototype
        }, !0);
        if (r = at.prototype, at.version = "1.19.0", at.API = 2, r._firstPT = null, r._addTween = j, r.setRatio = G, r._kill = function(t) {
                var e, i = this._overwriteProps,
                    s = this._firstPT;
                if (null != t[this._propName]) this._overwriteProps = [];
                else
                    for (e = i.length; - 1 < --e;) null != t[i[e]] && i.splice(e, 1);
                for (; s;) null != t[s.n] && (s._next && (s._next._prev = s._prev), s._prev ? (s._prev._next = s._next, s._prev = null) : this._firstPT === s && (this._firstPT = s._next)), s = s._next;
                return !1
            }, r._mod = r._roundProps = function(t) {
                for (var e, i = this._firstPT; i;)(e = t[this._propName] || null != i.n && t[i.n.split(this._propName + "_").join("")]) && "function" == typeof e && (2 === i.f ? i.t._applyPT.m = e : i.m = e), i = i._next
            }, O._onPluginEvent = function(t, e) {
                var i, s, r, a, n, o = e._firstPT;
                if ("_onInitAllProps" === t) {
                    for (; o;) {
                        for (n = o._next, s = r; s && s.pr > o.pr;) s = s._next;
                        (o._prev = s ? s._prev : a) ? o._prev._next = o: r = o, (o._next = s) ? s._prev = o : a = o, o = n
                    }
                    o = e._firstPT = r
                }
                for (; o;) o.pg && "function" == typeof o.t[t] && o.t[t]() && (i = !0), o = o._next;
                return i
            }, at.activate = function(t) {
                for (var e = t.length; - 1 < --e;) t[e].API === at.API && (Y[(new t[e])._propName] = t[e]);
                return !0
            }, o.plugin = function(t) {
                if (!(t && t.propName && t.init && t.API)) throw "illegal plugin definition.";
                var e, i = t.propName,
                    s = t.priority || 0,
                    r = t.overwriteProps,
                    a = {
                        init: "_onInitTween",
                        set: "setRatio",
                        kill: "_kill",
                        round: "_mod",
                        mod: "_mod",
                        initAll: "_onInitAllProps"
                    },
                    n = E("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function() {
                        at.call(this, i, s), this._overwriteProps = r || []
                    }, !0 === t.global),
                    o = n.prototype = new at(i);
                for (e in (o.constructor = n).API = t.API, a) "function" == typeof t[e] && (o[a[e]] = t[e]);
                return n.version = t.version, at.activate([n]), n
            }, e = c._gsQueue) {
            for (i = 0; i < e.length; i++) e[i]();
            for (r in T) T[r].func || c.console.log("GSAP encountered missing dependency: " + r)
        }
        v = !1
    }("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenMax");