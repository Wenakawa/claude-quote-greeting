// ==UserScript==
// @name         Claude Quote Greeting
// @namespace    niw
// @version      1.4.0
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
    ["Associate with those who will make a better man of you.", "จงคบหาคนที่ทำให้เราเป็นคนที่ดีขึ้น", "Seneca"],
    ["No man was ever wise by chance.", "ไม่มีใครฉลาดได้เพราะโชคช่วย", "Seneca"],
    ["If one does not know to which port one is sailing, no wind is favorable.", "ถ้าไม่รู้ว่าจะแล่นไปท่าไหน ลมทิศใดก็ไม่เป็นใจ", "Seneca"],
    ["The soul becomes dyed with the color of its thoughts.", "จิตใจย่อมถูกย้อมด้วยสีของความคิด", "Marcus Aurelius"],
    ["Confine yourself to the present.", "จงอยู่กับปัจจุบัน", "Marcus Aurelius"],
    ["How much more grievous are the consequences of anger than the causes of it.", "ผลของความโกรธนั้นร้ายแรงกว่าต้นเหตุของมันมากนัก", "Marcus Aurelius"],
    ["If you want to improve, be content to be thought foolish and stupid.", "ถ้าอยากพัฒนา ก็ต้องยอมให้คนอื่นมองว่าโง่บ้าง", "Epictetus"],
    ["The beginning is the most important part of the work.", "จุดเริ่มต้นคือส่วนที่สำคัญที่สุดของงาน", "Plato"],
    ["The roots of education are bitter, but the fruit is sweet.", "รากของการศึกษานั้นขม แต่ผลของมันหวาน", "Aristotle"],
    ["Man is by nature a political animal.", "มนุษย์โดยธรรมชาติเป็นสัตว์สังคม", "Aristotle"],
    ["The way up and the way down are one and the same.", "ทางขึ้นกับทางลงคือทางเดียวกัน", "Heraclitus"],
    ["Nature loves to hide.", "ธรรมชาติชอบซ่อนตัว", "Heraclitus"],
    ["Of all the things wisdom provides for a happy life, by far the greatest is friendship.", "ในบรรดาสิ่งที่ปัญญามอบให้เพื่อชีวิตที่สุข มิตรภาพยิ่งใหญ่ที่สุด", "Epicurus"],
    ["I am a citizen of the world.", "ข้าคือพลเมืองของโลก", "Diogenes of Sinope"],
    ["Governing a large country is like cooking a small fish.", "ปกครองประเทศใหญ่ เหมือนทอดปลาตัวเล็ก (อย่าพลิกบ่อย)", "Lao Tzu"],
    ["The perfect man uses his mind like a mirror.", "ผู้บรรลุใช้ใจดั่งกระจก สะท้อนแต่ไม่ยึดถือ", "Zhuangzi"],
    ["To learn and at due times to repeat what one has learnt, is that not after all a pleasure?", "ได้เรียนรู้และหมั่นทบทวนอยู่เสมอ มิใช่ความสุขหรอกหรือ", "Confucius"],
    ["To see what is right and not to do it is want of courage.", "รู้ว่าอะไรถูกแต่ไม่ทำ คือความขาดความกล้า", "Confucius"],
    ["Learning continues until death and only then does it cease.", "การเรียนรู้ดำเนินไปจนตาย แล้วจึงหยุด", "Xunzi"],
    ["Supreme excellence consists in breaking the enemy's resistance without fighting.", "ยอดแห่งความเป็นเลิศ คือชนะโดยไม่ต้องรบ", "Sun Tzu"],
    ["As a solid rock is not shaken by the wind, so the wise are not moved by praise or blame.", "ดั่งภูผาไม่สะเทือนเพราะลม บัณฑิตไม่หวั่นไหวเพราะคำสรรเสริญหรือนินทา", "The Buddha"],
    ["Not to do any evil, to cultivate good, to purify one's mind: this is the teaching of the Buddhas.", "ไม่ทำชั่ว ทำความดีให้ถึงพร้อม ทำจิตให้ผ่องใส นี่คือคำสอนของพระพุทธเจ้า", "The Buddha"],
    ["If something can be remedied, why be unhappy? If it cannot, what use is being unhappy?", "ถ้าแก้ได้จะทุกข์ไปทำไม ถ้าแก้ไม่ได้ ทุกข์ไปก็ไร้ประโยชน์", "Shantideva"],
    ["The nail that sticks out gets hammered down.", "ตะปูที่โผล่ออกมาย่อมถูกตอก", "Japanese proverb"],
    ["Think lightly of yourself and deeply of the world.", "คิดถึงตัวเองให้น้อย คิดถึงโลกให้ลึก", "Miyamoto Musashi"],
    ["Do not seek to follow in the footsteps of the wise; seek what they sought.", "อย่าเดินตามรอยเท้าปราชญ์ แต่จงแสวงหาสิ่งที่ท่านแสวงหา", "Bashō"],
    ["Each man bears the entire form of the human condition.", "มนุษย์แต่ละคนแบกรูปแบบทั้งหมดของความเป็นมนุษย์ไว้", "Montaigne"],
    ["All of humanity's problems stem from man's inability to sit quietly in a room alone.", "ปัญหาทั้งหมดของมนุษย์ มาจากการนั่งเงียบๆ คนเดียวในห้องไม่ได้", "Pascal"],
    ["We must cultivate our garden.", "เราต้องดูแลสวนของเราเอง", "Voltaire"],
    ["Become who you are.", "จงเป็นในสิ่งที่เธอเป็น", "Nietzsche"],
    ["There are no facts, only interpretations.", "ไม่มีข้อเท็จจริง มีแต่การตีความ", "Nietzsche"],
    ["Talent hits a target no one else can hit; genius hits a target no one else can see.", "พรสวรรค์ยิงถูกเป้าที่คนอื่นยิงไม่ถึง อัจฉริยะยิงถูกเป้าที่คนอื่นมองไม่เห็น", "Schopenhauer"],
    ["Well done is better than well said.", "ทำได้ดี ดีกว่าพูดได้ดี", "Benjamin Franklin"],
    ["The struggle itself toward the heights is enough to fill a man's heart.", "การดิ้นรนสู่ยอดเขา เพียงเท่านั้นก็เติมเต็มหัวใจมนุษย์ได้", "Camus"],
    ["The starry heavens above me and the moral law within me.", "ฟ้าเต็มดาวเหนือศีรษะ และกฎศีลธรรมในใจ", "Kant"],
    ["Rather than love, than money, than fame, give me truth.", "มากกว่าความรัก เงินทอง หรือชื่อเสียง ขอความจริงให้ข้า", "Thoreau"],
    ["Whereof one cannot speak, thereof one must be silent.", "สิ่งใดพูดไม่ได้ ก็จงนิ่งเงียบเสีย", "Wittgenstein"],
    ["You have a right to your actions, but never to the fruits of action.", "เรามีสิทธิ์ในการกระทำ แต่ไม่มีสิทธิ์ในผลของการกระทำ", "Bhagavad Gita"],
    ["Man is born free, and everywhere he is in chains.", "มนุษย์เกิดมาเสรี แต่ทุกหนแห่งกลับถูกพันธนาการ", "Rousseau"],
    ["Knowledge is power.", "ความรู้คือพลัง", "Francis Bacon"],
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
