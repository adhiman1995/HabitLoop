import React from 'react';
import { FiFilter, FiCheck } from 'react-icons/fi';
import { CATEGORIES } from '../utils/helpers';

const FilterBar = ({ selectedCategory, onCategoryChange }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm p-2 mb-8 flex flex-col sm:flex-row items-center gap-4 transition-colors">
            <div className="flex items-center gap-2 pl-4 py-2 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-xs whitespace-nowrap border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 sm:pr-4 w-full sm:w-auto">
                <FiFilter className="text-lg text-blue-500" />
                <span>Filter by</span>
            </div>

            <div className="flex flex-wrap gap-2 p-1 w-full sm:w-auto">
                <button
                    onClick={() => onCategoryChange(null)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-2 ${selectedCategory === null
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                >
                    {selectedCategory === null && <FiCheck />}
                    All
                </button>

                {CATEGORIES.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => onCategoryChange(category.name)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 border ${selectedCategory === category.name
                            ? `${category.color} ${category.textColor} border-transparent shadow-md scale-105`
                            : `bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700`
                            }`}
                    >
                        {selectedCategory === category.name && <FiCheck strokeWidth={3} />}
                        <span className={selectedCategory !== category.name ? category.textClass || '' : ''}>{category.name}</span>
                        {selectedCategory !== category.name && (
                            <span className={`w-2.5 h-2.5 rounded-sm ${category.color}`}></span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
