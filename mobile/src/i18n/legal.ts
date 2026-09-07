// Mirrors messages/{pt,en,ar}.json's `privacy` and `terms` namespaces on
// the web app. Kept as a separate mobile-side copy since the web app's
// JSON isn't reachable from the Metro bundler without a shared package.

type LegalSection = { heading: string; body: string };
type LegalContent = { title: string; intro: string; sections: LegalSection[] };

export const legalContent: Record<'pt' | 'en' | 'ar', { privacidade: LegalContent; termos: LegalContent }> = {
  pt: {
    privacidade: {
      title: 'Política de Privacidade',
      intro:
        'Esta Política de Privacidade explica como a Braga Event recolhe, utiliza e protege as informações dos visitantes da nossa aplicação. Ao utilizares a app, concordas com as práticas aqui descritas.',
      sections: [
        {
          heading: '1. Informação que recolhemos',
          body: 'A Braga Event é uma app de descoberta de eventos gratuita e aberta ao público. Não é necessário criar conta para consultar eventos. Podemos recolher dados técnicos não identificativos, como o tipo de dispositivo e idioma preferido, para melhorar a experiência da app.',
        },
        {
          heading: '2. Notificações push',
          body: 'Se ativares as notificações, guardamos um identificador de dispositivo (token push) para te podermos enviar alertas sobre novos eventos em destaque. Podes desativar esta funcionalidade em qualquer momento nas Definições.',
        },
        {
          heading: '3. Partilha de dados',
          body: 'Não vendemos nem partilhamos dados pessoais com terceiros para fins de marketing.',
        },
        {
          heading: '4. Os teus direitos',
          body: 'Tens o direito de solicitar informação sobre os dados que possamos ter recolhido, bem como a sua correção ou eliminação, através dos contactos disponíveis no site.',
        },
      ],
    },
    termos: {
      title: 'Termos e Condições',
      intro:
        'Ao utilizar a aplicação Braga Event, aceitas os termos e condições descritos abaixo.',
      sections: [
        {
          heading: '1. Sobre a app',
          body: 'A Braga Event é uma app pública e gratuita de descoberta de eventos na cidade de Braga, Portugal.',
        },
        {
          heading: '2. Conteúdo',
          body: 'O conteúdo apresentado (eventos, datas, preços, locais) é fornecido a título informativo e gerido exclusivamente pela administração da plataforma.',
        },
        {
          heading: '3. Limitação de responsabilidade',
          body: 'A Braga Event esforça-se por manter a informação atualizada e precisa, mas não garante a exatidão ou disponibilidade contínua do serviço.',
        },
      ],
    },
  },
  en: {
    privacidade: {
      title: 'Privacy Policy',
      intro:
        'This Privacy Policy explains how Braga Event collects, uses and protects visitor information in our app. By using the app, you agree to the practices described here.',
      sections: [
        {
          heading: '1. Information we collect',
          body: 'Braga Event is a free, public event-discovery app. No account is required to browse events. We may collect non-identifying technical data, such as device type and preferred language, to improve the app experience.',
        },
        {
          heading: '2. Push notifications',
          body: "If you enable notifications, we store a device identifier (push token) to send you alerts about new featured events. You can disable this at any time in Settings.",
        },
        {
          heading: '3. Data sharing',
          body: 'We do not sell or share personal data with third parties for marketing purposes.',
        },
        {
          heading: '4. Your rights',
          body: 'You have the right to request information about any data we may have collected, as well as its correction or deletion, through the contact details available on the website.',
        },
      ],
    },
    termos: {
      title: 'Terms & Conditions',
      intro: 'By using the Braga Event app, you accept the terms and conditions described below.',
      sections: [
        {
          heading: '1. About the app',
          body: 'Braga Event is a free, public event-discovery app for the city of Braga, Portugal.',
        },
        {
          heading: '2. Content',
          body: 'The content shown (events, dates, prices, locations) is provided for informational purposes and is managed exclusively by the platform administration.',
        },
        {
          heading: '3. Limitation of liability',
          body: 'Braga Event strives to keep information up to date and accurate but does not guarantee the accuracy or continuous availability of the service.',
        },
      ],
    },
  },
  ar: {
    privacidade: {
      title: 'سياسة الخصوصية',
      intro:
        'توضح سياسة الخصوصية هذه كيف تجمع Braga Event معلومات الزوار في تطبيقنا وتستخدمها وتحميها. باستخدامك للتطبيق، فإنك توافق على الممارسات المذكورة هنا.',
      sections: [
        {
          heading: '1. المعلومات التي نجمعها',
          body: 'Braga Event هو تطبيق مجاني وعام لاكتشاف الفعاليات. لا حاجة لإنشاء حساب لتصفح الفعاليات. قد نجمع بيانات تقنية غير معرِّفة، مثل نوع الجهاز واللغة المفضلة، لتحسين تجربة التطبيق.',
        },
        {
          heading: '2. الإشعارات',
          body: 'إذا فعّلت الإشعارات، فإننا نخزّن معرّف جهاز (رمز إشعار) لإرسال تنبيهات لك حول الفعاليات المميزة الجديدة. يمكنك تعطيل هذا في أي وقت من الإعدادات.',
        },
        {
          heading: '3. مشاركة البيانات',
          body: 'لا نبيع أو نشارك البيانات الشخصية مع أطراف ثالثة لأغراض تسويقية.',
        },
        {
          heading: '4. حقوقك',
          body: 'لديك الحق في طلب معلومات عن أي بيانات قد نكون جمعناها، وكذلك تصحيحها أو حذفها.',
        },
      ],
    },
    termos: {
      title: 'الشروط والأحكام',
      intro: 'باستخدامك لتطبيق Braga Event، فإنك توافق على الشروط والأحكام المذكورة أدناه.',
      sections: [
        {
          heading: '1. عن التطبيق',
          body: 'Braga Event هو تطبيق عام ومجاني لاكتشاف الفعاليات في مدينة براغا، البرتغال.',
        },
        {
          heading: '2. المحتوى',
          body: 'المحتوى المعروض (الفعاليات، التواريخ، الأسعار، الأماكن) يُقدَّم لأغراض إعلامية ويُدار بشكل حصري من قِبل إدارة المنصة.',
        },
        {
          heading: '3. تحديد المسؤولية',
          body: 'تسعى Braga Event للحفاظ على معلومات دقيقة ومحدّثة، لكنها لا تضمن دقة أو استمرارية توفر الخدمة.',
        },
      ],
    },
  },
};
