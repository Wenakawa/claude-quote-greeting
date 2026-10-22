// ==UserScript==
// @name         Claude Quote Greeting
// @namespace    niw
// @version      1.2.0
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
    ["We suffer more often in imagination than in reality.", "เราทุกข์ในจินตนาการบ่อยกว่าในความจริง", "Seneca"],
    ["Difficulties strengthen the mind, as labor does the body.", "ความยากลำบากฝึกจิต เหมือนงานหนักฝึกกาย", "Seneca"],
    ["While we wait for life, life passes.", "ระหว่างที่เรารอจะใช้ชีวิต ชีวิตก็ผ่านไป", "Seneca"],
    ["Begin at once to live.", "เริ่มใช้ชีวิตเสียตั้งแต่ตอนนี้", "Seneca"],
    ["It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.", "ไม่ใช่เพราะยากเราจึงไม่กล้า แต่เพราะไม่กล้ามันจึงยาก", "Seneca"],
    ["Waste no more time arguing what a good man should be. Be one.", "เลิกเถียงว่าคนดีควรเป็นแบบไหน แล้วเป็นซะ", "Marcus Aurelius"],
    ["You have power over your mind, not outside events. Realize this, and you will find strength.", "เราคุมใจตัวเองได้ ไม่ใช่เหตุการณ์ภายนอก รู้แบบนี้แล้วจะเข้มแข็ง", "Marcus Aurelius"],
    ["The happiness of your life depends upon the quality of your thoughts.", "ความสุขของชีวิตขึ้นกับคุณภาพของความคิด", "Marcus Aurelius"],
    ["Very little is needed to make a happy life.", "ชีวิตที่มีความสุข ต้องการเพียงเล็กน้อย", "Marcus Aurelius"],
    ["First say to yourself what you would be; then do what you have to do.", "ตั้งก่อนว่าจะเป็นอะไร แล้วลงมือทำสิ่งที่ต้องทำ", "Epictetus"],
    ["Wealth consists not in having great possessions, but in having few wants.", "ความร่ำรวยไม่ใช่การมีมาก แต่คือการอยากน้อย", "Epictetus"],
    ["No man is free who is not master of himself.", "ไม่มีใครเป็นอิสระ ถ้ายังเป็นนายตัวเองไม่ได้", "Epictetus"],
    ["The unexamined life is not worth living.", "ชีวิตที่ไม่เคยตั้งคำถาม ไม่คุ้มค่าที่จะอยู่", "Socrates"],
    ["The only true wisdom is in knowing you know nothing.", "ปัญญาแท้ คือรู้ว่าตัวเองไม่รู้", "Socrates"],
    ["Know thyself.", "จงรู้จักตนเอง", "Delphic maxim"],
    ["Well begun is half done.", "เริ่มต้นดี เท่ากับสำเร็จไปครึ่งหนึ่ง", "Aristotle"],
    ["Happiness depends upon ourselves.", "ความสุขขึ้นอยู่กับตัวเราเอง", "Aristotle"],
    ["We are what we repeatedly do.", "เราคือสิ่งที่เราทำซ้ำๆ", "Will Durant, on Aristotle"],
    ["No man ever steps in the same river twice.", "ไม่มีใครก้าวลงแม่น้ำสายเดิมได้สองครั้ง", "Heraclitus"],
    ["Change is the only constant in life.", "สิ่งเดียวที่ไม่เปลี่ยนคือการเปลี่ยนแปลง", "Heraclitus"],
    ["A journey of a thousand miles begins with a single step.", "การเดินทางพันลี้ เริ่มจากก้าวแรก", "Lao Tzu"],
    ["Knowing others is intelligence; knowing yourself is true wisdom.", "รู้จักผู้อื่นคือฉลาด รู้จักตนเองคือปัญญาแท้", "Lao Tzu"],
    ["Nature does not hurry, yet everything is accomplished.", "ธรรมชาติไม่เคยรีบ แต่ทุกอย่างก็สำเร็จ", "Lao Tzu"],
    ["Real knowledge is to know the extent of one's ignorance.", "รู้จริง คือรู้ว่าตัวเองไม่รู้อะไรบ้าง", "Confucius"],
    ["It does not matter how slowly you go as long as you do not stop.", "ช้าแค่ไหนไม่สำคัญ ขอแค่อย่าหยุด", "Confucius"],
    ["The superior man is modest in his speech, but exceeds in his actions.", "วิญญูชนพูดน้อย แต่ทำมากกว่าที่พูด", "Confucius"],
    ["One is one's own refuge.", "ตนแลเป็นที่พึ่งแห่งตน", "The Buddha"],
    ["Hatred is never appeased by hatred; it is appeased by non-hatred alone.", "เวรย่อมไม่ระงับด้วยการจองเวร แต่ระงับด้วยการไม่จองเวร", "The Buddha"],
    ["He who has a why to live can bear almost any how.", "คนที่รู้ว่าอยู่เพื่ออะไร จะทนได้แทบทุกอย่าง", "Nietzsche"],
    ["That which does not kill us makes us stronger.", "สิ่งที่ไม่ฆ่าเรา จะทำให้เราแข็งแกร่งขึ้น", "Nietzsche"],
    ["Amor fati.", "จงรักชะตาของตน", "Nietzsche"],
    ["Life can only be understood backwards; but it must be lived forwards.", "ชีวิตเข้าใจได้เมื่อมองย้อน แต่ต้องใช้ไปข้างหน้า", "Kierkegaard"],
    ["I think, therefore I am.", "ฉันคิด ฉันจึงมีอยู่", "Descartes"],
    ["Man is condemned to be free.", "มนุษย์ถูกสาปให้มีเสรีภาพ", "Sartre"],
    ["One must imagine Sisyphus happy.", "เราต้องจินตนาการว่าซิซิฟัสมีความสุข", "Camus"],
    ["Sapere aude.", "จงกล้าที่จะรู้ (และใช้ความคิดของตนเอง)", "Kant, after Horace"],
    ["Memento mori.", "จงระลึกว่าวันหนึ่งเราต้องตาย", "Stoic maxim"],
    ["Festina lente.", "รีบอย่างช้าๆ", "Augustus"],
    ["Ichigo ichie.", "หนึ่งครั้ง หนึ่งพบพาน ทุกช่วงเวลาไม่ย้อนกลับมา", "Japanese tea ceremony"],
    ["Fall seven times, stand up eight.", "ล้มเจ็ดครั้ง ลุกแปดครั้ง", "Japanese proverb"],
    ["The best time to plant a tree was 20 years ago. The second best time is now.", "เวลาดีที่สุดที่จะปลูกต้นไม้คือ 20 ปีก่อน รองลงมาคือตอนนี้", "Chinese proverb"],
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
      const t = el.textContent.trim();
      if (t.length < 60 && /นิว$/.test(t)) el.setAttribute(MARK, text);
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
