import React from 'react'
import { assets } from '../../assets/assets'

const SearchBar = () => {
  return (
    <form className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded'>
      <img src={assets.search_icon} alt="search_icon" className='md:w-auto w-10 px-3' />
      <input type="text" placeholder='Search for courses' className='w-full h-full outline-none text-gray-500/80' />
      <button type='submit' className='bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1'>Search</button>
    </form>
  )
}

export default SearchBar
