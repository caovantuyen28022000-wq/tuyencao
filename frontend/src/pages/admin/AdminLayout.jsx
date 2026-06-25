import React, { useEffect } from 'react';
import { NavLink, useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
    } else {
      document.body.className = 'admin-page';
    }

    return () => {
      document.body.className = 'home';
    };
  }, [user, navigate]);

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '13.5px',
    color: isActive ? '#e0a96d' : '#94a3b8',
    background: isActive ? 'rgba(224, 169, 109, 0.12)' : 'transparent',
    borderLeft: isActive ? '4px solid #e0a96d' : '4px solid transparent',
    paddingLeft: isActive ? '12px' : '16px',
    borderRadius: '0 8px 8px 0',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    marginBottom: '4px'
  });

  return (
    <div className="admin-container d-flex" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Sidebar navigation */}
      <aside className="admin-sidebar text-white" style={{ 
        width: '260px', 
        flexShrink: 0, 
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10
      }}>
        
        {/* Sidebar Brand header */}
        <div className="text-center py-4 mb-4" style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: '#e0a96d', margin: '0 0 4px 0', fontWeight: 'bold', letterSpacing: '1.5px' }}>MoJuri</h2>
          <span style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Hệ thống quản trị</span>
        </div>
        
        {/* Navigation list */}
        <ul className="nav flex-column mb-auto" style={{ listStyle: 'none', padding: '0 16px 0 0' }}>
          <li className="nav-item">
            <NavLink to="/admin" end style={navLinkStyle}>
              <i className="fa fa-dashboard" style={{ width: '24px', fontSize: '15px' }}></i> 
              <span>Tổng quan</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/products" style={navLinkStyle}>
              <i className="fa fa-diamond" style={{ width: '24px', fontSize: '15px' }}></i>
              <span>Sản phẩm</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/orders" style={navLinkStyle}>
              <i className="fa fa-shopping-cart" style={{ width: '24px', fontSize: '15px' }}></i>
              <span>Đơn hàng</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/blogs" style={navLinkStyle}>
              <i className="fa fa-newspaper-o" style={{ width: '24px', fontSize: '15px' }}></i>
              <span>Bài viết</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/contacts" style={navLinkStyle}>
              <i className="fa fa-envelope" style={{ width: '24px', fontSize: '15px' }}></i>
              <span>Liên hệ</span>
            </NavLink>
          </li>
        </ul>

        {/* Sidebar Footer options */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <Link to="/" className="btn btn-outline-light btn-sm w-100 mb-3 d-flex align-items-center justify-content-center gap-2" style={{ borderColor: 'rgba(255, 255, 255, 0.2)', fontSize: '12px', padding: '8px 12px', borderRadius: '6px' }}>
            <i className="fa fa-arrow-left"></i> Về trang chủ
          </Link>
          <a href="#" onClick={handleLogout} className="btn btn-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2" style={{ background: '#ef4444', border: 'none', fontSize: '12px', padding: '8px 12px', borderRadius: '6px' }}>
            <i className="fa fa-sign-out"></i> Đăng xuất
          </a>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="admin-content-wrapper flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        
        {/* Content Header */}
        <header className="bg-white py-3 px-4 d-flex justify-content-between align-items-center" style={{
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div className="d-flex align-items-center">
            <i className="fa fa-bars text-muted d-lg-none mr-3" style={{ fontSize: '18px', cursor: 'pointer' }}></i>
            <h4 className="m-0" style={{ color: '#0f172a', fontSize: '16px', fontWeight: '700', fontFamily: "'Lato', sans-serif" }}>Console Panel</h4>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: '13px', color: '#64748b' }} className="d-none d-sm-inline">Chào mừng,</span>
            <strong style={{ color: '#0f172a', fontWeight: '600', fontSize: '14px' }}>{user.name}</strong> 
            <span className="badge" style={{ 
              background: 'linear-gradient(135deg, #e0a96d 0%, #c48a4d 100%)', 
              color: '#fff', 
              fontSize: '10px', 
              padding: '6px 12px', 
              borderRadius: '30px', 
              fontWeight: '800', 
              letterSpacing: '0.5px' 
            }}>ADMIN</span>
          </div>
        </header>

        {/* Content page dynamic router */}
        <main className="p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
          <div className="container-fluid p-0">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}
