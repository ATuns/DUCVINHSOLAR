import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectItem } from '../types';
import { MultiImageInput } from './MultiImageInput';
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
    addProject,
    updateProject,
    deleteProject
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Track active slide index per project card
  const [cardImageIndexes, setCardImageIndexes] = useState<Record<string, number>>({});

  // Lightbox / Detail Modal state for viewing a project's full photo gallery
  const [viewingProject, setViewingProject] = useState<ProjectItem | null>(null);
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

  const filteredProjects = projects.filter(p => {
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

  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjTitle('');
    setProjCategory('residential');
    setProjCapacity('10 kWp');
    setProjLocation('TP. Hồ Chí Minh');
    setProjDate(`Tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`);
    setProjSaving('Tiết kiệm ~4.500.000đ/tháng');
    setProjDesc('');
    setProjEquipmentText('18 Tấm pin Longi 580W\n01 Biến tần Hybrid Deye 10kW\n01 Pin lưu trữ Lithium 10.24kWh');
    setProjImages([]);
    setShowProjectForm(true);
  };

  const handleOpenEditProject = (proj: ProjectItem) => {
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

  const handleSaveProjectForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;

    const equipmentList = projEquipmentText
      .split('\n')
      .map(s => s.trim())
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
        keyEquipment: equipmentList.length > 0 ? equipmentList : ['Thiết bị chính hãng Đức Vinh Solar'],
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
        keyEquipment: equipmentList.length > 0 ? equipmentList : ['Thiết bị chính hãng Đức Vinh Solar'],
        images: projImages,
        imageUrl: projImages[0] || undefined,
        svgType: 'rooftop'
      });
    }

    setShowProjectForm(false);
    setEditingProject(null);
  };

  const setCardImgIdx = (projId: string, nextIdx: number) => {
    setCardImageIndexes(prev => ({
      ...prev,
      [projId]: nextIdx
    }));
  };

  return (
    <section id="projects-section" className="py-8 sm:py-14 bg-transparent">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="glass-bubble rounded-3xl sm:rounded-[2rem] p-5 sm:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-5 mb-6 sm:mb-8 overflow-hidden">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-2">
              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Năng Lực Thi Công Thực Tế</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading break-words">
              Dự Án Tiêu Biểu Đã Thực Hiện
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl break-words">
              Minh chứng thực tế về chất lượng vật tư chính hãng, thẩm mỹ lắp đặt chuẩn kỹ thuật và hiệu quả sinh điện cao cho khách hàng của Đức Vinh Solar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto min-w-0">
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenAddProject}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Dự Án Mới</span>
              </button>
            )}

            {/* Category Filter in Bubble Capsule */}
            <div className="flex items-center gap-1.5 p-1.5 glass-pill rounded-2xl sm:rounded-full overflow-x-auto max-w-full scrollbar-none">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 ${
                  activeFilter === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-emerald-800'
                }`}
              >
                Tất Cả ({projects.length})
              </button>
              <button
                onClick={() => setActiveFilter('residential')}
                className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 ${
                  activeFilter === 'residential'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-emerald-800'
                }`}
              >
                Hộ Gia Đình
              </button>
              <button
                onClick={() => setActiveFilter('commercial')}
                className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 ${
                  activeFilter === 'commercial'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-emerald-800'
                }`}
              >
                Nhà Xưởng &amp; C&amp;I
              </button>
              <button
                onClick={() => setActiveFilter('hybrid')}
                className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 ${
                  activeFilter === 'hybrid'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-emerald-800'
                }`}
              >
                Lưu Trữ Hybrid
              </button>
              <button
                onClick={() => setActiveFilter('lighting')}
                className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 ${
                  activeFilter === 'lighting'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-emerald-800'
                }`}
              >
                Chiếu Sáng Năng Lượng
              </button>
            </div>
          </div>
        </div>

        {/* Admin Inline Add / Edit Project Form */}
        {isAdmin && showProjectForm && (
          <div className="mb-10 bg-white rounded-2xl border-2 border-emerald-500 shadow-xl p-4 sm:p-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 min-w-0">
                <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="truncate">
                  {editingProject
                    ? `Chỉnh Sửa Dự Án: ${editingProject.title}`
                    : 'Thêm Dự Án Tiêu Biểu Mới'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowProjectForm(false);
                  setEditingProject(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProjectForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên Dự Án / Công Trình *
                  </label>
                  <input
                    type="text"
                    required
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="VD: Hệ Thống Điện Mặt Trời Hybrid 15kWp – Biệt Thự Hóc Môn"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phân Loại Dự Án
                  </label>
                  <select
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value as ProjectItem['category'])}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  >
                    <option value="residential">Hộ Gia Đình</option>
                    <option value="commercial">Nhà Xưởng &amp; C&amp;I</option>
                    <option value="hybrid">Lưu Trữ Hybrid</option>
                    <option value="lighting">Chiếu Sáng Năng Lượng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Công Suất Lắp Đặt
                  </label>
                  <input
                    type="text"
                    value={projCapacity}
                    onChange={(e) => setProjCapacity(e.target.value)}
                    placeholder="VD: 15 kWp + 15kWh"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Địa Điểm Công Trình
                  </label>
                  <input
                    type="text"
                    value={projLocation}
                    onChange={(e) => setProjLocation(e.target.value)}
                    placeholder="VD: Hóc Môn, TP.HCM"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thời Gian Hoàn Thành
                  </label>
                  <input
                    type="text"
                    value={projDate}
                    onChange={(e) => setProjDate(e.target.value)}
                    placeholder="VD: Tháng 10/2026"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hiệu Quả Sinh Điện / Tiết Kiệm
                  </label>
                  <input
                    type="text"
                    value={projSaving}
                    onChange={(e) => setProjSaving(e.target.value)}
                    placeholder="VD: Tiết kiệm ~6 triệu/tháng"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mô Tả Chi Tiết Dự Án
                  </label>
                  <textarea
                    rows={4}
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    placeholder="Mô tả quy mô, giải pháp kỹ thuật và kết quả nghiệm thu..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thiết Bị Chính Sử Dụng (Mỗi thiết bị 1 dòng)
                  </label>
                  <textarea
                    rows={4}
                    value={projEquipmentText}
                    onChange={(e) => setProjEquipmentText(e.target.value)}
                    placeholder={'20 Tấm pin Longi 580W\n01 Biến tần Deye 12kW\n01 Pin lưu trữ SolaX 10kWh'}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              {/* Multi-Image Input for Project (File upload + URL) */}
              <MultiImageInput
                images={projImages}
                onChange={setProjImages}
                label="Hình Ảnh Thực Tế Dự Án (Thêm nhiều ảnh từ File máy hoặc Link)"
                helperText="Chọn nhiều ảnh công trình từ máy tính / điện thoại hoặc dán link ảnh. Khách hàng có thể bấm xem toàn bộ album ảnh của dự án."
              />

              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectForm(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProject ? 'Lưu Cập Nhật Dự Án' : 'Thêm Dự Án Vào Website'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredProjects.map((project) => {
            const imgs = getProjectImages(project);
            const activeIdx = cardImageIndexes[project.id] || 0;
            const currentImg = imgs[activeIdx] || imgs[0];

            return (
              <div
                key={project.id}
                className="glass-bubble rounded-3xl sm:rounded-[2rem] p-2.5 sm:p-3 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden min-w-0"
              >
                <div className="min-w-0">
                  {/* Visual Header Banner / Multi-Image Gallery for Project */}
                  <div className="h-56 sm:h-64 rounded-[1.35rem] sm:rounded-[1.5rem] bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 relative overflow-hidden text-white group">
                    {currentImg ? (
                      <>
                        <img
                          src={currentImg}
                          alt={project.title}
                          onClick={() => {
                            setViewingProject(project);
                            setLightboxIdx(activeIdx);
                          }}
                          className="w-full h-full object-cover cursor-pointer group-hover:scale-102 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-slate-950/40 pointer-events-none" />
                      </>
                    ) : (
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
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
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900/75 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors shadow-md"
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
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900/75 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors shadow-md"
                          title="Ảnh tiếp theo"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <div className="p-4 sm:p-5 h-full flex flex-col justify-between relative z-10 pointer-events-none">
                      <div className="flex flex-wrap items-start justify-between gap-1.5">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-600/90 backdrop-blur-xs text-white text-[11px] sm:text-xs font-bold border border-emerald-400/40 max-w-full truncate">
                          Công suất: {project.capacity}
                        </span>

                        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
                          {imgs.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setViewingProject(project);
                                setLightboxIdx(activeIdx);
                              }}
                              className="px-2 py-1 rounded-md bg-slate-900/80 hover:bg-emerald-600 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                            >
                              <ImageIcon className="w-3 h-3 text-emerald-300 shrink-0" />
                              <span>{imgs.length > 1 ? `${activeIdx + 1}/${imgs.length}` : 'Ảnh'}</span>
                            </button>
                          )}
                          <span className="text-[11px] text-slate-200 flex items-center gap-1 font-mono bg-slate-900/60 px-2 py-1 rounded-md">
                            <Calendar className="w-3 h-3 shrink-0" />
                            <span className="truncate">{project.completionDate}</span>
                          </span>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1 text-xs text-emerald-200 mb-1 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{project.location}</span>
                        </div>
                        <h3 className="text-base sm:text-xl font-bold font-heading line-clamp-2 break-words">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail strip under Project banner when multiple photos exist */}
                  {imgs.length > 1 && (
                    <div className="px-3 sm:px-5 pt-3 flex items-center gap-2 overflow-x-auto">
                      {imgs.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCardImgIdx(project.id, idx)}
                          className={`w-14 h-10 rounded-md overflow-hidden border-2 shrink-0 transition-all ${
                            activeIdx === idx
                              ? 'border-emerald-600 ring-2 ring-emerald-500/30 opacity-100'
                              : 'border-slate-200 opacity-65 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`${project.title} - ảnh ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Content Details */}
                  <div className="p-3 sm:p-5 min-w-0">
                    {/* Estimated saving callout */}
                    <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-50/75 backdrop-blur-sm border border-emerald-200/80 mb-3.5 sm:mb-4">
                      <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide">
                        Hiệu Quả Sinh Điện &amp; Tiết Kiệm:
                      </div>
                      <div className="text-xs font-semibold text-emerald-700 mt-0.5 break-words">
                        {project.estimatedSaving}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 break-words">
                      {project.description}
                    </p>

                    {/* Key Equipment Tag List */}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 mb-2">
                        Thiết Bị Chính Sử Dụng Trong Dự Án:
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {(Array.isArray(project.keyEquipment) ? project.keyEquipment : []).map((eq, idx) => (
                          <li key={idx} className="flex items-start gap-2 min-w-0">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="break-words min-w-0">{eq}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bottom Consultation CTA + Admin Controls */}
                <div className="px-3 sm:px-4 py-3 border-t border-emerald-900/10 flex flex-wrap items-center justify-between gap-2 min-w-0">
                  {isAdmin ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProject(project)}
                        className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 rounded-full transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Sửa / Thêm Ảnh</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProject(project.id)}
                        className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-100/80 hover:bg-rose-600 hover:text-white rounded-full transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">
                      Cần mô hình tương tự?
                    </span>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    {imgs.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setViewingProject(project);
                          setLightboxIdx(activeIdx);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 glass-pill hover:bg-white rounded-full transition-all flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Xem Album ({imgs.length})</span>
                      </button>
                    )}
                    <a
                      href={`https://zalo.me/${companyInfo.hotlineZalo}?text=${encodeURIComponent('Tôi muốn tư vấn giải pháp tương tự dự án: ' + project.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 text-xs font-bold text-emerald-900 bg-emerald-100/85 hover:bg-emerald-600 hover:text-white rounded-full transition-colors flex items-center gap-1.5 border border-emerald-300/60"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Liên Hệ Zalo</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal for Project Photos */}
      {viewingProject && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setViewingProject(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold font-heading">
                  {viewingProject.title}
                </h3>
                <p className="text-xs text-emerald-300">
                  {viewingProject.location} · Công suất: {viewingProject.capacity}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingProject(null)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {(() => {
                const imgs = getProjectImages(viewingProject);
                const activeUrl = imgs[lightboxIdx] || imgs[0];
                if (!activeUrl) {
                  return (
                    <div className="py-12 text-center text-xs text-slate-500">
                      Dự án này chưa có ảnh đính kèm.
                    </div>
                  );
                }
                return (
                  <>
                    <div className="relative aspect-16/9 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src={activeUrl}
                        alt={viewingProject.title}
                        className="max-h-full max-w-full object-contain"
                      />
                      {imgs.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setLightboxIdx(
                                lightboxIdx === 0 ? imgs.length - 1 : lightboxIdx - 1
                              )
                            }
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/75 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setLightboxIdx(
                                lightboxIdx === imgs.length - 1 ? 0 : lightboxIdx + 1
                              )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/75 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-xs font-mono">
                            Ảnh {lightboxIdx + 1} / {imgs.length}
                          </div>
                        </>
                      )}
                    </div>

                    {imgs.length > 1 && (
                      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                        {imgs.map((u, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setLightboxIdx(i)}
                            className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                              lightboxIdx === i
                                ? 'border-emerald-600 ring-2 ring-emerald-500/40 opacity-100'
                                : 'border-slate-200 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={u} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
