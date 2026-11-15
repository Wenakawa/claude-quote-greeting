// ==UserScript==
// @name         Claude Quote Greeting
// @namespace    niw
// @version      1.6.0
// @description  แทนคำทักทายหน้าแรก claude.ai ด้วยคำคม (อัปเดตชุดใหม่ทุกสัปดาห์)
// @match        https://claude.ai/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Wenakawa/claude-quote-greeting/main/claude-quote-greeting.user.js
// @downloadURL  https://raw.githubusercontent.com/Wenakawa/claude-quote-greeting/main/claude-quote-greeting.user.js
// ==/UserScript==

(function () {
  'use strict';

  // [คำคม, ความหมายไทย, ผู้พูด]
  // QUOTES-START (บล็อกนี้ถูกแทนที่อัตโนมัติทุกสัปดาห์)
  const QUOTES = [
    ["It is not the man who has too little, but the man who craves more, that is poor.", "ผู้ที่ยากจนไม่ใช่คนที่มีน้อย แต่คือคนที่อยากได้มากขึ้นไม่สิ้นสุด", "Seneca"],
    ["The impediment to action advances action. What stands in the way becomes the way.", "อุปสรรคผลักดันการกระทำ สิ่งที่ขวางทางกลับกลายเป็นหนทาง", "Marcus Aurelius"],
    ["Look within. Within is the fountain of good.", "จงมองเข้าไปข้างใน เพราะข้างในคือบ่อเกิดแห่งความดี", "Marcus Aurelius"],
    ["Freedom is not procured by a full enjoyment of what is desired, but by controlling the desire.", "อิสรภาพไม่ได้มาจากการได้ทุกสิ่งที่อยาก แต่มาจากการควบคุมความอยาก", "Epictetus"],
    ["Practice yourself, for heaven's sake, in little things; and thence proceed to greater.", "ฝึกตนในเรื่องเล็กๆ ก่อน แล้วจึงก้าวไปสู่เรื่องที่ใหญ่กว่า", "Epictetus"],
    ["Wishing to be friends is quick work, but friendship is a slow-ripening fruit.", "อยากเป็นเพื่อนกันนั้นง่าย แต่มิตรภาพคือผลไม้ที่สุกช้า", "Aristotle"],
    ["All men by nature desire to know.", "มนุษย์ทุกคนโดยธรรมชาติปรารถนาที่จะรู้", "Aristotle"],
    ["Eyes are more exact witnesses than ears.", "ตาเป็นพยานที่แม่นยำกว่าหู", "Heraclitus"],
    ["It is impossible to live a pleasant life without living wisely and well and justly.", "เป็นไปไม่ได้ที่จะมีชีวิตที่รื่นรมย์ หากไม่ใช้ชีวิตอย่างมีปัญญา ดีงาม และเที่ยงธรรม", "Epicurus"],
    ["He who conquers others is strong; he who conquers himself is mighty.", "ผู้ชนะผู้อื่นคือผู้แข็งแรง ผู้ชนะตนเองคือผู้ยิ่งใหญ่", "Lao Tzu"],
    ["Difficult things in the world must be done while they are easy.", "เรื่องยากในโลก ต้องลงมือทำตั้งแต่ตอนที่มันยังง่าย", "Lao Tzu"],
    ["Great knowledge is broad and unhurried; small knowledge is cramped and busy.", "ความรู้ยิ่งใหญ่นั้นกว้างและไม่รีบร้อน ความรู้เล็กน้อยนั้นคับแคบและวุ่นวาย", "Zhuangzi"],
    ["The gentleman is at ease without being arrogant; the small man is arrogant without being at ease.", "วิญญูชนสงบโดยไม่หยิ่งผยอง คนเล็กหยิ่งผยองแต่ไม่เคยสงบ", "Confucius"],
    ["When three walk together, there must be one who can be my teacher.", "เมื่อสามคนเดินด้วยกัน ย่อมมีสักคนที่เป็นครูของเราได้", "Confucius"],
    ["The way of learning is none other than finding the lost mind.", "หนทางแห่งการเรียนรู้ ไม่ใช่อื่นใดนอกจากการตามหาใจที่หายไป", "Mencius"],
    ["Blue comes from indigo, yet is bluer than indigo.", "สีน้ำเงินได้มาจากต้นคราม แต่กลับเข้มกว่าคราม (ศิษย์เก่งเกินครูได้)", "Xunzi"],
    ["All warfare is based on deception.", "การศึกทั้งปวงตั้งอยู่บนเล่ห์กล", "Sun Tzu"],
    ["Irrigators channel waters; fletchers straighten arrows; carpenters bend wood; the wise master themselves.", "คนไขน้ำบังคับน้ำ ช่างศรดัดลูกศร ช่างไม้ถากไม้ บัณฑิตฝึกตน", "The Buddha"],
    ["Drop by drop is the water pot filled.", "น้ำหยดทีละหยด ยังเต็มตุ่มได้", "The Buddha"],
    ["If you chase two rabbits, you will not catch either one.", "ไล่จับกระต่ายสองตัว จะไม่ได้สักตัว", "Japanese proverb"],
    ["Do not regret what you have done.", "อย่าเสียใจกับสิ่งที่ทำไปแล้ว", "Miyamoto Musashi"],
    ["Every day is a journey, and the journey itself is home.", "ทุกวันคือการเดินทาง และการเดินทางนั่นเองคือบ้าน", "Bashō"],
    ["In the beginner's mind there are many possibilities, but in the expert's there are few.", "ในใจของผู้เริ่มต้นมีความเป็นไปได้มากมาย แต่ในใจของผู้เชี่ยวชาญมีเพียงน้อยนิด", "Shunryu Suzuki"],
    ["One must still have chaos in oneself to be able to give birth to a dancing star.", "ต้องมีความโกลาหลอยู่ในตัว จึงจะให้กำเนิดดวงดาวที่เริงระบำได้", "Nietzsche"],
    ["Purity of heart is to will one thing.", "ความบริสุทธิ์แห่งใจ คือการมุ่งปรารถนาเพียงสิ่งเดียว", "Kierkegaard"],
    ["Hell is other people.", "นรกคือคนอื่น", "Sartre"],
    ["Real generosity toward the future lies in giving all to the present.", "ความเอื้อเฟื้อต่ออนาคตที่แท้ คือการทุ่มเททั้งหมดให้กับปัจจุบัน", "Camus"],
    ["One is not born, but rather becomes, a woman.", "ไม่มีใครเกิดมาเป็นผู้หญิง แต่กลายมาเป็นผู้หญิง", "Simone de Beauvoir"],
    ["I have made this longer than usual because I have not had time to make it shorter.", "จดหมายนี้ยาวกว่าปกติ เพราะไม่มีเวลาทำให้มันสั้นลง", "Pascal"],
    ["To philosophize is to learn to die.", "การคิดเชิงปรัชญาคือการเรียนรู้ที่จะตาย", "Montaigne"],
    ["I have striven not to laugh at human actions, not to weep at them, nor to hate them, but to understand them.", "ข้าพยายามไม่หัวเราะ ไม่ร่ำไห้ ไม่เกลียดชังการกระทำของมนุษย์ แต่พยายามเข้าใจมัน", "Spinoza"],
    ["If God did not exist, it would be necessary to invent him.", "หากพระเจ้าไม่มีอยู่จริง ก็จำเป็นต้องสร้างพระองค์ขึ้นมา", "Voltaire"],
    ["It is not enough to have a good mind; the main thing is to use it well.", "มีความคิดดีอย่างเดียวไม่พอ สิ่งสำคัญคือต้องใช้มันให้ดี", "Descartes"],
    ["Dripping water hollows out stone.", "น้ำหยดลงหินทุกวัน หินมันยังกร่อน", "Ovid"],
    ["Anger is a short madness.", "ความโกรธคือความบ้าชั่วครู่", "Horace"],
    ["The owl of Minerva spreads its wings only with the falling of the dusk.", "นกฮูกแห่งมิเนอร์วาสยายปีกเมื่อยามสนธยามาเยือนเท่านั้น (ปัญญามักมาเมื่อเรื่องผ่านไปแล้ว)", "Hegel"],
    ["Man can do what he wills, but he cannot will what he wills.", "มนุษย์ทำตามที่ใจต้องการได้ แต่เลือกไม่ได้ว่าใจจะต้องการอะไร", "Schopenhauer"],
    ["Heaven is under our feet as well as over our heads.", "สวรรค์อยู่ใต้เท้าเรา พอๆ กับที่อยู่เหนือศีรษะ", "Thoreau"],
    ["Nothing great was ever achieved without enthusiasm.", "ไม่มีสิ่งยิ่งใหญ่ใดสำเร็จได้โดยปราศจากความกระตือรือร้น", "Emerson"],
    ["To be ignorant of what occurred before you were born is to remain always a child.", "การไม่รู้เรื่องที่เกิดก่อนเราเกิด ก็เท่ากับเป็นเด็กอยู่ตลอดไป", "Cicero"]
  ];
  // QUOTES-END

  const pick = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const text = `“${pick[0]}” — ${pick[2]}\n${pick[1]}`;
  const MARK = 'data-niw-quote';

  // ซ่อนข้อความเดิม แล้วแสดงคำคมผ่าน CSS (ไม่แก้โครงหน้าเว็บของ Claude)
  const style = document.createElement('style');
  style.textContent = `
    [${MARK}] { font-size: 0 !important; }
    [${MARK}]::after {
      content: attr(${MARK});
      white-space: pre-line;
      font-size: 1.35rem;
      line-height: 1.5;
      display: block;
      text-align: center;
    }`;
  document.head.appendChild(style);

  function scan() {
    // ทำงานเฉพาะหน้าแรก/หน้าแชทใหม่ ไม่ยุ่งกับข้อความในแชท
    if (!/^\/(new)?$/.test(location.pathname)) return;
    for (const el of document.querySelectorAll('h1, h2, span, div')) {
      if (el.hasAttribute(MARK) || el.children.length) continue;
      // ข้าม sidebar / เมนู (เช่น ชื่อบัญชีมุมซ้ายล่าง)
      if (el.closest('nav, aside, header, footer, [role="navigation"], [role="menu"], button')) continue;
      const t = el.textContent.trim();
      // ต้องเป็นประโยคทักทาย: มีคำนำหน้า + เว้นวรรค + "นิว" (ไม่ใช่คำว่า "นิว" เดี่ยวๆ)
      if (t.length < 60 && /\S\s+นิว$/.test(t)) el.setAttribute(MARK, text);
    }
  }

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; scan(); });
  }).observe(document.body, { childList: true, subtree: true });
  scan();
})();
