# 📝 🚀 Task Manager App - Assignment 1 (MMA301)

Chào mừng bạn đến với dự án **Task Manager App**! Đây là ứng dụng quản lý công việc và nhiệm vụ đa nền tảng (chạy mượt mà trên cả Mobile - iOS/Android và Web/Desktop) được phát triển bằng **React Native** và **Expo (SDK 54)** với ngôn ngữ **TypeScript**.

Dự án này là Bài tập lớn số 1 (Assignment 1) dành cho môn học **Multiplatform Mobile Application Development (MMA301)**.

---

## 🌟 Tính Năng Nổi Bật (Key Features)

### 🔑 1. Hệ thống Xác thực (Authentication)
*   **Giao diện Đăng ký / Đăng nhập** hiện đại, trực quan.
*   **Hiệu ứng Chuyển động (Animations)**: Thiết kế responsive đặc biệt cho màn hình lớn (Desktop/Web) với Panel Thương hiệu (Brand Panel) và Form trượt mượt mà (slide transition), mờ/hiện (fade in/out).
*   **Xác thực nâng cao**: Hỗ trợ đăng nhập qua mạng xã hội (Social Login) giả lập và xác thực thực tế với kiểm tra lỗi (validation) đầy đủ.

### 📊 2. Bảng Điều Khiển Trực Quan (Interactive Dashboard)
*   **Thống kê thời gian thực**: Trình bày tổng quan trạng thái công việc với 4 chỉ số chính:
    *   **Tổng số nhiệm vụ (Total Tasks)**
    *   **Đã hoàn thành (Completed)**
    *   **Chờ xử lý (Pending)**
    *   **Quá hạn (Overdue)**
*   **Nút Tạo Task Nhanh**: Tích hợp nút tạo công việc bắt mắt với hiệu ứng màu Gradient chuyển sắc.

### 🛠️ 3. Quản Lý Công Việc Toàn Diện (Full CRUD & Details)
*   **Thêm mới & Chỉnh sửa công việc** với thông tin phong phú:
    *   Tiêu đề công việc (Title).
    *   Phân loại bằng Thẻ (Tags) - hỗ trợ gợi ý thẻ nhanh và tự tạo thẻ tùy chỉnh.
    *   Độ ưu tiên (Priority): Cao (🔥 High), Trung bình (⚡ Medium), Thấp (🌱 Low) được phân biệt bằng màu sắc rõ ràng.
    *   Khoảng thời gian: Ngày bắt đầu (Start Date) và Hạn chót (End/Due Date) bắt buộc bằng giao diện chọn ngày giờ trực quan.
    *   Ghi chú chi tiết (Notes).
    *   **Danh sách công việc con (Subtasks Checklist)** với thanh tiến độ tự động cập nhật phần trăm hoàn thành (ví dụ: `✅ 1/3`).
*   **Xem chi tiết công việc**: Modal xem chi tiết đầy đủ thông tin, hỗ trợ thao tác trực tiếp.

### ⚡ 4. Trải Nghiệm Người Dùng (UX) Tối Ưu
*   **Swipe Actions (Thao tác Vuốt)**: Tích hợp vuốt sang trái để đánh dấu hoàn thành/chưa hoàn thành và vuốt sang phải để xóa nhanh công việc (sử dụng `react-native-gesture-handler/Swipeable`).
*   **Bộ lọc thông minh (Filters)**: Cho phép tìm kiếm theo tiêu đề (Search Bar), lọc theo trạng thái, mức độ ưu tiên hoặc nhãn thẻ (Tags).
*   **Đếm ngược thời gian (Countdown Timer)**: Hiển thị thời gian còn lại đến hạn chót theo thời gian thực (Giờ/Phút/Giây). Cảnh báo đỏ nổi bật đối với các công việc đã quá hạn hoặc sắp đến hạn (trong vòng 2 tiếng).
*   **Giao diện sáng/tối (Light/Dark Mode)**: Tự động điều chỉnh màu sắc giao diện theo Context chủ đề chung của ứng dụng.

---

## 📂 Kiến Trúc Dự Án (Architecture & Directory Structure)

Dự án tuân thủ mô hình phát triển **MVC (Model-View-Controller)** giúp tách biệt rõ ràng giữa logic nghiệp vụ và giao diện hiển thị:

```text
assignment1/
├── app/                      # Điểm khởi chạy của ứng dụng (Expo Router)
│   ├── _layout.tsx           # Layout cấu hình chung, Navigation và Provider
│   └── index.tsx             # Màn hình chính (chuyển đổi giữa Auth View và Home View)
├── controllers/              # Nơi quản lý logic và trạng thái (Controller)
│   ├── useAppController.ts   # Quản lý luồng chính của app, Auth, Animation trượt
│   └── useTaskForm.ts        # Quản lý dữ liệu và validation của form tạo task
├── models/                   # Định nghĩa kiểu dữ liệu (Model)
│   └── types.ts              # Interface cho Task, Subtask
├── components/               # Các UI component tái sử dụng (View)
│   ├── Header.tsx            # Header hiển thị thông tin và nút Logout
│   ├── BrandPanel.tsx        # Panel thương hiệu khi đăng nhập/đăng ký
│   ├── LoginForm.tsx         # Form đăng nhập
│   ├── RegisterForm.tsx      # Form đăng ký
│   ├── Dashboard.tsx         # Bảng điều khiển thống kê công việc
│   ├── SearchBar.tsx         # Thanh tìm kiếm và bộ lọc nhanh
│   ├── TaskList.tsx          # Danh sách cuộn các công việc
│   ├── TaskItem.tsx          # Từng mục công việc với Swipe actions
│   ├── TaskInput.tsx         # Form nhập liệu task mới (Bottom Sheet)
│   ├── TaskDetailModal.tsx   # Modal xem chi tiết công việc
│   ├── TaskEditModal.tsx     # Modal chỉnh sửa nhanh công việc
│   ├── TaskDateTimePicker.tsx# Picker chọn thời gian bắt đầu/kết thúc
│   ├── CustomPickerModal.tsx # Bộ chọn độ ưu tiên và nhãn thẻ tùy biến
│   ├── Dropdown.tsx          # Dropdown chọn lựa lựa chọn lọc
│   └── styles/               # Chứa các file định nghĩa CSS style (isolated stylesheets)
│       ├── index.styles.ts
│       ├── BrandPanel.styles.ts
│       ├── ... (các file style riêng lẻ khác cho từng component)
├── constants/                # Hằng số màu sắc, theme context
│   ├── colors.ts             # Định nghĩa mã màu và palette
│   ├── theme.ts              # Cấu hình theme sáng/tối
│   └── ThemeContext.tsx      # Quản lý trạng thái theme toàn cục
├── utils/                    # Các hàm hỗ trợ tính toán (Helper functions)
│   └── taskHelpers.ts        # Tính toán countdown, màu sắc priority
└── package.json              # Quản lý thư viện phụ thuộc và scripts
```

---

## 🛠️ Công Nghệ Sử Dụng (Technology Stack)

*   **React Native** & **Expo** (SDK 54)
*   **TypeScript** (Định nghĩa kiểu dữ liệu chặt chẽ)
*   **Expo Router** (Hỗ trợ định tuyến dạng thư mục)
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

---

## 📝 Quy trình Nghiệp vụ & Sử dụng (User Workflow)

1.  **Đăng nhập/Đăng ký**: Nhập thông tin tài khoản hợp lệ. Nếu sử dụng màn hình Web/Desktop lớn, bạn sẽ thấy Brand Panel trượt sang phải khi đổi từ Đăng nhập sang Đăng ký rất mượt mà.
2.  **Xem thống kê**: Sau khi đăng nhập thành công, bạn sẽ thấy Dashboard thống kê trạng thái hiện tại.
3.  **Thêm công việc**: Click nút **Create Task**, một Bottom Sheet sẽ trượt lên. Điền tiêu đề, chọn ngày bắt đầu và ngày hoàn thành bắt buộc, thêm các nhãn tag phù hợp, chọn độ ưu tiên và viết ghi chú / tạo các subtask cần làm.
4.  **Tương tác công việc**:
    *   Tick vào hình tròn đầu dòng để hoàn thành nhanh công việc.
    *   Vuốt sang trái để Toggle trạng thái hoàn thành.
    *   Vuốt sang phải hoặc nhấn nút Thùng rác để xóa công việc.
    *   Click thẳng vào tên công việc để mở popup xem chi tiết và hoàn thành danh sách Subtask con.
    *   Nhấn nút bút chì để chỉnh sửa nhanh tiêu đề hoặc thêm/bớt Subtask.
