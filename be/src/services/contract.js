import db from "../models/index";
import { createNotifyService } from "./notify";
const { Op } = require("sequelize");

export const createContractService = async (data) => {
  const transaction = await db.sequelize.transaction();
  try {
    var realEstate = await db.RealEstate.findOne({
      where: { id: data.realEstateId },
    });
    realEstate = realEstate.get({ plain: true });

    const cost = await db.Cost.create(
      {
        value: realEstate.cost,
        accept: false,
        userId: data.sellerId,
      },
      { transaction: transaction }
    );

    const timeStart = await db.TimeStart.create(
      {
        value: new Date(),
        accept: false,
        userId: data.sellerId,
      },
      { transaction: transaction }
    );

    const contract = await db.Contract.create(
      {
        realEstateId: data.realEstateId,
        renterId: data.renterId,
        sellerId: data.sellerId,
        costId: cost.id,
        timeStartId: timeStart.id,
        paymentType: realEstate.paymentType,
        status: "1",
      },
      { transaction: transaction }
    );

    const roomChat = await db.RoomChat.create(
      {
        contractId: contract.id,
        name: realEstate.name,
      },
      { transaction: transaction }
    );

    await createNotifyService(
      {
        userId: data.sellerId,
        fkId: roomChat.id,
        content: `Bạn có phòng đàm phán mới ${roomChat.name}`,
        type: "3",
        eventNotify: "new-contract",
      },
      transaction
    );

    await transaction.commit();

    return roomChat.get({ plain: true });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    throw new Error("Create Contract Failed", error);
  }
};

export const checkContractIsExistService = async ({ userId, realEstateId }) => {
  try {
    var contracts = await db.Contract.findAll({
      where: {
        status: ["1", "2", "3", "4"],
        renterId: userId,
        realEstateId: realEstateId,
      },
      subQuery: false,
    });
    if (contracts?.length > 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    throw new Error("Không tìm thấy hợp đồng", error);
  }
};

export const closeContractService = async (userId, contractId) => {
  const transaction = await db.sequelize.transaction();
  try {
    var contract = await db.Contract.findOne({
      where: { id: contractId },
      include: [
        {
          model: db.RealEstate,
          required: true,
        },
      ],
    });
    if (!contract) {
      throw new Error("Hợp đồng không tồn tại");
    }
    if (
      contract.get({ plain: true }).renterId !== userId &&
      contract.get({ plain: true }).sellerId !== userId
    ) {
      throw new Error("Bạn không có quyền thay đổi trạng thái hợp đồng");
    }
    await contract.update({ status: "5" });

    const room = await db.RoomChat.findOne({ contractId: contract.id });
    const receiver =
      userId === contract.renterId ? contract.sellerId : contract.renterId;

    await createNotifyService(
      {
        userId: receiver,
        fkId: room.id,
        content: `Đối phương đã hủy đàm phán ${room.name}`,
        type: "2",
        eventNotify: "close-contract",
      },
      transaction
    );

    await transaction.commit();
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    throw new Error("Close contract id fail", error);
  }
};

export const getContractService = async ({ userId, page = 1, limit = 10 }) => {
  try {
    const total = await db.Contract.count({
      where: { [Op.or]: [{ sellerId: userId }, { renterId: userId }] },
    });

    var contracts = await db.Contract.findAll(
      {
        where: { [Op.or]: [{ sellerId: userId }, { renterId: userId }] },
        include: [
          {
            model: db.RealEstate,
            required: true,
            include: [
              {
                model: db.File,
                where: {
                  typeFk: "2",
                },
                limit: 1,
                as: "realEstateFiles",
                attributes: ["url"],
                required: true,
              },
              { model: db.Address, required: true },
            ],
          },
          {
            model: db.RoomChat,
            required: true,
          },
        ],
        offset: (page - 1) * limit,
        subQuery: false,
        limit: limit,
      },
      { raw: true }
    );

    return { total: total, contracts: contracts };
  } catch (error) {
    console.log(error);
    throw new Error("Get contract id fail", error);
  }
};

export const getContractByIdService = async ({ id }) => {
  try {
    var contract = await db.Contract.findOne({
      where: { id: id },
      include: [
        {
          model: db.RealEstate,
          include: [{ model: db.Address, required: false }],
          required: true,
        },
        {
          model: db.Cost,
          required: true,
        },
        {
          model: db.TimeStart,
          required: true,
        },
        {
          model: db.Term,
          required: false,
        },
        {
          model: db.User,
          required: true,
          include: [
            { model: db.Address, required: false },
            { model: db.Signature, required: false },
          ],
          attributes: { exclude: ["password"] },
          as: "renter",
        },
        {
          model: db.User,
          required: true,
          include: [
            { model: db.Address, required: false },
            { model: db.Signature, required: false },
          ],
          attributes: { exclude: ["password"] },
          as: "seller",
        },
      ],
    });
    if (!contract) {
      throw new Error("Hợp đồng không tồn tại");
    }
    return contract.get({ plain: true });
  } catch (error) {
    console.log(error);
    throw new Error("Get contract id fail", error);
  }
};