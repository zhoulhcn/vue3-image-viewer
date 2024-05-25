import { resolveDirective as ce, openBlock as m, createElementBlock as v, normalizeStyle as P, createElementVNode as f, normalizeClass as B, renderSlot as x, createCommentVNode as L, withDirectives as N, vShow as U, Fragment as Z, renderList as K, toDisplayString as se, withModifiers as E, pushScopeId as Q, popScopeId as ee, resolveComponent as S, createVNode as Y, withCtx as I, createBlock as j, createTextVNode as ye } from "vue";
const de = new IntersectionObserver(
  (e) => {
    for (const t of e)
      if (t.isIntersecting) {
        const o = t.target;
        o && o.dataset && (o.src = o.dataset.src, o.dispatchEvent(new Event("startLoad")), de.unobserve(o));
      }
  },
  {
    threshold: [0]
  }
), we = {
  mounted(e, t) {
    if (!t.value)
      return;
    const { src: o, active: n } = t.value;
    n ? (e.dataset.src = o, de.observe(e)) : e && (e.src = o, e.dispatchEvent(new Event("startLoad")));
  }
};
const C = (e, t) => {
  const o = e.__vccOpts || e;
  for (const [n, i] of t)
    o[n] = i;
  return o;
}, be = {
  directives: {
    lazyLoad: we
  },
  props: {
    src: { type: String, default: "" },
    aspectRatio: { type: Number, default: 0 },
    fit: { type: String, default: "" },
    lazy: { type: Boolean, default: !1 },
    bgColor: { type: String, default: "black" },
    alt: { type: String, default: "" },
    referrerPolicy: { type: String, default: "" }
  },
  data() {
    return {
      loading: !1,
      failure: !1,
      success: !1
    };
  },
  computed: {
    imgRatioWrapStyle() {
      const { bgColor: e, aspectRatio: t } = this, o = {
        position: "relative"
      };
      return o.backgroundColor = e, t ? (o.width = "100%", o.paddingBottom = `${t * 100}%`) : (o.width = "100%", o.height = "100%"), o;
    }
  },
  methods: {
    onStartLoad(e) {
      this.loading = !0, this.failure = !1, this.$emit("startLoad", e);
    },
    onLoaded(e) {
      this.loading = !1, this.failure = !1, this.success = !0, this.$emit("load", e);
    },
    onError(e) {
      this.loading = !1, this.failure = !0, this.success = !1, this.$emit("error", e);
    },
    handleImageClick(e) {
      this.$emit("click", e);
    }
  }
}, _e = {
  key: 0,
  class: "v3iv-status-slot"
}, xe = {
  key: 1,
  class: "v3iv-status-slot"
}, ke = { class: "v3iv-slot-footer" }, Me = ["alt", "referrer-policy"];
function ze(e, t, o, n, i, r) {
  const s = ce("lazy-load");
  return m(), v("div", {
    style: P(r.imgRatioWrapStyle),
    onClick: t[3] || (t[3] = (...a) => r.handleImageClick && r.handleImageClick(...a))
  }, [
    f("div", {
      class: B(["v3iv-img-wrap", {
        "v3iv-fix-ratio": o.aspectRatio,
        "v3iv-loading": i.loading,
        "v3iv-failure": i.failure
      }])
    }, [
      i.failure ? (m(), v("div", _e, [
        x(e.$slots, "error", {}, void 0, !0)
      ])) : L("", !0),
      i.loading ? (m(), v("div", xe, [
        x(e.$slots, "loading", {}, void 0, !0)
      ])) : L("", !0),
      f("div", ke, [
        x(e.$slots, "footer", {}, void 0, !0)
      ]),
      N((m(), v("img", {
        class: B(["v3iv-image", {
          "object-fit-style": !!o.fit
        }]),
        style: P({ objectFit: o.fit }),
        alt: o.alt,
        "referrer-policy": o.referrerPolicy,
        onLoad: t[0] || (t[0] = (...a) => r.onLoaded && r.onLoaded(...a)),
        onError: t[1] || (t[1] = (...a) => r.onError && r.onError(...a)),
        "on:startLoad": t[2] || (t[2] = (...a) => r.onStartLoad && r.onStartLoad(...a)),
        key: o.src
      }, null, 46, Me)), [
        [s, {
          src: o.src,
          active: o.lazy
        }]
      ])
    ], 2)
  ], 4);
}
const Se = /* @__PURE__ */ C(be, [["render", ze], ["__scopeId", "data-v-111e47d2"]]);
const Ie = {
  inject: ["jointUrl", "closePreview"],
  props: {
    preload: {
      type: Array || Boolean,
      default() {
        return [0, 2];
      }
    },
    images: {
      type: Array,
      default() {
        return [];
      }
    },
    curIndex: {
      type: Number,
      default: 0
    },
    loop: { type: Boolean, default: !1 }
  },
  data() {
    return {
      loading: !1,
      failure: !1,
      success: !1
    };
  },
  watch: {
    src: {
      handler(e) {
        this.loading = !0, this.failure = !1, this.success = !1;
      },
      immediate: !0
    }
  },
  computed: {
    src() {
      return this.currentItem.url || "";
    },
    currentItem() {
      const { images: e, curIndex: t } = this;
      return e[t] || {};
    },
    preloadList() {
      const { images: e, preload: t, curIndex: o } = this;
      if (!t)
        return [];
      const n = e.length, i = o, r = t[0], s = t[1], a = Math.max(i - r, 0), l = Math.min(i + s, n - 1);
      return e.slice(a, l + 1).map((u) => u.url);
    }
  },
  methods: {
    onPreviewKeydown(e) {
      e.code === "Escape" && this.closePreview(!0), (e.code === "ArrowLeft" || e.code === "KeyA") && this.handleSwitch(-1), (e.code === "ArrowRight" || e.code === "KeyD") && this.handleSwitch(1);
    },
    handleSwitch(e) {
      if (!this.switchClickable(e))
        return;
      const { loop: t, curIndex: o, images: n } = this;
      let i = o + e;
      const r = n.length - 1;
      t ? (i < 0 && (i = r), i > r && (i = 0)) : (i = Math.max(0, i), i = Math.min(r, i)), this.$emit("switch", i);
    },
    switchClickable(e) {
      const { loop: t, curIndex: o, images: n } = this;
      if (t)
        return !0;
      if (e == -1 && !o)
        return !1;
      const i = n.length - 1;
      return !(e == 1 && o == i);
    },
    getPreloadKey(e, t) {
      return `${e}-${t}`;
    },
    onPreviewLoad() {
      this.loading = !1, this.failure = !1, this.success = !0;
    },
    onPreviewError() {
      this.loading = !1, this.failure = !0, this.success = !1;
    }
  }
}, te = (e) => (Q("data-v-c45b7d24"), e = e(), ee(), e), Le = { class: "v3iv-image-preview" }, Ee = {
  key: 0,
  class: "v3iv-preview-error"
}, Ce = {
  key: 1,
  class: "v3iv-preview-loading"
}, Re = ["src"], Be = ["src"], He = { class: "v3iv-img-append" }, De = { class: "v3iv-title" }, We = { class: "v3iv-desc" }, Pe = /* @__PURE__ */ te(() => /* @__PURE__ */ f("i", { class: "zlhiconfont v3iv-icon icon-v3iv-guanbi" }, null, -1)), Xe = [
  Pe
], Ye = /* @__PURE__ */ te(() => /* @__PURE__ */ f("i", { class: "zlhiconfont v3iv-icon icon-v3iv-left-arrow" }, null, -1)), Te = [
  Ye
], Ae = /* @__PURE__ */ te(() => /* @__PURE__ */ f("i", { class: "zlhiconfont v3iv-icon icon-v3iv-right-arrow" }, null, -1)), Ne = [
  Ae
];
function Oe(e, t, o, n, i, r) {
  return m(), v("div", Le, [
    f("div", {
      class: B(["v3iv-preview-center", {
        "v3iv-loading": i.loading,
        "v3iv-failure": i.failure
      }])
    }, [
      i.failure ? (m(), v("div", Ee, [
        x(e.$slots, "error", {}, void 0, !0)
      ])) : L("", !0),
      i.loading ? (m(), v("div", Ce, [
        x(e.$slots, "loading", {}, void 0, !0)
      ])) : L("", !0),
      N(f("img", {
        class: "v3iv-preview-img",
        onLoad: t[0] || (t[0] = (...s) => r.onPreviewLoad && r.onPreviewLoad(...s)),
        onError: t[1] || (t[1] = (...s) => r.onPreviewError && r.onPreviewError(...s)),
        src: r.src
      }, null, 40, Re), [
        [U, !i.loading && !i.failure]
      ]),
      (m(!0), v(Z, null, K(r.preloadList, (s, a) => N((m(), v("div", {
        key: r.getPreloadKey(s, a)
      }, [
        f("img", {
          src: r.jointUrl(s)
        }, null, 8, Be)
      ])), [
        [U, !1]
      ])), 128)),
      f("div", He, [
        f("div", De, se(r.currentItem.title), 1),
        f("div", We, se(r.currentItem.desc), 1)
      ])
    ], 2),
    f("div", {
      class: "v3iv-preview-close",
      onClick: t[2] || (t[2] = E((s) => r.closePreview(!0), ["stop"]))
    }, Xe),
    f("div", {
      class: "v3iv-preview-sl",
      onClick: t[3] || (t[3] = E((s) => r.handleSwitch(-1), ["stop"]))
    }, Te),
    f("div", {
      class: "v3iv-preview-sr",
      onClick: t[4] || (t[4] = E((s) => r.handleSwitch(1), ["stop"]))
    }, Ne)
  ]);
}
const Fe = /* @__PURE__ */ C(Ie, [["render", Oe], ["__scopeId", "data-v-c45b7d24"]]);
const je = {
  emits: ["switch", "close", "load", "error"],
  provide() {
    return {
      jointUrl: this.jointUrl,
      closePreview: this.closePreview
    };
  },
  components: {
    Image: Se,
    Preview: Fe
  },
  props: {
    base: { type: String, default: "" },
    src: { type: String, default: "" },
    token: { type: String, default: "" },
    width: { type: String, default: "" },
    height: { type: String, default: "" },
    fit: { type: String, default: "cover" },
    aspectRatio: { type: Number },
    lazy: { type: Boolean },
    bgColor: { type: String },
    alt: { type: String },
    referrerPolicy: { type: String },
    hideOnClickModal: { type: Boolean, default: !1 },
    images: {
      type: Array,
      default() {
        return [];
      }
    },
    loop: { type: Boolean, default: !1 },
    preload: {
      type: Array || Boolean,
      default() {
        return [0, 2];
      }
    },
    initialIndex: { type: Number, default: 0 },
    preview: { type: Boolean, default: !1 }
  },
  data() {
    return {
      previewVisible: !1,
      previewIndex: this.initialIndex
    };
  },
  computed: {
    wrapStyle() {
      const { width: e, height: t } = this, o = {};
      return e && (o.width = e), t && (o.height = t), o;
    },
    _src() {
      const { src: e } = this;
      return this.jointUrl(e);
    }
  },
  methods: {
    handleSwitch(e) {
      this.previewIndex = e, this.$emit("switch", e);
    },
    closePreview(e) {
      e && (this.$emit("close"), this.previewVisible = !1);
    },
    onLoaded(e) {
      this.$emit("load", e);
    },
    onError(e) {
      this.$emit("error", e);
    },
    handleImageClick() {
      !this.preview || (this.previewVisible = !0, this.previewIndex = this.initialIndex);
    },
    jointUrl(e) {
      if (!e)
        return "";
      const { base: t, token: o } = this, n = o ? `?token=${o}` : "";
      return e.startsWith("data:") || e.startsWith("http:") || e.startsWith("https:") || e.startsWith("blob:") ? `${e}${n}` : `${t}${e}${n}`;
    }
  }
};
function Ve(e, t, o, n, i, r) {
  const s = S("Image"), a = S("Preview");
  return m(), v("div", {
    style: P(r.wrapStyle),
    class: B(["v3iv-image-wrap", {
      "v3iv-preview-active": i.previewVisible
    }])
  }, [
    Y(s, {
      src: r._src,
      aspectRatio: o.aspectRatio,
      fit: o.fit,
      lazy: o.lazy,
      bgColor: o.bgColor,
      alt: o.alt,
      referrerPolicy: o.referrerPolicy,
      onClick: r.handleImageClick,
      onLoad: r.onLoaded,
      onError: r.onError,
      style: { "{\r\n        cursor": `preview ? 'pointer' : 'default',\r
      }` },
      class: B({ "v3iv-clickable": o.preview })
    }, {
      loading: I(() => [
        x(e.$slots, "loading", {}, void 0, !0)
      ]),
      error: I(() => [
        x(e.$slots, "error", {}, void 0, !0)
      ]),
      footer: I(() => [
        x(e.$slots, "footer", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["src", "aspectRatio", "fit", "lazy", "bgColor", "alt", "referrerPolicy", "onClick", "onLoad", "onError", "class"]),
    i.previewVisible ? (m(), j(a, {
      key: 0,
      class: B({ "v3iv-clickable": o.hideOnClickModal }),
      onClick: t[0] || (t[0] = (l) => r.closePreview(o.hideOnClickModal)),
      preload: o.preload,
      images: o.images,
      curIndex: i.previewIndex,
      loop: o.loop,
      onSwitch: r.handleSwitch
    }, {
      loading: I(() => [
        x(e.$slots, "loading", {}, void 0, !0)
      ]),
      error: I(() => [
        x(e.$slots, "error", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["class", "preload", "images", "curIndex", "loop", "onSwitch"])) : L("", !0)
  ], 6);
}
const oe = /* @__PURE__ */ C(je, [["render", Ve], ["__scopeId", "data-v-5031655d"]]);
const $e = {
  inject: ["getMarkStyle"],
  props: {
    drawable: { type: Boolean, default: !1 },
    drawMark: { type: Object, default: () => ({}) }
  },
  computed: {
    drawStyle() {
      const { drawable: e, drawMark: t } = this;
      return !e || !t.active ? {
        display: "none"
      } : this.getMarkStyle(t, "lightpink");
    }
  }
};
function Ze(e, t, o, n, i, r) {
  return m(), v("div", {
    class: "v3iv-draw-mark",
    style: P(r.drawStyle)
  }, null, 4);
}
const Ke = /* @__PURE__ */ C($e, [["render", Ze], ["__scopeId", "data-v-8723b5c7"]]), z = {
  minSize: -1 / 0,
  maxSize: 1 / 0,
  disabled: !1,
  enabled: !0
}, p = 2;
let V = [], G = !1, T = null;
class qe {
  constructor() {
  }
  init(t) {
    if (!t.initialized)
      return this.addAnchors(t);
  }
  addAnchors(t) {
    const n = Object.keys(re).map((i) => {
      const r = it(i);
      return r.key = i, r;
    });
    for (const i of n)
      ot(i), t.appendChild(i);
    return t.initialized = !0, n;
  }
}
const Ue = new qe();
let H = null, X = null;
const M = { startX: 0, startY: 0, target: null, started: !1 }, J = 5, W = "DeepPink", Ge = "icondrag1", A = 10, O = J / 2, re = {
  lt: {
    dirX: -1,
    dirY: -1,
    fixed: 1,
    style: {
      left: `-${p}px`,
      top: `-${p}px`,
      cursor: "se-resize",
      zIndex: 50
    }
  },
  mt: {
    dirX: 0,
    dirY: -1,
    fixed: 1,
    style: {
      left: "50%",
      transform: `translateX(-${O}px)`,
      top: `-${p}px`,
      cursor: "s-resize",
      zIndex: 50
    }
  },
  rt: {
    dirX: 1,
    dirY: -1,
    fixed: 1,
    style: {
      right: `-${p}px`,
      top: `-${p}px`,
      cursor: "sw-resize",
      zIndex: 50
    }
  },
  lm: {
    dirX: -1,
    dirY: 0,
    fixed: 1,
    style: {
      left: `-${p}px`,
      top: "50%",
      transform: `translateY(-${O}px)`,
      cursor: "e-resize",
      zIndex: 50
    }
  },
  rm: {
    dirX: 1,
    dirY: 0,
    fixed: 1,
    style: {
      right: `-${p}px`,
      top: "50%",
      transform: `translateY(-${O}px)`,
      cursor: "w-resize",
      zIndex: 50
    }
  },
  lb: {
    dirX: -1,
    dirY: 1,
    fixed: 1,
    style: {
      left: `-${p}px`,
      bottom: `-${p}px`,
      cursor: "ne-resize",
      zIndex: 50
    }
  },
  mb: {
    dirX: 0,
    dirY: 1,
    fixed: 1,
    style: {
      left: "50%",
      transform: `translateX(-${O}px)`,
      bottom: `-${p}px`,
      cursor: "n-resize",
      zIndex: 50
    }
  },
  rb: {
    dirX: 1,
    dirY: 1,
    fixed: 1,
    style: {
      right: `-${p}px`,
      bottom: `-${p}px`,
      cursor: "nw-resize",
      zIndex: 50
    }
  },
  mm: {
    dirX: -1,
    dirY: -1,
    fixed: 0,
    style: {
      left: "50%",
      top: "50%",
      transform: `translate(-${A / 2}px,-${A / 2}px)`,
      cursor: "move",
      zIndex: 50,
      backgroundColor: W,
      borderRadius: "1px"
    }
  }
}, Je = [
  {
    height: "100%",
    width: `${p}px`,
    left: `-${p}px`,
    top: 0,
    bottom: 0
  },
  {
    height: "100%",
    width: `${p}px`,
    right: `-${p}px`,
    top: 0,
    bottom: 0
  },
  {
    width: "100%",
    height: `${p}px`,
    left: 0,
    top: `-${p}px`,
    right: 0
  },
  {
    width: "100%",
    height: `${p}px`,
    left: 0,
    bottom: `-${p}px`,
    right: 0
  }
], F = "gray";
function Qe(e) {
  const t = e.querySelectorAll(".v3iv-drag-border");
  for (const n of t)
    e.initialized = !1, fe(n), e.removeChild(n);
  const o = e.querySelectorAll(".v3iv-drag-anchor");
  for (const n of o)
    he(n), e.removeChild(n);
}
function q() {
  if ($(), !!V.length) {
    if (G) {
      G = !1;
      return;
    }
    V = V.filter((e) => {
      ue(e);
      const t = e.querySelectorAll(".v3iv-drag-anchor");
      for (const n of t)
        he(n), e.removeChild(n);
      const o = e.querySelector(".v3iv-mark-delete");
      return o && (o.style.display = "block"), !1;
    });
  }
}
function ue(e) {
  const t = [];
  for (const o of Je) {
    const { width: n, height: i, left: r, right: s, top: a, bottom: l } = o, c = document.createElement("DIV");
    c.style.width = n, c.style.height = i, c.style.opacity = 0.5, c.style.position = "absolute", c.style.cursor = "move", c.style.userSelect = "none", c.style.touchAction = "none", c.style.pointerEvents = "auto", c.classList.add("v3iv-drag-border"), r !== void 0 && (c.style.left = r), s !== void 0 && (c.style.right = s), a !== void 0 && (c.style.top = a), l !== void 0 && (c.style.bottom = l), t.push(c);
  }
  for (const o of t)
    rt(o), e.appendChild(o);
}
function et() {
  !H || (H.addEventListener("mousewheel", k), H.addEventListener("click", k), document.addEventListener("mousemove", ge, { passive: !1 }), document.addEventListener("mouseup", pe));
}
function tt() {
  !H || (H.removeEventListener("mousewheel", k), H.removeEventListener("click", k), document.removeEventListener("mousemove", ge), document.removeEventListener("mouseup", pe));
}
function ot(e) {
  e.addEventListener("mousewheel", k), e.addEventListener("mousedown", k), e.addEventListener("mousedown", ve);
}
function he(e) {
  e.removeEventListener("mousewheel", k), e.removeEventListener("mousedown", k), e.removeEventListener("mousedown", ve);
}
function rt(e) {
  e.addEventListener("click", me), e.addEventListener("mousewheel", k), e.addEventListener("mousedown", k);
}
function fe(e) {
  e.removeEventListener("click", me), e.removeEventListener("mousewheel", k), e.removeEventListener("mousedown", k);
}
function me(e) {
  e.stopPropagation(), e.preventDefault();
  const t = e.target.parentNode;
  Ue.init(t);
  const o = t.querySelectorAll(".v3iv-drag-border");
  for (const i of o)
    t.initialized = !1, fe(i), t.removeChild(i);
  const n = t.querySelector(".v3iv-mark-delete");
  n && (n.style.display = "none"), V.push(t);
}
function k(e) {
  e.stopPropagation(), e.preventDefault();
}
function ve(e) {
  const { which: t } = e;
  if (t != 1)
    return;
  e.stopPropagation(), e.preventDefault();
  const o = e.target, n = o.parentNode, i = new CustomEvent("resize-start");
  n.dispatchEvent(i), H = n.parentNode, et(), e.preventDefault(), e.stopPropagation(), X && (X.style.zIndex = 30), X = n, X.style.zIndex = 40, M.started = !0, M.target = o, M.startX = e.pageX, M.startY = e.pageY;
}
function ge(e) {
  T || (T = setTimeout(() => {
    if (!M.started) {
      $();
      return;
    }
    e.preventDefault(), e.stopPropagation();
    const { key: t } = M.target, { dirX: o, dirY: n } = re[t], i = o * (e.pageX - M.startX), r = n * (e.pageY - M.startY), s = ["lt", "lm", "lb"], a = ["lt", "mt", "rt"], l = ["rt", "rm", "rb"], c = ["lb", "mb", "rb"];
    let u = 0, h = 0, d = 0, g = 0;
    s.includes(t) && (u = -i), a.includes(t) && (h = -r), l.includes(t) && (d = i), c.includes(t) && (g = r), t === "mm" && (u = -i, d = -i, h = -r, g = -r);
    const _ = new CustomEvent("resize-move", {
      detail: {
        left: u,
        top: h,
        right: d,
        bottom: g,
        key: t
      }
    });
    X.dispatchEvent(_), $();
  }, 20));
}
function $() {
  T && (clearTimeout(T), T = null);
}
function pe(e) {
  if (e.preventDefault(), e.stopPropagation(), !M.started)
    return;
  $(), M.started = !1, M.target = null, G = !0;
  const t = new CustomEvent("resize-end");
  X.dispatchEvent(t), tt(), H = null;
}
function it(e) {
  const { style: t, fixed: o } = re[e], n = document.createElement("DIV");
  n.style.height = `${J}px`, n.style.width = `${J}px`, n.style.backgroundColor = W, n.style.position = "absolute", n.style.userSelect = "none", n.style.touchAction = "none", n.style.pointerEvents = "auto", n.classList.add("v3iv-drag-anchor"), o || (n.classList.add("zlhiconfont", Ge), n.style.height = `${A}px`, n.style.width = `${A}px`, n.style.fontSize = `${A}px`, n.style.color = W, n.style.backgroundColor = "transparent");
  for (const i of Object.keys(t)) {
    const r = t[i];
    n.style[i] = r;
  }
  return n;
}
function ae(e, t) {
  t ? (e.style.pointerEvents = "none", e.style.backgroundColor = e.style.backgroundColor == W && F, e.style.color = e.style.color == W && F, e.style.display = "none") : (e.style.pointerEvents = "auto", e.style.backgroundColor = e.style.backgroundColor == F && W, e.style.color = e.style.color == F && W, e.style.display = "block");
}
function le(e) {
  const t = e.value || {}, {
    maxSize: o = z.maxSize,
    minSize: n = z.minSize,
    disabled: i = z.disabled,
    enabled: r = z.enabled
  } = t;
  z.maxSize = o, z.minSize = n, z.disabled = i, z.enabled = r;
}
const nt = {
  mounted(e, t) {
    if (e) {
      le(t);
      const { enabled: o } = z;
      if (!o)
        return;
      ue(e), document.addEventListener("click", q);
    }
  },
  unmounted(e, t) {
    q(), Qe(e), document.removeEventListener("click", q);
  },
  updated(e, t) {
    le(t);
    const { disabled: o, enabled: n } = z;
    if (!n)
      return;
    const i = e.querySelectorAll(".v3iv-drag-anchor"), r = e.querySelectorAll(".v3iv-drag-border");
    for (const s of i)
      ae(s, o);
    for (const s of r)
      ae(s, o);
  }
};
const st = {
  inject: ["getMarkStyle", "getMarkLRTBWH"],
  emits: ["resize", "delete"],
  directives: {
    dragResize: nt
  },
  props: {
    marks: { type: Array, default: () => [] },
    drawing: { type: Boolean, default: !1 },
    focus: { type: Boolean, default: !1 },
    deleteable: { type: Boolean, default: !1 },
    location: { type: Object, default: () => ({}) },
    renderRecord: { type: Object, default: () => ({}) }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    getMarkKey(e, t) {
      return `${e.id}-${t}`;
    },
    resizeStart(e) {
    },
    resizeMove(e, t) {
      let {
        left: o,
        top: n,
        right: i,
        bottom: r,
        key: s
      } = t.detail;
      const { curScale: a } = this.location, { scale: l } = this.renderRecord;
      o = o / a / l, n = n / a / l, i = i / a / l, r = r / a / l;
      const [c, u, h, d] = e.storage, { trueImgW: g, trueImgH: _ } = this.renderRecord;
      let y = c + o, w = u + n, b = h + i, R = d + r;
      if (s === "mm") {
        const ie = e.right - e.left, ne = e.bottom - e.top;
        y > 0 && b < g ? (e.left = y, e.right = b) : y < 0 ? (e.left = 0, e.right = ie) : b > g && (e.left = g - ie, e.right = g), w > 0 && R < _ ? (e.top = w, e.bottom = R) : w < 0 ? (e.top = 0, e.bottom = ne) : R > _ && (e.top = _ - ne, e.bottom = _);
        return;
      }
      y = Math.max(0, y), w = Math.max(0, w), b = Math.max(0, b), R = Math.max(0, R), y = Math.min(g, y), w = Math.min(_, w), b = Math.min(g, b), R = Math.min(_, R), e.left = y, e.top = w, e.right = b, e.bottom = R;
    },
    resizeEnd(e) {
      const t = this.getMarkLRTBWH(e), { left: o, top: n, right: i, bottom: r } = t, { target: s } = e;
      e.left = o, e.top = n, e.right = i, e.bottom = r, e.storage = [o, n, i, r], this.$emit("resize", {
        target: s,
        detail: t
      });
    },
    deleteMark(e) {
      this.$emit("delete", e);
    }
  }
}, at = (e) => (Q("data-v-e199aa50"), e = e(), ee(), e), lt = ["onResizeStart", "onResizeMove", "onResizeEnd"], ct = ["onClick"], dt = /* @__PURE__ */ at(() => /* @__PURE__ */ f("svg", {
  t: "1655567649321",
  class: "icon",
  viewBox: "0 0 1024 1024",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  "p-id": "17221",
  width: "16",
  height: "16"
}, [
  /* @__PURE__ */ f("path", {
    d: "M512 1255.489906",
    "p-id": "17222",
    fill: "#ffffff"
  }),
  /* @__PURE__ */ f("path", {
    d: "M718.519288 688.227064 543.827304 513.637418l174.180292-174.180292c8.801119-8.801119 8.801119-23.128523 0-31.827304-8.801119-8.801119-23.128523-8.801119-31.827304 0L512 481.810114 337.819708 307.629822c-8.801119-8.801119-23.230861-8.596442-31.929642 0.102339l0.102339-0.102339c-8.801119 8.801119-8.698781 23.026184 0.102339 31.827304l174.180292 174.180292L305.58305 688.227064c-8.801119 8.801119-8.801119 23.128523 0 31.827304 8.801119 8.801119 23.128523 8.801119 31.827304 0L512 545.464721 686.691985 720.054367c8.801119 8.801119 22.923846 8.903458 31.724965 0.102339l0.102339-0.102339C727.218069 711.355587 727.218069 697.028183 718.519288 688.227064z",
    "p-id": "17223",
    fill: "#ffffff"
  })
], -1)), ut = [
  dt
];
function ht(e, t, o, n, i, r) {
  const s = ce("drag-resize");
  return m(!0), v(Z, null, K(o.marks, (a, l) => N((m(), v("div", {
    class: "v3iv-mark-item",
    key: r.getMarkKey(a, l),
    style: P(r.getMarkStyle(a)),
    onResizeStart: (c) => r.resizeStart(a),
    onResizeMove: (c) => {
      r.resizeMove(a, c);
    },
    onResizeEnd: (c) => r.resizeEnd(a)
  }, [
    o.deleteable && !o.focus ? (m(), v("div", {
      key: 0,
      class: "v3iv-mark-delete",
      onMousewheel: t[0] || (t[0] = E(() => {
      }, ["stop"])),
      onMousedown: t[1] || (t[1] = E(() => {
      }, ["stop"])),
      onClick: (c) => r.deleteMark(a)
    }, ut, 40, ct)) : L("", !0)
  ], 44, lt)), [
    [s, {
      disabled: o.drawing || o.focus
    }]
  ])), 128);
}
const ft = /* @__PURE__ */ C(st, [["render", ht], ["__scopeId", "data-v-e199aa50"]]);
const mt = {
  components: {
    Image: oe
  },
  props: {
    currentIndex: {
      type: Number,
      default: 0
    },
    images: {
      type: Array,
      default: () => []
    },
    base: {
      type: String,
      default: ""
    },
    token: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {
    drawerStyle() {
      return {
        "margin-left": `-${this.currentIndex * 30 + 15}px`
      };
    }
  },
  methods: {
    switchIndex(e) {
      this.$emit("switch", e);
    },
    getKey(e, t) {
      return `${e.thumbnail}-v3iv-thumbnail-${t}`;
    }
  }
}, vt = (e) => (Q("data-v-5a273606"), e = e(), ee(), e), gt = { class: "v3iv-navigation-bar" }, pt = ["onClick"], yt = /* @__PURE__ */ vt(() => /* @__PURE__ */ f("i", { class: "zlhiconfont icon-v3iv-error" }, null, -1));
function wt(e, t, o, n, i, r) {
  const s = S("Image");
  return m(), v("div", gt, [
    f("div", {
      class: "v3iv-navigation-drawer",
      style: P(r.drawerStyle)
    }, [
      (m(!0), v(Z, null, K(o.images, (a, l) => (m(), v("div", {
        class: B(["v3iv-navigation-item", { "v3iv-active": l == o.currentIndex }]),
        key: r.getKey(a, l),
        onClick: (c) => r.switchIndex(l),
        onMousedown: t[0] || (t[0] = E(() => {
        }, ["stop"])),
        onMousewheel: t[1] || (t[1] = E(() => {
        }, ["stop"]))
      }, [
        Y(s, {
          height: "100%",
          width: "100%",
          base: o.base,
          src: a.thumbnail,
          token: o.token,
          fit: "cover",
          lazy: ""
        }, {
          loading: I(() => [
            ye(" ... ")
          ]),
          error: I(() => [
            yt
          ]),
          _: 2
        }, 1032, ["base", "src", "token"])
      ], 42, pt))), 128))
    ], 4)
  ]);
}
const bt = /* @__PURE__ */ C(mt, [["render", wt], ["__scopeId", "data-v-5a273606"]]);
const _t = {
  emits: ["switchMode", "prev", "zoomOut", "zoomIn", "next", "reset"],
  props: {
    fitMode: {
      type: Object,
      default: () => ({})
    },
    scaleFit: {
      type: Number,
      default: 1
    },
    imgRecord: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    containOrCover() {
      this.$emit("switchMode");
    },
    prev() {
      this.$emit("prev");
    },
    zoomOut() {
      this.$emit("zoomOut");
    },
    zoomIn() {
      this.$emit("zoomIn");
    },
    next() {
      this.$emit("next");
    },
    reset() {
      this.$emit("reset");
    },
    download() {
      const { trueSrc: e } = this.imgRecord, t = document.createElement("a");
      t.href = e, name || (name = e.split("/").pop() || "download"), t.setAttribute("target", "_blank"), t.setAttribute("download", name), document.body.appendChild(t), t.click(), document.body.removeChild(t);
    }
  }
}, xt = { class: "v3iv-toolbar" }, kt = {
  key: 0,
  class: "icon-v3iv-quanping"
}, Mt = {
  key: 1,
  class: "icon-v3iv-fullfill"
};
function zt(e, t, o, n, i, r) {
  return m(), v("div", xt, [
    x(e.$slots, "toolbar", {}, () => [
      f("div", {
        onClick: t[0] || (t[0] = (...s) => r.containOrCover && r.containOrCover(...s)),
        class: "zlhiconfont"
      }, [
        o.scaleFit == o.fitMode.contain ? (m(), v("span", kt)) : (m(), v("span", Mt))
      ]),
      f("div", {
        onClick: t[1] || (t[1] = (...s) => r.prev && r.prev(...s)),
        class: "zlhiconfont icon-v3iv-zhixiang-zuo"
      }),
      f("div", {
        onClick: t[2] || (t[2] = (...s) => r.zoomOut && r.zoomOut(...s)),
        class: "zlhiconfont icon-v3iv-jian"
      }),
      f("div", {
        onClick: t[3] || (t[3] = (...s) => r.zoomIn && r.zoomIn(...s)),
        class: "zlhiconfont icon-v3iv-jia"
      }),
      f("div", {
        onClick: t[4] || (t[4] = (...s) => r.next && r.next(...s)),
        class: "zlhiconfont icon-v3iv-zhixiang-you"
      }),
      f("div", {
        onClick: t[5] || (t[5] = (...s) => r.reset && r.reset(...s)),
        class: "zlhiconfont icon-v3iv-zhongzhi-circle"
      }),
      f("div", {
        onClick: t[6] || (t[6] = (s) => r.download()),
        class: "zlhiconfont icon-v3iv-xiazai"
      })
    ], !0)
  ]);
}
const St = /* @__PURE__ */ C(_t, [["render", zt], ["__scopeId", "data-v-649125f0"]]), It = {
  components: {
    Image: oe
  },
  props: {
    base: {
      type: String,
      default: ""
    },
    token: {
      type: String,
      default: ""
    },
    preload: {
      type: Array,
      default: () => [0, 2]
    },
    images: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    preloadList() {
      const { preload: e, images: t, currentIndex: o } = this;
      if (!e)
        return [];
      const n = t.length, i = e[0], r = e[1], s = Math.max(o - i, 0), a = Math.min(o + r, n - 1);
      return t.slice(s, a + 1).map((c) => c ? c.url : "");
    }
  },
  methods: {
    getKey(e, t) {
      return `${e}-v3iv-preload-${t}`;
    }
  }
};
function Lt(e, t, o, n, i, r) {
  const s = S("Image");
  return m(!0), v(Z, null, K(r.preloadList, (a, l) => N((m(), v("div", {
    key: r.getKey(a, l)
  }, [
    Y(s, {
      base: o.base,
      src: a,
      token: o.token
    }, null, 8, ["base", "src", "token"])
  ])), [
    [U, !1]
  ])), 128);
}
const Et = /* @__PURE__ */ C(It, [["render", Lt]]);
const D = {
  contain: 1,
  cover: 2
}, Ct = {
  emits: ["resize", "delete", "load", "drawEnd", "zoom", "error", "switch"],
  provide() {
    return {
      getMarkStyle: this.getMarkStyle,
      getMarkLRTBWH: this.getMarkLRTBWH
    };
  },
  components: {
    Image: oe,
    DrawRect: Ke,
    ImgMarks: ft,
    Navigation: bt,
    ToolBar: St,
    Preload: Et
  },
  props: {
    base: { type: String, default: "" },
    token: { type: String, default: "" },
    fit: { type: String, default: "contain" },
    loop: { type: Boolean, default: !1 },
    initialIndex: { type: Number, default: 0 },
    preload: { type: Array || Boolean, default: [0, 2] },
    scaleMax: { type: Number, default: 15 },
    scaleMin: { type: Number, default: 1 },
    scaleStep: { type: Number, default: 1.2 },
    initialScale: { type: Number, default: 1 },
    imageList: { type: Array, default: null },
    markList: { type: Array, default: null },
    navigation: { type: Boolean, default: !1 },
    toolbar: { type: Boolean, default: !1 },
    keyboard: {
      type: Array,
      default: ["A", "D", "Space", "Esc"]
    },
    fixed: { type: Boolean, default: !1 },
    focus: { type: Boolean, default: !1 },
    drawable: { type: Boolean, default: !1 },
    deleteable: { type: Boolean, default: !1 },
    image: { type: Object, default: null },
    mark: { type: Object, default: null }
  },
  data() {
    return {
      fitMode: D,
      loadStatus: {
        loading: !1,
        failure: !1,
        success: !1
      },
      currentIndex: this.initialIndex,
      focusIndex: 0,
      drawing: !1,
      drag: {
        dragPreX: 0,
        dragPreY: 0,
        active: !1
      },
      location: {
        translateX: 0,
        translateY: 0,
        curScale: this.initialScale
      },
      imgRecord: {
        wrapW: 0,
        wrapH: 0,
        imgSizeW: 0,
        imgSizeH: 0,
        trueSrc: ""
      },
      drawMark: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        active: !1
      },
      scaleFit: D.contain,
      resizeTimer: null,
      marksFormat: []
    };
  },
  computed: {
    URL() {
      const { current: e } = this;
      return e.url;
    },
    currentMarks() {
      const { current: e } = this;
      return e.marks || [];
    },
    images() {
      const { imageList: e, image: t } = this;
      return e || (t ? [t] : []);
    },
    marks() {
      const { markList: e, mark: t, currentMarks: o } = this;
      return e || (t ? [t] : o || []);
    },
    wrapStyle() {
      let { translateX: e, translateY: t, curScale: o } = this.location;
      return {
        transform: `translate(${e}px,${t}px) scale(${o})`
      };
    },
    mouseActive() {
      const { drawing: e } = this, { active: t } = this.drag;
      return e || t;
    },
    current() {
      const { images: e, currentIndex: t } = this;
      return e[t] || {};
    },
    renderRecord() {
      const { imgSizeW: e, imgSizeH: t, wrapW: o, wrapH: n } = this.imgRecord;
      if (!e || !t || !o || !n)
        return null;
      const { imgW: i, imgH: r } = this.current, s = i || e, a = r || t, l = {
        TDEdge: 0,
        LREdge: 0,
        imgW: 0,
        imgH: 0,
        scale: 0,
        containScale: 0,
        trueImgW: s,
        trueImgH: a
      }, c = a / s, u = n / o;
      return c > u ? (l.scale = this.toFixed(n / a, 5), l.imgH = n, l.imgW = Math.round(l.imgH / c), l.LREdge = (o - l.imgW) / 2, l.containScale = this.toFixed(o / (l.imgW - 1), 5)) : (l.scale = this.toFixed(o / s, 5), l.imgW = o, l.imgH = Math.round(l.imgW * c), l.TDEdge = (n - l.imgH) / 2, l.containScale = this.toFixed(n / (l.imgH - 1), 5)), l;
    }
  },
  watch: {
    marks: {
      handler(e) {
        this.marksFormat = e.map((t) => {
          const { left: o, top: n, width: i, height: r, id: s } = t, a = o, l = n, c = o + i, u = n + r;
          return {
            id: s,
            storage: [a, l, c, u],
            left: a,
            top: l,
            right: c,
            bottom: u,
            target: t
          };
        });
      },
      immediate: !0,
      deep: !0
    },
    URL: {
      handler() {
        this.loadStatus = {
          loading: !0,
          failure: !1,
          success: !1
        };
      },
      immediate: !0
    },
    drawable() {
      this.drawMark.active = !1, this.drawing = !1;
    },
    "location.curScale"(e) {
      e !== this.renderRecord.containScale && (this.scaleFit = D.contain);
    },
    currentIndex() {
      this.onReset();
    }
  },
  mounted() {
    window.addEventListener("keyup", this.handleKeyboard), window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("keyup", this.handleKeyboard), window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    zoomOut() {
      this.onZoomOut();
    },
    zoomIn() {
      this.onZoomIn();
    },
    onMarkDelete(e) {
      this.$emit("delete", e);
    },
    onMarkResize(e) {
      this.$emit("resize", e);
    },
    handleResize() {
      this.resizeTimer || (this.resizeTimer = setTimeout(() => {
        this.freshWrapWH(), this.resizeTimer = null;
      }, 100));
    },
    handleKeyboard(e) {
      const { code: t } = e, { keyboard: o } = this;
      switch (o.includes("Space") && t === "Space" && e.preventDefault(), o.includes("Esc") && t === "Escape" && e.preventDefault(), t) {
        case "Space":
          o.includes("Space") && this.focusMark();
          break;
        case "Escape":
          o.includes("Esc") && this.unFocusMark();
          break;
        case "KeyA":
          o.includes("A") && this.onPrev();
          break;
        case "KeyD":
          o.includes("D") && this.onNext();
          break;
      }
    },
    getMarkStyle(e, t = "lightblue") {
      this.focus && this.focusMark();
      const { width: o, height: n, left: i, top: r } = this.getRenderMark(e);
      let { translateX: s, translateY: a, curScale: l } = this.location;
      const { wrapW: c, wrapH: u } = this.imgRecord, h = c / 2, d = u / 2, g = h - l * h + l * i, _ = d - l * d + l * r;
      return {
        width: `${o * l}px`,
        height: `${n * l}px`,
        border: `2px solid ${t}`,
        left: `${g}px`,
        top: `${_}px`,
        transform: `translate(${s}px,${a}px)`
      };
    },
    getRenderMark(e) {
      let { left: t, top: o, width: n, height: i } = this.getMarkLRTBWH(e);
      const { scale: r, TDEdge: s, LREdge: a } = this.renderRecord || {};
      return n = n * r, i = i * r, t = t * r + a, o = o * r + s, { left: t, top: o, width: n, height: i };
    },
    toFixed(e, t) {
      const o = Math.pow(10, t);
      return Math.round(e * o) / o;
    },
    limitBoundary(e, t) {
      e = this.toFixed(e, 2);
      const { wrapW: o, wrapH: n } = this.imgRecord, { curScale: i } = this.location;
      let r = 0;
      return t === "horizontal" && (r = o * (i - 1) / 2), t === "vertical" && (r = n * (i - 1) / 2), r = Math.abs(r), e = Math.max(-r, e), e = Math.min(r, e), e;
    },
    getMarkLRTBWH(e) {
      const { left: t, right: o, top: n, bottom: i } = e, r = Math.floor(Math.min(t, o)), s = Math.floor(Math.min(n, i)), a = Math.floor(Math.max(t, o)), l = Math.floor(Math.max(n, i)), c = a - r, u = l - s;
      return { left: r, top: s, right: a, bottom: l, width: c, height: u };
    },
    unFocusMark() {
      this.onReset();
    },
    focusMark(e) {
      if (!this.loadStatus.success)
        return;
      e !== void 0 && (this.focusIndex = e);
      const t = this.marksFormat[this.focusIndex] || null;
      if (!t || !this.renderRecord)
        return;
      this.focusIndex >= this.marksFormat.length - 1 ? this.focusIndex = 0 : this.focusIndex++;
      const { width: o, height: n, left: i, top: r } = this.getRenderMark(t), { wrapW: s, wrapH: a } = this.imgRecord, { imgW: l, imgH: c, TDEdge: u, LREdge: h } = this.renderRecord, d = a / s;
      let g = i + o / 2, _ = r + n / 2, y = 0;
      if (n / o < d) {
        let w = i, b = r - (o * d - n) / 2;
        o * 1.1 < l ? (y = s / (o * 1.1), w = i - o * 0.05, b = r - d * o * 0.05) : y = s / o, w < h && (g = g - w + h), b < u && (_ = _ - b + u);
      } else {
        let w = i - (n / d - o) / 2, b = r;
        n * 1.1 < c ? (y = a / (n * 1.1), w = w - n * 0.05 / d, b = b - n * 0.05) : y = a / n, w < h && (g = g - w + h), b < u && (_ = _ - b + u);
      }
      y = Math.min(y, this.scaleMax), this.centerScale(g, _, y);
    },
    centerScale(e, t, o) {
      const { wrapW: n, wrapH: i } = this.imgRecord, r = n / 2, s = i / 2;
      let a = r - e, l = s - t;
      a = a * o, l = l * o, this.location.curScale = o, this.location.translateX = this.limitBoundary(a, "horizontal"), this.location.translateY = this.limitBoundary(l, "vertical");
    },
    onDrawStart(e) {
      e.preventDefault();
      const { drawable: t, focus: o } = this, { which: n } = e;
      if (n != 3 || !t || o)
        return;
      const { trueImgW: i, trueImgH: r } = this.renderRecord, { layerX: s, layerY: a } = e, { x: l, y: c } = this.convertCoords(s, a);
      l < 0 || l > i || c < 0 || c > r || (this.drawMark = {
        left: l,
        right: l,
        top: c,
        bottom: c,
        active: !0
      }, this.drawing = !0);
    },
    onDrawMove(e) {
      if (!this.drawing)
        return;
      const { trueImgW: t, trueImgH: o } = this.renderRecord, { layerX: n, layerY: i } = e, { x: r, y: s } = this.convertCoords(n, i);
      r < 0 || r > t || s < 0 || s > o || (this.drawMark.right = r, this.drawMark.bottom = s);
    },
    onDrawEnd(e) {
      if (e.preventDefault(), !this.drawing)
        return;
      this.drawing = !1;
      const t = this.getMarkLRTBWH(this.drawMark);
      this.$emit("drawEnd", t), this.clearDraw();
    },
    clearDraw() {
      this.drawMark.active = !1, this.drawing = !1;
    },
    convertCoords(e, t) {
      const { wrapW: o, wrapH: n } = this.imgRecord, { scale: i, TDEdge: r, LREdge: s } = this.renderRecord, { translateX: a, translateY: l, curScale: c } = this.location, u = o * (c - 1) / 2 - a + e - s * c, h = n * (c - 1) / 2 - l + t - r * c, d = u / c / i, g = h / c / i;
      return {
        x: d,
        y: g
      };
    },
    onMousedown(e) {
      if (e.preventDefault(), this.fixed || this.focus)
        return;
      const { which: t, layerX: o, layerY: n } = e;
      t == 1 && (this.drag.dragPreX = o, this.drag.dragPreY = n, this.drag.active = !0);
    },
    onMousemove(e) {
      const { active: t, dragPreX: o, dragPreY: n } = this.drag;
      if (!t)
        return;
      const { layerX: i, layerY: r } = e, { translateX: s, translateY: a } = this.location;
      let l = i - o, c = r - n;
      this.drag.dragPreX = i, this.drag.dragPreY = r, l = s + l, c = a + c, this.location.translateX = this.limitBoundary(l, "horizontal"), this.location.translateY = this.limitBoundary(c, "vertical");
    },
    onMouseup(e) {
      this.drag.active = !1;
    },
    onMouseleave(e) {
      this.drag.active = !1;
    },
    toggleFit() {
      this.onSwitchMode();
    },
    prev() {
      this.onPrev();
    },
    next() {
      this.onNext();
    },
    reset() {
      this.onReset();
    },
    download() {
      this.$refs.toolbar.download();
    },
    onSwitchMode() {
      this.location.translateX = 0, this.location.translateY = 0, this.scaleFit === D.contain ? (this.scaleFit = D.cover, this.renderRecord && (this.location.curScale = this.renderRecord.containScale)) : (this.location.curScale = this.initialScale, this.scaleFit = D.contain);
    },
    onPrev() {
      this.switchIndex(this.currentIndex - 1);
    },
    onNext() {
      this.switchIndex(this.currentIndex + 1);
    },
    onZoomIn() {
      const e = this.handleZoom(1), { wrapW: t, wrapH: o } = this.imgRecord;
      this.flollowTheMouse(t / 2, o / 2, e);
    },
    onZoomOut() {
      const e = this.handleZoom(-1), { wrapW: t, wrapH: o } = this.imgRecord;
      this.flollowTheMouse(t / 2, o / 2, e);
    },
    onReset() {
      this.location.translateX = 0, this.location.translateY = 0, this.location.curScale = this.initialScale, this.scaleFit = D.contain, this.focusIndex = 0, this.drawMark.active = !1;
    },
    switchIndex(e) {
      const { images: t } = this, o = t.length - 1;
      this.loop ? (e < 0 && (e = o), e > o && (e = 0)) : (e = Math.max(0, e), e = Math.min(o, e)), this.$emit("switch", e), this.currentIndex = e;
    },
    flollowTheMouse(e, t, o) {
      const { wrapW: n, wrapH: i } = this.imgRecord, { translateX: r, translateY: s, curScale: a } = this.location, l = n / 2 + r, c = i / 2 + s;
      let u = l - e, h = c - t;
      u = u / a, h = h / a, u = u * (o - a), h = h * (o - a), u = r + u, h = s + h, this.location.curScale = o, this.location.translateX = this.limitBoundary(u, "horizontal"), this.location.translateY = this.limitBoundary(h, "vertical");
    },
    handleZoom(e) {
      const { scaleMax: t, scaleMin: o, scaleStep: n } = this;
      let i = this.location.curScale;
      return e > 0 ? i = i * n : i = i / n, i = Math.min(i, t), i = Math.max(i, o), i = this.toFixed(i, 3), this.$emit("zoom", i), Number(i);
    },
    onWheel(e) {
      if (!this.loadStatus.success || this.fixed || this.focus)
        return;
      e.preventDefault(), e.stopPropagation();
      const { wheelDelta: t, layerX: o, layerY: n } = e;
      let i = this.location.curScale;
      t > 0 ? i = this.handleZoom(1) : i = this.handleZoom(-1), this.flollowTheMouse(o, n, i);
    },
    onLoad(e) {
      const { naturalWidth: t, naturalHeight: o, src: n } = e.target;
      this.loadStatus = {
        loading: !1,
        failure: !1,
        success: !0
      }, this.imgRecord.imgSizeW = t, this.imgRecord.imgSizeH = o, this.imgRecord.trueSrc = n, this.$nextTick(() => {
        this.freshWrapWH(), this.imageLoaded();
      }), this.$emit("load", e);
    },
    onError(e) {
      this.loadStatus = {
        loading: !1,
        failure: !0,
        success: !1
      }, this.$emit("error", e);
    },
    freshWrapWH() {
      const e = this.$refs.clipper;
      if (e) {
        const { clientWidth: t, clientHeight: o } = e;
        this.imgRecord.wrapW = t, this.imgRecord.wrapH = o;
      } else
        console.error("DOM not found");
    },
    imageLoaded() {
      this.focus && this.focusMark();
    }
  }
}, Rt = {
  class: "v3iv-viewer-clip",
  ref: "clipper"
};
function Bt(e, t, o, n, i, r) {
  const s = S("Image"), a = S("DrawRect"), l = S("ImgMarks"), c = S("Navigation"), u = S("ToolBar"), h = S("Preload");
  return m(), v("div", {
    class: B(["v3iv-viewer", { "v3iv-has-toolbar": o.toolbar, "v3iv-mousedown": r.mouseActive }]),
    onMousewheel: t[1] || (t[1] = (...d) => r.onWheel && r.onWheel(...d)),
    onMousedown: t[2] || (t[2] = (...d) => r.onMousedown && r.onMousedown(...d)),
    onMouseup: t[3] || (t[3] = (...d) => r.onMouseup && r.onMouseup(...d)),
    onMousemove: t[4] || (t[4] = (...d) => r.onMousemove && r.onMousemove(...d)),
    onMouseleave: t[5] || (t[5] = (...d) => r.onMouseleave && r.onMouseleave(...d)),
    onContextmenu: t[6] || (t[6] = E(() => {
    }, ["stop", "prevent"]))
  }, [
    f("div", Rt, [
      f("div", {
        class: "v3iv-viewer-img-wrap",
        style: P(r.wrapStyle)
      }, [
        Y(s, {
          height: "100%",
          width: "100%",
          base: o.base,
          src: r.URL,
          token: o.token,
          onMousedown: r.onDrawStart,
          onMouseup: r.onDrawEnd,
          onMousemove: r.onDrawMove,
          onMouseleave: r.onDrawEnd,
          onContextmenu: t[0] || (t[0] = E(() => {
          }, ["stop", "prevent"])),
          onLoad: r.onLoad,
          onError: r.onError,
          fit: o.fit
        }, {
          loading: I(() => [
            x(e.$slots, "loading", {}, void 0, !0)
          ]),
          error: I(() => [
            x(e.$slots, "error", {}, void 0, !0)
          ]),
          _: 3
        }, 8, ["base", "src", "token", "onMousedown", "onMouseup", "onMousemove", "onMouseleave", "onLoad", "onError", "fit"])
      ], 4),
      Y(a, {
        drawable: o.drawable,
        drawMark: i.drawMark
      }, null, 8, ["drawable", "drawMark"]),
      i.loadStatus.success ? (m(), j(l, {
        key: 0,
        marks: i.marksFormat,
        drawing: i.drawing,
        focus: o.focus,
        deleteable: o.deleteable,
        location: i.location,
        renderRecord: r.renderRecord,
        onResize: r.onMarkResize,
        onDelete: r.onMarkDelete
      }, null, 8, ["marks", "drawing", "focus", "deleteable", "location", "renderRecord", "onResize", "onDelete"])) : L("", !0),
      o.navigation ? (m(), j(c, {
        key: 1,
        currentIndex: i.currentIndex,
        images: r.images,
        base: o.base,
        token: o.token,
        onSwitch: r.switchIndex
      }, null, 8, ["currentIndex", "images", "base", "token", "onSwitch"])) : L("", !0)
    ], 512),
    o.toolbar ? (m(), j(u, {
      key: 0,
      fitMode: i.fitMode,
      scaleFit: i.scaleFit,
      imgRecord: i.imgRecord,
      onSwitchMode: r.onSwitchMode,
      onPrev: r.onPrev,
      onNext: r.onNext,
      onZoomOut: r.onZoomOut,
      onZoomIn: r.onZoomIn,
      onReset: r.onReset,
      ref: "toolbar"
    }, null, 8, ["fitMode", "scaleFit", "imgRecord", "onSwitchMode", "onPrev", "onNext", "onZoomOut", "onZoomIn", "onReset"])) : L("", !0),
    Y(h, {
      base: o.base,
      token: o.token,
      preload: o.preload,
      images: r.images,
      currentIndex: i.currentIndex
    }, null, 8, ["base", "token", "preload", "images", "currentIndex"])
  ], 34);
}
const Dt = /* @__PURE__ */ C(Ct, [["render", Bt], ["__scopeId", "data-v-bcd88bb2"]]);
window._iconfont_svg_string_3113478 = '<svg><symbol id="icon-v3iv-yidong" viewBox="0 0 1024 1024"><path d="M893.76 523.26a29.582 29.582 0 0 0 0-22.56c-1.5-3.63-3.67-6.9-6.4-9.62l-88.6-88.6c-11.54-11.54-30.23-11.54-41.77 0-11.54 11.54-11.54 30.23 0 41.77l38.2 38.2H541.54V228.8l38.2 38.2c5.77 5.77 13.33 8.65 20.89 8.65s15.12-2.88 20.89-8.65c11.54-11.54 11.54-30.23 0-41.77l-88.6-88.6c-2.73-2.74-6-4.9-9.62-6.4a29.562 29.562 0 0 0-22.57 0c-3.63 1.5-6.89 3.67-9.62 6.4l-88.6 88.6c-11.54 11.54-11.54 30.23 0 41.77 11.54 11.54 30.23 11.54 41.77 0l38.2-38.2v253.64H228.82l38.2-38.2c11.54-11.54 11.54-30.23 0-41.77s-30.23-11.54-41.77 0l-88.6 88.6c-2.73 2.73-4.9 6-6.4 9.62a29.516 29.516 0 0 0 0 22.57c1.5 3.62 3.66 6.89 6.4 9.62l88.6 88.6c5.77 5.77 13.33 8.65 20.89 8.65 7.56 0 15.12-2.88 20.89-8.65 11.54-11.54 11.54-30.23 0-41.77l-38.2-38.2h253.64v253.64l-38.2-38.2c-11.54-11.54-30.23-11.54-41.77 0-11.54 11.54-11.54 30.23 0 41.77l88.6 88.6c2.73 2.74 6 4.9 9.62 6.4 3.61 1.49 7.44 2.28 11.29 2.28s7.68-0.78 11.29-2.28c3.63-1.5 6.89-3.67 9.62-6.4l88.6-88.6c11.54-11.54 11.54-30.23 0-41.77-11.54-11.54-30.23-11.54-41.77 0l-38.2 38.2V541.52h253.64l-38.2 38.2c-11.54 11.54-11.54 30.23 0 41.77 5.77 5.77 13.33 8.65 20.89 8.65s15.12-2.88 20.89-8.65l88.6-88.6c2.73-2.73 4.89-6 6.39-9.63z"  ></path></symbol><symbol id="icon-v3iv-chongzhi" viewBox="0 0 1024 1024"><path d="M567.342545 101.888c-67.537455 0-134.516364 16.802909-193.768727 48.546909a34.955636 34.955636 0 0 0 33.047273 61.579636 341.178182 341.178182 0 0 1 160.768-40.261818c187.624727 0 340.293818 152.622545 340.293818 340.293818s-152.622545 340.293818-340.293818 340.293819c-163.095273 0-299.613091-115.386182-332.567273-268.706909l46.545455 46.545454a34.816 34.816 0 0 0 49.338182 0 34.909091 34.909091 0 0 0 0-49.384727l-112.314182-112.314182a35.979636 35.979636 0 0 0-49.384728 0L56.785455 580.747636a34.909091 34.909091 0 1 0 49.384727 49.384728l56.273454-56.32c29.975273 196.840727 199.866182 348.299636 404.945455 348.299636 226.117818 0 410.065455-183.994182 410.065454-410.112 0-226.117818-183.947636-410.112-410.112-410.112z"  ></path></symbol><symbol id="icon-v3iv-error" viewBox="0 0 1024 1024"><path d="M512 720m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z"  ></path><path d="M480 416v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8z"  ></path><path d="M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48z m-783.5-27.9L512 239.9l339.8 588.2H172.2z"  ></path></symbol><symbol id="icon-v3iv-xiazai" viewBox="0 0 1024 1024"><path d="M491.9751111 795.53422223c4.77866667 4.77866667 11.60533333 7.50933333 17.74933334 9.55733333C513.82044444 807.13955556 518.5991111 807.82222223 523.37777777 807.82222223s9.55733333-0.68266667 13.65333333-2.73066667c6.82666667-1.36533333 12.97066667-4.096 17.74933334-9.55733333l334.50666666-334.50666667c15.01866667-15.01866667 15.01866667-38.22933333 0-53.248-15.01866667-15.01866667-38.22933333-15.01866667-53.248 0L557.5111111 686.30755556 557.5111111 91.02222223C557.5111111 71.90755556 542.49244444 56.8888889 523.37777777 56.8888889 504.2631111 56.8888889 489.24444444 71.90755556 489.24444444 91.02222223l0 595.28533333L210.71644444 407.77955556c-15.01866667-15.01866667-38.22933333-15.01866667-53.248 0-15.01866667 15.01866667-15.01866667 38.22933333 0 53.248L491.9751111 795.53422223zM932.97777777 876.0888889l-819.2 0C94.6631111 876.0888889 79.64444444 891.10755556 79.64444444 910.22222223 79.64444444 929.3368889 94.6631111 944.35555556 113.77777777 944.35555556l819.2 0c19.11466667 0 34.13333333-15.01866667 34.13333333-34.13333333C967.1111111 891.10755556 952.09244444 876.0888889 932.97777777 876.0888889z"  ></path></symbol><symbol id="icon-v3iv-guanbi" viewBox="0 0 1024 1024"><path d="M576.80746218 506.10841296l394.73636374 394.73636236-41.24111306 41.24111303-394.73636235-394.73636374-394.73636375 394.73636374-41.24111303-41.24111303 394.73636374-394.73636236L99.58887373 111.37204922l41.24111303-41.24111306 394.73636375 394.73636374L930.30271286 70.13093616l41.24111306 41.24111306-394.73636374 394.73636374z" fill="#444444" ></path></symbol><symbol id="icon-v3iv-left-arrow" viewBox="0 0 1024 1024"><path d="M633.8 852.1l45.8 45.8c3.9 3.9 3.9 10.2 0 14.1-2 2-4.5 2.9-7.1 2.9-2.6 0-5.1-1-7.1-2.9l-45.8-45.8c-3.9-3.9-3.9-10.2 0-14.1 4-3.9 10.3-3.9 14.2 0zM315.9 462.5L711.5 66.9c3.9-3.9 10.2-3.9 14.1 0 3.9 3.9 3.9 10.2 0 14.1L330.1 476.6c-9.4 9.4-14.6 22-14.6 35.4 0 13.4 5.2 25.9 14.6 35.4L600.7 818c3.9 3.9 3.9 10.2 0 14.1-2 2-4.5 2.9-7.1 2.9-2.6 0-5.1-1-7.1-2.9L315.9 561.5c-13.2-13.2-20.5-30.8-20.5-49.5s7.3-36.3 20.5-49.5z" fill="" ></path><path d="M718.6 950m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0Z" fill="" ></path></symbol><symbol id="icon-v3iv-right-arrow" viewBox="0 0 1024 1024"><path d="M390.2 852.1l-45.8 45.8c-3.9 3.9-3.9 10.2 0 14.1 2 2 4.5 2.9 7.1 2.9s5.1-1 7.1-2.9l45.8-45.8c3.9-3.9 3.9-10.2 0-14.1-4-3.9-10.3-3.9-14.2 0zM708 462.5L312.5 66.9c-3.9-3.9-10.2-3.9-14.1 0s-3.9 10.2 0 14.1L694 476.6c9.4 9.4 14.6 22 14.6 35.4 0 13.4-5.2 25.9-14.6 35.4L423.3 817.9c-3.9 3.9-3.9 10.2 0 14.1 2 2 4.5 2.9 7.1 2.9s5.1-1 7.1-2.9l270.6-270.6c13.2-13.2 20.5-30.8 20.5-49.5-0.1-18.6-7.3-36.2-20.6-49.4z" fill="" ></path><path d="M305.4 950m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0Z" fill="" ></path></symbol><symbol id="icon-v3iv-jian" viewBox="0 0 1024 1024"><path d="M119.46666667 549.33333334c-25.92 0-46.93333333-21.01333333-46.93333334-46.93333334s21.01333333-46.93333333 46.93333334-46.93333333h785.20213333c25.92 0 46.93333333 21.01333333 46.93333333 46.93333333s-21.01333333 46.93333333-46.93333333 46.93333334H119.46666667z"  ></path></symbol><symbol id="icon-v3iv-jia" viewBox="0 0 1024 1024"><path d="M512 62a37.50000029 37.50000029 0 0 1 37.50000029 37.50000029v374.99999942h374.99999942a37.50000029 37.50000029 0 0 1 0 75.00000058H549.50000029v374.99999942a37.50000029 37.50000029 0 0 1-75.00000058 0V549.50000029H99.50000029a37.50000029 37.50000029 0 0 1 0-75.00000058h374.99999942V99.50000029a37.50000029 37.50000029 0 0 1 37.50000029-37.50000029z"  ></path></symbol><symbol id="icon-v3iv-zhixiang-you" viewBox="0 0 1024 1024"><path d="M805.33267342 555.33078503l-222.20490524 222.20490524a41.42522469 41.42522469 0 0 0 58.57526772 58.57526771l292.95918901-292.91776379a41.30094901 41.30094901 0 0 0 0-58.5752677l-292.95918901-292.9177638a41.42522469 41.42522469 0 0 0-58.57526772 58.57526771l222.20490524 222.20490525H104.04504462a41.42522469 41.42522469 0 0 0 0 82.85044938h701.32905403z" fill="#000000" ></path></symbol><symbol id="icon-v3iv-quanping" viewBox="0 0 1024 1024"><path d="M158.93333333 347.2V159.14666667h188.16c15.25333333 0 27.62666667-12.37333333 27.62666667-27.62666667v-33.17333333c0-15.25333333-12.37333333-27.62666667-27.62666667-27.62666667H91.73333333c-11.73333333 0-21.33333333 9.6-21.33333333 21.33333333v255.36c0 15.25333333 12.37333333 27.62666667 27.62666667 27.62666667H131.2c15.36-0.10666667 27.73333333-12.48 27.73333333-27.84zM679.04 159.14666667H867.2v188.16c0 15.25333333 12.37333333 27.62666667 27.62666667 27.62666666H928c15.25333333 0 27.62666667-12.37333333 27.62666667-27.62666666V91.94666667c0-11.73333333-9.6-21.33333333-21.33333334-21.33333334H679.04c-15.25333333 0-27.62666667 12.37333333-27.62666667 27.62666667v33.17333333c0 15.25333333 12.37333333 27.73333333 27.62666667 27.73333334zM347.09333333 867.41333333H158.93333333V679.25333333c0-15.25333333-12.37333333-27.62666667-27.62666666-27.62666666H98.13333333c-15.25333333 0-27.62666667 12.37333333-27.62666666 27.62666666v255.36c0 11.73333333 9.6 21.33333333 21.33333333 21.33333334h255.36c15.25333333 0 27.62666667-12.37333333 27.62666667-27.62666667v-33.17333333c-0.10666667-15.36-12.48-27.73333333-27.73333334-27.73333334zM867.2 679.25333333v188.16H679.04c-15.25333333 0-27.62666667 12.37333333-27.62666667 27.62666667v33.17333333c0 15.25333333 12.37333333 27.62666667 27.62666667 27.62666667H934.4c11.73333333 0 21.33333333-9.6 21.33333333-21.33333333V679.25333333c0-15.25333333-12.37333333-27.62666667-27.62666666-27.62666666H894.93333333c-15.36 0-27.73333333 12.37333333-27.73333333 27.62666666z"  ></path></symbol><symbol id="icon-v3iv-fullfill" viewBox="0 0 1024 1024"><path d="M288.99555555 694.04444445h68.26666667c5.00622222 0 9.10222222-4.096 9.10222223-9.10222223V339.05777778c0-5.00622222-4.096-9.10222222-9.10222223-9.10222223h-68.26666667c-5.00622222 0-9.10222222 4.096-9.10222222 9.10222223v345.88444444c0 5.00622222 4.096 9.10222222 9.10222222 9.10222223zM512 637.15555555c25.14488889 0 45.51111111-20.36622222 45.51111111-44.37333333 0-26.28266667-20.36622222-46.64888889-45.51111111-46.64888889s-45.51111111 20.36622222-45.51111111 46.64888889c0 24.00711111 20.36622222 44.37333333 45.51111111 44.37333333zM512 477.86666667c25.14488889 0 45.51111111-20.36622222 45.51111111-44.37333334 0-26.28266667-20.36622222-46.64888889-45.51111111-46.64888888s-45.51111111 20.36622222-45.51111111 46.64888888c0 24.00711111 20.36622222 44.37333333 45.51111111 44.37333334z"  ></path><path d="M930.70222222 56.88888889H93.29777778c-20.13866667 0-36.40888889 16.27022222-36.40888889 36.40888889v837.40444444c0 20.13866667 16.27022222 36.40888889 36.40888889 36.40888889h837.40444444c20.13866667 0 36.40888889-16.27022222 36.40888889-36.40888889V93.29777778c0-20.13866667-16.27022222-36.40888889-36.40888889-36.40888889z m-45.51111111 828.30222222H138.80888889V138.80888889h746.38222222v746.38222222z"  ></path><path d="M666.73777778 694.04444445h68.26666667c5.00622222 0 9.10222222-4.096 9.10222222-9.10222223V339.05777778c0-5.00622222-4.096-9.10222222-9.10222222-9.10222223h-68.26666667c-5.00622222 0-9.10222222 4.096-9.10222223 9.10222223v345.88444444c0 5.00622222 4.096 9.10222222 9.10222223 9.10222223z"  ></path></symbol><symbol id="icon-v3iv-xuanzhuan" viewBox="0 0 1048 1024"><path d="M281.73151074 276.38883828h331.82543233c76.42183096 0 104.1239417 7.94855566 132.04029902 22.90298203a155.75741807 155.75741807 0 0 1 64.78822969 64.78823057C825.36132237 391.9964082 833.28845381 419.69851807 833.28845381 496.12034903v246.126716c0 76.42183096-7.94855566 104.1239417-22.90298204 132.04029815a155.75741807 155.75741807 0 0 1-64.78822968 64.78822969C717.68088477 954.05144434 689.97877403 961.9785749 613.55694307 961.9785749H281.73151074c-76.42183096 0-104.1239417-7.94855566-132.04029814-22.90298203a155.75741807 155.75741807 0 0 1-64.78823057-64.78822969C69.92713145 846.37100586 62 818.66889599 62 742.24706503V496.12034903c0-76.42183096 7.94855566-104.1239417 22.90298203-132.04029815a155.75741807 155.75741807 0 0 1 64.78823057-64.78823057C177.60756904 284.31596972 205.30967979 276.38883828 281.73151074 276.38883828z m-24.16703818 85.69871719c-38.20020292 0-52.06197041 3.98498994-66.03086162 11.44077891a77.87870948 77.87870948 0 0 0-32.39411485 32.39411484C151.68370713 419.89134042 147.69871719 433.75310791 147.69871719 471.95331084v294.46079238c0 38.20020292 3.98498994 52.06197041 11.4407789 66.03086074 7.47721318 13.96889122 18.42522451 24.91690166 32.39411485 32.39411573 13.96889122 7.45578808 27.83065869 11.44077891 66.03086162 11.4407789h380.15950869c38.20020292 0 52.06197041-3.98498994 66.03086162-11.4407789a77.87870948 77.87870948 0 0 0 32.39411572-32.39411573c7.45578808-13.96889122 11.44077891-27.83065869 11.44077803-66.03086073V471.95331084c0-38.20020292-3.98498994-52.06197041-11.44077803-66.03086162a77.87870948 77.87870948 0 0 0-32.39411572-32.39411485c-13.96889122-7.45578808-27.83065869-11.44077891-66.03086162-11.4407789H257.56447256z m361.52003848-149.97275508A42.84935859 42.84935859 0 0 1 597.61698154 132.15789776l111.32263389-64.27403789a42.84935859 42.84935859 0 1 1 42.8493586 74.21508896l-8.35562461 4.82055293A386.82258398 386.82258398 0 0 1 970.1921542 352.44644961a42.84935859 42.84935859 0 0 1-78.41432549 34.60085684C844.36501309 283.80177705 740.09109922 212.13622549 619.08451104 212.11480039z"  ></path></symbol><symbol id="icon-v3iv-zhongzhi-circle" viewBox="0 0 1024 1024"><path d="M145.06666667 503.68c1.06666667-46.61333333 10.66666667-91.84 28.69333333-134.4 18.45333333-43.73333333 44.90666667-82.88 78.61333333-116.69333333C286.08 218.77333333 325.33333333 192.32 369.06666667 173.86666667c45.22666667-19.09333333 93.22666667-28.8 142.82666666-28.8s97.6 9.70666667 142.72 28.8c43.62666667 18.45333333 82.88 44.90666667 116.58666667 78.72 10.56 10.56 20.48 21.76 29.65333333 33.49333333l-64.21333333 50.13333333c-5.65333333 4.37333333-3.73333333 13.33333333 3.2 15.04l187.41333333 45.86666667c5.33333333 1.28 10.56-2.77333333 10.56-8.21333333l0.85333334-192.96c0-7.14666667-8.21333333-11.2-13.76-6.72l-60.16 47.04C782.72 131.30666667 655.14666667 64 511.78666667 64 267.41333333 64 68.58666667 259.84 63.99786667 503.25333333 63.89333333 508.05333333 67.73333333 512 72.53333333 512h64c4.69333333 0 8.42666667-3.73333333 8.53333334-8.32z m806.4 8.32h-64c-4.69333333 0-8.42666667 3.73333333-8.53333334 8.32-1.06666667 46.61333333-10.66666667 91.84-28.69333333 134.4-18.45333333 43.73333333-44.90666667 82.98666667-78.61333333 116.69333333C737.92 805.12 698.66666667 831.68 654.93333333 850.13333333c-45.22666667 19.09333333-93.22666667 28.8-142.82666666 28.8s-97.6-9.70666667-142.82666667-28.8c-43.62666667-18.45333333-82.88-44.90666667-116.58666667-78.72-10.56-10.56-20.48-21.76-29.65333333-33.49333333l64.21333333-50.13333333c5.65333333-4.37333333 3.73333333-13.33333333-3.2-15.04l-187.41333333-45.86666667c-5.33333333-1.28-10.56 2.77333333-10.56 8.21333333l-0.74666667 193.06666667c0 7.14666667 8.21333333 11.2 13.76 6.72l60.16-47.04C241.28 892.69333333 368.85333333 960 512.21333333 960c244.48 0 443.2-195.94666667 447.7888-439.25333333 0.10453333-4.8-3.73546667-8.74666667-8.53546666-8.74666667z"  ></path></symbol><symbol id="icon-v3iv-zhixiang-zuo" viewBox="0 0 1024 1024"><path d="M218.66732658 468.66921497l222.20490524-222.20490524a41.42522469 41.42522469 0 0 0-58.57526772-58.57526771l-292.95918901 292.9177638a41.30094901 41.30094901 0 0 0 0 58.57526769l292.95918901 292.9177638a41.42522469 41.42522469 0 0 0 58.57526772-58.57526771l-222.20490524-222.20490525L919.95495538 551.51966435a41.42522469 41.42522469 0 0 0 0-82.85044938l-701.32905403 0z" fill="#000000" ></path></symbol></svg>', function(e) {
  var o = (o = document.getElementsByTagName("script"))[o.length - 1], t = o.getAttribute("data-injectcss"), o = o.getAttribute("data-disable-injectsvg");
  if (!o) {
    var n, i, r, s, a, l = function(h, d) {
      d.parentNode.insertBefore(h, d);
    };
    if (t && !e.__iconfont__svg__cssinject__) {
      e.__iconfont__svg__cssinject__ = !0;
      try {
        document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
      } catch (h) {
        console && console.log(h);
      }
    }
    n = function() {
      var h, d = document.createElement("div");
      d.innerHTML = e._iconfont_svg_string_3113478, (d = d.getElementsByTagName("svg")[0]) && (d.setAttribute("aria-hidden", "true"), d.style.position = "absolute", d.style.width = 0, d.style.height = 0, d.style.overflow = "hidden", d = d, (h = document.body).firstChild ? l(d, h.firstChild) : h.appendChild(d));
    }, document.addEventListener ? ~["complete", "loaded", "interactive"].indexOf(document.readyState) ? setTimeout(n, 0) : (i = function() {
      document.removeEventListener("DOMContentLoaded", i, !1), n();
    }, document.addEventListener("DOMContentLoaded", i, !1)) : document.attachEvent && (r = n, s = e.document, a = !1, u(), s.onreadystatechange = function() {
      s.readyState == "complete" && (s.onreadystatechange = null, c());
    });
  }
  function c() {
    a || (a = !0, r());
  }
  function u() {
    try {
      s.documentElement.doScroll("left");
    } catch {
      return void setTimeout(u, 50);
    }
    c();
  }
}(window);
export {
  oe as Image,
  Dt as Viewer
};
