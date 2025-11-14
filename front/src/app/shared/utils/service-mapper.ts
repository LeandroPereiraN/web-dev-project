import type {
  CategoryItem,
  ContactResponse,
  ServiceItem,
} from '../types/service';

export interface CategoryApiResponse {
  id: number;
  name: string;
  description?: string | null;
  created_at: string;
}

export interface ServiceImageApiResponse {
  id: number;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface ServiceCategoryApiResponse {
  id: number;
  name: string;
}

export interface ServiceApiResponse {
  id: number;
  seller_id: number;
  title: string;
  description: string;
  category_id: number;
  base_price: number;
  price_type: ServiceItem['priceType'];
  estimated_time?: string;
  materials_included?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images: ServiceImageApiResponse[];
  category: ServiceCategoryApiResponse;
}

export interface ServiceListApiResponse {
  services: ServiceApiResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface ContactApiResponse {
  id: number;
  service_id?: number;
  client_first_name: string;
  client_last_name: string;
  client_email: string;
  client_phone: string;
  task_description: string;
  status: string;
  created_at: string;
  updated_at: string;
  service: {
    id: number;
    title: string;
    seller_id: number;
  };
}

export function mapCategory(response: CategoryApiResponse): CategoryItem {
  return {
    id: response.id,
    name: response.name,
    description: response.description ?? null,
    createdAt: response.created_at,
  };
}

export function mapService(response: ServiceApiResponse): ServiceItem {
  return {
    id: response.id,
    sellerId: response.seller_id,
    title: response.title,
    description: response.description,
    categoryId: response.category_id,
    basePrice: response.base_price,
    priceType: response.price_type,
    estimatedTime: response.estimated_time ?? undefined,
    materialsIncluded: response.materials_included ?? undefined,
    isActive: response.is_active,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
    images: response.images.map((image) => ({
      id: image.id,
      imageUrl: image.image_url,
      displayOrder: image.display_order,
      createdAt: image.created_at,
    })),
    category: {
      id: response.category.id,
      name: response.category.name,
    },
  };
}

export function mapContact(response: ContactApiResponse): ContactResponse {
  return {
    id: response.id,
    serviceId: response.service_id,
    clientFirstName: response.client_first_name,
    clientLastName: response.client_last_name,
    clientEmail: response.client_email,
    clientPhone: response.client_phone,
    taskDescription: response.task_description,
    status: response.status,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
    service: {
      id: response.service.id,
      title: response.service.title,
      sellerId: response.service.seller_id,
    },
  };
}
