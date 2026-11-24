import React from 'react'

const Logo = ({ className = '' }) => {
  return (
    <span className={`group inline-flex items-baseline font-display font-extrabold tracking-[-0.04cm] leading-none text-navy ${className}`}>Oja
    <span aria-hidden="true" className="ml-[0.05cm] inline-block size-[0.2em] rounded-full bg-orange motion-safe:group-hover:animate-hop" />
    </span>
  )
}

export default Logo