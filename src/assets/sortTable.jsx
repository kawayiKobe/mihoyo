import Sortable from 'sortablejs';
    //拖拽初始化及逻辑
export const sortableGoods = (componentBackingInstance) => {
        // const { dispatch } = this.props; //不使用dva，可忽略
        let tab = document.getElementsByClassName('goodsTable');
        let el = tab[0].getElementsByClassName('ant-table-tbody')[0];
        let self = this;//可忽略
        let sortable = Sortable.create(el, {
            animation: 100, //动画参数
            onEnd: function (evt) { //拖拽完毕之后发生，只需关注该事件
                let menuObj = self.state.menuContent;
                let menuArr = menuObj.goods; //主菜单数组
                // Array.splice(指定修改的开始位置,要移除的个数,要添加进数组的元素)----语法
                //先把拖拽元素的位置删除 再新的位置添加进旧的元素
                const oldEl = menuArr.splice(evt.oldIndex, 1);
                menuArr.splice(evt.newIndex, 0, oldEl[0]);
                //新的
                menuObj.goods = [];//多此一举
                self.setState({
                    menuContent: menuObj
                }, () => {
                    menuObj.goods = menuArr;
                    self.setState({
                        menuContent: menuObj
                    },()=>{
                        //调用保存列表的接口
                   })
                })
            }
        });
    }