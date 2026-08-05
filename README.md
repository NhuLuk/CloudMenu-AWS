# CloudMenu AWS

CloudMenu là hệ thống gọi món trực tuyến được xây dựng theo kiến trúc Serverless trên Amazon Web Services (AWS).

## Mục tiêu

- Khách hàng xem menu
- Đặt món trực tuyến
- Bếp nhận đơn
- Bếp cập nhật trạng thái đơn
- Khách theo dõi trạng thái đơn hàng

---

# Kiến trúc hệ thống

Frontend
- HTML
- CSS
- JavaScript

Backend
- API Gateway
- AWS Lambda
- DynamoDB

Luồng xử lý

Customer
↓
Frontend
↓
API Gateway
↓
Lambda
↓
DynamoDB

---

# Cấu trúc project

```
CloudMenu
│
├── frontend
│   ├── index.html
│   ├── order.html
│   ├── kitchen.html
│   ├── app.js
│   └── style.css
│
├── lambda
│   ├── create_order
│   ├── get_orders
│   └── update_order_status
│
└── README.md
```

---

# AWS Services

- API Gateway
- Lambda
- DynamoDB

---

#  Hướng dẫn chạy project

## 1. Clone project

```bash
git clone https://github.com/NhuLuk/CloudMenu-AWS.git
```

## 2. Mở project

Mở bằng Visual Studio Code.

## 3. Chạy Frontend

Cài Live Server.

Mở

```
frontend/index.html
```

Open with Live Server hoặc nhấn Go Live góc dưới bên phải VSC.

---

#  API

## POST /order

Tạo đơn hàng mới.

## GET /orders

Lấy danh sách đơn hàng.

## PUT /orders/{orderId}

Cập nhật trạng thái đơn.

---

#  DynamoDB

Table

```
CloudMenuOrders
```

Partition Key

```
orderId
```

---

#  Trạng thái đơn hàng

```
PENDING
↓
PREPARING
↓
COMPLETED
```

---


#  Ghi chú

Nếu thay đổi API Gateway URL, hãy cập nhật:

```
frontend/app.js
frontend/order.html
frontend/kitchen.html
```

Nếu thay đổi tên DynamoDB Table, cần cập nhật trong:

```
createOrder Lambda
getOrders Lambda
updateOrderStatus Lambda
```
