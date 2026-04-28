// Landing screen — course selection
(function () {
  const { MnbTopBar: TopBar } = window;

  function CourseSelectScreen({ onSelectCourse }) {
    window.useLang(); // re-render on language change
    const LangToggle = window.MnbLangToggle;
    const course = window.PRACTICE_COURSE;

    const courses = [
      course,
      { id: 'math-g9', code: 'MATH-G9', title: 'G9 Mathematics' },
      { id: 'sci-g9',  code: 'SCI-G9',  title: 'G9 Science'     },
    ];

    return (
      <div style={{flex: 1, background: '#F2F2F4', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <TopBar title={window.t('practice')} right={<LangToggle/>}/>
        <div style={{flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 16px 24px'}}>

          <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 15, color: 'rgba(28,30,44,.87)', marginBottom: 10}}>
            {window.t('courses')}
          </div>

          {courses.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCourse(c)}
              style={{
                background: '#fff', borderRadius: 12, marginBottom: 8,
                border: '1px solid rgba(28,30,44,.1)',
                padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer',
              }}>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontFamily: 'Roboto', fontSize: 10, color: 'rgba(28,30,44,.45)', letterSpacing: .4, textTransform: 'uppercase', marginBottom: 3}}>{c.code}</div>
                <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 15, color: 'rgba(28,30,44,.87)'}}>{c.title}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="rgba(28,30,44,.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ))}

        </div>
      </div>
    );
  }

  Object.assign(window, { MnbCourseSelectScreen: CourseSelectScreen });
})();
