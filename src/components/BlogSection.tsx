import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { BlogPost } from '../types';
import { MultiImageInput } from './MultiImageInput';
import { ScrollReveal, EXPO_EASE } from './MotionPrimitives';
import { toSentenceCase } from '../utils/formatText';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Eye,
  Tag,
  Phone,
  Image as ImageIcon,
  Sun,
  Cpu,
  BatteryCharging,
  ShieldCheck
} from 'lucide-react';

const DEFAULT_BLOG_CATEGORIES = [
  'Kinh nghiệm điện mặt trời',
  'Kỹ thuật & lắp đặt',
  'Giải pháp tiết kiệm điện',
  'Chính sách & giá điện',
  'Tin tức Đức Vinh Solar'
];

// Clean fallback cover illustration in Apple Frosted Bubble + SolaX Power Theme
const BlogCoverIllustration: React.FC<{ category: string; index: number }> = ({
  category,
  index
}) => {
  const catLower = (category || '').toLowerCase();
  const isTech = catLower.includes('kỹ thuật') || catLower.includes('lắp đặt');
  const isSaving = catLower.includes('tiết kiệm') || catLower.includes('giá điện');

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#FEFBF3] via-[#FAF5EA] to-[#FFF2D0] relative overflow-hidden flex flex-col items-center justify-center p-6 text-[#1C1C1C] select-none">
      {/* Subtle solar grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 text-[#FFBD00] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`blog-grid-${index}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#blog-grid-${index})`} />
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl apple-glass-pill flex items-center justify-center mb-3">
          {isTech ? (
            <Cpu className="w-7 h-7 text-[#FF7C00]" />
          ) : isSaving ? (
            <BatteryCharging className="w-7 h-7 text-[#FF7C00]" />
          ) : (
            <Sun className="w-7 h-7 text-[#FFBD00]" />
          )}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF7C00]">
          CẨM NANG KỸ THUẬT SOLAR
        </span>
        <span className="text-[10px] text-[#747474] mt-1">
          Đức Vinh Solar · Năng lượng xanh
        </span>
      </div>
    </div>
  );
};

export const BlogSection: React.FC = () => {
  const {
    blogPosts,
    companyInfo,
    isAdmin,
    currentPage,
    selectedBlogPost,
    openBlogPostPage,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost
  } = useApp();

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalImageIdx, setModalImageIdx] = useState<number>(0);

  // Admin Inline Add / Edit Form State
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(DEFAULT_BLOG_CATEGORIES[0]);
  const [formAuthor, setFormAuthor] = useState('Kỹ sư Đức Vinh Solar');
  const [formPublishedAt, setFormPublishedAt] = useState('');
  const [formReadTime, setFormReadTime] = useState('5 phút đọc');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTagsText, setFormTagsText] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);

  // Available categories across blogPosts (deduplicated case-insensitively)
  const blogCategories = useMemo(() => {
    const map = new Map<string, string>();
    DEFAULT_BLOG_CATEGORIES.forEach((c) => {
      map.set(c.toLowerCase(), c);
    });
    (blogPosts || []).forEach((bp) => {
      if (bp?.category) {
        const clean = toSentenceCase(bp.category.trim());
        const key = clean.toLowerCase();
        if (!map.has(key)) {
          map.set(key, clean);
        }
      }
    });
    return Array.from(map.values());
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return blogPosts || [];
    return (blogPosts || []).filter(
      (bp) => (bp.category || '').trim().toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [blogPosts, selectedCategory]);

  const getPostImages = (post: BlogPost): string[] => {
    if (Array.isArray(post.images) && post.images.length > 0) {
      return post.images.filter(Boolean);
    }
    if (post.imageUrl) {
      return [post.imageUrl];
    }
    return [];
  };

  // Horizontal Slider Controls
  const handleSlide = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const scrollAmount = Math.max(340, Math.round(container.clientWidth * 0.78));
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Transition to Full-Screen Article Page
  const handleOpenPost = (post: BlogPost) => {
    setModalImageIdx(0);
    openBlogPostPage(post);
  };

  // Close Full-Screen Article Page back to Blog List
  const handleClosePostPage = () => {
    setModalImageIdx(0);
    openBlogPostPage(null);
  };

  // Open Admin Add Blog Form
  const handleOpenAddBlog = () => {
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;

    setEditingPost(null);
    setFormTitle('');
    setFormCategory(DEFAULT_BLOG_CATEGORIES[0]);
    setFormAuthor('Kỹ sư Đức Vinh Solar');
    setFormPublishedAt(dateStr);
    setFormReadTime('5 phút đọc');
    setFormSummary('');
    setFormContent('');
    setFormTagsText('Điện mặt trời, Đức Vinh Solar, tiết kiệm điện');
    setFormImages([]);
    setShowBlogForm(true);
  };

  // Open Admin Edit Blog Form
  const handleOpenEditBlog = (post: BlogPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPost(post);
    setFormTitle(post.title || '');
    setFormCategory(toSentenceCase(post.category || DEFAULT_BLOG_CATEGORIES[0]));
    setFormAuthor(toSentenceCase(post.author || 'Kỹ sư Đức Vinh Solar'));
    setFormPublishedAt(post.publishedAt || '');
    setFormReadTime(post.readTime || '5 phút đọc');
    setFormSummary(post.summary || '');
    setFormContent(post.content || '');
    setFormTagsText(Array.isArray(post.tags) ? post.tags.join(', ') : '');
    setFormImages(getPostImages(post));
    setShowBlogForm(true);
  };

  const handleSaveBlogForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const tagsList = formTagsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const summaryClean =
      formSummary.trim() ||
      formContent
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 180) + '...';

    if (editingPost) {
      const updatedFields: Partial<BlogPost> = {
        title: formTitle.trim(),
        category: formCategory.trim() || 'Kinh nghiệm điện mặt trời',
        author: formAuthor.trim() || 'Kỹ sư Đức Vinh Solar',
        publishedAt: formPublishedAt.trim() || '2026',
        readTime: formReadTime.trim() || '5 phút đọc',
        summary: summaryClean,
        content: formContent.trim() || summaryClean,
        tags: tagsList.length > 0 ? tagsList : ['Điện mặt trời'],
        images: formImages,
        imageUrl: formImages[0] || undefined
      };
      updateBlogPost(editingPost.id, updatedFields);
    } else {
      addBlogPost({
        title: formTitle.trim(),
        category: formCategory.trim() || 'Kinh nghiệm điện mặt trời',
        author: formAuthor.trim() || 'Kỹ sư Đức Vinh Solar',
        publishedAt: formPublishedAt.trim() || '2026',
        readTime: formReadTime.trim() || '5 phút đọc',
        summary: summaryClean,
        content: formContent.trim() || summaryClean,
        tags: tagsList.length > 0 ? tagsList : ['Điện mặt trời'],
        images: formImages,
        imageUrl: formImages[0] || undefined
      });
    }

    setShowBlogForm(false);
    setEditingPost(null);
  };

  const handleDeleteBlog = (post: BlogPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    deleteBlogPost(post.id, () => {
      if (selectedBlogPost?.id === post.id) {
        openBlogPostPage(null);
      }
    });
  };

  const allPosts = blogPosts || [];
  const currentPostIndex = selectedBlogPost
    ? allPosts.findIndex((p) => p.id === selectedBlogPost.id)
    : -1;
  const relatedPosts = selectedBlogPost
    ? allPosts.filter((p) => p.id !== selectedBlogPost.id).slice(0, 3)
    : [];

  // Render Admin Inline Add/Edit Form helper
  const renderAdminBlogForm = () => {
    if (!isAdmin || !showBlogForm) return null;
    return (
      <div className="mb-10 bg-white border border-[#DEDEDE] shadow-sm rounded-3xl p-6 animate-in fade-in duration-150">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#DEDEDE]">
          <h3 className="text-base font-bold text-[#1C1C1C] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#FF7C00]" />
            <span>
              {editingPost
                ? `Chỉnh sửa bài viết: ${toSentenceCase(editingPost.title)}`
                : 'Thêm bài viết blog mới'}
            </span>
          </h3>
          <button
            type="button"
            onClick={() => {
              setShowBlogForm(false);
              setEditingPost(null);
            }}
            className="p-1 text-[#747474] hover:text-[#1C1C1C] rounded-full bg-[#F8F8F8] border border-[#DEDEDE]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveBlogForm} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1C1C1C] mb-1">
                Tiêu đề bài viết *
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="VD: Kinh nghiệm lắp điện mặt trời Hybrid 10kWp cho gia đình..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#DEDEDE] rounded-full focus:outline-hidden focus:border-[#FFBD00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1C1C] mb-1">
                Chuyên mục bài viết *
              </label>
              <input
                type="text"
                required
                list="blog-category-suggestions"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="Chọn hoặc nhập chuyên mục..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#DEDEDE] rounded-full focus:outline-hidden focus:border-[#FFBD00]"
              />
              <datalist id="blog-category-suggestions">
                {blogCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1C1C] mb-1">
                Tác giả / bộ phận
              </label>
              <input
                type="text"
                value={formAuthor}
                onChange={(e) => setFormAuthor(e.target.value)}
                placeholder="VD: Kỹ sư Đức Vinh Solar"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DEDEDE] rounded-full focus:outline-hidden focus:border-[#FFBD00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1C1C] mb-1">
                Ngày đăng
              </label>
              <input
                type="text"
                value={formPublishedAt}
                onChange={(e) => setFormPublishedAt(e.target.value)}
                placeholder="VD: 03/11/2026"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DEDEDE] rounded-full focus:outline-hidden focus:border-[#FFBD00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1C1C] mb-1">
                Thời gian đọc
              </label>
              <input
                type="text"
                value={formReadTime}
                onChange={(e) => setFormReadTime(e.target.value)}
                placeholder="VD: 5 phút đọc"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DEDEDE] rounded-full focus:outline-hidden focus:border-[#FFBD00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1C1C] mb-1">
              Mô tả tóm tắt ngắn (hiển thị trên thẻ trượt ngang)
            </label>
            <textarea
              rows={2}
              value={formSummary}
              onChange={(e) => setFormSummary(e.target.value)}
              placeholder="Tóm tắt 1-2 câu chính của bài viết để thu hút người đọc..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#DEDEDE] rounded-2xl focus:outline-hidden focus:border-[#FFBD00]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1C1C] mb-1">
              Nội dung chi tiết bài viết * (hỗ trợ xuống dòng nhiều đoạn văn)
            </label>
            <textarea
              rows={8}
              required
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Nhập toàn bộ nội dung bài viết chi tiết tại đây..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#DEDEDE] rounded-2xl focus:outline-hidden focus:border-[#FFBD00] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1C1C] mb-1">
              Từ khóa chủ đề (cách nhau bởi dấu phẩy)
            </label>
            <input
              type="text"
              value={formTagsText}
              onChange={(e) => setFormTagsText(e.target.value)}
              placeholder="VD: Điện mặt trời Hybrid, biến tần Deye, pin lưu trữ"
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#DEDEDE] rounded-full focus:outline-hidden focus:border-[#FFBD00]"
            />
          </div>

          <MultiImageInput
            images={formImages}
            onChange={setFormImages}
            label="Hình ảnh bài viết blog (tải nhiều ảnh từ máy hoặc dán link)"
            helperText="Ảnh đầu tiên sẽ làm ảnh bìa trên thanh trượt ngang. Tất cả các ảnh sẽ hiển thị đầy đủ khi người đọc ấn vào xem bài viết."
          />

          <div className="pt-4 border-t border-[#DEDEDE] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowBlogForm(false);
                setEditingPost(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-[#747474] bg-[#F8F8F8] border border-[#DEDEDE] rounded-full"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white rounded-full flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{editingPost ? 'Lưu cập nhật bài viết' : 'Đăng bài viết mới'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  };

  // ================= FULL-SCREEN STANDALONE ARTICLE PAGE =================
  if (currentPage === 'blog' && selectedBlogPost) {
    const imgs = getPostImages(selectedBlogPost);
    const safeIdx = imgs.length > 0 ? Math.min(modalImageIdx, imgs.length - 1) : 0;

    return (
      <section className="min-h-[calc(100vh-5rem)] py-6 sm:py-10 bg-white">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Top Navigation & Admin Action Bar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClosePostPage}
              className="apple-glass-pill px-4 py-2.5 rounded-full text-[#1C1C1C] hover:bg-[#FFF2D0] text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#FF7C00]" />
              <span>Quay lại tất cả bài viết blog</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => handleOpenEditBlog(selectedBlogPost)}
                    className="px-3.5 py-2 rounded-full bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sửa bài viết</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBlog(selectedBlogPost)}
                    className="px-3.5 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa bài</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Inline Admin Edit Form if opened on this page */}
          {renderAdminBlogForm()}

          {/* Full-Screen Article Card as Apple Frosted Glass Bubble */}
          <article className="apple-glass-card rounded-3xl sm:rounded-[2.25rem] overflow-hidden">
            {/* Article Header Banner */}
            <div className="px-5 sm:px-10 pt-6 sm:pt-10 pb-6 bg-gradient-to-r from-[#FEFBF3] via-[#FAF5EA] to-white border-b border-black/6">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-[#FF7C00] uppercase tracking-wide mb-3">
                <BookOpen className="w-4 h-4 text-[#FF7C00] shrink-0" />
                <span>{(selectedBlogPost.category || '').toUpperCase()}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1C1C] font-heading leading-tight">
                {toSentenceCase(selectedBlogPost.title)}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#747474]">
                <span className="flex items-center gap-1.5 font-semibold text-[#363636]">
                  <User className="w-4 h-4 text-[#FF7C00]" />
                  {toSentenceCase(selectedBlogPost.author)}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#FF7C00]" />
                  Ngày đăng: {selectedBlogPost.publishedAt}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FF7C00]" />
                  {selectedBlogPost.readTime}
                </span>
              </div>
            </div>

            {/* Article Main Body */}
            <div className="p-5 sm:p-10 space-y-7">
              {/* Article Image Gallery or Fallback Cover */}
              {imgs.length > 0 ? (
                <div className="space-y-3">
                  <div className="apple-glass-inner relative rounded-2xl overflow-hidden aspect-16/9 max-h-[540px] flex items-center justify-center">
                    <img
                      src={imgs[safeIdx]}
                      alt={toSentenceCase(selectedBlogPost.title)}
                      className="w-full h-full object-contain"
                    />
                    {imgs.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setModalImageIdx((prev) => (prev - 1 + imgs.length) % imgs.length)
                          }
                          className="apple-glass-pill absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full text-[#1C1C1C] flex items-center justify-center"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setModalImageIdx((prev) => (prev + 1) % imgs.length)
                          }
                          className="apple-glass-pill absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full text-[#1C1C1C] flex items-center justify-center"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {imgs.length > 1 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                      {imgs.map((imgUrl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setModalImageIdx(i)}
                          className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                            safeIdx === i
                              ? 'border-[#FFBD00] ring-2 ring-[#FFBD00]/40'
                              : 'border-white/80 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="apple-glass-inner rounded-2xl overflow-hidden aspect-16/7 max-h-[340px]">
                  <BlogCoverIllustration
                    category={selectedBlogPost.category}
                    index={Math.max(0, currentPostIndex)}
                  />
                </div>
              )}

              {/* Highlighted Lead Summary */}
              {selectedBlogPost.summary && (
                <div className="p-5 rounded-2xl bg-[#FEFBF3] border border-[#FFBD00]/50 text-sm sm:text-base font-medium text-[#1C1C1C] leading-relaxed">
                  {selectedBlogPost.summary}
                </div>
              )}

              {/* Full Article Body Paragraphs */}
              <div className="space-y-4 text-base sm:text-lg text-[#363636] leading-relaxed">
                {(selectedBlogPost.content || '')
                  .split('\n')
                  .map((line, i) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <div key={i} className="h-1.5" />;

                    const isHeading = /^\d+\./.test(trimmed);
                    const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•');

                    if (isHeading) {
                      return (
                        <h2
                          key={i}
                          className="text-lg sm:text-xl font-bold text-[#1C1C1C] pt-3 font-heading"
                        >
                          {toSentenceCase(trimmed)}
                        </h2>
                      );
                    }

                    if (isBullet) {
                      return (
                        <div key={i} className="flex items-start gap-3 pl-2">
                          <span className="w-2 h-2 rounded-full bg-[#FFBD00] mt-2.5 shrink-0" />
                          <span>{trimmed.replace(/^[-•]\s*/, '')}</span>
                        </div>
                      );
                    }

                    return <p key={i}>{trimmed}</p>;
                  })}
              </div>

              {/* Article Tags */}
              {Array.isArray(selectedBlogPost.tags) && selectedBlogPost.tags.length > 0 && (
                <div className="pt-5 border-t border-black/6 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#747474]">
                  <Tag className="w-4 h-4 text-[#FF7C00]" />
                  <span className="font-semibold text-[#1C1C1C]">Chủ đề:</span>
                  {selectedBlogPost.tags.map((t, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span aria-hidden="true">·</span>}
                      <span className="text-[#FF7C00] font-semibold">{toSentenceCase(t)}</span>
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* Consultation CTA inside Full-Screen Blog Page */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FEFBF3] via-[#FAF5EA] to-[#FFF2D0]/60 border border-[#FFBD00]/50 text-[#1C1C1C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FF7C00] uppercase">
                    <ShieldCheck className="w-4 h-4 text-[#FF7C00]" />
                    <span>TƯ VẤN KỸ THUẬT MIỄN PHÍ 24/7</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#363636] mt-1">
                    Cần tư vấn cấu hình điện mặt trời hoặc báo giá sỉ/lẻ thiết bị tại kho tổng Đức Vinh Solar?
                  </p>
                </div>
                <a
                  href={`https://zalo.me/${companyInfo.hotlineZalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white font-extrabold text-xs sm:text-sm rounded-full shrink-0 flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Zalo kỹ thuật: {companyInfo.hotlineZalo}</span>
                </a>
              </div>
            </div>

            {/* Bottom Prev / Next Article Navigation Bar */}
            <div className="px-5 sm:px-10 py-4 bg-white/60 border-t border-black/6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {currentPostIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => handleOpenPost(allPosts[currentPostIndex - 1])}
                    className="apple-glass-pill px-4 py-2 text-xs sm:text-sm font-bold text-[#1C1C1C] hover:bg-[#FFF2D0] rounded-full flex items-center gap-1.5 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#FF7C00]" />
                    <span>Bài viết trước</span>
                  </button>
                )}
                {currentPostIndex >= 0 && currentPostIndex < allPosts.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleOpenPost(allPosts[currentPostIndex + 1])}
                    className="apple-glass-pill px-4 py-2 text-xs sm:text-sm font-bold text-[#1C1C1C] hover:bg-[#FFF2D0] rounded-full flex items-center gap-1.5 transition-colors"
                  >
                    <span>Bài viết tiếp theo</span>
                    <ChevronRight className="w-4 h-4 text-[#FF7C00]" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleClosePostPage}
                className="px-5 py-2 text-xs sm:text-sm font-bold bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white rounded-full transition-colors"
              >
                Xem tất cả bài viết blog
              </button>
            </div>
          </article>

          {/* Related Blog Posts Section with Apple Frosted Glass Bubble Cards */}
          {relatedPosts.length > 0 && (
            <div className="mt-10 relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#1C1C1C] font-heading uppercase">
                  BÀI VIẾT KHÁC CÓ THỂ BẠN QUAN TÂM
                </h2>
                <button
                  type="button"
                  onClick={handleClosePostPage}
                  className="text-xs sm:text-sm font-bold text-[#FF7C00] hover:text-[#1C1C1C] flex items-center gap-1"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedPosts.map((post, idx) => {
                  const postImages = getPostImages(post);
                  const coverImg = postImages[0];
                  return (
                    <motion.div
                      key={post.id}
                      whileHover={{ y: -6 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleOpenPost(post)}
                      className="apple-glass-card rounded-[2rem] p-3 flex flex-col justify-between cursor-pointer group overflow-hidden"
                    >
                      <div>
                        <div className="apple-glass-inner relative aspect-16/10 rounded-[1.4rem] overflow-hidden mb-3">
                          {coverImg ? (
                            <img
                              src={coverImg}
                              alt={toSentenceCase(post.title)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <BlogCoverIllustration category={post.category} index={idx} />
                          )}
                        </div>
                        <div className="px-1.5">
                          <span className="text-[11px] font-bold text-[#FF7C00]">
                            {toSentenceCase(post.category)}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-[#1C1C1C] group-hover:text-[#FF7C00] line-clamp-2 mt-1 font-heading">
                            {toSentenceCase(post.title)}
                          </h3>
                        </div>
                      </div>
                      <div className="px-1.5 pt-3 mt-2 border-t border-black/6 flex items-center justify-between text-xs text-[#747474]">
                        <span>{post.publishedAt}</span>
                        <span className="apple-glass-pill px-3 py-1 rounded-full font-bold text-[#1C1C1C] group-hover:bg-[#FFBD00] transition-colors">
                          Đọc tiếp &rarr;
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="blog-section" className="py-8 sm:py-14 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header + Slider Navigation Controls */}
        <ScrollReveal y={22}>
          <div className="bg-gradient-to-r from-[#FEFBF3] via-[#FAF5EA] to-white border border-[#DEDEDE] shadow-[0_8px_24px_-10px_rgba(28,28,28,0.06)] rounded-[2rem] sm:rounded-[2.25rem] p-5 sm:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-5 mb-6 overflow-hidden">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF7C00] tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-white border border-[#DEDEDE]">
                <BookOpen className="w-4 h-4 text-[#FF7C00] shrink-0" />
                <span className="truncate">GÓC CHIA SẺ KỸ THUẬT &amp; KINH NGHIỆM SOLAR</span>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1C1C] font-heading uppercase break-words">
                BLOG BÀI VIẾT &amp; CẨM NANG NĂNG LƯỢNG MẶT TRỜI
              </h2>
              <p className="text-xs sm:text-sm text-[#747474] mt-2 max-w-2xl break-words">
                Trượt ngang để chọn bài viết chuyên sâu về kinh nghiệm chọn tấm pin, biến tần Hybrid, pin lưu trữ Lithium và giải pháp tiết kiệm điện thực tế. Ấn vào từng bài viết để chuyển sang trang đọc toàn màn hình.
              </p>
            </div>

            {/* Right Controls: Admin Add Button + Horizontal Slide Left/Right */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleOpenAddBlog}
                  className="px-4 py-2 bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm bài viết mới</span>
                </button>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSlide('left')}
                  className="px-3.5 sm:px-4 py-2 rounded-full bg-white border border-[#DEDEDE] hover:bg-[#FFF2D0] hover:border-[#FFBD00] text-[#1C1C1C] text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Trượt sang trái"
                >
                  <ChevronLeft className="w-4 h-4 text-[#FF7C00]" />
                  <span>Trượt trái</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSlide('right')}
                  className="px-3.5 sm:px-4 py-2 rounded-full bg-white border border-[#DEDEDE] hover:bg-[#FFF2D0] hover:border-[#FFBD00] text-[#1C1C1C] text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Trượt sang phải"
                >
                  <span>Trượt phải</span>
                  <ChevronRight className="w-4 h-4 text-[#FF7C00]" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Category Filter Bar */}
        <ScrollReveal y={14} delay={0.08}>
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#FFBD00] text-[#1C1C1C] shadow-2xs'
                  : 'bg-[#F8F8F8] border border-[#DEDEDE] text-[#363636] hover:bg-[#FEFBF3]'
              }`}
            >
              Tất cả bài viết ({(blogPosts || []).length})
            </button>
            {blogCategories.map((cat) => {
              const count = (blogPosts || []).filter(
                (p) => (p.category || '').trim().toLowerCase() === cat.toLowerCase()
              ).length;
              if (count === 0 && !isAdmin) return null;
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#FFBD00] text-[#1C1C1C] shadow-2xs'
                      : 'bg-[#F8F8F8] border border-[#DEDEDE] text-[#363636] hover:bg-[#FEFBF3]'
                  }`}
                >
                  {toSentenceCase(cat)} ({count})
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Admin Inline Add / Edit Blog Post Form */}
        {renderAdminBlogForm()}

        {/* Horizontal Carousel Container with Apple Frosted Glass Bubble Effect (identical to Product Cards) */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-[#DEDEDE] rounded-3xl p-10 text-center max-w-lg mx-auto">
            <BookOpen className="w-8 h-8 text-[#FF7C00] mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#1C1C1C]">
              Chưa có bài viết nào trong chuyên mục này
            </h3>
            <p className="text-xs text-[#747474] mt-1 mb-4">
              Hãy chọn chuyên mục khác hoặc thêm bài viết mới.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="px-4 py-2 text-xs font-bold bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white rounded-full transition-colors"
              >
                Xem tất cả bài viết
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleOpenAddBlog}
                  className="px-4 py-2 text-xs font-bold text-[#1C1C1C] bg-[#F8F8F8] border border-[#DEDEDE] rounded-full"
                >
                  + Thêm bài viết mới
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Soft Ambient Light Blobs behind Blog Cards so Apple Frosted Glass refracts warm SolaX depth */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-4 -inset-y-6 -z-10 overflow-hidden rounded-[2.5rem]"
            >
              <div className="absolute -top-12 left-8 w-80 h-80 rounded-full bg-[#FFBD00]/16 blur-3xl" />
              <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-[#FF7C00]/10 blur-3xl" />
              <div className="absolute bottom-2 left-1/3 w-80 h-80 rounded-full bg-[#FFF2D0]/75 blur-3xl" />
            </div>

            <div
              ref={sliderRef}
              className="flex items-stretch gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 scrollbar-thin"
            >
              {filteredPosts.map((post, idx) => {
                const postImages = getPostImages(post);
                const coverImg = postImages[0];

                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 22, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{
                      duration: 0.52,
                      delay: Math.min(idx * 0.07, 0.24),
                      ease: EXPO_EASE
                    }}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleOpenPost(post)}
                    className="apple-glass-card snap-start shrink-0 w-[86vw] sm:w-[360px] lg:w-[390px] rounded-[2rem] sm:rounded-[2.15rem] p-3 sm:p-3.5 flex flex-col justify-between overflow-hidden cursor-pointer group"
                  >
                    <div>
                      {/* Apple Frosted Inner Cover Thumbnail */}
                      <div className="apple-glass-inner relative aspect-16/10 rounded-[1.5rem] sm:rounded-[1.65rem] overflow-hidden">
                        {coverImg ? (
                          <img
                            src={coverImg}
                            alt={toSentenceCase(post.title)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <BlogCoverIllustration category={post.category} index={idx} />
                        )}

                        {/* Multi-photo badge if more than 1 image */}
                        {postImages.length > 1 && (
                          <div className="apple-glass-pill absolute bottom-2.5 right-2.5 text-[#1C1C1C] px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 text-[#FF7C00]" />
                            <span>{postImages.length} ảnh</span>
                          </div>
                        )}

                        {/* Admin Quick Edit & Delete Buttons */}
                        {isAdmin && (
                          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => handleOpenEditBlog(post, e)}
                              className="px-2.5 py-1 rounded-full bg-[#1C1C1C]/85 backdrop-blur-md hover:bg-[#FF7C00] text-white text-[11px] font-bold shadow-2xs flex items-center gap-1 transition-colors"
                              title="Chỉnh sửa bài viết này"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Sửa</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteBlog(post, e)}
                              className="px-2.5 py-1 rounded-full bg-rose-50/90 backdrop-blur-md hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold shadow-2xs flex items-center gap-1 transition-colors"
                              title="Xóa bài viết này"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        )}

                        {/* Hover Read Overlay */}
                        <div className="absolute inset-0 bg-[#1C1C1C]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="apple-glass-pill px-4 py-2 rounded-full text-[#1C1C1C] text-xs font-bold flex items-center gap-1.5">
                            <Eye className="w-4 h-4 text-[#FF7C00]" />
                            <span>Ấn vào xem toàn màn hình</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="px-2.5 pt-4 pb-2">
                        {/* Unboxed Metadata */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#747474] mb-2">
                          <span className="font-bold text-[#FF7C00]">
                            {toSentenceCase(post.category)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#FF7C00]" />
                            {post.publishedAt}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#FF7C00]" />
                            {post.readTime}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-bold text-[#1C1C1C] group-hover:text-[#FF7C00] transition-colors line-clamp-2 leading-snug font-heading">
                          {toSentenceCase(post.title)}
                        </h3>

                        {/* Summary */}
                        <p className="text-xs sm:text-sm text-[#747474] mt-2 line-clamp-3 leading-relaxed">
                          {post.summary}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-2.5 pb-2 pt-3 border-t border-black/6 flex items-center justify-between gap-2">
                      <span className="text-xs text-[#747474] flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-[#FF7C00] shrink-0" />
                        <span className="truncate">{toSentenceCase(post.author)}</span>
                      </span>

                      <span className="apple-glass-pill px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1C1C1C] group-hover:bg-[#FFBD00] group-hover:border-[#FFBD00] flex items-center gap-1 shrink-0 transition-all">
                        <span>Đọc bài viết</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
