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
        sampleSize: 16,
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
