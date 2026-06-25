import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export default function Orders() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAdminOrders = async () => {
    const { data } = await axios.get(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  };

  const { data: orders, isLoading } = useQuery({
    queryKey: ['adminOrdersList'],
    queryFn: fetchAdminOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axios.put(`${API_BASE}/orders/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['adminOrdersList']);
      if (selectedOrder && selectedOrder.id === data.id) {
        setSelectedOrder({ ...selectedOrder, status: data.status });
      }
      alert('Đã cập nhật trạng thái đơn hàng thành công!');
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Không thể cập nhật trạng thái.');
    }
  });

  const handleStatusChange = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'PENDING':
        return { background: '#fffbeb', color: '#b45309', border: '1px solid rgba(180, 83, 9, 0.2)' };
      case 'PROCESSING':
        return { background: '#eff6ff', color: '#1d4ed8', border: '1px solid rgba(29, 78, 216, 0.2)' };
      case 'SHIPPED':
        return { background: '#faf5ff', color: '#7e22ce', border: '1px solid rgba(126, 34, 206, 0.2)' };
      case 'DELIVERED':
        return { background: '#ecfdf5', color: '#047857', border: '1px solid rgba(4, 120, 87, 0.2)' };
      case 'CANCELLED':
        return { background: '#fff1f2', color: '#be123c', border: '1px solid rgba(190, 18, 60, 0.2)' };
      default:
        return { background: '#f8fafc', color: '#475569', border: '1px solid rgba(71, 85, 105, 0.2)' };
    }
  };

  return (
    <div>
      {/* Title Header */}
      <div className="mb-4">
        <h2 className="m-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold', fontSize: '28px', color: '#0f172a' }}>Quản lý đơn đặt hàng</h2>
        <p className="text-muted m-0" style={{ fontSize: '13px' }}>Theo dõi đơn hàng, tổng doanh thu và cập nhật trạng thái vận chuyển</p>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-dark" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          
          {/* Orders Listing Table */}
          <div className="col-12 mb-4">
            <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '12px' }}>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                      <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Mã đơn hàng</th>
                      <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Người nhận</th>
                      <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Điện thoại</th>
                      <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Ngày đặt</th>
                      <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Tổng tiền</th>
                      <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Trạng thái</th>
                      <th className="text-center" style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Cập nhật nhanh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders && orders.map((order) => (
                      <tr key={order.id} style={{ background: '#fafafb', transition: 'all 0.2s', cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                        <td style={{ border: 'none', padding: '16px', borderRadius: '8px 0 0 8px', fontWeight: '700', color: '#334155', fontSize: '13px' }}>
                          <span className="text-muted">#</span>{order.id.substring(0, 8)}...
                        </td>
                        <td style={{ border: 'none', padding: '16px', fontWeight: '600', color: '#334155', fontSize: '13.5px' }}>{order.name}</td>
                        <td style={{ border: 'none', padding: '16px', color: '#475569', fontSize: '13px' }}>{order.phone}</td>
                        <td style={{ border: 'none', padding: '16px', color: '#475569', fontSize: '13px' }}>
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td style={{ border: 'none', padding: '16px', fontWeight: '800', color: '#e0a96d', fontSize: '14px' }}>
                          ${order.totalPrice.toLocaleString()}
                        </td>
                        <td style={{ border: 'none', padding: '16px' }}>
                          <span className="badge" style={{ 
                            fontSize: '10.5px',
                            padding: '6px 12px',
                            borderRadius: '30px',
                            fontWeight: '800',
                            ...getStatusBadgeStyle(order.status)
                          }}>{order.status}</span>
                        </td>
                        <td className="text-center" style={{ border: 'none', padding: '16px', borderRadius: '0 8px 8px 0' }} onClick={(e) => e.stopPropagation()}>
                          <select 
                            value={order.status} 
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="form-select form-control"
                            style={{ 
                              width: '140px', 
                              display: 'inline-block', 
                              fontSize: '12px', 
                              borderRadius: '6px', 
                              border: '1px solid #cbd5e1', 
                              padding: '6px 12px',
                              height: 'auto',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Selected Order Detail Panel */}
          {selectedOrder && (
            <div className="col-12 mt-2">
              <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '12px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                  <h4 className="m-0" style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <i className="fa fa-file-text-o mr-2 text-muted"></i>
                    Chi tiết hóa đơn đơn hàng: #{selectedOrder.id}
                  </h4>
                  <button onClick={() => setSelectedOrder(null)} className="btn btn-sm btn-outline-secondary px-3 py-1.5" style={{ borderRadius: '6px', fontWeight: '600' }}>
                    Đóng chi tiết
                  </button>
                </div>
                
                <div className="row mb-4 bg-light p-3" style={{ borderRadius: '8px', margin: '0' }}>
                  <div className="col-md-6 mb-3 mb-md-0">
                    <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>Thông tin người nhận</h6>
                    <p className="mb-2" style={{ fontSize: '13.5px' }}><strong>Họ và tên:</strong> {selectedOrder.name}</p>
                    <p className="mb-2" style={{ fontSize: '13.5px' }}><strong>Email:</strong> {selectedOrder.email}</p>
                    <p className="mb-0" style={{ fontSize: '13.5px' }}><strong>Điện thoại:</strong> {selectedOrder.phone}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>Chi tiết vận chuyển & Thanh toán</h6>
                    <p className="mb-2" style={{ fontSize: '13.5px' }}><strong>Địa chỉ giao hàng:</strong> {selectedOrder.address}</p>
                    <p className="mb-2" style={{ fontSize: '13.5px' }}><strong>Ngày lập hóa đơn:</strong> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                    <p className="mb-0" style={{ fontSize: '13.5px' }}><strong>Tổng thanh toán:</strong> <span style={{ color: '#e0a96d', fontWeight: '800', fontSize: '16px' }}>${selectedOrder.totalPrice.toLocaleString()}</span></p>
                  </div>
                </div>

                <h5 className="mb-3" style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>Sản phẩm trong đơn hàng</h5>
                <div className="table-responsive">
                  <table className="table table-bordered align-middle" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                    <thead>
                      <tr className="bg-light" style={{ borderColor: '#e2e8f0' }}>
                        <th style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Sản phẩm</th>
                        <th style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Giá bán</th>
                        <th className="text-center" style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Số lượng</th>
                        <th className="text-right" style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => {
                        const imageSrc = item.product.thumbnail.startsWith('http') ? item.product.thumbnail : `/${item.product.thumbnail}`;
                        return (
                          <tr key={item.id} style={{ borderColor: '#e2e8f0' }}>
                            <td style={{ padding: '12px' }}>
                              <div className="d-flex align-items-center">
                                <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', marginRight: '12px', background: '#fff' }}>
                                  <img src={imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/product/3.jpg"} />
                                </div>
                                <span style={{ fontWeight: '600', color: '#334155', fontSize: '13.5px' }}>{item.product.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px', color: '#334155', fontSize: '13.5px' }}>${item.price}</td>
                            <td className="text-center" style={{ padding: '12px', color: '#334155', fontSize: '13.5px' }}>{item.quantity}</td>
                            <td className="text-right font-weight-bold" style={{ padding: '12px', color: '#334155', fontSize: '13.5px' }}>${(item.price * item.quantity).toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

