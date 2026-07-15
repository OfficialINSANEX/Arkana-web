// ---------- Animated Comet Border (SVG path-length based) ----------
(function () {
  const STROKE_WIDTH   = 1.6;
  const NUM_SLICES     = 36;
  const TRAIL_FRACTION = 0.30;
  const OVERLAP        = 1.5;
  const GLOW_BLUR      = 3.2;

  const SVG_NS = "http://www.w3.org/2000/svg";

  function buildRoundedRectPath(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    return [
      `M ${x + r},${y}`,
      `H ${x + w - r}`,
      `A ${r},${r} 0 0 1 ${x + w},${y + r}`,
      `V ${y + h - r}`,
      `A ${r},${r} 0 0 1 ${x + w - r},${y + h}`,
      `H ${x + r}`,
      `A ${r},${r} 0 0 1 ${x},${y + h - r}`,
      `V ${y + r}`,
      `A ${r},${r} 0 0 1 ${x + r},${y}`,
      "Z"
    ].join(" ");
  }

  class CometBorder {
    constructor(card) {
      this.card = card;
      const dur = parseFloat(getComputedStyle(card).getPropertyValue("--runner-duration"));
      this.duration = (dur || 3) * 1000;
      this._buildDom();
      this._layout();
      this._start = performance.now() + Math.random() * this.duration;
      this._raf = requestAnimationFrame(this._tick.bind(this));
    }

    _buildDom() {
      const svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("preserveAspectRatio", "none");

      // style svg so it doesn't affect layout and sits outside the card bounds
      svg.setAttribute("class", "runner-svg");
      svg.style.position = "absolute";
      svg.style.inset = "-8px";
      svg.style.width = "calc(100% + 16px)";
      svg.style.height = "calc(100% + 16px)";
      svg.style.pointerEvents = "none";
      svg.style.overflow = "visible";
      svg.style.zIndex = "0";

      const defs = document.createElementNS(SVG_NS, "defs");
      const filter = document.createElementNS(SVG_NS, "filter");
      const filterId = "comet-glow-" + Math.random().toString(36).slice(2, 9);
      filter.setAttribute("id", filterId);
      filter.setAttribute("x", "-50%");
      filter.setAttribute("y", "-50%");
      filter.setAttribute("width", "200%");
      filter.setAttribute("height", "200%");
      const blur = document.createElementNS(SVG_NS, "feGaussianBlur");
      blur.setAttribute("stdDeviation", GLOW_BLUR);
      filter.appendChild(blur);
      defs.appendChild(filter);
      svg.appendChild(defs);

      // track path (subtle)
      this.trackPath = document.createElementNS(SVG_NS, "path");
      this.trackPath.setAttribute("fill", "none");
      this.trackPath.setAttribute("stroke", "rgba(255,255,255,0.05)");
      this.trackPath.setAttribute("stroke-width", STROKE_WIDTH);
      svg.appendChild(this.trackPath);

      // glow group
      this.glowGroup = document.createElementNS(SVG_NS, "g");
      this.glowGroup.setAttribute("filter", `url(#${filterId})`);
      this.glowGroup.setAttribute("opacity", "0.9");
      svg.appendChild(this.glowGroup);

      // sharp group
      this.sharpGroup = document.createElementNS(SVG_NS, "g");
      svg.appendChild(this.sharpGroup);

      this.slices = [];
      this.glowSlices = [];
      for (let i = 0; i < NUM_SLICES; i++) {
        const t = i / (NUM_SLICES - 1);
        const opacity = Math.pow(1 - t, 2.2);

        const p = document.createElementNS(SVG_NS, "path");
        p.setAttribute("fill", "none");
        p.setAttribute("stroke", "#fff");
        p.setAttribute("stroke-width", STROKE_WIDTH);
        p.setAttribute("stroke-linecap", "round");
        p.setAttribute("opacity", opacity.toFixed(3));
        this.sharpGroup.appendChild(p);
        this.slices.push(p);

        if (t < 0.55) {
          const g = document.createElementNS(SVG_NS, "path");
          g.setAttribute("fill", "none");
          g.setAttribute("stroke", "#fff");
          g.setAttribute("stroke-width", STROKE_WIDTH * 2.2);
          g.setAttribute("stroke-linecap", "round");
          g.setAttribute("opacity", (opacity * 0.7).toFixed(3));
          this.glowGroup.appendChild(g);
          this.glowSlices.push(g);
        }
      }

      // head dot and glow
      this.headDot = document.createElementNS(SVG_NS, "circle");
      this.headDot.setAttribute("r", STROKE_WIDTH * 1.1);
      this.headDot.setAttribute("fill", "#fff");
      this.sharpGroup.appendChild(this.headDot);

      const headGlow = document.createElementNS(SVG_NS, "circle");
      headGlow.setAttribute("r", STROKE_WIDTH * 2.4);
      headGlow.setAttribute("fill", "#fff");
      headGlow.setAttribute("opacity", "0.8");
      this.glowGroup.appendChild(headGlow);
      this.headGlow = headGlow;

      this.svg = svg;

      // insert svg as first child so it sits behind content and outside bounds
      this.card.insertBefore(svg, this.card.firstChild);
    }

    _layout() {
      const w = this.card.offsetWidth;
      const h = this.card.offsetHeight;
      const pad = 8; // matches inset used above
      const vbW = w + pad * 2;
      const vbH = h + pad * 2;
      this.svg.setAttribute("viewBox", `0 0 ${vbW} ${vbH}`);
      this.svg.setAttribute("width", vbW);
      this.svg.setAttribute("height", vbH);

      const radius = parseFloat(getComputedStyle(this.card).borderRadius) || 14;
      const half = STROKE_WIDTH / 2;
      const x = pad + half;
      const y = pad + half;
      const rw = w - STROKE_WIDTH;
      const rh = h - STROKE_WIDTH;

      const d = buildRoundedRectPath(x, y, rw, rh, radius);
      this.trackPath.setAttribute("d", d);
      this.slices.forEach(p => p.setAttribute("d", d));
      this.glowSlices.forEach(p => p.setAttribute("d", d));

      this.pathRef = this.slices[0];
      this.pathLen = this.pathRef.getTotalLength();
      this.trailLength = this.pathLen * TRAIL_FRACTION;
      this.sliceLength = (this.trailLength / NUM_SLICES) * OVERLAP;
    }

    _setDash(el, dist) {
      let d = dist % this.pathLen;
      if (d < 0) d += this.pathLen;
      el.setAttribute("stroke-dasharray", `${this.sliceLength.toFixed(2)} ${(this.pathLen - this.sliceLength).toFixed(2)}`);
      el.setAttribute("stroke-dashoffset", (-d).toFixed(2));
    }

    _tick(now) {
      const elapsed = (now - this._start) % this.duration;
      const progress = elapsed / this.duration;
      const headDistance = progress * this.pathLen;

      this.slices.forEach((p, i) => this._setDash(p, headDistance - i * this.sliceLength));
      this.glowSlices.forEach((p, i) => this._setDash(p, headDistance - i * this.sliceLength));

      const headPoint = this.pathRef.getPointAtLength(headDistance % this.pathLen);
      this.headDot.setAttribute("cx", headPoint.x);
      this.headDot.setAttribute("cy", headPoint.y);
      this.headGlow.setAttribute("cx", headPoint.x);
      this.headGlow.setAttribute("cy", headPoint.y);

      this._raf = requestAnimationFrame(this._tick.bind(this));
    }

    relayout() { this._layout(); }
    destroy() { cancelAnimationFrame(this._raf); this.svg.remove(); }
  }

  function init() {
    const instances = Array.from(document.querySelectorAll(".pricingCard")).map(c => new CometBorder(c));
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => instances.forEach(i => i.relayout()), 150);
    });
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
