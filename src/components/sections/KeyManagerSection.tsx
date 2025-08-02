import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Key, 
  Plus, 
  Eye, 
  EyeSlash, 
  Copy, 
  Trash,
  Shield,
  Warning,
  CheckCircle,
  Calendar
} from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

const KeyManagerSection = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const mockKeys = [
    {
      id: '1',
      name: 'Stripe Production',
      service: 'Stripe',
      environment: 'production',
      keyType: 'Secret Key',
      keyPreview: 'sk_live_****',
      status: 'active',
      lastUsed: '2 hours ago',
      createdAt: '2024-01-15',
      permissions: ['payments', 'webhooks', 'customers']
    },
    {
      id: '2',
      name: 'OpenAI Development',
      service: 'OpenAI',
      environment: 'development',
      keyType: 'API Key',
      keyPreview: 'sk-****',
      status: 'active',
      lastUsed: '5 minutes ago',
      createdAt: '2024-01-20',
      permissions: ['chat', 'completions', 'embeddings']
    },
    {
      id: '3',
      name: 'Weather API',
      service: 'OpenWeatherMap',
      environment: 'production',
      keyType: 'API Key',
      keyPreview: 'a1b2****',
      status: 'active',
      lastUsed: '1 day ago',
      createdAt: '2024-01-10',
      permissions: ['current', 'forecast', 'historical']
    },
    {
      id: '4',
      name: 'Deprecated Twillio',
      service: 'Twilio',
      environment: 'production',
      keyType: 'Auth Token',
      keyPreview: 'AC****',
      status: 'expired',
      lastUsed: '2 weeks ago',
      createdAt: '2023-12-01',
      permissions: ['sms', 'voice', 'video']
    }
  ];

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
  }, []);

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'expired':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production':
        return 'text-red-400 bg-red-500/20';
      case 'staging':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'development':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} />;
      case 'expired':
        return <Warning size={16} />;
      default:
        return <Shield size={16} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="keys"
      className="py-24 px-6 min-h-screen"
      data-scroll-section
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gradient mb-6">
            API Key Manager
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Securely store and manage your API keys with enterprise-grade encryption
          </p>
        </div>

        {/* Key Management Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-neon flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add New Key</span>
            </button>
            <button className="btn-glass flex items-center space-x-2">
              <Shield size={20} />
              <span>Import Keys</span>
            </button>
          </div>
          
          <div className="glass px-4 py-2 rounded-xl">
            <span className="text-sm text-muted-foreground">
              Total Keys: {mockKeys.length} | Active: {mockKeys.filter(k => k.status === 'active').length}
            </span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="glass-card mb-8 border-l-4 border-primary">
          <div className="flex items-start space-x-3">
            <Shield className="text-primary mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Security First</h3>
              <p className="text-sm text-muted-foreground">
                All API keys are encrypted using AES-256 encryption and stored securely. 
                Keys are never transmitted in plain text and are only decrypted when needed for integration.
              </p>
            </div>
          </div>
        </div>

        {/* API Keys Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="glass-card transition-all duration-300 hover:scale-[1.02] hover:glow-primary"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Key className="text-primary-foreground" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{apiKey.name}</h3>
                    <p className="text-sm text-muted-foreground">{apiKey.service}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg border text-xs ${getStatusColor(apiKey.status)}`}>
                  {getStatusIcon(apiKey.status)}
                  <span className="capitalize">{apiKey.status}</span>
                </div>
              </div>

              {/* Key Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Environment</span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getEnvironmentColor(apiKey.environment)}`}>
                    {apiKey.environment}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium">{apiKey.keyType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Used</span>
                  <span className="text-sm font-medium">{apiKey.lastUsed}</span>
                </div>
              </div>

              {/* Key Value */}
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">API Key</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-input px-4 py-3 rounded-xl border border-border font-mono text-sm">
                    {visibleKeys.has(apiKey.id) 
                      ? 'sk_live_51234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
                      : apiKey.keyPreview
                    }
                  </div>
                  <button
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="p-3 btn-glass"
                  >
                    {visibleKeys.has(apiKey.id) ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                  <button className="p-3 btn-glass">
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              {/* Permissions */}
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">Permissions</label>
                <div className="flex flex-wrap gap-2">
                  {apiKey.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="px-2 py-1 bg-muted/30 text-muted-foreground text-xs rounded-lg"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  <span>Created {apiKey.createdAt}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-glass text-sm px-3 py-2">
                    Edit
                  </button>
                  <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Key Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="glass-card max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-6">Add New API Key</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Key Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Stripe Production"
                    className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Service</label>
                  <select className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all">
                    <option>Select Service</option>
                    <option>Stripe</option>
                    <option>OpenAI</option>
                    <option>OpenWeatherMap</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Environment</label>
                  <select className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all">
                    <option>Development</option>
                    <option>Staging</option>
                    <option>Production</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <input
                    type="password"
                    placeholder="Paste your API key here"
                    className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all font-mono"
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-glass px-6"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-neon px-6"
                  >
                    Add Key
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default KeyManagerSection;