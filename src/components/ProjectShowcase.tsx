import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ProjectItem } from '../types';
import { MultiImageInput } from './MultiImageInput';
import { ScrollReveal, EXPO_EASE } from './MotionPrimitives';
import { toSentenceCase } from '../utils/formatText';
import {
  MapPin,
  Calendar,
  Award,
  CheckCircle,
  Phone,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Eye
} from 'lucide-react';

export const ProjectShowcase: React.FC = () => {
  const {
    projects,
    companyInfo,
    isAdmin,
    currentPage,
    selectedProject,
    openProjectPage,
    addProject,
    updateProject,
    deleteProject
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Track active slide index per project card
  const [cardImageIndexes, setCardImageIndexes] = useState<Record<string, number>>({});

  // Active photo index on the Full-Screen Project Page
  const [lightboxIdx, setLightboxIdx] = useState<number>(0);

  // Admin Add / Edit Project Form state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState<ProjectItem['category']>('residential');
  const [projCapacity, setProjCapacity] = useState('');
  const [projLocation, setProjLocation] = useState('');
  const [projDate, setProjDate] = useState('');
  const [projSaving, setProjSaving] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projEquipmentText, setProjEquipmentText] = useState('');
  const [projImages, setProjImages] = useState<string[]>([]);

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.category === activeFilter;
  });

  const getProjectImages = (p: ProjectItem): string[] => {
    if (Array.isArray(p.images) && p.images.length > 0) {
      return p.images.filter(Boolean);
    }
    if (p.imageUrl) {
      return [p.imageUrl];
    }
    return [];
  };

  const getCategoryLabel = (cat: ProjectItem['category']): string => {
    switch (cat) {
      case 'residential':
        return 'ĐIỆN MẶT TRỜI HỘ GIA ĐÌNH';
      case 'commercial':
        return 'NHÀ XƯỞNG & DOANH NGHIỆP (C&I)';
      case 'hybrid':
        return 'HỆ THỐNG LƯU TRỮ HYBRID';
      case 'lighting':
        return 'CHIẾU SÁNG NĂNG LƯỢNG MẶT TRỜI';
      default:
        return 'DỰ ÁN ĐIỆN MẶT TRỜI';
    }
  };

  // Transition to Full-Screen Project Page
  const handleOpenProject = (proj: ProjectItem, initialImgIdx: number = 0) => {
    setLightboxIdx(initialImgIdx);
    openProjectPage(proj);
  };

  // Close Full-Screen Project Page back to Projects List
  const handleCloseProjectPage = () => {
    setLightboxIdx(0);
    openProjectPage(null);
  };

  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjTitle('');
    setProjCategory('residential');
    setProjCapacity('10 kWp');
    setProjLocation('TP. Hồ Chí Minh');
    setProjDate(`Tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`);
    setProjSaving('Tiết kiệm ~4.500.000đ/tháng');
    setProjDesc('');
    setProjEquipmentText(
      '18 tấm pin Longi 580W\n01 biến tần Hybrid Deye 10kW\n01 pin lưu trữ Lithium 10.24kWh'
    );
    setProjImages([]);
    setShowProjectForm(true);
  };

  const handleOpenEditProject = (proj: ProjectItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingProject(proj);
    setProjTitle(proj.title || '');
    setProjCategory(proj.category || 'residential');
    setProjCapacity(proj.capacity || '');
    setProjLocation(proj.location || '');
    setProjDate(proj.completionDate || '');
    setProjSaving(proj.estimatedSaving || '');
    setProjDesc(proj.description || '');
    setProjEquipmentText(Array.isArray(proj.keyEquipment) ? proj.keyEquipment.join('\n') : '');
    setProjImages(getProjectImages(proj));
    setShowProjectForm(true);
  };

  const handleDeleteProject = (proj: ProjectItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    deleteProject(proj.id, () => {
      if (selectedProject?.id === proj.id) {
        openProjectPage(null);
      }
    });
  };

  const handleSaveProjectForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;

    const equipmentList = projEquipmentText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingProject) {
      updateProject(editingProject.id, {
        title: projTitle.trim(),
        category: projCategory,
        capacity: projCapacity.trim() || '10 kWp',
        location: projLocation.trim() || 'TP. Hồ Chí Minh',
        completionDate: projDate.trim() || '2026',
        estimatedSaving: projSaving.trim() || 'Hiệu suất cao',
        description: projDesc.trim(),
        keyEquipment:
          equipmentList.length > 0 ? equipmentList : ['Thiết bị chính hãng Đức Vinh Solar'],
        images: projImages,
        imageUrl: projImages[0] || undefined
      });
    } else {
      addProject({
        title: projTitle.trim(),
        category: projCategory,
        capacity: projCapacity.trim() || '10 kWp',
        location: projLocation.trim() || 'TP. Hồ Chí Minh',
        completionDate: projDate.trim() || '2026',
        estimatedSaving: projSaving.trim() || 'Hiệu suất cao',
        description: projDesc.trim(),
        keyEquipment:
          equipmentList.length > 0 ? equipmentList : ['Thiết bị chính hãng Đức Vinh Solar'],
        images: projImages,
        imageUrl: projImages[0] || undefined,
        svgType: 'rooftop'
      });
    }

    setShowProjectForm(false);
    setEditingProject(null);
  };

  const setCardImgIdx = (projId: string, nextIdx: number) => {
    setCardImageIndexes((prev) => ({
      ...prev,
      [projId]: nextIdx
    }));
  };

  const renderAdminProjectForm = () => {
    if (!isAdmin || !showProjectForm) return null;
    return (
      <div className="mb-10 bg-white border border-[#DEDEDE] shadow-sm rounded-3xl p-4 sm:p-6 animate-in fade-in duration-150">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#DEDEDE]">
          <h3 className="text-base font-bold text-[#1C1C1C] flex items-center gap-2 min-w-0">
            <Award className="w-5 h-5 text-[#FF7C00] shrink-0" />
            <span className="truncate">
              {editingProject
                ? `Chỉnh sửa dự án: ${toSentenceCase(editingProject.title)}`
                : 'Thêm dự án tiêu biểu mới'}
            </span>
          </h3>
          <button
            type="button"
            onClick={() => {
              setShowProjectForm(false);
              setEditingProject(null);
            }}
            className="p-1 text-[#747474] hover:text-[#1C1C1C] rounded-full bg-[#F8F8F8] border border-[#DEDEDE] shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveProjectForm} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                Tên dự án / công trình *
              </label>
              <input
                type="text"
                required
                value={projTitle}
                onChange={(e) => setProjTitle(e.target.value)}
                placeholder="VD: Hệ thống điện mặt trời Hybrid 15kWp – biệt thự Hóc Môn"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DEDEDE] text-[#1C1C1C] rounded-full focus:outline-hidden focus:border-[#FFBD00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                Phân loại dự án
              </label>
              <select
                value={projCategory}
                onChange={(e) => setProjCategory(e.target.value as ProjectItem['category'])}
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DEDEDE] text-[#1C1C1C] rounded-full focus:outline-hidden focus:border-[#FFBD00]"
              >
                <option value="residential">Hộ gia đình</option>
                <option value="commercial">Nhà xưởng &amp; C&amp;I</option>
                <option value="hybrid">Lưu trữ Hybrid</option>
                <option value="lighting">Chiếu sáng năng lượng</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                Công suất lắp đặt
              </label>
              <input
                type="text"
                value={projCapacity}
                onChange={(e) => setProjCapacity(e.target.value)}
                placeholder="VD: 15 kWp + 15kWh"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DEDEDE] text-[#1C1C1C] rounded-full focus:outline-hidden focus:border-[#FFBD00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                Địa điểm công trình
              </label>
              <input
                type="text"
                value={projLocation}
                onChange={(e) => setProjLocation(e.target.value)}
                placeholder="VD: Hóc Môn, TP.HCM"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DEDEDE] text-[#1C1C1C] rounded-full focus:outline-hidden focus:border-[#FFBD00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                Thời gian hoàn thành
              </label>
              <input
                type="text"
                value={projDate}
                onChange={(e) => setProjDate(e.target.value)}
                placeholder="VD: Tháng 10/2026"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DEDEDE] text-[#1C1C1C] rounded-full focus:outline-hidden focus:border-[#FFBD00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                Hiệu quả sinh điện / tiết kiệm
              </label>
              <input
                type="text"
                value={projSaving}
                onChange={(e) => setProjSaving(e.target.value)}
                placeholder="VD: Tiết kiệm ~6 triệu/tháng"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DEDEDE] text-[#1C1C1C] rounded-full focus:outline-hidden focus:border-[#FFBD00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                Mô tả chi tiết dự án
              </label>
              <textarea
                rows={4}
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                placeholder="Mô tả quy mô, giải pháp kỹ thuật và kết quả nghiệm thu..."
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DEDEDE] text-[#1C1C1C] rounded-2xl focus:outline-hidden focus:border-[#FFBD00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                Thiết bị chính sử dụng (mỗi thiết bị 1 dòng)
              </label>
              <textarea
                rows={4}
                value={projEquipmentText}
                onChange={(e) => setProjEquipmentText(e.target.value)}
                placeholder={
                  '20 tấm pin Longi 580W\n01 biến tần Deye 12kW\n01 pin lưu trữ SolaX 10kWh'
                }
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#DEDEDE] text-[#1C1C1C] rounded-2xl focus:outline-hidden focus:border-[#FFBD00]"
              />
            </div>
          </div>

          <MultiImageInput
            images={projImages}
            onChange={setProjImages}
            label="Hình ảnh thực tế dự án (thêm nhiều ảnh từ máy hoặc dán link)"
            helperText="Chọn nhiều ảnh công trình từ máy tính / điện thoại hoặc dán link ảnh. Khách hàng có thể bấm xem toàn bộ album ảnh của dự án."
          />

          <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[#DEDEDE]">
            <button
              type="button"
              onClick={() => {
                setShowProjectForm(false);
                setEditingProject(null);
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
              <span>{editingProject ? 'Lưu cập nhật dự án' : 'Thêm dự án vào website'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  };

  const allProjects = projects || [];
  const currentProjectIndex = selectedProject
    ? allProjects.findIndex((p) => p.id === selectedProject.id)
    : -1;
  const relatedProjects = selectedProject
    ? allProjects.filter((p) => p.id !== selectedProject.id).slice(0, 3)
    : [];

  // ================= FULL-SCREEN STANDALONE PROJECT PAGE =================
  if (currentPage === 'projects' && selectedProject) {
    const imgs = getProjectImages(selectedProject);
    const safeIdx = imgs.length > 0 ? Math.min(lightboxIdx, imgs.length - 1) : 0;

    return (
      <section className="min-h-[calc(100vh-5rem)] py-6 sm:py-10 bg-white">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Top Navigation & Admin Action Bar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCloseProjectPage}
              className="apple-glass-pill px-4 py-2.5 rounded-full text-[#1C1C1C] hover:bg-[#FFF2D0] text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#FF7C00]" />
              <span>Quay lại tất cả dự án tiêu biểu</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => handleOpenEditProject(selectedProject)}
                    className="px-3.5 py-2 rounded-full bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sửa / thêm ảnh dự án</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(selectedProject)}
                    className="px-3.5 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa dự án</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Inline Admin Edit Form if opened on this page */}
          {renderAdminProjectForm()}

          {/* Full-Screen Project Card in Apple Frosted Glass Bubble */}
          <article className="apple-glass-card rounded-3xl sm:rounded-[2.25rem] overflow-hidden">
            {/* Project Header Banner */}
            <div className="px-5 sm:px-10 pt-6 sm:pt-10 pb-6 bg-gradient-to-r from-[#FEFBF3] via-[#FAF5EA] to-white border-b border-black/6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FF7C00] uppercase tracking-wide">
                  <Award className="w-4 h-4 text-[#FF7C00] shrink-0" />
                  <span>{getCategoryLabel(selectedProject.category)}</span>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#FFBD00] text-[#1C1C1C] text-xs sm:text-sm font-extrabold">
                  Công suất: {selectedProject.capacity}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1C1C] font-heading leading-tight">
                {toSentenceCase(selectedProject.title)}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#747474]">
                <span className="flex items-center gap-1.5 font-semibold text-[#363636]">
                  <MapPin className="w-4 h-4 text-[#FF7C00]" />
                  Địa điểm: {selectedProject.location}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#FF7C00]" />
                  Hoàn thành: {selectedProject.completionDate}
                </span>
              </div>
            </div>

            {/* Project Main Body */}
            <div className="p-5 sm:p-10 space-y-7">
              {/* Project Image Gallery */}
              {imgs.length > 0 ? (
                <div className="space-y-3">
                  <div className="apple-glass-inner relative rounded-2xl overflow-hidden aspect-16/9 max-h-[540px] flex items-center justify-center">
                    <img
                      src={imgs[safeIdx]}
                      alt={toSentenceCase(selectedProject.title)}
                      className="w-full h-full object-contain"
                    />
                    {imgs.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setLightboxIdx((prev) => (prev - 1 + imgs.length) % imgs.length)
                          }
                          className="apple-glass-pill absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full text-[#1C1C1C] flex items-center justify-center"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setLightboxIdx((prev) => (prev + 1) % imgs.length)
                          }
                          className="apple-glass-pill absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full text-[#1C1C1C] flex items-center justify-center"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="apple-glass-pill absolute bottom-3 right-3 px-3 py-1 rounded-full text-[#1C1C1C] text-xs font-mono font-semibold">
                          Ảnh {safeIdx + 1} / {imgs.length}
                        </div>
                      </>
                    )}
                  </div>

                  {imgs.length > 1 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                      {imgs.map((imgUrl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setLightboxIdx(i)}
                          className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                            safeIdx === i
                              ? 'border-[#FFBD00] ring-2 ring-[#FFBD00]/40 opacity-100'
                              : 'border-white/80 opacity-65 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="apple-glass-inner rounded-2xl overflow-hidden aspect-16/7 max-h-[300px] flex flex-col items-center justify-center p-8 text-[#1C1C1C] text-center">
                  <Award className="w-12 h-12 text-[#FF7C00] mb-3" />
                  <div className="text-sm sm:text-base font-bold">
                    {toSentenceCase(selectedProject.title)}
                  </div>
                  <div className="text-xs text-[#747474] mt-1">
                    {selectedProject.location} · Công suất:{' '}
                    <span className="text-[#FF7C00] font-bold">{selectedProject.capacity}</span>
                  </div>
                </div>
              )}

              {/* Key Project Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl apple-glass-inner">
                  <div className="text-[11px] font-bold text-[#747474] uppercase tracking-wide">
                    CÔNG SUẤT HỆ THỐNG
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-[#FF7C00] mt-1">
                    {selectedProject.capacity}
                  </div>
                </div>

                <div className="p-4 rounded-2xl apple-glass-inner">
                  <div className="text-[11px] font-bold text-[#747474] uppercase tracking-wide">
                    ĐỊA ĐIỂM LẮP ĐẶT
                  </div>
                  <div className="text-sm sm:text-base font-bold text-[#1C1C1C] mt-1">
                    {selectedProject.location}
                  </div>
                </div>

                <div className="p-4 rounded-2xl apple-glass-inner">
                  <div className="text-[11px] font-bold text-[#747474] uppercase tracking-wide">
                    THỜI GIAN NGHIỆM THU
                  </div>
                  <div className="text-sm sm:text-base font-bold text-[#1C1C1C] mt-1">
                    {selectedProject.completionDate}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FEFBF3] border border-[#FFBD00]/50">
                  <div className="text-[11px] font-bold text-[#1C1C1C] uppercase tracking-wide">
                    HIỆU QUẢ SINH ĐIỆN &amp; TIẾT KIỆM
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-[#FF7C00] mt-1">
                    {selectedProject.estimatedSaving}
                  </div>
                </div>
              </div>

              {/* Project Description Paragraphs */}
              <div className="space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-[#1C1C1C] font-heading uppercase">
                  THÔNG TIN CHI TIẾT &amp; GIẢI PHÁP KỸ THUẬT
                </h2>
                <div className="space-y-3 text-base sm:text-lg text-[#363636] leading-relaxed">
                  {(selectedProject.description || '')
                    .split('\n')
                    .map((line, i) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;
                      return <p key={i}>{trimmed}</p>;
                    })}
                </div>
              </div>

              {/* Key Equipment Checklist */}
              {Array.isArray(selectedProject.keyEquipment) &&
                selectedProject.keyEquipment.length > 0 && (
                  <div className="p-5 sm:p-6 rounded-2xl apple-glass-inner">
                    <h2 className="text-base sm:text-lg font-bold text-[#1C1C1C] font-heading uppercase mb-3.5">
                      CẤU HÌNH THIẾT BỊ CHÍNH SỬ DỤNG TRONG DỰ ÁN
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base text-[#363636]">
                      {selectedProject.keyEquipment.map((eq, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 apple-glass-pill p-3 rounded-xl"
                        >
                          <CheckCircle className="w-5 h-5 text-[#FF7C00] shrink-0 mt-0.5" />
                          <span className="font-medium text-[#1C1C1C]">{eq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Consultation CTA inside Full-Screen Project Page */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FEFBF3] via-[#FAF5EA] to-[#FFF2D0]/60 border border-[#FFBD00]/50 text-[#1C1C1C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FF7C00] uppercase">
                    <Award className="w-4 h-4 text-[#FF7C00]" />
                    <span>KHẢO SÁT &amp; BÁO GIÁ CẤU HÌNH TƯƠNG TỰ</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#363636] mt-1">
                    Bạn muốn lắp đặt hệ thống tương tự dự án &ldquo;{toSentenceCase(selectedProject.title)}&rdquo;? Liên hệ ngay kỹ sư Đức Vinh Solar để nhận bản vẽ và báo giá trọn gói.
                  </p>
                </div>
                <a
                  href={`https://zalo.me/${companyInfo.hotlineZalo}?text=${encodeURIComponent(
                    'Tôi muốn tư vấn giải pháp tương tự dự án: ' + toSentenceCase(selectedProject.title)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white font-extrabold text-xs sm:text-sm rounded-full shrink-0 flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Tư vấn Zalo: {companyInfo.hotlineZalo}</span>
                </a>
              </div>
            </div>

            {/* Bottom Prev / Next Project Navigation Bar */}
            <div className="px-5 sm:px-10 py-4 bg-white/60 border-t border-black/6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {currentProjectIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => handleOpenProject(allProjects[currentProjectIndex - 1])}
                    className="apple-glass-pill px-4 py-2 text-xs sm:text-sm font-bold text-[#1C1C1C] hover:bg-[#FFF2D0] rounded-full flex items-center gap-1.5 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#FF7C00]" />
                    <span>Dự án trước</span>
                  </button>
                )}
                {currentProjectIndex >= 0 && currentProjectIndex < allProjects.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleOpenProject(allProjects[currentProjectIndex + 1])}
                    className="apple-glass-pill px-4 py-2 text-xs sm:text-sm font-bold text-[#1C1C1C] hover:bg-[#FFF2D0] rounded-full flex items-center gap-1.5 transition-colors"
                  >
                    <span>Dự án tiếp theo</span>
                    <ChevronRight className="w-4 h-4 text-[#FF7C00]" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleCloseProjectPage}
                className="px-5 py-2 text-xs sm:text-sm font-bold bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white rounded-full transition-colors"
              >
                Xem tất cả dự án tiêu biểu
              </button>
            </div>
          </article>

          {/* Related Projects Section with Apple Frosted Glass Bubble Cards */}
          {relatedProjects.length > 0 && (
            <div className="mt-10 relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#1C1C1C] font-heading uppercase">
                  DỰ ÁN TIÊU BIỂU KHÁC
                </h2>
                <button
                  type="button"
                  onClick={handleCloseProjectPage}
                  className="text-xs sm:text-sm font-bold text-[#FF7C00] hover:text-[#1C1C1C] flex items-center gap-1"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedProjects.map((proj) => {
                  const projImgs = getProjectImages(proj);
                  const coverImg = projImgs[0];
                  return (
                    <motion.div
                      key={proj.id}
                      whileHover={{ y: -6 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleOpenProject(proj)}
                      className="apple-glass-card rounded-[2rem] p-3 flex flex-col justify-between cursor-pointer group overflow-hidden"
                    >
                      <div>
                        <div className="apple-glass-inner relative aspect-16/10 rounded-[1.4rem] overflow-hidden mb-3">
                          {coverImg ? (
                            <img
                              src={coverImg}
                              alt={toSentenceCase(proj.title)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#FF7C00]">
                              <Award className="w-8 h-8" />
                            </div>
                          )}
                          <span className="apple-glass-pill absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#1C1C1C]">
                            {proj.capacity}
                          </span>
                        </div>
                        <div className="px-1.5">
                          <span className="text-[11px] font-bold text-[#747474] flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0 text-[#FF7C00]" />
                            <span className="truncate">{proj.location}</span>
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-[#1C1C1C] group-hover:text-[#FF7C00] line-clamp-2 mt-1 font-heading">
                            {toSentenceCase(proj.title)}
                          </h3>
                        </div>
                      </div>
                      <div className="px-1.5 pt-3 mt-2 border-t border-black/6 flex items-center justify-between text-xs text-[#747474]">
                        <span>{proj.completionDate}</span>
                        <span className="apple-glass-pill px-3 py-1 rounded-full font-bold text-[#1C1C1C] group-hover:bg-[#FFBD00] transition-colors">
                          Xem dự án &rarr;
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
    <section id="projects-section" className="py-8 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header Bar */}
        <ScrollReveal y={22}>
          <div className="bg-gradient-to-r from-[#FEFBF3] via-[#FAF5EA] to-white border border-[#DEDEDE] shadow-[0_8px_24px_-10px_rgba(28,28,28,0.06)] rounded-[2rem] sm:rounded-[2.25rem] p-5 sm:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-5 mb-6 sm:mb-8 overflow-hidden">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF7C00] tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-white border border-[#DEDEDE]">
                <Award className="w-4 h-4 text-[#FF7C00] shrink-0" />
                <span>NĂNG LỰC THI CÔNG THỰC TẾ</span>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1C1C] font-heading uppercase break-words">
                DỰ ÁN TIÊU BIỂU ĐÃ THỰC HIỆN
              </h2>
              <p className="text-xs sm:text-sm text-[#747474] mt-2 max-w-2xl break-words">
                Minh chứng thực tế về chất lượng vật tư chính hãng, thẩm mỹ lắp đặt chuẩn kỹ thuật và hiệu quả sinh điện cao cho khách hàng của Đức Vinh Solar. Ấn vào từng dự án để xem trang chi tiết toàn màn hình.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto min-w-0">
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleOpenAddProject}
                  className="px-4 py-2 bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white text-xs font-bold rounded-full flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm dự án mới</span>
                </button>
              )}

              {/* Category Filter Capsule */}
              <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#DEDEDE] rounded-2xl sm:rounded-full overflow-x-auto max-w-full scrollbar-none">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 ${
                    activeFilter === 'all'
                      ? 'bg-[#FFBD00] text-[#1C1C1C] font-bold shadow-2xs'
                      : 'text-[#363636] hover:text-[#1C1C1C] hover:bg-[#FEFBF3]'
                  }`}
                >
                  Tất cả ({projects.length})
                </button>
                <button
                  onClick={() => setActiveFilter('residential')}
                  className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 ${
                    activeFilter === 'residential'
                      ? 'bg-[#FFBD00] text-[#1C1C1C] font-bold shadow-2xs'
                      : 'text-[#363636] hover:text-[#1C1C1C] hover:bg-[#FEFBF3]'
                  }`}
                >
                  Hộ gia đình
                </button>
                <button
                  onClick={() => setActiveFilter('commercial')}
                  className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 ${
                    activeFilter === 'commercial'
                      ? 'bg-[#FFBD00] text-[#1C1C1C] font-bold shadow-2xs'
                      : 'text-[#363636] hover:text-[#1C1C1C] hover:bg-[#FEFBF3]'
                  }`}
                >
                  Nhà xưởng &amp; C&amp;I
                </button>
                <button
                  onClick={() => setActiveFilter('hybrid')}
                  className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 ${
                    activeFilter === 'hybrid'
                      ? 'bg-[#FFBD00] text-[#1C1C1C] font-bold shadow-2xs'
                      : 'text-[#363636] hover:text-[#1C1C1C] hover:bg-[#FEFBF3]'
                  }`}
                >
                  Lưu trữ Hybrid
                </button>
                <button
                  onClick={() => setActiveFilter('lighting')}
                  className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 ${
                    activeFilter === 'lighting'
                      ? 'bg-[#FFBD00] text-[#1C1C1C] font-bold shadow-2xs'
                      : 'text-[#363636] hover:text-[#1C1C1C] hover:bg-[#FEFBF3]'
                  }`}
                >
                  Chiếu sáng năng lượng
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Admin Inline Add / Edit Project Form */}
        {renderAdminProjectForm()}

        {/* Projects Grid with Apple Frosted Glass Bubble Effect (identical to Product Cards) */}
        <div className="relative">
          {/* Soft Ambient Light Blobs behind Project Cards so Apple Frosted Glass refracts warm SolaX depth */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-4 -inset-y-6 -z-10 overflow-hidden rounded-[2.5rem]"
          >
            <div className="absolute -top-12 left-10 w-80 h-80 rounded-full bg-[#FFBD00]/16 blur-3xl" />
            <div className="absolute top-1/3 right-8 w-96 h-96 rounded-full bg-[#FF7C00]/10 blur-3xl" />
            <div className="absolute bottom-6 left-1/3 w-80 h-80 rounded-full bg-[#FFF2D0]/75 blur-3xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredProjects.map((project, idx) => {
              const imgs = getProjectImages(project);
              const activeIdx = cardImageIndexes[project.id] || 0;
              const currentImg = imgs[activeIdx] || imgs[0];
              const cardDelay = Math.min((idx % 2) * 0.08 + Math.floor(idx / 2) * 0.04, 0.22);

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.08 }}
                  transition={{ duration: 0.56, delay: cardDelay, ease: EXPO_EASE }}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleOpenProject(project, activeIdx)}
                  className="apple-glass-card group rounded-[2rem] sm:rounded-[2.15rem] p-3 sm:p-3.5 flex flex-col justify-between overflow-hidden min-w-0 cursor-pointer"
                >
                  <div className="min-w-0">
                    {/* Apple Frosted Inner Showcase Banner / Multi-Image Gallery for Project */}
                    <div className="apple-glass-inner h-56 sm:h-64 rounded-[1.5rem] sm:rounded-[1.65rem] bg-gradient-to-br from-[#FEFBF3] via-[#FAF5EA] to-[#FFF2D0] relative overflow-hidden">
                      {currentImg ? (
                        <>
                          <img
                            src={currentImg}
                            alt={toSentenceCase(project.title)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/80 via-[#1C1C1C]/25 to-transparent pointer-events-none" />
                        </>
                      ) : (
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#FF7C00_1px,transparent_1px)] [background-size:16px_16px]" />
                      )}

                      {/* Prev / Next Gallery Controls on Card if multiple images */}
                      {imgs.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCardImgIdx(
                                project.id,
                                activeIdx === 0 ? imgs.length - 1 : activeIdx - 1
                              );
                            }}
                            className="apple-glass-pill absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full text-[#1C1C1C] flex items-center justify-center"
                            title="Ảnh trước"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCardImgIdx(
                                project.id,
                                activeIdx === imgs.length - 1 ? 0 : activeIdx + 1
                              );
                            }}
                            className="apple-glass-pill absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full text-[#1C1C1C] flex items-center justify-center"
                            title="Ảnh tiếp theo"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      <div className="p-4 sm:p-5 h-full flex flex-col justify-between relative z-10 pointer-events-none">
                        <div className="flex flex-wrap items-start justify-between gap-1.5">
                          <span className="px-3 py-1 rounded-full bg-[#FFBD00] text-[#1C1C1C] text-[11px] sm:text-xs font-extrabold max-w-full truncate shadow-2xs">
                            Công suất: {project.capacity}
                          </span>

                          <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
                            {imgs.length > 0 && (
                              <span className="apple-glass-pill px-2.5 py-1 rounded-full text-[#1C1C1C] text-[11px] font-semibold flex items-center gap-1">
                                <ImageIcon className="w-3 h-3 text-[#FF7C00] shrink-0" />
                                <span>
                                  {imgs.length > 1 ? `${activeIdx + 1}/${imgs.length}` : 'Ảnh'}
                                </span>
                              </span>
                            )}
                            <span className="apple-glass-pill text-[11px] text-[#363636] flex items-center gap-1 font-mono px-2.5 py-1 rounded-full">
                              <Calendar className="w-3 h-3 text-[#FF7C00] shrink-0" />
                              <span className="truncate">{project.completionDate}</span>
                            </span>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div
                            className={`flex items-center gap-1 text-xs mb-1 min-w-0 ${
                              currentImg ? 'text-white' : 'text-[#747474]'
                            }`}
                          >
                            <MapPin
                              className={`w-3.5 h-3.5 shrink-0 ${
                                currentImg ? 'text-[#FFBD00]' : 'text-[#FF7C00]'
                              }`}
                            />
                            <span className="truncate">{project.location}</span>
                          </div>
                          <h3
                            className={`text-base sm:text-xl font-bold font-heading line-clamp-2 break-words transition-colors ${
                              currentImg
                                ? 'text-white group-hover:text-[#FFBD00]'
                                : 'text-[#1C1C1C] group-hover:text-[#FF7C00]'
                            }`}
                          >
                            {toSentenceCase(project.title)}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Thumbnail strip under Project banner when multiple photos exist */}
                    {imgs.length > 1 && (
                      <div
                        className="px-3 sm:px-5 pt-3 flex items-center gap-2 overflow-x-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {imgs.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCardImgIdx(project.id, idx);
                            }}
                            className={`w-14 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                              activeIdx === idx
                                ? 'border-[#FFBD00] ring-2 ring-[#FFBD00]/40 opacity-100'
                                : 'border-white/80 opacity-65 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`${toSentenceCase(project.title)} - ảnh ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Content Details */}
                    <div className="p-3 sm:p-5 min-w-0">
                      {/* Estimated saving callout in Apple Frosted Inner Pill */}
                      <div className="p-3 sm:p-3.5 rounded-2xl apple-glass-inner mb-3.5 sm:mb-4">
                        <div className="text-[11px] font-bold text-[#1C1C1C] uppercase tracking-wide">
                          HIỆU QUẢ SINH ĐIỆN &amp; TIẾT KIỆM:
                        </div>
                        <div className="text-xs font-bold text-[#FF7C00] mt-0.5 break-words">
                          {project.estimatedSaving}
                        </div>
                      </div>

                      <p className="text-xs text-[#747474] leading-relaxed mb-4 break-words line-clamp-3">
                        {project.description}
                      </p>

                      {/* Key Equipment Tag List */}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#1C1C1C] mb-2">
                          Thiết bị chính sử dụng trong dự án:
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#363636]">
                          {(Array.isArray(project.keyEquipment) ? project.keyEquipment : []).map(
                            (eq, idx) => (
                              <li key={idx} className="flex items-start gap-2 min-w-0">
                                <CheckCircle className="w-3.5 h-3.5 text-[#FF7C00] shrink-0 mt-0.5" />
                                <span className="break-words min-w-0">{eq}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Consultation CTA + Admin Controls */}
                  <div className="px-3 sm:px-4 py-3 border-t border-black/6 flex flex-wrap items-center justify-between gap-2 min-w-0">
                    {isAdmin ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleOpenEditProject(project, e)}
                          className="apple-glass-pill px-3 py-1.5 text-xs font-bold text-[#1C1C1C] rounded-full flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5 shrink-0 text-[#FF7C00]" />
                          <span>Sửa / thêm ảnh</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteProject(project, e)}
                          className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50/90 hover:bg-rose-100 border border-rose-200 rounded-full transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-[#747474]">Ấn vào để xem toàn màn hình</span>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProject(project, activeIdx);
                        }}
                        className="apple-glass-pill px-3.5 py-1.5 text-xs font-bold text-[#1C1C1C] group-hover:bg-[#FFBD00] group-hover:border-[#FFBD00] rounded-full flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#FF7C00] group-hover:text-[#1C1C1C]" />
                        <span>Xem chi tiết</span>
                      </button>
                      <a
                        href={`https://zalo.me/${companyInfo.hotlineZalo}?text=${encodeURIComponent(
                          'Tôi muốn tư vấn giải pháp tương tự dự án: ' + toSentenceCase(project.title)
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-1.5 text-xs font-bold bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white rounded-full flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Liên hệ Zalo</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
