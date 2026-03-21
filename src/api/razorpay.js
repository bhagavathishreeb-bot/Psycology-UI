import { api } from './client'

/**
 * Opens Razorpay Checkout and handles payment verification
 * @param {Object} options
 * @param {number} options.amount - Amount in INR
 * @param {string} options.receipt - Receipt/order reference
 * @param {string} options.orderType - 'booking' | 'course' | 'shop'
 * @param {number} options.entityId - ID of booking/course-order/shop-order
 * @param {string} options.customerName - Prefill name
 * @param {string} options.customerEmail - Prefill email
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function openRazorpayCheckout({
  amount,
  receipt,
  orderType,
  entityId,
  customerName = '',
  customerEmail = '',
}) {
  if (!window.Razorpay) {
    return { success: false, message: 'Razorpay is not loaded. Please refresh the page.' }
  }

  try {
    const orderRes = await api.postPaymentsCreateOrder({
      amount,
      receipt,
      orderType,
      entityId,
      customerName,
      customerEmail,
    })

    const { razorpayOrderId, razorpayKeyId } = orderRes
    if (!razorpayOrderId || !razorpayKeyId) {
      return { success: false, message: 'Invalid payment order response.' }
    }

    return new Promise((resolve) => {
      const options = {
        key: razorpayKeyId,
        amount: amount * 100,
        currency: 'INR',
        name: 'ManoTaranga',
        order_id: razorpayOrderId,
        prefill: { name: customerName, email: customerEmail },
        handler: async function (response) {
          try {
            const data = await api.postPaymentsVerify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderType,
              entityId,
            })
            if (data.success) {
              resolve({ success: true, orderId: response.razorpay_order_id })
            } else {
              resolve({ success: false, message: data.message || 'Payment verification failed.' })
            }
          } catch (err) {
            resolve({ success: false, message: err.message || 'Payment verification failed.' })
          }
        },
        modal: {
          ondismiss: () => resolve({ success: false, message: 'Payment cancelled.' }),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        resolve({
          success: false,
          message: response.error?.description || 'Payment failed.',
        })
      })
      rzp.open()
    })
  } catch (err) {
    return { success: false, message: err.message || 'Failed to create payment order.' }
  }
}
