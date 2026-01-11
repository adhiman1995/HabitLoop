import React from 'react';
import { CATEGORIES } from '../utils/helpers';

const FilterBar = ({ selectedCategory, onCategoryChange }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-8">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Filters</h3>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onCategoryChange(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === null
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                >
                    All
                </button>

                {CATEGORIES.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => onCategoryChange(category.name)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category.name
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
