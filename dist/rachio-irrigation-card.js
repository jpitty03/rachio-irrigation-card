//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, n = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, r, i, a, o, s, c, l, u, d, ee = t((() => {
	r = globalThis, i = r.ShadowRoot && (r.ShadyCSS === void 0 || r.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, a = Symbol(), o = /* @__PURE__ */ new WeakMap(), s = class {
		constructor(e, t, n) {
			if (this._$cssResult$ = !0, n !== a) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
			this.cssText = e, this.t = t;
		}
		get styleSheet() {
			let e = this.o, t = this.t;
			if (i && e === void 0) {
				let n = t !== void 0 && t.length === 1;
				n && (e = o.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && o.set(t, e));
			}
			return e;
		}
		toString() {
			return this.cssText;
		}
	}, c = (e) => new s(typeof e == "string" ? e : e + "", void 0, a), l = (e, ...t) => {
		let n = e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
			if (!0 === e._$cssResult$) return e.cssText;
			if (typeof e == "number") return e;
			throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
		})(n) + e[r + 1], e[0]);
		return new s(n, e, a);
	}, u = (e, t) => {
		if (i) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
		else for (let n of t) {
			let t = document.createElement("style"), i = r.litNonce;
			i !== void 0 && t.setAttribute("nonce", i), t.textContent = n.cssText, e.appendChild(t);
		}
	}, d = i ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
		let t = "";
		for (let n of e.cssRules) t += n.cssText;
		return c(t);
	})(e) : e;
})), te, ne, re, ie, ae, oe, f, p, se, ce, m, h, g, _, v, y = t((() => {
	ee(), {is: te, defineProperty: ne, getOwnPropertyDescriptor: re, getOwnPropertyNames: ie, getOwnPropertySymbols: ae, getPrototypeOf: oe} = Object, f = globalThis, p = f.trustedTypes, se = p ? p.emptyScript : "", ce = f.reactiveElementPolyfillSupport, m = (e, t) => e, h = {
		toAttribute(e, t) {
			switch (t) {
				case Boolean:
					e = e ? se : null;
					break;
				case Object:
				case Array: e = e == null ? e : JSON.stringify(e);
			}
			return e;
		},
		fromAttribute(e, t) {
			let n = e;
			switch (t) {
				case Boolean:
					n = e !== null;
					break;
				case Number:
					n = e === null ? null : Number(e);
					break;
				case Object:
				case Array: try {
					n = JSON.parse(e);
				} catch {
					n = null;
				}
			}
			return n;
		}
	}, g = (e, t) => !te(e, t), _ = {
		attribute: !0,
		type: String,
		converter: h,
		reflect: !1,
		useDefault: !1,
		hasChanged: g
	}, Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap(), v = class extends HTMLElement {
		static addInitializer(e) {
			this._$Ei(), (this.l ??= []).push(e);
		}
		static get observedAttributes() {
			return this.finalize(), this._$Eh && [...this._$Eh.keys()];
		}
		static createProperty(e, t = _) {
			if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
				let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
				r !== void 0 && ne(this.prototype, e, r);
			}
		}
		static getPropertyDescriptor(e, t, n) {
			let { get: r, set: i } = re(this.prototype, e) ?? {
				get() {
					return this[t];
				},
				set(e) {
					this[t] = e;
				}
			};
			return {
				get: r,
				set(t) {
					let a = r?.call(this);
					i?.call(this, t), this.requestUpdate(e, a, n);
				},
				configurable: !0,
				enumerable: !0
			};
		}
		static getPropertyOptions(e) {
			return this.elementProperties.get(e) ?? _;
		}
		static _$Ei() {
			if (this.hasOwnProperty(m("elementProperties"))) return;
			let e = oe(this);
			e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
		}
		static finalize() {
			if (this.hasOwnProperty(m("finalized"))) return;
			if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(m("properties"))) {
				let e = this.properties, t = [...ie(e), ...ae(e)];
				for (let n of t) this.createProperty(n, e[n]);
			}
			let e = this[Symbol.metadata];
			if (e !== null) {
				let t = litPropertyMetadata.get(e);
				if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
			}
			this._$Eh = /* @__PURE__ */ new Map();
			for (let [e, t] of this.elementProperties) {
				let n = this._$Eu(e, t);
				n !== void 0 && this._$Eh.set(n, e);
			}
			this.elementStyles = this.finalizeStyles(this.styles);
		}
		static finalizeStyles(e) {
			let t = [];
			if (Array.isArray(e)) {
				let n = new Set(e.flat(Infinity).reverse());
				for (let e of n) t.unshift(d(e));
			} else e !== void 0 && t.push(d(e));
			return t;
		}
		static _$Eu(e, t) {
			let n = t.attribute;
			return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
		}
		constructor() {
			super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
		}
		_$Ev() {
			this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
		}
		addController(e) {
			(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
		}
		removeController(e) {
			this._$EO?.delete(e);
		}
		_$E_() {
			let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
			for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
			e.size > 0 && (this._$Ep = e);
		}
		createRenderRoot() {
			let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
			return u(e, this.constructor.elementStyles), e;
		}
		connectedCallback() {
			this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
		}
		enableUpdating(e) {}
		disconnectedCallback() {
			this._$EO?.forEach((e) => e.hostDisconnected?.());
		}
		attributeChangedCallback(e, t, n) {
			this._$AK(e, n);
		}
		_$ET(e, t) {
			let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
			if (r !== void 0 && !0 === n.reflect) {
				let i = (n.converter?.toAttribute === void 0 ? h : n.converter).toAttribute(t, n.type);
				this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
			}
		}
		_$AK(e, t) {
			let n = this.constructor, r = n._$Eh.get(e);
			if (r !== void 0 && this._$Em !== r) {
				let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? h : e.converter;
				this._$Em = r;
				let a = i.fromAttribute(t, e.type);
				this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
			}
		}
		requestUpdate(e, t, n, r = !1, i) {
			if (e !== void 0) {
				let a = this.constructor;
				if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? g)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
				this.C(e, t, n);
			}
			!1 === this.isUpdatePending && (this._$ES = this._$EP());
		}
		C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
			n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
		}
		async _$EP() {
			this.isUpdatePending = !0;
			try {
				await this._$ES;
			} catch (e) {
				Promise.reject(e);
			}
			let e = this.scheduleUpdate();
			return e != null && await e, !this.isUpdatePending;
		}
		scheduleUpdate() {
			return this.performUpdate();
		}
		performUpdate() {
			if (!this.isUpdatePending) return;
			if (!this.hasUpdated) {
				if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
					for (let [e, t] of this._$Ep) this[e] = t;
					this._$Ep = void 0;
				}
				let e = this.constructor.elementProperties;
				if (e.size > 0) for (let [t, n] of e) {
					let { wrapped: e } = n, r = this[t];
					!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
				}
			}
			let e = !1, t = this._$AL;
			try {
				e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
			} catch (t) {
				throw e = !1, this._$EM(), t;
			}
			e && this._$AE(t);
		}
		willUpdate(e) {}
		_$AE(e) {
			this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
		}
		_$EM() {
			this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
		}
		get updateComplete() {
			return this.getUpdateComplete();
		}
		getUpdateComplete() {
			return this._$ES;
		}
		shouldUpdate(e) {
			return !0;
		}
		update(e) {
			this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
		}
		updated(e) {}
		firstUpdated(e) {}
	}, v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[m("elementProperties")] = /* @__PURE__ */ new Map(), v[m("finalized")] = /* @__PURE__ */ new Map(), ce?.({ ReactiveElement: v }), (f.reactiveElementVersions ??= []).push("2.1.2");
}));
//#endregion
//#region node_modules/lit-html/lit-html.js
function le(e, t) {
	if (!D(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return de === void 0 ? t : de.createHTML(t);
}
function b(e, t, n = e, r) {
	if (t === R) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = E(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = b(e, i._$AS(e, t.values), i, r)), t;
}
var x, ue, S, de, fe, C, pe, me, w, T, E, D, he, O, k, A, j, M, N, P, F, I, L, R, z, B, V, ge, H, _e, U, W, ve, ye, be, xe, Se, Ce, G = t((() => {
	x = globalThis, ue = (e) => e, S = x.trustedTypes, de = S ? S.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, fe = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, pe = "?" + C, me = `<${pe}>`, w = document, T = () => w.createComment(""), E = (e) => e === null || typeof e != "object" && typeof e != "function", D = Array.isArray, he = (e) => D(e) || typeof e?.[Symbol.iterator] == "function", O = "[ 	\n\f\r]", k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, A = /-->/g, j = />/g, M = RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), N = /'/g, P = /"/g, F = /^(?:script|style|textarea|title)$/i, I = (e) => (t, ...n) => ({
		_$litType$: e,
		strings: t,
		values: n
	}), L = I(1), I(2), I(3), R = Symbol.for("lit-noChange"), z = Symbol.for("lit-nothing"), B = /* @__PURE__ */ new WeakMap(), V = w.createTreeWalker(w, 129), ge = (e, t) => {
		let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = k;
		for (let t = 0; t < n; t++) {
			let n = e[t], s, c, l = -1, u = 0;
			for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === k ? c[1] === "!--" ? o = A : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = M) : (F.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = M) : o = j : o === M ? c[0] === ">" ? (o = i ?? k, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? M : c[3] === "\"" ? P : N) : o === P || o === N ? o = M : o === A || o === j ? o = k : (o = M, i = void 0);
			let d = o === M && e[t + 1].startsWith("/>") ? " " : "";
			a += o === k ? n + me : l >= 0 ? (r.push(s), n.slice(0, l) + fe + n.slice(l) + C + d) : n + C + (l === -2 ? t : d);
		}
		return [le(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
	}, H = class e {
		constructor({ strings: t, _$litType$: n }, r) {
			let i;
			this.parts = [];
			let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ge(t, n);
			if (this.el = e.createElement(l, r), V.currentNode = this.el.content, n === 2 || n === 3) {
				let e = this.el.content.firstChild;
				e.replaceWith(...e.childNodes);
			}
			for (; (i = V.nextNode()) !== null && c.length < s;) {
				if (i.nodeType === 1) {
					if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(fe)) {
						let t = u[o++], n = i.getAttribute(e).split(C), r = /([.?@])?(.*)/.exec(t);
						c.push({
							type: 1,
							index: a,
							name: r[2],
							strings: n,
							ctor: r[1] === "." ? ve : r[1] === "?" ? ye : r[1] === "@" ? be : W
						}), i.removeAttribute(e);
					} else e.startsWith(C) && (c.push({
						type: 6,
						index: a
					}), i.removeAttribute(e));
					if (F.test(i.tagName)) {
						let e = i.textContent.split(C), t = e.length - 1;
						if (t > 0) {
							i.textContent = S ? S.emptyScript : "";
							for (let n = 0; n < t; n++) i.append(e[n], T()), V.nextNode(), c.push({
								type: 2,
								index: ++a
							});
							i.append(e[t], T());
						}
					}
				} else if (i.nodeType === 8) if (i.data === pe) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(C, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += C.length - 1;
				}
				a++;
			}
		}
		static createElement(e, t) {
			let n = w.createElement("template");
			return n.innerHTML = e, n;
		}
	}, _e = class {
		constructor(e, t) {
			this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
		}
		get parentNode() {
			return this._$AM.parentNode;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		u(e) {
			let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? w).importNode(t, !0);
			V.currentNode = r;
			let i = V.nextNode(), a = 0, o = 0, s = n[0];
			for (; s !== void 0;) {
				if (a === s.index) {
					let t;
					s.type === 2 ? t = new U(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new xe(i, this, e)), this._$AV.push(t), s = n[++o];
				}
				a !== s?.index && (i = V.nextNode(), a++);
			}
			return V.currentNode = w, r;
		}
		p(e) {
			let t = 0;
			for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
		}
	}, U = class e {
		get _$AU() {
			return this._$AM?._$AU ?? this._$Cv;
		}
		constructor(e, t, n, r) {
			this.type = 2, this._$AH = z, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
		}
		get parentNode() {
			let e = this._$AA.parentNode, t = this._$AM;
			return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
		}
		get startNode() {
			return this._$AA;
		}
		get endNode() {
			return this._$AB;
		}
		_$AI(e, t = this) {
			e = b(this, e, t), E(e) ? e === z || e == null || e === "" ? (this._$AH !== z && this._$AR(), this._$AH = z) : e !== this._$AH && e !== R && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? he(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
		}
		O(e) {
			return this._$AA.parentNode.insertBefore(e, this._$AB);
		}
		T(e) {
			this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
		}
		_(e) {
			this._$AH !== z && E(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
		}
		$(e) {
			let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = H.createElement(le(n.h, n.h[0]), this.options)), n);
			if (this._$AH?._$AD === r) this._$AH.p(t);
			else {
				let e = new _e(r, this), n = e.u(this.options);
				e.p(t), this.T(n), this._$AH = e;
			}
		}
		_$AC(e) {
			let t = B.get(e.strings);
			return t === void 0 && B.set(e.strings, t = new H(e)), t;
		}
		k(t) {
			D(this._$AH) || (this._$AH = [], this._$AR());
			let n = this._$AH, r, i = 0;
			for (let a of t) i === n.length ? n.push(r = new e(this.O(T()), this.O(T()), this, this.options)) : r = n[i], r._$AI(a), i++;
			i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
		}
		_$AR(e = this._$AA.nextSibling, t) {
			for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
				let t = ue(e).nextSibling;
				ue(e).remove(), e = t;
			}
		}
		setConnected(e) {
			this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
		}
	}, W = class {
		get tagName() {
			return this.element.tagName;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		constructor(e, t, n, r, i) {
			this.type = 1, this._$AH = z, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = z;
		}
		_$AI(e, t = this, n, r) {
			let i = this.strings, a = !1;
			if (i === void 0) e = b(this, e, t, 0), a = !E(e) || e !== this._$AH && e !== R, a && (this._$AH = e);
			else {
				let r = e, o, s;
				for (e = i[0], o = 0; o < i.length - 1; o++) s = b(this, r[n + o], t, o), s === R && (s = this._$AH[o]), a ||= !E(s) || s !== this._$AH[o], s === z ? e = z : e !== z && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
			}
			a && !r && this.j(e);
		}
		j(e) {
			e === z ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
		}
	}, ve = class extends W {
		constructor() {
			super(...arguments), this.type = 3;
		}
		j(e) {
			this.element[this.name] = e === z ? void 0 : e;
		}
	}, ye = class extends W {
		constructor() {
			super(...arguments), this.type = 4;
		}
		j(e) {
			this.element.toggleAttribute(this.name, !!e && e !== z);
		}
	}, be = class extends W {
		constructor(e, t, n, r, i) {
			super(e, t, n, r, i), this.type = 5;
		}
		_$AI(e, t = this) {
			if ((e = b(this, e, t, 0) ?? z) === R) return;
			let n = this._$AH, r = e === z && n !== z || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== z && (n === z || r);
			r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
		}
		handleEvent(e) {
			typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
		}
	}, xe = class {
		constructor(e, t, n) {
			this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		_$AI(e) {
			b(this, e);
		}
	}, Se = x.litHtmlPolyfillSupport, Se?.(H, U), (x.litHtmlVersions ??= []).push("3.3.3"), Ce = (e, t, n) => {
		let r = n?.renderBefore ?? t, i = r._$litPart$;
		if (i === void 0) {
			let e = n?.renderBefore ?? null;
			r._$litPart$ = i = new U(t.insertBefore(T(), e), e, void 0, n ?? {});
		}
		return i._$AI(e), i;
	};
})), K, q, we, Te = t((() => {
	y(), y(), G(), G(), K = globalThis, q = class extends v {
		constructor() {
			super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
		}
		createRenderRoot() {
			let e = super.createRenderRoot();
			return this.renderOptions.renderBefore ??= e.firstChild, e;
		}
		update(e) {
			let t = this.render();
			this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ce(t, this.renderRoot, this.renderOptions);
		}
		connectedCallback() {
			super.connectedCallback(), this._$Do?.setConnected(!0);
		}
		disconnectedCallback() {
			super.disconnectedCallback(), this._$Do?.setConnected(!1);
		}
		render() {
			return R;
		}
	}, q._$litElement$ = !0, q.finalized = !0, K.litElementHydrateSupport?.({ LitElement: q }), we = K.litElementPolyfillSupport, we?.({ LitElement: q }), (K.litElementVersions ??= []).push("4.2.2");
})), Ee = t((() => {})), De = t((() => {
	y(), G(), Te(), Ee();
}));
//#endregion
//#region src/helpers.ts
De();
function Oe(e) {
	let t = e.indexOf(".");
	return t === -1 ? "" : e.slice(0, t);
}
function J(e) {
	return e === "on";
}
function ke(e) {
	let t = Math.max(0, e);
	return `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, "0")}`;
}
async function Ae(e, t) {
	let [n, r] = t.service.split(".");
	if (!n || !r) throw Error(`Invalid service: ${t.service}`);
	await e.callService(n, r, t.data, t.target);
}
var je = "rachio-irrigation-card";
function Y(e, t) {
	return `${je}:${e}:${t}`;
}
function Me(e, t) {
	try {
		localStorage.setItem(Y(e, "start"), String(Date.now())), localStorage.setItem(Y(e, "duration"), String(t * 60));
	} catch {}
}
function X(e) {
	try {
		localStorage.removeItem(Y(e, "start")), localStorage.removeItem(Y(e, "duration"));
	} catch {}
}
function Ne(e) {
	try {
		let t = localStorage.getItem(Y(e, "start")), n = localStorage.getItem(Y(e, "duration"));
		if (!t || !n) return 0;
		let r = Number(t), i = Number(n);
		if (!Number.isFinite(r) || !Number.isFinite(i)) return 0;
		let a = i - Math.floor((Date.now() - r) / 1e3);
		return a <= 0 ? (X(e), 0) : a;
	} catch {
		return 0;
	}
}
//#endregion
//#region src/styles.ts
var Pe = l`
  :host {
    display: block;
    box-sizing: border-box;
    max-width: 100%;
  }

  ha-card {
    display: block;
    overflow: hidden;
    box-sizing: border-box;
    max-width: 100%;
    background: var(--ha-card-background, var(--card-background-color));
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, none);
  }

  .quick-run-card {
    padding: 16px;
  }

  /* ── Header ── */
  .quick-run-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    gap: 8px;
  }

  .quick-run-header .title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .quick-run-header .title ha-icon {
    --mdc-icon-size: 24px;
    color: var(--primary-color);
  }

  .header-main {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .subtitle {
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }

  .connection-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: var(--secondary-text-color);
  }

  .connection-status ha-icon {
    color: var(--success-color, var(--state-active-color, var(--primary-color)));
    --mdc-icon-size: 18px;
  }

  /* ── Divider ── */
  .divider {
    height: 1px;
    background: var(--divider-color);
    margin-bottom: 12px;
  }

  /* ── Schedules ── */
  .schedules {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    margin-bottom: 12px;
  }

  .schedule-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: var(--secondary-text-color);
  }

  .schedule-item ha-icon {
    --mdc-icon-size: 14px;
    color: var(--state-active-color, #4caf50);
  }

  /* ── Status row (rain) ── */
  .status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
  }

  .status-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--secondary-text-color);
    font-size: 0.9rem;
  }

  .status-label ha-icon {
    color: var(--state-icon-color, var(--secondary-text-color));
    --mdc-icon-size: 20px;
  }

  .status-value {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  /* ── Progress section ── */
  .progress-section {
    padding: 8px 0;
    margin-bottom: 12px;
  }

  .progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .progress-zone {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .progress-time {
    font-size: 0.875rem;
    font-variant-numeric: tabular-nums;
    color: var(--secondary-text-color);
  }

  .progress-bar {
    height: 8px;
    background: var(--divider-color);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--primary-color, var(--state-active-color));
    border-radius: 4px;
    transition: width 1s linear;
  }

  /* ── Zone grid ── */
  .zone-grid {
    display: grid;
    grid-template-columns: repeat(var(--zone-columns, 4), minmax(0, 1fr));
    gap: 8px;
    margin-bottom: 12px;
  }

  .zone-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--card-background-color, transparent);
    color: var(--primary-text-color);
    cursor: pointer;
    font: inherit;
    transition: background 0.2s, border-color 0.2s;
  }

  .zone-button:hover {
    border-color: var(--primary-color);
  }

  .zone-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .zone-button.active {
    border-color: var(--state-active-color, #4caf50);
    border-width: 2px;
    box-shadow: 0 0 12px 2px rgba(76, 175, 80, 0.4);
  }

  .zone-button.active .zone-icon {
    color: var(--state-active-color, #4caf50);
  }

  .zone-icon {
    --mdc-icon-size: 28px;
    color: var(--state-icon-color, var(--primary-color));
  }

  .zone-name {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .zone-location {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .zone-status {
    font-size: 0.75rem;
    opacity: 0.6;
  }

  /* ── Compact mode ── */
  .quick-run-card.compact {
    padding: 8px;
  }

  .quick-run-card.compact .zone-button {
    padding: 6px 4px;
  }

  .quick-run-card.compact .zone-location,
  .quick-run-card.compact .zone-status {
    display: none;
  }

  .quick-run-card.compact .zone-icon {
    --mdc-icon-size: 20px;
  }

  /* ── Action grid ── */
  .action-grid {
    display: grid;
    grid-template-columns: repeat(var(--action-columns, 3), minmax(0, 1fr));
    gap: 8px;
  }

  .action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--card-background-color, transparent);
    color: var(--primary-text-color);
    cursor: pointer;
    font: inherit;
    transition: background 0.2s, border-color 0.2s;
  }

  .action-button:hover {
    border-color: var(--primary-color);
  }

  .action-button.stop {
    border-color: var(--error-color, #db4437);
    color: var(--error-color, #db4437);
  }

  .action-button.stop:hover {
    background: var(--error-color, #db4437);
    color: var(--text-primary-color, white);
  }

  .action-icon {
    --mdc-icon-size: 24px;
  }

  .action-name {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .action-status {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  /* ── Warnings ── */
  .warnings {
    margin-bottom: 8px;
  }

  .warning {
    font-size: 0.75rem;
    color: var(--error-color, #db4437);
    padding: 4px 6px;
    border: 1px solid var(--error-color, #db4437);
    border-radius: 6px;
    margin-bottom: 4px;
  }

  .warning code {
    font-family: var(--code-font-family, monospace);
  }
`, Fe, Ie = t((() => {
	Fe = (e) => (t, n) => {
		n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
			customElements.define(e, t);
		});
	};
}));
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
function Le(e) {
	return (t, n) => typeof n == "object" ? ze(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
var Re, ze, Be = t((() => {
	y(), Re = {
		attribute: !0,
		type: String,
		converter: h,
		reflect: !1,
		hasChanged: g
	}, ze = (e = Re, t, n) => {
		let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
		if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
			let { name: r } = n;
			return {
				set(n) {
					let i = t.get.call(this);
					t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
				},
				init(t) {
					return t !== void 0 && this.C(r, void 0, e, t), t;
				}
			};
		}
		if (r === "setter") {
			let { name: r } = n;
			return function(n) {
				let i = this[r];
				t.call(this, n), this.requestUpdate(r, i, e, !0, n);
			};
		}
		throw Error("Unsupported decorator location: " + r);
	};
}));
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function Ve(e) {
	return Le({
		...e,
		state: !0,
		attribute: !1
	});
}
var He = t((() => {
	Be();
})), Ue = t((() => {})), We = t((() => {})), Ge = t((() => {})), Ke = t((() => {})), qe = t((() => {})), Je = t((() => {})), Ye = t((() => {
	Ie(), Be(), He(), Ue(), We(), Ge(), Ke(), qe(), Je();
}));
//#endregion
//#region \0@oxc-project+runtime@0.138.0/helpers/esm/decorate.js
function Z(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
var Xe = t((() => {})), Ze = /* @__PURE__ */ n({ RachioIrrigationCardEditor: () => $ }), Q, $, Qe = t((() => {
	De(), Ye(), Xe(), Q = 10, $ = class extends q {
		setConfig(e) {
			this._config = { ...e };
		}
		_update(e) {
			this._config && (this._config = {
				...this._config,
				...e
			}, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } })));
		}
		_updateZone(e, t) {
			if (!this._config) return;
			let n = this._config.zones.slice();
			n[e] = {
				...n[e],
				...t
			}, this._update({ zones: n });
		}
		_addZone() {
			if (!this._config) return;
			let e = this._config.zones.slice(), t = e.length + 1;
			e.push({
				name: `Zone ${t}`,
				entity: "",
				duration: this._config.default_duration ?? Q
			}), this._update({ zones: e });
		}
		_removeZone(e) {
			if (!this._config || this._config.zones.length <= 1) return;
			let t = this._config.zones.slice();
			t.splice(e, 1), this._update({ zones: t });
		}
		_updateLayout(e) {
			if (!this._config) return;
			let t = {
				...this._config.layout ?? {},
				...e
			};
			this._update({ layout: t });
		}
		_updateSchedule(e, t) {
			if (!this._config) return;
			let n = (this._config.schedules ?? []).slice();
			t ? n[e] = t : n.splice(e, 1), this._update({ schedules: n.length ? n : void 0 });
		}
		_addSchedule() {
			if (!this._config) return;
			let e = (this._config.schedules ?? []).slice();
			e.push(""), this._update({ schedules: e });
		}
		_numValue(e) {
			let t = e.trim();
			if (t === "") return;
			let n = Number(t);
			return Number.isFinite(n) ? n : void 0;
		}
		render() {
			if (!this._config) return z;
			let e = this._config.layout ?? {};
			return L`
      <div class="form">
        <div class="section-title">Header</div>
        <div class="field">
          <ha-textfield
            label="Title"
            .value=${this._config.title ?? ""}
            @input=${(e) => this._update({ title: e.target.value })}
          ></ha-textfield>
        </div>
        <div class="field">
          <ha-textfield
            label="Header icon (mdi:)"
            .value=${this._config.header_icon ?? ""}
            placeholder="mdi:sprinkler-variant"
            @input=${(e) => this._update({ header_icon: e.target.value.trim() || void 0 })}
          ></ha-textfield>
        </div>
        <div class="field">
          <ha-textfield
            label="Header subtitle"
            .value=${this._config.header_subtitle ?? ""}
            placeholder="e.g. Backyard zones"
            @input=${(e) => this._update({ header_subtitle: e.target.value || void 0 })}
          ></ha-textfield>
        </div>
        <div class="field row">
          <ha-formfield label="Show header">
            <ha-switch
              .checked=${this._config.show_header ?? !0}
              @change=${(e) => this._update({ show_header: e.target.checked })}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="Show connection status">
            <ha-switch
              .checked=${this._config.show_connection_status ?? !0}
              @change=${(e) => this._update({ show_connection_status: e.target.checked })}
            ></ha-switch>
          </ha-formfield>
        </div>

        <div class="field row">
          <ha-textfield
            label="Default duration (minutes)"
            type="number"
            .value=${String(this._config.default_duration ?? Q)}
            @input=${(e) => this._update({ default_duration: this._numValue(e.target.value) ?? Q })}
          ></ha-textfield>
          <ha-formfield label="Show timer">
            <ha-switch
              .checked=${this._config.show_timer ?? !0}
              @change=${(e) => this._update({ show_timer: e.target.checked })}
            ></ha-switch>
          </ha-formfield>
        </div>

        <div class="zones">
          ${this._config.zones.map((e, t) => L`
              <fieldset>
                <legend>Zone ${t + 1}</legend>
                <div class="field">
                  <ha-textfield
                    label="Name"
                    .value=${e.name ?? ""}
                    @input=${(e) => this._updateZone(t, { name: e.target.value })}
                  ></ha-textfield>
                </div>
                <div class="field">
                  <ha-textfield
                    label="Location"
                    .value=${e.location ?? ""}
                    @input=${(e) => this._updateZone(t, { location: e.target.value })}
                  ></ha-textfield>
                </div>
                <div class="field">
                  <ha-entity-picker
                    .hass=${this.hass}
                    label="Entity"
                    .value=${e.entity}
                    allow-custom-entity
                    @value-changed=${(e) => this._updateZone(t, { entity: e.detail.value })}
                  ></ha-entity-picker>
                </div>
                <div class="field row">
                  <ha-textfield
                    label="Duration (minutes)"
                    type="number"
                    .value=${e.duration == null ? "" : String(e.duration)}
                    @input=${(e) => this._updateZone(t, { duration: this._numValue(e.target.value) })}
                  ></ha-textfield>
                  ${this._config.zones.length > 1 ? L`<ha-icon-button
                        class="remove"
                        label="Remove zone"
                        .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                        @click=${() => this._removeZone(t)}
                      ></ha-icon-button>` : z}
                </div>
              </fieldset>
            `)}
        </div>

        <ha-button @click=${this._addZone}>
          <ha-icon icon="mdi:plus"></ha-icon>
          Add zone
        </ha-button>

        <div class="section-title">Optional entities</div>
        <div class="field">
          <ha-entity-picker
            .hass=${this.hass}
            label="Rain delay entity"
            .value=${this._config.rain_delay_entity ?? ""}
            allow-custom-entity
            @value-changed=${(e) => this._update({ rain_delay_entity: e.detail.value || void 0 })}
          ></ha-entity-picker>
        </div>
        <div class="field">
          <ha-entity-picker
            .hass=${this.hass}
            label="Standby entity"
            .value=${this._config.standby_entity ?? ""}
            allow-custom-entity
            @value-changed=${(e) => this._update({ standby_entity: e.detail.value || void 0 })}
          ></ha-entity-picker>
        </div>

        <div class="field row">
          <ha-formfield label="Show schedules">
            <ha-switch
              .checked=${this._config.show_schedules ?? !0}
              @change=${(e) => this._update({ show_schedules: e.target.checked })}
            ></ha-switch>
          </ha-formfield>
        </div>

        <div class="section-title">Schedule entities</div>
        ${(this._config.schedules ?? []).map((e, t) => L`
            <div class="field row">
              <ha-entity-picker
                .hass=${this.hass}
                label="Schedule entity"
                .value=${e}
                allow-custom-entity
                @value-changed=${(e) => this._updateSchedule(t, e.detail.value)}
              ></ha-entity-picker>
              <ha-icon-button
                class="remove"
                label="Remove schedule"
                .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                @click=${() => this._updateSchedule(t, "")}
              ></ha-icon-button>
            </div>
          `)}
        <ha-button @click=${this._addSchedule}>
          <ha-icon icon="mdi:plus"></ha-icon>
          Add schedule
        </ha-button>

        <div class="section-title">Layout</div>
        <div class="field row">
          <ha-textfield
            label="Columns"
            type="number"
            min="1"
            max="6"
            .value=${String(e.columns ?? 2)}
            @input=${(e) => this._updateLayout({ columns: this._numValue(e.target.value) })}
          ></ha-textfield>
          <ha-formfield label="Compact">
            <ha-switch
              .checked=${e.compact ?? !1}
              @change=${(e) => this._updateLayout({ compact: e.target.checked })}
            ></ha-switch>
          </ha-formfield>
        </div>
        <div class="field row">
          <ha-formfield label="Show status">
            <ha-switch
              .checked=${e.show_status ?? !0}
              @change=${(e) => this._updateLayout({ show_status: e.target.checked })}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="Show timer (layout override)">
            <ha-switch
              .checked=${e.show_timer ?? !0}
              @change=${(e) => this._updateLayout({ show_timer: e.target.checked })}
            ></ha-switch>
          </ha-formfield>
        </div>
      </div>
    `;
		}
		static {
			this.styles = l`
    .form {
      display: grid;
      gap: 12px;
    }
    .field {
      display: block;
    }
    .field.row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .field.row > * {
      flex: 1 1 auto;
    }
    .zones {
      display: grid;
      gap: 12px;
    }
    fieldset {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 12px;
      margin: 0;
    }
    legend {
      font-weight: 600;
      padding: 0 6px;
    }
    .section-title {
      font-weight: 600;
      margin-top: 4px;
    }
    .remove {
      color: var(--error-color, #db4437);
      flex: 0 0 auto;
    }
    ha-icon {
      display: inline-flex;
      vertical-align: middle;
      margin-right: 4px;
    }
  `;
		}
	}, Z([Le({ attribute: !1 })], $.prototype, "hass", void 0), Z([Ve()], $.prototype, "_config", void 0), $ = Z([Fe("rachio-irrigation-card-editor")], $);
}));
//#endregion
//#region src/rachio-irrigation-card.ts
De();
var $e = /^[a-z_]+\.[a-z_0-9]+$/i;
function et(e, t) {
	if (e && (!e.service || !$e.test(e.service))) throw Error(`Rachio Irrigation Card: ${t} has invalid service "${e.service}". Expected "domain.service" (e.g. "switch.turn_on").`);
}
var tt = class extends q {
	constructor(...e) {
		super(...e), this.timers = {};
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			config: { state: !0 },
			timers: { state: !0 }
		};
	}
	setConfig(e) {
		if (!e || typeof e != "object") throw Error("Rachio Irrigation Card: config is not an object.");
		if (!Array.isArray(e.zones)) throw Error("Rachio Irrigation Card requires a zones array.");
		if (e.zones.length === 0) throw Error("Rachio Irrigation Card requires at least one zone.");
		for (let [t, n] of e.zones.entries()) {
			if (!n.entity || typeof n.entity != "string") throw Error(`Rachio Irrigation Card: zone[${t}] is missing a string "entity".`);
			if (n.duration !== void 0 && (typeof n.duration != "number" || n.duration <= 0)) throw Error(`Rachio Irrigation Card: zone[${t}].duration must be a positive number.`);
			et(n.tap_action, `zone[${t}].tap_action`);
		}
		if (e.default_duration !== void 0 && (typeof e.default_duration != "number" || e.default_duration <= 0)) throw Error("Rachio Irrigation Card: default_duration must be a positive number.");
		et(e.stop_action, "stop_action"), this.config = {
			title: "Irrigation Quick Run",
			default_duration: 10,
			show_timer: !0,
			...e
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.hydrateTimers(), this.intervalId = window.setInterval(() => {
			if (!Object.values(this.timers).some((e) => e > 0)) return;
			let e = {};
			for (let [t, n] of Object.entries(this.timers)) if (n > 1) e[t] = n - 1;
			else if (X(t), this.hass) {
				let e = Oe(t);
				this.hass.callService(e, "turn_off", { entity_id: t });
			}
			this.timers = e;
		}, 1e3);
	}
	hydrateTimers() {
		if (!this.config) return;
		let e = {};
		for (let t of this.config.zones) {
			let n = Ne(t.entity);
			n > 0 && (e[t.entity] = n);
		}
		Object.keys(e).length > 0 && (this.timers = e);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.intervalId &&= (window.clearInterval(this.intervalId), void 0);
	}
	getCardSize() {
		return 2;
	}
	getGridOptions() {
		return {
			columns: 6,
			min_columns: 3,
			min_rows: 1
		};
	}
	static getStubConfig() {
		return {
			title: "Irrigation Quick Run",
			default_duration: 10,
			show_timer: !0,
			zones: [
				{
					name: "Zone 1",
					location: "Front Yard",
					entity: "switch.zone_1",
					duration: 10
				},
				{
					name: "Zone 2",
					location: "Front Side",
					entity: "switch.zone_2",
					duration: 10
				},
				{
					name: "Zone 3",
					location: "Far Backyard",
					entity: "switch.zone_3",
					duration: 10
				},
				{
					name: "Zone 4",
					location: "Backyard",
					entity: "switch.zone_4",
					duration: 10
				}
			]
		};
	}
	static async getConfigElement() {
		return await Promise.resolve().then(() => (Qe(), Ze)), document.createElement("rachio-irrigation-card-editor");
	}
	getEntityState(e) {
		return this.hass?.states?.[e];
	}
	async toggleEntity(e) {
		if (!this.hass) return;
		let t = this.getEntityState(e), n = Oe(e), r = J(t?.state) ? "turn_off" : "turn_on";
		await this.hass.callService(n, r, { entity_id: e });
	}
	async toggleZone(e) {
		if (!this.hass) return;
		let t = J(this.getEntityState(e.entity)?.state);
		if (e.tap_action ? await Ae(this.hass, e.tap_action) : await this.toggleEntity(e.entity), t) {
			let t = { ...this.timers };
			delete t[e.entity], this.timers = t, X(e.entity);
		} else {
			let t = e.duration ?? this.config.default_duration ?? 10;
			this.timers = {
				...this.timers,
				[e.entity]: t * 60
			}, Me(e.entity, t);
		}
	}
	async stopAll() {
		if (this.hass) {
			if (this.config.stop_action) await Ae(this.hass, this.config.stop_action);
			else for (let e of this.config.zones) {
				let t = Oe(e.entity);
				await this.hass.callService(t, "turn_off", { entity_id: e.entity });
			}
			for (let e of this.config.zones) X(e.entity);
			this.timers = {};
		}
	}
	get showTimer() {
		let e = this.config.layout?.show_timer;
		return e === void 0 ? this.config.show_timer ?? !0 : e;
	}
	get showStatus() {
		return this.config.layout?.show_status ?? !0;
	}
	get columnCount() {
		let e = this.config.layout?.columns ?? 4;
		return e < 1 || e > 6 ? (console.warn(`Rachio Irrigation Card: layout.columns ${e} out of range [1,6]; falling back to 4.`), 4) : e;
	}
	get actionColumnCount() {
		let e = 1;
		return this.config.rain_delay_entity && e++, this.config.standby_entity && e++, e;
	}
	renderLayoutVars() {
		return `--zone-columns: ${this.columnCount}; --action-columns: ${this.actionColumnCount};`;
	}
	getActiveZone() {
		if (!this.config) return null;
		for (let e of this.config.zones) {
			let t = this.timers[e.entity];
			if (t && t > 0) return {
				zone: e,
				remaining: t,
				total: (e.duration ?? this.config.default_duration ?? 10) * 60
			};
		}
		return null;
	}
	getZoneLabel(e, t) {
		return e.name || this.getEntityState(e.entity)?.attributes?.friendly_name || `Zone ${t + 1}`;
	}
	scheduleLabel(e) {
		let t = e?.attributes?.friendly_name || "";
		if (!t) return "";
		let n = t.indexOf(" ");
		return n === -1 ? t : t.substring(0, n).includes("-") ? t.substring(n + 1) : t;
	}
	get showHeader() {
		return this.config.show_header ?? !0;
	}
	get showConnectionStatus() {
		return this.config.show_connection_status ?? !0;
	}
	get showSchedules() {
		return this.config.show_schedules ?? !0;
	}
	renderSchedules() {
		if (!this.showSchedules || !this.config.schedules || this.config.schedules.length === 0) return z;
		let e = this.config.schedules.map((e) => ({
			id: e,
			state: this.getEntityState(e)
		})).filter((e) => {
			if (!e.state) return !1;
			let t = e.state.attributes, n = t?.enabled ?? t?.Enabled;
			return n === void 0 ? J(e.state.state) : n === !0;
		});
		return e.length === 0 ? z : L`
      <div class="schedules">
        ${e.map((e) => L`
            <div class="schedule-item">
              <ha-icon icon="mdi:calendar-clock"></ha-icon>
              <span>${this.scheduleLabel(e.state) || e.id}</span>
            </div>
          `)}
      </div>
    `;
	}
	renderWarnings() {
		if (!this.hass) return z;
		let e = [];
		return this.config.rain_delay_entity && !this.getEntityState(this.config.rain_delay_entity) && e.push(this.config.rain_delay_entity), this.config.standby_entity && !this.getEntityState(this.config.standby_entity) && e.push(this.config.standby_entity), e.length === 0 ? z : L`
      <div class="warnings">
        ${e.map((e) => L`<div class="warning">
              Missing entity: <code>${e}</code>
            </div>`)}
      </div>
    `;
	}
	renderRainStatus() {
		let e = this.getEntityState(this.config.rain_delay_entity);
		return L`
      <div class="status-row">
        <div class="status-label">
          <ha-icon icon="mdi:weather-rainy"></ha-icon>
          <span>Rain Detected</span>
        </div>
        <div class="status-value">${e ? J(e.state) ? "Wet" : "Dry" : "Unknown"}</div>
      </div>
    `;
	}
	renderProgress(e) {
		let t = e.total - e.remaining, n = Math.min(100, Math.max(0, Math.round(t / e.total * 100))), r = this.config.zones.indexOf(e.zone);
		return L`
      <div class="progress-section">
        <div class="progress-header">
          <span class="progress-zone">${this.getZoneLabel(e.zone, r)} Running</span>
          <span class="progress-time">${ke(t)} / ${ke(e.total)}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${n}%"></div>
        </div>
      </div>
    `;
	}
	renderZone(e, t) {
		let n = !this.getEntityState(e.entity), r = this.timers[e.entity], i = !!r && r > 0, a = this.getZoneLabel(e, t), o = e.location || "", s = e.icon || "mdi:sprinkler";
		return L`
      <button
        class=${i ? "zone-button active" : "zone-button"}
        ?disabled=${n}
        @click=${() => this.toggleZone(e)}
      >
        <ha-icon icon=${s} class="zone-icon"></ha-icon>
        <span class="zone-name">${a}</span>
        ${o ? L`<span class="zone-location">${o}</span>` : z}
        ${this.showStatus ? L`<span class="zone-status">${n ? "Missing" : i ? "On" : "Off"}</span>` : z}
      </button>
    `;
	}
	renderRainDelayButton() {
		let e = this.getEntityState(this.config.rain_delay_entity), t = J(e?.state);
		return L`
      <button
        class="action-button"
        @click=${() => this.toggleEntity(this.config.rain_delay_entity)}
      >
        <ha-icon icon="mdi:weather-rainy" class="action-icon"></ha-icon>
        <span class="action-name">Rain Delay</span>
        <span class="action-status">${e ? t ? "Active" : "Off" : "Unknown"}</span>
      </button>
    `;
	}
	renderStandbyButton() {
		let e = this.getEntityState(this.config.standby_entity), t = J(e?.state);
		return L`
      <button
        class="action-button"
        @click=${() => this.toggleEntity(this.config.standby_entity)}
      >
        <ha-icon icon="mdi:sleep" class="action-icon"></ha-icon>
        <span class="action-name">Standby</span>
        <span class="action-status">${e ? t ? "Active" : "Off" : "Unknown"}</span>
      </button>
    `;
	}
	renderStopButton() {
		return L`
      <button class="action-button stop" @click=${this.stopAll}>
        <ha-icon icon="mdi:stop" class="action-icon"></ha-icon>
        <span class="action-name">Stop</span>
        <span class="action-status">Watering</span>
      </button>
    `;
	}
	render() {
		if (!this.config) return z;
		let e = this.getActiveZone();
		return L`
      <ha-card>
        <div
          class=${this.config.layout?.compact ? "quick-run-card compact" : "quick-run-card"}
          style=${this.renderLayoutVars()}
        >
          ${this.showHeader ? L`
                <div class="quick-run-header">
                  <div class="header-main">
                    <div class="title">
                      ${this.config.header_icon ? L`<ha-icon icon=${this.config.header_icon}></ha-icon>` : z}
                      <span>${this.config.title}</span>
                    </div>
                    ${this.config.header_subtitle ? L`<div class="subtitle">${this.config.header_subtitle}</div>` : z}
                  </div>
                  ${this.showConnectionStatus ? L`
                        <div class="connection-status">
                          <ha-icon icon="mdi:check-circle"></ha-icon>
                          <span>Connected</span>
                        </div>
                      ` : z}
                </div>
                <div class="divider"></div>
              ` : z}

          ${this.renderSchedules()}

          ${this.config.rain_delay_entity ? this.renderRainStatus() : z}

          ${this.showTimer && e ? this.renderProgress(e) : z}

          ${this.renderWarnings()}

          <div class="zone-grid">
            ${this.config.zones.map((e, t) => this.renderZone(e, t))}
          </div>

          <div class="action-grid">
            ${this.config.rain_delay_entity ? this.renderRainDelayButton() : z}
            ${this.config.standby_entity ? this.renderStandbyButton() : z}
            ${this.renderStopButton()}
          </div>
        </div>
      </ha-card>
    `;
	}
	static {
		this.styles = [Pe];
	}
};
customElements.define("rachio-irrigation-card", tt), window.customCards = window.customCards || [], window.customCards.push({
	type: "rachio-irrigation-card",
	name: "Rachio Irrigation Card",
	description: "A compact irrigation dashboard card for Rachio-style zone control.",
	preview: !0,
	documentationURL: "https://github.com/jpitty03/rachio-irrigation-card/blob/main/README.md"
});
//#endregion
