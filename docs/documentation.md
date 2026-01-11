# FoodFinder - Tài Liệu Kỹ Thuật Chi Tiết (Technical Documentation)

**Phiên bản:** 1.0.0
**Ngày cập nhật:** 25/05/2024
**Mô tả:** Ứng dụng giao đồ ăn nền tảng web (Mobile-first), kết nối người dùng, nhà hàng và tài xế. Tích hợp AI gợi ý món ăn.

---

## 1. Tổng Quan Kiến Trúc (Architecture Overview)

Dự án hiện tại được xây dựng theo mô hình **Single Page Application (SPA)**, sử dụng React làm core, Tailwind CSS cho styling và quản lý trạng thái cục bộ (Local State Management).

### 1.1. Tech Stack (Công nghệ sử dụng)
*   **Frontend Framework:** React 19 (Hooks, Functional Components).
*   **Language:** TypeScript (Strict typing).
*   **Styling:** Tailwind CSS (Utility-first).
*   **Icons:** Lucide React.
*   **Charting/Analytics:** Recharts.
*   **AI Integration:** Google Gemini SDK (`@google/genai`).
*   **Build Tool:** (Giả lập môi trường ES Modules qua `importmap` trong `index.html`).

### 1.2. Cấu Trúc Thư Mục
```
/
├── index.html              # Entry point, cấu hình Tailwind, Fonts, Import maps
├── index.tsx               # Bootstrapping React App
├── App.tsx                 # Main Component, Routing logic, View management
├── types.ts                # Định nghĩa Interfaces, Types, Enums (Data Models)
├── constants.ts            # Mock Data (Giả lập Database)
├── metadata.json           # Cấu hình quyền (Geolocation)
├── services/
│   └── geminiService.ts    # Service kết nối Google Gemini AI
└── docs/
    └── documentation.md    # Tài liệu kỹ thuật này
```

---

## 2. Frontend Specification (Chi tiết Frontend)

### 2.1. Design System (Hệ thống thiết kế)
*   **Font:** `Be Vietnam Pro` (Google Fonts).
*   **Color Palette (Brand Colors):**
    *   Primary: `#ee5f2b` (Brand-500)
    *   Hover: `#ea580c` (Brand-600)
    *   Background: `#f9fafb` (Gray-50)
    *   Text Main: `#111827` (Gray-900)
*   **Responsive Breakpoints:** Mobile-first (`min-width` approach), hỗ trợ `md` (768px) và `lg` (1024px).

### 2.2. Core Components (Thành phần lõi)

#### `App.tsx` - The Router & State Container
*   **State:**
    *   `currentView`: Quản lý màn hình hiển thị (Enum `View`).
    *   `cart`: Mảng `CartItem[]` lưu trữ giỏ hàng tạm thời.
*   **Responsibility:** Điều hướng người dùng dựa trên state, hiển thị Navbar/Footer có điều kiện.

#### Shared Components
*   **`Button`**: Hỗ trợ variants (`primary`, `secondary`, `outline`, `ghost`, `danger`).
*   **`Input`**: Input field chuẩn hóa với hỗ trợ icon trái.
*   **`Badge`**: Hiển thị trạng thái (màu sắc semantic: green, red, yellow).
*   **`Navbar`**: Sticky header, xử lý navigation, hiển thị số lượng giỏ hàng và thông báo (Notification popup).

### 2.3. Chi tiết các màn hình (Views)

1.  **Landing Page (`View.LANDING`)**
    *   **Hero Section:** Tìm kiếm địa điểm, tìm món ăn, nút gọi **AI Suggestion**.
    *   **Logic AI:** Gọi `getMealRecommendation` từ `geminiService` để lấy gợi ý text dựa trên input hoặc context thời gian.
    *   **Categories:** Grid hiển thị danh mục món ăn.

2.  **Auth Page (`View.AUTH`)**
    *   **Layout:** Split-screen (Ảnh bên trái, Form bên phải).
    *   **Chức năng:** Login/Register UI (Hiện tại chỉ chuyển hướng state, chưa call API thực).

3.  **Search Results (`View.SEARCH_RESULTS`)**
    *   **Filter Sidebar:** Lọc theo trạng thái mở cửa, freeship, rating, giá. (Sticky trên Desktop).
    *   **List:** Grid hiển thị `RestaurantCard`.
    *   **Interactions:** Click vào card chuyển sang `RESTAURANT_DETAIL`.

4.  **Restaurant Detail (`View.RESTAURANT_DETAIL`)**
    *   **Hero Banner:** Parallax effect ảnh bìa.
    *   **Sticky Menu Nav:** Thanh cuộn ngang phân loại menu (Phở, Món kèm...).
    *   **Logic:**
        *   Tab "Đánh giá": Hiển thị rating tổng quan và list review.
        *   Tab "Menu": List món ăn, nút Add to Cart.
    *   **Booking Widget:** Form đặt bàn đơn giản bên sidebar phải.

5.  **Checkout (`View.CHECKOUT`)**
    *   **Form:** Địa chỉ nhận hàng, Phương thức thanh toán (Radio group).
    *   **Summary:** Tính tổng tiền hàng + phí ship.

6.  **User Profile (`View.PROFILE`)**
    *   **Tabs System:**
        *   `Info`: Form edit thông tin cá nhân.
        *   `History`: List đơn hàng cũ (Mock data), trạng thái đơn.
        *   `Favorites`: Grid nhà hàng đã like.
        *   `Settings`: Toggle Notification, Dark Mode (UI only), Language.

7.  **Merchant Dashboard (`View.MERCHANT_DASHBOARD`)**
    *   **Responsive Sidebar:** Sidebar dọc trên Desktop, Tabbar ngang trên Mobile.
    *   **Sub-views:**
        *   `Overview`: Biểu đồ doanh thu (`recharts`), KPI cards.
        *   `Menu`: Bảng quản lý món (CRUD UI).
        *   `Bookings`: Danh sách đặt bàn (Pending/Confirmed/Cancelled).
        *   `Reviews`: Trả lời đánh giá khách hàng, Phân tích cảm xúc (Sentiment UI).

8.  **Map Discovery (`View.MAP_DISCOVERY`)**
    *   **UI:** Giả lập bản đồ tương tác.
    *   **Features:** Floating Search Bar, Categories Chips, Bottom Sheet danh sách quán gần nhất (Mobile).

---

## 3. Backend Specification (Đặc tả Backend giả lập)

Hiện tại dự án sử dụng Mock Data tại `constants.ts`. Dưới đây là cấu trúc dữ liệu và API Design pattern để triển khai Backend thực tế (Node.js/Go/Python).

### 3.1. Data Models (Database Schema Design)

**Table: Users**
```typescript
interface User {
  id: string; // UUID
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: 'USER' | 'MERCHANT' | 'ADMIN';
  isVerified: boolean;
  createdAt: Date;
}
```

**Table: Restaurants**
```typescript
interface Restaurant {
  id: string; // UUID
  merchantId: string; // FK -> Users.id
  name: string;
  description: string;
  address: string;
  geo_location: { lat: number, lng: number }; // PostGIS/GeoJSON
  rating: number; // Avg rating
  reviewCount: number;
  deliveryTime: string; // e.g. "20 min"
  minPrice: number;
  maxPrice: number;
  image: string; // URL to CDN
  tags: string[]; // JSON Array or Relation
  status: 'OPEN' | 'CLOSED';
}
```

**Table: MenuItems**
```typescript
interface MenuItem {
  id: string; // UUID
  restaurantId: string; // FK -> Restaurants.id
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  isPopular: boolean;
}
```

**Table: Orders**
```typescript
interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: Array<{ menuItemId: string, quantity: number, price: number }>; // JSONB
  totalAmount: number;
  status: 'PENDING' | 'PREPARING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: 'CASH' | 'WALLET' | 'CARD';
  createdAt: Date;
}
```

**Table: Bookings** (Đặt bàn)
```typescript
interface Booking {
  id: string;
  restaurantId: string;
  userId: string; // hoặc Guest info
  bookingTime: Date;
  guestCount: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  note?: string;
}
```

### 3.2. API Endpoints Definition (RESTful Standards)

Dưới đây là các API cần thiết để thay thế Mock Data hiện tại:

#### Auth
*   `POST /api/auth/login`: Trả về JWT Token.
*   `POST /api/auth/register`: Tạo user mới.

#### Restaurants (End-User)
*   `GET /api/restaurants`: Tìm kiếm, lọc (query params: `q`, `category`, `price_range`, `sort`).
*   `GET /api/restaurants/:id`: Lấy chi tiết quán.
*   `GET /api/restaurants/:id/menu`: Lấy danh sách món ăn.
*   `GET /api/restaurants/:id/reviews`: Lấy danh sách đánh giá.

#### Orders
*   `POST /api/orders`: Tạo đơn hàng mới (Checkout).
*   `GET /api/orders/history`: Lấy lịch sử đơn hàng của User (Profile -> History).
*   `GET /api/orders/:id`: Theo dõi trạng thái đơn hàng.

#### User Profile
*   `GET /api/user/profile`: Lấy thông tin user.
*   `PUT /api/user/profile`: Cập nhật thông tin.
*   `GET /api/user/favorites`: Lấy danh sách quán yêu thích.
*   `POST /api/user/favorites/:restaurantId`: Toggle yêu thích.

#### Merchant Portal (Protected Routes)
*   `GET /api/merchant/dashboard`: Lấy số liệu thống kê (Overview).
*   `GET /api/merchant/menu`: Lấy danh sách món.
*   `POST /api/merchant/menu`: Thêm món mới.
*   `PUT /api/merchant/menu/:id`: Sửa món.
*   `DELETE /api/merchant/menu/:id`: Xóa món.
*   `GET /api/merchant/bookings`: Lấy danh sách đặt bàn.
*   `PUT /api/merchant/bookings/:id/status`: Duyệt/Từ chối đặt bàn.

---

## 4. AI Service Specification (Gemini Integration)

**File:** `services/geminiService.ts`

### 4.1. Cấu hình
*   **Model:** `gemini-3-flash-preview` (Tối ưu tốc độ cho gợi ý realtime).
*   **Authentication:** Sử dụng `process.env.API_KEY` (Được inject từ môi trường chạy).

### 4.2. Prompt Engineering Strategy
Khi gọi hàm `getMealRecommendation(preferences)`, prompt được cấu trúc như sau:
```text
"Suggest 3 vietnamese dishes for someone who likes: ${preferences}. Return valid JSON array of strings."
```
*   **Input:** Text từ thanh tìm kiếm người dùng (VD: "Bữa trưa nhanh gọn", "Món nước").
*   **Output Expected:** JSON Array (Để Frontend dễ parse và hiển thị).
*   **Future Improvement:** Cần bổ sung Context về thời gian (Sáng/Trưa/Tối) và Vị trí để gợi ý chính xác hơn.

---

## 5. Quy trình nghiệp vụ (Business Logic Flows)

### 5.1. Luồng Đặt Hàng (User Flow)
1.  **User** vào **Landing Page**.
2.  Nhập từ khóa hoặc chọn Category -> Chuyển sang **Search Results**.
3.  Chọn quán -> Chuyển sang **Restaurant Detail**.
4.  Chọn món (Click "+") -> Add item vào `cart` state.
5.  Click icon Giỏ hàng -> Chuyển sang **Checkout**.
6.  Nhập thông tin giao hàng & Thanh toán -> Click "Đặt hàng".
7.  Hệ thống clear `cart`, chuyển sang **Order Success**.

### 5.2. Luồng Quản lý của Đối tác (Merchant Flow)
1.  **Merchant** truy cập **Merchant Dashboard**.
2.  Xem **Overview** để nắm doanh thu.
3.  Vào tab **Bookings**:
    *   Thấy booking trạng thái `Pending` (Màu vàng).
    *   Click "Nhận" -> Booking chuyển sang `Confirmed` (Màu xanh).
4.  Vào tab **Menu**:
    *   Sửa giá hoặc Tắt trạng thái "Còn hàng" nếu món hết.
5.  Vào tab **Reviews**:
    *   Đọc đánh giá mới.
    *   Nhập nội dung trả lời -> Gửi phản hồi.

---

## 6. Hướng dẫn mở rộng (Scalability Guide)

Để đưa dự án này lên Production, cần thực hiện các bước sau:
1.  **Backend Integration:** Thay thế các gọi hàm Mock data trong `App.tsx` bằng `fetch` hoặc `axios` gọi tới API thực (như định nghĩa ở mục 3.2).
2.  **State Management:** Với ứng dụng lớn hơn, nên nâng cấp từ Local State (`useState`) sang Global State (`Redux Toolkit` hoặc `Zustand`) để quản lý User Session và Cart tốt hơn.
3.  **Authentication:** Tích hợp Firebase Auth hoặc Auth0 để xử lý bảo mật đăng nhập thực tế.
4.  **Map Integration:** Thay thế Map giả lập bằng Google Maps JavaScript API hoặc Mapbox GL JS.
