export interface UserMessageInfo {
  id: string;
  username: string;
  belong_to: string;
  existing_chat: Array<existing_chat>;
}

type existing_chat = {
  id: string;
  type: 'direct' | 'group';
};
