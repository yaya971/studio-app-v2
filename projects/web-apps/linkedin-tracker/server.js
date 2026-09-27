import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse as parseCsv } from 'csv-parse/sync';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'applications.json');
const CONFIG_FILE = path.join(__dirname, 'data', 'config.json');

// Ensure data folder
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieSession({
  name: 'careerpulse_session',
  keys: [process.env.SESSION_SECRET || 'careerpulse-super-secret-key-2026'],
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  sameSite: 'lax',
  secure: false
}));

// Helper functions for storage
function readConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading config file:', err);
  }
  return {
    linkedinClientId: process.env.LINKEDIN_CLIENT_ID || '',
    linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    redirectUri: process.env.LINKEDIN_REDIRECT_URI || `http://localhost:${PORT}/api/auth/linkedin/callback`
  };
}

function writeConfig(cfg) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), 'utf-8');
}

function readApplications() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading applications file:', err);
  }
  return [];
}

function writeApplications(apps) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), 'utf-8');
}

// --- AUTHENTICATION ENDPOINTS ---

// Check current user & LinkedIn OAuth status
app.get('/api/auth/status', (req, res) => {
  const config = readConfig();
  const hasOAuthConfig = Boolean(config.linkedinClientId && config.linkedinClientSecret);
  
  res.json({
    isAuthenticated: Boolean(req.session && req.session.user),
    user: req.session ? req.session.user || null : null,
    oauthConfigured: hasOAuthConfig,
    clientIdConfigured: Boolean(config.linkedinClientId),
    redirectUri: config.redirectUri || `http://localhost:${PORT}/api/auth/linkedin/callback`
  });
});

// Save or update LinkedIn API credentials directly from UI
app.post('/api/auth/save-credentials', (req, res) => {
  const { clientId, clientSecret, redirectUri } = req.body;
  const current = readConfig();
  const updated = {
    ...current,
    linkedinClientId: (clientId || '').trim(),
    linkedinClientSecret: (clientSecret || '').trim(),
    redirectUri: (redirectUri || `http://localhost:${PORT}/api/auth/linkedin/callback`).trim()
  };
  writeConfig(updated);
  res.json({ success: true, message: 'Identifiants LinkedIn enregistrés avec succès !' });
});

// Quick 1-click Demo Login (Simulates real LinkedIn OAuth response)
app.post('/api/auth/demo-login', (req, res) => {
  const demoUser = {
    id: 'linkedin-demo-user-77',
    name: 'Yaya Touré',
    givenName: 'Yaya',
    familyName: 'Touré',
    headline: 'Développeur Fullstack & Ingénieur Logiciel',
    email: 'yaya.candidate@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    provider: 'linkedin-simulated',
    connectedAt: new Date().toISOString()
  };
  req.session.user = demoUser;
  res.json({ success: true, user: demoUser });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session = null;
  res.json({ success: true });
});

// Generate real LinkedIn OAuth authorization URL
app.get('/api/auth/linkedin/url', (req, res) => {
  const config = readConfig();
  if (!config.linkedinClientId) {
    return res.status(400).json({
      error: 'LINKEDIN_CLIENT_ID_MISSING',
      message: 'Client ID LinkedIn non configuré. Vous pouvez utiliser le Mode Démo ou configurer vos clés dans les Paramètres.'
    });
  }

  const state = Math.random().toString(36).substring(2, 15);
  req.session.oauthState = state;

  const redirectUri = config.redirectUri || `http://localhost:${PORT}/api/auth/linkedin/callback`;
  const scope = encodeURIComponent('openid profile email');
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(config.linkedinClientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scope}`;

  res.json({ url: authUrl });
});

// LinkedIn OAuth Callback
app.get('/api/auth/linkedin/callback', async (req, res) => {
  const { code, state, error, error_description } = req.query;

  if (error) {
    console.error('LinkedIn OAuth error:', error, error_description);
    return res.redirect(`http://localhost:5173/?auth_error=${encodeURIComponent(error_description || error)}`);
  }

  const config = readConfig();
  const redirectUri = config.redirectUri || `http://localhost:${PORT}/api/auth/linkedin/callback`;

  try {
    // 1. Exchange code for access token
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: config.linkedinClientId,
      client_secret: config.linkedinClientSecret,
      redirect_uri: redirectUri
    });

    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString()
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Failed to get LinkedIn access token:', tokenData);
      return res.redirect(`http://localhost:5173/?auth_error=Token_Exchange_Failed`);
    }

    // 2. Fetch User Profile from LinkedIn OpenID UserInfo endpoint
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });

    const profile = await profileResponse.json();

    if (!profileResponse.ok) {
      console.error('Failed to get LinkedIn profile:', profile);
      return res.redirect(`http://localhost:5173/?auth_error=Profile_Fetch_Failed`);
    }

    // 3. Save user profile into session
    const user = {
      id: profile.sub || `linkedin-${Date.now()}`,
      name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim() || 'Candidat LinkedIn',
      givenName: profile.given_name || '',
      familyName: profile.family_name || '',
      headline: 'Candidat LinkedIn Connecté',
      email: profile.email || '',
      avatarUrl: profile.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      provider: 'linkedin-oauth',
      connectedAt: new Date().toISOString()
    };

    req.session.user = user;
    return res.redirect(`http://localhost:5173/?auth_success=1`);
  } catch (err) {
    console.error('Exception during LinkedIn OAuth callback:', err);
    return res.redirect(`http://localhost:5173/?auth_error=${encodeURIComponent(err.message)}`);
  }
});


// --- APPLICATION TRACKER ENDPOINTS ---

// GET all applications
app.get('/api/applications', (req, res) => {
  const apps = readApplications();
  res.json(apps);
});

// POST new application
app.post('/api/applications', (req, res) => {
  const apps = readApplications();
  const newApp = {
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: req.body.title || 'Poste sans titre',
    company: req.body.company || 'Entreprise non précisée',
    companyDomain: req.body.companyDomain || '',
    location: req.body.location || 'France',
    remoteType: req.body.remoteType || 'hybride',
    contract: req.body.contract || 'CDI',
    salary: req.body.salary || '',
    linkedinUrl: req.body.linkedinUrl || '',
    status: req.body.status || 'applied',
    appliedDate: req.body.appliedDate || new Date().toISOString().split('T')[0],
    lastActivityDate: new Date().toISOString().split('T')[0],
    recruiterName: req.body.recruiterName || '',
    recruiterRole: req.body.recruiterRole || '',
    recruiterLinkedIn: req.body.recruiterLinkedIn || '',
    notes: req.body.notes || '',
    nextStep: req.body.nextStep || '',
    tags: Array.isArray(req.body.tags) ? req.body.tags : []
  };

  apps.unshift(newApp);
  writeApplications(apps);
  res.status(201).json(newApp);
});

// PUT update application
app.put('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  const apps = readApplications();
  const index = apps.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  apps[index] = {
    ...apps[index],
    ...req.body,
    lastActivityDate: new Date().toISOString().split('T')[0]
  };

  writeApplications(apps);
  res.json(apps[index]);
});

// DELETE application
app.delete('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  let apps = readApplications();
  const initialLength = apps.length;
  apps = apps.filter(a => a.id !== id);

  if (apps.length === initialLength) {
    return res.status(404).json({ error: 'Application not found' });
  }

  writeApplications(apps);
  res.json({ success: true, id });
});

// Reset demo applications
app.post('/api/applications/reset-demo', (req, res) => {
  const defaultApps = [
    {
      id: "app-1",
      title: "Senior Frontend Engineer (React/TypeScript)",
      company: "Doctolib",
      companyDomain: "doctolib.fr",
      location: "Paris (Hybride 2j)",
      remoteType: "hybride",
      contract: "CDI",
      salary: "65k - 75k €",
      linkedinUrl: "https://www.linkedin.com/jobs/view/3892019482",
      status: "tech_assessment",
      appliedDate: "2026-09-18",
      lastActivityDate: "2026-09-24",
      recruiterName: "Sophie Laurent",
      recruiterRole: "Lead Tech Recruiter",
      recruiterLinkedIn: "https://linkedin.com/in/example-sophie",
      notes: "Test technique à renvoyer avant vendredi (kata architecture composants & perfs). Entretien RH très positif sur la culture d'équipe.",
      nextStep: "Rendu du take-home test le 29/09",
      tags: ["React", "TypeScript", "HealthTech", "Top tier"]
    },
    {
      id: "app-2",
      title: "Fullstack Developer (Node.js & Next.js)",
      company: "Alan",
      companyDomain: "alan.com",
      location: "Full Remote (France)",
      remoteType: "full_remote",
      contract: "CDI",
      salary: "70k - 80k € + BSPCE",
      linkedinUrl: "https://www.linkedin.com/jobs/view/3881920192",
      status: "final_interview",
      appliedDate: "2026-09-10",
      lastActivityDate: "2026-09-25",
      recruiterName: "Julien Moreau",
      recruiterRole: "Engineering Manager",
      recruiterLinkedIn: "https://linkedin.com/in/example-julien",
      notes: "Étape finale : Culture Fit et échange avec le VP Engineering prévu mardi 30 à 15h00. Préparer retour d'expérience sur la gestion d'incidents.",
      nextStep: "Entretien Final Culture Fit le 30/09 à 15h",
      tags: ["Full Remote", "Next.js", "Assurtech", "Postgres"]
    },
    {
      id: "app-3",
      title: "Lead Développeur Web",
      company: "Qonto",
      companyDomain: "qonto.com",
      location: "Paris 9e",
      remoteType: "hybride",
      contract: "CDI",
      salary: "80k - 90k €",
      linkedinUrl: "https://www.linkedin.com/jobs/view/3874019283",
      status: "offer",
      appliedDate: "2026-08-28",
      lastActivityDate: "2026-09-26",
      recruiterName: "Camille Bernard",
      recruiterRole: "Talent Partner FinTech",
      recruiterLinkedIn: "https://linkedin.com/in/example-camille",
      notes: "Offre reçue ! 85k€ fixe + 10k€ variable + package BSPCE. Date limite de réponse fixée au 5 octobre.",
      nextStep: "Décision avant le 05/10 - Comparer avec proposition Alan",
      tags: ["Fintech", "Lead", "Scale-up", "Offre"]
    },
    {
      id: "app-4",
      title: "Software Engineer Frontend",
      company: "ManoMano",
      companyDomain: "manomano.fr",
      location: "Bordeaux / Paris",
      remoteType: "hybride",
      contract: "CDI",
      salary: "58k - 65k €",
      linkedinUrl: "https://www.linkedin.com/jobs/view/3861029481",
      status: "phone_screen",
      appliedDate: "2026-09-20",
      lastActivityDate: "2026-09-23",
      recruiterName: "Thomas Girard",
      recruiterRole: "Senior Recruiter Tech",
      recruiterLinkedIn: "https://linkedin.com/in/example-thomas",
      notes: "Premier call de qualification de 30 min passé. Présentation du rôle et questions sur les projets passés. Invitation pour le live coding.",
      nextStep: "Live coding avec 2 devs semaine prochaine",
      tags: ["E-commerce", "React", "GraphQL"]
    },
    {
      id: "app-5",
      title: "Développeur React / Node.js",
      company: "PayFit",
      companyDomain: "payfit.com",
      location: "Paris",
      remoteType: "hybride",
      contract: "CDI",
      salary: "60k - 68k €",
      linkedinUrl: "https://www.linkedin.com/jobs/view/3855019281",
      status: "reviewing",
      appliedDate: "2026-09-22",
      lastActivityDate: "2026-09-22",
      recruiterName: "Équipe Talent Acquisition",
      recruiterRole: "HR Team",
      recruiterLinkedIn: "",
      notes: "Candidature envoyée avec profil LinkedIn optimisé et lettre personnalisée. En attente de premier retour.",
      nextStep: "Relancer si pas de nouvelles d'ici le 01/10",
      tags: ["SaaS", "HRTech", "Node.js"]
    },
    {
      id: "app-6",
      title: "Senior Frontend Developer",
      company: "BlaBlaCar",
      companyDomain: "blablacar.com",
      location: "Paris",
      remoteType: "hybride",
      contract: "CDI",
      salary: "68k - 75k €",
      linkedinUrl: "https://www.linkedin.com/jobs/view/3849102948",
      status: "applied",
      appliedDate: "2026-09-25",
      lastActivityDate: "2026-09-25",
      recruiterName: "Antoine Robert",
      recruiterRole: "Talent Sourcer",
      recruiterLinkedIn: "",
      notes: "Postulé via LinkedIn Easy Apply. Notification reçue indiquant que la candidature a été vue par le recruteur.",
      nextStep: "Attente d'évaluation de profil",
      tags: ["Mobilité", "B2C", "Design System"]
    },
    {
      id: "app-7",
      title: "Ingénieur d'Études Web",
      company: "Dassault Systèmes",
      companyDomain: "3ds.com",
      location: "Vélizy-Villacoublay",
      remoteType: "sur_site",
      contract: "CDI",
      salary: "52k - 58k €",
      linkedinUrl: "https://www.linkedin.com/jobs/view/3810293849",
      status: "rejected",
      appliedDate: "2026-09-02",
      lastActivityDate: "2026-09-15",
      recruiterName: "Service Recrutement",
      recruiterRole: "RH",
      recruiterLinkedIn: "",
      notes: "Profil jugé trop axé web moderne / startup par rapport au stack legacy C++/WebGL interne.",
      nextStep: "Classé",
      tags: ["Grand groupe", "3D", "Archivé"]
    }
  ];
  writeApplications(defaultApps);
  res.json({ success: true, count: defaultApps.length });
});

// Import official LinkedIn Job Applications CSV
app.post('/api/applications/import-csv', (req, res) => {
  const { csvContent } = req.body;
  if (!csvContent || typeof csvContent !== 'string') {
    return res.status(400).json({ error: 'Contenu CSV manquant ou invalide' });
  }

  try {
    const records = parseCsv(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const existingApps = readApplications();
    const imported = [];

    for (const record of records) {
      // Standard LinkedIn export columns:
      // "Application Date", "Company Name", "Job Title", "Job Url"
      const appliedDateRaw = record['Application Date'] || record['Date'] || record['Date de candidature'] || '';
      let formattedDate = new Date().toISOString().split('T')[0];
      if (appliedDateRaw) {
        const d = new Date(appliedDateRaw);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().split('T')[0];
        }
      }

      const company = record['Company Name'] || record['Entreprise'] || record['Company'] || 'Entreprise Inconnue';
      const title = record['Job Title'] || record['Intitulé du poste'] || record['Title'] || 'Poste Spécifié';
      const linkedinUrl = record['Job Url'] || record['Url'] || record['Lien'] || '';

      // Check if already exists (by title and company)
      const isDuplicate = existingApps.some(a => 
        a.company.toLowerCase() === company.toLowerCase() && 
        a.title.toLowerCase() === title.toLowerCase()
      );

      if (!isDuplicate) {
        const newApp = {
          id: `app-import-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title,
          company,
          companyDomain: '',
          location: 'Non spécifié',
          remoteType: 'hybride',
          contract: 'CDI',
          salary: '',
          linkedinUrl,
          status: 'applied',
          appliedDate: formattedDate,
          lastActivityDate: formattedDate,
          recruiterName: '',
          recruiterRole: '',
          recruiterLinkedIn: '',
          notes: 'Importé depuis l\'archive officielle LinkedIn (Job Applications.csv)',
          nextStep: 'Vérifier l\'avancement sur LinkedIn',
          tags: ['LinkedIn Import']
        };
        imported.push(newApp);
        existingApps.unshift(newApp);
      }
    }

    writeApplications(existingApps);
    res.json({
      success: true,
      totalParsed: records.length,
      importedCount: imported.length,
      duplicatesSkipped: records.length - imported.length
    });
  } catch (err) {
    console.error('CSV Parsing error:', err);
    res.status(400).json({ error: 'Erreur lors du traitement du fichier CSV: ' + err.message });
  }
});

// Parse LinkedIn Job URL to extract info
app.post('/api/applications/extract-url', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL requise' });
  }

  // Extract job ID from linkedin url e.g. /jobs/view/12345678 or /jobs/view/senior-developer-at-google-12345678
  let jobId = null;
  const match = url.match(/\/jobs\/view\/(?:[^\/]+-)?(\d+)/i) || url.match(/currentJobId=(\d+)/i);
  if (match) {
    jobId = match[1];
  }

  // Smart heuristic based on URL slug
  let suggestedTitle = '';
  let suggestedCompany = '';
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const parts = pathname.split('/').filter(Boolean);
    const jobViewIndex = parts.findIndex(p => p === 'view');
    if (jobViewIndex !== -1 && parts[jobViewIndex + 1]) {
      const slug = decodeURIComponent(parts[jobViewIndex + 1]);
      if (slug.includes('-at-')) {
        const [titlePart, companyPart] = slug.split('-at-');
        suggestedTitle = titlePart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        suggestedCompany = companyPart.replace(/-\d+$/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }
  } catch (e) {
    // ignore
  }

  res.json({
    jobId,
    suggestedTitle: suggestedTitle || '',
    suggestedCompany: suggestedCompany || '',
    url
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CareerPulse LinkedIn Tracker API running at http://localhost:${PORT}`);
});
