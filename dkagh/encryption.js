(function (gTh, mod) { "object" === typeof exports && "undefined" !== typeof module ? module.exports = mod() : "function" === typeof define && define.amd ? define(mod) : (gTh = "undefined" !== typeof globalThis ? globalThis : gTh || self).ColourgreyEncryptionSystem = mod(); })(this, function () {/*
var codeMap = {
    '♟': 0,
    '♞': 1,
    '♝': 2,
    '♜': 3,
    'P': 4,
    'C': 5,
    '♛': 6,
    'A': 7,
    '♚': 8,
};
var charMap = [
    '♟',
    '♞',
    '♝',
    '♜',
    'P',
    'C',
    '♛',
    'A',
    '♚'
];
*/

function getUTF8Hexadec(code,base){
  var bin=CGRConvertDec.converter.convert(code,base,2).replace(/[^01]/g,"");
  var arr=[],binToHexadecArr=[],lastLen=0;
  /* if (bin.length>31){

  } else if (bin.length>26){

  } else if (bin.length>21){
    
  } else if (bin.length>16){
    
  } else if (bin.length>11){
    
  } else if (bin.length>7){
    
  } */
  if (code>2**31){
  } else if (code>2**26){
    bin="0".repeat(31-bin.length)+bin;
    arr=["1111110*","10******","10******","10******","10******","10******"];
  } else if (code>2**21){
    bin="0".repeat(26-bin.length)+bin;
    arr=["111110**","10******","10******","10******","10******"];
  } else if (code>2**16){
    bin="0".repeat(21-bin.length)+bin;
    arr=["11110***","10******","10******","10******"];
  } else if (code>2**11){
    bin="0".repeat(16-bin.length)+bin;
    arr=["1110****","10******","10******"];
  } else if (code>2**7){
    bin="0".repeat(11-bin.length)+bin;
    arr=["110*****","10******"]
  } else if (code>-1){
    bin="0".repeat(7-bin.length)+bin;
    arr=["0*******"];
  }
    console.log(bin);
    console.log(arr);
  for (var i = 0;i<arr.length;i++){
      var blanks=arr[i].replace(/[^\*]/g,'');
    var len = blanks.length;
      console.log(len);
    binToHexadecArr.push(arr[i].replace(blanks, bin.slice(lastLen,lastLen+len)));
      console.log(lastLen);
    lastLen += len;
  }
    console.log(binToHexadecArr);
  return binToHexadecArr.map(val=>CGRConvertDec.converter.convert(val,2,16));
}
var unicodeUsing={
  0:getUTF8Hexadec
}
function getUnicodeChar(code,base,encoding=0){
  if (typeof unicodeUsing[encoding]!=="function"){
    return "";
  }
  var uInt8Arr = Uint8Array.from(unicodeUsing[encoding](code,base).map(val=>Number(CGRConvertDec.converter.convert(val,16,10))));
  return new TextDecoder().decode(uInt8Arr);
}
    function decodeCode(code, codeMap, chunkSize, charsForOneUnicode) {
        if (typeof code !== 'string' || !(typeof codeMap === 'object' && codeMap !== null) || typeof chunkSize !== 'number' || isNaN(chunkSize)) {
            return 'ERROR: invalid parameter' | false;
        }
        if (typeof charsForOneUnicode !== 'number' || isNaN(charsForOneUnicode)) {
            charsForOneUnicode = 1;
        }
        var result = '';
        for (var i = 0; i < code.length; i += chunkSize * charsForOneUnicode) {
            var chunk = code.slice(i, i + chunkSize * charsForOneUnicode);
            var value = 0;

            for (var j = 0; j < chunk.length; j += charsForOneUnicode) {
                value = value * Object.keys(codeMap).length + codeMap[chunk.slice(j, j + charsForOneUnicode)];
            }

            result += getUnicodeChar(value,10);
        }

        return result;
    }
    function encodeCode(code, charMap, chunkSize, charsForOneUnicode) {
        if (typeof code !== 'string' || !(charMap instanceof Array) || typeof chunkSize !== 'number' || isNaN(chunkSize)) {
            return 'ERROR: invalid parameter' | false;
        }
        var result = '';
        for (var i = 0; i < code.length; i++) {
            var value = code.charCodeAt(i);
            var res = '';
            for (var j = 0; j < chunkSize; j++) {
                var _0 = value % charMap.length;
                res = charMap[_0] + res;
                value = (value - _0) / charMap.length;
            }
            result += res;
        }
        return result;
    }
    var modObj = {
        config: {
            charMap: ['天', '地', '玄', '黃', '宇', '宙', '洪', '荒'],
            codeMap: { '天': 0, '地': 1, '玄': 2, '黃': 3, '宇': 4, '宙': 5, '洪': 6, '荒': 7 },
            chunkSize: 6,
            charsForOneUnicode: 1,
        },
        decodeCode: decodeCode,
        encodeCode: encodeCode,
        decode: function (strparam) {
            return this.decodeCode(strparam, this.config.codeMap, this.config.chunkSize);
        },
        encode: function (strparam) {
            return this.encodeCode(strparam, this.config.charMap, this.config.chunkSize);
        },
        codeMapFromCharMap: function (charMap) {
            if (!(charMap instanceof Array)) {
                return 'Error: invalid parameter' | false;
            }
            var rtv = {};
            for (var i = 0; i < charMap.length; i++) {
                rtv[charMap[i]] = i;
            }
            return rtv;
        },
        modifyConfig: function ({ charMap, codeMap, chunkSize }) {
            var rtboolsarr = [true, true, true];
            var rtbool = true;
            this.config.charMap = (!(charMap instanceof Array)) ? (() => { rtboolsarr[0] = false; return this.config.charMap })() : charMap;
            this.config.codeMap = (typeof codeMap !== 'string' || codeMap === null) ? (() => { rtboolsarr[1] = false; return this.codeMapFromCharMap(this.config.charMap) })() : codeMap;
            this.config.chunkSize = (typeof chunkSize !== 'number' || isNaN(chunkSize)) ? (() => { rtboolsarr[2] = false; return this.config.chunkSize })() : chunkSize;
            rtbool = rtboolsarr[0] && rtboolsarr[1] && rtboolsarr[2];
            return {
                cleared: rtbool,
                whereProblemsAre: rtbool ? [-1] | null : (() => { var rtv = []; for (var i = 0; i < rtboolsarr.length; i++) { !rtboolsarr[i] ? rtv.push(i) : {}; } return rtv; })(),
                rtobj_0: { charMap, codeMap, chunkSize },
                rtobj_1: this.config,
            };
        },
    }
    var modObjClass = class {
        constructor({ charMap, codeMap, chunkSize, charsForOneUnicode }) {
            this.config.charMap = (!(charMap instanceof Array)) ? ['天', '地', '玄', '黃', '宇', '宙', '洪', '荒'] : charMap;
            /* 
             * I am NOT Chinese. I use Korean Traditional Chinese, NOT Simplified Chinese. So, you can see that I am Korean.
             * But what I strongly told a fact that I am Korean, not Chinese is not disparaging China. 
             * But it's true that there is strong antipathy towards China in South Korea.
             * ???...I think that I wrote useless stuff not related to programming.
            */
            this.config.codeMap = (typeof codeMap !== 'string' || codeMap === null) ? this.codeMapFromCharMap(charMap) : codeMap;
            this.config.chunkSize = (typeof chunkSize !== 'number' || isNaN(chunkSize)) ? 6 : chunkSize;
            this.config.charsForOneUnicode = (typeof charsForOneUnicode !== 'number' || isNaN(charsForOneUnicode)) ? 1 : charsForOneUnicode;
        }
        config = {
            charMap: ['天', '地', '玄', '黃', '宇', '宙', '洪', '荒'],
            /* 
             * Again, I am Korean, not Chinese. 다시 말하는데 나 한국인임. 짱깨새끼 아님. 간체자 안쓰고 정체자 쓰잖음? 
             * 특정 집단 혐오발언이랍시고 인성논란 터질까봐 미리 해명(이 아니라 정당화???)을 하는데, 꼭 읽어봐라.
             * '짱깨새끼'는 중국인을 비하하는 비속어지만, '모든' 중국인을 비하하는 비속어라고 한적 없음. 
             * 다시 말해 '짱깨새끼'라는 단어는 중국인들 전체에 대한 멸칭이 아니라 중화대륙의 냄새를 전세계에 골고루 풍기려고 지랄하는 일부 무개념 중국인들만을 뜻함. 
             * 고로 나는 특정 국가/민족 혐오발언이나 집단에 대한 멸칭을 쓴게 아니라 멸칭으로 불림당할만한 애들에 대해서만 멸칭을 쓴것임.
             * 즉 나는 잘못한게 없음(???)
            */
            codeMap: { '天': 0, '地': 1, '玄': 2, '黃': 3, '宇': 4, '宙': 5, '洪': 6, '荒': 7 },
            chunkSize: 6,
            charsForOneUnicode: 1,
        }
        decodeCode = decodeCode;
        encodeCode = encodeCode;
        decode(strparam) {
            return this.decodeCode(strparam, this.config.codeMap, this.config.chunkSize, this.config.charsForOneUnicode);
        }
        encode(strparam) {
            return this.encodeCode(strparam, this.config.charMap, this.config.chunkSize);
        }
        codeMapFromCharMap(charMap) {
            if (!(charMap instanceof Array)) {
                return 'Error: invalid parameter' | false;
            }
            var rtv = {};
            for (var i = 0; i < charMap.length; i++) {
                rtv[charMap[i]] = i;
            }
            return rtv;
        }
        modifyConfig({ charMap, codeMap, chunkSize, charsForOneUnicode }) {
            var rtboolsarr = [true, true, true, true];
            var rtbool = true;
            this.config.charMap = (!(charMap instanceof Array)) ? (() => { rtboolsarr[0] = false; return this.config.charMap })() : charMap;
            this.config.codeMap = (typeof codeMap !== 'string' || codeMap === null) ? (() => { rtboolsarr[1] = false; return this.codeMapFromCharMap(this.config.charMap) })() : codeMap;
            this.config.chunkSize = (typeof chunkSize !== 'number' || isNaN(chunkSize)) ? (() => { rtboolsarr[2] = false; return this.config.chunkSize })() : chunkSize;
            this.config.charsForOneUnicode = (typeof charsForOneUnicode !== 'number' || isNaN(charsForOneUnicode)) ? (() => { rtboolsarr[3] = false; return this.config.charsForOneUnicode })() : charsForOneUnicode;
            rtbool = rtboolsarr[0] && rtboolsarr[1] && rtboolsarr[2] && rtboolsarr[3];
            return {
                cleared: rtbool,
                whereProblemsAre: rtbool ? [-1] | null : (() => { var rtv = []; for (var i = 0; i < rtboolsarr.length; i++) { !rtboolsarr[i] ? rtv.push(i) : {}; } return rtv; })(),
                rtobj_0: { charMap, codeMap, chunkSize, charsForOneUnicode },
                rtobj_1: this.config,
            };
        }
    }

    var testingfunc = () => {
        var encryption = new modObjClass({ charMap: ['가나', '다라', '마바', '사아', '자차', '카타', '파하', '__'], chunkSize: 6 });
        var encoded = encryption.encode('나는 중국인 아님');
        console.log(encoded);
        var decoded = encryption.decode(encoded);
        console.log(decoded);
    }
    //testingfunc();
    return modObjClass;

})

