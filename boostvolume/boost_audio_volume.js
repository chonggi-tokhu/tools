var lamejsbool = window['Module'] ? true : false;
var lamejs = lamejsbool?window['Module']:false;
function audioBufferToWav(aBuffer) {
  let numOfChan = aBuffer.numberOfChannels,
    btwLength = aBuffer.length * numOfChan * 2 + 44,
    btwArrBuff = new ArrayBuffer(btwLength),
    btwView = new DataView(btwArrBuff),
    btwChnls = [],
    btwIndex,
    btwSample,
    btwOffset = 0,
    btwPos = 0;
  setUint32(0x46464952); // "RIFF"
  setUint32(btwLength - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(aBuffer.sampleRate);
  setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit
  setUint32(0x61746164); // "data" - chunk
  setUint32(btwLength - btwPos - 4); // chunk length

  for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
    btwChnls.push(aBuffer.getChannelData(btwIndex));

  while (btwPos < btwLength) {
    for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
      // interleave btwChnls
      btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
      btwSample =
        (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
      btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
      btwPos += 2;
    }
    btwOffset++; // next source sample
  }

  let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));

  //Stereo
  let data = new Int16Array(btwArrBuff, wavHdr.dataOffset, wavHdr.dataLen / 2);
  let leftData = [];
  let rightData = [];
  for (let i = 0; i < data.length; i += 2) {
    leftData.push(data[i]);
    rightData.push(data[i + 1]);
  }
  var left = new Int16Array(leftData);
  var right = new Int16Array(rightData);

  if (AudioFormat === "MP3") {
    //STEREO
    if (wavHdr.channels === 2)
      return wavToMp3Stereo(
        wavHdr.channels,
        wavHdr.sampleRate,
        left,
        right,
      );
    //MONO
    else if (wavHdr.channels === 1)
      return wavToMp3(wavHdr.channels, wavHdr.sampleRate, data);
  } else return new Blob([btwArrBuff], { type: "audio/wav" });

  function setUint16(data) {
    btwView.setUint16(btwPos, data, true);
    btwPos += 2;
  }

  function setUint32(data) {
    btwView.setUint32(btwPos, data, true);
    btwPos += 4;
  }
}

function wavToMp3(channels, sampleRate, samples) {
    var buffer = [];
    var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
    var remaining = samples.length;
    var samplesPerFrame = 1152;
    for (var i = 0; remaining >= samplesPerFrame; i += samplesPerFrame) {
        var mono = samples.subarray(i, i + samplesPerFrame);
        var mp3buf = mp3enc.encodeBuffer(mono);
        if (mp3buf.length > 0) {
            buffer.push(new Int8Array(mp3buf));
        }
        remaining -= samplesPerFrame;
    }
    var d = mp3enc.flush();
    if(d.length > 0){
        buffer.push(new Int8Array(d));
    }

    var mp3Blob = new Blob(buffer, {type: 'audio/mp3'});
    var bUrl = window.URL.createObjectURL(mp3Blob);

    // send the download link to the console
    console.log('mp3 download:', bUrl);

}

/*var oldlog = console.log;
console.log=function(){
    document.body.innerHTML+=arguments.join('')+'<br>';
    oldlog.apply(null,arguments);
}
var olderror =console.error;
console.error=function(){
    document.body.innerHTML+=arguments.join('')+'<br>';
    olderror.apply(null,arguments)}*/
var myVideoElement = null;
var newVideoElement = null;
var recorder = null;
var recordingstream = null;
/**
 * 
 * @param {HTMLAudioElement} elparam 
 */
function init_myVideoEl(elparam) {
    if (!(elparam instanceof HTMLVideoElement)) {
        return false;
    }
    myVideoElement = elparam;
    return true;
}
var audioCtx = null;
var source = null;
var gainNode = null;
/**
 * 
 * @callback cbfuncofinit
 * @param {boolean} succeeded
 */
/**
 * 
 * @param {cbfuncofinit} cbfunc 
 */
function initialise(cbfunc) {
    source = audioCtx.createMediaElementSource(myVideoElement);
    gainNode = audioCtx.createGain();
    if (typeof cbfunc === 'function') {
        cbfunc(source !== null && gainNode !== null);
    }
}
function setAll() {
    gainNode.gain.value = 8;
    confirm(new String(gainNode?.gain?.value));
    var va = source.connect(gainNode);
    confirm(va);
    var vb = gainNode.connect(audioCtx.destination);
    confirm(vb);
    //source.start();
}
/**
 * @callback cbfuncofstartAll
 * @param {HTMLAudioElement} audioparam
 */
/**
 * 
 * @param {HTMLAudioElement} el 
 * @param {cbfuncofstartAll} cbfunc 
 */
function startAll(el, cbfunc) {

    audioCtx = new AudioContext();
    var videolElVarInitialised = init_myVideoEl(el);
    if (!videolElVarInitialised) {
        return false;
    }
    if (true) {
        source = audioCtx.createMediaElementSource(el);
        gainNode = audioCtx.createGain();
        gainNode.gain.value = !isNaN(Number(document.getElementById("gain")?.value)) ? Number(document.getElementById("gain")?.value) : 5;
        //confirm(new String(gainNode?.gain?.value));
        var va = source.connect(gainNode);
        //confirm(va);
        var vb = gainNode.connect(audioCtx.destination);
        //confirm(vb);
        recordingstream = audioCtx.createMediaStreamDestination();
        audioCtx.sampleRate = 8192;
        //recordingstream.connect(audioCtx.destination);
        console.log(recordingstream);
        if (typeof cbfunc === 'function') {
            return cbfunc(el);
        }
        return el;
    }
    var settingAllSucceeded = false;
    initialise((boolparam) => {
        confirm(boolparam);
        if (boolparam) {
            setAll();
            settingAllSucceeded = true;
        }
    });
    if (!settingAllSucceeded) {
        return false;
    }
    if (typeof cbfunc === 'function') {
        return cbfunc(myVideoElement);
    }
    return myVideoElement;
}
var _constraints = {
    audio: {
        channelCount: 2,
        sampleRate: 8192,
        sampleSize: 24,
        noiseSuppression: true,
    },
    video: false,
};
function init_newVideoEl(elparam) {
    if (!(elparam instanceof HTMLAudioElement)) {
        return false;
    }
    newVideoElement = elparam;
    return true;
}
/**
 * 
 * @param {HTMLAudioElement} newel 
 * @param {MediaStreamConstraints} _constraintsparam 
 */
async function recordAudio(newel, _constraintsparam) {
    if (!(newel instanceof HTMLAudioElement)) {
        return;
    }
    newel.srcObject = await navigator.mediaDevices.getDisplayMedia(_constraintsparam);
}
/**
 * 
 * @param {HTMLAudioElement} newel 
 */
async function stopRecordingAudio(newel) {
    if (!(newel instanceof HTMLAudioElement)) {
        return;
    }
    var tracks = newel.srcObject.getTracks();
    tracks.forEach((val, idx, arr) => {
        val.stop();
    });
}
async function recordAll(el, recordedel) {
    var videolElVarInitialised = init_newVideoEl(el);
    if (!videolElVarInitialised) {
        return false;
    }
    recordedel.onplay = async (ev) => {
        //el.srcObject = recordingstream.stream;
        await startrecording();
    }
    recordedel.onpause = async (ev) => {
        //var tracks = el.srcObject.getTracks();
        //tracks.forEach(track=>{track.stop()});
        await stoprecording();
    }
}
async function boostAndRecord(el, newel) {
    startAll(el, async (thel) => {
        await recordAll(newel, thel);
        thel.play();
    });
}
var recordedel = null;
var chunks = [];
var duration = 0;
var na = null;
            var mymp3=null;
async function startrecording() {
    //recordingstream = audioCtx.createMediaStreamDestination();
    /*recorder = new MediaRecorder(recordingstream.stream);
    recorder.start();*/
    var mediaStreamDestination = audioCtx.createMediaStreamDestination();
    gainNode.connect(mediaStreamDestination);
    recorder = new MediaRecorder(mediaStreamDestination.stream);
    recorder.stream.getTracks().forEach((val, idx, arr) => {
        arr[idx].applyConstraints(_constraints);
    })
    recorder.addEventListener('dataavailable', (ev) => {
        chunks.push(ev.data);
    });
    recorder.addEventListener('stop', (ev) => {
        if (lamejsbool){
            var reader = new FileReader();
            var blob0=new Blob(chunks, { type: 'audio/wav' });
            reader.readAsArrayBuffer(blob);
            reader.onloadend=(ev)=>{
                audioContext.decodeAudioData(reader.result,(audioBuffer)=>{
                    mymp3 = audioBufferToWav(audioBuffer);
                    recordedel.src=URL.createObjectURL(mymp3);
                });
            }
          return;
            
        }
        recordedel.src = URL.createObjectURL(new Blob(chunks, { type: 'audio/wav' }));
        recordedel.addEventListener("loadedmetadata", (ev) => {
            if (recordedel.duration === Infinity) {
                recordedel.currentTime = 1e101;
                var opened = false;
                recordedel.addEventListener("timeupdate", (ev) => {
                    recordedel.currentTime = 0;
                    if (!opened) {

                        duration = recordedel.duration;
                        console.log(duration);
                        var a = new Audio(recordedel.src);
                        a.currentTime = duration;
                        na = document.body.appendChild(a);
                        opened = true;
                    }
                }, { once: true });
            }

        })
        //recorder = false;
        //recordingstream = false;
    });
    recorder.start();
}
async function stoprecording() {
    recorder.stop();
}
