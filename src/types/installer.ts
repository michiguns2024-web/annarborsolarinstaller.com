export interface Installer {
  id: string;
  name: string;
  description: string;
  phone: string;
  website: string | null;
  rating: number;
  years_in_business: number;
  certifications: string[];
  services: string[];
  price_range: '$' | '$$' | '$$$';
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequest {
  name: string;
  address: string;
  phone: string;
  email?: string;
}
