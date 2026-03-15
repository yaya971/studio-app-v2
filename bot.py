"""
╔══════════════════════════════════════════════════════════════════════╗
║   POLY-TRADER PRO v41.0 — LE CLASSIQUE MILLIMÉTRÉ (STABILITÉ)        ║
║                                                                      ║
║   • Rythme lent (15s) + Timeframes dynamiques (5m, 15m, 1h, 4h).     ║
║   • Balance Exacte réintégrée : Lit les parts réelles reçues via     ║
║     l'API avant de poser le TP ou de vendre en urgence.              ║
║   • Fini les blocages à cause des dixièmes de parts manquantes.      ║
╚══════════════════════════════════════════════════════════════════════╝
"""

import customtkinter as ctk
import json, time, threading, requests, math, sys, subprocess, platform, os
from tkinter import messagebox
from datetime import datetime, timezone

try:
    from py_clob_client.client import ClobClient
    from py_clob_client.clob_types import OrderArgs, OrderType
except ImportError:
    print("\n❌ ERREUR : Exécutez 'pip3 install customtkinter py-clob-client requests'\n")
    sys.exit(1)

ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("dark-blue")

C = {
    "bg": "#07070e", "carte": "#0e0e1a", "sidebar": "#090912",
    "vert": "#00ff88", "rouge": "#ff3355", "bleu": "#00aaff",
    "orange": "#ff9900", "violet": "#bb44ff", "cyan": "#00ffee",
    "texte": "#dde0ee", "dim": "#5a5a7a", "bordure": "#181830",
}

def P(t, g=False, i=False):
    return ctk.CTkFont(family="Helvetica", size=t, weight="bold" if g else "normal", slant="italic" if i else "roman")

def calculer_indicateurs(klines):
    if len(klines) < 35: return 50.0, 0.0, 0.0, "NEUTRE"
    closes = [float(k[4]) for k in klines]

    g, b = [], []
    for i in range(1, len(closes)):
        d = closes[i] - closes[i-1]
        g.append(max(d, 0.0)); b.append(max(-d, 0.0))
    mh = sum(g[:14]) / 14; mb = sum(b[:14]) / 14
    for i in range(14, len(g)):
        mh = (mh*(13) + g[i]) / 14; mb = (mb*(13) + b[i]) / 14
    rsi = 100.0 if mb == 0 else (0.0 if mh == 0 else round(100.0 - 100.0 / (1.0 + mh/mb), 2))

    sma30 = sum(closes[-30:]) / 30
    tendance = "EN HAUSSE" if closes[-1] > sma30 else "EN BAISSE"

    ema12 = sum(closes[-12:])/12; ema26 = sum(closes[-26:])/26
    macd_pct = round(((ema12 - ema26) / closes[-1]) * 100, 4)

    return rsi, macd_pct, closes[-1], tendance

def jouer_son(t):
    try:
        if platform.system() == "Darwin":
            f = {"v": "/System/Library/Sounds/Glass.aiff", "p": "/System/Library/Sounds/Basso.aiff"}.get(t)
            if f: subprocess.Popen(["afplay", f], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception: pass

class PolyTraderPro(ctk.CTk):
    CFG_FILE = "polytrader_mac_v41.json"

    def __init__(self):
        super().__init__()
        self.title("Poly-Trader Pro v41.0 — Classique & Précis")
        self.geometry("1250x850")
        self.minsize(1050, 750)
        self.configure(fg_color=C["bg"])

        self.bot_thread       = None
        self.is_running       = threading.Event()
        self.pnl_net          = 0.0
        self.nb_vic           = 0
        self.nb_def           = 0
        self._marche_fin_ts   = 0

        self._build_ui()
        self._charger_cfg()
        self._log("🌱 Système V41.0 initialisé. La balance parfaite a été réintégrée.")
        self._tick()

    def _build_ui(self):
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self.sb = ctk.CTkFrame(self, width=420, fg_color=C["sidebar"], corner_radius=0, border_width=1, border_color=C["bordure"])
        self.sb.grid(row=0, column=0, sticky="nsew")
        self.sb.grid_propagate(False)
        self.sb.grid_rowconfigure(1, weight=1)

        ctk.CTkLabel(self.sb, text="POLY-TRADER PRO", font=P(22, g=True), text_color=C["vert"]).pack(pady=(20, 0))
        ctk.CTkLabel(self.sb, text="v41.0 — Millimétré", font=P(12), text_color=C["dim"]).pack(pady=(0, 20))

        tabs = ctk.CTkTabview(self.sb, fg_color=C["carte"], border_width=1, border_color=C["bordure"])
        tabs.pack(fill="both", expand=True, padx=10, pady=10)
        t1 = tabs.add("1. Marché"); t2 = tabs.add("2. Stratégie")

        def champ_coller(parent, titre, expl, ph, secret=False):
            ctk.CTkLabel(parent, text=titre, font=P(12, g=True), text_color=C["texte"]).pack(anchor="w", padx=10, pady=(10, 0))
            ctk.CTkLabel(parent, text=expl, font=P(10, i=True), text_color=C["dim"]).pack(anchor="w", padx=12, pady=(0, 2))
            f = ctk.CTkFrame(parent, fg_color="transparent"); f.pack(fill="x", padx=10, pady=2)
            e = ctk.CTkEntry(f, placeholder_text=ph, show="*" if secret else "", fg_color=C["bg"], border_color=C["bordure"], text_color=C["texte"])
            e.pack(side="left", fill="x", expand=True, padx=(0, 5))
            ctk.CTkButton(f, text="📋", width=40, fg_color=C["bleu"], text_color="#000", command=lambda: self._coller_dans(e)).pack(side="right")
            return e

        self.e_addr = champ_coller(t1, "Adresse Polygon", "Votre compte public", "0x...")
        self.e_priv = champ_coller(t1, "Clé Privée", "Sécurisé en local sur ce Mac", "Clé...", secret=True)
        self.e_link = champ_coller(t1, "Lien Polymarket", "L'adresse du pari", "https://polymarket.com/...")

        ctk.CTkLabel(t1, text="Durée du pari Polymarket", font=P(12, g=True), text_color=C["texte"]).pack(anchor="w", padx=10, pady=(15, 0))
        self.e_timeframe = ctk.CTkOptionMenu(t1, values=["Pari de 5 Minutes", "Pari de 15 Minutes", "Pari de 1 Heure", "Pari de 4 Heures"], fg_color=C["bg"], button_color=C["bleu"])
        self.e_timeframe.pack(fill="x", padx=10, pady=5)

        self.e_cap = champ_coller(t2, "Capital de la Session ($)", "Budget total alloué.", "Ex: 10.0")
        self.e_cible = champ_coller(t2, "Objectif de Gain ($)", "Le bot s'arrête s'il l'atteint.", "Ex: 20.0")
        self.e_perte = champ_coller(t2, "Stop-Loss Global ($)", "Perte maximale avant arrêt.", "Ex: 3.0")

        self.lbl_agg = ctk.CTkLabel(t2, text="Nervosité: 3. Équilibré", font=P(12, g=True), text_color=C["orange"])
        self.lbl_agg.pack(anchor="w", padx=10, pady=(15, 0))
        self.sl_agg = ctk.CTkSlider(t2, from_=1, to=5, number_of_steps=4, button_color=C["orange"], progress_color=C["rouge"], command=self._maj_agg)
        self.sl_agg.set(3); self.sl_agg.pack(fill="x", padx=10, pady=10)

        self.btn_go = ctk.CTkButton(self.sb, text="▶  DÉMARRER EN ARRIÈRE-PLAN", fg_color=C["vert"], text_color="#000", font=P(14, g=True), height=50, command=self._start)
        self.btn_go.pack(fill="x", padx=15, pady=(5, 5))
        self.btn_stop = ctk.CTkButton(self.sb, text="⏹  ARRÊT SÉCURISÉ", fg_color=C["carte"], text_color=C["rouge"], font=P(12, g=True), border_width=1, border_color=C["rouge"], state="disabled", command=self._stop)
        self.btn_stop.pack(fill="x", padx=15, pady=(0, 15))

        self.zone = ctk.CTkFrame(self, fg_color=C["bg"]); self.zone.grid(row=0, column=1, sticky="nsew", padx=10, pady=10)
        self.zone.grid_rowconfigure(1, weight=1); self.zone.grid_columnconfigure(0, weight=1)

        sf = ctk.CTkFrame(self.zone, fg_color="transparent"); sf.grid(row=0, column=0, sticky="ew", pady=(0, 10))
        sf.grid_columnconfigure(list(range(4)), weight=1)
        for col, (titre, val, col_, attr) in enumerate([("Gains Nets", "+0.00 $", C["vert"], "bx_pnl"), ("Gagnés", "0", C["bleu"], "bx_vic"), ("Perdus", "0", C["rouge"], "bx_def"), ("Fin du pari", "--", C["cyan"], "bx_tps")]):
            f = ctk.CTkFrame(sf, fg_color=C["carte"], border_width=1, border_color=col_, corner_radius=8)
            f.grid(row=0, column=col, padx=5, sticky="ew")
            ctk.CTkLabel(f, text=titre, font=P(12), text_color=C["dim"]).pack(pady=(10, 0))
            lbl = ctk.CTkLabel(f, text=val, font=P(24, g=True), text_color=col_); lbl.pack(pady=(2, 10)); setattr(self, attr, lbl)

        self.console = ctk.CTkTextbox(self.zone, font=P(14), fg_color="#050510", text_color=C["vert"], wrap="word", border_width=1, border_color=C["bordure"])
        self.console.grid(row=1, column=0, sticky="nsew"); self.console.configure(state="disabled")

        bf = ctk.CTkFrame(self.zone, fg_color="transparent"); bf.grid(row=2, column=0, pady=(10, 0), sticky="ew")
        ctk.CTkButton(bf, text="📋 COPIER LE JOURNAL", fg_color=C["bleu"], text_color="#000", font=P(12, g=True), height=35, command=self._copier).pack(side="left")

    def _coller_dans(self, entry):
        try: entry.delete(0, "end"); entry.insert(0, self.clipboard_get())
        except: pass

    def _maj_agg(self, v):
        noms = ["1. Très Patient", "2. Prudent", "3. Équilibré", "4. Réactif", "5. Agressif (Ignore MACD)"]
        self.lbl_agg.configure(text=f"Nervosité: {noms[int(v)-1]}")

    def _log(self, txt): self.after(0, self._log_ui, txt)
    def _log_ui(self, txt):
        ts = time.strftime("%H:%M:%S")
        self.console.configure(state="normal")
        self.console.insert("end", f"[{ts}]  {txt}\n")
        self.console.configure(state="disabled")
        self.console.see("end")

    def _copier(self):
        texte = self.console.get("1.0", "end-1c")
        try:
            subprocess.run(['pbcopy'], input=texte.encode('utf-8'), check=True)
            messagebox.showinfo("Succès", "Le journal a été copié avec succès ! Faites Cmd+V.")
        except Exception:
            self.clipboard_clear(); self.clipboard_append(texte); self.update()
            messagebox.showinfo("Succès", "Journal copié ! (Méthode de secours).")

    def _charger_cfg(self):
        try:
            if not os.path.exists(self.CFG_FILE): return
            d = json.load(open(self.CFG_FILE))
            for attr, cle in [("e_addr","address"), ("e_priv","key"), ("e_link","link"), ("e_cap","cap"), ("e_cible","cible"), ("e_perte","perte")]:
                w = getattr(self, attr); w.delete(0, "end"); v = d.get(cle, "")
                if v: w.insert(0, str(v))
            if "agg" in d: self.sl_agg.set(d["agg"]); self._maj_agg(d["agg"])
            if "timeframe" in d: self.e_timeframe.set(d["timeframe"])
        except: pass

    def _tick(self):
        if self._marche_fin_ts:
            r = max(0, int(self._marche_fin_ts - time.time()))
            h, m, s = r // 3600, (r % 3600) // 60, r % 60
            self.bx_tps.configure(text=f"{h}h {m:02d}m {s:02d}s", text_color=C["rouge"] if r < 300 else C["cyan"])
        self.after(1000, self._tick)

    def _start(self):
        try:
            cap_input = float(self.e_cap.get().replace(",", "."))
            perte_max = float(self.e_perte.get().replace(",", ".")) if self.e_perte.get() else 5.0

            tf_choice = self.e_timeframe.get()
            binance_tf = "1m"
            if "15" in tf_choice or "1 Heure" in tf_choice: binance_tf = "5m"
            if "4 Heures" in tf_choice: binance_tf = "15m"

            cfg = {
                "address": self.e_addr.get().strip().lower(), # Minuscules pour l'API
                "key": self.e_priv.get().strip(), "link": self.e_link.get().strip(),
                "cap": cap_input, "cible": float(self.e_cible.get().replace(",", ".")) if self.e_cible.get() else 0.0,
                "perte_max": perte_max, "agg": int(self.sl_agg.get()),
                "timeframe": tf_choice, "binance_tf": binance_tf
            }
            json.dump(cfg, open(self.CFG_FILE, "w"))
        except: messagebox.showerror("Erreur", "Vérifiez vos chiffres."); return

        self.btn_go.configure(state="disabled", text="⚡  TRAVAIL EN COURS..."); self.btn_stop.configure(state="normal")
        self.is_running.set(); self.pnl_net = 0.0; self.nb_vic = 0; self.nb_def = 0
        self.console.configure(state="normal"); self.console.delete("1.0", "end"); self.console.configure(state="disabled")

        self._log(f"🌱 DÉPLOIEMENT V41.0. Marché : {tf_choice} (Analyse {binance_tf}).")
        threading.Thread(target=self._moteur, args=(cfg,), daemon=True).start()

    def _stop(self):
        self.is_running.clear(); self.btn_stop.configure(state="disabled", text="⏳ Fermeture..."); self._log("🛑 Arrêt demandé...")

    # FIX DU SCANNER DE BALANCE
    def _get_position_size(self, address, token_id):
        try:
            url = f"https://data-api.polymarket.com/positions?user={address}&limit=200"
            r = requests.get(url, timeout=5)
            if r.status_code == 200:
                for p in r.json():
                    if str(p.get("asset", "")) == str(token_id):
                        return float(p.get("size", 0))
        except: pass
        return 0.0

    def _vendre_urgence(self, poly, token_id, qte_reelle):
        """ Vend la quantité RÉELLE au prix du carnet d'ordres """
        if qte_reelle < 1.0:
            self._log("⚠️ Aucune part à vendre en urgence.")
            return False

        try:
            bks = requests.get(f"https://clob.polymarket.com/book?token_id={token_id}", timeout=3).json()
            bids = bks.get("bids", [])
            if not bids:
                self._log("❌ Aucun acheteur en face. Vente impossible pour l'instant.")
                return False

            px_vente = round(max(float(b["price"]) for b in bids) - 0.005, 3)
            if px_vente < 0.001: px_vente = 0.001
            # ON UTILISE LA QUANTITÉ EXACTE ARRONDIE
            qv = round(math.floor(qte_reelle * 10) / 10.0, 1)

            for _ in range(4):
                if not self.is_running.is_set(): return False
                try:
                    poly.post_order(poly.create_order(OrderArgs(price=px_vente, size=qv, side="SELL", token_id=token_id)), OrderType.GTC)
                    self._log(f"🛡️ Vente exécutée pour {qv} parts au prix du marché ({px_vente:.3f}$).")
                    return True
                except Exception as e:
                    self._log(f"❌ Erreur de vente : {str(e)[:60]}")
                    time.sleep(1.5)
        except Exception as e:
            self._log(f"⚠️ Exception dans _vendre_urgence : {str(e)[:60]}")
        return False

    def _get_order(self, poly, order_id):
        if not order_id: return None
        try:
            raw = poly.get_order(order_id)
            if isinstance(raw, dict) and raw: return raw
        except: pass
        return None

    def _order_filled(self, poly, order_id):
        o = self._get_order(poly, order_id)
        if o is None: return False
        try:
            status = o.get("status", "").upper()
            if status in ("FILLED", "MATCHED"): return True
        except: pass
        return False

    def _moteur(self, cfg):
        try:
            poly = ClobClient("https://clob.polymarket.com", key=cfg["key"], chain_id=137, funder=cfg["address"], signature_type=2)
            poly.set_api_creds(poly.create_or_derive_api_creds())
        except Exception as e: self._log(f"❌ Connexion échouée. Vérifiez vos clés."); self.is_running.clear(); self.btn_go.configure(state="normal", text="▶  DÉMARRER EN ARRIÈRE-PLAN"); return

        marche = None
        while self.is_running.is_set() and not marche:
            try:
                slug = cfg["link"].split("/")[-1].split("?")[0].split("#")[0]
                data = requests.get(f"https://gamma-api.polymarket.com/events?slug={slug}", timeout=5).json()[0]
                m = next((x for x in data.get("markets", []) if x.get("active") or x.get("closed")), None)
                if not m: time.sleep(3); continue

                ids = json.loads(m["clobTokenIds"]) if isinstance(m.get("clobTokenIds"), str) else m.get("clobTokenIds", [])
                end_ts = datetime.strptime(m.get("endDate", "")[:19], "%Y-%m-%dT%H:%M:%S").replace(tzinfo=timezone.utc).timestamp() if m.get("endDate") else 0
                marche = {"t_up": ids[0], "t_down": ids[1], "end_ts": end_ts, "titre": data.get("title", ""), "slug": slug}
            except: time.sleep(3)

        if not self.is_running.is_set(): return
        self._marche_fin_ts = marche["end_ts"]; self._log(f"🎯 Marché trouvé : {marche['titre'][:50]}...")

        cap = cfg["cap"]; en_trade = False
        t_id = sens = px_achat = qte_reelle = px_tp = px_sl = id_sell = 0
        pause_jusqua = 0; cycle = 0

        rsi_up_map = [68, 65, 62, 58, 52]
        rsi_down_map = [32, 35, 38, 42, 48]
        seuil_up = rsi_up_map[cfg["agg"] - 1]
        seuil_down = rsi_down_map[cfg["agg"] - 1]

        while self.is_running.is_set():
            cycle += 1
            time.sleep(5.0)

            if self.pnl_net <= -abs(cfg["perte_max"]):
                self._log(f"🛑 STOP-LOSS GLOBAL : Perte max atteinte (-{abs(cfg['perte_max'])}$). Arrêt du bot.")
                self.is_running.clear(); break

            if cfg["cible"] > 0 and cap >= cfg["cible"]: self._log("🎉 OBJECTIF ATTEINT. Repos mérité."); break

            if marche["end_ts"] > 0 and time.time() >= marche["end_ts"] - 60:
                self._log("🏁 Fin imminente du marché. Fermeture des positions.")
                self.is_running.clear(); break

            if time.time() < pause_jusqua: continue

            if not en_trade:
                try:
                    klines = requests.get(f"https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval={cfg['binance_tf']}&limit=35", timeout=3).json()
                    rsi, macd_pct, px_btc, tendance = calculer_indicateurs(klines)

                    if cycle % 6 == 0:
                        self._log(f"👀 Analyse ({cfg['binance_tf']}) | RSI: {rsi:.1f} | MACD: {macd_pct:+.3f}% | Tend: {tendance}")

                    signal = None
                    if cfg["agg"] == 5:
                        if rsi > seuil_up: signal = "UP"
                        elif rsi < seuil_down: signal = "DOWN"
                    else:
                        if rsi > seuil_up and macd_pct > -0.01: signal = "UP"
                        elif rsi < seuil_down and macd_pct < 0.01: signal = "DOWN"

                    if signal:
                        tk = marche["t_up"] if signal == "UP" else marche["t_down"]
                        bks = requests.get(f"https://clob.polymarket.com/book?token_id={tk}", timeout=3).json()
                        ask = min(float(a["price"]) for a in bks.get("asks", []))
                        bid = max(float(b["price"]) for b in bks.get("bids", []))

                        if ask - bid > 0.04: continue
                        if ask > 0.70 or ask < 0.30: continue

                        budget_alloue = cap * 0.95 if cap <= 15.0 else cap * 0.45
                        q = math.floor((budget_alloue / ask) * 10) / 10.0
                        if q < 5.0: continue

                        self._log(f"🛒 Achat modéré : {q} parts {signal} @ {ask:.3f}$")

                        try:
                            res_buy = poly.post_order(poly.create_order(OrderArgs(price=round(ask, 3), size=round(q, 1), side="BUY", token_id=tk)), OrderType.GTC)
                            id_buy = None
                            if isinstance(res_buy, dict): id_buy = res_buy.get("orderID") or res_buy.get("id")

                            self._log("☕ Achat envoyé. Je laisse 15 secondes à la blockchain pour traiter l'approbation...")
                            time.sleep(15)

                            if id_buy and not self._order_filled(poly, id_buy):
                                self._log("⏳ L'achat n'est pas encore totalement rempli. J'attends encore 15s...")
                                time.sleep(15)
                                if not self._order_filled(poly, id_buy):
                                    self._log("⚠️ L'achat prend trop de temps. Je vérifie quand même le solde.")

                            # LA BALANCE PARFAITE
                            qte_brute = self._get_position_size(cfg["address"], tk)
                            qte_reelle = math.floor(qte_brute * 10) / 10.0

                            if qte_reelle < 1.0:
                                self._log("⚠️ Le solde n'a pas été trouvé. L'achat a probablement échoué. J'annule.")
                                continue

                            t_id = tk; sens = signal; px_achat = round(ask, 3)
                            px_tp = round(min(px_achat + 0.02, 0.999), 3); px_sl = round(max(px_achat - 0.06, 0.001), 3); id_sell = None

                            self._log(f"⚖️ Balance confirmée : {qte_reelle} parts. Je pose le Take-Profit à {px_tp:.3f}$...")

                            tp_pose = False
                            for tentative in range(6):
                                try:
                                    res_sell = poly.post_order(poly.create_order(OrderArgs(price=px_tp, size=round(qte_reelle, 1), side="SELL", token_id=tk)), OrderType.GTC)
                                    if isinstance(res_sell, dict): id_sell = res_sell.get("orderID") or res_sell.get("id")
                                    self._log(f"🛡️ Filet de sécurité en place.")
                                    tp_pose = True
                                    break
                                except Exception as e:
                                    self._log(f"❌ Rejet API (Tentative {tentative+1}/6) : {str(e)[:60]}")
                                    time.sleep(3)

                            if not tp_pose:
                                self._log("⚠️ Le réseau boude totalement. Je revends la position pour ne pas rester coincé.")
                                self._vendre_urgence(poly, tk, qte_reelle)
                                continue

                            en_trade = True
                        except Exception as e:
                            self._log(f"❌ Erreur réseau lors de l'achat : {str(e)[:50]}")
                except: pass

            else:
                tp_filled = False

                if id_sell:
                    try:
                        o = poly.get_order(id_sell)
                        status = o.get("status", "").upper() if o else ""
                        if status in ("FILLED", "MATCHED"):
                            tp_filled = True
                    except: pass

                if tp_filled:
                    gain = qte_reelle * (px_tp - px_achat)
                    cap += gain; self.pnl_net += gain; self.nb_vic += 1
                    self.bx_pnl.configure(text=f"{self.pnl_net:+.2f} $", text_color=C["vert"]); self.bx_vic.configure(text=str(self.nb_vic))
                    self._log(f"💰 GAIN VALIDÉ (+{gain:.2f}$) ! Capital : {cap:.2f}$")
                    en_trade = False
                    continue

                try:
                    bks = requests.get(f"https://clob.polymarket.com/book?token_id={t_id}", timeout=3).json()
                    px_actuel = max(float(b["price"]) for b in bks.get("bids", []))

                    if px_actuel >= px_achat + 0.01 and px_sl < px_achat:
                        px_sl = px_achat # Break even

                    if px_actuel <= px_sl:
                        self._log(f"📉 Le vent tourne ({px_actuel:.3f}$). Coupe de protection.")
                        try:
                            if id_sell: poly.cancel(id_sell)
                        except: pass

                        vente_reussie = self._vendre_urgence(poly, t_id, qte_reelle)
                        if vente_reussie:
                            perte = qte_reelle * (px_achat - px_actuel)
                            cap -= perte; self.pnl_net -= perte; self.nb_def += 1
                            self.bx_pnl.configure(text=f"{self.pnl_net:+.2f} $", text_color=C["rouge"]); self.bx_def.configure(text=str(self.nb_def))
                            self._log(f"➖ Trade fermé. Perte maîtrisée : -{abs(perte):.2f}$.")
                            pause_jusqua = time.time() + 60
                            self._log("☕ Je fais une pause de 1 minute avant le prochain trade.")
                        else:
                            self._log("⏳ Le marché est figé, j'attends le prochain cycle.")
                            continue

                        en_trade = False
                except: pass

        self._log("Fermeture du programme...")
        try: poly.cancel_all()
        except: pass
        if en_trade: self._vendre_urgence(poly, t_id, qte_reelle)
        self.btn_go.configure(state="normal", text="▶  DÉMARRER EN ARRIÈRE-PLAN"); self.btn_stop.configure(state="disabled")
        self._log(f"Session terminée. Résultat : {self.pnl_net:+.2f}$")

if __name__ == "__main__":
    PolyTraderPro().mainloop()
