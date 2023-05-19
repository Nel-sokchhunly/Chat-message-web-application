import { initPbClient } from '../pocketbase';

import { DirectChatInfo } from '../types/message';

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
      unique_ids: `${fromId}_${toId}`,
      messages_object: {
        message_list: []
      }
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
    expand: 'members'
  });

  return result;
}
