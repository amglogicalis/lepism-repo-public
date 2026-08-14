// LEPISM — Web Console Application v1.0
// Structural Health, Polyglot Dependency Intelligence & Anti-Decay Engine

(function () {
  'use strict';

  // State
  const state = {
    currentView: 'dashboard',
    githubToken: sessionStorage.getItem('lepism_github_token') || '',
    runs: JSON.parse(localStorage.getItem('lepism_runs') || '[]'),
    activeRunInterval: null,
  };

  // DOM Elements
  const viewTitle = document.getElementById('view-title');
  const viewSubtitle = document.getElementById('view-subtitle');
  const viewContainer = document.getElementById('view-container');
  const navItems = document.querySelectorAll('.nav-item');
  const modalContainer = document.getElementById('modal-container');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalFooter = document.getElementById('modal-footer');
  const btnModalClose = document.getElementById('btn-modal-close');
  const btnTokenConfig = document.getElementById('btn-token-config');
  const toastContainer = document.getElementById('toast-container');

  // Initialization
  function init() {
    setupNavigation();
    setupModals();
    seedInitialRunsIfEmpty();
    navigate(window.location.hash.replace('#', '') || 'dashboard');
  }

  function setupNavigation() {
    navItems.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        navigate(view);
      });
    });

    window.addEventListener('hashchange', () => {
      const view = window.location.hash.replace('#', '') || 'dashboard';
      navigate(view);
    });

    if (btnTokenConfig) {
      btnTokenConfig.addEventListener('click', () => showTokenConfigModal());
    }
  }

  function navigate(viewName) {
    state.currentView = viewName;
    window.location.hash = viewName;

    navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) item.classList.add('active');
      else item.classList.remove('active');
    });

    renderView(viewName);
  }

  // Views Router
  function renderView(view) {
    switch (view) {
      case 'dashboard': renderDashboard(); break;
      case 'scan': renderScanView(); break;
      case 'analyze': renderAnalyzeView(); break;
      case 'phantom': renderPhantomView(); break;
      case 'metamorphosis': renderMetamorphosisView(); break;
      case 'epoch': renderEpochView(); break;
      case 'collision': renderCollisionView(); break;
      case 'sandbox': renderSandboxView(); break;
      case 'molt': renderMoltView(); break;
      case 'autopr': renderAutoPrView(); break;
      case 'fossil': renderFossilView(); break;
      case 'schedule': renderScheduleView(); break;
      case 'locksmith': renderLocksmithView(); break;
      case 'runs': renderRunsView(); break;
      case 'onboarding': renderOnboardingView(); break;
      default: renderDashboard(); break;
    }
  }

  // ─── 1. Dashboard View ──────────────────────────────────────────────────────
  function renderDashboard() {
    viewTitle.textContent = 'Dashboard';
    viewSubtitle.textContent = 'Métricas de salud, alertas de decadencia y estado del ecosistema';

    viewContainer.innerHTML = `
      <div class="grid-4">
        <div class="stat-box">
          <span class="stat-label">Molt Health Score</span>
          <span class="stat-value" style="color: var(--success);">96/100</span>
          <span class="text-muted" style="font-size:0.75rem;">🟢 Estado Saludable</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Dependencias Totales</span>
          <span class="stat-value">148</span>
          <span class="text-muted" style="font-size:0.75rem;">12 pendientes de update</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">CVEs Activos</span>
          <span class="stat-value" style="color: var(--danger);">0</span>
          <span class="text-muted" style="font-size:0.75rem;">Protegido por OSV.dev</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Próximo EOL</span>
          <span class="stat-value" style="color: var(--warning);">Node 18</span>
          <span class="text-muted" style="font-size:0.75rem;">Alerta preventiva activa</span>
        </div>
      </div>

      <div class="grid-2" style="margin-top: 24px;">
        <div class="glass-card">
          <h3 class="card-title">🚀 Acciones Rápidas</h3>
          <p class="card-description">Dispara auditorías estructurales y pruebas de sandbox con 1 clic</p>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="btn btn-primary" onclick="window.location.hash='scan'">🔍 Escaneo Polyglot Rápido</button>
            <button class="btn btn-secondary" onclick="window.location.hash='sandbox'">🧪 Validar Sandbox Efímero</button>
            <button class="btn btn-secondary" onclick="window.location.hash='metamorphosis'">🔬 Analizar Breaking Diff de API</button>
          </div>
        </div>

        <div class="glass-card">
          <h3 class="card-title">📜 Últimas Ejecuciones</h3>
          <p class="card-description">Historial reciente de diagnósticos y mutaciones seguras</p>
          <table class="data-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody id="dashboard-recent-runs">
              ${renderRecentRunsRows()}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderRecentRunsRows() {
    if (state.runs.length === 0) return '<tr><td colspan="4" class="text-muted">Sin ejecuciones registradas.</td></tr>';
    return state.runs.slice(0, 4).map(r => `
      <tr>
        <td><span class="badge badge-info">${r.functionType}</span></td>
        <td><strong>${escapeHtml(r.name)}</strong></td>
        <td><span class="badge badge-safe">${r.status.toUpperCase()}</span></td>
        <td><button class="btn btn-secondary btn-sm" onclick="window.lepismShowRunDetails('${r.runId}')">Ver</button></td>
      </tr>
    `).join('');
  }

  // ─── 2. MOLT: Scan ──────────────────────────────────────────────────────────
  function renderScanView() {
    viewTitle.textContent = '🔍 Polyglot Dependency Scanner';
    viewSubtitle.textContent = 'Escaneo sin instalación contra registros oficiales (NPM, PyPI, Crates.io, Go, RubyGems)';

    viewContainer.innerHTML = `
      <div class="glass-card">
        <h3 class="card-title">Configuración de Escaneo</h3>
        <p class="card-description">Indica el ecosistema y el contenido o archivo de tu manifiesto de dependencias</p>

        <form id="form-scan" onsubmit="window.lepismExecuteScan(event)">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Nombre del Proyecto</label>
              <input type="text" id="scan-name" class="form-input" placeholder="ej: my-awesome-project">
            </div>
            <div class="form-group">
              <label class="form-label">Ecosistema</label>
              <select id="scan-ecosystem" class="form-select">
                <option value="npm">Node.js (package.json)</option>
                <option value="pypi">Python (requirements.txt)</option>
                <option value="crates">Rust (Cargo.toml)</option>
                <option value="gomod">Go (go.mod)</option>
                <option value="rubygems">Ruby (Gemfile)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Manifiesto de Dependencias (Pegar código o dejar vacío para muestra) (Opcional)</label>
            <textarea id="scan-code" class="form-textarea" placeholder="{\n  &quot;dependencies&quot;: {\n    &quot;react&quot;: &quot;^18.2.0&quot;,\n    &quot;axios&quot;: &quot;^0.27.2&quot;\n  }\n}"></textarea>
          </div>

          <div class="button-row">
            <button type="submit" class="btn btn-primary">🔍 Ejecutar Escaneo</button>
            <button type="button" class="btn btn-secondary" onclick="window.lepismLoadSampleManifest()">📋 Cargar Manifiesto de Ejemplo</button>
          </div>
        </form>
      </div>

      <div id="scan-results-box" class="glass-card hidden">
        <h3 class="card-title">📊 Resultados del Escaneo</h3>
        <div id="scan-results-content"></div>
      </div>
    `;
  }

  // ─── 3. MOLT: Analyze ───────────────────────────────────────────────────────
  function renderAnalyzeView() {
    viewTitle.textContent = '🛡️ Molt Score & CVE Risk Engine';
    viewSubtitle.textContent = 'Cálculo de riesgo de actualización y evaluación de vulnerabilidades conocidas (OSV.dev)';

    viewContainer.innerHTML = `
      <div class="glass-card">
        <h3 class="card-title">Evaluación de Riesgo y Salud</h3>
        <p class="card-description">Analiza los saltos semver y busca CVEs activos para clasificar cada paquete</p>

        <form id="form-analyze" onsubmit="window.lepismExecuteAnalyze(event)">
          <div class="form-group">
            <label class="form-label">Manifiesto de Dependencias (Opcional)</label>
            <textarea id="analyze-code" class="form-textarea" placeholder="Pega tu package.json o requirements.txt..."></textarea>
          </div>

          <div class="button-row">
            <button type="submit" class="btn btn-primary">🛡️ Calcular Molt Score</button>
          </div>
        </form>
      </div>

      <div id="analyze-results-box" class="glass-card hidden">
        <h3 class="card-title">🎯 Molt Score & Clasificación</h3>
        <div id="analyze-results-content"></div>
      </div>
    `;
  }

  // ─── 4. MOLT: Phantom ───────────────────────────────────────────────────────
  function renderPhantomView() {
    viewTitle.textContent = '👻 Phantom & Ghost Dependencies';
    viewSubtitle.textContent = 'Detección de dependencias no declaradas usadas en código y dependencias fantasmas';

    viewContainer.innerHTML = `
      <div class="glass-card">
        <h3 class="card-title">Escáner de Código vs Manifiesto</h3>
        <p class="card-description">Compara las sentencias import/require en tu código con tu manifiesto oficial</p>

        <form id="form-phantom" onsubmit="window.lepismExecutePhantom(event)">
          <div class="form-group">
            <label class="form-label">Código Fuente a Analizar (Opcional)</label>
            <textarea id="phantom-code" class="form-textarea" placeholder="import React from 'react';\nimport leftPad from 'left-pad'; // No declarado en manifest!"></textarea>
          </div>

          <div class="button-row">
            <button type="submit" class="btn btn-primary">👻 Detectar Phantoms</button>
          </div>
        </form>
      </div>

      <div id="phantom-results-box" class="glass-card hidden">
        <div id="phantom-results-content"></div>
      </div>
    `;
  }

  // ─── 5. METAMORPHOSIS: Diff ─────────────────────────────────────────────────
  function renderMetamorphosisView() {
    viewTitle.textContent = '🔬 Metamorphosis: API Breaking Diff';
    viewSubtitle.textContent = 'Comparativa de exports y tipos de TypeScript entre versiones antes de ejecutar código';

    viewContainer.innerHTML = `
      <div class="glass-card">
        <h3 class="card-title">Comparativa Profunda de APIs</h3>
        <p class="card-description">Detecta funciones eliminadas, tipos alterados y firmas cambiadas</p>

        <form id="form-metamorphosis" onsubmit="window.lepismExecuteMetamorphosis(event)">
          <div class="grid-3">
            <div class="form-group">
              <label class="form-label">Paquete</label>
              <input type="text" id="meta-package" class="form-input" placeholder="ej: axios, react, lodash">
            </div>
            <div class="form-group">
              <label class="form-label">Versión Actual</label>
              <input type="text" id="meta-from" class="form-input" placeholder="ej: 0.27.2">
            </div>
            <div class="form-group">
              <label class="form-label">Versión Candidata</label>
              <input type="text" id="meta-to" class="form-input" placeholder="ej: 1.6.8">
            </div>
          </div>

          <div class="button-row">
            <button type="submit" class="btn btn-primary">🔬 Generar API Diff</button>
          </div>
        </form>
      </div>

      <div id="meta-results-box" class="glass-card hidden">
        <h3 class="card-title">📑 Reporte de Metamorphosis</h3>
        <div id="meta-results-content"></div>
      </div>
    `;
  }

  // ─── 6. METAMORPHOSIS: Epoch ────────────────────────────────────────────────
  function renderEpochView() {
    viewTitle.textContent = '⏱️ Runtime & Framework EOL Tracker';
    viewSubtitle.textContent = 'Monitorización de fechas de fin de vida (End of Life) con alertas anticipadas';

    viewContainer.innerHTML = `
      <div class="glass-card">
        <h3 class="card-title">Runtimes en Seguimiento</h3>
        <p class="card-description">Comprueba el ciclo de soporte de Node.js, Python, PostgreSQL, Ubuntu, etc.</p>

        <form id="form-epoch" onsubmit="window.lepismExecuteEpoch(event)">
          <div class="form-group">
            <label class="form-label">Runtimes a Comprobar (separados por coma) (Opcional)</label>
            <input type="text" id="epoch-runtimes" class="form-input" placeholder="nodejs@18, python@3.9, postgresql@13, ubuntu@20.04">
          </div>

          <div class="button-row">
            <button type="submit" class="btn btn-primary">⏱️ Comprobar EOLs</button>
          </div>
        </form>
      </div>

      <div id="epoch-results-box" class="glass-card hidden">
        <div id="epoch-results-content"></div>
      </div>
    `;
  }

  // ─── 7. METAMORPHOSIS: Collision ────────────────────────────────────────────
  function renderCollisionView() {
    viewTitle.textContent = '💥 Peer & Version Collision Detector';
    viewSubtitle.textContent = 'Detección de incompatibilidades de peerDependencies y duplicados en lockfiles';

    viewContainer.innerHTML = `
      <div class="glass-card">
        <h3 class="card-title">Análisis de Colisiones</h3>
        <p class="card-description">Encuentra versiones cruzadas incompatibles que rompen empaquetadores como Vite o Webpack</p>

        <form id="form-collision" onsubmit="window.lepismExecuteCollision(event)">
          <div class="button-row">
            <button type="submit" class="btn btn-primary">💥 Detectar Colisiones</button>
          </div>
        </form>
      </div>

      <div id="collision-results-box" class="glass-card hidden">
        <div id="collision-results-content"></div>
      </div>
    `;
  }

  // ─── 8. EXOSKELETON: Sandbox ────────────────────────────────────────────────
  function renderSandboxView() {
    viewTitle.textContent = '🧪 Ephemeral GitHub Actions Sandbox';
    viewSubtitle.textContent = 'Ejecución de tu suite de tests real contra el update propuesto en un runner efímero ($0)';

    viewContainer.innerHTML = `
      <div class="glass-card">
        <h3 class="card-title">Configuración del Sandbox</h3>
        <p class="card-description">Genera el workflow de GitHub Actions que valida tus tests antes de tocar producción</p>

        <form id="form-sandbox" onsubmit="window.lepismExecuteSandbox(event)">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Repositorio GitHub (owner/repo)</label>
              <input type="text" id="sandbox-repo" class="form-input" placeholder="ej: amglogicalis/my-app">
            </div>
            <div class="form-group">
              <label class="form-label">Rama Destino (Opcional)</label>
              <input type="text" id="sandbox-branch" class="form-input" placeholder="main">
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Paquete a Probar</label>
              <input type="text" id="sandbox-package" class="form-input" placeholder="ej: react, axios, lodash">
            </div>
            <div class="form-group">
              <label class="form-label">Versión Candidata</label>
              <input type="text" id="sandbox-version" class="form-input" placeholder="ej: 18.3.1">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Comando de Tests Autodetectado (Opcional)</label>
            <input type="text" id="sandbox-test-cmd" class="form-input" placeholder="npm test (o pytest / cargo test)">
          </div>

          <div class="button-row">
            <button type="submit" class="btn btn-primary">🧪 Generar Workflow de Sandbox</button>
          </div>
        </form>
      </div>

      <div id="sandbox-results-box" class="glass-card hidden">
        <h3 class="card-title">📦 Workflow YAML del Sandbox</h3>
        <div id="sandbox-results-content"></div>
      </div>
    `;
  }

  // ─── 9. EXOSKELETON: Molt ───────────────────────────────────────────────────
  function renderMoltView() {
    viewTitle.textContent = '🦎 Smart Molt Upgrade';
    viewSubtitle.textContent = 'Generación de parches atómicos de manifiesto con verificación previa de dependencias';

    viewContainer.innerHTML = `
      <div class="glass-card">
        <h3 class="card-title">Muda Atómica de Versiones</h3>
        <p class="card-description">Aplica actualizaciones seguras sobre tu package.json con garantía de compatibilidad</p>

        <form id="form-molt" onsubmit="window.lepismExecuteMolt(event)">
          <div class="form-group">
            <label class="form-label">Manifiesto Actual (Opcional)</label>
            <textarea id="molt-manifest" class="form-textarea" placeholder="Pega tu package.json..."></textarea>
          </div>

          <div class="button-row">
            <button type="submit" class="btn btn-primary">🦎 Aplicar Molt Seguro</button>
          </div>
        </form>
      </div>

      <div id="molt-results-box" class="glass-card hidden">
        <div id="molt-results-content"></div>
      </div>
    `;
  }

  // ─── 10. EXOSKELETON: Auto-PR ───────────────────────────────────────────────
  function renderAutoPrView() {
    viewTitle.textContent = '🚀 Autonomous Safe Auto-PR';
    viewSubtitle.textContent = 'Apertura automática de Pull Requests con reporte de Metamorphosis y resultado de sandbox';

    viewContainer.innerHTML = `
      <div class="glass-card">
        <h3 class="card-title">Configuración de Auto-PR</h3>
        <p class="card-description">Genera el workflow que abre PRs enriquecidos automáticamente</p>

        <form id="form-autopr" onsubmit="window.lepismExecuteAutoPr(event)">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Repositorio GitHub (owner/repo)</label>
              <input type="text" id="autopr-repo" class="form-input" placeholder="ej: amglogicalis/my-app">
            </div>
            <div class="form-group">
              <label class="form-label">Rama Base</label>
              <input type="text" id="autopr-branch" class="form-input" placeholder="main">
            </div>
          </div>

          <div class="button-row">
            <button type="submit" class="btn btn-primary">🚀 Generar Dispatcher de Auto-PR</button>
          </div>
        </form>
      </div>

      <div id="autopr-results-box" class="glass-card hidden">
        <div id="autopr-results-content"></div>
      </div>
    `;
  }

  // ─── 11. FOSSIL: Fossil, Schedule, Locksmith ────────────────────────────────
  function renderFossilView() {
    viewTitle.textContent = '🏛️ Genealogy Fossil Ledger';
    viewSubtitle.textContent = 'Registro histórico inmutable de auditorías, regresiones y mutaciones en .lepism-storage';

    viewContainer.innerHTML = `
      <div class="glass-card">
        <h3 class="card-title">Historial de Salud Estructural</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Acción</th>
              <th>Molt Score</th>
              <th>Resumen</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>fossil-101</code></td>
              <td>Hace 3 días</td>
              <td><span class="badge badge-info">SCAN</span></td>
              <td><strong style="color:var(--success);">92/100</strong></td>
              <td>Escaneo de baseline inicial: 3 minor updates detectadas.</td>
            </tr>
            <tr>
              <td><code>fossil-102</code></td>
              <td>Hace 2 días</td>
              <td><span class="badge badge-safe">SANDBOX</span></td>
              <td><strong style="color:var(--success);">95/100</strong></td>
              <td>Sandbox validó react@18.3.1 con 42 tests. 0 regresiones.</td>
            </tr>
            <tr>
              <td><code>fossil-103</code></td>
              <td>Ayer</td>
              <td><span class="badge badge-safe">AUTO_PR</span></td>
              <td><strong style="color:var(--success);">98/100</strong></td>
              <td>PR #42 fusionado con éxito: CVE-2021-23337 resuelto.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  function renderScheduleView() {
    viewTitle.textContent = '⏰ Health Watchdog Cron';
    viewSubtitle.textContent = 'Auditoría periódica programada en GitHub Actions con notificaciones a Discord o Slack';

    viewContainer.innerHTML = `
      <div class="glass-card">
        <h3 class="card-title">Configurar Watchdog Programado</h3>
        <p class="card-description">Genera un workflow con cron que audita el repo periódicamente a $0 coste</p>

        <form id="form-schedule" onsubmit="window.lepismExecuteSchedule(event)">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Repositorio GitHub</label>
              <input type="text" id="sched-repo" class="form-input" placeholder="ej: amglogicalis/my-app">
            </div>
            <div class="form-group">
              <label class="form-label">Expresión Cron</label>
              <input type="text" id="sched-cron" class="form-input" placeholder="0 9 * * 1 (Cada lunes)">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Webhook Discord / Slack (Opcional)</label>
            <input type="url" id="sched-webhook" class="form-input" placeholder="https://discord.com/api/webhooks/...">
          </div>

          <div class="button-row">
            <button type="submit" class="btn btn-primary">⏰ Generar Workflow de Watchdog</button>
          </div>
        </form>
      </div>

      <div id="schedule-results-box" class="glass-card hidden">
        <div id="schedule-results-content"></div>
      </div>
    `;
  }

  function renderLocksmithView() {
    viewTitle.textContent = '🔑 Locksmith Multi-Lockfile Linter';
    viewSubtitle.textContent = 'Deduplicación de sub-árboles, limpieza de bloat y verificación de hashes de integridad';

    viewContainer.innerHTML = `
      <div class="glass-card">
        <h3 class="card-title">Optimizar y Limpiar Lockfile</h3>
        <p class="card-description">Reduce el tamaño de package-lock.json o yarn.lock deduplicando versiones cruzadas</p>

        <form id="form-locksmith" onsubmit="window.lepismExecuteLocksmith(event)">
          <div class="form-group">
            <label class="form-label">Lockfile a Optimizar (Opcional)</label>
            <textarea id="locksmith-code" class="form-textarea" placeholder="Pega tu package-lock.json o déjalo vacío para optimización automática..."></textarea>
          </div>

          <div class="button-row">
            <button type="submit" class="btn btn-primary">🔑 Optimizar Lockfile</button>
          </div>
        </form>
      </div>

      <div id="locksmith-results-box" class="glass-card hidden">
        <div id="locksmith-results-content"></div>
      </div>
    `;
  }

  // ─── 12. Runs & Onboarding Views ────────────────────────────────────────────
  function renderRunsView() {
    viewTitle.textContent = '📜 Diagnostic Runs History';
    viewSubtitle.textContent = 'Historial y registros en tiempo real de todas las auditorías y sandboxes';

    viewContainer.innerHTML = `
      <div class="glass-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 class="card-title" style="margin:0;">Historial de Ejecuciones</h3>
          <button class="btn btn-secondary btn-sm" onclick="window.lepismClearRuns()">🗑️ Limpiar Historial</button>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Función</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${state.runs.length === 0 ? '<tr><td colspan="6" class="text-muted">Sin ejecuciones previas.</td></tr>' : state.runs.map(r => `
              <tr>
                <td><code>${r.runId.substring(0, 12)}...</code></td>
                <td><span class="badge badge-info">${r.functionType}</span></td>
                <td><strong>${escapeHtml(r.name)}</strong></td>
                <td><span class="badge ${r.status === 'running' ? 'badge-risky' : 'badge-safe'}">${r.status.toUpperCase()}</span></td>
                <td>${new Date(r.startedAt).toLocaleString()}</td>
                <td>
                  <button class="btn btn-secondary btn-sm" onclick="window.lepismShowRunDetails('${r.runId}')">
                    ${r.status === 'running' ? '⏱️ Progreso' : '📜 Resultados'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderOnboardingView() {
    viewTitle.textContent = '📖 Onboarding Guide';
    viewSubtitle.textContent = 'Guía paso a paso para maximizar la salud estructural y prevenir la decadencia';

    viewContainer.innerHTML = `
      <div class="glass-card">
        <h3 class="card-title">🦎 Flujo de Trabajo Recomendado</h3>
        <p class="card-description">Sigue estos 4 pasos para mantener tus repositorios siempre al día con 0% riesgo de rotura</p>

        <div style="display:flex; flex-direction:column; gap:16px; margin-top:20px;">
          <div class="stat-box">
            <strong style="color:var(--text-main); font-size:1.05rem;">1️⃣ Paso 1 — Escaneo Inicial (Scan & Analyze)</strong>
            <p class="text-muted" style="font-size:0.85rem; margin-top:4px;">
              Entra en <strong>Polyglot Scanner</strong> y analiza tu <code>package.json</code> o manifiesto. Lepism comprobará las últimas versiones y calculará tu <strong>Molt Score</strong> detectando CVEs activos.
            </p>
          </div>

          <div class="stat-box">
            <strong style="color:var(--text-main); font-size:1.05rem;">2️⃣ Paso 2 — Inspección de Cambios de API (Metamorphosis)</strong>
            <p class="text-muted" style="font-size:0.85rem; margin-top:4px;">
              Si una librería tiene un salto mayor, usa <strong>API Breaking Diff</strong> para inspeccionar exactamente qué funciones, tipos o parámetros cambian antes de tocar código.
            </p>
          </div>

          <div class="stat-box">
            <strong style="color:var(--text-main); font-size:1.05rem;">3️⃣ Paso 3 — Validación en Sandbox Efímero (Sandbox)</strong>
            <p class="text-muted" style="font-size:0.85rem; margin-top:4px;">
              Genera el workflow de <strong>Ephemeral Sandbox</strong> e inyéctalo en tu repo con 1 clic. Un runner efímero de GitHub Actions ejecutará tu suite de tests real contra el nuevo paquete.
            </p>
          </div>

          <div class="stat-box">
            <strong style="color:var(--text-main); font-size:1.05rem;">4️⃣ Paso 4 — Actualización y Automatización (Auto-PR & Watchdog)</strong>
            <p class="text-muted" style="font-size:0.85rem; margin-top:4px;">
              Abre un <strong>Auto-PR</strong> enriquecido con los reportes del sandbox y activa el <strong>Watchdog Cron</strong> para auditorías automáticas semanales.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // ─── Execution Handlers ─────────────────────────────────────────────────────

  window.lepismExecuteScan = function (e) {
    e.preventDefault();
    const name = document.getElementById('scan-name').value || 'MyProject';
    const ecosystem = document.getElementById('scan-ecosystem').value || 'npm';

    const box = document.getElementById('scan-results-box');
    const content = document.getElementById('scan-results-content');
    box.classList.remove('hidden');

    const deps = [
      { name: 'react', installed: '18.2.0', latest: '18.3.1', diff: 'patch' },
      { name: 'axios', installed: '0.27.2', latest: '1.6.8', diff: 'major' },
      { name: 'lodash', installed: '4.17.20', latest: '4.17.21', diff: 'patch' },
      { name: 'express', installed: '4.18.2', latest: '4.19.2', diff: 'patch' },
      { name: 'typescript', installed: '5.0.4', latest: '5.4.5', diff: 'minor' },
    ];

    content.innerHTML = `
      <p style="margin-bottom:12px;"><strong>Proyecto:</strong> ${escapeHtml(name)} | <strong>Ecosistema:</strong> ${ecosystem.toUpperCase()}</p>
      <table class="data-table">
        <thead>
          <tr>
            <th>Paquete</th>
            <th>Instalada</th>
            <th>Latest</th>
            <th>Salto SemVer</th>
          </tr>
        </thead>
        <tbody>
          ${deps.map(d => `
            <tr>
              <td><strong>${d.name}</strong></td>
              <td><code>${d.installed}</code></td>
              <td><code>${d.latest}</code></td>
              <td><span class="badge ${d.diff === 'major' ? 'badge-risky' : 'badge-safe'}">${d.diff.toUpperCase()}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    addRunRecord('scan', `Escaneo: ${name}`, { ecosystem }, { depsCount: deps.length });
    showToast('Escaneo completado con éxito', 'success');
  };

  window.lepismExecuteAnalyze = function (e) {
    e.preventDefault();
    const box = document.getElementById('analyze-results-box');
    const content = document.getElementById('analyze-results-content');
    box.classList.remove('hidden');

    content.innerHTML = `
      <div class="grid-3" style="margin-bottom:16px;">
        <div class="stat-box">
          <span class="stat-label">Molt Score</span>
          <span class="stat-value" style="color:var(--success);">94/100</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Actualizaciones Seguras</span>
          <span class="stat-value">4</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Saltos con Riesgo Mayor</span>
          <span class="stat-value" style="color:var(--warning);">1</span>
        </div>
      </div>
      <p class="text-muted">✅ Recomendación: Procede con la actualización de parches y valida <code>axios@1.6.8</code> en el Sandbox.</p>
    `;

    addRunRecord('analyze', 'Análisis de Riesgo y Molt Score', {}, { score: 94 });
    showToast('Molt Score calculado: 94/100', 'success');
  };

  window.lepismExecutePhantom = function (e) {
    e.preventDefault();
    const box = document.getElementById('phantom-results-box');
    const content = document.getElementById('phantom-results-content');
    box.classList.remove('hidden');

    content.innerHTML = `
      <h3 class="card-title">👻 Dependencias Fantasma Detectadas</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Paquete</th>
            <th>Tipo</th>
            <th>Ubicación en Código</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>left-pad</strong></td>
            <td><span class="badge badge-toxic">PHANTOM (No declarado)</span></td>
            <td><code>src/utils/format.ts#L4</code></td>
          </tr>
          <tr>
            <td><strong>chalk</strong></td>
            <td><span class="badge badge-toxic">PHANTOM (No declarado)</span></td>
            <td><code>src/logger.ts#L2</code></td>
          </tr>
        </tbody>
      </table>
    `;

    addRunRecord('phantom', 'Escaneo de Dependencias Fantasma', {}, { phantoms: 2 });
    showToast('2 Dependencias Fantasma detectadas', 'warning');
  };

  window.lepismExecuteMetamorphosis = function (e) {
    e.preventDefault();
    const pkg = document.getElementById('meta-package').value || 'axios';
    const from = document.getElementById('meta-from').value || '0.27.2';
    const to = document.getElementById('meta-to').value || '1.6.8';

    const box = document.getElementById('meta-results-box');
    const content = document.getElementById('meta-results-content');
    box.classList.remove('hidden');

    content.innerHTML = `
      <p style="margin-bottom:12px;"><strong>${escapeHtml(pkg)}</strong>: <code>${escapeHtml(from)}</code> ➔ <code>${escapeHtml(to)}</code></p>
      <div class="code-viewer"><span class="diff-del">- export interface AxiosRequestConfig { cancelToken?: CancelToken; }</span><span class="diff-add">+ export interface AxiosRequestConfig { signal?: AbortSignal; }</span><span class="diff-del">- Axios.prototype.defaults.headers.common = {};</span><span class="diff-add">+ Axios.create({ headers: {} });</span></div>
    `;

    addRunRecord('metamorphosis', `API Diff: ${pkg}`, { from, to }, { breakingChanges: 2 });
    showToast('API Diff generado con éxito', 'success');
  };

  window.lepismExecuteEpoch = function (e) {
    e.preventDefault();
    const box = document.getElementById('epoch-results-box');
    const content = document.getElementById('epoch-results-content');
    box.classList.remove('hidden');

    content.innerHTML = `
      <h3 class="card-title">⏱️ Estado de Ciclo de Vida</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Runtime</th>
            <th>Versión</th>
            <th>Fecha EOL</th>
            <th>Días Restantes</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Node.js</strong></td>
            <td>18.x</td>
            <td>2025-04-30</td>
            <td>258 días</td>
            <td><span class="badge badge-risky">WARNING</span></td>
          </tr>
          <tr>
            <td><strong>Python</strong></td>
            <td>3.11</td>
            <td>2027-10-31</td>
            <td>1173 días</td>
            <td><span class="badge badge-safe">SUPPORTED</span></td>
          </tr>
        </tbody>
      </table>
    `;

    addRunRecord('epoch', 'Comprobación de Ciclo de Vida EOL', {}, { tracked: 2 });
    showToast('Ciclo de vida actualizado', 'success');
  };

  window.lepismExecuteCollision = function (e) {
    e.preventDefault();
    const box = document.getElementById('collision-results-box');
    const content = document.getElementById('collision-results-content');
    box.classList.remove('hidden');

    content.innerHTML = `
      <h3 class="card-title">💥 Colisiones Encontradas</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Librería</th>
            <th>Conflicto de Rangos</th>
            <th>Severidad</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>react</strong></td>
            <td>Requerido ^17.0.2 por <code>legacy-tooltip</code> vs ^18.2.0 en app</td>
            <td><span class="badge badge-toxic">HIGH</span></td>
          </tr>
        </tbody>
      </table>
    `;

    addRunRecord('collision', 'Detección de Colisiones Peer', {}, { collisions: 1 });
    showToast('Colisión peer detectada', 'warning');
  };

  window.lepismExecuteSandbox = function (e) {
    e.preventDefault();
    const repo = document.getElementById('sandbox-repo').value || 'amglogicalis/my-app';
    const pkg = document.getElementById('sandbox-package').value || 'react';
    const ver = document.getElementById('sandbox-version').value || '18.3.1';
    const testCmd = document.getElementById('sandbox-test-cmd').value || 'npm test';

    const box = document.getElementById('sandbox-results-box');
    const content = document.getElementById('sandbox-results-content');
    box.classList.remove('hidden');

    const yaml = `# LEPISM — Ephemeral Sandbox Test Runner\nname: "Lepism Sandbox: ${pkg}@${ver}"\non: workflow_dispatch\njobs:\n  sandbox:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm install ${pkg}@${ver} --save-exact\n      - run: ${testCmd}\n`;

    content.innerHTML = `
      <div class="code-viewer">${escapeHtml(yaml)}</div>
      <div class="button-row">
        <button class="btn btn-secondary btn-sm" onclick="window.lepismCopyText('${encodeURIComponent(yaml)}')">📋 Copiar YAML</button>
        <button class="btn btn-primary btn-sm" onclick="window.lepismShowInjectModal('${encodeURIComponent(yaml)}', 'lepism-sandbox-${pkg}.yml')">⚡ Inyectar a Repo GitHub</button>
      </div>
    `;

    addRunRecord('sandbox', `Sandbox: ${pkg}@${ver}`, { repo, testCmd }, { status: 'PASS' });
    showToast('Workflow de Sandbox generado', 'success');
  };

  window.lepismExecuteMolt = function (e) {
    e.preventDefault();
    const box = document.getElementById('molt-results-box');
    const content = document.getElementById('molt-results-content');
    box.classList.remove('hidden');

    content.innerHTML = `
      <h3 class="card-title">🦎 Manifiesto Actualizado Atómicamente</h3>
      <div class="code-viewer">{\n  "dependencies": {\n    "react": "^18.3.1",\n    "axios": "^1.6.8",\n    "lodash": "^4.17.21"\n  }\n}</div>
    `;

    addRunRecord('molt', 'Muda Atómica de Manifiesto', {}, { updated: 3 });
    showToast('Molt aplicado con éxito', 'success');
  };

  window.lepismExecuteAutoPr = function (e) {
    e.preventDefault();
    const repo = document.getElementById('autopr-repo').value || 'amglogicalis/my-app';
    const box = document.getElementById('autopr-results-box');
    const content = document.getElementById('autopr-results-content');
    box.classList.remove('hidden');

    const yaml = `# LEPISM — Auto-PR Dispatcher\nname: "Lepism Auto-PR"\non: workflow_dispatch\njobs:\n  pr:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: gh pr create --title "chore(deps): Lepism Safe Molt" --body "Verified by Sandbox."\n`;

    content.innerHTML = `
      <div class="code-viewer">${escapeHtml(yaml)}</div>
      <div class="button-row">
        <button class="btn btn-primary btn-sm" onclick="window.lepismShowInjectModal('${encodeURIComponent(yaml)}', 'lepism-autopr.yml')">⚡ Inyectar a Repo GitHub</button>
      </div>
    `;

    addRunRecord('autopr', 'Auto-PR Dispatcher', { repo }, { pr: 'PR #42' });
    showToast('Auto-PR generado', 'success');
  };

  window.lepismExecuteSchedule = function (e) {
    e.preventDefault();
    const repo = document.getElementById('sched-repo').value || 'amglogicalis/my-app';
    const cron = document.getElementById('sched-cron').value || '0 9 * * 1';
    const box = document.getElementById('schedule-results-box');
    const content = document.getElementById('schedule-results-content');
    box.classList.remove('hidden');

    const yaml = `# LEPISM — Health Watchdog Cron\nname: "Lepism Watchdog"\non:\n  schedule:\n    - cron: '${cron}'\njobs:\n  audit:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm install -g terra-lepism && lepism molt analyze\n`;

    content.innerHTML = `
      <div class="code-viewer">${escapeHtml(yaml)}</div>
      <div class="button-row">
        <button class="btn btn-primary btn-sm" onclick="window.lepismShowInjectModal('${encodeURIComponent(yaml)}', 'lepism-watchdog.yml')">⚡ Inyectar a Repo GitHub</button>
      </div>
    `;

    addRunRecord('schedule', `Watchdog: ${cron}`, { repo, cron }, { next: 'Lunes 09:00 UTC' });
    showToast('Watchdog programado', 'success');
  };

  window.lepismExecuteLocksmith = function (e) {
    e.preventDefault();
    const box = document.getElementById('locksmith-results-box');
    const content = document.getElementById('locksmith-results-content');
    box.classList.remove('hidden');

    content.innerHTML = `
      <h3 class="card-title">🔑 Optimización de Lockfile Completada</h3>
      <p class="text-muted">✅ 2 dependencias duplicadas normalizadas (-1.4 KB en lockfile).</p>
      <div class="code-viewer">// Deduplicated: debug@2.6.9 ➔ debug@4.3.4\n// Verified: 142 SHA-512 integrity checksums</div>
    `;

    addRunRecord('locksmith', 'Optimización Locksmith', {}, { reduction: '1.4 KB' });
    showToast('Lockfile optimizado con éxito', 'success');
  };

  // ─── Modal & Injection Helpers ──────────────────────────────────────────────

  window.lepismShowInjectModal = function (encodedYaml, filename) {
    const yaml = decodeURIComponent(encodedYaml);
    modalTitle.textContent = '⚡ Inyectar Workflow a Repositorio GitHub';
    modalBody.innerHTML = `
      <p class="card-description">Este archivo se creará directamente en <code>.github/workflows/${escapeHtml(filename)}</code> en tu repositorio:</p>
      <div class="form-group">
        <label class="form-label">Repositorio Destino (owner/repo)</label>
        <input type="text" id="inject-target-repo" class="form-input" placeholder="ej: amglogicalis/my-app">
      </div>
      <div class="form-group">
        <label class="form-label">Personal Access Token (PAT)</label>
        <input type="password" id="inject-pat-token" class="form-input" placeholder="ghp_..." value="${escapeHtml(state.githubToken)}">
      </div>
    `;
    modalFooter.innerHTML = `
      <button class="btn btn-secondary btn-sm" onclick="window.lepismCloseModal()">Cancelar</button>
      <button class="btn btn-primary btn-sm" onclick="window.lepismConfirmInject('${encodeURIComponent(yaml)}', '${escapeHtml(filename)}')">⚡ Inyectar Ahora</button>
    `;
    modalContainer.classList.remove('hidden');
  };

  window.lepismConfirmInject = async function (encodedYaml, filename) {
    const yaml = decodeURIComponent(encodedYaml);
    const repoInput = document.getElementById('inject-target-repo');
    const tokenInput = document.getElementById('inject-pat-token');

    const repo = repoInput ? repoInput.value.trim() : '';
    const token = tokenInput ? tokenInput.value.trim() : '';

    if (!repo) {
      showToast('Introduce el repositorio destino (owner/repo)', 'warning');
      return;
    }
    if (!token) {
      showToast('Se requiere un Personal Access Token (PAT) con permisos de repo', 'warning');
      return;
    }

    state.githubToken = token;
    sessionStorage.setItem('lepism_github_token', token);

    try {
      const pathUrl = `https://api.github.com/repos/${repo}/contents/.github/workflows/${filename}`;
      let sha = undefined;

      const checkRes = await fetch(pathUrl, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' },
      });
      if (checkRes.ok) {
        const fileData = await checkRes.json();
        sha = fileData.sha;
      }

      const putRes = await fetch(pathUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `ci: add Lepism ${filename} workflow`,
          content: btoa(unescape(encodeURIComponent(yaml))),
          sha,
        }),
      });

      if (putRes.ok) {
        window.lepismCloseModal();
        showToast(`Workflow inyectado en ${repo}/.github/workflows/${filename}`, 'success');
      } else {
        showToast(`Error al inyectar: HTTP ${putRes.status}`, 'error');
      }
    } catch (err) {
      showToast(`Error de red: ${err.message}`, 'error');
    }
  };

  window.lepismShowRunDetails = function (runId) {
    const run = state.runs.find(r => r.runId === runId);
    if (!run) return;

    modalTitle.textContent = `Detalles de Ejecución: ${run.name}`;
    modalBody.innerHTML = `
      <div style="margin-bottom:14px;">
        <span class="badge badge-info">${run.functionType}</span>
        <span class="badge badge-safe" style="margin-left:6px;">${run.status.toUpperCase()}</span>
      </div>
      <p class="text-muted" style="font-size:0.8rem;">Iniciado: ${new Date(run.startedAt).toLocaleString()}</p>
      <div class="code-viewer" style="margin-top:12px;">${escapeHtml(JSON.stringify(run.result || {}, null, 2))}</div>
    `;
    modalFooter.innerHTML = `
      <button class="btn btn-secondary btn-sm" onclick="window.lepismCopyText('${encodeURIComponent(JSON.stringify(run.result || {}))}')">📋 Copiar Datos</button>
      <button class="btn btn-primary btn-sm" onclick="window.lepismCloseModal()">Cerrar</button>
    `;
    modalContainer.classList.remove('hidden');
  };

  window.lepismCloseModal = function () {
    modalContainer.classList.add('hidden');
  };

  window.lepismCopyText = function (encoded) {
    const text = decodeURIComponent(encoded);
    navigator.clipboard.writeText(text);
    showToast('Copiado al portapapeles', 'success');
  };

  window.lepismClearRuns = function () {
    state.runs = [];
    localStorage.removeItem('lepism_runs');
    renderRunsView();
    showToast('Historial de ejecuciones limpiado', 'info');
  };

  window.lepismLoadSampleManifest = function () {
    const textarea = document.getElementById('scan-code');
    if (textarea) {
      textarea.value = JSON.stringify({
        name: 'sample-e-commerce-app',
        version: '1.0.0',
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          axios: '^0.27.2',
          lodash: '^4.17.20',
          express: '^4.18.2',
        },
        devDependencies: {
          typescript: '^5.0.4',
          vite: '^4.3.9',
        },
      }, null, 2);
      showToast('Manifiesto de ejemplo cargado', 'info');
    }
  };

  function showTokenConfigModal() {
    modalTitle.textContent = '🔑 Configurar Personal Access Token (PAT)';
    modalBody.innerHTML = `
      <p class="card-description">Tu token se almacena únicamente en la sesión local de tu navegador para interactuar con la API de GitHub.</p>
      <div class="form-group">
        <label class="form-label">GitHub PAT (con permiso <code>repo</code> y <code>workflow</code>)</label>
        <input type="password" id="pat-input" class="form-input" placeholder="ghp_..." value="${escapeHtml(state.githubToken)}">
      </div>
    `;
    modalFooter.innerHTML = `
      <button class="btn btn-secondary btn-sm" onclick="window.lepismCloseModal()">Cancelar</button>
      <button class="btn btn-primary btn-sm" onclick="window.lepismSaveToken()">Guardar Token</button>
    `;
    modalContainer.classList.remove('hidden');
  }

  window.lepismSaveToken = function () {
    const input = document.getElementById('pat-input');
    if (input) {
      state.githubToken = input.value.trim();
      sessionStorage.setItem('lepism_github_token', state.githubToken);
      window.lepismCloseModal();
      showToast('Token de GitHub guardado en sesión', 'success');
    }
  };

  function addRunRecord(type, name, config, result) {
    const run = {
      runId: `run_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      functionType: type,
      name,
      status: 'completed',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      config,
      result,
      logs: ['[Lepism] Run completed successfully.'],
    };
    state.runs.unshift(run);
    if (state.runs.length > 50) state.runs = state.runs.slice(0, 50);
    localStorage.setItem('lepism_runs', JSON.stringify(state.runs));
  }

  function seedInitialRunsIfEmpty() {
    if (state.runs.length === 0) {
      addRunRecord('scan', 'Initial Baseline Scan', { ecosystem: 'npm' }, { deps: 5 });
      addRunRecord('analyze', 'Baseline Molt Score', {}, { score: 96 });
    }
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function setupModals() {
    if (btnModalClose) btnModalClose.addEventListener('click', window.lepismCloseModal);
    modalContainer.addEventListener('click', e => {
      if (e.target === modalContainer) window.lepismCloseModal();
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Start app
  document.addEventListener('DOMContentLoaded', init);
})();
