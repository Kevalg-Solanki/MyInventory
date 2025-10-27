
# MyInventory

**Inventory Management System** – A modern system that supports multiple types of businesses (shops, medical stores, supermarkets, etc.) to manage their inventory digitally with role-based access and real-time updates.

# Features (MVP)

*Authentication & Roles*

  * User registration & login
  * Role-based access (Admin, Owner, Staff)
  * Owner can create custom roles with permissions

*Product Management*

  * Add, edit, delete products
  * Category management
  * Product details (name, price, quantity, image, etc.)

*Stock & Supply*

  * Track stock (in-stock, low-stock, out-of-stock)
  * Import/supply entries
  * Alerts for low/over stock

*Sales & Customers*

  * Add sales records
  * Create invoices
  * Track customers and their purchases

*Tenant/Shop Management**

  * Create multiple shops
  * Switch between shops
  * Invite workers to a shop

---

## 🛠️ Tech Stack

* **Frontend:** React, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Auth:** JWT + Refresh Tokens

---

## 📂 Folder Structure (Backend Example)
├── backend
|     ├── package-lock.json
|     ├── package.json
|     ├── src
|     |     ├── app.js
|     |     ├── config
|     |     |     ├── connectToDb.js
|     |     ├── constants
|     |     |     ├── auth.js
|     |     |     ├── errors.js
|     |     ├── middlewares
|     |     |     ├── validateRequest.js
|     |     |     ├── verifyToken.js
|     |     ├── modules
|     |     |     ├── auth
|     |     |     |     ├── auth.controller.js
|     |     |     |     ├── auth.routes.js
|     |     |     |     ├── auth.service.js
|     |     |     |     ├── auth.validation.js
|     |     |     ├── otp
|     |     |     |     ├── otp.model.js
|     |     |     |     ├── otp.service.js
|     |     |     ├── user
|     |     |     |     ├── user.model.js
|     |     ├── server.js
|     |     ├── utils
|     |     |     ├── appErrorHandler.js
|     |     |     ├── emailService.js
|     |     |     ├── jwtTokenService.js
|     |     |     ├── otpGenerator.js
|     |     |     ├── prepareEmailFromTemplate.js
|     |     |     ├── sendResponse.js
|     |     |     ├── smsService.js
|     |     |     ├── templates
|     |     |     |     ├── forgotPassOtpEmailTemplate.js
|     |     |     |     ├── verifyCredentialOtpEmailTemplate.js
|     |     |     ├── validateOtp.js

---

## ⚡ Getting Started

### 1.Clone the repo

```bash
git clone https://github.com/your-username/myinventory.git
cd myinventory
```

### 2.Install dependencies

```bash
npm install
```

### 3.Setup environment variables

Create a `.env` file in the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_secret_key
```

### 4.Start server

```bash
npm run dev
```

---

## 📜 License
This project is licensed under the **MIT License** – free to use, modify, and distribute.

