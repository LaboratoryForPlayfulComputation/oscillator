let osc, playing, freq, amp, fft;
let ampSlider, freqSlider, playButton, stopButton;

function setup() {
  canvas_width = windowWidth;
  canvas_height = windowHeight; // best for full screen
  //canvas_height = $(document).height();
  let cnv = createCanvas(canvas_width, canvas_height);
  cnv.position(0, 0);
  cnv.style('z-index', '-3');
  cnv.parent('canvascontainer');

  ampSlider = createSlider(0.0, 50.0, 20.0);
  ampSlider.position(10, 10);
  ampSlider.style('width', '150px');
  freqSlider = createSlider(200.0, 10000.0, 440.0);
  freqSlider.position(10, 50);
  freqSlider.style('width', '150px');
  playButton = createButton('play');
  playButton.position(19, 90);
  playButton.mousePressed(playOscillator);
  stopButton = createButton('stop');
  stopButton.position(60, 90);
  stopButton.mousePressed(stopOscillator);

  osc = new p5.Oscillator('sine');
  fft = new p5.FFT();
  fft.smooth(1);
}

function draw() {
  background(255);
  freq = freqSlider.value();
  amp = ampSlider.value()/100;

  stroke(0);
  text('Amplitude/Volume', 20, 40);
  //text('Amplitude/Volume: ' + amp, 20, 40);
  text('Frequency/Pitch: ' + freq + ' Hz', 20, 80);

  if (playing) {
    // smooth the transitions by 0.1 seconds
    osc.freq(freq, 0.1);
    osc.amp(amp, 0.1);
  }

  let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(20);
  for (let i = 0; i < waveform.length; i++){
    let x = map(i, 0, waveform.length, 0, width);
    let y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
  }
  endShape();
}

function playOscillator() {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio();
  osc.start();
  playing = true;
}

function stopOscillator() {
  // ramp amplitude to 0 over 0.5 seconds
  osc.amp(0, 0.5);
  playing = false;
}

function windowResized() {
  canvas_width = windowWidth;
  canvas_height = windowHeight;
  resizeCanvas(canvas_width, canvas_height);
  background(250);
}