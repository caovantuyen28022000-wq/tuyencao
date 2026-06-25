import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export default function Contacts() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchContacts = async () => {
    const { data } = await axios.get(`${API_BASE}/contacts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  };

  const { data: contacts, isLoading, error } = useQuery({
    queryKey: ['adminContactsList'],
    queryFn: fetchContacts,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, isRead }) => {
      const { data } = await axios.put(`${API_BASE}/contacts/${id}`, { isRead }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminContactsList']);
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Đã xảy ra lỗi.');
    }
  });

  const handleToggleRead = (contact, e) => {
    e.stopPropagation(); // prevent opening details
    updateStatusMutation.mutate({ id: contact.id, isRead: !contact.isRead });
  };

  const handleViewMessage = (contact) => {
    setSelectedContact(contact);
    if (!contact.isRead) {
      updateStatusMutation.mutate({ id: contact.id, isRead: true });
    }
  };

  return (
    <div>
      {/* Title Header */}
      <div className="mb-4">
        <h2 className="m-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold', fontSize: '28px', color: '#0f172a' }}>Hộp thư liên hệ</h2>
        <p className="text-muted m-0" style={{ fontSize: '13px' }}>Đọc và quản lý tin nhắn liên hệ, yêu cầu tư vấn và góp ý từ khách hàng</p>
      </div>

      <div className="row">
        {/* Inbox List */}
        <div className={selectedContact ? "col-lg-7 mb-4" : "col-lg-12 mb-4"}>
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <div className="spinner-border text-dark" role="status">
                <span className="sr-only">Đang tải...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger border-0 shadow-sm p-4 text-center" style={{ borderRadius: '12px', background: '#fff5f5', color: '#e53e3e' }}>
              Lỗi khi tải danh sách tin nhắn. Vui lòng kiểm tra kết nối server.
            </div>
          ) : (
            <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '12px' }}>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                      <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Khách hàng</th>
                      <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Tiêu đề thư</th>
                      <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Trạng thái</th>
                      <th style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Thời gian</th>
                      <th className="text-center" style={{ border: 'none', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '12px' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts && contacts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted" style={{ border: 'none' }}>
                          <i className="fa fa-envelope-o d-block mb-3" style={{ fontSize: '36px', color: '#cbd5e1' }}></i>
                          Hộp thư liên hệ đang trống
                        </td>
                      </tr>
                    ) : (
                      contacts && contacts.map((contact) => (
                        <tr 
                          key={contact.id} 
                          onClick={() => handleViewMessage(contact)}
                          style={{ 
                            background: selectedContact?.id === contact.id ? 'rgba(224, 169, 109, 0.05)' : '#fafafb', 
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            borderColor: selectedContact?.id === contact.id ? '#e0a96d' : 'transparent'
                          }}
                        >
                          <td style={{ border: 'none', padding: '16px', borderRadius: '8px 0 0 8px' }}>
                            <div className="d-flex align-items-center">
                              <div className="d-flex align-items-center justify-content-center font-weight-bold" style={{ 
                                width: '36px', 
                                height: '36px', 
                                borderRadius: '50%', 
                                background: contact.isRead ? '#e2e8f0' : 'rgba(224, 169, 109, 0.15)',
                                color: contact.isRead ? '#64748b' : '#c48a4d',
                                marginRight: '12px',
                                fontSize: '13px'
                              }}>
                                {contact.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-weight-bold" style={{ color: '#334155', fontSize: '13.5px' }}>{contact.name}</div>
                                <small className="text-muted" style={{ fontSize: '11px' }}>{contact.email}</small>
                              </div>
                            </div>
                          </td>
                          <td style={{ border: 'none', padding: '16px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <span style={{ fontWeight: !contact.isRead ? '800' : '500', color: !contact.isRead ? '#0f172a' : '#475569', fontSize: '13px' }}>
                              {contact.subject}
                            </span>
                          </td>
                          <td style={{ border: 'none', padding: '16px' }}>
                            {contact.isRead ? (
                              <span className="badge" style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', fontSize: '10px', padding: '6px 12px', borderRadius: '6px', fontWeight: '700' }}>
                                ĐÃ ĐỌC
                              </span>
                            ) : (
                              <span className="badge" style={{ background: '#fffbeb', color: '#d97706', border: '1px solid rgba(217, 119, 6, 0.2)', fontSize: '10px', padding: '6px 12px', borderRadius: '6px', fontWeight: '800' }}>
                                CHƯA ĐỌC
                              </span>
                            )}
                          </td>
                          <td style={{ border: 'none', padding: '16px', color: '#64748b', fontSize: '13px' }}>
                            {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="text-center" style={{ border: 'none', padding: '16px', borderRadius: '0 8px 8px 0' }} onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={(e) => handleToggleRead(contact, e)} 
                              className="btn btn-sm"
                              style={{ 
                                fontSize: '11px', 
                                fontWeight: '700',
                                color: contact.isRead ? '#64748b' : '#c48a4d',
                                border: `1px solid ${contact.isRead ? '#cbd5e1' : 'rgba(224, 169, 109, 0.3)'}`,
                                background: contact.isRead ? '#f8fafc' : 'rgba(224, 169, 109, 0.05)',
                                padding: '6px 12px',
                                borderRadius: '6px'
                              }}
                            >
                              {contact.isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
 
        {/* Selected Message Detail panel */}
        {selectedContact && (
          <div className="col-lg-5 mb-4">
            <div className="card border-0 shadow-sm p-4 bg-white sticky-top" style={{ top: '90px', borderRadius: '12px' }}>
              <div className="d-flex justify-content-between align-items-start mb-4 pb-2 border-bottom">
                <h4 className="m-0" style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <i className="fa fa-envelope-open-o mr-2 text-muted"></i> Nội dung chi tiết
                </h4>
                <button type="button" className="close" onClick={() => setSelectedContact(null)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>
                  <span>&times;</span>
                </button>
              </div>

              <div className="bg-light p-3 mb-4" style={{ borderRadius: '8px' }}>
                <div className="mb-3">
                  <span className="text-muted d-block" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Khách hàng gửi thư:</span>
                  <div style={{ color: '#0f172a', fontWeight: '700', fontSize: '14px' }}>
                    {selectedContact.name}
                  </div>
                  <small style={{ color: '#64748b', fontSize: '12px' }}>{selectedContact.email}</small>
                </div>
                
                <div className="mb-3">
                  <span className="text-muted d-block" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Chủ đề (Tiêu đề):</span>
                  <div style={{ color: '#0f172a', fontWeight: '700', fontSize: '14.5px' }}>{selectedContact.subject}</div>
                </div>
                
                <div>
                  <span className="text-muted d-block" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Thời gian gửi thư:</span>
                  <div style={{ color: '#334155', fontSize: '13px' }}>
                    <i className="fa fa-clock-o mr-1 text-muted"></i>
                    {new Date(selectedContact.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-muted d-block mb-2" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Thông điệp nhắn gửi:</span>
                <div className="p-3 border rounded" style={{ whiteSpace: 'pre-line', minHeight: '140px', fontSize: '13.5px', lineHeight: '1.7', color: '#334155', background: '#fafafb', borderColor: '#e2e8f0' }}>
                  {selectedContact.message}
                </div>
              </div>

              <div>
                <a href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`} className="btn btn-dark w-100 py-2.5 d-flex align-items-center justify-content-center gap-2" style={{ 
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  fontWeight: '600' 
                }}>
                  <i className="fa fa-reply"></i> Soạn thư trả lời khách hàng
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

