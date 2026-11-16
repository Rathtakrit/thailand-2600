export type Lang = "en" | "th";
export type CritKey = "impact" | "feasible" | "equity" | "sustain" | "evidence" | "hope";

/** [key, English, Thai] */
export const CATS: [string, string, string][] = [
  ["edu", "Education", "การศึกษา"],
  ["health", "Health", "สุขภาพ"],
  ["env", "Environment", "สิ่งแวดล้อม"],
  ["econ", "Economy and work", "เศรษฐกิจและงาน"],
  ["city", "Cities and transport", "เมืองและการเดินทาง"],
  ["gov", "Government", "รัฐและความโปร่งใส"],
  ["farm", "Farming", "เกษตร"],
  ["society", "Society and ageing", "สังคมและผู้สูงวัย"],
];

export const REGIONS: [string, string, string][] = [
  ["all", "Nationwide", "ทั่วประเทศ"],
  ["north", "North", "ภาคเหนือ"],
  ["isan", "Isan", "ภาคอีสาน"],
  ["central", "Central", "ภาคกลาง"],
  ["bkk", "Bangkok", "กรุงเทพฯ"],
  ["east", "East", "ภาคตะวันออก"],
  ["west", "West", "ภาคตะวันตก"],
  ["south", "South", "ภาคใต้"],
];

/** Stylised dot map of Thailand; each letter is one dot in a region. */
export const MAP = [
  "...N..........", "..NNN.........", ".NNNNN........", ".NNNNNN..I....", ".NNNNNN.III...", "..NNNNNIIIII..",
  "..NNNNIIIIIII.", "..WNNCIIIIIII.", "..WCCCIIIIIII.", "..WCCCCIIIII..", "..WWCCCEE.....", "..WWCBCEE.....",
  "..WW..EEE.....", "..WW...EE.....", "..WS..........", "..SS..........", "..SS..........", ".SS...........",
  ".SS...........", ".SSS..........", "SSSS..........", "S.SSS.........", "..SSSS........", "...SSS........", "....SS........",
];
export const RKEY: Record<string, string> = { N: "north", I: "isan", C: "central", B: "bkk", E: "east", W: "west", S: "south" };

export const CRITERIA: { k: CritKey; en: string; th: string; den: string; dth: string }[] = [
  { k: "impact", en: "Impact", th: "ผลกระทบ", den: "How much better does life get, and for how many people?", dth: "ชีวิตดีขึ้นแค่ไหน และดีขึ้นกับคนจำนวนเท่าใด" },
  { k: "feasible", en: "Feasibility", th: "ความเป็นไปได้", den: "Is there a believable path from today to 2600, with budget, technology and institutions Thailand has or could build?", dth: "มีเส้นทางที่เชื่อได้จากวันนี้ถึงปี 2600 หรือไม่ ด้วยงบประมาณ เทคโนโลยี และกลไกรัฐที่ไทยมีหรือสร้างได้" },
  { k: "equity", en: "Fairness", th: "ความเป็นธรรม", den: "Does it reach people outside Bangkok, people with low incomes, the old and the left out?", dth: "เข้าถึงคนต่างจังหวัด คนรายได้น้อย ผู้สูงอายุ และคนที่ถูกมองข้ามหรือไม่" },
  { k: "sustain", en: "Sustainability", th: "ความยั่งยืน", den: "Will it still work in 30 years, for the land, the water and the public budget?", dth: "อีก 30 ปียังไปต่อได้ไหม ทั้งต่อดิน น้ำ อากาศ และการคลังของประเทศ" },
  { k: "evidence", en: "Evidence", th: "หลักฐาน", den: "Is it backed by data, a pilot, or a place where it has already worked?", dth: "มีข้อมูล โครงการนำร่อง หรือพื้นที่ที่เคยทำสำเร็จรองรับหรือไม่" },
  { k: "hope", en: "Imagination", th: "จินตนาการ", den: "Does it widen what people believe Thailand can become?", dth: "ทำให้คนเชื่อว่าประเทศไทยเป็นได้มากกว่าที่เป็นอยู่หรือไม่" },
];

export const label = (list: [string, string, string][], key: string, lang: Lang) => {
  const row = list.find((r) => r[0] === key);
  return row ? (lang === "th" ? row[2] : row[1]) : key;
};

const en = {
  tabProblems: "Problems", propose: "Name a problem", signIn: "Sign in", signOut: "Sign out", howBtn: "How judging works",
  h1: "What should Thailand be like in 2600?",
  lede: "Name a problem you see. Pitch a way to fix it. Every pitch is judged in the open on six criteria, first by an AI judge, then by people.",
  quote: "“Thailand 2600 encourages everyone to propose the solution they believe would solve the problem by 2600.”",
  stYears: "years until B.E. 2600", stProblems: "problems named", stPitches: "solutions pitched",
  listAll: "Problems people see", listIn: "Problems in", allCats: "All topics", apply: "Apply",
  sortNew: "Newest", sortSeen: "Most people see it", sortSol: "Most solutions",
  emptyF: "Nothing here matches this filter.", clear: "Show everything",
  mSol: "solutions", mSeen: "see it too",
  howTitle: "How it works", s1t: "Name a problem", s1: "Say what is wrong, where, and who it hurts. You do not need a solution.",
  s2t: "Pitch a solution", s2: "Answer with the plan you believe would solve it by 2600: what to do, who pays, and why it would work.",
  s3t: "Face the judge", s3: "The AI judge scores each pitch 0 to 10 on six criteria, on the 2600 horizon, and states its strongest objection. Then people adjust the score. The AI counts as three votes; each person counts as one.",
  critTitle: "The six criteria",
  back: "← All problems", seeToo: "I see this too", seen: "You see this too", pitchBtn: "Pitch a solution",
  solsT: "Solutions", noSols: "No one has pitched a solution yet. Yours would be the first.",
  by: "by", someone: "Someone", example: "Example", remove: "Remove",
  dpTitle: "Name a problem", dpName: "The problem, in one line", dpBody: "What is wrong, where, and who it hurts", fCat: "Topic", fRegion: "Where", dpSubmit: "Post the problem",
  dsHint: "Propose the solution you believe would solve this by 2600. Say what you would do, who pays, and what shows it would work.",
  dsName: "Your solution, in one line", dsBody: "The plan", dsSubmit: "Submit to the judge",
  like: "Like", liked: "Liked", comments: "Comments", cPh: "Add a comment", cSend: "Comment",
  needSignIn: "Sign in to post, like and comment.",
  siTitle: "Sign in to Thailand 2600", siLede: "One tap with an account you already have. We store your display name and picture, nothing else.",
  siLine: "Continue with LINE", siGoogle: "Continue with Google", siNotSet: "not set up yet",
  siDev: "Local test account", siDevHint: "Only on this computer, for testing. It does not exist on the public site.", siDevName: "Display name", siDevGo: "Enter",
  outOf: "/ 60", notJudged: "Not judged yet", judging: "The AI judge is reading…", judgeFailed: "The AI judge could not finish.", judgeRefused: "The AI judge declined to score this pitch as written.", judgeOff: "The AI judge is not switched on yet.",
  askAi: "Ask the AI judge", adjust: "Adjust the score", adjusted: "Change my scores", saveScores: "Save my scores",
  drHint: "Score each criterion from 0 to 10. Your scores count as one vote; the AI judge counts as three.",
  aiOnly: "AI judge only", aiPlus: "AI judge + people:", peopleOnly: "People only, no AI verdict:",
  objection: "Strongest objection", improve: "What would raise the score", vision: "A day in 2600 if this works", ai: "AI",
  trTo: "Translate to English", showOrig: "Show original", showTr: "Show translation", limitHit: "You have reached today's limit for this. Try again tomorrow.",
  picLabel: "Show it (optional)", picHint: "Draw your solution, or add a photo, sketch or diagram (PNG, JPEG or WebP). You can draw on top of a picture.", picChoose: "Choose a picture", picChange: "Choose another", picRemove: "Remove picture",
  picUploading: "Uploading…", picErrType: "That file is not a picture we can read. Use a PNG, JPEG or WebP.", picErrBig: "That picture is too big even after shrinking. Try another one.", picErrLimit: "You have uploaded the most files allowed for today. Try again tomorrow.", picErrFail: "The picture did not upload. Check your connection and try again.", picAlt: "Picture for the solution:",
  drawBtn: "Draw it", drawOn: "Draw on this picture", drawHint: "Draw with your finger or mouse. Press \"Use this drawing\" when you are done.", drawUndo: "Undo", drawClear: "Clear", drawDone: "Use this drawing", drawCancel: "Cancel", drawColour: "Colour", drawShade: "Dark to light", drawSize: "Line thickness",
  modelLabel: "Add a 3D model (optional)", modelHint: "A .glb file up to 10 MB. Visitors can turn it around.", modelChoose: "Choose a 3D model", modelChange: "Choose another model", modelRemove: "Remove model",
  modelErrType: "That file is not a .glb 3D model. Export your model as .glb and try again.", modelErrBig: "That model is over 10 MB. Export a smaller or simpler one.", modelRotate: "Drag to turn it. Pinch or scroll to zoom.", modelLoading: "Loading the 3D model…", modelAlt: "3D model for the solution:",
  tabVisuals: "Visualized solutions", visHead: "Visualized solutions", visLede: "Every solution that comes with a drawing, a picture or a 3D model. Open one to read the pitch and its verdict.", visEmpty: "No visualized solutions yet. Pitch a solution and draw it.",
  forProblem: "For", likesWord: "likes", visModelOnly: "3D model. Open to turn it around.", visHas3d: "3D",
  notFound: "This problem is no longer here.",
};

const th: typeof en = {
  tabProblems: "ปัญหา", propose: "เสนอปัญหา", signIn: "เข้าสู่ระบบ", signOut: "ออกจากระบบ", howBtn: "ตัดสินกันอย่างไร",
  h1: "ประเทศไทยปี 2600 ควรเป็นอย่างไร",
  lede: "เห็นปัญหาอะไร บอกได้เลย ใครมีทางแก้ เสนอได้ทันที ทุกข้อเสนอถูกตัดสินอย่างเปิดเผยด้วยเกณฑ์ 6 ข้อ เริ่มจากกรรมการ AI แล้วให้ทุกคนช่วยปรับคะแนน",
  quote: "“Thailand 2600 ชวนทุกคนเสนอทางแก้ที่ตนเชื่อว่าจะแก้ปัญหานั้นได้ภายในปี 2600”",
  stYears: "ปี ก่อนถึง พ.ศ. 2600", stProblems: "ปัญหาที่ถูกเสนอ", stPitches: "ทางแก้ที่ถูกเสนอ",
  listAll: "ปัญหาที่ผู้คนมองเห็น", listIn: "ปัญหาใน", allCats: "ทุกหัวข้อ", apply: "ใช้ตัวกรอง",
  sortNew: "ล่าสุด", sortSeen: "คนเห็นด้วยมากที่สุด", sortSol: "มีทางแก้มากที่สุด",
  emptyF: "ไม่มีปัญหาที่ตรงกับตัวกรองนี้", clear: "ดูทั้งหมด",
  mSol: "ทางแก้", mSeen: "คนเห็นด้วย",
  howTitle: "ทำงานอย่างไร", s1t: "เสนอปัญหา", s1: "บอกว่าอะไรผิดปกติ เกิดที่ไหน และใครเดือดร้อน ไม่จำเป็นต้องมีทางแก้",
  s2t: "เสนอทางแก้", s2: "ตอบด้วยแผนที่คุณเชื่อว่าจะแก้ปัญหาได้ภายในปี 2600 ว่าจะทำอะไร ใครจ่าย และทำไมจึงได้ผล",
  s3t: "เผชิญหน้ากรรมการ", s3: "กรรมการ AI ให้คะแนนแต่ละข้อเสนอ 0 ถึง 10 ตามเกณฑ์ 6 ข้อ โดยมองไปถึงปี 2600 พร้อมข้อโต้แย้งที่หนักที่สุด จากนั้นทุกคนปรับคะแนนได้ AI นับเป็น 3 เสียง คนหนึ่งคนนับเป็น 1 เสียง",
  critTitle: "เกณฑ์ 6 ข้อ",
  back: "← ปัญหาทั้งหมด", seeToo: "ฉันก็เห็นปัญหานี้", seen: "คุณเห็นปัญหานี้ด้วย", pitchBtn: "เสนอทางแก้",
  solsT: "ทางแก้", noSols: "ยังไม่มีใครเสนอทางแก้ ของคุณจะเป็นข้อเสนอแรก",
  by: "โดย", someone: "ผู้ใช้", example: "ตัวอย่าง", remove: "ลบ",
  dpTitle: "เสนอปัญหา", dpName: "ปัญหาในหนึ่งบรรทัด", dpBody: "อะไรผิดปกติ เกิดที่ไหน และใครเดือดร้อน", fCat: "หัวข้อ", fRegion: "พื้นที่", dpSubmit: "โพสต์ปัญหา",
  dsHint: "เสนอทางแก้ที่คุณเชื่อว่าจะแก้ปัญหานี้ได้ภายในปี 2600 บอกให้ชัดว่าจะทำอะไร ใครจ่าย และมีอะไรยืนยันว่าได้ผล",
  dsName: "ทางแก้ของคุณในหนึ่งบรรทัด", dsBody: "แผน", dsSubmit: "ส่งให้กรรมการ",
  like: "ถูกใจ", liked: "ถูกใจแล้ว", comments: "ความคิดเห็น", cPh: "เขียนความคิดเห็น", cSend: "ส่ง",
  needSignIn: "เข้าสู่ระบบเพื่อโพสต์ ถูกใจ และแสดงความคิดเห็น",
  siTitle: "เข้าสู่ระบบ Thailand 2600", siLede: "แตะครั้งเดียวด้วยบัญชีที่คุณมีอยู่แล้ว เราเก็บเพียงชื่อที่แสดงและรูปโปรไฟล์ของคุณ",
  siLine: "เข้าสู่ระบบด้วย LINE", siGoogle: "เข้าสู่ระบบด้วย Google", siNotSet: "ยังไม่ได้ตั้งค่า",
  siDev: "บัญชีทดสอบในเครื่อง", siDevHint: "ใช้ได้เฉพาะในคอมพิวเตอร์เครื่องนี้เพื่อทดสอบ ไม่มีบนเว็บไซต์จริง", siDevName: "ชื่อที่แสดง", siDevGo: "เข้าใช้",
  outOf: "/ 60", notJudged: "ยังไม่ได้ตัดสิน", judging: "กรรมการ AI กำลังอ่าน…", judgeFailed: "กรรมการ AI ตัดสินไม่สำเร็จ", judgeRefused: "กรรมการ AI ไม่ให้คะแนนข้อเสนอนี้ตามที่เขียนมา", judgeOff: "ยังไม่ได้เปิดใช้กรรมการ AI",
  askAi: "ให้กรรมการ AI ตัดสิน", adjust: "ปรับคะแนน", adjusted: "แก้คะแนนของฉัน", saveScores: "บันทึกคะแนน",
  drHint: "ให้คะแนนแต่ละเกณฑ์ 0 ถึง 10 คะแนนของคุณนับเป็น 1 เสียง กรรมการ AI นับเป็น 3 เสียง",
  aiOnly: "กรรมการ AI เท่านั้น", aiPlus: "กรรมการ AI + จำนวนคน:", peopleOnly: "เฉพาะคน ยังไม่มีคำตัดสินจาก AI:",
  objection: "ข้อโต้แย้งที่หนักที่สุด", improve: "สิ่งที่จะทำให้คะแนนสูงขึ้น", vision: "หนึ่งวันในปี 2600 ถ้าสิ่งนี้สำเร็จ", ai: "AI",
  trTo: "แปลเป็นภาษาไทย", showOrig: "ดูต้นฉบับ", showTr: "ดูคำแปล", limitHit: "วันนี้คุณใช้ครบจำนวนที่กำหนดแล้ว ลองใหม่พรุ่งนี้",
  picLabel: "ทำให้เห็นภาพ (ไม่บังคับ)", picHint: "วาดทางแก้ของคุณ หรือใส่ภาพถ่าย ภาพร่าง หรือแผนผัง (PNG, JPEG หรือ WebP) แล้ววาดทับภาพได้", picChoose: "เลือกภาพ", picChange: "เลือกภาพอื่น", picRemove: "ลบภาพ",
  picUploading: "กำลังอัปโหลด…", picErrType: "อ่านไฟล์นี้เป็นภาพไม่ได้ ใช้ไฟล์ PNG, JPEG หรือ WebP", picErrBig: "ภาพนี้ใหญ่เกินไปแม้ย่อแล้ว ลองใช้ภาพอื่น", picErrLimit: "วันนี้คุณอัปโหลดครบจำนวนที่กำหนดแล้ว ลองใหม่พรุ่งนี้", picErrFail: "อัปโหลดภาพไม่สำเร็จ ตรวจการเชื่อมต่อแล้วลองอีกครั้ง", picAlt: "ภาพประกอบทางแก้:",
  drawBtn: "วาดเอง", drawOn: "วาดทับภาพนี้", drawHint: "วาดด้วยนิ้วหรือเมาส์ เสร็จแล้วกด \"ใช้ภาพวาดนี้\"", drawUndo: "ย้อนกลับ", drawClear: "ล้าง", drawDone: "ใช้ภาพวาดนี้", drawCancel: "ยกเลิก", drawColour: "สี", drawShade: "เข้มถึงอ่อน", drawSize: "ความหนาของเส้น",
  modelLabel: "ใส่โมเดล 3 มิติ (ไม่บังคับ)", modelHint: "ไฟล์ .glb ขนาดไม่เกิน 10 MB ผู้ชมหมุนดูได้รอบด้าน", modelChoose: "เลือกโมเดล 3 มิติ", modelChange: "เลือกโมเดลอื่น", modelRemove: "ลบโมเดล",
  modelErrType: "ไฟล์นี้ไม่ใช่โมเดล 3 มิติแบบ .glb ส่งออกโมเดลเป็น .glb แล้วลองอีกครั้ง", modelErrBig: "โมเดลนี้ใหญ่เกิน 10 MB ส่งออกให้เล็กหรือเรียบง่ายกว่านี้", modelRotate: "ลากเพื่อหมุน ถ่างนิ้วหรือเลื่อนเพื่อซูม", modelLoading: "กำลังโหลดโมเดล 3 มิติ…", modelAlt: "โมเดล 3 มิติของทางแก้:",
  tabVisuals: "ทางแก้แบบเห็นภาพ", visHead: "ทางแก้แบบเห็นภาพ", visLede: "ทางแก้ทุกข้อที่มีภาพวาด ภาพประกอบ หรือโมเดล 3 มิติ เปิดดูเพื่ออ่านข้อเสนอและคำตัดสิน", visEmpty: "ยังไม่มีทางแก้แบบเห็นภาพ ลองเสนอทางแก้แล้ววาดดู",
  forProblem: "สำหรับปัญหา", likesWord: "ถูกใจ", visModelOnly: "โมเดล 3 มิติ เปิดเพื่อหมุนดู", visHas3d: "3 มิติ",
  notFound: "ไม่พบปัญหานี้แล้ว",
};

export type Dict = typeof en;
export const dict = (lang: Lang): Dict => (lang === "th" ? th : en);
