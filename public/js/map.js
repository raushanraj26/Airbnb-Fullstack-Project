
//  mapToken show.ejs se value le rhe hai (line-14)
//basically show ejs iss file ko access kr rha hai 
      mapboxgl.accessToken = mapToken; 
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            center:listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
            zoom: 9 // starting zoom
        });
console.log(coordinates);
//add a marker,reference->https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/

//  Create a default Marker and add it to the map

// console.log(coordinates);  //show.ejs ke line 16 se aa rha hai coordinates ki value
 const marker = new mapboxgl.Marker({ color: 'red' })
 .setLngLat(listing.geometry.coordinates)  //Listing.geometry.coordinates
 .addTo(map);