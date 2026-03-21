# ManoTaranga Backend API Endpoints

This document lists all API endpoints. The frontend is now integrated with these endpoints.

## Configuration

Set `VITE_API_URL` in your `.env` file for production:

```
VITE_API_URL=https://your-api.onrender.com
```

Leave unset for local development (defaults to `http://localhost:8080`).

---

## 1. Counseling Session Booking

### `POST /api/bookings`

Creates a new counseling session booking when a user completes the booking form.

**Request Body:**
```json
{
  "name": "string (required)",
  "age": "number (required)",
  "occupation": "string (required)",
  "phone": "string (required)",
  "dob": "string (required, date format)",
  "gender": "string (required)",
  "city": "string (required)",
  "preferredLanguage": "string (required)",
  "whatBringsToTherapy": "string (required)",
  "howLongConcerns": "string (required)",
  "concerns": "object (e.g. { \"Anxiety\": true, \"Depression\": false })",
  "otherConcern": "string",
  "seenPsychologistBefore": "string (Yes/No)",
  "previousDiagnosis": "string",
  "diagnosisDuration": "string",
  "session": "string (e.g. Counseling Session)",
  "sessionDuration": "string (e.g. 45 mins)",
  "sessionPrice": "number (e.g. 599)"
}
```

**Response:** `201 Created` with booking ID, or `400 Bad Request` for validation errors.

---

## 2. Course Purchase / Enrollment

### `POST /api/course-purchases`

Creates a course enrollment when a user clicks "Enroll Now" on a course.

**Request Body:**
```json
{
  "courseId": "number (required)",
  "courseTitle": "string",
  "price": "number (required)",
  "originalPrice": "number",
  "customerName": "string (required)",
  "customerEmail": "string (required)",
  "customerPhone": "string (required)",
  "paymentStatus": "string (pending/paid/failed)",
  "paymentId": "string (optional - from payment gateway)"
}
```

**Response:** `201 Created` with order ID.

**Note:** You may need a checkout flow that collects customer details before calling this. Consider adding:
- `GET /api/courses` – Fetch course catalog (or use config)
- `GET /api/courses/:id` – Fetch single course details

---

## 3. Shop Item Purchase

### `POST /api/shop-orders`

Creates an order when a user purchases a shop item (or completes checkout).

**Request Body:**
```json
{
  "items": [
    {
      "shopItemId": "number (required)",
      "title": "string",
      "type": "string (Journal/Book)",
      "price": "number (required)",
      "quantity": "number (required, default 1)"
    }
  ],
  "totalAmount": "number (required)",
  "customerName": "string (required)",
  "customerEmail": "string (required)",
  "customerPhone": "string (required)",
  "shippingAddress": {
    "line1": "string (required)",
    "line2": "string",
    "city": "string (required)",
    "state": "string (required)",
    "pincode": "string (required)"
  },
  "paymentStatus": "string (pending/paid/failed)",
  "paymentId": "string (optional)"
}
```

**Response:** `201 Created` with order ID.

**Additional endpoints (optional):**
- `POST /api/cart` – Add item to cart (if you implement cart)
- `GET /api/cart` – Get cart contents
- `DELETE /api/cart/:itemId` – Remove from cart

---

## 4. Career Application (Bonus)

### `POST /api/career-applications`

Creates a job application when a user applies via the Careers form.

**Request Body:** `multipart/form-data` (for resume file)
```
name: string (required)
email: string (required)
phone: string (required)
linkedin: string (optional)
experience: string (required)
message: string (optional)
resume: file (required)
jobTitle: string (required)
jobType: string (required)
jobLocation: string (required)
```

**Response:** `201 Created` with application ID.

---

## Summary Table

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/bookings` | POST | Save counseling session booking |
| `/api/course-purchases` | POST | Save course enrollment/purchase |
| `/api/shop-orders` | POST | Save shop item order |
| `/api/career-applications` | POST | Save job application |

---

## Implementation Notes

1. **Payment integration:** For courses and shop, you'll typically:
   - Create order with `paymentStatus: "pending"`
   - Redirect to payment gateway (Razorpay, Stripe, etc.)
   - Use webhook/callback to update `paymentStatus` to `"paid"`

2. **Validation:** Add server-side validation for all required fields.

3. **CORS:** Enable CORS for your frontend domain.

4. **Base URL:** Add `VITE_API_URL` or similar in your `.env` and use it in API calls.
