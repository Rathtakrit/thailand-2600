import type { Lang } from "./content";

/** The people to contact. GitHub profile links only: no personal email addresses in a public repo. */
export const CONTACTS = [
  { name: "Pincassociation", icon: "cake" as const, url: "https://github.com/Pincassociation", role: { en: "Created Thailand 2600: the idea, the design and the whole build.", th: "ผู้สร้าง Thailand 2600 ทั้งแนวคิด การออกแบบ และการพัฒนาเว็บไซต์ทั้งหมด" } },
  { name: "Rathtakrit", icon: "kiwi" as const, url: "https://github.com/Rathtakrit", role: { en: "Looks after the house rules for how the project is run.", th: "ดูแลกติกาภายในสำหรับการทำงานของโครงการ" } },
];

const en = {
  tab: "About",
  eyebrow: "About Thailand 2600",
  title: "A place to say what is wrong, and to show how it could be put right.",
  whatHead: "What is Thailand 2600?",
  what: [
    "Thailand 2600 is a public place where anyone can name a problem they see in Thailand, and anyone can answer with a way to fix it by B.E. 2600. That is about 30 years from now: long enough to change big things, close enough that most of us will live in it.",
    "A solution is a pitch. You can write it, draw it, add a picture, or add a 3D model that people can turn around. Each pitch is scored on six criteria. An AI judge gives the first score, then people adjust it, and every score is shown in the open.",
    "It is not a place for predictions. We don't ask what will happen. We ask what should happen, and who has an idea for getting there.",
  ],
  goalsHead: "Our goals",
  goals: [
    ["Make problems easy to say", "A broken footpath, a school with no teacher, smoke every dry season. If you see it, you can name it here in a few lines."],
    ["Turn complaints into pitches", "Every problem is an open invitation. The answer to \"someone should fix this\" is a pitch anyone can make."],
    ["Judge ideas fairly, in the open", "The same six criteria for every pitch, with the reasons shown. No idea wins because of who posted it."],
    ["Help people picture a better life", "A drawing or a model lets others see the idea, not only read it. We want people to leave with a little more hope for the country."],
  ],
  criteriaLead: "The six criteria:",
  stopHead: "What's stopping us",
  stopLede: "Hope is hard to hold on to, and we want to be honest about why. These are the things, in Thailand and in the world, that make it difficult to believe life can get better.",
  stops: [
    ["The problems feel too big for one person", "The smoke comes back every dry season. The floods come back every rainy season. When the same thing returns year after year, it is easy to decide that nothing will ever change."],
    ["Speaking up feels like it goes nowhere", "People do say what is wrong, mostly online. A few days later it is forgotten. With nowhere for an idea to be answered, many stop saying anything."],
    ["Getting through this month comes first", "When prices and debt are a daily worry, there is little room left to think about a life thirty years away."],
    ["Where you are born still decides too much", "Good schools, hospitals and jobs sit closer to some people than to others. A future that only arrives in the big city does not feel like yours."],
    ["Many believe the future is somewhere else", "Young people talk about leaving. The country is growing older. It is hard to plan for a place you are not sure you will stay in."],
    ["The world is changing faster than our plans", "Hotter years, new technology, work that may not exist tomorrow. Bad news travels fast, and good ideas are quiet beside it."],
  ],
  stopEnd: "None of this is a reason to stop. It is the reason this site exists.",
  contactHead: "Want to help, or work with us?",
  contactLede: "Are you a teacher, student, researcher, funder or policymaker? Or do you just have a problem you want solved? Get in touch.",
  contactOn: "on GitHub",
  feedback: "Feedback",
  feedbackSoon: "A feedback form is coming soon. Until then, reach us on GitHub.",
};

const th: typeof en = {
  tab: "เกี่ยวกับ",
  eyebrow: "เกี่ยวกับ Thailand 2600",
  title: "พื้นที่สำหรับบอกว่าอะไรคือปัญหา และแสดงให้เห็นว่าจะแก้ได้อย่างไร",
  whatHead: "Thailand 2600 คืออะไร",
  what: [
    "Thailand 2600 คือพื้นที่สาธารณะที่ใครก็สามารถบอกปัญหาที่ตัวเองเห็นในประเทศไทย และใครก็สามารถเสนอวิธีแก้ให้สำเร็จภายใน พ.ศ. 2600 ได้ นั่นคืออีกราว 30 ปีข้างหน้า นานพอที่จะเปลี่ยนเรื่องใหญ่ และใกล้พอที่พวกเราส่วนใหญ่จะได้อยู่เห็น",
    "ทางแก้แต่ละข้อคือการนำเสนอ คุณจะเขียน วาดภาพ แนบรูป หรือแนบโมเดล 3 มิติที่หมุนดูได้ก็ได้ ทุกข้อเสนอจะได้คะแนนตามเกณฑ์ 6 ข้อ กรรมการ AI ให้คะแนนก่อน จากนั้นผู้คนช่วยปรับคะแนน และทุกคะแนนเปิดให้ทุกคนเห็น",
    "ที่นี่ไม่ใช่ที่สำหรับการทำนาย เราไม่ได้ถามว่าอะไรจะเกิดขึ้น เราถามว่าอะไรควรเกิดขึ้น และใครมีไอเดียที่จะพาเราไปถึงตรงนั้น",
  ],
  goalsHead: "เป้าหมายของเรา",
  goals: [
    ["ทำให้การบอกปัญหาเป็นเรื่องง่าย", "ทางเท้าพัง โรงเรียนไม่มีครู ควันทุกหน้าแล้ง ถ้าคุณเห็น คุณบอกได้ที่นี่ในไม่กี่บรรทัด"],
    ["เปลี่ยนเสียงบ่นให้เป็นข้อเสนอ", "ทุกปัญหาคือคำเชิญ คำตอบของประโยค “น่าจะมีใครแก้เรื่องนี้” คือข้อเสนอที่ใครก็ทำได้"],
    ["ตัดสินไอเดียอย่างเป็นธรรมและเปิดเผย", "ใช้เกณฑ์ 6 ข้อเดียวกันกับทุกข้อเสนอ พร้อมแสดงเหตุผล ไม่มีไอเดียใดชนะเพราะคนโพสต์เป็นใคร"],
    ["ช่วยให้ผู้คนเห็นภาพชีวิตที่ดีกว่า", "ภาพวาดหรือโมเดลช่วยให้คนอื่นเห็นไอเดีย ไม่ใช่แค่ได้อ่าน เราอยากให้ทุกคนกลับออกไปพร้อมความหวังต่อประเทศมากขึ้นอีกนิด"],
  ],
  criteriaLead: "เกณฑ์ 6 ข้อ:",
  stopHead: "อะไรที่ยังขวางเราอยู่",
  stopLede: "ความหวังเป็นสิ่งที่รักษาไว้ได้ยาก และเราอยากพูดตรง ๆ ว่าเพราะอะไร นี่คือสิ่งที่เกิดขึ้นในประเทศไทยและในโลก ที่ทำให้ยากจะเชื่อว่าชีวิตจะดีขึ้นได้",
  stops: [
    ["ปัญหาดูใหญ่เกินกว่าคนคนเดียว", "ควันกลับมาทุกหน้าแล้ง น้ำท่วมกลับมาทุกหน้าฝน เมื่อเรื่องเดิมวนกลับมาปีแล้วปีเล่า ก็ง่ายที่จะคิดว่าไม่มีอะไรเปลี่ยนได้"],
    ["พูดไปก็เหมือนไม่มีใครได้ยิน", "ผู้คนบอกว่าอะไรคือปัญหาอยู่แล้ว ส่วนใหญ่ในโลกออนไลน์ แต่ไม่กี่วันก็ถูกลืม เมื่อไม่มีที่ที่ไอเดียจะได้รับคำตอบ หลายคนจึงเลิกพูด"],
    ["ต้องเอาตัวรอดเดือนนี้ให้ได้ก่อน", "เมื่อค่าครองชีพและหนี้สินเป็นเรื่องกังวลทุกวัน ก็แทบไม่เหลือที่ว่างให้คิดถึงชีวิตในอีกสามสิบปีข้างหน้า"],
    ["เกิดที่ไหนยังกำหนดชีวิตมากเกินไป", "โรงเรียน โรงพยาบาล และงานที่ดี อยู่ใกล้คนบางกลุ่มมากกว่าคนอื่น อนาคตที่มาถึงแค่ในเมืองใหญ่ ไม่ได้รู้สึกว่าเป็นอนาคตของเรา"],
    ["หลายคนเชื่อว่าอนาคตอยู่ที่อื่น", "คนรุ่นใหม่พูดถึงการย้ายออก ประเทศกำลังมีผู้สูงอายุมากขึ้น ยากที่จะวางแผนให้กับที่ที่เราเองก็ไม่แน่ใจว่าจะอยู่ต่อ"],
    ["โลกเปลี่ยนเร็วกว่าแผนของเรา", "อากาศที่ร้อนขึ้น เทคโนโลยีใหม่ งานที่พรุ่งนี้อาจไม่มีแล้ว ข่าวร้ายเดินทางเร็ว ส่วนไอเดียดี ๆ มักเงียบกว่า"],
  ],
  stopEnd: "ทั้งหมดนี้ไม่ใช่เหตุผลให้หยุด แต่เป็นเหตุผลที่เว็บไซต์นี้เกิดขึ้น",
  contactHead: "อยากช่วย หรืออยากทำงานร่วมกับเรา",
  contactLede: "คุณเป็นครู นักเรียน นักวิจัย ผู้ให้ทุน หรือผู้กำหนดนโยบายใช่ไหม หรือแค่มีปัญหาที่อยากให้ได้รับการแก้ ติดต่อเราได้เลย",
  contactOn: "บน GitHub",
  feedback: "ส่งความคิดเห็น",
  feedbackSoon: "แบบฟอร์มรับความคิดเห็นกำลังจะมาเร็ว ๆ นี้ ระหว่างนี้ติดต่อเราได้ทาง GitHub",
};

export const aboutText = (lang: Lang) => (lang === "th" ? th : en);
