import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export default function Blogs() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const [editingBlog, setEditingBlog] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Tips',
    status: 'DRAFT',
    coverImage: 'media/blog/1.jpg',
    content: ''
  });

  const fetchAdminBlogs = async () => {
    const { data } = await axios.get(`${API_BASE}/blogs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  };

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['adminBlogsList'],
    queryFn: fetchAdminBlogs,
  });

  const createMutation = useMutation({
    mutationFn: async (newBlog) => {
      const { data } = await axios.post(`${API_BASE}/blogs`, newBlog, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminBlogsList']);
      closeForm();
      alert('Bài viết đã được tạo thành công!');
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Đã có lỗi xảy ra.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedBlog }) => {
      const { data } = await axios.put(`${API_BASE}/blogs/${id}`, updatedBlog, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminBlogsList']);
      closeForm();
      alert('Bài viết đã được cập nhật thành công!');
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Đã có lỗi xảy ra.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${API_BASE}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminBlogsList']);
      alert('Bài viết đã được xóa thành công!');
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Đã có lỗi xảy ra.');
    }
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      category: blog.category,
      status: blog.status,
      coverImage: blog.coverImage,
      content: blog.content
    });
    setIsFormOpen(true);
    setTimeout(() => {
      document.getElementById('blog-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      category: 'Tips',
      status: 'DRAFT',
      coverImage: 'media/blog/1.jpg',
      content: ''
    });
    setIsFormOpen(true);
    setTimeout(() => {
      document.getElementById('blog-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBlog(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      content: formData.content,
      coverImage: formData.coverImage,
      category: formData.category,
      status: formData.status
    };

    if (editingBlog) {
      updateMutation.mutate({ id: editingBlog.id, updatedBlog: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div>
      {/* Title Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="m-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold', fontSize: '28px', color: '#0f172a' }}>Quản lý bài viết</h2>
          <p className="text-muted m-0" style={{ fontSize: '13px' }}>Đăng bài chia sẻ kinh nghiệm trang sức, xu hướng thời trang và tin tức mới nhất</p>
        </div>
        <button onClick={handleOpenCreateForm} className="btn d-flex align-items-center justify-content-center gap-2" style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
          color: '#fff', 
          fontWeight: '600', 
          fontSize: '13px', 
          padding: '10px 18px', 
          border: 'none', 
          borderRadius: '8px', 
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
          transition: 'all 0.3s ease'
        }}>
          <i className="fa fa-plus"></i> Viết bài mới
        </button>
      </div>

      {/* Form Card Overlay */}
      {isFormOpen && (
        <div id="blog-form-anchor" className="card p-4 mb-4 border-0 shadow-sm transition-all" style={{ borderRadius: '12px', background: '#fff' }}>
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <h4 className="m-0" style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {editingBlog ? 'Sửa đổi nội dung bài viết' : 'Biên soạn bài viết tin tức mới'}
            </h4>
            <button type="button" className="close" onClick={closeForm} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tiêu đề bài viết</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control form-control-lg" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} required />
              </div>
              <div className="col-md-3 mb-3 mb-md-0">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Chuyên mục</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="form-select form-control form-control-lg" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="Tips">Tips</option>
                  <option value="Collections">Collections</option>
                  <option value="News">News</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trạng thái xuất bản</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="form-select form-control form-control-lg" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="DRAFT">DRAFT (Bản nháp)</option>
                  <option value="PUBLISHED">PUBLISHED (Công khai)</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Đường dẫn ảnh bìa bài viết (Cover Image path)</label>
              <input type="text" name="coverImage" value={formData.coverImage} onChange={handleInputChange} className="form-control form-control-lg" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} required />
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nội dung bài viết (Có thể soạn thảo bằng HTML)</label>
              <textarea name="content" value={formData.content} onChange={handleInputChange} className="form-control form-control-lg" rows="6" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', lineHeight: '1.6' }} required></textarea>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button type="button" onClick={closeForm} className="btn btn-light px-4 py-2" style={{ borderRadius: '8px', fontWeight: '600', fontSize: '13px', border: '1px solid #e2e8f0', color: '#64748b' }}>Hủy bỏ</button>
              <button type="submit" className="btn px-4 py-2" style={{ borderRadius: '8px', fontWeight: '600', fontSize: '13px', background: 'linear-gradient(135deg, #e0a96d 0%, #c48a4d 100%)', color: '#fff', border: 'none' }}>Lưu thay đổi</button>
            </div>
          </form>
        </div>
      )}

      {/* Listing Blogs Table */}
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-dark" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '12px' }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Ảnh bìa</th>
                  <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Tiêu đề bài viết</th>
                  <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Danh mục</th>
                  <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Trạng thái</th>
                  <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Ngày tạo</th>
                  <th className="text-center" style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {blogs && blogs.map((blog) => (
                  <tr key={blog.id} style={{ background: '#fafafb', transition: 'all 0.2s' }}>
                    <td style={{ border: 'none', padding: '12px 16px', borderRadius: '8px 0 0 8px' }}>
                      <div style={{ width: '70px', height: '48px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#fff' }}>
                        <img src={`/${blog.coverImage}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/blog/1.jpg"} />
                      </div>
                    </td>
                    <td style={{ border: 'none', padding: '12px 16px', fontWeight: '700', color: '#334155', fontSize: '13.5px', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {blog.title}
                    </td>
                    <td style={{ border: 'none', padding: '12px 16px' }}>
                      <span className="badge" style={{ 
                        background: 'rgba(224, 169, 109, 0.1)', 
                        color: '#e0a96d', 
                        border: '1px solid rgba(224, 169, 109, 0.2)',
                        fontSize: '11px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontWeight: '700'
                      }}>{blog.category}</span>
                    </td>
                    <td style={{ border: 'none', padding: '12px 16px' }}>
                      {blog.status === 'PUBLISHED' ? (
                        <span className="badge" style={{ background: '#ecfdf5', color: '#059669', fontSize: '11px', padding: '6px 12px', borderRadius: '6px', fontWeight: '700' }}>
                          <i className="fa fa-globe mr-1"></i> PUBLIC
                        </span>
                      ) : (
                        <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontSize: '11px', padding: '6px 12px', borderRadius: '6px', fontWeight: '700' }}>
                          <i className="fa fa-pencil-square-o mr-1"></i> NHÁP
                        </span>
                      )}
                    </td>
                    <td style={{ border: 'none', padding: '12px 16px', color: '#64748b', fontSize: '13px' }}>
                      {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="text-center" style={{ border: 'none', padding: '12px 16px', borderRadius: '0 8px 8px 0' }}>
                      <div className="d-flex justify-content-center gap-2">
                        <button onClick={() => handleEditClick(blog)} className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', borderRadius: '6px', padding: 0 }} title="Sửa">
                          <i className="fa fa-pencil"></i>
                        </button>
                        <button onClick={() => handleDeleteClick(blog.id)} className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', borderRadius: '6px', padding: 0 }} title="Xóa">
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

