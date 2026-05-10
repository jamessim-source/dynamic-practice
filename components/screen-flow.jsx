// Practice Set — Review, Practice (MCQ), Submitted screens
(function () {
  const { useState, useMemo, useEffect, useRef } = React;
  const { MnbIcon: Icon, MnbButton: Button, MnbStepper: Stepper, MnbChip: Chip, MnbCheckbox: Checkbox, MnbProgress: Progress, MnbTopBar: TopBar } = window;

  // ========== REVIEW SCREEN ==========
  function ReviewScreen({ selection, onBack, onStart, onEdit }) {
    window.useLang();
    const LangToggle = window.MnbLangToggle;
    const course = window.PRACTICE_COURSE;

    // Build rows: book-kind entries first, then LO-kind entries grouped by chapter.
    const rows = [];
    (course.books || []).forEach(bk => {
      const entry = selection[bk.id];
      if (entry?.kind === 'book' && entry.count > 0) {
        const totalTopics = bk.chapters.reduce((a, c) => a + c.topics.length, 0);
        rows.push({ kind: 'book', book: bk, count: entry.count, topicCount: totalTopics });
      }
    });
    course.chapters.forEach(ch => {
      const loEntries = [];
      ch.topics.forEach(t => t.los.forEach(lo => {
        if (selection[lo.id]?.kind === 'lo' && (selection[lo.id]?.count || 0) > 0) {
          loEntries.push({
            key: lo.id,
            label: lo.title,
            subtitle: `${lo.code} · ${t.title}`,
            count: selection[lo.id].count,
          });
        }
      }));
      if (loEntries.length) rows.push({ kind: 'chapter', chapter: ch, items: loEntries });
    });
    const total      = rows.reduce((a, r) => a + (r.kind === 'book' ? r.count : r.items.reduce((b, it) => b + it.count, 0)), 0);
    const estMinutes = Math.max(1, Math.round(total * 1.5));

    return (
      <div style={{flex: 1, background: '#F2F2F4', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <TopBar title={window.t('review_practice_set')} onBack={onBack} right={LangToggle && <LangToggle/>}/>
        <div style={{flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 16px 16px'}}>
          {/* Big summary */}
          <div style={{
            background: 'linear-gradient(135deg, #395AD2 0%, #5533FF 100%)',
            borderRadius: 12, padding: 20, color: '#fff',
            marginBottom: 16, position: 'relative', overflow: 'hidden',
            boxShadow: '0 10px 28px rgba(57,90,210,.25)',
          }}>
            <div style={{position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(28,183,235,.25)'}}/>
            <div style={{position: 'relative'}}>
              <div style={{fontFamily: 'Roboto', fontSize: 11, letterSpacing: .4, textTransform: 'uppercase', opacity: .8}}>{window.t('your_practice_set')}</div>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4, flexWrap: 'wrap'}}>
                <span style={{fontFamily: 'Roboto', fontWeight: 900, fontSize: 44, letterSpacing: -1}}>{total}</span>
                <span style={{fontFamily: 'Roboto', fontSize: 14, opacity: .85}}>{window.t('questions')}</span>
                <span style={{fontFamily: 'Roboto', fontSize: 22, opacity: .4, lineHeight: 1}}>·</span>
                <span style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 28, letterSpacing: -.5, fontVariantNumeric: 'tabular-nums'}}>{window.t('est_time', estMinutes)}</span>
                <span style={{fontFamily: 'Roboto', fontSize: 14, opacity: .85}}>{window.t('est_time_label')}</span>
              </div>
              <div style={{display: 'flex', gap: 16, marginTop: 10, fontFamily: 'Roboto', fontSize: 12, opacity: .9}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
                  <Icon.book color="#fff" size={14}/>
                  {(() => {
                    const bookRows = rows.filter(r => r.kind === 'book');
                    const chapRows = rows.filter(r => r.kind === 'chapter');
                    if (bookRows.length > 0 && chapRows.length > 0)
                      return `${bookRows.length} book${bookRows.length === 1 ? '' : 's'} · ${chapRows.length} chapter${chapRows.length === 1 ? '' : 's'}`;
                    if (bookRows.length > 0)
                      return `${bookRows.length} book${bookRows.length === 1 ? '' : 's'}`;
                    return `${chapRows.length} chapter${chapRows.length === 1 ? '' : 's'}`;
                  })()}
                </div>
              </div>
            </div>
          </div>

          {rows.map((r, i) => {
            if (r.kind === 'book') {
              return (
                <div key={i} style={{background: '#fff', borderRadius: 12, border: '1px solid rgba(28,30,44,.12)', marginBottom: 8, overflow: 'hidden'}}>
                  <div style={{padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10}}>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.55)', letterSpacing: .3, textTransform: 'uppercase'}}>{r.book.code}</div>
                      <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 14, color: 'rgba(28,30,44,.87)', marginTop: 2}}>{r.book.title}</div>
                      <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.55)', marginTop: 4}}>
                        {r.topicCount} {window.t(r.topicCount === 1 ? 'topic_selected' : 'topics_selected')}
                      </div>
                    </div>
                    <div style={{padding: '4px 10px', borderRadius: 999, background: '#EAF1FF', color: '#395AD2', fontFamily: 'Roboto', fontWeight: 700, fontSize: 12, flexShrink: 0}}>{r.count} Qs</div>
                  </div>
                </div>
              );
            }
            const chTotal = r.items.reduce((a, it) => a + it.count, 0);
            return (
              <div key={i} style={{background: '#fff', borderRadius: 12, border: '1px solid rgba(28,30,44,.12)', marginBottom: 8, overflow: 'hidden'}}>
                <div style={{padding: '12px 14px', borderBottom: '1px solid rgba(28,30,44,.08)', display: 'flex', alignItems: 'center', gap: 10}}>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.55)', letterSpacing: .3, textTransform: 'uppercase'}}>{r.chapter.code}</div>
                    <div style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 14, color: 'rgba(28,30,44,.87)', marginTop: 2}}>{r.chapter.title}</div>
                  </div>
                  <div style={{padding: '4px 10px', borderRadius: 999, background: '#EAF1FF', color: '#395AD2', fontFamily: 'Roboto', fontWeight: 700, fontSize: 12}}>{chTotal} Qs</div>
                </div>
                {r.items.map(it => (
                  <div key={it.key} style={{padding: '10px 14px', borderTop: '1px solid rgba(28,30,44,.06)', display: 'flex', alignItems: 'center', gap: 10}}>
                    <div style={{flex: 1, minWidth: 0}}>
                      {it.subtitle && (
                        <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2}}>
                          <span style={{
                            padding: '1px 6px', borderRadius: 4,
                            background: 'rgba(57,90,210,.1)', color: '#395AD2',
                            fontFamily: 'Roboto', fontWeight: 700, fontSize: 10, letterSpacing: .3,
                          }}>LO</span>
                          <span style={{fontFamily: 'Roboto', fontSize: 10, color: 'rgba(28,30,44,.5)', letterSpacing: .2, textTransform: 'uppercase'}}>{it.subtitle}</span>
                        </div>
                      )}
                      <div style={{fontFamily: 'Roboto', fontSize: 13, color: 'rgba(28,30,44,.87)', lineHeight: 1.35}}>{it.label}</div>
                    </div>
                    <div style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 13, color: '#395AD2', fontVariantNumeric: 'tabular-nums'}}>{it.count}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div style={{flexShrink: 0, padding: '12px 16px 14px', background: '#fff', borderTop: '1px solid rgba(28,30,44,.08)', boxShadow: '0 -6px 16px rgba(0,0,0,.04)'}}>
          <Button full size="md" onClick={() => onStart({selection, total})}>{window.t('start_practice')}</Button>
        </div>
      </div>
    );
  }

  // ========== PRACTICE (MCQ) SCREEN ==========
  function PracticeScreen({ total, onFinish, onBack }) {
    window.useLang();
    const qs = window.PRACTICE_QUESTIONS;
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState({}); // idx -> choiceIdx
    const [picked, setPicked] = useState(null);
    const q = qs[idx % qs.length];
    const current = answers[idx];

    useEffect(() => { setPicked(answers[idx] ?? null); }, [idx]);

    const next = () => {
      const finalAnswers = picked !== null ? {...answers, [idx]: picked} : answers;
      if (picked !== null) setAnswers(finalAnswers);
      if (idx < total - 1) {
        setIdx(idx + 1);
      } else {
        const correct = Object.keys(finalAnswers).filter(i => finalAnswers[i] === qs[Number(i) % qs.length].correct).length;
        onFinish({ answered: Object.keys(finalAnswers).length, correct });
      }
    };
    const prev = () => idx > 0 && setIdx(idx - 1);

    // Build the indicators (answered / current / default)
    return (
      <div style={{flex: 1, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <TopBar title={window.t('question_of', idx + 1, total)} onBack={onBack} right={
          <button style={{
            border: '2px solid #395AD2', borderRadius: 999,
            background: 'transparent', padding: '5px 14px',
            fontFamily: 'Roboto', fontWeight: 700, fontSize: 13, color: '#395AD2',
            cursor: 'pointer', letterSpacing: .2,
          }}>Mana AI</button>
        }/>

        {/* Progress bar */}
        <div style={{padding: '0 16px 12px', borderBottom: '1px solid rgba(28,30,44,.08)'}}>
          <div style={{height: 6, background: '#F2F2F4', borderRadius: 999, overflow: 'hidden', marginTop: 12}}>
            <div style={{width: `${((idx + 1) / total) * 100}%`, height: '100%', background: '#395AD2', borderRadius: 999, transition: 'width .3s'}}/>
          </div>
          <div style={{display: 'flex', gap: 4, marginTop: 10, overflowX: 'auto', paddingBottom: 2}}>
            {Array.from({length: total}).map((_, n) => {
              const answered = answers[n] !== undefined;
              const isCurrent = n === idx;
              return (
                <button key={n} onClick={() => setIdx(n)} style={{
                  width: 28, height: 28, borderRadius: '50%', border: 'none', flexShrink: 0,
                  background: isCurrent ? '#395AD2' : answered ? '#EAF1FF' : '#F2F2F4',
                  color: isCurrent ? '#fff' : answered ? '#395AD2' : 'rgba(28,30,44,.55)',
                  fontFamily: 'Roboto', fontWeight: 700, fontSize: 11, cursor: 'pointer',
                  boxShadow: isCurrent ? '0 3px 10px rgba(57,90,210,.3)' : 'none',
                  transition: 'all .15s',
                }}>{n + 1}</button>
              );
            })}
          </div>
        </div>

        <div style={{flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 20px 16px'}}>
          <div style={{
            display: 'inline-block', padding: '3px 10px', borderRadius: 999,
            background: '#E4F7FE', color: '#0E7FA6',
            fontFamily: 'Roboto', fontWeight: 600, fontSize: 11, letterSpacing: .3,
          }}>{q.chapter}</div>
          <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 18, lineHeight: 1.45, color: 'rgba(28,30,44,.87)', margin: '14px 0 20px'}}>{q.prompt}</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            {q.choices.map((c, i) => {
              const on = picked === i;
              return (
                <button key={i} onClick={() => setPicked(i)} style={{
                  textAlign: 'left', padding: '14px 16px', borderRadius: 10,
                  border: `2px solid ${on ? '#395AD2' : 'rgba(28,30,44,.12)'}`,
                  background: on ? '#F7FAFF' : '#fff',
                  fontFamily: 'Roboto', fontWeight: on ? 600 : 400, fontSize: 14, color: 'rgba(28,30,44,.87)',
                  cursor: 'pointer', transition: 'all .15s',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${on ? '#395AD2' : 'rgba(28,30,44,.25)'}`,
                    background: on ? '#395AD2' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{on && <Icon.check color="#fff" size={12}/>}</span>
                  <span style={{flex: 1}}>{c}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{flexShrink: 0, padding: '12px 16px', background: '#fff', borderTop: '1px solid rgba(28,30,44,.08)', display: 'flex', gap: 10}}>
          <Button kind="secondary" onClick={prev} disabled={idx === 0} style={{minWidth: 80}}>{window.t('prev')}</Button>
          <Button full size="md" disabled={picked === null} onClick={next}>
            {idx === total - 1 ? 'Submit' : window.t('next')}
          </Button>
        </div>
      </div>
    );
  }

  // ========== SUBMITTED (matching the uploaded reference) ==========
  function SubmittedScreen({ onNext, total, correct = 0 }) {
    window.useLang();
    return (
      <div style={{flex: 1, background: '#395AD2', display: 'flex', flexDirection: 'column', overflow: 'hidden', color: '#fff', position: 'relative'}}>
        {/* Deco shapes */}
        <div style={{position: 'absolute', top: 120, left: 40, width: 28, height: 28, background: '#6B84E6', borderRadius: 6, transform: 'rotate(45deg)'}}/>
        <div style={{position: 'absolute', top: 260, right: 55, width: 16, height: 16, background: '#6B84E6', borderRadius: 4, transform: 'rotate(45deg)'}}/>
        <div style={{position: 'absolute', top: 320, left: 60, width: 22, height: 22, background: '#6B84E6', borderRadius: 5, transform: 'rotate(45deg)'}}/>
        <div style={{position: 'absolute', top: 180, right: 30, width: 18, height: 18, background: '#6B84E6', borderRadius: 5, transform: 'rotate(45deg)'}}/>

        <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', position: 'relative'}}>
          {/* Coin */}
          <div style={{position: 'relative', marginBottom: 28}}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #FFE08A, #FFC20A 65%, #C69400)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 14px 30px rgba(0,0,0,.2), inset -5px -8px 0 rgba(0,0,0,.12)',
            }}>
              <div style={{width: 80, height: 80, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l5 5L19 7" stroke="#3ACE85" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
            <div style={{width: 90, height: 10, borderRadius: '50%', background: 'rgba(0,0,0,.18)', margin: '8px auto 0', filter: 'blur(4px)'}}/>
          </div>

          <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 24, marginBottom: 16}}>Submitted</div>

          {/* Score */}
          <div style={{marginBottom: 20, textAlign: 'center'}}>
            <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6}}>
              <span style={{fontFamily: 'Roboto', fontWeight: 900, fontSize: 56, letterSpacing: -2, lineHeight: 1}}>{correct}</span>
              <span style={{fontFamily: 'Roboto', fontWeight: 400, fontSize: 28, opacity: .5}}>/</span>
              <span style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 32, opacity: .85}}>{total}</span>
            </div>
            <div style={{fontFamily: 'Roboto', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .6, opacity: .7, marginTop: 4}}>Correct</div>
          </div>

          <div style={{fontFamily: 'Roboto', fontSize: 13, lineHeight: 1.5, maxWidth: 260, color: 'rgba(255,255,255,.7)'}}>
            Detailed results are available in your attempt history.
          </div>

          {/* Optional stats preview */}
          <div style={{marginTop: 28, display: 'flex', gap: 10}}>
            <div style={{background: 'rgba(255,255,255,.12)', borderRadius: 10, padding: '10px 14px', minWidth: 80}}>
              <div style={{fontFamily: 'Roboto', fontSize: 11, opacity: .8}}>{window.t('questions')}</div>
              <div style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 20, marginTop: 2}}>{total}</div>
            </div>
            <div style={{background: 'rgba(255,255,255,.12)', borderRadius: 10, padding: '10px 14px', minWidth: 80}}>
              <div style={{fontFamily: 'Roboto', fontSize: 11, opacity: .8}}>Time</div>
              <div style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 20, marginTop: 2}}>12:04</div>
            </div>
          </div>
        </div>

        <div style={{padding: '20px 24px 28px', display: 'flex', justifyContent: 'flex-end'}}>
          <Button kind="white" size="md" onClick={onNext}>{window.t('next')}</Button>
        </div>
      </div>
    );
  }

  // ========== ATTEMPT HISTORY SCREEN ==========
  function AttemptHistoryScreen({ onBack, onTakeAgain, attempts = [] }) {
    window.useLang();
    const LangToggle = window.MnbLangToggle;

    const pad = (n) => String(n).padStart(2, '0');
    const countStr = pad(attempts.length);

    return (
      <div style={{flex: 1, background: '#F2F2F4', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <TopBar title="Attempt History" onBack={onBack} right={LangToggle && <LangToggle/>}/>

        <div style={{flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 16px 100px'}}>
          {/* Stats card */}
          <div style={{
            background: 'linear-gradient(135deg, #395AD2 0%, #5533FF 100%)',
            borderRadius: 16, padding: '20px 24px',
            marginBottom: 24, color: '#fff',
            boxShadow: '0 10px 28px rgba(57,90,210,.25)',
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'rgba(255,255,255,.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon.timer color="#FFD166" size={28}/>
            </div>
            <div>
              <div style={{fontFamily: 'Roboto', fontWeight: 900, fontSize: 48, letterSpacing: -2, lineHeight: 1}}>{countStr}</div>
              <div style={{fontFamily: 'Roboto', fontSize: 13, opacity: .8, marginTop: 2}}>Attempts</div>
            </div>
          </div>

          {/* History table */}
          <div style={{
            background: '#fff', borderRadius: 14,
            border: '1px solid rgba(28,30,44,.1)',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,.04)',
          }}>
            {/* Header row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr auto auto auto',
              padding: '10px 16px',
              borderBottom: '1px solid rgba(28,30,44,.1)',
              background: '#FAFAFC',
            }}>
              <div style={{fontFamily: 'Roboto', fontSize: 11, fontWeight: 700, color: 'rgba(28,30,44,.5)', textTransform: 'uppercase', letterSpacing: .4}}>Date</div>
              <div style={{fontFamily: 'Roboto', fontSize: 11, fontWeight: 700, color: 'rgba(28,30,44,.5)', textTransform: 'uppercase', letterSpacing: .4, minWidth: 80, textAlign: 'center'}}>Status</div>
              <div style={{fontFamily: 'Roboto', fontSize: 11, fontWeight: 700, color: 'rgba(28,30,44,.5)', textTransform: 'uppercase', letterSpacing: .4, minWidth: 48, textAlign: 'right', marginLeft: 12}}>Score</div>
              <div style={{width: 20}}/>
            </div>

            {attempts.length === 0 && (
              <div style={{padding: '28px 16px', textAlign: 'center', fontFamily: 'Roboto', fontSize: 13, color: 'rgba(28,30,44,.4)'}}>
                No attempts yet
              </div>
            )}

            {[...attempts].reverse().map((a, i) => {
              const failed = a.status === 'failed' || (typeof a.correct === 'number' && a.correct < Math.ceil(a.total * 0.5));
              const statusLabel = failed ? 'FAILED' : 'SUBMITTED';
              const hasScore = typeof a.correct === 'number' && typeof a.total === 'number';
              const scoreStr = hasScore ? `${pad(a.correct)}/${pad(a.total)}` : '--/--';
              const isLast = i === attempts.length - 1;

              return (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto auto auto',
                  alignItems: 'center',
                  padding: '13px 16px',
                  borderBottom: isLast ? 'none' : '1px solid rgba(28,30,44,.07)',
                }}>
                  <div style={{fontFamily: 'Roboto', fontSize: 13, color: 'rgba(28,30,44,.87)', fontVariantNumeric: 'tabular-nums'}}>{a.date}</div>
                  <div style={{
                    padding: '3px 8px', borderRadius: 6,
                    border: `1.5px solid ${failed ? '#E53935' : '#395AD2'}`,
                    fontFamily: 'Roboto', fontWeight: 700, fontSize: 10, letterSpacing: .4,
                    color: failed ? '#E53935' : '#395AD2',
                    minWidth: 80, textAlign: 'center',
                  }}>{statusLabel}</div>
                  <div style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 13, color: 'rgba(28,30,44,.87)', fontVariantNumeric: 'tabular-nums', minWidth: 48, textAlign: 'right', marginLeft: 12}}>{scoreStr}</div>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: 20, marginLeft: 4}}>
                    {hasScore && <Icon.chevron color="rgba(28,30,44,.3)" size={16}/>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px 20px', background: '#F2F2F4', borderTop: '1px solid rgba(28,30,44,.08)'}}>
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button size="md" onClick={onTakeAgain}>Take Again</Button>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { MnbReviewScreen: ReviewScreen, MnbPracticeScreen: PracticeScreen, MnbSubmittedScreen: SubmittedScreen, MnbAttemptHistoryScreen: AttemptHistoryScreen });
})();
