import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-white font-bold">利用者の声</span>
            </div>
            <p className="text-sm leading-relaxed">
              AIで口コミ文を自動生成し、プロ品質の利用者の声チラシを作成できるサービスです。
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">サービス</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/review" className="hover:text-white transition-colors">口コミを書く</Link></li>
              <li><Link href="/templates" className="hover:text-white transition-colors">テンプレート一覧</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">ギャラリー</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">事業者向け</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/business/register" className="hover:text-white transition-colors">事業者登録</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
          <p>&copy; 2025 利用者の声 - AI口コミ画像生成サービス</p>
        </div>
      </div>
    </footer>
  );
}
