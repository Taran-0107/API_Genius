import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Plus, 
  ThumbsUp, 
  ThumbsDown,
  ChatCircle, 
  Eye,
  Tag,
  Calendar
} from 'phosphor-react';
import { apiFetch, apiFetchWithAuth } from '@/helpers/helper';

gsap.registerPlugin(ScrollTrigger);

const CommunitySection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [newQuestion, setNewQuestion] = useState({ title: '', body: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showMyQuestions, setShowMyQuestions] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const postsRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch logged-in user from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  // ✅ Fetch questions from backend
  const fetchQuestions = async () => {
    try {
      const res = await apiFetch(`/questions?per_page=10&page=1&search=${encodeURIComponent(searchQuery)}`);
      const mapped = res.questions.map((q: any) => ({
        id: q.id,
        type: 'question',
        title: q.title,
        author: q.username,
        user_id: q.user_id,
        avatar: '❓',
        content: q.body_md,
        tags: [],
        upvotes: q.upvotes,
        downvotes: q.downvotes,
        replies: q.answer_count,
        views: 0,
        resolved: q.resolved,
        timeAgo: new Date(q.created_at).toLocaleDateString(),
        isAnswered: q.answer_count > 0
      }));
      setPosts(mapped);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [searchQuery]);

  useEffect(() => {
    const posts = postsRef.current?.children;
    if (!posts) return;

    gsap.fromTo(
      posts,
      { opacity: 0, y: 50, scale: 0.95 },
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
  }, [posts]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'question':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  // ✅ Vote handler
  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    try {
      await apiFetchWithAuth('/votes', {
        method: 'POST',
        body: JSON.stringify({
          entity_type: 'question',
          entity_id: postId,
          vote_type: voteType
        })
      });
      fetchQuestions();
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  // ✅ View answers
  const fetchAnswers = async (questionId: string) => {
    try {
      const res = await apiFetch(`/answers/${questionId}`);
      setAnswers(res.answers);
    } catch (err) {
      console.error('Failed to fetch answers:', err);
    }
  };

  // ✅ Submit answer
  const submitAnswer = async () => {
    if (!selectedPost || !newAnswer.trim()) return;
    try {
      await apiFetchWithAuth('/answers', {
        method: 'POST',
        body: JSON.stringify({
          question_id: selectedPost.id,
          body_md: newAnswer
        })
      });
      setNewAnswer('');
      fetchAnswers(selectedPost.id);
      fetchQuestions();
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };

  // ✅ Post new question
  const submitQuestion = async () => {
    if (!newQuestion.title.trim() || !newQuestion.body.trim()) return;
    try {
      await apiFetchWithAuth('/questions', {
        method: 'POST',
        body: JSON.stringify({
          title: newQuestion.title,
          body_md: newQuestion.body
        })
      });
      setNewQuestion({ title: '', body: '' });
      fetchQuestions();
    } catch (err) {
      console.error('Failed to post question:', err);
    }
  };

  // ✅ Toggle resolved
  const handleToggleResolved = async (postId: string, resolved: boolean) => {
    try {
      await apiFetchWithAuth(`/questions/${postId}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ resolved })
      });
      fetchQuestions();
    } catch (err) {
      console.error('Failed to toggle resolved:', err);
    }
  };

  // Filter my questions if enabled
  const displayedPosts = showMyQuestions && currentUser
    ? posts.filter(p => p.user_id === currentUser.id)
    : posts;

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

        {/* Search & Filters */}
        <div className="flex items-center justify-between mb-6 space-x-4">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-background/50 border border-muted text-sm"
          />
          {currentUser && (
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showMyQuestions}
                onChange={(e) => setShowMyQuestions(e.target.checked)}
              />
              <span>Only My Questions</span>
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* New Post */}
            <div className="glass-card p-4 space-y-3">
              <h3 className="text-lg font-semibold">Ask a Question</h3>
              <input
                type="text"
                placeholder="Title"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background/50 border border-muted text-sm"
              />
              <textarea
                placeholder="Describe your question..."
                value={newQuestion.body}
                onChange={(e) => setNewQuestion({ ...newQuestion, body: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background/50 border border-muted text-sm"
              />
              <button onClick={submitQuestion} className="w-full btn-neon flex items-center justify-center space-x-2">
                <Plus size={20} />
                <span>Post Question</span>
              </button>
            </div>

            {/* Stats */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Posts</span>
                  <span className="font-medium">{posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Solved Issues</span>
                  <span className="font-medium">
                    {posts.filter(p => p.resolved).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="lg:col-span-3">
            <div ref={postsRef} className="space-y-6">
              {displayedPosts.map((post) => (
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
                      {post.type} {post.resolved && <span className="ml-1 text-green-400">(Resolved)</span>}
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

                  {/* Post Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleVote(post.id, 'up')}
                        className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ThumbsUp size={16} />
                        <span className="text-sm">{post.upvotes}</span>
                      </button>
                      <button
                        onClick={() => handleVote(post.id, 'down')}
                        className="flex items-center space-x-1 text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        <ThumbsDown size={16} />
                        <span className="text-sm">{post.downvotes}</span>
                      </button>
                      <button
                        onClick={() => { setSelectedPost(post); fetchAnswers(post.id); }}
                        className="flex items-center space-x-1 text-muted-foreground hover:text-secondary transition-colors"
                      >
                        <ChatCircle size={16} />
                        <span className="text-sm">{post.replies}</span>
                      </button>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Eye size={16} />
                        <span className="text-sm">{post.views}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {currentUser && currentUser.id === post.user_id && (
                        <button
                          onClick={() => handleToggleResolved(post.id, !post.resolved)}
                          className="btn-glass text-sm"
                        >
                          {post.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                        </button>
                      )}
                      <button
                        onClick={() => { setSelectedPost(post); fetchAnswers(post.id); }}
                        className="btn-glass text-sm"
                      >
                        View Thread
                      </button>
                    </div>
                  </div>

                  {/* Answers Section */}
                  {selectedPost?.id === post.id && (
                    <div className="mt-4 p-4 border-t border-muted space-y-4">
                      <h4 className="font-semibold">Answers</h4>
                      {answers.map((ans) => (
                        <div key={ans.id} className="p-3 rounded-lg bg-muted/20">
                          <p className="text-sm text-foreground">{ans.body_md}</p>
                          <span className="text-xs text-muted-foreground">— {ans.username}</span>
                        </div>
                      ))}

                      <div className="flex space-x-2 mt-3">
                        <input
                          type="text"
                          value={newAnswer}
                          onChange={(e) => setNewAnswer(e.target.value)}
                          placeholder="Write your answer..."
                          className="flex-1 px-3 py-2 rounded-lg bg-background/50 border border-muted text-sm"
                        />
                        <button onClick={submitAnswer} className="btn-neon px-4">Submit</button>
                      </div>
                    </div>
                  )}
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
