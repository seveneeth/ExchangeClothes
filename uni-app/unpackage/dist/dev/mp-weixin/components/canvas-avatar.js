(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/canvas-avatar"],{"0233":function(t,e,a){},"79e2":function(t,e,a){"use strict";var s=a("0233"),c=a.n(s);c.a},e369:function(t,e,a){"use strict";var s;a.r(e);var c,i=function(){var t=this,e=t.$createElement;t._self._c},r=[],n=a("1003"),h=a("ec53"),d=a("6a5f"),o={name:"CanvasAvatar",props:{cfg:{type:Object,default:null},width:{type:Number,default:300},height:{type:Number,default:525},svg:{type:String,default:""}},data(){return{cid:""}},computed:{boxStyle(){return"width:"+this.width+"px;height:"+this.height+"px;display:block;"}},created(){this.cid="cav"+Math.random().toString(36).slice(2,8)},mounted(){this.$nextTick(()=>this.draw())},watch:{cfg(){this.draw()},svg(){this.draw()},width(){this.$nextTick(()=>this.draw())},height(){this.$nextTick(()=>this.draw())}},methods:{draw(){const t=this.svg||(this.cfg?Object(n["j"])(this.cfg,{}):"");t&&Object(d["a"])(this,this.cid).then(e=>{if(!e)return;const{canvas:a,ctx:s,dpr:c,cssW:i,cssH:r}=e;s.setTransform(1,0,0,1,0,0),s.clearRect(0,0,a.width,a.height),s.scale(c*(i/320),c*(r/560));try{Object(h["a"])(s,t)}catch(n){console.warn("svg2canvas draw error",n)}s.setTransform(1,0,0,1,0,0)})}}},l=o,u=(a("79e2"),a("828b")),f=Object(u["a"])(l,i,r,!1,null,"7936671e",null,!1,s,c);e["default"]=f.exports}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/canvas-avatar-create-component',
    {
        'components/canvas-avatar-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('df3c')['createComponent'](__webpack_require__("e369"))
        })
    },
    [['components/canvas-avatar-create-component']]
]);
