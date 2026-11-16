import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDailyTarget } from '../features/goals/goalsSlice';
import ProgressBar from '../components/ProgressBar';
import { PageIntro, StatCard } from '../components/UI';
import { localDateKey } from '../utils/date';

const dateKey = localDateKey;
const today = localDateKey();
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Goals() {
  const { dailyTarget, dailyProgress, streak } = useSelector((state) => state.goals);
  const activities = useSelector((state) => state.readingActivity.items);
  const dispatch = useDispatch();
  const [targetValue, setTargetValue] = useState(dailyTarget);
  const [saved, setSaved] = useState(false);
  const pagesToday = dailyProgress[today] || 0;
  const remaining = Math.max(0, dailyTarget - pagesToday);
  const percent = Math.min(100, Math.round((pagesToday / dailyTarget) * 100));
  const mondayOffset = (new Date().getDay() + 6) % 7;
  const week = Array.from({ length: 7 }, (_, index) => {
    const daysAway = index - mondayOffset;
    const date = new Date();
    date.setDate(date.getDate() + daysAway);
    const labelIndex = (date.getDay() + 6) % 7;
    return { key: dateKey(date), label: dayLabels[labelIndex], pages: dailyProgress[dateKey(date)] || 0 };
  });
  const weeklyTotal = week.reduce((sum, day) => sum + day.pages, 0);
  const maxPages = Math.max(dailyTarget, ...week.map((day) => day.pages), 1);
  const totalRead = activities.reduce((sum, activity) => sum + (activity.pages || 0), 0);

  const saveTarget = async (event) => {
    event.preventDefault();
    if (Number(targetValue) > 0) {
      const result = await dispatch(setDailyTarget(targetValue));
      if (setDailyTarget.fulfilled.match(result)) {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2200);
      }
    }
  };

  return (
    <div className="page-content">
      <PageIntro eyebrow="SMALL STEPS, GOOD STORIES" title="Make time for reading" description="Set a gentle intention and watch the pages add up." />
      <section className="goal-overview">
        <div className="goal-today-card"><div className="goal-today-title"><span className="goal-icon">✷</span><div><span className="eyebrow">YOUR DAILY INTENTION</span><h3>Today’s reading</h3></div><span className="streak-pill">✦ {streak} day streak</span></div><div className="goal-today-count"><strong>{pagesToday}</strong><span>pages read today</span><small>{remaining ? `${remaining} pages to meet your goal` : 'You reached your goal today!'}</small></div><ProgressBar value={percent} color="sage" /><div className="goal-today-footer"><span>{percent}% complete</span><span>Daily target <b>{dailyTarget} pages</b></span></div></div>
        <form className="target-card" onSubmit={saveTarget}><span className="eyebrow">A GOAL THAT FITS YOUR DAY</span><h3>Set your daily target</h3><p>Even a few pages a day can take you somewhere wonderful.</p><label className="field">Pages per day<div className="number-input-wrap"><input type="number" min="1" max="1000" value={targetValue} onChange={(event) => setTargetValue(event.target.value)} /><span>pages</span></div></label><button className="button button-primary" type="submit">{saved ? '✓ Goal saved' : 'Update my goal'} <span>→</span></button></form>
      </section>
      <section className="goals-stats-grid"><StatCard icon="◷" label="Reading streak" value={`${streak} days`} note="You’re building a lovely habit" tone="lavender" /><StatCard icon="▤" label="Pages this week" value={weeklyTotal} note="One page at a time" tone="sage" /><StatCard icon="✳" label="Pages logged" value={totalRead} note="Your recent reading sessions" tone="peach" /></section>
      <section className="weekly-detail-card"><div className="section-heading"><div><span className="eyebrow">A LITTLE EVERY DAY</span><h3>Your week in pages</h3></div><span className="weekly-total">{weeklyTotal} <small>pages this week</small></span></div><div className="week-chart">{week.map((day) => <div className="week-day" key={day.key}><span className="week-bar-track"><span className={`week-bar ${day.key === today ? 'today' : ''}`} style={{ height: `${Math.max(day.pages ? 6 : 0, (day.pages / maxPages) * 100)}%` }} /></span><strong>{day.pages}</strong><small>{day.label}</small></div>)}</div><div className="weekly-target-note"><span>DAILY TARGET</span><ProgressBar value={Math.min(100, (weeklyTotal / (dailyTarget * 7)) * 100)} /><strong>{dailyTarget} pages</strong></div></section>
    </div>
  );
}
