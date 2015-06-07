var mDiv;
var mCanvas;
var mThreeJS;
var mMode;
var mChangeModeButton;
var mIsButtonVisible = true;

function setup() {
  frameRate(30);
  containerSetup();

  mThreeJS = new ThreeJS(this, mDiv);
  mThreeJS.setupRenderer(width, height);
  mThreeJS.setupScene();

  mMode = "animate2";
  
  //window.addEventListener("resize", resizeRenderers);
  //makeChangeModeButton();
}

function draw() {
  //p5.js
  background(140);
  mThreeJS.update(getMousePos3D(), mMode);
  mThreeJS.draw();

}

function keyTyped() {
  if (key === 'c') {
    if (!mIsButtonVisible) {
      mChangeButton.show();
      mIsButtonVisible = true;
    } else {
      mChangeButton.hide();
      mIsButtonVisible = false;
    }
  }
}

function containerSetup() {
  mDiv = createDiv("");
  //mDiv = getElement(id);
  mDiv.elt.style.width="100%";
  mDiv.elt.style.height="100%";
  mDiv.elt.style.position = "absolute";
  mDiv.elt.style.left = "0";
  mDiv.elt.style.top = "0";
  var w= mDiv.elt.offsetWidth;
  var h= mDiv.elt.offsetHeight; 
  mCanvas = createCanvas(w, h);
  mCanvas.parent(mDiv);
  mCanvas.elt.style.zIndex = "0";
  mCanvas.elt.style.backgroundColor = "transparent";
  mCanvas.elt.style.position = "absolute";
  mCanvas.elt.style.left = "0";
  mCanvas.elt.style.top = "0";
  smooth();
}

function windowResized() {
  console.log(mDiv.elt.width);
  var w= mDiv.elt.offsetWidth;
  var h= mDiv.elt.offsetHeight;
  mThreeJS.resizeRenderer(w, h);
  mCanvas.size(w, h);
}

function getMousePos3D(){
  var vector = new THREE.Vector3();

  vector.set(
    (mouseX / width) * 2 - 1, -(mouseY / height) * 2 + 1,
    0.5);
  var camera = mThreeJS.mCamera;
  vector.unproject(camera);

  var dir = vector.sub(camera.position).normalize();

  var distance = -camera.position.z / dir.z;

  var pos = camera.position.clone().add(dir.multiplyScalar(distance));
  return pos;
}

function makeChangeModeButton()
{
  mChangeModeButton = createButton("Change Mode");
  mChangeModeButton.parent(mDiv);
  mChangeModeButton.position(30, 30);
  mChangeModeButton.mouseClicked(handleButtonClick);
  if (mIsButtonVisible) mChangeModeButton.show();
  else mChangeModeButton.hide();
  function handleButtonClick() {
    var randFloat = random(0.0, 1.0);
    switch (mMode) {
      case "shatter":
        if (randFloat < 0.5) mMode = "mold";
        else mMode = "animate";
        break;
      case "mold":
        if (randFloat < 0.5) mMode = "shatter";
        else mMode = "animate";
        break;
      case "animate":
        if (randFloat < 0.5) mMode = "shatter";
        else mMode = "mold";
        break;

    }
  }
}