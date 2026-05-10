// Practice Set — Configure screen
// Selection is hierarchical: book > chapter > topic > LO.
// Checking a parent cascades down; checking a child deselects ancestors.
// Tag filters narrow the visible LO hierarchy independently of selection.
(function () {
  const { useState, useEffect } = React;
  const { MnbIcon: Icon, MnbButton: Button, MnbCheckbox: Checkbox, MnbTopBar: TopBar } = window;

  // Filter model: { examRanges: [{from, to}], mode: string, level: string }
  const EMPTY_FILTER = { examRanges: [{from:'',to:''}], modes: [], levels: [] };

  // ========= Compact count input =========
  function CountInput({ value, max, onChange }) {
    const [draft, setDraft] = useState(String(value || 1));
    useEffect(() => { setDraft(String(value || 1)); }, [value]);
    const commit = (v) => {
      const n = Math.max(1, Math.min(max, parseInt(v, 10) || 1));
      onChange(n); setDraft(String(n));
    };
    return (
      <input
        type="text" inputMode="numeric" value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 44, height: 30, borderRadius: 8,
          border: '1.5px solid rgba(57,90,210,.35)',
          background: '#fff', textAlign: 'center',
          fontFamily: 'Roboto', fontWeight: 700, fontSize: 14, color: '#395AD2',
          fontVariantNumeric: 'tabular-nums', outline: 'none', flexShrink: 0,
        }}
        onFocus={(e) => e.target.select()}
      />
    );
  }

  // ========= LO row — selectable =========
  function LoRow({ lo, selCtx }) {
    const checked = selCtx.isChecked(lo.id);
    const indeterminate = false; // LOs are leaf nodes
    return (
      <div
        style={{
          padding: '7px 14px 7px 64px',
          borderTop: '1px solid rgba(28,30,44,.05)',
          background: checked ? 'rgba(57,90,210,.04)' : '#f5f5f7',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'background .15s',
        }}>
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          onChange={() => selCtx.toggle(lo.id, 'lo', lo.available)}
          size={18}
        />
<div style={{flex: 1, minWidth: 0}}>
          <div style={{fontFamily: 'Roboto', fontSize: 12, color: checked ? 'rgba(28,30,44,.87)' : 'rgba(28,30,44,.7)', lineHeight: 1.3}}>
            {lo.title}
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4}}>
            {(() => {
              const scopes = lo.tags?.examScope || [];
              if (!scopes.length) return null;
              const min = Math.min(...scopes), max = Math.max(...scopes);
              const label = min === max ? `${window.t('scope')} ${min}` : `${window.t('scope')} ${min}–${max}`;
              return (
                <span style={{
                  padding: '1px 6px', borderRadius: 4,
                  background: checked ? 'rgba(57,90,210,.1)' : 'rgba(28,30,44,.06)',
                  color: checked ? '#395AD2' : 'rgba(28,30,44,.5)',
                  fontFamily: 'Roboto', fontSize: 10, fontWeight: 500, letterSpacing: .2,
                  whiteSpace: 'nowrap',
                }}>{label}</span>
              );
            })()}
            {(lo.labels || []).map(label => (
              <span key={label} style={{
                padding: '1px 6px', borderRadius: 4,
                background: checked ? 'rgba(57,90,210,.1)' : 'rgba(28,30,44,.06)',
                color: checked ? '#395AD2' : 'rgba(28,30,44,.5)',
                fontFamily: 'Roboto', fontSize: 10, fontWeight: 500, letterSpacing: .2,
                whiteSpace: 'nowrap',
              }}>{label}</span>
            ))}
          </div>
        </div>
        {checked && (
          <CountInput
            value={selCtx.selection[lo.id].count}
            max={lo.available}
            onChange={(n) => selCtx.updateCount(lo.id, n)}
          />
        )}
      </div>
    );
  }

  // ========= Topic row — selectable, collapsible =========
  function TopicRow({ topic, open, onOpenToggle, selCtx }) {
    const checked    = selCtx.isChecked(topic.id);
    const indet      = selCtx.isIndeterminate(topic.id, 'topic');
    const entry      = selCtx.selection[topic.id];

    return (
      <div style={{borderTop: '1px solid rgba(28,30,44,.06)'}}>
        <div style={{
          padding: '9px 14px 9px 48px',
          background: (checked || indet) ? 'rgba(57,90,210,.03)' : '#fafafa',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'background .15s',
        }}>
          <Checkbox
            checked={checked}
            indeterminate={indet}
            onChange={() => selCtx.toggle(topic.id, 'topic', topic.available)}
            size={20}
          />
          <div style={{flex: 1, minWidth: 0, cursor: 'pointer'}} onClick={onOpenToggle}>
            <div style={{fontFamily: 'Roboto', fontWeight: 500, fontSize: 13, color: (checked || indet) ? 'rgba(28,30,44,.87)' : 'rgba(28,30,44,.8)'}}>
              {topic.title}
            </div>
            <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.45)', marginTop: 1}}>
              {topic.los.length} {window.t('los')} · {topic.available} {window.t('questions')}
            </div>
          </div>
          {checked && (
            <CountInput
              value={entry.count}
              max={topic.available}
              onChange={(n) => selCtx.updateCount(topic.id, n)}
            />
          )}
          <button onClick={onOpenToggle} style={{
            width: 28, height: 28, border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
          }}>
            <Icon.chevron open={open} size={16}/>
          </button>
        </div>
        {open && topic.los.map(lo => (
          <LoRow key={lo.id} lo={lo} selCtx={selCtx}/>
        ))}
      </div>
    );
  }

  // ========= Chapter row — selectable, collapsible =========
  function ChapterRow({ chapter, open, onOpenToggle, selCtx, openMap }) {
    const checked = selCtx.isChecked(chapter.id);
    const indet   = selCtx.isIndeterminate(chapter.id, 'chapter');
    const entry   = selCtx.selection[chapter.id];

    return (
      <div style={{borderTop: '1px solid rgba(28,30,44,.08)'}}>
        <div style={{
          padding: '11px 14px 11px 32px',
          background: (checked || indet) ? 'rgba(57,90,210,.03)' : '#fff',
          display: 'flex', alignItems: 'center', gap: 10,
          transition: 'background .15s',
        }}>
          <Checkbox
            checked={checked}
            indeterminate={indet}
            onChange={() => selCtx.toggle(chapter.id, 'chapter', chapter.available)}
            size={20}
          />
          <div style={{flex: 1, minWidth: 0, cursor: 'pointer'}} onClick={onOpenToggle}>
            <div style={{fontFamily: 'Roboto', fontSize: 10, color: 'rgba(28,30,44,.45)', textTransform: 'uppercase', letterSpacing: .3}}>{chapter.code}</div>
            <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 600, fontSize: 13, color: (checked || indet) ? 'rgba(28,30,44,.87)' : 'rgba(28,30,44,.8)', marginTop: 1}}>
              {chapter.title}
            </div>
            <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.45)', marginTop: 2}}>
              {chapter.topics.length} {window.t('topics')} · {chapter.available} {window.t('questions')}
            </div>
          </div>
          {checked && (
            <CountInput
              value={entry.count}
              max={chapter.available}
              onChange={(n) => selCtx.updateCount(chapter.id, n)}
            />
          )}
          <button onClick={onOpenToggle} style={{
            width: 28, height: 28, border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
          }}>
            <Icon.chevron open={open} size={16}/>
          </button>
        </div>
        {open && chapter.topics.map(t => (
          <TopicRow
            key={t.id}
            topic={t}
            open={!!openMap[t.id]}
            onOpenToggle={() => selCtx.toggleOpen(t.id)}
            selCtx={selCtx}
          />
        ))}
      </div>
    );
  }

  // ========= Book section — selectable, collapsible =========
  function BookSection({ book, selCtx, openMap }) {
    const checked    = selCtx.isChecked(book.id);
    const indet      = selCtx.isIndeterminate(book.id, 'book');
    const entry      = selCtx.selection[book.id];
    const bookOpen   = !!openMap[book.id];
    const totalTopics = book.chapters.reduce((a, c) => a + c.topics.length, 0);
    const totalLOs    = book.chapters.reduce((a, c) => a + c.topics.reduce((b, t) => b + t.los.length, 0), 0);
    const anyActive   = checked || indet;

    return (
      <div style={{
        background: '#fff', borderRadius: 12, marginBottom: 10, overflow: 'hidden',
        border: `1px solid ${anyActive ? 'rgba(57,90,210,.25)' : 'rgba(28,30,44,.12)'}`,
        boxShadow: anyActive ? '0 3px 10px rgba(57,90,210,.08)' : 'none',
        transition: 'box-shadow .2s, border-color .2s',
      }}>
        <div style={{padding: '14px 14px 14px 16px', display: 'flex', alignItems: 'center', gap: 12}}>
          <Checkbox
            checked={checked}
            indeterminate={indet}
            onChange={() => selCtx.toggle(book.id, 'book', book.available)}
            size={22}
          />
          <div style={{flex: 1, minWidth: 0, cursor: 'pointer'}} onClick={() => selCtx.toggleOpen(book.id)}>
            <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.5)', letterSpacing: .3, textTransform: 'uppercase', marginBottom: 2}}>{book.code}</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap'}}>
              <span style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 15, color: 'rgba(28,30,44,.87)', lineHeight: 1.3}}>
                {book.title}
              </span>
              <span style={{
                padding: '2px 7px', borderRadius: 4, flexShrink: 0,
                background: 'rgba(57,90,210,.1)', color: '#395AD2',
                fontFamily: 'Roboto', fontWeight: 700, fontSize: 10, letterSpacing: .3,
              }}>{totalLOs} {window.t('los')}</span>
            </div>
            <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.5)', marginTop: 4}}>
              {book.chapters.length} {window.t('chapters')} · {totalTopics} {window.t('topics')} · {book.available} {window.t('questions')}
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0}}>
            {checked && (
              <CountInput
                value={entry.count}
                max={book.available}
                onChange={(n) => selCtx.updateCount(book.id, n)}
              />
            )}
            <button onClick={() => selCtx.toggleOpen(book.id)} style={{
              width: 30, height: 30, borderRadius: '50%', border: 'none',
              background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <Icon.chevron open={bookOpen} size={18}/>
            </button>
          </div>
        </div>
        {bookOpen && book.chapters.map(ch => (
          <ChapterRow
            key={ch.id}
            chapter={ch}
            open={!!openMap[ch.id]}
            onOpenToggle={() => selCtx.toggleOpen(ch.id)}
            selCtx={selCtx}
            openMap={openMap}
          />
        ))}
      </div>
    );
  }

  // ========= Labeled input for filter sheet =========
  function FilterInput({ label, value, onChange, placeholder, type = 'text' }) {
    return (
      <div style={{
        flex: 1, borderRadius: 10,
        border: '1.5px solid rgba(28,30,44,.14)',
        padding: '9px 13px', background: '#fff',
      }}>
        <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.45)', marginBottom: 4, lineHeight: 1}}>{label}</div>
        <input
          type={type} inputMode={type === 'number' ? 'numeric' : 'text'}
          value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || '—'}
          style={{
            width: '100%', border: 'none', outline: 'none', padding: 0, margin: 0,
            fontFamily: 'Roboto', fontSize: 15, color: 'rgba(28,30,44,.87)',
            background: 'transparent', boxSizing: 'border-box',
          }}
        />
      </div>
    );
  }

  // ========= Filter sheet — full-screen overlay =========
  function FilterSheet({ initialFilter, onClose, onApply }) {
    window.useLang();
    const initRanges = initialFilter.examRanges.length > 0
      ? initialFilter.examRanges.map(r => ({...r}))
      : [{from: '', to: ''}];
    const [examRanges, setExamRanges] = useState(initRanges);
    const [mode, setMode]   = useState(initialFilter.mode);
    const [level, setLevel] = useState(initialFilter.level);

    const updateRange = (i, field, val) =>
      setExamRanges(prev => prev.map((r, idx) => idx === i ? {...r, [field]: val} : r));
    const addRange    = () => setExamRanges(prev => [...prev, {from: '', to: ''}]);
    const removeRange = (i) =>
      setExamRanges(prev => prev.length === 1 ? [{from: '', to: ''}] : prev.filter((_, idx) => idx !== i));
    const reset = () => { setExamRanges([{from: '', to: ''}]); setMode(''); setLevel(''); };
    const buildFilter = () => ({
      examRanges: examRanges.filter(r => r.from !== '' || r.to !== ''),
      mode: mode.trim(), level: level.trim(),
    });

    return (
      <div style={{position: 'absolute', inset: 0, background: '#F2F2F4', display: 'flex', flexDirection: 'column', zIndex: 10}}>
        <TopBar title={window.t('filter')} onBack={onClose}/>
        <div style={{flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px'}}>
          <div style={{background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid rgba(28,30,44,.1)'}}>
            <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 15, color: 'rgba(28,30,44,.87)', marginBottom: 18}}>{window.t('tag_filters')}</div>

            {/* Exam Scope Range */}
            <div style={{marginBottom: 20}}>
              <div style={{fontFamily: 'Roboto', fontSize: 11, fontWeight: 600, color: 'rgba(28,30,44,.45)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 10}}>{window.t('exam_scope_range')}</div>
              {examRanges.map((range, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < examRanges.length - 1 ? 10 : 0}}>
                  <FilterInput label={window.t('from')} type="number" value={range.from} onChange={(v) => updateRange(i, 'from', v)} placeholder="1"/>
                  <FilterInput label={window.t('to')}   type="number" value={range.to}   onChange={(v) => updateRange(i, 'to', v)}   placeholder="5"/>
                  {examRanges.length > 1 ? (
                    <button onClick={() => removeRange(i)} style={{width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(209,56,66,.08)', color: '#D13842', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: 18}}>×</button>
                  ) : (
                    <button onClick={addRange} style={{width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(57,90,210,.1)', color: '#395AD2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: 20, fontWeight: 300}}>+</button>
                  )}
                </div>
              ))}
              {examRanges.length > 1 && (
                <button onClick={addRange} style={{marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', color: '#395AD2', fontFamily: 'Roboto', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: 0}}>
                  <span style={{width: 20, height: 20, borderRadius: '50%', background: 'rgba(57,90,210,.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 300}}>+</span>
                  {window.t('add_range')}
                </button>
              )}
            </div>

            {/* Mode */}
            <div style={{marginBottom: 20}}>
              <div style={{fontFamily: 'Roboto', fontSize: 11, fontWeight: 600, color: 'rgba(28,30,44,.45)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 10}}>{window.t('mode')}</div>
              <FilterInput label={window.t('mode')} value={mode} onChange={setMode} placeholder={window.t('mode_placeholder')}/>
            </div>

            {/* Level */}
            <div>
              <div style={{fontFamily: 'Roboto', fontSize: 11, fontWeight: 600, color: 'rgba(28,30,44,.45)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 10}}>{window.t('level')}</div>
              <div style={{
                borderRadius: 10, border: '1.5px solid rgba(28,30,44,.14)',
                background: '#fff', overflow: 'hidden',
              }}>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 13px', border: 'none', outline: 'none',
                    fontFamily: 'Roboto', fontSize: 15, color: level ? 'rgba(28,30,44,.87)' : 'rgba(28,30,44,.4)',
                    background: 'transparent', cursor: 'pointer', appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='rgba(28,30,44,.45)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                    paddingRight: 36,
                  }}>
                  <option value="">—</option>
                  <option value="easy">{window.t('level_easy')}</option>
                  <option value="medium">{window.t('level_medium')}</option>
                  <option value="difficult">{window.t('level_difficult')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div style={{flexShrink: 0, padding: '12px 16px 14px', background: '#fff', borderTop: '1px solid rgba(28,30,44,.08)', boxShadow: '0 -6px 16px rgba(0,0,0,.04)', display: 'flex', gap: 12}}>
          <Button kind="secondary" onClick={reset} style={{flex: 1}}>{window.t('reset')}</Button>
          <Button onClick={() => onApply(buildFilter())} style={{flex: 2}}>{window.t('apply')}</Button>
        </div>
      </div>
    );
  }

  // ========= Collapsible filter accordion row =========
  function FilterAccordion({ label, summary, open, onToggle, children }) {
    return (
      <div style={{
        background: '#fff', borderRadius: 12, marginBottom: 8, overflow: 'hidden',
        border: `1px solid ${open ? 'rgba(57,90,210,.2)' : 'rgba(28,30,44,.1)'}`,
      }}>
        <div onClick={onToggle} style={{padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer'}}>
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{fontFamily: 'Roboto', fontSize: 11, fontWeight: 600, color: 'rgba(28,30,44,.45)', textTransform: 'uppercase', letterSpacing: .4}}>{label}</div>
            {summary && <div style={{fontFamily: 'Roboto', fontSize: 14, color: 'rgba(28,30,44,.87)', marginTop: 3}}>{summary}</div>}
          </div>
          <Icon.chevron open={open} size={18}/>
        </div>
        {open && (
          <div style={{padding: '4px 14px 14px', borderTop: '1px solid rgba(28,30,44,.06)'}}>
            {children}
          </div>
        )}
      </div>
    );
  }

  // ========= Main configure screen =========
  function ConfigureScreen({ onBack, onReview }) {
    window.useLang();
    const LangToggle = window.MnbLangToggle;
    const course = window.PRACTICE_COURSE;

    // Flat selection map: { [id]: { count, kind } }
    // Checking a parent removes descendant selections; checking a child removes ancestor selections.
    const [selection, setSelection] = useState({});
    const [openMap, setOpenMap]     = useState({});
    const [activeFilter, setActiveFilter] = useState(EMPTY_FILTER);
    const [questionsPerLO, setQuestionsPerLO] = useState('');

    // ---- cascade helpers ----
    const getDescendants = (id, kind) => {
      const items = [];
      if (kind === 'book') {
        const book = course.books.find(b => b.id === id);
        if (!book) return items;
        book.chapters.forEach(ch => {
          items.push({id: ch.id, kind: 'chapter', avail: ch.available});
          ch.topics.forEach(t => {
            items.push({id: t.id, kind: 'topic', avail: t.available});
            t.los.forEach(lo => items.push({id: lo.id, kind: 'lo', avail: lo.available}));
          });
        });
      } else if (kind === 'chapter') {
        for (const b of course.books) {
          const ch = b.chapters.find(c => c.id === id);
          if (ch) {
            ch.topics.forEach(t => {
              items.push({id: t.id, kind: 'topic', avail: t.available});
              t.los.forEach(lo => items.push({id: lo.id, kind: 'lo', avail: lo.available}));
            });
            break;
          }
        }
      } else if (kind === 'topic') {
        for (const b of course.books) {
          for (const ch of b.chapters) {
            const t = ch.topics.find(tp => tp.id === id);
            if (t) { t.los.forEach(lo => items.push({id: lo.id, kind: 'lo', avail: lo.available})); break; }
          }
        }
      }
      return items;
    };

    const getAncestors = (id, kind) => {
      const items = [];
      if (kind === 'lo') {
        for (const b of course.books) for (const ch of b.chapters) for (const t of ch.topics) {
          if (t.los.find(lo => lo.id === id)) {
            items.push({id: t.id, kind: 'topic'}, {id: ch.id, kind: 'chapter'}, {id: b.id, kind: 'book'});
          }
        }
      } else if (kind === 'topic') {
        for (const b of course.books) for (const ch of b.chapters) {
          if (ch.topics.find(t => t.id === id)) items.push({id: ch.id, kind: 'chapter'}, {id: b.id, kind: 'book'});
        }
      } else if (kind === 'chapter') {
        for (const b of course.books) {
          if (b.chapters.find(ch => ch.id === id)) items.push({id: b.id, kind: 'book'});
        }
      }
      return items;
    };

    const getLOCount = (id, kind) => {
      if (kind === 'lo') return 1;
      if (kind === 'book') {
        const b = course.books.find(b => b.id === id);
        return b ? b.chapters.reduce((a, ch) => a + ch.topics.reduce((s, t) => s + t.los.length, 0), 0) : 1;
      }
      if (kind === 'chapter') {
        for (const b of course.books) { const ch = b.chapters.find(c => c.id === id); if (ch) return ch.topics.reduce((a, t) => a + t.los.length, 0); }
      }
      if (kind === 'topic') {
        for (const b of course.books) for (const ch of b.chapters) { const t = ch.topics.find(tp => tp.id === id); if (t) return t.los.length; }
      }
      return 1;
    };

    const getAvailableForId = (id, kind) => {
      if (kind === 'book') { const b = course.books.find(b => b.id === id); return b ? b.available : 1; }
      for (const b of course.books) {
        if (kind === 'chapter') { const ch = b.chapters.find(c => c.id === id); if (ch) return ch.available; }
        for (const ch of b.chapters) {
          if (kind === 'topic') { const t = ch.topics.find(tp => tp.id === id); if (t) return t.available; }
          for (const t of ch.topics) { if (kind === 'lo') { const lo = t.los.find(lo => lo.id === id); if (lo) return lo.available; } }
        }
      }
      return 1;
    };

    const perLOCount = (loCount, available) => {
      const n = parseInt(questionsPerLO, 10);
      return (questionsPerLO === '' || isNaN(n)) ? available : Math.min(n * loCount, available);
    };

    const isChecked      = (id) => !!selection[id];
    const isIndeterminate = (id, kind) => {
      if (selection[id]) return false;
      return getDescendants(id, kind).some(d => !!selection[d.id]);
    };

    const toggle = (id, kind, available) => {
      setSelection(prev => {
        const next = {...prev};
        if (next[id]) {
          // deselect this item and all descendants
          delete next[id];
          getDescendants(id, kind).forEach(d => delete next[d.id]);
        } else {
          // select: remove ancestor and descendant conflicts first
          getAncestors(id, kind).forEach(a => delete next[a.id]);
          getDescendants(id, kind).forEach(d => delete next[d.id]);
          next[id] = { count: perLOCount(getLOCount(id, kind), available), kind };
        }
        return next;
      });
    };

    const updateCount = (id, count) =>
      setSelection(prev => ({...prev, [id]: {...prev[id], count}}));

    const toggleOpen = (id) => setOpenMap(m => ({...m, [id]: !m[id]}));

    // Selection context passed through the component tree
    const selCtx = { selection, isChecked, isIndeterminate, toggle, updateCount, toggleOpen };

    // Re-apply per-LO count to all selections when the setting changes
    useEffect(() => {
      setSelection(prev => {
        if (Object.keys(prev).length === 0) return prev;
        const next = {};
        Object.keys(prev).forEach(id => {
          const { kind } = prev[id];
          next[id] = { ...prev[id], count: perLOCount(getLOCount(id, kind), getAvailableForId(id, kind)) };
        });
        return next;
      });
    }, [questionsPerLO]);

    // ---- filter logic ----
    const hasFilter = activeFilter.examRanges.some(r => r.from || r.to) || activeFilter.modes.length > 0 || activeFilter.levels.length > 0;

    const loMatchesFilter = (lo, f) => {
      const tags = lo.tags || {};
      const activeRanges = f.examRanges.filter(r => r.from || r.to);
      if (activeRanges.length > 0) {
        const loScopes = tags.examScope || [];
        const ok = activeRanges.some(r => {
          const from = r.from !== '' ? Number(r.from) : 0;
          const to   = r.to   !== '' ? Number(r.to)   : Infinity;
          return loScopes.some(s => s >= from && s <= to);
        });
        if (!ok) return false;
      }
      if (f.modes.length > 0  && !f.modes.includes(tags.mode))   return false;
      if (f.levels.length > 0 && !f.levels.includes(tags.level)) return false;
      return true;
    };

    const buildDisplayBooks = (f) => {
      const hasF = f.examRanges.some(r => r.from || r.to) || f.modes.length > 0 || f.levels.length > 0;
      return hasF
        ? course.books.map(book => ({
            ...book,
            chapters: book.chapters
              .map(ch => ({
                ...ch,
                topics: ch.topics
                  .map(t => ({ ...t, los: t.los.filter(lo => loMatchesFilter(lo, f)) }))
                  .filter(t => t.los.length > 0),
              }))
              .filter(ch => ch.topics.length > 0),
          })).filter(b => b.chapters.length > 0)
        : course.books;
    };

    const displayBooks = buildDisplayBooks(activeFilter);

    // ---- filter accordion state ----
    const [openFilter, setOpenFilter] = useState(null);
    const toggleFilter   = (key) => setOpenFilter(k => k === key ? null : key);
    const addExamRange   = () => setActiveFilter(f => ({...f, examRanges: [...f.examRanges, {from:'',to:''}]}));
    const removeExamRange = (i) => setActiveFilter(f => ({...f, examRanges: f.examRanges.length > 1 ? f.examRanges.filter((_,idx) => idx !== i) : [{from:'',to:''}]}));
    const updateExamRange = (i, field, val) => setActiveFilter(f => { const rs = [...f.examRanges]; rs[i] = {...rs[i], [field]: val.replace(/[^0-9]/g,'')}; return {...f, examRanges: rs}; });
    const toggleMode     = (m) => setActiveFilter(f => ({...f, modes:  f.modes.includes(m)  ? f.modes.filter(x=>x!==m)  : [...f.modes, m]}));
    const toggleLevel    = (v) => setActiveFilter(f => ({...f, levels: f.levels.includes(v) ? f.levels.filter(x=>x!==v) : [...f.levels, v]}));

    // ---- summary ----
    const totalSelected   = Object.values(selection).reduce((a, v) => a + (v.count || 0), 0);
    const itemsSelected   = Object.keys(selection).length;
    const hasAnySelection = itemsSelected > 0;
    const estMinutes      = Math.max(1, Math.round(totalSelected * 1.5));

    const selectAllBooks = () => {
      setSelection(prev => {
        const next = {...prev};
        displayBooks.forEach(b => {
          if (!next[b.id]) next[b.id] = { count: perLOCount(getLOCount(b.id, 'book'), b.available), kind: 'book' };
        });
        return next;
      });
    };
    const selectAllQuestions = () => {
      const next = {};
      displayBooks.forEach(b => { next[b.id] = { count: b.available, kind: 'book' }; });
      setSelection(next);
    };
    const selectAllLOs = () => {
      const next = {};
      displayBooks.forEach(b => b.chapters.forEach(ch => ch.topics.forEach(t => t.los.forEach(lo => {
        next[lo.id] = { count: perLOCount(1, lo.available), kind: 'lo' };
      }))));
      setSelection(next);
    };
    const clearSelection = () => setSelection({});

    return (
      <div style={{flex: 1, background: '#F2F2F4', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative'}}>
        <TopBar title={window.t('create_practice_set')} onBack={onBack} right={LangToggle && <LangToggle/>}/>

        {/* Summary header */}
        <div style={{background: '#fff', padding: '12px 16px 14px', borderBottom: '1px solid rgba(28,30,44,.08)', flexShrink: 0}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{flex: 1}}>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
                <span style={{fontFamily: 'Roboto', fontWeight: 900, fontSize: 28, color: '#395AD2', letterSpacing: -.5, fontVariantNumeric: 'tabular-nums'}}>{totalSelected}</span>
                <span style={{fontFamily: 'Roboto', fontSize: 12, color: 'rgba(28,30,44,.6)'}}>{window.t(totalSelected === 1 ? 'question_total' : 'questions_total')}</span>
                {totalSelected > 0 && <>
                  <span style={{fontFamily: 'Roboto', fontSize: 16, color: 'rgba(28,30,44,.2)', lineHeight: 1}}>·</span>
                  <span style={{fontFamily: 'Roboto', fontWeight: 700, fontSize: 20, color: 'rgba(28,30,44,.55)', letterSpacing: -.3, fontVariantNumeric: 'tabular-nums'}}>{window.t('est_time', estMinutes)}</span>
                  <span style={{fontFamily: 'Roboto', fontSize: 12, color: 'rgba(28,30,44,.6)'}}>{window.t('est_time_label')}</span>
                </>}
              </div>
            </div>
            {hasAnySelection ? (
              <button onClick={clearSelection} style={{border: 'none', background: 'transparent', color: '#395AD2', fontFamily: 'Roboto', fontWeight: 600, fontSize: 13, cursor: 'pointer'}}>
                {window.t('clear')}
              </button>
            ) : (
              <button onClick={selectAllQuestions} style={{border: 'none', background: 'transparent', color: '#395AD2', fontFamily: 'Roboto', fontWeight: 600, fontSize: 13, cursor: 'pointer'}}>
                {window.t('select_all_questions')}
              </button>
            )}
          </div>

          {/* Per-LO question count setting */}
          <div style={{marginTop: 10, padding: '8px 12px', borderRadius: 10, background: '#F2F2F4', display: 'flex', alignItems: 'center', gap: 10}}>
            <div style={{flex: 1}}>
              <div style={{fontFamily: 'Roboto', fontSize: 12, fontWeight: 600, color: 'rgba(28,30,44,.75)'}}>{window.t('per_lo_label')}</div>
              <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.45)', marginTop: 2}}>{window.t('per_lo_hint')}</div>
            </div>
            <input
              type="text" inputMode="numeric" value={questionsPerLO}
              onChange={(e) => setQuestionsPerLO(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
              placeholder=""
              style={{
                width: 44, height: 30, borderRadius: 8,
                border: '1.5px solid rgba(57,90,210,.35)',
                background: '#fff', textAlign: 'center',
                fontFamily: 'Roboto', fontWeight: 700, fontSize: 14, color: '#395AD2',
                fontVariantNumeric: 'tabular-nums', outline: 'none', flexShrink: 0,
              }}
              onFocus={(e) => e.target.select()}
            />
          </div>

          <div style={{marginTop: 10, padding: '9px 12px', borderRadius: 10, background: '#F2F2F4', display: 'flex', alignItems: 'center', gap: 10}}>
            <Icon.book color="#395AD2" size={16}/>
            <div style={{minWidth: 0}}>
              <div style={{fontFamily: 'Roboto', fontSize: 10, color: 'rgba(28,30,44,.45)', letterSpacing: .4, textTransform: 'uppercase'}}>{course.code}</div>
              <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 13, color: 'rgba(28,30,44,.87)', marginTop: 1}}>{course.title}</div>
            </div>
          </div>

        </div>

        {/* Inline filters */}
        <div style={{flexShrink: 0, background: '#F2F2F4', borderBottom: '1px solid rgba(28,30,44,.08)', padding: '10px 16px 4px'}}>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: 8}}>
            <span style={{fontFamily: 'Roboto', fontSize: 11, fontWeight: 600, color: 'rgba(28,30,44,.45)', textTransform: 'uppercase', letterSpacing: .5, flex: 1}}>{window.t('filter')}</span>
            {hasFilter && (
              <button onClick={() => { setActiveFilter(EMPTY_FILTER); setOpenFilter(null); }} style={{border: 'none', background: 'transparent', color: '#395AD2', fontFamily: 'Roboto', fontWeight: 600, fontSize: 12, cursor: 'pointer', padding: 0}}>{window.t('reset')}</button>
            )}
          </div>

          <FilterAccordion
            label={window.t('exam_scope_range')}
            summary={(() => { const a = activeFilter.examRanges.filter(r=>r.from||r.to); return a.length ? a.map(r=>`${r.from||'?'}–${r.to||'?'}`).join(', ') : null; })()}
            open={openFilter === 'scope'} onToggle={() => toggleFilter('scope')}>
            <div style={{paddingTop: 10}}>
              {activeFilter.examRanges.map((range, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < activeFilter.examRanges.length - 1 ? 8 : 0}}>
                  <FilterInput label={window.t('from')} type="number" value={range.from} onChange={(v) => updateExamRange(i, 'from', v)} placeholder="1"/>
                  <FilterInput label={window.t('to')}   type="number" value={range.to}   onChange={(v) => updateExamRange(i, 'to',   v)} placeholder="5"/>
                  {i < activeFilter.examRanges.length - 1 ? (
                    <button onClick={() => removeExamRange(i)} style={{width: 36, height: 36, borderRadius: '50%', border: '1.5px solid rgba(57,90,210,.3)', background: '#EAF1FF', color: '#395AD2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0}}>
                      <Icon.close size={14} color="#395AD2"/>
                    </button>
                  ) : (
                    <button onClick={addExamRange} style={{width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #395AD2', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0}}>
                      <Icon.plus size={16} color="#395AD2"/>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </FilterAccordion>

          <FilterAccordion
            label={window.t('mode')}
            summary={activeFilter.modes.length ? activeFilter.modes.map(m => window.t(`mode_${m}`)).join(', ') : null}
            open={openFilter === 'mode'} onToggle={() => toggleFilter('mode')}>
            <div style={{paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 6}}>
              {['standard','exam','practice'].map(m => {
                const on = activeFilter.modes.includes(m);
                return (
                  <div key={m} onClick={() => toggleMode(m)} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, border: `1px solid ${on ? 'rgba(57,90,210,.2)' : 'rgba(28,30,44,.1)'}`, background: on ? '#EAF1FF' : '#fff', cursor: 'pointer'}}>
                    <span style={{fontFamily: 'Roboto', fontWeight: on ? 600 : 400, fontSize: 14, color: on ? '#395AD2' : 'rgba(28,30,44,.75)'}}>{window.t(`mode_${m}`)}</span>
                    {on && <Icon.check color="#395AD2" size={18}/>}
                  </div>
                );
              })}
            </div>
          </FilterAccordion>

          <FilterAccordion
            label={window.t('level')}
            summary={activeFilter.levels.length ? activeFilter.levels.map(v => window.t(`level_${v}`)).join(', ') : null}
            open={openFilter === 'level'} onToggle={() => toggleFilter('level')}>
            <div style={{paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 6}}>
              {['easy','medium','difficult'].map(v => {
                const on = activeFilter.levels.includes(v);
                return (
                  <div key={v} onClick={() => toggleLevel(v)} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, border: `1px solid ${on ? 'rgba(57,90,210,.2)' : 'rgba(28,30,44,.1)'}`, background: on ? '#EAF1FF' : '#fff', cursor: 'pointer'}}>
                    <span style={{fontFamily: 'Roboto', fontWeight: on ? 600 : 400, fontSize: 14, color: on ? '#395AD2' : 'rgba(28,30,44,.75)'}}>{window.t(`level_${v}`)}</span>
                    {on && <Icon.check color="#395AD2" size={18}/>}
                  </div>
                );
              })}
            </div>
          </FilterAccordion>
        </div>

        {/* Book list */}
        <div style={{flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 16px 16px'}}>
          {displayBooks.length === 0 ? (
            <div style={{textAlign: 'center', padding: '48px 24px'}}>
              <div style={{fontFamily: 'Roboto', fontSize: 14, color: 'rgba(28,30,44,.4)', lineHeight: 1.6}}>{window.t('no_los_match')}</div>
              <button onClick={() => setActiveFilter(EMPTY_FILTER)} style={{border: 'none', background: 'transparent', color: '#395AD2', fontFamily: 'Roboto', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginTop: 8}}>{window.t('clear_filters')}</button>
            </div>
          ) : (
            displayBooks.map(b => (
              <BookSection key={b.id} book={b} selCtx={selCtx} openMap={openMap}/>
            ))
          )}
        </div>

        {/* Bottom CTA */}
        <div style={{flexShrink: 0, padding: '12px 16px 14px', background: '#fff', borderTop: '1px solid rgba(28,30,44,.08)', boxShadow: '0 -6px 16px rgba(0,0,0,.04)'}}>
          <Button full size="md" disabled={totalSelected === 0} onClick={() => onReview(selection)}>
            {totalSelected === 0 ? window.t('select_to_continue') : window.t('review_questions', totalSelected)}
          </Button>
        </div>


      </div>
    );
  }

  Object.assign(window, { MnbConfigureScreen: ConfigureScreen });
})();
