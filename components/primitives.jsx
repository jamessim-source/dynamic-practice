// Manabie primitives — buttons, chips, icons
(function () {
  const { useState } = React;

  // ========= Icons (inline for crispness) =========
  const Icon = {
    back: (p) => (<svg viewBox="0 0 24 24" width={p.size || 24} height={p.size || 24} fill="none" {...p}><path d="M15 5l-7 7 7 7" stroke={p.color || '#1E1E2C'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    close: (p) => (<svg viewBox="0 0 24 24" width={p.size || 20} height={p.size || 20} fill="none" {...p}><path d="M6 6l12 12M18 6L6 18" stroke={p.color || '#1E1E2C'} strokeWidth="2" strokeLinecap="round"/></svg>),
    check: (p) => (<svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} fill="none" {...p}><path d="M5 12.5l4.5 4.5L19 7.5" stroke={p.color || '#fff'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    chevron: (p) => (<svg viewBox="0 0 24 24" width={p.size || 20} height={p.size || 20} fill="none" style={{transform: `rotate(${p.open ? 180 : 0}deg)`, transition: 'transform .18s'}}><path d="M6 9l6 6 6-6" stroke={p.color || 'rgba(28,30,44,.6)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    plus: (p) => (<svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none"><path d="M12 5v14M5 12h14" stroke={p.color || 'rgba(28,30,44,.87)'} strokeWidth="2.2" strokeLinecap="round"/></svg>),
    minus: (p) => (<svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none"><path d="M5 12h14" stroke={p.color || 'rgba(28,30,44,.87)'} strokeWidth="2.2" strokeLinecap="round"/></svg>),
    book: (p) => (<svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} fill={p.color || '#395AD2'}><path d="M6 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a3 3 0 01-3-3V5a2 2 0 012-2zm0 2v12h10V5H6zm0 14h10v-1H7a1 1 0 000 1z"/></svg>),
    target: (p) => (<svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none"><circle cx="12" cy="12" r="9" stroke={p.color || 'currentColor'} strokeWidth="2"/><circle cx="12" cy="12" r="4.5" stroke={p.color || 'currentColor'} strokeWidth="2"/><circle cx="12" cy="12" r="1.5" fill={p.color || 'currentColor'}/></svg>),
    timer: (p) => (<svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none"><circle cx="12" cy="13" r="8" stroke={p.color || 'currentColor'} strokeWidth="2"/><path d="M12 13V9M9 3h6" stroke={p.color || 'currentColor'} strokeWidth="2" strokeLinecap="round"/></svg>),
    shuffle: (p) => (<svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none"><path d="M3 6h3l12 12h3M3 18h3L10 14M14 10l4-4h3M18 3l3 3-3 3M18 15l3 3-3 3" stroke={p.color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    sparkle: (p) => (<svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill={p.color || 'currentColor'}><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zM19 15l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9L19 15z"/></svg>),
    flag: (p) => (<svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none"><path d="M5 3v18M5 4h11l-2 4 2 4H5" stroke={p.color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    filter: (p) => (<svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} fill="none"><path d="M4 6h16M7 12h10M10 18h4" stroke={p.color || 'currentColor'} strokeWidth="2" strokeLinecap="round"/></svg>),
  };

  // ========= Button =========
  function Button({ children, kind = 'primary', disabled, onClick, style, full, size = 'md' }) {
    const [press, setPress] = useState(false);
    const [hover, setHover] = useState(false);
    const sizes = {
      sm: {pad: '10px 18px', fs: 14},
      md: {pad: '14px 24px', fs: 16},
      lg: {pad: '16px 28px', fs: 18},
    }[size];
    const base = {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      borderRadius: 1000, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: '"Noto Sans JP", Roboto, sans-serif', fontWeight: 700,
      fontSize: sizes.fs, padding: sizes.pad,
      transition: 'transform .14s ease, box-shadow .2s, background .2s, opacity .2s',
      transform: press ? 'scale(0.97)' : 'scale(1)',
      opacity: disabled ? 0.5 : 1,
      width: full ? '100%' : 'auto',
      letterSpacing: 0,
    };
    const kinds = {
      primary: {background: hover ? '#2E4CB8' : '#395AD2', color: '#fff', boxShadow: press ? 'none' : '0 5px 20px rgba(57,90,210,.22)'},
      secondary: {background: '#fff', color: 'rgba(28,30,44,.87)', boxShadow: 'inset 0 0 0 1px rgba(28,30,44,.15)'},
      ghost: {background: 'transparent', color: '#395AD2'},
      danger: {background: '#fff', color: '#D13842', boxShadow: 'inset 0 0 0 1px rgba(209,56,66,.3)'},
      white: {background: '#fff', color: 'rgba(28,30,44,.87)', boxShadow: '0 4px 14px rgba(0,0,0,.08)'},
    };
    return (
      <button
        onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)} onMouseLeave={() => {setPress(false); setHover(false);}}
        onMouseEnter={() => setHover(true)} onClick={disabled ? null : onClick}
        style={{...base, ...kinds[kind], ...style}}
      >{children}</button>
    );
  }

  // ========= Stepper =========
  function Stepper({ value, min = 0, max = 99, onChange, disabled }) {
    const dec = () => !disabled && onChange(Math.max(min, value - 1));
    const inc = () => !disabled && onChange(Math.min(max, value + 1));
    const btn = (enabled) => ({
      width: 30, height: 30, borderRadius: '50%', border: 'none',
      background: enabled ? '#fff' : '#F2F2F4',
      boxShadow: enabled ? 'inset 0 0 0 1px rgba(28,30,44,.15)' : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: enabled ? 'pointer' : 'not-allowed',
      transition: 'all .15s',
    });
    return (
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, opacity: disabled ? 0.45 : 1}}>
        <button style={btn(value > min && !disabled)} onClick={dec}>
          <Icon.minus color={value > min ? 'rgba(28,30,44,.87)' : 'rgba(28,30,44,.3)'} />
        </button>
        <div style={{minWidth: 28, textAlign: 'center', fontFamily: 'Roboto', fontWeight: 700, fontSize: 16, color: 'rgba(28,30,44,.87)', fontVariantNumeric: 'tabular-nums'}}>{value}</div>
        <button style={btn(value < max && !disabled)} onClick={inc}>
          <Icon.plus color={value < max ? 'rgba(28,30,44,.87)' : 'rgba(28,30,44,.3)'} />
        </button>
      </div>
    );
  }

  // ========= Chip =========
  function Chip({ children, tone = 'neutral', size = 'md', onClick, active }) {
    const tones = {
      neutral: {bg: 'rgba(28,30,44,.06)', fg: 'rgba(28,30,44,.72)'},
      blue: {bg: '#EAF1FF', fg: '#395AD2'},
      cyan: {bg: '#E4F7FE', fg: '#0E7FA6'},
      green: {bg: '#EEFFF6', fg: '#178A51'},
      red: {bg: '#FDECEE', fg: '#D13842'},
      gold: {bg: '#FFF6DB', fg: '#A37700'},
    }[tone];
    const selected = active ? {background: '#395AD2', color: '#fff'} : {background: tones.bg, color: tones.fg};
    return (
      <span onClick={onClick} style={{
        ...selected,
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: size === 'sm' ? '3px 8px' : '5px 10px',
        borderRadius: size === 'sm' ? 6 : 999,
        fontFamily: 'Roboto', fontWeight: 500, fontSize: size === 'sm' ? 11 : 12,
        letterSpacing: .2,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all .15s',
        whiteSpace: 'nowrap',
      }}>{children}</span>
    );
  }

  // ========= Checkbox (custom, square with rounded) =========
  function Checkbox({ checked, indeterminate, onChange, size = 22, tone = 'blue' }) {
    const color = tone === 'blue' ? '#395AD2' : '#1CB7EB';
    return (
      <div onClick={(e) => { e.stopPropagation(); onChange && onChange(!checked); }}
        style={{
          width: size, height: size, borderRadius: 6, flex: '0 0 auto',
          border: `2px solid ${(checked || indeterminate) ? color : 'rgba(28,30,44,.25)'}`,
          background: (checked || indeterminate) ? color : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all .15s',
        }}>
        {checked && <Icon.check color="#fff" size={size - 8}/>}
        {indeterminate && !checked && <div style={{width: 10, height: 2, background: '#fff', borderRadius: 1}}/>}
      </div>
    );
  }

  // ========= Progress bar =========
  function Progress({ value, max = 100, color = '#3ACE85', height = 8, showPct }) {
    const pct = Math.min(100, (value / max) * 100);
    return (
      <div style={{display: 'flex', alignItems: 'center', gap: 8, flex: 1}}>
        <div style={{flex: 1, height, background: '#E5E7ED', borderRadius: 999, overflow: 'hidden'}}>
          <div style={{width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width .5s ease'}}/>
        </div>
        {showPct && <span style={{fontFamily: 'Roboto', fontSize: 12, color: 'rgba(28,30,44,.6)', fontVariantNumeric: 'tabular-nums', minWidth: 32, textAlign: 'right'}}>{Math.round(pct)}%</span>}
      </div>
    );
  }

  // ========= Top bar =========
  function TopBar({ title, onBack, right }) {
    return (
      <div style={{
        height: 56, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid rgba(28,30,44,.08)', background: '#fff', flexShrink: 0,
      }}>
        {onBack && (
          <button onClick={onBack} style={{
            width: 32, height: 32, borderRadius: 8, background: 'transparent', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: 'inset 0 0 0 1px rgba(28,30,44,.12)',
          }}>
            <Icon.back size={18}/>
          </button>
        )}
        <div style={{flex: 1, fontFamily: 'Roboto', fontWeight: 500, fontSize: 18, color: 'rgba(28,30,44,.87)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{title}</div>
        {right}
      </div>
    );
  }

  Object.assign(window, { MnbIcon: Icon, MnbButton: Button, MnbStepper: Stepper, MnbChip: Chip, MnbCheckbox: Checkbox, MnbProgress: Progress, MnbTopBar: TopBar });
})();
