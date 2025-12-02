import React from 'react';
import Header from '../components/Header';
import appstore from "../assets/images/appstore.png";
import playstore from "../assets/images/playstore.png";
import dietqueen from "../assets/images/dietqueen.png"

const DietConsultation = () => {
    return (
        <div className="flex flex-col">
            <Header title="Celebrity Diet Consultation" />

            {/* Center Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 text-center pt-24 pb-20">
                <div className="space-y-6">
                    <div>
                        <p className="font-semibold text-sm text-gray-800">Get a free diet consultation from</p>
                        <h1 className="font-bold text-4xl mt-2 text-gray-800">Dr. Kiran Rukadikar</h1>
                    </div>

                    {/* <div className="py-8">
                        <h2 className="text-5xl font-bold text-blue-950">DietQueen</h2>
                    </div> */}
                    <div className='flex items-center justify-center py-8'>
                    <img src="https://dietqueen.in/assets/images/logo.png" alt="diet-queen logo" />
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Diet Queen's program is totally focused on Home Diet and Walking for effective, healthy, and long-term 
                            women weight loss which begins in your own Kitchen
                        </p>
                    </div>

                    <div className="mt-12 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Download our app to get started</h3>
                        <div className="flex flex-col items-center gap-4">
                            <a 
                            href='https://apps.apple.com/in/app/dietqueen/id1537355714'
                            className='flex items-center gap-2 border px-7 py-2 border-gray-400 active:bg-gray-200 rounded-md'>
                                <img src={appstore} alt="Download on the App Store" className="h-8 w-8" />
                                <p className='text-gray-600 font-medium'>Open App Store</p>
                            </a>
                            <a 
                            href='https://play.google.com/store/apps/details?id=com.livennew.latestdietqueen'
                            className='flex items-center gap-2 border px-7 py-2 border-gray-400 active:bg-gray-200 rounded-md'>
                                <img src={playstore} alt="Download on the Play Store" className="h-8 w-8" />
                                <p className='text-gray-600 font-medium'>Open Play Store</p>
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DietConsultation;
