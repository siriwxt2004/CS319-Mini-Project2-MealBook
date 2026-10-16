import siriwatPhoto from "../assets/images/siriwat.jpg";
import nattapolPhoto from "../assets/images/nattapol.jpg";
import witchyutPhoto from "../assets/images/witchyut.jpg";

export interface Member {
  name: string;
  nickname: string;
  studentId: string;
  role: string;
  photo?: string;
}

// ข้อมูลสมาชิกกลุ่มผู้พัฒนาโครงงาน
export const members: Member[] = [
  {
    name: "Siriwat Boonyong",
    nickname: "toto",
    studentId: "1660706225",
    role: "Home, MealDetail, Collection, Planner, About",
    photo: siriwatPhoto,
  },
  {
    name: "Nattapol Thanudomlarp",
    nickname: "Tar",
    studentId: "1660705599",
    role: "Home, MealDetail, Collection, Planner, About",
    photo: nattapolPhoto,
  },
  {
    name: "Witchyut Silaprom",
    nickname: "Ken",
    studentId: "1660706282",
    role: "Home, MealDetail, Collection, Planner, About",
    photo: witchyutPhoto,
  },
];
