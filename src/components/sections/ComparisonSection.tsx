import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ChartBar, 
  Clock, 
  CurrencyDollar, 
  Shield,
  Star,
  CheckCircle,
  X,
  TrendUp,
  Code
} from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

const ComparisonSection = () => {
  const [viewMode, setViewMode] = useState<'visual' | 'table'>('visual');
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);

  const comparisonAPIs = [
    {
      id: '1',
      name: 'Stripe',
      category: 'Payment',
      cost: 4.5,
      latency: 95,
      successRate: 99.9,
      docsScore: 9.5,
      userRating: 4.9,
      easeOfIntegration: 9,
      support: 'Excellent',
      pricing: '2.9% + $0.30',
      features: ['Global reach', 'Webhooks', 'Dashboard', 'Mobile SDKs'],
      pros: ['Excellent documentation', 'Global coverage', 'Great developer experience'],
      cons: ['Higher fees for some regions', 'Complex for simple use cases']
    },
    {
      id: '2',
      name: 'PayPal',
      category: 'Payment',
      cost: 4.0,
      latency: 120,
      successRate: 99.7,
      docsScore: 7.5,
      userRating: 4.6,
      easeOfIntegration: 7,
      support: 'Good',
      pricing: '2.9% + $0.30',
      features: ['Buyer protection', 'Global brand', 'Multiple payment methods'],
      pros: ['Trusted brand', 'Buyer protection', 'Wide acceptance'],
      cons: ['Less developer-friendly', 'Limited customization']
    },
    {
      id: '3',
      name: 'Square',
      category: 'Payment',
      cost: 3.8,
      latency: 110,
      successRate: 99.8,
      docsScore: 8.0,
      userRating: 4.5,
      easeOfIntegration: 8,
      support: 'Good',
      pricing: '2.6% + $0.10',
      features: ['POS integration', 'Inventory management', 'Analytics'],
      pros: ['Lower fees', 'Good for retail', 'Integrated ecosystem'],
      cons: ['US-focused', 'Limited international support']
    }
  ];

  const metrics = [
    { key: 'cost', label: 'Cost Efficiency', icon: CurrencyDollar, color: 'text-green-400', unit: '/10' },
    { key: 'latency', label: 'Response Time', icon: Clock, color: 'text-blue-400', unit: 'ms' },
    { key: 'successRate', label: 'Success Rate', icon: CheckCircle, color: 'text-green-400', unit: '%' },
    { key: 'docsScore', label: 'Documentation', icon: Code, color: 'text-purple-400', unit: '/10' },
    { key: 'userRating', label: 'User Rating', icon: Star, color: 'text-yellow-400', unit: '/5' },
    { key: 'easeOfIntegration', label: 'Integration Ease', icon: TrendUp, color: 'text-accent', unit: '/10' }
  ];

  useEffect(() => {
    const charts = chartsRef.current?.children;
    if (!charts) return;

    gsap.fromTo(
      charts,
      {
        opacity: 0,
        y: 60,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, [viewMode]);

  const getScoreColor = (score: number, max: number = 10) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBarWidth = (score: number, max: number = 10) => {
    return `${(score / max) * 100}%`;
  };

  return (
    <section
      ref={sectionRef}
      id="comparison"
      className="py-24 px-6 min-h-screen"
      data-scroll-section
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gradient mb-6">
            API Comparison
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Compare APIs side-by-side with detailed metrics, pricing, and performance data
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="glass p-1 rounded-xl">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-6 py-3 rounded-xl transition-all ${
                viewMode === 'visual'
                  ? 'bg-gradient-primary text-primary-foreground glow-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Visual Comparison
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-6 py-3 rounded-xl transition-all ${
                viewMode === 'table'
                  ? 'bg-gradient-primary text-primary-foreground glow-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Detailed Table
            </button>
          </div>
        </div>

        {viewMode === 'visual' ? (
          /* Visual Comparison */
          <div ref={chartsRef} className="space-y-8">
            {/* Radar Chart Placeholder */}
            <div className="glass-card text-center py-16">
              <ChartBar className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-xl font-semibold mb-2">Performance Radar Chart</h3>
              <p className="text-muted-foreground">
                Interactive radar chart comparing all metrics across selected APIs
              </p>
            </div>

            {/* Metric Comparisons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.key} className="glass-card">
                    <div className="flex items-center space-x-3 mb-6">
                      <Icon className={metric.color} size={24} />
                      <h3 className="text-lg font-semibold">{metric.label}</h3>
                    </div>

                    <div className="space-y-4">
                      {comparisonAPIs.map((api) => {
                        const value = api[metric.key as keyof typeof api] as number;
                        const isLatency = metric.key === 'latency';
                        const max = metric.key === 'userRating' ? 5 : 
                                   metric.key === 'successRate' ? 100 : 
                                   metric.key === 'latency' ? 200 : 10;
                        
                        return (
                          <div key={api.id}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{api.name}</span>
                              <span className={`font-semibold ${getScoreColor(value, max)}`}>
                                {value}{metric.unit}
                              </span>
                            </div>
                            <div className="w-full bg-muted/30 rounded-full h-2">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  isLatency ? 'bg-red-400' : 'bg-gradient-primary'
                                }`}
                                style={{ 
                                  width: isLatency 
                                    ? `${100 - (value / max) * 100}%` 
                                    : getScoreBarWidth(value, max)
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Table Comparison */
          <div className="glass-card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold">API</th>
                  <th className="text-center py-4 px-6 font-semibold">Pricing</th>
                  <th className="text-center py-4 px-6 font-semibold">Response Time</th>
                  <th className="text-center py-4 px-6 font-semibold">Success Rate</th>
                  <th className="text-center py-4 px-6 font-semibold">Docs Quality</th>
                  <th className="text-center py-4 px-6 font-semibold">User Rating</th>
                  <th className="text-center py-4 px-6 font-semibold">Support</th>
                </tr>
              </thead>
              <tbody>
                {comparisonAPIs.map((api, index) => (
                  <tr 
                    key={api.id} 
                    className={`border-b border-border hover:bg-muted/20 transition-colors ${
                      index === 0 ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                          <span className="text-primary-foreground font-semibold text-sm">
                            {api.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold">{api.name}</div>
                          <div className="text-sm text-muted-foreground">{api.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-medium">{api.pricing}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={getScoreColor(200 - api.latency, 200)}>
                        {api.latency}ms
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={getScoreColor(api.successRate, 100)}>
                        {api.successRate}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <span className={getScoreColor(api.docsScore)}>
                          {api.docsScore}
                        </span>
                        <span className="text-muted-foreground">/10</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="text-yellow-400" size={16} weight="fill" />
                        <span>{api.userRating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        api.support === 'Excellent' 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {api.support}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detailed Analysis */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {comparisonAPIs.map((api) => (
            <div key={api.id} className="glass-card">
              <h3 className="text-xl font-semibold mb-4">{api.name}</h3>
              
              {/* Features */}
              <div className="mb-4">
                <h4 className="font-medium mb-2 text-muted-foreground">Key Features</h4>
                <div className="space-y-1">
                  {api.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="text-green-400" size={14} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros */}
              <div className="mb-4">
                <h4 className="font-medium mb-2 text-green-400">Pros</h4>
                <div className="space-y-1">
                  {api.pros.map((pro, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="text-green-400 mt-0.5" size={12} />
                      <span className="text-muted-foreground">{pro}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons */}
              <div>
                <h4 className="font-medium mb-2 text-red-400">Cons</h4>
                <div className="space-y-1">
                  {api.cons.map((con, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <X className="text-red-400 mt-0.5" size={12} />
                      <span className="text-muted-foreground">{con}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;