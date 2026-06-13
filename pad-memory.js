/* ════════════════════════════════════════════════════════════════════════
   pad-memory.js — Account-ready persistent user memory for The Lantern Road.

   ONE save/load layer for ALL durable user state (inventory, world/progress,
   kitchen consumables, music prefs). Everything that should survive a reload
   or a revisit goes through window.PadMemory.

   ── ACCOUNT-READY DESIGN ────────────────────────────────────────────────
   Storage is isolated behind a small adapter (getItem / setItem / removeItem).
   Today that adapter is LocalAdapter → device-local localStorage (no login).

   To add MULTI-USER ACCOUNTS later (the next roadmap phase), implement the
   same three methods against your backend, keyed by the signed-in user id,
   and assign it once at boot:

       PadMemory.adapter = CloudAdapter;   // before PadMemory.load()

   No other code in the app changes — every component already reads/writes
   through PadMemory. (The adapter interface is intentionally promise-friendly:
   methods may return a value OR a Promise; see loadAsync().)
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 1;
  var KEY = 'lrp:user-memory:v1';

  // ── Default device-local adapter (swap for a CloudAdapter to add accounts) ──
  var LocalAdapter = {
    getItem:    function (k) { try { return localStorage.getItem(k); }  catch (e) { return null; } },
    setItem:    function (k, v) { try { localStorage.setItem(k, v); }   catch (e) {} },
    removeItem: function (k) { try { localStorage.removeItem(k); }      catch (e) {} }
  };

  // ── Canonical shape of all persisted state ──
  function defaults() {
    return {
      version: VERSION,
      inventory: [],          // [{ id, name, icon, type }] — everything collected
      world: {
        fireLevel:    1,      // 1..4   (4 = wall ignition)
        lightLevel:   3,      // 1..5
        channel:      0,      // atmosphere channel index
        keyCollected: false,  // the desk key has been taken
        lanternTaps:  0,      // 0..3   (3 reveals the d-pad)
        dpadRevealed: false   // sticky once the lantern has been touched 3×
      },
      kitchen: {
        foods:   {},          // { apple:false, ... }  (absent/true = present, false = taken)
        pantry:  {},          // { flour:false, ... }
        crystal: 'dusty'      // 'dusty' | 'clean' | 'gone'
      },
      music: {
        lastTrackId: null,    // id of the last track played (tracks themselves live in IndexedDB)
        musicVol:    null,    // null = use engine default
        wallVol:     null
      },
      updatedAt: 0
    };
  }

  // ── Deep merge stored state over defaults so new fields are forward-safe ──
  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }
  function merge(base, over) {
    if (!isObj(base) || !isObj(over)) return over === undefined ? base : over;
    var out = {}, k;
    for (k in base) out[k] = base[k];
    for (k in over) out[k] = (isObj(base[k]) && isObj(over[k])) ? merge(base[k], over[k]) : over[k];
    return out;
  }

  var subs = [];

  var PadMemory = {
    VERSION: VERSION,
    KEY: KEY,
    adapter: LocalAdapter,
    state: defaults(),
    ready: false,

    // Synchronous load (works with the localStorage adapter). Returns state.
    load: function () {
      var raw = null;
      try { raw = this.adapter.getItem(KEY); } catch (e) { raw = null; }
      // If an adapter returns a Promise (cloud), fall back to defaults now and
      // let loadAsync() hydrate + notify when it resolves.
      if (raw && typeof raw.then === 'function') { this.loadAsync(); return this.state; }
      if (raw) { try { this.state = merge(defaults(), JSON.parse(raw)); } catch (e) {} }
      this.ready = true;
      return this.state;
    },

    // Promise-based load for async (cloud) adapters.
    loadAsync: function () {
      var self = this;
      return Promise.resolve(this.adapter.getItem(KEY)).then(function (raw) {
        if (raw) { try { self.state = merge(defaults(), JSON.parse(raw)); } catch (e) {} }
        self.ready = true;
        self.notify();
        return self.state;
      });
    },

    save: function () {
      this.state.updatedAt = Date.now();
      try { this.adapter.setItem(KEY, JSON.stringify(this.state)); } catch (e) {}
      this.notify();
      return this.state;
    },

    // Dot-path getter: PadMemory.get('world.fireLevel', 1)
    get: function (path, fallback) {
      var v = this.state, parts = String(path).split('.'), i;
      for (i = 0; i < parts.length; i++) { if (v == null) return fallback; v = v[parts[i]]; }
      return v === undefined ? fallback : v;
    },

    // Dot-path setter + save: PadMemory.set('world.fireLevel', 3)
    set: function (path, value) {
      var parts = String(path).split('.'), o = this.state, i;
      for (i = 0; i < parts.length - 1; i++) {
        if (!isObj(o[parts[i]])) o[parts[i]] = {};
        o = o[parts[i]];
      }
      o[parts[parts.length - 1]] = value;
      return this.save();
    },

    // Mutate the whole state in a callback, then save once.
    update: function (fn) { fn(this.state); return this.save(); },

    // Wipe everything back to a fresh start.
    reset: function () {
      this.state = defaults();
      try { this.adapter.removeItem(KEY); } catch (e) {}
      this.notify();
      return this.state;
    },

    subscribe: function (fn) {
      subs.push(fn);
      return function () { var i = subs.indexOf(fn); if (i >= 0) subs.splice(i, 1); };
    },

    notify: function () {
      for (var i = 0; i < subs.length; i++) { try { subs[i](this.state); } catch (e) {} }
    }
  };

  // Hydrate immediately so components can read PadMemory.state on first render.
  PadMemory.load();

  window.PadMemory = PadMemory;
})();
