export interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "bank_transfer"
  last4?: string
  brand?: string
  exp_month?: number
  exp_year?: number
  is_default: boolean
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: "requires_payment_method" | "requires_confirmation" | "processing" | "succeeded" | "canceled"
  client_secret: string
  order_id: string
}

export interface PaymentResult {
  success: boolean
  payment_intent_id?: string
  error?: string
}

// Mock payment processing (replace with actual payment provider like Stripe)
export async function createPaymentIntent(amount: number, orderId: string): Promise<PaymentIntent> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: `pi_${Math.random().toString(36).substr(2, 9)}`,
    amount: Math.round(amount * 100), // Convert to cents
    currency: "eur",
    status: "requires_payment_method",
    client_secret: `pi_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
    order_id: orderId,
  }
}

export async function confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentResult> {
  // Simulate payment processing
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulate success/failure (90% success rate)
  const success = Math.random() > 0.1

  if (success) {
    return {
      success: true,
      payment_intent_id: paymentIntentId,
    }
  } else {
    return {
      success: false,
      error: "Votre carte a été refusée. Veuillez vérifier vos informations ou utiliser une autre carte.",
    }
  }
}

export async function processPayPalPayment(amount: number, orderId: string): Promise<PaymentResult> {
  // Simulate PayPal processing
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return {
    success: true,
    payment_intent_id: `paypal_${Math.random().toString(36).substr(2, 9)}`,
  }
}

export function validateCardNumber(cardNumber: string): boolean {
  // Basic Luhn algorithm validation
  const digits = cardNumber.replace(/\D/g, "")
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

export function getCardBrand(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "")

  if (digits.startsWith("4")) return "visa"
  if (digits.startsWith("5") || digits.startsWith("2")) return "mastercard"
  if (digits.startsWith("3")) return "amex"

  return "unknown"
}
