'use strict';

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

class Wave {
    constructor() {
        _defineProperty(this, 'current_stream', {});

        _defineProperty(this, 'sources', {});

        _defineProperty(this, 'onFileLoad', void 0);
    }

    findSize(size) {
        for (var range = 1; range <= 40; range++) {
            var power = 2 ** range;
            if (size <= power) return power;
        }
    }

    visualize(data, canvas, options = {}) {
        //options
        if (!options.stroke) options.stroke = 2;
        if (!options.colors) options.colors = ['rgb(255, 53, 94)'];
        var c;

        if (typeof canvas == 'string') {
            c = document.getElementById(canvas);
        } else {
            c = canvas;
        }

        var ctx = c.getContext('2d');
        var h = c.height;
        var w = c.width; //clear canvas
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.strokeStyle = options.colors[0];
        ctx.lineWidth = options.stroke;
        var min = 5;
        var r = h / 4;
        var offset = r / 2;
        var cx = w / 2;
        var cy = h / 2;
        var point_count = 128;
        var percent = (r - offset) / 255;
        var increase = ((360 / point_count) * Math.PI) / 180;
        var breakpoint = Math.floor(point_count / options.colors.length);

        for (var point = 1; point <= point_count; point++) {
            var p = (data[point] + min) * percent;
            var a = point * increase;
            var sx = cx + (r - (p - offset)) * Math.cos(a);
            var sy = cy + (r - (p - offset)) * Math.sin(a);
            ctx.moveTo(sx, sy);
            var dx = cx + (r + p) * Math.cos(a);
            var dy = cy + (r + p) * Math.sin(a);
            ctx.lineTo(dx, dy);

            if (point % breakpoint == 0) {
                var i = point / breakpoint - 1;
                ctx.strokeStyle = options.colors[i];
                ctx.stroke();
                ctx.beginPath();
            }
        }

        ctx.stroke();
    }

    fromStream(stream, canvas_id, options = {}, muted = true) {
        this.current_stream.id = canvas_id;
        this.current_stream.options = options;
        var audioCtx, analyser, source;

        if (!this.sources[stream.toString()]) {
            AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
            analyser = audioCtx.createAnalyser();
            source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            // source.connect(audioCtx.destination); //playback audio

            this.sources[stream.toString()] = {
                audioCtx: audioCtx,
                analyser: analyser,
                source: source,
            };
        } else {
            cancelAnimationFrame(this.sources[stream.toString()].animation);
            audioCtx = this.sources[stream.toString()].audioCtx;
            analyser = this.sources[stream.toString()].analyser;
            source = this.sources[stream.toString()].source;
        }

        // if (!muted) source.connect(audioCtx.destination); //playback audio

        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount;
        this.current_stream.data = new Uint8Array(bufferLength);
        var frame_count = 1;
        var c = 1;
        var self = this;

        function renderFrame() {
            window.requestAnimFrame =
                window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame;
            self.current_stream.animation = requestAnimFrame(
                self.current_stream.loop
            );
            self.sources[stream.toString()]['animation'] =
                self.current_stream.animation;
            analyser.getByteFrequencyData(self.current_stream.data);
            c++;

            if (c % frame_count == 0) {
                //every * frame
                self.visualize(
                    self.current_stream.data,
                    self.current_stream.id,
                    self.current_stream.options
                );
            }
        }

        this.current_stream.loop = renderFrame;
        renderFrame();
    }

    stopStream() {
        cancelAnimationFrame(this.current_stream.animation);
    }

    playStream() {
        this.current_stream.loop();
    }
}

window.Wave = Wave;
