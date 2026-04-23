// Practice Set — Review, Practice (MCQ), Submitted screens
(function () {
  const { useState, useMemo, useEffect, useRef } = React;
  const { MnbIcon: Icon, MnbButton: Button, MnbStepper: Stepper, MnbChip: Chip, MnbCheckbox: Checkbox, MnbProgress: Progress, MnbTopBar: TopBar } = window;

  // ========== REVIEW SCREEN ==========
  function ReviewScreen({ selection, onBack, onStart, onEdit }) {
    const course = window.PRACTICE_COURSE;
    const [shuffle, setShuffle] = useState(true);
    const [setName, setSetName] = useState('');

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
    const total = rows.reduce((a, r) => a + (r.kind === 'book' ? r.count : r.items.reduce((b, it) => b + it.count, 0)), 0);
    const estMin = Math.max(1, Math.round(total * 1.2));

    return (
      <div style={{flex: 1, background: '#F2F2F4', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <TopBar title="Review Practice Set" onBack={onBack}/>
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
              <div style={{fontFamily: 'Roboto', fontSize: 11, letterSpacing: .4, textTransform: 'uppercase', opacity: .8}}>Your practice set</div>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4}}>
                <span style={{fontFamily: 'Roboto', fontWeight: 900, fontSize: 44, letterSpacing: -1}}>{total}</span>
                <span style={{fontFamily: 'Roboto', fontSize: 14, opacity: .85}}>questions</span>
              </div>
              <div style={{display: 'flex', gap: 16, marginTop: 10, fontFamily: 'Roboto', fontSize: 12, opacity: .9}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 4}}><Icon.timer color="#fff" size={14}/> ~{estMin} min</div>
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

          {/* Name input */}
          <div style={{background: '#fff', borderRadius: 12, padding: 14, border: '1px solid rgba(28,30,44,.12)', marginBottom: 10}}>
            <label style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.55)', letterSpacing: .3, textTransform: 'uppercase'}}>Name (optional)</label>
            <input
              type="text" placeholder="e.g. Weekend review"
              value={setName} onChange={(e) => setSetName(e.target.value)}
              style={{
                display: 'block', width: '100%', marginTop: 6, border: 'none', outline: 'none',
                fontFamily: 'Roboto', fontSize: 15, color: 'rgba(28,30,44,.87)',
                padding: '4px 0', borderBottom: '1px solid rgba(28,30,44,.12)',
              }}
            />
          </div>

          {/* Settings */}
          <div style={{background: '#fff', borderRadius: 12, border: '1px solid rgba(28,30,44,.12)', marginBottom: 16, overflow: 'hidden'}}>
            <div style={{padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12}}>
              <div style={{width: 32, height: 32, borderRadius: 8, background: '#E4F7FE', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon.shuffle color="#0E7FA6" size={16}/>
              </div>
              <div style={{flex: 1}}>
                <div style={{fontFamily: 'Roboto', fontWeight: 500, fontSize: 14, color: 'rgba(28,30,44,.87)'}}>Shuffle questions</div>
                <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.55)', marginTop: 2}}>Randomize order across chapters</div>
              </div>
              <Toggle on={shuffle} onChange={setShuffle}/>
            </div>
          </div>

          {/* Breakdown per chapter */}
          <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 14, color: 'rgba(28,30,44,.87)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <span>Breakdown</span>
            <button onClick={onEdit} style={{border: 'none', background: 'transparent', color: '#395AD2', fontFamily: 'Roboto', fontWeight: 600, fontSize: 13, cursor: 'pointer'}}>Edit</button>
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
                        {r.topicCount} topic{r.topicCount === 1 ? '' : 's'} selected
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
          <Button full size="md" onClick={() => onStart({selection, name: setName, shuffle, total})}>Start Practice</Button>
        </div>
      </div>
    );
  }

  function Toggle({ on, onChange }) {
    return (
      <div onClick={() => onChange(!on)} style={{
        width: 40, height: 24, borderRadius: 999,
        background: on ? '#395AD2' : 'rgba(28,30,44,.18)',
        position: 'relative', cursor: 'pointer', transition: 'background .2s',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: on ? 18 : 2,
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          transition: 'left .2s', boxShadow: '0 2px 4px rgba(0,0,0,.15)',
        }}/>
      </div>
    );
  }

  // ========== PRACTICE (MCQ) SCREEN ==========
  function PracticeScreen({ total, onFinish, onBack }) {
    const qs = window.PRACTICE_QUESTIONS;
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState({}); // idx -> choiceIdx
    const [picked, setPicked] = useState(null);
    const q = qs[idx % qs.length];
    const current = answers[idx];

    useEffect(() => { setPicked(answers[idx] ?? null); }, [idx]);

    const next = () => {
      if (picked !== null) setAnswers({...answers, [idx]: picked});
      if (idx < total - 1) setIdx(idx + 1);
      else onFinish({answered: Object.keys(answers).length + (picked !== null ? 1 : 0)});
    };
    const prev = () => idx > 0 && setIdx(idx - 1);

    // Build the indicators (answered / current / default)
    return (
      <div style={{flex: 1, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <TopBar title={`Question ${idx + 1} of ${total}`} onBack={onBack} right={
          <div style={{display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Roboto', fontWeight: 500, fontSize: 13, color: 'rgba(28,30,44,.6)'}}>
            <Icon.timer color="rgba(28,30,44,.6)" size={14}/> 02:37
          </div>
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
          <Button kind="secondary" onClick={prev} disabled={idx === 0} style={{minWidth: 80}}>Back</Button>
          <Button full size="md" disabled={picked === null} onClick={next}>
            {idx === total - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
    );
  }

  // ========== SUBMITTED (matching the uploaded reference) ==========
  function SubmittedScreen({ onNext, total, score = 72 }) {
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

          <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 30, marginBottom: 14}}>Submitted</div>
          <div style={{fontFamily: 'Roboto', fontSize: 14, lineHeight: 1.5, maxWidth: 280, color: 'rgba(255,255,255,.85)'}}>
            Score can be viewed in attempt history screen. Note that it might take some time for score to be generated.
          </div>

          {/* Optional stats preview */}
          <div style={{marginTop: 28, display: 'flex', gap: 10}}>
            <div style={{background: 'rgba(255,255,255,.12)', borderRadius: 10, padding: '10px 14px', minWidth: 80}}>
              <div style={{fontFamily: 'Roboto', fontSize: 11, opacity: .8}}>Questions</div>
              <div style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 20, marginTop: 2}}>{total}</div>
            </div>
            <div style={{background: 'rgba(255,255,255,.12)', borderRadius: 10, padding: '10px 14px', minWidth: 80}}>
              <div style={{fontFamily: 'Roboto', fontSize: 11, opacity: .8}}>Time</div>
              <div style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 20, marginTop: 2}}>12:04</div>
            </div>
          </div>
        </div>

        <div style={{padding: '20px 24px 28px', display: 'flex', justifyContent: 'flex-end'}}>
          <Button kind="white" size="md" onClick={onNext} style={{minWidth: 140}}>Next</Button>
        </div>
      </div>
    );
  }

  Object.assign(window, { MnbReviewScreen: ReviewScreen, MnbPracticeScreen: PracticeScreen, MnbSubmittedScreen: SubmittedScreen });
})();
