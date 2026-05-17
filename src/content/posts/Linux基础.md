---
title: "Linux基础"
published: 2025-12-01
draft: false
description: ""
tags: []
category: ""
---

# 文件目录
![File-Linux文件目录-2520251109](/images/from-obsidian/File-Linux文件目录-2520251109.png)
# 命令基础
学习Linux，本质上是学习在命令行下熟练使用Linux的各类命令。
## 命令行：
即Linux终端（Terminal），是一种命令提示符页面。以纯“字符”的形式操作系统，可以使用各种字符化命
令对系统发出操作指令。
## 命令：
即Linux程序。一个命令就是一个Linux的程序。命令没有图形化页面，可以在命令行（终端中）提供字符化的反馈。
# 路径表示
## 相对路径和绝对路径
![File-Linux基础-2520251109](/images/from-obsidian/File-Linux基础-2520251109.png)
## 特殊路径符
- `.`表示**当前目录**，比如`cd./Desktop`表示切换到当前目录下的`Desktop`目录内，和`cd Desktop`效果一致
- `..`表示**上一级自录**，比如：`cd.`即可切换到上一级自录，`cd../..切换到上二级的自录　
- `~`表示**HOME目录**，比如：`cd ~`即可切换到HOME目录或`cd ~/Desktop`，切换到HOME内的`Desktop`目录
# 通配符
rm命令支持用通配符来做模糊匹配
## 语法
`*`表示通配符,即匹配任意内容(包含空)
- `test*`表示匹配任意以test开头的字符
- `*test`表示匹配任意以test结尾的字符
- `*test*`表示匹配任意含test的字符
# root用户
## 概念
root用户是在Linux系统中的超级管理员用户，拥有最大的系统操作权限
而普通用户的权限，一般在其HOME自录内是不受限的，一旦出了HOME自录，大多数地方，普通用户仅有只读和执行权限，无修改权限
## 有关命令
1. 可以通过su - root,并输入密码123456临时切换到root用户体验[[Linux命令#su命令]]，通过exit命令退回普通用户
2. 在其它命令之前，带上sudo，即可为这一条命令临时赋予root授权*但是并不是所有的用户，都有权利使用sudo，我们需要为普通用户配置sudo认证*
## sudo认证
![File-Linux命令-2520251114](/images/from-obsidian/File-Linux命令-2520251114.png)
# 反引号符
## 语法
\`\`表示反引号符，被\`包围的内容会作为命令执行，而非字符串
（如在echo命令中[[Linux命令#echo命令]]）
# 重定向符
## 语法
`>`将左侧命令的结果，**覆盖**写入到符号右侧指定的文件中
`>>`将左侧命令的结果，**追加**写入到符号右侧指定的文件中
可以搭配echo使用[[Linux命令#echo命令]]
# vi/vim编辑器
## 什么是vi/vim编辑器
vi/vim编辑器，就是命令行模式下的文本编辑器，用来编辑文件
而vim是vi的升级版，一般用vim即可，包含全部vi功能
## 基础命令
### 进入
`vi 文件路径`
`vim 文件路径`
### 退出
`:wq`即底线命令模式下输入wq
## 运行模式及其快捷键
1. 命令模式，默认的模式，可以通过键盘快捷键控制文件内容 ![File-Linux基础-2520251114-3](/images/from-obsidian/File-Linux基础-2520251114-3.png)
2. 输入模式，通过命令模式按i进入，可以输入内容进行编辑，按esc退回命令模式。![File-Linux基础-2520251114-2](/images/from-obsidian/File-Linux基础-2520251114-2.png)
3. 底线命令模式，通过命令模式输入:进入，可以对文件进行保存、关闭等操作，以回车结束运行。![File-Linux基础-2520251114-4](/images/from-obsidian/File-Linux基础-2520251114-4.png)
![File-Linux基础-2520251114-1](/images/from-obsidian/File-Linux基础-2520251114-1.png)

# 用户、用户组
## Linux用户管理模式
Linux可以支持多用户、多用户组、用户加入多个组
Linux权限管控的单元是用户级别和用户组级别
## 用户、用户组相关管理命令
`groupadd`添加组、`groupdel`删除组
`useradd`添加用户、`userdel`删除用户
`usermod`修改用户组、`id`命令查看用户信息
`getent passwd`查看系统全部用户信息
`getent group`查看系统全部组信息
# 权限信息
## 查看
![File-Linux基础-2520251114-5](/images/from-obsidian/File-Linux基础-2520251114-5.png)
## 细节
![File-Linux基础-2520251114-6](/images/from-obsidian/File-Linux基础-2520251114-6.png)
**r表示读权限 W表示写权限 x表示执行权限**
针对文件、文件夹的不同，rwx的含义有细微差别
- r，针对文件可以查看文件内容，针对文件夹，可以查看文件夹内容，如ls命令 
- w，针对文件表示可以修改此文件，针对文件夹，可以在文件夹内进行创建、删除、改名等操作
- x，针对文件表示可以将文件作为程序执行，针对文件夹，表示可以更改工作目录到此文件夹，即cd进入
![[Linux命令#数字序号]]
# 各类快捷键
**ctrl + c** 强制停止
**ctrl + d** 退出或登出（不能退vi/vim）

**history** 列出历史输入过的命令
**! + 最近命令的前缀** 执行最近的命令
**ctrl + r** 输入内容匹配历史命令 如果搜索到的内容是你需要的，那么：
- 回车键可以直接执行
- 键盘左右键，可以得到此命令（不执行）

**ctrl + a**，跳到命令开头
**ctrl + e**，跳到命令结尾
**ctrl + 键盘左键**，向左跳一个单词
**ctrl + 键盘右键**，向右跳一个单词

**ctrl + l** 清空中端内容=\=clear
# 软件安装
## 系统内应用商店
yum：rpm包软件管理器，用于自动化安装配置Linux软件，并可以自动解决依赖问题
[[Linux命令#yum命令]]
## 安装包安装
# 时间
## 查看
![[Linux命令#date命令]]
## 自动调整
1.我们可以通过ntp程序自动校准系统时间
安装ntp:
`yum -y install ntp`
启动并设置开机自启：
`systemctl start ntpd`
`systemctl enable ntpd`
当ntpd启动后会定期的帮助我们联网校准系统的时间

也可以手动校准（需root权限）：
`ntpdate -u ntp.aliyun.com`![File-Linux基础-2520251124](/images/from-obsidian/File-Linux基础-2520251124.png)

2.如何修改Linux时区
`rm -f /etc/localtime`
`sudo ln -s /usr/share/zoneinfo/Asia/shanghai /etc/localtime`
# IP地址
## 查看
ifconfig命令，无法使用就自行安装`yum -y install net-tools `
## 特殊的ip地址
127.0.0.1回环地址，指代本主机
0.0.0.0
- 可以用于指代本机
- 可以在端口绑定中用来确定绑定关系（后续讲解）
- 在一些P地址限制中，表示所有P的意思，如放行规则设置为0.0.0.0，表示充许任意IP访问
# 主机名
主机的名称，用于标识一个计算机
## 设置主机名
`hostname`查看主机名
`hostnamectl set-hostname 主机名`修改主机名（需要root）
# 域名解析
## 什么是域名
IP地址实在是难以记忆，有没有什么办法可以通过主机名或替代的字符地址去代替数字化的IP地址呢？
实际上，我们一直都是通过字符化的地址去访问服务器，很少指定IP地址。
比如，我们在浏览器内打开：www.baidu.com，会打开百度的网址。
其中，www.baidu.com，是百度的网址，我们称之为：域名![File-Linux基础-2520251124-1](/images/from-obsidian/File-Linux基础-2520251124-1.png)
## 配置本地私人地址本-host文件
需要管理员权限
`xxx.xxx.xxx.xxx 主机名`
或
`xxx.xxx.xxx.xxx www.xxxxxx.com`
把右边的名字替换为左边的ip，构建映射关系。
# 端口
## 概念
端口，是设备与外界通讯交流的出入口。
端口可以分为：物理端口和虚拟端口两类
- 物理端口：又可称之为接口，是可见的端口，如USB接口，RJ45网口，HDMI端口等
- 虚拟端口：是指计算机内部的端口，是不可见的，是用来操作系统和外部进行交互使用的
Linux系统是一个超大号小区，可以支持65535个端口，这6万多个端口分为3类进行使用
- 公认端口：1~1023，通常用于一些系统内置或知名程序的预留使用，如SSH服务的22端口，HTTPS服务的443端口非特殊需要，不要占用这个范围的端口
- 注册端口：1024~49151，通常可以随意使用，用于松散的绑定一些程序、服务
- 动态端口：49152~65535，通常不会固定绑定程序，而是当程序对外进行网络链接时，用于临时使用
> [!example]-
> 如图中![File-Linux基础-2520251127-1](/images/from-obsidian/File-Linux基础-2520251127-1.png)计算机A的微信连接计算机B的微信，A使用的50001即动态端口，临时找一个端口作为出口。计算机B的微信使用端口5678，即注册端口，长期绑定此端口等待别人连接
## 作用
![File-Linux基础-2520251127](/images/from-obsidian/File-Linux基础-2520251127.png)
# 环境变量
环境变量是操作系统（windows、Linux、Mac）在运行的时候，记录的一些关键性信息，用以辅助系统运行
在Linux系统中执行：[[Linux命令#env命令]]即可查看当前系统中记录的环境变量
环境变量是一种KeyValue型结构，即名称和值，如下图：![File-Linux基础-2520251201](/images/from-obsidian/File-Linux基础-2520251201.png)
## 环境变量PATH![File-Linux基础-2520251201-1](/images/from-obsidian/File-Linux基础-2520251201-1.png)
## $符号
![File-Linux基础-2520251201-2](/images/from-obsidian/File-Linux基础-2520251201-2.png)
## 自行设置环境变量
![File-Linux基础-2520251201-3](/images/from-obsidian/File-Linux基础-2520251201-3.png)
# 压缩文件
Linux和Mac系统常用有2种压缩格式，后缀名分别是：
- tar，称之为tarball，归档文件，即简单的将文件组装到一个.tar的文件内，并没有太多文件体积的减少，仅仅是简单的封装
- gz，也常见为.tar.gz，gzip格式压缩文件，即使用gzip压缩算法将文件压缩到一个文件内，可以极大的减少压缩后的体积
针对这两种格式，使用[[Linux命令#tar命令]]均可以进行压缩和解压缩的操作