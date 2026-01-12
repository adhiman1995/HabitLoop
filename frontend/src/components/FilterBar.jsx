import React from 'react';
import { FiFilter, FiCheck } from 'react-icons/fi';
import { CATEGORIES } from '../utils/helpers';

const FilterBar = ({ selectedCategory, onCategoryChange }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-2 mb-8 flex flex-col sm:flex-row items-center gap-4 transition-colors">
            <div className="flex items-center gap-2 pl-4 py-2 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-xs whitespace-nowrap border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-700 sm:pr-4 w-full sm:w-auto">
                <FiFilter className="text-lg text-blue-500" />
                <span>Filter by</span>
            </div>

            <div className="flex flex-wrap gap-2 p-1 w-full sm:w-auto">
                <button
                    onClick={() => onCategoryChange(null)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-2 ${selectedCategory === null
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/20'
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
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-2 ${selectedCategory === category.name
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/20'
                            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400'
                            }`}
                    >
                        {selectedCategory === category.name && <FiCheck />}
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
