import React from 'react'
import '../../styles/LoadingSpinner.css'

const LoadingSpinner = ({ size = 'medium' }) => {
  return (
    <div className={`loading-spinner ${size}`} />
  )
}

export default LoadingSpinner