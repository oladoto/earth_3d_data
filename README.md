# Earth Render with Real-time Data in Three.js
Earth demo using three.js and data fetch in JavaScript

The files in this branch enable the rendering of an earth model with some data fetched from the internet

Here is an archiectural view of the integration of all the files.
https://mobileserviceslabs.com/wp-content/uploads/2022/03/three.js.pdf

Requires Server
Note that to run these files, you would require some sort of server, either hosting on a live server or using XAMPP, MAMPP or WAMPP. You could also the Chrome extension that enables you identify a local folder to run a local server. 

1. index.html
   This represents the primary html file that loads on your computer/server. It loads the primary three.js file - earth_app_v1.js.
2. earth_app_v1.js
   This is the "init" file, which starts up the Three.js scene and calls the helper file - ThreeManager.js. It also calls a few Three.js constructors to create quick instances.
3. ThreeManager.js:- 
   This is the main helper file, which hosts most of the complexity performed with Three.js. Object-oriented approaches are used to enable easy management of the 
   calls from a single varilable. It also enables you overcome the behvaiour of JavaScript where you need to define a function before its use down the source code page.
4. styles.css
   Essential styling for the webpage is kept in the css file.

Important Modification:
You would notice this relative folder reference in the files - "../local_three/". 
Make sure to place all files in a filder named local_three before executing. Before the files were uploaded to Github, all files were placed in a folder named "local_three". This was done because the files were hosted on the internet as seen in the link in (1) below. Thus, to use the files, make sure to place them in a folder named local_three, since they all refer to that folder. However, if you understand how relative folders work on the internet and on your local system, you could rename the folder or use your own unique configuration.

1. Here is a hosting of this solution on the internet - https://mobileserviceslabs.com/api/js/apps/earth/local_three/index.php
2. Here is an example visualisation within a WordPress / Elementor environment - https://mobileserviceslabs.com/. You can refresh the page to re-render the globe if it loads as white.


Credits to Jos Dirksen on his book - Three.js Essentials - for the Earth modeling and rendering in Three.js.
