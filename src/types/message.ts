import { UserInfo } from './auth';

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

export interface DirectChatInfo {
  id?: string;
  members: string[];
  unique_ids: string;
  messages_object: {
    message_list: MessageObject[];
  };
  expand?: {
    members: UserInfo[];
  };
}

export type MessageObject = {
  created: string;
  sender: string;
  text: string;
};
