// Practice Set — Configure screen
// Users select books (expanding to chapters, topics, and LOs for reference).
// Question count is set at the book level only.
(function () {
  const { useState, useEffect } = React;
  const { MnbIcon: Icon, MnbButton: Button, MnbCheckbox: Checkbox, MnbTopBar: TopBar } = window;

  // Selection model:
  //   { [bookId]: { count, kind: 'book', parent: {bookId, title, code} } }

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

  // ========= Compact toggle switch =========
  function Toggle({ value, onChange }) {
    return (
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 40, height: 24, borderRadius: 12, flexShrink: 0,
          background: value ? '#395AD2' : 'rgba(28,30,44,.2)',
          transition: 'background .2s', position: 'relative', cursor: 'pointer',
        }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 2, left: value ? 18 : 2,
          transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.25)',
        }}/>
      </div>
    );
  }

  // ========= LO display row — browse only, no selection =========
  function LoDisplayRow({ lo }) {
    return (
      <div style={{
        padding: '7px 14px 7px 72px',
        borderTop: '1px solid rgba(28,30,44,.05)',
        background: '#f5f5f7',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{
          padding: '1px 6px', borderRadius: 4, flexShrink: 0,
          background: 'rgba(57,90,210,.08)', color: '#395AD2',
          fontFamily: 'Roboto', fontWeight: 700, fontSize: 10, letterSpacing: .3,
          whiteSpace: 'nowrap',
        }}>{lo.code}</span>
        <div style={{fontFamily: 'Roboto', fontSize: 12, color: 'rgba(28,30,44,.7)', lineHeight: 1.3}}>
          {lo.title}
        </div>
      </div>
    );
  }

  // ========= Topic row — display only, no checkbox =========
  function TopicRow({ topic }) {
    return (
      <>
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
          </div>
        </div>
        {topic.los.map(lo => (
          <LoDisplayRow key={lo.id} lo={lo}/>
        ))}
      </>
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

  // ========= Main configure screen =========
  function ConfigureScreen({ onBack, onReview }) {
    const course = window.PRACTICE_COURSE;
    const guidedSet = window.PRACTICE_GUIDED_SET;
    const [selection, setSelection] = useState({});
    const [openMap, setOpenMap] = useState({});
    const [guidedOnly, setGuidedOnly] = useState(false);

    const guidedLoIds = new Set(guidedSet ? guidedSet.loIds : []);
    const displayBooks = (guidedOnly && guidedSet)
      ? course.books.map(book => ({
          ...book,
          chapters: book.chapters
            .map(ch => ({
              ...ch,
              topics: ch.topics
                .map(t => ({ ...t, los: t.los.filter(lo => guidedLoIds.has(lo.id)) }))
                .filter(t => t.los.length > 0),
            }))
            .filter(ch => ch.topics.length > 0),
        })).filter(book => book.chapters.length > 0)
      : course.books;

    const totalSelected = Object.values(selection).reduce((a, v) => a + (v.count || 0), 0);
    const booksSelected = Object.values(selection).filter(v => v.kind === 'book').length;

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
        displayBooks.forEach(b => {
          if (!next[b.id]) {
            next[b.id] = { count: Math.min(10, b.available), kind: 'book', parent: { bookId: b.id, title: b.title, code: b.code } };
          }
        });
        return next;
      });
    };

    const clearSelection = () => setSelection({});

    const toggleOpen = (id) => setOpenMap(m => ({...m, [id]: !m[id]}));

    return (
      <div style={{flex: 1, background: '#F2F2F4', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <TopBar title="Create Practice Set" onBack={onBack}/>

        {/* Summary + course label */}
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
                {booksSelected} book{booksSelected === 1 ? '' : 's'} selected
              </div>
            </div>
            <button
              onClick={booksSelected ? clearSelection : selectAllBooks}
              style={{
                border: 'none', background: 'transparent', color: '#395AD2',
                fontFamily: 'Roboto', fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}>
              {booksSelected ? 'Clear' : 'Select all'}
            </button>
          </div>

          {/* Course name */}
          <div style={{
            marginTop: 12, padding: '9px 12px', borderRadius: 10,
            background: '#F2F2F4', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Icon.book color="#395AD2" size={16}/>
            <div style={{minWidth: 0}}>
              <div style={{fontFamily: 'Roboto', fontSize: 10, color: 'rgba(28,30,44,.45)', letterSpacing: .4, textTransform: 'uppercase'}}>{course.code}</div>
              <div style={{fontFamily: '"Noto Sans JP", Roboto', fontWeight: 700, fontSize: 13, color: 'rgba(28,30,44,.87)', marginTop: 1}}>{course.title}</div>
            </div>
          </div>

          <div style={{
            marginTop: 10, padding: '8px 10px', borderRadius: 8,
            background: '#F2F6FF', display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <Icon.sparkle color="#395AD2" size={14}/>
            <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.75)', lineHeight: 1.45}}>
              Questions are drawn <strong>randomly</strong> from all topics within each selected book, up to the number you set per book.
            </div>
          </div>
        </div>

        {/* List */}
        <div style={{flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 16px 16px'}}>
          {guidedSet && (
            <div style={{
              background: '#fff', borderRadius: 12, marginBottom: 12,
              border: guidedOnly ? '1.5px solid rgba(57,90,210,.3)' : '1px solid rgba(28,30,44,.1)',
              padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: guidedOnly ? '0 3px 10px rgba(57,90,210,.08)' : 'none',
              transition: 'border-color .2s, box-shadow .2s',
            }}>
              <Icon.target color={guidedOnly ? '#395AD2' : 'rgba(28,30,44,.4)'} size={18}/>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontFamily: 'Roboto', fontWeight: 600, fontSize: 13, color: guidedOnly ? '#395AD2' : 'rgba(28,30,44,.87)'}}>
                  Guided learning set
                </div>
                <div style={{fontFamily: 'Roboto', fontSize: 11, color: 'rgba(28,30,44,.5)', marginTop: 1}}>
                  {guidedSet.name} · {guidedSet.loIds.length} learning objectives
                </div>
              </div>
              <Toggle value={guidedOnly} onChange={setGuidedOnly}/>
            </div>
          )}
          {displayBooks.map(b => (
            <BookSection
              key={b.id}
              book={b}
              bookEntry={selection[b.id]}
              onBookChange={onBookChange}
              openMap={openMap}
              onToggle={toggleOpen}
            />
          ))}
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
