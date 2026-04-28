// Practice Set — Home screen
(function () {
  const { MnbIcon: Icon, MnbTopBar: TopBar } = window;

  function CourseHomeScreen({ onBack, onCreatePractice, onOpenPastSet }) {
    window.useLang(); // re-render on language change
    const LangToggle = window.MnbLangToggle;
    const course = window.PRACTICE_COURSE;

    const pastSets = [
      { id: 1, name: 'Tuesday warm-up', chapters: 3, count: 15, score: 80, date: 'Yesterday' },
      { id: 2, name: 'Grammar focus',   chapters: 1, count: 20, score: 65, date: '3 days ago' },
    ];

    return (
      <div style={{flex: 1, background: '#F2F2F4', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <TopBar title={course.title} onBack={onBack} right={<LangToggle/>}/>
        <div style={{flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 16px 24px'}}>

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
              <div style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 15, color: 'rgba(28,30,44,.87)'}}>
                {window.t('create_practice_set')}
              </div>
            </div>
            <div style={{padding: 8, borderRadius: '50%', background: '#F7F8FB'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="rgba(28,30,44,.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* Past practice sets */}
          <div style={{marginTop: 20, marginBottom: 10}}>
            <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 16, color: 'rgba(28,30,44,.87)'}}>
              {window.t('recent_practice_sets')}
            </div>
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
                <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.6)', marginTop: 2}}>
                  {s.count} {window.t('questions')} · {s.chapters} {window.t(s.chapters === 1 ? 'chapter' : 'chapters')} · {s.date}
                </div>
              </div>
              <div style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 14, color: s.score >= 75 ? '#178A51' : '#A37700'}}>{s.score}%</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  Object.assign(window, { MnbCourseHomeScreen: CourseHomeScreen });
})();
