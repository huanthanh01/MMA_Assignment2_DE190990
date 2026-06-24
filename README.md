# 📝 🚀 Task Manager App - Assignment 2 (MMA301)

Chào mừng bạn đến với dự án **Task Manager App**! Đây là ứng dụng quản lý công việc và nhiệm vụ đa nền tảng (chạy mượt mà trên cả Mobile - iOS/Android và Web/Desktop) được phát triển bằng **React Native** và **Expo (SDK 54)** với ngôn ngữ **TypeScript**.

Dự án này là Bài tập lớn số 2 (Assignment 2) dành cho môn học **Multiplatform Mobile Application Development (MMA301)**.

---

## 🌟 Tính Năng Nổi Bật (Key Features)

### 🔑 1. Hệ thống Xác thực (Authentication)
*   **Giao diện Đăng ký / Đăng nhập** hiện đại, trực quan.
*   **Hiệu ứng Chuyển động (Animations)**: Thiết kế responsive đặc biệt cho màn hình lớn (Desktop/Web) với Panel Thương hiệu (Brand Panel) và Form trượt mượt mà (slide transition), mờ/hiện (fade in/out).
*   **Xác thực nâng cao**: Hỗ trợ đăng nhập qua mạng xã hội (Social Login) giả lập và xác thực thực tế với kiểm tra lỗi (validation) đầy đủ.
*   **Lưu trữ mật khẩu an toàn**: Mật khẩu được mã hóa bằng **bcryptjs** trước khi lưu vào cơ sở dữ liệu SQLite.
*   **Ghi nhớ đăng nhập (Remember Me)**: Tự động lưu thông tin đăng nhập qua AsyncStorage.

### 🔒 2. Quên Mật Khẩu (Forgot Password) *(MỚI)*
*   **Luồng xử lý 3 bước hoàn chỉnh:**
    1.  **Bước 1 - Xác minh tài khoản (Verify Account)**: Người dùng nhập Username và Email đã đăng ký. Hệ thống kiểm tra trong cơ sở dữ liệu SQLite để xác minh danh tính.
    2.  **Bước 2 - Trang xác nhận thành công**: Sau khi xác minh thành công, hiển thị trang thông báo và cung cấp **link điều hướng** đến trang đặt lại mật khẩu.
    3.  **Bước 3 - Đặt lại mật khẩu (Reset Password)**: Cho phép người dùng tạo mật khẩu mới với các yêu cầu bảo mật nghiêm ngặt.
*   **Yêu cầu mật khẩu mới:**
    *   ✅ Tối thiểu **8 ký tự**
    *   ✅ Ít nhất **1 ký tự in hoa** (A-Z)
    *   ✅ Ít nhất **1 ký tự số** (0-9)
*   **Live Validation Checklist**: Hiển thị trạng thái từng yêu cầu (✅/⚪) theo thời gian thực khi người dùng nhập mật khẩu.
*   **Giao diện nhất quán**: Thiết kế dark theme glassmorphism đồng bộ với các màn hình xác thực khác.

### 📊 3. Bảng Điều Khiển Trực Quan (Interactive Dashboard)
*   **Thống kê thời gian thực**: Trình bày tổng quan trạng thái công việc với 4 chỉ số chính:
    *   **Tổng số nhiệm vụ (Total Tasks)**
    *   **Đã hoàn thành (Completed)**
    *   **Chờ xử lý (Pending)**
    *   **Quá hạn (Overdue)**
*   **Nút Tạo Task Nhanh**: Tích hợp nút tạo công việc bắt mắt với hiệu ứng màu Gradient chuyển sắc.

### 🛠️ 4. Quản Lý Công Việc Toàn Diện (Full CRUD & Details)
*   **Thêm mới & Chỉnh sửa công việc** với thông tin phong phú:
    *   Tiêu đề công việc (Title).
    *   Phân loại bằng Thẻ (Tags) - hỗ trợ gợi ý thẻ nhanh và tự tạo thẻ tùy chỉnh.
    *   Độ ưu tiên (Priority): Cao (🔥 High), Trung bình (⚡ Medium), Thấp (🌱 Low) được phân biệt bằng màu sắc rõ ràng.
    *   Khoảng thời gian: Ngày bắt đầu (Start Date) và Hạn chót (End/Due Date) bắt buộc bằng giao diện chọn ngày giờ trực quan.
    *   Ghi chú chi tiết (Notes).
    *   **Danh sách công việc con (Subtasks Checklist)** với thanh tiến độ tự động cập nhật phần trăm hoàn thành (ví dụ: `✅ 1/3`).
*   **Xem chi tiết công việc**: Modal xem chi tiết đầy đủ thông tin, hỗ trợ thao tác trực tiếp.

### ⚡ 5. Trải Nghiệm Người Dùng (UX) Tối Ưu
*   **Swipe Actions (Thao tác Vuốt)**: Tích hợp vuốt sang trái để đánh dấu hoàn thành/chưa hoàn thành và vuốt sang phải để xóa nhanh công việc (sử dụng `react-native-gesture-handler/Swipeable`).
*   **Bộ lọc thông minh (Filters)**: Cho phép tìm kiếm theo tiêu đề (Search Bar), lọc theo trạng thái, mức độ ưu tiên hoặc nhãn thẻ (Tags).
*   **Đếm ngược thời gian (Countdown Timer)**: Hiển thị thời gian còn lại đến hạn chót theo thời gian thực (Giờ/Phút/Giây). Cảnh báo đỏ nổi bật đối với các công việc đã quá hạn hoặc sắp đến hạn (trong vòng 2 tiếng).
*   **Giao diện sáng/tối (Light/Dark Mode)**: Tự động điều chỉnh màu sắc giao diện theo Context chủ đề chung của ứng dụng.

### 👤 6. Quản Lý Hồ Sơ (Profile Management)
*   **Trang Profile riêng biệt**: Cho phép người dùng xem và cập nhật thông tin cá nhân (Họ tên, Email).
*   **Avatar tự động**: Hiển thị avatar với ký tự đầu tiên của username.
*   **Validation chặt chẽ**: Kiểm tra dữ liệu đầu vào và thông báo lỗi (ví dụ: email trùng).

### 🛡️ 7. Bảng Quản Trị (Admin Panel)
*   **Bảo vệ quyền truy cập**: Chỉ tài khoản `admin` mới có thể truy cập.
*   **Quản lý người dùng**: Xem danh sách toàn bộ người dùng đã đăng ký, xóa tài khoản (trừ admin).
*   **Thống kê cơ sở dữ liệu**: Hiển thị tổng số user và task trong hệ thống.
*   **Danger Zone**: Chức năng xóa toàn bộ dữ liệu (WIPE ALL DATA) với cảnh báo xác nhận an toàn.

### 💾 8. Cơ Sở Dữ Liệu SQLite (Persistent Storage)
*   **expo-sqlite**: Toàn bộ dữ liệu (users, tasks, subtasks) được lưu trữ cục bộ bền vững trên thiết bị.
*   **Seed Data tự động**: Dữ liệu mẫu được tự động tạo khi ứng dụng khởi chạy lần đầu (bao gồm tài khoản admin, user mẫu và các task mẫu).
*   **Foreign Key & Cascade Delete**: Đảm bảo tính toàn vẹn dữ liệu - xóa user sẽ tự động xóa toàn bộ tasks và subtasks liên quan.

---

## 📂 Kiến Trúc Dự Án (Architecture & Directory Structure)

Dự án tuân thủ mô hình phát triển **MVC (Model-View-Controller)** giúp tách biệt rõ ràng giữa logic nghiệp vụ và giao diện hiển thị:

```text
assignment2/
├── app/                          # Điểm khởi chạy và các màn hình (Expo Router)
│   ├── _layout.tsx               # Layout cấu hình chung, Navigation và Provider
│   ├── index.tsx                 # Màn hình chính (chuyển đổi giữa Login và Register)
│   ├── home.tsx                  # Trang chủ - Dashboard & Task list
│   ├── profile.tsx               # Trang quản lý hồ sơ cá nhân
│   ├── admin.tsx                 # Trang quản trị (chỉ dành cho admin)
│   ├── verify-account.tsx        # [MỚI] Trang xác minh tài khoản (Forgot Password - Bước 1+2)
│   └── reset-password.tsx        # [MỚI] Trang đặt lại mật khẩu (Forgot Password - Bước 3)
├── controllers/                  # Nơi quản lý logic và trạng thái (Controller)
│   ├── AppProvider.tsx           # Context Provider bọc toàn bộ ứng dụng
│   ├── useAppController.ts       # Quản lý luồng chính: Auth, Animation, User state
│   └── useTaskForm.ts            # Quản lý dữ liệu và validation của form tạo task
├── models/                       # Định nghĩa kiểu dữ liệu (Model)
│   └── types.ts                  # Interface cho User, Task, Subtask
├── components/                   # Các UI component tái sử dụng (View)
│   ├── Header.tsx                # Header hiển thị thông tin và nút Logout
│   ├── BrandPanel.tsx            # Panel thương hiệu khi đăng nhập/đăng ký
│   ├── LoginForm.tsx             # Form đăng nhập (có nút Forgot Password)
│   ├── RegisterForm.tsx          # Form đăng ký
│   ├── Sidebar.tsx               # Sidebar điều hướng
│   ├── Dashboard.tsx             # Bảng điều khiển thống kê công việc
│   ├── SearchBar.tsx             # Thanh tìm kiếm và bộ lọc nhanh
│   ├── TaskList.tsx              # Danh sách cuộn các công việc
│   ├── TaskItem.tsx              # Từng mục công việc với Swipe actions
│   ├── TaskInput.tsx             # Form nhập liệu task mới (Bottom Sheet)
│   ├── TaskDetailModal.tsx       # Modal xem chi tiết công việc
│   ├── TaskEditModal.tsx         # Modal chỉnh sửa nhanh công việc
│   ├── TaskDateTimePicker.tsx    # Picker chọn thời gian bắt đầu/kết thúc
│   ├── CustomPickerModal.tsx     # Bộ chọn độ ưu tiên và nhãn thẻ tùy biến
│   ├── Dropdown.tsx              # Dropdown chọn lựa lọc
│   └── styles/                   # Chứa các file định nghĩa CSS style (isolated stylesheets)
│       ├── index.styles.ts
│       ├── LoginForm.styles.ts
│       ├── RegisterForm.styles.ts
│       ├── VerifyAccount.styles.ts   # [MỚI] Style cho trang xác minh tài khoản
│       ├── ResetPassword.styles.ts   # [MỚI] Style cho trang đặt lại mật khẩu
│       ├── Profile.styles.ts
│       ├── BrandPanel.styles.ts
│       ├── Dashboard.styles.ts
│       ├── Header.styles.ts
│       ├── Sidebar.styles.ts
│       ├── TaskInput.styles.ts
│       ├── TaskItem.styles.ts
│       ├── TaskList.styles.ts
│       ├── TaskDetailModal.styles.ts
│       ├── CustomPickerModal.styles.ts
│       └── SearchBar.styles.ts
├── constants/                    # Hằng số màu sắc, theme context
│   ├── colors.ts                 # Định nghĩa mã màu và palette
│   ├── theme.ts                  # Cấu hình theme sáng/tối
│   └── ThemeContext.tsx           # Quản lý trạng thái theme toàn cục
├── utils/                        # Các hàm hỗ trợ tính toán (Helper functions)
│   ├── database.ts               # Toàn bộ thao tác SQLite (CRUD users, tasks, subtasks, forgot password)
│   ├── seedData.ts               # Dữ liệu mẫu tự động tạo khi khởi chạy lần đầu
│   └── taskHelpers.ts            # Tính toán countdown, màu sắc priority
└── package.json                  # Quản lý thư viện phụ thuộc và scripts
```

---

## 🛠️ Công Nghệ Sử Dụng (Technology Stack)

*   **React Native** & **Expo** (SDK 54)
*   **TypeScript** (Định nghĩa kiểu dữ liệu chặt chẽ)
*   **Expo Router** (Hỗ trợ định tuyến dạng thư mục - File-based Routing)
*   **Expo SQLite** (Cơ sở dữ liệu cục bộ lưu trữ bền vững)
*   **bcryptjs** (Mã hóa mật khẩu an toàn)
*   **AsyncStorage** (Lưu trữ trạng thái Remember Me)
*   **Expo Linear Gradient** (Tạo dải màu nền sống động)
*   **React Native Gesture Handler & Reanimated** (Xử lý cử chỉ vuốt chạm và các chuyển động mượt mà)
*   **Context API** (Quản lý Theme Light/Dark thống nhất)

---

## 🚀 Hướng Dẫn Cài Đặt và Chạy Dự Án (Getting Started)

### 📌 Yêu cầu hệ thống
*   Đã cài đặt **Node.js** (Khuyến nghị phiên bản LTS mới nhất).
*   Đã cài đặt **Expo Go** trên điện thoại (để chạy trên thiết bị di động thật) hoặc cài đặt trình giả lập Android Studio / Xcode Simulator.

### 🏃 Chạy dự án từng bước:

1.  **Tải mã nguồn về máy** (hoặc mở thư mục dự án này).
2.  **Cài đặt các gói phụ thuộc (Dependencies)**:
    Mở terminal tại thư mục gốc của dự án và chạy lệnh:
    ```bash
    npm install
    ```
3.  **Khởi động Expo Development Server**:
    Chạy lệnh khởi động máy chủ Expo:
    ```bash
    npx expo start
    ```
    *Hoặc nếu bạn muốn chia sẻ/chạy qua đường truyền ngoài (khi chạy trên điện thoại qua 3G/Wifi khác mạng):*
    ```bash
    npx expo start --tunnel
    ```
4.  **Trải nghiệm ứng dụng**:
    *   Quét mã **QR** hiển thị trên terminal bằng ứng dụng **Expo Go** (Android) hoặc Camera mặc định (iOS).
    *   Nhấn phím `a` để chạy trên giả lập Android.
    *   Nhấn phím `i` để chạy trên giả lập iOS.
    *   Nhấn phím `w` để chạy trên giao diện Web (Trình duyệt).

### 🔐 Tài khoản mẫu

| Vai trò | Username | Password |
|---------|----------|----------|
| Admin   | `admin`  | `admin123` |
| User    | `johndoe`| `pass123`  |

---

## 📝 Quy trình Nghiệp vụ & Sử dụng (User Workflow)

1.  **Đăng nhập/Đăng ký**: Nhập thông tin tài khoản hợp lệ. Nếu sử dụng màn hình Web/Desktop lớn, bạn sẽ thấy Brand Panel trượt sang phải khi đổi từ Đăng nhập sang Đăng ký rất mượt mà.
2.  **Quên mật khẩu**: Nhấn "Forgot Password?" → Nhập Username + Email để xác minh → Nhấn link "Reset Password" → Tạo mật khẩu mới đáp ứng yêu cầu bảo mật → Quay lại đăng nhập.
3.  **Xem thống kê**: Sau khi đăng nhập thành công, bạn sẽ thấy Dashboard thống kê trạng thái hiện tại.
4.  **Thêm công việc**: Click nút **Create Task**, một Bottom Sheet sẽ trượt lên. Điền tiêu đề, chọn ngày bắt đầu và ngày hoàn thành bắt buộc, thêm các nhãn tag phù hợp, chọn độ ưu tiên và viết ghi chú / tạo các subtask cần làm.
5.  **Tương tác công việc**:
    *   Tick vào hình tròn đầu dòng để hoàn thành nhanh công việc.
    *   Vuốt sang trái để Toggle trạng thái hoàn thành.
    *   Vuốt sang phải hoặc nhấn nút Thùng rác để xóa công việc.
    *   Click thẳng vào tên công việc để mở popup xem chi tiết và hoàn thành danh sách Subtask con.
    *   Nhấn nút bút chì để chỉnh sửa nhanh tiêu đề hoặc thêm/bớt Subtask.
6.  **Quản lý hồ sơ**: Truy cập trang Profile để cập nhật Họ tên và Email.
7.  **Quản trị hệ thống** *(chỉ admin)*: Truy cập Admin Panel để xem danh sách user, thống kê database hoặc xóa toàn bộ dữ liệu.
