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
        cbfunc(source !==null && gainNode !==null);
    }
}
function setAll() {
    gainNode.gain.value = 5;
    confirm(new String(gainNode?.gain?.value));
    var va=source.connect(gainNode);
    confirm(va);
    var vb=gainNode.connect(audioCtx.destination);
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
    
    audioCtx=new AudioContext();
    var videolElVarInitialised = init_myVideoEl(el);
    if (!videolElVarInitialised) {
        return false;
    }
    if(true){
     source = audioCtx.createMediaElementSource(el);
    gainNode = audioCtx.createGain();
        gainNode.gain.value = 5;
    //confirm(new String(gainNode?.gain?.value));
    var va=source.connect(gainNode);
    //confirm(va);
    var vb=gainNode.connect(audioCtx.destination);
    //confirm(vb);
        
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
        channelCount: 1,
        sampleRate: 8192,
        sampleSize: 8,
        autoGainControl: true,
        noiseSuppression: true,
        echoCancellation: true,
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
    await startrecording();
    recordedel.onpause = async (ev) => {
        await stoprecording();
    }
}
async function boostAndRecord(el, newel) {
    startAll(el, async (thel) => {
        thel.play();
        await recordAll(newel, thel);
    });
}
var recordedel = null;
var recorder=false; 
var recordingstream=false; 
async function startrecording() { 
    
    recordingstream=audioCtx.createMediaStreamDestination();
    recorder=new MediaRecorder(recordingstream.stream); 
    recorder.start(); 
} 
async function stoprecording(){ 
    recorder.addEventListener('dataavailable',function(e){ 
        recordedel.src=URL.createObjectURL(new Blob([e.data],{type:'audio/mp3'}));
        recorder=false; 
        recordingstream=false; 
    });
    recorder.stop(); 
}
