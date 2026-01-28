/**
 * In-memory store for development without Supabase
 * Falls back to this when NEXT_PUBLIC_SUPABASE_URL is not configured
 */
import { v4 as uuidv4 } from 'uuid';

export const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return url !== '' && url !== 'https://placeholder.supabase.co';
};

interface BusinessRecord {
  id: string;
  service_name: string;
  description: string;
  what_you_do: string;
  category: string;
  logo_url: string | null;
  face_url: string | null;
  owner_name: string | null;
  is_public_gallery: boolean;
  admin_token: string;
  created_at: string;
  updated_at: string;
}

interface SurveyQuestion {
  id: string;
  type: 'rating' | 'multi_select' | 'free_text';
  label: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
}

interface SurveyDefinitionRecord {
  id: string;
  business_id: string;
  version: number;
  questions: SurveyQuestion[];
  created_at: string;
}

interface SurveyAnswer {
  question_id: string;
  value: number | string | string[];
}

interface SurveyResponseRecord {
  id: string;
  business_id: string;
  survey_definition_id: string;
  answers: SurveyAnswer[];
  free_comment: string | null;
  created_at: string;
}

interface GeneratedCopyRecord {
  id: string;
  survey_response_id: string;
  review_text: string;
  status: string;
  created_at: string;
}

interface GeneratedImageRecord {
  id: string;
  business_id: string;
  template_id: string;
  generated_copy_id: string;
  image_url: string;
  is_public: boolean;
  created_at: string;
}

interface InMemoryStore {
  businesses: Record<string, BusinessRecord>;
  survey_definitions: Record<string, SurveyDefinitionRecord>;
  survey_responses: Record<string, SurveyResponseRecord>;
  generated_copies: Record<string, GeneratedCopyRecord>;
  generated_images: Record<string, GeneratedImageRecord>;
}

// Global store that persists during server lifecycle
const globalStore: InMemoryStore = {
  businesses: {},
  survey_definitions: {},
  survey_responses: {},
  generated_copies: {},
  generated_images: {},
};

// Seed with sample data
function ensureSeeded() {
  if (Object.keys(globalStore.businesses).length > 0) return;

  const biz1Id = 'demo-biz-001';
  const biz2Id = 'demo-biz-002';
  const biz3Id = 'demo-biz-003';
  const survey1Id = 'demo-survey-001';
  const survey2Id = 'demo-survey-002';
  const survey3Id = 'demo-survey-003';
  const token1 = 'demo-token-001';
  const token2 = 'demo-token-002';
  const token3 = 'demo-token-003';

  globalStore.businesses[biz1Id] = {
    id: biz1Id,
    service_name: '〇〇整体',
    description: '肩こり・腰痛に特化した整体院です。初回は姿勢分析＋施術＋セルフケア提案を行います。',
    what_you_do: '姿勢分析、施術、セルフケア指導',
    category: '健康・医療',
    logo_url: null,
    face_url: null,
    owner_name: '山田太郎',
    is_public_gallery: true,
    admin_token: token1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  globalStore.businesses[biz2Id] = {
    id: biz2Id,
    service_name: 'ABC美容室',
    description: 'カット・カラー・パーマを中心に、トータルビューティを提供するヘアサロンです。',
    what_you_do: 'カット、カラー、パーマ、ヘッドスパ',
    category: '美容',
    logo_url: null,
    face_url: null,
    owner_name: '佐藤花子',
    is_public_gallery: true,
    admin_token: token2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  globalStore.businesses[biz3Id] = {
    id: biz3Id,
    service_name: 'サンプル学習塾',
    description: '小中高生向けの個別指導塾です。一人ひとりに合った学習プランを作成します。',
    what_you_do: '個別指導、学習プラン作成、定期テスト対策',
    category: '教育',
    logo_url: null,
    face_url: null,
    owner_name: '鈴木一郎',
    is_public_gallery: false,
    admin_token: token3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const defaultQuestions: SurveyQuestion[] = [
    {
      id: uuidv4(),
      type: 'rating',
      label: '満足度はいかがでしたか？',
      required: true,
      min: 1,
      max: 5,
    },
    {
      id: uuidv4(),
      type: 'multi_select',
      label: '良かった点を教えてください',
      required: true,
      options: ['説明が丁寧', '技術が高い', '接客が良い', '通いやすい', '価格が適正', '清潔感がある'],
    },
    {
      id: uuidv4(),
      type: 'free_text',
      label: 'その他、感想やメッセージがあればお聞かせください',
      required: false,
    },
  ];

  [biz1Id, biz2Id, biz3Id].forEach((bizId, i) => {
    const surveyId = [survey1Id, survey2Id, survey3Id][i];
    globalStore.survey_definitions[surveyId] = {
      id: surveyId,
      business_id: bizId,
      version: 1,
      questions: defaultQuestions.map(q => ({ ...q, id: uuidv4() })),
      created_at: new Date().toISOString(),
    };
  });
}

// ===== CRUD Operations =====

export function listBusinesses(search?: string, category?: string) {
  ensureSeeded();
  let results = Object.values(globalStore.businesses);

  if (search) {
    const s = search.toLowerCase();
    results = results.filter(
      (b) =>
        b.service_name.toLowerCase().includes(s) ||
        b.description.toLowerCase().includes(s)
    );
  }

  if (category) {
    results = results.filter((b) => b.category === category);
  }

  // Return without admin_token
  return results
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(({ admin_token: _token, ...rest }) => rest);
}

export function getBusiness(id: string) {
  ensureSeeded();
  const biz = globalStore.businesses[id];
  if (!biz) return null;
  const { admin_token: _token, ...publicData } = biz;
  return publicData;
}

export function getBusinessByToken(token: string) {
  ensureSeeded();
  return Object.values(globalStore.businesses).find((b) => b.admin_token === token) || null;
}

export function createBusiness(data: Omit<BusinessRecord, 'id' | 'admin_token' | 'is_public_gallery' | 'created_at' | 'updated_at'>) {
  ensureSeeded();
  const id = uuidv4();
  const adminToken = uuidv4();
  const business: BusinessRecord = {
    id,
    ...data,
    admin_token: adminToken,
    is_public_gallery: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  globalStore.businesses[id] = business;
  return business;
}

export function updateBusiness(token: string, updates: Record<string, unknown>) {
  ensureSeeded();
  const biz = Object.values(globalStore.businesses).find((b) => b.admin_token === token);
  if (!biz) return null;

  Object.assign(biz, updates, { updated_at: new Date().toISOString() });
  return biz;
}

export function getSurveyForBusiness(businessId: string) {
  ensureSeeded();
  const surveys = Object.values(globalStore.survey_definitions)
    .filter((s) => s.business_id === businessId)
    .sort((a, b) => b.version - a.version);
  return surveys[0] || null;
}

export function createSurveyDefinition(data: Omit<SurveyDefinitionRecord, 'id' | 'created_at'>) {
  ensureSeeded();
  const id = uuidv4();
  const survey: SurveyDefinitionRecord = { id, ...data, created_at: new Date().toISOString() };
  globalStore.survey_definitions[id] = survey;
  return survey;
}

export function createSurveyResponse(data: Omit<SurveyResponseRecord, 'id' | 'created_at'>) {
  ensureSeeded();
  const id = uuidv4();
  const response: SurveyResponseRecord = { id, ...data, created_at: new Date().toISOString() };
  globalStore.survey_responses[id] = response;
  return response;
}

export function getSurveyResponse(id: string) {
  ensureSeeded();
  return globalStore.survey_responses[id] || null;
}

export function createGeneratedCopy(data: Omit<GeneratedCopyRecord, 'id' | 'created_at'>) {
  ensureSeeded();
  const id = uuidv4();
  const copy: GeneratedCopyRecord = { id, ...data, created_at: new Date().toISOString() };
  globalStore.generated_copies[id] = copy;
  return copy;
}

export function getGeneratedCopy(id: string) {
  ensureSeeded();
  return globalStore.generated_copies[id] || null;
}

export function createGeneratedImage(data: Omit<GeneratedImageRecord, 'id' | 'created_at'>) {
  ensureSeeded();
  const id = uuidv4();
  const image: GeneratedImageRecord = { id, ...data, created_at: new Date().toISOString() };
  globalStore.generated_images[id] = image;
  return image;
}
