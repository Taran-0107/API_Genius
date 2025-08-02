import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  MagnifyingGlass, 
  Code, 
  Users, 
  Key, 
  ChartBar, 
  User,
  List,
  X
} from 'phosphor-react';

interface NavigationProps {
  onSectionChange: (section: string) => void;
}

const Navigation = ({ onSectionChange }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'home', label: 'Home', icon: MagnifyingGlass, path: '/' },
    { id: 'discovery', label: 'Discovery', icon: MagnifyingGlass, path: '/discovery' },
    { id: 'integration', label: 'Integration', icon: Code, path: '/integration' },
    { id: 'community', label: 'Community', icon: Users, path: '/community' },
    { id: 'keys', label: 'Key Manager', icon: Key, path: '/keys' },
    { id: 'comparison', label: 'Compare', icon: ChartBar, path: '/comparison' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      if (isMenuOpen) {
        gsap.to(menuRef.current, {
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(menuRef.current, {
          x: '100%',
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-40 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center glow-primary">
                <div className="w-6 h-6 bg-foreground rounded-md"></div>
              </div>
              <span className="text-xl font-bold text-gradient">API Genius</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-primary text-primary-foreground glow-primary' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl glass hover:glow-primary transition-all"
            >
              {isMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 h-full w-80 bg-card/95 backdrop-blur-glass border-l border-border z-50 transform translate-x-full lg:hidden"
      >
        <div className="p-6 pt-24">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-primary text-primary-foreground glow-primary' 
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;