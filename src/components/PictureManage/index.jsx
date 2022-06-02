import React from "react";
import { Card, Table, message, Button, Popconfirm } from "antd";
import { useState, useEffect } from "react";
import "./index.css";
import * as api from "../../services/api";

function PictureManage() {
  const [dataSource, setDataSource] = useState([]); // eslint-disable-line no-unused-vars
  const [total, setTotal] = useState(Number);

  useEffect(() => {
    getPicture();
  }, []);

  const getPicture = async () => {
    let result = await api.getPicture();
    console.log("info" + result.data.content[0]);
    if (result.data.stat === "ok") {
      setDataSource(result.data.content);
      setTotal(result.data.total);
    } else {
      message.error(result.data.message);
    }
  };

  const deletePic = async content => {
    // const res = dataSource.find(item => {
    //   return item.picId === content;
    // });
    // console.log("resu" + res.picId);
    const result = await api.deletePic(content);
    console.log("cc123" + result.data);
    if (result.data.stat === "ok") {
      console.log("ok");
      message.success(result.data.message);
      getPicture();
    } else {
      message.error("删除失败！");
    }
  };

  const updatePic = async content => {
    const result = await api.updatePic(content);
    if (result.data.stat === "ok") {
      message.success(result.data.message);
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
            onClick={() => updatePic({ picState: 1, picId: picId })}
          >
            通过
          </Button>
          <Button
            size="small"
            type="ghost"
            className="reject"
            onClick={() => updatePic({ picState: 2, picId: picId })}
          >
            拒绝
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
