import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export default function Dashboard() {
  const { token } = useAuthStore();

  const fetchStats = async () => {
    const { data } = await axios.get(`${API_BASE}/orders/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  };

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchStats,
  });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border" role="status" style={{ color: '#e0a96d', width: '3rem', height: '3rem' }}>
          <span className="sr-only">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger border-0 p-4 shadow-sm d-flex align-items-center gap-3" style={{ background: '#fff5f5', color: '#e53e3e', borderRadius: '12px' }}>
        <i className="fa fa-exclamation-circle" style={{ fontSize: '24px' }}></i>
        <div>
          <h5 className="m-0 font-weight-bold" style={{ fontSize: '15px' }}>Đã xảy ra lỗi</h5>
          <span style={{ fontSize: '13px' }}>Không thể tải số liệu thống kê. Vui lòng kiểm tra quyền đăng nhập của bạn hoặc khởi động lại server.</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Title Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="m-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold', fontSize: '28px', color: '#0f172a' }}>Tổng quan hệ thống</h2>
          <p className="text-muted m-0" style={{ fontSize: '13px' }}>Báo cáo kinh doanh và thống kê số liệu tổng hợp</p>
        </div>
        <div className="text-muted" style={{ fontSize: '12px' }}>
          <i className="fa fa-refresh mr-1"></i> Cập nhật tự động
        </div>
      </div>
      
      {/* Cards Metric Grid */}
      <div className="row mb-4">
        
        {/* Revenue Card */}
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm p-4 position-relative overflow-hidden transition-all admin-card-hover" style={{ 
            borderRadius: '12px',
            background: '#fff',
            borderLeft: '4px solid #e0a96d'
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted text-uppercase d-block mb-1" style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>Doanh thu</span>
                <span className="h3 mb-0 d-block" style={{ fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>${stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(224, 169, 109, 0.1)', color: '#e0a96d' }}>
                <i className="fa fa-usd" style={{ fontSize: '20px' }}></i>
              </div>
            </div>
            <small className="text-success mt-3 d-flex align-items-center gap-1" style={{ fontSize: '11px', fontWeight: '600' }}>
              <i className="fa fa-arrow-up"></i> 
              <span>(Đã trừ các đơn hủy)</span>
            </small>
          </div>
        </div>

        {/* Orders Card */}
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm p-4 position-relative overflow-hidden transition-all admin-card-hover" style={{ 
            borderRadius: '12px',
            background: '#fff',
            borderLeft: '4px solid #10b981'
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted text-uppercase d-block mb-1" style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>Đơn hàng</span>
                <span className="h3 mb-0 d-block" style={{ fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>{stats.totalOrders}</span>
              </div>
              <div className="d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <i className="fa fa-shopping-cart" style={{ fontSize: '20px' }}></i>
              </div>
            </div>
            <small className="text-muted mt-3 d-block" style={{ fontSize: '11px' }}>Tất cả trạng thái đơn hàng</small>
          </div>
        </div>

        {/* Products Card */}
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm p-4 position-relative overflow-hidden transition-all admin-card-hover" style={{ 
            borderRadius: '12px',
            background: '#fff',
            borderLeft: '4px solid #3b82f6'
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted text-uppercase d-block mb-1" style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>Sản phẩm</span>
                <span className="h3 mb-0 d-block" style={{ fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>{stats.totalProducts}</span>
              </div>
              <div className="d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(59, 82, 246, 0.1)', color: '#3b82f6' }}>
                <i className="fa fa-diamond" style={{ fontSize: '20px' }}></i>
              </div>
            </div>
            <small className="text-muted mt-3 d-block" style={{ fontSize: '11px' }}>Danh mục trang sức đang bán</small>
          </div>
        </div>

        {/* Items Sold Card */}
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm p-4 position-relative overflow-hidden transition-all admin-card-hover" style={{ 
            borderRadius: '12px',
            background: '#fff',
            borderLeft: '4px solid #a855f7'
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted text-uppercase d-block mb-1" style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>Đã bán ra</span>
                <span className="h3 mb-0 d-block" style={{ fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>{stats.totalItemsSold}</span>
              </div>
              <div className="d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                <i className="fa fa-gift" style={{ fontSize: '20px' }}></i>
              </div>
            </div>
            <small className="text-muted mt-3 d-block" style={{ fontSize: '11px' }}>Tổng số sản phẩm trong giỏ đặt</small>
          </div>
        </div>

      </div>

      {/* Row Charts */}
      <div className="row mb-4">
        
        {/* Table revenue detail column - Full Width */}
        <div className="col-lg-12">
          <div className="card border-0 shadow-sm p-4 mb-0" style={{ borderRadius: '12px', background: '#fff' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                Chi tiết doanh thu hàng ngày
              </h4>
              <span className="badge badge-light" style={{ background: '#f1f5f9', color: '#64748b', fontSize: '11px', padding: '6px 12px' }}>Dữ liệu gần nhất</span>
            </div>
            
            {stats.revenueChart.length === 0 ? (
              <div className="text-center py-5 text-muted" style={{ fontSize: '13px' }}>
                <i className="fa fa-folder-open-o d-block mb-3" style={{ fontSize: '32px', color: '#cbd5e1' }}></i>
                Chưa có dữ liệu giao dịch phát sinh.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                      <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '12px', paddingBottom: '12px' }}>NGÀY GIAO DỊCH</th>
                      <th className="text-right" style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '12px', paddingBottom: '12px' }}>DOANH THU</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.revenueChart.map((item, idx) => (
                      <tr key={idx} style={{ background: '#fafafb', transition: 'all 0.2s' }}>
                        <td style={{ border: 'none', padding: '16px', borderRadius: '8px 0 0 8px', fontWeight: '600', color: '#334155', fontSize: '13.5px' }}>
                          <i className="fa fa-calendar-check-o mr-2 text-muted" style={{ fontSize: '14px' }}></i>
                          {item.date}
                        </td>
                        <td className="text-right" style={{ border: 'none', padding: '16px', borderRadius: '0 8px 8px 0', fontWeight: '800', color: '#e0a96d', fontSize: '15px' }}>
                          ${item.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Administration instructions row - Footer position */}
      <div className="row">
        <div className="col-lg-12">
          <div className="card border-0 shadow-sm p-4 text-white position-relative overflow-hidden" style={{ 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.3)'
          }}>
            <div style={{ position: 'absolute', right: '40px', top: '-15px', opacity: 0.05, fontSize: '120px', transform: 'rotate(-15deg)', color: '#fff', pointerEvents: 'none' }}>
              <i className="fa fa-diamond"></i>
            </div>
            
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#e0a96d', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>
              Hướng dẫn quản trị hệ thống
            </h4>
            
            <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.7', marginBottom: '24px' }}>
              Chào mừng bạn đến với trang quản trị Mojuri Jewelry Store. Sử dụng các menu trên bảng điều khiển bên trái để bắt đầu quản trị các tài nguyên hệ thống:
            </p>
            
            <div className="row" style={{ fontSize: '13px' }}>
              <div className="col-md-3 mb-3 mb-md-0">
                <div className="d-flex align-items-start gap-2">
                  <span style={{ color: '#e0a96d', marginRight: '8px' }}><i className="fa fa-check-circle"></i></span>
                  <span style={{ color: '#cbd5e1' }}><strong>Sản phẩm:</strong> Thêm mới, sửa thông tin, giá bán và cập nhật số lượng kho hàng trang sức.</span>
                </div>
              </div>
              <div className="col-md-3 mb-3 mb-md-0">
                <div className="d-flex align-items-start gap-2">
                  <span style={{ color: '#e0a96d', marginRight: '8px' }}><i className="fa fa-check-circle"></i></span>
                  <span style={{ color: '#cbd5e1' }}><strong>Đơn hàng:</strong> Theo dõi, cập nhật trạng thái vận chuyển và hóa đơn đơn hàng.</span>
                </div>
              </div>
              <div className="col-md-3 mb-3 mb-md-0">
                <div className="d-flex align-items-start gap-2">
                  <span style={{ color: '#e0a96d', marginRight: '8px' }}><i className="fa fa-check-circle"></i></span>
                  <span style={{ color: '#cbd5e1' }}><strong>Bài viết:</strong> Viết tin tức chia sẻ bí quyết sử dụng, bảo quản và lựa chọn trang sức.</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-start gap-2">
                  <span style={{ color: '#e0a96d', marginRight: '8px' }}><i className="fa fa-check-circle"></i></span>
                  <span style={{ color: '#cbd5e1' }}><strong>Liên hệ:</strong> Đọc ý kiến đóng góp, thắc mắc từ khách hàng và gửi email phản hồi.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

