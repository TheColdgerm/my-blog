---
title: "latex语法"
published: 2025-10-15
draft: false
description: ""
tags: []
category: "编码"
---

  https://www.cnblogs.com/1024th/p/11623258.html
# up1
1、行内公式

语法：$ 编写公式位置 $

2、单行公式

语法：$$ 编写公式位置 $$

3、上标

语法：2^{上标}

> 2^3=8

4、下标

语法：H_{下标}

> 2H+O=H_2O

5、分式

语法一：\frac{分子}{分母}

> \frac 2 3

语法二：\dfrac{分子}{分母}

> \dfrac 2 3

6、开方

语法：\sqrt[开方数]{被开方数}

> \sqrt[2]{3}

7、绝对值

语法：||

> |-5|

8、加减

语法：\pm

> 2 \pm 3

9、减加

语法：\mp

> 2 \mp 3

10、乘法

语法：\times

> 2 \times 5

11、除法

语法：\div

> 2 \div 3

12、求和

语法：\sum

> Σ

13、对数

语法：\log

> \log

14、极限

语法：\lim

> \lim

15、因为

语法：\because

> ∵

16、所以

语法：\therefore

> ∴
# up2
**1.希腊字母**

**(1)小写希腊字母表：**
$$
\alpha\beta\gamma\delta\epsilon\varepsilon\alpha\beta\gamma\delta\epsilon\varepsilon**\zeta\eta\theta\vartheta\iota\kappa**\zeta\eta\theta\vartheta\iota\kappa**\lambda\mu\nu\xio\pi**\lambda\mu\nu\xio\pi**\varpi\rho\varrho\sigma\varsigma\tau**\varpi\rho\varrho\sigma\varsigma\tau**\upsilon\phi\varphi\chi\psi\omega**\upsilon\phi\varphi\chi\psi\omega
$$
**(2)大写希腊字母表：**
$$
\alpha\Gamma\Delta\Theta\Lambda\Xi\alpha\Gamma\Delta\Theta\Lambda\Xi**\Alpha\varGamma\varDelta\varTheta\varLambda\varXi**\Alpha\varGamma\varDelta\varTheta\varLambda\varXi**\gamma\delta\theta\lambda\xi**\gamma\delta\theta\lambda\xi**\vartheta**\vartheta
$$
$$
**\Sigma\Upsilon\Phi\Psi\Omega\Pi**\Sigma\Upsilon\Phi\Psi\Omega\Pi**\varSigma\varUpsilon\varPhi\varPsi\varOmega\varPi**\varSigma\varUpsilon\varPhi\varPsi\varOmega\varPi**\sigma\upsilon\phi\psi\omega\pi**\sigma\upsilon\phi\psi\omega\pi**\varsigma\varphi\varpi**\varsigma\varphi\varpi
$$
**(3)希腊字母表(图片传送门)：**

$$

\delta,\Delta\\ \phi,\varphi,\Phi,\varPhi

$$

**2.斜体和直立体**

**ps：**

**英文字母只有在表示变量(或单一字符的函数名称，如****_f(x)_****)时才可使用斜体，其余情况都应使用罗马体(直立体)。**

**x_i：i表示 1，2，...，n 为变量**

**x_{\rm i}：{\rm i}表示"输入"(input)之意，为普通文本**

**Eg: e：自然对数的底数，为常量； i，j：虚数单位，为常量**

**运算符名称超过一个字母时应该使用直立体(Eg:max× \max√ )**

**(0)斜体(默认)(不兼容空格)：[符号]**

$$

x_i=y_j\\ x_{i j}=y_{j i}

$$

**(1)罗马体****_roman_****(不兼容空格)：[ {\rm 符号} ] [ {\rm {符号组}} ]**

$$

x_{\rm i}=y_{\rm j}\\ x_{\rm {i j}}=y_{\rm {j i}}

$$

**(2)文本格式****_text_****(兼容空格)：[ {\text 文本} ] [ {\text {文本组}} ]**

$$

x_{\text i}=y_{\text j}\\ x_{\text {i j}}=y_{\text {j i}}

$$

**3.上下标**

**(1)上标：[ 符号^单个上标 ] [ 符号^{多个上标} ]**

**(2)下标：[ 符号****_单个下标 ] [ 符号_{多个下标} ]**

$$

a^2,A_1\\ a^{114514},A_{1919810}

$$

**4.分式与根式**

**(1)分式&分式中分式变大式：[ \frac{分子}{分母} ] [ \dfrac{分子}{分母} ]**

ps:\dfrac仅在Typora中适用

$$

\frac{2}{4}=\frac{1}{2}\\ f(x)=\frac{1}{x+y}\\ \frac{x+y}{\frac{1}{x}+\dfrac{1}{y}}

$$

**(2)根式：[ \sqrt{符号} ] [ \sqrt[次方数]{符号} ]**

$$

\sqrt{1+3}=\sqrt 4=2\\ \sqrt[3]{8}=2\\ \sqrt[4]{\sqrt{\frac{2}{x}}+1}

$$

**5.普通运算符**

**(1)常用运算符查询表**

**[图片传送门]**
\begin{align}

\times
\cdot%(centre)%
\div%(divide)%
\times%(叉乘)%
\cdot%(点乘)%
\div=\pm%(plus-minus)%
\mp%(minus-plus)%
\ge%(greater_than_or_euqal)%
\le%(less_than_or_equal)%
\pm%(加减)%
\mp%(减加)%
\ge%(大于等于)%
\le%(小于等于%
\gg
\ll
\ne%(not_equal)%
\approx%(approximate)%
\equiv%(equivalent)%
\varnothing
\gg%(远大于)%
\ll%(远小于)%
\ne%(不等于)%
\approx%(约等于)%
\equiv%(恒等于)%
\varnothing%(空集)%

\cap\cup\in\notin\subseteq\subseteqq
\cap%(交集)%
\cup%(并集)%
\in%(属于)%
\notin%(不属于)%
\subseteq%(子集)%
\subseteqq%(真子集)%

\forall\exists\nexists\because\therefore\mathbb Y%(bboard_bold)%
\forall%(对任意)%
\exists%(存在)%
\nexists%(不存在)%
\because
\therefore
\mathbb Y%(黑板粗体)%

\R\Q\N\Z\Z_+\Z_-
\R%(实数集)%
\Q%(有理数集)%
\N%(自然数集)%
\Z%(整数集)%
\Z_+%(正整数集)%
\Z_-%(负整数集)%

\mathcal\mathscr\cdots\vdots\ddots\infty
\mathcal F%(书法体)%
\mathscr F%(手迹体/花体)%
\cdots%(省略号)%
\vdots%竖直省略号)%
\ddots%(斜省略号)%

\infty\partial\nabla/propto\degree\sin x\max
\partial%(偏导)%
\nabla%(微分算子%)%
\propto%(正比)%
\degree%(度)
\sin x
\max
\log_n m
\ln x

\to\lim_{x \to y}z\lim\limits_{x \to y}z\,\log_n m\ln x
\to%(趋近)%
\lim_{x \to y}z
\lim
\limits_{x \to y}z%（极限）% 
A\,B%(小间隔)%

**6.大型运算符**

**(1)求和&乘积：[\sum] & [\prod]**

$$

\sum,\prod\\ \sum_i,\sum_{i=1}^nx_i\\ \frac {\sum\limits_{i=1}^n x_i}{\prod\limits_{i=1}^n x_i}

$$

**(2)积分(integral)：[\int]**

$$\int\iint\iiint\iiiint\oint\oiint\oiiint\int\iint\iiint\iiiint\oint\oiint\oiiint
$$
**不定积分写法：\int f(x)**

> \int f(x)

**定积分写法：\int_{A}^{B}f(x)\,{\rm d}x**

> \int_{A}^{B}f(x)\,{\rm d}x

$$

\int,\iint,\iiint,\iiiint,\oint,\oiint,\oiiint\\ \int_{-\infty}^{+\infty}f(x)\,{\rm d}x\\

$$

**(3)间隔距离**

$$\<space> \quad\qquadA\,B(小空格)A\ B(普通空格)A\quadB(中空格)A\qquadB(大空格)
$$
A\,B\\ A\ B\\ A\quad B\\ A\qquad B



7.标注符号

$$
\hat{a}\tilde{a}\check{a}\acute{a}\grave{a}\breve{a}\hat{a}\tilde{a}\check{a}\acute{a}\grave{a}\breve{a}**\widehat{ABC}\widetilde{ABC}\bar{a}/vec{a}\dot{a}\ddot{a}**\widehat{ABC}\widetilde{ABC}\bar{a}\vec{a}\dot{a}\ddot{a}**\mathring{a}/overline{ABC}\overrightarrow{ABC}\dddot{a}\ddddot{a}**\mathring{a}\overline{ABC}\overrightarrow{ABC}\dddot{a}\ddddot{a}
$$

**8.箭头**

$$

\leftarrow \gets\rightarrow \to\leftrightarrow\Leftrightarrow\leftarrow \gets\rightarrow \to\leftrightarrow\Leftrightarrow**\longleftarrow\longrightarrow\longleftrightarrow\Longleftrightarrow \iff**\longleftarrow\longrightarrow\longleftrightarrow\Longleftrightarrow \iff**\Leftarrow\Rightarrow\mapsto\hookleftarrow**\Leftarrow\Rightarrow\mapsto\hookleftarrow**\Longleftarrow\Longrightarrow\longmapsto\hookrightarrow**\Longleftarrow\Longrightarrow\longmapsto\hookrightarrow**\leftharpoonup\rightharpoonup\leftharpdown\rightharpoondown**\leftharpoonup\rightharpoonup\leftharpoondown\rightharpoondown**\uparrow\downarrow\updownarrow\rightleftharpoons**\uparrow\downarrow\updownarrow\rightleftharpoons**\Uparrow\Downarrow\Updownarrow\leadsto^\mathscr l**\Uparrow\Downarrow\Updownarrow\leadsto^\mathscr l**\nearrow\searrow\swarrow\nwarrow**\nearrow\searrow\swarrow\nwarrow

$$

**9.括号与定界符**
$$
（,）[,]\ {\ }\lceil\rceil\lfloor\rfloor|(,)[,]\{\}\lceil\rceil\lfloor\rfloor|
$$
**自适应括号：\left左括号 \right右括号**

**虚拟自适应括号：\left. \right.**

$$

(AAA)[BBB]\{CCC\}\\ \{A[B(C)B]A\}\\ (\frac{1}{x},\infty]\qquad \left(\frac{1}{x},\infty\right]\\ \frac{\partial y}{\partial x}|_{x=0}\qquad \left.\frac{\partial y}{\partial x}\right|_{x=0}

$$

**10.多行公式**

**(1)align环境：**

**\begin{align}**

> LaTex01\\

> LaTex02\\

> ...

> LaTex n

**\end{align}**

**(2)自定义对齐(默认右对齐中线)：&(等距离空格拉伸)**

$$

\begin{align} abcabc\\ ABCABC\\ a&=b+c\\ &=e+f+g \end{align}

$$

**11.大括号**

**(1)cases环境：**

**\begin{cases}**

> LaTex01\\

> LaTex02\\

> ...

> LaTex n

**\end{cases}**

**(2)自定义对齐(默认右对齐中线)：&(等距离空格拉伸)**

$$

f(x)= \begin{cases} \sin x &(x\ge1)\\ \cos x &(0\le x<1)\\ 0 &(x<0) \end{cases}

$$

**12.矩阵**

**(1)矩阵环境：**

matrixbmatrixpmatrixvmatrix无括号方括号圆括号竖直括号(行列式)

**\begin{环境}**

> LaTex01\\

> LaTex02\\

> ...

> LaTex n

**\end{环境}**

$$

\begin{matrix} \tag{matrix:无括号} 1&0&0&\cdots&0\\ 0&1&0&\cdots&0\\ 0&0&1&\cdots&0\\ \vdots&\vdots&\vdots&\ddots&\vdots\\ 0&0&0&\cdots&1 \end{matrix}

$$

$$

\begin{bmatrix} \tag{bmatrix:方括号} 1&0&0&\cdots&0\\ 0&1&0&\cdots&0\\ 0&0&1&\cdots&0\\ \vdots&\vdots&\vdots&\ddots&\vdots\\ 0&0&0&\cdots&1 \end{bmatrix}

$$

$$

\begin{pmatrix} \tag{pmatrix:圆括号} 1&0&0&\cdots&0\\ 0&1&0&\cdots&0\\ 0&0&1&\cdots&0\\ \vdots&\vdots&\vdots&\ddots&\vdots\\ 0&0&0&\cdots&1 \end{pmatrix}

$$

$$

\begin{vmatrix} \tag{vmatrix:行列式} 1&0&0&\cdots&0\\ 0&1&0&\cdots&0\\ 0&0&1&\cdots&0\\ \vdots&\vdots&\vdots&\ddots&\vdots\\ 0&0&0&\cdots&1 \end{vmatrix}

$$

**(2)矩阵名称：[\bf 字母] (bold face黑色粗体)**

$$

\bf A= \begin{pmatrix} 1&0\\ 0&1 \end{pmatrix}

$$

**(3)矩阵转置：[\bf 矩阵名^{\rm T}]**

$$

\begin{align} {\bf B}= &\begin{pmatrix} 1&2\\ 3&4 \end{pmatrix}\\\\ {\bf A}={\bf B^{\rm T}}= &\begin{pmatrix} 1&3\\ 2&4 \end{pmatrix} \end{align}

$$

**13.复合LaTeX实例**

**(1)正态分布**

$$

\begin{align} &f(x)=\frac{1}{\sqrt{2\pi}\sigma}{\rm e}^{-\frac{(x-\mu)^2}{2\sigma^2}}\\ &f(x)=\frac{1}{\sqrt{2\pi}\sigma}\exp\left[{-\frac{(x-\mu)^2}{2\sigma^2}}\right] \end{align}

$$

**(2)极限例式**

$$

\lim\limits_{N\to\infty}P\left\{\left|\frac{I\left(\alpha_i\right)}{N}-H(s)\right|<\varepsilon\right\}=1

$$

**(3)积分例式**

$$

x(n)=\frac{1}{2\pi}\int_{-\pi}^\pi X\left({\rm e^{{\rm j}\omega}}\right){\rm e}^{{\rm j}\omega n}\,{\rm d}\omega

$$

**(4)复合例式**

$$

\begin{align} \vec{B}\left(\vec{r}\right)&=\frac{\mu_0}{4\pi}\oint_C\frac{I\,{\rm d}\vec{l}\times\vec{R}}{R^3}\\ &=\frac{\mu_0}{4\pi}\int_V\frac{\vec{J}_V\times\vec{R}}{R^3}\,{\rm d}V' \end{align}

$$