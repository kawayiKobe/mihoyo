import React from "react";
import { Card, Table, message,Button,Popconfirm } from "antd";
import { useState, useEffect } from "react";
import "./index.css";
import * as api from "../../services/api";

function PictureManage() {
  const [dataSource, setDataSource] = useState([]); // eslint-disable-line no-unused-vars
  const [total, setTotal] = useState(Number);
  // const [url,setUrl] = useState('');
  useEffect(() => {
    getPicture();
  }, []);

  const getPicture = async () => {
    let result = await api.getPicture();
    console.log("cc" + result.data.content);
    if (result.data.stat === "ok") {
      console.log("111");
      setDataSource(result.data.content);
      setTotal(result.data.total);
      // setUrl(result.data.content.imgSrc)
    } else {
      console.log("222");
      message.error(result.data.message);
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
        <img src={url} style={{ width: "80px", height: "50px" }}></img>
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
      dataIndex: "_id",
      width: 200,
      align: "center",
      render: () => (
        <div>
          <Button
              size="small"
              style={{borderColor:'#5cb85c',backgroundColor:'#5cb85c',color:'#FFFFFF',margin:'0 5px 0 5px'}}
          >
            审核通过
          </Button>
          <Button
              size="small"
              style={{borderColor:'#f0a339',backgroundColor:'#f0a339',color:'#FFFFFF',margin:'0 5px 0 5px'}}
          >
            审核未通过
          </Button>
          <Popconfirm
              placement="bottomRight"
              title="确认删除吗？"
              okText="确定"
              cancelText="取消"
          >
              <Button
                  type="danger"
                  size="small"
                  style={{borderColor:'#cc0000',backgroundColor:'#cc0000',color:'#FFFFFF',margin:'0 5px 0 5px'}}
              >
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