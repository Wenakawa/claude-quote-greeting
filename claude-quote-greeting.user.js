// ==UserScript==
// @name         Claude Quote Greeting
// @namespace    niw
// @version      1.5.0
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
    ["Wherever there is a human being, there is an opportunity for a kindness.", "ที่ใดมีมนุษย์ ที่นั่นมีโอกาสให้ทำความดี", "Seneca"],
    ["Men learn while they teach.", "คนเราได้เรียนรู้ขณะที่สอนผู้อื่น", "Seneca"],
    ["Accept the things to which fate binds you, and love the people with whom fate brings you together.", "ยอมรับสิ่งที่โชคชะตามอบให้ และรักคนที่โชคชะตานำมาพบกัน", "Marcus Aurelius"],
    ["What is not good for the swarm is not good for the bee.", "สิ่งที่ไม่ดีต่อรัง ก็ไม่ดีต่อผึ้งตัวใด", "Marcus Aurelius"],
    ["Do not seek for things to happen as you wish, but wish them to happen as they do.", "อย่าหวังให้ทุกอย่างเป็นดั่งใจ แต่จงยินดีกับสิ่งที่มันเป็น", "Epictetus"],
    ["We have two ears and one mouth, so we should listen more than we speak.", "เรามีสองหูหนึ่งปาก จึงควรฟังให้มากกว่าพูด", "Zeno of Citium"],
    ["Well-being is attained by little and little, and nevertheless is no little thing itself.", "ความสุขได้มาทีละน้อย แต่ตัวมันเองไม่ใช่เรื่องเล็กเลย", "Zeno of Citium"],
    ["It is better to suffer injustice than to commit it.", "ถูกกระทำอย่างอยุติธรรม ยังดีกว่าเป็นผู้กระทำเสียเอง", "Socrates"],
    ["Friendship is a single soul dwelling in two bodies.", "มิตรภาพคือวิญญาณเดียวที่อาศัยอยู่ในสองร่าง", "Aristotle"],
    ["Nature does nothing in vain.", "ธรรมชาติไม่ทำสิ่งใดโดยไร้ประโยชน์", "Aristotle"],
    ["Much learning does not teach understanding.", "รู้มากไม่ได้แปลว่าเข้าใจ", "Heraclitus"],
    ["The sun is new each day.", "ดวงอาทิตย์ใหม่ทุกวัน", "Heraclitus"],
    ["Nothing is enough for the man to whom enough is too little.", "สำหรับคนที่ว่าพอยังน้อยไป ไม่มีสิ่งใดพอเลย", "Epicurus"],
    ["Stand a little out of my sun.", "ช่วยหลบไปหน่อย อย่าบังแดดข้า", "Diogenes of Sinope"],
    ["Happiness resides not in possessions, and not in gold; happiness dwells in the soul.", "ความสุขไม่ได้อยู่ในทรัพย์สินหรือทองคำ แต่อยู่ในจิตใจ", "Democritus"],
    ["Man is the measure of all things.", "มนุษย์เป็นเครื่องวัดสรรพสิ่ง", "Protagoras"],
    ["If you have a garden in your library, nothing will be lacking.", "มีสวนอยู่ในห้องสมุด ก็ไม่ขาดสิ่งใดแล้ว", "Cicero"],
    ["The life of the dead is placed in the memory of the living.", "ชีวิตของผู้ล่วงลับอยู่ในความทรงจำของผู้ที่ยังอยู่", "Cicero"],
    ["The highest good is like water.", "ความดีสูงสุดเปรียบดั่งน้ำ", "Lao Tzu"],
    ["True words are not beautiful; beautiful words are not true.", "คำจริงไม่ไพเราะ คำไพเราะไม่จริง", "Lao Tzu"],
    ["Everyone knows the usefulness of the useful, but no one knows the usefulness of the useless.", "ใครๆ ก็รู้ประโยชน์ของสิ่งที่มีประโยชน์ แต่ไม่มีใครรู้ประโยชน์ของสิ่งที่ไร้ประโยชน์", "Zhuangzi"],
    ["To have faults and not to reform them — this, indeed, is a fault.", "มีข้อผิดแล้วไม่แก้ไข นั่นแหละคือความผิดที่แท้", "Confucius"],
    ["Is virtue a thing remote? I wish to be virtuous, and lo! virtue is at hand.", "คุณธรรมอยู่ไกลหรือ? เพียงตั้งใจจะดี คุณธรรมก็อยู่ตรงหน้า", "Confucius"],
    ["I am human, and nothing human is alien to me.", "ข้าเป็นมนุษย์ สิ่งใดที่เป็นของมนุษย์ย่อมไม่แปลกแยกจากข้า", "Terence"],
    ["Though one may conquer a thousand times a thousand men in battle, the noblest victor conquers himself.", "ชนะคนนับล้านในสนามรบ ยังไม่ประเสริฐเท่าชนะใจตน", "The Buddha"],
    ["Let none find fault with others; let each look to his own acts, done and undone.", "อย่ามัวจับผิดผู้อื่น จงดูสิ่งที่ตนทำและยังไม่ได้ทำ", "The Buddha"],
    ["To study the Buddha way is to study the self.", "ศึกษาทางแห่งพุทธะ คือศึกษาตนเอง", "Dōgen"],
    ["Even a stone, if sat upon for three years, grows warm.", "แม้ก้อนหิน นั่งทับสามปีก็ยังอุ่น", "Japanese proverb"],
    ["The frog in the well knows nothing of the great ocean.", "กบในบ่อไม่รู้จักมหาสมุทร", "Japanese proverb"],
    ["From one thing, know ten thousand things.", "รู้หนึ่งสิ่ง ให้เข้าใจหมื่นสิ่ง", "Miyamoto Musashi"],
    ["He who fights with monsters should see to it that he himself does not become a monster.", "ผู้ที่ต่อสู้กับปีศาจ จงระวังอย่ากลายเป็นปีศาจเสียเอง", "Nietzsche"],
    ["Every man takes the limits of his own field of vision for the limits of the world.", "ทุกคนมักคิดว่าขอบเขตที่ตนมองเห็นคือขอบเขตของโลก", "Schopenhauer"],
    ["Man is but a reed, the most feeble thing in nature; but he is a thinking reed.", "มนุษย์เป็นเพียงต้นอ้อที่เปราะบางที่สุด แต่เป็นต้นอ้อที่คิดได้", "Pascal"],
    ["The greatest thing in the world is to know how to belong to oneself.", "สิ่งยิ่งใหญ่ที่สุดในโลกคือการรู้จักเป็นเจ้าของตัวเอง", "Montaigne"],
    ["Peace is not an absence of war; it is a virtue.", "สันติภาพไม่ใช่แค่การไร้สงคราม แต่คือคุณธรรม", "Spinoza"],
    ["Out of the crooked timber of humanity, no straight thing was ever made.", "จากไม้คดงอของมนุษยชาติ ไม่เคยมีสิ่งใดตรงแน่วได้", "Kant"],
    ["Reason is, and ought only to be, the slave of the passions.", "เหตุผลเป็น และควรเป็นเพียงทาสของอารมณ์ปรารถนา", "David Hume"],
    ["Most men lead lives of quiet desperation.", "คนส่วนใหญ่ใช้ชีวิตอยู่กับความสิ้นหวังอย่างเงียบงัน", "Thoreau"],
    ["The only way to have a friend is to be one.", "วิธีเดียวที่จะมีเพื่อน คือการเป็นเพื่อนให้เขา", "Emerson"],
    ["Man is the only creature who refuses to be what he is.", "มนุษย์เป็นสิ่งมีชีวิตเดียวที่ปฏิเสธจะเป็นอย่างที่ตนเป็น", "Camus"]
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
