import { useState } from 'react';
import { Send, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function QuoteForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('quote_requests')
        .insert([formData]);

      if (insertError) throw insertError;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-quote-email`;

      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setSubmitted(true);
      setFormData({ name: '', address: '', email: '', phone: '' });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting quote request:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Check className="text-green-600" size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Thank You!</h3>
            <p className="text-green-50">We'll contact you soon with your free quote.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Get Your Free Solar Quote Today
          </h2>
          <p className="text-blue-100 text-lg">
            Connect with Michigan's top solar installers in minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-white focus:ring-2 focus:ring-white transition-all"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Address *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-white focus:ring-2 focus:ring-white transition-all"
              placeholder="123 Main St, Detroit, MI 48201"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-white focus:ring-2 focus:ring-white transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-white focus:ring-2 focus:ring-white transition-all"
              placeholder="(555) 123-4567"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-blue-700 font-bold py-4 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-lg shadow-lg"
          >
            {loading ? (
              'Sending...'
            ) : (
              <>
                <Send size={20} />
                Request Free Quote
              </>
            )}
          </button>
        </form>

        <p className="text-blue-100 text-xs text-center mt-4">
          No obligation. Get multiple quotes from certified installers.
        </p>
      </div>
    </div>
  );
}
