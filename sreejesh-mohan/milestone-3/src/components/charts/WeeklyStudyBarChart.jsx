// src/components/charts/WeeklyStudyBarChart.jsx
import React, { useState } from 'react';
import { Clock, TrendingUp } from 'lucide-react';

export const WeeklyStudyBarChart = ({ data = [], targetDailyMinutes = 90 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Maximum minutes for height scaling (at least target or 120 mins)
  const maxMinutes = Math.max(
    targetDailyMinutes * 1.3,
    ...data.map((d) => d.minutes),
    120
  );

  const chartHeight = 180;
  const targetY = chartHeight - (targetDailyMinutes / maxMinutes) * chartHeight;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            7-Day Activity
          </span>
          <h4 className="text-base font-bold text-slate-800 dark:text-white">Study Hours This Week</h4>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-500 inline-block" />
            <span>Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-slate-400 dark:border-slate-600 inline-block" />
            <span>Target ({Math.round(targetDailyMinutes / 60 * 10) / 10}h)</span>
          </div>
        </div>
      </div>

      <div className="relative pt-6 pb-2">
        {/* Target Benchmark Line */}
        <div
          className="absolute left-0 right-0 border-t border-dashed border-slate-300 dark:border-slate-700 z-0 flex items-center justify-end"
          style={{ top: `${targetY + 24}px` }}
        >
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 rounded -translate-y-2.5">
            Target
          </span>
        </div>

        {/* Bars Container */}
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-[180px] relative z-10">
          {data.map((item, index) => {
            const barHeight = Math.max(6, (item.minutes / maxMinutes) * chartHeight);
            const isHovered = hoveredIndex === index;
            const metTarget = item.minutes >= targetDailyMinutes;

            return (
              <div
                key={item.date || index}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                <div
                  className={`absolute -top-3 transition-all duration-200 pointer-events-none z-20 ${
                    isHovered ? 'opacity-100 scale-100 -translate-y-4' : 'opacity-0 scale-95'
                  }`}
                >
                  <div className="bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg py-1 px-2.5 shadow-xl border border-slate-800 dark:border-slate-700 whitespace-nowrap">
                    <p className="font-semibold">{item.day} ({item.date})</p>
                    <p className="text-indigo-300">
                      {Math.floor(item.minutes / 60)}h {item.minutes % 60}m logged
                    </p>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden flex flex-col justify-end p-0.5 h-full">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      metTarget
                        ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-700 group-hover:to-indigo-500'
                        : 'bg-gradient-to-t from-slate-400 to-slate-300 group-hover:from-indigo-400 group-hover:to-indigo-300'
                    }`}
                    style={{ height: `${barHeight}px` }}
                  />
                </div>

                {/* Day Label */}
                <span
                  className={`mt-2 text-xs font-medium transition-colors ${
                    isHovered ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.day}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 -mt-0.5">
                  {item.hours}h
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
