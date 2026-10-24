"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [["Home", "#home"], ["Menu", "#menu"], ["Our story", "#story"], ["Reservations", "#reserve"]];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <nav className="page-width nav-inner">
        <a href="#home" className="brand-mark">mini<span>kitchen</span><small>food with feeling</small></a>
        <div className={`nav-links ${open ? "is-open" : ""}`}>
          {links.map(([label, href]) => 
            <a href={href} key={href} onClick={() => setOpen(false)}>{label}</a>
          )}
          <a className="nav-book" href="#reserve" onClick={() => setOpen(false)}>Book a table <span>↗</span></a>
        </div>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
    </header>
    ) 
}
