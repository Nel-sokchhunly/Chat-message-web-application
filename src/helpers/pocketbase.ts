import { initPbClient } from '../pocketbase';
import useUserStore from '../store/user';

import { DirectChatInfo, GroupChatInfo } from '../types/message';

export async function getDirectMessage(fromId: string, toId: string) {
  try {
    const { pb } = initPbClient();

    // get record with relation
    const directMessageRecord = await pb
      .collection('direct_chat_info')
      .getFullList({
        filter: `(unique_ids='${toId}_${fromId}'||unique_ids='${fromId}_${toId}')`
      });

    // has existing direct message record
    if (directMessageRecord.length > 0) return directMessageRecord[0];

    // if not, create a new one
    const formData: DirectChatInfo = {
      members: [fromId, toId],
      type: 'direct',
      messages_object: {
        message_list: []
      },
      unseen_message: {},
      unique_ids: fromId + '_' + toId
    };

    // create record in direct_chat_info
    const newRecord = await pb.collection('direct_chat_info').create(formData);

    return newRecord;
  } catch (err) {
    console.log('====================================');
    console.log(err);
    console.log('====================================');
  }
}

export async function getAllDirectMessage(pb: any) {
  const result = await pb.collection('direct_chat_info').getFullList({
    sort: '-updated',
    filter: `members.id?='${pb.authStore.model?.id}'`,
    expand: 'members',
    $autoCancel: false
  });

  return result;
}

export async function createGroupChat(formData: GroupChatInfo) {
  try {
    const { pb } = initPbClient();
    const userStore = useUserStore();

    const groupChatRecord = await pb
      .collection('group_chat_info')
      .create(formData);

    const getAllGroupMessage = await pb
      .collection('group_chat_info')
      .getFullList({
        sort: '-updated',
        filter: `members.id?='${pb.authStore.model?.id}'`,
        expand: 'members',
        $autoCancel: false
      });

    userStore.$state.groupMessage = getAllGroupMessage;

    return groupChatRecord;
  } catch (err) {
    console.log('====================================');
    console.log(err);
    console.log('====================================');
    return err;
  }
}

export async function getAllGroupMessage() {
  const { pb } = initPbClient();

  const result = await pb.collection('group_chat_info').getFullList({
    sort: '-updated',
    filter: `members.id?='${pb.authStore.model?.id}'`,
    expand: 'members',
    $autoCancel: false
  });

  return result;
}
