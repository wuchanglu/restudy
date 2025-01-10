# vue2 diff 思路流程

- 是否首次渲染
  - 首次渲染直接创建 dom
  - 非首次渲染再去做判断，新老节点 type 和 key 是否相同
    - 不同，删除老的，创建新的
    - 相同的话开始 pathVnode
      - 新老节点 指针地址一样跳过 oldVnode === vnode
      - 更新节点属性
      - 开始判断处理子节点
        - 新老子节点都为文本节点的话更新文本内容
        - 新的有子节点，老的没有 创建新的子节点
        - 新的没有子节点，老的有，删除老的子节点
        - 新的和老的都有子节点的话开始进行 updateChildren

## updateChildren

old: ABCDEFG  
new: ACBDFEG

- 创建四个变量 oldStartIndex,oldEndIndex,newStartIndex,newEndIndex 分别指向新老子节点数组的头尾
- 开始对比(type 和 key 是否一致)
  - oldStartIndex 节点如果和 newStartIndex 节点一致，复用更新节点，两个 index 向后移动
  - oldEndIndex 节点如果和 newEndIndex 节点一致，复用更新节点，两个 index 向前移动
  - newStartIndex 节点如果和 oldEndIndex 节点一致，复用更新节点，newStartIndex 后移，将老节点移动到 oldStartIndex 节点之前，oldEndIndex 前移
  - oldStartIndex 节点如果和 newEndIndex 节点一致，复用更新节点，oldStartInde 后移，将老的节点移动到 oldEndIndex 节点后面，newEndIndex 前移
  - 如果上述上述情况没匹配上，拿着 newStartIndex 节点去老节点数组里面找
    - 找到了的话 复用更新节点，将对应老节点移动到 oldStartIndex 前面，newStartIndex 后移老节点数组对应位置的数据设置为 undefined(已经处理过了就不要再处理了)
    - 找不到的话创建新节点，newStartIndex 后移
- 循环执行直至新节点数组或者老节点数组被遍历完(newStartIndex>newEndIndex || oldStartIndex>oldEndIndex)
- 最终会有三种情况
  - 两个节点数组都遍历完了 --结束
  - 老节点数组还没遍历完 --删除剩下的老节点
  - 新节点数组还没遍历完 --创建剩下的新节点
