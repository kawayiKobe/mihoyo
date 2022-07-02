import React from "react";
import "./index.css";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "antd/lib/modal/Modal";
import { Button } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import * as api from "../../services/api";

function PcitureWall() {
  const [isShowPic, setIsShowPic] = useState(false);
  const [picIndex, setPicIndex] = useState(0);
  const [showPic, setShowPic] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [arr1, arr2, arr3, arr4] = [[], [], [], []];
  let heightArr = [0, 0, 0, 0];

  useEffect(() => {
    getPictureByState();
  }, []);

  useEffect(() => {
    if (dataSource.length > 0) {
      setShowPic(dataSource[picIndex].imgSrc);
    }
  }, [picIndex]);

  const getPictureByState = async () => {
    setLoading(true);
    let newRes = [];
    const result = await api.getPictureByState();
    if (result.data.stat === "ok") {
      setLoading(false);
      newRes = result.data.content;
    } else if (result.data.stat === "Token_Not_Found") {
      history.replace("/login");
    }
    setDataSource([...newRes]);
  };

  //获取高度数组中最小值所在下标
  function getMinIndex(arr) {
    let temp = arr.slice(0); //防止原数组改变
    let res = temp.sort((a, b) => a - b);
    return arr.indexOf(res[0]);
  }

  dataSource.forEach(item => {
    let minIndex = getMinIndex(heightArr);
    heightArr[minIndex] += (item.height / item.width); //进行缩放
    if (minIndex === 0) {
      arr1.push(item);
    } else if (minIndex === 1) {
      arr2.push(item);
    } else if (minIndex === 2) {
      arr3.push(item);
    } else {
      arr4.push(item);
    }
  });

  //点击图片显示图层
  function clickPic(item) {
    setIsShowPic(true);
    setShowPic(dataSource[picIndex].imgSrc);
    setPicIndex(dataSource.indexOf(item));
  }

  //取消操作(让图片不显示)
  function handleCancel() {
    setIsShowPic(false);
  }

  //上一张下一张切换图片后获取索引值
  function changePic(item) {
    setPicIndex((picIndex + item + dataSource.length) % dataSource.length);
  }
  return (
    <div className="container">
      {loading ? (
        <div className="loader">加载中...</div>
      ) : (
        <>
          <div className="card">
            {arr1.map(item => (
              <div onClick={() => clickPic(item)} key={item.id}>
                <img alt="head_portrait" src={item.imgSrc} />
                <p className="card-text">{item.title}</p>
              </div>
            ))}
          </div>
          <div className="card">
            {arr2.map(item => (
              <div onClick={() => clickPic(item)} key={item.id}>
                <img alt="head_portrait" src={item.imgSrc} />
                <p className="card-text">{item.title}</p>
              </div>
            ))}
          </div>
          <div className="card">
            {arr3.map(item => (
              <div onClick={() => clickPic(item)} key={item.id}>
                <img alt="head_portrait" src={item.imgSrc} />
                <p className="card-text">{item.title}</p>
              </div>
            ))}
          </div>
          <div className="card">
            {arr4.map(item => (
              <div
                onClick={() => clickPic(item)}
                key={item.id}
                className="card-pic"
              >
                <img alt="head_portrait" src={item.imgSrc} />
                <p className="card-text">{item.title}</p>
              </div>
            ))}
          </div>
        </>
      )}

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

export default PcitureWall;
