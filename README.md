JReally
=======

一个适用的JS 选择器，一个从适用角度出发的选择器


支持的选择器种类如下：
  1、ID选择器 （#id）
  2、CLASS选择器 (.class)
  3、标签选择器 （div）
  4、属性选择器 （input[type=text]）
  
  5、群组选择器 （#id,.class,div,input[type=text]）
  6、子选择器 （div.class input[type=text]）
  7、后代选择器 （div>.class>input[type=text]）
  8、同辈选择器 单个(div + .class)
  9、同辈选择器 多个(div ~ .class)

性能测试：
  在JQuery和JReally都关闭浏览器自带的选择函数（querySelectorAll/querySelector的情况下）JReally的速度快与JQuery 1.5-4倍。

作者：深蓝剑 <wjstudy[at]qq.com>
