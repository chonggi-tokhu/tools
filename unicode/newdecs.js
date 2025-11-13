(function (gTh, ConvertDec) { "object" == typeof exports && "undefined" != typeof module ? module.exports = ConvertDec() : "function" == typeof define && define.amd ? define(ConvertDec) : (gTh = "undefined" != typeof globalThis ? globalThis : gTh || self).CGRConvertDec = ConvertDec() })(this, function () {

            var systemstr='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            function toDec(code, charMap) {
                if (typeof code !== 'string' || !(charMap instanceof Array)) {
                    return 'ERROR: invalid parameter' | false;
                }
                var value = 0;
                for (var i = 0; i < code.length; i++) {
                    var chunk = code[i];
                    console.log(chunk);
                    value = value * charMap.length + (charMap.indexOf(chunk) < 0 ? 0 : charMap.indexOf(chunk));
                }

                return value;
            }
            function fromDec(code, charMap) {
                if (!(charMap instanceof Array) || typeof code !== 'number' || isNaN(code)) {
                    return 'ERROR: invalid parameter' | false;
                }
                var value = code;
                var res = '';
                var stop = 0;
                while (value > 0) {
                    var _0 = value % charMap.length;
                    res = charMap[_0] + res;
                    value = (value - _0) / charMap.length;
                    stop++;
                }
                return res;
            }
            var converter = {
                systemstr:'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                convert: function (codenumb = '', from, to,{cap, strp/*  = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' */}={cap:true,strp:false}) {
                    return fromDec(toDec(cap?codenumb.toUpperCase():codenumb, (strp || this.systemstr).slice(0, from).split('')), (strp||this.systemstr).slice(0, to).split(''));
                },
                change_systemstr:function(strp){
                    if (!(strp instanceof String ||typeof strp==='string')){
                        return;
                    }
                    this.systemstr=strp;
                },
                fromDec:fromDec,
                toDec:toDec,

            };
            return {converter:converter};
        
});
