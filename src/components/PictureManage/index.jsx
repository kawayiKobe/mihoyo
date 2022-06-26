import { React, useState, useEffect,useRef } from "react";
import { Card, Table, message, Button, Popconfirm } from "antd";
import { useHistory } from "react-router-dom";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import "./index.css";
import * as api from "../../services/api";
import Sortable from "sortablejs";

function PictureManage() {
  const [dataSource, setDataSource] = useState([]); // eslint-disable-line no-unused-vars
  const [total, setTotal] = useState(Number);
  const [loading, setLoading] = useState(null);
  const [isShowPic, setIsShowPic] = useState(false);
  const [picIndex, setPicIndex] = useState(0);
  const [showPic, setShowPic] = useState("");
  const history = useHistory();

  const column = [
    {
      title: "图片标题",
      dataIndex: "title",
      width: 100,
      ellipsis: true,
      align: "center",
    },
    {
      title: "图片",
      width: 180,
      dataIndex: "imgSrc",
      align: "center",
      render: item => (
        <img
          onClick={() => clickPic(item)}
          className="manage-img"
          src={item}
        ></img>
      ),
    },
    {
      title: "审核状态",
      dataIndex: "picState",
      width: 150,
      align: "center",
      render: item => {
        if (item === 0) {
          return <span>审核中</span>;
        } else if (item === 1) {
          return <span>审核通过</span>;
        } else if (item === 2) {
          return <span className="text-delete">审核未通过</span>;
        }
      },
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
      width: 270,
      align: "center",
      render: picId => (
        <div>
          <Button
            size="small"
            type="primary"
            className="operate-margin"
            onClick={() => updateCheckState({ picState: 1, picId: picId })}
          >
            通过
          </Button>
          <Button
            size="small"
            type="ghost"
            className="operate-margin"
            onClick={() => updateCheckState({ picState: 2, picId: picId })}
          >
            拒绝
          </Button>
          <Button
            size="small"
            type="ghost"
            className="operate-margin"
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
    {
      title: "拖拽",
      width: 100,
      align: "center",
      render: () => (
        <a className="drag-handle" href="#">
          Drag
        </a>
      ),
    },
  ];

  useEffect(() => {
    getPicture();
  }, []);

  useEffect(() => {
    if (dataSource[picIndex]) {
      setShowPic(dataSource[picIndex].imgSrc);
    }
  }, [picIndex]);

  function clickPic(item) {
    setIsShowPic(true);
    setShowPic(item);
    setPicIndex(dataSource.findIndex(content => content.imgSrc === item));
    localStorage.setItem("userId",dataSource.find(content => content.imgSrc === item).picId);
  }

  function handleCancel() {
    setIsShowPic(false);
  }

  function changePic(item) {
    setPicIndex((picIndex + item + dataSource.length) % dataSource.length);
  }

  const getPicture = async () => {
    setLoading(true);
    let newRes = [];
    let result = await api.getPicture();
    if (result.data.stat === "ok") {
      setLoading(false);
      newRes = result.data.content;
      setTotal(result.data.total);
    } else if (result.data.stat === "Token_Not_Found") {
      history.replace("/login");
    } else {
      message.error(result.data.message);
    }
    setDataSource([...newRes]);
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
      getPicture();
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

  const sortables = () => {
    let tab = document.getElementsByClassName("pic-manage");
    let el = tab[0].getElementsByClassName("ant-table-tbody")[0];
    Sortable.create(el, {
      animation: 100,
      onEnd: function (evt) {
        //拖拽完毕之后发生，只需关注该事件
        const oldEl = dataSource.splice(evt.oldIndex, 1);
        dataSource.splice(evt.newIndex, 0, oldEl[0]);
        console.log(oldEl,dataSource);
      },
    });
  };

  return (
    <div className="pic-manage" ref={sortables}>
      <Card size="small" style={{ width: "100%" }}>
        <Table
          dataSource={dataSource}
          columns={column}
          loading={loading}
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
        />
      </Card>
      <Modal
        title="查看图片"
        align="center"
        visible={isShowPic}
        onCancel={handleCancel}
        footer={
          <div className="footer">
            <Button onClick={() => changePic(-1)}>
              <LeftOutlined />
            </Button>
            <Button onClick={() => changePic(1)}>
              <RightOutlined />
            </Button>
          </div>
        }
      >
        <div className="show-pic">
          <img src={showPic} alt="" />
        </div>
      </Modal>
    </div>
  );
}

export default PictureManage;
