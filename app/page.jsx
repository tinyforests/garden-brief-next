'use client'

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, Leaf, Mail, CheckCircle2, Loader2 } from "lucide-react";

// If you didn't add a jsconfig/tsconfig alias for "@", change these to relative imports.
import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

const SEED_QUESTIONS = [
  { id: "purpose", label: "What is the primary purpose of your garden?", helper: "Choose all that resonate. This guides overall layout and program.", type: "multiselect",
    options: ["Relaxation","Entertaining","Growing food","Children's play","Habitat creation","Exercise / outdoor shower","Pet space"] },
  { id: "style", label: "Which styles or moods are you drawn to?", helper: "Tick a few – we’ll translate these into plant palettes & materials.", type: "multiselect",
    options: ["Native bushland","Wild meadow","Modern minimalist","Cottage","Coastal / dunes","Mediterranean dry garden","Productive garden","Japanese-inspired calm"] },
  { id: "use", label: "How will you use the garden & when?", helper: "E.g. morning coffee nook, weekend BBQs, meditative retreat, work-from-garden, kids after school.", type: "textarea" },
  { id: "keep", label: "Existing features to retain or work around?", helper: "Trees, sculptures, views, structures, paths, levels, services.", type: "textarea" },
  { id: "prefs", label: "Plant & material preferences / aversions", helper: "E.g. love Eucalyptus & grasses, dislike roses, prefer natural stone over concrete.", type: "textarea" },
  { id: "maintenance", label: "Desired maintenance level", helper: "Slide towards the vibe that suits your lifestyle. We’ll design accordingly.", type: "slider", min: 0, max: 10 },
  { id: "sustain", label: "Sustainability goals", helper: "Water-wise planting, pollinator habitat, chemical-free, composting, food production, re-use materials, stormwater harvesting, etc.", type: "textarea" },
  { id: "users", label: "Who will use the space? Any pets or children?", helper: "Helps us plan safety, play zones and plant choices.", type: "textarea" },
  { id: "musts", label: "Top three must-haves", helper: "Fire pit, veggie garden, shaded seating, water feature, outdoor bath/shower, wildlife pond, boardwalk, studio, etc.", type: "textarea" },
  { id: "budget", label: "Budget range (AUD)", helper: "This keeps recommendations realistic and reduces redesign later.", type: "range", min: 10000, max: 300000, step: 5000 },
  { id: "uploads", label: "Upload inspiration / site photos (optional)", helper: "Mood shots, favourite materials, or current site pics.", type: "files" },
  { id: "extras", label: "Anything else to share?", helper: "Dreams, constraints, timelines, or accessibility needs.", type: "textarea" }
];

const brand = { bg: "#3E4636", paper: "#FFF0DD" };

function useAutosave(key, initial) {
  const [state, setState] = useState(() => {
    try { const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null; return raw ? JSON.parse(raw) : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState];
}

function Progress({ answers }) {
  const total = SEED_QUESTIONS.length;
  const answered = useMemo(() => {
    return SEED_QUESTIONS.filter(q => {
      const v = answers[q.id];
      if (q.type === "files") return v && v.length > 0;
      if (Array.isArray(v)) return v.length > 0;
      return v !== undefined && v !== null && String(v).trim() !== "";
    }).length;
  }, [answers]);
  const pct = Math.round((answered / total) * 100);
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs text-white/80">
        <span>Progress</span><span>{answered}/{total} ({pct}%)</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{type:"spring", stiffness:120, damping:20}} className="h-full bg-white/80" />
      </div>
    </div>
  );
}

function Chip({ checked, children, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-1 rounded-full border text-sm transition ${checked ? "bg-black text-white border-black" : "bg-white text-black border-black/20 hover:border-black"}`}>
      {children}
    </button>
  );
}

export default function Page() {
  const [answers, setAnswers] = useAutosave("gs-garden-brief", { maintenance:4, budget:50000, purpose:[], style:[] });
  const [sending, setSending] = useState(false);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const files = answers.uploads || [];
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [answers.uploads]);

  const update = (id, value) => setAnswers(s => ({...s, [id]: value}));

  const resetForm = () => {
    if (confirm("Clear all answers?")) {
      try { localStorage.removeItem("gs-garden-brief"); } catch {}
      setAnswers({ maintenance:4, budget:50000, purpose:[], style:[] });
      setPreviews([]);
    }
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(answers, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "gardener-and-son_garden-brief.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const emailSummary = () => {
    setSending(true);
    const lines = [
      `Primary purpose: ${(answers.purpose || []).join(", ")}`,
      `Styles: ${(answers.style || []).join(", ")}`,
      `Use & rhythms: ${answers.use || ""}`,
      `Keep/incorporate: ${answers.keep || ""}`,
      `Plant/material prefs: ${answers.prefs || ""}`,
      `Maintenance: ${answers.maintenance}/10`,
      `Sustainability goals: ${answers.sustain || ""}`,
      `Users: ${answers.users || ""}`,
      `Top must-haves: ${answers.musts || ""}`,
      `Budget (AUD): ~${answers.budget?.toLocaleString?.()}`,
      `Extras: ${answers.extras || ""}`,
    ].join("%0D%0A");
    const subject = encodeURIComponent("Garden Design Brief – Gardener & Son");
    const body = encodeURIComponent(lines);
    window.location.href = `mailto:hello@gardenerandson.com.au?subject=${subject}&body=${body}`;
    setTimeout(() => setSending(false), 800);
  };

  // Netlify Forms: POST to a STATIC file we created in /public (__forms.html)
  const submitToNetlify = async () => {
    try {
      setSending(true);
      const payload = {
        "form-name": "garden-brief",
        timestamp: new Date().toISOString(),
        purpose: (answers.purpose || []).join(", "),
        style: (answers.style || []).join(", "),
        use: answers.use || "",
        keep: answers.keep || "",
        prefs: answers.prefs || "",
        maintenance: String(answers.maintenance ?? ""),
        sustain: answers.sustain || "",
        users: answers.users || "",
        musts: answers.musts || "",
        budget: String(answers.budget ?? ""),
        extras: answers.extras || "",
      };
      const body = new URLSearchParams(payload).toString();

      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!res.ok) throw new Error("Network error");
      alert("Thanks! Your Garden Brief has been submitted.");
    } catch {
      alert("Submission failed. Please try again or email us at hello@gardenerandson.com.au.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: brand.bg }}>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="flex items-start justify-between gap-4 sm:items-center">
          <div className="text-white">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">Find Your Garden Brief</h1>
            <p className="mt-1 max-w-prose text-white/80">
              A calm, 10-minute questionnaire to translate your hopes into a living, breathing garden. Autosaves as you go.
            </p>
          </div>
          <Leaf color="#FFF0DD" size={48} className="hidden sm:block" />
        </header>

        <div className="mt-6"><Progress answers={answers} /></div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {SEED_QUESTIONS.map((q, idx) => (
            <Card key={q.id}>
              <CardContent>
                <div className="text-sm uppercase tracking-wide text-black/60">Q{idx + 1}</div>
                <h3 className="mt-1 text-lg font-medium">{q.label}</h3>
                {q.helper && <p className="mt-1 text-sm text-black/70">{q.helper}</p>}

                <div className="mt-4">
                  {q.type === "multiselect" && (
                    <div className="flex flex-wrap gap-2">
                      {(q.options || []).map(opt => {
                        const list = answers[q.id] || [];
                        const checked = list.includes(opt);
                        return (
                          <Chip key={opt} checked={checked} onClick={() => {
                            const next = checked ? list.filter(x => x !== opt) : [...list, opt];
                            update(q.id, next);
                          }}>{opt}</Chip>
                        );
                      })}
                    </div>
                  )}

                  {q.type === "textarea" && (
                    <Textarea className="mt-1" placeholder="Type here..." value={answers[q.id] || ""} onChange={e => update(q.id, e.target.value)} />
                  )}

                  {q.type === "slider" && (
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>Low</span><span>Medium</span><span>High</span>
                      </div>
                      <Slider value={[answers[q.id] ?? 4]} min={q.min} max={q.max} step={1} onValueChange={v => update(q.id, v[0])} />
                      <div className="mt-2 text-sm">Current: <b>{answers[q.id] ?? 4}/10</b></div>
                    </div>
                  )}

                  {q.type === "range" && (
                    <div>
                      <input type="range" min={q.min} max={q.max} step={q.step} value={answers[q.id] ?? 50000} onChange={e => update(q.id, Number(e.target.value))} className="w-full" />
                      <div className="mt-2 text-sm">Approx. budget: <b>A${(answers[q.id] ?? 50000).toLocaleString()}</b></div>
                    </div>
                  )}

                  {q.type === "files" && (
                    <div className="space-y-3">
                      <Input type="file" multiple accept="image/*" onChange={e => update(q.id, Array.from(e.target.files || []))} />
                      {previews.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {previews.map((src, i) => (
                            <div key={i} className="aspect-square overflow-hidden rounded-xl border border-black/10">
                              <img src={src} alt={`preview-${i}`} className="h-full w-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <footer className="mt-8 flex flex-wrap items-center gap-3">
          <Button onClick={submitToNetlify} className="gap-2" disabled={sending}>
            {sending ? (<><Loader2 size={18} className="animate-spin" />Submitting…</>) : (<>Submit to Gardener & Son</>)}
          </Button>
          <Button onClick={exportJSON} className="gap-2"><Download size={18} />Export JSON</Button>
          <Button onClick={emailSummary} className="gap-2" disabled={sending}><Mail size={18} />Send summary email</Button>
          <Button onClick={resetForm} className="border-white/30 bg-transparent text-white/90 hover:text-white">Reset</Button>
          <div className="ml-auto flex items-center gap-2 text-sm text-white/70"><CheckCircle2 size={16} /> Autosaving locally</div>
        </footer>

        <div className="mt-8 text-xs text-white/70">
          By Gardener & Son · Purpose-driven, regenerative design. We use your answers to design for biodiversity, water, soil & people.
        </div>
      </div>
    </div>
  );
}
