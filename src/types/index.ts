// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// User Types
export interface User {
  id: string;
  uuid?: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: 'admin' | 'agent' | 'customer';
  is_active?: boolean;
  is_employee?: boolean;
  is_client?: boolean;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
  is_superuser?: boolean;
}

// Lead Types
export interface Lead {
  id: string;
  uuid: string;
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  source: 'website_signup' | 'manual_entry' | 'referral' | 'walk_in' | 'phone_call' | 'social_media';
  status: 'new' | 'contacted' | 'interested' | 'not_interested' | 'converted';
  budget_min?: number;
  budget_max?: number;
  preferred_location?: string;
  property_type?: 'residential' | 'commercial' | 'land';
  notes?: string;
  follow_up_date?: string;
  follow_up_notes?: string;
  assigned_agent?: User;
  created_at: string;
  updated_at: string;
}

// Client Types
export interface Client {
  id: string;
  uuid: string;
  user?: User;
  assigned_agent: User;
  client_type: 'buyer' | 'seller' | 'investor' | 'renter';
  company_name?: string;
  primary_phone?: string;
  secondary_phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
  budget_min?: number;
  budget_max?: number;
  preferred_locations?: string[];
  property_requirements?: Record<string, any>;
  kyc_status: 'pending' | 'submitted' | 'verified' | 'rejected';
  kyc_notes?: string;
  preferred_contact_method?: 'phone' | 'email' | 'whatsapp' | 'in_person';
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Property Types
export interface Property {
  id: string;
  uuid: string;
  title: string;
  property_type: 'apartment' | 'house' | 'villa' | 'plot' | 'commercial' | 'warehouse' | 'office';
  listing_type: 'sale' | 'rent' | 'lease';
  status: 'available' | 'pending' | 'sold' | 'rented' | 'off_market';
  address_line1: string;
  address_line2?: string;
  locality?: string;
  city: string;
  state: string;
  postal_code?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  price: number;
  price_per_sqft?: number;
  security_deposit?: number;
  maintenance_charges?: number;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  total_area_sqft?: number;
  carpet_area_sqft?: number;
  built_up_area_sqft?: number;
  plot_area_sqft?: number;
  floor_number?: number;
  total_floors?: number;
  age_of_property?: number;
  furnished_status?: 'unfurnished' | 'semi_furnished' | 'fully_furnished';
  amenities?: string[];
  features?: string[];
  description?: string;
  key_highlights?: string[];
  listed_date: string;
  available_from?: string;
  days_on_market: number;
  is_featured: boolean;
  is_premium: boolean;
  listing_agent: User;
  photos?: PropertyPhoto[];
  created_at: string;
  updated_at: string;
}

export interface PropertyPhoto {
  id: string;
  url: string;
  title?: string;
  is_primary: boolean;
  order: number;
}

// Deal Types
export interface Deal {
  id: string;
  uuid: string;
  client: Client;
  property: Property;
  agent: User;
  deal_type: 'purchase' | 'sale' | 'rental' | 'lease';
  stage: 'interest' | 'offer' | 'under_contract' | 'closed' | 'cancelled';
  offered_price?: number;
  agreed_price?: number;
  booking_amount?: number;
  commission_percentage: number;
  commission_amount?: number;
  deal_start_date: string;
  expected_closing_date?: string;
  actual_closing_date?: string;
  priority: 'high' | 'medium' | 'low';
  probability?: number;
  notes?: string;
  terms_conditions?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

// Activity Types
export interface Activity {
  id: string;
  uuid: string;
  user: User;
  content_type: 'lead' | 'client' | 'property' | 'deal';
  object_id: string;
  activity_type: 'call' | 'email' | 'meeting' | 'site_visit' | 'follow_up' | 'note' | 'task' | 'document_upload';
  subject?: string;
  description?: string;
  activity_date: string;
  duration_minutes?: number;
  due_date?: string;
  priority?: 'high' | 'medium' | 'low';
  status: 'completed' | 'pending' | 'cancelled';
  meeting_location?: string;
  attendees?: string[];
  outcome?: string;
  next_action?: string;
  follow_up_required: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Document Types
export interface Document {
  id: string;
  uuid: string;
  uploaded_by: User;
  content_type: 'property' | 'client' | 'deal' | 'invoice' | 'user';
  object_id: string;
  document_type: string;
  original_filename: string;
  file_size_bytes: number;
  mime_type: string;
  title?: string;
  description?: string;
  tags?: string[];
  is_public: boolean;
  is_verified: boolean;
  verified_by?: User;
  verified_at?: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

// Invoice Types
export interface Invoice {
  id: string;
  uuid: string;
  invoice_number: string;
  deal: Deal;
  client: Client;
  issued_by: User;
  invoice_type: 'booking' | 'installment' | 'final' | 'commission' | 'rent' | 'maintenance';
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  subtotal: number;
  tax_percentage: number;
  tax_amount: number;
  discount_percentage: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  outstanding_amount: number;
  issue_date: string;
  due_date: string;
  payment_date?: string;
  description?: string;
  terms_conditions?: string;
  notes?: string;
  line_items: InvoiceLineItem[];
  created_at: string;
  updated_at: string;
}

export interface InvoiceLineItem {
  id: string;
  item_type: 'booking_amount' | 'installment' | 'commission' | 'registration' | 'brokerage' | 'other';
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  tax_percentage: number;
  tax_amount: number;
}

// Transaction Types
export interface Transaction {
  id: string;
  uuid: string;
  invoice: Invoice;
  client: Client;
  recorded_by: User;
  transaction_type: 'payment' | 'refund' | 'adjustment';
  amount: number;
  payment_method: 'cash' | 'cheque' | 'bank_transfer' | 'upi' | 'credit_card' | 'debit_card' | 'online_banking';
  payment_status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference_number?: string;
  bank_name?: string;
  bank_account?: string;
  upi_id?: string;
  is_verified: boolean;
  verified_by?: User;
  verified_at?: string;
  transaction_date: string;
  processing_date?: string;
  cleared_date?: string;
  description?: string;
  notes?: string;
  receipt_document?: Document;
  created_at: string;
  updated_at: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  budget_min?: number;
  budget_max?: number;
  preferred_location?: string;
}

export interface LeadForm {
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  source: string;
  budget_min?: number;
  budget_max?: number;
  preferred_location?: string;
  property_type?: string;
  notes?: string;
}

export interface PropertyForm {
  title: string;
  property_type: string;
  listing_type: string;
  address_line1: string;
  address_line2?: string;
  locality?: string;
  city: string;
  state: string;
  postal_code?: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  total_area_sqft?: number;
  furnished_status?: string;
  amenities?: string[];
  description?: string;
  available_from?: string;
}

// Dashboard Types
export interface DashboardStats {
  leads: {
    total: number;
    new: number;
    qualified: number;
    converted: number;
    conversion_rate: number;
  };
  properties: {
    total_listings: number;
    available: number;
    under_contract: number;
    sold: number;
    avg_days_on_market: number;
  };
  deals: {
    active: number;
    completed: number;
    total_value: number;
    commission_earned: number;
  };
  activities: {
    total: number;
    calls: number;
    emails: number;
    meetings: number;
    notes: number;
  };
  performance: {
    response_time_hours: number;
    client_satisfaction: number;
    goal_achievement: number;
  };
}

// Filter and Search Types
export interface PropertyFilters {
  property_type?: string;
  listing_type?: string;
  status?: string;
  city?: string;
  price_min?: number;
  price_max?: number;
  bedrooms?: number;
  bathrooms?: number;
  search?: string;
}

export interface LeadFilters {
  status?: string;
  source?: string;
  assigned_agent?: string;
  follow_up_date?: string;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Utility Types
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingState {
  status: Status;
  error?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  pagination?: {
    page: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}