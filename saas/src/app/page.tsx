import Link from 'next/link';

export default function LandingPage() {
  const features = [
    'Chronométrage haute précision',
    'Analyse ergonomique professionnelle',
    'Rapports automatiques avec graphiques',
    'Templates par secteur d\'activité',
    'Conformité normes ISO et EN',
    'Mode hors ligne et synchronisation',
    'Export PDF et Excel',
    'Gestion d\'équipe collaborative',
  ];

  const plans = [
    {
      name: 'Gratuit',
      price: '0',
      description: 'Parfait pour découvrir',
      features: [
        '3 sessions par mois',
        '1 utilisateur',
        'Analyses basiques',
        'Export PDF limité',
        'Support communautaire',
      ],
      cta: 'Commencer gratuitement',
      href: '/signup',
      popular: false,
    },
    {
      name: 'Pro',
      price: '29',
      description: 'Pour les professionnels',
      features: [
        'Sessions illimitées',
        'Jusqu\'à 5 utilisateurs',
        'Analytics avancés',
        'Templates métiers',
        'Export illimité',
        'Support email',
        'Intégrations API',
      ],
      cta: 'Essai gratuit 14 jours',
      href: '/signup?plan=pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '99',
      description: 'Pour les organisations',
      features: [
        'Utilisateurs illimités',
        'White-label complet',
        'API complète',
        'Formation équipe',
        'Support prioritaire',
        'Conformité avancée',
        'SSO et sécurité',
      ],
      cta: 'Contacter les ventes',
      href: '/contact',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ActoGraph Pro
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Commencer
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Analyse Ergonomique
            <br />
            Professionnelle
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
            La plateforme SaaS de référence pour l'analyse ergonomique, le chronométrage et l'optimisation des postes de travail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Essai gratuit 14 jours</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <button className="border border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:shadow-lg transition-all duration-300">
              Voir la démo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Une solution complète pour l'analyse ergonomique, de la capture à l'export des rapports.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300">
                <svg className="w-8 h-8 text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="font-semibold text-slate-900">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-xl text-slate-600">
              Choisissez le plan qui correspond à vos besoins
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 border ${
                  plan.popular
                    ? 'border-blue-300 shadow-xl scale-105'
                    : 'border-white/20 hover:shadow-lg'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Le plus populaire
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-slate-900">{plan.price}€</span>
                    {plan.price !== '0' && <span className="text-slate-600">/mois</span>}
                  </div>
                  <p className="text-slate-600">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold">ActoGraph Pro</span>
            </div>
            <div className="flex space-x-8">
              <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                Confidentialité
              </Link>
              <Link href="/terms" className="hover:text-blue-400 transition-colors">
                Conditions
              </Link>
              <Link href="/contact" className="hover:text-blue-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 mt-8 text-center text-slate-400">
            <p>&copy; 2024 ActoGraph Pro. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
