import React from 'react';

const Header: React.FC = () => {
  return (
    <div className='bg-frontPage p-6'>
      <div className='flex justify-end'>
        <button className='bg-lightGrey text-darkerGreen m-2 rounded-full px-5 py-3'>Login</button>
        <button className='bg-darkGreen text-white ml-2 mr-0 my-2 rounded-full px-5 py-3'>Open an account</button>
      </div>
    </div>
    
  );
};

export default Header;
