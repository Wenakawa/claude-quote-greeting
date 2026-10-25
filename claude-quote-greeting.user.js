// ==UserScript==
// @name         Claude Quote Greeting
// @namespace    niw
// @version      1.3.0
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
    ["As long as you live, keep learning how to live.", "ตราบที่ยังมีชีวิต จงเรียนรู้วิธีใช้ชีวิตต่อไป", "Seneca"],
    ["He who is everywhere is nowhere.", "คนที่อยู่ทุกที่ คือคนที่ไม่ได้อยู่ที่ไหนเลย", "Seneca"],
    ["Life is long if you know how to use it.", "ชีวิตยาวพอ หากรู้จักใช้มัน", "Seneca"],
    ["The best revenge is not to be like your enemy.", "การแก้แค้นที่ดีที่สุด คือไม่เป็นอย่างศัตรู", "Marcus Aurelius"],
    ["Loss is nothing else but change, and change is Nature's delight.", "การสูญเสียคือการเปลี่ยนแปลง และการเปลี่ยนแปลงคือวิถีของธรรมชาติ", "Marcus Aurelius"],
    ["If it is not right, do not do it; if it is not true, do not say it.", "ถ้าไม่ถูกต้อง อย่าทำ ถ้าไม่จริง อย่าพูด", "Marcus Aurelius"],
    ["Men are disturbed not by things, but by the opinions about things.", "คนเราไม่ได้ทุกข์เพราะสิ่งต่างๆ แต่เพราะความคิดที่มีต่อสิ่งนั้น", "Epictetus"],
    ["Only the educated are free.", "มีแต่ผู้ที่ได้รับการศึกษาเท่านั้นที่เป็นอิสระ", "Epictetus"],
    ["Philosophy begins in wonder.", "ปรัชญาเริ่มต้นจากความสงสัยใคร่รู้", "Plato"],
    ["One swallow does not make a summer, nor one fine day.", "นกนางแอ่นตัวเดียวหรือวันฟ้าใสวันเดียว ไม่ได้ทำให้เป็นฤดูร้อน", "Aristotle"],
    ["Character is destiny.", "อุปนิสัยคือชะตากรรม", "Heraclitus"],
    ["Do not spoil what you have by desiring what you have not.", "อย่าทำลายสิ่งที่มี ด้วยการอยากได้สิ่งที่ไม่มี", "Epicurus"],
    ["Death is nothing to us.", "ความตายไม่ใช่อะไรสำหรับเรา", "Epicurus"],
    ["Those who know do not speak; those who speak do not know.", "ผู้รู้ไม่พูด ผู้พูดไม่รู้", "Lao Tzu"],
    ["He who knows he has enough is rich.", "ผู้รู้จักพอคือผู้ร่ำรวย", "Lao Tzu"],
    ["The softest thing in the world overcomes the hardest.", "สิ่งที่อ่อนที่สุดในโลก ชนะสิ่งที่แข็งที่สุด", "Lao Tzu"],
    ["The fish trap exists because of the fish; once you've gotten the fish, you can forget the trap.", "ลอบมีไว้จับปลา ได้ปลาแล้วก็ลืมลอบได้", "Zhuangzi"],
    ["Learning without thought is labor lost; thought without learning is perilous.", "เรียนโดยไม่คิดก็สูญเปล่า คิดโดยไม่เรียนก็อันตราย", "Confucius"],
    ["When you see a worthy person, think of becoming equal to them.", "เมื่อพบคนดี จงคิดจะเป็นให้ได้อย่างเขา", "Confucius"],
    ["Do not impose on others what you do not wish for yourself.", "สิ่งที่ตนไม่ปรารถนา อย่าทำแก่ผู้อื่น", "Confucius"],
    ["The great man is he who does not lose his child's heart.", "ผู้ยิ่งใหญ่คือผู้ที่ไม่สูญเสียหัวใจแบบเด็ก", "Mencius"],
    ["If you know the enemy and know yourself, you need not fear the result of a hundred battles.", "รู้เขารู้เรา รบร้อยครั้งก็ไม่ต้องหวั่น", "Sun Tzu"],
    ["Mind is the forerunner of all things.", "ใจเป็นหัวหน้า เป็นผู้นำของทุกสิ่ง", "The Buddha"],
    ["Better than a thousand hollow words is one word that brings peace.", "คำที่นำความสงบมาเพียงคำเดียว ดีกว่าคำไร้สาระนับพัน", "The Buddha"],
    ["Health is the greatest gift, contentment the greatest wealth.", "ความไม่มีโรคเป็นลาภอันประเสริฐ ความสันโดษเป็นทรัพย์อันประเสริฐ", "The Buddha"],
    ["Even monkeys fall from trees.", "ลิงยังตกต้นไม้ (ผู้เชี่ยวชาญก็พลาดได้)", "Japanese proverb"],
    ["Even dust, when piled up, becomes a mountain.", "ฝุ่นทับถมกันยังกลายเป็นภูเขา", "Japanese proverb"],
    ["Do nothing which is of no use.", "อย่าทำสิ่งที่ไร้ประโยชน์", "Miyamoto Musashi"],
    ["Anxiety is the dizziness of freedom.", "ความวิตกกังวลคืออาการเวียนหัวของอิสรภาพ", "Kierkegaard"],
    ["Without music, life would be a mistake.", "ถ้าไม่มีดนตรี ชีวิตคงเป็นความผิดพลาด", "Nietzsche"],
    ["In the depths of winter, I finally learned that within me there lay an invincible summer.", "ท่ามกลางฤดูหนาว ฉันได้รู้ว่าในตัวฉันมีฤดูร้อนที่ไม่มีวันพ่ายแพ้", "Camus"],
    ["The heart has its reasons which reason knows nothing of.", "หัวใจมีเหตุผลของมัน ที่เหตุผลไม่อาจเข้าใจ", "Pascal"],
    ["What do I know?", "ฉันรู้อะไรบ้าง?", "Montaigne"],
    ["All things excellent are as difficult as they are rare.", "สิ่งดีเลิศล้วนยากพอๆ กับที่หายาก", "Spinoza"],
    ["The best is the enemy of the good.", "ความสมบูรณ์แบบคือศัตรูของความดีพอ", "Voltaire"],
    ["Our life is frittered away by detail. Simplify, simplify.", "ชีวิตหมดไปกับรายละเอียด จงทำให้เรียบง่าย", "Thoreau"],
    ["To be great is to be misunderstood.", "การเป็นคนยิ่งใหญ่ คือการถูกเข้าใจผิด", "Emerson"],
    ["Life is short, art is long.", "ชีวิตสั้น ศิลปะยืนยาว", "Hippocrates"],
    ["Carpe diem.", "จงคว้าวันนี้ไว้", "Horace"],
    ["Per aspera ad astra.", "ผ่านความยากลำบากสู่ดวงดาว", "Latin proverb"],
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
