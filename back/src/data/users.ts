export interface User {
  username: string;
  password: string;
  displayName: string;
}

export const users: Record<string, User> = {
  HenriqueMaster: {
    username: 'HenriqueMaster',
    password: '#Main1704',
    displayName: 'Henrique',
  },
  AdanMaster: {
    username: 'AdanMaster',
    password: '#Main1704',
    displayName: 'Adan',
  },
};
