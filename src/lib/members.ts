// 兄弟们的成员数据（auth.ts 和页面共用）

export interface Member {
  id: string;
  birthday: string; // "MM/DD" 格式，显示用
}

// 所有人
export const MEMBERS_LIST: Member[] = [
  { id: "lcy", birthday: "12/26" },
  { id: "qcy", birthday: "3/9" },
  { id: "lzx", birthday: "4/20" },
  { id: "qjk", birthday: "12/23" },
  { id: "zzy", birthday: "10/19" },
  { id: "dht", birthday: "1/27" },
  { id: "zyk", birthday: "3/2" },
];

// 用户名 → 生日密码 MMDD（auth.ts 用）
export const MEMBER_PASSWORDS: Record<string, string> = {
  lcy: "1226",
  qcy: "0309",
  lzx: "0420",
  qjk: "1223",
  zzy: "1019",
  dht: "0127",
  zyk: "0302",
};

// 根据 id 查成员
export function getMember(id: string): Member | undefined {
  return MEMBERS_LIST.find((m) => m.id === id);
}
