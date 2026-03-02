import { useEffect, useState } from 'react';
import { Sun, Search, Download } from 'lucide-react';
import InstallerCard from './components/InstallerCard';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import QuoteForm from './components/QuoteForm';
import { supabase } from './lib/supabase';
import type { Installer } from './types/installer';

function App() {
  const [installers, setInstallers] = useState<Installer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchInstallers();
    checkAuthStatus();

    const checkAdminAccess = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isAdminUrl = urlParams.has('admin');
      setShowAdmin(isAdminUrl);
    };

    checkAdminAccess();
    window.addEventListener('popstate', checkAdminAccess);

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      (() => {
        if (session) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })();
    });

    return () => {
      window.removeEventListener('popstate', checkAdminAccess);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const fetchInstallers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('installers')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setInstallers(data || []);
    } catch (error) {
      console.error('Error fetching installers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInstallers = installers.filter((installer) =>
    installer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    installer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    installer.services.some((service) =>
      service.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Sun size={48} className="text-yellow-300" aria-hidden="true" />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Ann Arbor Solar Installers
              </h1>
              <p className="text-blue-100 mt-2 text-lg">
                {showAdmin ? 'Manage your installer directory' : 'Find trusted solar panel installation experts in your area'}
              </p>
            </div>
          </div>

          {!showAdmin && (
            <div className="mt-8 relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search by name, service, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search solar installers"
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-lg"
              />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {showAdmin ? (
          <>
            <AdminLogin
              onLoginSuccess={() => {}}
              isAuthenticated={isAuthenticated}
              onLogout={() => setIsAuthenticated(false)}
            />
            {isAuthenticated && <AdminPanel onInstallersUpdated={fetchInstallers} />}
          </>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredInstallers.length === 0 ? (
          <div className="text-center py-20">
            <Sun size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No installers found' : 'No installers available'}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Check back later for solar installer listings'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-700">
                Showing <span className="font-semibold">{filteredInstallers.length}</span>{' '}
                {filteredInstallers.length === 1 ? 'installer' : 'installers'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredInstallers.slice(0, 3).map((installer, index) => (
                <InstallerCard key={installer.id} installer={installer} rank={index + 1} />
              ))}
            </div>

            <div className="mb-12">
              <QuoteForm />
            </div>

            {filteredInstallers.length > 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredInstallers.slice(3).map((installer, index) => (
                  <InstallerCard key={installer.id} installer={installer} rank={index + 4} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-gray-900 text-white mt-20" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div>
              <a
                href="https://annarborsolarinstallers.com/annarborsolarinstaller.zip"
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <Download size={20} />
                Download Source Code
              </a>
            </div>
            <p className="text-gray-400">
              © 2026 Ann Arbor Solar Directory. Connecting homeowners with trusted solar professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;



