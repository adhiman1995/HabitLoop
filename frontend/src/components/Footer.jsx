import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-10 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        &copy; {new Date().getFullYear()} HabitLoop. All rights reserved.
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                            Privacy Policy
                        </button>
                        <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                            Terms of Service
                        </button>
                        <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
