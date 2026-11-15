import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BlogPost } from '../types';
import { MultiImageInput } from './MultiImageInput';
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
  'Kinh Nghiệm Điện Mặt Trời',
  'Kỹ Thuật & Lắp Đặt',
  'Giải Pháp Tiết Kiệm Điện',
  'Chính Sách & Giá Điện',
  'Tin Tức Đức Vinh Solar'
];

// Clean fallback cover illustration when a blog post does not have an uploaded photo yet
const BlogCoverIllustration: React.FC<{ category: string; index: number }> = ({
  category,
  index
}) => {
  const catLower = (category || '').toLowerCase();
  const isTech = catLower.includes('kỹ thuật') || catLower.includes('lắp đặt');
  const isSaving = catLower.includes('tiết kiệm') || catLower.includes('giá điện');

  const bgGradient = isTech
    ? 'from-teal-950 via-emerald-900 to-slate-900'
    : isSaving
    ? 'from-emerald-950 via-teal-900 to-emerald-800'
    : index % 2 === 0
    ? 'from-emerald-950 via-emerald-900 to-teal-950'
    : 'from-slate-900 via-emerald-950 to-teal-900';

  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${bgGradient} relative overflow-hidden flex flex-col items-center justify-center p-6 text-white select-none`}
    >
      {/* Subtle solar grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`blog-grid-${index}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#blog-grid-${index})`} />
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mb-3 shadow-inner">
          {isTech ? (
            <Cpu className="w-7 h-7 text-emerald-300" />
          ) : isSaving ? (
            <BatteryCharging className="w-7 h-7 text-amber-300" />
          ) : (
            <Sun className="w-7 h-7 text-amber-300" />
          )}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">
          Cẩm Nang Kỹ Thuật Solar
        </span>
        <span className="text-[10px] text-emerald-100/75 mt-1">
          Đức Vinh Solar · Năng Lượng Xanh
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
    addBlogPost,
    updateBlogPost,
    deleteBlogPost
  } = useApp();

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Reader Modal State ("ấn vào xem")
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
  const [modalImageIdx, setModalImageIdx] = useState<number>(0);

  // Admin Inline Add / Edit Form State
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(DEFAULT_BLOG_CATEGORIES[0]);
  const [formAuthor, setFormAuthor] = useState('Kỹ Sư Đức Vinh Solar');
  const [formPublishedAt, setFormPublishedAt] = useState('');
  const [formReadTime, setFormReadTime] = useState('5 phút đọc');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTagsText, setFormTagsText] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);

  // Available categories across blogPosts
  const blogCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_BLOG_CATEGORIES);
    (blogPosts || []).forEach((bp) => {
      if (bp?.category) set.add(bp.category.trim());
    });
    return Array.from(set);
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

  // Open Article Reader Modal
  const handleOpenPost = (post: BlogPost) => {
    setViewingPost(post);
    setModalImageIdx(0);
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
    setFormAuthor('Kỹ Sư Đức Vinh Solar');
    setFormPublishedAt(dateStr);
    setFormReadTime('5 phút đọc');
    setFormSummary('');
    setFormContent('');
    setFormTagsText('Điện mặt trời, Đức Vinh Solar, Tiết kiệm điện');
    setFormImages([]);
    setShowBlogForm(true);
  };

  // Open Admin Edit Blog Form
  const handleOpenEditBlog = (post: BlogPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPost(post);
    setFormTitle(post.title || '');
    setFormCategory(post.category || DEFAULT_BLOG_CATEGORIES[0]);
    setFormAuthor(post.author || 'Kỹ Sư Đức Vinh Solar');
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
        category: formCategory.trim() || 'Kinh Nghiệm Điện Mặt Trời',
        author: formAuthor.trim() || 'Kỹ Sư Đức Vinh Solar',
        publishedAt: formPublishedAt.trim() || '2026',
        readTime: formReadTime.trim() || '5 phút đọc',
        summary: summaryClean,
        content: formContent.trim() || summaryClean,
        tags: tagsList.length > 0 ? tagsList : ['Điện mặt trời'],
        images: formImages,
        imageUrl: formImages[0] || undefined
      };
      updateBlogPost(editingPost.id, updatedFields);
      if (viewingPost && viewingPost.id === editingPost.id) {
        setViewingPost({ ...editingPost, ...updatedFields });
      }
    } else {
      addBlogPost({
        title: formTitle.trim(),
        category: formCategory.trim() || 'Kinh Nghiệm Điện Mặt Trời',
        author: formAuthor.trim() || 'Kỹ Sư Đức Vinh Solar',
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
      if (viewingPost?.id === post.id) {
        setViewingPost(null);
      }
    });
  };

  // Next / Prev article inside Reader Modal
  const currentModalIndex = viewingPost
    ? filteredPosts.findIndex((p) => p.id === viewingPost.id)
    : -1;

  return (
    <section
      id="blog-section"
      className="py-8 sm:py-14 bg-transparent overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header + Slider Navigation Controls in Frosted Bubble */}
        <div className="glass-bubble rounded-3xl sm:rounded-[2rem] p-5 sm:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-5 mb-6 overflow-hidden">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-2">
              <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Góc Chia Sẻ Kỹ Thuật &amp; Kinh Nghiệm Solar</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading break-words">
              Blog Bài Viết &amp; Cẩm Nang Năng Lượng Mặt Trời
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl break-words">
              Trượt ngang để chọn bài viết chuyên sâu về kinh nghiệm chọn tấm pin, biến tần Hybrid, pin lưu trữ Lithium và giải pháp tiết kiệm điện thực tế. Ấn vào từng bài viết để xem chi tiết.
            </p>
          </div>

          {/* Right Controls: Admin Add Button + Horizontal Slide Left/Right Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenAddBlog}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Bài Viết Mới</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSlide('left')}
                className="px-3.5 sm:px-4 py-2 rounded-full glass-pill hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Trượt sang trái"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Trượt trái</span>
              </button>
              <button
                type="button"
                onClick={() => handleSlide('right')}
                className="px-3.5 sm:px-4 py-2 rounded-full glass-pill hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Trượt sang phải"
              >
                <span>Trượt phải</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'glass-pill text-slate-700 hover:text-emerald-800'
            }`}
          >
            Tất Cả Bài Viết ({(blogPosts || []).length})
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
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'glass-pill text-slate-700 hover:text-emerald-800'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Admin Inline Add / Edit Blog Post Form */}
        {isAdmin && showBlogForm && (
          <div className="mb-10 bg-slate-50 rounded-2xl border-2 border-emerald-500 shadow-xl p-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>
                  {editingPost
                    ? `Chỉnh Sửa Bài Viết: ${editingPost.title}`
                    : 'Thêm Bài Viết Blog Mới'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowBlogForm(false);
                  setEditingPost(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlogForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tiêu Đề Bài Viết *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="VD: Kinh nghiệm lắp điện mặt trời Hybrid 10kWp cho gia đình..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chuyên Mục Bài Viết *
                  </label>
                  <input
                    type="text"
                    required
                    list="blog-category-suggestions"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="Chọn hoặc nhập chuyên mục..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tác Giả / Bộ Phận
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="VD: Kỹ Sư Đức Vinh Solar"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày Đăng
                  </label>
                  <input
                    type="text"
                    value={formPublishedAt}
                    onChange={(e) => setFormPublishedAt(e.target.value)}
                    placeholder="VD: 03/11/2026"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Thời Gian Đọc
                  </label>
                  <input
                    type="text"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    placeholder="VD: 5 phút đọc"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô Tả Tóm Tắt Ngắn (Hiển thị trên thẻ trượt ngang)
                </label>
                <textarea
                  rows={2}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Tóm tắt 1-2 câu chính của bài viết để thu hút người đọc..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nội Dung Chi Tiết Bài Viết * (Hỗ trợ xuống dòng nhiều đoạn văn)
                </label>
                <textarea
                  rows={8}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Nhập toàn bộ nội dung bài viết chi tiết tại đây..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Từ Khóa Chủ Đề (Cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={formTagsText}
                  onChange={(e) => setFormTagsText(e.target.value)}
                  placeholder="VD: Điện mặt trời Hybrid, Biến tần Deye, Pin lưu trữ"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <MultiImageInput
                images={formImages}
                onChange={setFormImages}
                label="Hình Ảnh Bài Viết Blog (Tải nhiều ảnh từ máy hoặc dán Link)"
                helperText="Ảnh đầu tiên sẽ làm ảnh bìa trên thanh trượt ngang. Tất cả các ảnh sẽ hiển thị đầy đủ khi người đọc ấn vào xem bài viết."
              />

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowBlogForm(false);
                    setEditingPost(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPost ? 'Lưu Cập Nhật Bài Viết' : 'Đăng Bài Viết Mới'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Horizontal Carousel Container ("dạng trượt ngang để chọn bài viết và ấn vào xem") */}
        {filteredPosts.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-10 text-center max-w-lg mx-auto">
            <BookOpen className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">
              Chưa có bài viết nào trong chuyên mục này
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Hãy chọn chuyên mục khác hoặc thêm bài viết mới.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
              >
                Xem tất cả bài viết
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleOpenAddBlog}
                  className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg"
                >
                  + Thêm bài viết mới
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={sliderRef}
              className="flex items-stretch gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 scrollbar-thin"
            >
              {filteredPosts.map((post, idx) => {
                const postImages = getPostImages(post);
                const coverImg = postImages[0];

                return (
                  <article
                    key={post.id}
                    onClick={() => handleOpenPost(post)}
                    className="snap-start shrink-0 w-[86vw] sm:w-[360px] lg:w-[390px] glass-bubble rounded-[1.85rem] p-3 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
                  >
                    <div>
                      {/* Card Cover Thumbnail */}
                      <div className="relative aspect-16/10 rounded-[1.35rem] bg-slate-100 overflow-hidden border border-white/90">
                        {coverImg ? (
                          <img
                            src={coverImg}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                          />
                        ) : (
                          <BlogCoverIllustration category={post.category} index={idx} />
                        )}

                        {/* Multi-photo badge if more than 1 image */}
                        {postImages.length > 1 && (
                          <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 text-emerald-300" />
                            <span>{postImages.length} ảnh</span>
                          </div>
                        )}

                        {/* Admin Quick Edit & Delete Buttons */}
                        {isAdmin && (
                          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleOpenEditBlog(post, e)}
                              className="px-2.5 py-1 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold shadow-sm flex items-center gap-1 transition-colors"
                              title="Chỉnh sửa bài viết này"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Sửa</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteBlog(post, e)}
                              className="px-2.5 py-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-sm flex items-center gap-1 transition-colors"
                              title="Xóa bài viết này"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        )}

                        {/* Hover Read Overlay */}
                        <div className="absolute inset-0 bg-emerald-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="px-4 py-2 rounded-full bg-white/95 text-emerald-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                            <Eye className="w-4 h-4 text-emerald-700" />
                            <span>Ấn Vào Xem Bài Viết</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="px-2.5 pt-4 pb-2">
                        {/* Unboxed Metadata */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                          <span className="font-bold text-emerald-700">{post.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {post.publishedAt}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {post.readTime}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug font-heading">
                          {post.title}
                        </h3>

                        {/* Summary */}
                        <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                          {post.summary}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-2.5 pb-2 pt-3 border-t border-emerald-900/10 flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{post.author}</span>
                      </span>

                      <span className="px-3 py-1 rounded-full glass-pill text-xs font-bold text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white flex items-center gap-1 shrink-0 transition-all">
                        <span>Đọc bài viết</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= ARTICLE READER MODAL ("ẤN VÀO XEM") ================= */}
      {viewingPost && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setViewingPost(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold truncate">
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{viewingPost.category}</span>
                <span>·</span>
                <span>{viewingPost.publishedAt}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const target = viewingPost;
                        setViewingPost(null);
                        handleOpenEditBlog(target);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Sửa Bài</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBlog(viewingPost)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setViewingPost(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  aria-label="Đóng bài viết"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Article Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
              {/* Article Title & Metadata */}
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-heading leading-snug">
                  {viewingPost.title}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 pb-4 border-b border-slate-100">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
                    <User className="w-4 h-4 text-emerald-600" />
                    {viewingPost.author}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Ngày đăng: {viewingPost.publishedAt}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {viewingPost.readTime}
                  </span>
                </div>
              </div>

              {/* Article Image Gallery (if post has uploaded/linked images) */}
              {(() => {
                const imgs = getPostImages(viewingPost);
                if (imgs.length === 0) return null;
                const safeIdx = Math.min(modalImageIdx, imgs.length - 1);
                return (
                  <div className="space-y-2.5">
                    <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-16/9 max-h-[420px] flex items-center justify-center border border-slate-200">
                      <img
                        src={imgs[safeIdx]}
                        alt={viewingPost.title}
                        className="w-full h-full object-contain"
                      />
                      {imgs.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setModalImageIdx((prev) => (prev - 1 + imgs.length) % imgs.length)
                            }
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/75 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setModalImageIdx((prev) => (prev + 1) % imgs.length)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/75 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {imgs.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {imgs.map((imgUrl, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setModalImageIdx(i)}
                            className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                              safeIdx === i
                                ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                                : 'border-slate-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Highlighted Lead Summary */}
              {viewingPost.summary && (
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-950 leading-relaxed">
                  {viewingPost.summary}
                </div>
              )}

              {/* Full Article Body Paragraphs */}
              <div className="space-y-3.5 text-sm sm:text-base text-slate-700 leading-relaxed">
                {(viewingPost.content || '')
                  .split('\n')
                  .map((line, i) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <div key={i} className="h-1" />;

                    const isHeading = /^\d+\./.test(trimmed);
                    const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•');

                    if (isHeading) {
                      return (
                        <h3
                          key={i}
                          className="text-base sm:text-lg font-bold text-slate-900 pt-2 font-heading"
                        >
                          {trimmed}
                        </h3>
                      );
                    }

                    if (isBullet) {
                      return (
                        <div key={i} className="flex items-start gap-2.5 pl-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <span>{trimmed.replace(/^[-•]\s*/, '')}</span>
                        </div>
                      );
                    }

                    return <p key={i}>{trimmed}</p>;
                  })}
              </div>

              {/* Article Tags */}
              {Array.isArray(viewingPost.tags) && viewingPost.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-slate-700">Chủ đề:</span>
                  {viewingPost.tags.map((t, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span aria-hidden="true">·</span>}
                      <span className="text-emerald-700 font-medium">{t}</span>
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* Consultation CTA inside Blog Reader */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 to-teal-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Tư Vấn Kỹ Thuật Miễn Phí 24/7</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                    Cần tư vấn cấu hình điện mặt trời hoặc báo giá sỉ/lẻ thiết bị tại Kho Tổng Đức Vinh Solar?
                  </p>
                </div>
                <a
                  href={`https://zalo.me/${companyInfo.hotlineZalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs rounded-xl shrink-0 flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Zalo Kỹ Thuật: {companyInfo.hotlineZalo}</span>
                </a>
              </div>
            </div>

            {/* Modal Footer: Prev / Next Article Navigation */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                {currentModalIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => handleOpenPost(filteredPosts[currentModalIndex - 1])}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-emerald-50 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Bài trước</span>
                  </button>
                )}
                {currentModalIndex >= 0 && currentModalIndex < filteredPosts.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleOpenPost(filteredPosts[currentModalIndex + 1])}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-emerald-50 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <span>Bài tiếp theo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setViewingPost(null)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
              >
                Đóng Bài Viết
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
