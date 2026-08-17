import React, { useContext, useEffect, useState } from "react";
import "./Payment.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const DECLINE_CARD = "4000000000000002";

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { url, food_list, cartItems, getTotalCartAmount, token } =
    useContext(StoreContext);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [errors, setErrors] = useState({});

  // Processing states: "idle" | "processing" | "success" | "failure"
  const [status, setStatus] = useState("idle");

  // Build order items for summary display
  const orderItems = food_list.filter(
    (item) => cartItems[item._id] && cartItems[item._id] > 0
  );
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/cart");
    } else if (!orderId) {
      toast.error("Invalid order");
      navigate("/cart");
    }
  }, [token, orderId]);

  // ── Format helpers ──
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
  };

  const getCardBrand = (number) => {
    const digits = number.replace(/\s/g, "");
    if (digits.startsWith("4")) return "VISA";
    if (/^5[1-5]/.test(digits)) return "MC";
    if (digits.startsWith("3")) return "AMEX";
    return "CARD";
  };

  const getDisplayNumber = () => {
    const formatted = formatCardNumber(cardNumber);
    const placeholder = "•••• •••• •••• ••••";
    if (!formatted) return placeholder;
    // Fill remaining with dots
    const parts = formatted.split(" ");
    while (parts.length < 4) parts.push("••••");
    return parts.map((p) => p.padEnd(4, "•")).join(" ");
  };

  // ── Validation ──
  const validate = () => {
    const errs = {};
    const rawNumber = cardNumber.replace(/\s/g, "");

    if (rawNumber.length !== 16) {
      errs.cardNumber = "Card number must be 16 digits";
    }
    if (!cardName.trim()) {
      errs.cardName = "Cardholder name is required";
    }
    if (!expiry || expiry.length < 5) {
      errs.expiry = "Enter a valid expiry (MM/YY)";
    } else {
      const [mm, yy] = expiry.split("/");
      const month = parseInt(mm, 10);
      const year = parseInt("20" + yy, 10);
      const now = new Date();
      if (month < 1 || month > 12) {
        errs.expiry = "Invalid month";
      } else if (
        year < now.getFullYear() ||
        (year === now.getFullYear() && month < now.getMonth() + 1)
      ) {
        errs.expiry = "Card has expired";
      }
    }
    if (cvv.length !== 3) {
      errs.cvv = "CVV must be 3 digits";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit handler ──
  const handlePay = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("processing");

    const rawNumber = cardNumber.replace(/\s/g, "");
    const isDecline = rawNumber === DECLINE_CARD;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    if (isDecline) {
      // Decline flow
      setStatus("failure");
      try {
        await axios.post(url + "/api/order/verify", {
          orderId,
          success: "false",
        });
      } catch (err) {
        console.log(err);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.error("Payment declined. Order cancelled.");
      navigate("/");
    } else {
      // Success flow
      setStatus("success");
      try {
        await axios.post(url + "/api/order/verify", {
          orderId,
          success: "true",
        });
      } catch (err) {
        console.log(err);
      }
      await new Promise((resolve) => setTimeout(resolve, 1800));
      toast.success("Payment successful! Order placed.");
      navigate("/myorders");
    }
  };

  return (
    <>
      <div className="payment-page">
        <h1>Payment</h1>
        <p className="payment-subtitle">
          Complete your order with our secure checkout
        </p>

        <div className="payment-layout">
          {/* ─── LEFT: Card + Form ─── */}
          <div className="payment-left">
            {/* 3D Card Preview */}
            <div className="card-preview-container">
              <div
                className={`credit-card-wrapper ${isFlipped ? "flipped" : ""}`}
              >
                {/* Front */}
                <div className="credit-card-front">
                  <span className="card-brand">
                    {getCardBrand(cardNumber)}
                  </span>
                  <div className="card-chip"></div>
                  <div className="card-number-display">
                    {getDisplayNumber()}
                  </div>
                  <div className="card-bottom-row">
                    <div>
                      <div className="card-holder-label">Card Holder</div>
                      <div className="card-holder-display">
                        {cardName || "YOUR NAME"}
                      </div>
                    </div>
                    <div>
                      <div className="card-expiry-label">Expires</div>
                      <div className="card-expiry-display">
                        {expiry || "MM/YY"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div className="credit-card-back">
                  <div className="card-magnetic-strip"></div>
                  <div className="card-cvv-strip">
                    <span className="card-cvv-label">CVV</span>
                    <div className="card-cvv-display">{cvv || "•••"}</div>
                  </div>
                  <div className="card-back-info">
                    This card is issued for demo purposes only.
                    <br />
                    Dummy Payment Gateway — No real charges.
                  </div>
                </div>
              </div>
            </div>

            {/* Security trust banner */}
            <div className="security-trust-banner">
              <div className="trust-item">
                <span className="trust-icon">🛡️</span>
                <div className="trust-details">
                  <h4>Secure 256-bit SSL Encryption</h4>
                  <p>Your connection is fully encrypted and processed with bank-level security standards.</p>
                </div>
              </div>
              <div className="trust-item">
                <span className="trust-icon">💳</span>
                <div className="trust-details">
                  <h4>PCI-DSS Compliant Gateway</h4>
                  <p>We adhere to strict data security standards to ensure your card information is never compromised.</p>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <form className="payment-form" onSubmit={handlePay}>
              <div className="form-group">
                <label htmlFor="card-number">Card Number</label>
                <input
                  id="card-number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formatCardNumber(cardNumber)}
                  onChange={(e) =>
                    setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
                  }
                  onFocus={() => setIsFlipped(false)}
                  className={errors.cardNumber ? "error" : ""}
                  maxLength={19}
                  autoComplete="off"
                />
                {errors.cardNumber && (
                  <div className="error-text">⚠ {errors.cardNumber}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="card-name">Cardholder Name</label>
                <input
                  id="card-name"
                  type="text"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  onFocus={() => setIsFlipped(false)}
                  className={errors.cardName ? "error" : ""}
                  autoComplete="off"
                />
                {errors.cardName && (
                  <div className="error-text">⚠ {errors.cardName}</div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="card-expiry">Expiry Date</label>
                  <input
                    id="card-expiry"
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setExpiry(formatExpiry(raw));
                    }}
                    onFocus={() => setIsFlipped(false)}
                    className={errors.expiry ? "error" : ""}
                    maxLength={5}
                    autoComplete="off"
                  />
                  {errors.expiry && (
                    <div className="error-text">⚠ {errors.expiry}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="card-cvv">CVV</label>
                  <input
                    id="card-cvv"
                    type="password"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    className={errors.cvv ? "error" : ""}
                    maxLength={3}
                    autoComplete="off"
                  />
                  {errors.cvv && (
                    <div className="error-text">⚠ {errors.cvv}</div>
                  )}
                </div>
              </div>

              <button type="submit" className="pay-button" disabled={status !== "idle"}>
                💳 Pay ₹{total}.00
              </button>
            </form>
          </div>

          {/* ─── RIGHT: Order Summary ─── */}
          <div className="payment-right">
            <div className="order-summary-card">
              <h3>Order Summary</h3>

              <div className="summary-items">
                {orderItems.map((item) => (
                  <div className="summary-item" key={item._id}>
                    <div className="summary-item-info">
                      <span className="summary-item-qty">
                        {cartItems[item._id]}x
                      </span>
                      <span className="summary-item-name">{item.name}</span>
                    </div>
                    <span className="summary-item-price">
                      ₹{item.price * cartItems[item._id]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total}.00</span>
              </div>

              <div className="secure-badge">
                <span className="lock-icon">🔒</span>
                Secure Payment
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Processing Overlay ─── */}
      {status !== "idle" && (
        <div className="processing-overlay">
          <div className="processing-card">
            {status === "processing" && (
              <>
                <div className="processing-spinner"></div>
                <h2>Processing Payment</h2>
                <p>
                  Please wait
                  <span className="processing-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </p>
              </>
            )}
            {status === "success" && (
              <>
                <div className="result-icon success">✓</div>
                <h2>Payment Successful!</h2>
                <p>Redirecting to your orders...</p>
              </>
            )}
            {status === "failure" && (
              <>
                <div className="result-icon failure">✗</div>
                <h2>Payment Declined</h2>
                <p>Your card was declined. Redirecting...</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
