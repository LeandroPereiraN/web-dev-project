export type UserRole = 'SELLER' | 'ADMIN';

export interface UserSummary {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UserProfile extends UserSummary {
  phone?: string | null;
  address?: string | null;
  profilePictureUrl?: string | null;
  specialty?: string | null;
  yearsExperience?: number | null;
  professionalDescription?: string | null;
  registrationDate: string;
  isActive: boolean;
  isSuspended: boolean;
  averageRating: number;
  totalCompletedJobs: number;
  lastJobDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address?: string | null;
  specialty?: string | null;
  yearsExperience?: number | null;
  professionalDescription?: string | null;
  profilePictureUrl?: string | null;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  address?: string | null;
  specialty?: string | null;
  yearsExperience?: number | null;
  professionalDescription?: string | null;
  profilePictureUrl?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountPayload {
  password: string;
}

export interface PortfolioItem {
  id: number;
  imageUrl: string;
  description?: string | null;
  isFeatured: boolean;
}

export type ContactStatusValue =
  | 'NEW'
  | 'SEEN'
  | 'IN_PROCESS'
  | 'COMPLETED'
  | 'NO_INTEREST'
  | 'SERVICE_DELETED'
  | 'SELLER_INACTIVE';

export interface ContactSummary {
  id: number;
  serviceId?: number;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  taskDescription: string;
  status: ContactStatusValue;
  createdAt: string;
  updatedAt: string;
}

export interface ContactDetail extends ContactSummary {
  uniqueRatingToken?: string;
  ratingTokenExpiresAt?: string;
  service?: {
    id: number;
    title: string;
    sellerId: number;
  };
}
