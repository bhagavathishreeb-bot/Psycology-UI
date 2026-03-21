import { CONFIG } from '../config'
import './ShopPage.css'

export default function ShopPage() {
  return (
    <div className="shop-page">
      <div className="shop-container">
        <h1 className="page-title">Shop</h1>
        <p className="page-subtitle">Psychology books, journals & wellness resources</p>

        <div className="shop-grid">
          {CONFIG.shopItems?.map((item) => (
            <article key={item.id} className="shop-card">
              <span className="coming-soon-ribbon">Coming Soon</span>
              <div className="shop-card-image">
                <img src={item.image} alt={item.title} className="shop-card-img" />
              </div>
              <div className="shop-info">
                <span className="shop-type">{item.type}</span>
                <h3 className="shop-title">{item.title}</h3>
                <div className="shop-pricing">
                  <span className="shop-price">₹{item.price}</span>
                  {item.originalPrice && (
                    <span className="shop-original">₹{item.originalPrice}</span>
                  )}
                </div>
                <button className="shop-btn shop-btn-disabled" disabled>Buy Now</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
