"use client"

import { useState } from "react";
import React from 'react';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="bg-frontPage p-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <button className="flex flex-col justify-center items-start" onClick={toggleMenu}>
            <span className="block w-10 h-0.5 bg-lightFont mb-3"></span>
            <span className="block w-8 h-0.5 bg-lightFont mb-3"></span>
            <span className="block w-6 h-0.5 bg-lightFont"></span>
          </button>
          
          {/* Dropdown Menu */}
          {menuOpen && ( 
            <div className="absolute left-0 mt-2 bg-white rounded shadow-md z-10">
              <ul className="flex flex-col text-black">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <a href="#home">Home</a>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <a href="#about">About</a>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Right Buttons */}
        <div className="flex justify-end">
          <button className="bg-lightGrey font-bold text-darkerGreen m-2 rounded-full px-6 py-3 hover:bg-gradient-to-t from-neutral-300 to-slate-300 border border-darkerGreen">
            Log in
          </button>
          <button className="bg-darkGreen text-white ml-2 mr-0 my-2 rounded-full px-5 py- font-bold hover:bg-gradient-to-t from-lightGreen via-darkGreen to-darkerGreen">
            Open an account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
