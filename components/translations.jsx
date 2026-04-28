// Language support — English and Japanese
// Exposes: window.t(key), window.useLang(), window.setLang(lang), window.MnbLangToggle
(function () {
  const STRINGS = {
    en: {
      // Navigation
      practice: 'Practice',
      courses: 'Courses',

      // Home
      create_practice_set: 'Create Practice Set',
      recent_practice_sets: 'Recent Practice Sets',

      // Configure — header
      questions_total: 'questions total',
      question_total: 'question total',
      items_selected: 'items selected',
      item_selected: 'item selected',
      select_all: 'Select all',
      clear: 'Clear',

      // Configure — hierarchy meta
      chapters: 'chapters',
      chapter: 'chapter',
      topics: 'topics',
      topic: 'topic',
      questions: 'questions',
      los: 'LOs',
      scope: 'Scope',
      topics_selected: 'topics selected',
      topic_selected: 'topic selected',

      // Configure — hint
      random_hint: 'Select books, chapters, topics, or individual LOs. Questions are drawn randomly from your selection.',

      // Configure — empty state
      no_los_match: 'No LOs match the selected filters.',
      clear_filters: 'Clear filters',

      // Configure — CTA
      select_to_continue: 'Select items to continue',
      review_questions: (n) => `Review ${n} Question${n === 1 ? '' : 's'}`,

      // Filter sheet
      filter: 'Filter',
      tag_filters: 'Tag Filters',
      exam_scope_range: 'Exam Scope Range',
      from: 'From',
      to: 'To',
      mode: 'Mode',
      level: 'Level',
      reset: 'Reset',
      apply: 'Apply',
      add_range: 'Add range',
      mode_placeholder: 'e.g. exam, standard, practice',
      level_easy: 'Easy',
      level_medium: 'Medium',
      level_difficult: 'Difficult',

      // Review screen
      review_practice_set: 'Review Practice Set',
      your_practice_set: 'Your practice set',
      start_practice: 'Start Practice',

      // Practice screen
      question_of: (i, n) => `Question ${i} of ${n}`,
      next: 'Next',
      prev: 'Previous',

      // Submitted screen
      well_done: 'Well done!',
      practice_complete: 'Practice complete',
      back_to_home: 'Back to home',
    },

    ja: {
      // Navigation
      practice: '練習',
      courses: 'コース',

      // Home
      create_practice_set: '練習セットを作成',
      recent_practice_sets: '最近の練習セット',

      // Configure — header
      questions_total: 'アイテム合計',
      question_total: 'アイテム合計',
      items_selected: '項目選択済み',
      item_selected: '項目選択済み',
      select_all: 'すべて選択',
      clear: 'クリア',

      // Configure — hierarchy meta
      chapters: '章',
      chapter: '章',
      topics: 'トピック',
      topic: 'トピック',
      questions: 'アイテム',
      los: '学習目標',
      scope: 'スコープ',
      topics_selected: 'トピック選択済み',
      topic_selected: 'トピック選択済み',

      // Configure — hint
      random_hint: '本、章、トピック、または個別の学習目標を選択してください。質問は選択範囲からランダムに抽出されます。',

      // Configure — empty state
      no_los_match: '選択したフィルターに一致する学習目標がありません。',
      clear_filters: 'フィルターをクリア',

      // Configure — CTA
      select_to_continue: '項目を選択して続ける',
      review_questions: (n) => `${n}アイテムを確認`,

      // Filter sheet
      filter: 'フィルター',
      tag_filters: 'タグフィルター',
      exam_scope_range: '試験範囲',
      from: 'から',
      to: 'まで',
      mode: 'モード',
      level: 'レベル',
      reset: 'リセット',
      apply: '適用',
      add_range: '範囲を追加',
      mode_placeholder: '例：exam、standard、practice',
      level_easy: '易しい',
      level_medium: '普通',
      level_difficult: '難しい',

      // Review screen
      review_practice_set: '練習セットを確認',
      your_practice_set: '練習セット',
      start_practice: '練習を開始',

      // Practice screen
      question_of: (i, n) => `${i} / ${n}問目`,
      next: '次へ',
      prev: '前へ',

      // Submitted screen
      well_done: 'よくできました！',
      practice_complete: '練習完了',
      back_to_home: 'ホームに戻る',
    },
  };

  window.PRACTICE_LANG = window.PRACTICE_LANG || 'en';

  // Change language and notify all subscribers
  window.setLang = (lang) => {
    window.PRACTICE_LANG = lang;
    window.dispatchEvent(new Event('lang-change'));
  };

  // Translate a key. Supports string values and function values (for interpolated strings).
  window.t = (key, ...args) => {
    const lang = window.PRACTICE_LANG;
    const val = STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
    return typeof val === 'function' ? val(...args) : val;
  };

  // React hook — subscribes the calling component to language changes
  window.useLang = () => {
    const [lang, setLang] = React.useState(window.PRACTICE_LANG);
    React.useEffect(() => {
      const h = () => setLang(window.PRACTICE_LANG);
      window.addEventListener('lang-change', h);
      return () => window.removeEventListener('lang-change', h);
    }, []);
    return lang;
  };

  // Language toggle button component
  function LangToggle() {
    const lang = window.useLang();
    const next = lang === 'en' ? 'ja' : 'en';
    return (
      <button
        onClick={() => window.setLang(next)}
        style={{
          border: 'none', borderRadius: 6, padding: '4px 9px',
          background: 'rgba(28,30,44,.07)',
          fontFamily: 'Roboto', fontWeight: 700, fontSize: 12,
          color: 'rgba(28,30,44,.72)', cursor: 'pointer',
          letterSpacing: .3, lineHeight: 1.6,
        }}>
        {lang === 'en' ? 'JP' : 'EN'}
      </button>
    );
  }

  window.MnbLangToggle = LangToggle;
})();
