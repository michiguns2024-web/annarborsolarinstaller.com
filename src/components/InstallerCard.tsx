import { Star, Phone, Globe, Award, Wrench } from 'lucide-react';
import type { Installer } from '../types/installer';

interface InstallerCardProps {
  installer: Installer;
  rank: number;
}

export default function InstallerCard({ installer, rank }: InstallerCardProps) {
  const getRankColor = (r: number) => {
    if (r === 1) return 'from-yellow-400 to-amber-500';
    if (r === 2) return 'from-gray-300 to-gray-400';
    if (r === 3) return 'from-orange-400 to-orange-600';
    return 'from-blue-400 to-blue-500';
  };
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 relative">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getRankColor(rank)}`}></div>
      <div className="p-6">
        <div className="mb-4">
          <div className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br ${getRankColor(rank)} flex items-center justify-center text-white font-bold text-sm`}>
            #{rank}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{installer.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {renderStars(installer.rating)}
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {installer.rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
              • {installer.years_in_business} years
            </span>
            <span className="text-sm font-medium text-blue-600">
              {installer.price_range}
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 leading-relaxed">{installer.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone size={16} className="text-gray-400 flex-shrink-0" />
            <a href={`tel:${installer.phone}`} className="hover:text-blue-600 transition-colors">
              {installer.phone}
            </a>
          </div>
          {installer.website && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Globe size={16} className="text-gray-400 flex-shrink-0" />
              <a
                href={installer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        {installer.services.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
              <Wrench size={14} className="text-gray-600" />
              Services
            </h4>
            <div className="flex flex-wrap gap-2">
              {installer.services.map((service, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {installer.certifications.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
              <Award size={14} className="text-gray-600" />
              Certifications
            </h4>
            <div className="flex flex-wrap gap-2">
              {installer.certifications.map((cert, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
