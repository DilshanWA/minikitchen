import { ArrowDown, ArrowUpRight, Camera, Clock3, MapPin, Phone, Star, Mail } from "lucide-react";
import ReservationForm from "./components/ReservationForm";
import Navbar from "./components/Navbar";
import MenuItemCard from "./components/MenuItemCard";
import Chatbot from "./components/Chatbot";

export const instant = false;

const menuItems = [
  { name: "Charred halloumi", description: "Whipped feta, citrus, smoked honey", price: "$14", tag: "to share" },
  { name: "Miso glazed salmon", description: "Coconut rice, pickled cucumber, herbs", price: "$28", tag: "house favourite" },
  { name: "Crispy eggplant", description: "Tahini, pomegranate, mint, toasted sesame", price: "$18", tag: "plant-based" },
  { name: "Burnt basque cheesecake", description: "Macerated berries, olive oil, sea salt", price: "$12", tag: "sweet finish" },
];

const testimonials = [
  ["“The kind of place that makes an ordinary Tuesday feel like a celebration.”", "Maya R."],
  ["“Warm, thoughtful food and the best little corner table in the city.”", "Daniel K."],
  ["“Mini Kitchen is our happy place. Every visit feels personal.”", "Nina & Sam"],
];

export default function Home() {
  return (
    <main className="site-shell">
      <Navbar />
       <Chatbot />
      <section id="home" className="hero-section bg-fixed">
        <div className="hero-overlay" />
        <div className="hero-content page-width">
          <p className="eyebrow hero-eyebrow"><span /> Neighbourhood dining, reimagined</p>
          <h1>Small kitchen.<br /><em>Big feeling.</em></h1>
          <p className="hero-copy">A tiny, joyful restaurant where seasonal ingredients, good music and long lunches come together.</p>
          <div className="hero-actions">
            <a href="#reserve" className="button button-primary">Book a table <ArrowUpRight size={17} /></a>
            <a href="#menu" className="text-link light-link">Explore the menu <ArrowDown size={16} /></a>
          </div>
          <div className="hero-note"><span className="pulse-dot" /> Open today <b>12pm — 10pm</b></div>
        </div>
        <div className="scroll-cue"><span /> Scroll to explore</div>
      </section>

      <section className="intro-section page-width section-padding">
        <div className="intro-mark">MK<span>•</span></div>
        <div>
          <p className="eyebrow">A little about us</p>
          <h2>Good food has a<br /><em>way of bringing us closer.</em></h2>
          <p className="body-copy">Mini Kitchen is a 28-seat neighbourhood restaurant built around the simple pleasure of sharing a table. Our menu follows the seasons, our wine list follows your mood, and our door is always open.</p>
          <a href="#story" className="text-link dark-link">Our story <ArrowUpRight size={16} /></a>
        </div>
        <div className="intro-stats">
          <div><strong>28</strong><span>seats at our<br />little table</span></div>
          <div><strong>7</strong><span>days of good<br />food & feeling</span></div>
        </div>
      </section>

      <section id="menu" className="menu-section section-padding bg-black">
        <MenuItemCard />
      </section>

      <section id="story" className="story-section section-padding page-width">
        <div className="story-photo" aria-label="A warm restaurant interior" />
        <div className="story-copy">
          <p className="eyebrow">Come as you are</p>
          <h2>There&apos;s always<br /><em>room for one more.</em></h2>
          <p className="body-copy">Come for a quick bite at the bar, stay for a bottle of something 
            lovely. Whether it&apos;s your first date or your fiftieth dinner together, we&apos;ll save you a seat.</p>
          <div className="story-details"><span><Clock3 size={18} /> Lunch & dinner, daily</span>
            <span><MapPin size={18} /> 14 Little Collins St</span>
          </div>
          <a href="#reserve" className="text-link dark-link">Find your table <ArrowUpRight size={16} /></a>
        </div>
      </section>

    

      <section id="reserve" className="relative section-padding bg-[url('/images/restaurant-bg-1.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
        <div className="absolute inset-0 bg-black/60" />
        <div className="page-width reserve-layout relative z-10">
          <div className="reserve-intro">
            <p className="eyebrow">Pull up a chair</p>
            <h2>
              <span className="text-white">Let&apos;s make<br /></span>
              <em>it a date.</em>
            </h2>
            <p className="text-gray-300 text-sm">
              Tell us when you&apos;d like to join us and we&apos;ll take care of the rest.
              For groups of 8 or more, please give us a call.
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-300 mt-6">
              <div className="flex items-center gap-2">
                <Phone size={17} color="#D96F3C"/> <span className="text-white">+61 3 9123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={17} color="#D96F3C" /> <span className="text-white">hello@example.com</span>
              </div>
            </div>
          </div>
          <ReservationForm />
        </div>
      </section>

      <section className="newsletter-section section-padding page-width">
        <div>
          <p className="eyebrow">Stay in the loop</p>
          <h2>Good things are<br /><em>worth sharing.</em></h2>
          <p className="body-copy">Be the first to know about new menu items, special events, and exclusive offers.</p>
        </div>
        <form className="newsletter-form">
          <label htmlFor="newsletter-email">Your email address</label>
          <div>
            <input id="newsletter-email" type="email" placeholder="hello@example.com" required />
            <button type="submit" aria-label="Subscribe"><ArrowUpRight size={20} /></button>
          </div>
          <small>No spam, ever. Just seasonal menus and good news.</small>
        </form></section>

      <footer className="footer">
        <div className="page-width footer-inner">
          <div className="brand-mark">mini<span>kitchen</span><small>food with feeling</small></div>
          <div className="footer-links">
            <a href="#menu">Menu</a>
            <a href="#story">Our story</a>
            <a href="#reserve">Reservations</a>
            <a href="https://instagram.com" aria-label="Instagram"><Camera size={18} /></a>
          </div>
          <div className="footer-meta">
            <span>14 Little Collins St, Melbourne</span>
            <span>© 2025 Mini Kitchen</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
