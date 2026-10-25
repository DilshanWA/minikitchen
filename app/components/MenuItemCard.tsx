import React from 'react'
import { getMenuForClient } from '@/app/actions/menuitems';
import { ArrowUpRight } from 'lucide-react';

export default async function MenuItemCard() {
    const menuItems = await getMenuForClient();
  return (
    <div>
      <div className="page-width">
          <div className="section-heading">
            <div><p className="eyebrow">From our kitchen</p><h2>Made for<br /><em>passing around.</em></h2></div>
            <p className="section-aside">Our menu changes with the market.<br />These are a few of today&apos;s favourites.</p>
          </div>
          <div className="menu-grid">
            {menuItems.map((item) => (
              <article className="menu-card" key={item.name}>
                <div className={`menu-card-image${item.image_url ? "" : " placeholder"}`}>
                  {item.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.name} />
                  )}
                </div>
                <div className="dish-info"><div><h3>{item.name}</h3><p>{item.description}</p></div><strong>{item.price}</strong></div>
                <span className="dish-tag">{item.tag}</span>
              </article>
            ))}
          </div>
          <div className="center-action">
            <a href="#reserve" className="button button-outline">See what&apos;s cooking 
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
    </div>
  )
}
