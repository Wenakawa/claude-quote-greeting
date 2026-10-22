# claude-quote-greeting

Tampermonkey userscript ที่แทนคำทักทายหน้าแรก claude.ai ด้วยคำคม/ปรัชญา (อังกฤษ + ความหมายไทย)

- **ติดตั้ง:** เปิด [claude-quote-greeting.user.js (raw)](https://raw.githubusercontent.com/Wenakawa/claude-quote-greeting/main/claude-quote-greeting.user.js) แล้วกด Install ใน Tampermonkey
- **อัปเดต:** scheduled task ของ Claude เปลี่ยนชุดคำคมทุกวันจันทร์ และขยับ `@version` → Tampermonkey ดึงเวอร์ชันใหม่เอง
- **กันซ้ำ:** คำคมที่ใช้แล้วจดไว้ใน `quotes-history.md`
- **แก้เอง:** แก้เฉพาะบล็อกระหว่าง `QUOTES-START` กับ `QUOTES-END`
