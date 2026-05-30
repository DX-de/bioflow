#!/usr/bin/env node
/**
 * Vérifie que les variables d'environnement sont prêtes pour le déploiement.
 * Usage: npm run check:env
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env.local");

const PLACEHOLDERS = ["votre-projet", "votre-cle", "votre-domaine", "placeholder"];

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error("❌ Fichier .env.local introuvable.");
    console.log("   Copiez .env.example → .env.local et remplissez les valeurs.\n");
    process.exit(1);
  }

  const vars = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    vars[t.slice(0, i)] = t.slice(i + 1).trim();
  }
  return vars;
}

function isPlaceholder(value) {
  if (!value) return true;
  const lower = value.toLowerCase();
  return PLACEHOLDERS.some((p) => lower.includes(p));
}

const env = loadEnv();
let ok = true;

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

console.log("\n🔍 BioFlow — vérification environnement\n");

for (const key of required) {
  const value = env[key];
  if (!value || isPlaceholder(value)) {
    console.log(`❌ ${key} — manquant ou placeholder`);
    ok = false;
  } else if (key.includes("URL") && !value.includes(".supabase.co")) {
    console.log(`⚠️  ${key} — l'URL ne ressemble pas à un projet Supabase`);
    ok = false;
  } else {
    console.log(`✅ ${key}`);
  }
}

const siteUrl = env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl || isPlaceholder(siteUrl)) {
  console.log(
    "⚠️  NEXT_PUBLIC_SITE_URL — à mettre à jour après le 1er déploiement Vercel"
  );
} else {
  console.log(`✅ NEXT_PUBLIC_SITE_URL`);
}

console.log(
  ok ? "\n✅ Prêt pour npm run build\n" : "\n❌ Corrigez .env.local avant de déployer.\n"
);
process.exit(ok ? 0 : 1);
