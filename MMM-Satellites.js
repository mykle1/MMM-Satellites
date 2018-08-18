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
        animationSpeed: 1000,
        initialLoadDelay: 1250,
        retryDelay: 2500,
        updateInterval: 60 * 60 * 1000, // Every minute
        rotateInterval: 5  * 1000,
        
        satArray: {
            "01": "GPS 2F-2 - Launched 2011/7/16",
            "02": "GPS 2R-13 - Launched 2004/11/6",
            "03": "GPS 2F-8 - Launched 2014/10/29",
            "04": "Unknown satellite",
            "05": "GPS 2R-21M - Launched 2009/8/17",
            "06": "GPS 2F-6 - Launched 2014/5/17	",
            "07": "GPS 2R-19M - Launched 2008/3/15",
            "08": "GPS 2F-10 - Launched 2015/7/15",
            "09": "GPS 2F-7 - Launched 2014/8/2",
            "1": "GPS 2F-2 - Launched 2011/7/16",
            "2": "GPS 2R-13 - Launched 2004/11/6",
            "3": "GPS 2F-8 - Launched 2014/10/29",
            "4": "Unknown satellite",
            "5": "GPS 2R-21M - Launched 2009/8/17",
            "6": "GPS 2F-6 - Launched 2014/5/17	",
            "7": "GPS 2R-19M - Launched 2008/3/15",
            "8": "GPS 2F-10 - Launched 2015/7/15",
            "9": "GPS 2F-7 - Launched 2014/8/2",
           "10": "GPS 2F-11 - Launched 2015/10/31",
           "11": "GPS 2R-3 - Launched 1999/10/7	",
           "12": "GPS 2R-16M - Launched 2006/11/17",
           "13": "GPS 2R-2 - Launched 1997/7/23	",
           "14": "GPS 2R-6 - Launched 2000/11/10",
           "15": "GPS 2R-17M - Launched 2007/10/17",
           "16": "GPS 2R-8 - Launched 2003/1/29	",
           "17": "GPS 2R-14M - Launched 2005/9/26",
           "18": "GPS 2A-14 - Launched 1993/10/26",
           "19": "GPS 2R-11 - Launched 2004/3/20",
           "20": "GPS 2R-4 - Launched 2000/5/11	",
           "21": "GPS 2R-9 - Launched 2003/3/31	",
           "22": "GPS 2R-10 - Launched 2003/12/21",
           "23": "GPS 2R-12 - Launched 2004/6/23",
           "24": "GPS 2F-3 - Launched 2012/10/4	",
           "25": "GPS 2F-1 - Launched 2010/5/28	",
           "26": "GPS 2F-9 - Launched 2015/3/25	",
           "27": "GPS 2F-4 - Launched 2013/5/15	",
           "28": "GPS 2R-5 - Launched 2000/7/16	",
           "29": "GPS 2R-18M - Launched 2007/12/20",
           "30": "GPS 2F-5 - Launched 2014/2/21	",
           "31": "GPS 2R-15M - Launched 2006/9/25",
           "32": "GPS 2F-12 - Launched 2016/2/5	",
        }

    },

    getStyles: function() {
        return ["MMM-Satellites.css"];
    },

		
	start: function() {
        Log.info("Starting module: " + this.name);

        //  Set locale.
        this.Satellites = {};
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
		this.sendSocketNotification("CONFIG", this.config);
        this.config.lang = this.config.lang || config.language;
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
        
        // Rotating my data
            var satellites = this.Satellites;

            var keys = Object.keys(this.Satellites);
        if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
            }
             satellites = this.Satellites[keys[this.activeItem]];
        
		// id and launch date
        var id = document.createElement("div");
        id.classList.add("small", "bright", "id");
        id.innerHTML = this.config.satArray[satellites.pnr];
        wrapper.appendChild(id);
        
            
        // spacer
        var spacer = document.createElement("div");
        spacer.classList.add("small", "bright", "spacer");
        spacer.innerHTML = "~ ~ ~ ~ ~";
        wrapper.appendChild(spacer);
        
            
		// azimuth
        var azimuth = document.createElement("div");
        azimuth.classList.add("small", "bright", "azimuth");
        azimuth.innerHTML =  "Azimuth is " + satellites.azimuth;
        wrapper.appendChild(azimuth);
		
		
		// elevation
        var elevation = document.createElement("div");
        elevation.classList.add("small", "bright", "elevation");
        elevation.innerHTML =  "Elevation is " + satellites.elevation;
        wrapper.appendChild(elevation);
		
            
        } // closes rotation 
           
        
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
    
    scheduleCarousel: function() {
        console.log("Searching for Satellites");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom();
        }, this.config.rotateInterval);
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
             if(this.rotate == null){
			   	this.scheduleCarousel();
			   }
        }
		
        this.updateDom(this.config.initialLoadDelay);
    },
});
