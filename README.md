Re-Shape Interactive Header
=============================
This is the source code for the interactive header of Re-Shape meet-ups (www.re-shape.io). We've used the wonderful P5.js and its DOM library as our interface to the browser and for managing the received events. Meanwhile for rendering the 3D scene we've used Three.js but tried to integrate it in the setup()/draw() routine of P5.

Details
---------------
The code works in a way that it uses Three.js as an external library for P5. For this we've made a ThreeJS class which accepts a P5 object along with the Div object for setting up its needed properties. After that the ThreeJS is setup once at setup() and is updated/drawn every frame at draw().

Inside the ThreeJS object we read an .obj file which contains the initial model of Re-Shape. Then using mouse interactions and a glitchy use of Tween.js, we managed to morph the vertices of the original model.
