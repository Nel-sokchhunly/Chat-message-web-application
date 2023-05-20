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
  type: 'direct' | 'group';
  messages_object: {
    message_list: MessageObject[];
  };
  unseen_message: any;
  expand?: {
    members: UserInfo[];
  };
  unique_ids: string;
}

export type MessageObject = {
  created: string;
  sender: string;
  text: string;
};
