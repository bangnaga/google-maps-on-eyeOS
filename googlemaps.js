function googlemaps_application(checknum, pid, args) {
    //document.write('<' + 'script src="' + 'http://http://maps.googleapis.com/maps/api/js?sensor=true&region=CN&language=zh-CN' + '"' +
    //               ' type="text/javascript"><' + '/script>');
    var app = new eyeos.application.googlemaps(checknum, pid, args);
    app.initialize();
}

qx.Class.define('eyeos.application.googlemaps', {
extend : eyeos.system.EyeApplication,
    construct : function(checknum, pid, args) {
        arguments.callee.base.call(this, 'googlemaps', checknum, pid);
    },
    members : {
        initialize : function() {          
            var googleMapWidget = this._createMapContainer(500,380);
            var mainWindow = this._createMainWindow("Google Maps", googleMapWidget, 600, 400);

            this.getRoot().add( mainWindow, {
                left : 20,
                top  : 20
            });
      
            mainWindow.addListener("resize", function(e){
                googleMapWidget.set({
                    "width": qx.bom.Viewport.getWidth(),
                    "height": qx.bom.Vi ewport.getHeight()
                });
              }, this);
        },
        
        _createMapContainer : function(width,height) {
              var mapContainer = new qx.ui.core.Widget().set({
                width: width,
                height: height
              });

              // Since the decorator requires a bit of extra code, we set
              // an decorator for demonstration purpose here. Of course,
              // you may not need a decorator.
              //mapContainer.setDecorator("main");
                
              var map;
              
              mapContainer.addListenerOnce("appear", function() {
                map = new google.maps.Map(mapContainer.getContentElement().getDomElement(), {
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                // Fix for [BUG #4178]
                // Make sure zIndex of map element is higher than zIndex of decorator
                // (Maps apparently resets zIndex on init)
                google.maps.event.addListenerOnce(map, "center_changed", function() {
                  // Wait for DOM
                  window.setTimeout(function() {
                    var zIndex = mapContainer.getContentElement().getStyle('zIndex');
                    mapContainer.getContentElement().getDomElement().style.zIndex = zIndex;
                  }, 500);
                });
                
                var browserSupportFlag;
                var initialLocation = new google.maps.LatLng(24.82621106522609,102.84659982045464);
                if(navigator.geolocation) {
                    browserSupportFlag = true;
                    navigator.geolocation.getCurrentPosition(function(position) {
                        initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                        var infowindow = new google.maps.InfoWindow({
                            map: map,
                            position: initialLocation,
                            content: "您当前的位置: \n" + initialLocation.toString()
                        });
                        map.setCenter(initialLocation);
                    }, function() {
                        //handleNoGeolocation(browserSupportFlag, map);
                        map.setCenter(initialLocation);
                        var infowindow = new google.maps.InfoWindow({
                            map: map,
                            position: initialLocation,
                            content: "未能获取您的位置：您拒绝了我们的好意……"
                        });
                    });
              } else {
                    browserSupportFlag = false;
                    //this.handleNoGeolocation(browserSupportFlag, map);
                    map.setCenter(initialLocation);
                    var infowindow = new google.maps.InfoWindow({
                            map: map,
                            position: initialLocation,
                            content: "您的浏览器不支持地理位置API……难道你在用IE?"
                        });
              }
              });
              return mapContainer;
            },

        _createMainWindow : function(title, map, minWidth, minHeight)
            {    
              //var container = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
              //container.add(controlPanel);
              //container.add(map, {flex:1});

              var window=new eyeos.ui.Window(this, tr(title));
              window.setLayout(new qx.ui.layout.Grow());
              window.set({
                minWidth:minWidth,
                minHeight:minHeight,
                contentPadding:5
              });
              
              window.add(map);
              window.open();
              return window;
            },
            
            /**
            *This method handles Geolocation error base on \
            *the the value of errorFlag.
            *    errorFlag = true : Geolocation is supported by \
            *the browser but failed to invoke. Maybe the user \
            *cancelled it.
            *    errorFlag = false : The browser doesn't support \
            *Geolocation.
            */
            handleNoGeolocation : function(errorFlag, map) {
                var initialLocation;
            if (errorFlag == true) {
                alert("获取Geolocation服务失败");
                initialLocation = new google.maps.LatLng(24.82621106522609,102.84659982045464);
            } else {
                alert("浏览器不支持Geolocation. 地图将定位到云南大学呈贡校区");
                initialLocation = new google.maps.LatLng(24.82621106522609,102.84659982045464);
            }
                map.setCenter(initialLocation);
            }
    }
});


