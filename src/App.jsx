import { useEffect, useState } from 'react';
import { Activity, HardDrive, Menu, Search, Sparkles, X } from 'lucide-react';
import { LogsDbDashboard } from './components/LogsDbDashboard';
import { CapacityPlanningDashboard } from './components/CapacityPlanningDashboard';
import { FederatedFutureDashboard } from './components/FederatedFutureDashboard';
import { fetchHealth } from './lib/elastic-api';

const MODULES = [
  {
    id: 'logsdb',
    label: 'LogsDB today',
    icon: HardDrive,
    focus: 'Index templates · best_compression · ~30% storage savings with no app changes',
    primary: true,
  },
  {
    id: 'capacity',
    label: 'Capacity & ILM',
    icon: Activity,
    focus: 'Auto-scale triggers · shard limits · frozen / searchable snapshot tiers',
  },
  {
    id: 'federated',
    label: 'Search + federation',
    icon: Search,
    focus: 'Enterprise Search Serverless · federated S3/GCS/Azure — not observability or security',
    future: true,
  },
];

const MODULE_COMPONENTS = {
  logsdb: LogsDbDashboard,
  capacity: CapacityPlanningDashboard,
  federated: FederatedFutureDashboard,
};

export default function App() {
  const [activeModule, setActiveModule] = useState('logsdb');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [live, setLive] = useState(null);

  useEffect(() => {
    fetchHealth()
      .then((data) => setLive(data.connected ? data : null))
      .catch(() => setLive(null));
  }, []);

  const ActiveComponent = MODULE_COMPONENTS[activeModule];
  const activeMeta = MODULES.find((m) => m.id === activeModule);

  return (
    <div className="min-h-screen bg-elastic-light">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-elastic-teal flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm font-bold text-elastic-dark leading-tight">Elastic Observability</h1>
                  <p className="text-[10px] text-elastic-gray leading-tight">Storage & capacity workshop demo</p>
                </div>
              </div>
              <div className="hidden md:block h-6 w-px bg-gray-200" />
              <div className="hidden md:flex items-center gap-1 text-[10px] text-elastic-gray">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse-dot ${live ? 'bg-success' : 'bg-elastic-teal'}`} />
                {live ? 'Live backend connected' : 'Interactive narrative · optional Elastic Cloud keys'}
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {MODULES.map((mod) => {
                const Icon = mod.icon;
                const isActive = activeModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setActiveModule(mod.id)}
                    className={`flex items-center gap-2 rounded-lg text-sm font-medium transition-colors px-3 py-2 ${
                      mod.primary || mod.future ? 'ring-1 ring-inset' : ''
                    } ${
                      isActive
                        ? mod.future
                          ? 'bg-violet-600 text-white ring-violet-400/40'
                          : mod.primary
                            ? 'bg-success text-white ring-success/30'
                            : 'bg-elastic-teal text-white ring-elastic-teal/30'
                        : mod.primary
                          ? 'text-elastic-dark bg-emerald-50/80 ring-emerald-200 hover:bg-emerald-100'
                          : mod.future
                            ? 'text-violet-900 bg-violet-50 ring-violet-200 hover:bg-violet-100'
                            : 'text-elastic-gray hover:bg-gray-100 hover:text-elastic-dark'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {mod.label}
                    {mod.primary && (
                      <span className={`text-[9px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-emerald-600 text-white'
                      }`}
                      >
                        Today
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <button
              type="button"
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-gray-100 px-4 py-2 space-y-1">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => { setActiveModule(mod.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
                    activeModule === mod.id ? 'bg-elastic-teal text-white' : 'text-elastic-gray'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {mod.label}
                </button>
              );
            })}
          </nav>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeMeta && (
          <p className="text-xs text-elastic-gray mb-4">
            Focus: <strong>{activeMeta.focus}</strong>
            {live ? ' · live Elastic Cloud Serverless' : ' · illustrative sizing (configure ES_URL in Vercel env for live health)'}
          </p>
        )}
        <ActiveComponent />
      </main>

      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-elastic-gray">
          <p>Elastic Observability · Storage & capacity demo · Public workshop site</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-elastic-teal" />
              Elastic Stack
            </span>
            <span>LogsDB · ILM · Search federation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
