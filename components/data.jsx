// Sample course content for the practice question flow
(function () {
  // G9 English Course — hierarchy: Course > Book > Chapter > Topic > Learning Objective (LO) > Item > Question
  // Each topic has `available` = total questions in its pool.
  // Each LO has `code` (e.g. LO 1.1.a), `title`, and `available` questions.
  // The app draws the user-specified number of questions RANDOMLY from the
  // selected scope (book, filtered by selected chapters/topics). No difficulty selection.

  const books = [
    {
      id: 'bk1', code: 'Book 1', title: 'Foundations of English',
      available: 128, attempted: 40,
      chapters: [
        {
          id: 'ch1', code: 'Chapter 1', title: 'Reading Comprehension', available: 42, attempted: 28,
          topics: [
            { id: 't1-1', title: 'Main Idea & Summary', available: 10, attempted: 7,
              los: [
                { id: 'lo1-1-a', code: 'LO 1.1.a', title: 'Identify a passage’s central idea', available: 6 },
                { id: 'lo1-1-b', code: 'LO 1.1.b', title: 'Write a one-sentence summary', available: 4 },
              ],
            },
            { id: 't1-2', title: 'Inference from Context', available: 12, attempted: 9,
              los: [
                { id: 'lo1-2-a', code: 'LO 1.2.a', title: 'Draw conclusions from textual evidence', available: 7 },
                { id: 'lo1-2-b', code: 'LO 1.2.b', title: 'Distinguish implied vs. stated meaning', available: 5 },
              ],
            },
            { id: 't1-3', title: 'Author’s Tone & Purpose', available: 8, attempted: 4,
              los: [
                { id: 'lo1-3-a', code: 'LO 1.3.a', title: 'Identify tone from word choice', available: 5 },
                { id: 'lo1-3-b', code: 'LO 1.3.b', title: 'Explain author’s purpose', available: 3 },
              ],
            },
            { id: 't1-4', title: 'Vocabulary in Context', available: 12, attempted: 8,
              los: [
                { id: 'lo1-4-a', code: 'LO 1.4.a', title: 'Infer word meaning from context clues', available: 8 },
                { id: 'lo1-4-b', code: 'LO 1.4.b', title: 'Distinguish multiple-meaning words', available: 4 },
              ],
            },
          ],
        },
        {
          id: 'ch2', code: 'Chapter 2', title: 'Grammar & Usage', available: 56, attempted: 12,
          topics: [
            { id: 't2-1', title: 'Verb Tenses', available: 14, attempted: 5,
              los: [
                { id: 'lo2-1-a', code: 'LO 2.1.a', title: 'Use simple and perfect tenses correctly', available: 8 },
                { id: 'lo2-1-b', code: 'LO 2.1.b', title: 'Maintain verb tense consistency', available: 6 },
              ],
            },
            { id: 't2-2', title: 'Subject–Verb Agreement', available: 10, attempted: 3,
              los: [
                { id: 'lo2-2-a', code: 'LO 2.2.a', title: 'Match verb to simple subject', available: 6 },
                { id: 'lo2-2-b', code: 'LO 2.2.b', title: 'Handle collective and indefinite subjects', available: 4 },
              ],
            },
            { id: 't2-3', title: 'Modifiers & Parallelism', available: 12, attempted: 2,
              los: [
                { id: 'lo2-3-a', code: 'LO 2.3.a', title: 'Fix misplaced and dangling modifiers', available: 7 },
                { id: 'lo2-3-b', code: 'LO 2.3.b', title: 'Construct parallel lists and comparisons', available: 5 },
              ],
            },
            { id: 't2-4', title: 'Punctuation', available: 8, attempted: 2,
              los: [
                { id: 'lo2-4-a', code: 'LO 2.4.a', title: 'Use commas in compound sentences', available: 5 },
                { id: 'lo2-4-b', code: 'LO 2.4.b', title: 'Apply semicolons and colons', available: 3 },
              ],
            },
            { id: 't2-5', title: 'Pronoun Agreement', available: 12, attempted: 0,
              los: [
                { id: 'lo2-5-a', code: 'LO 2.5.a', title: 'Match pronoun and antecedent', available: 7 },
                { id: 'lo2-5-b', code: 'LO 2.5.b', title: 'Resolve ambiguous pronoun references', available: 5 },
              ],
            },
          ],
        },
        {
          id: 'ch3', code: 'Chapter 3', title: 'Writing & Composition', available: 30, attempted: 0,
          topics: [
            { id: 't3-1', title: 'Thesis & Topic Sentences', available: 8, attempted: 0,
              los: [
                { id: 'lo3-1-a', code: 'LO 3.1.a', title: 'Craft an arguable thesis statement', available: 5 },
                { id: 'lo3-1-b', code: 'LO 3.1.b', title: 'Write focused topic sentences', available: 3 },
              ],
            },
            { id: 't3-2', title: 'Transitions & Cohesion', available: 10, attempted: 0,
              los: [
                { id: 'lo3-2-a', code: 'LO 3.2.a', title: 'Use transitional phrases between ideas', available: 6 },
                { id: 'lo3-2-b', code: 'LO 3.2.b', title: 'Maintain paragraph cohesion', available: 4 },
              ],
            },
            { id: 't3-3', title: 'Revising for Clarity', available: 12, attempted: 0,
              los: [
                { id: 'lo3-3-a', code: 'LO 3.3.a', title: 'Eliminate wordiness and redundancy', available: 7 },
                { id: 'lo3-3-b', code: 'LO 3.3.b', title: 'Replace vague language with precise terms', available: 5 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'bk2', code: 'Book 2', title: 'Advanced Literary Studies',
      available: 64, attempted: 46,
      chapters: [
        {
          id: 'ch4', code: 'Chapter 4', title: 'Literary Analysis', available: 24, attempted: 6,
          topics: [
            { id: 't4-1', title: 'Theme & Motif', available: 8, attempted: 3,
              los: [
                { id: 'lo4-1-a', code: 'LO 4.1.a', title: 'Identify recurring themes', available: 5 },
                { id: 'lo4-1-b', code: 'LO 4.1.b', title: 'Trace motifs across a text', available: 3 },
              ],
            },
            { id: 't4-2', title: 'Character & Point of View', available: 8, attempted: 3,
              los: [
                { id: 'lo4-2-a', code: 'LO 4.2.a', title: 'Analyze character motivation', available: 5 },
                { id: 'lo4-2-b', code: 'LO 4.2.b', title: 'Distinguish narrative points of view', available: 3 },
              ],
            },
            { id: 't4-3', title: 'Figurative Language', available: 8, attempted: 0,
              los: [
                { id: 'lo4-3-a', code: 'LO 4.3.a', title: 'Identify similes, metaphors, personification', available: 5 },
                { id: 'lo4-3-b', code: 'LO 4.3.b', title: 'Interpret figurative meaning', available: 3 },
              ],
            },
          ],
        },
        {
          id: 'ch5', code: 'Chapter 5', title: 'Vocabulary Building', available: 40, attempted: 40,
          topics: [
            { id: 't5-1', title: 'Roots & Affixes', available: 12, attempted: 12,
              los: [
                { id: 'lo5-1-a', code: 'LO 5.1.a', title: 'Decode words using Greek and Latin roots', available: 7 },
                { id: 'lo5-1-b', code: 'LO 5.1.b', title: 'Apply common prefixes and suffixes', available: 5 },
              ],
            },
            { id: 't5-2', title: 'Synonyms & Antonyms', available: 14, attempted: 14,
              los: [
                { id: 'lo5-2-a', code: 'LO 5.2.a', title: 'Match synonyms in context', available: 8 },
                { id: 'lo5-2-b', code: 'LO 5.2.b', title: 'Identify precise antonyms', available: 6 },
              ],
            },
            { id: 't5-3', title: 'Idiomatic Expressions', available: 14, attempted: 14,
              los: [
                { id: 'lo5-3-a', code: 'LO 5.3.a', title: 'Interpret common idioms', available: 8 },
                { id: 'lo5-3-b', code: 'LO 5.3.b', title: 'Use idiomatic expressions appropriately', available: 6 },
              ],
            },
          ],
        },
      ],
    },
  ];

  const course = {
    id: 'eng-g9',
    title: 'G9 English Course',
    code: 'ENG-G9',
    books,
  };
  // Flat chapters array for backward compat (LoList, ReviewScreen, HomeScreen use this)
  course.chapters = books.flatMap(b => b.chapters);

  // Admin-defined guided learning set for Term 1
  const guidedSet = {
    name: 'Term 1 Study Plan',
    loIds: [
      'lo1-1-a', 'lo1-2-a', 'lo1-3-a',
      'lo2-1-a', 'lo2-1-b', 'lo2-2-a',
      'lo4-1-a', 'lo4-2-a',
      'lo5-1-a', 'lo5-2-a',
    ],
  };

  // Sample practice questions (for the question-answering screen)
  const sampleQuestions = [
    {
      chapter: 'Ch 2 · Grammar',
      prompt: 'Choose the sentence with correct subject–verb agreement.',
      choices: [
        'The team of students are preparing for the test.',
        'The team of students is preparing for the test.',
        'The team of students were preparing for the test.',
        'The team of students have preparing for the test.',
      ],
      correct: 1,
    },
    {
      chapter: 'Ch 1 · Reading',
      prompt: 'In the sentence “The climber’s tenacity impressed everyone,” the word tenacity most nearly means:',
      choices: ['timidity', 'determination', 'speed', 'humility'],
      correct: 1,
    },
    {
      chapter: 'Ch 4 · Literary',
      prompt: 'Which device is used in: “The wind whispered through the leaves”?',
      choices: ['Metaphor', 'Simile', 'Personification', 'Hyperbole'],
      correct: 2,
    },
    {
      chapter: 'Ch 5 · Vocabulary',
      prompt: 'The prefix “pre-” in the word predict means:',
      choices: ['after', 'before', 'against', 'with'],
      correct: 1,
    },
    {
      chapter: 'Ch 2 · Grammar',
      prompt: 'Select the sentence that uses the past perfect tense correctly.',
      choices: [
        'By the time we arrived, the movie had started.',
        'By the time we arrived, the movie started.',
        'By the time we arrived, the movie has started.',
        'By the time we arrived, the movie was starting.',
      ],
      correct: 0,
    },
  ];

  Object.assign(window, { PRACTICE_COURSE: course, PRACTICE_QUESTIONS: sampleQuestions, PRACTICE_GUIDED_SET: guidedSet });
})();
