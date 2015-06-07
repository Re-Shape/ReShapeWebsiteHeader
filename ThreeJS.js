function ThreeJS(aP5, aDiv) {
  this.mP5 = aP5;
  this.mDiv = aDiv; //three.js renderer
  this.mLights = [];
  this.mVerticesIsMouseOn = [];
  this.mMouseLastPos = new THREE.Vector3();
  this.mHasMesh = false;
  this.mIsVertexComingHome = [];
}

ThreeJS.prototype.setupRenderer = function(aWidth, aHeight) {
  if (Detector.webgl) {
    this.mRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
  } else {
    this.mRenderer = new THREE.CanvasRenderer({
      alpha: true,
      antialias: true
    });
  }
  var container = this.mDiv.elt;
  this.mRenderer.setSize(aWidth, aHeight);
  container.appendChild(this.mRenderer.domElement);
  this.mRenderer.domElement.style.zIndex = "1";
  // mRenderer.domElement.style.backgroundColor = "transparent";
  this.mRenderer.domElement.style.left = '0';
  this.mRenderer.domElement.style.top = '0';
  this.mRenderer.domElement.style.position = "absolute";
  // this.mRenderer.setClearColor(new THREE.Color(0.4, 0.4, 0.4));
  // this.mRenderer.autoClearColor = true;
  // this.mRenderer.autoClear = true;
}

ThreeJS.prototype.resizeRenderer = function(aWidth, aHeight) {
  this.mRenderer.setSize(aWidth, aHeight);
  this.mCamera = new THREE.PerspectiveCamera(25, aWidth / aHeight, 1, 10000);
  this.mCamera.position.z = 1000;
  this.mCamera.lookAt(this.mScene.position);
}

ThreeJS.prototype.setupScene = function() {
  this.mScene = new THREE.Scene();
  this.makeShapeFromOBJ();
  this.mCamera = new THREE.PerspectiveCamera(25, width / height, 1, 10000);
  this.mCamera.position.z = 1000;
  this.mCamera.lookAt(this.mScene.position);

  var light = new THREE.PointLight(new THREE.Color(1.0, 1.0, 0), 0.2, 800);
  light.position.set(mouseX, 30, 200);
  this.mLights.push(light);
  this.mScene.add(light);

  var lightMain = new THREE.PointLight(new THREE.Color(1, 1, 0), .6, 0);
  lightMain.position.set(-333, 100, 250);
  this.mLights.push(lightMain);
  this.mScene.add(lightMain);
  
  var lightMain2 = new THREE.PointLight(new THREE.Color(.5, .5, 0), .5, 0);
  lightMain2.position.set(444, 100, 250);
  this.mLights.push(lightMain2);
  this.mScene.add(lightMain2);
}

ThreeJS.prototype.update = function(aMousePos3D, aMode) {
  TWEEN.update();
  this.mMouseLastPos = aMousePos3D;
  this.mLights[0].position.set(aMousePos3D.x, aMousePos3D.y, 33);
  if (this.mMeshShaded) {
    switch (aMode) {
      case "shatter":
        this.shatter(aMousePos3D);
        break;
      case "animate":
        this.animate(aMousePos3D);
        break;
      case "animate2":
        this.animate2(aMousePos3D);
        break;
      case "mold":
        this.mold(aMousePos3D);
        break;
    }
  }


}

ThreeJS.prototype.draw = function() {
  this.mRenderer.render(this.mScene, this.mCamera);
}

ThreeJS.prototype.shatter = function(aMousePos3D) {

  var geo = this.mMeshShaded.geometry;
  var geoInit = this.mGeoInit;
  for (var i = 0; i < geo.vertices.length; i++) {
    var vertex = geo.vertices[i];
    var vertexInit = geoInit.vertices[i];
    if (this.checkMouseRangeVertex(aMousePos3D, 40, vertex)) {
      vertex.z += random(-5, 5);
      this.mVerticesIsMouseOn[i] = true;
    } else if (this.mVerticesIsMouseOn[i] === true) {
      var tween = new TWEEN.Tween(vertex, {
        override: true
      }).to(vertexInit, 500).start();
      this.mVerticesIsMouseOn[i] = false;
    }
  }
  geo.verticesNeedUpdate = true;
  //this.mMeshWireframe.geometry = geo;
  // geo.elementsNeedUpdate = true;
  // geo.normalsNeedUpdate = true;
}



ThreeJS.prototype.animate = function(aMousePos3D) {
  var geo = this.mMeshShaded.geometry;
  var geoInit = this.mGeoInit;
  for (var i = 0; i < geo.vertices.length; i++) {
    var vertex = geo.vertices[i];
    var vertexInit = geoInit.vertices[i];
    if (this.checkMouseRangeVertex(aMousePos3D, 40, vertexInit)) {
      if (this.mVerticesIsMouseOn[i] === false) {

        this.makeNewTweenAnimation(vertex, i);

      }
    } else if (this.mVerticesIsMouseOn[i] === true) {
      var tween = new TWEEN.Tween(vertex, {
        override: true
      }).to(vertexInit, 500).start();
      this.mVerticesIsMouseOn[i] = false;
    }
  }
  geo.verticesNeedUpdate = true;
  //this.mMeshWireframe.geometry = geo;
  // geo.elementsNeedUpdate = true;
  // geo.normalsNeedUpdate = true;
}

ThreeJS.prototype.animate2 = function(aMousePos3D) {
  var geo = this.mMeshShaded.geometry;
  var geoInit = this.mGeoInit;
  var geoTarget = this.mGeoTarget;
  for (var i = 0; i < geo.vertices.length; i++) {
    var vertex = geo.vertices[i];
    var vertexInit = geoInit.vertices[i];
    var vertexTarget = geoTarget.vertices[i];
    if (this.checkMouseRangeVertex(aMousePos3D, 30, vertexInit)) {
      if (vertexTarget.distanceTo(vertex) < 1 && this.mIsVertexComingHome[i] === false && this.mVerticesIsMouseOn[i] === false) {
        vertexTarget = this.mLights[0].position.clone();
        vertexTarget.sub(vertexInit);
        if (random(0, 1) > 0.5) vertexTarget.setLength(3);
        else vertexTarget.setLength(-3);

        vertexTarget.add(vertexInit);
        var tween = new TWEEN.Tween(vertex, {
          override: true
        }).to(vertexTarget, 100);
        var parent = this;
        var vertexNum = i;
        tween.onComplete(function() {
          console.log("hey");
          parent.makeVertexGoHome(this, vertexNum);
        });
        tween.start();
        this.mVerticesIsMouseOn[i] = true;

      }

    } else if (this.mVerticesIsMouseOn[i] === true) {
      var tween = new TWEEN.Tween(vertex, {
        override: true
      }).to(vertexInit, 500).start();
      this.mVerticesIsMouseOn[i] = false;
      this.mIsVertexComingHome[i] = false
    }
  }
  geo.verticesNeedUpdate = true;
  //this.mMeshWireframe.geometry = geo;
  // geo.elementsNeedUpdate = true;
  // geo.normalsNeedUpdate = true;
}

ThreeJS.prototype.makeNewTweenAnimation = function(aVertexStart, aVertexNum) {
  var vertexTarget = new THREE.Vector3(aVertexStart.x, aVertexStart.y, aVertexStart.z + random(-10, 10));
  var tween = new TWEEN.Tween(aVertexStart, {
    override: true
  }).to(vertexTarget, 700);
  var parent = this;
  tween.onComplete(function() {
    if (parent.checkMouseRangeVertex(parent.getMousePos3D(), 40, this)) {
      parent.makeNewTweenAnimation(this);
    } else {
      var tween = new TWEEN.Tween(vertex, {
        override: true
      }).to(parent.mGeoInit.vertices[aVertexNum], 500).start();
      parent.mVerticesIsMouseOn[aVertexNum] = false;

    }

  });
  tween.start();
  this.mVerticesIsMouseOn[aVertexNum] = true;

}

ThreeJS.prototype.makeVertexGoHome = function(aVertexStart, aVertexNum) {
  var vertexInit = this.mGeoInit.vertices[aVertexNum];
  var tween = new TWEEN.Tween(aVertexStart, {
    override: true
  }).to(vertexInit, 700);
  var parent = this;
  tween.onComplete(function() {
    parent.mIsVertexComingHome[aVertexNum] = false;
  });
  tween.start();
  this.mIsVertexComingHome[aVertexNum] = true;

}


ThreeJS.prototype.mold = function(aMousePos3D) {

}

ThreeJS.prototype.checkMouseRange = function(aMousePos3D, aRange) {
  var verticesInRange = [];
  for (var i = 0; i < this.mGeos.length; i++) {
    var geo = this.mGeos[i];
    for (var j = 0; j < geo.vertices.length; j++) {
      var vertex = geo.vertices[j];
      if (vertex.distanceTo(aMousePos3D) < aRange) {
        verticesInRange.push(vertex);
      }
    }
  }
  return verticesInRange;
}

ThreeJS.prototype.checkMouseRangeVertex = function(aMousePos3D, aRange, aVec3) {


  if (aVec3.distanceTo(aMousePos3D) < aRange) {
    return true;
  } else {
    return false;
  }

}

ThreeJS.prototype.getMousePos3D = function() {
  return this.mP5.getMousePos3D();
}

ThreeJS.prototype.makeShapeFromOBJ = function() {
  var parent = this;
  new THREE.OBJLoader().load('data/reshape.obj', function(object) {

    object.traverse(function(child) {

      if (child instanceof THREE.Mesh) {
        var geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -200, 0));
        var materialWireframe = new THREE.MeshPhongMaterial({
          wireframe: true,
          color: new THREE.Color(0, 0, 0)
        });
        var materialShaded = new THREE.MeshPhongMaterial({
          color: new THREE.Color(1, 1, 1),
          shading: THREE.FlatShading,
          shininess:10
        });
        for (var i = 0; i < geometry.vertices.length; i++) {
          parent.mVerticesIsMouseOn.push(false);
          parent.mIsVertexComingHome.push(false);
        }
        //parent.mMeshWireframe = new THREE.Mesh(geometry, materialWireframe);
        parent.mMeshShaded = new THREE.Mesh(geometry, materialShaded);
        //parent.mMeshShaded.position.z = -1;
        parent.mGeoInit = geometry.clone();
        parent.mGeoTarget = geometry.clone();
      }
    });
    //parent.mScene.add(parent.mMeshWireframe);
    parent.mScene.add(parent.mMeshShaded);
    parent.mHasMesh = true;



  });

}

ThreeJS.prototype.makeShapeFromSVG = function() {
  var options = {
    amount: 2,
    bevelThickness: 2,
    bevelSize: 0.5,
    bevelSegments: 3,
    bevelEnabled: true,
    curveSegments: 12,
    steps: 1
  };
  var shape = transformSVGPathExposed(CHAR_R);
  var shapeGeom = new THREE.ExtrudeGeometry(shape, options);
  shapeGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-1000, -1800, 0));
  shapeGeom.applyMatrix(new THREE.Matrix4().makeRotationX(PI));
  var shapeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
  })
  var shapeMesh = new THREE.Mesh(shapeGeom, shapeMaterial);
  shapeMesh.scale.x = 1.0;
  shapeMesh.scale.y = 1.0;
  // mMeshes.push(shapeMesh);
  this.mScene.add(shapeMesh);
}