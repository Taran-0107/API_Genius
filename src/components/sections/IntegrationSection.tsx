import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Code, 
  Copy, 
  Download, 
  Play, 
  Key,
  CheckCircle,
  Warning,
  Globe
} from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

interface IntegrationSectionProps {
  onSectionChange: (section: string) => void;
}

const IntegrationSection = ({ onSectionChange }: IntegrationSectionProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedAPI, setSelectedAPI] = useState('stripe');
  const [apiKey, setApiKey] = useState('');
  const [showKeyManager, setShowKeyManager] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟡' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'php', name: 'PHP', icon: '🐘' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'csharp', name: 'C#', icon: '🔷' },
    { id: 'ruby', name: 'Ruby', icon: '💎' }
  ];

  const apis = [
    { id: 'stripe', name: 'Stripe Payments', status: 'active' },
    { id: 'openai', name: 'OpenAI GPT-4', status: 'deprecated' },
    { id: 'weather', name: 'OpenWeatherMap', status: 'active' }
  ];

  const codeExamples = {
    javascript: {
      stripe: `// Stripe Payment Integration
import Stripe from 'stripe';

const stripe = new Stripe('${apiKey || 'sk_test_your_stripe_key'}');

// Create a payment intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000, // $20.00
  currency: 'usd',
  metadata: {
    order_id: '12345'
  }
});

// Handle the payment on frontend
const { error } = await stripe.confirmCardPayment(
  paymentIntent.client_secret,
  {
    payment_method: {
      card: elements.getElement(CardElement),
      billing_details: {
        name: 'Customer Name'
      }
    }
  }
);

if (error) {
  console.error('Payment failed:', error);
} else {
  console.log('Payment succeeded!');
}`,
      openai: `// OpenAI GPT-4 Integration
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '${apiKey || 'your_openai_api_key'}'
});

// Generate text completion
const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system", 
      content: "You are a helpful assistant."
    },
    {
      role: "user", 
      content: "Explain quantum computing in simple terms"
    }
  ],
  max_tokens: 150,
  temperature: 0.7
});

console.log(completion.choices[0].message.content);`,
      weather: `// OpenWeatherMap Integration
const API_KEY = '${apiKey || 'your_weather_api_key'}';

// Get current weather
const getCurrentWeather = async (city) => {
  const response = await fetch(
    \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${API_KEY}&units=metric\`
  );
  
  const data = await response.json();
  
  return {
    temperature: data.main.temp,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed
  };
};

// Usage
const weather = await getCurrentWeather('New York');
console.log(\`Temperature: \${weather.temperature}°C\`);`
    },
    python: {
      stripe: `# Stripe Payment Integration
import stripe

stripe.api_key = "${apiKey || 'sk_test_your_stripe_key'}"

# Create a payment intent
payment_intent = stripe.PaymentIntent.create(
    amount=2000,  # $20.00
    currency='usd',
    metadata={
        'order_id': '12345'
    }
)

print(f"Payment Intent: {payment_intent.id}")`,
      openai: `# OpenAI GPT-4 Integration
from openai import OpenAI

client = OpenAI(api_key="${apiKey || 'your_openai_api_key'}")

# Generate text completion
completion = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing in simple terms"}
    ],
    max_tokens=150,
    temperature=0.7
)

print(completion.choices[0].message.content)`,
      weather: `# OpenWeatherMap Integration
import requests

API_KEY = "${apiKey || 'your_weather_api_key'}"

def get_current_weather(city):
    url = f"https://api.openweathermap.org/data/2.5/weather"
    params = {
        'q': city,
        'appid': API_KEY,
        'units': 'metric'
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    return {
        'temperature': data['main']['temp'],
        'description': data['weather'][0]['description'],
        'humidity': data['main']['humidity'],
        'wind_speed': data['wind']['speed']
    }

# Usage
weather = get_current_weather('New York')
print(f"Temperature: {weather['temperature']}°C")`
    }
  };

  useEffect(() => {
    if (codeRef.current) {
      gsap.fromTo(
        codeRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }, [selectedLanguage, selectedAPI]);

  const copyToClipboard = () => {
    const code = codeExamples[selectedLanguage as keyof typeof codeExamples][selectedAPI as keyof typeof codeExamples.javascript];
    navigator.clipboard.writeText(code);
    // Show toast notification
  };

  const getAPIStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'deprecated':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getAPIStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} />;
      case 'deprecated':
        return <Warning size={16} />;
      default:
        return null;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="integration"
      className="py-24 px-6 min-h-screen"
      data-scroll-section
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gradient mb-6">
            Code Integration
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Generate production-ready code in your preferred language with secure API key injection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* API Selection */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Code className="text-primary" size={20} />
                <span>Select API</span>
              </h3>
              <div className="space-y-2">
                {apis.map((api) => (
                  <button
                    key={api.id}
                    onClick={() => setSelectedAPI(api.id)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-xl transition-all
                      ${selectedAPI === api.id
                        ? 'bg-gradient-primary text-primary-foreground glow-primary'
                        : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                      }
                    `}
                  >
                    <span className="font-medium">{api.name}</span>
                    <div className={`flex items-center space-x-1 ${getAPIStatusColor(api.status)}`}>
                      {getAPIStatusIcon(api.status)}
                      <span className="text-xs capitalize">{api.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Globe className="text-secondary" size={20} />
                <span>Language</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`
                      flex items-center space-x-2 p-3 rounded-xl transition-all
                      ${selectedLanguage === lang.id
                        ? 'bg-gradient-secondary text-secondary-foreground glow-secondary'
                        : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                      }
                    `}
                  >
                    <span>{lang.icon}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* API Key Management */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Key className="text-accent" size={20} />
                <span>API Key</span>
              </h3>
              <div className="space-y-3">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="w-full px-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all"
                />
                <button
                  onClick={() => onSectionChange('keys')}
                  className="w-full btn-glass text-sm"
                >
                  Manage Keys Securely
                </button>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-2">
            <div className="glass-card h-full">
              {/* Code Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {apis.find(api => api.id === selectedAPI)?.name} - {languages.find(lang => lang.id === selectedLanguage)?.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="btn-glass text-sm flex items-center space-x-2"
                  >
                    <Copy size={16} />
                    <span>Copy</span>
                  </button>
                  <button className="btn-glass text-sm flex items-center space-x-2">
                    <Download size={16} />
                    <span>Export</span>
                  </button>
                  <button className="btn-neon text-sm flex items-center space-x-2">
                    <Play size={16} />
                    <span>Test</span>
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div ref={codeRef} className="relative">
                <pre className="bg-card/50 rounded-xl p-6 overflow-x-auto text-sm font-mono">
                  <code className="text-foreground whitespace-pre-wrap">
                    {codeExamples[selectedLanguage as keyof typeof codeExamples][selectedAPI as keyof typeof codeExamples.javascript]}
                  </code>
                </pre>

                {/* API Status Warning */}
                {apis.find(api => api.id === selectedAPI)?.status === 'deprecated' && (
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <div className="flex items-center space-x-2 text-yellow-400">
                      <Warning size={20} />
                      <span className="font-medium">API Deprecated</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      This API version is deprecated. Consider migrating to the latest version.
                    </p>
                  </div>
                )}
              </div>

              {/* Integration Help */}
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-semibold mb-3">Next Steps:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button className="btn-glass text-sm text-left p-3">
                    <div className="font-medium mb-1">1. Install Dependencies</div>
                    <div className="text-xs text-muted-foreground">npm install stripe</div>
                  </button>
                  <button className="btn-glass text-sm text-left p-3">
                    <div className="font-medium mb-1">2. Configure Environment</div>
                    <div className="text-xs text-muted-foreground">Add API keys to .env</div>
                  </button>
                  <button className="btn-glass text-sm text-left p-3">
                    <div className="font-medium mb-1">3. Test Integration</div>
                    <div className="text-xs text-muted-foreground">Run in sandbox mode</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;