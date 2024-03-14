import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../../providers/authProvider";
import { Col, Row } from "antd";
import moment from "moment";
import Contract from "./Contract";

const CreateSC = ({ contract }) => {
  const { authUser } = useContext(AuthContext);

  return (
    <Col span={24} style={{ paddingTop: 20 }}>
      {authUser?.role === "2" ? (
        <>
          <Row>Người thuê đang chờ bạn tạo hợp đồng</Row>
          <Row>Đừng để họ phải chờ quá lâu</Row>
          <Contract contract={contract} />
        </>
      ) : (
        <>
          <Row>Vui lòng chờ người bán tạo hợp đồng thông minh</Row>
          <Row>Hãy nhắn tin người bán nếu phải chờ quá lâu</Row>
          <Contract contract={contract} />
        </>
      )}
    </Col>
  );
};

export default CreateSC;
