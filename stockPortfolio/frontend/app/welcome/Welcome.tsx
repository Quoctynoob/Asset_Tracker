import React from 'react';

const Welcome: React.FC = () => {
  return (
    <div className='bg-frontPage  flex flex-col md:flex-row h-screen'>
      <div className='flex flex-col justify-center items-start w-full p-16 md:w-1/2'>
        <p className='font-bold mb-4 text-8xl font-nunito'>
          Welcome to your stock portfolio
        </p>
        <button className="bg-darkGreen text-white text-l ml-2 mr-0 my-4 rounded-full px-5 py-6 font-bold hover:bg-gradient-to-t 
        from-lightGreen via-darkGreen to-darkerGreen">
            Open an account
          </button>
      </div>

      <div className='w-full md:w-1/2 flex justify-center items-center'>
        <img src="/images/welcomeLogo.png" alt="logo" />
      </div>
    </div>
    
  );
};

export default Welcome;
