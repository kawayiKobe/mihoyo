import { React, useState, useEffect } from "react";
import { Card, Table, message, Button, Popconfirm } from "antd";
import { useHistory } from "react-router-dom";
import "./index.css";
import * as api from "../../services/api";

function PictureManage() {
  const [dataSource, setDataSource] = useState([]); // eslint-disable-line no-unused-vars
  const [total, setTotal] = useState(Number);
  const history = useHistory();

  useEffect(() => {
    getPicture();
  }, []);

  const getPicture = async () => {
    let result = await api.getPicture();
    console.log('ccc'+result.data.content[0].account)
    if (result.data.stat === "ok") {
      console.log('chenchu')
      setDataSource(result.data.content);
      setTotal(result.data.total);
    } else if (result.data.stat === "Token_Not_Found") {
      history.replace("/login");
    } else {
      message.error(result.data.message);
    }
  };

  const deletePic = async content => {
    const result = await api.deletePic(content);
    if (result.data.stat === "ok") {
      message.success(result.data.message);
      getPicture();
    } else if (result.data.stat === "Token_Not_Found") {
      history.replace("/login");
    } else {
      message.error("删除失败！");
    }
  };

  const updateCheckState = async content => {
    const result = await api.updateCheckState(content);
    if (result.data.stat === "ok") {
      message.success(result.data.message);
    } else if (result.data.stat === "Token_Not_Found") {
      history.replace("/login");
    } else {
      message.error("修改失败！");
    }
  };

  const updateType = async content => {
    const result = await api.updateType(content);
    if (result.data.stat === "ok") {
      message.success(result.data.message);
      getPicture();
    } else if (result.stat === "Token_Not_Found") {
      history.replace("/login");
    } else {
      message.error("修改失败！");
    }
  };

  const column = [
    {
      title: "图片标题",
      dataIndex: "title",
      width: 180,
      ellipsis: true,
      align: "center",
    },
    {
      title: "图片",
      dataIndex: "imgSrc",
      width: 150,
      align: "center",
      render: url => (
        <img
          className="manage-img"
          src={url}
          style={{ width: "80px", height: "50px" }}
        ></img>
      ),
    },
    {
      title: "发布人",
      dataIndex: "account",
      width: 100,
      align: "center",
    },
    {
      title: "操作",
      dataIndex: "picId",
      width: 200,
      align: "center",
      render: picId => (
        <div>
          <Button
            size="small"
            type="primary"
            className="pass"
            onClick={() => updateCheckState({ picState: 1, picId: picId })}
          >
            通过
          </Button>
          <Button
            size="small"
            type="ghost"
            className="reject"
            onClick={() => updateCheckState({ picState: 2, picId: picId })}
          >
            拒绝
          </Button>
          <Button
            size="small"
            type="ghost"
            className="reject"
            onClick={() => updateType({ isTop: 0, picId: picId })}
          >
            置顶
          </Button>
          <Popconfirm
            placement="bottomRight"
            title="确认删除吗？"
            onConfirm={() => deletePic({ picId: picId })}
            okText="确定"
            cancelText="取消"
          >
            <Button size="small" type="danger" className="delete">
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="pic-manage">
      <Card size="small" style={{ width: "100%" }}>
        <Table
          dataSource={dataSource}
          columns={column}
          bordered
          rowClassName={() => "editable-row"}
          pagination={{
            defaultPageSize: 10,
            pageSize: 10,
            total: total,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
          }}
          size="small"
          rowKey={record => {
            return record.id;
          }}
        />
      </Card>
    </div>
  );
}

export default PictureManage;
