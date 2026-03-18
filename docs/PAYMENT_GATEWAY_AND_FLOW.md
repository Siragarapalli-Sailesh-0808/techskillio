# Payment Gateway & Subscription Payment Flow

## Existing payment gateway

- **Provider:** **Razorpay** (India).
- **Script:** Loaded from `https://checkout.razorpay.com/v1/checkout.js` on:
  - `teacher-subscription-plans.html`
  - `teacher-credit-packs.html`
  - `it-vendor-plans.html`
  - Dashboards that use the plan-selection modal.
- **Key:** The frontend does **not** hardcode the Razorpay key. The key is returned by your **backend** in the initiate response (`razorpay_key`). The backend must have Razorpay API keys configured.

---

## Subscription plan payment flow (teacher / IT)

Used when a user clicks **“Select Plan”** on Subscription Plans and then **“Proceed to Payment”** in the modal.

### Step 1: Create order (backend)

- **Endpoint:** `POST /api/v1/finance/buy-plan/initiate/`
- **Headers:** `Authorization: TSK <access_token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "plan_id": 1,
    "vendor_type": "teacher",
    "jobs": []
  }
  ```
  - **Teacher:** `vendor_type: "teacher"`, `jobs` can be `[]`.
  - **IT:** `vendor_type: "it"`, `jobs` is an array of job objects (title, description, location, etc.).

**Backend must:**

1. Validate the user and plan.
2. Create a Razorpay order (Razorpay API).
3. Return **200** and a JSON body like:
   ```json
   {
     "order_id": "order_xxxx",
     "razorpay_key": "rzp_live_xxxx or rzp_test_xxxx",
     "amount": 500000,
     "currency": "INR",
     "plan": { "name": "PP PLAN" }
   }
   ```
   - `amount` is in **paise** (e.g. ₹5,000 → `500000`).
   - If `order_id` or `razorpay_key` is missing, the frontend shows a clear error and does not open Razorpay.

### Step 2: Open Razorpay checkout (frontend)

- Frontend uses `orderData.razorpay_key` and `orderData.order_id` to open Razorpay:
  ```js
  new Razorpay({ key, order_id, amount, currency, handler, ... }).open();
  ```
- User pays in the Razorpay modal.

### Step 3: After payment (handler)

- Razorpay calls the `handler` with `razorpay_payment_id`, `razorpay_order_id`, etc.
- Frontend **polls** your backend for status:
  - **Endpoint:** `GET /api/v1/plans/payments/status/?order_id=<order_id>`
  - **Headers:** `Authorization: TSK <access_token>`
- Backend should return a JSON with a `status` field. Frontend treats these as success: `success`, `captured`, `completed`, `active`.
- On success, the user sees an alert and the modal closes; optionally the page reloads.

---

## Why “Failed to initiate payment” appears

The alert is shown when **any** of the following fails:

1. **AuthManager missing** – e.g. script load order or auth not initialized.
2. **POST /api/v1/finance/buy-plan/initiate/ fails** – e.g. 4xx/5xx, or backend not implemented. The alert message now shows the **server error** (e.g. `detail` or `message` from the response) or status code.
3. **Response missing `order_id` or `razorpay_key`** – e.g. backend returns a different shape. You’ll see: *“Server did not return payment details (order_id or razorpay_key). Check backend initiate response.”*
4. **Razorpay script not loaded** – e.g. network/blocked. You’ll see: *“Razorpay script not loaded…”*
5. **Invalid JSON from server** – You’ll see: *“Invalid response from server. Could not read order details.”*

So the **most likely** cause is: **backend `POST /api/v1/finance/buy-plan/initiate/` is failing or not returning `order_id` and `razorpay_key`.**

---

## What to check on the backend

1. **Implement or fix** `POST /api/v1/finance/buy-plan/initiate/`:
   - Accept `plan_id`, `vendor_type`, `jobs`.
   - Create a Razorpay order with the plan amount (in paise).
   - Return `order_id`, `razorpay_key`, `amount`, `currency`, `plan: { name }`.
2. **Razorpay keys:** Backend must have Razorpay API keys (test/live) and send the **publishable** key as `razorpay_key`.
3. **Webhook (recommended):** Razorpay can send payment success to your backend; your backend can then activate the subscription and the status API can return `status: 'captured'` or similar so the frontend polling sees success.

---

## Other payment-related files

- **`payment-gateway.js`** – Legacy/simulated UI (card/UPI forms, no real Razorpay). Not used for subscription flow; the real flow is in **`js/plan-selection-modal.js`**.
- **`teacher-credit-packs.html`** – Can open Razorpay with `window.RAZORPAY_KEY` if set; otherwise it only shows a message. Credit pack purchase can be wired to a similar “initiate” endpoint if you add one.
