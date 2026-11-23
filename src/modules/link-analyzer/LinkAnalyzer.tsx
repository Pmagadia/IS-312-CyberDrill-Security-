import React, { useState } from 'react';
import './LinkAnalyzer.css';

interface AnalysisResult {
  isSuspicious: boolean;
  warnings: string[];
  url: string;
}

export function App() {
  const [urlInput, setUrlInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  const analyzeUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) {
      setError('Please enter a website URL.');
      return;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(
        trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')
          ? trimmedUrl
          : `http://${trimmedUrl}`
      );
    } catch {
      setError('Invalid URL format. Please enter a valid web address (e.g., https://example.com).');
      return;
    }

    const warnings: string[] = [];
    const hostname = parsedUrl.hostname.toLowerCase();

    if (parsedUrl.protocol === 'http:') {
      warnings.push('Unencrypted connection (HTTP instead of HTTPS).');
    }

    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipRegex.test(hostname)) {
      warnings.push('Uses a raw IP address instead of a registered domain name.');
    }

    if (trimmedUrl.includes('@')) {
      warnings.push('Contains an "@" symbol, which can obscure the true destination domain.');
    }

    if (hostname.split('.').length > 3) {
      warnings.push('Excessive subdomains detected (common in brand spoofing).');
    }

    if (hostname.includes('xn--')) {
      warnings.push('Punycode domain detected (potential IDN homograph attack).');
    }

    const suspiciousKeywords = ['login', 'verify', 'secure', 'update', 'account', 'banking', 'signin'];
    const foundKeywords = suspiciousKeywords.filter((kw) => hostname.includes(kw));
    if (foundKeywords.length > 0 && !hostname.endsWith('.gov') && !hostname.endsWith('.edu')) {
      warnings.push(`Contains high-risk keywords in domain: ${foundKeywords.join(', ')}.`);
    }

    setResult({
      isSuspicious: warnings.length > 0,
      warnings,
      url: parsedUrl.href,
    });
  };

  return (
    <div className={`app-container ${isLightMode ? 'light-mode' : 'dark-mode'}`}>
      <header className="navbar">
        <div className="nav-left">
          <span className="brand-logo">CyberDrill</span>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setIsLightMode(!isLightMode)}
          >
            {isLightMode ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
        <nav className="nav-links">
          <a href="#incident">Incident Response Simulator</a>
          <a href="#ports">Port &amp; Protocol Match</a>
          <a href="#logs">Log Analysis Challenge</a>
          <a href="#analyzer" className="active">
            Suspicious Link Analyzer
          </a>
          <a href="#dashboard">Dashboard</a>
        </nav>
      </header>

      <main className="main-content">
        <h1 className="page-title">Suspicious Link Analyzer</h1>
        <p className="page-subtitle">
          Identify common phishing indicators and learn how to recognize suspicious website addresses.
        </p>

        <div className="analyzer-card">
          <form onSubmit={analyzeUrl}>
            <label htmlFor="url-input" className="input-label">
              Enter a website URL
            </label>
            <input
              id="url-input"
              type="text"
              className="url-input"
              placeholder="https://example.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="analyze-button">
              Analyze Link
            </button>
          </form>

          {result && (
            <div className={`result-box ${result.isSuspicious ? 'danger' : 'safe'}`}>
              <h3>
                {result.isSuspicious
                  ? `⚠️ ${result.warnings.length} Phishing Indicator(s) Found`
                  : '✅ No Common Phishing Indicators Detected'}
              </h3>
              {result.isSuspicious ? (
                <ul>
                  {result.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              ) : (
                <p>The URL structure appears standard, though you should always verify the sender.</p>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        Practice content is written by the team from the official CompTIA Security+ exam objectives.
      </footer>
    </div>
  );
}

export default App;
