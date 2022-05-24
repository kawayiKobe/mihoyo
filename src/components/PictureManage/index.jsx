import React from "react";
import { Card, Table, Space, Popconfirm } from "antd";
import "./index.css";

function PictureManage() {
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
      dataIndex: "banner",
      width: 150,
      align: "center",
      render: url => (
        <img src={url} style={{ width: "80px", height: "50px" }}></img>
      ),
    },
    {
      title: "发布人",
      dataIndex: ["author", "nickname"],
      width: 100,
      align: "center",
    },
    {
      title: "操作",
      dataIndex: "_id",
      width: 200,
      align: "center",
      render: () => (
        <Space size="small">
          <a>编辑</a>
          <Popconfirm title="你确定要删除吗？" okText="Yes" cancelText="No">
            <a>删除</a>
            <a>查看文章</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="pic-manage">
      <Card size="small" style={{ width: "100%" }}>
        <Table
          columns={column}
          bordered
          rowClassName={() => "editable-row"}
          pagination={{
            defaultPageSize: 10,
            pageSize: 10,
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
