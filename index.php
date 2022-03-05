<html>
    <header>

        <title>
            Earth 3D Visualisation
        </title>
        <link href="../local_three/style.css" rel="stylesheet" type="text/css"/>
    </header>

    <body class="demo_body" >

        <!-- CSS Scripts for three.js divs are in the /api/css folder  -->


        <div id="message_div_2" style="font-size: 0.6em;">
            Latest News<br/><br/>
            Date
            <p id="report_date" style="font-size: 1.6em;"></p>
            Region(s)
            <p id="areaName" style="font-size: 1.6em;"></p>
            Infections
            <p id="covid_infection" style="font-size: 1.6em;"></p>
            Deaths
            <p id="covid_deaths" style="font-size: 1.6em; color: #FFA478;"></p>     
            <div>Source: <a href='https://coronavirus.data.gov.uk/' target='_blank' style='color: #6EC1EE;'>https://coronavirus.data.gov.uk/</a></div>
        </div>

        <div id="message_div_1" style='display: none;'>
            Data Visualization - Under Development...
        </div>
        <div id="info_div">
            Refresh the page to show colour.
        </div>
        <div id="powered_by_div">
            Powered by Three.js
        </div>
    </body>

    <script src="../local_three/earth_app_v1.js" type="module"></script>
</html>