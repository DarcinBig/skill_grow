import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from '../../context/AppContext';

const Footer = () => {

  const { navigate } = useContext(AppContext)

  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
        <div className='flex flex-col md:items-start items-center w-full'>
          <img onClick={() => navigate('/')} src={assets.logo_dark} alt="logo" className='w-28 lg:w-48 cursor-pointer' />
          <p className="mt-6 text-center md:text-left text-sm text-white/80">
            Skill Grow is a platform that connects learners with educators,
            offering a wide range of courses to help you grow your skills and
            advance your career.
          </p>
        </div>
        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li><a href="#">Home</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Privacy policy</a></li>
          </ul>
        </div>
        <div className='hidden md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>Subscribe to our newsletter</h2>
          <p className="text-sm text-white/80">The latest news, articles, and resources, sent to your inbox weekly.</p>
          <div className='flex items-center gap-2 pt-4'>
            <input type="email" placeholder="Enter your email" className="border border-gray-500/30 bg-gray-800 placeholder-gray-500 text-white outline-none w-64 h-9 rounded px-2 text-sm" />
            <button className="bg-blue-600 w-24 h-9 text-white rounded cursor-pointer">Subscribe</button>
          </div>
        </div>
      </div>
      <p className='py-4 text-center text-xs md:text-sm text-white/60'>Copyright 2025 &copy; <a href="mailto:d.biganiro28@gmail.com">Skill Grow</a>. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
