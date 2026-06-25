# Hướng dẫn Deploy dự án lên Vercel

Dự án này gồm có 2 phần chính:
1. **Backend**: Next.js API (kết nối cơ sở dữ liệu Supabase PostgreSQL qua Prisma).
2. **Frontend**: React + Vite (giao diện người dùng).

Dưới đây là các bước để cấu hình và deploy cả hai phần lên Vercel.

---

## 1. Deploy Backend (Next.js)
Vì Backend được viết bằng Next.js, Vercel hỗ trợ deploy tự động rất tối ưu.

### Các bước thực hiện:
1. Truy cập vào [Vercel Dashboard](https://vercel.com/) và chọn **Add New** > **Project**.
2. Kết nối với tài khoản GitHub và Import repository `tuyencao`.
3. Trong phần cấu hình dự án (**Project Settings**):
   * **Project Name**: Đặt tên (ví dụ: `tuyencao-backend`).
   * **Framework Preset**: Chọn **Next.js**.
   * **Root Directory**: Chọn **`backend`** (Rất quan trọng).
4. Thêm các biến môi trường (**Environment Variables**):
   * `DATABASE_URL`: `postgresql://postgres.mhxebbatnkenjgmiufwc:Tuyencao2000%23@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
   * `DIRECT_URL`: `postgresql://postgres.mhxebbatnkenjgmiufwc:Tuyencao2000%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres`
   * `JWT_SECRET`: Nhập mã bí mật bảo mật tùy ý (Ví dụ: `mojuri_secret_key_for_jwt_auth_987654`).
5. Nhấn **Deploy**. Sau khi hoàn tất, Vercel sẽ cung cấp một URL cho Backend của bạn (Ví dụ: `https://tuyencao-backend.vercel.app`).

---

## 2. Cấu hình & Deploy Frontend (Vite)
Chúng tôi đã cấu hình toàn bộ các file gọi API trong Frontend để đọc URL của Backend từ biến môi trường `VITE_API_BASE` thay vì hardcode `localhost:3000`.

### Các bước thực hiện:
1. Quay lại [Vercel Dashboard](https://vercel.com/) và chọn **Add New** > **Project**.
2. Tiếp tục Import repository `tuyencao`.
3. Trong phần cấu hình dự án (**Project Settings**):
   * **Project Name**: Đặt tên (ví dụ: `tuyencao-frontend` hoặc `tuyencao`).
   * **Framework Preset**: Chọn **Vite**.
   * **Root Directory**: Chọn **`frontend`** (Rất quan trọng).
4. Thêm biến môi trường (**Environment Variables**):
   * Tên biến: **`VITE_API_BASE`**
   * Giá trị: URL của Backend bạn vừa deploy ở Bước 1 kèm theo hậu tố `/api` (Ví dụ: `https://tuyencao-backend.vercel.app/api`).
5. Nhấn **Deploy**. Vercel sẽ build giao diện React và xuất bản lên URL chính thức cho bạn!
