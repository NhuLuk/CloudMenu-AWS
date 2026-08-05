# CloudMenu AWS

CloudMenu là hệ thống gọi món trực tuyến tại bàn, được xây dựng theo kiến trúc Serverless trên Amazon Web Services (AWS).

Khách hàng quét mã QR tại bàn để mở thực đơn, chọn món và gửi đơn. Đơn hàng được xử lý qua API Gateway, AWS Lambda và lưu trữ trong DynamoDB. Nhân viên bếp có thể theo dõi và cập nhật trạng thái đơn hàng trên giao diện riêng.

---

## Chức năng chính

### Khách hàng

- Quét mã QR tại bàn để mở thực đơn
- Tự động nhận diện số bàn từ đường dẫn QR
- Tìm kiếm và lọc món theo danh mục
- Thêm món vào giỏ hàng
- Thay đổi số lượng món
- Gửi đơn gọi món
- Theo dõi trạng thái đơn hàng

### Nhân viên bếp

- Xem danh sách đơn hàng từ DynamoDB
- Xem mã đơn, số bàn, món ăn và tổng tiền
- Cập nhật trạng thái đơn:
  - Đã gửi đơn
  - Đang chế biến
  - Đã hoàn thành
- Tự động tải lại danh sách đơn hàng

---

## Kiến trúc hệ thống

### Frontend

- HTML
- CSS
- JavaScript
- Amazon S3
- Amazon CloudFront

### Backend

- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB

### Luồng xử lý

```text
Khách hàng
    │
    │ Quét QR tại bàn
    ▼
Amazon CloudFront
    │
    ▼
Amazon S3
Frontend HTML/CSS/JavaScript
    │
    ▼
Amazon API Gateway
    │
    ├── POST /order
    ├── GET /orders
    └── PUT /orders/{orderId}
    │
    ▼
AWS Lambda
    │
    ├── createOrder
    ├── getOrders
    └── updateOrderStatus
    │
    ▼
Amazon DynamoDB
CloudMenuOrders
```

---

## Cấu trúc project

```text
CloudMenu-AWS
│
├── frontend
│   ├── images
│   │   ├── Lauthaihaisan.png
│   │   ├── bocuonnam.jpg
│   │   ├── comchienhaisan.jpg
│   │   └── ...
│   │
│   ├── index.html
│   ├── order.html
│   ├── kitchen.html
│   ├── app.js
│   └── style.css
│
├── lambda
│   ├── create_order
│   │   └── lambda_function.py
│   │
│   ├── get_orders
│   │   └── lambda_function.py
│   │
│   └── update_order_status
│       └── lambda_function.py
│
└── README.md
```

---

## Dịch vụ AWS sử dụng

### Amazon S3

Lưu trữ các file frontend:

- HTML
- CSS
- JavaScript
- Hình ảnh món ăn

### Amazon CloudFront

- Phân phối website qua HTTPS
- Cho phép khách hàng truy cập CloudMenu bằng điện thoại
- Làm nguồn URL cho mã QR tại từng bàn

### Amazon API Gateway

Cung cấp các API kết nối frontend với Lambda.

### AWS Lambda

Xử lý các chức năng backend:

- Tạo đơn hàng
- Lấy danh sách đơn hàng
- Cập nhật trạng thái đơn hàng

### Amazon DynamoDB

Lưu trữ dữ liệu đơn hàng.

---

## API

### POST `/order`

Tạo đơn hàng mới.

Ví dụ request:

```json
{
  "orderId": "ORD-1750000000000",
  "tableNumber": "03",
  "items": [
    {
      "itemId": "food-004",
      "name": "Cơm Tấm",
      "price": 45000,
      "quantity": 2
    }
  ],
  "totalAmount": 90000,
  "status": "PENDING",
  "createdAt": "2026-08-06T00:00:00.000Z"
}
```

### GET `/orders`

Lấy danh sách toàn bộ đơn hàng.

### PUT `/orders/{orderId}`

Cập nhật trạng thái của một đơn hàng.

Ví dụ request:

```json
{
  "status": "PREPARING"
}
```

---

## DynamoDB

### Table

```text
CloudMenuOrders
```

### Partition key

```text
orderId
```

### Các thuộc tính chính

```text
orderId
tableNumber
items
totalAmount
status
createdAt
updatedAt
```

---

## Trạng thái đơn hàng

```text
PENDING
   ↓
PREPARING
   ↓
COMPLETED
```

| Trạng thái | Ý nghĩa |
|---|---|
| `PENDING` | Đơn đã được khách gửi |
| `PREPARING` | Bếp đang chế biến |
| `COMPLETED` | Đơn đã hoàn thành |

---

## Mã QR theo bàn

Mỗi bàn sử dụng một đường dẫn riêng.

Ví dụ:

```text
Bàn 01:
https://<cloudfront-domain>/?table=01

Bàn 02:
https://<cloudfront-domain>/?table=02

Bàn 03:
https://<cloudfront-domain>/?table=03
```

Nếu người dùng truy cập website mà không có tham số `table`, hệ thống sẽ yêu cầu quét mã QR tại bàn và không hiển thị thực đơn.

Project hiện hỗ trợ các bàn:

```text
01
02
03
04
05
```

---

## Hướng dẫn chạy trên máy

### 1. Clone project

```bash
git clone https://github.com/NhuLuk/CloudMenu-AWS.git
```

### 2. Mở project

Mở thư mục project bằng Visual Studio Code.

### 3. Chạy frontend

Cài extension Live Server.

Mở:

```text
frontend/index.html
```

Chọn:

```text
Open with Live Server
```

Để giả lập QR của bàn 01, mở:

```text
http://127.0.0.1:5500/frontend/index.html?table=01
```

Trang bếp:

```text
http://127.0.0.1:5500/frontend/kitchen.html
```

---

## Triển khai frontend lên AWS

Frontend được tải lên Amazon S3 và phân phối qua Amazon CloudFront.

Sau mỗi lần cập nhật frontend:

1. Upload ghi đè các file mới lên thư mục `frontend` trong S3.
2. Vào CloudFront.
3. Tạo Invalidation với đường dẫn:

```text
/*
```

4. Chờ trạng thái chuyển thành `Completed`.
5. Tải lại website CloudFront.

---

## CORS

API Gateway cần cho phép các origin:

```text
http://127.0.0.1:5500
https://<cloudfront-domain>
```

Allowed methods:

```text
GET
POST
PUT
OPTIONS
```

Allowed headers:

```text
content-type
```

---

## Ghi chú cấu hình

Nếu thay đổi API Gateway URL, cần cập nhật trong:

```text
frontend/app.js
frontend/order.html
frontend/kitchen.html
```

Nếu thay đổi tên DynamoDB Table, cần cập nhật trong:

```text
lambda/create_order/lambda_function.py
lambda/get_orders/lambda_function.py
lambda/update_order_status/lambda_function.py
```

Nếu thêm bàn mới, cần cập nhật danh sách:

```javascript
const allowedTables = [
  "01",
  "02",
  "03",
  "04",
  "05",
];
```

trong:

```text
frontend/app.js
```

---

## Hạn chế hiện tại

- Chưa có đăng nhập cho nhân viên bếp
- Chưa có chức năng thanh toán
- Chưa có trạng thái `PAID`
- Chưa có dashboard thống kê
- Danh sách đơn đang được tải lại định kỳ, chưa sử dụng WebSocket
- Số bàn hiện được xác định bằng tham số URL và chưa có token bảo mật

---

## Hướng phát triển

- Thêm Amazon Cognito cho đăng nhập nhân viên
- Thêm giao diện thu ngân
- Thêm trạng thái thanh toán
- Thêm dashboard và biểu đồ thống kê
- Thêm WebSocket API để cập nhật đơn theo thời gian thực
- Thêm mã xác thực cho từng QR
- Thêm chức năng quản lý món ăn
- Thêm chức năng tạm khóa bàn hoặc đóng phiên gọi món
