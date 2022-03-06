
// Import three.js from the cdn
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r123/three.module.js';

class ThreeManager
{
    static orbitControls = 0
    static pointerLockControls = 0
    static firstPersonControls = 0;
    static keyboardControls = 0

    static usePointerLockControl = false;
    static useKeyboardControl = false;
    static useFirstPersonControl = false;
    static firstPersonControlIsActive = false;
    static keyboardControlIsActive = false;
    static pointerLockControlIsActive = false;
    static selectedControl;
    static FIRST_PERSON_CONTROL = 1;
    static KEYBOARD_CONTROL = 2;
    static POINTER_LOCK_CONTROL = 3;
    static mouse = new THREE.Vector2();
    static scene = 0;
    static camera = 0;
    static clock = new THREE.Clock();
    static gui = null;
    static velocity = new THREE.Vector3();
    static direction = new THREE.Vector3();
    static vertex = new THREE.Vector3();
    static color = new THREE.Color();
    static objects = [];
    static velocity = new THREE.Vector3();
    static moveForward = false;
    static moveBackward = false;
    static moveLeft = false;
    static moveRight = false;
    static canJump = false;
    static clock = new THREE.Clock();
    static imageTargets = [];
    static raycastArrow = 0;
    static raycasterVector = new THREE.Vector3();
    static raycasterObjects = [];

    static overlayIsVisible = false;
    static canRead = false;
    static animationEnabled = false;
    static contentParagraph = "";
    static loadingBarLoaded = false;
    static loadingBarVisible = false;

    static activeProject = 0;
    static PROJECT_TITANIC_ENGINE_ROOM = 0;
    static PROJECT_EXHIBITION = 1;
    static PROJECT_EARTH_1 = 2;
    static PROJECT_TITANIC_ENGINE_ROOM_WALKWAYS = 3;

    static cameraInitialPosition = 0;
    static cameraInitialRotation = 0;
    static cameraHeight = 1.5;

    constructor(_scene, _camera, _project = null)
    {
        this.scene = _scene;
        ThreeManager.scene = _scene;
        this.camera = _camera;
        ThreeManager.camera = _camera;

        if (_project !== null)
        {
            ThreeManager.activeProject = _project;
        }

        this.materialType = {
            PHONG: 1,
            BASIC: 2,
            STANDARD: 3,
            LAMBERT: 4,
            TEXTURE: 5
        };
        if (ThreeManager.addHelpers) {
            var axesHelper = new AxesHelper(100);
            this.scene.add(axesHelper);
        }

        this.renderer = 0;
        this.splinePosition = 0;
        this.spline = 0;
        this.earthSpline = 0;
        this.raycaster = new THREE.Raycaster();
        this.prevTime = performance.now();
        this.tween = 0;

    }

    addCube(x, y, z, materialType = null, position, color, wireframe)
    {
        var cubeGeometry = new THREE.BoxGeometry(x, y, z);
        const cubeMaterial = this.getMaterial(materialType, color, wireframe);
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        if (position)
        {
            cube.position.x = position.x;
            cube.position.y = position.y;
            cube.position.z = position.z;
        }
        this.scene.add(cube);
        return cube;
    }

    addPlane(x, y, position)
    {
        var planeGeometry = new THREE.PlaneGeometry(x, y, 64, 64);
        var planeMaterial = this.getMaterial(5, 0xDDDDDD, false);
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow.true;
        plane.rotation.x = -0.5 * Math.PI;
        if (position)
        {
            plane.position.x = position.x;
            plane.position.y = position.y;
            plane.position.z = position.z;
        }
        plane.name = "plane";
        this.scene.add(plane);
        return plane;
    }

    addSphere(r, wSeg, hSeg, position, color, wireframe, material)
    {
        if (color === null)
        {
            color = 0x7777ff;
        }
        var sphereGeometry = new THREE.SphereGeometry(r, wSeg, hSeg);
        let sphereMaterial = this.getMaterial(material, color, wireframe);
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.castShadow = true;
        this.scene.add(sphere);
        if (position)
        {
            sphere.position.x = position.x;
            sphere.position.y = position.y;
            sphere.position.z = position.z;
        }

        return sphere;
    }

    addEarth(scene, radius, position)
    {

        var sphereGeometry = new THREE.SphereGeometry(radius, 60, 60);
        var sphereMaterial = this.createEarthMaterial();
        var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        earthMesh.name = 'earth';
        earthMesh.position.x = position.x;
        earthMesh.position.y = position.y;
        earthMesh.position.z = position.z;
        scene.add(earthMesh);
        return earthMesh;
    }

    createEarthMaterial() {

// 4096 is the maximum width for maps
        let earthTextures = {
            "basic": "../local_three/images/planets/earthmap4k.jpg",
            "bump": "../local_three/images/planets/earthbump4k.jpg",
            "specular": "../local_three/images/planets/earthspec4k.jpg",
            "normal": "../local_three/images/planets/earth_normalmap_flat4k.jpg"
        };
        let earthMaterial = new THREE.MeshPhongMaterial();
        let loader1 = new THREE.TextureLoader();
        loader1.load(earthTextures["basic"],
                function (texture)
                {
                    earthMaterial.map = texture;
                });
        let loader2 = new THREE.TextureLoader();
        loader2.load(earthTextures["bump"],
                function (texture)
                {
                    earthMaterial.bumpMap = texture;
                });
        let loader3 = new THREE.TextureLoader();
        loader3.load(earthTextures["specular"],
                function (texture)
                {
                    earthMaterial.specularMap = texture;
                    earthMaterial.specular = new THREE.Color(0x262626);
                });
        let loader4 = new THREE.TextureLoader();
        loader4.load(earthTextures["normal"],
                function (texture)
                {
                    // normalmap
                    //normalMap.scale.z = -1;
                    earthMaterial.normalMap = texture;
                    earthMaterial.normalScale = new THREE.Vector2(0.5, 0.7);
                });
        // earthMaterial.envMap = this.createCubeTexture;

        return earthMaterial;
    }
    checkIsMobile(html_element)
    {
        var divElement = document.getElementById(html_element);
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (divElement)
        {
            if (isMobile) {
                divElement.innerHTML = "Mobile detected";
            } else {
                divElement.innerHTML = "Desktop detected";
                //element.style.height = "50px";
            }
        }
        /*
         var element = document.getElementById('top_message');
         if (isMobile) {
         element.innerHTML += "<br/>View on desktop to appreciate the magnficent experience";
         element.style.height = "50px";
         } else {
         //element.innerHTML += "You are using Desktop";
         }*/
        return isMobile;
    }

    addCloud(scene, radius, position)
    {
        var sphereGeometry = new THREE.SphereGeometry(radius * 1.04, 60, 60);
        var sphereMaterial = this.createCloudMaterial();
        var cloudsMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        cloudsMesh.name = 'earth';
        cloudsMesh.position.x = position.x;
        cloudsMesh.position.y = position.y;
        cloudsMesh.position.z = position.z;
        scene.add(cloudsMesh);
        return cloudsMesh;
    }

    createCloudMaterial()
    {

        let cloudMaterial = new THREE.MeshBasicMaterial();
        let loader1 = new THREE.TextureLoader();
        let cloudTexture = "../local_three/images/planets/earth_clouds_4k.png";
        let loader = new THREE.TextureLoader();
        loader.load(cloudTexture,
                function (texture)
                {
                    cloudMaterial.map = texture;
                    cloudMaterial.transparent = true;
                });
        return cloudMaterial;
    }

    // To generate data and to paste unto the globe based on the GPS coordinates
    plotDataPoints(scene, radius, position)
    {
        const canvas = document.createElement("canvas");
        canvas.width = 4096;
        canvas.height = 2048;
        var context = canvas.getContext('2d');
        // Location data
        const locations = {
            'london': {'name': 'LONDON', 'longitude': -0.118092, 'latitude': 51.509865},
            'france': {'name': 'FRANCE', 'longitude': 2.349014, 'latitude': 48.864716},
            'new_york': {'name': 'NEW YORK', 'longitude': -75.0, 'latitude': 43.0},
            'hong_kong': {'name': 'HONG KONG', 'longitude': 114.17, 'latitude': 22.302},
            'manchester': {'name': 'MANCHESTER', 'longitude': -2.244644, 'latitude': 53.483959}
        };
        Object.keys(locations).map(function (key, index) {
            var longitude = locations[key]['longitude'];
            var latitude = locations[key]['latitude'];
            var x = ((4096 / 360.0) * (180 + longitude));
            var y = ((2048 / 180.0) * (90 - latitude));
            var shiftRight = 10;
            context.beginPath();
            context.arc(x, y, 30, 0, 2 * Math.PI);
            context.fillStyle = 'red';
            //context.fill();

            context.lineWidth = 2;
            context.strokeStyle = 'red';
            context.stroke();
            var bk_width = 20;
            var bk_height = 18;
            context.fillStyle = '#333333';
            context.fillRect((x + shiftRight) - bk_width / 2, y - 5 - bk_height, bk_width * 5, bk_height * 2);
            // Location name
            var _name = locations[key]['name'];
            context.fillStyle = 'white';
            context.strokeStyle = '#FFFFFF';
            context.font = "small-caps 15px arial 500";
            context.fillText(_name, (x + shiftRight), y);
            //context.strokeText(_name, x, y);


        });

        // Create material from canvas
        var dataCloudMaterial = new THREE.MeshPhongMaterial();
        dataCloudMaterial.map = new THREE.Texture(canvas);
        dataCloudMaterial.transparent = true;
        dataCloudMaterial.opacity = 1.0;

        // Create geometry
        var sphereGeometry = new THREE.SphereGeometry(radius * 1.04, 60, 60);
        var dataCloudMesh = new THREE.Mesh(sphereGeometry, dataCloudMaterial);
        dataCloudMesh.name = 'data_overlay';
        dataCloudMesh.position.x = position.x;
        dataCloudMesh.position.y = position.y;
        dataCloudMesh.position.z = position.z;

        // Add geometry to schene
        scene.add(dataCloudMesh);
        return dataCloudMesh;
    }

    // Used to pull data from the web at the time of Corvid.
    // This is simple HTML, CSS and JavaScript
    getCovidData()
    {
        var report_date = '';
        var areaName = 'United Kingdom';
        var total_deaths = 0;
        var total_deaths_yesterday = 0;
        var total_cases = 0;
        var url_england = 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation;areaName=england&' +
                'structure={"date":"date","newCases":"newCasesByPublishDate", "areaName":"areaName", "newAdmissions": "newAdmissions", "newDeaths": "newDeaths28DaysByPublishDate"}';
        var url_scotland = 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation;areaName=scotland&' +
                'structure={"date":"date","newCases":"newCasesByPublishDate", "areaName": "areaName", "newAdmissions": "newAdmissions", "newDeaths": "newDeaths28DaysByPublishDate"}';
        var url_wales = 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation;areaName=wales&' +
                'structure={"date":"date","newCases":"newCasesByPublishDate", "areaName": "areaName", "newAdmissions": "newAdmissions", "newDeaths": "newDeaths28DaysByPublishDate"}';
        var url_ni = 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation;areaName=northern%20ireland&' +
                'structure={"date":"date","newCases":"newCasesByPublishDate", "areaName": "areaName", "newAdmissions": "newAdmissions", "newDeaths": "newDeaths28DaysByPublishDate"}';
        fetch(url_england)
                .then(response => response.json())
                .then(data => {
                    console.log(total_deaths_yesterday);
                    report_date = data['data'][0]['date'];
                    total_deaths += data['data'][0]['newDeaths'];
                    total_deaths_yesterday += data['data'][1]['newDeaths'];
                    total_cases += data['data'][0]['newCases'];
                    try {
                        document.getElementById("report_date").innerHTML = report_date;
                        document.getElementById("covid_infection").innerHTML = total_cases;
                        document.getElementById("covid_deaths").innerHTML = total_deaths.toString() + " <span style='font-size: 0.8em;'> &nbsp;&nbsp;( Last: " + total_deaths_yesterday.toString() + " )</span>";
                    } catch (e) {

                    }
                });
        fetch(url_scotland)
                .then(response => response.json())
                .then(data => {
                    total_deaths += data['data'][0]['newDeaths'];
                    total_deaths_yesterday += data['data'][1]['newDeaths'];
                    total_cases += data['data'][0]['newCases'];
                    try {
                        document.getElementById("covid_infection").innerHTML = total_cases;
                        document.getElementById("covid_deaths").innerHTML = total_deaths;
                        document.getElementById("covid_deaths").innerHTML = total_deaths.toString() + " <span style='font-size: 0.8em;'> &nbsp;&nbsp;( Last: " + total_deaths_yesterday.toString() + " )</span>";
                    } catch (e) {

                    }
                });
        fetch(url_wales)
                .then(response => response.json())
                .then(data => {
                    total_deaths += data['data'][0]['newDeaths'];
                    total_deaths_yesterday += data['data'][1]['newDeaths'];
                    total_cases += data['data'][0]['newCases'];
                    try {
                        document.getElementById("covid_infection").innerHTML = total_cases;
                        document.getElementById("covid_deaths").innerHTML = total_deaths;
                        document.getElementById("covid_deaths").innerHTML = total_deaths.toString() + " <span style='font-size: 0.8em;'> &nbsp;&nbsp;( Last: " + total_deaths_yesterday.toString() + " )</span>";
                    } catch (e) {

                    }
                });
        fetch(url_ni)
                .then(response => response.json())
                .then(data => {
                    total_deaths += data['data'][0]['newDeaths'];
                    total_deaths_yesterday += data['data'][1]['newDeaths'];
                    total_cases += data['data'][0]['newCases'];
                    try {
                        document.getElementById("covid_infection").innerHTML = total_cases;
                        document.getElementById("covid_deaths").innerHTML = total_deaths;
                        document.getElementById("covid_deaths").innerHTML = total_deaths.toString() + " <span style='font-size: 0.8em;'> &nbsp;&nbsp;( Last: " + total_deaths_yesterday.toString() + " )</span>";
                    } catch (e) {

                    }
                });
        try {
            document.getElementById("areaName").innerHTML = areaName;
        } catch (e)
        {
        }
    }
    addHemisphereLight(scene, intensity = 1)
    {
        let hemisphereLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, intensity);
        scene.add(hemisphereLight);
        return hemisphereLight;
    }

    getMaterial(materialType, color, wireframe)
    {
        var material;
        var repeatSet = 3;
        var normal;
        var loader = new THREE.TextureLoader();
        var map, bump, normal, roughness;
        var path_moon_suface = '../local_three/images/moon_surface/';
        var textures = {
            'albedo': 'CobblestoneMedieval12B_6x3_1K_albedo.png',
            'bump': 'CobblestoneMedieval12B_6x3_1K_height.png',
            'roughness': 'CobblestoneMedieval12B_6x3_1K_roughness.png',
            'normal': 'CobblestoneMedieval12B_6x3_1K_normal.png',
            'moon_albedo': 'Rock_1K_albedo.png',
            'moon_height': 'Rock_1K_height.png',
            'moon_normal': 'Rock_1K_normal.png'
        };
        switch (materialType)
        {
            case 1:
                material = new THREE.MeshPhongMaterial({
                    color: color,
                    //emissive: 0x2a0000,

                    shininess: 20,
                    specular: 0xffffff,
                    side: THREE.DoubleSide,
                    wireframe: wireframe
                });
                break;
            case 2:
                material = new THREE.MeshBasicMaterial({
                    color: color,
                    side: THREE.DoubleSide,
                    wireframe: wireframe
                });
                break;
            case 3:
                material = new MeshStandardMaterial({
                    color: color,
                    roughness: 0.5,
                    metalness: 0.5,
                    wireframe: wireframe
                });
                break;
            case 4:
                material = new THREE.MeshLambertMaterial(
                        {
                            color: color,
                            side: THREE.DoubleSide,
                            wireframe: wireframe
                        });
                break;
            case 5:
                material = new THREE.MeshPhongMaterial();
                map = loader.load(path + textures['albedo'],
                        function (texture)
                        {
                            texture.wrapS = THREE.RepeatWrapping;
                            texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.set(repeatSet, repeatSet);
                        }
                );
                bump = loader.load(path + textures['bump'],
                        function (texture)
                        {
                            texture.wrapS = THREE.RepeatWrapping;
                            texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.set(repeatSet, repeatSet);
                        }
                );
                roughness = loader.load(path + textures['roughness'],
                        function (texture)
                        {
                            texture.wrapS = THREE.RepeatWrapping;
                            texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.set(repeatSet, repeatSet);
                        }
                );
                normal = loader.load(path + textures['normal'],
                        function (texture)
                        {
                            texture.wrapS = THREE.RepeatWrapping;
                            texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.set(repeatSet, repeatSet);
                        }
                );
                material.map = map;
                material.bumpMap = bump;
                material.bumpScale = 0.4;
                material.roughnessMap = roughness;
                //material.normalMap = normal;
                material.metalness = 0.4;
                material.roughness = 0.7;
                break;

                // Moon material
            case 6:
                material = new THREE.MeshPhongMaterial();
                loader = new THREE.TextureLoader();
                var path = path_moon_suface + textures['moon_albedo'];
                map = loader.load(path,
                        function (texture)
                        {
                            texture.wrapS = THREE.RepeatWrapping;
                            texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.set(repeatSet, repeatSet);
                        }
                );
                path = path_moon_suface + textures['moon_height'];
                bump = loader.load(path_moon_suface + textures['moon_height'],
                        function (texture)
                        {
                            texture.wrapS = THREE.RepeatWrapping;
                            texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.set(repeatSet, repeatSet);
                        }
                );
                path = path_moon_suface + textures['moon_normal'];
                loader.load(path_moon_suface + textures['moon_normal'],
                        function (texture)
                        {
                            texture.wrapS = THREE.RepeatWrapping;
                            texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.set(repeatSet, repeatSet);
                        }
                );
                material.map = map;
                material.bumpMap = bump;
                material.bumpScale = 0.4;
                material.roughnessMap = bump;
                material.normalMap = normal;
                material.metalness = 0.4;
                material.roughness = 0.7;
                break;

            case 7:         // Big Moon
                material = new THREE.MeshPhongMaterial();
                loader = new THREE.TextureLoader();
                var path = path_moon_suface + textures['moon_albedo'];
                map = loader.load(path,
                        function (texture)
                        {
                            texture.wrapS = THREE.RepeatWrapping;
                            texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.set(repeatSet, repeatSet);
                        }
                );
                path = path_moon_suface + textures['moon_height'];
                bump = loader.load(path_moon_suface + textures['moon_height'],
                        function (texture)
                        {
                            texture.wrapS = THREE.RepeatWrapping;
                            texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.set(repeatSet, repeatSet);
                        }
                );
                path = path_moon_suface + textures['moon_normal'];
                normal = loader.load(path_moon_suface + textures['moon_normal'],
                        function (texture)
                        {
                            texture.wrapS = THREE.RepeatWrapping;
                            texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.set(repeatSet, repeatSet);
                        }
                );
                material.map = map;
                material.bumpMap = bump;
                material.bumpScale = 0.01;
                material.roughnessMap = bump;
                material.normalMap = normal;
                material.metalness = 0.4;
                material.roughness = 0.7;
                break;
        }
        return material;
    }

    addDirectionalLight(scene, position, intensity = 1)
    {
        if (!position)
        {
            position = new THREE.Vector3(50, 20, 30);
        }
        let directionalLight = new THREE.DirectionalLight(0xffffff, intensity);
        directionalLight.name = 'directional';
        directionalLight.castShadow = true;
        directionalLight.shadow.width = 2048;
        directionalLight.shadow.height = 2048;
        directionalLight.position.x = position.x;
        directionalLight.position.y = position.y;
        directionalLight.position.z = position.z;
        var dirLightSize = 20;
        directionalLight.shadow.camera.left = -1 * dirLightSize;
        directionalLight.shadow.camera.bottom = -1 * dirLightSize;
        directionalLight.shadow.camera.right = dirLightSize;
        directionalLight.shadow.camera.top = dirLightSize;
        scene.add(directionalLight);
        if (ThreeManager.addHelpers) {
            let helper = new THREE.CameraHelper(directionalLight.shadow.camera);
            scene.add(helper);
        }
        return directionalLight;
    }

    addPointLight(scene, position, intensity = 1, color = 0xffffff)
    {
        let pointLight = new THREE.PointLight(color, intensity, 100);
        pointLight.position.set(position.x, position.y, position.z);
        scene.add(pointLight);
        return pointLight;
    }

    addSpotlight(scene, position, intensity, color, sptName, mapSizeW, mapSizeH, cameraNear, cameraFar, cameraFov) {

        let spotLight = new THREE.SpotLight(color);
        spotLight.position.set(position.x, position.y, position.z);
        spotLight.castShadow = true;
        spotLight.shadowDarkness = 0.5;
        spotLight.shadowCameraVisible = true;
        spotLight.shadow.mapSize.width = mapSizeW;
        spotLight.shadow.mapSize.height = mapSizeH;
        spotLight.shadow.camera.near = cameraNear;
        spotLight.shadow.camera.far = cameraFar;
        spotLight.shadow.camera.fov = cameraFov;

        spotLight.intensity = intensity;
        spotLight.penumbra = 0.4;
        spotLight.name = sptName;
        scene.add(spotLight);
        return spotLight;
    }

    addSpotlightDefault(scene, position, intensity = 0.1, color = 0xffffff, sptName = "")
    {
        return this.addSpotlight(scene, position, intensity, color, sptName, 1024, 1024, 10, 50, 30);
    }

// include  RectAreaLightUniformsLib
    addRectAreaLight(scene, position, intensity = 1, color = 0xffffff, width = 2, height = 2)
    {
        if (!position) {
            position = new THREE.Vector3(10, 10, 10);
        }
        let rectLight = new THREE.RectAreaLight(color, intensity, width, height);
        rectLight.position.set(position.x, position.y, position.z);
        rectLight.lookAt(0, 0, 0);
        scene.add(rectLight);
        if (ThreeManager.addHelpers)
        {
            let rectLightHelper = new RectAreaLightHelper(rectLight);
            rectLight.add(rectLightHelper);
    }
    }

    addAmbientlight(scene, aIntensity = 0.1, ambicolorx = 0xFFFFFF) {

        const ambientLight = new THREE.AmbientLight(ambicolorx, aIntensity);
        // ambient.position.set(position.x, position.y, position.z);
        scene.add(ambientLight);
        return ambientLight;
    }

    addLights(scene)
    {
        this.addDirectionalLight(scene);
        this.addHemisphereLight(scene);
        this.addAmbientlight(scene, 0.1, 0xFFFFFF);
        let spPosition = new THREE.Vector3(8, 10, 4);
        this.addSpotlightDefault(scene, spPosition, 1);
    }

    setBottomMessageDiv(_divId, bottom)
    {

        if (document.body.contains(_divId)) {
            var divId = document.getElementById(_divId);
            /* split */
            divId.style.position = "absolute";
            divId.style.padding = "10px";
            divId.style.width = "100%";
            divId.style.paddingLeft = "30px";
            divId.style.bottom = bottom.toString() + "px";
            divId.style.backgroundColor = "rgba(30, 30, 30, 0.5)";
            divId.style.color = "rgba(255, 255, 255, 1)";
            divId.style.fontFamily = "Verdana";
            divId.style.textTransform = "uppercase";
            divId.style.fontSize = "0.8em";
        }
    }

    setBottomDiv(_divId, bottom)
    {
        if (document.body.contains(_divId)) {
            var divId = document.getElementById(_divId);
            /* split */
            divId.style.display = "grid";
            divId.style.gridTemplateColumns = "3fr 1fr";
            divId.style.columnGap = "5px";
            divId.style.position = "absolute";
            divId.style.paddingLeft = "30px";
            divId.style.paddingRight = "50px";
            divId.style.paddingTop = "20px";
            divId.style.paddingBottom = "20px";
            divId.style.width = "100%";
            divId.style.bottom = bottom.toString() + "px";
            divId.style.verticalAlign = "central";
            divId.style.textAlignment = "left";
            divId.style.backgroundColor = "rgba(50, 50, 50, 0.5)";
            divId.style.color = "rgba(255, 255, 255, 1)";
            divId.style.fontFamily = "Verdana";
            divId.style.textTransform = "uppercase";
            divId.style.fontSize = "0.8em";
            divId = document.getElementById("archi_button_controls");
            divId.style.paddingRight = "50px";
            divId.style.textAlignment = "left";
        }
    }

}
;
export { ThreeManager }
