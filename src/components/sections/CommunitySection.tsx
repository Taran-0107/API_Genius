import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Users, 
  Plus, 
  ThumbsUp, 
  ChatCircle, 
  Star,
  Eye,
  Tag,
  Calendar
} from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

const CommunitySection = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const sectionRef = useRef<HTMLDivElement>(null);
  const postsRef = useRef<HTMLDivElement>(null);

  const filters = ['all', 'questions', 'discussions', 'tutorials', 'issues'];

  const mockPosts = [
    {
      id: '1',
      type: 'question',
      title: 'How to handle Stripe webhook verification in production?',
      author: 'Sarah Chen',
      avatar: '👩‍💻',
      content: 'I\'m struggling with webhook signature verification in my Node.js app. Getting 401 errors consistently...',
      tags: ['stripe', 'webhooks', 'nodejs', 'security'],
      votes: 12,
      replies: 5,
      views: 234,
      timeAgo: '2 hours ago',
      isAnswered: false
    },
    {
      id: '2',
      type: 'discussion',
      title: 'Best practices for API key rotation in microservices',
      author: 'Alex Kumar',
      avatar: '👨‍🔬',
      content: 'What\'s your strategy for rotating API keys across multiple services without downtime?',
      tags: ['security', 'microservices', 'best-practices'],
      votes: 28,
      replies: 11,
      views: 567,
      timeAgo: '5 hours ago',
      isAnswered: true
    },
    {
      id: '3',
      type: 'tutorial',
      title: 'Building a real-time weather dashboard with OpenWeatherMap',
      author: 'Mike Rodriguez',
      avatar: '🌦️',
      content: 'Step-by-step guide to create a beautiful weather dashboard using React and OpenWeatherMap API...',
      tags: ['tutorial', 'react', 'weather-api', 'dashboard'],
      votes: 45,
      replies: 8,
      views: 1203,
      timeAgo: '1 day ago',
      isAnswered: true
    },
    {
      id: '4',
      type: 'issue',
      title: 'OpenAI API rate limiting - unexpected behavior',
      author: 'Emma Watson',
      avatar: '🤖',
      content: 'Experiencing inconsistent rate limiting with GPT-4 API. Sometimes getting 429 errors below the stated limits...',
      tags: ['openai', 'rate-limiting', 'api-issues'],
      votes: 8,
      replies: 3,
      views: 156,
      timeAgo: '3 hours ago',
      isAnswered: false
    }
  ];

  const filteredPosts = mockPosts.filter(post => 
    selectedFilter === 'all' || post.type === selectedFilter
  );

  useEffect(() => {
    const posts = postsRef.current?.children;
    if (!posts) return;

    gsap.fromTo(
      posts,
      {
        opacity: 0,
        y: 50,
        scale: 0.95
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
  }, [filteredPosts]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'question':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'discussion':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'tutorial':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'issue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <section
      ref={sectionRef}
      id="community"
      className="py-24 px-6 min-h-screen"
      data-scroll-section
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gradient mb-6">
            Developer Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with fellow developers, share knowledge, and get help with API integrations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* New Post Button */}
            <button className="w-full btn-neon flex items-center justify-center space-x-2">
              <Plus size={20} />
              <span>New Post</span>
            </button>

            {/* Filters */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`
                      w-full text-left px-3 py-2 rounded-xl transition-all capitalize
                      ${selectedFilter === filter
                        ? 'bg-gradient-primary text-primary-foreground glow-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Posts</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="font-medium">456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Solved Issues</span>
                  <span className="font-medium">789</span>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="lg:col-span-3">
            <div ref={postsRef} className="space-y-6">
              {filteredPosts.map((post) => (
                <div key={post.id} className="glass-card hover:glow-primary transition-all duration-300 cursor-pointer">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-lg">
                        {post.avatar}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{post.author}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar size={12} />
                          <span>{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg border text-xs font-medium ${getTypeColor(post.type)}`}>
                      {post.type}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2 text-foreground hover:text-primary transition-colors">
                      {post.title}
                      {post.isAnswered && (
                        <span className="ml-2 text-green-400">✓</span>
                      )}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center space-x-1 px-2 py-1 bg-muted/30 text-muted-foreground text-xs rounded-lg hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer"
                      >
                        <Tag size={10} />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsUp size={16} />
                        <span className="text-sm">{post.votes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-muted-foreground hover:text-secondary transition-colors">
                        <ChatCircle size={16} />
                        <span className="text-sm">{post.replies}</span>
                      </button>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Eye size={16} />
                        <span className="text-sm">{post.views}</span>
                      </div>
                    </div>
                    <button className="btn-glass text-sm">
                      View Thread
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="btn-neon">
                Load More Posts
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;