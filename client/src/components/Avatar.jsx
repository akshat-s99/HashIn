import React from 'react'

export default function Avatar({ src, alt, size = 48 }) {
  return <img className="hashin-avatar" src={src} alt={alt} style={{ width:size, height:size, borderRadius:12 }} />
}
