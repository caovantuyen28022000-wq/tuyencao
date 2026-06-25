import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export default function Products() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    stock: '',
    category: 'Rings',
    thumbnail: 'media/product/1.jpg',
    images: 'media/product/1.jpg'
  });

  const fetchAdminProducts = async () => {
    const { data } = await axios.get(`${API_BASE}/products?limit=100`);
    return data.products;
  };

  const { data: products, isLoading } = useQuery({
    queryKey: ['adminProductsList'],
    queryFn: fetchAdminProducts,
  });

  const createMutation = useMutation({
    mutationFn: async (newProduct) => {
      const { data } = await axios.post(`${API_BASE}/products`, newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProductsList']);
      closeForm();
      alert('Sản phẩm đã được tạo thành công!');
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Đã có lỗi xảy ra.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedProduct }) => {
      const { data } = await axios.put(`${API_BASE}/products/${id}`, updatedProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProductsList']);
      closeForm();
      alert('Sản phẩm đã được cập nhật thành công!');
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Đã có lỗi xảy ra.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${API_BASE}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProductsList']);
      alert('Đã xóa sản phẩm thành công!');
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

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      salePrice: product.salePrice ? product.salePrice.toString() : '',
      stock: product.stock.toString(),
      category: product.category,
      thumbnail: product.thumbnail,
      images: Array.isArray(product.images) ? product.images.join(', ') : (product.images || '')
    });
    setIsFormOpen(true);
    setTimeout(() => {
      document.getElementById('product-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      salePrice: '',
      stock: '',
      category: 'Rings',
      thumbnail: 'media/product/1.jpg',
      images: 'media/product/1.jpg'
    });
    setIsFormOpen(true);
    setTimeout(() => {
      document.getElementById('product-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const priceNum = parseFloat(formData.price);
    const salePriceNum = formData.salePrice ? parseFloat(formData.salePrice) : null;
    const stockNum = parseInt(formData.stock);

    if (salePriceNum !== null && salePriceNum >= priceNum) {
      alert('Lỗi logic: Giá khuyến mãi phải nhỏ hơn giá bán gốc!');
      return;
    }

    let galleryImages = [];
    if (formData.images.trim()) {
      galleryImages = formData.images.split(',').map(img => img.trim()).filter(Boolean);
    } else {
      galleryImages = [formData.thumbnail];
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: priceNum,
      salePrice: salePriceNum,
      stock: stockNum,
      category: formData.category,
      thumbnail: formData.thumbnail,
      images: galleryImages
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, updatedProduct: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div>
      {/* Title Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="m-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold', fontSize: '28px', color: '#0f172a' }}>Danh mục sản phẩm</h2>
          <p className="text-muted m-0" style={{ fontSize: '13px' }}>Quản lý kho hàng, thông tin chi tiết và giá bán trang sức</p>
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
          <i className="fa fa-plus"></i> Thêm sản phẩm
        </button>
      </div>

      {/* Form Card Overlay */}
      {isFormOpen && (
        <div id="product-form-anchor" className="card p-4 mb-4 border-0 shadow-sm transition-all" style={{ borderRadius: '12px', background: '#fff' }}>
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <h4 className="m-0" style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {editingProduct ? 'Cập nhật thông tin sản phẩm' : 'Thêm sản phẩm trang sức mới'}
            </h4>
            <button type="button" className="close" onClick={closeForm} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tên sản phẩm</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control form-control-lg" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Nhập tên trang sức (Ví dụ: Diamond Eternity Ring)" required />
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Danh mục</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="form-select form-control form-control-lg" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="Rings">Rings (Nhẫn)</option>
                  <option value="Necklaces">Necklaces (Dây chuyền)</option>
                  <option value="Earrings">Earrings (Khuyên tai)</option>
                  <option value="Bracelets">Bracelets (Vòng tay)</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4 mb-3 mb-md-0">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Giá bán gốc ($)</label>
                <input type="number" step="0.01" min="0.01" name="price" value={formData.price} onChange={handleInputChange} className="form-control form-control-lg" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Ví dụ: 150.00" required />
              </div>
              <div className="col-md-4 mb-3 mb-md-0">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Giá khuyến mãi ($)</label>
                <input type="number" step="0.01" min="0" name="salePrice" value={formData.salePrice} onChange={handleInputChange} className="form-control form-control-lg" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Để trống nếu không giảm giá" />
              </div>
              <div className="col-md-4">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Số lượng tồn kho</label>
                <input type="number" min="0" name="stock" value={formData.stock} onChange={handleInputChange} className="form-control form-control-lg" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Ví dụ: 25" required />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Đường dẫn ảnh đại diện (Thumbnail)</label>
                <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleInputChange} className="form-control form-control-lg" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Ví dụ: media/product/1.jpg" required />
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bộ sưu tập ảnh phụ (Cách nhau bằng dấu phẩy)</label>
                <input type="text" name="images" value={formData.images} onChange={handleInputChange} className="form-control form-control-lg" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Ví dụ: media/product/1.jpg, media/product/1-2.jpg" required />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mô tả chi tiết sản phẩm</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-control form-control-lg" rows="3" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Nhập mô tả sản phẩm trang sức..." required></textarea>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button type="button" onClick={closeForm} className="btn btn-light px-4 py-2" style={{ borderRadius: '8px', fontWeight: '600', fontSize: '13px', border: '1px solid #e2e8f0', color: '#64748b' }}>Hủy bỏ</button>
              <button type="submit" className="btn px-4 py-2" style={{ borderRadius: '8px', fontWeight: '600', fontSize: '13px', background: 'linear-gradient(135deg, #e0a96d 0%, #c48a4d 100%)', color: '#fff', border: 'none' }}>Lưu thay đổi</button>
            </div>
          </form>
        </div>
      )}

      {/* Listing Products Table */}
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
                  <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Ảnh</th>
                  <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Tên sản phẩm</th>
                  <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Danh mục</th>
                  <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Giá gốc</th>
                  <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Khuyến mãi</th>
                  <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Trạng thái kho</th>
                  <th className="text-center" style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted" style={{ border: 'none' }}>
                      <i className="fa fa-diamond d-block mb-3" style={{ fontSize: '36px', color: '#cbd5e1' }}></i>
                      Không tìm thấy sản phẩm nào trong kho hàng
                    </td>
                  </tr>
                ) : (
                  products && products.map((product) => {
                    const imageSrc = product.thumbnail.startsWith('http') ? product.thumbnail : `/${product.thumbnail}`;
                    return (
                      <tr key={product.id} style={{ background: '#fafafb', transition: 'all 0.2s' }}>
                        <td style={{ border: 'none', padding: '12px 16px', borderRadius: '8px 0 0 8px' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#fff' }}>
                            <img src={imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/product/3.jpg"} />
                          </div>
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', fontWeight: '700', color: '#334155', fontSize: '13.5px' }}>
                          {product.name}
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
                          }}>{product.category}</span>
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#334155', fontSize: '13.5px' }}>
                          ${product.price}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#e11d48', fontWeight: '700', fontSize: '13.5px' }}>
                          {product.salePrice ? `$${product.salePrice}` : <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>-</span>}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px' }}>
                          {product.stock > 0 ? (
                            <span className="badge" style={{ background: '#ecfdf5', color: '#059669', fontSize: '11px', padding: '6px 12px', borderRadius: '6px', fontWeight: '700' }}>
                              <i className="fa fa-check-circle mr-1"></i> {product.stock} cái
                            </span>
                          ) : (
                            <span className="badge" style={{ background: '#fff1f2', color: '#e11d48', fontSize: '11px', padding: '6px 12px', borderRadius: '6px', fontWeight: '700' }}>
                              <i className="fa fa-exclamation-triangle mr-1"></i> Hết hàng
                            </span>
                          )}
                        </td>
                        <td className="text-center" style={{ border: 'none', padding: '12px 16px', borderRadius: '0 8px 8px 0' }}>
                          <div className="d-flex justify-content-center gap-2">
                            <button onClick={() => handleEditClick(product)} className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', borderRadius: '6px', padding: 0 }} title="Sửa">
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button onClick={() => handleDeleteClick(product.id)} className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', borderRadius: '6px', padding: 0 }} title="Xóa">
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

