/**
 * Thailand's 77 provinces as a block map: each has a column and row on a grid arranged roughly in the
 * country's shape (north at row 0). Positions are stylised, not surveyed. Regions match REGIONS in content.ts.
 */
export type Province = { en: string; th: string; region: string; col: number; row: number };

const p = (en: string, th: string, region: string, col: number, row: number): Province => ({ en, th, region, col, row });

export const PROVINCES: Province[] = [
  // North
  p("Chiang Rai", "เชียงราย", "north", 3, 0),
  p("Mae Hong Son", "แม่ฮ่องสอน", "north", 1, 1), p("Chiang Mai", "เชียงใหม่", "north", 2, 1), p("Phayao", "พะเยา", "north", 3, 1), p("Nan", "น่าน", "north", 4, 1),
  p("Lamphun", "ลำพูน", "north", 2, 2), p("Lampang", "ลำปาง", "north", 3, 2), p("Phrae", "แพร่", "north", 4, 2),
  p("Uttaradit", "อุตรดิตถ์", "north", 4, 3),
  // West
  p("Tak", "ตาก", "west", 2, 3), p("Kanchanaburi", "กาญจนบุรี", "west", 1, 7), p("Ratchaburi", "ราชบุรี", "west", 1, 8),
  p("Phetchaburi", "เพชรบุรี", "west", 1, 9), p("Prachuap Khiri Khan", "ประจวบคีรีขันธ์", "west", 1, 10),
  // Central
  p("Sukhothai", "สุโขทัย", "central", 3, 3),
  p("Kamphaeng Phet", "กำแพงเพชร", "central", 2, 4), p("Phitsanulok", "พิษณุโลก", "central", 3, 4), p("Phetchabun", "เพชรบูรณ์", "central", 4, 4),
  p("Uthai Thani", "อุทัยธานี", "central", 2, 5), p("Nakhon Sawan", "นครสวรรค์", "central", 3, 5), p("Phichit", "พิจิตร", "central", 4, 5),
  p("Chai Nat", "ชัยนาท", "central", 2, 6), p("Sing Buri", "สิงห์บุรี", "central", 3, 6), p("Lopburi", "ลพบุรี", "central", 4, 6),
  p("Suphan Buri", "สุพรรณบุรี", "central", 2, 7), p("Ang Thong", "อ่างทอง", "central", 3, 7), p("Saraburi", "สระบุรี", "central", 4, 7), p("Nakhon Nayok", "นครนายก", "central", 5, 7),
  p("Nakhon Pathom", "นครปฐม", "central", 2, 8), p("Phra Nakhon Si Ayutthaya", "พระนครศรีอยุธยา", "central", 3, 8), p("Pathum Thani", "ปทุมธานี", "central", 4, 8),
  p("Samut Songkhram", "สมุทรสงคราม", "central", 2, 9), p("Nonthaburi", "นนทบุรี", "central", 3, 9),
  p("Samut Sakhon", "สมุทรสาคร", "central", 3, 10), p("Samut Prakan", "สมุทรปราการ", "central", 4, 10),
  // Bangkok
  p("Bangkok", "กรุงเทพมหานคร", "bkk", 4, 9),
  // East
  p("Prachinburi", "ปราจีนบุรี", "east", 6, 7), p("Sa Kaeo", "สระแก้ว", "east", 7, 7),
  p("Chachoengsao", "ฉะเชิงเทรา", "east", 5, 8), p("Chonburi", "ชลบุรี", "east", 5, 9),
  p("Rayong", "ระยอง", "east", 5, 10), p("Chanthaburi", "จันทบุรี", "east", 6, 10), p("Trat", "ตราด", "east", 7, 10),
  // Isan
  p("Nong Khai", "หนองคาย", "isan", 6, 2), p("Bueng Kan", "บึงกาฬ", "isan", 7, 2),
  p("Loei", "เลย", "isan", 5, 3), p("Udon Thani", "อุดรธานี", "isan", 6, 3), p("Sakon Nakhon", "สกลนคร", "isan", 7, 3), p("Nakhon Phanom", "นครพนม", "isan", 8, 3),
  p("Nong Bua Lamphu", "หนองบัวลำภู", "isan", 5, 4), p("Khon Kaen", "ขอนแก่น", "isan", 6, 4), p("Kalasin", "กาฬสินธุ์", "isan", 7, 4), p("Mukdahan", "มุกดาหาร", "isan", 8, 4),
  p("Chaiyaphum", "ชัยภูมิ", "isan", 5, 5), p("Maha Sarakham", "มหาสารคาม", "isan", 6, 5), p("Roi Et", "ร้อยเอ็ด", "isan", 7, 5), p("Yasothon", "ยโสธร", "isan", 8, 5), p("Amnat Charoen", "อำนาจเจริญ", "isan", 9, 5),
  p("Nakhon Ratchasima", "นครราชสีมา", "isan", 5, 6), p("Buriram", "บุรีรัมย์", "isan", 6, 6), p("Surin", "สุรินทร์", "isan", 7, 6), p("Sisaket", "ศรีสะเกษ", "isan", 8, 6), p("Ubon Ratchathani", "อุบลราชธานี", "isan", 9, 6),
  // South
  p("Chumphon", "ชุมพร", "south", 1, 11),
  p("Ranong", "ระนอง", "south", 0, 12), p("Surat Thani", "สุราษฎร์ธานี", "south", 1, 12),
  p("Phang Nga", "พังงา", "south", 0, 13), p("Krabi", "กระบี่", "south", 1, 13), p("Nakhon Si Thammarat", "นครศรีธรรมราช", "south", 2, 13),
  p("Phuket", "ภูเก็ต", "south", 0, 14), p("Trang", "ตรัง", "south", 1, 14), p("Phatthalung", "พัทลุง", "south", 2, 14),
  p("Satun", "สตูล", "south", 1, 15), p("Songkhla", "สงขลา", "south", 2, 15), p("Pattani", "ปัตตานี", "south", 3, 15),
  p("Yala", "ยะลา", "south", 2, 16), p("Narathiwat", "นราธิวาส", "south", 3, 16),
];

export const GRID = { cols: 10, rows: 17 };
