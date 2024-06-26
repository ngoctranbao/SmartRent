import { getRoomChatService } from "../services/roomChat";

export const roomPermission = async (req, res, next) => {
  try {
    const room = await getRoomChatService(req.body.roomChatId);
    if (!room) {
      return res.status(404).json({ message: "Room không tồn tại" });
    }
    if (
      req.user.id !== room.contract.renterId &&
      req.user.id !== room.contract.sellerId
    ) {
      return res.status(403).json({ message: "Không có quyền vào room này" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Server không ổn định" });
  }
};
