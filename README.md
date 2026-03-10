# AI Code Creator - منشئ التطبيقات بالذكاء الصناعي

<div align="center">
  <img src="public/logo.svg" alt="AI Code Creator Logo" width="120" height="120">
  
  **منصة متكاملة لإنشاء تطبيقات Full-Stack بضغطة زر واحدة**
  
  [Demo](https://aicodecer.online) · [GitHub](https://github.com/yayass3r/ai-code-creator)
</div>

---

## ✨ الميزات

### 🤖 AI-Powered Development
- **Multi-Model Support**: Z.ai, Grok (X.AI), OpenRouter
- **Natural Language Processing**: وصف المشروع باللغة الطبيعية
- **Streaming Responses**: ردود فورية ومتدفقة

### 🚀 Project Generation
- **6 Templates Ready**: Dashboard, Landing, E-commerce, Blog, SaaS, Portfolio
- **Next.js 15**: أحدث إصدار مع App Router
- **TypeScript Strict Mode**: كود آمن وقوي
- **Tailwind CSS v4**: تنسيقات حديثة
- **Docker Ready**: قابل للتعبئة والنشر

### 📝 Code Editor
- **File Tabs**: تبويبات متعددة للملفات
- **Line Numbers**: أرقام الأسطر
- **Syntax Highlighting**: تمييز بناء الجملة
- **Save/Download**: حفظ وتحميل الملفات

### 👁️ Live Preview
- **Responsive Modes**: Desktop, Tablet, Mobile
- **Real-time Updates**: تحديث فوري
- **Safe Sandbox**: بيئة آمنة للمعاينة

### 🌐 Deployment
- **Northflank Integration**: نشر سحابي بضغطة زر
- **GitHub Integration**: إنشاء مستودعات تلقائياً
- **Custom Domain**: دعم النطاقات المخصصة

---

## 🛠️ التقنيات

| التقنية | الإصدار | الاستخدام |
|---------|---------|----------|
| Next.js | 16.x | إطار العمل |
| React | 19.x | واجهة المستخدم |
| TypeScript | 5.x | لغة البرمجة |
| Tailwind CSS | 4.x | التنسيقات |
| shadcn/ui | Latest | المكونات |
| Zustand | 5.x | إدارة الحالة |
| z-ai-web-dev-sdk | Latest | SDK للذكاء الاصطناعي |

---

## 📦 التثبيت

```bash
# Clone the repository
git clone https://github.com/yayass3r/ai-code-creator.git

# Navigate to the directory
cd ai-code-creator

# Install dependencies
bun install

# Create .env.local file with your API keys
cp .env.example .env.local

# Run development server
bun run dev
```

---

## 🔑 Environment Variables

Create a `.env.local` file:

```env
# AI API Keys
GROK_API_KEY=your_grok_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
ZAI_API_KEY=your_zai_api_key

# Northflank
NORTHFLANK_API_TOKEN=your_northflank_token
NORTHFLANK_DOMAIN=your_domain

# GitHub
GITHUB_TOKEN=your_github_token
```

---

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── page.tsx          # الواجهة الرئيسية
│   ├── layout.tsx        # التخطيط الأساسي
│   └── api/              # نقاط النهاية API
│       ├── chat/         # محادثة AI
│       ├── generate/     # إنشاء المشاريع
│       ├── deploy/       # النشر
│       └── github/       # تكامل GitHub
├── components/
│   ├── chat/             # مكونات المحادثة
│   ├── editor/           # محرر الكود
│   ├── preview/          # المعاينة
│   └── deploy/           # النشر
├── lib/                  # المكتبات
│   ├── ai-providers.ts   # مزودي AI
│   ├── northflank.ts     # عميل Northflank
│   ├── github.ts         # عميل GitHub
│   └── templates.ts      # قوالب المشاريع
├── store/                # إدارة الحالة
└── types/                # أنواع TypeScript
```

---

## 🎯 Templates المتاحة

| Template | الوصف | الميزات |
|----------|-------|---------|
| Dashboard | لوحة تحكم إدارية | Charts, Tables, Analytics |
| Landing Page | صفحة هبوط | Hero, Features, CTA |
| E-Commerce | متجر إلكتروني | Cart, Products, Checkout |
| Blog | مدونة | MDX, Categories, SEO |
| SaaS | تطبيق SaaS | Pricing, Auth, Subscriptions |
| Portfolio | معرض أعمال | Gallery, About, Contact |

---

## 🚀 النشر

### Docker Compose (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Docker

```bash
# Build image
docker build -t ai-code-creator .

# Run container
docker run -p 3000:3000 --env-file .env.local ai-code-creator
```

### Northflank

1. **Connect Repository**: اربط مستودع GitHub
2. **Create Service**: أنشئ خدمة جديدة
3. **Configure Build**: استخدم Dockerfile
4. **Add Environment Variables**: أضف متغيرات البيئة
5. **Deploy**: انشر المشروع
6. **Custom Domain**: اربط الدومين aicodecer.online

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## 📄 License

MIT License © 2025 AI Code Creator

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  Made with ❤️ by AI Code Creator Team
</div>
