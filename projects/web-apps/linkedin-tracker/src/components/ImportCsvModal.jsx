import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  HelpCircle,
  Download
} from 'lucide-react';

export default function ImportCsvModal({ isOpen, onClose, onImportSuccess }) {
  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleLoadSampleCsv = () => {
    const sample = `"Application Date","Company Name","Job Title","Job Url"
"2026-09-24","DataDog","Senior Software Engineer - Cloud","https://www.linkedin.com/jobs/view/399182741"
"2026-09-21","Mistral AI","Fullstack Platform Engineer","https://www.linkedin.com/jobs/view/399283742"
"2026-09-19","Voodoo","Lead Frontend Architect","https://www.linkedin.com/jobs/view/399384743"
"2026-09-15","Pennylane","Senior React / Typescript Developer","https://www.linkedin.com/jobs/view/399485744"
"2026-09-12","Contentsquare","Product Engineer Core Web","https://www.linkedin.com/jobs/view/399586745"`;
    setCsvText(sample);
    setFileName('Exemple_Job_Applications_LinkedIn.csv');
    setError('');
  };

  const handleProcessImport = async () => {
    if (!csvText) {
      setError('Veuillez sélectionner un fichier CSV ou charger un exemple.');
      return;
    }

    setIsProcessing(true);
    setError('');
    try {
      const res = await fetch('/api/applications/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent: csvText })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'importation');
      }

      setResult(data);
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 16
    }}>
      <div 
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 620,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'hsla(210, 95%, 54%, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-linkedin)'
            }}>
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Importer vos Candidatures LinkedIn</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Fichier officiel "Job Applications.csv" exporté depuis vos paramètres LinkedIn
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-dim)', padding: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Instructions Guide */}
        <div style={{ padding: '20px', overflowY: 'auto' }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            marginBottom: 20
          }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(210, 95%, 65%)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <HelpCircle size={15} />
              Comment obtenir votre fichier de candidatures LinkedIn ?
            </h4>
            <ol style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingLeft: 18, lineHeight: 1.6 }}>
              <li>Rendez-vous dans vos <strong>Paramètres LinkedIn</strong> &gt; <em>Confidentialité des données</em>.</li>
              <li>Cliquez sur <strong>Obtenir une copie de vos données</strong>.</li>
              <li>Cochez <strong>Candidatures (Job Applications)</strong> et confirmez.</li>
              <li>LinkedIn vous enverra un lien par e-mail avec le fichier <code>Job Applications.csv</code>.</li>
            </ol>
          </div>

          {/* Dropzone Area */}
          <div style={{
            border: '2px dashed var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '30px 20px',
            textAlign: 'center',
            background: 'var(--bg-surface)',
            position: 'relative',
            cursor: 'pointer'
          }}>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%',
                height: '100%'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'hsla(210, 95%, 54%, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-linkedin)'
              }}>
                <UploadCloud size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {fileName ? fileName : 'Cliquez pour sélectionner votre fichier Job Applications.csv'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4 }}>
                  {fileName ? 'Fichier prêt à être importé' : 'Glissez-déposez ou parcourez votre ordinateur'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick sample button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <button
              type="button"
              onClick={handleLoadSampleCsv}
              style={{
                fontSize: '0.78rem',
                color: 'var(--accent-linkedin)',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 8px'
              }}
            >
              <Download size={13} />
              <span>Tester immédiatement avec un fichier exemple LinkedIn</span>
            </button>
          </div>

          {/* Feedback & Result */}
          {error && (
            <div style={{
              marginTop: 16,
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'hsla(352, 80%, 62%, 0.15)',
              border: '1px solid hsla(352, 80%, 62%, 0.3)',
              color: 'hsl(352, 80%, 75%)',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div style={{
              marginTop: 16,
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'hsla(154, 75%, 48%, 0.15)',
              border: '1px solid hsla(154, 75%, 48%, 0.3)',
              color: 'hsl(154, 75%, 75%)',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <CheckCircle2 size={16} />
              <span>
                Succès : <strong>{result.importedCount}</strong> nouvelle(s) candidature(s) importée(s) !
                {result.duplicatesSkipped > 0 && ` (${result.duplicatesSkipped} doublons ignorés)`}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 10,
          background: 'var(--bg-surface)'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '0.85rem'
            }}
          >
            Fermer
          </button>
          <button
            type="button"
            onClick={handleProcessImport}
            disabled={isProcessing || !csvText}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-linkedin)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: '0 2px 10px hsla(210, 95%, 54%, 0.35)',
              opacity: !csvText ? 0.6 : 1
            }}
          >
            {isProcessing ? 'Import en cours...' : 'Lancer l\'importation'}
          </button>
        </div>
      </div>
    </div>
  );
}
