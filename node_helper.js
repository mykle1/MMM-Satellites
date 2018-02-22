/* Magic Mirror
 * Module: MMM-Satellites
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const SatellitesAbove = require('satellites-above');


module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getSatellites: function(url) {
    //    var self= this;
		let satellites = new SatellitesAbove();
		satellites
		.load({download: true})
		.then(() => {
    	let sats = satellites.above(this.config.latitude, this.config.longitude);
    	console.log(sats);
    	this.sendSocketNotification("SATELLITES_RESULT", sats);
			
		});
    },
	
	

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_SATELLITES') {
            this.getSatellites(payload);
        }
		if (notification === "CONFIG") {
			this.config = payload;
		}
    }
});
