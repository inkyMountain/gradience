(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{35:function(e,t,n){"use strict";var a=n(2),o=n(0),l=n(3);const c={red:["#C14953","#CD5D67","#DAA49A","#FFBCB5","#FBBFCA","#C99DA3","#EDB6A3"],orange:["#E88873","#F19A3E","#D0A98F","#EABDA8","#F34213","#FC814A","#E5B25D","#F7A278","#F49D37"],yellow:["#F6E27F","#E2C391","#F5CB5C","#F9DF74","#F2DD6E","#FFCB47","#FFCB47","#F5CB5C","#E6AF2E"],green:["#C2FBEF","#7DAA92","#ABEDC6","#98D9C2","#B9FFB7","#BFD7B5","#A3C4BC","#9CBFA7","#BAD9B5"],blue:["#86BBD8","#C1DBE3","#C0E8F9","#66C3FF","#5C80BC","#95B8D1","#C2EFEB","#9AC2C9"],khaki:["#F2E7C9","#EDD4B2","#CAC2B5","#ECDCC9","#C2A878","#E2C290","#F9EDCC","#BCAB79"]},r=e=>/^#[\da-z]{6,8}$/.test(e||"");t.a=o.memo(e=>{const{className:t,children:n,color:i,disable:s,onClick:m,ghost:C}=e,d=Object(a.b)(e,["className","children","color","disable","onClick","ghost"]);i&&!r(i)&&console.error("The custom color you pass is invalid. Change it to meet\n   this regex: /^#[\\da-z]{6,8}$/, for example #ffffff .");const u=i&&r(i)?i:(e=>{const t=c[e];return t[Math.floor(Math.random()*t.length)]})(e.colortype||(()=>{const e=["red","orange","yellow","green","blue","khaki"];return e[Math.floor(Math.random()*e.length)]})()),g={backgroundImage:`linear-gradient(to right, ${u}66, white)`,border:u+" 1px solid"};return C&&delete g.backgroundImage,o.createElement("button",Object.assign({className:Object(l.a)("gui-button",""+(s?"disable":""),t)},d,{style:g,onClick:e=>{!0!==s&&m&&m(e)}}),n)})},81:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),l=n(35),c=n(2),r=n(11),i=n.n(r),s=n(3);const m=["linear-gradient(to right bottom, #e0fefb 0%, #f2e2e0 100%)","linear-gradient(to right bottom, #A1FFCE, #FAFFD1)","linear-gradient(to right bottom, #1c92d2, #f2fcfe)","linear-gradient(to right bottom, #4AC29A, #BDFFF3)"],C=e=>{const{className:t,visible:n,children:r,onConfirm:C,titleNode:d,buttons:u,onCancel:g}=e,b=Object(c.b)(e,["className","visible","children","onConfirm","titleNode","buttons","onCancel"]),E=m[Math.floor(Math.random()*m.length)],F=o.a.createElement(a.Fragment,null,o.a.createElement(l.a,{className:Object(s.a)("gui-cancel ","gui-button"),onClick:e=>{C&&C(e)},colortype:"red"},"取消"),o.a.createElement(l.a,{className:Object(s.a)("gui-confirm","gui-button"),onClick:e=>{g&&g(e)},colortype:"blue"},"确定")),f=o.a.createElement(a.Fragment,null,o.a.createElement("div",{className:"gui-dialog-mask",onClick:e=>{g&&g(e)}}),o.a.createElement("div",Object.assign({className:Object(s.a)("gui-dialog",t)},b,{style:{backgroundImage:E}}),d&&o.a.createElement("header",{className:"gui-title"},d),o.a.createElement("main",{className:"gui-content"},r),o.a.createElement("footer",{className:"gui-buttons"},u||F)));return n?i.a.createPortal(f,document.body):null},d=({content:e,buttons:t,title:n})=>{const a=document.createElement("div");a.classList.add("gui-dialog-container"),document.body.appendChild(a);const l=o.a.createElement(C,{visible:!0,buttons:t,onCancel:()=>{c()},titleNode:n},e),c=()=>{i.a.render(o.a.cloneElement(l,{visible:!1}),a),i.a.unmountComponentAtNode(a),a.remove()};return i.a.render(l,a),c};var u=C;const g=()=>{const e=(({content:e,buttons:t,title:n})=>d({content:e,buttons:t,title:n}))({content:o.a.createElement("div",{className:"content"},"这里是自定义内容"),buttons:o.a.createElement(a.Fragment,null,o.a.createElement(l.a,{onClick:()=>{e()}},"自定义的取消"),o.a.createElement(l.a,{onClick:()=>{e()}},"自定义的确认")),title:o.a.createElement("div",{className:"title"},"自定义标题")})},b=()=>(({content:e,onConfirm:t})=>{const n=d({content:e,buttons:o.a.createElement(l.a,{onClick:e=>{t&&t(e),n()}},"确认")})})({content:o.a.createElement("div",null,"这是一个alert"),onConfirm:e=>{console.log("Alert confirmed")}}),E=()=>{const e=(({onConfirm:e,onCancel:t,content:n})=>{const c=o.a.createElement(a.Fragment,null,o.a.createElement(l.a,{className:Object(s.a)("gui-cancel ","gui-button"),onClick:t,colortype:"red"},"取消"),o.a.createElement(l.a,{className:Object(s.a)("gui-confirm","gui-button"),onClick:e,colortype:"blue"},"确定"));return d({content:n,buttons:c})})({onConfirm:()=>{e(),console.log("confirm")},onCancel:()=>{e(),console.log("cancel")},content:o.a.createElement("div",{className:"content"},"这里是内容")})};t.default=e=>{const[t,n]=Object(a.useState)(!1),c=o.a.createElement("div",{className:"title"},"标题");return o.a.createElement("div",{className:"page-dialog"},o.a.createElement(l.a,{onClick:()=>n(!0)},"打开对话框"),o.a.createElement(l.a,{onClick:b},"Alert"),o.a.createElement(l.a,{onClick:E},"Confirm"),o.a.createElement(l.a,{onClick:g},"Modal"),o.a.createElement(u,{visible:t,onConfirm:()=>{console.log("Dialog confirmed~"),n(!1)},onCancel:()=>{n(!1),console.log("Dialog cancled~")},titleNode:c},o.a.createElement("div",{className:"dialog-content"},"中间的文字")))}}}]);