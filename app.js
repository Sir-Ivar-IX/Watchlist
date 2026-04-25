(() => {
      const STORAGE_KEY = "watchlist-nexus-standalone-v2";
      const app = document.getElementById("app");
      const themeChoices = [
        { value: "mcu", label: "MCU" },
        { value: "spider", label: "Spider-Man" },
        { value: "xmen", label: "X-Men" },
        { value: "series", label: "Cosmic" }
      ];
      const clickStyleChoices = [
        { value: "soft", label: "Soft" },
        { value: "digital", label: "Digital" },
        { value: "arcade", label: "Arcade" },
        { value: "crystal", label: "Crystal" }
      ];
      const musicTrackChoices = [
        { value: "nebula", label: "Nebula" },
        { value: "aurora", label: "Aurora" },
        { value: "nocturne", label: "Nocturne" },
        { value: "multiverse", label: "Multiverse" }
      ];
      const FIREBASE_APP_MODULE_SRC = "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
      const FIREBASE_AUTH_MODULE_SRC = "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
      const FIREBASE_FIRESTORE_MODULE_SRC = "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
      const mobilePerfQuery = typeof window.matchMedia === "function"
        ? window.matchMedia("(hover: none), (pointer: coarse), (max-width: 820px)")
        : { matches: false };
      const homeScheduleSections = [
        {
          title: "FASE 1-3",
          subtitle: "Infinity Saga",
          weeks: [
            { title: "Settimana 1 (4-10 maggio)", entries: [{ title: "Iron Man" }, { title: "The Incredible Hulk" }] },
            { title: "Settimana 2", entries: [{ title: "Iron Man 2" }, { title: "Thor" }] },
            { title: "Settimana 3", entries: [{ title: "Captain America: The First Avenger" }, { title: "The Avengers" }] },
            { title: "Settimana 4", entries: [{ title: "Iron Man 3" }, { title: "X-Men" }] },
            { title: "Settimana 5", entries: [{ title: "Thor: The Dark World" }, { title: "X2: X-Men United" }] },
            { title: "Settimana 6", entries: [{ title: "Captain America: The Winter Soldier" }, { title: "Guardians of the Galaxy" }] },
            { title: "Settimana 7", entries: [{ title: "Avengers: Age of Ultron" }, { title: "X-Men: Days of Future Past" }] },
            { title: "Settimana 8", entries: [{ title: "Ant-Man" }, { title: "Captain America: Civil War" }] },
            { title: "Settimana 9", entries: [{ title: "Doctor Strange" }, { title: "Guardians of the Galaxy Vol. 2" }] },
            { title: "Settimana 10", entries: [{ title: "Spider-Man: Homecoming" }, { title: "Thor: Ragnarok" }] },
            { title: "Settimana 11", entries: [{ title: "Black Panther" }, { title: "Avengers: Infinity War" }] },
            { title: "Settimana 12", entries: [{ title: "Ant-Man and the Wasp" }, { title: "Captain Marvel" }] },
            { title: "Settimana 13 (Leggera)", note: "Recupero o digestione Infinity Saga." }
          ]
        },
        {
          title: "EVENTO ENDGAME",
          subtitle: "Settimane 14-15",
          weeks: [
            { title: "Settimana 14 (21-27 settembre)", entries: [{ title: "Preparazione o recap Infinity War" }, { day: "25 settembre", title: "Avengers: Endgame", note: "Re-release cinema." }] },
            { title: "Settimana 15 (Post-evento)", entries: [{ title: "Spider-Man: Far From Home" }, { title: "WandaVision Ep. 1-3", matchTitle: "WandaVision" }] }
          ]
        },
        {
          title: "FASE 4",
          subtitle: "Multiverso + Serie",
          weeks: [
            { title: "Settimana 16", entries: [{ title: "Black Widow" }, { title: "WandaVision Ep. 4-6", matchTitle: "WandaVision" }] },
            { title: "Settimana 17", entries: [{ title: "The Falcon and the Winter Soldier", matchTitle: "The Falcon and the Winter Soldier", note: "1 episodio al giorno." }] },
            { title: "Settimana 18", entries: [{ title: "Shang-Chi" }, { title: "Eternals" }] },
            { title: "Settimana 19", entries: [{ title: "Loki", matchTitle: "Loki" }] },
            { title: "Settimana 20", entries: [{ title: "Spider-Man: No Way Home" }, { title: "Doctor Strange in the Multiverse of Madness" }] },
            { title: "Settimana 21", entries: [{ title: "Loki", matchTitle: "Loki" }] }
          ]
        },
        {
          title: "DEADPOOL / X-MEN BRANCH",
          subtitle: "Ramo finale mutante",
          weeks: [
            { title: "Settimana 22", entries: [{ title: "Black Panther: Wakanda Forever" }, { title: "Deadpool" }] },
            { title: "Settimana 23", entries: [{ title: "Deadpool 2" }, { title: "Ant-Man and the Wasp: Quantumania", note: "Opzionale." }] },
            { title: "Settimana 24", entries: [{ title: "Guardians of the Galaxy Vol. 3" }, { title: "Logan" }] },
            { title: "Settimana 25", entries: [{ title: "Captain America: Brave New World" }, { title: "Deadpool & Wolverine" }] },
            { title: "Settimana 26", entries: [{ title: "Thunderbolts", matchTitle: "Thunderbolts*" }, { title: "Fantastic Four: First Steps" }] },
            { title: "Settimana 27 (Leggera)", note: "Recap multiverso completo." }
          ]
        },
        {
          title: "FINALE",
          subtitle: "Build-up finale",
          weeks: [
            { title: "Settimana 28-29", note: "Build-up finale e preparazione Doomsday." },
            { title: "Settimana 30 (11-17 dicembre)", note: "Hype finale e chiusura narrativa." },
            { title: "18 dicembre", entries: [{ day: "18 dicembre", title: "Avengers: Doomsday", note: "Evento finale." }] }
          ]
        }
      ];
      const clickStyleValues = new Set(clickStyleChoices.map((choice) => choice.value));
      const musicTrackValues = new Set(musicTrackChoices.map((choice) => choice.value));
      let entriesCache = { rootsRef: null, entries: [] };
      let allStatsCache = { rootsRef: null, value: { total: 0, seen: 0 } };
      let topRatedCache = { rootsRef: null, limit: 0, value: [] };
      let entryLookupCache = { rootsRef: null, value: new Map() };
      let searchCache = { rootsRef: null, query: "", value: [] };
      let lastPersistedStateJson = "";

      const uid = () => (window.crypto && crypto.randomUUID ? crypto.randomUUID() : "id-" + Math.random().toString(36).slice(2, 10));
      const clone = (value) => JSON.parse(JSON.stringify(value));
      const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
      const clampNumber = (value, min, max, fallback) => {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return fallback;
        return Math.max(min, Math.min(max, numeric));
      };
      const isHostedForGoogle = typeof window !== "undefined" && /^https?:$/.test(window.location.protocol) && window.location.protocol !== "file:";
      const normalizeLookupTitle = (value) => String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
      const lookupAliasGroups = [
        ["Shang-Chi", "Shang-Chi and the Legend of the Ten Rings", "Shang-Chi e la leggenda dei dieci anelli"],
        ["Fantastic Four", "Fantastic Four: First Steps", "Fantastic Four First Steps", "F4"],
        ["Thunderbolts", "Thunderbolts*"],
        ["The Falcon and the Winter Soldier", "The Falcon And The Winter Soldier"],
        ["Deadpool 3", "Deadpool & Wolverine"]
      ];
      const lookupAliases = (() => {
        const map = new Map();
        lookupAliasGroups.forEach((group) => {
          const variants = [...new Set(group.map((title) => normalizeLookupTitle(title)).filter(Boolean))];
          variants.forEach((variant) => map.set(variant, variants));
        });
        return map;
      })();
      const getLookupVariants = (value) => {
        const base = normalizeLookupTitle(value);
        if (!base) return [];
        const aliases = lookupAliases.get(base);
        return aliases ? [...new Set([base, ...aliases])] : [base];
      };
      function createDefaultProfile() {
        return {
          provider: "",
          sub: "",
          name: "",
          email: "",
          picture: "",
          nickname: "",
          showEmail: true
        };
      }
      function createDefaultFirebaseConfig() {
        return {
          apiKey: "AIzaSyBTkemo1VltVUYfGeb4n-cIlbM_qHSm9Ug",
          authDomain: "watchlist-af5b8.firebaseapp.com",
          projectId: "watchlist-af5b8",
          appId: "1:311135933871:web:bf4100c4a763aa4b234b5a",
          storageBucket: "watchlist-af5b8.firebasestorage.app",
          messagingSenderId: "311135933871",
          measurementId: ""
        };
      }
      function normalizeFirebaseConfig(source, fallback) {
        const base = fallback || createDefaultFirebaseConfig();
        return {
          apiKey: source && source.apiKey ? String(source.apiKey).trim() : base.apiKey,
          authDomain: source && source.authDomain ? String(source.authDomain).trim() : base.authDomain,
          projectId: source && source.projectId ? String(source.projectId).trim() : base.projectId,
          appId: source && source.appId ? String(source.appId).trim() : base.appId,
          storageBucket: source && source.storageBucket ? String(source.storageBucket).trim() : base.storageBucket,
          messagingSenderId: source && source.messagingSenderId ? String(source.messagingSenderId).trim() : base.messagingSenderId,
          measurementId: source && source.measurementId ? String(source.measurementId).trim() : base.measurementId
        };
      }
      function hasFirebaseConfig(config = null) {
        const target = normalizeFirebaseConfig(config || (typeof state !== "undefined" ? state.firebaseConfig : null), createDefaultFirebaseConfig());
        return Boolean(target.apiKey && target.authDomain && target.projectId && target.appId);
      }
      function serializeFirebaseConfig(config = null) {
        const target = normalizeFirebaseConfig(config || (typeof state !== "undefined" ? state.firebaseConfig : null), createDefaultFirebaseConfig());
        const compact = {};
        ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId", "measurementId"].forEach((key) => {
          if (target[key]) compact[key] = target[key];
        });
        return Object.keys(compact).length ? JSON.stringify(compact, null, 2) : "";
      }
      function parseFirebaseConfigText(text) {
        const raw = String(text || "").trim();
        if (!raw) return createDefaultFirebaseConfig();
        const stripped = raw
          .replace(/^(?:const|let|var)\s+firebaseConfig\s*=\s*/i, "")
          .replace(/;\s*$/, "")
          .trim();
        let parsed;
        try {
          parsed = JSON.parse(stripped);
        } catch (jsonError) {
          try {
            parsed = Function(`"use strict"; return (${stripped});`)();
          } catch (scriptError) {
            throw new Error("La configurazione Firebase non e valida. Incolla l'oggetto firebaseConfig preso dalla console Firebase.");
          }
        }
        return normalizeFirebaseConfig(parsed, createDefaultFirebaseConfig());
      }
      function normalizeProfile(source, fallback) {
        const base = fallback || createDefaultProfile();
        return {
          provider: source && source.provider ? String(source.provider) : base.provider,
          sub: source && source.sub ? String(source.sub) : base.sub,
          name: source && source.name ? String(source.name) : base.name,
          email: source && source.email ? String(source.email) : base.email,
          picture: source && source.picture ? String(source.picture) : base.picture,
          nickname: source && source.nickname ? String(source.nickname) : base.nickname,
          showEmail: source && Object.prototype.hasOwnProperty.call(source, "showEmail") ? Boolean(source.showEmail) : base.showEmail
        };
      }
      function hasGoogleProfile(profile = null) {
        const target = profile || (typeof state !== "undefined" ? state.profile : null);
        return Boolean(target && target.provider === "google" && target.sub);
      }
      function getProfileDisplayName(profile = null, nicknameOverride = null) {
        const target = profile || (typeof state !== "undefined" ? state.profile : createDefaultProfile());
        const custom = typeof nicknameOverride === "string" ? nicknameOverride.trim() : String(target.nickname || "").trim();
        return custom || String(target.name || "").trim() || "Profilo";
      }
      function getProfileInitials(profile = null, nicknameOverride = null) {
        const displayName = getProfileDisplayName(profile, nicknameOverride);
        const parts = displayName.split(/\s+/).filter(Boolean).slice(0, 2);
        return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "P";
      }
      function getProfileSecondary(profile = null, showEmailOverride = null) {
        const target = profile || (typeof state !== "undefined" ? state.profile : createDefaultProfile());
        const showEmail = typeof showEmailOverride === "boolean" ? showEmailOverride : Boolean(target.showEmail);
        if (hasGoogleProfile(target)) {
          if (showEmail && target.email) return target.email;
          return "Connesso con Google";
        }
        return "Accedi con Google per creare il profilo online";
      }
      function normalizeItemBg(bg) {
        if (!bg || typeof bg !== "object") return null;
        const dataUrl = typeof bg.dataUrl === "string" ? bg.dataUrl : "";
        if (!dataUrl) return null;
        return {
          dataUrl,
          x: clampNumber(bg.x, 0, 100, 82),
          y: clampNumber(bg.y, 0, 100, 50),
          fade: clampNumber(bg.fade, 30, 85, 56)
        };
      }
      function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.onerror = () => reject(new Error("Impossibile leggere il file."));
          reader.readAsDataURL(file);
        });
      }
      function downscaleDataUrl(dataUrl, maxSide = 1280) {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const width = img.naturalWidth || img.width || 1;
            const height = img.naturalHeight || img.height || 1;
            const scale = Math.min(1, maxSide / Math.max(width, height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(width * scale));
            canvas.height = Math.max(1, Math.round(height * scale));
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(dataUrl);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            try {
              resolve(canvas.toDataURL("image/jpeg", 0.84));
            } catch (error) {
              resolve(dataUrl);
            }
          };
          img.onerror = () => resolve(dataUrl);
          img.src = dataUrl;
        });
      }
      function fileToOptimizedDataUrl(file) {
        const maxSide = mobilePerfQuery.matches ? 960 : 1280;
        return fileToDataUrl(file).then((dataUrl) => downscaleDataUrl(dataUrl, maxSide));
      }
      function createDefaultGlows() {
        return {
          background: { a: "#38bdf8", b: "#ef4444", c: "#d946ef", d: "#22d3ee" },
          spider: { a: "#ef4444", b: "#fb7185" },
          mcu: { a: "#38bdf8", b: "#22d3ee" },
          xmen: { a: "#60a5fa", b: "#f43f5e" },
          series: { a: "#d946ef", b: "#38bdf8" }
        };
      }
      function createDefaultGlowTuning() {
        return {
          background: { speed: 1, strength: 1 },
          spider: { speed: 1, strength: 1 },
          mcu: { speed: 1, strength: 1 },
          xmen: { speed: 1, strength: 1 },
          series: { speed: 1, strength: 1 }
        };
      }
      function createDefaultAudioSettings() {
        return {
          clickSounds: true,
          clickVolume: 0.42,
          clickStyle: "soft",
          musicEnabled: true,
          musicVolume: 0.2,
          musicTrack: "nebula"
        };
      }
      let audioContext = null;
      let audioDynamics = null;
      let clickBus = null;
      let musicBus = null;
      let musicLoopTimer = null;
      let musicStepIndex = 0;
      let audioEngineRequested = false;
      let clickVariationIndex = 0;
      let currentAudioSettings = createDefaultAudioSettings();
      const musicTrackDefinitions = {
        nebula: {
          progression: [
            [174.61, 220, 261.63],
            [196, 246.94, 293.66],
            [146.83, 220, 293.66],
            [164.81, 207.65, 261.63]
          ],
          interval: 2350,
          bassType: "sine",
          voiceType: "triangle",
          shimmerType: "sine",
          bassFilter: 540,
          voiceFilter: 860,
          bassPeak: 0.05,
          voicePeak: 0.032,
          shimmerRatio: 2,
          shimmerDetune: [-5, 7, -3],
          swell: 0.9,
          tail: 2.8,
          pulsePatterns: [
            [{ offset: .22, ratio: 1.5, gain: .013, duration: .24 }, { offset: .58, ratio: 1.12, gain: .01, duration: .2 }],
            [{ offset: .16, ratio: 2, gain: .014, duration: .18 }, { offset: .42, ratio: 1.34, gain: .011, duration: .22 }, { offset: .76, ratio: 1.06, gain: .009, duration: .24 }],
            [{ offset: .3, ratio: 1.78, gain: .012, duration: .21 }],
            [{ offset: .12, ratio: 1.26, gain: .011, duration: .16 }, { offset: .5, ratio: 1.9, gain: .013, duration: .2 }, { offset: .84, ratio: 1.42, gain: .009, duration: .18 }]
          ]
        },
        aurora: {
          progression: [
            [196, 246.94, 329.63],
            [220, 277.18, 349.23],
            [174.61, 233.08, 311.13],
            [196, 261.63, 329.63]
          ],
          interval: 1880,
          bassType: "triangle",
          voiceType: "sine",
          shimmerType: "triangle",
          bassFilter: 620,
          voiceFilter: 980,
          bassPeak: 0.04,
          voicePeak: 0.028,
          shimmerRatio: 1.6,
          shimmerDetune: [8, 12, -4],
          swell: 0.62,
          tail: 2.15,
          pulsePatterns: [
            [{ offset: .1, ratio: 1.22, gain: .013, duration: .14 }, { offset: .28, ratio: 1.52, gain: .015, duration: .15 }, { offset: .54, ratio: 1.88, gain: .012, duration: .18 }],
            [{ offset: .18, ratio: 1.32, gain: .012, duration: .12 }, { offset: .38, ratio: 1.7, gain: .014, duration: .16 }, { offset: .66, ratio: 2.04, gain: .011, duration: .17 }],
            [{ offset: .12, ratio: 1.46, gain: .013, duration: .15 }, { offset: .34, ratio: 1.16, gain: .01, duration: .14 }, { offset: .58, ratio: 1.92, gain: .012, duration: .2 }],
            [{ offset: .16, ratio: 1.24, gain: .012, duration: .13 }, { offset: .46, ratio: 1.8, gain: .014, duration: .19 }]
          ]
        },
        nocturne: {
          progression: [
            [130.81, 196, 246.94],
            [146.83, 220, 261.63],
            [155.56, 207.65, 246.94],
            [146.83, 196, 233.08]
          ],
          interval: 2840,
          bassType: "sine",
          voiceType: "sine",
          shimmerType: "triangle",
          bassFilter: 460,
          voiceFilter: 720,
          bassPeak: 0.052,
          voicePeak: 0.024,
          shimmerRatio: 1.18,
          shimmerDetune: [-10, 3, -2],
          swell: 1.08,
          tail: 3.2,
          pulsePatterns: [
            [{ offset: .44, ratio: 1.24, gain: .009, duration: .24 }],
            [{ offset: .32, ratio: 1.38, gain: .01, duration: .22 }, { offset: .92, ratio: 1.08, gain: .008, duration: .18 }],
            [{ offset: .52, ratio: 1.28, gain: .009, duration: .24 }],
            [{ offset: .26, ratio: 1.16, gain: .008, duration: .17 }, { offset: .74, ratio: 1.44, gain: .01, duration: .22 }]
          ]
        },
        multiverse: {
          progression: [
            [220, 277.18, 329.63],
            [246.94, 311.13, 369.99],
            [207.65, 261.63, 329.63],
            [196, 293.66, 349.23]
          ],
          interval: 1720,
          bassType: "triangle",
          voiceType: "triangle",
          shimmerType: "sine",
          bassFilter: 700,
          voiceFilter: 1120,
          bassPeak: 0.041,
          voicePeak: 0.031,
          shimmerRatio: 2.35,
          shimmerDetune: [-12, 9, 5],
          swell: 0.54,
          tail: 1.95,
          pulsePatterns: [
            [{ offset: .08, ratio: 1.24, gain: .013, duration: .12 }, { offset: .24, ratio: 1.74, gain: .014, duration: .13 }, { offset: .46, ratio: 2.08, gain: .011, duration: .14 }, { offset: .72, ratio: 1.32, gain: .01, duration: .16 }],
            [{ offset: .14, ratio: 1.42, gain: .012, duration: .1 }, { offset: .3, ratio: 1.88, gain: .013, duration: .14 }, { offset: .56, ratio: 1.18, gain: .01, duration: .12 }, { offset: .82, ratio: 2.18, gain: .011, duration: .15 }],
            [{ offset: .1, ratio: 1.28, gain: .012, duration: .11 }, { offset: .36, ratio: 1.64, gain: .013, duration: .14 }, { offset: .62, ratio: 2.02, gain: .011, duration: .16 }],
            [{ offset: .18, ratio: 1.2, gain: .011, duration: .11 }, { offset: .42, ratio: 1.92, gain: .014, duration: .14 }, { offset: .68, ratio: 1.46, gain: .01, duration: .16 }, { offset: .9, ratio: 2.26, gain: .009, duration: .12 }]
          ]
        }
      };
      const clickStyleDefinitions = {
        soft: {
          variants: [
            { baseType: "triangle", accentType: "sine", baseFrequency: 620, decay: 0.14, gain: 0.16, accentRatio: 1.5, falloff: 0.72 },
            { baseType: "sine", accentType: "triangle", baseFrequency: 560, decay: 0.16, gain: 0.13, accentRatio: 1.84, falloff: 0.78 },
            { baseType: "triangle", accentType: "sine", baseFrequency: 680, decay: 0.12, gain: 0.14, accentRatio: 1.36, falloff: 0.7 },
            { baseType: "sine", accentType: "sine", baseFrequency: 510, decay: 0.18, gain: 0.115, accentRatio: 2.08, falloff: 0.82 }
          ]
        },
        digital: {
          variants: [
            { baseType: "square", accentType: "triangle", baseFrequency: 760, decay: 0.11, gain: 0.13, accentRatio: 1.94, falloff: 0.8 },
            { baseType: "square", accentType: "square", baseFrequency: 840, decay: 0.09, gain: 0.12, accentRatio: 2.18, falloff: 0.83 },
            { baseType: "triangle", accentType: "square", baseFrequency: 710, decay: 0.1, gain: 0.11, accentRatio: 1.72, falloff: 0.79 }
          ]
        },
        arcade: {
          variants: [
            { baseType: "square", accentType: "square", baseFrequency: 980, decay: 0.095, gain: 0.125, accentRatio: 2.2, falloff: 0.77 },
            { baseType: "square", accentType: "triangle", baseFrequency: 1120, decay: 0.085, gain: 0.118, accentRatio: 2.46, falloff: 0.8 },
            { baseType: "triangle", accentType: "square", baseFrequency: 890, decay: 0.1, gain: 0.12, accentRatio: 1.98, falloff: 0.76 }
          ]
        },
        crystal: {
          variants: [
            { baseType: "sine", accentType: "triangle", baseFrequency: 700, decay: 0.18, gain: 0.11, accentRatio: 2.3, falloff: 0.84 },
            { baseType: "sine", accentType: "sine", baseFrequency: 640, decay: 0.2, gain: 0.1, accentRatio: 2.62, falloff: 0.86 },
            { baseType: "triangle", accentType: "sine", baseFrequency: 760, decay: 0.17, gain: 0.108, accentRatio: 2.04, falloff: 0.82 }
          ]
        }
      };

      function getMusicTrackDefinition(trackKey) {
        return musicTrackDefinitions[trackKey] || musicTrackDefinitions.nebula;
      }

      function getClickStyleDefinition(styleKey) {
        return clickStyleDefinitions[styleKey] || clickStyleDefinitions.soft;
      }

      function playTrackPulsePattern(context, track, chord, stepIndex) {
        if (!musicBus || !Array.isArray(track.pulsePatterns)) return;
        const pulses = track.pulsePatterns[stepIndex % track.pulsePatterns.length] || [];
        const root = chord[1] || chord[0];
        pulses.forEach((pulse, pulseIndex) => {
          const osc = context.createOscillator();
          const gain = context.createGain();
          const filter = context.createBiquadFilter();
          const start = context.currentTime + pulse.offset;
          const frequency = root * pulse.ratio;
          osc.type = pulseIndex % 2 === 0 ? "sine" : "triangle";
          osc.frequency.setValueAtTime(frequency, start);
          osc.frequency.exponentialRampToValueAtTime(frequency * 0.92, start + pulse.duration);
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(Math.min(1800, frequency * 2.2), start);
          filter.Q.value = 0.8;
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.linearRampToValueAtTime(pulse.gain, start + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + pulse.duration);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(musicBus);
          osc.start(start);
          osc.stop(start + pulse.duration + 0.03);
        });
      }

      function ensureAudioEngine() {
        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextCtor) return null;
        if (audioContext) return audioContext;
        audioContext = new AudioContextCtor();
        audioDynamics = audioContext.createDynamicsCompressor();
        audioDynamics.threshold.value = -24;
        audioDynamics.knee.value = 22;
        audioDynamics.ratio.value = 4;
        audioDynamics.attack.value = 0.003;
        audioDynamics.release.value = 0.18;
        clickBus = audioContext.createGain();
        musicBus = audioContext.createGain();
        clickBus.gain.value = 0.0001;
        musicBus.gain.value = 0.0001;
        clickBus.connect(audioDynamics);
        musicBus.connect(audioDynamics);
        audioDynamics.connect(audioContext.destination);
        return audioContext;
      }

      function stopAmbientMusicLoop(resetStep = false) {
        if (musicLoopTimer !== null) {
          window.clearTimeout(musicLoopTimer);
          musicLoopTimer = null;
        }
        if (resetStep) musicStepIndex = 0;
      }

      function playAmbientChord(context, stepIndex) {
        if (!musicBus) return;
        const track = getMusicTrackDefinition(currentAudioSettings.musicTrack);
        const chord = track.progression[stepIndex % track.progression.length];
        const start = context.currentTime + 0.04;
        chord.forEach((frequency, index) => {
          const osc = context.createOscillator();
          const shimmer = context.createOscillator();
          const filter = context.createBiquadFilter();
          const gain = context.createGain();
          osc.type = index === 0 ? track.bassType : track.voiceType;
          shimmer.type = track.shimmerType;
          osc.frequency.setValueAtTime(index === 0 ? frequency / 2 : frequency, start);
          shimmer.frequency.setValueAtTime(frequency * (index === 0 ? 1 : track.shimmerRatio), start);
          shimmer.detune.setValueAtTime(track.shimmerDetune[index] || 0, start);
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(index === 0 ? track.bassFilter : track.voiceFilter, start);
          filter.Q.value = 0.4;
          const peak = index === 0 ? track.bassPeak : track.voicePeak;
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.linearRampToValueAtTime(peak, start + track.swell);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + track.tail);
          osc.connect(filter);
          shimmer.connect(filter);
          filter.connect(gain);
          gain.connect(musicBus);
          osc.start(start);
          shimmer.start(start);
          osc.stop(start + track.tail + 0.1);
          shimmer.stop(start + track.tail + 0.1);
        });
        playTrackPulsePattern(context, track, chord, stepIndex);
      }

      function queueAmbientMusic(delay = 120) {
        if (musicLoopTimer !== null || !currentAudioSettings.musicEnabled) return;
        musicLoopTimer = window.setTimeout(() => {
          musicLoopTimer = null;
          runWithAudioContext((context) => {
            if (!currentAudioSettings.musicEnabled) return;
            const track = getMusicTrackDefinition(currentAudioSettings.musicTrack);
            playAmbientChord(context, musicStepIndex);
            musicStepIndex = (musicStepIndex + 1) % 4;
            queueAmbientMusic(track.interval);
          });
        }, delay);
      }

      function startAmbientMusicLoop() {
        if (!currentAudioSettings.musicEnabled) {
          stopAmbientMusicLoop(true);
          return;
        }
        queueAmbientMusic(120);
      }

      function runWithAudioContext(callback) {
        audioEngineRequested = true;
        const context = ensureAudioEngine();
        if (!context) return;
        const finalize = () => {
          if (context.state !== "running") return;
          callback(context);
          if (currentAudioSettings.musicEnabled) startAmbientMusicLoop();
        };
        if (context.state === "running") {
          finalize();
          return;
        }
        context.resume().then(finalize).catch(() => {});
      }

      function applyAudioSettings(source = state) {
        const previousTrack = currentAudioSettings.musicTrack;
        currentAudioSettings = normalizeAudioSettings(source, createDefaultAudioSettings());
        if (!audioContext && !audioEngineRequested) return;
        const context = ensureAudioEngine();
        if (!context || !clickBus || !musicBus) return;
        clickBus.gain.setTargetAtTime(currentAudioSettings.clickSounds ? Math.max(0.0001, currentAudioSettings.clickVolume * 0.7) : 0.0001, context.currentTime, 0.05);
        musicBus.gain.setTargetAtTime(currentAudioSettings.musicEnabled ? Math.max(0.0001, currentAudioSettings.musicVolume * 0.55) : 0.0001, context.currentTime, 0.18);
        if (previousTrack !== currentAudioSettings.musicTrack) stopAmbientMusicLoop(true);
        if (currentAudioSettings.musicEnabled && context.state === "running") startAmbientMusicLoop();
        if (!currentAudioSettings.musicEnabled) stopAmbientMusicLoop(true);
      }

      function unlockAudioPlayback() {
        if (!currentAudioSettings.clickSounds && !currentAudioSettings.musicEnabled) return;
        runWithAudioContext(() => {});
      }

      function playUiClick(kind = "default") {
        if (!currentAudioSettings.clickSounds) {
          unlockAudioPlayback();
          return;
        }
        runWithAudioContext((context) => {
          const style = getClickStyleDefinition(currentAudioSettings.clickStyle);
          const variants = Array.isArray(style.variants) && style.variants.length ? style.variants : [style];
          const variant = variants[clickVariationIndex % variants.length] || variants[0];
          clickVariationIndex += 1;
          const start = context.currentTime + 0.005;
          const osc = context.createOscillator();
          const accent = context.createOscillator();
          const gain = context.createGain();
          osc.type = variant.baseType;
          accent.type = variant.accentType;
          const baseFrequency = kind === "soft" ? variant.baseFrequency * 0.78 : variant.baseFrequency;
          osc.frequency.setValueAtTime(baseFrequency, start);
          osc.frequency.exponentialRampToValueAtTime(baseFrequency * variant.falloff, start + variant.decay);
          accent.frequency.setValueAtTime(baseFrequency * variant.accentRatio, start);
          accent.frequency.exponentialRampToValueAtTime(baseFrequency, start + Math.max(0.06, variant.decay * 0.75));
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.linearRampToValueAtTime(kind === "soft" ? variant.gain * 0.72 : variant.gain, start + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + variant.decay);
          osc.connect(gain);
          accent.connect(gain);
          gain.connect(clickBus);
          osc.start(start);
          accent.start(start);
          osc.stop(start + variant.decay + 0.03);
          accent.stop(start + variant.decay + 0.03);
        });
      }

      const createItem = (title, userAdded = false, note = "") => ({ id: uid(), title, rating: 0, review: "", seen: false, userAdded, note, background: "", bg: null });
      const createGroup = (title, options = {}) => ({
        id: uid(),
        title,
        kind: options.kind || "section",
        theme: options.theme || "mcu",
        systemKey: options.systemKey || null,
        userCreated: Boolean(options.userCreated),
        items: Array.isArray(options.items) ? options.items : [],
        bg: normalizeItemBg(options.bg || null)
      });
      const createRoot = (title, options = {}) => ({
        id: uid(),
        title,
        theme: options.theme || "mcu",
        systemKey: options.systemKey || null,
        userCreated: Boolean(options.userCreated),
        groups: Array.isArray(options.groups) ? options.groups : [],
        items: Array.isArray(options.items) ? options.items : [],
        bg: null
      });

      function createRoots() {
        return [
          createRoot("Non-MCU", {
            theme: "spider",
            systemKey: "non-mcu",
            groups: [
              createGroup("Spider-Man Universe", {
                theme: "spider",
                systemKey: "spider-man-universe",
                items: [
                  "Spider-Man",
                  "Spider-Man 2",
                  "Spider-Man 3",
                  "The Amazing Spider-Man",
                  "The Amazing Spider-Man 2",
                  "Spider-Man: Into the Spider-Verse",
                  "Spider-Man: Across the Spider-Verse",
                  "Spider-Man: Beyond the Spider-Verse"
                ].map((title) => createItem(title))
              }),
              createGroup("X-Men", {
                theme: "xmen",
                systemKey: "x-men",
                items: [
                  createItem("X-Men"),
                  createItem("X2: X-Men United"),
                  createItem("X-Men: Days of Future Past"),
                  createItem("Deadpool"),
                  createItem("Logan"),
                  createItem("Deadpool 2"),
                  createItem("Deadpool & Wolverine", false, "Dopo Loki")
                ]
              })
            ]
          }),
          createRoot("MCU", {
            theme: "mcu",
            systemKey: "mcu",
            groups: [
              createGroup("Fase 1", { systemKey: "phase-1", kind: "phase", theme: "mcu", items: [createItem("Iron Man"), createItem("The Incredible Hulk", false, "puoi opzionalmente saltarlo"), createItem("Iron Man 2"), createItem("Thor"), createItem("Captain America: The First Avenger"), createItem("The Avengers")] }),
              createGroup("Fase 2", { systemKey: "phase-2", kind: "phase", theme: "mcu", items: ["Iron Man 3", "Thor: The Dark World", "Captain America: The Winter Soldier", "Guardians of the Galaxy", "Avengers: Age of Ultron", "Ant-Man"].map((title) => createItem(title)) }),
              createGroup("Fase 3", { systemKey: "phase-3", kind: "phase", theme: "mcu", items: [createItem("Captain America: Civil War"), createItem("Doctor Strange"), createItem("Guardians of the Galaxy Vol. 2"), createItem("Spider-Man: Homecoming"), createItem("Thor: Ragnarok"), createItem("Black Panther"), createItem("Avengers: Infinity War"), createItem("Ant-Man and the Wasp"), createItem("Captain Marvel", false, "se vuoi, non e' piaciuto tanto come personaggio"), createItem("Avengers: Endgame"), createItem("Spider-Man: Far From Home")] }),
              createGroup("Serie chiave", { systemKey: "series-key", kind: "series", theme: "series", items: [createItem("WandaVision", false, "porta a Doctor Strange in the Multiverse of Madness"), createItem("Loki", false, "apre il MULTIVERSO quindi porta a Doomsday e Secret Wars")] }),
              createGroup("Fase 4", { systemKey: "phase-4", kind: "phase", theme: "mcu", items: [createItem("Black Widow"), createItem("Shang-Chi"), createItem("Eternals"), createItem("Spider-Man: No Way Home"), createItem("Doctor Strange in the Multiverse of Madness"), createItem("Thor: Love and Thunder", false, "meglio che lo eviti ad anni luce"), createItem("Black Panther: Wakanda Forever")] }),
              createGroup("Fase 5", { systemKey: "phase-5", kind: "phase", theme: "mcu", items: [createItem("Ant-Man and the Wasp: Quantumania", false, "anche questo"), createItem("Guardians of the Galaxy Vol. 3"), createItem("The Marvels", false, "e questo"), createItem("The Falcon And The Winter Soldier", false, "guardala dopo endgame o prima di cap BNW qua sotto"), createItem("Captain America: Brave New World"), createItem("Thunderbolts*")] }),
              createGroup("Fase 6", { systemKey: "phase-6", kind: "phase", theme: "mcu", items: ["Fantastic Four: First Steps", "Spider-Man: Brand New Day", "Avengers: Doomsday"].map((title) => createItem(title)) })
            ]
          })
        ];
      }

      function ensureSpiderCollections(rootsInput) {
        const normalizedRoots = Array.isArray(rootsInput) ? rootsInput : [];
        const canonicalTitleMap = new Map([
          ["x2", "X2: X-Men United"],
          ["x2 x men united", "X2: X-Men United"],
          ["x-men: giorni di un futuro passato", "X-Men: Days of Future Past"],
          ["x men giorni di un futuro passato", "X-Men: Days of Future Past"],
          ["x-men: days of future past", "X-Men: Days of Future Past"],
          ["x men days of future past", "X-Men: Days of Future Past"],
          ["shang-chi and the legend of the ten rings", "Shang-Chi"],
          ["shang chi and the legend of the ten rings", "Shang-Chi"],
          ["shang-chi e la leggenda dei dieci anelli", "Shang-Chi"],
          ["shang chi e la leggenda dei dieci anelli", "Shang-Chi"],
          ["deadpool 3", "Deadpool & Wolverine"]
        ]);
        const toCanonicalTitle = (title) => {
          const original = String(title || "").trim();
          if (!original) return "";
          const key = normalizeLookupTitle(original);
          return canonicalTitleMap.get(key) || original;
        };
        const normalizeAndDedupeItems = (items) => {
          if (!Array.isArray(items)) return [];
          const seen = new Set();
          const normalized = [];
          items.forEach((item) => {
            if (!item || typeof item !== "object") return;
            const canonicalTitle = toCanonicalTitle(item.title);
            if (!canonicalTitle) return;
            const dedupeKey = normalizeLookupTitle(canonicalTitle);
            if (seen.has(dedupeKey)) return;
            seen.add(dedupeKey);
            normalized.push({ ...item, title: canonicalTitle });
          });
          return normalized;
        };
        const requiredGroups = [
          {
            title: "Spider-Man Universe",
            theme: "spider",
            systemKey: "spider-man-universe",
            items: [
              "Spider-Man",
              "Spider-Man 2",
              "Spider-Man 3",
              "The Amazing Spider-Man",
              "The Amazing Spider-Man 2",
              "Spider-Man: Into the Spider-Verse",
              "Spider-Man: Across the Spider-Verse",
              "Spider-Man: Beyond the Spider-Verse"
            ]
          },
          {
            title: "X-Men",
            theme: "xmen",
            systemKey: "x-men",
            items: ["X-Men", "X2: X-Men United", "X-Men: Days of Future Past", "Deadpool", "Logan", "Deadpool 2", "Deadpool & Wolverine"]
          }
        ];

        const findByTitle = (list, title) => list.find((entry) => String(entry && entry.title ? entry.title : "").trim().toLowerCase() === String(title).trim().toLowerCase());
        const findBySystemKey = (list, systemKey) => list.find((entry) => entry && entry.systemKey === systemKey);
        const roots = normalizedRoots.map((root) => ({
          ...root,
          groups: Array.isArray(root.groups) ? [...root.groups] : [],
          items: normalizeAndDedupeItems(root.items)
        }));
        roots.forEach((root) => {
          if (!Array.isArray(root.groups)) return;
          root.groups = root.groups.map((group) => ({
            ...group,
            items: normalizeAndDedupeItems(group.items)
          }));
        });
        let preMcuRoot = findBySystemKey(roots, "non-mcu")
          || findByTitle(roots, "Non-MCU")
          || findByTitle(roots, "Pre-MCU")
          || roots.find((root) => root && !root.userCreated && root.theme === "spider");
        let mcuRoot = findBySystemKey(roots, "mcu")
          || findByTitle(roots, "MCU")
          || roots.find((root) => root && !root.userCreated && root.theme === "mcu");

        if (!preMcuRoot) {
          preMcuRoot = createRoot("Non-MCU", { theme: "spider", systemKey: "non-mcu", groups: [] });
          roots.unshift(preMcuRoot);
        }
        if (!mcuRoot) {
          mcuRoot = createRoot("MCU", { theme: "mcu", systemKey: "mcu", groups: [] });
          roots.push(mcuRoot);
        }
        preMcuRoot.systemKey = preMcuRoot.systemKey || "non-mcu";
        mcuRoot.systemKey = mcuRoot.systemKey || "mcu";
        if (String(preMcuRoot.title || "").trim() === "Pre-MCU") preMcuRoot.title = "Non-MCU";

        requiredGroups.forEach((groupDefinition) => {
          const groupTitle = groupDefinition.title;
          const groupTheme = groupDefinition.theme;
          const groupSystemKey = groupDefinition.systemKey;
          const requiredItems = groupDefinition.items;
          const existingGroup = findBySystemKey(preMcuRoot.groups, groupSystemKey)
            || findByTitle(preMcuRoot.groups, groupTitle)
            || preMcuRoot.groups.find((group) => group && !group.userCreated && group.theme === groupTheme);

          if (!existingGroup) {
            preMcuRoot.groups.push(createGroup(groupTitle, { theme: groupTheme, systemKey: groupSystemKey, kind: "section", items: requiredItems.map((title) => createItem(title)) }));
            return;
          }

          existingGroup.systemKey = existingGroup.systemKey || groupSystemKey;
          if (!existingGroup.theme) existingGroup.theme = groupTheme;
          existingGroup.items = normalizeAndDedupeItems(existingGroup.items);
          const existingTitles = new Set(existingGroup.items.map((item) => String(item && item.title ? item.title : "").trim().toLowerCase()));
          requiredItems.forEach((title) => {
            const key = String(title).trim().toLowerCase();
            if (!existingTitles.has(key)) existingGroup.items.push(createItem(title));
          });
          existingGroup.items = normalizeAndDedupeItems(existingGroup.items).map((item) => {
            if (String(item && item.title ? item.title : "").trim().toLowerCase() !== "deadpool & wolverine") return item;
            if (item && String(item.note || "").trim()) return item;
            return { ...item, note: "Dopo loki" };
          });
        });

        const mcuPhase4 = findBySystemKey(mcuRoot.groups, "phase-4")
          || findByTitle(mcuRoot.groups, "Fase 4");
        if (mcuPhase4 && Array.isArray(mcuPhase4.items)) {
          const excludedPhase4 = new Set(["deadpool", "logan", "deadpool 2", "deadpool 3", "dp2", "dp3"]);
          mcuPhase4.items = mcuPhase4.items.filter((item) => {
            const titleKey = String(item && item.title ? item.title : "").trim().toLowerCase();
            return !excludedPhase4.has(titleKey);
          });
        }

        const mcuPhase6 = findBySystemKey(mcuRoot.groups, "phase-6")
          || findByTitle(mcuRoot.groups, "Fase 6");
        if (mcuPhase6 && Array.isArray(mcuPhase6.items)) {
          const hasDoomsday = mcuPhase6.items.some((item) => String(item && item.title ? item.title : "").trim().toLowerCase() === "avengers: doomsday");
          if (!hasDoomsday) mcuPhase6.items.push(createItem("Avengers: Doomsday"));
        }

        return roots;
      }

      function createOpenGroups(roots) {
        return roots.reduce((accumulator, root) => {
          accumulator[root.id] = null;
          return accumulator;
        }, {});
      }

      function createDefaultState() {
        const roots = createRoots();
        const audio = createDefaultAudioSettings();
        return {
          appName: "Watchlist",
          roots,
          openRootId: null,
          openGroups: createOpenGroups(roots),
          homeScheduleOpen: true,
          homeScheduleHidden: false,
          animationTarget: null,
          closingPanel: null,
          viewer: null,
          viewerClosingToken: null,
          search: "",
          reviewPanels: {},
          reviewClosing: {},
          glows: createDefaultGlows(),
          glowTuning: createDefaultGlowTuning(),
          freeEdit: false,
          motionBoost: true,
          liteMode: false,
          liteSnapshot: null,
          colorSpeed: 1,
          glowSpeed: 1,
          clickSounds: audio.clickSounds,
          clickVolume: audio.clickVolume,
          clickStyle: audio.clickStyle,
          musicEnabled: audio.musicEnabled,
          musicVolume: audio.musicVolume,
          musicTrack: audio.musicTrack,
          firebaseConfig: createDefaultFirebaseConfig(),
          profile: createDefaultProfile(),
          glowsEnabled: true,
          modal: null,
          modalClosingToken: null
        };
      }

      function normalizeItem(item) {
        return {
          id: item && item.id ? item.id : uid(),
          title: item && item.title ? String(item.title) : "Titolo",
          rating: Math.max(0, Math.min(5, Number(item && item.rating) || 0)),
          review: item && item.review ? String(item.review) : "",
          seen: Boolean(item && item.seen),
          userAdded: Boolean(item && item.userAdded),
          note: item && item.note ? String(item.note) : "",
          background: item && item.background ? String(item.background) : "",
          bg: normalizeItemBg(item && item.bg ? item.bg : null)
        };
      }

      function normalizeGroup(group, theme) {
        const rawTitle = group && group.title ? String(group.title) : "Nuova cartella";
        const normalizedKey = group && group.systemKey
          ? String(group.systemKey)
          : ({
            "spider-man universe": "spider-man-universe",
            "x-men": "x-men",
            "fase 1": "phase-1",
            "fase 2": "phase-2",
            "fase 3": "phase-3",
            "fase 4": "phase-4",
            "fase 5": "phase-5",
            "fase 6": "phase-6",
            "serie chiave": "series-key"
          }[rawTitle.trim().toLowerCase()] || null);
        return {
          id: group && group.id ? group.id : uid(),
          title: rawTitle,
          kind: group && group.kind ? group.kind : "section",
          theme: group && group.theme ? group.theme : theme,
          systemKey: normalizedKey,
          userCreated: Boolean(group && group.userCreated),
          items: Array.isArray(group && group.items) ? group.items.map(normalizeItem) : [],
          bg: normalizeItemBg(group && group.bg ? group.bg : null)
        };
      }

      function normalizeRoot(root) {
        const theme = root && root.theme ? root.theme : "mcu";
        const normalizedTitle = root && root.title ? String(root.title) : "Nuova macro-cartella";
        return {
          id: root && root.id ? root.id : uid(),
          title: normalizedTitle === "Pre-MCU" ? "Non-MCU" : normalizedTitle,
          theme,
          systemKey: root && root.systemKey ? String(root.systemKey) : (theme === "spider" && !Boolean(root && root.userCreated) ? "non-mcu" : (theme === "mcu" && !Boolean(root && root.userCreated) ? "mcu" : null)),
          userCreated: Boolean(root && root.userCreated),
          groups: Array.isArray(root && root.groups) ? root.groups.map((group) => normalizeGroup(group, theme)) : [],
          items: Array.isArray(root && root.items) ? root.items.map(normalizeItem) : [],
          bg: null
        };
      }

      function convertLegacyCatalog(parsed) {
        if (!parsed || !parsed.catalog) return null;
        const roots = [];
        if (parsed.catalog.preMcu) {
          roots.push(createRoot("Non-MCU", { theme: "spider", systemKey: "non-mcu", groups: parsed.catalog.preMcu.map((group) => normalizeGroup(group, group.theme || "spider")) }));
        }
        if (parsed.catalog.mcu) {
          roots.push(createRoot("MCU", { theme: "mcu", systemKey: "mcu", groups: parsed.catalog.mcu.map((group) => normalizeGroup(group, group.theme || "mcu")) }));
        }
        return roots.length ? roots : null;
      }

      function normalizeGlows(source, fallback) {
        const base = fallback || createDefaultGlows();
        const glows = source && source.glows ? source.glows : {};
        const legacyXMen = source && source.xmenGlow ? source.xmenGlow : null;
        return {
          background: {
            a: glows.background && glows.background.a ? glows.background.a : base.background.a,
            b: glows.background && glows.background.b ? glows.background.b : base.background.b,
            c: glows.background && glows.background.c ? glows.background.c : base.background.c,
            d: glows.background && glows.background.d ? glows.background.d : base.background.d
          },
          spider: {
            a: glows.spider && glows.spider.a ? glows.spider.a : base.spider.a,
            b: glows.spider && glows.spider.b ? glows.spider.b : base.spider.b
          },
          mcu: {
            a: glows.mcu && glows.mcu.a ? glows.mcu.a : base.mcu.a,
            b: glows.mcu && glows.mcu.b ? glows.mcu.b : base.mcu.b
          },
          xmen: {
            a: glows.xmen && glows.xmen.a ? glows.xmen.a : (legacyXMen && legacyXMen.from ? legacyXMen.from : base.xmen.a),
            b: glows.xmen && glows.xmen.b ? glows.xmen.b : (legacyXMen && legacyXMen.to ? legacyXMen.to : base.xmen.b)
          },
          series: {
            a: glows.series && glows.series.a ? glows.series.a : base.series.a,
            b: glows.series && glows.series.b ? glows.series.b : base.series.b
          }
        };
      }

      function normalizeGlowTuning(source, fallback) {
        const base = fallback || createDefaultGlowTuning();
        const tuning = source && source.glowTuning ? source.glowTuning : {};
        const sections = ["background", "spider", "mcu", "xmen", "series"];
        return sections.reduce((accumulator, key) => {
          const sourceValue = tuning[key] || {};
          const fallbackValue = base[key] || {};
          accumulator[key] = {
            speed: Math.max(.55, Math.min(2.2, Number(sourceValue.speed) || Number(fallbackValue.speed) || 1)),
            strength: Math.max(.55, Math.min(1.6, Number(sourceValue.strength) || Number(fallbackValue.strength) || 1))
          };
          return accumulator;
        }, {});
      }

      function normalizeAudioSettings(source, fallback) {
        const base = fallback || createDefaultAudioSettings();
        return {
          clickSounds: source && Object.prototype.hasOwnProperty.call(source, "clickSounds") ? Boolean(source.clickSounds) : base.clickSounds,
          clickVolume: clampNumber(source && source.clickVolume, 0, 1, base.clickVolume),
          clickStyle: source && clickStyleValues.has(source.clickStyle) ? source.clickStyle : base.clickStyle,
          musicEnabled: source && Object.prototype.hasOwnProperty.call(source, "musicEnabled") ? Boolean(source.musicEnabled) : base.musicEnabled,
          musicVolume: clampNumber(source && source.musicVolume, 0, 1, base.musicVolume),
          musicTrack: source && musicTrackValues.has(source.musicTrack) ? source.musicTrack : base.musicTrack
        };
      }

      function loadState() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return createDefaultState();
          const parsed = JSON.parse(raw);
          const fallback = createDefaultState();
          const audio = normalizeAudioSettings(parsed, createDefaultAudioSettings());
          const rawRoots = Array.isArray(parsed && parsed.roots)
            ? parsed.roots.map(normalizeRoot)
            : convertLegacyCatalog(parsed) || fallback.roots;
          const roots = ensureSpiderCollections(rawRoots);
          return {
            appName: parsed && typeof parsed.appName === "string" ? (parsed.appName === "Watchlist Nexus" ? "Watchlist" : parsed.appName) : fallback.appName,
            roots,
            openRootId: null,
            openGroups: createOpenGroups(roots),
            homeScheduleOpen: parsed && Object.prototype.hasOwnProperty.call(parsed, "homeScheduleOpen") ? Boolean(parsed.homeScheduleOpen) : true,
            homeScheduleHidden: parsed && Object.prototype.hasOwnProperty.call(parsed, "homeScheduleHidden") ? Boolean(parsed.homeScheduleHidden) : false,
            animationTarget: null,
            closingPanel: null,
            viewer: null,
            viewerClosingToken: null,
            search: parsed && typeof parsed.search === "string" ? parsed.search : "",
            reviewPanels: parsed && parsed.reviewPanels && typeof parsed.reviewPanels === "object" ? parsed.reviewPanels : {},
            reviewClosing: {},
            glows: normalizeGlows(parsed, fallback.glows),
            glowTuning: normalizeGlowTuning(parsed, fallback.glowTuning),
            freeEdit: Boolean(parsed && parsed.freeEdit),
            motionBoost: parsed && Object.prototype.hasOwnProperty.call(parsed, "motionBoost") ? Boolean(parsed.motionBoost) : true,
            liteMode: parsed && Object.prototype.hasOwnProperty.call(parsed, "liteMode") ? Boolean(parsed.liteMode) : false,
            colorSpeed: parsed && Number.isFinite(Number(parsed.colorSpeed)) ? Number(parsed.colorSpeed) : 1,
            glowSpeed: parsed && Number.isFinite(Number(parsed.glowSpeed)) ? Number(parsed.glowSpeed) : 1,
            clickSounds: audio.clickSounds,
            clickVolume: audio.clickVolume,
            clickStyle: audio.clickStyle,
            musicEnabled: audio.musicEnabled,
            musicVolume: audio.musicVolume,
            musicTrack: audio.musicTrack,
            firebaseConfig: normalizeFirebaseConfig(parsed && parsed.firebaseConfig ? parsed.firebaseConfig : null, createDefaultFirebaseConfig()),
            profile: normalizeProfile(parsed && parsed.profile ? parsed.profile : null, createDefaultProfile()),
            glowsEnabled: parsed && Object.prototype.hasOwnProperty.call(parsed, "glowsEnabled") ? Boolean(parsed.glowsEnabled) : true,
            modal: null,
            modalClosingToken: null
          };
        } catch (error) {
          return createDefaultState();
        }
      }

      function saveState() {
        if (pendingSaveFrame !== null) {
          window.clearTimeout(pendingSaveFrame);
          pendingSaveFrame = null;
        }
        if (!hasGoogleProfile(state.profile)) {
          try { localStorage.removeItem(STORAGE_KEY); } catch (error) {}
          lastPersistedStateJson = "";
          return;
        }
        try {
          const payload = {
            appName: state.appName,
            roots: state.roots,
            search: state.search,
            reviewPanels: state.reviewPanels,
            homeScheduleOpen: state.homeScheduleOpen,
            homeScheduleHidden: state.homeScheduleHidden,
            glows: state.glows,
            glowTuning: state.glowTuning,
            freeEdit: state.freeEdit,
            motionBoost: state.motionBoost,
            liteMode: state.liteMode,
            colorSpeed: state.colorSpeed,
            glowSpeed: state.glowSpeed,
            clickSounds: state.clickSounds,
            clickVolume: state.clickVolume,
            clickStyle: state.clickStyle,
            musicEnabled: state.musicEnabled,
            musicVolume: state.musicVolume,
            musicTrack: state.musicTrack,
            firebaseConfig: state.firebaseConfig,
            profile: state.profile,
            glowsEnabled: state.glowsEnabled
          };
          const nextJson = JSON.stringify(payload);
          if (nextJson === lastPersistedStateJson) return;
          localStorage.setItem(STORAGE_KEY, nextJson);
          lastPersistedStateJson = nextJson;
        } catch (error) {
        }
        scheduleCloudStateSave();
      }

      function getRoot(rootId) {
        return state.roots.find((root) => root.id === rootId);
      }

      function getGroup(rootId, groupId) {
        const root = getRoot(rootId);
        return root ? root.groups.find((group) => group.id === groupId) : null;
      }

      function getScopedItem(rootId, groupId, itemId, scope) {
        const root = getRoot(rootId);
        if (!root) return null;
        if (scope === "root") {
          const item = root.items.find((entry) => entry.id === itemId);
          return item ? { root, group: null, item } : null;
        }
        const group = getGroup(rootId, groupId);
        if (!group) return null;
        const item = group.items.find((entry) => entry.id === itemId);
        return item ? { root, group, item } : null;
      }

      function canEdit(flag) {
        return state.freeEdit || flag;
      }

      function canAddDirectTitles(root) {
        return Boolean(root && root.userCreated);
      }

      function canAddTitlesToGroup(root, group) {
        if (!group) return false;
        if (group.userCreated) return true;
        if (root && root.userCreated) return true;
        if (group.systemKey === "phase-6" || group.systemKey === "spider-man-universe") return true;
        if (root && root.systemKey === "mcu" && root.groups[root.groups.length - 1] && root.groups[root.groups.length - 1].id === group.id) return true;
        if (root && root.systemKey === "non-mcu" && group.theme === "spider" && !group.userCreated) return true;
        return false;
      }

      function mutateRoot(rootId, updater) {
        state.roots = state.roots.map((root) => root.id === rootId ? updater(root) : root);
        saveState();
      }

      function mutateGroup(rootId, groupId, updater) {
        mutateRoot(rootId, (root) => ({
          ...root,
          groups: root.groups.map((group) => group.id === groupId ? updater(group) : group)
        }));
      }

      function mutateRootItem(rootId, itemId, updater) {
        mutateRoot(rootId, (root) => ({
          ...root,
          items: root.items.map((item) => item.id === itemId ? updater(item) : item)
        }));
      }

      function mutateGroupItem(rootId, groupId, itemId, updater) {
        mutateGroup(rootId, groupId, (group) => ({
          ...group,
          items: group.items.map((item) => item.id === itemId ? updater(item) : item)
        }));
      }

      function setItemReviewDraft(scope, rootId, groupId, itemId, review) {
        state.roots = state.roots.map((root) => {
          if (root.id !== rootId) return root;
          if (scope === "root") {
            return {
              ...root,
              items: root.items.map((item) => item.id === itemId ? { ...item, review } : item)
            };
          }
          return {
            ...root,
            groups: root.groups.map((group) => (
              group.id !== groupId
                ? group
                : {
                  ...group,
                  items: group.items.map((item) => item.id === itemId ? { ...item, review } : item)
                }
            ))
          };
        });
      }

      function purgeUnauthenticatedData() {
        const fallback = createDefaultState();
        const preservedFirebaseConfig = normalizeFirebaseConfig(state.firebaseConfig, createDefaultFirebaseConfig());
        state = {
          ...fallback,
          firebaseConfig: preservedFirebaseConfig,
          profile: createDefaultProfile()
        };
        try { localStorage.removeItem(STORAGE_KEY); } catch (error) {}
      }

      function sanitizeItemForCloud(item) {
        return {
          ...item,
          background: "",
          bg: null
        };
      }

      function sanitizeGroupForCloud(group) {
        return {
          ...group,
          bg: null,
          items: group.items.map(sanitizeItemForCloud)
        };
      }

      function sanitizeRootForCloud(root) {
        return {
          ...root,
          bg: null,
          items: root.items.map(sanitizeItemForCloud),
          groups: root.groups.map(sanitizeGroupForCloud)
        };
      }

      function preserveLocalBackgrounds(previousRoots, nextRoots) {
        const previousRootMap = new Map((previousRoots || []).map((root) => [root.id, root]));
        return nextRoots.map((root) => {
          const previousRoot = previousRootMap.get(root.id);
          const previousGroupMap = new Map((previousRoot && previousRoot.groups ? previousRoot.groups : []).map((group) => [group.id, group]));
          const previousRootItems = new Map((previousRoot && previousRoot.items ? previousRoot.items : []).map((item) => [item.id, item]));
          return {
            ...root,
            items: root.items.map((item) => {
              const previousItem = previousRootItems.get(item.id);
              return previousItem && (previousItem.bg || previousItem.background)
                ? { ...item, background: previousItem.background || "", bg: previousItem.bg || null }
                : item;
            }),
            groups: root.groups.map((group) => {
              const previousGroup = previousGroupMap.get(group.id);
              const previousGroupItems = new Map((previousGroup && previousGroup.items ? previousGroup.items : []).map((item) => [item.id, item]));
              return {
                ...group,
                bg: previousGroup && previousGroup.bg ? previousGroup.bg : group.bg,
                items: group.items.map((item) => {
                  const previousItem = previousGroupItems.get(item.id);
                  return previousItem && (previousItem.bg || previousItem.background)
                    ? { ...item, background: previousItem.background || "", bg: previousItem.bg || null }
                    : item;
                })
              };
            })
          };
        });
      }

      function buildPersistentStatePayload(sourceState = state) {
        return {
          appName: sourceState.appName,
          roots: sourceState.roots.map(sanitizeRootForCloud),
          reviewPanels: sourceState.reviewPanels,
          homeScheduleOpen: sourceState.homeScheduleOpen,
          homeScheduleHidden: sourceState.homeScheduleHidden,
          glows: sourceState.glows,
          glowTuning: sourceState.glowTuning,
          freeEdit: sourceState.freeEdit,
          motionBoost: sourceState.motionBoost,
          liteMode: sourceState.liteMode,
          colorSpeed: sourceState.colorSpeed,
          glowSpeed: sourceState.glowSpeed,
          clickSounds: sourceState.clickSounds,
          clickVolume: sourceState.clickVolume,
          clickStyle: sourceState.clickStyle,
          musicEnabled: sourceState.musicEnabled,
          musicVolume: sourceState.musicVolume,
          musicTrack: sourceState.musicTrack,
          glowsEnabled: sourceState.glowsEnabled
        };
      }

      function applyPersistentStatePayload(payload) {
        const fallback = createDefaultState();
        const audio = normalizeAudioSettings(payload, createDefaultAudioSettings());
        const previousRoots = state.roots;
        const previousOpenRootId = state.openRootId;
        const previousOpenGroups = state.openGroups && typeof state.openGroups === "object" ? state.openGroups : {};
        const previousViewer = state.viewer;
        const previousSearch = state.search;
        const rawRoots = Array.isArray(payload && payload.roots)
          ? payload.roots.map(normalizeRoot)
          : convertLegacyCatalog(payload) || fallback.roots;
        const roots = preserveLocalBackgrounds(previousRoots, ensureSpiderCollections(rawRoots));
        const rootIdSet = new Set(roots.map((root) => root.id));
        const makeRootKey = (root) => `${normalizeLookupTitle(root && root.title ? root.title : "")}::${root && root.userCreated ? "u" : "s"}`;
        const makeGroupKey = (group) => `${normalizeLookupTitle(group && group.title ? group.title : "")}::${String(group && group.kind ? group.kind : "")}`;
        const nextRootByKey = new Map(roots.map((root) => [makeRootKey(root), root]));
        const previousRootById = new Map(previousRoots.map((root) => [root.id, root]));
        const findNextRootIdFromPrevious = (previousRootId) => {
          if (!previousRootId) return null;
          if (rootIdSet.has(previousRootId)) return previousRootId;
          const previousRoot = previousRootById.get(previousRootId);
          if (!previousRoot) return null;
          const matched = nextRootByKey.get(makeRootKey(previousRoot));
          return matched ? matched.id : null;
        };
        const findNextGroupIdFromPrevious = (nextRoot, previousRootId, previousGroupId) => {
          if (!nextRoot || !previousGroupId || !Array.isArray(nextRoot.groups)) return null;
          if (nextRoot.groups.some((group) => group.id === previousGroupId)) return previousGroupId;
          const previousRoot = previousRootById.get(previousRootId);
          if (!previousRoot || !Array.isArray(previousRoot.groups)) return null;
          const previousGroup = previousRoot.groups.find((group) => group.id === previousGroupId);
          if (!previousGroup) return null;
          const matched = nextRoot.groups.find((group) => makeGroupKey(group) === makeGroupKey(previousGroup));
          return matched ? matched.id : null;
        };
        const nextOpenGroups = createOpenGroups(roots);
        roots.forEach((root) => {
          const previousRootId = previousRoots.some((entry) => entry.id === root.id)
            ? root.id
            : (Array.from(previousRootById.values()).find((entry) => makeRootKey(entry) === makeRootKey(root)) || {}).id;
          const previousGroupId = previousOpenGroups[root.id] || (previousRootId ? previousOpenGroups[previousRootId] : null);
          const nextGroupId = findNextGroupIdFromPrevious(root, previousRootId, previousGroupId);
          if (nextGroupId) nextOpenGroups[root.id] = nextGroupId;
        });
        const nextOpenRootId = findNextRootIdFromPrevious(previousOpenRootId);
        let nextViewer = null;
        if (previousViewer) {
          const nextViewerRootId = findNextRootIdFromPrevious(previousViewer.rootId);
          if (nextViewerRootId) {
            if (previousViewer.type === "root") {
              nextViewer = { type: "root", rootId: nextViewerRootId };
            } else if (previousViewer.type === "group") {
              const viewerRoot = roots.find((root) => root.id === nextViewerRootId);
              const nextViewerGroupId = findNextGroupIdFromPrevious(viewerRoot, previousViewer.rootId, previousViewer.groupId);
              if (nextViewerGroupId) nextViewer = { type: "group", rootId: nextViewerRootId, groupId: nextViewerGroupId };
              else nextViewer = { type: "root", rootId: nextViewerRootId };
            }
          }
        }
        state.appName = payload && typeof payload.appName === "string" ? (payload.appName === "Watchlist Nexus" ? "Watchlist" : payload.appName) : fallback.appName;
        state.roots = roots;
        state.openRootId = nextOpenRootId;
        state.openGroups = nextOpenGroups;
        state.homeScheduleOpen = payload && Object.prototype.hasOwnProperty.call(payload, "homeScheduleOpen") ? Boolean(payload.homeScheduleOpen) : true;
        state.homeScheduleHidden = payload && Object.prototype.hasOwnProperty.call(payload, "homeScheduleHidden") ? Boolean(payload.homeScheduleHidden) : false;
        state.animationTarget = null;
        state.closingPanel = null;
        state.viewer = nextViewer;
        state.viewerClosingToken = null;
        state.search = previousSearch;
        state.reviewPanels = payload && payload.reviewPanels && typeof payload.reviewPanels === "object" ? payload.reviewPanels : {};
        state.reviewClosing = {};
        state.glows = normalizeGlows(payload, fallback.glows);
        state.glowTuning = normalizeGlowTuning(payload, fallback.glowTuning);
        state.freeEdit = Boolean(payload && payload.freeEdit);
        state.motionBoost = payload && Object.prototype.hasOwnProperty.call(payload, "motionBoost") ? Boolean(payload.motionBoost) : true;
        state.liteMode = payload && Object.prototype.hasOwnProperty.call(payload, "liteMode") ? Boolean(payload.liteMode) : false;
        state.colorSpeed = payload && Number.isFinite(Number(payload.colorSpeed)) ? Number(payload.colorSpeed) : 1;
        state.glowSpeed = payload && Number.isFinite(Number(payload.glowSpeed)) ? Number(payload.glowSpeed) : 1;
        state.clickSounds = audio.clickSounds;
        state.clickVolume = audio.clickVolume;
        state.clickStyle = audio.clickStyle;
        state.musicEnabled = audio.musicEnabled;
        state.musicVolume = audio.musicVolume;
        state.musicTrack = audio.musicTrack;
        state.glowsEnabled = payload && Object.prototype.hasOwnProperty.call(payload, "glowsEnabled") ? Boolean(payload.glowsEnabled) : true;
      }

      function getEntries() {
        if (entriesCache.rootsRef === state.roots) return entriesCache.entries;
        const entries = state.roots.flatMap((root) => {
          const rootItems = root.items.map((item) => ({ root, group: null, item }));
          const groupItems = root.groups.flatMap((group) => group.items.map((item) => ({ root, group, item })));
          return [...rootItems, ...groupItems];
        });
        entriesCache = { rootsRef: state.roots, entries };
        return entries;
      }

      function getDisplayRoots() {
        const lockedRoots = state.roots.filter((root) => !root.userCreated);
        const customRoots = state.roots.filter((root) => root.userCreated);
        return [...lockedRoots, ...customRoots];
      }

      function buildNumbering() {
        const map = new Map();
        let current = 1;
        getEntries().forEach((entry) => {
          map.set(entry.item.id, current);
          current += 1;
        });
        return map;
      }

      function getRootStats(root) {
        const directTotal = root.items.length;
        const directSeen = root.items.filter((item) => item.seen).length;
        const grouped = root.groups.reduce((accumulator, group) => {
          accumulator.total += group.items.length;
          accumulator.seen += group.items.filter((item) => item.seen).length;
          return accumulator;
        }, { total: 0, seen: 0 });
        return { groups: root.groups.length, total: directTotal + grouped.total, seen: directSeen + grouped.seen };
      }

      function getAllStats() {
        if (allStatsCache.rootsRef === state.roots) return allStatsCache.value;
        const value = state.roots.reduce((accumulator, root) => {
          const stats = getRootStats(root);
          accumulator.total += stats.total;
          accumulator.seen += stats.seen;
          return accumulator;
        }, { total: 0, seen: 0 });
        allStatsCache = { rootsRef: state.roots, value };
        return value;
      }

      function getTopRatedEntries(limit = 4) {
        if (topRatedCache.rootsRef === state.roots && topRatedCache.limit === limit) return topRatedCache.value;
        const value = getEntries()
          .filter(({ item }) => Number(item.rating || 0) > 0)
          .sort((left, right) => {
            const ratingDiff = Number(right.item.rating || 0) - Number(left.item.rating || 0);
            if (ratingDiff !== 0) return ratingDiff;
            const seenDiff = Number(Boolean(right.item.seen)) - Number(Boolean(left.item.seen));
            if (seenDiff !== 0) return seenDiff;
            return String(left.item.title || "").localeCompare(String(right.item.title || ""), "it");
          })
          .slice(0, limit);
        topRatedCache = { rootsRef: state.roots, limit, value };
        return value;
      }

      function buildEntryLookup() {
        if (entryLookupCache.rootsRef === state.roots) return entryLookupCache.value;
        const lookup = new Map();
        getEntries().forEach((entry) => {
          getLookupVariants(entry.item.title).forEach((key) => {
            if (!lookup.has(key)) lookup.set(key, entry);
          });
        });
        entryLookupCache = { rootsRef: state.roots, value: lookup };
        return lookup;
      }

      function getScheduleBinding(entryLookup, scheduleEntry) {
        if (!scheduleEntry || !scheduleEntry.title) return null;
        const lookupQueue = [
          ...(scheduleEntry.matchTitle ? getLookupVariants(scheduleEntry.matchTitle) : []),
          ...getLookupVariants(scheduleEntry.title)
        ];
        for (const key of lookupQueue) {
          const binding = entryLookup.get(key);
          if (binding) return binding;
        }
        return null;
      }

      function getHomeScheduleStats(entryLookup) {
        return homeScheduleSections.reduce((totals, section) => {
          (section.weeks || []).forEach((week) => {
            (week.entries || []).forEach((entry) => {
              const binding = getScheduleBinding(entryLookup, entry);
              if (!binding) return;
              totals.total += 1;
              if (binding.item.seen) totals.seen += 1;
            });
          });
          return totals;
        }, { total: 0, seen: 0 });
      }

      function searchResults() {
        const query = state.search.trim().toLowerCase();
        if (!query) return [];
        if (searchCache.rootsRef === state.roots && searchCache.query === query) return searchCache.value;
        const value = getEntries().filter(({ root, group, item }) => (
          root.title.toLowerCase().includes(query)
          || (group ? group.title.toLowerCase().includes(query) : false)
          || item.title.toLowerCase().includes(query)
          || String(item.note || "").toLowerCase().includes(query)
          || String(item.review || "").toLowerCase().includes(query)
        ));
        searchCache = { rootsRef: state.roots, query, value };
        return value;
      }

      function captureFocus() {
        const active = document.activeElement;
        if (!active || !active.dataset || !active.dataset.focusKey) return null;
        return {
          key: active.dataset.focusKey,
          start: typeof active.selectionStart === "number" ? active.selectionStart : null,
          end: typeof active.selectionEnd === "number" ? active.selectionEnd : null
        };
      }

      function restoreFocus(snapshot) {
        if (!snapshot || !snapshot.key) return;
        const target = document.querySelector(`[data-focus-key="${snapshot.key}"]`);
        if (!target) return;
        target.focus();
        if (snapshot.start !== null && typeof target.setSelectionRange === "function") {
          try { target.setSelectionRange(snapshot.start, snapshot.end); } catch (error) {}
        }
      }

      function setModal(modal) {
        bgPreviewDrag = null;
        suppressBackdropClick = false;
        state.modal = modal;
        state.modalClosingToken = null;
        render();
      }

      function beginModalClose() {
        if (!state.modal || state.modalClosingToken) return;
        bgPreviewDrag = null;
        const token = uid();
        state.modalClosingToken = token;
        render();
        window.setTimeout(() => {
          if (state.modalClosingToken !== token) return;
          state.modalClosingToken = null;
          state.modal = null;
          render();
        }, 240);
      }

      function closeModal() {
        if (state.modal && state.modal.mode === "settings") {
          const changes = getSettingsChanges(state.modal);
          if (changes.length) {
            state.modal = { mode: "settings-confirm-close", changes, settingsDraft: clone(state.modal) };
            return render();
          }
        }
        if (state.modal && state.modal.mode === "profile") {
          const changes = getProfileChanges(state.modal);
          if (changes.length) {
            state.modal = { mode: "profile-confirm-close", changes, profileDraft: clone(state.modal) };
            return render();
          }
        }
        if (state.modal && state.modal.mode === "settings-confirm-close") {
          return beginModalClose();
        }
        if (state.modal && state.modal.mode === "profile-confirm-close") {
          return beginModalClose();
        }
        beginModalClose();
      }

      function setViewer(viewer) {
        state.viewer = viewer;
        state.viewerClosingToken = null;
        render();
      }

      function beginViewerClose(nextViewer = null) {
        if (!state.viewer || state.viewerClosingToken) return;
        const token = uid();
        state.viewerClosingToken = token;
        render();
        window.setTimeout(() => {
          if (state.viewerClosingToken !== token) return;
          state.viewerClosingToken = null;
          state.viewer = nextViewer;
          render();
        }, 220);
      }

      function openRootViewer(rootId) {
        if (!getRoot(rootId)) return;
        const nextViewer = { type: "root", rootId };
        if (!state.viewer) return setViewer(nextViewer);
        if (state.viewer.type === "root" && state.viewer.rootId === rootId) return beginViewerClose();
        return beginViewerClose(nextViewer);
      }

      function openGroupViewer(rootId, groupId) {
        if (!getRoot(rootId) || !getGroup(rootId, groupId)) return;
        const nextViewer = { type: "group", rootId, groupId };
        if (!state.viewer) return setViewer(nextViewer);
        if (state.viewer.type === "group" && state.viewer.rootId === rootId && state.viewer.groupId === groupId) return beginViewerClose({ type: "root", rootId });
        return beginViewerClose(nextViewer);
      }

      function getAdjacentGroups(root, groupId) {
        if (!root || !Array.isArray(root.groups)) return { previous: null, next: null, index: -1 };
        const index = root.groups.findIndex((group) => group.id === groupId);
        if (index < 0) return { previous: null, next: null, index };
        return {
          previous: index > 0 ? root.groups[index - 1] : null,
          next: index < root.groups.length - 1 ? root.groups[index + 1] : null,
          index
        };
      }

      function canCustomizeGroupBackground(group) {
        if (!group) return false;
        return group.userCreated || group.systemKey === "spider-man-universe" || group.systemKey === "x-men";
      }

      function openProfileSettings() {
        setModal({
          mode: "profile",
          profileNicknameDraft: state.profile.nickname,
          profileShowEmailDraft: state.profile.showEmail
        });
      }

      function openSettings() {
        setModal({
          mode: "settings",
          appNameDraft: state.appName,
          freeEditDraft: state.freeEdit,
          motionBoostDraft: state.motionBoost,
          colorSpeedDraft: state.colorSpeed,
          glowSpeedDraft: state.glowSpeed,
          glowsEnabledDraft: state.glowsEnabled,
          clickSoundsDraft: state.clickSounds,
          clickVolumeDraft: state.clickVolume,
          clickStyleDraft: state.clickStyle,
          musicEnabledDraft: state.musicEnabled,
          musicVolumeDraft: state.musicVolume,
          musicTrackDraft: state.musicTrack,
          glowsDraft: clone(state.glows),
          glowTuningDraft: clone(state.glowTuning)
        });
      }

      function openRootCreateModal() {
        setModal({
          mode: "root-create",
          title: "Nuova macro-cartella",
          value: "",
          theme: "mcu"
        });
      }

      function getModalRenderKey(modal = state.modal) {
        if (!modal) return null;
        if (modal.mode === "settings") return "settings";
        if (modal.mode === "settings-confirm-close") return "settings-confirm-close";
        if (modal.mode === "profile") return "profile";
        if (modal.mode === "profile-confirm-close") return "profile-confirm-close";
        if (modal.mode === "roadmap") return "roadmap";
        if (modal.mode === "item-bg") return `item-bg:${modal.scope || ""}:${modal.rootId || ""}:${modal.groupId || ""}:${modal.itemId || ""}`;
        if (modal.mode === "group-bg") return `group-bg:${modal.rootId || ""}:${modal.groupId || ""}`;
        if (modal.mode === "root-bg") return `root-bg:${modal.rootId || ""}`;
        if (modal.mode === "root-create") return "root-create";
        if (modal.mode === "delete") return `delete:${modal.type || ""}:${modal.rootId || ""}:${modal.groupId || ""}:${modal.itemId || ""}`;
        if (modal.mode === "text") return `text:${modal.type || ""}:${modal.rootId || ""}:${modal.groupId || ""}:${modal.itemId || ""}`;
        return modal.mode;
      }

      function getViewerRenderKey(viewer = state.viewer) {
        if (!viewer) return null;
        if (viewer.type === "group") return `group:${viewer.rootId || ""}:${viewer.groupId || ""}`;
        return `root:${viewer.rootId || ""}`;
      }

      function applySettingsDraft(sourceModal = state.modal) {
        if (!sourceModal || sourceModal.mode !== "settings") return;
        state.appName = sourceModal.appNameDraft.trim() || "Watchlist";
        state.freeEdit = Boolean(sourceModal.freeEditDraft);
        state.motionBoost = Boolean(sourceModal.motionBoostDraft);
        state.colorSpeed = Math.max(.55, Math.min(1.9, Number(sourceModal.colorSpeedDraft) || 1));
        state.glowSpeed = Math.max(.55, Math.min(2.2, Number(sourceModal.glowSpeedDraft) || 1));
        state.glowsEnabled = Boolean(sourceModal.glowsEnabledDraft);
        state.clickSounds = Boolean(sourceModal.clickSoundsDraft);
        state.clickVolume = clampNumber(sourceModal.clickVolumeDraft, 0, 1, .42);
        state.clickStyle = clickStyleValues.has(sourceModal.clickStyleDraft) ? sourceModal.clickStyleDraft : "soft";
        state.musicEnabled = Boolean(sourceModal.musicEnabledDraft);
        state.musicVolume = clampNumber(sourceModal.musicVolumeDraft, 0, 1, .2);
        state.musicTrack = musicTrackValues.has(sourceModal.musicTrackDraft) ? sourceModal.musicTrackDraft : "nebula";
        state.glows = normalizeGlows({ glows: sourceModal.glowsDraft }, createDefaultGlows());
        state.glowTuning = normalizeGlowTuning({ glowTuning: sourceModal.glowTuningDraft }, createDefaultGlowTuning());
        saveState();
      }

      function applyProfileDraft(sourceModal = state.modal) {
        if (!sourceModal || sourceModal.mode !== "profile") return;
        state.profile = normalizeProfile({
          ...state.profile,
          nickname: String(sourceModal.profileNicknameDraft || "").trim(),
          showEmail: Boolean(sourceModal.profileShowEmailDraft)
        }, createDefaultProfile());
        saveState();
      }

      function formatGroupMeta(group) {
        const seen = group.items.filter((item) => item.seen).length;
        return `${group.items.length} titoli • ${seen}/${group.items.length} visti`;
      }

      function formatRootMeta(root) {
        const stats = getRootStats(root);
        return `${stats.groups} cartelle • ${stats.total} titoli • ${stats.seen} visti`;
      }

      function themeAccent(theme) {
        if (theme === "spider") return state.glows.spider.a;
        if (theme === "xmen") return state.glows.xmen.a;
        if (theme === "series") return state.glows.series.a;
        return state.glows.mcu.a;
      }

      function formatColorSpeed(value) {
        return `${Number(value || 1).toFixed(2).replace(/\.?0+$/, "")}x`;
      }

      function formatVolume(value) {
        return `${Math.round(clampNumber(value, 0, 1, 0) * 100)}%`;
      }

      function getSettingsChanges(sourceModal = state.modal) {
        if (!sourceModal || sourceModal.mode !== "settings") return [];
        const changes = [];
        const nextName = sourceModal.appNameDraft.trim() || "Watchlist";
        if (nextName !== state.appName) changes.push(`Nome app: ${nextName}`);
        if (Boolean(sourceModal.freeEditDraft) !== state.freeEdit) changes.push(`Modalita libera`);
        if (Boolean(sourceModal.motionBoostDraft) !== state.motionBoost) changes.push(`Animazioni boost`);
        if (Math.abs((Number(sourceModal.colorSpeedDraft) || 1) - (Number(state.colorSpeed) || 1)) > 0.001) changes.push(`Velocita colori: ${formatColorSpeed(sourceModal.colorSpeedDraft)}`);
        if (Math.abs((Number(sourceModal.glowSpeedDraft) || 1) - (Number(state.glowSpeed) || 1)) > 0.001) changes.push(`Velocita glow: ${formatColorSpeed(sourceModal.glowSpeedDraft)}`);
        if (Boolean(sourceModal.glowsEnabledDraft) !== state.glowsEnabled) changes.push(`Glow home`);
        if (Boolean(sourceModal.clickSoundsDraft) !== state.clickSounds) changes.push(`Suoni click`);
        if (Math.abs((Number(sourceModal.clickVolumeDraft) || 0) - (Number(state.clickVolume) || 0)) > 0.001) changes.push(`Volume click: ${formatVolume(sourceModal.clickVolumeDraft)}`);
        if ((sourceModal.clickStyleDraft || "soft") !== (state.clickStyle || "soft")) changes.push(`Stile click: ${sourceModal.clickStyleDraft}`);
        if (Boolean(sourceModal.musicEnabledDraft) !== state.musicEnabled) changes.push(`Musica ambiente`);
        if (Math.abs((Number(sourceModal.musicVolumeDraft) || 0) - (Number(state.musicVolume) || 0)) > 0.001) changes.push(`Volume musica: ${formatVolume(sourceModal.musicVolumeDraft)}`);
        if ((sourceModal.musicTrackDraft || "nebula") !== (state.musicTrack || "nebula")) changes.push(`Traccia musica: ${sourceModal.musicTrackDraft}`);
        [["background", "Glow generale"], ["spider", "Glow Spider-Man"], ["mcu", "Glow MCU"], ["xmen", "Glow X-Men"], ["series", "Glow Cosmic"]].forEach(([key, label]) => {
          if (JSON.stringify(sourceModal.glowsDraft[key]) !== JSON.stringify(state.glows[key])) changes.push(label);
        });
        [["background", "Glow generale"], ["spider", "Glow Spider-Man"], ["mcu", "Glow MCU"], ["xmen", "Glow X-Men"], ["series", "Glow Cosmic"]].forEach(([key, label]) => {
          if (JSON.stringify(sourceModal.glowTuningDraft[key]) !== JSON.stringify(state.glowTuning[key])) changes.push(`${label} ritmo`);
        });
        return changes;
      }

      function getProfileChanges(sourceModal = state.modal) {
        if (!sourceModal || sourceModal.mode !== "profile") return [];
        const changes = [];
        if (String(sourceModal.profileNicknameDraft || "").trim() !== String(state.profile.nickname || "").trim()) changes.push(`Nome profilo`);
        if (Boolean(sourceModal.profileShowEmailDraft) !== Boolean(state.profile.showEmail)) changes.push(`Mostra email profilo`);
        return changes;
      }

      function renderGlowSection(title, note, groupKey, slots) {
        const draft = state.modal && state.modal.mode === "settings" ? state.modal.glowsDraft[groupKey] : state.glows[groupKey];
        const tuning = state.modal && state.modal.mode === "settings" ? state.modal.glowTuningDraft[groupKey] : state.glowTuning[groupKey];
        return `
          <div class="settings-section" data-glow-section="${groupKey}">
            <div class="glow-section-head">
              <div>
                <span class="settings-label">${escapeHtml(title)}</span>
                <p class="settings-note">${escapeHtml(note)}</p>
              </div>
              <div class="glow-preview" data-glow-preview="${groupKey}" style="--preview-a:${escapeHtml(draft.a)};--preview-b:${escapeHtml(draft.b || draft.c || draft.d || draft.a)}"></div>
            </div>
            <div class="glow-grid">
                ${slots.map((slot) => `
                <label class="color-chip">
                  <span>${escapeHtml(slot.label)}</span>
                  <input class="color-picker" type="color" data-action="settings-glow" data-glow-key="${groupKey}" data-glow-slot="${slot.key}" value="${escapeHtml(draft[slot.key])}" />
                </label>
              `).join("")}
            </div>
            <div class="glow-tuning">
              <label class="switch-shell range-shell">
                <div class="switch-copy">
                  <div class="switch-text">Velocita</div>
                  <div class="switch-subtext">Aumenta o rallenta questo glow.</div>
                </div>
                <div class="range-stack">
                  <input class="range-input" type="range" min="0.55" max="2.2" step="0.05" data-action="settings-glow-tune-speed" data-glow-key="${groupKey}" value="${escapeHtml(tuning.speed)}" />
                  <div class="range-readout" data-glow-readout="${groupKey}-speed">${escapeHtml(formatColorSpeed(tuning.speed))}</div>
                </div>
              </label>
              <label class="switch-shell range-shell">
                <div class="switch-copy">
                  <div class="switch-text">Intensita</div>
                  <div class="switch-subtext">Regola la forza dell'aura.</div>
                </div>
                <div class="range-stack">
                  <input class="range-input" type="range" min="0.55" max="1.6" step="0.05" data-action="settings-glow-tune-strength" data-glow-key="${groupKey}" value="${escapeHtml(tuning.strength)}" />
                  <div class="range-readout" data-glow-readout="${groupKey}-strength">${escapeHtml(formatColorSpeed(tuning.strength))}</div>
                </div>
              </label>
            </div>
          </div>
        `;
      }

      function renderMetricCard(value, label, note) {
        return `
          <article class="metric-card">
            <p class="metric-value">${escapeHtml(value)}</p>
            <p class="metric-label">${escapeHtml(label)}</p>
            ${note ? `<p class="metric-note">${escapeHtml(note)}</p>` : ""}
          </article>
        `;
      }

      function renderTopRatedEntry(entry) {
        const theme = entry.group ? entry.group.theme : entry.root.theme;
        const context = `${entry.root.title} • ${entry.group ? entry.group.title : "Titolo diretto"}`;
        const score = `${Number(entry.item.rating || 0)}/5`;
        return `
          <button class="nav-root ${theme}" data-action="open-rated-item" data-root-id="${entry.root.id}" data-group-id="${entry.group ? entry.group.id : ""}" data-scope="${entry.group ? "group" : "root"}">
            <span class="nav-copy">
              <span class="nav-tag">Meglio votati</span>
              <span class="nav-title">${escapeHtml(entry.item.title)}</span>
              <span class="nav-meta">${escapeHtml(context)}</span>
            </span>
            <span class="nav-score">${escapeHtml(score)}</span>
          </button>
        `;
      }

      function renderHomeScheduleEntry(entryLookup, scheduleEntry) {
        const binding = getScheduleBinding(entryLookup, scheduleEntry);
        const seenButton = binding
          ? `<button type="button" class="seen-btn ${binding.item.seen ? "on" : ""}" data-action="toggle-seen" data-root-id="${binding.root.id}" data-group-id="${binding.group ? binding.group.id : ""}" data-item-id="${binding.item.id}" data-scope="${binding.group ? "group" : "root"}">${binding.item.seen ? "Visto" : "Non visto"}</button>`
          : "";
        return `
          <div class="plan-entry">
            <div class="plan-entry-copy">
              <div class="plan-entry-top">
                ${scheduleEntry.day ? `<span class="plan-entry-day">${escapeHtml(scheduleEntry.day)}</span>` : ""}
                <span class="plan-entry-title">${escapeHtml(scheduleEntry.title)}</span>
              </div>
              ${scheduleEntry.note ? `<p class="plan-entry-note">${escapeHtml(scheduleEntry.note)}</p>` : ""}
            </div>
            ${seenButton}
          </div>
        `;
      }

      function renderRoadmapWeek(entryLookup, week) {
        const title = week.title ? `<p class="plan-week-title">${escapeHtml(week.title)}</p>` : "";
        const note = week.note ? `<p class="plan-phase-note">${escapeHtml(week.note)}</p>` : "";
        const entries = week.entries && week.entries.length
          ? `<div class="plan-entry-list">${week.entries.map((entry) => renderHomeScheduleEntry(entryLookup, entry)).join("")}</div>`
          : `<div class="plan-note-row">${escapeHtml(week.note || "Nessuna tappa fissata per questa finestra.")}</div>`;
        return `
          <div class="plan-week">
            ${title}
            ${note}
            ${entries}
          </div>
        `;
      }

      function renderHomeSchedulePanel() {
        const entryLookup = buildEntryLookup();
        const stats = getHomeScheduleStats(entryLookup);
        return `
          <section class="card home-plan-card mcu">
            <div class="home-plan-head">
              <button class="home-plan-toggle" type="button" data-action="open-roadmap">
                <div class="home-plan-copy">
                  <p class="section-label">Piano settimanale</p>
                  <h2 class="home-plan-title">Roadmap Marvel</h2>
                  <p class="home-plan-meta">Percorso aggiornato dall'inizio MCU fino a Endgame del 25 settembre e Doomsday del 18 dicembre.</p>
                  <div class="home-plan-summary">
                    <span class="plan-pill">Fino al finale</span>
                    <span class="plan-pill">${stats.seen}/${stats.total || 0} tappe viste</span>
                  </div>
                </div>
                <span class="arrow">▶</span>
              </button>
              <div class="home-plan-actions">
                <button class="action-btn danger" type="button" data-action="delete-roadmap">Elimina roadmap</button>
              </div>
            </div>
            <p class="home-plan-meta" style="margin-top:16px">Aprila per vedere tutte le settimane in ordine cronologico, con i tasti Visto / Non visto collegati ai prodotti reali.</p>
          </section>
        `;
      }

      function renderHiddenRoadmapCard() {
        return `
          <section class="card roadmap-hidden-card mcu">
            <div class="roadmap-hidden-copy">
              <p class="section-label">Roadmap nascosta</p>
              <h2 class="roadmap-hidden-title">La roadmap e stata rimossa dalla home</h2>
              <p class="roadmap-hidden-note">Puoi ripristinarla quando vuoi senza toccare i tuoi progressi Visto / Non visto gia segnati.</p>
            </div>
            <button class="action-btn green" type="button" data-action="restore-roadmap">Ripristina roadmap</button>
          </section>
        `;
      }

      function renderRoadmapModal() {
        if (!state.modal || state.modal.mode !== "roadmap") return "";
        const closing = Boolean(state.modalClosingToken);
        const stable = !closing && overlayRenderState.modalStable;
        const entryLookup = buildEntryLookup();
        const stats = getHomeScheduleStats(entryLookup);
        return `
          <div class="modal-backdrop ${closing ? "closing" : stable ? "stable" : ""}">
            <div class="modal-card roadmap-modal-card ${closing ? "closing" : stable ? "stable" : ""}">
              <div class="roadmap-modal-head">
                <div class="roadmap-modal-copy">
                  <p class="modal-kicker">Roadmap</p>
                  <h3 class="modal-title">Roadmap aggiornata fino a Doomsday</h3>
                  <div class="home-plan-summary">
                    <span class="plan-pill">Percorso completo</span>
                    <span class="plan-pill">${stats.seen}/${stats.total || 0} tappe viste</span>
                  </div>
                </div>
                <div class="home-plan-actions">
                  <button class="action-btn" type="button" data-action="modal-cancel">Chiudi</button>
                </div>
              </div>
              <div class="roadmap-modal-stack">
                ${homeScheduleSections.map((section) => `
                  <section class="plan-phase">
                    <div class="plan-phase-head">
                      <p class="section-label">${escapeHtml(section.subtitle)}</p>
                      <h3 class="plan-phase-title">${escapeHtml(section.title)}</h3>
                      ${section.note ? `<p class="plan-phase-note">${escapeHtml(section.note)}</p>` : ""}
                    </div>
                    ${(section.weeks || []).map((week) => renderRoadmapWeek(entryLookup, week)).join("")}
                  </section>
                `).join("")}
              </div>
            </div>
          </div>
        `;
      }

      function renderRootNav(root) {
        const stats = getRootStats(root);
        const activeRootId = state.viewer ? state.viewer.rootId : null;
        const active = activeRootId === root.id ? " active" : "";
        return `
          <button class="nav-root ${root.theme}${active}" data-action="toggle-root" data-root-id="${root.id}">
            <span class="nav-copy">
              <span class="nav-tag">${escapeHtml(root.theme)}</span>
              <span class="nav-title">${escapeHtml(root.title)}</span>
              <span class="nav-meta">${escapeHtml(`${stats.seen}/${stats.total} visti • ${stats.groups} cartelle`)}</span>
            </span>
            <span class="arrow ${activeRootId === root.id ? "open" : ""}">▶</span>
          </button>
        `;
      }

      function renderStars(theme, rootId, groupId, itemId, value, scope) {
        return `<div class="stars">${[1, 2, 3, 4, 5].map((star) => {
          const activeClass = star <= value ? ` active ${theme}` : "";
          const glyph = star <= value ? "★" : "☆";
          return `<button type="button" class="star-btn${activeClass}" data-action="rate" data-root-id="${rootId}" data-group-id="${groupId || ""}" data-item-id="${itemId}" data-scope="${scope}" data-value="${star}" aria-label="Vota ${star} stelle">${glyph}</button>`;
        }).join("")}</div>`;
      }

      function renderItemCard(root, group, item, numbering, compact, scope) {
        const theme = group ? group.theme : root.theme;
        const editable = canEdit(item.userAdded);
        const meta = compact ? `<p class="item-meta">${escapeHtml(`${root.title} • ${group ? group.title : "Titolo diretto"}`)}</p>` : "";
        const note = item.note ? `<p class="item-note">${escapeHtml(item.note)}</p>` : "";
        const reviewKey = `${scope}:${root.id}:${group ? group.id : ""}:${item.id}`;
        const reviewOpen = Boolean(state.reviewPanels && state.reviewPanels[reviewKey]);
        const reviewChevron = `<span class="arrow ${reviewOpen ? "open" : ""}" aria-hidden="true">▶</span>`;
        const reviewOutput = `
          <div class="review-shell ${reviewOpen ? "open" : ""}">
            <button type="button" class="home-plan-toggle" data-action="toggle-review-panel" data-review-key="${escapeHtml(reviewKey)}" data-root-id="${root.id}" data-group-id="${group ? group.id : ""}" data-item-id="${item.id}" data-scope="${scope}" style="margin-top:12px">
              <div class="home-plan-copy">
                <p class="section-label">Recensione</p>
                <p class="home-plan-meta" style="margin:0">${item.review ? "Premi per leggere" : "Nessuna recensione ancora"}</p>
              </div>
              ${reviewChevron}
            </button>
            <div class="review-output${item.review ? "" : " review-empty"}">${escapeHtml(item.review || "Nessuna recensione ancora.")}</div>
          </div>
        `;
        const bg = item && item.bg && item.bg.dataUrl ? item.bg : null;
        const bgClass = bg ? " has-bg" : "";
        const bgStyle = bg ? ` style="--item-bg-image:url('${escapeHtml(bg.dataUrl)}');--item-bg-x:${escapeHtml(bg.x)}%;--item-bg-y:${escapeHtml(bg.y)}%;--item-bg-fade:${escapeHtml(bg.fade)}%;"` : "";
        const badge = "";
        const bgButton = `<button type="button" class="icon-btn bg-btn" data-action="open-item-bg" data-root-id="${root.id}" data-group-id="${group ? group.id : ""}" data-item-id="${item.id}" data-scope="${scope}" title="Sfondo immagine">🖼️</button>`;
        return `
          <article class="card item-card ${theme}${bgClass}"${bgStyle}>
            <div class="item-body">
              <div class="item-row">
                ${badge}
                <div class="item-main">
                  <div class="item-head">
                    <div class="item-copy">
                      <h3 class="item-title">${escapeHtml(item.title)}</h3>
                      ${meta}
                      ${note}
                      <div class="item-controls">
                        <button type="button" class="icon-btn" data-action="open-review-modal" data-root-id="${root.id}" data-group-id="${group ? group.id : ""}" data-item-id="${item.id}" data-scope="${scope}" title="Recensione">📝</button>
                        <button type="button" class="seen-btn ${item.seen ? "on" : ""}" data-action="toggle-seen" data-root-id="${root.id}" data-group-id="${group ? group.id : ""}" data-item-id="${item.id}" data-scope="${scope}">${item.seen ? "Visto" : "Non visto"}</button>
                        ${editable ? `<button type="button" class="icon-btn" data-action="edit-item" data-root-id="${root.id}" data-group-id="${group ? group.id : ""}" data-item-id="${item.id}" data-scope="${scope}" title="Modifica">✏️</button><button type="button" class="icon-btn" data-action="delete-item" data-root-id="${root.id}" data-group-id="${group ? group.id : ""}" data-item-id="${item.id}" data-scope="${scope}" title="Elimina">🗑️</button>` : ""}
                      </div>
                      <div class="item-rating-row">
                        ${renderStars(theme, root.id, group ? group.id : "", item.id, item.rating, scope)}
                        ${bgButton}
                      </div>
                      ${reviewOutput}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        `;
      }

      function getGroupIcon(group) {
        if (group.theme === "spider") return "🕷";
        if (group.theme === "xmen") return "🧬";
        if (group.kind === "series") return "🔮";
        return "🎬";
      }

      function renderGroupCard(root, group, numbering) {
        const icon = getGroupIcon(group);
        const isViewerOpen = Boolean(state.viewer && state.viewer.type === "group" && state.viewer.rootId === root.id && state.viewer.groupId === group.id);
        const bg = group && group.bg && group.bg.dataUrl ? group.bg : null;
        const bgClass = bg ? " has-bg" : "";
        const bgStyle = bg ? ` style="--item-bg-image:url('${escapeHtml(bg.dataUrl)}');--item-bg-x:${escapeHtml(bg.x)}%;--item-bg-y:${escapeHtml(bg.y)}%;--item-bg-fade:${escapeHtml(bg.fade)}%;"` : "";
        return `
          <section class="card group-card ${group.theme}${group.kind === "phase" ? " phase-card" : ""}${bgClass}"${bgStyle}>
            <div class="group-body">
              <div class="group-head">
                <button class="group-btn" data-action="toggle-group" data-root-id="${root.id}" data-group-id="${group.id}">
                  <div>
                    <h3 class="group-title"><span>${icon}</span><span>${escapeHtml(group.title)}</span></h3>
                    <p class="group-meta">${escapeHtml(formatGroupMeta(group))}</p>
                  </div>
                  <span class="arrow ${isViewerOpen ? "open" : ""}">▶</span>
                </button>
              </div>
            </div>
          </section>
        `;
      }

      function renderRootCard(root, numbering) {
        const isViewerOpen = Boolean(state.viewer && state.viewer.rootId === root.id);
        return `
          <section class="card root-card ${root.theme} ${isViewerOpen ? "is-open" : ""}">
            <div class="root-body">
              <button class="root-btn" data-action="toggle-root" data-root-id="${root.id}">
                <div>
                  <h2 class="root-name">${escapeHtml(root.title)}</h2>
                  <p class="root-meta">${escapeHtml(formatRootMeta(root))}</p>
                </div>
                <span class="arrow ${isViewerOpen ? "open" : ""}">▶</span>
              </button>
            </div>
          </section>
        `;
      }

      function renderRootViewer(root, numbering) {
        const editable = canEdit(root.userCreated);
        const canAddRootItems = canAddDirectTitles(root);
        const directItemsSection = root.items.length
          ? `
            <section class="viewer-section">
              <p class="section-label">Titoli diretti</p>
              <div class="viewer-section-body item-list">
                ${root.items.map((item) => renderItemCard(root, null, item, numbering, false, "root")).join("")}
              </div>
            </section>
          `
          : "";
        const groupsSection = root.groups.length
          ? `
            <section class="viewer-section">
              <p class="section-label">Cartelle</p>
              <div class="viewer-section-body group-list">
                ${root.groups.map((group) => renderGroupCard(root, group, numbering)).join("")}
              </div>
            </section>
          `
          : "";
        const empty = !root.items.length && !root.groups.length ? `<div class="empty">Questa macro-cartella e vuota. Aggiungi una cartella o un titolo diretto.</div>` : "";
        const rootSectionsClass = root.items.length && root.groups.length ? "viewer-sections viewer-root-sections" : "viewer-sections viewer-root-sections single";
        return `
          <section class="card viewer-panel root-card ${root.theme}">
            <div class="viewer-shell">
              <div class="viewer-head">
                <div class="viewer-copy">
                  <p class="modal-kicker">Macro-cartella</p>
                  <h2 class="viewer-title">${escapeHtml(root.title)}</h2>
                  <p class="viewer-meta">${escapeHtml(formatRootMeta(root))}</p>
                </div>
                <div class="viewer-head-actions">
                  <button class="action-btn" data-action="viewer-close">Chiudi</button>
                </div>
              </div>
              <div class="viewer-toolbar">
                <button class="action-btn green" data-action="add-group" data-root-id="${root.id}">＋ Aggiungi cartella</button>
                ${canAddRootItems ? `<button class="action-btn green" data-action="add-root-item" data-root-id="${root.id}">＋ Aggiungi titolo</button>` : ""}
                ${editable ? `<button class="action-btn" data-action="edit-root" data-root-id="${root.id}">✏️ Modifica macro-cartella</button><button class="action-btn danger" data-action="delete-root" data-root-id="${root.id}">🗑️ Elimina macro-cartella</button>` : ""}
              </div>
              <div class="viewer-panel-body scroll-shell" data-viewer-scroll="main">
                <div class="${rootSectionsClass}">
                  ${directItemsSection}
                  ${groupsSection}
                  ${empty}
                </div>
              </div>
            </div>
          </section>
        `;
      }

      function renderGroupViewer(root, group, numbering) {
        const editable = canEdit(group.userCreated);
        const canAddItems = canAddTitlesToGroup(root, group);
        const canSetBackground = canCustomizeGroupBackground(group);
        const siblings = getAdjacentGroups(root, group.id);
        const bg = group && group.bg && group.bg.dataUrl ? group.bg : null;
        const bgClass = bg ? " has-bg" : "";
        const bgStyle = bg ? ` style="--item-bg-image:url('${escapeHtml(bg.dataUrl)}');--item-bg-x:${escapeHtml(bg.x)}%;--item-bg-y:${escapeHtml(bg.y)}%;--item-bg-fade:${escapeHtml(bg.fade)}%;"` : "";
        const items = group.items.length
          ? group.items.map((item) => renderItemCard(root, group, item, numbering, false, "group")).join("")
          : `<div class="empty">Questa cartella e pronta per nuovi titoli.</div>`;
        return `
          <section class="card viewer-panel group-card ${group.theme}${group.kind === "phase" ? " phase-card" : ""}${bgClass}"${bgStyle}>
            <div class="viewer-shell">
              <div class="viewer-head">
                <div class="viewer-copy">
                  <p class="modal-kicker">${escapeHtml(root.title)}</p>
                  <div class="viewer-phase-switch">
                    <button class="viewer-phase-nav" type="button" data-action="viewer-prev-group" data-root-id="${root.id}" data-group-id="${group.id}" ${siblings.previous ? "" : "disabled"} aria-label="Cartella precedente">&lt;</button>
                    <h2 class="viewer-title">${escapeHtml(group.title)}</h2>
                    <button class="viewer-phase-nav" type="button" data-action="viewer-next-group" data-root-id="${root.id}" data-group-id="${group.id}" ${siblings.next ? "" : "disabled"} aria-label="Cartella successiva">&gt;</button>
                  </div>
                  <p class="viewer-meta">${escapeHtml(formatGroupMeta(group))}</p>
                  <p class="viewer-context">${escapeHtml(`Dentro ${root.title}`)}</p>
                </div>
                <div class="viewer-head-actions">
                  <button class="action-btn" data-action="viewer-back" data-root-id="${root.id}">Indietro</button>
                  <button class="action-btn" data-action="viewer-close">Chiudi</button>
                </div>
              </div>
              <div class="viewer-toolbar">
                ${canAddItems ? `<button class="action-btn green" data-action="add-group-item" data-root-id="${root.id}" data-group-id="${group.id}">＋ Aggiungi titolo</button>` : ""}
                ${canSetBackground ? `<button class="action-btn" data-action="open-group-bg" data-root-id="${root.id}" data-group-id="${group.id}">🖼️ Sfondo</button>` : ""}
                ${editable ? `<button class="action-btn" data-action="edit-group" data-root-id="${root.id}" data-group-id="${group.id}">✏️ Modifica</button><button class="action-btn danger" data-action="delete-group" data-root-id="${root.id}" data-group-id="${group.id}">🗑️ Elimina</button>` : ""}
              </div>
              <div class="viewer-panel-body scroll-shell" data-viewer-scroll="main">
                <div class="viewer-sections">
                  <section class="viewer-section">
                    <p class="section-label">Prodotti</p>
                    <div class="viewer-section-body item-list">
                      ${items}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </section>
        `;
      }

      function renderViewer(numbering) {
        if (!state.viewer) return "";
        const root = getRoot(state.viewer.rootId);
        if (!root) return "";
        const group = state.viewer.type === "group" ? getGroup(root.id, state.viewer.groupId) : null;
        if (state.viewer.type === "group" && !group) return "";
        const closing = Boolean(state.viewerClosingToken);
        const stable = !closing && overlayRenderState.viewerStable;
        const content = state.viewer.type === "group"
          ? renderGroupViewer(root, group, numbering)
          : renderRootViewer(root, numbering);
        return `
          <div class="viewer-backdrop ${closing ? "closing" : stable ? "stable" : ""}">
            ${content.replace('viewer-panel ', `viewer-panel ${closing ? "closing " : stable ? "stable " : ""}`)}
          </div>
        `;
      }

      function renderGroup(root, group, numbering) {
        return renderGroupCard(root, group, numbering);
        const isOpen = state.openGroups[root.id] === group.id;
        const isClosing = Boolean(state.closingPanel && state.closingPanel.type === "group" && state.closingPanel.rootId === root.id && state.closingPanel.groupId === group.id);
        const shouldAnimate = isOpen && !isClosing && state.animationTarget && state.animationTarget.type === "group" && state.animationTarget.rootId === root.id && state.animationTarget.groupId === group.id;
        const icon = group.theme === "spider" ? "🕷" : group.theme === "xmen" ? "🧬" : group.kind === "series" ? "🔮" : "🎬";
        const editable = canEdit(group.userCreated);
        const canAddItems = canAddTitlesToGroup(root, group);
        const items = group.items.length
          ? group.items.map((item) => renderItemCard(root, group, item, numbering, false, "group")).join("")
          : `<div class="empty">Questa cartella e pronta per nuovi titoli.</div>`;
        return `
          <section class="card group-card ${group.theme}${group.kind === "phase" ? " phase-card" : ""}">
            <div class="group-body">
              <div class="group-head">
                <button class="group-btn" data-action="toggle-group" data-root-id="${root.id}" data-group-id="${group.id}">
                  <div>
                    <h3 class="group-title"><span>${icon}</span><span>${escapeHtml(group.title)}</span></h3>
                    <p class="group-meta">${escapeHtml(formatGroupMeta(group))}</p>
                  </div>
                  <span class="arrow ${isOpen && !isClosing ? "open" : ""}">▶</span>
                </button>
              </div>
              <div class="group-toolbar" style="margin-top:12px">
                ${canAddItems ? `<button class="action-btn green" data-action="add-group-item" data-root-id="${root.id}" data-group-id="${group.id}">＋ Aggiungi titolo</button>` : ""}
                ${editable ? `<button class="action-btn" data-action="edit-group" data-root-id="${root.id}" data-group-id="${group.id}">✏️ Modifica</button><button class="action-btn danger" data-action="delete-group" data-root-id="${root.id}" data-group-id="${group.id}">🗑️ Elimina</button>` : ""}
              </div>
            </div>
            <div class="expando ${isClosing ? "closing" : isOpen ? "open" : ""} ${shouldAnimate ? "animate" : ""}">
              <div class="expando-inner">
                <div class="item-list scroll-shell group-items">${items}</div>
              </div>
            </div>
          </section>
        `;
      }

      function renderRoot(root, numbering) {
        return renderRootCard(root, numbering);
        const isOpen = state.openRootId === root.id;
        const isClosing = Boolean(state.closingPanel && state.closingPanel.type === "root" && state.closingPanel.rootId === root.id);
        const shouldAnimate = isOpen && !isClosing && state.animationTarget && state.animationTarget.type === "root" && state.animationTarget.rootId === root.id;
        const hasOpenGroup = Boolean(state.openGroups[root.id]);
        const editable = canEdit(root.userCreated);
        const canAddRootItems = canAddDirectTitles(root);
        const bg = root && root.bg && root.bg.dataUrl ? root.bg : null;
        const bgClass = bg ? " has-bg" : "";
        const bgStyle = bg ? ` style="--item-bg-image:url('${escapeHtml(bg.dataUrl)}');--item-bg-x:${escapeHtml(bg.x)}%;--item-bg-y:${escapeHtml(bg.y)}%;--item-bg-fade:${escapeHtml(bg.fade)}%;"` : "";
        const directItems = root.items.length
          ? `<div class="root-column"><p class="section-label">Titoli diretti</p><div class="item-list scroll-shell direct-items">${root.items.map((item) => renderItemCard(root, null, item, numbering, false, "root")).join("")}</div></div>`
          : "";
        const groups = root.groups.length
          ? `<div class="root-column"><p class="section-label">Cartelle</p><div class="group-list scroll-shell root-groups-scroll${hasOpenGroup ? " has-open-group" : ""}">${root.groups.map((group) => renderGroup(root, group, numbering)).join("")}</div></div>`
          : "";
        const empty = !root.items.length && !root.groups.length ? `<div class="empty">Questa macro-cartella e vuota. Aggiungi una cartella o un titolo diretto.</div>` : "";
        return `
          <section class="card root-card ${root.theme}${bgClass} ${isOpen ? "is-open" : ""}"${bgStyle}>
            <div class="root-body">
              <button class="root-btn" data-action="toggle-root" data-root-id="${root.id}">
                <div>
                  <h2 class="root-name">${escapeHtml(root.title)}</h2>
                  <p class="root-meta">${escapeHtml(formatRootMeta(root))}</p>
                </div>
                <span class="arrow ${isOpen && !isClosing ? "open" : ""}">▶</span>
              </button>
            </div>
            <div class="expando ${isClosing ? "closing" : isOpen ? "open" : ""} ${shouldAnimate ? "animate" : ""}">
              <div class="expando-inner">
                <div class="root-toolbar" style="margin-bottom:14px">
                  <button class="action-btn green" data-action="add-group" data-root-id="${root.id}">＋ Aggiungi cartella</button>
                  ${canAddRootItems ? `<button class="action-btn green" data-action="add-root-item" data-root-id="${root.id}">＋ Aggiungi titolo</button>` : ""}
                  <button class="action-btn" data-action="open-root-bg" data-root-id="${root.id}">🖼️ Sfondo</button>
                  ${editable ? `<button class="action-btn" data-action="edit-root" data-root-id="${root.id}">✏️ Modifica macro-cartella</button><button class="action-btn danger" data-action="delete-root" data-root-id="${root.id}">🗑️ Elimina macro-cartella</button>` : ""}
                </div>
                <div class="root-columns">
                  ${directItems}
                  ${groups}
                  ${empty}
                </div>
              </div>
            </div>
          </section>
        `;
      }

      function renderSettingsModal() {
        if (!state.modal || state.modal.mode !== "settings") return "";
        const closing = Boolean(state.modalClosingToken);
        const stable = !closing && overlayRenderState.modalStable;
        const clickStyleOptions = clickStyleChoices.map((choice) => `<option value="${choice.value}"${state.modal.clickStyleDraft === choice.value ? " selected" : ""}>${choice.label}</option>`).join("");
        const musicTrackOptions = musicTrackChoices.map((choice) => `<option value="${choice.value}"${state.modal.musicTrackDraft === choice.value ? " selected" : ""}>${choice.label}</option>`).join("");
        return `
          <div class="modal-backdrop ${closing ? "closing" : stable ? "stable" : ""}">
            <div class="modal-card settings-card ${closing ? "closing" : stable ? "stable" : ""}">
              <div class="settings-top">
                <div>
                  <p class="modal-kicker">Impostazioni</p>
                  <h3 class="modal-title">Personalizza tutto</h3>
                </div>
              </div>
              <div class="settings-footer">
                <button class="action-btn danger" data-action="settings-reset">Reset dati</button>
                <div class="settings-actions">
                  <button class="action-btn" data-action="modal-cancel">Chiudi</button>
                  <button class="action-btn green" data-action="settings-save">Salva e chiudi</button>
                </div>
              </div>
              <div class="settings-body">
                <div class="settings-grid settings-main-grid">
                <label class="settings-section settings-name-section">
                  <div>
                    <span class="settings-label">Nome app</span>
                    <p class="settings-note">Cambia il nome visibile nella home.</p>
                  </div>
                  <input class="modal-input" data-action="settings-name" data-focus-key="settings-name" value="${escapeHtml(state.modal.appNameDraft)}" placeholder="Nome app" />
                </label>
                <div class="settings-section settings-experience-section">
                  <div>
                    <span class="settings-label">Esperienza</span>
                    <p class="settings-note">Tieni tutto semplice oppure sblocca piu controlli.</p>
                  </div>
                  <div class="switch-shell">
                    <div class="switch-copy">
                      <div class="switch-text">Modalita libera</div>
                      <div class="switch-subtext">Sblocca modifica ed eliminazione su tutto.</div>
                    </div>
                    <button class="switch-btn ${state.modal.freeEditDraft ? "on" : ""}" data-settings-switch="free-edit" data-action="settings-toggle-free-edit" type="button" aria-label="Modalita libera"></button>
                  </div>
                  <div class="switch-shell">
                    <div class="switch-copy">
                      <div class="switch-text">Animazioni boost</div>
                      <div class="switch-subtext">Aumenta bounce, glow e movimento delle card.</div>
                    </div>
                    <button class="switch-btn ${state.modal.motionBoostDraft ? "on" : ""}" data-settings-switch="motion" data-action="settings-toggle-motion" type="button" aria-label="Animazioni boost"></button>
                  </div>
                  <div class="switch-shell">
                    <div class="switch-copy">
                      <div class="switch-text">Glow attivi</div>
                      <div class="switch-subtext">Accende o spegne glow, pulse e aure in tutta l'app.</div>
                    </div>
                    <button class="switch-btn ${state.modal.glowsEnabledDraft ? "on" : ""}" data-settings-switch="glows" data-action="settings-toggle-glows" type="button" aria-label="Glow attivi"></button>
                  </div>
                  <div class="switch-shell range-shell">
                    <div class="switch-copy">
                      <div class="switch-text">Velocita colori</div>
                      <div class="switch-subtext">Rallenta o accelera glow, sfondo e scie colore.</div>
                    </div>
                    <div class="range-stack">
                      <input class="range-input" type="range" min="0.55" max="1.9" step="0.05" data-action="settings-color-speed" data-focus-key="settings-color-speed" value="${escapeHtml(state.modal.colorSpeedDraft)}" />
                      <div class="range-readout" data-settings-readout="color-speed">${escapeHtml(formatColorSpeed(state.modal.colorSpeedDraft))}</div>
                    </div>
                  </div>
                  <div class="switch-shell range-shell">
                    <div class="switch-copy">
                      <div class="switch-text">Velocita glow</div>
                      <div class="switch-subtext">Aumenta o riduce la velocita di pulse e aure.</div>
                    </div>
                    <div class="range-stack">
                      <input class="range-input" type="range" min="0.55" max="2.2" step="0.05" data-action="settings-glow-speed" data-focus-key="settings-glow-speed" value="${escapeHtml(state.modal.glowSpeedDraft)}" />
                      <div class="range-readout" data-settings-readout="glow-speed">${escapeHtml(formatColorSpeed(state.modal.glowSpeedDraft))}</div>
                    </div>
                  </div>
                </div>
                <div class="settings-section settings-audio-section">
                  <div>
                    <span class="settings-label">Audio</span>
                    <p class="settings-note">Suoni leggeri sui click e musica ambient regolabile in tempo reale.</p>
                  </div>
                  <div class="switch-shell">
                    <div class="switch-copy">
                      <div class="switch-text">Suoni click</div>
                      <div class="switch-subtext">Piccolo feedback sonoro sui tasti e sulle interazioni.</div>
                    </div>
                    <button class="switch-btn ${state.modal.clickSoundsDraft ? "on" : ""}" data-settings-switch="click-sounds" data-action="settings-toggle-click-sounds" type="button" aria-label="Suoni click"></button>
                  </div>
                  <div class="switch-shell range-shell">
                    <div class="switch-copy">
                      <div class="switch-text">Volume click</div>
                      <div class="switch-subtext">Regola il livello dei suoni di interazione.</div>
                    </div>
                    <div class="range-stack">
                      <input class="range-input" type="range" min="0" max="1" step="0.01" data-action="settings-click-volume" data-focus-key="settings-click-volume" value="${escapeHtml(state.modal.clickVolumeDraft)}" />
                      <div class="range-readout" data-settings-readout="click-volume">${escapeHtml(formatVolume(state.modal.clickVolumeDraft))}</div>
                    </div>
                  </div>
                  <label class="switch-shell range-shell">
                    <div class="switch-copy">
                      <div class="switch-text">Stile click</div>
                      <div class="switch-subtext">Scegli il carattere sonoro dei feedback sui pulsanti.</div>
                    </div>
                    <select class="modal-select" data-action="settings-click-style" data-focus-key="settings-click-style">
                      ${clickStyleOptions}
                    </select>
                  </label>
                  <div class="switch-shell">
                    <div class="switch-copy">
                      <div class="switch-text">Musica ambiente</div>
                      <div class="switch-subtext">Pad soft in sottofondo. Parte dal primo click permesso dal browser.</div>
                    </div>
                    <button class="switch-btn ${state.modal.musicEnabledDraft ? "on" : ""}" data-settings-switch="music" data-action="settings-toggle-music" type="button" aria-label="Musica ambiente"></button>
                  </div>
                  <label class="switch-shell range-shell">
                    <div class="switch-copy">
                      <div class="switch-text">Traccia musica</div>
                      <div class="switch-subtext">Scegli una traccia generativa diversa per il sottofondo.</div>
                    </div>
                    <select class="modal-select" data-action="settings-music-track" data-focus-key="settings-music-track">
                      ${musicTrackOptions}
                    </select>
                  </label>
                  <div class="switch-shell range-shell">
                    <div class="switch-copy">
                      <div class="switch-text">Volume musica</div>
                      <div class="switch-subtext">Alza o abbassa il sottofondo ambient.</div>
                    </div>
                    <div class="range-stack">
                      <input class="range-input" type="range" min="0" max="1" step="0.01" data-action="settings-music-volume" data-focus-key="settings-music-volume" value="${escapeHtml(state.modal.musicVolumeDraft)}" />
                      <div class="range-readout" data-settings-readout="music-volume">${escapeHtml(formatVolume(state.modal.musicVolumeDraft))}</div>
                    </div>
                  </div>
                </div>
                ${renderGlowSection("Glow generale", "Controlla l'aura dello sfondo e della home.", "background", [{ key: "a", label: "Aura 1" }, { key: "b", label: "Aura 2" }, { key: "c", label: "Aura 3" }, { key: "d", label: "Aura 4" }])}
                ${renderGlowSection("Glow Spider-Man", "Usato per Spider-Man Universe e temi Spider-Man.", "spider", [{ key: "a", label: "Glow 1" }, { key: "b", label: "Glow 2" }])}
                ${renderGlowSection("Glow MCU", "Usato per MCU e fasi principali.", "mcu", [{ key: "a", label: "Glow 1" }, { key: "b", label: "Glow 2" }])}
                ${renderGlowSection("Glow X-Men", "Il glow X-Men ora si cambia solo qui.", "xmen", [{ key: "a", label: "Glow 1" }, { key: "b", label: "Glow 2" }])}
                ${renderGlowSection("Glow Cosmic", "Usato per serie chiave e sezioni cosmic.", "series", [{ key: "a", label: "Glow 1" }, { key: "b", label: "Glow 2" }])}
                </div>
              </div>
            </div>
          </div>
        `;
      }

      function renderSettingsConfirmModal() {
        if (!state.modal || state.modal.mode !== "settings-confirm-close") return "";
        const closing = Boolean(state.modalClosingToken);
        const stable = !closing && overlayRenderState.modalStable;
        return `
          <div class="modal-backdrop ${closing ? "closing" : stable ? "stable" : ""}">
            <div class="modal-card ${closing ? "closing" : stable ? "stable" : ""}">
              <p class="modal-kicker">Impostazioni</p>
              <h3 class="modal-title">Vuoi salvare prima di chiudere?</h3>
              <p class="modal-name">Hai modificato ${state.modal.changes.length} impostazioni.</p>
              <div class="changes-list">
                ${state.modal.changes.map((change) => `<span class="change-pill">${escapeHtml(change)}</span>`).join("")}
              </div>
              <div class="modal-actions" style="justify-content:space-between;margin-top:18px">
                <button class="action-btn" data-action="settings-keep-editing">Continua</button>
                <div class="settings-actions">
                  <button class="action-btn danger" data-action="settings-discard-close">Chiudi senza salvare</button>
                  <button class="action-btn green" data-action="settings-save-close">Salva e chiudi</button>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      function renderProfileModal() {
        if (!state.modal || state.modal.mode !== "profile") return "";
        const closing = Boolean(state.modalClosingToken);
        const stable = !closing && overlayRenderState.modalStable;
        const profileDisplayName = getProfileDisplayName(state.profile, state.modal.profileNicknameDraft);
        const profileSecondary = getProfileSecondary(state.profile, state.modal.profileShowEmailDraft);
        const profileAvatarMarkup = state.profile.picture
          ? `<img src="${escapeHtml(state.profile.picture)}" alt="Foto profilo Google" />`
          : `<span>${escapeHtml(getProfileInitials(state.profile, state.modal.profileNicknameDraft))}</span>`;
        const googleStatus = hasGoogleProfile(state.profile) ? "Connesso" : "Non connesso";
        return `
          <div class="modal-backdrop ${closing ? "closing" : stable ? "stable" : ""}">
            <div class="modal-card settings-card ${closing ? "closing" : stable ? "stable" : ""}">
              <div class="settings-top">
                <div>
                  <p class="modal-kicker">Profilo</p>
                  <h3 class="modal-title">Account e privacy</h3>
                </div>
              </div>
              <div class="settings-footer">
                <div class="settings-actions">
                  <button class="action-btn" data-action="modal-cancel">Chiudi</button>
                  <button class="action-btn green" data-action="profile-save">Salva e chiudi</button>
                </div>
              </div>
              <div class="settings-body">
                <div class="settings-grid settings-main-grid">
                  <div class="settings-section settings-profile-section">
                    <div>
                      <span class="settings-label">Profilo</span>
                      <p class="settings-note">Gestisci nome, privacy ed accesso Google. Stato: ${escapeHtml(googleStatus)}.</p>
                    </div>
                    <div class="profile-card">
                      <div class="profile-avatar">
                        ${profileAvatarMarkup}
                      </div>
                      <div class="profile-copy">
                        <div class="switch-text" data-profile-display-name>${escapeHtml(profileDisplayName)}</div>
                        <div class="switch-subtext" data-profile-display-secondary>${escapeHtml(profileSecondary)}</div>
                      </div>
                    </div>
                    <label class="switch-shell range-shell">
                      <div class="switch-copy">
                        <div class="switch-text">Nickname profilo</div>
                        <div class="switch-subtext">Sovrascrive il nome Google solo dentro questa app.</div>
                      </div>
                      <input class="modal-input" data-action="profile-nickname" data-focus-key="profile-nickname" value="${escapeHtml(state.modal.profileNicknameDraft)}" placeholder="Nickname profilo" />
                    </label>
                    <div class="switch-shell">
                      <div class="switch-copy">
                        <div class="switch-text">Mostra email</div>
                        <div class="switch-subtext">Mostra o nasconde l'email nella UI.</div>
                      </div>
                      <button class="switch-btn ${state.modal.profileShowEmailDraft ? "on" : ""}" data-action="profile-toggle-email" type="button" aria-label="Mostra email profilo"></button>
                    </div>
                    <div class="profile-google-host" data-google-signin-host></div>
                    <p class="settings-note" data-google-profile-note></p>
                    ${hasGoogleProfile(state.profile) ? `<div class="settings-actions"><button class="action-btn danger" data-action="profile-signout">Disconnetti Google</button></div>` : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      function renderProfileConfirmModal() {
        if (!state.modal || state.modal.mode !== "profile-confirm-close") return "";
        const closing = Boolean(state.modalClosingToken);
        const stable = !closing && overlayRenderState.modalStable;
        return `
          <div class="modal-backdrop ${closing ? "closing" : stable ? "stable" : ""}">
            <div class="modal-card ${closing ? "closing" : stable ? "stable" : ""}">
              <p class="modal-kicker">Profilo</p>
              <h3 class="modal-title">Vuoi salvare prima di chiudere?</h3>
              <p class="modal-name">Hai modificato ${state.modal.changes.length} impostazioni profilo.</p>
              <div class="changes-list">
                ${state.modal.changes.map((change) => `<span class="change-pill">${escapeHtml(change)}</span>`).join("")}
              </div>
              <div class="modal-actions" style="justify-content:space-between;margin-top:18px">
                <button class="action-btn" data-action="profile-keep-editing">Continua</button>
                <div class="settings-actions">
                  <button class="action-btn danger" data-action="profile-discard-close">Chiudi senza salvare</button>
                  <button class="action-btn green" data-action="profile-save-close">Salva e chiudi</button>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      function renderBackgroundModal() {
        if (!state.modal || (state.modal.mode !== "item-bg" && state.modal.mode !== "group-bg" && state.modal.mode !== "root-bg")) return "";
        const closing = Boolean(state.modalClosingToken);
        const stable = !closing && overlayRenderState.modalStable;
        const targetKind = state.modal.targetKind || (state.modal.mode === "root-bg" ? "root" : state.modal.mode === "group-bg" ? "group" : "item");
        const hasImage = Boolean(state.modal.dataUrlDraft);
        const previewFrameClass = hasImage ? "bg-preview-frame is-editable" : "bg-preview-frame";
        const previewClass = hasImage ? " has-bg" : "";
        const previewStyle = hasImage
          ? ` style="--item-bg-image:url('${escapeHtml(state.modal.dataUrlDraft)}');--item-bg-x:${escapeHtml(state.modal.xDraft)}%;--item-bg-y:${escapeHtml(state.modal.yDraft)}%;--item-bg-fade:${escapeHtml(state.modal.fadeDraft)}%;"`
          : "";
        const previewTitle = targetKind === "root"
          ? escapeHtml(state.modal.rootTitle)
          : targetKind === "group"
            ? escapeHtml(state.modal.groupTitle)
            : escapeHtml(state.modal.itemTitle);
        const previewMeta = escapeHtml(state.modal.previewMeta || "");
        const previewTheme = escapeHtml(state.modal.theme || "mcu");
        const previewNote = state.modal.previewNote ? `<p class="item-note">${escapeHtml(state.modal.previewNote)}</p>` : "";
        const previewRating = Math.max(0, Math.min(5, Number(state.modal.previewRating) || 0));
        const previewSeen = Boolean(state.modal.previewSeen);
        const previewStars = targetKind === "item"
          ? `
            <div class="item-rating-row fake-toolbar">
              <div class="stars">
                ${[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= previewRating;
                  return `<button type="button" tabindex="-1" class="star-btn${active ? ` active ${previewTheme}` : ""}">${active ? "★" : "☆"}</button>`;
                }).join("")}
              </div>
              <button type="button" tabindex="-1" class="icon-btn bg-btn" aria-hidden="true">🖼️</button>
            </div>
          `
          : "";
        const previewMarkup = targetKind === "root"
          ? `
            <article class="card root-card ${previewTheme}${previewClass}"${previewStyle} aria-hidden="true">
              <div class="root-body">
                <div class="root-btn">
                  <div>
                    <h2 class="root-name">${previewTitle}</h2>
                    <p class="root-meta">${previewMeta}</p>
                  </div>
                  <span class="arrow open">▶</span>
                </div>
              </div>
              <div class="content divider">
                <div class="root-toolbar fake-toolbar">
                  <button class="action-btn green" type="button" tabindex="-1">＋ Aggiungi cartella</button>
                  <button class="action-btn green" type="button" tabindex="-1">＋ Aggiungi titolo</button>
                  <button class="action-btn" type="button" tabindex="-1">🖼️ Sfondo</button>
                </div>
              </div>
            </article>
          `
          : targetKind === "group"
            ? `
            <article class="card group-card ${previewTheme}${previewClass}"${previewStyle} aria-hidden="true">
              <div class="group-body">
                <div class="group-head">
                  <div class="group-btn">
                    <div>
                      <h3 class="group-title"><span>${previewTheme === "spider" ? "🕷" : previewTheme === "xmen" ? "🧬" : previewTheme === "series" ? "🔮" : "🎬"}</span><span>${previewTitle}</span></h3>
                      <p class="group-meta">${previewMeta}</p>
                    </div>
                    <span class="arrow open">▶</span>
                  </div>
                </div>
                <div class="group-toolbar fake-toolbar" style="margin-top:12px">
                  <button class="action-btn green" type="button" tabindex="-1">＋ Aggiungi titolo</button>
                  <button class="action-btn" type="button" tabindex="-1">🖼️ Sfondo</button>
                </div>
              </div>
            </article>
          `
          : `
            <article class="card item-card ${previewTheme}${previewClass}"${previewStyle} aria-hidden="true">
              <div class="item-body">
                <div class="item-row">
                  <div class="item-main">
                    <div class="item-head">
                      <div class="item-copy">
                        <h3 class="item-title">${previewTitle}</h3>
                        ${state.modal.previewMeta ? `<p class="item-meta">${escapeHtml(state.modal.previewMeta)}</p>` : ""}
                        ${previewNote}
                        <div class="item-controls fake-toolbar">
                          <button class="icon-btn" type="button" tabindex="-1">📝</button>
                          <button class="seen-btn ${previewSeen ? "on" : ""}" type="button" tabindex="-1">${previewSeen ? "Visto" : "Non visto"}</button>
                        </div>
                        ${previewStars}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          `;
        return `
          <div class="modal-backdrop ${closing ? "closing" : stable ? "stable" : ""}">
            <div class="modal-card bg-modal-card ${closing ? "closing" : stable ? "stable" : ""}">
              <p class="modal-kicker">${targetKind === "root" ? "Macro-cartella" : targetKind === "group" ? "Cartella" : "Prodotto"}</p>
              <h3 class="modal-title">Sfondo immagine</h3>
              <div class="${previewFrameClass}" style="margin-top:16px;">
                ${previewMarkup}
                ${hasImage ? `
                  <div class="bg-preview-interaction" data-bg-role="pan">
                    <button class="bg-preview-fade-handle" type="button" data-bg-role="fade" style="--fade-line:${escapeHtml(state.modal.fadeDraft)}%;" aria-label="Regola la sfumatura"></button>
                  </div>
                ` : ""}
              </div>
              <p class="bg-preview-hint">${hasImage ? "Trascina direttamente la foto nel facsimile per spostarla. Trascina il cursore in basso per la sfumatura." : "Carica un'immagine e poi trascina direttamente il facsimile per posizione e sfumatura."}</p>
              <div class="settings-grid bg-settings-grid">
                <label class="settings-section bg-image-section">
                  <div>
                    <span class="settings-label">Immagine</span>
                    <p class="settings-note">Carica un file: verra salvato localmente nel browser.</p>
                  </div>
                  <input class="modal-input" type="file" accept="image/*" data-action="bg-file" data-focus-key="bg-file" />
                  ${hasImage ? `<button class="action-btn danger" data-action="bg-remove" type="button">Rimuovi immagine</button>` : ""}
                </label>
              </div>
              <div class="modal-actions" style="justify-content:flex-end;margin-top:16px">
                <button class="action-btn" data-action="modal-cancel">Annulla</button>
                <button class="action-btn green" data-action="bg-save">Salva</button>
              </div>
            </div>
          </div>
        `;
      }

      function renderRootCreateModal() {
        if (!state.modal || state.modal.mode !== "root-create") return "";
        const closing = Boolean(state.modalClosingToken);
        const stable = !closing && overlayRenderState.modalStable;
        return `
          <div class="modal-backdrop ${closing ? "closing" : stable ? "stable" : ""}">
            <div class="modal-card ${closing ? "closing" : stable ? "stable" : ""}">
              <p class="modal-kicker">Home</p>
              <h3 class="modal-title">Nuova macro-cartella</h3>
              <div class="settings-grid" style="margin-top:16px">
                <label class="settings-section">
                  <div>
                    <span class="settings-label">Titolo</span>
                    <p class="settings-note">Crea una nuova area come MCU o Non-MCU.</p>
                  </div>
                  <input class="modal-input" data-action="modal-input" data-focus-key="modal-input" value="${escapeHtml(state.modal.value)}" placeholder="Titolo macro-cartella" />
                </label>
                <label class="settings-section">
                  <div>
                    <span class="settings-label">Tema</span>
                    <p class="settings-note">Scegli il glow iniziale della nuova macro-cartella.</p>
                  </div>
                  <select class="modal-select" data-action="modal-root-theme">
                    ${themeChoices.map((choice) => `<option value="${choice.value}" ${state.modal.theme === choice.value ? "selected" : ""}>${choice.label}</option>`).join("")}
                  </select>
                </label>
              </div>
              <div class="modal-actions" style="justify-content:flex-end;margin-top:16px">
                <button class="action-btn" data-action="modal-cancel">Annulla</button>
                <button class="action-btn green" data-action="modal-confirm">Ok</button>
              </div>
            </div>
          </div>
        `;
      }

      function renderTextModal() {
        if (!state.modal || state.modal.mode !== "text") return "";
        const closing = Boolean(state.modalClosingToken);
        const stable = !closing && overlayRenderState.modalStable;
        return `
          <div class="modal-backdrop ${closing ? "closing" : stable ? "stable" : ""}">
            <div class="modal-card ${closing ? "closing" : stable ? "stable" : ""}">
              <p class="modal-kicker">Popup</p>
              <h3 class="modal-title">${escapeHtml(state.modal.title)}</h3>
              <div style="margin-top:16px">
                <input class="modal-input" data-action="modal-input" data-focus-key="modal-input" value="${escapeHtml(state.modal.value)}" placeholder="Scrivi qui..." />
              </div>
              <div class="modal-actions" style="justify-content:flex-end;margin-top:16px">
                <button class="action-btn" data-action="modal-cancel">Annulla</button>
                <button class="action-btn green" data-action="modal-confirm">Ok</button>
              </div>
            </div>
          </div>
        `;
      }

      function renderReviewModal() {
        if (!state.modal || state.modal.mode !== "review") return "";
        const closing = Boolean(state.modalClosingToken);
        const stable = !closing && overlayRenderState.modalStable;
        const title = state.modal.itemTitle ? `Recensione ${state.modal.itemTitle}` : "Recensione";
        return `
          <div class="modal-backdrop ${closing ? "closing" : stable ? "stable" : ""}">
            <div class="modal-card review-modal-card ${closing ? "closing" : stable ? "stable" : ""}">
              <p class="modal-kicker">Recensione</p>
              <h3 class="modal-title">${escapeHtml(title)}</h3>
              <p class="modal-name">Scrivi la recensione del titolo selezionato.</p>
              <div style="margin-top:14px">
                <textarea class="review-modal-textarea" data-action="review-modal-input" data-focus-key="review-modal-input" placeholder="Scrivi la tua recensione...">${escapeHtml(state.modal.value || "")}</textarea>
              </div>
              ${state.modal.confirmDelete
                ? `<div class="review-delete-warning">Stai per cancellare questa recensione. Confermi?</div>`
                : ""}
              <div class="modal-actions" style="justify-content:space-between;margin-top:16px">
                ${state.modal.confirmDelete
                  ? `<button type="button" class="action-btn" data-action="review-delete-cancel">Annulla</button><button type="button" class="action-btn danger" data-action="review-delete-confirm">Conferma cancella</button>`
                  : `<button type="button" class="action-btn danger" data-action="review-delete-prompt">Cancella</button><div class="settings-actions"><button type="button" class="action-btn" data-action="modal-cancel">Chiudi</button><button type="button" class="action-btn green" data-action="review-save">Conferma</button></div>`}
              </div>
            </div>
          </div>
        `;
      }

      function renderDeleteModal() {
        if (!state.modal || state.modal.mode !== "delete") return "";
        const closing = Boolean(state.modalClosingToken);
        const stable = !closing && overlayRenderState.modalStable;
        return `
          <div class="modal-backdrop ${closing ? "closing" : stable ? "stable" : ""}">
            <div class="modal-card ${closing ? "closing" : stable ? "stable" : ""}">
              <p class="modal-kicker" style="color:#fecaca">Conferma</p>
              <h3 class="modal-title">Sei sicuro?</h3>
              <p class="modal-name">${escapeHtml(state.modal.name)}</p>
              <div class="modal-actions" style="justify-content:flex-end;margin-top:18px">
                <button class="action-btn" data-action="modal-cancel">No</button>
                <button class="action-btn danger" data-action="modal-delete">Si</button>
              </div>
            </div>
          </div>
        `;
      }

      function renderModal() {
        if (!state.modal) return "";
        if (state.modal.mode === "settings") return renderSettingsModal();
        if (state.modal.mode === "settings-confirm-close") return renderSettingsConfirmModal();
        if (state.modal.mode === "profile") return renderProfileModal();
        if (state.modal.mode === "profile-confirm-close") return renderProfileConfirmModal();
        if (state.modal.mode === "roadmap") return renderRoadmapModal();
        if (state.modal.mode === "item-bg" || state.modal.mode === "group-bg" || state.modal.mode === "root-bg") return renderBackgroundModal();
        if (state.modal.mode === "review") return renderReviewModal();
        if (state.modal.mode === "root-create") return renderRootCreateModal();
        if (state.modal.mode === "delete") return renderDeleteModal();
        return renderTextModal();
      }

      let renderFrame = null;
      let pendingSaveFrame = null;
      let searchRenderFrame = null;
      let firebaseModulesPromise = null;
      let firebaseRuntime = null;
      let firebaseAuthInstance = null;
      let firebaseAuthUnsubscribe = null;
      let firebaseActiveAuthKey = "";
      let firebaseRedirectHandledKey = "";
      let profileRuntimeMessage = "";
      let authStateResolved = !isHostedForGoogle;
      let cloudStateUnsubscribe = null;
      let cloudStateWriteTimer = null;
      let cloudStateStatus = "idle";
      let cloudStateUserId = "";
      let cloudStateApplyingRemote = false;
      let lastCloudStateHash = "";
      let googleUiRefreshTimer = null;
      let bgPreviewDrag = null;
      let suppressBackdropClick = false;
      let lastModalRenderKey = null;
      let lastViewerRenderKey = null;
      let overlayRenderState = { modalStable: false, viewerStable: false };
      function scheduleRender() {
        if (renderFrame) return;
        renderFrame = window.requestAnimationFrame(() => {
          renderFrame = null;
          render();
        });
      }

      function scheduleSearchRender(delay = 80) {
        if (searchRenderFrame !== null) window.clearTimeout(searchRenderFrame);
        searchRenderFrame = window.setTimeout(() => {
          searchRenderFrame = null;
          render();
        }, delay);
      }

      function scheduleStateSave(delay = 220) {
        if (pendingSaveFrame !== null) window.clearTimeout(pendingSaveFrame);
        pendingSaveFrame = window.setTimeout(() => {
          pendingSaveFrame = null;
          saveState();
        }, delay);
      }

      function flushScheduledStateSave() {
        if (pendingSaveFrame !== null) {
          window.clearTimeout(pendingSaveFrame);
          pendingSaveFrame = null;
          saveState();
        }
        if (cloudStateWriteTimer !== null) {
          window.clearTimeout(cloudStateWriteTimer);
          cloudStateWriteTimer = null;
          writeCloudStateNow();
        }
      }

      function loadFirebaseModules() {
        if (firebaseModulesPromise) return firebaseModulesPromise;
        firebaseModulesPromise = Promise.all([
          import(FIREBASE_APP_MODULE_SRC),
          import(FIREBASE_AUTH_MODULE_SRC),
          import(FIREBASE_FIRESTORE_MODULE_SRC)
        ]).then(([appModule, authModule, firestoreModule]) => ({
          initializeApp: appModule.initializeApp,
          getApps: appModule.getApps,
          getAuth: authModule.getAuth,
          GoogleAuthProvider: authModule.GoogleAuthProvider,
          onAuthStateChanged: authModule.onAuthStateChanged,
          signInWithPopup: authModule.signInWithPopup,
          signInWithRedirect: authModule.signInWithRedirect,
          getRedirectResult: authModule.getRedirectResult,
          signOut: authModule.signOut,
          getFirestore: firestoreModule.getFirestore,
          doc: firestoreModule.doc,
          setDoc: firestoreModule.setDoc,
          onSnapshot: firestoreModule.onSnapshot,
          serverTimestamp: firestoreModule.serverTimestamp
        }));
        return firebaseModulesPromise;
      }

      function syncProfileFromAuthUser(user) {
        const previous = state.profile || createDefaultProfile();
        profileRuntimeMessage = "";
        const providerData = Array.isArray(user && user.providerData) ? user.providerData : [];
        const googleData = providerData.find((entry) => entry && entry.providerId === "google.com") || null;
        state.profile = normalizeProfile({
          provider: "google",
          sub: String((googleData && googleData.uid) || (user && user.uid) || ""),
          name: String((googleData && googleData.displayName) || (user && user.displayName) || ""),
          email: String((googleData && googleData.email) || (user && user.email) || ""),
          picture: String((googleData && googleData.photoURL) || (user && user.photoURL) || ""),
          nickname: previous.nickname,
          showEmail: previous.showEmail
        }, createDefaultProfile());
      }

      function clearProfileToLocalShell() {
        const previous = state.profile || createDefaultProfile();
        profileRuntimeMessage = "";
        state.profile = normalizeProfile({
          nickname: previous.nickname,
          showEmail: previous.showEmail
        }, createDefaultProfile());
      }

      function getCloudStateDocRef(userId) {
        if (!firebaseRuntime || !firebaseRuntime.db || !userId) return null;
        return firebaseRuntime.doc(firebaseRuntime.db, "users", userId, "private", "watchlist");
      }

      function stopCloudStateSync() {
        if (cloudStateUnsubscribe) {
          cloudStateUnsubscribe();
          cloudStateUnsubscribe = null;
        }
        if (cloudStateWriteTimer !== null) {
          window.clearTimeout(cloudStateWriteTimer);
          cloudStateWriteTimer = null;
        }
        cloudStateStatus = "idle";
        cloudStateUserId = "";
        cloudStateApplyingRemote = false;
        lastCloudStateHash = "";
      }

      function writeCloudStateNow(force = false) {
        if (!firebaseRuntime || !firebaseAuthInstance || !firebaseAuthInstance.currentUser) return Promise.resolve();
        const user = firebaseAuthInstance.currentUser;
        const docRef = getCloudStateDocRef(user.uid);
        if (!docRef) return Promise.resolve();
        const payload = buildPersistentStatePayload(state);
        const nextHash = JSON.stringify(payload);
        if (!force && nextHash === lastCloudStateHash) return Promise.resolve();
        lastCloudStateHash = nextHash;
        cloudStateStatus = "saving";
        profileRuntimeMessage = "Sincronizzo watchlist, stelle, recensioni e visti nel cloud...";
        scheduleGoogleProfileUi(0);
        return firebaseRuntime.setDoc(docRef, {
          state: payload,
          profile: {
            name: state.profile.name || "",
            email: state.profile.email || "",
            picture: state.profile.picture || ""
          },
          updatedAt: firebaseRuntime.serverTimestamp(),
          version: 1
        }, { merge: true }).then(() => {
          cloudStateStatus = "ready";
          profileRuntimeMessage = "Dati online sincronizzati sul tuo profilo Google.";
          scheduleGoogleProfileUi(0);
        }).catch((error) => {
          cloudStateStatus = "error";
          profileRuntimeMessage = error && error.message ? String(error.message) : "Non sono riuscito a sincronizzare la watchlist online.";
          scheduleGoogleProfileUi(0);
        });
      }

      function scheduleCloudStateSave(delay = 280) {
        if (cloudStateApplyingRemote) return;
        if (cloudStateStatus !== "ready" && cloudStateStatus !== "saving") return;
        if (!firebaseRuntime || !firebaseAuthInstance || !firebaseAuthInstance.currentUser) return;
        if (!hasGoogleProfile(state.profile)) return;
        if (cloudStateWriteTimer !== null) window.clearTimeout(cloudStateWriteTimer);
        cloudStateWriteTimer = window.setTimeout(() => {
          cloudStateWriteTimer = null;
          writeCloudStateNow();
        }, delay);
      }

      function startCloudStateSyncForUser(user) {
        if (!user || !firebaseRuntime || !firebaseRuntime.db) return;
        if (cloudStateUserId === user.uid && cloudStateUnsubscribe) return;
        stopCloudStateSync();
        cloudStateStatus = "loading";
        cloudStateUserId = user.uid;
        profileRuntimeMessage = "Carico la watchlist online del tuo profilo...";
        scheduleGoogleProfileUi(0);
        const docRef = getCloudStateDocRef(user.uid);
        cloudStateUnsubscribe = firebaseRuntime.onSnapshot(docRef, (snapshot) => {
          if (!snapshot.exists()) {
            cloudStateStatus = "ready";
            writeCloudStateNow(true);
            return;
          }
          const remote = snapshot.data() && snapshot.data().state ? snapshot.data().state : null;
          if (!remote) {
            cloudStateStatus = "ready";
            return;
          }
          const nextHash = JSON.stringify(remote);
          if (nextHash === lastCloudStateHash && cloudStateStatus === "ready") return;
          cloudStateApplyingRemote = true;
          applyPersistentStatePayload(remote);
          lastCloudStateHash = nextHash;
          cloudStateStatus = "ready";
          profileRuntimeMessage = "Dati online sincronizzati sul tuo profilo Google.";
          saveState();
          cloudStateApplyingRemote = false;
          render();
        }, (error) => {
          cloudStateStatus = "error";
          profileRuntimeMessage = error && error.message ? String(error.message) : "Non sono riuscito a leggere la watchlist online.";
          scheduleGoogleProfileUi(0);
        });
      }

      function getFirebaseAppName(config) {
        const slug = String(config && config.projectId ? config.projectId : "watchlist")
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/^-+|-+$/g, "") || "watchlist";
        return `watchlist-${slug}`;
      }

      function ensureFirebaseAuthReady(config) {
        const normalized = normalizeFirebaseConfig(config, createDefaultFirebaseConfig());
        if (!hasFirebaseConfig(normalized)) return Promise.reject(new Error("Configurazione Firebase incompleta."));
        if (!isHostedForGoogle) return Promise.reject(new Error("Il login Google reale funziona solo su un sito pubblicato in https."));
        const authKey = JSON.stringify(normalized);
        return loadFirebaseModules().then((modules) => {
          const appName = getFirebaseAppName(normalized);
          const existingApp = modules.getApps().find((entry) => entry.name === appName);
          const firebaseApp = existingApp || modules.initializeApp(normalized, appName);
          const auth = modules.getAuth(firebaseApp);
          const db = modules.getFirestore(firebaseApp);
          firebaseRuntime = { ...modules, firebaseApp, db };
          firebaseAuthInstance = auth;
          if (firebaseActiveAuthKey !== authKey) {
            if (firebaseAuthUnsubscribe) firebaseAuthUnsubscribe();
            firebaseAuthUnsubscribe = modules.onAuthStateChanged(auth, (user) => {
              if (user) {
                syncProfileFromAuthUser(user);
                startCloudStateSyncForUser(user);
              } else {
                stopCloudStateSync();
                purgeUnauthenticatedData();
              }
              authStateResolved = true;
              saveState();
              render();
            });
            firebaseActiveAuthKey = authKey;
          }
          if (firebaseRedirectHandledKey !== authKey) {
            firebaseRedirectHandledKey = authKey;
            modules.getRedirectResult(auth).then((result) => {
              if (result && result.user) {
                syncProfileFromAuthUser(result.user);
                saveState();
                render();
              }
            }).catch((error) => {
              profileRuntimeMessage = error && error.message ? String(error.message) : "Non sono riuscito a completare il rientro da Google.";
              scheduleGoogleProfileUi(0);
            });
          }
          return { auth, modules };
        });
      }

      function renderGoogleProfileButton() {
        const host = document.querySelector("[data-google-signin-host]");
        const note = document.querySelector("[data-google-profile-note]");
        if (!host) return;
        const draftConfig = state.firebaseConfig;
        if (hasGoogleProfile(state.profile)) {
          host.innerHTML = `<div class="profile-connected-pill">Profilo online attivo</div>`;
          if (note) note.textContent = profileRuntimeMessage || "Accesso Google riuscito. Stelline, recensioni, visti e struttura della watchlist si sincronizzano online su questo profilo.";
          return;
        }
        if (!hasFirebaseConfig(draftConfig)) {
          host.innerHTML = `<div class="empty">La configurazione Firebase non e disponibile in questa build.</div>`;
          if (note) note.textContent = "Questa versione dovrebbe avere la configurazione integrata nel codice.";
          return;
        }
        if (!isHostedForGoogle) {
          host.innerHTML = `<div class="empty">Pubblica il sito in https per usare davvero Accedi con Google.</div>`;
          if (note) note.textContent = "Da file locale la watchlist resta usabile, ma il login reale si attiva solo sul sito pubblicato.";
          return;
        }
        host.innerHTML = `<button class="action-btn green" data-action="profile-signin">Accedi con Google</button>`;
        if (note) {
          note.textContent = profileRuntimeMessage || "Scegli l'account Google e il sito usera quel profilo anche per sincronizzare online watchlist, stelle, recensioni e visti.";
        }
      }

      function scheduleGoogleProfileUi(delay = 120) {
        if (googleUiRefreshTimer !== null) window.clearTimeout(googleUiRefreshTimer);
        googleUiRefreshTimer = window.setTimeout(() => {
          googleUiRefreshTimer = null;
          renderGoogleProfileButton();
        }, delay);
      }

      function signOutGoogleProfile() {
        const runtime = firebaseRuntime;
        if (!runtime || !firebaseAuthInstance) {
          purgeUnauthenticatedData();
          authStateResolved = true;
          return render();
        }
        runtime.signOut(firebaseAuthInstance).then(() => {
          profileRuntimeMessage = "";
        }).catch((error) => {
          profileRuntimeMessage = error && error.message ? String(error.message) : "Non sono riuscito a disconnettere il profilo Google.";
          scheduleGoogleProfileUi(0);
        });
      }

      function startGoogleProfileSignIn() {
        profileRuntimeMessage = "";
        const config = state.firebaseConfig;
        saveState();
        ensureFirebaseAuthReady(config).then(({ auth, modules }) => {
          const provider = new modules.GoogleAuthProvider();
          provider.setCustomParameters({ prompt: "select_account" });
          if (mobilePerfQuery.matches) {
            return modules.signInWithRedirect(auth, provider);
          }
          return modules.signInWithPopup(auth, provider).then((result) => {
            if (result && result.user) {
              syncProfileFromAuthUser(result.user);
              saveState();
              render();
            }
          });
        }).catch((error) => {
          profileRuntimeMessage = error && error.message ? String(error.message) : "Non sono riuscito ad avviare l'accesso con Google.";
          scheduleGoogleProfileUi(0);
        });
      }

      function applyVisualSettings(glows, glowTuning, motionBoost, colorSpeed, glowSpeed, glowsEnabled = state.glowsEnabled) {
        document.documentElement.classList.toggle("glow-off", !glowsEnabled);
        document.documentElement.classList.toggle("lite-mode", Boolean(state.liteMode));
        document.documentElement.style.setProperty("--bg-glow-a", glows.background.a);
        document.documentElement.style.setProperty("--bg-glow-b", glows.background.b);
        document.documentElement.style.setProperty("--bg-glow-c", glows.background.c);
        document.documentElement.style.setProperty("--bg-glow-d", glows.background.d);
        document.documentElement.style.setProperty("--spider-a", glows.spider.a);
        document.documentElement.style.setProperty("--spider-b", glows.spider.b);
        document.documentElement.style.setProperty("--mcu-a", glows.mcu.a);
        document.documentElement.style.setProperty("--mcu-b", glows.mcu.b);
        document.documentElement.style.setProperty("--xmen-a", glows.xmen.a);
        document.documentElement.style.setProperty("--xmen-b", glows.xmen.b);
        document.documentElement.style.setProperty("--series-a", glows.series.a);
        document.documentElement.style.setProperty("--series-b", glows.series.b);
        document.documentElement.style.setProperty("--motion-scale", motionBoost ? "1.28" : ".86");
        document.documentElement.style.setProperty("--color-speed", String(colorSpeed || 1));
        document.documentElement.style.setProperty("--glow-speed", String(glowSpeed || 1));
        ["background", "spider", "mcu", "xmen", "series"].forEach((key) => {
          const tuning = glowTuning && glowTuning[key] ? glowTuning[key] : { speed: 1, strength: 1 };
          document.documentElement.style.setProperty(`--${key}-glow-speed`, String(tuning.speed || 1));
          document.documentElement.style.setProperty(`--${key}-glow-strength`, String(tuning.strength || 1));
        });
      }

      function updateRangeInputFill(input) {
        if (!(input instanceof HTMLInputElement)) return;
        const min = Number.isFinite(Number(input.min)) ? Number(input.min) : 0;
        const max = Number.isFinite(Number(input.max)) ? Number(input.max) : 100;
        const value = Number.isFinite(Number(input.value)) ? Number(input.value) : min;
        const progress = clampNumber(((value - min) / Math.max(max - min, 1)) * 100, 0, 100, 0);
        input.style.setProperty("--range-progress", `${progress}%`);
      }

      function updateVisibleRangeInputFills() {
        document.querySelectorAll(".range-input").forEach((input) => updateRangeInputFill(input));
      }

      function applySettingsDraftPreview() {
        if (!state.modal || state.modal.mode !== "settings") return;
        applyVisualSettings(
          state.modal.glowsDraft,
          state.modal.glowTuningDraft,
          state.modal.motionBoostDraft,
          state.modal.colorSpeedDraft,
          state.modal.glowSpeedDraft,
          state.modal.glowsEnabledDraft
        );
        applyAudioSettings({
          clickSounds: state.modal.clickSoundsDraft,
          clickVolume: state.modal.clickVolumeDraft,
          clickStyle: state.modal.clickStyleDraft,
          musicEnabled: state.modal.musicEnabledDraft,
          musicVolume: state.modal.musicVolumeDraft,
          musicTrack: state.modal.musicTrackDraft
        });

        const colorReadout = document.querySelector('[data-settings-readout="color-speed"]');
        const glowReadout = document.querySelector('[data-settings-readout="glow-speed"]');
        const clickReadout = document.querySelector('[data-settings-readout="click-volume"]');
        const musicReadout = document.querySelector('[data-settings-readout="music-volume"]');
        const freeEditSwitch = document.querySelector('[data-settings-switch="free-edit"]');
        const motionSwitch = document.querySelector('[data-settings-switch="motion"]');
        const glowSwitch = document.querySelector('[data-settings-switch="glows"]');
        const clickSwitch = document.querySelector('[data-settings-switch="click-sounds"]');
        const musicSwitch = document.querySelector('[data-settings-switch="music"]');

        if (colorReadout) colorReadout.textContent = formatColorSpeed(state.modal.colorSpeedDraft);
        if (glowReadout) glowReadout.textContent = formatColorSpeed(state.modal.glowSpeedDraft);
        if (clickReadout) clickReadout.textContent = formatVolume(state.modal.clickVolumeDraft);
        if (musicReadout) musicReadout.textContent = formatVolume(state.modal.musicVolumeDraft);
        if (freeEditSwitch) freeEditSwitch.classList.toggle("on", Boolean(state.modal.freeEditDraft));
        if (motionSwitch) motionSwitch.classList.toggle("on", Boolean(state.modal.motionBoostDraft));
        if (glowSwitch) glowSwitch.classList.toggle("on", Boolean(state.modal.glowsEnabledDraft));
        if (clickSwitch) clickSwitch.classList.toggle("on", Boolean(state.modal.clickSoundsDraft));
        if (musicSwitch) musicSwitch.classList.toggle("on", Boolean(state.modal.musicEnabledDraft));
        scheduleGoogleProfileUi(80);

        ["background", "spider", "mcu", "xmen", "series"].forEach((key) => {
          const draft = state.modal.glowsDraft[key];
          const tuning = state.modal.glowTuningDraft[key];
          const preview = document.querySelector(`[data-glow-preview="${key}"]`);
          const speedReadout = document.querySelector(`[data-glow-readout="${key}-speed"]`);
          const strengthReadout = document.querySelector(`[data-glow-readout="${key}-strength"]`);
          if (preview) {
            preview.style.setProperty("--preview-a", draft.a);
            preview.style.setProperty("--preview-b", draft.b || draft.c || draft.d || draft.a);
          }
          if (speedReadout) speedReadout.textContent = formatColorSpeed(tuning.speed);
          if (strengthReadout) strengthReadout.textContent = formatColorSpeed(tuning.strength);
        });
        updateVisibleRangeInputFills();
      }

      function applyBackgroundPreviewStyles() {
        if (!state.modal || (state.modal.mode !== "item-bg" && state.modal.mode !== "group-bg" && state.modal.mode !== "root-bg")) return;
        const previewCard = document.querySelector(".bg-preview-frame .card");
        const fadeHandle = document.querySelector(".bg-preview-fade-handle");
        if (previewCard) {
          previewCard.style.setProperty("--item-bg-x", `${state.modal.xDraft}%`);
          previewCard.style.setProperty("--item-bg-y", `${state.modal.yDraft}%`);
          previewCard.style.setProperty("--item-bg-fade", `${state.modal.fadeDraft}%`);
        }
        if (fadeHandle) fadeHandle.style.setProperty("--fade-line", `${state.modal.fadeDraft}%`);
      }

      function updateBackgroundPreviewFromPointer(clientX, clientY, mode) {
        if (!state.modal || (state.modal.mode !== "item-bg" && state.modal.mode !== "group-bg" && state.modal.mode !== "root-bg")) return false;
        if (!bgPreviewDrag || !bgPreviewDrag.rect) return false;
        const rect = bgPreviewDrag.rect;
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        let changed = false;

        if (mode === "fade") {
          const deltaPercentX = ((clientX - bgPreviewDrag.startClientX) / width) * 100;
          const nextFade = Math.round(clampNumber(bgPreviewDrag.startFade + deltaPercentX, 30, 85, state.modal.fadeDraft));
          if (nextFade !== state.modal.fadeDraft) {
            state.modal.fadeDraft = nextFade;
            changed = true;
          }
        } else {
          const deltaPercentX = ((clientX - bgPreviewDrag.startClientX) / width) * 100;
          const deltaPercentY = ((clientY - bgPreviewDrag.startClientY) / height) * 100;
          const nextX = Math.round(clampNumber(bgPreviewDrag.startX - deltaPercentX, 0, 100, state.modal.xDraft));
          const nextY = Math.round(clampNumber(bgPreviewDrag.startY - deltaPercentY, 0, 100, state.modal.yDraft));
          if (nextX !== state.modal.xDraft) {
            state.modal.xDraft = nextX;
            changed = true;
          }
          if (nextY !== state.modal.yDraft) {
            state.modal.yDraft = nextY;
            changed = true;
          }
        }

        if (changed) applyBackgroundPreviewStyles();
        return changed;
      }

      function handlePointerDown(event) {
        if (event.isPrimary !== false) unlockAudioPlayback();
        if (!state.modal || (state.modal.mode !== "item-bg" && state.modal.mode !== "group-bg" && state.modal.mode !== "root-bg")) return;
        const target = event.target.closest("[data-bg-role]");
        if (!target) return;
        const mode = target.dataset.bgRole === "fade" ? "fade" : "pan";
        const surface = mode === "fade" ? document.querySelector(".bg-preview-interaction") : (target.closest(".bg-preview-interaction") || target);
        if (!surface) return;
        bgPreviewDrag = {
          pointerId: event.pointerId,
          mode,
          moved: false,
          rect: surface.getBoundingClientRect(),
          startClientX: event.clientX,
          startClientY: event.clientY,
          startX: Number(state.modal.xDraft || 82),
          startY: Number(state.modal.yDraft || 50),
          startFade: Number(state.modal.fadeDraft || 56)
        };
        suppressBackdropClick = false;
        event.preventDefault();
        if (typeof target.setPointerCapture === "function") {
          try { target.setPointerCapture(event.pointerId); } catch (error) {}
        }
        const didChange = updateBackgroundPreviewFromPointer(event.clientX, event.clientY, mode);
        if (didChange) bgPreviewDrag.moved = true;
      }

      function handlePointerMove(event) {
        if (!bgPreviewDrag || bgPreviewDrag.pointerId !== event.pointerId) return;
        event.preventDefault();
        const didChange = updateBackgroundPreviewFromPointer(event.clientX, event.clientY, bgPreviewDrag.mode);
        if (didChange) bgPreviewDrag.moved = true;
      }

      function finishBackgroundDrag(event) {
        if (!bgPreviewDrag) return;
        if (event.pointerId !== undefined && event.pointerId !== bgPreviewDrag.pointerId) return;
        const capturedTarget = document.querySelector(`[data-bg-role="${bgPreviewDrag.mode === "fade" ? "fade" : "pan"}"]`);
        if (capturedTarget && typeof capturedTarget.releasePointerCapture === "function") {
          try { capturedTarget.releasePointerCapture(bgPreviewDrag.pointerId); } catch (error) {}
        }
        suppressBackdropClick = Boolean(bgPreviewDrag.moved);
        bgPreviewDrag = null;
        if (suppressBackdropClick) {
          window.setTimeout(() => {
            suppressBackdropClick = false;
          }, 120);
        }
      }

      function render() {
        if (searchRenderFrame !== null) {
          window.clearTimeout(searchRenderFrame);
          searchRenderFrame = null;
        }
        const focus = captureFocus();
        const pageScrollX = typeof window.scrollX === "number" ? window.scrollX : 0;
        const pageScrollY = typeof window.scrollY === "number" ? window.scrollY : 0;
        const modalScrollTop = state.modal ? document.querySelector(".modal-card")?.scrollTop ?? null : null;
        const viewerScrollTop = state.viewer ? document.querySelector(".viewer-panel-body")?.scrollTop ?? null : null;
        const modalRenderKey = getModalRenderKey();
        const viewerRenderKey = getViewerRenderKey();
        overlayRenderState = {
          modalStable: Boolean(modalRenderKey && modalRenderKey === lastModalRenderKey && !state.modalClosingToken),
          viewerStable: Boolean(viewerRenderKey && viewerRenderKey === lastViewerRenderKey && !state.viewerClosingToken)
        };
        applyVisualSettings(state.glows, state.glowTuning, state.motionBoost, state.colorSpeed, state.glowSpeed);
        applyAudioSettings(state);
        if (!authStateResolved || !hasGoogleProfile(state.profile)) {
          const gateTitle = !isHostedForGoogle
            ? "Accesso richiesto"
            : authStateResolved
              ? "Accedi per entrare"
              : "Controllo accesso";
          const gateText = !isHostedForGoogle
            ? "Questa versione richiede login obbligatorio. Pubblica il sito in https per usare Accedi con Google."
            : authStateResolved
              ? "Entra con Google per sbloccare l'app e tenere i tuoi dati legati al profilo."
              : "Sto verificando la sessione Google del tuo profilo prima di aprire la watchlist.";
          app.innerHTML = `
            <main class="auth-gate">
              <section class="modal-card auth-gate-card">
                <p class="modal-kicker">Watchlist</p>
                <h1 class="title">${escapeHtml(gateTitle)}</h1>
                <p class="settings-note auth-gate-note">${escapeHtml(gateText)}</p>
                <div class="profile-google-host auth-gate-host" data-google-signin-host></div>
                <p class="settings-note auth-gate-note" data-google-profile-note></p>
              </section>
            </main>
          `;
          renderGoogleProfileButton();
          restoreFocus(focus);
          window.scrollTo(pageScrollX, pageScrollY);
          lastModalRenderKey = state.modal && !state.modalClosingToken ? modalRenderKey : (state.modal ? modalRenderKey : null);
          lastViewerRenderKey = state.viewer && !state.viewerClosingToken ? viewerRenderKey : (state.viewer ? viewerRenderKey : null);
          state.animationTarget = null;
          return;
        }
        const numbering = buildNumbering();
        const results = searchResults();
        const allStats = getAllStats();
        const topRated = getTopRatedEntries(10);
        const displayRoots = getDisplayRoots();
        const searchOpen = state.search.trim().length > 0;
        const pending = Math.max(allStats.total - allStats.seen, 0);
        const customRoots = state.roots.filter((root) => root.userCreated).length;
        const homeProfileAvatar = state.profile.picture
          ? `<img src="${escapeHtml(state.profile.picture)}" alt="Profilo" />`
          : `<span>${escapeHtml(getProfileInitials(state.profile))}</span>`;
        app.innerHTML = `
          <main class="app">
            <section class="desktop-top">
              <section class="card hero-panel">
                <header class="hero">
                  <div class="hero-head">
                    <div>
                      <h1 class="title">${escapeHtml(state.appName)}</h1>
                    </div>
                    <div class="hero-head-actions">
                      <button class="settings-btn ${state.liteMode ? "status-on" : "status-off"}" data-action="toggle-home-lite" aria-label="${state.liteMode ? "Disattiva modalita ultra leggera" : "Attiva modalita ultra leggera"}" title="${state.liteMode ? "Disattiva modalita ultra leggera" : "Attiva modalita ultra leggera"}">🪶</button>
                      <button class="settings-btn music-toggle-btn ${state.musicEnabled ? "status-on" : "status-off"}" data-action="toggle-home-music" aria-label="${state.musicEnabled ? "Spegni musica" : "Riattiva musica"}" title="${state.musicEnabled ? "Spegni musica" : "Riattiva musica"}">${state.musicEnabled ? "🔈" : "🔇"}</button>
                      <button class="settings-btn" data-action="open-settings" aria-label="Impostazioni" title="Impostazioni">⚙️</button>
                      <button class="settings-btn profile-home-btn" data-action="open-profile-settings" aria-label="Profilo e impostazioni profilo" title="${escapeHtml(getProfileDisplayName(state.profile))}">${homeProfileAvatar}</button>
                    </div>
                  </div>
                  <div class="search-shell">
                    <span class="search-icon">⌕</span>
                    <input class="search-input" data-action="search-input" data-focus-key="search" value="${escapeHtml(state.search)}" placeholder="Cerca film, serie, cartella o macro-cartella" />
                    <button class="clear-btn ${searchOpen ? "" : "hidden"}" data-action="clear-search">✕</button>
                  </div>
                  <div class="hero-toolbar">
                    <div class="hero-actions">
                      <button class="action-btn green hero-cta" data-action="open-root-create">+ Aggiungi macro-cartella</button>
                      <div class="hero-chip ghost">${state.roots.length} macro-cartelle</div>
                      <div class="hero-chip ghost">${customRoots} custom</div>
                    </div>
                    <div class="hero-chip">${allStats.seen}/${allStats.total} visti</div>
                  </div>
                </header>
              </section>
              <aside class="card overview-panel">
                <p class="section-label">Panoramica</p>
                <div class="metric-grid">
                  ${renderMetricCard(String(allStats.total), "Titoli", "Film e serie nella watchlist")}
                  ${renderMetricCard(String(allStats.seen), "Visti", "Gia completati")}
                  ${renderMetricCard(String(pending), "Da vedere", "Ancora da recuperare")}
                  ${renderMetricCard(String(state.roots.length), "Macro-cartelle", "Aree principali della raccolta")}
                </div>
                <div class="block-stack" style="margin-top:16px">
                  <p class="section-label">Meglio votati</p>
                  <p class="metric-note">I titoli con stelle compaiono sempre qui.</p>
                  <div class="top-rated-list">
                    ${topRated.length
                      ? topRated.map((entry) => renderTopRatedEntry(entry)).join("")
                      : `<div class="empty">Aggiungi qualche voto con le stelline e qui appariranno i titoli migliori.</div>`}
                  </div>
                </div>
              </aside>
              <section class="desk-main">
                <div class="stats">
                  <span>${allStats.total} titoli</span>
                  <span>${state.roots.length} macro-cartelle</span>
                </div>
                ${searchOpen
                  ? `<section class="card"><div class="root-body"><p class="section-label">Risultati</p><h2 class="root-name">${results.length} elementi trovati</h2></div><div class="content divider"><div class="item-list">${results.length ? results.map(({ root, group, item }) => renderItemCard(root, group, item, numbering, true, group ? "group" : "root")).join("") : `<div class="empty">Nessun risultato per questa ricerca.</div>`}</div></div></section>`
                  : `${state.homeScheduleHidden ? renderHiddenRoadmapCard() : renderHomeSchedulePanel()}<div class="root-grid">${displayRoots.map((root) => renderRoot(root, numbering)).join("")}</div>`}
              </section>
            </section>
          </main>
          ${renderViewer(numbering)}
          ${renderModal()}
        `;
        const settingsButton = document.querySelector('.settings-btn[data-action="open-settings"]');
        if (settingsButton) settingsButton.textContent = "⚙️";
        updateVisibleRangeInputFills();
        renderGoogleProfileButton();
        restoreFocus(focus);
        window.scrollTo(pageScrollX, pageScrollY);
        if (viewerScrollTop !== null) {
          const viewerBody = document.querySelector(".viewer-panel-body");
          if (viewerBody) viewerBody.scrollTop = viewerScrollTop;
        }
        if (modalScrollTop !== null) {
          const modalCard = document.querySelector(".modal-card");
          if (modalCard) modalCard.scrollTop = modalScrollTop;
        }
        lastModalRenderKey = state.modal && !state.modalClosingToken ? modalRenderKey : (state.modal ? modalRenderKey : null);
        lastViewerRenderKey = state.viewer && !state.viewerClosingToken ? viewerRenderKey : (state.viewer ? viewerRenderKey : null);
        state.animationTarget = null;
      }

      function openTextModal(payload) {
        setModal({ mode: "text", ...payload });
      }

      function openDeleteModal(payload) {
        setModal({ mode: "delete", ...payload });
      }

      function confirmRootCreate() {
        if (!state.modal || state.modal.mode !== "root-create") return;
        const value = state.modal.value.trim();
        if (!value) return;
        const nextRoot = createRoot(value, { theme: state.modal.theme || "mcu", userCreated: true, groups: [], items: [] });
        state.roots = [...state.roots, nextRoot];
        state.openGroups[nextRoot.id] = null;
        state.openRootId = nextRoot.id;
        state.animationTarget = { type: "root", rootId: nextRoot.id };
        state.viewer = { type: "root", rootId: nextRoot.id };
        state.viewerClosingToken = null;
        saveState();
        beginModalClose();
      }

      function confirmTextModal() {
        if (!state.modal || state.modal.mode !== "text") return;
        const value = state.modal.value.trim();
        if (!value) return;
        if (state.modal.type === "add-root-item") {
          const root = getRoot(state.modal.rootId);
          if (!canAddDirectTitles(root)) return;
          mutateRoot(state.modal.rootId, (root) => ({ ...root, items: [...root.items, createItem(value, true)] }));
          state.openRootId = state.modal.rootId;
          state.viewer = { type: "root", rootId: state.modal.rootId };
        } else if (state.modal.type === "add-group-item") {
          const root = getRoot(state.modal.rootId);
          const group = getGroup(state.modal.rootId, state.modal.groupId);
          if (!canAddTitlesToGroup(root, group)) return;
          mutateGroup(state.modal.rootId, state.modal.groupId, (group) => ({ ...group, items: [...group.items, createItem(value, true)] }));
          state.openRootId = state.modal.rootId;
          state.openGroups[state.modal.rootId] = state.modal.groupId;
          state.viewer = { type: "group", rootId: state.modal.rootId, groupId: state.modal.groupId };
        } else if (state.modal.type === "add-group") {
          const root = getRoot(state.modal.rootId);
          const nextGroup = createGroup(value, { kind: root && root.title === "MCU" ? "phase" : "section", theme: root ? root.theme : "mcu", userCreated: true, items: [] });
          mutateRoot(state.modal.rootId, (rootValue) => ({ ...rootValue, groups: [...rootValue.groups, nextGroup] }));
          state.openRootId = state.modal.rootId;
          state.openGroups[state.modal.rootId] = nextGroup.id;
          state.animationTarget = { type: "group", rootId: state.modal.rootId, groupId: nextGroup.id };
          state.viewer = { type: "group", rootId: state.modal.rootId, groupId: nextGroup.id };
        } else if (state.modal.type === "edit-root") {
          mutateRoot(state.modal.rootId, (root) => ({ ...root, title: value }));
        } else if (state.modal.type === "edit-group") {
          mutateGroup(state.modal.rootId, state.modal.groupId, (group) => ({ ...group, title: value }));
        } else if (state.modal.type === "edit-item") {
          if (state.modal.scope === "root") {
            mutateRootItem(state.modal.rootId, state.modal.itemId, (item) => ({ ...item, title: value }));
          } else {
            mutateGroupItem(state.modal.rootId, state.modal.groupId, state.modal.itemId, (item) => ({ ...item, title: value }));
          }
        }
        saveState();
        beginModalClose();
      }

      function confirmDeleteModal() {
        if (!state.modal || state.modal.mode !== "delete") return;
        if (state.modal.type === "delete-roadmap") {
          state.homeScheduleHidden = true;
          state.homeScheduleOpen = false;
        } else if (state.modal.type === "profile-signout") {
          state.modal = null;
          state.modalClosingToken = null;
          signOutGoogleProfile();
          return;
        } else if (state.modal.type === "delete-root") {
          state.roots = state.roots.filter((root) => root.id !== state.modal.rootId);
          delete state.openGroups[state.modal.rootId];
          if (state.openRootId === state.modal.rootId) state.openRootId = null;
          if (state.viewer && state.viewer.rootId === state.modal.rootId) state.viewer = null;
        } else if (state.modal.type === "delete-group") {
          mutateRoot(state.modal.rootId, (root) => ({ ...root, groups: root.groups.filter((group) => group.id !== state.modal.groupId) }));
          if (state.openGroups[state.modal.rootId] === state.modal.groupId) state.openGroups[state.modal.rootId] = null;
          if (state.viewer && state.viewer.type === "group" && state.viewer.rootId === state.modal.rootId && state.viewer.groupId === state.modal.groupId) {
            state.viewer = { type: "root", rootId: state.modal.rootId };
          }
        } else if (state.modal.type === "delete-item") {
          if (state.modal.scope === "root") {
            mutateRoot(state.modal.rootId, (root) => ({ ...root, items: root.items.filter((item) => item.id !== state.modal.itemId) }));
          } else {
            mutateGroup(state.modal.rootId, state.modal.groupId, (group) => ({ ...group, items: group.items.filter((item) => item.id !== state.modal.itemId) }));
          }
        }
        saveState();
        beginModalClose();
      }

      function getEventElementTarget(event) {
        const target = event && event.target ? event.target : null;
        if (!target) return null;
        if (target.nodeType === 1) return target;
        if (target.nodeType === 3 && target.parentElement) return target.parentElement;
        return null;
      }

      function handleClick(event) {
        if (suppressBackdropClick) {
          suppressBackdropClick = false;
          return;
        }
        const target = getEventElementTarget(event);
        if (!target) return;
        const button = target.closest("[data-action]");
        if (!button) {
          const isInsideModal = Boolean(target.closest(".modal-card"));
          const isInsideViewer = Boolean(target.closest(".viewer-panel"));
          if (!isInsideModal && target.classList && target.classList.contains("modal-backdrop")) {
            playUiClick("soft");
            if (state.modal) return closeModal();
          }
          if (!isInsideViewer && target.classList && target.classList.contains("viewer-backdrop")) {
            playUiClick("soft");
            if (state.viewer) return beginViewerClose();
          }
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        const action = button.dataset.action;
        playUiClick(action === "modal-delete" || action === "settings-reset" ? "soft" : "default");
        if (action === "open-settings") return openSettings();
        if (action === "open-profile-settings") return openProfileSettings();
        if (action === "toggle-home-lite") {
          state.liteMode = !state.liteMode;
          if (state.liteMode) {
            state.liteSnapshot = {
              glowsEnabled: state.glowsEnabled,
              motionBoost: state.motionBoost,
              colorSpeed: state.colorSpeed,
              glowSpeed: state.glowSpeed
            };
            state.glowsEnabled = false;
            state.motionBoost = false;
            state.colorSpeed = Math.min(Number(state.colorSpeed) || 1, 0.72);
            state.glowSpeed = Math.min(Number(state.glowSpeed) || 1, 0.68);
          } else if (state.liteSnapshot) {
            state.glowsEnabled = Boolean(state.liteSnapshot.glowsEnabled);
            state.motionBoost = Boolean(state.liteSnapshot.motionBoost);
            state.colorSpeed = Math.max(0.55, Math.min(2.2, Number(state.liteSnapshot.colorSpeed) || 1));
            state.glowSpeed = Math.max(0.55, Math.min(2.2, Number(state.liteSnapshot.glowSpeed) || 1));
            state.liteSnapshot = null;
          } else if (!state.glowsEnabled) {
            state.glowsEnabled = true;
          }
          saveState();
          return render();
        }
        if (action === "toggle-home-music") {
          state.musicEnabled = !state.musicEnabled;
          saveState();
          return render();
        }
        if (action === "open-roadmap") return setModal({ mode: "roadmap" });
        if (action === "delete-roadmap") {
          return openDeleteModal({ type: "delete-roadmap", name: "Roadmap Marvel" });
        }
        if (action === "restore-roadmap") {
          state.homeScheduleHidden = false;
          state.homeScheduleOpen = true;
          saveState();
          return render();
        }
        if (action === "open-root-create") return openRootCreateModal();
        if (action === "open-review-modal") {
          const scoped = getScopedItem(button.dataset.rootId, button.dataset.groupId, button.dataset.itemId, button.dataset.scope);
          if (!scoped) return;
          return setModal({
            mode: "review",
            rootId: scoped.root.id,
            groupId: scoped.group ? scoped.group.id : "",
            itemId: scoped.item.id,
            scope: scoped.group ? "group" : "root",
            itemTitle: scoped.item.title,
            value: scoped.item.review || "",
            confirmDelete: false
          });
        }
        if (action === "open-rated-item") {
          if (button.dataset.scope === "group" && button.dataset.groupId) return openGroupViewer(button.dataset.rootId, button.dataset.groupId);
          return openRootViewer(button.dataset.rootId);
        }
        if (action === "viewer-close") return beginViewerClose();
        if (action === "viewer-back") return openRootViewer(button.dataset.rootId);
        if (action === "viewer-prev-group" || action === "viewer-next-group") {
          const root = getRoot(button.dataset.rootId);
          const siblings = getAdjacentGroups(root, button.dataset.groupId);
          const targetGroup = action === "viewer-prev-group" ? siblings.previous : siblings.next;
          if (targetGroup) return openGroupViewer(button.dataset.rootId, targetGroup.id);
          return;
        }
        if (action === "open-item-bg") {
          const rootId = button.dataset.rootId;
          const groupId = button.dataset.groupId;
          const itemId = button.dataset.itemId;
          const scope = button.dataset.scope;
          const root = getRoot(rootId);
          const group = scope === "root" ? null : getGroup(rootId, groupId);
          const items = scope === "root" ? (root ? root.items : []) : (group ? group.items : []);
          const item = items.find((entry) => entry.id === itemId);
          if (!item) return;
          const theme = group ? group.theme : (root ? root.theme : "mcu");
          const existing = normalizeItemBg(item.bg);
          setModal({
            mode: "item-bg",
            targetKind: "item",
            rootId,
            groupId,
            itemId,
            scope,
            theme,
            itemTitle: item.title,
            previewMeta: group ? formatGroupMeta(group) : formatRootMeta(root),
            previewNote: item.note || "",
            previewRating: item.rating || 0,
            previewSeen: Boolean(item.seen),
            dataUrlDraft: existing ? existing.dataUrl : "",
            xDraft: existing ? existing.x : 82,
            yDraft: existing ? existing.y : 50,
            fadeDraft: existing ? existing.fade : 56
          });
          return;
        }
        if (action === "open-group-bg") {
          const rootId = button.dataset.rootId;
          const groupId = button.dataset.groupId;
          const root = getRoot(rootId);
          const group = getGroup(rootId, groupId);
          if (!root || !group || !canCustomizeGroupBackground(group)) return;
          const existing = normalizeItemBg(group.bg);
          setModal({
            mode: "group-bg",
            targetKind: "group",
            rootId,
            groupId,
            theme: group.theme,
            groupTitle: group.title,
            previewMeta: formatGroupMeta(group),
            dataUrlDraft: existing ? existing.dataUrl : "",
            xDraft: existing ? existing.x : 82,
            yDraft: existing ? existing.y : 50,
            fadeDraft: existing ? existing.fade : 56
          });
          return;
        }
        if (action === "open-root-bg") {
          const rootId = button.dataset.rootId;
          const root = getRoot(rootId);
          if (!root) return;
          const existing = normalizeItemBg(root.bg);
          setModal({
            mode: "root-bg",
            targetKind: "root",
            rootId,
            theme: root.theme,
            rootTitle: root.title,
            previewMeta: formatRootMeta(root),
            dataUrlDraft: existing ? existing.dataUrl : "",
            xDraft: existing ? existing.x : 82,
            yDraft: existing ? existing.y : 50,
            fadeDraft: existing ? existing.fade : 56
          });
          return;
        }
        if (action === "bg-remove" && state.modal && (state.modal.mode === "item-bg" || state.modal.mode === "group-bg" || state.modal.mode === "root-bg")) {
          state.modal.dataUrlDraft = "";
          return render();
        }
        if (action === "bg-save" && state.modal && (state.modal.mode === "item-bg" || state.modal.mode === "group-bg" || state.modal.mode === "root-bg")) {
          const dataUrl = String(state.modal.dataUrlDraft || "");
          const nextBg = dataUrl
            ? { dataUrl, x: clampNumber(state.modal.xDraft, 0, 100, 82), y: clampNumber(state.modal.yDraft, 0, 100, 50), fade: clampNumber(state.modal.fadeDraft, 30, 85, 56) }
            : null;
          if (state.modal.targetKind === "root") mutateRoot(state.modal.rootId, (root) => ({ ...root, bg: nextBg }));
          else if (state.modal.targetKind === "group") mutateGroup(state.modal.rootId, state.modal.groupId, (group) => ({ ...group, bg: nextBg }));
          else if (state.modal.scope === "root") mutateRootItem(state.modal.rootId, state.modal.itemId, (item) => ({ ...item, bg: nextBg }));
          else mutateGroupItem(state.modal.rootId, state.modal.groupId, state.modal.itemId, (item) => ({ ...item, bg: nextBg }));
          beginModalClose();
          return;
        }
        if (action === "toggle-root") {
          return openRootViewer(button.dataset.rootId);
          const clickedRootId = button.dataset.rootId;
          const currentOpen = state.openRootId;
          const closingDuration = 360;
          if (currentOpen === clickedRootId) {
            state.closingPanel = { type: "root", rootId: clickedRootId, nextRootId: null };
            state.animationTarget = null;
            render();
            window.setTimeout(() => {
              if (!state.closingPanel || state.closingPanel.type !== "root" || state.closingPanel.rootId !== clickedRootId) return;
              state.openRootId = null;
              state.closingPanel = null;
              saveState();
              render();
            }, closingDuration);
            return;
          }
          if (currentOpen) {
            state.closingPanel = { type: "root", rootId: currentOpen, nextRootId: clickedRootId };
            state.animationTarget = null;
            render();
            window.setTimeout(() => {
              if (!state.closingPanel || state.closingPanel.type !== "root" || state.closingPanel.rootId !== currentOpen) return;
              state.openRootId = clickedRootId;
              state.closingPanel = null;
              state.animationTarget = { type: "root", rootId: clickedRootId };
              saveState();
              render();
            }, closingDuration);
            return;
          }
          state.closingPanel = null;
          state.openRootId = clickedRootId;
          state.animationTarget = { type: "root", rootId: clickedRootId };
          saveState();
          return render();
        }
        if (action === "toggle-group") {
          return openGroupViewer(button.dataset.rootId, button.dataset.groupId);
          const rootId = button.dataset.rootId;
          const clickedGroupId = button.dataset.groupId;
          const currentOpen = state.openGroups[rootId];
          const closingDuration = 320;
          if (currentOpen === clickedGroupId) {
            state.closingPanel = { type: "group", rootId, groupId: clickedGroupId, nextGroupId: null };
            state.animationTarget = null;
            render();
            window.setTimeout(() => {
              if (!state.closingPanel || state.closingPanel.type !== "group" || state.closingPanel.rootId !== rootId || state.closingPanel.groupId !== clickedGroupId) return;
              state.openGroups[rootId] = null;
              state.closingPanel = null;
              saveState();
              render();
            }, closingDuration);
            return;
          }
          if (currentOpen) {
            state.closingPanel = { type: "group", rootId, groupId: currentOpen, nextGroupId: clickedGroupId };
            state.animationTarget = null;
            render();
            window.setTimeout(() => {
              if (!state.closingPanel || state.closingPanel.type !== "group" || state.closingPanel.rootId !== rootId || state.closingPanel.groupId !== currentOpen) return;
              state.openGroups[rootId] = clickedGroupId;
              state.closingPanel = null;
              state.animationTarget = { type: "group", rootId, groupId: clickedGroupId };
              saveState();
              render();
            }, closingDuration);
            return;
          }
          state.closingPanel = null;
          state.openGroups[rootId] = clickedGroupId;
          state.animationTarget = { type: "group", rootId, groupId: clickedGroupId };
          saveState();
          return render();
        }
        if (action === "clear-search") {
          state.search = "";
          return render();
        }
        if (action === "review-save" && state.modal && state.modal.mode === "review") {
          const nextReview = String(state.modal.value || "");
          if (state.modal.scope === "root") mutateRootItem(state.modal.rootId, state.modal.itemId, (item) => ({ ...item, review: nextReview }));
          else mutateGroupItem(state.modal.rootId, state.modal.groupId, state.modal.itemId, (item) => ({ ...item, review: nextReview }));
          const key = `${state.modal.scope}:${state.modal.rootId}:${state.modal.scope === "group" ? state.modal.groupId : ""}:${state.modal.itemId}`;
          state.reviewPanels[key] = true;
          beginModalClose();
          return;
        }
        if (action === "review-delete-prompt" && state.modal && state.modal.mode === "review") {
          state.modal.confirmDelete = true;
          return render();
        }
        if (action === "review-delete-cancel" && state.modal && state.modal.mode === "review") {
          state.modal.confirmDelete = false;
          return render();
        }
        if (action === "review-delete-confirm" && state.modal && state.modal.mode === "review") {
          if (state.modal.scope === "root") mutateRootItem(state.modal.rootId, state.modal.itemId, (item) => ({ ...item, review: "" }));
          else mutateGroupItem(state.modal.rootId, state.modal.groupId, state.modal.itemId, (item) => ({ ...item, review: "" }));
          const key = `${state.modal.scope}:${state.modal.rootId}:${state.modal.scope === "group" ? state.modal.groupId : ""}:${state.modal.itemId}`;
          state.reviewPanels[key] = false;
          beginModalClose();
          return;
        }
        if (action === "toggle-review-panel") {
          const key = String(button.dataset.reviewKey || "");
          if (!key) return;
          state.reviewPanels[key] = !Boolean(state.reviewPanels[key]);
          saveState();
          return render();
        }
        if (action === "toggle-seen") {
          if (button.dataset.scope === "root") mutateRootItem(button.dataset.rootId, button.dataset.itemId, (item) => ({ ...item, seen: !item.seen }));
          else mutateGroupItem(button.dataset.rootId, button.dataset.groupId, button.dataset.itemId, (item) => ({ ...item, seen: !item.seen }));
          return render();
        }
        if (action === "rate") {
          const value = Number(button.dataset.value || 0);
          const updater = (item) => ({ ...item, rating: item.rating === value ? 0 : value });
          if (button.dataset.scope === "root") mutateRootItem(button.dataset.rootId, button.dataset.itemId, updater);
          else mutateGroupItem(button.dataset.rootId, button.dataset.groupId, button.dataset.itemId, updater);
          return render();
        }
        if (action === "add-root-item") {
          const root = getRoot(button.dataset.rootId);
          if (canAddDirectTitles(root)) return openTextModal({ type: "add-root-item", title: "Nuovo titolo", value: "", rootId: button.dataset.rootId });
          return;
        }
        if (action === "add-group-item") {
          const root = getRoot(button.dataset.rootId);
          const group = getGroup(button.dataset.rootId, button.dataset.groupId);
          if (canAddTitlesToGroup(root, group)) return openTextModal({ type: "add-group-item", title: "Nuovo titolo", value: "", rootId: button.dataset.rootId, groupId: button.dataset.groupId });
          return;
        }
        if (action === "add-group") return openTextModal({ type: "add-group", title: "Nuova cartella", value: "", rootId: button.dataset.rootId });
        if (action === "edit-root") {
          const root = getRoot(button.dataset.rootId);
          if (root && canEdit(root.userCreated)) openTextModal({ type: "edit-root", title: "Modifica macro-cartella", value: root.title, rootId: root.id });
          return;
        }
        if (action === "delete-root") {
          const root = getRoot(button.dataset.rootId);
          if (root && canEdit(root.userCreated)) openDeleteModal({ type: "delete-root", name: root.title, rootId: root.id });
          return;
        }
        if (action === "edit-group") {
          const group = getGroup(button.dataset.rootId, button.dataset.groupId);
          if (group && canEdit(group.userCreated)) openTextModal({ type: "edit-group", title: "Modifica cartella", value: group.title, rootId: button.dataset.rootId, groupId: group.id });
          return;
        }
        if (action === "delete-group") {
          const group = getGroup(button.dataset.rootId, button.dataset.groupId);
          if (group && canEdit(group.userCreated)) openDeleteModal({ type: "delete-group", name: group.title, rootId: button.dataset.rootId, groupId: group.id });
          return;
        }
        if (action === "edit-item" || action === "delete-item") {
          const items = button.dataset.scope === "root" ? ((getRoot(button.dataset.rootId) || {}).items || []) : ((getGroup(button.dataset.rootId, button.dataset.groupId) || {}).items || []);
          const item = items.find((entry) => entry.id === button.dataset.itemId);
          if (!item || !canEdit(item.userAdded)) return;
          if (action === "edit-item") openTextModal({ type: "edit-item", title: "Modifica titolo", value: item.title, rootId: button.dataset.rootId, groupId: button.dataset.groupId, itemId: item.id, scope: button.dataset.scope });
          else openDeleteModal({ type: "delete-item", name: item.title, rootId: button.dataset.rootId, groupId: button.dataset.groupId, itemId: item.id, scope: button.dataset.scope });
          return;
        }
        if (action === "settings-toggle-free-edit" && state.modal && state.modal.mode === "settings") {
          state.modal.freeEditDraft = !state.modal.freeEditDraft;
          return applySettingsDraftPreview();
        }
        if (action === "settings-toggle-motion" && state.modal && state.modal.mode === "settings") {
          state.modal.motionBoostDraft = !state.modal.motionBoostDraft;
          return applySettingsDraftPreview();
        }
        if (action === "profile-toggle-email" && state.modal && state.modal.mode === "profile") {
          state.modal.profileShowEmailDraft = !state.modal.profileShowEmailDraft;
          saveState();
          return render();
        }
        if (action === "settings-toggle-glows" && state.modal && state.modal.mode === "settings") {
          state.modal.glowsEnabledDraft = !state.modal.glowsEnabledDraft;
          return applySettingsDraftPreview();
        }
        if (action === "settings-toggle-click-sounds" && state.modal && state.modal.mode === "settings") {
          state.modal.clickSoundsDraft = !state.modal.clickSoundsDraft;
          return applySettingsDraftPreview();
        }
        if (action === "settings-toggle-music" && state.modal && state.modal.mode === "settings") {
          state.modal.musicEnabledDraft = !state.modal.musicEnabledDraft;
          return applySettingsDraftPreview();
        }
        if (action === "settings-save") {
          applySettingsDraft();
          profileRuntimeMessage = "";
          ensureFirebaseAuthReady(state.firebaseConfig).catch(() => {});
          beginModalClose();
          return;
        }
        if (action === "profile-save" && state.modal && state.modal.mode === "profile") {
          applyProfileDraft();
          profileRuntimeMessage = "";
          ensureFirebaseAuthReady(state.firebaseConfig).catch(() => {});
          beginModalClose();
          return;
        }
        if (action === "settings-save-close" && state.modal && state.modal.mode === "settings-confirm-close") {
          applySettingsDraft(state.modal.settingsDraft);
          profileRuntimeMessage = "";
          ensureFirebaseAuthReady(state.firebaseConfig).catch(() => {});
          beginModalClose();
          return;
        }
        if (action === "settings-discard-close" && state.modal && state.modal.mode === "settings-confirm-close") {
          beginModalClose();
          return;
        }
        if (action === "settings-keep-editing" && state.modal && state.modal.mode === "settings-confirm-close") {
          state.modal = state.modal.settingsDraft;
          return render();
        }
        if (action === "profile-save-close" && state.modal && state.modal.mode === "profile-confirm-close") {
          applyProfileDraft(state.modal.profileDraft);
          profileRuntimeMessage = "";
          ensureFirebaseAuthReady(state.firebaseConfig).catch(() => {});
          beginModalClose();
          return;
        }
        if (action === "profile-discard-close" && state.modal && state.modal.mode === "profile-confirm-close") {
          beginModalClose();
          return;
        }
        if (action === "profile-keep-editing" && state.modal && state.modal.mode === "profile-confirm-close") {
          state.modal = state.modal.profileDraft;
          return render();
        }
        if (action === "settings-reset") {
          state = createDefaultState();
          saveState();
          return render();
        }
        if (action === "profile-signout") {
          return openDeleteModal({
            type: "profile-signout",
            name: "Se fai logout, stelle, recensioni, visto/non visto e dati locali di questa sessione verranno cancellati finche non rientri con il profilo Google."
          });
        }
        if (action === "profile-signin") {
          startGoogleProfileSignIn();
          return;
        }
        if (action === "modal-cancel") return closeModal();
        if (action === "modal-confirm") {
          if (state.modal && state.modal.mode === "root-create") return confirmRootCreate();
          return confirmTextModal();
        }
        if (action === "modal-delete") return confirmDeleteModal();
      }

      function handleInput(event) {
        const target = event.target;
        const action = target.dataset.action;
        if (action === "search-input") {
          state.search = target.value;
          return scheduleSearchRender();
        }
        if (action === "review-input") {
          setItemReviewDraft(target.dataset.scope, target.dataset.rootId, target.dataset.groupId, target.dataset.itemId, target.value);
          scheduleStateSave();
          if (state.search.trim()) scheduleSearchRender(110);
          return;
        }
        if (action === "review-modal-input" && state.modal && state.modal.mode === "review") {
          state.modal.value = target.value;
          return;
        }
        if (action === "modal-input" && state.modal && (state.modal.mode === "text" || state.modal.mode === "root-create")) {
          state.modal.value = target.value;
          return;
        }
        if (state.modal && state.modal.mode === "settings") {
          if (action === "settings-name") {
            state.modal.appNameDraft = target.value;
            return;
          }
          if (action === "settings-color-speed") {
            state.modal.colorSpeedDraft = Number(target.value);
            return applySettingsDraftPreview();
          }
          if (action === "settings-glow-speed") {
            state.modal.glowSpeedDraft = Number(target.value);
            return applySettingsDraftPreview();
          }
          if (action === "settings-click-volume") {
            state.modal.clickVolumeDraft = Number(target.value);
            return applySettingsDraftPreview();
          }
          if (action === "settings-music-volume") {
            state.modal.musicVolumeDraft = Number(target.value);
            return applySettingsDraftPreview();
          }
          if (action === "settings-glow-tune-speed" && target.dataset.glowKey && state.modal.glowTuningDraft[target.dataset.glowKey]) {
            state.modal.glowTuningDraft[target.dataset.glowKey].speed = Number(target.value);
            return applySettingsDraftPreview();
          }
          if (action === "settings-glow-tune-strength" && target.dataset.glowKey && state.modal.glowTuningDraft[target.dataset.glowKey]) {
            state.modal.glowTuningDraft[target.dataset.glowKey].strength = Number(target.value);
            return applySettingsDraftPreview();
          }
        }
        if (state.modal && (state.modal.mode === "item-bg" || state.modal.mode === "group-bg" || state.modal.mode === "root-bg")) {
          if (action === "bg-x") {
            state.modal.xDraft = Number(target.value);
            return scheduleRender();
          }
          if (action === "bg-y") {
            state.modal.yDraft = Number(target.value);
            return scheduleRender();
          }
          if (action === "bg-fade") {
            state.modal.fadeDraft = Number(target.value);
            return scheduleRender();
          }
        }
        if (state.modal && state.modal.mode === "profile") {
          if (action === "profile-nickname") {
            state.modal.profileNicknameDraft = target.value;
            saveState();
            return render();
          }
        }
      }

      function handleChange(event) {
        const target = event.target;
        const action = target.dataset.action;
        if (action === "bg-file" && state.modal && (state.modal.mode === "item-bg" || state.modal.mode === "group-bg" || state.modal.mode === "root-bg")) {
          const file = target.files && target.files[0];
          if (!file) return;
          const focusKey = target.dataset.focusKey;
          fileToOptimizedDataUrl(file).then((dataUrl) => {
            if (!state.modal || (state.modal.mode !== "item-bg" && state.modal.mode !== "group-bg" && state.modal.mode !== "root-bg")) return;
            state.modal.dataUrlDraft = dataUrl;
            scheduleRender();
            const restore = document.querySelector(`[data-focus-key="${focusKey}"]`);
            if (restore) restore.value = "";
          }).catch(() => {});
          return;
        }
        if (state.modal && state.modal.mode === "settings") {
          if (action === "settings-glow") {
            const key = target.dataset.glowKey;
            const slot = target.dataset.glowSlot;
            if (state.modal.glowsDraft[key] && slot) state.modal.glowsDraft[key][slot] = target.value;
            return applySettingsDraftPreview();
          }
          if (action === "settings-click-style") {
            state.modal.clickStyleDraft = clickStyleValues.has(target.value) ? target.value : state.modal.clickStyleDraft;
            playUiClick("default");
            return applySettingsDraftPreview();
          }
          if (action === "settings-music-track") {
            state.modal.musicTrackDraft = musicTrackValues.has(target.value) ? target.value : state.modal.musicTrackDraft;
            return applySettingsDraftPreview();
          }
          if (action === "settings-glow-tune-speed" && target.dataset.glowKey) {
            if (state.modal.glowTuningDraft[target.dataset.glowKey]) state.modal.glowTuningDraft[target.dataset.glowKey].speed = Number(target.value);
            return applySettingsDraftPreview();
          }
          if (action === "settings-glow-tune-strength" && target.dataset.glowKey) {
            if (state.modal.glowTuningDraft[target.dataset.glowKey]) state.modal.glowTuningDraft[target.dataset.glowKey].strength = Number(target.value);
            return applySettingsDraftPreview();
          }
        }
        if (state.modal && state.modal.mode === "root-create") {
          if (action === "modal-root-theme") state.modal.theme = target.value;
        }
      }

      function handleKeydown(event) {
        if (event.key === "Escape" && state.modal) return closeModal();
        if (event.key === "Escape" && state.viewer) return beginViewerClose();
        if (event.key === "Enter" && state.modal && event.target.dataset.action === "modal-input") {
          if (state.modal.mode === "root-create") return confirmRootCreate();
          if (state.modal.mode === "text") return confirmTextModal();
        }
      }

      function bootstrapHostedProfileAuth() {
        if (!isHostedForGoogle) return;
        if (!hasFirebaseConfig(state.firebaseConfig)) return;
        ensureFirebaseAuthReady(state.firebaseConfig).catch(() => {});
      }

      let state = loadState();
      bootstrapHostedProfileAuth();
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") flushScheduledStateSave();
      });
      window.addEventListener("beforeunload", flushScheduledStateSave);
      document.addEventListener("click", handleClick);
      document.addEventListener("input", handleInput);
      document.addEventListener("change", handleChange);
      document.addEventListener("keydown", handleKeydown);
      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", finishBackgroundDrag);
      document.addEventListener("pointercancel", finishBackgroundDrag);
      render();
    })();
