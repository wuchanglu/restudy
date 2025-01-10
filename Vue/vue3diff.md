# vue3 diff

## 前置步骤(和 2 一致)

- 如果是初次渲染直接创建
- 非首次渲染就进行 pathVnode
  - 新老节点指针是否一样 oldVnode===vnode 跳过
  - 更新节点属性
  - 开始比对子节点
    - 如果新老子节点都是文本节点，更新文本内容
    - 如果存在老的子节点，没有新的子节点(删除老的子节点)
    - 如果没有老的子节点，有新的子节点（创建新的子节点）
    - 如果新老子节点都有的话进行 vue3Diff

## vue3Diff(prevChildren, nextChildren, parent)

`type和key一致算相同可复用`

- 先进行前后置预处理
  - 创建 j=0,nextEnd=nextChildren.length-1,preEnd=preChildren.leng-1
  - 判断 nextChildren[j]和 preChildren[j]是否相同，相同的话复用节点，更新属性，j++
  - 不相同的话前置预处理结束
  - 判断 nextChildren[nextEnd]和 preChildren[preEnd]是否相同，相同的话复用节点，更新属性,nextEnd 和 preEnd 都--
  - 不相同的话后置预处理结束
  - 在整个预处理过程中如果遇到 j>nextEnd 或者 j>preEnd 就结束预处理
- 预处理结束有以下四种情况
  - 新老节点数组都处理完了(结束)
  - 新节点数组处理完了，老节点数组没处理完(删除剩余老节点) j>nextEnd && j<= preEnd
  - 老节点数组处理完了，新节点数组没处理完(创建剩余新节点) j>preEnd && j <=nextEnd
  - 新老节点数组都没处理完
- 根据剩余新节点数组来长度来创建一个 source 数组，每一位都为-1，并且生成新节点数组 key=>index 的 map 对象
- 遍历剩余老节点数组，去 map 对象里面找对应新节点，有的话就把 source[mapIndex]设置为老节点当前遍历的 index 位，没有的话就删除这个老节点
- 从 source 里面找出最大递增子序列
- 从剩余新节点数组尾部开始向前遍历处理
  - 如果当前新节点在 source 的对应位置值为-1，那么就是创建并插入尾节点
  - 如果不是-1，并且值在最大递增子序列之内，则不需要移动，复用老节点，更新属性
  - 如果不是-1，并且值不在最大递增子序列之内，则移动老节点到新节点尾部,复用并更新老节点属性
  - 这个新节点尾部是随着循环往前走的，第一次循环的时候是剩余新节点数组之后的一位假设新节点数组是 abcde,剩余新节点数组是 abcd,那么尾部则是 d 的后一位 e
  - 实际调用的是 parent.insertBefore(老节点的真实 dom 元素，插入尾部节点 refNode)
