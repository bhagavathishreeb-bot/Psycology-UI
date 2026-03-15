import { CONFIG } from '../config'
import TiltCard from '../components/TiltCard'
import './ShopPage.css'

export default function ShopPage() {
  return (
    <div className="shop-page">
      <div className="sale-banner sale-banner-3d">
        <span className="sale-pulse">🔥</span>
        <span className="sale-text">Sale is Live! Special prices on books & journals.</span>
      </div>

      <div className="shop-container">
        <h1 className="page-title">Shop</h1>
        <p className="page-subtitle">Psychology books, journals & wellness resources</p>

        <div className="shop-grid">
          {CONFIG.shopItems?.map((item) => (
            <TiltCard key={item.id} className="shop-card-wrapper">
              <article className="shop-card">
                {item.flashSale && <span className="flash-badge">Sale</span>}
                <div className="shop-placeholder">
                  <span className="shop-icon">{item.type === 'Book' ? '📖' : '📓'}</span>
                </div>
                <div className="shop-info">
                  <span className="shop-type">{item.type}</span>
                  <h3 className="shop-title">{item.title}</h3>
                  <div className="shop-pricing">
                    <span className="shop-price">₹{item.price}</span>
                    <span className="shop-original">₹{item.originalPrice}</span>
                  </div>
                  <button className="shop-btn">Add to Cart</button>
                </div>
              </article>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  )
}
