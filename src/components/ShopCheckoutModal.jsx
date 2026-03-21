import { useState } from 'react'
import { api } from '../api/client'
import { openRazorpayCheckout } from '../api/razorpay'
import './ShopCheckoutModal.css'

export default function ShopCheckoutModal({ item, onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const orderPayload = {
      items: [{ shopItemId: item.id, title: item.title, type: item.type, price: item.price, quantity: 1 }],
      totalAmount: item.price,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: { line1, line2: line2 || undefined, city, state, pincode },
      paymentStatus: 'pending',
    }
    try {
      const orderRes = await api.postShopOrders(orderPayload)
      const orderId = orderRes.id

      const paymentResult = await openRazorpayCheckout({
        amount: item.price,
        receipt: `shop_${orderId}`,
        orderType: 'shop',
        entityId: orderId,
        customerName: name,
        customerEmail: email,
      })

      if (paymentResult.success) {
        onSuccess?.()
        onClose?.()
      } else {
        setError(paymentResult.message || 'Payment failed. Your order is saved; we will contact you.')
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shop-checkout-overlay" onClick={onClose}>
      <div className="shop-checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shop-checkout-header">
          <h2>Buy — {item?.title}</h2>
          <button type="button" className="shop-checkout-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form className="shop-checkout-form" onSubmit={handleSubmit}>
          <div className="shop-checkout-summary">
            <span className="shop-checkout-price">₹{item?.price}</span>
            {item?.originalPrice && (
              <span className="shop-checkout-original">₹{item.originalPrice}</span>
            )}
          </div>
          {error && <div className="shop-checkout-error" role="alert">{error}</div>}
          <h4>Contact</h4>
          <label>Full Name <span className="required">*</span>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </label>
          <label>Email <span className="required">*</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label>Phone <span className="required">*</span>
            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" />
          </label>
          <h4>Shipping Address</h4>
          <label>Address Line 1 <span className="required">*</span>
            <input type="text" required value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Street, building" />
          </label>
          <label>Address Line 2
            <input type="text" value={line2} onChange={(e) => setLine2(e.target.value)} placeholder="Optional" />
          </label>
          <div className="shop-checkout-row">
            <label>City <span className="required">*</span>
              <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
            </label>
            <label>State <span className="required">*</span>
              <input type="text" required value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
            </label>
          </div>
          <label>Pincode <span className="required">*</span>
            <input type="text" required value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" />
          </label>
          <div className="shop-checkout-actions">
            <button type="button" className="shop-checkout-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="shop-checkout-submit" disabled={loading}>
              {loading ? 'Processing...' : `Pay ₹${item?.price}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
