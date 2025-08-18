import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from "react-router-dom";
import {apiFetch} from '@/helpers/helper'; // Adjust the import path as necessary
import { 
  MagnifyingGlass, 
  Star, 
  Clock, 
  CurrencyDollar, 
  ShieldCheck, 
  Code, 
  ChartBar, 
  Heart, 
  CloudArrowDown,
  CaretLeft,
  CaretRight
} from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

interface Api {
  id: string;
  name: string;
  category: string;
  description: string;
  homepage_url: string;
  docs_url: string;
  avg_ease_of_use: number | null;
  avg_docs_quality: number | null;
  avg_latency: number | null;
  rating_count: number;
}

interface APIDiscoverySectionProps {
  onSectionChange: (section: string) => void;
  onSelectionChange: (selectedIds: string[]) => void;
  initialQuery?: string;   // NEW
  initialDiscover?: boolean; // NEW
}

const formatNumber = (value: number | null | undefined, decimals: number = 1): string => {
  if (value === null || value === undefined || typeof value !== 'number') {
    return 'N/A';
  }
  return value.toFixed(decimals);
};

const APIDiscoverySection = ({ onSectionChange, onSelectionChange,initialDiscover,initialQuery }: APIDiscoverySectionProps) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAPIs, setSelectedAPIs] = useState<string[]>([]);
  
  const [apis, setApis] = useState<Api[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  // --- Pagination ---
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const [totalApis, setTotalApis] = useState(0);


  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const animationContextRef = useRef<gsap.Context | null>(null);

  const categories = ['all', 'payment', 'weather', 'social', 'ai', 'data', 'finance'];

  // --- Data Fetching Logic ---
  const fetchApis = useCallback(async (discover = false, resetPage = false) => {
    setLoading(true);
    setError(null);
    if (resetPage) setPage(1);
    setLoadingMessage(discover ? `Discovering new APIs for "${searchQuery}"...` : `Searching for "${searchQuery}"...`);

    try {
      let data;
      if (discover) {
        data = await apiFetch('/apis/discover', {
          method: 'POST',
          body: JSON.stringify({ search: searchQuery }),
        });
      } else {
        const endpoint = `/apis/fromdb?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}&page=${page}&per_page=${perPage}`;
        data = await apiFetch(endpoint);
        setTotalApis(data.total_apis || 0);
      }
      setApis(data.apis || []);
    } catch (err: any) {
      console.error("Search Error:", err);
      setError(err.message);
      setApis([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, page, perPage]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  // set query from props on mount
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // once query is set, if initialDiscover is true, run discover
  useEffect(() => {
    if (initialDiscover && searchQuery) {
      fetchApis(true, true);
    }
  }, [initialDiscover, searchQuery, fetchApis]);

  useEffect(() => {
    if (!initialDiscover) {
      fetchApis(false);
    }
  }, [fetchApis,initialDiscover]);


  // --- Animation Effect (Fixed) ---
  useEffect(() => {
    if (animationContextRef.current) {
      animationContextRef.current.revert();
      animationContextRef.current = null;
    }
    if (loading || error || apis.length === 0) return;

    const timeoutId = setTimeout(() => {
      const cardsContainer = cardsRef.current;
      if (!cardsContainer) return;

      const cards = Array.from(cardsContainer.children);
      if (cards.length === 0) return;

      animationContextRef.current = gsap.context(() => {
        gsap.set(cards, { opacity: 0, y: 30, scale: 0.98 });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power2.out',
          delay: 0.1,
          scrollTrigger: {
            trigger: cardsContainer,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none none',
            once: true
          }
        });
      }, cardsContainer);
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [apis, loading, error]);

  useEffect(() => {
    return () => {
      if (animationContextRef.current) {
        animationContextRef.current.revert();
      }
    };
  }, []);

  // --- UI Logic ---
  const toggleAPISelection = (apiId: string) => {
    const newSelection = selectedAPIs.includes(apiId)
      ? selectedAPIs.filter(id => id !== apiId)
      : [...selectedAPIs, apiId];
      
    if (newSelection.length > 3) return;

    setSelectedAPIs(newSelection);
    onSelectionChange(newSelection);
  };
  
  const getDifficultyColor = (easeOfUse: number | null) => {
    if (easeOfUse === null) return 'text-muted-foreground';
    if (easeOfUse >= 4.5) return 'text-green-400';
    if (easeOfUse >= 3.5) return 'text-blue-400';
    if (easeOfUse >= 2.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const totalPages = Math.ceil(totalApis / perPage);

  return (
    <section ref={sectionRef} id="discovery" className="py-24 px-6 min-h-screen" data-scroll-section>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gradient mb-6">Discover Perfect APIs</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI-powered search to find the exact APIs you need for your project.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6 mb-8 sticky top-4 z-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchApis(false, true)}
                placeholder="Search by name, description, or tags..."
                className="w-full pl-12 pr-4 py-3 bg-input rounded-xl border border-border focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
                <button onClick={() => fetchApis(false, true)} className="btn-glass flex items-center space-x-2">
                    <MagnifyingGlass size={20} />
                    <span>Search</span>
                </button>
                <button onClick={() => fetchApis(true, true)} className="btn-neon flex items-center space-x-2">
                    <CloudArrowDown size={20} />
                    <span>Discover New</span>
                </button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-center mt-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 py-2 rounded-xl transition-all capitalize ${
                  selectedCategory === category
                    ? 'bg-gradient-primary text-primary-foreground glow-primary'
                    : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {selectedAPIs.length > 1 && (
            <div className="mt-4 flex justify-center">
              <button onClick={() => onSectionChange('comparison')} className="btn-neon flex items-center space-x-2">
                <ChartBar size={20} />
                <span>Compare Selected APIs ({selectedAPIs.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Loading, Error, and Content Display */}
        <div 
          ref={cardsRef} 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          style={{ minHeight: loading ? '400px' : 'auto' }}
        >
          {loading ? (
            <div className="lg:col-span-2 text-center py-20">
              <div className="w-16 h-16 mx-auto border-4 border-muted border-t-primary rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">{loadingMessage}</p>
            </div>
          ) : error ? (
            <div className="lg:col-span-2 text-center py-20 bg-red-500/10 rounded-xl">
              <h3 className="text-xl font-semibold mb-2 text-red-400">An Error Occurred</h3>
              <pre className="text-red-300 text-left p-4 bg-black/20 rounded-md overflow-x-auto"><code>{error}</code></pre>
            </div>
          ) : apis.length > 0 ? (
            apis.map((api) => (
              <div
                key={api.id}
                className={`glass-card transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                  selectedAPIs.includes(api.id) ? 'neon-border-primary glow-primary' : ''
                }`}
                onClick={() => toggleAPISelection(api.id)}
                style={{ 
                  opacity: 1,
                  transform: 'translateY(0) scale(1)'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{api.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-400" size={16} weight="fill" />
                        <span className="text-sm text-muted-foreground">{api.rating_count} reviews</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{api.description}</p>
                  </div>
                   <button
                    onClick={(e) => { e.stopPropagation(); toggleAPISelection(api.id); }}
                    className={`p-2 rounded-xl transition-all ${selectedAPIs.includes(api.id) ? 'text-red-400 hover:text-red-300' : 'text-muted-foreground hover:text-primary'}`}
                   >
                    <Heart size={20} weight={selectedAPIs.includes(api.id) ? 'fill' : 'regular'} />
                  </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 border-t border-border/20 pt-4">
                    <Metric icon={<Clock size={16} />} value={api.avg_latency ? `${Math.round(api.avg_latency)}ms` : 'N/A'} label="Latency" />
                    <Metric icon={<ShieldCheck size={16} />} value={`${formatNumber(api.avg_docs_quality)}/5`} label="Docs" />
                    <Metric icon={<Code size={16} />} value={api.avg_ease_of_use && typeof api.avg_ease_of_use === 'number' ? `${formatNumber(api.avg_ease_of_use)}/5` : 'N/A'} label="Ease of Use" color={getDifficultyColor(api.avg_ease_of_use)} />
                    <Metric icon={<CurrencyDollar size={16} />} value="Varies" label="Pricing" />
                </div>
                <div className="flex gap-3 mt-auto">
                  <button onClick={(e) => { e.stopPropagation(); onSectionChange('integration'); }} className="flex-1 btn-neon text-sm py-2">Generate Code</button>
                  <a href={api.docs_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 btn-glass text-sm py-2 text-center">View Docs</a>
                </div>
              </div>
            ))
          ) : (
            <div className="lg:col-span-2 text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted/20 rounded-full flex items-center justify-center">
                <MagnifyingGlass size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">No APIs found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or category filter.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn-glass flex items-center gap-2 disabled:opacity-50"
            >
              <CaretLeft size={18} /> Prev
            </button>
            <span className="text-lg font-medium text-foreground">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="btn-glass flex items-center gap-2 disabled:opacity-50"
            >
              Next <CaretRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// Sub-component for displaying metrics in the API card
const Metric = ({ icon, value, label, color = 'text-accent' }: { icon: React.ReactNode, value: string, label: string, color?: string }) => (
    <div className="text-center">
        <div className={`flex items-center justify-center space-x-1 ${color}`}>
            {icon}
            <span className="text-sm font-medium">{value}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
);

export default APIDiscoverySection;
