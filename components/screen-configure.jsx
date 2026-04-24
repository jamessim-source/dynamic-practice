// Practice Set — Configure screen
// Users select books (expanding to chapters and topics for reference) OR learning objectives.
// Question count is set at the book level only. Chapters/topics are for navigation only.
(function () {
  const { useState, useEffect } = React;
  const { MnbIcon: Icon, MnbButton: Button, MnbCheckbox: Checkbox, MnbTopBar: TopBar } = window;

  // Selection model:
  //   By Book: { [bookId]: { count, kind: 'book', parent: {bookId, title, code} } }
  //   By LO:   { [loId]:   { count, kind: 'lo',   parent: {...} } }

  // ========= Compact count input (no +/− buttons) =========
  function CountInput({ value, max, onChange }) {
    const [draft, setDraft] = useState(String(value || 1));
    useEffect(() => { setDraft(String(value || 1)); }, [value]);

    const commit = (v) => {
      const n = Math.max(1, Math.min(max, parseInt(v, 10) || 1));
      onChange(n);
      setDraft(String(n));
    };
    return (
      <input
        type="text" inputMode="numeric" value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 44, height: 32, borderRadius: 8,
          border: '1.5px solid rgba(57,90,210,.35)',
          background: '#fff', textAlign: 'center',
          fontFamily: 'Roboto', fontWeight: 700, fontSize: 14, color: '#395AD2',
          fontVariantNumeric: 'tabular-nums', outline: 'none', flexShrink: 0,
        }}
        onFocus={(e) => e.target.select()}
      />
    );
  }

  // ========= Topic row — display only, no checkbox =========
  function TopicRow({ topic }) {
    return (
      <div style={{
        padding: '9px 14px 9px 56px',
        borderTop: '1px solid rgba(28,30,44,.06)',
        background: '#fafafa',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontFamily: 'Roboto', fontWeight: 500, fontSize: 13, color: 'rgba(28,30,44,.8)'}}>
            {topic.title}
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5}}>
            {topic.los.map(lo => (
              <span key={lo.id} style={{
                padding: '2px 6px', borderRadius: 4,
                background: 'rgba(57,90,210,.08)', color: '#395AD2',
                fontFamily: 'Roboto', fontWeight: 700, fontSize: 10, letterSpacing: .3,
                whiteSpace: 'nowrap',
              }}>{lo.code}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ========= Chapter row — expand/collapse only, no checkbox =========
  function ChapterRow({ chapter, open, onToggle }) {
    return (
      <div style={{borderTop: '1px solid rgba(28,30,44,.08)'}}>
        <div
          onClick={onToggle}
          style={{padding: '11px 14px 11px 32px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer'}}
        >
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{fontFamily: 'Roboto', fontSize: 10, color: 'rgba(28,30,44,.45)', textTransform: 'uppercase', letterSpacing: .3}}>{chapter.code}</div>
            <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 600, fontSize: 13, color: 'rgba(28,30,44,.87)', marginTop: 1}}>
              {chapter.title}
            </div>
            <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.45)', marginTop: 2}}>
              {chapter.topics.length} topics · {chapter.available} questions
            </div>
          </div>
          <Icon.chevron open={open} size={18}/>
        </div>
        {open && chapter.topics.map(t => (
          <TopicRow key={t.id} topic={t}/>
        ))}
      </div>
    );
  }

  // ========= Book section =========
  function BookSection({ book, bookEntry, onBookChange, openMap, onToggle }) {
    const isSelected = !!bookEntry;
    const bookOpen = !!openMap[book.id];
    const totalTopics = book.chapters.reduce((a, c) => a + c.topics.length, 0);
    const totalLOs = book.chapters.reduce((a, c) => a + c.topics.reduce((b, t) => b + t.los.length, 0), 0);

    const toggleBook = () => {
      if (isSelected) {
        onBookChange(book.id, null);
      } else {
        onBookChange(book.id, { count: Math.min(10, book.available) });
      }
    };

    return (
      <div style={{
        background: '#fff', borderRadius: 12, marginBottom: 10,
        border: `1px solid ${isSelected ? 'rgba(57,90,210,.25)' : 'rgba(28,30,44,.12)'}`,
        overflow: 'hidden',
        boxShadow: isSelected ? '0 3px 10px rgba(57,90,210,.08)' : 'none',
        transition: 'box-shadow .2s, border-color .2s',
      }}>
        {/* Book header */}
        <div style={{padding: '14px 14px 14px 16px', display: 'flex', alignItems: 'center', gap: 12}}>
          <Checkbox checked={isSelected} onChange={toggleBook} size={22}/>
          <div style={{flex: 1, minWidth: 0, cursor: 'pointer'}} onClick={() => onToggle(book.id)}>
            <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.5)', letterSpacing: .3, textTransform: 'uppercase', marginBottom: 2}}>{book.code}</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap'}}>
              <span style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 15, color: 'rgba(28,30,44,.87)', lineHeight: 1.3}}>
                {book.title}
              </span>
              <span style={{
                padding: '2px 7px', borderRadius: 4, flexShrink: 0,
                background: 'rgba(57,90,210,.1)', color: '#395AD2',
                fontFamily: 'Roboto', fontWeight: 700, fontSize: 10, letterSpacing: .3,
              }}>{totalLOs} LOs</span>
            </div>
            <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.5)', marginTop: 4}}>
              {book.chapters.length} chapters · {totalTopics} topics · {book.available} questions
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0}}>
            {isSelected && (
              <CountInput
                value={bookEntry.count}
                max={book.available}
                onChange={(n) => onBookChange(book.id, {...bookEntry, count: n})}
              />
            )}
            <button onClick={() => onToggle(book.id)} style={{
              width: 30, height: 30, borderRadius: '50%', border: 'none',
              background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <Icon.chevron open={bookOpen} size={18}/>
            </button>
          </div>
        </div>
        {/* Chapters (browse only) */}
        {bookOpen && book.chapters.map(ch => (
          <ChapterRow
            key={ch.id}
            chapter={ch}
            open={!!openMap[ch.id]}
            onToggle={() => onToggle(ch.id)}
          />
        ))}
      </div>
    );
  }

  // ========= LO row =========
  function LoRow({ lo, chapter, topic, count, onChange }) {
    const selected = count > 0;
    return (
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid rgba(28,30,44,.08)',
        background: selected ? '#F7FAFF' : '#fff',
        transition: 'background .15s',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Checkbox
          checked={selected}
          onChange={(v) => onChange(v ? Math.min(3, lo.available) : 0)}
          size={20}
        />
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2}}>
            <span style={{
              padding: '1px 7px', borderRadius: 4,
              background: 'rgba(57,90,210,.1)', color: '#395AD2',
              fontFamily: 'Roboto', fontWeight: 700, fontSize: 10, letterSpacing: .3,
            }}>{lo.code}</span>
            <span style={{fontFamily: 'Roboto', fontSize: 10, color: 'rgba(28,30,44,.45)', letterSpacing: .2, textTransform: 'uppercase'}}>
              {chapter.code} · {topic.title}
            </span>
          </div>
          <div style={{fontFamily: 'Roboto', fontWeight: 500, fontSize: 13, color: 'rgba(28,30,44,.87)', lineHeight: 1.35}}>
            {lo.title}
          </div>
          <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.55)', marginTop: 3, fontVariantNumeric: 'tabular-nums'}}>
            {lo.available} questions in pool
          </div>
        </div>
        {selected && (
          <CountInput value={count} max={lo.available} onChange={onChange}/>
        )}
      </div>
    );
  }

  // ========= LO mode list =========
  function LoList({ selection, onSelectionChange }) {
    const course = window.PRACTICE_COURSE;
    const [query, setQuery] = useState('');
    const q = query.trim().toLowerCase();

    const flat = [];
    course.chapters.forEach(ch => ch.topics.forEach(t => t.los.forEach(lo => flat.push({chapter: ch, topic: t, lo}))));

    const matches = q
      ? flat.filter(x =>
          x.lo.code.toLowerCase().includes(q) ||
          x.lo.title.toLowerCase().includes(q) ||
          x.topic.title.toLowerCase().includes(q) ||
          x.chapter.title.toLowerCase().includes(q))
      : flat;

    const byChapter = new Map();
    matches.forEach(x => {
      if (!byChapter.has(x.chapter.id)) byChapter.set(x.chapter.id, { chapter: x.chapter, items: [] });
      byChapter.get(x.chapter.id).items.push(x);
    });

    const setLoCount = (x, count) => {
      const next = {...selection};
      if (count <= 0) delete next[x.lo.id];
      else next[x.lo.id] = { count, kind: 'lo',
        parent: { chapterId: x.chapter.id, code: x.chapter.code, chapterTitle: x.chapter.title, topicId: x.topic.id, topicTitle: x.topic.title, title: x.lo.title, loCode: x.lo.code } };
      onSelectionChange(next);
    };

    return (
      <>
        <div style={{
          background: '#fff', borderRadius: 10, border: '1px solid rgba(28,30,44,.12)',
          padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="rgba(28,30,44,.45)" strokeWidth="2"/><path d="M20 20l-4.5-4.5" stroke="rgba(28,30,44,.45)" strokeWidth="2" strokeLinecap="round"/></svg>
          <input
            type="text" placeholder="Search LO code, skill, or topic…"
            value={query} onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'Roboto', fontSize: 13, color: 'rgba(28,30,44,.87)',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(28,30,44,.45)', fontSize: 14, padding: 0}}>×</button>
          )}
        </div>

        {byChapter.size === 0 && (
          <div style={{textAlign: 'center', padding: '28px 16px', color: 'rgba(28,30,44,.5)', fontFamily: 'Roboto', fontSize: 13}}>
            No learning objectives match "{query}".
          </div>
        )}

        {[...byChapter.values()].map(({chapter, items}) => {
          const chapterTotal = items.reduce((a, x) => a + (selection[x.lo.id]?.count || 0), 0);
          return (
            <div key={chapter.id} style={{
              background: '#fff', borderRadius: 12, marginBottom: 10,
              border: '1px solid rgba(28,30,44,.12)', overflow: 'hidden',
              boxShadow: chapterTotal > 0 ? '0 3px 10px rgba(57,90,210,.08)' : 'none',
            }}>
              <div style={{padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10}}>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.55)', letterSpacing: .3, textTransform: 'uppercase'}}>{chapter.code}</div>
                  <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 14, color: 'rgba(28,30,44,.87)', marginTop: 2}}>{chapter.title}</div>
                </div>
                {chapterTotal > 0 && (
                  <span style={{
                    padding: '3px 9px', borderRadius: 999, background: '#EAF1FF', color: '#395AD2',
                    fontFamily: 'Roboto', fontWeight: 700, fontSize: 11, fontVariantNumeric: 'tabular-nums',
                  }}>{chapterTotal} Qs</span>
                )}
              </div>
              {items.map(x => (
                <LoRow
                  key={x.lo.id}
                  lo={x.lo}
                  chapter={x.chapter}
                  topic={x.topic}
                  count={selection[x.lo.id]?.count || 0}
                  onChange={(c) => setLoCount(x, c)}
                />
              ))}
            </div>
          );
        })}
      </>
    );
  }

  // ========= Segmented tabs =========
  function ModeTabs({ mode, onChange }) {
    const tabs = [
      {v: 'book', label: 'By Book'},
      {v: 'lo', label: 'By Learning Objective'},
    ];
    return (
      <div style={{display: 'flex', background: '#F2F2F4', borderRadius: 10, padding: 3, gap: 3}}>
        {tabs.map(t => {
          const active = mode === t.v;
          return (
            <button key={t.v} onClick={() => onChange(t.v)} style={{
              flex: 1, padding: '8px 10px', borderRadius: 7, border: 'none',
              background: active ? '#fff' : 'transparent',
              color: active ? '#395AD2' : 'rgba(28,30,44,.65)',
              fontFamily: 'Roboto', fontWeight: active ? 700 : 500, fontSize: 12,
              cursor: 'pointer', transition: 'all .15s',
              boxShadow: active ? '0 2px 6px rgba(0,0,0,.08)' : 'none',
            }}>{t.label}</button>
          );
        })}
      </div>
    );
  }

  // ========= Main configure screen =========
  function ConfigureScreen({ onBack, onReview }) {
    const course = window.PRACTICE_COURSE;
    const [mode, setMode] = useState('book');
    const [selection, setSelection] = useState({});
    const [openMap, setOpenMap] = useState({}); // collapsed by default

    const totalSelected = Object.values(selection).reduce((a, v) => a + (v.count || 0), 0);
    const scopesCount = Object.values(selection).filter(v => v.kind === mode).length;

    const onBookChange = (bookId, bookData) => {
      setSelection(prev => {
        const next = {...prev};
        if (!bookData) {
          delete next[bookId];
        } else {
          const book = course.books.find(b => b.id === bookId);
          next[bookId] = {
            count: bookData.count,
            kind: 'book',
            parent: { bookId, title: book.title, code: book.code },
          };
        }
        return next;
      });
    };

    const selectAllBooks = () => {
      setSelection(prev => {
        const next = {...prev};
        course.books.forEach(b => {
          if (!next[b.id]) {
            next[b.id] = { count: Math.min(10, b.available), kind: 'book', parent: { bookId: b.id, title: b.title, code: b.code } };
          }
        });
        return next;
      });
    };

    const clearCurrentMode = () => {
      setSelection(prev => {
        const next = {};
        Object.entries(prev).forEach(([k, v]) => { if (v.kind !== mode) next[k] = v; });
        return next;
      });
    };

    const toggleOpen = (id) => setOpenMap(m => ({...m, [id]: !m[id]}));

    const selectedInMode = Object.values(selection).filter(v => v.kind === mode).length;

    return (
      <div style={{flex: 1, background: '#F2F2F4', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <TopBar title="Create Practice Set" onBack={onBack}/>

        {/* Summary + mode switch */}
        <div style={{
          background: '#fff', padding: '12px 16px 14px',
          borderBottom: '1px solid rgba(28,30,44,.08)', flexShrink: 0,
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{flex: 1}}>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 6}}>
                <span style={{fontFamily: 'Roboto', fontWeight: 900, fontSize: 28, color: '#395AD2', letterSpacing: -.5, fontVariantNumeric: 'tabular-nums'}}>{totalSelected}</span>
                <span style={{fontFamily: 'Roboto', fontSize: 12, color: 'rgba(28,30,44,.6)'}}>
                  question{totalSelected === 1 ? '' : 's'} total
                </span>
              </div>
              <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.55)', marginTop: 2}}>
                {scopesCount} {mode === 'book' ? `book${scopesCount === 1 ? '' : 's'}` : `scope${scopesCount === 1 ? '' : 's'}`} selected
              </div>
            </div>
            <button
              onClick={selectedInMode ? clearCurrentMode : (mode === 'book' ? selectAllBooks : () => {})}
              disabled={mode === 'lo' && !selectedInMode}
              style={{
                border: 'none', background: 'transparent',
                color: (mode === 'lo' && !selectedInMode) ? 'rgba(28,30,44,.3)' : '#395AD2',
                fontFamily: 'Roboto', fontWeight: 600, fontSize: 13,
                cursor: (mode === 'lo' && !selectedInMode) ? 'default' : 'pointer',
              }}>
              {selectedInMode ? 'Clear' : (mode === 'book' ? 'Select all' : '')}
            </button>
          </div>

          <div style={{marginTop: 12}}>
            <ModeTabs mode={mode} onChange={setMode}/>
          </div>

          <div style={{
            marginTop: 10, padding: '8px 10px', borderRadius: 8,
            background: '#F2F6FF', display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <Icon.sparkle color="#395AD2" size={14}/>
            <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.75)', lineHeight: 1.45}}>
              {mode === 'book'
                ? <span>Questions are drawn <strong>randomly</strong> from all topics within each selected book, up to the number you set per book.</span>
                : <span>Questions are drawn <strong>randomly</strong> from each selected learning objective up to the number you set.</span>
              }
            </div>
          </div>
        </div>

        {/* List */}
        <div style={{flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 16px 16px'}}>
          {mode === 'book' ? (
            course.books.map(b => (
              <BookSection
                key={b.id}
                book={b}
                bookEntry={selection[b.id]}
                onBookChange={onBookChange}
                openMap={openMap}
                onToggle={toggleOpen}
              />
            ))
          ) : (
            <LoList selection={selection} onSelectionChange={setSelection}/>
          )}
        </div>

        {/* Bottom CTA */}
        <div style={{
          flexShrink: 0, padding: '12px 16px 14px',
          background: '#fff', borderTop: '1px solid rgba(28,30,44,.08)',
          boxShadow: '0 -6px 16px rgba(0,0,0,.04)',
        }}>
          <Button full size="md" disabled={totalSelected === 0} onClick={() => onReview(selection)}>
            {totalSelected === 0
              ? 'Select items to continue'
              : `Review ${totalSelected} Question${totalSelected === 1 ? '' : 's'}`}
          </Button>
        </div>
      </div>
    );
  }

  Object.assign(window, { MnbConfigureScreen: ConfigureScreen });
})();
