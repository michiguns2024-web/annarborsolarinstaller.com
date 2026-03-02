import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Phone, MapPin, Calendar, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Installer } from '../types/installer';

interface AdminPanelProps {
  onInstallersUpdated: () => void;
}

interface QuoteRequest {
  id: string;
  name: string;
  address: string;
  email?: string;
  phone: string;
  email_sent: boolean;
  created_at: string;
}

interface InstallerFormData {
  name: string;
  description: string;
  phone: string;
  website: string;
  rating: number;
  years_in_business: number;
  certifications: string;
  services: string;
  price_range: '$' | '$$' | '$$$';
  image_url: string;
}

const emptyForm: InstallerFormData = {
  name: '',
  description: '',
  phone: '',
  website: '',
  rating: 4.5,
  years_in_business: 1,
  certifications: '',
  services: '',
  price_range: '$$',
  image_url: '',
};

export default function AdminPanel({ onInstallersUpdated }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'installers' | 'quotes'>('installers');
  const [installers, setInstallers] = useState<Installer[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<InstallerFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchInstallers();
    fetchQuoteRequests();
  }, []);

  const fetchInstallers = async () => {
    try {
      const { data, error } = await supabase
        .from('installers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInstallers(data || []);
    } catch (error) {
      console.error('Error fetching installers:', error);
    }
  };

  const fetchQuoteRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuoteRequests(data || []);
    } catch (error) {
      console.error('Error fetching quote requests:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const installerData = {
        name: formData.name,
        description: formData.description,
        phone: formData.phone,
        website: formData.website || null,
        rating: formData.rating,
        years_in_business: formData.years_in_business,
        certifications: formData.certifications.split(',').map(s => s.trim()).filter(s => s),
        services: formData.services.split(',').map(s => s.trim()).filter(s => s),
        price_range: formData.price_range,
        image_url: formData.image_url || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('installers')
          .update(installerData)
          .eq('id', editingId);

        if (error) throw error;
        showMessage('success', 'Installer updated successfully!');
      } else {
        const { error } = await supabase
          .from('installers')
          .insert([installerData]);

        if (error) throw error;
        showMessage('success', 'Installer added successfully!');
      }

      setFormData(emptyForm);
      setShowForm(false);
      setEditingId(null);
      fetchInstallers();
      onInstallersUpdated();
    } catch (error) {
      console.error('Error saving installer:', error);
      showMessage('error', 'Failed to save installer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (installer: Installer) => {
    setFormData({
      name: installer.name,
      description: installer.description,
      phone: installer.phone,
      website: installer.website || '',
      rating: installer.rating,
      years_in_business: installer.years_in_business,
      certifications: installer.certifications.join(', '),
      services: installer.services.join(', '),
      price_range: installer.price_range,
      image_url: installer.image_url || '',
    });
    setEditingId(installer.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this installer?')) return;

    try {
      const { error } = await supabase
        .from('installers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showMessage('success', 'Installer deleted successfully!');
      fetchInstallers();
      onInstallersUpdated();
    } catch (error) {
      console.error('Error deleting installer:', error);
      showMessage('error', 'Failed to delete installer. Please try again.');
    }
  };

  const handleDeleteQuote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote request?')) return;

    try {
      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showMessage('success', 'Quote request deleted successfully!');
      fetchQuoteRequests();
    } catch (error) {
      console.error('Error deleting quote request:', error);
      showMessage('error', 'Failed to delete quote request. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-6">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => {
              setActiveTab('installers');
              setShowForm(false);
            }}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'installers'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Manage Installers
          </button>
          <button
            onClick={() => {
              setActiveTab('quotes');
              setShowForm(false);
            }}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'quotes'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Quote Requests
            {quoteRequests.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {quoteRequests.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'installers' && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Installers</h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add New Installer
              </button>
            )}
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quote Requests</h2>
            <p className="text-gray-600 mt-1">View and manage customer quote requests</p>
          </div>
        )}
      </div>

      {activeTab === 'installers' && showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-blue-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            {editingId ? 'Edit Installer' : 'Add New Installer'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5) *
              </label>
              <input
                type="number"
                required
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years in Business *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.years_in_business}
                onChange={(e) => setFormData({ ...formData, years_in_business: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range *
              </label>
              <select
                required
                value={formData.price_range}
                onChange={(e) => setFormData({ ...formData, price_range: e.target.value as '$' | '$$' | '$$$' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="$">$ - Budget Friendly</option>
                <option value="$$">$$ - Moderate</option>
                <option value="$$$">$$$ - Premium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Services (comma separated) *
              </label>
              <input
                type="text"
                required
                placeholder="Residential Solar, Commercial Solar, Battery Storage"
                value={formData.services}
                onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certifications (comma separated) *
              </label>
              <input
                type="text"
                required
                placeholder="NABCEP Certified, Licensed Electrician, Tesla Powerwall Certified"
                value={formData.certifications}
                onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {loading ? 'Saving...' : editingId ? 'Update Installer' : 'Add Installer'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </form>
      )}

      {activeTab === 'installers' && (
        <div className="space-y-3">
          {installers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No installers yet. Add your first one!</p>
          ) : (
            installers.map((installer) => (
              <div
                key={installer.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{installer.name}</h3>
                  <p className="text-sm text-gray-500">{installer.phone}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(installer)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(installer.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'quotes' && (
        <div className="space-y-4">
          {quoteRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No quote requests yet</p>
              <p className="text-gray-400 text-sm mt-2">Quote requests will appear here when customers submit them</p>
            </div>
          ) : (
            quoteRequests.map((quote) => (
              <div
                key={quote.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{quote.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar size={16} />
                      <span>{formatDate(quote.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteQuote(quote.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="flex items-start gap-2">
                    <Phone size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                      <a
                        href={`tel:${quote.phone}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {quote.phone}
                      </a>
                    </div>
                  </div>

                  {quote.email && (
                    <div className="flex items-start gap-2">
                      <Mail size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                        <a
                          href={`mailto:${quote.email}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {quote.email}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                      <p className="text-gray-900 font-medium">{quote.address}</p>
                    </div>
                  </div>
                </div>

                {quote.email_sent && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Email Sent
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
