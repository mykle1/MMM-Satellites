/* Magic Mirror
 * Module: MMM-Satellites
 *
 * By Mykle1
 * MIT License
 */
Module.register("MMM-Satellites", {

    // Module config defaults.
    defaults: {
		latitude: "",
		longitude: "",
        useHeader: false,    // true if you want a header      
        header: "",          // Any text you want. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 0,
        initialLoadDelay: 1250,
        retryDelay: 2500,
        updateInterval: 15 * 1000, // Every minute

    },

    getStyles: function() {
        return ["MMM-Satellites.css"];
    },

		
	start: function() {
        Log.info("Starting module: " + this.name);

        //  Set locale.
        this.Satellites = {};
        this.scheduleUpdate();
		this.sendSocketNotification("CONFIG", this.config);
    },
	

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("Loading . . .");
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("small", "bright", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

		

 //       var top = document.createElement("div");
  //      top.classList.add("list-row");
//		
	
		
		// azimuth
        var azimuth = document.createElement("div");
        azimuth.classList.add("small", "bright", "azimuth");
        azimuth.innerHTML =  "Azimuth is " + this.Satellites[0].azimuth;
        wrapper.appendChild(azimuth);
		
		
		// elevation
        var elevation = document.createElement("div");
        elevation.classList.add("small", "bright", "elevation");
        elevation.innerHTML =  "Elevation is " + this.Satellites[0].elevation;
        wrapper.appendChild(elevation);
		
		
		// pnr
        var pnr = document.createElement("div");
        pnr.classList.add("small", "bright", "pnr");
        pnr.innerHTML =  "Satellite is " + this.Satellites[0].pnr;
        wrapper.appendChild(pnr);
		
			
			
/*
		// sun_angular_diameter
        var sun_angular_diameter = document.createElement("div");
        sun_angular_diameter.classList.add("small", "bright", "sun_angular_diameter");
        sun_angular_diameter.innerHTML = "Angular diameter of sun is " + Number(Math.round(Lune.sun_angular_diameter+'e2')+'e-2') + " &deg";
        wrapper.appendChild(sun_angular_diameter);
		
		
*/		
		
		
        return wrapper;
		
    }, // closes getDom
    
    
    /////  Add this function to the modules you want to control with voice //////

    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_SATELLITES') {
            this.hide();
        }  else if (notification === 'SHOW_SATELLITES') {
            this.show(1000);
        }
            
    },


    processSatellites: function(data) {
        this.Satellites = data;
		console.log(this.Satellites); // for checking
        this.loaded = true;
    },
	

    scheduleUpdate: function() {
        setInterval(() => {
            this.getSatellites();
        }, this.config.updateInterval);
        this.getSatellites(this.config.initialLoadDelay);
    },

    getSatellites: function() {
        this.sendSocketNotification('GET_SATELLITES');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "SATELLITES_RESULT") {
            this.processSatellites(payload);
            this.updateDom(this.config.animationSpeed);
        }
		
        this.updateDom(this.config.initialLoadDelay);
    },
});
