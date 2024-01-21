import db from "../models/index";

export const createMessageService = async (data) => {
  try {
    const message = await db.Message.create({
      userId: data.userId,
      content: data.content,
      roomChatId: data.roomChatId,
    });
    return message.get({ plain: true });
  } catch (error) {
    console.log(error);
    throw new Error("Create message service error", error);
  }
};
