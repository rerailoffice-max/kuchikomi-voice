// ===== Database Models =====

export interface Business {
  id: string;
  service_name: string;
  description: string;
  what_you_do: string;
  logo_url: string | null;
  face_url: string | null;
  owner_name?: string | null;
  category: string;
  is_public_gallery: boolean;
  admin_token: string;
  created_at: string;
  updated_at: string;
}

export interface SurveyDefinition {
  id: string;
  business_id: string;
  version: number;
  questions: SurveyQuestion[];
  created_at: string;
}

export interface SurveyQuestion {
  id: string;
  type: 'rating' | 'multi_select' | 'free_text';
  label: string;
  required: boolean;
  options?: string[];       // for multi_select
  min?: number;             // for rating
  max?: number;             // for rating
}

export interface SurveyResponse {
  id: string;
  business_id: string;
  survey_definition_id: string;
  answers: SurveyAnswer[];
  free_comment: string | null;
  created_at: string;
}

export interface SurveyAnswer {
  question_id: string;
  value: number | string | string[];
}

export interface GeneratedCopy {
  id: string;
  survey_response_id: string;
  review_text: string;
  status: 'draft' | 'final';
  created_at: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  orientation: 'portrait' | 'landscape';
  size_presets: SizePreset[];
  preview_image: string;
  prompt_skeleton: string;
  constraints: TemplateConstraints;
  style: TemplateStyle;
}

export interface SizePreset {
  label: string;
  width: number;
  height: number;
}

export interface TemplateConstraints {
  max_heading_chars: number;
  max_body_chars: number;
  recommended_tone: string;
}

export interface TemplateStyle {
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  layout: 'card' | 'headline' | 'multi' | 'minimal' | 'recommendation' | 'before_after' | 'badge' | 'magazine' | 'sns_casual' | 'numbers';
}

export interface GeneratedImage {
  id: string;
  business_id: string;
  template_id: string;
  generated_copy_id: string;
  image_url: string;
  is_public: boolean;
  created_at: string;
}

// ===== API Request/Response Types =====

export interface BusinessRegistrationRequest {
  service_name: string;
  description: string;
  what_you_do: string;
  category: string;
  owner_name?: string | null;
  logo_url?: string | null;
  face_url?: string | null;
  questions: Omit<SurveyQuestion, 'id'>[];
}

export interface GenerateReviewRequest {
  survey_response_id: string;
  business_id: string;
}

export interface GenerateImageRequest {
  template_id: string;
  generated_copy_id: string;
  business_id: string;
  orientation: 'portrait' | 'landscape';
  size_preset: string;
}

// ===== UI State Types =====

export interface ReviewFlowState {
  step: 'select' | 'survey' | 'review' | 'template' | 'download';
  businessId: string | null;
  surveyResponseId: string | null;
  generatedCopyId: string | null;
  reviewText: string | null;
  selectedTemplateId: string | null;
  generatedImageUrl: string | null;
}
