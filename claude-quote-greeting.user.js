// ==UserScript==
// @name         Claude Quote Greeting
// @namespace    niw
// @version      1.7.0
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
    ["Not how long, but how well you have lived is the main thing.", "สิ่งสำคัญไม่ใช่ว่าอยู่มานานเท่าไร แต่อยู่มาดีเพียงใด", "Seneca"],
    ["It is part of the cure to wish to be cured.", "ความอยากหายคือส่วนหนึ่งของการรักษา", "Seneca"],
    ["Never esteem anything as of advantage to you that will make you break your word or lose your self-respect.", "อย่าถือว่าสิ่งใดเป็นประโยชน์ หากมันทำให้เราผิดคำพูดหรือเสียความเคารพในตนเอง", "Marcus Aurelius"],
    ["How ridiculous and how strange to be surprised at anything which happens in life!", "ช่างน่าขันและแปลกนัก ที่เราประหลาดใจกับสิ่งที่เกิดขึ้นในชีวิต", "Marcus Aurelius"],
    ["It is difficulties that show what men are.", "ความยากลำบากคือสิ่งที่เผยว่าคนคนหนึ่งเป็นอย่างไร", "Epictetus"],
    ["No great thing is created suddenly.", "ไม่มีสิ่งยิ่งใหญ่ใดเกิดขึ้นในชั่วข้ามคืน", "Epictetus"],
    ["No evil can happen to a good man, either in life or after death.", "ไม่มีสิ่งชั่วร้ายใดทำอันตรายคนดีได้ ทั้งในชีวิตนี้และหลังความตาย", "Socrates"],
    ["Hope is a waking dream.", "ความหวังคือความฝันขณะตื่น", "Aristotle"],
    ["Dogs bark at every one they do not know.", "สุนัขย่อมเห่าทุกคนที่มันไม่รู้จัก", "Heraclitus"],
    ["Nothing in excess.", "อย่าให้สิ่งใดมากเกินไป", "Delphic maxim"],
    ["Call no man happy until he is dead.", "อย่าเพิ่งกล่าวว่าใครมีสุข จนกว่าเขาจะสิ้นชีวิต", "Solon"],
    ["Know thy opportunity.", "จงรู้จักจังหวะโอกาสของตน", "Pittacus of Mytilene"],
    ["Let no one be slow to seek wisdom when he is young, nor weary in the search when he has grown old.", "อย่ารีรอแสวงหาปัญญาเมื่อยังหนุ่ม และอย่าเหนื่อยหน่ายเมื่อแก่เฒ่า", "Epicurus"],
    ["Gratitude is not only the greatest of virtues, but the parent of all the others.", "ความกตัญญูไม่เพียงเป็นคุณธรรมสูงสุด แต่ยังเป็นบ่อเกิดของคุณธรรมทั้งปวง", "Cicero"],
    ["While there is life, there is hope.", "ตราบใดที่ยังมีชีวิต ก็ยังมีความหวัง", "Cicero"],
    ["We are dust and shadow.", "เราเป็นเพียงธุลีและเงา", "Horace"],
    ["Fortune favors the bold.", "โชคชะตาเข้าข้างผู้กล้า", "Virgil"],
    ["Anyone can hold the helm when the sea is calm.", "ใครๆ ก็ถือหางเสือได้เมื่อทะเลสงบ", "Publilius Syrus"],
    ["A sound mind in a sound body.", "จิตใจที่แข็งแรงอยู่ในร่างกายที่แข็งแรง", "Juvenal"],
    ["Nothing can be created out of nothing.", "ไม่มีสิ่งใดเกิดขึ้นจากความว่างเปล่า", "Lucretius"],
    ["The only certainty is that nothing is certain.", "สิ่งเดียวที่แน่นอนคือไม่มีอะไรแน่นอน", "Pliny the Elder"],
    ["A good traveler leaves no tracks.", "นักเดินทางที่ดีย่อมไม่ทิ้งรอยเท้า", "Lao Tzu"],
    ["Thirty spokes unite in one hub; it is on the empty space that the use of the wheel depends.", "ซี่ล้อสามสิบซี่รวมกันที่ดุม แต่ความว่างตรงกลางคือสิ่งที่ทำให้ล้อใช้งานได้", "Lao Tzu"],
    ["The gentleman understands what is right; the small man understands what is profitable.", "วิญญูชนเข้าใจสิ่งที่ถูกต้อง คนใจแคบเข้าใจแต่สิ่งที่ได้ประโยชน์", "Confucius"],
    ["Is it not delightful to have friends coming from distant quarters?", "มีมิตรมาเยือนจากแดนไกล ไม่น่ายินดีหรอกหรือ", "Confucius"],
    ["All things are already complete in oneself.", "สรรพสิ่งล้วนมีพร้อมอยู่แล้วในตัวเรา", "Mencius"],
    ["All conditioned things are impermanent; strive on with diligence.", "สังขารทั้งหลายไม่เที่ยง จงยังประโยชน์ให้ถึงพร้อมด้วยความไม่ประมาท", "The Buddha"],
    ["Victory breeds hatred, for the defeated live in pain.", "ชัยชนะก่อเวร เพราะผู้แพ้ย่อมอยู่เป็นทุกข์", "The Buddha"],
    ["Perceive that which cannot be seen with the eye.", "จงรับรู้สิ่งที่ตามองไม่เห็น", "Miyamoto Musashi"],
    ["After the rain, the ground hardens.", "หลังฝนตก ผืนดินย่อมแน่นขึ้น", "Japanese proverb"],
    ["Ten men, ten colors.", "สิบคนก็สิบสี", "Japanese proverb"],
    ["Before enlightenment, chop wood, carry water. After enlightenment, chop wood, carry water.", "ก่อนตรัสรู้ ผ่าฟืน หาบน้ำ หลังตรัสรู้ ก็ผ่าฟืน หาบน้ำ", "Zen saying"],
    ["Yoga is skill in action.", "โยคะคือความชำนาญในการกระทำ", "Bhagavad Gita"],
    ["All truly great thoughts are conceived while walking.", "ความคิดที่ยิ่งใหญ่จริงๆ ล้วนเกิดขึ้นระหว่างเดิน", "Nietzsche"],
    ["People demand freedom of speech as a compensation for the freedom of thought which they seldom use.", "ผู้คนเรียกร้องเสรีภาพในการพูด เพื่อชดเชยเสรีภาพในการคิดที่ตนแทบไม่เคยใช้", "Kierkegaard"],
    ["Little things console us because little things afflict us.", "เรื่องเล็กๆ ปลอบใจเราได้ เพราะเรื่องเล็กๆ ก็ทำให้เราทุกข์ได้", "Pascal"],
    ["The most certain sign of wisdom is cheerfulness.", "สัญญาณที่ชัดที่สุดของปัญญาคือความร่าเริงแจ่มใส", "Montaigne"],
    ["Common sense is not so common.", "สามัญสำนึกไม่ได้สามัญอย่างที่คิด", "Voltaire"],
    ["Existence precedes essence.", "การมีอยู่มาก่อนแก่นสาร", "Sartre"],
    ["Not until we are lost do we begin to understand ourselves.", "จนกว่าจะหลงทาง เราจึงเริ่มเข้าใจตนเอง", "Thoreau"]
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
