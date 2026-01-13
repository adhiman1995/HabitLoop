import React from 'react';
import { FiFilter, FiCheck } from 'react-icons/fi';
import { CATEGORIES } from '../utils/helpers';

const FilterBar = ({ selectedCategory, onCategoryChange }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 mb-6 transition-colors">
            <div className="flex items-center flex-wrap gap-3">
                <button
                    onClick={() => onCategoryChange(null)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap ${selectedCategory === null
                        ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 scale-105'
                        : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                >
                    {selectedCategory === null && <FiCheck />}
                    All Activities
                </button>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

                {CATEGORIES.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => onCategoryChange(category.name)}
                        className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-sm flex items-center gap-2 whitespace-nowrap ${selectedCategory === category.name
                            ? `${category.color} ${category.textColor} scale-105`
                            : `bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600`
                            }`}
                    >
                        {selectedCategory === category.name && <FiCheck className="text-lg" />}
                        <span className={selectedCategory !== category.name ? category.textClass || '' : ''}>{category.name}</span>
                        {selectedCategory !== category.name && (
                            <span className={`w-2 h-2 rounded-full ${category.color}`}></span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
