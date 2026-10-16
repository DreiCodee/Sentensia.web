/* =====================================================================
   QUICK QUIZ  -  multiple-choice grammar quiz with a score at the end
   ---------------------------------------------------------------------
   The learner picks a level (Beginner / Intermediate / Advanced) and
   answers 10 questions. After each answer they see why it is right or
   wrong. At the end they get a score and a list of the questions they
   missed.

   HOW THIS FILE IS ORGANISED
     1. SETTINGS    - quiz length, messages for each score
     2. QUESTIONS   - the question bank. Add your own here!
     3. QUIZ LOGIC  - picks questions, shows them, checks answers
     4. RESULTS     - the score screen and the "questions you missed" list
     5. MENU        - the level list with best scores
   ===================================================================== */

const QuickQuiz = (() => {
  'use strict';

  /* ===================================================================
     1. SETTINGS
     =================================================================== */
  const SETTINGS = {
    questionsPerQuiz: 10,                 // how many questions in one quiz
    bestKey: 'sf-qbest',                  // where best scores are saved on the phone
    // message shown at the end. "min" = the lowest percent that gets this message
    messages: [
      { min: 90, title: 'Superstar!',      text: 'Almost perfect. Your English is shining.' },
      { min: 70, title: 'Great job!',      text: 'You know your grammar well. Keep it up.' },
      { min: 50, title: 'Good effort!',    text: 'You are getting there. Check the questions below and try again.' },
      { min: 0,  title: 'Keep practicing', text: 'Every mistake helps you learn. Read the answers below and try again.' },
    ],
  };

  /* ===================================================================
     2. QUESTIONS  -  add or edit questions here
     -------------------------------------------------------------------
     There are two kinds of question:

       gap( 'sentence with ___', 'right answer', [all choices], 'why it is right' )
           -> the learner picks the word that fills the gap

       sentence( 'the CORRECT sentence', [wrong sentence, wrong sentence], 'why it is right' )
           -> the learner picks the correct sentence
           (the choices are shuffled automatically, so always write the correct one first)

     Each level should have enough questions to pick 10 from (more = more variety).
     Make sure there is only ONE right answer in each question!
     =================================================================== */
  const gap = (text, answer, choices, why) => ({ kind: 'gap', text, answer, choices, why });
  const sentence = (right, wrongs, why) => ({ kind: 'sentence', text: 'Which sentence is correct?', answer: right, choices: [right, ...wrongs], why });

  const QUESTIONS = {
    beginner: [
      gap('My sister ___ a teacher.', 'is', ['is', 'are', 'am'], 'Use "is" with one person, like my sister, he or she.'),
      gap('We ___ breakfast at seven.', 'have', ['have', 'has', 'having'], 'Use "have" with I, you, we and they.'),
      gap('I see two ___ in the garden.', 'birds', ['birds', 'bird', 'a bird'], '"Two" means more than one, so the noun needs an -s.'),
      gap('He ___ football on Saturdays.', 'plays', ['plays', 'play', 'playing'], 'With he, she or it, add -s to the verb.'),
      gap('Look! The baby ___.', 'is sleeping', ['is sleeping', 'sleep', 'are sleeping'], '"Look!" shows it is happening now, so use is + verb-ing.'),
      gap('This is ___ orange.', 'an', ['an', 'a', 'two'], 'Use "an" before a vowel sound, like orange.'),
      gap('We eat soup with a ___.', 'spoon', ['spoon', 'knife', 'pencil'], 'A spoon is the tool we use for soup.'),
      gap('She ___ not like milk.', 'does', ['does', 'do', 'is'], 'Use "does not" with he, she and it.'),
      sentence('They are happy.', ['They is happy.', 'They am happy.'], 'Use "are" with they.'),
      sentence('I have a dog.', ['I has a dog.', 'I haves a dog.'], 'Use "have" with I.'),
      sentence('She goes to school.', ['She go to school.', 'She going to school.'], 'With she, the verb takes -s (goes).'),
      sentence('The boys play ball.', ['The boys plays ball.', 'The boys playing ball.'], '"The boys" is more than one, so the verb has no -s.'),
      sentence('He eats rice.', ['He eat rice.', 'He eating rice.'], 'With he, add -s to the verb.'),
      sentence('An elephant is big.', ['A elephant is big.', 'The elephant are big.'], 'Use "an" before a vowel sound, and "is" with one animal.'),
      sentence('I like apples.', ['Me like apples.', 'I likes apples.'], 'Use "I" as the subject, and no -s on the verb with I.'),
    ],

    intermediate: [
      gap('Yesterday we ___ to the beach.', 'went', ['went', 'go', 'goes'], '"Yesterday" is the past, so use went.'),
      gap('She is ___ than her brother.', 'taller', ['taller', 'tallest', 'more tall'], 'Short adjectives add -er when comparing two people.'),
      gap('I have ___ my homework already.', 'finished', ['finished', 'finish', 'finishing'], 'Use have + the past form (finished) for something done already.'),
      gap('They were playing when it ___ to rain.', 'began', ['began', 'begin', 'begins'], 'The story is in the past, so use began.'),
      gap('We arrived ___ the airport at noon.', 'at', ['at', 'to', 'on'], 'We say "arrive at" a place like an airport or station.'),
      gap('There isn\'t ___ milk in the fridge.', 'any', ['any', 'some', 'a'], 'Use "any" in negative sentences.'),
      gap('If you study, you ___ pass the test.', 'will', ['will', 'are', 'did'], 'Use "will" for a likely result in the future.'),
      gap('He didn\'t ___ the answer.', 'know', ['know', 'knew', 'knows'], 'After "didn\'t", use the base verb.'),
      sentence('She doesn\'t like coffee.', ['She don\'t like coffee.', 'She not like coffee.'], 'Use "doesn\'t" with she, he and it.'),
      sentence('I have lived here since 2019.', ['I am living here since 2019.', 'I live here since 2019.'], 'Use have + lived with "since" for something that started in the past and continues.'),
      sentence('There are many people.', ['There are much people.', 'There is many people.'], 'Use "many" with things you can count, and "are" with more than one.'),
      sentence('He is taller than me.', ['He is more taller than me.', 'He is tallest than me.'], 'Add -er to tall. Do not add "more" as well.'),
      sentence('We went home.', ['We went to home.', 'We went at home.'], 'We say "go home" without "to" or "at".'),
      sentence('She is good at singing.', ['She is good in singing.', 'She is good on singing.'], 'We say "good at" something.'),
      sentence('I didn\'t go to school.', ['I didn\'t went to school.', 'I not went to school.'], 'After "didn\'t", use the base verb (go).'),
    ],

    advanced: [
      gap('The book ___ I read last week was long.', 'that', ['that', 'who', 'what'], '"That" connects a thing (the book) to the clause about it.'),
      gap('If I ___ rich, I would travel the world.', 'were', ['were', 'am', 'will be'], 'For imaginary situations, use "were" after "if".'),
      gap('She asked me ___ I was from.', 'where', ['where', 'what', 'which'], 'To ask about a place, use "where".'),
      gap('By next year, I ___ my studies.', 'will have finished', ['will have finished', 'have finished', 'finished'], 'Use will have + past form for something done before a future time.'),
      gap('The news ___ good today.', 'is', ['is', 'are', 'were'], '"News" is singular, so use "is".'),
      gap('___ he was tired, he kept working.', 'Although', ['Although', 'Because', 'So'], '"Although" shows two ideas that contrast.'),
      gap('She suggested ___ early.', 'leaving', ['leaving', 'to leaving', 'leaves'], 'After "suggest", use the -ing form.'),
      gap('The window ___ by the storm last night.', 'was broken', ['was broken', 'broke', 'has broke'], 'The window did not break itself, so use the passive: was + broken.'),
      sentence('Having finished the test, the students left.', ['Having finished the test, the bell rang.', 'Having finished the test, the desk was clean.'], 'Who finished the test? The students. The first part must describe the subject that follows.'),
      sentence('Not only does she sing, but she also dances.', ['Not only she sings, but she also dances.', 'Not only she does sing, but she also dances.'], 'After "Not only" at the start, the verb comes first: does she sing.'),
      sentence('I wish I were a bird.', ['I wish I am a bird.', 'I wish I will be a bird.'], 'After "wish", use "were" for something imaginary.'),
      sentence('Each of the students has a book.', ['Each of the students have a book.', 'Each of the students are having a book.'], '"Each" is singular, so use "has".'),
      sentence('He said that he would come the next day.', ['He said that he will come yesterday.', 'He said that he comes the next day.'], 'In reported speech, "will" changes to "would".'),
      sentence('Despite the rain, we played.', ['Despite of the rain, we played.', 'Despite it rained, we played.'], '"Despite" is followed directly by a noun, with no "of".'),
      sentence('The more you practice, the better you get.', ['The more you practice, the more better you get.', 'The more you practice, the best you get.'], 'Use "the + better" to compare. Do not add "more" or use "best".'),
    ],
  };

  const LEVEL_NAMES = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

  /* ===================================================================
     3. QUIZ LOGIC
     =================================================================== */
  const $q = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = list => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  let level = 'beginner';     // the level being played
  let quiz = [];              // the 10 questions of this quiz
  let index = 0;              // which question we are on
  let score = 0;

  function startQuiz(lv) {
    level = lv;
    // pick random questions from this level, and shuffle the choices of each
    quiz = shuffle(QUESTIONS[lv]).slice(0, SETTINGS.questionsPerQuiz)
      .map(q => ({ ...q, choices: shuffle(q.choices), correct: null, picked: null }));
    index = 0; score = 0;
    showQuestion();
    go('qzplay');
  }

  function showQuestion() {
    const q = quiz[index];
    $q('qzCount').textContent = (index + 1) + '/' + quiz.length;
    $q('qzSeg').innerHTML = quiz.map((x, k) => '<i class="' + (k < index ? (x.correct ? 'ok' : 'no') : k === index ? 'on' : '') + '"></i>').join('');
    $q('qzTag').textContent = q.kind === 'gap' ? 'Fill the gap' : 'Pick the correct sentence';
    // in a gap question the ___ is shown as a highlighted blank
    $q('qzQ').innerHTML = q.kind === 'gap' ? esc(q.text).replace('___', '<mark>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</mark>') : esc(q.text);
    const box = $q('qzOpts'); box.classList.remove('lock');
    box.innerHTML = q.choices.map((c, k) => '<button class="opt" data-k="' + k + '"><b>' + 'ABCD'[k] + '</b><span>' + esc(c) + '</span></button>').join('');
    $q('qzFb').hidden = true; $q('qzNext').hidden = true;
  }

  $q('qzOpts').addEventListener('click', e => {
    const btn = e.target.closest('.opt'); const box = $q('qzOpts');
    if (!btn || box.classList.contains('lock')) return;
    const q = quiz[index];
    q.picked = q.choices[+btn.dataset.k];
    q.correct = q.picked === q.answer;
    if (q.correct) score++;
    box.classList.add('lock');
    box.querySelectorAll('.opt').forEach(o => { if (q.choices[+o.dataset.k] === q.answer) o.classList.add('ok'); });
    if (!q.correct) btn.classList.add('no');
    const fb = $q('qzFb'); fb.className = 'wfb ' + (q.correct ? 'ok' : 'no');
    fb.innerHTML = '<b>' + (q.correct ? 'Correct!' : 'Not quite.') + '</b>' + esc(q.why);
    fb.hidden = false;
    $q('qzSeg').children[index].className = q.correct ? 'ok' : 'no';
    $q('qzNext').textContent = index === quiz.length - 1 ? 'See my score' : 'Next';
    $q('qzNext').hidden = false;
  });

  $q('qzNext').addEventListener('click', () => { if (index < quiz.length - 1) { index++; showQuestion(); } else finish(); });
  $q('qzBack').addEventListener('click', () => go('qz'));

  /* ===================================================================
     4. RESULTS
     =================================================================== */
  function finish() {
    const percent = Math.round(100 * score / quiz.length);
    const msg = SETTINGS.messages.find(m => percent >= m.min);
    const best = loadBest(), isBest = score > (best[level] || 0);
    if (isBest) { best[level] = score; saveBest(best); }
    renderMenu();

    $q('qzdScore').textContent = score;
    $q('qzdOf').textContent = 'out of ' + quiz.length;
    $q('qzdTitle').textContent = msg.title;
    $q('qzdSub').textContent = (isBest && score > 0 ? 'New best score for ' + LEVEL_NAMES[level] + '! ' : '') + msg.text;

    // the questions the learner got wrong
    const missed = quiz.filter(q => !q.correct);
    $q('qzdMiss').innerHTML = missed.length
      ? '<h3>Questions to review</h3>' + missed.map(q =>
          '<div class="qzm"><div class="qzm-q">' + esc(q.kind === 'gap' ? q.text : 'Which sentence is correct?') + '</div>' +
          '<div class="qzm-a">You chose: <s>' + esc(q.picked) + '</s></div>' +
          '<div class="qzm-r">Correct: <b>' + esc(q.answer) + '</b></div>' +
          '<div class="qzm-w">' + esc(q.why) + '</div></div>').join('')
      : '<p class="soft">You got every question right!</p>';
    $q('qzdBody').scrollTop = 0;
    go('qzdone');
  }

  $q('qzdAgain').addEventListener('click', () => startQuiz(level));

  /* ===================================================================
     5. MENU  -  the level list with best scores
     =================================================================== */
  function loadBest() { try { return JSON.parse(localStorage.getItem(SETTINGS.bestKey) || '{}'); } catch (e) { return {}; } }
  function saveBest(b) { try { localStorage.setItem(SETTINGS.bestKey, JSON.stringify(b)); } catch (e) {} }

  const DESCRIPTIONS = { beginner: 'Simple verbs, nouns and sentences', intermediate: 'Tenses, prepositions and comparing', advanced: 'Clauses, reported speech and tricky grammar' };
  function renderMenu() {
    const best = loadBest();
    document.querySelectorAll('[data-qlvl]').forEach(b => {
      const lv = b.dataset.qlvl;
      b.querySelector('small').textContent = (best[lv] != null ? 'Best: ' + best[lv] + '/' + SETTINGS.questionsPerQuiz + ' · ' : '') + DESCRIPTIONS[lv];
    });
  }

  document.addEventListener('click', e => {
    const lv = e.target.closest('[data-qlvl]');
    if (lv) startQuiz(lv.dataset.qlvl);
  });
  renderMenu();

  return { startQuiz };
})();