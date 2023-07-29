import React from 'react'
import loading from './Spinner-1s-64px.svg'

export default function () {
  return (
    <div className='text-center'>
        <img src={loading} alt="loading..." />
    </div>
  )
}