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
  type: 'direct';
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
  username: string;
  sender: string; // sender id
  text: string;
};

export interface GroupChatInfo {
  id?: string;
  name: string;
  created_by: string;
  members: string[];
  type: 'group';
  messages_object: {
    message_list: MessageObject[];
  };
  unseen_message: any;
  unseen_amount?: number;
  expand?: {
    members: UserInfo[];
  };
}
