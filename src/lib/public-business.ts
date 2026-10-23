// 公開APIには管理トークンや所有者情報を含めない。
const publicFields = ['id', 'service_name', 'description', 'what_you_do', 'category', 'logo_url', 'face_url', 'is_public_gallery', 'created_at'] as const;

export function publicBusiness(business: object) {
  const source = business as Record<string, unknown>;
  return Object.fromEntries(publicFields.map((key) => [key, source[key]]));
}
