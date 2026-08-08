# CloudMenu AWS

CloudMenu là hệ thống gọi món trực tuyến tại bàn, được xây dựng theo kiến trúc Serverless trên Amazon Web Services (AWS).

Khách hàng quét mã QR riêng tại từng bàn để mở thực đơn, chọn món và gửi đơn gọi món. Các yêu cầu được xử lý thông qua Amazon API Gateway và AWS Lambda, sau đó dữ liệu đơn hàng được lưu trữ trong Amazon DynamoDB.

Nhân viên bếp sử dụng giao diện riêng để tiếp nhận đơn và cập nhật trạng thái chế biến. Hệ thống đồng thời cung cấp Dashboard thống kê giúp Admin/Manager theo dõi tổng số đơn, doanh thu, trạng thái đơn hàng, doanh thu theo bàn và các món được gọi nhiều nhất.

---

## Chức năng chính

### Khách hàng

- Quét mã QR tại bàn để mở thực đơn
- Tự động nhận diện số bàn từ đường dẫn QR
- Xem danh sách món ăn
- Tìm kiếm món ăn
- Lọc món theo danh mục
- Thêm món vào giỏ hàng
- Thay đổi số lượng món
- Gửi đơn gọi món
- Xem thời gian đặt món
- Xem thời gian đã chờ
- Xem thời gian dự kiến chuẩn bị món
- Theo dõi trạng thái đơn hàng

### Nhân viên bếp

- Xem danh sách đơn hàng từ DynamoDB
- Xem mã đơn, số bàn, món ăn và tổng tiền
- Xem thời gian khách đặt món
- Cập nhật trạng thái đơn:
  - Đã gửi đơn
  - Đang chế biến
  - Đã hoàn thành
- Ghi nhận thời gian hoàn thành đơn
- Tự động tải lại danh sách đơn hàng

### Admin / Manager

- Xem Dashboard thống kê
- Xem tổng số đơn hàng
- Xem tổng doanh thu
- Xem số đơn theo từng trạng thái
- Xem doanh thu theo từng bàn
- Xem món được gọi nhiều nhất
- Xem tổng số món đã được gọi
- Tự động cập nhật dữ liệu thống kê

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

### Monitoring và Security

- AWS Identity and Access Management (IAM)
- Amazon CloudWatch

### Luồng tải giao diện


Customer / Kitchen / Admin
          │
          ▼
Amazon CloudFront
          │
          ▼
      Amazon S3
          │
          ▼
Frontend HTML/CSS/JavaScript

### Luồng xử lý dữ liệu

Frontend / Browser
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

### Dịch vụ AWS sử dụng

Amazon S3
Amazon CloudFront
Amazon API Gateway
AWS Lambda
Amazon DynamoDB
AWS IAM

### Các giao diện chính

Trang khách hàng
frontend/index.html

Trang trạng thái đơn hàng
frontend/order.html

Trang bếp
frontend/kitchen.html

Dashboard
frontend/dashboard.html

### CORS

API Gateway cần cho phép các origin phù hợp.
Ví dụ:
http://127.0.0.1:5500
https://<cloudfront-domain>
