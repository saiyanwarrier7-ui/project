import React, { useState, useEffect } from 'react';
import { Project, User, ProjectCategory, ViewTab, ProjectFile, TeamMember } from '../types';
import { storageService } from '../services/storageService';
import {
  Upload,
  X,
  Plus,
  FileText,
  FileArchive,
  Presentation,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Globe,
  Github,
  Image,
  Layers,
  Sparkles,
} from 'lucide-react';

interface UploadProjectPageProps {
  currentUser: User;
  categories: ProjectCategory[];
  onNavigate: (tab: ViewTab, projectId?: string) => void;
  onProjectSaved: (projectId: string) => void;
  editProjectId?: string;
  projects: Project[];
}

const PRESET_COVERS = [
  { name: 'AI & Neural Systems', url: '/src/assets/images/project_ai_vision_1792043367799.jpg' },
  { name: 'Full-Stack Web App', url: '/src/assets/images/project_web_platform_1792043367920.jpg' },
  { name: 'IoT & Microcontrollers', url: '/src/assets/images/project_iot_smart_1792043368164.jpg' },
  { name: 'Lab Robotics & SLAM', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80' },
  { name: 'Cybersecurity Network', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80' },
  { name: 'Educational LMS', url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80' },
];

export const UploadProjectPage: React.FC<UploadProjectPageProps> = ({
  currentUser,
  categories,
  onNavigate,
  onProjectSaved,
  editProjectId,
  projects,
}) => {
  const existingProject = editProjectId ? projects.find(p => p.id === editProjectId) : null;

  // Form State
  const [title, setTitle] = useState(existingProject?.title || '');
  const [shortDescription, setShortDescription] = useState(existingProject?.shortDescription || '');
  const [abstract, setAbstract] = useState(
    existingProject?.abstract ||
      `### Background & Problem Statement\nDescribe the real-world issue or research question your project addresses.\n\n### System Architecture & Methodology\nExplain the design patterns, hardware/software stack, and data pipelines utilized.\n\n### Experimental Results & Validation\nHighlight benchmarks, latency, accuracy scores, or qualitative feedback from evaluations.`
  );
  const [category, setCategory] = useState(existingProject?.category || categories[0]?.name || 'Web Development');
  const [department, setDepartment] = useState(existingProject?.department || currentUser.department || 'Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState(existingProject?.academicYear || '2025-2026');
  
  // Technologies tag system
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>(
    existingProject?.technologies || ['React', 'TypeScript', 'Node.js']
  );

  // Team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    existingProject?.teamMembers || [{ name: currentUser.name, role: 'Lead Author' }]
  );
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  // URLs
  const [githubUrl, setGithubUrl] = useState(existingProject?.githubUrl || '');
  const [liveDemoUrl, setLiveDemoUrl] = useState(existingProject?.liveDemoUrl || '');

  // Thumbnail
  const [thumbnail, setThumbnail] = useState(existingProject?.thumbnail || PRESET_COVERS[0].url);

  // Files
  const [files, setFiles] = useState<ProjectFile[]>(existingProject?.files || []);

  // UI feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tag: string) => {
    setTechnologies(technologies.filter(t => t !== tag));
  };

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      setTeamMembers([
        ...teamMembers,
        {
          name: newMemberName.trim(),
          role: newMemberRole.trim() || 'Contributor',
        },
      ]);
      setNewMemberName('');
      setNewMemberRole('');
    }
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  // File Upload with validation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    setError('');
    const newProjectFiles: ProjectFile[] = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];

      // Validate size <= 25MB (26214400 bytes)
      if (file.size > 26214400) {
        setError(`File "${file.name}" exceeds the maximum 25 MB limit.`);
        return;
      }

      // Determine type
      const ext = file.name.split('.').pop()?.toLowerCase();
      let type: ProjectFile['type'] = 'pdf';
      if (ext === 'zip' || ext === 'tar' || ext === 'gz' || ext === 'rar') type = 'zip';
      else if (ext === 'ppt' || ext === 'pptx') type = 'ppt';
      else if (ext === 'docx' || ext === 'doc') type = 'docx';
      else if (ext === 'py' || ext === 'js' || ext === 'ts' || ext === 'cpp' || ext === 'java') type = 'code';

      const sizeFormatted =
        file.size > 1048576
          ? `${(file.size / 1048576).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`;

      // Read as DataURL for immediate client download simulation
      const reader = new FileReader();
      reader.onload = () => {
        newProjectFiles.push({
          id: `file_${Date.now()}_${i}`,
          name: file.name,
          type,
          sizeFormatted,
          sizeBytes: file.size,
          url: reader.result as string,
          uploadedAt: new Date().toISOString().split('T')[0],
          description: `Uploaded academic attachment (${type.toUpperCase()})`,
        });

        if (newProjectFiles.length === uploadedFiles.length) {
          setFiles(prev => [...prev, ...newProjectFiles]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Thumbnail file upload
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5242880) {
      setError('Thumbnail image must be less than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setThumbnail(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }
    if (!shortDescription.trim()) {
      setError('Short project summary is required.');
      return;
    }
    if (!abstract.trim()) {
      setError('Detailed abstract and methodology is required.');
      return;
    }
    if (technologies.length === 0) {
      setError('Please add at least one technology or tool.');
      return;
    }

    // URL validation if provided
    if (githubUrl.trim() && !githubUrl.startsWith('http')) {
      setError('GitHub repository URL must start with http:// or https://');
      return;
    }
    if (liveDemoUrl.trim() && !liveDemoUrl.startsWith('http')) {
      setError('Live Website URL must start with http:// or https://');
      return;
    }

    setIsSubmitting(true);

    try {
      if (existingProject) {
        // Update existing project
        const res = storageService.updateProject(
          existingProject.id,
          {
            title: title.trim(),
            shortDescription: shortDescription.trim(),
            abstract: abstract.trim(),
            category,
            department,
            academicYear,
            technologies,
            teamMembers,
            thumbnail,
            files,
            githubUrl: githubUrl.trim(),
            liveDemoUrl: liveDemoUrl.trim(),
          },
          currentUser.id
        );

        if (!res.success) {
          setError(res.error || 'Failed to update project.');
          setIsSubmitting(false);
          return;
        }

        setSuccess(true);
        setTimeout(() => {
          onProjectSaved(existingProject.id);
        }, 1200);
      } else {
        // Create new project
        const newProj = storageService.createProject({
          title: title.trim(),
          shortDescription: shortDescription.trim(),
          abstract: abstract.trim(),
          category,
          technologies,
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          authorDepartment: currentUser.department,
          authorEmail: currentUser.email,
          teamMembers,
          department,
          academicYear,
          thumbnail,
          files,
          githubUrl: githubUrl.trim(),
          liveDemoUrl: liveDemoUrl.trim(),
          status: 'approved', // auto approved in demo
        });

        setSuccess(true);
        setTimeout(() => {
          onProjectSaved(newProj.id);
        }, 1200);
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred while saving the project.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => onNavigate('student-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            Academic Project Submission
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-950 dark:text-white">
            {existingProject ? 'Edit Academic Project' : 'Submit Academic Project'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Share your capstone thesis, engineering prototype, and research documentation with the university community.
          </p>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Project successfully {existingProject ? 'updated' : 'published to repository'}! Redirecting...
            </span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Information */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              1. Project Overview
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI-based Attendance System with Facial Recognition"
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Short Description (1-2 sentences for repository cards) *
              </label>
              <textarea
                required
                rows={2}
                maxLength={200}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief summary highlighting the purpose and core innovation of your project..."
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
              />
              <div className="text-[11px] text-slate-400 text-right mt-1">
                {shortDescription.length}/200 characters
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Biomedical Engineering">Biomedical Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Academic Year *
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                >
                  <option value="2025-2026">2025-2026</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2023-2024">2023-2024</option>
                </select>
              </div>
            </div>

            {/* Detailed Abstract */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Detailed Abstract & Methodology (Markdown supported) *
              </label>
              <textarea
                required
                rows={8}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Detail the background, mathematical model, technical implementation, and empirical benchmarks..."
                className="w-full px-3.5 py-2.5 font-mono text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Section 2: Technologies & Team */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              2. Technologies & Team Members
            </h2>

            {/* Tech Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Technologies Used (Press Enter or click Add) *
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                  placeholder="e.g. PyTorch, React, OpenCV, Docker..."
                  className="flex-1 px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Add Tool
                </button>
              </div>

              {/* Tag Cloud */}
              <div className="flex flex-wrap gap-2 pt-1">
                {technologies.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(t)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Student Authors & Team Members
              </label>

              <div className="space-y-2 mb-3">
                {teamMembers.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">{m.name}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{m.role}</span>
                    </div>
                    {teamMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(i)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Teammate name"
                  className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="Role (e.g. Backend Dev)"
                  className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>
            </div>

          </div>

          {/* Section 3: Live Website & GitHub Repository Links */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              3. Deployment & Source Code Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Live Deployed Website / Demo URL</span>
                </label>
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://my-student-project.vercel.app"
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Enables the interactive "Live Website" button for visitors.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <span>GitHub Repository URL</span>
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/my-username/project-repo"
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Public open-source repository link for code review.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Project Thumbnail */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              4. Cover Image & Thumbnail
            </h2>

            <div>
              <p className="text-xs text-slate-500 mb-3">
                Select an academic domain cover or upload a custom project screenshot (max 5 MB):
              </p>

              {/* Preset selection */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {PRESET_COVERS.map((preset) => (
                  <div
                    key={preset.name}
                    onClick={() => setThumbnail(preset.url)}
                    className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      thumbnail === preset.url
                        ? 'border-blue-600 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-1.5 bg-slate-900/80 text-[10px] text-white font-medium text-center truncate">
                      {preset.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom image upload */}
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Image className="w-4 h-4 text-blue-600" />
                  <span>Upload Custom Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-slate-400">PNG, JPG, WebP supported</span>
              </div>
            </div>
          </div>

          {/* Section 5: Documentation & File Uploads */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              5. Project Documentation & Archives (PDF, ZIP, PPT, DOCX)
            </h2>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <Upload className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Attach Capstone Thesis (PDF), Source Bundle (ZIP), or Presentation Slides (PPT) · Max 25 MB per file
              </p>

              <label className="mt-4 cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors">
                <span>Select Files</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.zip,.tar,.gz,.ppt,.pptx,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Attached Documents ({files.length}):
                </p>
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {file.sizeFormatted} · {file.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('student-dashboard')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors"
            >
              {isSubmitting
                ? 'Processing...'
                : existingProject
                ? 'Save Changes'
                : 'Publish Project to Repository'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
