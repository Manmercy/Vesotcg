# VERSO Prototype — Version 1.6

เว็บไซต์ต้นแบบ VERSO ที่เปิดได้โดยตรง และพร้อมอัปโหลดขึ้น GitHub Pages โดยไม่ต้อง Build หรือติดตั้งโปรแกรมเพิ่มเติม

## สิ่งที่ปรับใน V1.6

- ปรับ Activity Feed ตาม Flow แบบ Strava: ผู้เล่น → เรื่องราว → Stats → Achievement → ภาพ → Social actions
- ใช้ข้อมูล Activity ชุดเดียวกันสร้างทั้ง Feed และ Detail ทำให้ชื่อ ภาพ Score เกม และสถานที่ตรงกันทุกใบ
- เพิ่มภาพใหม่สำหรับ Manny × Poom, Fern × Aim, Nook Binder และ Bam Community Night โดยตัดแบบ Cover ไม่บีบภาพ
- ขยาย Final Score และ Activity Stats ให้เด่นแบบ V1 พร้อมกลับมาใช้สีไฟ สีชมพู ป้าย Sticker และ Passport Stamp ตาม DNA ของ VERSO
- แก้ผู้โพสต์กิจกรรม Community เป็น Bam N. และให้รูปตรงกับบุคคล
- Badge Post แสดง Badge เดียวกลางการ์ด พร้อม Aura, ประกาย และการลอยแบบ Premium
- คลิกภาพหรือปุ่ม View Activity เพื่อเปิด Detail ได้ทุกใบ และ Desktop ปิดได้ด้วยปุ่มกากบาทหรือคลิกพื้นที่ด้านนอก
- Record Match สร้าง Activity Card จาก Template เดียวกับ Feed ได้จริง
- คง Passport เป็นเมนูหลัก และเก็บ Deck ไว้ใน Profile และ Match Session ที่สัมพันธ์กัน

## ดูเว็บไซต์บนเครื่อง

เปิดไฟล์ `index.html` ด้วยเว็บเบราว์เซอร์

## นำขึ้น GitHub Pages

1. สร้าง Repository ใหม่ใน GitHub
2. อัปโหลดไฟล์และโฟลเดอร์ทั้งหมดในโฟลเดอร์นี้ไว้ที่ระดับบนสุดของ Repository
3. เปิด `Settings` → `Pages`
4. เลือก `Deploy from a branch`
5. เลือก Branch `main` และ Folder `/ (root)` แล้วกด `Save`

## โครงสร้าง

- `index.html` — หน้าเว็บไซต์และ Activity Feed
- `app.js` — ข้อมูลจำลอง Navigation, Activity Detail และ Interaction
- `app/globals.css` — Brand styling, Animation และ Responsive layout
- `public/assets` — Logo, Mascot, Profile, Badge และ Activity imagery
