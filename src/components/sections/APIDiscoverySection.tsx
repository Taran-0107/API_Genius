import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  MagnifyingGlass, 
  Star, 
  Clock, 
  CurrencyDollar, 
  Shield,
  Code,
  ChartBar,
  Heart
} from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

interface APIDiscoverySectionProps {
  onSectionChange: (section: string) => void;
}

const APIDiscoverySection = ({ onSectionChange }: APIDiscoverySectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAPIs, setSelectedAPIs] = useState<string[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const categories = ['all', 'payment', 'weather', 'social', 'ai', 'data'];

  const mockAPIs = [
    {
      id: '1',
      name: 'Stripe Payments',
      category: 'payment',
      description: 'Complete payment processing solution with global reach and developer-friendly APIs.',
      pricing: '$0.029 per transaction',
      rating: 4.9,
      responseTime: '95ms avg',
      uptime: '99.99%',
      documentation: 'Excellent',
      easeOfIntegration: 'Very Easy',
      tags: ['payments', 'subscriptions', 'marketplace']
    },
    {
      id: '2',
      name: 'OpenWeatherMap',
      category: 'weather',
      description: 'Comprehensive weather data API with forecasts, historical data, and weather maps.',
      pricing: 'Free tier available',
      rating: 4.7,
      responseTime: '120ms avg',
      uptime: '99.9%',
      documentation: 'Good',
      easeOfIntegration: 'Easy',
      tags: ['weather', 'forecast', 'climate']
    },
    {
      id: '3',
      name: 'OpenAI GPT-4',
      category: 'ai',
      description: 'Advanced language model for text generation, analysis, and conversation.',
      pricing: '$0.03 per 1K tokens',
      rating: 4.8,
      responseTime: '2.1s avg',
      uptime: '99.5%',
      documentation: 'Excellent',
      easeOfIntegration: 'Moderate',
      tags: ['ai', 'nlp', 'generation']
    },
    {
      id: '4',
      name: 'Twitter API v2',
      category: 'social',
      description: 'Access tweets, user data, and real-time social media analytics.',
      pricing: 'Tiered pricing',
      rating: 4.2,
      responseTime: '180ms avg',
      uptime: '99.7%',
      documentation: 'Good',
      easeOfIntegration: 'Moderate',
      tags: ['social', 'analytics', 'real-time']
    },
    {
      id: '5',
      name: 'Alpha Vantage',
      category: 'data',
      description: 'Real-time and historical stock market data, forex, and cryptocurrency.',
      pricing: 'Free tier available',
      rating: 4.5,
      responseTime: '90ms avg',
      uptime: '99.8%',
      documentation: 'Good',
      easeOfIntegration: 'Easy',
      tags: ['finance', 'stocks', 'crypto']
    },
    {
      id: '6',
      name: 'PayPal Checkout',
      category: 'payment',
      description: 'Trusted payment solution with buyer protection and global acceptance.',
      pricing: '2.9% + $0.30 per transaction',
      rating: 4.6,
      responseTime: '110ms avg',
      uptime: '99.95%',
      documentation: 'Excellent',
      easeOfIntegration: 'Easy',
      tags: ['payments', 'checkout', 'global']
    }
  ];

  const filteredAPIs = mockAPIs.filter(api => {
    const matchesCategory = selectedCategory === 'all' || api.category === selectedCategory;
    const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         api.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         api.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const cards = cardsRef.current?.children;
    if (!cards) return;

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 60,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, [filteredAPIs]);

  const toggleAPISelection = (apiId: string) => {
    setSelectedAPIs(prev => {
      if (prev.includes(apiId)) {
        return prev.filter(id => id !== apiId);
      } else if (prev.length < 3) {
        return [...prev, apiId];
      }
      return prev;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Very Easy':
        return 'text-green-400';
      case 'Easy':
        return 'text-blue-400';
      case 'Moderate':
        return 'text-yellow-400';
      case 'Hard':
        return 'text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <section
      ref={sectionRef}
      id="discovery"
      className="py-24 px-6 min-h-screen"
      data-scroll-section
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gradient mb-6">
            Discover Perfect APIs
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI-powered search to find the exact APIs you need for your project
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search APIs by name, description, or tags..."
                className="w-full pl-12 pr-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-xl transition-all capitalize
                    ${selectedCategory === category
                      ? 'bg-gradient-primary text-primary-foreground glow-primary'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Compare Button */}
          {selectedAPIs.length > 1 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => onSectionChange('comparison')}
                className="btn-neon flex items-center space-x-2"
              >
                <ChartBar size={20} />
                <span>Compare Selected APIs ({selectedAPIs.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* API Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAPIs.map((api) => (
            <div
              key={api.id}
              className={`
                glass-card transition-all duration-300 hover:scale-[1.02] cursor-pointer
                ${selectedAPIs.includes(api.id) ? 'neon-border-primary glow-primary' : ''}
              `}
              onClick={() => toggleAPISelection(api.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{api.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-400" size={16} weight="fill" />
                      <span className="text-sm text-muted-foreground">{api.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {api.description}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAPISelection(api.id);
                  }}
                  className={`
                    p-2 rounded-xl transition-all
                    ${selectedAPIs.includes(api.id)
                      ? 'text-red-400 hover:text-red-300'
                      : 'text-muted-foreground hover:text-primary'
                    }
                  `}
                >
                  <Heart size={20} weight={selectedAPIs.includes(api.id) ? 'fill' : 'regular'} />
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-accent">
                    <Clock size={16} />
                    <span className="text-sm font-medium">{api.responseTime}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Response Time</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-green-400">
                    <Shield size={16} />
                    <span className="text-sm font-medium">{api.uptime}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Uptime</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-secondary">
                    <Code size={16} />
                    <span className={`text-sm font-medium ${getDifficultyColor(api.easeOfIntegration)}`}>
                      {api.easeOfIntegration}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Integration</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-primary">
                    <CurrencyDollar size={16} />
                    <span className="text-sm font-medium">{api.pricing}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Pricing</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {api.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSectionChange('integration');
                  }}
                  className="flex-1 btn-neon text-sm py-2"
                >
                  Generate Code
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open documentation
                  }}
                  className="flex-1 btn-glass text-sm py-2"
                >
                  View Docs
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAPIs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted/20 rounded-full flex items-center justify-center">
              <MagnifyingGlass size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No APIs found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or category filter
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default APIDiscoverySection;