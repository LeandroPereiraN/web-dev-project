export type PriceType = 'per_hour' | 'per_project' | 'per_day' | 'per_month' | 'other';
//agrego un booleano aca y luego si ese bool es true no deje contactar
export interface ServiceImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
  createdAt: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
}
export interface ServiceItem {
  id: number;
  sellerId: number;
  title: string;
  description: string;
  categoryId: number;
  basePrice: number;
  priceType: PriceType;
  estimatedTime?: string;
  materialsIncluded?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: ServiceImage[];
  category: ServiceCategory;
}

export interface ServiceListResponse {
  services: ServiceItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ServiceSearchParams {
  categoryId?: number;
  sellerId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'rating_asc' | 'rating_desc' | 'date_desc';
  includeInactive?: boolean;
  page?: number;
  limit?: number;
}

export interface CategoryItem {
  id: number;
  name: string;
  description?: string | null;
  createdAt: string;
}

export interface ContactSellerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  taskDescription: string;
}

export interface ContactResponse {
  id: number;
  serviceId?: number;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  taskDescription: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  service: {
    id: number;
    title: string;
    sellerId: number;
  };
}

export interface ServiceFormPayload {
  title: string;
  description: string;
  categoryId: number;
  basePrice: number;
  priceType: PriceType;
  estimatedTime?: string | null;
  materialsIncluded?: string | null;
  images?: string[];
}

export interface ServiceUpdatePayload {
  title?: string;
  description?: string;
  categoryId?: number;
  basePrice?: number;
  priceType?: PriceType;
  estimatedTime?: string | null;
  materialsIncluded?: string | null;
  images?: string[];
  isActive?: boolean;
}
