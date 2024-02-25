import db from "../models/index";
import { createAddressService } from "./address";
import { createFileService } from "./file";

export const updateInfoUserService = async (data) => {
  const transaction = await db.sequelize.transaction();
  try {
    var address = null;
    if (!data?.addressId) {
      address = await createAddressService({
        address: {
          ...data.location,
          address: data.address,
        },
        transaction: transaction,
      });
    } else if (
      data.location?.lat &&
      data.location?.lng &&
      data?.oldLat !== data?.location?.lat &&
      data?.oldLng !== data?.location?.lng
    ) {
      address = await db.Address.findOne({ where: { id: data.addressId } });
      await address.update(
        {
          lat: data.location.lat,
          lng: data.location.lng,
          address: data.address,
        },
        { transaction: transaction }
      );
    }

    var user = await db.User.findOne({ where: { id: data.userId } });
    await user.update(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        birthday: data?.birthday,
        gender: data?.gender,
        maritalStatus: data?.maritalStatus,
        phoneNumber: data?.phoneNumber,
        addressId: address?.id,
        wallet: data.wallet,
      },
      { transaction: transaction }
    );

    if (data.avatar) {
      await createFileService(
        {
          fkId: data.userId,
          files: [data.avatar],
        },
        "5",
        transaction
      );
    }

    await transaction.commit();

    const userRes = await db.User.findOne({
      where: { id: data.userId },
      include: [
        {
          model: db.File,
          where: {
            typeFk: "5",
          },
          required: false,
          attributes: ["url"],
        },
        { model: db.Address, required: false },
      ],
      attributes: { exclude: ["password"] },
    });

    return userRes.get({ plain: true });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    throw new Error(error);
  }
};
