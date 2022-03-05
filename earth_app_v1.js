/**
 *
 * Three.js for home page
 */

import { ThreeManager } from '../local_three/ThreeManager.js';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r123/three.module.js';

var renderer;
var scene;
var sceneBG;
var camera;
var camera2;
var camera_radius = 1000;
var camera_angle = 0;
var spotLight;
var controls;
var cameraLook;

var stats;
var cameraControl;
var composer;
var width;
var height;
var position;
var color;
var axes;
var radius = 120;
var step = 0;
var bouncing_radius = 0;

var functionSet;
var lastTimeMsec;
var nowMsec = 1000;
var deltaMsec;


function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.x = 800;
    camera.position.y = 350;
    camera.position.z = 800;


    var earthRadius = 400;
    var ePosition = new THREE.Vector3(0, 0, 0);

    var sc = new ThreeManager(scene, camera, ThreeManager.PROJECT_EARTH_1);
    sc.addEarth(scene, earthRadius, ePosition);
    sc.addCloud(scene, earthRadius, ePosition);

    var moonPosition = new THREE.Vector3(450, 300, 0);
    var sphere = sc.addSphere(earthRadius * 0.05, 30, 30, moonPosition, 0xFF0, false, 6);
    sphere.rotation.x = 100;
    sphere.rotation.y = -120;

    sc.plotDataPoints(scene, earthRadius, ePosition);

    cameraLook = new THREE.Vector3(1000, 2000, 1000);
    camera.lookAt(cameraLook);

    sc.getCovidData(false);

    var hemi = sc.addHemisphereLight(scene);
    //hemi.castShadow = true;
    hemi.intensity = 0.8;

    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(new THREE.Vector3(0, 5, 0));
    spotLight.castShadow = true;
    //scene.add(spotLight);

    const ambiColor = 0xFFFFFF;
    const aIntensity = 1;
    const ambient = new THREE.AmbientLight(ambiColor, aIntensity);
    ambient.intensity = 0.4;
    scene.add(ambient);

    // To render scene
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    // renderer.outputEncoding = THREE.sRGBEncoding;

    document.body.appendChild(renderer.domElement);
    // cameraControl = new THREE.OrbitControls(camera, renderer.domElement);

    render();
}

function render() {

    //cameraControl.update();

    // Use Math.cos and Math.sin to set camera X and Z values based on angle.
    camera.position.x = camera_radius * Math.cos(camera_angle);
    camera.position.z = (camera_radius) * Math.sin(camera_angle);
    // update the camera rotation angle
    camera_angle += 0.002;
    camera.lookAt(cameraLook);

    scene.getObjectByName('data_overlay').material.map.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(render);

}

setTimeout(function () {
    cameraLook = new THREE.Vector3(0, 0, 0);
}, 2000);

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


window.onload = function () {
    init();
};
// calls the handleResize function when the window is resized
window.addEventListener('resize', handleResize, false);
