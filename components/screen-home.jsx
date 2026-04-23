// Practice Set — Entry + Configure screens
(function () {
  const { useState, useMemo, useEffect } = React;
  const { MnbIcon: Icon, MnbButton: Button, MnbStepper: Stepper, MnbChip: Chip, MnbCheckbox: Checkbox, MnbProgress: Progress, MnbTopBar: TopBar } = window;

  // ---------- ENTRY: Course detail with Practice Set CTA ----------
  function CourseHomeScreen({ onCreatePractice, onOpenPastSet }) {
    const course = window.PRACTICE_COURSE;
    const totalQ = course.chapters.reduce((a, c) => a + c.available, 0);
    const doneQ = course.chapters.reduce((a, c) => a + c.attempted, 0);
    const pct = Math.round((doneQ / totalQ) * 100);

    const pastSets = [
      { id: 1, name: 'Tuesday warm-up', chapters: 3, count: 15, score: 80, date: 'Yesterday' },
      { id: 2, name: 'Grammar focus', chapters: 1, count: 20, score: 65, date: '3 days ago' },
    ];

    return (
      <div style={{flex: 1, background: '#F2F2F4', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <TopBar title={course.title} onBack={() => {}} />
        <div style={{flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 16px 24px'}}>
          {/* Summary card */}
          <div style={{
            background: 'linear-gradient(135deg, #395AD2 0%, #5533FF 100%)',
            borderRadius: 12, padding: 18, color: '#fff',
            boxShadow: '0 10px 28px rgba(57,90,210,.25)',
            marginBottom: 16, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(28,183,235,.25)'}}/>
            <div style={{position: 'absolute', right: 40, bottom: -24, width: 80, height: 80, borderRadius: '50%', background: 'rgba(165,254,202,.25)'}}/>
            <div style={{fontFamily: 'Roboto', fontWeight: 500, fontSize: 12, opacity: .8, letterSpacing: .4, textTransform: 'uppercase', position: 'relative'}}>Course progress</div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4, position: 'relative'}}>
              <div style={{fontFamily: 'Roboto', fontWeight: 900, fontSize: 32, letterSpacing: -.5}}>{doneQ}</div>
              <div style={{fontFamily: 'Roboto', fontSize: 14, opacity: .85}}>/{totalQ} questions practiced</div>
            </div>
            <div style={{marginTop: 10, height: 6, background: 'rgba(255,255,255,.2)', borderRadius: 999, overflow: 'hidden', position: 'relative'}}>
              <div style={{width: `${pct}%`, height: '100%', background: '#A5FECA', borderRadius: 999}}/>
            </div>
          </div>

          {/* Primary Practice CTA */}
          <div onClick={onCreatePractice} style={{
            background: '#fff', borderRadius: 12, padding: 16,
            border: '1px solid rgba(28,30,44,.1)',
            display: 'flex', alignItems: 'center', gap: 14,
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(57,90,210,.08)',
            marginBottom: 8, transition: 'transform .12s',
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(.99)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #1CB7EB 0%, #395AD2 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(28,183,235,.35)',
            }}>
              <Icon.sparkle color="#fff" size={22}/>
            </div>
            <div style={{flex: 1}}>
              <div style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 15, color: 'rgba(28,30,44,.87)'}}>Create Practice Set</div>
              <div style={{fontFamily: 'Roboto', fontWeight: 400, fontSize: 12, color: 'rgba(28,30,44,.6)', marginTop: 2}}>Pick chapters and question counts</div>
            </div>
            <div style={{padding: 8, borderRadius: '50%', background: '#F7F8FB'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="rgba(28,30,44,.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* Past practice sets */}
          <div style={{marginTop: 20, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 16, color: 'rgba(28,30,44,.87)'}}>Recent Practice Sets</div>
          </div>
          {pastSets.map(s => (
            <div key={s.id} onClick={() => onOpenPastSet && onOpenPastSet(s)} style={{
              background: '#fff', borderRadius: 8, padding: '12px 14px',
              border: '1px solid rgba(28,30,44,.12)', marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            }}>
              <div style={{width: 36, height: 36, borderRadius: 8, background: '#F2F2F4', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon.target color="#395AD2" size={18}/>
              </div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 14, color: 'rgba(28,30,44,.87)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{s.name}</div>
                <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.6)', marginTop: 2}}>{s.count} questions · {s.chapters} chapters · {s.date}</div>
              </div>
              <div style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 14, color: s.score >= 75 ? '#178A51' : '#A37700'}}>{s.score}%</div>
            </div>
          ))}

          {/* Other sections placeholder */}
          <div style={{marginTop: 24, marginBottom: 10}}>
            <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 16, color: 'rgba(28,30,44,.87)'}}>Study Plans</div>
          </div>
          {['G9 English Q2', 'G9 English Q1'].map((t, i) => (
            <div key={i} style={{background: '#fff', borderRadius: 8, padding: '12px 14px', border: '1px solid rgba(28,30,44,.12)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12}}>
              <div style={{width: 36, height: 36, borderRadius: 8, background: '#EAF1FF', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon.book color="#395AD2"/>
              </div>
              <div style={{flex: 1}}>
                <div style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 14, color: 'rgba(28,30,44,.87)'}}>{t}</div>
                <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.6)', marginTop: 2}}>{i === 0 ? '65% complete' : 'Completed'}</div>
              </div>
              <Progress value={i === 0 ? 65 : 100} color={i === 0 ? '#3ACE85' : '#3ACE85'} height={6}/>
            </div>
          ))}
        </div>
      </div>
    );
  }

  Object.assign(window, { MnbCourseHomeScreen: CourseHomeScreen });
})();
