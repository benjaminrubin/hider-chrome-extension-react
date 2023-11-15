import React from 'react'
import LogoImage from '../../public/images/logo.png';
import './Logo.css'

const Logo = () => {
  return (
    <img id="logo" src={LogoImage} alt={'Hider Logo'} />
  )
}

export default Logo