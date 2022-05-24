import React from "react";
import "./index.css";
import { useEffect, useState } from "react";
import Modal from "antd/lib/modal/Modal";
import { Button } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";

function PcitureWall() {
  const picArr = [
    {
      imgsrc:
        "https://upload-bbs.mihoyo.com/upload/2022/03/31/222132390/ad00e02087eb61a677e15fb0f08b550e_8386901948611568723.jpg",
    },
    { imgsrc: "https://avatars.githubusercontent.com/u/6412038?v=3" },
    {
      imgsrc:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.redocn.com%2Fphoto%2F20131204%2FRedocn_2013112809170845.jpg&refer=http%3A%2F%2Fimg.redocn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652876237&t=3b8c58eb15054e795c8a30004acabb55",
    },
    { imgsrc: "https://avatars.githubusercontent.com/u/6412038?v=3" },
    {
      imgsrc:
        "https://upload-bbs.mihoyo.com/upload/2022/03/31/222132390/ad00e02087eb61a677e15fb0f08b550e_8386901948611568723.jpg",
    },
    { imgsrc: "https://avatars.githubusercontent.com/u/6412038?v=3" },
    {
      imgsrc:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp05%2F1Z9291TK61501-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652876279&t=7e652cdf3d23ab06680814960433d9f2",
    },
    {
      imgsrc:
        "https://upload-bbs.mihoyo.com/upload/2022/03/31/222132390/ad00e02087eb61a677e15fb0f08b550e_8386901948611568723.jpg",
    },
    {
      imgsrc:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp05%2F1Z9291G1021264-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652600461&t=49bec642f4881e4b625a4bbbaa0b657f",
    },
    {
      imgsrc:
        "https://avatars.githubusercontent.com/u/6412038?https://pics6.baidu.com/feed/4034970a304e251f671f629fc07762117d3e53e1.jpeg?token=c8a6181ba59fac7d4bf4fcdc44ff1fcb=3",
    },
    {
      imgsrc:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F052420110229%2F200524110229-5-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653012921&t=7ea10f64257ab0a00e5950424f867113",
    },
    {
      imgsrc:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp05%2F1Z9291TIBZ6-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653012921&t=efbe245cd57c484da5e591cc8a0255c0",
    },
    { imgsrc: "https://avatars.githubusercontent.com/u/6412038?v=3" },
    {
      imgsrc:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F041620104229%2F200416104229-8-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653012921&t=163b9feb9c32c84350e6f118b02effde",
    },
    {
      imgsrc:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1112%2F032219114926%2F1Z322114926-6-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653012921&t=a66f5d1cb30b5ac56af110f385a054e2",
    },
    {
      imgsrc:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp01%2F1ZZH250054149-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653012921&t=d0f3a6faf4b5ace8d8cfd22775d6a13a",
    },
    {
      imgsrc:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp05%2F1Z9291TK61501-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653012921&t=9250ea0334c64e439dfa009651a8b56f",
    },
    {
      imgsrc:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1111%2F11131Q45604%2F1Q113145604-2-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653012921&t=e9cd4be8a8f508507b9ac37b07c2388b",
    },
    { imgsrc: "https://avatars.githubusercontent.com/u/6412038?v=3" },
    {
      imgsrc:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fdpic.tiankong.com%2Fk2%2Flu%2FQJ8656178033.jpg&refer=http%3A%2F%2Fdpic.tiankong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653012921&t=ed7b4722244e46c96770d1dcb660b833",
    },
    {
      imgsrc:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ftupian.qqjay.com%2Fu%2F2017%2F1023%2F2_151729_9.jpg&refer=http%3A%2F%2Ftupian.qqjay.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653013194&t=f366d14143b5802647d8d6e5c07bba22",
    },
    { imgsrc: "https://avatars.githubusercontent.com/u/6412038?v=3" },
    {
      imgsrc:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F052020135049%2F200520135049-15-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653013247&t=01233c19f675bb0a743dfdb9f41de4ee",
    },
    { imgsrc: "https://avatars.githubusercontent.com/u/6412038?v=3" },
  ];
  const [isShowPic, setIsShowPic] = useState(false);
  const [picIndex, setPicIndex] = useState(0);
  const [showPic, setShowPic] = useState("");

  useEffect(() => {
    if (picArr.length > 0) {
      setShowPic(picArr[picIndex].imgsrc);
    }
  }, [picIndex]);

  // let picList = [];

  let arr1 = [],
    arr2 = [],
    arr3 = [],
    arr4 = [];
  let heightArr = [0, 0, 0, 0];

  //获取高度数组中最小值所在下标
  function getMinIndex(arr) {
    let temp = arr.slice(0); //防止原数组改变
    let res = temp.sort((a, b) => a - b);
    return arr.indexOf(res[0]);
  }

  // function checkListLength() {
  //   //判断picList_show是否已经加载全部图片
  //   return this.picList.length === this.picArr.length
  // }

  // function checkScoll(e) {
  //   lock = false
  //   const check = checkScrollBottom(e.srcElement)
  //   if (check) {
  //     //如果达到底部，则判断数组
  //     if (checkListLength()) {
  //       hint_text = "已经到底了哦"
  //     } else {
  //       //达到底部，但数组还未加载完
  //       hint_text = "加载中..."
  //       setTimeout(() => {
  //         lock = true
  //         const length = this.picArr.length
  //         picArr.concat(picList.slice(length, length + 1))
  //       }, 300)
  //     }
  //   }
  // }

  // function checkScrollBottom(o) {
  //   //判断滚动条是否已经滚动到底部
  //   return o.scrollTop + o.clientHeight >= o.scrollHeight
  // }

  picArr.forEach((item, index) => {
    let minIndex = getMinIndex(heightArr);
    let img = new Image();

    img.src = item.imgsrc;

    item.title = index;
    heightArr[minIndex] += img.height / img.width; //进行缩放
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

  // const [dom, setDom] = useState(document.getElementById('home_content_main'));

  // useEffect(() => {
  //     /** 当组件挂载时执行一次changeA */
  //     picList = picArr.slice(0,10)
  //     // console.log('1213')
  //     // const scoll = checkScoll()
  //     dom = document.getElementById('home_content_main')
  //     if(dom!=null){
  //         dom.addEventListener('scroll', checkScoll);
  //     }
  //     // getDataSource();
  // },[])

  //点击图片显示图层
  function clickPic(item) {
    setIsShowPic(true);
    setPicIndex(picArr.indexOf(item));
  }

  //取消操作(让图片不显示)
  function handleCancel() {
    setIsShowPic(false);
  }

  //上一张下一张切换图片后获取索引值
  function changePic(item) {
    setPicIndex((picIndex + item + picArr.length) % picArr.length);
  }
  return (
    <div className="container">
      <div className="card">
        {arr1.map(item => (
          <div onClick={() => clickPic(item)} key={item.id}>
            <img
              alt="head_portrait"
              src={item.imgsrc}
              style={{ width: "200px" }}
            />
            <p className="card-text">{item.title}</p>
          </div>
        ))}
      </div>
      <div className="card">
        {arr2.map(item => (
          <div onClick={() => clickPic(item)} key={item.id}>
            <img
              alt="head_portrait"
              src={item.imgsrc}
              style={{ width: "200px" }}
            />
            <p className="card-text">{item.title}</p>
          </div>
        ))}
      </div>
      <div className="card">
        {arr3.map(item => (
          <div onClick={() => clickPic(item)} key={item.id}>
            <img
              alt="head_portrait"
              src={item.imgsrc}
              style={{ width: "200px" }}
            />
            <p className="card-text">{item.title}</p>
          </div>
        ))}
      </div>
      <div className="card">
        {arr4.map(item => (
          <div onClick={() => clickPic(item)} key={item.id}>
            <img
              alt="head_portrait"
              src={item.imgsrc}
              style={{ width: "200px" }}
            />
            <p className="card-text">{item.title}</p>
          </div>
        ))}
      </div>
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
