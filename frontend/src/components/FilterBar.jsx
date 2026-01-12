import React from 'react';
import { FiFilter, FiCheck } from 'react-icons/fi';
import { CATEGORIES } from '../utils/helpers';

const FilterBar = ({ selectedCategory, onCategoryChange }) => {
    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-2 mb-8 flex flex-col sm:flex-row items-center gap-4 animate-fadeIn">
            <div className="flex items-center gap-2 pl-4 py-2 text-slate-400 font-bold uppercase tracking-wider text-xs whitespace-nowrap border-b sm:border-b-0 sm:border-r border-slate-100 sm:pr-4 w-full sm:w-auto">
                <FiFilter className="text-lg text-blue-500" />
                <span>Filter by</span>
            </div>

            <div className="flex flex-wrap gap-2 p-1 w-full sm:w-auto">
                <button
                    onClick={() => onCategoryChange(null)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${selectedCategory === null
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
                        : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                        }`}
                >
                    {selectedCategory === null && <FiCheck />}
                    All
                </button>

                {CATEGORIES.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => onCategoryChange(category.name)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${selectedCategory === category.name
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
                            : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                            }`}
                    >
                        {selectedCategory === category.name && <FiCheck />}
                        {category.name}
                    </button>
                ))}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default FilterBar;
