// src/components/charts/CategoryPieChart.jsx
import React, { useState } from 'react';

export const CategoryPieChart = ({ courses = [] }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Group courses by category
  const categoryCounts = {};
  courses.forEach((c) => {
    const cat = c.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryColors = {
    'Web Development': '#4f46e5',
    'Data Science & AI': '#9333ea',
    'UI/UX Design': '#ea580c',
    'Cloud & DevOps': '#0891b2',
    'Mobile Apps': '#059669',
    'Cybersecurity': '#e11d48',
    'Other': '#64748b'
  };

  const total = courses.length || 1;
  const categories = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    count: categoryCounts[cat],
    percentage: Math.round((categoryCounts[cat] / total) * 100),
    color: categoryColors[cat] || '#6366f1'
  }));

  // Calculate SVG donut stroke arcs
  let accumulatedAngle = 0;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="22"
              className="text-slate-100 dark:text-slate-800"
            />
            {categories.map((cat) => {
              const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedAngle;
              accumulatedAngle += (cat.percentage / 100) * circumference;

              const isHovered = hoveredCategory === cat.name;

              return (
                <circle
                  key={cat.name}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={cat.color}
                  strokeWidth={isHovered ? '26' : '22'}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredCategory(cat.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {hoveredCategory
                ? categories.find((c) => c.name === hoveredCategory)?.count
                : courses.length}
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {hoveredCategory ? 'Courses' : 'Total'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                hoveredCategory === cat.name
                  ? 'bg-slate-100 dark:bg-slate-800 font-bold'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
              onMouseEnter={() => setHoveredCategory(cat.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">{cat.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 dark:text-slate-500 font-normal">{cat.count} courses</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 w-8 text-right">
                  {cat.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
