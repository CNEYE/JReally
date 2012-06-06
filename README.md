JReally
=======

一个适用的JS 选择器，一个从适用角度出发的选择器


<h5>支持的选择器种类如下：</h5>
  <ul>
  <li>ID选择器 （#id）</li>
  <li>CLASS选择器 (.class)</li>
  <li>标签选择器 （div）</li>
  <li>属性选择器 （input[type=text]）</li>
  
  <li>群组选择器 （#id,.class,div,input[type=text]）</li>
  <li>子选择器 （div.class input[type=text]）</li>
  <li>后代选择器 （div>.class>input[type=text]）</li>
  <li>同辈选择器 单个(div + .class)</li>
  <li>同辈选择器 多个(div ~ .class)</li>
  </ul>

<h5>性能测试：</h5>
<p>在JQuery和JReally都关闭浏览器自带的选择函数（querySelectorAll/querySelector的情况下）JReally的速度快与JQuery 1.5-4倍。</p>

<h5>适用方法：</h5>
<p>JReally('#uoeye > b.c ,div.class .input[type=text]')</p>

作者：深蓝剑 (wjstudy[at]qq.com)

如果有什么意见、建议、BUG，请反馈给作者。